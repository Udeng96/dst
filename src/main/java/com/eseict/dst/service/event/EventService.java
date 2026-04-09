package com.eseict.dst.service.event;

import com.eseict.common.core.unique.IdGenerator;
import com.eseict.dst.domain.dto.event.EventForSend;
import com.eseict.dst.domain.dto.event.GeneralMessage;
import com.eseict.dst.domain.dto.vworld.CoordToAddressResponse;
import com.eseict.dst.domain.entity.rino.Event;
import com.eseict.dst.domain.entity.rino.EventInfo;
import com.eseict.dst.domain.entity.rino.VwIocEvetGdInfoWithZn;
import com.eseict.dst.proc.SocketSendService;
import com.eseict.dst.repository.rino.EventRepository;
import com.eseict.dst.repository.rino.VwIocEvetInfoWithZnRepository;
import com.eseict.dst.service.vworld.VworldService;
import com.eseict.dst.util.HeaderUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EventService {

    private static final Logger logger = LoggerFactory.getLogger(EventService.class);

    private final VwIocEvetInfoWithZnRepository vwIocEvetInfoWithZnRepository;
    private final EventRepository eventRepository;
    private final VworldService vworldService;
    private final ApplicationEventPublisher eventPublisher;
    private final SocketSendService socketSendService;

    /**
     * 이벤트 조회 기본 시작일 (yyyyMMdd).
     * application.yml event.default-from 으로 설정한다.
     */
    @Value("${event.default-from}")
    private String defaultFrom;

    public EventService(
        VwIocEvetInfoWithZnRepository vwIocEvetInfoWithZnRepository,
        EventRepository eventRepository,
        VworldService vworldService,
        ApplicationEventPublisher eventPublisher,
        SocketSendService socketSendService) {
        this.vwIocEvetInfoWithZnRepository = vwIocEvetInfoWithZnRepository;
        this.eventRepository = eventRepository;
        this.vworldService = vworldService;
        this.eventPublisher = eventPublisher;
        this.socketSendService = socketSendService;
    }

    public List<Event> getEvents(String searchType, String from, String to) {
        String effectiveFrom = (from == null || from.isBlank())
            ? defaultFrom + "000000"
            : from + "000000";
        String effectiveTo = (to == null || to.isBlank())
            ? LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "235959"
            : to + "235959";
        return eventRepository.findEventParam(searchType, effectiveFrom, effectiveTo);
    }

    public Event getEvent(String statEvetOutbSeqn) {
        logger.info("####{}", statEvetOutbSeqn);
        return eventRepository.findById(statEvetOutbSeqn)
            .orElseThrow(() -> new IllegalArgumentException(
                "Event not found: " + statEvetOutbSeqn));
    }

    public List<String> getEventTypes() {
        return eventRepository.findAllEventTypes();
    }

    public List<EventInfo> getEventAllInfo() {
        return eventRepository.findAllEventInfo();
    }

    public String updateEventNewLocation(String statEvetOutbSeqn, float locX, float locY) {
        try {
            CoordToAddressResponse.Response.Result result =
                vworldService.getAddress(String.valueOf(locX), String.valueOf(locY));
            eventRepository.updateEventNewLocation(statEvetOutbSeqn, String.valueOf(locX), String.valueOf(locY));
            eventRepository.updateEventAddress(statEvetOutbSeqn, result.getText() != null ? result.getText() : "");
            return result.getText() != null ? result.getText() : "";
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 이벤트를 종료 처리한다.
     * DB 업데이트는 트랜잭션 내에서 수행하고, 소켓 전송은 커밋 이후
     * {@link EventSocketSendListener}가 실행한다.
     *
     * TODO: Send finish message to MRS
     */
    @Transactional("rinoTransactionManager")
    public Event finishEventById(String statEvetOutbSeqn) {
        try {
            eventRepository.finishEventById(statEvetOutbSeqn);
            Event event = getEvent(statEvetOutbSeqn);
            String statEvetId = event.getZoneId() + event.getSvcThemeCd() + event.getUnitSvcCd()
                + event.getEvetGbCd() + event.getStatEvetCd();
            EventForSend.StatEvetItem[] statEvetItemMap =
                new EventForSend.StatEvetItem[]{new EventForSend.StatEvetItem("origin", "API")};
            GeneralMessage gm = createGeneralMessage(
                event.getUSvcOutbId(), statEvetId, event.getStatEvetNm(), event.getStatEvetGdCd(),
                event.getProcSt(), event.getX(), event.getY(), event.getZnNm(), event.getStatEvetCntn(),
                event.getOutbDtm(), statEvetItemMap, event.getOutbDtm()
            );
            // 트랜잭션 커밋 이후에 소켓 전송 (EventSocketSendListener)
            eventPublisher.publishEvent(new EventFinishedEvent(gm));
            return event;
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
    }

    private GeneralMessage createGeneralMessage(
        String uSvcOutbId, String statEvetId, String statEvetNm,
        String statEvetGdCd, String procSt, String x, String y,
        String outbPosNm, String statEvetCntn, String statEvetOutbDtm,
        EventForSend.StatEvetItem[] statEvetItemMap, String statEvetClrDtm
    ) {
        try {
            EventForSend eventForSend = new EventForSend(
                uSvcOutbId, statEvetId, statEvetNm,
                statEvetGdCd, procSt, x, y, outbPosNm, statEvetCntn, statEvetOutbDtm,
                statEvetItemMap, statEvetClrDtm
            );
            ObjectMapper mapper = new ObjectMapper();
            byte[] body = mapper.writeValueAsString(eventForSend).getBytes(java.nio.charset.StandardCharsets.UTF_8);
            byte[] header = HeaderUtil.makeHeader(
                "A1", "API", "001", "1", IdGenerator.getUUID64(), body.length
            );
            return new GeneralMessage("A1".getBytes(java.nio.charset.StandardCharsets.UTF_8), header, body, body.length);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void generate(String evetId, String evetNm, String address, String x, String y) {
        String uSvcOutbId = IdGenerator.getUUID64();
        EventForSend.StatEvetItem[] statEvetItemMap =
            new EventForSend.StatEvetItem[]{new EventForSend.StatEvetItem("img_name", "-")};
        String dateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));

        String[] parts = evetId.split("_");
        String statEvetId = parts[0];
        String statEvetGdCd = parts[1];

        GeneralMessage gm = createGeneralMessage(
            uSvcOutbId, statEvetId, evetNm,
            statEvetGdCd, "1", x, y,
            address, "이벤트 발생 - " + evetNm, dateTime, statEvetItemMap, ""
        );
        // generate는 트랜잭션 없이 직접 전송 (이벤트 생성이므로 즉시 전송 의도)
        try {
            socketSendService.send(gm);
        } catch (Exception e) {
            logger.error("[generate] 소켓 전송 실패: {}", e.getMessage(), e);
        }
    }

    public Map<String, VwIocEvetGdInfoWithZn> getEventGdInfoMapWithZn() {
        List<VwIocEvetGdInfoWithZn> eventGdList = vwIocEvetInfoWithZnRepository.selectEventGdInfoNoZnList();
        Map<String, VwIocEvetGdInfoWithZn> result = new HashMap<>();
        for (VwIocEvetGdInfoWithZn eventGdInfo : eventGdList) {
            result.put(eventGdInfo.getEvetId() + "#" + eventGdInfo.getEvetGdCd(), eventGdInfo);
        }
        return result;
    }
}
