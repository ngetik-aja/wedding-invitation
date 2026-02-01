import NProgress from "nprogress"

let activeRequests = 0

NProgress.configure({ showSpinner: false })

export function startProgress() {
  activeRequests += 1
  if (activeRequests === 1) {
    NProgress.start()
  }
}

export function stopProgress() {
  if (activeRequests > 0) {
    activeRequests -= 1
  }
  if (activeRequests === 0) {
    NProgress.done()
  }
}

export function resetProgress() {
  activeRequests = 0
  NProgress.done(true)
}
