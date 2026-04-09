import { useState } from 'react';
import { IReceiver } from '@/widgets/situation-transfer/SituationTransfer';
import usePopupStore, { EPopup, Popup } from '@/app/usePopupStore';

interface UseReceiverOptions {
    receivers: IReceiver[];
    setReceivers: (updater: (prev: IReceiver[]) => IReceiver[]) => void;
    onReset?: () => void;
}

interface UseReceiverReturn {
    name: string;
    phone: string;
    setName: (value: string) => void;
    setPhone: (value: string) => void;
    handleAddReceiver: () => void;
    handleDeleteReceiver: (receiver: IReceiver) => void;
    resetInputs: () => void;
}

const useReceiver = ({ receivers, setReceivers, onReset }: UseReceiverOptions): UseReceiverReturn => {
    const { showPopup } = usePopupStore();
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');

    const resetInputs = () => {
        setName('');
        setPhone('');
        onReset?.();
    };

    const handleAddReceiver = () => {
        if (name === '') {
            showPopup({
                title: '필수 항목 누락',
                message: '이름을 입력해주세요.',
                buttonText: '확인',
                type: EPopup.info,
                callback: () => {},
            } as Popup);
            return;
        }
        if (phone === '') {
            showPopup({
                title: '필수 항목 누락',
                message: '전화번호를 입력해주세요.',
                buttonText: '확인',
                type: EPopup.info,
                callback: () => {},
            } as Popup);
            return;
        }

        if (receivers.findIndex((receiver) => receiver.cpNo === phone) > -1) {
            showPopup({
                title: '중복 등록',
                message: '이미 등록된 전화번호입니다.',
                buttonText: '확인',
                type: EPopup.info,
                callback: () => {},
            } as Popup);
            return;
        }

        if (receivers.find((receiver) => receiver.userName === name && receiver.cpNo === phone) === undefined) {
            const receiver: IReceiver = {
                userId: '',
                userName: name,
                cpNo: phone,
            };
            setReceivers((prev) => [...prev, receiver]);
            setName('');
            setPhone('');
        }
    };

    const handleDeleteReceiver = (receiver: IReceiver) => {
        if (receiver.userId === '') {
            setReceivers((prev) =>
                prev.filter((item) => item.userId !== '' || (item.userId === '' && item.cpNo !== receiver.cpNo))
            );
        } else {
            setReceivers((prev) => prev.filter((item) => item.userId !== receiver.userId));
        }
    };

    return {
        name,
        phone,
        setName,
        setPhone,
        handleAddReceiver,
        handleDeleteReceiver,
        resetInputs,
    };
};

export default useReceiver;
