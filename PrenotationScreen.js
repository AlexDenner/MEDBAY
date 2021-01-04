import React,{useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Picker,
    Modal,
    TextInput,
    Alert, Image, AsyncStorage, ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {AntDesign, Fontisto, MaterialIcons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import {User} from "./User";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import {LinearGradient} from "expo-linear-gradient";
import {useIsFocused} from "@react-navigation/native";


export default function PrenotationScreen ({navigation,route}) {
    const [date, setDate] = useState(new Date(1598051730000));
    //const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateText,setDT] = useState('SCEGLI DATA');
    let [selectedValue, setSelectedValue] = React.useState('8:30');
    const [filteredDataSource,setFilteredDataSource] = useState([]);
    const [modalVisible1, setModalVisible1] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [officeModal, setOfficeModal] = React.useState(false);
    const [doctorModal, setDoctorModal] = React.useState(false);
    const [servModal, setServModal] = React.useState(false);
    const [image, setImage] = React.useState(null);
    const [notes, setNotes] = useState(null);
    const [emailP, setEmailP] = useState(null);
    const isFocused = useIsFocused();
    const {id} = route.params;

    const getData = async(key) => {
        try{
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                setEmailP(value)
            }
        } catch (error) {}
    };

    React.useEffect(() => {
        getData('userToken')

        fetch('http://medbay.altervista.org/Booking/dataBook.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                setFilteredDataSource(responseJson);
            })
            .catch((error) => {
                console.error(error);
            })
    }, [isFocused]);

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

    function Upload(localUri, id) {
        let filename = localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        let formData = new FormData();
        formData.append('photo', {
            uri: localUri,
            name: filename, type
        });
        formData.append('id', id);

        fetch('http://medbay.altervista.org/Documents/uploadDocument.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                // return responseJson
                Alert.alert(responseJson);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    function booking() {
        fetch('http://medbay.altervista.org/Booking/booking.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                note: notes,
                tempo: selectedValue,
                data: dateText,
                telefonoStudio: filteredDataSource['telefono'],
                emailPaziente: emailP,
                idPrestazione: id,
                emailMedico: filteredDataSource['email']
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if(responseJson > 0){
                    if(image !== null) {
                        Upload(image, responseJson)
                    }
                    else {
                        Alert.alert('Prenotazione effettuata senza ricetta!');
                    }
                }
                else {
                    Alert.alert(responseJson)
                }
            }).catch((error) => {
            console.error(error);
        })

        return (
            <SafeAreaView style={styles.containerLoad}>
                <ActivityIndicator
                    size="large"
                    color="#fb5b5a"
                />
                <Text style={{fontSize:20,fontWeight:'bold',color:'#4c669f',marginTop:"5%"}}>Stiamo performando la tua Prenotazione...</Text>
            </SafeAreaView>
        );
    }
    
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

    function onChange(event, selectedDate) {
        if(selectedDate) {
            const currentDate = selectedDate;
            setShow(Platform.OS === 'ios');
            setDate(currentDate);
            setDT(currentDate.getFullYear().toString().concat('-', (currentDate.getMonth() + 1).toString(), '-', (currentDate.getDate()).toString()))
        }
        setShow(Platform.OS === 'ios');
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.upperView}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={['rgba(0,1,1,0.6)', 'transparent']}
                    style={styles.background}
                />
                <Text style={{marginBottom:"28%",fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>BOOKING:</Text>
                <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between',alignItems:'center'}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => booking()}>
                        <MaterialCommunityIcons name="book-plus" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <AntDesign name="home" size={30} color="#fb5b5a" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.nameView}
                              onPress={()=> setDoctorModal(!doctorModal)}>
                <Fontisto name="doctor" size={35} color="#4c669f" style={{marginLeft:"3%"}}/>
                <Text style={styles.textStyle}>{filteredDataSource['mName']} {filteredDataSource['mSurname']}</Text>
            </TouchableOpacity>
            <View style={styles.views}>
                <TouchableOpacity style={styles.leftView}
                                  onPress={()=>setOfficeModal(!officeModal)}>
                    <Text style={styles.dateText}>{filteredDataSource['sName']}</Text>
                    <Entypo name="info-with-circle" size={24} color="white" style={{marginLeft:"5%"}} />
                </TouchableOpacity>
            </View>
            <View style={styles.views1}>
                <View style={styles.rightView}>
                    <Text onPress={() => setShow(true)} style = {styles.dateText}>{dateText ? date.getDate().toString().concat('-', (date.getMonth()+1).toString(), '-', (date.getFullYear()).toString()) : 'SCEGLI DATA'}</Text>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode='date'
                            is24Hour={true}
                            display="default"
                            minimumDate={new Date()}
                            onChange={onChange}
                        />
                    )}
                </View>
            </View>
            <View style={styles.views}>
                <View style={styles.leftView}>
                    <Picker
                        style = {styles.picker}
                        selectedValue= {selectedValue}
                        onValueChange={(itemValue) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="8:30" value='8:30' color='#add8e6'/>
                        <Picker.Item label="9:30" value='9:30' color='#add8e6'/>
                        <Picker.Item label="10:30" value='10:30' color='#add8e6'/>
                        <Picker.Item label="11:30" value='11:30' color='#add8e6'/>
                        <Picker.Item label="15:30" value='15:30' color='#add8e6'/>
                        <Picker.Item label="16:30" value='16:30' color='#add8e6'/>
                        <Picker.Item label="17:30" value='17:30' color='#add8e6'/>
                        <Picker.Item label="18:30" value='18:30' color='#add8e6'/>
                    </Picker>
                </View>
            </View>
            <View style={styles.views1}>
                <TouchableOpacity style={styles.rightView}
                                  onPress={()=>setServModal(!servModal)}>
                    <Entypo name="info-with-circle" size={24} color="white" />
                    <Text style={styles.dateText}>{filteredDataSource['pName']}</Text>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',marginTop:"5%"}}>
                <View style={styles.plusButton}>
                    <TouchableOpacity
                        onPress={()=> setModalVisible1(!modalVisible1)}
                    >
                        <MaterialIcons name="add-a-photo" size={45} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.plusButton1}>
                    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                        <MaterialCommunityIcons name="file-document-box-plus" size={45} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal animationType="fade"
                   transparent={true}
                   visible={modalVisible1}>
                <SafeAreaView style={styles.container1}>
                    <MaterialIcons name="add-a-photo" size={45} color="white" />
                    <Text style={{fontWeight:'bold',color:'white',marginTop:"3%",fontSize:20}}>ADD RECIPE</Text>
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

            <Modal animationType="fade"
                   transparent={true}
                   visible={modalVisible}>
                <SafeAreaView style={styles.container1}>
                    <Foundation name="clipboard-notes" size={100} color="#fffff0" />
                    <View style={{width:"100%",marginLeft: "20%"}}>
                        <Text style={styles.textStyle1}>Insert Notes</Text>
                    </View>
                    <View style={styles.modalInput}>
                        <TextInput style = {styles.inputText}
                                   placeholder = 'Insert Notes'
                                   onChangeText = { text => setNotes(text)}
                                   value={notes}
                        />
                    </View>
                </SafeAreaView>
                <TouchableOpacity onPress={()=> { setModalVisible(!modalVisible)}}
                                  style={{width:"100%",height:"50%"}}></TouchableOpacity>
            </Modal>

            <Modal animationType="fade"
                   transparent={true}
                   visible={officeModal}>
                <SafeAreaView style={styles.container1}>
                    <Entypo name="info-with-circle" size={50} color="white"/>
                    <View style={{width:"100%",marginLeft: "20%"}}>
                        <Text style={styles.textStyle1}>Office Info:</Text>
                        <Text style={styles.textStyle1}>{filteredDataSource['sName']}</Text>
                    </View>
                    <View style={styles.modalInput}>
                        <Text style={styles.infoText}>Address: {filteredDataSource['via']} N°{filteredDataSource['civic']}</Text>
                        <Text style={styles.infoText}>City: {filteredDataSource['city']} ({filteredDataSource['prov']})</Text>
                        <Text style={styles.infoText}>CAP: {filteredDataSource['cap']}</Text>
                        <Text style={styles.infoText}>Phone Number: {filteredDataSource['telefono']}</Text>
                    </View>
                </SafeAreaView>
                <TouchableOpacity onPress={()=> { setOfficeModal(!officeModal)}}
                                  style={{width:"100%",height:"50%"}}></TouchableOpacity>
            </Modal>
            <Modal animationType="fade"
                   transparent={true}
                   visible={doctorModal}>
                <SafeAreaView style={styles.container1}>
                    <Entypo name="info-with-circle" size={50} color="white"/>
                    <View style={{width:"100%",marginLeft: "20%"}}>
                        <Text style={styles.textStyle1}>Doctor Info</Text>
                    </View>
                    <View style={styles.modalInput}>
                        <Text style={styles.infoText}>E-mail: {filteredDataSource['email']}</Text>
                        <Text style={styles.infoText}>Phone Number: {filteredDataSource['tel']}</Text>
                        <Text style={styles.infoText}>Specialization: {filteredDataSource['specializzazione']}</Text>
                        <Text style={styles.infoText}>Medical Field: {filteredDataSource['campoMedico']}</Text>
                    </View>
                </SafeAreaView>
                <TouchableOpacity onPress={()=> { setDoctorModal(!doctorModal)}}
                                  style={{width:"100%",height:"50%"}}></TouchableOpacity>
            </Modal>
            <Modal animationType="fade"
                   transparent={true}
                   visible={servModal}>
                <SafeAreaView style={styles.container1}>
                    <Entypo name="info-with-circle" size={50} color="white"/>
                    <View style={{width:"100%",marginLeft: "20%"}}>
                        <Text style={styles.textStyle1}>Service Info</Text>
                    </View>
                    <View style={styles.modalInput}>
                        <Text style={styles.infoText}>Description: {filteredDataSource['descrizione']}</Text>
                        <Text style={styles.infoText}>Cost: {filteredDataSource['costo']}€</Text>
                    </View>
                </SafeAreaView>
                <TouchableOpacity onPress={()=> { setServModal(!servModal)}}
                                  style={{width:"100%",height:"50%"}}></TouchableOpacity>
            </Modal>
        </SafeAreaView>

    );

}


