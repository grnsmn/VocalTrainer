import { VStack } from '@/components/ui/vstack';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import AnimatedJumpNotes from '../../assets/lotties/jump_notes.json';
import React from 'react';
import LottieView from 'lottie-react-native';

const Loader = () => {
	return (
		<VStack space="sm" className="flex-1 justify-center items-center">
			<LottieView
				webStyle={{ width: 100, height: 100 }}
				source={AnimatedJumpNotes}
				autoPlay
				loop={true}
				style={{
					width: 60,
					height: 60,
				}}
			/>
			<Text size="md">Please Wait</Text>
		</VStack>
	);
};

export default Loader;
