// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1

namespace Progmasoft.Tala.Website.Api;

/// <summary>
/// The public state of the website itself. It does not mirror a package catalog, an account service or any other
/// application.
/// </summary>
/// <param name="Name">The name of the language the site is about.</param>
/// <param name="Phase">How far the language has come: <c>development</c> until a stable release.</param>
/// <param name="DefaultLocale">The locale a visitor gets when the browser prefers none of the supported ones.</param>
/// <param name="SupportedLocales">The locales the pages are published in.</param>
/// <param name="ForumOpen">Whether the forum takes accounts and posts; it does not yet.</param>
public sealed record SiteInformation(
    string Name,
    string Phase,
    string DefaultLocale,
    IReadOnlyList<string> SupportedLocales,
    bool ForumOpen)
{
    /// <summary>The state the site reports today.</summary>
    public static SiteInformation Current { get; } = new(
        Name: "Tala",
        Phase: "development",
        DefaultLocale: "en-US",
        SupportedLocales: ["en-US", "de-DE", "ru-RU", "he-IL"],
        ForumOpen: false);
}
