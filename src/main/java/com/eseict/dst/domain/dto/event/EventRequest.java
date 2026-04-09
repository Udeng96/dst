package com.eseict.dst.domain.dto.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {
    private String clientCd;
    private String siteCd;
    private String uSvcOutbId;
    private String svcEvetCd;
    private String statEvetNm;
    private String procSt;
    private String x;
    private String y;
    private String outbPosNm;
    private String statEvetCntn;
    private String statEvetOutbDtm;
    private String statEvetClrDtm;
    private String adCd;
    private String svcThemeCd;
    private String svcThemeNm;
    private String unitSvcCd;
    private String evetGbCd;
    private String statEvetCd;
    private String statEvetGdCd;

    public static final String SVC_THEME_CD_CROSS = "CSW";
    public static final String SVC_THEME_CD_DISASTER = "DSS";

    public static final String SVC_EVET_CD_SPEEDING = "1";
    public static final String SVC_EVET_CD_CROSSING = "2";
    public static final String SVC_EVET_CD_DISASTER = "3";
    public static final String SVC_EVET_CD_TEMPOARAY = "4";
}
