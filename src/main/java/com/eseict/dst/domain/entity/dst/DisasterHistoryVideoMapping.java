package com.eseict.dst.domain.entity.dst;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "DISASTER_HISTORY_VIDEO_MAPPING", schema = "dst")
@Getter
@Setter
public class DisasterHistoryVideoMapping {

    @Id
    @Column(name = "DISASTER_HISTORY_VIDEO_MAPPING_ID")
    private String disasterHistoryVideoMappingId;

    @Column(name = "DISASTER_HISTORY_ID")
    private String disasterHistoryId;

    @Column(name = "TYPE")
    private String type;

    @Column(name = "ID")
    private String id;

    @Column(name = "URL")
    private String url;

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
