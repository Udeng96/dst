package com.eseict.dst.service.sms;

import com.eseict.dst.domain.dto.dst.Receiver;
import com.eseict.dst.repository.xroshot.SmsEm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * SMS 발송을 담당하는 서비스.
 * 발신 번호는 application.yml sms.snd-mn 에서 주입받는다.
 */
@Service
public class SmsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SmsService.class);
    private static final Pattern PHONE_PATTERN =
        Pattern.compile("(\\d{2,3})[-](\\d{3,4})[-](\\d{4})$");

    private final SmsEm smsEm;

    @Value("${sms.snd-mn}")
    private String sndMn;

    public SmsService(SmsEm smsEm) {
        this.smsEm = smsEm;
    }

    /**
     * 수신자 목록에 동일한 메시지를 일괄 발송한다.
     *
     * @param receivers 수신자 목록
     * @param msgCntn   발송할 메시지 본문
     */
    public void sendToReceivers(List<Receiver> receivers, String msgCntn) {
        for (Receiver receiver : receivers) {
            String rcvMn = normalizePhoneNumber(receiver.getCpNo());
            Map<String, String> paramMap = new HashMap<>();
            paramMap.put("rcvMn", rcvMn);
            paramMap.put("sndMn", sndMn);
            paramMap.put("msgCntn", msgCntn);

            LOGGER.info("SMS paramMap:{}", paramMap);
            boolean insertResult = smsEm.insertSendMsg(paramMap);
            LOGGER.info("SMS insertResult:{}", insertResult);
        }
    }

    private String normalizePhoneNumber(String cpNo) {
        if (PHONE_PATTERN.matcher(cpNo).matches()) {
            return cpNo;
        }
        try {
            return cpNo.substring(0, 3) + "-" + cpNo.substring(3, 7) + "-" + cpNo.substring(7);
        } catch (Exception e) {
            return cpNo;
        }
    }
}
