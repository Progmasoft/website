// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

using System.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Xunit;

namespace Progmasoft.Tala.Website.Api.Tests;

/// <summary>The endpoints of the site, served from an in-memory host.</summary>
public sealed class SiteEndpointTests : IAsyncLifetime
{
    private WebApplication? application;
    private HttpClient? client;

    private HttpClient Client => client ?? throw new InvalidOperationException("the host has not started");

    public async ValueTask InitializeAsync()
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder();
        builder.WebHost.UseTestServer();
        application = builder.Build();
        SiteApplication.Map(application);
        await application.StartAsync(TestContext.Current.CancellationToken);
        client = application.GetTestClient();
    }

    public async ValueTask DisposeAsync()
    {
        client?.Dispose();
        if (application is not null) await application.DisposeAsync();
    }

    [Fact]
    public async Task SiteInformationIsAboutTalaRatherThanThePackageRegistry()
    {
        using HttpResponseMessage response =
            await Client.GetAsync(new Uri("/api/v1/site", UriKind.Relative), TestContext.Current.CancellationToken);
        string body = await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);
        Assert.Equal(
            """{"name":"Tala","phase":"development","defaultLocale":"en-US","supportedLocales":["en-US","de-DE","ru-RU","he-IL"],"forumOpen":false}""",
            body);
        Assert.DoesNotContain("viget", body, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task HealthHasAnEmptySuccessfulResponse()
    {
        using HttpResponseMessage response =
            await Client.GetAsync(new Uri("/health", UriKind.Relative), TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(string.Empty, await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task SiteInformationIsReadOnly()
    {
        using StringContent empty = new(string.Empty);
        using HttpResponseMessage response = await Client.PostAsync(
            new Uri("/api/v1/site", UriKind.Relative), empty, TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.MethodNotAllowed, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/v1/packages")]
    [InlineData("/api/v1/accounts")]
    [InlineData("/repo")]
    [InlineData("/")]
    public async Task RegistryAndAccountEndpointsAreAbsent(string path)
    {
        using HttpResponseMessage response =
            await Client.GetAsync(new Uri(path, UriKind.Relative), TestContext.Current.CancellationToken);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public void TheServiceListensOnTheFormerPortUnlessToldOtherwise() => Assert.Equal(5086, SiteApplication.DefaultPort);
}
