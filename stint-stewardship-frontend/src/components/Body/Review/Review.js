import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import * as Popover from '@radix-ui/react-popover';
import { MixerHorizontalIcon, Cross2Icon } from '@radix-ui/react-icons';
import { gql, useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSnackbar } from 'notistack';

import './Review.css';

const moveTaskToReview = gql`
  mutation MoveTaskToReview($moveToReview: MoveToStatusInput!) {
    moveTaskToReview(moveToReview: $moveToReview)
  }
`;
const moveTaskToFinished = gql`
  mutation MoveTaskToFinished($moveToFinished: MoveToStatusInput!) {
    moveTaskToFinished(moveToFinished: $moveToFinished)
  }
`;
const moveTaskToCompleted = gql`
  mutation MoveTaskToCompleted($moveToCompleted: MoveToStatusInput!) {
    moveTaskToCompleted(moveToCompleted: $moveToCompleted)
  }
`;

const completedStudent = gql`
  query GetAllCompletedOfStudent($userName: String!) {
    getAllCompletedOfStudent(userName: $userName) {
      tasks_id
      task_name
      deadline
      created_date
    }
  }
`;

const reviewStudent = gql`
  query GetAllReviewOfStudentByTeacher($userName: String!) {
    getAllReviewOfStudentByTeacher(userName: $userName) {
      task_name
      created_date
      deadline
    }
  }
`;

const finishStudent = gql`
  query Query($userName: String!) {
    getAllFinishedOfStudent(userName: $userName)
  }
`;

const getSem = gql`
  query GetTeacher($username: String!) {
    getTeacher(username: $username) {
      subject_code
    }
  }
`;

