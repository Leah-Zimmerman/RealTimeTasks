using Microsoft.EntityFrameworkCore;

namespace RealTimeTasks.Data
{
    public class UserDbContext : DbContext
    {
        private string _connectionString;
        public UserDbContext(string connectionString)
        {
            _connectionString = connectionString;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_connectionString);
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany(u => u.Tasks)
                .WithOne(t => t.User)
            .HasForeignKey(t => t.UserId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TaskItem>()
        .Property(t => t.Status)
        .HasConversion<string>();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
    }

}