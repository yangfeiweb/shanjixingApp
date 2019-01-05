import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  Easing
} from "react-native";
import { Card, CardItem, Body, Container, Content, Button } from "native-base";
import PropTypes from "prop-types";
import Icons from "react-native-vector-icons/FontAwesome";
import globalStyle from "../../../globalStyle";
// import VolumeButton from "./VolumeButton";
import Sound from "react-native-sound";
import RNFetchBlob from "react-native-fetch-blob";
const dirs = RNFetchBlob.fs.dirs;
const courseRoot = dirs.DocumentDir + "/course/";

/**
 * 生词本中每个单词项
 */
export default class CollapsedItem extends Component {
  constructor(props) {
    super(props);
    this.AnimatedOnLayout = this.AnimatedOnLayout.bind(this);
  }
  state = {
    sentence: [],
    style: {}
  };
  static propTypes = {
    content: PropTypes.object.isRequired,
    onRemove: PropTypes.func
  };
  componentDidMount() {
    this.splitSentence();
    let src = this.props.content.content7;
    let soundSrc = courseRoot + "voices";
    this.volume = new Sound(src, soundSrc, error => {
      if (error) {
        this.volume.reset();
        return;
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.sentence !== nextState.sentence ||
      this.state.style !== nextState.style
    ) {
      return true;
    }
    return false;
  }
  splitSentence() {
    const { content3, content4 } = this.props.content;
    let reg = /<\s*br\s*\/>/gi;
    let three = content3.split(reg);
    let four = content4.split(reg);
    let sentence = this.state.sentence.concat(three, four);
    this.setState({ sentence: sentence });
  }
  removeWord() {
    let { onRemove, index } = this.props;
    Animated.timing(this.state.style.height, {
      //动画 高度为零
      toValue: 0,
      duration: 200,
      easing: Easing.inOut(Easing.poly(5))
    }).start(() => {
      onRemove && onRemove(index); //动画完成后的回调
    });
  }
  AnimatedOnLayout(event) {
    if (!this.state.style.height) {
      let height = event.nativeEvent.layout.height;
      let style = {
        height: new Animated.Value(height)
      };
      this.setState({ style: style });
    }
  }
  playSound() {
    this.volume &&
      this.volume.play(success => {
        if (!success) {
          this.volume.reset();
        }
      });
  }
  componentWillUnmount() {
    this.volume && this.volume.release();
  }
  render() {
    const { onPress, index, content } = this.props;
    const { content1, content2, content7 } = content;
    return (
      <View>
        <Animated.View
          style={this.state.style}
          onLayout={this.AnimatedOnLayout}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => this.playSound()}
          >
            <Card>
              <CardItem style={styles.header} header>
                <View style={styles.header}>
                  <Text style={{ marginRight: 10, fontSize: 16 }}>
                    {content1}
                  </Text>
                  <Text style={{ fontSize: 10 }}>{content2}</Text>
                </View>
                {/* <Icons name="remove" color={globalStyle.color.danger} size={25} style={styles.removeIocnBtn} onPress={this.removeWord.bind(this)}></Icons> */}
              </CardItem>
              <CardItem>
                <Body>
                  {this.state.sentence.map((item, index) => (
                    <Text key={index} style={{ fontSize: 10 }}>
                      {item}
                    </Text>
                  ))}
                </Body>
              </CardItem>
            </Card>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center"
    // justifyContent: "space-between",
    // paddingHorizontal: 10,
  },
  removeIocnBtn: {
    position: "absolute",
    right: 0,
    top: 0
  }
});
