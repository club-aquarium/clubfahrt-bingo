(() => {
  // items.json
  var items = [
    "Lukas bezeichnet jemanden/alle als dumm",
    "Umstieg verpasst",
    "Getr\xE4nk im Zug versch\xFCtet",
    "zu wenig Bier mit",
    "zu viel Bier mit",
    "zu wenig Essen mit",
    "zu viel Essen mit",
    "kein Essen f\xFCr die Fahrt eingepackt",
    "keine Getr\xE4nke f\xFCr die Fahrt eingepackt",
    "Autopanne",
    "Autofahrer verfahren sich",
    "jemand macht das ganze Wochenende keinen Finger krum",
    'Zitat: "Warum kein Fassbier?"',
    `Zitat: "Wie is'n jetzt der Plan f\xFCr heute?"`,
    "Klinkenkabel kaputt",
    "Liegestuhl geht kaputt",
    `Zitat: "Wann gibt's endlich Essen?"`,
    "Trinkverbot im Zug",
    "Attila will grillen",
    "keine passende Kleidung dabei",
    "die H\xE4lfte geht vor 0:00 ins Bett",
    'Zitat: "Ich kann noch fahren!"',
    "Polizei-/RTW-Einsatz",
    'jemand redet \xFCber "fr\xFCher\u2122"',
    "Attila will etwas anz\xFCnden",
    "etwas dummes mit Feuerholz",
    'Zitat: "Wie k\xF6nnt ihr jetzt schon wieder trinken?"',
    "jemand tanzt auf einem (Bier-)Tisch",
    "Bodyshots",
    "\xFCberall Sand",
    "Dummer Spruch wegen Mittwochs-Stammtisch",
    "Nachbarn beschweren sich",
    "jemand ist (fast) zu sp\xE4t am Zug",
    "Zug ohne Toilette",
    "jemand beschwert sich \xFCber keinen Empfang",
    "etwas in der Unterkunft geht kaputt",
    'Zitat: "Lagerfeuer ist langweilig, k\xF6nnen wir nicht wandern gehen?"',
    "es wird sich \xFCber Musik beschwert",
    "DJ Dettweiler am morgen",
    "Ferdinand ist absichtlich dumm",
    "jemand macht rum",
    "Katharina r\xE4umt eine fremde Reisetasche aus",
    "jemand heult",
    "jemand kotzt",
    "Gregor hat Sonnenbrand",
    "Attila ist allergisch auf etwas",
    "kein Orangensaft mehr zum Fr\xFChst\xFCck",
    "jemandes Kippen sind alle",
    "Attila ist absichtlich dumm",
    "Katharina p\xF6belt betrunken",
    "Tim ist eingeschnappt",
    "Tim wird sinnlos angep\xF6belt",
    "Ansgar sucht sein Handy",
    "Ansgar beschwert sich, dass er zu viel getrunken hat",
    "Ronja ist betrunken",
    "irgendwas mit Till und Kreuzfahrt",
    "Gregor isst weirden Schei\xDF",
    `Gregor isst Fleisch, "weil's ja sonst wegkommt"`,
    "Benjamin und/oder Lukas saufen einen Kasten PU am Tag",
    "kein PU mehr da",
    'jemand macht "Mittagsschlaf"',
    "jemand benutzt eine Bluetooth Box obwohl der Monitor daneben steht",
    'jemand will das "n-te" trinken',
    'jemand will den "gr\xFCnen Tisch" zur\xFCck',
    "OKG wird angek\xFCndigt",
    'dummer Spruch \xFCber "Papier, paar Bier oder Barbier"',
    'dummer Spruch \xFCber "Baguette-/Parkettboden"',
    'Lukas erw\xE4hnt seine "Lieblingstrilogien"',
    "Patricia friert",
    "Erik erz\xE4hlt von der Clubfahrt nach Doksy",
    "Schwarzer Steiger ist vorm PU alle",
    "PU ist vorm Schwarzen Steiger alle",
    "Kein Internet aufm Klo",
    "jemand fliegt auf die Fresse",
    "jemand erw\xE4hnt ein Kevin-Meme",
    "\u22659\u202Fl Coke Zero gehen wieder zur\xFCck",
    "Gregor macht einen Backflip",
    "jemand sucht seinen Hut"
  ];

  // script.ts
  function guess_rectangle_dimensions(n) {
    if (n <= 0) {
      return [0, 0];
    }
    const prime_factors = [];
    let p = 2;
    while (p <= n) {
      if (n % p == 0) {
        n /= p;
        prime_factors.unshift(p);
      } else {
        ++p;
      }
    }
    let x = 1, y = 1;
    for (p of prime_factors) {
      if (x < y) {
        x *= p;
      } else {
        y *= p;
      }
    }
    return [x, y];
  }
  function generate_fragment(columns, rows, center) {
    let i_center = -1;
    const indexes = [];
    for (let i = items.length; i-- > 0; ) {
      if (items[i] == center) {
        i_center = i;
      } else {
        indexes.push(i);
      }
    }
    if (i_center >= 0 && (columns != rows || rows % 2 == 0)) {
      indexes.push(i_center);
    }
    const picks = [];
    for (let i = columns * rows; i-- > 0; ) {
      const j = Math.floor(Math.random() * indexes.length);
      let k;
      if (i_center >= 0 && i == columns * Math.floor(rows / 2) + Math.floor(columns / 2)) {
        k = i_center;
      } else {
        k = indexes.splice(j, 1)[0];
      }
      picks.push({
        item: k,
        checked: false
      });
    }
    location.hash = dump_fragment(picks);
  }
  function dump_fragment(picks) {
    return "#" + picks.map((x) => `${x.item}${x.checked ? "x" : ""}`).join(",");
  }
  function parse_fragment(fragment) {
    try {
      return fragment.substr(1).split(",").map((x) => {
        const m = x.match(/^(\d+)(x?)$/);
        if (!m) {
          throw new Error();
        }
        return {
          item: parseInt(m[1], 10),
          checked: m[2].length > 0
        };
      });
    } catch (e) {
      return null;
    }
  }
  function fragment_changed(_) {
    const picks = parse_fragment(location.hash);
    if (picks == null) {
      let columns = 5;
      let rows = 5;
      let center = void 0;
      const m = location.hash.match(/^#(\d+)x(\d+)(?::(.*))?$/);
      if (m !== null) {
        columns = parseInt(m[1]);
        rows = parseInt(m[2]);
        if (m[3] !== void 0) {
          center = decodeURIComponent(m[3].replace(/\+/g, "%20"));
        }
      }
      generate_fragment(columns, rows, center);
    } else {
      update_bingo(picks);
    }
  }
  var bingo = null;
  function create_bingo_tile(picks, i) {
    const pick = picks[i];
    const item = items[pick.item];
    const outer = document.createElement("div");
    const inner = document.createElement("div");
    const inner2 = document.createElement("div");
    inner2.appendChild(document.createTextNode(item));
    inner.appendChild(inner2);
    outer.appendChild(inner);
    outer.addEventListener("click", (_) => {
      pick.checked = !pick.checked;
      location.hash = dump_fragment(picks);
    });
    return outer;
  }
  var old_picks = [];
  function equal_itemes(a, b) {
    const n = a.length;
    if (n != b.length) {
      return false;
    }
    for (let i = 0; i < n; i++) {
      if (a[i].item != b[i].item) {
        return false;
      }
    }
    return true;
  }
  function update_bingo(picks) {
    if (!equal_itemes(picks, old_picks)) {
      const [columns, rows] = guess_rectangle_dimensions(picks.length);
      bingo.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
      bingo.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
      bingo.innerHTML = "";
      for (let i = 0; i < picks.length; i++) {
        const tile = picks[i].elem = create_bingo_tile(picks, i);
        bingo.appendChild(tile);
      }
      old_picks = picks;
    }
    for (let i = 0; i < picks.length; i++) {
      const elem = old_picks[i].elem;
      if (elem) {
        if (picks[i].checked) {
          elem.classList.add("checked");
        } else {
          elem.classList.remove("checked");
        }
      }
    }
  }
  document.addEventListener("DOMContentLoaded", (_) => {
    document.body.classList.replace("nojs", "js");
    bingo = document.getElementById("bingo");
    if (!bingo) {
      return;
    }
    window.addEventListener("hashchange", fragment_changed);
    fragment_changed();
  });
})();
