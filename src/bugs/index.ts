/* eslint-disable no-console */

import { Logger } from 'zeed'
import { SENTRY_DSN } from '../config'
import { messages } from '../lib/messages'

const log = Logger('app:bugs')

// Lazy loading of bug tracker
export function setupBugTracker(done?: Function) {
  if (SENTRY_DSN) {
    console.log('Setup Sentry bug tracking')
    import('./lazy-sentry').then(({ setupSentry }) => {
      setupSentry({
        dsn: SENTRY_DSN,
      })
      console.log('Did init Sentry bug tracking')
      if (done)
        done()
    })
  }
}

// Send bugs if user allowed to do so

const collectedErrors = []

export function isAllowedBugTracking() {
  return localStorage?.allowSentry === '1'
}

export function setAllowedBugTracking(
  allowed = true,
  reloadMessage = 'Reload to activate changes',
) {
  localStorage.allowSentry = '1'
  setupBugTracker(() => {
    log('setupBugTracker', collectedErrors)
    let err
    // eslint-disable-next-line no-cond-assign
    while ((err = collectedErrors.pop())) {
      log('send error', err)
      trackException(err)
    }
  })
}

export function trackException(e, silent = false) {
  if (!silent)
    log.error('Exception:', e)

  if (window.sentry) {
    log('sentry exception', e)
    window.sentry.captureException(e)
  }
  else {
    collectedErrors.push(e)
    messages.emit('requestBugTracking')
  }
}

export function trackSilentException(e) {
  log.error(e)
  trackException(e, true)
}
