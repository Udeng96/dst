package com.eseict.dst.domain.entity.dst;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "mon_mb_desc", schema = "eas")
@SequenceGenerator(
    name = "MON_MB_DESC_GENERATOR",
    sequenceName = "mon_mb_desc__gid_seq",
    initialValue = 1,
    allocationSize = 1
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MonMbDesc {

    @Id
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "user_nm", nullable = false)
    private String userNm;

    @Basic
    @Column(name = "user_dtm", nullable = false)
    private String userDtm;

    @Basic
    @Column(name = "lat", nullable = false)
    private Double lat;

    @Basic
    @Column(name = "lon", nullable = false)
    private Double lon;

    @Basic
    @Column(name = "_gid", nullable = false, columnDefinition = "serial", insertable = false)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "MON_MB_DESC_GENERATOR")
    private Integer gid;

    @Basic
    @Column(name = "mobile_chk", nullable = true)
    private Integer mobileChk;

    @Basic
    @Column(name = "mb_url", nullable = true)
    private String mbUrl;

    @Basic
    @Column(name = "title", nullable = true)
    private String title;

    @Basic
    @Column(name = "dpt_nm", nullable = true)
    private String dptNm;

    @Basic
    @Column(name = "mgr_no", nullable = true)
    private String mgrNo;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MonMbDesc that = (MonMbDesc) o;
        return Objects.equals(userId, that.userId)
            && Objects.equals(userDtm, that.userDtm)
            && Objects.equals(lat, that.lat)
            && Objects.equals(lon, that.lon)
            && Objects.equals(gid, that.gid)
            && Objects.equals(mobileChk, that.mobileChk)
            && Objects.equals(mbUrl, that.mbUrl)
            && Objects.equals(title, that.title);
    }

    @Override
    public int hashCode() {
        return 42;
    }

    @Override
    public String toString() {
        return super.toString();
    }
}
