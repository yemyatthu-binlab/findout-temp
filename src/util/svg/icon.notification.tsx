import { Ellipse, G, Path, Rect, Svg, SvgProps } from 'react-native-svg';
import customColor from '../constant/color';

interface ColorSchemeProps {
	colorScheme?: 'dark' | 'light';
}

export const NotificationFavoriteIcon = ({
	colorScheme,
	...props
}: SvgProps & ColorSchemeProps) => (
	<Svg width="17" height="17" viewBox="0 0 17 17" fill="none" {...props}>
		<Path
			fill={
				colorScheme === 'dark'
					? customColor['patchwork-primary-dark']
					: customColor['patchwork-primary']
			}
			d="m9.375 1.063 2.031 4.156 4.469.656c.375.063.688.313.813.688a.928.928 0 0 1-.25 1l-3.25 3.218.78 4.563a.982.982 0 0 1-.405.969c-.313.25-.72.25-1.063.093l-4-2.156-4.031 2.156a.959.959 0 0 1-1.032-.093.982.982 0 0 1-.406-.97l.75-4.562-3.25-3.219c-.25-.25-.344-.656-.25-1 .125-.375.438-.625.813-.687l4.5-.656 2-4.157A.974.974 0 0 1 8.5.5c.375 0 .719.219.875.563Z"
		/>
	</Svg>
);

export const NotificationCommentIcon = ({
	colorScheme,
	...props
}: SvgProps & ColorSchemeProps) => (
	<Svg fill="none" width="20" height="18" viewBox="0 0 20 18" {...props}>
		<Path
			fill={
				colorScheme === 'dark'
					? customColor['patchwork-primary-dark']
					: customColor['patchwork-primary']
			}
			d="M14 5h4a1 1 0 0 1 1 1v11l-3.333-2.769a1.002 1.002 0 0 0-.64-.231H7a1 1 0 0 1-1-1v-3H4.973c-.234 0-.46.082-.64.23L1 13V2a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v3Z"
		/>
		<Path
			stroke={customColor['patchwork-dark-100']}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M14 5h4a1 1 0 0 1 1 1v11l-3.333-2.769a1.002 1.002 0 0 0-.64-.231H7a1 1 0 0 1-1-1v-3m8-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v11l3.333-2.77c.18-.148.406-.23.64-.23H6m8-5v4a1 1 0 0 1-1 1H6"
		/>
	</Svg>
);
export const NotificationBoostedIcon = ({
	colorScheme,
	...props
}: SvgProps & ColorSchemeProps) => (
	<Svg width="17" height="17" viewBox="0 0 17 17" fill="none" {...props}>
		<Path
			fill={
				colorScheme === 'dark'
					? customColor['patchwork-primary-dark']
					: customColor['patchwork-primary']
			}
			d="M.531 7.188C1.281 5 3.344 3.5 5.656 3.5h5.407L9.78 2.219a.964.964 0 0 1 0-1.406.964.964 0 0 1 1.406 0l3 3a.964.964 0 0 1 0 1.406l-3 3a.964.964 0 0 1-1.406 0 .964.964 0 0 1 0-1.406L11.062 5.5H5.657c-1.468 0-2.75.938-3.218 2.344-.188.5-.75.781-1.282.625-.5-.188-.781-.75-.625-1.281Zm15.906 2.656a5.39 5.39 0 0 1-5.125 3.656H5.907l1.282 1.313a.964.964 0 0 1 0 1.406.964.964 0 0 1-1.407 0l-3-3a.964.964 0 0 1 0-1.406l3-3a.964.964 0 0 1 1.407 0 .964.964 0 0 1 0 1.406L5.905 11.5h5.407c1.468 0 2.75-.906 3.218-2.313.188-.5.75-.812 1.281-.624.5.187.782.75.626 1.28Z"
		/>
	</Svg>
);

