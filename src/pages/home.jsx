import {
  Block,
  BlockTitle,
  Badge,
  Button, Col, Link,
  List,
  ListItem, Navbar,
  NavLeft,
  NavRight,
  NavTitle, Page,
  Row,
  Searchbar,
  Card,
  Swiper,
  SwiperSlide,
  Icon
} from 'framework7-react';
import React, { useEffect } from 'react';

// recoil
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { basketState, curItemInfoState, itemState, reviewState, tagState, relationItemState, isSearchState, keywordRateState, allTagState, filterTagState, bellState, bellBedgeState, isActionState, recentItemState, categoryState } from '../recoil/state';
import axios from 'axios';
import { destroyToken, getToken } from '../common/auth';

// custom component

const HomePage = () => {
  let loggedIn = !!getToken().token;

  const items = useRecoilValue(itemState);
  const [bellBadges, handleBellBadges] = useRecoilState(bellBedgeState)
  const [isSearch, handleIsSearch] = useRecoilState(isSearchState);
  const [tags, handleTag] = useRecoilState(tagState);
  const [filterTags, handleFilterTags] = useRecoilState(filterTagState);
  const handleReview = useSetRecoilState(reviewState);
  const handleItemList = useSetRecoilState(itemState);
  const handleItems = useSetRecoilState(basketState);
  const handleCurItemInfo = useSetRecoilState(curItemInfoState);
  const handleBells = useSetRecoilState(bellState);
  const [relationItems, handleRelationItemState] = useRecoilState(relationItemState);

  const [recentItem, handleRecentItem] = useRecoilState(recentItemState);
  const [category, handleCategory] = useRecoilState(categoryState);
  const [keywordRate, handleKeywordRate] = useRecoilState(keywordRateState);
  const handleAllTag = useSetRecoilState(allTagState);
  const [isAction, handleIsAction] = useRecoilState(isActionState);

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
        await handleCurItemInfo(() => {
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
        await handleCurItemInfo(() => {
          return Object.assign({}, res.data);
        })
        await handleReview(res.data.reviews)
        await handleRelationItemState(res.data.relationItems)
      });
    }
  }

  const requestItemList = () => {
    // db의 아이탬을 가져옵니다.
    axios.get('https://localhost:3000/get-item-list')
    .then((res) => {
      handleItemList(() => {
        return res.data.itemList;
      })
    })
  }

  // const requestRelationItemList = () => {
  //   axios.get('https://localhost:3000/get-relation-item-list')
  //   .then(res => {
  //     console.log(res.data);
  //   })
  // }
  // const requestAllTag = () => {
  //   axios.get('https://localhost:3000/get-all-tag')
  //   .then(res => {
  //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  //     console.log(res.data)
  //     handleAllTag(res.data);
  //   })
  // }
  const requestTag = () => {
    axios.get('https://localhost:3000/get-tag')
    .then(res => {
      handleTag(() => {
        return res.data;
      })
    })
  }

  const requestFilterTag = () => {
    axios.get('https://localhost:3000/get-filter-tag', {
      headers: {
        authorization: `Bearer ${getToken().token}`
      }
    })
    .then(res => {
      const result = res.data.map(el => el.tag)
      handleFilterTags(result);
    })
  }

  const requestSearchKeywordRate = () => {
    axios.get('https://localhost:3000/get-keyword-rate')
    .then(res => {
      handleKeywordRate(res.data)
    });
  }

  const requestBell = () => {
    if (loggedIn) {
      axios.get('https://localhost:3000/get-bell', {
        headers: {
          authorization: `Bearer ${getToken().token}`
        }
      })
      .then((res) => {
        handleBells(res.data);
        // false 인 것만 추가
        handleBellBadges(res.data.filter(el => el.read === false));
      })
    } else {
      // 로그인 요구
    }
  }

  const clearBellBadges = async () => {
    if (loggedIn) {
      await axios.get('https://localhost:3000/clear-bell-bedge', {
        headers: {
          authorization: `Bearer ${getToken().token}`
        }
      });
      handleBellBadges([]);
    } else {
      // 로그인 요구
    }
  }
  // step
  // 알람을 생성하는 action을 할 때, requestBell을 해줘야 됨
  // action state?
  useEffect(() => {
    if (loggedIn) {
      requestBell();
    }
  }, [isAction])

  useEffect(() => {
    requestItemList();
    requestTag();

  }, [])

  useEffect(() => {
  })

  return <Page name="home">
      {/* Top Navbar */}
      <Navbar sliding={false}>
        {/* <Searchbar onFocus={() => handleIsSearch(true)} onClickDisable={() => handleIsSearch(false)}
          searchContainer='.search-list'
          searchIn=".item-title"
        >
        </Searchbar>
        {
          // fixed 된 상태의 전체 아이탬 리스트가 떠야 됨
          isSearch &&
          <List className="search-list search-found fixed w-full h-full mt-28">
            {
              items.map(item => <ListItem title={item.name}></ListItem>)
            }
          </List>
        } */}
        <NavLeft>
          {
            !loggedIn &&
            <Link href="/users/sign_in" text="SignIn" tooltip="로그인"/>
          }
          {
            !loggedIn &&
            <Link href="/users/sign_up" text="SignUp" tooltip="회원가입"/>
          }
          {
            loggedIn &&
            <Link tabLink="#view-signout" text="SignOut" tooltip="로그아웃" onClick={() => {destroyToken(); location.replace('/')}}/>
          }
        </NavLeft>
        <NavRight>
          <Link href="/search" onClick={requestSearchKeywordRate}>
            <Icon ios="f7:search" aurora="f7:search"></Icon>
          </Link>
          {/* {
            loggedIn ?
            <Link href="/config-tag" onClick={() => {requestAllTag(); requestFilterTag()}}>
              <Icon ios="f7:tag" aurora="f7:tag"></Icon>
            </Link>
            :
            <Link href="/users/sign_in">
              <Icon ios="f7:tag" aurora="f7:tag"></Icon>
            </Link>
          } */}
          {
            loggedIn ?
            <Link href="/bell" onClick={clearBellBadges}>
              <Icon ios="f7:bell" aurora="f7:bell">
                {
                  bellBadges.length ?
                  <Badge color="red">{ bellBadges.length }</Badge>
                  :
                  null
                }
              </Icon>
            </Link>
            :
            <Link href="/users/sign_in" >
            <Icon ios="f7:bell" aurora="f7:bell">
              {
                bellBadges.length ?
                <Badge color="red">{ bellBadges.length }</Badge>
                :
                null
              }
            </Icon>
          </Link>
          }
          {
            loggedIn ?
            <Link href="/cash" >
              <Icon ios="f7:plus" aurora="f7:plus"></Icon>
            </Link>
            :
            <Link href="/users/sign_in" >
              <Icon ios="f7:plus" aurora="f7:plus"></Icon>
            </Link>
          }
        </NavRight>
      </Navbar>
      {/* <div className="bg-white">
      </div> */}
      
      {/* Page content */}
      <Swiper pagination navigation scrollbar className="">
        <SwiperSlide
          style={
            {
              // backgroundImage: "url(" + "https://cdn-store.leagueoflegends.co.kr/uploads/url_Mobile_Store_banner_Blitzcrank_KR_a96c72dc53.jpg" + ")",
              // backgroundPosition: 'center',
              // backgroundSize: 'cover',
              // backgroundRepeat: 'no-repeat',
            }
          }
        >
          <img src="https://cdn-store.leagueoflegends.co.kr/uploads/url_Mobile_Store_banner_Blitzcrank_KR_a96c72dc53.jpg"></img>
        </SwiperSlide>
        {/* tag */}
        <SwiperSlide>
          <img src="https://cdn-store.leagueoflegends.co.kr/uploads/url_Mobile_Store_banner_Lulu_Prestige_KR_f9ff41c4f8.jpg"></img>
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://cdn-store.leagueoflegends.co.kr/uploads/url_Mobile_Store_banner_Epic_Skin_KR_d46efe64c2.jpg"></img>
        </SwiperSlide>
      </Swiper>
          
      {/* {카테고리별 상품 보기 진입 장소} */}
      <Block>
          <ul className="flex flex-row w-full" style={{
            color: "#F3EAD7",
          }}>
            <li className="w-1/4 h-24" style={{
              borderColor: "#C79A3A",
              borderWidth: "1px"
            }}>
              <a onClick={() => handleCategory('세트')}  href="/category">
                <div className="flex flex-col items-center justify-center h-full">
                  <Icon ios="f7:gift" aurora="f7:gift"></Icon>
                  <p>세트</p>
                </div>
              </a>
            </li>

            <li className="w-1/4 h-24" style={{
              borderColor: "#C79A3A",
              borderWidth: "1px"
            }}>
              <a onClick={() => handleCategory('스킨')}  href="/category">
                <div className="flex flex-col items-center justify-center h-full">
                  <Icon ios="f7:hexagon" aurora="f7:hexagon"></Icon>
                  <p>스킨</p>
                </div>
              </a>  
            </li>

            <li className="w-1/4 h-24" style={{
              borderColor: "#C79A3A",
              borderWidth: "1px"
            }}>
              <a onClick={() => handleCategory('챔피언')}  href="/category">
                <div className="flex flex-col items-center justify-center h-full">
                  <Icon ios="f7:person" aurora="f7:person"></Icon>
                  <p>챔피언</p>
                </div>
              </a>
            </li>

            <li className="w-1/4 h-24" style={{
              borderColor: "#C79A3A",
              borderWidth: "1px"
            }}>
              <a onClick={() => handleCategory('개발중')}  href="/category">
                <div className="flex flex-col items-center justify-center h-full">
                  <Icon ios="f7:cube_box" aurora="f7:cube_box"></Icon>
                  <p>개발중</p>
                </div>
              </a>
            </li>
          </ul>
      </Block>

      <Block className="p-8">
        <p className="text-xl" style={{color: "#F3EAD7"}}>인기상품</p>
        <List className="overflow-scroll flex flex-row">
          {
            // ListItem을 커스텀할 수 있는 방법??
            // 인기 상품은 item.count가 높은 순서대로 나열해야한다..
            // sort? reduce?
            items.length > 0 ?
            items.map((item, idx) => 
            {
            // parse한 이미지가 typeof obj라면 URL화 시킨 뒤 랜더하면 된다.
            // typeof JSON.parse(item.img) === 'object' ? item.img = URL.createObjectURL(JSON.parse(item.img)) : null
            return <section key={idx} className="flex flex-col">
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
                      // handleRecentItem(old => [item, ...old]);
                      handleRecentItem(old => {
                        const result = old.filter(el => el.name !== item.name);
                        return [item, ...result];
                        // [item, ...old.slice(0, old.indexOf(item)), ...old.slice(old.indexOf(item) + 1)]
                      })
                    }}
                  >
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
                  return <Badge key={tag.id} className="mr-1">{tag.tag}</Badge>
                }).slice(0, 3)
            }
            </section>
            </section>
            }

            )
            :
            'loading...'
          }
        </List>
      </Block>

      <hr className="m-5"></hr>

      <Block className="p-8">
        <p className="text-xl" style={{color: "#F3EAD7"}}>신규상품</p>
        <List className="overflow-scroll flex flex-row">
          {
            // ListItem을 커스텀할 수 있는 방법??
            // itemImg는 url 형식이여야 한다.
            items.length > 0 ?
            items.slice(items.length - 3).map(item => 
              // 얘를 hover 됐을 때 띄워줘야함
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

          <hr className="m-5"></hr>

          <Block className="p-8">
        <p className="text-xl" style={{color: "#F3EAD7"}}>세일상품</p>
        <List className="overflow-scroll flex flex-row">
          {
            // ListItem을 커스텀할 수 있는 방법??
            items.length > 0 ?
            items.filter(item => item.status === 'sale').map(item => 
              // 얘를 hover 됐을 때 띄워줘야함
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

      {/* <List>
        <ListItem link="/about/" title="About"/>
      </List> */}

    </Page>
  };
export default HomePage;