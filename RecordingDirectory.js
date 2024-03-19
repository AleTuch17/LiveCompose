import {Component} from 'react';
import { StyleSheet, View, Image, Text, Pressable, Alert, SafeAreaView, FlatList, Item} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import Detector from './Detector';

const directory_key = "directory_key_v1";
const detector = new Detector();

export default class Directory extends Component{
    constructor(){
        super();
        this.state = {
            recordings: [],
            current: null
        }

        this.display = this.display.bind(this);
        this.addRecording = this.addRecording.bind(this);
        this.updateRecording = this.updateRecording.bind(this);
        this.deleteDirectory = this.deleteDirectory.bind(this);
        this.setRecordings = this.setRecordings.bind(this);
        this.saveRecordings = this.saveRecordings.bind(this);
    }

    async addRecording(location, duration){  
        console.log("Adding recording to directory...");
        let date = new Date().toString();
        this.state.recordings.push({uri: location, label: date, date_recorded: date, duration: duration, analysis: undefined});
        
        if (this.state.current == null){
            this.state.current = this.state.recordings[0];

            //here is for the pitchdetection...
            detector.loadAudio(this.state.current);
        }
    }

    async setRecordings(){
        try{
            const jsonValue = await AsyncStorage.getItem(directory_key);
            this.state.recordings = jsonValue != null ? JSON.parse(jsonValue): [];
            //console.log('From ', directory_key, recordings);
        }catch (err) {
            console.log("Failed to get directory", err);
        }
    }

    async saveRecordings(){
        try{
            await AsyncStorage.setItem(directory_key, JSON.stringify(this.state.recordings));
        }catch(err){
            console.log('Failed to save directory', err);
        }
    }

    updateRecording(recording, text){
        recording.label = text; 
    }

    async deleteDirectory(){
        this.state.recordings = [];
        try{
            await AsyncStorage.removeItem(directory_key);
        }catch(err){
            console.log("Failed to remove directory", err);
        }
    }

    display(){
        //here where to render the Recording objects
        //onPress #1 change current URI; onPress #2 for edit
        const listed = this.state.recordings.map((recording)=>{return (<View style={[styles.recording, styles.visible]} key={this.state.recordings.indexOf(recording)}>
            <Pressable styles={{flexDirection:'column'}} onPress = {()=>{this.state.current = recording.uri;}}>
                <Text style={{fontSize: 15, color: 'black'}}>{recording.label}</Text>
                <Text style={{fontSize:10, color: 'gray'}}>{recording.duration !== undefined? `${recording.duration/1000} secs`: "N/A"}</Text>
                {/* <Text style={{fontSize:10, color: 'gray'}}>{recording.date_recorded}</Text> */}
            </Pressable>
            <Pressable onPress = {()=>{Alert.alert("Edit", null, [{text: "Rename Recording", onPress:()=>{Alert.prompt("Rename", null, (text)=>{this.updateRecording(recording, text)})}}, {text: "Analyze Recording", onPress:()=>{/* Redirect here to analysis function*/}}, {text: "Delete Recording", onPress:()=>{let index = this.state.recordings.indexOf(recording); this.state.recordings.splice(index, 1);}}, {text: "Cancel"}])}}>
                <Image source={require('./live_assets/pen.png')} style={{width:30, height:30}}/>
            </Pressable>
            <Pressable onPress={async ()=>{await Sharing.shareAsync(recording.uri);}}>
                <Image source={require('./live_assets/share.png')} style={{width:30, height:30}}/>
            </Pressable>
        </View>);})

        if (this.state.recordings.length>0){
            return <View style={{gap: 10}}>{listed}</View>;
        }else{
            return(<Text style={{color:'gray'}}>Your recordings will appear here!</Text>);
        }
    };
};



const styles = StyleSheet.create({
    visible: {
        backgroundColor:'#dddae3',
        borderRadius:10
    },
    recording:{
        padding:15, 
        gap: 20,
        flexDirection: 'row',
        alignItems:'center'
    }
  });
  