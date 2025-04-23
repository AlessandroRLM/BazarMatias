import { queryOptions } from "@tanstack/react-query";
import { userActivitySearchType } from "../../schemas/administracion/userActivitySearchSchema";
import AxiosInstance from "../../helpers/AxiosInstance";
import { CustomPagination } from "../../types/core.types";
import { UserActivity } from "../../types/administracion.types";
import { AxiosResponse } from "axios";
import { User } from "../../types/auth.types";

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