import { Container, Header } from '@pages/DirectMessage/styles';
import React from 'react';
import gravatar from 'gravatar';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import { IUser, IworkspaceUserData } from '@typings/db';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';

interface useParam {
  workspace: string;
  id: string;
}
// 공통 layout -> Workspace
const DirectMessage = () => {
  const { workspace, id } = useParams<useParam>();
  console.log(id);
  const { data: userData } = useSWR<IworkspaceUserData>(
    `http://localhost:3095/api/workspaces/${workspace}/users/${id}`,
    fetcher,
  );
  const { data: myData } = useSWR<IUser>(`http://localhost:3095/api/users`, fetcher);
  if (!userData || !myData) {
    return null;
  }
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname}></img>
      </Header>
      <ChatList />
      {/*{ chat, onSubmitForm, onChangeChat, placeholder }  */}
      <ChatBox chat="" />
    </Container>
  );
};

export default DirectMessage;
