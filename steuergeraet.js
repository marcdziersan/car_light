// Basis-Klasse für Steuergeräte mit Status-Tracking
class Steuergerät extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.status = {};
  }

  setStatus(key, state) {
    this.status[key] = state;
    console.log(`${this.name}: ${key} ${state ? "AN" : "AUS"}`);
    this.emit("statusChange", { key, state });
  }

  getStatus(key) {
    return this.status[key] || false;
  }
}

class Lichtsteuergerät extends Steuergerät {
  constructor() {
    super("Lichtsteuergerät");
    this.status = {
      tfl: false,
      abblendlicht: false,
      fernlicht: false,
      nebelscheinwerfer: false,
      blinkerVorne: false,
      innenraumBeleuchtung: false,
      kennzeichenVorne: false,
    };
  }

  setTFL(state) {
    this.setStatus("tfl", state);
  }
  setAbblendlicht(state) {
    this.setStatus("abblendlicht", state);
  }
  setFernlicht(state) {
    this.setStatus("fernlicht", state);
  }
  setNebelscheinwerfer(state) {
    this.setStatus("nebelscheinwerfer", state);
  }
  setBlinkerVorne(state) {
    this.setStatus("blinkerVorne", state);
  }
  setInnenraumBeleuchtung(state) {
    this.setStatus("innenraumBeleuchtung", state);
  }
  setKennzeichenVorne(state) {
    this.setStatus("kennzeichenVorne", state);
  }
}

class Heckbeleuchtungssteuergerät extends Steuergerät {
  constructor() {
    super("Heckbeleuchtungssteuergerät");
    this.status = {
      heckRotL: false,
      heckRotR: false,
      blinkerH_L: false,
      blinkerH_R: false,
      rückfahrL: false,
      rückfahrR: false,
      bremsL: false,
      bremsR: false,
      bremsM: false,
      nebelschluss: false,
      kennzeichenH: false,
    };
  }

  setHeckRotL(state) {
    this.setStatus("heckRotL", state);
  }
  setHeckRotR(state) {
    this.setStatus("heckRotR", state);
  }
  setBlinkerH_L(state) {
    this.setStatus("blinkerH_L", state);
  }
  setBlinkerH_R(state) {
    this.setStatus("blinkerH_R", state);
  }
  setRückfahrL(state) {
    this.setStatus("rückfahrL", state);
  }
  setRückfahrR(state) {
    this.setStatus("rückfahrR", state);
  }
  setBremsL(state) {
    this.setStatus("bremsL", state);
  }
  setBremsR(state) {
    this.setStatus("bremsR", state);
  }
  setBremsM(state) {
    this.setStatus("bremsM", state);
  }
  setNebelschluss(state) {
    this.setStatus("nebelschluss", state);
  }
  setKennzeichenH(state) {
    this.setStatus("kennzeichenH", state);
  }
}

class Blinkrelais extends Steuergerät {
  constructor() {
    super("Blinkrelais");
    this.blinkStatus = false;
    this.blinkInterval = null;
    this.modus = null; // "links", "rechts", "warn"
  }

  startBlinken(modus = "warn", intervalMs = 500) {
    if (this.blinkInterval) return;

    this.modus = modus;
    this.blinkStatus = true;
    console.log(`Blinkrelais: ${modus}-Blinken gestartet`);

    this.blinkInterval = setInterval(() => {
      this.blinkStatus = !this.blinkStatus;

      const lsg = simulation.lichtsteuergerät;
      const hsg = simulation.hecksteuergerät;

      // Reset alle Blinker vorher (sauberer)
      lsg.setStatus("blinkerVorne", false);
      hsg.setStatus("blinkerH_L", false);
      hsg.setStatus("blinkerH_R", false);

      if (this.modus === "links" || this.modus === "warn") {
        lsg.setStatus("blinkerVorne", this.blinkStatus); // Front L
        console.log("Kotflügel Blinker links", this.blinkStatus);
        console.log("Spiegel Blinker links", this.blinkStatus);
        hsg.setStatus("blinkerH_L", this.blinkStatus);
      }
      if (this.modus === "rechts" || this.modus === "warn") {
        lsg.setStatus("blinkerVorne", this.blinkStatus); // Front R
        console.log("Kotflügel Blinker rechts", this.blinkStatus);
        console.log("Spiegel Blinker rechts", this.blinkStatus);
        hsg.setStatus("blinkerH_R", this.blinkStatus);
      }
    }, intervalMs);
  }

