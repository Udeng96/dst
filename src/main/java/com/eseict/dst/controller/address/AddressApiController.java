package com.eseict.dst.controller.address;

import com.eseict.dst.constants.DstConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "address", produces = DstConstants.PROD_APP_JSON_UTF8)
public class AddressApiController {

    private static final Logger logger = LoggerFactory.getLogger(AddressApiController.class);

    @GetMapping("getData")
    public ResponseEntity<Object> getAddressData() {
        try {
            String dstHome = System.getenv("DST_HOME");
            String jsonString = new String(
                Files.readAllBytes(new File(dstHome + File.separator + "AddressAutoCompData.json").toPath()),
                StandardCharsets.UTF_8
            );
            return ResponseEntity.ok(jsonString);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
