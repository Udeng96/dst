package com.eseict.dst.repository.dst;

import com.eseict.dst.domain.dto.mobile.MobileInfo;
import com.eseict.dst.domain.entity.dst.MonMbDesc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MobileRepository extends JpaRepository<MonMbDesc, String> {

    @Query(
        "SELECT new com.eseict.dst.domain.dto.mobile.MobileInfo(" +
        "LIVE.mgrNo, 0, LIVE.userId, LIVE.userNm, LIVE.dptNm, LIVE.userDtm, LIVE.lat, LIVE.lon, " +
        "LIVE.mobileChk, LIVE.mbUrl, 'mobile') " +
        "FROM MonMbDesc LIVE " +
        "WHERE LIVE.mobileChk IN (2,3) " +
        "ORDER BY LIVE.userDtm DESC"
    )
    List<MobileInfo> getLiveListWithUserInfo();

    @Query(
        "SELECT new com.eseict.dst.domain.dto.mobile.MobileInfo(" +
        "LIVE.mgrNo, 0, LIVE.userId, LIVE.userNm, LIVE.dptNm, LIVE.userDtm, LIVE.lat, LIVE.lon, " +
        "LIVE.mobileChk, LIVE.mbUrl, 'mobile') " +
        "FROM MonMbDesc LIVE " +
        "WHERE LIVE.mobileChk IN (2,3,4) " +
        "ORDER BY LIVE.userDtm DESC"
    )
    List<MobileInfo> getAllListWithUserInfo();

    @Query(
        "SELECT new com.eseict.dst.domain.dto.mobile.MobileInfo(" +
        "LIVE.mgrNo, 0, LIVE.userId, LIVE.userNm, LIVE.dptNm, " +
        "LIVE.userDtm, LIVE.lat, LIVE.lon, " +
        "LIVE.mobileChk, LIVE.mbUrl, 'mobile') " +
        "FROM MonMbDesc LIVE " +
        "WHERE LIVE.mobileChk IN (2,3) " +
        "AND LIVE.userId = :userId " +
        "ORDER BY LIVE.userDtm DESC"
    )
    MobileInfo getLiveListWithUserInfo(String userId);

    @Query(
        "SELECT new com.eseict.dst.domain.dto.mobile.MobileInfo(" +
        "LIVE.mgrNo, 0, LIVE.userId, LIVE.userNm, LIVE.dptNm, LIVE.userDtm, LIVE.lat, LIVE.lon, " +
        "LIVE.mobileChk, LIVE.mbUrl, 'mobile') " +
        "FROM MonMbDesc LIVE " +
        "WHERE LIVE.mobileChk IN (2,3,4) AND LIVE.mgrNo IN :mgrNos " +
        "ORDER BY LIVE.userDtm DESC"
    )
    List<MobileInfo> getAllByMgrNoIn(List<String> mgrNos);

    @Query(
        "SELECT new com.eseict.dst.domain.dto.mobile.MobileInfo(" +
        "LIVE.mgrNo, 0, LIVE.userId, LIVE.userNm, LIVE.dptNm, LIVE.userDtm, LIVE.lat, LIVE.lon, " +
        "LIVE.mobileChk, LIVE.mbUrl, 'mobile') " +
        "FROM MonMbDesc LIVE " +
        "WHERE LIVE.mobileChk IN (2,3,4) AND LIVE.mgrNo = :mgrNo"
    )
    MobileInfo getByMgrNo(String mgrNo);
}
