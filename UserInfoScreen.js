import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    Picker,
    TouchableOpacity,
    Alert,
    Image,
    ActivityIndicator,
    AsyncStorage,
    SafeAreaView, TouchableHighlight, Modal
} from 'react-native';
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import logo from './assets/logo.png';
import {getData} from "./StorageFunctions";
import {User} from "./User";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useIsFocused} from "@react-navigation/native";
import {LinearGradient} from "expo-linear-gradient";
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export function UserInfoScreen({navigation}) {

    const [refresh,setRefresh]=useState(true);
    const [filteredDataSource,setFilteredDataSource] = useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [password, setPassword] = useState(null);
    const [pasCheck, setPC] = useState(false);
    const [city, setCity] = useState(null);
    const [prov, setProv] = useState(null);
    const [via, setVia] = useState(null);
    const [civic, setCivic] = useState(null);
    const [cap, setCap] = useState(null);
    const isFocused = useIsFocused();

    function pasOk (text,passwd) {
        if(text === passwd)
            setPC(true);
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
                { text: "OK", onPress: setRefresh(true) }
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
                fetch('http://medbay.altervista.org/editProfileP.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: value,
                        new_email: email,
                        new_phone: phone,
                        new_city: city,
                        new_via: via,
                        new_prov: prov,
                        new_civic:civic,
                        new_cap:cap
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
                fetch('http://medbay.altervista.org/UserProfiling/profiloP.php', {
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

    function createUser() {
        const user = new User();
        user.setName(filteredDataSource['name']);
        user.setEmail(filteredDataSource['email']);
        user.setSurname(filteredDataSource['surname']);
        user.setBd(filteredDataSource['birth']);
        user.setCity(filteredDataSource['city']);
        user.setProv(filteredDataSource['prov']);
        user.setAdd(filteredDataSource['via']);
        user.setFc(filteredDataSource['fc']);
        user.setPn(filteredDataSource['phone']);
        user.setCap(filteredDataSource['cap']);
        user.setCivic(filteredDataSource['civic'])
        return user;
    }

    React.useEffect(() => {
        setRefresh(true)
    }, [isFocused]);


    if(refresh){
        run('userToken')
        return(
            <View style={styles.containerLoad}
            >
                <ActivityIndicator
                    size="large"
                    color="#fb5b5a"
                />
            </View>
        )
    }
    else {
        const tempUser = createUser();
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
                        <TouchableOpacity onPress={ () => setModalVisible(true)}>
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
                    <Text style={styles.logo}>{tempUser.name}</Text>
                    <Text style={styles.logo}>{tempUser.surname}</Text>
                    <ScrollView>
                        <View style={styles.loginBtn}>
                            <Text style={styles.infoFont}>E-mail: {tempUser.email}</Text>
                        </View>
                        <View style={styles.loginBtn}>
                            <Text style={styles.infoFont}>Birth Date: {tempUser.birthDate}</Text>
                        </View>
                        <View style={styles.loginBtn}>
                            <Text style={styles.infoFont}>Address: {tempUser.address}  N°{tempUser.civic}</Text>
                        </View>
                        <View style={styles.loginBtn}>
                            <Text style={styles.infoFont}>City: {tempUser.city}</Text>
                        </View>
                        <View style={styles.loginBtn}>
                            <Text style={styles.infoFont}>Fiscal Code: {tempUser.fiscalCode}</Text>
                        </View>
                        <TouchableOpacity style={styles.loginBtn}
                                          onPress={()=> deleteAlert(tempUser)}>
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
                                    placeholder = 'City'
                                    onChangeText = { text => setCity(text) }
                                />
                            </View>
                            <View style = {styles.loginBtn}>
                                <TextInput
                                    style = {styles.inputText}
                                    placeholder = 'Region/Province'
                                    onChangeText = { text => setProv(text) }
                                />
                            </View>
                            <View style = {styles.inputViewMod}>
                                <View style = {styles.inputViewMod1}>
                                    <TextInput
                                        style = {styles.inputText}
                                        placeholder = 'Via'
                                        onChangeText = { text => setVia(text) }
                                    />
                                </View>
                                <View style = {styles.inputViewMod2}>
                                    <TextInput
                                        style = {styles.inputText}
                                        placeholder = 'Civic'
                                        onChangeText = { text => setCivic(text) }
                                    />
                                </View>
                            </View>
                            <View style = {styles.loginBtn}>
                                <TextInput
                                    style = {styles.inputText}
                                    placeholder = 'CAP'
                                    onChangeText = { text => setCap(text) }
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
        padding:"2%",
        elevation:5
    },
    inputViewMod2:{
        width:"20%",
        backgroundColor:"#f5fffa",
        borderRadius: 30,
        height:"100%",
        justifyContent:"center",
        padding:"5%",
        marginLeft:"4%",
        elevation:5
    },
    containerLoad: {
        flex: 1,
        //marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

/*<View style={{height:"90%"}}>
    <View style={styles.searchView}>
        <View style={styles.drawBtn}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <MaterialCommunityIcons
                    name="menu"
                    size={35}
                    color="white"
                />
            </TouchableOpacity>
        </View>
        <View style={{width: "50%", alignItems: 'center'}}>
            <Image source={logo} style={styles.logoImage}/>
        </View>
    </View>
    <ScrollView style={styles.scrollView}>
        <Text style={styles.logo}>{tempUser.name}</Text>
        <Text style={styles.logo}>{tempUser.surname}</Text>
        <View>
            <View style={styles.loginBtn}>
                <Text style={styles.infoFont}>Birth Date: {tempUser.birthDate}</Text>
            </View>
            <View style={styles.loginBtn}>
                <Text style={styles.infoFont}>Address: {tempUser.address}  N°{tempUser.civic}</Text>
            </View>
            <View style={styles.loginBtn}>
                <Text style={styles.infoFont}>City: {tempUser.city}</Text>
            </View>
            <View style={styles.loginBtn}>
                <Text style={styles.infoFont}>Fiscal Code: {tempUser.fiscalCode}</Text>
            </View>
            <TouchableOpacity style={styles.loginBtn}
                              onPress={()=> deleteAlert(tempUser)}>
                <Text style={styles.infoFont}>Delete Account</Text>
            </TouchableOpacity>
            <View style={styles.modButton}>
                <Text style={{textDecorationLine: "underline"}}
                      onPress={ () => setModalVisible(true)}
                >Edit</Text>
            </View>
        </View>
    </ScrollView>
</View>
<Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}>
    <SafeAreaView style={{backgroundColor:'#5f9ea0',borderRadius:45,flex:0.9,marginHorizontal:10,marginTop:"5%"}}>
        <View style={{marginTop:40,marginLeft:"2%",marginBottom:"2%"}}>
            <Text style = {styles.logo1}>Edit Your Profile</Text>
        </View>
        <ScrollView>
            <View style = {styles.inputView}>
                <TextInput
                    style = {styles.inputText}
                    placeholder = 'E-mail'
                    onChangeText = { text => setEmail(text) }
                />
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
                    placeholder = 'City'
                    onChangeText = { text => setCity(text) }
                />
            </View>
            <View style = {styles.inputView}>
                <TextInput
                    style = {styles.inputText}
                    placeholder = 'Region/Province'
                    onChangeText = { text => setProv(text) }
                />
            </View>
            <View style = {styles.inputViewMod}>
                <View style = {styles.inputViewMod1}>
                    <TextInput
                        style = {styles.inputText}
                        placeholder = 'Via'
                        onChangeText = { text => setVia(text) }
                    />
                </View>
                <View style = {styles.inputViewMod2}>
                    <TextInput
                        style = {styles.inputText}
                        placeholder = 'Civic'
                        onChangeText = { text => setCivic(text) }
                    />
                </View>
            </View>
            <View style = {styles.inputView}>
                <TextInput
                    style = {styles.inputText}
                    placeholder = 'CAP'
                    onChangeText = { text => setCap(text) }
                />
            </View>
            <View style = {styles.inputView}>
                <TextInput
                    style = {styles.inputText}
                    placeholder = 'Password'
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
            <View style={styles.inputView1}>
                <TouchableHighlight
                    onPress={() => {
                        edit('userToken');
                    }}
                    style={{alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontWeight:'bold',fontSize:15,color:'#fffff0'}}>Edit</Text>
                </TouchableHighlight>
            </View>
        </ScrollView>
    </SafeAreaView>
</Modal>
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        justifyContent: 'center',
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
        fontSize:50,
        color:"#fb5b5a",
        marginBottom:"2%",
    },
    logo1:{
        fontWeight:"bold",
        fontSize:50,
        color:"#800000",
        marginBottom:"2%",
    },
    infoFont:{
        fontWeight:"bold",
        fontSize:20,
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
    loginBtn:{
        width:"95%",
        backgroundColor:"#5f9ea0",
        borderRadius:25,
        height:50,
        justifyContent:"center",
        marginTop:"10%",
        marginBottom:"3%",
        padding:"2%",
        elevation:5
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
    },
    inputView1:{
        width:"30%",
        backgroundColor:"#800000",
        borderRadius:25,
        height:"2%",
        marginBottom:"9%",
        justifyContent:"center",
        padding:"4.7%",
        marginLeft:"9.5%"
    },
    inputViewMod:{
        height:"2%",
        flexDirection: 'row',
        marginBottom:"12%",
    },
    inputViewMod1:{
        width:"60%",
        backgroundColor:"#fffff0",
        borderRadius:25,
        height:"2%",
        marginBottom:"8%",
        justifyContent:"center",
        padding:"4.7%",
        marginLeft:"9.5%",
    },
    inputViewMod2:{
        width:"19%",
        backgroundColor:"#fffff0",
        borderRadius:25,
        height:"2%",
        marginBottom:"6%",
        justifyContent:"center",
        padding:"4.7%",
        marginLeft:"1%",
    },
});*/
