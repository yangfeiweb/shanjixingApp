import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  ActivityIndicator,
  Picker,
  AsyncStorage
} from "react-native";
import PopupDialog, {
  SlideAnimation,
  DialogTitle,
  DialogButton
} from "react-native-popup-dialog";
import { Header, Loading } from "../../components";
import CollapsedItem from "./children/CollapsedItem";
import { learnDB } from "../../db";
import globalStyle from "../../globalStyle";
import { utility } from "../../utility";

const slideAnimation = new SlideAnimation({
  slideFrom: "bottom"
});
export default class WordsDetail extends Component {
  constructor(props) {
    super(props);
    this.words = []; //辅助列表
    this.Loading = null;
    this.popupDialog = null;
    this.index = 0;
    this.page = 0;
    this.size = 10;
  }
  state = {
    wordList: [],
    grade: "",
    length: 0,
    word: "",
    totalPage: 0,
    opacity: new Animated.Value(0)
  };
  componentDidMount() {
    let { bookNo, name, totalError } = this.props.navigation.state.params;
    let totalPage = Math.ceil(totalError / this.size);
    this.setState({ grade: name, length: totalError, totalPage: totalPage });
    this.getUserBookErrWords();
  }
  getUserBookErrWords() {
    this.Loading.show();
    let { bookNo, name } = this.props.navigation.state.params;
    AsyncStorage.getItem("studentNo")
      .then(studentNo => {
        if (studentNo) {
          learnDB
            .getUserBookErrWords(studentNo, bookNo, this.page, this.size)
            .then(res => {
              this.words = this.words.concat(res);
              this.setState({ wordList: this.words });
              this.Loading.hide();
            })
            .catch(err => {
              this.Loading.hide();
            });
        }
      })
      .catch(err => {
        this.Loading.hide();
      });
  }
  componentDidUpdate() {
    if (this.state.totalPage > this.page + 1) {
      this.isRefresh = false;
    }
  }
  removeWord() {
    //移除生词
  }
  _pressItem(index) {
    this.index = index;
    let item = this.words[index];
    if (item) {
      this.setState({ word: item.word });
      this.popupDialog.show();
    }
  }
  onEndReached() {
    //下拉到底刷新
    if (!this.isRefresh && this.page + 1 < this.state.totalPage) {
      this.isRefresh = true;
      this.page++;
      this.getUserBookErrWords();
    }
  }
  onScrollBeginDrag() {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  }
  onScrollEndDrag() {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  }
  _renderItem({ item, index, separators }) {
    return (
      <CollapsedItem
        content={item}
        index={index}
        onRemove={this._pressItem.bind(this)}
      />
    );
  }
  _renderList() {
    return (
      <FlatList
        data={this.state.wordList}
        renderItem={this._renderItem.bind(this)}
        keyExtractor={(item, index) => "index_" + index}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.1}
        contentContainerStyle={{ paddingBottom: 50 }}
        onEndReached={this.onEndReached.bind(this)}
        initialNumToRender={20}
        onScrollBeginDrag={this.onScrollBeginDrag.bind(this)}
        onScrollEndDrag={this.onScrollEndDrag.bind(this)}
      />
    );
  }
  _rederEmpty() {
    return (
      <View
        style={{
          justifyContent: "center",
          height: "100%",
          alignItems: "center"
        }}
      >
        <Text style={styles.Text}>暂无生词</Text>
      </View>
    );
  }
  render() {
    const title = `${this.state.grade} 共(${this.state.length})条`;
    return (
      <View style={styles.container}>
        <Header title={title} />
        <View style={{ width: "100%", alignItems: "center" }}>
          <View style={{ width: "90%" }}>
            {this.state.length === 0 ? this._rederEmpty() : this._renderList()}
          </View>
        </View>
        <Animated.View
          style={[{ opacity: this.state.opacity }, styles.pageInfo]}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>
            {this.page + 1}/{this.state.totalPage}
          </Text>
        </Animated.View>
        <PopupDialog
          dialogTitle={
            <DialogTitle
              title="提示"
              titleStyle={{ backgroundColor: globalStyle.color.primary }}
              // titleTextStyle={{ color: "#fff" }}
            />
          }
          ref={popupDialog => {
            this.popupDialog = popupDialog;
          }}
          dialogAnimation={slideAnimation}
          width={0.5}
        >
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <View style={styles.dialogTipText}>
              <Text style={{ color: "#000000" }}>您确定移除</Text>
              <Text
                style={{ color: "#E7262C", fontSize: 26, marginHorizontal: 5 }}
              >
                {this.state.word}
              </Text>
              <Text style={{ color: "#000000" }}>单词吗?</Text>
            </View>
          </View>
          <DialogButton
            buttonStyle={{ width: "100%" }}
            textStyle={{ color: "#E7262C" }}
            text="确认删除"
            onPress={this.removeWord.bind(this)}
          />
        </PopupDialog>
        <Loading
          ref={ref => {
            this.Loading = ref;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  listHeader: {
    height: 30,
    alignItems: "flex-start",
    borderRadius: 5
  },
  Text: {
    color: "#56BDFF",
    fontSize: 30
  },
  dialogTipText: {
    flexDirection: "row",
    alignItems: "center"
  },
  pageInfo: {
    width: 150,
    height: 40,
    borderRadius: 20,
    position: "absolute",
    bottom: 10,
    left: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    transform: [{ translateX: -75 }]
  }
});
