import { useQuery, useMutation } from "@tanstack/react-query";
import { StreamingService } from "@shared/schema";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { saveUserPreferences } from "@/lib/tvshows";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface StreamingSelectProps {
  onComplete: () => void;
  preferenceData: {
    streamingServices: number[];
    favoriteGenres: number[];
  } | null;
  setPreferenceData: React.Dispatch<React.SetStateAction<{
    streamingServices: number[];
    favoriteGenres: number[];
  } | null>>;
}

export default function StreamingSelect({ onComplete, preferenceData, setPreferenceData }: StreamingSelectProps) {
  const { toast } = useToast();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  
  // Fetch streaming services
  const { data: streamingServices, isLoading } = useQuery<StreamingService[]>({
    queryKey: ["/api/streaming-services"],
  });
  
  // Save preferences mutation
  const saveMutation = useMutation({
    mutationFn: saveUserPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-preferences"] });
      toast({
        title: "Preferences saved",
        description: "Your streaming services have been updated.",
      });
      onComplete();
    },
    onError: (error) => {
      toast({
        title: "Failed to save preferences",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Initialize selected services from existing preferences
  useEffect(() => {
    if (preferenceData?.streamingServices) {
      setSelectedServices(preferenceData.streamingServices);
    }
  }, [preferenceData]);
  
  const toggleService = (serviceId: number) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };
  
  const handleSave = () => {
    // Update preference data in parent component
    setPreferenceData(prev => ({
      streamingServices: selectedServices,
      favoriteGenres: prev?.favoriteGenres || []
    }));
    
    // Save to API
    if (preferenceData?.favoriteGenres) {
      saveMutation.mutate({
        streamingServices: selectedServices,
        favoriteGenres: preferenceData.favoriteGenres
      });
    } else {
      // Just continue to next step if we don't have genres yet
      onComplete();
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Select Your Streaming Services</h3>
        <p className="text-sm text-gray-500 mt-1">
          Choose the streaming platforms you are subscribed to for better recommendations.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {streamingServices?.map(service => (
          <div
            key={service.id}
            className={`
              rounded-lg border-2 p-4 cursor-pointer transition-colors
              ${selectedServices.includes(service.id) 
                ? `border-${service.color.slice(1)} bg-${service.color.slice(1)}10` 
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            style={{
              borderColor: selectedServices.includes(service.id) ? service.color : '',
              backgroundColor: selectedServices.includes(service.id) ? `${service.color}20` : ''
            }}
            onClick={() => toggleService(service.id)}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                <svg className="h-6 w-6" style={{ color: service.color }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 2v14h14V5H5zm2 2h10v10H7V7zm2 2v6h6V9H9z"/>
                </svg>
              </div>
              <span className="font-medium" style={{ color: selectedServices.includes(service.id) ? service.color : '' }}>
                {service.name}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSave}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {preferenceData?.favoriteGenres ? 'Save Preferences' : 'Next: Select Genres'}
        </Button>
      </div>
    </div>
  );
}
