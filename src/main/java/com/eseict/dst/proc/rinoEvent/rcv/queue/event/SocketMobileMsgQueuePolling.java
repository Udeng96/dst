package com.eseict.dst.proc.rinoEvent.rcv.queue.event;

import com.eseict.common.log.LoggerManager;
import com.eseict.dst.config.websocket.MobileWebsocketHandler;
import org.slf4j.Logger;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.List;

public class SocketMobileMsgQueuePolling implements Runnable {

    private static final Logger logger = LoggerManager.getLogger(SocketMobileMsgQueuePolling.class);

    private final SocketMsgQueue msgQueue = SocketMsgQueue.getInstance();
    private final MobileWebsocketHandler mobileWebsocketHandler;
    private volatile boolean bRunning = true;

    public SocketMobileMsgQueuePolling(MobileWebsocketHandler mobileWebsocketHandler) {
        this.mobileWebsocketHandler = mobileWebsocketHandler;
    }

    @Override
    public void run() {
        while (bRunning) {
            try {
                String msg = msgQueue.take();
                if (msg == null || msg.isEmpty()) {
                    Thread.sleep(0);
                    continue;
                }

                List<WebSocketSession> wsMobileList = mobileWebsocketHandler.getSessionList();
                if (wsMobileList == null || wsMobileList.isEmpty()) {
                    Thread.sleep(0);
                    continue;
                }

                for (WebSocketSession session : wsMobileList) {
                    synchronized (session) {
                        try {
                            logger.info("@@@Mobile{}", msg);
                            session.sendMessage(new TextMessage(msg));
                        } catch (IOException e) {
                            logger.error(e.getMessage(), e);
                        }
                    }
                }

                Thread.sleep(0);
            } catch (InterruptedException e) {
                logger.error(e.getMessage(), e);
                Thread.currentThread().interrupt();
            }
        }
    }

    public void stop() {
        bRunning = false;
    }
}
