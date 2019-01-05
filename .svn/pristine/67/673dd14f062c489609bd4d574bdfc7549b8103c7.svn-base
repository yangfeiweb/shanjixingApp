import { AsyncStorage } from "react-native";
import RNFetchBlob from "react-native-fetch-blob";
import dataService from "../services";
import { userDB, learnDB } from "../db";
import {
  IMAGE_PATH,
  IMG_TYPE,
  TEST_TYPE,
  EXAM_TYPE,
  ASSET_TYPE
} from "../utility/dict";
import { ResourcePath } from "../services/urlConfig";
import { utility } from "../utility";
const dirs = RNFetchBlob.fs.dirs;
//用户登陆处理函数
function doLogin(userName, pwd) {
  let task = dataService.login(userName, pwd);
  task.then(res => {
    let result = res.data;
    let code = res.code;
    if (code === 200) {
      let data = res.data;
      let arr = [];
      let obj = {};
      for (let key in data) {
        if (key !== "token") {
          obj[key] = data[key];
        }
      }
      utility.setSeverTime(data.serverTime); //设置服务器时间
      let studentNo = data.studentNo;
      if (obj.icon) {
        obj.icon = ResourcePath + obj.icon;
      }
      obj["password"] = pwd;
      AsyncStorage.getItem("usersInfo").then(res => {
        //
        let usersInfo = null;
        if (!res) {
          if (!obj.icon) {
            obj.icon = randomIcon();
          }
          arr.push(obj);
          usersInfo = arr;
        } else {
          let infoArr = JSON.parse(res);
          let index = infoArr.findIndex(item => item.studentNo === studentNo);
          if (index === -1) {
            //没有的话添加
            if (!obj.icon) {
              obj.icon = randomIcon();
            }
            arr.push(obj);
            usersInfo = arr.concat(infoArr);
          } else {
            //有的话更新一下数据
            let item = infoArr[index];
            if (!obj.icon && !item.icon) {
              //选择后不再随机选取
              obj.icon = randomIcon();
            }
            let newInfo = Object.assign(item, obj);
            infoArr.splice(index, 1, newInfo); //用新的替换旧的
            usersInfo = infoArr;
          }
        }
        if (usersInfo) {
          AsyncStorage.setItem("usersInfo", JSON.stringify(usersInfo)).then(
            res => {
              syncUserInfo();
            }
          );
        }
      });
      let multiSets = [
        ["token", data.token],
        ["studentNo", data.studentNo],
        ["serverTime", data.serverTime]
      ];
      if (data.userid) {
        multiSets.push(["userid", data.userid]);
      }
      AsyncStorage.multiSet(multiSets).then(res => {
        AsyncStorage.removeItem("currMobile").then(res => {}, err => {});
      });
      let params = Object.assign({}, obj);
      if (!params.icon) {
        params.icon = randomIcon();
      }
      AsyncStorage.setItem("currUser", JSON.stringify(params)).then(
        res => {},
        err => {}
      );
      getMusicAssets();
    }
    learnDB.getAllExanRecord().then(
      res => {
        let records = res.raw();
        let arr = [];
        records.forEach(item => {
          if (item && item.examType !== EXAM_TYPE.WORD) {
            let obj = {
              id: item.id
            };
            let total = item.total > 20 ? 20 : item.total;
            obj["total"] = total;
            obj["score"] = Math.ceil(item.rightCount / total * 100);
            arr.push(obj);
          }
        });
        if (arr.length !== 0) {
          learnDB.updateExanRecord(arr).then(res => {}, err => {});
        }
      },
      err => {}
    );
  });
  return task;
}

function syncUserInfo() {
  dataService.getUsersInfo().then(res => {
    let code = res.code;
    if (code === 200) {
      let data = res.data;
      if (data) {
        utility.getCurrUserInfo().then(item => {
          if (item) {
            if (!data.icon && !item.icon) {
              data.icon = randomIcon();
            }
            let obj = Object.assign({}, item, data);
            AsyncStorage.setItem("currUser", JSON.stringify(obj)).then(
              res => {},
              err => {}
            );
          }
        });
      }
    }
  });
}

function getMusicAssets() {
  dataService.getAssetList(0, 20, ASSET_TYPE.MUSIC).then(
    res => {
      let code = res.code;
      let msg = res.msg;
      if (code === 200) {
        let data = res.data;
        let content = data.content;
        checkMusicExists(content);
      }
    },
    err => {
      utility.log("----------getAssetList err", err);
    }
  );
}

async function checkMusicExists(content) {
  //检测本地是否已经下载过音乐

  for (const item of content) {
    if (item) {
      item.needDownload = false;
      let path = dirs.DocumentDir + item.assetUrl;
      let result = await RNFetchBlob.fs.exists(path);
      if (!result) {
        item.needDownload = true;
      }
    }
  }
  utility.log("------------content", content);
  AsyncStorage.setItem("music", JSON.stringify(content)).then(
    res => {},
    err => {}
  );
}
function randomIcon() {
  let num = utility.baseRandom(1, 150);
  return IMAGE_PATH + num + IMG_TYPE;
}
export default {
  doLogin,
  syncUserInfo
};
