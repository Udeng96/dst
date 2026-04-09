import styled from 'styled-components';
import { StyledButton } from '@/shared/ui/Button/Button';
import DELETE_BTN from '@/shared/ui/ReceiverList/btn_gis_searchBar_delete_normal.png';
import DELETE_BTN_HOVER from '@/shared/ui/ReceiverList/btn_gis_searchBar_delete_hover.png';

export const StyledField = styled.fieldset`
    width: 100%;
    height: auto;
    margin: 3px 0;
    gap: 2px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

export const StyledInputText = styled.input.attrs(() => ({
    type: 'text',
}))<{
    readOnly: boolean;
    width: string;
    height: string;
}>`
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    max-height: 38px;

    padding: 0 1vw;
    border-radius: 0.4vw;

    border: solid 0.05vw ${({ readOnly }) => (readOnly ? '#1e1e24' : '#3f4147')};
    background-color: ${({ readOnly }) => (readOnly ? '#24252b' : '#1d1d24')};
    letter-spacing: -0.01vw;
    color: #e6e7f5;
`;

export const StyledInputTextarea = styled.textarea<{
    readOnly: boolean;
    width: string;
    height: string;
}>`
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    margin: auto 0;

    padding: 1.5vh 1vw;
    border-radius: 0.4vw;
    border: solid 0.05vw ${({ readOnly }) => (readOnly ? '#1e1e24' : '#3f4147')};
    background-color: ${({ readOnly }) => (readOnly ? '#24252b' : '#1d1d24')};
    letter-spacing: -0.01vw;
    color: #e6e7f5;
`;

export const StyledReceiverListContainer = styled.ul`
    max-width: 590px;
    height: 80px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    border: solid 0.05vw #1e1e24;
    background-color: #26262e;
    border-radius: 0.4vw;
    overflow-y: scroll;
    padding: 2%;
`;

export const StyledReceiverListItem = styled.li`
    width: auto;
    height: 30px;
    margin-right: 3px;
    cursor: pointer;
    font-size: 0.7vw;

    button {
        width: 18px;
        height: 18px;
        background: url('${DELETE_BTN}') center;
        background-size: contain;
        margin-left: 3px;

        &:hover {
            cursor: pointer;
            background: url('${DELETE_BTN_HOVER}');
            background-size: contain;
        }
    }
`;

export const StyledReceiverUserContainer = styled.div`
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & button,
    & input {
        margin: 0 5px;
    }
`;

export const StyledAddButton = styled(StyledButton)`
    height: 3vh;
    width: 20%;
    border-radius: 0.41vw;
    background-color: #7a45ff;
    font-size: 0.83vw;
    letter-spacing: -0.02vw;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const StyledReceiverTreeArea = styled.aside`
    width: 35%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;
