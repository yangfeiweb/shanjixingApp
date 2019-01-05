/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from "react";
import { AppRegistry, StyleSheet, Text, View, Button } from "react-native";

import { utility } from "../utility";

import AnimatedSprite from "react-native-animated-sprite";
import monsterSprite from "../assets/images/sprites/monster/monsterSprite";

const sample = utility.arraySample;

export default class AnimatedSpriteExample extends React.Component {
  constructor() {
    super();
    this.state = {
      animationType: "WALK",
      tweenOptions: {}
    };
  }

  onPress() {
    //   alert(1)
    const animation = sample(monsterSprite.animationTypes);
    // debugger;
    this.setState({ animationType: animation });
  }

  tweenSprite() {
    const coords = this.refs.monsterRef.getCoordinates();
    const location = [0, 100, 200, 300, 400, 500];
    this.setState(
      {
        tweenOptions: {
          tweenType: "sine-wave",
          startXY: [coords.left, coords.top],
          xTo: [sample(location), sample(location)],
          yTo: [sample(location), sample(location)],
          duration: 1000,
          loop: false
        }
      },
      () => {
        this.refs.monsterRef_0_0.startTween();
      }
    );
  }
  renderSprite() {
    let count = 20;
    let j = 0;
    let data = [];
    for (let i = 0; i < count; i++) {
      if (i % 10 == 0) {
        j++;
      }
      data.push({
        i: i % 10,
        j: j
      });
    }
    return data.map(item => {
      return (
        <AnimatedSprite
          key={item.i + "_" + item.j}
          ref={"monsterRef_" + item.i + "_" + item.j}
          sprite={monsterSprite}
          animationFrameIndex={monsterSprite.animationIndex(
            this.state.animationType
          )}
          loopAnimation={true}
          coordinates={{
            top: 10 + item.j * 100,
            left: 20 + item.i * 100
          }}
          size={{
            width: monsterSprite.size.width * 1.65,
            height: monsterSprite.size.height * 1.65
          }}
          draggable={true}
          tweenOptions={this.state.tweenOptions}
          tweenStart={"fromMethod"}
          onPressOut={() => {
            this.onPress();
          }}
        />
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderSprite()}
        <Button
          onPress={() => {
            this.tweenSprite();
          }}
          title="Tween me!"
          color="#841584"
        />
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
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
