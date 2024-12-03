using Microsoft.EntityFrameworkCore.Storage;

namespace RealTimeTasks.Data
{
    public class UserRepository
    {
        private string _connectionString;
        public UserRepository(string connectionString)
        {
            _connectionString = connectionString;
        }
        public void Signup(User user, string password)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
            using var context = new UserDbContext(_connectionString);
            context.Users.Add(new User
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                PasswordHash = passwordHash
            });
            context.SaveChanges();
        }
        public User Login(string email, string password)
        {
            using var context = new UserDbContext(_connectionString);
            var user = context.Users.FirstOrDefault(u => u.Email == email);
            if(user == null)
            {
                return null;
            }
            var passwordIsCorrect = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            if(passwordIsCorrect)
            {
                return user;
            }
            return null;
        }
        public User GetUserByEmail(string email)
        {
            using var context = new UserDbContext(_connectionString);
            return context.Users.FirstOrDefault(u => u.Email == email);
        }

    }

}