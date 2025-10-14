'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Sign up function
  const signup = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update user profile with display name
      if (displayName && result.user) {
        await updateProfile(result.user, {
          displayName: displayName
        })
      }
      
      return result
    } catch (error) {
      console.error('Sign up error:', error.code, error.message)
      // Provide more user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.')
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.')
      } else {
        throw new Error(error.message)
      }
    }
  }

  // Sign in function
  const signin = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Sign in error:', error.code, error.message)
      // Provide more user-friendly error messages
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please check your credentials.')
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email.')
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password.')
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.')
      } else {
        throw new Error(error.message)
      }
    }
  }

  // Sign out function
  const logout = () => {
    return signOut(auth)
  }

  const value = {
    user,
    signup,
    signin,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
