package com.eseict.dst.domain.dto.video;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class VideoInfo {
    private String id;    // mobile : id && cctv : deviceId
    private String nm;    // mobile : userDept-userNm && cctv : cctvNm(주소)
    private String type;  // mobile : mobile & cctv : cctv
    private String url;
    private BigDecimal lat = BigDecimal.ZERO;
    private BigDecimal lng = BigDecimal.ZERO;

    public VideoInfo(String id, String nm, String type, String url, double lat, double lng) {
        this.id = id;
        this.nm = nm;
        this.type = type;
        this.url = url;
        this.lat = BigDecimal.valueOf(lat);
        this.lng = BigDecimal.valueOf(lng);
    }
}
