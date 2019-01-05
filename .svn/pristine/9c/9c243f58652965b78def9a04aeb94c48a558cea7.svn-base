import React, { Component } from 'react'
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { Container, Content, Tab, Tabs, Body } from "native-base";
import { Header, Loading } from "../../components";
import ChartTabBar from "./children/ChartTabBar";
import ChartByMonth from "./children/ChartByMonth";
import ChartByWeek from "./children/ChartByWeek";
import ChartByYear from "./children/ChartByYear";
export default class Chart extends Component {
    constructor(props) {
        super(props)
        this.Loading = null
        this.showLoading = this.showLoading.bind(this)
        this.hideLoading = this.hideLoading.bind(this)
    }
    showLoading() {
        this.refs.Loading.show()
    }
    hideLoading() {
        this.refs.Loading.hide()
    }
    render() {
        return <Container>
            <ImageBackground source={require('../../assets/images/registry-background.png')} style={{ width: "100%", height: "100%" }}>
                <Loading ref="Loading" ></Loading>
                <Content>
                    <Header title="学习统计" transparent />
                    <Body style={{ width: "80%" }} >
                        <Tabs renderTabBar={() => <ChartTabBar />} scrollWithoutAnimation initialPage={0} tabBarUnderlineStyle={{ height: 0 }} locked>
                            <Tab heading="按周" style={styles.tabs}>
                                <ChartByWeek hideLoading={this.hideLoading} showLoading={this.showLoading}></ChartByWeek>
                            </Tab>
                            <Tab heading="按月" style={styles.tabs} >
                                <ChartByMonth hideLoading={this.hideLoading} showLoading={this.showLoading}></ChartByMonth>
                            </Tab>
                            <Tab heading="按年" style={styles.tabs}>
                                < ChartByYear hideLoading={this.hideLoading} showLoading={this.showLoading} />
                            </Tab>
                        </Tabs>
                    </Body>
                </Content>
            </ImageBackground>
        </Container >
    }
}

const styles = StyleSheet.create({
    tabs: {
        borderRadius: 20, backgroundColor: "transparent"
    }
})