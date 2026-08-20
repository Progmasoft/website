// SPDX-FileCopyrightText: 2026 Leitwolf <xs-lang.chess031@slmails.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

using XSharp.Web.Api.Auth;
using Xunit;

namespace XSharp.Web.Api.Tests.Auth;

public sealed class PublisherNamePolicyTests
{
    [Theory]
    [InlineData("Myname12")]
    [InlineData("MyName12")]
    [InlineData("Publisher123")]
    [InlineData("A2345678")]
    public void AcceptsCanonicalAsciiNames(string value)
    {
        PublisherNameValidation result = PublisherNamePolicy.Validate(value);

        Assert.True(result.IsValid);
        Assert.Equal(value, result.Value);
        Assert.Equal(value.ToUpperInvariant(), result.NormalizedValue);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("Short")]
    [InlineData("myname12")]
    [InlineData("myName12")]
    [InlineData("Şpublisher")]
    [InlineData("Üsername1")]
    [InlineData("中文Publisher")]
    [InlineData("한국Publisher")]
    [InlineData("MyName|1")]
    [InlineData("MyName\\1")]
    [InlineData("MyName/1")]
    [InlineData("MyName&1")]
    [InlineData("MyName!1")]
    [InlineData("MyName'1")]
    [InlineData("MyName^1")]
    [InlineData("MyName#1")]
    [InlineData("My_Name1")]
    [InlineData("My-Name1")]
    [InlineData("My Name1")]
    public void RejectsNonCanonicalNames(string? value)
    {
        Assert.False(PublisherNamePolicy.Validate(value).IsValid);
    }

    [Theory]
    [InlineData("Progmasoft")]
    [InlineData("PROGMASOFT")]
    [InlineData("Leitwolf")]
    [InlineData("LEITWOLF")]
    public void RejectsReservedNamesWithoutCaseLoopholes(string value)
    {
        PublisherNameValidation result = PublisherNamePolicy.Validate(value);

        Assert.False(result.IsValid);
        Assert.Equal("This username is reserved.", result.Error);
    }

    [Fact]
    public void CaseVariantsShareOneOwnershipKey()
    {
        PublisherNameValidation first = PublisherNamePolicy.Validate("Myname12");
        PublisherNameValidation second = PublisherNamePolicy.Validate("MyName12");

        Assert.True(first.IsValid);
        Assert.True(second.IsValid);
        Assert.Equal(first.NormalizedValue, second.NormalizedValue);
    }

    [Fact]
    public void EnforcesMaximumLength()
    {
        string maximum = $"A{new string('a', PublisherNamePolicy.MaximumLength - 1)}";
        string tooLong = maximum + "a";

        Assert.True(PublisherNamePolicy.Validate(maximum).IsValid);
        Assert.False(PublisherNamePolicy.Validate(tooLong).IsValid);
    }
}
