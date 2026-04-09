package com.eseict.dst.service.cctv;

import com.eseict.dst.domain.entity.xeus.Cctv;
import com.eseict.dst.repository.xeus.CctvRepository;
import com.eseict.dst.service.disasterHistory.DisasterHistoryCctvService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CctvService {

    @Autowired
    private CctvRepository cctvRepository;

    @Autowired
    private DisasterHistoryCctvService disasterHistoryCctvService;

    public List<Cctv> getCctvs() {
        try {
            return cctvRepository.findAll().stream()
                .filter(data -> data.getClftNm() != null && data.getClftNm().contains("방범"))
                .filter(data -> data.getX() != null && !"0.0".equals(data.getX()))
                .filter(data -> data.getY() != null && !"0.0".equals(data.getY()))
                .collect(Collectors.toList());
        } catch (Exception e) {
            throw e;
        }
    }

    public List<Cctv> getCctvsByDisasterId(String disasterHistoryId) {
        try {
            List<String> cctvIds = disasterHistoryCctvService.getCctvMappings(disasterHistoryId)
                .stream()
                .map(m -> m.getCctvId())
                .collect(Collectors.toList());
            return cctvRepository.findAllByMgrNoIn(cctvIds);
        } catch (Exception e) {
            throw e;
        }
    }
}
