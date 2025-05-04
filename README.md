# 🤖 Interview Buddy

**Interview Buddy** is an AI-powered interview preparation platform that helps candidates prepare for job interviews with personalized questions, detailed explanations, and multiple interview types. It's ideal for software engineers and tech aspirants looking to sharpen their skills through realistic practice.

---

## 🌐 Live Demo

🔗 [Visit Interview Buddy](https://interviewbuddy-platform.vercel.app)  

---

## 📌 Features

- 🧠 AI-generated, role-specific interview questions
- 🎚️ Adjustable difficulty levels (Beginner to Expert)
- 🧑‍💻 Supports multiple programming languages (Python, JS, C++, etc.)
- 🌀 Covers Technical, System Design, Behavioral, and HR interviews
- 💡 Detailed explanations and structured breakdowns
- 💾 Save & revisit practice questions
- ⚙️ Dynamic round selector and animated transitions
- 📱 Fully responsive UI/UX for web and mobile

---

## 🛠️ Tech Stack

### Frontend

- **Next.js** – App Router & server actions
- **TypeScript** – Type safety and dev confidence
- **Tailwind CSS** – Utility-first styling
- **Shadcn/UI** – Accessible component library
- **Framer Motion** – Smooth animations

### Backend

- **Node.js + Express** – Custom APIs
- **Firebase Firestore** – Stores AI-generated Q&A and user history
- **Firebase Auth** – Optional (for saving user sessions)
- **LangChain + Gemini AI** – For generating intelligent responses

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/shubGupta10/interview-buddy
cd interview-buddy
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 3. Environment Variables

Create .env files in both the client/ and server/ directories.

🟦 Client (client/.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

🟥 Server (server/.env)
```env
PORT=5000
GEMINI_API_KEY=your_gemini_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key
```

Replace the placeholders with actual Firebase and Gemini API credentials.

### 4. Start the Development Servers

```bash
# Start backend (Terminal 1)
cd server
npm run dev

# Start frontend (Terminal 2)
cd client
npm run dev
```

Visit http://localhost:3000 in your browser.

---


## 🤝 Contributing

We welcome contributions!

1. Fork the repo
2. Create your feature branch:
   ```bash
   git checkout -b feature/feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request

---


## 🙌 Acknowledgements

- Built with ❤️ by Shubham Gupta
- Powered by Gemini AI, LangChain, and Firebase
- Inspired by platforms like Pramp, Interviewing.io, and LeetCode Discuss.