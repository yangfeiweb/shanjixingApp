/**
 * 1. 下载课本后入库操作，单词库、课本库、栏目库
 * 2. 课本列表、栏目列表和单词库的操作
 * 3. 栏目进度表
 */
/**
 * 初始化数据库、创建表
 * 同步表
 */
import React, { Component } from "react";
import mainDB from "./mainDB";
import entry from "./entity";
import learn from "../services/pageService/learn";
import { utility } from "../utility";

let mainSqlite = new mainDB();
// 插入数据到课本表
function insertBookData(data) {
  return new Promise((resolve, reject) => {
    mainSqlite
      .executeSql("delete from books")
      .then(success => {
        mainSqlite
          .insertData("books", data, _getEntityKeys(entry.BOOKS_ENTITY))
          .then(res => {
            resolve();
          })
          .catch(e => {
            reject(e);
          });
      })
      .catch(e => {
        reject(e);
      });
  });
}
// 插入数据到用户课本表
function insertUserBookData(data) {
  return mainSqlite.insertData(
    "user_books",
    data,
    _getEntityKeys(entry.USER_LEARN_BOOKS_ENTITY)
  );
}

// 插入数据到单词库表
function insertWordData(data) {
  return mainSqlite.insertData(
    "words",
    data,
    _getEntityKeys(entry.WORDS_ENTITY)
  );
}

// 插入数据到课本-栏目对照表
function insertBookColumns(data) {
  return mainSqlite.insertData(
    "book_columns",
    data,
    _getEntityKeys(entry.BOOK_COLUMNS_ENTITY)
  );
}

// 插入数据到栏目表
function insertColumnData(data) {
  return mainSqlite
    .insertData("columns", data, _getEntityKeys(entry.COLUMNS_ENTITY))
    .then(res => {});
}

// 获取课本column信息
function getCacheBookColumnCount(bookNo) {
  return mainSqlite.getTableDataCount("columns", `bookNo='${bookNo}'`);
}

// 获取课本详情信息
function getBookInfo(bookNo) {
  return new Promise((resolve, reject) => {
    mainSqlite.getTableData("books", `bookNo='${bookNo}'`).then(result => {
      let bookInfo = result.item(0) || {};
      resolve(bookInfo);
    });
  });
}
// 获取栏目信息
function getColumnInfos(bookNo) {
  let sqlStr = `select * from book_columns where bookNo='${bookNo}'`;
  return mainSqlite.executeSql(sqlStr);
}

// 获取栏目进度
function getColumnSchedule(studentNo, bookNo, learnType = "DEFAULT") {
  let sqlStr = `select * from column_schedule where bookNo='${bookNo}' and studentNo='${studentNo}' and learnType='${learnType}'`;
  return mainSqlite.executeSql(sqlStr);
}

// 获取栏目单词
function getColumnWords(bookNo, columnNo) {
  return new Promise((resolve, reject) => {
    mainSqlite
      .getTableData("columns", `bookNo='${bookNo}' and columnNo='${columnNo}'`)
      .then(res => {
        var len = res.length;
        let wordInfo = res.item(0);
        if (!wordInfo) {
          resolve([]);
          return;
        }
        let wordIds = wordInfo.wordIds;
        let tempArr = wordIds.split(",");
        let idsArr = [];
        tempArr.forEach(id => {
          idsArr.push(`'${id}'`);
        });
        mainSqlite
          .getTableData("words", `wordNo in (${idsArr.join(",")})`)
          .then(result => {
            let data = [];
            let len = result.length;
            for (let i = 0; i < len; i++) {
              let wordItem = result.item(i);
              wordItem["bookNo"] = bookNo;
              wordItem["columnNo"] = columnNo;
              data.push(wordItem);
            }
            resolve(data);
          });
      });
  });
}

// 获取栏目单词对照数据
function getBookColumnsWordIds(bookNo) {
  return mainSqlite.executeSql(
    `select * from columns where bookNo='${bookNo}'`
  );
}

// 获取所有课本列表
function getBookList() {
  return mainSqlite.getTableData("books").then(res => {
    let data = [];
    let len = res.length;
    for (let i = 0; i < len; i++) {
      data.push(res.item(i));
    }
    return data;
  });
}

// 获取用户课本列表
function getUserBooksList(studentNo) {
  let sqlStr = `select user_books.studentNo,user_books.learnType,user_books.updateTime,user_books.versionCode as userVersion, user_books.synced, books.*  from user_books left join books on user_books.bookNo = books.bookNo where studentNo='${studentNo}'`;
  return mainSqlite.executeSql(sqlStr);
}

