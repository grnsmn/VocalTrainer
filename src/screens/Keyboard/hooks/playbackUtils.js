import { Note, Scale } from 'tonal';
import { SCALE_TYPES } from '../keyboard.constants';

export const NOTE_STEP_MS = bpm => Math.round(60000 / bpm);
export const MAX_RETRY_PER_STEP = 25;

// Normalize enharmonic note names for keyboard matching.
export const normalizeNote = note =>
	Note.simplify(note)
		.replace('Db', 'C#')
		.replace('Eb', 'D#')
		.replace('Gb', 'F#')
		.replace('Ab', 'G#')
		.replace('Bb', 'A#');

// Build an ascending+descending pentatonic sequence with octave rollover.
export const buildScaleSequence = (selectedKey, selectedScaleType, startOctave) => {
	const scaleType = SCALE_TYPES.find(type => type.id === selectedScaleType);

	if (!scaleType) {
		return [];
	}

	const notes = Scale.get(`${selectedKey} ${scaleType.tonalName}`).notes;

	if (!notes.length) {
		return [];
	}

	const ascending = [];
	let previousMidi = null;

	notes.forEach(noteName => {
		let octave = startOctave;
		let candidateNote = normalizeNote(`${noteName}${octave}`);
		let candidateMidi = Note.midi(candidateNote);

		while (previousMidi !== null && candidateMidi <= previousMidi) {
			octave += 1;
			candidateNote = normalizeNote(`${noteName}${octave}`);
			candidateMidi = Note.midi(candidateNote);
		}

		ascending.push(candidateNote);
		previousMidi = candidateMidi;
	});

	let topOctave = startOctave + 1;
	let topNote = normalizeNote(`${selectedKey}${topOctave}`);
	let topNoteMidi = Note.midi(topNote);

	while (topNoteMidi <= previousMidi) {
		topOctave += 1;
		topNote = normalizeNote(`${selectedKey}${topOctave}`);
		topNoteMidi = Note.midi(topNote);
	}

	const fullAscending = [...ascending, topNote];
	const descending = [...fullAscending].slice(0, -1).reverse();

	return [...fullAscending, ...descending];
};
