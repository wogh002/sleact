import React, { FC, useCallback } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { Redirect } from 'react-router';
import {
  Header,
  RightMenu,
  ProfileImg,
  WorkspaceWrapper,
  Workspaces,
  Channels,
  Chats,
  WorkspaceName,
  MenuScroll,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';

// Channel -> children 사용시 FC
const Workspace: FC = ({ children }) => {
  const { data, error, revalidate, mutate } = useSWR('http://localhost:3095/api/users/', fetcher);
  console.log(`WORKSPACE DATA => ${data}`);
  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false);
      });
  }, []);
  if (!data) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.email, { s: '100px', d: 'identicon' })} alt="profile-img" />
          </span>
        </RightMenu>
      </Header>
      <div>
        {data && <button onClick={onLogout}>로그아웃</button>}
        <WorkspaceWrapper>
          <Workspaces>test</Workspaces>
          <Channels>
            <WorkspaceName>Sleact</WorkspaceName>
            <MenuScroll>{/* <Menu>menu</Menu> */}</MenuScroll>
          </Channels>
          <Chats>Chats</Chats>
        </WorkspaceWrapper>
        {children}
      </div>
    </div>
  );
};

export default Workspace;
