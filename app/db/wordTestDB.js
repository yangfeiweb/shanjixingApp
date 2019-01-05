import React, { Component } from "react";
// import SQLiteStorage from "react-native-sqlite-storage";
import SQLiteStorage from "react-native-sqlcipher-storage";
import DeviceInfo from "react-native-device-info";

import {
  readFileAssets,
  readFile,
  copyFileAssets,
  DocumentDirectoryPath,
  exists
} from "react-native-fs";

SQLiteStorage.DEBUG(false);
var database_name = "sjxWordTest2.db"; //数据库文件
var database_version = "1.0"; //版本号
var database_size = -1;
var db;
export default class extends Component {
  componentWillUnmount() {
    if (db) {
      db.close();
    } else {
    }
  }
  open() {
    return new Promise((resolve, reject) => {
      if (!db) {
        db = SQLiteStorage.openDatabase(
          {
            name: database_name,
            createFromLocation: "~/data/sjxWordTest.db",
            key: "wordTest"
          },
          () => {
            resolve();
          },
          err => {
            reject();
          }
        );
        // let filePath = DocumentDirectoryPath + "/sjxWordTest.db";
        // exists(filePath).then(hasFile => {
        //   if (!hasFile) {
        //     copyFileAssets(
        //       "data/sjxWordTest.db",
        //       DocumentDirectoryPath + "/sjxWordTest.db"
        //     ).then(res => {
        //       this.initDB().then(
        //         success => {
        //           resolve();
        //         },
        //         err => {
        //           reject();
        //         }
        //       );
        //     });
        //   } else {
        //     this.initDB().then(
        //       success => {
        //         resolve();
        //       },
        //       err => {
        //         reject();
        //       }
        //     );
        //   }
        // });
      } else {
        resolve();
      }
    });
  }
  // initDB() {
  //   return new Promise((resolve, reject) => {
  //     db = SQLiteStorage.openDatabase(
  //       {
  //         name: database_name,
  //         createFromLocation: "sjxWordTest.db",
  //         key: 'wordTest'
  //       },
  //       () => {
  //         resolve();
  //       },
  //       err => {
  //         reject();
  //       }
  //     );
  //   });
  // }
  getData(conditions) {
    return new Promise((resolve, reject) => {
      this.open().then(res => {
        let sqlStr =
          "select * from WORD_TEST" +
          (conditions != undefined && conditions != ""
            ? ` where ${conditions}`
            : "");
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