import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div>
      <h2>Oops! An error has occurred.</h2>
      <p>Return to <Link to="/home">Home</Link></p>
    </div>
  )
}

export default ErrorPage