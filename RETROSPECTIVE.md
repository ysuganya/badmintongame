# Retrospective

## What Went Well

- The game scope stayed small enough to complete in one focused iteration.
- Keeping the project static made setup and review simple.
- Separating physics helpers from rendering made the important logic testable.

## What Was Challenging

- Badminton physics can become complex quickly, so the implementation uses arcade-style motion rather than a full simulation.
- The AI needed to be capable enough to rally but imperfect enough for the player to score.

## Iteration Notes

- The first version prioritizes a complete playable loop over visual complexity.
- Future versions could add sound effects, difficulty levels, a better serve system, and match history.

## AI-Native Development Reflection

Codex helped turn the challenge requirements into a small project plan, produce the first implementation, and document the development lifecycle. The useful pattern was to keep requirements, architecture, implementation, tests, and retrospective notes close together in the repository so each step could inform the next.
