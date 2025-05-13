export type DataBackend = 'firebase' | 'prisma'

export function getDataBackend(): DataBackend {
  const backend = process.env.DATA_BACKEND
  if (backend === 'firebase' || backend === 'prisma') {
    return backend
  }
  // Default to prisma for safety in production
  return 'prisma'
} 