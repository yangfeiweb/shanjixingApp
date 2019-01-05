import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  ScrollView,
  Animated,
  Dimensions
} from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Button } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import RNFetchBlob from "react-native-fetch-blob";
import Sound from "react-native-sound";
import { SoundManage, utility } from "../../../utility";
import commonStyle from "../../../globalStyle";

const dirs = RNFetchBlob.fs.dirs;
const courseRoot = dirs.DocumentDir + "/course/";

const colors = [
  "#946E02",
  "#008B2D",
  "#0076AA",
  "#660066",
  "#081189",
  "#000000",
  "#FF0000"
];

let soundManage = new SoundManage();

export default class WordInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wordData: null,
      // showAnswer: false,
      wordTransY: new Animated.Value(-300),
      // detailsOpacity: new Animated.Value(0),
      error: false
    };
  }

  _renderSummaryText() {
    let summary;
    if (this.props.showAnswer || this.props.previewing) {
      summary = this.state.wordData && this.state.wordData.content3;
    } else {
      summary = this.state.wordData && this.state.wordData.content8;
    }

    if (summary) {
      let summarys = summary.split("<br />");
      return summarys.map((item, idx) => {
        return (
          <Text key={"summary_" + idx} style={styles.summaryText}>
            {item}
          </Text>
        );
      });
    }
  }
  _renderDetailsText() {
    let detail = this.state.wordData && this.state.wordData.content4;
    if (detail) {
      let details = detail.split("<br />");
      return details.map((item, idx) => {
        return (
          <Text key={"detail_" + idx} style={styles.textItem}>
            {item}
          </Text>
        );
      });
    }
  }
  _renderExtendText() {
    let extendInfo = this.state.wordData && this.state.wordData.content6;
    if (extendInfo) {
      let extendInfos = extendInfo.split("<br />");
      return extendInfos.map((item, idx) => {
        return (
          <Text key={"extend_" + idx} style={styles.textItem}>
            {item}
          </Text>
        );
      });
    }
  }
  setWordData(data, forceAnimate, fromHistory) {
    let lastData = this.state.wordData;
    let soundFile = data.content7;
    if (fromHistory) {
      data.currErrStatus = data.historyErrStatus;
    } else {
      data.currErrStatus = data.errStatus;
    }
    this.setState({
      // showAnswer: showAnswer || false,
      error: false,
      wordData: data
    });

    if (this.wordSound) {
      this.wordSound.release();
    }
    soundFile && this.initSound(soundFile);

    let animateArr = [];
    if (lastData) {
      // animateArr.push(
      //   Animated.timing(this.state.detailsOpacity, {
      //     toValue: 0,
      //     duration: 1,
      //     useNativeDriver: true
      //   })
      // );
      if (forceAnimate) {
        animateArr.push(
          Animated.timing(this.state.wordTransY, {
            toValue: -300,
            duration: 1,
            useNativeDriver: true
          })
        );

        animateArr.push(
          Animated.spring(this.state.wordTransY, {
            toValue: 0,
            useNativeDriver: true
          })
        );
      }
    } else {
      // 显示summary
      animateArr.push(
        Animated.spring(this.state.wordTransY, {
          toValue: 0,
          useNativeDriver: true
        })
      );
    }

    Animated.sequence(animateArr).start();
    this.disableAnswer = false;
    // if (showAnswer) {
    //   this.showAnswer();
    // }
  }
  // showAnswer() {
  //   this.setState({ showAnswer: true });
  //   Animated.timing(this.state.detailsOpacity, {
  //     toValue: 100,
  //     duration: 2000,
  //     useNativeDriver: true
  //   }).start();
  // }
  initSound(src) {
    this.soundInited = false;
    let soundSrc = courseRoot + "voices";
    this.wordSound = new Sound(src, soundSrc, err => {
      if (!err) {
        this.soundInited = true;
        (this.props.autoPlayAudio || this.props.previewing) && this.playSound();
      }
    });
  }
  playSound() {
    this.wordSound &&
      this.wordSound.play(success => {
        if (success) {
          if (this.readTimes && this.readTimes > 1) {
            this.readTimes--;
            this.playSound();
          } else {
            this.previeResolve && this.previeResolve();
          }
        }
      });
  }
  preview(readTimes) {
    this.readTimes = readTimes;

    return new Promise((resolve, reject) => {
      this.previeResolve = resolve;
      this.previeReject = reject;
      if (this.soundInited) {
        this.playSound();
      } else {
        this.waitSoundTimer = setTimeout(() => {
          if (!this.soundInited) {
            reject();
          }
        }, 2000);
      }
    });
  }

  stopPreview() {
    this.readTimes = 0;
    this.previeResolve = null;
    this.previeReject = null;
  }
  getWordColor() {
    if (this.state.wordData) {
      if (this.props.previewing) {
        return { color: "#ff0000" };
      }
      let errStatus = this.state.wordData.historyErrStatus;
      if (errStatus === undefined) {
        errStatus = this.state.wordData.currErrStatus;
      }
      if (errStatus === 10) {
        return { color: "#ff0000" };
      } else {
        return { color: colors[errStatus] };
      }
    }
  }
  render() {
    return (
      <View style={styles.wordRoot}>
        <ScrollView>
          <TouchableOpacity
            onPress={() => {
              if (!this.props.previewing) {
                this.playSound();
              }
            }}
          >
            <Animated.View
              style={[
                styles.wordSummary,
                {
                  transform: [{ translateY: this.state.wordTransY }]
                }
              ]}
            >
              <Grid>
                <Col style={{ paddingLeft: 10 * utility.deviceRatio }}>
                  <Row style={{ height: 80 * utility.deviceRatio }}>
                    <Text style={[styles.wordTitle, this.getWordColor()]}>
                      {this.state.wordData && this.state.wordData.content1}
                    </Text>
                  </Row>
                  <Row style={{ height: 25 * utility.deviceRatio }}>
                    <Text style={styles.summaryText}>
                      {this.state.wordData && this.state.wordData.content2}
                    </Text>
                  </Row>
                  <Row>
                    <View>{this._renderSummaryText()}</View>
                  </Row>
                </Col>
                <Col
                  style={{
                    width: 180 * utility.deviceRatio,
                    alignItems: "center",
                    justifyContent: "center",
                    display: this.props.showAnswer ? "flex" : "none"
                  }}
                >
                  {this.state.wordData && (
                    <Image
                      style={[styles.bookImg]}
                      source={{
                        uri:
                          "file:///" +
                          courseRoot +
                          "images/" +
                          this.state.wordData.content5
                      }}
                    />
                  )}
                </Col>
              </Grid>
            </Animated.View>
          </TouchableOpacity>

          <View
            style={[
              styles.wordInfos,
              {
                display:
                  this.props.previewing || this.props.showAnswer
                    ? "flex"
                    : "none"
              }
            ]}
          >
            <Grid>
              <Col>
                {this._renderDetailsText()}
                <View
                  style={[
                    styles.extendInfo,
                    {
                      display:
                        this.state.wordData && this.state.wordData.content6
                          ? "flex"
                          : "none"
                    }
                  ]}
                >
                  {this._renderExtendText()}
                </View>
              </Col>
              <Col style={{ width: 170 * utility.deviceRatio }} />
            </Grid>
          </View>
          <View style={styles.footer} />
        </ScrollView>
        <View
          style={[
            styles.btnRow,
            {
              right: this.props.previewing
                ? -300 * utility.deviceRatio
                : 5 * utility.deviceRatio
              // display: this.props.previewing ? "none" : "flex"
            }
          ]}
        >
          <Grid>
            <Row>
              <Button
                style={[
                  styles.btn,
                  {
                    backgroundColor: commonStyle.color.primary,
                    display:
                      this.props.showAnswer || this.state.error
                        ? "none"
                        : "flex"
                  }
                ]}
                onPress={() => {
                  if (this.disableAnswer) {
                    return;
                  }
                  this.disableAnswer = true;
                  this.disableClick = false;
                  this.disableNext = false;
                  !this.props.disableAnswerAudio && soundManage.play("next");
                  this.props.onAnswer && this.props.onAnswer();
                }}
              >
                <Icon name="question-circle" style={styles.btnIcon} />
                <Text style={styles.btnText}>答案</Text>
              </Button>

              <Button
                style={[
                  styles.btn,
                  {
                    backgroundColor: commonStyle.color.success,
                    display:
                      this.props.showAnswer && !this.state.error
                        ? "flex"
                        : "none"
                  }
                ]}
                onPress={() => {
                  if (this.disableClick) {
                    return;
                  }
                  this.disableClick = true;
                  soundManage.play("success");
                  this.props.onSuccess && this.props.onSuccess();
                }}
              >
                <Icon name="check-circle" style={styles.btnIcon} />
                <Text style={styles.btnText}>正确/认识</Text>
              </Button>
              <Button
                style={[
                  styles.btn,
                  {
                    backgroundColor: commonStyle.color.lightRed,
                    borderWidth: 2 * utility.deviceRatio,
                    borderColor: commonStyle.color.lightRedBorder,
                    display: this.state.error ? "flex" : "none"
                  }
                ]}
                onPress={() => {
                  if (this.disableNext) {
                    return;
                  }
                  this.disableNext = true;
                  soundManage.play("next");
                  this.setState({
                    error: false
                  });
                  this.props.onNext && this.props.onNext();
                }}
              >
                <Icon
                  name="arrow-right"
                  style={[styles.btnIcon, { color: commonStyle.color.danger }]}
                />
                <Text
                  style={[styles.btnText, { color: commonStyle.color.danger }]}
                >
                  下一个
                </Text>
              </Button>
            </Row>
            <Row>
              <Button
                style={[
                  styles.btn,
                  {
                    backgroundColor: commonStyle.color.danger,
                    display:
                      this.props.showAnswer && !this.state.error
                        ? "flex"
                        : "none"
                  }
                ]}
                onPress={() => {
                  if (this.disableClick) {
                    return;
                  }
                  this.disableClick = true;
                  soundManage.play("error");
                  this.setState({
                    error: true
                  });
                  this.props.onError && this.props.onError();
                }}
              >
                <Icon name="times-circle" style={styles.btnIcon} />
                <Text style={styles.btnText}>错误/不认识</Text>
              </Button>
            </Row>
          </Grid>
        </View>
      </View>
    );
  }
  componentWillUnmount() {
    this.wordSound && this.wordSound.release();
    // this.answerSound && this.answerSound.release();
    // this.successSound && this.successSound.release();
    // this.errSound && this.errSound.release();
    this.waitSoundTimer && clearTimeout(this.waitSoundTimer);
  }
}

