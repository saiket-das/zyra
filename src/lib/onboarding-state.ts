let pendingMainGoal: string | null = null;

export function setPendingMainGoal(goal: string) {
  pendingMainGoal = goal;
}

export function getPendingMainGoal() {
  return pendingMainGoal;
}

export function clearPendingMainGoal() {
  pendingMainGoal = null;
}
