import {useDrag} from "react-dnd";
import {MOBILE_SELECT, VIDEO_SELECT} from '@/entities/event/MainType';
import {Mobile} from '@/entities/mobile/MobileType';
import styled from "styled-components";

import iconGisCctvNormal from "../Mobile/icon_gis_cctv_normal.png";
import {useEffect, useState} from "react";
import useMobileStore from '@/entities/mobile/useMobileStore';


const StyledLiveMobileListItem = styled.li<{
    isDragging: boolean,
    isSelected: boolean
}>`
  cursor: pointer;
  width: 100%;
  height: 27px;
  padding: 1px 0 1px 0;
  margin: 4px 8px 4px 8px;
  border-radius: 4px;
  background-color: ${({isSelected}) => isSelected ? '#7a45ff' : '#00000080'};
  display: flex;
  justify-content: left;
  align-items: center;
  opacity: ${({isDragging}) => isDragging ? 0.4 : 1};

  &:nth-child(odd) {
    background-color: #373659;
  }

  &:hover {
    background-color: #ffffff20;
  }

  & > b {
    padding-left: 2%;
    width: 80%;
    font-size: 11px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`

const StyledLiveMobileListItemIcon = styled.div<{
    icon: string
}>`
  width: 16px;
  height: 20px;
  display: flex;
  margin-left: 10px;
  justify-content: center;
  align-items: center;
  background: url(${({icon}) => icon}) no-repeat;
  background-size: 100% 100%;
`

const StyledLiveMobileListItemLabel = styled.label<{
    color?: string,
    text: string
}>`
  width: 20%;
  display: flex;
  justify-content: left;
  align-items: center;

  &:before {
    width: 5px;
    height: 5px;
    border-radius: 5px;
    margin: 0px 3px;
    background-color: ${({color}) => color};
    ${({color}) => color ? '"content: ;"' : null};
  }

  &:after {
    color: #FFFFFF;
    font-family: NotoSansCJKkr, serif;
    font-size: 0.3vw;
    font-weight: 600;
    margin-left: 10px;
    content: '${({text}) => text}';
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`

const LiveMobileListItem = (props: { mobile: Mobile , onClick?:Function, closeList?:Function  }) => {

    const activeMobile = useMobileStore((s) => s.activeMobile)
    const { setActiveMobile } = useMobileStore()
    const [mobileSelected, setMobileSelected] = useState<boolean>(false)


    const [{isDragging}, drag] = useDrag(() => ({
        type: VIDEO_SELECT,
        item: props.mobile,
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    }))

    useEffect(()=>{
        if(activeMobile?.id===props.mobile?.id){
            setMobileSelected(true)
        }else{
            setMobileSelected(false)
        }
    },[activeMobile])


    const handleClick = (e) => {

        // 자기 자신이 선택되어 있는 경우
        if (activeMobile?.id === props.mobile?.id) {
            setActiveMobile(null)
        }else{
            setActiveMobile(props.mobile)
            props.onClick(props.mobile.lng,props.mobile.lat+0.013);
            props.closeList(false)
            // setMobileSelected(true)d
        }

    }

    return <StyledLiveMobileListItem ref={drag} isSelected={mobileSelected} isDragging={isDragging}
                                     style={{backgroundColor : `${mobileSelected ? '#7a45ff' : '#00000080'}`}}
                                     onClick={e => handleClick(e)}>
        {props.mobile !== null ?
            <>
                <StyledLiveMobileListItemIcon icon={iconGisCctvNormal}/>
                <StyledLiveMobileListItemLabel text={`[${props.mobile.userNm}]`}/>
                <b>{`${props.mobile.userDept}-${props.mobile.userNm}`}</b>
            </>
            : <b>촬영중인 영상이 없습니다.</b>
        }
    </StyledLiveMobileListItem>
}


export default LiveMobileListItem