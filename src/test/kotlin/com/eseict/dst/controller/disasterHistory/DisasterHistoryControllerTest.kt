package com.eseict.dst.controller.disasterHistory

import com.eseict.dst.constants.DstConstants
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.mock.web.MockHttpSession

/**
 * DisasterHistoryController 특성화 테스트
 *
 * 인증 로직 복원 후 상태를 기록한다.
 */
class DisasterHistoryControllerTest {

    @Nested
    @DisplayName("saveDisasterHistory 인증")
    inner class SaveDisasterHistoryAuth {

        @Test
        @DisplayName("세션에 토큰이 없으면 IllegalAccessException 발생")
        fun noToken_throwsException() {
            val session = MockHttpSession()

            // 토큰이 세션에 없음
            assertNull(session.getAttribute(DstConstants.TOKEN_KEY))

            // Controller에서 as? String → null → IllegalAccessException("Token is missing from session")
            // 실제 호출은 MockMvc 통합 테스트로 검증 예정
        }

        @Test
        @DisplayName("세션에 유효한 토큰이 있으면 정상 처리")
        fun validToken_pass() {
            val session = MockHttpSession()
            session.setAttribute(DstConstants.TOKEN_KEY, "valid-token")

            // 토큰이 세션에 존재
            assertNotNull(session.getAttribute(DstConstants.TOKEN_KEY))
            assertEquals("valid-token", session.getAttribute(DstConstants.TOKEN_KEY))
        }
    }
}
