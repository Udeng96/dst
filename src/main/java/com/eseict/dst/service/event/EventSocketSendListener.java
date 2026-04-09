package com.eseict.dst.service.event;

import com.eseict.dst.proc.SocketSendService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * 이벤트 종료 트랜잭션 커밋 이후에 소켓 전송을 실행한다.
 * 트랜잭션 롤백 시에는 소켓 전송이 실행되지 않는다.
 */
@Component
public class EventSocketSendListener {

    private static final Logger logger = LoggerFactory.getLogger(EventSocketSendListener.class);

    private final SocketSendService socketSendService;

    public EventSocketSendListener(SocketSendService socketSendService) {
        this.socketSendService = socketSendService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onEventFinished(EventFinishedEvent event) {
        try {
            socketSendService.send(event.getGeneralMessage());
        } catch (Exception e) {
            logger.error("[EventSocketSendListener] 소켓 전송 실패: {}", e.getMessage(), e);
        }
    }
}
