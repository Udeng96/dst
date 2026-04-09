package com.eseict.dst.config.web;

import com.eseict.dst.config.interceptor.TokenInterceptor;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * WebMvc 설정을 담당하는 클래스.
 *
 * application.yml 로 웬만한 처리를 다 하려고 했으나,
 * 인증(oms with token) 및 기타 처리(hibernate/jackson) 때문에 필요하게 됐다.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // CORS 관련 설정
    public static final String ALLOWED_METHOD_NAMES = "GET,HEAD,POST,PUT,DELETE,TRACE,OPTIONS,PATCH";

    // TokenInterceptor 에서 UserService 를 사용하려고 빈등록
    @Bean
    public TokenInterceptor tokenInterceptor() {
        return new TokenInterceptor();
    }

    // Jackson fastjson parser 가 Hibernate 의
    // Lazy init object parsing 시 에러를 뱉음.
    // 그래서 구글링 결과 이걸 추가하라고 해서 해결함.
    @Bean
    public Module datatypeHibernateModule() {
        return new Hibernate5Module();
    }

    @Bean
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        multipartResolver.setMaxUploadSize(16777216);
        return multipartResolver;
    }

    // Custom Error
    @Bean
    public ConfigurableServletWebServerFactory webServerFactory() {
        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
        factory.addErrorPages(new ErrorPage(HttpStatus.BAD_REQUEST, "/error"));
        factory.addErrorPages(new ErrorPage(HttpStatus.UNAUTHORIZED, "/error"));
        factory.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/error"));
        factory.addErrorPages(new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/error"));
        return factory;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        boolean isDebug = Boolean.parseBoolean(System.getenv("RINO_APP_DEBUG"));
        if (isDebug) {
            registry.addInterceptor(tokenInterceptor());
        } else {
            registry.addInterceptor(tokenInterceptor())
                .addPathPatterns("/")
                .addPathPatterns("/main/**");
            //            .excludePathPatterns("/share/**")
            //            .excludePathPatterns("/static/**")
            //            .excludePathPatterns("/fonts/**")
            //            .excludePathPatterns("/error/**")
            //            .excludePathPatterns("/disasterHistories/**")
            //            .excludePathPatterns("/cctvs/**")
            //            .excludePathPatterns("/events/**")
        }
    }
}
