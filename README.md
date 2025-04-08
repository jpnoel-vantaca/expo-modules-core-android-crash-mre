# Android Runtime Crash Repro

### Details

This is a bare-minimum expo app created via [create-expo-app](https://docs.expo.dev/more/create-expo/).

Node modules, app config, and project structure have been updated to reflect the repo where the problem occurs as much as possible - 
however, some things have been omitted out of necessity due to security implications.

This project can be run locally without issues, and can even be built for production android using `cd ./android && ./gradlew app:bundleRelease`.
The issue is a runtime crash specifically on android, and when running a production *.aab specifically on [SauceLabs](https://saucelabs.com/) (real) devices.

Under these very specific circumstances, the production android *.aab will crash right after the splashscreen is shown.

The only known way to fix this crash is by running `npm i -P -E expo-modules-core@2.1.4` and re-uploading a new production android *.aab build.

### This project assumes you have the following installed:

1. Android Studio Meerkat | 2024.3.1 Patch 1
2. NodeJS @20.19.0
3. NPM @11.2.0

### Run The Project

1. `npm install`
2. `npm run android:watch`
