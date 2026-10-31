// Runs before the first paint (a plain file, because the site's Content-Security-Policy
// allows no inline scripts). It picks the saved theme, or else the system's, so a visitor
// who prefers dark never sees a flash of the light page.
;(function () {
  try {
    var theme = localStorage.getItem('portfolio:theme')
    if (theme !== 'dark' && theme !== 'light') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    document.documentElement.dataset.theme = theme
  } catch (error) {
    // Storage blocked: the page simply stays light until the visitor uses the switch.
  }
})()
