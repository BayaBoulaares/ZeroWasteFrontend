import { Component } from '@angular/core';
import { UploadService } from '../../Services/upload.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  selectedFile: File | null = null;
  entityType: string = 'event'; // or 'menu'
  entityId: number = 1;
  uploadProgress = 0;
  message = '';
  isUploading = false;

  constructor(private uploadService: UploadService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.message = ''; // Clear previous messages
    this.uploadProgress = 0;
  }

  onUpload() {
    if (!this.selectedFile) {
      this.message = 'Please select a file first';
      return;
    }

    if (!this.entityId) {
      this.message = 'Please enter an entity ID';
      return;
    }

    this.isUploading = true;
    this.message = 'Uploading...';
    
    this.uploadService.uploadFile(this.entityType, this.entityId, this.selectedFile).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.message = 'Upload successful!';
          this.isUploading = false;
        }
      },
      error: (err) => {
        console.error('Upload error:', err);
        this.message = `Upload failed: ${err.message || 'Unknown error'}`;
        this.isUploading = false;
      },
      complete: () => {
        this.isUploading = false;
      }
    });
  }
}