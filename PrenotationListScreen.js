import React, { useState, useEffect } from "react";
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    AsyncStorage, ActivityIndicator, Alert
} from "react-native";
import {FontAwesome5, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import {LinearGradient} from "expo-linear-gradient";
import { Feather } from '@expo/vector-icons';
import {useIsFocused} from "@react-navigation/native";

const Item = ({ item, onPress}) => (
    <TouchableOpacity onPress={onPress} style={styles.inputView}>
        <Text style={styles.title}>{item.name}  {item.date}</Text>
        <Feather name="edit-2" size={24} color="black" />
    </TouchableOpacity>
);

export function PrenotationListScreen({navigation}) {
    const [selectedId, setSelectedId] = useState(null);
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [refresh,setRefresh]= useState(true);
    const isFocused = useIsFocused();


    const prenotations = async(key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            fetch('http://medbay.altervista.org/Booking/visite.php', {
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
                    setFilteredDataSource(responseJson);
                })
                .catch((error) => {
                    console.error(error);
                }).finally(()=> setRefresh(false))
        } catch (error) {}
    }

    const renderItem = ({item}) => {
        return (
            <ScrollView>
                <TouchableOpacity onPress={()=> navigation.navigate('PrenotationInfo',{pren : item})} style={styles.inputView}>
                    <Text style={styles.title}>{item.name}  {item.date}</Text>
                    <Feather name="edit-2" size={20} color="black" style={{marginRight: "2%"}} />
                </TouchableOpacity>
            </ScrollView>
        );
    };

    useEffect(()=> {
        setRefresh(true)
    },[isFocused])

    if(refresh){
        prenotations('userToken')
        return(
            <View style={styles.containerLoad}>
                <ActivityIndicator
                    size="large"
                    color="#fb5b5a"
                />
            </View>
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
                    <View style={{flexDirection: 'row',width:"85%",height:"20%",justifyContent:'space-between'}}>
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <MaterialCommunityIcons
                                name="menu"
                                size={38}
                                color="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => setModalVisible(true)}>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.flatView}>
                    <LinearGradient
                        // Background Linear Gradient
                        colors={['rgba(0,1,1,0.6)', 'transparent']}
                        style={styles.background1}
                    />
                    <FlatList
                        data={filteredDataSource}
                        renderItem={renderItem}
                        keyExtractor={(item,index) => index.toString()}
                        extraData={selectedId}
                        refreshing={refresh}
                        onRefresh={() => setRefresh(true)}
                    />
                </View>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#fffff0',
        //alignItems: 'center',
        //justifyContent: 'center'
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
    flatView:{
        width:"90%",
        backgroundColor:"#4c669f",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        height:"66%",
        //marginTop:"8%",
        //justifyContent:"center",
        elevation: 4
        //flex: 0.8,
    },
    logo: {
        fontWeight: "bold",
        fontSize: 30,
        color: "#fb5b5a",
        marginBottom: "22%",
        margin: "3%"
    },
    inputView: {
        width: "95%",
        height:50,
        backgroundColor: "#f5fffa",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        marginTop: "5%",
        justifyContent: "space-between",
        alignItems:'center',
        padding:"2%",
        elevation:5,
        flexDirection:'row',
    },
    item: {
        padding: "6%",
        borderRadius: 25,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    containerLoad: {
        flex: 1,
        //marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

