import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './routes/HomePage'
import ProjectDetails from './routes/ProjectDetails'
import AboutPage from './routes/AboutPage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/projects/:slug",
    element: <ProjectDetails />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
