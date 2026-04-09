import { create } from 'zustand'
import React from 'react'

export enum EPopup {
  info,
  question,
  delete,

  transfer,
  share,
  sms,
  event,
}

export interface Popup {
  title?: string
  message: string | React.FC
  buttonText?: string
  callback: Function
  type: EPopup
  isCloseButtonShow?: boolean
}

export const createTemplatePopup = (): Popup => ({
  title: '',
  message: '',
  callback: () => {},
  buttonText: '닫기',
  type: EPopup.question,
  isCloseButtonShow: true,
})

interface PopupState {
  isShow: boolean
  popup: Popup
  showPopup: (popup: Popup) => void
  hidePopup: () => void
}

const usePopupStore = create<PopupState>((set) => ({
  isShow: false,
  popup: createTemplatePopup(),

  showPopup: (popup: Popup) =>
    set(() => ({
      isShow: true,
      popup,
    })),

  hidePopup: () =>
    set(() => ({
      isShow: false,
    })),
}))

export default usePopupStore
