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
import React, { useEffect, useState } from 'react';
import '../css/app.less';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { basketState, categoryState, contactsState, curItemInfoState, isContactState, itemState, recentItemState, relationItemState, reviewState, selectContactsState, tagState } from '../recoil/state';
import { getToken } from '../common/auth';
import axios from 'axios';

// custom component

const SortCategoryPage = () => {
    const items = useRecoilValue(itemState);
    const [tags, handleTag] = useRecoilState(tagState);
    const [category, handleCategory] = useRecoilState(categoryState);
    const [is4, handleIs4] = useState(false);
    const [recentItem, handleRecentItem] = useRecoilState(recentItemState);
    const handleReview = useSetRecoilState(reviewState);
    const [relationItems, handleRelationItemState] = useRecoilState(relationItemState);
    const handleCurItemInfo = useSetRecoilState(curItemInfoState);


    const requestCurItemInfo = (itemId) => {
        // 카드의 id를 이용해서 알맞는 아이탬 내용을 가져와 state에 저장해야 합니다.
        // 해당 state는 ItemInfo page 랜더에 활용됩니다.
        if (getToken().token) {
            axios.post('https://localhost:3000/get-item-info', {
            id: itemId
            }, {
            headers: {
                authorization: `Bearer ${getToken().token}`
            }
            })
            .then(async (res) => {
            console.log(res.data);
            await handleCurItemInfo(() => {
                console.log(Object.assign({}, res.data));
                return Object.assign({}, res.data);
            })
            await handleReview(res.data.reviews)
            await handleRelationItemState(res.data.relationItems)
            });
        } else {
            axios.post('https://localhost:3000/get-item-info', {
            id: itemId
            })
            .then(async (res) => {
            console.log(res.data);
            await handleCurItemInfo(() => {
                console.log(Object.assign({}, res.data));
                return Object.assign({}, res.data);
            })
            await handleReview(res.data.reviews)
            await handleRelationItemState(res.data.relationItems)
            });
        }
    }



    return (
        <>
        <Page name="write" style={{
            color: "#F3EAD7",
        }}>
            <Navbar sliding={false} backLink>
                <NavTitle title={category}>
                </NavTitle>
            </Navbar>

            <Block className="h-full">
                <section className="flex flex-row items-center mt-3">
                    <p className="text-lg ml-3">{category}</p> 
                    <button className="w-7" onClick={() => handleIs4(false)}><Icon className="ml-2" size="22" ios="f7:rectangle_grid_1x2" aurora="f7:rectangle_grid_1x2"></Icon></button>
                    <button className="w-7" onClick={() => handleIs4(true)}><Icon className="ml-2" size="22" ios="f7:rectangle_grid_2x2" aurora="f7:rectangle_grid_2x2"></Icon></button>
                </section>
                <section className="h-full overflow-scroll">
                    {
                        !is4 &&
                    <ul className="flex flex-col items-center justify-center pb-10">

                        {
                            !is4 &&
                            items.map(item => {
                                // console.log(tags);
                                const sorting = tags.filter((tag, idx) => {
                                    if (tags[idx - 1] && tags[idx + 1] && category !== '세트') {
                                        return !(tag.itemId === tags[idx - 1].itemId || tag.itemId === tags[idx + 1].itemId)
                                    } else if (tags[idx - 1] && tags[idx + 1]) {
                                        return tag.itemId === tags[idx - 1].itemId || tag.itemId === tags[idx + 1].itemId
                                    }
                                })
                                // console.log('~~~~~', sorting);
                                const sortArr = sorting.filter((tag) => tag.tag === category).map(el => el.itemId);
                                // console.log(sortArr);
                                return sortArr.includes(item.id)
                                ?
                                <li key={item.id} className="mt-3 w-80 h-40 flex flex-col justify-end" style={{
                                    borderWidth: '0.1px',
                                    borderColor: "#C79A3A",
                                    backgroundImage: "url(" + `${item.img}` + ")",
                                    backgroundPosition: 'top',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    overflow: 'hidden',
                                }}>
                                    <a 
                                        className="w-full h-full flex flex-col items-center justify-center"
                                        href={`/item-info/${item.id}`}
                                        onClick={() => {
                                            requestCurItemInfo(item.id)
                                            handleRecentItem(old => {
                                                const result = old.filter(el => el.name !== item.name);
                                                return [item, ...result];
                                                // [item, ...old.slice(0, old.indexOf(item)), ...old.slice(old.indexOf(item) + 1)]
                                            })
                                        }}
                                    >
                                    </a>
                                    <div className="h-14 bg-black p-2" style={{
                                        background: 'rgba(0, 0, 0, 0.6)'
                                    }}>
                                        <p>{item.name}</p>
                                        <section className="flex flex-row items-center">
                                            <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-4 h-4"></img>
                                            <p className="font-semiboldw ml-2" style={{
                                                color: '#fae6bd'
                                            }}>{item.price}</p>
                                        </section>
                                    </div>
                                </li>
                                :
                                null
                            })
                        }
                    </ul>
                    }

{
    is4 &&
                        <ul className="pb-10 flex">
                        <section className="flex items-around flex-wrap">

                        {
                            items.map(item => {

                                const sorting = tags.filter((tag, idx) => {
                                    if (tags[idx - 1] && tags[idx + 1] && category !== '세트') {
                                        return !(tag.itemId === tags[idx - 1].itemId || tag.itemId === tags[idx + 1].itemId)
                                    } else if (tags[idx - 1] && tags[idx + 1]) {
                                        return tag.itemId === tags[idx - 1].itemId || tag.itemId === tags[idx + 1].itemId
                                    }
                                })
                                // console.log('~~~~~', sorting);
                                const sortArr = sorting.filter((tag) => tag.tag === category).map(el => el.itemId);
                                // console.log(sortArr);
                                return sortArr.includes(item.id)
                                ?
                                <li className="mt-3 ml-1.5 w-44 h-40 flex flex-col justify-end" style={{
                                    borderWidth: '0.1px',
                                    borderColor: "#C79A3A",
                                    backgroundImage: "url(" + `${item.img}` + ")",
                                    backgroundPosition: 'top',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    overflow: 'hidden',
                                }}>
                                    <a 
                                        className="w-full h-full flex flex-col items-center justify-center"
                                        href={`/item-info/${item.id}`}
                                        onClick={() => {
                                            requestCurItemInfo(item.id);
                                            handleRecentItem(old => {
                                                const result = old.filter(el => el.name !== item.name);
                                                return [item, ...result];
                                                // [item, ...old.slice(0, old.indexOf(item)), ...old.slice(old.indexOf(item) + 1)]
                                            })
                                        }}
                                    >
                                    </a>
                                    <div className="h-14 bg-black p-2" style={{
                                        background: 'rgba(0, 0, 0, 0.6)'
                                    }}>
                                        <p className="text-white">{item.name.length < 14 ? item.name : item.name.slice(0, 14) + '...'}</p>
                                        <section className="flex flex-row items-center">
                                            <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5"></img>
                                            <p style={{
                                                color: '#fae6bd'
                                            }}>{item.price}</p>
                                        </section>
                                    </div>
                                </li> 
                                :
                                null
                            }  
                            )
                        }
                        </section>
                    </ul>
                    
}

                    
                </section>
            </Block>
        </Page>
        </>
    )
};
export default SortCategoryPage;