const styles = StyleSheet.create({
  wordRoot: {
    position: "relative",
    height: "100%",
    width: "100%"
  },
  wordTitle: {
    color: commonStyle.color.primary,
    height: "100%",
    fontSize: 55 * utility.deviceRatio
  },
  wordSummary: {
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10 * utility.deviceRatio,
    // minHeight: 150
    height: 200 * utility.deviceRatio
  },
  summaryText: {
    fontSize: 16 * utility.deviceRatio
  },
  wordInfos: {
    margin: 5 * utility.deviceRatio,
    marginTop: 15 * utility.deviceRatio,
    backgroundColor: "#fff",
    borderRadius: 10 * utility.deviceRatio,
    // height: 300,
    minHeight: 150 * utility.deviceRatio,
    padding: 10 * utility.deviceRatio
  },
  volumeIcon: {
    color: commonStyle.color.danger,
    fontSize: 46 * utility.deviceRatio,
    marginLeft: 10 * utility.deviceRatio
  },
  footer: {
    height: 20 * utility.deviceRatio
  },
  bookImg: {
    width: 150 * utility.deviceRatio,
    height: 150 * utility.deviceRatio
  },
  textItem: {
    marginTop: 5 * utility.deviceRatio,
    fontSize: 12 * utility.deviceRatio
  },
  extendInfo: {
    marginTop: 10 * utility.deviceRatio,
    borderTopColor: "lightgray",
    borderTopWidth: 1
  },
  btnRow: {
    position: "absolute",
    top: 225 * utility.deviceRatio,
    right: 5 * utility.deviceRatio,
    width: 170 * utility.deviceRatio,
    height: 140 * utility.deviceRatio,
    // flexDirection: "row",
    // justifyContent: "flex-end",
    alignItems: "flex-end"
    // margin: 10
  },
  btn: {
    alignSelf: "center",
    width: 160 * utility.deviceRatio,
    height: 50 * utility.deviceRatio,
    marginRight: 5 * utility.deviceRatio,
    borderRadius: 10 * utility.deviceRatio,
    justifyContent: "center"
  },
  btnText: {
    color: "#fff",
    fontSize: 20 * utility.deviceRatio
  },
  btnIcon: {
    marginRight: 5 * utility.deviceRatio,
    fontSize: 26 * utility.deviceRatio,
    color: "#fff"
  }
});
