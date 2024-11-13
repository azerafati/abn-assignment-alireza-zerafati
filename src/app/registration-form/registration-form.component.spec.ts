import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RegistrationFormComponent } from './registration-form.component'
import { RegistrationService } from '../service/registration.service'
import { delay, EMPTY, of, Subscription, throwError } from 'rxjs'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { By } from '@angular/platform-browser'
import { MatSnackBar } from '@angular/material/snack-bar'

describe('RegistrationFormComponent', () => {
  let component: RegistrationFormComponent
  let fixture: ComponentFixture<RegistrationFormComponent>
  let snackBar: MatSnackBar
  let registrationService: RegistrationService

  const submitForm = (): void => fixture.debugElement.query(By.css('[data-testid="submit"]')).nativeElement.click()

  const VALID_FORM_DATA = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'StrongPassword1!',
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationFormComponent, NoopAnimationsModule],
      providers: [
        {
          provide: RegistrationService,
          useValue: {
            registerUser: jest.fn(() => EMPTY),
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: jest.fn(),
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(RegistrationFormComponent)
    component = fixture.componentInstance
    snackBar = TestBed.inject(MatSnackBar)
    registrationService = TestBed.inject(RegistrationService)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should show success message on registration success', () => {
    //given
    jest.spyOn(registrationService, 'registerUser').mockReturnValue(
      of({
        status: 'success',
        message: 'Registration successful',
      }),
    )
    component['form'].patchValue(VALID_FORM_DATA)

    //when
    submitForm()

    //then
    expect(snackBar.open).toHaveBeenCalledWith('Registration successful', expect.anything(), expect.anything())
  })

  it('should show error message on registration failure', () => {
    //given
    jest.spyOn(registrationService, 'registerUser').mockReturnValue(
      throwError(() => ({
        status: 'error',
        message: 'Registration failed',
      })),
    )
    component['form'].patchValue(VALID_FORM_DATA)

    //when
    submitForm()

    //then
    expect(registrationService.registerUser).toHaveBeenCalled()
    expect(snackBar.open).toHaveBeenCalledWith('Registration failed', expect.anything(), expect.anything())
  })

  it('should show form invalid message on invalid form submission', () => {
    submitForm()
    expect(snackBar.open).toHaveBeenCalledWith(
      'The form is invalid, please check the errors and try again!',
      expect.anything(),
      expect.anything(),
    )
    expect(registrationService.registerUser).not.toHaveBeenCalled()
  })

  it('should return password strength less than error threshold for weak passwords', () => {
    const weakPasswords = ['password', '123456', 'password1', 'weak']
    weakPasswords.forEach(password => {
      expect(component['getPasswordStrength'](password)).toBeLessThanOrEqual(component['Error_Threshold'])
    })
  })

  it('should return password strength more than error threshold for normal passwords', () => {
    const passwords = ['Password1@#@', 'StrongPassword$', '12345678P@']
    passwords.forEach(password => {
      expect(component['getPasswordStrength'](password)).toBeGreaterThanOrEqual(component['Error_Threshold'])
    })
  })

  it('should not submit form if invalid', () => {
    //given
    component['form'].patchValue({
      username: 'testuser',
      email: 'invalid-email',
    })

    //when
    submitForm()

    //then
    expect(snackBar.open).toHaveBeenCalledWith(
      'The form is invalid, please check the errors and try again!',
      expect.anything(),
      expect.anything(),
    )
    expect(registrationService.registerUser).not.toHaveBeenCalled()
  })

  it('should not submit form if already submitting / avoid double submits', () => {
    //given
    jest.spyOn(registrationService, 'registerUser').mockReturnValue(
      of({
        status: 'success',
        message: 'Registration successful',
      }).pipe(delay(5000)),
    )
    component['form'].patchValue(VALID_FORM_DATA)

    //when
    submitForm()

    //then
    expect(snackBar.open).not.toHaveBeenCalled()
    expect(registrationService.registerUser).toHaveBeenCalledTimes(1)
  })

  it('should submit form once if valid', () => {
    //given
    component['form'].patchValue(VALID_FORM_DATA)

    //when
    submitForm()

    //then
    expect(component['form'].valid).toBeTruthy()
    expect(snackBar.open).not.toHaveBeenCalled()
    expect(registrationService.registerUser).toHaveBeenCalledTimes(1)
  })

  it('should be able to retry the submit action if failed', () => {
    //given
    jest.spyOn(registrationService, 'registerUser').mockReturnValue(
      throwError(() => ({
        status: 'error',
        message: 'Registration failed',
      })),
    )
    component['form'].patchValue(VALID_FORM_DATA)
    submitForm()

    //when
    submitForm()

    //then
    expect(registrationService.registerUser).toHaveBeenCalledTimes(2)
  })

  it('should unsubscribe on destroy', () => {
    //given
    jest.spyOn(registrationService, 'registerUser').mockReturnValue(
      of({
        status: 'success',
        message: 'Registration successful',
      }).pipe(delay(5000)),
    )
    component['form'].patchValue(VALID_FORM_DATA)

    //when
    submitForm()
    const subscription = component['subscription']!
    jest.spyOn(subscription, 'unsubscribe')
    fixture.destroy()

    //then
    expect(subscription.unsubscribe).toHaveBeenCalled()
  })
})
