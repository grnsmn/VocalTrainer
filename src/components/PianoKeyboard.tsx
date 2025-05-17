import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { Note } from "tonal";

import { useMidi } from "./MidiProvider";
import { isWeb } from "./utils";

// White key image w : h = 53 : 195
const NOTE_WHITE_WIDTH = 53;
const NOTE_WHITE_HEIGHT = 195;
// Black key image w : h = 29 : 125
const NOTE_BLACK_WIDTH = 29;
const NOTE_BLACK_HEIGHT = 125;

const ENABLE_SUSTAIN = true;

type TPianoKey = {
  isWhite: boolean;
  midi: number;
  note: string;
  left: number;
};

type TKeyboardState = {
  width: number;
  keys: TPianoKey[];
};

interface IPianoKeyboardProps {
  startKey?: string;
  endKey?: string;
  keyDisabled?: boolean;
  onPressKey: (key: string) => void;
}

function isBlackKey(note: string) {
  return note.includes("#") || note.includes("b");
}

const PianoKeyboard: React.FC<IPianoKeyboardProps> = ({
  startKey = "C2",
  endKey = "C4",
  keyDisabled,
  onPressKey,
}) => {
  const [pianoKeys, setPianoKeys] = useState<TPianoKey[]>([]);
  const [keyboardMetric, setKeyboardMetric] = useState({ width: 0, height: 0 });
  const { width: windowWidth } = useWindowDimensions();
  const { triggerAttackRelease, triggerRelease } = useMidi();

  const getOffset = (noteName: string) => {
    var offset = 0;
    switch (noteName[0]) {
      case "D":
        offset = 3.5;
        break;
      case "E":
        offset = -3.5;
        break;
      case "G":
        offset = 3.5;
        break;
      case "A":
        offset = 0;
        break;
      case "B":
        offset = -3.5;
        break;
    }
    return NOTE_BLACK_WIDTH / 2 + offset;
  };

  const getKey = (midi: number, width: number) => {
    const noteName = Note.fromMidi(midi);

    const isBlack = Note.accidentals(noteName);

    if (isBlack) {
      return {
        width: 0,
        key: {
          isWhite: false,
          midi: midi,
          note: noteName,
          left: width - getOffset(noteName),
        },
      };
    } else {
      return {
        width: NOTE_WHITE_WIDTH,
        key: {
          isWhite: true,
          midi: midi,
          note: noteName,
          left: width,
        },
      };
    }
  };

  const getKeyImage = (key: TPianoKey, pressed: boolean) => {
    var image: ImageSourcePropType | undefined = undefined;

    if (key.isWhite) {
      image = pressed
        ? require("../../assets/images/white_key_pressed.png")
        : require("../../assets/images/white_key.png");
    } else {
      image = pressed
        ? require("../../assets/images/black_key_pressed.png")
        : require("../../assets/images/black_key.png");
    }

    return image;
  };

  const initializeKeyboard = () => {
    const startMidi = Note.midi(startKey)! - (isBlackKey(startKey) ? 1 : 0);
    const endMidi = Note.midi(endKey)! + (isBlackKey(endKey) ? 1 : 0);
    const midiRange = [...Array(endMidi! - startMidi! + 1).keys()].map(
      (_, index) => startMidi! + index
    );

    const { width, keys } = midiRange.reduce<TKeyboardState>(
      (keyboard, midi) => {
        var keys = [...keyboard.keys];

        const { width, key } = getKey(midi, keyboard.width);

        keys.push(key);

        return {
          width: keyboard.width + width,
          keys: keys,
        };
      },
      { width: 0, keys: [] }
    );

    setPianoKeys(keys);
    setKeyboardMetric({ width: width, height: NOTE_WHITE_HEIGHT });
  };

  const onPressKeyIn = (key: TPianoKey) => async () => {
    if (keyDisabled) {
      return;
    }
    onPressKey(key.note);
    triggerAttackRelease(key.note, "1");
  };

  const onPressKeyOut = (key: TPianoKey) => async () => {
    if (!ENABLE_SUSTAIN) {
      triggerRelease(key.note, "+0.3");
    }
  };

  const renderPianoKey = (key: TPianoKey, index: number): JSX.Element => {
    const width = key.isWhite ? NOTE_WHITE_WIDTH : NOTE_BLACK_WIDTH;
    const height = key.isWhite ? NOTE_WHITE_HEIGHT : NOTE_BLACK_HEIGHT;

    const keyStyle: StyleProp<ViewStyle> = {
      left: key.left,
      width,
      height,
      zIndex: key.isWhite ? 1 : 5,
    };

    return (
      <Pressable
        key={index.toString()}
        style={[styles.key, keyStyle]}
        disabled={keyDisabled}
        onPressIn={onPressKeyIn(key)}
        onPressOut={onPressKeyOut(key)}
        android_disableSound
      >
        {({ pressed }) => (
          <View style={styles.keyContent}>
            <Image
              style={styles.keyImage}
              source={getKeyImage(key, pressed)}
              {...(Platform.OS === "web" && { draggable: false })}
            />
            <Text style={styles.keyNote}>{key.isWhite ? key.note : ""}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  useEffect(() => {
    initializeKeyboard();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={[styles.topImage]}
        source={require("../../assets/images/Top.png")}
        contentFit="fill"
        {...(Platform.OS === "web" && { draggable: false })}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={
          isWeb() && keyboardMetric.width < windowWidth ? styles.scrollView : {}
        }
      >
        <View
          style={{ width: keyboardMetric.width, height: keyboardMetric.height }}
        >
          {pianoKeys.map(renderPianoKey)}
        </View>
      </ScrollView>
      <View style={styles.bottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1A1A1A",
  },
  topImage: {
    height: 60,
  },
  scrollView: {
    alignSelf: "center",
  },
  key: {
    position: "absolute",
    borderRightWidth: 0,
  },
  keyContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  keyImage: {
    ...StyleSheet.absoluteFillObject,
  },
  keyNote: {
    marginBottom: 5,
    userSelect: "none",
  },
  bottom: {
    height: 10,
    backgroundColor: "#1A1A1A",
  },
});

export default PianoKeyboard;
