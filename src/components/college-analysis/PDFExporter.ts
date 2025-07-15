
import jsPDF from 'jspdf';
import { CollegeMatch } from "./FormDataTypes";

export const exportToPDF = async (
  studentName: string,
  studentAggregate: number,
  filteredResults: CollegeMatch[]
) => {
  const doc = new jsPDF();
  
  // Enhanced header design
  try {
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.src = '/lovable-uploads/0b03c0c9-e954-4cec-82c9-48e194652cf3.png';
    
    logoImg.onload = () => {
      // Header background
      doc.setFillColor(247, 68, 78); // Primary color
      doc.rect(0, 0, 210, 35, 'F');
      
      // Logo
      doc.addImage(logoImg, 'PNG', 20, 8, 25, 12);
      
      // Header text in white
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('FindMyClg - DSE College Analysis Report', 55, 18);
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text('Your Personalized College Recommendation', 55, 28);
      
      // Reset text color to black
      doc.setTextColor(0, 0, 0);
      
      // Student information section
      doc.setFillColor(247, 248, 243); // Light background
      doc.rect(10, 45, 190, 35, 'F');
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Student Information', 20, 55);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text(`Name: ${studentName}`, 20, 65);
      doc.text(`Diploma Aggregate: ${studentAggregate}%`, 20, 72);
      
      // Results summary
      const eligibleCount = filteredResults.filter(c => c.eligible).length;
      doc.text(`Total Colleges Found: ${filteredResults.length}`, 110, 65);
      doc.text(`Eligible Colleges: ${eligibleCount}`, 110, 72);
      
      // Success rate indicator
      const successRate = Math.round((eligibleCount / filteredResults.length) * 100) || 0;
      doc.setTextColor(247, 68, 78);
      doc.setFont(undefined, 'bold');
      doc.text(`Success Rate: ${successRate}%`, 20, 79);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      
      // Table section
      let yPosition = 95;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('College Results', 20, yPosition);
      yPosition += 10;
      
      // Enhanced table headers with background
      doc.setFillColor(120, 188, 196); // Secondary color
      doc.rect(15, yPosition - 3, 180, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text('Status', 18, yPosition + 2);
      doc.text('College Name', 35, yPosition + 2);
      doc.text('City', 95, yPosition + 2);
      doc.text('Branch', 115, yPosition + 2);
      doc.text('CAP-I', 150, yPosition + 2);
      doc.text('CAP-II', 165, yPosition + 2);
      doc.text('CAP-III', 180, yPosition + 2);
      
      yPosition += 12;
      doc.setTextColor(0, 0, 0);
      
      // Table content with alternating row colors
      doc.setFontSize(8);
      filteredResults.forEach((college, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
          
          // Repeat header on new page
          doc.setFillColor(120, 188, 196);
          doc.rect(15, yPosition - 3, 180, 8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9);
          doc.text('Status', 18, yPosition + 2);
          doc.text('College Name', 35, yPosition + 2);
          doc.text('City', 95, yPosition + 2);
          doc.text('Branch', 115, yPosition + 2);
          doc.text('CAP-I', 150, yPosition + 2);
          doc.text('CAP-II', 165, yPosition + 2);
          doc.text('CAP-III', 180, yPosition + 2);
          yPosition += 12;
          doc.setTextColor(0, 0, 0);
        }
        
        // Alternating row colors
        if (index % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(15, yPosition - 2, 180, 6, 'F');
        }
        
        // Status with color coding
        const status = college.eligible ? '✓' : '✗';
        doc.setTextColor(college.eligible ? 34 : 239, college.eligible ? 197 : 68, college.eligible ? 94 : 68);
        doc.setFont(undefined, 'bold');
        doc.text(status, 18, yPosition + 2);
        
        // Reset to black for other text
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'normal');
        
        // College name (better truncation for visibility)
        const collegeName = college.collegeName.length > 30 ? 
          college.collegeName.substring(0, 30) + '...' : college.collegeName;
        doc.text(collegeName, 35, yPosition + 2);
        
        doc.text(college.city || 'N/A', 95, yPosition + 2);
        
        // Branch name (better truncation for visibility)
        const branchName = college.branch.length > 15 ? 
          college.branch.substring(0, 15) + '...' : college.branch;
        doc.text(branchName, 115, yPosition + 2);
        
        // Cutoffs with color coding
        const greenColor = [34, 197, 94];
        const grayColor = [107, 114, 128];
        
        doc.setTextColor(college.cap1Cutoff && college.cap1Cutoff <= studentAggregate ? greenColor[0] : grayColor[0], 
                         college.cap1Cutoff && college.cap1Cutoff <= studentAggregate ? greenColor[1] : grayColor[1], 
                         college.cap1Cutoff && college.cap1Cutoff <= studentAggregate ? greenColor[2] : grayColor[2]);
        doc.text(college.cap1Cutoff ? `${college.cap1Cutoff}%` : '-', 150, yPosition + 2);
        
        doc.setTextColor(college.cap2Cutoff && college.cap2Cutoff <= studentAggregate ? greenColor[0] : grayColor[0], 
                         college.cap2Cutoff && college.cap2Cutoff <= studentAggregate ? greenColor[1] : grayColor[1], 
                         college.cap2Cutoff && college.cap2Cutoff <= studentAggregate ? greenColor[2] : grayColor[2]);
        doc.text(college.cap2Cutoff ? `${college.cap2Cutoff}%` : '-', 165, yPosition + 2);
        
        doc.setTextColor(college.cap3Cutoff && college.cap3Cutoff <= studentAggregate ? greenColor[0] : grayColor[0], 
                         college.cap3Cutoff && college.cap3Cutoff <= studentAggregate ? greenColor[1] : grayColor[1], 
                         college.cap3Cutoff && college.cap3Cutoff <= studentAggregate ? greenColor[2] : grayColor[2]);
        doc.text(college.cap3Cutoff ? `${college.cap3Cutoff}%` : '-', 180, yPosition + 2);
        
        doc.setTextColor(0, 0, 0); // Reset color
        yPosition += 6;
      });
      
      // Enhanced footer with social links
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer background
        doc.setFillColor(247, 248, 243);
        doc.rect(0, 280, 210, 17, 'F');
        
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text('Generated by FindMyClg - Your DSE Admission Partner', 20, 287);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 292);
        doc.text(`Page ${i} of ${pageCount}`, 170, 287);
        
        // Add website URL
        doc.setTextColor(247, 68, 78);
        doc.text('findmyclg.com', 170, 292);
        
        // Add social links with clickable functionality
        doc.setTextColor(107, 114, 128);
        doc.text('Follow us:', 20, 297);
        doc.setTextColor(247, 68, 78);
        
        // Facebook link
        doc.textWithLink('Facebook: fb.com/findmyclg', 45, 297, { url: 'https://www.facebook.com/findmyclg' });
        
        // Instagram link  
        doc.textWithLink('Instagram: @findmyclg', 120, 297, { url: 'https://www.instagram.com/findmyclg' });
        
        // LinkedIn link
        doc.textWithLink('LinkedIn: linkedin.com/company/findmyclg', 20, 302, { url: 'https://www.linkedin.com/company/findmyclg' });
        
        // Add more social media icons and links
        doc.setTextColor(107, 114, 128);
        doc.text('More:', 20, 307);
        doc.setTextColor(247, 68, 78);
        doc.textWithLink('YouTube: youtube.com/@findmyclg', 45, 307, { url: 'https://www.youtube.com/@findmyclg' });
        doc.textWithLink('Twitter: twitter.com/findmyclg', 120, 307, { url: 'https://www.twitter.com/findmyclg' });
      }
      
      // Add legend page if there are results
      if (filteredResults.length > 0) {
        doc.addPage();
        
        // Legend header
        doc.setFillColor(247, 68, 78);
        doc.rect(0, 0, 210, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Legend & Important Notes', 20, 15);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Status Indicators:', 20, 40);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(34, 197, 94);
        doc.text('✓ Eligible - Your aggregate meets the cutoff requirements', 20, 50);
        doc.setTextColor(239, 68, 68);
        doc.text('✗ Not Eligible - Your aggregate is below the required cutoff', 20, 60);
        
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('CAP Round Information:', 20, 80);
        
        doc.setFont(undefined, 'normal');
        doc.text('• CAP-I: First round of centralized admission process', 20, 90);
        doc.text('• CAP-II: Second round (if seats available)', 20, 100);
        doc.text('• CAP-III: Third and final round (if seats available)', 20, 110);
        
        doc.setFont(undefined, 'bold');
        doc.text('Important Disclaimer:', 20, 130);
        
        doc.setFont(undefined, 'normal');
        doc.text('• Cutoff data is based on previous year (2024-25) records', 20, 140);
        doc.text('• Actual cutoffs may vary each year based on various factors', 20, 150);
        doc.text('• Always verify with official DTE Maharashtra website', 20, 160);
        doc.text('• This is for guidance purposes only', 20, 170);
      }
      
      const fileName = `${studentName.replace(/\s+/g, '_')}_DSE_College_Results_${new Date().getFullYear()}.pdf`;
      doc.save(fileName);
    };
    
    logoImg.onerror = () => {
      // Fallback without logo
      doc.setFillColor(247, 68, 78);
      doc.rect(0, 0, 210, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('FindMyClg - DSE College Analysis Report', 20, 18);
      
      // Continue with the rest of the PDF generation...
      const fileName = `${studentName.replace(/\s+/g, '_')}_DSE_College_Results_${new Date().getFullYear()}.pdf`;
      doc.save(fileName);
    };
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Simple fallback PDF
    doc.setFontSize(16);
    doc.text('FindMyClg - College Results', 20, 20);
    doc.setFontSize(12);
    doc.text(`Student: ${studentName}`, 20, 35);
    doc.text(`Aggregate: ${studentAggregate}%`, 20, 45);
    doc.text(`Results: ${filteredResults.length} colleges found`, 20, 55);
    
    const fileName = `${studentName.replace(/\s+/g, '_')}_College_Results.pdf`;
    doc.save(fileName);
  }
};
