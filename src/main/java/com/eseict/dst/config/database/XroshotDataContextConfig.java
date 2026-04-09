package com.eseict.dst.config.database;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import javax.sql.DataSource;

@Configuration
@EnableJpaRepositories(
    basePackages = "com.eseict.dst.repository.xroshot",
    entityManagerFactoryRef = "xroshotEntityManager",
    transactionManagerRef = "xroshotTransactionManager"
)
public class XroshotDataContextConfig extends AbstractDataContextConfig {

    @Override
    protected String dialect() {
        // xroshot는 Oracle DB 사용
        return "org.hibernate.dialect.OracleDialect";
    }

    @Override
    protected String persistenceUnitName() {
        return "xroshot";
    }

    @Override
    protected String entityPackage() {
        return "com.eseict.dst.domain.entity.xroshot";
    }

    @Bean(name = "xroshotDataSource")
    @ConfigurationProperties(prefix = "spring.datasource-xroshot")
    public DataSource xroshotDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "xroshotEntityManager")
    public LocalContainerEntityManagerFactoryBean xroshotEntityManager(
            @Qualifier("xroshotDataSource") DataSource xroshotDataSource) {
        return buildEntityManager(xroshotDataSource);
    }

    @Bean(name = "xroshotTransactionManager")
    public JpaTransactionManager xroshotTransactionManager(
            @Qualifier("xroshotEntityManager") LocalContainerEntityManagerFactoryBean xroshotEntityManager) {
        return buildTransactionManager(xroshotEntityManager);
    }
}
