/** Xeus-Gate Player SDK 타입 선언 */

export interface XeusPlayerOptions {
  /** 플레이어를 마운트할 DOM 엘리먼트의 id */
  playerId: string;
  /** WebSocket 서버 URL */
  url: string;
  /** CCTV 관리 번호 */
  cctvMgrNo?: string;
  /** 사용자 ID */
  userId?: string;
  /** 이벤트 타입 */
  evtType?: string;
  /** 재생 속도 */
  speed?: string;
  /** 해상도 크기 */
  size?: string;
  /** 코덱 ('h264' | 'mjpeg' | 'auto') */
  codec?: 'h264' | 'mjpeg' | 'auto';
  /** RTSP URL */
  rtspUrl?: string;
  /** 디버그 모드 여부 */
  debug?: boolean;
  /** 타임스탬프 (playback 모드) */
  timestamp?: string;
  /** 비트레이트 */
  bitrate?: string;
  /** 프레임레이트 */
  framerate?: string;
  /** 연결 재시도 여부 */
  reconnect?: boolean;
  /** 연결 대기 타임아웃 (초) */
  timeout?: number;
  /** 너비 */
  width?: string;
  /** 높이 */
  height?: string;
}

export interface IXeusPlayerInstance {
  start(): void;
  pause(): void;
  resume(): void;
  close(): void;
  destroy(): void;
  moveto(time: string): void;
  speed(spd: string): void;
  forward(): void;
  backward(): void;
  isPlayerVisible(): boolean;
  showText(txt: string): void;
}

export interface IXeusGate {
  Player: new (options: XeusPlayerOptions) => IXeusPlayerInstance;
  Source: unknown;
  Renderer: {
    H264: unknown;
    MJPEG: unknown;
  };
  debug: boolean;
  Now(): number;
  BrowserType(): string;
  ToHex(byteArray: Uint8Array): string;
  Log(msg: string): void;
  Queue: new () => {
    getLength(): number;
    isEmpty(): boolean;
    enqueue(item: unknown): void;
    dequeue(): unknown;
    peek(): unknown;
  };
}

declare const XeusGate: IXeusGate;

export default XeusGate;
