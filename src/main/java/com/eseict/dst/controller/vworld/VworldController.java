package com.eseict.dst.controller.vworld;

import com.eseict.dst.constants.DstConstants;
import com.eseict.dst.controller.organization.OrganizationController;
import com.eseict.dst.domain.dto.vworld.CoordToAddressResponse;
import com.eseict.dst.service.vworld.VworldService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "vworld", produces = DstConstants.PROD_APP_JSON_UTF8)
public class VworldController {

    @Autowired
    private VworldService vworldService;

    @GetMapping("address")
    public ResponseEntity<String> getAddress(
        @RequestParam("x") String x,
        @RequestParam("y") String y) {
        try {
            CoordToAddressResponse.Response.Result result = vworldService.getAddress(x, y);
            return ResponseEntity.ok(result.getText());
        } catch (Exception error) {
            OrganizationController.logger.error(error.getMessage(), error);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error.getMessage());
        }
    }
}
