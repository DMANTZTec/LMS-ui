import { atomWithStorage, createJSONStorage } from 'jotai/utils';

// Session-scoped so in-progress work survives a refresh but resets when the tab closes.
const sessionStorageAdapter = createJSONStorage(() => sessionStorage);

// Which section of the instructor dashboard is open ("dashboard", "reports", ...).
export const instructorActiveNavAtom = atomWithStorage(
  'instructorActiveNav',
  'dashboard',
  sessionStorageAdapter,
  { getOnInit: true }
);

export const DEFAULT_STUDENT_REPORT_FILTERS = {
  batch: 'React batch A',
  course: 'all',
  period: '30',
  status: 'all',
  search: '',
  page: 1,
};

// Filters, search text and current page of the Student Reports section.
export const studentReportsFiltersAtom = atomWithStorage(
  'instructorStudentReportsFilters',
  DEFAULT_STUDENT_REPORT_FILTERS,
  sessionStorageAdapter,
  { getOnInit: true }
);

// Student whose report dialog is open (null when closed).
export const studentReportsSelectedIdAtom = atomWithStorage(
  'instructorStudentReportsSelectedId',
  null,
  sessionStorageAdapter,
  { getOnInit: true }
);
