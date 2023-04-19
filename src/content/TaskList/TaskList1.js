import React, {useState, useEffect, useCallback, useReducer} from 'react';
import {
  Grid,
  Column,
  Tile,
  Heading,
  ModalWrapper,
  Modal,
  ModalHeader,
  TextInput,
  Dropdown,
  DatePicker,
  DatePickerInput,
  ModalBody,
  TextArea, RadioButton, Checkbox
} from '@carbon/react';
import {Add, TrashCan, ColumnDependency, LoadBalancerVpc, ParentChild, Task, TaskAdd} from '@carbon/react/icons';
import './_tasklist.scss';
import {postService} from "../httpService/httpService";
import {getAllTasks, createTask, updateTask, deleteTask} from "../../redux/slice/taskSlice1";
import {useSelector, useDispatch} from "react-redux";

const initialState = {
  name:'',
  dueBy:  new Date(Date.now()).toLocaleString('en-GB', {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }),
  taskStatus: 'New',
  subTasks: [],
  notes: [],
  timestamp: Date.now()
}


const OpenModel = ({status, setStatus, handleSubmit}) => {
  const [modal, closeModal] = useState(status);
  const [notesSection, changeNotesSection] = useState();
  const [subtaskCounts, updateSubTaskCount] = useState([]);

  const [modalState, dispatch] = useReducer(reducer, initialState);

  const removeSubtasks = (index) => {

    let arr1 = subtaskCounts.slice(0, index);
    let arr2 = subtaskCounts.slice(index+1);
    let arr3 = [...arr1, ...arr2];
    updateSubTaskCount(arr3)
  }

  const addSubtasks = (index, item) => {
    subtaskCounts[index] = item;
    updateSubTaskCount([...subtaskCounts])
    dispatch({type:'subTasks', value:subtaskCounts})
  }

  const updateTaskStatus = (index, newStatus) => {
    let oldKey = {...subtaskCounts[index], status: newStatus }
    subtaskCounts[index] = oldKey
    dispatch({type:'subTasks', value:subtaskCounts})
  }

  return (
      <>
        <Modal size={'sm'}
               open={modal}
               modalHeading="Add a task"
               modalLabel="Task Management"
               primaryButtonText="Add"
               secondaryButtonText="Cancel"
               onRequestClose = {e => setStatus(false)}
               onRequestSubmit = {e => {
                 handleSubmit(modalState)
               }}
        >
          <ModalBody>
            <Grid>
              <Column lg={4} md={4} sm={4}>
                <TextInput
                    data-modal-primary-focus
                    id="text-input-1"
                    labelText="Task Name"
                    placeholder="Task Name"
                    onChange={(e) => dispatch({type: 'name', value: e.target.value})}
                />

              </Column>
              <Column lg={2} md={4} sm={4}>
                <div className={'cra-datepicker'}>
                  <DatePicker className='cra-datepicker' defaultValue={Date.now()}
                              size="sm" dateFormat="m/d/Y" datePickerType="single" onChange={(e) => {
                    let date = new Date(e);
                    let date1 = date.toLocaleString('en-GB', {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit"
                    })


                    dispatch({type: 'dueBy', value: date1})
                  }}>
                    <DatePickerInput
                        className={'cra-datepicker'}
                        id="date-picker-default-id"
                        placeholder="mm/dd/yyyy"
                        labelText="Due By"
                        type="text"
                    />
                  </DatePicker>
                </div>

              </Column>
              <Column lg={2} md={4} sm={4}>
                <Dropdown
                    ariaLabel="Dropdown"
                    id="carbon-dropdown-example"
                    label="Choose the current status"
                    items={['New', 'InProgress', 'Backlog', 'Closed']}
                    titleText="Status"
                    direction={'bottom'}
                    itemToString={(item) => item}
                    onChange={(e) => dispatch({type:'taskStatus', value: e.selectedItem})}

                />

              </Column>

              <Column lg={4} md={4} sm={4}>

                <legend className={'cds--label'}>Sub Tasks</legend>

                <div onClick={() => {

                }}>

                  <div onClick={() => {

                  }} >
                    <Add label={'add'} style={{float: 'left'}} size={16} text={'add'} onClick={() => {
                      updateSubTaskCount([...subtaskCounts, ''])
                      //dispatch({type:'subTasks', value: 'placeholder'})

                    }}/>

                    <legend className={'cds--label'}>Add Sub-Tasks</legend>
                  </div>

                </div>
              </Column>

              <Column lg={4} md={4} sm={4}>
                {
                  <CreateCheckBox subtaskEntries={subtaskCounts}
                                  addSubtasks={addSubtasks}
                                  removeSubtasks={removeSubtasks}
                                  updateTaskStatus={updateTaskStatus}
                  />
                }
              </Column>

              <Column lg={4} md={4} sm={4}>
                <TextArea
                    labelText={'Notes'}
                    helperText={'Insert your notes here'}
                    rows={4}
                    onChange={(e) => dispatch({type:'notesSection', value:e.target.value})}
                />
              </Column>
            </Grid>
          </ModalBody>
        </Modal>
      </>
  )
}

