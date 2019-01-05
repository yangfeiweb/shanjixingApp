import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from "react-native";

export default class extends React.Component {
  constructor(props) {
    super(props);
    let width = props.width ? props.width : 300;
    let backgroundColor = props.backgroundColor
      ? props.backgroundColor
      : "rgba(255,255,255,0.8)";
    this.state = {
      barWidth: width,
      backgroundColor: backgroundColor,
      barTransX: new Animated.Value(width * -1),
      rootTransY: new Animated.Value(-3000),
      hideDuration: props.duration ? props.duration : 1500
    };
  }
  show() {
    let showRootView = Animated.timing(this.state.rootTransY, {
      toValue: 0,
      duration: 10,
      useNativeDriver: true
    });
    let showBar = Animated.spring(this.state.barTransX, {
      toValue: 0,
      useNativeDriver: true
    });
    let animateArr = [showRootView, showBar];
    if (this.props.autoClose) {
      animateArr.push(
        Animated.timing(this.state.barTransX, {
          toValue: this.state.barWidth * -1,
          duration: 200,
          delay: this.state.hideDuration,
          useNativeDriver: true
        })
      );
      animateArr.push(
        Animated.timing(this.state.rootTransY, {
          toValue: -3000,
          duration: 1,
          useNativeDriver: true
        })
      );
      setTimeout(() => {
        this.props.onHide && this.props.onHide();
      }, this.state.hideDuration);
    }
    Animated.sequence(animateArr).start();
  }
  hide() {
    let hideBar = Animated.timing(this.state.barTransX, {
      toValue: this.state.barWidth * -1,
      duration: 200,
      useNativeDriver: true
    });

    let hideRoot = Animated.timing(this.state.rootTransY, {
      toValue: -3000,
      duration: 1,
      useNativeDriver: true
    });

    let animateArr = [hideBar, hideRoot];
    Animated.sequence(animateArr).start();
    this.props.onHide && this.props.onHide();
  }

  componentDidMount() {}
  render() {
    return (
      <Animated.View
        style={[
          styles.drawerRoot,
          {
            transform: [{ translateY: this.state.rootTransY }]
          }
        ]}
      >
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: this.state.barTransX }],
              width: this.state.barWidth,
              backgroundColor: this.state.backgroundColor
            }
          ]}
        >
          {this.props.children}
        </Animated.View>
        <TouchableWithoutFeedback
          onPress={() => {
            this.hide();
          }}
        >
          <View
            style={{
              position: "absolute",
              left: this.state.barWidth,
              right: 0,
              height: "100%"
            }}
          />
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  drawerRoot: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.3)"
  },
  drawer: {
    height: "100%"
  }
});
