package com.eseict.dst.controller.disasterHistory;

import com.eseict.dst.constants.DstConstants;
import com.eseict.dst.domain.entity.dst.DisasterHistory;
import com.eseict.dst.domain.entity.dst.DisasterHistoryFileMapping;
import com.eseict.dst.domain.entity.dst.DisasterHistoryVideoMapping;
import com.eseict.dst.service.disasterHistory.DisasterHistoryCctvService;
import com.eseict.dst.service.disasterHistory.DisasterHistoryFileService;
import com.eseict.dst.service.disasterHistory.DisasterHistoryService;
import com.eseict.dst.service.disasterHistory.DisasterHistoryVideoService;
import com.eseict.dst.service.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.beans.factory.annotation.Value;

import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "disasterHistories", produces = DstConstants.PROD_APP_JSON_UTF8)
public class DisasterHistoryController {

    private static final Logger logger = LoggerFactory.getLogger(DisasterHistoryController.class);

    @Value("${dst.auth.dev-mode:false}")
    private boolean devMode;

    private final DisasterHistoryService disasterHistoryService;
    private final DisasterHistoryFileService disasterHistoryFileService;
    private final DisasterHistoryCctvService disasterHistoryCctvService;
    private final DisasterHistoryVideoService disasterHistoryVideoService;
    private final UserService userService;

    public DisasterHistoryController(
        DisasterHistoryService disasterHistoryService,
        DisasterHistoryFileService disasterHistoryFileService,
        DisasterHistoryCctvService disasterHistoryCctvService,
        DisasterHistoryVideoService disasterHistoryVideoService,
        UserService userService) {
        this.disasterHistoryService = disasterHistoryService;
        this.disasterHistoryFileService = disasterHistoryFileService;
        this.disasterHistoryCctvService = disasterHistoryCctvService;
        this.disasterHistoryVideoService = disasterHistoryVideoService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<Object> getDisasterHistories(
        @RequestParam("statEvetOutbSeqn") String statEvetOutbSeqn) {
        try {
            return ResponseEntity.ok(disasterHistoryService.getDisasterHistories(statEvetOutbSeqn));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // 상황전파 공유내용 조회 시, 입력했던 비밀번호 체크
    @GetMapping("chkPwd")
    public ResponseEntity<Boolean> chkPwd(
        @RequestParam("pwd") String pwd,
        @RequestParam("disasterHistoryId") String disasterHistoryId) {
        return ResponseEntity.ok(disasterHistoryService.chkPwd(pwd, disasterHistoryId));
    }

    @PostMapping
    public ResponseEntity<Object> saveDisasterHistory(
        @RequestBody DisasterHistory disasterHistory,
        HttpSession session) {
        try {
            if (!devMode) {
                String token = (String) session.getAttribute(DstConstants.TOKEN_KEY);
                if (token == null) throw new IllegalAccessException("Token is missing from session");
                if (userService.getUserByToken(token) == null)
                    throw new IllegalAccessException("User token is invalid");
            }

            if (devMode && (disasterHistory.getRegUserId() == null || disasterHistory.getRegUserId().isEmpty())) {
                disasterHistory.setRegUserId("dev");
            }

            logger.info("disasterHistory:{}", disasterHistory);
            return ResponseEntity.ok(disasterHistoryService.saveDisasterHistory(disasterHistory));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("{disasterHistoryId}")
    public ResponseEntity<Object> getDisasterHistory(
        @PathVariable("disasterHistoryId") String disasterHistoryId) {
        try {
            return ResponseEntity.ok(disasterHistoryService.getDisasterHistory(disasterHistoryId));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("{disasterHistoryId}")
    public ResponseEntity<Object> deleteDisasterHistory(
        @RequestBody DisasterHistory disasterHistory) {
        try {
            disasterHistoryService.deleteDisasterHistory(disasterHistory);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // ──────────────────────────── 파일 ────────────────────────────

    @GetMapping("{disasterHistoryId}/file")
    public ResponseEntity<Object> getDisasterHistoryFileMapping(
        @PathVariable("disasterHistoryId") String disasterHistoryId) {
        try {
            return ResponseEntity.ok(
                disasterHistoryFileService.getDisasterHistoryFileMappings(disasterHistoryId));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("{disasterHistoryId}/file/{disasterHistoryFileMappingId}/download")
    public ResponseEntity<Object> downloadDisasterHistoryFileMapping(
        @PathVariable("disasterHistoryId") String disasterHistoryId,
        @PathVariable("disasterHistoryFileMappingId") String disasterHistoryFileMappingId) {

        logger.trace("[downloadDisasterHistoryFileMapping] disasterHistoryId : {}", disasterHistoryId);
        logger.trace("[downloadDisasterHistoryFileMapping] disasterHistoryFileMappingId : {}",
            disasterHistoryFileMappingId);

        try {
            DisasterHistoryFileMapping mapping =
                disasterHistoryFileService.getDisasterHistoryFileMapping(disasterHistoryFileMappingId);
            if (mapping.getFileLocation() == null) throw new Exception("Not found");

            File saveFile = new File(mapping.getFileLocation());
            String fileName = URLEncoder.encode(mapping.getFileName(), StandardCharsets.UTF_8.name());

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
            headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.add("Pragma", "no-cache");
            headers.add("Expires", "0");

            FileInputStream fileInputStream = new FileInputStream(mapping.getFileLocation());
            InputStreamResource resource = new InputStreamResource(fileInputStream);

            return ResponseEntity.ok()
                .headers(headers)
                .contentLength(saveFile.length())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("{disasterHistoryId}/file")
    public ResponseEntity<Object> saveDisasterHistoryFileMapping(
        @PathVariable("disasterHistoryId") String disasterHistoryId,
        @RequestPart("files") List<MultipartFile> files) {
        try {
            return ResponseEntity.ok(
                disasterHistoryFileService.saveFiles(disasterHistoryId, files));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("{disasterHistoryId}/file")
    public ResponseEntity<Object> deleteDisasterHistoryFileMapping(
        @PathVariable("disasterHistoryId") String disasterHistoryId) {
        try {
            disasterHistoryFileService.deleteByDisasterHistoryId(disasterHistoryId);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // ──────────────────────────── 비디오 ────────────────────────────

    @GetMapping("{disasterHistoryId}/videos")
    public ResponseEntity<Object> getDisasterHistoryVideoMappings(
        @PathVariable("disasterHistoryId") String disasterHistoryId) {
        try {
            return ResponseEntity.ok(
                disasterHistoryVideoService.getVideoMappings(disasterHistoryId));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("{disasterHistoryId}/videos")
    public ResponseEntity<Object> saveDisasterHistoryVideoMappings(
        @PathVariable("disasterHistoryId") String disasterHistoryId,
        @RequestBody List<DisasterHistoryVideoMapping> disasterHistoryVideos) {
        try {
            logger.info("disasterHistoryId:{}", disasterHistoryId);
            return ResponseEntity.ok(
                disasterHistoryVideoService.saveVideoMappings(disasterHistoryId, disasterHistoryVideos));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("{disasterHistoryId}/videos")
    public ResponseEntity<Object> deleteDisasterHistoryVideoMappings(
        @PathVariable("disasterHistoryId") String disasterHistoryId) {
        try {
            disasterHistoryVideoService.deleteVideoMappings(disasterHistoryId);
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
