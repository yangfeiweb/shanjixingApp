import { learnDB, booksDB } from "../db";
import { utility } from "../utility";
import dataService from "../services";

let repeatTimes = [1, 2, 5, 10, 19];
let trackPosition = [1, 3, 6, 12, 24, 48];

// 初始化要学习的单词
// 1. 查找要复习的单词
// 2. 查找column的所有单词
// 3. 查找column中正确的单词
// 4. 移除学过的单词，加入要复习的单词，构建这次学习的单词
function initLearnTrack(studentNo, bookNo, columnNo) {
  return new Promise((resolve, reject) => {
    learnDB
      .checkLearnColumnRecord(studentNo, bookNo, columnNo)
      .then(checked => {
        // 1. 查找要复习的单词（符合本次复习的所有单词）
        learnDB.getUserBookErrWords(studentNo, bookNo).then(res => {
          let errWords = [];
          let markedErrWrods = [];
          if (res.length) {
            // 1.1 移除12小时之内复习过的单词
            let nowTime = utility.getNowDate().valueOf();
            res.forEach(item => {
              let lastTimeStr = _getLastReviewTime(item);
              let lastTime = utility.timeStrToObj(lastTimeStr);
              // 1.2 查找时间间隔符合学习次数对应的时间间隔的单词
              if (nowTime - lastTime > 43200000) {
                let reviewedTimes = item.reviewNum;
                let repeatDuration = repeatTimes[reviewedTimes];
                let diff = Math.ceil((nowTime - lastTime) / 86400);
                if (repeatDuration < diff) {
                  // 符合复习条件
                  item["isReview"] = true;
                  errWords.push(item);
                }
              }
              if (item["reviewNum"] === 0 && item["columnNo"] === columnNo) {
                markedErrWrods.push(item);
              }
            });
            //   1.3 将符合复习条件的单词构造成完整的单词
          }
          // 2. 查找column的所有单词
          booksDB.getColumnWords(bookNo, columnNo).then(words => {
            // 3. 查找column中正确的单词
            learnDB
              .getColumnRightWords(studentNo, columnNo)
              .then(rightWords => {
                learnDB
                  .getColumnErrWords(studentNo, columnNo)
                  .then(columnErrWords => {
                    // 4. 移除学过的单词，加入要复习的单词，构建这次学习的单词
                    let newWords = [];
                    words.forEach(item => {
                      let rightIdx = rightWords.findIndex(rightW => {
                        return rightW.wordNo === item.wordNo;
                      });
                      let errIdx = columnErrWords.findIndex(errW => {
                        return (
                          errW.reviewNum !== 0 && errW.wordNo === item.wordNo
                        );
                      });
                      if (rightIdx === -1 && errIdx === -1) {
                        item["review"] = false;
                        item["studentNo"] = studentNo;
                        let matchedWrod = markedErrWrods.find(word => {
                          return word.wordNo === item.wordNo;
                        });
                        if (matchedWrod) {
                          item["wordErrored"] = true; // 标记单词曾经错过
                          item["reviewNum"] = 0; // 标记单词曾经错过
                        }
                        newWords.push(item);
                      }
                    });
                    let allWords = errWords.concat(newWords);
                    if (
                      rightWords.length < words.length &&
                      newWords.length === 0
                    ) {
                      // 处理之前的异常数据， 插入缺失的正确词，更新栏目进度
                      let missedWords = [];
                      words.forEach(item => {
                        if (
                          rightWords.findIndex(rightWord => {
                            return rightWord.wordNo === item.wordNo;
                          }) === -1
                        ) {
                          item["studentNo"] = studentNo;
                          missedWords.push(item);
                        }
                      });
                      learnDB
                        .complateColumnRightWords(
                          studentNo,
                          bookNo,
                          columnNo,
                          missedWords,
                          "DEFAULT"
                        )
                        .then(success => {
                          resolve({
                            reviewWords: errWords,
                            newWords: newWords,
                            resetColumnWords: true
                          });
                        });
                    } else {
                      resolve({ reviewWords: errWords, newWords: newWords });
                    }
                  });
              });
          });
        });
      })
      .catch(e => {
        reject(e);
      });
  });
}

