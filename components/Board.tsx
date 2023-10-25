import React from 'react';
import { useBoardStateContext } from '../context/Board';
import { useHomeStateContext } from '../context/Home';
import { useTaskStateContext } from '../context/Task';
import { IColumn } from '../interfaces';

const Board = () => {
  const { boardSelectedId, boards, setBoards } = useHomeStateContext();
  const { setDisplayAddEditBoard } = useBoardStateContext();
  const { setViewTask } = useTaskStateContext();
  let completeBoardSelected = boards.find((board) => board.id === boardSelectedId);

  return (
    <>
      {
        completeBoardSelected?.columns.length === 0 && (
          <div>
            <p>This board is empty. Create a new column to get started.</p>
            <button onClick={() => setDisplayAddEditBoard({ display: true, mode: 'EDIT' })} type='button'>+ Add new Column</button>
          </div>
        )
      }
      {
        completeBoardSelected?.columns.length !== 0 && (
          <div>
            {
              completeBoardSelected?.columns.map((col) => (
                <div key={col.id}>
                  <div>
                    <span />
                    <p>{col.name} ({col.tasks?.length})</p>
                  </div>
                  <div>
                    {
                      col.tasks?.map((task) => {
                        let completedSubtasks = 0;
                        task.subtasks?.forEach(sub => sub.isCompleted ? completedSubtasks += 1 : null)
                        return (
                          <div onClick={() => setViewTask({ display: true, task: task, })}>
                            <p>{task.title}</p>
                            <p>{completedSubtasks} of {task.subtasks?.length} subtasks</p>
                          </div>
                        )
                      })
                    }
                    <div />
                  </div>
                </div>
              ))
            }
            <div onClick={() => setDisplayAddEditBoard({ display: true, mode: 'EDIT' })}>
              <p>+ New Column</p>
            </div>
          </div>
        )
      }
    </>
  )
}

export default Board;
