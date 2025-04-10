import { useQuery } from "@tanstack/react-query";
import { PersonalityInsight } from "@shared/schema";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { Loader2, Calendar, Eye, TrendingUp, BarChart3, BrainCircuit } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InsightsPage() {
  // Fetch personality insights
  const { data: insightData, isLoading } = useQuery<PersonalityInsight>({
    queryKey: ["/api/personality"],
  });
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-background-light pb-16 md:pb-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    );
  }
  
  // Extract personality data
  const personalityType = insightData?.traits?.personalityType || "Complex Character Enthusiast";
  const favoriteGenres = insightData?.traits?.favoriteGenres || [];
  const watchHabits = insightData?.traits?.watchHabits || [];
  const characterTraits = insightData?.traits?.characterTraits || [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow flex">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-background-light pb-16 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Your TV Personality</h1>
              <p className="text-gray-600">Insights and analysis based on your viewing habits</p>
            </div>
            
            <Card className="mb-8 border-none shadow-md bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BrainCircuit className="mr-2 h-6 w-6 text-primary" />
                  Personality Profile
                </CardTitle>
                <CardDescription>Based on your watch history and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {personalityType}
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    You have an appreciation for nuanced storytelling and complex character development. 
                    Your viewing choices reveal an analytical mind that enjoys unraveling intricate plots
                    and exploring the depth of character motivations.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
                    Genre Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {favoriteGenres.map(genre => (
                      <div key={genre.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{genre.name}</span>
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
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-green-500" />
                    Viewing Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div key={i} className="text-center text-xs font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                    {[4, 1, 2, 3, 5, 6, 7].map((activity, i) => (
                      <div 
                        key={i} 
                        className="h-6 rounded-sm" 
                        style={{ 
                          backgroundColor: `rgba(59, 130, 246, ${activity / 10})`,
                          opacity: activity > 0 ? 1 : 0.2
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 mt-4">
                    {watchHabits.map(habit => (
                      <div key={habit.name} className="flex items-center">
                        <div className="rounded-full bg-green-100 p-1.5 mr-2.5">
                          <Eye className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{habit.name}</div>
                          <div className="text-xs text-gray-500">{habit.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-purple-500" />
                    Character Traits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {characterTraits.map((trait, index) => (
                      <div key={index} className="flex items-center p-2 rounded-md" style={{
                        backgroundColor: index === 0 ? 'rgba(59, 130, 246, 0.1)' :
                                         index === 1 ? 'rgba(139, 92, 246, 0.1)' :
                                         index === 2 ? 'rgba(236, 72, 153, 0.1)' :
                                         'rgba(16, 185, 129, 0.1)'
                      }}>
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-purple-500' : 
                          index === 2 ? 'bg-pink-500' : 
                          'bg-green-500'
                        }`}></span>
                        <span className="text-sm">{trait}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium mb-2">Shows That Define You</h4>
                    <div className="flex flex-wrap gap-2">
                      <div className="py-1 px-2 text-xs bg-gray-100 rounded text-gray-700">Breaking Bad</div>
                      <div className="py-1 px-2 text-xs bg-gray-100 rounded text-gray-700">Succession</div>
                      <div className="py-1 px-2 text-xs bg-gray-100 rounded text-gray-700">The Crown</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Viewing Activity</CardTitle>
                <CardDescription>Your watching trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
                  <div className="relative w-full h-full p-6">
                    {/* Simple chart representation */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around h-full">
                      {[35, 65, 40, 70, 55, 80, 60, 50, 90, 75, 85, 65].map((height, i) => (
                        <div 
                          key={i} 
                          className="w-1/14 bg-primary hover:bg-primary/80 transition-all rounded-t-sm cursor-pointer relative group"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded">
                            {height}%
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
                    <div className="absolute left-0 bottom-0 top-0 w-px bg-gray-200"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}
