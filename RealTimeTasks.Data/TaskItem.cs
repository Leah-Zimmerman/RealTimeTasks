using System.Text.Json.Serialization;

namespace RealTimeTasks.Data
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public Status Status { get; set; }

        [JsonIgnore]
        public int? UserId { get; set; }
        public User User { get; set; }
    }
    public enum Status
    {
        Available,
        Taken,
        Done
    }
}