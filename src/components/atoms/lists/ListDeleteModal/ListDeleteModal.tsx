import { useTranslation } from 'react-i18next';
import CustomAlert from '../../common/CustomAlert/CustomAlert';

interface ListDeleteModalProps {
	openDeleteModal: boolean;
	onPressHideDeleteModal: () => void;
	handleDeleteList: () => void;
	isPendingDeleteList: boolean;
}
const ListDeleteModal = ({
	openDeleteModal,
	onPressHideDeleteModal,
	handleDeleteList,
	isPendingDeleteList,
}: ListDeleteModalProps) => {
	const { t } = useTranslation();
	return (
		<CustomAlert
			isVisible={openDeleteModal}
			hasCancel
			confirmBtnText={t('list.delete_list_confirm_text')}
			title={t('list.delete_list_title')}
			message={t('list.delete_list_message')}
			handleCancel={onPressHideDeleteModal}
			handleOk={handleDeleteList}
			type="info"
			isPendingConfirm={isPendingDeleteList}
		/>
	);
};

export default ListDeleteModal;
