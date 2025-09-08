import axios, { type AxiosRequestConfig } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IAchievement, IAdminUserRow, IBadge, IPaginated, IPurchasePayload } from '../types/data';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
	// Always use token from bumpa_auth localStorage
	try {
		const raw = localStorage.getItem('bumpa_auth');
		if (raw) {
			const { token } = JSON.parse(raw);
			if (token) {
				config.headers = config.headers || {};
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
	} catch {}
	return config;
});


export interface UserAchievementsResponse {
  achievements: IAchievement[];
  badges: IBadge[];
}

export function useUserAchievements(userId: string) {
  return useQuery<UserAchievementsResponse>({
    queryKey: ['userAchievements', userId],
    queryFn: async (): Promise<UserAchievementsResponse> => {
      const { data } = await api.get(`/users/${userId}/achievements`);
      return data;
    },
    enabled: !!userId,
    refetchInterval: 10_000, // fallback polling
  });
}

export function useSimulatePurchase() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (payload: IPurchasePayload) => {
			const { data } = await api.post('/purchases', payload);
			return data;
		},
		onSuccess: (_data: any, vars: IPurchasePayload) => {
			qc.invalidateQueries({ queryKey: ['userAchievements', vars.user_id] });
		}
	});
}

export function useAdminLogin() {
	return useMutation({
		mutationFn: async (payload: { email: string; password: string }) => {
			const { data } = await api.post('/login', payload);
			if (data?.token) localStorage.setItem('admin_token', data.token);
			return data;
		}
	});
}

export function useLogin() {
	return useMutation({
		mutationFn: async (payload: { email: string; password: string }) => {
			const { data } = await api.post('/login', payload);
			if (data?.token) sessionStorage.setItem('user_token', data.token);
			return data;
		}
	});
}


export function useAdminUsersAchievements(params: { page?: number; filter?: string }) {
	return useQuery<IPaginated<IAdminUserRow>>({
		queryKey: ['adminUsersAchievements', params],
		queryFn: async () => {
			const { data } = await api.get('/admin/users/achievements', { params });
			return data;
		}
	});
}

