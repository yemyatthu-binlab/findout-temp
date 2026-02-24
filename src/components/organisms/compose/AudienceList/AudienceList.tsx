// src/organisms/CommunitySelector.tsx
import React, { useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	Pressable,
} from 'react-native';
import {
	CheckboxOutlined,
	CheckboxSolid,
	CloseIcon,
	SearchIcon,
} from '@/util/svg/icon.common';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import TextInput from '@/components/atoms/common/TextInput/TextInput';
import { useColorScheme } from 'nativewind';

interface AudienceListProps {
	selectedCommunities: string[];
	onSelectCommunity: (community: string) => void;
	onClose: () => void;
}

const communities = [
	'Followers',
	'Breaking News - World',
	'OSINT',
	'News & Media',
	'Weather',
	// Add more communities as needed
];

const AudienceList = ({
	selectedCommunities,
	onSelectCommunity,
	onClose,
}: AudienceListProps) => {
	const { colorScheme } = useColorScheme();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCommunity, setSelectedCommunity] = useState<string | null>(
		null,
	);

	const filteredCommunities = communities.filter(community =>
		community.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleSelect = (community: string) => {
		setSelectedCommunity(community);
		onSelectCommunity(community);
	};

	return (
		<View className="flex-1 p-1">
			<View className="justify-center">
				<ThemeText size={'md_16'} className="text-center font-NewsCycle_Bold">
					Choose audience
				</ThemeText>
				<TouchableOpacity
					activeOpacity={0.8}
					className=" absolute right-0"
					onPress={onClose}
				>
					<CloseIcon {...{ colorScheme }} />
				</TouchableOpacity>
			</View>
			<TextInput
				placeholder="Search ..."
				extraContainerStyle="h-11 my-3 mx-1"
				value={searchQuery}
				onChangeText={val => setSearchQuery(val)}
				startIcon={<SearchIcon />}
			/>
			<FlatList
				data={filteredCommunities}
				keyExtractor={item => item}
				renderItem={({ item }) => (
					<Pressable
						className="flex-row items-center py-3"
						onPress={() => onSelectCommunity(item)}
					>
						{selectedCommunities.includes(item) ? (
							<CheckboxSolid />
						) : (
							<CheckboxOutlined />
						)}
						<ThemeText className="ml-3">{item}</ThemeText>
					</Pressable>
				)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.7)',
	},
	modalContent: {
		width: '90%',
		backgroundColor: '#1C1C1E',
		borderRadius: 10,
		padding: 20,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 10,
	},
	title: {
		color: '#fff',
		fontSize: 18,
	},
	searchInput: {
		height: 40,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		backgroundColor: '#333',
		color: '#fff',
		marginBottom: 10,
	},
	communityItem: {
		paddingVertical: 10,
	},
	communityText: {
		color: '#fff',
	},
});

export default AudienceList;
