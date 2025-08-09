Axplore BCA
Axplore BCA is a mobile application designed to improve communication and resource sharing between teachers and students of the Bachelor of Computer Applications (BCA) program. Built with React Native and Firebase, the app provides a streamlined way for teachers to upload academic materials, notices, events, and question papers, while students can easily view and download them.

Features
Role-based Authentication
Separate sign-up and login flows for teachers and students. Teachers have content upload privileges, while students have read-only access.

Teacher Upload Portal
Teachers can upload news, events, notes, question papers, and images. Supports date pickers, image previews, and deletion with confirmation.

Student Dashboard
Students can browse and download uploaded files, view event details, and keep up-to-date with department activities.

Firebase Integration
Uses Firebase Authentication, Firestore, and Storage for secure and scalable backend support.

Google Sign-In (Planned)
Integration for quick and secure account creation and login.

Cross-Platform UI
Fully responsive interface for both Android and iOS, with a consistent theme.

Tech Stack
Frontend: React Native, Expo

Backend: Firebase Authentication, Firestore, Storage

Utilities: Expo ImagePicker, Git Bash, VS Code

Folder Structure
graphql
Copy
Edit
AxploreBCA/
├── src/
│   ├── components/    # Reusable UI components
│   ├── screens/       # Application screens
│   ├── services/      # Firebase and API integrations
│   ├── utils/         # Helper functions and constants
├── assets/            # Images and static files
├── App.js             # Entry point
├── package.json
├── .gitignore
└── README.md
Installation
Clone the repository

bash
Copy
Edit
git clone https://github.com/your-username/axplore-bca.git
cd axplore-bca
Install dependencies

bash
Copy
Edit
npm install
Configure Firebase

Create a Firebase project in Firebase Console

Enable Authentication, Firestore, and Storage

Replace your Firebase config in src/services/firebaseConfig.js

Run the project

bash
Copy
Edit
npx expo start
Screenshots
(Add images here when available)

Future Enhancements
Profile picture upload for teachers and students

Push notifications for new uploads and events

Offline access for downloaded materials
