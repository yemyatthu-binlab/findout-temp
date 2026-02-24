import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Checks and requests media permissions for Android.
 * - For Android 13 (API 33) and above, it returns true without a prompt,
 * assuming the use of the system Photo Picker which requires no permissions.
 * - For Android 12 (API 32) and below, it checks and requests
 * READ_EXTERNAL_STORAGE permission.
 * @returns {Promise<boolean>} A promise that resolves to true if the app can access media.
 */
const hasMediaPermissions = async (): Promise<boolean> => {
	// On Android 13+, the system Photo Picker is used which requires no permissions.
	// We can return true to allow proceeding with launching the picker.
	if ((Platform.Version as number) >= 33) {
		return true;
	}

	// For older versions, we check for READ_EXTERNAL_STORAGE.
	const hasPermission = await PermissionsAndroid.check(
		PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
	);

	if (hasPermission) {
		return true;
	}

	// If permission is not granted, we request it.
	const status = await PermissionsAndroid.request(
		PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
	);
	return status === PermissionsAndroid.RESULTS.GRANTED;
};

/**
 * Checks and requests camera permission for Android.
 * @returns {Promise<boolean>} A promise that resolves to true if permission is granted.
 */
const hasCameraPermission = async (): Promise<boolean> => {
	const hasPermission = await PermissionsAndroid.check(
		PermissionsAndroid.PERMISSIONS.CAMERA,
	);

	if (hasPermission) {
		return true;
	}

	const status = await PermissionsAndroid.request(
		PermissionsAndroid.PERMISSIONS.CAMERA,
	);
	return status === PermissionsAndroid.RESULTS.GRANTED;
};

export { hasMediaPermissions, hasCameraPermission };
