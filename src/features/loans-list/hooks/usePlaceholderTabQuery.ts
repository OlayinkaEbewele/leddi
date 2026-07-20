import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { placeholderTabsApi, type PlaceholderTabKey } from '@/api';
import type { PlaceholderTabQuery } from '@/api/types';

export function usePlaceholderTabQuery(tab: PlaceholderTabKey, query: PlaceholderTabQuery) {
  return useQuery({
    queryKey: ['placeholderTab', tab, query],
    queryFn: () => placeholderTabsApi.listPlaceholderRows(tab, query),
    placeholderData: keepPreviousData,
  });
}