// 初始化复习的单词
function initReviewTrack(studentNo, bookNo) {
  return new Promise((resolve, reject) => {
    // 1. 查找要复习的单词（符合本次复习的所有单词）
    learnDB.getUserBookErrWords(studentNo, bookNo).then(res => {
      let errWords = [];
      if (res.length) {
        // 1.1 移除12小时之内复习过的单词
        let nowTime = utility.getNowDate().valueOf();
        res.forEach(item => {
          let lastTimeStr = _getLastReviewTime(item);
          if (lastTimeStr) {
            let lastTime = utility.timeStrToObj(lastTimeStr);
            // 1.2 查找时间间隔符合学习次数对应的时间间隔的单词
            if (nowTime - lastTime > 43200000) {
              let reviewedTimes = item.reviewNum;
              let repeatDuration = repeatTimes[reviewedTimes];
              let diff = Math.ceil((nowTime - lastTime) / 86400);
              if (repeatDuration < diff) {
                // 符合复习条件
                item["isReview"] = true;
                errWords.push(item);
              }
            }
          }
        });
        resolve(errWords);
      }
    });
  });
}

// 检查是否已经插入了学习记录
function checkLearnColumnRecord(studentNo, bookNo, columnNo) {
  learnDB.checkLearnColumnRecord(studentNo, bookNo, columnNo);
}

// 更新课本的复习数据
function setBookReviewedDataToDB(data, reviewTimes, learnType = "DEFAULT") {
  return new Promise((resolve, reject) => {
    // 处理已经复习的单词，将其reviewNum+1，并记录最新的review time
    let updatedErrorData = [];
    let insertRightData = [];
    let reviewedTime = 0; // 学习时长
    let learnTimes = 0; // 学习次数
    data.forEach(item => {
      let reviewNum = item.reviewNum;
      let errorItem = {
        studentNo: item.studentNo,
        bookNo: item.bookNo,
        columnNo: item.columnNo,
        wordNo: item.wordNo,
        reviewNum: reviewNum + 1,
        learnType: learnType,
        synced: 0
      };
      reviewedTime += item.learnedTime;
      _setRiviewTimeObj(errorItem);
      updatedErrorData.push(errorItem);
      // 如果reviewNum==0，需要插入到正确此表
      if (reviewNum === 0) {
        insertRightData.push({
          studentNo: item.studentNo,
          bookNo: item.bookNo,
          columnNo: item.columnNo,
          wordNo: item.wordNo,
          learnedTime: item.learnedTime,
          synced: 0,
          learnType: learnType
        });
      }
    });
    learnDB
      .updateReviewData(
        updatedErrorData,
        insertRightData,
        reviewedTime,
        reviewTimes
      )
      .then(
        res => {
          resolve();
        },
        err => {
          reject(err);
        }
      );
  });
}

