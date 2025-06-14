// Zentrale Simulation-Klasse
class FahrzeugSimulation {
  constructor() {
    this.kabelbaum = new Kabelbaum();
    this.lichtsteuergerät = new Lichtsteuergerät();
    this.hecksteuergerät = new Heckbeleuchtungssteuergerät();
    this.blinkrelais = new Blinkrelais();
    this.lichtschalter = new Lichtschalter(this.lichtsteuergerät);
    this.bremslichtschalter = new Bremslichtschalter(this.hecksteuergerät);
    this.rückfahrlichtschalter = new Rückfahrlichtschalter(this.hecksteuergerät);
    this.türsteuergerät = new Türsteuergerät();
  }
}

const simulation = new FahrzeugSimulation();

// ---------- Logging ----------
function log(msg) {
  const el = document.getElementById("log");
  el.textContent += msg + "\n";
  el.scrollTop = el.scrollHeight;
}

const originalLog = console.log;
console.log = function (...args) {
  originalLog(...args);
  log(args.join(" "));
};

// ---------- Button-Logik ----------
function toggleTFL() {
  simulation.lichtschalter.toggleTFL();
  updateCockpit();
}

function toggleAbblend() {
  simulation.lichtschalter.toggleAbblend();
  updateCockpit();
}

function toggleFern() {
  simulation.lichtschalter.toggleFern();
  updateCockpit();
}

function toggleNebel() {
  simulation.lichtschalter.toggleNebel();
  updateCockpit();
}

function toggleInnen() {
  simulation.lichtschalter.toggleInnenraum();
  updateCockpit();
}

function starteBlinken(modus) {
  const relais = simulation.blinkrelais;
  if (relais.blinkInterval && relais.modus === modus) {
    relais.stopBlinken();
  } else {
    relais.stopBlinken();
    relais.startBlinken(modus);
  }
  updateCockpit();
}

function drueckeBremse() {
  simulation.bremslichtschalter.drückeBremse();
  updateCockpit();
}

function loeseBremse() {
  simulation.bremslichtschalter.löseBremse();
  updateCockpit();
}

function gangEinlegen() {
  simulation.rückfahrlichtschalter.gangEinlegen();
  updateCockpit();
}

function gangAuslegen() {
  simulation.rückfahrlichtschalter.gangAuslegen();
  updateCockpit();
}

function tuerStatus(seite, status) {
  simulation.türsteuergerät.setTürStatus(seite, status);
  updateCockpit();
}

// ---------- Cockpit Update ----------
function updateCockpit() {
  const lsg = simulation.lichtsteuergerät;
  const hsg = simulation.hecksteuergerät;
  const relais = simulation.blinkrelais;

  setActive("anzeige-tfl", lsg.getStatus("tfl"));
  setActive("anzeige-abblend", lsg.getStatus("abblendlicht"));
  setActive("anzeige-fern", lsg.getStatus("fernlicht"));
  setActive("anzeige-nebel", lsg.getStatus("nebelscheinwerfer"));
  setActive("anzeige-innen", lsg.getStatus("innenraumBeleuchtung"));
  setActive("anzeige-kenn-v", lsg.getStatus("kennzeichenVorne"));
  setActive("anzeige-kenn-h", hsg.getStatus("kennzeichenH"));

  setActive("anzeige-brems", 
    hsg.getStatus("bremsL") || hsg.getStatus("bremsR") || hsg.getStatus("bremsM")
  );
  setActive("anzeige-rueckf", 
    hsg.getStatus("rückfahrL") || hsg.getStatus("rückfahrR")
  );

  if (relais.blinkStatus) {
    if (relais.modus === "links") {
      setActive("anzeige-blinker-links", true);
      setActive("anzeige-blinker-rechts", false);
      setActive("anzeige-warnblinker", false);
    } else if (relais.modus === "rechts") {
      setActive("anzeige-blinker-links", false);
      setActive("anzeige-blinker-rechts", true);
      setActive("anzeige-warnblinker", false);
    } else if (relais.modus === "warn") {
      setActive("anzeige-blinker-links", true);
      setActive("anzeige-blinker-rechts", true);
      setActive("anzeige-warnblinker", true);
    }
  } else {
    setActive("anzeige-blinker-links", false);
    setActive("anzeige-blinker-rechts", false);
    setActive("anzeige-warnblinker", false);
  }
}

function setActive(id, active) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("active", active);
}
