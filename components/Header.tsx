import React from 'react'
import { useHomeStateContext } from '../context/Home'
import { useBoardStateContext } from '../context/Board'
import { useTaskStateContext } from '../context/Task'
import { signOut } from 'next-auth/react'

const Header = () => {
  const {
    updateBoardModal,
    setUpdateBoardModal,
    boardSelectedId,
    boards
  } = useHomeStateContext()

  const {
    setDisplayAddEditBoard,
    setDisplayDeleteModal
  } = useBoardStateContext()

  const { setDisplayAddTask } = useTaskStateContext()

  let completeBoardSelected = boards.find((board) => board.id === boardSelectedId)

  return (
    <div>
      <div>
        <svg onClick={() => signOut()} width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="16" height="24" fill="none" stroke="#000112" strokeWidth="2"/>
          <path d="M18 13H7M12 8l6 5-6 5" stroke="#000112" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div>
        <h2>{completeBoardSelected?.name}</h2>
        <div>
          <button onClick={() => setDisplayAddTask(true)}>+ Add New Task</button>
          <button onClick={() => setUpdateBoardModal(!updateBoardModal)}>⋮</button>
          {updateBoardModal && (
            <div>
              <p onClick={() => {
                setDisplayAddEditBoard({ display: true, mode: 'EDIT' })
                setUpdateBoardModal(false)
              }}>
                Edit Board
              </p>
              <p onClick={() => {
                setDisplayDeleteModal({ display: true, mode: 'board', id: boardSelectedId })
                setUpdateBoardModal(false)
              }}>
                Delete Board
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
