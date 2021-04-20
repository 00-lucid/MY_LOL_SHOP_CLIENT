import "../css/app.less";
import "../css/custom.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getToken } from "../common/auth";
import helper from "./modules/helper";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  basketState,
  curItemInfoState,
  alarmsState,
  reviewState,
  relationItemState,
  tagState,
  recentItemState,
} from "../recoil/state";
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
  Badge,
} from "framework7-react";
import MyCard from "../components/MyCard";
import Review from "../components/Review";
import ReviewTitle from "../components/ReviewTitle";
import PriceBox from "../components/PriceBox";
import { toast, sleep } from "../js/utils.js";

// custom component

const ItemInfo = ({ id }) => {
  const tags = useRecoilValue(tagState);
  const reviews = useRecoilValue(reviewState);
  const recentItems = useRecoilValue(recentItemState);
  const curItemInfo = useRecoilValue(curItemInfoState);

  const handleReview = useSetRecoilState(reviewState);
  const handleCurItemInfo = useSetRecoilState(curItemInfoState);

  const [onDib, handleOnDib] = useState(false);
  // const [isScroll, handleIsScroll] = useState(true);
  const [items, handleItems] = useRecoilState(basketState);
  const [alarms, handleAlarms] = useRecoilState(alarmsState);
  const [recentItem, handleRecentItem] = useRecoilState(recentItemState);
  const [relationItems, handleRelationItemState] = useRecoilState(
    relationItemState
  );

  const getSelectValue = () => {
    // addItem에서 사용한다. select el value를 가져온다.
    const optionBox = document.querySelector("#option-box");
    const countBox = document.querySelector("#count-box");
    return [optionBox.value, countBox.value];
  };

  const requestCurItemInfo = async (itemId) => {
    // 카드의 id를 이용해서 알맞는 아이탬 내용을 가져와 state에 저장해야 합니다.
    // 해당 state는 ItemInfo page 랜더에 활용됩니다.
    const { data } = await axios.post(`${process.env.API_URL}/get-item-info`, {
      id: itemId,
    });

    handleReview(data.reviews);

    handleCurItemInfo(data);

    handleRelationItemState(data.relationItems);
  };

  const addItem = async (item) => {
    // option과 count 정보를 가져와서 같이 basketState에 넣어줘야 함
    // 그리고 Basket.jsx에서 해당 정보들을 랜더링 해줘야 됨
    // 만약 이미 장바구니에 아이탬이 있을 경우 있다고 알려줘야 함

    // Line
    if (items.filter((el) => el.name === item.name).length >= 1) {
      // alert("이미 장바구니에 있습니다");
      helper.showToastCenter("이미 장바구니에 있습니다");
      return;
    }

    const arrVal = await getSelectValue();

    if (!getToken().token) {
      handleItems((oldItems) => [
        ...oldItems,
        { ...item, optionBox: arrVal[0], countBox: arrVal[1] },
      ]);

      helper.helpAddAlarm("장바구니에 추가 되었습니다!", handleAlarms);
    } else {
      const subTotal =
        (Number(item.price) +
          (arrVal[0] === "default"
            ? 0
            : Number(getSelectValue()[0].split(" ")[1]))) *
        Number(arrVal[1]);

      await axios.post(`${process.env.API_URL}/add-line-item`, {
        name: item.name,
        img: item.img,
        lineTotal: subTotal,
        buyOption: arrVal[0],
        buyCount: arrVal[1],
        itemId: item.id,
      });

      handleItems((old) => [
        ...old,
        { ...item, optionBox: arrVal[0], countBox: arrVal[1] },
      ]);

      helper.helpAddAlarm("장바구니에 추가 되었습니다!", handleAlarms);
    }
  };
  const addDib = () => {
    if (getToken().token) {
      axios.post(
        `${process.env.API_URL}/add-dib`,
        { id: curItemInfo.id },
        { headers: { authorization: `Bearer ${getToken().token}` } }
      );
    }
  };

  const buyItem = async (item) => {
    const arrVal = await getSelectValue();
    const subTotal =
      (await (Number(item.price) +
        (arrVal[0] === "default"
          ? 0
          : Number(getSelectValue()[0].split(" ")[1])))) * Number(arrVal[1]);

    if (getToken().token) {
      await axios.post(
        `${process.env.API_URL}/order-now`,
        {
          name: item.name,
          img: item.img,
          lineTotal: subTotal,
          buyOption: arrVal[0],
          buyCount: arrVal[1],
          itemId: item.id,
          total: subTotal,
        },
        {
          headers: { authorization: `Bearer ${getToken().token}` },
        }
      );

      helper.helpAddAlarm("구매 성공!", handleAlarms);
    }
  };

  return (
    <Page name="basket" className="w-full" noToolbar hideNavbarOnScroll>
      <Navbar sliding={false}>
        <NavLeft>
          <Navbar backLink="Back" />
        </NavLeft>
        <NavTitle title="상세보기"></NavTitle>
      </Navbar>
      {alarms.map((alarm, idx) => (
        <div key={idx} className="alarm">
          {alarm.text}
        </div>
      ))}
      <div className="w-full">
        <Block className="item-info-main flex flex-col items-center justify-around w-full">
          <Block
            className="item-info-img"
            style={{
              backgroundImage: "url(" + curItemInfo.img + ")",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></Block>

          <Block className="item-info-option w-full p-5">
            <section className="flex flex-row items-center w-full">
              <div
                className="info-title"
                style={{
                  color: "#F3EAD7",
                  fontSize: "1.2rem",
                }}
              >
                {curItemInfo.name}
              </div>
              <Button
                className="absolute right-3"
                outlin
                onClick={() => {
                  addDib();
                  handleOnDib((old) => {
                    old
                      ? helper.showToastIcon("찜 목록에 제거되었습니다", false)
                      : helper.showToastIcon("찜 목록에 추가되었습니다", true);
                    return !old;
                  });
                }}
              >
                {curItemInfo.dib || onDib ? (
                  <Icon ios="f7:heart_fill" aurora="f7:heart"></Icon>
                ) : (
                  <Icon ios="f7:heart" aurora="f7:heart"></Icon>
                )}
              </Button>
            </section>

            <PriceBox curItemInfo={curItemInfo} />

            <div className="info-option">
              <select id="option-box" name="option-box">
                <option value="default">default</option>
                {curItemInfo.arrOption.map((option) => {
                  return (
                    <option
                      key={option.id}
                      value={`${option.option} +${option.optionPrice} 원`}
                    >{`${option.option} +${option.optionPrice} 원`}</option>
                  );
                })}
                {/* <option value="red">red</option> */}
              </select>
            </div>

            <div className="info-count">
              <select id="count-box" name="count-box">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                  return (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  );
                })}
                {/* <option value="1">1</option> */}
              </select>
            </div>

            <section className="bg-section fixed h-16 z-50 ">
              <button
                className="fixed h-16 z-50 text-lg font-semibold"
                onClick={() => {
                  addItem(curItemInfo);
                }}
                style={{
                  bottom: "84px",
                  left: "16.5px",
                  width: "335px",
                  borderWidth: "1px",
                  borderColor: "#C79A3A",
                  color: "#F3EAD7",
                  backgroundColor: "#060a0f",
                }}
              >
                장바구니
              </button>

              <button
                className="fixed h-16 z-50 text-lg font-semibold"
                onClick={() => buyItem(curItemInfo)}
                style={{
                  bottom: "20px",
                  width: "335px",
                  left: "16.5px",
                  borderWidth: "1px",
                  borderColor: "#C79A3A",
                  color: "#060a0f",
                  backgroundColor: "#C79A3A",
                }}
              >
                바로구매
              </button>
            </section>
          </Block>
        </Block>

        <Block className="p-8">
          <p className="text-xl" style={{ color: "#F3EAD7" }}>
            관련 상품
          </p>

          <List className="overflow-scroll flex flex-row">
            {relationItems.length > 0
              ? relationItems.map((item) => (
                  <MyCard
                    idx={item.id}
                    img={item.img}
                    name={item.name}
                    itemId={item.id}
                    item={item}
                  />
                ))
              : "loading..."}
          </List>
        </Block>

        <Block className="p-8">
          <p className="text-xl" style={{ color: "#F3EAD7" }}>
            최근 본 아이탬
          </p>

          <List
            className="overflow-scroll flex flex-row"
            style={{
              color: "#F3EAD7",
            }}
          >
            {recentItems.length > 0
              ? recentItems.map((item) => (
                  <MyCard
                    idx={item.id}
                    img={item.img}
                    name={item.name}
                    itemId={item.id}
                    item={item}
                  />
                ))
              : "최근 본 아이탬이 없습니다"}
          </List>
        </Block>

        <Block className="p-8">
          <section className="flex flex-row">
            <p className="text-xl" style={{ color: "#F3EAD7" }}>
              댓글
            </p>
            {curItemInfo.rate >= 3.5 ? (
              <ReviewTitle reviews={reviews} curItemInfo={curItemInfo} />
            ) : (
              <ReviewTitle reviews={reviews} curItemInfo={curItemInfo} />
            )}
          </section>
          <List className="overflow-scroll h-44">
            {
              // itemId에 해당하는 리뷰를 가져와서 랜더해줘야됨
              // 컴포넌트화
              reviews.map((review) => {
                return <Review review={review} />;
              })
            }
          </List>
        </Block>
      </div>
    </Page>
  );
};
export default ItemInfo;