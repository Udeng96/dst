import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker, {DayRange, DayValue, utils} from "@hassanmojab/react-modern-calendar-datepicker";
import styled from "styled-components";


interface IInputDatePicker {
    selectedDate: DayRange,
    handleChange?: (dayRange: DayRange) => void,
    width: string,
    height: string,
}


const checkSelectedDateSame = (selectedDate: DayRange) => {
    if( !selectedDate || !selectedDate.to || !selectedDate.from ) {
        return false
    }

    return selectedDate.to.year === selectedDate.from.year &&
        selectedDate.to.month === selectedDate.from.month &&
        selectedDate.to.day === selectedDate.from.day
}

const getDateFromDayValue = (dayValue: DayValue): string => {
    return dayValue ?
        `${dayValue.year}/${String(dayValue.month).padStart(2, '0')}/${String(dayValue.day).padStart(2, '0')}`
        : ""
}


const calendarUtils = utils('en')
const today = calendarUtils.getToday()

const InputDatePicker = ({selectedDate, handleChange, width, height}: IInputDatePicker) => {

    return <StyledInputDatePicker width={width} height={height}>
        <DatePicker
            value={selectedDate}
            onChange={handleChange}
            maximumDate={today}
            calendarPopperPosition={"bottom"}
            formatInputText={() =>

                checkSelectedDateSame(selectedDate)? `${getDateFromDayValue(selectedDate.from)}` :

                `${getDateFromDayValue(selectedDate.from)}` +
                (selectedDate.from && selectedDate.to ? ' - ' : '') +
                `${getDateFromDayValue(selectedDate.to)}`

            }
            inputPlaceholder={'날짜 선택'}

        />
    </StyledInputDatePicker>
}

const StyledInputDatePicker = styled.fieldset<{
    width: string,
    height: string,
}>`
  width: ${({width}) => width};
  height: ${({height}) => height};
  display: flex;

  & .DatePicker {
    width: 100%;
    height: 100%;
    display: flex;
  }

  & input.DatePicker__input {
    cursor: pointer;
    width: 100%;
    height: 100%;
    padding: 0 1vw;
    border-radius: 0.4vw;
    border: solid 0.05vw #1e1e24;
    background-color: #24252b;
    letter-spacing: -0.01vw;
    color: #e6e7f5;
  }
`

export default InputDatePicker