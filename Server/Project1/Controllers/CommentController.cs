using Azure.Core;
using Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository.Entity;
using Service;

namespace Project1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {

        // GET: CommentController
        private readonly IService<CommentDto> service;
        public CommentController(IService<CommentDto> commentservice)
        {
            this.service = commentservice;
        }

        // GET: CommentController/Details/5
        [HttpGet]
        public async Task<List<CommentDto>> Get()
        {
            return await service.GetAllAsync();
        }

        // GET: CommentController/Create
        [HttpGet("{id}")]
        public async Task<CommentDto> Get(int id)
        {
            return await service.GetByIdAsync(id);
        }

        // POST: CommentController/Create
        [HttpPost]
        public async Task Post([FromBody] CommentDto value)
        {
            await service.AddItemAsync(value);
        }

        // GET: CommentController/Edit/5
        [HttpPut("{id}")]
        public async Task Put([FromBody] CommentDto value)
        {

            await service.UpdateAsync(value);
        }
        // POST: CommentController/Delete/5
        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await service.DeleteByIdAsync(id);
        }
        //[HttpPost]
        //public async Task AddExercise([FromBody] AddExerciseRequest requests)
        //{
        //    await service.AddFavoriteExercise(requests);
        //}
    }
}
