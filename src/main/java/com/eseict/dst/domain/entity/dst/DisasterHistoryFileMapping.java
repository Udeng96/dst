package com.eseict.dst.domain.entity.dst;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "DISASTER_HISTORY_FILE_MAPPING", schema = "dst")
@Getter
@Setter
public class DisasterHistoryFileMapping {

    @Id
    @Column(name = "DISASTER_HISTORY_File_MAPPING_ID")
    private String disasterHistoryFileMappingId;

    @Column(name = "DISASTER_HISTORY_ID")
    private String disasterHistoryId;

    @Column(name = "FILE_LOCATION")
    private String fileLocation;

    @Column(name = "FILE_NAME")
    private String fileName;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "DISASTER_HISTORY_ID",
        referencedColumnName = "DISASTER_HISTORY_ID",
        insertable = false,
        updatable = false
    )
    private DisasterHistory disasterHistory;
}
