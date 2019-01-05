/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import { ProgressBar } from "../components";
import { Button } from "native-base";

import { utility } from "../utility";

export default class extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  testCutDown() {
    this.setState({
      cutDown1Over: false,
      cutDown2Over: false,
      cutDown3Over: false,
      cutDown4Over: false,
      cutDown5Over: false
    });
    this.refs.progressCutDown1.cutDownStart();
    this.refs.progressCutDown2.cutDownStart();
    this.refs.progressCutDown3.cutDownStart();
    this.refs.progressCutDown4.cutDownStart();
    this.refs.progressCutDown5.cutDownStart();
    this.refs.progressCutDown6.cutDownStart();
  }
  render() {
    return (
      <View style={styles.container}>
        <ProgressBar progress={10} />
        <View style={{ width: 200 }}>
          <ProgressBar progress={10} />
        </View>
        <View style={{ width: "100%", height: 300, alignItems: "center" }}>
          <Button
            style={styles.btn}
            onPress={() => {
              this.testCutDown();
            }}
          >
            <Text style={{ color: "#fff" }}>测试倒计时</Text>
          </Button>
          <ProgressBar progress={10} />
          <View
            style={{
              width: 150,
              flexDirection: "row"
            }}
          >
            <View style={styles.progressContainer}>
              <ProgressBar
                ref="progressCutDown1"
                cutDownMode
                onCutDownOver={() => {
                  this.setState({
                    cutDown1Over: true
                  });
                }}
              />
            </View>
            <Text
              style={{
                width: 100
              }}
            >
              测试1：{this.state.cutDown1Over ? "over" : "..."}{" "}
            </Text>
          </View>
          <View style={{ width: 200, flexDirection: "row" }}>
            <View style={styles.progressContainer}>
              <ProgressBar
                ref="progressCutDown2"
                cutDownMode
                onCutDownOver={() => {
                  this.setState({
                    cutDown2Over: true
                  });
                }}
              />
            </View>
            <Text style={{ width: 100 }}>
              测试1：{this.state.cutDown2Over ? "over" : "..."}{" "}
            </Text>
          </View>
          <View style={{ width: 300, flexDirection: "row" }}>
            <View style={styles.progressContainer}>
              <ProgressBar
                ref="progressCutDown3"
                cutDownMode
                onCutDownOver={() => {
                  this.setState({
                    cutDown3Over: true
                  });
                }}
              />
            </View>
            <Text style={{ width: 100 }}>
              测试1：{this.state.cutDown3Over ? "over" : "..."}{" "}
            </Text>
          </View>
          <View style={{ width: 400, flexDirection: "row" }}>
            <View style={styles.progressContainer}>
              <ProgressBar
                ref="progressCutDown4"
                cutDownMode
                onCutDownOver={() => {
                  this.setState({
                    cutDown4Over: true
                  });
                }}
              />
            </View>
            <Text style={{ width: 100 }}>
              测试1：{this.state.cutDown4Over ? "over" : "..."}{" "}
            </Text>
          </View>
          <View style={{ width: 500, flexDirection: "row" }}>
            <View style={styles.progressContainer}>
              <ProgressBar
                ref="progressCutDown5"
                cutDownMode
                onCutDownOver={() => {
                  this.setState({
                    cutDown5Over: true
                  });
                }}
              />
            </View>
            <Text style={{ width: 100 }}>
              测试1：{this.state.cutDown5Over ? "over" : "..."}{" "}
            </Text>
          </View>
          <View style={{ width: 600, flexDirection: "row" }}>
            <View style={styles.progressContainer}>
              <ProgressBar
                ref="progressCutDown6"
                duration={3000}
                cutDownMode
                onCutDownOver={() => {
                  this.setState({
                    cutDown6Over: true
                  });
                }}
              />
            </View>
            <Text style={{ width: 100 }}>
              测试1：{this.state.cutDown6Over ? "over" : "..."}{" "}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  btn: {
    alignSelf: "center",
    width: 160,
    height: 50,
    borderRadius: 10,
    justifyContent: "center"
  },
  progressContainer: {
    flex: 1
  }
});
