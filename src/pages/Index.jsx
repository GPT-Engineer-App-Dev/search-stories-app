import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const storyIds = await res.json();
  const stories = await Promise.all(
    storyIds.slice(0, 100).map(async (id) => {
      const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return storyRes.json();
    })
  );
  return stories;
};

const Index = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStories = data?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Hacker News Top Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {isLoading ? (
        <SkeletonPlaceholder />
      ) : error ? (
        <p className="text-red-500">Error loading stories</p>
      ) : (
        <StoryList stories={filteredStories} />
      )}
    </div>
  );
};

const StoryList = ({ stories }) => (
  <div className="space-y-4">
    {stories.map((story) => (
      <div key={story.id} className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold">{story.title}</h2>
        <p>{story.score} upvotes</p>
        <a
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Read more
        </a>
      </div>
    ))}
  </div>
);

const SkeletonPlaceholder = () => (
  <div className="space-y-4">
    {Array.from({ length: 10 }).map((_, index) => (
      <Skeleton key={index} className="h-24 w-full" />
    ))}
  </div>
);

export default Index;