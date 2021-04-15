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
    Segmented,
    Gauge
} from 'framework7-react';
import React from 'react';
import '../css/app.less';
import { useRecoilState, useRecoilValue } from 'recoil';
import { basketState, contactsState, isContactState, selectContactsState, isPopWriteState, reviewGaugeState, textState } from '../recoil/state';
import axios from 'axios';
import { getToken } from '../common/auth';

// custom component
const TOSS = "https://pay.toss.im/api/v2/"

const ContactsPage = () => {
    // const [items, handleItems] = useRecoilState(basketState);
    const [contacts, handleContacts] = useRecoilState(contactsState);
    const [isContact, handleIsContact] = useRecoilState(isContactState);
    const [selectContacts, handleSelectContacts] = useRecoilState(selectContactsState);
    const [isPopWrite, handleIsPopWrite] = useRecoilState(isPopWriteState);
    const [reviewGauge, handleReviewGauge] = useRecoilState(reviewGaugeState);
    const [text, handleText] = useRecoilState(textState);

    const addSelect = (contact) => {
        console.log(contact);
        // 만약 취소 했을 경우는 제거 시켜줘야함 (취소 했을 경우 === 두번눌렀을 떄  or 중복된 값이 존재할 때)
        handleSelectContacts(old => {
            const checked = old.includes(contact);
            console.log(checked)
            if (!checked) {
                return [...old, contact]
            } else {
                return [...old.slice(0, checked), ...old.slice(checked + 1)]
            }
        })
        console.log(selectContacts)
    }

    const requestAddReview = () => {
        console.log(reviewGauge);
        axios.post('https://localhost:3000/add-review', {
            text: text,
            rate: reviewGauge,
            // contacts is obj
            contacts: selectContacts,
        }, {
            headers: {
                authorization: `Bearer ${getToken().token}`
            }
        })
        .then(res => {
            // location.replace('/');
            handleSelectContacts([]);
            location.replace('/');
        })
    }

    // const requestTossRefund = (amount) => {
    //     // 토스 환불
    //     axios.post(`${Toss}/refunds`, {
    //         "apiKey": "YOUR_API_KEY",
    //         "payToken": "결제할 때 받은 결제 건에 대한 token",
    //         "amount": amount,
    //         "amountTaxable": 5000,
    //         "amountTaxFree": 4000,
    //         "amountVat": 500,
    //         "amountServiceFee": 500
    //     })
    // }

    const cancelReview = () => {
        handleSelectContacts([]);
        location.replace('/');
    }
    return (
        <Page name="basket" >
            <Navbar sliding={false}>
                <NavTitle title="주문내역">
                </NavTitle>
            </Navbar>
            <List className="p-3">
                {   contacts.length > 0  && isContact && !isPopWrite?
                    contacts.map((contact, idx) => {
                        return (
                            <ListItem header={idx + 1} key={contact.id} title={contact.name} footer={`옵션: ${contact.optionBox} 수량: ${contact.countBox}개`} className="w-full items-center justify-center mb-0.5" style={{ color: '#F3EAD7', backgroundColor: '#02111b', borderWidth: '1px', borderColor: '#C79A3A'}} checkbox onClick={() => {addSelect(contact)}}>
                                <section className="flex flex-row w-full items-center">
                                <img src={contact.img} className="w-3/12"></img>
                                <section className="flex flex-row absolute right-10">
                                    <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5"></img>
                                    <p className="text-yellow-500  font-black">{contact.lineTotal}</p>
                                </section>
                                </section>
                            </ListItem>
                        )
                    })
                    : 
                    !isPopWrite ?
                    contacts.map((contact, idx) => {
                        return (
                            <ListItem header={idx + 1} key={contact.id} title={contact.name} footer={`옵션: ${contact.optionBox} 수량: ${contact.countBox}개`} className="w-full items-center justify-center mb-0.5" style={{ color: '#F3EAD7', backgroundColor: '#02111b', borderWidth: '1px', borderColor: '#C79A3A'}}>
                                <section className="flex flex-row w-full items-center">
                                <img src={contact.img} className="w-3/12"></img>
                                <section className="flex flex-row absolute right-10">
                                    <img src="https://cdn.gamermarkt.com/files/images/lol/other/rp_logo.png" className="w-5 h-5"></img>
                                    <p className="text-yellow-500  font-black">{contact.lineTotal}</p>
                                </section>
                                </section>
                            </ListItem>
                        )
                    })
                    :
                    null
                }
                {
                    isPopWrite && selectContacts.length > 0 ? 
                    <section className="flex flex-col">
                        <div className="flex flex-row items-center justify-center m-20">
                        <Block strong className="text-align-center">
                        <Gauge
                            type="circle"
                            value={reviewGauge}
                            size={250}
                            borderColor="#2196f3"
                            borderWidth={10}
                            valueText={`${reviewGauge * 100}%`}
                            valueFontSize={41}
                            valueTextColor="#2196f3"
                            labelText="만족도"
                            className="m-4"
                        />
                        <Segmented tag="p" raised>
                            <Button active={reviewGauge === 0} onClick={() => handleReviewGauge(0.2)}>
                                1점
                            </Button>
                            <Button active={reviewGauge === 0.25} onClick={() => handleReviewGauge(0.4)}>
                                2점
                            </Button>
                            <Button active={reviewGauge === 0.5} onClick={() => handleReviewGauge(0.6)}>
                                3점
                            </Button>
                            <Button active={reviewGauge === 0.75} onClick={() => handleReviewGauge(0.8)}>
                                4점
                            </Button>
                            <Button active={reviewGauge === 1} onClick={() => handleReviewGauge(1.0)}>
                                5점
                            </Button>
                        </Segmented>
                        </Block>
                        </div>
                        <TextEditor
                            placeholder="Enter text..."
                            mode="popover"
                            buttons={['bold', 'italic', 'underline', 'strikeThrough']}
                            style={{ '--f7-text-editor-height': '150px' }}
                            onTextEditorChange={(value) => {console.log(value); handleText(value)}}
                        />
                        <div className="flex flex-row justify-center">
                            <Button text="취소" onClick={cancelReview}></Button>
                            <Button text="전송" onClick={requestAddReview}></Button>
                        </div>
                    </section>
                    :
                    null
                }
            </List>
            {
                !isPopWrite ?
            <Fab position="right-bottom" slot="fixed" color="red" onClick={() => {handleSelectContacts(() => []); handleIsContact(old => !old)}}>
            <Icon ios="f7:plus" aurora="f7:plus" md="material:add"></Icon>
            <Icon ios="f7:xmark" aurora="f7:xmark" md="material:close"></Icon>
                <FabButtons position="top">
                    <Link tabLink="#view-write" href="/write" href="/write"><FabButton label="환불하기"><Icon ios="f7:doc_plaintext" aurora="f7:doc_plaintext"></Icon></FabButton></Link>
                    <button onClick={() => {
                        console.log(selectContacts)
                        if (selectContacts.length) {
                            handleIsPopWrite(old => !old)
                        } else {
                            alert('적어도 1개 이상 선택하세요')
                        }
                    }}><FabButton label="리뷰하기"><Icon ios="f7:bubble_right" aurora="f7:bubble_right"></Icon></FabButton></button>
                </FabButtons>
            </Fab>
            :
            null
            }
        </Page>
    )
};
export default ContactsPage;