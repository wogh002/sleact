// import useSocket from '@hooks/useSocket';
import { CollapseButton } from '@components/DMList/styles';
import useSocket from '@hooks/useSocket';
import { IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useEffect, useState, VFC } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';

const DMList: VFC = () => {
  // ? === ts 옵셔널체이닝
  const { workspace } = useParams<{ workspace?: string }>();
  console.log('workspace ↓');
  console.log(workspace);

  const { data: userData, error, revalidate, mutate } = useSWR<IUser>('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  // memberData -> 현재 workspace에 참여한 멤버들 불러오기
  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  // useEffect(() => {
  //   console.log('DMList: workspace 바꼈다', workspace);
  //   setOnlineList([]);
  // }, [workspace]);

  // useEffect(() => {
  //   socket?.on('onlineList', (data: number[]) => {
  //     setOnlineList(data);
  //   });
  //   // socket?.on('dm', onMessage);
  //   // console.log('socket on dm', socket?.hasListeners('dm'), socket);
  //   return () => {
  //     // socket?.off('dm', onMessage);
  //     // console.log('socket off dm', socket?.hasListeners('dm'));
  //     socket?.off('onlineList');
  //   };
  // }, [socket]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return (
              <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
                <i
                  className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                    isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                  }`}
                  aria-hidden="true"
                  data-qa="presence_indicator"
                  data-qa-presence-self="false"
                  data-qa-presence-active="false"
                  data-qa-presence-dnd="false"
                />
                <span>{member.nickname}</span>
                {member.id === userData?.id && <span> (나)</span>}
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default DMList;
