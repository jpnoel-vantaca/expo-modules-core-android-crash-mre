#!/usr/bin/sh

SIGNING_FILES_DIRECTORY=$1
BUILD_VERSION="$(cat ./build-version.txt)"

set -x

# Prepare build
rm -rf ./android
npm run android:prebuild

# Copy keystore file and release-signing.properties file into the android build
cp $SIGNING_FILES_DIRECTORY/* ./android/app/

# Run gradle build/sign task
cd ./android
./gradlew app:bundleRelease

# Copy/rename the built bundle
cd ..
mkdir -p ./tmp/android-bundles/
cp ./android/app/build/outputs/bundle/release/app-release.aab ./tmp/android-bundles/vantaca-home-crashtest-$BUILD_VERSION.aab
