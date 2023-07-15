import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, FlatList, Text } from "react-native";
import firebase from "firebase/compat/app";
import { getStorage, ref, getDownloadURL, list } from "firebase/storage";
import { Audio } from "expo-av";


// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAY9RAEFc8VYup5Y8SQZziZS-GPDAodBE0",
  authDomain: "vocaltrainer-bfc85.firebaseapp.com",
  databaseURL:
    "https://vocaltrainer-bfc85-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vocaltrainer-bfc85",
  storageBucket: "gs://vocaltrainer-bfc85.appspot.com",
  messagingSenderId: "976841336358",
  appId: "1:976841336358:web:c3fd687505c9314e0368e7",
  measurementId: "G-4BV0XVCFBG",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const storage = getStorage();

const storageRef = ref(
  storage,
  "gs://vocaltrainer-bfc85.appspot.com/81 Traccia 81.mp3"
);

const VocalizziScreen = ({ route, navigation }) => {
  const [sound, setSound] = useState('');
  const [listVocalizzi, setListVocalizzi] = useState();
  
  useEffect(() => {
    const setAudio = async () => {
      const listStorage = await list(storageRef)
      setListVocalizzi(listStorage.items);
      const url = await getDownloadURL(storageRef);
      console.log("Loading Sound");
      const { sound: soundFirebase } = await Audio.Sound.createAsync(
        { uri: url },
      );
      setSound(soundFirebase);
    }
    setAudio()
  }, [])
  
  
  async function playSound() {
    const getSound = await sound.getStatusAsync();
    if (!getSound.isPlaying) {
      console.log("Playing Sound");
      await sound.playAsync();
    } else {
      console.log("Pause Sound");
      await sound.stopAsync();
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      {listVocalizzi?.map(item => {
        return (<View style={{width:10, height:10, backgroundColor:'red', padding: 8}}>{ item._location.path}</View>)
      	})}
      <Button title="Play Sound" onPress={playSound} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: 'center',
    justifyContent: "space-around",
  },
});

export default VocalizziScreen;
