package com.eseict.dst.repository.dst;

import com.eseict.dst.domain.entity.dst.DisasterHistoryFileMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisasterHistoryFileMappingRepository extends JpaRepository<DisasterHistoryFileMapping, String> {

    List<DisasterHistoryFileMapping> findAllByDisasterHistoryId(String disasterHistoryId);

    void deleteAllByDisasterHistoryId(String disasterHistoryId);
}
