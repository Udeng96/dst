import Select, {SingleValue} from 'react-select'
import styled from "styled-components";
type Option = { value: string; label: string };

interface IInputSelect {
    value: Option | null,
    options: Option[]
    handleChange?: (option: SingleValue<Option>) => void,
    width: string,
    height: string,
}

/**
 * Select 는 input 이 아니라는 사실은 저도 압니다.
 * 근데 다른 형제들이 다 input 을 앞에 붙이고 있는데다가,
 * "Select" 는 너무 범용적이라 찾아 적용하기가 너무 번거로워요.
 */
const InputSelect = ({value, options, handleChange, width, height}: IInputSelect) => {

    return <StyledSelect value={value} 
                         isSearchable={false} classNamePrefix="search-select"
                         options={options} onChange={handleChange}
                         defaultMenuIsOpen={false}
                         defaultValue={options} width={width} height={height} defaultInputValue={''}/>
}


const StyledSelect = styled(Select)<{
    width: string,
    height: string,
}>`
  width: ${({width}) => width};
  height: ${({height}) => height};
  display: flex;
  justify-items: center;
  align-items: center;

  .search-select__control {
    cursor: pointer;
    width: 100%;
    box-shadow: none;
    height: 100%;
    min-height: auto;

    border-radius: 0.4vw;
    border: solid 0.05vw #1e1e24;
    background-color: #24252b;
    font-size: 0.7vw;

    &:hover {
      color: #e6e7f5;
    }
  }

  .search-select__single-value,
  .search-select__placeholder,
  .search-select__option {
    color: #a0a6b8;
    font-size: 0.7vw;
    font-weight: 500;
  }

  .search-select__single-value:hover,
  .search-select__placeholder:hover,
  .search-select__option:hover {
    color: #e6e7f5;
  }

  .search-select__option:active {
    color: #e6e7f5;
    background-color: #1e1e24;
  }

  .search-select__indicator-separator {
    display: none;
  }

  .search-select__value-container {
    padding: 2px 6px;
  }

  .search-select__indicator {
    padding: 2px;
  }

  .search-select__menu {
    border: 1px solid #1e1e24;
    
  }

  .search-select__menu, .search-select__option {
    font-size: 0.7vw;
    width: 100%;
    cursor: pointer;
    z-index: 1000;
    background-color: #24252b;
    margin: 0
  }

  .search-select__option--is-selected {
    background-color: #1d1d24;
  }
`

export default InputSelect