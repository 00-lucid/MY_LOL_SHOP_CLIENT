import {
  Block,
  BlockTitle,
  Button,
  Col,
  Link,
  List,
  ListItem,
  Navbar,
  NavLeft,
  NavRight,
  NavTitle,
  Page,
  Row,
  Searchbar,
  Card,
  Fab,
  FabButton,
  FabButtons,
  Icon,
  TextEditor,
  ListInput,
} from "framework7-react";
import React from "react";
import "../css/app.less";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  basketState,
  contactsState,
  isContactState,
  selectContactsState,
} from "../recoil/state";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { getToken } from "../common/auth";

// custom component
const SignInSchema = Yup.object().shape({
  password: Yup.string()
    .min(4, "길이가 너무 짧습니다")
    .max(50, "길이가 너무 깁니다")
    .required("필수 입력사항 입니다"),
});

const ConfigPwPage = () => {
  return (
    <>
      <Page
        style={{
          color: "#F3EAD7",
        }}
      >
        <Navbar sliding={false} backLink>
          <NavTitle title="비밀번호 수정"></NavTitle>
        </Navbar>

        <Formik
          initialValues={{ password: "", newPassword: "" }}
          validationSchema={SignInSchema}
          onSubmit={async (values) => {
            if (values.password !== values.newPassword) {
              const { data } = await axios.post(
                "https://localhost:3000/config-pw",
                values,
                {
                  headers: {
                    authorization: `Bearer ${getToken().token}`,
                  },
                }
              );

              location.replace("/");
            }
          }}
          validateOnMount={true}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            isValid,
          }) => (
            <form onSubmit={handleSubmit}>
              <List>
                <ListInput
                  label={i18next.t("login.password")}
                  name="password"
                  style={{
                    backgroundColor: "#02111b",
                  }}
                  type="password"
                  placeholder="현재 비밀번호를 입력해주세요."
                  clearButton
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  errorMessageForce={true}
                  errorMessage={touched.password && errors.password}
                />
                <ListInput
                  label={i18next.t("login.password")}
                  name="newPassword"
                  style={{
                    backgroundColor: "#02111b",
                  }}
                  type="password"
                  placeholder="새로운 비밀번호를 입력해주세요."
                  clearButton
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.newPassword}
                  errorMessageForce={true}
                  errorMessage={touched.password && errors.password}
                />
              </List>
              <div className="p-1">
                <button
                  type="submit"
                  className="button button-fill button-large disabled:opacity-50"
                  disabled={isSubmitting || !isValid}
                >
                  변경
                </button>
              </div>
            </form>
          )}
        </Formik>
      </Page>
    </>
  );
};
export default ConfigPwPage;
