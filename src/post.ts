import * as core from '@actions/core'
import {OnePassword} from './1password'

async function run(): Promise<void> {
  // try {
  const deviceId = core.getInput('device-id')
  const onePassword = new OnePassword(deviceId)

  core.info('Signing out of 1Password')
  try {
    await onePassword.signOut()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
