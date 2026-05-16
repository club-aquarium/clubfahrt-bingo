{
  lib,
  stdenvNoCC,
  fetchurl,
  esbuild,
  pandoc,
  sassc,
  typescript,
}:

stdenvNoCC.mkDerivation {
  pname = "bingo";
  version = "0.0";

  src = lib.sourceByRegex ./. [
    "Makefile"
    "index\\.md"
    "items\\.json"
    "style\\.scss"
    "script\\.ts"
    "template\\.xhtml"
    "marx(/.*)?"
  ];

  nativeBuildInputs = [
    esbuild
    pandoc
    sassc
    typescript
  ];

  installPhase = ''
    runHook preInstall

    mv build "$out"

    runHook postInstall
  '';

  meta = {
    homepage = "https://github.com/club-aquarium/clubfahrt-bingo";
    license = lib.licenses.agpl3Plus;
    maintainers = [ lib.maintainers.schnusch ];
  };
}
