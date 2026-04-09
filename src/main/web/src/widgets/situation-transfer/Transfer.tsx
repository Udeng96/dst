import styled from "styled-components";
import Field, {EField} from '@/shared/ui/Field/Field';
import {ECrudStatus, IOrganization} from "./SituationTransfer";
import {ChangeEvent, useEffect, useState} from "react";
import {StyledReportButton} from "../report/Report";
import {ESituationTransferTab} from '@/shared/ui/Tab/SituationTransferTab';
import {Event} from '@/entities/event/EventType';
import usePopupStore, {EPopup, Popup} from '@/app/usePopupStore';
import useDisasterHistoryStore from '@/entities/disaster-history/useDisasterHistoryStore';
import useUserStore from '@/entities/user/useUserStore';
import {useSaveDisasterHistory} from '@/entities/disaster-history/useDisasterHistories';
import {
    DisasterHistory,
    DisasterHistoryFileMapping,
    EDisasterHistory
} from '@/entities/disaster-history/DisasterHistoryType';
import {ICheckboxItem} from '@/shared/ui/InputCheckbox/InputCheckbox';

interface ITransfer {
    isSelected: boolean,
    selectedTab: ESituationTransferTab,
    crudStatus: ECrudStatus,
    setCrudStatus: (status: ECrudStatus) => void,
    title: string,
    setTitle: (title: string) => void,
    content: string,
    setContent: (content: string) => void,
    selectedEvent: Event
    organizations: IOrganization[],
    setOrganizations: (organizations: IOrganization[]) => void,
}

const Transfer = ({
                      isSelected,
                      selectedTab,
                      crudStatus,
                      setCrudStatus,
                      title,
                      setTitle,
                      content,
                      setContent,
                      selectedEvent,
                      organizations,
                      setOrganizations
                  }: ITransfer) => {
    const { showPopup } = usePopupStore()
    const currentUser = useUserStore((s) => s.currentUser)
    const disasterHistory = useDisasterHistoryStore((s) => s.selectedDisasterHistory)
    const { mutate: saveDisasterHistoryMutation } = useSaveDisasterHistory()
    // const isLoading = disasterHistorydisasterHistory.type === null
    useEffect(()=>{
        if(crudStatus===ECrudStatus.create){
            setTitle('')
            setContent('')
        }
    },[crudStatus])
    useEffect(() => {
        return () => {
            setTitle('')
            setContent('')
            // setOrganizations([])
            setCrudStatus(ECrudStatus.create)
        }
    }, [selectedTab])
    const [items, setItems] = useState<ICheckboxItem[]>([
        {label: '기관', value: 'orgn', checked: false},
        {label: '부서', value: 'dept', checked: false},
        {label: '담당자', value: 'hndler', checked: false}
    ] as ICheckboxItem[])
    //체크박스 클릭/해제 시 처리해 주는 메서드
    const handleCheckboxClick = (value:string) => {
        setItems((items:ICheckboxItem[]) => items.map(item => item.value === value ? {...item, checked: !item.checked} as ICheckboxItem : item))
    }
    //db에서 읽어 온 내용이 전파일 경우 체크박스의 체크 로직을 처리해주는 side effect처리
    useEffect(()=>{
        if(organizations){
            items.forEach(item=>
                setItems((items:ICheckboxItem[]) => items.map(item=>organizations.map(organization=>organization.organizationId).includes(item.value) ? {...item,checked:true} : {...item, checked:false}))
            )
        }
    },[organizations])
    const handleSaveDisasterHistory = () => {
        if(items.filter(item=>item.checked).length===0){
            showPopup({
                title: '필수 항목 누락',
                message: '전파기관을 선택해주세요.',
                buttonText: '확인',
                type: EPopup.info,
                callback: () => {}
            } as Popup)
            return
        }
        if(title === ''){
            showPopup({
                title: '필수 항목 누락',
                message: '제목을 입력해주세요.',
                buttonText: '확인',
                type: EPopup.info,
                callback: () => {}
            } as Popup)
            return
        }
        if(content === ''){
            showPopup({
                title: '필수 항목 누락',
                message: '내용을 입력해주세요.',
                buttonText: '확인',
                type: EPopup.info,
                callback: () => {}
            } as Popup)
            return
        }
        const transferTarget = items.filter(item=>item.checked).map(item => ({organizationId: item.value, organizationName: item.label, organizationChecked: item.checked}))

        const disasterHistoryFileMappings = [] as DisasterHistoryFileMapping[]
        const disasterHistoryData = {
            title: title,
            content: content,
            type: EDisasterHistory.transfer,
            regUserId: currentUser.userId,
            statEvetOutbSeqn: selectedEvent.statEvetOutbSeqn,
            transferTarget: JSON.stringify(transferTarget),
            disasterHistoryId: '',
            regDate: '',
            disasterHistoryFileMappings: disasterHistoryFileMappings,
            disasterHistoryVideoMappings: [],
        } as DisasterHistory

        showPopup({
            message: '전파를 등록하시겠습니까?',
            type: EPopup.question,
            buttonText: '등록',
            title: '전파 등록',
            callback: () => {
                saveDisasterHistoryMutation(disasterHistoryData)
            }
        } as Popup)
    }
    return <StyledTransfer isSelected={isSelected}>
        <Field labelText={'전파기관'} labelWidth={'20%'} inputWidth={'80%'}
               fieldType={EField.checkbox} inputText={''} items={items}
               handleChange={crudStatus === ECrudStatus.read ? ()=>{return} : handleCheckboxClick}/>
        <Field labelText={'제목'} inputText={crudStatus === ECrudStatus.read ? disasterHistory ? disasterHistory.title : '' : title}
               readOnly={crudStatus === ECrudStatus.read} handleChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
               labelWidth={'20%'} inputWidth={'80%'}/>
        <Field labelText={'내용'} inputText={crudStatus === ECrudStatus.read ?disasterHistory ? disasterHistory.title : '' : content}
               readOnly={crudStatus === ECrudStatus.read} handleChange={(event: ChangeEvent<HTMLInputElement>) => setContent(event.target.value)}
               fieldType={EField.textarea} height={'35vh'} labelWidth={'20%'} inputWidth={'80%'}/>
        {crudStatus === ECrudStatus.create || crudStatus === ECrudStatus.update ?
            <StyledReportButton onClick={handleSaveDisasterHistory}>저장</StyledReportButton> : null}
    </StyledTransfer>
}

const StyledTransfer = styled.section<{
    isSelected: boolean
}>`
  display: ${({isSelected}) => isSelected ? 'flex' : 'none'};
  flex-direction: column;
  width: 100%;
  height: 100%;
`

export default Transfer