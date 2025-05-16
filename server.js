const express = require('express');
const app = express();
const PORT = 3000;

// Trackable link endpoint
app.get('/track/:userId/:taskId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const taskId = parseInt(req.params.taskId);

  // Delay to simulate user viewing the task for 5 seconds
  setTimeout(() => {
    db.get(`SELECT * FROM task_clicks WHERE user_id = ? AND task_id = ?`, [userId, taskId], (err, row) => {
      if (row) return; // Already rewarded

      db.run(`INSERT INTO task_clicks (user_id, task_id) VALUES (?, ?)`, [userId, taskId]);
      db.run(`UPDATE users SET balance = balance + 100 WHERE id = ?`, [userId]); // Change 100 to your reward
      bot.telegram.sendMessage(userId, `✅ You earned 100 pts for completing a task!`);
    });
  }, 5000); // 5 seconds delay

  // Redirect to the actual task URL
  db.get(`SELECT url FROM tasks WHERE id = ?`, [taskId], (err, task) => {
    if (task?.url) {
      res.redirect(task.url); // Opens task URL in web viewer
    } else {
      res.send("Task not found.");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Tracking server running on http://localhost:${PORT}`);
});
