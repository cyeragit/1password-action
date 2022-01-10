import * as core from '@actions/core'
import {OnePassword} from './1password'

async function run(): Promise<void> {
  const onePassword = new OnePassword()

  try {
    await onePassword.setupAndInstallIfNeeded()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
