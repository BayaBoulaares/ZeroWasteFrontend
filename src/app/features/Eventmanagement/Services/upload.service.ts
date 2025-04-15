import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = 'http://localhost:8089/api/media/upload';

  constructor(private http: HttpClient) {}

  uploadFile(entityType: string, entityId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('entityType', entityType);
    formData.append('entityId', entityId.toString());
    formData.append('file', file);

    return this.http.post(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
