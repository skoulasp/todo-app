import { useEffect, useReducer, useState } from "react";
import TodoItems from "./TodoItems";

const reducer = (todos, { type, payload }) => {
    switch (type) {
        case "ADD":
            return [...todos, { name: payload.name, completed: false, id: crypto.randomUUID() }];
        case "EDIT":
            return todos.map((todo) => (todo.id === payload.id ? { ...todo, name: payload.name } : todo));
        case "COMPLETED":
            return todos.map((todo) => (todo.id === payload.id ? { ...todo, completed: payload.completed } : todo));
        case "DELETE":
            return todos.filter((todo) => todo.id !== payload.todo.id);
        case "REORDER":
            return payload;
        default:
            return todos;
    }
};

const LOCAL_STORAGE_KEY = "TODOS";

function TodoForm() {
    const [newTodo, setNewTodo] = useState("");
    const [todos, dispatch] = useReducer(reducer, [], () => {
        const value = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (value === null) return [];
        return JSON.parse(value);
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    const handleAddTodo = (e) => {
        e.preventDefault();
        if (newTodo.trim()) {
            dispatch({ type: "ADD", payload: { name: newTodo } });
            setNewTodo("");
        }
    };
    const handleEditTodo = (id, newText) => {
        dispatch({ type: "EDIT", payload: { id, name: newText } });
    };

    const handleToggleCompleted = (id, completed) => {
        dispatch({ type: "COMPLETED", payload: { id, completed } });
    };

    const handleDeleteTodo = (todo) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this todo?");
        if (isConfirmed) {
            dispatch({ type: "DELETE", payload: { todo } });
        } else {
            return;
        }
    };
    const handleReorder = (newOrder) => {
        console.log(newOrder);
        dispatch({ type: "REORDER", payload: newOrder });
    };

    return (
        <div className="todo-contents">
            <TodoItems
                todos={todos}
                onToggleCompleted={handleToggleCompleted}
                onEditTodo={handleEditTodo}
                onCompletedTodo={handleToggleCompleted}
                onDeleteTodo={handleDeleteTodo}
                onReorder={handleReorder}
            />
            <form onSubmit={handleAddTodo} action="" className="todo-form">
                <label htmlFor="todo-input">Let&quot;s get those todos coming...</label>
                <input
                    type="text"
                    id="todo-input"
                    className="todo-field"
                    name="todo-input"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder='Add a new "todo"'
                    required
                    autoComplete="off"
                />
                <button type="submit">Create New</button>
            </form>
        </div>
    );
}

export default TodoForm;
