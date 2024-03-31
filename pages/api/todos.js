let todos = [];

export default function handler(req, res) {
    if (req.method === "GET") {
        res.status(200).json(todos);
    } else if (req.method === "POST") {
        const { text } = req.body;
        const newTodo = { id: Date.now(), text, completed: false };
        todos.push(newTodo);
        res.status(201).json(newTodo);
    } else if (req.method === "PUT") {
        const { id, completed } = req.body;
        const index = todos.findIndex((todo) => todo.id === id);
        if (index !== -1) {
            todos[index].completed = completed;
            res.status(200).json(todos[index]);
        } else {
            res.status(404).json({ message: "Todo not found" });
        }
    } else if (req.method === "DELETE") {
        const { id } = req.body;
        todos = todos.filter((todo) => todo.id !== id);
        res.status(200).json({ message: "Todo deleted successfully" });
    } else {
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
