import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useHomeStateContext } from '../context/Home';
import { useTaskStateContext } from '../context/Task';
import { Task, IColumn } from '../interfaces';

const AddTask = () => {
  const {
    boards, 
    setBoards, 
    boardSelectedId
  } = useHomeStateContext();

  const {
    setDisplayAddTask,
    displayAddTaskSelectColumn, 
    setDisplayAddTaskSelectColumn, 
    addTaskInputs, 
    setAddTaskInputs, 
    onChangeAddTaskInputs, 
    checkAddTaskFormErrors, 
    addTaskErrors
  } = useTaskStateContext();

  let completeBoardSelected = boards.find((board) => board.id === boardSelectedId);

  useEffect(() => {
    setAddTaskInputs({ ...addTaskInputs, status: { value: completeBoardSelected?.columns[0].name || '', columnId: completeBoardSelected?.columns[0].id || '' } })
  }, []);
  
  const createTask = async (status: { value: string, columnId: string }) => {
    const task = {
      title: addTaskInputs.title,
      description: addTaskInputs.description,
      subtasks: addTaskInputs.subtasks.map((sub) => ({ title: sub.name, isCompleted: false })),
      status: status.value,
      columnId: status.columnId,
    };

    let res = await fetch("api/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    });

    const newTask = await res.json();

    const newBoards = boards.map((board) => {
      if (board.id === boardSelectedId) {
        const newTasks: Task[] = [];
        const newColumns: IColumn[] = [];
        board.columns.forEach((col) => {
          if (col.id === newTask[0].columnId) {
            col.tasks?.forEach((task) => {
              newTasks.push(task);
            });
            newTasks.push(newTask[0]);
            newColumns.push({ ...col, tasks: newTasks });
          }
          else newColumns.push({ ...col });
        });
        return { ...board, columns: newColumns };
      }
      else return { ...board };
    });

    setBoards(newBoards);
    setDisplayAddTask(false);
    setAddTaskInputs({
      title: '',
      description: '',
      subtasks: [{ id: '1', name: '' }],
      status: { value: '', columnId: '' }
    });

    toast.success(`${newTask[0].title} Task has been created !`);
  };

  return (
    <>
      <div onClick={() => setDisplayAddTask(false)}></div>
      <div>
        <p>Add New Task</p>
        <div>
          <label htmlFor='title'>Title</label>
          <input value={addTaskInputs.title} onChange={(e) => setAddTaskInputs({ ...addTaskInputs, title: e.target.value })} id="task_title" name='title' />
        </div>
        <div>
          <label htmlFor='description'>Description</label>
          <textarea value={addTaskInputs.description} onChange={(e) => setAddTaskInputs({ ...addTaskInputs, description: e.target.value })} id="task_description" name='description' />
        </div>
        <p>Subtasks</p>
        <div>
          {
            addTaskInputs.subtasks.map((subtask: { id: string, name: string }) => (
              <div key={subtask.id}>
                <textarea value={subtask.name} onChange={(e) => onChangeAddTaskInputs('subtasks', 'changeName', subtask.id, e.target.value)} />
              </div>
            ))
          }
        </div>
        <button onClick={() => onChangeAddTaskInputs('subtasks', 'add', '', '')}>+ Add New Subtask</button>
        <div>
          <p>Status</p>
          <div onClick={() => setDisplayAddTaskSelectColumn(true)}>
            <p>{addTaskInputs.status.value}</p>
          </div>
          {
            displayAddTaskSelectColumn && (
              <div>
                {
                  completeBoardSelected?.columns.map((col) => (
                    <div key={col.id} onClick={() => {
                      setAddTaskInputs({ ...addTaskInputs, status: { value: col.name, columnId: col.id } });
                      setDisplayAddTaskSelectColumn(false);
                    }}>
                      <p>{col.name}</p>
                    </div>
                  ))
                }
              </div>
            )
          }
        </div>
        <button onClick={() => {
          let errors = checkAddTaskFormErrors();
          if (!errors) {
            createTask(addTaskInputs.status);
          }
        }}>Create Task</button>
      </div>
    </>
  );
}

export default AddTask;
