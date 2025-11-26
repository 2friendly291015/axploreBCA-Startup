<div align="center">

# Axplore BCA - Academic Resource Sharing Platform

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

*A cross-platform mobile application connecting BCA students and teachers for seamless academic resource sharing.*

**[View Live App](https://axplore-academy.vercel.app)**

</div>

---

## Overview

Axplore BCA is a comprehensive mobile application designed specifically for BCA (Bachelor of Computer Applications) students and teachers. The platform facilitates easy sharing and access to academic resources including notes, events, notices, and question papers.

---

## Features

### User Management

| Feature | Description |
|---------|-------------|
| **Role-Based Access** | Separate login portals for teachers and students |
| **Secure Authentication** | Firebase-powered user authentication |
| **Profile Management** | Personalized user profiles with academic details |

### For Teachers

| Feature | Description |
|---------|-------------|
| **Upload Resources** | Share notes, question papers, and study materials |
| **Event Management** | Create and publish academic events and deadlines |
| **Notice Board** | Post important announcements and notices |
| **File Attachments** | Upload files with images and date stamps |

### For Students

| Feature | Description |
|---------|-------------|
| **Browse Resources** | Access all uploaded academic materials |
| **Download Materials** | Save resources for offline study |
| **Event Calendar** | Stay updated with academic events |
| **Notifications** | Receive alerts for new content |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React Native (Expo) |
| **Backend** | Firebase |
| **Authentication** | Firebase Auth |
| **Database** | Cloud Firestore |
| **Storage** | Firebase Storage |
| **Deployment** | Vercel (Web), Expo (Mobile) |

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Firebase account

### Installation

```bash
# Clone the repository
git clone https://github.com/2friendly291015/axploreBCA-Startup.git

# Navigate to project directory
cd axploreBCA-Startup

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication, Firestore, and Storage
3. Add your Firebase config to the project
4. Set up security rules for Firestore and Storage

---

## Project Structure

```
axploreBCA-Startup/
|-- Axplore Final Project/
|   |-- src/
|   |   |-- components/      # Reusable UI components
|   |   |-- screens/         # App screens
|   |   |-- navigation/      # Navigation setup
|   |   |-- services/        # Firebase services
|   |   |-- utils/           # Helper functions
|   |-- App.js               # Main entry point
|   |-- firebase.config.js   # Firebase configuration
|-- README.md                # Documentation
```

---

## Live Demo

**[View Live Website](https://axplore-academy.vercel.app)**

---

## Author

**Amarjit L Singh**
- GitHub: [@2friendly291015](https://github.com/2friendly291015)
- LinkedIn: [Amarjit L Singh](https://linkedin.com/in/amarjit-l-singh)

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

### Show Your Support

Give a star if this project helped you!

</div>