const CreateCheckBox = (props) => {
  const {subtaskEntries, addSubtasks, removeSubtasks, updateTaskStatus}  = props;
  const [subtasks, updatesubtasks] = useState({index:'', status:false, name:''});
  const [subtaskStatus, checkSubTaskstatus] = useState(false);

  return (
      <div>
        {
          subtaskEntries?.length > 0 ?
              <div >
                {subtaskEntries.map((item, index) => {
                  return (
                      <div className={'subtasks'} id={index} style={{display: 'flex'}}>
                        <Checkbox labelText={''} id={index+1} defaultChecked={item.status} onChange={(event, { checked, id }) => {
                          updateTaskStatus(index, checked)
                        }} />
                        <TextInput
                            id={index} labelText={''}
                            size={'sm'}
                            type={"text"}
                            defaultValue={item.name}
                            onChange={(e) => updatesubtasks({index: index, status: subtaskStatus, name: e.target.value})}
                            onBlur={(e) => addSubtasks(index, subtasks)}
                        />
                        <TrashCan size={16} onClick={() => removeSubtasks(index)}  />
                      </div>
                  )
                })}
              </div>
              :<></>
        }
      </div>
  )
}

const EditModal = (props) => {
  const {sendDataToEditModal, timestamp, handleSubmit, subTasks, taskObject} = props
  const [subtaskCounts, updateSubTaskCount] = useState(taskObject.subTasks);

  //const [modalState, dispatch] = useReducer(reducer, editModalState);
  const [modalState, dispatch] = useReducer(reducer, taskObject);

  useEffect(() => {
    dispatch({type: 'timestamp', value: timestamp})
  }, [])

  const removeSubtasks = (index) => {
    let arr1 = subtaskCounts.slice(0, index);
    let arr2 = subtaskCounts.slice(index + 1);
    let arr3 = [...arr1, ...arr2];
    updateSubTaskCount(arr3);
    dispatch({type:'subTasks', value:arr3});
  };

  const addSubtasks = (index, item) => {
    subtaskCounts[index] = item;
    updateSubTaskCount([...subtaskCounts])
    dispatch({type:'subTasks', value:subtaskCounts})
  }

  const updateTaskStatus = (index, newStatus) => {
    //TODO: refactor this one, bad way of updating
    let oldKey = {...subtaskCounts[index], status: newStatus }
    let arr1 = subtaskCounts.slice(0, index);
    let arr2 = subtaskCounts.slice(index);
    let arr3 = [...arr1, ...arr2];
    arr3[index] = oldKey;
    //updateSubTaskCount([...subtaskCounts])
    dispatch({type:'subTasks', value:arr3})

  }

  return (
      <>
        <Modal
            open={true}
            size={'sm'}
            modalHeading="Edit a task"
            modalLabel="Task Management"
            primaryButtonText="Save"
            secondaryButtonText="Cancel"
            onRequestClose={() => sendDataToEditModal({status: false})}
            onRequestSubmit={() =>{
              handleSubmit(modalState)
            }}

        >
          <ModalBody>
            <Grid>
              <Column lg={4} md={4} sm={4}>
                <TextInput
                    data-modal-primary-focus
                    id="text-input-1"
                    labelText="Task Name"
                    defaultValue={taskObject.name}
                    onChange={(e) => dispatch({type: 'name', value: e.target.value}) }
                />
              </Column>
              <Column lg={2} md={4} sm={4}>
                <div className={'cra-datepicker'}>
                  <DatePicker   size={'sm'} datePickerType={'single'} dateFormat={'m/d/Y'} onChange={(e) => {
                    let date = new Date(e);
                    let date1 = date.toLocaleString('en-GB', {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit"
                    })
                    dispatch({type: 'dueBy', value: date1})

                  }} >
                    <DatePickerInput
                        id="edit-date-picker-default-id"
                        placeholder="mm/dd/yyyy"
                        labelText="Due By"
                        defaultValue={taskObject.dueBy}
                        type="text">


                    </DatePickerInput>
                  </DatePicker>
                </div>

              </Column>
              <Column lg={2} md={4} sm={4}>
                <Dropdown
                    ariaLabel="Dropdown"
                    id="edit-status"
                    label="Choose the current status"
                    items={['New', 'InProgress', 'Backlog', 'Closed']}
                    initialSelectedItem={taskObject.taskStatus}
                    titleText="Status"
                    direction={'bottom'}
                    onChange={(e) => {
                      dispatch({type:'taskStatus', value: e.selectedItem})
                    }}
                />
              </Column>

              <Column lg={4} md={4} sm={4}>

                <legend className={'cds--label'}>Sub Tasks</legend>

                <Add label={'add'} style={{float: 'left'}} size={16} text={'add'} onClick={() => {
                  updateSubTaskCount([...subtaskCounts, ''])
                  //dispatch({type:'subTasks', value: 'placeholder'})

                }}/>

                <legend className={'cds--label'}>Add Sub-Tasks</legend>
              </Column>

              <Column lg={4} md={4} sm={4}>
                {
                  <CreateCheckBox subtaskEntries={subtaskCounts}
                                  addSubtasks={addSubtasks}
                                  removeSubtasks={removeSubtasks}
                                  updateTaskStatus={updateTaskStatus}
                  />
                }
              </Column>

              <Column lg={4} md={4} sm={4}>
                <TextArea
                    labelText={'Notes'}
                    helperText={'Insert your notes here'}
                    rows={4}
                    defaultValue={taskObject.notesSection}
                    onChange={(e) => dispatch({type:'notes', value: e.target.value})}
                />
              </Column>
            </Grid>
          </ModalBody>

        </Modal>

      </>
  )

}

