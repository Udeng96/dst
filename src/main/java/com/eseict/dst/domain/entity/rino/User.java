package com.eseict.dst.domain.entity.rino;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Formula;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * User Entity
 *
 * @name User
 * @author ese
 * @since 2021-06
 */
@Entity
@Table(name = "OMS_USER_INFO", schema = "rino_oms")
@Getter
@Setter
public class User {

    @Id
    @Column(name = "USER_ID", length = 22, nullable = false, unique = true)
    private String userId = "";

    @Column(name = "USER_LOGIN_ID", length = 50)
    private String userLoginId = "";

    @Column(name = "USER_LOGIN_PSWD", length = 64)
    private String userLoginPswd = "";

    @Column(name = "USER_NM", length = 50)
    private String userName = "";

    @Column(name = "PHONE", length = 50)
    private String phone = "";

    @Column(name = "CP_NO", length = 50)
    private String cpNo = "";

    @Column(name = "EMAIL", length = 100)
    private String email = "";

    @Column(name = "FIST_REG_DTM", length = 17)
    private String fistRegDtm = "";

    @Column(name = "LST_LOGIN_DTM", length = 17)
    private String lstLoginDtm = "";

    @Column(name = "USE_YN", length = 1)
    private String useYn = "";

    @Column(name = "DPT_ID", length = 22)
    private String departmentId;

    @Column(name = "ROlE_ID", length = 22, nullable = true)
    private String roleId;

    @Column(name = "ENCRYPT_KEY", length = 50, nullable = true)
    private String encryptKey;

    @Column(name = "login_try_count")
    private int loginTryCount = 0;

    @Column(name = "login_block_flag", length = 5)
    private String loginBlockFlag;

    @Column(name = "EVENT_ROLE_ID", length = 50)
    private String eventRoleId;

    @Column(name = "USER_GD", length = 50)
    private String userGd;

    @Formula(
        "(SELECT d.dpt_nm " +
        "FROM rino_oms.OMS_USER_INFO u " +
        "JOIN rino_oms.OMS_DPT_INFO d on u.dpt_id = d.dpt_id " +
        "WHERE u.user_id = USER_ID)"
    )
    private String departmentName;
}
