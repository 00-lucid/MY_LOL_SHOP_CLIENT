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
  Radio,
} from "framework7-react";
import React, { useState } from "react";
import "../css/app.less";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  basketState,
  contactsState,
  isContactState,
  selectContactsState,
  selectRpState,
  userInfoState,
} from "../recoil/state";
import "../css/custom.css";
import axios from "axios";
import { getToken } from "../common/auth";
import { v4 as uuid4 } from "uuid";
// custom component
// TOSS API BASE URL
// const TOSS = "https://pay.toss.im/api/v2/"
// const clientKey = 'test_ck_OEP59LybZ8Bd6916DAQV6GYo7pRe';
// const secretKey = 'test_sk_5GePWvyJnrKbdKNP1ZeVgLzN97Eo';
// var tossPayments = TossPayments(clientKey);

const CashPage = () => {
  const [rpPrice, handleRpPrice] = useState(0);
  const [selectRp, handleSelectRp] = useRecoilState(selectRpState);
  const [userInfo, handleUserInfo] = useRecoilState(userInfoState);

  const requestTossBuy = async (rp, price) => {
    const clientKey = "test_ck_OEP59LybZ8Bd6916DAQV6GYo7pRe";
    var tossPayments = TossPayments(clientKey);

    rp = Number(rp);
    price = Number(price);

    // 토스 결제
    tossPayments.requestPayment("카드", {
      amount: price,
      orderId: uuid4(),
      orderName: `${rp}RP`,
      customerName: `${userInfo.name}`,
      successUrl: "http://localhost:8080" + "/success",
      failUrl: "http://localhost:8080" + "/fail",
    });

    // https로 요청 보내야 한다.

    // toss body는 state로 관리?
    // axios.post(`${TOSS}/payments`, {
    //     "orderNo": 1,
    //     "amount": amount,
    //     "amountTaxFree": 0,
    //     "productDesc": 'TEST',
    //     "apiKey": "테스트용 키 O 실거레용 키 X",
    //     "autoExecute": true,
    //     // autoExcute: true = 자동으로 결제 승인
    //     // autoExcute: false = 결제 승인 toss API를 통해 승인 과정 거쳐야 함
    //     "resultCallback": "https://YOUR-SITE.COM/callback",
    //     "retUrl": "http://YOUR-SITE.COM/ORDER-CHECK",
    //     "retCancelUrl": "http://YOUR-SITE.COM/close",
    //     // "expiredTime": "xxxx-xx-xx xx:xx:xx" option
    // })
    // code 0 = 결제 성공
    // checkoutPage = 결제를 진행할 수 있는 토스 결제 웹페이지 URL, 사용자에게 띄워주세요
    // payToken 거래를 구분할 수 있는 토스 고유 값 결제를 진행할 때, 결제를 환불할 떄, 결제의 현재 상태를 파악할 때,
    // 해당 고유 번호를 통해 결제 건에 접근하므르 잘 보관!

    // payments post -> checkoutPage redirect -> retUrl로 고객 받음 -> status=PAY_COMPLETE일 경우에만 결제 완료
  };

  return (
    <>
      <Page name="write" noToolbar>
        <Navbar title="충전" backLink />
        <Block
          className="flex flex-col items-center justify-center text-lg w-full"
          style={{
            color: "#F3EAD7",
          }}
        >
          <p className="mt-3">충전하실 금액을 선택하세요</p>
          <section className="flex flex-col items-start w-full">
            {/* radio */}
            <ul className="w-full">
              <li
                className="flex items-center justify-center border-white flex-auto m-3 p-3 flex-auto"
                style={{
                  borderWidth: "1px",
                  borderColor: "#C79A3A",
                }}
              >
                <label class="item-radio item-radio-icon-start item-content flex flex-row w-44 flex-auto">
                  <input
                    className="bg-white w-full"
                    type="radio"
                    name="rp"
                    value="580 4900"
                    defaultChecked
                    onClick={(e) => {
                      handleSelectRp(e.target.value.split(" ")[0]);
                      handleRpPrice(e.target.value.split(" ")[1]);
                    }}
                  />
                  <i class="icon icon-radio"></i>
                  <div class="item-inner">
                    <section className="flex flex-row items-center justify-center">
                      <img
                        src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png"
                        className="w-5 h-5 m-0.5"
                      ></img>
                      <p>580RP</p>
                      <p className="absolute right-10">4900원</p>
                    </section>
                  </div>
                </label>
              </li>

              <li
                className="flex items-center justify-center border-white flex-auto m-3 p-3 flex-auto"
                style={{
                  borderWidth: "1px",
                  borderColor: "#C79A3A",
                }}
              >
                <label class="item-radio item-radio-icon-start item-content flex flex-row w-44 flex-auto">
                  <input
                    className="bg-white w-full"
                    type="radio"
                    name="rp"
                    value="1320 9900"
                    onClick={(e) => {
                      handleSelectRp(e.target.value.split(" ")[0]);
                      handleRpPrice(e.target.value.split(" ")[1]);
                    }}
                  />
                  <i class="icon icon-radio"></i>
                  <div class="item-inner">
                    <section className="flex flex-row items-center justify-center">
                      <img
                        src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png"
                        className="w-5 h-5 m-0.5"
                      ></img>
                      <p>1,320RP</p>
                      <p className="absolute right-10">9900원</p>
                    </section>
                  </div>
                </label>
              </li>

              <li
                className="flex items-center justify-center border-white flex-auto m-3 p-3 flex-auto"
                style={{
                  borderWidth: "1px",
                  borderColor: "#C79A3A",
                }}
              >
                <label class="item-radio item-radio-icon-start item-content flex flex-row w-44 flex-auto">
                  <input
                    className="bg-white w-full"
                    type="radio"
                    name="rp"
                    value="2700 19900"
                    onClick={(e) => {
                      handleSelectRp(e.target.value.split(" ")[0]);
                      handleRpPrice(e.target.value.split(" ")[1]);
                    }}
                  />
                  <i class="icon icon-radio"></i>
                  <div class="item-inner">
                    <section className="flex flex-row items-center justify-center">
                      <img
                        src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png"
                        className="w-5 h-5 m-0.5"
                      ></img>
                      <p>2,700RP</p>
                      <p className="absolute right-10">19,900원</p>
                    </section>
                  </div>
                </label>
              </li>

              <li
                className="flex items-center justify-center border-white flex-auto m-3 p-3 flex-auto"
                style={{
                  borderWidth: "1px",
                  borderColor: "#C79A3A",
                }}
              >
                <label class="item-radio item-radio-icon-start item-content flex flex-row w-44 flex-auto">
                  <input
                    className="bg-white w-full"
                    type="radio"
                    name="rp"
                    value="4350 35000"
                    onClick={(e) => {
                      handleSelectRp(e.target.value.split(" ")[0]);
                      handleRpPrice(e.target.value.split(" ")[1]);
                    }}
                  />
                  <i class="icon icon-radio"></i>
                  <div class="item-inner">
                    <section className="flex flex-row items-center justify-center">
                      <img
                        src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png"
                        className="w-5 h-5 m-0.5"
                      ></img>
                      <p>4,350RP</p>
                      <p className="absolute right-10">35,000원</p>
                    </section>
                  </div>
                </label>
              </li>

              <li
                className="flex items-center justify-center border-white flex-auto m-3 p-3 flex-auto"
                style={{
                  borderWidth: "1px",
                  borderColor: "#C79A3A",
                }}
              >
                <label class="item-radio item-radio-icon-start item-content flex flex-row w-44 flex-auto">
                  <input
                    className="bg-white w-full"
                    type="radio"
                    name="rp"
                    value="6275 49900"
                    onClick={(e) => {
                      handleSelectRp(e.target.value.split(" ")[0]);
                      handleRpPrice(e.target.value.split(" ")[1]);
                    }}
                  />
                  <i class="icon icon-radio"></i>
                  <div class="item-inner">
                    <section className="flex flex-row items-center justify-center">
                      <img
                        src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png"
                        className="w-5 h-5 m-0.5"
                      ></img>
                      <p>6,275RP</p>
                      <p className="absolute right-10">49,900원</p>
                    </section>
                  </div>
                </label>
              </li>

              <li
                className="flex items-center justify-center border-white flex-auto m-3 p-3 flex-auto"
                style={{
                  borderWidth: "1px",
                  borderColor: "#C79A3A",
                }}
              >
                <label class="item-radio item-radio-icon-start item-content flex flex-row w-44 flex-auto">
                  <input
                    className="bg-white w-full"
                    type="radio"
                    name="rp"
                    value="13000 99900"
                    onClick={(e) => {
                      handleSelectRp(e.target.value.split(" ")[0]);
                      handleRpPrice(e.target.value.split(" ")[1]);
                    }}
                  />
                  <i class="icon icon-radio"></i>
                  <div class="item-inner">
                    <section className="flex flex-row items-center justify-center">
                      <img
                        src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png"
                        className="w-5 h-5 m-0.5"
                      ></img>
                      <p>13,000RP</p>
                      <p className="absolute right-10">99,900원</p>
                    </section>
                  </div>
                </label>
              </li>
            </ul>
            {/* <Radio name="credit" value="580" className="flex flex-row" >
                        <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>580rp
                    </Radio> */}
          </section>
          {/* <Button
            style={{}}
            onClick={() => {
              requestTossBuy(selectRp, rpPrice);
            }}
          >
            확인
          </Button> */}
          <button
            className="fixed h-16 z-50 text-lg font-semibold"
            onClick={() => requestTossBuy(selectRp, rpPrice)}
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
            충전
          </button>
        </Block>
      </Page>
    </>
  );
};
export default CashPage;