const ListItems = (props) => {
  const {elements, statusType, updateElements} = props
  const [editModal, toggleEditModal] = useState(false);
  const [task, editTask] = useState();
  const dispatch1 = useDispatch();

  const [modalState, dispatch] = useReducer(reducer, initialState);

  const sendDataToEditModal = (obj) => {

    toggleEditModal(false)
  }

  const handleSubmit = (obj) => {
    let pos = elements.findIndex((item) => item.timestamp === obj.timestamp)
    dispatch1(updateTask(obj));
    toggleEditModal(false);
  }

  return (
      <div className={'bx--row'}>
        {
          elements
              .filter((item) => item.taskStatus === statusType)
              .map((item,index) => {

                return(
                    <>
                      <Tile className={'individual_task'}>
                        <Grid>
                          <Column sm={4} className={'title'} onClick={() => {
                            editTask(item);
                            toggleEditModal(true);
                          }}>
                            <h4>{item.name}</h4>
                          </Column>
                          <Column sm={4}>
                            <div className={'subtasks-icon'} onClick={() => {
                              editTask(item);
                              toggleEditModal(true);
                            }}>

                              <Task size={25} onClick={() => {

                              }} />
                              <Column sm={2}>
                                {
                                  item.subTasks
                                      .filter((item) => item.status === true)
                                      .length
                                }/{item.subTasks.length}
                              </Column>
                            </div>

                          </Column>
                          <Column sm={4}>
                            <div className={'dueBy'} onClick={() => {
                              editTask(item);
                              toggleEditModal(true);
                            }}>
                              <h6>{item.dueBy}</h6>
                            </div>
                          </Column>
                          <Column sm={{span:1, offset:4}}>
                            <TrashCan className={'trash-icon'} size={16} onClick={() => {
                              alert(item._id);
                              dispatch1(deleteTask({id: item._id}))
                            }}></TrashCan>
                          </Column>

                        </Grid>

                      </Tile>
                    </>
                )
              })
        }

        {editModal ?
            <EditModal status={editModal}
                       taskObject={task}
                       sendDataToEditModal={sendDataToEditModal}
                       handleSubmit = {handleSubmit} />
            :
            <></>}
      </div>
  );
};

