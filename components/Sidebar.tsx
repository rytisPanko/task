import React from 'react'
import { useHomeStateContext } from '../context/Home';
import { useBoardStateContext } from '../context/Board';


const Sidebar = () => {
  const { boards, boardSelectedId, setBoardSelectedId, showSidebar, setShowSidebar, darkMode, setDarkMode } = useHomeStateContext();
  const { setDisplayAddEditBoard } = useBoardStateContext();
  return (
    <>
      {
        showSidebar && (
          <div>
            <div>
              <p> ALL BOARDS {boards.length} </p>
              <div>
                {
                  boards.map((board) => (
                    <div key={board.id} onClick={() => setBoardSelectedId(board.id)} className={`w-92/100 max-w-[276px] h-[48px] flex flex-row items-center pl-8 cursor-pointer text-mediumGrey font-bold ${boardSelectedId === board.id ? `bg-purple` : 'hover:bg-purpleHover/30 dark:hover:bg-white'} group rounded-r-[100px]`}>
                     
                     <p>{board.name}</p>

                    </div>
                  ))
                }

                <div onClick={() => setDisplayAddEditBoard({ display: true, mode: 'ADD' })} className='w-[276px] h-[48px] flex flex-row items-center pl-8 cursor-pointer text-mediumGrey font-bold hover:last:text-purple hover:bg-purpleHover/30 dark:hover:bg-white hover:first:fill-purple group rounded-r-[100px]'>
                 
                  <p> + Create New Board</p>
                </div>
              </div>
            </div>
            
          </div>
        )
      }
     
    </>
  )
}

export default Sidebar