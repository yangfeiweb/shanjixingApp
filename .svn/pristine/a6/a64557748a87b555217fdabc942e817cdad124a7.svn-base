// 单词列表
const WORDS_ENTITY = [
  { key: "id" },
  { key: "content1" },
  { key: "content2" },
  { key: "content3" },
  { key: "content4" },
  { key: "content5" },
  { key: "content6" },
  { key: "content7" },
  { key: "content8" },
  { key: "content9" },
  { key: "orders", type: "integer" },
  { key: "status" },
  { key: "wordNo" }
];
// 课本列表
const BOOKS_ENTITY = [
  { key: "id" },
  { key: "canExam" }, // 'Y'\ 'N'
  { key: "bookNo" },
  { key: "bookSort" },
  { key: "bookType" },
  { key: "columns", type: "integer" },
  { key: "coverImgUrl" },
  { key: "createTime" },
  { key: "description" },
  { key: "info" },
  { key: "name" },
  { key: "orders", type: "integer" },
  { key: "status" },
  { key: "versionCode", type: "integer" },
  { key: "words", type: "integer" }
];

// 课本-栏目对照表
const BOOK_COLUMNS_ENTITY = [
  { key: "id" },
  { key: "bookNo" },
  { key: "columnNo" },
  { key: "createTime" },
  { key: "importId" },
  { key: "name" },
  { key: "orders", type: "integer" },
  { key: "status" },
  { key: "words", type: "integer" }
];
// 栏目-单词对照表
const COLUMNS_ENTITY = [
  { key: "bookNo" },
  { key: "columnNo" },
  { key: "wordIds" }
];

// 用户加入学习的课本
const USER_LEARN_BOOKS_ENTITY = [
  { key: "studentNo" },
  { key: "bookNo" },
  { key: "learnType" },
  { key: "updateTime" },
  { key: "versionCode", type: "integer" },
  { key: "status" },
  { key: "orders", type: "integer" },
  { key: "synced", type: "integer" }
];

// 用户学习记录表（按天、按栏目记录学习错词和正确词数量）
const USER_LEARNING_ENTITY = [
  { key: "studentNo" },
  { key: "bookNo" },
  { key: "learnType" }, // 课本类型
  { key: "columnNo" },
  { key: "learnDate" }, // 学习时间，按天 20170405
  { key: "createTime" },
  { key: "learnedTime", type: "integer" }, // 本次学习时长
  { key: "rightNum", type: "integer" },
  { key: "errorNum", type: "integer" },
  { key: "learnTimes" }, // 学习次数（点击次数）
  { key: "status" },
  { key: "synced", type: "integer" }
];

// 用户学习记录表（按天、按栏目记录学习错词和正确词数量）
const USER_REVIEW_RECORD_ENTITY = [
  { key: "studentNo" },
  { key: "bookNo" },
  { key: "learnType" }, // 课本类型
  { key: "learnDate" }, // 复习时间，按天 20170405
  { key: "createTime" },
  { key: "learnedTime", type: "integer" }, // 本次学习时长，毫秒
  { key: "reviewedNum", type: "integer" }, // 复习的单词个数
  { key: "learnTimes" },
  { key: "status" },
  { key: "synced", type: "integer" }
];

// 用户栏目进度表
const USER_COLUMN_SCH_ENTITY = [
  { key: "studentNo" },
  { key: "bookNo" },
  { key: "learnType" }, // 课本类型
  { key: "columnNo" },
  { key: "rightNum", type: "integer" },
  { key: "errorNum", type: "integer" },
  { key: "updateTime" },
  { key: "synced", type: "integer" }
];

// 用户正确词表
const USER_RIGHT_WRODS_ENTITY = [
  { key: "studentNo" },
  { key: "bookNo" },
  { key: "learnType" }, // 课本类型
  { key: "columnNo" },
  { key: "wordNo" },
  { key: "status" },
  { key: "learnedTime", type: "integer" }, // 单位： 毫秒
  { key: "createTime" },
  { key: "synced", type: "integer" }
];

// 用户错词表
const USER_ERR_WRODS_ENTITY = [
  { key: "studentNo" },
  { key: "bookNo" },
  { key: "learnType" }, // 课本类型
  { key: "columnNo" },
  { key: "wordNo" },
  { key: "status" },
  { key: "createTime" },
  { key: "reviewNum", type: "integer" },
  { key: "reviewOneTime" },
  { key: "reviewTwoTime" },
  { key: "reviewThreeTime" },
  { key: "reviewFourTime" },
  { key: "reviewFiveTime" },
  { key: "synced", type: "integer" }
];

// 客户端操作记录表
const CLIENT_RECORD = [
  { key: "studentNo" },
  { key: "createTime" },
  { key: "operateType" }, // getBooks, syncData
  { key: "status" },
  { key: "content" }
];

// 用户测试记录表
const USER_EXAM_RECORD = [
  { key: "studentNo" },
  { key: "bookNo" },
  { key: "examType" },
  { key: "name" },
  { key: "cloudId", type: "integer" },
  { key: "total", type: "integer" },
  { key: "rightCount", type: "integer" },
  { key: "errorCount", type: "integer" },
  { key: "startTime" },
  { key: "finishedTime" },
  { key: "score" },
  { key: "synced", type: "integer" },
  { key: "status" }
];

// 用户测试详情表
const USER_EXAM_DETAIL = [
  { key: "examId" },
  { key: "bookNo" },
  { key: "columnNo" },
  { key: "wordNo" },
  { key: "wordName" },
  { key: "itemA" },
  { key: "itemB" },
  { key: "itemC" },
  { key: "itemD" },
  { key: "rightItem" },
  { key: "answerItem" },
  { key: "finishedTime" }, // 完成时间
  { key: "synced", type: "integer" },
  { key: "syncedTime" }
];

// 用户拼写测试详情表
const USER_SPELL_EXAM_DETAIL = [
  { key: "examId" }, // 试卷id
  { key: "bookNo" }, // 课本编号
  { key: "columnNo" }, // 栏目编号
  { key: "wordNo" }, // 单词编号
  { key: "word" }, // 单词英文
  { key: "chinese" }, // 单词中文释义
  { key: "answer" }, // 用户回答结果
  { key: "finishedTime" }, // 完成时间
  { key: "isCorrect" }, // 用户回答是否正确 (Y\N)
  { key: "synced", type: "integer" } // 同步标签
];

const USER_INFO_ENTITY = [
  "userId",
  "mobile",
  "password",
  "icon",
  "vipDeadTime",
  "vipGrade",
  "currentGrade",
  "gender",
  "createTime",
  "birthDate",
  "schoolNo",
  "studentNo",
  "registerType",
  "isLogin"
];

export default {
  WORDS_ENTITY,
  BOOKS_ENTITY,
  BOOK_COLUMNS_ENTITY,
  COLUMNS_ENTITY,
  USER_LEARN_BOOKS_ENTITY,
  USER_LEARNING_ENTITY,
  USER_REVIEW_RECORD_ENTITY,
  USER_COLUMN_SCH_ENTITY,
  USER_RIGHT_WRODS_ENTITY,
  USER_ERR_WRODS_ENTITY,
  USER_INFO_ENTITY,
  CLIENT_RECORD,
  USER_EXAM_DETAIL,
  USER_EXAM_RECORD,
  USER_SPELL_EXAM_DETAIL
};
