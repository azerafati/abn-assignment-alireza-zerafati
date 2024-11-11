import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { Component } from '@angular/core'
import { RegistrationFormComponent } from './registration-form/registration-form.component'

@Component({ standalone: true, selector: 'app-registration-form', template: '' })
class RegistrationFormStubComponent {}

describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    })
      .overrideComponent(AppComponent, {
        add: { imports: [RegistrationFormStubComponent] },
        remove: { imports: [RegistrationFormComponent] },
      })
      .compileComponents()

    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
  })

  it('should create the app', () => {
    expect(component).toBeTruthy()
  })

  it('should set title', () => {
    expect(document.title).toEqual('abn-assignment-alireza-zerafati')
  })
})
