import { create } from 'zustand'

interface EditGuardState {
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  confirmIfEditing: (onConfirm: () => void, showPopup: (popup: any) => void) => void
}

const useEditGuardStore = create<EditGuardState>((set, get) => ({
  isEditing: false,

  setIsEditing: (editing) => set({ isEditing: editing }),

  confirmIfEditing: (onConfirm, showPopup) => {
    if (get().isEditing) {
      showPopup({
        title: '편집 중',
        message: '작성 중인 내용이 있습니다. 이동하시겠습니까?',
        type: 1, // EPopup.question
        buttonText: '이동',
        isCloseButtonShow: true,
        callback: () => {
          set({ isEditing: false })
          onConfirm()
        },
      })
    } else {
      onConfirm()
    }
  },
}))

export default useEditGuardStore
