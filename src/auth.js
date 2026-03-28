import { createServer } from 'http'
import { randomBytes } from 'crypto'
import { execSync } from 'child_process'

const DASHBOARD_URL = 'https://spaceship-ai.fly.dev'
const TIMEOUT_MS = 120_000

function openBrowser(url) {
  try {
    const p = process.platform
    if (p === 'darwin') execSync(`open "${url}"`, { stdio: 'ignore' })
    else if (p === 'win32') execSync(`start "" "${url}"`, { stdio: 'ignore' })
    else execSync(`xdg-open "${url}"`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

export async function authenticateViaBrowser() {
  const state = randomBytes(16).toString('hex')

  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      try {
        const url = new URL(req.url, 'http://localhost')

        if (url.pathname !== '/cb') {
          res.writeHead(404)
          res.end()
          return
        }

        const error = url.searchParams.get('error')
        if (error) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
          res.end(cancelledHtml())
          server.close()
          clearTimeout(timer)
          reject(new Error('Authentication cancelled.'))
          return
        }

        const code = url.searchParams.get('code')
        const returnedState = url.searchParams.get('state')

        if (!code || returnedState !== state) {
          res.writeHead(400)
          res.end('Invalid request')
          return
        }

        // Exchange the short-lived code for the actual API key
        fetch(`${DASHBOARD_URL}/cli-auth/exchange?code=${encodeURIComponent(code)}`)
          .then((r) => {
            if (!r.ok) return Promise.reject(new Error(`Exchange failed (${r.status}). Run again to retry.`))
            return r.json()
          })
          .then(({ key }) => {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(successHtml())
            server.close()
            clearTimeout(timer)
            resolve(key)
          })
          .catch((err) => {
            res.writeHead(500)
            res.end('Exchange failed')
            server.close()
            clearTimeout(timer)
            reject(err)
          })
      } catch (err) {
        reject(err)
      }
    })

    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      const callbackUrl = `http://127.0.0.1:${port}/cb`
      const authUrl = `${DASHBOARD_URL}/cli-auth?callback=${encodeURIComponent(callbackUrl)}&state=${state}`

      const opened = openBrowser(authUrl)
      if (opened) {
        process.stderr.write('Opening browser for authentication...\n')
      } else {
        process.stderr.write(`Could not open browser automatically. Visit this URL:\n\n  ${authUrl}\n\n`)
      }
      process.stderr.write('Waiting for browser authorization... (Ctrl+C to cancel)\n\n')
    })

    const timer = setTimeout(() => {
      server.close()
      reject(new Error('Authentication timed out. Run again to retry.'))
    }, TIMEOUT_MS)

    server.on('error', reject)
  })
}

function successHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Spaceship CLI Authorized</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0f0f1a;color:#e0e0e0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}
    .card{padding:48px;max-width:400px}
    .icon{font-size:48px;margin-bottom:16px}
    h2{color:#00daf3;margin:0 0 12px;font-size:22px;font-weight:600}
    p{color:#888;margin:0;font-size:14px;line-height:1.6}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">&#10003;</div>
    <h2>Spaceship CLI authorized</h2>
    <p>You can close this tab and return to your terminal.</p>
  </div>
</body>
</html>`
}

function cancelledHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Cancelled</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0f0f1a;color:#e0e0e0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}
    .card{padding:48px;max-width:400px}
    .icon{font-size:48px;margin-bottom:16px}
    h2{color:#888;margin:0 0 12px;font-size:22px;font-weight:600}
    p{color:#888;margin:0;font-size:14px}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">&#10005;</div>
    <h2>Authorization cancelled</h2>
    <p>You can close this tab.</p>
  </div>
</body>
</html>`
}
