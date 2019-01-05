import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icons from "react-native-vector-icons/FontAwesome";
import Sound from "react-native-sound";
import PropTypes from "prop-types";
import RNFetchBlob from "react-native-fetch-blob";

const dirs = RNFetchBlob.fs.dirs;
const courseRoot = dirs.DocumentDir + "/course/";

export default class VolumeButton extends Component {
  constructor(props) {
    super(props);
    this.names = ["volume-off", "volume-down", "volume-up"];
    this.volume = null;
  }
  static defaultProps = {
    size: 20,
    color: "#5CCBFF",
    src: ""
  };
  static propTypes = {
    src: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    onPress: PropTypes.func
  };
  state = {
    currIndex: 2
  };
  componentDidMount() {
    let soundSrc = courseRoot + "voices";
    this.volume = new Sound(this.props.src, soundSrc, error => {
      if (error) {
        this.volume.reset();
        return;
      }
    });
  }

  componentWillUnmount() {
    this.volume && this.volume.release();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.src !== this.props.src;
  }
  playSound() {
    this.volume &&
      this.volume.play(success => {
        if (!success) {
          this.volume.reset();
        }
      });
  }
  render() {
    const { color, size } = this.props;
    return (
      <Icons.Button
        name={this.names[this.state.currIndex]}
        size={size}
        color={color}
        onPress={this.playSound.bind(this)}
        backgroundColor="transparent"
      />
    );
  }
}
