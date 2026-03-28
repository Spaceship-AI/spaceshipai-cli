import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { homedir } from 'os'
import { execSync } from 'child_process'
import { dirname } from 'path'

const home = homedir()

const MCP_ENTRY = (key) => ({
  command: 'uvx',
  args: ['spaceship-mcp'],
  env: { SPACESHIP_API_KEY: key },
})

function readJsonFile(path, fallback = {}) {
  if (!existsSync(path)) return fallback
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return fallback
  }
}

function writeJsonFile(path, data) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

export function installClaudeCode(key) {
  // Remove any existing project-scoped entry before adding user-scoped one
  try {
    execSync('claude mcp remove spaceship', { stdio: 'ignore' })
  } catch {
    // Not present — that's fine
  }
  execSync(
    `claude mcp add --scope user --transport stdio spaceship --env SPACESHIP_API_KEY=${key} -- uvx spaceship-mcp`,
    { stdio: 'ignore' }
  )
}

export function installCursor(key) {
  const configPath = `${home}/.cursor/mcp.json`
  const config = readJsonFile(configPath, { mcpServers: {} })
  config.mcpServers = config.mcpServers || {}
  config.mcpServers.spaceship = MCP_ENTRY(key)
  writeJsonFile(configPath, config)
}

export function installVscode(key) {
  // VS Code user-level MCP config (cross-platform compatible path)
  const configPath = `${home}/.vscode/mcp.json`
  const config = readJsonFile(configPath, { servers: {} })
  config.servers = config.servers || {}
  config.servers.spaceship = MCP_ENTRY(key)
  writeJsonFile(configPath, config)
}

export function installWindsurf(key) {
  const configPath = `${home}/.codeium/windsurf/mcp_config.json`
  const config = readJsonFile(configPath, { mcpServers: {} })
  config.mcpServers = config.mcpServers || {}
  config.mcpServers.spaceship = MCP_ENTRY(key)
  writeJsonFile(configPath, config)
}
