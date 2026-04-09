import styled from 'styled-components'
import Map from '@/widgets/map-viewer/Map'
import { useEffect, useRef, useState } from 'react'
import { Event } from '@/entities/event/EventType'

import closeNormal from '@/widgets/popup/btn_pop_close_hover.png'
import closeHover from '@/widgets/popup/btn_pop_close_normal.png'

import warnIcon from './icon_pop_title_event.png'
import cctvHeader from './icon_cctv_header.png'
import Player from '@/shared/ui/Player/Player'
import { StyledButton } from '@/shared/ui/Button/Button'
import { Cctv } from '@/entities/cctv/CctvType'

import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { VIDEO_SELECT } from '@/entities/event/MainType'
import { DEFAULT_GPS } from '@/shared/config/DstConstants'
import usePopupStore, { EPopup, Popup } from '@/app/usePopupStore'
import useMobileStore from '@/entities/mobile/useMobileStore'
import { useAllMobiles } from '@/entities/mobile/useMobiles'
import { Mobile } from '@/entities/mobile/MobileType'
import { Video } from '@/entities/video/VideoType'

import useCctvSearch from '@/features/search-cctv/useCctvSearch'
import useAddressAutoComplete from '@/features/search-address/useAddressAutoComplete'
import CctvSearchArea from './CctvSearchArea'
import CctvSearchList from './CctvSearchList'

interface ICctvSelectPopup {
  event: Event
  isShow: boolean
  setShow: (isShow: boolean) => void
  selectedVideos: Video[]
  setSelectedVideos: (videos: Video[]) => void
}

