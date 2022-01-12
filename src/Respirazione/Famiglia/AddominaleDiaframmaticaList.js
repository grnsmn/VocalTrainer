import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, FlatList } from 'react-native'
import ListItem from '../../components/ListElement'
import { useState, useEffect } from 'react'

const AddominaleDiaframmaticaList = ({ route, navigation }) => {
  const { Titoli } = route.params
  const [listaTitoli, setListaTitoli] = useState(Object.values(Titoli))
  const [scelta, setScelta] = useState('')

  const loadEsercizio = (item) => {
    
    setScelta(item)
  }
  
  useEffect(() => {
    if (scelta.length != 0) {
      listaTitoli.forEach(element => {
        if (element.id===scelta){
          console.log(element.contenuto)
          navigation.navigate('Training', {esercizio: element.contenuto})
        }
      }
      )
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
      {/* <Es_Respirazione
          title={data[0].titolo}
          descript={data[0].descrizione}
          pallini={data[0].lista_pallini}
          cicli={data[0].cicli}
        ></Es_Respirazione> */}
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

export default AddominaleDiaframmaticaList
