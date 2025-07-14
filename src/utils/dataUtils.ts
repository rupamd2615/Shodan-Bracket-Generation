
import { v4 as uuidv4 } from 'uuid';
import { Participant, AgeGroup, WeightClass, Group, Match, Bracket } from '@/types';

export const parseParticipantsFromCSV = (csvString: string): Participant[] => {
  // Skip header row and split by line
  const lines = csvString.trim().split('\n').slice(1);
  
  return lines.map(line => {
    const [name, age, sex, weight, category] = line.split(',').map(item => item.trim());
    
    return {
      id: uuidv4(),
      name,
      age: parseInt(age, 10),
      sex: sex as 'M' | 'F',
      weight: parseFloat(weight),
      category: category as 'Kata' | 'Kumite'
    };
  });
};

export const groupParticipants = (
  participants: Participant[],
  ageGroups: AgeGroup[],
  weightClasses: WeightClass[]
): Group[] => {
  const groups: Group[] = [];
  
  // Group Kata participants by age and sex
  const kataParticipants = participants.filter(p => p.category === 'Kata');
  
  ageGroups.forEach(ageGroup => {
    // Male Kata
    const maleKata = kataParticipants.filter(p => 
      p.sex === 'M' && 
      p.age >= ageGroup.minAge && 
      p.age <= ageGroup.maxAge
    );
    
    if (maleKata.length > 0) {
      groups.push({
        id: uuidv4(),
        name: `${ageGroup.name} Male Kata`,
        participants: maleKata,
        type: 'Kata',
        ageGroup
      });
    }
    
    // Female Kata
    const femaleKata = kataParticipants.filter(p => 
      p.sex === 'F' && 
      p.age >= ageGroup.minAge && 
      p.age <= ageGroup.maxAge
    );
    
    if (femaleKata.length > 0) {
      groups.push({
        id: uuidv4(),
        name: `${ageGroup.name} Female Kata`,
        participants: femaleKata,
        type: 'Kata',
        ageGroup
      });
    }
  });
  
  // Group Kumite participants by age, sex, and weight
  const kumiteParticipants = participants.filter(p => p.category === 'Kumite');
  
  ageGroups.forEach(ageGroup => {
    weightClasses.forEach(weightClass => {
      const kumiteInClass = kumiteParticipants.filter(p => 
        p.sex === weightClass.sex && 
        p.age >= ageGroup.minAge && 
        p.age <= ageGroup.maxAge &&
        p.weight >= weightClass.minWeight &&
        p.weight <= weightClass.maxWeight
      );
      
      if (kumiteInClass.length > 0) {
        groups.push({
          id: uuidv4(),
          name: `${ageGroup.name} ${weightClass.sex === 'M' ? 'Male' : 'Female'} Kumite ${weightClass.name}`,
          participants: kumiteInClass,
          type: 'Kumite',
          ageGroup,
          weightClass
        });
      }
    });
  });
  
  return groups;
};

export const generateKumiteBracket = (group: Group): Bracket => {
  // Create a shallow copy of participants array to avoid modifying the original
  const participants = [...group.participants];
  
  // Shuffle participants for random seeding
  for (let i = participants.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [participants[i], participants[j]] = [participants[j], participants[i]];
  }
  
  // Calculate number of rounds needed
  const numParticipants = participants.length;
  const numRounds = Math.ceil(Math.log2(numParticipants));
  const totalMatches = Math.pow(2, numRounds) - 1;
  
  // Create empty matches
  const matches: Match[] = [];
  
  // First, create all match objects
  for (let round = 1; round <= numRounds; round++) {
    const matchesInRound = Math.pow(2, numRounds - round);
    
    for (let position = 1; position <= matchesInRound; position++) {
      const match: Match = {
        id: uuidv4(),
        round,
        position,
      };
      
      // If not the final round, set the next match
      if (round < numRounds) {
        match.nextMatchId = `${round + 1}-${Math.ceil(position / 2)}`;
      }
      
      matches.push(match);
    }
  }
  
  // Assign participants to first-round matches
  const firstRoundMatches = matches.filter(m => m.round === 1);
  
  for (let i = 0; i < firstRoundMatches.length; i++) {
    const match = firstRoundMatches[i];
    match.participant1 = participants[i * 2] || undefined;
    match.participant2 = participants[i * 2 + 1] || undefined;
    
    // If there's only one participant, they automatically advance
    if (match.participant1 && !match.participant2) {
      match.winner = match.participant1;
      
      // Find the next match and add the winner
      const nextMatch = matches.find(m => m.round === 2 && m.position === Math.ceil(match.position / 2));
      if (nextMatch) {
        if (!nextMatch.participant1) {
          nextMatch.participant1 = match.winner;
        } else {
          nextMatch.participant2 = match.winner;
        }
      }
    }
  }
  
  return {
    id: uuidv4(),
    groupId: group.id,
    matches
  };
};

export const downloadPDF = (content: string, filename: string) => {
  const link = document.createElement('a');
  link.href = content;
  link.download = filename;
  link.click();
};
