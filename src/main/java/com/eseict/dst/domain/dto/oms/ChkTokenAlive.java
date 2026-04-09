package com.eseict.dst.domain.dto.oms;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChkTokenAlive {
    private String redirectUrl;
    private String expiredTime;
    private String userName;
    private String clientCd;
    private String siteCd;
}
