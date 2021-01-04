import { StatusBar } from 'expo-status-bar';
import React, {useState,useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    AsyncStorage, SafeAreaView, ScrollView, TouchableHighlight, Modal, Alert
} from 'react-native';
import {Entypo, FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import {MedicalOffice} from "./MedicalOffice";
import {Doctor} from "./Doctor";
import { CalendarList } from "react-native-calendars";
import {LocaleConfig} from 'react-native-calendars';
import {LinearGradient} from "expo-linear-gradient";
import {useIsFocused} from "@react-navigation/native";

LocaleConfig.locales['en'] = {
    dayNames: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    dayNamesShort: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
}

export function DoctorHome({navigation}) {
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [office, setOffice] = useState([]);
    const [refresh,setRefresh]= useState(true);
    const [studio,setStudio]= useState(true);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [city, setCity] = useState(null);
    const [prov, setProv] = useState(null);
    const [via, setVia] = useState(null);
    const [civic, setCivic] = useState(null);
    const [cap, setCap] = useState(null);
    const [name, setName] = useState(null);
    const [phone, setPhone] = useState(null);
    //const [date, setDate] = useState('09-10-2020');
    const [studioP,setStudioP]= useState(false);
    const isFocused = useIsFocused();

    React.useEffect(() => {
        setRefresh(true)
    }, [isFocused]);

    function createButtonAlert() {
        Alert.alert(
            'Edit!',
            ' ',
            [
                { text: "OK", onPress: setRefresh(true) }
            ],
            { cancelable: false }
        );
    }

    function createButtonAlert1() {
        Alert.alert(
            'Error!',
            ' ',
            [
                { text: "Try Again"}
            ],
            { cancelable: false }
        );
    }

    function editOffice(value) {
        fetch('http://medbay.altervista.org/editOffice.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tel: value,
                new_tel:phone,
                new_city:city,
                new_name:name,
                new_prov:prov,
                new_via:via,
                new_civic:civic,
                new_cap:cap
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                switch(responseJson) {
                    case 0: {
                        createButtonAlert();
                        break;
                    }
                    case 1: {
                        Alert.alert('Phone Number already used!');
                        break;
                    }
                    case 2: {
                        createButtonAlert1();
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            }).finally(()=> setModalVisible(false))
    }
    const run = async(key) => {
        try{
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                fetch('http://medbay.altervista.org/DoctorProfiling/profiloM.php', {
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
            }

            fetch('http://medbay.altervista.org/OfficeManagement/searchStudioAssoc.php', {
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
                    if (responseJson) {
                        setOffice(responseJson);
                    }
                    else {
                        setStudio(false)
                    }
                })
                .catch((error) => {
                    console.error(error);
                }).finally(()=> setRefresh(false))
        } catch (error) {}
    };

    /*function searchOffice(doctor_email) {
        fetch('http://medbay.altervista.org/OfficeManagement/searchStudioAssoc.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: doctor_email
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson) {
                    setOffice(responseJson);
                }
                else {
                    setStudio()
                }
            })
            .catch((error) => {
                console.error(error);
            }).finally()
    };*/

    function createDoctor() {
        const doctor = new Doctor();
        doctor.setName(filteredDataSource['name']);
        doctor.setEmail(filteredDataSource['email']);
        doctor.setSurname(filteredDataSource['surname']);
        doctor.setPhone(filteredDataSource['phone']);
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

    if(refresh){
        run('userToken')
        return(
            <View style={styles.containerLoad}>
                <ActivityIndicator
                    size="large"
                    color="#fb5b5a"
                />
            </View>
        )
    } else {
        const tempDoc = createDoctor();
        if (!studio) {
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
                            <TouchableOpacity onPress={() => navigation.navigate('Scanner')}>
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
                        <Text style={styles.logo}>{tempDoc.name}  {tempDoc.surname}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userBtn1}
                                      onPress={() => navigation.navigate('CreateOffice')}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background}
                        />
                            <MaterialCommunityIcons name="office-building" size={200} color="white" style={{marginTop:"6%"}}/>
                            <View style={{width:"50%",justifyContent:'center'}}>
                                <Text style={styles.logo1}>+ ADD A MEDICAL OFFICE</Text>
                            </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.prenBtn}>
                        <CalendarList
                            onVisibleMonthsChange={(months) => {
                                console.log('now these months are visible', months);
                            }}
                            pastScrollRange={50}
                            futureScrollRange={50}
                            scrollEnabled={true}
                            showScrollIndicator={false}
                            maxDate={'01-01-2100'}
                            //onDayPress={(day) => {console.log('selected day', day)}}
                            style={{
                                height: "100%",
                                //marginTop:"2%",
                                width:"100%",
                                //marginLeft:"4%"
                            }}
                            theme={{
                                backgroundColor: '#fb5b5a',
                                calendarBackground: '#fb5b5a',
                                textSectionTitleColor: '#fff8dc',
                                textSectionTitleDisabledColor: '#d9e1e8',
                                selectedDayBackgroundColor: '#0000ff',
                                selectedDayTextColor: '#0000ff',
                                todayTextColor: '#0000ff',
                                dayTextColor: '#fff8dc',
                                textDisabledColor: '#fff8dc',
                                dotColor: '#fffff0',
                                selectedDotColor: '#fffff0',
                                arrowColor: 'orange',
                                disabledArrowColor: '#fffff0',
                                monthTextColor: 'white',
                                indicatorColor: 'black',
                                textDayFontFamily: 'monospace',
                                textMonthFontFamily: 'monospace',
                                textDayHeaderFontFamily: 'monospace',
                                textDayFontWeight: 'bold',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: 'bold',
                                textDayFontSize: 15,
                                textMonthFontSize: 15,
                                textDayHeaderFontSize: 15,
                                borderRadius: 25
                            }}
                        />
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background1}
                        />
                    </TouchableOpacity>
                </SafeAreaView>
            );
        } else {
            const tempOff=createOffice();
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.upperView}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background}
                        />
                        <Text style={{marginBottom:"28%",marginRight:"40%",fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>YOUR MEDBAY</Text>
                        <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between',alignItems:'center'}}>
                            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                <MaterialCommunityIcons
                                    name="menu"
                                    size={38}
                                    color="white"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Scanner')}>
                                <MaterialCommunityIcons name="qrcode-scan" size={30} color="#fb5b5a" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.nameView}
                                      onPress={()=>navigation.navigate('Info')}>
                        <Text style={styles.logo}>{tempDoc.name}  {tempDoc.surname}</Text>
                    </TouchableOpacity>
                    <View style={styles.userBtn}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background}
                        />
                        <TouchableOpacity onPress={()=> setModalVisible(true)}>
                            <Text style={{
                                fontWeight: "bold",
                                fontSize: 30,
                                color: "#fff8dc",
                                marginTop: "8%",
                                marginLeft: "2%"
                            }}>Office Name: {tempOff.name}</Text>
                            <Text style={{
                                fontWeight: "bold",
                                fontSize: 15,
                                color: "#fff8dc",
                                marginTop: "5%",
                                marginLeft: "2%"
                            }}>Address: {tempOff.address} N°{tempOff.civic}</Text>
                            <Text style={{
                                fontWeight: "bold",
                                fontSize: 15,
                                color: "#fff8dc",
                                marginTop: "5%",
                                marginLeft: "2%"
                            }}>City: {tempOff.city} ({tempOff.province})</Text>
                            <Text style={{
                                fontWeight: "bold",
                                fontSize: 15,
                                color: "#fff8dc",
                                marginTop: "5%",
                                marginLeft: "2%"
                            }}>Phone Number: {tempOff.phoneNumber}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.prenBtn}>
                        <CalendarList
                            onVisibleMonthsChange={(months) => {
                                console.log('now these months are visible', months);
                            }}
                            pastScrollRange={50}
                            futureScrollRange={50}
                            scrollEnabled={true}
                            showScrollIndicator={false}
                            maxDate={'01-01-2100'}
                            //onDayPress={(day) => {console.log('selected day', day)}}
                            style={{
                                height: "100%",
                                //marginTop:"2%",
                                width:"100%",
                                //marginLeft:"4%"
                            }}
                            theme={{
                                backgroundColor: '#fb5b5a',
                                calendarBackground: '#fb5b5a',
                                textSectionTitleColor: '#fff8dc',
                                textSectionTitleDisabledColor: '#d9e1e8',
                                selectedDayBackgroundColor: '#0000ff',
                                selectedDayTextColor: '#0000ff',
                                todayTextColor: '#0000ff',
                                dayTextColor: '#fff8dc',
                                textDisabledColor: '#fff8dc',
                                dotColor: '#fffff0',
                                selectedDotColor: '#fffff0',
                                arrowColor: 'orange',
                                disabledArrowColor: '#fffff0',
                                monthTextColor: 'white',
                                indicatorColor: 'black',
                                textDayFontFamily: 'monospace',
                                textMonthFontFamily: 'monospace',
                                textDayHeaderFontFamily: 'monospace',
                                textDayFontWeight: 'bold',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: 'bold',
                                textDayFontSize: 15,
                                textMonthFontSize: 15,
                                textDayHeaderFontSize: 15,
                                borderRadius: 25
                            }}
                        />
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgba(0,1,1,0.6)', 'transparent']}
                            style={styles.background1}
                        />
                    </TouchableOpacity>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}>
                        <SafeAreaView style={{backgroundColor:'#fffff0',borderRadius:45,height:655,borderWidth:4,borderColor:'#4c669f',marginHorizontal:10,marginTop:"5%",elevation:8}}>
                            <View style={{marginTop:20,marginBottom:"3%"}}>
                                <Text style = {styles.logo2}>Edit Your Office</Text>
                            </View>
                            <View style={{height:"100%"}}>
                                <View style = {styles.inputView1}>
                                    <TextInput
                                        style = {styles.inputText}
                                        placeholder = 'Name'
                                        onChangeText = { text => setName(text) }
                                    />
                                </View>
                                <View style = {styles.inputView1}>
                                    <TextInput
                                        style = {styles.inputText}
                                        placeholder = 'Telephone'
                                        onChangeText = { text => setPhone(text) }
                                    />
                                </View>
                                <View style = {styles.inputView1}>
                                    <TextInput
                                        style = {styles.inputText}
                                        placeholder = 'City'
                                        onChangeText = { text => setCity(text) }
                                    />
                                </View>
                                <View style = {styles.inputView1}>
                                    <TextInput
                                        style = {styles.inputText}
                                        placeholder = 'Region/Province'
                                        onChangeText = { text => setProv(text) }
                                    />
                                </View>
                                <View style = {styles.inputViewMod}>
                                    <View style = {styles.inputViewMod1}>
                                        <TextInput
                                            style = {styles.inputText}
                                            placeholder = 'Via'
                                            onChangeText = { text => setVia(text) }
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
                                <View style = {styles.inputView1}>
                                    <TextInput
                                        style = {styles.inputText}
                                        placeholder = 'CAP'
                                        onChangeText = { text => setCap(text) }
                                    />
                                </View>
                                <TouchableHighlight
                                    onPress={() => {
                                        editOffice(tempOff.phoneNumber);
                                    }}
                                    style={styles.inputView2}>
                                    <Text style={{fontWeight:'bold',fontSize:20,color:'#fffff0'}}>Edit</Text>
                                </TouchableHighlight>
                                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}
                                style={{alignItems:'flex-end', width:"95%"}}>
                                    <Entypo name="circle-with-cross" size={30} color="#4c669f" />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Modal>
                </SafeAreaView>
            );
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
        height: "30%",
        width:"100%",
        borderBottomStartRadius:40,
        borderBottomEndRadius:40,
        alignItems:'center',
        justifyContent:'flex-end',
        marginBottom:"4%",
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
        fontSize:27,
        color:"#fb5b5a",
        //marginBottom:"10%",
        margin: "3%"
    },
    userBtn:{
        width:"90%",
        backgroundColor:"#4c669f",
        borderRadius:25,
        marginTop:"5%",
        //marginBottom:"4%",
        elevation:6,
        height: "25%",
        padding:"2%"
    },
    userBtn1:{
        width:"90%",
        backgroundColor:"#4c669f",
        borderRadius:25,
        marginTop:"5%",
        flexDirection: 'row',
        //marginBottom:"4%",
        elevation:6,
        height: "25%",
        //padding:"2%",
        justifyContent:'space-between',
        alignItems:'center',
    },
    prenBtn:{
        width:"90%",
        backgroundColor:"#fb5b5a",
        //borderRadius:25,
        borderTopStartRadius:40,
        borderTopEndRadius:40,
        marginRight: "1%",
        height:"33%",
        padding: "2%",
        elevation:3,
        alignItems:'center',
        justifyContent:'center',
        marginTop:"4%"
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
    logo1: {
        fontWeight: "bold",
        fontSize: 30,
        color: "#f5fffa",
        marginTop:"7%"
    },
    logo2: {
        fontWeight: "bold",
        fontSize: 40,
        color: "#fb5b5a",
        marginTop:"2%",
        marginLeft: "8%"
    },
    inputView1:{
        width:"80%",
        backgroundColor:"#4c669f",
        borderRadius:25,
        height:"3%",
        marginBottom:"9%",
        justifyContent:"center",
        padding:"4.7%",
        marginLeft:"9.5%"
    },
    inputView2:{
        width:"30%",
        backgroundColor:"#fb5b5a",
        borderRadius:25,
        height:"6%",
        marginBottom:"9%",
        justifyContent:"center",
        alignItems:'center',
        padding:"4%",
        marginLeft:"9.5%"
    },
    inputViewMod:{
        height:"6%",
        width: "80%",
        flexDirection: 'row',
        marginBottom:"9%",
        marginLeft: "9.5%"
    },
    inputViewMod1:{
        width:"80%",
        backgroundColor:"#4c669f",
        borderRadius:25,
        height:"100%",
        //marginBottom:"8%",
        justifyContent:"center",
        padding:"4.7%",
    },
    inputViewMod2:{
        width:"19%",
        backgroundColor:"#4c669f",
        borderRadius:25,
        height:"100%",
        //marginBottom:"6%",
        justifyContent:"center",
        padding:"4.7%",
        marginLeft:"1%",
    },
    inputText: {
        height: 20,
        color: "#fffaf0"
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
</View>
<View style={styles.nameView}>
    <Text style={styles.logo}>{tempDoc.name} {tempDoc.surname}</Text>
</View>
<View style={styles.userBtn}>
    <TouchableOpacity style={{flexDirection:'row'}}
                      onPress={() => navigation.navigate('CreateOffice')}>
        <MaterialCommunityIcons name="office-building" size={200} color="#8b0000" style={{marginTop:"6%"}}/>
        <View style={{width:"50%",justifyContent:'center'}}>
            <Text style={styles.logo1}>+ ADD A MEDICAL OFFICE</Text>
        </View>
    </TouchableOpacity>
</View>
<View style={styles.userBtn1}>
    <CalendarList
        onVisibleMonthsChange={(months) => {
            console.log('now these months are visible', months);
        }}
        pastScrollRange={50}
        futureScrollRange={50}
        scrollEnabled={false}
        showScrollIndicator={false}
        maxDate={'01-01-2100'}
        //onDayPress={(day) => {console.log('selected day', day)}}
        style={{
            height: "90%",
            marginTop:"2%",
            width:"90%",
            marginLeft:"4%"
        }}
        theme={{
            backgroundColor: '#5f9ea0',
            calendarBackground: '#5f9ea0',
            textSectionTitleColor: '#fff8dc',
            textSectionTitleDisabledColor: '#d9e1e8',
            selectedDayBackgroundColor: '#0000ff',
            selectedDayTextColor: '#0000ff',
            todayTextColor: '#0000ff',
            dayTextColor: '#fff8dc',
            textDisabledColor: '#fff8dc',
            dotColor: '#fffff0',
            selectedDotColor: '#fffff0',
            arrowColor: 'orange',
            disabledArrowColor: '#fffff0',
            monthTextColor: '#800000',
            indicatorColor: 'black',
            textDayFontFamily: 'monospace',
            textMonthFontFamily: 'monospace',
            textDayHeaderFontFamily: 'monospace',
            textDayFontWeight: 'bold',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: 'bold',
            textDayFontSize: 15,
            textMonthFontSize: 15,
            textDayHeaderFontSize: 15,
            borderRadius: 25
        }}
    />
</View>

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
                    </View>
                    <View style={styles.nameView}>
                        <Text style={styles.logo}>{tempDoc.name} {tempDoc.surname}</Text>
                    </View>
                    <View style={styles.userBtn}>
                        <TouchableOpacity onPress={()=> setModalVisible(true)}>
                            <Text style={{
                                fontWeight: "bold",
                                fontSize: 30,
                                color: "#fff8dc",
                                marginTop: "8%",
                                marginLeft: "2%"
                            }}>Office Name: {tempOff.name}</Text>
                            <Text style={{
                                fontWeight: "bold",
                                fontSize: 15,
                                color: "#fff8dc",
                                marginTop: "5%",
                                marginLeft: "2%"
                            }}>Address: {tempOff.address} N°{tempOff.civic}</Text>
                            <Text style={{
                                fontWeight: "bold",
                                fontSize: 15,
                                color: "#fff8dc",
                                marginTop: "5%",
                                marginLeft: "2%"
                            }}>City: {tempOff.city} ({tempOff.province})</Text>
                            <Text style={{
                                fontWeight: "bold",
                                fontSize: 15,
                                color: "#fff8dc",
                                marginTop: "5%",
                                marginLeft: "2%"
                            }}>Phone Number: {tempOff.phoneNumber}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.userBtn1}>
                            <CalendarList
                                onVisibleMonthsChange={(months) => {
                                    console.log('now these months are visible', months);
                                }}
                                pastScrollRange={50}
                                futureScrollRange={50}
                                scrollEnabled={false}
                                showScrollIndicator={false}
                                maxDate={'01-01-2100'}
                                //onDayPress={(day) => {console.log('selected day', day)}}
                                style={{
                                    height: "95%",
                                    //marginTop:"2%",
                                    width:"90%",
                                    marginLeft:"4%"
                                }}
                                theme={{
                                    backgroundColor: '#5f9ea0',
                                    calendarBackground: '#5f9ea0',
                                    textSectionTitleColor: '#fff8dc',
                                    textSectionTitleDisabledColor: '#d9e1e8',
                                    selectedDayBackgroundColor: '#0000ff',
                                    selectedDayTextColor: '#0000ff',
                                    todayTextColor: '#0000ff',
                                    dayTextColor: '#fff8dc',
                                    textDisabledColor: '#fff8dc',
                                    dotColor: '#fffff0',
                                    selectedDotColor: '#fffff0',
                                    arrowColor: 'orange',
                                    disabledArrowColor: '#fffff0',
                                    monthTextColor: '#800000',
                                    indicatorColor: 'black',
                                    textDayFontFamily: 'monospace',
                                    textMonthFontFamily: 'monospace',
                                    textDayHeaderFontFamily: 'monospace',
                                    textDayFontWeight: 'bold',
                                    textMonthFontWeight: 'bold',
                                    textDayHeaderFontWeight: 'bold',
                                    textDayFontSize: 15,
                                    textMonthFontSize: 15,
                                    textDayHeaderFontSize: 15,
                                    borderRadius: 25
                                }}

                            />
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}>
                        <SafeAreaView style={{backgroundColor:'#5f9ea0',borderRadius:45,flex:0.9,borderWidth:4,borderColor:'#800000',marginHorizontal:10,marginTop:"5%"}}>
                            <View style={{marginTop:40,marginLeft:"2%",marginBottom:"2%"}}>
                                <Text style = {styles.logo1}>Edit Your Office</Text>
                            </View>
                            <ScrollView>
                                <View style = {styles.inputView1}>
                                    <TextInput
                                        style = {styles.inputText}
                                        placeholder = 'Name'
                                        onChangeText = { text => setName(text) }
                                    />
                                </View>
                                <View style = {styles.inputView1}>
                                    <TextInput
                                        style = {styles.inputText}
                                        placeholder = 'Telephone'
                                        onChangeText = { text => setPhone(text) }
                                    />
                                </View>
                                <View style = {styles.inputView1}>
                                    <TextInput
                                        style = {styles.inputText}
                                        placeholder = 'City'
                                        onChangeText = { text => setCity(text) }
                                    />
                                </View>
                                <View style = {styles.inputView1}>
                                    <TextInput
                                        style = {styles.inputText}
                                        placeholder = 'Region/Province'
                                        onChangeText = { text => setProv(text) }
                                    />
                                </View>
                                <View style = {styles.inputViewMod}>
                                    <View style = {styles.inputViewMod1}>
                                        <TextInput
                                            style = {styles.inputText}
                                            placeholder = 'Via'
                                            onChangeText = { text => setVia(text) }
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
                                <View style = {styles.inputView1}>
                                    <TextInput
                                        style = {styles.inputText}
                                        placeholder = 'CAP'
                                        onChangeText = { text => setCap(text) }
                                    />
                                </View>
                                <TouchableHighlight
                                    onPress={() => {
                                        editOffice(tempOff.phoneNumber);
                                    }}
                                    style={styles.inputView2}>
                                    <Text style={{fontWeight:'bold',fontSize:20,color:'#fffff0'}}>Edit</Text>
                                </TouchableHighlight>
                            </ScrollView>
                        </SafeAreaView>
                    </Modal>

                    container: {
        flex: 1,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchView: {
        width: "100%",
        height: "10%",
        flexDirection: 'row',
        flex: 0.15,
    },
    nameView: {
        flexDirection: 'row',
        width: "100%",
        height: "10%",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.1,
    },
    logo: {
        fontWeight: "bold",
        fontSize: 30,
        color: "#fb5b5a",
        marginBottom: "10%",
        margin: "3%"
    },
    logo1: {
        fontWeight: "bold",
        fontSize: 30,
        color: "#8b0000",
        marginTop:"7%"
    },
    prenData1: {
        fontWeight: "bold",
        fontSize: 70,
        color: "#fff8dc",
        marginBottom: "20%",
        margin: "3%"
    },
    prenData2: {
        fontSize: 20,
        color: "#fff8dc",
        marginBottom: "20%",
        margin: "3%"
    },
    inputView: {
        width: "74%",
        backgroundColor: "#fff8dc",
        borderRadius: 25,
        height: "50%",
        justifyContent: "center",
        padding: "5%",
        marginLeft: "3%",
    },
    inputText: {
        height: 20,
        color: "black"
    },
    loginBtn: {
        width: "70%",
        backgroundColor: "#4169e1",
        borderRadius: 25,
        height: "30%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "4%",
        marginBottom: "4%",
        borderWidth: 5,
        borderColor: '#fb5b5a'
    },
    userBtn: {
        width: "90%",
        backgroundColor: "#5f9ea0",
        borderRadius: 25,
        marginTop: "4%",
        marginBottom: "4%",
        flex: 0.25,
        elevation:6
    },
    userBtn1: {
        width: "90%",
        backgroundColor: "#5f9ea0",
        borderRadius: 25,
        marginTop: "4%",
        marginBottom: "4%",
        flex: 0.45,
        justifyContent:'center',
        //alignItems:'center',
        elevation:6
    },
    prenBtn1: {
        width: "45%",
        backgroundColor: "#5f9ea0",
        borderRadius: 25,
        borderWidth: 4,
        borderColor: '#fb5b5a',
        marginRight: "1%",
        height: "80%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    prenBtn2: {
        width: "45%",
        backgroundColor: "#5f9ea0",
        borderRadius: 25,
        borderWidth: 4,
        borderColor: '#fb5b5a',
        height: "80%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    drawBtn: {
        width: "11%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: "35%",
        marginTop: "10%",
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: "5%"
    },
    loginText: {
        color: "white",
        fontWeight: "bold"
    },
    prenText: {
        color: "black",
        fontWeight: "bold",
        textAlign: 'center',
        marginTop: "5%"
    },
    logoImage: {
        width: "60%",
        height: "50%",
    },
    inputView1:{
        width:"80%",
        backgroundColor:"#fffff0",
        borderRadius:25,
        height:"3%",
        marginBottom:"9%",
        justifyContent:"center",
        padding:"4.7%",
        marginLeft:"9.5%"
    },
    inputView2:{
        width:"30%",
        backgroundColor:"#800000",
        borderRadius:25,
        height:"6%",
        marginBottom:"9%",
        justifyContent:"center",
        alignItems:'center',
        padding:"4%",
        marginLeft:"9.5%"
    },
    inputViewMod:{
        height:"2%",
        flexDirection: 'row',
        marginBottom:"12%",
    },
    inputViewMod1:{
        width:"60%",
        backgroundColor:"#fffff0",
        borderRadius:25,
        height:"2%",
        marginBottom:"8%",
        justifyContent:"center",
        padding:"4.7%",
        marginLeft:"9.5%",
    },
    inputViewMod2:{
        width:"19%",
        backgroundColor:"#fffff0",
        borderRadius:25,
        height:"2%",
        marginBottom:"6%",
        justifyContent:"center",
        padding:"4.7%",
        marginLeft:"1%",
    },
    */