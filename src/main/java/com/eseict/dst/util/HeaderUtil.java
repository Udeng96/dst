package com.eseict.dst.util;

import com.eseict.common.base.ByteSupport;
import com.eseict.common.base.StringUtil;
import com.eseict.common.base.StringUtilException;
import com.eseict.common.log.LoggerManager;
import org.slf4j.Logger;

import java.io.UnsupportedEncodingException;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

public class HeaderUtil {

    private static final Logger logger = LoggerManager.getLogger(HeaderUtil.class);

    /*헤더 정보*/
    /** 헤더 타입 코드. */
    public static final int HEDR_TYP_CD = 0;

    /** 송신 시스템 코드. */
    public static final int SND_SYS_CD = 1;

    /** 메시지 교환 패턴. */
    public static final int MSG_EXCH_PATRN = 2;

    /** 데이터부 길이. */
    public static final int BODY_LEN = 3;

    /** 메시지 타입 코드. */
    public static final int MSG_TYP_CD = 4;

    /** 트레이스 아이디. */
    public static final int TRCE_ID = 5;

    /** 전송 시간. */
    public static final int SND_DTM = 6;

    /** The header item len ar. */
    private static final int[] headerItemLenAr = {2, 9, 1, 4, 3, 24, 17};

    /** The header item pos ar. */
    private static final int[] headerItemStartPosAr = {0, 2, 11, 12, 16, 19, 43};

    /** The header item end pos ar. */
    private static final int[] headerItemEndPosAr = {2, 11, 12, 16, 19, 43, 60};

    private HeaderUtil() {}

    /**
     * Gets the header item length.
     *
     * @param fieldId the field id
     * @return the header item length
     */
    public static int getHeaderItemLength(int fieldId) {
        return headerItemLenAr[fieldId];
    }

    public static int getHeaderTotalLen() {
        return Arrays.stream(headerItemLenAr).sum();
    }

    /**
     * Gets the header item pos.
     *
     * @param fieldId the field id
     * @return the header item pos
     */
    public static int getHeaderItemStartPos(int fieldId) {
        return headerItemStartPosAr[fieldId];
    }

    /**
     * Gets the header item end pos.
     *
     * @param fieldId the field id
     * @return the header item end pos
     */
    public static int getHeaderItemEndPos(int fieldId) {
        return headerItemEndPosAr[fieldId];
    }

    /**
     * 송신 헤더 생성 - statEvet
     * @param headerTypCd - 헤더 타입 코드
     * @param sndSysCd - 송신 시스템 코드
     * @param msgTypCd - 메시지 타입 코드
     * @param mepTypCd - 메시지 교환 방식 코드
     * @param trceId -
     * @param bodyByteArrayLength - 바디 길이
     * @return byte[] header - 헤더
     */
    public static byte[] makeHeader(
            String headerTypCd,
            String sndSysCd,
            String msgTypCd,
            String mepTypCd,
            String trceId,
            int bodyByteArrayLength) {
        byte[] headerByte = null;
        try {
            // 임시 바디길이 byte 크기
            String tempBodyLen = "0000";
            // 시스템 코드가 3자리일 경우 9자리 변경
            String sndSysCdSetPadded = StringUtil.setPad(sndSysCd, 9, ' ', StringUtil.PAD_LEFT);
            // TRCE_ID 24자리로 변경
            String trceIdSetPadded = StringUtil.setPad(trceId, 24, ' ', StringUtil.PAD_RIGHT);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
            String sndDtm = LocalDateTime.now().format(formatter);
            StringBuilder header = new StringBuilder();
            header.append(headerTypCd);
            header.append(sndSysCdSetPadded);
            header.append(mepTypCd);
            header.append(tempBodyLen);
            header.append(msgTypCd);
            header.append(trceIdSetPadded);
            header.append(sndDtm);
            headerByte = header.toString().getBytes(StandardCharsets.UTF_8);

            // 바디 길이 byte 변경
            byte[] bodyLengthByte = ByteSupport.intToByteArray(bodyByteArrayLength, ByteOrder.LITTLE_ENDIAN);
            System.arraycopy(bodyLengthByte, 0, headerByte, 12, bodyLengthByte.length);
            /* 바디 길이 변경 로직 end */
        } catch (StringUtilException e) {
            logger.error(e.getMessage(), e);
        }
        return headerByte;
    }

    public static byte[] makeAckHeader(byte[] header, String sndSysCd, String mep) throws UnsupportedEncodingException {
        // header 클론 생성
        byte[] ackHeader = header.clone();
        // 송신 수신 코드
        byte[] sndSysCdByte = null;
        try {
            sndSysCdByte = StringUtil.setPad(
                sndSysCd,
                getHeaderItemLength(SND_SYS_CD),
                ' ',
                StringUtil.PAD_LEFT
            ).getBytes("UTF-8");
        } catch (StringUtilException e) {
            logger.error(e.getMessage(), e);
        }
        // 메시지 교환 패턴
        byte[] mepByte = mep.getBytes("UTF-8");
        // 바디 길이 (0 으로 지정)
        byte[] bodyLenByte = ByteSupport.intToByteArray(0, ByteOrder.BIG_ENDIAN);
        System.arraycopy(
            sndSysCdByte, 0, ackHeader,
            getHeaderItemStartPos(SND_SYS_CD),
            getHeaderItemLength(SND_SYS_CD)
        );
        System.arraycopy(
            mepByte, 0, ackHeader,
            getHeaderItemStartPos(MSG_EXCH_PATRN),
            getHeaderItemLength(MSG_EXCH_PATRN)
        );
        System.arraycopy(
            bodyLenByte, 0, ackHeader,
            getHeaderItemStartPos(BODY_LEN),
            getHeaderItemLength(BODY_LEN)
        );
        return ackHeader;
    }
}
