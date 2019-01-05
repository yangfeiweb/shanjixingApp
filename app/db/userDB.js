import SQLite from "react-native-sqlcipher-storage";
import React, { Component } from "react";
import entry from "./entity";
import DeviceInfo from "react-native-device-info";
SQLite.DEBUG(false);
var database_name = "user_basic.db"; //数据库文件
var database_version = "1.0"; //版本号
var database_displayname = "user_basic";
var database_size = -1;
var db;

export default class extends Component {
  constructor() {
    super();
    this.createTable();
    // this.dropTable()
  }
  componentWillUnmount() {
    if (db) {
      db.close();
    } else {
    }
  }
  open() {
    return new Promise((resolve, reject) => {
      if (!db) {
        db = SQLite.openDatabase(
          {
            name: database_name,
            key: DeviceInfo.getUniqueID()
          },
          () => {
            resolve();
          },
          err => {
            reject();
          }
        );
      } else {
        resolve();
      }
    });
  }
  dropTable() {
    return new Promise((resolve, reject) => {
      this.open()
        .then(success => {
          let sqlArr = [
            "drop TABLE IF EXISTS user",
            "drop TABLE IF EXISTS currUser"
          ];

          db.transaction(
            tx => {
              sqlArr.forEach(item => {
                tx.executeSql(item, [], (tx, results) => {}, err => {});
              });
            },
            err => {
              reject(err);
            },
            success => {
              resolve();
            }
          );
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  // 创建表
  createTable() {
    return new Promise((resolve, reject) => {
      this.open()
        .then(success => {
          let sqlArr = [];
          // 创建用户表
          sqlArr.push(
            `CREATE TABLE IF NOT EXISTS user (${entry.USER_INFO_ENTITY.join(
              ","
            )})`
          );
          sqlArr.push(
            `CREATE TABLE IF NOT EXISTS currUser (mobile CHAR(50) UNIQUE)`
          );

          db.transaction(
            tx => {
              sqlArr.forEach(item => {
                tx.executeSql(item, [], (tx, results) => {}, err => {});
              });
            },
            err => {
              reject(err);
            },
            success => {
              this.getCurrUser().then(res => {
                let len = res.length;
                if (res.length === 0) {
                  db.transaction(tx => {
                    let sql = "INSERT INTO currUser (mobile) values(?)";
                    tx.executeSql(sql, ["111111111111"], res => {}, err => {});
                  });
                }
              });
              resolve();
            }
          );
        })
        .catch(e => {
          reject(e);
        });
    });
  }
  // 插入数据
  insertData(data) {
    //插入用户信息
    return new Promise((resolve, reject) => {
      this.open()
        .then(success => {
          let userId = data.userId || "";
          let mobile = data.mobile || "";
          let password = data.password || "";
          let icon = data.icon || "";
          let vipDeadTime = data.vipDeadTime || "";
          let vipGrade = data.vipGrade || "";
          let currentGrade = data.vipGrade || "";
          let gender = data.gender || "";
          let createTime = data.createTime || "";
          let birthDate = data.birthDate || "";
          let schoolNo = data.schoolNo || "";
          let studentNo = data.studentNo || "";
          let registerType = data.registerType || "";
          db.transaction(
            tx => {
              let sql = `INSERT INTO user (userId,mobile,password,icon,vipDeadTime,vipGrade,currentGrade,gender,createTime,birthDate,schoolNo,studentNo,registerType,isLogin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
              tx.executeSql(
                sql,
                [
                  userId,
                  mobile,
                  password,
                  icon,
                  vipDeadTime,
                  vipGrade,
                  currentGrade,
                  gender,
                  createTime,
                  birthDate,
                  schoolNo,
                  studentNo,
                  registerType,
                  false
                ],
                res => {
                  resolve(res);
                  this.updateCurrUser(mobile);
                },
                err => {
                  reject(err);
                }
              );
            },
            error => {
              reject(error);
            },
            res => {
              resolve(res);
            }
          );
        })
        .catch(e => {
          reject(e);
        });
    });
  }
  updateData(column, conditions, data = []) {
    return new Promise((resolve, reject) => {
      this.open().then(success => {
        let sqlStr =
          `update user set ${column}` +
          (conditions != undefined && conditions != ""
            ? ` where ${conditions}`
            : "");
        db.transaction(tx => {
          tx.executeSql(
            sqlStr,
            data,
            (tx, results) => {
              resolve(results.rows);
            },
            err => {
              reject(err);
            }
          );
        });
      });
    });
  }
  // 获取表数据
  getTableData(conditions, data) {
    return new Promise((resolve, reject) => {
      this.open().then(success => {
        let sqlStr =
          "select * from user" +
          (conditions != undefined && conditions != ""
            ? ` where ${conditions}`
            : "");
        let item = data ? [data] : [];
        db.transaction(tx => {
          tx.executeSql(
            sqlStr,
            item,
            (tx, results) => {
              resolve(results.rows);
            },
            err => {
              reject(false);
            }
          );
        });
      });
    });
  }
  updateCurrUser(data) {
    return new Promise((resolve, reject) => {
      this.open().then(success => {
        db.transaction(tx => {
          let sql = `UPDATE currUser SET mobile=?`;
          tx.executeSql(
            sql,
            [data],
            (tx, results) => {
              resolve(results.rows);
            },
            err => {
              reject(err);
            }
          );
        });
      });
    });
  }
  getCurrUser() {
    return new Promise((resolve, reject) => {
      this.open().then(success => {
        db.transaction(tx => {
          let sql = `select * from  currUser`;
          tx.executeSql(
            sql,
            [],
            (tx, results) => {
              resolve(results.rows);
            },
            err => {
              reject(err);
            }
          );
        });
      });
    });
  }
  // 执行sql
  executeSql(sqlStr) {
    return new Promise((resolve, reject) => {
      this.open().then(success => {
        db.transaction(tx => {
          tx.executeSql(
            sqlStr,
            [],
            (tx, results) => {
              resolve(results.rows);
            },
            err => {
              reject(false);
            }
          );
        });
      });
    });
  }

  // 批量执行sql
  executeBatchSql(sqlArr) {
    return new Promise((resolve, reject) => {
      this.open().then(success => {
        db.transaction(
          tx => {
            sqlArr.forEach(sqlStr => {
              tx.executeSql(sqlStr, [], (tx, results) => {}, err => {});
            });
          },
          err => {
            reject(false);
          },
          success => {
            resolve();
          }
        );
      });
    });
  }

  close() {
    if (db) {
      db.close();
    } else {
    }
    db = null;
  }
  render() {
    return null;
  }
}
