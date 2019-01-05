import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import ProgressBar from "./ProgressBar";

import { Button } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import commonStyle from "../globalStyle";
import { utility } from "../utility";
import syncController from "../controller/sync";

import PopupDialog, {
  DialogTitle,
  SlideAnimation
} from "react-native-popup-dialog";

const slideAnimation = new SlideAnimation({ slideFrom: "bottom" });

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadType: "books", // books, schedules, errorWords, rightWords, exams
      bookProgress: 0,
      scheduleProgress: 0,
      recordProgress: 0,
      errorWordsProgress: 0,
      rightWordsProgress: 0,
      examProgress: 0,
      complate: false
    };
    utility.getCurrUserInfo().then(item => {
      if (item) {
        this.studentInfo = item;
        this.studentNo = this.studentInfo.studentNo;
      }
    });
    // utility.getUsersInfo().then(usersInfo => {
    //   this.studentInfo = usersInfo.currUserInfo;
    //   this.studentNo = this.studentInfo.studentNo;
    // });
  }
  componentDidMount() {}
  show() {
    this.refs.popDialog.show();
    this.downloadBookList();
  }
  hide() {
    this.refs.popDialog.dismiss();
  }
  getDownloadTitle() {
    let title = "";
    switch (this.state.downloadType) {
      case "books":
        title = "课本列表信息";
        break;
      case "schedules":
        title = "课本进度信息";
        break;
      case "records":
        title = "学习记录信息";
        break;
      case "errorWords":
        title = "生词本信息";
        break;
      case "rightWords":
        title = "已掌握的单词信息";
        break;
      case "exams":
        title = "试卷信息";
        break;
      default:
        title = "";
    }
    if (this.state.complate) {
      return "下载已全部完成";
    } else if (this.state.downloadType == "error") {
      return "下载失败，请重新下载！";
    } else {
      return "正在下载..." + title;
    }
  }
  getProgress() {
    let progress = 0;
    switch (this.state.downloadType) {
      case "books":
        progress = this.state.bookProgress;
        break;
      case "schedules":
        progress = this.state.scheduleProgress;
        break;
      case "records":
        progress = this.state.recordProgress;
        break;
      case "errorWords":
        progress = this.state.errorWordsProgress;
        break;
      case "rightWords":
        progress = this.state.rightWordsProgress;
        break;
      case "exams":
        progress = this.state.examProgress;
        break;
      default:
        progress = 0;
    }
    return progress;
  }
  downloadBookList() {
    this.setState(
      {
        downloadType: "books"
      },
      () => {
        syncController
          .checkBookList()
          .then(res => {
            this.setState({
              bookProgress: 50
            });
            //1. 清除本地数据
            syncController.clearLocalData(this.studentNo).then(success => {
              syncController.getDownloadedBookList(this.studentNo).then(
                books => {
                  utility.log("--------getDownloadedBookList--", books);
                  this.setState({
                    bookProgress: 100,
                    downloadType: "schedules"
                  });
                  syncController
                    .downloadColumnSchedules(
                      this.studentNo,
                      books,
                      progress => {
                        this.setState({
                          scheduleProgress: progress
                        });
                      }
                    )
                    .then(
                      () => {
                        this.setState({
                          downloadType: "records"
                        });
                        syncController
                          .downloadLearnTimeRecord(this.studentNo, progress => {
                            this.setState({
                              recordProgress: progress
                            });
                          })
                          .then(
                            () => {
                              this.setState({
                                downloadType: "rightWords"
                              });
                              syncController
                                .downloadAllRightWords(
                                  this.studentNo,
                                  progress => {
                                    this.setState({
                                      rightWordsProgress: progress
                                    });
                                  }
                                )
                                .then(
                                  () => {
                                    this.setState({
                                      downloadType: "errorWords"
                                    });
                                    syncController
                                      .downloadAllErrorWords(
                                        this.studentNo,
                                        progress => {
                                          this.setState({
                                            errorWordsProgress: progress
                                          });
                                        }
                                      )
                                      .then(
                                        () => {
                                          this.setState({
                                            downloadType: "exams"
                                          });
                                          syncController
                                            .downloadExamList(progress => {
                                              this.setState({
                                                examProgress: progress
                                              });
                                            })
                                            .then(
                                              () => {
                                                syncController
                                                  .setBookRecordSynced(books)
                                                  .then(res => {
                                                    this.setState({
                                                      complate: true
                                                    });
                                                  });
                                              },
                                              err => {
                                                this.setState({
                                                  downloadType: "error"
                                                });
                                              }
                                            );
                                        },
                                        err => {
                                          this.setState({
                                            downloadType: "error"
                                          });
                                        }
                                      );
                                  },
                                  err => {
                                    this.setState({
                                      downloadType: "error"
                                    });
                                  }
                                );
                            },
                            err => {
                              this.setState({
                                downloadType: "error"
                              });
                            }
                          );
                      },
                      err => {
                        this.setState({
                          downloadType: "error"
                        });
                      }
                    );
                },
                err => {
                  this.setState({
                    downloadType: "error"
                  });
                }
              );
            });
          })
          .catch(e => {
            this.setState({
              downloadType: "error"
            });
          });
      }
    );
  }

  render() {
    return (
      <PopupDialog
        ref="popDialog"
        width={400}
        height={300}
        dismissOnTouchOutside={false}
        dismissOnHardwareBackPress={false}
        dialogTitle={
          <DialogTitle
            titleStyle={{
              backgroundColor: commonStyle.color.primary,
              color: "#fff"
            }}
            titleTextStyle={{ color: "#fff" }}
            title="数据同步"
          />
        }
        dialogAnimation={slideAnimation}
      >
        <View style={styles.dialogBody}>
          <Text style={styles.descText}>检测到云端有新数据</Text>
          <Text style={styles.descText}>
            正在从云端下载数据，请保持网络畅通
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.descText}>{this.getDownloadTitle()}</Text>
            <ProgressBar
              progress={this.getProgress()}
              barStyle={{
                width: 260
              }}
            />
          </View>
          <View style={styles.dialogBtns}>
            <Button
              style={[
                styles.btn,
                {
                  display: this.state.complate ? "flex" : "none"
                }
              ]}
              onPress={() => {
                this.refs.popDialog.dismiss();
                this.props.onSynced && this.props.onSynced();
              }}
            >
              <Text style={styles.btnText}>确定</Text>
            </Button>
            <Button
              style={[
                styles.btn,
                {
                  display: this.state.downloadType === "error" ? "flex" : "none"
                }
              ]}
              onPress={() => {
                this.downloadBookList();
              }}
            >
              <Text style={styles.btnText}>重新下载</Text>
            </Button>
          </View>
        </View>
      </PopupDialog>
    );
  }
}

const styles = StyleSheet.create({
  dialogBody: {
    padding: 10,
    flex: 1,
    position: "relative"
  },
  descText: {
    lineHeight: 30,
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 10
  },
  dialogBtns: {
    // position: "absolute",
    // bottom: 10,
    width: 400,
    height: 80,
    alignItems: "center",
    justifyContent: "center"
    // flexDirection: "row",
    // justifyContent: "space-around"
  },
  btn: {
    width: 200,
    height: 50,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: commonStyle.color.primary
  },
  btnText: {
    fontSize: 18,
    color: "#fff"
  },
  progressContainer: {
    alignItems: "center"
  }
});
