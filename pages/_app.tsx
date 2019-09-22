import App, { Container } from "next/app";
import React from "react";
import { Provider } from "react-redux";
import { Store } from "redux";
import createStore from "../features/redux/store";
import withRedux from "next-redux-wrapper";
import Layout from "../components/Layout";
import { AppState } from "../features/redux/reducer";

type Props = { store: Store<AppState> };

class MyApp extends App<Props> {
  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    );
  }
}

export default withRedux(createStore)(MyApp);
