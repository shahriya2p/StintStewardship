import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
} from 'recharts';

import { useSnackbar } from 'notistack';
import './Home.css';
const GET_USER = gql`
  query GetStudentByUsername($getStudentByName: String!) {
    getStudentByUsername(getStudentByName: $getStudentByName) {
      stud_name
    }
  }
`;
const GET_TEACHER = gql`
  query GetTeacher($username: String!) {
    getTeacher(username: $username) {
      teacher_id
      teacher_name
      teacher_subject
      assigned_tasks
      personalTasks {
        completed
        executing
        finished
        review
        todo
      }
    }
  }
`;
const countAll = gql`
  query Query($username: String!) {
    getAllCount(username: $username)
  }
`;

const getRecent = gql`
  query Query($username: String!) {
    getRecent(username: $username)
  }
`;

const countTeacher = gql`
  query Query($username: String!) {
    getCountOfTeacherPersonalTasks(username: $username)
  }
`;

const getRecentTeacher = gql`
  query Query($username: String!) {
    getRecentTeacher(username: $username)
  }
`;

const Home = () => {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [countAData, setCountA] = useState('');
  const [recent, setRecent] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const getNameQuery = useQuery(GET_USER, {
    variables: { getStudentByName: name },
  });
  const countT = useQuery(countTeacher, {
    variables: {
      username: name,
    },
  });
  const getRecentT = useQuery(getRecentTeacher, {
    variables: {
      username: name,
    },
  });
  const getTeacherQuery = useQuery(GET_TEACHER, {
    variables: {
      username: name,
    },
  });
  const countAllData = useQuery(countAll, {
    variables: {
      username: name,
    },
  });
  const getRecentData = useQuery(getRecent, {
    variables: {
      username: name,
    },
  });

  useEffect(() => {
    const action = (snackbarId) => (
      <button
        style={{
          textDecoration: 'none',
          background: 'transparent',
          border: 0,
          display: 'flex',
        }}
        onClick={() => {
          closeSnackbar(snackbarId);
        }}
      >
        <p style={{ textDecoration: 'underline black', paddingTop: 15 }}>
          Dismiss
        </p>
      </button>
    );
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      const payloadbase = parts[1];
      const payload = JSON.parse(atob(payloadbase));
      setName(payload.username);
      setRole(payload.role);
      const data = getNameQuery.data;
      if (data) {
        setDisplayName(data.getStudentByUsername.stud_name);
        enqueueSnackbar(`Hello! ${data.getStudentByUsername.stud_name}! 👋🏻`, {
          action,
          variant: 'success',
          autoHideDuration: 5000,
          preventDuplicate: true,
          style: { background: 'green' },
        });
      }
    }
    if (role === 'student') {
      if (countAllData.data) {
        let num = 0;
        const countall = countAllData.data.getAllCount.map((arr) => {
          num++;
          if (num === 1) {
            const numb = arr.map((number) => {
              return number;
            });
            return {
              name: 'Todo',
              uv: numb[0],
              pv: numb[1],
              amt: numb[0] + numb[1],
            };
          } else if (num === 2) {
            const numb = arr.map((number) => {
              return number;
            });
            return {
              name: 'Executing',
              uv: numb[0],
              pv: numb[1],
              amt: numb[0] + numb[1],
            };
          } else if (num === 3) {
            const numb = arr.map((number) => {
              return number;
            });
            return {
              name: 'Completed',
              uv: numb[0],
              pv: numb[1],
              amt: numb[0] + numb[1],
            };
          } else if (num === 4) {
            const numb = arr.map((number) => {
              return number;
            });
            return {
              name: 'Review',
              uv: numb[0],
              pv: numb[1],
              amt: numb[0] + numb[1],
            };
          } else if (num === 5) {
            const numb = arr.map((number) => {
              return number;
            });
            return {
              name: 'Finished',
              uv: numb[0],
              pv: numb[1],
              amt: numb[0] + numb[1],
            };
          } else {
            return null;
          }
        });
        setCountA(countall);
      }
      if (getRecentData.data) {
        const rec = getRecentData.data.getRecent.map((tasks) => {
          return tasks;
        });
        setRecent(rec);
      }
    }
    if (role === 'teacher') {
      if (getTeacherQuery.data) {
        const teacher = getTeacherQuery.data.getTeacher.teacher_name;
        setDisplayName(teacher);
        enqueueSnackbar(
          `Hello! ${getTeacherQuery.data.getTeacher.teacher_name}! 👋🏻`,
          {
            action,
            autoHideDuration: 5000,
            preventDuplicate: true,
            style: { background: 'green' },
          }
        );
      }
      if (countT.data) {
        let num = 0;
        const c = countT.data.getCountOfTeacherPersonalTasks.map((task) => {
          num++;
          if (num === 1) {
            return { name: `ToDo`, value: task };
          } else if (num === 2) {
            return { name: `Executing`, value: task };
          } else if (num === 3) {
            return { name: `Completed`, value: task };
          } else if (num === 4) {
            return { name: `Review`, value: task };
          } else if (num === 5) {
            return { name: `Finished`, value: task };
          } else {
            return null;
          }
        });
        setCountA(c);
      }
      if (getRecentT.data) {
        const rec = getRecentT.data.getRecentTeacher.map((tasks) => {
          return tasks;
        });
        setRecent(rec);
      }
    }
  }, [
    enqueueSnackbar,
    getNameQuery,
    countT,
    closeSnackbar,
    countAllData.data,
    getRecentT,
    getRecentData.data,
    getTeacherQuery,
    role,
  ]);
  return (
    <div className='home-class'>
      {name && (
        <div className='home-greet'>
          <h5>Hello! {displayName && `${displayName}!`}</h5>
        </div>
      )}
      {name && (
        <div className='get-started'>
          <h6 style={{ paddingTop: 10 }}>Getting Started</h6>
          <hr style={{ width: 'auto', height: 3, background: 'black' }} />
          <ul style={{ alignContent: 'end' }}>
            {role === 'student' && (
              <>
                <li>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      nav('/tasks');
                    }}
                    style={{
                      background: 'transparent',
                      border: 0,
                      textDecoration: 'underline black',
                    }}
                  >
                    Check Your School Tasks!
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      nav('/activities');
                    }}
                    style={{
                      background: 'transparent',
                      border: 0,
                      textDecoration: 'underline black',
                    }}
                  >
                    Keep Up Your Activity!
                  </button>
                </li>
              </>
            )}
            <li>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  nav('/personal');
                }}
                style={{
                  background: 'transparent',
                  border: 0,
                  textDecoration: 'underline black',
                }}
              >
                Work On Your Tasks!
              </button>
            </li>
          </ul>
        </div>
      )}
      {name && (
        <div className='home-activity'>
          <h6 style={{ paddingTop: 10 }}>Your Activity</h6>
          <hr style={{ width: 'auto', height: 3, background: 'black' }} />
          {role === 'student' && (
            <ComposedChart
              layout='vertical'
              width={400}
              height={400}
              data={countAData}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 30,
              }}
            >
              <CartesianGrid stroke='#f5f5f5' />
              <XAxis type='number' />
              <YAxis dataKey='name' type='category' scale='band' />
              <Tooltip />
              <Legend />
              <Area dataKey='amt' fill='#8884d8' stroke='#8884d8' />
              <Bar dataKey='pv' barSize={20} fill='#413ea0' />
              <Line dataKey='uv' stroke='#ff7300' />
            </ComposedChart>
          )}
          {role === 'teacher' && (
            <PieChart width={1000} height={400}>
              <Pie
                dataKey='value'
                isAnimationActive={false}
                data={countAData}
                cx={240}
                cy={200}
                outerRadius={80}
                fill='#8884d8'
                label
              />

              <Tooltip />
            </PieChart>
          )}
        </div>
      )}

      {name && (
        <div className='home-task'>
          <h6 style={{ paddingTop: 10 }}>Recent Tasks</h6>
          <hr style={{ width: 'auto', height: 3, background: 'black' }} />
          <ol>
            {recent &&
              recent.map((task) => (
                <li className='recent-list' key={`${task}`}>
                  {task}
                </li>
              ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default Home;