export const NotificationPeopleFollowIcon = ({
	colorScheme,
	...props
}: SvgProps & ColorSchemeProps) => (
	<Svg width="21" height="17" viewBox="0 0 21 17" fill="none" {...props}>
		<Path
			fill={
				colorScheme === 'dark'
					? customColor['patchwork-primary-dark']
					: customColor['patchwork-primary']
			}
			d="M3.5 4.5c0-1.406.75-2.719 2-3.438 1.219-.718 2.75-.718 4 0 1.219.72 2 2.032 2 3.438 0 1.438-.781 2.75-2 3.469-1.25.718-2.781.718-4 0a3.977 3.977 0 0 1-2-3.469Zm-3 11.094C.5 12.5 2.969 10 6.063 10h2.843C12 10 14.5 12.5 14.5 15.594c0 .5-.438.906-.938.906H1.406a.907.907 0 0 1-.906-.906Zm15.75-5.344v-2h-2a.722.722 0 0 1-.75-.75.74.74 0 0 1 .75-.75h2v-2A.74.74 0 0 1 17 4a.76.76 0 0 1 .75.75v2h2a.76.76 0 0 1 .75.75.74.74 0 0 1-.75.75h-2v2A.74.74 0 0 1 17 11a.722.722 0 0 1-.75-.75Z"
		/>
	</Svg>
);

export const NotificationMentionIcon = ({
	colorScheme,
	...props
}: SvgProps & ColorSchemeProps) => (
	<Svg width="24" height="24" viewBox="0 0 18 20" fill="none" {...props}>
		<Path
			fill={
				colorScheme === 'dark'
					? customColor['patchwork-primary-dark']
					: customColor['patchwork-primary']
			}
			d="M7.276 17.424c-.85 0-1.66-.13-2.431-.391a6.112 6.112 0 0 1-2.074-1.19 5.701 5.701 0 0 1-1.428-1.989c-.34-.805-.51-1.751-.51-2.839 0-1.19.198-2.267.595-3.23a7.546 7.546 0 0 1 1.666-2.499 7.622 7.622 0 0 1 2.448-1.598A7.848 7.848 0 0 1 8.5 3.127c1.224 0 2.284.26 3.179.782a5.241 5.241 0 0 1 2.091 2.125c.499.907.748 1.955.748 3.145 0 .782-.119 1.468-.357 2.057a4.345 4.345 0 0 1-.918 1.462 3.743 3.743 0 0 1-1.258.867 3.414 3.414 0 0 1-1.343.289c-.487 0-.912-.113-1.275-.34a1.458 1.458 0 0 1-.68-.952h-.034c-.238.329-.55.6-.935.816-.385.204-.754.306-1.105.306-.669 0-1.213-.227-1.632-.68-.408-.465-.612-1.088-.612-1.87 0-.521.085-1.026.255-1.513.17-.499.408-.946.714-1.343a3.83 3.83 0 0 1 1.105-.952 2.71 2.71 0 0 1 1.36-.357c.283 0 .533.068.748.204.215.125.397.34.544.646h.034l.238-.714h1.547l-.782 3.74c-.238.975.023 1.462.782 1.462.34 0 .663-.125.969-.374.317-.25.572-.6.765-1.054.193-.465.289-1.009.289-1.632 0-.816-.159-1.57-.476-2.261a3.76 3.76 0 0 0-1.479-1.7c-.68-.43-1.575-.646-2.686-.646a5.37 5.37 0 0 0-2.125.442 5.902 5.902 0 0 0-1.87 1.275 6.34 6.34 0 0 0-1.309 2.006c-.317.77-.476 1.632-.476 2.584 0 1.11.227 2.034.68 2.771a4.386 4.386 0 0 0 1.819 1.649c.76.363 1.581.544 2.465.544a4.83 4.83 0 0 0 1.36-.204 6.141 6.141 0 0 0 1.224-.459l.544 1.36a6.23 6.23 0 0 1-1.615.612 7.056 7.056 0 0 1-1.717.204ZM7.14 12.12a.938.938 0 0 0 .527-.17c.181-.113.38-.312.595-.595L8.67 9.06c-.17-.329-.43-.493-.782-.493-.34 0-.635.13-.884.391-.238.26-.425.578-.561.952a3.386 3.386 0 0 0-.187 1.071c0 .76.295 1.139.884 1.139Z"
		/>
	</Svg>
);

export const NotificationPostedIcon = ({
	colorScheme,
	...props
}: SvgProps & ColorSchemeProps) => (
	<Svg fill="none" viewBox="-4.8 -4.8 33.6 33.6" {...props}>
		<Path
			stroke={
				colorScheme === 'dark'
					? customColor['patchwork-primary-dark']
					: customColor['patchwork-primary']
			}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M17 19v-8M3 11h10M3 7h10M3 15h6m4 0h8"
		/>
	</Svg>
);

