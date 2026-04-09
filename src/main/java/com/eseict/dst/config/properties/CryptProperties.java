package com.eseict.dst.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 암호화 서버 연결 설정을 묶는 ConfigurationProperties.
 * application.yml (api.yml) cryptsvr.* 항목에서 바인딩된다.
 */
@Component
@ConfigurationProperties(prefix = "cryptsvr")
public class CryptProperties {

    private Api api = new Api();
    private System system = new System();
    private String crypt;
    private String encrypt;
    private String decrypt;

    public Api getApi() { return api; }
    public void setApi(Api api) { this.api = api; }

    public System getSystem() { return system; }
    public void setSystem(System system) { this.system = system; }

    public String getCrypt() { return crypt; }
    public void setCrypt(String crypt) { this.crypt = crypt; }

    public String getEncrypt() { return encrypt; }
    public void setEncrypt(String encrypt) { this.encrypt = encrypt; }

    public String getDecrypt() { return decrypt; }
    public void setDecrypt(String decrypt) { this.decrypt = decrypt; }

    public static class Api {
        private String address;

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
    }

    public static class System {
        private String key;
        private String secret;

        public String getKey() { return key; }
        public void setKey(String key) { this.key = key; }

        public String getSecret() { return secret; }
        public void setSecret(String secret) { this.secret = secret; }
    }
}
