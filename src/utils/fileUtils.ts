
import { Participant } from '@/types';
import { parseParticipantsFromCSV } from './dataUtils';
import * as XLSX from 'xlsx';

export const readCSVFile = (file: File): Promise<Participant[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvString = event.target?.result as string;
        const participants = parseParticipantsFromCSV(csvString);
        resolve(participants);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

export const readExcelFile = (file: File): Promise<Participant[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Assume first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        // Map to our Participant type with case-insensitive field matching
        const participants: Participant[] = data.map((row: any) => {
          // Function to find case-insensitive field
          const findField = (possibleNames: string[]): string | undefined => {
            return Object.keys(row).find(key => 
              possibleNames.some(name => key.toLowerCase() === name.toLowerCase())
            );
          };
          
          // Get field names (handling different possible column names)
          const nameField = findField(['Name', 'name', 'NAME', 'Participant', 'participant']);
          const ageField = findField(['Age', 'age', 'AGE']);
          const sexField = findField(['Sex', 'sex', 'SEX', 'Gender', 'gender']);
          const weightField = findField(['Weight', 'weight', 'WEIGHT']);
          const categoryField = findField(['Category', 'category', 'CATEGORY', 'Event', 'event']);
          
          // Get values using found field names
          const name = nameField ? String(row[nameField] || '') : '';
          const age = ageField ? parseInt(String(row[ageField]), 10) || 0 : 0;
          const sexValue = sexField ? String(row[sexField] || '').toUpperCase() : '';
          const sex = sexValue === 'M' || sexValue === 'MALE' ? 'M' : 
                     sexValue === 'F' || sexValue === 'FEMALE' ? 'F' : 'M';
          const weight = weightField ? parseFloat(String(row[weightField])) || 0 : 0;
          
          let category = 'Kata';
          if (categoryField) {
            const categoryValue = String(row[categoryField] || '').toLowerCase();
            category = categoryValue.includes('kumite') ? 'Kumite' : 
                      categoryValue.includes('kata') ? 'Kata' : 'Kata';
          }
          
          return {
            id: crypto.randomUUID(),
            name,
            age,
            sex: sex as 'M' | 'F',
            weight,
            category: category as 'Kata' | 'Kumite'
          };
        });
        
        resolve(participants);
      } catch (error) {
        console.error('Excel parsing error:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
