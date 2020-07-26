const showBanner = require('node-banner')
const FtpDeploy = require('ftp-deploy')
const ftpDeploy = new FtpDeploy()

const printBanner = async (title, color) => {
  await showBanner(title, '', color)
}

printBanner(`Deploying ${process.env.NODE_ENV}`, 'yellow')

const EnvDomain = {
  test: { host: '182.61.139.115', user: 'yangsh', password: '2^Jw$#2Qb5' },
  production: { host: '182.61.4.137', user: 'yangsh', password: 'b%RU470!' },
}
const { user, host, password } = EnvDomain[process.env.NODE_ENV]

const config = {
  user,
  password,
  host,
  port: 21,
  localRoot: __dirname + '/build',
  remoteRoot: '/examiner',
  include: ['*', '**/*'],
  deleteRemote: true,
  forcePasv: true,
}

ftpDeploy
  .deploy(config)
  .then(() => printBanner(`Deploy ${process.env.NODE_ENV} Success`, 'green'))
  .catch((err) => {
    console.log(err)
    printBanner(`Deploy ${process.env.NODE_ENV} failed`, 'red')
  })
