package com.eseict.dst.controller.organization;

import com.eseict.dst.constants.DstConstants;
import com.eseict.dst.service.organization.OrganizationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "organizations", produces = DstConstants.PROD_APP_JSON_UTF8)
public class OrganizationController {

    public static final Logger logger = LoggerFactory.getLogger(OrganizationController.class);

    @Autowired
    private OrganizationService organizationService;

    @GetMapping
    public ResponseEntity<Object> getOrganizations() {
        try {
            return ResponseEntity.ok(organizationService.getOrganizations());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
