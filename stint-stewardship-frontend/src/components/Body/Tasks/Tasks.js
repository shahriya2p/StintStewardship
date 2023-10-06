import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useQuery, gql, useMutation, useLazyQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';

import './Body.css';
const stud_roll = gql`
  query GetStudentByUsername($getStudentByName: String!) {
    getStudentByUsername(getStudentByName: $getStudentByName) {
      stud_roll
    }
  }
`;
const todoTasks = gql`
  query GetAllTodoOfStudent($userName: String!) {
    getAllTodoOfStudent(userName: $userName) {
      task_name
      deadline
      created_date
      subject_code
      tasks_id
    }
  }
`;

const executingTasks = gql`
  query Query($userName: String!) {
    getAllExecutingOfStudent(userName: $userName) {
      tasks_id
      task_name
      deadline
      created_date
    }
  }
`;

const reviewTasks = gql`
  query Query($userName: String!) {
    getAllReviewOfStudent(userName: $userName)
  }
`;

const finishedTasks = gql`
  query Query($userName: String!) {
    getAllFinishedOfStudent(userName: $userName)
  }
`;

const moveTaskToExecuting = gql`
  mutation MoveTaskToExecuting($moveToExecution: MoveToStatusInput!) {
    moveTaskToExecuting(moveToExecution: $moveToExecution)
  }
`;
const moveTaskToCompleted = gql`
  mutation MoveTaskToCompleted($moveToCompleted: MoveToStatusInput!) {
    moveTaskToCompleted(moveToCompleted: $moveToCompleted)
  }
`;
const moveTaskToTodo = gql`
  mutation MoveTaskToTodo($moveToTodo: MoveToStatusInput!) {
    moveTaskToTodo(moveToTodo: $moveToTodo)
  }
`;

const completedTasks = gql`
  query GetAllCompletedOfStudent($userName: String!) {
    getAllCompletedOfStudent(userName: $userName) {
      tasks_id
      task_name
      deadline
      created_date
    }
  }
`;
const getFile = gql`
  query GetFile($cred: FileInput!) {
    getFile(Cred: $cred) {
      fileName
      file_id
      stud_id
      task_Name
      type
    }
  }
`;
const getItemStyle = (isDragging, draggableStyle, expanded) => ({
  userSelect: 'none',
  padding: 16,
  height: expanded && 'auto',
  margin: '0 0 8px 0',
  background: isDragging ? 'orange' : '#E6FFFD',
  transition: 'height 0.5s ease',
  boxShadow: '0 0 5px 1px rgba(0, 0, 0, 0.3)',
  ...draggableStyle,
});

