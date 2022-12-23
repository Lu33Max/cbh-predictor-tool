using CBHPredictorWebAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Data.SqlTypes;
using System.Drawing;

namespace CBHPredictorWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BackupController : Controller
    {
        [HttpGet]
        public async Task<String> CreateBackup()
        {
            //Create the object of SqlConnection class to connect with database sql server
            using (SqlConnection conn = new SqlConnection())
            {
                String backupDestination = "C:/backups/";

                if (!Directory.Exists(backupDestination))
                {
                    Directory.CreateDirectory(backupDestination);
                }

                //prepare connection string
                conn.ConnectionString = "server =(local); database=CBHDB; Trusted_Connection=True; TrustServerCertificate=True;";

                try
                {
                    //Prepare SQL command that we want to query
                    SqlCommand cmd = new SqlCommand();
                    cmd.CommandType = CommandType.Text;
                    // cmd.CommandText = "SELECT * FROM MYTABLE";
                    cmd.CommandText = "BACKUP DATABASE CBHDB TO DISK = 'C:/backups/CBHDB" + DateTime.Now.ToString("yyyy-MM-dd@HH_mm") + ".bak';";
                    cmd.Connection = conn;

                    // open database connection.
                    conn.Open();

                    Console.WriteLine("Connection Open !");

                    //Execute the query 
                    SqlDataReader sdr = cmd.ExecuteReader();

                    ////Retrieve data from table and Display result
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
                    Console.WriteLine("Can not open connection!");

                }
            }
            return "Success";
        }
    }
}
