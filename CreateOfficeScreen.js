import React, {useState,useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    AsyncStorage,
    SafeAreaView,
    Image,
    Alert,
    ScrollView,
    FlatList
} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import logo from "./assets/logo.png";
import {MedicalOffice} from "./MedicalOffice";
import {LinearGradient} from "expo-linear-gradient";
import { AntDesign } from '@expo/vector-icons';

export function CreateOfficeScreen({navigation}) {
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [check, setCheck] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [name, setName] = useState(null);
    const [add, setAdd] = useState(null);
    const [civic, setCivic] = useState(null);
    const [city, setCity] = useState(null);
    const [prov, setProv] = useState(null);
    const [cap, setCap] = useState(null);
    const [phone, setPhone] = useState(null);

    function fetchNumber(numb) {
        fetch('http://medbay.altervista.org/OfficeManagement/searchStudio.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phone_number: numb
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson) {
                    setFilteredDataSource(responseJson);
                    setCheck(true);
                } else
                    setCheck(false)
            })
            .catch((error) => {
                console.error(error);
            }).finally(() => setRefresh(false))
    }

    const addOffice = async (key, tel) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                fetch('http://medbay.altervista.org/OfficeManagement/addOffice.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: value,
                        telefono: tel
                    })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson) {
                            Alert.alert(
                                'Office Added!',
                                ' ',
                                [
                                    {text: "OK"}
                                ],
                                {cancelable: false}
                            );
                        } else {
                            Alert.alert('Cannot perform the addition, try again!')
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    }).finally()
            }
        } catch (error) {
        }
    };
    const createOff = async (key, tel, name, add, civ, city, prov, cap) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                fetch('http://medbay.altervista.org/OfficeManagement/createOffice.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: value,
                        telefono: tel,
                        name: name,
                        via: add,
                        civic: civ,
                        city: city,
                        prov: prov,
                        cap: cap
                    })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson) {
                            Alert.alert(
                                'Office Created!',
                                ' ',
                                [
                                    {text: "OK"}
                                ],
                                {cancelable: false}
                            );
                        } else {
                            Alert.alert('Cannot perform the creation, try again!')
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    }).finally()
            }
        } catch (error) {
        }
    }

    function createOffice() {
        const office = new MedicalOffice();
        office.setName(filteredDataSource['name']);
        office.setAdd(filteredDataSource['via']);
        office.setCivic(filteredDataSource['civic']);
        office.setCity(filteredDataSource['city']);
        office.setProv(filteredDataSource['prov']);
        office.setCap(filteredDataSource['cap']);
        office.setPn(filteredDataSource['telefono']);
        return office;
    }

    if (refresh) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.contView}>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            placeholder='Phone Number'
                            onChangeText={text => setPhone(text)}
                        />
                        <TouchableOpacity
                            style={{marginLeft: "2%", elevation: 8, alignItems: 'center', justifyContent: 'center'}}
                            onPress={() => fetchNumber(phone)}>
                            <MaterialCommunityIcons name="arrow-right-bold-circle" size={35} color="#fb5b5a"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.upperView}>
                    <LinearGradient
                        // Background Linear Gradient
                        colors={['rgba(0,1,1,0.6)', 'transparent']}
                        style={styles.background}
                    />
                    <Text style={{marginBottom: "13%", fontWeight: 'bold', fontSize: 30, color: '#fb5b5a'}}>ADD A
                        MEDICAL OFFICE:</Text>
                    <Text style={styles.logo}> Insert the Office's Phone Number</Text>
                </View>
                <View style={styles.flatView}>
                    <View style={{width: "50%", alignItems: 'center'}}>
                        <Image source={logo} style={styles.logoImage}/>
                    </View>
                </View>
                <TouchableOpacity style={{
                    width: "22%",
                    backgroundColor: '#fb5b5a',
                    borderTopRightRadius: 40,
                    position: 'absolute',
                    marginTop: "195%",
                    elevation: 5,
                    alignItems: 'center'
                }}
                onPress={()=>navigation.goBack()}>
                    <AntDesign name="back" size={40} color="white" style={{marginTop:"30%"}}/>
                </TouchableOpacity>
            </SafeAreaView>
        )
    } else {
        if (check) {
            const tempOff = createOffice();
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.contView}>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.inputText}
                                placeholder='Phone Number'
                                onChangeText={text => setPhone(text)}
                            />
                            <TouchableOpacity
                                style={{marginLeft: "2%", elevation: 8, alignItems: 'center', justifyContent: 'center'}}
                                onPress={() => fetchNumber(phone)}>
                                <MaterialCommunityIcons name="arrow-right-bold-circle" size={35} color="#fb5b5a"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.upperView}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background}
                        />
                        <Text style={{marginBottom: "13%", fontWeight: 'bold', fontSize: 30, color: '#fb5b5a'}}>ADD A
                            MEDICAL OFFICE:</Text>
                        <Text style={styles.logo}> Insert the Office's Phone Number</Text>
                    </View>
                    <View style={styles.flatView1}>
                        <View style={styles.loginBtn}>
                            <Text style={styles.infoFont}>Name: {tempOff.name}</Text>
                        </View>
                        <View style={styles.loginBtn}>
                            <Text style={styles.infoFont}>Phone Number: {tempOff.phoneNumber}</Text>
                        </View>
                        <View style={styles.loginBtn}>
                            <Text style={styles.infoFont}>Address: {tempOff.address} N°{tempOff.civic}</Text>
                        </View>
                        <View style={styles.loginBtn}>
                            <Text style={styles.infoFont}>City: {tempOff.city} ({tempOff.province})</Text>
                        </View>
                        <View style={styles.loginBtn}>
                            <Text style={styles.infoFont}>CAP: {tempOff.cap}</Text>
                        </View>
                        <View style={styles.loginBtn1}>
                            <TouchableOpacity onPress={() => addOffice('userToken', phone)}>
                                <Text style={styles.font}>ADD OFFICE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={{
                        width: "22%",
                        backgroundColor: '#fb5b5a',
                        borderTopRightRadius: 40,
                        position: 'absolute',
                        marginTop: "195%",
                        elevation: 5,
                        alignItems: 'center'
                    }}
                                      onPress={()=>navigation.goBack()}>
                        <AntDesign name="back" size={40} color="white" style={{marginTop:"30%"}}/>
                    </TouchableOpacity>
                </SafeAreaView>
            )
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.contView}>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.inputText}
                                placeholder='Phone Number'
                                onChangeText={text => setPhone(text)}
                            />
                            <TouchableOpacity
                                style={{marginLeft: "2%", elevation: 8, alignItems: 'center', justifyContent: 'center'}}
                                onPress={() => fetchNumber(phone)}>
                                <MaterialCommunityIcons name="arrow-right-bold-circle" size={35} color="#fb5b5a"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.upperView}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background}
                        />
                        <Text style={{marginBottom: "13%", fontWeight: 'bold', fontSize: 30, color: '#fb5b5a'}}>ADD A
                            MEDICAL OFFICE:</Text>
                        <Text style={styles.logo}> Insert the Office's Phone Number</Text>
                    </View>
                    <View style={styles.flatView1}>
                        <View style={styles.loginBtn}>
                            <TextInput
                                style={styles.inputText}
                                placeholder='Name'
                                onChangeText={text => setName(text)}
                            />
                        </View>
                        <View style={styles.inputViewMod}>
                            <View style={styles.inputViewMod1}>
                                <TextInput
                                    style={styles.inputText}
                                    placeholder='Address'
                                    onChangeText={text => setAdd(text)}
                                />
                            </View>
                            <View style={styles.inputViewMod2}>
                                <TextInput
                                    style={styles.inputText}
                                    placeholder='Civic'
                                    onChangeText={text => setCivic(text)}
                                />
                            </View>
                        </View>
                        <View style={styles.loginBtn}>
                            <TextInput
                                style={styles.inputText}
                                placeholder='City'
                                onChangeText={text => setCity(text)}
                            />
                        </View>
                        <View style={styles.loginBtn}>
                            <TextInput
                                style={styles.inputText}
                                placeholder='Province'
                                onChangeText={text => setProv(text)}
                            />
                        </View>
                        <View style={styles.loginBtn}>
                            <TextInput
                                style={styles.inputText}
                                placeholder='Cap'
                                onChangeText={text => setCap(text)}
                            />
                        </View>
                        <View style={styles.loginBtn1}>
                            <TouchableOpacity
                                onPress={() => createOff('userToken', phone, name, add, civic, city, prov, cap)}>
                                <Text style={styles.font}>CREATE OFFICE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={{
                        width: "22%",
                        backgroundColor: '#fb5b5a',
                        borderTopRightRadius: 40,
                        position: 'absolute',
                        marginTop: "195%",
                        elevation: 5,
                        alignItems: 'center'
                    }}
                                      onPress={()=>navigation.goBack()}>
                        <AntDesign name="back" size={40} color="white" style={{marginTop:"30%"}}/>
                    </TouchableOpacity>
                </SafeAreaView>
            )
        }
    }
}

