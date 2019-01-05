import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import Icons from "react-native-vector-icons/Ionicons";
import globalStyle from "../globalStyle";
import { utility } from "../utility";

export default class TopicItem extends Component {
  constructor(props) {
    super(props);
    let icons = ["ios-checkmark-circle", "ios-close-circle"];
  }
  state = {
    backgroundColor: "#fff",
    borderWidth: 1,
    textColor: "#2C2C2C",
    borderColor: "#8D8D8D",
    opacity: 0
  };
  static defaultProps = {
    disabled: false
  };

  static propTypes = {
    disabled: PropTypes.bool, //禁止点击
    content: PropTypes.object, //每一项内容
    right: PropTypes.bool, //这一项是否是正确答案
    result: PropTypes.func
  };
  onPress() {
    const { result, right, disabled, content } = this.props;
    if (!disabled) {
      this.setState({
        backgroundColor: right
          ? globalStyle.color.success
          : globalStyle.color.danger,
        borderWidth: 0,
        textColor: "#fff",
        opacity: 1
      });
      result && result({ isRight: right, selected: content.letter });
    }
  }
  showRight() {
    //显示正确的
    if (this.props.right) {
      this.setState({
        borderColor: globalStyle.color.success,
        opacity: 1
      });
    }
  }

  reset() {
    this.setState({
      backgroundColor: "#fff",
      borderWidth: 1,
      textColor: "#2C2C2C",
      borderColor: "#8D8D8D",
      opacity: 0
    });
  }
  render() {
    const { right, disabled, content } = this.props;
    let name = right ? "ios-checkmark-circle" : "ios-close-circle";
    let color = right ? globalStyle.color.success : globalStyle.color.danger;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.onPress.bind(this)}
          activeOpacity={1}
          style={[
            styles.button,
            {
              borderColor: this.state.borderColor,
              borderWidth: this.state.borderWidth,
              backgroundColor: this.state.backgroundColor
            }
          ]}
        >
          <Text
            style={{
              color: this.state.textColor,
              fontSize: 16 * utility.deviceRatio,
              marginRight: 5 * utility.deviceRatio
            }}
          >
            {content.letter}
          </Text>
          <Text
            style={{
              color: this.state.textColor,
              fontSize: 16 * utility.deviceRatio
            }}
            numberOfLines={1}
          >
            {content.topic}
          </Text>
        </TouchableOpacity>
        <Icons
          name={name}
          color={color}
          size={35}
          style={{
            marginLeft: 10 * utility.deviceRatio,
            opacity: this.state.opacity
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60 * utility.deviceRatio,
    marginBottom: 10 * utility.deviceRatio,
    flexDirection: "row",
    alignItems: "center"
  },
  button: {
    width: "90%",
    height: 50 * utility.deviceRatio,
    borderRadius: 10 * utility.deviceRatio,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20 * utility.deviceRatio
  }
});
