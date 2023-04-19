/*import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const taskListApi = createApi({
  reducerPath : 'taskListApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3002/'
  }),
  endpoints(build) {
    getAllTasks: build.query({
      query: () => 'gettasks'
    })
  }
})

export const {useGetAllTasksQuery} = taskListApi;

export const { endpoints, reducerPath, reducer, middleware } = taskListApi;*/

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3002/" }),
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "gettasks",
    }),
    getProduct: builder.query({
      query: (product) => `products/search?q=${product}`,
    }),
  }),
});

export const { useGetAllProductsQuery, useGetProductQuery } = productsApi;
