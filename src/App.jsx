import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './client/components/login'
import Dashboard from './client/components/Dashboard'
import { Route, Routes, useNavigate } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)


  const navigate = useNavigate()
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if(!isLoggedIn) {
      navigate('/')
    }
  }, [])

  return (
    <>
    <div>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/Dashboard' element={<Dashboard />}/>
      </Routes>
    </div>
    </>
  )
}

export default App
