{
  lib,
  stdenvNoCC,
  fetchurl,
  esbuild,
  nodePackages,
  pandoc,
  sassc,
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
    nodePackages.typescript
    pandoc
    sassc
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
