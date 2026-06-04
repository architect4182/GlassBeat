import axios from "axios";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const searchYouTube = async (query: string) => {
  const { data } = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      params: {
        part: "snippet",
        maxResults: 20,
        q: query,
        type: "video",
        key: API_KEY,
      },
    }
  );

  return data.items;
};
