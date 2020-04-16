const fs = require('fs')
const path = require('path')
const { getAllFilesFromDirectory } = require('./file-system-extension')
const { getHash } = require('./hash-generator')

/**
 * @typedef FileHasherConfig
 * @type {object}
 * @property {string} rootFolder
 * @property {string[]} fileExtensions
 * @property {string[]} excludedFiles
 * @property {string[]} includedFiles
 * @property {string[]} excludedSubFolders
 * @property {string[]} includedSubFolders
 */

/**
 * @param {FileHasherConfig} config
 * @exported
 */
function hashFiles(config) {
  config = prepareConfig(config)
  const rootDir = path.resolve(config.rootFolder)
  const allFiles = getAllFilesFromDirectory(rootDir)
  for (const file of allFiles) {
    const rootRelativePath = file.split(rootDir)[1].substring(1)
    if (config.excludedFiles.includes(rootRelativePath)) continue
    if (config.includedFiles.includes(rootRelativePath)) {
      hashFileName(file)
    } else if (config.excludedSubFolders.some(x => file.includes(x) &&
      (config.includedSubFolders.every(y => !file.includes(y)) ||
        config.includedSubFolders.some(y => file.includes(y) &&
          x.length >= y.length)))
    ) {
      continue
    } else if (config.fileExtensions.some(x => file.endsWith(x))) {
      hashFileName(file)
    }
  }
}

/**
 * @param {FileHasherConfig} config
 * @returns {FileHasherConfig}
 */
function prepareConfig(config) {
  config.excludedFiles = config.excludedFiles
    .map(file => trimFileName(file).replace(/\//g, '\\'))
  config.includedFiles = config.includedFiles
    .map(file => trimFileName(file).replace(/\//g, '\\'))
  config.excludedSubFolders = config.excludedSubFolders
    .map(folderPath => trimFolderPath(folderPath).replace(/\//g, '\\'))
  config.includedSubFolders = config.includedSubFolders
    .map(folderPath => trimFolderPath(folderPath).replace(/\//g, '\\'))
  return config
}

/**
 * @param {string} fileName
 * @return {string}
 */
function trimFileName(fileName) {
  if (fileName.startsWith('/')) return fileName.substring(1)
  if (fileName.startsWith('./')) return fileName.substring(2)
  return fileName
}

/**
 * @param {string} folderPath
 * @return {string}
 */
function trimFolderPath(folderPath) {
  if (folderPath.startsWith('/')) folderPath = folderPath.substring(1)
  if (folderPath.endsWith('/')) folderPath = folderPath.slice(0, -1)
  return folderPath
}

/**
 * @param {string} fileName
 */
function hashFileName(fileName) {
  const fileExtension = path.extname(fileName)
  const pureFileName = path.basename(fileName, fileExtension)
  const directoryPath = path.dirname(fileName)
  const newPureFileName = `${pureFileName}.${getHash()}${fileExtension}`
  const newFileName = path.resolve(directoryPath, newPureFileName)
  fs.renameSync(fileName, newFileName)
}

module.exports = { hashFiles }
