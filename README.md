# MCQ PDF Quiz Web App

## Features
- Upload a PDF and parse MCQs in `{=correct ~wrong ~wrong}` format.
- Select one of 6 courses and its subjects before starting quiz.
- Start button always clears previous answers and begins from question 1.
- Quiz in one-by-one mode or full-list mode.
- Instant correctness feedback with correct answer reveal on wrong selections.
- Wrong answer explanations fetched from internet when online, with offline fallback.
- Progress tracking and complete results review page.
- Admin/debug panel to inspect parsed questions and warnings.

## Run (Web)
1. `npm install`
2. Start backend: `npm run server`
3. Start frontend: `npm run dev`

## Build APK (Android)
1. Install prerequisites:
   - Android Studio + Android SDK
   - JDK 17+
2. Install dependencies: `npm install`
3. Build web assets: `npm run build`
4. Initialize Android platform once: `npx cap add android`
5. Sync web app into Android project: `npm run apk:prepare`
6. Open Android Studio project: `npm run apk:open`
7. In Android Studio:
   - `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - or `Generate Signed Bundle / APK` for release build.

Output APK will be under the Android module build outputs.
