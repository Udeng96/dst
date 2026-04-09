import styled from "styled-components";
import Tab, {ETab} from '@/shared/ui/Tab/Tab';
export interface ITabGroup {
    selectedTab: ETab ,
    setSelectedTab: (tab: ETab) => void,
    isLoading: boolean,
}

const TabGroup = ({isLoading, selectedTab, setSelectedTab}: ITabGroup) => {
    return <StyledTabGroup isLoading={isLoading}>
        <Tab name={'이벤트 상세 정보'} isSelected={selectedTab === ETab.eventDetail} handleClick={() => setSelectedTab(ETab.eventDetail)}/>
        <Tab name={'상황전파(SMS)'} isSelected={selectedTab === ETab.situationTransfer} handleClick={() => setSelectedTab(ETab.situationTransfer)}/>
        <Tab name={'조치 및 보고서'} isSelected={selectedTab === ETab.report} handleClick={() => setSelectedTab(ETab.report)}/>
    </StyledTabGroup>
}

export const StyledTabGroup = styled.ul<{
    isLoading: boolean
}>`
  width: 100%;
  height: 42px;
  margin-top: 3.5vh;
  padding: 0 2vw;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  opacity: ${({isLoading}) => isLoading?'0':'1'};

`

export default TabGroup