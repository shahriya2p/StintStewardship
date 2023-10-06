import React, { useEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import './SearchPanel.css';

const searchData = gql`
  query SearchTasks(
    $searchPersonalTasksTaskName2: String!
    $taskName: String!
    $username: String!
    $searchTasksUsername2: String!
  ) {
    searchTasks(taskName: $taskName, username: $searchTasksUsername2) {
      task_name
      subject_code
      semester
      deadline
      created_date
      teacher
    }
    searchPersonalTasks(
      taskName: $searchPersonalTasksTaskName2
      username: $username
    ) {
      task_name
      deadline
      created_date
      username
      content
    }
  }
`;
const SearchPanel = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [sData, { data }] = useLazyQuery(searchData);
  useEffect(() => {
    const role1 = localStorage.getItem('user-role');
    if (role1) {
      setRole(role1);
    }
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      const payloadbase = parts[1];
      const payload = JSON.parse(atob(payloadbase));
      setName(payload.username);
    }
  }, []);
  return (
    <div style={{ display: 'grid', placeItems: 'center' }}>
      <div className='search'>
        <button
          className='icon'
          onClick={() => {
            sData({
              variables: {
                taskName: search,
                searchPersonalTasksTaskName2: search,
                username: name,
                searchTasksUsername2: name,
              },
            });
          }}
        >
          <svg
            width='22'
            height='22'
            viewBox='0 0 22 22'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M9.2709 18.1429C13.8388 18.1429 17.5418 14.3053 17.5418 9.57143C17.5418 4.83756 13.8388 1 9.2709 1C4.70301 1 1 4.83756 1 9.57143C1 14.3053 4.70301 18.1429 9.2709 18.1429Z'
              stroke='black'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M15.4741 16L20.2988 21'
              stroke='black'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
        {role === 'student' && (
          <input
            type='search'
            placeholder='Search For Tasks'
            value={search}
            onChange={(e) => {
              sData({
                variables: {
                  taskName: e.target.value,
                  searchPersonalTasksTaskName2: e.target.value,
                  username: name,
                  searchTasksUsername2: name,
                },
              });
              setSearch(e.target.value);
            }}
            className='inp'
          ></input>
        )}
        {role === 'teacher' && (
          <input
            type='search'
            placeholder='Search'
            onChange={() => {
              // setSearch(e.target.value);
            }}
            className='inp'
          ></input>
        )}
      </div>
      {search && data && (
        <div className='search-result'>
          {data.searchTasks &&
            data.searchTasks.map((task) => {
              return (
                <div key={task.task_name} className='search-result-list'>
                  {task.task_name}
                </div>
              );
            })}
          {data.searchPersonalTasks &&
            data.searchPersonalTasks.map((task) => {
              return (
                <div key={task.task_name} className='search-result-list'>
                  {task.task_name}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