// 获取已缓存的课本编号
function getCachedBookNos() {
  let sqlStr = `select bookNo from book_columns group by bookNo`;
  return mainSqlite.executeSql(sqlStr);
}

//获取课本进度
function getUserBooksSchedule(studentNo) {
  let sqlStr = `select * from user_books left join (select bookNo,sum(rightNum) as totalRight, sum(errorNum) as totalError from column_schedule where studentNo='${studentNo}' Group by bookNo) t on user_books.bookNo = t.bookNo  where user_books.studentNo="${studentNo}"`;
  return mainSqlite.executeSql(sqlStr);
}

// 设置课本的同步标识
function setBookSyncFlag(studentNo, bookNo, sync = 0) {
  let sqlStr = `update user_books set synced=${sync} where studentNo='${studentNo}' and bookNo='${bookNo}'`;
  return mainSqlite.executeSql(sqlStr);
}

// 删除用户课本
function removeUserBooks(studentNo, bookNos) {
  let noArr = [];
  bookNos.forEach(item => {
    noArr.push(`"${item}"`);
  });
  let sqlStr = `delete from user_books where studentNo='${studentNo}' and bookNo in(${noArr.join(
    ","
  )})`;
  return mainSqlite.executeSql(sqlStr);
}

// 删除课本的学习记录
function clearUserBookRecord(studentNo, bookNos) {
  let noArr = [];
  bookNos.forEach(item => {
    noArr.push(`"${item}"`);
  });
  let sqlArr = [];
  // 1. 删除正确词表记录
  sqlArr.push(
    `delete from right_words where studentNo='${studentNo}' and bookNo in(${noArr.join(
      ","
    )})`
  );
  // 2. 删除错误词表记录
  sqlArr.push(
    `delete from error_words where studentNo='${studentNo}' and bookNo in(${noArr.join(
      ","
    )})`
  );
  // 3. 删除栏目进度表记录
  sqlArr.push(
    `delete from column_schedule where studentNo='${studentNo}' and bookNo in(${noArr.join(
      ","
    )})`
  );
  return mainSqlite.executeBatchSql(sqlArr);
}

// 记录课本学习信息--开始学习时调用
function recordBookLearnInfo(studentNo, bookNo, learnType, updateTime) {
  let sqlStr = `update user_books set learnType='${learnType}', updateTime='${updateTime}' where studentNo='${studentNo}' and bookNo='${bookNo}'`;
  return mainSqlite.executeSql(sqlStr);
}

// 同步--获取需要更新的课本列表
function getNeedSyncBooks(studentNo) {
  return mainSqlite
    .getTableData("user_books", `studentNo='${studentNo}' and synced!=1`)
    .then(res => {
      let data = [];
      let len = res.length;
      for (let i = 0; i < len; i++) {
        data.push(res.item(i));
      }
      return data;
    });
}

// 同步-- 获取要同步的栏目信息
function getSyncColumnInfos(studentNo, bookNo, learnType = "DEFAULT") {
  let sqlStr = `select * from column_schedule left join book_columns on column_schedule.bookNo= book_columns.bookNo and column_schedule.columnNo =book_columns.columnNo  where column_schedule.bookNo='${bookNo}' and column_schedule.studentNo='${studentNo}' and column_schedule.learnType='${learnType}' and column_schedule.synced != 1`;
  return mainSqlite.executeSql(sqlStr);
}

// 同步-- 获取课本中要同步的正确单词
function getSyncBookRightWords(studentNo, bookNo, learnType = "DEFAULT") {
  let sqlStr = `select * from right_words where studentNo='${studentNo}' and bookNo='${bookNo}' and learnType='${learnType}' and synced != 1`;
  return mainSqlite.executeSql(sqlStr);
}

// 同步-- 获取课本中要同步的错误单词
function getSyncBookErrWords(studentNo, bookNo, learnType = "DEFAULT") {
  let sqlStr = `select * from error_words where studentNo='${studentNo}' and bookNo='${bookNo}' and learnType='${learnType}' and synced != 1`;
  return mainSqlite.executeSql(sqlStr);
}

// 同步--获取要同步的正确单词
function getSyncColumnRightWords(
  studentNo,
  bookNo,
  columnNo,
  learnType = "DEFAULT"
) {
  let sqlStr = `select * from right_words where studentNo='${studentNo}' and bookNo='${bookNo}' and columnNo='${columnNo}' and learnType='${learnType}' and synced != 1`;
  return mainSqlite.executeSql(sqlStr);
}
// 同步--获取要同步的正确单词
function getSyncColumnErrWords(
  studentNo,
  bookNo,
  columnNo,
  learnType = "DEFAULT"
) {
  let sqlStr = `select * from error_words where studentNo='${studentNo}' and bookNo='${bookNo}' and columnNo='${columnNo}' and learnType='${learnType}' and synced != 1`;
  return mainSqlite.executeSql(sqlStr);
}

