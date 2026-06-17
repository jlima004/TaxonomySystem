import { createHash } from 'node:crypto'
import { access, lstat, readFile, readdir, readlink } from 'node:fs/promises'
import { join, relative } from 'node:path'

export type DirectorySnapshotEntry = {
  relative_path: string
  sha256: string
  size_bytes: number
  entry_kind: 'file' | 'symlink'
  link_target?: string
}

export type DirectorySnapshot = {
  exists: boolean
  entries: DirectorySnapshotEntry[]
  aggregate_sha256: string
}

const dirExists = async (path: string): Promise<boolean> =>
  access(path)
    .then(() => true)
    .catch(() => false)

const normalizePath = (path: string): string => path.split('\\').join('/')

const hashSymlink = (linkTarget: string): string =>
  createHash('sha256').update(`symlink:${linkTarget}`).digest('hex')

const computeAggregateSha256 = (entries: DirectorySnapshotEntry[]): string => {
  const hash = createHash('sha256')
  for (const entry of entries) {
    hash.update(
      `${entry.relative_path}:${entry.entry_kind}:${entry.sha256}:${entry.size_bytes}:${entry.link_target ?? ''}\n`,
    )
  }
  return hash.digest('hex')
}

const walkDirectory = async (
  dirPath: string,
  rootPath: string,
): Promise<DirectorySnapshotEntry[]> => {
  const entries: DirectorySnapshotEntry[] = []

  const walk = async (current: string): Promise<void> => {
    const dirents = await readdir(current, { withFileTypes: true })
    const sorted = [...dirents].sort((a, b) => a.name.localeCompare(b.name))

    for (const dirent of sorted) {
      const fullPath = join(current, dirent.name)
      if (dirent.isDirectory()) {
        await walk(fullPath)
      } else if (dirent.isSymbolicLink()) {
        const linkTarget = await readlink(fullPath)
        const linkStat = await lstat(fullPath)
        entries.push({
          relative_path: normalizePath(relative(rootPath, fullPath)),
          sha256: hashSymlink(linkTarget),
          size_bytes: linkStat.size,
          entry_kind: 'symlink',
          link_target: normalizePath(linkTarget),
        })
      } else if (dirent.isFile()) {
        const content = await readFile(fullPath)
        const fileStat = await lstat(fullPath)
        entries.push({
          relative_path: normalizePath(relative(rootPath, fullPath)),
          sha256: createHash('sha256').update(content).digest('hex'),
          size_bytes: fileStat.size,
          entry_kind: 'file',
        })
      }
    }
  }

  await walk(dirPath)
  return entries.sort((a, b) => a.relative_path.localeCompare(b.relative_path))
}

export const snapshotDirectory = async (dirPath: string): Promise<DirectorySnapshot> => {
  const exists = await dirExists(dirPath)
  if (!exists) {
    return {
      exists: false,
      entries: [],
      aggregate_sha256: computeAggregateSha256([]),
    }
  }

  const entries = await walkDirectory(dirPath, dirPath)
  return {
    exists: true,
    entries,
    aggregate_sha256: computeAggregateSha256(entries),
  }
}

export const snapshotsEqual = (before: DirectorySnapshot, after: DirectorySnapshot): boolean =>
  before.exists === after.exists
  && before.aggregate_sha256 === after.aggregate_sha256
  && before.entries.length === after.entries.length
  && before.entries.every((entry, index) => {
    const other = after.entries[index]
    return (
      other !== undefined
      && entry.relative_path === other.relative_path
      && entry.entry_kind === other.entry_kind
      && entry.sha256 === other.sha256
      && entry.size_bytes === other.size_bytes
      && entry.link_target === other.link_target
    )
  })
