import react from 'react'
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'

const ListItem = props => {
  return (
    <View style={{...props.style}}>
      <TouchableHighlight >
        <Text onPress={props.onPressItem.bind(this,props.nome)} style={{...styles.textStyle, ...props.style}}>{props.nome}</Text>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
    textStyle:{
        fontSize:20,
        margin:10,
        borderBottomWidth:1,
        textAlign: 'center',
        fontFamily: 'open-sans-bold'
    }
})

export default ListItem
