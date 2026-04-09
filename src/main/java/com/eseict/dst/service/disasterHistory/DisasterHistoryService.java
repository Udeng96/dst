package com.eseict.dst.service.disasterHistory;

import com.eseict.common.core.unique.IdGenerator;
import com.eseict.dst.constants.DstConstants;
import com.eseict.dst.domain.dto.dst.Receiver;
import com.eseict.dst.domain.entity.dst.DisasterHistory;
import com.eseict.dst.repository.dst.DisasterHistoryRepository;
import com.eseict.dst.service.sms.SmsService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.annotations.Proxy;
import org.mindrot.jbcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 재난이력 핵심 CRUD(생성·조회·삭제)와 비밀번호 처리를 담당한다.
 * 파일·CCTV·비디오·SMS 책임은 각 전용 서비스로 위임한다.
 */
@Service
@Proxy(lazy = false)
public class DisasterHistoryService {

    private static final Logger LOGGER = LoggerFactory.getLogger(DisasterHistoryService.class);

    private final DisasterHistoryRepository disasterHistoryRepository;
    private final SmsService smsService;

    @Value("${dst.external-uri}")
    private String externalUri;

    public DisasterHistoryService(
        DisasterHistoryRepository disasterHistoryRepository,
        SmsService smsService) {
        this.disasterHistoryRepository = disasterHistoryRepository;
        this.smsService = smsService;
    }

    // 재난 상황 전파 내역 목록 조회
    public List<DisasterHistory> getDisasterHistories(String statEvetOutbSeqn) {
        return disasterHistoryRepository.findAllByStatEvetOutbSeqn(statEvetOutbSeqn);
    }

    public boolean checkTime(String input) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
        LocalDateTime inputTime = LocalDateTime.parse(input, formatter);
        return !inputTime.isAfter(LocalDateTime.now());
    }

    // 재난 상황 전파 내역 단건 조회
    public DisasterHistory getDisasterHistory(String disasterHistoryId) {
        return disasterHistoryRepository.findById(disasterHistoryId)
            .orElseThrow(() -> new IllegalArgumentException(
                "DisasterHistory not found: " + disasterHistoryId));
    }

    // 재난 상황 전파 내역 등록
    public DisasterHistory saveDisasterHistory(DisasterHistory disasterHistory) {
        try {
            LocalDateTime now = LocalDateTime.now();
            String dateString = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            String disasterHistoryId = "__" + IdGenerator.getUUID64() + "__";

            disasterHistory.setDisasterHistoryId(disasterHistoryId);
            disasterHistory.setRegDate(dateString);

            int type = disasterHistory.getType();
            if (type == DstConstants.DisasterHistoryType.SMS.getCode() ||
                type == DstConstants.DisasterHistoryType.SHARE.getCode()) {

                if (disasterHistory.getTransferTarget() == null) {
                    throw new IllegalArgumentException("transferTarget is not exist");
                }

                ObjectMapper mapper = new ObjectMapper();
                List<Receiver> receivers = mapper.readValue(
                    disasterHistory.getTransferTarget(),
                    new TypeReference<List<Receiver>>() {}
                );

                String msgCntn;
                if (type == DstConstants.DisasterHistoryType.SMS.getCode()) {
                    msgCntn = disasterHistory.getContent();
                } else {
                    msgCntn = disasterHistory.getContent() + "\n\n" +
                        externalUri + "/share/" + disasterHistoryId;
                }

                smsService.sendToReceivers(receivers, msgCntn);
            }

            String pwd = disasterHistory.getPwd();
            if (pwd != null && !pwd.isEmpty()) {
                LOGGER.info("disasterHistory.pwd:{}", pwd);
                disasterHistory.setPwd(encodePassword(pwd));
            }

            LOGGER.info("disasterHistory:{}", disasterHistory);
            return disasterHistoryRepository.saveAndFlush(disasterHistory);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // 재난 상황 전파 내역 삭제
    public void deleteDisasterHistory(DisasterHistory disasterHistory) {
        disasterHistoryRepository.delete(disasterHistory);
    }

    public boolean chkPwd(String pwd, String disasterHistoryId) {
        DisasterHistory disasterHistory = disasterHistoryRepository.findById(disasterHistoryId)
            .orElseThrow(() -> new IllegalArgumentException(
                "DisasterHistory not found: " + disasterHistoryId));
        return verifyPassword(pwd, disasterHistory.getPwd());
    }

    public DisasterHistory findFirstByOrderByRegDateDesc() {
        return disasterHistoryRepository.findFirstByOrderByRegDateDesc();
    }

    // 암호 인코딩
    public String encodePassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
    }

    // 입력한 암호 확인
    public boolean verifyPassword(String inputPassword, String storedHash) {
        return BCrypt.checkpw(inputPassword, storedHash);
    }
}
