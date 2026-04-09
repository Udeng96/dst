import styled from 'styled-components';
import ReceiverTree from '@/shared/ui/ReceiverTree/ReceiverTree';
import { ChangeEvent, useEffect, useState } from 'react';
import { ESituationTransferTab } from '@/shared/ui/Tab/SituationTransferTab';
import { ECrudStatus, IReceiver } from './SituationTransfer';
import usePopupStore, { EPopup, Popup } from '@/app/usePopupStore';
import useDisasterHistoryStore from '@/entities/disaster-history/useDisasterHistoryStore';
import useVideoStore from '@/entities/video/useVideoStore';
import useUserStore from '@/entities/user/useUserStore';
import {
    DisasterHistory,
    DisasterHistoryFileMapping,
    DisasterHistoryVideoMapping,
    EDisasterHistory,
} from '@/entities/disaster-history/DisasterHistoryType';
import { Event } from '@/entities/event/EventType';
import { useSaveDisasterHistory } from '@/entities/disaster-history/useDisasterHistories';
import { useAllMobiles } from '@/entities/mobile/useMobiles';
import CctvSelectPopup from '../cctv-select-popup/CctvSelectPopup';
import { StyledButton } from '@/shared/ui/Button/Button';
import Label from '@/shared/ui/Label/Label';
import { Video } from '@/entities/video/VideoType';
import { uniqueId } from 'lodash-es';
import moment from 'moment';
import { StyledReportButton } from '../report/Report';
import useReceiver from '@/features/share-disaster/useReceiver';
import {
    StyledField,
    StyledInputText,
    StyledInputTextarea,
    StyledReceiverListContainer,
    StyledReceiverListItem,
    StyledReceiverUserContainer,
    StyledAddButton,
    StyledReceiverTreeArea,
} from './situationTransferStyles';

interface IShare {
    isSelected: boolean;
    selectedTab: ESituationTransferTab;
    crudStatus: ECrudStatus;
    setCrudStatus: (status: ECrudStatus) => void;
    title: string;
    setTitle: (title: string) => void;
    content: string;
    setContent: (content: string) => void;
    selectedEvent: Event;
    receivers: IReceiver[];
    setReceivers: (updater: IReceiver[] | ((prev: IReceiver[]) => IReceiver[])) => void;
}

