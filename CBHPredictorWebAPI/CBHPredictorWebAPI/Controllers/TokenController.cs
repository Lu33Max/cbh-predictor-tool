using CBHPredictorWebAPI.Data;
using CBHPredictorWebAPI.Models;
using CBHPredictorWebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CBHPredictorWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly CBHDBContext _context;
        private readonly ITokenService _tokenService;
        public TokenController(CBHDBContext userContext, ITokenService tokenService)
        {
            this._context = userContext ?? throw new ArgumentNullException(nameof(userContext));
            this._tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody]TokenApiModel tokenApiModel)
        {
            if (tokenApiModel is null)
            {
                return BadRequest("Invalid client request");
            }

            string accessToken = tokenApiModel.AccessToken;
            string refreshToken = tokenApiModel.RefreshToken;

            var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
            var username = principal.Identity.Name;

            var user = await _context.UserModels.SingleOrDefaultAsync(u => u.UserName == username);

            if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
                return BadRequest("Invalid client request");

            var newAccessToken = _tokenService.GenerateAccessToken(principal.Claims);

            await _context.SaveChangesAsync();

            return Ok(new AuthenticatedResponse()
            {
                Token = newAccessToken,
                RefreshToken = tokenApiModel.RefreshToken
            });
        }

        [HttpPost, Authorize]
        [Route("revoke")]
        public async Task<IActionResult> Revoke()
        {
            var username = User.Identity.Name;

            var user = _context.UserModels.SingleOrDefault(u => u.UserName == username);
            if (user == null) return BadRequest();

            user.RefreshToken = null;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
