package com.eseict.dst.proc.rinoEvent.rcv.codec;

import com.eseict.common.base.ByteSupport;
import com.eseict.common.base.ByteSupportException;
import com.eseict.common.log.LoggerManager;
import com.eseict.dst.domain.dto.event.GeneralMessage;
import com.eseict.dst.util.HeaderUtil;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.ByteToMessageDecoder;
import org.slf4j.Logger;


import java.nio.ByteOrder;
import java.nio.charset.Charset;
import java.util.List;

public class RinoEventServerMessageDecoder extends ByteToMessageDecoder {

    private static final Logger logger = LoggerManager.getLogger(RinoEventServerMessageDecoder.class);

    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) {
        try {
            // 수신된 메시지가 최소한 헤더 사이즈 크기
            if (in.readableBytes() < HeaderUtil.getHeaderTotalLen()) {
                return;
            }
            logger.trace("capacity {} , readable {}", in.capacity(), in.readableBytes());

            // 헤더 읽기
            byte[] headerArr = new byte[HeaderUtil.getHeaderTotalLen()];
            in.readBytes(headerArr);
            logger.trace("header total len =  {}", HeaderUtil.getHeaderTotalLen());
            logger.trace("body len =  {}", HeaderUtil.getHeaderItemLength(HeaderUtil.BODY_LEN));
            logger.trace("body start pos =  {}", HeaderUtil.getHeaderItemStartPos(HeaderUtil.BODY_LEN));

            // 헤더 타입 코드
            byte[] headerTypCdByte = new byte[HeaderUtil.getHeaderItemLength(HeaderUtil.HEDR_TYP_CD)];
            System.arraycopy(
                headerArr,
                HeaderUtil.getHeaderItemStartPos(HeaderUtil.HEDR_TYP_CD),
                headerTypCdByte,
                0,
                HeaderUtil.getHeaderItemLength(HeaderUtil.HEDR_TYP_CD)
            );
            String headerTypCd = new String(headerTypCdByte, Charset.forName("UTF-8"));

            // 바디 사이즈 읽기
            byte[] bodyLenArr = new byte[HeaderUtil.getHeaderItemLength(HeaderUtil.BODY_LEN)];
            System.arraycopy(
                headerArr,
                HeaderUtil.getHeaderItemStartPos(HeaderUtil.BODY_LEN),
                bodyLenArr,
                0,
                HeaderUtil.getHeaderItemLength(HeaderUtil.BODY_LEN)
            );
            int bodyLen = ByteSupport.byteArrayToInt(bodyLenArr, ByteOrder.LITTLE_ENDIAN); // byte[] -> int (little endian)

            // 남은 길이와 바디사이즈 일치 체크
            if (in.readableBytes() == bodyLen) {
                // 바디 읽기
                byte[] bodyArr = new byte[bodyLen];
                in.readBytes(bodyArr);

                // GeneralMessage 셋팅
                GeneralMessage message = new GeneralMessage();
                message.setHeaderTyp(headerTypCdByte);
                message.setHeader(headerArr);
                message.setBody(bodyArr);

                // 핸들러로 전달
                out.add(message);
            } else {
                logger.error(
                    "[{}] [ SIZE ERROR ] [ REMAIN : {}, BODY DEMAND : {} ]",
                    headerTypCd,
                    in.readableBytes(),
                    bodyLen
                );
            }
        } catch (IndexOutOfBoundsException e) {
            logger.error(e.getMessage(), e);
        } catch (ArrayStoreException e) {
            logger.error(e.getMessage(), e);
        } catch (UnsupportedOperationException e) {
            logger.error(e.getMessage(), e);
        } catch (ClassCastException e) {
            logger.error(e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            logger.error(e.getMessage(), e);
        } catch (ByteSupportException e) {
            logger.error(e.getMessage(), e);
        }
    }
}
