package com.eseict.dst.service.disasterHistory;

import com.eseict.common.core.unique.IdGenerator;
import com.eseict.dst.domain.entity.dst.DisasterHistoryFileMapping;
import com.eseict.dst.repository.dst.DisasterHistoryFileMappingRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 재난이력 첨부 파일 저장 / 조회 / 삭제를 담당한다.
 * 파일 저장 루트는 application.yml dst.home 으로 주입받는다.
 */
@Service
public class DisasterHistoryFileService {

    private final DisasterHistoryFileMappingRepository disasterHistoryFileMappingRepository;

    @Value("${dst.home}")
    private String dstHome;

    public DisasterHistoryFileService(
        DisasterHistoryFileMappingRepository disasterHistoryFileMappingRepository) {
        this.disasterHistoryFileMappingRepository = disasterHistoryFileMappingRepository;
    }

    public DisasterHistoryFileMapping getDisasterHistoryFileMapping(String disasterHistoryFileMappingId) {
        return disasterHistoryFileMappingRepository.findById(disasterHistoryFileMappingId)
            .orElseThrow(() -> new IllegalArgumentException(
                "FileMapping not found: " + disasterHistoryFileMappingId));
    }

    public List<DisasterHistoryFileMapping> getDisasterHistoryFileMappings(String disasterHistoryId) {
        return disasterHistoryFileMappingRepository.findAllByDisasterHistoryId(disasterHistoryId);
    }

    /**
     * MultipartFile 목록을 DST_HOME/files/{disasterHistoryId}/ 에 저장하고
     * 저장 결과를 DB에 반영한다.
     */
    public List<DisasterHistoryFileMapping> saveFiles(
        String disasterHistoryId, List<MultipartFile> files) {

        File directory = new File(dstHome + File.separator + "files" + File.separator + disasterHistoryId);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        List<DisasterHistoryFileMapping> mappings = files.stream().map(file -> {
            try {
                String disasterHistoryFileMappingId = "__" + IdGenerator.getUUID64() + "__";
                String fileName = file.getOriginalFilename();
                File saveFile = new File(directory.getPath() + File.separator + disasterHistoryFileMappingId);
                file.transferTo(saveFile);

                DisasterHistoryFileMapping mapping = new DisasterHistoryFileMapping();
                mapping.setDisasterHistoryFileMappingId(disasterHistoryFileMappingId);
                mapping.setDisasterHistoryId(disasterHistoryId);
                mapping.setFileLocation(saveFile.getPath());
                mapping.setFileName(fileName);
                return mapping;
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).collect(Collectors.toList());

        return disasterHistoryFileMappingRepository.saveAll(mappings);
    }

    public void deleteByDisasterHistoryId(String disasterHistoryId) {
        disasterHistoryFileMappingRepository.deleteAllByDisasterHistoryId(disasterHistoryId);
    }
}
