import { useState } from 'react'

import './App.css'
import Routers from './routers'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer} from 'react-toastify'
//update..
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routers />
      <ToastContainer />
    </>
  )
}

export default App
