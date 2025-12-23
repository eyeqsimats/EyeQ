# EyeQ Club - Computer Vision Community at SIMATS

Welcome to the EyeQ Club website, a student-run Computer Vision club at Saveetha Institute of Medical and Technical Sciences (SIMATS).

## About EyeQ

EyeQ is a vibrant community where students come together to learn, create, and innovate in the field of Computer Vision. Our mission is to bridge the gap between academic learning and real-world tech skills through collaborative projects and hands-on coding sessions.

### Our Motto
**See. Code. Create.**

## What Makes EyeQ Different?

- **Anyone Can Teach One**: Every member is both a learner and a mentor
- **No Skills Required**: Start your journey from zero with our supportive community
- **Curiosity Over Competition**: We focus on exploration and innovation
- **24/7 Energy Loop**: A community that's always active and always learning

## Tech Stack

This project is built with modern web technologies:

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Shadcn UI** - Component library
- **React Scroll** - Smooth scrolling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eyeq-vision-vibe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (Vite default) or the port shown in the terminal.

Note about authentication (development):

- The app normally requires Firebase authentication for member/admin areas. For faster local development you can skip auth — both the Member and Admin dashboards will load without signing in. Use the following paths:

	- Member Dashboard: `http://localhost:5173/dashboard`
	- Admin Dashboard: `http://localhost:5173/eyeqcontrol2k25`

These endpoints will fetch public data where available and allow submitting test projects/contributions. When you're ready to re-enable auth, revert the temporary bypasses in `src/pages/member/Dashboard.tsx` and `src/pages/admin/AdminDashboard.tsx`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # React components
│   ├── ui/        # Shadcn UI components
│   └── *.tsx      # Custom components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── assets/        # Static assets
```

## Contact & Links

- **WhatsApp**: Join our [WhatsApp Group](https://chat.whatsapp.com/GxFFprWNX4d8mOQJOTz7d1)
- **Projects**: View our [Project List](https://docs.google.com/spreadsheets/d/1EVvQ9yxCOn4SqQX_twvwdRS9951wn6fNcUI7PZdMxYQ/edit?usp=sharing)
- **Instagram**: [@eyeq.simats](https://www.instagram.com/eyeq.simats/)
- **LinkedIn**: [EyeQ SIMATS](https://www.linkedin.com/company/eyeq-simats/)

## Development Team

**President**: Aswath S  
**Vice President**: Sasvanthu G  
**Secretary**: Harsh Limkar N  
**Treasurer**: Suvedhan G  

**Web Developer**: Gnana Priyan G

## License

This project is created and maintained by EyeQ Club for educational and community purposes.

© 2025 EyeQ Club. All rights reserved.
