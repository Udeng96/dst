import styled, { keyframes } from 'styled-components'
import Map from '@/widgets/map-viewer/Map'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Event } from '@/entities/event/EventType'

import closeNormal from '@/widgets/popup/btn_pop_close_hover.png'
import closeHover from '@/widgets/popup/btn_pop_close_normal.png'

import warnIcon from './icon_pop_title_event.png'
import { StyledButton } from '@/shared/ui/Button/Button'

import { DEFAULT_GPS } from '@/shared/config/DstConstants'
import usePopupStore, { EPopup, Popup } from '@/app/usePopupStore'
import useEventStore from '@/entities/event/useEventStore'
import { useEventAllInfo } from '@/entities/event/useEvents'
import { useQueryClient } from '@tanstack/react-query'
import { EVENT_QUERY_KEY } from '@/entities/event/useEvents'
import Field, { EField } from '@/shared/ui/Field/Field'
import { LatLngExpression } from 'leaflet'
type Option = { value: string; label: string; data?: string }
import InputSelect from '@/shared/ui/InputSelect/InputSelect'
import axios from 'axios'
import { SingleValue } from 'react-select'

import useAddressAutoComplete from '@/features/search-address/useAddressAutoComplete'

interface IEventGenerator {
  event: Event
  isShow: boolean
  setShow: (isShow: boolean) => void
}

const vworld_api_url = '/dst/vworld/address'
const generate_event_url = '/dst/events/generation'

