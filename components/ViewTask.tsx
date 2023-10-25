import React from 'react'
import { useHomeStateContext } from '../context/Home';
import { useTaskStateContext } from '../context/Task';
import { IColumn, Task } from '../interfaces';

const ViewTask = () => {
  const { viewTask, setViewTask, displayViewTaskChangeColumn, setDisplayViewTaskChangeColumn, displayModalEditDeleteTask, setDisplayModalEditDeleteTask, setDisplayEditTask } = useTaskStateContext();
  const { boards, setBoards, boardSelectedId } = useHomeStateContext();
  let completeBoardSelected = boards.find((board) => board.id === boardSelectedId);

  const getCompletedSubCount = (task: Task | null) => {
    let count = 0;
    task?.subtasks?.forEach((sub) => {
      if (sub.isCompleted) {
        count++;
      }
    });
    return count;
  }

  const editSubtask = async (subtaskIndex: number) => {
    const newSubtasks = viewTask.task?.subtasks?.map((sub, index) => {
      if (index === subtaskIndex) {
        return {
          ...sub,
          isCompleted: !sub.isCompleted
        }
      }
      else return { ...sub }
    })
    const task = {
      ...viewTask.task, subtasks: newSubtasks,
    };

    let res = await fetch("api/task", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    })
    const newTask = await res.json();
    console.log("Editing Task successful", { newTask });

    const newBoards = boards.map((board) => {
      if (board.id === boardSelectedId) {
        const newTasks: Task[] = [];
        const newColumns: IColumn[] = [];
        board.columns.forEach((col) => {
          if (col.id === newTask[0].columnId) {
            col.tasks?.forEach((task) => {
              if (task.id === newTask[0].id) {
                newTasks.push(newTask[0]);
              }
              else newTasks.push(task)
            })
            newColumns.push({ ...col, tasks: newTasks })
          }
          else newColumns.push({ ...col })
        })
        return { ...board, columns: newColumns }
      }
      else return { ...board }
    });
    setBoards(newBoards);
    setViewTask({ ...viewTask, task: newTask[0] });
  }

  const editColumnTask = async (newColumnTask: IColumn) => {
    let task = {
      ...viewTask.task,
      status: newColumnTask.name,
      columnId: newColumnTask.id,
    }

    let res = await fetch("api/task", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, column: { id: newColumnTask.id, task } })
    })
    const newTask = await res.json();
    console.log("Editing Column Task Successful", { newTask });

    const newBoards = boards.map((board) => {
      if (board.id === boardSelectedId) {
        let newTasks: Task[] = [];
        const newColumns: IColumn[] = [];
        board.columns.forEach((col) => {
          newTasks = [];
          if (col.id === newTask[0].columnId) {
            col.tasks?.forEach((task) => newTasks.push(task));
            newTasks.push(newTask[0]);
            newColumns.push({ ...col, tasks: newTasks })
          }
          else if (col.id === viewTask.task?.columnId) {
            col.tasks?.forEach((task) => {
              if (task.id !== newTask[0].id) {
                newTasks.push(task)
              }
            })
            newColumns.push({ ...col, tasks: newTasks })
          }
          else newColumns.push({ ...col })
        })
        return { ...board, columns: newColumns }
      }
      else return { ...board }
    });
    setBoards(newBoards);
    setViewTask({ ...viewTask, task: newTask[0] });
  }

  return (
    <>
      <div onClick={() => setViewTask({ display: false, task: null })}></div>
      <div>
        <div>
          <p>{viewTask.task?.title}</p>
        </div>
        <p>{viewTask.task?.description}</p>
        <p>Subtasks ({getCompletedSubCount(viewTask.task)} of {viewTask.task?.subtasks?.length})</p>
        <div>
          {
            viewTask.task?.subtasks?.map((subtask, index) => (
              <div onClick={(e) => {
                const target = e.target as Element;
                if (!target.id.includes('inputCheckbox')) {
                  editSubtask(index)
                }
              }} key={subtask.title}>
                <input id={`inputCheckbox-${index}`} checked={subtask.isCompleted} onClick={() => { }} onChange={() => { }} type="checkbox" />
                <label htmlFor={`inputCheckbox-${index}`}>{subtask.title}</label>
              </div>
            ))
          }
        </div>
        <div>
          <p>Current Status</p>
          <div onClick={() => setDisplayViewTaskChangeColumn(true)}>
            <p>{viewTask.task?.status}</p>
            <svg width="10" height="7" xmlns="http://www.w3.org/2000/svg"><path stroke="#635FC7" strokeWidth="2" fill="none" d="m1 1 4 4 4-4" /></svg>
          </div>
          {
            displayViewTaskChangeColumn && (
              <div>
                {
                  completeBoardSelected?.columns.map((col) => (
                    <div key={col.id} onClick={() => {
                      if (col.id !== viewTask.task?.columnId) {
                        editColumnTask(col);
                      }
                      setDisplayViewTaskChangeColumn(false);
                    }}>
                      <p>{col.name}</p>
                    </div>
                  ))
                }
              </div>
            )
          }
        </div>
      </div>
    </>
  )
}

export default ViewTask





