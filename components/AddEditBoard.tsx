import React, { useEffect, useState } from 'react'
import { useHomeStateContext } from '../context/Home';
import { useBoardStateContext } from '../context/Board';
import toast from 'react-hot-toast';
import { IColumn } from '../interfaces';

const AddEditBoard = () => {
  const { boards, setBoards, boardSelectedId, setBoardSelectedId } = useHomeStateContext();
  const { displayAddEditBoard, setDisplayAddEditBoard, addBoardInputs, setAddBoardInputs, editBoardInputs, setEditBoardInputs, onChangeAddBoards, onChangeEditBoards } = useBoardStateContext();
  const [errorColumnTasks, setErrorColumnTasks] = useState(false)

  let completeBoardSelected = boards.find((board) => board.id === boardSelectedId);

  useEffect(() => {
    if (displayAddEditBoard.mode === 'EDIT') {
      if (completeBoardSelected) {
        const inputs = { name: completeBoardSelected?.name, columns: completeBoardSelected?.columns.map((col) => ({ id: col.id, name: col.name })) }
        setEditBoardInputs(inputs)
      }
    }
  }, [displayAddEditBoard])

  const addEditBoard = async (mode: string) => {
    setErrorColumnTasks(false);
    if (mode === 'ADD') {
      let board = {
        id: completeBoardSelected?.id,
        name: addBoardInputs.name,
        columns: addBoardInputs.columns.map((column) => ({
          name: column.name,
          tasks: [],
        }))
      }
      let res = await fetch("api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(board)
      })
      const newBoard = await res.json();
      console.log("Creating board successful", { newBoard });

      const newBoards = boards.map((board) => ({ ...board }));
      newBoards.push({ ...newBoard[0] })
      setBoards(newBoards);
      setBoardSelectedId(newBoard[0].id);
      setDisplayAddEditBoard({ display: false, mode: '' });
      toast.success(`${newBoard[0].name} has been created !`);
    }
    else {
      let board = {
        id: completeBoardSelected?.id,
        name: editBoardInputs.name,
        columns: editBoardInputs.columns.map((column) => ({
          id: column.id,
          name: column.name,
        }))
      }
      let res = await fetch("api/board", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(board)
      })

      const allResponses = await res.json();
      console.log("Editing board successful", { allResponses });
      const newBoard = {
        id: allResponses.updateBoard[0].id,
        name: allResponses.updateBoard[0].name,
        userId: allResponses.updateBoard[0].userId,
        columns: allResponses.updateColumns,
      }
      const newBoards = boards.map((board) => {
        if (board.id === newBoard.id) {
          return newBoard
        }
        else {
          return board;
        }
      });
      setBoards(newBoards);
      setBoardSelectedId(newBoard.id);
      setDisplayAddEditBoard({ display: false, mode: '' });
      toast.success(`${newBoard.name} has been edited !`);
    }

  }

  const addColumnEditMode = async () => {
    let body = { boardId: boardSelectedId };
    let res = await fetch("api/column", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const newColumn: IColumn = await res.json();
    console.log("addColumnViaBoard succesful", { newColumn });
    onChangeEditBoards(newColumn.id, '', 'add');

    const newBoards = boards.map((board) => {
      if (board.id === boardSelectedId) {
        const newColumns = board.columns;
        newColumns.push(newColumn)
        return {
          ...board,
          columns: newColumns
        }
      }
      return board;
    })
    setBoards(newBoards);
  }

  const deleteColumnEditMode = async (columnId: string) => {
    let body = { columnId, };
    let res = await fetch("api/column", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    console.log(res)
    if (res.status === 500) {
      setErrorColumnTasks(true);
    }
    else {
      setErrorColumnTasks(false);
      onChangeEditBoards(columnId, '', 'delete');

      const newBoards = boards.map((board) => {
        if (board.id === boardSelectedId) {
          const newColumns = board.columns.filter((col) => col.id !== columnId)
          return {
            ...board,
            columns: newColumns
          }
        }
        return board;
      })
      setBoards(newBoards);
    }
  }

  return (
    <div>
      <p>{displayAddEditBoard.mode === 'ADD' ? 'Add New' : `Edit ${completeBoardSelected?.name}`} Board</p>
      
      <label htmlFor='name'>Board Name</label>
      <input value={displayAddEditBoard.mode === 'ADD' ? addBoardInputs.name : editBoardInputs.name} onChange={(e) => {
        if (displayAddEditBoard.mode === 'ADD') {
          setAddBoardInputs({ ...addBoardInputs, name: e.target.value })
        }
        else {
          setEditBoardInputs({ ...editBoardInputs, name: e.target.value })
        }
      }} id="board_name" name='name' />
      
      <p>Board Columns</p>
      {displayAddEditBoard.mode === 'ADD' && addBoardInputs.columns.map((column) => (
        <div key={column.id}>
          <input value={column.name} onChange={(e) => onChangeAddBoards(column.id, e.target.value, 'changeName')} />
          <button onClick={(e) => onChangeAddBoards(column.id, '', 'deleting')}>Delete</button>
        </div>
      ))}
      
      {displayAddEditBoard.mode === 'EDIT' && editBoardInputs.columns.map((column) => (
        <div key={column.id}>
          <input value={column.name} onChange={(e) => onChangeEditBoards(column.id, e.target.value, 'changeName')} />
          <button onClick={(e) => deleteColumnEditMode(column.id)}>Delete</button>
        </div>
      ))}
      
      {errorColumnTasks && <p>You cannot delete a column containing tasks</p>}
      
      <button onClick={() => {
        setErrorColumnTasks(false)
        if (displayAddEditBoard.mode === 'ADD') {
          onChangeAddBoards('0', '', 'add')
        }
        else {
          addColumnEditMode();
        }
      }}>+ Add New Column</button>
      
      <button onClick={() => addEditBoard(displayAddEditBoard.mode)}>{displayAddEditBoard.mode === 'ADD' ? 'Create New' : 'Edit'} Board</button>
    </div>
  )
}

export default AddEditBoard