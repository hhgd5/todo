export default function handler(req, res) {
    if (req.method === 'POST') {
      const { tasks } = req.body;
      // Simulate adding tasks to a database
      res.status(200).json({ message: 'Tasks received successfully', tasks });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  