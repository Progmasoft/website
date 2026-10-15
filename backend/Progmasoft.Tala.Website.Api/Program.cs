// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

using Progmasoft.Tala.Website.Api;

WebApplication application = SiteApplication.Build(args);
application.Run();

namespace Progmasoft.Tala.Website.Api
{
    /// <summary>
    /// The language website's API: the site's own public state and a liveness probe. It has no account, package,
    /// publication or registry endpoint; Progmaweb owns those.
    /// </summary>
    public static class SiteApplication
    {
        /// <summary>The port the service listens on when the <c>PORT</c> variable names none.</summary>
        public const int DefaultPort = 5086;

        /// <summary>
        /// Builds the application. It listens on the loopback interface only; Nginx is the public side.
        /// </summary>
        /// <param name="args">The command-line arguments of the process.</param>
        /// <returns>The configured application, not yet running.</returns>
        public static WebApplication Build(string[] args)
        {
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
            int port = int.TryParse(Environment.GetEnvironmentVariable("PORT"), out int configured)
                && configured is > 0 and < 65536
                    ? configured
                    : DefaultPort;
            builder.WebHost.UseUrls($"http://127.0.0.1:{port}");
            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();

            WebApplication application = builder.Build();
            Map(application);
            return application;
        }

        /// <summary>Maps the endpoints of the site onto <paramref name="routes"/>.</summary>
        /// <param name="routes">The application or route group that receives the endpoints.</param>
        public static void Map(IEndpointRouteBuilder routes)
        {
            routes.MapGet("/api/v1/site", () => Results.Json(SiteInformation.Current));
            // The service manager only needs to know that the process answers; no build or host data is disclosed.
            routes.MapGet("/health", () => Results.Ok());
        }
    }
}
