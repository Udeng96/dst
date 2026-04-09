package com.eseict.dst.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@ConfigurationProperties(prefix = "dst")
public class ApiProperties {

    private Map<String, Api> apis = new HashMap<>();

    public Map<String, Api> getApis() {
        return apis;
    }

    public void setApis(Map<String, Api> apis) {
        this.apis = apis;
    }

    public Api getApi(String apiKey) {
        if (apis.get(apiKey) == null) {
            throw new IllegalArgumentException("NOT EXIST API KEY : " + apiKey);
        }
        if (apis.get(apiKey).getUrl() == null) {
            throw new IllegalArgumentException("URL NOT EXIST : " + apiKey);
        }
        return apis.get(apiKey);
    }

    public static class Api {
        private String url;
        private Map<String, String> subUrls = Collections.emptyMap();
        private Map<String, String> params = Collections.emptyMap();
        private Map<String, String> headers = Collections.emptyMap();

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public Map<String, String> getSubUrls() {
            return subUrls;
        }

        public void setSubUrls(Map<String, String> subUrls) {
            this.subUrls = subUrls;
        }

        public Map<String, String> getParams() {
            return params;
        }

        public void setParams(Map<String, String> params) {
            this.params = params;
        }

        public Map<String, String> getHeaders() {
            return headers;
        }

        public void setHeaders(Map<String, String> headers) {
            this.headers = headers;
        }
    }
}
