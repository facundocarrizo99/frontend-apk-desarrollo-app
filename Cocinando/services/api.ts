import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import * as SecureStore from 'expo-secure-store';
import {API_BASE_URL, API_HEADERS, AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY} from '../config/api';

interface RequestConfig extends AxiosRequestConfig {
    skipAuthRefresh?: boolean;
    _retry?: boolean;
};

export class ApiService {
    private static instance: ApiService;
    private api: AxiosInstance;
    private isRefreshing = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    private constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {...API_HEADERS},
        });

        this.setupInterceptors();
    }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    private async getAccessToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    }

    private async getRefreshToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    }

    private async setTokens(accessToken: string, refreshToken: string): Promise<void> {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    }

    private async clearTokens(): Promise<void> {
        await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }

    private setupInterceptors(): void {
        // Request interceptor
        this.api.interceptors.request.use(
            async (config) => {
                const token = await this.getAccessToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as RequestConfig;

                // Skip refresh token logic if skipAuthRefresh is true
                if (originalRequest.skipAuthRefresh) {
                    return Promise.reject(error);
                }

                // Handle 401 Unauthorized
                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        // If token refresh is in progress, wait for it to complete
                        return new Promise((resolve) => {
                            this.refreshSubscribers.push((token: string) => {
                                // Ensure headers exist and set the Authorization header correctly
                                originalRequest.headers = originalRequest.headers || {};
                                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                                resolve(this.api(originalRequest));
                            });
                        });
                    }

                    originalRequest._retry = true;
                    this.isRefreshing = true;

                    try {
                        const refreshToken = await this.getRefreshToken();
                        if (!refreshToken) {
                            throw new Error('No refresh token available');
                        }

                        // Call refresh token endpoint
                        const {data} = await this.api.post('/auth/refresh', {refreshToken});

                        // Update tokens
                        await this.setTokens(data.accessToken, data.refreshToken);

                        // Update the original request header
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                        }

                        // Retry all queued requests
                        this.refreshSubscribers.forEach((callback) => callback(data.accessToken));
                        this.refreshSubscribers = [];

                        return this.api(originalRequest);
                    } catch (refreshError) {
                        // If refresh fails, clear tokens and redirect to login
                        await this.clearTokens();
                        // You might want to redirect to login screen here
                        return Promise.reject(refreshError);
                    } finally {
                        this.isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // Auth methods
    public async login(credentials: { email: string; password: string }): Promise<any> {
        const response = await this.api.post('/auth/login', credentials);
        await this.setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data.user;
    }

    public async register(userData: {
        name: string;
        email: string;
        password: string;
    }): Promise<any> {
        const response = await this.api.post('/auth/register', userData);
        return response.data;
    }

    public async logout(): Promise<void> {
        try {
            await this.api.post('/auth/logout');
        } finally {
            await this.clearTokens();
        }
    }

    // User methods
    public async getCurrentUser(): Promise<any> {
        const response = await this.api.get('/users/me');
        return response.data;
    }

    public async updateProfile(profileData: any): Promise<any> {
        const response = await this.api.put('/users/me', profileData);
        return response.data;
    }

    public async updateAvatar(uri: string): Promise<any> {
        const formData = new FormData();
        const filename = uri.split('/').pop();

        // @ts-ignore
        formData.append('file', {
            uri,
            name: filename,
            type: 'image/jpeg',
        });

        const response = await this.api.patch('/users/me/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }

    // Recipe methods
    public async getRecipes(params?: any, p0?: { signal: AbortSignal; }): Promise<any> {
        const response = await this.api.get('/recipes', {params});
        return response.data;
    }

    public async getRecipeById(id: string, p0: { signal: AbortSignal; }): Promise<any> {
        const response = await this.api.get(`/recipes/${id}`);
        return response.data;
    }

    public async createRecipe(recipeData: any): Promise<any> {
        const response = await this.api.post('/recipes', recipeData);
        return response.data;
    }

    public async updateRecipe(id: string, recipeData: any): Promise<any> {
        const response = await this.api.put(`/recipes/${id}`, recipeData);
        return response.data;
    }

    public async deleteRecipe(id: string): Promise<void> {
        await this.api.delete(`/recipes/${id}`);
    }

    // Admin methods
    public async getUsers(params?: any): Promise<any> {
        const response = await this.api.get('/admin/users', {params});
        return response.data;
    }

    public async updateUserStatus(userId: string, status: string): Promise<any> {
        const response = await this.api.patch(`/admin/users/${userId}/status`, {status});
        return response.data;
    }

    // Favorites
    public async getFavorites(p0: { signal: AbortSignal; }): Promise<any> {
        const response = await this.api.get('/users/favorites');
        return response.data;
    }

    public async addToFavorites(recipeId: string): Promise<void> {
        await this.api.post(`/users/favorites/${recipeId}`);
    }

    public async removeFromFavorites(recipeId: string): Promise<void> {
        await this.api.delete(`/users/favorites/${recipeId}`);
    }

    // Search
    public async searchRecipes(query: string, filters?: any, p0?: { signal: AbortSignal; }): Promise<any> {
        const response = await this.api.get('/recipes/search', {
            params: {q: query, ...filters},
        });
        return response.data;
    }

    // Categories
    public async getCategories(): Promise<string[]> {
        const response = await this.api.get('/recipes/categories');
        return response.data;
    }

    // Upload
    public async uploadFile(uri: string, type: string = 'image'): Promise<string> {
        const formData = new FormData();
        const filename = uri.split('/').pop();

        // @ts-ignore
        formData.append('file', {
            uri,
            name: filename,
            type: `${type}/${filename?.split('.').pop()}`,
        });

        const response = await this.api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.url;
    }
}

export const apiService = ApiService.getInstance();
