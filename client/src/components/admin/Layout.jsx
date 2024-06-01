import {Outlet} from 'react-router-dom'
import Nav from './Nav'
import "../../../styles/rootlayout.scss"

const Layout = () => {
  return (
    <div className='layout'>
    <header>
      <Nav />
    </header>
    <main className='App'>
      <Outlet />
    </main>
    <footer>
      <p>Another page by km</p>
    </footer>
    </div>
  )
}

export default Layout