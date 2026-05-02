export const START_KEY = 'C2';
export const END_KEY = 'C5';
export const DEFAULT_BPM = 100;
export const DEFAULT_SELECTED_KEY = 'C';
export const DEFAULT_SCALE_TYPE = 'majorPentatonic';
export const DEFAULT_START_OCTAVE = 2;

export const SCALE_TYPES = [
	{
		id: 'naturalMajor',
		label: 'Natural Major',
		tonalName: 'major',
	},
	{
		id: 'naturalMinor',
		label: 'Natural Minor',
		tonalName: 'minor',
	},
	{
		id: 'majorPentatonic',
		label: 'Major Pentatonic',
		tonalName: 'pentatonic',
	},
	{
		id: 'minorPentatonic',
		label: 'Minor Pentatonic',
		tonalName: 'minor pentatonic',
	},
];

export const KEY_OPTIONS = [
	'C',
	'C#',
	'D',
	'D#',
	'E',
	'F',
	'F#',
	'G',
	'G#',
	'A',
	'A#',
	'B',
];

export const START_OCTAVE_OPTIONS = [
	{ id: 2, label: 'Start Octave 2' },
	{ id: 3, label: 'Start Octave 3' },
	{ id: 4, label: 'Start Octave 4' },
];
