package com.eseict.dst.repository.xroshot;

import com.eseict.dst.domain.entity.xroshot.TtbSms;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.Map;

@Repository
public class SmsEm {

    private static final Logger LOGGER = LoggerFactory.getLogger(SmsEm.class);

    @PersistenceContext(unitName = "xroshotEntityManager")
    private EntityManager em;

    @Transactional(value = "xroshotTransactionManager")
    public boolean insertSendMsg(Map<String, String> paramMap) {
        boolean result = false;

        String rcvMn = paramMap.getOrDefault("rcvMn", "");
        String sndMn = paramMap.getOrDefault("sndMn", "");
        String msgCntn = paramMap.getOrDefault("msgCntn", "");

        try {
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.SECOND, 30);
            Date date = new Date(calendar.getTimeInMillis());
            String sndDtm = new SimpleDateFormat("yyyyMMddHHmmss", Locale.getDefault()).format(date);
            TtbSms sms = new TtbSms(sndMn, rcvMn, sndDtm, msgCntn, "N");
            LOGGER.info("sms:{}", sms);

            em.persist(sms);
            result = true;
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
        return result;
    }
}
