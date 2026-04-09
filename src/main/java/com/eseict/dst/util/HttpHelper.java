package com.eseict.dst.util;

import com.github.kittinunf.fuel.core.FuelError;
import com.github.kittinunf.fuel.core.FuelManager;
import com.github.kittinunf.fuel.core.Request;
import com.github.kittinunf.fuel.core.Response;
import com.github.kittinunf.result.Result;
import kotlin.Pair;
import kotlin.Triple;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class HttpHelper {

    private static Triple<Request, Response, Result<String, FuelError>> http(
        Request httpRequest,
        Map<String, Object> header,
        int timeout,
        String body
    ) {
        httpRequest.timeout(timeout);
        if (header != null) httpRequest.header(header);
        if (body != null) {
            httpRequest.header("Content-Type", "application/json");
            httpRequest.body(body, StandardCharsets.UTF_8);
        }
        return (Triple<Request, Response, Result<String, FuelError>>) httpRequest.responseString();
    }

    public static Triple<Request, Response, Result<String, FuelError>> httpGet(
        String url,
        List<Pair<String, Object>> parameters,
        Map<String, Object> header,
        int timeout
    ) {
        Request httpRequest = (parameters == null || parameters.isEmpty())
            ? FuelManager.Companion.getInstance().get(url, Collections.emptyList())
            : FuelManager.Companion.getInstance().get(url, parameters);
        return http(httpRequest, header, timeout, null);
    }

    public static Triple<Request, Response, Result<String, FuelError>> httpGet(
        String url,
        List<Pair<String, Object>> parameters
    ) {
        return httpGet(url, parameters, null, 3000);
    }

    public static Triple<Request, Response, Result<String, FuelError>> httpPost(
        String url,
        List<Pair<String, Object>> parameters,
        Map<String, Object> header,
        int timeout,
        String body
    ) {
        Request httpRequest = (parameters == null || parameters.isEmpty())
            ? FuelManager.Companion.getInstance().post(url, Collections.emptyList())
            : FuelManager.Companion.getInstance().post(url, parameters);
        return http(httpRequest, header, timeout, body);
    }

    public static Triple<Request, Response, Result<String, FuelError>> httpPost(
        String url,
        List<Pair<String, Object>> parameters,
        Map<String, Object> header
    ) {
        return httpPost(url, parameters, header, 3000, null);
    }
}
