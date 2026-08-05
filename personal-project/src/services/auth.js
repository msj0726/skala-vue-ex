import { readonly, ref } from 'vue'

const USERS_KEY = 'mlbx-users'
const SESSION_KEY = 'mlbx-session'
const currentUser = ref(JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'))

const hashPassword = async (password) => {
  const data = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]')

export const useAuth = () => {
  const signUp = async ({ name, email, password }) => {
    const users = getUsers()
    const normalizedEmail = email.trim().toLowerCase()
    if (users.some((user) => user.email === normalizedEmail)) throw new Error('이미 가입된 이메일입니다.')
    const user = { id: crypto.randomUUID(), name: name.trim(), email: normalizedEmail, passwordHash: await hashPassword(password) }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
    currentUser.value = { id: user.id, name: user.name, email: user.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))
  }

  const login = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase()
    const passwordHash = await hashPassword(password)
    const user = getUsers().find((item) => item.email === normalizedEmail && item.passwordHash === passwordHash)
    if (!user) throw new Error('이메일 또는 비밀번호를 확인해주세요.')
    currentUser.value = { id: user.id, name: user.name, email: user.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser.value))
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem(SESSION_KEY)
  }

  return { currentUser: readonly(currentUser), signUp, login, logout }
}
