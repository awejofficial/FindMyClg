import jsPDF from 'jspdf';

interface StrategyMatch {
  collegeName: string;
  city: string;
  branch: string;
  category: string;
  collegeType: string;
  cap1Cutoff: number | null;
  cap2Cutoff: number | null;
  cap3Cutoff: number | null;
  eligible: boolean;
  tag: 'best-fit' | 'safe' | 'low-quality' | 'dream';
  qualityRatio: number;
  cutoffDifference: number;
  bestCutoff: number;
}

export const exportSmartStrategyToPDF = async (
  studentName: string,
  studentAggregate: number,
  strategyMatches: StrategyMatch[]
): Promise<void> => {
  try {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header with branding
    doc.setFillColor(0, 44, 62); // #002C3E
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    // Logo placeholder and title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FindMyClg', 15, 15);
    
    doc.setFontSize(16);
    doc.text('Smart DSE Strategy Report - 2024', 15, 25);
    
    // User info in header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Student: ${studentName} | Your Score: ${studentAggregate}%`, pageWidth - 150, 15);
    doc.text(`Export Date: ${new Date().toLocaleDateString()}`, pageWidth - 150, 25);

    yPosition = 50;

    // Strategy explanation box
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(247, 248, 243); // Light background
    doc.rect(15, yPosition, pageWidth - 30, 30, 'F');
    doc.rect(15, yPosition, pageWidth - 30, 30, 'S');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Strategy Categories:', 20, yPosition + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('🎯 Best Fit → Your score matches the cutoff (±2%)', 20, yPosition + 15);
    doc.text('🟢 Safe → 3–7% above cutoff', 95, yPosition + 15);
    doc.text('⚠️ Low Quality → 10%+ above cutoff (Ratio ≥ 1.3)', 160, yPosition + 15);
    doc.text('🔴 Dream → Cutoff is above your marks', 20, yPosition + 22);

    yPosition += 45;

    // Group matches by strategy
    const groupedMatches = {
      'best-fit': strategyMatches.filter(m => m.tag === 'best-fit'),
      'safe': strategyMatches.filter(m => m.tag === 'safe'),
      'low-quality': strategyMatches.filter(m => m.tag === 'low-quality'),
      'dream': strategyMatches.filter(m => m.tag === 'dream')
    };

    const tagConfigs = {
      'best-fit': { title: '🎯 Best Fit', color: [34, 197, 94] },
      'safe': { title: '🟢 Safe Option', color: [59, 130, 246] },
      'low-quality': { title: '⚠️ Low Quality Match', color: [234, 179, 8] },
      'dream': { title: '🔴 Dream Option', color: [239, 68, 68] }
    };

    for (const [tag, matches] of Object.entries(groupedMatches)) {
      if (matches.length === 0) continue;

      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage('landscape');
        yPosition = 20;
      }

      const config = tagConfigs[tag as keyof typeof tagConfigs];
      
      // Category header
      doc.setFillColor(config.color[0], config.color[1], config.color[2]);
      doc.rect(15, yPosition, pageWidth - 30, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`${config.title} (${matches.length} colleges)`, 20, yPosition + 8);

      yPosition += 18;

      // Table headers
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(249, 250, 251);
      doc.rect(15, yPosition, pageWidth - 30, 10, 'F');
      doc.rect(15, yPosition, pageWidth - 30, 10, 'S');
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      const headers = ['College Name', 'Branch', 'City', 'Type', 'Cutoff %', 'Your %', 'Ratio', 'Warning'];
      const colWidths = [60, 50, 30, 25, 20, 20, 20, 40];
      let xPos = 20;
      
      headers.forEach((header, i) => {
        doc.text(header, xPos, yPosition + 7);
        xPos += colWidths[i];
      });

      yPosition += 12;

      // Table rows
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      
      matches.forEach((match, index) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage('landscape');
          yPosition = 20;
        }

        // Alternating row colors
        if (index % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(15, yPosition, pageWidth - 30, 8, 'F');
        }

        xPos = 20;
        const rowData = [
          match.collegeName.length > 25 ? match.collegeName.substring(0, 25) + '...' : match.collegeName,
          match.branch.length > 20 ? match.branch.substring(0, 20) + '...' : match.branch,
          match.city,
          match.collegeType,
          `${match.bestCutoff}%`,
          `${studentAggregate}%`,
          match.qualityRatio.toFixed(2),
          (match.tag === 'low-quality' && match.qualityRatio >= 1.3) ? 'Too Low' : ''
        ];

        rowData.forEach((data, i) => {
          doc.text(data, xPos, yPosition + 6);
          xPos += colWidths[i];
        });

        yPosition += 10;
      });

      yPosition += 8;
    }

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generated by FindMyClg Smart Strategy Engine', 15, pageHeight - 10);
      doc.text('Contact: Awej (LinkedIn: linkedin.com/in/awej)', 15, pageHeight - 5);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 10);
    }

    // Save the PDF
    const fileName = `FindMyClg_Smart_Strategy_${studentName.replace(/\s+/g, '_')}_2024.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error('Error generating Smart Strategy PDF:', error);
    
    // Fallback simple PDF
    const doc = new jsPDF();
    doc.text('Smart Strategy Report', 20, 20);
    doc.text(`Student: ${studentName}`, 20, 30);
    doc.text(`Aggregate: ${studentAggregate}%`, 20, 40);
    doc.text(`Total Colleges: ${strategyMatches.length}`, 20, 50);
    doc.save(`Smart_Strategy_${studentName.replace(/\s+/g, '_')}.pdf`);
  }
};