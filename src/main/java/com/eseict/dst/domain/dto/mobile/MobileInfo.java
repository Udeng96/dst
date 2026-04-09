package com.eseict.dst.domain.dto.mobile;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class MobileInfo {
    private String id;       // phone Number
    private Integer seq;     // table seq
    private String userId;   // user Id
    private String userNm;   // user Name
    private String userDept; // user Departure Name
    private String userDtm;  // start or end Date / format = yyyy-MM-DD hh:mm:ss
    private BigDecimal lat = BigDecimal.ZERO;
    private BigDecimal lng = BigDecimal.ZERO;
    private Integer mbChk = 3; // 1: Start App, 2: Start Shoot 3. Keep Shoot 4. End Shoot 5. End App
    private String mbUrl;    // rtsp
    private String type = "mobile";

    public MobileInfo(String id, Integer seq, String userId, String userNm,
                      String userDept, String userDtm, BigDecimal lat, BigDecimal lng,
                      Integer mbChk, String mbUrl, String type) {
        this.id = id;
        this.seq = seq;
        this.userId = userId;
        this.userNm = userNm;
        this.userDept = userDept;
        this.userDtm = userDtm;
        this.lat = lat;
        this.lng = lng;
        this.mbChk = mbChk;
        this.mbUrl = mbUrl;
        this.type = type;
    }

    public MobileInfo(String id, int seq, String userId, String userNm,
                      String userDept, String userDtm, double lat, double lng,
                      int mbChk, String mbUrl, String type) {
        this(id, seq, userId, userNm, userDept, userDtm,
            BigDecimal.valueOf(lat), BigDecimal.valueOf(lng), mbChk, mbUrl, type);
    }
}
