export const COURT = {
  width: 900,
  height: 620,
  marginX: 90,
  marginY: 45,
  netY: 310,
  playerY: 535,
  aiY: 85,
  racketWidth: 120,
  racketHeight: 18,
  shuttleRadius: 11
};

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function racketBounds(centerX, centerY, width = COURT.racketWidth, height = COURT.racketHeight) {
  return {
    left: centerX - width / 2,
    right: centerX + width / 2,
    top: centerY - height / 2,
    bottom: centerY + height / 2
  };
}

export function circleIntersectsRect(circle, rect) {
  const nearestX = clamp(circle.x, rect.left, rect.right);
  const nearestY = clamp(circle.y, rect.top, rect.bottom);
  const dx = circle.x - nearestX;
  const dy = circle.y - nearestY;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

export function scoreForOutOfBounds(shuttle, court = COURT) {
  if (shuttle.y < court.marginY - 28) {
    return "player";
  }

  if (shuttle.y > court.height - court.marginY + 28) {
    return "ai";
  }

  if (shuttle.x < court.marginX - 36 || shuttle.x > court.width - court.marginX + 36) {
    return shuttle.vy > 0 ? "ai" : "player";
  }

  return null;
}

export function isGameOver(playerScore, aiScore, winningScore = 11) {
  return playerScore >= winningScore || aiScore >= winningScore;
}
