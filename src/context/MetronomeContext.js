import React, { createContext, useContext } from 'react';
import { useMetronome } from '../hooks/useMetronome';

/**
 * METRONOME CONTEXT
 *
 * Perché un Context invece di props drilling?
 * - Props drilling: Breath → Bullet richiede di passare playClick1/playClick2
 * - Context: Qualsiasi componente figlio può accedere alle funzioni direttamente
 *
 * Come funziona:
 * 1. MetronomeProvider wrappa i componenti che hanno bisogno del metronomo
 * 2. I player audio vengono creati UNA SOLA VOLTA nel provider
 * 3. Qualsiasi componente figlio può chiamare useMetronomeContext()
 *
 * Vantaggi:
 * - Niente props drilling (Breath non deve passare nulla a Bullet)
 * - I player sono singleton (creati una volta, usati ovunque)
 * - Pattern React standard, facile da capire e mantenere
 */

// Creiamo il Context con valore di default undefined
// Così se qualcuno usa useMetronomeContext fuori dal provider, errore chiaro
const MetronomeContext = createContext(undefined);

/**
 * Provider che wrappa i componenti che hanno bisogno del metronomo.
 * Crea i player audio una sola volta e li rende disponibili a tutti i figli.
 */
export const MetronomeProvider = ({ children }) => {
	// Qui chiamiamo useMetronome UNA SOLA VOLTA per tutto l'albero dei componenti
	const { playClick1, playClick2 } = useMetronome();

	return (
		<MetronomeContext.Provider value={{ playClick1, playClick2 }}>
			{children}
		</MetronomeContext.Provider>
	);
};

/**
 * Hook per accedere al metronomo da qualsiasi componente figlio.
 * Lancia errore se usato fuori dal MetronomeProvider.
 */
export const useMetronomeContext = () => {
	const context = useContext(MetronomeContext);

	if (context === undefined) {
		throw new Error(
			'useMetronomeContext deve essere usato dentro un MetronomeProvider',
		);
	}

	return context;
};
