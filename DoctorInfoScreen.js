import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    AsyncStorage,
    SafeAreaView, TouchableHighlight, Modal
} from 'react-native';
import {Entypo, FontAwesome5, MaterialCommunityIcons} from "@expo/vector-icons";
import {Doctor} from "./Doctor";
import {LinearGradient} from "expo-linear-gradient";

export function DoctorInfoScreen({navigation}) {

    const [refresh,setRefresh]=useState(true);
    const [filteredDataSource,setFilteredDataSource] = useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [password, setPassword] = useState(null);
    const [pasCheck, setPC] = useState(false);
    const [medField, setMF] = useState(null);
    const [spec, setSpec] = useState(null);

    function pasOk (text,passwd) {
        console.log(pasCheck);
        if(text === passwd) {
            setPC(true);
        } else {setPC(false);}
    }

    function deleteAlert(user) {
        Alert.alert(
            'Are you sure you want to delete your account?',
            ' ',
            [
                { text: "Yes", onPress: user.deleteAccount() },
                { text: "No"}
            ],
            { cancelable: false }
        );
    }

    function createButtonAlert() {
        Alert.alert(
            'Edit!',
            ' ',
            [
                { text: "OK", onPress: setRefresh(true)}
            ],
            { cancelable: false }
        );
    }

    function createButtonAlert1() {
        Alert.alert(
            'Error!',
            ' ',
            [
                { text: "Try Again"}
            ],
            { cancelable: false }
        );
    }

    const edit = async(key) => {
        try{
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                fetch('http://medbay.altervista.org/editProfileM.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: value,
                        new_email: email,
                        new_phone: phone,
                        new_medField: medField,
                        new_spec: spec
                    })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        switch(responseJson) {
                            case 0: {
                                createButtonAlert();
                                break;
                            }
                            case 1: {
                                Alert.alert('Email already used!');
                                break;
                            }
                            case 2: {
                                createButtonAlert1();
                            }
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    }).finally(() => setModalVisible(!modalVisible))
            }
        } catch (error) {}
    };

    const run = async(key) => {
        try{
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                fetch('http://medbay.altervista.org/DoctorProfiling/profiloM.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: value
                    })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        //if (responseJson !== null) {
                        //console.log(responseJson)
                        setFilteredDataSource(responseJson);
                        //}
                    })
                    .catch((error) => {
                        console.error(error);
                    }).finally(()=> setRefresh(false))
            }
        } catch (error) {}
    };

    function createDoctor() {
        const doctor = new Doctor();
        doctor.setName(filteredDataSource['name']);
        doctor.setEmail(filteredDataSource['email']);
        doctor.setSurname(filteredDataSource['surname']);
        doctor.setPhone(filteredDataSource['tel']);
        doctor.setMedField(filteredDataSource['campoMedico']);
        doctor.setSpecialization(filteredDataSource['specializzazione'])
        return doctor;
    }

    if(refresh){
        run('userToken')
        return(
            <View style={styles.containerLoad}>
                <ActivityIndicator
                    size="large"
                    color="#fb5b5a"
                />
            </View>
        )
    }
    else {
        const tempDoc = createDoctor();
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.upperView}>
                    <LinearGradient
                        // Background Linear Gradient
                        colors={['rgba(0,1,1,0.6)', 'transparent']}
                        style={styles.background}
                    />
                    <Text style={{marginBottom:"20%",marginRight:"40%",fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>YOUR MEDBAY</Text>
                    <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between'}}>
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <MaterialCommunityIcons
                                name="menu"
                                size={38}
                                color="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => setModalVisible(!modalVisible)}>
                            <FontAwesome5 name="user-edit" size={26} color="#fb5b5a"
                                          style={{marginTop:5}}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.infoView}>
                    <LinearGradient
                        // Background Linear Gradient
                        colors={['rgba(0,1,1,0.6)', 'transparent']}
                        style={styles.background1}
                    />
                    <Text style={styles.logo}>{tempDoc.name}</Text>
                    <Text style={styles.logo}>{tempDoc.surname}</Text>
                    <ScrollView>
                        <View style={styles.loginBtn}>
                            <Text style={styles.infoFont}>E-mail: {tempDoc.email}</Text>
                        </View>
                        <View style={styles.loginBtn}>
                            <Text style={styles.infoFont}>Medical Field: {tempDoc.medField}</Text>
                        </View>
                        <View style={styles.loginBtn}>
                            <Text style={styles.infoFont}>Specialization: {tempDoc.specialization}</Text>
                        </View>
                        <View style={styles.loginBtn}>
                            <Text style={styles.infoFont}>Phone Number: {tempDoc.phone}</Text>
                        </View>
                        <TouchableOpacity style={styles.loginBtn}
                                          onPress={()=> deleteAlert(tempDoc)}>
                            <Text style={styles.infoFont}>Delete Account</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}>
                    <SafeAreaView style={{backgroundColor:'#4c669f',height:"73.5%",width:"90%",marginTop:"48.5%",borderTopRightRadius:30,borderBottomRightRadius:30,elevation:4}}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background1}
                        />
                        <View style={{marginTop:40,marginLeft:"2%",marginBottom:"2%"}}>
                            <Text style = {styles.logo}>Edit Your Profile</Text>
                        </View>
                        <ScrollView>
                            <View style = {styles.loginBtn}>
                                <TextInput
                                    style = {styles.inputText}
                                    placeholder = 'E-mail'
                                    onChangeText = { text => setEmail(text) }
                                />
                            </View>
                            <View style = {styles.loginBtn}>
                                <TextInput
                                    style = {styles.inputText}
                                    placeholder = 'Telephone'
                                    onChangeText = { text => setPhone(text) }
                                />
                            </View>
                            <View style = {styles.loginBtn}>
                                <TextInput
                                    style = {styles.inputText}
                                    placeholder = 'Medical Field'
                                    onChangeText = { text => setMF(text) }
                                />
                            </View>
                            <View style = {styles.loginBtn}>
                                <TextInput
                                    style = {styles.inputText}
                                    placeholder = 'Specialization'
                                    onChangeText = { text => setSpec(text) }
                                />
                            </View>
                            <View style = {styles.loginBtn}>
                                <TextInput
                                    style = {styles.inputText}
                                    placeholder = 'Password'
                                    secureTextEntry
                                    onChangeText = { text => setPassword(text) }
                                />
                            </View>
                            <View style = {styles.loginBtn}>
                                <TextInput
                                    style = {styles.inputText}
                                    placeholder = 'Verify Password'
                                    secureTextEntry
                                    onChangeText = { text => pasOk(text,password)}
                                />
                            </View>
                        </ScrollView>
                        <View style={styles.editView}>
                            <TouchableOpacity style={styles.inputView1}
                                              onPress={() => {
                                                  edit('userToken');
                                              }}>
                                <TouchableHighlight
                                    style={{alignItems:'center',justifyContent:'center'}}>
                                    <Text style={{fontWeight:'bold',fontSize:15,color:'#fffff0'}}>Edit</Text>
                                </TouchableHighlight>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginBottom:"2%",marginLeft:"3%"}}
                                              onPress={() => setModalVisible(!modalVisible)}>
                                <Entypo name="circle-with-cross" size={30} color="#f5fffa" />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Modal>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fffff0',
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    editView: {
        flexDirection:'row',
        alignItems:'center',
        width:"95%",
        height:"2%",
        marginBottom:"8%",
        justifyContent:"space-between",
        marginTop:"6%",
        elevation:5
    },
    upperView: {
        backgroundColor:'#4c669f',
        //height:430,
        height: "22%",
        width:"100%",
        borderBottomStartRadius:40,
        borderBottomEndRadius:40,
        alignItems:'center',
        justifyContent:'flex-end',
        marginBottom:"10%",
        elevation: 5
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 110,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        //borderRadius:35
    },
    background1: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 350,
        borderTopRightRadius: 25,
        //borderRadius:35
    },
    infoView: {
        backgroundColor:'#4c669f',
        width:"90%",
        height:"70%",
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        elevation:5
    },
    containerLoad: {
        flex: 1,
        //marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginBtn:{
        width:"90%",
        backgroundColor:"#f5fffa",
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        height:50,
        justifyContent:"center",
        marginTop:"8%",
        marginBottom:"3%",
        padding:"2%",
        elevation:5
    },
    modButton: {
        marginTop:"5%",
        marginLeft:"80%"
    },
    logoImage: {
        resizeMode:'contain',
        height:"80%",
        marginLeft: "170%",
        borderWidth:1
    },
    logo:{
        fontWeight:"bold",
        fontSize:40,
        color:"#fb5b5a",
        marginTop:"2%",
        marginBottom:"2%",
        marginLeft:"4%"
    },
    logo1:{
        fontWeight:"bold",
        fontSize:50,
        color:"#800000",
        marginBottom:"2%",
    },
    infoFont:{
        fontWeight:"bold",
        fontSize:17,
        color:"black",
        marginLeft:"3%"
    },
    scrollView:{
        flex:0.8
    },
    inputText:{
        height:50,
        color:"black"
    },
    loginText:{
        color:"#00008b",
        fontWeight: "bold"
    },
    drawBtn:{
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        alignItems: 'center',
        justifyContent: 'center',
        width: "11%",
        height:"45%",
        marginTop:"5%",
    },
    searchView: {
        width: "100%",
        height: "10%",
        flexDirection: 'row',
        flex:0.15,
    },
    inputView:{
        width:"80%",
        backgroundColor:"#fffff0",
        borderRadius:25,
        height:"3%",
        marginBottom:"9%",
        justifyContent:"center",
        padding:"4.7%",
        marginLeft:"9.5%",
        elevation:5
    },
    inputView1:{
        width:"30%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:"100%",
        marginBottom:"9%",
        justifyContent:"center",
        padding:"4.7%",
        marginLeft:"2.5%",
        marginTop:"5%"
    },
    inputViewMod:{
        width:"90%",
        height:50,
        //justifyContent:"center",
        marginTop:"8%",
        marginBottom:"3%",
        //padding:"2%",
        flexDirection: 'row'
        //elevation:5
    },
    inputViewMod1:{
        width:"75%",
        backgroundColor:"#f5fffa",
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        height:"100%",
        justifyContent:"center",
        padding:"2%"
        //elevation:5
    },
    inputViewMod2:{
        width:"20%",
        backgroundColor:"#f5fffa",
        borderRadius: 30,
        height:"100%",
        justifyContent:"center",
        padding:"5%",
        marginLeft:"4%"
    },
});