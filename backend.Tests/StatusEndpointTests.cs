// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace XSharp.Web.Api.Tests;

public sealed class StatusEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient client;

    public StatusEndpointTests(WebApplicationFactory<Program> application)
    {
        client = application.CreateClient();
    }

    [Fact]
    public async Task ReportsOnlyTheVigetServiceBoundary()
    {
        using HttpResponseMessage response = await client.GetAsync("/api/v1/status");
        StatusResponse? status = await response.Content.ReadFromJsonAsync<StatusResponse>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.NotNull(status);
        Assert.Equal("viget", status.Service);
        Assert.Equal("online", status.Status);
        Assert.True(status.RegistryAvailable);
    }

    [Theory]
    [InlineData("/api/v1/auth/login")]
    [InlineData("/api/v1/auth/register")]
    [InlineData("/api/v1/tokens")]
    public async Task DoesNotExposeRetiredAccountEndpoints(string path)
    {
        using HttpResponseMessage response = await client.GetAsync(path);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    private sealed record StatusResponse(string Service, string Status, bool RegistryAvailable);
}
