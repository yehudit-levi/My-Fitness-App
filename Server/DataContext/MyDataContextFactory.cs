using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace DataContext
{
    public class MyDataContextFactory : IDesignTimeDbContextFactory<MyDataContext>
    {
        public MyDataContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<MyDataContext>();

            // הגדר כאן את מחרוזת החיבור שלך
            optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=SportDb;Trusted_Connection=True;");

            return new MyDataContext(optionsBuilder.Options);
        }
    }
}
