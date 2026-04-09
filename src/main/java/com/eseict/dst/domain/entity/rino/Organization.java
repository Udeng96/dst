package com.eseict.dst.domain.entity.rino;

import lombok.Getter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "oms_orgn_info", schema = "rino_oms")
@Getter
public class Organization {

    @Id
    @Column(name = "ORGN_ID", length = 22)
    private String organizationId;

    @Column(name = "ORGN_NM", length = 30)
    private String organizationName;

    @Column(name = "ORGN_CD", length = 10)
    private String organizationCd;

    @Column(name = "ORGN_DESC", length = 500)
    private String organizationDesc;

    @Column(name = "GRUP_ID", length = 22)
    private String groupId;
}
