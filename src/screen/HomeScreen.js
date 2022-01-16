import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Button } from 'react-native'
import { useEffect, useState, useRef } from 'react'
import firebase from 'firebase/compat/app'
import { getDatabase, ref, onValue } from 'firebase/database'

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAY9RAEFc8VYup5Y8SQZziZS-GPDAodBE0',
  authDomain: 'vocaltrainer-bfc85.firebaseapp.com',
  databaseURL:
    'https://vocaltrainer-bfc85-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'vocaltrainer-bfc85',
  storageBucket: 'vocaltrainer-bfc85.appspot.com',
  messagingSenderId: '976841336358',
  appId: '1:976841336358:web:c3fd687505c9314e0368e7',
  measurementId: 'G-4BV0XVCFBG'
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app() // if already initialized, use that one
}

const db = getDatabase()
const refRespirazione = ref(db, '/Respirazione/')

export default function HomeScreen ({ navigation }) {
  const [famiglieRespirazione, setFamiglieRespirazione] = useState([])


  useEffect(() => {
    let tmp = []
    let famiglia = {}
    setFamiglieRespirazione([])
    onValue(refRespirazione, snapshot => {
      snapshot.forEach(childSnap => {
        famiglia = { id: childSnap.key, contenuto: childSnap.val() }
        tmp.push(famiglia)
      })
      setFamiglieRespirazione(tmp)
    })
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <Button
        style={styles.button}
        title={'Respirazione'}
        onPress={() =>
          navigation.navigate('Lista Famiglie', { lista: famiglieRespirazione })
        }
      ></Button>
      <Button style={styles.button} title={'Ritmico'}></Button>
      <Button style={styles.button} title={'Vocalizzi'}></Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  button: {
    fontSize: 90,
    height: 100,
    marginBottom: 20
  }
})
