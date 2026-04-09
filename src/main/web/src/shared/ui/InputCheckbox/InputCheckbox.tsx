import styled from "styled-components";
import {InputHTMLAttributes, useRef} from "react";

interface IInputCheckbox {
    items: ICheckboxItem[]
    handleChange?: (value: string) => void,
    width: string,
    height: string,
}
export interface ICheckboxItem {
    label: string,
    value: string,
    checked: boolean
}
const InputCheckbox = ({items, width, height, handleChange}: IInputCheckbox) => {
    const checkRef = useRef<HTMLInputElement>(null)
    return <>
        {items.map((item:ICheckboxItem, index) => <StyledSurfaceCheckbox key={item.value}>
        <StyledHiddenCheckbox ref={checkRef} checked={item.checked}/>
        <StyledCheckbox checked={item.checked} onClick={()=>handleChange(item.value)}>
            <Icon viewBox={'0 0 24 24'}>
                <polyline points={'20 6 9 17 4 12'}/>
            </Icon>
        </StyledCheckbox>
        <StyledCheckboxLabel onClick={()=>handleChange(item.value)}>{item.label}</StyledCheckboxLabel>
    </StyledSurfaceCheckbox>)}
    </>
}
const StyledCheckboxLabel = styled.label`
  width:auto;
  margin-right: 0.5vw;
  font-size: 0.8vw;
  letter-spacing: -0.019vw;
  color: #ffffff;
`
const StyledSurfaceCheckbox = styled.div`
  display: flex;
  justify-content:flex-start;
  align-items:center;
  &:after{
    content:'';
    margin-right:1vw;
  }
`
const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`
const StyledHiddenCheckbox = styled.input.attrs({type: 'checkbox'})`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`

const StyledCheckbox = styled.div<{
    checked: boolean,
}>`
  cursor: pointer;
  border: 2px solid #5f6189;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  background: ${props => (props.checked ? '#555afa' : '')};
  border-radius: 3px;
  transition: background-color;
  margin-right:0.3vw;

  ${Icon} {
    visibility: ${props => (props.checked ? 'visible' : 'hidden')}
  }
`

export default InputCheckbox