
## 🚀 Overview
Finance Tracker is a modern web application built with Next.js, TypeScript, and Redux, designed to help users manage their budgets and transactions efficiently. It provides a secure, user-friendly interface for tracking income, expenses, and visualizing financial data.

---

## ✨ Features
- User authentication (signup, login, protected routes)
- Add, edit, and delete budgets
- Add, edit, and delete transactions
- Dashboard with financial summaries
- Interactive balance graph
- Transaction and budget lists
- Responsive design for desktop and mobile
- Firebase integration for data storage and authentication

---

## 🛠️ Tech Stack
- **Frontend:** Next.js, React, TypeScript
- **State Management:** Redux Toolkit
- **Authentication & Database:** Firebase
- **Styling:** CSS, PostCSS
- **Linting:** ESLint

---

## 📦 Installation & Setup
1. **Clone the repository:**
	```bash
	git clone https://github.com/Emanuelo06/Finance-Tracker.git
	cd Finance-Tracker-1
	```
2. **Install dependencies:**
	```bash
	npm install
	```
3. **Configure Firebase:**
	- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
	- Add your Firebase config to `lib/firebase.ts`.
4. **Run the development server:**
	```bash
	npm run dev
	```
	The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🧭 Usage
- **Sign Up / Login:** Create an account or log in to access your dashboard.
- **Add Budgets:** Navigate to 'Add Budget' to create new budget categories.
- **Add Transactions:** Use 'Add Transaction' to record income or expenses.
- **View Dashboard:** See your financial summary and graphs.
- **Manage Data:** Edit or delete budgets and transactions as needed.

---

## 📁 Folder Structure
```
Finance-Tracker-1/
├── app/                # Next.js app routes and pages
├── components/         # Reusable React components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and Firebase integration
├── public/             # Static assets
├── redux/              # Redux store and slices
├── types/              # TypeScript type definitions
├── ...                 # Config files and more
```

---

## 🤝 Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📬 Contact
- **Author:** Emanuelo06
- **GitHub:** [Emanuelo06](https://github.com/Emanuelo06)
- **Email:** your.email@example.com

---

> Made with ❤️ using Next.js, TypeScript, and Firebase.
