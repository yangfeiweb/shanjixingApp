import React, { Component } from "react";
import {
  View,
  StyleSheet,
  processColor,
  AsyncStorage,
  ScrollView
} from "react-native";
import {
  Content,
  Text,
  Grid,
  Col,
  Row,
  Picker,
  Item,
  Form,
  Body
} from "native-base";
import DatePicker from "react-native-datepicker";
import {
  VictoryChart,
  VictoryGroup,
  VictoryBar,
  VictoryTheme,
  VictoryZoomContainer
} from "victory-native";
import chartStyle from "./chartStyle";
import { utility } from "../../../utility";
import { learnController } from "../../../controller";

export default class ChartByWeek extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let week = utility.getWeekSection(utility.getNowDate());
    this.getLearnRecord(week);
  }
  state = {
    date: utility.getNowDateStr(),
    selected: undefined,
    time: "",
    totalMinute: 0,
    totalNum: 0,
    weeks: [],
    studyTime: [], //学习时长
    studyWordNum: [], //学习单词数量
    maxDomainY: 50
  };
  getLearnRecord(week) {
    const { showLoading, hideLoading } = this.props;
    this.setState({
      weeks: week
    });
    showLoading && showLoading();
    AsyncStorage.getItem("studentNo")
      .then(studentNo => {
        if (studentNo) {
          let studyTime = []; //
          let studyWordNum = [];
          let maxDomainY = 0; //y轴的最大值
          let start = week[0] + " 00:00:00";
          let end = week[6] + " 23:59:59";
          learnController
            .getLearnStatistics(studentNo, start, end)
            .then(res => {
              if (res) {
                let totalMinute = 0;
                let totalNum = 0;
                week.forEach((time, index) => {
                  let date = res.find(
                    item => item["date(createTime)"] === time
                  );
                  if (date) {
                    let m = Math.ceil(date.learnedTime / 1000 / 60); //学习的时长 ----单位分钟
                    totalMinute += m;
                    if (maxDomainY < m) {
                      maxDomainY = m;
                    }
                    let num = date.rightNum;
                    totalNum += num;
                    if (maxDomainY < num) {
                      maxDomainY = num;
                    }
                    studyTime[index] = { x: time, y: m };
                    studyWordNum[index] = { x: time, y: num };
                  } else {
                    studyWordNum[index] = { x: time, y: 0 };
                    studyTime[index] = { x: time, y: 0 };
                  }
                });

                maxDomainY += 20;
                this.setState({
                  time: week[0] + " 至 " + week[6],
                  studyWordNum: studyWordNum,
                  studyTime: studyTime,
                  totalMinute: totalMinute,
                  totalNum: totalNum,
                  maxDomainY: maxDomainY
                });
              }
              hideLoading && hideLoading();
            })
            .catch(err => {
              hideLoading && hideLoading();
            });
        }
      })
      .catch(err => {
        hideLoading && hideLoading();
      });
  }
  selectDate(date) {
    let week = utility.getWeekSection(new Date(date));
    this.getLearnRecord(week);
    this.setState({ date: date });
  }
  formatDateStr(str) {
    // mm-dd
    let arr = str.split("-");
    return arr[1] + "-" + arr[2];
  }
  render() {
    return (
      <Content>
        <View style={chartStyle.content}>
          <Grid>
            <Row style={{ height: 40 * utility.deviceRatio }}>
              <Col style={chartStyle.container}>
                <View style={chartStyle.container}>
                  <View
                    style={[
                      chartStyle.black,
                      {
                        backgroundColor: "#56BDFF",
                        marginRight: 10 * utility.deviceRatio
                      }
                    ]}
                  />
                  <Text style={chartStyle.text}>
                    学习时间 (分钟):{this.state.totalMinute}
                  </Text>
                </View>
                <View
                  style={[
                    { marginLeft: 10 * utility.deviceRatio },
                    chartStyle.container
                  ]}
                >
                  <View
                    style={[
                      chartStyle.black,
                      {
                        backgroundColor: "#FFF553",
                        marginRight: 10 * utility.deviceRatio
                      }
                    ]}
                  />
                  <Text style={chartStyle.text}>
                    单词数量 (个):{this.state.totalNum}
                  </Text>
                </View>
              </Col>
              <Col style={{ alignItems: "center", justifyContent: "center" }}>
                <Text style={chartStyle.text}>{this.state.time}</Text>
                <DatePicker
                  date={this.state.date}
                  style={{ width: "100%", position: "absolute" }}
                  format="YYYY-MM-DD"
                  minDate="2017-01-01"
                  mode="date"
                  androidMode="calendar"
                  showIcon={false}
                  hideText={true}
                  maxDate={utility.getNowDateStr()}
                  onDateChange={date => {
                    this.selectDate(date);
                  }}
                />
              </Col>
              <Col />
            </Row>
          </Grid>
          <View style={{ height: 350 * utility.deviceRatio }}>
            <View style={{ width: "100%", height: "100%", overflow: "hidden" }}>
              <ScrollView
                horizontal
                style={{ height: "100%", width: "100%" }}
                showsHorizontalScrollIndicator={false}
              >
                <VictoryChart
                  height={340 * utility.deviceRatio}
                  domain={{ y: [0, this.state.maxDomainY] }}
                >
                  <VictoryGroup
                    padding={0}
                    offset={50 * utility.deviceRatio}
                    samples={100 * utility.deviceRatio}
                    categories={{ x: this.state.weeks }}
                    colorScale={["#56BDFF", "#FFF553"]}
                  >
                    <VictoryBar
                      padding={0}
                      width={30 * utility.deviceRatio}
                      labels={d => d.y}
                      data={this.state.studyTime}
                    />
                    <VictoryBar
                      width={50 * utility.deviceRatio}
                      padding={0}
                      labels={d => d.y}
                      data={this.state.studyWordNum}
                    />
                  </VictoryGroup>
                </VictoryChart>
              </ScrollView>
            </View>
          </View>
        </View>
      </Content>
    );
  }
}
