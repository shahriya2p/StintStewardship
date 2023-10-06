import React, { useEffect, useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { gql, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import './AddTask.css';

const addPersonalTask = gql`
  mutation CreateTaskForPersonal(
    $createForPersonalUse: CreateCustomTasksType!
  ) {
    createTaskForPersonal(createForPersonalUse: $createForPersonalUse) {
      alloted_user
      content
      task_name
      deadline
      tasks_id
      username
    }
  }
`;

const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));
const AddTask = ({ setDemo, todoData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState('');
  const [taskName, setTaskName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [content, setContent] = useState('');
  const [addPerTask, { error, loading }] = useMutation(addPersonalTask);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      const payloadbase = parts[1];
      const payload = JSON.parse(atob(payloadbase));
      localStorage.setItem('user-role', payload.role);
      setUsername(payload.username);
    }
  }, []);
  const handleAddSubmit = (e) => {
    e.preventDefault();
    addPerTask({
      variables: {
        createForPersonalUse: {
          deadline: deadline,
          task_name: taskName,
          username: username,
          content: content,
        },
      },
    })
      .then((response) => {
        setDeadline('');
        setTaskName('');
        setContent('');
        wait().then(() => {
          todoData.refetch();
          setOpen(false);
        });
        setDemo((prev) => !prev);
        enqueueSnackbar(`Task ${taskName} Added! 👍🏻`, {
          style: { background: 'green' },
        });
      })
      .catch((err) => {
        enqueueSnackbar(`${err.message}`, {
          style: { background: 'red' },
        });
      });
  };
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        <button className='Button violet'>Add Task</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className='AlertDialogOverlay' />
        <AlertDialog.Content className='AlertDialogContent'>
          <AlertDialog.Title className='AlertDialogTitle'>
            <center>
              Add A Personal Task For Yourself
              <hr />
            </center>
          </AlertDialog.Title>
          <AlertDialog.Description className='AlertDialogDescription'>
            <form>
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
                  <label>Content</label>
                  <input
                    type='text'
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
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
                <AlertDialog.Cancel asChild>
                  <button className='Button mauve' type='reset'>
                    Cancel
                  </button>
                </AlertDialog.Cancel>
                <button
                  className='Button red'
                  type='submit'
                  onClick={handleAddSubmit}
                >
                  {loading ? 'Adding' : 'Add'}
                </button>
              </div>
            </form>
          </AlertDialog.Description>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default AddTask;
