package com.eseict.dst.service.disasterHistory;

import com.eseict.common.core.unique.IdGenerator;
import com.eseict.dst.domain.entity.dst.DisasterHistoryVideoMapping;
import com.eseict.dst.repository.dst.DisasterHistoryVideoMappingRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 재난이력 비디오 매핑 CRUD를 담당한다.
 */
@Service
public class DisasterHistoryVideoService {

    private final DisasterHistoryVideoMappingRepository disasterHistoryVideoMappingRepository;

    public DisasterHistoryVideoService(
        DisasterHistoryVideoMappingRepository disasterHistoryVideoMappingRepository) {
        this.disasterHistoryVideoMappingRepository = disasterHistoryVideoMappingRepository;
    }

    public List<DisasterHistoryVideoMapping> getVideoMappings(String disasterHistoryId) {
        return disasterHistoryVideoMappingRepository.findAllByDisasterHistoryId(disasterHistoryId);
    }

    public List<DisasterHistoryVideoMapping> saveVideoMappings(
        String disasterHistoryId, List<DisasterHistoryVideoMapping> disasterHistoryVideoMappings) {

        List<DisasterHistoryVideoMapping> newList = new ArrayList<>();
        for (int i = 0; i < disasterHistoryVideoMappings.size(); i++) {
            DisasterHistoryVideoMapping src = disasterHistoryVideoMappings.get(i);
            DisasterHistoryVideoMapping newMapping = new DisasterHistoryVideoMapping();
            newMapping.setDisasterHistoryVideoMappingId(IdGenerator.getUUID64());
            newMapping.setIndex(i);
            newMapping.setType(src.getType());
            newMapping.setId(src.getId());
            newMapping.setUrl(src.getUrl());
            newMapping.setDisasterHistoryId(disasterHistoryId);
            newList.add(newMapping);
        }
        return disasterHistoryVideoMappingRepository.saveAll(newList);
    }

    public void deleteVideoMappings(String disasterHistoryId) {
        disasterHistoryVideoMappingRepository.deleteByDisasterHistoryId(disasterHistoryId);
    }
}
