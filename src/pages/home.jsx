import axios from "axios";
import "../css/animation.css";
import React, { useEffect } from "react";
import { destroyToken, getToken } from "../common/auth";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import {
  Block,
  BlockTitle,
  Badge,
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
  Swiper,
  SwiperSlide,
  Icon,
} from "framework7-react";
import {
  basketState,
  curItemInfoState,
  itemState,
  reviewState,
  tagState,
  relationItemState,
  isSearchState,
  keywordRateState,
  allTagState,
  filterTagState,
  bellState,
  bellBedgeState,
  isActionState,
  recentItemState,
  categoryState,
  alarmsState,
} from "../recoil/state";
import "../css/custom.css";
import MyCard from "../components/MyCard";
import CategoryBox from "../components/CategoryBox";
import helper from "./modules/helper";

const HomePage = () => {
  let loggedIn = !!getToken().token;

  const items = useRecoilValue(itemState);

  const handleBells = useSetRecoilState(bellState);
  const handleItems = useSetRecoilState(basketState);
  const handleReview = useSetRecoilState(reviewState);
  const handleItemList = useSetRecoilState(itemState);
  const handleAllTag = useSetRecoilState(allTagState);
  const handleCurItemInfo = useSetRecoilState(curItemInfoState);

  const [tags, handleTag] = useRecoilState(tagState);
  const [alarms, handleAlarms] = useRecoilState(alarmsState);
  const [category, handleCategory] = useRecoilState(categoryState);
  const [isSearch, handleIsSearch] = useRecoilState(isSearchState);
  const [isAction, handleIsAction] = useRecoilState(isActionState);
  const [bellBadges, handleBellBadges] = useRecoilState(bellBedgeState);
  const [filterTags, handleFilterTags] = useRecoilState(filterTagState);
  const [recentItem, handleRecentItem] = useRecoilState(recentItemState);
  const [keywordRate, handleKeywordRate] = useRecoilState(keywordRateState);
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

  const requestItemList = async () => {
    // db의 아이탬을 가져옵니다.
    const { data } = await axios.get(`${process.env.API_URL}/get-item-list`);

    handleItemList(data.itemList);
  };

  const requestTag = async () => {
    const { data } = await axios.get(`${process.env.API_URL}/get-tag`);

    handleTag(data);
  };

  const requestSearchKeywordRate = async () => {
    const { data } = await axios.get(`${process.env.API_URL}/get-keyword-rate`);

    handleKeywordRate(data);
  };

  const requestBell = async () => {
    if (loggedIn) {
      const { data } = await axios.get(`${process.env.API_URL}/get-bell`, {
        headers: { authorization: `Bearer ${getToken().token}` },
      });

      handleBells(data);

      handleBellBadges(data.filter((el) => el.read === false));
    }
  };

  const clearBellBadges = async () => {
    if (loggedIn) {
      axios.get(`${process.env.API_URL}/clear-bell-bedge`, {
        headers: { authorization: `Bearer ${getToken().token}` },
      });

      handleBellBadges([]);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      requestBell();
    }
  }, [isAction]);

  useEffect(() => {
    requestItemList();

    requestTag();
  }, []);

  return (
    <Page name="home" hideNavbarOnScroll>
      {alarms.map((alarm, idx) => (
        <div key={idx} className="alarm">
          {alarm.text}
        </div>
      ))}
      {/* Top Navbar */}
      <Navbar sliding={false}>
        <NavLeft>
          {!loggedIn && (
            <Link href="/users/sign_in" text="SignIn" tooltip="로그인" />
          )}
          {!loggedIn && (
            <Link href="/users/sign_up" text="SignUp" tooltip="회원가입" />
          )}
          {loggedIn && (
            <Link
              tabLink="#view-signout"
              text="SignOut"
              tooltip="로그아웃"
              onClick={() => {
                destroyToken();
                helper.destroyLineItem();
                location.replace("/");
              }}
            />
          )}
        </NavLeft>
        <NavRight>
          <Link href="/search" onClick={requestSearchKeywordRate}>
            <Icon ios="f7:search" aurora="f7:search"></Icon>
          </Link>
          {loggedIn ? (
            <Link href="/bell" onClick={clearBellBadges}>
              <Icon ios="f7:bell" aurora="f7:bell">
                {bellBadges.length ? (
                  <Badge color="red">{bellBadges.length}</Badge>
                ) : null}
              </Icon>
            </Link>
          ) : (
            <Link href="/users/sign_in">
              <Icon ios="f7:bell" aurora="f7:bell">
                {bellBadges.length ? (
                  <Badge color="red">{bellBadges.length}</Badge>
                ) : null}
              </Icon>
            </Link>
          )}
          {loggedIn ? (
            <Link href="/cash">
              <Icon ios="f7:plus" aurora="f7:plus"></Icon>
            </Link>
          ) : (
            <Link href="/users/sign_in">
              <Icon ios="f7:plus" aurora="f7:plus"></Icon>
            </Link>
          )}
        </NavRight>
      </Navbar>

      {/* Page content */}
      <Swiper pagination navigation scrollbar className="">
        <SwiperSlide>
          <img src="https://cdn-store.leagueoflegends.co.kr/uploads/url_Mobile_Store_banner_Blitzcrank_KR_a96c72dc53.jpg"></img>
        </SwiperSlide>
        {/* tag */}
        <SwiperSlide>
          <img src="https://cdn-store.leagueoflegends.co.kr/uploads/url_Mobile_Store_banner_Lulu_Prestige_KR_f9ff41c4f8.jpg"></img>
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://cdn-store.leagueoflegends.co.kr/uploads/url_Mobile_Store_banner_Epic_Skin_KR_d46efe64c2.jpg"></img>
        </SwiperSlide>
      </Swiper>

      {/* {카테고리별 상품 보기 진입 장소} */}
      <Block>
        <ul
          className="flex flex-row w-full"
          style={{
            color: "#F3EAD7",
          }}
        >
          <CategoryBox propCategory="세트" />
          <CategoryBox propCategory="스킨" />
          <CategoryBox propCategory="챔피언" />
          <CategoryBox propCategory="개발중" />
        </ul>
      </Block>

      <Block className="p-8">
        <p className="text-xl" style={{ color: "#F3EAD7" }}>
          인기상품
        </p>
        <List className="overflow-scroll flex flex-row">
          {items.length > 0
            ? items.map((item, idx) => {
                return (
                  <MyCard
                    idx={item.id}
                    img={item.img}
                    name={item.name}
                    itemId={item.id}
                    item={item}
                  />
                );
              })
            : "loading..."}
        </List>
      </Block>

      <hr className="m-5"></hr>

      <Block className="p-8">
        <p className="text-xl" style={{ color: "#F3EAD7" }}>
          신규상품
        </p>
        <List className="overflow-scroll flex flex-row">
          {items.length > 0
            ? items
                .slice(items.length - 3)
                .map((item) => (
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

      <hr className="m-5"></hr>

      <Block className="p-8">
        <p className="text-xl" style={{ color: "#F3EAD7" }}>
          세일상품
        </p>
        <List className="overflow-scroll flex flex-row">
          {items.length > 0
            ? items
                .filter((item) => item.status === "sale")
                .map((item) => (
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
    </Page>
  );
};
export default HomePage;
