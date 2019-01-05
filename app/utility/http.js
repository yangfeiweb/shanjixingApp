import DeviceInfo from "react-native-device-info";
import { AsyncStorage, DeviceEventEmitter } from "react-native";
import MD5 from "crypto-js/md5";
import utility from "./utility";
let token = "";
export default function(
  url,
  params = {},
  methodType = "GET",
  headers = {},
  skipSignFields = []
) {
  let task = request(url, params, methodType, headers, skipSignFields);
  task.then(
    res => {
      let code = res.code;
      let msg = res.msg;
      if (code === 200) {
        let index = url.indexOf("login");
        if (index !== -1) {
          let data = res.data;
          token = data.token;
        }
        if (url.indexOf("logout") !== -1) {
          token = "";
        }
      } else if (code === 401) {
        // 登录过期，重新自动登录
        DeviceEventEmitter.emit("gotoLogin");
      } else if (code === 402) {
        utility.Toast("账号在其他地方登陆！");
        DeviceEventEmitter.emit("gotoLogin");
      }
    },
    err => {
      utility.Toast("网络不佳，请稍候重试");
    }
  );
  return task;
}
function request(
  url,
  params = {},
  methodType = "GET",
  headers,
  skipSignFields
) {
  if (token) {
    params["token"] = token;
  }
  params["version"] = "1.0.0";
  params["ts"] = utility.getTs();

  let signParams = {};
  if (skipSignFields.length) {
    for (let key in params) {
      if (
        skipSignFields.findIndex(item => {
          return item === key;
        }) === -1
      ) {
        signParams[key] = params[key];
      }
    }
  } else {
    signParams = params;
  }
  let sign = getRequestSign(signParams);
  params["sign"] = sign;
  if (methodType.toUpperCase() === "GET") {
    headers = Object.assign(headers, {
      "Content-Type": "application/json",
      "User-Agent": DeviceInfo.getUserAgent()
    });
    let paramArr = [];
    for (let key in params) {
      let val = params[key];
      paramArr.push(`${key}=${val}`);
    }
    if (paramArr.length > 0) {
      url = url + `?${paramArr.join("&")}`;
    }
    return fetch(url, {
      method: "GET",
      headers: headers
    }).then(response => response.json());
  } else if (methodType.toUpperCase() === "POST") {
    headers = Object.assign(headers, {
      "Content-Type": "multipart/form-data;charset=UTF-8",
      "User-Agent": DeviceInfo.getUserAgent()
    });

    let formData = new FormData();
    for (let key in params) {
      formData.append(key, params[key]);
    }
    utility.log("--------formData", formData);
    return fetch(url, {
      method: "POST",
      headers: headers,
      body: formData
    }).then(response => {
      return response.json();
    });
  }
}

export function getRequestSign(params) {
  if (!params) {
    params = {};
  }
  let paramArr = [];
  for (let key in params) {
    let val = params[key];
    if (val !== undefined && val !== null && val !== "") {
      paramArr.push(`${key}=${val}`);
    }
  }
  paramArr.sort();

  let key = "03c408b46416692e961e8e6accc23d26";
  let paramStr = paramArr.join("&") + `&key=${key}`;
  return MD5(paramStr).toString();
}
