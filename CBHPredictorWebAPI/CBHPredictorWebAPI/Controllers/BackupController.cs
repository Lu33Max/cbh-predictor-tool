using CBHPredictorWebAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace CBHPredictorWebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BackupController : Controller
    {
        // CURRENTLY NOT USED
        // Saves a backup of the current database status on the users system
        [HttpGet]
        public async Task<string> CreateBackup()
        {
            //Create the object of SqlConnection class to connect with database sql server
            using (SqlConnection conn = new())
            {
                // Creates the directory to save the backup in
                string backupDestination = "C:/backups/";

                if (!Directory.Exists(backupDestination))
                {
                    Directory.CreateDirectory(backupDestination);
                }

                conn.ConnectionString = "server =(local); database=CBHDB; Trusted_Connection=True; TrustServerCertificate=True;";

                try
                {
                    // Setup of the SQL query
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;

                    cmd.CommandText = "BACKUP DATABASE CBHDB TO DISK = 'C:/backups/CBHDB" + DateTime.Now.ToString("yyyy-MM-dd@HH_mm") + ".bak';";
                    cmd.Connection = conn;

                    // Opens connection to the SQL server
                    conn.Open();

                    // Executes the query
                    SqlDataReader sdr = cmd.ExecuteReader();

                    // Retrieve data from table and Display result
                    while (sdr.Read())
                    {
                        int id = (int)sdr["id"];
                        Console.WriteLine(id);
                    }

                    //Close the connection
                    conn.Close();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);

                }
            }
            return "{\"success\":1}";
        }
    }
}
