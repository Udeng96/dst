package com.eseict.dst.domain.dto.oms;

import com.eseict.dst.repository.rino.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserFilteredImpl implements UserRepository.UserFiltered {
    private String userId;
    private String userLoginId;
    private String userName;
    private String cpNo;
    private String email;
    private String departmentId;
    private String departmentName;
    private String encryptKey;
}
