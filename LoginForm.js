/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, Image, Dimensions, TextInput, TouchableOpacity, Navigator } from 'react-native';
import Button from './components/Button';

const { height, width } = Dimensions.get('window');

const loginStyles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
        padding: 0,
    },
    header: {
        flex: 1,
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
        marginBottom: 7,
    },
    singleLine: {
        fontSize: 16,
        padding: 4,
        color:'#5E8AA3',
        height: 48, width: 295, borderColor: '#FFF', backgroundColor: '#FFF', borderWidth: 1, borderRadius: 4, fontSize: 14,
        marginBottom:5
    },
    button:{
        width:295, height:40, overflow:'hidden', borderRadius:4, backgroundColor:'#82CCBE',
        flexDirection:'row', alignItems:'center', justifyContent:'center',
        marginTop:40,marginBottom:20
    }
});

export default class LoginForm extends Component {

    loginBtnHandle = (name) => {
        this.props.navigator.push({name: 'TAB_NAVIGATOR'});
    }
    contactUsBtnHandle = () => {
        alert("Contact Us");
    }

    render() {
        return (
            <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'transparent'}}>
                <View style={{position: 'absolute', top: 60, left: 50}}>
                    <Image style={{ width: 95, height: 56, resizeMode:'contain'}} source={require('./img/login/cloud1.png')} />
                </View>
                <View style={{position: 'absolute',top: 30,left: width-190}}>
                    <Image style={{ width: 191, height: 111, resizeMode:'contain' }} source={require('./img/login/cloud2.png')} />
                </View>
                <View style={{backgroundColor:'transparent'}}>
                    <Text style={{fontFamily:'Blanch-Caps', fontSize:48,textAlign:'center',color:'#5E8AA3'}}>Get Started!</Text>
                    <Text style={{fontFamily:'OpenSans-Semibold',fontSize:12,color:'#5E8AA3',lineHeight:20, textAlign:'center'}}>
                        Did you get our registration email?
                    </Text>
                    <Text style={{fontFamily:'OpenSans-Semibold',fontSize:12,color:'#5E8AA3',lineHeight:20, textAlign:'center',marginBottom:30}}>
                        Use your credentials below to sign in.
                    </Text>
                </View>

                <TextInput placeholder="Email" placeholderTextColor='#9B9B9B' textAlign='center' style={[loginStyles.singleLine]}
                />
                <TextInput placeholder="Password"  secureTextEntry={true} placeholderTextColor='#9B9B9B' textAlign='center' style={loginStyles.singleLine}/>
                <TextInput placeholder="Community Code" placeholderTextColor='#9B9B9B' textAlign='center' style={loginStyles.singleLine}/>
                <Button
                    containerStyle={loginStyles.button}
                    style={{fontSize:14, color:'#FFF'}}
                    onPress={() => this.loginBtnHandle('TAB_NAVIGATOR')}>
                    Submit
                </Button>

                <Text style={loginStyles.description}>Didn’t get the email?</Text>
                <Button
                    containerStyle={{overflow:'hidden', borderRadius:4, flexDirection:'row', alignItems:'center', justifyContent:'center'}}
                    style={{fontSize:12, textDecorationLine:'underline', fontWeight:'bold', color:'#5E8AA3'}}
                    onPress={() => this.contactUsBtnHandle()}>
                    Contact Us.
                </Button>
            </View>
        );
    }
}