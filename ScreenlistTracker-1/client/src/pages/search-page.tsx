import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { TvShow, StreamingService, Genre, WatchlistEntry } from "@shared/schema";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import ShowCard from "@/components/shows/show-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Search as SearchIcon, Filter, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function SearchPage() {
  const [, params] = useLocation();
  const queryParams = new URLSearchParams(params);
  const initialQuery = queryParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    genres: [] as number[],
    services: [] as number[],
    rating: [0, 50],
    years: ""
  });
  
  // Fetch TV shows, streaming services, genres, and watchlist
  const { data: tvShows, isLoading: showsLoading } = useQuery<TvShow[]>({
    queryKey: ["/api/shows"],
  });
  
  const { data: streamingServices, isLoading: servicesLoading } = useQuery<StreamingService[]>({
    queryKey: ["/api/streaming-services"],
  });
  
  const { data: genres, isLoading: genresLoading } = useQuery<Genre[]>({
    queryKey: ["/api/genres"],
  });
  
  const { data: watchlist, isLoading: watchlistLoading } = useQuery<WatchlistEntry[]>({
    queryKey: ["/api/watchlist"],
  });
  
  const isLoading = showsLoading || servicesLoading || genresLoading || watchlistLoading;
  
  // Filter shows based on search query and filters
  const filteredShows = tvShows 
    ? tvShows.filter(show => {
        // Text search
        const matchesSearch = searchQuery 
          ? show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (show.description && show.description.toLowerCase().includes(searchQuery.toLowerCase()))
          : true;
        
        // Genre filter
        const matchesGenre = filters.genres.length > 0 
          ? show.genres && show.genres.some(genreId => 
              filters.genres.includes(parseInt(genreId))
            )
          : true;
        
        // Streaming service filter
        const matchesService = filters.services.length > 0
          ? filters.services.includes(show.streamingServiceId || 0)
          : true;
        
        // Rating filter
        const matchesRating = show.rating 
          ? show.rating >= filters.rating[0] && show.rating <= filters.rating[1]
          : true;
        
        // Year filter - simplified for demo
        const matchesYear = filters.years 
          ? show.year && show.year.includes(filters.years)
          : true;
        
        return matchesSearch && matchesGenre && matchesService && matchesRating && matchesYear;
      })
    : [];
  
  // Check if a show is in the watchlist
  const isInWatchlist = (showId: number): boolean => {
    if (!watchlist) return false;
    return watchlist.some(entry => entry.showId === showId);
  };
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  // Toggle genre filter
  const toggleGenreFilter = (genreId: number) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter(id => id !== genreId)
        : [...prev.genres, genreId]
    }));
  };
  
  // Toggle service filter
  const toggleServiceFilter = (serviceId: number) => {
    setFilters(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      genres: [],
      services: [],
      rating: [0, 50],
      years: ""
    });
  };
  
  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.genres.length > 0) count++;
    if (filters.services.length > 0) count++;
    if (filters.rating[0] > 0 || filters.rating[1] < 50) count++;
    if (filters.years) count++;
    return count;
  };
  
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow flex">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-background-light pb-16 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Find TV Shows</h1>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      type="text"
                      placeholder="Search by title or description..."
                      className="pl-10 pr-4 py-2 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </form>
                </div>
                
                <div className="flex gap-2">
                  <Select
                    value={filters.years}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, years: value }))}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Year</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                      <SelectItem value="2019">2019</SelectItem>
                      <SelectItem value="2018">2018</SelectItem>
                      <SelectItem value="2017">2017</SelectItem>
                      <SelectItem value="2016">2016</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                        {getActiveFilterCount() > 0 && (
                          <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                            {getActiveFilterCount()}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filter Shows</SheetTitle>
                        <SheetDescription>
                          Narrow down your search results
                        </SheetDescription>
                      </SheetHeader>
                      
                      <div className="py-4">
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium">Genres</h3>
                            {filters.genres.length > 0 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-auto py-1 px-2 text-xs"
                                onClick={() => setFilters(prev => ({ ...prev, genres: [] }))}
                              >
                                Clear
                              </Button>
                            )}
                          </div>
                          <div className="space-y-2">
                            {genres?.map(genre => (
                              <div key={genre.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`genre-${genre.id}`} 
                                  checked={filters.genres.includes(genre.id)}
                                  onCheckedChange={() => toggleGenreFilter(genre.id)}
                                />
                                <Label htmlFor={`genre-${genre.id}`} className="text-sm">
                                  {genre.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium">Streaming Services</h3>
                            {filters.services.length > 0 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-auto py-1 px-2 text-xs"
                                onClick={() => setFilters(prev => ({ ...prev, services: [] }))}
                              >
                                Clear
                              </Button>
                            )}
                          </div>
                          <div className="space-y-2">
                            {streamingServices?.map(service => (
                              <div key={service.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`service-${service.id}`} 
                                  checked={filters.services.includes(service.id)}
                                  onCheckedChange={() => toggleServiceFilter(service.id)}
                                />
                                <Label htmlFor={`service-${service.id}`} className="text-sm">
                                  {service.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium">Rating</h3>
                            {(filters.rating[0] > 0 || filters.rating[1] < 50) && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-auto py-1 px-2 text-xs"
                                onClick={() => setFilters(prev => ({ ...prev, rating: [0, 50] }))}
                              >
                                Reset
                              </Button>
                            )}
                          </div>
                          <div className="px-2">
                            <Slider
                              value={filters.rating}
                              min={0}
                              max={50}
                              step={1}
                              onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value as [number, number] }))}
                              className="my-4"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{(filters.rating[0] / 10).toFixed(1)}</span>
                              <span>{(filters.rating[1] / 10).toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mt-6 pt-4 border-t">
                          <Button variant="outline" onClick={resetFilters}>
                            Reset All
                          </Button>
                          <SheetClose asChild>
                            <Button>Apply Filters</Button>
                          </SheetClose>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              
              {/* Active filters badges */}
              {(filters.genres.length > 0 || filters.services.length > 0 || filters.years) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {filters.genres.map(genreId => {
                    const genre = genres?.find(g => g.id === genreId);
                    return genre ? (
                      <Badge key={genre.id} variant="secondary" className="flex items-center gap-1">
                        {genre.name}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => toggleGenreFilter(genre.id)} 
                        />
                      </Badge>
                    ) : null;
                  })}
                  
                  {filters.services.map(serviceId => {
                    const service = streamingServices?.find(s => s.id === serviceId);
                    return service ? (
                      <Badge key={service.id} variant="secondary" className="flex items-center gap-1">
                        {service.name}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => toggleServiceFilter(service.id)} 
                        />
                      </Badge>
                    ) : null;
                  })}
                  
                  {filters.years && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Year: {filters.years}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setFilters(prev => ({ ...prev, years: "" }))} 
                      />
                    </Badge>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto py-1 text-xs"
                    onClick={resetFilters}
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </div>
            
            {/* Search results */}
            {filteredShows.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">No shows found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button onClick={resetFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {searchQuery ? `Results for "${searchQuery}"` : "All Shows"}
                  <span className="text-gray-500 text-sm ml-2">({filteredShows.length} shows)</span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredShows.map(show => (
                    <ShowCard 
                      key={show.id} 
                      show={show} 
                      isInWatchlist={isInWatchlist(show.id)} 
                      type="recommendation" 
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
}
