import { Component, OnDestroy } from '@angular/core'
import {
  AbstractControl,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule, MatIconButton } from '@angular/material/button'
import { MatProgressBar } from '@angular/material/progress-bar'
import { finalize, map, Subscription } from 'rxjs'
import { RegistrationService } from '../service/registration.service'

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [
    FormsModule,
    MatError,
    MatFormField,
    MatHint,
    MatInputModule,
    MatLabel,
    ReactiveFormsModule,
    NgOptimizedImage,
    MatIconModule,
    MatIconButton,
    MatButtonModule,
    MatProgressBar,
    AsyncPipe,
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
})
export class RegistrationFormComponent implements OnDestroy {
  protected hidePassword = true
  protected form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, this.passwordStrengthValidator()]],
    fullName: this.fb.control<string | undefined>(undefined),
  })
  passwordStrength$ = this.form.controls.password.valueChanges.pipe(map(this.getPasswordStrength))
  protected isSubmitting = false
  private subscription?: Subscription
  private readonly Error_Threshold = 30
  private readonly Warn_Threshold = 50
  protected passwordColor$ = this.passwordStrength$.pipe(
    map(strength =>
      strength <= this.Error_Threshold ? 'error' : strength <= this.Warn_Threshold ? 'warn' : 'success',
    ),
  )

  constructor(
    private readonly fb: NonNullableFormBuilder,
    private readonly snackBar: MatSnackBar,
    private readonly registrationService: RegistrationService,
  ) {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.showSnackbar('The form is invalid, please check the errors and try again!')
      return
    }
    if (this.isSubmitting) return
    this.isSubmitting = true
    this.subscription = this.registrationService
      .registerUser(this.form.getRawValue())
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: result => this.showSnackbar(result.message),
        error: error => this.showSnackbar(error.message),
      })
  }

  /** Return the strength of a password between 0 and 100 */
  private getPasswordStrength(password?: string): number {
    if (!password) return 0
    if (password.length < 6) return 5
    const rules = [
      password.match(/[a-z]+/),
      password.match(/[A-Z]+/),
      password.match(/[0-9]+/),
      password.match(/[$@#&!]+/),
      password.length > 10,
      password.length > 20,
      password.length > 30,
    ]
    return (rules.filter(Boolean).length / rules.length) * 100
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 })
  }

  /** Password must pass Warn_Threshold */
  private passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isPasswordWeak = this.getPasswordStrength(control.value) <= this.Error_Threshold
      return isPasswordWeak ? { weak: true } : null
    }
  }
}
