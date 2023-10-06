import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useQuery, gql, useMutation, useLazyQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';

import '../Tasks/Body.css';
import AddTask from './AddTask/AddTask';

const stud_roll = gql`
  query GetStudentByUsername($getStudentByName: String!) {
    getStudentByUsername(getStudentByName: $getStudentByName) {
      stud_roll
    }
  }
`;
export const todoTeacher = gql`
  query GetAllTodoOfTeacher($userName: String!) {
    getAllTodoOfTeacher(userName: $userName) {
      tasks_id
      task_name
      deadline
      created_date
    }
  }
`;
export const todoTasks = gql`
  query GetAllPersonalTodoOfStudent($userName: String!) {
    getAllPersonalTodoOfStudent(userName: $userName) {
      tasks_id
      task_name
      deadline
      created_date
    }
  }
`;
const executingTasks = gql`
  query GetAllPersonalExecutingOfStudent($userName: String!) {
    getAllPersonalExecutingOfStudent(userName: $userName) {
      tasks_id
      task_name
      deadline
      created_date
    }
  }
`;
const executingTeacher = gql`
  query GetAllExecutingOfTeacher($userName: String!) {
    getAllExecutingOfTeacher(userName: $userName) {
      tasks_id
      task_name
      deadline
      created_date
    }
  }
`;
const completedTasks = gql`
  query GetAllPersonalCompletedOfStudent($userName: String!) {
    getAllPersonalCompletedOfStudent(userName: $userName) {
      tasks_id
      task_name
      deadline
      created_date
    }
  }
`;
const completedTeacher = gql`
  query GetAllCompletedOfTeacher($userName: String!) {
    getAllCompletedOfTeacher(userName: $userName) {
      tasks_id
      task_name
      deadline
      created_date
    }
  }
`;
const reviewTasks = gql`
  query GetAllPersonalReviewOfStudent($userName: String!) {
    getAllPersonalReviewOfStudent(userName: $userName) {
      tasks_id
      task_name
      deadline
      created_date
    }
  }
`;
const reviewTeacher = gql`
  query GetAllReviewOfTeacher($userName: String!) {
    getAllReviewOfTeacher(userName: $userName) {
      tasks_id
      task_name
      deadline
      created_date
    }
  }
`;

const finishedTasks = gql`
  query GetAllPersonalFinishedOfStudent($userName: String!) {
    getAllPersonalFinishedOfStudent(userName: $userName) {
      tasks_id
      task_name
      deadline
      created_date
    }
  }
`;

const finishedTeacher = gql`
  query GetAllFinishedOfTeacher($userName: String!) {
    getAllFinishedOfTeacher(userName: $userName) {
      tasks_id
      task_name
      deadline
      created_date
    }
  }
`;

const moveTaskToExecuting = gql`
  mutation MovePersonalTaskToExecuting(
    $movePersonalToExecution: MoveToStatusInput!
  ) {
    movePersonalTaskToExecuting(
      movePersonalToExecution: $movePersonalToExecution
    )
  }
`;
const moveExecutingTeacher = gql`
  mutation MoveTaskToExecutingForTeacher($moveToExecution: SwitchStatusInput!) {
    moveTaskToExecutingForTeacher(moveToExecution: $moveToExecution)
  }
`;
const moveTaskToCompleted = gql`
  mutation MovePersonalTaskToCompleted(
    $movePersonalToCompleted: MoveToStatusInput!
  ) {
    movePersonalTaskToCompleted(
      movePersonalToCompleted: $movePersonalToCompleted
    )
  }
`;
const moveCompletedTeacher = gql`
  mutation MoveTaskToCompletedForTeacher($moveToCompleted: SwitchStatusInput!) {
    moveTaskToCompletedForTeacher(moveToCompleted: $moveToCompleted)
  }
`;
const moveTaskToTodo = gql`
  mutation MovePersonalTaskToTodo($movePersonalToTodo: MoveToStatusInput!) {
    movePersonalTaskToTodo(movePersonalToTodo: $movePersonalToTodo)
  }
`;
const moveTodoTeacher = gql`
  mutation MoveTaskToTodoForTeacher($moveToTodo: SwitchStatusInput!) {
    moveTaskToTodoForTeacher(moveToTodo: $moveToTodo)
  }
`;
const moveTaskToReview = gql`
  mutation MovePersonalTaskToReview($moveToReview: MoveToStatusInput!) {
    movePersonalTaskToReview(moveToReview: $moveToReview)
  }
`;
const moveReviewTeacher = gql`
  mutation MoveTaskToReviewForTeacher($moveToReview: SwitchStatusInput!) {
    moveTaskToReviewForTeacher(moveToReview: $moveToReview)
  }
`;
const moveTaskToFinished = gql`
  mutation MovePersonalTaskToFinished($moveToFinished: MoveToStatusInput!) {
    movePersonalTaskToFinished(moveToFinished: $moveToFinished)
  }
`;

