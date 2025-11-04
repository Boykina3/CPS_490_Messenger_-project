import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Blog } from './pages/Blog.jsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Signup } from './pages/Signup.jsx'
import { AuthContextProvider, useAuth } from './context/AuthContext.jsx'
import { Login } from './pages/Login.jsx'

// Protected route component
function ProtectedRoute({ children }) {
  const [token] = useAuth()
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Blog />
      </ProtectedRoute>
    ),
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  },
])

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  )
}