import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { playXeusPlayer } from '@/shared/lib/xeusPlayerHelper';
import { IXeusPlayerInstance } from '@/shared/lib/xeusPlayer';

export interface XeusPlayerProps {
  /** 재생할 CCTV 관리 번호 (방범/일반 카메라) */
  cctvId: string;
  /** 분류명. 'mobile'이면 모바일 스트림, '방범' 포함 시 xeus-gate-1 사용 */
  clftNm: string;
  /** RTSP URL (직접 스트림 지정 시, 없으면 빈 문자열) */
  rtspUrl?: string;
  /** 더블클릭 시 전체화면 여부 (기본값: true) */
  enableFullscreen?: boolean;
  className?: string;
}

export interface XeusPlayerHandle {
  /** 플레이어 인스턴스를 직접 접근할 때 사용 */
  getInstance: () => IXeusPlayerInstance | null;
  /** 플레이어 DOM 엘리먼트 */
  getContainer: () => HTMLDivElement | null;
}

let playerIdCounter = 0;

/**
 * XeusGate 외부 SDK를 React ref로 제어하는 래퍼 컴포넌트
 *
 * - ref를 통해 플레이어 인스턴스에 접근 가능
 * - 마운트 시 플레이어 시작, 언마운트 시 자동 destroy
 */
const XeusPlayer = forwardRef<XeusPlayerHandle, XeusPlayerProps>(
  (
    { cctvId, clftNm, rtspUrl = '', enableFullscreen = true, className },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<IXeusPlayerInstance | null>(null);
    const playerIdRef = useRef<string>('');

    useImperativeHandle(ref, () => ({
      getInstance: () => playerRef.current,
      getContainer: () => containerRef.current,
    }));

    useEffect(() => {
      playerIdCounter += 1;
      const id = `xeus_player_${playerIdCounter}`;
      playerIdRef.current = id;

      if (containerRef.current) {
        containerRef.current.id = id;
      }

      playerRef.current = playXeusPlayer(id, cctvId, clftNm, rtspUrl);

      return () => {
        playerRef.current?.destroy();
        playerRef.current = null;
      };
    }, [cctvId, clftNm, rtspUrl]);

    const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!enableFullscreen) return;
      const target = event.currentTarget as HTMLDivElement & {
        mozRequestFullScreen?: () => void;
        webkitRequestFullscreen?: () => void;
        msRequestFullscreen?: () => void;
      };
      if (target.requestFullscreen) {
        target.requestFullscreen();
      } else if (target.mozRequestFullScreen) {
        target.mozRequestFullScreen();
      } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen();
      } else if (target.msRequestFullscreen) {
        target.msRequestFullscreen();
      }
    };

    return (
      <StyledXeusPlayer
        ref={containerRef}
        className={className}
        onDoubleClick={handleDoubleClick}
      />
    );
  },
);

XeusPlayer.displayName = 'XeusPlayer';

const StyledXeusPlayer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgb(34, 34, 34);
  overflow: hidden;
`;

export default XeusPlayer;
