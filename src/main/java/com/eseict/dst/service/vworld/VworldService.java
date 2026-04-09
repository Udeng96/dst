package com.eseict.dst.service.vworld;

import com.eseict.dst.config.properties.ApiProperties;
import com.eseict.dst.domain.dto.vworld.CoordToAddressResponse;
import com.eseict.dst.util.HttpHelper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.kittinunf.fuel.core.FuelError;
import com.github.kittinunf.fuel.core.Request;
import com.github.kittinunf.fuel.core.Response;
import com.github.kittinunf.result.Result;
import kotlin.Pair;
import kotlin.Triple;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class VworldService {

    private static final Logger logger = LoggerFactory.getLogger(VworldService.class);

    @Autowired
    private ApiProperties apiProperties;

    public CoordToAddressResponse.Response.Result getAddress(String x, String y) {
        ApiProperties.Api vworldApi = apiProperties.getApi("vworld");
        String url = vworldApi.getUrl();
        String subUrl = vworldApi.getSubUrls().get("coordToAddr");
        Map<String, String> params = vworldApi.getParams();

        List<Pair<String, Object>> parameters = new ArrayList<>();
        parameters.add(new Pair<>("service", params.get("coordToAddrService")));
        parameters.add(new Pair<>("request", params.get("coordToAddrReq")));
        parameters.add(new Pair<>("version", params.get("version")));
        parameters.add(new Pair<>("crs", params.get("crs")));
        parameters.add(new Pair<>("point", x + "," + y));
        parameters.add(new Pair<>("format", params.get("format")));
        parameters.add(new Pair<>("type", params.get("type")));
        parameters.add(new Pair<>("zipcode", params.get("zipcode")));
        parameters.add(new Pair<>("simple", params.get("simple")));
        parameters.add(new Pair<>("key", params.get("key")));

        CoordToAddressResponse decodedResponse = new CoordToAddressResponse(null);
        try {
            Triple<Request, Response, Result<String, FuelError>> triple =
                HttpHelper.httpGet(url + subUrl, parameters);
            String response = triple.getThird().component1();
            if (response != null) {
                ObjectMapper mapper = new ObjectMapper();
                mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
                decodedResponse = mapper.readValue(response, CoordToAddressResponse.class);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return decodedResponse.getResponse().getResult().get(0);
    }
}
