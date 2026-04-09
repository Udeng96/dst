import styled from "styled-components";
import InputText from '@/shared/ui/InputText/InputText';
import {StyledButton} from '@/shared/ui/Button/Button';
import {ChangeEvent, useState} from "react";
import {ECrudStatus, IReceiver} from "@/widgets/situation-transfer/SituationTransfer";
import usePopupStore, {EPopup, Popup} from '@/app/usePopupStore';
import DELETE_BTN from "./btn_gis_searchBar_delete_normal.png";
import DELETE_BTN_HOVER from "./btn_gis_searchBar_delete_hover.png";

interface IReceiverList{
    crudStatus: ECrudStatus,
    receivers: IReceiver[],
    setReceivers: Function
}
const ReceiverList = ({crudStatus, receivers, setReceivers}:IReceiverList) => {
    const { showPopup } = usePopupStore()

    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');

    const handleAddReceiver = () => {
        if(name===''){
            showPopup({
                title: '필수 항목 누락',
                message: '이름을 입력해주세요.',
                buttonText: '확인',
                type: EPopup.info,
                callback: () => {}
            } as Popup)
            return
        }
        if(phone===''){
            showPopup({
                title: '필수 항목 누락',
                message: '전화번호를 입력해주세요.',
                buttonText: '확인',
                type: EPopup.info,
                callback: () => {}
            } as Popup)
            return
        }

        if(receivers.find(receiver => receiver.userName ===name && receiver.cpNo===phone)===undefined){
            const receiver = {
                userId: '',
                userName: name,
                cpNo: phone
            } as IReceiver
            setReceivers((receivers:IReceiver[]) => [...receivers, receiver])
            setName('');
            setPhone('');
        }
    }

    const handleDeleteReceiver = (receiver:IReceiver) => {
        if(receiver.userId === ''){
            setReceivers((receivers:IReceiver[]) => receivers.filter(item => (item.userId !== '')||(item.userId === '' && item.cpNo !== receiver.cpNo)));
        }else{
            setReceivers((receivers:IReceiver[]) => receivers.filter(item => item.userId !== receiver.userId));
        }
    }

    return <StyledReceiverListContainer>
        <StyledWrapBox>
            <StyledReceiverList>
                {receivers && receivers.map((receiver,index) =>
                    //TODO: 현재 통영은 암호화가 없어서 cpNo가 encode 상태로 조회되는데 나중에 확인
                    <StyledReceiverListItem key={`${receiver.userId}_${receiver.userName}_${index}`} title={receiver.cpNo}>{receiver.userName+'('+receiver.cpNo+')'+ (receivers.length > 1 && index+1 !== receivers.length? ',' : '')}
                        <StyledDeleteBtn onClick={() =>handleDeleteReceiver(receiver)}></StyledDeleteBtn>
                    </StyledReceiverListItem>)}
            </StyledReceiverList>
        </StyledWrapBox>
        {
            crudStatus !==ECrudStatus.read &&
            <StyledReceiverAddField>
                    <InputText id={'addName'} placeholder={'이름 입력'} text={name}
                               readOnly={false} height={'3vh'} width={'40%'}
                               handleChange={(event:ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                    />
                    <InputText id={'addPhone'} placeholder={'전화번호 입력'} text={phone}
                               readOnly={false} height={'3vh'} width={'40%'}
                               handleChange={(event:ChangeEvent<HTMLInputElement>) => setPhone(event.target.value)}
                    />
                    <StyledAddButton onClick={handleAddReceiver}>추가</StyledAddButton>
            </StyledReceiverAddField>
        }

    </StyledReceiverListContainer>
}

const StyledAddButton = styled(StyledButton)`
  height: 3vh;
  width: 20%;
  border-radius: 0.41vw;
  background-color: #7a45ff;
  font-size: 0.83vw;
  letter-spacing: -0.02vw;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledReceiverAddField = styled.fieldset`
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  
  & button, & input {
    margin: 0 5px;
  }
`

const StyledWrapBox = styled.div`
    width: 94%;
    height: 70%;
    max-height: 60px;
    //display: flex;
    //flex-wrap: wrap;
    //align-items: flex-start;
    //justify-content: flex-start;
    padding: 2%;
    margin: 2% 0;
    border-radius: 0.41vw;
    border: solid 0.05vw #1e1e24;
    background-color: #26262e;
`

const StyledReceiverList = styled.ul`
  //width: 94%;
  //height: 70%;
  //display: flex;
  //flex-wrap: wrap;
  //align-items: flex-start;
  //justify-content: flex-start;
  //padding: 2%;
  //margin: 2% 0;
  //border-radius: 0.41vw;
  //border: solid 0.05vw #1e1e24;
  //background-color: #26262e;
    overflow-y: scroll;
`
const StyledReceiverListItem = styled.li`
    width: auto;
    height: auto;   
    margin-right: 3px;
    cursor: pointer;
    font-size: 0.7vw;
`

const StyledReceiverListContainer = styled.article`
  width: 96%;
  height: 90%;
  padding: 2%;
  margin-bottom: 2%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`

const StyledDeleteBtn = styled.button`
    width: 18px;
    height: 18px;
    background: url("${DELETE_BTN}") center;
    background-size: contain;
    margin-left: 3px;

    &:hover {
        cursor: pointer;
        background: url("${DELETE_BTN_HOVER}");
        background-size: contain;
    }
`



export default ReceiverList