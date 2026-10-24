import { createContext } from 'react'

type UserProps = {
  name: string | null
  email: string | null
  uid: string | null
}

type AuthContextData = {
  signed: boolean
  loadingAuth: boolean
  handleInfoUser: ({
    name,
    email,
    uid
  }: {
    name: string
    email: string
    uid: string
  }) => void
  user: UserProps | null
}

export const AuthContext = createContext({} as AuthContextData)
