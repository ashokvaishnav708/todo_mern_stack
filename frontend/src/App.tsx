import axios from "axios";
import { useEffect, useState, type SubmitEvent } from "react";
import { MdOutlineDone, MdModeEditOutline } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";

function App() {
  type Todo = {
    _id: string;
    text: string;
    completed: boolean;
  };
  const [newTodo, setNewTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const addTodo = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!newTodo.trim()) return;
    try {
      const response = await axios.post<Todo>("/api/todos", { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.log("Error adding Todo:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get<Todo[]>("/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  const saveEdit = async () => {
    if (!editingTodo) return;
    try {
      const response = await axios.patch<Todo>(
        `/api/todos/${editingTodo._id}`,
        {
          text: editingTodo?.text,
        },
      );
      setTodos(
        todos.map((todo) =>
          todo._id === editingTodo._id ? response.data : todo,
        ),
      );
      setEditingTodo(null);
    } catch (error) {
      console.log("Error saving the edit: ", error);
      setEditingTodo(null);
    }
  };

  const deleteTodo = async (id: string) => {
    const index = todos.findIndex(({ _id }) => _id === id);
    if (index === -1) return;
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter(({ _id }) => _id !== id));
    } catch (error) {
      console.log("Failed to delete Todo:", error);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      const response = await axios.patch<Todo>(`/api/todos/${todo._id}`, {
        completed: !todo.completed,
      });
      setTodos(
        todos.map((todo) =>
          todo._id === response.data._id ? response.data : todo,
        ),
      );
    } catch (error) {
      console.log("Error toggling todo");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Task Manager
        </h1>

        <form
          className="flex items-center shadow-sm border border-gray-200 p-2 rounded-lg"
          onSubmit={addTodo}
        >
          <input
            type="text"
            className="outline-none px-3 py-2 text-gray-700 placeholder-gray-400 flex-1"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to eb done?"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
          >
            Add task
          </button>
        </form>
        <div className="mt-4">
          {todos.length === 0 ? (
            <div></div>
          ) : (
            <div className="flex flex-col gap-4">
              {todos.map((todo) => (
                <div key={todo._id}>
                  {editingTodo && editingTodo._id === todo._id ? (
                    <div className="flex items-center gap-x-3">
                      <input
                        type="text"
                        className="flex-1 p-3 rounded-lg outline-none border-gray-200 focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner"
                        value={editingTodo.text}
                        onChange={(e) =>
                          setEditingTodo({
                            ...editingTodo,
                            text: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-x-2">
                        <button
                          className="text-white bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 cursor-pointer"
                          onClick={() => saveEdit()}
                        >
                          <MdOutlineDone />
                        </button>
                        <button
                          className="text-gray-700 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 cursor-pointer"
                          onClick={() => setEditingTodo(null)}
                        >
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-4">
                          <button
                            className={`h-6 w-6 border rounded-full flex items-center justify-center cursor-pointer ${todo.completed ? "bg-green-500 border-green-500" : "border-gray-300 hover:bg-gray-50"}`}
                            onClick={() => toggleTodo(todo)}
                          >
                            {todo.completed && <MdOutlineDone />}
                          </button>
                          <span className="flex-1">{todo.text}</span>
                        </div>
                        <div className="flex gap-x-2">
                          <button
                            className="text-blue-500 px-2 py-2 rounded-lg hover:text-blue-600 cursor-pointer"
                            onClick={() => setEditingTodo(todo)}
                          >
                            <MdModeEditOutline />
                          </button>
                          <button
                            className="text-red-600 px-2 py-2 rounded-lg hover:text-red-700 cursor-pointer"
                            onClick={() => deleteTodo(todo._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
