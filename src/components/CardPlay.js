import React, { memo } from 'react';
import {
	Card,
	HStack,
	Heading,
	Icon,
	Pressable,
	Progress,
} from '@gluestack-ui/themed';

const CardPLay = ({
	onPress,
	title,
	RightIcon,
	progressValue,
	isPlaying = false,
}) => {
	const handleOnPress = () => {
		onPress(title);
	};
	return (
		<Pressable onPress={handleOnPress} m="$2">
			<Card
				size="lg"
				variant="elevated"
				backgroundColor={isPlaying ? '$green200' : '$white'}
			>
				<HStack justifyContent="space-between" alignItems="center">
					<Heading size="md">{title}</Heading>
					{RightIcon && (
						<Icon
							as={RightIcon}
							size="xl"
							color={isPlaying ? '$green700' : undefined}
						/>
					)}
				</HStack>
				{/* <Center mt={'$4'}>
					<Progress value={progressValue} size={'sm'}>
						<ProgressFilledTrack />
					</Progress>
				</Center> */}
			</Card>
		</Pressable>
	);
};
export default memo(CardPLay);
