import { useAuthStore } from '@/store/auth/authStore';
import { useSearchServerInstance } from '../queries/auth.queries';

export const useMaxCount = () => {
	const { userOriginInstance } = useAuthStore();
	const { data: searchInstanceRes, isFetching: isSearching } =
		useSearchServerInstance({
			domain: userOriginInstance.replace(/^https:\/\//, ''),
			enabled: true,
		});

	return searchInstanceRes?.configuration?.statuses?.max_characters || 5000;
};