const getStudentBySem = gql`
  query Query($sem: Float!) {
    getStudentBySem(sem: $sem) {
      username
      stud_roll
      stud_name
      semester
    }
  }
`;
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Review = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [students, setStudents] = useState('');
  const [roll, setRoll] = useState('');
  const [arr1, setArr1] = useState('');
  const [arr2, setArr2] = useState('');
  const [arr3, setArr3] = useState('');
  const [sem, setSem] = useState('');
  const getSemData = useQuery(getSem, {
    variables: {
      username: username,
    },
  });
  const getStudentBySemData = useQuery(getStudentBySem, {
    variables: {
      sem: +sem,
    },
  });
  const completedData = useLazyQuery(completedStudent);
  const reviewData = useLazyQuery(reviewStudent);
  const finishData = useLazyQuery(finishStudent);
  const [toCompleted] = useMutation(moveTaskToCompleted);
  const [toReview] = useMutation(moveTaskToReview);
  const [toFinished] = useMutation(moveTaskToFinished);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem('authToken');
    if (token) {
      const parts = token.split('.');
      const payloadbase = parts[1];
      const payload = JSON.parse(atob(payloadbase));
      setUsername(payload.username);
    }
    if (getSemData.data) {
      const sem = getSemData.data.getTeacher.subject_code.toString().charAt(0);
      setSem(sem);
    }

    if (getStudentBySemData.data) {
      const students = getStudentBySemData.data.getStudentBySem.map(
        (student) => {
          return {
            rollNo: student.stud_roll,
            name: student.stud_name,
            sem: student.semester,
            username: student.username,
          };
        }
      );
      setStudents(students);
    }
  }, [getSemData, getStudentBySemData, sem]);
  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: 16,
    margin: '0 0 8px 0',
    background: isDragging ? '#9575DE' : '#B0DAFF',
    boxShadow: '0 0 5px 1px rgba(0, 0, 0, 0.3)',
    ...draggableStyle,
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (username, rollNo) => {
    setRoll(rollNo);
    if (username) {
      const [completedData1, completed] = completedData;
      completedData1({
        variables: {
          userName: username,
        },
      });
      if (completed.data) {
        const completedData = completed.data.getAllCompletedOfStudent.map(
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
        setArr1(completedData);
      }
      const [review1, review] = reviewData;
      review1({
        variables: {
          userName: username,
        },
      });
      if (review.data) {
        const reviewData = review.data.getAllReviewOfStudentByTeacher.map(
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
        setArr2(reviewData);
      }
      const [finish1, { data }] = finishData;
      finish1({
        variables: {
          userName: username,
        },
      });
      if (data) {
        const finishData = data.getAllFinishedOfStudent.map((task) => {
          return { id: `item-${task}`, content: `${task}` };
        });
        setArr3(finishData);
      }
    }
  };
  const getDroppableItems = (droppableId) => {
    switch (droppableId) {
      case 'droppable':
        return arr1;
      case 'droppable-1':
        return arr2;
      case 'droppable-2':
        return arr3;
      default:
        return [];
    }
  };
  const updateDroppableItems = (droppableId, items) => {
    switch (droppableId) {
      case 'droppable':
        setArr1(items);
        break;
      case 'droppable-1':
        setArr2(items);
        break;
      case 'droppable-2':
        setArr3(items);
        break;
      default:
        break;
    }
  };
  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) {
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
      if (destinationDroppableId === 'droppable') {
        toCompleted({
          variables: {
            moveToCompleted: {
              task_name: removed.content,
              student_roll: +roll,
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
      } else if (destinationDroppableId === 'droppable-1') {
        toReview({
          variables: {
            moveToReview: {
              task_name: removed.content,
              student_roll: +roll,
            },
          },
        })
          .then((response) => {
            if (response) {
              console.log(response.data.moveTaskToReview);
              if (response.data.moveTaskToReview) {
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
          .catch((error) => {
            
          });
      } else if (destinationDroppableId === 'droppable-2') {
        toFinished({
          variables: {
            moveToFinished: {
              task_name: removed.content,
              student_roll: +roll,
            },
          },
        })
          .then((response) => {
            if (response) {
              console.log(response.data.moveTaskToFinished);
              if (response.data.moveTaskToFinished) {
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
          .catch((error) => {
            
          });
      }
      updateDroppableItems(sourceDroppableId, sourceItems);
      updateDroppableItems(destinationDroppableId, destinationItems);
    }
  };

  return (
    <div className='review-page'>
      <div
        style={{
          display: 'grid',
          background: 'black',
          position: 'absolute',
          top: '30px',
          placeSelf: 'center',
          padding: 10,
          borderRadius: 10,
          opacity: '90%',
          boxShadow: '0 0 5px 2px rgba(0,0,0,0.3)',
        }}
      >
        <h6
          style={{
            color: '#ee9b00',
            paddingTop: 5,
            textDecoration: 'underline 2px solid gray',
          }}
        >
          Review Students' Tasks!
        </h6>
      </div>
      <DragDropContext onDragEnd={onDragEnd} enableDefaultSensors>
        <TableContainer
          component={Paper}
          style={{
            width: 'auto',
            height: 'auto',
            display: 'grid',
            position: 'absolute',
            placeSelf: 'center',
            top: 100,
            boxShadow: '0 0 10px 2px rgba(0,0,0,0.3)',
            overflowX: 'scroll',
          }}
        >
          {students && (
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Roll Number</StyledTableCell>
                  <StyledTableCell align='right'>Name</StyledTableCell>
                  <StyledTableCell align='right'>
                    Username&nbsp;
                  </StyledTableCell>
                  <StyledTableCell align='right'>
                    Semester&nbsp;
                  </StyledTableCell>
                  <StyledTableCell align='right'>Status&nbsp;</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((stud) => (
                  <StyledTableRow key={stud.rollNo} className='student-items'>
                    <StyledTableCell component='th' scope='row'>
                      {stud.rollNo}
                    </StyledTableCell>
                    <StyledTableCell align='right'>{stud.name}</StyledTableCell>
                    <StyledTableCell align='right'>
                      {stud.username}
                    </StyledTableCell>
                    <StyledTableCell align='right'>{stud.sem}</StyledTableCell>
                    <StyledTableCell align='center'>
                      <Popover.Root>
                        <Popover.Trigger asChild>
                          <button
                            className='IconButton1'
                            aria-label='Update dimensions'
                            onClick={() =>
                              handleClick(stud.username, stud.rollNo)
                            }
                          >
                            <MixerHorizontalIcon />
                          </button>
                        </Popover.Trigger>
                        <Popover.Portal>
                          <Popover.Content
                            className='PopoverContent1'
                            sideOffset={5}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <p className='Text1' style={{ color: '#ee9b00' }}>
                                Student Tasks
                              </p>
                              {isMounted && (
                                <div>
                                  <Droppable droppableId='droppable'>
                                    {(provided, snapshot) => (
                                      <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{
                                          background: `${
                                            snapshot.isDraggingOver
                                              ? '#D4F7FE'
                                              : '#F6FA70'
                                          }`,
                                          position: 'absolute',
                                          left: 20,
                                          top: 70,
                                          borderRadius: 10,
                                          padding: 8,
                                          width: 250,
                                          minHeight: 50,
                                          boxShadow:
                                            '0 0 10px 2px rgba(0, 0, 0, 0.3)',
                                        }}
                                      >
                                        <h4 className='task-status-name'>
                                          Completed
                                        </h4>
                                        {arr1 &&
                                          arr1.map((item, index) => (
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
                                                  style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps
                                                      .style
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
                                  <Droppable droppableId='droppable-1'>
                                    {(provided, snapshot) => (
                                      <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{
                                          background: `${
                                            snapshot.isDraggingOver
                                              ? '#D4F7FE'
                                              : '#F6FA70'
                                          }`,
                                          position: 'absolute',
                                          left: 320,
                                          borderRadius: 10,
                                          padding: 8,
                                          top: 70,
                                          width: 250,
                                          minHeight: 50,
                                          boxShadow:
                                            '0 0 10px 2px rgba(0, 0, 0, 0.3)',
                                        }}
                                      >
                                        <h4 className='task-status-name'>
                                          Review
                                        </h4>
                                        {arr2 &&
                                          arr2.map((item, index) => (
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
                                                  style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps
                                                      .style
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
                                  <Droppable droppableId='droppable-2'>
                                    {(provided, snapshot) => (
                                      <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={{
                                          background: `${
                                            snapshot.isDraggingOver
                                              ? 'lightblue'
                                              : '#F6FA70'
                                          }`,
                                          position: 'absolute',
                                          left: 620,
                                          borderRadius: 10,
                                          padding: 8,
                                          top: 70,
                                          width: 250,
                                          minHeight: 50,
                                          boxShadow:
                                            '0 0 10px 2px rgba(0, 0, 0, 0.3)',
                                        }}
                                      >
                                        <h4 className='task-status-name'>
                                          Finished
                                        </h4>
                                        {arr3 &&
                                          arr3.map((item, index) => (
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
                                                  style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps
                                                      .style
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
                              )}
                            </div>
                            <Popover.Close
                              className='PopoverClose1'
                              aria-label='Close'
                            >
                              <Cross2Icon />
                            </Popover.Close>
                            <Popover.Arrow className='PopoverArrow1' />
                          </Popover.Content>
                        </Popover.Portal>
                      </Popover.Root>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </DragDropContext>
    </div>
  );
};

export default Review;
