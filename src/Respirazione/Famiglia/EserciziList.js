import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, FlatList } from 'react-native'
import ListItem from '../../components/ListElement'
import { useState, useEffect } from 'react'

const EserciziList = ({ route, navigation }) => {
  const { Titoli, famiglia } = route.params
  const [listaTitoli, setListaTitoli] = useState(Object.values(Titoli))
  const [scelta, setScelta] = useState('')
  //console.log(Object.values(Titoli));

  useEffect(() => {
    navigation.setOptions({
      title: famiglia,
      headerTitleStyle: {
        fontSize: 24,
      },
    })
  }, [])

  const loadEsercizio = (item) => {
    setScelta(item)
  }

  useEffect(() => {
    if (scelta.length != 0) {
      let esercizioScelto = {}
      let esercizioNext = {}
      esercizioScelto = listaTitoli.find(element => element.id == scelta)
      let nextIndex = listaTitoli.indexOf(esercizioScelto) + 1
      if (listaTitoli[nextIndex] != null) {
        esercizioNext = listaTitoli[nextIndex]
      }

      navigation.navigate('Training', { esercizio: esercizioScelto.contenuto, next: esercizioNext })

      // listaTitoli.forEach(element => {
      //   if (element.id===scelta){
      //     navigation.navigate('Training', {esercizio: element.contenuto})
      //   }
      // }
      // )
    }
    setScelta('')
  }, [scelta])

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <FlatList
        data={listaTitoli}
        keyExtractor={item => item.id}
        renderItem={item => (
          <ListItem nome={item.item.id} onPressItem={loadEsercizio} />
        )}
      >
      </FlatList>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
})

export default EserciziList
