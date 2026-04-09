package com.eseict.dst.repository.dst;

import com.eseict.dst.domain.entity.dst.DisasterHistoryCctvMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisasterHistoryCctvMappingRepository extends JpaRepository<DisasterHistoryCctvMapping, String> {

    List<DisasterHistoryCctvMapping> findAllByDisasterHistoryId(String disasterHistoryId);

    void deleteByDisasterHistoryId(String disasterHistoryId);
}
