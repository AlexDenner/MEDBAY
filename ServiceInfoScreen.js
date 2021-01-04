import React from 'react';
import {StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Image, Alert, ImageBackground} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import {AntDesign, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";

export function ServiceInfoScreen({navigation,route}) {
    const {service} = route.params;
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.upperView}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={['rgba(0,1,1,0.6)', 'transparent']}
                    style={styles.background}
                />
                <Text style={{marginBottom:"36%",marginRight:"40%",fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>SERVICE INFO:</Text>
                <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between',alignItems:'center'}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Book',{id: service.id})}>
                        <MaterialCommunityIcons name="book-plus" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                        <AntDesign name="home" size={30} color="#fb5b5a" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.infoView}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={['rgba(0,1,1,0.6)', 'transparent']}
                    style={styles.background1}
                />
                <Image
                    source={require('./assets/img_2.png')}
                    style={styles.img2Style}
                />
                <View style={styles.loginBtn}>
                    <Text style={styles.dateText}>{service.name}</Text>
                </View>

                <View style={styles.loginBtn}>
                    <Text style = {styles.dateText}>About: {service.descrizione}</Text>
                </View>


                <View style={styles.loginBtn}>
                    <Text style = {styles.dateText}>Cost: {service.costo}€</Text>
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
        height: 250,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        //borderRadius:35
    },
    infoView: {
        backgroundColor:'#4c669f',
        width: "90%",
        height: "55%",
        borderRadius: 30,
        elevation: 5,
        alignItems:'center'
    },
    loginBtn:{
        //flex:0.25,
        width:"90%",
        backgroundColor:"#f5fffa",
        borderRadius: 30,
        height:70,
        justifyContent:"center",
        //alignItems: 'center',
        marginTop:"5.5%",
        marginBottom:"4%",
        marginLeft: "0.3%",
        elevation: 3,
        padding:"3%"
    },
    dateText:{
        height:50,
        fontWeight:"bold",
        color:"black",
        marginTop:"4%"
    },
    img2Style: {
        padding: 10,
        margin: 5,
        height: "25%",
        width:" 60%",
        resizeMode: 'stretch',
        marginTop: "4%"
    },
});

/*<View style={styles.container}>
    <Text style={styles.lineStyle2}> </Text>
    <View>
        <Text style = {styles.dateText3}>SERVICE INFO:</Text>
    </View>

    <Image
        source={require('./assets/img_2.png')}
        style={styles.img2Style}
    />

    <Text style={styles.lineStyle2}> ──────────────────────────────── </Text>
    <Text style={styles.lineStyle2}> </Text>

    <View style={styles.loginBtn}>
        <Text style={styles.dateText}>{service.name}</Text>
    </View>

    <View style={styles.loginBtn}>
        <Text style = {styles.dateText}>About: {service.descrizione}</Text>
    </View>


    <View style={styles.loginBtn}>
        <Text style = {styles.dateText}>Cost: {service.costo}€</Text>
    </View>

    <Text style={styles.lineStyle2}> </Text>
    <Text style={styles.lineStyle2}> </Text>

    <View style={{ flexDirection:"row", width:"90%" }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.buttonWithIconStyle}
                          style={styles.buttonWithIconStyle}
                          activeOpacity={0.5}>
            <Image
                source={require('./assets/indietro_icon.png')}
                style={styles.buttonImageIconStyle}
            />

            <Text style={styles.buttonTextStyle}>
                GO BACK
            </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Book',{id: service.id})} style={styles.buttonWithIconStyle}
                          style={styles.buttonWithIconStyle}
                          activeOpacity={0.5}>
            <Image
                source={require('./assets/prenota_icon.png')}
                style={styles.buttonImageIconStyle}
            />

            <Text style={styles.buttonTextStyle}>
                BOOK IT
            </Text>
        </TouchableOpacity>

    </View>

</View>

lineStyle:{
        borderWidth: 0.5,
        borderColor:'black',
        margin:10,
    },

    lineStyle2:{
        borderColor:'black',
        margin:10,
    },

    sfondoStyle: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
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
        marginTop:"4%"
    },

    dateText3:{
        fontSize: 25,
        fontWeight:"bold",
        color:"red",
        marginTop: "0.3%",
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

    img2Style: {
        padding: 10,
        margin: 5,
        height: "15%",
        width:" 60%",
        resizeMode: 'stretch',
    },

    buttonImageIconStyle: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
    },

    buttonWithIconStyle: {
        flex:0.85,
        flexDirection: 'row',
        width:"80%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:"15%",
        marginBottom:"2%",
        marginHorizontal: 3,
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
        width:"85%",
        backgroundColor:"#5f9ea0",
        borderRadius:25,
        height:70,
        justifyContent:"center",
        marginTop:"0.5%",
        marginBottom:"4%",
        elevation: 3,
        padding:"3%"
    },*/