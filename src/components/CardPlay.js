import { ProgressFilledTrack, Center } from '@gluestack-ui/themed';

import React, { memo } from 'react';
import {
	Card,
	HStack,
	Heading,
	Icon,
	Pressable,
	Progress,
} from '@gluestack-ui/themed';
const CardSelect = ({ onPress, title, RightIcon, progressValue }) => {
	const handleOnPress = () => {
		onPress(title);
	};
	return (
		<Pressable onPress={handleOnPress} bg="primary.400" m="$2">
			<Card size="lg" variant="elevated">
				<HStack justifyContent="space-between" alignItems="center">
					<Heading size="md">{title}</Heading>
					{RightIcon && (
						<Pressable onPress={handleOnPress}>
							<Icon as={RightIcon} size="xl" />
						</Pressable>
					)}
				</HStack>
				<Center mt={'$4'}>
					<Progress value={progressValue} size={'sm'}>
						<ProgressFilledTrack />
					</Progress>
				</Center>
			</Card>
		</Pressable>
	);
};
export default memo(CardSelect);
