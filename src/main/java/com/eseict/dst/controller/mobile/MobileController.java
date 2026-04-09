package com.eseict.dst.controller.mobile;

import com.eseict.dst.constants.DstConstants;
import com.eseict.dst.service.mobile.MobileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "mobile", produces = DstConstants.PROD_APP_JSON_UTF8)
public class MobileController {

    private static final Logger logger = LoggerFactory.getLogger(MobileController.class);

    @Autowired
    private MobileService mobileService;

    @GetMapping("live")
    public ResponseEntity<Object> getLiveMobileList() {
        try {
            return ResponseEntity.ok(mobileService.getLiveList());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(DstConstants.RESULT.FAIL_MESSAGE);
        }
    }

    @GetMapping("all")
    public ResponseEntity<Object> getAllMobileList() {
        try {
            return ResponseEntity.ok(mobileService.getAllList());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(DstConstants.RESULT.FAIL_MESSAGE);
        }
    }
}
