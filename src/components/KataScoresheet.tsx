
import React, { useState } from 'react';
import { Group } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { generateKataPDF, downloadPDF } from '@/utils/pdfUtils';
import { Loader2, Download } from 'lucide-react';

interface KataScoresheetProps {
  group: Group;
}

const KataScoresheet: React.FC<KataScoresheetProps> = ({ group }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const pdfData = await generateKataPDF(group.id, group.name);
      const filename = `${group.name.replace(/\s+/g, '_')}_scoresheet.pdf`;
      
      downloadPDF(pdfData, filename);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>{group.name} Scoresheet</span>
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
          id={`scoresheet-${group.id}`} 
          className="p-4 bg-white rounded-lg"
          data-group-id={JSON.stringify(group)}
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold">{group.name} - Kata Scoresheet</h3>
            <p className="text-sm text-muted-foreground">
              Age: {group.ageGroup.minAge}-{group.ageGroup.maxAge} years
            </p>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Judge Names</h4>
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="border p-2 rounded-md h-10">
                  <div className="w-full h-full"></div>
                </div>
              ))}
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competitor</TableHead>
                <TableHead>Judge 1</TableHead>
                <TableHead>Judge 2</TableHead>
                <TableHead>Judge 3</TableHead>
                <TableHead>Judge 4</TableHead>
                <TableHead>Judge 5</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Rank</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.name}</TableCell>
                  <TableCell className="border"></TableCell>
                  <TableCell className="border"></TableCell>
                  <TableCell className="border"></TableCell>
                  <TableCell className="border"></TableCell>
                  <TableCell className="border"></TableCell>
                  <TableCell className="border"></TableCell>
                  <TableCell className="border"></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Notes</h4>
            <div className="border rounded-md p-2 h-24"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KataScoresheet;
