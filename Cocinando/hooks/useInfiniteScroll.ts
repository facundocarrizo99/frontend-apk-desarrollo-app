import { useCallback, useRef } from 'react';
import { FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';

export interface UseInfiniteScrollOptions<T> {
  queryKey: (string | number)[];
  queryFn: (page: number) => Promise<T[]>;
  getNextPageParam: (lastPage: T[], allPages: T[][]) => number | undefined;
  initialPage?: number;
  enabled?: boolean;
  staleTime?: number;
}

export interface InfiniteScrollResult<T> {
  data: T[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  error: unknown;
  refresh: () => Promise<void>;
  flatListProps: {
    data: T[];
    keyExtractor: (item: T, index: number) => string;
    onEndReached: () => void;
    onEndReachedThreshold: number;
    onRefresh: () => void;
    refreshing: boolean;
  };
  query: UseInfiniteQueryResult<T[], unknown>;
}

export function useInfiniteScroll<T extends { id?: string | number }>({
  queryKey,
  queryFn,
  getNextPageParam,
  initialPage = 1,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes default
}: UseInfiniteScrollOptions<T>): InfiniteScrollResult<T> {
  const isFetchingMore = useRef(false);

  const {
    data,
    fetchNextPage,
    hasNextPage = false,
    isFetching,
    isFetchingNextPage,
    error,
    refetch,
  } = useInfiniteQuery<T[]>({
    queryKey,
    queryFn: async ({ pageParam = initialPage }) => queryFn(pageParam as number),
    getNextPageParam,
    enabled,
    staleTime,
  });

  const items = data?.pages.flat() || [];

  const handleRefresh = useCallback(async () => {
    if (!isFetching) {
      await refetch();
    }
  }, [isFetching, refetch]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingMore.current && !isFetchingNextPage) {
      isFetchingMore.current = true;
      fetchNextPage().finally(() => {
        isFetchingMore.current = false;
      });
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const keyExtractor = useCallback((item: T, index: number) => {
    return item?.id ? `item-${item.id}` : `item-${index}`;
  }, []);

  return {
    data: items,
    fetchNextPage: handleEndReached,
    hasNextPage: !!hasNextPage,
    isFetching,
    isFetchingNextPage: isFetchingNextPage || false,
    error,
    refresh: handleRefresh,
    flatListProps: {
      data: items,
      keyExtractor,
      onEndReached: handleEndReached,
      onEndReachedThreshold: 0.5,
      onRefresh: handleRefresh,
      refreshing: isFetching && !isFetchingNextPage,
    },
    query: {
      data,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      error,
      refetch,
    } as UseInfiniteQueryResult<T[], unknown>,
  };
}

export default useInfiniteScroll;
