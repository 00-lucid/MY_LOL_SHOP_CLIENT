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
import sanitizeHtml from "../js/utils/sanitizeHtml";
import { bellState } from "../recoil/state";

const BellPage = (props) => {
  const [bells, handleBells] = useRecoilState(bellState);

  return (
    <Page
      noToolbar
      style={{
        color: "#F3EAD7",
      }}
    >
      <Navbar title="알림" backLink>
        <NavRight>
          <Link>
            <Icon ios="f7:trash" aurora="f7:trash"></Icon>
          </Link>
        </NavRight>
        <Subnavbar>
          <Segmented>
            <Button tabLink="#tab1" tabLinkActive>
              활동알림
            </Button>
            <Button tabLink="#tab2">키워드알림</Button>
          </Segmented>
        </Subnavbar>
      </Navbar>
      <Tabs>
        <Tab id="tab1" tabActive className="page-content">
          <List className="overflow-scroll">
            {bells.length > 0 &&
              bells.map((bell, idx) => {
                console.log(bell);
                return (
                  <ListItem
                    key={idx}
                    title={bell.text}
                    header={bell.createdAt}
                    style={{
                      backgroundColor: "#02111b",
                    }}
                  />
                );
              })}
          </List>
        </Tab>
        <Tab id="tab2" className="page-content">
          <List>
            <ListItem
              title="키워드 알림1"
              style={{
                backgroundColor: "#02111b",
              }}
            ></ListItem>
          </List>
        </Tab>
      </Tabs>
    </Page>
  );
};
export default BellPage;
