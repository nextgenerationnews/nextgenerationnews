import type { Route } from 'svelte-routing';

export function parsePage(params: Route['$$slot_def']['default']['params'], pageParamName = 'page'): number {
  try {
    return Math.max(1, parseInt(params[pageParamName]?.toString?.() || '1', 10));
  } catch (e) {
    return 1;
  }
}

export function parseUrlStringParam<T = string>(
  params: Route['$$slot_def']['default']['params'],
  paramName: string,
  defaultValue: T = '' as unknown as T,
  possibleValues?: T[],
): T {
  const currentValue = params[paramName] as unknown as T;

  if (!currentValue || typeof currentValue !== 'string' || currentValue.startsWith('javascript')) {
    return defaultValue;
  } else if (possibleValues && !possibleValues.includes(currentValue)) {
    return defaultValue;
  }

  return currentValue;
}

export function parseQueryStringParam(
  location: Route['$$slot_def']['default']['location'],
  paramName: string,
  defaultValue = '',
  possibleValues?: string[],
): string {
  const currentValue = new URLSearchParams(location.search).get(paramName);

  if (!currentValue || typeof currentValue !== 'string' || currentValue.startsWith('javascript')) {
    return defaultValue;
  } else if (possibleValues && !possibleValues.includes(currentValue)) {
    return defaultValue;
  }

  return currentValue;
}
