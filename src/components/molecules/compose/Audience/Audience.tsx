import React, { useState } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { ThemeText } from '../../../atoms/common/ThemeText/ThemeText';
import styles from './Audience.style';
import { useColorScheme } from 'nativewind';
import ThemeModal from '../../../atoms/common/Modal/Modal';
import AudienceList from '@/components/organisms/compose/AudienceList/AudienceList';
import { ChevronDownIcon } from '@/util/svg/icon.common';
import { ComposeCommunityIcon } from '@/util/svg/icon.compose';
const Audience = () => {
	const { colorScheme } = useColorScheme();
	const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
	const [modalVisible, setModalVisible] = useState(false);

  const handleSelectCommunity = (community: string) => {
    setSelectedCommunities((prev) => 
      prev.includes(community) ? prev.filter((item) => item !== community) : [...prev, community]
    );
  };

	const displayText = selectedCommunities.length > 0 ? selectedCommunities.join(', ') : 'Select communities';


	return (
		<>
			<ScrollView
				showsHorizontalScrollIndicator={false}
				style={{
					flexGrow: 0,
				}}
				keyboardShouldPersistTaps={'always'}
				contentContainerStyle={{
					paddingBottom: 16,
					paddingHorizontal: 16,
				}}
				horizontal
				bounces={false}
			>
				<Pressable
					className={styles.audienceButtonContainer}
					onPress={() => setModalVisible(true)}
				>
					<ComposeCommunityIcon {...{ colorScheme }} />
					<ThemeText className="px-2">{displayText}</ThemeText>
					<ChevronDownIcon {...{ colorScheme }} />
				</Pressable>
			</ScrollView>
			<ThemeModal
				isFlex
        hasNotch={false}
        {...{
          openThemeModal: modalVisible,
          onCloseThemeModal: () => setModalVisible(false),
        }}
        containerStyle={{ borderRadius: 24 }}
			>
				<AudienceList
				  selectedCommunities={selectedCommunities}
					onSelectCommunity={handleSelectCommunity}
					onClose={() => setModalVisible(false)}
				/>
			</ThemeModal>
		</>
	);
};

export default Audience;
