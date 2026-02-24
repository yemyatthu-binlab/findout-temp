import React, { createContext, useContext, ReactNode } from 'react';
import {
	StatusCurrentPage,
	StatusOrigin,
	StatusType,
} from './statusItemContext.type';

interface StatusContextProps {
	parentStatus: Patchwork.Status;
	currentPage: StatusCurrentPage;
	statusType: StatusType;
	comeFrom?: StatusOrigin;
	extraPayload?: Record<string, any> | undefined;
}

const StatusContext = createContext<StatusContextProps | undefined>(undefined);

export const StatusContextProvider = ({
	children,
	value,
}: {
	children: ReactNode;
	value: StatusContextProps;
}) => {
	const statusPropWithDefaultValue: StatusContextProps = {
		comeFrom: 'other',
		...value,
	};

	return (
		<StatusContext.Provider value={statusPropWithDefaultValue}>
			{children}
		</StatusContext.Provider>
	);
};

export const useStatusContext = () => {
	const context = useContext(StatusContext);
	if (!context) {
		throw new Error(
			'useStatusContext must be used within a StatusContextProvider',
		);
	}
	return context;
};
