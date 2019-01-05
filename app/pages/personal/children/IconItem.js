import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import Icons from "react-native-vector-icons/Ionicons";
import globalStyle from "../../../globalStyle";
import { IMG_TYPE, IMAGE_PATH } from "../../../utility/dict";
const defaultSource = IMAGE_PATH + "default" + IMG_TYPE;
export default class extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    src: PropTypes.string,
    isSelected: PropTypes.bool,
    onPress: PropTypes.func,
    style: PropTypes.object
  };
  componentDidMount() {}

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.src !== this.props.src ||
      nextProps.isSelected !== this.props.isSelected
    );
  }
  render() {
    let { src, onPress, isSelected, style } = this.props;
    style = style || {};
    let opacity = isSelected ? 1 : 0;
    let selectedStyle = isSelected
      ? {
          borderColor: globalStyle.color.primary
        }
      : {};
    return (
      <TouchableOpacity
        style={[
          {
            width: 100,
            height: 100,
            borderRadius: 100,
            borderWidth: 3,
            borderColor: "transparent",
            overflow: "hidden",
            margin: 10
          },
          selectedStyle,
          style
        ]}
        activeOpacity={1}
        onPress={() => {
          onPress && onPress(src);
        }}
      >
        <Image
          source={{ uri: src }}
          defaultSource={{ uri: defaultSource }}
          style={{ width: "100%", height: "100%" }}
        />
      </TouchableOpacity>
    );
  }
}
