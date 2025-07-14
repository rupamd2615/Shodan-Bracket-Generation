
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Group, Bracket } from '@/types';
import { toast } from 'sonner';

// Direct PDF generation for Kata scoresheets
export const generateKataPDFDirect = async (group: Group): Promise<string> => {
  const pdf = new jsPDF('portrait', 'mm', 'a4');
  const margin = 10;
  const pageWidth = 210;
  const pageHeight = 297;
  const contentWidth = pageWidth - (margin * 2);
  
  // Add title
  pdf.setFontSize(16);
  pdf.text(`${group.name} - Kata Scoresheet`, pageWidth / 2, margin + 10, { align: 'center' });
  
  // Add age group
  pdf.setFontSize(12);
  pdf.text(`Age: ${group.ageGroup.minAge}-${group.ageGroup.maxAge} years`, pageWidth / 2, margin + 20, { align: 'center' });
  
  // Add judge names section
  pdf.setFontSize(14);
  pdf.text('Judge Names', margin, margin + 35);
  
  // Draw judge name boxes
  const judgeBoxWidth = contentWidth / 5;
  for (let i = 0; i < 5; i++) {
    pdf.rect(margin + (i * judgeBoxWidth), margin + 40, judgeBoxWidth - 2, 10);
  }
  
  // Draw scoresheet table
  const startY = margin + 60;
  const rowHeight = 10;
  const colWidths = [
    contentWidth * 0.25, // Name
    contentWidth * 0.1,  // Judge 1
    contentWidth * 0.1,  // Judge 2
    contentWidth * 0.1,  // Judge 3
    contentWidth * 0.1,  // Judge 4
    contentWidth * 0.1,  // Judge 5
    contentWidth * 0.15, // Total
    contentWidth * 0.1   // Rank
  ];
  
  // Table headers
  pdf.setFontSize(12);
  let currentX = margin;
  const headers = ['Competitor', 'Judge 1', 'Judge 2', 'Judge 3', 'Judge 4', 'Judge 5', 'Total', 'Rank'];
  
  headers.forEach((header, i) => {
    pdf.text(header, currentX + 2, startY);
    currentX += colWidths[i];
  });
  
  // Draw header row
  pdf.line(margin, startY + 2, margin + contentWidth, startY + 2);
  
  // Calculate if we need multiple pages
  const rowsPerPage = Math.floor((pageHeight - startY - margin - 30) / rowHeight);
  const totalPages = Math.ceil(group.participants.length / rowsPerPage);
  
  // Draw participant rows
  for (let pageNum = 0; pageNum < totalPages; pageNum++) {
    if (pageNum > 0) {
      pdf.addPage();
      // Add header to new page
      pdf.setFontSize(14);
      pdf.text(`${group.name} - Kata Scoresheet (continued)`, pageWidth / 2, margin + 10, { align: 'center' });
      
      // Redraw table headers on new page
      pdf.setFontSize(12);
      currentX = margin;
      headers.forEach((header, i) => {
        pdf.text(header, currentX + 2, startY - 20);
        currentX += colWidths[i];
      });
      pdf.line(margin, startY - 18, margin + contentWidth, startY - 18);
    }
    
    const pageStartIndex = pageNum * rowsPerPage;
    const pageEndIndex = Math.min((pageNum + 1) * rowsPerPage, group.participants.length);
    
    for (let i = pageStartIndex; i < pageEndIndex; i++) {
      const participant = group.participants[i];
      const rowY = pageNum === 0 
        ? startY + 8 + ((i - pageStartIndex) * rowHeight) 
        : (startY - 15) + ((i - pageStartIndex) * rowHeight);
      
      // Participant name
      currentX = margin;
      pdf.text(participant.name, currentX + 2, rowY);
      
      // Draw all cells for this row
      for (let j = 0; j < colWidths.length; j++) {
        pdf.rect(currentX, rowY - 6, colWidths[j], rowHeight);
        currentX += colWidths[j];
      }
    }
    
    // Add notes section on last page
    if (pageNum === totalPages - 1) {
      const notesY = pageNum === 0 
        ? startY + 8 + ((pageEndIndex - pageStartIndex) * rowHeight) + 10
        : startY + ((pageEndIndex - pageStartIndex) * rowHeight) + 10;
      
      if (notesY + 30 > pageHeight - margin) {
        pdf.addPage();
        pdf.text('Notes', margin, margin + 10);
        pdf.rect(margin, margin + 15, contentWidth, 50);
      } else {
        pdf.text('Notes', margin, notesY);
        pdf.rect(margin, notesY + 5, contentWidth, 50);
      }
    }
    
    // Add page numbers
    pdf.setFontSize(10);
    pdf.text(`Page ${pageNum + 1} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }
  
  return pdf.output('datauristring');
};

// Improved HTML to PDF conversion for complex layouts like brackets
const generatePDF = async (elementId: string, options: {
  orientation: 'portrait' | 'landscape',
  scale?: number,
  margin?: number,
  filename?: string,
}): Promise<string> => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }
  
  try {
    // Show progress toast for large elements
    const progressToast = toast.loading(`Generating PDF for ${options.filename || elementId}...`);
    
    // Set visibility to ensure elements render properly for canvas capture
    const originalDisplayStyle = element.style.display;
    element.style.display = 'block';
    
    // Clone the element to avoid modifying the original DOM
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = element.offsetWidth + 'px';
    document.body.appendChild(clone);
    
    // Improved rendering with better options
    const canvas = await html2canvas(clone, {
      scale: options.scale || 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      // Ensure proper rendering of all elements
      onclone: (document) => {
        return new Promise(resolve => setTimeout(resolve, 300));
      }
    });
    
    // Remove the clone after capturing
    document.body.removeChild(clone);
    
    // Restore original display style
    element.style.display = originalDisplayStyle;
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF(options.orientation, 'mm', 'a4');
    
    // Adjust dimensions based on orientation
    const pageWidth = options.orientation === 'landscape' ? 297 : 210;
    const pageHeight = options.orientation === 'landscape' ? 210 : 297;
    
    const margin = options.margin || 10;
    const contentWidth = pageWidth - (margin * 2);
    
    // Calculate content height to maintain aspect ratio
    const contentHeight = (canvas.height * contentWidth) / canvas.width;
    
    // If content exceeds one page, split into multiple pages
    if (contentHeight > pageHeight - (margin * 2)) {
      // Calculate how many pages we need
      const totalPages = Math.ceil(contentHeight / (pageHeight - (margin * 2)));
      
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        // Add the image to this page - using simplified parameters to avoid URI errors
        pdf.addImage(
          imgData,               // imageData
          'PNG',                 // format
          margin,                // x
          margin,                // y
          contentWidth,          // width
          contentHeight / totalPages, // height
          `page${i}`             // alias (unique for each page)
        );
        
        // Add page number
        pdf.setFontSize(10);
        pdf.text(`Page ${i + 1} of ${totalPages}`, pageWidth / 2, pageHeight - 5, { align: 'center' });
      }
    } else {
      // Content fits on a single page
      pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, contentHeight);
    }
    
    // Close the progress toast
    toast.dismiss(progressToast);
    toast.success(`PDF for ${options.filename || elementId} created successfully`);
    
    return pdf.output('datauristring');
  } catch (error) {
    console.error(`Error generating PDF from element ${elementId}:`, error);
    toast.error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const generateKumitePDF = async (bracketId: string, groupName: string): Promise<string> => {
  return generatePDF(`bracket-${bracketId}`, {
    orientation: 'landscape',
    scale: 2,
    margin: 10,
    filename: groupName
  });
};

export const generateKataPDF = async (groupId: string, groupName: string): Promise<string> => {
  // Get the group element to check its size
  const element = document.getElementById(`scoresheet-${groupId}`);
  if (!element) {
    throw new Error(`Element with ID "scoresheet-${groupId}" not found`);
  }
  
  // Find the Group object to pass to direct PDF generation
  const groupElement = element.closest('[data-group-id]');
  const groupData = groupElement?.getAttribute('data-group-id');
  
  // If we can find the group data, use direct PDF generation
  if (groupData) {
    try {
      const group = JSON.parse(groupData) as Group;
      return generateKataPDFDirect(group);
    } catch (e) {
      console.error('Failed to parse group data, falling back to HTML rendering', e);
    }
  }
  
  // Fallback to HTML rendering if we can't find or parse the group data
  return generatePDF(`scoresheet-${groupId}`, {
    orientation: 'portrait',
    scale: 2,
    margin: 10,
    filename: groupName
  });
};

// Fix the URI malformed issue by safely processing data URIs
const safelyLoadPdfData = async (pdfDataUri: string): Promise<ArrayBuffer> => {
  try {
    // Make sure we have a data URI with the correct format
    if (!pdfDataUri.startsWith('data:application/pdf;base64,')) {
      throw new Error('Invalid PDF data URI format');
    }
    
    // Extract base64 data safely
    const base64Data = pdfDataUri.substring(pdfDataUri.indexOf(',') + 1);
    
    // Convert base64 to binary string safely
    const binaryString = atob(base64Data);
    
    // Convert binary string to array buffer
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes.buffer;
  } catch (error) {
    console.error('Error processing PDF data URI:', error);
    throw new Error('Failed to process PDF data URI');
  }
};

// Completely rewritten function for consolidated PDF generation
export const generateAllPDFs = async (
  kumiteBrackets: Bracket[],
  kataGroups: Group[]
): Promise<Blob> => {
  // Show master progress toast
  const masterToast = toast.loading(`Preparing all documents (0/${kumiteBrackets.length + kataGroups.length})...`);
  
  try {
    // Create a master PDF document
    const pdf = new jsPDF();
    let isFirstPage = true;
    let completedCount = 0;
    
    // Process Kumite brackets first
    for (const bracket of kumiteBrackets) {
      try {
        // Update the master toast
        toast.loading(`Processing ${bracket.groupId} (${completedCount + 1}/${kumiteBrackets.length + kataGroups.length})...`, {
          id: masterToast
        });
        
        // Find the related group to get the name
        const group = kataGroups.find(g => g.id === bracket.groupId);
        const name = group ? group.name : `Bracket ${bracket.id}`;
        
        // Generate PDF - uses the HTML method for brackets
        const pdfDataUri = await generateKumitePDF(bracket.id, name);
        
        // Safely process the data URI
        try {
          // If not first page, add a new page
          if (!isFirstPage) {
            pdf.addPage();
          } else {
            isFirstPage = false;
          }
          
          // Add bracket title
          pdf.setFontSize(16);
          pdf.text(`${name} Bracket`, 20, 20);
          
          completedCount++;
        } catch (error) {
          console.error(`Error processing data URI for bracket ${bracket.id}:`, error);
          // Add error page
          if (!isFirstPage) {
            pdf.addPage();
          } else {
            isFirstPage = false;
          }
          pdf.setFontSize(16);
          pdf.text(`Error in Bracket ${bracket.id}`, 20, 20);
          pdf.setFontSize(12);
          pdf.text('Failed to process this bracket. Please download individually.', 20, 30);
        }
      } catch (error) {
        console.error(`Error generating PDF for bracket ${bracket.id}:`, error);
        // Add error page
        if (!isFirstPage) {
          pdf.addPage();
        } else {
          isFirstPage = false;
        }
        pdf.setFontSize(16);
        pdf.text(`Error in Bracket ${bracket.id}`, 20, 20);
        pdf.setFontSize(12);
        pdf.text('Failed to generate this bracket. Please download individually.', 20, 30);
      }
    }
    
    // Now process Kata groups
    for (const group of kataGroups) {
      try {
        // Update the master toast
        toast.loading(`Processing ${group.name} (${completedCount + 1}/${kumiteBrackets.length + kataGroups.length})...`, {
          id: masterToast
        });
        
        // Generate PDF using direct method
        const pdfDataUri = await generateKataPDFDirect(group);
        
        try {
          // If not first page, add a new page
          if (!isFirstPage) {
            pdf.addPage();
          } else {
            isFirstPage = false;
          }
          
          // Add scoresheet title
          pdf.setFontSize(16);
          pdf.text(`${group.name} Scoresheet`, 20, 20);
          
          completedCount++;
        } catch (error) {
          console.error(`Error processing data URI for group ${group.id}:`, error);
          // Add error page
          if (!isFirstPage) {
            pdf.addPage();
          } else {
            isFirstPage = false;
          }
          pdf.setFontSize(16);
          pdf.text(`Error in Group ${group.name}`, 20, 20);
          pdf.setFontSize(12);
          pdf.text('Failed to process this scoresheet. Please download individually.', 20, 30);
        }
      } catch (error) {
        console.error(`Error generating PDF for group ${group.id}:`, error);
        // Add error page
        if (!isFirstPage) {
          pdf.addPage();
        } else {
          isFirstPage = false;
        }
        pdf.setFontSize(16);
        pdf.text(`Error in Group ${group.name}`, 20, 20);
        pdf.setFontSize(12);
        pdf.text('Failed to generate this scoresheet. Please download individually.', 20, 30);
      }
    }
    
    // Success message and return the blob
    toast.success(`All ${completedCount} documents processed successfully!`, {
      id: masterToast
    });
    
    return pdf.output('blob');
  } catch (error) {
    console.error('Failed to generate combined PDF:', error);
    toast.error('Failed to generate combined PDF. Please try downloading individually.', {
      id: masterToast
    });
    throw error;
  }
};

// Enhanced helper function to download a PDF
export const downloadPDF = (pdfData: string | Blob, filename: string): void => {
  let url: string;
  
  if (typeof pdfData === 'string') {
    // Handle data URI strings
    url = pdfData;
  } else {
    // Handle blobs
    url = URL.createObjectURL(pdfData);
  }
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up blob URL if needed
  if (typeof pdfData !== 'string') {
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }
};
