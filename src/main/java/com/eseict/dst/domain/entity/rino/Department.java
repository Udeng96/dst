package com.eseict.dst.domain.entity.rino;

import lombok.Getter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "oms_dpt_info", schema = "rino_oms")
@Getter
public class Department {

    @Id
    @Column(name = "DPT_ID", length = 22)
    private String departmentId = "";

    @Column(name = "DPT_NM", length = 30)
    private String departmentName = "";

    @Column(name = "DPT_CD", length = 10)
    private String departmentCd = "";

    @Column(name = "DPT_DESC", length = 500)
    private String departmentDesc = "";

    @Column(name = "ORGN_ID", length = 22)
    private String organizationId = "";
}
