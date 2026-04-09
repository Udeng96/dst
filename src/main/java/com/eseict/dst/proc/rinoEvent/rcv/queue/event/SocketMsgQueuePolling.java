package com.eseict.dst.proc.rinoEvent.rcv.queue.event;

import com.eseict.common.log.LoggerManager;
import com.eseict.dst.config.websocket.EventWebsocketHandler;
import com.eseict.dst.config.websocket.MobileWebsocketHandler;
import org.slf4j.Logger;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.List;

public class SocketMsgQueuePolling implements Runnable {

    private static final Logger logger = LoggerManager.getLogger(SocketMsgQueuePolling.class);

    private final SocketMsgQueue msgQueue = SocketMsgQueue.getInstance();
    private final EventWebsocketHandler eventWebsocketHandler;
    private final MobileWebsocketHandler mobileWebsocketHandler;
    private volatile boolean bRunning = true;

    public SocketMsgQueuePolling(
            EventWebsocketHandler eventWebsocketHandler,
            MobileWebsocketHandler mobileWebsocketHandler) {
        this.eventWebsocketHandler = eventWebsocketHandler;
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

                List<WebSocketSession> wsList = eventWebsocketHandler.getSessionList();
                if (wsList != null && !wsList.isEmpty()) {
                    for (WebSocketSession session : wsList) {
                        synchronized (session) {
                            try {
                                logger.info("@@@{}", msg);
                                session.sendMessage(new TextMessage(msg));
                            } catch (IOException e) {
                                logger.error(e.getMessage(), e);
                            }
                        }
                    }
                }

                List<WebSocketSession> wsMobileList = mobileWebsocketHandler.getSessionList();
                if (wsMobileList != null && !wsMobileList.isEmpty()) {
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
