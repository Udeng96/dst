package com.eseict.dst.proc.rinoEvent.rcv.queue.event;

import com.google.common.collect.Queues;

import java.util.concurrent.BlockingQueue;

public class SocketMsgQueue {

    private final BlockingQueue<String> msgQueue = Queues.newLinkedBlockingQueue();

    // eager singleton (초기화 시점에 생성)
    private static volatile SocketMsgQueue instance = new SocketMsgQueue();

    private SocketMsgQueue() {}

    public static SocketMsgQueue getInstance() {
        return instance;
    }

    public boolean put(String msg) {
        return msgQueue.add(msg);
    }

    public String take() throws InterruptedException {
        return msgQueue.take();
    }

    public void clear() {
        msgQueue.clear();
    }

    public int size() {
        return msgQueue.size();
    }
}
