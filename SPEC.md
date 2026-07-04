# Specification

## Game Rules

- The player controls the bottom racket.
- The AI controls the top racket.
- A rally starts when the player presses Serve, Space, or taps the court.
- The shuttle changes direction when it contacts a racket.
- A player scores when the opponent misses the shuttle or sends it beyond the playable court.
- The first side to 11 points wins the match.

## Scope

In scope:

- Browser-based playable badminton game.
- Keyboard, mouse, and touch input.
- AI opponent with simple tracking behavior.
- Score display, serve state, reset, and win state.
- Lightweight tests for shared game logic.
- Required project documentation.

Out of scope:

- Multiplayer networking.
- Tournament brackets.
- Character selection.
- Advanced physics simulation.
- Persistent user accounts.

## Functional Requirements

- The game must render a badminton court and shuttle.
- The player must be able to move horizontally.
- The AI must attempt to return the shuttle.
- The game must detect racket collisions.
- The game must award points for missed or out-of-bounds shots.
- The game must end when one side reaches 11 points.
- The game must allow the player to reset the match.
- The game must run in a modern desktop or mobile browser.

## Acceptance Criteria

- Opening `index.html` shows the playable court immediately.
- Pressing Serve or Space starts a rally.
- The player can return the shuttle using keyboard, mouse, or touch controls.
- Scores update after missed shots.
- The match announces a winner at 11 points.
- `npm test` passes.
