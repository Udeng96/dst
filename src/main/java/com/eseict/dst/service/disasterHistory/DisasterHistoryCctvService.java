package com.eseict.dst.service.disasterHistory;

import com.eseict.dst.domain.entity.dst.DisasterHistoryCctvMapping;
import com.eseict.dst.repository.dst.DisasterHistoryCctvMappingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 재난이력 CCTV 매핑 CRUD를 담당한다.
 */
@Service
public class DisasterHistoryCctvService {

    private final DisasterHistoryCctvMappingRepository disasterHistoryCctvMappingRepository;

    public DisasterHistoryCctvService(
        DisasterHistoryCctvMappingRepository disasterHistoryCctvMappingRepository) {
        this.disasterHistoryCctvMappingRepository = disasterHistoryCctvMappingRepository;
    }

    public List<DisasterHistoryCctvMapping> getCctvMappings(String disasterHistoryId) {
        return disasterHistoryCctvMappingRepository.findAllByDisasterHistoryId(disasterHistoryId);
    }

    public List<DisasterHistoryCctvMapping> saveCctvMappings(
        List<DisasterHistoryCctvMapping> disasterHistoryCctvMappings) {
        return disasterHistoryCctvMappingRepository.saveAll(disasterHistoryCctvMappings);
    }

    public void deleteCctvMappings(String disasterHistoryId) {
        disasterHistoryCctvMappingRepository.deleteByDisasterHistoryId(disasterHistoryId);
    }
}
