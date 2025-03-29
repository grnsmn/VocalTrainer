import { Text, Box, VStack } from '@gluestack-ui/themed';
import React, { useEffect, useRef, useState } from 'react';
import useStore from '../store';

const Bullet = ({ item, isActive, onComplete, bpm }) => {
	const {
		sounds: { click1, click2 },
	} = useStore();
	const timer = useRef(null);
	const [playCount, setPlayCount] = useState(0);

	useEffect(() => {
		if (isActive) {
			timer.current = setInterval(() => {
				setPlayCount(prev => {
					const newCount = prev + 1;
					if (newCount === item.duration) {
						click2?.replayAsync();
					} else {
						click1?.replayAsync();
					}
					return newCount;
				});
			}, (60 / bpm) * 1000); // Imposta l'intervallo di tempo desiderato

			return () => {
				clearInterval(timer.current);
			};
		} else {
			setPlayCount(0);
			clearInterval(timer.current);
		}
	}, [isActive]);

	useEffect(() => {
		if (playCount >= item.duration) {
			setPlayCount(0);
			clearInterval(timer.current);
			onComplete();
		}
	}, [playCount]);

	const renderDots = () => {
		return Array.from({ length: item.duration }).map((_, index) => (
			<Box
				key={index}
				width={10}
				height={10}
				borderRadius={5}
				borderWidth={1}
				borderColor="#000"
				backgroundColor={index < playCount ? '#000' : 'transparent'}
			/>
		));
	};

	return (
		<Box
			flexDirection="row"
			alignItems="center"
			justifyContent="space-between"
			flexWrap="wrap"
			gap={'$2'}
		>
			<Text bold={isActive} size="xl" maxWidth="70%">
				{`\u29BF ${item.definition}`}
			</Text>
			<Box
				flexDirection="row"
				gap={'$1'}
				flexWrap="wrap"
				alignItems="center"
				justifyContent="center"
			>
				{renderDots()}
			</Box>
		</Box>
	);
};

export default Bullet;
