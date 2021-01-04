import React, {useState} from 'react';
import {Alert} from "react-native";

export class Service{
    constructor(id,name,desc,cost) {
        this.id=id;
        this.name=name;
        this.description=desc;
        this.cost=cost;
    }

    setId(text) {
        this.id=text;
    }

    setName(text) {
        this.name=text;
    }

    setDesc(text) {
        this.description=text;
    }

    setCost(text) {
        this.cost=text;
    }

    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getDesc() {
        return this.description;
    }
    getCost() {
        return this.cost;
    }
    deleteService() {
        fetch('http://medbay.altervista.org/DoctorProfiling/deletePrest.php', {
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
                        Alert.alert('Service deleted correctly!');
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