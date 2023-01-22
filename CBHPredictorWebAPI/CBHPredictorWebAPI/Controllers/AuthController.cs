using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using CBHPredictorWebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CBHPredictorWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly CBHDBContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(CBHDBContext context, ITokenService tokenService)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserModel userModel)
        {
            if (userModel is null)
            {
                return BadRequest("Invalid client request");
            }

            var user = _context.UserModels.FirstOrDefault(u => (u.UserName == userModel.UserName) && (u.Password == userModel.Password));
            if (user == null) return Unauthorized();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, userModel.UserName),
                new Claim(ClaimTypes.Role, "Manager")
            };

            var accessToken = _tokenService.GenerateAccessToken(claims);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);

            await _context.SaveChangesAsync();

            return Ok(new AuthenticatedResponse
            {
                Token = accessToken,
                RefreshToken = refreshToken
            });
        }
    }
}
