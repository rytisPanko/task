import React from 'react';
import { useHomeStateContext } from '../context/Home';
import { useBoardStateContext } from '../context/Board';
import toast from 'react-hot-toast';

const DeleteModal = () => {
  const { boards, setBoards, boardSelectedId } = useHomeStateContext();
  const { displayDeleteModal, setDisplayDeleteModal } = useBoardStateContext();

  const completeBoardSelected = boards.find((board) => board.id === boardSelectedId);
  let completeTaskSelected;

  if (displayDeleteModal.mode === 'task') {
    for (let board of boards) {
      for (let column of board.columns) {
        if (column.tasks) {
          completeTaskSelected = column.tasks.find((task) => task.id === displayDeleteModal.id);
          if (completeTaskSelected) break;
        }
      }
      if (completeTaskSelected) break;
    }
  }

  const deleteThis = async () => {
    if (displayDeleteModal.mode === 'board') {
      await deleteBoard();
    } else {
      await deleteTask();
    }
  }

  const deleteBoard = async () => {
    let body = { boardId: displayDeleteModal.id }
    let res = await fetch("api/board", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const deletedBoard = await res.json();

    const newBoards = boards.filter(board => board.id !== deletedBoard.id);
    setBoards(newBoards);
    setDisplayDeleteModal({ display: false, mode: '', id: '' });
    toast.success(`${deletedBoard.name} has been deleted!`);
  }

  const deleteTask = async () => {
    let body = { taskId: displayDeleteModal.id }
    let res = await fetch("api/task", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const deletedTask = await res.json();

    const newBoards = boards.map((board) => {
      if (board.id === boardSelectedId) {
        const newColumns = board.columns.map(column => {
          if (column.id === deletedTask.columnId) {
            const newTasks = column.tasks ? column.tasks.filter(task => task.id !== deletedTask.id) : [];

            return { ...column, tasks: newTasks };
          }
          return column;
        });
        return { ...board, columns: newColumns };
      }
      return board;
    });

    setBoards(newBoards);
    setDisplayDeleteModal({ display: false, mode: '', id: '' });
    toast.success(`${deletedTask.title} has been deleted!`);
  }

  return (
    <div>
      <div onClick={() => setDisplayDeleteModal({ display: false, mode: '', id: '' })}></div>
      <div>
        <p>Delete this {displayDeleteModal.mode}?</p>
        {displayDeleteModal.mode === 'board' && <p>Are you sure you want to delete the board?</p>}
        {displayDeleteModal.mode === 'task' && <p>Are you sure you want to delete the task?</p>}
        <button onClick={deleteThis}>Delete</button>
        <button onClick={() => setDisplayDeleteModal({ display: false, mode: '', id: '' })}>Cancel</button>
      </div>
    </div>
  );
}

export default DeleteModal;
