namespace Services.Logic;

public interface ITemplatingService
{
    public IEnumerable<Replacement> ReplaceTextFromObject(dynamic obj, string prefix = "", int depth = 0);

    public class Replacement
    {
        public string ReplaceTemplate { get; set; }
        public string ReplaceValue { get; set; }
    }
}