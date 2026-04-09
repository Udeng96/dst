import styled from "styled-components";
import {MouseEventHandler} from "react";

export interface ITab {
    name: string,
    isSelected: boolean,
    handleClick: MouseEventHandler
}

export enum ETab {
    eventDetail,
    situationTransfer,
    report
}

const Tab = ({isSelected, name, handleClick}: ITab) => <StyledTab onClick={handleClick} isSelected={isSelected}>
    {name}
</StyledTab>

export const StyledTab = styled.li<{
    isSelected: boolean
}>`
  cursor: pointer;
  width: 7.3vw;
  height: 100%;
  font-size: 1vw;
  letter-spacing: -0.02vw;
  color: ${({isSelected}) => isSelected ? '#ffffff' : '#707182'};
  margin-left: 0.6vw;
  border-bottom: 2px solid ${({isSelected}) => isSelected ? '#7e4cff' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({isSelected}) => isSelected ? '#ffffff' : '#a2a5cb'};
  }
  
`

export default Tab