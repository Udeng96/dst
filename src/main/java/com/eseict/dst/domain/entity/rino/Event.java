package com.eseict.dst.domain.entity.rino;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * statOutbHist View
 * 좌표나... 각종 상위 테이블의 명칭 가져오는게 번거로워서 만들었습니다.
 *
 * @name Event
 * @author ese
 * @since 2021-06
 */
@Entity
@Table(name = "vw_event", schema = "rino_ioc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Event {

    @Id
    @Column(name = "STAT_EVET_OUTB_SEQN")
    private String statEvetOutbSeqn;

    @Column(name = "EVET_GB_CD")
    private String evetGbCd;

    @Column(name = "OUTB_DTM")
    private String outbDtm;

    @Column(name = "OUTB_MAIN_GB")
    private String outbMainGb;

    @Column(name = "OUTB_PLAC")
    private String outbPlac;

    @Column(name = "PROC_ST")
    private String procSt;

    @Column(name = "STAT_EVET_CD")
    private String statEvetCd;

    @Column(name = "STAT_EVET_CNTN")
    private String statEvetCntn;

    @Column(name = "STAT_EVET_GD_CD")
    private String statEvetGdCd;

    @Column(name = "SVC_THEME_CD")
    private String svcThemeCd;

    @Column(name = "U_SVC_OUTB_ID")
    private String uSvcOutbId;

    @Column(name = "UNIT_SVC_CD")
    private String unitSvcCd;

    @Column(name = "ZN_CD")
    private String zoneId;

    @Column(name = "X_CRDNT")
    private String x;

    @Column(name = "Y_CRDNT")
    private String y;

    @Column(name = "STAT_EVET_NM")
    private String statEvetNm;

    @Column(name = "SVC_THEME_NM")
    private String svcThemeNm;

    @Column(name = "ZN_NM")
    private String znNm;
}
