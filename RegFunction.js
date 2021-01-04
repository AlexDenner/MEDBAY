import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Picker,
    ScrollView,
    Image,
    SafeAreaView,
    TouchableOpacity,
    Modal, Alert
} from 'react-native';
import logo from './assets/logo.png';
import {Entypo} from "@expo/vector-icons";
import {SignUpFunction} from "./SignUpFunction";
import DateTimePicker from "@react-native-community/datetimepicker";
import {LinearGradient} from "expo-linear-gradient";

export function RegFunction({navigation}) {
    const [modalUser,setModalUser] = useState(false);
    const [modalDoctor,setModalDoctor] = useState(false);
    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null);
    const [surname, setSurname] = useState(null);
    const [fiscalC, setCF] = useState(null);
    const [phone, setPhone] = useState(null);
    const [password, setPassword] = useState(null);
    const [pasCheck, setPC] = useState(false);
    const [city, setCity] = useState(null);
    const [prov, setProv] = useState(null);
    const [via, setVia] = useState(null);
    const [civic, setCivic] = useState(null);
    const [cap, setCap] = useState(null);
    const user = true;
    const doctor = false;
    const [emailD, setEmailD] = useState(null);
    const [nameD, setNameD] = useState(null);
    const [surnameD, setSurnameD] = useState(null);
    const [passwordD, setPasswordD] = useState(null);
    const [phoneD,setPhoneD] = useState(null);
    const [medField, setMF] = useState(null);
    const [spec, setSpec] = useState(null);
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateText,setDT] = useState('Set Birth Date*')

    function pasOk (text,passwd) {
        if(text === passwd)
            setPC(true);
    }

    function onChange(event, selectedDate) {
        const currentDate = selectedDate;

        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        getCurrentDate(currentDate);
    }

    function getCurrentDate(dat) {
        const dateString = dat.toDateString();
        setDT(dateString);
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    function preSignUp(pasCheck,userBit,email,name,surname,date,password,fiscalC,city,prov,via,civic,cap,phone) {
        if (pasCheck) {
            //console.log(pasCheck,userBit,email,name,surname,date,password,fiscalC,city,prov,via,civic,cap,phone)
            SignUpFunction({navigation}, userBit, email, name, surname, date, password, fiscalC, city, prov, via, civic, cap, phone, null, null);
        }
        else {
            Alert.alert(
                "Password doesn't match",
                " ",
            );
        }
    }
    function preSignUpD(pasCheck,userBit,email,name,surname,password,phone,medField,spec) {
        if (pasCheck)
            SignUpFunction({navigation},userBit,email,name,surname,null,password,null,null,null,null,null,null,phone,medField,spec);
        else {
            Alert.alert(
                "Password doesn't match",
                " ",
            );
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.upperView}>
                <Image source={logo} style={styles.logoImage}/>
            </View>
            <View style = {{justifyContent:'center'}}>
                <Text style = {styles.logo}>WHAT TYPE OF USER ARE YOU?</Text>
            </View>
            <TouchableOpacity style = {styles.loginBtn}
                              onPress = {() => setModalUser(!modalUser)}>
                <Text style = {styles.loginText}>Normal User</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.loginBtn}
                              onPress = {() => setModalDoctor(!modalDoctor)}>
                <Text style = {styles.loginText}>Private Doctor</Text>
            </TouchableOpacity>
            <Modal animationType="slide"
                   transparent={true}
                   visible={modalUser}>
                <SafeAreaView style={styles.containerModal}>
                    <LinearGradient
                        // Background Linear Gradient
                        colors={['rgba(0,1,1,0.6)', 'transparent']}
                        style={styles.background}
                    />
                    <View style={{marginTop:20}}>
                        <Text style = {styles.logoReg}>Register Now</Text>
                    </View>
                    <ScrollView style={{width:"80%",borderRadius:25}}>
                        <View style = {styles.inputView}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'e-mail*'
                                onChangeText = { text => setEmail(text) }
                            />
                        </View>
                        <View style = {styles.inputView}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Name*'
                                onChangeText = { text => setName(text) }
                            />
                        </View>
                        <View style = {styles.inputView}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Surname*'
                                onChangeText = { text => setSurname(text) }
                            />
                        </View>
                        <View style = {styles.inputView}>
                            <Text onPress={showDatepicker} style = {styles.dateText}>{dateText}</Text>
                            {show && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode={mode}
                                    display="default"
                                    onChange={onChange}
                                />
                            )}
                        </View>
                        <View style = {styles.inputView}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Telephone'
                                onChangeText = { text => setPhone(text) }
                            />
                        </View>
                        <View style = {styles.inputView}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'City*'
                                onChangeText = { text => setCity(text) }
                            />
                        </View>
                        <View style = {styles.inputView}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Region/Province*'
                                onChangeText = { text => setProv(text) }
                            />
                        </View>
                        <View style = {styles.inputViewMod}>
                            <View style = {styles.inputViewMod1}>
                                <TextInput
                                    style = {styles.inputText}
                                    placeholder = 'Via*'
                                    onChangeText = { text => setVia(text) }
                                />
                            </View>
                            <View style = {styles.inputViewMod2}>
                                <TextInput
                                    style = {styles.inputText}
                                    placeholder = 'Civic*'
                                    onChangeText = { text => setCivic(text) }
                                />
                            </View>
                        </View>
                        <View style = {styles.inputView}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'CAP*'
                                onChangeText = { text => setCap(text) }
                            />
                        </View>
                        <View style = {styles.inputView}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Fiscal Code*'
                                onChangeText = { text => setCF(text) }
                            />
                        </View>
                        <View style = {styles.inputView}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Password*'
                                secureTextEntry
                                onChangeText = { text => setPassword(text) }
                            />
                        </View>
                        <View style = {styles.inputView}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Verify Password'
                                secureTextEntry
                                onChangeText = { text => pasOk(text,password)}
                            />
                        </View>
                    </ScrollView>
                    <TouchableOpacity style = {styles.signupBtn}
                                      onPress = {()=> preSignUp(pasCheck,user,email,name,surname,date.toDateString(),password,fiscalC,city,prov,via,civic,cap,phone)}>
                        <Text style = {styles.loginText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> setModalUser(!modalUser)}
                    style={{marginBottom:"15%"}}>
                        <Text style={{fontWeight:'bold',color:'#fb5b5a',fontSize:18}}>Go Back</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
            <Modal animationType="slide"
                   transparent={true}
                   visible={modalDoctor}>
                <SafeAreaView style={styles.containerModal}>
                    <LinearGradient
                        // Background Linear Gradient
                        colors={['rgba(0,1,1,0.6)', 'transparent']}
                        style={styles.background}
                    />
                    <View style={{marginTop:20}}>
                        <Text style = {styles.logoReg}>Register Now</Text>
                    </View>
                    <ScrollView style={{width:"80%"}}>
                        <View style = {styles.inputViewD}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'e-mail*'
                                onChangeText = { text => setEmailD(text) }
                            />
                        </View>
                        <View style = {styles.inputViewD}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Name*'
                                onChangeText = { text => setNameD(text) }
                            />
                        </View>
                        <View style = {styles.inputViewD}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Surname*'
                                onChangeText = { text => setSurnameD(text) }
                            />
                        </View>
                        <View style = {styles.inputViewD}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Telephone'
                                onChangeText = { text => setPhoneD(text) }
                            />
                        </View>
                        <View style = {styles.inputViewD}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Medical Field*'
                                onChangeText = { text => setMF(text) }
                            />
                        </View>
                        <View style = {styles.inputViewD}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Specialization'
                                onChangeText = { text => setSpec(text) }
                            />
                        </View>
                        <View style = {styles.inputViewD}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Password*'
                                secureTextEntry
                                onChangeText = { text => setPasswordD(text)}
                            />
                        </View>
                        <View style = {styles.inputViewD}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Verify Password'
                                secureTextEntry
                                onChangeText = { text => pasOk(text,passwordD)}
                            />
                        </View>
                    </ScrollView>
                    <TouchableOpacity style = {styles.loginBtn}
                                      onPress = {()=> preSignUpD(pasCheck,doctor,emailD,nameD,surnameD,passwordD,phoneD,medField,spec)}>
                        <Text style = {styles.loginText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> setModalDoctor(!modalDoctor)}
                                      style={{marginBottom:"15%"}}>
                        <Text style={{fontWeight:'bold',color:'#fb5b5a',fontSize:18}}>Go Back</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create ({
    container : {
        flex: 1,
        backgroundColor: '#4c669f',
        //justifyContent: 'center',
        alignItems: 'center'
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 500,
        borderRadius:35
    },
    containerModal : {
        flex: 1,
        backgroundColor: '#4c669f',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:35,
        elevation:5
    },
    upperView: {
        backgroundColor:'#fffff0',
        //height:430,
        height: "50%",
        width:"100%",
        borderBottomStartRadius:38,
        borderBottomEndRadius:38,
        alignItems:'center',
        justifyContent:'center',
        marginBottom:"10%",
        elevation: 5
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#fff8dc",
        borderRadius:25,
        height:"6%",
        alignItems:"center",
        justifyContent:"center",
        marginTop:"9%",
        marginBottom:"3%",
        elevation: 4
    },
    signupBtn:{
        width:"60%",
        backgroundColor:"#fff8dc",
        borderRadius:25,
        height:"6%",
        alignItems:"center",
        justifyContent:"center",
        marginTop:"9%",
        marginBottom:"3%",
        elevation: 4
    },
    logo:{
        fontWeight:"bold",
        fontSize:26,
        color:"#fb5b5a",
        marginBottom:"10%",
        justifyContent: "center",
    },
    logoReg:{
        fontWeight:"bold",
        fontSize:46,
        color:"#fb5b5a",
        marginBottom:"10%",
        justifyContent: "center",
    },
    loginText:{
        color:"#4c669f",
        fontWeight: "bold"
    },
    logoImage: {
        width: 150,
        height: 150,
        marginTop: "10%"
        //marginBottom: "15%"
    },
    inputView:{
        width:"100%",
        backgroundColor:"#fffff0",
        borderRadius:25,
        height:"2.9%",
        marginBottom:"9%",
        justifyContent:"center",
        padding:"4.7%",
        //marginLeft:"9.5%",
        elevation: 4
    },
    inputViewD:{
        width:"100%",
        backgroundColor:"#fffff0",
        borderRadius:25,
        height:"5%",
        marginBottom:"9%",
        justifyContent:"center",
        padding:"4.7%",
        //marginLeft:"9.5%",
        elevation: 4
    },
    inputViewMod:{
        height:"2.9%",
        flexDirection: 'row',
        marginBottom:"9%",
    },
    inputViewMod1:{
        width:"77%",
        backgroundColor:"#fffff0",
        borderRadius:25,
        height:"100%",
        marginBottom:"8%",
        justifyContent:"center",
        padding:"4.7%",
        //marginLeft:"9.5%",
        elevation: 4
    },
    inputViewMod2:{
        width:"22%",
        backgroundColor:"#fffff0",
        borderRadius:25,
        height:"100%",
        marginBottom:"6%",
        justifyContent:"center",
        padding:"4.7%",
        marginLeft:"1%",
        elevation: 4
    },
    inputText:{
        height:50,
        color:"black"
    },
    dateText:{
        height:50,
        color:"#778899",
        marginTop: "10%"
    },
})


    /*<View style = {styles.container}>
    <Image source={logo} style={styles.logoImage}/>
<View style = {{justifyContent:'center'}}>
    <Text style = {styles.logo}>What type of User are you?</Text>
</View>
<View style = {styles.loginBtn}>
    <Text style = {styles.loginText} onPress = {() => navigation.push('SignUp')}
    >Normal User</Text>
</View>
<View style = {styles.loginBtn}>
    <Text style = {styles.loginText} onPress = {() => navigation.push('SignUpMO')}
    >Private Doctor</Text>
</View>
</View>

const styles = StyleSheet.create ({
    container : {
        flex: 1,
        backgroundColor: '#fffff0',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#4169e1",
        borderRadius:25,
        height:"6%",
        alignItems:"center",
        justifyContent:"center",
        marginTop:"9%",
        marginBottom:"3%",
        elevation: 4
    },
    logo:{
        fontWeight:"bold",
        fontSize:33,
        color:"#fb5b5a",
        marginBottom:"10%",
        justifyContent: "center"
    },
    loginText:{
        color:"white",
        fontWeight: "bold"
    },
    logoImage: {
        width: "31%",
        height: "16%",
        marginBottom: "10%"
    },
})*/