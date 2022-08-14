import React from "react";
import { ApiClient } from "../api.api-client";
import { IError } from "../../interfaces/error.interface";
import { IPost } from "../../interfaces/post.interface";

export const useGetPostService = () => {
  try {
    // const [loading, setLoading] = React.useState(false);
    // const [error, setError] = React.useState<IError>({ message: [], statusCode: 0 });

    const getPost = async (slug: string) => {
      try {
        const { data } = await ApiClient.get<IPost>(`/post/${slug}`);
        return data
      } catch (error: any) {
        // setError(error?.response?.message || error?.response?.data)
      } finally {
        // setLoading(false);
      }
    }

    return { getPost };
  } catch (error: any) {
    throw Error(error?.message as string)
  }
}
