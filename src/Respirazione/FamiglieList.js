import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, FlatList, Text } from 'react-native'
import ListItem from '../components/ListElement'
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

const FamiglieList = ({ route, navigation }) => {
  const { lista } = route.params

  const [listaFamiglie, setListaFamiglie] = useState(Object.values(lista))
  const [listaEsercizi, setListaEsercizi] = useState([])
 
  const [refreshing, setRefreshing] = useState(false)
  const [scelta, setScelta] = useState('')

  const onPressHandler = item => {
    const refEsResp = ref(db, '/Respirazione/' + item)
    var tmp = []
    var esercizio = {}
    setListaEsercizi([])
    
    onValue(refEsResp, snapshot => {
      snapshot.forEach(childSnap => {
        esercizio = {id: childSnap.key, contenuto: childSnap.val()}
        tmp.push(esercizio)
        // childData will be the actual contents of the child
      })
      setListaEsercizi(tmp)
      setScelta(item)
    })
  }
  const refresh = () => {
    setRefreshing(true)
  }
  
  useEffect(() => {
    var tmp = []
    var esercizio = {}
    setListaEsercizi([])
    const refEsResp = ref(db, '/Respirazione/')
    onValue(refEsResp, snapshot => {
      snapshot.forEach(childSnap => {
        esercizio = {id: childSnap.key, contenuto: childSnap.val()}
        tmp.push(esercizio)
      })
    })
    setListaEsercizi(tmp)
    setRefreshing(false)
  }, [refreshing])

  useEffect(() => {
    if (scelta.length != 0) {
      //console.log(contenutoFamiglia)
      navigation.navigate('Lista esercizi', {
        Titoli: listaEsercizi
      })
    }
    setScelta('')
  }, [scelta])

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <FlatList
        data={listaFamiglie}
        refreshing={refreshing}
        onRefresh={refresh}
        keyExtractor={item => item.id}
        renderItem={item => (
          <ListItem nome={item.item.id} onPressItem={onPressHandler} />
        )}
      ></FlatList>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'space-around'
  }
})

export default FamiglieList
