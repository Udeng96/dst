import styled from "styled-components";
import {ChangeEventHandler, ForwardedRef, forwardRef, Ref} from "react";

interface IInputText {
    id: string,
    text: string,
    placeholder?: string,
    readOnly: boolean,
    handleChange?: ChangeEventHandler,
    width: string,
    height: string,
}

const InputText = forwardRef(({id, text, placeholder, readOnly, handleChange, width, height}: IInputText, ref:ForwardedRef<any>) =>
    <StyledInputText
        ref={ref}
        autoComplete={"off"}
        placeholder={placeholder} width={width} height={height} id={id} value={text} readOnly={readOnly} onChange={handleChange ? handleChange : () => null}/>)

const StyledInputText = styled.input.attrs(() => ({
    type: 'text',
}))<{
    readOnly: boolean,
    width: string,
    height: string,
}>`
  width: ${({width}) => width};
  height: ${({height}) => height};
  max-height: 38px;

  padding: 0 1vw;
  border-radius: 0.4vw;

  border: solid 0.05vw ${({readOnly}) => readOnly ? '#1e1e24' : '#3f4147'};
  background-color: ${({readOnly}) => readOnly ? '#24252b' : '#1d1d24'};
  letter-spacing: -0.01vw;
  color: #e6e7f5;
`

export default InputText