const styles = StyleSheet.create ({

    container: {
        flex: 1,
        backgroundColor: '#fffff0',
        //alignItems: 'center'
    },
    upperView: {
        backgroundColor:'#4c669f',
        height:230,
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
        height: "100%",
        justifyContent:"space-between",
        padding:"3%",
        //marginBottom: "90%",
        //marginTop:"48%",
        elevation: 6,
        flexDirection: 'row'
        //position:'absolute'
    },
    flatView:{
        width:"90%",
        backgroundColor:"#f5fffa",
        borderRadius:25,
        height:"65%",
        marginTop:"8%",
        justifyContent:"center",
        alignItems:'center',
        padding:"3%",
        elevation: 4,
        marginLeft: "5%"
        //flex: 0.8,
    },
    flatView1:{
        width:"90%",
        backgroundColor:"#f5fffa",
        borderRadius:25,
        height:"65%",
        marginTop:"8%",
        //justifyContent:"center",
        //alignItems:'center',
        //padding:"3%",
        elevation: 4
        //flex: 0.8,
    },
    contView: {
        width:"100%",
        height: 55,
        justifyContent:"center",
        //marginBottom: "90%",
        marginTop:"48%",
        flexDirection:'row'
    },
    logoImage: {
        resizeMode:'contain',
        height:"60%",
        //marginLeft: "170%",
        borderWidth:1
    },
    loginBtn:{
        width:"90%",
        backgroundColor:"#4c669f",
        borderTopRightRadius:25,
        borderBottomRightRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:"8%",
        elevation:5
        //marginLeft:"9.5%",
    },
    loginBtn1:{
        width:"60%",
        backgroundColor:"#fb5b5a",
        borderTopRightRadius:25,
        borderBottomRightRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:"8%",
        elevation:5
        //marginLeft:"19%",
    },
    infoFont:{
        fontWeight:"bold",
        fontSize:15,
        color:"white",
        marginLeft:"3%"
    },
    font:{
        fontWeight:"bold",
        fontSize:20,
        color:"#fff8dc",
        marginLeft:"3%"
    },
    inputViewMod:{
        width:"100%",
        height:50,
        alignItems:"center",
        //justifyContent:"center",
        marginTop:"8%",
        flexDirection: 'row',
    },
    inputViewMod1:{
        width:"69%",
        backgroundColor:"#4c669f",
        borderTopRightRadius:25,
        borderBottomRightRadius:25,
        height:"100%",
        justifyContent:"center",
        alignItems:'center',
        padding:"4%",
        elevation:5
    },
    inputViewMod2:{
        width:"20%",
        backgroundColor:"#4c669f",
        borderRadius:25,
        height:"100%",
        justifyContent:"center",
        padding:"3%",
        marginLeft:"1%",
        alignItems:'center',
        elevation:5
    },
    inputText:{
        //height:50,
        width:"60%",
        height:"100%"
    },
    logo:{
        fontWeight:"bold",
        fontSize:18,
        color:"#fb5b5a",
        marginBottom:"8%",
    },
});

