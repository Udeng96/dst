package com.eseict.dst.service.user;

import com.eseict.common.net.http.HttpConnection;
import com.eseict.common.net.http.HttpConnectionException;
import com.eseict.common.net.http.responseHandler.JsonToMapHandler;
import com.eseict.dst.config.properties.ApiProperties;
import com.eseict.dst.config.properties.CryptProperties;
import com.eseict.dst.domain.dto.UserInfo;
import com.eseict.dst.domain.dto.oms.ChkTokenAlive;
import com.eseict.dst.domain.dto.oms.LoginInfo;
import com.eseict.dst.domain.dto.oms.OmsResponse;
import com.eseict.dst.domain.dto.oms.UserFilteredImpl;
import com.eseict.dst.repository.rino.UserRepository;
import com.eseict.dst.util.HttpHelper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.kittinunf.fuel.core.FuelError;
import com.github.kittinunf.fuel.core.Request;
import com.github.kittinunf.fuel.core.Response;
import com.github.kittinunf.result.Result;
import com.google.common.collect.Maps;
import com.google.gson.Gson;
import kotlin.Pair;
import kotlin.Triple;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final ApiProperties apiProperties;
    private final UserRepository userRepository;
    private final CryptProperties cryptProperties;

    private ApiProperties.Api omsApi;
    private String systemKey;
    private String secret;

    public UserService(
        ApiProperties apiProperties,
        UserRepository userRepository,
        CryptProperties cryptProperties) {
        this.apiProperties = apiProperties;
        this.userRepository = userRepository;
        this.cryptProperties = cryptProperties;
    }

    @PostConstruct
    public void init() {
        this.omsApi = apiProperties.getApi("oms");
        this.systemKey = omsApi.getHeaders().get("systemKey");
        this.secret = omsApi.getHeaders().get("secret");
    }

    /**
     * 전체 사용자 목록을 조회하고 복호화한다.
     * 복호화 API를 사용자 수만큼 호출하는 N+1 문제를 해결하기 위해
     * 전체 사용자를 한 번의 배치 호출로 복호화한다.
     */
    public List<UserInfo> getUsers() {
        List<UserRepository.UserFiltered> userList = userRepository.findAllUserFilteredBy();
        if (userList.isEmpty()) {
            return new ArrayList<>();
        }

        Gson gson = new Gson();
        Map<String, Object> reqHeader = getReqHeaderMap();

        // 배치 복호화: 모든 사용자 데이터를 한 번에 전송
        List<Map<String, String>> cryptDataMapList = userList.stream().map(user -> {
            Map<String, String> crypteDataMap = Maps.newHashMap();
            crypteDataMap.put("userName", user.getUserName());
            crypteDataMap.put("cpNo", user.getCpNo());
            crypteDataMap.put("encryptKey", user.getEncryptKey());
            return crypteDataMap;
        }).collect(Collectors.toList());

        Map<String, Object> reqParam = new HashMap<>();
        reqParam.put("data", gson.toJson(cryptDataMapList));
        reqParam.put("encType", cryptProperties.getCrypt());

        List<Map<String, String>> decryptedList = null;
        try {
            JsonToMapHandler handler = new JsonToMapHandler();
            HttpConnection httpConn = new HttpConnection(handler);
            @SuppressWarnings("unchecked")
            Map<String, Object> resultMap = (Map<String, Object>) httpConn.doPost(
                cryptProperties.getApi().getAddress() + cryptProperties.getDecrypt(),
                reqHeader,
                reqParam
            );
            decryptedList = gson.fromJson(
                (String) resultMap.get("data"),
                new com.google.gson.reflect.TypeToken<List<Map<String, String>>>() {}.getType()
            );
        } catch (HttpConnectionException e) {
            logger.error("[getUsers] 복호화 배치 호출 실패: {}", e.getMessage(), e);
        }

        final List<Map<String, String>> finalDecryptedList = decryptedList;
        List<UserInfo> result = new ArrayList<>();
        for (int i = 0; i < userList.size(); i++) {
            UserRepository.UserFiltered user = userList.get(i);
            UserInfo userInfo = new UserInfo(
                user.getUserId(), user.getUserLoginId(), user.getUserName(),
                user.getCpNo(), user.getEmail(), user.getDepartmentId(),
                user.getDepartmentName(), user.getEncryptKey()
            );

            if (finalDecryptedList != null && i < finalDecryptedList.size()) {
                try {
                    Map<String, String> decrypted = finalDecryptedList.get(i);
                    userInfo.setEncryptKey(decrypted.get("encryptKey"));
                    userInfo.setUserName(decrypted.get("userName"));
                    userInfo.setCpNo(decrypted.get("cpNo"));
                } catch (UnsupportedOperationException e) {
                    logger.error("user {}", user.toString());
                    logger.error(e.getMessage(), e);
                }
            }
            result.add(userInfo);
        }

        return result;
    }

    public UserRepository.UserFiltered getUserByUserId(String userId) {
        return userRepository.findUserFilteredByUserId(userId);
    }

    /**
     * OMS 를 통해 토큰이 유효한지 검사한다.
     */
    public Pair<Boolean, String> validateToken(String token) {
        List<Pair<String, Object>> params = new ArrayList<>();
        params.add(new Pair<>("token", token));

        Map<String, Object> header = new HashMap<>();
        header.put("systemKey", systemKey);
        header.put("secret", secret);

        Triple<Request, Response, Result<String, FuelError>> triple =
            HttpHelper.httpPost(omsApi.getUrl() + omsApi.getSubUrls().get("chkTokenAlive"), params, header);

        logger.trace("[validateToken] request : {}", triple.getFirst());
        logger.trace("[validateToken] response : {}", triple.getSecond());
        logger.debug("[validateToken] result : {}", triple.getThird());

        try {
            ObjectMapper mapper = new ObjectMapper();
            String resultStr = triple.getThird().component1();
            OmsResponse<ChkTokenAlive> tokenInfo = mapper.readValue(
                resultStr,
                new TypeReference<OmsResponse<ChkTokenAlive>>() {}
            );
            return new Pair<>("OK".equals(tokenInfo.getResult()), tokenInfo.getMessage());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return new Pair<>(false, e.getMessage());
        }
    }

    /**
     * OMS 를 통해 사용자 정보를 가져온다.
     */
    public UserRepository.UserFiltered getUserByToken(String token) {
        List<Pair<String, Object>> params = new ArrayList<>();
        params.add(new Pair<>("token", token));

        Map<String, Object> header = new HashMap<>();
        header.put("systemKey", systemKey);
        header.put("secret", secret);

        Triple<Request, Response, Result<String, FuelError>> triple =
            HttpHelper.httpPost(omsApi.getUrl() + omsApi.getSubUrls().get("user"), params, header);

        logger.info("[getUserByToken] request : {}", triple.getFirst());
        logger.info("[getUserByToken] response : {}", triple.getSecond());
        logger.info("[getUserByToken] result : {}", triple.getThird());

        try {
            ObjectMapper mapper = new ObjectMapper();
            String resultStr = triple.getThird().component1();
            OmsResponse<LoginInfo> loginInfo = mapper.readValue(
                resultStr,
                new TypeReference<OmsResponse<LoginInfo>>() {}
            );

            logger.info("loginInfo {}", loginInfo.toString());

            if ("OK".equals(loginInfo.getResult()) && loginInfo.getData().getUserId() != null) {
                UserRepository.UserFiltered findUser =
                    userRepository.findUserFilteredByUserId(loginInfo.getData().getUserId());

                logger.info("find {}", findUser);

                UserFilteredImpl impl = new UserFilteredImpl(
                    findUser.getUserId(), findUser.getUserLoginId(), findUser.getUserName(),
                    findUser.getCpNo(), findUser.getEmail(), findUser.getDepartmentId(),
                    findUser.getDepartmentName(), findUser.getEncryptKey()
                );
                String mobile = loginInfo.getData().getMobile();
                String userName = loginInfo.getData().getUserName();
                impl.setCpNo(mobile != null ? mobile : "");
                impl.setUserName(userName != null ? userName : "");
                return impl;
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return null;
    }

    public Map<String, Object> getReqHeaderMap() {
        Map<String, Object> reqHeader = Maps.newHashMap();
        reqHeader.put("systemKey", cryptProperties.getSystem().getKey());
        reqHeader.put("secret", cryptProperties.getSystem().getSecret());
        return reqHeader;
    }
}
