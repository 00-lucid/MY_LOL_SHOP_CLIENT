import axios from "axios";
import {
  Button,
  f7ready,
  Page,
  Navbar,
  Swiper,
  SwiperSlide,
  Toolbar,
  Block,
  NavTitle,
  List,
  ListItem,
  NavRight,
  Link,
  Icon,
  Subnavbar,
  Segmented,
  Tab,
  Tabs,
} from "framework7-react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Pagination } from "swiper";
import { getToken } from "../common/auth";
import sanitizeHtml from "../js/utils/sanitizeHtml";
import { bellState } from "../recoil/state";

const BellPage = (props) => {
  const [bells, handleBells] = useRecoilState(bellState);

  const deleteBells = async () => {
    handleBells([]);
    const { data } = await axios.delete("https://localhost:3000/delete-bells", {
      headers: {
        authrization: `Bearer ${getToken().token}`,
      },
    });
  };

  const arrBells = [...bells];
  arrBells.reverse();
  return (
    <Page
      noToolbar
      style={{
        color: "#F3EAD7",
      }}
    >
      <Navbar title="알림" backLink>
        <NavRight>
          <Link onClick={deleteBells}>
            <Icon ios="f7:trash" aurora="f7:trash"></Icon>
          </Link>
        </NavRight>
      </Navbar>
      <List className="overflow-scroll h-screen">
        {arrBells.length > 0 &&
          arrBells.map((bell, idx) => {
            console.log(bell);
            return bell.read ? (
              <ListItem
                key={idx}
                title={bell.text}
                header={bell.createdAt}
                style={{
                  backgroundColor: "#02111b",
                }}
              />
            ) : (
              <ListItem
                key={idx}
                title={bell.text}
                header={bell.createdAt}
                style={{
                  backgroundColor: "#e63946",
                }}
              />
            );
          })}
      </List>
    </Page>
  );
};
export default BellPage;
