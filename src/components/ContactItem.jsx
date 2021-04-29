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
  Block,
  Gauge,
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
  contactsState,
  dibsState,
  itemState,
  orderListState,
  relationItemState,
  selectContactsState,
  statisticState,
  userInfoState,
} from "../recoil/state";
import axios from "axios";

const ContactItem = ({ contact, select, idx }) => {
  const [onReview, handleOnReview] = useState(false);
  const [selectContacts, handleSelectContacts] = useRecoilState(
    selectContactsState
  );

  const addSelect = (contact) => {
    handleSelectContacts((old) => {
      const checked = old.includes(contact);
      if (!checked) {
        return [...old, contact];
      } else {
        return [...old.slice(0, checked), ...old.slice(checked + 1)];
      }
    });
  };

  return (
    <>
      {select && (
        <section
          key={idx}
          className="flex flex-col justify-center"
          style={{
            backgroundColor: "#02111b",
          }}
        >
          <img src={contact.img} className="w-auto"></img>
          {/* {컴포넌트화} */}
          {onReview && (
            <div
              className="absolute w-full flex flex-col item-center p-5"
              style={{
                height: "290px",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
              }}
            >
              <section className="mt-7">
                <section className="flex flex-row justify-center">
                  <Icon aurora="f7:star" ios="f7:star" />
                  <Icon aurora="f7:star" ios="f7:star" />
                  <Icon aurora="f7:star" ios="f7:star" />
                  <Icon aurora="f7:star" ios="f7:star" />
                  <Icon aurora="f7:star" ios="f7:star" />
                </section>
                <ListInput
                  type="text"
                  className="bg-gray-400 w-full mt-6 rounded-md"
                ></ListInput>
              </section>
            </div>
          )}
          <ListItem
            key={contact.id}
            // header={contact.name}
            // footer={`옵션: ${contact.optionBox} 수량: ${contact.countBox}개`}
            className="flex flex-col w-full"
            style={{
              color: "#F3EAD7",
              backgroundColor: "#02111b",
              borderBottomWidth: "1px",
              borderColor: "#C79A3A",
            }}
          >
            <section className="flex flex-col w-full ">
              <p className="font-semibold">{contact.name}</p>
              <section className="flex flex-row absolute right-7 items-center">
                <img
                  src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png"
                  className="w-5 h-5"
                ></img>
                <p
                  className="font-semibold"
                  style={{
                    color: "#F3EAD7",
                  }}
                >
                  {contact.lineTotal}
                </p>
              </section>
              <p
                className="text-xs"
                style={{
                  color: "gray",
                }}
              >{`옵션: ${contact.buyOption} 수량: ${contact.buyCount}개`}</p>
              <p className="text-xs text-gray-500">{contact.createdAt}</p>
            </section>

            {onReview && (
              <Button className="bottom-16" style={{ color: "#e63946" }}>
                <Icon ios="f7:checkmark_alt" aurora="f7:checkmark_alt"></Icon>
              </Button>
            )}

            {onReview ? (
              <Button
                className="bottom-16"
                style={{ color: "#e63946" }}
                onClick={() => handleOnReview((old) => !old)}
              >
                <Icon ios="f7:multiply" aurora="f7:multiply"></Icon>
              </Button>
            ) : (
              <Button
                className="bottom-16"
                style={{ color: "#e63946" }}
                onClick={() => handleOnReview((old) => !old)}
              >
                <Icon
                  ios="f7:chat_bubble_text_fill"
                  aurora="f7:chat_bubble_text_fill"
                ></Icon>
              </Button>
            )}
          </ListItem>
        </section>
      )}
    </>
  );
};

export default ContactItem;
