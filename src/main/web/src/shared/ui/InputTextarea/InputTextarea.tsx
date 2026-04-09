import styled from "styled-components";
import {ChangeEventHandler, ForwardedRef, forwardRef, Ref} from "react";

interface IInputTextarea {
    id: string,
    text: string,
    readOnly: boolean,
    handleChange?: ChangeEventHandler,
    height: string,
    width: string,
}

const InputTextarea = forwardRef(({id, text, readOnly, handleChange, height, width}: IInputTextarea, ref:ForwardedRef<any>) =>
    <StyledInputTextarea
        ref={ref}
        width={width} height={height} id={id} value={text} readOnly={readOnly} onChange={handleChange ? handleChange : () => null}/>)


const StyledInputTextarea = styled.textarea<{
    readOnly: boolean,
    width: string,
    height: string
}>`
  width: ${({width}) => width};
  height: ${({height}) => height};
  margin: auto 0;

  padding: 1.5vh 1vw;
  border-radius: 0.4vw;
  border: solid 0.05vw ${({readOnly}) => readOnly ? '#1e1e24' : '#3f4147'};
  background-color: ${({readOnly}) => readOnly ? '#24252b' : '#1d1d24'};
  letter-spacing: -0.01vw;
  color: #e6e7f5;
`

export default InputTextarea