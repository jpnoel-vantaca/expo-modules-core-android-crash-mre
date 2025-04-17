import { ExpoConfig, ConfigContext } from 'expo/config';
import { readFileSync, writeFileSync } from 'fs';

const bundleId = 'com.vantaca.home.crashtest';
const buildVersion = readFileSync('./build-version.txt').toString().trim();

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
		scheme: 'vantaca.com',
		android: {
			package: bundleId,
			allowBackup: true,
			versionCode: parseInt(buildVersion),
			permissions: [
				'android.permission.READ_MEDIA_IMAGES',
			],
		},
		ios: {
			bundleIdentifier: bundleId,
			buildNumber: buildVersion,
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
			['./expo-plugins/with-custom-app-build-gradle.js'],
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
