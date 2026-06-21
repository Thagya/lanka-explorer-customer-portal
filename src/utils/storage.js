export const storage = {
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : fallback
    } catch { return fallback }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  },
  remove(key) {
    try { localStorage.removeItem(key) } catch {}
  },
}

export const TOKEN_KEY = 'le_token'
export const USER_KEY  = 'le_user'
