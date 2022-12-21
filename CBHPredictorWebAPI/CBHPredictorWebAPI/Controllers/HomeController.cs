using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using System.Data;

namespace CBHPredictorWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public void BackupDatabase(string databaseName, string localDatabasePath = null)
        {
            // use the default sql server base path from appsettings.json if localDatabasePath is null
            if (localDatabasePath == null)
            {
                //localDatabasePath = Path.Combine(options.Value.SqlServerBasePath, "Backup", $"{databaseName}.bak");
            }
            // otherwise check if it ends with .bak
            else if (!localDatabasePath.EndsWith(".bak"))
            {
                throw new ArgumentException("localDatabasePath must end with .bak.");
            }

            var formatMediaName = $"DatabaseToolkitBackup_{databaseName}";
            var formatName = $"Full Backup of {databaseName}";

            using (var connection = new SqlConnection("Server=(local); Database=CBHDB; Trusted_Connection=True; TrustServerCertificate=True; MultipleActiveResultSets=True"))
            {
                var sql = @"BACKUP DATABASE @databaseName
                    TO DISK = @localDatabasePath
                    WITH FORMAT,
                      MEDIANAME = @formatMediaName,
                        NAME = @formatName";

                connection.Open();

                using (var command = new SqlCommand(sql, connection))
                {
                    command.CommandType = CommandType.Text;
                    command.CommandTimeout = 7200;
                    command.Parameters.AddWithValue("@databaseName", databaseName);
                    command.Parameters.AddWithValue("@localDatabasePath", localDatabasePath);
                    command.Parameters.AddWithValue("@formatMediaName", formatMediaName);
                    command.Parameters.AddWithValue("@formatName", formatName);

                    command.ExecuteNonQuery();
                }
            }
        }
    }
}
