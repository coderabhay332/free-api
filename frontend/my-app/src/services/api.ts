// services/api.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { ApiResponse, User, Api, ApiListResponse } from "../types";
import { baseQueryWithReauth } from "./baseQuery";
import { ReactNode } from "react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Api"],
  endpoints: (builder) => ({
    me: builder.query<ApiResponse<User>, void>({
      query: () => `/users/me`,
      providesTags: ["User", 'Api'],
    }),

    login: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { email: string; password: string }
    >({
      query: (body) => ({
        url: `/users/login`,
        method: "POST",
        body,
      }),
    }),

    register: builder.mutation<
      ApiResponse<User>,
      Omit<User, "_id" | "active" | "role" | "plan" | "subscribedApis" | "credit" | "createdAt" | "updatedAt"> & { confirmPassword: string }
    >({
      query: (body) => ({
        url: `/users/register`,
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: `/users/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    refreshToken: builder.mutation<ApiResponse<{ accessToken: string }>,
      { refreshToken: string }
    >({
      query: (body) => ({
        url: `/users/refresh`,
        method: "POST",
        body,
      }),
    }),

    createApi: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { name: string; description: string; endpoint: string; method: string; pricePerRequest: number }
    >({
      query: (body) => ({
        url: `/apis/create`,
        method: "POST",
        body,
      }),
    }), 
    
    getAllApis: builder.query<ApiListResponse, void>({
      query: () => `/apis/all`,
      providesTags: ["Api"],
    }),
    
    getApiById: builder.query<ApiResponse<Api>, string>({
      query: (id) => `/apis/${id}`,
      providesTags: ["Api"],
    }),

    subscribeToApi: builder.mutation<ApiResponse<Api>, string>({
      query: (id) => ({
        url: `/apis/subscribe/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Api", "User"],
    }),

    testApiEndpoint: builder.mutation<ApiResponse<any>, { apiId: string; endpoint: string; method: string }>({
      query: ({ endpoint, method }) => ({
        url: endpoint,
        method: method,
      }),
      invalidatesTags: ["Api", "User"],
    }),

    // Demo API endpoints
    getDemoUsers: builder.mutation<ApiResponse<any>, string>({
      query: (apiKey) => ({
        url: `/apis/demo/users?apiKey=${apiKey}`,
        method: "GET",
      }),
      invalidatesTags: ["Api", "User"],
    }),

    getDemoProducts: builder.mutation<ApiResponse<any>, string>({
      query: (apiKey) => ({
        url: `/apis/demo/products?apiKey=${apiKey}`,
        method: "GET",
      }),
      invalidatesTags: ["Api", "User"],
    }),

    getDemoWeather: builder.mutation<ApiResponse<any>, string>({
      query: (apiKey) => ({
        url: `/apis/demo/weather?apiKey=${apiKey}`,
        method: "GET",
      }),
      invalidatesTags: ["Api", "User"],
    }),

    getDemoNews: builder.mutation<ApiResponse<any>, string>({
      query: (apiKey) => ({
        url: `/apis/demo/news?apiKey=${apiKey}`,
        method: "GET",
      }),
      invalidatesTags: ["Api", "User"],
    }),
  }),
});

export const {
  useMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useCreateApiMutation,
  useGetAllApisQuery,
  useGetApiByIdQuery,
  useSubscribeToApiMutation,
  useTestApiEndpointMutation,
  // Export demo API hooks
  useGetDemoUsersMutation,
  useGetDemoProductsMutation,
  useGetDemoWeatherMutation,
  useGetDemoNewsMutation,
} = api;