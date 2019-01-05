import { AsyncStorage } from "react-native";

class Stroage {
  constructor() {
    this.currMobile = null;
    this.currUserInfo = null;
    this.usersInfo = null;
    this.token = null;
  }
  setCurrMobile(mobile) {
    //设置当前用户的号码
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem("currMobile", mobile).then(res => {
        this.currMobile = mobile;
      });
    });
  }
  getCurrMobile() {
    //得到当前用户的号码
    return new Promise((resolve, reject) => {
      if (this.currMobile) {
        resolve(this.currMobile);
      } else {
        AsyncStorage.getItem("currMobile")
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  }
  setUserInfo(params, mobile) {
    return new Promise((resolve, reject) => {
      this.getUserInfos().then(
        res => {
          let arr = [];
          if (!res) {
            //原本没数据
            arr.push(params);
            AsyncStorage.setItem("usersInfo", JSON.stringify(arr)).then(
              res => {
                resolve(res);
              },
              err => {
                reject(err);
              }
            );
          } else {
            //有数据更新
            let data = JSON.parse(res);
            let index = data.findIndex(item => item.mobile === mobile);
            if (index !== -1) {
              this.updateCurrUserInfo(params).then(
                res => {
                  resolve(res);
                },
                err => {
                  reject(err);
                }
              );
            } else {
              data.push(params);
              arr = arr.concat(data);
              AsyncStorage.setItem("usersInfo", JSON.stringify(arr)).then(
                res => {
                  resolve(res);
                },
                err => {
                  reject(err);
                }
              );
            }
          }
        },
        err => {
          reject(err);
        }
      );
    });
  }
  getUserInfos() {
    return new Promise((resolve, reject) => {
      if (this.usersInfo) {
        resolve(this.usersInfo);
      } else {
        AsyncStorage.getItem("usersInfo").then(
          res => {
            resolve(res);
            this.usersInfo = res;
          },
          err => {
            reject(err);
          }
        );
      }
    });
  }
  getCurrUserInfo() {
    return new Promise((resolve, reject) => {
      this.getCurrMobile().then(mobile => {
        this.getUserInfos()
          .then(res => {
            if (res) {
              let data = JSON.parse(res);
              let item = data.find(item => item.mobile === mobile);
              if (item) {
                resolve(item);
              } else {
                reject();
              }
            } else {
              resolve();
            }
          })
          .catch(err => {
            reject();
          });
      });
    });
  }

  updateCurrUserInfo(params) {
    return new Promise((resolve, reject) => {
      this.getCurrMobile().then(mobile => {
        this.getUserInfos().then(res => {
          let data = JSON.parse(res);
          let index = data.findindex(item => item.mobile === mobile);
          if (index !== -1) {
            let item = data[index];
            item = Object.assign(item, params);
            data.splice(index, 1, item);
            this.setUserInfo(data).then(
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
        });
      });
    });
  }
}
export default new Stroage();
