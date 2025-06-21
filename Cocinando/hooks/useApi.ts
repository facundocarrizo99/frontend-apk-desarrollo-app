import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
    UseMutationOptions,
    useInfiniteQuery,
    UseInfiniteQueryOptions,
    InfiniteData,
    QueryKey
} from '@tanstack/react-query';
import { useCallback } from 'react';
import {apiService} from '@/services/api';
import {
    Recipe,
    RecipeFilters,
    PaginatedResponse,
    User,
    Report,
    CreateRecipeData,
    LoginCredentials,
    RegisterData
} from '@/types/api';

// Default query options
const defaultQueryOptions = {
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
} as const;

// Default mutation options
const defaultMutationOptions = {
    retry: 1,
    retryDelay: 1000,
} as const;

// Query keys factory
export const apiKeys = {
    recipes: {
        all: ['recipes'] as const,
        lists: () => [...apiKeys.recipes.all, 'list'] as const,
        list: (filters?: RecipeFilters) =>
            [...apiKeys.recipes.lists(), {filters}] as const,
        details: () => [...apiKeys.recipes.all, 'detail'] as const,
        detail: (id: string) => [...apiKeys.recipes.details(), id] as const,
    },
    users: {
        all: ['users'] as const,
        lists: () => [...apiKeys.users.all, 'list'] as const,
        details: () => [...apiKeys.users.all, 'detail'] as const,
        detail: (id: string) => [...apiKeys.users.details(), id] as const,
    },
    auth: {
        current: ['current-user'] as const,
    },
    favorites: {
        all: ['favorites'] as const,
    },
    categories: {
        all: ['categories'] as const,
    },
    reports: {
        all: ['reports'] as const,
    },
    search: {
        all: ['search'] as const,
        query: (query: string, filters?: RecipeFilters) =>
            [...apiKeys.search.all, {query, filters}] as const,
    },
};

// Recipes
export const useRecipes = (
    filters?: RecipeFilters,
    options: Omit<UseQueryOptions<PaginatedResponse<Recipe>>, 'queryKey' | 'queryFn'> = {}
) => {
    return useQuery<PaginatedResponse<Recipe>, Error>({
        queryKey: apiKeys.recipes.list(filters),
        queryFn: async ({signal}) => {
            try {
                return await apiService.getRecipes(filters || {}, {signal});
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
                throw new Error('Failed to fetch recipes');
            }
        },
        ...defaultQueryOptions,
        //keepPreviousData: true,
        ...options,
    });
};

export const useRecipe = (
    id: string,
    options: Omit<UseQueryOptions<Recipe>, 'queryKey' | 'queryFn'> = {}
) => {
    return useQuery<Recipe, Error>({
        queryKey: apiKeys.recipes.detail(id),
        queryFn: async ({signal}) => {
            if (!id) throw new Error('Recipe ID is required');
            try {
                return await apiService.getRecipeById(id, {signal});
            } catch (error) {
                console.error(`Failed to fetch recipe ${id}:`, error);
                throw new Error('Failed to fetch recipe');
            }
        },
        ...defaultQueryOptions,
        enabled: !!id,
        ...options,
    });
};

export const useCreateRecipe = (options?: UseMutationOptions<Recipe, Error, CreateRecipeData>) => {
    const queryClient = useQueryClient();

    return useMutation<Recipe, Error, CreateRecipeData>({
        mutationFn: async (data) => {
            try {
                return await apiService.createRecipe(data);
            } catch (error) {
                console.error('Failed to create recipe:', error);
                throw new Error('Failed to create recipe');
            }
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: apiKeys.recipes.lists() });
            options?.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            console.error('Error creating recipe:', error);
            options?.onError?.(error, variables, context);
        },
        ...defaultMutationOptions,
        ...options,
    });
};

// Favorites
export const useFavorites = (
    options: Omit<UseQueryOptions<Recipe[]>, 'queryKey' | 'queryFn'> = {}
) => {
    return useQuery<Recipe[], Error>({
        queryKey: apiKeys.favorites.all,
        queryFn: async ({signal}) => {
            try {
                return await apiService.getFavorites({signal});
            } catch (error) {
                console.error('Failed to fetch favorites:', error);
                throw new Error('Failed to fetch favorites');
            }
        },
        ...defaultQueryOptions,
        ...options,
    });
};

