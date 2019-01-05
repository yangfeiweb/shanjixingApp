import React from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";

/**
 * ProgressBar props
 *  1. barStyle :
 *      height  进度条高度，默认25
 *      width  进度条高度，默认 '100%'
 *      barColor  前景色，默认 #56BDFF
 *      bgColor 背景色，默认 lightgray
 *      borderRadius 圆角弧度，默认 10
 *      borderColor 边框颜色，默认 无
 *      textColor 文字颜色，默认 #fff
 *      fontSize 文字大小
 *      removeBarRadius true/false bar是否去掉显示圆角，默认false
 *      hideText 隐藏文字，默认false
 *  2. progress 进度
 *  3. cutDownMode 是否是倒计时模式
 *  4. duration 倒计时时间(单位ms), 默认5000 (ms)
 *  5. cutDownStart(): 开始倒计时
 *  6. cutDownStop(): 停止倒计时
 *  7. onCutDownOver() 结束回调方法 *
 *  8. onDidRender() 渲染完成回调方法 *
 *
 */
export default class extends React.Component {
  constructor(props) {
    super(props);
    let barStyle = {
      height: 25
    };
    let containerStyle = {
      height: 13,
      borderRadius: 10
    };
    let frontStyle = {
      backgroundColor: "#56BDFF",
      height: "100%",
      borderRadius: 10
    };
    let backStyle = {
      backgroundColor: "lightgray",
      height: "100%"
    };
    let textStyle = {
      color: "#fff"
    };
    let style = props.barStyle;
    if (style) {
      if (style.height) {
        barStyle.height = style.height;
        containerStyle.height = Math.ceil(style.height / 2);
      }
      if (style.width) {
        barStyle.width = style.width;
      }
      if (style.borderColor) {
        containerStyle.borderColor = style.borderColor;
        containerStyle.borderWidth = 1;
      }
      if (style.barColor) {
        frontStyle.backgroundColor = style.barColor;
      }
      if (style.bgColor) {
        backStyle.backgroundColor = style.bgColor;
      }
      if (style.borderRadius !== undefined) {
        containerStyle.borderRadius = style.borderRadius;
        frontStyle.borderRadius = style.borderRadius;
      }
      if (style.removeBarRadius) {
        frontStyle.borderRadius = 0;
      }
      if (style.textColor) {
        textStyle.color = style.textColor;
      }
      if (style.fontSize) {
        textStyle.fontSize = style.fontSize;
      }
    }
    this.barStyle = barStyle;
    this.containerStyle = containerStyle;
    this.frontStyle = frontStyle;
    this.backStyle = backStyle;
    this.textStyle = textStyle;
    this.progressW = 0;
    this.state = {
      offsetX: new Animated.Value(0),
      progressW: 0
    };
  }
  cutDownStart(isContinue) {
    this.startCutDown = false;
    this.startContinneCutDown = false;
    if (this.props.cutDownMode) {
      let animateArr = [];
      let duration = this.props.duration || 5000;
      if (!isContinue) {
        animateArr.push(
          Animated.timing(this.state.offsetX, {
            toValue: 0,
            easing: Easing.linear,
            duration: 1,
            useNativeDriver: true
          })
        );
        this.cutDownAnimate = Animated.timing(this.state.offsetX, {
          toValue: -1 * this.progressW,
          easing: Easing.linear,
          duration: duration,
          useNativeDriver: true
        });
        animateArr.push(this.cutDownAnimate);
        Animated.sequence(animateArr).start(() => {
          this.props.onCutDownOver && this.props.onCutDownOver();
        });
      } else {
        this.cutDownAnimate &&
          this.cutDownAnimate.start(() => {
            this.props.onCutDownOver && this.props.onCutDownOver();
          });
      }
    }
  }
  cutDownStop() {
    if (this.props.cutDownMode) {
      this.cutDownAnimate && this.cutDownAnimate.stop();
    }
  }

  _onLayout(event) {
    let { width } = event.nativeEvent.layout;
    this.progressW = Math.ceil(width);
  }
  componentDidMount() {
    this.props.onDidRender && this.props.onDidRender();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.progress !== this.props.progress ||
      nextState.offsetX._value !== this.state.offsetX._value
    );
  }
  render() {
    return (
      <View
        style={[styles.progressView, this.barStyle]}
        onLayout={this._onLayout.bind(this)}
      >
        <View style={[styles.container, this.containerStyle]}>
          <View style={[styles.progressBack, this.backStyle]} />
          <View
            style={[
              styles.positionFont,
              this.frontStyle,
              {
                width: this.props.cutDownMode
                  ? 0
                  : (this.props.progress &&
                    typeof this.props.progress === "number"
                      ? this.props.progress
                      : 0) + "%"
              }
            ]}
          />
          <Animated.View
            style={[
              styles.positionFont,
              this.frontStyle,
              {
                width: this.props.cutDownMode ? "100%" : 0,
                transform: [{ translateX: this.state.offsetX }]
              }
            ]}
          />
          <View
            style={[
              styles.textView,
              {
                width: this.props.cutDownMode ? 0 : "100%"
              }
            ]}
          >
            <Text style={this.textStyle}>{`${
              this.props.progress && typeof this.props.progress === "number"
                ? this.props.progress
                : 0
            }%`}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  progressView: {
    justifyContent: "center",
    position: "relative",
    width: "100%"
  },
  container: {
    position: "absolute",
    justifyContent: "center",
    width: "100%",
    overflow: "hidden"
  },
  textView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  progressBack: {
    position: "absolute",
    width: "100%"
  },
  positionFont: {
    position: "absolute"
  }
});
