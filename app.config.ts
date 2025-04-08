import { ExpoConfig, ConfigContext } from 'expo/config';
import { writeFileSync } from 'fs';

const androidBuildProperties = {
	minSdkVersion: 24,
	compileSdkVersion: 35,
	targetSdkVersion: 35,
	buildToolsVersion: '35.0.1',
};

export default ({ config }: ConfigContext) => {
	const resultConfig: ExpoConfig & { azure: Record<string, any> } = {
		...config,
		name: 'EMAC Minimal',
		platforms: ['ios', 'android'],
		version: '0.1.0',
		orientation: 'portrait',
		userInterfaceStyle: 'light',
		newArchEnabled: true,
		slug: 'expo-modules-android-crash-mre',
		icon: './src/assets/images/icon.png',
		scheme: 'emcaac.mre',
		android: {
			package: 'com.emac.mre',
			allowBackup: true,
			versionCode: 1,
			permissions: [
				'android.permission.READ_MEDIA_IMAGES',
			],
		},
		ios: {
			bundleIdentifier: 'com.emac.mre',
			buildNumber: '1',
			supportsTablet: true,
			config: {
				usesNonExemptEncryption: false,
			},
			infoPlist: {
				NSPhotoLibraryAddUsageDescription: 'To upload images in forms',
				LSApplicationQueriesSchemes: ['blob:'],
			},
		},
		plugins: [
			['expo-font'],
			['expo-localization'],
			['expo-router', { root: './src/app/' }],
			['expo-local-authentication', { faceIDPermission: 'For Biometrics' }],
			[
				'expo-splash-screen',
				{
					image: './src/assets/images/splash-icon.png',
					backgroundColor: '#ffffff',
					resizeMode: 'contain',
					imageWidth: 200,
				},
			],
			[
				'expo-build-properties',
				{
					android: androidBuildProperties,
				},
			],
			[
				'expo-camera',
				{
					cameraPermission: 'To upload images',
					microphonePermission: 'To upload video',
					recordAudioAndroid: true,
				},
			],
		],
		azure: {
			androidBuildToolsVersion: androidBuildProperties.buildToolsVersion,
			androidMinSdkVersion: androidBuildProperties.minSdkVersion,
		},
	};

	try {
		const output = JSON.stringify(resultConfig, null, '\t');
		writeFileSync('./app.config.snapshot.json', output);
	} catch (e) {
		console.warn(`failed to write config snapshot :: ${e}`);
	}

	return resultConfig;
};
