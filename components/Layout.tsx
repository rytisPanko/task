import React, { ReactNode } from 'react'
import Head from 'next/head'
import Header from './Header'
import { closeModalUpdateBoard } from '../utils/closeModal'
import { useHomeStateContext } from '../context/Home';
import { useBoardStateContext } from '../context/Board';
import AddEditBoard from './AddEditBoard';
import DeleteModal from './DeleteModal';
import { Toaster } from 'react-hot-toast';
import { useTaskStateContext } from '../context/Task';
import AddTask from './AddTask';
import ViewTask from './ViewTask';
import EditTask from './EditTask';

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'TASK' }: Props) => {
  const { updateBoardModal, setUpdateBoardModal } = useHomeStateContext();
  const { displayAddEditBoard, displayDeleteModal } = useBoardStateContext();
  const { displayAddTask, displayAddTaskSelectColumn, setDisplayAddTaskSelectColumn, viewTask, displayViewTaskChangeColumn, setDisplayViewTaskChangeColumn, displayModalEditDeleteTask, setDisplayModalEditDeleteTask, displayEditTask, displayEditTaskSelectColumn, setDisplayEditTaskSelectColumn } = useTaskStateContext();

  return (
    <div onClick={(e) => {
      if (updateBoardModal) {
        if (closeModalUpdateBoard('closeModalUpdateBoardOff', e)) {
          setUpdateBoardModal(false)
        }
      }
      if (displayAddTaskSelectColumn) {
        if (closeModalUpdateBoard('closeModalSelectColumnOff', e)) {
          setDisplayAddTaskSelectColumn(false)
        }
      }
      if (displayViewTaskChangeColumn) {
        if (closeModalUpdateBoard('closeModalViewTaskChangeColumnOff', e)) {
          setDisplayViewTaskChangeColumn(false)
        }
      }
      if (displayModalEditDeleteTask) {
        if (closeModalUpdateBoard('closeModalEditDeleteTaskOff', e)) {
          setDisplayModalEditDeleteTask(false)
        }
      }
      if (displayEditTaskSelectColumn) {
        if (closeModalUpdateBoard('closeModalSelectColumnOff', e)) {
          setDisplayEditTaskSelectColumn(false)
        }
      }
    }}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Toaster />
      <Header />
      {displayAddEditBoard.display && (<AddEditBoard />)}
      {displayDeleteModal.display && (<DeleteModal />)}
      {displayAddTask && (<AddTask />)}
      {viewTask.display && (<ViewTask />)}
      {displayEditTask.display && (<EditTask />)}
      {children}
    </div>
  )
}

export default Layout
