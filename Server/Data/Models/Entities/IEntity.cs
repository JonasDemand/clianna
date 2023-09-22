namespace Data.Models.Entities
{
    public interface IEntity
    {
        public string Id { get; set; }
        public void SetDefault(bool create);
    }
}