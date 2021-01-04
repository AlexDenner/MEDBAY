import React, {useState} from 'react';

export class MedicalOffice {
    constructor(name, add, civic, city, prov, pn, cap) {
        this.name = name;
        this.address = add;
        this.civic = civic;
        this.city = city;
        this.province = prov;
        this.phoneNumber = pn;
        this.cap = cap;
    }

    setName(text) {
        this.name = text;
    }

    setCity(text) {
        this.city = text;
    }

    setProv(text) {
        this.province = text;
    }

    setAdd(text) {
        this.address = text;
    }
    setCivic(text) {
        this.civic = text;
    }

    setPn(text) {
        this.phoneNumber = text;
    }

    setCap(text) {
        this.cap = text;
    }

    getName() {
        return this.name
    }

    getAddress() {
        return this.address
    }
    getCivic() {
        return this.civic
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

}
