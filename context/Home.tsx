//pagrindinis puslapio komponentas, kai vartotojas atveria programą ar svetainę

import React, { createContext, useContext, useState } from 'react';
import { IBoard, HomeContextType } from '../interfaces';

type HomeContextProviderProps = {
  children: React.ReactNode;
}

export const HomeContext = createContext({} as HomeContextType)

export const HomeContextProvider = ({ children }: HomeContextProviderProps) => {
  const [updateBoardModal, setUpdateBoardModal] = useState(false);
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [boardSelectedId, setBoardSelectedId] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
 

  return (
    <HomeContext.Provider
      value={{
        updateBoardModal,
        setUpdateBoardModal,
        boards,
        setBoards,
        boardSelectedId,
        setBoardSelectedId,
        showSidebar,
        setShowSidebar
      
      }}>
      {children}
    </HomeContext.Provider>
  )
}

export const useHomeStateContext = () => useContext(HomeContext);