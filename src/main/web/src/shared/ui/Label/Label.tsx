import styled from "styled-components";
import labelDeco from "./img_item_deco.png";

interface ILabel {
    text: string,
    htmlFor: string,
    width: string
}

const Label = ({text, width, htmlFor}:ILabel) => <StyledLabel width={width} htmlFor={htmlFor}>
    {text}
</StyledLabel>

const StyledLabel = styled.label<{
    width: string,
}>`
  width: ${({width})=>width};
  margin-left: 0.8vw;
  font-size: 0.8vw;
  letter-spacing: -0.019vw;
  color: #a0a6b8;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  
  &:before {
    content: '';
    width: 10px;
    height: 10px;
    background: url(${labelDeco}) no-repeat center;
    margin-right: 10px;
    background-size: 100% 100%;
  }
`

export default Label