import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

const category = ['Trillo', 'Humming', 'Gne', 'Apertura Vocali'];

const VocalizziTypeList = ({ route, navigation }) => {
	const { vocals } = route.params;

	const getNameRoute = route => {
		if (route === 'Apertura Vocali') {
			return 'AperturaVocali';
		} else {
			return route;
		}
	};

	return (
		<View style={styles.container}>
			{category.map(category => {
				return (
					<Button
						title={category}
						key={category}
						onPress={() =>
							navigation.navigate('VocalizziList', {
								vocals,
								name: getNameRoute(category),
							})
						}
					/>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'space-around',
		height: '100%',
	},
	playerButton: {
		flex: 1,
		paddingVertical: '10',
		backgroundColor: 'lightgreen',
	},
});

export default VocalizziTypeList;
