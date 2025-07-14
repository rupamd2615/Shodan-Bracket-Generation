
export interface Participant {
  id: string;
  name: string;
  age: number;
  sex: 'M' | 'F';
  weight: number;
  category: 'Kata' | 'Kumite';
}

export interface AgeGroup {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
}

export interface WeightClass {
  id: string;
  name: string;
  minWeight: number;
  maxWeight: number;
  sex: 'M' | 'F';
}

export interface Group {
  id: string;
  name: string;
  participants: Participant[];
  type: 'Kata' | 'Kumite';
  ageGroup: AgeGroup;
  weightClass?: WeightClass;
}

export interface Match {
  id: string;
  round: number;
  position: number;
  participant1?: Participant;
  participant2?: Participant;
  winner?: Participant;
  nextMatchId?: string;
}

export interface Bracket {
  id: string;
  groupId: string;
  matches: Match[];
}

export interface KataScore {
  judgeId: string;
  participantId: string;
  score: number;
}

export interface KataRound {
  id: string;
  roundNumber: number;
  scores: KataScore[];
}

export interface KataEvent {
  id: string;
  groupId: string;
  rounds: KataRound[];
}
