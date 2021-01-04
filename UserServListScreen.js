import React, { useState,useEffect } from "react";
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
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import {useIsFocused} from "@react-navigation/native";
import {LinearGradient} from "expo-linear-gradient";

const Item = ({ item, onPress}) => (
    <TouchableOpacity onPress={onPress} style={styles.inputView}>
        <Text style={styles.title}>{item.name}  {item.date}</Text>
    </TouchableOpacity>
);

export function UserServListScreen({navigation,route}) {
    const [selectedId, setSelectedId] = useState(null);
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [refresh,setRefresh]= useState(true);
    const isFocused = useIsFocused();
    const {email} = route.params;


    const services = async(key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            fetch('http://medbay.altervista.org/DoctorProfiling/searchPrestAssoc.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
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
                <View style={styles.renderView}>
                    <TouchableOpacity onPress={()=> navigation.navigate('ServiceInfo',{service : item})} style={styles.inputView}>
                        <Text style={styles.title}>{item.name}  {item.costo}€</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bookView}
                                      onPress={()=>navigation.navigate('Book',{id : item.id})}>
                        <MaterialCommunityIcons name="book" size={24} color="#f5fffa" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };

    /*useEffect(()=> {
        setRefresh(true)
    },[isFocused])*/

    if(refresh){
        services('userToken')
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
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <MaterialIcons name="arrow-back" size={30} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={ () => navigation.navigate('Home')}>
                            <AntDesign name="home" size={30} color="white" />
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
                        refreshing={refresh}
                        onRefresh={() => setRefresh(true)}
                        extraData={selectedId}
                    />
                </View>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        //marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#fffff0',
        //alignItems: 'center',
        //justifyContent: 'center',
        flex:1
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
        //padding:"3%",
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
        width: "80%",
        height:50,
        backgroundColor: "#f5fffa",
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: "4%",
        justifyContent: "center",
        padding:"2%",
        elevation:6
    },
    item: {
        padding: "6%",
        borderRadius: 25,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    bookView: {
        width: "13%",
        height:50,
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        marginBottom: "3%",
        justifyContent: "center",
        alignItems:'center',
        marginLeft: "2%",
        elevation:6
    },
    renderView: {
        flexDirection:'row',
        height:50,
        width:"100%",
        marginTop:"7%"
    },
    containerLoad: {
        flex: 1,
        //marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#fffff0',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

/*<SafeAreaView style={styles.container}>
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
        <Text style={styles.logo}>Services</Text>
    </View>
    <View style={{ width: "100%", height: "60%", marginLeft: "10%"}}>
        <FlatList
            data={filteredDataSource}
            renderItem={renderItem}
            keyExtractor={(item,index) => index.toString()}
            refreshing={refresh}
            onRefresh={() => setRefresh(true)}
            extraData={selectedId}
        />
    </View>
</SafeAreaView>

renderView: {
        flexDirection:'row',
        height:50,
        width:"100%",
        marginBottom:"2%"
    },
    plusButton:{
        width:"20%",
        backgroundColor:"#fb5b5a",
        borderRadius:58,
        height:"30%",
        alignItems:"center",
        justifyContent:"center",
        position:'absolute',
    },
    searchView: {
        width: "100%",
        height: "15%",
        //flexDirection: 'row',
        //justifyContent: 'center',
        //borderWidth:1
    },
    nameView: {
        flexDirection: 'row',
        width: "100%",
        height: "10%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontWeight: "bold",
        fontSize: 30,
        color: "#fb5b5a",
        marginBottom: "30%",
        //margin: "3%"
    },
    inputView: {
        width: "70%",
        height:50,
        backgroundColor: "#5f9ea0",
        borderRadius: 25,
        marginBottom: "3%",
        justifyContent: "center",
        padding:"2%",
        elevation:6
    },
    bookView: {
        width: "13%",
        height:50,
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        marginBottom: "3%",
        justifyContent: "center",
        alignItems:'center',
        marginLeft: "2%",
        elevation:6
    },
    drawBtn: {
        width: "11%",
        backgroundColor: "#fb5b5a",
        borderRadius: 35,
        height: "35%",
        //marginRight: "70%",
        marginLeft:"5%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    item: {
        padding: "6%",
        borderRadius: 25,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },*/