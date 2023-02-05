using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using CBHPredictorWebAPI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
            if (userModel.UserName is null || userModel.Password is null)
            {
                return BadRequest("Invalid client request");
            }

            userModel.UserName = Encode(userModel.UserName);
            userModel.Password = Encode(userModel.Password);

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

        [HttpGet("encode")]
        public string GetEncoded(string value) { 
            return Encode(value);
        }

        private string Encode(string value)
        {
            byte[] encData_byte = new byte[value.Length];
            int i = 0;

            while (value.Length < 1024)
            {
                encData_byte = System.Text.Encoding.UTF8.GetBytes(value);
                value = Convert.ToBase64String(encData_byte);
                i++;
            }

            return value;
        }
    }
}
