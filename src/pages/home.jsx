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
  const lineitmes = useRecoilValue(basketState);

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

  const requestItemList = async () => {
    // db??? ???????????? ???????????????.
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
    // TODO ?????? ??? ?????? ??????
    if (loggedIn) {
      const { data } = await axios.get(`${process.env.API_URL}/get-bell`, {
        headers: { authorization: `Bearer ${getToken().token}` },
      });
      if (data.length > 0) {
        handleBells(data);

        handleBellBadges(data.filter((el) => el.read === false));
      }
    }
  };

  const clearBellBadges = async () => {
    // TODO ?????? ?????? ????????? ???, read ???????????? ??????
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
            <Link href="/users/sign_in" text="SignIn" tooltip="?????????" />
          )}
          {!loggedIn && (
            <Link href="/users/sign_up" text="SignUp" tooltip="????????????" />
          )}
          {loggedIn && (
            <Link
              tabLink="#view-signout"
              text="SignOut"
              tooltip="????????????"
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
            <Link
              href="/bell"
              onClick={() => {
                clearBellBadges();
                requestBell();
              }}
            >
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
            <Link
              href="/cash"
              onClick={() => {
                helper.saveLineItem(lineitmes);
              }}
            >
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

      {/* * {??????????????? ?????? ?????? ?????? ??????} */}
      <Block>
        <ul
          className="flex flex-row w-full"
          style={{
            color: "#F3EAD7",
          }}
        >
          <CategoryBox propCategory="??????" />
          <CategoryBox propCategory="??????" />
          <CategoryBox propCategory="?????????" />
          <CategoryBox propCategory="?????????" />
        </ul>
      </Block>

      <Block className="p-8">
        <p className="text-xl" style={{ color: "#F3EAD7" }}>
          ????????????
        </p>
        <List className="overflow-scroll flex flex-row">
          {items.length > 0
            ? items.slice(0, 10).map((item, idx) => {
                return <MyCard key={item.id} item={item} />;
              })
            : "loading..."}
        </List>
      </Block>

      <hr className="m-5"></hr>

      <Block className="p-8">
        <p className="text-xl" style={{ color: "#F3EAD7" }}>
          ????????????
        </p>
        <List className="overflow-scroll flex flex-row">
          {items.length > 0
            ? items
                .slice(items.length - 3)
                .map((item) => <MyCard key={item.id} item={item} />)
            : "loading..."}
        </List>
      </Block>

      <hr className="m-5"></hr>

      <Block className="p-8">
        <p className="text-xl" style={{ color: "#F3EAD7" }}>
          ????????????
        </p>
        <List className="overflow-scroll flex flex-row">
          {items.length > 0
            ? items
                .filter((item) => item.status === "sale")
                .map((item) => <MyCard key={item.id} item={item} />)
            : "loading..."}
        </List>
      </Block>
    </Page>
  );
};
export default HomePage;
