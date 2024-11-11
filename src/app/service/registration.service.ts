import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { RegisterInfo } from '../model/register-info'
import { Observable } from 'rxjs'
import { Response } from '../model/response'

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private http: HttpClient) {}

  registerUser(registerInfo: RegisterInfo): Observable<Response> {
    return this.http.post<Response>('/api/register', registerInfo)
  }
}
