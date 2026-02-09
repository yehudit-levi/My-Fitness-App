using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    public class AddExerciseRequest
    {
        
        
            public int IdUser { get; set; }
            public List<int>? IdExercises { get; set; }
        

    }
}