const moveFinishedTeacher = gql`
  mutation MoveTaskToFinishedForTeacher($moveToFinished: SwitchStatusInput!) {
    moveTaskToFinishedForTeacher(moveToFinished: $moveToFinished)
  }
`;

const delPerTaskStud = gql`
  mutation DeletePersonalTaskForStudent($name: String!, $username: String!) {
    deletePersonalTaskForStudent(name: $name, username: $username)
  }
`;

const delPerTaskT = gql`
  mutation DeletePersonalTaskForTeacher($name: String!, $username: String!) {
    deletePersonalTaskForTeacher(name: $name, username: $username)
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

const PersonalWorkspace = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [demo, setDemo] = useState(false);
  const todoT = useQuery(todoTeacher, {
    variables: {
      userName: name,
    },
  });
  const todoData = useQuery(todoTasks, {
    variables: {
      userName: name,
    },
  });

  const rollNo = useQuery(stud_roll, {
    variables: { getStudentByName: name },
  });
  const completedData = useQuery(completedTasks, {
    variables: { userName: name },
  });
  const completedT = useQuery(completedTeacher, {
    variables: {
      userName: name,
    },
  });
  const [getF, { data }] = useLazyQuery(getFile);
  const executingData = useQuery(executingTasks, {
    variables: { userName: name },
  });
  const executingT = useQuery(executingTeacher, {
    variables: { userName: name },
  });
  const reviewData = useQuery(reviewTasks, {
    variables: { userName: name },
  });
  const reviewT = useQuery(reviewTeacher, {
    variables: {
      userName: name,
    },
  });
  const finishedData = useQuery(finishedTasks, {
    variables: { userName: name },
  });
  const finishedT = useQuery(finishedTeacher, {
    variables: { userName: name },
  });
  const [taskToExecuting] = useMutation(moveTaskToExecuting);
  const [delPerStud] = useMutation(delPerTaskStud);
  const [delPerT] = useMutation(delPerTaskT);
  const [moveExecutingT] = useMutation(moveExecutingTeacher);
  const [taskToTodo] = useMutation(moveTaskToTodo);
  const [moveTodoT] = useMutation(moveTodoTeacher);
  const [taskToCompleted] = useMutation(moveTaskToCompleted);
  const [moveCompletedT] = useMutation(moveCompletedTeacher);
  const [taskToReview] = useMutation(moveTaskToReview);
  const [moveReviewT] = useMutation(moveReviewTeacher);
  const [taskToFinished] = useMutation(moveTaskToFinished);
  const [moveFinishedT] = useMutation(moveFinishedTeacher);
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
      setRole(payload.role);
      setName(payload.username);
    }
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (role === 'student') {
      if (todoData.data) {
        const tododata1 = todoData.data.getAllPersonalTodoOfStudent.map(
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
        setItems(tododata1);
      }
      if (completedData.data) {
        const completedData1 =
          completedData.data.getAllPersonalCompletedOfStudent.map((task) => {
            return {
              id: `item-${task.tasks_id}`,
              content: `${task.task_name}`,
              created_date: task.created_date,
              subject: task.subject_code,
              deadline: task.deadline,
              expanded: false,
            };
          });
        setItems1(completedData1);
      }
      if (executingData.data) {
        const executingData1 =
          executingData.data.getAllPersonalExecutingOfStudent.map((task) => {
            return {
              id: `item-${task.tasks_id}`,
              content: `${task.task_name}`,
              created_date: task.created_date,
              subject: task.subject_code,
              deadline: task.deadline,
              expanded: false,
            };
          });
        setItems2(executingData1);
      }
      if (reviewData.data) {
        const reviewData1 = reviewData.data.getAllPersonalReviewOfStudent.map(
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
        setItems3(reviewData1);
      }
      if (finishedData.data) {
        const finishedData1 =
          finishedData.data.getAllPersonalFinishedOfStudent.map((task) => {
            return {
              id: `item-${task.tasks_id}`,
              content: `${task.task_name}`,
              created_date: task.created_date,
              subject: task.subject_code,
              deadline: task.deadline,
            };
          });
        setItems4(finishedData1);
      }
      if (rollNo.data) {
        setRoll(+rollNo.data.getStudentByUsername.stud_roll);
      }
      //the only thing not working on spa!
      todoData.refetch();
    }
    setIsMounted(true);
  }, [
    completedData.data,
    demo,
    executingData.data,
    finishedData.data,
    reviewData.data,
    role,
    rollNo.data,
    todoData,
  ]);
  useEffect(() => {
    if (role === 'teacher') {
      if (todoT.data) {
        const tododata1 = todoT.data.getAllTodoOfTeacher.map((task) => {
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
      if (executingT.data) {
        const executingData1 = executingT.data.getAllExecutingOfTeacher.map(
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
      if (completedT.data) {
        const completedData1 = completedT.data.getAllCompletedOfTeacher.map(
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
      if (reviewT.data) {
        const reviewData1 = reviewT.data.getAllReviewOfTeacher.map((task) => {
          return {
            id: `item-${task.tasks_id}`,
            content: `${task.task_name}`,
            created_date: task.created_date,
            subject: task.subject_code,
            deadline: task.deadline,
            expanded: false,
          };
        });
        setItems3(reviewData1);
      }
      if (finishedT.data) {
        const finishedData1 = finishedT.data.getAllFinishedOfTeacher.map(
          (task) => {
            return { id: `item-${task}`, content: `${task}` };
          }
        );
        setItems4(finishedData1);
      }
      todoT.refetch();
    }
    setIsMounted(true);
  }, [
    completedT.data,
    demo,
    executingT.data,
    finishedT.data,
    reviewT.data,
    role,
    todoT,
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
      if (role === 'student') {
        if (destinationDroppableId === 'droppable-1') {
          taskToExecuting({
            variables: {
              movePersonalToExecution: {
                task_name: removed.content,
                student_roll: roll,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.movePersonalTaskToExecuting);
                if (response.data.movePersonalTaskToExecuting) {
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
            .catch((error) => {});
        } else if (destinationDroppableId === 'droppable') {
          taskToTodo({
            variables: {
              movePersonalToTodo: {
                student_roll: roll,
                task_name: removed.content,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.movePersonalTaskToTodo);
                if (response.data.movePersonalTaskToTodo) {
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
            .catch((error) => {});
        } else if (destinationDroppableId === 'droppable-2') {
          taskToCompleted({
            variables: {
              movePersonalToCompleted: {
                student_roll: roll,
                task_name: removed.content,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.movePersonalTaskToCompleted);
                if (response.data.movePersonalTaskToCompleted) {
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
            .catch((error) => {});
        } else if (destinationDroppableId === 'droppable-3') {
          taskToReview({
            variables: {
              moveToReview: {
                task_name: removed.content,
                student_roll: roll,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.movePersonalTaskToReview);
                if (response.data.movePersonalTaskToReview) {
                  enqueueSnackbar('Switched Task To Review! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {});
        } else if (destinationDroppableId === 'droppable-4') {
          taskToFinished({
            variables: {
              moveToFinished: {
                task_name: removed.content,
                student_roll: roll,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.movePersonalTaskToFinished);
                if (response.data.movePersonalTaskToFinished) {
                  enqueueSnackbar('Switched Task To Finished! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {});
        }
      }
      if (role === 'teacher') {
        if (destinationDroppableId === 'droppable-1') {
          moveExecutingT({
            variables: {
              moveToExecution: {
                task_name: removed.content,
                teacher_username: name,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.moveTaskToExecutingForTeacher);
                if (response.data.moveTaskToExecutingForTeacher) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {});
        } else if (destinationDroppableId === 'droppable') {
          moveTodoT({
            variables: {
              moveToTodo: {
                teacher_username: name,
                task_name: removed.content,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.moveTaskToTodoForTeacher);
                if (response.data.moveTaskToTodoForTeacher) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {});
        } else if (destinationDroppableId === 'droppable-2') {
          moveCompletedT({
            variables: {
              moveToCompleted: {
                teacher_username: name,
                task_name: removed.content,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.moveTaskToCompletedForTeacher);
                if (response.data.moveTaskToCompletedForTeacher) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {});
        } else if (destinationDroppableId === 'droppable-3') {
          moveReviewT({
            variables: {
              moveToReview: {
                task_name: removed.content,
                teacher_username: name,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.moveTaskToReviewForTeacher);
                if (response.data.moveTaskToReviewForTeacher) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {});
        } else if (destinationDroppableId === 'droppable-4') {
          moveFinishedT({
            variables: {
              moveToFinished: {
                task_name: removed.content,
                teacher_username: name,
              },
            },
          })
            .then((response) => {
              if (response) {
                console.log(response.data.moveTaskToFinishedForTeacher);
                if (response.data.moveTaskToFinishedForTeacher) {
                  enqueueSnackbar('Switched! ⚙️', {
                    style: { background: 'Purple' },
                  });
                } else {
                  enqueueSnackbar('Try That Again! 😣', {
                    style: { background: 'red' },
                  });
                }
              }
            })
            .catch((error) => {});
        }
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

  const getItemStyle = useMemo(
    () => (isDragging, draggableStyle, expanded) => ({
      userSelect: 'none',
      padding: 16,
      height: expanded && 'auto',
      margin: '0 0 8px 0',
      background: isDragging ? '#9575DE' : '#B0DAFF',
      boxShadow: '0 0 5px 1px rgba(0, 0, 0, 0.3)',
      ...draggableStyle,
    }),
    []
  );

  const handleDeleteClick = (name1) => {
    if (role === 'student') {
      delPerStud({
        variables: {
          name: name1,
          username: name,
        },
      })
        .then((res) => {
          if (res) {
            enqueueSnackbar(`Deleted Task ${name1}!`, {
              style: { background: 'green' },
            });
            todoData.refetch();
            executingData.refetch();
            completedData.refetch();
            reviewData.refetch();
          }
        })
        .catch((err) => {
          enqueueSnackbar(`${err}`, {
            style: { background: 'red' },
          });
        });
    } else if (role === 'teacher') {
      delPerT({
        variables: {
          username: name,
          name: name1,
        },
      })
        .then((res) => {
          if (res) {
            enqueueSnackbar(`Deleted Task ${name1}!`, {
              style: { background: 'green' },
            });
            todoT.refetch();
            executingT.refetch();
            completedT.refetch();
            reviewT.refetch();
          }
        })
        .catch((err) => {
          enqueueSnackbar(`${err}`, {
            style: { background: 'red' },
          });
        });
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
    form.append('type', 'personal');
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
  };
  return (
    <div className='body' onClick={handle}>
      <div className='title-button'>
        <div className='title-for-page'>Your Personal Tasks</div>
        {name && <AddTask setDemo={setDemo} todoData={todoData} />}
      </div>
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
                        snapshot.isDraggingOver ? '#D4F7FE' : '#F6FA70'
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
                                <button
                                  style={{
                                    position: 'absolute',
                                    background: 'transparent',
                                    border: 0,
                                    width: 0,
                                    right: 50,
                                    bottom: 5,
                                  }}
                                  onClick={() =>
                                    handleDeleteClick(item.content)
                                  }
                                >
                                  <svg
                                    width='14'
                                    height='16'
                                    viewBox='0 0 24 31'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <path
                                      d='M1.77679 27.25C1.77679 29.0706 3.26339 30.5602 5.08036 30.5602H18.2946C20.1116 30.5602 21.5982 29.0706 21.5982 27.25V7.38889H1.77679V27.25ZM5.84018 15.4657L8.1692 13.1321L11.6875 16.6409L15.1893 13.1321L17.5183 15.4657L14.0165 18.9745L17.5183 22.4833L15.1893 24.817L11.6875 21.3082L8.18571 24.817L5.8567 22.4833L9.35848 18.9745L5.84018 15.4657ZM17.4688 2.42361L15.817 0.768518H7.55804L5.90625 2.42361H0.125V5.7338H23.25V2.42361H17.4688Z'
                                      fill='black'
                                    />
                                  </svg>
                                </button>
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
                                      if (file.type === 'personal') {
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
                                {item.deadline && (
                                  <p>Deadline : {item.deadline}</p>
                                )}
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
                        snapshot.isDraggingOver ? '#D4F7FE' : '#F6FA70'
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
                                <button
                                  style={{
                                    position: 'absolute',
                                    background: 'transparent',
                                    border: 0,
                                    width: 0,
                                    right: 50,
                                    bottom: 5,
                                  }}
                                  onClick={() =>
                                    handleDeleteClick(item.content)
                                  }
                                >
                                  <svg
                                    width='14'
                                    height='16'
                                    viewBox='0 0 24 31'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <path
                                      d='M1.77679 27.25C1.77679 29.0706 3.26339 30.5602 5.08036 30.5602H18.2946C20.1116 30.5602 21.5982 29.0706 21.5982 27.25V7.38889H1.77679V27.25ZM5.84018 15.4657L8.1692 13.1321L11.6875 16.6409L15.1893 13.1321L17.5183 15.4657L14.0165 18.9745L17.5183 22.4833L15.1893 24.817L11.6875 21.3082L8.18571 24.817L5.8567 22.4833L9.35848 18.9745L5.84018 15.4657ZM17.4688 2.42361L15.817 0.768518H7.55804L5.90625 2.42361H0.125V5.7338H23.25V2.42361H17.4688Z'
                                      fill='black'
                                    />
                                  </svg>
                                </button>
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
                                      if (file.type === 'personal') {
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
                                {item.deadline && (
                                  <p>Deadline : {item.deadline}</p>
                                )}
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
                        snapshot.isDraggingOver ? '#D4F7FE' : '#F6FA70'
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
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                              item.expanded
                            )}
                            onClick={() => handleClick('array-3', item.id)}
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
                                <button
                                  style={{
                                    position: 'absolute',
                                    background: 'transparent',
                                    border: 0,
                                    width: 0,
                                    right: 50,
                                    bottom: 5,
                                  }}
                                  onClick={() =>
                                    handleDeleteClick(item.content)
                                  }
                                >
                                  <svg
                                    width='14'
                                    height='16'
                                    viewBox='0 0 24 31'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <path
                                      d='M1.77679 27.25C1.77679 29.0706 3.26339 30.5602 5.08036 30.5602H18.2946C20.1116 30.5602 21.5982 29.0706 21.5982 27.25V7.38889H1.77679V27.25ZM5.84018 15.4657L8.1692 13.1321L11.6875 16.6409L15.1893 13.1321L17.5183 15.4657L14.0165 18.9745L17.5183 22.4833L15.1893 24.817L11.6875 21.3082L8.18571 24.817L5.8567 22.4833L9.35848 18.9745L5.84018 15.4657ZM17.4688 2.42361L15.817 0.768518H7.55804L5.90625 2.42361H0.125V5.7338H23.25V2.42361H17.4688Z'
                                      fill='black'
                                    />
                                  </svg>
                                </button>
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
                                      if (file.type === 'personal') {
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
                                {item.deadline && (
                                  <p>Deadline : {item.deadline}</p>
                                )}
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
              <Droppable droppableId='droppable-3'>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: `${
                        snapshot.isDraggingOver ? '#D4F7FE' : '#F6FA70'
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
                      >
                        {(provided, snapshot) => (
                          <div
                            className='card'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleClick('array-4', item.id)}
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
                                    width: 0,
                                    right: 20,
                                    bottom: 5,
                                  }}
                                  onClick={() =>
                                    handleDeleteClick(item.content)
                                  }
                                >
                                  <svg
                                    width='14'
                                    height='16'
                                    viewBox='0 0 24 31'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <path
                                      d='M1.77679 27.25C1.77679 29.0706 3.26339 30.5602 5.08036 30.5602H18.2946C20.1116 30.5602 21.5982 29.0706 21.5982 27.25V7.38889H1.77679V27.25ZM5.84018 15.4657L8.1692 13.1321L11.6875 16.6409L15.1893 13.1321L17.5183 15.4657L14.0165 18.9745L17.5183 22.4833L15.1893 24.817L11.6875 21.3082L8.18571 24.817L5.8567 22.4833L9.35848 18.9745L5.84018 15.4657ZM17.4688 2.42361L15.817 0.768518H7.55804L5.90625 2.42361H0.125V5.7338H23.25V2.42361H17.4688Z'
                                      fill='black'
                                    />
                                  </svg>
                                </button>
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
                                      if (file.type === 'personal') {
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
                                {item.deadline && (
                                  <p>Deadline : {item.deadline}</p>
                                )}
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
              <Droppable droppableId='droppable-4'>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      background: `${
                        snapshot.isDraggingOver ? '#D4F7FE' : '#F6FA70'
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

export default PersonalWorkspace;
