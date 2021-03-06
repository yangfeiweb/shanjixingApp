import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  AsyncStorage,
  DeviceEventEmitter
} from "react-native";
import { withNavigation } from "react-navigation";
import { Button } from "native-base";
import { courseController } from "../../controller";
import commonStyle from "../../globalStyle";
import dataService from "../../services";
import { utility } from "../../utility";
import {
  NoticeBar,
  Header,
  LeftUserInfo,
  Loading,
  SyncBar,
  BookDownload
} from "../../components";
import { BookItem, BookRemoveConfirm, LearnTypeDialog } from "./children";
import booksDB from "../../db/booksDB";
import { LEARN_TYPE } from "../../utility/dict";

class LearnList extends React.Component {
  constructor(props) {
    super(props);
    let deviceH = Dimensions.get("window").height;
    let deviceW = Dimensions.get("window").width;
    this.columns = Math.floor(deviceW / 300);

    utility.getCurrUserInfo().then(userInfo => {
      this.studentInfo = userInfo;
      this.studentNo = this.studentInfo.studentNo;
      courseController.getBookList().then(
        res => {
          this.getUserBooks();
        },
        err => {
          this.getUserBooks();
        }
      );
    });

    this.state = {
      showSelect: false,
      bookList: [],
      progress: 20,
      selectedData: [],
      bookGetted: false,
      showLoading: false
    };
    this.bookComponents = [];
  }
  componentDidMount() {
    this.refs.loading.show();
    this.refreshEmitter = DeviceEventEmitter.addListener(
      "refreshBookList",
      () => {
        this.getUserBooks();
      }
    );
    this.syncEmitter = DeviceEventEmitter.addListener("syncUpload", () => {
      this.refs.syncBar.startSync();
    });
  }
  componentWillUnmount() {
    this.refreshEmitter && this.refreshEmitter.remove();
    this.syncEmitter && this.syncEmitter.remove();
  }
  getUserBooks() {
    courseController
      .getUserBooksList(this.studentNo)
      .then(books => {
        // utility.log("---------user..books..", books);
        this.setState({
          bookList: books,
          bookGetted: true
        });
        this.refs.loading.hide();
      })
      .catch(e => {
        this.refs.loading.hide();
      });
  }
  setSelecting(select) {
    // this.setState({
    //   showLoading: true
    // });
    this.refs.loading.show();
    setTimeout(() => {
      this.setState({
        showSelect: select
      });
    }, 100);
  }
  selectBookItem(bookComponent, data, isAdd = true) {
    let itemIdx = this.state.selectedData.findIndex(item => {
      return item.bookNo === data.bookNo;
    });
    let currData = this.state.selectedData;
    if (isAdd) {
      if (itemIdx === -1) {
        currData.push(data);
        this.bookComponents.push(bookComponent);
      }
    } else {
      if (itemIdx !== -1) {
        currData.splice(itemIdx, 1);
        let componentIdx = this.bookComponents.findIndex(item => {
          return item === bookComponent;
        });
        if (componentIdx !== -1) {
          this.bookComponents.splice(componentIdx, 1);
        }
      }
    }
  }
  lastBookItemUpdated() {
    this.refs.loading.hide();
  }
  removeSelectedBooks() {
    // 删除操作
    let bookNos = [];
    this.state.selectedData.forEach(item => {
      bookNos.push(item.bookNo);
    });
    dataService.markBooksRemove(bookNos.join(",")).then(
      res => {
        let code = res.code;
        if (code === 200) {
          // 删除本地数据
          courseController
            .removeBookFromCache(this.studentNo, bookNos)
            .then(success => {
              let books = [];
              this.state.bookList.map(item => {
                if (
                  this.state.selectedData.findIndex(book => {
                    return item.bookNo === book.bookNo;
                  }) === -1
                ) {
                  books.push(item);
                }
              });
              this.refs.noticeBar.hide();
              this.bookComponents = [];
              DeviceEventEmitter.emit("refreshBookList");
              this.setState({
                bookList: books,
                showSelect: false,
                selectedData: []
              });
            });
        }
      },
      err => {
        utility.Toast("删除课本失败，请确保网络正常连接！");
      }
    );
  }
  clearBooksRecord() {
    let bookNos = [];
    this.state.selectedData.forEach(item => {
      bookNos.push(item.bookNo);
    });
    dataService.clearBookRecord(bookNos.join(",")).then(
      res => {
        if (res.code === 200) {
          courseController
            .clearBookRecord(this.studentNo, bookNos)
            .then(success => {
              DeviceEventEmitter.emit("refreshBookList");
              this.state.selectedData.forEach(item => {
                item.totalRight = 0;
                item.totalError = 0;
              });
              this.refs.noticeBar.hide();
              this.bookComponents = [];
              this.setState({
                bookList: this.state.bookList,
                showSelect: false,
                selectedData: []
              });
            });
        } else {
          utility.Toast("清除课本记录失败，请重试！");
        }
      },
      err => {
        utility.Toast("清除课本记录失败，请确保网络正常连接！");
      }
    );
  }
  cancelDelete() {
    this.refs.noticeBar.hide();
    this.bookComponents.forEach(item => {
      item.setState({
        selected: false
      });
    });
    this.bookComponents = [];

    this.setState({
      showSelect: false,
      selectedData: []
    });
  }
  startLearn(bookInfo) {
    // let days = utility.computeDays(
    //   this.studentInfo.vipDeadTime,
    //   this.studentInfo.serverTime
    // );
    utility.getVipRemainDay().then(days => {
      this.setState(
        {
          currBook: bookInfo
        },
        () => {
          if (bookInfo.bookType === "FREE" || days > 0) {
            let forceUpdate = bookInfo.versionCode !== bookInfo.userVersion;
            if (forceUpdate) {
              utility.Toast("课本有更新，正在下载最新版！");
            }
            this.refs.bookDownload.checkBookCached(forceUpdate).then(
              success => {
                // 记录用户学习
                let learnType = bookInfo.learnType || LEARN_TYPE.DEFAULT;
                let bookNo = bookInfo.bookNo;
                dataService
                  .recordBookLearn(bookInfo.bookNo, learnType)
                  .then(res => {
                    if (res.code === 200) {
                      let updateTime = res.data.updateTime;
                      booksDB
                        .recordBookLearnInfo(
                          this.studentNo,
                          bookNo,
                          learnType,
                          updateTime
                        )
                        .then(success => {
                          this.props.navigation.navigate("Learning", {
                            bookNo: bookNo,
                            bookType: bookInfo.bookSort,
                            learnType: learnType,
                            canExam: bookInfo.canExam
                          });
                        });
                    }
                  });
              },
              err => {}
            );
          } else {
            DeviceEventEmitter.emit("showRecharge");
          }
        }
      );
    });
  }
  selectLearnType(data) {
    this.setState(
      {
        bookInfo: data
      },
      () => {
        this.refs.LearnTypeDialog && this.refs.LearnTypeDialog.show();
      }
    );
  }
  renderBookList() {
    let count = this.state.bookList.length;
    if (count > 0) {
      return this.state.bookList.map((item, idx) => {
        let boomCompt = (
          <BookItem
            key={item.bookNo}
            data={item}
            showSelect={this.state.showSelect}
            setSelecting={() => {
              if (!this.state.showSelect) {
                this.refs.noticeBar.show();
                this.setSelecting(true);
              }
            }}
            selectBookItem={(bookComponent, data, isAdd) => {
              this.selectBookItem(bookComponent, data, isAdd);
            }}
            onBookPress={bookInfo => {
              this.startLearn(bookInfo);
            }}
            selectLearnType={data => {
              // this.selectLearnType(data);
            }}
          />
        );
        if (idx === count - 1) {
          return (
            <BookItem
              key={item.bookNo}
              data={item}
              showSelect={this.state.showSelect}
              setSelecting={() => {
                if (!this.state.showSelect) {
                  this.refs.noticeBar.show();
                  this.setSelecting(true);
                }
              }}
              selectBookItem={(bookComponent, data, isAdd) => {
                this.selectBookItem(bookComponent, data, isAdd);
              }}
              updated={() => {
                this.lastBookItemUpdated();
              }}
              onBookPress={bookInfo => {
                this.startLearn(bookInfo);
              }}
              selectLearnType={data => {
                this.selectLearnType(data);
              }}
            />
          );
        }
        return boomCompt;
      });
    } else {
      return (
        <View style={styles.emptyView}>
          {!this.state.bookGetted && (
            <Text style={styles.emptyTips}>获取课本中...</Text>
          )}
          {this.state.bookGetted && (
            <Text style={styles.emptyTips}>快去课程中心下载课程学习吧！</Text>
          )}
        </View>
      );
    }
  }
  render() {
    return (
      <View style={styles.learnContainer}>
        <Header title="学习中心">
          <LeftUserInfo slot="left" />
          <SyncBar slot="right" ref="syncBar" />
        </Header>
        <ScrollView style={styles.scrollView}>
          <View style={styles.bookList}>{this.renderBookList()}</View>
        </ScrollView>
        <NoticeBar ref="noticeBar" height={60}>
          <View style={styles.noticeContent}>
            <View style={styles.tips}>
              <Text style={styles.tipsText}>课本操作</Text>
            </View>
            <View style={styles.btns}>
              <Button
                info
                style={styles.btn}
                onPress={() => {
                  if (this.state.selectedData.length == 0) {
                    return;
                  }
                  this.setState({
                    removeType: "remove"
                  });
                  this.refs.bookRemoveConfirm.show();
                }}
              >
                <Text style={{ color: "#fff" }}>移除课本列表</Text>
              </Button>
              <Button
                danger
                style={styles.btn}
                onPress={() => {
                  if (this.state.selectedData.length == 0) {
                    return;
                  }
                  this.setState({
                    removeType: "clear"
                  });
                  this.refs.bookRemoveConfirm.show();
                }}
              >
                <Text style={{ color: "#fff" }}>清空课本学习记录</Text>
              </Button>
              <Button
                light
                style={[styles.btn, { width: 80 }]}
                onPress={() => {
                  this.cancelDelete();
                }}
              >
                <Text>取消</Text>
              </Button>
            </View>
          </View>
        </NoticeBar>
        <BookRemoveConfirm
          ref="bookRemoveConfirm"
          removeType={this.state.removeType}
          onOK={() => {
            if (this.state.removeType === "remove") {
              this.removeSelectedBooks();
            } else {
              this.clearBooksRecord();
            }
          }}
          onCancel={() => {
            this.cancelDelete();
          }}
        />
        <LearnTypeDialog ref="LearnTypeDialog" data={this.state.bookInfo} />
        <BookDownload ref="bookDownload" bookInfo={this.state.currBook} />
        <Loading hideTitle ref="loading" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  learnContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  header: {
    height: 80,
    width: "100%"
  },
  scrollView: {
    width: "100%",
    flex: 1
  },
  bookList: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  noticeContent: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    flexDirection: "row"
  },
  tips: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  tipsText: {
    fontSize: 20
  },
  btns: {
    // width: 200
    flexDirection: "row"
  },
  btn: {
    height: 40,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 20
  },
  emptyView: {
    flex: 1,
    height: 300,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyTips: {
    fontSize: 20,
    color: commonStyle.color.primary
  }
});

export default withNavigation(LearnList);
