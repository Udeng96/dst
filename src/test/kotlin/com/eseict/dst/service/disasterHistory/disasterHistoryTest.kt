package com.eseict.dst.service.disasterHistory

import com.eseict.dst.constants.DstConstants
import com.eseict.dst.domain.entity.dst.DisasterHistory
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@SpringBootTest(
    properties = [
        "spring.config.location=" +
                "file:\${DST_HOME}/properties/application.yml" +
                ", file:\${DST_HOME}/properties/config.yml" +
                ", file:\${DST_HOME}/properties/database.yml" +
                ", file:\${DST_HOME}/properties/api.yml"
    ]
)
class disasterHistoryTest {

    @Autowired
    private lateinit var disasterHistoryService: DisasterHistoryService

//    @Test
//    fun `saveDisasterHistory method test`(){
//        val content = "안녕하세요 오늘은 일요일입니다. 날씨가 무척 좋아서 아이들이 밖에 나가서 뛰어 놀기 좋습니다. 하지만 코로나 시국인지라 마스크착용 및 손씻기 등 방역 수칙을 꼭 준수해주세요."
//        val content79="안녕하세요 오늘은 일요일입니다. 날씨가 무척 좋아서 아이들이 밖에 나가서 뛰어 놀기 좋습니다. 하지만 코로나 시국인지라 마스크착용 및 손씻기."
//        println("content.length: ${content.length}")
//        val disasterHistory = DisasterHistory(
//            "disasterHistory_test_id","disasterHistory_test_title",
//            content, "disasterHistory_test_transferTarget",
//            "disasterHistory_test_statEvetOutbSeqn",DstConstants.DisasterHistoryType.SMS.code,LocalDateTime.now().format(
//                DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")),"disasterHistory_test_regUserId"
//            )
//        disasterHistoryService.saveDisasterHistory(disasterHistory)
//    }

}