  stopBlinken() {
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
      this.blinkInterval = null;
      this.blinkStatus = false;
      console.log(`Blinkrelais: ${this.modus}-Blinken gestoppt`);
      this.modus = null;

      // Alle Blinker aus
      simulation.lichtsteuergerät.setStatus("blinkerVorne", false);
      simulation.hecksteuergerät.setStatus("blinkerH_L", false);
      simulation.hecksteuergerät.setStatus("blinkerH_R", false);
    }
  }
}

class Lichtschalter extends Steuergerät {
  constructor(lichtsteuergerät) {
    super("Lichtschalter");
    this.lichtsteuergerät = lichtsteuergerät;
    this.eingaben = {
      abblend: false,
      fern: false,
      nebelschein: false,
      tfl: false,
      innen: false,
      türwarn: false,
    };
  }

  toggleAbblend() {
    this.eingaben.abblend = !this.eingaben.abblend;
    this.lichtsteuergerät.setAbblendlicht(this.eingaben.abblend);
  }
  toggleFern() {
    this.eingaben.fern = !this.eingaben.fern;
    this.lichtsteuergerät.setFernlicht(this.eingaben.fern);
  }
  toggleNebel() {
    this.eingaben.nebelschein = !this.eingaben.nebelschein;
    this.lichtsteuergerät.setNebelscheinwerfer(this.eingaben.nebelschein);
  }
  toggleTFL() {
    this.eingaben.tfl = !this.eingaben.tfl;
    this.lichtsteuergerät.setTFL(this.eingaben.tfl);
  }
  toggleInnenraum() {
    this.eingaben.innen = !this.eingaben.innen;
    this.lichtsteuergerät.setInnenraumBeleuchtung(this.eingaben.innen);
  }
  toggleTürwarn() {
    this.eingaben.türwarn = !this.eingaben.türwarn;
    console.log(`Türwarnleuchten ${this.eingaben.türwarn ? "AN" : "AUS"}`);
  }
}

class Bremslichtschalter extends Steuergerät {
  constructor(hecksteuergerät) {
    super("Bremslichtschalter");
    this.hecksteuergerät = hecksteuergerät;
    this.bremspedalGedrückt = false;
  }

  drückeBremse() {
    this.bremspedalGedrückt = true;
    this.hecksteuergerät.setBremsL(true);
    this.hecksteuergerät.setBremsR(true);
    this.hecksteuergerät.setBremsM(true);
    console.log("Bremslichtschalter: Bremspedal gedrückt");
  }

  löseBremse() {
    this.bremspedalGedrückt = false;
    this.hecksteuergerät.setBremsL(false);
    this.hecksteuergerät.setBremsR(false);
    this.hecksteuergerät.setBremsM(false);
    console.log("Bremslichtschalter: Bremspedal losgelassen");
  }
}

class Rückfahrlichtschalter extends Steuergerät {
  constructor(hecksteuergerät) {
    super("Rückfahrlichtschalter");
    this.hecksteuergerät = hecksteuergerät;
    this.rückwärtsgangEingelegt = false;
  }

  gangEinlegen() {
    this.rückwärtsgangEingelegt = true;
    this.hecksteuergerät.setRückfahrL(true);
    this.hecksteuergerät.setRückfahrR(true);
    console.log("Rückfahrlichtschalter: Rückwärtsgang eingelegt");
  }

  gangAuslegen() {
    this.rückwärtsgangEingelegt = false;
    this.hecksteuergerät.setRückfahrL(false);
    this.hecksteuergerät.setRückfahrR(false);
    console.log("Rückfahrlichtschalter: Rückwärtsgang ausgelegt");
  }
}

class Türsteuergerät extends Steuergerät {
  constructor() {
    super("Türsteuergerät");
    this.türen = {
      links: false,
      rechts: false,
    };
  }

  setTürStatus(tür, status) {
    if (!["links", "rechts"].includes(tür)) {
      console.error("Ungültige Türangabe");
      return;
    }
    this.türen[tür] = status;
    console.log(`Türsteuergerät: Tür ${tür} ${status ? "geöffnet" : "geschlossen"}`);
    console.log(`Türlicht ${status ? "AN" : "AUS"}`);
    console.log(`Türwarnleuchte ${status ? "AN" : "AUS"}`);
  }
}
