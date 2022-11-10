import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Button, FlatList, Text } from 'react-native'
import ListItem from '../components/ListElement'
import firebase from 'firebase/compat/app'
import { getStorage, ref } from 'firebase/storage'
import { Audio } from 'expo-av'


// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAY9RAEFc8VYup5Y8SQZziZS-GPDAodBE0',
  authDomain: 'vocaltrainer-bfc85.firebaseapp.com',
  databaseURL:
    'https://vocaltrainer-bfc85-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'vocaltrainer-bfc85',
  storageBucket: 'gs://vocaltrainer-bfc85.appspot.com',
  messagingSenderId: '976841336358',
  appId: '1:976841336358:web:c3fd687505c9314e0368e7',
  measurementId: 'G-4BV0XVCFBG'
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app() // if already initialized, use that one
}

const storage = getStorage();
const storageRef = ref(storage);

const VocalizziScreen = ({ route, navigation }) => {
 
  const [sound, setSound] = useState();
  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('./sounds/VOCALIZZI/traccia_2_uomini.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Button title="Play Sound" onPress={playSound} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'space-around'
  }
})

export default VocalizziScreen