export const NotificationUpdateIcon = ({
	colorScheme,
	...props
}: SvgProps & ColorSchemeProps) => (
	<Svg fill="none" stroke="#000" viewBox="-6 -6 36 36" {...props}>
		<G
			stroke={
				colorScheme === 'dark'
					? customColor['patchwork-primary-dark']
					: customColor['patchwork-primary']
			}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
		>
			<Path d="M5.528 16.702a8 8 0 1 0-1.512-4.2m0 0-1.5-1.5m1.5 1.5 1.5-1.5" />
			<Path d="M12 8v4l3 3" />
		</G>
	</Svg>
);

export const NotificationPollIcon = ({
	colorScheme,
	...props
}: SvgProps & ColorSchemeProps) => (
	<Svg
		fill={
			colorScheme === 'dark'
				? customColor['patchwork-primary-dark']
				: customColor['patchwork-primary']
		}
		stroke={
			colorScheme === 'dark'
				? customColor['patchwork-primary-dark']
				: customColor['patchwork-primary']
		}
		viewBox="-204.8 -204.8 921.6 921.6"
		{...props}
	>
		<Path d="M448 432V80c0-26.5-21.5-48-48-48H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48zM112 192c-8.84 0-16-7.16-16-16v-32c0-8.84 7.16-16 16-16h128c8.84 0 16 7.16 16 16v32c0 8.84-7.16 16-16 16H112zm0 96c-8.84 0-16-7.16-16-16v-32c0-8.84 7.16-16 16-16h224c8.84 0 16 7.16 16 16v32c0 8.84-7.16 16-16 16H112zm0 96c-8.84 0-16-7.16-16-16v-32c0-8.84 7.16-16 16-16h64c8.84 0 16 7.16 16 16v32c0 8.84-7.16 16-16 16h-64z" />
	</Svg>
);

export const NotificationAdminReportIcon = ({
	colorScheme,
	...props
}: SvgProps & ColorSchemeProps) => (
	<Svg
		fill={
			colorScheme === 'dark'
				? customColor['patchwork-primary-dark']
				: customColor['patchwork-primary']
		}
		viewBox="-768 -768 3456 3456"
		{...props}
	>
		<Path
			fillRule="evenodd"
			d="M983.727 5.421 1723.04 353.62c19.765 9.374 32.414 29.252 32.414 51.162v601.525c0 489.6-424.207 719.774-733.779 887.943l-34.899 18.975c-8.47 4.517-17.731 6.889-27.105 6.889-9.262 0-18.523-2.372-26.993-6.89l-34.9-18.974C588.095 1726.08 164 1495.906 164 1006.306V404.78c0-21.91 12.65-41.788 32.414-51.162L935.727 5.42c15.134-7.228 32.866-7.228 48 0ZM757.088 383.322c-176.075 0-319.285 143.323-319.285 319.398 0 176.075 143.21 319.285 319.285 319.285 1.92 0 3.84 0 5.76-.113l58.504 58.503h83.689v116.781h116.781v83.803l91.595 91.482h313.412V1059.05l-350.57-350.682c.114-1.807.114-3.727.114-5.647 0-176.075-143.21-319.398-319.285-319.398Zm0 112.942c113.732 0 206.344 92.724 205.327 216.62l-3.953 37.271 355.426 355.652v153.713h-153.713l-25.412-25.299v-149.986h-116.78v-116.78H868.108l-63.812-63.7-47.209 5.309c-113.732 0-206.344-92.5-206.344-206.344 0-113.732 92.612-206.456 206.344-206.456Zm4.98 124.98c-46.757 0-84.705 37.948-84.705 84.706s37.948 84.706 84.706 84.706c46.757 0 84.706-37.948 84.706-84.706s-37.949-84.706-84.706-84.706Z"
		/>
	</Svg>
);

