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
} from "framework7-react";
import React, { useEffect, useState } from "react";
import "../css/app.less";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  basketState,
  categoryState,
  contactsState,
  curItemInfoState,
  isContactState,
  itemState,
  recentItemState,
  relationItemState,
  reviewState,
  selectContactsState,
  tagState,
} from "../recoil/state";
import { getToken } from "../common/auth";
import axios from "axios";
import Grid from "../components/Grid";
import NotGrid from "../components/NotGrid";

// custom component

const SortCategoryPage = () => {
  const items = useRecoilValue(itemState);

  const handleReview = useSetRecoilState(reviewState);
  const handleCurItemInfo = useSetRecoilState(curItemInfoState);

  const [is4, handleIs4] = useState(false);
  const [tags, handleTag] = useRecoilState(tagState);
  const [category, handleCategory] = useRecoilState(categoryState);
  const [recentItem, handleRecentItem] = useRecoilState(recentItemState);
  const [relationItems, handleRelationItemState] = useRecoilState(
    relationItemState
  );

  const sort = (tags) => {
    const sorting = tags.filter((tag, idx) => {
      if (tags[idx - 1] && tags[idx + 1] && category !== "세트") {
        return !(
          tag.itemId === tags[idx - 1].itemId ||
          tag.itemId === tags[idx + 1].itemId
        );
      } else if (tags[idx - 1] && tags[idx + 1]) {
        return (
          tag.itemId === tags[idx - 1].itemId ||
          tag.itemId === tags[idx + 1].itemId
        );
      }
    });
    const sortArr = sorting
      .filter((tag) => tag.tag === category)
      .map((el) => el.itemId);

    return sortArr;
  };

  return (
    <>
      <Page
        name="write"
        style={{
          color: "#F3EAD7",
        }}
        noToolbar
      >
        <Navbar sliding={false} backLink>
          <NavTitle title={category}></NavTitle>
        </Navbar>

        <Block className="h-full">
          <section className="flex flex-row items-center mt-3 mb-3">
            <p className="text-lg ml-3">{category}</p>
            <button className="w-7" onClick={() => handleIs4(false)}>
              <Icon
                className="ml-2"
                size="22"
                ios="f7:rectangle_grid_1x2"
                aurora="f7:rectangle_grid_1x2"
              ></Icon>
            </button>
            <button className="w-7" onClick={() => handleIs4(true)}>
              <Icon
                className="ml-2"
                size="22"
                ios="f7:rectangle_grid_2x2"
                aurora="f7:rectangle_grid_2x2"
              ></Icon>
            </button>
          </section>
          <section className="h-full overflow-scroll">
            {!is4 && (
              <ul className="flex flex-col items-center justify-center pb-10">
                {!is4 &&
                  items.map((item) => {
                    return sort(tags).includes(item.id) ? (
                      <NotGrid item={item} />
                    ) : null;
                  })}
              </ul>
            )}

            {is4 && (
              <ul className="pb-10 flex">
                <section className="flex items-around flex-wrap">
                  {items.map((item) => {
                    return sort(tags).includes(item.id) ? (
                      <Grid item={item} />
                    ) : null;
                  })}
                </section>
              </ul>
            )}
          </section>
        </Block>
      </Page>
    </>
  );
};
export default SortCategoryPage;
