const { withAppBuildGradle } = require('@expo/config-plugins');

const defaultReleaseSignBlock = `release {
            def releaseSignFile = file('release-signing.properties')
			if (releaseSignFile.exists()) {
                def keystoreConfig = new Properties()
                keystoreConfig.load(new FileInputStream(releaseSignFile))
				storeFile file(keystoreConfig['storeFile'])
				storePassword keystoreConfig['storePassword']
				keyAlias keystoreConfig['keyAlias']
				keyPassword keystoreConfig['keyPassword']
			}`;

const applyMultidexTransforms = (gradleFileContent) => {
	let result = gradleFileContent;

	if (!/aaptOptions {/m.test(result)) {
		result = result.replace(/packagingOptions\s*\{[^\}]+\}\s*\}/m, (match) => {
			return match ? `${match}\n\taaptOptions {\n\t\tnoCompress 'dex'\n\t}` : match;
		});
	}

	if (!/multiDexEnabled true/m.test(result)) {
		result = result.replace(/defaultConfig[^\{]*\{[^\}]+\}/m, (match) => {
			return match ? match.replace('}', '\tmultiDexEnabled true\n\t}') : match;
		});
	}

	return result;
};

const applyReleaseSigningConfigTransform = (gradleFileContent) => {
	let result = gradleFileContent;
	let blockReplacerText = defaultReleaseSignBlock;
	const signingConfigsReleaseMatcher = () => /(signingConfigs\s*\{[^\}]+\s*\}\s*)(release\s*\{[^\}]+\})/m;

	if (signingConfigsReleaseMatcher().test(result)) {
		result = result.replace(signingConfigsReleaseMatcher(), `$1${blockReplacerText}`);
	} else {
		result = result.replace(/signingConfigs\s*\{[^\}]+\s*debug\s*\{[^}]+\}/m, (match) => {
			return `${match}\n\t\t${blockReplacerText}\n\t\t}`;
		});
	}

	return result;
};

const applyBuildTypeReleaseTransform = (gradleFileContent, configTarget) => {
	return gradleFileContent.replace(/buildTypes\s*\{[^\}]+\s*\}\s*release\s*\{([^\}]+)\}/m, (buildTypesBlockMatch) => {
		return buildTypesBlockMatch.replace(/release\s*\{([^\}]+)\}/m, (releaseBlockMatch) => {
			return releaseBlockMatch.replace(/signingConfigs\.\S+/, `signingConfigs.${configTarget}`);
		});
	});
};

const applyAppGradleTransforms = (gradleFileContent, pluginConfig = {}) => {
	let result = gradleFileContent;

	if (pluginConfig?.multidex) {
		result = applyMultidexTransforms(result);
	}

	result = applyReleaseSigningConfigTransform(result);
	result = applyBuildTypeReleaseTransform(result, 'release');

	return result;
};

const withCustomAppBuildGradle = (expoConfig, pluginConfig) => {
	return withAppBuildGradle(expoConfig, (exportedConfigWithProps) => {
		const appBuildGradle = exportedConfigWithProps.modResults.contents;
		const updatedContents = applyAppGradleTransforms(appBuildGradle, pluginConfig);
		exportedConfigWithProps.modResults.contents = updatedContents;
		return exportedConfigWithProps;
	});
};

module.exports = withCustomAppBuildGradle;
