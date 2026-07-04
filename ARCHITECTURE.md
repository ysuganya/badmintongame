# Architecture

## Technology Stack

- HTML for structure.
- CSS for responsive layout and visual styling.
- JavaScript modules for game behavior.
- Canvas 2D API for court, racket, and shuttle rendering.
- Node.js built-in test runner for logic tests.

## Architecture Overview

The project is a static browser game. `index.html` defines the game surface and controls, `styles.css` handles layout and responsive presentation, and `src/game.js` runs the animation loop, input handling, AI movement, scoring, and rendering.

Shared logic that is easy to test lives in `src/physics.js`. The test suite in `test/physics.test.js` validates clamping, collision, scoring, and match-ending behavior.

## Major Design Decisions

- Canvas was chosen because it keeps the game loop simple and makes the court, shuttle, and rackets easy to redraw at 60 frames per second.
- The AI uses limited-speed horizontal tracking instead of perfect positioning so the player can win with angled returns.
- The game uses no build step so it can run by opening `index.html` directly.
- Core math helpers are separated into `src/physics.js` so they can be tested without a browser.

## AI Tooling Used

- Codex was used to read the challenge PDF, plan the project structure, implement the game, create documentation, and run validation.

## Agent Workflow

1. Extract requirements from the challenge PDF.
2. Choose a small, completable badminton game scope.
3. Implement the static browser game and reusable physics helpers.
4. Add tests for logic with the highest regression risk.
5. Create the required documentation files.
6. Validate tests and prepare the repository for GitHub.
