using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection; // add manually to resolve : GetService error
namespace DatingApp.API.Helpers
{
    // 134
    public class LogUserActivity : IAsyncActionFilter
    {
        // add async
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // type of actionexecutedContext
            // give us acces to http context
            var resultContext = await next();
            //get user id
            var userId = int.Parse(resultContext.HttpContext.User
                .FindFirst(ClaimTypes.NameIdentifier).Value);

            var repo = resultContext.HttpContext.RequestServices.GetService<IDatingRepository>();    
            var user = await repo.GetUser(userId);
            user.LastActive = DateTime.Now;

            await repo.SaveAll(); // update user lastActive
        }
    }
}