const EventGenerator = ({ event, isShow, setShow }: IEventGenerator) => {
  const { showPopup } = usePopupStore()
  const queryClient = useQueryClient()
  const newEventLocation = useEventStore((s) => s.newEventLocation)
  const eventInfos = useEventStore((s) => s.eventInfos)
  const { setChangeEventCoordinate, setNewEventLocation } = useEventStore()
  useEventAllInfo()

  const [dmsCoordinates, setDmsCoordinates] = useState<{ x: string; y: string }>({ x: '0', y: '0' })
  const [eventOptions, setEventOptions] = useState<Option[]>([])
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string; data?: string }>({ label: '선택', value: '' })

  const [svcThemeOptions, setSvcThemeOptions] = useState<Option[]>([])
  const [selectedOptionSvcTheme, setSelectedOptionSvcTheme] = useState<{ value: string; label: string; data?: string }>({ label: '선택', value: '' })

  const [address, setAddress] = useState<string>('')

  const wrapRef = useRef<HTMLElement>(null)
  const [newCenterCoordinates, setNewCenterCoordinates] = useState<number[]>([])

  const flyToCoordinates = (locX: number, locY: number) => {
    setNewCenterCoordinates([locX, locY])
  }

  const { addressPreviewResult, showAddressResultPreviewArea, findAddressAutoComp } =
    useAddressAutoComplete()

  // 팝업 열릴 때 초기화
  useEffect(() => {
    isShow && setChangeEventCoordinate(false)

    return () => {
      setChangeEventCoordinate(true)
      setSelectedOptionSvcTheme({ label: '선택', value: '' })
      setSelectedOption({ label: '선택', value: '' })
      setNewEventLocation({ lat: 0, lng: 0 })
      setAddress('')
    }
  }, [isShow])

  // eventInfos 로드 시 svcTheme 옵션 생성
  useEffect(() => {
    if (eventInfos) {
      const svcThemeMap: Record<string, { svcThemeCd: string; svcThemeNm: string }> = {}

      for (let i = 0; i < eventInfos.length; i++) {
        const item = eventInfos[i]
        svcThemeMap[item.svcThemeCd] = {
          svcThemeCd: item.svcThemeCd,
          svcThemeNm: item.svcThemeNm,
        }
      }

      const svcThemeList = Object.values(svcThemeMap)

      setSvcThemeOptions(
        [{ value: '', label: '선택' } as Option].concat(
          svcThemeList.map((info) => ({ value: info.svcThemeCd, label: `${info.svcThemeNm}` }) as Option)
        )
      )
    }
  }, [eventInfos])

  // 지도 클릭 좌표 변경 시 주소 조회
  useEffect(() => {
    if (newEventLocation.lng !== 0 && newEventLocation.lat !== 0 && isShow) {
      const dmsX = convertDegreeToDms(newEventLocation.lng)
      const dmsY = convertDegreeToDms(newEventLocation.lat)
      setDmsCoordinates({ x: dmsX, y: dmsY })

      axios
        .get(vworld_api_url, {
          params: { x: newEventLocation.lng, y: newEventLocation.lat },
          headers: { 'Content-Type': 'application/json; charset=utf8' },
        })
        .then((res) => setAddress(res.data || '주소없음'))
        .catch(() => setAddress('주소없음'))
    }
  }, [newEventLocation])

  const convertDegreeToDms = (coordinate: number): string => {
    const absolute = Math.abs(coordinate)
    const degrees = Math.floor(absolute)
    const minutesNotTruncated = (absolute - degrees) * 60
    const minutes = Math.floor(minutesNotTruncated)
    const seconds = Math.round((minutesNotTruncated - minutes) * 60)
    return `${degrees}-${minutes}-${seconds}`
  }

  const handleChangeSvcTheme = (value: SingleValue<Option>) => {
    setSelectedOptionSvcTheme(value as { value: string; label: string })
    if (eventInfos) {
      const selected = value as { value: string; label: string }
      const subEventList = eventInfos.filter((item) => selected.value === item.svcThemeCd)

      setEventOptions(
        [{ value: '', label: '선택' } as Option].concat(
          subEventList.map(
            (info) => ({ value: info.rowId, label: `[${info.evetGdNm}]${info.statEvetNm}` }) as Option
          )
        )
      )
    }
  }

  const handleChangeEvent = (value: SingleValue<Option>) => {
    setSelectedOption(value as { value: string; label: string })
  }

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
      <StyledEventGeneratorPopup>
        {/* 주소 검색 영역 */}
        <StyledMapSearchArea>
          <Field
            labelText={'주소'}
            inputText={null}
            labelWidth={'25%'}
            inputWidth={'70%'}
            readOnly={false}
            handleChange={(e: ChangeEvent<HTMLInputElement>) => findAddressAutoComp(e.target.value)}
          />
          <StyledSearchPreviewArea isShow={showAddressResultPreviewArea}>
            {addressPreviewResult.map((addrItem) => (
              <StyledSearchPreview
                key={addrItem.address}
                onClick={() => flyToCoordinates(addrItem.locX, addrItem.locY)}
              >
                {addrItem.address}
              </StyledSearchPreview>
            ))}
          </StyledSearchPreviewArea>
        </StyledMapSearchArea>

        {/* 지도 영역 */}
        <StyledMapArea>
          <Map
            center={[parseFloat(DEFAULT_GPS[0]), parseFloat(DEFAULT_GPS[1])] as LatLngExpression}
            isShow={isShow}
            isShowCctvs={false}
            isShowCenter={false}
            newCenterCoordinates={newCenterCoordinates}
            isEventGenerator
          />
        </StyledMapArea>

        <StyledEventFormArea>
          {/* Header */}
          <StyledEventFormPopupHeader>
            <b>이벤트 발생</b>
            <button onClick={() => setShow(false)} />
          </StyledEventFormPopupHeader>

          <StyledEventFormPopupMain>
            <StyledEventFormPopupEventTitle>
              <strong>이벤트</strong>
              <small>발생</small>
            </StyledEventFormPopupEventTitle>

            <StyledEventFormPopupSub>
              <dt>발생유형</dt>
              <InputSelect
                options={svcThemeOptions}
                width={'10vw'}
                value={selectedOptionSvcTheme}
                height={'4vh'}
                handleChange={handleChangeSvcTheme}
              />
              <InputSelect
                options={eventOptions}
                width={'10vw'}
                value={selectedOption}
                height={'4vh'}
                handleChange={handleChangeEvent}
              />
            </StyledEventFormPopupSub>
            <StyledEventFormPopupSub>
              <dt>발생주소</dt>
              <dd>{address}</dd>
            </StyledEventFormPopupSub>
            <StyledEventFormPopupSub>
              <dt>발생좌표(Degrees)</dt>
              <dd>
                {`X: ${newEventLocation.lng}`} / {`Y: ${newEventLocation.lat}`}
              </dd>
            </StyledEventFormPopupSub>
            <StyledEventFormPopupSub>
              <dt>발생좌표(DMS)</dt>
              <dd>
                {`X: ${dmsCoordinates.x}`} / {`Y: ${dmsCoordinates.y}`}
              </dd>
            </StyledEventFormPopupSub>

            {/* 저장 버튼 */}
            <StyledSaveButton
              onClick={() => {
                if (!selectedOption.value) {
                  showPopup({
                    title: '필수 항목 누락',
                    message: '발생유형을 선택해주세요.',
                    buttonText: '확인',
                    type: EPopup.info,
                    callback: () => {},
                  } as Popup)
                  return
                }
                if (!address) {
                  showPopup({
                    title: '필수 항목 누락',
                    message: '발생주소를 선택해주세요',
                    buttonText: '확인',
                    type: EPopup.info,
                    callback: () => {},
                  } as Popup)
                  return
                }
                if (newEventLocation.lng === 0 && newEventLocation.lat === 0) {
                  showPopup({
                    title: '필수 항목 누락',
                    message: '발생좌표를 선택해주세요',
                    buttonText: '확인',
                    type: EPopup.info,
                    callback: () => {},
                  } as Popup)
                  return
                }
                showPopup({
                  message: '이벤트를 발생시키겠습니까?',
                  type: EPopup.question,
                  buttonText: '확인',
                  title: '이벤트 발생',
                  callback: () => {
                    axios
                      .post(
                        generate_event_url,
                        {},
                        {
                          params: {
                            evetId: selectedOption.value,
                            evetNm: selectedOption.label.split(']')[1],
                            address: address,
                            x: newEventLocation.lng,
                            y: newEventLocation.lat,
                          },
                          headers: { 'Content-Type': 'application/json; charset=utf8' },
                        }
                      )
                      .then(() => {
                        queryClient.invalidateQueries({ queryKey: EVENT_QUERY_KEY.list() })
                        showPopup({
                          message: '이벤트 등록 성공',
                          type: EPopup.info,
                          buttonText: '확인',
                          title: '이벤트 등록',
                          callback: () => setShow(false),
                        })
                      })
                      .catch((error) => console.log(error))
                  },
                })
              }}
            >
              저장
            </StyledSaveButton>
          </StyledEventFormPopupMain>
        </StyledEventFormArea>
      </StyledEventGeneratorPopup>
    </StyledCctvSelectPopupWrap>
  ) : null
}

