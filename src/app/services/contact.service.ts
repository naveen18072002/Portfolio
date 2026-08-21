import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactPayload {
  fullname: string;
  email: string;
  mobile?: string;
  message: string;
  honeypot?: string;
}

export interface ContactMessageItem {
  id?: number;
  fullname: string;
  email: string;
  mobile?: string;
  message: string;
  createdAt?: string;
  isRead?: boolean;
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
      mobile: payload.mobile || '',
      message: payload.message,
      honeypot: payload.honeypot || ''
    });
  }

  getMessages(): Observable<ContactMessageItem[]> {
    return this.http.get<ContactMessageItem[]>(this.messagesEndpoint);
  }

  toggleRead(id: number, isRead?: boolean): Observable<any> {
    const params = isRead !== undefined ? `?isRead=${isRead}` : '';
    return this.http.put(`${this.messagesEndpoint}/${id}/read${params}`, {});
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.messagesEndpoint}/mark-all-read`, {});
  }

  deleteMessage(id: number): Observable<any> {
    return this.http.delete(`${this.messagesEndpoint}/${id}`);
  }

  replyToMessage(id: number, replyBody: string): Observable<any> {
    return this.http.post(`${this.messagesEndpoint}/${id}/reply`, { message: replyBody });
  }
}