const Share = ({
    isSelected,
    selectedTab,
    crudStatus,
    setCrudStatus,
    title,
    setTitle,
    content,
    setContent,
    selectedEvent,
    receivers,
    setReceivers,
}: IShare) => {
    const disasterHistory = useDisasterHistoryStore((s) => s.selectedDisasterHistory);
    const videoList = useVideoStore((s) => s.videos);
    const { showPopup } = usePopupStore();
    const currentUser = useUserStore((s) => s.currentUser);
    const { mutate: saveDisasterHistory } = useSaveDisasterHistory();
    const { refetch: fetchMobiles } = useAllMobiles();

    const [selectedVideos, setSelectedVideos] = useState<Video[]>([]);
    const [isCctvSelectPopupShow, setCctvSelectPopupShow] = useState<boolean>(false);

    const [searchHour, setSearchHour] = useState<string>(moment().format('HH'));
    const [searchMin, setSearchMin] = useState<string>(moment().format('mm'));
    const [searchDate, setSearchDate] = useState<string>(moment().format('YYYYMMDD'));

    const [pwd, setPwd] = useState<string>('');

    const { name, phone, setName, setPhone, handleAddReceiver, handleDeleteReceiver, resetInputs } = useReceiver({
        receivers,
        setReceivers: setReceivers as (updater: (prev: IReceiver[]) => IReceiver[]) => void,
    });

    const [targetName, setTargetName] = useState('');
    const confirmedId = uniqueId('field');

    useEffect(() => {
        if (disasterHistory) {
            if (disasterHistory.type === 1) {
                if (crudStatus === ECrudStatus.read) {
                    setPwd(disasterHistory.pwd && disasterHistory.pwd !== '' ? '비밀번호가 존재합니다.' : '');
                    setSelectedVideos(videoList.length > 0 ? videoList : []);
                    setSearchDate(moment(disasterHistory.expireDtm, 'YYYYMMDDHHmm').format('YYYY/MM/DD'));
                    setSearchHour(moment(disasterHistory.expireDtm, 'YYYYMMDDHHmm').format('HH') + '시');
                    setSearchMin(moment(disasterHistory.expireDtm, 'YYYYMMDDHHmm').format('mm') + '분');
                } else {
                    setPwd('');
                    setSelectedVideos([]);
                    const newExpireDtm = moment().add(10, 'minutes').format('YYYYMMDDHHmm');
                    setSearchDate(newExpireDtm.substring(0, 8));
                    setSearchHour(newExpireDtm.substring(8, 10));
                    setSearchMin(newExpireDtm.substring(10, 12));
                }
            } else {
                setPwd('');
                const newExpireDtm = moment().add(10, 'minutes').format('YYYYMMDDHHmm');
                setSearchDate(newExpireDtm.substring(0, 8));
                setSearchHour(newExpireDtm.substring(8, 10));
                setSearchMin(newExpireDtm.substring(10, 12));
            }
        } else {
            if (crudStatus === ECrudStatus.read) {
                setSelectedVideos([]);
                const newExpireDtm = moment().add(10, 'minutes').format('YYYYMMDDHHmm');
                setSearchDate(newExpireDtm.substring(0, 8));
                setSearchHour(newExpireDtm.substring(8, 10));
                setSearchMin(newExpireDtm.substring(10, 12));
                setPwd('');
            } else {
                setContent(selectedEvent.statEvetCntn);
                setTitle(selectedEvent.svcThemeNm);
            }
        }
    }, [disasterHistory, receivers, videoList, crudStatus, selectedEvent, selectedTab]);

    const setFindUserName = (userName: string) => {
        setTargetName(userName);
    };

    const handleExpireText = (e: ChangeEvent<HTMLInputElement>, type: string) => {
        const reg = /[^0-9]/g;
        const data = e.target.value.replace(reg, '');
        if (type === 'date') {
            setSearchDate(data);
        } else if (type === 'hour') {
            setSearchHour(data);
        } else if (type === 'min') {
            setSearchMin(data);
        }
    };

    const handleSaveDisasterHistory = () => {
        if (receivers.length === 0) {
            showPopup({ title: '필수 항목 누락', message: '대상을 선택해주세요.', buttonText: '확인', type: EPopup.info, callback: () => {} } as Popup);
            return;
        }
        if (title === '') {
            showPopup({ title: '필수 항목 누락', message: '제목을 입력해주세요.', buttonText: '확인', type: EPopup.info, callback: () => {} } as Popup);
            return;
        }
        if (content === '') {
            showPopup({ title: '필수 항목 누락', message: '내용을 입력해주세요.', buttonText: '확인', type: EPopup.info, callback: () => {} } as Popup);
            return;
        }
        if (searchDate === '') {
            showPopup({ title: '필수 항목 누락', message: '만료 날짜를 입력해주세요.', buttonText: '확인', type: EPopup.info, callback: () => {} } as Popup);
            return;
        }
        if (searchDate.length !== 8 && !moment(searchDate, 'YYYYMMDD', true).isValid()) {
            showPopup({ title: '잘못된 날짜 형식', message: '정확한 날짜 형식으로 입력해주세요(YYYYMMDD)', buttonText: '확인', type: EPopup.info, callback: () => {} } as Popup);
            return;
        }
        if (searchHour === '') {
            showPopup({ title: '필수 항목 누락', message: '만료 시간를 입력해주세요.', buttonText: '확인', type: EPopup.info, callback: () => {} } as Popup);
            return;
        }
        if (searchHour.length !== 2 && !moment(searchHour, 'HH', true).isValid()) {
            showPopup({ title: '잘못된 날짜 형식', message: '정확한 시간 형식으로 입력해주세요(00 ~ 23)', buttonText: '확인', type: EPopup.info, callback: () => {} } as Popup);
            return;
        }
        if (searchMin === '') {
            showPopup({ title: '필수 항목 누락', message: '만료 분을 입력해주세요.', buttonText: '확인', type: EPopup.info, callback: () => {} } as Popup);
            return;
        }
        if (searchMin.length !== 2 && !moment(searchMin, 'mm', true).isValid()) {
            showPopup({ title: '잘못된 분 형식', message: '정확한 분 형식으로 입력해주세요(00 ~ 59)', buttonText: '확인', type: EPopup.info, callback: () => {} } as Popup);
            return;
        }

        const disasterHistoryFileMappings = [] as DisasterHistoryFileMapping[];
        const disasterHistoryData: DisasterHistory = {
            title,
            content,
            type: EDisasterHistory.share,
            regUserId: currentUser.userId,
            expireDtm: `${searchDate.replace(/-/g, '')}${searchHour}${searchMin}`,
            statEvetOutbSeqn: selectedEvent.statEvetOutbSeqn,
            pwd,
            transferTarget: JSON.stringify(receivers),
            disasterHistoryId: '',
            regDate: '',
            disasterHistoryFileMappings,
            disasterHistoryVideoMappings: selectedVideos.map((video, index) => ({
                disasterHistoryId: '',
                disasterHistoryVideoMappingId: '',
                type: video.type,
                id: video.id,
                url: video.url,
                index,
            } as DisasterHistoryVideoMapping)),
        };

        showPopup({
            message: '공유를 등록하시겠습니까?',
            type: EPopup.question,
            buttonText: '등록',
            title: '공유 등록',
            callback: () => {
                saveDisasterHistory(disasterHistoryData, {
                    onSuccess: () => {
                        setTitle('');
                        setContent('');
                        setReceivers([]);
                        setSelectedVideos([]);
                        setSearchDate(moment().format('YYYYMMDD'));
                        setSearchHour(moment().format('HH'));
                        setSearchMin(moment().add(10, 'minutes').format('mm'));
                        resetInputs();
                        setPwd('');
                    },
                });
            },
        } as Popup);
    };

    const isReadMode = crudStatus === ECrudStatus.read;
    const isShareHistory = disasterHistory !== null && disasterHistory.type === 1;

    const titleValue = isReadMode ? (isShareHistory ? disasterHistory.title : '') : title;
    const contentValue = isReadMode ? (isShareHistory ? disasterHistory.content : '') : content;

    return (
        <StyledShare isSelected={isSelected}>
            <CctvSelectPopup
                event={selectedEvent}
                selectedVideos={selectedVideos}
                setSelectedVideos={setSelectedVideos}
                isShow={isCctvSelectPopupShow}
                setShow={setCctvSelectPopupShow}
            />
            <StyledReceiverTreeArea>
                <StyledShareHeader>공유 대상 선택</StyledShareHeader>
                <StyledField>
                    <Label text={'이름'} htmlFor={confirmedId} width={'25%'} />
                    <StyledInputText
                        height={'3vh'}
                        width={'75%'}
                        readOnly={false}
                        placeholder={'이름을 입력하세요'}
                        onChange={(e) => setFindUserName(e.target.value)}
                    />
                </StyledField>
                <ReceiverTree receivers={receivers} setReceivers={setReceivers} crudStatus={crudStatus} findUserName={targetName} />
            </StyledReceiverTreeArea>
            <StyledShareContentArea>
                <StyledShareItem $height={'30%'}>
                    <StyledShareHeader>공유 대상</StyledShareHeader>
                    <StyledShareBody>
                        <StyledReceiverListContainer>
                            {isReadMode && isShareHistory
                                ? receivers.map((receiver, index) => (
                                    <StyledReceiverListItem key={receiver.cpNo}>
                                        {receiver.userName + '(' + receiver.cpNo + ')' + (receivers.length > 1 && index + 1 !== receivers.length ? ',' : '')}
                                    </StyledReceiverListItem>
                                ))
                                : !isReadMode &&
                                  receivers.map((receiver, index) => (
                                    <StyledReceiverListItem key={receiver.cpNo}>
                                        {receiver.userName + '(' + receiver.cpNo + ')'}
                                        <button onClick={() => handleDeleteReceiver(receiver)} />
                                        {receivers.length > 1 && index + 1 !== receivers.length ? ',' : ''}
                                    </StyledReceiverListItem>
                                ))}
                        </StyledReceiverListContainer>
                        {!isReadMode && (
                            <StyledReceiverUserContainer>
                                <StyledInputText
                                    readOnly={false}
                                    placeholder={'이름을 입력해주세요'}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    height={'3vh'}
                                    width={'40%'}
                                />
                                <StyledInputText
                                    readOnly={false}
                                    placeholder={'번호을 입력해주세요'}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    height={'3vh'}
                                    width={'60%'}
                                />
                                <StyledAddButton onClick={handleAddReceiver}>추가</StyledAddButton>
                            </StyledReceiverUserContainer>
                        )}
                    </StyledShareBody>
                </StyledShareItem>
                <StyledShareItem $height={'70%'}>
                    <StyledShareHeader>공유 내용</StyledShareHeader>
                    <StyledShareBody>
                        <StyledField>
                            <Label text={'암호'} htmlFor={confirmedId} width={'15%'} />
                            <StyledInputText
                                readOnly={isReadMode}
                                placeholder={isReadMode ? '' : '암호를 입력하세요'}
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                                height={'3vh'}
                                width={'85%'}
                            />
                        </StyledField>
                        <StyledField>
                            <Label text={'만료'} htmlFor={confirmedId} width={'15%'} />
                            <StyledInputText
                                width={'45%'}
                                height={'3vh'}
                                value={searchDate}
                                readOnly={isReadMode}
                                onChange={(e) => handleExpireText(e, 'date')}
                                pattern="[0-9]*"
                                placeholder={'날짜(YYYYMMDD)'}
                            />
                            <StyledInputText
                                width={'12%'}
                                height={'3vh'}
                                value={searchHour}
                                readOnly={isReadMode}
                                onChange={(e) => handleExpireText(e, 'hour')}
                                pattern="[0-9]*"
                                placeholder={'시간(00 ~ 23)'}
                            />
                            <StyledInputText
                                width={'12%'}
                                height={'3vh'}
                                value={searchMin}
                                readOnly={isReadMode}
                                onChange={(e) => handleExpireText(e, 'min')}
                                pattern="[0-9]*"
                                placeholder={'분(00 ~ 59)'}
                            />
                        </StyledField>
                        <StyledField>
                            <Label text={'제목'} htmlFor={confirmedId} width={'15%'} />
                            <StyledInputText
                                readOnly={isReadMode}
                                placeholder={isReadMode ? '' : '제목을 입력하세요'}
                                value={titleValue}
                                onChange={(e) => setTitle(e.target.value)}
                                height={'3vh'}
                                width={'85%'}
                            />
                        </StyledField>
                        <StyledField>
                            <Label text={'내용'} htmlFor={confirmedId} width={'15%'} />
                            <StyledInputTextarea
                                readOnly={isReadMode}
                                placeholder={isReadMode && disasterHistory === null ? '' : '내용을 입력하세요'}
                                value={contentValue}
                                onChange={(e) => setContent(e.target.value)}
                                height={'4vh'}
                                width={'85%'}
                            />
                        </StyledField>
                        <StyledField>
                            <Label text={'CCTV'} htmlFor={'cctvList'} width={'15%'} />
                            <StyledCctvContainer $width={isReadMode ? '85%' : '70%'}>
                                {(isReadMode ? isShareHistory : true) &&
                                    selectedVideos.map((video, index) => (
                                        <StyledCctvListItem key={video.id}>
                                            {video.nm + (selectedVideos.length > 1 && index !== selectedVideos.length ? ',' : '')}
                                        </StyledCctvListItem>
                                    ))}
                            </StyledCctvContainer>
                            {!isReadMode && (
                                <StyledDownloadButton
                                    onClick={() => {
                                        setCctvSelectPopupShow(true);
                                        fetchMobiles();
                                    }}
                                >
                                    CCTV 선택
                                </StyledDownloadButton>
                            )}
                        </StyledField>
                    </StyledShareBody>
                </StyledShareItem>
                {!isReadMode && <StyledReportButton onClick={handleSaveDisasterHistory}>저장</StyledReportButton>}
            </StyledShareContentArea>
        </StyledShare>
    );
};

