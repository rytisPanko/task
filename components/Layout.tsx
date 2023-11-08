import React, { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
import { useBoardStateContext } from '../context/Board';
import AddEditBoard from './AddEditBoard';
import DeleteModal from './DeleteModal';
import { Toaster } from 'react-hot-toast';
import { useTaskStateContext } from '../context/Task';
import AddTask from './AddTask';
import ViewTask from './ViewTask';
import EditTask from './EditTask';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'Task' }: Props) => {
  const { displayAddEditBoard, displayDeleteModal } = useBoardStateContext();
  const {
    displayAddTask,
    viewTask,
    displayModalEditDeleteTask,
    displayEditTask,
  } = useTaskStateContext();

  return (
    <div className="h-screen relative">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
        />
      </Head>
      <Toaster />
      <Header />
      {displayAddEditBoard.display && <AddEditBoard />}
      {displayDeleteModal.display && <DeleteModal />}
      {displayAddTask && <AddTask />}
      {viewTask.display && <ViewTask />}
      {displayModalEditDeleteTask && <EditTask />}
      {children}
    </div>
  );
};

export default Layout