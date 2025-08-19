using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Million.UnitTests.Common
{
    /// <summary>
    /// Crea instancias de DTOs con constructores largos, permitiendo overrides por nombre (case-insensitive).
    /// Técnica: Test Data Builder + reflexión (reduce fragilidad de tests).
    /// </summary>
    public static class ReflectionFactory
    {
        public static T CreateWithDefaults<T>(IDictionary<string, object?>? overrides = null)
        {
            var type = typeof(T);

            // Toma el ctor público con más parámetros
            var ctor = type.GetConstructors(BindingFlags.Public | BindingFlags.Instance)
                           .OrderByDescending(c => c.GetParameters().Length)
                           .FirstOrDefault();

            if (ctor is null)
            {
                var inst = Activator.CreateInstance<T>();
                if (inst is null) throw new InvalidOperationException($"No se pudo crear {type.FullName}");
                return inst;
            }

            // Normaliza overrides a diccionario case-insensitive
            var ov = overrides is null
                ? new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase)
                : new Dictionary<string, object?>(overrides, StringComparer.OrdinalIgnoreCase);

            // Para cada parámetro del ctor, toma override o un valor por defecto
            var args = ctor.GetParameters()
                           .Select(p => ov.TryGetValue(p.Name!, out var val) ? val : SampleValue(p.ParameterType))
                           .ToArray();

            return (T)ctor.Invoke(args);
        }

        private static object? SampleValue(Type t)
        {
            if (t == typeof(string)) return "sample";
            if (t == typeof(Guid)) return Guid.NewGuid();
            if (t == typeof(decimal)) return 1m;
            if (t == typeof(int)) return 1;
            if (t == typeof(long)) return 1L;
            if (t == typeof(double)) return 1.0;
            if (t == typeof(bool)) return true;
            if (t == typeof(DateTime)) return DateTime.UtcNow;
            if (t == typeof(DateTimeOffset)) return DateTimeOffset.UtcNow;
            if (t.IsEnum) return Enum.GetValues(t).GetValue(0);

            // Tipos referencia no primitivos → null
            if (!t.IsValueType) return null;

            // Value types → default
            return Activator.CreateInstance(t);
        }
    }
}
