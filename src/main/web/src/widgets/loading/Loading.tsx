import styled from 'styled-components'
import { useEffect, useState } from 'react'
import useLoadingStore from '@/app/useLoadingStore'

import loadingImage from './loading.gif'

const Loading = () => {
  const isShow = useLoadingStore((s) => s.isShow)
  const loadings = useLoadingStore((s) => s.loadings)

  const [dotCount, setDotCount] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      if (isShow && dotCount < 4) {
        setDotCount(dotCount + 1)
      } else {
        setDotCount(0)
      }
    }, 500)
  }, [isShow, dotCount])

  let dots = ''
  for (let i = 0; i < dotCount; i++) {
    dots += ' .'
  }

  return isShow ? (
    <StyledLoading>
      <StyledLoadingIcon src={loadingImage} />
      <StyledLoadingText>
        {loadings.length > 0 ? loadings[0].text : ''}
        {dots}
      </StyledLoadingText>
    </StyledLoading>
  ) : null
}

const StyledLoadingIcon = styled.img`
  width: 32vw;
  height: 16vw;
`

const StyledLoading = styled.section`
  position: absolute;
  left: 0;
  top: 0;

  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  align-items: center;

  background-color: #000000a0;
  z-index: 10000;
`

const StyledLoadingText = styled.strong`
  margin-top: 30px;
  font-size: 20px;
  color: darkgray;
`

export default Loading
