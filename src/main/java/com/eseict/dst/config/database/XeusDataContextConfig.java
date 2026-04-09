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
    basePackages = "com.eseict.dst.repository.xeus",
    entityManagerFactoryRef = "xeusEntityManager",
    transactionManagerRef = "xeusTransactionManager"
)
public class XeusDataContextConfig extends AbstractDataContextConfig {

    @Override
    protected String dialect() {
        return "org.hibernate.dialect.PostgreSQLDialect";
    }

    @Override
    protected String persistenceUnitName() {
        return "xeus";
    }

    @Override
    protected String entityPackage() {
        return "com.eseict.dst.domain.entity.xeus";
    }

    @Bean(name = "xeusDataSource")
    @ConfigurationProperties(prefix = "spring.datasource-xeus")
    public DataSource xeusDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "xeusEntityManager")
    public LocalContainerEntityManagerFactoryBean xeusEntityManager(
            @Qualifier("xeusDataSource") DataSource xeusDataSource) {
        return buildEntityManager(xeusDataSource);
    }

    @Bean(name = "xeusTransactionManager")
    public JpaTransactionManager xeusTransactionManager(
            @Qualifier("xeusEntityManager") LocalContainerEntityManagerFactoryBean xeusEntityManager) {
        return buildTransactionManager(xeusEntityManager);
    }
}
