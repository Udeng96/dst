package com.eseict.dst.domain.dto.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class EventForSend {

    private StatusEvent StatEvet;

    public EventForSend(String uSvcOutbId, String statEvetId, String statEvetNm,
                        String statEvetGdCd, String procSt, String x, String y,
                        String outbPosNm, String statEvetCntn, String statEvetOutbDtm,
                        StatEvetItem[] statEvetItem, String statEvetClrDtm) {
        OutbPos outbPos = new OutbPos(x, y, "0");
        int statEvetItemCnt = statEvetItem != null ? statEvetItem.length : 0;
        this.StatEvet = new StatusEvent(
            uSvcOutbId, statEvetId, statEvetNm, statEvetGdCd, procSt,
            1, outbPosNm, new OutbPos[]{outbPos}, statEvetCntn, statEvetOutbDtm,
            0, statEvetItemCnt, statEvetItem, statEvetClrDtm,
            null, null, null, null, null, null, new int[0]
        );
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusEvent {
        private String uSvcOutbId;
        private String statEvetId;
        private String statEvetNm;
        private String statEvetGdCd;
        private String procSt;
        private int outbPosCnt = 0;
        private String outbPosNm;
        private OutbPos[] outbPos;
        private String statEvetCntn;
        private String statEvetOutbDtm;
        private int cpxRelEvetOutbSeqnCnt;
        private int statEvetItemCnt = 0;
        private StatEvetItem[] statEvetItem = new StatEvetItem[0];
        private String statEvetClrDtm;
        private String outbScopRads;
        private String outbMainGb;
        private String statEvetActnMn;
        private String statEvetActnDtm;
        private String statEvetActnCntn;
        private String statEvetActnRslt;
        private int[] cpxRelEvetOutbSeqn = new int[0];
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OutbPos {
        private String x;
        private String y;
        private String z;
    }

    @Getter
    @AllArgsConstructor
    public static class StatEvetItem {
        private final String key;
        private final String value;
    }
}