export const useToggleFavorite = (
    options: UseMutationOptions<void, Error, string> = {}
) => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: async (recipeId) => {
            if (!recipeId) throw new Error('Recipe ID is required');
            try {
                return await apiService.addToFavorites(recipeId);
            } catch (error) {
                console.error('Failed to toggle favorite:', error);
                throw new Error('Failed to toggle favorite');
            }
        },
        onMutate: async (recipeId) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({queryKey: apiKeys.favorites.all});

            // Snapshot the previous value
            const previousFavorites = queryClient.getQueryData(apiKeys.favorites.all);
            const previousRecipe = queryClient.getQueryData(apiKeys.recipes.detail(recipeId));

            // Optimistically update the UI
            queryClient.setQueryData<Recipe[]>(
                apiKeys.favorites.all,
                (old) => {
                    if (!old) return [];
                    const isFavorite = old.some(recipe => recipe.id === recipeId);
                    return isFavorite
                        ? old.filter(recipe => recipe.id !== recipeId)
                        : [...old, {id: recipeId} as Recipe];
                }
            );

            return {previousFavorites, previousRecipe};
        },
        onError: (error, recipeId, context) => {
            console.error(`Error toggling favorite for recipe ${recipeId}:`, error);

            // Rollback on error
            // if (context?.previousFavorites) {
            //     queryClient.setQueryData(apiKeys.favorites.all, context.previousFavorites);
            // }
            // if (context?.previousRecipe) {
            //     queryClient.setQueryData(apiKeys.recipes.detail(recipeId), context.previousRecipe);
            //}

            // Call any additional error handler from options
            options.onError?.(error, recipeId, context);
        },
        onSettled: (data, error, recipeId) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({queryKey: apiKeys.favorites.all});
            queryClient.invalidateQueries({queryKey: apiKeys.recipes.detail(recipeId)});

            // Call any additional settled handler from options
            options.onSettled?.(data, error, recipeId, undefined);
        },
        ...defaultMutationOptions,
    });
};

// Search
export const useSearchRecipes = (
    query: string,
    filters?: RecipeFilters,
    options: Omit<UseQueryOptions<PaginatedResponse<Recipe>>, 'queryKey' | 'queryFn'> = {}
) => {
    return useQuery<PaginatedResponse<Recipe>, Error>({
        queryKey: apiKeys.search.query(query, filters),
        queryFn: async ({ signal }) => {
            if (!query) {
                return {data: [], meta: {total: 0, page: 1, limit: 10, totalPages: 1}};
            }
            try {
                return await apiService.searchRecipes(query, filters || {}, {signal});
            } catch (error) {
                console.error('Search failed:', error);
                throw new Error('Failed to perform search');
            }
        },
        enabled: !!query,
        keepPreviousData: true,
        ...options
    });
};

