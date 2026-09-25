package com.rutaia.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class N8nConfig {

    @Bean
    public RestClient restClient() {
        return RestClient.create();
    }
}