package com.eseict.dst.domain.entity.dst;

import com.eseict.dst.constants.DstConstants;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "DISASTER_HISTORY", schema = "dst")
@Getter
@Setter
@ToString(exclude = {"disasterHistoryCctvMappings", "disasterHistoryFileMappings"})
public class DisasterHistory {

    @Id
    @Column(name = "DISASTER_HISTORY_ID", nullable = false)
    private String disasterHistoryId;

    @Column(name = "TITLE", nullable = false)
    private String title;

    @Column(name = "CONTENT", nullable = false, length = 500)
    private String content;

    @Column(name = "TRANSFER_TARGET", nullable = false)
    private String transferTarget;

    @Column(name = "STAT_EVET_OUTB_SEQN", nullable = false)
    private String statEvetOutbSeqn;

    @Column(name = "TYPE", nullable = false)
    private int type = DstConstants.DisasterHistoryType.TRANSFER.getCode();

    @Column(name = "REG_DATE")
    private String regDate;

    @Column(name = "REG_USER_ID")
    private String regUserId;

    @Column(name = "EXPIRE_DTM")
    private String expireDtm;

    @Column(name = "PWD")
    private String pwd;

    @OrderBy("index ASC")
    @OneToMany(mappedBy = "disasterHistory", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<DisasterHistoryCctvMapping> disasterHistoryCctvMappings = new HashSet<>();

    @OrderBy("fileName ASC")
    @OneToMany(mappedBy = "disasterHistory", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<DisasterHistoryFileMapping> disasterHistoryFileMappings = new HashSet<>();
}