export const useCategories = (
    options?: Omit<UseQueryOptions<string[]>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<string[], Error>({
        queryKey: apiKeys.categories.all,
        queryFn: async () => {
            try {
                return await apiService.getCategories();
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                throw new Error('Failed to fetch categories');
            }
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
        ...defaultQueryOptions,
        ...options,
    });
};

// Users (Admin)
export const useUsers = (
    options: Omit<UseQueryOptions<PaginatedResponse<User>>, 'queryKey' | 'queryFn'> = {}
) => {
    return useQuery<PaginatedResponse<User>, Error>({
        queryKey: apiKeys.users.lists(),
        queryFn: async ({signal}) => {
            try {
                return await apiService.getUsers({signal});
            } catch (error) {
                console.error('Failed to fetch users:', error);
                throw new Error('Failed to fetch users');
            }
        },
        ...defaultQueryOptions,
        ...options,
    });
};

// Auth
export const useCurrentUser = (
    options: Omit<UseQueryOptions<User | null>, 'queryKey' | 'queryFn'> = {}
) => {
    return useQuery<User | null, Error>({
        queryKey: apiKeys.auth.current,
        queryFn: async ({signal}) => {
            try {
                return await apiService.getCurrentUser({signal});
            } catch (error) {
                // Not being authenticated is not an error
                if ((error as any)?.status === 401) {
                    return null;
                }
                console.error('Failed to fetch current user:', error);
                throw new Error('Failed to fetch current user');
            }
        },
        ...defaultQueryOptions,
        retry: 1, // Don't retry too many times for auth failures
        ...options,
    });
};

export const useLogin = (
    options: UseMutationOptions<User, Error, LoginCredentials> = {}
) => {
    const queryClient = useQueryClient();

    return useMutation<User, Error, LoginCredentials>({
        mutationFn: async (credentials) => {
            try {
                return await apiService.login(credentials);
            } catch (error) {
                console.error('Login failed:', error);
                throw new Error('Invalid email or password');
            }
        },
        onSuccess: (data, variables, context) => {
            // Update the auth state
            queryClient.setQueryData(apiKeys.auth.current, data);

            // Invalidate any user-specific queries
            queryClient.invalidateQueries({queryKey: apiKeys.favorites.all});

            // Call any additional success handler from options
            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            console.error('Login error:', error);
            options.onError?.(error, variables, context);
        },
        ...defaultMutationOptions,
    });
};

export const useRegister = (
    options: UseMutationOptions<User, Error, RegisterData> = {}
) => {
    const queryClient = useQueryClient();

    return useMutation<User, Error, RegisterData>({
        mutationFn: async (userData) => {
            try {
                return await apiService.register(userData);
            } catch (error) {
                console.error('Registration failed:', error);
                throw new Error('Registration failed. Please try again.');
            }
        },
        onSuccess: (data, variables, context) => {
            // Log the user in after successful registration
            queryClient.setQueryData(apiKeys.auth.current, data);
            options.onSuccess?.(data, variables, context);
        },
        ...defaultMutationOptions,
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => apiService.logout(),
        onSuccess: () => {
            // Clear all cached queries
            queryClient.clear();
            // Reset the current user data
            queryClient.setQueryData(apiKeys.auth.current, null);
        }
    });
};

// Reports
// export const useReports = (
//     options: Omit<UseQueryOptions<Report[]>, 'queryKey' | 'queryFn'> = {}
// ) => {
//     return useQuery<Report[], Error>({
//         queryKey: apiKeys.reports.all,
//         queryFn: async ({signal}) => {
//             try {
//                 return await apiService.getReports({signal});
//             } catch (error) {
//                 console.error('Failed to fetch reports:', error);
//                 throw new Error('Failed to fetch reports');
//             }
//         },
//         ...defaultQueryOptions,
//         staleTime: 5 * 60 * 1000, // 5 minutes
//         ...options,
//     });
// };

/**
 * Custom hook for infinite scroll pagination
 * @template T The type of items in the paginated response
 * @param queryKey The query key for the query
 * @param fetchFn Function that fetches a page of data
 * @param options Additional options for the query
 * @returns Infinite query result
 */
// export const useInfiniteQueryPaginated = <T>(
//     queryKey: QueryKey,
//     fetchFn: (page: number, signal?: AbortSignal) => Promise<PaginatedResponse<T>>,
//     options: Omit<
//         UseInfiniteQueryOptions<
//             PaginatedResponse<T>,
//             Error,
//             InfiniteData<PaginatedResponse<T>>,
//             PaginatedResponse<T>,
//             QueryKey,
//             number
//         >,
//         'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
//     > = {}
// ) => {
//     return useInfiniteQuery<PaginatedResponse<T>, Error>({
//         queryKey,
//         queryFn: async ({pageParam = 1, signal}) => {
//             try {
//                 return await fetchFn(pageParam, signal);
//             } catch (error) {
//                 console.error('Failed to fetch paginated data:', error);
//                 throw new Error('Failed to fetch data');
//             }
//         },
//         getNextPageParam: (lastPage) => {
//             const {page, totalPages} = lastPage.meta;
//             return page < totalPages ? page + 1 : undefined;
//         },
//         initialPageParam: 1,
//         ...defaultQueryOptions,
//         ...options,
//     });
// };
//
// /**
//  * Hook to prefetch data for a specific page
//  * @param queryClient The query client instance
//  * @param queryKey The query key to prefetch
//  * @param fetchFn Function that fetches the data
//  */
// export const usePrefetchPaginatedData = <T>(
//     queryClient: ReturnType<typeof useQueryClient>,
//     queryKey: QueryKey,
//     fetchFn: (page: number) => Promise<PaginatedResponse<T>>
// ) => {
//     return useCallback(
//         async (page: number) => {
//             return queryClient.prefetchInfiniteQuery({
//                 queryKey,
//                 queryFn: ({signal}) => fetchFn(page, signal as AbortSignal),
//                 initialPageParam: 1,
//             });
//         },
//         [queryClient, queryKey, fetchFn]
//     );
// };
