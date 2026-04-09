package com.eseict.dst.repository.rino;

import com.eseict.dst.domain.entity.rino.VwIocEvetGdInfoWithZn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface VwIocEvetInfoWithZnRepository extends JpaRepository<VwIocEvetGdInfoWithZn, String> {

    @Transactional("rinoTransactionManager")
    @Query("SELECT E FROM VwIocEvetGdInfoWithZn E ORDER BY E.znNm ASC, E.svcThemeNm ASC, E.evetNm ASC")
    List<VwIocEvetGdInfoWithZn> selectEventGdInfoNoZnList();
}
