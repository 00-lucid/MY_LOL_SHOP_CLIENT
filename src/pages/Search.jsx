import axios from 'axios';
import { Button, f7ready, Page, Navbar, Swiper, SwiperSlide, Link, Toolbar, Block, NavTitle, List, ListItem, Searchbar, Card } from 'framework7-react';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Pagination } from 'swiper';
import { getToken } from '../common/auth';
import sanitizeHtml from '../js/utils/sanitizeHtml';
import { curItemInfoState, itemState, keywordRateState, relationItemState, reviewState, searchKeywordState } from '../recoil/state';

const SearchPage = (props) => {
    const items = useRecoilValue(itemState)
    const handleCurItemInfo = useSetRecoilState(curItemInfoState);
    const handleReview = useSetRecoilState(reviewState);
    const [relationItems, handleRelationItemState] = useRecoilState(relationItemState);
    const [searchKeyword, handleSearchKeyword] = useRecoilState(searchKeywordState);
    const keywordRate = useRecoilValue(keywordRateState);

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

    const requestSearchKeyword = () => {
        axios.post('https://localhost:3000/search', {
            keyword: searchKeyword
        }, {
            headers: {
                authorization: `Bearer ${getToken().token}`
            }
        })
        .then(res => {
            console.log(res);
        })
    }
    return (
    <Page style={{
        color: "#F3EAD7",
    }}>
        <Navbar title="검색" backLink />
        <NavTitle>
            <Searchbar 
                placeholder="'상품명' 으로 검색"
                searchContainer=".search-list"
                searchIn=".item-title"
                onSearchbarSearch={(searchbar, query, previousQuery) => handleSearchKeyword(query)}
                onSearchbarDisable={() => console.log('disable')}
                onInput={e => console.log(e.target.value)}
            ></Searchbar>
        </NavTitle>
        <Block strong inset>
            <p className="text-lg ml-5 mt-5 mb-2">인기 검색어</p>
            <List className="flex flex-col overflow-scroll h-40 mt-0 p-0"> 
                {
                    keywordRate.map((keyword, idx) => <ListItem header={`${idx + 1} 등`} title={keyword.keyword}  style={{
                        backgroundColor: '#02111b'
                    }}></ListItem>)
                }
            </List>
        </Block>
        <Block>
            <List className="search-list h-96 overflow-scroll">
                {/* 전체 아이탬 리스트 */}
                {   
                    items.map(item => {
                        console.log(item.id)
                        return <ListItem key={item.id} style={{backgroundColor: "#02111b"}} title={item.name} 
                            href={`/item-info/${item.id}`}
                            onClick={() => {
                                requestCurItemInfo(item.id);
                                requestSearchKeyword();
                            }}
                        >
                        </ListItem>
                    })
                }
            </List>
        </Block>
    </Page>
    )
}
export default SearchPage