// 同步--获取要同步的学习记录
function getSyncLearnRecords(studentNo) {
  let sqlStr = `select * from learning_record where studentNo='${studentNo}' and synced !=1`;
  return mainSqlite.executeSql(sqlStr);
}

// 同步--更新课本同步标识
function updateBookSynced(data) {
  let studentNo = data.studentNo;
  let bookNo = data.bookNo;
  let learnType = data.learnType;
  let columns = data.columns;
  let sqlArr = [];
  columns.forEach(column => {
    let columnNo = column.columnNo;
    let rightWords = column.learns;
    let errorWords = column.wordNotes;
    // 栏目进度
    sqlArr.push(
      `update column_schedule set synced=1 where studentNo='${studentNo}' and bookNo='${bookNo}' and columnNo='${columnNo}' and learnType='${learnType}'`
    );
    // 正确词表
    rightWords &&
      rightWords.forEach(word => {
        sqlArr.push(
          `update right_words set synced=1 where studentNo='${studentNo}' and bookNo='${bookNo}' and columnNo='${columnNo}' and learnType='${learnType}'`
        );
      });
    // 错误词表
    errorWords &&
      errorWords.forEach(word => {
        sqlArr.push(
          `update error_words set synced=1 where studentNo='${studentNo}' and bookNo='${bookNo}' and columnNo='${columnNo}' and learnType='${learnType}'`
        );
      });
  });
  sqlArr.push(
    `update user_books set synced=1 where studentNo='${studentNo}' and bookNo='${bookNo}'`
  );
  return mainSqlite.executeBatchSql(sqlArr);
}
// 同步--更新课本同步标识
function updateLearnRecordSynced(data) {
  let studentNo = data.studentNo;
  let records = data.records;
  let sqlArr = [];
  records.forEach(record => {
    let bookNo = record.bookNo;
    let learnType = record.learnType;
    let columnNo = record.columnNo;
    // 更新学习记录表
    sqlArr.push(
      `update learning_record set synced=1 where studentNo='${studentNo}' and bookNo='${bookNo}' and columnNo='${columnNo}' and learnType='${learnType}'`
    );
  });
  return mainSqlite.executeBatchSql(sqlArr);
}

// 同步--获取所有的要同步的测试记录
function getAllSyncExamList(studentNo) {
  return mainSqlite.executeSql(
    `select * from exam_record where studentNo='${studentNo}' and synced!=1`
  );
}

// 同步-- 获取试卷详情
function getSyncExamDetails(examId, examType) {
  if (examType.indexOf("SPELL") > -1) {
    return mainSqlite.executeSql(
      `select * from exam_spell_details where examId='${examId}'`
    );
  } else {
    return mainSqlite.executeSql(
      `select * from exam_details where examId=${examId}`
    );
  }
}

// 设置测试详情表中的examNo，弥补之前表设计缺失columnNo字段问题
function fixedExamRecord(examId, columnNo, bookNo) {
  mainSqlite.executeSql(
    `update exam_record set bookNo='${bookNo}' where id=${examId}`
  );
  mainSqlite.executeSql(
    `update exam_details set columnNo='${columnNo}' where examId=${examId}`
  );
}

// 同步--更新测试记录表为已同步
function updateExamSynced(examId) {
  return mainSqlite.executeSql(
    `update exam_record set synced=1 where id=${examId}`
  );
}
// test
function clearBookColumn(bookNo) {
  return mainSqlite.executeSql(`delete from columns where bookNo='${bookNo}'`);
}

// 同步--插入栏目进度表
function insertColumnSchedule(data) {
  return mainSqlite.insertData(
    "column_schedule",
    data,
    _getEntityKeys(entry.USER_COLUMN_SCH_ENTITY)
  );
}

// 同步--插入学习记录表
function insertLearnRecords(data) {
  return mainSqlite.insertData(
    "learning_record",
    data,
    _getEntityKeys(entry.USER_LEARNING_ENTITY)
  );
}

// 同步--插入正确词表
function insertRightWords(data) {
  return mainSqlite.insertData(
    "right_words",
    data,
    _getEntityKeys(entry.USER_RIGHT_WRODS_ENTITY)
  );
}

// 同步--插入错误词表
function insertErrorWords(data) {
  return mainSqlite.insertData(
    "error_words",
    data,
    _getEntityKeys(entry.USER_ERR_WRODS_ENTITY)
  );
}

