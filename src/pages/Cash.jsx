import {
    Block,
    BlockTitle,
    Button, Col, Link,
    List,
    ListItem, Navbar,
    NavLeft,
    NavRight,
    NavTitle, Page,
    Row,
    Searchbar,
    Card,
    Fab,
    FabButton,
    FabButtons,
    Icon,
    TextEditor,
    Radio
} from 'framework7-react';
import React from 'react';
import '../css/app.less';
import { useRecoilState, useRecoilValue } from 'recoil';
import { basketState, contactsState, isContactState, selectContactsState, selectRpState } from '../recoil/state';
import axios from 'axios';
import { getToken } from '../common/auth';
import {v4 as uuid4} from 'uuid';


// custom component
// TOSS API BASE URL
// const TOSS = "https://pay.toss.im/api/v2/"
// const clientKey = 'test_ck_OEP59LybZ8Bd6916DAQV6GYo7pRe';
// const secretKey = 'test_sk_5GePWvyJnrKbdKNP1ZeVgLzN97Eo';
// var tossPayments = TossPayments(clientKey);


const CashPage = () => {
    const [selectRp, handleSelectRp] = useRecoilState(selectRpState);

    const requestRp = () => {
        axios.post('https://localhost:3000/pay', {
            selectRp
        }, {
            headers: {
                authorization: `Bearer ${getToken().token}`
            }
        })
        .then(res => {
            console.log(res.data);
        })
    }
    const requestTossBuy = () => {
        // https 처리가 된 서버에서 요청을 보내보자!
        // axios.get('http://localhost:3000/req-toss')
        // .then(res => {
        //     console.log(res.data);
        // })

        const clientKey = 'test_ck_OEP59LybZ8Bd6916DAQV6GYo7pRe';
        // const secretKey = 'test_sk_5GePWvyJnrKbdKNP1ZeVgLzN97Eo:';
        var tossPayments = TossPayments(clientKey);

        // 토스 결제
        console.log()
        tossPayments.requestPayment('카드', {
            amount: 200,
            orderId: uuid4(),
            orderName: '토스 티셔츠 외 2건',
            customerName: '박토스',
            successUrl: 'https://localhost:3000'+ '/success',
            failUrl: window.location.origin + '/fail',
        })

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
    }


    return (
        <>
        <Page name="write" >
            <Navbar title="충전" backLink />
            <Block className="flex flex-col items-center justify-center text-lg" style={{
                color: "#F3EAD7",
            }}>
                충전하실 금액을 선택하세요
                <section className="flex flex-col items-start">
                    {/* radio */}
                    <ul>
                    <li className="flex items-center justify-center">
                        <label class="item-radio item-radio-icon-start item-content flex flex-row w-44">
                            <input type="radio" name="rp" value="580" checked defaultChecked onClick={(e) => {console.log(typeof e.target.value); handleSelectRp(e.target.value)}}/>
                            <i class="icon icon-radio"></i>
                            <div class="item-inner">
                            <section className="flex flex-row">
                                <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>
                                <p>580rp</p>
                            </section>
                            </div>
                        </label>
                    </li>
                    <li className="flex items-center justify-center">
                        <label class="item-radio item-radio-icon-start item-content flex flex-row w-44">
                            <input type="radio" name="rp" value="1280" checked onClick={(e) => {console.log(typeof e.target.value); handleSelectRp(e.target.value)}}/>
                            <i class="icon icon-radio"></i>
                            <div class="item-inner">
                            <section className="flex flex-row">
                                <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>
                                <p>1280rp</p>
                            </section>
                            </div>
                        </label>
                    </li>
                    <li className="flex items-center justify-center">
                        <label class="item-radio item-radio-icon-start item-content flex flex-row w-44">
                            <input type="radio" name="rp" value="2600" checked onClick={(e) => {console.log(typeof e.target.value); handleSelectRp(e.target.value)}}/>
                            <i class="icon icon-radio"></i>
                            <div class="item-inner">
                            <section className="flex flex-row">
                                <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>
                                <p>2600rp</p>
                            </section>
                            </div>
                        </label>
                    </li>
                    <li className="flex items-center justify-center">
                        <label class="item-radio item-radio-icon-start item-content flex flex-row w-44">
                            <input type="radio" name="rp" value="5350" checked onClick={(e) => {console.log(typeof e.target.value); handleSelectRp(e.target.value)}}/>
                            <i class="icon icon-radio"></i>
                            <div class="item-inner">
                            <section className="flex flex-row">
                                <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>
                                <p>5200rp</p>
                            </section>
                            </div>
                        </label>
                    </li>
                    </ul>
                    {/* <Radio name="credit" value="580" className="flex flex-row" >
                        <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>580rp
                    </Radio> */}
                </section>
                <Button onClick={() => {
                    // requestRp();
                    requestTossBuy();
                }}>확인</Button>
            </Block>
        </Page>
        </>
    )
};
export default CashPage;