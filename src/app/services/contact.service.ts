import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactPayload {
  fullname: string;
  email: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly endpoint = 'https://api.web3forms.com/submit';

  // Same access key used by the original static form.
  private readonly accessKey = '6aaf3111-f405-4e66-8517-555b6ce8f09e';

  constructor(private http: HttpClient) {}

  submit(payload: ContactPayload): Observable<unknown> {
    const body = {
      access_key: this.accessKey,
      fullname: payload.fullname,
      email: payload.email,
      message: payload.message,
      replyto: payload.email,
      subject: `Portfolio Contact from ${payload.fullname}`,
      _captcha: 'false'
    };

    return this.http.post(this.endpoint, body, {
      headers: { Accept: 'application/json' }
    });
  }
}
