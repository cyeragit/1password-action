import * as core from '@actions/core'
import {install} from './install'
import * as tc from '@actions/tool-cache'

const ONE_PASSWORD_VERSION = core.getInput('cli-version')

export class OnePassword {
  onePasswordEnv: {[key: string]: string}

  constructor() {
    this.onePasswordEnv = {}
    if (process.env['XDG_CONFIG_HOME'] === undefined) {
      // This env var isn't set on GitHub-hosted runners
      this.onePasswordEnv.XDG_CONFIG_HOME = `${process.env['HOME']}/.config`
    }
  }

  async setupAndInstallIfNeeded(): Promise<void> {
    // Check if op is installed and download if necessary
    const cachedOpDirectory = tc.find('op', ONE_PASSWORD_VERSION)
    // This seems like a weird API, why not return undefined?
    if (cachedOpDirectory !== '') {
      core.addPath(cachedOpDirectory)
    } else {
      core.info(`op not found in cache, installing version ${ONE_PASSWORD_VERSION}`)
      await install(ONE_PASSWORD_VERSION)
    }
  }
}
