# XLIL for Java

`org.xsslang:xlil:2026.1` is the official Java 25 binding for the stable
XLIL C ABI. It can construct, verify, emit, parse, and inspect XLIL v0
modules without maintaining a second Java parser.

## Add the dependency

The X# Gradle platform selects the official Java repository. Application
builds do not add a Maven repository URL directly.

```kotlin
plugins {
    id("java")
    id("org.xsslang.platform") version "26.1"
}

repositories {
    mavenCentral()

    xsslangPlatform {
        repositories()
    }
}

dependencies {
    xsslangPlatform {
        implementation("org.xsslang:xlil:2026.1")
    }
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(25))
    }
}
```

Enable FFM native access for modular applications:

```text
--enable-native-access=org.xsslang.xlil
```

The installed `xs_lil` shared library must be discoverable through the
platform's normal native-library search rules.

## Write XLIL

```java
try (XlilWriter writer = XlilWriter.create("Example")) {
    XlilFunctionWriter main =
        writer.defineFunction("main", XlilType.I32, List.of());
    XlilBlockWriter entry = main.block("entry");
    XlilValue exitCode = entry.constI32(0);
    entry.returnValue(exitCode);

    writer.verify();
    System.out.print(writer.emit());
}
```

## Read XLIL

```java
XlilModule module = XlilReader.parse("Example.xlil", source);
System.out.println(module.name());
module.functions().forEach(function -> System.out.println(function.name()));
```

The reader delegates parsing and verification to `libxs_lil` and returns
immutable Java snapshots. `CString` helpers are available from
`org.xsslang.ffi.c` for other Java 25 FFM integrations.

