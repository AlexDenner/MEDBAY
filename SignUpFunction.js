import React from 'react';
import { Alert } from 'react-native';

export function SignUpFunction({navigation},usBit,email,name,surname,date,passwd,fc,city,prov,via,civic,cap,phone,type,spec) {

    function createButtonAlert() {
        Alert.alert(
            'Registered!',
            ' ',
            [
                { text: "OK", onPress: navigation.navigate("LogIn") }
            ],
            { cancelable: false }
        );
    }

    function createButtonAlert1(usBit) {
        if (usBit) {
            Alert.alert(
                'Error! Registration not done',
                ' ',
                [
                    { text: "Try Again", onPress: navigation.push("SignUp") }
                ],
                { cancelable: false }
            );
        }
        else {
            Alert.alert(
                'Error! Registration not done',
                ' ',
                [
                    { text: "Try Again", onPress: navigation.push("SignUpMO") }
                ],
                { cancelable: false }
            );
        }
    }

    function fieldCheck(usBit) {
        if (usBit) {
            Alert.alert(
                'Error! Fill all the requested field',
                ' ',
                [
                    { text: "Try Again", onPress: navigation.push("SignUp") }
                ],
                { cancelable: false }
            );
        }
        else {
            Alert.alert(
                'Error! Fill all the requested field',
                ' ',
                [
                    { text: "Try Again", onPress: navigation.push("SignUpMO") }
                ],
                { cancelable: false }
            );
        }
    }


    if (usBit) {
        if (email!=null && name!= null && surname!=null && date!=null && passwd!=null && fc!=null && city!=null && prov!=null && via!=null && civic!=null && cap!=null) {
            fetch('http://medbay.altervista.org/authentification/signUpP.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_password: passwd,
                    user_name: name,
                    user_surname: surname,
                    user_birthdate: date,
                    user_email: email,
                    user_fc: fc,
                    user_city: city,
                    user_prov: prov,
                    user_via: via,
                    user_civic: civic,
                    user_phone: phone,
                    user_cap: cap
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    switch(responseJson) {
                        case 0: {
                            createButtonAlert({navigation});
                            break;
                        }
                        case 1: {
                            Alert.alert('Email already used!');
                            break;
                        }
                        case 2: {
                            createButtonAlert1({navigation},usBit);
                        }
                    }
                }).catch((error) => {
                console.error(error);
            });
        } else { fieldCheck(usBit); }
    } else {
        if (email!=null && name!= null && surname!=null && passwd!=null && type!=null) {
            fetch('http://medbay.altervista.org/authentification/signUpM.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doctor_password: passwd,
                    doctor_name: name,
                    doctor_surname: surname,
                    doctor_email: email,
                    doctor_phone: phone,
                    doctor_MedField: type,
                    doctor_spec: spec
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    switch(responseJson) {
                        case 0: {
                            createButtonAlert({navigation});
                            break;
                        }
                        case 1: {
                            Alert.alert('Email already used!');
                            break;
                        }
                        case 2: {
                            createButtonAlert1({navigation},usBit);
                        }
                    }
                }).catch((error) => {
                console.error(error);
            });
        } else { fieldCheck(usBit); }
    }
}