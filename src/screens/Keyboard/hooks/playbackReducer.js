import {
	DEFAULT_BPM,
	DEFAULT_SCALE_TYPE,
	DEFAULT_START_OCTAVE,
	DEFAULT_SELECTED_KEY,
} from '../keyboard.constants';

export const initialState = {
  selectedKey: DEFAULT_SELECTED_KEY,
  selectedScaleType: DEFAULT_SCALE_TYPE,
  startOctave: DEFAULT_START_OCTAVE,
  bpm: DEFAULT_BPM,
  isPlaying: false,
  playedSteps: 0,
  activePlaybackNote: null,
};

export const ACTION = {
  SET_KEY: 'SET_KEY',
  SET_SCALE_TYPE: 'SET_SCALE_TYPE',
  SET_START_OCTAVE: 'SET_START_OCTAVE',
  SET_BPM: 'SET_BPM',
  PLAY_STARTED: 'PLAY_STARTED',
  PLAY_STOPPED: 'PLAY_STOPPED',
  STEP_PLAYED: 'STEP_PLAYED',
  SET_ACTIVE_NOTE: 'SET_ACTIVE_NOTE',
  CLEAR_ACTIVE_NOTE: 'CLEAR_ACTIVE_NOTE',
};

export const keyboardPlaybackReducer = (state, action) => {
  switch (action.type) {
    case ACTION.SET_KEY:
      return { ...state, selectedKey: action.payload };
    case ACTION.SET_SCALE_TYPE:
      return { ...state, selectedScaleType: action.payload };
    case ACTION.SET_START_OCTAVE:
      return { ...state, startOctave: action.payload };
    case ACTION.SET_BPM:
      return { ...state, bpm: action.payload };
    case ACTION.PLAY_STARTED:
      return { ...state, isPlaying: true, playedSteps: 0 };
    case ACTION.PLAY_STOPPED:
      return {
        ...state,
        isPlaying: false,
        playedSteps: 0,
        ...(action.payload?.clearActiveNote ? { activePlaybackNote: null } : {}),
      };
    case ACTION.STEP_PLAYED:
      return { ...state, playedSteps: action.payload };
    case ACTION.SET_ACTIVE_NOTE:
      return { ...state, activePlaybackNote: action.payload };
    case ACTION.CLEAR_ACTIVE_NOTE:
      return { ...state, activePlaybackNote: null };
    default:
      return state;
  }
};
