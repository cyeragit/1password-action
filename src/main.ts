import * as core from '@actions/core'
import {OnePassword} from './1password'

async function run(): Promise<void> {
  const deviceId = core.getInput('device-id')
  const onePassword = new OnePassword(deviceId)

  try {
    await onePassword.setupAndInstallIfNeeded()
  } catch (error) {
    core.setFailed(error.message)
  }

  const signInAddress = core.getInput('sign-in-address')
  const emailAddress = core.getInput('email-address')
  const masterPassword = core.getInput('master-password')
  const secretKey = core.getInput('secret-key')

  // Set inputs to secrets so they can't be leaked back to github console accidentally
  core.setSecret(signInAddress)
  core.setSecret(emailAddress)
  core.setSecret(masterPassword)
  core.setSecret(secretKey)

  core.startGroup('Signing in to 1Password')
  try {
    await onePassword.signIn(
      signInAddress,
      emailAddress,
      secretKey,
      masterPassword
    )
  } catch (error) {
    core.setFailed(`Error signing in to 1Password: ${error.message}`)
    return
  }
  core.endGroup()
}

run()
