import { DEFAULT_API_URL } from '@/util/constant';
import { ensureHttp } from '@/util/helper/helper';
import { create } from 'zustand';

// type ActiveDomain = {
// 	domain_name: string;
// };

type ActiveDomainComposeState = {
	domain_name: string;
	actions: {
		setDomain: (domain: string) => void;
		clearDomain: (domain: string) => void;
	};
};

export const useActiveDomainStore = create<ActiveDomainComposeState>()(set => ({
	domain_name: process.env.API_URL ?? DEFAULT_API_URL,
	actions: {
		setDomain: domain =>
			set(state => {
				return { ...state, domain_name: ensureHttp(domain) };
			}),
		clearDomain: () => set(state => ({ ...state, domain_name: '' })),
	},
}));

export const useSelectedDomain = () =>
	useActiveDomainStore(state => state.domain_name);

export const useActiveDomainAction = () =>
	useActiveDomainStore(state => state.actions);
