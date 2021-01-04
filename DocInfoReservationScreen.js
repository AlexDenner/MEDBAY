import React,{useState} from 'react';
import {StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Image, Alert, ActivityIndicator} from 'react-native';
import {set} from "react-native-reanimated";
import {LinearGradient} from "expo-linear-gradient";
import {AntDesign, Entypo, MaterialIcons} from "@expo/vector-icons";
import {Prenotation} from "./Prenotation";

function del(id) {
    const pren = new Prenotation(id);
    pren.deleteRes();
}
function accept(id) {
    const pren = new Prenotation(id);
    pren.acceptRes();
}

export function DocInfoReservationScreen({navigation,route}) {
    const {pren} = route.params;
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [refresh,setRefresh]= useState(true);


    function getPatientData() {
        fetch('http://medbay.altervista.org/UserProfiling/profiloP.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: pren.emailPaziente
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
            }).finally(()=>setRefresh(false))
    }
    if (refresh) {
        getPatientData();
        return(
            <View style={styles.containerLoad}
            >
                <ActivityIndicator
                    size="large"
                    color="#fb5b5a"
                />
            </View>
        )
    } else {
        if(pren.accettata == 0) {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.upperView}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background}
                        />
                        <Text style={{fontWeight:'bold',marginBottom:"14%",fontSize:30,color:'#fb5b5a'}}>ACCETTAZIONE{"\n"}PRENOTAZIONE:</Text>
                        <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between',alignItems:'center'}}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <MaterialIcons name="arrow-back" size={30} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => accept(pren.idV)}>
                                <Entypo name="check" size={30} color="#00ff00" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => del(pren.idV)}>
                                <Entypo name="cross" size={34} color="#fb5b5a" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.infoView}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background1}
                        />
                        <View style={styles.loginBtn}>
                            <Text style={styles.dateText}>Reservation Id: {pren.idV}</Text>
                        </View>

                        <View style={styles.loginBtn}>
                            <Text style = {styles.dateText}>Patient E-mail: {pren.emailPaziente}</Text>
                        </View>

                        <View style={styles.loginBtn}>
                            <Text style = {styles.dateText}>Date: {pren.date}</Text>
                        </View>

                        <View style={styles.loginBtn}>
                            <Text style = {styles.dateText}>Time: {pren.time}</Text>
                        </View>

                        <View style={styles.loginBtn}>
                            <Text style = {styles.dateText}>Patient FC: {filteredDataSource['fc']}</Text>
                        </View>

                        <View style={styles.loginBtn}>
                            <TouchableOpacity onPress = {() => navigation.navigate('Recipe',{image : pren.link})}>
                                <Text style = {styles.dateText}>Recipe</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.loginBtn}>
                            <Text style = {styles.dateText}>Notes</Text>
                        </View>
                    </View>
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
                        <Text style={{fontWeight:'bold',marginBottom:"14%",fontSize:30,color:'#fb5b5a'}}>ACCETTAZIONE{"\n"}PRENOTAZIONE:</Text>
                        <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between',alignItems:'center'}}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <MaterialIcons name="arrow-back" size={30} color="white" />
                            </TouchableOpacity>
                            <Text style={{fontSize:18,fontWeight:'bold',color:'#90ee90'}}>Reservation Accepted</Text>
                        </View>
                    </View>
                    <View style={styles.infoView}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background1}
                        />
                        <View style={styles.loginBtn}>
                            <Text style={styles.dateText}>Reservation Id: {pren.idV}</Text>
                        </View>

                        <View style={styles.loginBtn}>
                            <Text style = {styles.dateText}>Patient E-mail: {pren.emailPaziente}</Text>
                        </View>

                        <View style={styles.loginBtn}>
                            <Text style = {styles.dateText}>Date: {pren.date}</Text>
                        </View>

                        <View style={styles.loginBtn}>
                            <Text style = {styles.dateText}>Time: {pren.time}</Text>
                        </View>

                        <View style={styles.loginBtn}>
                            <Text style = {styles.dateText}>Patient FC: {filteredDataSource['fc']}</Text>
                        </View>

                        <View style={styles.loginBtn}>
                            <TouchableOpacity onPress = {() => navigation.navigate('Recipe',{image : pren.link})}>
                                <Text style = {styles.dateText}>Recipe</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.loginBtn}>
                            <Text style = {styles.dateText}>Notes</Text>
                        </View>
                    </View>
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
    infoView:{
        backgroundColor:'#4c669f',
        width:"93%",
        height:"68%",
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5
    },

    lineStyle:{
        borderWidth: 0.5,
        borderColor:'black',
        margin:10,
    },

    lineStyle2:{
        borderColor:'black',
        margin:10,
    },

    textStyle: {
        marginTop:"30%",
        fontWeight:"bold",
        fontSize:30,
        color:"#fb5b5a",
    },

    dateText:{
        height:50,
        fontWeight:"bold",
        color:"black",
        marginTop: "10%",
        marginLeft: "5%"
    },

    dateText2:{
        height:50,
        fontWeight:"bold",
        color:"red",
        marginTop: "10%",
        marginLeft: "3%"
    },

    dateText3:{
        fontSize: 25,
        fontWeight:"bold",
        color:"red",
        marginTop: "10%",
        marginLeft: "3%",
        textAlign: 'center',
    },

    buttonImageIconStyle: {
        padding: 10,
        margin: "5%",
        height: "25%",
        width: "15%",
        resizeMode: 'stretch',
    },

    buttonWithIconStyle: {
        flex:0.42,
        flexDirection: 'row',
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:"40%",
        alignItems:"center",
        justifyContent:"center",
        marginTop:"10%",
        marginBottom:"8%",
        marginHorizontal: "1%",
        elevation: 3
    },

    buttonIconSeparatorStyle: {
        backgroundColor: '#fff',
        width: "1%",
        height: "%40",
    },

    buttonTextStyle: {
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: "2%",
        marginLeft: "5%",
    },

    buttonText: {
        color:"white",
        fontWeight: "bold"
    },
    loginBtn:{
        width:"85%",
        backgroundColor:"#f5fffa",
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        height:"9%",
        justifyContent:"center",
        marginTop:"7%",
        //marginBottom:"4%",
        elevation: 4
    },
});
