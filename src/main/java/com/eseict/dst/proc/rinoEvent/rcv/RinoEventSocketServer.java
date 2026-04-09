package com.eseict.dst.proc.rinoEvent.rcv;

import com.eseict.common.log.LoggerManager;
import com.eseict.dst.proc.rinoEvent.rcv.codec.RinoEventServerMessageDecoder;
import com.eseict.dst.proc.rinoEvent.rcv.codec.RinoEventServerMessageEncoder;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.util.concurrent.Future;
import org.slf4j.Logger;

import javax.annotation.PreDestroy;

public class RinoEventSocketServer {

    private static final Logger logger = LoggerManager.getLogger(RinoEventSocketServer.class);

    private int serverPort;
    private ServerBootstrap serverBootstrap;
    private EventLoopGroup bossGroup;
    private EventLoopGroup workerGroup;

    private RinoEventSocketServer(int serverPort) {
        this.serverPort = serverPort;
    }

    // double-checked locking singleton
    @SuppressWarnings("DoubleCheckedLocking")
    private static volatile RinoEventSocketServer instance;

    public static RinoEventSocketServer getInstance(int serverPort) {
        if (instance == null) {
            synchronized (RinoEventSocketServer.class) {
                if (instance == null) {
                    instance = new RinoEventSocketServer(serverPort);
                }
            }
        }
        return instance;
    }

    public void init() {
        // NioEventLoopGroup 는 멀티 쓰레드 이벤트 루프
        // bossGroup는 들어오는 연결을 수락
        // workerGroup는 연결의 트래픽 처리
        bossGroup = new NioEventLoopGroup();
        workerGroup = new NioEventLoopGroup();
        try {
            // ServerBootstrap는 서버설정 도우미 클래스
            serverBootstrap = new ServerBootstrap();
            serverBootstrap.group(bossGroup, workerGroup)
                // NioServerSocketChannel 클래스를 이용하여 새로운 채널 생성 (인스턴스화)
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws IllegalArgumentException {
                        ChannelPipeline channelPipeline = ch.pipeline();
                        channelPipeline
                            .addLast("decoder", new RinoEventServerMessageDecoder())
                            .addLast("encoder", new RinoEventServerMessageEncoder())
                            .addLast("handler", new RinoEventSocketHandler());
                    }
                })
                .option(ChannelOption.SO_BACKLOG, 128)           // worker thread 최대 개수
                .childOption(ChannelOption.SO_KEEPALIVE, true);  // 연결 유지 셋팅

            // 바인딩 해서 들어오는 연결을 수락
            ChannelFuture fText = serverBootstrap.bind(serverPort).sync(); // 서버 시작
            logger.info("[ {} ] RINO EVENT Socket Server Bind", serverPort);
        } catch (InterruptedException e) {
            // 소켓 바인드 에러
            logger.trace("SOCKET BIND ERROR [{}]", serverPort);
            logger.error(e.getMessage(), e);
            Thread.currentThread().interrupt();
            System.exit(1);
        } finally {
            logger.trace(" SocketServerNettyMain.init() finally");
        }
    }

    /**
     * 소켓서버 언바인드
     */
    public void socServerStop() {
        // TODO 소켓 서버 stop 메소드
        if (workerGroup != null) workerGroup.shutdownGracefully();
        if (bossGroup != null) bossGroup.shutdownGracefully();
    }

    @PreDestroy
    public void destroy() {
        logger.debug("SocketServerMain Destroy Start");
        // TODO 소켓 서버 Destroy 메소드
        Future<?> wg = (workerGroup != null) ? workerGroup.shutdownGracefully().syncUninterruptibly() : null;
        Future<?> bg = (bossGroup != null) ? bossGroup.shutdownGracefully().syncUninterruptibly() : null;
        try {
            if (wg != null) wg.await();
            if (bg != null) bg.await();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        logger.debug("SocketServerMain Destroy Finished");
    }
}
