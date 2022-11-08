import packageJson from '../package.json'

export const getAppVersion = () => {
  const { name, version } = packageJson
  return name + '/' + version
}
