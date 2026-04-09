import styled from "styled-components";

interface IButton {
    children: any
}

const Button = ({children}: IButton) => <StyledButton>
    {children}
</StyledButton>

export const StyledButton = styled.button`
  cursor: pointer;
`

export default Button