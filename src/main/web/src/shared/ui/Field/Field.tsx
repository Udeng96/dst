import styled from "styled-components";
import Label from '@/shared/ui/Label/Label';
import InputText from '@/shared/ui/InputText/InputText';
import { uniqueId } from "lodash-es";
import InputTextarea from '@/shared/ui/InputTextarea/InputTextarea';
import InputDatePicker from '@/shared/ui/InputDatepicker/InputDatepicker';
import InputSelect from '@/shared/ui/InputSelect/InputSelect';
import {SingleValue} from 'react-select';
type Option = { value: string; label: string };
import {DayRange} from "@hassanmojab/react-modern-calendar-datepicker";
import {ChangeEvent, forwardRef, Ref} from "react";
import InputCheckbox, {ICheckboxItem} from '@/shared/ui/InputCheckbox/InputCheckbox';

type FieldChangeHandler =
    | ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void)
    | ((dayRange: DayRange) => void)
    | ((option: SingleValue<Option>) => void)
    | ((value: string) => void)

interface IField {
    id?: string
    labelText: string,
    inputText: string,
    readOnly?: boolean,
    margin?: string,
    handleChange?: FieldChangeHandler,
    fieldType?: EField,

    //for Datepicker
    selectedDate?: DayRange

    //For select
    value?: Option,
    options?: Option[]

    //For checkbox
    items?: ICheckboxItem[],

    height?: string,
    labelWidth?: string,
    inputWidth?: string,
}

export enum EField {
    text,
    textarea,
    datepicker,
    select,
    checkbox
}

const Field = forwardRef((props: IField, ref) => {
    const {
        id, labelText, inputText, readOnly = false,
        labelWidth = '20%', inputWidth = '80%',
        height = '3.5vh',
        margin = '5px 0',
        selectedDate,
        value, options, items,
        handleChange, fieldType = EField.text,
    } = props
    const confirmedId = id ? id : uniqueId('field')

    return <StyledField $margin={margin}>
        <Label width={labelWidth} text={labelText} htmlFor={confirmedId}/>
        {
            fieldType === EField.text ?
                <InputText
                    ref={ref}
                    width={inputWidth} height={height} id={confirmedId} text={inputText} readOnly={readOnly} handleChange={handleChange as any}/>
                : fieldType === EField.textarea ?
                <InputTextarea
                    ref={ref}
                    width={inputWidth} id={confirmedId} text={inputText} readOnly={readOnly} handleChange={handleChange as any} height={height}/>
                : fieldType === EField.datepicker ?
                    <InputDatePicker width={inputWidth} height={height} selectedDate={selectedDate!} handleChange={handleChange as any}/>
                    : fieldType === EField.select ?
                        <InputSelect options={options!} width={inputWidth} height={height} value={value} handleChange={handleChange as any}/>
                        : fieldType === EField.checkbox ?
                            <InputCheckbox height={height} width={inputWidth} items={items!} handleChange={handleChange as any}/> : null
        }


    </StyledField>
})

const StyledField = styled.fieldset<{$margin:string}>`
  width: 100%;
  height: auto;
  margin: ${({$margin})=>$margin};
  display: flex;
  justify-content: flex-start;
`

export default Field