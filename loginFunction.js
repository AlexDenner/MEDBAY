import React from 'react';
import { Alert, AsyncStorage } from 'react-native';
import {store} from "./StorageFunctions";


function signInAlert({navigation}) {
    Alert.alert(
        'Username or Password not found!',
        ' ',
        [
            { text: "Try Again", onPress: navigation.push("LogIn") }
        ],
        { cancelable: false }
    );
}

export function loginFunction({navigation},user, email, password) {
    if (user) {
        fetch('http://medbay.altervista.org/authentification/signInP.php', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({

                        user_email: email,
                        user_password: password

                    })
                }).then((response) => response.json())
                    .then((responseJson) => {

                        if(responseJson)
                        {
                            store('user',responseJson);
                            navigation.navigate('UserHome');
                        }
                        else{
                            signInAlert({navigation});
                        }
                    }).catch((error) => {
                    console.error(error);
                });
    } else {
        fetch('http://medbay.altervista.org/authentification/signInM.php', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({

                                doctor_email: email,
                                doctor_password: password

                            })
                        }).then((response) => response.json())
                            .then((responseJson) => {

                                if(responseJson)
                                {
                                    store('user',responseJson);
                                    navigation.navigate('DoctorHome');
                                }
                                else{
                                    signInAlert({navigation});
                                }
                            }).catch((error) => {
                            console.error(error);
                        });
    }
}