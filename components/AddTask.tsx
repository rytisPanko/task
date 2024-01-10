import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useHomeStateContext } from '../context/Home';
import { useTaskStateContext } from '../context/Task';
import { Task, IColumn } from '../interfaces';

const AddTask = () => {
  const { boards, setBoards, boardSelectedId } = useHomeStateContext();
  const { setDisplayAddTask, displayAddTaskSelectColumn, setDisplayAddTaskSelectColumn, addTaskInputs, setAddTaskInputs, onChangeAddTaskInputs, checkAddTaskFormErrors, addTaskErrors } = useTaskStateContext();
  let completeBoardSelected = boards.find((board) => board.id === boardSelectedId);

  useEffect(() => {
    setAddTaskInputs({ ...addTaskInputs, status: { value: completeBoardSelected?.columns[0].name ? completeBoardSelected?.columns[0].name : '', columnId: completeBoardSelected?.columns[0].id ? completeBoardSelected?.columns[0].id : '' } })
  }, [])
  
  const createTask = async (status: { value: string, columnId: string }) => {
    const task = {
      title: addTaskInputs.title,
      description: addTaskInputs.description,
      subtasks: addTaskInputs.subtasks.map((sub) => ({ title: sub.name, isCompleted: false })),
      status: status.value,
      columnId: status.columnId,
    }

    let res = await fetch("api/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    })
    const newTask = await res.json();
    console.log("Sukurta sėkmingai", { newTask });

    const newBoards = boards.map((board) => {
      if (board.id === boardSelectedId) {
        const newTasks: Task[] = [];
        const newColumns: IColumn[] = [];
        board.columns.forEach((col) => {
          if (col.id === newTask[0].columnId) {
            col.tasks?.forEach((task) => {
              newTasks.push(task);
            })
            newTasks.push(newTask[0]);
            newColumns.push({ ...col, tasks: newTasks })
          }
          else newColumns.push({ ...col })
        })
        return { ...board, columns: newColumns }
      }
      else return { ...board }
    })

    setBoards(newBoards);
    setDisplayAddTask(false);
    setAddTaskInputs({
      title: '',
      description: '',
      subtasks: [{ id: '1', name: '' }],
      status: { value: '', columnId: '' }
    })
    toast.success(`${newTask[0].title} Task sukurta !`);
  }
  return (
    <>
      <div onClick={() => setDisplayAddTask(false)} className='w-screen h-screen absolute bg-black/50 z-20 top-0' />
      <div className='w-[480px] min-h-[585px] flex flex-col p-8 rounded-md bg-white dark:bg-darkGrey absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 z-20'>
        <p className='text-hL font-bold dark:text-white'>Pridėti naują Task</p>
        <div className='w-full h-[68px] flex flex-col justify-between my-6'>
          <label htmlFor='title' className='flex items-center font-bold text-bL text-mediumGrey dark:text-white'>Pavadinimas{addTaskErrors.title && <span className='text-bL text-red ml-2'>Negali buti tuščia</span>}</label>
          <input value={addTaskInputs.title} onChange={(e) => setAddTaskInputs({ ...addTaskInputs, title: e.target.value })} className='w-full h-[40px] px-4 py-2 text-bL dark:bg-darkGrey dark:text-white border border-mediumGrey/25 focus:border-orange focus:border-2 focus:px-[15px] outline-0 rounded' id="task_title" name='title' />
        </div>
        <div className='w-full h-[142px] flex flex-col justify-between'>
          <label htmlFor='description' className='flex items-center font-bold text-bL text-mediumGrey dark:text-white'>Aprašymas{addTaskErrors.description && <span className='text-bL text-red ml-2'>Negali buti tuščia</span>}</label>
          <textarea value={addTaskInputs.description} onChange={(e) => setAddTaskInputs({ ...addTaskInputs, description: e.target.value })} className='w-full h-[112px] px-4 py-2 text-bL dark:bg-darkGrey dark:text-white border border-mediumGrey/25 focus:border-orange focus:border-2 focus:px-[15px] outline-0 rounded resize-none' id="task_description" name='description' />
        </div>
  
        <p className='font-bold text-bL text-mediumGrey dark:text-white mt-6 mb-2'>Papildomai</p>
        <div className='w-full flex flex-col'>
          {
            addTaskInputs.subtasks.map((subtask) => (
              <div key={subtask.id} className='w-full h-[40px] flex justify-between items-center mb-3 relative'>
                <textarea value={subtask.name} onChange={(e) => onChangeAddTaskInputs('subtasks', 'changeName', subtask.id, e.target.value)} className='w-[385px] h-full px-4 py-2 text-bL dark:bg-darkGrey dark:text-white border border-mediumGrey/25 focus:border-orange focus:border-2 focus:px-[15px] outline-0 rounded' />
                {addTaskErrors.subtasks.includes(subtask.id) && <p className='text-bL text-red absolute right-[47px]'>Negali buti tuščia</p>}
                <svg onClick={() => onChangeAddTaskInputs('subtasks', 'delete', subtask.id, '')} className='fill-mediumGrey hover:fill-red cursor-pointer' width="15" height="15" xmlns="http://www.w3.org/2000/svg"><g fillRule="evenodd"><path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" /><path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" /></g></svg>
              </div>
            ))
          }
        </div>
        <button onClick={() => onChangeAddTaskInputs('subtasks', 'add', '', '')} className='w-full h-[40px] bg-orange/10 dark:bg-white hover:bg-orange/30 text-orange font-bold text-bL rounded-[20px]'>+ Pridėti naują Subtask</button>
        <div className='w-full h-[68px] flex flex-col justify-between my-6 relative'>
          <p className='font-bold text-bL text-mediumGrey dark:text-white'>Status</p>
          <div onClick={() => setDisplayAddTaskSelectColumn(true)} className={`w-full h-10 flex items-center justify-between px-4 py-2 border border-mediumGrey/25 hover:border-orange ${displayAddTaskSelectColumn ? 'border-orange' : ''} rounded cursor-pointer`}>
            <p className='text-bL dark:text-white'>{addTaskInputs.status.value}</p>
            <svg className={`${displayAddTaskSelectColumn ? 'rotate-180' : ''}`} width="10" height="7" xmlns="http://www.w3.org/2000/svg"><path stroke="#FFA500" strokeWidth="2" fill="none" d="m1 1 4 4 4-4" /></svg>
          </div>
          {
            displayAddTaskSelectColumn && (
              <div className='w-[416px] bg-white dark:bg-darkBg flex flex-col absolute top-[75px] z-10 rounded-lg shadow-[0_10px_20px_rgba(54,78,126,0.25)] closeModalSelectColumnOff'>
                {
                  completeBoardSelected?.columns.map((col) => (
                    <div key={col.id} onClick={() => {
                      setAddTaskInputs({ ...addTaskInputs, status: { value: col.name, columnId: col.id } });
                      setDisplayAddTaskSelectColumn(false);
                    }} className='w-full h-[50px] flex items-center group hover:bg-orange cursor-pointer hover:first:rounded-t-lg hover:last:rounded-b-lg px-4'>
                      <p className='text-bL text-mediumGrey group-hover:text-white'>{col.name}</p>
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
            createTask(addTaskInputs.status)
          }
        }} className='h-10 w-full rounded-[20px] font-bold bg-orange hover:bg-orangeHover text-white text-bL'>Sukūrti</button>
      </div>
    </>
  )
  
}

export default AddTask