import * as core from '@actions/core'
import {OnePassword} from './1password'

async function run(): Promise<void> {
  const onePassword = new OnePassword()

  core.info('Signing out of 1Password')
  try {
    await onePassword.signOut()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
