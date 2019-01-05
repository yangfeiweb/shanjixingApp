import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Spinner from "react-native-spinkit";
import commonStyle from "../globalStyle";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show
    };
  }
  show() {
    this.setState({
      show: true
    });
  }
  hide() {
    this.setState({
      show: false
    });
  }
  render() {
    return (
      <View
        style={[styles.loadingRoot, { width: this.state.show ? "100%" : 0 }]}
      >
        <Spinner
          size={this.props.size || 100}
          type={this.props.type || "Circle"}
          color={this.props.color || commonStyle.color.primary}
        />
        <Text
          style={[
            { display: this.props.hideTitle ? "none" : "flex" },
            styles.title
          ]}
        >
          {this.props.title || "加载中..."}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingRoot: {
    position: "absolute",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 15,
    elevation: 15
  },
  title: {
    marginTop: 30,
    fontSize: 20,
    color: "#fff"
  }
});
