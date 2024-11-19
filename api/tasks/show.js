let todos = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ todos });
  } else if (req.method === 'PUT') {
    const { editTaskID, textEdit } = req.body;
    let taskFound = false;

    todos = todos.map(task => {
      if (task.id === editTaskID) {
        taskFound = true;
        return { ...task, title: textEdit };
      }
      return task;
    });

    if (taskFound) {
      res.status(202).json({ message: 'Task updated successfully', todos });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
