import { PathLocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SafetyInspection } from 'src/app/features/SafetyCompilance/Entities/safety-inspection';
import { SafetyInspectionService } from 'src/app/features/SafetyCompilance/Services/safety-inspection.service';

@Component({
  selector: 'app-details-inspection',
  templateUrl: './details-inspection.component.html',
  styleUrls: ['./details-inspection.component.css']
})
export class DetailsInspectionComponent implements OnInit{
 
 
 
  id!:number

  listdetails:SafetyInspection = new SafetyInspection 

   constructor(private act:ActivatedRoute, private safetyService:SafetyInspectionService, private router: Router ){}
   
  ngOnInit(): void {
    this.LoadSafetyInspection()
  }
  
  LoadSafetyInspection() {
    this.id= this.act.snapshot.params['id']
      this.safetyService.getSafetyInspectionById(this.id).subscribe((data)=> {
        this.listdetails=data
      })
  }




  generatePDF(): void {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm'
    });
    
    // Logo configuration
    const logoUrl = "../../assets/img/logo.png";
    const logoWidth = 10;
    const logoHeight = 10;
    const logoX = doc.internal.pageSize.width - logoWidth - 15; // Position from right
    const logoY = 10; // Position from top
    
    let logoAdded = false;

    // Prepare data
    const inspection = this.listdetails;

    // Add header with more professional spacing
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Food Safety Inspection Report', 105, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Reference #: ' + (inspection.inspectionID || '103896508'), 105, 32, { align: 'center' });
    doc.setFont('helvetica', 'normal');

    // Add generated date with better positioning
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 37, { align: 'center' });

    // Enhanced table styling
    const tableData = [
        ['Inspector Name', inspection.inspector_name],
        ['Inspection Date', this.formatDate(inspection.inspection_date)],
        ['Premises Name', inspection.premises_name],
        ['Address', inspection.address],
        ['Inspection Type', inspection.inspectionType],
        ['Status', inspection.inspectionStatus],
        ['Crucial Infractions', inspection.crucial_infractions],
        ['Significant Infractions', inspection.significant_infractions],
        ['Minor Infractions', inspection.minor_infractions],
        ['Corrected During Inspection', inspection.corrected_during_inspection],
        ['Report Time', this.formatTime(inspection.report_time)],
        ['Description', inspection.description || 'N/A'],
        ['Reinspection Date', inspection.reinspectionDate ? this.formatDate(inspection.reinspectionDate) : 'N/A'],
        ['Out of Business', inspection.isOutOfBusiness ? 'Yes' : 'No'],
        ['Restaurant', inspection.restaurant ? inspection.restaurant.name : 'N/A']
    ];

    // Enhanced table configuration
    autoTable(doc, {
        body: tableData,
        startY: 45,
        theme: 'striped',
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'left'
        },
        bodyStyles: {
            fontSize: 8,  // Reduced from 9
            cellPadding: 4  // Reduced from 6
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        margin: { top: 45, right: 20, left: 20 },
        styles: {
            font: 'helvetica',
            valign: 'middle',
            overflow: 'linebreak',
            cellWidth: 'wrap',
            lineWidth: 0.1,
            minCellHeight: 8  // Added to reduce row height
        },
        columnStyles: {
            0: { 
                cellWidth: 60,  // Reduced from 70
                fontStyle: 'bold',
                fillColor: [250, 250, 250]
            },
            1: { 
                cellWidth: 'auto',
                fontStyle: 'normal'
            }
        },
        didDrawPage: (data) => {
            if (logoAdded) {
                doc.addImage(logoUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);
            }
        }
    });

    // Add signature and footer to first page
    doc.setPage(1);
    
    // Add signature area
    doc.setFontSize(10);
    const signatureY = doc.internal.pageSize.height - 40; // Increased space from bottom

    // Owner signature on the left
    doc.text('Owner Signature:', 15, signatureY);
    const ownerSignatureUrl = "../../assets/img/lemsiSIN.png";
    const signatureWidth = 50;
    const signatureHeight = 20;
    doc.addImage(ownerSignatureUrl, 'PNG', 50, signatureY - 15, signatureWidth, signatureHeight);

    // Inspector signature on the right
    doc.text('Inspector Signature:', doc.internal.pageSize.width / 2 + 15, signatureY);
    doc.line(doc.internal.pageSize.width / 2 + 50, signatureY + 2, doc.internal.pageSize.width / 2 + 100, signatureY + 2);

    // Date positioned below signatures
    doc.text(`Date: ${this.formatDate(new Date())}`, 15, signatureY + 15);

    // Footer with printed timestamp at bottom left
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
        `Printed on: ${new Date().toLocaleString()}`,
        15,
        doc.internal.pageSize.height - 10,
        { align: 'left' }
    );
    
    // Add page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.width - 15,
            doc.internal.pageSize.height - 10,
            { align: 'right' }
        );
    }

    // Add Appendix A on second page
doc.addPage();
doc.setFontSize(16);
doc.setTextColor(40);
// Center the title
doc.text('Appendix A: Important Information', doc.internal.pageSize.width / 2, 20, { align: 'center' });

// Set smaller font size for main text
doc.setFontSize(9);  // Reduced from 10 to 9 for main text

