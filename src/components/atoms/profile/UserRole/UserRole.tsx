import React from 'react';
import { View } from 'react-native';
import { ThemeText } from '@/components/atoms/common/ThemeText/ThemeText';
import { useColorScheme } from 'nativewind';

type Props = {
	userRoles?: Patchwork.Role[] | undefined;
};

const UserRole = ({ userRoles }: Props) => {
	const { colorScheme } = useColorScheme();

	return (
		<>
			{userRoles && userRoles.length > 0 && (
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						gap: 4,
					}}
				>
					{userRoles.map(role => {
						let borderColor = role.color;
						let textColor = role.color;

						if (
							(role.color === '#000000' ||
								role.color === '#000' ||
								role.color == '' ||
								role.color === 'black') &&
							colorScheme === 'dark'
						) {
							textColor = '#fff';
							borderColor = '#fff';
						} else if (
							(role.color === '#ffffff' ||
								role.color === '#fff' ||
								role.color === 'white') &&
							colorScheme === 'light'
						) {
							textColor = '#6161ff';
							borderColor = '#6161ff';
						}

						return (
							<View
								key={role.id}
								className="border-[1px] px-1.5 rounded-md mx-1"
								style={{
									borderColor: borderColor,
								}}
							>
								<ThemeText
									style={{ color: textColor }}
									className="font-bold text-[11px] leading-4"
								>
									{role.name}
								</ThemeText>
							</View>
						);
					})}
				</View>
			)}
		</>
	);
};

export default UserRole;
