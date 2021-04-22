import React, { useState } from "react";
import {
  f7,
  Navbar,
  Page,
  List,
  ListInput,
  ListItem,
  Row,
  Col,
} from "framework7-react";
import { signup } from "@/common/api";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast, sleep } from "../../../js/utils.js";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userState } from "../../../recoil/state.js";
import { getToken, saveToken } from "../../../common/auth";
import "../../../css/app.less";
import { useCookies } from "react-cookie";

// Yup는 쉽게 validation check를 하게 도와준다
const SignUpSchema = Yup.object().shape({
  name: Yup.string().required("필수 입력사항 입니다"),
  email: Yup.string().email().required("필수 입력사항 입니다"),
  password: Yup.string()
    .min(4, "길이가 너무 짧습니다")
    .max(50, "길이가 너무 깁니다")
    .required("필수 입력사항 입니다"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "비밀번호가 일치하지 않습니다.")
    .required("필수 입력사항 입니다"),
});

const SignUpPage = () => {
  const [info, handleUserState] = useRecoilState(userState);

  return (
    <Page
      noToolbar
      style={{
        color: "#F3EAD7",
        backgroundColor: "#02111b",
      }}
    >
      <Navbar title="회원가입" backLink={true} sliding={false}></Navbar>
      {/* <p className="font-semibole text-4xl text-center mt-5">회원가입</p> */}
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
        }}
        validationSchema={SignUpSchema}
        onSubmit={async (values) => {
          const { data } = await axios.post(
            `${process.env.API_URL}/signup`,
            values
          );

          await saveToken({ token: data.accToken, csrf: null });

          f7.dialog.preloader("잠시만 기다려주세요...");
          setTimeout(() => {
            location.replace("/");
          }, 700);
        }}
        validateOnMount={true}
      >
        {({
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          isSubmitting,
          isValid,
        }) => (
          <Form>
            <List noHairlinesMd>
              <div className="p-3 font-semibold">기본 정보</div>
              <ListInput
                label={i18next.t("login.name")}
                style={{
                  backgroundColor: "#02111b",
                  color: "#F3EAD7",
                }}
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                errorMessageForce={true}
                errorMessage={touched.name && errors.name}
              />
              <ListInput
                label={i18next.t("login.email")}
                style={{
                  backgroundColor: "#02111b",
                  color: "#F3EAD7",
                }}
                type="email"
                name="email"
                placeholder="이메일을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errorMessageForce={true}
                errorMessage={touched.email && errors.email}
              />
              <ListInput
                label={i18next.t("login.password")}
                style={{
                  backgroundColor: "#02111b",
                  color: "#F3EAD7",
                }}
                type="password"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                errorMessageForce={true}
                errorMessage={touched.password && errors.password}
              />
              <ListInput
                label={i18next.t("login.password_confirmation")}
                style={{
                  backgroundColor: "#02111b",
                  color: "#F3EAD7",
                }}
                type="password"
                name="password_confirmation"
                placeholder="비밀번호를 확인해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password_confirmation}
                errorMessageForce={true}
                errorMessage={
                  touched.password_confirmation && errors.password_confirmation
                }
              />
            </List>
            <div className="p-4">
              <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isSubmitting || !isValid}
                type="submit"
              >
                회원가입
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  );
};

export default SignUpPage;
