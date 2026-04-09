import styled from "styled-components";
import Field, {EField} from '@/shared/ui/Field/Field';
import {StyledButton} from '@/shared/ui/Button/Button';
import {useEffect, useRef, useState} from "react";
import {
    DisasterHistory,
    EDisasterHistory,
    getDisasterHistoryTypeName
} from '@/entities/disaster-history/DisasterHistoryType';
type Option = { value: string; label: string };
import {DayRange, DayValue} from "@hassanmojab/react-modern-calendar-datepicker";
import {parseDate} from '@/shared/lib/dateUtil';
import {ChangeEvent} from "react";

interface IHistorySearch {
    name: string,
    isReport: boolean,
    disasterHistories: DisasterHistory[],
    setFilteredDisasterHistories: (histories: DisasterHistory[]) => void,
}

//enum 을 object 처럼 다뤄서 Object.keys() 및 values 로 처리할 수 있을거같은데 잘 안됐다.
//그래서 그냥 4개뿐이니 나열했으니 나중에 누군가 정리해줬으면 좋겠다.
const options = [
    {value: '', label: '선택'},
    {value: EDisasterHistory.transfer.toString(), label: getDisasterHistoryTypeName(EDisasterHistory.transfer)},
    {value: EDisasterHistory.share.toString(), label: getDisasterHistoryTypeName(EDisasterHistory.share)},
    {value: EDisasterHistory.sms.toString(), label: getDisasterHistoryTypeName(EDisasterHistory.sms)},
    {value: EDisasterHistory.report.toString(), label: getDisasterHistoryTypeName(EDisasterHistory.report)},

] as Option[]


const compareDate = (from: DayValue, to: DayValue, dateString: string): boolean => {
    if (!dateString) {
        return false
    }
    const date = parseDate(dateString)

    let result = true
    if (from) {
        const fromDate = new Date(from.year, from.month - 1, from.day)
        result = fromDate <= date
    }

    if (to) {
        const toDate = new Date(to.year, to.month - 1, to.day, 23, 59, 59, 999)
        result = result && (date <= toDate)
    }

    return result
}


const DisasterHistorySearch = ({name, isReport, disasterHistories, setFilteredDisasterHistories}: IHistorySearch) => {

    const inputRef = useRef(null)

    const handleEnterKeyPress = (event: KeyboardEvent) => {
        //Enter 눌림과 제목 포커스 확인
        if (inputRef && inputRef.current === document.activeElement && event.key === 'Enter') {
            filterDisasterHistories()
        }
    }

    const [searchTitle, setSearchTitle] = useState<string>('')
    const [searchDate, setSearchDate] = useState<DayRange>({
        from: null,
        to: null
    })
    const [searchType, setSearchType] = useState<Option>(options[0])

    //이 아래 함수는 render 시 마다 새로 정의됩니다.
    //함수 내 사용된 state 를 그대로 품고 ...
    //그렇기에 아래 event 등록 및 해제 마다 해당 함수를 등록/제거 해줘야 문제가 발생하지 않습니다.
    const filterDisasterHistories = () => {
        setFilteredDisasterHistories(
            disasterHistories.filter((disasterHistory: DisasterHistory) => {
                // 1. title filter

                return searchTitle === '' || disasterHistory.title.indexOf(searchTitle) !== -1
            }).filter((disasterHistory: DisasterHistory) => {
                // 2. date filter
                return disasterHistory.regDate && compareDate(searchDate.from, searchDate.to, disasterHistory.regDate)
            }).filter((disasterHistory: DisasterHistory) => {
                // 3. type filter

                return searchType.value === '' ||
                    searchType.value === disasterHistory.type?.toString()
            })
        )
    }

    useEffect(() => {
        document.addEventListener('keypress', handleEnterKeyPress)
        return () => {
            document.removeEventListener('keypress', handleEnterKeyPress)
        }
    }, [filterDisasterHistories])


    return <StyledHistorySearch>
        <StyledHistorySearchHeader>{`${name} 검색`}</StyledHistorySearchHeader>
        {!isReport &&
        <Field labelText={'유형'} options={options} inputText={''} fieldType={EField.select}
               value={searchType}
               handleChange={setSearchType}
               labelWidth={'25%'} inputWidth={'70%'}/>}
        <Field height={'3vh'}
               handleChange={setSearchDate}
               labelText={'일시'} inputText={''} selectedDate={searchDate!} fieldType={EField.datepicker}
               labelWidth={'25%'} inputWidth={'70%'}/>
        { isReport && <Field height={'3vh'} labelText={'제목'} inputText={searchTitle} fieldType={EField.text}
                handleChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSearchTitle((event as ChangeEvent<HTMLInputElement>).target.value)}
                ref={inputRef}
                labelWidth={'30%'} inputWidth={'65%'}/>}
        <StyledHistorySearchButton onClick={filterDisasterHistories}>검색</StyledHistorySearchButton>
    </StyledHistorySearch>
}

const StyledHistorySearchButton = styled(StyledButton)`
  width: 100%;
  height: 3vh;
  max-height: 32px;
  border-radius: 0.8vw;
  background-color: #7a45ff;
  font-size: 0.7vw;
  letter-spacing: -0.01vw;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 5px 0;

`

const StyledHistorySearchHeader = styled.header`
  width: 100%;
  height: 30px;
  font-size: 0.65vw;
  letter-spacing: -0.01vw;
  color: #86879c;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 1vw;

  border-bottom: 1px solid #363940;
`

const StyledHistorySearch = styled.fieldset`
  width: 100%;
  height: auto;
  max-height: 200px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default DisasterHistorySearch