const CctvSelectPopup = ({
  event,
  isShow,
  setShow,
  selectedVideos,
  setSelectedVideos,
}: ICctvSelectPopup) => {
  const { showPopup } = usePopupStore()
  const mobileList = useMobileStore((s) => s.liveMobiles)
  const { refetch: fetchMobiles } = useAllMobiles()

  const wrapRef = useRef<HTMLElement>(null)

  const [droppedMobiles, setDroppedMobiles] = useState<Mobile[]>([])
  const [droppedVideos, setDroppedVideos] = useState<Video[]>([])
  const [isListOpen, setIsListOpen] = useState<boolean>(false)
  const [mobiles, setMobiles] = useState<Mobile[]>([])
  const [newCenterCoordinates, setNewCenterCoordinates] = useState<number[]>([])
  const [mapCenter, setMapCenter] = useState<number[]>([])

  useEffect(() => {
    setMobiles(mobileList)
  }, [mobileList])

  useEffect(() => {
    if (event.x !== '' || event.y !== '') {
      setMapCenter([Number(event.y), Number(event.x)])
      setNewCenterCoordinates([Number(event.x), Number(event.y)])
    }
  }, [event])

  const flyToCoordinates = (locX: number, locY: number) => {
    setNewCenterCoordinates([locX, locY])
  }

  const { cctvPreviewResult, showCctvResultPreviewArea, setShowCctvResultPreviewArea, findCctvAutoComp } =
    useCctvSearch({
      onShowAddress: (show) => setShowAddressResultPreviewArea(show),
    })

  const { addressPreviewResult, showAddressResultPreviewArea, setShowAddressResultPreviewArea, findAddressAutoComp } =
    useAddressAutoComplete({
      onShowCctv: (show) => setShowCctvResultPreviewArea(show),
    })

  return isShow ? (
    <StyledCctvSelectPopupWrap
      ref={wrapRef}
      onClick={(e) => {
        e.stopPropagation()
        if (wrapRef.current === e.target) {
          setShow(false)
        }
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <StyledCctvSelectPopup>
          {/* CCTV + 주소 검색 영역 */}
          <CctvSearchArea
            cctvPreviewResult={cctvPreviewResult}
            showCctvResultPreviewArea={showCctvResultPreviewArea}
            addressPreviewResult={addressPreviewResult}
            showAddressResultPreviewArea={showAddressResultPreviewArea}
            isListOpen={isListOpen}
            onCctvSearchChange={findCctvAutoComp}
            onAddressSearchChange={findAddressAutoComp}
            onFlyTo={flyToCoordinates}
            onToggleMobileList={() => {
              setIsListOpen(!isListOpen)
              fetchMobiles()
            }}
          />

          {/* 모바일 영상 목록 */}
          <CctvSearchList
            isActive={isListOpen}
            mobiles={mobiles}
            onFlyTo={flyToCoordinates}
            onCloseList={setIsListOpen}
          />

          {/* 지도 영역 */}
          <StyledMapArea>
            <Map
              center={
                event.x !== '' && event.y !== ''
                  ? [Number(event.y), Number(event.x)]
                  : DEFAULT_GPS
              }
              isShow={isShow}
              isShowCctvs={true}
              isShowMobiles={true}
              newCenterCoordinates={newCenterCoordinates}
            />
          </StyledMapArea>

          <StyledSelectedCctvArea>
            {/* Header */}
            <StyledCctvSelectPopupHeader>
              <b>공유 CCTV</b>
              <button
                onClick={() => {
                  setShow(false)
                  setDroppedMobiles([] as Mobile[])
                }}
              />
            </StyledCctvSelectPopupHeader>

            <StyledCctvSelectPopupMain>
              {/* 이벤트 정보 */}
              <StyledCctvSelectPopupEventTitle>
                <strong>{event.statEvetNm}</strong>
                <small>{event.svcThemeNm}</small>
              </StyledCctvSelectPopupEventTitle>
              <StyledCctvSelectPopupEventLocation>
                <dt>발생위치</dt>
                <dd>{event.outbPlac}</dd>
              </StyledCctvSelectPopupEventLocation>
              <StyledCctvSelectPopupEventLocation>
                <dt>발생좌표</dt>
                <dd>{`X: ${event.x} / Y: ${event.y}`}</dd>
              </StyledCctvSelectPopupEventLocation>

              {/* Player */}
              <StyledCctvPlayersAreaHeader>공유 CCTV</StyledCctvPlayersAreaHeader>
              <StyledCctvPlayersArea>
                {Array.from({ length: 4 }).map((_, index) => (
                  <DroppablePlayer
                    index={index}
                    key={`player_${index + 1}`}
                    droppedVideos={droppedVideos}
                    setDroppedVideos={setDroppedVideos}
                  />
                ))}
              </StyledCctvPlayersArea>

              <StyledSaveButton
                onClick={() => {
                  if (droppedVideos.length === 0) {
                    showPopup({
                      title: '필수 항목 누락',
                      message: '영상을 선택해주세요.',
                      buttonText: '확인',
                      type: EPopup.info,
                      callback: () => {},
                    } as Popup)
                    return
                  }
                  const videoSet = new Set<Video>()
                  droppedVideos.forEach((video) => videoSet.add(video))
                  setSelectedVideos(Array.from(videoSet))
                  setDroppedVideos([])
                  setShow(false)
                }}
              >
                저장
              </StyledSaveButton>
            </StyledCctvSelectPopupMain>
          </StyledSelectedCctvArea>
        </StyledCctvSelectPopup>
      </DndProvider>
    </StyledCctvSelectPopupWrap>
  ) : null
}

// ─── DroppablePlayer ────────────────────────────────────────────────────────

interface IDroppablePlayer {
  index: number
  droppedVideos: Video[]
  setDroppedVideos: (updater: Video[] | ((prev: Video[]) => Video[])) => void
}

const DroppablePlayer = ({ index, droppedVideos, setDroppedVideos }: IDroppablePlayer) => {
  const [video, setVideo] = useState<Video>()

  const [{ isOver }, drop] = useDrop(() => ({
    accept: VIDEO_SELECT,
    drop: (item: Mobile | Cctv) => {
      let newVideo: Video = null

      if (item.type === 'mobile') {
        const mobileItem = item as Mobile
        newVideo = { id: mobileItem.id, nm: mobileItem.userDept + '-' + mobileItem.userNm, type: 'mobile', url: mobileItem.mbUrl, lng: mobileItem.lng, lat: mobileItem.lat }
      }

      if (item.type === 'cctv') {
        const cctvItem = item as Cctv
        newVideo = { id: cctvItem.deviceId, nm: cctvItem.cctvNm, type: cctvItem.clftNm, url: cctvItem.mgrNo, lat: cctvItem.x, lng: cctvItem.y }
      }

      setVideo(newVideo)
      setDroppedVideos((prev: Video[]) =>
        prev.length >= 4
          ? [...prev.slice(prev.length - 3, prev.length), newVideo]
          : [...prev, newVideo]
      )
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  return (
    <StyledDroppablePlayer ref={drop}>
      <Player
        video={video}
        index={index}
        isActive={isOver}
        droppedVideos={droppedVideos}
        setDroppedVideos={setDroppedVideos}
        setVideo={setVideo}
        isShare={false}
      />
    </StyledDroppablePlayer>
  )
}

// ─── Styled Components ──────────────────────────────────────────────────────

const StyledDroppablePlayer = styled.li`
  width: 49%;
  height: 49%;
`

export const StyledSaveButton = styled(StyledButton)`
  width: 6vw;
  height: 3.8vh;
  max-height: 40px;
  border-radius: 1vw;

  box-shadow: 0 0.15625vw 0.625vw 0 rgb(0 0 0 / 12%);
  border: solid 0.05vw #9c5eff;
  background-color: #7a45ff;

  font-size: 0.78125vw;
  letter-spacing: -0.019vw;
  text-align: center;
  color: #ffffff;

  margin-top: 2vh;
  margin-left: auto;

  &:hover {
    background-color: #7c5bf5;
    border: solid 0.05vw #9c5eff;
  }
`

const StyledCctvPlayersAreaHeader = styled.h2`
  padding: 4vh 0;
  color: #ffffff;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  &:before {
    content: '';
    width: 10px;
    height: 10px;
    background: url(${cctvHeader}) no-repeat;
    background-size: 100% 100%;
    margin-right: 5px;
  }
`

const StyledCctvPlayersArea = styled.ul`
  width: 100%;
  height: 60%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  align-content: space-between;
`

const StyledCctvSelectPopupEventLocation = styled.dl`
  padding: 0.5vh 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  & dd {
    width: 85%;
    min-height: 1.5vh;
    font-size: 0.8vw;
    letter-spacing: -0.015vw;
    color: #e6e7f5;
    position: relative;
    display: flex;
    align-items: center;
    margin-left: 5%;
    border-radius: 1vw;
  }

  & dt {
    width: 15%;
    height: 100%;
    font-size: 0.8vw;
    letter-spacing: -0.015vw;
    color: #ccbfd6;
    position: relative;
    display: flex;
    align-items: center;
  }

  & dt:before {
    content: '';
    width: 2px;
    height: 2px;
    border-radius: 2px;
    background-color: #7e4cff;
    margin-right: 5px;
  }
`

const StyledCctvSelectPopupEventTitle = styled.h1`
  padding: 4vh 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & strong {
    color: #f2f3f5;
    font-size: 1.2vw;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & small {
    color: #e34285;
    font-size: 0.8vw;
    margin-left: 1vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &:before {
    content: '';
    width: 15px;
    height: 15px;
    background: url(${warnIcon}) no-repeat;
    background-size: 100% 100%;
    margin-right: 0.5vw;
  }
`

const StyledCctvSelectPopupMain = styled.main`
  padding: 2vh 2vw;
  width: calc(100% - 4vw);
  height: calc(100% - 7.5vh);
  display: flex;
  flex-direction: column;
`

const StyledCctvSelectPopupHeader = styled.header`
  width: calc(100% - 2vw);
  height: 3.5vh;
  background-color: #35344f;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1vw;

  & b {
    color: #fcfcfc;
    font-size: 0.7vw;
  }

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
`

const StyledMapArea = styled.article`
  width: 60%;
  height: 100%;
  background-color: gray;
`

const StyledSelectedCctvArea = styled.article`
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(280deg, #39385c, #2d2c47 100%);
`

const StyledCctvSelectPopup = styled.section`
  width: 85vw;
  height: 80vh;
  background-color: orange;
  border-radius: 0.4vw;
  overflow: hidden;
  display: flex;
`

const StyledCctvSelectPopupWrap = styled.section`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #000000a0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
`

export default CctvSelectPopup
