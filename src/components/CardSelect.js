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
	return (
		<Pressable
			onPress={onPress}
			bg="primary.400"
			p="$2"
			$pressed-opacity={0.6}
		>
			<Card size="lg" variant="elevated" m="$3">
				<HStack justifyContent="space-between" alignItems="center">
					<Heading mb="$1" size="md">
						{title}
					</Heading>

					<Icon as={ChevronsRightIcon} size="lg" />
				</HStack>
			</Card>
		</Pressable>
	);
};

export default memo(CardSelect);
