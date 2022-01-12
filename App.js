import { StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screen/HomeScreen';
import AddominaleDiaframmaticaList from './src/Respirazione/Famiglia/AddominaleDiaframmaticaList';
import FamiglieList from './src/Respirazione/FamiglieList';
import TrainingScreen from './src/screen/TrainingScreen'
//import Metronome from './src/MetronomeHook'


const Stack = createNativeStackNavigator();

export default function App () {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Lista Famiglie" component={FamiglieList} />
      <Stack.Screen name="Addominale Diaframmatica" component={AddominaleDiaframmaticaList} />
       <Stack.Screen name="Training" component={TrainingScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
