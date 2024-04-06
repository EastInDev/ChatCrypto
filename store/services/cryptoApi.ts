import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const cryptoApiHeaders = {
  "x-rapidapi-key": "4b439807c0msh33af94cf5f640e3p18fe50jsna66071373862",
  "x-rapidapi-host": "coinranking1.p.rapidapi.com",
};

const baseUrl = "https://coinranking1.p.rapidapi.com";
const cryptoCompareURL = "https://min-api.cryptocompare.com/data";

const createRequest = (url: string) => ({ url, headers: cryptoApiHeaders });

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptos: builder.query({
      query: (name) => createRequest(`/${name}`),
    }),
    getCryptoDetails: builder.query({
      // 새로운 엔드포인트 추가
      query: (uuid) => createRequest(`/coin/${uuid}`),
    }),
  }),
});

export const cryptoHistoryApi = createApi({
  reducerPath: "cryptoHistoryApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCryptosHistory: builder.query({
      query: (id) => createRequest(`/coin/${id}/history/7d`),
    }),
  }),
});

export const cryptoCompareHistoryApi = createApi({
  reducerPath: "cryptoCompareHistoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: cryptoCompareURL }),
  endpoints: (builder) => ({
    getCryptoCompareHistory: builder.query({
      query: ({ limit, coin }) => {
        return {
          url: `/v2/histoday?fsym=${coin}&tsym=USD&limit=${limit}`,
        };
      },
    }),
    getCryptoCompareVolume: builder.query({
      query: ({ limit, coin }) => {
        return {
          url: `/exchange/symbol/histoday?fsym=${coin}&tsym=USD&limit=${limit}&e=Binance`,
        };
      },
    }),
  }),
});

export const {
  useGetCryptosQuery,
  useGetCryptoDetailsQuery, // 새로운 쿼리 훅 expo
} = cryptoApi;

export const { useGetCryptosHistoryQuery } = cryptoHistoryApi;
export const {
  useGetCryptoCompareHistoryQuery,
  useGetCryptoCompareVolumeQuery,
} = cryptoCompareHistoryApi;
