import { createApp } from 'vue'
import { Logger } from 'zeed'
import * as Sentry from '@sentry/browser'
import { BrowserTracing } from '@sentry/tracing'
import { SENTRY_DSN, RELEASE } from './config'
import appComponent from './app.vue'
import { i18n } from './i18n'

// import "./logic/registerServiceWorker"

const log = Logger('main')

log(`env = ${JSON.stringify(import.meta.env, null, 2)}`)

// Force removal of 1.0 service-workers
try {
  log('try removal of service workers')
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations)
      registration.unregister()
  })
}
catch (err) {
  log.error('Unregistering failed', err)
}

const app = createApp(appComponent)

// Setup bug tracking
window.sentry = Sentry
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    release: RELEASE,
    integrations: [new BrowserTracing()],

  })
  console.log('Sentry initialized')
}

app.use(i18n)
app.mount('#app')
