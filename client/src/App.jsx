//All will use components
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";

//User Components
import Layout from "./components/Layout";
import Home from "./components/Home";
import ErrorPage from "./components/ErrorPage";
import Post from "./components/Post";
import Posts from "./components/Posts";
import NewComment from "./components/NewComment";
import UpdateComment from "./components/UpdateComment";
import DeleteComment from "./components/DeleteComment";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Registration from "./components/Registration";
import UserProfile from "./components/UserProfile";
import UpdateUserProfile from "./components/UpdateUserProfile";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";

//Admin components
import Dashboard from "./components/admin/Dashboard";
import AdminLayout from "./components/admin/Layout";
import AdminLogin from "./components/admin/Login";
import BlogPosts from "./components/admin/BlogPosts";
import Users from "./components/admin/Users";
import AdminComments from "./components/admin/Comments";
import AdminComment from "./components/admin/Comment";
import NewPost from "./components/admin/NewPost";
import UpdatePost from "./components/admin/UpdatePost";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/posts",
        element: <Posts />,
      },
      {
        path: "/post/:postId",
        element: <Post />,
        children: [
          {
            path: "comment",
            element: <PersistLogin />,
            children: [
              {
                element: <RequireAuth allowedUserTypes={[1987]} />,
                children: [
                  {
                    path: "new",
                    element: <NewComment />,
                  },
                  {
                    path: ":commentId/update",
                    element: <UpdateComment />,
                  },
                  {
                    path: ":commentId/delete",
                    element: <DeleteComment />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
      {
        path: "/register",
        element: <Registration />,
      },
      {
        element: (
          <PersistLogin />
        ),
        children: [
          {
            element: <RequireAuth allowedUserTypes={[1987]} />,
            children: [
              {
                path: "/user/:userId",
                element: <UserProfile />,
              },
              {
                path: "/user/:userId/update",
                element: <UpdateUserProfile />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/admin/*",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <AdminLogin />,
      },
      {
        element: (
          <PersistLogin />
        ),
        children: [
          {
            element: <RequireAuth allowedUserTypes={[5150,1988]} />,
            children: [
              {
                path: "dashboard",
                element: <Dashboard />,
                children: [
                  {
                    path: "",
                    element: <BlogPosts />
                  },
                  {
                    path: ":postId/comments",
                    element: <AdminComments />,
                    children: [
                      {
                        path: ":commentId",
                        element: <AdminComment />
                      },
                      {
                        path: ":commentId/delete",
                      }
                    ]
                  },
                  {
                    path: "users",
                    element: <Users />,
                    children: [
                      {
                        path: ":userId/update"
                      }
                    ]
                  },
                  {
                    path: "newpost",
                    element: <NewPost />
                  }
              ]
              },
              {
                path: "post/:postId/update",
                element: <UpdatePost />
              },
              {
                path: "logout",
                element: <Logout />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Missing />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
