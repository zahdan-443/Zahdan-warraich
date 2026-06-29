# Al-Hadi Goods Transport Company - Transport Management System (TMS)

A modern, full-featured Transport Management System built with React, TypeScript, Tailwind CSS, and Capacitor for Android native mobile deployment.

## 📱 How to Get the Android `.apk` File

If you downloaded this project as a `.tar` or `.zip` file from AI Studio, **this archive contains the source code workspace**. 

To get the actual installable Android `.apk` file (`app-debug.apk`), choose one of the two methods below:

---

### Method 1: Automatic Cloud APK Build via GitHub (Recommended)

This repository includes a pre-configured **GitHub Actions CI/CD Pipeline** (`.github/workflows/build-apk.yml`) that automatically compiles the native Android `.apk` file for you in the cloud.

1. In Google AI Studio, click the **Settings menu (⚙️)** -> **Export to GitHub**.
2. Create/export to a GitHub repository.
3. Open your repository on GitHub.com and navigate to the **Actions** tab at the top.
4. Click on the active or latest workflow run named **"Build Android APK"**.
5. Once the build completes (usually takes 2–3 minutes), scroll down to the bottom of the workflow summary page to the **Artifacts** section.
6. Click on **`Al-Hadi-Goods-APK`** to download it.
   - *Note: GitHub automatically packages downloadable artifacts inside a `.zip` file. Unzip this downloaded archive on your computer or Android phone to find the `app-debug.apk` installation file inside!*

---

### Method 2: Local Compilation on PC / Mac (Android Studio)

If you prefer building locally on your own machine:

1. **Extract** the downloaded `.tar` or `.zip` source archive to a folder on your computer.
2. Ensure you have **Node.js (v18+)** and **Java JDK 21** installed.
3. Open a terminal / command prompt in the extracted project root directory and run:
   ```bash
   npm install
   npm run build
   npx cap sync android
   ```
4. Open **Android Studio** and select **Open an existing project**. Navigate into the project's `android` folder and open it.
5. Wait for Gradle to finish indexing and syncing.
6. In Android Studio's top menu, click **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
7. Once built, click the **"locate"** link in the popup notification to find your generated `app-debug.apk` file.

---

## 💻 Running Locally as a Web App

To start the web application development server locally:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your web browser.
