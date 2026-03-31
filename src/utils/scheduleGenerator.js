import { addDays, addWeeks, addMonths, parseISO, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

const LOOKAHEAD_DAYS    = 30;
const LOOKAHEAD_WEEKS   = 8;
const LOOKAHEAD_MONTHS  = 3;

/**
 * Given a single chore with a recurringType, returns an array of chore instances
 * (including the original) spread across the appropriate lookahead window.
 */
export function generateRecurringInstances(chore) {
  if (!chore.recurringType || chore.recurringType === 'None') return [chore];

  const instances = [chore];
  const baseDate  = parseISO(chore.dueDate);

  if (chore.recurringType === 'Daily') {
    for (let i = 1; i <= LOOKAHEAD_DAYS; i++) {
      instances.push({
        ...chore,
        id: uuidv4(),
        dueDate:      format(addDays(baseDate, i), 'yyyy-MM-dd'),
        status:       'ToDo',
        recurringRef: chore.id,
      });
    }
  } else if (chore.recurringType === 'Weekly') {
    for (let i = 1; i <= LOOKAHEAD_WEEKS; i++) {
      instances.push({
        ...chore,
        id: uuidv4(),
        dueDate:      format(addWeeks(baseDate, i), 'yyyy-MM-dd'),
        status:       'ToDo',
        recurringRef: chore.id,
      });
    }
  } else if (chore.recurringType === 'Monthly') {
    for (let i = 1; i <= LOOKAHEAD_MONTHS; i++) {
      instances.push({
        ...chore,
        id: uuidv4(),
        dueDate:      format(addMonths(baseDate, i), 'yyyy-MM-dd'),
        status:       'ToDo',
        recurringRef: chore.id,
      });
    }
  }

  return instances;
}

/** Checks all chores and marks any past-due non-completed ones as Overdue. */
export function resolveOverdueStatuses(chores) {
  const today = format(new Date(), 'yyyy-MM-dd');
  return chores.map(c => {
    if (c.status !== 'Completed' && c.dueDate < today) {
      return { ...c, status: 'Overdue' };
    }
    return c;
  });
}

/** Returns chores that fall on a specific date string (yyyy-MM-dd) */
export function getChoresForDate(chores, dateStr) {
  return chores.filter(c => c.dueDate === dateStr);
}
