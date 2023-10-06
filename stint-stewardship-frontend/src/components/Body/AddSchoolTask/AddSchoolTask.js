import React, { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';

import './AddSchoolTask.css';

const addSchoolTask = gql`
  mutation CreateTask($createTasksType: CreateTasksType!) {
    createTask(createTasksType: $createTasksType) {
      alloted_students
      deadline
      semester
      subject_code
      task_name
      tasks_id
      teacher
    }
  }
`;
const tasks = gql`
  query GetTasksByTeacher($getTasks: String!) {
    getTasksByTeacher(getTasks: $getTasks) {
      alloted_students
      deadline
      semester
      subject_code
      task_name
      tasks_id
      teacher
    }
  }
`;
const deleteTask = gql`
  mutation DeleteTask($deleteTaskId: String!) {
    deleteTask(id: $deleteTaskId)
  }
`;
const AddSchoolTask = () => {
  const [taskName, setTaskName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [delTasks, setDelTasks] = useState('');
  const [demo, setDemo] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [sem, setSem] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [addTData, { loading, error }] = useMutation(addSchoolTask);
  const tasksData = useQuery(tasks, {
    variables: {
      getTasks: name,
    },
  });
  const [deleteT] = useMutation(deleteTask);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      const payloadbase = parts[1];
      const payload = JSON.parse(atob(payloadbase));
      localStorage.setItem('user-role', payload.role);
      setName(payload.username);
    }
    if (tasksData.data) {
      const tasks = tasksData.data.getTasksByTeacher.map((task) => {
        return task;
      });
      setDelTasks(tasks);
    }
    tasksData.refetch();
  }, [tasksData, demo]);
  const handleAddSubmit = (e) => {
    e.preventDefault();
    addTData({
      variables: {
        createTasksType: {
          deadline,
          semester: +sem,
          subject_code: +code,
          task_name: taskName,
        },
      },
    })
      .then((response) => {
        if (response.data.createTask) {
          enqueueSnackbar('Task Created Successfully! 📃', {
            style: { background: 'green' },
          });
        } else {
          enqueueSnackbar('An Error Occured! ⛔', {
            style: { background: 'red' },
          });
        }
        setDemo((prev) => !prev);
        setCode('');
        setDeadline('');
        setSem('');
        setTaskName('');
      })
      .catch((err) => {
        enqueueSnackbar(`${err.message}`, {
          style: { background: 'red' },
        });
      });
  };
  const handleDelete = (id, name) => {
    deleteT({
      variables: {
        deleteTaskId: id,
      },
    })
      .then((response) => {
        if (response) {
          setDemo((prev) => !prev);
          enqueueSnackbar(`Task : ${name} has been deleted! 🚮`, {
            style: { color: 'white', background: 'red' },
          });
        }
      })
      .catch((err) => {
        
      });
  };
  return (
    <div className='add-school-task'>
      <div className='task-sch-title'>
        <h6>Add A Task For Students</h6>
      </div>
      <div>
        <form
          style={{
            position: 'absolute',
            display: 'grid',
            top: 100,
            padding: 10,
            background: 'lightyellow',
            left: 150,
            borderRadius: 20,
            height: 150,
            boxShadow: '0 2px 10px var(--blackA7)',
          }}
        >
          <div className='new-expense__controls'>
            <div className='new-expense__control'>
              <label>Task Name</label>
              <input
                type='text'
                onChange={(e) => setTaskName(e.target.value.trimStart())}
                value={taskName}
                required
              />
            </div>
            <div className='new-expense__control'>
              <label>Deadline</label>
              <input
                type='date'
                min='2022-06-09'
                max='2030-12-31'
                onChange={(e) => setDeadline(e.target.value)}
                value={deadline}
                required
              />
            </div>
            <div className='new-expense__control'>
              <label>Subject Code</label>
              <input
                type='number'
                onChange={(e) => setCode(e.target.value)}
                value={code}
                required
              />
            </div>
            <div className='new-expense__control'>
              <label>Semester</label>
              <input
                type='number'
                onChange={(e) => setSem(e.target.value)}
                value={sem}
                required
              />
            </div>
          </div>
          <center>
            {error && <p style={{ color: 'red' }}>{error.message}</p>}
          </center>

          <div
            style={{
              display: 'flex',
              gap: 25,
              justifyContent: 'center',
              paddingTop: 20,
            }}
          >
            <button
              className='Button red'
              type='submit'
              style={{ top: 100, right: 20 }}
              onClick={handleAddSubmit}
            >
              {loading ? 'Adding' : 'Add'}
            </button>
          </div>
        </form>
      </div>
      <div
        style={{
          background: 'black',
          color: '#ee9b00',
          padding: 10,
          width: 1000,
          right: 10,
          left: 300,

          position: 'absolute',
          bottom: 300,
          borderRadius: 20,
          overflowY: 'auto',
          height: 300,
          boxShadow: '10px 10px 10px var(--blackA7)',
        }}
      >
        {delTasks &&
          delTasks.map((task) => (
            <div
              className='list-tasks'
              key={task.tasks_id}
              style={{
                background: 'black',
                borderRadius: 5,
                padding: 5,
                gap: 10,
                opacity: '100%',
                display: 'flex',
                marginBottom: 10,
              }}
              onClick={() => handleDelete(task.tasks_id, task.task_name)}
            >
              {task.task_name}

              <button
                style={{
                  textDecoration: 'none',
                  background: 'transparent',
                  border: 0,
                  position: 'absolute',
                  right: 5,
                }}
              >
                🗑️
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddSchoolTask;
