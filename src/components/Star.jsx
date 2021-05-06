import {
  App,
  f7,
  f7ready,
  Link,
  List,
  ListItem,
  Navbar,
  Page,
  PageContent,
  Panel,
  Toolbar,
  View,
  Views,
  Icon,
  Button,
  ListInput,
} from "framework7-react";
// 프레임워크7이 web-app을 mobile-app으로 변환 가능한 이유는 내장된 component들을 사용하기 때문이다.

import "lodash";
import React, { useEffect, useState } from "react";
import { logout } from "../common/api";
import { destroyToken, getToken } from "../common/auth";
import store from "../common/store";
import { getDevice } from "../js/framework7-custom.js";
import routes from "../js/routes";
import i18n from "../lang/i18n";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import {
  allTagState,
  categoryState,
  contactsState,
  dibsState,
  itemState,
  orderListState,
  relationItemState,
  statisticState,
  userInfoState,
} from "../recoil/state";
import axios from "axios";

const Star = () => {
  const [star, handleStar] = useState(0);
  return (
    <section className="flex flex-row justify-center">
      {star ? (
        <Icon aurora="f7:star_fill" ios="f7:star" />
      ) : (
        <Icon aurora="f7:star" ios="f7:star" />
      )}
      {star ? (
        <Icon aurora="f7:star_fill" ios="f7:star" />
      ) : (
        <Icon aurora="f7:star" ios="f7:star" />
      )}
      {star ? (
        <Icon aurora="f7:star_fill" ios="f7:star" />
      ) : (
        <Icon aurora="f7:star" ios="f7:star" />
      )}
      {star ? (
        <Icon aurora="f7:star_fill" ios="f7:star" />
      ) : (
        <Icon aurora="f7:star" ios="f7:star" />
      )}
      {star ? (
        <Icon aurora="f7:star_fill" ios="f7:star" />
      ) : (
        <Icon aurora="f7:star" ios="f7:star" />
      )}
    </section>
  );
};

export default Star;
