import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, FlatList, Text } from 'react-native'
import ListItem from '../components/ListElement'
import { getDatabase, ref, onValue } from 'firebase/database'

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
        esercizio = { id: childSnap.key, contenuto: childSnap.val() }
        tmp.push(esercizio)
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
        esercizio = { id: childSnap.key, contenuto: childSnap.val() }
        tmp.push(esercizio)
      })
    })
    setListaEsercizi(tmp)
    setRefreshing(false)
  }, [refreshing])

  useEffect(() => {
    if (scelta.length != 0) {
      //cosole.log(contenutoFamiglia)
      navigation.navigate('Lista esercizi', {
        Titoli: listaEsercizi,
        famiglia: scelta
      })
    }
    setScelta('')
  }, [scelta])

  if (refresh === true) {
    return <View>
      <Text>STO CARICANDO</Text>
    </View>
  } else
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
    justifyContent: 'space-around',
    paddingTop: 10,
  }
})

export default FamiglieList
