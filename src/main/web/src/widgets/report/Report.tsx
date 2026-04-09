import styled from "styled-components";
import {
    DisasterHistory,
    DisasterHistoryFileMapping,
    EDisasterHistory
} from '@/entities/disaster-history/DisasterHistoryType';
import DisasterHistoryContainer from "../disaster-history/DisasterHistoryContainer";
import Field, {EField} from '@/shared/ui/Field/Field';
import {formatDate} from '@/shared/lib/dateUtil';
import {ECrudStatus} from "../situation-transfer/SituationTransfer";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {Event} from '@/entities/event/EventType';
import {User} from '@/entities/user/UserType';
import {StyledButton} from '@/shared/ui/Button/Button';
import usePopupStore, {EPopup, Popup} from '@/app/usePopupStore';
import useDisasterHistoryStore from '@/entities/disaster-history/useDisasterHistoryStore';
import useUserStore from '@/entities/user/useUserStore';
import {useSaveDisasterHistory} from '@/entities/disaster-history/useDisasterHistories';

interface IReport {
    isSelected: boolean,
    disasterHistories: DisasterHistory[],
    selectedEvent: Event
}

const Report = ({isSelected, disasterHistories, selectedEvent}: IReport) => {
    const { showPopup } = usePopupStore()
    const { mutate: saveDisasterHistoryMutation } = useSaveDisasterHistory()

    const inputFile = document.getElementById('reportFile') as HTMLInputElement
    const fileRef = useRef<HTMLInputElement>(inputFile)

    const [title, setTitle] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [files, setFiles] = useState<FileList | null | undefined>()
    const [fileName, setFilename] = useState<string>('')
    useEffect(() => {
        if (files && files.length > 0) {
            setFilename(files.item(0)?.name!)
        }
    }, [files])

    const users = useUserStore((s) => s.users)
    const currentUser = useUserStore((s) => s.currentUser)
    const [registerDisasterHistoryUser, setRegisterDisasterHistoryUser] = useState<User | null>(null)
    const [crudStatus, setCrudStatus] = useState<ECrudStatus>(ECrudStatus.loading)
    const disasterHistory = useDisasterHistoryStore((s) => s.selectedDisasterHistory)
    useEffect(() => {
        if(disasterHistory){
            if(disasterHistory.disasterHistoryId) {
                setCrudStatus(ECrudStatus.read)
            } else {
                setCrudStatus(ECrudStatus.create)
            }
            const registerDisasterHistoryUser = users.find(user => user.userId === disasterHistory.regUserId)
            setRegisterDisasterHistoryUser(registerDisasterHistoryUser ? registerDisasterHistoryUser : null)
        }
    }, [disasterHistory, users, selectedEvent])

    useEffect(() => {
        setTitle('')
        setContent('')
        setFilename('')
        setFiles(null)
    }, [crudStatus])

    const handleSaveDisasterHistory = () => {
        if (title === '') {
            showPopup({
                title: '필수 항목 누락',
                message: '제목을 입력해주세요.',
                buttonText: '확인',
                type: EPopup.info,
                callback: () => {}
            } as Popup)
            return
        }

        if (content === '') {
            showPopup({
                title: '필수 항목 누락',
                message: '내용을 입력해주세요.',
                buttonText: '확인',
                type: EPopup.info,
                callback: () => {}
            } as Popup)
            return
        }

        const disasterHistoryFileMappings = [] as DisasterHistoryFileMapping[]
        if (files) {
            for (let i = 0; i < files!.length; i++) {
                disasterHistoryFileMappings.push({
                    disasterHistoryFileMappingId: '',
                    disasterHistoryId: '',
                    fileLocation: '',
                    fileName: files[i].name,
                    file: files[i],
                } as DisasterHistoryFileMapping)
            }
        }

        const disasterHistoryData = {
            title: title,
            content: content,
            type: EDisasterHistory.report,
            regUserId: currentUser.userId,
            statEvetOutbSeqn: selectedEvent.statEvetOutbSeqn,
            transferTarget: '',
            disasterHistoryId: '',
            regDate: '',
            disasterHistoryFileMappings: disasterHistoryFileMappings,
            disasterHistoryVideoMappings: [],
        } as DisasterHistory

        showPopup({
            message: '보고서를 등록하시곘습니까?',
            type: EPopup.question,
            buttonText: '등록',
            title: '조치 및 보고서 등록',
            callback: () => {
                saveDisasterHistoryMutation(disasterHistoryData)
            }
        } as Popup)

    }

    return <StyledReport isSelected={isSelected}>
        <StyledDisasterHistoryArea>
            <DisasterHistoryContainer
                isReport={true}
                disasterHistories={disasterHistories} name={'조치 및 보고서 내역'}
                crudStatus={crudStatus}
                setCrudStatus={setCrudStatus}/>
        </StyledDisasterHistoryArea>
        <StyledReportArea>
            <StyledReportRow>
                <StyledReportColumn>
                    <Field readOnly={crudStatus === ECrudStatus.read} labelText={'담당부서'} inputText={
                        crudStatus === ECrudStatus.loading ? '' :
                            crudStatus === ECrudStatus.read ? registerDisasterHistoryUser ? registerDisasterHistoryUser.departmentName : '' :
                                currentUser.departmentName} labelWidth={'30%'} inputWidth={'70%'}/>
                </StyledReportColumn>
                <StyledReportColumn>
                    <Field readOnly={crudStatus === ECrudStatus.read} labelText={'등록자'} inputText={
                        crudStatus === ECrudStatus.loading ? '' :
                            crudStatus === ECrudStatus.read ?
                                (registerDisasterHistoryUser ? registerDisasterHistoryUser.userName : disasterHistory?.regUserId?`Unknown(${disasterHistory.regUserId})`:'') :
                                currentUser.userName} labelWidth={'30%'} inputWidth={'70%'}/>
                </StyledReportColumn>
            </StyledReportRow>
            {
                crudStatus === ECrudStatus.read ?
                    <Field readOnly={crudStatus === ECrudStatus.read} labelText={'등록일시'} inputText={formatDate(disasterHistory?.regDate ?? '')}
                           labelWidth={'14%'} inputWidth={'86%'}/> : null
            }

            <Field labelText={'제목'}
                   inputText={crudStatus === ECrudStatus.read ? disasterHistory?.title ?? '' : title}
                   readOnly={crudStatus === ECrudStatus.read}
                   handleChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
                   labelWidth={'14%'} inputWidth={'86%'}/>
            <Field labelText={'내용'}
                   inputText={crudStatus === ECrudStatus.read ? disasterHistory?.content ?? '' : content}
                   readOnly={crudStatus === ECrudStatus.read}
                   handleChange={(event: ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)}
                   labelWidth={'14%'} inputWidth={'86%'}
                   fieldType={EField.textarea} height={'30vh'}/>

            {/*TODO: multiple file 어떻게 할까? 일단은 fileList[0] 사용하기*/}
            {
                (crudStatus === ECrudStatus.read && disasterHistory?.disasterHistoryFileMappings?.length > 0) ||
                crudStatus !== ECrudStatus.read ? <StyledReportRow>
                    <input style={{display: "none"}}
                           onChange={(event: ChangeEvent<HTMLInputElement>) => setFiles(event.currentTarget.files)}
                           id={'reportFile'} type={'file'} ref={fileRef}/>
                    <Field labelText={'파일'}
                           readOnly={crudStatus === ECrudStatus.read}

                           inputText={crudStatus === ECrudStatus.read ? disasterHistory?.disasterHistoryFileMappings?.length > 0 ?
                               disasterHistory.disasterHistoryFileMappings[0].fileName : '' :
                               fileName}
                           labelWidth={'14%'} inputWidth={'77%'}/>
                    {crudStatus === ECrudStatus.create || crudStatus === ECrudStatus.update ?
                        <StyledDownloadButton onClick={() => fileRef.current?.click()}>파일 선택</StyledDownloadButton> :
                        <StyledDownloadButton onClick={() => {
                            const disasterHistoryFileMapping = disasterHistory?.disasterHistoryFileMappings?.[0]
                            window.location.href =
                                import.meta.env.MODE === 'development' ?
                                    `http://localhost:22222/dst/disasterHistories/${disasterHistoryFileMapping.disasterHistoryId}/file/${disasterHistoryFileMapping.disasterHistoryFileMappingId}/download` :
                                    `/dst/disasterHistories/${disasterHistoryFileMapping.disasterHistoryId}/file/${disasterHistoryFileMapping.disasterHistoryFileMappingId}/download`
                        }}>다운로드</StyledDownloadButton>
                    }
                </StyledReportRow> : null}

            {crudStatus === ECrudStatus.create || crudStatus === ECrudStatus.update ?
                <StyledReportButton onClick={handleSaveDisasterHistory}>저장</StyledReportButton> : null}
        </StyledReportArea>
    </StyledReport>
}

