package com.eseict.dst.repository.xeus;

import com.eseict.dst.domain.entity.xeus.Cctv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CctvRepository extends JpaRepository<Cctv, String> {

    List<Cctv> findAllByMgrNoIn(List<String> mgrNos);

    Cctv findByMgrNo(String mgrNo);

    Cctv findCctvByDeviceId(String deviceId);
}
