import * as FileSystem from 'expo-file-system';
import React, {Component} from 'react';

//TEST THIS FILE

/*

Next Steps 3/18: 
- Find form of binary audio data - see if workable

*/

export default class Detector extends Component{
    constructor(){
        super();

        this.loadAudio = this.loadAudio.bind(this);
    }

    async loadAudio(recording){
        console.log("in Load Audio");

        //load binary audio data (workaround for audio buffer)

        try {
            const fileUri = await FileSystem.downloadAsync(recording.uri, `${FileSystem.documentDirectory}/recording.mp4`);
            console.log("finished downloading!");

            const fileInfo = await FileSystem.getInfoAsync(fileUri);

            if (!fileInfo.exists) {
              console.error('File does not exist');
              return;
            }
            const audioData = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
          
            const byteCharacters = atob(audioData);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            console.log("data: ", new Uint8Array(byteNumbers));
          
        } catch (error) {
            console.error('Failed to fetch audio data', error);
        }
    }
}

/*



*/