import { TestBed } from '@angular/core/testing'
import { RegistrationService } from './registration.service'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { provideHttpClient } from '@angular/common/http'

describe('RegistrationService', () => {
  let service: RegistrationService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    service = TestBed.inject(RegistrationService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
