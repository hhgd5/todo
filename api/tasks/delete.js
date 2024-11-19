let todos = [];

export default function handler(req, res) {
  if (req.method === 'DELETE') {
    const { delId } = req.body;
    const initialLength = todos.length;

    todos = todos.filter(task => task.id !== delId);

    if (todos.length < initialLength) {
      res.status(200).json({ message: 'Task deleted successfully', todos });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
