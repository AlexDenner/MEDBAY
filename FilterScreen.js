import React, {useState,useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    AsyncStorage, SafeAreaView, ScrollView, TouchableHighlight, Modal, Alert, FlatList
} from 'react-native';
import {Entypo, FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import {MedicalOffice} from "./MedicalOffice";
import {Doctor} from "./Doctor";
import { CalendarList } from "react-native-calendars";
import {LocaleConfig} from 'react-native-calendars';
import {LinearGradient} from "expo-linear-gradient";
import { AntDesign } from '@expo/vector-icons';

export function FilterScreen({navigation}) {
    const [c, setC] = useState('Choose City');
    const [p, setP] = useState('Choose Province');
    const [mF, setMf] = useState('Choose Medical Field');
    const [s, setS] = useState('Choose Specialization');
    const [city, setCity] = useState(null);
    const [prov, setProv] = useState(null);
    const [medicalField, setMF] = useState(null);
    const [spec, setSpec] = useState(null);
    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);
    const [citiesList, setCL] = useState([]);
    const [provList, setPL] = useState([]);
    const [medFieldList, setMFL] = useState([]);
    const [specList, setSL] = useState([]);


    function downloadCities() {
        fetch('http://medbay.altervista.org/Filters/cityFilter.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                setCL(responseJson);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    function downloadProv() {
        fetch('http://medbay.altervista.org/Filters/provFilter.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                setPL(responseJson);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    function downloadMedField() {
        fetch('http://medbay.altervista.org/Filters/mFFilter.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                setMFL(responseJson);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    function downloadSpec() {
        fetch('http://medbay.altervista.org/Filters/specFilter.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                setSL(responseJson);
            })
            .catch((error) => {
                console.error(error);
            })
    }

    function openModal() {
        downloadCities();
        setModal(!modal);
    }

    function openModal1() {
        downloadProv();
        setModal1(!modal1);
    }

    function openModal2() {
        downloadMedField();
        setModal2(!modal2);
    }

    function openModal3() {
        downloadSpec();
        setModal3(!modal3);
    }

    function chooseCity(item) {
        setC(item);
        setCity(item);
        setModal(!modal);
    }

    function chooseProv(item) {
        setP(item);
        setProv(item);
        setModal1(!modal1);
    }

    function chooseMF(item) {
        setMF(item);
        setMf(item);
        setModal2(!modal2);
    }

    function chooseSpec(item) {
        setS(item);
        setSpec(item);
        setModal3(!modal3);
    }
    function clearAll() {
        setC('Choose City');
        setCity(null);
        setP('Choose Province');
        setProv(null);
        setMF(null);
        setMf('Choose Medical Field');
        setS('Choose Specialization');
        setSpec(null);
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.upperView}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={['rgba(0,1,1,0.6)', 'transparent']}
                    style={styles.background}
                />
                <View style={{flexDirection: 'row', marginTop: "14%", marginLeft: "2%", marginBottom: "10%"}}>
                    <FontAwesome name="filter" size={35} color="#fb5b5a"/>
                    <Text style={{marginLeft: "2%", fontSize: 30, fontWeight: 'bold', color: '#fb5b5a'}}>FILTERS:</Text>
                </View>
                <View style={styles.views}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 25,
                        marginLeft: "2%",
                        marginBottom: "1%",
                        color: '#fb5b5a'
                    }}>City</Text>
                    <TouchableOpacity style={styles.leftView}
                                      onPress={() => openModal()}>
                        <Text style={styles.textStyle}>{c}</Text>
                        <AntDesign name="caretdown" size={15} color="black"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.views1}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 25,
                        marginRight: "2%",
                        marginBottom: "1%",
                        color: '#fb5b5a'
                    }}>Province</Text>
                    <TouchableOpacity style={styles.rightView}
                                      onPress={() => openModal1()}>
                        <AntDesign name="caretdown" size={15} color="black"/>
                        <Text style={styles.textStyle}>{p}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.views}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 25,
                        marginLeft: "2%",
                        marginBottom: "1%",
                        color: '#fb5b5a'
                    }}>Medical Field</Text>
                    <TouchableOpacity style={styles.leftView}
                                      onPress={() => openModal2()}>
                        <Text style={styles.textStyle}>{mF}</Text>
                        <AntDesign name="caretdown" size={15} color="black"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.views1}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 25,
                        marginRight: "2%",
                        marginBottom: "1%",
                        color: '#fb5b5a'
                    }}>Specialization</Text>
                    <TouchableOpacity style={styles.rightView}
                                      onPress={() => openModal3()}>
                        <AntDesign name="caretdown" size={15} color="black"/>
                        <Text style={styles.textStyle}>{s}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{width: "100%", alignItems: 'center', justifyContent: 'center', height: '20%'}}>
                    <TouchableOpacity style={styles.applyBtn}
                                      onPress={() => navigation.navigate('DoctorsList', {
                                          city: city,
                                          prov: prov,
                                          mF: medicalField,
                                          spec: spec
                                      })}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#f5fffa'}}>Apply Filters</Text>
                    </TouchableOpacity>
                </View>
                <View style={{width: '90%', height: '5%', marginTop: "8%", marginLeft: "5%", justifyContent:'space-between',alignItems:'center',flexDirection:'row'}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={30} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> clearAll()}>
                        <Text style={{fontWeight:'bold',color:'white',fontSize:15}}>Clear All Filters</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal animationType="slide"
                   transparent={true}
                   visible={modal}>
                <View style={{justifyContent: 'flex-end', flex: 1}}>
                    <SafeAreaView style={styles.modal}>
                        <TouchableOpacity style={{
                            width: "97%",
                            height: "10%",
                            marginTop: "2%",
                            justifyContent: 'center',
                            alignItems: 'flex-end'
                        }}
                                          onPress={() => setModal(!modal)}>
                            <Entypo name="circle-with-cross" size={25} color="#4c669f"/>
                        </TouchableOpacity>
                        <FlatList data={citiesList}
                                  ItemSeparatorComponent={() => <View style={{
                                      height: 2.5,
                                      width: "100%",
                                      backgroundColor: "#4c669f",
                                      borderRadius: 30
                                  }}/>}
                                  keyExtractor={(item, index) => index.toString()}
                                  renderItem={({item}) =>
                                      <ScrollView>
                                          <TouchableOpacity
                                              onPress={() => chooseCity(item.city)}>
                                              <View style={{flexDirection: 'row'}}>
                                                  <Text style={{
                                                      width: '50%',
                                                      textAlignVertical: 'center',
                                                      padding: 10,
                                                      color: '#000',
                                                      fontWeight: 'bold'
                                                  }}
                                                  >{item.city}</Text>
                                              </View>
                                          </TouchableOpacity>
                                      </ScrollView>
                                  }/>
                    </SafeAreaView>
                </View>
            </Modal>
            <Modal animationType="slide"
                   transparent={true}
                   visible={modal1}>
                <View style={{justifyContent: 'flex-end', flex: 1}}>
                    <SafeAreaView style={styles.modal}>
                        <TouchableOpacity style={{
                            width: "97%",
                            height: "10%",
                            marginTop: "2%",
                            justifyContent: 'center',
                            alignItems: 'flex-end'
                        }}
                                          onPress={() => setModal1(!modal1)}>
                            <Entypo name="circle-with-cross" size={25} color="#4c669f"/>
                        </TouchableOpacity>
                        <FlatList data={provList}
                                  ItemSeparatorComponent={() => <View style={{
                                      height: 2.5,
                                      width: "100%",
                                      backgroundColor: "#4c669f",
                                      borderRadius: 30
                                  }}/>}
                                  keyExtractor={(item, index) => index.toString()}
                                  renderItem={({item}) =>
                                      <ScrollView>
                                          <TouchableOpacity
                                              onPress={() => chooseProv(item.prov)}>
                                              <View style={{flexDirection: 'row'}}>
                                                  <Text style={{
                                                      width: '50%',
                                                      textAlignVertical: 'center',
                                                      padding: 10,
                                                      color: '#000',
                                                      fontWeight: 'bold'
                                                  }}
                                                  >{item.prov}</Text>
                                              </View>
                                          </TouchableOpacity>
                                      </ScrollView>
                                  }/>
                    </SafeAreaView>
                </View>
            </Modal>
            <Modal animationType="slide"
                   transparent={true}
                   visible={modal2}>
                <View style={{justifyContent: 'flex-end', flex: 1}}>
                    <SafeAreaView style={styles.modal}>
                        <TouchableOpacity style={{
                            width: "97%",
                            height: "10%",
                            marginTop: "2%",
                            justifyContent: 'center',
                            alignItems: 'flex-end'
                        }}
                                          onPress={() => setModal2(!modal2)}>
                            <Entypo name="circle-with-cross" size={25} color="#4c669f"/>
                        </TouchableOpacity>
                        <FlatList data={medFieldList}
                                  ItemSeparatorComponent={() => <View style={{
                                      height: 2.5,
                                      width: "100%",
                                      backgroundColor: "#4c669f",
                                      borderRadius: 30
                                  }}/>}
                                  keyExtractor={(item, index) => index.toString()}
                                  renderItem={({item}) =>
                                      <ScrollView>
                                          <TouchableOpacity
                                              onPress={() => chooseMF(item.campoMedico)}>
                                              <View style={{flexDirection: 'row'}}>
                                                  <Text style={{
                                                      width: '50%',
                                                      textAlignVertical: 'center',
                                                      padding: 10,
                                                      color: '#000',
                                                      fontWeight: 'bold'
                                                  }}
                                                  >{item.campoMedico}</Text>
                                              </View>
                                          </TouchableOpacity>
                                      </ScrollView>
                                  }/>
                    </SafeAreaView>
                </View>
            </Modal>
            <Modal animationType="slide"
                   transparent={true}
                   visible={modal3}>
                <View style={{justifyContent: 'flex-end', flex: 1}}>
                    <SafeAreaView style={styles.modal}>
                        <TouchableOpacity style={{
                            width: "97%",
                            height: "10%",
                            marginTop: "2%",
                            justifyContent: 'center',
                            alignItems: 'flex-end'
                        }}
                                          onPress={() => setModal3(!modal3)}>
                            <Entypo name="circle-with-cross" size={25} color="#4c669f"/>
                        </TouchableOpacity>
                        <FlatList data={specList}
                                  ItemSeparatorComponent={() => <View style={{
                                      height: 2.5,
                                      width: "100%",
                                      backgroundColor: "#4c669f",
                                      borderRadius: 30
                                  }}/>}
                                  keyExtractor={(item, index) => index.toString()}
                                  renderItem={({item}) =>
                                      <ScrollView>
                                          <TouchableOpacity
                                              onPress={() => chooseSpec(item.specializzazione)}>
                                              <View style={{flexDirection: 'row'}}>
                                                  <Text style={{
                                                      width: '50%',
                                                      textAlignVertical: 'center',
                                                      padding: 10,
                                                      color: '#000',
                                                      fontWeight: 'bold'
                                                  }}
                                                  >{item.specializzazione}</Text>
                                              </View>
                                          </TouchableOpacity>
                                      </ScrollView>
                                  }/>
                    </SafeAreaView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fffff0',
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    upperView: {
        backgroundColor: '#4c669f',
        //height:430,
        height: "96%",
        width: "100%",
        borderRadius: 40,
        borderBottomStartRadius: 40,
        borderBottomEndRadius: 40,
        //alignItems: 'center',
        //justifyContent: 'center',
        marginBottom: "4%",
        elevation: 5
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 450,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        //borderRadius:35
    },
    background1: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 150,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        //borderRadius:35
    },
    views: {
        width: "100%",
        height: "8%",
        marginBottom: "10%"
    },
    views1: {
        width: "100%",
        height: "8%",
        marginBottom: "10%",
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
        backgroundColor: '#f5fffa',
        alignItems:'center',
        justifyContent: 'space-between',
        borderTopRightRadius:30,
        borderBottomRightRadius: 30,
        elevation: 4,
        flexDirection: 'row',
        padding:"3%"
    },
    rightView: {
        height:"75%",
        width: "90%",
        backgroundColor: '#f5fffa',
        alignItems:'center',
        justifyContent: 'space-between',
        borderTopLeftRadius:30,
        borderBottomLeftRadius: 30,
        elevation: 4,
        flexDirection: 'row',
        padding:"3%"
    },
    textStyle: {
        //marginTop:"30%",
        fontWeight:"bold",
        fontSize:15,
        color:"black",
        //marginLeft: "1%"
    },
    dateText:{
        fontSize:20,
        fontWeight:"bold",
        color:"white",
        //marginTop: "10%",
        marginLeft: "5%"
    },
    modal: {
        backgroundColor:'#f5fffa',
        width:"100%",
        height:"35%",
        borderTopRightRadius:30,
        borderTopLeftRadius:30

    },
    applyBtn: {
        backgroundColor:'#fb5b5a',
        borderRadius: 30,
        width:"50%",
        height:"30%",
        justifyContent:'center',
        alignItems:'center',
        elevation:5

    },
})