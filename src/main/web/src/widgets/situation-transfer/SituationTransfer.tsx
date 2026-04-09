import styled from "styled-components";
import {DisasterHistory, EDisasterHistory} from '@/entities/disaster-history/DisasterHistoryType';
import DisasterHistoryContainer from "../disaster-history/DisasterHistoryContainer";
import SituationTransferTabGroup from "../tab-group/SituationTransferTabGroup";
import {useEffect, useState} from "react";
import {ESituationTransferTab} from '@/shared/ui/Tab/SituationTransferTab';
import Share from "./Share";
import Sms from "./Sms";
import {Event} from '@/entities/event/EventType';
import useDisasterHistoryStore from '@/entities/disaster-history/useDisasterHistoryStore';
import {useVideos} from '@/entities/video/useVideos';

interface ISituationTransfer {
    isSelected: boolean,
    isLoading: boolean,
    disasterHistories: DisasterHistory[],
    selectedEvent: Event
}

export enum ECrudStatus {
    loading,
    create,
    update,
    read
}

export interface IReceiver {
    userId: string,
    userName: string,
    cpNo: string,
}

export interface IOrganization {
    organizationId: string,
    organizationName: string
}

const SituationTransfer = ({isSelected, disasterHistories, isLoading, selectedEvent}: ISituationTransfer) => {
    const disasterHistory = useDisasterHistoryStore((s) => s.selectedDisasterHistory)
    const { setSelectedDisasterHistory } = useDisasterHistoryStore()
    const { refetch: refetchVideos } = useVideos(disasterHistory?.disasterHistoryId)

    const [selectedTab, setSelectedTab] = useState<ESituationTransferTab>(ESituationTransferTab.share)
    const [title, setTitle] = useState<string>(selectedEvent.svcThemeNm);
    const [content, setContent] = useState<string>(selectedEvent.statEvetCntn)
    const [crudStatus, setCrudStatus] = useState<ECrudStatus>(ECrudStatus.loading)
    const [receivers, setReceivers] = useState<IReceiver[]>([])
    const [organizations, setOrganizations] = useState<IOrganization[]>([])
    // 이벤트 상세정보, 상황전파, 조치 및 보고서 탭 바뀔 때마다 read상태로 바뀌도록 side effect 처리


    useEffect(() => {
        if (crudStatus === ECrudStatus.create) {
            if (selectedEvent) {
                if (disasterHistory === null) {
                    setTitle(selectedEvent.svcThemeNm);
                    setContent(selectedEvent.statEvetCntn)
                } else {
                    setTitle(disasterHistory.title);
                    setContent(disasterHistory.content);
                }
            }
        }
    }, [crudStatus, selectedEvent, disasterHistory])

    useEffect(() => {
        setReceivers([])
    }, [selectedTab]);

    useEffect(() => {
        setCrudStatus(ECrudStatus.create)
        setSelectedDisasterHistory(null);
        if (isSelected) {
            if (disasterHistory === null) {
                setTitle(selectedEvent.svcThemeNm);
                setContent(selectedEvent.statEvetCntn)
                setReceivers([]);
            }
        }
    }, [isSelected, disasterHistories]);

    //전파내역 리스트에서 아이템 하나 클릭 시 해당 아이템 타입에 따라 읽어온 transferTarget 파싱
    //하지만 여기서 기존에 json으로 저장되지 않은 것들을 json.parse해버리면 오류가 발생하여
    //try catch 적용
    useEffect(() => {
        if (disasterHistory && disasterHistory.transferTarget) {
            setCrudStatus(ECrudStatus.read)
            try {
                if (disasterHistory.type === EDisasterHistory.transfer) {
                    setOrganizations(JSON.parse(disasterHistory.transferTarget) as IOrganization[])
                    setSelectedTab(ESituationTransferTab.transfer)
                } else if (disasterHistory.type === EDisasterHistory.share) {
                    setReceivers(JSON.parse(disasterHistory.transferTarget) as IReceiver[])
                    setSelectedTab(ESituationTransferTab.share)
                } else if (disasterHistory.type === EDisasterHistory.sms) {
                    setReceivers(JSON.parse(disasterHistory.transferTarget) as IReceiver[])
                    setSelectedTab(ESituationTransferTab.sms)
                }
            } catch (e) {
                setOrganizations([])
                setReceivers([])
            }
        }
        return () => {
            setReceivers([] as IReceiver[])
            setOrganizations([] as IOrganization[])
        }
    }, [disasterHistory])

    //crudStatus가 create 또는 update 상태로 바뀔 경우 기존 read 상태의 내용이 그대로 남아있고
    //또한 create, upddate 상태에서 read 상태로 바뀔 때 기존 create, update 내용이 그대로 남아있는
    //side effect 처리
    useEffect(() => {
        if (crudStatus === ECrudStatus.create || crudStatus === ECrudStatus.update) {
            if (disasterHistory) {
                if (disasterHistory.type === EDisasterHistory.transfer) {
                    setOrganizations([])
                } else if (disasterHistory.type === EDisasterHistory.share || disasterHistory.type === EDisasterHistory.sms) {
                    setReceivers([])
                }
            }

        } else if (crudStatus === ECrudStatus.read) {
            try {
                if (disasterHistory) {
                    if (disasterHistory.type === EDisasterHistory.transfer) {
                        refetchVideos()
                        setOrganizations(JSON.parse(disasterHistory.transferTarget) as IOrganization[])
                    } else if (disasterHistory.type === EDisasterHistory.share || disasterHistory.type === EDisasterHistory.sms) {
                        setReceivers(JSON.parse(disasterHistory.transferTarget) as IReceiver[])
                    }
                }
            } catch (e) {
                setOrganizations([])
                setReceivers([])
            }
        }
    }, [crudStatus])


    useEffect(() => {
        if (disasterHistory) {
            if (disasterHistory.type === 1) {
                refetchVideos()
            }
            setCrudStatus(ECrudStatus.read);
        }
    }, [disasterHistory]);

    return <StyledSituationTransferContainer isSelected={isSelected}>
        <StyledHistoryArea>
            <DisasterHistoryContainer isReport={false} name={'전파내역'} disasterHistories={disasterHistories}
                                      crudStatus={crudStatus} setCrudStatus={setCrudStatus}/>
        </StyledHistoryArea>
        <StyledSituationTransferArea>
            <SituationTransferTabGroup selectedTab={selectedTab} setSelectedTab={setSelectedTab} isLoading={isLoading}
                                       setCrudStatus={setCrudStatus}/>
            <StyledSituationTransferMain>
                {/*<Transfer isSelected={selectedTab === ESituationTransferTab.transfer} selectedTab={selectedTab} selectedEvent={selectedEvent}*/}
                {/*          crudStatus={crudStatus} setCrudStatus={setCrudStatus} title={title} setTitle={setTitle}*/}
                {/*          content={content} setContent={setContent} organizations={organizations} setOrganizations={setOrganizations}*/}
                {/*/>*/}
                <Share isSelected={selectedTab === ESituationTransferTab.share} selectedTab={selectedTab}
                       crudStatus={crudStatus} setCrudStatus={setCrudStatus} selectedEvent={selectedEvent}
                       title={title} setTitle={setTitle} content={content} setContent={setContent}
                       receivers={receivers} setReceivers={setReceivers}
                />
                <Sms isSelected={selectedTab === ESituationTransferTab.sms} selectedTab={selectedTab}
                     crudStatus={crudStatus} setCrudStatus={setCrudStatus} selectedEvent={selectedEvent}
                     title={title} setTitle={setTitle} content={content} setContent={setContent} receivers={receivers}
                     setReceivers={setReceivers}
                />
            </StyledSituationTransferMain>
        </StyledSituationTransferArea>
    </StyledSituationTransferContainer>
}

const StyledSituationTransferMain = styled.main`
    width: 94%;
    height: 94%;
    padding: 3%;
    display: flex;
`

const StyledHistoryArea = styled.aside`
    width: 25%;
    height: 100%;
    display: flex;
`

const StyledSituationTransferArea = styled.aside`
    width: 75%;
    height: 100%;

    overflow: hidden;

    margin-left: 10px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    border-radius: 0.625vw;
    background-color: #292a33;

`

const StyledSituationTransferContainer = styled.article<{
    isSelected: boolean,
}>`
    display: ${({isSelected}) => isSelected ? 'flex' : 'none'};
    width: 100%;
    height: 100%;
    flex: 1;
    padding: 1% 0;
    justify-content: space-between;
    align-items: flex-start;

    //justify-content: space-be
`

export default SituationTransfer