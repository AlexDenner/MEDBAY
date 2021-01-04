import React,{useState,useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    AsyncStorage,
    ScrollView,
    ActivityIndicator,
    SafeAreaView,
    TextInput, TouchableHighlight, Modal, Picker, Image, Alert
} from 'react-native';
import {QRCode} from 'react-native-custom-qr-codes-expo';
import {Prenotation} from "./Prenotation";
import DateTimePicker from "@react-native-community/datetimepicker";
import {FontAwesome5, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import {LinearGradient} from "expo-linear-gradient";
import { Feather } from '@expo/vector-icons';
import {useIsFocused} from "@react-navigation/native";

export function PrenotationInfoScreen({navigation,route}) {
    //const {idPren} = route.params
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [cf, setCf] = useState([]);
    const [office, setOffice] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalVisible1, setModalVisible1] = React.useState(false);
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [notes, setNotes] = useState(null);
    const [dateText,setDT] = useState('Choose Date');
    const [image, setImage] = React.useState(null);
    const isFocused = useIsFocused();
    let [selectedValue, setSelectedValue] = React.useState('8:30');
    const {pren} = route.params;

    const pickImage = async () => {
        const { status: cameraRollPerm } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (cameraRollPerm === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                setImage(result.uri);
            }
        }
    };

    const takePhoto = async () => {
        const {
            status: cameraPerm
        } = await Permissions.askAsync(Permissions.CAMERA);

        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        //const { cameraPerm } = await ImagePicker.requestCameraPermissionsAsync();
        //const { cameraRollPerm } = await ImagePicker.requestCameraRollPermissionsAsync();
        // only if user allows permission to camera AND camera roll
        if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });

            if (!pickerResult.cancelled) {
                setImage(pickerResult.uri);
            }
        }
    };

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

    function editRes() {
        const prenotation = new Prenotation(pren.idV,dateText,selectedValue,pren.emailPaziente,pren.emailMedico,pren.telefonoStudio,pren.idPrestazione,notes);
        prenotation.editRes(image);
        setRefresh(true);
    };
    function deleteRes() {
        const prenotation = new Prenotation(pren.idV,pren.id,pren.time,pren.emailPaziente,pren.emailMedico,pren.telefonoStudio,pren.idPrestazione,notes);
        prenotation.deleteRes();
        navigation.navigate('Home');
    };

    function getDoctorData() {
        fetch('http://medbay.altervista.org/DoctorProfiling/profiloM.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: pren.emailMedico
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                setFilteredDataSource(responseJson);
            })
            .catch((error) => {
                console.error(error);
            })

        fetch('http://medbay.altervista.org/Booking/getCF.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_email: pren.emailPaziente
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                setCf(responseJson);
            })
            .catch((error) => {
                console.error(error);
            })

        fetch('http://medbay.altervista.org/OfficeManagement/searchStudioAssoc.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: pren.emailMedico
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson) {
                    setOffice(responseJson);
                }
            })
            .catch((error) => {
                console.error(error);
            }).finally(() => setRefresh(false))
    }

    useEffect(() => {
        setRefresh(true);
    }, [isFocused]);

    if(refresh){
        getDoctorData();
        return(
            <View style={styles.containerLoad}>
                <ActivityIndicator
                    size="large"
                    color="#fb5b5a"
                />
            </View>
        )
    } else {
        if (pren.accettata == 0) {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.upperView}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background}
                        />
                        <Text style={{marginBottom:"2%",marginRight:"10%",fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>QR & RESERVATION INFO:</Text>
                        <View style={{flexDirection: 'row',marginBottom:"10%",width:"100%",marginLeft: "6%",alignItems:'center'}}>
                            <FontAwesome5 name="calendar-minus" size={28} color="#ffd700" />
                            <Text style={{fontWeight:'bold',color:'white',fontSize:17,marginLeft:"2%"}}>Status: </Text>
                            <Text style={{fontWeight:'bold',color:'#ffd700',fontSize:17}}>Pending</Text>
                        </View>
                        <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between',alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                <MaterialCommunityIcons
                                    name="menu"
                                    size={38}
                                    color="white"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(true)}
                                              style={styles.upperMenu}>
                                <Feather name="edit-2" size={26} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteRes()}
                                              style={styles.upperMenu}>
                                <MaterialIcons name="delete" size={27} color="#fb5b5a" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.qrcode}>
                        <QRCode content={pren.idV}/>
                    </View>
                    <View style={styles.infoView}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background2}
                        />
                        <ScrollView>
                            <View style={styles.loginBtn}>
                                <Text style={styles.dateText}>Date: {pren.date}</Text>
                            </View>
                            <View style={styles.loginBtn}>
                                <Text style = {styles.dateText}>Time: {pren.time}</Text>
                            </View>
                            <View style={styles.loginBtn}>
                                <Text style = {styles.dateText}>Fiscal Code: {cf['fc']}</Text>
                            </View>
                            <View style={styles.loginBtn}>
                                <Text style = {styles.dateText}>Doctor E-mail: {pren.emailMedico}</Text>
                            </View>
                            <View style={styles.loginBtn}>
                                <Text style = {styles.dateText}>Address: {office[0].via} N°{office[0].civic}</Text>
                            </View>
                            <View style={styles.loginBtn}>
                                <Text style = {styles.dateText}>City: {office[0].city} ({office[0].prov})</Text>
                            </View>
                            <View style={styles.loginBtn}>
                                <Text style = {styles.dateText}>Service: {pren.name}             Costo: {pren.costo}€</Text>
                            </View>
                            <View style={styles.loginBtn}>
                                <Text style = {styles.dateText}>Notes: {pren.note}</Text>
                            </View>
                            <TouchableOpacity style={styles.loginBtn}
                                              onPress={()=>navigation.navigate('Recipe',{image : pren.link})}>
                                <Text style = {styles.dateText}>Recipe</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}>
                        <SafeAreaView style={{backgroundColor:'#f5fffa',borderRadius:45,flex:0.7,elevation: 6,marginHorizontal:10,marginTop:"5%"}}>
                            <View style={{marginTop:40,marginLeft:"2%",marginBottom:"2%"}}>
                                <Text style = {styles.logo1}>Edit Your Reservation</Text>
                            </View>
                            <ScrollView>
                                <View style = {styles.editBtn}>
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
                                <View style={styles.editBtn}>
                                    <Picker
                                        style = {styles.picker}
                                        selectedValue= {selectedValue}
                                        onValueChange={(itemValue) => setSelectedValue(itemValue)}
                                    >
                                        <Picker.Item label="8:30" value='8:30' color='#000'/>
                                        <Picker.Item label="9:30" value='9:30' color='#000'/>
                                        <Picker.Item label="10:30" value='10:30' color='#000'/>
                                        <Picker.Item label="11:30" value='11:30' color='#000'/>
                                        <Picker.Item label="15:30" value='15:30' color='#000'/>
                                        <Picker.Item label="16:30" value='16:30' color='#000'/>
                                        <Picker.Item label="17:30" value='17:30' color='#000'/>
                                        <Picker.Item label="18:30" value='18:30' color='#000'/>
                                    </Picker>
                                </View>
                                <View style = {styles.editBtn}>
                                    <TextInput
                                        style = {styles.inputText}
                                        placeholder = 'Notes'
                                        secureTextEntry
                                        onChangeText = { text => setNotes(text) }
                                    />
                                </View>
                                <TouchableOpacity style = {styles.editBtn}
                                                  onPress={()=> setModalVisible1(!modalVisible1)}>
                                    <Text style={styles.inputText}>Insert Recipe</Text>
                                </TouchableOpacity>
                                <View style={styles.inputView1}>
                                    <TouchableHighlight
                                        onPress={() => {
                                            editRes();
                                        }}
                                        style={styles.editBtn1}>
                                        <Text style={{fontWeight:'bold',fontSize:30,color:'#f5fffa'}}>Edit</Text>
                                    </TouchableHighlight>
                                </View>
                            </ScrollView>
                        </SafeAreaView>
                        <TouchableOpacity onPress={()=> { setModalVisible(!modalVisible)}}
                                          style={{width:"100%",flex:0.3}}></TouchableOpacity>
                    </Modal>
                    <Modal animationType="fade"
                           transparent={true}
                           visible={modalVisible1}>
                        <SafeAreaView style={styles.container1}>
                            <LinearGradient
                                // Background Linear Gradient
                                colors={['rgba(0,1,1,0.6)', 'transparent']}
                                style={styles.background}
                            />
                            <MaterialIcons name="add-a-photo" size={45} color="#f5fffa" />
                            <TouchableOpacity onPress={pickImage}
                                              style={styles.button}>
                                <Text style={styles.infoText}>Pick an image from camera roll</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={takePhoto}
                                              style={styles.button}>
                                <Text style={styles.infoText}>Pick an image from camera</Text>
                            </TouchableOpacity>
                            {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 ,borderRadius:25}} />}
                        </SafeAreaView>
                        <TouchableOpacity onPress={()=> { setModalVisible1(!modalVisible1)}}
                                          style={{width:"100%",height:"50%"}}></TouchableOpacity>
                    </Modal>
                </SafeAreaView>
            );
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.upperView}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background}
                        />
                        <Text style={{marginBottom:"2%",marginRight:"10%",fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>QR & RESERVATION INFO:</Text>
                        <View style={{flexDirection: 'row',marginBottom:"10%",width:"100%",marginLeft: "6%",alignItems:'center'}}>
                            <FontAwesome5 name="calendar-check" size={28} color="#90ee90" />
                            <Text style={{fontWeight:'bold',color:'white',fontSize:17,marginLeft: "2%"}}>Status: </Text>
                            <Text style={{fontWeight:'bold',color:'#90ee90',fontSize:17}}>Accepted</Text>
                        </View>
                        <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between',alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                <MaterialCommunityIcons
                                    name="menu"
                                    size={38}
                                    color="white"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(true)}
                                              style={styles.upperMenu}>
                                <Feather name="edit-2" size={26} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteRes()}
                                              style={styles.upperMenu}>
                                <MaterialIcons name="delete" size={27} color="#fb5b5a" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.qrcode}>
                        <QRCode content={pren.idV}/>
                    </View>
                    <View style={styles.infoView}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background2}
                        />
                        <ScrollView>
                            <View style={styles.loginBtn}>
                                <Text style={styles.dateText}>Date: {pren.date}</Text>
                            </View>
                            <View style={styles.loginBtn}>
                                <Text style = {styles.dateText}>Time: {pren.time}</Text>
                            </View>
                            <View style={styles.loginBtn}>
                                <Text style = {styles.dateText}>Fiscal Code: {cf['fc']}</Text>
                            </View>
                            <View style={styles.loginBtn}>
                                <Text style = {styles.dateText}>Doctor E-mail: {pren.emailMedico}</Text>
                            </View>
                            <View style={styles.loginBtn}>
                                <Text style = {styles.dateText}>Address: {office[0].via} N°{office[0].civic}</Text>
                            </View>
                            <View style={styles.loginBtn}>
                                <Text style = {styles.dateText}>City: {office[0].city} ({office[0].prov})</Text>
                            </View>
                            <View style={styles.loginBtn}>
                                <Text style = {styles.dateText}>Service: {pren.name}             Costo: {pren.costo}€</Text>
                            </View>
                            <View style={styles.loginBtn}>
                                <Text style = {styles.dateText}>Notes: {pren.note}</Text>
                            </View>
                            <TouchableOpacity style={styles.loginBtn}
                                              onPress={()=>navigation.navigate('Recipe',{image : pren.link})}>
                                <Text style = {styles.dateText}>Recipe</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}>
                        <SafeAreaView style={{backgroundColor:'#f5fffa',borderRadius:45,flex:0.7,elevation: 6,marginHorizontal:10,marginTop:"5%"}}>
                            <View style={{marginTop:40,marginLeft:"2%",marginBottom:"2%"}}>
                                <Text style = {styles.logo1}>Edit Your Reservation</Text>
                            </View>
                            <ScrollView>
                                <View style = {styles.editBtn}>
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
                                <View style={styles.editBtn}>
                                    <Picker
                                        style = {styles.picker}
                                        selectedValue= {selectedValue}
                                        onValueChange={(itemValue) => setSelectedValue(itemValue)}
                                    >
                                        <Picker.Item label="8:30" value='8:30' color='#000'/>
                                        <Picker.Item label="9:30" value='9:30' color='#000'/>
                                        <Picker.Item label="10:30" value='10:30' color='#000'/>
                                        <Picker.Item label="11:30" value='11:30' color='#000'/>
                                        <Picker.Item label="15:30" value='15:30' color='#000'/>
                                        <Picker.Item label="16:30" value='16:30' color='#000'/>
                                        <Picker.Item label="17:30" value='17:30' color='#000'/>
                                        <Picker.Item label="18:30" value='18:30' color='#000'/>
                                    </Picker>
                                </View>
                                <View style = {styles.editBtn}>
                                    <TextInput
                                        style = {styles.inputText}
                                        placeholder = 'Notes'
                                        secureTextEntry
                                        onChangeText = { text => setNotes(text) }
                                    />
                                </View>
                                <TouchableOpacity style = {styles.editBtn}
                                                  onPress={()=> setModalVisible1(!modalVisible1)}>
                                    <Text style={styles.inputText}>Insert Recipe</Text>
                                </TouchableOpacity>
                                <View style={styles.inputView1}>
                                    <TouchableHighlight
                                        onPress={() => {
                                            editRes();
                                        }}
                                        style={styles.editBtn1}>
                                        <Text style={{fontWeight:'bold',fontSize:30,color:'#f5fffa'}}>Edit</Text>
                                    </TouchableHighlight>
                                </View>
                            </ScrollView>
                        </SafeAreaView>
                        <TouchableOpacity onPress={()=> { setModalVisible(!modalVisible)}}
                                          style={{width:"100%",flex:0.3}}></TouchableOpacity>
                    </Modal>
                    <Modal animationType="fade"
                           transparent={true}
                           visible={modalVisible1}>
                        <SafeAreaView style={styles.container1}>
                            <LinearGradient
                                // Background Linear Gradient
                                colors={['rgba(0,1,1,0.6)', 'transparent']}
                                style={styles.background}
                            />
                            <MaterialIcons name="add-a-photo" size={45} color="#f5fffa" />
                            <TouchableOpacity onPress={pickImage}
                                              style={styles.button}>
                                <Text style={styles.infoText}>Pick an image from camera roll</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={takePhoto}
                                              style={styles.button}>
                                <Text style={styles.infoText}>Pick an image from camera</Text>
                            </TouchableOpacity>
                            {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 ,borderRadius:25}} />}
                        </SafeAreaView>
                        <TouchableOpacity onPress={()=> { setModalVisible1(!modalVisible1)}}
                                          style={{width:"100%",height:"50%"}}></TouchableOpacity>
                    </Modal>
                </SafeAreaView>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffff0',
        //alignItems: 'center',
        //justifyContent: 'center'
    },
    containerLoad: {
        flex: 1,
        //marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        justifyContent: 'center'
    },
    upperView: {
        backgroundColor:'#4c669f',
        //height:430,
        height: "22%",
        width:"100%",
        //borderBottomStartRadius:40,
        borderBottomEndRadius:40,
        alignItems:'center',
        justifyContent:'flex-end',
        //marginBottom:"10%",
        elevation:10
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
        height: 50,
        borderTopRightRadius: 45,
        borderTopLeftRadius: 45,
        //borderRadius:35
    },
    background2: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 150,
        borderTopRightRadius: 25,
        //borderTopLeftRadius: 45,
        //borderRadius:35
    },
    upperTxt: {
        fontWeight:'bold',
        fontSize:15,
        color:'white'
    },
    upperMenu: {
        flexDirection:'row'
    },
    qrcode: {
        marginBottom: '3%',
        backgroundColor:'#f5fffa',
        width: "90%",
        height: "28%",
        borderBottomEndRadius: 40,
        elevation: 3,
        alignItems: 'center'
    },
    infoView: {
        backgroundColor: '#4c669f',
        width: "90%",
        height: "46%",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 5
    },
    loginBtn:{
        width:"90%",
        backgroundColor:"#f5fffa",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        height:"4.5%",
        justifyContent:"center",
        marginTop:"3%",
        marginBottom:"2%",
        padding:"2%",
        elevation:5
    },
    dateText:{
        height:50,
        fontWeight:"bold",
        color:"black",
        marginTop: "10%",
    },
    editBtn:{
        width:"90%",
        backgroundColor:"#4c669f",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        height:50,
        padding:"2%",
        justifyContent:"center",
        marginTop:"1%",
        marginBottom:"4%",
        elevation:5,
        //marginLeft:"3%"
    },
    editBtn1:{
        width:"40%",
        backgroundColor:"#fb5b5a",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        height:50,
        padding:"2%",
        justifyContent:"center",
        marginTop:"1%",
        marginBottom:"4%",
        elevation:5,
        alignItems:'center'
        //marginLeft:"3%"
    },
    logo1:{
        fontWeight:"bold",
        fontSize:50,
        color:"#fb5b5a",
        marginBottom:"2%",
    },
    inputText:{
        height:20,
        color:"black",
        fontWeight:'bold'
    },
    container1 : {
        backgroundColor: '#4c669f',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:25,
        opacity: 50,
        width: "90%",
        marginLeft: "5%",
        marginTop:"20%",
        elevation:8
    },
    button : {
        width:"80%",
        backgroundColor:"#b0c4de",
        borderRadius:25,
        height:"15%",
        marginTop:"10%",
        marginBottom:"3%",
        alignItems:'center',
        justifyContent:'center'
    },
    infoText: {
        fontWeight:'bold',
    }
});

