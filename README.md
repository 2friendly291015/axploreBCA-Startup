<div align="center">

# Axplore BCA

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A mobile-first academic resource sharing platform for BCA students and teachers.

**[View Live App](https://axplore-academy.vercel.app)**

</div>

---

## Overview

Axplore BCA helps students and teachers share academic resources in one place. Teachers can upload study materials, notices, question papers, and event updates, while students can browse and access the resources they need for coursework.

## Features

### User Management

| Feature | Description |
| --- | --- |
| Role-based access | Separate teacher and student experiences |
| Firebase authentication | Secure sign-in and sign-up flow |
| Profiles | User profile screens for academic identity and account management |

### Teacher Tools

| Feature | Description |
| --- | --- |
| Resource upload | Share notes, study material, and question papers |
| Notices and events | Publish updates, deadlines, and academic announcements |
| Admin upload flow | Dedicated screens for managing resource publishing |

### Student Experience

| Feature | Description |
| --- | --- |
| Study material access | Browse uploaded materials from the app |
| Status updates | View academic notices and event updates |
| Offline state handling | Friendly offline screen when connectivity is unavailable |

## Tech Stack

| Category | Technology |
| --- | --- |
| App framework | React Native with Expo |
| Backend services | Firebase |
| Authentication | Firebase Auth |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| Deployment | Expo and Vercel |

## Getting Started

### Prerequisites

- Node.js
- npm
- Expo CLI or `npx expo`
- Firebase project

### Installation

```bash
git clone https://github.com/2friendly291015/axploreBCA-Startup.git
cd axploreBCA-Startup/"Axplore Final Project"
npm install
cd AxploreBCA
npx expo start
```

### Firebase Configuration

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com).
2. Enable Authentication, Firestore, and Storage.
3. Add your Firebase configuration in `Axplore Final Project/AxploreBCA/firebaseConfig.js`.
4. Review Firestore and Storage rules before production use.

## Project Structure

```text
axploreBCA-Startup/
|-- README.md
|-- Axplore Final Project/
|   |-- package.json
|   |-- package-lock.json
|   |-- AxploreBCA/
|   |   |-- App.js
|   |   |-- AuthContext.js
|   |   |-- AdminUpload.js
|   |   |-- HomeScreen.js
|   |   |-- StudyMaterialScreen.js
|   |   |-- StatusUpdateScreen.js
|   |   |-- SignInScreen.js
|   |   |-- SignUpScreen.js
|   |   |-- SettingsScreen.js
|   |   |-- ProfileScreen.js
|   |   |-- components/
|   |   |-- context/
|   |   |-- assets/
```

## Author

**Amarjit L Singh**

- GitHub: [@2friendly291015](https://github.com/2friendly291015)
- Portfolio: [amarjit-l-singh-portfolio.netlify.app](https://amarjit-l-singh-portfolio.netlify.app/)

## License

Add a license file before reusing or distributing this project publicly.
