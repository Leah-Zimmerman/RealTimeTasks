using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RealTimeTasks.Data;
using System.Threading.Tasks;

namespace RealTimeTasks.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private string _connectionString;
        private IHubContext<TaskHub> _hub;
        public TasksController(IConfiguration configuration, IHubContext<TaskHub> hub)
        {
            _connectionString = configuration.GetConnectionString("ConStr");
            _hub = hub;
        }

        [HttpPost]
        [Route("addTask")]
        public void AddTask(string title)
        {
            var repo = new TaskRepository(_connectionString);
            var id = repo.AddTask(title);
            var task = new TaskItem
            {
                Id = id,
                Title = title,
                Status = Status.Available
            };
            _hub.Clients.All.SendAsync("addTask", task);
        }
        [HttpGet]
        [Route("getTasks")]
        public List<Data.TaskItem> GetTasks()
        {
            var repo = new TaskRepository(_connectionString);
            var tasks = repo.GetTasks();
            return tasks;
        }
        [Authorize]
        [HttpPost]
        [Route("acceptTask")]
        public void AcceptTask(int id)
        {
            var email = HttpContext.User.Identity.Name;
            var repo = new TaskRepository(_connectionString);
            repo.AcceptTask(email, id);
            var task = repo.GetTaskById(id);
            var updatedTask = new TaskItem{
                Id = task.Id,
                Title = task.Title,
                Status = Status.Taken,
                UserId = task.UserId,
                User = task.User
            };
            _hub.Clients.All.SendAsync("taskTaken", updatedTask);
        }
        [Authorize]
        [HttpPost]
        [Route("completeTask")]
        public void CompleteTask(int id)
        {
            var email = HttpContext.User.Identity.Name;
            var repo = new TaskRepository(_connectionString);
            repo.CompleteTask(email, id);
            var task = repo.GetTaskById(id);
            var updatedTask = new TaskItem
            {
                Id = task.Id,
                Title = task.Title,
                Status = Status.Done,
                UserId = task.UserId,
                User = task.User
            };
            _hub.Clients.All.SendAsync("taskCompleted", updatedTask);
        }
    }
}
