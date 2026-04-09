import styled from "styled-components";
import React, {useEffect, useState} from "react";
import {playXeusPlayer} from '@/shared/lib/xeusPlayerHelper';

import noSignal from "./img_noSignal.png"
import cctvHeaderIcon from "./icon_cctv_header.png"
import closeNormal from "./btn_pop_close_hover.png"
import closeHover from "./btn_pop_close_normal.png"
import {Video} from '@/entities/video/VideoType';

interface IPlayer {
    index: number,
    isActive: boolean,
    video? : Video
    droppedVideos?: Video[],
    setDroppedVideos?: (updater: (prev: Video[]) => Video[]) => void,
    setVideo?: (video: Video | null) => void,
    setSelectedPlayer?: (video: Video | null) => void,
    isShare? : boolean

}

const doubleClickEvent = ((event: React.MouseEvent<HTMLElement>) => {
    const targetElem = event.target as HTMLElement & {
        mozRequestFullScreen?: () => void,
        webkitRequestFullscreen?: () => void,
        msRequestFullscreen?: () => void,
    };
    if(targetElem.requestFullscreen){
        targetElem.requestFullscreen();
    }else if(targetElem.mozRequestFullScreen){
        targetElem.mozRequestFullScreen();
    }else if(targetElem.webkitRequestFullscreen){
        targetElem.webkitRequestFullscreen();
    }else if(targetElem.msRequestFullscreen){
        targetElem.msRequestFullscreen();
    }
});

// video
const Player = ({index, isActive, video, setSelectedPlayer, droppedVideos, setDroppedVideos, setVideo,isShare}: IPlayer) => {
    const playerId = `player_${index}`
    const [player, setPlayer] = useState(null)

    // video
    useEffect(() => {
        if (video!==null) {
            if(video?.type==='mobile'){
                    setPlayer(playXeusPlayer(playerId, '',video?.type,video?.url))
            }else{
                setPlayer(playXeusPlayer(playerId,video?.url,video?.type,''))
            }
        }else{
            setPlayer(null)
        }
    }, [video])

    useEffect(() => {
        return () => {
            player?.destroy()
        }
    }, [player])

    // video
    return <StyledPlayer index={index} isActive={isActive}
                         onClick={() => setSelectedPlayer && setSelectedPlayer(video)}>
        <StyledPlayerHeader index={index} isActive={isActive} isShare={isShare}>
            <b>{video?.type==='mobile'? video?.nm : video?.type?.includes("CCTV") ? video?.nm : ''}</b>
            {droppedVideos && <button onClick={() => {
                video && droppedVideos && setDroppedVideos((droppedVideos:Video[]) => droppedVideos.filter(droppedVideo => droppedVideo.id!==video?.id))
                video && droppedVideos && setVideo(null)
            }}/>}
        </StyledPlayerHeader>
        <StyledPlayerMain id={playerId} onDoubleClick={doubleClickEvent}/>
    </StyledPlayer>
}

const StyledPlayerHeader = styled.header<IPlayer>`
  width: 100%;
  height: 2.5vh;
  display: flex;
  align-items: center;
  justify-content: left;
  position: relative;

  background: #535875;

  & button {
    cursor: pointer;
    width: 20px;
    height: 20px;
    background: url(${closeNormal}) no-repeat;
    background-size: 100% 100%;
  }

  & button:hover {
    background: url(${closeHover}) no-repeat;
    background-size: 100% 100%;
  }
  
  & b {
    min-width: 0;
    width: calc(100% - 1.5vw - 30px);
    font-size:${({isShare}) => isShare? `1.6vw` : `0.6vw`};
    color: #dddeed;

    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  &:before {
    content: '';
    width: 20px;
    height: 20px;
    margin: 0 5px;
    background: url(${cctvHeaderIcon}) no-repeat;
    background-size: 100% 100%;
  }

  &:after {
    content: ${({index}) => `#${index + 1}`};

    width: 1.5vw;
    height: 100%;
    position: absolute;

    font-size: 0.6vw;
    color: #dddeed;

    background-color: rgba(0, 0, 0, 0.21);
    right: 0;
    top: 0;

    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const StyledPlayer = styled.section<IPlayer>`
  cursor: pointer;
  height: 100%;

  & ${StyledPlayerHeader} {
    background: ${({isActive}) => isActive?'linear-gradient(to right, #5c68bd, #44467e)': ''};
  }
`

const StyledPlayerMain = styled.main`
  width: 100%;
  height: calc(100% - 2.5vh);

  position: relative;

  background: url(${noSignal}) no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
`

export default Player