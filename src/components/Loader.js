import React from 'react';
import { Text } from '@gluestack-ui/themed';
import { Spinner, VStack } from '@gluestack-ui/themed';

const Loader = () => {
	return (
		<VStack flex={1} space="sm" justifyContent="center" alignItems="center">
			<Spinner size="small" />
			<Text size="md">Please Wait</Text>
		</VStack>
	);
};

export default Loader;
