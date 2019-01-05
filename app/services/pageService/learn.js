import reqUrl from "../urlConfig";
import { httpRequest } from "../../utility";

// 记录课本学习
let recordBookLearn = (bookNo, learnType) =>
  httpRequest(
    reqUrl.ADD_BOOK_RECORD,
    {
      bookNo: bookNo,
      learnType: learnType
    },
    "POST"
  );

export default {
  recordBookLearn
};
