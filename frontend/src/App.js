import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './components/LoginPage'
import Signup from './components/SignupPage'
import Home from './components/HomePage'
import Profile from './components/ProfilePage'

function App() {

  const [error, setError] = useState("");

  const signupReq = details => {
    console.log(details)
  }
  
  return (
    <Router>
    <div className="App">
      <header className="App-header">
          <Routes>
          <Route exact path="/" element={ <Home/> }>
          </Route>
          <Route exact path="/login" element={ <Login/> }>
          </Route>
          <Route exact path="/signup" element={ <Signup Signup = {signupReq} error={error}/> }>
          </Route>
          <Route exact path="/profile" element={ <Profile/> }>
          </Route>
          </Routes>
      </header>
    </div>
    </Router>
  );
}

export default App;
