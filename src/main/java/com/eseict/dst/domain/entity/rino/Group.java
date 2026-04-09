package com.eseict.dst.domain.entity.rino;

import lombok.Getter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "oms_grup_info", schema = "rino_oms")
@Getter
public class Group {

    @Id
    @Column(name = "GRUP_ID", length = 22)
    private String groupId;

    @Column(name = "GRUP_NM", length = 30)
    private String groupName;

    @Column(name = "GRUP_CD", length = 10)
    private String groupCd;

    @Column(name = "GRUP_DESC", length = 500)
    private String groupDesc;
}
