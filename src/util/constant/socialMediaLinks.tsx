import React from 'react';
import {
	TwitterIcon,
	FacebookIcon,
	InstagramIcon,
	LinkedinIcon,
	RedditIcon,
	YoutubeIcon,
	TiktokIcon,
	TwitchIcon,
	PatreonIcon,
	GlobeIcon,
} from '@/util/svg/icon.profile';

export const SOCIAL_MEDIA_LINKS = [
	{ icon: <GlobeIcon />, title: 'Website' },
	{ icon: <FacebookIcon />, title: 'Facebook' },
	{ icon: <InstagramIcon />, title: 'Instagram' },
	{ icon: <LinkedinIcon />, title: 'Linkedin' },
	{ icon: <RedditIcon />, title: 'Reddit' },
	{ icon: <YoutubeIcon />, title: 'Youtube' },
	{ icon: <TiktokIcon />, title: 'TikTok' },
	{ icon: <TwitchIcon />, title: 'Twitch' },
	{ icon: <PatreonIcon />, title: 'Patreon' },
];

export const Icons: Record<string, React.ReactNode> = {
	Website: <GlobeIcon />,
	Facebook: <FacebookIcon />,
	Instagram: <InstagramIcon />,
	Linkedin: <LinkedinIcon />,
	Reddit: <RedditIcon />,
	Youtube: <YoutubeIcon />,
	Tiktok: <TiktokIcon />,
	Twitch: <TwitchIcon />,
	Patreon: <PatreonIcon />,
};

export const DefaultBioTextForChannel =
	'This Channel is curated by a human and distributed automatically. See https://site.qlub.social/qlub/. Questions about content? DM me! Report Community Guideline violations to the Channel.org server.';
