import './App.css';
import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Tasks from './components/Body/Tasks/Tasks';
import Menu from './components/Menu/Menu';
import Navbar from './components/Navigation/Navbar';
import Home from './components/Body/Home/Home';
import PersonalWorkspace from './components/Body/PersonalWorkspace/PersonalWorkspace';
import Activity from './components/Body/Activity/Activity';
import Login from './components/Body/Login/Login';
import SignUp from './components/Body/SignUp/SignUp';
import Footer from './components/Footer/Footer';
import { useMutation, gql } from '@apollo/client';
import AddSchoolTask from './components/Body/AddSchoolTask/AddSchoolTask';
import Announcement from './components/Announcement/Announcement';
import Review from './components/Body/Review/Review';
const LOGIN_MUTATION = gql`
  mutation UserLogin($loginUserInput: UserLoginInput!) {
    userLogin(loginUserInput: $loginUserInput) {
      accessToken
    }
  }
`;

function App() {
  const { enqueueSnackbar } = useSnackbar();

  const [isExpanded, setIsExpanded] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [userLogin, userLoginMessage] = useMutation(LOGIN_MUTATION);
  const [state, setState] = useState({
    role: '',
    username: '',
    password: '',
  });
  const nav = useNavigate();
  const [role, setRole] = useState();
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      const payloadbase = parts[1];
      const payload = JSON.parse(atob(payloadbase));
      localStorage.setItem('user-role', payload.role);
      setRole(payload.role);
    }
  }, [role, token]);
  const handleLogout = (e) => {
    e.preventDefault();
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user-role');
    enqueueSnackbar(`Logged Out! 💤`, {
      style: { background: 'red' },
    });
    nav('/login');
  };
  const handle = () => {
    setIsExpanded(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    userLogin({
      variables: { loginUserInput: state },
    })
      .then((response) => {
        if (response) {
          localStorage.setItem(
            'authToken',
            response.data.userLogin.accessToken
          );
          setToken(response.data.userLogin.accessToken);
          setState({
            username: '',
            password: '',
            role: '',
          });
          enqueueSnackbar('Login Was Successfull! 🥳', {
            style: { background: 'green' },
          });
          nav('/home');
        }
      })
      .catch((error) => {
        if (error?.message) {
          const errorMessage = error.message;
          const graphQLErrors = userLoginMessage?.error?.graphQLErrors;
          if (graphQLErrors && graphQLErrors.length > 0) {
            const validationErrors =
              graphQLErrors[0]?.extensions?.originalError?.message;

            if (validationErrors) {
              enqueueSnackbar(`${validationErrors} 🥶`, {
                style: { background: 'red' },
              });
            } else {
              enqueueSnackbar(`${errorMessage} 🥶`, {
                style: { background: 'red' },
              });
            }
          }
        }
      });
  };
  const onChangeHandler = (e) => {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.id]: value,
    });
  };

  return (
    <div className='App' onClick={handle}>
      <Navbar
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        token={token}
      />

      {token && (
        <Menu
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          onLogout={handleLogout}
        />
      )}

      <Routes>
        <Route path='/home' element={<Home state={state} />} />
        <Route
          path='/tasks'
          element={
            <Tasks isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          }
        />
        <Route
          path='/personal'
          element={
            <PersonalWorkspace
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />
          }
        />
        <Route path='/activities' element={<Activity />} />
        <Route path='/addTask' element={<AddSchoolTask />} />
        <Route path='/review' element={<Review />} />
        <Route path='/announce' element={<Announcement />} />
        <Route
          path='/login'
          element={
            <Login
              handleSubmit={handleSubmit}
              onChangeHandler={onChangeHandler}
              state={state}
              loading={userLoginMessage.loading}
            />
          }
        />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/' element={<Navigate replace to='/login' />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
