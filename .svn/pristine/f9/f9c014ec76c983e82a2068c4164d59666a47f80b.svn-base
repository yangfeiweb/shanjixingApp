import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Platform,
  Image,
  AsyncStorage,
  DeviceEventEmitter
} from "react-native";
import {
  Card,
  CardItem,
  Left,
  Body,
  Icon,
  Right,
  Button,
  Thumbnail
} from "native-base";
import { withNavigation } from "react-navigation";
import { Header, LeftUserInfo, Loading, BookDownload } from "../../components";
import globalStyle from "../../globalStyle";
import { courseController } from "../../controller";
import { ResourcePath } from "../../services/urlConfig";
import { utility } from "../../utility";
class WordBook extends React.Component {
  constructor(props) {
    super(props);
    this.Loading = null;
    this.refreshBookList = null;
    this.studentInfo = {};
    this.isClick = false;
    this.timer = null;
  }
  state = {
    data: [],
    length: -1,
    currBookInfo: null
  };
  componentDidMount() {
    utility.getCurrUserInfo().then(res => {
      if (res) {
        this.studentInfo = res;
      }
    });
    this.getBookList();
    this.refreshBookList = DeviceEventEmitter.addListener(
      "refreshBookList",
      () => {
        this.getBookList();
      }
    );
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
    this.refreshBookList && this.refreshBookList.remove();
  }
  getBookList() {
    this.Loading.show();
    AsyncStorage.getItem("studentNo")
      .then(studentNo => {
        if (studentNo) {
          courseController
            .getUserBooksList(studentNo)
            .then(res => {
              if (res) {
                this.setState({ data: res, length: res.length });
              }
              this.Loading && this.Loading.hide();
            })
            .catch(err => {
              this.Loading && this.Loading.hide();
            });
        }
      })
      .catch(err => {
        this.Loading && this.Loading.hide();
      });
  }
  selectGrade(item) {
    if (!this.isClick) {
      this.isClick = true;
      this.changeClick();

      utility.getVipRemainDay().then(days => {
        this.setState(
          {
            currBookInfo: item
          },
          () => {
            if (item.bookType === "FREE" || days > 0) {
              this.refs.BookDownload.checkBookCached().then(success => {
                this.props.navigation.navigate({
                  routeName: "WordsDetail",
                  params: {
                    bookNo: item.bookNo,
                    name: item.name,
                    totalError: item.totalError || 0
                  }
                });
              });
            } else {
              DeviceEventEmitter.emit("showRecharge");
            }
          }
        );
      });
    }
  }
  changeClick() {
    this.timer = setTimeout(() => {
      this.timer && clearTimeout(this.timer);
      this.isClick = false;
    }, 500);
  }
  _renderItem(obj) {
    let item = obj.item;
    return (
      <Button
        transparent
        onPress={() => this.selectGrade(item)}
        large
        style={{ height: 120 }}
      >
        <Card>
          <CardItem>
            <Left>
              <Thumbnail
                source={{ uri: ResourcePath + item.coverImgUrl }}
                large
                square
              />
              <Body>
                <Text>{item.name}</Text>
                <Text>共有:{item.totalError || 0}个生词</Text>
              </Body>
            </Left>
            <Right>
              <Icon
                name="chevron-thin-right"
                type="Entypo"
                style={{ color: globalStyle.color.primary }}
              />
            </Right>
          </CardItem>
        </Card>
      </Button>
    );
  }

  _renderList() {
    return (
      <FlatList
        data={this.state.data}
        renderItem={this._renderItem.bind(this)}
        keyExtractor={(item, index) => "index" + index}
        showsVerticalScrollIndicator={false}
      />
    );
  }
  _renderEmpty() {
    return (
      <View style={[{ height: "100%" }, styles.container]}>
        <Text style={styles.Text}>您还没有正在学习的课程哦！</Text>
      </View>
    );
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header title="生词本">
          <LeftUserInfo slot="left" />
        </Header>
        <View style={{ flex: 1, paddingVertical: 5, alignItems: "center" }}>
          <View style={[styles.listBox]}>
            {this.state.length === 0 ? this._renderEmpty() : this._renderList()}
          </View>
        </View>
        <Loading
          ref={ref => {
            this.Loading = ref;
          }}
        />
        <BookDownload ref="BookDownload" bookInfo={this.state.currBookInfo} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  listBox: {
    width: "80%"
    // alignItems: "center",
  },
  listHeader: {
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#56BDFF",
    borderRadius: 5
  },
  listItem: {
    flexDirection: "row",
    backgroundColor: "#ECECEC",
    // backgroundColor: "#ffee00",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10
  },
  listItemLeftContainer: {
    flexDirection: "row"
  },
  Text: {
    color: "#56BDFF",
    fontSize: 30
  }
});

export default withNavigation(WordBook);
