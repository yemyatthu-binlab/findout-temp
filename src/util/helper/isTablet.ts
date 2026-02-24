import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen');
export const isTablet = Math.min(width, height) >= 700;
