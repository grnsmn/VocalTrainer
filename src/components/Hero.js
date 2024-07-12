import React from 'react';
import icon from '../../assets/icon.png';
import { Image } from '@gluestack-ui/themed';

const Hero = () => {
	return (
		<Image
			m={'$4'}
			size="2xl"
			alignSelf="center"
			borderRadius="$full"
			source={icon}
			alt="ed_microphone"
		/>
	);
};

export default Hero;
