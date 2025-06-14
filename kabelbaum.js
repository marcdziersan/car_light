class Kabelbaum {
  constructor() {
    this.front = {
      scheinw: {
        tfl: { l: "K_TFL_L", r: "K_TFL_R" },
        abblend: { l: "K_Abbl_L", r: "K_Abbl_R" },
        fern: { l: "K_Fern_L", r: "K_Fern_R" },
        nebel: { l: "K_Neb_L", r: "K_Neb_R" },
        blinker: { l: "K_Blink_F_L", r: "K_Blink_F_R" },
      },
      kotfl: {
        blinker: { l: "K_Blink_K_L", r: "K_Blink_K_R" },
      },
      spiegel: {
        blinker: { l: "K_Blink_Sp_L", r: "K_Blink_Sp_R" },
      },
      kennz: "K_Kenn_V",
    };
    this.innen = {
      beleucht: {
        vorne: "K_In_V",
        fußraum: "K_Fuß",
        rückbank: "K_In_R",
        kofferraum: "K_Koff",
        türlicht: { l: "K_Tür_L", r: "K_Tür_R" },
        türwarn: { l: "K_TürW_L", r: "K_TürW_R" },
      },
    };
    this.heck = {
      beleucht: {
        rot: { l: "K_H_R_L", r: "K_H_R_R" },
        blinker: { l: "K_Blink_H_L", r: "K_Blink_H_R" },
        rückfahr: { l: "K_Rückf_L", r: "K_Rückf_R" },
        brems: { l: "K_Brems_L", r: "K_Brems_R", m: "K_Brems_M" },
        nebelschluss: "K_NebSchl",
      },
      kennz: "K_Kenn_H",
    };
  }
}