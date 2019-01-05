import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export default class extends React.Component {
  constructor(props) {
    super(props);
    let height = props.height ? props.height : 80;
    let backgroundColor = props.backgroundColor
      ? props.backgroundColor
      : "rgba(255,255,255,0.9)";
    this.state = {
      barHeight: height,
      backgroundColor: backgroundColor,
      barTransY: new Animated.Value(0)
    };
  }
  show() {
    let showAnimate = Animated.spring(this.state.barTransY, {
      toValue: this.state.barHeight,
      useNativeDriver: true
    });
    let animateArr = [showAnimate];
    if (this.props.autoClose) {
      animateArr.push(
        Animated.spring(this.state.barTransY, {
          toValue: 0,
          delay: 500,
          useNativeDriver: true
        })
      );
    }
    Animated.sequence(animateArr).start();
  }
  hide(delay) {
    Animated.spring(this.state.barTransY, {
      toValue: 0,
      delay: delay || 0,
      useNativeDriver: true
    }).start();
  }

  componentDidMount() {
    // this.show && this.show();
  }
  render() {
    return (
      <Animated.View
        style={[
          styles.operateHeader,
          {
            top: this.state.barHeight * -1,
            transform: [{ translateY: this.state.barTransY }],
            height: this.state.barHeight,
            backgroundColor: this.state.backgroundColor
          }
        ]}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  operateHeader: {
    width: "100%",
    position: "absolute",
    borderBottomColor: "rgba(230,230,230,0.8)",
    borderBottomWidth: 1
  }
});
