package com.eseict.dst.config.interceptor;

import com.eseict.dst.constants.DstConstants;
import com.eseict.dst.service.user.UserService;
import kotlin.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * TokenInterceptor
 * 사용자가 파라미터를 통해 토큰을 넘겼을 때,
 * 세션속에 토큰을 저장한다.
 *
 * 세션에 저장한 토큰은 서버로 요청하는 모든 요청에 사용될 수 있다.
 */
public class TokenInterceptor implements HandlerInterceptor {

    private static final Logger logger = LoggerFactory.getLogger(TokenInterceptor.class);

    @Autowired
    private UserService userService;

    @Value("${dst.auth.dev-mode:false}")
    private boolean devMode;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();

        // 개발 모드: application.yml의 dst.auth.dev-mode=true 일 때만 인증 우회
        if (devMode) {
            session.setAttribute(DstConstants.TOKEN_KEY, "development");
            return true;
        }

        String tokenFromRequest = request.getParameter("token");
        String tokenFromSession = (String) session.getAttribute(DstConstants.TOKEN_KEY);

        // 토큰 우선순위는 요청이 세션보다 높다.
        // 우선 요청에 토큰이 있는지 확인하여 값이 있으면 세션에 저장 후 통과 시킨다.
        String token;
        if (tokenFromRequest != null) {
            session.setAttribute(DstConstants.TOKEN_KEY, tokenFromRequest);
            token = tokenFromRequest;
        } else if (tokenFromSession != null) {
            // 만약 요청의 토큰이 없을 경우 세션의 토큰을 통해 정상 접근 여부를 판단한다.
            token = tokenFromSession;
        } else {
            // 세션의 토큰조차 없을 경우 비정상적인 요청으로 취급한다.
            response.sendError(HttpStatus.BAD_REQUEST.value(), "Token is not exist.");
            return false;
        }

        // 정상적인 요청인 경우 토큰이 항상 존재한다.
        Pair<Boolean, String> validateResult = userService.validateToken(token);
        if (!validateResult.getFirst()) {
            // 검증되지 않은 토큰일 경우 권한 없는 요청으로 취급한다.
            logger.warn("Token validate fail : {}", validateResult.getSecond());
            response.sendError(HttpStatus.UNAUTHORIZED.value());
            return false;
        }

        return true;
    }
}
