import styled from 'styled-components'
import usePopupStore, { EPopup } from '@/app/usePopupStore'
import { StyledButton } from '@/shared/ui/Button/Button'

import closeNormal from './btn_pop_close_normal.png'
import closeHover from './btn_pop_close_hover.png'
import infoImage from './img_pop_info.png'
import questionImage from './img_pop_question.png'
import questionImageLeft from './img_left.png'
import questionImageRight from './img_right.png'
import deleteImage from './img_pop_delete.png'
import transferImage from './img_pop_transfer.png'
import shareImage from './img_pop_share.png'
import smsImage from './img_pop_sendSms.png'
import eventImage from './img_pop_timeLine.png'

interface IPopup {
  isShow: boolean
}

const Popup = () => {
  const isShow = usePopupStore((s) => s.isShow)
  const popup = usePopupStore((s) => s.popup)
  const hidePopup = usePopupStore((s) => s.hidePopup)

  const { message, callback, type, isCloseButtonShow = true, title = '', buttonText = '확인' } = popup

  return (
    <StyledDim isShow={isShow}>
      <StyledPopup>
        <StyledPopupHeader>
          <h1>{title}</h1>
          {isCloseButtonShow && <CloseButtonStyle onClick={() => hidePopup()} />}
        </StyledPopupHeader>
        <PopupBodyStyle>
          <StyledPopupMessageArea>
            {typeof message !== 'string' ? message : <StyledPopupMessage>{message}</StyledPopupMessage>}
          </StyledPopupMessageArea>
          <StyledPopupImage type={type} />
        </PopupBodyStyle>
        <StyledPopupFooter>
          <StyledPopupButton
            className={
              type === EPopup.question ? 'warn' : type === EPopup.delete ? 'error' : 'info'
            }
            onClick={async () => {
              await callback && callback()
              hidePopup()
            }}
          >
            {buttonText}
          </StyledPopupButton>
        </StyledPopupFooter>
      </StyledPopup>
    </StyledDim>
  )
}

const StyledDim = styled.aside<IPopup>`
  position: absolute;
  left: 0;
  top: 0;

  width: 100vw;
  height: 100vh;

  display: ${({ isShow }) => (isShow ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  align-items: center;

  background-color: #000000a0;
  z-index: 10000;
`
const StyledPopup = styled.section`
  min-width: 300px;
  width: 25vw;
  min-height: 200px;
  height: 30vh;

  display: flex;
  flex-direction: column;

  background-image: linear-gradient(to right, #1e1d2f, #24243b);

  border-radius: 0.5vw;
  overflow: hidden;
`

const StyledPopupHeader = styled.header`
  width: calc(100% - 3vw);
  height: 35px;
  padding: 0 1.5vw;

  background-image: linear-gradient(to right, #24243b, #24243a);

  color: #ffffff;
  font-family: NotoSansCJKkr, serif;
  font-size: 0.7vw;
  font-weight: 600;

  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CloseButtonStyle = styled.button`
  cursor: pointer;
  width: 20px;
  height: 20px;
  background: url(${closeNormal}) no-repeat;
  background-size: 100% 100%;

  &:hover {
    background: url(${closeHover}) no-repeat;
    background-size: 100% 100%;
  }
`

const PopupBodyStyle = styled.main`
  width: calc(100% - 2vw);
  height: calc(75% - 20px - 2vh);
  padding: 1vh 1vw;

  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const PopupContentStyle = styled.article`
  display: block;
  color: #ffffff;
  font-family: NotoSansCJKkr, serif;
  font-size: 0.9vw;
  font-weight: 400;
  line-height: 1.5vw;

  & p {
    display: block;
  }

  & b {
    color: #ffffff80;
    font-size: 1.3vw;
    font-weight: 500;
  }

  & strong {
    font-size: 1.3vw;
    font-weight: 500;
  }

  & strong.info {
    color: #3173df;
  }

  & strong.warn {
    color: #edb04e;
  }

  & strong.error {
    color: #f55c51;
  }
`

const StyledPopupMessageArea = styled.aside`
  width: calc(65% - 2vw);
  height: calc(100% - 6vh);
  padding: 3vh 1vw;
  display: flex;

  &:before {
    content: '';
    display: block;
    width: 20px;
    height: 17px;
    background: url(${questionImageLeft}) no-repeat;
    background-size: 100% 100%;
    margin-bottom: 0.3vh;
  }

  &:after {
    content: '';
    display: block;
    width: 20px;
    height: 17px;
    background: url(${questionImageRight}) no-repeat;
    background-size: 100% 100%;
    margin-bottom: 0.3vh;
  }
`

const StyledPopupMessage = styled.b`
  color: #ffffff;
  font-family: NotoSansCJKkr, serif;
  font-size: 1.2rem;
  font-weight: 500;
`

const StyledPopupButton = styled(StyledButton)`
  height: 4vh;
  min-height: 35px;
  min-width: 75px;
  border-radius: 1vw;
  box-shadow: 0 0.2vw 0.77vw 0 rgb(62 2 2 / 32%);

  margin: 0 0.25vw;

  font-size: 0.8vw;

  color: #ffffff;

  display: flex;
  justify-content: center;
  align-items: center;

  border: solid 0.05vw;

  &.info {
    border-color: #9c5eff;
    background: linear-gradient(290deg, #7132dd, #7a45ff 100%);
  }

  &.warn {
    border-color: #edb04e;
    background: linear-gradient(290deg, #d17d24, #dba22e 100%);
  }

  &.error {
    border-color: #f55c51;
    background: linear-gradient(290deg, #bd3624, #e54c38 100%);
  }
`

const StyledPopupImage = styled.aside<{
  type: EPopup
}>`
  width: 35%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:after {
    content: '';
    width: 150px;
    height: 115px;
    background: url(${({ type }) =>
        type === EPopup.info
          ? infoImage
          : type === EPopup.question
            ? questionImage
            : type === EPopup.delete
              ? deleteImage
              : type === EPopup.transfer
                ? transferImage
                : type === EPopup.share
                  ? shareImage
                  : type === EPopup.sms
                    ? smsImage
                    : type === EPopup.event
                      ? eventImage
                      : 'none'})
      no-repeat;
    background-size: 100% 100%;
  }
`

const StyledPopupFooter = styled.footer`
  width: calc(100% - 2vw);
  height: calc(25% - 2vh);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1vh 1vw;
`

export default Popup
