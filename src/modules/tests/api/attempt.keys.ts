export const ATTEMPT_MUTATION_KEYS = {
    all: ['attempts'] as const,
    start: () => [...ATTEMPT_MUTATION_KEYS.all, 'start'] as const,
    saveProgress: (attemptId?: string) =>
      [...ATTEMPT_MUTATION_KEYS.all, 'save-progress', attemptId].filter(Boolean),
    submit: (attemptId?: string) =>
      [...ATTEMPT_MUTATION_KEYS.all, 'submit', attemptId].filter(Boolean),
    disconnect: (attemptId?: string) =>
      [...ATTEMPT_MUTATION_KEYS.all, 'disconnect', attemptId].filter(Boolean),
    violation: (attemptId?: string) =>
      [...ATTEMPT_MUTATION_KEYS.all, 'violation', attemptId].filter(Boolean),
  } as const;