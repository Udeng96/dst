package com.eseict.dst.repository.rino;

import com.eseict.dst.domain.entity.rino.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // 화면에서 필요한 정보만 제공하기 위한 필터링 Projection 입니다.
    interface UserFiltered {
        String getUserId();
        String getUserLoginId();
        String getUserName();
        String getCpNo();
        String getEmail();
        String getDepartmentId();
        String getDepartmentName();
        String getEncryptKey();

        void setUserId(String userId);
        void setUserLoginId(String userLoginId);
        void setUserName(String userName);
        void setCpNo(String cpNo);
        void setEmail(String email);
        void setDepartmentId(String departmentId);
        void setDepartmentName(String departmentName);
        void setEncryptKey(String encryptKey);
    }

    List<UserFiltered> findAllUserFilteredBy();

    UserFiltered findUserFilteredByUserId(String userId);
}
