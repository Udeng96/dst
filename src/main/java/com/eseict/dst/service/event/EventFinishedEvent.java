package com.eseict.dst.service.event;

import com.eseict.dst.domain.dto.event.GeneralMessage;

/**
 * 이벤트 종료 처리 완료 후 소켓 전송을 트랜잭션 후처리로 분리하기 위한 도메인 이벤트.
 * {@link EventService#finishEventById}에서 발행하고,
 * {@link EventSocketSendListener}가 트랜잭션 커밋 후에 소켓 전송을 실행한다.
 */
public class EventFinishedEvent {

    private final GeneralMessage generalMessage;

    public EventFinishedEvent(GeneralMessage generalMessage) {
        this.generalMessage = generalMessage;
    }

    public GeneralMessage getGeneralMessage() {
        return generalMessage;
    }
}
