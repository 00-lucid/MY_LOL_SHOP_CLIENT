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
    Icon
} from 'framework7-react';
import React, { useEffect } from 'react';
import '../css/custom.css';
import '../css/app.less';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { basketState, alarmsState, bellBedgeState, bellState, isActionState } from '../recoil/state';
import axios from 'axios';
import { getToken } from '../common/auth';
import helper from './modules/helper';

// custom component

const BasketPage = () => {
    // items는 장바구니에 담긴 아이탬들
    const [items, handleItems] = useRecoilState(basketState);
    const [alarms, handleAlarms] = useRecoilState(alarmsState);
    const handleBellBadges = useSetRecoilState(bellBedgeState);
    const handleBells = useSetRecoilState(bellState);
    const [isAction, handleIsAction] = useRecoilState(isActionState);
    let total = 0;

    const buyBasket = () => {
        // basket State items를 모두 계산한다
        // user에 저장된 카드로 결제한다
        // 결제 성공시 orders table에 저장해서 기록을 남긴다.
        // lineitem에 구매 처리를 넣어줘야 한다.
        console.log(items);

        axios.post('https://localhost:3000/order', {
            total: total
        }, {
            headers: {
                authorization: `Bearer ${getToken().token}`
            }
        })
        .then((res) => {
            console.log(res.data);
            handleItems((oldItems) => {
                return [];
            })
        })
        .then(() => {
            handleAlarms(old => {
                return [
                    ...old,
                    {
                        text: '구매 성공!'
                    }
                ]
            })
            setTimeout(() => {
                handleAlarms(old => {
                    return [
                        ...old
                    ].slice(1)
                })
            }, 1000)
        })
        .then(() => {
            // if (getToken().token) {
            //     axios.post('http://localhost:3000/add-bell', {
            //         text: '구매해주셔서 감사합니다'
            //     }, {
            //         headers: {
            //             authorization: `Bearer ${getToken().token}`
            //         }
            //     })
            //     .then((res) => {
            //         handleBellBadges(old => [...old, {id : old.length + 1}]);
            //         handleBells(old => [...old, {title: res.data.text, createdAt: res.data.createdAt}])
            //         handleIsAction(old => !old);
            //     })
            // }
            helper.postBell(getToken().token, '구매해주셔서 감사합니다', handleBellBadges, handleBells, handleIsAction);
        })
        .catch((err) => {
            console.log(err);
        })

    }

    const outBasket = (item) => {
        // ListItem에 - 버튼을 눌렀을 때, 해당 ListItem을 삭제
        // LineItem table에서도 제거 되어야 함!
        console.log(item)

        if (!getToken().token) {
            handleItems((old) => {
                return old.filter(el => el.name !== item.name && el.createdAt !== item.createdAt)
            })
        } else {
            axios.post('https://localhost:3000/out-basket', item, {
                headers: {
                    authorization: `Bearer ${getToken().token}`
                }
            })
            .then((res) => {
                // 삭제하고 난 뒤의 장바구니 리스트를 반환?
                handleItems((old) => {
                    return old.filter(el => el.name !== item.name)
                })
            })
        }
    }
    // total 구하는 함수
    // order 요청 보낼 때, 화면에 합계 랜더할 때 사용한다
    // const smartTotal = () => {
    //     const total = items.reduce((x, y) => {
    //         return x + y.price
    //     }, 0);

    //     return total;
    // }
    return (
        <Page name="basket" >
            <Navbar sliding={false}>
                <NavTitle title="장바구니">
                </NavTitle>
                <NavRight>
                    {/* <Link tabLink="#view-signin" href="/users/sign_in" text="SignIn" tooltip="로그인"/>
                    <Link tabLink="#view-signup" href="/users/sign_up" text="SignUp" tooltip="회원가입"/> */}
                </NavRight>
            </Navbar>
            {
                alarms.map((alarm, idx) => <div key={idx} className="alarm-buy">{alarm.text}</div>)
            }
            <List className="p-3" style={{
            }}>
                {
                    items.map((item, idx) => {
                        const subTotal = (Number(item.price) + (item.optionBox === 'default' ? 0 : Number(item.optionBox.split(' ')[1]))) * Number(item.countBox);
                        total += (Number(item.price) + (item.optionBox === 'default' ? 0 : Number(item.optionBox.split(' ')[1]))) * Number(item.countBox) ;
                        return   <ListItem key={idx} header={idx + 1} title={item.name} footer={`옵션: ${item.optionBox} 수량: ${item.countBox}개`} className="items-center justify-center mb-0.5" style={{ color: '#F3EAD7', backgroundColor: '#02111b', borderWidth: '1px', borderColor: '#C79A3A'}}>
                        <section className="flex flex-row w-full items-center">
                        <img src={item.img} className="w-3/12"></img>
                        <section className="flex flex-row m-0.5 absolute right-12">
                            <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>
                            <p className="text-yellow-500  font-black">{subTotal}</p>
                        </section>
                        <Button onClick={outBasket.bind(null, item)} className="absolute right-0">
                            <Icon ios="f7:multiply" aurora="f7:multiply" md="material:close"></Icon>
                        </Button>
                        </section>
                    </ListItem>

                    })
                }
                {/* <ListItem header="1" title="고양이" footer="귀엽죠?" after="198,129,000 $" media="https://cdn.hellodd.com/news/photo/202005/71835_craw1.jpg" checkbox/> */}
            </List>
                <div className="fixed bottom-16 right-5 z-40 w-80 h-20 flex text-xl font-black items-center justify-center rounded-md overflow-hidden">
                    <div className="w-2/3 h-full flex items-center justify-center border-2" style={{
                        color: "#F3EAD7",
                        borderColor: "#C79A3A",
                    }}>
                        <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>
                        <span className="text-yellow-500">{`${total}`}</span>
                    </div>
                    <button className="w-1/3 h-full font-extrabold border-2" onClick={buyBasket} style={{
                        color: "#F3EAD7",
                        borderColor: "#C79A3A",
                    }}>Buy</button>
                </div>
        </Page>
    )
};
export default BasketPage;