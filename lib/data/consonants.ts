import { ConsonantItem } from "./types";

export const MID: ConsonantItem[] = [
  { thai: "\u0e01", pb: "g\u0254\u0254 g\u00e0i", sound: "g", en: "chicken", cls: "mid" },
  { thai: "\u0e08", pb: "j\u0254\u0254 jaan", sound: "j", en: "plate", cls: "mid" },
  { thai: "\u0e14", pb: "d\u0254\u0254 d\u00e8k", sound: "d", en: "child", cls: "mid" },
  { thai: "\u0e15", pb: "dt\u0254\u0254 dt\u00e0o", sound: "dt", en: "turtle", cls: "mid" },
  { thai: "\u0e1a", pb: "b\u0254\u0254 bai-m\u00e1ai", sound: "b", en: "leaf", cls: "mid" },
  { thai: "\u0e1b", pb: "bp\u0254\u0254 bplaa", sound: "bp", en: "fish", cls: "mid" },
  { thai: "\u0e2d", pb: "\u0254\u0254 \u00e0ang", sound: "\u0254", en: "basin", cls: "mid" },
  { thai: "\u0e0e", pb: "d\u0254\u0254 ch\u00e1-daa", sound: "d", en: "headdress", cls: "mid" },
  { thai: "\u0e0f", pb: "dt\u0254\u0254 bp\u00e0-dt\u00e0k", sound: "dt", en: "spear", cls: "mid" },
];

export const HIGH: ConsonantItem[] = [
  { thai: "\u0e02", pb: "k\u0254\u030c\u0254 k\u00e0i", sound: "k", en: "egg", cls: "high" },
  { thai: "\u0e03", pb: "k\u0254\u030c\u0254 k\u00f9at", sound: "k", en: "bottle (obsolete)", cls: "high" },
  { thai: "\u0e09", pb: "ch\u0254\u030c\u0254 ch\u01d0ng", sound: "ch", en: "cymbals", cls: "high" },
  { thai: "\u0e10", pb: "t\u0254\u030c\u0254 t\u01ce\u0101n", sound: "t", en: "pedestal", cls: "high" },
  { thai: "\u0e16", pb: "t\u0254\u030c\u0254 t\u01d4ng", sound: "t", en: "sack", cls: "high" },
  { thai: "\u0e1c", pb: "p\u0254\u030c\u0254 p\u0289\u0302ng", sound: "p", en: "bee", cls: "high" },
  { thai: "\u0e1d", pb: "f\u0254\u030c\u0254 f\u01ce\u0101", sound: "f", en: "lid", cls: "high" },
  { thai: "\u0e28", pb: "s\u0254\u030c\u0254 s\u01ce\u0101-laa", sound: "s", en: "pavilion", cls: "high" },
  { thai: "\u0e29", pb: "s\u0254\u030c\u0254 r\u0289\u0289-s\u01d0i", sound: "s", en: "hermit", cls: "high" },
  { thai: "\u0e2a", pb: "s\u0254\u030c\u0254 s\u0289\u030c\u0101", sound: "s", en: "tiger", cls: "high" },
  { thai: "\u0e2b", pb: "h\u0254\u030c\u0254 h\u00ecip", sound: "h", en: "chest", cls: "high" },
];

export const LOW_PAIRED: ConsonantItem[] = [
  { thai: "\u0e04", pb: "k\u0254\u0254 kwaai", sound: "k", en: "buffalo", cls: "low" },
  { thai: "\u0e05", pb: "k\u0254\u0254 kon", sound: "k", en: "person (obsolete)", cls: "low" },
  { thai: "\u0e06", pb: "k\u0254\u0254 r\u00e1-kang", sound: "k", en: "bell", cls: "low" },
  { thai: "\u0e0a", pb: "ch\u0254\u0254 ch\u00e1ang", sound: "ch", en: "elephant", cls: "low" },
  { thai: "\u0e0c", pb: "ch\u0254\u0254 g\u00e0-ch\u0254\u0254", sound: "ch", en: "tree", cls: "low" },
  { thai: "\u0e11", pb: "t\u0254\u0254 mon-too", sound: "t", en: "Montho", cls: "low" },
  { thai: "\u0e12", pb: "t\u0254\u0254 p\u00f9u-t\u00e2o", sound: "t", en: "elder", cls: "low" },
  { thai: "\u0e17", pb: "t\u0254\u0254 t\u00e1-h\u01ce\u0101n", sound: "t", en: "soldier", cls: "low" },
  { thai: "\u0e18", pb: "t\u0254\u0254 tong", sound: "t", en: "flag", cls: "low" },
  { thai: "\u0e1e", pb: "p\u0254\u0254 paan", sound: "p", en: "tray", cls: "low" },
  { thai: "\u0e1f", pb: "f\u0254\u0254 fan", sound: "f", en: "teeth", cls: "low" },
  { thai: "\u0e20", pb: "p\u0254\u0254 sam-pao", sound: "p", en: "junk (ship)", cls: "low" },
  { thai: "\u0e0b", pb: "s\u0254\u0254 s\u00f4o", sound: "s", en: "chain", cls: "low" },
  { thai: "\u0e2e", pb: "h\u0254\u0254 n\u00f3k-h\u00f9uk", sound: "h", en: "owl", cls: "low" },
];

export const LOW_SONORANT: ConsonantItem[] = [
  { thai: "\u0e07", pb: "ng\u0254\u0254 nguu", sound: "ng", en: "snake", cls: "low" },
  { thai: "\u0e19", pb: "n\u0254\u0254 n\u01d4u", sound: "n", en: "mouse", cls: "low" },
  { thai: "\u0e21", pb: "m\u0254\u0254 m\u00e1a", sound: "m", en: "horse", cls: "low" },
  { thai: "\u0e22", pb: "y\u0254\u0254 y\u00e1k", sound: "y", en: "giant", cls: "low" },
  { thai: "\u0e23", pb: "r\u0254\u0254 r\u0289a", sound: "r", en: "boat", cls: "low" },
  { thai: "\u0e25", pb: "l\u0254\u0254 ling", sound: "l", en: "monkey", cls: "low" },
  { thai: "\u0e27", pb: "w\u0254\u0254 w\u01ce\u0113n", sound: "w", en: "ring", cls: "low" },
  { thai: "\u0e0d", pb: "y\u0254\u0254 y\u01d0ng", sound: "y", en: "woman", cls: "low" },
  { thai: "\u0e13", pb: "n\u0254\u0254 neen", sound: "n", en: "novice monk", cls: "low" },
  { thai: "\u0e2c", pb: "l\u0254\u0254 j\u00f9-laa", sound: "l", en: "kite", cls: "low" },
];
