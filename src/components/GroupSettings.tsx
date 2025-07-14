
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AgeGroup, WeightClass } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { defaultAgeGroups, defaultWeightClasses } from '@/utils/sampleData';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface GroupSettingsProps {
  ageGroups: AgeGroup[];
  weightClasses: WeightClass[];
  onUpdateAgeGroups: (groups: AgeGroup[]) => void;
  onUpdateWeightClasses: (classes: WeightClass[]) => void;
  onGroupingComplete: () => void;
}

const GroupSettings: React.FC<GroupSettingsProps> = ({
  ageGroups,
  weightClasses,
  onUpdateAgeGroups,
  onUpdateWeightClasses,
  onGroupingComplete
}) => {
  const [ageGroupName, setAgeGroupName] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  
  const [weightClassName, setWeightClassName] = useState('');
  const [minWeight, setMinWeight] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [sex, setSex] = useState<'M' | 'F'>('M');
  
  const [activeTab, setActiveTab] = useState('age');

  const handleAddAgeGroup = () => {
    if (!ageGroupName || !minAge || !maxAge) {
      toast.error('Please fill in all fields for the age group');
      return;
    }
    
    const newAgeGroup: AgeGroup = {
      id: uuidv4(),
      name: ageGroupName,
      minAge: parseInt(minAge, 10),
      maxAge: parseInt(maxAge, 10)
    };
    
    onUpdateAgeGroups([...ageGroups, newAgeGroup]);
    
    // Reset form
    setAgeGroupName('');
    setMinAge('');
    setMaxAge('');
    
    toast.success(`Added age group: ${newAgeGroup.name}`);
  };

  const handleAddWeightClass = () => {
    if (!weightClassName || !minWeight || !maxWeight) {
      toast.error('Please fill in all fields for the weight class');
      return;
    }
    
    const newWeightClass: WeightClass = {
      id: uuidv4(),
      name: weightClassName,
      minWeight: parseFloat(minWeight),
      maxWeight: parseFloat(maxWeight),
      sex
    };
    
    onUpdateWeightClasses([...weightClasses, newWeightClass]);
    
    // Reset form
    setWeightClassName('');
    setMinWeight('');
    setMaxWeight('');
    
    toast.success(`Added weight class: ${newWeightClass.name} (${sex})`);
  };

  const handleRemoveAgeGroup = (id: string) => {
    onUpdateAgeGroups(ageGroups.filter(group => group.id !== id));
    toast.success('Age group removed');
  };

  const handleRemoveWeightClass = (id: string) => {
    onUpdateWeightClasses(weightClasses.filter(cls => cls.id !== id));
    toast.success('Weight class removed');
  };

  const handleUseDefaultGroups = () => {
    onUpdateAgeGroups(defaultAgeGroups);
    onUpdateWeightClasses(defaultWeightClasses);
    toast.success('Loaded default age groups and weight classes');
  };

  return (
    <div className="form-container">
      <h2 className="section-title">Grouping Settings</h2>

      <Button 
        onClick={handleUseDefaultGroups} 
        variant="outline" 
        className="w-full mb-4"
      >
        Use Default Groups
      </Button>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="age">Age Groups</TabsTrigger>
          <TabsTrigger value="weight">Weight Classes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="age" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Group Name</label>
              <Input
                value={ageGroupName}
                onChange={(e) => setAgeGroupName(e.target.value)}
                placeholder="e.g. Children"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Min Age</label>
              <Input
                type="number"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                placeholder="e.g. 8"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max Age</label>
              <Input
                type="number"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                placeholder="e.g. 11"
              />
            </div>
          </div>
          
          <Button onClick={handleAddAgeGroup} className="w-full">
            Add Age Group
          </Button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {ageGroups.map((group) => (
              <Card key={group.id}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    {group.name}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-destructive hover:text-destructive/90"
                      onClick={() => handleRemoveAgeGroup(group.id)}
                    >
                      Remove
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm">Ages {group.minAge} to {group.maxAge}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="weight" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Class Name</label>
              <Input
                value={weightClassName}
                onChange={(e) => setWeightClassName(e.target.value)}
                placeholder="e.g. Lightweight"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Min Weight (kg)</label>
              <Input
                type="number"
                step="0.1"
                value={minWeight}
                onChange={(e) => setMinWeight(e.target.value)}
                placeholder="e.g. 30.0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max Weight (kg)</label>
              <Input
                type="number"
                step="0.1"
                value={maxWeight}
                onChange={(e) => setMaxWeight(e.target.value)}
                placeholder="e.g. 40.0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sex</label>
              <div className="flex space-x-2 mt-2">
                <Button
                  type="button"
                  variant={sex === 'M' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setSex('M')}
                >
                  Male
                </Button>
                <Button
                  type="button"
                  variant={sex === 'F' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => setSex('F')}
                >
                  Female
                </Button>
              </div>
            </div>
          </div>
          
          <Button onClick={handleAddWeightClass} className="w-full">
            Add Weight Class
          </Button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {weightClasses.map((weightClass) => (
              <Card key={weightClass.id}>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    {weightClass.name} ({weightClass.sex === 'M' ? 'Male' : 'Female'})
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-destructive hover:text-destructive/90"
                      onClick={() => handleRemoveWeightClass(weightClass.id)}
                    >
                      Remove
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm">
                    {weightClass.minWeight} kg to {weightClass.maxWeight} kg
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button 
          onClick={onGroupingComplete} 
          disabled={ageGroups.length === 0 || weightClasses.length === 0}
          className="w-full"
        >
          Continue to Grouping
        </Button>
      </div>
    </div>
  );
};

export default GroupSettings;
