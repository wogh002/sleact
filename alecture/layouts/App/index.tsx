import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';
// 코드스플리팅?처음에 필요없는 컴포넌트는 추후에 불러오는 방식을 의미.
// pages 서비스들은 항상 코드스플리팅. 코드스플리팅은 어디서든 불러 올 수 있음.
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));
const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/:workspace" component={Workspace} />
      {/* /: 와일드 카드 역할 -> 정확히는 라우트 파라미터*/}
      {/* /workspace/test (O) */}
      {/* /workspace/abc (O) */}
    </Switch>
  );
};
export default App;
