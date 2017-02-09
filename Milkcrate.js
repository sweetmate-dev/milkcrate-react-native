/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, Image, Dimensions, TextInput, TouchableOpacity, Navigator } from 'react-native';
import AppIntro from './AppIntro';
import LoginForm from './LoginForm'
const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
        padding: 0,
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pic: {
        width: 75 * 2,
        height: 63 * 2,
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    info: {
        flex: 0.5,
        alignItems: 'center',
    },
    title: {
        color: '#5E8AA3',
        fontSize: 24,
        fontFamily: 'Blanch-Caps',
        paddingBottom: 20,
    },
    description: {
        fontFamily: 'Open Sans',
        color: '#5E8AA3',
        fontSize: 12,
        paddingBottom: 7,
    },
    singleLine: {
        fontSize: 16,
        padding: 4,
        color:'#5E8AA3',
        height: 48, width: 295, borderColor: '#FFF', backgroundColor: '#FFF', borderWidth: 1, borderRadius: 4, fontSize: 14
    },
    appTitle:{
        flex:1,
        alignItems: 'center',
        justifyContent:'center',
        marginTop:-100,
    },
    appTitleImg:{
        width: 233, height: 112
    },
    topBack:{
        width: width, height: height, resizeMode:'contain'
    }
});

export default class Milkcrate extends Component {

    onSkipBtnHandle = (index) => {
        console.log(index);
    }
    doneBtnHandle = () => {
    }
    nextBtnHandle = (index) => {
        console.log(index);
    }
    onSlideChangeHandle = (index, total) => {
        console.log(index, total);
    }

    render() {
        return (
            <AppIntro
                onNextBtnClick={this.nextBtnHandle}
                onDoneBtnClick={this.doneBtnHandle}
                onSkipBtnClick={this.onSkipBtnHandle}
                onSlideChange={this.onSlideChangeHandle}
            >

                <View style={[styles.slide,{ backgroundColor: '#fff' }]}>
                    <View style={styles.header}>
                        <Image style={styles.topBack} source={require('./img/introduction/background/bk-image1.png')}>
                            <View style={styles.appTitle}
                            >
                                <Image style={styles.appTitleImg} source={require('./img/introduction/background/app-title.png')} />
                            </View>

                        </Image>
                    </View>
                    <View style={[styles.info, {padding: 40}]}>
                        <View level={15}><Text style={styles.description}>A platform to help individuals like</Text></View>
                        <View level={15}><Text style={styles.description}>you make a difference for the</Text></View>
                        <View level={15}><Text style={styles.description}>environment and your community.</Text></View>
                    </View>
                </View>

                <View style={[styles.slide, { backgroundColor: '#fff' }]}>
                    <View style={styles.header}>
                        <View>
                            <Image style={styles.topBack} source={require('./img/introduction/background/bk-image2.png')} />
                        </View>
                    </View>
                    <View style={[styles.info, {paddingBottom: 80}]}>
                        <View level={10}><Text style={[styles.title, {fontSize: 48, paddingBottom: 8}]}>DISCOVER</Text></View>
                        <View level={15}><Text style={styles.description}>And check in to hundreds of sustainable</Text></View>
                        <View level={15}><Text style={styles.description}>businesses in your neighborhood.</Text></View>
                    </View>
                </View>

                <View style={[styles.slide, { backgroundColor: '#fff' }]}>
                    <View style={styles.header}>
                        <View>
                            <Image style={styles.topBack} source={require('./img/introduction/background/bk-image3.png')} />
                        </View>
                    </View>
                    <View style={[styles.info, {paddingBottom: 80}]}>
                        <View level={10}><Text style={[styles.title, {fontSize: 48, paddingBottom: 8}]}>TAKE IMPACTFUL ACTIONS</Text></View>
                        <View level={15}><Text style={styles.description}>Take part in our weekly challenges, or earn</Text></View>
                        <View level={15}><Text style={styles.description}>points for taking random actions throughout</Text></View>
                        <View level={15}><Text style={styles.description}>the week.</Text></View>
                    </View>
                </View>

                <View style={[styles.slide, { backgroundColor: '#fff' }]}>
                    <View style={styles.header}>
                        <View>
                            <Image style={styles.topBack} source={require('./img/introduction/background/bk-image4.png')} />
                        </View>
                    </View>
                    <View style={[styles.info, {paddingBottom: 80}]}>
                        <View level={10}><Text style={[styles.title, {fontSize: 48, paddingBottom: 8}]}>PARTICIPATE</Text></View>
                        <View level={15}><Text style={styles.description}>In volunteer opportunities and</Text></View>
                        <View level={15}><Text style={styles.description}>green-themed events, all found in our</Text></View>
                        <View level={15}><Text style={styles.description}>categorized calendar.</Text></View>
                    </View>
                </View>

                <View style={[styles.slide, { backgroundColor: '#fff' }]}>
                    <View style={styles.header}>
                        <View>
                            <Image style={styles.topBack} source={require('./img/introduction/background/bk-image5.png')} />
                        </View>
                    </View>
                    <View style={[styles.info, {paddingBottom: 80}]}>
                        <View level={10}><Text style={[styles.title, {fontSize: 48, paddingBottom: 8}]}>EARN POINTS & REWARDS</Text></View>
                        <View level={15}><Text style={styles.description}>Check in, check off actions, register for</Text></View>
                        <View level={15}><Text style={styles.description}>events, sign up for services and watch your</Text></View>
                        <View level={15}><Text style={styles.description}>points automatically tally up!</Text></View>
                    </View>
                </View>

                <View style={[styles.slide, { backgroundColor: '#fff' }]}>
                    <View style={styles.header}>
                        <View>
                            <Image style={styles.topBack} source={require('./img/introduction/background/bk-image6.png')} />
                        </View>
                    </View>
                    <View style={[styles.info, {paddingBottom: 80}]}>
                        <View level={10}><Text style={[styles.title, {fontSize: 48, paddingBottom: 8}]}>VIEW YOUR PROGRESS</Text></View>
                        <View level={15}><Text style={styles.description}>See your individual impact and personal</Text></View>
                        <View level={15}><Text style={styles.description}>achievements as well as your community’s</Text></View>
                        <View level={15}><Text style={styles.description}>activity for comparison and competition.</Text></View>
                    </View>
                </View>
                <View style={[styles.slide, { backgroundColor: '#BDD5EF' }]}>
                    <LoginForm></LoginForm>
                </View>
            </AppIntro>
        );
    }
}