# 🛣️ Roadmap.IO

Roadmap.IO is a dynamic web application that helps users generate role-based career roadmaps tailored to specific companies. Whether you're preparing for interviews or planning a long-term career path, Roadmap.IO gives you curated steps based on real interview patterns and success stories.

---

## 🚀 Features

- 🎯 Generate detailed career/interview roadmaps by selecting a role and company
- ✨ GPT-powered insights based on real-world patterns
- 📦 Download and save roadmaps (first one free; rest behind a paywall)
- 💳 Payment integration (INR 100 / $1.5 per roadmap)
- 🔐 Secure Login/Signup with Google & reCAPTCHA v3
- 🖼️ Beautiful public homepage with:
  - Sample roadmaps
  - Feature highlights
  - Testimonials
  - About & Support links

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend:** Next.js API routes
- **Authentication:** Google OAuth, reCAPTCHA v3
- **Payment:** Razorpay/Stripe (based on region)
- **AI:** OpenAI GPT (for roadmap generation)
- **Database:** MongoDB / Firebase (depending on deployment)
- **Deployment:** Vercel / Custom Server (optional)

---

### 📸 Snapshots

---
## 📦 Local Development

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/roadmap-io.git
cd roadmap-io
```

### 2. Install Dependencies
```bash
npm install --force
```

### 3. Setup Environment Variables
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=your_openai_key
MONGODB_URI=your_mongodb_uri
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Run Dev Server
```bash
npm run dev
```

---

## 🤝 Contributing
We welcome contributions! To contribute:

  - Fork the repository
  - Create a new branch: git checkout -b feature-name
  - Commit your changes
  - Push and open a Pull Request