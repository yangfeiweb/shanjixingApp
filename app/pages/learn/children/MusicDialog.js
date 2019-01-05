import React from "react";
import {
  Slider,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage
} from "react-native";
import RNFetchBlob from "react-native-fetch-blob";
import PopupDialog, {
  DialogTitle,
  SlideAnimation
} from "react-native-popup-dialog";
import Sound from "react-native-sound";
import { ProgressBar } from "../../../components";
import Icon from "react-native-vector-icons/FontAwesome";
import commonStyle from "../../../globalStyle";
import { utility } from "../../../utility";
import { ResourcePath } from "../../../services/urlConfig";

const slideAnimation = new SlideAnimation({
  slideFrom: "bottom"
});
const dirs = RNFetchBlob.fs.dirs;

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      currMusic: 0,
      volume: 0.5,
      downLoadProgress: 0,
      downLoading: false,
      total: 0,
      currDownloadNum: 0
    };
    this.musicArr = [];
    this.musicLength = 0;
    this.musicSound = null;
    this.musics = [];
    this.isFirstShow = true;
    this.WillUnmount = false;
  }
  componentDidMount() {
    AsyncStorage.getItem("music").then(lists => {
      if (lists) {
        let musics = JSON.parse(lists);
        this.musics = musics;
      }
    });
  }
  getMusicList() {
    if (this.musics) {
      let needDownloads = []; //需要下载的音乐
      for (const item of this.musics) {
        //遍历查看是否有需要下载的音乐
        if (item && item.assetType === "APP_BG_MUSIC") {
          if (item.needDownload) {
            needDownloads.push(item);
          } else {
            this.musicArr.push(item);
          }
        }
      }
      if (needDownloads.length !== 0) {
        this.startNeedDownload(needDownloads);
      } else {
        this.saveMusicList();
      }
    }
  }
  async startNeedDownload(data) {
    this.setState({
      downLoading: true,
      total: data.length,
      currDownloadNum: 0
    });
    let num = 0;
    if (data) {
      for (const item of data) {
        let path = ResourcePath + item.assetUrl;
        let result = await this.downLoad(item, path);
        utility.log("*-------result", result);
        if (result) {
          item.needDownload = false;
          this.musicArr.push(item);
        }
        num++;
        let progress = Math.floor(num / this.state.total * 100);
        this.setState({
          downLoadProgress: progress,
          currDownloadNum: num
        });
        if (num === this.state.total) {
          utility.Toast("α脑波音乐下载完毕");
          this.setState({
            downLoading: false
          });
        }
      }

      this.saveMusicList();
    }
  }
  saveMusicList() {
    this.musicLength = this.musicArr.length;
    AsyncStorage.setItem("music", JSON.stringify(this.musicArr)).then(
      () => {},
      err => {}
    );
  }
  downLoad(item, path) {
    return new Promise((resolve, reject) => {
      RNFetchBlob.config({ path: dirs.DocumentDir + item.assetUrl })
        .fetch("GET", path, {})
        .then(res => {
          return RNFetchBlob.fs.scanFile([
            { path: res.path(), mime: "audio/mpeg" }
          ]);
        })
        .then(res => {
          resolve(true);
        })
        .catch(err => {
          reject(false);
        });
    });
  }
  loadMusic() {
    if (this.musicSound) {
      this.musicSound.release();
    }
    let soundInfo = this.musicArr[this.state.currMusic];
    this.musicSound = new Sound(soundInfo.assetUrl, dirs.DocumentDir, err => {
      if (!err) {
        this.props.onPlayMusic && this.props.onPlayMusic(true);
        this.setState({
          playing: true
        });
        this.musicSound.play();
      }
    });
    this.musicSound.setVolume(this.state.volume);
  }
  playMusic() {
    this.props.onPlayMusic && this.props.onPlayMusic(true);
    this.setState({
      playing: true
    });
    if (this.musicSound) {
      this.musicSound.play();
    } else {
      this.loadMusic();
    }
  }
  pauseMusic() {
    this.musicSound && this.musicSound.pause();
  }
  backward() {
    let curr = this.state.currMusic;
    if (curr === 0) {
      curr = this.musicArr.length - 1;
    } else {
      curr = curr - 1;
    }
    this.setState(
      {
        currMusic: curr
      },
      () => {
        this.loadMusic();
      }
    );
  }
  next() {
    let curr = this.state.currMusic;
    if (curr === this.musicArr.length - 1) {
      curr = 0;
    } else {
      curr = curr + 1;
    }
    this.setState(
      {
        currMusic: curr
      },
      () => {
        this.loadMusic();
      }
    );
  }
  show() {
    if (this.isFirstShow) {
      //第一次显示是检查列表
      this.isFirstShow = false;
      this.getMusicList();
    }
    this.refs.popDialog.show();
  }
  renderContainer() {
    if (!this.state.downLoading) {
      return (
        <View style={{ flex: 1, alignItems: "center" }}>
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => {
                this.backward();
              }}
            >
              <Icon name="step-backward" style={styles.controlIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (this.state.playing) {
                  this.props.onPlayMusic && this.props.onPlayMusic(false);
                  this.pauseMusic();
                  this.setState({
                    playing: false
                  });
                } else {
                  this.playMusic();
                }
              }}
            >
              <Icon
                name={this.state.playing ? "pause" : "play"}
                style={[
                  styles.controlIcon,
                  {
                    color: this.state.playing
                      ? commonStyle.color.primary
                      : commonStyle.color.danger
                  }
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.next();
              }}
            >
              <Icon name="step-forward" style={styles.controlIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.volumeControl}>
            <Icon
              name={
                this.state.volume < 0.2
                  ? "volume-off"
                  : this.state.volume < 0.7
                    ? "volume-down"
                    : "volume-up"
              }
              style={{
                fontSize: 30,
                width: 30,
                color: "#999"
              }}
            />
            <Slider
              style={styles.volume}
              value={50}
              step={1}
              minimumValue={0}
              maximumValue={100}
              minimumTrackTintColor={commonStyle.color.primary}
              maximumTrackTintColor={"gray"}
              thumbTintColor={commonStyle.color.primary}
              onValueChange={val => {
                this.setState({
                  volume: val / 100
                });
                if (this.musicSound) {
                  this.musicSound.setVolume(val / 100);
                }
              }}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.downloadBox}>
          <Text style={{ color: commonStyle.color.primary }}>
            α脑波音乐下载中...
          </Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "70%", marginRight: 5 }}>
              <ProgressBar progress={this.state.downLoadProgress} />
            </View>
            <Text>
              {this.state.currDownloadNum} / {this.state.total}
            </Text>
          </View>
        </View>
      );
    }
  }
  render() {
    return (
      <PopupDialog
        ref="popDialog"
        width={400}
        height={260}
        dialogTitle={
          <DialogTitle
            titleStyle={{
              backgroundColor: commonStyle.color.primary,
              color: "#fff"
            }}
            titleTextStyle={{ color: "#fff" }}
            title="α脑波记忆"
          />
        }
        dialogAnimation={slideAnimation}
      >
        <View style={styles.dialogBody}>
          <Text style={{ alignSelf: "center", marginBottom: 10 }}>
            开启α脑波记忆，进入右脑状态...
          </Text>
          <Text style={{ alignSelf: "center", marginBottom: 10 }}>
            让大脑清醒且放松，注意力更集中！
          </Text>
          <View>{this.renderContainer()}</View>
        </View>
      </PopupDialog>
    );
  }
  componentWillUnmount() {
    this.WillUnmount = true;
    this.musicSound && this.musicSound.release();
  }
  shouldComponentUpdate() {
    if (this.WillUnmount) {
      return false;
    }
    return true;
  }
}

const styles = StyleSheet.create({
  dialogBody: {
    padding: 10,
    flex: 1,
    alignItems: "center"
  },
  timesInfos: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1
  },
  controls: {
    height: 70,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  controlIcon: {
    color: "#666",
    fontSize: 30,
    width: 40
  },
  volumeControl: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  volume: {
    width: 200
  },
  timesItem: {
    flexDirection: "row",
    width: 120,
    padding: 10,
    marginBottom: 10
  },
  downloadBox: {
    flex: 1,
    alignItems: "center"
  }
});
