import { Audio } from 'expo-av';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
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
} from 'react-native';
import { Note } from 'tonal';

import { Sounds } from './Sounds';

// White key image w : h = 107 : 621
const NOTE_WHITE_WIDTH = 31;
const NOTE_WHITE_HEIGHT = 180;
// Black key image w : h = 73 : 404
const NOTE_BLACK_WIDTH = 21.7;
const NOTE_BLACK_HEIGHT = 120;

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
  onPressKey: (key: string) => void;
}

const PianoKeyboard: React.FC<IPianoKeyboardProps> = ({ startKey = 'C2', endKey = 'C4', onPressKey }) => {
  const [pianoKeys, setPianoKeys] = useState<TPianoKey[]>([]);
  const [keyboardMetric, setKeyboardMetric] = useState({ width: 0, height: 0 });
  const { width: windowWidth } = useWindowDimensions();
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const getOffset = (noteName: string) => {
    var offset = 0;
    switch (noteName[0]) {
      case 'D':
        offset = 3.5;
        break;
      case 'E':
        offset = -4;
        break;
      case 'G':
        offset = 3;
        break;
      case 'A':
        offset = 0;
        break;
      case 'B':
        offset = -4;
        break;
    }
    return NOTE_BLACK_WIDTH / 2 + offset;
  };

  const getKey = (midi: number, width: number) => {
    const noteName = Note.fromMidi(midi);

    const isChromatic = Note.accidentals(noteName);

    if (isChromatic) {
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
    if (key.isWhite) {
      return (
        <View
          style={[
            styles.whiteKey,
            pressed && styles.pressedWhiteKey,
          ]}
        />
      );
    } else {
      return (
        <View
          style={[
            styles.blackKey,
            pressed && styles.pressedBlackKey,
          ]}
        />
      );
    }
  };

  const initializeKeyboard = () => {
    const startMidi = Note.midi(startKey);
    const endMidi = Note.midi(endKey);
    const midiRange = [...Array(endMidi! - startMidi!).keys()].map((_, index) => startMidi! + index);

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
    if (Sounds[key.note]) {
      const { sound: _sound } = await Audio.Sound.createAsync(Sounds[key.note]);
      setSound(_sound);
      await _sound.replayAsync();
      setTimeout(() => {
        _sound.unloadAsync();
      }, 3000);
    }
  };

  const onPressKeyOut = () => async () => {
    setTimeout(() => {
      if (sound?._loaded) {
        sound?.stopAsync();
      }
    }, 200);
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
        onPress={() => onPressKey(key.note)}
        onPressIn={onPressKeyIn(key)}
        onPressOut={onPressKeyOut()}
        android_disableSound>
        {({ pressed }) => (
          <View style={styles.keyContent}>
            {getKeyImage(key, pressed)}
            <Text style={styles.keyNote}>{key.isWhite ? key.note : ''}</Text>
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
      {/* <Image style={[styles.topImage]} source={require('@/assets/images/Top.png')} contentFit="fill" /> */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={Platform.OS === 'web' && keyboardMetric.width < windowWidth ? styles.scrollView : {}}>
        <View style={{ width: keyboardMetric.width, height: keyboardMetric.height }}>{pianoKeys.map(renderPianoKey)}</View>
      </ScrollView>
      {/* <View style={styles.bottom} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
  },
  topImage: {
    height: 60,
  },
  scrollView: {
    alignSelf: 'center',
  },
  key: {
    position: 'absolute',
    borderRightWidth: 0,
  },
  keyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  whiteKey: {
    borderWidth: 1,
    borderColor: '#000',
    width: NOTE_WHITE_WIDTH,
    height: NOTE_WHITE_HEIGHT,
    backgroundColor: '#FFF',
  },
  pressedWhiteKey: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#DDD',
  },
  blackKey: {
    width: NOTE_BLACK_WIDTH,
    height: NOTE_BLACK_HEIGHT,
    backgroundColor: '#000',
  },
  pressedBlackKey: {
    backgroundColor: '#333',
  },
  keyNote: {
    marginBottom: 5,
    userSelect: 'none',
  },
  bottom: {
    height: 10,
    backgroundColor: '#1A1A1A',
  },
});

export default PianoKeyboard;