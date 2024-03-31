"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchTodos = async () => {
    const { data } = await axios.get("/api/todos");
    return data;
};

const addTodo = async (text) => {
    const { data } = await axios.post("/api/todos", { text });
    return data;
};

const updateTodo = async ({ id, completed }) => {
    console.log(id, completed);
    const { data } = await axios.put("/api/todos", { id, completed });
    return data;
};

const deleteTodo = async (id) => {
    await axios.delete("/api/todos", { data: { id } });
};

export default function Todo() {
    const [text, setText] = useState("");
    const queryClient = useQueryClient();

    const {
        data: todos = [],
        isLoading,
        error,
    } = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });

    const addTodoMutation = useMutation({
        mutationFn: addTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const updateTodoMutation = useMutation({
        mutationFn: updateTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const deleteTodoMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const handleAddTodo = async () => {
        if (!text.trim()) return;
        await addTodoMutation.mutateAsync(text);
        setText("");
    };

    const handleToggleTodo = async (id, completed) => {
        updateTodoMutation.mutate({ id: id, completed: !completed });
        // await updateTodoMutation.mutateAsync({ id: id, completed: !completed });
    };

    const handleDeleteTodo = async (id) => {
        await deleteTodoMutation.mutateAsync(id);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Todo App</h1>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={handleAddTodo}>Add Todo</button>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggleTodo(todo.id, todo.completed)}
                        />
                        <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                            {todo.text}
                        </span>
                        <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
