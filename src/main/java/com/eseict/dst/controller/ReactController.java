package com.eseict.dst.controller;

import com.eseict.dst.service.disasterHistory.DisasterHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactController {

    @Autowired
    private DisasterHistoryService disasterHistoryService;

    @RequestMapping("main")
    public String main() {
        return "index";
    }

    @RequestMapping("share/{disasterHistoryId}")
    public String share(@PathVariable("disasterHistoryId") String disasterHistoryId) {
        return "index";
    }

    @RequestMapping("share")
    public String shareLast() {
        return "redirect:/share/" + disasterHistoryService.findFirstByOrderByRegDateDesc().getDisasterHistoryId();
    }
}
