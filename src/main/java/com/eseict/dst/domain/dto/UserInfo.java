package com.eseict.dst.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfo {
    private String userId;
    private String userLoginId;
    private String userName;
    private String cpNo;
    private String email;
    private String departmentId;
    private String departmentName;
    private String encryptKey;
}
