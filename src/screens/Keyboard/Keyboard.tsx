import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Linking } from "react-native";
import PianoKeyboard from "../../components/PianoKeyboard";
import { MidiProvider } from "../../components/MidiProvider";
import { useState } from "react";

const Keyboard = () => {
  const [keyPressed, setKeyPressed] = useState<string[]>([]);
  
  const onPressKey = (note: string, isKeyDown: boolean) => {
    if (isKeyDown) {
      // Aggiungi la nota all'array se non è già presente
      setKeyPressed(prev => prev.includes(note) ? prev : [...prev, note]);
      console.log("Key pressed:", note);
    } else {
      // Rimuovi la nota dall'array quando il tasto viene rilasciato
      setKeyPressed(prev => prev.filter(item => item !== note));
      console.log("Key released:", note);
    }
  };

  const onLink1 = () => {
    Linking.openURL("https://www.onlinepianist.com/virtual-piano");
  };

  const onLink2 = () => {
    Linking.openURL("https://tonejs.github.io/");
  };

  return (
    <MidiProvider>
      <View style={styles.container}>
        <Text style={styles.piano}>🎹</Text>
        <Text style={styles.description}>
          Play the piano using your keyboard to play free exerrcised that you
          wanted to play.
        </Text>
        <Text style={styles.description}>
          Sounds by{" "}
          <Text style={styles.link} onPress={onLink2}>
            Tone.js
          </Text>
        </Text>
        <View style={{ flex: 1 }} />
        {/* <Text style={styles.keylog}>Key pressed: {keyPressed.join(", ")}</Text> */}
        <PianoKeyboard onPressKey={onPressKey} />
        <StatusBar style="auto" />
      </View>
    </MidiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 40,
    textAlign: "center",
    marginTop: 80,
  },
  piano: {
    fontSize: 80,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
  keylog: {
    paddingHorizontal: 20,
    marginBottom: 4,
  },
});

export default Keyboard;