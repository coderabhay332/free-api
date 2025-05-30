// services/api.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, User, Service, ServiceListResponse, App, AppListResponse } from "../types";
import { baseQueryWithReauth } from "./baseQuery";

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Service", "App", "Analytics"],
  endpoints: (builder) => ({
    // User endpoints
    me: builder.query<ApiResponse<User>, void>({
      query: () => `/users/me`,
      providesTags: ["User"],
    }),

    login: builder.mutation<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>, { email: string; password: string }>({
      query: (body) => ({
        url: `/users/login`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<ApiResponse<User>, { name: string; email: string; password: string }>({
      query: (body) => ({
        url: `/users/register`,
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: `/users/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // Service endpoints
    getAllServices: builder.query<ServiceListResponse, void>({
      query: () => `/services/all`,
      providesTags: ["Service"],
    }),

    getServiceById: builder.query<ApiResponse<Service>, string>({
      query: (id) => `/services/${id}`,
      providesTags: ["Service"],
    }),

    createService: builder.mutation<ApiResponse<Service>, { name: string; description: string; endpoint: string; method: string; pricePerCall: number }>({
      query: (body) => ({
        url: `/services`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Service"],
    }),

    // App endpoints
    getAllApps: builder.query<AppListResponse, void>({
      query: () => `/apps`,
      providesTags: ["App"],
    }),
    getAppByUserId: builder.query<AppListResponse, void>({
      query: () => `/users/getApp`,
      
      providesTags: ["App"],
    }),

    getAppById: builder.query<ApiResponse<App>, string>({
      query: (id) => `/apps/${id}`,
      providesTags: ["App"],
    }),

    createApp: builder.mutation<ApiResponse<App>, { name: string;user: string }>({
      query: (body) => ({
        url: `/apps/create-app`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["App"],
    }),

    // Subscription endpoints
    subscribeService: builder.mutation<ApiResponse<string>, { serviceId: string; appId: string }>({
      query: ({ serviceId, appId }) => ({
        url: `/users/subscribe/${serviceId}`,
        method: "POST",
        body: { appId },
      }),
      invalidatesTags: ["Service", "App"],
    }),

    blockService: builder.mutation<ApiResponse<App>, { serviceId: string; appId: string }>({
      query: ({ serviceId, appId }) => ({
        url: `/users/block/${serviceId}`,
        method: "POST",
        body: { appId },
      }),
      invalidatesTags: ["Service", "App"],
    }),

    unblockService: builder.mutation<ApiResponse<App>, { serviceId: string; appId: string }>({
      query: ({ serviceId, appId }) => ({
        url: `/users/unblock/${serviceId}`,
        method: "POST",
        body: { appId },
      }),
      invalidatesTags: ["Service", "App"],
    }),

    // Demo API endpoints
    getWeather: builder.mutation<ApiResponse<any>, string>({
      query: (apiKey) => ({
        url: `/services/demo/weather?key=${apiKey}`,
        method: "GET",
      }),
    }),

    getRandomUser: builder.mutation<ApiResponse<any>, string>({
      query: (apiKey) => ({
        url: `/services/demo/random-user?key=${apiKey}`,
        method: "GET",
      }),
    }),

    getJoke: builder.mutation<ApiResponse<any>, string>({
      query: (apiKey) => ({
        url: `/services/demo/joke?key=${apiKey}`,
        method: "GET",
      }),
    }),

    getQuote: builder.mutation<ApiResponse<any>, string>({
      query: (apiKey) => ({
        url: `/services/demo/quote?key=${apiKey}`,
        method: "GET",
      }),
    }),

    getNews: builder.mutation<ApiResponse<any>, string>({
      query: (apiKey) => ({
        url: `/services/demo/news?key=${apiKey}`,
        method: "GET",
      }),
    }),

    // Analytics endpoints
    getUserAnalytics: builder.query<ApiResponse<any>, void>({
      query: () => `/services/user/analytics`,
      providesTags: ["Analytics"],
    }),

    getAdminAnalytics: builder.query<ApiResponse<any>, void>({
      query: () => `/services/admin/analytics`,
      providesTags: ["Analytics"],
    }),

    addFunds: builder.mutation<ApiResponse<User>, { amount: number }>({
      query: (body) => ({
        url: `/users/add-funds`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetAllServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useGetAllAppsQuery,
  useGetAppByUserIdQuery,
  useGetAppByIdQuery,
  useCreateAppMutation,
  useSubscribeServiceMutation,
  useBlockServiceMutation,
  useUnblockServiceMutation,
  useGetWeatherMutation,
  useGetRandomUserMutation,
  useGetJokeMutation,
  useGetQuoteMutation,
  useGetNewsMutation,
  useGetUserAnalyticsQuery,
  useGetAdminAnalyticsQuery,
  useAddFundsMutation,
} = api;