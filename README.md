# 🏴‍☠️ Pirates of the Caribbean: Cybersecurity Treasure Hunt

Ahoy, matey! Welcome to the **Pirates of the Caribbean CTF Platform**, a highly immersive, interactive, and visually stunning Capture The Flag (CTF) environment designed to test cybersecurity skills on the high seas.

Players join "Crews" and race across an ancient, worn-out treasure map to solve challenges, capture flags, and ultimately claim the legendary Black Pearl.

## Features

- **Interactive Treasure Map:** A dynamic, heavily-textured, ripped-edge parchment map. Challenges are represented by hand-drawn islands (complete with palm trees!) that mark themselves with a red "X" as your crew conquers them.
- **Immersive UI/UX:** Features a custom animated anchor cursor that reacts to clicks and background colours, a rotating vintage astrolabe compass, and stormy sea animations.
- 🌊 **Live Sea Race Leaderboard:** A real-time leaderboard where team progress bars are filled with animated, flowing ocean waves. 
- **Captain's Quarters (Admin Portal):** A hidden, secure dashboard for admins to oversee the race, track team progress, view detailed statistics, and manage flags.
- **The Black Pearl Victory Screen:** An animated, particle-filled celebration screen featuring a beautifully styled, glowing Black Pearl that awaits the first crew to conquer all challenges.

## Tech Stack

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (for spring animations, UI transitions, and SVG manipulation)
- **Backend & Database:** Supabase (PostgreSQL, Realtime Subscriptions)
- **Icons:** Lucide React

## Getting Started

To run this platform locally and set sail on your own machine:

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Pirates-of-the-Caribbean-CTF
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials. You will need a Supabase project set up with the appropriate `teams` table schema.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Sail!
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/page.tsx`: The main entry point featuring the "Join Yer Crew" screen and handling the layout for the game tabs.
- `src/app/admin/page.tsx`: The Captain's Quarters (Admin Portal).
- `src/components/TreasureMap.tsx`: The core component rendering the interactive parchment map and island SVGs.
- `src/components/Leaderboard.tsx`: Renders the live sea race progress tracking.
- `src/components/BlackPearlVictory.tsx`: The final victory screen component.
- `src/components/CustomCursor.tsx`: The logic handling the custom animated anchor cursor.
- `src/lib/supabase.ts`: Database client and type definitions.

---
*May the winds be ever in your favour, and may your crew claim the Black Pearl!*
