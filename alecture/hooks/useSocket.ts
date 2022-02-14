import io from 'socket.io-client';
import { useCallback } from 'react';

// 훅을만든이유?
// 소켓IO는 전역적인 특징을 띈다.
// 하나의컴포넌트가 연결하면 다른컴포넌트로 갔을 경우 연결을 끊는다는 뜻.

const backUrl = 'http://localhost:3095';
// ts는 빈객체,빈배열은 타입을 지정해주어야한다.
// for 대괄호 접근자
const sockets: { [key: string]: SocketIOClient.Socket } = {};

const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  // 소켓도 계층이있다.
  // 계층이란? 슬랙처럼 워크스페이스 같은게 존재.
  // namespace, room 이 있다. namespace = 워크스페이스 , room = 채널
  // 어떤 방에서의 특정 권한으로 인해, 소통이 가능하게. (범위를 잘 조정하자)

  // 한번 연결 후 다른 곳으로 연결 할 경우 기존 연결했던곳을 disconnect 해주어야한다.
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }

  if (!sockets[workspace]) {
    // 1.소켓사용법
    // const socket = io.connect('백엔드 서버 주소'/url/url/a);
    // 프론트가 서버에게 보낼 때 -> socket.emit('이벤트명',(데이터)=>{ 데이터 });
    // 프론트가 서버로부터 받을 때 -> socket.on('이벤트명',(데이터)=>{데이터});

    // what is transport? --> http 프로토콜로 보내지 않고, 웹소켓으로 요청 보내겠다.
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'],
    });
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;
