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
    basePackages = "com.eseict.dst.repository.dst",
    entityManagerFactoryRef = "dstEntityManager",
    transactionManagerRef = "dstTransactionManager"
)
public class DstDataContextConfig extends AbstractDataContextConfig {

    @Override
    protected String dialect() {
        return "org.hibernate.dialect.PostgreSQLDialect";
    }

    @Override
    protected String persistenceUnitName() {
        return "dst";
    }

    @Override
    protected String entityPackage() {
        return "com.eseict.dst.domain.entity.dst";
    }

    @Bean(name = "dstDataSource")
    @ConfigurationProperties(prefix = "spring.datasource-dst")
    public DataSource dstDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "dstEntityManager")
    public LocalContainerEntityManagerFactoryBean dstEntityManager(
            @Qualifier("dstDataSource") DataSource dstDataSource) {
        return buildEntityManager(dstDataSource);
    }

    @Bean(name = "dstTransactionManager")
    public JpaTransactionManager dstTransactionManager(
            @Qualifier("dstEntityManager") LocalContainerEntityManagerFactoryBean dstEntityManager) {
        return buildTransactionManager(dstEntityManager);
    }
}
