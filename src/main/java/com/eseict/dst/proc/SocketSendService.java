package com.eseict.dst.proc;

import com.eseict.dst.domain.dto.event.GeneralMessage;

import java.net.SocketException;

/**
 * MRS(소켓) 전송 인터페이스.
 * 구현체는 {@link SocketTempSendProcImpl}이며 Spring Bean으로 관리된다.
 */
public interface SocketSendService {

    /**
     * GeneralMessage(헤더 + 바디 바이트 배열)를 MRS에 전송한다.
     */
    boolean send(GeneralMessage gm) throws SocketException;

    /**
     * 문자열 메시지를 MRS에 전송한다.
     */
    boolean send(String message) throws SocketException;
}
