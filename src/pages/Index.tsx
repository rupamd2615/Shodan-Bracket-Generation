import React, { useState } from 'react';
import { Participant, AgeGroup, WeightClass, Group } from '@/types';
import ParticipantUpload from '@/components/ParticipantUpload';
import ParticipantTable from '@/components/ParticipantTable';
import GroupSettings from '@/components/GroupSettings';
import GroupPreview from '@/components/GroupPreview';
import BracketGeneration from '@/components/BracketGeneration';
import { Button } from '@/components/ui/button';
import { groupParticipants } from '@/utils/dataUtils';
import { defaultAgeGroups, defaultWeightClasses } from '@/utils/sampleData';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
const Index = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>(defaultAgeGroups);
  const [weightClasses, setWeightClasses] = useState<WeightClass[]>(defaultWeightClasses);
  const [groups, setGroups] = useState<Group[]>([]);
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState<'upload' | 'settings' | 'preview' | 'generation' | 'complete'>('upload');
  const handleParticipantsUploaded = (newParticipants: Participant[]) => {
    setParticipants(newParticipants);
    if (newParticipants.length > 0) {
      setCurrentStep('settings');
    }
  };
  const handleGroupingComplete = () => {
    if (participants.length === 0) {
      toast.error('Please upload participants before continuing');
      return;
    }
    if (ageGroups.length === 0 || weightClasses.length === 0) {
      toast.error('Please add age groups and weight classes before continuing');
      return;
    }
    const generatedGroups = groupParticipants(participants, ageGroups, weightClasses);
    setGroups(generatedGroups);
    setCurrentStep('preview');
    toast.success(`Created ${generatedGroups.length} groups from ${participants.length} participants`);
  };
  const handleGroupsConfirmed = () => {
    setCurrentStep('generation');
  };
  const handleGenerationComplete = () => {
    setCurrentStep('complete');
    toast.success('Tournament brackets and scoresheets generated successfully!');
  };
  const handleReset = () => {
    // Reset to initial state
    setParticipants([]);
    setAgeGroups(defaultAgeGroups);
    setWeightClasses(defaultWeightClasses);
    setGroups([]);
    setCurrentStep('upload');
    toast.info('Application reset. Ready for new tournament.');
  };
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-karate-red text-white p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Shodan: Bracket Generation</h1>
            {currentStep !== 'upload' && <button onClick={handleReset} className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors">
                Start New Tournament
              </button>}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="hidden sm:flex items-center w-full max-w-3xl justify-between">
            <div className={`flex flex-col items-center ${currentStep === 'upload' ? 'text-karate-red' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-1 ${currentStep === 'upload' ? 'bg-karate-red text-white' : 'bg-muted text-foreground'}`}>
                1
              </div>
              <span className="text-xs md:text-sm">Upload</span>
            </div>
            
            <div className="h-px bg-border flex-1 mx-2" />
            
            <div className={`flex flex-col items-center ${currentStep === 'settings' ? 'text-karate-red' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-1 ${currentStep === 'settings' ? 'bg-karate-red text-white' : 'bg-muted text-foreground'}`}>
                2
              </div>
              <span className="text-xs md:text-sm">Settings</span>
            </div>
            
            <div className="h-px bg-border flex-1 mx-2" />
            
            <div className={`flex flex-col items-center ${currentStep === 'preview' ? 'text-karate-red' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-1 ${currentStep === 'preview' ? 'bg-karate-red text-white' : 'bg-muted text-foreground'}`}>
                3
              </div>
              <span className="text-xs md:text-sm">Groups</span>
            </div>
            
            <div className="h-px bg-border flex-1 mx-2" />
            
            <div className={`flex flex-col items-center ${currentStep === 'generation' || currentStep === 'complete' ? 'text-karate-red' : 'text-muted-foreground'}`}>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-1 ${currentStep === 'generation' || currentStep === 'complete' ? 'bg-karate-red text-white' : 'bg-muted text-foreground'}`}>
                4
              </div>
              <span className="text-xs md:text-sm">Brackets</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column (only visible in steps 1-3) */}
          {currentStep !== 'generation' && currentStep !== 'complete' && <div className="md:col-span-1">
              {currentStep === 'upload' && <ParticipantUpload onParticipantsUploaded={handleParticipantsUploaded} />}
              
              {currentStep === 'settings' && <GroupSettings ageGroups={ageGroups} weightClasses={weightClasses} onUpdateAgeGroups={setAgeGroups} onUpdateWeightClasses={setWeightClasses} onGroupingComplete={handleGroupingComplete} />}
              
              {currentStep === 'preview' && <GroupPreview groups={groups} onGroupsConfirmed={handleGroupsConfirmed} />}
            </div>}
          
          {/* Right/Main Column */}
          <div className={currentStep === 'generation' || currentStep === 'complete' ? 'md:col-span-3' : 'md:col-span-2'}>
            {currentStep === 'upload' && participants.length > 0 && <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 lg:p-8">
                <h2 className="text-xl font-bold mb-4">Participant Preview</h2>
                <ParticipantTable participants={participants} />
              </div>}
            
            {currentStep === 'settings' && <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 lg:p-8">
                <h2 className="text-xl font-bold mb-4">Participant List</h2>
                <ParticipantTable participants={participants} />
              </div>}
            
            {currentStep === 'preview' && <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 lg:p-8">
                <h2 className="text-xl font-bold mb-4">Participant Distribution</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Total Participants: {participants.length}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/40 rounded-lg">
                      <h3 className="font-medium mb-2">By Category</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Kata</span>
                          <span>{participants.filter(p => p.category === 'Kata').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kumite</span>
                          <span>{participants.filter(p => p.category === 'Kumite').length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-muted/40 rounded-lg">
                      <h3 className="font-medium mb-2">By Sex</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Male</span>
                          <span>{participants.filter(p => p.sex === 'M').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Female</span>
                          <span>{participants.filter(p => p.sex === 'F').length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
            
            {currentStep === 'generation' && <BracketGeneration groups={groups} onComplete={handleGenerationComplete} />}
            
            {currentStep === 'complete' && <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:p-8 lg:p-10 text-center">
                <div className="flex flex-col items-center max-w-lg mx-auto">
                  <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Tournament Setup Complete!</h2>
                  <p className="text-muted-foreground mb-6">
                    All brackets and scoresheets have been generated. You can download them individually or as a complete package.
                  </p>
                  
                  <div className="space-y-4 w-full max-w-xs mx-auto">
                    <Button onClick={() => setCurrentStep('generation')} variant="outline" className="w-full">
                      Return to Brackets & Scoresheets
                    </Button>
                    <Button onClick={handleReset} className="w-full">
                      Start a New Tournament
                    </Button>
                  </div>
                </div>
              </div>}
          </div>
        </div>
      </main>
      
      <footer className="bg-karate-black text-white py-6 mt-12">
        <div className="container mx-auto px-4 md:flex md:items-center md:justify-between">
          <p className="text-center md:text-left">Shodan: Karate Bracket Generator &copy; {new Date().getFullYear()}</p>
          <p className="text-gray-400 text-xs mt-1 text-center md:text-right">
            A streamlined solution for karate tournament organizers
          </p>
        </div>
      </footer>
    </div>;
};
export default Index;