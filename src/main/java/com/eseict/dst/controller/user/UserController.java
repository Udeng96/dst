package com.eseict.dst.controller.user;

import com.eseict.dst.constants.DstConstants;
import com.eseict.dst.service.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping(value = "users", produces = DstConstants.PROD_APP_JSON_UTF8)
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Value("${dst.auth.dev-mode:false}")
    private boolean devMode;

    @Autowired
    private UserService userService;

    /**
     * NOTE 기존 통영에서는 암호화되지않은 값을 그대로 사용하였음, 화성에서는 암호화가 있을것을 상정하여 변환 처리를 진행한다.
     */
    @GetMapping
    public ResponseEntity<Object> getUsers() {
        try {
            java.util.List<Object> users = new java.util.ArrayList<>(userService.getUsers());
            if (devMode) {
                java.util.Map<String, Object> devUser = new java.util.HashMap<>();
                devUser.put("userId", "dev");
                devUser.put("userName", "개발자");
                devUser.put("phone", "010-0000-0000");
                devUser.put("departmentId", "");
                devUser.put("organizationId", "");
                users.add(devUser);
            }
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("test")
    public void test() {
        userService.getUserByToken("2mMqG0bjAq4b2uGIYHYis0");
    }

    /**
     * Session 에 저장된 token 을 통해 OMS 에 사용자 정보를 요청합니다.
     */
    @GetMapping("current")
    public ResponseEntity<Object> getCurrentUser(HttpSession session) {
        try {
            if (devMode) {
                java.util.Map<String, Object> devUser = new java.util.HashMap<>();
                devUser.put("userId", "dev");
                devUser.put("userLoginId", "dev");
                devUser.put("userName", "개발자");
                devUser.put("cpNo", "010-0000-0000");
                devUser.put("email", "dev@eseict.com");
                devUser.put("departmentId", "");
                devUser.put("departmentName", "개발팀");
                return ResponseEntity.ok(devUser);
            }
            String token = (String) session.getAttribute(DstConstants.TOKEN_KEY);
            Object result = userService.getUserByToken(token);
            if (result == null) result = "";
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
