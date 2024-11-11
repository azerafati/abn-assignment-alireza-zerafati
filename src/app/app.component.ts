import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { RegistrationFormComponent } from './registration-form/registration-form.component'
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegistrationFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'abn-assignment-alireza-zerafati'

  constructor(private readonly titleService: Title) {
    this.titleService.setTitle(this.title)
  }
}
