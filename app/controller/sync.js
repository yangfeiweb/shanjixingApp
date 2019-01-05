import dataService from "../services";
import booksDB from "../db/booksDB";
import { utility } from "../utility";
import { SYNC_TYPE, EXAM_TYPE } from "../utility/dict";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";
import { courseController, learn } from ".";
import { LEARN_TYPE, BOOK_TYPE_ENGLISH } from "../utility/dict";

// 检查是否要下载云端数据
function checkDownloadSync(studentNo) {
  return new Promise((resolve, reject) => {
    dataService.getBookRecords().then(res => {
      if (res.code === 200) {
        let content = res.data.content;
        if (content && content.length) {
          // 查询本地的时间
          booksDB.getBookRecordTime(studentNo).then(data => {
            let maxTime = data[0].maxTime;
            // let alertArr = [];
            // alertArr.push("max====" + maxTime);
            // content.forEach(item => {
            //   alertArr.push("--item------" + item.updateTime);
            // });
            // alert(alertArr.join("\r\n"));
            if (maxTime) {
              let localDate = utility.timeStrToObj(maxTime);
              let laterTime = content.find(item => {
                return utility.timeStrToObj(item.updateTime) - localDate > 0;
              });
              resolve(laterTime !== undefined);
            } else {
              resolve(true);
            }
          });
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  });
}

// 同步所有课本的学习数据到云端
function syncAllBookToCloud(studentNo) {
  let syncBooks = [];
  let currIdx = 0;
  return new Promise((resolve, reject) => {
    // 1. 获取所有的课本
    booksDB.getNeedSyncBooks(studentNo).then(books => {
      syncBooks = books;
      if (syncBooks.length) {
        _syncBookToCloudRecursion(resolve, reject);
      } else {
        resolve();
      }
    });
  });

  // 递归同步课本信息
  function _syncBookToCloudRecursion(resolve, reject) {
    let currBookInfo = syncBooks[currIdx];
    let bookNo = currBookInfo.bookNo;
    syncLocalBookToCloud(studentNo, bookNo, "DEFAULT").then(
      res => {
        currIdx++;
        if (currIdx < syncBooks.length) {
          _syncBookToCloudRecursion(resolve, reject);
        } else {
          resolve();
        }
      },
      err => {
        reject(err);
      }
    );
  }
}

// 同步数据到云端，一次最多取2000条数据
function syncLocalBookToCloud(studentNo, bookNo, learnType = "DEFAULT") {
  return new Promise((resolve, reject) => {
    // 1. 查找要同步的数据，并拼接数据为指定的格式
    _buildBookColumnsData(studentNo, bookNo, learnType)
      .then(data => {
        // utility.log("-------sync..book..-culumn..data...", data);
        // resolve(); // test
        // return;
        if (!data) {
          resolve();
          return;
        }
        let syncData = {
          studentNo: studentNo,
          bookNo: bookNo,
          learnType: learnType,
          columns: data
        };
        // 2. 调用同步接口
        utility.log("========sync=book...data...", syncData);
        let base64Data = Base64.stringify(Utf8.parse(JSON.stringify(syncData)));
        dataService.syncDataToCloud(SYNC_TYPE.BOOK, base64Data).then(res => {
          utility.log("------sync..book..res..", res);
          if (res.code === 200) {
            // 3. 成功后更新数据库标识
            courseController.signDBSyncFlag(syncData, "book").then(dbRes => {
              resolve();
            });
          }
        });
      })
      .catch(e => {
        reject(e);
      });
  });
}

// 同步学习记录到云端
function syncLearnRecordToCloud(studentNo) {
  return new Promise((resolve, reject) => {
    booksDB.getSyncLearnRecords(studentNo).then(record => {
      if (record.length === 0) {
        resolve();
        return;
      }
      let recordArr = [];
      record.forEach(item => {
        let learnDate = item.learnDate;
        if (learnDate.indexOf("-") > 0) {
          learnDate = utility.dateToDateShortStr(
            utility.timeStrToObj(learnDate)
          );
        }
        recordArr.push({
          bookNo: item.bookNo,
          learnType: item.learnType.toUpperCase(),
          columnNo: item.columnNo,
          rightNum: item.rightNum,
          wrongNum: item.errorNum,
          time: item.learnDate,
          learnTimes: item.learnTimes,
          learnSeconds: item.learnedTime, // 当前单位ms
          createTime: utility.dateStandardStrToShortStr(item.createTime)
        });
      });
      let recordData = {
        studentNo: studentNo,
        records: recordArr
      };

      // utility.log("========sync=record...data...", recordData);
      let base64Data = Base64.stringify(Utf8.parse(JSON.stringify(recordData)));
      dataService
        .syncDataToCloud(SYNC_TYPE.LEARN_RECORD, base64Data)
        .then(res => {
          if (res.code === 200) {
            courseController.signDBSyncFlag(recordData, "learnRecord").then(
              success => {
                resolve();
              },
              err => {
                reject();
              }
            );
          } else {
            reject();
          }
        });
    });
  });
}

// 同步测试成绩到云端（逐条同步）
// 试卷表有不同类型，分为选择题类型和拼写类型的试卷
function syncLearnExamToCloud(studentNo) {
  // 循环同步各个试卷成绩
  let syncExams = [];
  let currIdx = 0;
  return new Promise((resolve, reject) => {
    booksDB.getAllSyncExamList(studentNo).then(examlist => {
      syncExams = examlist;
      if (syncExams.length) {
        _syncExamToCloudRecursion(resolve, reject);
      } else {
        resolve();
      }
    });
  });

  // 递归同步测试记录到云端
  function _syncExamToCloudRecursion(resolve, reject) {
    let currExamRecord = syncExams[currIdx];
    _syncLocalExamToCloud(studentNo, currExamRecord).then(
      res => {
        currIdx++;
        if (currIdx < syncExams.length) {
          _syncExamToCloudRecursion(resolve, reject);
        } else {
          resolve();
        }
      },
      err => {
        reject(err);
      }
    );
  }
}

function clearLocalData(studentNo) {
  return booksDB.clearUsersRecord(studentNo);
}

// 检查本地的课本列表，如果没有，则下载所有的课本列表
function checkBookList() {
  return new Promise((resolve, reject) => {
    booksDB.getBookList().then(books => {
      if (books.length > 0) {
        resolve(books);
      } else {
        courseController.getBookList().then(data => {
          resolve(data);
        });
      }
    });
  });
}

// 获取已加入学习的课本列表
function getDownloadedBookList(studentNo) {
  return new Promise((resolve, reject) => {
    dataService.getDownloadBooks().then(
      res => {
        if (res.code === 200) {
          let content = res.data.content;
          let userBooks = [];
          content &&
            content.forEach(item => {
              userBooks.push({
                studentNo: studentNo,
                versionCode: item.versionCode,
                bookNo: item.bookNo,
                orders: item.orders,
                synced: 1
              });
            });
          resolve(userBooks);
        } else {
          reject();
        }
      },
      err => {
        reject(err);
      }
    );
  });
}

// 设置课本的记录
function setBookRecordSynced(userBooks) {
  return new Promise((resolve, reject) => {
    dataService.getBookRecords().then(
      res => {
        if (res.code === 200) {
          let records = res.data.content;
          userBooks.forEach(item => {
            let recordInfo = records.find(record => {
              return (
                record.studentNo === item.studentNo &&
                record.bookNo === item.bookNo
              );
            });
            if (recordInfo) {
              item["learnType"] = recordInfo.learnType;
              item["updateTime"] = recordInfo.updateTime;
            } else {
              item["learnType"] = LEARN_TYPE.DEFAULT;
            }
          });
          booksDB.insertUserBookData(userBooks).then(
            res => {
              resolve();
            },
            err => {
              reject(err);
            }
          );
        } else {
          reject();
        }
      },
      err => {
        reject(err);
      }
    );
  });
}
// 按照课本下载课程栏目进度
// 按课本下载课本栏目进度
// 每本课本按照 learnType 获取
function downloadColumnSchedules(studentNo, bookList, progressCb) {
  let currBookIdx = 0;
  let bookCount = bookList.length;
  return new Promise((resolve, reject) => {
    if (bookCount) {
      _getBookColumnSchedule(resolve, reject);
    } else {
      resolve();
    }
  });

  function _getBookColumnSchedule(resolve, reject) {
    let book = bookList[currBookIdx];
    let bookNo = book.bookNo;
    let bookSort = book.bookSort;
    // 判断是否要取其他学习类型的数据
    let learnType = LEARN_TYPE.DEFAULT; // 分别取不同type的数据
    getColumnScheduleByType(studentNo, bookNo, learnType).then(success => {
      // TODO 如果需要同步其他的课程类型，则再次调用，暂时按照 DEFAULT 取
      currBookIdx++;
      progressCb && progressCb(Math.floor(currBookIdx * 100 / bookCount));
      if (currBookIdx < bookCount) {
        _getBookColumnSchedule(resolve, reject);
      } else {
        resolve();
      }
    });
  }
}

function getColumnScheduleByType(studentNo, bookNo, learnType) {
  return new Promise((resolve, reject) => {
    dataService.getColumnSchedule(bookNo, learnType).then(res => {
      if (res.code === 200) {
        // 入库
        let data = res.data.columns;
        if (data.length) {
          let columnArr = [];
          data.forEach(item => {
            columnArr.push({
              studentNo: studentNo,
              bookNo: item.bookNo,
              learnType: item.learnType || LEARN_TYPE.DEFAULT, // miss
              columnNo: item.columnNo,
              rightNum: item.totalLearn,
              errorNum: item.totalWordNote,
              updateTime: item.updateTime, // miss
              synced: 1
            });
          });
          booksDB.insertColumnSchedule(columnArr).then(
            success => {
              resolve();
            },
            err => {
              reject();
            }
          );
        } else {
          resolve();
        }
      } else {
        reject();
      }
    });
  });
}

// 下载所有的正确的单词
// 按分页下载
function downloadAllRightWords(studentNo, progressCb) {
  let totalPages = 0;
  let currPage = 0;
  return new Promise((resolve, reject) => {
    _getRightWords(resolve, reject);
  });
  function _getRightWords(resolve, reject) {
    dataService.getRightWords(currPage).then(
      res => {
        if (res.code === 200) {
          totalPages = res.data.totalPages;
          let content = res.data.content;
          if (content.length) {
            let words = [];
            content.forEach(item => {
              words.push({
                studentNo: studentNo,
                bookNo: item.bookNo,
                columnNo: item.columnNo,
                wordNo: item.wordNo,
                learnType: item.learnType || LEARN_TYPE.DEFAULT, // miss
                learnedTime: item.learnedTime,
                createTime: item.learnedTime,
                synced: 1
              });
            });
            booksDB.insertRightWords(words).then(
              res => {
                currPage++;
                progressCb &&
                  progressCb(Math.floor(currPage * 100 / totalPages));
                if (currPage < totalPages) {
                  _getRightWords(resolve, reject);
                } else {
                  resolve();
                }
              },
              err => {
                reject();
              }
            );
          } else {
            resolve();
          }
        }
      },
      err => {
        reject();
      }
    );
  }
}

// 下载所有的错误单词
// 按分页下载
function downloadAllErrorWords(studentNo, progressCb) {
  let totalPages = 0;
  let currPage = 0;
  return new Promise((resolve, reject) => {
    _getErrorWords(resolve, reject);
  });
  function _getErrorWords(resolve, reject) {
    dataService.getErrorWords(currPage).then(
      res => {
        if (res.code === 200) {
          totalPages = res.data.totalPages;
          let content = res.data.content;
          let words = [];
          if (content.length) {
            content.forEach(item => {
              words.push({
                studentNo: studentNo,
                bookNo: item.bookNo,
                columnNo: item.columnNo,
                wordNo: item.wordNo,
                status: item.status,
                learnType: item.learnType || LEARN_TYPE.DEFAULT, // miss
                createTime: item.createTime,
                reviewNum: item.reviewNum,
                reviewOneTime: item.reviewOneTime || "",
                reviewTwoTime: item.reviewTwoTime || "",
                reviewThreeTime: item.reviewThreeTime || "",
                reviewFourTime: item.reviewFourTime || "",
                reviewFiveTime: item.reviewFiveTime || "",
                synced: 1
              });
            });
            booksDB.insertErrorWords(words).then(
              res => {
                progressCb &&
                  progressCb(Math.floor(currPage * 100 / totalPages));
                if (currPage < totalPages - 1) {
                  currPage++;
                  _getErrorWords(resolve, reject);
                } else {
                  resolve();
                }
              },
              err => {
                reject();
              }
            );
          } else {
            progressCb && progressCb(100);
            resolve();
          }
        }
      },
      err => {
        reject();
      }
    );
  }
}

// 下载所有的学习时长记录
// 按分页下载
function downloadLearnTimeRecord(studentNo, progressCb) {
  let totalPages = 0;
  let currPage = 0;
  return new Promise((resolve, reject) => {
    _getLearnTimeRecord(resolve, reject);
  });
  function _getLearnTimeRecord(resolve, reject) {
    dataService.getLearnTimeRecord(currPage).then(
      res => {
        if (res.code === 200) {
          totalPages = res.data.totalPages;
          let content = res.data.content;
          if (content.length) {
            let records = [];
            content.forEach(item => {
              let learnDate = item.time;
              let synced = 1;
              if (learnDate.indexOf("-") > 0) {
                learnDate = utility.dateToDateShortStr(
                  utility.timeStrToObj(learnDate)
                );
                synced = 0;
              }
              records.push({
                studentNo: studentNo,
                bookNo: item.bookNo,
                columnNo: item.columnNo,
                learnDate: learnDate,
                learnType: item.learnType || LEARN_TYPE.DEFAULT,
                learnedTime: item.learnSeconds,
                rightNum: item.rightNum,
                errorNum: item.wrongNum,
                learnTimes: item.learnTimes,
                createTime: item.createTime,
                synced: synced
              });
            });
            booksDB.insertLearnRecords(records).then(
              res => {
                currPage++;
                progressCb &&
                  progressCb(Math.floor(currPage * 100 / totalPages));
                if (currPage < totalPages) {
                  _getLearnTimeRecord(resolve, reject);
                } else {
                  resolve();
                }
              },
              err => {
                reject();
              }
            );
          } else {
            resolve();
          }
        }
      },
      err => {
        reject();
      }
    );
  }
}

// 分页下载试卷列表信息
function downloadExamList(progressCb) {
  let totalPages = 0;
  let currPage = 0;
  let examRecords = [];
  let currExamIdx = 0;
  return new Promise((resolve, reject) => {
    _getExamList(() => {
      if (examRecords.length) {
        _downloadExamDetails(resolve);
      } else {
        progressCb && progressCb(100);
        resolve();
      }
    }, reject);
  });
  function _getExamList(resolve, reject) {
    dataService.getExamList(currPage).then(res => {
      if (res.code === 200) {
        totalPages = res.data.totalPages;
        let content = res.data.content || [];
        examRecords = examRecords.concat(content);
        if (currPage < totalPages - 1) {
          currPage++;
          _getExamList(resolve);
        } else {
          resolve && resolve();
        }
      }
    });
  }

  // 下载试卷详情信息
  function _downloadExamDetails(resolve, reject) {
    let examInfo = examRecords[currExamIdx];
    let id = examInfo.id;
    let examRecord = {
      studentNo: examInfo.studentNo,
      bookNo: examInfo.bookNo,
      examType: examInfo.examType,
      name: examInfo.name,
      total: examInfo.total,
      rightCount: examInfo.corrects,
      errorCount: examInfo.incorrects,
      startTime: examInfo.startTime,
      finishedTime: examInfo.finishedTime,
      score: examInfo.score,
      cloudId: id,
      synced: 1
    };
    dataService.getExamDetails(id).then(
      res => {
        if (res.code === 200) {
          let examDetails = res.data;
          let detailsArr = [];
          examDetails.forEach(item => {
            detailsArr.push({
              examId: item.examId,
              bookNo: item.bookNo,
              columnNo: item.columnNo,
              wordNo: item.wordNo,
              wordName: item.word,
              itemA: item.a,
              itemB: item.b,
              itemC: item.c,
              itemD: item.d,
              rightItem: item.correct,
              answerItem: item.answer,
              finishedTime: item.finishedTime,
              synced: 1
            });
          });
          booksDB
            .insertExamRecord(examInfo.id, examRecord, detailsArr)
            .then(success => {
              currExamIdx++;
              progressCb &&
                progressCb(Math.floor(currExamIdx * 100 / examRecords.length));
              if (currExamIdx < examRecords.length) {
                _downloadExamDetails(resolve, reject);
              } else {
                resolve && resolve();
              }
            });
        }
      },
      err => {
        reject();
      }
    );
  }
}

function _syncLocalExamToCloud(studentNo, examData) {
  return new Promise((resolve, reject) => {
    let examId = examData.id;
    let examType = examData.examType;
    // 冗余之前的类型
    if (examType === "learn_before_test") {
      examType = EXAM_TYPE.COLUMN_WORD_BEFORE;
    } else if (examType === "learn_after_test") {
      examType = EXAM_TYPE.COLUMN_WORD_AFTER;
    } else if (examType === "word_test") {
      examType = EXAM_TYPE.WORD;
    }
    let name = examData.name;
    let startTime = utility.dateStandardStrToShortStr(examData.startTime);
    let finishedTime = utility.dateStandardStrToShortStr(examData.finishedTime);
    let score = examData.score;
    let bookNo = examData.bookNo; // 课本测试时，毕传参数
    booksDB.getSyncExamDetails(examId, examType).then(details => {
      // 1. 构建同步数据
      let syncExamData = {
        studentNo: studentNo,
        syncId: examId,
        examType: examType,
        name: examData.name,
        createTime: startTime,
        startTime: startTime,
        finishedTime: finishedTime,
        score: score
      };
      // 拼写测试
      let records = [];
      if (examType.indexOf("SPELL") > -1) {
        details.forEach(item => {
          let itemFinishedTime = item.finishedTime;
          if (!itemFinishedTime) {
            itemFinishedTime = finishedTime;
          } else {
            itemFinishedTime = utility.dateStandardStrToShortStr(
              itemFinishedTime
            );
          }
          records.push({
            bookNo: item.bookNo,
            columnNo: item.columnNo,
            wordNo: item.wordNo,
            word: item.word,
            chinese: item.chinese,
            answer: item.answer,
            finishedTime: itemFinishedTime
          });
        });
        syncExamData["records"] = records;
        _postExamRecord(SYNC_TYPE.EXAM_SPELL, syncExamData, resolve, reject);
      } else {
        if (examType !== "WORD") {
          if (!bookNo) {
            bookNo = details[0].bookNo;
            syncExamData["bookNo"] = bookNo;
          }
          let bookNo = details[0].bookNo;
          let wordNo = details[0].wordNo;
          let columnNo = details[0].columnNo;
          if (!columnNo) {
            // find columnNo
            booksDB.getBookColumnsWordIds(bookNo).then(bookColumns => {
              let columnInfo = bookColumns.find(columm => {
                let wordIds = columm.wordIds;
                return wordIds.indexOf(wordNo) !== -1;
              });
              if (columnInfo) {
                columnNo = columnInfo.columnNo;
                // 2. 数据异常处理，并更新到本地数据库
                booksDB.fixedExamRecord(examId, columnNo, bookNo);
                // 更新本地数据库中的columnNo
                details.forEach(item => {
                  let itemFinishedTime = item.finishedTime;
                  if (!itemFinishedTime) {
                    itemFinishedTime = finishedTime;
                  } else {
                    itemFinishedTime = utility.dateStandardStrToShortStr(
                      itemFinishedTime
                    );
                  }
                  let recordItem = {
                    wordNo: item.wordNo,
                    columnNo: columnNo,
                    word: item.wordName,
                    answer: item.answerItem,
                    finishedTime: itemFinishedTime,
                    a: item.itemA,
                    b: item.itemB,
                    c: item.itemC,
                    d: item.itemD,
                    correct: item.rightItem
                  };
                  records.push(recordItem);
                });
              }
              syncExamData["records"] = records;
              _postExamRecord(SYNC_TYPE.EXAM, syncExamData, resolve, reject);
            });
          } else {
            details.forEach(item => {
              let itemFinishedTime = item.finishedTime;
              if (!itemFinishedTime) {
                itemFinishedTime = finishedTime;
              } else {
                itemFinishedTime = utility.dateStandardStrToShortStr(
                  itemFinishedTime
                );
              }
              let recordItem = {
                wordNo: item.wordNo,
                columnNo: columnNo,
                word: item.wordName,
                answer: item.answerItem,
                finishedTime: itemFinishedTime,
                a: item.itemA,
                b: item.itemB,
                c: item.itemC,
                d: item.itemD,
                correct: item.rightItem
              };
              records.push(recordItem);
            });
            syncExamData["records"] = records;
            _postExamRecord(SYNC_TYPE.EXAM, syncExamData, resolve, reject);
          }
        } else {
          details.forEach(item => {
            let itemFinishedTime = item.finishedTime;
            if (!itemFinishedTime) {
              itemFinishedTime = finishedTime;
            } else {
              itemFinishedTime = utility.dateStandardStrToShortStr(
                itemFinishedTime
              );
            }
            let recordItem = {
              wordNo: item.wordNo,
              word: item.wordName,
              answer: item.answerItem || undefined,
              finishedTime: itemFinishedTime,
              a: item.itemA,
              b: item.itemB,
              c: item.itemC,
              d: item.itemD,
              correct: item.rightItem
            };
            records.push(recordItem);
          });
          syncExamData["records"] = records;
          _postExamRecord(SYNC_TYPE.EXAM, syncExamData, resolve, reject);
        }
      }
    });
  });
}

function _postExamRecord(syncType, syncData, resolve, reject) {
  // base64 data
  let base64Data = Base64.stringify(Utf8.parse(JSON.stringify(syncData)));
  dataService.syncDataToCloud(syncType, base64Data).then(
    res => {
      if (res.code === 200 || res.code === 700) {
        // 4. 成功后调用同步synced 接口
        let examId = syncData.syncId;
        booksDB
          .updateExamSynced(examId)
          .then(success => {
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      } else {
        reject();
      }
    },
    err => {
      reject(err);
    }
  );
}

// 构造课本中要同步的信息
function _buildBookColumnsData(studentNo, bookNo, learnType) {
  return new Promise((resolve, reject) => {
    //   1.1 课本获取栏目信息（正确词、错误数量）
    booksDB
      .getSyncColumnInfos(studentNo, bookNo, learnType, true)
      .then(columns => {
        let columnArr = [];
        if (columns.length === 0) {
          resolve();
          return;
        }

        columns.forEach(column => {
          columnArr.push({
            columnNo: column.columnNo,
            rightNum: column.rightNum,
            wrongNum: column.errorNum,
            status: column.status,
            createTime: utility.dateStandardStrToShortStr(column.createTime),
            updateTime: utility.dateStandardStrToShortStr(
              column.updateTime || utility.getNowDateTimeStr()
            )
          });
        });

        let rightGetted = false;
        let errGetted = false;
        booksDB
          .getSyncBookRightWords(studentNo, bookNo, learnType)
          .then(rightWords => {
            if (rightWords.length > 0) {
              columnArr.forEach(columnData => {
                let columnNo = columnData.columnNo;
                // let learnsArr = rightWords.filter(item => {
                //   return (item.columnNo = columnNo);
                // });

                let learnsArr = [];
                rightWords.forEach(right => {
                  if (right.columnNo === columnNo) {
                    learnsArr.push({
                      wordNo: right.wordNo,
                      status: "ENABLED",
                      learnedTime: utility.dateStandardStrToShortStr(
                        right.createTime
                      ),
                      learnSeconds: right.learnedTime
                    });
                  }
                });

                if (learnsArr.length) {
                  columnData["learns"] = learnsArr;
                }
              });
            }
            if (errGetted) {
              resolve(columnArr);
            }
            rightGetted = true;
          });
        booksDB
          .getSyncBookErrWords(studentNo, bookNo, learnType)
          .then(errWords => {
            if (errWords.length > 0) {
              columnArr.forEach(columnData => {
                let columnNo = columnData.columnNo;
                let errsArr = [];
                errWords.forEach(error => {
                  if (error.columnNo === columnNo) {
                    errsArr.push({
                      wordNo: error.wordNo,
                      status: "ENABLED",
                      createTime: utility.dateStandardStrToShortStr(
                        error.createTime
                      ),
                      reviewNum: error.reviewNum,
                      reviewOneTime:
                        utility.dateStandardStrToShortStr(
                          error.reviewOneTime
                        ) || undefined,
                      reviewTwoTime:
                        utility.dateStandardStrToShortStr(
                          error.reviewTwoTime
                        ) || undefined,
                      reviewThreeTime:
                        utility.dateStandardStrToShortStr(
                          error.reviewThreeTime
                        ) || undefined,
                      reviewFourTime:
                        utility.dateStandardStrToShortStr(
                          error.reviewFourTime
                        ) || undefined,
                      reviewFiveTime:
                        utility.dateStandardStrToShortStr(
                          error.reviewFiveTime
                        ) || undefined
                    });
                  }
                });
                if (errsArr.length) {
                  columnData["wordNotes"] = errsArr;
                }
              });
            }
            if (rightGetted) {
              resolve(columnArr);
            }
            errGetted = true;
          });
      });
  });
}

export default {
  syncAllBookToCloud,
  syncLocalBookToCloud,
  syncLearnRecordToCloud,
  syncLearnExamToCloud,
  checkBookList,
  getDownloadedBookList,
  downloadColumnSchedules,
  downloadAllRightWords,
  downloadAllErrorWords,
  downloadLearnTimeRecord,
  downloadExamList,
  checkDownloadSync,
  setBookRecordSynced,
  clearLocalData,
  getColumnScheduleByType
};
