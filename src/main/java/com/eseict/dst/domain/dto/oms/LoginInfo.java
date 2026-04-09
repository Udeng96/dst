package com.eseict.dst.domain.dto.oms;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginInfo {
    private String token;
    private String userId;
    private String userName;
    private String loginId;
    private String mobile;
    private String email;
    private String userGd;
    private String clientCd;
    private String siteCd;
}
