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
    basePackages = "com.eseict.dst.repository.rino",
    entityManagerFactoryRef = "rinoEntityManager",
    transactionManagerRef = "rinoTransactionManager"
)
public class RinoDataContextConfig extends AbstractDataContextConfig {

    @Override
    protected String dialect() {
        return "org.hibernate.dialect.PostgreSQLDialect";
    }

    @Override
    protected String persistenceUnitName() {
        return "rino";
    }

    @Override
    protected String entityPackage() {
        return "com.eseict.dst.domain.entity.rino";
    }

    @Bean(name = "rinoDataSource")
    @ConfigurationProperties(prefix = "spring.datasource-rino")
    public DataSource rinoDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "rinoEntityManager")
    public LocalContainerEntityManagerFactoryBean rinoEntityManager(
            @Qualifier("rinoDataSource") DataSource rinoDataSource) {
        return buildEntityManager(rinoDataSource);
    }

    @Bean(name = "rinoTransactionManager")
    public JpaTransactionManager rinoTransactionManager(
            @Qualifier("rinoEntityManager") LocalContainerEntityManagerFactoryBean rinoEntityManager) {
        return buildTransactionManager(rinoEntityManager);
    }
}
