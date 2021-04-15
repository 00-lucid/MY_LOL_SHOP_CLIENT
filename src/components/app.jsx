import {
  App, f7,
  f7ready,
  Link,
  List,
  ListItem, Navbar, Page, PageContent, Panel,
  Toolbar, View, Views,
  Icon
} from 'framework7-react';
// 프레임워크7이 web-app을 mobile-app으로 변환 가능한 이유는 내장된 component들을 사용하기 때문이다.

import 'lodash';
import React from 'react';
import { logout } from '../common/api';
import { destroyToken, getToken } from '../common/auth';
import store from '../common/store';
import { getDevice } from '../js/framework7-custom.js';
import routes from '../js/routes';
import i18n from "../lang/i18n";

// recoil
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { allTagState, contactsState, dibsState, itemState, orderListState, relationItemState, statisticState, userInfoState } from '../recoil/state';
import axios from 'axios';


global.i18next = i18n;

const MyApp = () => {
  // Login screen demo data
  let loggedIn = !!getToken().token;
  const handleLogout = async ()=>{
    await logout()
    location.replace('/')
  }


  const contacts = useRecoilValue(contactsState);
  const handleContacts = useSetRecoilState(contactsState);
  const handleOrderList = useSetRecoilState(orderListState);
  const handleDibList = useSetRecoilState(dibsState);
  const handleUserInfo = useSetRecoilState(userInfoState);
  const [statistic, handleStatistic] = useRecoilState(statisticState);
  const handleAllTag = useSetRecoilState(allTagState);

  const requestContacts = async () => {
    // access token을 함께 보내야 됨
    const authHeader = await getToken().token
    axios.get('https://localhost:3000/contacts', {
      headers: {
        authorization: `Bearer ${authHeader}`
      }
    })
    .then(res => {
      console.log(res);
      handleContacts(() => [...res.data]);
    })
  }

  const requestDibList = async () => {
    const authHeader = await getToken().token
    axios.get('https://localhost:3000/dibs', {
      headers: {
        authorization: `Bearer ${authHeader}`
      }
    })
    .then(res => {
      console.log(res)
      handleDibList(() => [
        ...res.data
      ])
    })
  }

  const requestLineItem = async () => {
    axios.get('https://localhost:3000/get-line-item', {
      headers: {
        authorization: `Bearer ${getToken().token}`
      }
    })
    .then(res => {
      console.log(res.data);
      handleOrderList(res.data);
    })
  }

  const requestUserInfo = async () => {
    const authHeader = await getToken().token
    axios.get('https://localhost:3000/user-info', {
      headers: {
        authorization: `Bearer ${authHeader}`
      }
    })
    .then((res) => {
      console.log(res.data)
      handleUserInfo(() => res.data)
    })
  }

  const requestStatistics = async () => {
    const authHeader = await getToken().token
    axios.get('https://localhost:3000/statistics', {
      headers: {
        authorization: `Bearer ${authHeader}`
      }
    })
    .then(res => {
      console.log(res.data);
      handleStatistic(res.data);
    })
  }

  const requestAllTag = () => {
    axios.get('https://localhost:3000/get-all-tag')
    .then(res => {
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
      console.log(res.data)
      handleAllTag(res.data);
    })
  }

  const device = getDevice();
  // const items = useRecoilValue(itemState);
  // Framework7 Parameters
  const f7params = {
    name: 'Practice', // App name
    theme: 'ios', // Automatic theme detection
    id: 'com.insomenia.practice', // App bundle ID
    // App store
    store: store,
    // App routes
    routes: routes,
    // Input settings
    view: {
      iosDynamicNavbar: getDevice().ios,
    }
  };
  return (
    <App { ...f7params } >
      {/* Left panel with cover effect*/}
      <Panel left cover>
          <Page>
            <Navbar title="메뉴"/>
            <PageContent>
              <List>
                {
                  loggedIn &&
                  <ListItem title="Admin" link="/admin/" icon="" panelClose onClick={requestStatistics}></ListItem>
                }
              </List>
            </PageContent>
          </Page>
      </Panel>
      <Views tabs className="safe-areas">
        {/* Tabbar for switching views-tabs */}
        <Toolbar tabbar labels bottom>
          <Link tabLink="#view-home" tabLinkActive icon="las la-home" text="홈" />
          {
            loggedIn &&
            <Link tabLink="#view-contacts" icon="las la-edit" text="주문내역" onClick={requestContacts}/>
          }
          <Link tabLink="#view-carts" icon="las la-shopping-cart" text="장바구니" onClick={requestLineItem}/>
          {
            loggedIn &&
            <Link tabLink="#view-my" icon="" text="내정보" onClick={() => {requestDibList(); requestUserInfo();}}/>
            // <Icon ios="f7:multiply" aurora="f7:multiply" md="material:close"></Icon>
          }
          {
            loggedIn &&
            <Link tabLink="#view-admin" text="관리" onClick={() => {requestStatistics(); requestAllTag()}}/>
          }
        </Toolbar>
        <View id="view-home" main tab tabActive url="/" iosDynamicNavbar={false} />
        <View id="view-contacts" name="contacts" tab url="/contacts" />
        <View id="view-carts" name="basket" tab url="/basket" />
        <View id="view-signin" name="signin" tab url="/users/sign_in" />
        <View id="view-signup" name="signup" tab url="/users/sign_up" />
        <View id="view-my" name="my" tab url="/my" />
        <View id="view-item-info" name="item-info" tab url="/item-info"/>
        <View id="view-write" name="write" tab url="/write"/>
        <View id="view-admin" name="admin" tab url="/admin"/>
      </Views>
    </App>
  );
}
export default MyApp;