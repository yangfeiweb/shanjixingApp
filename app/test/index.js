import React from "react";
import { StackNavigator } from "react-navigation";
import testProgressBar from "./testProgressBar";
import testWordSpell from "./testWordSpell";

import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  StatusBar,
  AsyncStorage,
  DeviceEventEmitter,
  BackHandler
} from "react-native";

import { Button } from "native-base";

class testHome extends React.Component {
  constructor(props) {
    super(props);
    this.navBtns = [
      {
        name: "progress",
        nav: "testProgressBar"
      },
      {
        name: "wordSpell",
        nav: "testWordSpell"
      }
    ];
  }
  renderNavBtns() {
    return this.navBtns.map(item => {
      return (
        <Button
          key={item.name}
          style={styles.btn}
          onPress={() => {
            this.props.navigation.navigate(item.nav);
          }}
        >
          <Text style={styles.btnText}>{item.name}</Text>
        </Button>
      );
    });
  }

  render() {
    return <View style={{ height: "100%" }}>{this.renderNavBtns()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0
  },
  btn: {
    width: 100,
    height: 50,
    margin: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  btnText: {
    color: "#fff"
  }
});

const RootStack = StackNavigator(
  {
    testHome: {
      screen: testHome
    },
    testProgressBar: {
      screen: testProgressBar
    },
    testWordSpell: {
      screen: testWordSpell
    }
  },
  {
    initialRouteName: "testHome",
    headerMode: "none",
    mode: "modal"
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
