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
    ListInput,
    Checkbox,
} from 'framework7-react';
import React, { useState } from 'react';
import '../css/app.less';
import { useRecoilState, useRecoilValue } from 'recoil';
import { basketState, contactsState, isContactState, selectContactsState, isAddItemState, selectTagState, selectOptionState, itemState, allTagState, thumbnailState } from '../recoil/state';
import { Formik, Field, Form } from "formik";
import axios from 'axios';
import { getToken } from '../common/auth';

// custom component

const CreateItemPage = () => {
    const [view, setView] = useState(0);
    const [selectTag, handleSelectTag] = useRecoilState(selectTagState);
    const [selectOption, handleOption] = useRecoilState(selectOptionState);
    const [optionVal, handleOptionVal] = useState('');
    const [priceVal, handlePriceVal] = useState('');
    const tags = useRecoilValue(allTagState);

    const [imgBase64, setImgBase64] = useState('') // 업로드 될 이미지
    const [imgFile, setImgFile] = useState(null) // 파일 전송을 위한 state

    // const [thumbnail, handleThumbnail] = useRecoilState(thumbnailState);

    const removeOptionBox = (idx) => {
        console.log('remove');
        handleOption(old => {
            return [...old.slice(0, idx), ...old.slice(idx + 1)]
        })
    }

    const requestUpload = () => {
        // upload img
        console.log(imgFile);
        axios.post('https://localhost:3000/upload', {
            formData: imgFile,
        }, {
            headers: {
                authorization: `Bearer ${getToken().token}`
            }
        })
    }

    // const changeThumbnail = async (event) => {
    //     const reader = new FileReader();

    //     reader.onload = function(event) {
    //         let img = document.querySelector("#thumb");
    //         img.setAttribute("src", event.target.result);
    //         document.querySelector("#thumbnail").appendChild(img);
    //     }

    //     reader.readAsDataURL(event.target.files[0]);
    // }
    
    const changeImg = (event) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const base64 = reader.result;
            if (base64) {
              // 파일 base64 상태 업데이트
                setImgBase64(base64.toString()); 
                // url
                console.log(imgBase64);
            }
        }
        if (event.target.files[0]) {
            // 1. 파일을 읽어 버퍼에 저장
            reader.readAsDataURL(event.target.files[0]); 
            // 파일 상태 업데이트
            setImgFile(event.target.files[0]); 
            // file obj
            console.log(imgFile);
        }
    }

    const requestOption = () => {
        axios.post('https://localhost:3000/add-option', {
            option: selectOption,
        }, {
            headers: {
                authorization: `Bearer ${getToken().token}`
            }
        })
        .then(res => {
            console.log(res.data);
        })
    }

    const requestTag = () => {
        axios.post('https://localhost:3000/add-tag', {
            tag: selectTag,
        }, {
            headers: {
                authorization: `Bearer ${getToken().token}`
            }
        })
    }
    
    return (
        <>
        <Page name="write" >
            <Navbar title="상품추가" backLink/>
            <div id="thumbnail">
                {/* 썸네일 */}
                <img src={imgBase64} ></img>
            </div>
            <Formik
                    initialValues={{ name: '', price: '', file: {}, tag: []}}
                    onSubmit={async values => {
                        
                        console.log(values.file)

                        // // Blob object 를 data:URL 로 바꾸는 과정
                        // const reader = new FileReader();
                        // reader.readAsDataURL(values.file);

                        // const urlImg = await URL.createObjectURL(values.file);

                        // const img = JSON.stringify({
                        //     fileName: values.file.name,
                        //     type: values.file.type,
                        //     size: `${values.file.size} bytes`,
                        // }, null, 2);
                        
                        values.file = imgFile;
                        
                        console.log(values.file)

                        axios.post('http://localhost:3000/create-item', values, {
                            headers: {
                                authorization: `Bearer ${getToken().token}`
                            }
                        })
                        .then(() => {
                            requestOption();
                            requestTag();
                            requestUpload();
                        })
                        .then(res => {
                            location.replace('/');
                        })
                    }}
                >
            {({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid, setFieldValue }) => (
            <Form className="p-8">
                <List>
                    <div className="p-3 font-semibold bg-white">기본 정보</div>
                    <ListInput
                        type="text"
                        name="name"
                        placeholder="상품명"
                        clearButton
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        errorMessageForce={true}
                        errorMessage={touched.name && errors.name}
                    />
                    <input id="file" name="file" type="file" accept="image/*"
                        // onChange={(event) => { setFieldValue("file", event.currentTarget.files[0]) }}
                        onChange={(e) => {setFieldValue("file", e.currentTarget.files[0]); changeImg(e)}} 
                        // className="form-control" 
                    />
                    <img src />
                    {/* <ListInput
                        type="text"
                        name="img"
                        placeholder="이미지 주소"
                        clearButton
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.img}
                        errorMessageForce={true}
                        errorMessage={touched.name && errors.name}
                    /> */}
                    <ListInput
                        type="text"
                        name="price"
                        placeholder="가격"
                        clearButton
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.price}
                        errorMessageForce={true}
                        errorMessage={touched.name && errors.name}
                    />
                    <Block className="flex flex-row inline" style={{
                        color: "#F3EAD7",
                    }}>
                        <List className="overflow-scroll flex flex-row">
                            {
                                tags.map(tag => <Checkbox className="flex flex-row w-20" value = {`${tag.tag}`} onChange={(e) => {
                                    console.log(e.target.value);
                                    handleSelectTag(old => {
                                        console.log(old);
                                        if (old.includes(e.target.value)) {
                                            const index = old.indexOf(e.target.value);
                                            return [...old.slice(0, index), ...old.slice(index + 1)]
                                        } else {
                                            return [...old, e.target.value]
                                        }
                                        // if (old.includes({val: e.target.value})) {
                                        //     return [ ...old.splice(0, old.indexOf({val: e.target})), ...old.splice(old.indexOf({val: e.target}) + 1) ];
                                        // } else {
                                        //     return [...old, {val: e.target.value}];
                                        // }
                                    })
                                }}><p className="w-20">{tag.tag}</p></Checkbox>)
                            }
                        </List>
                            
                        {/* <Checkbox className="flex flex-row w-20" value="세트">세트</Checkbox> */}
                    </Block>
                    <Block>
                        {/* 옵션 생성 블럭 */}

                            {
                                selectOption.length &&
                                selectOption.map((box, idx) => {
                                    return <section className="p-4 mt-5" style={
                                        {
                                            borderColor: "#C79A3A",
                                            borderWidth: "1px",
                                            borderRadius: "10px",
                                        }
                                    }>
                                        <Button onClick={() => {removeOptionBox(idx)}} className="absolute right-0">
                                            <Icon ios="f7:multiply" aurora="f7:multiply" md="material:close"></Icon>
                                        </Button>
                                        <div className="bg-white text-black">{box.option}</div>
                                        <div className="bg-white text-black">{box.price}</div>
                                    </section>
                                })
                            }
                            {/* <input type="text" placeholder="옵션이름" className="w-full"></input>
                            <input type="text" placeholder="옵션가격" className="w-full"></input> */}
                            <List className="font-semibold bg-white">
                                <ListInput type="text" placeholder="옵션이름" className="w-full" onChange={(e) => {handleOptionVal(e.target.value)}}></ListInput>
                                <ListInput type="text" placeholder="옵션가격" className="w-full" onChange={(e) => {handlePriceVal(e.target.value)}}></ListInput>
                            </List>
                        {
                            optionVal && priceVal &&
                            <Button onClick={() => handleOption(old => {
                                return [...old, { id: old.length + 1, option: optionVal, price: priceVal}]
                            })}>옵션생성</Button>
                        }
                    </Block>
                    <div className="p-4">
                        <button 
                        type="submit" 
                        className="button button-fill button-large disabled:opacity-50"
                        onClick={() => {
                            // setView(1)
                            // setTimeout(() => {
                            //     requestOption();
                            //     requestTag();
                            // }, 500)
                        }} >
                            확인
                        </button>
                    </div>
                </List>
            </Form>
            )}
            </Formik>
        </Page>
        </>
    )
};
export default CreateItemPage;