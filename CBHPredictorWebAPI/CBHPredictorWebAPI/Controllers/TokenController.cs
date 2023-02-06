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
            _context = userContext ?? throw new ArgumentNullException(nameof(userContext));
            _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        }

        // Refreshes the access token
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody]TokenApiModel tokenApiModel)
        {
            // Checks for null input
            if (tokenApiModel.AccessToken == null || tokenApiModel.RefreshToken == null)
            {
                return BadRequest("Invalid client request");
            }

            string accessToken = tokenApiModel.AccessToken;
            string refreshToken = tokenApiModel.RefreshToken;

            // Gets information stored in old access token
            var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
            var username = principal.Identity.Name;

            // Searches for user in database
            var user = await _context.UserModels.SingleOrDefaultAsync(u => u.UserName == username);

            // Checks if the user exists, the refresh token is equal to the refresh token assigned to that user and the refresh token is not expired
            if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
                return BadRequest("Invalid client request");

            // Creates a new access token based on all prior claims and returns it
            var newAccessToken = _tokenService.GenerateAccessToken(principal.Claims);

            return Ok(new AuthenticatedResponse()
            {
                Token = newAccessToken,
                RefreshToken = tokenApiModel.RefreshToken
            });
        }

        // CURRENTLY NOT IN USE
        // Revokes the refresh token of the user
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
