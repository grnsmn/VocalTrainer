import React, { memo } from 'react';
import {
	Card,
	ChevronsRightIcon,
	HStack,
	Heading,
	Icon,
	Pressable,
} from '@gluestack-ui/themed';

const CardSelect = ({ onPress, title }) => {
	const handleOnPress = () => {
		onPress(title);
	};

	return (
		<Pressable onPress={handleOnPress} bg="primary.400" m="$2">
			<Card size="lg" variant="elevated">
				<HStack justifyContent="space-between" alignItems="center">
					<Heading size="md">{title}</Heading>

					<Icon as={ChevronsRightIcon} />
				</HStack>
			</Card>
		</Pressable>
	);
};

export default memo(CardSelect);
