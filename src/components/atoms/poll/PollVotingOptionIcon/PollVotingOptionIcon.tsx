import React from 'react';
import {
	CheckboxOutlined,
	CheckboxSolid,
	PollRadioCheckedIcon,
	PollRadioOutlined,
} from '@/util/svg/icon.common';

type IconType =
	| 'checkboxOutline'
	| 'checkboxSolid'
	| 'radioChecked'
	| 'radioOutline';

interface PollVotingOptionIconProps {
	type: IconType;
	fill?: string;
}

const PollVotingOptionIcon = ({ type, fill }: PollVotingOptionIconProps) => {
	switch (type) {
		case 'checkboxOutline':
			return <CheckboxOutlined />;
		case 'checkboxSolid':
			return <CheckboxSolid />;
		case 'radioChecked':
			return <PollRadioCheckedIcon fill={fill} />;
		case 'radioOutline':
			return <PollRadioOutlined />;
	}
};

export default PollVotingOptionIcon;
