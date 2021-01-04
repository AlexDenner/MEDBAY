import { StatusBar } from 'expo-status-bar';
import React, {useState,useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, AsyncStorage, Image, SafeAreaView} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import {User} from "./User";
import {Prenotation} from "./Prenotation";
import sad_smile from "./assets/sad_smile.png";
import add from "./assets/add.png";
import {useIsFocused} from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import {LinearGradient} from "expo-linear-gradient";
import {store} from "./StorageFunctions";
import logo from "./assets/logo.png";


export function UserHome({navigation, route}) {
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [filteredPren, setFilteredPren] = useState([]);
    const [prenCheck,setPrenCheck] = useState(false);
    const isFocused = useIsFocused();
    const [refresh,setRefresh]= useState(true);
    const prova=false;
    //const {data} = route.params;

    React.useEffect(() => {
        setRefresh(true)
    }, [isFocused]);

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
                    })

                fetch('http://medbay.altervista.org/UserProfiling/latestPrenotation.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_email: value
                    })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson !== null) {
                            setFilteredPren(responseJson);
                            setPrenCheck(true);
                        }
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

    function createPrenotation() {
        let prenotation;
        if (filteredPren !== null) {
            prenotation = new Prenotation();
            prenotation.setId(filteredPren['id']);
            prenotation.setDate(filteredPren['date']);
            prenotation.setTime(filteredPren['time']);
            prenotation.setEmail1(filteredPren['emailPaziente']);
            prenotation.setEmail2(filteredPren['emailMedico'])
            prenotation.setPhone(filteredPren['telefonoStudio']);
            prenotation.setService(filteredPren['idPrestazione']);
        } else {
            prenotation = null;
        }
        return prenotation;
    };

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
        switch (prenCheck) {
            case false:  {
                const tempUser = createUser();
                return (
                    <SafeAreaView style={styles.container}>
                        <View style={styles.upperView}>
                            <LinearGradient
                                // Background Linear Gradient
                                colors={['rgba(0,1,1,0.6)', 'transparent']}
                                style={styles.background}
                            />
                            <Text style={{marginBottom:"28%",marginRight:"40%",fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>YOUR MEDBAY</Text>
                            <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between'}}>
                                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                    <MaterialCommunityIcons
                                        name="menu"
                                        size={38}
                                        color="white"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                                    <MaterialIcons
                                        name="search"
                                        size={38}
                                        color="#fb5b5a"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.nameView}
                                          onPress={()=>navigation.navigate('Info')}>
                            <Text style={styles.logo}>{tempUser.name}  {tempUser.surname}</Text>
                        </TouchableOpacity>
                        <View style={styles.userBtn1}>
                            <LinearGradient
                                // Background Linear Gradient
                                colors={['rgba(0,1,1,0.6)', 'transparent']}
                                style={styles.background}
                            />
                            <TouchableOpacity onPress={()=>navigation.navigate('Reservations')}>
                                <Entypo name="emoji-sad" size={170} color="#fff8dc" />
                                <Text style={styles.prenText}>NO RECENT RESERVATIONS FOUND</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.prenBtn}
                                          onPress={() => navigation.navigate('DoctorsList')}>
                            <FontAwesome name="plus-circle" size={90} color="#fff8dc"
                                         style={{marginLeft: "5%"}}/>
                            <Text style={styles.prenText}>Make a new Reservation!</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                );
                
            }
            case true: {
                const tempUser = createUser();
                const pren = createPrenotation();
                return (
                    <SafeAreaView style={styles.container}>
                        <View style={styles.upperView}>
                            <LinearGradient
                                // Background Linear Gradient
                                colors={['rgba(0,1,1,0.6)', 'transparent']}
                                style={styles.background}
                            />
                            <Text style={{marginBottom:"28%",marginRight:"40%",fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>YOUR MEDBAY</Text>
                            <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between'}}>
                                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                    <MaterialCommunityIcons
                                        name="menu"
                                        size={38}
                                        color="white"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                                    <MaterialIcons
                                        name="search"
                                        size={38}
                                        color="#fb5b5a"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.nameView}
                                          onPress={()=>navigation.navigate('Info')}>
                            <Text style={styles.logo}>{tempUser.name}  {tempUser.surname}</Text>
                        </TouchableOpacity>
                        <View style={styles.userBtn}>
                            <LinearGradient
                                // Background Linear Gradient
                                colors={['rgba(0,1,1,0.6)', 'transparent']}
                                style={styles.background}
                            />
                            <TouchableOpacity onPress={()=>navigation.navigate('Reservations')}>
                                <Text style={{fontWeight:"bold",
                                    fontSize:30,
                                    color:"#fff8dc",
                                    marginTop:"6%",
                                    marginLeft: "2%"
                                }}>RESERVATION ID: #{pren.id}</Text>
                                <Text style={{fontWeight:"bold",
                                    fontSize:15,
                                    color:"#fff8dc",
                                    marginTop: "5%",
                                    marginLeft: "2%"
                                }}>Date: {pren.date}                Time: {pren.time}</Text>
                                <Text style={{fontWeight:"bold",
                                    fontSize:15,
                                    color:"#fff8dc",
                                    marginTop: "5%",
                                    marginLeft: "2%"
                                }}>Doctor E-mail: {pren.doctor_email}</Text>
                                <Text style={{fontWeight:"bold",
                                    fontSize:15,
                                    color:"#fff8dc",
                                    marginTop: "5%",
                                    marginLeft: "2%"
                                }}>Office Phone Number: {pren.office_phone}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.prenBtn}
                                          onPress={() => navigation.navigate('DoctorsList', {
                                              city: null,
                                              prov: null,
                                              mF: null,
                                              spec: null
                                          })}>
                            <FontAwesome name="plus-circle" size={90} color="#fff8dc"
                            style={{marginLeft: "5%"}}/>
                            <Text style={styles.prenText}>Make a new Reservation!</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                );
            }
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fffff0',
        alignItems: 'center',
        //justifyContent: 'center',
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
        height: 150,
        borderTopLeftRadius: 25,
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
        justifyContent: 'center',
        elevation:3
    },
    logo:{
        fontWeight:"bold",
        fontSize:30,
        color:"#fb5b5a",
        //marginBottom:"10%",
        margin: "3%"
    },
    userBtn:{
        width:"90%",
        backgroundColor:"#4c669f",
        borderRadius:25,
        marginTop:"10%",
        //marginBottom:"4%",
        elevation:6,
        height: "30%",
        padding:"2%"
    },
    userBtn1:{
        width:"90%",
        backgroundColor:"#4c669f",
        borderRadius:25,
        marginTop:"10%",
        //marginBottom:"4%",
        elevation:6,
        height: "30%",
        //padding:"2%",
        justifyContent:'center',
        alignItems:'center',
    },
    prenBtn:{
        width:"75%",
        backgroundColor:"#fb5b5a",
        flexDirection: 'row',
        //borderRadius:25,
        borderBottomStartRadius:40,
        borderBottomEndRadius:40,
        marginRight: "1%",
        height:"12%",
        padding: "2%",
        elevation:3,
        alignItems:'center',
        justifyContent:'space-between'
    },
    loginText:{
        color:"white",
        fontWeight: "bold"
    },
    prenText:{
        color:"#fff8dc",
        fontWeight: "bold",
        //textAlign: 'center',
        //marginTop: "5%",
        fontSize: 16,
        marginRight: "2%"
    },
    logoImage: {
        width: "60%",
        height: "50%",
    },
    containerLoad: {
        flex: 1,
        //marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

/*<View style={styles.searchView}>
    <View style={styles.drawBtn}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <MaterialCommunityIcons
                name="menu"
                size={35}
                color="white"
            />
        </TouchableOpacity>
    </View>
    <View style={{marginTop: "10%"}}>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <MaterialIcons
                name="search"
                size={35}
                color="#fb5b5a"
            />
        </TouchableOpacity>
    </View>
</View>
<View style={styles.nameView}>
    <Text style={styles.logo}>{tempUser.name}  {tempUser.surname}</Text>
</View>
<View style={styles.userBtn}>
    <TouchableOpacity onPress={()=>navigation.navigate('Info')}>
        <Text style={{fontWeight:"bold",
            fontSize:30,
            color:"#fff8dc",
            marginTop:"8%",
            marginLeft: "2%"
        }}>Fiscal Code: {tempUser.fiscalCode}</Text>
        <Text style={{fontWeight:"bold",
            fontSize:15,
            color:"#fff8dc",
            marginTop: "5%",
            marginLeft: "2%"
        }}>E-mail: {tempUser.email}</Text>
        <Text style={{fontWeight:"bold",
            fontSize:15,
            color:"#fff8dc",
            marginTop: "5%",
            marginLeft: "2%"
        }}>Address: {tempUser.address}  N°{tempUser.civic}</Text>
        <Text style={{fontWeight:"bold",
            fontSize:15,
            color:"#fff8dc",
            marginTop: "5%",
            marginLeft: "2%"
        }}>City: {tempUser.city} ({tempUser.province})</Text>
    </TouchableOpacity>
</View>
<View style={{flexDirection: 'row',flex:0.4}}>
    <TouchableOpacity style={styles.prenBtn1}
                      onPress={()=>navigation.navigate('Reservations')}>
        <Text style={styles.prenIdText}>#{pren.id}</Text>
        <Text style={styles.prenLabelText}>Date:</Text>
        <Text style={styles.prenText}>{pren.date}</Text>
        <Text style={styles.prenLabelText}>Time:</Text>
        <Text style={styles.prenText}>{pren.time}</Text>
        <Text style={styles.prenLabelText}>Office:</Text>
        <Text style={styles.prenText}>{pren.office_phone}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.prenBtn2}
                      onPress={() => navigation.navigate('Search')}>
        <Image source={add} style={{width: "50%", height: "33.2%"}}/>
        <Text style={styles.prenText}>Make a new Reservation!</Text>
    </TouchableOpacity>
</View>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fffff0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchView: {
        width: "100%",
        height: "10%",
        flexDirection: 'row',
        justifyContent: 'center',
        flex:0.15,
    },
    nameView: {
        flexDirection: 'row',
        width: "100%",
        height:"10%",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.1,
    },
    logo:{
        fontWeight:"bold",
        fontSize:30,
        color:"#fb5b5a",
        marginBottom:"10%",
        margin: "3%"
    },
    prenData1:{
        fontWeight:"bold",
        fontSize:70,
        color:"#fff8dc",
        marginBottom:"20%",
        margin: "3%"
    },
    prenData2:{
        fontSize:20,
        color:"#fff8dc",
        marginBottom:"20%",
        margin: "3%"
    },
    inputView:{
        width:"74%",
        backgroundColor:"#fff8dc",
        borderRadius:25,
        height:"50%",
        justifyContent:"center",
        padding:"5%",
        marginLeft:"3%",
    },
    inputText:{
        height:20,
        color:"black"
    },
    loginBtn:{
        width:"70%",
        backgroundColor:"#4169e1",
        borderRadius:25,
        height:"30%",
        alignItems:"center",
        justifyContent:"center",
        marginTop:"4%",
        marginBottom:"4%",
        borderWidth:5,
        borderColor: '#fb5b5a'
    },
    userBtn:{
        width:"90%",
        backgroundColor:"#5f9ea0",
        borderRadius:25,
        marginTop:"4%",
        marginBottom:"4%",
        flex: 0.3,
        elevation:6
    },
    prenBtn:{
        width:"45%",
        backgroundColor:"#5f9ea0",
        borderRadius:25,
        borderWidth:4,
        borderColor: '#fb5b5a',
        marginRight: "1%",
        height:"80%",
        padding: "2%",
        elevation:3,
        alignItems:'center',
        justifyContent:'center'
    },
    prenBtn1:{
        width:"45%",
        backgroundColor:"#5f9ea0",
        borderRadius:25,
        borderWidth:4,
        borderColor: '#fb5b5a',
        marginRight: "1%",
        height:"80%",
        padding: "2%",
        elevation:3
        //alignItems:'center',
        //justifyContent:'center'
    },
    prenBtn2:{
        width:"45%",
        backgroundColor:"#5f9ea0",
        borderRadius:25,
        borderWidth:4,
        borderColor: '#fb5b5a',
        height:"80%",
        alignItems:'center',
        justifyContent:'center',
        elevation:3
    },
    drawBtn:{
        width:"11%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:"35%",
        marginRight:"70%",
        marginTop:"10%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    loginText:{
        color:"white",
        fontWeight: "bold"
    },
    prenText:{
        color:"#fff8dc",
        fontWeight: "bold",
        //textAlign: 'center',
        marginTop: "5%",
        fontSize: 15,
    },
    prenLabelText:{
        color:"#800000",
        fontWeight: "bold",
        //textAlign: 'center',
        marginTop: "5%",
        fontSize: 15,
    },
    prenIdText:{
        color:"#800000",
        fontWeight: "bold",
        fontSize: 30,
        //textAlign: 'center',
        marginTop: "5%",
        marginBottom:"10%"
    },
    logoImage: {
        width: "60%",
        height: "50%",
    },
});*/