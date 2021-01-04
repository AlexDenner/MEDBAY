import React, {Component, useState} from 'react';
import {Alert} from "react-native";

export class Doctor {
    constructor(email,name,surname,mf,spec,pn) {
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.medField = mf;
        this.specialization = spec;
        this.phone = pn;
    }

    setEmail(text) {
        this.email=text;
    }
    setName(text) {
        this.name=text;
    }
    setSurname(text) {
        this.surname=text;
    }
    setMedField(text) {
        this.medField=text;
    }
    setPhone(text) {
        this.phone=text;
    }
    setSpecialization(text) {
        this.specialization=text;
    }

    getEmail() {
        return this.email
    }
    getName() {
        return this.name
    }
    getSurname() {
        return this.surname
    }
    getMedField() {
        return this.medField
    }
    getSpec() {
        return this.specialization
    }
    getPhone() {
        return this.phone
    }
    deleteAccount() {
        fetch('http://medbay.altervista.org/DoctorProfiling/delete.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.email
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                switch (responseJson) {
                    case 1: {
                        Alert.alert('Account deleted correctly!');
                        break;
                    }
                    case 0: {
                        Alert.alert('Error!')
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }

}