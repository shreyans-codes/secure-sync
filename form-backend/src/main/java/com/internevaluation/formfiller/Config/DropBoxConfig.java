package com.internevaluation.formfiller.Config;

// DropboxConfig.java

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DropBoxConfig {

    @Value("${dropbox.app.key}")
    private String appKey;

    @Value("${dropbox.app.secret}")
    private String appSecret;

    @Value("${dropbox.access.token}")
    private String accessToken;

    public String getAppKey() {
        return appKey;
    }

    public String getAppSecret() {
        return appSecret;
    }

    public String getAccessToken() {
        return accessToken;
    }
}
