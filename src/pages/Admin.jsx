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
  Fab,
  FabButton,
  FabButtons,
  Icon,
  TextEditor,
  PieChart,
  Segmented,
} from "framework7-react";
import React, { useEffect } from "react";
import "../css/app.less";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  basketState,
  contactsState,
  isContactState,
  selectContactsState,
  isAddItemState,
  statisticState,
} from "../recoil/state";
import { Formik, Field, Form } from "formik";

// custom component

const AdminPage = () => {
  const statistic = useRecoilValue(statisticState);

  const [isAddItem, handleIsAddItem] = useRecoilState(isAddItemState);

  const data = statistic.statisticTagSale.map((obj) => {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return Object.assign({}, obj, { color: `#${randomColor}` });
  });

  const data1 = statistic.tierArr.map((obj) => {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return Object.assign({}, obj, { color: `#${randomColor}` });
  });

  return (
    <>
      <Page name="write">
        <Navbar title="관리자" />
        <Fab position="right-bottom" slot="fixed" color="red">
          <Icon ios="f7:plus" aurora="f7:plus" md="material:add"></Icon>
          <Icon ios="f7:xmark" aurora="f7:xmark" md="material:close"></Icon>
          <FabButtons position="top">
            <FabButton label="상품 제거하기">
              <a href="/admin/delete-item">
                <Icon ios="f7:xmark_square" aurora="f7:xmark_square"></Icon>
              </a>
            </FabButton>
            <FabButton label="상품 등록하기">
              <a href="/admin/create-item">
                <Icon ios="f7:cube" aurora="f7:cube"></Icon>
              </a>
            </FabButton>
          </FabButtons>
        </Fab>
        {/* <Block strong className="flex flex-col items-center justify-center m-8" style={{
                color: "#F3EAD7",
            }}>
                <p className="text-lg">총 수익</p>
                <p className="font-black text-green-500 text-2xl">{statistic.statisticTotal} G</p> 
                <p className="text-lg">최고 평점</p>
                <p className="font-black text-green-500 text-2xl flex flex-row items-center">
                    <img src="https://image.flaticon.com/icons/png/128/1828/1828884.png" className="w-4 h-4"/>
                    {statistic.statisticRate}
                </p> 
                <p className="text-lg">최다 판매</p>
                <p className="font-black text-green-500 text-2xl">{statistic.statisticSale} 번</p> 
            </Block> */}
        <Block
          strong
          className="flex flex-col items-center justify-center m-8"
          style={{
            color: "#F3EAD7",
          }}
        >
          <p className="text-lg">사용자 티어 분포</p>
          <PieChart className="w-2/5" tooltip datasets={data1} />
        </Block>
        <Block
          strong
          className="flex flex-col items-center justify-center m-8"
          style={{
            color: "#F3EAD7",
          }}
        >
          <p className="text-lg">태그별 구매 인원</p>
          <PieChart className="w-2/5" tooltip datasets={data} />
        </Block>
      </Page>
    </>
  );
};
export default AdminPage;
