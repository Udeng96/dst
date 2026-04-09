package com.eseict.dst.config.interceptor

import com.eseict.dst.constants.DstConstants
import com.eseict.dst.service.user.UserService
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import org.springframework.http.HttpStatus
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.test.util.ReflectionTestUtils

/**
 * TokenInterceptor 단위 테스트
 */
class TokenInterceptorTest {

    private lateinit var interceptor: TokenInterceptor
    private lateinit var userService: UserService
    private lateinit var request: MockHttpServletRequest
    private lateinit var response: MockHttpServletResponse
    private val handler = Any()

    @BeforeEach
    fun setUp() {
        interceptor = TokenInterceptor()
        userService = mock(UserService::class.java)
        ReflectionTestUtils.setField(interceptor, "userService", userService)
        ReflectionTestUtils.setField(interceptor, "devMode", false)
        request = MockHttpServletRequest()
        response = MockHttpServletResponse()
    }

    @Nested
    @DisplayName("개발 모드 (dst.auth.dev-mode=true)")
    inner class DevelopmentMode {

        @BeforeEach
        fun enableDevMode() {
            ReflectionTestUtils.setField(interceptor, "devMode", true)
        }

        @Test
        @DisplayName("devMode=true 이면 토큰 검증 없이 통과하고 세션에 development 토큰 설정")
        fun devMode_bypassAuth() {
            val result = interceptor.preHandle(request, response, handler)

            assertTrue(result)
            assertEquals("development", request.session.getAttribute(DstConstants.TOKEN_KEY))
        }
    }

    @Nested
    @DisplayName("운영 모드 (dst.auth.dev-mode=false)")
    inner class ProductionMode {

        @Test
        @DisplayName("요청 파라미터에 유효한 토큰이 있으면 통과")
        fun validTokenFromRequest_pass() {
            request.setParameter("token", "valid-token")
            `when`(userService.validateToken("valid-token"))
                .thenReturn(Pair(true, ""))

            val result = interceptor.preHandle(request, response, handler)

            assertTrue(result)
        }

        @Test
        @DisplayName("세션에 유효한 토큰이 있으면 통과")
        fun validTokenFromSession_pass() {
            request.session.setAttribute(DstConstants.TOKEN_KEY, "session-token")
            `when`(userService.validateToken("session-token"))
                .thenReturn(Pair(true, ""))

            val result = interceptor.preHandle(request, response, handler)

            assertTrue(result)
        }

        @Test
        @DisplayName("토큰이 없으면 400 에러를 보내고 요청 차단")
        fun noToken_returnFalse() {
            val result = interceptor.preHandle(request, response, handler)

            assertFalse(result)
            assertEquals(HttpStatus.BAD_REQUEST.value(), response.status)
        }

        @Test
        @DisplayName("토큰 검증 실패 시 401 에러를 보내고 요청 차단")
        fun invalidToken_returnFalse() {
            request.setParameter("token", "invalid-token")
            `when`(userService.validateToken("invalid-token"))
                .thenReturn(Pair(false, "Token expired"))

            val result = interceptor.preHandle(request, response, handler)

            assertFalse(result)
            assertEquals(HttpStatus.UNAUTHORIZED.value(), response.status)
        }

        @Test
        @DisplayName("요청 파라미터 토큰이 세션 토큰보다 우선")
        fun requestTokenTakesPriority() {
            request.session.setAttribute(DstConstants.TOKEN_KEY, "old-session-token")
            request.setParameter("token", "new-request-token")
            `when`(userService.validateToken("new-request-token"))
                .thenReturn(Pair(true, ""))

            interceptor.preHandle(request, response, handler)

            assertEquals("new-request-token", request.session.getAttribute(DstConstants.TOKEN_KEY))
        }
    }
}
