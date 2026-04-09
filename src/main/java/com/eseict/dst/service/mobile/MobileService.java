package com.eseict.dst.service.mobile;

import com.eseict.dst.constants.DstConstants;
import com.eseict.dst.controller.mobile.MobileController;
import com.eseict.dst.domain.dto.mobile.MobileInfo;
import com.eseict.dst.repository.dst.MobileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MobileService {

    private static final Logger logger = LoggerFactory.getLogger(MobileController.class);

    @Autowired
    private MobileRepository mobileRepository;

    public List<MobileInfo> getLiveList() {
        return mobileRepository.getLiveListWithUserInfo().stream().map(item -> {
            if (item.getUserDtm() != null && !item.getUserDtm().isEmpty()) {
                item.setUserDtm(changeDateFormat(item.getUserDtm()));
            }
            return item;
        }).collect(Collectors.toList());
    }

    public List<MobileInfo> getAllList() {
        return mobileRepository.getAllListWithUserInfo().stream().map(item -> {
            if (item.getUserDtm() != null && !item.getUserDtm().isEmpty()) {
                item.setUserDtm(changeDateFormat(item.getUserDtm()));
            }
            return item;
        }).collect(Collectors.toList());
    }

    public MobileInfo getLiveInfo(String id) {
        MobileInfo info = mobileRepository.getLiveListWithUserInfo(id);
        if (info.getUserDtm() != null && !info.getUserDtm().isEmpty()) {
            info.setUserDtm(changeDateFormat(info.getUserDtm()));
        }
        return info;
    }

    public String changeDateFormat(String dtm) {
        LocalDateTime dateTime = LocalDateTime.of(
            Integer.parseInt(dtm.substring(0, 4)),
            Integer.parseInt(dtm.substring(4, 6)),
            Integer.parseInt(dtm.substring(6, 8)),
            Integer.parseInt(dtm.substring(8, 10)),
            Integer.parseInt(dtm.substring(10, 12)),
            Integer.parseInt(dtm.substring(12, 14))
        );
        return dateTime.format(DateTimeFormatter.ofPattern(DstConstants.DATE.MILLISECOND_ONE_FORMAT));
    }
}
