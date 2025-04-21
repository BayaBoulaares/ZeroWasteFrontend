import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class DownloadPdfService {
  constructor() { }

  // Méthode pour télécharger la page ou l'élément en PDF
  downloadPdf(element: HTMLElement, fileName: string = 'order-details.pdf'): void {
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      // Calcul des dimensions du PDF
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Ajouter l'image capturée au PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Générer le PDF et créer un lien pour le téléchargement
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;

      // Déclenchement du téléchargement
      setTimeout(() => {
        link.click();
        URL.revokeObjectURL(url); // Libérer l'URL après usage
      }, 100);
    });
  }
}
