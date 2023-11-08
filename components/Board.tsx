import React from 'react'
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
          <div className='w-[80%] h-full flex items-center justify-center flex-col'>
            <p className='text-mediumGrey text-hL mb-8'>Ši lenta tuščia,pradėkite kurti</p>
            <button onClick={() => setDisplayAddEditBoard({ display: true, mode: 'EDIT' })} type='button' className='w-[174px] h-[48px] bg-orange hover:bg-orangeHover text-white rounded-full'>+ Pridėti naują stulpelį</button>
          </div>
        )
      }
      {
        completeBoardSelected?.columns.length !== 0 && (
          <div className=' h-full flex p-6 overflow-x-scroll scrollbar'>
            {
              completeBoardSelected?.columns.map((col, index) => (
                <div key={col.id} className='min-w-[280px] w-[280px] flex flex-col mr-6'>
                  <div className='h-[15px] flex items-center mb-6'>
                  <span className={`w-[15px] h-[15px] ${index % 3 === 0 ? 'bg-[#FF0000]' : index % 3 === 1 ? 'bg-orange' : 'bg-blue-500' } rounded-full mr-3`} />
                    <p className='font-bold text-mediumGrey tracking-S text-bL'>{col.name} ({col.tasks?.length})</p>
                  </div>
                  <div className='w-full flex flex-col'>
                    {
                      col.tasks?.map((task, index) => {
                        let completedSubtasks = 0;
                        task.subtasks?.forEach(sub => sub.isCompleted ? completedSubtasks += 1 : null)
                        return (
                          <div key={task.id} onClick={() => setViewTask({ display: true, task: task, })} className='w-full flex flex-col bg-white dark:bg-darkGrey group px-4 py-6 cursor-pointer mb-5 last:mb-0 rounded-lg'>
                            <p className='text-hM font-bold dark:text-white group-hover:text-orange mb-2'>{task.title}</p>
                            <p className='text-hS font-bold text-mediumGrey'>{completedSubtasks} of {task.subtasks?.length} subtasks</p>
                          </div>
                        )
                      })
                    }
                    <div className='w-full h-[20px] bg-transparent' />
                  </div>
                </div>
              ))
            }
            <div onClick={() => setDisplayAddEditBoard({ display: true, mode: 'EDIT' })} className='min-w-[280px] flex items-center justify-center group bg-[#E9EFFA]/50 hover:bg-[#E9EFFA] dark:bg-darkGrey/50 dark:hover:bg-darkGrey cursor-pointer rounded-md'>
              <p className='text-hXL text-mediumGrey group-hover:text-orange font-bold'>+ Naujas stulpelis</p>
            </div>
          </div>
        )
      }
    </>
  )
}

export default Board
