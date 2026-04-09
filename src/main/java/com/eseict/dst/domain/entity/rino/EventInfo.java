package com.eseict.dst.domain.entity.rino;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "vw_ioc_evet_gd_info", schema = "rino_ioc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventInfo {

    @Column(name = "SVC_THEME_CD")
    private String svcThemeCd;

    @Column(name = "UNIT_SVC_CD")
    private String unitSvcCd;

    @Column(name = "evet_cd")
    private String statEvetCd;

    @Column(name = "EVET_GB_CD")
    private String evetGbCd;

    @Column(name = "evet_nm")
    private String statEvetNm;

    @Column(name = "SVC_THEME_NM")
    private String svcThemeNm;

    @Column(name = "evet_gd_cd")
    private String evetGdCd;

    @Column(name = "evet_gd_nm")
    private String evetGdNm;

    @Id
    @Column(name = "EVET_ID")
    private String evetId;
}
