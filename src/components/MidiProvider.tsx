import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import * as Tone from "tone";

import type { WebView as WebViewType } from "react-native-webview";
import { isWeb } from "./utils";

const ToneJsWebview = `
<!DOCTYPE HTML>
<html>
	<head>	
		<script src="http://unpkg.com/tone"></script>
		<script>
      const MIDI = new Tone.Sampler({
        urls: {
            "C1": "24.mp3",
            "C2": "36.mp3",
            "C3": "48.mp3",
            "C4": "60.mp3",
            "C5": "72.mp3",
            "C6": "84.mp3",
            "C7": "96.mp3",
            "F1": "29.mp3",
            "F2": "41.mp3",
            "F3": "53.mp3",
            "F4": "65.mp3",
            "F5": "77.mp3",
            "G5": "79.mp3",
            "E4": "64.mp3",
            "A4": "69.mp3",
        },
        attack: 0.16,
        release: 1,
        volume: -8,
        baseUrl: "https://assets.onlinepianist.com/player/sounds/",
      }).toDestination();

      function triggerAttackRelease(notes, duration, time) {
        const now = Tone.immediate();

        MIDI.triggerAttackRelease(notes, duration, time ? time : now);
      }

      function triggerAttack(notes) {
        const now = Tone.immediate();
        MIDI.triggerAttack(notes, now);
      }

      function triggerRelease(notes, time) {
        MIDI.triggerRelease(notes, time);
      }
		</script>
	</head>
</html>
`;

// Define types for the context value
type MidiContextType = {
  triggerAttack: (notes: string | string[]) => void;
  triggerRelease: (notes: string | string[], time: string) => void;
  triggerAttackRelease: (
    notes: string | string[],
    duration: string,
    time?: string
  ) => void;
};

// Provide a default context value with dummy functions (it will be replaced by the provider)
const MidiContext = createContext<MidiContextType | undefined>(undefined);

// Hook to access MidiContext in other components
export const useMidi = (): MidiContextType => {
  const context = useContext(MidiContext);
  if (!context) {
    throw new Error("useMidi must be used within a MidiProvider");
  }
  return context;
};

// Define types for the provider's props
type MidiProviderProps = {
  children: ReactNode;
};

export const MidiProvider: React.FC<MidiProviderProps> = ({ children }) => {
  const webViewRef = useRef<WebViewType>(null);
  const [MIDI, setMIDI] = useState<Tone.Sampler>();

  const triggerAttackRelease = (
    notes: string | string[],
    duration: string,
    time?: string
  ) => {
    if (isWeb()) {
      const now = Tone.immediate();

      MIDI?.triggerAttackRelease(notes, duration, time ? time : now);
    } else if (webViewRef.current) {
      if (time) {
        webViewRef.current.injectJavaScript(`
          triggerAttackRelease(${JSON.stringify(notes)}, ${JSON.stringify(
          duration
        )}, ${JSON.stringify(time)});
          `);
      } else {
        webViewRef.current.injectJavaScript(`
          triggerAttackRelease(${JSON.stringify(notes)}, ${JSON.stringify(
          duration
        )});
          `);
      }
    }
  };

  const triggerAttack = (notes: string | string[]) => {
    if (isWeb()) {
      const now = Tone.immediate();

      MIDI?.triggerAttack(notes, now);
    } else if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        triggerAttack(${JSON.stringify(notes)});
      `);
    }
  };

  const triggerRelease = (notes: string | string[], time: string) => {
    if (isWeb()) {
      MIDI?.triggerRelease(notes, time);
    } else if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        triggerRelease(${JSON.stringify(notes)}, ${JSON.stringify(time)});
      `);
    }
  };

  useEffect(() => {
    if (isWeb()) {
      const midi = new Tone.Sampler({
        urls: {
          C1: "24.mp3",
          C2: "36.mp3",
          C3: "48.mp3",
          C4: "60.mp3",
          C5: "72.mp3",
          C6: "84.mp3",
          C7: "96.mp3",
          F1: "29.mp3",
          F2: "41.mp3",
          F3: "53.mp3",
          F4: "65.mp3",
          F5: "77.mp3",
          G5: "79.mp3",
          E4: "64.mp3",
          A4: "69.mp3",
        },
        attack: 0.16,
        release: 1,
        volume: -8,
        baseUrl: "https://assets.onlinepianist.com/player/sounds/",
      }).toDestination();

      setMIDI(midi);
    }

    return () => {
      MIDI?.dispose();
    };
  }, []);

  return (
    <MidiContext.Provider
      value={{ triggerAttack, triggerRelease, triggerAttackRelease }}
    >
      {children}
      <View style={styles.webview}>
        {(Platform.OS === "android" || Platform.OS === "ios") && (
          <WebView
            source={{ html: ToneJsWebview }}
            originWhitelist={["*"]}
            javaScriptEnabled={true}
            ref={webViewRef}
          />
        )}
      </View>
    </MidiContext.Provider>
  );
};

const styles = StyleSheet.create({
  webview: {
    height: 0,
    width: 0,
  },
});
