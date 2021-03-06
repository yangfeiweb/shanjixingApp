import reqUrl from "../urlConfig";
import { httpRequest, http } from "../../utility";
import { learn } from "../../controller";

// 获取所有课本列表
let getBookList = () =>
  httpRequest(reqUrl.GET_BOOKS_LIST, {
    page: 0,
    size: 10000
    // bookType: "FREE"
  });

// 标记课本状态
let markBookDownloaded = bookNo =>
  httpRequest(
    reqUrl.MARK_BOOK_STATUS,
    {
      bookNo: bookNo,
      status: "COMPLETE"
    },
    "POST"
  );
// 标记课本删除
let markBooksRemove = bookNos =>
  httpRequest(
    reqUrl.MARK_BOOK_STATUS,
    {
      bookNo: bookNos,
      status: "DELETE"
    },
    "POST"
  );

// 删除学习记录
let clearBookRecord = bookNos =>
  httpRequest(
    reqUrl.CLEAR_BOOK_RECORD,
    {
      bookNo: bookNos
    },
    "POST"
  );

// 删除栏目学习记录
let clearColumnRecord = (bookNo, columnNo) =>
  httpRequest(
    reqUrl.CLEAR_COLUMN,
    {
      bookNo: bookNo,
      columnNo: columnNo
    },
    "POST"
  );

// 获取下载过的课本列表
let getDownloadBooks = () =>
  httpRequest(reqUrl.GET_DOWNLOADED_BOOKS, {
    page: 0,
    size: 1000
  });

// 获取课本记录
let getBookRecords = () =>
  httpRequest(reqUrl.GET_BOOK_RECORDS, {
    page: 0,
    size: 1000
  });

// 获取栏目进度
let getColumnSchedule = (bookNo, learnType) =>
  httpRequest(reqUrl.GET_COLUMN_SCHEDULE, {
    bookNo: bookNo,
    learnType: learnType
  });

// 获取错误词列表
let getErrorWords = (page, size = 400) =>
  httpRequest(reqUrl.GET_ERROR_WORDS, {
    page: page,
    size: size
  });

// 获取正确词列表
let getRightWords = (page, size = 400) =>
  httpRequest(reqUrl.GET_RIGHT_WORDS, {
    page: page,
    size: size
  });

let getLearnTimeRecord = (page, size = 400) =>
  httpRequest(reqUrl.GET_LEARN_TIME_RECORD, {
    page: page,
    size,
    size
  });

export default {
  getBookList,
  markBookDownloaded,
  markBooksRemove,
  clearBookRecord,
  clearColumnRecord,
  getErrorWords,
  getDownloadBooks,
  getBookRecords,
  getColumnSchedule,
  getRightWords,
  getLearnTimeRecord
};
