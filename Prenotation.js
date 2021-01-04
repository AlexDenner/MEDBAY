import React, {useState} from 'react';
import {Alert} from "react-native";

export class Prenotation{
    constructor(id,date,time,email1,email2,op,ser,notes) {
        this.id = id;
        this.date=date;
        this.time=time;
        this.user_email=email1;
        this.doctor_email=email2;
        this.office_phone=op;
        this.service=ser;
        this.notes = notes;
    }

    setId(text) {
        this.id=text;
    }
    setDate(dt) {
        this.date=dt;
    }
    setTime(tm) {
        this.time=tm;
    }
    setEmail1(text) {
        this.user_email=text;
    }
    setEmail2(text) {
        this.doctor_email=text;
    }
    setPhone(text) {
        this.office_phone=text;
    }
    setService(text) {
        this.service=text;
    }
    setNotes(text) {
        this.notes=text;
    }

    getId() {
        return this.id;
    }
    getDate() {
        return this.date;
    }
    getTime() {
        return this.time;
    }
    getEmail1() {
        return this.user_email;
    }
    getEmail2() {
        return this.doctor_email;
    }
    getPhone() {
        return this.office_phone;
    }
    getService() {
        return this.service;
    }
    getNotes() {
        return this.notes;
    }

    acceptRes() {
        fetch('http://medbay.altervista.org/Booking/acceptReservation.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.id
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                switch (responseJson) {
                    case 1: {
                        Alert.alert('Reservation deleted correctly!');
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

    deleteRes() {
        fetch('http://medbay.altervista.org/Booking/deleteBook.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.id
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                switch (responseJson) {
                    case 1: {
                        Alert.alert('Reservation deleted correctly!');
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
    editRes(link) {
        let filename = link.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        let formData = new FormData();

        fetch('http://medbay.altervista.org/Booking/editBook.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                new_notes: this.notes,
                new_time: this.time,
                new_date: this.date,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if(responseJson > 0){
                    if(link !== null) {
                        formData.append('photo', {
                            uri: link,
                            name: filename, type
                        });
                        formData.append('id', this.id);

                        fetch('http://medbay.altervista.org/Documents/uploadDocument.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            body: formData
                        }).then((response) => response.json())
                            .then((responseJson) => {
                                // return responseJson
                                Alert.alert(responseJson);
                            })
                            .catch((error) => {
                                console.error(error);
                            })
                    }
                    else {
                        Alert.alert('Prenotazione effettuata senza ricetta!');
                    }
                }
                else {
                    Alert.alert(responseJson)
                }
            }).catch((error) => {
            console.error(error);
        })

    }
}