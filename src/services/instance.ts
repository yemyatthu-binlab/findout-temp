import { useActiveDomainStore } from './../store/feed/activeDomain';
import { useAuthStore } from '@/store/auth/authStore';
import { useLanguageStore } from '@/store/feed/languageStore';
import { DEFAULT_WP_INSTANCE } from '@/util/constant';
import {
	ensureHttp,
	getAuthState,
	getSpecificServerStatus,
	replaceIdInUrl,
} from '@/util/helper/helper';
import { getActiveAuthState } from '@/util/storage';
import axios from 'axios';
import { report } from 'process';

const baseURL = `${process.env.API_URL ?? ''}`;

const instance = axios.create({
	baseURL,
});

instance.interceptors.request.use(async config => {
	if (config.headers?.skipInterceptor) return config;

	const { access_token: token, domain: userDomain } =
		await getActiveAuthState();

	const requestBaseURL = config.baseURL || '';
	const removeToken =
		config.params && config.params.hasOwnProperty('removeBearerToken');

	if (token && token.length > 0 && !removeToken) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	if (config.params && config.params.hasOwnProperty('isDynamicDomain')) {
		config.baseURL = ensureHttp(config.params?.domain_name);
	}

	if (removeToken) {
		config.headers.Authorization = undefined;
	}

	if (
		config.params?.domain_name &&
		config.params?.domain_name == 'https://home.channel.org'
	) {
		config.baseURL = ensureHttp(process.env.API_URL!);
	}

	if (config.url) {
		const { language: locale } = useLanguageStore.getState();
		if (locale) {
			if (['get', 'delete'].includes(config.method ?? '')) {
				config.params = { ...(config.params || {}), lang: locale };
			} else {
				if (!config.data || typeof config.data !== 'object') {
					config.data = {};
				}
				config.data.lang = locale;
			}
		}
	}

	return config;
});

export default instance;
