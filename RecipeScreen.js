import React from 'react';
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import {FontAwesome5, MaterialCommunityIcons} from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

export function RecipeScreen({navigation,route}) {
    const {image}=route.params;
    const prova=true;

    if (image !== null) {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.upperView}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background}
                        />
                        <Text style={{marginBottom:"20%",marginRight:"40%",fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>YOUR MEDBAY</Text>
                        <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between'}}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <MaterialIcons name="arrow-back" size={30} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Alert.alert('Avviso:','Condivido')}>
                                <FontAwesome name="share-alt" size={30} color="#fb5b5a" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ImageBackground source={require('./assets/sfondo.png')} style={styles.sfondoStyle}>
                        <View style={{marginTop:"19%",marginLeft:"27%",marginBottom:"25%"}}>
                            <Text style = {{fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>MEDICAL RECIPE</Text>
                        </View>
                        <View style={styles.imageView}>
                            <Image
                                source={{uri: image}}
                                style={styles.ricettaStyle}
                            />
                        </View>
                    </ImageBackground>

                </View>
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.upperView}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background}
                        />
                        <Text style={{marginBottom:"20%",marginRight:"40%",fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>YOUR MEDBAY</Text>
                        <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between'}}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <MaterialIcons name="arrow-back" size={30} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ImageBackground source={require('./assets/sfondo.png')} style={styles.sfondoStyle}>
                        <View style={{marginTop:"19%",marginLeft:"27%",marginBottom:"25%"}}>
                            <Text style = {{fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>MEDICAL RECIPE</Text>
                        </View>
                        <View style={styles.imageView}>
                            <Image
                                source={require('./assets/medici.png')}
                                style={styles.ricettaStyle}
                            />
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Text style={{fontWeight:'bold',fontSize:15,marginTop:"6%",color:'#fb5b5a'}}>NO RECIPE FOUND, PLEASE INSERT IT</Text>
                        </View>
                    </ImageBackground>

                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        justifyContent: 'center'
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
        //marginBottom:"10%",
        elevation: 5
    },
    imageView: {
        backgroundColor: '#4c669f',
        width:"100%",
        height:"50%",
        borderRadius: 45,
        elevation: 5,
        alignItems:'center',
        justifyContent:'center'
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

    lineStyle:{
        borderWidth: 0.5,
        borderColor:'black',
        margin:"10%",
    },

    lineStyle2:{
        borderColor:'black',
        margin:"3%",
    },

    textStyle: {
        marginTop:"30%",
        fontWeight:"bold",
        fontSize:30,
        color:"#fb5b5a",
    },

    dateText3:{
        fontSize: 25,
        fontWeight:"bold",
        color:"red",
        //marginTop: "0.1%",
        //marginLeft: "3%",
        textAlign: 'center',
    },
    dateText4:{
        fontSize: 25,
        fontWeight:"bold",
        color:"#5f9ea0",
        marginTop: "0.1%",
        marginLeft: "3%",
        textAlign: 'center',
    },


    ricettaStyle: {
        display: 'flex',
        justifyContent: 'center',
        padding: "10%",
        margin: "2%",
        height: "90%",
        width: 340,
        resizeMode: 'stretch',
        borderRadius: 40
    },

    sfondoStyle: {
        flex: 1,
        resizeMode: "cover",
        //justifyContent: "center"
    },

    buttonImageIconStyle: {
        padding: "10%",
        margin: "2%",
        height: "20%",
        width: 20,
        resizeMode: 'stretch',
    },

    buttonWithIconStyle: {
        flex:0.5,
        flexDirection: 'row',
        width:"90%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:"60%",
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
        marginBottom: "1%",
        marginLeft: "10%",
    },

});


