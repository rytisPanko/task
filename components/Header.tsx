import React from 'react'
import ellipsis from '../public/assets/icon-vertical-ellipsis.svg';
import Image from 'next/image';
import { useHomeStateContext } from '../context/Home';
import { useBoardStateContext } from '../context/Board';
import { useTaskStateContext } from '../context/Task';
import { signOut } from 'next-auth/react';

const Header = () => {
  const { updateBoardModal, setUpdateBoardModal, boardSelectedId, showSidebar, boards } = useHomeStateContext();
  const { setDisplayAddEditBoard, setDisplayDeleteModal } = useBoardStateContext();
  const { setDisplayAddTask } = useTaskStateContext();
  let completeBoardSelected = boards.find((board) => board.id === boardSelectedId);

  return (
    <div className='flex flex-row items-center justify-start h-[9.5%] dark:bg-darkGrey'>
      <div className={`w-[20%] h-full flex items-center border-r border-linesLight dark:border-linesDark ${showSidebar === false ? 'border-b' : ''}`}>
      <svg onClick={() => signOut()} className='ml-[34px]' width="153" height="26" viewBox="0 0 153 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="35" y="23" fontFamily="Arial" fontSize="28" fill="orange">Task app</text>



<path className='dark:fill-white fill-black' fillRule="evenodd" clipRule="evenodd" fill="#FFA500" />
<rect y="1" width="6" height="25" rx="2" fill="#FFA500" />
<rect opacity="0.75" x="9" y="1" width="6" height="25" rx="2" fill="#FFA500" />
<rect opacity="0.5" x="18" y="1" width="6" height="25" rx="2" fill="#FFA500" />
</svg>

      </div>
      <div className='w-[80%] h-full flex justify-between items-center py-5 px-8 border-b border-b-linesLight dark:border-linesDark'>
  <h2 className='text-hXL font-bold text-black dark:text-white'>{completeBoardSelected?.name}</h2>
  <div className='w-[193px] flex justify-between items-center flex-row relative'>
    <button onClick={() => {
      setDisplayAddTask(true)
    }} className={`h-12 w-[164px] flex justify-center items-center rounded-[24px] font-bold ${completeBoardSelected?.columns.length === 0 ? 'cursor-not-allowed bg-orange/30' : 'bg-orange hover:bg-orangeHover'} text-white`}>+ Pridėti nauja task</button>
    <Image src={ellipsis} alt="ellipsis" className='h-[20px] cursor-pointer closeModalUpdateBoardOff' onClick={() => setUpdateBoardModal(!updateBoardModal)} />
    {
            updateBoardModal && (
              <div className='w-[192px] h-[94px] bg-white dark:bg-darkBg flex flex-col justify-between p-4 absolute top-[62px] z-10 rounded-lg shadow-[0_10px_20px_rgba(54,78,126,0.25)] closeModalUpdateBoardOff'>
                <p onClick={() => {
                  setDisplayAddEditBoard({ display: true, mode: 'EDIT' });
                  setUpdateBoardModal(false);
                }} className='h-[24px] text-mediumGrey text-bL cursor-pointer hover:underline'>Koreguoti lentą</p>
                <p onClick={() => {
                  setDisplayDeleteModal({ display: true, mode: 'board', id: boardSelectedId });
                  setUpdateBoardModal(false);
                }} className='h-[24px] text-bL text-red cursor-pointer hover:underline'>Trinti lentas</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Header
