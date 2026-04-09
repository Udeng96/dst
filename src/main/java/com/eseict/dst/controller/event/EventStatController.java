package com.eseict.dst.controller.event;

import com.eseict.dst.constants.DstConstants;
import com.eseict.dst.service.event.EventStatService;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "event/stat", produces = DstConstants.PROD_APP_JSON_UTF8)
public class EventStatController {

    private static final Logger logger = LoggerFactory.getLogger(EventStatController.class);

    @Autowired
    private EventStatService service;

    @GetMapping("download")
    public void downloadEventHistoryExcel(
        @RequestParam("startDt") String startDt,
        @RequestParam("endDt") String endDt,
        HttpServletResponse response) throws Exception {
        Workbook workbook = service.getEventStatExcel(startDt, endDt);
        response.setContentType("ms-vnd/excel");
        response.setHeader("Content-Disposition", "attachment;filename=event_statistics_report.xls");
        workbook.write(response.getOutputStream());
        workbook.close();
    }
}
