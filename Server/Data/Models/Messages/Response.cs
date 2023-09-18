namespace Data.Models.Messages
{
	public class Response<T>
	{
		public T? Data { get; set; }
        public Error? Error { get; set; }
    }

	public class Response : Response<object>
	{
	}
}

