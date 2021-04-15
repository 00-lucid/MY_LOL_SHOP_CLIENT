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
    TextEditor
} from 'framework7-react';
import React, { useState } from 'react';
import '../css/app.less';
import { useRecoilState, useRecoilValue } from 'recoil';
import { basketState, contactsState, isContactState, itemState, reviewState, selectContactsState } from '../recoil/state';
import axios from 'axios';
import { getToken } from '../common/auth';

// custom component

const DeleteItemPage = () => {
    const reviews = useRecoilValue(reviewState);
    const items = useRecoilValue(itemState);
    const [countView, handleCountView] = useState(0);
    const more = (idx) => {
        // 어떤 항목의 상세페이지 버튼을 눌렀을 때, 해당 아이탬의 인덱스를 가져와서 그 인덱스와 일치하는 번째의 상세 페이지를 랜더한다.
        handleCountView(idx + 1);
    }
    const deleteItem = (itemId) => {
        axios.post('https://localhost:3000/delete-item', {
            id: itemId
        }, {
            headers: {
                authorization: `Bearer ${getToken().token}`
            }
        })
        .then(res => {
            console.log(res.data);
        })
    }
    return (
        <>
        {/* color: "#F3EAD7", */}
        {/* borderColor: "#C79A3A", */}
        {/* backgroundColor: '#02111b' */}
        <Page name="write" >
            <Navbar sliding={false} backLink>
                <NavLeft>
                    <Link icon='las la-bars' panelOpen="left" />
                </NavLeft>
                <NavTitle title="상품삭제">
                </NavTitle>
            </Navbar>
            <List>
                {/* 리스트 아이탬을 클릭하면 상세정보 보기 기능 */}
                <ul>                    
                {
                    items.map((item, idx) => {
                        return <>
                            <ListItem className="" style={{
                                backgroundColor: '#02111b',
                                color: '#F3EAD7',
                                borderColor: "#C79A3A",
                                borderWidth: '1px'
                            }}>
                                {item.name}
                                <Button fill className="absolute w-3/4 opacity-0" onClick={()=>{console.log('클릭 상세'); more(idx);}}></Button>
                                <Button className="z-50" fill onClick={() => {console.log(item.id); deleteItem(item.id)}}>제거하기</Button>
                            </ListItem>
                            {
                                countView === idx + 1 &&
                                <div className="bg-white flex flex-row" style={{
                                    backgroundColor: '#02111b',
                                    color: '#F3EAD7',
                                    borderColor: "#C79A3A",
                                    borderWidth: '1px'
                                }}>
                                    <div className="items-stretch flex-initial flex-none w-44 h-44 border m-1 "
                                        style={
                                        {
                                            backgroundImage: "url(" + item.img + ")",
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                            color: "#F3EAD7",
                                            borderColor: "#C79A3A",
                                        }
                                        }
                                    >
                                    </div>
                                    <div className="flex flex-col items-start justify-center p-11 h-full">
                                        <p className="flex flex-row mb-2"><Icon className="w-1 h-1 mr-10" ios="f7:star_fill" aurora="f7:star_fill" color="red"></Icon>{item.rate}</p>
                                        <p className="flex flex-row mb-2"><Icon className="w-1 h-1 mr-10" ios="f7:person_2_fill" aurora="f7:person_2_fill" color="red"></Icon>{reviews.length}</p>
                                        <p className="flex flex-row mb-2"><Icon className="w-1 h-1 mr-10" ios="f7:money_dollar_circle_fill" aurora="f7:money_dollar_circle_fill" color="red"></Icon>{item.price}</p>
                                    </div>
                                </div>
                            }
                        </>
                    })
                }
                </ul>
            </List>
        </Page>
        </>
    )
};
export default DeleteItemPage;