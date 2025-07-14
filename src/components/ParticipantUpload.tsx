
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Participant } from '@/types';
import { readCSVFile, readExcelFile } from '@/utils/fileUtils';
import { generateSampleParticipants } from '@/utils/sampleData';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface ParticipantUploadProps {
  onParticipantsUploaded: (participants: Participant[]) => void;
}

const ParticipantUpload: React.FC<ParticipantUploadProps> = ({ onParticipantsUploaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    setIsLoading(true);
    toast.info('Processing participant data...');
    
    try {
      let participants: Participant[];
      
      if (file.name.endsWith('.csv')) {
        participants = await readCSVFile(file);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        participants = await readExcelFile(file);
      } else {
        throw new Error('Unsupported file format. Please upload a CSV or Excel file.');
      }
      
      onParticipantsUploaded(participants);
      toast.success(`Successfully imported ${participants.length} participants`);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file. Please check the format and try again.');
    } finally {
      setIsLoading(false);
      // Reset the input
      e.target.value = '';
    }
  };

  const handleUseSample = () => {
    const sampleParticipants = generateSampleParticipants();
    onParticipantsUploaded(sampleParticipants);
    toast.success(`Loaded ${sampleParticipants.length} sample participants`);
  };

  return (
    <div className="form-container w-full lg:max-w-xl mx-auto lg:mx-0">
      <h2 className="section-title">Upload Participants</h2>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="file-upload" className="text-sm font-medium">
            Select Participant Spreadsheet (.csv, .xlsx)
          </label>
          <Input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            The spreadsheet should have columns for Name, Age, Sex, Weight, and Category.
          </p>
        </div>
        
        <div className="flex items-center space-x-4 pt-2">
          <div className="h-px flex-1 bg-border"></div>
          <div className="text-xs text-muted-foreground">OR</div>
          <div className="h-px flex-1 bg-border"></div>
        </div>
        
        <Button 
          onClick={handleUseSample} 
          variant="outline" 
          className="w-full"
          disabled={isLoading}
        >
          Use Sample Data
        </Button>
      </div>
    </div>
  );
};

export default ParticipantUpload;
