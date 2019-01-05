import reqUrl from "../urlConfig";
import httpRequest from "../../utility/http";

//退出登陆
let logout = () => httpRequest(reqUrl.LOGOUT, {}, "POST");

//修改密码
let changePwd = (oldPassword, newPassword) =>
  httpRequest(
    reqUrl.CHANGE_PWD,
    {
      oldPassword: oldPassword,
      password: newPassword
    },
    "POST"
  );

//用户信息

let getUsersInfo = () => httpRequest(reqUrl.USER_INFO, {}, "GET");

//修改用户信息

let changeUserInfo = params => {
  return httpRequest(reqUrl.CHANGE_USER_INFO, params, "POST");
};
//修改用户头像
let changeIcon = file =>
  httpRequest(
    reqUrl.CHANGE_ICON,
    {
      file: file
    },
    "POST"
  );

//创建订单

let createOrder = (productNo, payType, tradeType) =>
  httpRequest(
    reqUrl.CREATE_ORDER,
    {
      productNo: productNo,
      payType: payType,
      tradeType: tradeType
    },
    "POST"
  );

//行政区域查询

let divisionQuery = (divisionType, parentCode) => {
  return httpRequest(
    reqUrl.DIVISION_QUERY,
    {
      divisionType: divisionType,
      parentCode: parentCode || ""
    },
    "GET"
  );
};

let deleteExamById = examId =>
  httpRequest(
    reqUrl.DELETE_EXAM_BY_ID,
    {
      examIds: examId
    },
    "POST"
  );

let deleteExamBySyncId = examId =>
  httpRequest(
    reqUrl.DELETE_EXAM_BY_SYNCID,
    {
      syncIds: examId
    },
    "POST"
  );

export default {
  logout,
  changePwd,
  getUsersInfo,
  changeUserInfo,
  changeIcon,
  createOrder,
  divisionQuery,
  deleteExamById,
  deleteExamBySyncId
};
