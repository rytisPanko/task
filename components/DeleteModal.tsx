import React, { useState } from 'react'
import { useHomeStateContext } from '../context/Home';
import { useBoardStateContext } from '../context/Board';
import { IBoard, IColumn, Task } from '../interfaces';
import toast from 'react-hot-toast';

const DeleteModal = () => {
  const { boards, setBoards, boardSelectedId, setBoardSelectedId } = useHomeStateContext();
  const { displayDeleteModal, setDisplayDeleteModal } = useBoardStateContext();
  let completeBoardSelected = boards.find((board) => board.id === boardSelectedId);
  let completeTaskSelected;

  if (displayDeleteModal.mode === 'task') {
    for (let b of boards) {
      for (let c of b.columns) {
        if (c.tasks) {
          for (let t of c.tasks) {
            if (t.id === displayDeleteModal.id) {
              completeTaskSelected = t;
            }
          }
        }
      }
    }
  }

  const deleteThis = async () => {
    if (displayDeleteModal.mode === 'board') {
      let body = { boardId: displayDeleteModal.id }
      let res = await fetch("api/board", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      const deletedBoard = await res.json();
      console.log("Ištrinta sėkmingai", { deletedBoard });

      const newBoards: IBoard[] = [];
      boards.forEach((board) => {
        if (board.id !== deletedBoard.id) {
          newBoards.push(board)
        }
      });
      setBoards(newBoards);
      if (newBoards[0]) {
        setBoardSelectedId(newBoards[0].id);
      }
      setDisplayDeleteModal({ display: false, mode: '', id: '' });
      toast.success(`${deletedBoard.name} ištrinta !`);
    }
    else {
      let body = { taskId: displayDeleteModal.id }
      let res = await fetch("api/task", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      const deletedTask = await res.json();
      console.log("Ištrinta task sėkmingai", { deletedTask });

      const newBoards = boards.map((board) => {
        if (board.id === boardSelectedId) {
          const newTasks: Task[] = [];
          const newColumns: IColumn[] = [];
          board.columns.forEach((col) => {
            if (col.id === deletedTask.columnId) { 
              col.tasks?.forEach((task) => {
                if (task.id !== deletedTask.id) {
                  newTasks.push(task);
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
      setDisplayDeleteModal({ display: false, mode: '', id: '' });
      toast.success(`${deletedTask.title} ištrinta !`);
    }
  }
  return (
    <>
    
      <div onClick={() => setDisplayDeleteModal({ display: false, mode: '', id: '' })} className='w-screen h-screen absolute bg-black/50 z-20 top-0' />
      <div className='w-[480px] min-h-[229px] flex flex-col justify-between p-8 rounded-md bg-white dark:bg-darkBg absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 z-20'>
        <p className='text-hL text-red font-bold'>Trinti {displayDeleteModal.mode} lenta ?</p>
        {
          displayDeleteModal.mode === 'board' && (
            <p className='text-bL text-mediumGrey'>Ar tikrai norite ištrinti ‘{completeBoardSelected?.name}’ lentą?</p>
          )
        }
        {
          displayDeleteModal.mode === 'task' && completeTaskSelected !== null && (
            <p className='text-bL text-mediumGrey'>Ar tikrai norite ištrinti  ‘{completeTaskSelected?.title}’ task ?</p>
          )
        }
        <div className='w-full flex justify-between items-center'>
          <button onClick={() => deleteThis()} className='w-[200px] h-[40px] text-bL font-bold bg-red hover:bg-redHover text-white rounded-[20px]'>Trinti</button>
          <button onClick={() => setDisplayDeleteModal({ display: false, mode: '', id: '' })} className='w-[200px] h-[40px] text-bL font-bold bg-orange/10 dark:bg-white hover:bg-orange/25 text-orange rounded-[20px]'>Atšaukti</button>
        </div>
      </div>
    </>
  )
}

export default DeleteModal
