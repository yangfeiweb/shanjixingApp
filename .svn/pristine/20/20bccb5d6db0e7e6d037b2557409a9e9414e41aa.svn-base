import Sound from "react-native-sound";

let nextSound;
let successSound;
let errSound;
export default class {
  constructor() {
    this.init();
  }
  init() {
    if (!nextSound) {
      nextSound = new Sound(require("../assets/sounds/a.mp3"), error => {
        if (error) {
          this.nextSound.reset();
          return;
        }
      });
    }
    if (!successSound) {
      successSound = new Sound(require("../assets/sounds/s.mp3"), error => {
        if (error) {
          this.successSound.reset();
          return;
        }
      });
    }
    if (!errSound) {
      errSound = new Sound(require("../assets/sounds/e.mp3"), error => {
        if (error) {
          this.errSound.reset();
          return;
        }
      });
    }
  }
  release() {
    nextSound && nextSound.release();
    successSound && successSound.release();
    errSound && errSound.release();
  }
  play(name, callBack) {
    switch (name) {
      case "next":
        nextSound &&
          nextSound.play(success => {
            if (!success) {
              nextSound.reset();
            }
            callBack && callBack(success);
          });
        break;
      case "success":
        successSound &&
          successSound.play(success => {
            if (!success) {
              successSound.reset();
            }
            callBack && callBack(success);
          });
        break;
      case "error":
        errSound &&
          errSound.play(success => {
            if (!success) {
              errSound.reset();
            }
            callBack && callBack(success);
          });
        break;
    }
  }
}
