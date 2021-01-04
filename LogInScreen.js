import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, Picker, TouchableOpacity, Image} from 'react-native';
import {fakeLogIn} from "./fakeLogIn";
import logo from './assets/logo.png';
import {loginFunction} from "./loginFunction";

export function LogInScreen ({navigation}) {
    let [email, setEmail] = useState();
    let [password, setPassword] = useState();
    let [selectedValue, setSelectedValue] = useState('User');

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logoImage}/>
            <Text style={styles.logo}> THE ONLY WAY IS MEDBAY </Text>
            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholder="e-mail"
                    placeholderTextColor="#003f5c"
                    onChangeText={text => setEmail(text)}/>
            </View>
            <View style={styles.inputView} >
                <TextInput
                    secureTextEntry
                    style={styles.inputText}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    onChangeText={text => setPassword(text)}
                />
            </View>
            <Picker
                style = {styles.picker}
                selectedValue= {selectedValue}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
            >
                <Picker.Item label="User" value='User'/>
                <Picker.Item label="Private Doctor" value='Private Doctor'/>
            </Picker>
            <TouchableOpacity style={styles.loginBtn}
                              onPress = {()=> loginFunction({navigation},selectedValue,email,password)}>
                <Text style={styles.loginText}
                    /**onPress = {()=> loginFunction(user,email,password)}*/>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress = {() => navigation.push('Registration')}>
                <Text style={{color:"#4169e1", fontWeight: "bold"}}>SignUp</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: "31%",
        height: "16%",
        marginBottom: "15%"
    },
    logo:{
        fontWeight:"bold",
        fontSize:20,
        color:"#fb5b5a",
        marginBottom:40
    },
    inputView:{
        width:"80%",
        backgroundColor:"#fff8dc",
        borderRadius:25,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    inputText:{
        height:50,
        color:"black"
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#4169e1",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },
    loginText:{
        color:"white",
        fontWeight: "bold"
    },
    picker:{
        height: 50,
        width: 150
    }
});