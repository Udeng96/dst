package com.eseict.dst.proc.rinoEvent.rcv.codec;

import com.eseict.common.log.LoggerManager;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToByteEncoder;
import org.slf4j.Logger;

import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

public class RinoEventServerMessageEncoder extends MessageToByteEncoder<String> {

    private static final Logger logger = LoggerManager.getLogger(RinoEventServerMessageEncoder.class);

    @Override
    protected void encode(ChannelHandlerContext ctx, String gm, ByteBuf out) {
        try {
            logger.trace("ACK RETURN [{}]", new String(gm.getBytes(), Charset.forName("UTF-8")));
            out.writeBytes(gm.getBytes(StandardCharsets.UTF_8));
            out.release();
            ctx.flush();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }
}
