using FluentAssertions;
using Microsoft.AspNetCore.Mvc;

namespace Million.UnitTests.Common
{
    /// <summary>
    /// Unwrap de ActionResult<T> para tests de controller:
    /// - Soporta Ok(dto) (OkObjectResult.Value)
    /// - Soporta return dto (ActionResult<T>.Value)
    /// </summary>
    public static class ActionResultExtensions
    {
        public static T ExtractValue<T>(this ActionResult<T> actionResult)
        {
            if (actionResult.Result is OkObjectResult ok && ok.Value is T t1)
                return t1;

            if (actionResult.Value is T t2)
                return t2;

            actionResult.Result.Should().BeOfType<OkObjectResult>(
                "el ActionResult no contenía Value ni OkObjectResult");
            var ok2 = (OkObjectResult)actionResult.Result!;
            ok2.Value.Should().BeAssignableTo<T>();
            return (T)ok2.Value!;
        }
    }
}
