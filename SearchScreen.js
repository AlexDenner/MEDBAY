import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, FlatList, ScrollView} from 'react-native';
import {FontAwesome5, MaterialCommunityIcons, Octicons} from '@expo/vector-icons';
import {LinearGradient} from "expo-linear-gradient";

export function SearchScreen({navigation}) {

    const [dataMedico, setdataMedico] = useState([]);
    const [dataPrestazione, setdataPrestazione] = useState([]);
    const [data, setData] = useState([]);

    function Call1(text){
        fetch('http://medbay.altervista.org/searchMedico.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                setdataMedico(responseJson)
            }).catch((error) => {
            console.error(error);
        })//.finally(() => setLoading(false));
    }

    function Call2(text){
        fetch('http://medbay.altervista.org/searchPrestazione.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                setdataPrestazione(responseJson)
            }).catch((error) => {
            console.error(error);
        })//.finally(() => setLoading(false));
    }

    function Search(text) {
        Call1(text)
        Call2(text)

        if(!dataMedico) {
            setData(dataMedico)
        }
        else if(!dataPrestazione){
            setData(dataPrestazione)
        }
        else if(dataMedico && dataPrestazione){
            setData(dataMedico.concat(dataPrestazione))
        }
    }

    function Navigate(item){
        if(item.pName) {
            navigation.navigate('Book', {id: item.id})
        }
        else {
            navigation.navigate('DoctorInfo', {email: item.email})
        }
    }

    function RenderText({item}){
        if(item.pName) {
            return (
                <Text style={{
                    width: '50%',
                    textAlignVertical: 'center',
                    padding: 10,
                    color: '#000',
                    fontWeight: 'bold'
                }}
                >{item.pName} {item.costo}€</Text>
            )
        }
        else {
            return (
                <Text style={{
                    width: '50%',
                    textAlignVertical: 'center',
                    padding: 10,
                    color: '#000',
                    fontWeight: 'bold'
                }}
                >{item.name} {item.surname} {item.tel} {item.campoMedico} - {item.specializzazione}</Text>
            )
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.inputView}>
                <TextInput
                    style = {{padding:2,fontWeight: 'bold',width:"100%"}}
                    onChangeText={text => Search(text)}
                    //value={text}
                    underlineColorAndroid="transparent"
                    placeholder="Search"
                />
            </View>
            <View style={styles.upperView}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={['rgba(0,1,1,0.6)', 'transparent']}
                    style={styles.background}
                />
                <Text style={{marginBottom:"25%",marginRight:"40%",fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>YOUR MEDBAY</Text>
            </View>
            <View style={styles.flatView}>
                <FlatList data={data}
                          ItemSeparatorComponent = {() => <View style={{ height: 2.5, width: "100%", backgroundColor: "#4c669f", borderRadius:30}}/>}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({item}) =>
                              <TouchableOpacity
                                  onPress={()=> Navigate(item)}>
                                  <View style={{flexDirection: 'row'}}>
                                      <RenderText item={item}/>
                                  </View>
                              </TouchableOpacity>
                          }/>
            </View>
        </SafeAreaView>
    );
}

//{item.name}, {item.surname}, {item.tel}, {item.campoMedico}, {item.specializzazione}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffff0',
        alignItems: 'center'
    },
    upperView: {
        backgroundColor:'#4c669f',
        height:182,
        //height: "20%",
        width:"100%",
        borderBottomStartRadius:40,
        borderBottomEndRadius:40,
        alignItems:'center',
        justifyContent:'flex-end',
        marginBottom:"10%",
        elevation: 5,
        position:'absolute'
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
    inputView:{
        width:"80%",
        backgroundColor:"#f5fffa",
        borderRadius:30,
        height: 55,
        justifyContent:"center",
        padding:"3%",
        //marginBottom: "90%",
        marginTop:"36%",
        elevation: 6,
        //position:'absolute'
    },
    flatView:{
        width:"90%",
        backgroundColor:"#f5fffa",
        borderRadius:25,
        height:"70%",
        marginTop:"8%",
        //justifyContent:"center",
        padding:"3%",
        elevation: 4
        //flex: 0.8,
    },
    itemStyle: {
        padding: 10,
        fontWeight: "bold",
        color: "#8b0000"
    },
    textInputStyle: {
        height: 40,
        borderWidth: 1,
        paddingLeft: 20,
        margin: 5,
        borderColor: '#009688',
        backgroundColor: '#FFFFFF',
    },
    searchView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        width:"100%",
        height:190,
        //flex: 0.2,
    },
    drawBtn:{
        width:"11%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:"26%",
        marginRight:"5%",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:"11.8%"
    },
});

/*<TouchableOpacity
                                  onPress={()=> navigation.navigate('DoctorInfo', {email: item.email})}>
                                  <View style={{flexDirection: 'row'}}>
                                      <Text style={{
                                          width: '50%',
                                          textAlignVertical: 'center',
                                          padding: 10,
                                          color: '#000',
                                          fontWeight: 'bold'
                                      }}
                                      >{item.name} {item.surname} {item.tel} {item.campoMedico}</Text>
                                  </View>
                              </TouchableOpacity>*/