import { useTranslation } from 'react-i18next';
import CustomAlert from '../../common/CustomAlert/CustomAlert';

interface FollowToListModalProps {
	followUserName: string;
	openModal: boolean;
	onPressHideModal: () => void;
	onPressConfirm: () => void;
}
const FollowToListModal = ({
	followUserName,
	openModal,
	onPressHideModal,
	onPressConfirm,
}: FollowToListModalProps) => {
	const { t } = useTranslation();
	return (
		<CustomAlert
			isVisible={openModal}
			hasCancel
			confirmBtnText={t('list.follow_and_add_to_list')}
			title={t('list.follow_user')}
			message={t('list.follow_to_list_message', { username: followUserName })}
			handleCancel={onPressHideModal}
			handleOk={onPressConfirm}
			type="info"
		/>
	);
};

export default FollowToListModal;
