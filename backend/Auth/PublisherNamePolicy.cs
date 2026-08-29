// SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com>
// SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.0

namespace XSharp.Web.Api.Auth;

internal static class PublisherNamePolicy
{
    public const int MinimumLength = 8;
    public const int MaximumLength = 128;

    private static readonly string[] ReservedNames = ["Progmasoft", "Leitwolf"];

    public static PublisherNameValidation Validate(string? value)
    {
        string publisherName = value ?? string.Empty;
        if (publisherName.Length is < MinimumLength or > MaximumLength)
        {
            return PublisherNameValidation.Invalid(
                $"Username must be between {MinimumLength} and {MaximumLength} characters.");
        }
        if (!IsUpperAscii(publisherName[0]))
        {
            return PublisherNameValidation.Invalid("Username must start with an uppercase ASCII letter.");
        }

        // Publisher coordinates are URL path segments. Restricting the complete value to ASCII letters and digits keeps
        // canonical package URLs portable across filesystems, shells, registries, and case-sensitive clients.
        if (!publisherName.All(IsAsciiLetterOrDigit))
        {
            return PublisherNameValidation.Invalid("Username can contain only ASCII letters and digits.");
        }
        if (ReservedNames.Contains(publisherName, StringComparer.OrdinalIgnoreCase))
        {
            return PublisherNameValidation.Invalid("This username is reserved.");
        }

        return PublisherNameValidation.Valid(publisherName, publisherName.ToUpperInvariant());
    }

    private static bool IsUpperAscii(char value) => value is >= 'A' and <= 'Z';

    private static bool IsAsciiLetterOrDigit(char value) =>
        value is >= 'A' and <= 'Z' or >= 'a' and <= 'z' or >= '0' and <= '9';
}

internal readonly record struct PublisherNameValidation(
    bool IsValid,
    string Value,
    string NormalizedValue,
    string? Error)
{
    public static PublisherNameValidation Valid(string value, string normalizedValue) =>
        new(true, value, normalizedValue, null);

    public static PublisherNameValidation Invalid(string error) => new(false, string.Empty, string.Empty, error);
}
