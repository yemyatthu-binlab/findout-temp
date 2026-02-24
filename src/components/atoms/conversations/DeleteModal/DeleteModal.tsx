import { useTranslation } from 'react-i18next';
import CustomAlert from '../../common/CustomAlert/CustomAlert';

interface Props {
	visibile: boolean;
	onPressCancel: () => void;
	onPressDelete: () => void;
}
const DeleteModal = ({ visibile, onPressCancel, onPressDelete }: Props) => {
	const { t } = useTranslation();
	return (
		<CustomAlert
			isVisible={visibile}
			hasCancel
			confirmBtnText={t('common.delete')}
			extraOkBtnStyle={'text-patchwork-red-50'}
			message={t('conversation.delete_message')}
			handleCancel={onPressCancel}
			handleOk={onPressDelete}
			type="info"
		/>
	);
};

export default DeleteModal;
