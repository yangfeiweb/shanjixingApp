import React from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Vibration
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ProgressBar } from "../../../components";
import { Button } from "native-base";
import { ResourcePath } from "../../../services/urlConfig";

export default class BookItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.data.selected
    };
  }
  componentDidMount() {
    // utility.getUsersInfo().then(usersInfo => {
    //   this.studentInfo = usersInfo.currUserInfo;
    //   this.studentNo = this.studentInfo.studentNo;
    // });
  }
  componentWillUnmount() {
    this.pressTimer && clearTimeout(this.pressTimer);
  }
  componentDidUpdate() {
    this.props.updated && this.props.updated();
  }
  renderCheck() {
    if (this.props.showSelect) {
      if (this.state.selected) {
        return <Icon name="check-circle-outline" style={styles.iconOn} />;
      } else {
        return (
          <Icon name="checkbox-blank-circle-outline" style={styles.iconOff} />
        );
      }
    }
  }
  render() {
    return (
      <TouchableNativeFeedback
        delayLongPress={1000}
        onLongPress={() => {
          Vibration.vibrate([0, 150]);
          this.props.setSelecting();
          this.setState({
            selected: true
          });
          this.props.selectBookItem(this, this.props.data, true);
        }}
        onPress={() => {
          if (this.props.showSelect) {
            if (this.state.selected) {
              this.setState({
                selected: false
              });
              this.props.selectBookItem(this, this.props.data, false);
            } else {
              this.setState({
                selected: true
              });
              this.props.selectBookItem(this, this.props.data, true);
            }
          }
        }}
      >
        <View style={styles.book}>
          {this.renderCheck()}
          <Image
            style={styles.pic}
            source={
              this.props.data && {
                uri: ResourcePath + this.props.data.coverImgUrl
              }
            }
          />
          <View style={styles.info}>
            <Text numberOfLines={2} style={styles.title}>
              {this.props.data.name}
            </Text>
            <ProgressBar
              progress={Math.floor(
                this.props.data.totalRight * 100 / this.props.data.words
              )}
            />

            <View style={styles.btnView}>
              <Button
                info
                style={[
                  styles.btn,
                  {
                    backgroundColor:
                      this.props.data.totalRight > 0 ||
                      this.props.data.totalError > 0
                        ? "#5BB85C"
                        : "#56BDFF"
                  }
                ]}
                disabled={this.props.showSelect}
                onPress={() => {
                  if (!this.pressed) {
                    this.pressed = true;
                    this.props.onBookPress &&
                      this.props.onBookPress(this.props.data);
                    this.pressTimer = setTimeout(() => {
                      this.pressed = false;
                    }, 1500);
                  }
                }}
              >
                <Text style={{ color: "#fff" }}>
                  {this.props.data.totalRight > 0 ||
                  this.props.data.totalError > 0
                    ? "继续学习"
                    : "开始学习"}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

const styles = StyleSheet.create({
  book: {
    width: 270,
    height: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 5,
    paddingTop: 0,
    backgroundColor: "#fff",
    borderRadius: 3,
    marginLeft: 30,
    marginBottom: 30
  },
  iconOff: {
    width: 22,
    fontSize: 20,
    color: "lightgray"
  },
  iconOn: {
    width: 22,
    fontSize: 20,
    color: "#56BDFF"
  },
  pic: {
    width: 90,
    height: 90
  },
  info: {
    flex: 1,
    padding: 10,
    height: "100%"
  },
  title: {
    height: 35,
    fontSize: 12
    // width:'200%'
  },

  btnView: {
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  btn: {
    height: 36,
    width: 120,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5
  }
});
