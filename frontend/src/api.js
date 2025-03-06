import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const musicRecommenderApi = createApi({
  reducerPath: "musicRecommenderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }),
  tagTypes: ["Users", "Groups", "Campaigns", "Recommendations"],
  endpoints: (builder) => ({
    // User endpoints
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: "/user/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
    getUser: builder.query({
      query: (userId) => `/user/${userId}`,
      providesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    changePassword: builder.mutation({
      query: ({ userId, passwordData }) => ({
        url: `/user/${userId}/change-password`,
        method: "POST",
        body: passwordData,
      }),
    }),
    getUserRecommendations: builder.query({
      query: (userId) => `/user/${userId}/recommendations`,
      providesTags: ["Recommendations"],
    }),
    joinGroup: builder.mutation({
      query: ({ userId, inviteCode }) => ({
        url: `/user/${userId}/groups/${inviteCode}`,
        method: "POST",
      }),
      invalidatesTags: ["Groups"],
    }),

    // Group endpoints
    createGroup: builder.mutation({
      query: ({ userId, groupData }) => ({
        url: `/group/${userId}`,
        method: "POST",
        body: groupData,
      }),
      invalidatesTags: ["Groups"],
    }),
    getGroup: builder.query({
      query: (groupId) => `/group/${groupId}`,
      providesTags: ["Groups"],
    }),
    deleteGroup: builder.mutation({
      query: (groupId) => ({
        url: `/group/${groupId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Groups"],
    }),

    // Campaign endpoints
    createCampaign: builder.mutation({
      query: ({ groupId, campaignData }) => ({
        url: `/campaign/${groupId}`,
        method: "POST",
        body: campaignData,
      }),
      invalidatesTags: ["Campaigns"],
    }),
    getCampaign: builder.query({
      query: ({ groupId, campaignId }) => `/campaign/${groupId}/${campaignId}`,
      providesTags: ["Campaigns"],
    }),
    deleteCampaign: builder.mutation({
      query: ({ groupId, campaignId }) => ({
        url: `/campaign/${groupId}/${campaignId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Campaigns"],
    }),
    rateCampaignRecommendation: builder.mutation({
      query: ({ userId, recommendationId, ratingData }) => ({
        url: `/campaign/ratings/${userId}/${recommendationId}`,
        method: "POST",
        body: ratingData,
      }),
      invalidatesTags: ["Recommendations"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useCreateUserMutation,
  useGetUserQuery,
  useDeleteUserMutation,
  useChangePasswordMutation,
  useGetUserRecommendationsQuery,
  useJoinGroupMutation,
  useCreateGroupMutation,
  useGetGroupQuery,
  useDeleteGroupMutation,
  useCreateCampaignMutation,
  useGetCampaignQuery,
  useDeleteCampaignMutation,
  useRateCampaignRecommendationMutation,
} = musicRecommenderApi;
