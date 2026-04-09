package com.eseict.dst.controller.video;

import com.eseict.dst.constants.DstConstants;
import com.eseict.dst.service.video.VideoService;
import com.google.common.base.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "videos", produces = DstConstants.PROD_APP_JSON_UTF8)
public class VideoController {

    private static final Logger logger = LoggerFactory.getLogger(VideoController.class);

    @Autowired
    private VideoService videoService;

    @GetMapping
    public ResponseEntity<Object> getVideos(
        @RequestParam(value = "disasterHistoryId", defaultValue = "") String disasterHistoryId) {
        try {
            if (Strings.isNullOrEmpty(disasterHistoryId)) {
                return ResponseEntity.ok(videoService.getVideos());
            } else {
                return ResponseEntity.ok(videoService.getVideosByDisasterId(disasterHistoryId));
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(DstConstants.RESULT.FAIL_MESSAGE);
        }
    }
}
