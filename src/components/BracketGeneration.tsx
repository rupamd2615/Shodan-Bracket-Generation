
import React, { useState, useEffect } from 'react';
import { Group, Bracket } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import KumiteBracket from './KumiteBracket';
import KataScoresheet from './KataScoresheet';
import { generateKumiteBracket } from '@/utils/dataUtils';
import { ArrowRight, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateAllPDFs, downloadPDF } from '@/utils/pdfUtils';

interface BracketGenerationProps {
  groups: Group[];
  onComplete: () => void;
}

const BracketGeneration: React.FC<BracketGenerationProps> = ({ groups, onComplete }) => {
  const [activeTab, setActiveTab] = useState<'kumite' | 'kata'>('kumite');
  const [brackets, setBrackets] = useState<Bracket[]>([]);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  
  const kumiteGroups = groups.filter(group => group.type === 'Kumite');
  const kataGroups = groups.filter(group => group.type === 'Kata');

  // Generate brackets only once when the component mounts or when kumiteGroups changes
  useEffect(() => {
    // This check prevents unnecessary recalculations when brackets exist
    // Only regenerate when kumiteGroups change and there are no brackets yet
    if (kumiteGroups.length > 0 && brackets.length === 0) {
      const generatedBrackets = kumiteGroups.map(group => generateKumiteBracket(group));
      setBrackets(generatedBrackets);
    }
  }, [kumiteGroups, brackets.length]);

  const handleDownloadAll = async () => {
    if (isGeneratingAll) return;
    
    setIsGeneratingAll(true);
    toast.loading('Preparing all tournament documents. This may take a minute for large tournaments...');
    
    try {
      // Use the improved generateAllPDFs function that returns a Blob
      const pdfBlob = await generateAllPDFs(brackets, kataGroups);
      
      // Download the consolidated PDF
      downloadPDF(pdfBlob, 'tournament_brackets_and_scoresheets.pdf');
      toast.success('All tournament documents generated and downloaded successfully!');
    } catch (error) {
      console.error('Error downloading all PDFs:', error);
      toast.error('Failed to download all PDFs. Please try downloading them individually.');
    } finally {
      setIsGeneratingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">Bracket & Scoresheet Preview</h2>
            <div className="flex space-x-2">
              <Button 
                onClick={handleDownloadAll} 
                variant="outline"
                disabled={isGeneratingAll}
                className="gap-1.5"
              >
                {isGeneratingAll ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download All PDFs
                  </>
                )}
              </Button>
              <Button onClick={onComplete} className="gap-1.5">
                Finish <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab as (value: string) => void}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="kumite">
                Kumite Brackets ({kumiteGroups.length})
              </TabsTrigger>
              <TabsTrigger value="kata">
                Kata Scoresheets ({kataGroups.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="kumite" className="space-y-6">
              {brackets.length > 0 ? (
                brackets.map((bracket, index) => (
                  <KumiteBracket 
                    key={bracket.id} 
                    bracket={bracket} 
                    group={kumiteGroups[index]} 
                  />
                ))
              ) : (
                <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">
                    No Kumite groups found to generate brackets.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="kata" className="space-y-6">
              {kataGroups.length > 0 ? (
                kataGroups.map(group => (
                  <KataScoresheet key={group.id} group={group} />
                ))
              ) : (
                <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">
                    No Kata groups found to generate scoresheets.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BracketGeneration;
