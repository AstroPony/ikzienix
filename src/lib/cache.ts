type CacheEntry<T> = {
  value: T
  timestamp: number
}

export class Cache<T> {
  private store: Map<string, CacheEntry<T>>
  private ttl: number

  constructor(ttl: number = 5 * 60 * 1000) { // Default 5 minutes
    this.store = new Map()
    this.ttl = ttl
  }

  set(key: string, value: T): void {
    this.store.set(key, {
      value,
      timestamp: Date.now()
    })
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined

    if (Date.now() - entry.timestamp > this.ttl) {
      this.store.delete(key)
      return undefined
    }

    return entry.value
  }

  has(key: string): boolean {
    return this.get(key) !== undefined
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }
}

export const ordersCache = new Cache()
export const analyticsCache = new Cache() 