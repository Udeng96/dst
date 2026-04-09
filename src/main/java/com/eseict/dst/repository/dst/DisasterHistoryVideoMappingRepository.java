package com.eseict.dst.repository.dst;

import com.eseict.dst.domain.entity.dst.DisasterHistoryVideoMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisasterHistoryVideoMappingRepository extends JpaRepository<DisasterHistoryVideoMapping, String> {

    List<DisasterHistoryVideoMapping> findAllByDisasterHistoryId(String disasterHistoryId);

    List<DisasterHistoryVideoMapping> findAll();

    void deleteByDisasterHistoryId(String disasterHistoryId);
}
