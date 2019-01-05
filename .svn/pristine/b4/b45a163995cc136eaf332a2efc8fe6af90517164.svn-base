import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  FlatList,
  AsyncStorage
} from "react-native";
import { Content, Button } from "native-base";
import { Header } from "../../components";
import learningDB from "../../db/learningDB";
import commonStyle from "../../globalStyle";
import { utility } from "../../utility";
import { EXAM_TYPE } from "../../utility/dict";
export default class extends React.Component {
  constructor(props) {
    super(props);
    let examData = props.navigation.state.params.testData;
    let examType = examData.examType;
    this.isSpell =
      examType === EXAM_TYPE.COLUMN_WORD_SPELL_AFTER ||
      examType === EXAM_TYPE.COLUMN_WORD_SPELL_BEFORE;
    this.state = {
      userName: null,
      dataList: [],
      testData: examData,
      examType: examType
    };
    this.renderItem = this.renderItem.bind(this);
  }
  // 测试用时
  useTime() {
    let date1 = new Date(this.state.testData.startTime.replace(/\-/g, "/"));
    let date2 = new Date(this.state.testData.finishedTime.replace(/\-/g, "/"));
    let s1 = date1.getTime();
    let s2 = date2.getTime();
    let totalTime = (s2 - s1) / 1000;
    let day = parseInt(totalTime / (24 * 60 * 60)); //计算整数天数
    let afterDay = totalTime - day * 24 * 60 * 60; //取得算出天数后剩余的秒数
    let hour = parseInt(afterDay / (60 * 60)); //计算整数小时数
    let afterHour = totalTime - day * 24 * 60 * 60 - hour * 60 * 60; //取得算出小时数后剩余的秒数
    let min = parseInt(afterHour / 60); //计算整数分
    let afterMin = totalTime - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60; //取得算出分后剩余的秒数
    return (
      <Text>
        用时：{min} 分 {afterMin} 秒
      </Text>
    );
  }
  //获取数据
  getData() {
    if (this.isSpell) {
      //拼写
      learningDB.getSpellExamDetails(this.state.testData.id).then(res => {
        let data = res.raw();
        this.setState({ dataList: data });
      });
    } else {
      //辩音和认读
      learningDB.getExamDetails(this.state.testData.id).then(res => {
        res.raw().forEach(e => {
          if (!e.answerItem || e.answerItem == "none") {
            e.answerItem = "_";
          }
        });
        this.setState({ dataList: res.raw() });
      });
    }
  }
  componentDidMount() {
    utility.getCurrUserInfo().then(item => {
      if (item) {
        this.setState({
          userName: item.name || item.mobile || ""
        });
      }
    });
    // utility.getUsersInfo().then(res => {
    //   let currUserInfo = res.currUserInfo;
    //   this.setState({
    //     userName: currUserInfo.name || currUserInfo.mobile || ""
    //   });
    // });
    this.getData();
  }
  renderOtherDetail(item, index) {
    return (
      <View key={index} style={styles.item}>
        <Text style={{ width: 30 }}>{index + 1}</Text>
        <Text
          style={{
            width: "5%",
            color: item.answerItem === item.rightItem ? "green" : "red"
          }}
        >
          [ {item.answerItem} ]
        </Text>
        <Text
          style={[
            styles.word,
            {
              color: item.answerItem === item.rightItem ? "green" : "red"
            }
          ]}
        >
          {item.wordName}
        </Text>
        <Text
          style={[
            styles.choiceText,
            { color: item.rightItem === "A" ? "green" : "#333" }
          ]}
        >
          A {item.itemA}
        </Text>
        <Text
          style={[
            styles.choiceText,
            { color: item.rightItem === "B" ? "green" : "#333" }
          ]}
        >
          B {item.itemB}
        </Text>
        <Text
          style={[
            styles.choiceText,
            { color: item.rightItem === "C" ? "green" : "#333" }
          ]}
        >
          C {item.itemC}
        </Text>
        <Text
          style={[
            styles.choiceText,
            { color: item.rightItem === "D" ? "green" : "#333" }
          ]}
        >
          D {item.itemD}
        </Text>
      </View>
    );
  }
  renderSpellDetail(item, index) {
    let isRight = item.isCorrect === "Y";
    return (
      <View style={styles.item} key={index}>
        <View style={[{ width: "10%" }, styles.textCenter]}>
          <Text>{index + 1}</Text>
        </View>
        <View style={[styles.textCenter, { flex: 1 }]}>
          <Text numberOfLines={1}>{item.chinese}</Text>
        </View>
        <View style={[styles.textCenter, { width: "20%" }]}>
          <Text
            style={{
              color: isRight
                ? commonStyle.color.danger
                : commonStyle.color.success
            }}
          >
            {item.answer || ""}
          </Text>
        </View>
        <View style={[styles.textCenter, { width: "20%" }]}>
          <Text>{item.word}</Text>
        </View>
      </View>
    );
  }
  ListHeaderComponent() {
    if (this.isSpell) {
      return (
        <View style={styles.item}>
          <View style={[{ width: "10%" }, styles.textCenter]}>
            <Text>序号</Text>
          </View>
          <View style={[styles.textCenter, { flex: 1 }]}>
            <Text>词义</Text>
          </View>
          <View style={[styles.textCenter, { width: "20%" }]}>
            <Text>我的拼写</Text>
          </View>
          <View style={[styles.textCenter, { width: "20%" }]}>
            <Text>正确拼写</Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
  renderItem({ item, index }) {
    if (this.isSpell) {
      return this.renderSpellDetail(item, index);
    } else {
      return this.renderOtherDetail(item, index);
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header title="测试详情" />
        <View style={styles.testTop}>
          <Text>测试时间：{this.state.testData.startTime}</Text>
          <View style={styles.testIntr}>
            <View style={{ flexDirection: "row" }}>
              <Text>共 {this.state.testData.total} 题</Text>
              <Text>对 {this.state.testData.rightCount} 题</Text>
              <Text>错 {this.state.testData.errorCount} 题</Text>
            </View>
            <Text>{this.state.testData.name}</Text>
          </View>
          {this.useTime()}
          <Text style={{ width: "25%" }}>
            姓名：
            <Text numberOfLines={1} style={{ fontSize: 24 }}>
              {this.state.userName}
            </Text>
          </Text>
          <Text>
            {this.state.examType === EXAM_TYPE.WORD ? "词汇量：" : "分数："}
            <Text style={{ fontSize: 36, color: "#FF0000" }}>
              {this.state.testData.score}
            </Text>
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.listContainer}>
            <FlatList
              data={this.state.dataList}
              keyExtractor={(item, index) => "" + index}
              renderItem={this.renderItem}
              ListHeaderComponent={this.ListHeaderComponent()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textCenter: {
    alignItems: "center",
    justifyContent: "center"
  },
  listContainer: {
    paddingHorizontal: 20
  },
  testTop: {
    minHeight: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  testIntr: {
    width: "25%",
    alignItems: "center"
  },
  item: {
    minHeight: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd"
  },
  word: {
    width: "10%"
  },
  choiceText: {
    width: "20%"
  }
});
