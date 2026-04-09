package com.eseict.dst.config.database;

import org.hibernate.cfg.Environment;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

import javax.sql.DataSource;
import java.util.Properties;

/**
 * 멀티 데이터소스 공통 설정 추상 클래스.
 * 각 DB Config 클래스는 이 클래스를 상속하여 prefix, dialect, persistenceUnitName,
 * entityPackage, hbm2ddl 값만 정의하면 된다.
 */
public abstract class AbstractDataContextConfig {

    /**
     * Hibernate dialect (예: "org.hibernate.dialect.PostgreSQLDialect")
     */
    protected abstract String dialect();

    /**
     * persistence unit 이름 (예: "dst")
     */
    protected abstract String persistenceUnitName();

    /**
     * 엔티티 패키지 경로 (예: "com.eseict.dst.domain.entity.dst")
     */
    protected abstract String entityPackage();

    /**
     * hbm2ddl.auto 값 — 기본값 "none". 필요 시 오버라이드.
     */
    protected String hbm2ddl() {
        return "none";
    }

    protected LocalContainerEntityManagerFactoryBean buildEntityManager(DataSource dataSource) {
        Properties jpaProperties = new Properties();
        jpaProperties.put(Environment.HBM2DDL_AUTO, hbm2ddl());
        jpaProperties.put(Environment.SHOW_SQL, "false");
        jpaProperties.put(Environment.DIALECT, dialect());

        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan(entityPackage());
        em.setPersistenceUnitName(persistenceUnitName());
        em.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        em.setJpaProperties(jpaProperties);

        return em;
    }

    protected JpaTransactionManager buildTransactionManager(LocalContainerEntityManagerFactoryBean em) {
        return new JpaTransactionManager(em.getObject());
    }
}
