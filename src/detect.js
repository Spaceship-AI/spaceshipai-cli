import { existsSync } from 'fs'
import { homedir } from 'os'
import { execSync } from 'child_process'

const home = homedir()

function cliExists(cmd) {
  try {
    execSync(`which ${cmd}`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

export function detect() {
  return {
    claudeCode: cliExists('claude') || existsSync(`${home}/.claude`),
    cursor:     existsSync(`${home}/.cursor`),
    vscode:     cliExists('code') || existsSync(`${home}/.vscode`),
    windsurf:   existsSync(`${home}/.codeium/windsurf`),
  }
}
