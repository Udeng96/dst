package com.eseict.dst.domain.entity.xeus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "cctv_view", schema = "xeus")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cctv {

    @Id
    @Column(name = "MGR_NO")
    private String mgrNo;

    @Column(name = "CCTV_NM")
    private String cctvNm;

    @Column(name = "DEVICE_ID")
    private String deviceId;

    @Column(name = "CHNL_NO")
    private String chnlNo;

    @Column(name = "PAN_YN")
    private String panYn;

    @Column(name = "TILT_YN")
    private String tiltYn;

    @Column(name = "ZOOM_YN")
    private String zoomYn;

    @Column(name = "GBN_CD")
    private String gbnCd;

    @Column(name = "_ANNOX")
    private String x;

    @Column(name = "_ANNOY")
    private String y;

    @Column(name = "ANGLE")
    private String angle;

    @Column(name = "CLFY_NM")
    private String clftNm;
}
