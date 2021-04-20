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
  Card,
  Badge,
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

// import { io } from 'socket.io-client';

// const socket = io('https://localhost:3000')

// recoil
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
  basketState,
  bellState,
  contactsState,
  curItemInfoState,
  dibsState,
  itemState,
  orderListState,
  recentItemState,
  relationItemState,
  reviewState,
  statisticState,
  tagState,
  userInfoState,
} from "../recoil/state";
import axios from "axios";

const MyCard = ({ idx, img, name, itemId, item }) => {
  const [isClick, handleClick] = useState(false);

  const handleBells = useSetRecoilState(bellState);
  const handleItems = useSetRecoilState(basketState);
  const handleReview = useSetRecoilState(reviewState);
  const handleItemList = useSetRecoilState(itemState);
  const handleAllTag = useSetRecoilState(allTagState);
  const handleCurItemInfo = useSetRecoilState(curItemInfoState);

  const [tags, handleTag] = useRecoilState(tagState);
  const [recentItem, handleRecentItem] = useRecoilState(recentItemState);
  const [relationItems, handleRelationItemState] = useRecoilState(
    relationItemState
  );

  const requestCurItemInfo = async (itemId) => {
    // 카드의 id를 이용해서 알맞는 아이탬 내용을 가져와 state에 저장해야 합니다.
    // 해당 state는 ItemInfo page 랜더에 활용됩니다.
    if (getToken().token) {
      const { data } = await axios.post(
        `${process.env.API_URL}/get-item-info`,
        { id: itemId },
        { headers: { authorization: `Bearer ${getToken().token}` } }
      );

      handleReview(data.reviews);

      handleRelationItemState(data.relationItems);

      handleCurItemInfo(data);
    } else {
      const { data } = await axios.post(
        `${process.env.API_URL}/get-item-info`,
        {
          id: itemId,
        }
      );

      handleReview(data.reviews);

      handleCurItemInfo(data);

      handleRelationItemState(data.relationItems);
    }
  };

  return (
    <section key={idx} className="flex flex-col">
      <section className="flex flex-col items-center justify-center">
        <Card
          id="home-card"
          className="items-stretch flex-initial flex-none w-44 h-44 border m-1"
          style={{
            backgroundImage: "url(" + img + ")",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            color: "#F3EAD7",
            borderColor: "#C79A3A",
          }}
          key={idx}
        >
          <a
            className="w-full h-full flex flex-col items-center justify-center"
            href={`/item-info/${itemId}`}
            onClick={() => {
              requestCurItemInfo(itemId);
              handleRecentItem((old) => {
                const result = old.filter((el) => el.name !== item.name);
                return [item, ...result];
              });
            }}
          ></a>
        </Card>
      </section>
      <p className="text-lg m-0.5" style={{ color: "#F3EAD7" }}>
        {name}
      </p>
      {item.status === "on" ? (
        <section className="flex flex-row m-0.5">
          <img
            src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png"
            className="w-5 h-5 m-0.5"
          ></img>
          <p className="text-yellow-500  font-black">{item.price}</p>
        </section>
      ) : (
        <section className="flex flex-row m-0.5">
          <img
            src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png"
            className="w-5 h-5 m-0.5"
          ></img>
          <p
            className="text-yellow-500  font-black mr-2 opacity-30"
            style={{ color: "#bbbbbb" }}
          >
            <del>{item.price}</del>
          </p>
          <p className="text-yellow-500  font-black">{item.price - 10}</p>
        </section>
      )}

      <section className="flex flex-row">
        {tags
          .filter((tag) => tag.itemId === item.id)
          .map((tag) => {
            return (
              <Badge key={tag.id} className="mr-1">
                {tag.tag}
              </Badge>
            );
          })
          .slice(0, 3)}
      </section>
    </section>
  );
};

export default MyCard;
