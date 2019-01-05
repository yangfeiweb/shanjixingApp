import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Card, CardItem } from "native-base";
import { Header } from "../../components";
import getColumnWords from "../../controller/course";
import Sound from "react-native-sound";
import RNFetchBlob from "react-native-fetch-blob";

const dirs = RNFetchBlob.fs.dirs;
const courseRoot = dirs.DocumentDir + "/course/";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wordList: []
      // wordSound:null,
    };
  }
  componentDidMount() {
    const { params } = this.props.navigation.state;
    let bookNo = params.bookNo;
    let columnNo = params.columnNo;
    let columnName = params.columnName;
    this.setState({
      columnName: columnName
    });
    getColumnWords.getColumnWords(bookNo, columnNo).then(res => {
      res.forEach(e => {
        let mean = e.content3.split("<br />").toString();
        e.content3 = mean;
      });
      this.setState({ wordList: res }, () => {});
    });
  }
  componentWillUnmount() {
    // this.wordSound && this.wordSound.release();
  }

  wordPlay(index) {
    let soundSrc = courseRoot + "voices";
    let src = this.state.wordList[index].content7;
    if (this.wordSound) {
      this.wordSound.release();
    }
    this.wordSound = new Sound(src, soundSrc, err => {
      if (!err) {
        this.wordSound.play();
      }
    });
  }

  render() {
    return (
      <View>
        <Header title={this.state.columnName + " - 单词列表"} />
        <ScrollView>
          <View style={styles.list}>
            {this.state.wordList.map((item, index) => {
              return (
                <View key={index} style={{ width: "45%" }}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      this.wordPlay(index);
                    }}
                  >
                    <Card style={styles.card}>
                      <Text>
                        <Text>单词：</Text>
                        <Text style={styles.text}>{item.content1}</Text>
                      </Text>
                      <Text>音标：{item.content2}</Text>
                      <Text>词义：{item.content3}</Text>
                    </Card>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingBottom: 50
  },
  text: {
    fontSize: 24,
    color: "#15C6FF"
  },
  card: {
    padding: 10,
    minHeight: 150
  }
});
