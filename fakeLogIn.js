import React from 'react';
import { Alert, AsyncStorage } from 'react-native';

function signInAlert({navigation}) {
    Alert.alert(
        'Username or Password not found!',
        ' ',
        [
            {
                text: 'Try Again',
                onPress: navigation.push("LogIn")
            }
        ],
        {cancelable:false}
    );
}

export function fakeLogIn({navigation},user, username, password) {
    if (user === 'User') {
        if(username === 'AlexDenner' && password === '123')
                    navigation.navigate('UserHome');
                else
                    signInAlert({navigation});
    } else {
                if(username === 'AlexDenner' && password === '123')
                {
                    navigation.navigate('DoctorHome');
                }
                else{
                    signInAlert({navigation});
                }
    }
}