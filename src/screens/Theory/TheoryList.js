import CardSelect from '@/src/components/CardSelect';
import Loader from '@/src/components/Loader';
import useAppwriteStorage from '@/src/hooks/useAppwriteStorage';
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';

const TheoryList = ({ navigation }) => {
	const { data, loading, error, getFileUrl, refreshData } =
		useAppwriteStorage();
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			await refreshData();
		} catch (err) {
			console.error('Error refreshing data:', err);
		} finally {
			setRefreshing(false);
		}
	};

	const renderItem = ({ item }) => {
		// Extract filename from item name
		const fileName = item.name?.replace('.pdf', '') || 'Documento PDF';

		return (
			<CardSelect
				title={fileName}
				style={styles.item}
				onPress={async () => {
					const url = await getFileUrl(item.$id);
					if (url) {
						navigation.navigate('PdfViewer', {
							url: url,
							title: fileName,
						});
					}
				}}
			/>
		);
	};

	if (loading) {
		return <Loader />;
	}

	if (error) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>Errore: {error}</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={data || []}
				renderItem={renderItem}
				keyExtractor={item => item.$id}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 22,
	},
	item: {
		backgroundColor: '#f9c2ff',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	title: {
		fontSize: 18,
	},
	loadingText: {
		fontSize: 16,
		textAlign: 'center',
		marginTop: 50,
		color: '#666',
	},
	errorText: {
		fontSize: 16,
		textAlign: 'center',
		marginTop: 50,
		color: '#ff4444',
	},
});

export default TheoryList;