// ─── Styled Components ──────────────────────────────────────────────────────

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

const StyledEventFormPopupSub = styled.dl`
  padding: 1vh 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  & dd {
    width: 75%;
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
    width: 25%;
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

const StyledEventFormPopupEventTitle = styled.h1`
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

const StyledEventFormPopupMain = styled.main`
  padding: 2vh 2vw;
  width: calc(100% - 4vw);
  height: calc(100% - 7.5vh);
  display: flex;
  flex-direction: column;
`

const StyledEventFormPopupHeader = styled.header`
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

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`

const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0; }
`

const StyledMapSearchArea = styled.div`
  width: 25%;
  height: 5vh;
  display: inline-block;
  position: absolute;
  top: calc(100% - 89%);
  left: calc(100% - 89%);
  z-index: 999;
  background-color: #39385c;
  border-radius: 10px;
  padding-right: 15px;
`

const StyledSearchPreviewArea = styled.div<{ isShow: boolean }>`
  background-color: #39385c;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  margin-left: 27%;
  transition: visibility 0.15s ease-out;
  animation: ${(props) => (props.isShow ? fadeIn : fadeOut)} 0.15s ease-out;
  display: ${(props) => (props.isShow ? 'inline-block' : 'none')};
  width: 73%;
  height: 200px;
  z-index: 999;
  overflow-y: auto;
  position: absolute;
`

const StyledSearchPreview = styled.div`
  cursor: pointer;
  margin-left: 10px;
  margin-bottom: 5px;
  color: #f2f3f5;
`

const StyledEventFormArea = styled.article`
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(280deg, #39385c, #2d2c47 100%);
`

const StyledEventGeneratorPopup = styled.section`
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

export default EventGenerator
