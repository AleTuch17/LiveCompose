import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Text, Pressable, Switch} from 'react-native';
import RecordButton from './RecordButton';
import React, {useState, useEffect} from "react";
import * as Haptics from 'expo-haptics';

//incorporate Haptics...?

let analyzeMode = false; 

function Settings(){

  //https://reactnative.dev/docs/switch
  const [isEnabled, setIsEnabled] = useState(analyzeMode); //analyzeMode preserves local session toggling of settings
  const toggleSwitch_analysis = () => {setIsEnabled(previousState => !previousState);}
  
  useEffect(()=>{
    analyzeMode = isEnabled; 
  });

  return( //add more settings - if it is enabled
      <View style={styles.pop}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>Settings</Text>
          <View style={styles.bar}>
              <Text style={styles.caption}>Transcribe</Text>
              <Switch
               trackColor={{false: '#f4f3f4', true: 'red'}}
               thumbColor={isEnabled ? 'white' : '#f4f3f4'}
               ios_backgroundColor="#3e3e3e"
               onValueChange={toggleSwitch_analysis}
               value={isEnabled}
              />
          </View>
      </View>
  );
}



const Record = <RecordButton/>;
const SettingsPage = <Settings/>;

export default function App() {
  const [pageNum, setPage] = useState(0);

  function switchPage(){
    switch (pageNum){
      case 0:
        return (Record);
      case 1:
        return (SettingsPage);
    }
  }

  return (
    <View style={styles.main}>
      <View style = {styles.top_bar}>
        <Image source={require('./live_assets/live_compose_icon.png')} style={{width:150, height:150}} resizeMode='contain'/>
        <View style={{flexDirection: 'row', gap: 10}}>
          <Pressable style={{backgroundColor: '#6141AC', borderRadius:20}} onPress={()=>{
            Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Light
            );
            setPage(1);
          }}>
            <Image source={require('./live_assets/SettingsIcon.png')} style={{width:50, height:55}}/>
          </Pressable>
          <Pressable style={{backgroundColor: '#6141AC', borderRadius:20}} onPress={()=>{
            Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Light
            );
            setPage(0);
          }}>
            <Image source={require('./live_assets/homeIcon.png')} style={{width:50, height:55}}/>
          </Pressable>
        </View>
      </View>
      {switchPage()}
      <View>
        <Text>Created by Alexis Tuchinda</Text>
      </View>  
    </View>
  );

}

const styles = StyleSheet.create({
  main: {
    padding:50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  top_bar:{
    flexDirection:'row',
    alignItems:'center',
    gap: 50
  },
  pop: {
    backgroundColor: '#6141AC',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  caption:{color:'white', fontSize: 17},
  bar:{flexDirection:'row', alignItems:'center', gap:10, marginTop: 10}
 
});
