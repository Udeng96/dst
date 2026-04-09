package com.eseict.dst.domain.entity.dst;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "DISASTER_HISTORY_CCTV_MAPPING", schema = "dst")
@Getter
@Setter
public class DisasterHistoryCctvMapping {

    @Id
    @Column(name = "DISASTER_HISTORY_CCTV_MAPPING_ID")
    private String disasterHistoryCctvMappingId;

    @Column(name = "DISASTER_HISTORY_ID")
    private String disasterHistoryId;

    @Column(name = "CCTV_ID")
    private String cctvId = "";

    @Column(name = "INDEX")
    private Integer index;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(
        name = "DISASTER_HISTORY_ID",
        referencedColumnName = "DISASTER_HISTORY_ID",
        insertable = false,
        updatable = false
    )
    private DisasterHistory disasterHistory;
}
