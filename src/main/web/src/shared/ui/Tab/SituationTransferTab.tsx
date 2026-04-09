import styled from "styled-components";
import {ITab, StyledTab} from "./Tab";

interface ISituationTransferTab extends ITab {
    normalIcon: string,
    hoverIcon: string,
    selectedIcon: string,
}

export enum ESituationTransferTab {
    transfer,
    sms,
    share,
}

const SituationTransferTab = ({
                                  isSelected, name, handleClick,
                                  normalIcon, hoverIcon, selectedIcon
                              }: ISituationTransferTab) =>
    <StyledSituationTransferTab onClick={handleClick} isSelected={isSelected}
                                normalIcon={normalIcon} hoverIcon={hoverIcon} selectedIcon={selectedIcon}>
        {name}
    </StyledSituationTransferTab>

const StyledSituationTransferTab = styled(StyledTab)<{
    normalIcon: string,
    hoverIcon: string,
    selectedIcon: string,
}>`
  width: 5vw;
  font-size: 0.72vw;
  border-bottom: 0.1vw solid ${({isSelected}) => isSelected ? '#7e4cff' : 'transparent'};

  &:before {
    content: '';
    width: 14px;
    height: 14px;
    margin-right: 3px;

    background: url(${({normalIcon, selectedIcon, isSelected}) => isSelected?selectedIcon:normalIcon}) center no-repeat;
    background-size: 100% 100%;
  }
  &:hover:before {
    content: '';
    background: url(${({hoverIcon, selectedIcon, isSelected}) => isSelected?selectedIcon:hoverIcon}) center no-repeat;
    background-size: 100% 100%;
  }
`

export default SituationTransferTab