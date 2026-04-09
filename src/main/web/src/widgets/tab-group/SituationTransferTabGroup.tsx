import styled from "styled-components";
import {StyledTabGroup} from "./TabGroup";
import SituationTransferTab, {ESituationTransferTab} from '@/shared/ui/Tab/SituationTransferTab';

import shareHoverIcon from "./icon_tap_share_hover.png"
import shareNormalIcon from "./icon_tap_share_normal.png"
import shareSelectedIcon from "./icon_tap_share_selected.png"
import smsHoverIcon from "./icon_tap_sms_hover.png"
import smsNormalIcon from "./icon_tap_sms_normal.png"
import smsSelectedIcon from "./icon_tap_sms_selected.png"
import transferHoverIcon from "./icon_tap_transfer_hover.png"
import transferNormalIcon from "./icon_tap_transfer_normal.png"
import transferSelectedIcon from "./icon_tap_transfer_selected.png"
import {ECrudStatus} from "../situation-transfer/SituationTransfer";
import useDisasterHistoryStore from '@/entities/disaster-history/useDisasterHistoryStore';

interface ISituationTransferTabGroup {
    selectedTab: ESituationTransferTab
    setSelectedTab: (tab: ESituationTransferTab) => void,
    isLoading: boolean,
    setCrudStatus: (status: ECrudStatus) => void,
}

const SituationTransferTabGroup = ({selectedTab, setSelectedTab, isLoading, setCrudStatus}: ISituationTransferTabGroup) => {

    const { setSelectedDisasterHistory } = useDisasterHistoryStore()
    return <StyledSituationTransferTabGroup isLoading={isLoading}>
        {/*<SituationTransferTab normalIcon={transferNormalIcon}*/}
        {/*                      hoverIcon={transferHoverIcon}*/}
        {/*                      selectedIcon={transferSelectedIcon} name={'전파'}*/}
        {/*                      isSelected={selectedTab === ESituationTransferTab.transfer}*/}
        {/*                      handleClick={()=>{*/}
        {/*                          setCrudStatus(ECrudStatus.read)*/}
        {/*                          setSelectedTab(ESituationTransferTab.transfer)*/}
        {/*                      }}/>*/}
        <SituationTransferTab normalIcon={shareNormalIcon}
                              hoverIcon={shareHoverIcon}
                              selectedIcon={shareSelectedIcon} name={'공유'}
                              isSelected={selectedTab === ESituationTransferTab.share}
                              handleClick={()=>{
                                  setSelectedDisasterHistory(null)
                                  setTimeout(()=>{

                                      setCrudStatus(ECrudStatus.create)
                                      setSelectedTab(ESituationTransferTab.share)
                                  },100)

                              }}/>
        <SituationTransferTab normalIcon={smsNormalIcon}
                              hoverIcon={smsHoverIcon}
                              selectedIcon={smsSelectedIcon} name={'SMS'}
                              isSelected={selectedTab === ESituationTransferTab.sms}
                              handleClick={()=>{
                                  setSelectedDisasterHistory(null)
                                  setTimeout(()=>{
                                      setCrudStatus(ECrudStatus.create)
                                      setSelectedTab(ESituationTransferTab.sms)
                                  },100)


                              }}/>
    </StyledSituationTransferTabGroup>
}

const StyledSituationTransferTabGroup = styled(StyledTabGroup)`
  margin-top: 0;
  width: 100%;
  padding: 1% 0 0 0;
  border-bottom: 0.05vw solid #15161a;
  position: relative;

  &:after {
    position: absolute;
    bottom: -2px;
    left: 0;
    content: '';
    width: 100%;
    border-bottom: 1px solid #41424c;
  }
`

export default SituationTransferTabGroup