const TaskList = (props) => {
  const [modal, showModal] = useState(false);
  const [state, updateState] = useState(props.taskList?.tasks || []);
  const [editModal, showEditModal] = useState(false);
  const dispatch = useDispatch();
  const [taskItems, updateTaskItems] = useState([]);
  const state1 = useSelector(state => state);

  useEffect(() => {
    let alltasklist = dispatch(getAllTasks())
  }, [])

  const sendDataToParent = (status) => {
    showModal(false);
  }

  const handleSubmit = (obj) => {
    updateState([
      ...state,
      obj
    ])
    /*postService('tasklist', '/tasklist', obj)
        .then(() => console.log('data'))*/
    dispatch(createTask(obj))
    showModal(false);
  }

  const updateElements = (elements)=> {
    updateState([
      ...elements
    ])
  }

  return (
      <Grid className="tasklist-page" fullWidth>
        <Column lg={16} md={8} sm={4}>
          <div className={'landing-page__r2'}>
            <Heading>ToDO List</Heading>
          </div>


        </Column>
        <Column lg={16} md={8} sm={4} >
          <Grid >
            <Column md={8} lg={4} sm={4} className={'tasklist_card'}>
              <Tile>
                <div style={{paddingBottom: '30px'}}>
                  <h4 style={{float: 'left'}}>New</h4>
                  <TaskAdd style={{float: 'right'}} size={32} onClick={() => { showModal(true)}}  />

                  {modal ?
                      <OpenModel status={true} setStatus={sendDataToParent} handleSubmit={handleSubmit} />

                      : ''}

                </div>

                <hr />
                <ul>
                  {state1.reducer.loading  ?
                      <ListItems elements={state1.reducer.tasks} statusType={'New'} updateElements={updateElements} />

                      :<></>}
                </ul>

              </Tile>
            </Column>
            <Column md={8} lg={4} sm={4} className={'tasklist_card'}>
              <Tile>
                <div style={{paddingBottom: '30px'}}>
                  <h4 style={{float: 'left'}}>Backlog</h4>
                  <TaskAdd style={{float: 'right'}} size={32} onClick={() => showModal(true)} />

                </div>

                <hr />
                {
                  state1.reducer.loading ?
                      <ul>
                        <ListItems elements={state1.reducer.tasks} statusType={'Backlog'} updateElements={updateElements} />

                      </ul> :<></>
                }

              </Tile>
            </Column>
            <Column md={8} lg={4} sm={4} className={'tasklist_card'}>
              <Tile>
                <div style={{paddingBottom: '30px'}}>
                  <h4 style={{float: 'left'}}>InProgress</h4>
                  <TaskAdd style={{float: 'right'}} size={32} onClick={() => showModal(true)} />

                </div>
                <hr />
                {
                  state1.reducer.loading  ?
                      <ul>
                        <ListItems elements={state1.reducer.tasks} statusType={'InProgress'} updateElements={updateElements} />

                      </ul> :<></>
                }
              </Tile>
            </Column>
            <Column md={8} lg={4} sm={4} className={'tasklist_card'}>
              <Tile>
                <div style={{paddingBottom: '30px'}}>
                  <h4 style={{float: 'left'}}>Closed</h4>
                  <TaskAdd style={{float: 'right'}} size={32} onClick={() => showModal(true)}/>

                </div>
                <hr />
                {
                  state1.reducer.loading  ?
                      <ul>
                        <ListItems elements={state1.reducer.tasks} statusType={'Closed'} updateElements={updateElements} />


                      </ul> :<></>
                }
              </Tile>
            </Column>
            <Column md={8} lg={1} sm={4} >

            </Column>
          </Grid>
        </Column>

      </Grid>
  )
};


function reducer(modalState, action) {
  switch (action.type) {
    case 'name':
      return {
        ...modalState,
        name: action.value
      }
    case 'dueBy': {
      return {
        ...modalState,
        dueBy: action.value ? action.value : new Date(Date.now()).toLocaleString('en-GB', {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit"
        })
      }

    }
    case 'taskStatus': {
      return {
        ...modalState,
        taskStatus: action.value
      }
    }
    case 'notes': {
      return {
        ...modalState,
        notesSection: action.value
      }
    }
    case 'subTasks': {
      let arr = [...action.value]
      return {
        ...modalState,
        subTasks: arr
      }
    }
    case 'timestamp': {
      return {
        ...modalState,
        timestamp: action.value
      }
    }
    case 'notesSection': {
      return {
        ...modalState,
        notesSection: action.value
      }
    }
    default:
      return modalState;
  }
}

export default TaskList;
