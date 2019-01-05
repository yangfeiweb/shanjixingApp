import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { utility } from "../utility";
import commonStyle from "../globalStyle";

const colors = [
  "#946E02",
  "#008B2D",
  "#0076AA",
  "#660066",
  "#081189",
  "#000000",
  "#FF0000"
];

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      letterArr: [],
      selectedArr: [],
      errArr: []
    };
    this.optStatus = 0; // 0：初始化，可以操作，1：选择完成，呈现结果，2：（status1后1s自动进入2）可以纠正错误的结果， 3： 错误纠正完毕，不可以再点击
    // examMode: 测试模式下，出完结果后不可点击纠正
  }

  setWord(word, title, errorStatus = 10) {
    this.setState({
      title: title
    });
    let letterArr = [];
    let wordCharArr = [];
    let selectedArr = [];
    this.wordErr = false;
    this.wordResult = "";
    let wordStr = word.replace(/[.]+/g, "^");
    for (let i = 0; i < wordStr.length; i++) {
      let charItem = wordStr.charAt(i).toLowerCase();
      let errorItem = utility.randomLetter(charItem);
      if (charItem === "^") {
        charItem = "...";
      }
      let charArr = [
        { val: charItem, status: "" },
        { val: errorItem, status: "" }
      ];
      letterArr.push(utility.shuffle(charArr));
      wordCharArr.push(charItem);
      selectedArr.push(-1);
    }
    this.optStatus = 0;
    this.errorStatus = errorStatus;
    this.setState({
      wordCharArr: wordCharArr,
      letterArr: letterArr,
      selectedArr: selectedArr,
      errArr: []
    });
  }

  examOver() {
    this.optStatus = 1;
    this.checkResult();
  }

  clickLetter(groupIdx, letterIdx) {
    let letterArr = this.state.letterArr;
    let groupData = letterArr[groupIdx];
    let letterItem = groupData[letterIdx];
    if (this.optStatus === 0) {
      let selectedArr = this.state.selectedArr;
      if (groupIdx > 0) {
        if (selectedArr[groupIdx - 1] !== -1) {
          selectedArr[groupIdx] = letterIdx;
        }
      } else {
        selectedArr[groupIdx] = letterIdx;
      }
      this.setState({
        selectedArr: selectedArr
      });
      // 更新wordStatus
      if (selectedArr[groupIdx] !== -1) {
        groupData[0].status = "";
        groupData[1].status = "";
        letterItem.status = "selected";
        this.setState({
          letterArr: letterArr
        });
      }
      if (selectedArr[selectedArr.length - 1] !== -1) {
        this.optStatus = 1;
        this.checkResult();
      }
    } else if (this.optStatus === 1) {
      return;
    } else if (this.optStatus === 2) {
      // 纠正错误
      if (letterItem.status === "error") {
        let errArr = this.state.errArr;
        if (errArr[0] === groupIdx) {
          letterItem.status = "checked";
          errArr.splice(0, 1);
          if (errArr.length === 0) {
            this.optStatus = 3;
            this.props.onOver &&
              this.props.onOver(this.wordErr, this.wordResult);
          }

          this.setState({
            letterArr: letterArr,
            errArr: errArr
          });
        }
      }
    }
  }
  checkResult() {
    let errArr = this.state.errArr;
    let selectedArr = this.state.selectedArr;
    let wordCharArr = this.state.wordCharArr;
    let letterArr = this.state.letterArr;
    let resultArr = [];
    selectedArr.forEach((selectIdx, idx) => {
      let wordItem = wordCharArr[idx];
      let groupItem = letterArr[idx];
      if (selectIdx !== -1) {
        let selectItem = groupItem[selectIdx];
        selectItem["status"] = "";
        resultArr.push(selectItem.val);
        if (selectItem.val !== wordItem) {
          let rightItem = groupItem[0];
          if (selectIdx === 0) {
            rightItem = groupItem[1];
          }
          // 更新wordStatus
          rightItem["status"] = "error";
          errArr.push(idx);
        }
      } else {
        // let rightItem =
        if (groupItem[0].val === wordItem) {
          groupItem[0]["status"] = "error";
        } else {
          groupItem[1]["status"] = "error";
        }
        errArr.push(idx);
      }
    });
    this.setState({
      errArr: errArr,
      letterArr: letterArr
    });

    this.wordErr = errArr.length > 0;
    this.wordResult = resultArr.join("");
    if (this.props.examMode) {
      this.props.onOver && this.props.onOver(this.wordErr, this.wordResult);
    } else {
      this.timer = setTimeout(() => {
        this.optStatus = 2;
      }, 1000);
    }
  }
  getLetterBgColor(groupIdx, itemIdx) {
    let letterArr = this.state.letterArr;
    let groupData = letterArr[groupIdx];
    let status = groupData[itemIdx]["status"];
    if (status === "selected") {
      return "lightgrey";
    } else if (status === "error") {
      return "orange";
    }
    return "#fff";
  }

  getLetterColor(letter) {
    let status = letter.status;
    let letterColor = "gray";
    if (this.optStatus > 0) {
      switch (status) {
        case "error":
          letterColor = commonStyle.color.primary;
          break;
        case "checked":
          letterColor = "orange";
          break;
        default:
          letterColor = "#ff0000";
      }
    }
    return letterColor;
  }
  getGridBorderColor() {
    if (this.errorStatus === 10) {
      return "#ff0000";
    } else if (this.errorStatus > -1) {
      return colors[this.errorStatus];
    } else {
      return "#333";
    }
  }
  renderLetters() {
    return this.state.letterArr.map((item, groupIdx) => {
      return (
        <Grid style={styles.letterGroup} key={groupIdx}>
          <Row
            style={[
              styles.letterItem,
              { borderColor: this.getGridBorderColor() }
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                this.clickLetter(groupIdx, 0);
              }}
              style={[
                styles.letterTouchable,
                {
                  backgroundColor: this.getLetterBgColor(groupIdx, 0)
                }
              ]}
            >
              <Text style={styles.letterText}>{item[0].val}</Text>
            </TouchableOpacity>
          </Row>
          <Row
            style={[
              styles.letterItem,
              { borderColor: this.getGridBorderColor() }
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                this.clickLetter(groupIdx, 1);
              }}
              style={[
                styles.letterTouchable,
                {
                  backgroundColor: this.getLetterBgColor(groupIdx, 1)
                }
              ]}
            >
              <Text style={styles.letterText}>{item[1].val}</Text>
            </TouchableOpacity>
          </Row>
        </Grid>
      );
    });
  }

  renderResult() {
    let resultArr = [];
    let selectedArr = this.state.selectedArr;
    selectedArr.forEach((selectIdx, idx) => {
      let group = this.state.letterArr[idx];
      let letter = group[selectIdx];
      if (letter) {
        let val = letter.val;
        let status = "";
        if (group[0].status) {
          status = group[0].status;
          // if (status) {
          val = group[0].val;
          // }
        } else if (group[1].status) {
          status = group[1].status;
          // if (status) {
          val = group[1].val;
          // }
        }
        let item = {
          val: val,
          status: status
        };
        resultArr.push(item);
      } else if (this.optStatus === 1) {
        // exam over
        let val = "";
        if (group[0].status === "error") {
          val = group[0].val;
        } else {
          val = group[1].val;
        }
        let item = {
          val: val,
          status: "error"
        };
        resultArr.push(item);
      }
    });
    return resultArr.map((item, idx) => {
      return (
        <Text
          key={idx}
          style={[styles.resultTitle, { color: this.getLetterColor(item) }]}
        >
          {item.val}
        </Text>
      );
    });
  }

  render() {
    return (
      <View style={styles.spellRoot}>
        <View style={styles.wordTitle}>
          <Text style={styles.wordTitleText}>{this.state.title}</Text>
        </View>
        <View style={styles.wordResult}>{this.renderResult()}</View>
        <View style={styles.lettersContainer}>
          <ScrollView
            horizontal
            style={[
              styles.scrollView,
              { borderColor: this.getGridBorderColor() }
            ]}
          >
            {this.renderLetters()}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  spellRoot: {
    height: 240,
    width: "100%"
  },
  wordTitle: {
    height: 40,
    borderBottomColor: "#aaa",
    borderBottomWidth: 1,
    marginBottom: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  wordTitleText: {
    fontSize: 26
  },
  wordResult: {
    height: 70,
    marginBottom: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  resultTitle: {
    color: "#ff0000",
    fontSize: 50,
    alignSelf: "center"
  },
  lettersContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  scrollView: {
    // borderColor: "#333",
    borderLeftWidth: 1,
    borderTopWidth: 1
  },
  letterGroup: {
    width: 60
  },
  letterItem: {
    width: "100%",
    // borderColor: "#333",
    borderRightWidth: 1,
    borderBottomWidth: 1
  },
  letterTouchable: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  letterText: {
    alignSelf: "center",
    fontSize: 26
  }
});
