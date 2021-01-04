import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Button,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    TouchableHighlight, Modal
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {LinearGradient} from "expo-linear-gradient";
import {Entypo, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";

export function ScannerScreen({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [type,setType] = useState(null);
    const [data,setData] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setType(type);
        setData(data);
    };

    if (hasPermission === null) {
        return <Text>Accesso alla fotocamera richiesto</Text>;
    }
    if (hasPermission === false) {
        return <Text>Nessun accesso alla fotocamera</Text>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.upperView}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={['rgba(0,1,1,0.6)', 'transparent']}
                    style={styles.background}
                />
                <Text style={{marginBottom:"5%",marginRight:"40%",fontWeight:'bold',fontSize:30,color:'#fb5b5a'}}>QR SCANNER</Text>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={styles.camera}
                />
                <View style={{flexDirection: 'row',width:"85%",height:"10%",justifyContent:'space-between',alignItems:'center'}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={scanned}>
                <SafeAreaView style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
                    <SafeAreaView style={styles.scannedView}>
                        <Text>Il codice {type}  {data} è stato scannerizzato!</Text>
                        <TouchableOpacity style={styles.repeat}
                        onPress={() => setScanned(false)}>
                            <Text style={{fontWeight:'bold',color:'white',fontSize:17}}>Repeat Scan</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </SafeAreaView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //flexDirection: 'column',
        //justifyContent: 'center',
        alignItems:'center'
    },
    scannedView: {
        width: "90%",
        height:"80%",
        //flexDirection: 'column',
        //justifyContent: 'center',
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: '#f5fffa',
        elevation:8,
        borderRadius: 40,
    },
    camera: {
        height:"75%",
        width:"95%",
    },
    upperView: {
        backgroundColor:'#4c669f',
        //height:430,
        height: "96%",
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
    repeat: {
        width:"40%",
        height: "8%",
        backgroundColor:'#fb5b5a',
        borderRadius: 30,
        elevation:5,
        alignItems:'center',
        justifyContent:'center'
    },
});