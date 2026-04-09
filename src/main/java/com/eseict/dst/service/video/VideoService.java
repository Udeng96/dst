package com.eseict.dst.service.video;

import com.eseict.dst.controller.video.VideoController;
import com.eseict.dst.domain.dto.mobile.MobileInfo;
import com.eseict.dst.domain.dto.video.VideoInfo;
import com.eseict.dst.domain.entity.xeus.Cctv;
import com.eseict.dst.repository.dst.DisasterHistoryVideoMappingRepository;
import com.eseict.dst.repository.dst.MobileRepository;
import com.eseict.dst.repository.xeus.CctvRepository;
import com.eseict.dst.service.disasterHistory.DisasterHistoryVideoService;
import com.eseict.dst.service.mobile.MobileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VideoService {

    @Autowired
    private MobileService mobileService;

    @Autowired
    private DisasterHistoryVideoService disasterHistoryVideoService;

    @Autowired
    private CctvRepository cctvRepository;

    @Autowired
    private MobileRepository mobileRepository;

    @Autowired
    private DisasterHistoryVideoMappingRepository disasterHistoryRepository;

    private static final Logger logger = LoggerFactory.getLogger(VideoController.class);

    // cctv와 mobile 영상 통합 (공유 CCTV)
    public List<VideoInfo> getVideos() {
        List<String> cctvUrls = disasterHistoryRepository.findAll().stream()
            .filter(it -> !"mobile".equals(it.getType()))
            .map(it -> it.getUrl())
            .collect(Collectors.toList());

        List<Cctv> cctvList = cctvRepository.findAllByMgrNoIn(cctvUrls);
        List<MobileInfo> mobileList = mobileService.getAllList();

        List<VideoInfo> videoList = new ArrayList<>();
        videoList = cctvToVideo(cctvList, videoList);
        videoList = mobileToVideo(mobileList, videoList);

        return videoList;
    }

    public List<VideoInfo> getVideosByDisasterId(String disasterHistoryId) {
        var disasterHistoryVideoMapping = disasterHistoryVideoService.getVideoMappings(disasterHistoryId);
        logger.info("disasterHistoryVideoMapping:{}", disasterHistoryVideoMapping);

        List<MobileInfo> mobileList = new ArrayList<>();
        List<Cctv> cctvList = new ArrayList<>();
        List<VideoInfo> videoList = new ArrayList<>();

        for (var it : disasterHistoryVideoMapping) {
            if ("mobile".equals(it.getType())) {
                mobileList.add(mobileRepository.getByMgrNo(it.getId()));
            } else {
                cctvList.add(cctvRepository.findByMgrNo(it.getUrl()));
            }
        }

        videoList = cctvToVideo(cctvList, videoList);
        videoList = mobileToVideo(mobileList, videoList);

        return videoList;
    }

    public List<VideoInfo> cctvToVideo(List<Cctv> cctvList, List<VideoInfo> newVideoList) {
        for (Cctv cctv : cctvList) {
            VideoInfo newVideo = new VideoInfo();
            BigDecimal lat = new BigDecimal(cctv.getX().replace(" ", ""));
            BigDecimal lng = new BigDecimal(cctv.getY().replace(" ", ""));
            newVideo.setId(cctv.getDeviceId());
            newVideo.setUrl(cctv.getMgrNo());
            newVideo.setType(cctv.getClftNm());
            newVideo.setLat(lat);
            newVideo.setLng(lng);
            newVideo.setNm(cctv.getCctvNm());
            newVideoList.add(newVideo);
        }
        return newVideoList;
    }

    public List<VideoInfo> mobileToVideo(List<MobileInfo> mobileList, List<VideoInfo> newVideoList) {
        for (MobileInfo mobile : mobileList) {
            VideoInfo newVideo = new VideoInfo();
            newVideo.setId(mobile.getId());
            newVideo.setUrl(mobile.getMbUrl());
            newVideo.setType(mobile.getType());
            newVideo.setNm(mobile.getUserDept() + '-' + mobile.getUserNm());
            newVideo.setLng(mobile.getLng());
            newVideo.setLat(mobile.getLat());
            newVideoList.add(newVideo);
        }
        return newVideoList;
    }
}
