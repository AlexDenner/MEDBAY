import React, { useState, useEffect } from 'react';
import {Button, Image, View, Platform, AsyncStorage, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from "expo-permissions";

/*const uploadImageAsync = async (localUri, id_articolo) => {
    //let localUri = pictureuri;
    //let filename = localUri.split('/').pop();
    //console.log(filename)
    //let match = /\.(\w+)$/.exec(filename);
    //console.log(match)
    //let type = match ? `image/${match[1]}` : `image`;
    //console.log(type)
    let formData = new FormData();
    //formData.append('id_articolo', {nameid: id_articolo});

    //const uriPart = localUri.split('.');
    //const fileExtension = uriPart[uriPart.length - 1];

    formData.append('photo', {
        uri: localUri,
        name: `photo.jpeg`,
        type: `image/jpeg`
    });

    //formData.append('photo', {uri: localUri})//, name: filename, type});
    await fetch('http://gratisfree.altervista.org/negozio/upload_image.php', {
        method: 'POST',
        body: formData,
        header: {
            'content-type': 'multipart/form-data',
        },
    });
    /*fetch('http://gratisfree.altervista.org/negozio/upload_image.php',{
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData
    })
        .then((response) => response.json())
        .then((responseJson) => {
            // return responseJson
            Alert.alert(responseJson);
        })
        .catch((error) => {
            console.error(error);
        });
}*/

export default function ImagePickerExample() {
    const [image, setImage] = useState(null);

    /*useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);*/

    const storeData = async (value) => {
        try {
            await AsyncStorage.setItem('articoloImage', value)
        } catch (e) {
            console.log(e);
        }
    }

    const pickImage = async () => {
        const { status: cameraRollPerm } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (cameraRollPerm === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                setImage(result.uri);
                console.log(result)
                storeData(result.uri)
            }
        }
    };

    const takePhoto = async () => {
        const {
            status: cameraPerm
        } = await Permissions.askAsync(Permissions.CAMERA);

        const {
            status: cameraRollPerm
        } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        //const { cameraPerm } = await ImagePicker.requestCameraPermissionsAsync();
        //const { cameraRollPerm } = await ImagePicker.requestCameraRollPermissionsAsync();
        // only if user allows permission to camera AND camera roll
        if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let pickerResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });

            if (!pickerResult.cancelled) {
                setImage(pickerResult.uri);
                storeData(pickerResult.uri)
            }
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Pick an image from camera roll" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />}
            <Button title="Pick an image from camera" onPress={takePhoto} />
        </View>
    );
}