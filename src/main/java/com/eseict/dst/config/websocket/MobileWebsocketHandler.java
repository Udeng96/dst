package com.eseict.dst.config.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class MobileWebsocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(MobileWebsocketHandler.class);

    // CopyOnWriteArrayList: 읽기 빈도가 높고 쓰기(연결/해제)가 드문 WebSocket 세션 관리에 적합
    private final List<WebSocketSession> sessionList = new CopyOnWriteArrayList<>();

    public List<WebSocketSession> getSessionList() {
        return sessionList;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        sessionList.add(session);
        logger.info("WEBSOCKET [MOBILE] Connected[{}]", session.getRemoteAddress());
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        super.handleMessage(session, message);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        super.handleTransportError(session, exception);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
        sessionList.remove(session);
        logger.info("WEBSOCKET [MOBILE] Disconnected[{}]", session.getRemoteAddress());
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }
}
