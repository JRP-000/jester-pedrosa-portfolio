# Jester Pedrosa Portfolio

Personal portfolio for QA engineering, IT support, and freelance website creation. Built with React, Vite, Three.js, and GSAP, with a blue Y2K visual theme and responsive layouts.

## Development

```sh
npm ci
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Vercel settings: framework **Vite**, build command **npm run build**, output directory **dist**. No environment variables are required.

Website entries and profile content live in `src/data.js`. The 3D hero is in `src/components/DeveloperComputer.jsx` and includes reduced-motion and WebGL fallback support.
