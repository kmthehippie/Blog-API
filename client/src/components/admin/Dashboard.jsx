import { NavLink, Outlet } from 'react-router-dom';
import "../../../styles/admin/dashboard.scss"

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="top-modal">
        <ul>
          <li><NavLink end to="/admin/dashboard" >Blogposts</NavLink></li>
          <li><NavLink to="/admin/dashboard/users" activeClassName="active">Users</NavLink></li>
          <li><NavLink to="/admin/dashboard/newpost" activeClassName="active">New Post</NavLink></li>
        </ul>
      </div>
      <div className="bottom-modal">
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard;