export const StyledDownloadButton = styled(StyledButton)`
  width: calc(16% - 0.5vw);
  height: 3.68vh;
  max-height: 38px;
  border-radius: 0.41vw;
  background-color: #3f4152;
  font-size: 0.78125vw;
  letter-spacing: -0.019vw;
  text-align: center;
  color: #ffffff;
  margin-left: 0.5vw;

  &:hover {
    background-color: #4f5162;
  }
`
export const StyledBtnGrp = styled.div`
    width: auto;
    height: auto;
    display: flex;
    align-items: flex-end;
`
export const StyledReportButton = styled(StyledButton)`
  width: 6.5vw;
  height: 3.5vh;
  max-height: 40px;
  border-radius: 1vw;
  box-shadow: 0 0.15625vw 0.46875vw 0 rgb(123 26 255 / 27%);
  border: solid 0.05vw #9c5eff;
  background-color: #7a45ff;
  font-size: 0.8vw;
  letter-spacing: -0.02vw;
  text-align: center;
  color: #ffffff;
  margin: 1vh 0 0 auto;

  &:hover {
    border: solid 0.05vw #a56eff;
    background-color: #7c5bf5;
  }
`

const StyledReportColumn = styled.span`
  display: flex;
  width: 100%;
  height: auto;
  justify-content: flex-start;
  align-items: center;
`

const StyledReportRow = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  justify-content: flex-start;
  align-items: center;
`

const StyledDisasterHistoryArea = styled.aside`
  width: 25%;
  height: 100%;
  display: flex;
`

const StyledReportArea = styled.aside`
  width: 71%;
  height: 94%;
  padding: 2%;

  margin-left: 10px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 0.625vw;
  background-color: #292a33;

`

const StyledReport = styled.article<{
    isSelected: boolean
}>`
  display: ${({isSelected}) => isSelected ? 'flex' : 'none'};
  width: 100%;
  height: 100%;
  flex: 1;
  padding: 1% 0;

  justify-content: space-between;
  align-items: flex-start;

`

export default Report