/*<View style={{alignItems:'center',justifyContent:'center',marginTop:"15%"}}>
    <Text style = {styles.textStyle}>QR & RESERVATION INFO:</Text>
</View>
<View style={styles.qrcode}>
    <QRCode content={pren.idV}/>
</View>
<ScrollView style={{width:"100%",marginLeft:"5%"}}>
    <View style={styles.loginBtn}>
        <Text style={styles.dateText}>Date: {pren.date}</Text>
    </View>
    <View style={styles.loginBtn}>
        <Text style = {styles.dateText}>Time: {pren.time}</Text>
    </View>
    <View style={styles.loginBtn}>
        <Text style = {styles.dateText}>Fiscal Code: {pren.pFc}</Text>
    </View>
    <View style={styles.loginBtn}>
        <Text style = {styles.dateText}>Doctor E-mail: {pren.emailMedico}</Text>
    </View>
    <View style={styles.loginBtn}>
        <Text style = {styles.dateText}>Address: {office[0].via} N°{office[0].civic}</Text>
    </View>
    <View style={styles.loginBtn}>
        <Text style = {styles.dateText}>City: {office[0].city} ({office[0].prov})</Text>
    </View>
    <View style={styles.loginBtn}>
        <Text style = {styles.dateText}>Service: {pren.name}   {pren.costo}€</Text>
    </View>
    <View style={styles.loginBtn}>
        <Text style = {styles.dateText}>Notes: {pren.note}</Text>
    </View>
    <TouchableOpacity style={styles.loginBtn}
                      onPress={()=>navigation.navigate('Recipe',{image : pren.link})}>
        <Text style = {styles.dateText}>Recipe</Text>
    </TouchableOpacity>
</ScrollView>
<View style={{flexDirection: 'row'}}>
    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>EDIT</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => deleteRes()} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>DELETE</Text>
    </TouchableOpacity>
</View>
<Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}>
    <SafeAreaView style={{backgroundColor:'#5f9ea0',borderRadius:45,flex:0.7,elevation: 6,marginHorizontal:10,marginTop:"5%"}}>
        <View style={{marginTop:40,marginLeft:"2%",marginBottom:"2%"}}>
            <Text style = {styles.logo1}>Edit Your Reservation</Text>
        </View>
        <ScrollView>
            <View style = {styles.editBtn}>
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
            <View style={styles.editBtn}>
                <Picker
                    style = {styles.picker}
                    selectedValue= {selectedValue}
                    onValueChange={(itemValue) => setSelectedValue(itemValue)}
                >
                    <Picker.Item label="8:30" value='8:30' color='#000'/>
                    <Picker.Item label="9:30" value='9:30' color='#000'/>
                    <Picker.Item label="10:30" value='10:30' color='#000'/>
                    <Picker.Item label="11:30" value='11:30' color='#000'/>
                    <Picker.Item label="15:30" value='15:30' color='#000'/>
                    <Picker.Item label="16:30" value='16:30' color='#000'/>
                    <Picker.Item label="17:30" value='17:30' color='#000'/>
                    <Picker.Item label="18:30" value='18:30' color='#000'/>
                </Picker>
            </View>
            <View style = {styles.editBtn}>
                <TextInput
                    style = {styles.inputText}
                    placeholder = 'Notes'
                    secureTextEntry
                    onChangeText = { text => setNotes(text) }
                />
            </View>
            <TouchableOpacity style = {styles.editBtn}
                              onPress={()=> setModalVisible1(!modalVisible1)}>
                <Text style={styles.inputText}>Insert Recipe</Text>
            </TouchableOpacity>
            <View style={styles.inputView1}>
                <TouchableHighlight
                    onPress={() => {
                        editRes();
                    }}
                    style={{marginLeft:'5%',marginTop:'1%'}}>
                    <Text style={{fontWeight:'bold',fontSize:30,color:'#800000'}}>Edit</Text>
                </TouchableHighlight>
            </View>
        </ScrollView>
    </SafeAreaView>
    <TouchableOpacity onPress={()=> { setModalVisible(!modalVisible)}}
                      style={{width:"100%",flex:0.3}}></TouchableOpacity>
</Modal>
<Modal animationType="fade"
       transparent={true}
       visible={modalVisible1}>
    <SafeAreaView style={styles.container1}>
        <MaterialIcons name="add-a-photo" size={45} color="black" />
        <TouchableOpacity onPress={pickImage}
                          style={styles.button}>
            <Text style={styles.infoText}>Pick an image from camera roll</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto}
                          style={styles.button}>
            <Text style={styles.infoText}>Pick an image from camera</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 ,borderRadius:25}} />}
    </SafeAreaView>
    <TouchableOpacity onPress={()=> { setModalVisible1(!modalVisible1)}}
                      style={{width:"100%",height:"50%"}}></TouchableOpacity>
</Modal>
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button : {
        width:"80%",
        backgroundColor:"#b0c4de",
        borderRadius:25,
        height:"15%",
        marginTop:"10%",
        marginBottom:"3%",
        alignItems:'center',
        justifyContent:'center'
    },
    container1 : {
        backgroundColor: '#778899',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:25,
        opacity: 50,
        width: "90%",
        marginLeft: "5%",
        marginTop:"20%"
    },

    qrcode: {
        marginTop:'3%',
        marginBottom: '6%',
    },
    logo1:{
        fontWeight:"bold",
        fontSize:50,
        color:"#800000",
        marginBottom:"2%",
    },
    picker:{
        height: 50,
        width: "100%"
    },
    textStyle: {
        fontWeight:"bold",
        fontSize:30,
        color:"#fb5b5a",
        textAlign:'center'
    },
    dateText:{
        height:50,
        fontWeight:"bold",
        color:"black",
        marginTop: "10%",
    },

    dateText2:{
        height:50,
        fontWeight:"bold",
        color:"red",
        marginTop: "10%",
        marginLeft: "3%"
    },

    inputView:{
        width:"80%",
        backgroundColor:"#fff8dc",
        borderRadius:25,
        height:"10%",
        marginBottom:"5%",
        justifyContent:"center",
        padding:"7%",
        marginTop: " 5%"
    },

    buttonContainer:{
        width:"45%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:"25%",
        alignItems:"center",
        justifyContent:"center",
        marginTop:"10%",
        marginRight: "1%",
        elevation:3
    },
    plusButton:{
        width:"30%",
        backgroundColor:"#fb5b5a",
        borderRadius:58,
        height:"60%",
        alignItems:"center",
        justifyContent:"center",
        marginTop:"3%",
        marginBottom:"3%",
        marginRight:"20%"
    },
    plusButton1:{
        width:"30%",
        backgroundColor:"#fb5b5a",
        borderRadius:58,
        height:"60%",
        alignItems:"center",
        justifyContent:"center",
        marginTop:"3%",
        marginBottom:"3%",
    },

    buttonText: {
        color:"white",
        fontWeight: "bold"
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#5f9ea0",
        borderRadius:25,
        height:"5%",
        justifyContent:"center",
        marginTop:"1%",
        marginBottom:"4%",
        padding:"2%",
        elevation:5
    },
    editBtn:{
        width:"80%",
        backgroundColor:"#fff8dc",
        borderRadius:25,
        height:50,
        padding:"2%",
        justifyContent:"center",
        marginTop:"1%",
        marginBottom:"4%",
        elevation:5,
        marginLeft:"3%"
    },
    nameView: {
        flexDirection: 'row',
        width: "100%",
        height: "10%",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.2,
    },
    inputText:{
        height:20,
        color:"black",
        fontWeight:'bold'
    },
});*/