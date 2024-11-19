import React, { useState, useRef, useEffect } from "react";
import { PlusCircle, Trash2, CheckCircle, Circle, Edit2 } from "lucide-react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  isEditing: boolean;
}

const TaskManager = () => {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([
    { id: 343434, title: "Sample Task", completed: false, isEditing: false },
  ]);
  const [response, setResponse] = useState<string>("");
  const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map());

  const toggleCompleted = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleEdit = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, isEditing: true }
          : { ...task, isEditing: false }
      )
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const handleDelete = async (taskId: number) => {
    try {
      const res = await fetch("http://localhost:8080/tasks/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ delId: taskId }),
      });

      if (res.ok) {
        const data = await res.json();
        setTasks(tasks.filter((task) => task.id !== taskId));
        setResponse("Task deleted successfully!");
      } else {
        setResponse("Failed to delete the task.");
      }
    } catch {
      setResponse("An error occurred while deleting the task.");
    }
  };

  const saveEdit = async (taskId: number) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);

    if (!taskToEdit || taskToEdit.title.trim() === "") {
      return;
    }

    const edit = {
      editTaskID: taskId,
      textEdit: taskToEdit.title,
    };

    try {
      const res = await fetch("http://localhost:8080/tasks/show", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(edit),
      });

      if (res.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, title: taskToEdit.title } : task
          )
        );
      }
    } catch {}

    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, isEditing: false } : task
      )
    );
  };

  const editText = (taskId: number, newTitle: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, title: newTitle } : task
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (task.trim() === "") {
      setResponse("Please enter a task.");
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: task,
      completed: false,
      isEditing: false,
    };

    try {
      const res = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks: [newTask] }),
      });

      const data = await res.json();
      setResponse(data.message || "Task submitted successfully!");
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTask("");
    } catch {
      setResponse("Failed to submit the task.");
    }
  };

  useEffect(() => {
    tasks.forEach((task) => {
      if (task.isEditing) {
        const input = inputRefs.current.get(task.id);
        if (input) input.focus();
      }
    });
  }, [tasks]);

  return (
    <div className="flex justify-center items-center max-w-2xl mx-auto p-4 h-[100vh]">
      <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
        <h2 className="text-2xl font-bold mb-6">Task Manager</h2>

        <form onSubmit={handleSubmit} className="mb-5">
          <label className="flex gap-5">
            <input
              type="text"
              name="addTask"
              placeholder="Add a new task..."
              value={task}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <PlusCircle />
              <span>Add Task</span>
            </button>
          </label>
        </form>

        {response && <div className="text-red-600 mb-3">{response}</div>}

        {tasks.length === 0 ? (
          <div className="bg-blue-50 text-blue-600 p-4 rounded-lg">
            No tasks yet. Add some tasks to get started!
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 group"
              >
                <button onClick={() => toggleCompleted(task.id)}>
                  {task.completed ? <CheckCircle /> : <Circle />}
                </button>

                {!task.isEditing ? (
                  <span
                    className={`flex-1 ${
                      task.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.title}
                  </span>
                ) : (
                  <input
                    ref={(el) => el && inputRefs.current.set(task.id, el)}
                    type="text"
                    value={task.title}
                    onChange={(e) => editText(task.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit(task.id);
                    }}
                    className="flex-1 border rounded py-1 px-2 focus:outline-none"
                  />
                )}

                <button
                  onClick={() => toggleEdit(task.id)}
                  className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-800 transition-opacity"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-800 transition-opacity"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
