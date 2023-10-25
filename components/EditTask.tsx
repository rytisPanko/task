import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useHomeStateContext } from '../context/Home';
import { useTaskStateContext } from '../context/Task';
import { IColumn, Task } from '../interfaces';

const EditTask = () => {
    const {
        displayEditTask,
        setDisplayEditTask,
        editTaskInputs,
        setEditTaskInputs,
        editTaskErrors,
        setEditTaskErrors,
        onChangeEditTaskInputs,
        displayEditTaskSelectColumn,
        setDisplayEditTaskSelectColumn,
        checkEditTaskFormErrors,
    } = useTaskStateContext();

    const { boards, setBoards, boardSelectedId } = useHomeStateContext();

    useEffect(() => {
        if (displayEditTask.task) {
            setEditTaskInputs({
                title: displayEditTask.task.title,
                description: displayEditTask.task.description,
                subtasks: displayEditTask.task.subtasks?.map((sub, i) => ({ ...sub, id: (i + 1).toString() })) || [],
                status: { value: displayEditTask.task.status, columnId: displayEditTask.task.columnId }
            });
        }
    }, [displayEditTask]);

    const editTask = async () => {
        const task = {
            id: displayEditTask.task?.id,
            title: editTaskInputs.title,
            description: editTaskInputs.description,
            subtasks: editTaskInputs.subtasks.map((sub) => ({ title: sub.title, isCompleted: sub.isCompleted })),
            status: editTaskInputs.status.value,
            columnId: editTaskInputs.status.columnId,
        };

        let res = await fetch("api/task", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        });
        const newTask = await res.json();
        const newBoards = boards.map((board) => {
            if (board.id === boardSelectedId) {
                const newColumns = board.columns.map((col) => {
                    let newTasks = col.tasks?.filter(task => task.id !== newTask[0].id) || [];
                    if (col.id === newTask[0].columnId) {
                        newTasks.push(newTask[0]);
                    }
                    return { ...col, tasks: newTasks };
                });
                return { ...board, columns: newColumns };
            }
            return board;
        });

        setBoards(newBoards);
        setDisplayEditTask({ display: false, task: null });
        toast.success('Task has been edited');
    };

    return (
        <>
            <button onClick={() => setDisplayEditTask({ display: false, task: null })}>Close</button>
            <h1>Edit Task</h1>
            <label>
                Title
                <input value={editTaskInputs.title} onChange={(e) => setEditTaskInputs({ ...editTaskInputs, title: e.target.value })} />
            </label>
            <label>
                Description
                <textarea value={editTaskInputs.description} onChange={(e) => setEditTaskInputs({ ...editTaskInputs, description: e.target.value })} />
            </label>

            <h2>Subtasks</h2>
            {
                editTaskInputs.subtasks.map((subtask) => (
                    <div key={subtask.id}>
                        <textarea value={subtask.title} onChange={(e) => onChangeEditTaskInputs('subtasks', 'changeName', subtask.id, e.target.value)} />
                        <button onClick={() => onChangeEditTaskInputs('subtasks', 'delete', subtask.id, '')}>Delete</button>
                    </div>
                ))
            }
            <button onClick={() => onChangeEditTaskInputs('subtasks', 'add', '', '')}>Add New Subtask</button>

            <h2>Status</h2>
            <div onClick={() => setDisplayEditTaskSelectColumn(!displayEditTaskSelectColumn)}>
                {editTaskInputs.status.value}
            </div>
            {
                displayEditTaskSelectColumn && (
                    <div>
                        {boards.find(board => board.id === boardSelectedId)?.columns.map(col => (
                            <div key={col.id} onClick={() => {
                                setEditTaskInputs({ ...editTaskInputs, status: { value: col.name, columnId: col.id } });
                                setDisplayEditTaskSelectColumn(false);
                            }}>
                                {col.name}
                            </div>
                        ))}
                    </div>
                )
            }
            <button onClick={editTask}>Edit Task</button>
        </>
    );
}

export default EditTask;
