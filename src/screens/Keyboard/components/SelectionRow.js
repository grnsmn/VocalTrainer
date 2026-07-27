import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Render selectable chips for keys or scale types.
const SelectionRow = ({ items, selectedItem, onSelect, style }) => {
	return (
		<View style={[styles.row, style]}>
			{items.map(item => {
				const itemId = typeof item === 'string' ? item : item.id;
				const itemLabel = typeof item === 'string' ? item : item.label;
				const isActive = selectedItem === itemId;

				return (
					<Pressable
						key={itemId}
						onPress={() => onSelect(itemId)}
						style={[styles.chip, isActive && styles.chipActive]}
					>
						<Text style={[styles.chipText, isActive && styles.chipTextActive]}>
							{itemLabel}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		justifyContent: 'center',
	},
	chip: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: '#E9F4FF',
		borderRadius: 999,
	},
	chipActive: {
		backgroundColor: '#005DB4',
	},
	chipText: {
		color: '#005DB4',
		fontSize: 12,
		fontWeight: '600',
	},
	chipTextActive: {
		color: '#FFFFFF',
	},
});

export default SelectionRow;
