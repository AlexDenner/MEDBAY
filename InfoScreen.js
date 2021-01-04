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
import {FontAwesome, FontAwesome5, MaterialCommunityIcons} from "@expo/vector-icons";
import logo from './assets/logo.png';
import {getData} from "./StorageFunctions";
import {User} from "./User";
import DateTimePicker from "@react-native-community/datetimepicker";
import {Doctor} from "./Doctor";
import {MedicalOffice} from "./MedicalOffice";
import { Fontisto } from '@expo/vector-icons';
import {useIsFocused} from "@react-navigation/native";
import {LinearGradient} from "expo-linear-gradient";
import { MaterialIcons } from '@expo/vector-icons';

export function InfoScreen({navigation, route}) {

    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [office, setOffice] = useState([]);
    const [studio, setStudio] = useState(true);
    const isFocused = useIsFocused();
    const {email} = route.params;

    React.useEffect(() => {
        setRefresh(true)
    }, [isFocused]);


    const run = (email) => {

                fetch('http://medbay.altervista.org/DoctorProfiling/profiloM.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email
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
                    })

            fetch('http://medbay.altervista.org/OfficeManagement/searchStudioAssoc.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson) {
                        setOffice(responseJson);
                    } else {
                        setStudio(false)
                    }
                })
                .catch((error) => {
                    console.error(error);
                }).finally(() => setRefresh(false))
        }

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

        function createOffice() {
            const off = new MedicalOffice();
            off.setName(office[0].name);
            off.setAdd(office[0].via);
            off.setCap(office[0].cap);
            off.setCity(office[0].city);
            off.setPn(office[0].telefono);
            off.setCivic(office[0].civic);
            off.setProv(office[0].prov);
            return off;
        }

        if (refresh) {
            run(email)
            return (
                <View style={styles.containerLoad}>
                    <ActivityIndicator
                        size="large"
                        color="#fb5b5a"
                    />
                </View>
            )
        } else {
            const tempDoc = createDoctor();
            if (studio) {
                const tempOff = createOffice();
                return (
                    <SafeAreaView style={styles.container}>
                        <View style={styles.upperView}>
                            <LinearGradient
                                // Background Linear Gradient
                                colors={['rgba(0,1,1,0.6)', 'transparent']}
                                style={styles.background}
                            />
                            <Text style={{marginBottom:"20%",marginRight:"40%",fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>YOUR MEDBAY</Text>
                            <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between',alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <MaterialIcons name="arrow-back" size={30} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=> navigation.navigate('ServiceList', {email : tempDoc.email})}
                                                  style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',width:"27%"}}>
                                    <Text style={{fontWeight:'bold',color:'#fb5b5a',fontSize:18}}>Services</Text>
                                    <FontAwesome5 name="notes-medical" size={30} color="#fb5b5a" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.nameView}
                                          onPress={()=>navigation.navigate('Info')}>
                            <Fontisto name="doctor" size={35} color="#4c669f" style={{marginLeft:"3%"}}/>
                            <Text style={styles.logo}>{tempDoc.name} {tempDoc.surname}</Text>
                        </TouchableOpacity>
                        <View style={styles.userBtn}>
                            <LinearGradient
                                // Background Linear Gradient
                                colors={['rgba(0,1,1,0.6)', 'transparent']}
                                style={styles.background}
                            />
                                <Text style={styles.infoText1}>E-mail: {tempDoc.email}</Text>
                                <Text style={styles.infoText}>Phone Number: {tempDoc.phone}</Text>
                                <Text style={styles.infoText}>Medical Field: {tempDoc.medField}</Text>
                                <Text style={styles.infoText}>Specialization: {tempDoc.specialization}</Text>
                        </View>
                        <View style={styles.prenBtn}>
                            <Text style={styles.logo1}>{tempOff.name}</Text>
                            <Text style={styles.infoText}>Phone Number: {tempOff.phoneNumber}</Text>
                            <Text style={styles.infoText}>Address: {tempOff.address}  N°{tempOff.civic}</Text>
                            <Text style={styles.infoText}>City: {tempOff.city} ({tempOff.province})</Text>
                        </View>
                        <Text style={{marginTop:"14%",fontSize:11,textDecorationLine:'underline'}}>Info: Clicca su Services per prenotare una visita</Text>
                    </SafeAreaView>
                )
            } else {
                return (
                    <SafeAreaView style={styles.container}>
                        <View style={styles.upperView}>
                            <LinearGradient
                                // Background Linear Gradient
                                colors={['rgba(0,1,1,0.6)', 'transparent']}
                                style={styles.background}
                            />
                            <Text style={{marginBottom:"20%",marginRight:"40%",fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>YOUR MEDBAY</Text>
                            <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between',alignItems: 'center'}}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <MaterialIcons name="arrow-back" size={30} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=> navigation.navigate('ServiceList', {email : tempDoc.email})}
                                                  style={{flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',width:"27%"}}>
                                    <Text style={{fontWeight:'bold',color:'#fb5b5a',fontSize:18}}>Services</Text>
                                    <FontAwesome5 name="notes-medical" size={30} color="#fb5b5a" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.nameView}
                                          onPress={()=>navigation.navigate('Info')}>
                            <Fontisto name="doctor" size={35} color="#4c669f" style={{marginLeft:"3%"}}/>
                            <Text style={styles.logo}>{tempDoc.name} {tempDoc.surname}</Text>
                        </TouchableOpacity>
                        <View style={styles.userBtn}>
                            <LinearGradient
                                // Background Linear Gradient
                                colors={['rgba(0,1,1,0.6)', 'transparent']}
                                style={styles.background}
                            />
                            <Text style={styles.infoText1}>E-mail: {tempDoc.email}</Text>
                            <Text style={styles.infoText}>Phone Number: {tempDoc.phone}</Text>
                            <Text style={styles.infoText}>Medical Field: {tempDoc.medField}</Text>
                            <Text style={styles.infoText}>Specialization: {tempDoc.specialization}</Text>
                        </View>
                        <View style={styles.prenBtn1}>
                            <MaterialCommunityIcons name="office-building" size={150} color="black" style={{marginTop:"1%"}}/>
                            <View style={{width:"60%"}}>
                                <Text style={{fontWeight:'bold',fontSize:15}}>Nessuno Studio Medico Associato</Text>
                            </View>
                        </View>
                        <Text style={{marginTop:"14%",fontSize:11,textDecorationLine:'underline'}}>Info: Clicca su Services per prenotare una visita</Text>
                    </SafeAreaView>
                )
            }
        }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        //justifyContent: 'center',
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
        height: "25%",
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
    nameView: {
        flexDirection: 'row',
        width: "80%",
        borderRadius:35,
        backgroundColor:"#f5fffa",
        height:65,
        alignItems: 'center',
        //justifyContent: 'space-between',
        elevation:3,
    },
    prenBtn:{
        width:"80%",
        backgroundColor:"#fb5b5a",
        //borderRadius:25,
        borderBottomStartRadius:40,
        borderBottomEndRadius:40,
        height:"21%",
        padding: "2%",
        elevation:3,
        //alignItems:'center',
    },
    prenBtn1:{
        width:"80%",
        backgroundColor:"#fb5b5a",
        //borderRadius:25,
        borderBottomStartRadius:40,
        borderBottomEndRadius:40,
        height:"21%",
        padding: "2%",
        elevation:3,
        flexDirection: 'row',
        alignItems:'center',
    },
    userBtn:{
        width:"90%",
        backgroundColor:"#4c669f",
        borderRadius:25,
        marginTop:"10%",
        //marginBottom:"4%",
        elevation:6,
        height: "25%",
        padding:"2%"
    },
    logo:{
        fontWeight:"bold",
        fontSize:25,
        color:"#fb5b5a",
        //marginBottom:"10%",
        margin: "3%"
    },
    infoText: {
        fontWeight: "bold",
        fontSize: 15,
        color: "#fff8dc",
        marginTop: "6%",
        marginLeft: "4%"
    },
    infoText1: {
        fontWeight: "bold",
        fontSize: 20,
        color: "#fb5b5a",
        marginTop: "6%",
        marginLeft: "4%",
        textDecorationLine:'underline'
    },
    logo1: {
        fontWeight: "bold",
        fontSize: 30,
        color: "#4c669f",
        //margin: "1%"
    },
});

