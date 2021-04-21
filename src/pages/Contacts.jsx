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
  Segmented,
  Gauge,
} from "framework7-react";
import React from "react";
import "../css/app.less";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  basketState,
  contactsState,
  isContactState,
  selectContactsState,
  isPopWriteState,
  reviewGaugeState,
  textState,
} from "../recoil/state";
import axios from "axios";
import { getToken } from "../common/auth";
import ContactItem from "../components/ContactItem";
import AddReview from "../components/AddReview";
import helper from "./modules/helper";

const ContactsPage = () => {
  const [text, handleText] = useRecoilState(textState);
  const [contacts, handleContacts] = useRecoilState(contactsState);
  const [isContact, handleIsContact] = useRecoilState(isContactState);
  const [isPopWrite, handleIsPopWrite] = useRecoilState(isPopWriteState);
  const [reviewGauge, handleReviewGauge] = useRecoilState(reviewGaugeState);
  const [selectContacts, handleSelectContacts] = useRecoilState(
    selectContactsState
  );

  return (
    <Page name="basket">
      <Navbar sliding={false}>
        <NavTitle title="주문내역"></NavTitle>
      </Navbar>
      <List
        className=""
        style={{
          backgroundColor: "#02111b",
        }}
      >
        <ul className="">
          {contacts.length > 0 && isContact && !isPopWrite
            ? contacts.map((contact, idx) => {
                return (
                  <ContactItem
                    idx={contact.id}
                    contact={contact}
                    select={false}
                  />
                );
              })
            : !isPopWrite
            ? contacts.map((contact, idx) => {
                console.log(contact);
                return (
                  <ContactItem
                    idx={contact.id}
                    contact={contact}
                    select={true}
                  />
                );
              })
            : null}
        </ul>

        {isPopWrite && selectContacts.length > 0 ? (
          <AddReview
            reviewGauge={reviewGauge}
            handleReviewGauge={handleReviewGauge}
            handleText={handleText}
          />
        ) : null}
      </List>
      {!isPopWrite ? (
        <Fab
          position="right-bottom"
          slot="fixed"
          color="red"
          onClick={() => {
            handleSelectContacts(() => []);
            handleIsContact((old) => !old);
          }}
        >
          <Icon ios="f7:plus" aurora="f7:plus" md="material:add"></Icon>
          <Icon ios="f7:xmark" aurora="f7:xmark" md="material:close"></Icon>
          <FabButtons position="top">
            <button
              onClick={() => {
                console.log(selectContacts);
                if (selectContacts.length) {
                  handleIsPopWrite((old) => !old);
                } else {
                  helper.showToastCenter("1개 이상 선택하세요");
                }
              }}
            >
              <FabButton label="리뷰하기">
                <Icon ios="f7:bubble_right" aurora="f7:bubble_right"></Icon>
              </FabButton>
            </button>
          </FabButtons>
        </Fab>
      ) : null}
    </Page>
  );
};
export default ContactsPage;
