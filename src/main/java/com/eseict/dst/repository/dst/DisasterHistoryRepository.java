package com.eseict.dst.repository.dst;

import com.eseict.dst.domain.entity.dst.DisasterHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisasterHistoryRepository extends JpaRepository<DisasterHistory, String> {

    @Query(
        "SELECT DISTINCT disasterHistory " +
        "FROM DisasterHistory disasterHistory " +
        "LEFT OUTER JOIN FETCH disasterHistory.disasterHistoryCctvMappings " +
        "LEFT OUTER JOIN FETCH disasterHistory.disasterHistoryFileMappings " +
        "WHERE disasterHistory.statEvetOutbSeqn = :statEvetOutbSeqn " +
        "ORDER BY disasterHistory.regDate DESC"
    )
    List<DisasterHistory> findAllByStatEvetOutbSeqn(String statEvetOutbSeqn);

    @Query(
        "SELECT DISTINCT disasterHistory " +
        "FROM DisasterHistory disasterHistory " +
        "LEFT OUTER JOIN FETCH disasterHistory.disasterHistoryCctvMappings " +
        "LEFT OUTER JOIN FETCH disasterHistory.disasterHistoryFileMappings " +
        "WHERE disasterHistory.statEvetOutbSeqn = :statEvetOutbSeqn " +
        "AND disasterHistory.type = :type " +
        "ORDER BY disasterHistory.regDate DESC"
    )
    List<DisasterHistory> findAllByStatEvetOutbSeqnAndType(String statEvetOutbSeqn, int type);

    DisasterHistory findFirstByOrderByRegDateDesc();
}
