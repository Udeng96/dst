import XeusGate, { IXeusPlayerInstance, XeusPlayerOptions } from './xeusPlayer';

/**
 * XeusGate 플레이어를 생성하고 반환하는 헬퍼 함수
 *
 * @param elemId - 플레이어를 마운트할 DOM 엘리먼트 id
 * @param cctvId - CCTV 관리 번호 (방범/일반 카메라)
 * @param clftNm - 분류명. 'mobile'이면 모바일 스트림, '방범'이면 xeus-gate-1 사용
 * @param rtspUrl - RTSP URL (직접 스트림 주소 지정 시)
 */
export const playXeusPlayer = (
  elemId: string,
  cctvId: string,
  clftNm: string,
  rtspUrl: string,
): IXeusPlayerInstance => {
  const domain = window.location.host;
  let xeusUrl: string;

  if (clftNm?.includes('방범')) {
    xeusUrl = `ws://${domain}/xeus-gate-1/stream`;
  } else {
    xeusUrl = `ws://${domain}/xeus-gate-2/stream`;
  }

  const options: XeusPlayerOptions = {
    playerId: elemId,
    url: xeusUrl,
    cctvMgrNo: clftNm && clftNm === 'mobile' ? '' : cctvId,
    userId: 'tester1',
    evtType: '112',
    speed: '',
    size: '',
    codec: 'h264',
    rtspUrl: rtspUrl,
    debug: false,
  };

  return new XeusGate.Player(options);
};
