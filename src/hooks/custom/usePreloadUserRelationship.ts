import {
	useCheckRelationships,
	useSpecificServerProfile,
} from '../queries/profile.queries';

export const usePreloadUserRelationship = (
	status: Patchwork.Status,
	extraEnableOption: boolean,
) => {
	const { data: specificServerProfile } = useSpecificServerProfile({
		q: status?.account?.url as string,
		options: {
			enabled: !!status?.account?.url && extraEnableOption,
			staleTime: Infinity,
		},
	});

	const { data: relationships } = useCheckRelationships({
		accountIds: [specificServerProfile?.accounts[0]?.id || ''],
		options: {
			enabled: !!specificServerProfile?.accounts[0]?.id && extraEnableOption,
			staleTime: Infinity,
		},
	});
};

export default usePreloadUserRelationship;