const Tasks = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState('');
  const todoData = useQuery(todoTasks, {
    variables: { userName: name },
  });
  const rollNo = useQuery(stud_roll, {
    variables: { getStudentByName: name },
  });
  const completedData = useQuery(completedTasks, {
    variables: { userName: name },
  });
  const executingData = useQuery(executingTasks, {
    variables: { userName: name },
  });
  const reviewData = useQuery(reviewTasks, {
    variables: { userName: name },
  });
  const finishedData = useQuery(finishedTasks, {
    variables: { userName: name },
  });
  const [getF, { data }] = useLazyQuery(getFile);
  const [taskToExecuting] = useMutation(moveTaskToExecuting);
  const [taskToTodo] = useMutation(moveTaskToTodo);
  const [taskToCompleted] = useMutation(moveTaskToCompleted);

  const [role, setRole] = useState('');
  const [roll, setRoll] = useState('');
  const [items, setItems] = useState([]);
  const [items1, setItems1] = useState([]);
  const [items2, setItems2] = useState([]);
  const [items3, setItems3] = useState([]);
  const [items4, setItems4] = useState([]);
  const { setIsExpanded } = props;
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      const payloadbase = parts[1];
      const payload = JSON.parse(atob(payloadbase));
      setName(payload.username);
      localStorage.setItem('user-role', payload.role);
      setRole(payload.role);
    }
    setIsMounted(true);
    if (todoData.data) {
      const tododata1 = todoData.data.getAllTodoOfStudent.map((task) => {
        return {
          id: `item-${task.tasks_id}`,
          content: `${task.task_name}`,
          created_date: task.created_date,
          subject: task.subject_code,
          deadline: task.deadline,
          expanded: false,
        };
      });
      setItems(tododata1);
    }
    if (completedData.data) {
      const completedData1 = completedData.data.getAllCompletedOfStudent.map(
        (task) => {
          return {
            id: `item-${task.tasks_id}`,
            content: `${task.task_name}`,
            created_date: task.created_date,
            subject: task.subject_code,
            deadline: task.deadline,
            expanded: false,
          };
        }
      );
      setItems1(completedData1);
    }
    if (executingData.data) {
      const executingData1 = executingData.data.getAllExecutingOfStudent.map(
        (task) => {
          return {
            id: `item-${task.tasks_id}`,
            content: `${task.task_name}`,
            created_date: task.created_date,
            subject: task.subject_code,
            deadline: task.deadline,
            expanded: false,
          };
        }
      );
      setItems2(executingData1);
    }
    if (reviewData.data) {
      const reviewData1 = reviewData.data.getAllReviewOfStudent.map((task) => {
        return { id: `item-${task}`, content: `${task}`, expanded: false };
      });
      setItems3(reviewData1);
    }
    if (finishedData.data) {
      const finishedData1 = finishedData.data.getAllFinishedOfStudent.map(
        (task) => {
          return { id: `item-${task}`, content: `${task}` };
        }
      );
      setItems4(finishedData1);
    }
    if (rollNo.data) {
      setRoll(+rollNo.data.getStudentByUsername.stud_roll);
    }
  }, [
    todoData,
    completedData,
    executingData,
    reviewData,
    finishedData,
    rollNo,
  ]);

  const getDroppableItems = (droppableId) => {
    switch (droppableId) {
      case 'droppable':
        return items;
      case 'droppable-2':
        return items1;
      case 'droppable-1':
        return items2;
      case 'droppable-3':
        return items3;
      case 'droppable-4':
        return items4;
      default:
        return [];
    }
  };

  const isDragDisabled = role === 'student';
  const isDropDisabled = role === 'student';

  const updateDroppableItems = (droppableId, items) => {
    switch (droppableId) {
      case 'droppable':
        setItems(items);
        break;
      case 'droppable-2':
        setItems1(items);
        break;
      case 'droppable-1':
        setItems2(items);
        break;
      case 'droppable-3':
        setItems3(items);
        break;
      case 'droppable-4':
        setItems4(items);
        break;
      default:
        break;
    }
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) {
      enqueueSnackbar('Cannot Drop There! ☠️', {
        style: { background: 'red' },
      });
      return;
    }

    const sourceDroppableId = source.droppableId;
    const destinationDroppableId = destination.droppableId;

    if (sourceDroppableId === destinationDroppableId) {
      const droppableItems = [...getDroppableItems(sourceDroppableId)];
      const [removed] = droppableItems.splice(source.index, 1);
      droppableItems.splice(destination.index, 0, removed);
      updateDroppableItems(sourceDroppableId, droppableItems);
    } else {
      const sourceItems = [...getDroppableItems(sourceDroppableId)];
      const destinationItems = [...getDroppableItems(destinationDroppableId)];
      const [removed] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, removed);
      if (destinationDroppableId === 'droppable-1') {
        taskToExecuting({
          variables: {
            moveToExecution: {
              task_name: removed.content,
              student_roll: roll,
            },
          },
        })
          .then((response) => {
            if (response) {
              console.log(response.data.moveTaskToExecuting);
              if (response.data.moveTaskToExecuting) {
                enqueueSnackbar('Switched Task To Executing! ⚙️', {
                  style: { background: 'Purple' },
                });
              } else {
                enqueueSnackbar('Try That Again! 😣', {
                  style: { background: 'red' },
                });
              }
            }
          })
          .catch((error) => {
          
          });
      } else if (destinationDroppableId === 'droppable') {
        taskToTodo({
          variables: {
            moveToTodo: {
              student_roll: roll,
              task_name: removed.content,
            },
          },
        })
          .then((response) => {
            if (response) {
              console.log(response.data.moveTaskToTodo);
              if (response.data.moveTaskToTodo) {
                enqueueSnackbar('Switched Task To ToDo! ⚙️', {
                  style: { background: 'Purple' },
                });
              } else {
                enqueueSnackbar('Try That Again! 😣', {
                  style: { background: 'red' },
                });
              }
            }
          })
          .catch((error) => {
            
          });
      } else if (destinationDroppableId === 'droppable-2') {
        taskToCompleted({
          variables: {
            moveToCompleted: {
              student_roll: roll,
              task_name: removed.content,
            },
          },
        })
          .then((response) => {
            if (response) {
              console.log(response.data.moveTaskToCompleted);
              if (response.data.moveTaskToCompleted) {
                enqueueSnackbar('Switched Task To Completed! ⚙️', {
                  style: { background: 'Purple' },
                });
              } else {
                enqueueSnackbar('Try That Again! 😣', {
                  style: { background: 'red' },
                });
              }
            }
          })
          .catch((error) => {
           
          });
      }
      updateDroppableItems(sourceDroppableId, sourceItems);
      updateDroppableItems(destinationDroppableId, destinationItems);
    }
  };

  const handle = () => {
    setIsExpanded(false);
  };
  const handleClick = (arrayName, itemId) => {
    switch (arrayName) {
      case 'array-1':
        setItems((prevArr) => {
          const updatedArray = prevArr.map((item) => {
            if (item.id === itemId) {
              getF({
                variables: {
                  cred: {
                    stud_id: name,
                    task_name: item.content,
                  },
                },
              });
              return {
                ...item,
                expanded: !item.expanded,
              };
            }
            return item;
          });
          return updatedArray;
        });
        break;
      case 'array-2':
        setItems2((prevArr) => {
          const updatedArray = prevArr.map((item) => {
            if (item.id === itemId) {
              getF({
                variables: {
                  cred: {
                    stud_id: name,
                    task_name: item.content,
                  },
                },
              });
              return {
                ...item,
                expanded: !item.expanded,
              };
            }
            return item;
          });
          return updatedArray;
        });
        break;
      case 'array-3':
        setItems1((prevArr) => {
          const updatedArray = prevArr.map((item) => {
            if (item.id === itemId) {
              getF({
                variables: {
                  cred: {
                    stud_id: name,
                    task_name: item.content,
                  },
                },
              });
              return {
                ...item,
                expanded: !item.expanded,
              };
            }
            return item;
          });
          return updatedArray;
        });
        break;
      case 'array-4':
        setItems3((prevArr) => {
          const updatedArray = prevArr.map((item) => {
            if (item.id === itemId) {
              getF({
                variables: {
                  cred: {
                    stud_id: name,
                    task_name: item.content,
                  },
                },
              });
              return {
                ...item,
                expanded: !item.expanded,
              };
            }
            return item;
          });
          return updatedArray;
        });
        break;
      default:
        break;
    }
  };
  const fileInputRef = useRef(null);

  const handleButtonClick = (task_name) => {
    fileInputRef.current.click();
    fileInputRef.current.addEventListener('change', (event) =>
      handleFileChange(event, task_name)
    );
  };
  const handleFileChange = async (event, task_name) => {
    const selectedFile = event.target.files[0];
    const form = new FormData();
    form.append('file', selectedFile);
    form.append('taskName', task_name);
    form.append('stud_Id', name);
    form.append('type', 'school');
    try {
      const response = await fetch('http://localhost:3001/students/upload', {
        method: 'POST',
        body: form,
      });
      if (response) {
        enqueueSnackbar(`File ${selectedFile.name} Uploaded Successfully! 📁`, {
          style: { background: 'green' },
        });
      }
    } catch (err) {
      enqueueSnackbar(`${err}`, {
        style: { background: 'red' },
      });
    }
    console.log(selectedFile, task_name);
  };
  return (
    <div className='body' onClick={handle}>
      <div className='title-for-page'>Your School Tasks</div>

      <div className='dndcontext'>
        <DragDropContext onDragEnd={onDragEnd} enableDefaultSensors>
          {isMounted ? (
            <div className='drop'>
              <Droppable droppableId='droppable'>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: `${
                        snapshot.isDraggingOver ? 'lightblue' : '#F6FA70'
                      }`,
                      position: 'absolute',
                      left: 140,
                      top: 70,
                      borderRadius: 10,
                      padding: 8,
                      width: 250,
                      minHeight: 50,
                      boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <h4 className='task-status-name'>To-Do</h4>

                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className='card'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleClick('array-1', item.id)}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                              item.expanded
                            )}
                          >
                            {item.content}
                            {item.expanded && (
                              <>
                                <hr
                                  style={{
                                    border: 'none',
                                    height: 5,
                                    backgroundColor: 'violet',
                                    borderWidth: 5,
                                  }}
                                />
                                <p>Deadline : {item.deadline}</p>
                                <p>Created on : {item.created_date}</p>
                              </>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId='droppable-1'>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: `${
                        snapshot.isDraggingOver ? 'lightblue' : '#F6FA70'
                      }`,
                      position: 'absolute',
                      left: 415,
                      borderRadius: 10,
                      padding: 8,
                      top: 70,
                      width: 250,
                      minHeight: 50,
                      boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <h4 className='task-status-name'>Executing</h4>
                    {items2.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={`task-${item.id}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className='card'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleClick('array-2', item.id)}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                              item.expanded
                            )}
                          >
                            {item.content}
                            {item.expanded ? (
                              <>
                                <button
                                  style={{
                                    position: 'absolute',
                                    background: 'transparent',
                                    border: 0,
                                    right: 10,
                                    bottom: 5,
                                  }}
                                  onClick={() =>
                                    handleButtonClick(item.content)
                                  }
                                >
                                  <svg
                                    width='20'
                                    height='20'
                                    viewBox='0 0 20 20'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <g clipPath='url(#clip0_133_2)'>
                                      <path
                                        d='M11.6668 1.66667H5.00016C4.0835 1.66667 3.34183 2.41667 3.34183 3.33333L3.3335 16.6667C3.3335 17.5833 4.07516 18.3333 4.99183 18.3333H15.0002C15.9168 18.3333 16.6668 17.5833 16.6668 16.6667V6.66667L11.6668 1.66667ZM15.0002 16.6667H5.00016V3.33333H10.8335V7.5H15.0002V16.6667ZM6.66683 12.5083L7.84183 13.6833L9.16683 12.3667V15.8333H10.8335V12.3667L12.1585 13.6917L13.3335 12.5083L10.0085 9.16667L6.66683 12.5083Z'
                                        fill='black'
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id='clip0_133_2'>
                                        <rect
                                          width='20'
                                          height='20'
                                          fill='white'
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </button>
                                <input
                                  type='file'
                                  ref={fileInputRef}
                                  style={{ display: 'none' }}
                                />
                              </>
                            ) : (
                              ''
                            )}
                            {item.expanded && (
                              <>
                                <hr
                                  style={{
                                    border: 'none',
                                    height: 5,
                                    backgroundColor: 'violet',
                                    borderWidth: 5,
                                  }}
                                />
                                {data && (
                                  <>
                                    Uploaded File:
                                    {data.getFile.map((file) => {
                                      if (file.type === 'school') {
                                        if (item.content === file.task_Name) {
                                          return (
                                            <p key={file.fileName}>
                                              {file.fileName}
                                            </p>
                                          );
                                        }
                                        return 'No Uploaded Files';
                                      }
                                      return '';
                                    })}
                                  </>
                                )}
                                <p>Deadline : {item.deadline}</p>
                                <p>Created on : {item.created_date}</p>
                              </>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId='droppable-2'>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: `${
                        snapshot.isDraggingOver ? 'lightblue' : '#F6FA70'
                      }`,
                      position: 'absolute',
                      left: 695,
                      borderRadius: 10,
                      padding: 8,
                      top: 70,
                      width: 250,
                      minHeight: 50,
                      boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <h4 className='task-status-name'>Completed</h4>
                    {items1.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={`task-${item.id}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className='card'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleClick('array-3', item.id)}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                              item.expanded
                            )}
                          >
                            {item.content}
                            {item.expanded && (
                              <>
                                <hr
                                  style={{
                                    border: 'none',
                                    height: 5,
                                    backgroundColor: 'violet',
                                    borderWidth: 5,
                                  }}
                                />
                                {data && (
                                  <>
                                    Uploaded File:
                                    {data.getFile.map((file) => {
                                      if (file.type === 'school') {
                                        if (item.content === file.task_Name) {
                                          return (
                                            <p key={file.fileName}>
                                              {file.fileName}
                                            </p>
                                          );
                                        }
                                        return 'No Uploaded Files';
                                      }
                                      return '';
                                    })}
                                  </>
                                )}
                                <p>Deadline : {item.deadline}</p>
                                <p>Created on : {item.created_date}</p>
                              </>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable
                droppableId='droppable-3'
                isDropDisabled={isDropDisabled}
              >
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: `${
                        snapshot.isDraggingOver ? 'lightblue' : '#F6FA70'
                      }`,
                      position: 'absolute',
                      left: 975,
                      borderRadius: 10,
                      padding: 8,
                      top: 70,
                      width: 250,
                      minHeight: 50,
                      boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <h4 className='task-status-name'>Review</h4>
                    {items3.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={`task-${item.id}`}
                        index={index}
                        isDragDisabled={isDragDisabled}
                      >
                        {(provided, snapshot) => (
                          <div
                            className='card'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Droppable
                droppableId='droppable-4'
                isDropDisabled={isDropDisabled}
              >
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: `${
                        snapshot.isDraggingOver ? 'lightblue' : '#F6FA70'
                      }`,
                      position: 'absolute',
                      left: 1255,
                      borderRadius: 10,
                      padding: 8,
                      top: 70,
                      width: 250,
                      minHeight: 50,
                      boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <h4 className='task-status-name'>Finished</h4>
                    {items4.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={`task-${item.id}`}
                        index={index}
                        isDragDisabled={isDragDisabled}
                      >
                        {(provided, snapshot) => (
                          <div
                            className='card'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ) : null}
        </DragDropContext>
      </div>
    </div>
  );
};

export default Tasks;
