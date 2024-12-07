import Post from "./Post";
import PostSkeleton from "../components/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, username, userId }) => {
  const getPostendPoint = () => {
    switch (feedType) {
      case "forYou":
        return "http://localhost:3000/api/posts/all";
      case "following":
        return "http://localhost:3000/api/posts/following";
      case "posts":
        return `http://localhost:3000/api/posts/user/${username}`;
      case "likes":
        return `http://localhost:3000/api/posts/likes/${userId}`;
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostendPoint(feedType);

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["posts", POST_ENDPOINT],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Something went wrong");
        console.log(data);
        console.log(typeof data);

        return data;
      } catch (error) {
        throw new Error(error.message || "Something went wrong");
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch, username]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && isRefetching && data?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && data && (
        <div>
          {data.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
