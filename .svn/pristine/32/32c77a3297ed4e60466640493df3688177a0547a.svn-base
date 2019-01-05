import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  AsyncStorage
} from "react-native";
import { Header, LeftUserInfo } from "../../components";
import { withNavigation, NavigationActions } from "react-navigation";
import Icons from "react-native-vector-icons/Ionicons";

import globalStyle from "../../globalStyle";
const { width, height } = Dimensions.get("window");
class WordTest extends Component {
  constructor(props) {
    super(props);
    this.currItem = null;
    this.isClick = false;
    this.timer = null;
    this.typeScore = 211;
    this.selectGradeText = "综合测试";
    this.grade = "grade1";
    this.max = 8500;
    this.min = 6500;
    this.IconButtons = [
      {
        name: "logo-windows",
        label: "综合测试",
        value: "grade1",
        typeScore: 211,
        max: 8500,
        min: 6500
      },
      // 800-1000
      {
        name: "md-person",
        label: "小学",
        value: "grade2",
        typeScore: 29,
        max: 1000,
        min: 800
      },
      {
        name: "md-people",
        label: "中学",
        value: "grade3",
        typeScore: 57,
        max: 2500,
        min: 1700
      },
      {
        name: "ios-people",
        label: "高中",
        value: "grade7",
        typeScore: 77,
        max: 4000,
        min: 3500
      },
      {
        name: "md-book",
        label: "大学",
        value: "grade9",
        typeScore: 113,
        max: 6000,
        min: 4000
      },

      {
        name: "ios-plane",
        label: "出国",
        value: "grade10",
        typeScore: 189,
        number: 6225,
        max: 6000,
        min: 4500
      }
    ];
  }
  state = {
    index: 0
  };
  selectGrade(index) {
    let item = this.IconButtons[index];
    this.selectGradeText = item.label;
    this.typeScore = item.typeScore;
    this.grade = item.value;
    this.max = item.max;
    this.min = item.min;
    this.setState({ index: index });
  }
  beginTest() {
    //开始测试按钮
    if (!this.grade) {
      ToastAndroid.showWithGravity("请选择测试等级", 2000, ToastAndroid.CENTER);
      return;
    }
    if (this.isClick) {
      //为防止多次点击
      return;
    }
    this.connotClick();
    this.props.navigation.navigate({
      routeName: "WordTest",
      params: {
        name: this.selectGradeText,
        grade: this.grade,
        typeScore: this.typeScore,
        max: this.max,
        min: this.min
      }
    });
  }
  connotClick() {
    this.isClick = true;
    this.timer = setTimeout(() => {
      this.timer && clearTimeout(this.timer);
      this.isClick = false;
    }, 1000);
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.index !== this.state.index;
  }
  
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header title="词汇测试">
          <LeftUserInfo slot="left" />
        </Header>
        <View style={styles.container}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ height: "100%" }}
            contentContainerStyle={{
              justifyContent: "center",
              height: "100%",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <Text style={styles.title}>英语词汇量测试</Text>
            <View style={styles.IconButtons}>
              {this.IconButtons.map((item, index) => (
                <View style={{ marginTop: 15, width: 120 }} key={index}>
                  <Icons.Button
                    underlayColor="#fff"
                    name={item.name}
                    color={
                      this.state.index === index
                        ? globalStyle.color.primary
                        : "#CDCDCD"
                    }
                    backgroundColor="#ffffff"
                    onPress={() => {
                      this.selectGrade(index);
                    }}
                    style={
                      this.state.index === index
                        ? styles.btnWidth
                        : { padding: 10 }
                    }
                  >
                    <Text
                      style={{
                        color:
                          this.state.index === index
                            ? globalStyle.color.primary
                            : "#989898"
                      }}
                    >
                      {item.label}
                    </Text>
                  </Icons.Button>
                </View>
              ))}
            </View>
            <TouchableOpacity
              onPress={this.beginTest.bind(this)}
              style={styles.beginTestBtn}
              activeOpacity={1}
            >
              <Text style={{ color: "#ffffff" }}>开始测试</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: "#98DBFF",
    fontSize: 20
  },
  IconButtons: {
    width: 400,
    flexWrap: "wrap",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "baseline",
    paddingVertical: 15
  },
  btnWidth: {
    borderWidth: 1,
    borderColor: "#56BDFF",
    padding: 9
  },
  beginTestBtn: {
    backgroundColor: "#56BDFF",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 80,
    marginTop: 20,
    alignItems: "center"
  }
});

export default withNavigation(WordTest);
