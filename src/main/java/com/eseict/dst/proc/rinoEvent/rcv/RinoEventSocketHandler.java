package com.eseict.dst.proc.rinoEvent.rcv;

import com.eseict.common.log.LoggerManager;
import com.eseict.common.web.WebApplicationContextUtil;
import com.eseict.dst.domain.dto.event.GeneralMessage;
import com.eseict.dst.domain.entity.rino.VwIocEvetGdInfoWithZn;
import com.eseict.dst.proc.rinoEvent.rcv.queue.event.SocketMsgQueue;
import com.eseict.dst.service.event.EventService;
import com.eseict.dst.util.HeaderUtil;
import com.google.gson.Gson;
import io.netty.channel.AdaptiveRecvByteBufAllocator;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.channel.RecvByteBufAllocator;
import org.slf4j.Logger;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class RinoEventSocketHandler extends ChannelInboundHandlerAdapter {

    private static final Logger logger = LoggerManager.getLogger(RinoEventSocketHandler.class);
    private String localPort;

    private final RecvByteBufAllocator recvByteBufAllocator = new AdaptiveRecvByteBufAllocator(1024, 8192, 32768);
    public List<ChannelHandlerContext> CHANNEL_HANDLER_CONTEXT_LIST = new ArrayList<>();

    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        // ChannelHandlerContext 오픈시 실행 (처음 접속시)
        String[] localParts = ctx.channel().localAddress().toString().split(":");
        localPort = localParts[1];

        String remoteAddrStr = ctx.channel().remoteAddress().toString().substring(1);
        String remoteIp = remoteAddrStr.split(":")[0];

        logger.trace("localPort =[{}]", localPort);
        logger.trace("remoteIp =[{}]", remoteIp);

        CHANNEL_HANDLER_CONTEXT_LIST.add(ctx);
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        super.channelInactive(ctx);
    }

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) {
        ctx.channel().config().setRecvByteBufAllocator(recvByteBufAllocator);
    }

    @SuppressWarnings("unchecked")
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        GeneralMessage gm = (GeneralMessage) msg;
        logger.info("body  ]{}", new String(gm.getBody(), Charset.forName("UTF-8")));

        try {
            byte[] mepByte = new byte[HeaderUtil.getHeaderItemLength(HeaderUtil.MSG_EXCH_PATRN)];
            System.arraycopy(gm.getHeader(), HeaderUtil.getHeaderItemEndPos(HeaderUtil.MSG_EXCH_PATRN), mepByte, 0, mepByte.length);
            String mep = new String(mepByte, StandardCharsets.UTF_8);

            if ("1".equals(mep)) { // one way
                logger.trace("mep :: {}", mep);
            } else if ("2".equals(mep)) { // one way ack
                GeneralMessage ackGm = new GeneralMessage();
                ackGm.setHeader(HeaderUtil.makeAckHeader(gm.getHeader(), "", "3"));
                ctx.writeAndFlush(ackGm);
                logger.info("ACK HEADER [{}]", new String(ackGm.getHeader(), Charset.forName("UTF-8")));
            }

            String bodyStr = new String(gm.getBody(), Charset.forName("UTF-8")).trim();
            EventService eventInfoService = (EventService) WebApplicationContextUtil
                .getRequiredWebApplicationContext().getBean("eventService");

            // 이벤트 명칭을 삽입하기 위한 DB 조회
            Map<String, VwIocEvetGdInfoWithZn> eventInfoMap = eventInfoService.getEventGdInfoMapWithZn();
            Gson gson = new Gson();
            Map<String, Object> statEvet = gson.fromJson(bodyStr, Map.class);
            Map<String, Object> messageMap = (Map<String, Object>) statEvet.get("StatEvet");
            String statEvetId = (String) messageMap.get("statEvetId");
            String statEvetGdCd = (String) messageMap.get("statEvetGdCd");

            String[] idParts = statEvetId.split("-");
            String lookupKey = idParts[2].substring(3) + "#" + statEvetGdCd;
            VwIocEvetGdInfoWithZn eventInfo = (eventInfoMap != null) ? eventInfoMap.get(lookupKey) : null;
            messageMap.put("znNm", eventInfo != null ? eventInfo.getZnNm() : null);
            messageMap.put("svcThemeNm", eventInfo != null ? eventInfo.getSvcThemeCd() : null);
            messageMap.put("unitSvcNm", eventInfo != null ? eventInfo.getUnitSvcNm() : null);
            statEvet.put("StatEvet", messageMap);
            SocketMsgQueue.getInstance().put(gson.toJson(statEvet));

        } catch (Exception e) {
            e.printStackTrace();
            logger.error(e.getMessage());
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        logger.error(cause.getMessage());
        ctx.close();
    }
}
