import { Audio } from 'expo-av';
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Pressable, Text, Image, Alert} from 'react-native';
import Directory from "./RecordingDirectory";
import * as Haptics from 'expo-haptics';


const buttonColor = '#6141AC';
const playback = new Audio.Sound();

let RecordingDirectory = new Directory();
RecordingDirectory.setRecordings();

export default function RecordButton() {
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [recording, setRecording] = useState(undefined);
    const [on, setPress] = useState(false);
    const [uri, setURI] = useState(undefined);
    //const [duration, setDuration] = useState(undefined);
    const [show_directory, setDirectory] = useState(false);
    let record = new Audio.Recording(); //minimize the number of recording objects that get made. 
    
    useEffect(()=>{
        RecordingDirectory.saveRecordings();
    });

    async function startRecording() {
        try {
        if (permissionResponse.status !== 'granted') {
            //in case microphone permission
            await requestPermission();
        }
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        //Starting recording
        await record.prepareToRecordAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await record.startAsync();
        setRecording(record);

        //Recording start
        } catch (err) { 
        console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync(
        {
            allowsRecordingIOS: false,
        }
        ); 
    }

    return (
        <View>
            <View style={{backgroundColor: on ? buttonColor : 'white', borderRadius:15, alignItems: 'center'}}>
                <Pressable onPress={()=>{ //why does an arrow function work better to handle this? 
                    Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Medium
                    );
                    setPress(!on);
                    if (!on){
                        startRecording();
                    }else{
                        if (recording==undefined){
                            Alert.alert("Error", "Sorry, the recording could not be saved. Please try again.");
                        }else{
                            setURI(recording.getURI());

                            //get the duration of the recording
                            recording.getStatusAsync().then(status => {
                                RecordingDirectory.addRecording(recording.getURI(), status.durationMillis);
                            });

                            }
                        stopRecording();
                    }
                }} style={styles.button}>
                    {on ? <View style={styles.stop_icon}/> : <View style={styles.record_icon}/>}
                    <Text style={on ? styles.stop_text :  styles.record_text }>{on ? 'STOP' : 'Record'}</Text>
                </Pressable>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {PlayButton(uri!==undefined? uri : null)}
                <Text style={{marginLeft: 10, fontSize:15}}>{RecordingDirectory.state.recordings.length}</Text>
                <View style={{width: 10, height: 10, backgroundColor: 'red', borderRadius: 2, marginLeft: 2}}></View>
                <Pressable style={{backgroundColor: '#6141AC', borderRadius:10, marginLeft: 10}} onPress={()=>{
                    setDirectory(!show_directory);
                }}>
                    <Image source={require('./live_assets/directoryBars.png')} style={{width:40, height:40}}/>
                </Pressable>
                <Pressable style={{backgroundColor: '#6141AC', borderRadius:10, marginLeft: 10, padding:5}} onPress={()=>{
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Warning
                    );
                    Alert.alert("Confirm", null, [{text: "Delete All Recordings", onPress:()=>{RecordingDirectory.deleteDirectory(); setDirectory(false);} }, {text: "Cancel"}])
                }}>
                    <Image source={require('./live_assets/trashcanIcon.png')} style={{width:30, height:30}}/>
                </Pressable>
            </View>
            {show_directory? RecordingDirectory.display(): undefined}
        </View>
    );
}


function PlayButton(location){ //find audio playing https://docs.expo.dev/versions/latest/sdk/audio/

    async function playRecording(){

        if (location!==null){
            try{
                console.log("loading sounds");
                await playback.unloadAsync();
                await playback.loadAsync({uri:location});

                console.log("playing sound");
                await playback.playAsync();
            } catch (err) { 
                console.error('Failed to play recording', err);
            }
        }
    }

    return(
        <Pressable onPress={()=>{
            playRecording();
        }} style={[styles.button, styles.outlined]}>
            <Text style={{color:buttonColor, fontSize:17}}>Play Audio</Text> 
        </Pressable>
    );
}





const styles = StyleSheet.create({
    button: {
        borderRadius:20,
        padding:15, 
        flexDirection:'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: 150,
        height: 50,
        padding: 10,
        margin:10
    },
    outlined: {borderColor: buttonColor, borderWidth: 5},
    stop_icon: {width:20, height:20, backgroundColor:'white', padding:10},
    record_icon: {width:20, height:20, backgroundColor: buttonColor, borderRadius:10, padding:10},
    stop_text: {color:'white', fontSize:25, fontWeight:'bold', marginLeft:10},
    record_text: {color:buttonColor, fontSize:25, fontWeight:'bold', marginLeft:10},
    
});