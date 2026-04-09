package com.eseict.dst.domain.dto.oms;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * oms api response object
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OmsResponse<T> {
    /** 호출 결과 코드 */
    private String result;

    /** 호출 결과 메시지 */
    private String message;

    /** Data */
    private T data;
}
