import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  DeviceEventEmitter
} from "react-native";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "native-base";
import RNFetchBlob from "react-native-fetch-blob";
import { downloadFile, DocumentDirectoryPath } from "react-native-fs";
import Spinner from "react-native-spinkit";
import DeviceInfo from "react-native-device-info";

import commonStyle from "../globalStyle";
import { ProgressBar } from "../components";
import { courseController, syncController } from "../controller";
import reqUrl, { ResourcePath } from "../services/urlConfig";
import { utility, getRequestSign } from "../utility";
import dataService from "../services";

import {
  zip,
  unzip,
  unzipAssets,
  subscribe,
  unzipDencrypt
} from "react-native-zip-archive";

import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation
} from "react-native-popup-dialog";

const slideAnimation = new SlideAnimation({ slideFrom: "bottom" });

import MD5 from "crypto-js/md5";
import { booksDB } from "../db";
import { LEARN_TYPE } from "../utility/dict";
const dirs = RNFetchBlob.fs.dirs;
const courseRoot = dirs.DocumentDir + "/course/";

let downloading = false;
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: -1, // -1：未下载（未加入课程），0： 连接中，1： 下载中， 2： 已下载，解压中， 3：已解压，准备加入课程中， 4：开始加入课程， 5：已加入课程
      received: 0,
      total: 0,
      progress: 0
    };
  }
  componentDidMount() {
    utility.getCurrUserInfo().then(item => {
      if (item) {
        this.studentInfo = item;
        this.studentNo = this.studentInfo.studentNo;
      }
    });
    AsyncStorage.getItem("token").then(token => {
      this.token = token;
    });
    this.unzipProgress = subscribe(({ progress, filePath }) => {
      this.setState({ unziping: true, progress: progress });
    });
  }

  componentWillUnmount() {
    this.unzipProgress.remove();
  }
  show() {
    let bookInfo = this.props.bookInfo;
    if (bookInfo) {
      let learning = this.props.bookInfo.learning;
      let cached = this.props.bookInfo.cached;
      // if (learning && cached) {
      //   this.setState({
      //     status: 5
      //   });
      // } else {
      this.setState({
        status: -1
      });
      // }
    }
    this.refs.bookDialog.show();
  }
  checkBookCached(forceDownload) {
    return new Promise((resolve, reject) => {
      let bookInfo = this.props.bookInfo;
      if (bookInfo) {
        let bookNo = bookInfo.bookNo;
        booksDB.getCacheBookColumnCount(bookNo).then(count => {
          if (count > 0 && !forceDownload) {
            resolve();
          } else {
            // show
            this.show();
            if (downloading) {
              utility.Toast("有正在下载的课本，请等待下载完成！");
              return;
            }
            this.downloadBookFile().then(
              success => {
                resolve();
                this.refs.bookDialog.dismiss();
              },
              err => {
                reject();
              }
            );
          }
        });
      }
    });
  }
  downloadBookFile() {
    downloading = true;
    return new Promise((resolve, reject) => {
      // 根据课本状态，cached&&!learning 只加入该课本到课程即可，不需要下载
      let learning = this.props.bookInfo.learning;
      let cached = this.props.bookInfo.cached;
      // if (cached) {
      //   // 且vip没有过期，version相同
      //   this.setState({
      //     status: 0
      //   });
      //   courseController
      //     .insertUserBookInfo(this.studentNo, this.props.bookInfo)
      //     .then(res => {
      //       this.setState({
      //         status: 5
      //       });
      //       this.props.onDownload && this.props.onDownload();
      //     });
      // } else {
      let params = {
        token: this.token,
        version: "1.0.0",
        ts: utility.getTs()
      };
      let sign = getRequestSign(params);
      this.setState({
        status: 0
      });
      let bookNo = this.props.bookInfo.bookNo;
      let downloadUrl =
        reqUrl.DOWNLOAD_BOOK +
        bookNo +
        `?token=${this.token}&version=1.0.0&ts=${utility.getTs()}&sign=${sign}`;

      RNFetchBlob.config({
        fileCache: true,
        timeout: 100000,
        appendExt: "zip"
      })
        .fetch("GET", downloadUrl, {
          "User-Agent": DeviceInfo.getUserAgent()
        })
        .progress((received, total) => {
          this.setState({
            status: 1,
            received: (received / 1048576).toFixed(2),
            totalByte: total - 0,
            total: (total / 1048576).toFixed(2),
            progress: Math.floor(received / total * 100)
          });
        })
        .then(res => {
          let respType = res.respInfo.respType;
          if (respType === "json") {
            let status = res.respInfo.status;
            RNFetchBlob.fs.readFile(res.path(), "utf8").then(data => {
              let responseData = JSON.parse(data);
              let code = responseData.code;
              res.flush();
              if (code === 600) {
                utility.Toast("VIP用户课程，请前去开通VIP！");
              } else if (code === 402) {
                utility.Toast("该账户在其他地方登陆！");
                DeviceEventEmitter.emit("gotoLogin");
              } else if (code === 401) {
                utility.Toast("登陆失效，请重新登录！");
                DeviceEventEmitter.emit("gotoLogin");
              } else if (code === 500) {
                utility.Toast("下载失败，请稍后重新下载");
              }
            });
            downloading = false;
            this.setState({
              status: -1
            });
            reject();
          } else if (res && res.path()) {
            // 校验下载的文件大小
            RNFetchBlob.fs.stat(res.path()).then(stat => {
              if (this.state.totalByte == stat.size) {
                this.setState({
                  progress: 100,
                  status: 2,
                  received: this.state.total
                });
                this.unzipFile(res.path(), dirs.DocumentDir + "/course").then(
                  success => {
                    downloading = false;
                    resolve();
                  },
                  err => {
                    downloading = false;
                    reject(err);
                  }
                );
              } else {
                downloading = false;
                utility.Toast("网速太慢，下载课程失败，请重新下载！");
                res.flush();
                this.setState({
                  status: -1
                });
                reject();
              }
            });
          }
        })
        .catch((errorMessage, statusCode) => {
          utility.Toast("下载课程失败，请检查网络连接！", 2000);
          downloading = false;
          this.setState({
            status: -1
          });
          reject();
        });
      // }
    });
  }
  unzipFile(path, toPath) {
    this.setState({
      status: 2
    });
    return new Promise((resolve, reject) => {
      unzipDencrypt(path, toPath, MD5(this.studentNo).toString())
        .then(p => {
          this.setState({
            status: 3
          });
          setTimeout(() => {
            courseController
              .insertBookFileToDB(
                this.studentNo,
                this.props.bookInfo.bookNo,
                this.props.bookInfo.versionCode,
                progress => {
                  this.setState({
                    status: 4,
                    progress: progress
                  });
                }
              )
              .then(
                res => {
                  this.setState({
                    status: 5
                  });
                  dataService
                    .markBookDownloaded(this.props.bookInfo.bookNo)
                    .then(
                      res => {
                        if (res.code === 200) {
                          // 下载课本的学习记录
                          syncController
                            .getColumnScheduleByType(
                              this.studentNo,
                              this.props.bookInfo.bookNo,
                              LEARN_TYPE.DEFAULT
                            )
                            .then(success => {
                              this.props.onDownload && this.props.onDownload();
                              this.deleteZipFile(path).then(success => {
                                this.removeCachedCourseFiles(
                                  this.props.bookInfo.bookNo
                                );
                              });
                              resolve();
                            });
                        }
                      },
                      err => {
                        reject();
                      }
                    );
                },
                err => {
                  utility.log(err)
                  utility.Toast("课程入库失败，请重新下载！");
                  this.setState({
                    status: -1
                  });
                  reject();
                }
              );
          }, 1200);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  deleteZipFile(path) {
    return RNFetchBlob.fs.unlink(path).then(res => {});
  }
  removeCachedCourseFiles(bookNo) {
    let bookPath = dirs.DocumentDir + `/course/${bookNo}/`;
    RNFetchBlob.fs.unlink(bookPath).then(res => {});
  }
  getProgressText() {
    let text = "";
    switch (this.state.status) {
      case 1:
        text = "下载中";
        break;
      case 2:
        text = "解压中";
        break;
      case 3:
        text = "文件校验中";
        break;
      case 4:
        text = "课程入库中";
        break;
    }
    return text;
  }
  render() {
    return (
      <PopupDialog
        width={600}
        height={300}
        dismissOnTouchOutside={
          this.state.status == 5 || this.state.status == -1
        }
        dialogTitle={
          <DialogTitle
            titleStyle={{
              backgroundColor: commonStyle.color.primary,
              color: "#fff"
            }}
            titleTextStyle={{ color: "#fff" }}
            title={this.props.bookInfo && this.props.bookInfo.name}
          />
        }
        ref="bookDialog"
        dialogAnimation={slideAnimation}
      >
        <View style={styles.dialogBody}>
          <View style={styles.dialogInfos}>
            <Image
              ref="img"
              style={[styles.bookImg]}
              source={
                this.props.bookInfo && {
                  uri: ResourcePath + this.props.bookInfo.coverImgUrl
                }
              }
            />
            <ScrollView style={styles.dialogBookSummary}>
              {(() => {
                if (this.props.bookInfo) {
                  let desc = this.props.bookInfo.info || "";
                  let summarys = desc.split("<br />");
                  return summarys.map((item, idx) => {
                    return <Text key={"summary_" + idx}>{item}</Text>;
                  });
                }
              })()}
            </ScrollView>
          </View>
          <View style={styles.dialogBtns}>
            <Button
              info
              style={[
                styles.downloadBtn,
                {
                  display:
                    this.state.status == -1 || this.state.status == 0
                      ? "flex"
                      : "none"
                }
              ]}
              iconLeft
              onPress={() => {
                if (this.studentInfo) {
                  if (downloading) {
                    utility.Toast("有正在下载的课本，请等待下载完成！");
                    return;
                  }
                  utility.getVipRemainDay().then(days => {
                    if (this.props.bookInfo.bookType === "FREE") {
                      this.downloadBookFile()
                        .then()
                        .catch(e => {});
                    } else if (days > 0) {
                      this.downloadBookFile()
                        .then()
                        .catch(e => {});
                    } else {
                      utility.Toast("VIP用户课程，请前去开通VIP！");
                    }
                  });
                }
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  display: this.state.status == 0 ? "none" : "flex"
                }}
              >
                <Icon
                  name="download"
                  style={{ color: "#fff", fontSize: 24, marginRight: 5 }}
                />
                <Text style={{ color: "#fff", fontSize: 16 }}>下载课程</Text>
              </View>
              <View
                style={{
                  display: this.state.status == 0 ? "flex" : "none"
                }}
              >
                <Spinner color="#fff" type="Circle" />
              </View>
            </Button>
            <View
              style={[
                styles.statusBar,
                {
                  display:
                    this.state.status == 1 ||
                    this.state.status == 2 ||
                    this.state.status == 4
                      ? "flex"
                      : "none"
                }
              ]}
            >
              <Text style={{ marginRight: 10 }}>{this.getProgressText()}</Text>
              <ProgressBar
                progress={this.state.progress || 0}
                barStyle={{ width: 200 }}
              />
              <Text
                style={{
                  paddingLeft: 20,
                  display: this.state.status == 1 ? "flex" : "none"
                }}
              >
                {this.state.received} MB /{" "}
              </Text>
              <Text
                style={{
                  display: this.state.status == 1 ? "flex" : "none"
                }}
              >
                {this.state.total} MB
              </Text>
            </View>

            <View
              style={[
                styles.statusBar,
                {
                  display: this.state.status == 3 ? "flex" : "none"
                }
              ]}
            >
              <Text style={{ marginRight: 10 }}>课程入库中</Text>
              <Spinner color={commonStyle.color.primary} type="Circle" />
            </View>
            <View
              style={[
                styles.statusBar,
                {
                  display: this.state.status == 5 ? "flex" : "none"
                }
              ]}
            >
              <Button
                light
                style={[styles.downloadBtn]}
                onPress={() => {
                  this.refs.bookDialog.dismiss();
                }}
              >
                <Text>该课程已下载</Text>
                <Icon
                  name="check"
                  style={{
                    color: commonStyle.color.primary,
                    fontSize: 24,
                    marginRight: 5
                  }}
                />
              </Button>
            </View>
          </View>
        </View>
      </PopupDialog>
    );
  }
}

const styles = StyleSheet.create({
  dialogBody: {
    padding: 10,
    flex: 1
  },
  dialogInfos: {
    flex: 1,
    flexDirection: "row"
  },
  bookImg: {
    height: 120,
    width: 120
  },
  dialogBookSummary: {
    flex: 1,
    marginLeft: 20,
    marginBottom: 10
  },
  dialogBtns: {
    height: 60,
    justifyContent: "center"
  },
  downloadBtn: {
    height: 50,
    width: 200,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  statusBar: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});