export const NotificationStatusImagesIcon = (props: SvgProps) => (
	<Svg fill="#6C7275" stroke="#6C7275" viewBox="-256 -256 1024 1024" {...props}>
		<Ellipse cx={373.14} cy={219.33} rx={46.29} ry={46} fill={'none'} />
		<Path d="M80 132v328a20 20 0 0 0 20 20h392a20 20 0 0 0 20-20V132a20 20 0 0 0-20-20H100a20 20 0 0 0-20 20Zm293.14 41.33a46 46 0 1 1-46.28 46 46.19 46.19 0 0 1 46.28-46Zm-261.41 276v-95.48l122.76-110.2L328.27 337l-113 112.33Zm368.27 0H259l144.58-144L480 370.59Z" />
		<Path d="M20 32A20 20 0 0 0 0 52v344a20 20 0 0 0 20 20h28V100a20 20 0 0 1 20-20h380V52a20 20 0 0 0-20-20Z" />
	</Svg>
);

export const NotificationEmptyIcon = ({
	colorScheme,
	...props
}: SvgProps & ColorSchemeProps) => (
	<Svg
		width={40}
		height={40}
		viewBox="0 0 512 512"
		fill={colorScheme === 'dark' ? '#fff' : '#000'}
		stroke={colorScheme === 'dark' ? '#fff' : '#000'}
		{...props}
	>
		<Path d="M448 464a15.92 15.92 0 0 1-11.31-4.69l-384-384a16 16 0 0 1 22.62-22.62l384 384A16 16 0 0 1 448 464ZM440.08 341.31c-1.66-2-3.29-4-4.89-5.93-22-26.61-35.31-42.67-35.31-118 0-39-9.33-71-27.72-95-13.56-17.73-31.89-31.18-56.05-41.12a3 3 0 0 1-.82-.67C306.6 51.49 282.82 32 256 32s-50.59 19.49-59.28 48.56a3.13 3.13 0 0 1-.81.65 157.88 157.88 0 0 0-21.88 11 8 8 0 0 0-1.49 12.49l261.78 261.74a8 8 0 0 0 13.6-6.63 35.39 35.39 0 0 0-7.84-18.5ZM112.14 217.35c0 75.36-13.29 91.42-35.31 118-1.6 1.93-3.23 3.89-4.89 5.93a35.16 35.16 0 0 0-4.65 37.62c6.17 13 19.32 21.07 34.33 21.07H312.8a8 8 0 0 0 5.66-13.66l-192-192a8 8 0 0 0-13.62 5q-.7 8.69-.7 18.04ZM256 480a80.06 80.06 0 0 0 70.44-42.13 4 4 0 0 0-3.54-5.87H189.12a4 4 0 0 0-3.55 5.87A80.06 80.06 0 0 0 256 480Z" />
	</Svg>
);

export const NotificationChatIcon = ({
	colorScheme,
	...props
}: SvgProps & ColorSchemeProps) => (
	<Svg viewBox="0 0 24 24" width={26} height={26} fill="none">
		<Path
			d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
			fill={
				colorScheme === 'dark'
					? customColor['patchwork-primary-dark']
					: customColor['patchwork-primary']
			}
		></Path>
		<Path
			d="M15 12C15 12.5523 15.4477 13 16 13C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11C15.4477 11 15 11.4477 15 12Z"
			fill={colorScheme === 'dark' ? '#000' : '#fff'}
		></Path>
		<Path
			d="M11 12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12Z"
			fill={colorScheme === 'dark' ? '#000' : '#fff'}
		></Path>
		<Path
			d="M7 12C7 12.5523 7.44772 13 8 13C8.55228 13 9 12.5523 9 12C9 11.4477 8.55228 11 8 11C7.44772 11 7 11.4477 7 12Z"
			fill={colorScheme === 'dark' ? '#000' : '#fff'}
		></Path>
	</Svg>
);

