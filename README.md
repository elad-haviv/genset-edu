# GENSET ACADEMY

An interactive training platform for diesel generator engineering and safety, built for electricians, electrical engineers, maintenance technicians and system designers. The interface is in Hebrew (RTL) by default, with an English toggle.

> **Educational use only.** All content is conceptual. Any real work on generators, switchboards or equipment that is energised or running must be done by suitably licensed and competent people, following the applicable regulations, standards and manufacturer instructions. Certificates issued by the platform are educational and are **not** professional licences.

## Modules

| # | Module | Route | What it contains |
|---|--------|-------|------------------|
| 01 | 3D Generator Explorer | `/explorer` | A procedural Three.js genset with 19 selectable components. Includes exploded view, run animation (fan, exhaust smoke, hot turbo, live controller screen), enclosure toggle, subsystem filter, labels, an accessible list view and an identify challenge. |
| 02 | Generator Room: Hazard Hunt | `/room` | A 3D room with two scenarios. Scenario B is an unsafe room with 10 hidden deficiencies plus decoys, scoring, hints and an airflow/recirculation visualisation. Scenario A is a well-designed reference room. An accessible checklist mode is included. |
| 03 | Electrical Safety Center | `/safety` | 16 topics, each with an animated SVG simulation: touch voltage, TN-S/TN-C-S/IT, RCD, overload and short-circuit curves, isolation, a LOTO ordering exercise, backfeed, E-stop, fire, boundaries, and rotating and hot parts. Also 8 scenario decision exercises. |
| 04 | Installation Engineering | `/installation` | 14 topics, each with animated drawings comparing proper and improper arrangements, plus a "test yourself" mode. |
| 05 | Power System & ATS Simulator | `/simulator` | An animated single-line diagram with a realistic controller panel. Five scenarios: normal, outage and transfer, restoration, overload trip, fail to start. Also a 3-pole vs 4-pole neutral-switching comparison. |
| 06 | Operating Modes | `/modes` | STANDBY, PRIME and CONTINUOUS ratings (ISO 8528-1 ESP/PRP/COP), an interactive daily load-profile analyser and an application-matching exercise. |
| 07 | Reliability & Redundancy | `/redundancy` | Paralleled sets on a common bus with fail-a-unit, priority load shedding, N+1 analysis, single-point-of-failure scenarios and a conceptual k-of-n availability model. |
| 08 | Fault Diagnosis | `/diagnostics` | 10 alarm scenarios on a controller display. Each runs through meaning, fault categories, safe first priority and what a professional verifies, with a score. |
| 09 | Engineering Calculators | `/calculators` | Three-phase P/S/Q/I, kW↔kVA, power factor triangle, generator loading, demand estimate and redundancy comparison. Each shows its formulas, assumptions and limitations. |
| 10 | Assessment & Certificates | `/assessment` | Three levels of 10 questions each, mixing multiple choice, click-to-identify, hazard identification, diagram interpretation and scenarios. Pass mark is 80%. Passing produces a printable educational certificate. |

Learning progress is stored locally in the browser (`localStorage`), so no account is needed.

## Tech stack

- Next.js 14 (App Router) with React 18 and TypeScript
- Tailwind CSS 3
- Three.js through `@react-three/fiber` and `@react-three/drei`. All 3D models are procedural (built from primitives and custom geometry), so there are no external assets.
- Animated diagrams are inline SVG and CSS

## Project structure

```
src/
  app/                 # one folder per module (route) + dashboard, layout, providers
  components/
    three/             # GensetModel, ExplorerScene, RoomScene, effects, primitives
    diagrams/          # animated SVG simulations (safety, SLD, installation, quiz figures)
    AppShell.tsx       # RTL sidebar / mobile navigation, language toggle
    ControllerDisplay.tsx
    ui.tsx             # shared UI primitives, disclaimers, classification badges
  content/             # bilingual course content (components, hazards, topics, faults, quiz)
  lib/                 # i18n (he/en + RTL) and local progress store
```

All course content lives in `src/content/` as typed bilingual objects (`{ he, en }`). To add a topic, a fault scenario or a question, add an entry to the relevant array.

## Running locally

Requirements: Node.js 18.17 or later (20+ recommended).

```bash
npm install
npm run dev          # http://localhost:3000
```

Checks:

```bash
npm run typecheck    # TypeScript
npm run lint         # ESLint (next/core-web-vitals)
npm run build        # production build
npm start            # serve the production build
```

## Deployment

Every route is statically prerendered, so the app can be hosted almost anywhere:

- **Vercel**: import the repository and accept the defaults (framework: Next.js).
- **Any Node host**: run `npm run build`, then `npm start` (the port is set by `PORT`).
- **Static hosting** (Netlify, S3, GitHub Pages and similar): add `output: "export"` to `next.config.mjs`, run `npm run build`, and deploy the generated `out/` folder.

Fonts (Heebo, JetBrains Mono) are fetched by `next/font` at build time, so the build machine needs internet access.

## Engineering accuracy notes

- Each statement is labelled as an *engineering principle*, an *engineering recommendation*, an *illustrative example*, *manufacturer-specific*, or a *binding standard / regulation*.
- The platform deliberately gives no mandatory clearance dimensions, approach distances or regulatory numerical limits. Where the ISO 8528-1 rating definitions are quoted (for example the 24 h average-load and annual-hours limits for ESP/PRP), users are told to check them against the current edition and the manufacturer's datasheet.
- Simulator timings, kW values and controller readings are illustrative.
- Generator-room and installation arrangements are conceptual. They are not approved construction drawings.
