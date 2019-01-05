import React from "react";
import { StackNavigator } from "react-navigation"; // 1.0.0-beta.27
// import Orientation from "react-native-orientation";
import SplashScreen from "rn-splash-screen";
import IdleTimerManager from "react-native-idle-timer";
import Home from "./app/pages/Home";
import {
  Login,
  ForgetPwd,
  Registry,
  UserList,
  QuickLogin
} from "./app/pages/auth";
import { Learning, WordList, LearnTest } from "./app/pages/learn";
import WordTest from "./app/pages/wordTest/WordTest";
import Chart from "./app/pages/personal/Chart";
import ChangePwd from "./app/pages/personal/ChangePwd";
import ChangeUserInfo from "./app/pages/personal/ChangeUserInfo";
import WordsDetail from "./app/pages/wordBook/WordsDetail";
import TestResult from "./app/pages/learn/TestResult";
import TestResultDetail from "./app/pages/learn/TestResultDetail";
import test from "./app/test";

import { AsyncStorage } from "react-native";
import mainDB from "./app/db/mainDB";
import RNFetchBlob from "react-native-fetch-blob";
let dbSqlite = new mainDB();

const RootStack = StackNavigator(
  {
    Home: {
      screen: Home
    },
    Login: {
      screen: Login
    },
    ForgetPwd: {
      screen: ForgetPwd
    },
    Registry: {
      screen: Registry
    },
    UserList: {
      screen: UserList
    },
    Learning: {
      screen: Learning
    },
    WordTest: {
      screen: WordTest
    },
    WordList: {
      screen: WordList
    },
    WordsDetail: {
      screen: WordsDetail
    },
    Chart: {
      screen: Chart
    },
    ChangePwd: {
      screen: ChangePwd
    },
    ChangeUserInfo: {
      screen: ChangeUserInfo
    },
    TestResultDetail: {
      screen: TestResultDetail
    },
    TestResult: {
      screen: TestResult
    },
    LearnTest: {
      screen: LearnTest
    },
    test: {
      screen: test
    },
    QuickLogin: {
      screen: QuickLogin
    }
  },
  {
    initialRouteName: "QuickLogin",
    headerMode: "none",
    mode: "modal"
  }
);

export default class App extends React.Component {
  componentDidMount() {
    // dbSqlite.dropTable().then(res => dbSqlite.createTable());
    // dbSqlite.dropTable('exam_spell_details').then(res => dbSqlite.createTable());
    dbSqlite.createTable().then(res => {
      dbSqlite.modifyTables();
      dbSqlite.updateLearnType();
      dbSqlite
        .updataRecordExamType()
        .then(res => {})
        .catch(e => {});
    });
    SplashScreen.hide();
    IdleTimerManager.setIdleTimerDisabled(true);
    RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DocumentDir).then(files => {
      files.forEach(item => {
        if (item.indexOf(".apk") !== -1) {
          let apkPath = RNFetchBlob.fs.dirs.DocumentDir + "/" + item;
          RNFetchBlob.fs.unlink(apkPath);
        }
      });
    });
  }
  componentWillMount() {
    IdleTimerManager.setIdleTimerDisabled(false);
  }
  render() {
    return <RootStack />;
  }
}
