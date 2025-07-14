
import { v4 as uuidv4 } from 'uuid';
import { Participant, AgeGroup, WeightClass } from '@/types';

export const generateSampleParticipants = (): Participant[] => {
  return [
    {
      id: uuidv4(),
      name: 'John Smith',
      age: 12,
      sex: 'M',
      weight: 45,
      category: 'Kumite'
    },
    {
      id: uuidv4(),
      name: 'Sarah Johnson',
      age: 13,
      sex: 'F',
      weight: 48,
      category: 'Kata'
    },
    {
      id: uuidv4(),
      name: 'Michael Chen',
      age: 11,
      sex: 'M',
      weight: 42,
      category: 'Kumite'
    },
    {
      id: uuidv4(),
      name: 'Emily Davis',
      age: 12,
      sex: 'F',
      weight: 46,
      category: 'Kumite'
    },
    {
      id: uuidv4(),
      name: 'David Lee',
      age: 14,
      sex: 'M',
      weight: 52,
      category: 'Kata'
    },
    {
      id: uuidv4(),
      name: 'Jessica Wu',
      age: 13,
      sex: 'F',
      weight: 49,
      category: 'Kata'
    },
    {
      id: uuidv4(),
      name: 'Daniel Martin',
      age: 15,
      sex: 'M',
      weight: 58,
      category: 'Kumite'
    },
    {
      id: uuidv4(),
      name: 'Michelle Wang',
      age: 14,
      sex: 'F',
      weight: 54,
      category: 'Kumite'
    },
    {
      id: uuidv4(),
      name: 'James Wilson',
      age: 11,
      sex: 'M',
      weight: 40,
      category: 'Kata'
    },
    {
      id: uuidv4(),
      name: 'Lisa Garcia',
      age: 12,
      sex: 'F',
      weight: 44,
      category: 'Kata'
    },
    {
      id: uuidv4(),
      name: 'Robert Taylor',
      age: 16,
      sex: 'M',
      weight: 65,
      category: 'Kumite'
    },
    {
      id: uuidv4(),
      name: 'Sophia Martinez',
      age: 15,
      sex: 'F',
      weight: 60,
      category: 'Kumite'
    },
    {
      id: uuidv4(),
      name: 'Kevin Brown',
      age: 17,
      sex: 'M',
      weight: 70,
      category: 'Kata'
    },
    {
      id: uuidv4(),
      name: 'Amanda Lopez',
      age: 16,
      sex: 'F',
      weight: 62,
      category: 'Kata'
    },
    {
      id: uuidv4(),
      name: 'Thomas Anderson',
      age: 18,
      sex: 'M',
      weight: 75,
      category: 'Kumite'
    },
    {
      id: uuidv4(),
      name: 'Olivia Thompson',
      age: 17,
      sex: 'F',
      weight: 65,
      category: 'Kumite'
    }
  ];
};

export const defaultAgeGroups: AgeGroup[] = [
  {
    id: uuidv4(),
    name: 'Children',
    minAge: 8,
    maxAge: 11
  },
  {
    id: uuidv4(),
    name: 'Youth',
    minAge: 12,
    maxAge: 14
  },
  {
    id: uuidv4(),
    name: 'Junior',
    minAge: 15,
    maxAge: 17
  },
  {
    id: uuidv4(),
    name: 'Senior',
    minAge: 18,
    maxAge: 34
  },
  {
    id: uuidv4(),
    name: 'Master',
    minAge: 35,
    maxAge: 100
  }
];

export const defaultWeightClasses: WeightClass[] = [
  {
    id: uuidv4(),
    name: 'Light',
    minWeight: 0,
    maxWeight: 45,
    sex: 'M'
  },
  {
    id: uuidv4(),
    name: 'Medium',
    minWeight: 45.1,
    maxWeight: 60,
    sex: 'M'
  },
  {
    id: uuidv4(),
    name: 'Heavy',
    minWeight: 60.1,
    maxWeight: 75,
    sex: 'M'
  },
  {
    id: uuidv4(),
    name: 'Super Heavy',
    minWeight: 75.1,
    maxWeight: 200,
    sex: 'M'
  },
  {
    id: uuidv4(),
    name: 'Light',
    minWeight: 0,
    maxWeight: 40,
    sex: 'F'
  },
  {
    id: uuidv4(),
    name: 'Medium',
    minWeight: 40.1,
    maxWeight: 55,
    sex: 'F'
  },
  {
    id: uuidv4(),
    name: 'Heavy',
    minWeight: 55.1,
    maxWeight: 70,
    sex: 'F'
  },
  {
    id: uuidv4(),
    name: 'Super Heavy',
    minWeight: 70.1,
    maxWeight: 200,
    sex: 'F'
  }
];
