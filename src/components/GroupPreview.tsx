
import React, { useState } from 'react';
import { Group, Participant } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';

interface GroupPreviewProps {
  groups: Group[];
  onGroupsConfirmed: () => void;
}

const GroupPreview: React.FC<GroupPreviewProps> = ({ groups, onGroupsConfirmed }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'kata' | 'kumite'>('all');
  
  const kataGroups = groups.filter(group => group.type === 'Kata');
  const kumiteGroups = groups.filter(group => group.type === 'Kumite');
  
  const displayGroups = 
    activeTab === 'all' ? groups :
    activeTab === 'kata' ? kataGroups :
    kumiteGroups;

  const groupStats = {
    total: groups.length,
    kata: kataGroups.length,
    kumite: kumiteGroups.length,
    participants: groups.reduce((total, group) => total + group.participants.length, 0)
  };

  return (
    <div className="form-container">
      <h2 className="section-title">Group Preview</h2>
      
      <div className="bg-muted/50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Groups</p>
            <p className="text-2xl font-bold">{groupStats.total}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Kata Groups</p>
            <p className="text-2xl font-bold">{groupStats.kata}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Kumite Groups</p>
            <p className="text-2xl font-bold">{groupStats.kumite}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Participants</p>
            <p className="text-2xl font-bold">{groupStats.participants}</p>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab as (value: string) => void}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Groups</TabsTrigger>
          <TabsTrigger value="kata">Kata</TabsTrigger>
          <TabsTrigger value="kumite">Kumite</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4 space-y-4">
          {displayGroups.length > 0 ? (
            displayGroups.map(group => (
              <Card key={group.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between">
                    <span>{group.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {group.participants.length} participants
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Sex</TableHead>
                        {group.type === 'Kumite' && <TableHead>Weight (kg)</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.participants.map(participant => (
                        <TableRow key={participant.id}>
                          <TableCell className="font-medium">{participant.name}</TableCell>
                          <TableCell>{participant.age}</TableCell>
                          <TableCell>{participant.sex}</TableCell>
                          {group.type === 'Kumite' && <TableCell>{participant.weight}</TableCell>}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex h-24 items-center justify-center rounded-md border border-dashed">
              <p className="text-sm text-muted-foreground">
                No groups found for the selected category.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Separator className="my-6" />
      
      <div className="flex flex-col items-center space-y-2">
        <Button
          onClick={onGroupsConfirmed}
          className="w-full md:w-auto"
          disabled={groups.length === 0}
        >
          Generate Brackets and Scoresheets <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          This will create brackets for Kumite groups and scoresheets for Kata groups.
        </p>
      </div>
    </div>
  );
};

export default GroupPreview;
