import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ChevronsRightIcon, Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import React, { memo } from 'react';
import { PressableScale } from 'pressto';

const CardSelect = ({ onPress, title }) => {
	const handleOnPress = () => {
		if (!!onPress) {
			onPress(title);
		}
	};

	return (
		<PressableScale onPress={handleOnPress} android_ripple={null} animationType='spring' style={{ borderRadius: 12 }}>
			<Card size="lg" variant="elevated" className="m-2">
				<HStack className="justify-between items-center">
					<Heading size="md">{title}</Heading>

					<Icon as={ChevronsRightIcon} />
				</HStack>
			</Card>
		</PressableScale>
	);
};

export default memo(CardSelect);