const styles = StyleSheet.create({
    container : {
     flex: 1,
     backgroundColor: '#fffff0',
     alignItems: 'center',
     //justifyContent: 'center',
    },
    containerLoad : {
        flex: 1,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        justifyContent: 'center',
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
        elevation:12
    },
    upperView: {
        backgroundColor:'#4c669f',
        //height:430,
        height: "30%",
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
        height: 250,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        //borderRadius:35
    },
    views: {
      width: "100%",
      height: "8%",
      marginBottom: "2%"
    },
    views1: {
        width: "100%",
        height: "8%",
        marginBottom: "2%",
        alignItems: 'flex-end'
    },
    nameView: {
        height:"7%",
        width: "90%",
        backgroundColor: '#f5fffa',
        alignItems:'center',
        //justifyContent: 'center',
        borderRadius: 30,
        elevation: 4,
        flexDirection: 'row',
        marginBottom: "5%"
    },
    leftView: {
        height:"75%",
        width: "90%",
        backgroundColor: '#4c669f',
        alignItems:'center',
        justifyContent: 'center',
        borderTopRightRadius:30,
        borderBottomRightRadius: 30,
        elevation: 4,
        flexDirection: 'row',
        padding:"3%"
    },
    rightView: {
        height:"75%",
        width: "90%",
        backgroundColor: '#4c669f',
        alignItems:'center',
        justifyContent: 'center',
        borderTopLeftRadius:30,
        borderBottomLeftRadius: 30,
        elevation: 4,
        flexDirection: 'row',
        padding:"3%"
    },
    textStyle: {
        //marginTop:"30%",
        fontWeight:"bold",
        fontSize:25,
        color:"#fb5b5a",
        marginLeft: "3%"
    },
    dateText:{
        fontSize:20,
        fontWeight:"bold",
        color:"white",
        //marginTop: "10%",
        marginLeft: "5%"
    },
    picker:{
        height: "100%",
        width: "35%"
    },
    plusButton:{
        width:"20%",
        backgroundColor:"#fb5b5a",
        borderRadius:58,
        height:"40%",
        alignItems:"center",
        justifyContent:"center",
        //marginTop:"3%",
        //marginBottom:"3%",
        marginRight:"20%",
        elevation:5
    },
    plusButton1:{
        width:"20%",
        backgroundColor:"#fb5b5a",
        borderRadius:58,
        height:"40%",
        alignItems:"center",
        justifyContent:"center",
        //marginTop:"3%",
        //marginBottom:"3%",
        elevation:5
    },
    modalInput:{
        width:"80%",
        backgroundColor:"#b0c4de",
        borderRadius:25,
        height:"40%",
        marginTop:"10%",
        marginBottom:"3%",
        padding:"2%"
    },
    textStyle1: {
        marginTop:"5%",
        fontWeight:"bold",
        fontSize:30,
        color:"#fb5b5a",
    },
    infoText : {
        fontWeight: 'bold',
        padding:"3%"
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

});

