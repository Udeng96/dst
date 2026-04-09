package com.eseict.dst.controller.error;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RequestMapping("error")
@Controller
public class DstErrorController implements ErrorController {

    private static final String PATH = "error";

    @RequestMapping(produces = MediaType.TEXT_HTML_VALUE)
    public String errorHtml(HttpServletRequest request, Model model) {
        String message = (String) request.getAttribute("javax.servlet.error.message");
        model.addAttribute("message", message != null ? message : "");

        Object statusObj = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        if (statusObj instanceof Integer) {
            int status = (Integer) statusObj;
            if (status == HttpStatus.BAD_REQUEST.value() ||
                status == HttpStatus.UNAUTHORIZED.value() ||
                status == HttpStatus.NOT_FOUND.value() ||
                status == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                return "errors/" + status;
            }
        }
        return PATH;
    }

    @RequestMapping
    public ResponseEntity<Object> error(HttpServletRequest request, HttpServletResponse response) {
        Object statusObj = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        int status = statusObj instanceof Integer ? (Integer) statusObj : 500;
        return ResponseEntity.status(status).body("OK");
    }

}
