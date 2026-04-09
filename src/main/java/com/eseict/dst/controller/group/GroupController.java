package com.eseict.dst.controller.group;

import com.eseict.dst.constants.DstConstants;
import com.eseict.dst.service.group.GroupService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "groups", produces = DstConstants.PROD_APP_JSON_UTF8)
public class GroupController {

    private static final Logger logger = LoggerFactory.getLogger(GroupController.class);

    @Autowired
    private GroupService groupService;

    @GetMapping
    public ResponseEntity<Object> getGroups() {
        try {
            return ResponseEntity.ok(groupService.getGroups());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