/*if (refresh) {
        return (
            <SafeAreaView style={styles.container}>
                    <View style={styles.searchView}>
                        <View style={styles.drawBtn}>
                            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                <MaterialCommunityIcons
                                    name="menu"
                                    size={35}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{width: "50%", alignItems: 'center'}}>
                            <Image source={logo} style={styles.logoImage}/>
                        </View>
                    </View>
                    <View style={{flex:0.85, alignItems:'center'}}>
                        <Text style={styles.logo}> Insert the Office's Phone Number</Text>
                        <View style={{flexDirection: 'row'}}>
                            <View style = {styles.inputView}>
                                <TextInput
                                    style = {styles.inputText}
                                    placeholder = 'Phone Number'
                                    onChangeText = { text => setPhone(text) }
                                />
                            </View>
                            <TouchableOpacity style={{marginLeft:"2%"}}
                                              onPress = {()=> fetchNumber(phone)}>
                                <MaterialCommunityIcons name="arrow-right-bold-circle" size={35} color="#fb5b5a"/>
                            </TouchableOpacity>
                        </View>
                        <View style={{borderWidth: 2,width:"90%",borderColor:"#fb5b5a",borderRadius: 25}}></View>
                    </View>
            </SafeAreaView>
        )
    } else {
        if (check) {
            const tempOff = createOffice();
          return (
              <SafeAreaView style={styles.container}>
                  <View style={styles.searchView}>
                      <View style={styles.drawBtn}>
                          <TouchableOpacity onPress={() => navigation.openDrawer()}>
                              <MaterialCommunityIcons
                                  name="menu"
                                  size={35}
                                  color="white"
                              />
                          </TouchableOpacity>
                      </View>
                      <View style={{width: "50%", alignItems: 'center'}}>
                          <Image source={logo} style={styles.logoImage}/>
                      </View>
                  </View>
                  <View style={{flex:0.20, alignItems:'center',marginBottom:"10%"}}>
                      <Text style={styles.logo}> Insert the Office's Phone Number</Text>
                      <View style={{flexDirection: 'row'}}>
                          <View style = {styles.inputView}>
                              <TextInput
                                  style = {styles.inputText}
                                  placeholder = 'Phone Number'
                                  onChangeText = { text => setPhone(text) }
                              />
                          </View>
                          <TouchableOpacity style={{marginLeft:"2%"}}
                                            onPress = {()=> fetchNumber(phone)}>
                              <MaterialCommunityIcons name="arrow-right-bold-circle" size={35} color="#fb5b5a"/>
                          </TouchableOpacity>
                      </View>
                      <View style={{borderWidth: 2,width:"90%",borderColor:"#fb5b5a",borderRadius: 25}}></View>
                  </View>
                  <View style={styles.loginBtn}>
                      <Text style={styles.infoFont}>Name: {tempOff.name}</Text>
                  </View>
                  <View style={styles.loginBtn}>
                      <Text style={styles.infoFont}>Phone Number: {tempOff.phoneNumber}</Text>
                  </View>
                  <View style={styles.loginBtn}>
                      <Text style={styles.infoFont}>Address: {tempOff.address}  N°{tempOff.civic}</Text>
                  </View>
                  <View style={styles.loginBtn}>
                      <Text style={styles.infoFont}>City: {tempOff.city} ({tempOff.province})</Text>
                  </View>
                  <View style={styles.loginBtn}>
                      <Text style={styles.infoFont}>CAP: {tempOff.cap}</Text>
                  </View>
                  <View style={styles.loginBtn1}>
                      <TouchableOpacity onPress = {()=> addOffice('userToken',phone)}>
                          <Text style={styles.font}>ADD OFFICE</Text>
                      </TouchableOpacity>
                  </View>
              </SafeAreaView>
          )
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.searchView}>
                        <View style={styles.drawBtn}>
                            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                <MaterialCommunityIcons
                                    name="menu"
                                    size={35}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{width: "50%", alignItems: 'center'}}>
                            <Image source={logo} style={styles.logoImage}/>
                        </View>
                    </View>
                    <View style={{flex:0.2, alignItems:'center',marginBottom:"10%"}}>
                        <Text style={styles.logo}> Insert the Office's Phone Number</Text>
                        <View style={{flexDirection: 'row'}}>
                            <View style = {styles.inputView}>
                                <TextInput
                                    style = {styles.inputText}
                                    placeholder = 'Phone Number'
                                    onChangeText = { text => setPhone(text) }
                                />
                            </View>
                            <TouchableOpacity style={{marginLeft:"2%"}}
                                              onPress = {()=> fetchNumber(phone)}>
                                <MaterialCommunityIcons name="arrow-right-bold-circle" size={35} color="#fb5b5a"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{borderWidth: 2,width:"90%",borderColor:"#fb5b5a",borderRadius: 25,marginLeft:"5.5%"}}></View>
                    <ScrollView style={{flex:0.7}}>
                        <View style = {styles.loginBtn}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Name'
                                onChangeText = { text => setName(text) }
                            />
                        </View>
                        <View style = {styles.inputViewMod}>
                            <View style = {styles.inputViewMod1}>
                                <TextInput
                                    style = {styles.inputText}
                                    placeholder = 'Address'
                                    onChangeText = { text => setAdd(text) }
                                />
                            </View>
                            <View style = {styles.inputViewMod2}>
                                <TextInput
                                    style = {styles.inputText}
                                    placeholder = 'Civic'
                                    onChangeText = { text => setCivic(text) }
                                />
                            </View>
                        </View>
                        <View style = {styles.loginBtn}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'City'
                                onChangeText = { text => setCity(text) }
                            />
                        </View>
                        <View style = {styles.loginBtn}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Province'
                                onChangeText = { text => setProv(text) }
                            />
                        </View>
                        <View style = {styles.loginBtn}>
                            <TextInput
                                style = {styles.inputText}
                                placeholder = 'Cap'
                                onChangeText = { text => setCap(text) }
                            />
                        </View>
                        <View style={styles.loginBtn1}>
                            <TouchableOpacity onPress = {()=> createOff('userToken',phone,name,add,civic,city,prov,cap)}>
                                <Text style={styles.font}>CREATE OFFICE</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            )
        }
    }
}

const styles = StyleSheet.create ({

    container: {
        flex: 1,
        backgroundColor: '#fffff0',
    },
    logo:{
        fontWeight:"bold",
        fontSize:20,
        color:"#fb5b5a",
        marginBottom:"6%",
        marginTop:"5%",
        marginLeft:"3%"
    },
    inputView:{
        width:"50%",
        backgroundColor:"#fff8dc",
        borderRadius:25,
        height:"6%",
        marginBottom:"9%",
        justifyContent:"center",
        padding:"4.7%",
    },
    inputText:{
        height:50,
        color:"black"
    },
    searchView: {
        width: "100%",
        flexDirection: 'row',
        marginTop: "10%",
        flex:0.2
    },
    drawBtn:{
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        alignItems: 'center',
        justifyContent: 'center',
        width: "11%",
        marginLeft: "5%",
        height:"40%",
        marginTop:"5%",
    },
    logoImage: {
        resizeMode:'contain',
        height:"80%",
        marginLeft: "170%",
        borderWidth:1
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#5f9ea0",
        borderRadius:25,
        height:"4%",
        alignItems:"center",
        justifyContent:"center",
        marginTop:"8%",
        marginLeft:"9.5%",
        flex:0.1
    },
    loginBtn1:{
        width:"60%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:"4%",
        alignItems:"center",
        justifyContent:"center",
        marginTop:"8%",
        marginLeft:"19%",
        flex:0.1
    },
    infoFont:{
        fontWeight:"bold",
        fontSize:15,
        color:"black",
        marginLeft:"3%"
    },
    font:{
        fontWeight:"bold",
        fontSize:20,
        color:"#fff8dc",
        marginLeft:"3%"
    },
    inputViewMod:{
        width:"80%",
        height:"4%",
        alignItems:"center",
        justifyContent:"center",
        marginTop:"8%",
        marginLeft:"9.5%",
        flexDirection: 'row',
        flex:0.1
    },
    inputViewMod1:{
        width:"80%",
        backgroundColor:"#5f9ea0",
        borderRadius:25,
        height:"60%",
        justifyContent:"center",
        padding:"4.7%",
    },
    inputViewMod2:{
        width:"20%",
        backgroundColor:"#5f9ea0",
        borderRadius:25,
        height:"60%",
        justifyContent:"center",
        padding:"4.7%",
        marginLeft:"1%",
    },
});*/