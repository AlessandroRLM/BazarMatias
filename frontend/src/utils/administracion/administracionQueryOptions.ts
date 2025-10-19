import { queryOptions } from "@tanstack/react-query";
import { userActivitySearchType } from "../../schemas/administracion/userActivitySearchSchema";
import AxiosInstance from "../../helpers/AxiosInstance";
import { CustomPagination } from "../../types/core.types";
import { administrationMetrics, UserActivity } from "../../types/administration.types";
import { AxiosResponse } from "axios";
import { User } from "../../types/auth.types";
import { UserSearchType } from "../../schemas/administracion/userSearchSchema";

export const administrationMetricsQueryOptions = () => {
    return queryOptions({
        queryKey: ['metrics'],
        queryFn: async () => {
            const response: AxiosResponse<administrationMetrics> = await AxiosInstance.get('/api/users/users/metrics')
            return response
        }
    })
}

// Query options para la lista de usuarios
export const usersQueryOptions = (opts: UserSearchType) =>
    queryOptions({
        queryKey: ['users', opts],
        queryFn: async () => {
            const response: AxiosResponse<CustomPagination<User>> = await AxiosInstance.get('/api/users/users/', {
            params: opts,
            })
            return response ?? {}
        } ,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

// Query options para un usuario específico
export const userDetailQueryOptions = (nationalId: string) =>
    queryOptions({
        queryKey: ['users', nationalId],
        queryFn: async () => {
            const response: AxiosResponse<User> = await AxiosInstance.get(`/api/users/users/${nationalId}/`)
            return response
        },
        staleTime: 1000 * 60 * 5,
    });


export const usersSelectQueryOptions = () => {
    return queryOptions({
        queryKey: ['usersSelect'],
        queryFn: async () => {
            const response: AxiosResponse<CustomPagination<User>> = await AxiosInstance.get('/api/users/users/?page_size=100')
            return response ?? {}
        } 
    })
}

export const userActivityQueryOptions = (opts: userActivitySearchType) => {
    return queryOptions({
        queryKey: ['userActivity', opts],
        queryFn: async () => {
            const response: AxiosResponse<CustomPagination<UserActivity>> = await AxiosInstance.get('/api/users/users-activity', {
            params: opts,
            })
            return response ?? {}
        } 
    })
}

export const userActivityDetailQueryOptions = (userActivityId: string) => {
    return queryOptions({
        queryKey: ['userActivityDetail', { userActivityId }],
        queryFn: async () => {
            const response: AxiosResponse<UserActivity> = await AxiosInstance.get(`/api/users/users-activity/${userActivityId}/`)
            return response
        }
    })
}