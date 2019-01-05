/**
 * 个人中心资料展示和编辑组件
 */
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  DeviceEventEmitter
} from "react-native";
import { Radio, Grid, Col, Item } from "native-base";
import FIcons from "react-native-vector-icons/Feather";
import DatePicker from "react-native-datepicker";
import { EVENT, GRADLE } from "../../../utility/dict";
import { utility } from "../../../utility";
const MAN = "MALE"; //男
const WOMAN = "FEMALE"; //女
export default class PersonalInfo extends Component {
  constructor(props) {
    super(props);
    this.userName = null;
    this.grade = null;
    this.mobile = null;
    this.changeInfoEvent = null;
    this.changeIconEvent = null;
    this.sex = {
      MALE: "男",
      FEMALE: "女",
      UNKNOWN: "未知"
    };
  }
  state = {
    usersInfo: {
      name: "",
      grade: "",
      mobile: "",
      address: "",
      birthDate: "",
      gender: undefined
    }
  };
  componentDidMount() {
    this.showInfo();
    this.changeInfoEvent = DeviceEventEmitter.addListener(
      EVENT.CHANGE_USER_INFO,
      data => {
        this.showInfo();
      }
    );
  }
  componentWillUnmount() {
    this.changeIconEvent && this.changeIconEvent.remove();
  }
  showInfo() {
    //展示用户的个人信息
    AsyncStorage.getItem("studentNo").then(studentNo => {
      if (studentNo) {
        AsyncStorage.getItem("usersInfo").then(res => {
          if (res) {
            let data = JSON.parse(res);
            let currUserInfo = data.find(item => item.studentNo === studentNo);
            if (currUserInfo) {
              let usersInfo = {};
              usersInfo.name = currUserInfo.name || "未填写";
              usersInfo.grade = "未选择";
              usersInfo.mobile = currUserInfo.mobile;
              usersInfo.birthDate = "未选择";
              if (currUserInfo.birthDate) {
                usersInfo.birthDate = utility.dateToDateStr(
                  new Date(currUserInfo.birthDate)
                );
              }
              let gender;
              if (currUserInfo.gender) {
                gender = this.sex[currUserInfo.gender];
              } else {
                gender = "未知";
              }
              usersInfo.gender = gender;
              if (currUserInfo.currentGrade) {
                let item = GRADLE.find(
                  item => item.key === currUserInfo.currentGrade
                );
                if (item) {
                  usersInfo["grade"] = item.value;
                }
              }
              this.setState({ usersInfo: usersInfo });
            }
          }
        });
      }
    });
  }
  render() {
    const { navigate } = this.props;
    return (
      <View>
        <View style={styles.editItems}>
          <View style={styles.itemsCol}>
            <View style={styles.blueLine} />
            <Text style={{ color: "#5ABEFF" }}>个人资料</Text>
          </View>
          <View style={[styles.itemsCol]}>
            {/* 修改资料和保存按钮 */}
            <Animated.View>
              <TouchableOpacity
                onPress={() => {
                  navigate("ChangeUserInfo");
                }}
                activeOpacity={1}
              >
                {/* 修改资料图标 */}
                <FIcons name="edit" size={20} color="#5ABEFF">
                  {" "}
                </FIcons>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        <View style={styles.editItems}>
          <View style={[styles.inputCol, styles.itemsCol]}>
            <Text style={styles.commonValue}>姓名:</Text>
            <Animated.Text style={[styles.commonValue]}>
              {this.state.usersInfo.name}
            </Animated.Text>
          </View>
          <View style={[styles.inputCol, styles.itemsCol]}>
            <Text style={styles.commonValue}>年级:</Text>
            <Text>{this.state.usersInfo.grade}</Text>
          </View>
        </View>
        <View style={styles.editItems}>
          <View style={[styles.inputCol, styles.itemsCol]}>
            <Text style={styles.commonValue}>性别:</Text>
            <Animated.Text style={[styles.commonValue]}>
              {this.state.usersInfo.gender || "未选择"}
            </Animated.Text>
          </View>
          {/* <View style={[styles.inputCol, styles.itemsCol]}>
                        <Text style={styles.commonValue}>地区:</Text>
                        <Animated.Text style={[styles.commonValue]}>
                            {this.state.usersInfo.address || "未选择"}
                        </Animated.Text>
                    </View> */}
          <View style={[styles.inputCol, styles.itemsCol]}>
            <Text style={styles.commonValue}>联系方式:</Text>
            <Animated.Text style={[styles.commonValue]}>
              {this.state.usersInfo.mobile}
            </Animated.Text>
          </View>
        </View>
        <View style={styles.editItems}>
          <View style={[styles.inputCol, styles.itemsCol]}>
            <Text style={styles.commonValue}>出生日期:</Text>
            <Animated.Text style={[styles.commonValue]}>
              {this.state.usersInfo.birthDate}
            </Animated.Text>
          </View>
          {/* <View style={[styles.inputCol, styles.itemsCol]}>
                        <Text style={styles.commonValue}>联系方式:</Text>
                        <Animated.Text style={[styles.commonValue]}>
                            {this.state.usersInfo.mobile || "未填写联系方式"}
                        </Animated.Text>
                    </View> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  editItems: {
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  blueLine: {
    width: 3,
    height: 17,
    marginRight: 4,
    backgroundColor: "#5ABEFF"
  },
  itemsCol: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    paddingVertical: 5
  },
  commonValue: {
    color: "#5f5f5f"
  },
  inputCol: {
    width: "48%",
    justifyContent: "space-between",
    overflow: "hidden"
  },
  positionValue: {
    width: "60%",
    position: "absolute",
    margin: 0,
    padding: 0
  },
  textInput: {
    flex: 1,
    margin: 0,
    padding: 0,
    borderWidth: 1,
    borderColor: "#5ABEFF",
    color: "#5ABEFF"
  },
  animateBtn: {
    position: "absolute",
    top: 0
  }
});
