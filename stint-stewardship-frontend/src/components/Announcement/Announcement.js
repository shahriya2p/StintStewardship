import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';

import './../Body/Tasks/Body.css';

const teacher = gql`
  query GetTeacher($username: String!) {
    getTeacher(username: $username) {
      assigned_tasks
      personalTasks {
        completed
        executing
        finished
        review
        todo
      }
      subject_code
      teacher_name
      teacher_subject
      teacher_id
    }
  }
`;

const announce = gql`
  mutation BroadcastBasedOnSem($enterMessageAndSem: BroadcastInput!) {
    broadcastBasedOnSem(EnterMessageAndSem: $enterMessageAndSem)
  }
`;

const Announcement = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState('');
  const [sem, setSem] = useState('');
  const [mess, setMess] = useState('');
  const [tName, setTName] = useState('');
  const teacherData = useQuery(teacher, {
    variables: {
      username: name,
    },
  });
  const [announcment, { loading }] = useMutation(announce);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      const payloadbase = parts[1];
      const payload = JSON.parse(atob(payloadbase));
      setName(payload.username);
    }
    if (teacherData.data) {
      setTName(teacherData.data.getTeacher.teacher_name);
    }
  }, [teacherData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    announcment({
      variables: {
        enterMessageAndSem: {
          name_of_teacher: tName,
          semester: +sem,
          message: mess,
        },
      },
    })
      .then((res) => {
        enqueueSnackbar(`${res.data.broadcastBasedOnSem}`, {
          style: { background: 'green' },
        });
        setSem('');
        setMess('');
      })
      .catch((err) => {
        enqueueSnackbar(`${err.message}`, {
          style: {
            background: 'red',
          },
        });
      });
  };
  return (
    <div className='body'>
      <div className='announce-title'>{`Greetings ${tName}! Make An Announcement`}</div>
      <div>
        <form
          style={{
            position: 'absolute',
            top: 100,
            padding: 10,
            height: 260,
            opacity: '90%',
            background: 'black',
            left: 590,
            borderRadius: 20,
            boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.3)',
          }}
          onSubmit={handleSubmit}
        >
          <div className='new-expense__control'>
            <label style={{ color: '#ee9b00', opacity: '80%' }}>Semester</label>
            <input
              type='number'
              onChange={(e) => setSem(e.target.value)}
              value={sem}
              required
            />
          </div>
          <br />
          <div className='new-expense__control'>
            <label style={{ color: '#ee9b00', opacity: '80%' }}>Message</label>
            <input
              type='text'
              onChange={(e) => setMess(e.target.value)}
              value={mess}
              required
            />
          </div>
          <div
            style={{
              display: 'flex',
              gap: 25,
              justifyContent: 'center',
              paddingTop: 20,
            }}
          >
            <button className='Button red' type='submit' style={{ right: 50 }}>
              {loading ? 'Sending' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Announcement;
