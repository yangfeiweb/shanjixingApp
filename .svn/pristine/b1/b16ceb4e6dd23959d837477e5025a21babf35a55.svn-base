import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  DeviceEventEmitter,
  AsyncStorage
} from "react-native";
import { NavigationActions } from "react-navigation";
import {
  Header,
  Loading,
  WordTestBase,
  ListenWordTest,
  SpellTest
} from "../../components";
import { courseController } from "../../controller";
import { learnDB } from "../../db";
import { utility } from "../../utility";
import { EXAM_TYPE } from "../../utility/dict";

const MAX_NUM = 20;
export default class extends Component {
  constructor(props) {
    super(props);
    this.number = 0; //测试的 总单词数
    this.navigationState = this.props.navigation.state;
    this.params = this.navigationState.params;
    this.isEnd = false;
    let examType = this.params.examType;
    let testType = "";
    if (examType === "before") {
      testType = "学前测试";
    } else if (examType === "after") {
      testType = "学后测试";
    }
    this.state = {
      gradeText: "课程:" + this.params.columnName,
      title: testType
    };
  }
  componentDidMount() {
    let { columnNo, bookNo } = this.params;
    this.refs.loading && this.refs.loading.show();
    courseController
      .getColumnWords(bookNo, columnNo)
      .then(res => {
        let len = res.length;
        this.number = len;
        let data = this.createDisturbance(res);
        let nums = this.getaNum(len); //存放干扰项下标的二维数组
        let words = data.map((item, index, words) => {
          let obj = Object.assign({}, item);
          let num = nums[index];
          obj["error1"] = words[num[0]].correct;
          obj["error2"] = words[num[1]].correct;
          obj["error3"] = words[num[2]].correct;
          return obj;
        });
        if (words.length > MAX_NUM) {
          words = words.splice(0, MAX_NUM);
          this.number = MAX_NUM;
        }
        this.refs.WordTestBase && this.refs.WordTestBase.setData(words);
        this.refs.loading && this.refs.loading.hide();
      })
      .catch(err => {
        this.refs.loading && this.refs.loading.hide();
      });
  }
  createDisturbance(data) {
    //生成干扰项
    let len = data.length;
    let arr = data.map(item => {
      let obj = {};
      obj["word"] = item.content1;
      obj["wordNo"] = item.wordNo || "";
      obj["correct"] = this.getWordMean(item.content3);
      obj["content7"] = item.content7;
      obj["content5"] = item.content5;
      return obj;
    });
    return arr;
  }
  getaNum(len) {
    //干扰项下表数组 跟单词个数一至
    let arr = []; //存放跟单词数
    for (let i = 0; i < len; i++) {
      let nums = [];
      let obj = {};
      obj[i] = true;
      for (let i = 0; i < 3; ) {
        //产生三个随机数
        let num = utility.baseRandom(0, len - 1);
        if (obj[num]) {
          continue;
        } else {
          i++;
          nums.push(num);
          obj[num] = true;
        }
      }
      arr.push(nums);
    }
    return arr;
  }
  //例:"【中】adj.&n.最喜欢的；最喜欢的(人或物)<br />【英】n.~ person or thing liked more than others"
  getWordMean(str) {
    //得到中文单词的意思
    let arr = str.split("<br />");
    let item = "";
    for (let i = 0; i < arr.length; i++) {
      item = arr[i];
      if (item && item.indexOf("【中】") !== -1) {
        return item.replace("【中】", "");
      }
    }
    return "";
  }
  testEnd(result) {
    this.insertExamRecord(result);
    // this.insertSpellExamRecord(result);
  }
  insertSpellExamRecord(result) {
    let { columnNo, bookNo, columnName, examType } = this.params;
    let rightScore = result.rightScore;
    let errorScore = result.errorScore;
    let list = result.wordList;
    let testName =
      this.params.bookName + "  拼写" + `(${columnName}-${this.state.title})`;
    let score = Math.ceil(rightScore / this.number * 100);
    let replace = NavigationActions.replace({
      key: this.navigationState.key,
      routeName: "TestResult",
      params: {
        examType: examType || ""
      }
    });
    let type = "";
    if (examType === "before") {
      type = EXAM_TYPE.COLUMN_WORD_SPELL_BEFORE;
    } else {
      type = EXAM_TYPE.COLUMN_WORD_SPELL_AFTER;
    }
    //将测试结过存到数据库
    AsyncStorage.getItem("studentNo").then(studentNo => {
      let obj = {
        score: score,
        name: testName,
        studentNo: studentNo,
        bookNo: bookNo,
        total: this.number,
        rightCount: rightScore,
        errorCount: result.errorScore,
        startTime: result.startTime,
        finishedTime: result.finishedTime,
        examType: type
      };
      let arr = list.map(item => {
        let isCorrect = item.isCorrect ? "Y" : "N";
        let obj = {
          bookNo: bookNo,
          columnNo: columnNo,
          wordNo: item.wordNo,
          word: item.word,
          chinese: item.chineseMeans,
          answer: item.answer,
          isCorrect: isCorrect,
          finishedTime: item.finishedTime
        };
        return obj;
      });
      learnDB.insertExamSpellRecord(obj, arr).then(
        res => {
          this.isEnd = true;
          this.props.navigation.dispatch(replace);
        },
        err => {
          this.props.navigation.dispatch(replace);
        }
      );
    });
  }
  insertExamRecord(result) {
    let { columnNo, bookNo, columnName, examType } = this.params;
    let rightScore = result.rightScore;
    let errorScore = result.errorScore;
    let list = result.wordList;
    let testName =
      this.params.bookName + "  认读" + `(${columnName}-${this.state.title})`;
    let score = Math.ceil(rightScore / this.number * 100);
    let replace = NavigationActions.replace({
      key: this.navigationState.key,
      routeName: "TestResult",
      params: {
        examType: examType || ""
      }
    });
    let type = "";
    if (examType === "before") {
      type = EXAM_TYPE.COLUMN_WORD_BEFORE;
    } else {
      type = EXAM_TYPE.COLUMN_WORD_AFTER;
    }
    //将测试结过存到数据库
    AsyncStorage.getItem("studentNo").then(studentNo => {
      let obj = {
        score: score,
        name: testName,
        studentNo: studentNo,
        bookNo: bookNo,
        total: this.number,
        rightCount: rightScore,
        errorCount: result.errorScore,
        startTime: result.startTime,
        finishedTime: result.finishedTime,
        examType: type
      };
      let arr = list.map(item => {
        let obj = {
          bookNo: bookNo,
          wordNo: item.wordNo,
          columnNo: columnNo,
          wordName: item.word,
          answerItem: item.selected,
          finishedTime: item.finishedTime
        };
        let topics = item.topics;
        topics &&
          topics.forEach(element => {
            if (element.right) {
              obj.rightItem = element.letter;
            }
            if (element.letter === "A") {
              obj["itemA"] = element.topic;
            }
            if (element.letter === "B") {
              obj["itemB"] = element.topic;
            }
            if (element.letter === "C") {
              obj["itemC"] = element.topic;
            }
            if (element.letter === "D") {
              obj["itemD"] = element.topic;
            }
          });
        return obj;
      });
      learnDB.insertExamRecord(obj, arr).then(
        res => {
          this.isEnd = true;
          this.props.navigation.dispatch(replace);
        },
        err => {
          this.props.navigation.dispatch(replace);
        }
      );
    });
  }
  componentWillUnmount() {
    if (!this.isEnd) {
      let examType = this.params.examType;
      DeviceEventEmitter.emit("examReturnToLearn", examType);
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header title={this.state.title} />
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            paddingVertical: 10,
            paddingHorizontal: 30
          }}
        >
          {/* <ListenWordTest
            title={this.state.gradeText}
            result={this.testEnd.bind(this)}
            ref="WordTestBase"
          /> */}
          <WordTestBase
            title={this.state.gradeText}
            result={this.testEnd.bind(this)}
            ref="WordTestBase"
          />
          {/* <SpellTest
            title={this.state.gradeText}
            result={this.testEnd.bind(this)}
            ref="WordTestBase"
          /> */}
        </View>
        <Loading ref="loading" title="测试试卷生成中..." />
      </View>
    );
  }
}
