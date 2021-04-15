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
    Radio,
    Gauge,
    Fab,
    Icon,
    FabButtons,
    FabButton,
} from 'framework7-react';
import React, { useEffect, useState } from 'react';
import '../css/app.less';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { alarmsState, basketState, bellBedgeState, dibsState, isPopWriteState, orderListState, userInfoState } from '../recoil/state';
import axios from 'axios';
import { getToken } from '../common/auth';

// custom component

const MyPage = () => {

    const [newName, handleNewName] = useState('');
    const [isConfig, handleIsConfig] = useState(false);
    const [alarms, handleAlarms] = useRecoilState(alarmsState);

    const [orderList, handleOrderList] = useRecoilState(orderListState);

    const handleBellBadges = useSetRecoilState(bellBedgeState);

    const [dibList, handleDibList] = useRecoilState(dibsState);

    const [userInfo, handleUserInfo] = useRecoilState(userInfoState);
    // --f7-text-editor-text-color

    // 이름 변경 또는 비밀번호 변경시 요청을 보내서 변경된 데이타를 받아와야 함

    useEffect(() => {
        handleUserInfo(old => {
            return {
                old,
                name: newName
            }
        })
    }, [newName])

    return (
        <Page name="basket" >
            <Navbar sliding={false}>
                <NavTitle title="마이페이지">
                </NavTitle>
            </Navbar>
            {
                isConfig &&
                <Button className="absolute top-8 right-3 h-16 w-20" href="/config-pw">비밀번호 변경</Button>
                // <button class="col button button-fill open-password">Password</button>
            }
            {
                alarms.map((alarm, idx) => <div key={idx} className="alarm-buy">{alarm.text}</div>)
            }
            <div className="flex flex-col p-8 flex items-center flex justify-center" style={{color:"#F3EAD7"}}>
                <div className="flex flex-col flex items-center">
                <img className="rounded-full w-32" style={{borderColor: '#C79A3A', borderWidth: '2px'}} src="https://tistory4.daumcdn.net/tistory/3459371/attach/0c93fe49f9f14ceba804f63bdee55b30"></img>
                {
                    !isConfig ?
                    <div className="text-3xl mt-1" style={{color: '#F3EAD7'}}>{userInfo.name}</div>
                    :
                    <div className="text-3xl mt-1 flex flex-col" style={{color: '#F3EAD7'}}>
                        <input type="text" className="text-3xl" defaultValue={userInfo.name} onChange={(e) => handleNewName(e.target.value)} style={{
                            color: '#F3EAD7',
                            fontSize: '1.875rem',
                            textAlign: 'center',
                            borderBottom: '1px solid white'
                        }} />
                        <section className="flex items-center justify-center">
                            <Button fill className="mt-3 w-32" onClick={() => {
                                axios.post('https:localhost:3000/config-name', {
                                    newName: newName,
                                    // password
                                }, {
                                    headers: {
                                        authorization: `Bearer ${getToken().token}`
                                    }
                                })
                                .then(res => {
                                    console.log(res.data);
                                    handleAlarms(old => {
                                        return [
                                            ...old,
                                            {
                                                text: '이름변경 성공!'
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
                            }}>확인</Button>
                        </section>
                    </div>

                }

                <div className="text-lg text-gray-400">{userInfo.email}</div>

                <div style={{color: '#F3EAD7'}} className="text-xl flex flex-row m-2 items-center justify-center">
                    <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>
                    <span>{userInfo.rp}</span>
                </div>

                </div>
                <hr style={{borderColor: "#C79A3A", borderWidth: '0.1px', width: '100%'}}></hr>
                {/* <div className="flex flex-col p-1 flex items-center rounded-md" style={{color: '#F3EAD7'}}>
                    <div className="text-xl"><span className="font-medium">tier:</span>{userInfo.tier}</div>
                    <div className="text-lg"><span className="font-medium">email:</span>{userInfo.email}</div>
                    <div className="text-lg"><span className="font-medium">address:</span>{userInfo.address ? userInfo.address : '등록된 주소가 없습니다'}</div>
                </div> */}
                <section className="flex flex-col justify-center items-center font-bold	text-lg p-8">
                    <p className="">귀하의 등급은 {userInfo.tier} 입니다</p>
                    <img src={userInfo.tierImg} className="w-4/5"></img>
                    <Gauge
                        className="m-8"
                        type="semicircle"
                        value={userInfo.buyCount}
                        valueText={userInfo.buyCount ? userInfo.buyCount : '0'}
                        valueTextColor="#2F5FD2"
                        borderColor="#2F5FD2"
                    />
                    <p>{userInfo.tierNum} 번 더 주문시 등급 상승</p>
                </section>
                <hr className="" style={{borderColor: "#C79A3A", borderWidth: '1px', width: '100%'}}></hr>
                <List className="w-full flex flex-col justify-center items-center p-3">
                    <p className="text-xl font-bold m-1">찜목록</p>
                    <ul>
                    {
                        dibList.map((dib, idx) => {
                            // <ListItem title={dib.Item.name} media={dib.Item.img} footer={dib.createdAt}/>
                            return (
                                <section className="flex flex-row w-full items-center mb-3" style={{
                                    borderColor: '#C79A3A', borderWidth: 1
                                }}>
                                <img src={dib.Item.img} className="w-2/12"></img>
                                <ListItem key={dib.Item.id} title={dib.Item.name} footer={dib.createdAt} className="w-10/12 items-center justify-center" style={{ color: '#F3EAD7', backgroundColor: '#02111b',}}>
                                    <section className="flex flex-row m-0.5 items-center">
                                        <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>
                                        <p className="text-yellow-500  font-black">{dib.Item.price}</p>
                                    </section>
                                </ListItem>
                                </section>
                            )
                        })
                    }
                    </ul>
                </List>
                <div className="w-full ">
                    <List>
                        {/* {
                            orderList.map(el => <ListItem key={el.id} title="2021-04-01">{el.total}</ListItem>)
                        } */}
                        {/* <ListItem title="구매한 카트"></ListItem> */}
                    </List>
                </div>
            </div>

            <Fab position="right-bottom" slot="fixed" color="red">
            <Icon ios="f7:plus" aurora="f7:plus" md="material:add"></Icon>
            <Icon ios="f7:xmark" aurora="f7:xmark" md="material:close"></Icon>
                <FabButtons position="top">
                    {/* 수정을 누르면 닉네임을 수정할 수 있어야 됨 */}
                    <button onClick={() => handleIsConfig(old => !old)}><FabButton ><Icon ios="f7:pencil" aurora="f7:pencil"></Icon></FabButton></button>
                    {/* <button className="mb-3" href="/delete-user"><FabButton label="탈퇴"><Icon ios="f7:trash" aurora="f7:trash"></Icon></FabButton></button> */}
                    <a href="/delete-user" className="mb-3"><Icon ios="f7:trash" aurora="f7:trash"></Icon></a>
                </FabButtons>
            </Fab>
        </Page>
    )
};
export default MyPage;