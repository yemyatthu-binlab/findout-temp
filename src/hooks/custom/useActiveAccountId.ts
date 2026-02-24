import { useEffect, useState } from 'react';
import { getMultiAuthState } from '@/util/storage';

export const useActiveAccountId = () => {
	const [activeId, setActiveId] = useState<string | null>(null);
	const fetchActiveId = async () => {
		const state = await getMultiAuthState();
		setActiveId(state?.activeId ?? null);
	};

	useEffect(() => {
		fetchActiveId();
	}, []);

	return activeId;
};
