package com.eseict.dst.repository.rino;

import com.eseict.dst.domain.entity.rino.Event;
import com.eseict.dst.domain.entity.rino.EventInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {

    List<Event> findAllByOrderByOutbDtmDesc();

    List<Event> findTop1000ByOrderByOutbDtmDesc();

    @Query(
        "SELECT E FROM Event E " +
        "WHERE (:searchType = '' OR E.procSt = :searchType) " +
        "AND (:fromm = '' OR E.outbDtm >= :fromm) " +
        "AND (:to = '' OR E.outbDtm <= :to) " +
        "ORDER BY E.outbDtm DESC"
    )
    List<Event> findEventParam(String searchType, String fromm, String to);

    @Transactional("rinoTransactionManager")
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value =
        "UPDATE rino_ioc.ioc_stat_evet_outb_hist " +
        "SET proc_st = '5' " +
        "WHERE stat_evet_outb_seqn = :statEvetOutbSeqn",
        nativeQuery = true)
    void finishEventById(String statEvetOutbSeqn);

    @Transactional("rinoTransactionManager")
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value =
        "UPDATE rino_ioc.ioc_stat_evet_pos_hist " +
        "SET x_crdnt = :locX, y_crdnt = :locY " +
        "WHERE stat_evet_outb_seqn = :statEvetOutbSeqn",
        nativeQuery = true)
    void updateEventNewLocation(String statEvetOutbSeqn, String locX, String locY);

    @Transactional("rinoTransactionManager")
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value =
        "UPDATE rino_ioc.ioc_stat_evet_outb_hist " +
        "SET outb_plac = :address " +
        "WHERE stat_evet_outb_seqn = :statEvetOutbSeqn",
        nativeQuery = true)
    void updateEventAddress(String statEvetOutbSeqn, String address);

    @Query("SELECT DISTINCT statEvetNm FROM Event")
    List<String> findAllEventTypes();

    @Query("SELECT e FROM EventInfo e")
    List<EventInfo> findAllEventInfo();
}
