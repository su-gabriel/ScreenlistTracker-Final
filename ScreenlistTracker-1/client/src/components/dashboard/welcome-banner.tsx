import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { PersonalityInsight } from "@shared/schema";

export default function WelcomeBanner() {
  const { user } = useAuth();
  
  // Fetch personality insights
  const { data: personalityData } = useQuery<PersonalityInsight>({
    queryKey: ["/api/personality"],
  });
  
  // Fetch watch history to count episodes
  const { data: watchHistory } = useQuery({
    queryKey: ["/api/watch-history"],
  });
  
  // Calculate watched episodes
  const watchedEpisodes = watchHistory ? watchHistory.length : 0;
  
  // Get personality type
  const personalityType = personalityData?.traits?.personalityType || "Complex Character Enthusiast";
  
  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-5 sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name || user?.username || 'User'}!</h2>
          <p className="mt-1 text-sm text-gray-600">
            You've watched {watchedEpisodes} episode{watchedEpisodes !== 1 ? 's' : ''} this week
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/search">
            <Button className="inline-flex items-center">
              Add to watchlist
            </Button>
          </Link>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-5">
        <div className="text-sm">
          <div className="font-medium text-gray-700">Your TV Personality</div>
          <div className="mt-1 text-gray-600">
            Based on your watch history, you're a <span className="font-semibold text-primary">{personalityType}</span> who appreciates nuanced storytelling and character development.
          </div>
          <Link href="/insights">
            <Button variant="link" className="mt-2 p-0 h-auto text-primary hover:text-blue-700">
              View full insights →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
