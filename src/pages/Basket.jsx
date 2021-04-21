import {
  Block,
  BlockTitle,
  Button,
  Col,
  Link,
  List,
  ListItem,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Page,
  Row,
  Searchbar,
  Card,
  Icon,
  f7,
} from "framework7-react";
import React, { useEffect } from "react";
import "../css/custom.css";
import "../css/app.less";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  basketState,
  alarmsState,
  bellBedgeState,
  bellState,
  isActionState,
  orderListState,
} from "../recoil/state";
import axios from "axios";
import { getToken } from "../common/auth";
import helper from "./modules/helper";
import BasketItem from "../components/BasketItem";
import { toast, sleep } from "../js/utils.js";

// custom component

const BasketPage = () => {
  // items는 장바구니에 담긴 아이탬들
  let total = 0;
  const orderList = useRecoilValue(orderListState);

  const handleBells = useSetRecoilState(bellState);
  const handleOrderList = useSetRecoilState(orderListState);
  const handleBellBadges = useSetRecoilState(bellBedgeState);

  const [items, handleItems] = useRecoilState(basketState);
  const [alarms, handleAlarms] = useRecoilState(alarmsState);
  const [isAction, handleIsAction] = useRecoilState(isActionState);

  const buyBasket = async () => {
    if (!getToken().token) {
      helper.showToastCenter("로그인이 필요합니다");

      return;
    }

    if (total === 0) {
      helper.showToastCenter("장바구니가 비어있습니다");
      return;
    }

    const { data } = await axios.post(
      `${process.env.API_URL}/order`,
      {
        total: total,
      },
      {
        headers: {
          authorization: `Bearer ${getToken().token}`,
        },
      }
    );

    if (data) {
      helper.showToastCenter(data);
      return;
    }

    // await f7.dialog.preloader("구매를 진행중입니다...", 3000);

    handleItems([]);

    helper.saveLineItem([]);

    handleAlarms((old) => [...old, { text: "구매 성공!" }]);

    setTimeout(() => handleAlarms((old) => [...old].slice(1)), 1000);

    if (getToken().token) {
      await axios.post(
        `${process.env.API_URL}/add-bell`,
        {
          text: "구매해주셔서 감사합니다",
        },
        {
          headers: {
            authorization: `Bearer ${getToken().token}`,
          },
        }
      );

      handleBellBadges((old) => [...old, { id: old.length + 1 }]);

      handleBells((old) => [
        ...old,
        { title: data.text, createdAt: data.createdAt },
      ]);

      handleIsAction((old) => !old);

      helper.postBell(
        getToken().token,
        "구매해주셔서 감사합니다",
        handleBellBadges,
        handleBells,
        handleIsAction
      );
    }
  };

  // const requestLineItem = async () => {
  //   // userId가 일치하고, orderId가 null인 라인 아이탬을 가져옵니다.
  //   // 왜냐하면 회원인 유저의 장바구니 아이탬은 db에 저장되기 때문입니다
  //   const { data } = await axios.get(`${process.env.API_URL}/get-line-item`, {
  //     headers: {
  //       authorization: `Bearer ${getToken().token}`,
  //     },
  //   });
  //   console.log(data);
  // };

  // useEffect(() => {
  //   // 안됨 왜??
  //   console.log("change");
  //   helper.saveLineItem(items);
  // }, [items]);

  return (
    <Page name="basket p-0">
      <Navbar sliding={false}>
        <NavTitle title="장바구니"></NavTitle>
      </Navbar>
      {alarms.map((alarm, idx) => (
        <div key={idx} className="alarm-buy">
          {alarm.text}
        </div>
      ))}
      <List className="p-0">
        <ul>
          {items &&
            items.length > 0 &&
            items.map((item, idx) => {
              console.log(item);
              const subTotal =
                (Number(item.price) +
                  (item.optionBox === "default"
                    ? 0
                    : Number(item.optionBox.split(" ")[1]))) *
                Number(item.countBox);
              total +=
                (Number(item.price) +
                  (item.optionBox === "default"
                    ? 0
                    : Number(item.optionBox.split(" ")[1]))) *
                Number(item.countBox);

              return <BasketItem item={item} subTotal={subTotal} />;
            })}
        </ul>
      </List>
      <div className="flex text-xl font-black items-center justify-center rounded-md overflow-hidden">
        {getToken().token ? (
          <button
            className="fixed h-16 z-50 text-lg font-semibold flex flex-row items-center justify-center"
            onClick={buyBasket}
            style={{
              bottom: "60px",
              width: "335px",
              borderWidth: "1px",
              borderColor: "#C79A3A",
              color: "#060a0f",
              backgroundColor: "#C79A3A",
            }}
          >
            {`${total} RP`}
          </button>
        ) : (
          <Link
            href="/users/sign_in"
            className="fixed h-16 z-50 text-lg font-semibold flex flex-row items-center justify-center"
            style={{
              bottom: "60px",
              width: "335px",
              borderWidth: "1px",
              borderColor: "#C79A3A",
              color: "#060a0f",
              backgroundColor: "#C79A3A",
            }}
            onClick={buyBasket}
          >
            {`${total} RP`}
          </Link>
        )}
      </div>
    </Page>
  );
};
export default BasketPage;