// 同步--插入测试记录
function insertExamRecord(examId, examRecord, examDetails) {
  return new Promise((resolve, reject) => {
    mainSqlite.open().then(db => {
      db.transaction(
        tx => {
          // 1. 插入到记录表
          let keys = [];
          let valArr = [];
          valArr.push(examId);
          keys.push("id");
          entry.USER_EXAM_RECORD.forEach(item => {
            let key = item.key;
            keys.push(key);
            let val = examRecord[key];
            if (val === undefined) {
              val = "";
            } else {
              if (typeof val === "string") {
                val = val.replace(/"/g, '""');
              }
            }
            if (typeof val === "string") {
              valArr.push(`"${val}"`);
            } else {
              valArr.push(`${val}`);
            }
          });
          let recordSql = `replace into exam_record (${keys.join(
            ","
          )}) VALUES(${valArr.join(",")})`;

          tx.executeSql(recordSql, null, (tx, results) => {
            // 2. 插入到详情表
            examDetails.forEach(detailItem => {
              detailItem.examId = examId;
              detailItem.synced = 0;

              let keys = [];
              let valArr = [];
              entry.USER_EXAM_DETAIL.forEach(examItem => {
                let key = examItem.key;
                keys.push(key);
                let val = detailItem[key];
                if (val === undefined) {
                  val = "";
                } else {
                  if (typeof val === "string") {
                    val = val.replace(/"/g, '""');
                  }
                }
                if (typeof val === "string") {
                  valArr.push(`"${val}"`);
                } else {
                  valArr.push(`${val}`);
                }
              });
              let detailSql = `replace into exam_details (${keys.join(
                ","
              )}) VALUES(${valArr.join(",")})`;
              tx.executeSql(detailSql);
            });
          });
        },
        err => {
          reject(err);
        },
        success => {
          resolve();
        }
      );
    });
  });
}

// 同步--查询课本的最新学习时间
function getBookRecordTime(studentNo) {
  let sqlStr = `select max(dateTime(updateTime)) as maxTime from user_books where studentNo='${studentNo}'`;
  return mainSqlite.executeSql(sqlStr);
}

// 同步--清空本地数据
function clearUsersRecord(studentNo) {
  let sqlArr = [];
  sqlArr.push(`delete from user_books where studentNo='${studentNo}'`);
  sqlArr.push(`delete from learning_record where studentNo='${studentNo}'`);
  sqlArr.push(`delete from column_schedule where studentNo='${studentNo}'`);
  sqlArr.push(`delete from right_words where studentNo='${studentNo}'`);
  sqlArr.push(`delete from error_words where studentNo='${studentNo}'`);
  sqlArr.push(
    `delete from exam_details where examId in(select id from exam_record where studentNo='${studentNo}')`
  );
  sqlArr.push(`delete from exam_record where studentNo='${studentNo}'`);
  // sqlArr.push(`delete from exam_spell_details where studentNo='${studentNo}'`);
  return mainSqlite.executeBatchSql(sqlArr);
}

// 清空本地测试记录
function deleteExamRecord(examId) {
  let sqlArr = [];
  sqlArr.push(`delete from exam_record where id=${examId}`);
  sqlArr.push(`delete from exam_details where examId=${examId}`);
  return mainSqlite.executeBatchSql(sqlArr);
}

function _getEntityKeys(entity) {
  let keys = [];
  entity.forEach(item => {
    keys.push(item.key);
  });
  return keys;
}

export default {
  insertBookData,
  insertUserBookData,
  insertWordData,
  insertBookColumns,
  insertColumnData,
  getColumnWords,
  getColumnInfos,
  getColumnSchedule,
  getBookInfo,
  getCacheBookColumnCount,
  getUserBooksList,
  getCachedBookNos,
  getBookList,
  getUserBooksSchedule,
  removeUserBooks,
  clearUserBookRecord,
  setBookSyncFlag,
  getNeedSyncBooks,
  getSyncColumnInfos,
  getSyncColumnRightWords,
  getSyncColumnErrWords,
  getSyncBookRightWords,
  getSyncBookErrWords,
  getSyncLearnRecords,
  updateBookSynced,
  updateLearnRecordSynced,
  getAllSyncExamList,
  getSyncExamDetails,
  getBookColumnsWordIds,
  fixedExamRecord,
  updateExamSynced,
  clearBookColumn,
  insertColumnSchedule,
  insertRightWords,
  insertErrorWords,
  insertExamRecord,
  insertLearnRecords,
  recordBookLearnInfo,
  getBookRecordTime,
  clearUsersRecord,
  deleteExamRecord
};