export const NotificationSeveredRelationshipIcon = ({
	colorScheme,
	...props
}: SvgProps & ColorSchemeProps) => (
	<Svg
		fill={
			colorScheme === 'dark'
				? customColor['patchwork-grey-400']
				: customColor['patchwork-grey-100']
		}
		viewBox="0 0 36 36"
		width={30}
		height={30}
		preserveAspectRatio="xMidYMid meet"
		{...props}
	>
		<G strokeWidth="0"></G>
		<G strokeLinecap="round" strokeLinejoin="round"></G>
		<G>
			<Path d="M33,7.64c-1.34-2.75-5.09-5-9.69-3.69a9.87,9.87,0,0,0-6,4.84,18.9,18.9,0,0,0-2.23,5.33l5.28,2.34-4.6,4.37,3.49,4.1,1.52-1.3L18.54,21l5.4-5.13L17.58,13A16.23,16.23,0,0,1,19.75,8.9a7.68,7.68,0,0,1,4.11-3c3.34-.89,6.34.6,7.34,2.65,1.55,3.18.85,6.72-2.14,10.81A57.16,57.16,0,0,1,18,30.16,57.16,57.16,0,0,1,6.94,19.33c-3-4.1-3.69-7.64-2.14-10.81a5.9,5.9,0,0,1,5.33-2.93,7.31,7.31,0,0,1,2,.29,7.7,7.7,0,0,1,3.38,2l.15-.3a10.66,10.66,0,0,1,1-1.41,9.64,9.64,0,0,0-3.94-2.22C8.2,2.66,4.34,4.89,3,7.64c-1.88,3.85-1.1,8.18,2.32,12.87C8,24.18,11.83,27.9,17.39,32.22a1,1,0,0,0,1.23,0c5.55-4.31,9.39-8,12.07-11.71C34.1,15.82,34.88,11.49,33,7.64Z"></Path>
			<Rect x="0" y="0" width="36" height="36" fillOpacity="0"></Rect>
		</G>
	</Svg>
);

export const NotificationModerationWarningIcon = ({
	colorScheme,
	...props
}: SvgProps & ColorSchemeProps) => (
	<Svg viewBox="0 0 24 24" width={32} height={32} fill="none" {...props}>
		<G strokeWidth="0"></G>
		<G strokeLinecap="round" strokeLinejoin="round"></G>
		<G>
			<Path
				d="M12 16.99V17M12 7V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
				stroke={
					colorScheme === 'dark'
						? customColor['patchwork-grey-400']
						: customColor['patchwork-grey-100']
				}
				strokeWidth="1.5"
				strokeLinecap="round"
				stroke-Linejoin="round"
			></Path>
		</G>
	</Svg>
);

export const AdminNotificationIcon = ({
	colorScheme,
	...props
}: SvgProps & ColorSchemeProps) => (
	<Svg
		fill={
			colorScheme === 'dark'
				? customColor['patchwork-grey-400']
				: customColor['patchwork-grey-100']
		}
		viewBox="0 0 1920 1920"
		width={24}
		height={24}
		{...props}
	>
		<G strokeWidth="0"></G>
		<G strokeLinecap="round" strokeLinejoin="round"></G>
		<G>
			<Path
				d="M276.941 440.584v565.722c0 422.4 374.174 625.468 674.71 788.668l8.02 4.292 8.131-4.292c300.537-163.2 674.71-366.268 674.71-788.668V440.584l-682.84-321.657L276.94 440.584Zm682.73 1479.529c-9.262 0-18.523-2.372-26.993-6.89l-34.9-18.974C588.095 1726.08 164 1495.906 164 1006.306V404.78c0-21.91 12.65-41.788 32.414-51.162L935.727 5.42c15.134-7.228 32.866-7.228 48 0l739.313 348.2c19.765 9.374 32.414 29.252 32.414 51.162v601.525c0 489.6-424.207 719.774-733.779 887.943l-34.899 18.975c-8.47 4.517-17.731 6.889-27.105 6.889Zm467.158-547.652h-313.412l-91.595-91.482v-83.803H905.041v-116.78h-83.69l-58.503-58.504c-1.92.113-3.84.113-5.76.113-176.075 0-319.285-143.21-319.285-319.285 0-176.075 143.21-319.398 319.285-319.398 176.075 0 319.285 143.323 319.285 319.398 0 1.92 0 3.84-.113 5.647l350.57 350.682v313.412Zm-266.654-112.941h153.713v-153.713L958.462 750.155l3.953-37.27c1.017-123.897-91.595-216.621-205.327-216.621S550.744 588.988 550.744 702.72c0 113.845 92.612 206.344 206.344 206.344l47.21-5.309 63.811 63.7h149.873v116.78h116.781v149.986l25.412 25.299Zm-313.4-553.57c0 46.758-37.949 84.706-84.706 84.706-46.758 0-84.706-37.948-84.706-84.706s37.948-84.706 84.706-84.706c46.757 0 84.706 37.948 84.706 84.706"
				fillRule="evenodd"
			></Path>
		</G>
	</Svg>
);
