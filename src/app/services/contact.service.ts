import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactPayload {
  fullname: string;
  email: string;
  message: string;
}

export interface ContactMessageItem {
  id?: number;
  fullname: string;
  email: string;
  message: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/contact/submit`;
  private readonly messagesEndpoint = `${environment.apiUrl}/contact/messages`;

  submit(payload: ContactPayload): Observable<any> {
    return this.http.post(this.endpoint, {
      fullname: payload.fullname,
      email: payload.email,
      message: payload.message
    });
  }

  getMessages(): Observable<ContactMessageItem[]> {
    return this.http.get<ContactMessageItem[]>(this.messagesEndpoint);
  }

  deleteMessage(id: number): Observable<any> {
    return this.http.delete(`${this.messagesEndpoint}/${id}`);
  }
}
