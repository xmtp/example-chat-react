export class StorageMock {
  private _storage: { [key: string]: any } = {}
  clear() {
    this._storage = {}
  }
  getItem(key: string) {
    return this._storage[key]
  }
  key(index: number) {
    return Object.keys(this._storage)[index]
  }
  removeItem(key: string) {
    this._storage[key] = undefined
  }
  setItem(key: string, value: string) {
    this._storage[key] = value
  }
  get length() {
    return Object.keys(this._storage).length
  }
}
