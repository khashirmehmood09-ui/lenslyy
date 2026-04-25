# Lensly — AI Smart Glasses Recommender

An AI-powered web application that analyzes your face shape from a selfie and recommends the perfect glasses frames for you.

## ✨ Features

- **AI Face Detection**: Uses MediaPipe and TensorFlow to detect 468 facial landmarks
- **Face Shape Analysis**: Identifies Oval, Round, Square, Heart, and Diamond face shapes
- **Personalized Recommendations**: Matches frames to your face shape with confidence scores
- **3D Frame Visualization**: Interactive 3D models of recommended glasses
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Built-in theme switching
- **User Dashboard**: Save and manage your recommendations

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: Radix UI, Tailwind CSS, Framer Motion
- **AI/ML**: MediaPipe Face Mesh, TensorFlow.js
- **3D Graphics**: Three.js, React Three Fiber
- **Backend**: Supabase (authentication and data storage)
- **Deployment**: Vercel (static hosting)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/khashirmehmood09-ui/lenslyy.git
cd lenslyy
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

## 📱 Usage

1. **Upload a Photo**: Take or upload a clear selfie
2. **AI Analysis**: The app analyzes your facial structure
3. **Get Recommendations**: View personalized frame suggestions with confidence scores
4. **Explore Frames**: Browse 3D models and frame details
5. **Save Results**: Create an account to save your recommendations

## 🏗️ Project Structure

```
src/
├── components/
│   ├── lensly/          # App-specific components
│   └── ui/              # Reusable UI components
├── data/
│   └── frames.ts        # Frame data and recommendations
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
├── lib/                 # Utility functions and constants
├── pages/               # Route components
└── test/                # Test files
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add `public/_redirects` for React Router:
   ```
   /* /index.html 200
   ```
5. Deploy!

### Other Platforms

The app can also be deployed to Netlify, Cloudflare Pages, or any static host.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Developed by:
- Khalil Ullah
- Hashir Qureshi
- Fizza Batool

## 📞 Support

For questions or support, please open an issue on GitHub.

---

Made with ❤️ using React, TypeScript, and AI
