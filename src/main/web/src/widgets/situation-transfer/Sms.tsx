import styled from 'styled-components';
import ReceiverTree from '@/shared/ui/ReceiverTree/ReceiverTree';
import { ECrudStatus, IReceiver } from './SituationTransfer';
import { ESituationTransferTab } from '@/shared/ui/Tab/SituationTransferTab';
import { useEffect, useState } from 'react';
import { Event } from '@/entities/event/EventType';
import { StyledReportButton } from '../report/Report';
import usePopupStore, { EPopup, Popup } from '@/app/usePopupStore';
import useDisasterHistoryStore from '@/entities/disaster-history/useDisasterHistoryStore';
import useUserStore from '@/entities/user/useUserStore';
import {
    DisasterHistory,
    DisasterHistoryFileMapping,
    EDisasterHistory,
} from '@/entities/disaster-history/DisasterHistoryType';
import { useSaveDisasterHistory } from '@/entities/disaster-history/useDisasterHistories';
import Label from '@/shared/ui/Label/Label';
import { uniqueId } from 'lodash-es';
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

interface ISms {
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

const Sms = ({
    isSelected,
    selectedTab,
    crudStatus,
    title,
    setTitle,
    content,
    setContent,
    selectedEvent,
    receivers,
    setReceivers,
}: ISms) => {
    const disasterHistory = useDisasterHistoryStore((s) => s.selectedDisasterHistory);
    const { showPopup } = usePopupStore();
    const currentUser = useUserStore((s) => s.currentUser);
    const { mutate: saveDisasterHistory } = useSaveDisasterHistory();
    const confirmedId = uniqueId('field');

    const { name, phone, setName, setPhone, handleAddReceiver, handleDeleteReceiver, resetInputs } = useReceiver({
        receivers,
        setReceivers: setReceivers as (updater: (prev: IReceiver[]) => IReceiver[]) => void,
    });

    const [targetName, setTargetName] = useState('');

    useEffect(() => {
        if (disasterHistory) {
            if (disasterHistory.type === 2) {
                if (crudStatus === ECrudStatus.read) {
                    resetInputs();
                }
            } else {
                resetInputs();
            }
        } else {
            if (crudStatus === ECrudStatus.read) {
                resetInputs();
            } else {
                setContent(selectedEvent.statEvetCntn);
                setTitle(selectedEvent.svcThemeNm);
            }
        }
    }, [disasterHistory, crudStatus, selectedEvent, selectedTab]);

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

        const disasterHistoryFileMappings = [] as DisasterHistoryFileMapping[];
        const disasterHistoryData: DisasterHistory = {
            title,
            content,
            type: EDisasterHistory.sms,
            regUserId: currentUser.userId,
            statEvetOutbSeqn: selectedEvent.statEvetOutbSeqn,
            pwd: '',
            expireDtm: '',
            transferTarget: JSON.stringify(receivers),
            disasterHistoryId: '',
            regDate: '',
            disasterHistoryFileMappings,
            disasterHistoryVideoMappings: [],
        };

        showPopup({
            message: 'SMS를 등록하시겠습니까?',
            type: EPopup.question,
            buttonText: '등록',
            title: 'SMS 등록',
            callback: () => {
                saveDisasterHistory(disasterHistoryData, {
                    onSuccess: () => {
                        setTitle('');
                        setContent('');
                        setReceivers([]);
                        resetInputs();
                    },
                });
            },
        } as Popup);
    };

    const setFindUserName = (userName: string) => {
        setTargetName(userName);
    };

    const isReadMode = crudStatus === ECrudStatus.read;
    const isSmsHistory = disasterHistory !== null && disasterHistory.type === 2;

    const titleValue = isReadMode ? (isSmsHistory ? disasterHistory.title : '') : title;
    const contentValue = isReadMode ? (isSmsHistory ? disasterHistory.content : '') : content;

    return (
        <StyledSms isSelected={isSelected}>
            <StyledReceiverTreeArea>
                <StyledSmsHeader>전파 대상 선택</StyledSmsHeader>
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
            <StyledSMSContentArea>
                <StyledSMSItem $height={'30%'}>
                    <StyledSMSHeader>전파 대상</StyledSMSHeader>
                    <StyledSMSBody>
                        <StyledReceiverListContainer>
                            {isReadMode && isSmsHistory
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
                    </StyledSMSBody>
                </StyledSMSItem>
                <StyledSMSItem $height={'70%'}>
                    <StyledSMSHeader>전파 내용</StyledSMSHeader>
                    <StyledSMSBody>
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
                                placeholder={isReadMode ? '' : '내용을 입력하세요'}
                                value={contentValue}
                                onChange={(e) => setContent(e.target.value)}
                                height={'20vh'}
                                width={'85%'}
                            />
                        </StyledField>
                    </StyledSMSBody>
                </StyledSMSItem>
                {!isReadMode && <StyledReportButton onClick={handleSaveDisasterHistory}>저장</StyledReportButton>}
            </StyledSMSContentArea>
        </StyledSms>
    );
};

const StyledSms = styled.section<{
    isSelected: boolean;
}>`
    display: ${({ isSelected }) => (isSelected ? 'flex' : 'none')};
    width: 100%;
    height: 100%;
    gap: 10px;
`;

const StyledSmsHeader = styled.h1`
    width: 100%;
    height: 30px;
    font-size: 0.67vw;
    letter-spacing: -0.017vw;
    color: #b9bbd4;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const StyledSMSContentArea = styled.aside`
    width: 65%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

const StyledSMSItem = styled.div<{ $height: string }>`
    width: 100%;
    height: ${({ $height }) => $height};
`;

const StyledSMSHeader = styled.h1`
    width: 100%;
    height: 30px;
    font-size: 0.67vw;
    letter-spacing: -0.017vw;
    color: #b9bbd4;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const StyledSMSBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    height: calc(100% - 30px);
    box-sizing: border-box;
`;

export default Sms;
