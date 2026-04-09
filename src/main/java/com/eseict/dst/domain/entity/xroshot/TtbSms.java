package com.eseict.dst.domain.entity.xroshot;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "ttb_sms", schema = "c50")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class TtbSms implements Serializable {

    @Id
    @Column(name = "snd_mn", length = 20)
    private String sndMn = "";

    @Id
    @Column(name = "rcv_mn", length = 50)
    private String rcvMn = "";

    @Id
    @Column(name = "snd_dtm", length = 14)
    private String sndDtm = "";

    @Column(name = "msg_cntn", length = 4000)
    private String msgCntn = "";

    @Column(name = "proc_st", length = 1)
    private String procSt = "";

    public TtbSms(String sndMn, String rcvMn, String sndDtm, String msgCntn, String procSt) {
        this.sndMn = sndMn;
        this.rcvMn = rcvMn;
        this.sndDtm = sndDtm;
        this.msgCntn = msgCntn;
        this.procSt = procSt;
    }
}
