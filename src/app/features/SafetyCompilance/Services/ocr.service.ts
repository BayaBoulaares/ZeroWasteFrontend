import { Injectable } from '@angular/core';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { recognize, createWorker, setLogging, WorkerOptions } from 'tesseract.js';

// Set the worker source path (CDN or local assets)
GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/tesseract.js@4.0.2/dist/worker.min.js';

@Injectable({ providedIn: 'root' })
export class OcrService {
  async extractTextFromPdf(pdfFile: File): Promise<string> {
    const pdfData = new Uint8Array(await pdfFile.arrayBuffer());
    const pdf = await getDocument({ data: pdfData }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;

      // OCR using standalone recognize method
      const { data: { text } } = await recognize(canvas, 'eng');
      fullText += text + '\n';
    }

    return fullText;
  }
}
