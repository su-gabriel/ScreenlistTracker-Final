import { useQuery } from "@tanstack/react-query";
import { PersonalityInsight } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Info, Clock, User } from "lucide-react";

export default function PersonalityInsights() {
  // Fetch personality insights
  const { data: personalityData, isLoading } = useQuery<PersonalityInsight>({
    queryKey: ["/api/personality"],
  });
  
  if (isLoading) {
    return (
      <section className="mb-10 bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-100 rounded-lg p-4 h-64"></div>
            <div className="bg-gray-100 rounded-lg p-4 h-64"></div>
            <div className="bg-gray-100 rounded-lg p-4 h-64"></div>
          </div>
        </div>
      </section>
    );
  }
  
  // Extract personality data
  const favoriteGenres = personalityData?.traits?.favoriteGenres || [];
  const watchHabits = personalityData?.traits?.watchHabits || [];
  const characterTraits = personalityData?.traits?.characterTraits || [];
  
  return (
    <section className="mb-10 bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your TV Personality Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Favorite Genres</h3>
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              {favoriteGenres.map(genre => (
                <div key={genre.name}>
                  <div className="flex items-center justify-between text-xs text-gray-700">
                    <span>{genre.name}</span>
                    <span>{genre.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-primary rounded-full h-2" 
                      style={{width: `${genre.percentage}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Watch Habits</h3>
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div className="space-y-4">
              {watchHabits.map(habit => (
                <div key={habit.name} className="flex items-center">
                  <div className="rounded-full bg-purple-200 p-2 mr-3">
                    <Clock className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">{habit.name}</div>
                    <div className="text-xs text-gray-500">{habit.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Character Traits</h3>
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-sm text-gray-700 space-y-3">
              {characterTraits.map((trait, index) => (
                <div key={index} className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    index === 0 ? 'bg-green-500' : 
                    index === 1 ? 'bg-blue-500' : 
                    index === 2 ? 'bg-yellow-500' : 
                    'bg-purple-500'
                  }`}></span>
                  <span>{trait}</span>
                </div>
              ))}
              <Link href="/insights">
                <Button variant="link" className="text-primary hover:text-blue-700 text-xs block mt-3 p-0 h-auto">
                  See full personality report →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
