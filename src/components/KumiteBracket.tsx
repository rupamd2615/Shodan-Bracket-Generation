
import React, { useState } from 'react';
import { Bracket, Match, Group } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateKumitePDF, downloadPDF } from '@/utils/pdfUtils';
import { Loader2, Download } from 'lucide-react';
import { toast } from 'sonner';

interface KumiteBracketProps {
  bracket: Bracket;
  group: Group;
}

const KumiteBracket: React.FC<KumiteBracketProps> = ({ bracket, group }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const maxRounds = Math.max(...bracket.matches.map(m => m.round));
  
  const handleDownloadPDF = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const pdfData = await generateKumitePDF(bracket.id, group.name);
      const filename = `${group.name.replace(/\s+/g, '_')}_bracket.pdf`;
      
      downloadPDF(pdfData, filename);
      toast.success(`Bracket PDF for ${group.name} generated successfully`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to generate bracket PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Organize matches by round
  const matchesByRound: { [key: number]: Match[] } = {};
  
  bracket.matches.forEach(match => {
    if (!matchesByRound[match.round]) {
      matchesByRound[match.round] = [];
    }
    matchesByRound[match.round].push(match);
  });

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>{group.name} Bracket</span>
          <Button 
            size="sm" 
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="gap-1.5"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          id={`bracket-${bracket.id}`} 
          className="p-4 bg-white rounded-lg"
          data-group-id={JSON.stringify(group)}
        >
          <div className="overflow-x-auto">
            <div className="flex space-x-8 min-w-max">
              {Array.from({ length: maxRounds }, (_, i) => i + 1).map(round => (
                <div key={round} className="flex flex-col space-y-8">
                  <div className="text-center font-semibold mb-4">
                    {round === maxRounds ? 'Final' : 
                     round === maxRounds - 1 ? 'Semi-Finals' :
                     round === maxRounds - 2 ? 'Quarter-Finals' :
                     `Round ${round}`}
                  </div>
                  
                  <div className="flex flex-col space-y-12">
                    {matchesByRound[round]?.map(match => (
                      <div key={match.id} className="relative flex flex-col">
                        <div className="bracket-match bg-white border-2 border-karate-black dark:border-white w-56 rounded-md overflow-hidden">
                          <div className="border-b border-karate-black dark:border-white p-2 bg-karate-red text-white text-center text-sm">
                            Match #{match.position} - Round {match.round}
                          </div>
                          <div className="p-2 border-b border-karate-black dark:border-white flex justify-between items-center">
                            <span className="font-medium truncate max-w-[80%]">
                              {match.participant1?.name || 'TBD'}
                            </span>
                          </div>
                          <div className="p-2 flex justify-between items-center">
                            <span className="font-medium truncate max-w-[80%]">
                              {match.participant2?.name || 'TBD'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Draw connector lines to next match if not final */}
                        {round < maxRounds && (
                          <div className="absolute right-0 top-1/2 w-8 h-px bg-karate-black dark:bg-white"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KumiteBracket;
