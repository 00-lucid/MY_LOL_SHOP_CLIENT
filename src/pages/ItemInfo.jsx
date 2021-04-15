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
    Icon,
    Badge
} from 'framework7-react';
import React, { useState } from 'react';
import '../css/app.less';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { basketState, curItemInfoState, alarmsState, reviewState, relationItemState, tagState, recentItemState } from '../recoil/state';
import '../css/custom.css'
import axios from 'axios';
import { getToken } from '../common/auth';

// custom component

const ItemInfo = ({ id }) => {
    const [items, handleItems] = useRecoilState(basketState);
    const [alarms, handleAlarms] = useRecoilState(alarmsState);
    const curItemInfo = useRecoilValue(curItemInfoState);
    const reviews = useRecoilValue(reviewState);
    const handleCurItemInfo = useSetRecoilState(curItemInfoState);
    const handleReview = useSetRecoilState(reviewState);
    const tags = useRecoilValue(tagState);
    const [onDib, handleOnDib] = useState(false);
    const [recentItem, handleRecentItem] = useRecoilState(recentItemState);

    const recentItems = useRecoilValue(recentItemState);

    const [relationItems, handleRelationItemState] = useRecoilState(relationItemState);

    const getSelectValue = () => {
        // addItem에서 사용한다. select el value를 가져온다.
        const optionBox = document.querySelector('#option-box');
        const countBox = document.querySelector('#count-box');
        console.log(optionBox.value);
        console.log(countBox.value);
        return [optionBox.value, countBox.value];
    } 

    const requestCurItemInfo = (itemId) => {
        // 카드의 id를 이용해서 알맞는 아이탬 내용을 가져와 state에 저장해야 합니다.
        // 해당 state는 ItemInfo page 랜더에 활용됩니다.
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

    const addItem = async (item) => {
        // option과 count 정보를 가져와서 같이 basketState에 넣어줘야 함
        // 그리고 Basket.jsx에서 해당 정보들을 랜더링 해줘야 됨
        // 만약 이미 장바구니에 아이탬이 있을 경우 있다고 알려줘야 함
        if (items.filter(el => el.name === item.name).length >= 1) {
            alert('이미 장바구니에 있습니다')
            return;
        }

        const arrVal = await getSelectValue();
        if (!getToken().token) {
            handleItems((oldItems) => {
                return [
                    ...oldItems,
                    {
                        ...item,
                        optionBox: arrVal[0],
                        countBox: arrVal[1]
                    }
                ]
            })
            handleAlarms(old => {
                return [
                    ...old,
                    {
                        text: '장바구니에 추가 되었습니다!'
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
        } else {
            const subTotal = (Number(item.price) + (arrVal[0] === 'default' ? 0 : Number(getSelectValue()[0].split(" ")[1]))) * Number(arrVal[1]);

            axios.post('https://localhost:3000/add-line-item', {
                name: item.name,
                img: item.img,
                lineTotal: subTotal,
                buyOption: arrVal[0],
                buyCount: arrVal[1],
                // itemId도 보내줘야함
                itemId: item.id
            })
            .then(res => {
                console.log(res);
                handleItems((oldItems) => {
                return [
                    ...oldItems,
                    {
                        ...item,
                        optionBox: arrVal[0],
                        countBox: arrVal[1]
                    }
                ]
                })
            })
            .then(() => {
                // 장바구니에 담았다는 사실을 사용자에게 가시화 해야함
                handleAlarms(old => {
                    return [
                        ...old,
                        {
                            text: '장바구니에 추가 되었습니다!'
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
        }

        }
    const addDib = () => {
        if (getToken().token) {
            axios.post('https://localhost:3000/add-dib', 
            {
                // 현재 아이탬 아이디를 보내서 해당 dib table에 해당 아이탬 번호와 요청 유저의 번호를 담아 저장한다.
                id: curItemInfo.id
            }, 
            {
                headers: {authorization: `Bearer ${getToken().token}`}
            })
            .then(res => {
                console.log(res);
            })
        }
    }

    const buyItem = async (item) => {
        const arrVal = await getSelectValue();
        const subTotal = await (Number(item.price) + (arrVal[0] === 'default' ? 0 : Number(getSelectValue()[0].split(" ")[1]))) * Number(arrVal[1]);

        if (getToken().token) {
            axios.post('https://localhost:3000/order-now', 
            {
                name: item.name,
                img: item.img,
                lineTotal: subTotal,
                buyOption: arrVal[0],
                buyCount: arrVal[1],
                itemId: item.id,
                total: subTotal,
            }, 
            {
                headers: {authorization: `Bearer ${getToken().token}`}
            })
            .then(res => {
                console.log(res.data);
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
                location.replace('/')
            })
            .catch(() => {
                // history.pushState('/cash');
                // 충전 페이지로 이동시켜야 함
                location.replace('/')
            })
        }
    }

    return (
        <Page name="basket" >
            <Navbar sliding={false}>
                <NavLeft>
                    <Navbar backLink="Back" />
                </NavLeft>
                <NavTitle title="상세보기">
                </NavTitle>
            </Navbar>
            {
                alarms.map((alarm, idx) => <div key={idx} className="alarm">{alarm.text}</div>)
            }
            <div>
                <Block className="item-info-main flex flex-col items-center justify-around mt-12">
                    <Block className="item-info-img"
                        style={
                            {
                                backgroundImage: "url(" + curItemInfo.img + ")",
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                            }
                        }
                    >
                    </Block>
                    <Block className="item-info-option mx-10 mt-7">
                        <section className="flex flex-row items-center">
                            <div className="info-title font-semibold" style={{
                                color: "#F3EAD7",
                                fontSize: '18px'
                            }}>{curItemInfo.name}</div>
                            <Button className="m-3" outlin onClick={() => {addDib(); handleOnDib(old => !old)}}>
                                {
                                    curItemInfo.dib || onDib?
                                    <Icon ios="f7:heart_fill" aurora="f7:heart"></Icon>
                                    :
                                    <Icon ios="f7:heart" aurora="f7:heart"></Icon>
                                }
                            </Button>
                        </section>
                        {
                            curItemInfo.status === 'on' ?
                            <section className="flex flex-row m-0.5 text-3xl items-center">
                                <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>
                                <p className="text-yellow-500  font-black">{curItemInfo.price - 10}</p>
                            </section>
                            :
                            <section className="flex flex-row m-0.5 text-3xl items-center">
                                <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>
                                <p className="text-yellow-500  font-black mr-2 opacity-30" style={{color: "#bbbbbb"}}><del>{curItemInfo.price}</del></p>
                                <p className="text-yellow-500  font-black">{curItemInfo.price - 10}</p>
                            </section>
                        }
                        <div className="info-option">
                            <select id="option-box" name="option-box">
                                <option value="default">default</option>
                                {
                                    curItemInfo.arrOption.map((option) => {
                                        return <option key={option.id} value={`${option.option} +${option.optionPrice} 원`}>{`${option.option} +${option.optionPrice} 원`}</option>
                                    })
                                }
                                {/* <option value="red">red</option> */}
                            </select>
                        </div>
                        <div className="info-count">
                            <select id="count-box" name="count-box">
                                {
                                    [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
                                        return <option key={n} value={n}>{n}</option>
                                    })
                                }
                                {/* <option value="1">1</option> */}
                            </select>
                        </div>
                        <div className="info-select">
                            <button className="buy-cart" onClick={() => {addItem(curItemInfo)}}>장바구니</button>
                            <button className="buy-now" onClick={() => buyItem(curItemInfo)}>바로구매</button>
                        </div>
                    </Block>
                </Block>

                <Block className="p-8">
                    <p className="text-xl" style={{color: "#F3EAD7"}}>관련 상품</p>
                        <List className="overflow-scroll flex flex-row">
                        {
                            relationItems.length > 0 ?
                            relationItems.map(item => 
                            <section className="flex flex-col">
                            <section className="flex flex-col items-center justify-center">
                                <Card
                                className="items-stretch flex-initial flex-none w-44 h-44 border m-1 hover:opacity-30" 
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
                                key={item.id}
                                >
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
                                    {/* <img src={item.img} className="w-40 h-40 rounded-md"></img> */}
                                </a>
                                </Card>
                            </section>
                            <p className="text-lg m-0.5" style={{ color: "#F3EAD7"}}>{item.name}</p>
                            {/* { item.rate >= 3.5 ?
                            <section className="flex flex-row items-center m-0.5">
                                <img src="https://image.flaticon.com/icons/png/128/1828/1828884.png" className="w-4 h-4 m-0.5"/>
                                <p className="text-green-500">{item.rate}</p>
                            </section>
                            :
                            <section className="flex flex-row items-center m-0.5">
                                <img src="https://image.flaticon.com/icons/png/128/1828/1828884.png" className="w-4 h-4 m-0.5"/>
                                <p className="text-red-500">{item.rate}</p>
                            </section>
                            } */}
                            {
                                item.status === 'on' ?
                                <section className="flex flex-row m-0.5">
                                    <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>
                                    <p className="text-yellow-500  font-black">{item.price}</p>
                                </section>
                                :
                                <section className="flex flex-row m-0.5">
                                    <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>
                                    <p className="text-yellow-500  font-black mr-2 opacity-30" style={{color: "#bbbbbb"}}><del>{item.price}</del></p>
                                    <p className="text-yellow-500  font-black">{item.price - 10}</p>
                                </section>
                            }

                            <section className="flex flex-row">
                            {
                                tags.filter(tag => tag.itemId === item.id).map((tag) => {
                                return <Badge className="mr-1">{tag.tag}</Badge>
                                }).slice(0, 3)
                            }
                            </section>
                            </section>

                            )
                            :
                            'loading...'
                        }
                        </List>
                </Block>

                <Block className="p-8">
                    <p className="text-xl" style={{color: "#F3EAD7"}}>최근 본 아이탬</p>
                        <List className="overflow-scroll flex flex-row" style={{
                            color: "#F3EAD7",
                        }}>
                        {
                            recentItems.length > 0 ?
                            recentItems.map(item => 
                            <section className="flex flex-col">
                            <section className="flex flex-col items-center justify-center">
                                <Card
                                className="items-stretch flex-initial flex-none w-44 h-44 border m-1 hover:opacity-30" 
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
                                key={item.id}
                                >
                                <a 
                                    className="w-full h-full flex flex-col items-center justify-center"
                                    href={`/item-info/${item.id}`}
                                    onClick={() => {
                                        requestCurItemInfo(item.id);
                                        handleRecentItem(old => {
                                            const result = old.filter(el => el.name !== item.name);
                                            return [item, ...result];
                                        })
                                    }}
                                >
                                    {/* <img src={item.img} className="w-40 h-40 rounded-md"></img> */}
                                </a>
                                </Card>
                            </section>
                            <p className="text-lg m-0.5" style={{ color: "#F3EAD7"}}>{item.name}</p>
                            {/* { item.rate >= 3.5 ?
                            <section className="flex flex-row items-center m-0.5">
                                <img src="https://image.flaticon.com/icons/png/128/1828/1828884.png" className="w-4 h-4 m-0.5"/>
                                <p className="text-green-500">{item.rate}</p>
                            </section>
                            :
                            <section className="flex flex-row items-center m-0.5">
                                <img src="https://image.flaticon.com/icons/png/128/1828/1828884.png" className="w-4 h-4 m-0.5"/>
                                <p className="text-red-500">{item.rate}</p>
                            </section>
                            } */}
                            {
                                item.status === 'on' ?
                                <section className="flex flex-row m-0.5">
                                    <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>
                                    <p className="text-yellow-500  font-black">{item.price}</p>
                                </section>
                                :
                                <section className="flex flex-row m-0.5">
                                    <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5 m-0.5"></img>
                                    <p className="text-yellow-500  font-black mr-2 opacity-30" style={{color: "#bbbbbb"}}><del>{item.price}</del></p>
                                    <p className="text-yellow-500  font-black">{item.price - 10}</p>
                                </section>
                            }

                            <section className="flex flex-row">
                            {
                                tags.filter(tag => tag.itemId === item.id).map((tag) => {
                                return <Badge className="mr-1">{tag.tag}</Badge>
                                }).slice(0, 3)
                            }
                            </section>
                            </section>

                            )
                            :
                            '최근 본 아이탬이 없습니다'
                        }
                        </List>
                </Block>

                <Block className="p-8">
                        <section className="flex flex-row">
                            <p className="text-xl" style={{color: "#F3EAD7"}}>댓글</p>
                            { curItemInfo.rate >= 3.5 ?
                                <section className="flex flex-row items-center m-0.5">
                                    <img src="https://image.flaticon.com/icons/png/128/1828/1828884.png" className="w-4 h-4 m-0.5"/>
                                    <p className="text-green-500 text-lg">{curItemInfo.rate}</p>
                                    <span className="ml-1.5 text-lg" style={{ color: '#F3EAD7', opacity: '80%' }}>{reviews.length}개</span>
                                </section>
                                :
                                <section className="flex flex-row items-center m-0.5">
                                    <img src="https://image.flaticon.com/icons/png/128/1828/1828884.png" className="w-4 h-4 m-0.5"/>
                                    <p className="text-red-500 text-lg">{curItemInfo.rate}</p>
                                    <span className="ml-1.5 text-lg" style={{ color: '#F3EAD7', opacity:'80%' }}>{reviews.length}개</span>
                                </section>
                            }
                        </section>
                    <List className="overflow-scroll h-44">
                        {
                            // itemId에 해당하는 리뷰를 가져와서 랜더해줘야됨
                            // 컴포넌트화
                            reviews.map(review => {
                            return (<ListItem className="flex flex-row items-start" style={{backgroundColor: '#02111b', color: '#F3EAD7', borderBottomWidth: '2px', borderColor: '#C79A3A'}} >
                                        <img className="w-10 rounded-full" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLfn6eqrsbTp6+zg4uOwtrnJzc/j5earsbW0uby4vcDQ09XGyszU19jd3+G/xMamCvwDAAAFLklEQVR4nO2d2bLbIAxAbYE3sDH//7WFbPfexG4MiCAcnWmnrzkjIRaD2jQMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMw5wQkHJczewxZh2lhNK/CBOQo1n0JIT74/H/qMV0Z7GU3aCcVPuEE1XDCtVLAhgtpme7H0s1N1U7QjO0L8F7llzGeh1hEG/8Lo7TUmmuSrOfns9xnGXpXxsONPpA/B6OqqstjC6Ax/0ujkNdYQQbKNi2k64qiiEZ+ohi35X+2YcZw/WujmslYewiAliVYrxgJYrdwUmwXsU+RdApUi83oNIE27YvrfB/ZPg8+BJETXnqh9CVzBbTQHgojgiCvtqU9thFJg/CKz3VIMKMEkIXxIWqIpIg2SkjYj+xC816mrJae2aiWGykxRNsW0UwiJghJDljYI5CD8GRiCtIsJxizYUPQ2pzItZy5pcisTRdk/a9m4amtNNfBuQkdVhSaYqfpNTSFGfb9GRIakrE2Pm+GFLaCQPqiu0OpWP+HMPQQcgQMiQprWXNmsVwIjQjYi/ZrhAqNTCgr2gu0Jnz85RSSjso0HkMFZ0YZjKkc26a/jlmh9JiDyDxi9oeorTYAzZkwwoMz19pzj9bnH/GP/+qbchjSGflneWYhtTuKdMOmNKZcJ5TjInQKcYXnESd/jQxy0ENpULTNGOGgxpap/oyw9pbUAqhfx2Dbkhovvfgz4iUzoM9+GlK6/Mh4q29hyC1mwro30hpVVLPF9wYQr71RazOeM5/cw81iBRD+A03aM9/C/obbrKjbYSpCmIVG3qT/Q8oeUo3Rz0IL7vI1tEbCB9pSiu8I/aV8x3Kg/BGWrWp4ZVs0nZfmAoEG4h/61yHYIJiFSl6Q0Vk6tTW1N8kYp8hdOkfHYYMXd2Qft+8CYwqYDSKvqIh+MCF8Wgca2u/cwdgeW3TtuVn6+1oBs3yLo5C2JpK6CvQzGpfUkz9UG/87gCsi5o2LIXolxN0FbwAsjOLEr+YJmXn7iR6N0BCt5p5cMxm7eAsfS+/CACQf4CTpKjzgkvr2cVarVTf96372yut7XLJ1sa7lv6VcfgYrWaxqr3Wlo1S6pvStr22sxOtTNPLzdY3nj20bPP+ejFdJYkLsjGLdtPBEbe/mr2bQKiXWJDroA+vtzc0p9aahuwqHMDYrQEXHEw9jwQl3drMpts9JBU1SdktPe5FBRdJQ6bwXBpa57ib2A8kukQDzMjh++Uo7Fo6Wd02Pkf4fknqoo4HtvAIjsqUcjx6DIPgWCaOML9rKI/oqD9/lgNrn+eF+p7j8tnzHBiR7+kdUGw/+V1Kzkc75mMy6U+FMaxjPibiM1U1uGM+puInHpmALZCgP4pt7i840MV8+0R1zPsRB6UTcqpizncYwZ89syDydfyWCwXB1l8/zRNGWbTG/GHKUm9AkxHMc/EGSk3z2+ArEhPEV5TUBLEvUGFcjEUH80J/jveTGOAJEljJbILWGQT3zRYiwuKsUXN1EEJAzBhRJFll7mBUG7KD8EqPkKekBREaL8hMDZLQSG6AQjtHPYmvTQnX0TtpC1SYCe2YdkkyLP3jj5BSbKiuR585eQhTgoje6yIb0Yb0C+mV6EYvebqw5SDy2WmubogZiF2AVxPC2FpDf8H2Q9QWo6IkjUxTWVEI3WY/wrCeSuqJ+eRWzXR/JXwgVjUMozbCOfoEZiSiKVGepqv5CJ8RyR4D7xBeamqa7z3BJ/z17JxuBPdv93d/a2Ki878MMAzDMAzDMAzDMAzDMF/KP09VUmxBAiI3AAAAAElFTkSuQmCC"/>
                                        <img src="https://image.flaticon.com/icons/png/128/1828/1828884.png" className="w-4 h-4 m-1"/>
                                        <p className="">{(review.rate * 10) / 2}</p>
                                        <p className="m-5">{review.text}</p>
                                    </ListItem>)})
                        }
                    </List>
                </Block>
                {/* <div className="p-4">
                    상품 세부정보 글
                </div> */}
            </div>
        </Page>
    )
};
export default ItemInfo;