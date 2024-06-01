import React, { useEffect, useState } from 'react';
import "../../../styles/admin/adminUsers.scss";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Users = () => {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTypes, setUserTypes] = useState({ Admin: false, Editor: false, User: false });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosPrivate.get("/admin/dashboard/users");
      setUsers(prevUsers => {
        const uniqueUsers = new Set(prevUsers.map(user => user._id));
        const filteredNewUsers = response.data.users.filter(user => !uniqueUsers.has(user._id));
        return [...prevUsers, ...filteredNewUsers];
      });
    } catch (err) {
      if (err.response) {
        console.error(err.response.data);
        console.error(err.response.status);
        console.error(err.response.headers);
      } else {
        console.error(err.message);
      }
    }
    setIsLoading(false);
  };

  const userTypeLabel = (userTypes) => {
    if (userTypes.Admin && userTypes.Editor) return "Admin";
    if (userTypes.Admin) return "Admin";
    if (userTypes.Editor) return "Editor";
    if (userTypes.User) return "User";
    return "Unknown";
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleClick = (user) => {
    setSelectedUser(user);
    setUserTypes(user.userTypes);
    setIsModalActive(true);
  };

  const handleUserTypeClick = async (type) => {
    if (!selectedUser) return;

    const updatedUserTypes = { ...userTypes, [type]: !userTypes[type] };
    setUserTypes(updatedUserTypes);

    const userTypeIds = [];
    if (updatedUserTypes.User) userTypeIds.push(1987);
    if (updatedUserTypes.Editor) userTypeIds.push(1988);
    if (updatedUserTypes.Admin) userTypeIds.push(1989);

    try {
      await axiosPrivate.patch(`/admin/dashboard/users/${selectedUser._id}/userTypes`, {
        userId: selectedUser._id,
        userTypes: userTypeIds
      });
      // Update users state with new user types
      setUsers(prevUsers => prevUsers.map(user => user._id === selectedUser._id ? { ...user, userTypes: updatedUserTypes } : user));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(()=>{
    const handleKeyDown = (event) => {
      if(event.key === "Escape"){
        setIsModalActive(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)

    return() =>{
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <>
      <h1>Users</h1>
      {isLoading && <p>Loading More Posts</p>}

      <div className="all-users">
        <div className="left-modal">
         
          <div className="users-div">
          <h2>Users</h2>
          {users.map((user) =>
            <div className="user-div" key={user._id}>
              <button className='userType-button' onClick={() => handleClick(user)}>{userTypeLabel(user.userTypes)}</button>
              <div className="details">
                <h4>{user.username}</h4>
                <p>{user.email}</p>
              </div>
            </div>
          )}
          </div>
        </div>
        {isModalActive && selectedUser && (
          <div className="background-for-modal">
 <div className="right-modal">
            <button className="close-modal-btn" onClick={() => setIsModalActive(false)}>
                <span className="material-symbols-outlined">cancel</span>
              </button>
            <h2>Update User Type: <br/>
            <span className="username">{selectedUser.username}'s</span> </h2>
            <ul>
              {['User', 'Editor', 'Admin'].map((type) => (
                <li
                  key={type}
                  className={userTypes[type] ? 'active' : ''}
                  onClick={() => handleUserTypeClick(type)}
                >
                  <p>{type}</p>
                </li>
              ))}
            </ul>
          </div>
          </div>
         
        )}
      </div>
    </>
  );
}

export default Users;
