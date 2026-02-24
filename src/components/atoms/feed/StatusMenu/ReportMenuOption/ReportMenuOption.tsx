import React, { useState } from 'react';
import { MenuOption } from 'react-native-popup-menu';
import MenuOptionIcon from '../MenuOptionIcon/MenuOptionIcon';
import ReportContentModal from './ReportContentModal/ReportContentModal';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppIcons } from '@/util/icons/icon.common';
import customColor from '@/util/constant/color';

const ReportMenuOption = ({
	status,
	hideMenu,
}: {
	status: Patchwork.Status;
	hideMenu: () => void;
}) => {
	const { t } = useTranslation();
	const [showModal, setShowModal] = useState(false);
	const { colorScheme } = useColorScheme();

	return (
		<>
			{showModal && (
				<ReportContentModal
					visible={showModal}
					onClose={() => setShowModal(false)}
					status={status}
				/>
			)}
			<MenuOption onSelect={() => setShowModal(true)}>
				<MenuOptionIcon
					icon={
						<FontAwesomeIcon
							icon={AppIcons.report}
							size={18}
							color={
								colorScheme == 'dark'
									? '#fff'
									: customColor['patchwork-grey-100']
							}
						/>
					}
					name={t('timeline.report')}
				/>
			</MenuOption>
		</>
	);
};

export default ReportMenuOption;