// 更新栏目的学习的数据
function setColumnLearnedDataToDB(
  rightWords,
  errWords,
  reviewNewWords,
  learnTimes,
  learnType = "DEFAULT"
) {
  return new Promise((resolve, reject) => {
    let rightArr = [];
    let errArr = [];
    let reviewNewArr = [];
    let totalLearnedTime = 0;
    // 1. 插入right word表
    rightWords.forEach(item => {
      totalLearnedTime += item.learnedTime;
      rightArr.push({
        studentNo: item.studentNo,
        bookNo: item.bookNo,
        columnNo: item.columnNo,
        wordNo: item.wordNo,
        learnedTime: item.learnedTime,
        synced: 0,
        learnType: learnType
      });
    });
    // 2. 插入error word表
    errWords.forEach(item => {
      totalLearnedTime += item.learnedTime;
      // 插入错误表
      let reviewNum = 0;
      if (
        rightWords.findIndex(rightWord => {
          return rightWord.wordNo === item.wordNo;
        }) > -1
      ) {
        reviewNum = 1;
      }
      let errorItem = {
        studentNo: item.studentNo,
        bookNo: item.bookNo,
        columnNo: item.columnNo,
        wordNo: item.wordNo,
        reviewNum: reviewNum,
        synced: 0,
        learnType: learnType
      };
      _setRiviewTimeObj(errorItem);
      errArr.push(errorItem);
    });
    // 3. 如果是review word插入right word表，同时更新error word表中的reviewNum 和 review time
    reviewNewWords.forEach(item => {
      totalLearnedTime += item.learnedTime;
      // 插入正确词表
      rightArr.push({
        studentNo: item.studentNo,
        bookNo: item.bookNo,
        columnNo: item.columnNo,
        wordNo: item.wordNo,
        learnedTime: item.learnedTime,
        synced: 0,
        learnType: learnType
      });
      //更新错误词表
      let reviewItem = {
        studentNo: item.studentNo,
        bookNo: item.bookNo,
        columnNo: item.columnNo,
        wordNo: item.wordNo,
        reviewNum: 1,
        synced: 0
      };
      _setRiviewTimeObj(reviewItem);
      reviewNewArr.push(reviewItem);
    });
    learnDB
      .insertLearnData(
        rightArr,
        errArr,
        reviewNewArr,
        totalLearnedTime,
        learnTimes
      )
      .then(
        success => {
          resolve();
        },
        err => {
          reject();
        }
      );
  });
}

// 清除学习记录
function clearColumnLearnRecord(studentNo, bookNo, columnNo) {
  return new Promise((resolve, reject) => {
    dataService.clearColumnRecord(bookNo, columnNo).then(res => {
      if (res.code === 200) {
        return learnDB.clearColumnLearnRecord(studentNo, bookNo, columnNo).then(
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
}

// 获取学习记录统计
function getLearnStatistics(studentNo, startDate, endDate) {
  return learnDB.getLearnStatistics(studentNo, startDate, endDate);
}

// 获取错误单词的review time
function _setRiviewTimeObj(wordData) {
  let nowDate = utility.getNowDateTimeStr();
  switch (wordData.reviewNum) {
    case 0:
      wordData["reviewOneTime"] = "";
      wordData["reviewTwoTime"] = "";
      wordData["reviewThreeTime"] = "";
      wordData["reviewFourTime"] = "";
      wordData["reviewFiveTime"] = "";
      break;
    case 1:
      wordData["reviewOneTime"] = nowDate;
      break;
    case 2:
      wordData["reviewTwoTime"] = nowDate;
      break;
    case 3:
      wordData["reviewThreeTime"] = nowDate;
      break;
    case 4:
      wordData["reviewFourTime"] = nowDate;
      break;
    case 5:
      wordData["reviewFiveTime"] = nowDate;
      break;
  }
}

function _getLastReviewTime(data) {
  let reviewedTimes = data.reviewNum;
  let lastTime = null;
  switch (reviewedTimes) {
    case 0:
      break;
    case 1:
      lastTime = data["reviewOneTime"];
      break;
    case 2:
      lastTime = data["reviewTwoTime"];
      break;
    case 3:
      lastTime = data["reviewThreeTime"];
      break;
    case 4:
      lastTime = data["reviewFourTime"];
      break;
    case 5:
      lastTime = data["reviewFiveTime"];
      break;
  }
  if (!lastTime) {
    lastTime = data["createTime"];
  }
  return lastTime;
}

//插入测试记录
function insertTestRecord(data) {
  return learnDB.insertTestRecord(data);
}
//插入测试记录
function insertSpellTestRecord(data) {
  return learnDB.insertExamSpellRecord(data);
}

function getTestRecord(params) {
  return learnDB.getTestRecord();
}
export default {
  initLearnTrack,
  initReviewTrack,
  clearColumnLearnRecord,
  getLearnStatistics,
  insertTestRecord,
  getTestRecord,
  setBookReviewedDataToDB,
  setColumnLearnedDataToDB,
  checkLearnColumnRecord,
  insertSpellTestRecord
};
