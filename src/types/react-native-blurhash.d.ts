declare module 'react-native-blurhash' {
	import React from 'react';
	import { ViewProps } from 'react-native';

	export interface BlurhashProps extends ViewProps {
		/**
		 * The blurhash string to decode
		 */
		blurhash: string;

		/**
		 * Width of the decoded image
		 * @default 32
		 */
		decodeWidth?: number;

		/**
		 * Height of the decoded image
		 * @default 32
		 */
		decodeHeight?: number;

		/**
		 * Adjusts the contrast of the output image
		 * @default 1.0
		 */
		decodePunch?: number;

		/**
		 * Asynchronously decode the blurhash on a background thread
		 * @default false
		 */
		decodeAsync?: boolean;

		/**
		 * Image resize mode
		 * @default 'cover'
		 */
		resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
	}

	export class Blurhash extends React.Component<BlurhashProps> {}
}
