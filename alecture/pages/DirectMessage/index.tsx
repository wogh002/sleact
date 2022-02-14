import { Container, Header } from '@pages/DirectMessage/styles';
import React, { useCallback } from 'react';
import gravatar from 'gravatar';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import { IUser, IworkspaceUserData } from '@typings/db';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
interface useParam {
  workspace: string;
  id: string;
}
// 공통 layout -> Workspace
const DirectMessage = () => {
  const { workspace, id } = useParams<useParam>();
  const { data: userData } = useSWR<IworkspaceUserData>(
    `http://localhost:3095/api/workspaces/${workspace}/users/${id}`,
    fetcher,
  );
  const { data: myData } = useSWR<IUser>(`http://localhost:3095/api/users`, fetcher);

  // 채팅 받아오는 API
  const { data: chatData, revalidate } = useSWR<IUser>(
    `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher,
  );
  console.log(`chatData ↓`);
  console.log(chatData);
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      console.log('여긴 DM');
      if (chat?.trim()) {
        axios
          .post(
            `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats`,
            {
              content: chat,
            },
            { withCredentials: true },
          )
          .then(() => {
            setChat('');
            revalidate();
          })
          .catch((error) => console.log(error));
      }
    },
    [chat],
  );

  if (!userData || !myData) {
    return null;
  }
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname}></img>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} />
    </Container>
  );
};

export default DirectMessage;
