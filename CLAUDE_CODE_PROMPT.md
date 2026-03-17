# Claude Code Prompt — SkillReel (Remotion Animation)

Copy everything below this line and paste into Claude Code:

---

You are building a Remotion animation project called "SkillReel" for Officethree Technologies. This is a promotional video animation showcasing the `npx skills add remotion-dev/skills` command.

## TECH STACK
- Remotion 4.0+ (React video framework)
- React 18
- TypeScript
- Tailwind CSS (via @remotion/tailwind)

## PROJECT STRUCTURE
```
skillreel/
├── public/
│   ├── remotion-logo.svg        # Remotion brand logo (download from remotion.dev/brand)
│   ├── claude-logo.svg          # Claude AI logo
│   └── opencode-logo.svg        # OpenCode logo
├── src/
│   ├── index.ts                 # Remotion entry (registerRoot)
│   ├── index.css                # Tailwind directives
│   ├── Root.tsx                 # Composition registry
│   ├── Master.tsx               # Master composition (orchestrates everything)
│   ├── MacTerminal.tsx          # macOS terminal window chrome
│   ├── TerminalContent.tsx      # Typewriter + output animation
│   ├── Cursor.tsx               # Blinking cursor component
│   └── LogoCombo.tsx            # Announcement text + logos series
├── remotion.config.ts           # Remotion + Tailwind config
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## COMPOSITION SPECS
- **ID**: SkillsAnnouncement
- **Dimensions**: 1080x700px
- **Duration**: 240 frames (8 seconds at 30fps)
- **FPS**: 30

## ANIMATION SEQUENCE (frame-by-frame)

### Phase 1: Terminal Slide-In (frames 0–30)
- macOS light-theme terminal window slides up from bottom using `spring()` with `damping: 200, stiffness: 100` (no bounce)
- Terminal has 3D perspective: `rotateX(20deg)` static, `rotateY` animates from 10° to -10° over full duration
- Scale animates from 0.9 to 1.0 over full duration
- Terminal rests 100px below center (`translateY` spring target = 100)

### Phase 2: Typewriter (frames 0–~66)
- Types out `npx skills add remotion-dev/skills` at 15 chars/second
- Solid block cursor follows the text
- Cursor blinks at 2Hz when not typing

### Phase 3: Terminal Output (frames ~82+)
- 0.5s delay after typing completes
- ASCII art "SKILLS" banner appears instantly
- Output lines stagger in at 50ms intervals:
  ```
  ┌  skills
  │
  ◇  Source: https://github.com/remotion-dev/skills.git
  │
  ◇  Repository cloned
  │
  ◇  Found 1 skill
  │
  ●  Skill: remotion-best-practices
  │
  │  Best practices for Remotion - Video creation in React
  │
  ◇  Detected 2 agents
  │
  └  Installation complete
  ```

### Phase 4: Terminal Flip-Out (frame 120+)
- Terminal flips towards camera: `rotateX` from 0° to -90°
- Uses spring with `damping: 200, stiffness: 100`
- `transformOrigin: "center bottom"` so it flips like a page
- Needs its own `perspective: 1000` wrapper

### Phase 5: Logo Reveal (frame 120+)
- Behind the terminal (lower z-index), a `Series` plays:
  1. **"Agent Skills now available"** text (2 seconds)
     - Font: GT Planar (fallback: system-ui), 60px, weight 700, color #333
     - Scale animation from 0 to 1 over 0.5s with `Easing.out(Easing.cubic)`
  2. **Logo row** (remaining time)
     - Remotion logo (h-32) + "+" (text-6xl, gray-600) + Claude logo (h-24) + OpenCode logo (h-16)
     - Centered, no background

## COMPONENT DETAILS

### Master.tsx
- Background: `#f8fafc`
- `perspective: 1000` on AbsoluteFill
- Two Sequences layered: LogoCombo (behind) + Terminal (on top)
- All spring/interpolate animations live here

### MacTerminal.tsx
- `p-8` padding (transparent)
- Inner div: `rounded-xl overflow-hidden shadow-2xl`
- Title bar: `h-14 bg-[#f6f6f6]`, traffic lights (w-4 h-4), "Terminal" title centered
- Traffic light colors: `#ff5f57`, `#febc2e`, `#28c840`

### TerminalContent.tsx
- `font-mono text-4xl` for the command prompt
- Prompt: green `~` + `$` + typed text
- Output section: `text-lg leading-tight`
- SKILLS ASCII art in `<pre>`

### Cursor.tsx
- `w-4 h-10 bg-[#333]`
- `blinking` prop: when true, toggles opacity 0/1 at 2Hz
- Always visible (solid) while typing

### LogoCombo.tsx
- Uses `<Series>` with two `<Series.Sequence>`
- AnnouncementText: scale-in animation
- Logos: static layout with flexbox gap-12

## KEY REMOTION APIs USED
- `spring()` for physics-based easing
- `interpolate()` for linear animations
- `Easing.out(Easing.cubic)` for ease-out curves
- `Sequence` for layering with `from` prop
- `Series` for sequential playback
- `useCurrentFrame()`, `useVideoConfig()`
- `staticFile()` for public assets
- `AbsoluteFill` for full-frame layouts

## BUILD & RENDER
```bash
npm install
npx remotion studio          # Preview at localhost:3000
npx remotion render SkillsAnnouncement out/video.mp4
```

## IMPORTANT NOTES
1. Download actual logos from their official sources before rendering
2. GT Planar font needs to be loaded (or falls back to system-ui)
3. The terminal content font should be a proper monospace font
4. All spring animations use high damping (200) for no-bounce effect
5. The 3D transforms need proper perspective on parent elements
