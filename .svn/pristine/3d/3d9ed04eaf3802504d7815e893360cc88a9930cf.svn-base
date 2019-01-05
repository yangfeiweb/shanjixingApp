import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  DeviceEventEmitter
} from "react-native";

import { Header, LeftUserInfo, Loading, BookDownload } from "../../components";
import { Button } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import commonStyle from "../../globalStyle";
import dataService from "../../services";
import { courseController } from "../../controller";
import { BOOK_CATEGORY, BOOK_COLUMN_TYPE } from "../../utility/dict";
import { ResourcePath } from "../../services/urlConfig";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      selectedCategory: ""
    };
  }
  componentDidMount() {
    AsyncStorage.getItem("studentNo").then(studentNo => {
      this.studentNo = studentNo;
      this.refs.loading.show();
      this.getBookData();
    });
    this.refreshBookListener = DeviceEventEmitter.addListener(
      "refreshBookList",
      () => {
        courseController.getBookListInDB().then(books => {
          this.checkBookStatus(books);
        });
      }
    );
  }

  componentWillUnmount() {
    this.refreshBookListener && this.refreshBookListener.remove();
  }

  getBookData() {
    courseController.getBookListInDB().then(books => {
      this.checkBookStatus(books);
    });
  }

  checkBookStatus(data) {
    courseController.getUserBooksList(this.studentNo).then(userBooks => {
      data.forEach(item => {
        let bookNo = item.bookNo;
        if (
          userBooks.find(userBook => {
            return userBook.bookNo === bookNo;
          })
        ) {
          item["learning"] = true;
        }
      });
      courseController.getCachedBookNos(this.studentNo).then(cachedBooks => {
        data.forEach(item => {
          let bookNo = item.bookNo;
          if (
            cachedBooks.find(cachedItem => {
              return cachedItem.bookNo === bookNo;
            })
          ) {
            item["cached"] = true;
          }
        });
        this.buildBooksData(data);
      });
    });
  }

  buildBooksData(data) {
    let categoryObj = {};
    for (let key in BOOK_CATEGORY) {
      let val = BOOK_CATEGORY[key];
      categoryObj[key] = {
        key: key,
        name: val,
        books: []
      };
    }
    data.forEach(item => {
      let key = item.bookType;
      let categoryItem = categoryObj[key];
      if (categoryItem) {
        categoryItem.books.push(item);
      }
    });
    let categories = [];
    for (let key in categoryObj) {
      let val = categoryObj[key];
      let books = val.books;
      // 课本分组
      let groups = [];
      books.forEach(item => {
        let type = item.bookSort;
        let groupItem = groups.find(group => {
          return group.key === type;
        });
        if (!groupItem) {
          groupItem = {
            key: type,
            name: BOOK_COLUMN_TYPE[type] || "",
            books: []
          };
          groups.push(groupItem);
        }
        groupItem.books.push(item);
      });
      categories.push({
        key: key,
        name: BOOK_CATEGORY[key] || "",
        groups: groups
      });
    }
    this.setState({
      categories: categories,
      selectedCategory: "FREE"
    });
    this.refs.loading && this.refs.loading.hide();
  }

  renderColumn() {
    let currCagegory = this.state.categories.find(item => {
      return item.key === this.state.selectedCategory;
    });
    if (currCagegory) {
      let groups = currCagegory.groups;
      return groups.map(group => {
        return (
          <View key={group.key}>
            <View style={styles.columnBar}>
              <View style={styles.columnSign} />
              <View style={styles.columnContent}>
                <Text style={styles.columnTitle}>{group.name}</Text>
              </View>
            </View>
            <View style={styles.books}>
              {group.books.map((book, idx) => {
                return (
                  <View style={styles.bookItem} key={book.bookNo}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ currBook: book }, () => {
                          this.refs.courseInfo.show();
                        });
                      }}
                    >
                      <Image
                        style={styles.bookImg}
                        source={{ uri: ResourcePath + book.coverImgUrl }}
                      />
                      {book.learning && (
                        <Icon name="check" style={styles.bookStatusIcon} />
                      )}

                      <Text style={styles.bookTitle} numberOfLines={2}>
                        {book.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        );
      });
    }
  }

  render() {
    return (
      <View style={styles.courseRoot}>
        <Header title="课程中心">
          <LeftUserInfo slot="left" />
        </Header>
        <View style={styles.content}>
          <View style={{ height: 80 }}>
            <ScrollView horizontal style={styles.categoryBtns}>
              {this.state.categories.map(item => {
                return (
                  <Button
                    key={item.key}
                    style={[
                      styles.categoryBtn,
                      this.state.selectedCategory === item.key
                        ? {
                            backgroundColor: commonStyle.color.primary
                          }
                        : {}
                    ]}
                    bordered={true}
                    info
                    onPress={() => {
                      this.setState(
                        {
                          selectedCategory: item.key
                        },
                        () => {
                          this.refs.booksScrollView.scrollTo({ x: 0, y: 0 });
                        }
                      );
                    }}
                  >
                    <Text
                      style={{
                        color:
                          this.state.selectedCategory === item.key
                            ? "#fff"
                            : "#888"
                      }}
                    >
                      {item.name}
                    </Text>
                  </Button>
                );
              })}
            </ScrollView>
          </View>
          <ScrollView ref="booksScrollView" style={styles.categoryDetails}>
            {this.renderColumn()}
          </ScrollView>
        </View>
        <BookDownload
          bookInfo={this.state.currBook}
          onDownload={() => {
            let book = this.state.currBook;
            book.cached = true;
            book.learning = true;
            this.setState({
              currBook: book
            });
            DeviceEventEmitter.emit("refreshBookList");
          }}
          ref="courseInfo"
        />
        <Loading ref="loading" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  courseRoot: {
    flex: 1
  },
  content: {
    flex: 1,
    backgroundColor: "white"
  },
  categoryBtns: {
    flexDirection: "row"
    // alignItems: "center",
    // justifyContent: "center"
  },
  categoryBtn: {
    margin: 10,
    borderRadius: 10,
    alignSelf: "center",
    padding: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  categoryDetails: {
    flex: 1,
    paddingLeft: 50,
    paddingRight: 50
  },
  columnBar: {
    height: 30,
    marginTop: 5,
    flexDirection: "row"
  },
  columnSign: {
    height: 30,
    width: 5,
    backgroundColor: commonStyle.color.primary
  },
  columnContent: {
    height: 30,
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10
  },
  columnTitle: {
    color: commonStyle.color.primary
  },
  books: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  bookItem: {
    width: 120,
    marginBottom: 20,
    marginRight: 30,
    alignItems: "center",
    position: "relative"
    //justifyContent: "center"
  },
  bookImg: {
    height: 120,
    width: 120
  },
  bookTitle: {},
  bookStatusIcon: {
    position: "absolute",
    color: commonStyle.color.primary,
    top: 0,
    right: 0,
    fontSize: 30
  }
});
