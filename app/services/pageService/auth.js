import reqUrl from "../urlConfig";
import { httpRequest } from "../../utility";
import DeviceInfo from "react-native-device-info";

//发送验证码
let sendCaptcha = (captchaType, mobile) => {
  return httpRequest(
    reqUrl.SEND_CAPTCHA,
    {
      captchaType: captchaType,
      mobile: mobile
    },
    "POST"
  );
};
//注册
let register = (
  registerType,
  userid,
  password,
  captcha,
  captchaKey,
  deviceId
) => {
  return httpRequest(
    reqUrl.REGISTER,
    {
      registerType: registerType,
      userid: userid,
      password: password,
      captcha: captcha || "",
      captchaKey: captchaKey || "",
      deviceId: deviceId || ""
    },
    "POST"
  );
};
//登录
let login = (userid, pwd) => {
  return httpRequest(
    reqUrl.LOGIN,
    {
      userid: userid,
      password: pwd,
      deviceId: DeviceInfo.getUniqueID()
    },
    "POST"
  );
};

//重新发送激活邮箱
let reSendEmail = userid => {
  return httpRequest(
    reqUrl.REMILE,
    {
      userid: userid //注册的邮箱
    },
    "POST"
  );
};
//找回密码
let findPwd = (userid, password, captcha, captchaKey) => {
  return httpRequest(
    reqUrl.FIND_PWD,
    {
      userid: userid,
      password: password,
      captcha: captcha,
      captchaKey: captchaKey
    },
    "POST"
  );
};

//绑定手机号

let bindMobile = (mobile, captcha, captchaKey) => {
  return httpRequest(
    reqUrl.BIND_MOBILE,
    {
      mobile: mobile,
      captcha: captcha,
      captchaKey: captchaKey
    },
    "POST"
  );
};

//获取资源列表
let getAssetList = (page, size, assetType) => {
  return httpRequest(reqUrl.ASSETS_LIST, {
    page: page,
    size: size,
    assetType: assetType
  });
};
export default {
  login,
  sendCaptcha,
  register,
  reSendEmail,
  findPwd,
  bindMobile,
  getAssetList
};
