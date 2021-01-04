import React from 'react';
import { AsyncStorage } from 'react-native';

      export const store = async(key,value) => {
        try {
            await AsyncStorage.removeItem(key);
            await AsyncStorage.setItem(key, value);
        }
        catch (e){
            console.log(e)
        }
    };

    export const getData= async(key) =>{
        try{
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                return value;
            }
        } catch (error) {}};

    export const deleteUser = async (key) => {
        try {
            await AsyncStorage.removeItem(key)
        } catch (e){
            console.log(e)
        }
    }


