package com.eseict.dst.controller.cctv;

import com.eseict.dst.constants.DstConstants;
import com.eseict.dst.service.cctv.CctvService;
import com.google.common.base.Strings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "cctvs", produces = DstConstants.PROD_APP_JSON_UTF8)
public class CctvController {

    private static final Logger logger = LoggerFactory.getLogger(CctvController.class);

    @Autowired
    private CctvService cctvService;

    @GetMapping
    public ResponseEntity<Object> getCctvs(
        @RequestParam(value = "disasterHistoryId", defaultValue = "") String disasterHistoryId) {
        try {
            if (Strings.isNullOrEmpty(disasterHistoryId)) {
                return ResponseEntity.ok(cctvService.getCctvs());
            } else {
                return ResponseEntity.ok(cctvService.getCctvsByDisasterId(disasterHistoryId));
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
