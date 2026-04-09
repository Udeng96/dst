package com.eseict.dst.controller.event;

import com.eseict.dst.constants.DstConstants;
import com.eseict.dst.service.event.EventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "events", produces = DstConstants.PROD_APP_JSON_UTF8)
public class EventController {

    private static final Logger logger = LoggerFactory.getLogger(EventController.class);

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<Object> getEvents(
        @RequestParam(value = "searchType", required = false, defaultValue = "") String searchType,
        @RequestParam(value = "from", required = false, defaultValue = "") String from,
        @RequestParam(value = "to", required = false, defaultValue = "") String to) {
        try {
            return ResponseEntity.ok(eventService.getEvents(searchType, from, to));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("{statEvetOutbSeqn}")
    public ResponseEntity<Object> getEvent(
        @PathVariable("statEvetOutbSeqn") String statEvetOutbSeqn) {
        try {
            return ResponseEntity.ok(eventService.getEvent(statEvetOutbSeqn));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("types")
    public ResponseEntity<Object> getEventTypes() {
        try {
            return ResponseEntity.ok(eventService.getEventTypes());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("getEventAllInfo")
    public ResponseEntity<Object> getEventAllInfo() {
        try {
            return ResponseEntity.ok(eventService.getEventAllInfo());
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("{statEvetOutbSeqn}/finish")
    public ResponseEntity<Object> finishEventById(
        @PathVariable("statEvetOutbSeqn") String statEvetOutbSeqn) {
        try {
            return ResponseEntity.ok(eventService.finishEventById(statEvetOutbSeqn));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("{statEvetOutbSeqn}/location")
    public ResponseEntity<Object> saveNewLocation(
        @PathVariable("statEvetOutbSeqn") String statEvetOutbSeqn,
        @RequestParam("locX") float locX,
        @RequestParam("locY") float locY) {
        try {
            return ResponseEntity.ok(eventService.updateEventNewLocation(statEvetOutbSeqn, locX, locY));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("FAIL");
        }
    }

    @PostMapping("generation")
    public ResponseEntity<Object> generate(
        @RequestParam("evetId") String evetId,
        @RequestParam("evetNm") String evetNm,
        @RequestParam("address") String address,
        @RequestParam("x") String x,
        @RequestParam("y") String y) {
        try {
            eventService.generate(evetId, evetNm, address, x, y);
            return ResponseEntity.ok("SUCCESS");
        } catch (Exception error) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("FAIL");
        }
    }
}
