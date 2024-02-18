namespace Services.Logic;

public interface ITemplatingService
{
    public IDictionary<string, string> ReplaceTextFromObject(dynamic obj, string prefix = "", int depth = 0);
}