package com.eseict.dst.domain.entity.rino;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "vw_ioc_evet_gd_info_with_zn", schema = "rino_ioc")
@Getter
@Setter
public class VwIocEvetGdInfoWithZn {

    @Basic
    @Column(name = "zn_cd", nullable = true)
    private String znCd;

    @Basic
    @Column(name = "zn_nm", nullable = true)
    private String znNm;

    @Basic
    @Column(name = "svc_theme_cd", nullable = true)
    private String svcThemeCd;

    @Basic
    @Column(name = "svc_theme_nm", nullable = true)
    private String svcThemeNm;

    @Basic
    @Column(name = "unit_svc_cd", nullable = true)
    private String unitSvcCd;

    @Basic
    @Column(name = "unit_svc_nm", nullable = true)
    private String unitSvcNm;

    @Basic
    @Column(name = "evet_gb_cd", nullable = true)
    private String evetGbCd;

    @Basic
    @Column(name = "evet_cd", nullable = true)
    private String evetCd;

    @Id
    @Basic
    @Column(name = "evet_id", nullable = true)
    private String evetId;

    @Basic
    @Column(name = "evet_nm", nullable = true)
    private String evetNm;

    @Basic
    @Column(name = "evet_gd_cd", nullable = true)
    private String evetGdCd;

    @Basic
    @Column(name = "evet_gd_nm", nullable = true)
    private String evetGdNm;

    @Override
    public String toString() {
        return "Entity of type: " + getClass().getName() + " ( " +
            "znCd = " + znCd + " " +
            "znNm = " + znNm + " " +
            "svcThemeCd = " + svcThemeCd + " " +
            "svcThemeNm = " + svcThemeNm + " " +
            "unitSvcCd = " + unitSvcCd + " " +
            "unitSvcNm = " + unitSvcNm + " " +
            "evetGbCd = " + evetGbCd + " " +
            "evetCd = " + evetCd + " " +
            "evetId = " + evetId + " " +
            "evetNm = " + evetNm + " " +
            "evetGdCd = " + evetGdCd + " " +
            "evetGdNm = " + evetGdNm + " " +
            ")";
    }

    @Override
    public int hashCode() {
        return 42;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VwIocEvetGdInfoWithZn that = (VwIocEvetGdInfoWithZn) o;
        return Objects.equals(znCd, that.znCd)
            && Objects.equals(znNm, that.znNm)
            && Objects.equals(svcThemeCd, that.svcThemeCd)
            && Objects.equals(svcThemeNm, that.svcThemeNm)
            && Objects.equals(unitSvcCd, that.unitSvcCd)
            && Objects.equals(unitSvcNm, that.unitSvcNm)
            && Objects.equals(evetGbCd, that.evetGbCd)
            && Objects.equals(evetCd, that.evetCd)
            && Objects.equals(evetId, that.evetId)
            && Objects.equals(evetNm, that.evetNm)
            && Objects.equals(evetGdCd, that.evetGdCd)
            && Objects.equals(evetGdNm, that.evetGdNm);
    }
}
