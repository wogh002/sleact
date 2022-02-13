import React, { useCallback, useState, VFC } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { Redirect } from 'react-router';
import loadable from '@loadable/component';
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
  ProfileModal,
  LogOutButton,
  WorkspaceButton,
  AddButton,
  WorkspaceModal,
} from '@layouts/Workspace/styles';
import { Button, Label, Input } from '@pages/SignUp/styles';
import DMList from '@components/DMList';
import { IUser, IChannel } from '@typings/db';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import { Switch, Route, Link } from 'react-router-dom';
import Menu from '@components/Menu';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateChannelModal from '@components/CreateChannelModal';
import ChannelList from '@components/ChannelList';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

interface useParam {
  workspace: string;
  channel: string;
}

// Channel -> children ? FC : VFC
const Workspace: VFC = () => {
  // 구조분해할당에서 : 는 별칭부여
  // 제네릭 -> 객체 내부에서 사용할 데이터를 외부에서 지정하는 기법.
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const { workspace, channel } = useParams<useParam>();

  const { data: userData, revalidate, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users/', fetcher);

  // swr은 조건부 요청을 지원한다 null 일 경우 요청(X)
  const { data: channelData } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  // workspace에 있는 멤버들 데이터 get
  const { data: memberData } = useSWR<IUser[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const onLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false);
      });
  }, []);
  const onClickUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      axios
        .post(
          'http://localhost:3095/api/workspaces',
          { workspace: newWorkspace, url: newUrl },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          revalidate();
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((error) => {
          console.log(error);
          toast.configure();
          // npm i react-toastify;
          toast.error(error.response?.data, { position: 'top-center', autoClose: 1500 });
        });
    },
    [newWorkspace, newUrl],
  );

  // 화면에 있는 모든 모달들을 hide
  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
    setShowInviteChannelModal(false);
  }, []);
  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal((prev) => !prev);
  }, []);
  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);

  if (!userData) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '100px', d: 'identicon' })} alt="profile-img" />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.email} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                프로필 메뉴
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <div>
        {/* <button onClick={onLogout}>로그아웃</button> */}
        <WorkspaceWrapper>
          <Workspaces>
            {/* ?.은 ?.'앞’의 평가 대상이 undefined나 null이면 평가를 멈추고 undefined를 반환합니다. */}
            {userData?.Workspaces?.map((ws) => {
              return (
                <Link key={ws.id} to={`/workspace/channel/일반`}>
                  <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                </Link>
              );
            })}
            <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
          </Workspaces>
          <Channels>
            <WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
            <MenuScroll>
              <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
                <WorkspaceModal>
                  <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                  <button onClick={onClickAddChannel}>채널 만들기</button>
                  <button onClick={onLogout}>로그아웃</button>
                </WorkspaceModal>
              </Menu>
              {/* {channelData?.map((v) => (
                <div>{v.name}</div>
              ))} */}
              <ChannelList />
              <DMList />
            </MenuScroll>
          </Channels>
          <Chats>
            <Switch>
              {/* /workspace/sleact/channel/일반 */}
              <Route path="/workspace/:workspace/channel/:channel" component={Channel} />
              <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
            </Switch>
          </Chats>
        </WorkspaceWrapper>

        <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
          <form onSubmit={onCreateWorkspace}>
            <Label id="workspace-label">
              <span>워크스페이스 이름</span>
              <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
            </Label>

            <Label id="workspace-url-label">
              <span>워크스페이스 URL</span>
              <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
            </Label>
            <Button type="submit">생성하기</Button>
          </form>
        </Modal>
        <CreateChannelModal
          show={showCreateChannelModal}
          onCloseModal={onCloseModal}
          setShowCreateChannelModal={setShowCreateChannelModal}
        />
        <InviteWorkspaceModal
          show={showInviteWorkspaceModal}
          onCloseModal={onCloseModal}
          setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
        />

        <InviteChannelModal
          show={showInviteChannelModal}
          onCloseModal={onCloseModal}
          setShowInviteChannelModal={setShowInviteChannelModal}
        />
      </div>
    </div>
  );
};

export default Workspace;
