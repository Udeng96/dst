package com.eseict.dst.service.event;

import com.eseict.dst.constants.DstConstants;
import com.eseict.dst.domain.dto.dst.Receiver;
import com.eseict.dst.domain.entity.dst.DisasterHistory;
import com.eseict.dst.domain.entity.dst.DisasterHistoryCctvMapping;
import com.eseict.dst.domain.entity.rino.Event;
import com.eseict.dst.repository.dst.DisasterHistoryRepository;
import com.eseict.dst.repository.rino.EventRepository;
import com.eseict.dst.repository.rino.EventStatRepository;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service("eventStatService")
public class EventStatService {

    private static final Logger logger = LoggerFactory.getLogger(EventStatService.class);

    @Autowired
    private EventStatRepository dao;

    @Autowired
    private EventRepository eventDao;

    @Autowired
    private DisasterHistoryRepository disDao;

    public Workbook getEventStatExcel(String startDt, String endDt) {
        Workbook workbook = new HSSFWorkbook();
        Sheet eventSheet = workbook.createSheet("이벤트 발생 전파 이력");
        String[] headerItemArr = {"발생유형", "발생일시", "처리상태", "발생위치", "발생좌표(Degree)",
            "이벤트 내용", "공유대상", "제목", "공유내용", "CCTV 목록"};
        Row header = eventSheet.createRow(0);
        for (int i = 0; i < headerItemArr.length; i++) {
            header.createCell(i).setCellValue(headerItemArr[i]);
        }

        List<Event> eventList = eventDao.findAllByOrderByOutbDtmDesc();
        List<Event> exportTarget = new ArrayList<>();

        if (startDt != null && !startDt.isBlank()) {
            String searchEndDt = (endDt == null || endDt.isBlank()) ? startDt : endDt;
            for (Event it : eventList) {
                String outbDtm = it.getOutbDtm().substring(0, 8);
                if (Integer.parseInt(outbDtm) >= Integer.parseInt(startDt)
                    && Integer.parseInt(outbDtm) <= Integer.parseInt(searchEndDt)) {
                    exportTarget.add(it);
                }
            }
        } else {
            exportTarget.addAll(eventList);
        }

        Gson gson = new Gson();
        int dataRowNumber = 0;
        int rowStep = 1;

        for (Event item : exportTarget) {
            Row dataRow = eventSheet.createRow(dataRowNumber + rowStep);
            dataRow.createCell(0).setCellValue(item.getSvcThemeNm());
            dataRow.createCell(1).setCellValue(getDtmToDisplayType(item.getOutbDtm()));
            dataRow.createCell(2).setCellValue(getProcStNm(item.getProcSt()));
            dataRow.createCell(3).setCellValue(item.getOutbPlac());
            dataRow.createCell(4).setCellValue("X : " + item.getX() + " / Y : " + item.getY());
            dataRow.createCell(5).setCellValue(item.getStatEvetCntn());

            List<DisasterHistory> disHistoryShareList =
                disDao.findAllByStatEvetOutbSeqnAndType(item.getStatEvetOutbSeqn(),
                    DstConstants.DisasterHistoryType.SHARE.getCode());

            if (disHistoryShareList.isEmpty()) {
                // do nothing
            } else if (disHistoryShareList.size() == 1) {
                DisasterHistory historyItem = disHistoryShareList.get(0);
                List<Receiver> receiverList = gson.fromJson(historyItem.getTransferTarget(),
                    new TypeToken<List<Receiver>>() {}.getType());
                StringBuilder receiverStr = new StringBuilder();
                for (Receiver receiver : receiverList) {
                    receiverStr.append(receiver.getUserName()).append("(").append(receiver.getCpNo()).append("),");
                }
                dataRow.createCell(6).setCellValue(receiverStr.toString());
                dataRow.createCell(7).setCellValue(historyItem.getTitle());
                dataRow.createCell(8).setCellValue(historyItem.getContent());
                Set<DisasterHistoryCctvMapping> cctvMappings = historyItem.getDisasterHistoryCctvMappings();
                StringBuilder cctvIds = new StringBuilder();
                for (DisasterHistoryCctvMapping m : cctvMappings) {
                    cctvIds.append(m.getCctvId()).append(",");
                }
                dataRow.createCell(9).setCellValue(cctvIds.toString());
            } else {
                for (int i = 0; i < disHistoryShareList.size(); i++) {
                    Row innerRow = eventSheet.createRow(dataRowNumber + rowStep);
                    DisasterHistory historyItem = disHistoryShareList.get(i);
                    List<Receiver> receiverList = gson.fromJson(historyItem.getTransferTarget(),
                        new TypeToken<List<Receiver>>() {}.getType());
                    StringBuilder receiverStr = new StringBuilder();
                    for (Receiver receiver : receiverList) {
                        receiverStr.append(receiver.getUserName()).append("(").append(receiver.getCpNo()).append("),");
                    }
                    innerRow.createCell(6).setCellValue(receiverStr.toString());
                    innerRow.createCell(7).setCellValue(historyItem.getTitle());
                    innerRow.createCell(8).setCellValue(historyItem.getContent());
                    Set<DisasterHistoryCctvMapping> cctvMappings = historyItem.getDisasterHistoryCctvMappings();
                    StringBuilder cctvIds = new StringBuilder();
                    for (DisasterHistoryCctvMapping m : cctvMappings) {
                        cctvIds.append(m.getCctvId()).append(",");
                    }
                    innerRow.createCell(9).setCellValue(cctvIds.toString());
                    dataRowNumber++;
                }
            }
            dataRowNumber++;
        }
        return workbook;
    }

    public String getDtmToDisplayType(String dtmStr) {
        return dtmStr.substring(0, 4) + "-" +
            dtmStr.substring(4, 6) + "-" +
            dtmStr.substring(6, 8) + " " +
            dtmStr.substring(8, 10) + ":" +
            dtmStr.substring(10, 12);
    }

    public String getProcStNm(String procSt) {
        switch (procSt) {
            case "1": return "발생";
            case "2": return "지령";
            case "3": return "조치";
            case "4": return "해제";
            default:  return "종료";
        }
    }
}
