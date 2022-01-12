import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Esercizio from '../components/Esercizio'

const TrainingScreen = ({route}) => {

  const {esercizio} = route.params
  
  return (
    <View style={styles.container}>
      <View style={styles.Esercizio}>
        <Text style={styles.Title}>{esercizio.titolo}</Text>
        <Text style={styles.Descript}>{esercizio.descrizione}</Text>
        <Esercizio pallini={[esercizio.lista_pallini]} cicli= {esercizio.cicli}></Esercizio>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    
  },
  Esercizio: {
    flex: 1
  },
  Title: {
    fontSize: 40,
    marginBottom: 20,
    textAlign: 'center',
    color: 'red'
  },
  Descript: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic'
  }
})
export default TrainingScreen
