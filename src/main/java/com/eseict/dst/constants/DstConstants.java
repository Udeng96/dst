package com.eseict.dst.constants;

public class DstConstants {

    private DstConstants() {}

    public static final String PROD_APP_JSON_UTF8 = "application/json; charset=UTF-8;";
    public static final String TOKEN_KEY = "__TOKEN__";

    public static final String CLIENT_CD = "000";
    public static final String SITE_CD = "000";
    public static final String ZN_CD = "ZZZ";
    public static final String SVC_THEME_CD = "SSS";
    public static final String UNIT_SVC_CD = "UUU";
    public static final String EVET_GB_CD = "E";
    public static final String STAT_EVET_CD = "01";
    public static final String STAT_EVET_GD_CD = "99";

    public static class RESULT {
        private RESULT() {}

        public static final String SUCCESS_CODE = "SUCCESS";
        public static final String SUCCESS_STATUS = "200";
        public static final String OMS_SUCCESS_CODE = "OK";
        public static final String FAIL_CODE = "FAIL";

        public static final String SUCCESS_MESSAGE = "정상 처리되었습니다.";
        public static final String FAIL_MESSAGE = "불러온 데이터가 없거나 정상적인 호출이 되지 않습니다.";
        public static final String FAIL_NO_AUTH = "권한이 없거나, 접속정보가 올바르지않습니다.";
    }

    public static class DATE {
        private DATE() {}

        public static final String FORMAT_4 = "yyyy";
        public static final String FORMAT_6 = "yyyyMM";
        public static final String FORMAT_8 = "yyyyMMdd";
        public static final String FORMAT_10 = "yyyyMMddHH";
        public static final String FORMAT_12 = "yyyyMMddHHmm";
        public static final String FORMAT_14 = "yyyyMMddHHmmss";
        public static final String MILLISECOND_ONE_FORMAT = "yyyy-MM-dd HH:mm:ss";
    }

    public enum DisasterHistoryType {
        TRANSFER(0, "전파"),
        SHARE(1, "공유"),
        SMS(2, "SMS"),
        REPORT(3, "조치내역");

        private final int code;
        private final String value;

        DisasterHistoryType(int code, String value) {
            this.code = code;
            this.value = value;
        }

        public int getCode() { return code; }
        public String getValue() { return value; }
    }
}
