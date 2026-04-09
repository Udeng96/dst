package com.eseict.dst.domain.dto.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Arrays;

/**
 * @desc      MRS에 이벤트를 보낼 때 사용하는 기본 메세지 VO
 * @pkg_name  com.eseict.tpm.domain.rino
 * @file_name GeneralMessage.java
 * @since     2018. 05. 09.
 * @author    ESE
 * Copyright(c)2017 by ESE co.ltd. All rights reserved (http://www.eseict.com)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GeneralMessage implements Serializable {

    private static final long serialVersionUID = 2657355430074131014L;

    private byte[] headerTyp = new byte[0];
    private byte[] header = new byte[0];
    private byte[] body = new byte[0];
    private int bodyLen = 0;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GeneralMessage that = (GeneralMessage) o;
        return bodyLen == that.bodyLen
            && Arrays.equals(headerTyp, that.headerTyp)
            && Arrays.equals(header, that.header)
            && Arrays.equals(body, that.body);
    }

    @Override
    public int hashCode() {
        int result = Arrays.hashCode(headerTyp);
        result = 31 * result + Arrays.hashCode(header);
        result = 31 * result + Arrays.hashCode(body);
        result = 31 * result + bodyLen;
        return result;
    }
}
