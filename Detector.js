import * as FileSystem from 'expo-file-system';
import React, {Component} from 'react';

//Detatch from reacat expo 

export default class Detector extends Component{
    constructor(){
        super();

        this.loadAudio = this.loadAudio.bind(this);
    }

    async loadAudio(recording){
        console.log("in Load Audio");


    }
}

/*



*/