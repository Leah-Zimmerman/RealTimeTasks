using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RealTimeTasks.Data;
using RealTimeTasks.Web.ViewModels;
using System.Security.Claims;

namespace RealTimeTasks.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private string _connectionString;
        public AccountController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("ConStr");
        }
        [HttpPost]
        [Route("signup")]
        public void Signup(SignupViewModel svm)
        {
            var repo = new UserRepository(_connectionString);
            repo.Signup(svm, svm.Password);
        }
        [HttpPost]
        [Route("login")]
        public User Login(LoginViewModel lvm)
        {
            var repo = new UserRepository(_connectionString);
            var user = repo.Login(lvm.Email, lvm.Password);
            if (user == null)
            {
                return null;
            }
            var claims = new List<Claim>
            {
                new Claim("user",lvm.Email)
            };
            HttpContext.SignInAsync(new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies", "user", "role"))).Wait();
            return user;
        }

        [HttpGet]
        [Route("getUser")]
        public User GetUser()
        {
            var email =  HttpContext.User.Identity.Name;
            var repo = new UserRepository(_connectionString);
            return repo.GetUserByEmail(email);
        }
        [Authorize]
        [HttpPost]
        [Route("logout")]
        public void Logout()
        {
            HttpContext.SignOutAsync();
        }
    }
}
