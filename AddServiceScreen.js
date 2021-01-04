import React,{useState} from 'react';
import {
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    TextInput,
    AsyncStorage
} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import {AntDesign, Entypo, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";

export function AddServiceScreen({navigation}) {
    const [name,setName] = useState(null);
    const [desc,setDesc] = useState(null);
    const [cost,setCost] = useState(null);

    const addService = async(key) => {
        try{
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                fetch('http://medbay.altervista.org/DoctorProfiling/createPrest.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        doctor_email: value,
                        name: name,
                        desc: desc,
                        cost: cost
                    })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        switch (responseJson) {
                            case 1: {
                                Alert.alert('Service Added!');
                                navigation.goBack();
                                break;
                            }
                            case 0:
                                Alert.alert('Error!')
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    })
            }
        } catch (error) {}
    };

    return (
            <SafeAreaView style={styles.container}>
                <View style={styles.upperView}>
                    <LinearGradient
                        // Background Linear Gradient
                        colors={['rgba(0,1,1,0.6)', 'transparent']}
                        style={styles.background}
                    />
                    <Text style={{fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>NEW SERVICE:</Text>
                    <Image
                        source={require('./assets/img_3.png')}
                        style={styles.img3Style}
                    />
                    <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between',alignItems:'center'}}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <MaterialIcons name="arrow-back" size={30} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => addService('userToken')}>
                            <Entypo name="add-to-list" size={30} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                            <AntDesign name="home" size={30} color="#fb5b5a" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.editView}>
                    <View style={styles.loginBtn}>
                        <TextInput style = {styles.dateText}
                                   placeholder = 'Insert Service Name'
                                   onChangeText = { text => setName(text)}
                                   value={name}
                        />
                    </View>
                    <View style={styles.loginBtn}>
                        <TextInput style = {styles.dateText}
                                   placeholder = 'Insert Service Cost'
                                   onChangeText = { text => setCost(text)}
                                   value={cost}
                        />
                    </View>
                    <View style={styles.loginBtn1}>
                        <TextInput style = {styles.dateText}
                                   placeholder = 'Insert Description'
                                   onChangeText = { text => setDesc(text)}
                                   value={desc}
                        />
                    </View>
                </View>
            </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        //justifyContent: 'center'
    },
    upperView: {
        backgroundColor:'#4c669f',
        //height:430,
        height: "35%",
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
    editView: {
        backgroundColor: '#4c669f',
        width: "85%",
        height:390,
        borderRadius: 30,
        elevation: 5,
        alignItems:'center',
        justifyContent: 'center',
        marginTop: "5%"
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
        fontSize:40,
        color:"#fb5b5a",
    },

    dateText:{
        fontSize: 18,
        height:"50%",
        fontWeight:"bold",
        color:"black",
        marginTop: "10%",
        marginBottom: "10%",
        marginLeft: "7%"
    },

    dateText3:{
        fontSize: 25,
        fontWeight:"bold",
        color:"red",
        marginTop: "0.1%",
        marginLeft: "3%",
        textAlign: 'center',
    },

    imgElencoStyle: {
        padding: 10,
        margin: 5,
        height: 60,
        width: 70,
        resizeMode: 'stretch',
    },

    img3Style: {
        //padding: 7,
        //margin: 5,
        height: "35%",
        width:" 60%",
        resizeMode: 'stretch',
        marginTop:"8%"
    },

    imgAggiungiStyle: {
        padding: 10,
        margin: "2%",
        height: "50%",
        width: "10%",
        resizeMode: 'stretch',
    },

    buttonImageIconStyle: {
        padding: 10,
        margin: 5,
        height: 20,
        width: 25,
        resizeMode: 'stretch',
    },

    buttonWithIconStyle: {
        //flex:0.85,
        flexDirection: 'row',
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:70,
        alignItems:"center",
        justifyContent:"center",
        marginTop:"15%",
        marginBottom:"2%",
        marginHorizontal: 3,
        elevation: 4
    },

    buttonIconSeparatorStyle: {
        backgroundColor: '#fff',
        width: 1,
        height: 40,
    },

    buttonTextStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 1,
        marginLeft: 10,
    },

    buttonText: {
        color:"white",
        fontWeight: "bold"
    },
    loginBtn:{
        //flex:0.25,
        width:"88%",
        backgroundColor:"#f5fffa",
        borderRadius:25,
        height:55,
        justifyContent:"center",
        marginTop:"2%",
        marginBottom:"8%",
        elevation:3,
    },
    loginBtn1:{
        //flex:0.25,
        width:"88%",
        backgroundColor:"#f5fffa",
        borderRadius:25,
        height:125,
        //justifyContent:"center",
        marginTop:"2%",
        marginBottom:"4%",
        elevation:3,
    },
});
