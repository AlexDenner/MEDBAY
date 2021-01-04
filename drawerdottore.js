import * as React from 'react';
import {AsyncStorage, Button, Text, TextInput, View, StyleSheet, Alert, Picker} from 'react-native';
import {Avatar, Caption, Title} from "react-native-paper";

export function DrawerDottore() {
    const [isLoading, setLoading] = React.useState(true);
    //const [data, setData] = React.useState([]);
    const [name, setName] = React.useState('');
    const [surname, setSurname] = React.useState('');
    const [email, setEmail] = React.useState('');
    //let data;

    const getData = async () => {
        let value;
        try {
            value = await AsyncStorage.getItem('userToken');
            if (value !== null) {
                fetch('http://medbay.altervista.org/DoctorProfiling/profiloM.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: value,
                    })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        //Extract(responseJson)
                        //console.log(responseJson[0].name)
                        //const obj = responseJson[0]
                        setName(responseJson['name'])
                        setSurname(responseJson['surname'])
                        setEmail(responseJson['email'])
                    }).catch((error) => {
                    console.error(error);
                }).finally(() => setLoading(false));
            }
        } catch (err) {
            console.log(err);
        }
    }

    if(isLoading){
        getData()
    }


    return (
        <View style={styles.drawerContent}>
            <View style={styles.userInfoSection}>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                    <Avatar.Image
                        source={{
                            uri: 'https://e7.pngegg.com/pngimages/247/564/png-clipart-computer-icons-user-profile-user-avatar-blue-heroes.png'
                        }}
                        size={70}
                    />
                    <View style={{marginLeft: 15, flexDirection: 'column'}}>
                        <Title style={styles.title}>{name} {surname}</Title>
                        <Caption style={styles.caption}>{email}</Caption>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#ff6',
        borderRadius: 10,
        marginTop: 16,
        paddingVertical: 8,
        borderWidth: 4,
        borderColor: "#20232a",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold"
    },
    quadrato: {
        flexDirection: "row",
        //alignItems: 'center',
    },
    form: {
        //justifyContent: 'center',
        alignItems: 'center',
    },
    cerchio: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        alignItems: 'center',
        //justifyContent:'center',
        width: 100,
        height: 100,
        backgroundColor: '#fff',
        borderRadius: 50,
    },
    MainContainer: {
        justifyContent: 'center',
        flex: 1,
        margin: 10,
    },

    TextInputStyleClass: {

        textAlign: 'center',
        marginBottom: 7,
        height: 40,
        borderWidth: 1,
        borderColor: '#2196F3',
        borderRadius: 5,
    },
    TextComponentStyle: {
        fontSize: 20,
        color: "#000",
        textAlign: 'center',
        marginBottom: 15,
    },
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});