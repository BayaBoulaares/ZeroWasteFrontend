import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Restaurant } from 'src/app/features/SafetyCompilance/Entities/restaurant';
import { RestaurantService } from 'src/app/features/SafetyCompilance/Services/restaurant.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.css']
})
export class RestaurantDetailsComponent implements OnInit{

  id!:number

  listdetails:Restaurant = new Restaurant

  constructor(private act:ActivatedRoute, private resdetservice:RestaurantService, private router: Router ){}
  
  ngOnInit(): void {
   this.loadRestaurant()
  }


    loadRestaurant():void{
      this.id= this.act.snapshot.params['id']
      this.resdetservice.getRestaurant(this.id).subscribe((data)=> {
        this.listdetails=data
      })
    }


    generatePDF(): void {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm'
      });
    
      // Add logo
      const img = new Image();
      img.src = 'assets/img/logo.png';
      doc.addImage(img, 'PNG', 170, 5, 30, 30); // Adjust position and size as needed
    
      // Add title with styling
      doc.setFontSize(24);
      doc.setTextColor(41, 128, 185); // Professional blue color
      doc.setFont('helvetica', 'bold');
      doc.text('Restaurant Details', 105, 25, { align: 'center' });
    
      // Add date with styling
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 35, { align: 'center' });
    
      // Prepare table data
      const restaurant = this.listdetails;
      const tableData = [
        ['ID', restaurant.restaurantid || 'N/A'],
        ['Name', restaurant.name],
        ['Location', restaurant.location],
        ['Cuisine Type', restaurant.cuisineType],
        ['Phone Number', restaurant.phoneNumber],
        ['Email', restaurant.email],
        ['Seating Capacity', restaurant.seatingCapacity],
        ['Opening Time', this.formatTime(restaurant.openingTime)],
        ['Closing Time', this.formatTime(restaurant.closingTime)],
        ['Status', restaurant.isActive === 'ACTIVE' ? 'Active' : 'Inactive']
      ];
    
      // Enhanced table styling
      autoTable(doc, {
        body: tableData,
        startY: 45,
        theme: 'striped',
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'left',
          fontSize: 12
        },
        bodyStyles: {
          fontSize: 11,
          textColor: [50, 50, 50],
          cellPadding: 6
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { top: 45, left: 15, right: 15 },
        styles: {
          font: 'helvetica',
          valign: 'middle',
          overflow: 'linebreak',
          cellWidth: 'auto',
          minCellHeight: 10
        },
        columnStyles: {
          0: { 
            fontStyle: 'bold',
            fillColor: [41, 128, 185],
            textColor: 255,
            cellWidth: 50
          },
          1: { 
            cellWidth: 'auto',
            cellPadding: { left: 10 }
          }
        }
      });
    
      // Add decorative line
      doc.setDrawColor(41, 128, 185);
      doc.setLineWidth(0.5);
      doc.line(15, 40, 195, 40);
    
      // Enhanced footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.setFont('helvetica', 'italic');
        
        // Add footer line
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2);
        doc.line(15, 280, 195, 280);
        
        // Add page numbers
        doc.text(
          `Page ${i} of ${pageCount}`,
          105,
          285,
          { align: 'center' }
        );
      }
    
      // Save the PDF with formatted name
      const formattedDate = new Date().toISOString().slice(0, 10);
      doc.save(`Restaurant_Details_${restaurant.name || 'Unknown'}_${formattedDate}.pdf`);
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
    


}
