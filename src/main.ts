import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from './app/app.config'
import { AppComponent } from './app/app.component'

bootstrapApplication(AppComponent, appConfig).catch(err =>
  //default angular error handling
  // eslint-disable-next-line no-console
  console.error(err),
)
