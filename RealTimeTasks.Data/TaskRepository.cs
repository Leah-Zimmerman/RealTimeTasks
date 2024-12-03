using Microsoft.EntityFrameworkCore;

namespace RealTimeTasks.Data
{
    public class TaskRepository
    {
        private string _connectionString;
        public TaskRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public int AddTask(string title)
        {
            using var context = new UserDbContext(_connectionString);
            var task = new TaskItem
            {
                Title = title,
                Status = Status.Available
            };
            context.Tasks.Add(task);
            context.SaveChanges();
            return task.Id;
        }
        public List<TaskItem> GetTasks()
        {
            using var context = new UserDbContext(_connectionString);
            return context.Tasks.Include(t => t.User).ToList();
        }
        public User GetUserByEmail(string email)
        {
            using var context = new UserDbContext(_connectionString);
            return context.Users.FirstOrDefault(u => u.Email == email);
        }

        public TaskItem GetTaskById(int id)
        {
            using var context = new UserDbContext(_connectionString);
            return context.Tasks.Include(t => t.User).FirstOrDefault(t => t.Id == id);
        }
        public void AcceptTask(string email, int id)
        {
            var user = GetUserByEmail(email);
            if (user == null)
            {
                return;
            }
            using var context = new UserDbContext(_connectionString);
            var task = context.Tasks.FirstOrDefault(t => t.Id == id);
            if (task == null)
            {
                return;
            }
            task.Status = Status.Taken;
            task.UserId = user.Id;

            try
            {
                context.SaveChanges();
            }
            catch
            {
                return;
            }
        }
        public void CompleteTask(string email, int id)
        {
            var user = GetUserByEmail(email);
            if (user == null)
            {
                return;
            }
            using var context = new UserDbContext(_connectionString);
            var task = context.Tasks.FirstOrDefault(t => t.Id == id);
            if (task != null)
            {
                if (user.Id == task.UserId)
                {
                    task.Status = Status.Done;
                    context.SaveChanges();
                }
            }
        }
    }

}