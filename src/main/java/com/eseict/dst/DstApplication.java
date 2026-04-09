package com.eseict.dst;

import com.eseict.dst.config.websocket.EventWebsocketHandler;
import com.eseict.dst.config.websocket.MobileWebsocketHandler;
import com.eseict.dst.proc.rinoEvent.rcv.RinoEventSocketServer;
import com.eseict.dst.proc.rinoEvent.rcv.queue.event.SocketMobileMsgQueuePolling;
import com.eseict.dst.proc.rinoEvent.rcv.queue.event.SocketMsgQueuePolling;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.Banner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.annotation.PostConstruct;

@SpringBootApplication
@EnableScheduling
@ConfigurationPropertiesScan
public class DstApplication {

    @Value("${socket.port.rino}")
    private String socketPort;

    @Autowired
    private EventWebsocketHandler eventWebsocketHandler;

    @Autowired
    private MobileWebsocketHandler mobileWebsocketHandler;

    @PostConstruct
    public void initialize() {
        RinoEventSocketServer.getInstance(Integer.parseInt(socketPort)).init();
        SocketMsgQueuePolling msgPolling = new SocketMsgQueuePolling(eventWebsocketHandler, mobileWebsocketHandler);
        SocketMobileMsgQueuePolling msgMobilePolling = new SocketMobileMsgQueuePolling(mobileWebsocketHandler);
        Thread msgPollingThread = new Thread(msgPolling);
        Thread msgMobilePollingThread = new Thread(msgMobilePolling);
        msgMobilePollingThread.start();
        msgPollingThread.start();
    }

    public static void main(String[] args) {
        String dstHome = System.getenv("DST_HOME");
        boolean isDebug = Boolean.parseBoolean(System.getenv("RINO_APP_DEBUG"));

        new SpringApplicationBuilder(DstApplication.class)
            // .profiles("prod")
            .bannerMode(Banner.Mode.CONSOLE)
            .headless(false)
            .properties(
                "spring.config.location=" +
                    "file:" + dstHome + "/properties/application.yml" +
                    ", file:" + dstHome + "/properties/config.yml" +
                    ", file:" + dstHome + "/properties/" + (isDebug ? "database-development.yml" : "database.yml") +
                    ", file:" + dstHome + "/properties/api.yml"
            )
            .application()
            .run(args);
    }
}