const appendixText = [
    'City of Tunisia Municipal Code, Chapter 545 requires eating and drinking establishments',
    '(i.e., every place where food items intended for human consumption are made for sale,',
    'offered for sale, stored or sold) to do the following:',
    '   •  Post the food safety inspection notice in an obvious place clearly visible to the public,',
    '      at or near the entrance of the establishment',
    '   •  Post the Toronto eating or drinking establishment license issued by the Toronto',
    '      Municipal Licensing and Standards Division next to the food safety inspection notice',
    '   •  Produce copies of the Toronto Public Health Food Safety Inspection Reports relating',
    '      to the currently posted food safety inspection notice, when requested by any person',
    '   •  Promptly notify the Toronto Municipal Licensing and Standards Division if there is a',
    '      change in the management or control of the establishment',
    '   •  Notify the Toronto Municipal Licensing and Standards Division of any change or',
    '      changes to the operation of the business that may result in "risk classification',
    '      changes," at least 30 days prior to the change.',
    '',
    'When a Public Health Inspector visits your food premises for an inspection, the inspector',
    'will use a Food Safety Inspection Report form to check whether your food premises meets',
    'the requirements detailed in the Food Premises Regulation.',
    '',
    'The new system divides infractions into three categories (minor, significant and crucial)',
    'depending on their potential risk to health. The results of an inspection (i.e. inspection',
    'status) will depend on the types of infractions that are noted during the inspection.',
    'Infraction(s) occur when a food premises does not comply with the requirements in the',
    'Food Premises Regulation.',
    '',
    'When the inspector has completed the inspection, your food premises will receive one of',
    'three food safety inspection notices:',
    '   •  a PASS (when no infractions or only minor infractions are observed)',
    '   •  a CONDITIONAL PASS (when significant and/or crucial infractions are observed)',
    '   •  a CLOSED (when crucial infractions result in an order to close your food premises)',
    '',
    'INSTRUCTIONS TO POST FOOD SAFETY INSPECTION NOTICE',
    'Under City of Toronto Municipal Code, Chapter 545, you are required to post and keep',
    'posted in a conspicuous place clearly visible to the members of the public, at or near',
    'the entrance of the above noted food premises, the most recent food safety inspection',
    'notice that has been issued to you by the Medical Officer of Health (or her / his',
    'designate). All notices will include the status from the previous inspection and indication',
    'of any enforcement action.',
    '',
    'Please be advised that failure to post the said sign will result in legal action against you',
    'under section 30-1(3) of the City of Toronto Municipal Code, Chapter 545. A conviction',
    'under this charge may result in a fine of up to $25,000 (for individuals), $50,000 (for',
    'corporations) and/or a closure order effective for up to two years.',
    '',
    'Inspection results (pass, conditional pass, closed) for each eating and drinking',
    'establishment will also be posted on the Toronto Public Health Dine Safe web site at',
    'www.toronto.ca/health.',
    '',
    'Glossary of Terms',
    'Hazard Analysis Critical Control Point (HACCP) Audit: In some types of food premise',
    'inspections, public health inspectors are required to periodically conduct HACCP audits.',
    'During this process the inspector will observe the preparation of one or more food items',
    'through critical control points to determine if the food is being prepared in a safe manner.',
    '',
    'Certified Food Handler (CFH): Every owner/operator of a food establishment must ensure',
    'that there is, at all times when the establishment is operating, at least one (1) Certified',
    'Food Handler (CFH) working in a supervisory capacity in each area of the premises where',
    'food is prepared, processed, served, packaged or stored.',
    '',
    'For more details please see contact information below:',
    'Tunisia Public Health',
    '(216) 25 301 941',
    'or on the web at http://localhost:4201'
];

let yPosition = 30;
appendixText.forEach(line => {
    if (yPosition > doc.internal.pageSize.height - 20) {
        doc.addPage();
        yPosition = 20;
    }
    // Center each line of text
    doc.text(line, doc.internal.pageSize.width / 2, yPosition, { align: 'center' });
    yPosition += 5;
});

    // Try to add logo (this should be done after all content is added)
    this.loadImage(logoUrl).then((imgData) => {
        logoAdded = true;
        // Add logo to all pages
        for (let i = 1; i <= doc.getNumberOfPages(); i++) {
            doc.setPage(i);
            doc.addImage(imgData, 'PNG', logoX, logoY, logoWidth, logoHeight);
        }
        // Save after logo is added
        doc.save(`Food_Safety_Inspection_${inspection.inspectionID || 'Unknown'}_${new Date().toISOString().slice(0, 10)}.pdf`);
    }).catch(() => {
        // If logo fails to load, just save without it
        doc.save(`Food_Safety_Inspection_${inspection.inspectionID || 'Unknown'}_${new Date().toISOString().slice(0, 10)}.pdf`);
    });
}

// Helper function to load image
private loadImage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            } else {
                reject();
            }
        };
        img.onerror = reject;
        img.src = url;
    });
}
// Helper function to format time
formatTime(time: string | Date): string {
    if (!time) return 'N/A';

    if (typeof time === 'string' && time.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
        const date = new Date(`1970-01-01T${time}`);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (time instanceof Date) {
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return 'N/A';
}

// New helper function to format dates
formatDate(date: string | Date): string {
    if (!date) return 'N/A';

    if (date instanceof Date) {
        return date.toLocaleDateString();
    }

    try {
        return new Date(date).toLocaleDateString();
    } catch (e) {
        return 'N/A';
    }
}


}
