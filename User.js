import React from 'react';
import {Prenotation} from "./Prenotation";
import {Alert} from "react-native";

export class User {
    constructor(email,name,surname,fc,bd,add,city,prov,pn,cap,civic) {
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.fiscalCode = fc;
        this.birthDate = bd;
        this.address = add;
        this.civic = civic;
        this.city = city;
        this.province = prov;
        this.phoneNumber = pn;
        this.cap = cap;
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
    setBd(text) {
        this.birthDate=text;
    }
    setCity(text) {
        this.city=text;
    }
    setProv(text) {
        this.province=text;
    }
    setAdd(text) {
        this.address=text;
    }
    setFc(text) {
        this.fiscalCode=text;
    }
    setPn(text) {
        this.phoneNumber=text;
    }
    setCap(text) {
        this.cap=text;
    }
    setCivic(text) {
        this.civic=text;
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
    getFc() {
        return this.fiscalCode
    }
    getAddress() {
        return this.address
    }
    getCity() {
        return this.city
    }
    getProv() {
        return this.province
    }
    getPn() {
        return this.phoneNumber
    }
    getCap() {
        return this.cap
    }
    getCivic() {
        return this.civic
    }

    book(id,date,time,on,op,ser) {
        const pren = new Prenotation(id,date,time,this.fiscalCode,this.email,on,op,ser);
        return pren;
    }

    editPren(pren,newDate,newTime,newSer) {
        pren.setDate(newDate);
        pren.setTime(newTime);
        pren.setService(newSer);
    }

    editProfile(email,add,city,prov,pn,cap) {
        this.setEmail(email);
        this.setAdd(add);
        this.setCity(city);
        this.setProv(prov);
        this.setPn(pn);
        this.setCap(cap);
    }

    deleteAccount() {
        fetch('http://medbay.altervista.org/UserProfiling/delete.php', {
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




