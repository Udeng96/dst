import {useEffect, useState} from "react";
import {Mobile} from '@/entities/mobile/MobileType';
import useMobileStore from '@/entities/mobile/useMobileStore';
import styled from "styled-components";
import {Scrollbar} from "react-scrollbars-custom";
import LiveMobileListItem from "./LiveMobileListItem";


const StyledLiveMobileListBox = styled.ul`
    width: 100%;
  border-radius: 0.5vw;
  overflow : hidden;
  background-color : #1e2036;
  display: flex;
  flex-direction : column;
  
  & > header {
    background-color : #090718;
    width: 100%;
    height: 24px;
    line-height: 24px;
    padding : 0 15% 0 5%;
    margin: 0;
    
    position : relative;
    
    font-size : 0.7vw;
    font-weight: 600;
    text-overflow : ellipsis;
    white-space : nowrap;
    overflow : hidden;
    
    color : #fcfcfc;
  }
`



const LiveMobileListBox = () => {
    const [mobiles,setMobiles] = useState<Mobile[]>([])
    const liveMobileList = useMobileStore((s) => s.liveMobiles)

    useEffect(()=>{
        if(liveMobileList){
            setMobiles(liveMobileList)
        }
    },[liveMobileList])


    return <StyledLiveMobileListBox>
        <header>Live Mobile 목록</header>
        <Scrollbar style ={{width:'400px',height:'200px'}}>
            {mobiles ? mobiles.map(mobile => {
                return <LiveMobileListItem mobile={mobile}/>
            }) : <LiveMobileListItem mobile={null}/>}
        </Scrollbar>
    </StyledLiveMobileListBox>


}



export default LiveMobileListBox