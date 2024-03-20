import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEllipsis, faPen } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TodoItems({ todos, onEditTodo, onCompletedTodo, onDeleteTodo, onReorder }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState({});
    const onDragEnd = (e) => {
        const { active, over } = e;
        if (active.id === over.id) return;
        const oldIndex = todos.findIndex((todo) => todo.id === active.id);
        const newIndex = todos.findIndex((todo) => todo.id === over.id);
        console.log(oldIndex);
        console.log(newIndex);
        console.log(arrayMove(todos, oldIndex, newIndex));
        onReorder(arrayMove(todos, oldIndex, newIndex));
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            const mobileMenuOpenForAnyTodo = Object.values(isMobileMenuOpen).some((isOpen) => isOpen);
            const isClickInsideTodo = e.target.closest(".todo-item-wrapper");

            if (mobileMenuOpenForAnyTodo && !isClickInsideTodo) {
                setIsMobileMenuOpen({});
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsMobileMenuOpen({});
            }
        };

        document.addEventListener("click", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isMobileMenuOpen]);

    return (
        <ul className={`todo-item-list ${Object.values(isMobileMenuOpen).some((value) => value) ? "mobile-menu-open" : ""}`}>
            <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={todos} strategy={rectSortingStrategy}>
                    {todos.length > 0 &&
                        todos.map((todo, i) => (
                            <SortableTodo
                                key={todo.id}
                                todo={todo}
                                onDeleteTodo={onDeleteTodo}
                                onEditTodo={onEditTodo}
                                onCompletedTodo={onCompletedTodo}
                                setIsMobileMenuOpen={setIsMobileMenuOpen}
                                isMobileMenuOpen={isMobileMenuOpen}
                                i={i}
                            />
                        ))}
                </SortableContext>
            </DndContext>
        </ul>
    );
}

const SortableTodo = ({ todo, onDeleteTodo, onEditTodo, onCompletedTodo, isMobileMenuOpen, setIsMobileMenuOpen, i }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id });
    const [isEditing, setIsEditing] = useState({});
    const [editedValue, setEditedValue] = useState({});
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };
    const handleEditClick = (todo) => {
        setIsEditing((prevIsEditing) => ({
            ...prevIsEditing,
            [todo.id]: !prevIsEditing[todo.id],
        }));

        setEditedValue((prevEditedValue) => ({
            ...prevEditedValue,
            [todo.id]: todo.name,
        }));
    };
    const handleSubmit = (todo) => {
        if (isEditing[todo.id]) {
            onEditTodo(todo.id, editedValue[todo.id]);
            setIsEditing((prevIsEditing) => ({
                ...prevIsEditing,
                [todo.id]: !prevIsEditing[todo.id],
            }));
        }
    };
    const toggleMobileMenu = (todo) => {
        setIsMobileMenuOpen((prevIsMobileMenuOpen) => ({
            ...prevIsMobileMenuOpen,
            [todo.id]: !prevIsMobileMenuOpen[todo.id],
        }));
    };
    const handleInputChange = (e, todo) => {
        setEditedValue((prevEditedValue) => ({
            ...prevEditedValue,
            [todo.id]: e.target.value,
        }));
    };
    const handleCompleted = (todo) => {
        onCompletedTodo(todo.id, !todo.completed);
    };

    return (
        <li ref={setNodeRef} style={style} className={`todo-item-wrapper ${todo.completed ? "completed" : ""}`} data-todo-id={todo.id}>
            <span className="counter">#{i + 1}</span>
            <span className="separator-dot"></span>
            {isEditing[todo.id] ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(todo);
                    }}
                >
                    <input
                        autoFocus
                        type="text"
                        value={editedValue[todo.id] || ""}
                        onChange={(e) => handleInputChange(e, todo)}
                        onBlur={() => handleSubmit(todo)}
                        className="edit-mode"
                    />
                    <span className="separator-line"></span>
                    <button type="submit" className="edit-btn">
                        Save
                    </button>
                </form>
            ) : (
                <>
                    <span className="todo-item-text">{todo.name}</span>
                    <span className="separator-line"></span>
                    <button onClick={() => handleEditClick(todo)} className="edit-btn">
                        Edit
                    </button>
                </>
            )}

            <input type="checkbox" className="complete-btn" checked={todo.completed} onChange={() => handleCompleted(todo)} />
            <button
                onClick={() => {
                    onDeleteTodo(todo);
                }}
                className="delete-todo"
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>
            <button
                onClick={() => toggleMobileMenu(todo)}
                className="mobile-todo-nav"
                style={{ padding: 0, border: "none", background: "none" }}
            >
                <FontAwesomeIcon icon={faEllipsis} style={{ fontSize: "2rem" }} />
            </button>
            {isMobileMenuOpen[todo.id] && (
                <div className="mobile-menu">
                    {/* Add your mobile menu items/options here */}
                    <div className="checkbox-complete-wrapper">
                        <input type="checkbox" className="complete-btn" checked={todo.completed} onChange={() => handleCompleted(todo)} />
                    </div>
                    <div
                        onClick={() => {
                            if (!isEditing[todo.id]) {
                                handleEditClick(todo);
                            }
                        }}
                        className={`edit-todo-icon-wrapper ${isEditing[todo.id] ? `editing` : ``}`}
                    >
                        <FontAwesomeIcon icon={faPen} style={{ fontSize: "1rem" }} />
                    </div>
                    <button
                        onClick={() => {
                            onDeleteTodo(todo);
                        }}
                        className="delete-todo"
                        style={{ padding: 0, border: "none", background: "none" }}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            )}
            <div {...attributes} {...listeners} className="drag-n-drop reorder-handle" />
        </li>
    );
};

export default TodoItems;
