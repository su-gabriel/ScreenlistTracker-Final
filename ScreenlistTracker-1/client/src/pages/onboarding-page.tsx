import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StreamingSelect from "@/components/onboarding/streaming-select";
import GenreSelect from "@/components/onboarding/genre-select";

export default function OnboardingPage() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("streaming");
  const [preferenceData, setPreferenceData] = useState<{
    streamingServices: number[];
    favoriteGenres: number[];
  } | null>(null);
  
  // Check if user already has preferences
  const { data: userPreferences, isLoading } = useQuery({
    queryKey: ["/api/user-preferences"],
  });
  
  // Initialize preference data from existing preferences
  useEffect(() => {
    if (userPreferences) {
      setPreferenceData({
        streamingServices: userPreferences.streamingServices || [],
        favoriteGenres: userPreferences.favoriteGenres || []
      });
    }
  }, [userPreferences]);
  
  // Check if onboarding is already complete
  useEffect(() => {
    if (!isLoading && userPreferences) {
      // If user has both streaming services and genres, redirect to home
      if (
        userPreferences.streamingServices?.length > 0 && 
        userPreferences.favoriteGenres?.length > 0
      ) {
        navigate("/");
      }
      // If user has streaming services but no genres, go to genre tab
      else if (userPreferences.streamingServices?.length > 0) {
        setActiveTab("genres");
      }
    }
  }, [userPreferences, isLoading, navigate]);
  
  // Move to the next step
  const handleStreamingComplete = () => {
    setActiveTab("genres");
  };
  
  // Complete onboarding
  const handleGenresComplete = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <svg className="h-12 w-12 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6ZM4 6V18H20V6H4Z" />
            <path d="M9.5 9C9.5 8.17157 10.1716 7.5 11 7.5H13C13.8284 7.5 14.5 8.17157 14.5 9V15C14.5 15.8284 13.8284 16.5 13 16.5H11C10.1716 16.5 9.5 15.8284 9.5 15V9Z" />
          </svg>
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
          Set Up Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Let's customize your experience to get the best recommendations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="streaming">Streaming Services</TabsTrigger>
              <TabsTrigger value="genres">Favorite Genres</TabsTrigger>
            </TabsList>
            
            <TabsContent value="streaming">
              <StreamingSelect 
                onComplete={handleStreamingComplete} 
                preferenceData={preferenceData}
                setPreferenceData={setPreferenceData}
              />
            </TabsContent>
            
            <TabsContent value="genres">
              <GenreSelect 
                onComplete={handleGenresComplete} 
                preferenceData={preferenceData}
                setPreferenceData={setPreferenceData}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
