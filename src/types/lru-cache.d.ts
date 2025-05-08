declare module 'lru-cache' {
  export class LRUCache<K = any, V = any> {
    constructor(options?: {
      max?: number
      maxSize?: number
      sizeCalculation?: (value: V, key: K) => number
      ttl?: number
      allowStale?: boolean
      updateAgeOnGet?: boolean
      updateAgeOnHas?: boolean
    })

    set(key: K, value: V, options?: { ttl?: number }): boolean
    get(key: K): V | undefined
    has(key: K): boolean
    delete(key: K): boolean
    clear(): void
    keys(): IterableIterator<K>
    values(): IterableIterator<V>
    entries(): IterableIterator<[K, V]>
    forEach(callbackfn: (value: V, key: K, cache: this) => void): void
    readonly size: number
  }
} 