const StyledCctvListItem = styled.li`
    width: auto;
    height: auto;
    color: #ffffff;
    font-size: 0.7vw;
    padding: 0.1vw 0;
`;

const StyledDownloadButton = styled(StyledButton)`
    width: calc(16% - 0.5vw);
    height: 3.68vh;
    max-height: 38px;
    border-radius: 0.41vw;
    background-color: #3f4152;
    font-size: 0.7vw;
    letter-spacing: -0.019vw;
    text-align: center;
    color: #ffffff;
    margin-left: 0.5vw;

    &:hover {
        background-color: #4f5162;
    }
`;

const StyledShareItem = styled.div<{ $height: string }>`
    width: 100%;
    height: ${({ $height }) => $height};
`;

const StyledShareHeader = styled.h1`
    width: 100%;
    height: 30px;
    font-size: 0.67vw;
    letter-spacing: -0.017vw;
    color: #b9bbd4;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const StyledShareBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    height: calc(100% - 30px);
    box-sizing: border-box;
`;

const StyledShareContentArea = styled.aside`
    width: 65%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

const StyledShare = styled.section<{
    isSelected: boolean;
}>`
    display: ${({ isSelected }) => (isSelected ? 'flex' : 'none')};
    width: 100%;
    height: 100%;
    gap: 10px;
`;

const StyledCctvContainer = styled.ul<{ $width: string }>`
    display: flex;
    width: ${({ $width }) => $width};
    align-items: center;
    height: 50px;
    gap: 10px;
    border-radius: 0.4vw;
    border: solid 0.05vw #1e1e24;
    background-color: #24252b;
    letter-spacing: -0.01vw;
    color: #e6e7f5;
    overflow-y: scroll;
    padding: 1%;
    flex-wrap: wrap;
`;

export default Share;
