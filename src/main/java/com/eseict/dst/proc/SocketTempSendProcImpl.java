package com.eseict.dst.proc;

import com.eseict.common.log.LoggerManager;
import com.eseict.dst.domain.dto.event.GeneralMessage;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketException;
import java.nio.charset.StandardCharsets;

/**
 * MRS에 이벤트를 보낼 때 사용하는 소켓 전송 구현체.
 * host/port는 application.yml의 mrs.ip / mrs.port 값으로 주입된다.
 * timeout 값은 mrs.timeout-seconds 로 외부화되며 기본값은 3초.
 */
@Component
public class SocketTempSendProcImpl implements SocketSendService {

    private static final Logger logger = LoggerManager.getLogger(SocketTempSendProcImpl.class);

    private static final int RETRY_COUNT = 3;

    private final String host;
    private final int port;
    private final int timeoutSeconds;

    public SocketTempSendProcImpl(
            @Value("${mrs.ip}") String host,
            @Value("${mrs.port}") int port,
            @Value("${mrs.timeout-seconds:3}") int timeoutSeconds) {
        this.host = host;
        this.port = port;
        this.timeoutSeconds = timeoutSeconds;
    }

    @Override
    public boolean send(GeneralMessage gm) throws SocketException {
        logger.info("SOCKET SEND START [{}:{}]", host, port);
        try {
            logger.trace("send header \n{}", new String(gm.getHeader(), StandardCharsets.UTF_8));
            logger.info("send to MRS body ]] {}", new String(gm.getBody(), StandardCharsets.UTF_8));
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        return doSend(os -> {
            os.write(gm.getHeader());
            os.write(gm.getBody());
        });
    }

    @Override
    public boolean send(String message) throws SocketException {
        logger.info("SOCKET SEND START [{}:{}]", host, port);
        return doSend(os -> os.write(message.getBytes(StandardCharsets.UTF_8)));
    }

    /**
     * 실제 소켓 전송 로직. 재시도 포함.
     * {@link SocketWriter}를 통해 전송 내용만 교체해서 send(GeneralMessage) / send(String) 중복을 제거.
     */
    private boolean doSend(SocketWriter writer) throws SocketException {
        boolean result = false;

        for (int i = 0; i < RETRY_COUNT; i++) {
            Socket client = null;
            BufferedOutputStream bos = null;
            try {
                client = new Socket();
                client.connect(new InetSocketAddress(host, port), timeoutSeconds);
                client.setSoTimeout(timeoutSeconds);
                bos = new BufferedOutputStream(client.getOutputStream());
                writer.write(bos);
                bos.flush();
                result = true;
                break;
            } catch (SocketException e) {
                logger.error(e.getMessage(), e);
            } catch (IOException e) {
                logger.error(e.getMessage(), e);
            } finally {
                closeQuietly(bos);
                closeQuietly(client);
            }
        }

        if (!result) {
            throw new SocketException("SOCKET SEND ERROR");
        }

        logger.info("SOCKET SEND SUCCESS [{}:{}]", host, port);
        return true;
    }

    private void closeQuietly(AutoCloseable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        }
    }

    @FunctionalInterface
    private interface SocketWriter {
        void write(BufferedOutputStream os) throws IOException;
    }
}
