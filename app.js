const STAGE = { width: 1920, height: 1080 };
const MANAGED_PREFIX = "ORM__";
const MAX_RUNNERS = 20;
const RUNNER_PARTS = ["Feed", "Border", "Name", "Finish"];
const GLOBAL_PARTS = ["Background", "TitleBar", "TimerBorder", "TimerText", "Commentators", "FinishedScreen"];
const BASE_LAYER_ORDER = ["background", "runners", "timerText", "timerFrame", "commentators", "title", "finished"];
const NAME_FONT_HEIGHT_RATIO = 0.48;
const COMMON_FONT_FACES = [
  "Segoe UI",
  "Arial",
  "Arial Black",
  "Bahnschrift",
  "Calibri",
  "Cambria",
  "Candara",
  "Comic Sans MS",
  "Consolas",
  "Constantia",
  "Corbel",
  "Courier New",
  "Franklin Gothic Medium",
  "Garamond",
  "Georgia",
  "Impact",
  "Lucida Console",
  "Lucida Sans Unicode",
  "Microsoft Sans Serif",
  "Palatino Linotype",
  "Segoe Print",
  "Segoe Script",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana"
];
const DEFAULT_PANEL_GEOMETRY = {
  feed: { x: 0, y: 0, width: 1, height: 1 },
  name: { x: 0, y: 0.9384331443891731, width: 0.12478820808892653, height: 0.061566855610826816 },
  finish: { x: 0.8183807439824945, y: 0.9183078045222466, width: 0.18161925601750548, height: 0.08169219547775347 }
};
const DEFAULT_TIMER_BORDER = {
  enabled: true,
  x: 0.44,
  y: 0.905,
  width: 0.12,
  height: 0.065
};
const DEFAULT_ELEMENTS = {
  feed: true,
  feedBorder: true,
  name: true,
  nameText: true,
  runnerIcon: true,
  titleBar: true,
  timerBorder: true,
  builtInTimer: true,
  finishedTime: true
};
const DEFAULT_TIMER_TEXT = {
  fontFamily: "Segoe UI",
  fontSize: 50,
  format: "hhmmss",
  idleColor: "#9aa7ae",
  stoppedColor: "#f0b84a",
  runningColor: "#2dc6a3",
  strokeEnabled: false,
  strokeColor: "#000000",
  strokeWidth: 2,
  shadowEnabled: true,
  shadowColor: "#000000",
  shadowBlur: 8,
  shadowX: 0,
  shadowY: 2,
  state: "idle",
  elapsedMs: 0,
  startedAt: 0,
  plateImage: "",
  plateBackgroundColor: "#10161a",
  plateBackgroundOpacity: 84,
  plateRadius: 8,
  platePaddingX: 18,
  plateFillMode: "solid",
  plateGradientFrom: "#10161a",
  plateGradientTo: "#26343b",
  plateGradientAngle: 135,
  plateAnimateGradientAngle: false,
  plateGradientAngleSpeed: 45,
  plateTextureImage: "",
  plateTextureScale: 100,
  plateTextureX: 50,
  plateTextureY: 50,
  plateTextureScrollX: 0,
  plateTextureScrollY: 0,
  plateMode: "generated",
  showBox: false
};
const DEFAULT_FINISHED_TIME = {
  fontFamily: "Segoe UI",
  fontSize: 34,
  color: "#f0b84a",
  align: "right",
  lockToNameplate: false,
  strokeEnabled: false,
  strokeColor: "#000000",
  strokeWidth: 2,
  shadowEnabled: true,
  shadowColor: "#000000",
  shadowBlur: 8,
  shadowX: 0,
  shadowY: 2
};
// Default placement (fraction of the nameplate box) for a runner's icon — a
// square-ish slot on the left side of the plate. Icons keep their aspect ratio
// (object-fit: contain), so this rect is just the bounding area.
const DEFAULT_RUNNER_ICON_RECT = { x: 0.03, y: 0.12, width: 0.16, height: 0.76 };

// A neutral placeholder shown (preview only) while positioning Runner Icons for
// runners that don't have an icon set yet.
const DEFAULT_RUNNER_ICON_PLACEHOLDER =
  "data:image/svg+xml;utf8," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>" +
    "<rect width='100' height='100' rx='14' fill='rgba(240,184,74,0.22)' stroke='rgba(240,184,74,0.85)' stroke-width='4'/>" +
    "<circle cx='50' cy='38' r='16' fill='rgba(255,255,255,0.85)'/>" +
    "<path d='M22 82c0-15 12-24 28-24s28 9 28 24z' fill='rgba(255,255,255,0.85)'/></svg>"
  );

const DEFAULT_FINISHED_SCREEN = {
  accentColor: "#f0b84a",
  backdropColor: "#080b10",
  backdropOpacity: 82,
  rowSpeedMs: 520,
  rowStaggerMs: 120,
  showIcons: false,
  topIcon1: "",
  topIcon2: "",
  topIcon3: "",
  showGaps: false,
  showUnderline: true,
  showOnlyBackground: false,
  // Runner icons (uses each runner's assigned icon)
  showRunnerIcons: false,
  runnerIconPlacement: "before", // "before" | "after" the name
  // Personal-best comparison
  pbShowDelta: false,
  pbShowMode: "always", // "always" | "threshold"
  pbThresholdSec: 10,
  pbDeltaText: "+{delta} against PB", // {delta} => the time difference
  pbNewText: "New PB by {delta}!",
  pbFontFamily: "Segoe UI",
  pbFontSize: 28,
  pbColor: "#f0b84a",
  pbStrokeEnabled: false,
  pbStrokeColor: "#000000",
  pbStrokeWidth: 2,
  pbShadowEnabled: true,
  pbShadowColor: "#000000",
  pbShadowBlur: 8,
  pbShadowX: 0,
  pbShadowY: 2,
  // Leaderboard plate bobbing
  bobEnabled: false,
  bobAmplitude: 6, // px of vertical travel (each direction)
  bobSpeed: 3, // seconds per full bob cycle
  bobSmoothness: 100, // 0 = linear/mechanical, 100 = smooth ease-in-out
  bobStagger: true, // offset each plate's phase for a gentle wave
  // Header text
  heading: "FINAL RESULTS",
  headingFontFamily: "Segoe UI",
  headingFontSize: 64,
  headingColor: "#ffffff",
  headingStrokeEnabled: false,
  headingStrokeColor: "#000000",
  headingStrokeWidth: 2,
  headingShadowEnabled: true,
  headingShadowColor: "#000000",
  headingShadowBlur: 24,
  headingShadowX: 0,
  headingShadowY: 4,
  // Runner rows text
  runnerFontFamily: "Segoe UI",
  runnerFontSize: 40,
  runnerColor: "#ffffff",
  runnerStrokeEnabled: false,
  runnerStrokeColor: "#000000",
  runnerStrokeWidth: 2,
  runnerShadowEnabled: true,
  runnerShadowColor: "#000000",
  runnerShadowBlur: 8,
  runnerShadowX: 0,
  runnerShadowY: 2
};
const DEFAULT_COMMENTATORS = {
  enabled: false,
  label: "COMMENTARY",
  names: ["Commentator 1", "Commentator 2"],
  rect: { x: 0.03, y: 0.86, width: 0.30, height: 0.10 },
  fontFamily: "Segoe UI",
  fontSize: 34,
  textColor: "#ffffff",
  textX: 0,
  textY: 0,
  strokeEnabled: false,
  strokeColor: "#000000",
  strokeWidth: 2,
  shadowEnabled: true,
  shadowColor: "#000000",
  shadowBlur: 8,
  shadowX: 0,
  shadowY: 2,
  plateMode: "generated",
  plateImage: "",
  showBox: true,
  showBorder: true,
  plateFillMode: "solid",
  plateBackgroundColor: "#070a0c",
  plateBackgroundOpacity: 82,
  plateGradientFrom: "#070a0c",
  plateGradientTo: "#1f2d34",
  plateGradientAngle: 135,
  plateAnimateGradientAngle: false,
  plateGradientAngleSpeed: 45,
  plateTextureImage: "",
  plateTextureScale: 100,
  plateTextureX: 50,
  plateTextureY: 50,
  plateTextureScrollX: 0,
  plateTextureScrollY: 0,
  plateBorderColor: "#ffffff",
  plateBorderOpacity: 18,
  plateBorderWidth: 2,
  plateRadius: 10,
  platePaddingX: 16
};
const DEFAULT_PRONOUNS_TEXT = {
  enabled: true,
  fontFamily: "Segoe UI",
  fontSize: 28,
  textColor: "#ffffff",
  textX: 0,
  textY: 0,
  strokeEnabled: false,
  strokeColor: "#000000",
  strokeWidth: 2,
  shadowEnabled: true,
  shadowColor: "#000000",
  shadowBlur: 8,
  shadowX: 0,
  shadowY: 2
};
// The old playful defaults (Bangers/teal/red-stroke/green-shadow). Projects that
// never customised pronoun text still carry this exact signature, so we migrate
// them to the clean defaults on load (see normalizeLoadedLayout).
const LEGACY_PRONOUNS_TEXT_SIGNATURE = {
  fontFamily: "Bangers",
  textColor: "#00ffcc",
  strokeColor: "#ff0000",
  shadowColor: "#2bff00"
};
const BORDER_PRESETS = {
  graphite: {
    mode: "solid",
    lineColor: "#566570",
    glowColor: "#566570",
    lineWidth: 4,
    timerLineWidth: 8,
    radius: 18,
    gradientFrom: "#566570",
    gradientTo: "#9aa7ae",
    gradientAngle: 135,
    animateGradientAngle: false,
    gradientAngleSpeed: 45,
    textureImage: "",
    textureScale: 100,
    textureX: 50,
    textureY: 50,
    textureScrollX: 0,
    textureScrollY: 0
  },
  neon: {
    mode: "gradient",
    lineColor: "#2dc6a3",
    glowColor: "#2dc6a3",
    lineWidth: 14,
    timerLineWidth: 8,
    radius: 18,
    gradientFrom: "#2dc6a3",
    gradientTo: "#123b47",
    gradientAngle: 135,
    animateGradientAngle: false,
    gradientAngleSpeed: 45,
    textureImage: "",
    textureScale: 100,
    textureX: 50,
    textureY: 50,
    textureScrollX: 0,
    textureScrollY: 0
  },
  gold: {
    mode: "gradient",
    lineColor: "#f0b84a",
    glowColor: "#f0b84a",
    lineWidth: 14,
    timerLineWidth: 8,
    radius: 18,
    gradientFrom: "#fff0ba",
    gradientTo: "#f0b84a",
    gradientAngle: 135,
    animateGradientAngle: false,
    gradientAngleSpeed: 45,
    textureImage: "",
    textureScale: 100,
    textureX: 50,
    textureY: 50,
    textureScrollX: 0,
    textureScrollY: 0
  },
  broadcast: {
    mode: "gradient",
    lineColor: "#8aa4b2",
    glowColor: "#5f9fbe",
    lineWidth: 14,
    timerLineWidth: 8,
    radius: 18,
    gradientFrom: "#8aa4b2",
    gradientTo: "#ef6a63",
    gradientAngle: 135,
    animateGradientAngle: false,
    gradientAngleSpeed: 45,
    textureImage: "",
    textureScale: 100,
    textureX: 50,
    textureY: 50,
    textureScrollX: 0,
    textureScrollY: 0
  }
};

const state = {
  layout: {
    aspectPreset: "4:3",
    timerHeight: 130,
    titleHeight: 100,
    marginLeft: 36,
    marginRight: 36,
    gap: 20,
    viewMode: "edit",
    layerLock: false,
    sceneView: true,
    lockedElements: [],
    snapEnabled: true,
    animationMs: 360,
    animationFps: 60,
    animationStyle: "moveFade",
    finishAnimationMs: 360,
    finishAnimationFps: 60,
    finishAnimationStyle: "scaleFade",
    feedWidth: 1920,
    feedHeight: 1080,
    elements: { ...DEFAULT_ELEMENTS },
    setupPreviewSlot: 0,
    spotlight: {
      enabled: false,
      slots: "",
      showOthers: true,
      disableSmallNameplates: false,
      side: "bottom",
      stackOrder: "horizontal",
      mainScale: 78,
      otherScale: 22,
      gap: 20
    },
    timerText: { ...DEFAULT_TIMER_TEXT },
    finishedTime: { ...DEFAULT_FINISHED_TIME },
    finishedScreen: { ...DEFAULT_FINISHED_SCREEN },
    commentators: structuredClone(DEFAULT_COMMENTATORS),
    raceInfo: {
      title: "Race Title",
      subtitle: "",
      fontFamily: "Segoe UI",
      fontSize: 34,
      textColor: "#ffffff",
      strokeEnabled: false,
      strokeColor: "#000000",
      strokeWidth: 2,
      shadowEnabled: true,
      shadowColor: "#000000",
      shadowBlur: 8,
      shadowX: 0,
      shadowY: 2,
      plateImage: "",
      plateBackgroundColor: "#10161a",
      plateBackgroundOpacity: 84,
      plateBorderColor: "#ffffff",
      plateBorderOpacity: 14,
      plateBorderWidth: 1,
      plateRadius: 8,
      platePaddingX: 18,
      plateFillMode: "solid",
      plateGradientFrom: "#10161a",
      plateGradientTo: "#26343b",
      plateGradientAngle: 135,
      plateAnimateGradientAngle: false,
      plateGradientAngleSpeed: 45,
      plateTextureImage: "",
      plateTextureScale: 100,
      plateTextureX: 50,
      plateTextureY: 50,
      plateTextureScrollX: 0,
      plateTextureScrollY: 0,
      plateMode: "generated",
      showBox: true,
      showBorder: true,
      rect: { x: 0.28, y: 0.024, width: 0.44, height: 0.065 }
    },
    panelGeometry: structuredClone(DEFAULT_PANEL_GEOMETRY),
    timerBorder: { ...DEFAULT_TIMER_BORDER },
    nameplate: {
      fontFamily: "Segoe UI",
      fontSize: 44,
      textColor: "#ffffff",
      plateImage: "",
      plateBackgroundColor: "#070a0c",
      plateBackgroundOpacity: 82,
      plateBorderColor: "#ffffff",
      plateBorderOpacity: 18,
      plateBorderWidth: 2,
      plateRadius: 10,
      platePaddingX: 10,
      badgeColor: "#f0b84a",
      plateFillMode: "solid",
      plateGradientFrom: "#070a0c",
      plateGradientTo: "#1f2d34",
      plateGradientAngle: 135,
      plateAnimateGradientAngle: false,
      plateGradientAngleSpeed: 45,
      plateTextureImage: "",
      plateTextureScale: 100,
      plateTextureX: 50,
      plateTextureY: 50,
      plateTextureScrollX: 0,
      plateTextureScrollY: 0,
      textX: 0,
      textY: 0,
      plateMode: "generated",
      showBox: true,
      showBorder: true,
      showPlacement: true,
      strokeEnabled: false,
      strokeColor: "#000000",
      strokeWidth: 2,
      shadowEnabled: true,
      shadowColor: "#000000",
      shadowBlur: 8,
      shadowX: 0,
      shadowY: 2
    },
    pronounsText: { ...DEFAULT_PRONOUNS_TEXT },
    runnerIcon: { rect: { ...DEFAULT_RUNNER_ICON_RECT } },
    borderPreset: "graphite",
    borderTarget: "feed",
    borderModeSource: "generated",
    borderStyles: {
      feed: structuredClone(BORDER_PRESETS.graphite),
      timer: structuredClone(BORDER_PRESETS.graphite),
      title: structuredClone(BORDER_PRESETS.graphite),
      commentators: structuredClone(BORDER_PRESETS.graphite)
    },
    borderImages: {
      feed: "",
      timer: "",
      title: "",
      commentators: ""
    },
    borderStyle: structuredClone(BORDER_PRESETS.graphite),
    borderImage: "",
    backgroundImage: "",
    backgroundScale: 100,
    backgroundScrollX: 0,
    backgroundScrollY: 0,
    mediaLayers: [],
    layerOrder: [...BASE_LAYER_ORDER]
  },
  runners: createDefaultRunners()
};

const els = {};
const history = {
  undo: [],
  redo: [],
  maxDepth: 80,
  lastPointerSnapshot: null
};
const selection = {
  kind: "",
  activePanel: "layout",
  globalPanel: "layout",
  elementId: "scene"
};
// Transient UI state (not persisted with the project).
const uiState = {
  finishedScreenVisible: false
};
const obsBridge = {
  client: null,
  connected: false,
  connecting: false,
  sceneName: "ORM__Default",
  itemIds: new Map(),
  autoApply: true,
  animateLayout: true,
  applyTimer: 0,
  applying: false,
  pendingApply: false,
  operationQueue: Promise.resolve(),
  operationDepth: 0,
  opacitySupported: false,
  lastRects: new Map(),
  lastVisibility: new Map(),
  lastFinishVisibility: new Map(),
  lastSceneItemEnabled: new Map()
};
let previewRefreshFrame = 0;
let previewRefreshTimer = 0;
let previewLiveRefreshFrame = 0;
let previewLiveRefreshUntil = 0;
let timerPreviewInterval = 0;

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  hideObsoletePlateRadiusControls();
  renderRunnerControls();
  renderStagePanels();
  bindGlobalControls();
  syncGlobalControlsFromState();
  bindStageSizing();
  applySceneView();
  update();
  makeOutputsEditable();
});

function createDefaultRunners() {
  return Array.from({ length: MAX_RUNNERS }, (_, index) => {
    const slot = index + 1;
    const runner = createRunner(slot, `Runner ${slot}`, "", slot <= 2, zeroCrop());
    runner.collapsed = true;
    return runner;
  });
}

function createRunner(slot, name, source, active, crop) {
  return {
    slot,
    active,
    name,
    source,
    feedMode: "live",
    placement: slot,
    done: false,
    finalTimeMs: null,
    finalTimeText: "",
    audioMuted: false,
    audioVolume: 100,
    crop,
    collapsed: false,
    pronounPrimary: "",
    pronounSecondary: "",
    pronounCustom: "",
    icon: "",
    pb: "",
    unique: false,
    style: null
  };
}

// Per-runner style override. When a runner is "unique", it renders with its own
// nameplate, finish-time, and game-feed border configs instead of the shared
// ones. Implemented as a render-time swap so no per-runner threading is needed.
function makeRunnerUnique(runner) {
  if (!runner.style) runner.style = {};
  if (!runner.style.nameplate) runner.style.nameplate = structuredClone(state.layout.nameplate);
  if (!runner.style.finishedTime) runner.style.finishedTime = structuredClone(state.layout.finishedTime);
  if (!runner.style.borderStyle) runner.style.borderStyle = structuredClone(getBorderStyle("feed"));
  if (runner.style.borderImage === undefined) runner.style.borderImage = getBorderImage("feed");
  runner.unique = true;
}

// Run `fn` with the shared configs temporarily swapped to the runner's overrides
// (if unique). Synchronous only — callers must build strings inside.
function withRunnerStyle(runner, fn) {
  if (!runner || !runner.unique || !runner.style) return fn();
  const s = runner.style;
  const saved = {
    np: state.layout.nameplate,
    ft: state.layout.finishedTime,
    bs: state.layout.borderStyles.feed,
    bi: state.layout.borderImages.feed
  };
  if (s.nameplate) state.layout.nameplate = s.nameplate;
  if (s.finishedTime) state.layout.finishedTime = s.finishedTime;
  if (s.borderStyle) state.layout.borderStyles.feed = s.borderStyle;
  if (s.borderImage !== undefined) state.layout.borderImages.feed = s.borderImage;
  try {
    return fn();
  } finally {
    state.layout.nameplate = saved.np;
    state.layout.finishedTime = saved.ft;
    state.layout.borderStyles.feed = saved.bs;
    state.layout.borderImages.feed = saved.bi;
  }
}

// The runner currently being edited (a selected, unique runner), or null.
function editingUniqueRunner() {
  const id = selection.elementId;
  if (state.layout.sceneView && typeof id === "string" && id.startsWith("runner:")) {
    const slot = Number(id.split(":")[1]);
    const runner = state.runners.find((r) => r.slot === slot);
    if (runner && runner.unique && runner.style) return runner;
  }
  return null;
}

// The configs the Properties controls should read/write: the selected unique
// runner's override when editing one, else the shared config.
function activeNameplate() {
  const runner = editingUniqueRunner();
  return runner && runner.style.nameplate ? runner.style.nameplate : state.layout.nameplate;
}

function activeFinishedTime() {
  const runner = editingUniqueRunner();
  return runner && runner.style.finishedTime ? runner.style.finishedTime : state.layout.finishedTime;
}

function zeroCrop() {
  return { left: 0, top: 0, right: 0, bottom: 0 };
}

function startBuiltInTimer() {
  pushHistory("timer start");
  const elapsed = currentTimerElapsedMs();
  state.layout.timerText.state = "running";
  state.layout.timerText.startedAt = Date.now() - elapsed;
  startTimerPreviewTicker();
  update();
  scheduleObsApply("timerText", 0);
}

function stopBuiltInTimer() {
  pushHistory("timer stop");
  state.layout.timerText.elapsedMs = currentTimerElapsedMs();
  state.layout.timerText.state = "stopped";
  state.layout.timerText.startedAt = 0;
  stopTimerPreviewTicker();
  update();
  scheduleObsApply("timerText", 0);
}

function resetBuiltInTimer() {
  pushHistory("timer reset");
  state.layout.timerText.elapsedMs = 0;
  state.layout.timerText.startedAt = 0;
  state.layout.timerText.state = "idle";
  stopTimerPreviewTicker();
  update();
  scheduleObsApply("timerText", 0);
}

function currentTimerElapsedMs() {
  if (state.layout.timerText.state === "running") {
    return Math.max(0, Date.now() - Number(state.layout.timerText.startedAt || Date.now()));
  }
  return Math.max(0, Number(state.layout.timerText.elapsedMs) || 0);
}

function startTimerPreviewTicker() {
  if (timerPreviewInterval) return;
  timerPreviewInterval = window.setInterval(() => {
    if (state.layout.timerText.state !== "running") {
      stopTimerPreviewTicker();
      return;
    }
    applyTimerTextPreviewGeometry();
    renderControlMode();
  }, 200);
}

function stopTimerPreviewTicker() {
  window.clearInterval(timerPreviewInterval);
  timerPreviewInterval = 0;
}

function formatTimerDisplay(ms, format = state.layout.timerText.format) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (format === "mmss") {
    return `${String(totalMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  if (format === "mmssms") {
    const milliseconds = Math.floor(ms % 1000);
    return `${String(totalMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
  }
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

function timerTextColor() {
  const config = state.layout.timerText;
  if (config.state === "running") return config.runningColor;
  if (config.state === "stopped") return config.stoppedColor;
  return config.idleColor;
}

function timerTextShadowCss(config, scale = 1) {
  const value = timerTextShadowValue(config, scale);
  const shadow = value === "none" ? "text-shadow:none;" : `text-shadow:${value};`;
  return `${shadow}${nativeTextStrokeCss(config, scale)}`;
}

function timerTextShadowValue(config, scale = 1) {
  const shadows = [];
  if (config.shadowEnabled) {
    shadows.push(`${Number(config.shadowX) * scale}px ${Number(config.shadowY) * scale}px ${Number(config.shadowBlur) * scale}px ${config.shadowColor}`);
  }
  return shadows.length > 0 ? shadows.join(",") : "none";
}

function nativeTextStrokeCss(config, scale = 1) {
  if (!config.strokeEnabled || Number(config.strokeWidth) <= 0) {
    return "-webkit-text-stroke:0 transparent;paint-order:normal;";
  }
  const width = Math.max(0, Number(config.strokeWidth) || 0) * scale;
  return `-webkit-text-stroke:${width}px ${config.strokeColor};paint-order:stroke fill;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;`;
}

function hideObsoletePlateRadiusControls() {
  for (const input of [els.timerPlateRadius, els.raceInfoPlateRadius]) {
    const row = input?.closest?.("label");
    if (row) row.remove();
  }
}

function bindElements() {
  els.leftEditTabs = document.querySelector(".left-edit-tabs");
  els.runnerControls = document.getElementById("runnerControls");
  els.mediaLayer = document.getElementById("mediaLayer");
  els.addMediaLayer = document.getElementById("addMediaLayer");
  els.addMediaMenu = document.getElementById("addMediaMenu");
  els.addImageLayer = document.getElementById("addImageLayer");
  els.addVideoLayer = document.getElementById("addVideoLayer");
  els.mediaLayerFile = document.getElementById("mediaLayerFile");
  els.runnerLayer = document.getElementById("runnerLayer");
  els.stage = document.getElementById("stage");
  els.stageWrap = document.querySelector(".stage-wrap");
  els.snapGuideV = document.getElementById("snapGuideV");
  els.snapGuideH = document.getElementById("snapGuideH");
  els.titleBarPreview = document.getElementById("titleBarPreview");
  els.commentatorsPreview = document.getElementById("commentatorsPreview");
  els.commEnabled = document.getElementById("commEnabled");
  els.commLabel = document.getElementById("commLabel");
  els.commNames = document.getElementById("commNames");
  els.commFont = document.getElementById("commFont");
  els.commFontChoices = document.getElementById("commFontChoices");
  els.commFontBrowser = document.getElementById("commFontBrowser");
  els.commBrowseFonts = document.getElementById("commBrowseFonts");
  els.commFontSize = document.getElementById("commFontSize");
  els.commColor = document.getElementById("commColor");
  els.commTextX = document.getElementById("commTextX");
  els.commTextY = document.getElementById("commTextY");
  els.commStrokeEnabled = document.getElementById("commStrokeEnabled");
  els.commStrokeColor = document.getElementById("commStrokeColor");
  els.commStrokeWidth = document.getElementById("commStrokeWidth");
  els.commShadowEnabled = document.getElementById("commShadowEnabled");
  els.commShadowColor = document.getElementById("commShadowColor");
  els.commShadowBlur = document.getElementById("commShadowBlur");
  els.commShadowX = document.getElementById("commShadowX");
  els.commShadowY = document.getElementById("commShadowY");
  els.commPlateMode = document.getElementById("commPlateMode");
  els.commPlateImage = document.getElementById("commPlateImage");
  els.commClearPlateImage = document.getElementById("commClearPlateImage");
  els.commShowBox = document.getElementById("commShowBox");
  els.commFillMode = document.getElementById("commFillMode");
  els.commBgColor = document.getElementById("commBgColor");
  els.commBgOpacity = document.getElementById("commBgOpacity");
  els.commBgOpacityValue = document.getElementById("commBgOpacityValue");
  els.commGradFrom = document.getElementById("commGradFrom");
  els.commGradTo = document.getElementById("commGradTo");
  els.commGradAngle = document.getElementById("commGradAngle");
  els.commGradAngleSlider = document.getElementById("commGradAngleSlider");
  els.commGradAnimate = document.getElementById("commGradAnimate");
  els.commGradSpeedRow = document.getElementById("commGradSpeedRow");
  els.commGradSpeed = document.getElementById("commGradSpeed");
  els.commGradSpeedValue = document.getElementById("commGradSpeedValue");
  els.commTextureImage = document.getElementById("commTextureImage");
  els.commClearTexture = document.getElementById("commClearTexture");
  els.commTextureScale = document.getElementById("commTextureScale");
  els.commTextureScaleValue = document.getElementById("commTextureScaleValue");
  els.commTextureX = document.getElementById("commTextureX");
  els.commTextureY = document.getElementById("commTextureY");
  els.commTextureScrollX = document.getElementById("commTextureScrollX");
  els.commTextureScrollXValue = document.getElementById("commTextureScrollXValue");
  els.commTextureScrollY = document.getElementById("commTextureScrollY");
  els.commTextureScrollYValue = document.getElementById("commTextureScrollYValue");
  els.commPadding = document.getElementById("commPadding");
  els.timerBorder = document.getElementById("timerBorder");
  els.timerTextPreview = document.getElementById("timerTextPreview");
  els.activeCount = document.getElementById("activeCount");
  els.layoutSummary = document.getElementById("layoutSummary");
  els.aspectPreset = document.getElementById("aspectPreset");
  els.timerHeight = document.getElementById("timerHeight");
  els.titleHeight = document.getElementById("titleHeight");
  els.marginLeft = document.getElementById("marginLeft");
  els.marginLeftValue = document.getElementById("marginLeftValue");
  els.marginRight = document.getElementById("marginRight");
  els.marginRightValue = document.getElementById("marginRightValue");
  els.gapSize = document.getElementById("gapSize");
  els.builtInTimerEnabled = document.getElementById("builtInTimerEnabled");
  els.timerStart = document.getElementById("timerStart");
  els.timerStop = document.getElementById("timerStop");
  els.timerReset = document.getElementById("timerReset");
  els.timerFormat = document.getElementById("timerFormat");
  els.timerFont = document.getElementById("timerFont");
  els.timerFontChoices = document.getElementById("timerFontChoices");
  els.timerFontBrowser = document.getElementById("timerFontBrowser");
  els.timerBrowseFonts = document.getElementById("timerBrowseFonts");
  els.timerFontStatus = document.getElementById("timerFontStatus");
  els.timerFontSize = document.getElementById("timerFontSize");
  els.timerFontSizeValue = document.getElementById("timerFontSizeValue");
  els.timerIdleColor = document.getElementById("timerIdleColor");
  els.timerStoppedColor = document.getElementById("timerStoppedColor");
  els.timerRunningColor = document.getElementById("timerRunningColor");
  els.timerStrokeEnabled = document.getElementById("timerStrokeEnabled");
  els.timerStrokeColor = document.getElementById("timerStrokeColor");
  els.timerStrokeWidth = document.getElementById("timerStrokeWidth");
  els.timerShadowEnabled = document.getElementById("timerShadowEnabled");
  els.timerShadowColor = document.getElementById("timerShadowColor");
  els.timerShadowBlur = document.getElementById("timerShadowBlur");
  els.timerShadowX = document.getElementById("timerShadowX");
  els.timerShadowY = document.getElementById("timerShadowY");
  els.timerPlateMode = document.getElementById("timerPlateMode");
  els.timerShowBox = document.getElementById("timerShowBox");
  els.timerPlateFillMode = document.getElementById("timerPlateFillMode");
  els.timerPlateBackgroundColor = document.getElementById("timerPlateBackgroundColor");
  els.timerPlateGradientFrom = document.getElementById("timerPlateGradientFrom");
  els.timerPlateGradientTo = document.getElementById("timerPlateGradientTo");
  els.timerPlateGradientAngle = document.getElementById("timerPlateGradientAngle");
  els.timerPlateGradientAngleSlider = document.getElementById("timerPlateGradientAngleSlider");
  els.timerPlateAnimateGradientAngle = document.getElementById("timerPlateAnimateGradientAngle");
  els.timerPlateGradientAngleSpeed = document.getElementById("timerPlateGradientAngleSpeed");
  els.timerPlateGradientAngleSpeedValue = document.getElementById("timerPlateGradientAngleSpeedValue");
  els.timerPlateGradientSpeedRow = document.getElementById("timerPlateGradientSpeedRow");
  els.timerPlateTextureImage = document.getElementById("timerPlateTextureImage");
  els.clearTimerPlateTextureImage = document.getElementById("clearTimerPlateTextureImage");
  els.timerPlateTextureScale = document.getElementById("timerPlateTextureScale");
  els.timerPlateTextureScaleValue = document.getElementById("timerPlateTextureScaleValue");
  els.timerPlateTextureX = document.getElementById("timerPlateTextureX");
  els.timerPlateTextureY = document.getElementById("timerPlateTextureY");
  els.timerPlateTextureScrollX = document.getElementById("timerPlateTextureScrollX");
  els.timerPlateTextureScrollXValue = document.getElementById("timerPlateTextureScrollXValue");
  els.timerPlateTextureScrollY = document.getElementById("timerPlateTextureScrollY");
  els.timerPlateTextureScrollYValue = document.getElementById("timerPlateTextureScrollYValue");
  els.timerPlateBackgroundOpacity = document.getElementById("timerPlateBackgroundOpacity");
  els.timerPlateRadius = document.getElementById("timerPlateRadius");
  els.timerPlatePaddingX = document.getElementById("timerPlatePaddingX");
  els.timerPlateImage = document.getElementById("timerPlateImage");
  els.clearTimerPlateImage = document.getElementById("clearTimerPlateImage");
  els.setupPreviewSlot = document.getElementById("setupPreviewSlot");
  els.spotlightEnabled = document.getElementById("spotlightEnabled");
  els.spotlightSlots = document.getElementById("spotlightSlots");
  els.spotlightShowOthers = document.getElementById("spotlightShowOthers");
  els.spotlightDisableSmallNameplates = document.getElementById("spotlightDisableSmallNameplates");
  els.spotlightSide = document.getElementById("spotlightSide");
  els.spotlightStackOrder = document.getElementById("spotlightStackOrder");
  els.spotlightMainScale = document.getElementById("spotlightMainScale");
  els.spotlightMainScaleValue = document.getElementById("spotlightMainScaleValue");
  els.spotlightOtherScale = document.getElementById("spotlightOtherScale");
  els.spotlightOtherScaleValue = document.getElementById("spotlightOtherScaleValue");
  els.spotlightGap = document.getElementById("spotlightGap");
  els.spotlightGapValue = document.getElementById("spotlightGapValue");
  els.animationMs = document.getElementById("animationMs");
  els.animationStyle = document.getElementById("animationStyle");
  els.animationFps = document.getElementById("animationFps");
  els.finishAnimationMs = document.getElementById("finishAnimationMs");
  els.finishAnimationStyle = document.getElementById("finishAnimationStyle");
  els.finishAnimationFps = document.getElementById("finishAnimationFps");
  els.finishAnimationValue = document.getElementById("finishAnimationValue");
  els.finishAnimationFpsValue = document.getElementById("finishAnimationFpsValue");
  els.timerHeightValue = document.getElementById("timerHeightValue");
  els.titleHeightValue = document.getElementById("titleHeightValue");
  els.gapValue = document.getElementById("gapValue");
  els.animationValue = document.getElementById("animationValue");
  els.animationFpsValue = document.getElementById("animationFpsValue");
  els.feedWidth = document.getElementById("feedWidth");
  els.feedHeight = document.getElementById("feedHeight");
  els.feedX = document.getElementById("feedX");
  els.feedY = document.getElementById("feedY");
  els.feedW = document.getElementById("feedW");
  els.feedH = document.getElementById("feedH");
  els.nameX = document.getElementById("nameX");
  els.nameY = document.getElementById("nameY");
  els.nameW = document.getElementById("nameW");
  els.nameH = document.getElementById("nameH");
  els.finishX = document.getElementById("finishX");
  els.finishY = document.getElementById("finishY");
  els.finishW = document.getElementById("finishW");
  els.finishH = document.getElementById("finishH");
  els.timerBorderEnabled = document.getElementById("timerBorderEnabled");
  els.layerLockEnabled = document.getElementById("layerLockEnabled");
  els.snapEnabled = document.getElementById("snapEnabled");
  els.feedVisible = document.getElementById("feedVisible");
  els.feedBorderVisible = document.getElementById("feedBorderVisible");
  els.nameVisible = document.getElementById("nameVisible");
  els.finishedTimeVisible = document.getElementById("finishedTimeVisible");
  els.titleBarVisible = document.getElementById("titleBarVisible");
  els.timerX = document.getElementById("timerX");
  els.timerY = document.getElementById("timerY");
  els.timerW = document.getElementById("timerW");
  els.timerH = document.getElementById("timerH");
  els.titleX = document.getElementById("titleX");
  els.titleY = document.getElementById("titleY");
  els.titleW = document.getElementById("titleW");
  els.titleH = document.getElementById("titleH");
  els.raceInfoEnabled = document.getElementById("raceInfoEnabled");
  els.raceTitle = document.getElementById("raceTitle");
  els.raceSubtitle = document.getElementById("raceSubtitle");
  els.raceInfoFont = document.getElementById("raceInfoFont");
  els.raceInfoFontChoices = document.getElementById("raceInfoFontChoices");
  els.raceInfoFontBrowser = document.getElementById("raceInfoFontBrowser");
  els.raceInfoBrowseFonts = document.getElementById("raceInfoBrowseFonts");
  els.raceInfoFontSize = document.getElementById("raceInfoFontSize");
  els.raceInfoTextColor = document.getElementById("raceInfoTextColor");
  els.raceInfoStrokeEnabled = document.getElementById("raceInfoStrokeEnabled");
  els.raceInfoStrokeColor = document.getElementById("raceInfoStrokeColor");
  els.raceInfoStrokeWidth = document.getElementById("raceInfoStrokeWidth");
  els.raceInfoShadowEnabled = document.getElementById("raceInfoShadowEnabled");
  els.raceInfoShadowColor = document.getElementById("raceInfoShadowColor");
  els.raceInfoShadowBlur = document.getElementById("raceInfoShadowBlur");
  els.raceInfoShadowX = document.getElementById("raceInfoShadowX");
  els.raceInfoShadowY = document.getElementById("raceInfoShadowY");
  els.raceInfoPlateMode = document.getElementById("raceInfoPlateMode");
  els.raceInfoPlateImage = document.getElementById("raceInfoPlateImage");
  els.clearRaceInfoPlateImage = document.getElementById("clearRaceInfoPlateImage");
  els.raceInfoShowBox = document.getElementById("raceInfoShowBox");
  els.raceInfoPlateBackgroundColor = document.getElementById("raceInfoPlateBackgroundColor");
  els.raceInfoPlateFillMode = document.getElementById("raceInfoPlateFillMode");
  els.raceInfoPlateGradientFrom = document.getElementById("raceInfoPlateGradientFrom");
  els.raceInfoPlateGradientTo = document.getElementById("raceInfoPlateGradientTo");
  els.raceInfoPlateGradientAngle = document.getElementById("raceInfoPlateGradientAngle");
  els.raceInfoPlateGradientAngleSlider = document.getElementById("raceInfoPlateGradientAngleSlider");
  els.raceInfoPlateAnimateGradientAngle = document.getElementById("raceInfoPlateAnimateGradientAngle");
  els.raceInfoPlateGradientAngleSpeed = document.getElementById("raceInfoPlateGradientAngleSpeed");
  els.raceInfoPlateGradientAngleSpeedValue = document.getElementById("raceInfoPlateGradientAngleSpeedValue");
  els.raceInfoPlateGradientSpeedRow = document.getElementById("raceInfoPlateGradientSpeedRow");
  els.raceInfoPlateTextureImage = document.getElementById("raceInfoPlateTextureImage");
  els.clearRaceInfoPlateTextureImage = document.getElementById("clearRaceInfoPlateTextureImage");
  els.raceInfoPlateTextureScale = document.getElementById("raceInfoPlateTextureScale");
  els.raceInfoPlateTextureScaleValue = document.getElementById("raceInfoPlateTextureScaleValue");
  els.raceInfoPlateTextureX = document.getElementById("raceInfoPlateTextureX");
  els.raceInfoPlateTextureY = document.getElementById("raceInfoPlateTextureY");
  els.raceInfoPlateTextureScrollX = document.getElementById("raceInfoPlateTextureScrollX");
  els.raceInfoPlateTextureScrollXValue = document.getElementById("raceInfoPlateTextureScrollXValue");
  els.raceInfoPlateTextureScrollY = document.getElementById("raceInfoPlateTextureScrollY");
  els.raceInfoPlateTextureScrollYValue = document.getElementById("raceInfoPlateTextureScrollYValue");
  els.raceInfoPlateBackgroundOpacity = document.getElementById("raceInfoPlateBackgroundOpacity");
  els.raceInfoPlateRadius = document.getElementById("raceInfoPlateRadius");
  els.raceInfoPlatePaddingX = document.getElementById("raceInfoPlatePaddingX");
  els.nameFont = document.getElementById("nameFont");
  els.nameFontChoices = document.getElementById("nameFontChoices");
  els.nameFontBrowser = document.getElementById("nameFontBrowser");
  els.browseFonts = document.getElementById("browseFonts");
  els.fontStatus = document.getElementById("fontStatus");
  els.nameFontSize = document.getElementById("nameFontSize");
  els.nameFontSizeValue = document.getElementById("nameFontSizeValue");
  els.nameTextColor = document.getElementById("nameTextColor");
  els.nameTextX = document.getElementById("nameTextX");
  els.nameTextY = document.getElementById("nameTextY");
  els.nameplateMode = document.getElementById("nameplateMode");
  els.nameplateImage = document.getElementById("nameplateImage");
  els.clearNameplateImage = document.getElementById("clearNameplateImage");
  els.nameShowBox = document.getElementById("nameShowBox");
  els.nameShowBorder = document.getElementById("nameShowBorder");
  els.namePlateBackgroundColor = document.getElementById("namePlateBackgroundColor");
  els.namePlateFillMode = document.getElementById("namePlateFillMode");
  els.namePlateGradientFrom = document.getElementById("namePlateGradientFrom");
  els.namePlateGradientTo = document.getElementById("namePlateGradientTo");
  els.namePlateGradientAngle = document.getElementById("namePlateGradientAngle");
  els.namePlateGradientAngleSlider = document.getElementById("namePlateGradientAngleSlider");
  els.namePlateAnimateGradientAngle = document.getElementById("namePlateAnimateGradientAngle");
  els.namePlateGradientAngleSpeed = document.getElementById("namePlateGradientAngleSpeed");
  els.namePlateGradientAngleSpeedValue = document.getElementById("namePlateGradientAngleSpeedValue");
  els.namePlateGradientSpeedRow = document.getElementById("namePlateGradientSpeedRow");
  els.namePlateTextureImage = document.getElementById("namePlateTextureImage");
  els.clearNamePlateTextureImage = document.getElementById("clearNamePlateTextureImage");
  els.namePlateTextureScale = document.getElementById("namePlateTextureScale");
  els.namePlateTextureScaleValue = document.getElementById("namePlateTextureScaleValue");
  els.namePlateTextureX = document.getElementById("namePlateTextureX");
  els.namePlateTextureY = document.getElementById("namePlateTextureY");
  els.namePlateTextureScrollX = document.getElementById("namePlateTextureScrollX");
  els.namePlateTextureScrollXValue = document.getElementById("namePlateTextureScrollXValue");
  els.namePlateTextureScrollY = document.getElementById("namePlateTextureScrollY");
  els.namePlateTextureScrollYValue = document.getElementById("namePlateTextureScrollYValue");
  els.namePlateBackgroundOpacity = document.getElementById("namePlateBackgroundOpacity");
  els.namePlateBorderColor = document.getElementById("namePlateBorderColor");
  els.namePlateBorderOpacity = document.getElementById("namePlateBorderOpacity");
  els.namePlateBorderWidth = document.getElementById("namePlateBorderWidth");
  els.namePlateRadius = document.getElementById("namePlateRadius");
  els.namePlatePaddingX = document.getElementById("namePlatePaddingX");
  els.nameStrokeEnabled = document.getElementById("nameStrokeEnabled");
  els.nameStrokeColor = document.getElementById("nameStrokeColor");
  els.nameStrokeWidth = document.getElementById("nameStrokeWidth");
  els.nameShadowEnabled = document.getElementById("nameShadowEnabled");
  els.nameShadowColor = document.getElementById("nameShadowColor");
  els.nameShadowBlur = document.getElementById("nameShadowBlur");
  els.nameShadowX = document.getElementById("nameShadowX");
  els.nameShadowY = document.getElementById("nameShadowY");
  els.pronounsEnabled = document.getElementById("pronounsEnabled");
  els.pronounsFont = document.getElementById("pronounsFont");
  els.pronounsFontChoices = document.getElementById("pronounsFontChoices");
  els.pronounsFontBrowser = document.getElementById("pronounsFontBrowser");
  els.browsePronounsFonts = document.getElementById("browsePronounsFonts");
  els.pronounsFontSize = document.getElementById("pronounsFontSize");
  els.pronounsFontSizeValue = document.getElementById("pronounsFontSizeValue");
  els.pronounsTextColor = document.getElementById("pronounsTextColor");
  els.pronounsTextX = document.getElementById("pronounsTextX");
  els.pronounsTextY = document.getElementById("pronounsTextY");
  els.pronounsStrokeEnabled = document.getElementById("pronounsStrokeEnabled");
  els.pronounsStrokeColor = document.getElementById("pronounsStrokeColor");
  els.pronounsStrokeWidth = document.getElementById("pronounsStrokeWidth");
  els.pronounsShadowEnabled = document.getElementById("pronounsShadowEnabled");
  els.pronounsShadowColor = document.getElementById("pronounsShadowColor");
  els.pronounsShadowBlur = document.getElementById("pronounsShadowBlur");
  els.pronounsShadowX = document.getElementById("pronounsShadowX");
  els.pronounsShadowY = document.getElementById("pronounsShadowY");
  els.finishLockToNameplate = document.getElementById("finishLockToNameplate");
  els.finishFont = document.getElementById("finishFont");
  els.finishFontChoices = document.getElementById("finishFontChoices");
  els.finishFontBrowser = document.getElementById("finishFontBrowser");
  els.finishBrowseFonts = document.getElementById("finishBrowseFonts");
  els.finishFontSize = document.getElementById("finishFontSize");
  els.finishFontSizeValue = document.getElementById("finishFontSizeValue");
  els.finishColor = document.getElementById("finishColor");
  els.finishAlign = document.getElementById("finishAlign");
  els.finishStrokeEnabled = document.getElementById("finishStrokeEnabled");
  els.finishStrokeColor = document.getElementById("finishStrokeColor");
  els.finishStrokeWidth = document.getElementById("finishStrokeWidth");
  els.finishShadowEnabled = document.getElementById("finishShadowEnabled");
  els.finishShadowColor = document.getElementById("finishShadowColor");
  els.finishShadowBlur = document.getElementById("finishShadowBlur");
  els.finishShadowX = document.getElementById("finishShadowX");
  els.finishShadowY = document.getElementById("finishShadowY");
  els.backgroundImage = document.getElementById("backgroundImage");
  els.clearBackgroundImage = document.getElementById("clearBackgroundImage");
  els.backgroundScale = document.getElementById("backgroundScale");
  els.backgroundScaleValue = document.getElementById("backgroundScaleValue");
  els.backgroundScrollX = document.getElementById("backgroundScrollX");
  els.backgroundScrollXValue = document.getElementById("backgroundScrollXValue");
  els.backgroundScrollY = document.getElementById("backgroundScrollY");
  els.backgroundScrollYValue = document.getElementById("backgroundScrollYValue");
  els.borderImage = document.getElementById("borderImage");
  els.borderTarget = document.getElementById("borderTarget");
  els.borderSourceMode = document.getElementById("borderSourceMode");
  els.borderMode = document.getElementById("borderMode");
  els.borderLineColor = document.getElementById("borderLineColor");
  els.borderGlowColor = document.getElementById("borderGlowColor");
  els.borderGradientFrom = document.getElementById("borderGradientFrom");
  els.borderGradientTo = document.getElementById("borderGradientTo");
  els.borderGradientAngle = document.getElementById("borderGradientAngle");
  els.borderGradientAngleSlider = document.getElementById("borderGradientAngleSlider");
  els.borderAnimateGradientAngle = document.getElementById("borderAnimateGradientAngle");
  els.borderGradientAngleSpeed = document.getElementById("borderGradientAngleSpeed");
  els.borderGradientAngleSpeedValue = document.getElementById("borderGradientAngleSpeedValue");
  els.borderGradientSpeedRow = document.getElementById("borderGradientSpeedRow");
  els.borderTextureImage = document.getElementById("borderTextureImage");
  els.clearBorderTextureImage = document.getElementById("clearBorderTextureImage");
  els.borderTextureScale = document.getElementById("borderTextureScale");
  els.borderTextureScaleValue = document.getElementById("borderTextureScaleValue");
  els.borderTextureX = document.getElementById("borderTextureX");
  els.borderTextureY = document.getElementById("borderTextureY");
  els.borderTextureScrollX = document.getElementById("borderTextureScrollX");
  els.borderTextureScrollXValue = document.getElementById("borderTextureScrollXValue");
  els.borderTextureScrollY = document.getElementById("borderTextureScrollY");
  els.borderTextureScrollYValue = document.getElementById("borderTextureScrollYValue");
  els.borderLineWidth = document.getElementById("borderLineWidth");
  els.borderRadius = document.getElementById("borderRadius");
  els.createBorderDetails = document.getElementById("createBorderDetails");
  els.obsHost = document.getElementById("obsHost");
  els.obsPort = document.getElementById("obsPort");
  els.obsPassword = document.getElementById("obsPassword");
  els.obsSceneName = document.getElementById("obsSceneName");
  els.connectObs = document.getElementById("connectObs");
  els.createObsScene = document.getElementById("createObsScene");
  els.applyObsLayout = document.getElementById("applyObsLayout");
  els.cleanupObsScene = document.getElementById("cleanupObsScene");
  els.autoApplyObs = document.getElementById("autoApplyObs");
  els.animateObsLayout = document.getElementById("animateObsLayout");
  els.obsLog = document.getElementById("obsLog");
  els.obsStatus = document.getElementById("obsStatus");
  els.connectionState = document.getElementById("connectionState");
  els.settingsTabs = document.querySelector(".settings-tabs");
  els.undoAction = document.getElementById("undoAction");
  els.redoAction = document.getElementById("redoAction");
  els.saveProject = document.getElementById("saveProject");
  els.loadProject = document.getElementById("loadProject");
  els.viewEditMode = document.getElementById("viewEditMode");
  els.viewControlMode = document.getElementById("viewControlMode");
  els.viewFinishedScreen = document.getElementById("viewFinishedScreen");
  els.sceneTree = document.getElementById("sceneTree");
  els.sceneTreePanel = document.getElementById("sceneTreePanel");
  els.sceneViewToggle = document.getElementById("sceneViewToggle");
  els.inspectorHeader = document.getElementById("inspectorHeader");
  els.inspectorTitle = document.getElementById("inspectorTitle");
  els.globalTabs = document.getElementById("globalTabs");
  els.runnerUniqueRow = document.getElementById("runnerUniqueRow");
  els.runnerUnique = document.getElementById("runnerUnique");
  els.finishedScreenLayer = document.getElementById("finishedScreenLayer");
  els.finishedScreenScale = document.getElementById("finishedScreenScale");
  els.finishedScreenBar = document.getElementById("finishedScreenBar");
  els.finishedScreenReplay = document.getElementById("finishedScreenReplay");
  els.finishedScreenHide = document.getElementById("finishedScreenHide");
  els.finishedScreenShow = document.getElementById("finishedScreenShow");
  els.finishedScreenHideBtn = document.getElementById("finishedScreenHideBtn");
  els.finishedScreenAccent = document.getElementById("finishedScreenAccent");
  els.finishedScreenBackdrop = document.getElementById("finishedScreenBackdrop");
  els.finishedScreenBackdropOpacity = document.getElementById("finishedScreenBackdropOpacity");
  els.finishedScreenBackdropOpacityValue = document.getElementById("finishedScreenBackdropOpacityValue");
  els.finishedScreenRowSpeed = document.getElementById("finishedScreenRowSpeed");
  els.finishedScreenRowSpeedValue = document.getElementById("finishedScreenRowSpeedValue");
  els.finishedScreenRunnerIcons = document.getElementById("finishedScreenRunnerIcons");
  els.finishedScreenRunnerIconPlacement = document.getElementById("finishedScreenRunnerIconPlacement");
  els.finishedScreenPbShow = document.getElementById("finishedScreenPbShow");
  els.finishedScreenPbMode = document.getElementById("finishedScreenPbMode");
  els.finishedScreenPbThreshold = document.getElementById("finishedScreenPbThreshold");
  els.finishedScreenPbThresholdRow = document.getElementById("finishedScreenPbThresholdRow");
  els.finishedScreenPbDeltaText = document.getElementById("finishedScreenPbDeltaText");
  els.finishedScreenPbNewText = document.getElementById("finishedScreenPbNewText");
  els.finishedScreenPbFont = document.getElementById("finishedScreenPbFont");
  els.finishedScreenPbFontSize = document.getElementById("finishedScreenPbFontSize");
  els.finishedScreenPbColor = document.getElementById("finishedScreenPbColor");
  els.finishedScreenPbStrokeEnabled = document.getElementById("finishedScreenPbStrokeEnabled");
  els.finishedScreenPbStrokeColor = document.getElementById("finishedScreenPbStrokeColor");
  els.finishedScreenPbStrokeWidth = document.getElementById("finishedScreenPbStrokeWidth");
  els.finishedScreenPbShadowEnabled = document.getElementById("finishedScreenPbShadowEnabled");
  els.finishedScreenPbShadowColor = document.getElementById("finishedScreenPbShadowColor");
  els.finishedScreenPbShadowBlur = document.getElementById("finishedScreenPbShadowBlur");
  els.finishedScreenPbShadowX = document.getElementById("finishedScreenPbShadowX");
  els.finishedScreenPbShadowY = document.getElementById("finishedScreenPbShadowY");
  els.finishedScreenBob = document.getElementById("finishedScreenBob");
  els.finishedScreenBobAmp = document.getElementById("finishedScreenBobAmp");
  els.finishedScreenBobAmpValue = document.getElementById("finishedScreenBobAmpValue");
  els.finishedScreenBobSpeed = document.getElementById("finishedScreenBobSpeed");
  els.finishedScreenBobSpeedValue = document.getElementById("finishedScreenBobSpeedValue");
  els.finishedScreenBobSmoothness = document.getElementById("finishedScreenBobSmoothness");
  els.finishedScreenBobSmoothnessValue = document.getElementById("finishedScreenBobSmoothnessValue");
  els.finishedScreenBobStagger = document.getElementById("finishedScreenBobStagger");
  els.finishedScreenRowStagger = document.getElementById("finishedScreenRowStagger");
  els.finishedScreenRowStaggerValue = document.getElementById("finishedScreenRowStaggerValue");
  els.finishedScreenIcons = document.getElementById("finishedScreenIcons");
  els.finishedScreenIcon1 = document.getElementById("finishedScreenIcon1");
  els.finishedScreenIcon2 = document.getElementById("finishedScreenIcon2");
  els.finishedScreenIcon3 = document.getElementById("finishedScreenIcon3");
  els.finishedScreenIcon1Preview = document.getElementById("finishedScreenIcon1Preview");
  els.finishedScreenIcon2Preview = document.getElementById("finishedScreenIcon2Preview");
  els.finishedScreenIcon3Preview = document.getElementById("finishedScreenIcon3Preview");
  els.finishedScreenIcon1Clear = document.getElementById("finishedScreenIcon1Clear");
  els.finishedScreenIcon2Clear = document.getElementById("finishedScreenIcon2Clear");
  els.finishedScreenIcon3Clear = document.getElementById("finishedScreenIcon3Clear");
  els.finishedScreenGaps = document.getElementById("finishedScreenGaps");
  els.finishedScreenUnderline = document.getElementById("finishedScreenUnderline");
  els.finishedScreenOnlyBackground = document.getElementById("finishedScreenOnlyBackground");
  els.finishedScreenFontChoices = document.getElementById("finishedScreenFontChoices");
  // Header text
  els.finishedScreenHeading = document.getElementById("finishedScreenHeading");
  els.finishedScreenHeadingFont = document.getElementById("finishedScreenHeadingFont");
  els.finishedScreenHeadingFontBrowser = document.getElementById("finishedScreenHeadingFontBrowser");
  els.finishedScreenHeadingBrowseFonts = document.getElementById("finishedScreenHeadingBrowseFonts");
  els.finishedScreenHeadingFontSize = document.getElementById("finishedScreenHeadingFontSize");
  els.finishedScreenHeadingColor = document.getElementById("finishedScreenHeadingColor");
  els.finishedScreenHeadingStrokeEnabled = document.getElementById("finishedScreenHeadingStrokeEnabled");
  els.finishedScreenHeadingStrokeColor = document.getElementById("finishedScreenHeadingStrokeColor");
  els.finishedScreenHeadingStrokeWidth = document.getElementById("finishedScreenHeadingStrokeWidth");
  els.finishedScreenHeadingShadowEnabled = document.getElementById("finishedScreenHeadingShadowEnabled");
  els.finishedScreenHeadingShadowColor = document.getElementById("finishedScreenHeadingShadowColor");
  els.finishedScreenHeadingShadowBlur = document.getElementById("finishedScreenHeadingShadowBlur");
  els.finishedScreenHeadingShadowX = document.getElementById("finishedScreenHeadingShadowX");
  els.finishedScreenHeadingShadowY = document.getElementById("finishedScreenHeadingShadowY");
  // Runner text
  els.finishedScreenRunnerFont = document.getElementById("finishedScreenRunnerFont");
  els.finishedScreenRunnerFontBrowser = document.getElementById("finishedScreenRunnerFontBrowser");
  els.finishedScreenRunnerBrowseFonts = document.getElementById("finishedScreenRunnerBrowseFonts");
  els.finishedScreenRunnerFontSize = document.getElementById("finishedScreenRunnerFontSize");
  els.finishedScreenRunnerColor = document.getElementById("finishedScreenRunnerColor");
  els.finishedScreenRunnerStrokeEnabled = document.getElementById("finishedScreenRunnerStrokeEnabled");
  els.finishedScreenRunnerStrokeColor = document.getElementById("finishedScreenRunnerStrokeColor");
  els.finishedScreenRunnerStrokeWidth = document.getElementById("finishedScreenRunnerStrokeWidth");
  els.finishedScreenRunnerShadowEnabled = document.getElementById("finishedScreenRunnerShadowEnabled");
  els.finishedScreenRunnerShadowColor = document.getElementById("finishedScreenRunnerShadowColor");
  els.finishedScreenRunnerShadowBlur = document.getElementById("finishedScreenRunnerShadowBlur");
  els.finishedScreenRunnerShadowX = document.getElementById("finishedScreenRunnerShadowX");
  els.finishedScreenRunnerShadowY = document.getElementById("finishedScreenRunnerShadowY");
  els.resetAllFinishes = document.getElementById("resetAllFinishes");
  els.raceControlPanel = document.getElementById("raceControlPanel");
  els.controlTimerReadout = document.getElementById("controlTimerReadout");
  els.controlTimerStart = document.getElementById("controlTimerStart");
  els.controlTimerStop = document.getElementById("controlTimerStop");
  els.controlTimerReset = document.getElementById("controlTimerReset");
  els.controlApplyObs = document.getElementById("controlApplyObs");
  els.controlRepairObs = document.getElementById("controlRepairObs");
  els.controlExitSpotlight = document.getElementById("controlExitSpotlight");
  els.controlRunnerList = document.getElementById("controlRunnerList");
}

function bindGlobalControls() {
  bindApplicationMenus();
  els.undoAction.addEventListener("click", undo);
  els.redoAction.addEventListener("click", redo);
  els.saveProject.addEventListener("click", saveProject);
  els.loadProject.addEventListener("change", loadProjectFromFile);
  els.viewEditMode.addEventListener("click", () => setViewMode("edit"));
  els.viewControlMode.addEventListener("click", () => setViewMode("control"));
  els.viewFinishedScreen.addEventListener("click", toggleFinishedScreen);
  if (els.leftEditTabs) els.leftEditTabs.addEventListener("click", handleLeftTabClick);
  if (els.addMediaLayer) els.addMediaLayer.addEventListener("click", toggleAddMediaMenu);
  if (els.addImageLayer) els.addImageLayer.addEventListener("click", () => openMediaLayerPicker("image"));
  if (els.addVideoLayer) els.addVideoLayer.addEventListener("click", () => openMediaLayerPicker("video"));
  if (els.mediaLayerFile) els.mediaLayerFile.addEventListener("change", handleMediaLayerFile);
  if (els.sceneViewToggle) els.sceneViewToggle.addEventListener("click", toggleSceneView);
  if (els.sceneTree) els.sceneTree.addEventListener("click", handleSceneTreeClick);
  if (els.sceneTree) els.sceneTree.addEventListener("dragstart", handleSceneTreeDragStart);
  if (els.sceneTree) els.sceneTree.addEventListener("dragover", handleSceneTreeDragOver);
  if (els.sceneTree) els.sceneTree.addEventListener("dragleave", handleSceneTreeDragLeave);
  if (els.sceneTree) els.sceneTree.addEventListener("drop", handleSceneTreeDrop);
  if (els.sceneTree) els.sceneTree.addEventListener("dragend", handleSceneTreeDragEnd);
  if (els.sceneTree) els.sceneTree.addEventListener("contextmenu", handleSceneTreeContextMenu);
  if (els.globalTabs) els.globalTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-global]");
    if (button) focusGlobalPanel(button.dataset.global);
  });
  if (els.runnerUnique) els.runnerUnique.addEventListener("change", (event) => {
    const id = selection.elementId;
    if (typeof id !== "string" || !id.startsWith("runner:")) return;
    const slot = Number(id.split(":")[1]);
    const runner = state.runners.find((r) => r.slot === slot);
    if (!runner) return;
    pushHistory("runner unique");
    if (event.target.checked) makeRunnerUnique(runner);
    else runner.unique = false;
    syncNameplateControlsFromState();
    update();
    scheduleObsApply("nameplate", 80);
  });
  if (els.runnerControls) els.runnerControls.addEventListener("click", (event) => {
    if (event.target.closest("input, button, select, textarea, label, a")) return;
    const card = event.target.closest(".runner-card[data-slot]");
    if (card) setSelectedElement(`runner:${card.dataset.slot}`);
  });
  bindFinishedScreenControls();
  bindCommentatorsControls();
  els.resetAllFinishes.addEventListener("click", resetAllFinishes);
  els.controlTimerStart.addEventListener("click", startBuiltInTimer);
  els.controlTimerStop.addEventListener("click", stopBuiltInTimer);
  els.controlTimerReset.addEventListener("click", resetBuiltInTimer);
  els.controlApplyObs.addEventListener("click", () => applyLayoutToObs({ reason: "manual-layout", refreshInputs: true, forceAnimate: true }));
  els.controlRepairObs.addEventListener("click", createOrRepairObsScene);
  els.controlExitSpotlight.addEventListener("click", () => {
    pushHistory("exit spotlight");
    state.layout.spotlight.enabled = false;
    syncGlobalControlsFromState();
    update();
    scheduleObsApply("spotlight", 0);
  });
  els.controlRunnerList.addEventListener("click", handleControlRunnerAction);
  els.settingsTabs.addEventListener("click", handleSettingsTabClick);
  document.addEventListener("keydown", handleHotkeys);
  els.connectObs.addEventListener("click", connectObs);
  els.createObsScene.addEventListener("click", createOrRepairObsScene);
  els.applyObsLayout.addEventListener("click", () => applyLayoutToObs({ reason: "manual-layout", refreshInputs: true, forceAnimate: true }));
  els.cleanupObsScene.addEventListener("click", cleanupObsScene);
  els.autoApplyObs.addEventListener("change", (event) => {
    obsBridge.autoApply = event.target.checked;
    logObs(obsBridge.autoApply ? "Auto apply enabled. Changes will push to OBS." : "Auto apply disabled. Use Apply Layout manually.");
    scheduleObsApply("auto-toggle", 0);
  });
  els.animateObsLayout.addEventListener("change", (event) => {
    obsBridge.animateLayout = event.target.checked;
    logObs(obsBridge.animateLayout ? "OBS layout animation enabled." : "OBS layout animation disabled.");
  });

  els.aspectPreset.addEventListener("change", (event) => {
    pushHistory("aspect preset");
    state.layout.aspectPreset = event.target.value;
    update();
    scheduleObsApply("aspectPreset", 120);
  });

  els.builtInTimerEnabled.addEventListener("change", (event) => {
    pushHistory("built-in timer");
    state.layout.elements.builtInTimer = event.target.checked;
    update();
    scheduleObsApply("timerText", 80);
  });
  els.layerLockEnabled.addEventListener("change", (event) => {
    pushHistory("layer lock");
    state.layout.layerLock = event.target.checked;
    update();
  });
  els.snapEnabled.addEventListener("change", (event) => {
    pushHistory("snap enabled");
    state.layout.snapEnabled = event.target.checked;
    update();
  });
  for (const input of [els.titleBarVisible, els.raceInfoEnabled].filter(Boolean)) {
    input.addEventListener("change", (event) => {
      pushHistory("title visibility");
      state.layout.elements.titleBar = event.target.checked;
      syncGlobalControlsFromState();
      update();
      scheduleObsApply("raceInfo", 80);
    });
  }
  for (const [input, key] of [
    [els.raceTitle, "title"],
    [els.raceSubtitle, "subtitle"],
    [els.raceInfoFont, "fontFamily"],
    [els.raceInfoTextColor, "textColor"]
  ]) {
    input.addEventListener("input", () => {
      beginContinuousHistory(`race-info-${key}`);
      state.layout.raceInfo[key] = input.value;
      update();
      scheduleObsApply("raceInfo", 100);
    });
    input.addEventListener("change", endContinuousHistory);
  }
  els.raceInfoFontBrowser.addEventListener("change", (event) => {
    if (!event.target.value) return;
    pushHistory("race info font browser");
    state.layout.raceInfo.fontFamily = event.target.value;
    syncGlobalControlsFromState();
    update();
    scheduleObsApply("raceInfo", 100);
  });
  els.raceInfoBrowseFonts.addEventListener("click", browseInstalledFonts);
  els.raceInfoFontSize.addEventListener("input", () => {
    beginContinuousHistory("race info font size");
    state.layout.raceInfo.fontSize = Number(els.raceInfoFontSize.value);
    update();
    scheduleObsApply("raceInfo", 100);
  });
  els.raceInfoFontSize.addEventListener("change", endContinuousHistory);

  for (const [input, key] of [
    [els.raceInfoStrokeEnabled, "strokeEnabled"],
    [els.raceInfoShadowEnabled, "shadowEnabled"]
  ]) {
    input.addEventListener("change", () => {
      pushHistory(`race-info-${key}`);
      state.layout.raceInfo[key] = input.checked;
      update();
      scheduleObsApply("raceInfo", 120);
    });
  }
  for (const [input, key] of [
    [els.raceInfoStrokeColor, "strokeColor"],
    [els.raceInfoShadowColor, "shadowColor"]
  ]) {
    input.addEventListener("pointerdown", () => beginContinuousHistory(`race-info-${key}`));
    input.addEventListener("input", () => {
      state.layout.raceInfo[key] = input.value;
      update();
      scheduleObsApply("raceInfo", 80);
    });
    input.addEventListener("change", endContinuousHistory);
  }
  for (const [input, key] of [
    [els.raceInfoStrokeWidth, "strokeWidth"],
    [els.raceInfoShadowBlur, "shadowBlur"],
    [els.raceInfoShadowX, "shadowX"],
    [els.raceInfoShadowY, "shadowY"]
  ]) {
    input.addEventListener("focus", () => beginContinuousHistory(`race-info-${key}`));
    input.addEventListener("change", endContinuousHistory);
    input.addEventListener("input", () => {
      state.layout.raceInfo[key] = Number(input.value);
      update();
      scheduleObsApply("raceInfo", 160);
    });
  }

  bindRaceInfoPlateControls();
  bindTimerPlateControls();
  els.timerStart.addEventListener("click", startBuiltInTimer);
  els.timerStop.addEventListener("click", stopBuiltInTimer);
  els.timerReset.addEventListener("click", resetBuiltInTimer);
  els.timerFormat.addEventListener("change", (event) => {
    pushHistory("timer format");
    state.layout.timerText.format = event.target.value;
    update();
    scheduleObsApply("timerText", 80);
  });

  els.timerFont.addEventListener("input", (event) => {
    state.layout.timerText.fontFamily = event.target.value;
    update();
    scheduleObsApply("timerText", 200);
  });
  els.timerFont.addEventListener("change", () => pushHistory("timer font"));
  els.timerFontBrowser.addEventListener("change", (event) => {
    if (!event.target.value) return;
    pushHistory("timer font");
    state.layout.timerText.fontFamily = event.target.value;
    syncGlobalControlsFromState();
    update();
    scheduleObsApply("timerText", 120);
  });
  els.timerBrowseFonts.addEventListener("click", browseInstalledFonts);
  els.timerFontSize.addEventListener("input", (event) => {
    state.layout.timerText.fontSize = Number(event.target.value);
    els.timerFontSizeValue.textContent = `${state.layout.timerText.fontSize} px`;
    update();
    scheduleObsApply("timerText", 120);
  });
  els.timerFontSize.addEventListener("pointerdown", () => beginContinuousHistory("timer font size"));
  els.timerFontSize.addEventListener("focus", () => beginContinuousHistory("timer font size"));
  els.timerFontSize.addEventListener("change", endContinuousHistory);
  for (const [input, key] of [
    [els.timerIdleColor, "idleColor"],
    [els.timerStoppedColor, "stoppedColor"],
    [els.timerRunningColor, "runningColor"]
  ]) {
    input.addEventListener("pointerdown", () => beginContinuousHistory(`timer-${key}`));
    input.addEventListener("input", () => {
      state.layout.timerText[key] = input.value;
      update();
      scheduleObsApply("timerText", 80);
    });
    input.addEventListener("change", endContinuousHistory);
  }
  for (const [input, key] of [
    [els.timerStrokeWidth, "strokeWidth"],
    [els.timerShadowBlur, "shadowBlur"],
    [els.timerShadowX, "shadowX"],
    [els.timerShadowY, "shadowY"]
  ]) {
    input.addEventListener("focus", () => beginContinuousHistory(`timer-${key}`));
    input.addEventListener("change", endContinuousHistory);
    input.addEventListener("input", () => {
      state.layout.timerText[key] = Number(input.value);
      update();
      scheduleObsApply("timerText", 120);
    });
  }
  for (const [input, key] of [
    [els.timerStrokeColor, "strokeColor"],
    [els.timerShadowColor, "shadowColor"]
  ]) {
    input.addEventListener("pointerdown", () => beginContinuousHistory(`timer-${key}`));
    input.addEventListener("input", () => {
      state.layout.timerText[key] = input.value;
      update();
      scheduleObsApply("timerText", 80);
    });
    input.addEventListener("change", endContinuousHistory);
  }
  for (const [input, key] of [
    [els.timerStrokeEnabled, "strokeEnabled"],
    [els.timerShadowEnabled, "shadowEnabled"]
  ]) {
    input.addEventListener("change", () => {
      pushHistory(`timer-${key}`);
      state.layout.timerText[key] = input.checked;
      update();
      scheduleObsApply("timerText", 120);
    });
  }

  els.spotlightEnabled.addEventListener("change", (event) => {
    pushHistory("spotlight");
    state.layout.spotlight.enabled = event.target.checked;
    update();
    scheduleObsApply("spotlight", 120);
  });
  els.spotlightSlots.addEventListener("input", (event) => {
    state.layout.spotlight.slots = event.target.value;
    update();
    scheduleObsApply("spotlight", 200);
  });
  els.spotlightSlots.addEventListener("change", () => pushHistory("spotlight slots"));
  els.spotlightShowOthers.addEventListener("change", (event) => {
    pushHistory("spotlight others");
    state.layout.spotlight.showOthers = event.target.checked;
    update();
    scheduleObsApply("spotlight", 120);
  });
  els.spotlightDisableSmallNameplates.addEventListener("change", (event) => {
    pushHistory("spotlight small nameplates");
    state.layout.spotlight.disableSmallNameplates = event.target.checked;
    update();
    scheduleObsApply("spotlight-nameplates", 120);
  });
  els.spotlightSide.addEventListener("change", (event) => {
    pushHistory("spotlight side");
    state.layout.spotlight.side = event.target.value;
    update();
    scheduleObsApply("spotlight", 120);
  });
  els.spotlightStackOrder.addEventListener("change", (event) => {
    pushHistory("spotlight stack order");
    state.layout.spotlight.stackOrder = event.target.value;
    update();
    scheduleObsApply("spotlight", 120);
  });
  for (const [input, output, key, suffix] of [
    [els.spotlightMainScale, els.spotlightMainScaleValue, "mainScale", "%"],
    [els.spotlightOtherScale, els.spotlightOtherScaleValue, "otherScale", "%"],
    [els.spotlightGap, els.spotlightGapValue, "gap", " px"]
  ]) {
    input.addEventListener("pointerdown", () => beginContinuousHistory(`spotlight-${key}`));
    input.addEventListener("change", endContinuousHistory);
    input.addEventListener("input", () => {
      state.layout.spotlight[key] = Number(input.value);
      output.textContent = `${state.layout.spotlight[key]}${suffix}`;
      update();
      scheduleObsApply("spotlight", 120);
    });
  }
  els.setupPreviewSlot.addEventListener("change", (event) => {
    pushHistory("setup preview");
    state.layout.setupPreviewSlot = Number(event.target.value);
    update();
  });

  for (const [element, key, output, suffix] of [
    [els.timerHeight, "timerHeight", els.timerHeightValue, " px"],
    [els.titleHeight, "titleHeight", els.titleHeightValue, " px"],
    [els.marginLeft, "marginLeft", els.marginLeftValue, " px"],
    [els.marginRight, "marginRight", els.marginRightValue, " px"],
    [els.gapSize, "gap", els.gapValue, " px"],
    [els.animationMs, "animationMs", els.animationValue, " ms"],
    [els.animationFps, "animationFps", els.animationFpsValue, " fps"],
    [els.finishAnimationMs, "finishAnimationMs", els.finishAnimationValue, " ms"],
    [els.finishAnimationFps, "finishAnimationFps", els.finishAnimationFpsValue, " fps"]
  ]) {
    element.addEventListener("pointerdown", () => beginContinuousHistory(key));
    element.addEventListener("keydown", () => beginContinuousHistory(key));
    element.addEventListener("change", () => endContinuousHistory());
    element.addEventListener("input", (event) => {
      state.layout[key] = Number(event.target.value);
      output.textContent = `${state.layout[key]}${suffix}`;
      update();
      scheduleObsApply(key);
    });
  }

  els.animationStyle.addEventListener("change", (event) => {
    pushHistory("animation style");
    state.layout.animationStyle = event.target.value;
    update();
    scheduleObsApply("animationStyle", 0);
  });

  els.finishAnimationStyle.addEventListener("change", (event) => {
    pushHistory("finish animation style");
    state.layout.finishAnimationStyle = event.target.value;
    update();
    scheduleObsApply("finishAnimationStyle", 0);
  });

  for (const [element, key] of [
    [els.feedWidth, "feedWidth"],
    [els.feedHeight, "feedHeight"]
  ]) {
    element.addEventListener("focus", () => beginContinuousHistory(key));
    element.addEventListener("change", () => endContinuousHistory());
    element.addEventListener("input", (event) => {
      state.layout[key] = Math.max(1, Number(event.target.value));
      update();
      scheduleObsApply(key);
    });
  }

  bindGeometryInputs();
  bindNameplateControls();
  bindPronounsTextControls();
  bindFinishedTimeControls();
  bindBorderStyleControls();
  bindPreviewDragging();
  setActiveSettingsPanel("layout");

  document.getElementById("borderSwatches").addEventListener("click", (event) => {
    const button = event.target.closest("[data-border]");
    if (!button) return;

    pushHistory("border preset");
    state.layout.borderPreset = button.dataset.border;
    state.layout.borderStyles[state.layout.borderTarget] = structuredClone(BORDER_PRESETS[state.layout.borderPreset] ?? BORDER_PRESETS.graphite);
    setEditingBorderImage("");
    state.layout.borderModeSource = "template";
    for (const swatch of document.querySelectorAll(".swatch")) {
      swatch.classList.toggle("active", swatch === button);
    }
    syncBorderStyleControlsFromState();

    update();
    scheduleObsApply("border");
  });

  els.backgroundImage.addEventListener("change", (event) => {
    readImageFile(event.target.files?.[0], (dataUrl) => {
      pushHistory("background image");
      state.layout.backgroundImage = dataUrl;
      syncGlobalControlsFromState();
      update();
      scheduleObsApply("background", 250);
    });
  });

  els.clearBackgroundImage.addEventListener("click", () => {
    if (!state.layout.backgroundImage) return;
    pushHistory("clear background image");
    state.layout.backgroundImage = "";
    els.backgroundImage.value = "";
    syncGlobalControlsFromState();
    update();
    scheduleObsApply("background", 120);
  });

  for (const [element, key, output, suffix] of [
    [els.backgroundScale, "backgroundScale", els.backgroundScaleValue, "%"],
    [els.backgroundScrollX, "backgroundScrollX", els.backgroundScrollXValue, " px/s"],
    [els.backgroundScrollY, "backgroundScrollY", els.backgroundScrollYValue, " px/s"]
  ]) {
    element.addEventListener("focus", () => beginContinuousHistory(`theme-bg-${key}`));
    element.addEventListener("change", endContinuousHistory);
    element.addEventListener("input", () => {
      state.layout[key] = Number(element.value);
      if (output) output.textContent = `${state.layout[key]}${suffix}`;
      update();
      scheduleObsApply("background", 160);
    });
  }

  els.borderImage.addEventListener("change", (event) => {
    readImageFile(event.target.files?.[0], (dataUrl) => {
      pushHistory("border image");
      setEditingBorderImage(dataUrl);
      state.layout.borderModeSource = "image";
      state.layout.borderPreset = "custom";
      for (const swatch of document.querySelectorAll(".swatch")) {
        swatch.classList.remove("active");
      }
      syncBorderStyleControlsFromState();
      update();
      scheduleObsApply("border-image", 250);
    });
    event.target.value = "";
  });
}

function bindApplicationMenus() {
  const menus = Array.from(document.querySelectorAll(".menu"));
  for (const menu of menus) {
    const summary = menu.querySelector("summary");
    summary.addEventListener("click", (event) => {
      event.preventDefault();
      const willOpen = !menu.open;
      closeApplicationMenus();
      menu.open = willOpen;
    });

    menu.addEventListener("click", (event) => {
      if (event.target.closest("summary")) return;
      if (event.target.closest("button, .menu-file-item")) {
        window.setTimeout(closeApplicationMenus, 0);
      }
    });
  }

  document.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".menu-bar")) return;
    closeApplicationMenus();
  });
}

function closeApplicationMenus() {
  for (const menu of document.querySelectorAll(".menu[open]")) {
    menu.open = false;
  }
}

function bindGeometryInputs() {
  const bindings = [
    [els.feedX, () => state.layout.panelGeometry.feed, "x", "geometry"],
    [els.feedY, () => state.layout.panelGeometry.feed, "y", "geometry"],
    [els.feedW, () => state.layout.panelGeometry.feed, "width", "geometry"],
    [els.feedH, () => state.layout.panelGeometry.feed, "height", "geometry"],
    [els.nameX, () => state.layout.panelGeometry.name, "x", "geometry"],
    [els.nameY, () => state.layout.panelGeometry.name, "y", "geometry"],
    [els.nameW, () => state.layout.panelGeometry.name, "width", "geometry"],
    [els.nameH, () => state.layout.panelGeometry.name, "height", "geometry"],
    [els.finishX, () => state.layout.panelGeometry.finish, "x", "finishGeometry"],
    [els.finishY, () => state.layout.panelGeometry.finish, "y", "finishGeometry"],
    [els.finishW, () => state.layout.panelGeometry.finish, "width", "finishGeometry"],
    [els.finishH, () => state.layout.panelGeometry.finish, "height", "finishGeometry"],
    [els.titleX, () => state.layout.raceInfo.rect, "x", "raceInfo"],
    [els.titleY, () => state.layout.raceInfo.rect, "y", "raceInfo"],
    [els.titleW, () => state.layout.raceInfo.rect, "width", "raceInfo"],
    [els.titleH, () => state.layout.raceInfo.rect, "height", "raceInfo"],
    [els.timerX, () => state.layout.timerBorder, "x", "timerBorder"],
    [els.timerY, () => state.layout.timerBorder, "y", "timerBorder"],
    [els.timerW, () => state.layout.timerBorder, "width", "timerBorder"],
    [els.timerH, () => state.layout.timerBorder, "height", "timerBorder"]
  ];

  for (const [input, getTarget, key, reason] of bindings) {
    input.addEventListener("focus", () => beginContinuousHistory(`${reason}-${key}`));
    input.addEventListener("change", () => endContinuousHistory());
    input.addEventListener("input", () => {
      const target = getTarget();
      target[key] = clamp01(Number(input.value));
      normalizeGeometryRect(target);
      syncGeometryControls();
      update();
      scheduleObsApply(reason, 120);
    });
  }

  if (els.timerBorderEnabled) {
    els.timerBorderEnabled.addEventListener("change", (event) => {
      pushHistory("timer border enabled");
      state.layout.timerBorder.enabled = event.target.checked;
      state.layout.elements.timerBorder = event.target.checked;
      update();
      scheduleObsApply("timerBorder", 120);
    });
  }

  for (const [input, key, reason] of [
    [els.feedVisible, "feed", "feed-visible"],
    [els.feedBorderVisible, "feedBorder", "feed-border-visible"],
    [els.nameVisible, "name", "name-visible"],
    [els.finishedTimeVisible, "finishedTime", "finish-visible"]
  ].filter(([input]) => Boolean(input))) {
    input.addEventListener("change", () => {
      pushHistory(reason);
      state.layout.elements[key] = input.checked;
      update();
      scheduleObsApply(reason, 120);
    });
  }
}

function bindRaceInfoPlateControls() {
  const numberBindings = [
    [els.raceInfoPlateBackgroundOpacity, "plateBackgroundOpacity", null, ""],
    [els.raceInfoPlatePaddingX, "platePaddingX", null, ""],
    [els.raceInfoPlateGradientAngle, "plateGradientAngle", null, ""],
    [els.raceInfoPlateGradientAngleSlider, "plateGradientAngle", null, ""],
    [els.raceInfoPlateGradientAngleSpeed, "plateGradientAngleSpeed", els.raceInfoPlateGradientAngleSpeedValue, " deg/s"],
    [els.raceInfoPlateTextureScale, "plateTextureScale", els.raceInfoPlateTextureScaleValue, "%"],
    [els.raceInfoPlateTextureX, "plateTextureX", null, ""],
    [els.raceInfoPlateTextureY, "plateTextureY", null, ""],
    [els.raceInfoPlateTextureScrollX, "plateTextureScrollX", els.raceInfoPlateTextureScrollXValue, " px/s"],
    [els.raceInfoPlateTextureScrollY, "plateTextureScrollY", els.raceInfoPlateTextureScrollYValue, " px/s"]
  ];

  els.raceInfoPlateMode.addEventListener("change", (event) => {
    pushHistory("race info plate mode");
    state.layout.raceInfo.plateMode = event.target.value;
    syncRaceInfoControlsFromState();
    update();
    scheduleObsApply("raceInfo", 120);
  });

  els.raceInfoPlateFillMode.addEventListener("change", (event) => {
    pushHistory("race info plate fill mode");
    state.layout.raceInfo.plateFillMode = event.target.value;
    syncRaceInfoControlsFromState();
    update();
    scheduleObsApply("raceInfo", 120);
  });

  els.raceInfoPlateAnimateGradientAngle.addEventListener("change", () => {
    pushHistory("race info gradient animation");
    state.layout.raceInfo.plateAnimateGradientAngle = els.raceInfoPlateAnimateGradientAngle.checked;
    syncRaceInfoControlsFromState();
    update();
    scheduleObsApply("raceInfo", 120);
  });

  els.raceInfoPlateTextureImage.addEventListener("change", (event) => {
    readImageFile(event.target.files?.[0], (dataUrl) => {
      pushHistory("race info texture image");
      state.layout.raceInfo.plateTextureImage = dataUrl;
      state.layout.raceInfo.plateFillMode = "texture";
      syncRaceInfoControlsFromState();
      update();
      scheduleObsApply("raceInfo", 250);
    });
    event.target.value = "";
  });

  els.clearRaceInfoPlateTextureImage.addEventListener("click", () => {
    if (!state.layout.raceInfo.plateTextureImage) return;
    pushHistory("clear race info texture image");
    state.layout.raceInfo.plateTextureImage = "";
    syncRaceInfoControlsFromState();
    update();
    scheduleObsApply("raceInfo", 120);
  });

  els.raceInfoPlateImage.addEventListener("change", (event) => {
    readImageFile(event.target.files?.[0], (dataUrl) => {
      pushHistory("race info plate image");
      state.layout.raceInfo.plateImage = dataUrl;
      state.layout.raceInfo.plateMode = "image";
      syncRaceInfoControlsFromState();
      update();
      scheduleObsApply("raceInfo", 250);
    });
    event.target.value = "";
  });

  els.clearRaceInfoPlateImage.addEventListener("click", () => {
    if (!state.layout.raceInfo.plateImage) return;
    pushHistory("clear race info plate image");
    state.layout.raceInfo.plateImage = "";
    syncRaceInfoControlsFromState();
    update();
    scheduleObsApply("raceInfo", 120);
  });

  for (const [input, key, output, suffix] of numberBindings) {
    input.addEventListener("focus", () => beginContinuousHistory(`race-info-${key}`));
    input.addEventListener("change", endContinuousHistory);
    input.addEventListener("input", () => {
      state.layout.raceInfo[key] = Number(input.value);
      if (output) output.textContent = `${state.layout.raceInfo[key]}${suffix}`;
      update();
      scheduleObsApply("raceInfo", 160);
    });
  }

  for (const [input, key] of [
    [els.raceInfoPlateBackgroundColor, "plateBackgroundColor"],
    [els.raceInfoPlateGradientFrom, "plateGradientFrom"],
    [els.raceInfoPlateGradientTo, "plateGradientTo"],
  ]) {
    input.addEventListener("pointerdown", () => beginContinuousHistory(`race-info-${key}`));
    input.addEventListener("input", () => {
      state.layout.raceInfo[key] = input.value;
      update();
      scheduleObsApply("raceInfo", 80);
    });
    input.addEventListener("change", endContinuousHistory);
  }

  for (const [input, key] of [
    [els.raceInfoShowBox, "showBox"]
  ]) {
    input.addEventListener("change", () => {
      pushHistory(`race-info-${key}`);
      state.layout.raceInfo[key] = input.checked;
      update();
      scheduleObsApply("raceInfo", 120);
    });
  }
}

function bindTimerPlateControls() {
  const numberBindings = [
    [els.timerPlateBackgroundOpacity, "plateBackgroundOpacity", null, ""],
    [els.timerPlatePaddingX, "platePaddingX", null, ""],
    [els.timerPlateGradientAngle, "plateGradientAngle", null, ""],
    [els.timerPlateGradientAngleSlider, "plateGradientAngle", null, ""],
    [els.timerPlateGradientAngleSpeed, "plateGradientAngleSpeed", els.timerPlateGradientAngleSpeedValue, " deg/s"],
    [els.timerPlateTextureScale, "plateTextureScale", els.timerPlateTextureScaleValue, "%"],
    [els.timerPlateTextureX, "plateTextureX", null, ""],
    [els.timerPlateTextureY, "plateTextureY", null, ""],
    [els.timerPlateTextureScrollX, "plateTextureScrollX", els.timerPlateTextureScrollXValue, " px/s"],
    [els.timerPlateTextureScrollY, "plateTextureScrollY", els.timerPlateTextureScrollYValue, " px/s"]
  ];

  els.timerPlateMode.addEventListener("change", (event) => {
    pushHistory("timer plate mode");
    state.layout.timerText.plateMode = event.target.value;
    syncTimerTextControlsFromState();
    update();
    scheduleObsApply("timerText", 120);
  });

  els.timerPlateFillMode.addEventListener("change", (event) => {
    pushHistory("timer plate fill mode");
    state.layout.timerText.plateFillMode = event.target.value;
    syncTimerTextControlsFromState();
    update();
    scheduleObsApply("timerText", 120);
  });

  els.timerPlateAnimateGradientAngle.addEventListener("change", () => {
    pushHistory("timer gradient animation");
    state.layout.timerText.plateAnimateGradientAngle = els.timerPlateAnimateGradientAngle.checked;
    syncTimerTextControlsFromState();
    update();
    scheduleObsApply("timerText", 120);
  });

  els.timerPlateTextureImage.addEventListener("change", (event) => {
    readImageFile(event.target.files?.[0], (dataUrl) => {
      pushHistory("timer texture image");
      state.layout.timerText.plateTextureImage = dataUrl;
      state.layout.timerText.plateFillMode = "texture";
      syncTimerTextControlsFromState();
      update();
      scheduleObsApply("timerText", 250);
    });
    event.target.value = "";
  });

  els.clearTimerPlateTextureImage.addEventListener("click", () => {
    if (!state.layout.timerText.plateTextureImage) return;
    pushHistory("clear timer texture image");
    state.layout.timerText.plateTextureImage = "";
    syncTimerTextControlsFromState();
    update();
    scheduleObsApply("timerText", 120);
  });

  els.timerPlateImage.addEventListener("change", (event) => {
    readImageFile(event.target.files?.[0], (dataUrl) => {
      pushHistory("timer plate image");
      state.layout.timerText.plateImage = dataUrl;
      state.layout.timerText.plateMode = "image";
      syncTimerTextControlsFromState();
      update();
      scheduleObsApply("timerText", 250);
    });
    event.target.value = "";
  });

  els.clearTimerPlateImage.addEventListener("click", () => {
    if (!state.layout.timerText.plateImage) return;
    pushHistory("clear timer plate image");
    state.layout.timerText.plateImage = "";
    syncTimerTextControlsFromState();
    update();
    scheduleObsApply("timerText", 120);
  });

  for (const [input, key, output, suffix] of numberBindings) {
    input.addEventListener("focus", () => beginContinuousHistory(`timer-plate-${key}`));
    input.addEventListener("change", endContinuousHistory);
    input.addEventListener("input", () => {
      state.layout.timerText[key] = Number(input.value);
      if (output) output.textContent = `${state.layout.timerText[key]}${suffix}`;
      update();
      scheduleObsApply("timerText", 160);
    });
  }

  for (const [input, key] of [
    [els.timerPlateBackgroundColor, "plateBackgroundColor"],
    [els.timerPlateGradientFrom, "plateGradientFrom"],
    [els.timerPlateGradientTo, "plateGradientTo"],
  ]) {
    input.addEventListener("pointerdown", () => beginContinuousHistory(`timer-plate-${key}`));
    input.addEventListener("input", () => {
      state.layout.timerText[key] = input.value;
      update();
      scheduleObsApply("timerText", 80);
    });
    input.addEventListener("change", endContinuousHistory);
  }

  for (const [input, key] of [
    [els.timerShowBox, "showBox"]
  ]) {
    input.addEventListener("change", () => {
      pushHistory(`timer-plate-${key}`);
      state.layout.timerText[key] = input.checked;
      update();
      scheduleObsApply("timerText", 120);
    });
  }
}

function bindNameplateControls() {
  populateFontChoices(COMMON_FONT_FACES, "Common fonts ready.");

  const numberBindings = [
    [els.nameFontSize, "fontSize", els.nameFontSizeValue, " px"],
    [els.nameTextX, "textX", null, ""],
    [els.nameTextY, "textY", null, ""],
    [els.namePlateBackgroundOpacity, "plateBackgroundOpacity", null, ""],
    [els.namePlateBorderOpacity, "plateBorderOpacity", null, ""],
    [els.namePlateBorderWidth, "plateBorderWidth", null, ""],
    [els.namePlateRadius, "plateRadius", null, ""],
    [els.namePlatePaddingX, "platePaddingX", null, ""],
    [els.namePlateGradientAngle, "plateGradientAngle", null, ""],
    [els.namePlateGradientAngleSlider, "plateGradientAngle", null, ""],
    [els.namePlateGradientAngleSpeed, "plateGradientAngleSpeed", els.namePlateGradientAngleSpeedValue, " deg/s"],
    [els.namePlateTextureScale, "plateTextureScale", els.namePlateTextureScaleValue, "%"],
    [els.namePlateTextureX, "plateTextureX", null, ""],
    [els.namePlateTextureY, "plateTextureY", null, ""],
    [els.namePlateTextureScrollX, "plateTextureScrollX", els.namePlateTextureScrollXValue, " px/s"],
    [els.namePlateTextureScrollY, "plateTextureScrollY", els.namePlateTextureScrollYValue, " px/s"],
    [els.nameStrokeWidth, "strokeWidth", null, ""],
    [els.nameShadowBlur, "shadowBlur", null, ""],
    [els.nameShadowX, "shadowX", null, ""],
    [els.nameShadowY, "shadowY", null, ""]
  ];

  els.nameFont.addEventListener("change", (event) => {
    pushHistory("name font");
    activeNameplate().fontFamily = event.target.value;
    update();
    scheduleObsApply("nameplate", 120);
  });
  els.nameFont.addEventListener("input", (event) => {
    activeNameplate().fontFamily = event.target.value;
    update();
    scheduleObsApply("nameplate", 240);
  });
  els.nameFontBrowser.addEventListener("change", (event) => {
    if (!event.target.value) return;
    pushHistory("name font");
    activeNameplate().fontFamily = event.target.value;
    syncNameplateControlsFromState();
    update();
    scheduleObsApply("nameplate", 120);
  });
  els.browseFonts.addEventListener("click", browseInstalledFonts);

  els.nameplateMode.addEventListener("change", (event) => {
    pushHistory("nameplate mode");
    activeNameplate().plateMode = event.target.value;
    syncNameplateModeSections();
    update();
    scheduleObsApply("nameplate", 120);
  });

  els.namePlateFillMode.addEventListener("change", (event) => {
    pushHistory("nameplate fill mode");
    activeNameplate().plateFillMode = event.target.value;
    syncNameplateControlsFromState();
    update();
    scheduleObsApply("nameplate", 120);
  });

  els.namePlateAnimateGradientAngle.addEventListener("change", () => {
    pushHistory("nameplate gradient animation");
    activeNameplate().plateAnimateGradientAngle = els.namePlateAnimateGradientAngle.checked;
    syncNameplateControlsFromState();
    update();
    scheduleObsApply("nameplate", 120);
  });

  els.namePlateTextureImage.addEventListener("change", (event) => {
    readImageFile(event.target.files?.[0], (dataUrl) => {
      pushHistory("nameplate texture image");
      activeNameplate().plateTextureImage = dataUrl;
      activeNameplate().plateFillMode = "texture";
      syncNameplateControlsFromState();
      update();
      scheduleObsApply("nameplate", 250);
    });
    event.target.value = "";
  });

  els.clearNamePlateTextureImage.addEventListener("click", () => {
    if (!activeNameplate().plateTextureImage) return;
    pushHistory("clear nameplate texture image");
    activeNameplate().plateTextureImage = "";
    syncNameplateControlsFromState();
    update();
    scheduleObsApply("nameplate", 120);
  });

  els.nameplateImage.addEventListener("change", (event) => {
    readImageFile(event.target.files?.[0], (dataUrl) => {
      pushHistory("nameplate image");
      activeNameplate().plateImage = dataUrl;
      activeNameplate().plateMode = "image";
      syncNameplateControlsFromState();
      update();
      scheduleObsApply("nameplate-image", 250);
    });
    event.target.value = "";
  });

  els.clearNameplateImage.addEventListener("click", () => {
    if (!activeNameplate().plateImage) return;
    pushHistory("clear nameplate image");
    activeNameplate().plateImage = "";
    syncNameplateControlsFromState();
    update();
    scheduleObsApply("nameplate-image", 120);
  });

  for (const [input, key, output, suffix] of numberBindings) {
    input.addEventListener("focus", () => beginContinuousHistory(`nameplate-${key}`));
    input.addEventListener("change", endContinuousHistory);
    input.addEventListener("input", () => {
      activeNameplate()[key] = Number(input.value);
      if (output) output.textContent = `${activeNameplate()[key]}${suffix}`;
      update();
      scheduleObsApply("nameplate", 160);
    });
  }

  for (const [input, key] of [
    [els.nameTextColor, "textColor"],
    [els.namePlateBackgroundColor, "plateBackgroundColor"],
    [els.namePlateGradientFrom, "plateGradientFrom"],
    [els.namePlateGradientTo, "plateGradientTo"],
    [els.namePlateBorderColor, "plateBorderColor"],
    [els.nameStrokeColor, "strokeColor"],
    [els.nameShadowColor, "shadowColor"]
  ]) {
    input.addEventListener("pointerdown", () => beginContinuousHistory(`nameplate-${key}`));
    input.addEventListener("input", () => {
      activeNameplate()[key] = input.value;
      update();
      scheduleObsApply("nameplate", 80);
    });
    input.addEventListener("change", endContinuousHistory);
  }

  for (const [input, key] of [
    [els.nameShowBox, "showBox"],
    [els.nameShowBorder, "showBorder"],
    [els.nameStrokeEnabled, "strokeEnabled"],
    [els.nameShadowEnabled, "shadowEnabled"]
  ]) {
    input.addEventListener("change", () => {
      pushHistory(`nameplate-${key}`);
      activeNameplate()[key] = input.checked;
      update();
      scheduleObsApply("nameplate", 120);
    });
  }
}

function bindPronounsTextControls() {
  const numberBindings = [
    [els.pronounsFontSize, "fontSize", els.pronounsFontSizeValue, " px"],
    [els.pronounsTextX, "textX", null, ""],
    [els.pronounsTextY, "textY", null, ""],
    [els.pronounsStrokeWidth, "strokeWidth", null, ""],
    [els.pronounsShadowBlur, "shadowBlur", null, ""],
    [els.pronounsShadowX, "shadowX", null, ""],
    [els.pronounsShadowY, "shadowY", null, ""]
  ];

  els.pronounsFont.addEventListener("change", (event) => {
    pushHistory("pronouns font");
    state.layout.pronounsText.fontFamily = event.target.value;
    update();
    scheduleObsApply("pronounsText", 120);
  });
  els.pronounsFont.addEventListener("input", (event) => {
    state.layout.pronounsText.fontFamily = event.target.value;
    update();
    scheduleObsApply("pronounsText", 240);
  });
  els.pronounsFontBrowser.addEventListener("change", (event) => {
    if (!event.target.value) return;
    pushHistory("pronouns font");
    state.layout.pronounsText.fontFamily = event.target.value;
    syncPronounsTextControlsFromState();
    update();
    scheduleObsApply("pronounsText", 120);
  });
  els.browsePronounsFonts.addEventListener("click", browseInstalledFonts);

  for (const [input, key, output, suffix] of numberBindings) {
    input.addEventListener("focus", () => beginContinuousHistory(`pronouns-${key}`));
    input.addEventListener("change", endContinuousHistory);
    input.addEventListener("input", () => {
      state.layout.pronounsText[key] = Number(input.value);
      if (output) output.textContent = `${state.layout.pronounsText[key]}${suffix}`;
      update();
      scheduleObsApply("pronounsText", 160);
    });
  }

  for (const [input, key] of [
    [els.pronounsTextColor, "textColor"],
    [els.pronounsStrokeColor, "strokeColor"],
    [els.pronounsShadowColor, "shadowColor"]
  ]) {
    input.addEventListener("pointerdown", () => beginContinuousHistory(`pronouns-${key}`));
    input.addEventListener("input", () => {
      state.layout.pronounsText[key] = input.value;
      update();
      scheduleObsApply("pronounsText", 80);
    });
    input.addEventListener("change", endContinuousHistory);
  }

  for (const [input, key] of [
    [els.pronounsEnabled, "enabled"],
    [els.pronounsStrokeEnabled, "strokeEnabled"],
    [els.pronounsShadowEnabled, "shadowEnabled"]
  ]) {
    input.addEventListener("change", () => {
      pushHistory(`pronouns-${key}`);
      state.layout.pronounsText[key] = input.checked;
      update();
      scheduleObsApply("pronounsText", 120);
    });
  }
}

function bindFinishedTimeControls() {
  els.finishFont.addEventListener("change", (event) => {
    pushHistory("finish font");
    activeFinishedTime().fontFamily = event.target.value;
    update();
    scheduleObsApply("finish", 120);
  });
  els.finishFont.addEventListener("input", (event) => {
    activeFinishedTime().fontFamily = event.target.value;
    update();
    scheduleObsApply("finish", 240);
  });
  els.finishFontBrowser.addEventListener("change", (event) => {
    if (!event.target.value) return;
    pushHistory("finish font");
    activeFinishedTime().fontFamily = event.target.value;
    syncFinishedTimeControlsFromState();
    update();
    scheduleObsApply("finish", 120);
  });
  els.finishBrowseFonts.addEventListener("click", browseInstalledFonts);

  for (const [input, key, output, suffix] of [
    [els.finishFontSize, "fontSize", els.finishFontSizeValue, " px"],
    [els.finishStrokeWidth, "strokeWidth", null, ""],
    [els.finishShadowBlur, "shadowBlur", null, ""],
    [els.finishShadowX, "shadowX", null, ""],
    [els.finishShadowY, "shadowY", null, ""]
  ]) {
    input.addEventListener("focus", () => beginContinuousHistory(`finish-${key}`));
    input.addEventListener("change", endContinuousHistory);
    input.addEventListener("input", () => {
      activeFinishedTime()[key] = Number(input.value);
      if (output) output.textContent = `${activeFinishedTime()[key]}${suffix}`;
      update();
      scheduleObsApply("finish", 120);
    });
  }

  for (const [input, key] of [
    [els.finishColor, "color"],
    [els.finishStrokeColor, "strokeColor"],
    [els.finishShadowColor, "shadowColor"]
  ]) {
    input.addEventListener("pointerdown", () => beginContinuousHistory(`finish-${key}`));
    input.addEventListener("input", () => {
      activeFinishedTime()[key] = input.value;
      update();
      scheduleObsApply("finish", 80);
    });
    input.addEventListener("change", endContinuousHistory);
  }

  for (const [input, key] of [
    [els.finishLockToNameplate, "lockToNameplate"],
    [els.finishStrokeEnabled, "strokeEnabled"],
    [els.finishShadowEnabled, "shadowEnabled"]
  ]) {
    input.addEventListener("change", () => {
      pushHistory(`finish-${key}`);
      activeFinishedTime()[key] = input.checked;
      update();
      scheduleObsApply("finish", 120);
    });
  }

  els.finishAlign.addEventListener("change", () => {
    pushHistory("finish align");
    activeFinishedTime().align = els.finishAlign.value;
    update();
    scheduleObsApply("finish", 120);
  });
}

function bindBorderStyleControls() {
  const colorBindings = [
    [els.borderLineColor, "lineColor"],
    [els.borderGlowColor, "glowColor"],
    [els.borderGradientFrom, "gradientFrom"],
    [els.borderGradientTo, "gradientTo"]
  ];
  const numberBindings = [
    [els.borderGradientAngle, "gradientAngle"],
    [els.borderGradientAngleSlider, "gradientAngle"],
    [els.borderGradientAngleSpeed, "gradientAngleSpeed"],
    [els.borderLineWidth, "lineWidth"],
    [els.borderRadius, "radius"],
    [els.borderTextureScale, "textureScale"],
    [els.borderTextureX, "textureX"],
    [els.borderTextureY, "textureY"],
    [els.borderTextureScrollX, "textureScrollX"],
    [els.borderTextureScrollY, "textureScrollY"]
  ];

  els.borderTarget.addEventListener("change", () => {
    state.layout.borderTarget = els.borderTarget.value;
    syncBorderStyleControlsFromState();
  });

  els.borderSourceMode.addEventListener("change", () => {
    pushHistory("border-source-mode");
    state.layout.borderModeSource = els.borderSourceMode.value;
    syncBorderStyleControlsFromState();
    update();
    scheduleObsApply("border", 120);
  });

  els.borderMode.addEventListener("change", () => {
    pushHistory("border-mode");
    getEditingBorderStyle().mode = els.borderMode.value;
    state.layout.borderPreset = "custom";
    setEditingBorderImage("");
    state.layout.borderModeSource = "generated";
    syncBorderStyleControlsFromState();
    update();
    scheduleObsApply("border", 120);
  });

  els.borderAnimateGradientAngle.addEventListener("change", () => {
    pushHistory("border-animate-gradient-angle");
    getEditingBorderStyle().animateGradientAngle = els.borderAnimateGradientAngle.checked;
    state.layout.borderPreset = "custom";
    setEditingBorderImage("");
    state.layout.borderModeSource = "generated";
    syncBorderStyleControlsFromState();
    update();
    scheduleObsApply("border", 120);
  });

  els.borderTextureImage.addEventListener("change", (event) => {
    readImageFile(event.target.files?.[0], (dataUrl) => {
      pushHistory("border texture image");
      const style = getEditingBorderStyle();
      style.textureImage = dataUrl;
      style.mode = "texture";
      state.layout.borderPreset = "custom";
      setEditingBorderImage("");
      state.layout.borderModeSource = "generated";
      syncBorderStyleControlsFromState();
      update();
      scheduleObsApply("border", 250);
    });
    event.target.value = "";
  });
  els.clearBorderTextureImage.addEventListener("click", () => {
    const style = getEditingBorderStyle();
    if (!style.textureImage) return;
    pushHistory("clear border texture image");
    style.textureImage = "";
    syncBorderStyleControlsFromState();
    update();
    scheduleObsApply("border", 120);
  });

  for (const [input, key] of colorBindings) {
    input.addEventListener("pointerdown", () => beginContinuousHistory(`border-${key}`));
    input.addEventListener("input", () => {
      getEditingBorderStyle()[key] = input.value;
      state.layout.borderPreset = "custom";
      setEditingBorderImage("");
      state.layout.borderModeSource = "generated";
      syncBorderStyleControlsFromState();
      update();
      scheduleObsApply("border", 80);
    });
    input.addEventListener("change", endContinuousHistory);
  }

  for (const [input, key] of numberBindings) {
    input.addEventListener("focus", () => beginContinuousHistory(`border-${key}`));
    input.addEventListener("change", endContinuousHistory);
    input.addEventListener("input", () => {
      getEditingBorderStyle()[key] = Number(input.value);
      state.layout.borderPreset = "custom";
      setEditingBorderImage("");
      state.layout.borderModeSource = "generated";
      syncBorderStyleControlsFromState();
      update();
      scheduleObsApply("border", 160);
    });
  }
}

function bindPreviewDragging() {
  let drag = null;

  els.runnerLayer.addEventListener("transitionend", (event) => {
    if (!["left", "top", "width", "height", "opacity"].includes(event.propertyName)) return;
    schedulePreviewRefresh();
  });

  els.stage.addEventListener("pointerdown", (event) => {
    if (state.layout.layerLock || state.layout.viewMode === "control") return;
    const handle = event.target.closest("[data-resize-handle]");
    const target = handle
      ? handle.closest("[data-drag-target]")
      : event.target.closest("[data-drag-target]");
    if (!target) return;

    let kind = handle?.dataset.resizeHandle || target.dataset.dragTarget;
    let dragHandle = handle;
    // Name / pronoun text lives inside the nameplate and its hitbox often spills
    // outside the plate. So clicking anywhere on the nameplate moves the PLATE by
    // default; the text only moves when it's the currently selected element
    // (selected via the scene tree under Nameplates).
    if ((kind === "nameText" || kind === "pronounsText" || kind === "runnerIcon") && selection.elementId !== kind) {
      kind = "name";
      dragHandle = null;
    }
    const elementId = dragKindToElementId(kind, target);
    if (isDragKindLocked(kind) || isElementLocked(elementId)) {
      setSelectedElement(elementId);
      return;
    }
    setSelectedDragTarget(kind);
    setSelectedElement(elementId);
    const textDrag = kind === "nameText" || kind === "pronounsText";
    const rect = textDrag ? getTextDragRect(kind) : getDragRect(kind, target);
    const container = getDragContainer(kind, target);
    const sourceSize = textDrag ? getTextDragSourceSize(kind, target) : null;
    const textBounds = textDrag ? getTextDragBounds(kind, target) : null;

    drag = {
      kind,
      mediaId: target.dataset.mediaId || "",
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      container,
      sourceSize,
      textBounds,
      original: { ...rect },
      current: { ...rect },
      mode: textDrag ? "moveText" : dragHandle ? "resize" : "move"
    };
    beginContinuousHistory(`${drag.mode}-${kind}`);

    target.setPointerCapture(event.pointerId);
    target.classList.add("dragging");
    event.preventDefault();
  });

  els.stage.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;

    if (drag.kind === "nameText" || drag.kind === "pronounsText") {
      const scaleX = drag.sourceSize.width / Math.max(1, drag.container.width);
      const scaleY = drag.sourceSize.height / Math.max(1, drag.container.height);
      drag.current = {
        textX: clampNumber(drag.original.textX + (event.clientX - drag.startX) * scaleX, -500, 500, drag.original.textX),
        textY: clampNumber(drag.original.textY + (event.clientY - drag.startY) * scaleY, -200, 200, drag.original.textY)
      };
      applySnapToNameText(drag, event);
      paintDragPreview(drag.kind, drag.current);
      return;
    }

    const dx = (event.clientX - drag.startX) / drag.container.width;
    const dy = (event.clientY - drag.startY) / drag.container.height;
    if (drag.mode === "resize") {
      drag.current = {
        ...drag.original,
        width: drag.original.width + dx,
        height: drag.original.height + dy
      };
    } else {
      drag.current = {
        ...drag.original,
        x: drag.original.x + dx,
        y: drag.original.y + dy
      };
    }
    if (drag.kind === "media" && drag.mode === "resize" && !event.shiftKey) {
      applyMediaAspectResize(drag, dx, dy);
    }
    normalizeGeometryRect(drag.current);
    applySnapToDragRect(drag, event);
    if (drag.kind === "finish" && state.layout.finishedTime.lockToNameplate) {
      normalizeFinishInsideNameplate(drag.current);
    }
    paintDragPreview(drag.kind, drag.current);
  });

  els.stage.addEventListener("pointerup", endPreviewDrag);
  els.stage.addEventListener("pointercancel", endPreviewDrag);
  els.stage.addEventListener("dblclick", (event) => {
    const nameTarget = event.target.closest("[data-drag-target='nameText']");
    if (nameTarget) {
      const slot = Number(nameTarget.closest(".runner-panel")?.dataset.slot);
      if (slot) {
        focusRunnerName(slot);
        event.preventDefault();
      }
      return;
    }
    if (event.target.closest("[data-drag-target='title']")) {
      const editSub = Boolean(event.target.closest(".title-sub"));
      focusInspectorField("title", "raceInfo", editSub ? els.raceSubtitle : els.raceTitle);
      event.preventDefault();
      return;
    }
    if (event.target.closest("[data-drag-target='commentators']")) {
      const editLabel = Boolean(event.target.closest(".c-label"));
      focusInspectorField("commentators", "commentators", editLabel ? els.commLabel : els.commNames);
      event.preventDefault();
    }
  });

  function endPreviewDrag(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    hideSnapGuides();
    const target = els.stage.querySelector(".dragging");
    target?.classList.remove("dragging");
    if (drag.kind === "nameText") {
      state.layout.nameplate.textX = round(drag.current.textX);
      state.layout.nameplate.textY = round(drag.current.textY);
      syncNameplateControlsFromState();
    } else if (drag.kind === "pronounsText") {
      state.layout.pronounsText.textX = round(drag.current.textX);
      state.layout.pronounsText.textY = round(drag.current.textY);
      syncPronounsTextControlsFromState();
    } else if (drag.kind === "finish") {
      Object.assign(state.layout.panelGeometry.finish, storedFinishGeometry(drag.current));
    } else if (drag.kind === "media") {
      const layer = getMediaLayer(drag.mediaId);
      if (layer) Object.assign(layer.rect, drag.current);
    } else {
      Object.assign(getDragRect(drag.kind), drag.current);
    }
    const reason = drag.kind === "nameText"
      ? "nameplate"
      : drag.kind === "pronounsText"
        ? "pronounsText"
        : drag.kind === "finish"
          ? "finishGeometry"
          : drag.kind === "timer"
            ? "timerBorder"
            : drag.kind === "title"
              ? "raceInfo"
            : drag.kind === "commentators"
              ? "commentators"
              : drag.kind === "media"
                ? "media"
              : drag.kind === "runnerIcon"
                ? "nameplate"
            : drag.kind === "name"
              ? "geometry"
              : "drag-end";
    drag = null;
    endContinuousHistory();
    update();
    scheduleObsApply(reason, 0);
  }
}

function focusRunnerName(slot) {
  const runner = state.runners.find((candidate) => candidate.slot === slot);
  if (!runner) return;
  runner.collapsed = false;
  renderRunnerControls();
  const input = els.runnerControls.querySelector(`.runner-card[data-slot='${slot}'] [data-field='name']`);
  input?.focus();
  input?.select();
}

// Double-clicking a global element's text (title bar, commentators) jumps
// straight to editing its text field: select the element so its inspector shows,
// open the relevant panel, then focus the input.
function focusInspectorField(elementId, panelName, input) {
  setSelectedElement(elementId);
  const panel = document.querySelector(`[data-settings-panel='${panelName}']`);
  if (panel) {
    if ("open" in panel) panel.open = true;
    panel.scrollIntoView?.({ block: "nearest" });
  }
  if (!input) return;
  input.focus();
  if (typeof input.select === "function" && input.tagName !== "TEXTAREA") input.select();
}

function getDragContainer(kind, target) {
  if (kind === "media") {
    const layer = getMediaLayer(target?.dataset.mediaId || "");
    const parents = layer ? mediaParentRects(layer.parentId) : null;
    const stageRect = els.stage.getBoundingClientRect();
    if (parents && parents[0]) {
      const p = parents[0];
      const left = stageRect.left + p.x * stageRect.width;
      const top = stageRect.top + p.y * stageRect.height;
      const width = p.width * stageRect.width;
      const height = p.height * stageRect.height;
      return { left, top, width, height, right: left + width, bottom: top + height };
    }
    return stageRect;
  }
  if (kind === "timer" || kind === "title" || kind === "commentators") return els.stage.getBoundingClientRect();
  if (kind === "nameText" || kind === "pronounsText" || kind === "runnerIcon") return target.closest(".runner-nameplate").getBoundingClientRect();
  return target.closest(".runner-panel").getBoundingClientRect();
}

function getTextDragRect(kind) {
  if (kind === "pronounsText") {
    return {
      textX: Number(state.layout.pronounsText.textX) || 0,
      textY: Number(state.layout.pronounsText.textY) || 0
    };
  }
  return {
    textX: Number(state.layout.nameplate.textX) || 0,
    textY: Number(state.layout.nameplate.textY) || 0
  };
}

function getTextDragSourceSize(kind, target) {
  const panel = target.closest(".runner-panel");
  const slot = Number(panel?.dataset.slot);
  return nameSourceSize(getCurrentRectBySlot().get(slot));
}

function getTextDragBounds(kind, target) {
  const plate = target.closest(".runner-nameplate");
  const visualSelector = kind === "pronounsText" ? ".pronouns-visual-text" : ".name-visual-text";
  const visual = plate?.querySelector(visualSelector);
  const sourceSize = getTextDragSourceSize(kind, target);
  if (visual?.getBBox) {
    try {
      const box = visual.getBBox();
      return {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        sourceWidth: sourceSize.width,
        sourceHeight: sourceSize.height
      };
    } catch {
      // Fall back to DOM bounds below if SVG layout is not ready.
    }
  }

  const plateBox = plate.getBoundingClientRect();
  const targetBox = target.getBoundingClientRect();
  const scaleX = sourceSize.width / Math.max(1, plateBox.width);
  const scaleY = sourceSize.height / Math.max(1, plateBox.height);
  return {
    x: (targetBox.left - plateBox.left) * scaleX,
    y: (targetBox.top - plateBox.top) * scaleY,
    width: targetBox.width * scaleX,
    height: targetBox.height * scaleY,
    sourceWidth: sourceSize.width,
    sourceHeight: sourceSize.height
  };
}

function getDragRect(kind, target = null) {
  if (kind === "feed") return state.layout.panelGeometry.feed;
  if (kind === "name") return state.layout.panelGeometry.name;
  if (kind === "title") return state.layout.raceInfo.rect;
  if (kind === "commentators") return state.layout.commentators.rect;
  if (kind === "runnerIcon") return state.layout.runnerIcon.rect;
  if (kind === "media") return getMediaLayer(target?.dataset.mediaId || "")?.rect || { x: 0, y: 0, width: 0.1, height: 0.1 };
  if (kind === "finish") {
    const slot = Number(target?.closest(".runner-panel")?.dataset.slot);
    const runner = state.runners.find((candidate) => candidate.slot === slot);
    return finishGeometry(runner, getCurrentRectBySlot().get(slot));
  }
  return state.layout.timerBorder;
}

function setSelectedDragTarget(kind) {
  selection.kind = kind;
  for (const element of els.stage.querySelectorAll("[data-drag-target]")) {
    element.classList.toggle("selected", kind !== "media" && element.dataset.dragTarget === kind);
  }
}

function normalizeGeometryRect(rect) {
  rect.width = Math.max(0.02, Math.min(1, Number(rect.width)));
  rect.height = Math.max(0.02, Math.min(1, Number(rect.height)));
  rect.x = Math.max(0, Math.min(1 - rect.width, Number(rect.x)));
  rect.y = Math.max(0, Math.min(1 - rect.height, Number(rect.y)));
}

function applyMediaAspectResize(drag, dx, dy) {
  const layer = getMediaLayer(drag.mediaId);
  const aspect = Number(layer?.aspectRatio) || 16 / 9;
  // Aspect ratio of the coordinate space the rect lives in (the stage for a
  // free layer, the parent's box for a nested one). The on-screen container
  // preserves that box's aspect, so derive it from the container.
  const stageRatio = (drag.container?.width && drag.container?.height)
    ? drag.container.width / drag.container.height
    : STAGE.width / STAGE.height;
  if (Math.abs(dy) > Math.abs(dx)) {
    drag.current.width = drag.current.height * aspect / stageRatio;
  } else {
    drag.current.height = drag.current.width * stageRatio / aspect;
  }
  const maxWidth = Math.max(0.02, 1 - drag.current.x);
  const maxHeight = Math.max(0.02, 1 - drag.current.y);
  if (drag.current.width > maxWidth) {
    drag.current.width = maxWidth;
    drag.current.height = drag.current.width * stageRatio / aspect;
  }
  if (drag.current.height > maxHeight) {
    drag.current.height = maxHeight;
    drag.current.width = drag.current.height * aspect / stageRatio;
  }
}

function applySnapToDragRect(drag, event) {
  hideSnapGuides();
  if (!state.layout.snapEnabled || event.altKey || drag.kind === "finish" && state.layout.finishedTime.lockToNameplate) return;
  const thresholdX = 8 / Math.max(1, drag.container.width);
  const thresholdY = 8 / Math.max(1, drag.container.height);
  const snapX = snapAxis(drag.current, "x", "width", thresholdX);
  const snapY = snapAxis(drag.current, "y", "height", thresholdY);
  normalizeGeometryRect(drag.current);
  showSnapGuidesForContainer(drag.container, snapX, snapY);
}

function applySnapToNameText(drag, event) {
  hideSnapGuides();
  if (!state.layout.snapEnabled || event.altKey || !drag.textBounds) return;
  const bounds = drag.textBounds;
  const thresholdX = 8 * bounds.sourceWidth / Math.max(1, drag.container.width);
  const thresholdY = 8 * bounds.sourceHeight / Math.max(1, drag.container.height);
  const delta = {
    x: drag.current.textX - drag.original.textX,
    y: drag.current.textY - drag.original.textY,
    width: bounds.width,
    height: bounds.height
  };
  const rect = {
    x: bounds.x + delta.x,
    y: bounds.y + delta.y,
    width: bounds.width,
    height: bounds.height
  };
  const snapX = snapTextAxis(rect, "x", "width", bounds.sourceWidth, thresholdX);
  const snapY = snapTextAxis(rect, "y", "height", bounds.sourceHeight, thresholdY);
  if (snapX !== null) drag.current.textX += snapX - rect.x;
  if (snapY !== null) drag.current.textY += snapY - rect.y;

  const guideX = snapX === null ? null : snapX / bounds.sourceWidth;
  const guideY = snapY === null ? null : snapY / bounds.sourceHeight;
  showSnapGuidesForContainer(drag.container, guideX, guideY);
}

function snapTextAxis(rect, positionKey, sizeKey, sourceSize, threshold) {
  const start = rect[positionKey];
  const size = rect[sizeKey];
  const center = start + size / 2;
  const end = start + size;
  const targets = [0, sourceSize / 2, sourceSize];
  for (const target of targets) {
    if (Math.abs(start - target) <= threshold) return target;
    if (Math.abs(center - target) <= threshold) return target - size / 2;
    if (Math.abs(end - target) <= threshold) return target - size;
  }
  return null;
}

function snapAxis(rect, positionKey, sizeKey, threshold) {
  const start = rect[positionKey];
  const size = rect[sizeKey];
  const center = start + size / 2;
  const end = start + size;
  const targets = [0, 0.5, 1];
  for (const target of targets) {
    if (Math.abs(start - target) <= threshold) {
      rect[positionKey] = target;
      return target;
    }
    if (Math.abs(center - target) <= threshold) {
      rect[positionKey] = target - size / 2;
      return target;
    }
    if (Math.abs(end - target) <= threshold) {
      rect[positionKey] = target - size;
      return target;
    }
  }
  return null;
}

function showSnapGuides(x = null, y = null) {
  if (x !== null && Number.isFinite(x)) {
    els.snapGuideV.style.left = `${x * 100}%`;
    els.snapGuideV.classList.add("active");
  } else {
    els.snapGuideV.classList.remove("active");
  }

  if (y !== null && Number.isFinite(y)) {
    els.snapGuideH.style.top = `${y * 100}%`;
    els.snapGuideH.classList.add("active");
  } else {
    els.snapGuideH.classList.remove("active");
  }
}

function showSnapGuidesForContainer(container, x = null, y = null) {
  const stage = els.stage.getBoundingClientRect();
  const normalizedX = x === null ? null : (container.left - stage.left + container.width * x) / Math.max(1, stage.width);
  const normalizedY = y === null ? null : (container.top - stage.top + container.height * y) / Math.max(1, stage.height);
  showSnapGuides(normalizedX, normalizedY);
}

function hideSnapGuides() {
  els.snapGuideV?.classList.remove("active");
  els.snapGuideH?.classList.remove("active");
}

function paintDragPreview(kind, rect) {
  if (kind === "nameText") {
    const currentX = Number(state.layout.nameplate.textX) || 0;
    const currentY = Number(state.layout.nameplate.textY) || 0;
    const deltaX = round(rect.textX - currentX);
    const deltaY = round(rect.textY - currentY);
    for (const content of els.runnerLayer.querySelectorAll(".name-content")) {
      content.style.transform = nameTextIsUnframed()
        ? `translate(${round(rect.textX)}px, calc(-50% + ${round(rect.textY)}px))`
        : `translate(${round(rect.textX)}px, ${round(rect.textY)}px)`;
    }
    for (const text of els.runnerLayer.querySelectorAll(".name-visual-text")) {
      const svg = text.closest("svg");
      const [, , width, height] = String(svg?.getAttribute("viewBox") || "0 0 0 0").split(/\s+/).map(Number);
      const anchor = nameTextAnchor({ width: width || 1, height: height || 1 });
      text.setAttribute("x", round(anchor.x + deltaX));
      text.setAttribute("y", round(anchor.y + deltaY));
    }
    if (document.activeElement !== els.nameTextX) els.nameTextX.value = round(rect.textX);
    if (document.activeElement !== els.nameTextY) els.nameTextY.value = round(rect.textY);
    return;
  }

  if (kind === "pronounsText") {
    const currentX = Number(state.layout.pronounsText.textX) || 0;
    const currentY = Number(state.layout.pronounsText.textY) || 0;
    const deltaX = round(rect.textX - currentX);
    const deltaY = round(rect.textY - currentY);
    for (const content of els.runnerLayer.querySelectorAll(".pronouns-content")) {
      content.style.transform = `translate(${round(rect.textX)}px, calc(-50% + ${round(rect.textY)}px))`;
    }
    for (const text of els.runnerLayer.querySelectorAll(".pronouns-visual-text")) {
      const svg = text.closest("svg");
      const [, , width, height] = String(svg?.getAttribute("viewBox") || "0 0 0 0").split(/\s+/).map(Number);
      const anchor = pronounsTextAnchor({ width: width || 1, height: height || 1 });
      text.setAttribute("x", round(anchor.x + deltaX));
      text.setAttribute("y", round(anchor.y + deltaY));
    }
    if (document.activeElement !== els.pronounsTextX) els.pronounsTextX.value = round(rect.textX);
    if (document.activeElement !== els.pronounsTextY) els.pronounsTextY.value = round(rect.textY);
    return;
  }

  if (kind === "timer") {
    applyNormalizedStyle(els.timerBorder, rect);
    applyNormalizedStyle(els.timerTextPreview, rect);
    repaintNestedMediaLive("timerFrame", rect);
    return;
  }

  if (kind === "title") {
    applyNormalizedStyle(els.titleBarPreview, rect);
    repaintNestedMediaLive("title", rect);
    return;
  }

  if (kind === "commentators") {
    applyNormalizedStyle(els.commentatorsPreview, rect);
    repaintNestedMediaLive("commentators", rect);
    return;
  }

  if (kind === "runnerIcon") {
    for (const node of els.runnerLayer.querySelectorAll(".runner-icon-drag")) {
      node.style.left = `${rect.x * 100}%`;
      node.style.top = `${rect.y * 100}%`;
      node.style.width = `${rect.width * 100}%`;
      node.style.height = `${rect.height * 100}%`;
    }
    return;
  }

  if (kind === "media") {
    const dragging = els.stage.querySelector(".media-preview.dragging");
    const id = dragging?.dataset.mediaId || "";
    const layer = getMediaLayer(id);
    const parents = layer ? mediaParentRects(layer.parentId) : null;
    if (parents) {
      const nodes = els.mediaLayer.querySelectorAll(`.media-preview[data-media-id='${id}']`);
      nodes.forEach((node, i) => {
        const parent = parents[i] || parents[0];
        if (parent) {
          node.style.transitionDuration = "0ms"; // track the drag 1:1 (no easing lag)
          applyNormalizedStyle(node, nestRect(parent, rect));
        }
      });
    } else if (dragging) {
      applyNormalizedStyle(dragging, rect);
    }
    return;
  }

  const selector = kind === "feed" ? ".game-viewport" : kind === "finish" ? ".runner-finished-time" : ".runner-nameplate";
  for (const element of els.runnerLayer.querySelectorAll(selector)) {
    applyNormalizedStyle(element, rect);
  }
}

function snapshotProjectState() {
  return JSON.stringify({
    layout: state.layout,
    runners: state.runners
  });
}

function pushHistory(reason) {
  const snapshot = snapshotProjectState();
  if (history.undo[history.undo.length - 1] === snapshot) return;
  history.undo.push(snapshot);
  if (history.undo.length > history.maxDepth) history.undo.shift();
  history.redo.length = 0;
  updateHistoryButtons();
}

function beginContinuousHistory(reason) {
  if (history.lastPointerSnapshot) return;
  history.lastPointerSnapshot = snapshotProjectState();
}

function endContinuousHistory() {
  if (!history.lastPointerSnapshot) return;
  const before = history.lastPointerSnapshot;
  history.lastPointerSnapshot = null;
  if (before === snapshotProjectState()) return;
  history.undo.push(before);
  if (history.undo.length > history.maxDepth) history.undo.shift();
  history.redo.length = 0;
  updateHistoryButtons();
}

function undo() {
  endContinuousHistory();
  if (history.undo.length === 0) return;
  const current = snapshotProjectState();
  const previous = history.undo.pop();
  history.redo.push(current);
  restoreProjectSnapshot(previous, "undo");
}

function redo() {
  endContinuousHistory();
  if (history.redo.length === 0) return;
  const current = snapshotProjectState();
  const next = history.redo.pop();
  history.undo.push(current);
  restoreProjectSnapshot(next, "redo");
}

function restoreProjectSnapshot(snapshot, reason) {
  const parsed = JSON.parse(snapshot);
  state.layout = normalizeLoadedLayout(parsed.layout);
  state.runners = normalizeLoadedRunners(parsed.runners);
  syncGlobalControlsFromState();
  renderRunnerControls();
  renderStagePanels();
  update();
  updateHistoryButtons();
  scheduleObsApply(reason, 80);
}

function updateHistoryButtons() {
  if (!els.undoAction || !els.redoAction) return;
  els.undoAction.disabled = history.undo.length === 0;
  els.redoAction.disabled = history.redo.length === 0;
}

function handleHotkeys(event) {
  const key = event.key.toLowerCase();
  const typing = isTypingTarget(event.target);

  if (event.key === "Escape") {
    closeApplicationMenus();
    return;
  }

  if ((event.ctrlKey || event.metaKey) && key === "z" && !event.shiftKey) {
    event.preventDefault();
    undo();
    return;
  }

  if ((event.ctrlKey || event.metaKey) && (key === "y" || (key === "z" && event.shiftKey))) {
    event.preventDefault();
    redo();
    return;
  }

  if ((event.ctrlKey || event.metaKey) && key === "s") {
    event.preventDefault();
    saveProject();
    return;
  }

  if ((event.ctrlKey || event.metaKey) && key === "o") {
    event.preventDefault();
    els.loadProject.showPicker?.();
    if (!els.loadProject.showPicker) els.loadProject.click();
    return;
  }

  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    void applyLayoutToObs({ reason: "manual-layout", refreshInputs: true, forceAnimate: true });
    return;
  }

  if (typing || event.ctrlKey || event.metaKey || event.altKey) return;
}

function isTypingTarget(target) {
  const tag = target?.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable;
}

function handleSettingsTabClick(event) {
  const button = event.target.closest("[data-settings-target]");
  if (!button) return;
  setActiveSettingsPanel(button.dataset.settingsTarget);
}

function handleLeftTabClick(event) {
  const button = event.target.closest("[data-left-tab]");
  if (!button) return;
  setActiveLeftTab(button.dataset.leftTab);
}

function setActiveLeftTab(target) {
  if (!els.leftEditTabs) return;
  for (const button of els.leftEditTabs.querySelectorAll("[data-left-tab]")) {
    const active = button.dataset.leftTab === target;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  }
  for (const panel of els.leftEditTabs.querySelectorAll("[data-left-panel]")) {
    const active = panel.dataset.leftPanel === target;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  }
}

function setViewMode(mode) {
  const nextMode = mode === "control" ? "control" : "edit";
  if (state.layout.viewMode === nextMode) return;
  pushHistory("view mode");
  state.layout.viewMode = nextMode;
  if (nextMode === "control") state.layout.layerLock = true;
  else state.layout.layerLock = false;
  syncGlobalControlsFromState();
  update();
}

function toggleAddMediaMenu(event) {
  event?.stopPropagation();
  if (!els.addMediaMenu) return;
  const open = els.addMediaMenu.hidden;
  els.addMediaMenu.hidden = !open;
  els.addMediaLayer?.setAttribute("aria-expanded", open ? "true" : "false");
  if (open) {
    document.addEventListener("click", closeAddMediaMenu, { once: true });
  }
}

function closeAddMediaMenu() {
  if (!els.addMediaMenu) return;
  els.addMediaMenu.hidden = true;
  els.addMediaLayer?.setAttribute("aria-expanded", "false");
}

function openMediaLayerPicker(kind) {
  closeAddMediaMenu();
  if (!els.mediaLayerFile) return;
  els.mediaLayerFile.accept = kind === "video" ? "video/*" : "image/*";
  els.mediaLayerFile.dataset.mediaKind = kind;
  els.mediaLayerFile.click();
}

function mediaNodeId(id) {
  return `media:${id}`;
}

function mediaPartName(layer) {
  return `Media_${layer.id}`;
}

function getMediaLayer(id) {
  return state.layout.mediaLayers.find((layer) => layer.id === id) || null;
}

function mediaLayerIds() {
  return state.layout.mediaLayers.map((layer) => mediaNodeId(layer.id));
}

// --- Media nesting -----------------------------------------------------------
// A media layer may nest inside a parent element. When nested, layer.rect is
// interpreted as a fraction *of the parent's box* (0..1) instead of the stage,
// so the media stays glued to the parent as it moves/resizes. Shared parents
// (game feeds, nameplates) resolve to one instance per active runner.

const MEDIA_PARENT_LABELS = {
  title: "Title bar",
  commentators: "Commentators",
  timerFrame: "Timer frame",
  feed: "Game feeds",
  nameplate: "Nameplates"
};

// Which parent ids are shared across every active runner (multi-instance).
function isSharedMediaParent(parentId) {
  return parentId === "feed" || parentId === "nameplate";
}

// Validate/clean a stored parentId (used on load).
function normalizeMediaParentId(parentId) {
  if (typeof parentId !== "string" || !parentId) return null;
  if (MEDIA_PARENT_LABELS[parentId]) return parentId;
  if (/^runner:\d+$/.test(parentId)) return parentId;
  return null;
}

// Map a scene-tree node id to the media parentId it represents (or undefined
// when the node is not a valid nesting target). "scene" un-nests.
function mediaParentFromNodeId(nodeId) {
  if (nodeId === "scene") return null;
  if (nodeId === "title" || nodeId === "commentators" || nodeId === "timerFrame") return nodeId;
  if (nodeId === "layer:feed") return "feed";
  if (nodeId === "layer:name") return "nameplate";
  if (/^runner:\d+$/.test(nodeId)) return nodeId;
  return undefined;
}

// Map a media parentId back to the scene-tree node it should nest under.
function mediaParentToNodeId(parentId) {
  if (parentId === "feed") return "layer:feed";
  if (parentId === "nameplate") return "layer:name";
  if (parentId === "title" || parentId === "commentators" || parentId === "timerFrame") return parentId;
  if (typeof parentId === "string" && parentId.startsWith("runner:")) return parentId;
  return null;
}

function mediaParentLabel(parentId) {
  if (MEDIA_PARENT_LABELS[parentId]) return MEDIA_PARENT_LABELS[parentId];
  if (typeof parentId === "string" && parentId.startsWith("runner:")) {
    const slot = Number(parentId.split(":")[1]);
    const runner = state.runners.find((r) => r.slot === slot);
    return runner ? `Runner ${runner.placement || slot}` : `Runner ${slot}`;
  }
  return "";
}

function normalizeStageRect(rect) {
  return {
    x: rect.x / STAGE.width,
    y: rect.y / STAGE.height,
    width: rect.width / STAGE.width,
    height: rect.height / STAGE.height
  };
}

// Normalized (stage-fraction) rect(s) of a parent element. Returns an array so
// shared parents can yield one rect per active runner. null => no/unknown
// parent (layer is free/stage-anchored).
function mediaParentRects(parentId) {
  if (!parentId) return null;
  if (parentId === "title") return [state.layout.raceInfo.rect];
  if (parentId === "commentators") return [state.layout.commentators.rect];
  if (parentId === "timerFrame") return [state.layout.timerBorder];
  const rectBySlot = getCurrentRectBySlot(); // slot -> stage px panel rect
  if (parentId === "feed") {
    const feedGeo = gameFeedViewportGeometry();
    return [...rectBySlot.values()].map((panel) => normalizeStageRect(viewportRect(panel, feedGeo)));
  }
  if (parentId === "nameplate") {
    const nameGeo = nameTransformGeometry();
    return [...rectBySlot.values()].map((panel) => normalizeStageRect(viewportRect(panel, nameGeo)));
  }
  if (parentId.startsWith("runner:")) {
    const slot = Number(parentId.split(":")[1]);
    const panel = rectBySlot.get(slot);
    return panel ? [normalizeStageRect(panel)] : [];
  }
  return null;
}

// A centered, aspect-preserving rect (parent-relative, 0..1) that fits a media
// layer of the given native aspect ratio inside a parent box without stretching.
function fitRectInParent(aspectRatio, parent) {
  const aspect = Number(aspectRatio) || 16 / 9;
  const parentPxW = Math.max(1, parent.width * STAGE.width);
  const parentPxH = Math.max(1, parent.height * STAGE.height);
  let relW = 1;
  let relH = (relW * parentPxW / aspect) / parentPxH;
  if (relH > 1) { relH = 1; relW = (relH * parentPxH * aspect) / parentPxW; }
  const scale = 0.9; // small inset so it doesn't butt against the parent edges
  relW *= scale;
  relH *= scale;
  return { x: (1 - relW) / 2, y: (1 - relH) / 2, width: relW, height: relH };
}

// Reposition a single-instance parent's nested media live during that parent's
// drag, so the child tracks the box in real time (not just on release).
function repaintNestedMediaLive(parentId, parentRect) {
  if (!els.mediaLayer) return;
  for (const layer of state.layout.mediaLayers) {
    if (layer.parentId !== parentId) continue;
    const node = els.mediaLayer.querySelector(`[data-media-key='${layer.id}#0']`);
    if (node) {
      // Kill the tween while the parent is being dragged so the child tracks it
      // 1:1 instead of easing behind and catching up. renderMediaLayers restores
      // the transition duration once the drag ends.
      node.style.transitionDuration = "0ms";
      applyNormalizedStyle(node, nestRect(parentRect, layer.rect));
    }
  }
}

// Compose a child's parent-relative rect with a parent's absolute rect.
function nestRect(parent, rel) {
  return {
    x: parent.x + rel.x * parent.width,
    y: parent.y + rel.y * parent.height,
    width: rel.width * parent.width,
    height: rel.height * parent.height
  };
}

// All normalized stage rects a media layer should render at (1 for free/single
// parents, N for shared parents; [] when a shared/runner parent has no active
// instances).
function mediaLayerNormRects(layer) {
  if (!layer) return [];
  const parents = mediaParentRects(layer.parentId);
  if (!parents) return [layer.rect];
  return parents.map((parent) => nestRect(parent, layer.rect));
}

// OBS input part name for the i-th instance of a media layer. Instance 0 keeps
// the legacy name for backward compatibility.
function mediaInstancePartName(layer, index) {
  return index === 0 ? mediaPartName(layer) : `${mediaPartName(layer)}_${index}`;
}

// OBS instances to realise for a media layer: [{ partName, rect }].
function mediaLayerObsInstances(layer) {
  return mediaLayerNormRects(layer).map((rect, index) => ({
    partName: mediaInstancePartName(layer, index),
    rect,
    index
  }));
}

function normalizedLayerOrder() {
  return normalizedLayerOrderFor(state.layout);
}

async function addMediaLayerFromFile(file, dataUrl) {
  const id = `media${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  const isVideo = String(file.type || "").startsWith("video/");
  const dimensions = await readMediaDimensions(dataUrl, isVideo ? "video" : "image");
  const aspectRatio = dimensions.width > 0 && dimensions.height > 0 ? dimensions.width / dimensions.height : 16 / 9;
  const defaultWidth = 0.5;
  const defaultHeight = Math.min(0.7, defaultWidth * (STAGE.width / STAGE.height) / aspectRatio);
  const layer = {
    id,
    name: file.name ? file.name.replace(/\.[^.]+$/, "") : (isVideo ? "Video" : "Image"),
    type: isVideo ? "video" : "image",
    mimeType: file.type || "",
    dataUrl,
    aspectRatio,
    visible: true,
    parentId: null,
    rect: { x: 0.25, y: 0.22, width: defaultWidth, height: defaultHeight }
  };
  pushHistory("add media layer");
  state.layout.mediaLayers.push(layer);
  normalizedLayerOrder();
  const nodeId = mediaNodeId(layer.id);
  const order = state.layout.layerOrder;
  const current = order.indexOf(nodeId);
  const finished = order.indexOf("finished");
  if (current >= 0 && finished >= 0 && current > finished) {
    order.splice(current, 1);
    order.splice(finished, 0, nodeId);
  }
  setSelectedElement(nodeId);
  update();
  scheduleObsApply("media", 120);
}

function handleMediaLayerFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const requestedKind = event.target.dataset.mediaKind;
  if (requestedKind === "image" && !String(file.type || "").startsWith("image/")) {
    logObs("Choose an image file for Add Image.");
    event.target.value = "";
    return;
  }
  if (requestedKind === "video" && !String(file.type || "").startsWith("video/")) {
    logObs("Choose a video file for Add Video.");
    event.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.onload = () => void addMediaLayerFromFile(file, String(reader.result));
  reader.readAsDataURL(file);
  event.target.value = "";
}

function readMediaDimensions(dataUrl, type) {
  return new Promise((resolve) => {
    if (type === "video") {
      const video = document.createElement("video");
      const done = () => resolve({ width: video.videoWidth || 16, height: video.videoHeight || 9 });
      video.addEventListener("loadedmetadata", done, { once: true });
      video.addEventListener("error", () => resolve({ width: 16, height: 9 }), { once: true });
      video.preload = "metadata";
      video.src = dataUrl;
      video.load();
      return;
    }
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth || 16, height: image.naturalHeight || 9 });
    image.onerror = () => resolve({ width: 16, height: 9 });
    image.src = dataUrl;
  });
}

function removeMediaLayer(id) {
  const layer = getMediaLayer(id);
  if (!layer) return;
  pushHistory("remove media layer");
  state.layout.mediaLayers = state.layout.mediaLayers.filter((candidate) => candidate.id !== id);
  state.layout.layerOrder = normalizedLayerOrder().filter((entry) => entry !== mediaNodeId(id));
  if (selection.elementId === mediaNodeId(id)) setSelectedElement("scene");
  void removeManagedMediaInput(layer);
  update();
  scheduleObsApply("media", 80);
}

async function removeManagedMediaInput(layer) {
  if (!obsBridge.connected || !obsBridge.client) return;
  try {
    await obsCall("RemoveInput", { inputName: `${MANAGED_PREFIX}${mediaPartName(layer)}` });
    obsBridge.itemIds.delete(`${MANAGED_PREFIX}${mediaPartName(layer)}`);
  } catch (error) {
    if (!/not found|ResourceNotFound|does not exist/i.test(error.message)) {
      logObs(`Could not remove ${layer.name || "media layer"}: ${error.message}`);
    }
  }
}

let sceneTreeDragId = "";
let sceneTreeDropMode = "";
let sceneTreeDropTargetId = "";

function moveLayerOrderItem(draggedId, targetId, placeAfter = false) {
  if (!draggedId || !targetId || draggedId === targetId || draggedId === "background") return;
  const order = normalizedLayerOrder();
  const fromIndex = order.indexOf(draggedId);
  let targetIndex = order.indexOf(targetId);
  if (fromIndex < 0 || targetIndex < 0) return;
  pushHistory("scene layer order");
  order.splice(fromIndex, 1);
  if (fromIndex < targetIndex) targetIndex -= 1;
  const insertAt = targetIndex + (placeAfter ? 1 : 0);
  order.splice(Math.max(1, insertAt), 0, draggedId);
  state.layout.layerOrder = order;
  renderSceneTree();
  applySceneLayerZIndexes();
  scheduleObsApply("layer-order", 80);
}

// --- Scene tree (Phase 1: tree + eyes + locks + selection) -----------------

function elementFlagVis(key, reason) {
  return {
    get: () => Boolean(state.layout.elements[key]),
    toggle: () => {
      pushHistory("visibility");
      state.layout.elements[key] = !state.layout.elements[key];
      syncGlobalControlsFromState();
      update();
      scheduleObsApply(reason, 100);
    }
  };
}

function buildOrderedSceneTree() {
  const nodes = [{ id: "scene", label: "Scene", kind: "scene", indent: 0 }];
  const activeRunners = state.runners.filter((runner) => runner.active);
  const appendRunners = () => {
    nodes.push({ id: "runners", label: `Runners - ${activeRunners.length}`, kind: "group", indent: 0, lockable: true, selectable: true });
    for (const runner of activeRunners) {
      nodes.push({
        id: `runner:${runner.slot}`, label: `P${runner.placement} - ${runner.name || "Runner"}`, indent: 1, kind: "runner", slot: runner.slot, lockable: true,
        vis: {
          get: () => Boolean(runner.active),
          toggle: () => {
            pushHistory("runner active");
            runner.active = !runner.active;
            renderRunnerControls();
            update();
            scheduleObsApply("active", 80);
          }
        }
      });
    }
    nodes.push({ id: "layers", label: "Shared layers", kind: "group", indent: 1 });
    nodes.push({ id: "layer:feed", label: "Game feeds", indent: 2, vis: elementFlagVis("feed", "feed-visible") });
    nodes.push({ id: "layer:feedBorder", label: "Feed borders", indent: 2, vis: elementFlagVis("feedBorder", "feed-border-visible") });
    nodes.push({ id: "layer:name", label: "Nameplates", indent: 2, vis: elementFlagVis("name", "name-visible") });
    nodes.push({ id: "nameText", label: "Name text", indent: 3, selectable: true, vis: elementFlagVis("nameText", "nameplate") });
    nodes.push({
      id: "pronounsText", label: "Pronouns text", indent: 3, selectable: true,
      vis: {
        get: () => Boolean(state.layout.pronounsText.enabled),
        toggle: () => {
          pushHistory("pronouns visibility");
          state.layout.pronounsText.enabled = !state.layout.pronounsText.enabled;
          if (els.pronounsEnabled) els.pronounsEnabled.checked = state.layout.pronounsText.enabled;
          update();
          scheduleObsApply("pronounsText", 120);
        }
      }
    });
    nodes.push({ id: "runnerIcon", label: "Runner icons", indent: 3, selectable: true, vis: elementFlagVis("runnerIcon", "nameplate") });
    nodes.push({ id: "layer:finishedTime", label: "Finish times", indent: 2, vis: elementFlagVis("finishedTime", "finish-visible") });
  };

  for (const id of [...normalizedLayerOrder()].reverse()) {
    if (id === "background") nodes.push({ id: "background", label: "Background", indent: 0 });
    else if (id === "title") nodes.push({ id: "title", label: "Title bar", indent: 0, orderId: id, drag: "title", lockable: true, vis: elementFlagVis("titleBar", "raceInfo") });
    else if (id === "timerText") nodes.push({ id: "timerText", label: "Timer text", indent: 0, orderId: id, drag: "timer", vis: elementFlagVis("builtInTimer", "timerText") });
    else if (id === "timerFrame") {
      nodes.push({
        id: "timerFrame", label: "Timer frame", indent: 0, orderId: id, drag: "timer", lockable: true,
        vis: {
          get: () => Boolean(state.layout.timerBorder.enabled && state.layout.elements.timerBorder),
          toggle: () => {
            pushHistory("timer border");
            const next = !(state.layout.timerBorder.enabled && state.layout.elements.timerBorder);
            state.layout.timerBorder.enabled = next;
            state.layout.elements.timerBorder = next;
            syncGlobalControlsFromState();
            update();
            scheduleObsApply("timerBorder", 120);
          }
        }
      });
    } else if (id === "commentators") {
      nodes.push({
        id: "commentators", label: "Commentators", indent: 0, orderId: id, drag: "commentators", lockable: true,
        vis: {
          get: () => Boolean(state.layout.commentators.enabled),
          toggle: () => {
            pushHistory("commentators");
            state.layout.commentators.enabled = !state.layout.commentators.enabled;
            syncCommentatorsControls();
            update();
            scheduleObsApply("commentators", 120);
          }
        }
      });
    } else if (id === "runners") {
      const before = nodes.length;
      appendRunners();
      nodes[before].orderId = id;
    }
    else if (id === "finished") {
      nodes.push({
        id: "finished", label: "Finished screen", indent: 0, orderId: id,
        vis: { get: () => uiState.finishedScreenVisible, toggle: () => toggleFinishedScreen() }
      });
    } else if (id.startsWith("media:")) {
      const layer = getMediaLayer(id.slice("media:".length));
      // Nested media are relocated under their parent node below, so skip them
      // in the flat z-order pass.
      if (layer && !layer.parentId) nodes.push(buildMediaSceneNode(layer, 0));
    }
  }
  insertNestedMediaNodes(nodes);
  return nodes;
}

function buildMediaSceneNode(layer, indent) {
  return {
    id: mediaNodeId(layer.id),
    label: layer.name || "Media layer",
    kind: "media",
    indent,
    orderId: mediaNodeId(layer.id),
    drag: "media",
    lockable: true,
    removable: true,
    nestable: true,
    vis: {
      get: () => layer.visible !== false,
      toggle: () => {
        pushHistory("media visibility");
        layer.visible = layer.visible === false;
        update();
        scheduleObsApply("media", 80);
      }
    }
  };
}

// Place each nested media layer as an indented child directly under the tree
// node it is nested inside.
function insertNestedMediaNodes(nodes) {
  for (const layer of state.layout.mediaLayers) {
    if (!layer.parentId) continue;
    const parentNodeId = mediaParentToNodeId(layer.parentId);
    const parentIdx = nodes.findIndex((n) => n.id === parentNodeId);
    if (parentIdx === -1) {
      // Parent not currently in the tree; show at top level so it stays reachable.
      nodes.push(buildMediaSceneNode(layer, 0));
      continue;
    }
    const parentIndent = nodes[parentIdx].indent || 0;
    const node = buildMediaSceneNode(layer, parentIndent + 1);
    node.parentNodeId = parentNodeId;
    let insertAt = parentIdx + 1;
    while (insertAt < nodes.length && nodes[insertAt].parentNodeId === parentNodeId) insertAt += 1;
    nodes.splice(insertAt, 0, node);
  }
}

function buildSceneTree() {
  return buildOrderedSceneTree();
  const nodes = [];
  nodes.push({ id: "scene", label: "Scene", kind: "scene", indent: 0 });
  nodes.push({ id: "title", label: "Title bar", indent: 0, drag: "title", lockable: true, vis: elementFlagVis("titleBar", "raceInfo") });
  nodes.push({ id: "timer", label: "Timer", kind: "group", indent: 0 });
  nodes.push({ id: "timerText", label: "Timer text", indent: 1, drag: "timer", vis: elementFlagVis("builtInTimer", "timerText") });
  nodes.push({
    id: "timerFrame", label: "Timer frame", indent: 1, drag: "timer", lockable: true,
    vis: {
      get: () => Boolean(state.layout.timerBorder.enabled && state.layout.elements.timerBorder),
      toggle: () => {
        pushHistory("timer border");
        const next = !(state.layout.timerBorder.enabled && state.layout.elements.timerBorder);
        state.layout.timerBorder.enabled = next;
        state.layout.elements.timerBorder = next;
        syncGlobalControlsFromState();
        update();
        scheduleObsApply("timerBorder", 120);
      }
    }
  });
  nodes.push({
    id: "commentators", label: "Commentators", indent: 0, drag: "commentators", lockable: true,
    vis: {
      get: () => Boolean(state.layout.commentators.enabled),
      toggle: () => {
        pushHistory("commentators");
        state.layout.commentators.enabled = !state.layout.commentators.enabled;
        syncCommentatorsControls();
        update();
        scheduleObsApply("commentators", 120);
      }
    }
  });
  const activeRunners = state.runners.filter((runner) => runner.active);
  nodes.push({ id: "runners", label: `Runners · ${activeRunners.length}`, kind: "group", indent: 0, lockable: true, selectable: true });
  for (const runner of activeRunners) {
    nodes.push({
      id: `runner:${runner.slot}`, label: `P${runner.placement} · ${runner.name || "Runner"}`, indent: 1, kind: "runner", slot: runner.slot, lockable: true,
      vis: {
        get: () => Boolean(runner.active),
        toggle: () => {
          pushHistory("runner active");
          runner.active = !runner.active;
          renderRunnerControls();
          update();
          scheduleObsApply("active", 80);
        }
      }
    });
  }
  nodes.push({ id: "layers", label: "Shared layers", kind: "group", indent: 1 });
  nodes.push({ id: "layer:feed", label: "Game feeds", indent: 2, vis: elementFlagVis("feed", "feed-visible") });
  nodes.push({ id: "layer:feedBorder", label: "Feed borders", indent: 2, vis: elementFlagVis("feedBorder", "feed-border-visible") });
  nodes.push({ id: "layer:name", label: "Nameplates", indent: 2, vis: elementFlagVis("name", "name-visible") });
  nodes.push({ id: "layer:finishedTime", label: "Finish times", indent: 2, vis: elementFlagVis("finishedTime", "finish-visible") });
  nodes.push({
    id: "finished", label: "Finished screen", indent: 0,
    vis: { get: () => uiState.finishedScreenVisible, toggle: () => toggleFinishedScreen() }
  });
  nodes.push({ id: "background", label: "Background", indent: 0 });
  return nodes;
}

function isElementLocked(id) {
  return Array.isArray(state.layout.lockedElements) && state.layout.lockedElements.includes(id);
}

function toggleElementLock(id) {
  if (!Array.isArray(state.layout.lockedElements)) state.layout.lockedElements = [];
  const idx = state.layout.lockedElements.indexOf(id);
  if (idx >= 0) state.layout.lockedElements.splice(idx, 1);
  else state.layout.lockedElements.push(id);
  renderSceneTree();
}

function isDragKindLocked(kind) {
  if (state.layout.layerLock) return true;
  const map = { title: "title", timer: "timerFrame", commentators: "commentators" };
  if (map[kind]) return isElementLocked(map[kind]);
  if (["feed", "name", "finish"].includes(kind)) return isElementLocked("runners");
  if (kind === "media") return false;
  return false;
}

function dragKindToElementId(kind, target) {
  if (kind === "title") return "title";
  if (kind === "timer") return "timerFrame";
  if (kind === "commentators") return "commentators";
  if (kind === "nameText") return "nameText";
  if (kind === "pronounsText") return "pronounsText";
  if (kind === "runnerIcon") return "runnerIcon";
  if (kind === "media") return mediaNodeId(target?.dataset.mediaId || "");
  if (["feed", "name", "finish"].includes(kind)) {
    const slot = target?.closest?.(".runner-panel")?.dataset.slot;
    return slot ? `runner:${slot}` : "runners";
  }
  return "scene";
}

const INSPECTOR_PANELS = {
  scene: ["layout", "spotlight", "finishedScreen"],
  background: ["theme"],
  title: ["raceInfo", "borders", "animations"],
  timerText: ["timer", "animations"],
  timerFrame: ["borders", "timer", "animations"],
  commentators: ["commentators", "borders", "animations"],
  runners: ["borders", "nameText", "nameplates", "nameplateBorders", "finishedTime", "positions", "animations"],
  "layer:feed": ["positions", "animations"],
  "layer:feedBorder": ["borders"],
  "layer:name": ["nameText", "nameplates", "nameplateBorders"],
  nameText: ["nameText"],
  pronounsText: ["nameText"],
  "layer:finishedTime": ["finishedTime"],
  finished: ["finishedScreen"]
};
const BORDER_TARGET_FOR = { title: "title", timerFrame: "timer", commentators: "commentators", runners: "feed", "layer:feedBorder": "feed" };

function inspectorPanelsFor(id) {
  if (typeof id === "string" && id.startsWith("runner:")) return INSPECTOR_PANELS.runners;
  if (typeof id === "string" && id.startsWith("media:")) return [];
  if (id === "runnerIcon") return [];
  return INSPECTOR_PANELS[id] || INSPECTOR_PANELS.scene;
}

function inspectorTitleFor(id) {
  if (typeof id === "string" && id.startsWith("media:")) {
    const layer = getMediaLayer(id.slice("media:".length));
    return layer ? layer.name || "Media layer" : "Media layer";
  }
  if (typeof id === "string" && id.startsWith("runner:")) {
    const slot = id.split(":")[1];
    const runner = state.runners.find((r) => String(r.slot) === slot);
    return runner ? `P${runner.placement} · ${runner.name || "Runner"}` : "Runner";
  }
  const labels = {
    scene: "Scene", background: "Background", title: "Title bar", timerText: "Timer text",
    timerFrame: "Timer frame", commentators: "Commentators", runners: "Runners (shared style)",
    "layer:feed": "Game feeds", "layer:feedBorder": "Feed borders", "layer:name": "Nameplates",
    "layer:finishedTime": "Finish times", finished: "Finished screen",
    nameText: "Name text", pronounsText: "Pronouns text", runnerIcon: "Runner icons"
  };
  return labels[id] || "Scene";
}

function visibleInspectorPanelsFor(id) {
  if (id === "scene") {
    const panel = INSPECTOR_PANELS.scene.includes(selection.globalPanel) ? selection.globalPanel : "layout";
    selection.globalPanel = panel;
    return [panel];
  }
  return inspectorPanelsFor(id);
}

function showInspectorPanels(ids) {
  const panels = [...document.querySelectorAll("[data-settings-panel]")];
  const openSinglePanel = ids.length === 1;
  for (const panel of panels) {
    const show = ids.includes(panel.dataset.settingsPanel);
    panel.classList.toggle("active", show);
    panel.open = show && openSinglePanel;
  }
  // Panels display in DOM order, so reorder the active ones to match `ids`.
  const parent = panels[0] && panels[0].parentElement;
  if (parent) {
    for (const id of ids) {
      const panel = panels.find((p) => p.dataset.settingsPanel === id);
      if (panel) parent.appendChild(panel);
    }
  }
}

function focusGlobalPanel(name) {
  if (INSPECTOR_PANELS.scene.includes(name)) selection.globalPanel = name;
  setSelectedElement("scene");
  const panel = document.querySelector(`[data-settings-panel="${name}"]`);
  if (panel) {
    panel.open = true;
    try { panel.scrollIntoView({ block: "nearest" }); } catch (e) { /* ignore */ }
  }
  if (els.globalTabs) {
    for (const button of els.globalTabs.querySelectorAll("button")) {
      button.classList.toggle("active", button.dataset.global === name);
    }
  }
}

function updateInspector() {
  if (!state.layout.sceneView) return;
  const id = selection.elementId || "scene";
  if (els.globalTabs) {
    for (const button of els.globalTabs.querySelectorAll("button")) {
      button.classList.toggle("active", id === "scene" && button.dataset.global === selection.globalPanel);
    }
  }
  const target = BORDER_TARGET_FOR[id] || (String(id).startsWith("runner:") ? "feed" : null);
  if (target && state.layout.borderTarget !== target) {
    state.layout.borderTarget = target;
    if (els.borderTarget) els.borderTarget.value = target;
    syncBorderStyleControlsFromState();
  }
  // Give the (single) Borders panel a context-appropriate title.
  const bordersSummary = document.querySelector('[data-settings-panel="borders"] > summary');
  if (bordersSummary) {
    const titles = { feed: "Game Feed Borders", timer: "Timer Border", title: "Title Bar Border", commentators: "Commentators Border" };
    bordersSummary.textContent = titles[target || state.layout.borderTarget] || "Borders";
  }
  if (els.inspectorTitle) els.inspectorTitle.textContent = inspectorTitleFor(id);

  const isRunner = typeof id === "string" && id.startsWith("runner:");
  if (els.runnerUniqueRow) els.runnerUniqueRow.style.display = isRunner ? "" : "none";
  if (isRunner && els.runnerUnique) {
    const slot = Number(id.split(":")[1]);
    const runner = state.runners.find((r) => r.slot === slot);
    els.runnerUnique.checked = Boolean(runner && runner.unique);
  }

  showInspectorPanels(visibleInspectorPanelsFor(id));
  // Load the active config (shared, or the selected unique runner's) into the controls.
  syncNameplateControlsFromState();
  syncFinishedTimeControlsFromState();
  syncBorderStyleControlsFromState();
}

function setSelectedElement(id) {
  const prev = selection.elementId;
  selection.elementId = id;
  highlightSelectedElement(id);
  updateInspector();
  renderSceneTree();
  // Selecting/deselecting the pronoun text or runner icon toggles their
  // editing-only preview (shown even when empty), so refresh the nameplates.
  if (id === "pronounsText" || prev === "pronounsText" || id === "runnerIcon" || prev === "runnerIcon") {
    schedulePreviewRefresh();
  }
}

function highlightSelectedElement(id) {
  for (const el of document.querySelectorAll(".scene-selected")) el.classList.remove("scene-selected");
  const globals = {
    title: els.titleBarPreview,
    timerFrame: els.timerBorder,
    timerText: els.timerTextPreview,
    commentators: els.commentatorsPreview
  };
  if (globals[id]) globals[id].classList.add("scene-selected");
  if (id === "nameText" || id === "pronounsText" || id === "runnerIcon") {
    for (const el of els.runnerLayer?.querySelectorAll(`[data-drag-target='${id}']`) || []) {
      el.classList.add("scene-selected");
    }
  }
  if (typeof id === "string" && id.startsWith("media:")) {
    const media = els.mediaLayer?.querySelector(`[data-media-id='${id.slice("media:".length)}']`);
    if (media) media.classList.add("scene-selected");
  }
  if (typeof id === "string" && id.startsWith("runner:")) {
    const slot = id.split(":")[1];
    const panel = els.runnerLayer?.querySelector(`[data-slot='${slot}']`);
    if (panel) panel.classList.add("scene-selected");
    const card = els.runnerControls?.querySelector(`.runner-card[data-slot='${slot}']`);
    if (card) card.classList.add("scene-selected");
  }
}

const SCENE_ICONS = {
  scene: '<rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>',
  background: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="9" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/>',
  title: '<rect x="3" y="5" width="18" height="14" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>',
  timer: '<circle cx="12" cy="13" r="7.5"/><line x1="12" y1="13" x2="12" y2="9"/><line x1="9.5" y1="2.5" x2="14.5" y2="2.5"/>',
  commentators: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><line x1="12" y1="18" x2="12" y2="21"/>',
  runners: '<circle cx="9" cy="8" r="3"/><path d="M3.5 20v-1a5 5 0 0 1 10 0v1"/><path d="M16 5.5a3 3 0 0 1 0 5.8"/><path d="M20.5 20v-1a4 4 0 0 0-3-3.7"/>',
  runner: '<rect x="3" y="4" width="18" height="12" rx="2"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="12" y1="16" x2="12" y2="20"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
  media: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="10" r="1.5"/><path d="M4 17l5-5 4 4 2-2 5 5"/>',
  finished: '<path d="M5 21V4"/><path d="M5 4h12l-2 3.5L17 11H5"/>'
};

function sceneNodeIconHtml(node) {
  let key = node.id;
  if (node.kind === "runner") key = "runner";
  else if (node.kind === "media") key = "media";
  else if (String(node.id).startsWith("layer:")) key = "layers";
  else if (node.id === "timerText" || node.id === "timerFrame") key = "timer";
  const path = SCENE_ICONS[key] || SCENE_ICONS.layers;
  return `<svg class="sn-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

function renderSceneTree() {
  if (!els.sceneTree || !state.layout.sceneView) return;
  const nodes = buildSceneTree();
  const frag = document.createDocumentFragment();
  for (const node of nodes) {
    const row = document.createElement("div");
    row.className = `scene-node indent-${node.indent}${node.kind === "group" || node.kind === "scene" ? " group" : ""}${selection.elementId === node.id ? " selected" : ""}`;
    row.dataset.id = node.id;
    if (node.orderId && node.id !== "background") {
      row.dataset.orderId = node.orderId;
      row.draggable = true;
      row.classList.add("orderable");
    }
    row.setAttribute("role", "treeitem");

    row.insertAdjacentHTML("beforeend", sceneNodeIconHtml(node));

    const label = document.createElement("span");
    label.className = "sn-label";
    label.textContent = node.label;
    row.appendChild(label);

    if (node.vis) {
      const eye = document.createElement("button");
      eye.type = "button";
      eye.className = `sn-btn sn-eye${node.vis.get() ? "" : " off"}`;
      eye.dataset.act = "vis";
      eye.title = node.vis.get() ? "Hide" : "Show";
      eye.setAttribute("aria-label", node.vis.get() ? "Hide" : "Show");
      eye.textContent = "\u{1F441}";
      row.appendChild(eye);
    }
    if (node.lockable) {
      const lock = document.createElement("button");
      lock.type = "button";
      const locked = isElementLocked(node.id);
      lock.className = `sn-btn sn-lock${locked ? " locked" : ""}`;
      lock.dataset.act = "lock";
      lock.title = locked ? "Unlock" : "Lock position";
      lock.setAttribute("aria-label", locked ? "Unlock" : "Lock position");
      lock.textContent = locked ? "\u{1F512}" : "\u{1F513}";
      row.appendChild(lock);
    }
    if (node.removable) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "sn-btn danger";
      remove.dataset.act = "remove";
      remove.title = "Remove";
      remove.setAttribute("aria-label", "Remove");
      remove.textContent = "x";
      row.appendChild(remove);
    }
    frag.appendChild(row);
  }
  els.sceneTree.replaceChildren(frag);
}

function handleSceneTreeClick(event) {
  const btn = event.target.closest(".sn-btn");
  const row = event.target.closest(".scene-node");
  if (!row) return;
  const id = row.dataset.id;
  const nodes = buildSceneTree();
  const node = nodes.find((n) => n.id === id);
  if (!node) return;

  if (btn && btn.dataset.act === "vis" && node.vis) {
    node.vis.toggle();
    renderSceneTree();
    return;
  }
  if (btn && node.kind === "media" && btn.dataset.act === "remove") {
    removeMediaLayer(id.slice("media:".length));
    return;
  }
  if (btn && btn.dataset.act === "lock" && node.lockable) {
    toggleElementLock(id);
    return;
  }
  const selectable = node.kind !== "group" || node.selectable;
  if (!selectable) return;
  setSelectedElement(id);
}

function clearSceneTreeDropMarkers() {
  for (const row of els.sceneTree?.querySelectorAll(".drop-above, .drop-below, .drop-into, .dragging") || []) {
    row.classList.remove("drop-above", "drop-below", "drop-into", "dragging");
  }
}

function clearSceneTreeDropClasses() {
  for (const row of els.sceneTree?.querySelectorAll(".drop-above, .drop-below, .drop-into") || []) {
    row.classList.remove("drop-above", "drop-below", "drop-into");
  }
}

function handleSceneTreeDragStart(event) {
  const row = event.target.closest(".scene-node[data-order-id]");
  if (!row || event.target.closest(".sn-btn")) {
    event.preventDefault();
    return;
  }
  sceneTreeDragId = row.dataset.orderId;
  sceneTreeDropMode = "";
  sceneTreeDropTargetId = "";
  row.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", sceneTreeDragId);
}

function handleSceneTreeDragOver(event) {
  if (!sceneTreeDragId) return;

  // Media nodes can be dropped *into* an element (nest) or between siblings
  // (reorder z). Everything else is reorder-only.
  if (sceneTreeDragId.startsWith("media:")) {
    const row = event.target.closest(".scene-node");
    if (!row) return;
    const parentTarget = mediaParentFromNodeId(row.dataset.id);
    const bounds = row.getBoundingClientRect();
    const rel = (event.clientY - bounds.top) / Math.max(1, bounds.height);
    const canReorder = row.dataset.orderId && row.dataset.orderId !== sceneTreeDragId;
    const inCentralBand = rel > 0.28 && rel < 0.72;
    clearSceneTreeDropClasses();
    if (parentTarget !== undefined && (inCentralBand || !canReorder)) {
      event.preventDefault();
      row.classList.add("drop-into");
      sceneTreeDropMode = "nest";
      sceneTreeDropTargetId = row.dataset.id;
      event.dataTransfer.dropEffect = "move";
      return;
    }
    if (canReorder) {
      event.preventDefault();
      const after = rel > 0.5;
      row.classList.toggle("drop-above", !after);
      row.classList.toggle("drop-below", after);
      sceneTreeDropMode = "reorder";
      sceneTreeDropTargetId = row.dataset.orderId;
      event.dataTransfer.dropEffect = "move";
    }
    return;
  }

  const row = event.target.closest(".scene-node[data-order-id]");
  if (!row || row.dataset.orderId === sceneTreeDragId) return;
  event.preventDefault();
  const bounds = row.getBoundingClientRect();
  const after = event.clientY > bounds.top + bounds.height / 2;
  for (const other of els.sceneTree.querySelectorAll(".drop-above, .drop-below")) {
    if (other !== row) other.classList.remove("drop-above", "drop-below");
  }
  row.classList.toggle("drop-above", !after);
  row.classList.toggle("drop-below", after);
  sceneTreeDropMode = "reorder";
  sceneTreeDropTargetId = row.dataset.orderId;
  event.dataTransfer.dropEffect = "move";
}

function handleSceneTreeDragLeave(event) {
  const row = event.target.closest(".scene-node");
  if (!row || row.contains(event.relatedTarget)) return;
  row.classList.remove("drop-above", "drop-below", "drop-into");
}

function handleSceneTreeDrop(event) {
  if (!sceneTreeDragId) return;
  event.preventDefault();
  if (sceneTreeDragId.startsWith("media:") && sceneTreeDropMode === "nest") {
    setMediaLayerParent(sceneTreeDragId.slice("media:".length), mediaParentFromNodeId(sceneTreeDropTargetId));
  } else if (sceneTreeDropMode === "reorder" && sceneTreeDropTargetId) {
    const row = els.sceneTree.querySelector(`.scene-node[data-order-id='${sceneTreeDropTargetId}']`);
    const bounds = row?.getBoundingClientRect();
    const after = bounds ? event.clientY > bounds.top + bounds.height / 2 : false;
    moveLayerOrderItem(sceneTreeDragId, sceneTreeDropTargetId, !after);
  }
  sceneTreeDragId = "";
  sceneTreeDropMode = "";
  sceneTreeDropTargetId = "";
  clearSceneTreeDropMarkers();
}

function setMediaLayerParent(layerId, parentId) {
  const layer = getMediaLayer(layerId);
  if (!layer) return;
  const next = parentId === undefined ? layer.parentId : (parentId || null);
  if (next === layer.parentId) return;
  pushHistory("nest media layer");
  // Re-anchor so the media visually stays put where possible: convert its
  // current effective position into the new parent's coordinate space.
  const before = mediaLayerNormRects(layer)[0];
  layer.parentId = next;
  if (before) {
    const parents = mediaParentRects(next);
    if (parents && parents[0]) {
      const p = parents[0];
      const rel = {
        x: (before.x - p.x) / Math.max(0.0001, p.width),
        y: (before.y - p.y) / Math.max(0.0001, p.height),
        width: before.width / Math.max(0.0001, p.width),
        height: before.height / Math.max(0.0001, p.height)
      };
      // If the media doesn't fit inside the new parent, shrink it to a centered,
      // aspect-preserving fit instead of clamping it to the box (which would
      // stretch/distort it).
      const overflows = rel.width > 1 || rel.height > 1 || rel.x < 0 || rel.y < 0
        || rel.x + rel.width > 1 || rel.y + rel.height > 1;
      layer.rect = overflows ? fitRectInParent(layer.aspectRatio, p) : rel;
    } else {
      layer.rect = { ...before };
    }
    normalizeGeometryRect(layer.rect);
  }
  const label = next ? mediaParentLabel(next) : "the canvas";
  logObs(`Nested ${layer.name || "media"} into ${label}.`);
  update();
  renderSceneTree();
  scheduleObsApply("media", 80);
}

function handleSceneTreeDragEnd() {
  sceneTreeDragId = "";
  sceneTreeDropMode = "";
  sceneTreeDropTargetId = "";
  clearSceneTreeDropMarkers();
}

function applySceneView() {
  const on = state.layout.sceneView !== false;
  document.body.classList.toggle("scene-view", on);
  if (els.sceneViewToggle) els.sceneViewToggle.textContent = on ? "Hide Scene Tree" : "Show Scene Tree";
  if (on) {
    if (!selection.elementId) selection.elementId = "scene";
    renderSceneTree();
    updateInspector();
  } else {
    // Restore the classic single-tab view.
    const bordersSummary = document.querySelector('[data-settings-panel="borders"] > summary');
    if (bordersSummary) bordersSummary.textContent = "Borders";
    setActiveSettingsPanel(selection.activePanel || "layout");
  }
}

function toggleSceneView() {
  state.layout.sceneView = !state.layout.sceneView;
  applySceneView();
}

// --- Style clipboard + per-runner actions -----------------------------------

let styleClipboard = null;

// Snapshot of a runner's full look (its override if unique, else the shared style).
function runnerEffectiveStyle(runner) {
  if (runner.unique && runner.style) {
    return {
      nameplate: structuredClone(runner.style.nameplate),
      finishedTime: structuredClone(runner.style.finishedTime),
      borderStyle: structuredClone(runner.style.borderStyle),
      borderImage: runner.style.borderImage
    };
  }
  return {
    nameplate: structuredClone(state.layout.nameplate),
    finishedTime: structuredClone(state.layout.finishedTime),
    borderStyle: structuredClone(getBorderStyle("feed")),
    borderImage: getBorderImage("feed")
  };
}

function copyRunnerStyle(runner) {
  styleClipboard = runnerEffectiveStyle(runner);
  logObs(`Copied ${runner.name || "runner"}'s style. Paste it onto another runner.`);
}

function refreshAfterStyleChange() {
  syncNameplateControlsFromState();
  syncFinishedTimeControlsFromState();
  syncBorderStyleControlsFromState();
  update();
  scheduleObsApply("manual-layout", 120);
}

function pasteRunnerStyle(runner) {
  if (!styleClipboard) return;
  pushHistory("paste runner style");
  makeRunnerUnique(runner);
  runner.style.nameplate = structuredClone(styleClipboard.nameplate);
  runner.style.finishedTime = structuredClone(styleClipboard.finishedTime);
  runner.style.borderStyle = structuredClone(styleClipboard.borderStyle);
  runner.style.borderImage = styleClipboard.borderImage;
  refreshAfterStyleChange();
  logObs(`Pasted style onto ${runner.name || "runner"}.`);
}

function pasteStyleToShared() {
  if (!styleClipboard) return;
  pushHistory("paste shared style");
  state.layout.nameplate = structuredClone(styleClipboard.nameplate);
  state.layout.finishedTime = structuredClone(styleClipboard.finishedTime);
  state.layout.borderStyles.feed = structuredClone(styleClipboard.borderStyle);
  state.layout.borderImages.feed = styleClipboard.borderImage;
  refreshAfterStyleChange();
  logObs("Applied style to all shared runners.");
}

function resetRunnerToShared(runner) {
  pushHistory("reset runner to shared");
  runner.unique = false;
  refreshAfterStyleChange();
  logObs(`${runner.name || "Runner"} reverted to the shared style.`);
}

function duplicateRunner(runner) {
  const target = state.runners.find((r) => !r.active && r.slot !== runner.slot);
  if (!target) {
    logObs("No free runner slot available to duplicate into.");
    return;
  }
  pushHistory("duplicate runner");
  target.name = `${runner.name || "Runner"} copy`;
  target.source = runner.source;
  target.feedMode = runner.feedMode;
  target.crop = { ...runner.crop };
  target.pronounPrimary = runner.pronounPrimary;
  target.pronounSecondary = runner.pronounSecondary;
  target.pronounCustom = runner.pronounCustom;
  target.audioMuted = runner.audioMuted;
  target.audioVolume = runner.audioVolume;
  target.unique = runner.unique;
  target.style = runner.style ? structuredClone(runner.style) : null;
  target.active = true;
  renderRunnerControls();
  update();
  scheduleObsApply("runner-add", 120);
  setSelectedElement(`runner:${target.slot}`);
  logObs(`Duplicated ${runner.name || "runner"} into slot ${target.slot}.`);
}

function sceneContextActions(node) {
  const actions = [];
  if (node.kind === "media") {
    const layer = getMediaLayer(String(node.id).slice("media:".length));
    if (!layer) return actions;
    if (layer.parentId) {
      actions.push({ label: "Unnest to canvas", run: () => setMediaLayerParent(layer.id, null) });
      actions.push({ separator: true });
    }
    for (const [pid, label] of [["title", "Title bar"], ["commentators", "Commentators"], ["timerFrame", "Timer frame"], ["feed", "Game feeds"], ["nameplate", "Nameplates"]]) {
      if (layer.parentId !== pid) actions.push({ label: `Nest into ${label}`, run: () => setMediaLayerParent(layer.id, pid) });
    }
    actions.push({ separator: true });
    actions.push({ label: isElementLocked(node.id) ? "Unlock position" : "Lock position", run: () => toggleElementLock(node.id) });
    actions.push({ label: "Remove", run: () => removeMediaLayer(layer.id) });
    return actions;
  }
  if (node.kind === "runner") {
    const runner = state.runners.find((r) => r.slot === node.slot);
    if (!runner) return actions;
    actions.push({ label: "Rename", run: () => focusRunnerName(node.slot) });
    actions.push({ label: "Duplicate runner", run: () => duplicateRunner(runner) });
    actions.push({ separator: true });
    actions.push({ label: "Copy style", run: () => copyRunnerStyle(runner) });
    actions.push({ label: "Paste style", disabled: !styleClipboard, run: () => pasteRunnerStyle(runner) });
    actions.push({ separator: true });
    if (runner.unique) actions.push({ label: "Reset to shared style", run: () => resetRunnerToShared(runner) });
    else actions.push({ label: "Make unique", run: () => { pushHistory("runner unique"); makeRunnerUnique(runner); refreshAfterStyleChange(); } });
    actions.push({ label: isElementLocked(node.id) ? "Unlock position" : "Lock position", run: () => toggleElementLock(node.id) });
    return actions;
  }
  if (node.id === "runners") {
    actions.push({ label: "Paste style to all runners", disabled: !styleClipboard, run: () => pasteStyleToShared() });
    return actions;
  }
  if (node.lockable) {
    actions.push({ label: isElementLocked(node.id) ? "Unlock position" : "Lock position", run: () => toggleElementLock(node.id) });
  }
  return actions;
}

function handleSceneTreeContextMenu(event) {
  const row = event.target.closest(".scene-node");
  if (!row) return;
  const node = buildSceneTree().find((n) => n.id === row.dataset.id);
  if (!node) return;
  const actions = sceneContextActions(node);
  if (!actions.length) return;
  event.preventDefault();
  if (node.kind !== "group" || node.selectable) setSelectedElement(node.id);
  showSceneContextMenu(event.clientX, event.clientY, actions);
}

function showSceneContextMenu(x, y, actions) {
  hideSceneContextMenu();
  const menu = document.createElement("div");
  menu.className = "scene-context-menu";
  for (const action of actions) {
    if (action.separator) {
      const hr = document.createElement("div");
      hr.className = "scm-sep";
      menu.appendChild(hr);
      continue;
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = action.label;
    if (action.disabled) btn.disabled = true;
    else btn.addEventListener("click", () => { hideSceneContextMenu(); action.run(); });
    menu.appendChild(btn);
  }
  document.body.appendChild(menu);
  els._sceneContextMenu = menu;
  const rect = menu.getBoundingClientRect();
  menu.style.left = `${Math.max(4, Math.min(x, window.innerWidth - rect.width - 8))}px`;
  menu.style.top = `${Math.max(4, Math.min(y, window.innerHeight - rect.height - 8))}px`;
  document.addEventListener("pointerdown", sceneContextMenuOutside);
  document.addEventListener("keydown", sceneContextMenuKey);
  window.addEventListener("blur", hideSceneContextMenu);
}

function hideSceneContextMenu() {
  if (els._sceneContextMenu) {
    els._sceneContextMenu.remove();
    els._sceneContextMenu = null;
  }
  document.removeEventListener("pointerdown", sceneContextMenuOutside);
  document.removeEventListener("keydown", sceneContextMenuKey);
  window.removeEventListener("blur", hideSceneContextMenu);
}

function sceneContextMenuOutside(event) {
  if (els._sceneContextMenu && !els._sceneContextMenu.contains(event.target)) hideSceneContextMenu();
}

function sceneContextMenuKey(event) {
  if (event.key === "Escape") hideSceneContextMenu();
}

// --- Finished Screen (results leaderboard) UI ------------------------------

let lastFinishedScreenSignature = "";

function toggleFinishedScreen() {
  if (uiState.finishedScreenVisible) {
    hideFinishedScreen();
  } else {
    showFinishedScreen({ replay: true });
  }
}

function showFinishedScreen({ replay = true } = {}) {
  uiState.finishedScreenVisible = true;
  renderFinishedScreen({ replay });
  update();
  syncFinishedScreenObs({ replay });
}

function hideFinishedScreen() {
  uiState.finishedScreenVisible = false;
  renderFinishedScreen({ replay: false });
  update();
  syncFinishedScreenObs({ replay: false });
}

function replayFinishedScreen() {
  if (!uiState.finishedScreenVisible) {
    showFinishedScreen({ replay: true });
    return;
  }
  renderFinishedScreen({ replay: true });
  syncFinishedScreenObs({ replay: true });
}

function finishedScreenSignature() {
  const cfg = { ...DEFAULT_FINISHED_SCREEN, ...(state.layout.finishedScreen || {}) };
  return JSON.stringify({ rows: finishedScreenStandings().map((r) => [r.place, r.name, r.time, r.dnf]), cfg });
}

function updateFinishedScreenScale() {
  if (!els.finishedScreenScale || !els.stage) return;
  const scale = (els.stage.clientWidth || STAGE.width) / STAGE.width;
  els.finishedScreenScale.style.transform = `scale(${scale})`;
}

function updateFinishedScreenIconPreview(preview, dataUrl) {
  if (!preview) return;
  if (dataUrl) {
    preview.src = dataUrl;
    preview.hidden = false;
  } else {
    preview.removeAttribute("src");
    preview.hidden = true;
  }
}

function renderFinishedScreen({ replay = false } = {}) {
  if (!els.finishedScreenLayer) return;
  updateFinishedScreenScale();
  const visible = uiState.finishedScreenVisible;
  els.finishedScreenLayer.classList.toggle("show-finished-screen", visible);
  els.finishedScreenLayer.setAttribute("aria-hidden", visible ? "false" : "true");
  if (els.finishedScreenBar) els.finishedScreenBar.classList.toggle("hidden", !visible);
  if (els.viewFinishedScreen) els.viewFinishedScreen.classList.toggle("active", visible);

  if (!visible) return;
  const signature = finishedScreenSignature();
  if (replay || signature !== lastFinishedScreenSignature || !els.finishedScreenScale.innerHTML) {
    els.finishedScreenScale.innerHTML = finishedScreenMarkup();
    lastFinishedScreenSignature = signature;
  }
}

function bindFinishedScreenControls() {
  if (els.finishedScreenReplay) els.finishedScreenReplay.addEventListener("click", replayFinishedScreen);
  if (els.finishedScreenHide) els.finishedScreenHide.addEventListener("click", hideFinishedScreen);
  if (els.finishedScreenShow) els.finishedScreenShow.addEventListener("click", () => showFinishedScreen({ replay: true }));
  if (els.finishedScreenHideBtn) els.finishedScreenHideBtn.addEventListener("click", hideFinishedScreen);

  const rerender = () => {
    if (uiState.finishedScreenVisible) {
      renderFinishedScreen({ replay: false });
      syncFinishedScreenObs({ replay: false, refresh: true });
    }
  };

  const bindText = (el, key) => el && el.addEventListener("input", (event) => {
    state.layout.finishedScreen[key] = event.target.value;
    rerender();
  });
  const bindNumber = (el, key) => el && el.addEventListener("input", (event) => {
    state.layout.finishedScreen[key] = Number(event.target.value);
    rerender();
  });
  const bindCheck = (el, key) => el && el.addEventListener("change", (event) => {
    state.layout.finishedScreen[key] = event.target.checked;
    rerender();
  });
  const bindRange = (el, key, out, suffix) => el && el.addEventListener("input", (event) => {
    state.layout.finishedScreen[key] = Number(event.target.value);
    if (out) out.textContent = `${event.target.value}${suffix}`;
    rerender();
  });

  // General
  bindText(els.finishedScreenAccent, "accentColor");
  bindText(els.finishedScreenBackdrop, "backdropColor");
  bindRange(els.finishedScreenBackdropOpacity, "backdropOpacity", els.finishedScreenBackdropOpacityValue, " %");
  bindRange(els.finishedScreenRowSpeed, "rowSpeedMs", els.finishedScreenRowSpeedValue, " ms");
  bindRange(els.finishedScreenRowStagger, "rowStaggerMs", els.finishedScreenRowStaggerValue, " ms");
  bindCheck(els.finishedScreenIcons, "showIcons");
  bindCheck(els.finishedScreenGaps, "showGaps");
  bindCheck(els.finishedScreenUnderline, "showUnderline");
  bindCheck(els.finishedScreenOnlyBackground, "showOnlyBackground");

  // Runner icons
  bindCheck(els.finishedScreenRunnerIcons, "showRunnerIcons");
  const bindSelect = (el, key) => el && el.addEventListener("change", (event) => {
    state.layout.finishedScreen[key] = event.target.value;
    rerender();
  });
  bindSelect(els.finishedScreenRunnerIconPlacement, "runnerIconPlacement");

  // Personal-best comparison
  bindCheck(els.finishedScreenPbShow, "pbShowDelta");
  if (els.finishedScreenPbMode) els.finishedScreenPbMode.addEventListener("change", (event) => {
    state.layout.finishedScreen.pbShowMode = event.target.value;
    syncPbThresholdVisibility();
    rerender();
  });
  bindNumber(els.finishedScreenPbThreshold, "pbThresholdSec");
  bindText(els.finishedScreenPbDeltaText, "pbDeltaText");
  bindText(els.finishedScreenPbNewText, "pbNewText");
  bindText(els.finishedScreenPbFont, "pbFontFamily");
  bindNumber(els.finishedScreenPbFontSize, "pbFontSize");
  bindText(els.finishedScreenPbColor, "pbColor");
  bindCheck(els.finishedScreenPbStrokeEnabled, "pbStrokeEnabled");
  bindText(els.finishedScreenPbStrokeColor, "pbStrokeColor");
  bindNumber(els.finishedScreenPbStrokeWidth, "pbStrokeWidth");
  bindCheck(els.finishedScreenPbShadowEnabled, "pbShadowEnabled");
  bindText(els.finishedScreenPbShadowColor, "pbShadowColor");
  bindNumber(els.finishedScreenPbShadowBlur, "pbShadowBlur");
  bindNumber(els.finishedScreenPbShadowX, "pbShadowX");
  bindNumber(els.finishedScreenPbShadowY, "pbShadowY");

  // Leaderboard bobbing
  bindCheck(els.finishedScreenBob, "bobEnabled");
  bindRange(els.finishedScreenBobAmp, "bobAmplitude", els.finishedScreenBobAmpValue, " px");
  if (els.finishedScreenBobSpeed) els.finishedScreenBobSpeed.addEventListener("input", (event) => {
    state.layout.finishedScreen.bobSpeed = Number(event.target.value);
    if (els.finishedScreenBobSpeedValue) els.finishedScreenBobSpeedValue.textContent = `${Number(event.target.value).toFixed(1)} s`;
    rerender();
  });
  bindRange(els.finishedScreenBobSmoothness, "bobSmoothness", els.finishedScreenBobSmoothnessValue, " %");
  bindCheck(els.finishedScreenBobStagger, "bobStagger");

  // Top 3 icon uploads (auto-cropped to fill the badge via object-fit: cover).
  const bindIcon = (input, clearBtn, preview, key) => {
    if (input) input.addEventListener("change", (event) => {
      readImageFile(event.target.files?.[0], (dataUrl) => {
        state.layout.finishedScreen[key] = dataUrl;
        updateFinishedScreenIconPreview(preview, dataUrl);
        rerender();
      });
    });
    if (clearBtn) clearBtn.addEventListener("click", () => {
      state.layout.finishedScreen[key] = "";
      if (input) input.value = "";
      updateFinishedScreenIconPreview(preview, "");
      rerender();
    });
  };
  bindIcon(els.finishedScreenIcon1, els.finishedScreenIcon1Clear, els.finishedScreenIcon1Preview, "topIcon1");
  bindIcon(els.finishedScreenIcon2, els.finishedScreenIcon2Clear, els.finishedScreenIcon2Preview, "topIcon2");
  bindIcon(els.finishedScreenIcon3, els.finishedScreenIcon3Clear, els.finishedScreenIcon3Preview, "topIcon3");

  // Header text
  bindText(els.finishedScreenHeading, "heading");
  bindText(els.finishedScreenHeadingFont, "headingFontFamily");
  bindNumber(els.finishedScreenHeadingFontSize, "headingFontSize");
  bindText(els.finishedScreenHeadingColor, "headingColor");
  bindCheck(els.finishedScreenHeadingStrokeEnabled, "headingStrokeEnabled");
  bindText(els.finishedScreenHeadingStrokeColor, "headingStrokeColor");
  bindNumber(els.finishedScreenHeadingStrokeWidth, "headingStrokeWidth");
  bindCheck(els.finishedScreenHeadingShadowEnabled, "headingShadowEnabled");
  bindText(els.finishedScreenHeadingShadowColor, "headingShadowColor");
  bindNumber(els.finishedScreenHeadingShadowBlur, "headingShadowBlur");
  bindNumber(els.finishedScreenHeadingShadowX, "headingShadowX");
  bindNumber(els.finishedScreenHeadingShadowY, "headingShadowY");
  if (els.finishedScreenHeadingFontBrowser) els.finishedScreenHeadingFontBrowser.addEventListener("change", (event) => {
    if (!event.target.value) return;
    state.layout.finishedScreen.headingFontFamily = event.target.value;
    if (els.finishedScreenHeadingFont) els.finishedScreenHeadingFont.value = event.target.value;
    rerender();
  });
  if (els.finishedScreenHeadingBrowseFonts) els.finishedScreenHeadingBrowseFonts.addEventListener("click", browseInstalledFonts);

  // Runner text
  bindText(els.finishedScreenRunnerFont, "runnerFontFamily");
  bindNumber(els.finishedScreenRunnerFontSize, "runnerFontSize");
  bindText(els.finishedScreenRunnerColor, "runnerColor");
  bindCheck(els.finishedScreenRunnerStrokeEnabled, "runnerStrokeEnabled");
  bindText(els.finishedScreenRunnerStrokeColor, "runnerStrokeColor");
  bindNumber(els.finishedScreenRunnerStrokeWidth, "runnerStrokeWidth");
  bindCheck(els.finishedScreenRunnerShadowEnabled, "runnerShadowEnabled");
  bindText(els.finishedScreenRunnerShadowColor, "runnerShadowColor");
  bindNumber(els.finishedScreenRunnerShadowBlur, "runnerShadowBlur");
  bindNumber(els.finishedScreenRunnerShadowX, "runnerShadowX");
  bindNumber(els.finishedScreenRunnerShadowY, "runnerShadowY");
  if (els.finishedScreenRunnerFontBrowser) els.finishedScreenRunnerFontBrowser.addEventListener("change", (event) => {
    if (!event.target.value) return;
    state.layout.finishedScreen.runnerFontFamily = event.target.value;
    if (els.finishedScreenRunnerFont) els.finishedScreenRunnerFont.value = event.target.value;
    rerender();
  });
  if (els.finishedScreenRunnerBrowseFonts) els.finishedScreenRunnerBrowseFonts.addEventListener("click", browseInstalledFonts);

  window.addEventListener("resize", updateFinishedScreenScale);
}

function syncPbThresholdVisibility() {
  if (!els.finishedScreenPbThresholdRow) return;
  const show = (state.layout.finishedScreen?.pbShowMode || "always") === "threshold";
  els.finishedScreenPbThresholdRow.style.display = show ? "" : "none";
}

function syncFinishedScreenControls() {
  const cfg = { ...DEFAULT_FINISHED_SCREEN, ...(state.layout.finishedScreen || {}) };
  const setVal = (el, v) => { if (el) el.value = v; };
  const setChk = (el, v) => { if (el) el.checked = Boolean(v); };
  const setOut = (el, v) => { if (el) el.textContent = v; };

  // General
  setVal(els.finishedScreenAccent, cfg.accentColor);
  setVal(els.finishedScreenBackdrop, cfg.backdropColor);
  setVal(els.finishedScreenBackdropOpacity, cfg.backdropOpacity);
  setOut(els.finishedScreenBackdropOpacityValue, `${cfg.backdropOpacity} %`);
  setVal(els.finishedScreenRowSpeed, cfg.rowSpeedMs);
  setOut(els.finishedScreenRowSpeedValue, `${cfg.rowSpeedMs} ms`);
  setVal(els.finishedScreenRowStagger, cfg.rowStaggerMs);
  setOut(els.finishedScreenRowStaggerValue, `${cfg.rowStaggerMs} ms`);
  setChk(els.finishedScreenIcons, cfg.showIcons === true);
  setChk(els.finishedScreenGaps, cfg.showGaps === true);
  setChk(els.finishedScreenUnderline, cfg.showUnderline !== false);
  setChk(els.finishedScreenOnlyBackground, cfg.showOnlyBackground === true);
  setChk(els.finishedScreenRunnerIcons, cfg.showRunnerIcons === true);
  setVal(els.finishedScreenRunnerIconPlacement, cfg.runnerIconPlacement || "before");
  setChk(els.finishedScreenPbShow, cfg.pbShowDelta === true);
  setVal(els.finishedScreenPbMode, cfg.pbShowMode || "always");
  setVal(els.finishedScreenPbThreshold, cfg.pbThresholdSec);
  setVal(els.finishedScreenPbDeltaText, cfg.pbDeltaText ?? DEFAULT_FINISHED_SCREEN.pbDeltaText);
  setVal(els.finishedScreenPbNewText, cfg.pbNewText ?? DEFAULT_FINISHED_SCREEN.pbNewText);
  setVal(els.finishedScreenPbFont, cfg.pbFontFamily || DEFAULT_FINISHED_SCREEN.pbFontFamily);
  setVal(els.finishedScreenPbFontSize, cfg.pbFontSize);
  setVal(els.finishedScreenPbColor, cfg.pbColor);
  setChk(els.finishedScreenPbStrokeEnabled, cfg.pbStrokeEnabled === true);
  setVal(els.finishedScreenPbStrokeColor, cfg.pbStrokeColor);
  setVal(els.finishedScreenPbStrokeWidth, cfg.pbStrokeWidth);
  setChk(els.finishedScreenPbShadowEnabled, cfg.pbShadowEnabled !== false);
  setVal(els.finishedScreenPbShadowColor, cfg.pbShadowColor);
  setVal(els.finishedScreenPbShadowBlur, cfg.pbShadowBlur);
  setVal(els.finishedScreenPbShadowX, cfg.pbShadowX);
  setVal(els.finishedScreenPbShadowY, cfg.pbShadowY);
  syncPbThresholdVisibility();
  setChk(els.finishedScreenBob, cfg.bobEnabled === true);
  setVal(els.finishedScreenBobAmp, cfg.bobAmplitude);
  setOut(els.finishedScreenBobAmpValue, `${cfg.bobAmplitude} px`);
  setVal(els.finishedScreenBobSpeed, cfg.bobSpeed);
  setOut(els.finishedScreenBobSpeedValue, `${Number(cfg.bobSpeed).toFixed(1)} s`);
  setVal(els.finishedScreenBobSmoothness, cfg.bobSmoothness);
  setOut(els.finishedScreenBobSmoothnessValue, `${cfg.bobSmoothness} %`);
  setChk(els.finishedScreenBobStagger, cfg.bobStagger !== false);
  updateFinishedScreenIconPreview(els.finishedScreenIcon1Preview, cfg.topIcon1);
  updateFinishedScreenIconPreview(els.finishedScreenIcon2Preview, cfg.topIcon2);
  updateFinishedScreenIconPreview(els.finishedScreenIcon3Preview, cfg.topIcon3);

  // Header text
  setVal(els.finishedScreenHeading, cfg.heading);
  setVal(els.finishedScreenHeadingFont, cfg.headingFontFamily);
  setVal(els.finishedScreenHeadingFontSize, cfg.headingFontSize);
  setVal(els.finishedScreenHeadingColor, cfg.headingColor);
  setChk(els.finishedScreenHeadingStrokeEnabled, cfg.headingStrokeEnabled);
  setVal(els.finishedScreenHeadingStrokeColor, cfg.headingStrokeColor);
  setVal(els.finishedScreenHeadingStrokeWidth, cfg.headingStrokeWidth);
  setChk(els.finishedScreenHeadingShadowEnabled, cfg.headingShadowEnabled);
  setVal(els.finishedScreenHeadingShadowColor, cfg.headingShadowColor);
  setVal(els.finishedScreenHeadingShadowBlur, cfg.headingShadowBlur);
  setVal(els.finishedScreenHeadingShadowX, cfg.headingShadowX);
  setVal(els.finishedScreenHeadingShadowY, cfg.headingShadowY);

  // Runner text
  setVal(els.finishedScreenRunnerFont, cfg.runnerFontFamily);
  setVal(els.finishedScreenRunnerFontSize, cfg.runnerFontSize);
  setVal(els.finishedScreenRunnerColor, cfg.runnerColor);
  setChk(els.finishedScreenRunnerStrokeEnabled, cfg.runnerStrokeEnabled);
  setVal(els.finishedScreenRunnerStrokeColor, cfg.runnerStrokeColor);
  setVal(els.finishedScreenRunnerStrokeWidth, cfg.runnerStrokeWidth);
  setChk(els.finishedScreenRunnerShadowEnabled, cfg.runnerShadowEnabled);
  setVal(els.finishedScreenRunnerShadowColor, cfg.runnerShadowColor);
  setVal(els.finishedScreenRunnerShadowBlur, cfg.runnerShadowBlur);
  setVal(els.finishedScreenRunnerShadowX, cfg.runnerShadowX);
  setVal(els.finishedScreenRunnerShadowY, cfg.runnerShadowY);
}

function renderControlMode() {
  if (!els.controlRunnerList) return;
  els.controlTimerReadout.textContent = formatTimerDisplay(currentTimerElapsedMs());
  els.controlRunnerList.innerHTML = "";
  const template = document.getElementById("controlRunnerTemplate");
  for (const runner of state.runners) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.slot = String(runner.slot);
    node.classList.toggle("inactive", !runner.active);
    node.classList.toggle("runner-done", Boolean(runner.done));
    node.querySelector("[data-role='name']").textContent = `P${runner.placement} - ${runner.name}`;
    node.querySelector("[data-role='status']").textContent = controlRunnerStatus(runner);
    node.querySelector("[data-action='toggleActive']").textContent = runner.active ? "Hide" : "Show";
    node.querySelector("[data-action='markDone']").textContent = runner.done ? "Update Finish" : "Finish";
    node.querySelector("[data-action='toggleMute']").textContent = runner.audioMuted ? "Unmute" : "Mute";
    els.controlRunnerList.appendChild(node);
  }
}

function controlRunnerStatus(runner) {
  const parts = [];
  parts.push(runner.active ? "Visible" : "Hidden");
  if (runner.done) parts.push(formatRunnerFinalTime(runner) || "Finished");
  if (runner.audioMuted) parts.push("Muted");
  if (runner.feedMode && runner.feedMode !== "live") parts.push(feedModeLabel(runner.feedMode));
  return parts.join(" / ");
}

function handleControlRunnerAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const slot = Number(button.closest(".control-runner-card")?.dataset.slot);
  const runner = state.runners.find((candidate) => candidate.slot === slot);
  if (!runner) return;

  if (button.dataset.action === "toggleActive") {
    pushHistory("control runner active");
    runner.active = !runner.active;
    renderRunnerControls();
    update();
    scheduleObsApply("active", 80);
  } else if (button.dataset.action === "markDone") {
    markRunnerDone(runner);
  } else if (button.dataset.action === "spotlight") {
    pushHistory("control spotlight");
    state.layout.spotlight.enabled = true;
    state.layout.spotlight.slots = String(runner.slot);
    syncGlobalControlsFromState();
    update();
    scheduleObsApply("spotlight", 80);
  } else if (button.dataset.action === "toggleMute") {
    pushHistory("control mute");
    runner.audioMuted = !runner.audioMuted;
    renderRunnerControls();
    update();
    scheduleObsApply("audio", 80);
  }
}

function setActiveSettingsPanel(target) {
  const previousPanel = selection.activePanel;
  const changed = previousPanel !== target;
  selection.activePanel = target;
  for (const button of els.settingsTabs.querySelectorAll("[data-settings-target]")) {
    button.classList.toggle("active", button.dataset.settingsTarget === target);
  }

  for (const panel of document.querySelectorAll("[data-settings-panel]")) {
    const active = panel.dataset.settingsPanel === target;
    panel.classList.toggle("active", active);
    panel.open = active;
  }

  if (changed && (target === "finishedTime" || previousPanel === "finishedTime")) {
    update();
  }
}

function bindStageSizing() {
  const resize = () => {
    syncStageSize();
    schedulePreviewRefresh();
  };
  window.addEventListener("resize", resize);
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(els.stageWrap);
  }
  requestAnimationFrame(resize);
}

function syncStageSize() {
  const bounds = els.stageWrap.getBoundingClientRect();
  const maxWidth = Math.max(1, bounds.width);
  const maxHeight = Math.max(1, bounds.height);
  const aspect = STAGE.width / STAGE.height;
  const width = Math.min(maxWidth, maxHeight * aspect);
  const height = width / aspect;
  els.stage.style.width = `${width}px`;
  els.stage.style.height = `${height}px`;
}

function renderRunnerControls() {
  els.runnerControls.innerHTML = "";
  const template = document.getElementById("runnerControlTemplate");
  populateSetupPreviewSlotOptions();

  for (const runner of state.runners) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.slot = runner.slot;
    node.classList.toggle("collapsed", runner.collapsed);
    node.querySelector("[data-role='slotTitle']").textContent = `Slot ${runner.slot}`;
    node.querySelector("[data-role='placeBadge']").textContent = `P${runner.placement}`;
    node.classList.toggle("runner-done", runner.done);
    const collapseButton = node.querySelector("[data-action='toggleCollapse']");
    collapseButton.textContent = "";
    collapseButton.setAttribute("aria-label", runner.collapsed ? "Expand runner" : "Collapse runner");

    setInputValue(node, "active", runner.active);
    setInputValue(node, "name", runner.name);
    setInputValue(node, "source", runner.source);
    setInputValue(node, "feedMode", runner.feedMode || "live");
    setInputValue(node, "finalTimeText", runner.finalTimeText || formatRunnerFinalTime(runner));
    setInputValue(node, "audioMuted", runner.audioMuted);
    setInputValue(node, "audioVolume", runner.audioVolume);
    setInputValue(node, "cropLeft", runner.crop.left);
    setInputValue(node, "cropTop", runner.crop.top);
    setInputValue(node, "cropRight", runner.crop.right);
    setInputValue(node, "cropBottom", runner.crop.bottom);
    setInputValue(node, "pronounPrimary", runner.pronounPrimary || "");
    setInputValue(node, "pronounSecondary", runner.pronounSecondary || "");
    setInputValue(node, "pronounCustom", runner.pronounCustom || "");
    setInputValue(node, "pb", runner.pb || "");
    syncRunnerIconPreview(node, runner);
    syncCropOutputs(node, runner);
    syncFeedStatus(node, runner);
    syncRunnerFinishButtons(node, runner);
    syncRunnerAudioControls(node, runner);
    syncCustomPronounField(node, runner);

    node.addEventListener("input", (event) => handleRunnerInput(event, runner, node));
    node.addEventListener("change", (event) => handleRunnerInput(event, runner, node));
    node.addEventListener("change", endContinuousHistory);
    node.addEventListener("focusout", endContinuousHistory);
    node.addEventListener("click", (event) => handleRunnerAction(event, runner, node));
    els.runnerControls.appendChild(node);
  }
}

function populateSetupPreviewSlotOptions() {
  const current = String(state.layout.setupPreviewSlot || 0);
  els.setupPreviewSlot.replaceChildren(
    selectOption("0", "Off"),
    ...state.runners.map((runner) => selectOption(String(runner.slot), `Slot ${runner.slot} - ${runner.name}`))
  );
  els.setupPreviewSlot.value = current;
}

function syncRunnerFinishButtons(node, runner) {
  const doneButton = node.querySelector("[data-action='markDone']");
  const resetButton = node.querySelector("[data-action='resetDone']");
  const finishEdit = node.querySelector("[data-role='finishEdit']");
  if (doneButton) doneButton.textContent = runner.done ? "Update Finish To Current" : "Mark as Finished";
  if (resetButton) resetButton.hidden = !runner.done;
  if (finishEdit) finishEdit.hidden = !runner.done;
}

function syncRunnerAudioControls(node, runner) {
  const output = node.querySelector("[data-role='audioVolumeValue']");
  if (output) output.textContent = `${Math.round(Number(runner.audioVolume) || 0)}%`;
}

function syncCustomPronounField(node, runner) {
  const showCustom = runner.pronounPrimary === "custom" || runner.pronounSecondary === "custom";
  const customField = node.querySelector("[data-role='customPronounField']");
  if (customField) {
    customField.style.display = showCustom ? "block" : "none";
  }
}

function renderStagePanels() {
  els.runnerLayer.innerHTML = "";

  for (const runner of state.runners) {
    const panel = document.createElement("article");
    panel.className = "runner-panel";
    panel.dataset.slot = String(runner.slot);
    panel.innerHTML = `
      <div class="runner-shell">
        <div class="game-viewport drag-target" data-drag-target="feed" title="Drag to move game viewport">
          <div class="feed-art"></div>
          <span class="resize-handle" data-resize-handle="feed" aria-hidden="true"></span>
        </div>
        <div class="runner-nameplate drag-target" data-drag-target="name" title="Drag to move nameplate">
          <span class="resize-handle" data-resize-handle="name" aria-hidden="true"></span>
        </div>
        <div class="runner-finished-time drag-target" data-drag-target="finish" title="Drag to move finished time">
          <span class="finish-preview-frame"></span>
          <span class="resize-handle" data-resize-handle="finish" aria-hidden="true"></span>
        </div>
      </div>
    `;
    els.runnerLayer.appendChild(panel);
  }
}

function syncRunnerIconPreview(node, runner) {
  const preview = node.querySelector("[data-role='iconPreview']");
  if (!preview) return;
  if (runner.icon) {
    preview.src = runner.icon;
    preview.hidden = false;
  } else {
    preview.removeAttribute("src");
    preview.hidden = true;
  }
}

function handleRunnerInput(event, runner, node) {
  // Runner icon upload (file input has a data-role, not a data-field).
  if (event.target.dataset.role === "iconFile") {
    readImageFile(event.target.files?.[0], (dataUrl) => {
      pushHistory("runner icon");
      runner.icon = dataUrl;
      syncRunnerIconPreview(node, runner);
      update();
      scheduleObsApply("nameplate", 120);
    });
    return;
  }

  const field = event.target.dataset.field;
  if (!field) return;

  if (field === "pb") {
    beginContinuousHistory(`runner-${runner.slot}-pb`);
    runner.pb = event.target.value;
    update();
    scheduleObsApply("finishedScreen", 250);
    return;
  }

  if (field === "active") {
    pushHistory("runner active");
    runner.active = event.target.checked;
  } else if (field === "name" || field === "source" || field === "finalTimeText") {
    beginContinuousHistory(`runner-${runner.slot}-${field}`);
    runner[field] = event.target.value;
    syncFeedStatus(node, runner);
  } else if (field === "pronounPrimary" || field === "pronounSecondary") {
    pushHistory(`runner-${runner.slot}-${field}`);
    runner[field] = event.target.value;
    syncCustomPronounField(node, runner);
  } else if (field === "pronounCustom") {
    beginContinuousHistory(`runner-${runner.slot}-${field}`);
    runner[field] = event.target.value;
  } else if (field === "feedMode") {
    pushHistory(`runner-${runner.slot}-feed-mode`);
    runner.feedMode = event.target.value;
    syncFeedStatus(node, runner);
  } else if (field === "audioMuted") {
    pushHistory("runner audio mute");
    runner.audioMuted = event.target.checked;
    syncRunnerAudioControls(node, runner);
    scheduleObsApply("audio", 80);
  } else if (field === "audioVolume") {
    beginContinuousHistory(`runner-${runner.slot}-audioVolume`);
    runner.audioVolume = clampNumber(event.target.value, 0, 200, 100);
    syncRunnerAudioControls(node, runner);
    scheduleObsApply("audio", 80);
  } else if (field.startsWith("crop")) {
    beginContinuousHistory(`runner-${runner.slot}-${field}`);
    const cropKey = field.replace("crop", "").toLowerCase();
    runner.crop[cropKey] = Math.max(0, Number(event.target.value) || 0);
    clampCrop(runner.crop, cropKey);
    syncCropOutputs(node, runner);
  }

  update();
  const applyReason = field.startsWith("pronoun") ? "nameplate" : (field === "finalTimeText" ? "finish" : field);
  scheduleObsApply(applyReason, field.startsWith("crop") ? 80 : 250);
}

function handleRunnerAction(event, runner, node) {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  if (button.dataset.action === "vdoClean") {
    pushHistory("vdo clean");
    runner.source = normalizeVdoNinjaUrl(runner.source);
    setInputValue(node, "source", runner.source);
    syncFeedStatus(node, runner);
    update();
    scheduleObsApply("vdo-clean", 0);
  } else if (button.dataset.action === "clearIcon") {
    pushHistory("runner icon clear");
    runner.icon = "";
    const fileInput = node.querySelector("[data-role='iconFile']");
    if (fileInput) fileInput.value = "";
    syncRunnerIconPreview(node, runner);
    update();
    scheduleObsApply("nameplate", 120);
  } else if (button.dataset.action === "toggleCollapse") {
    runner.collapsed = !runner.collapsed;
    renderRunnerControls();
  } else if (button.dataset.action === "previewSlot") {
    pushHistory("setup preview");
    state.layout.setupPreviewSlot = state.layout.setupPreviewSlot === runner.slot ? 0 : runner.slot;
    syncGlobalControlsFromState();
    update();
  } else if (button.dataset.action === "markDone") {
    markRunnerDone(runner);
  } else if (button.dataset.action === "resetDone") {
    resetRunnerDone(runner);
  } else if (button.dataset.action === "quickFinish") {
    if (runner.done) {
      resetRunnerDone(runner);
    } else {
      markRunnerDone(runner);
    }
  }
}

function markRunnerDone(runner) {
  pushHistory("runner done");
  runner.done = true;
  runner.finalTimeMs = currentTimerElapsedMs();
  runner.finalTimeText = formatTimerDisplay(runner.finalTimeMs);
  renderRunnerControls();
  update();
  scheduleObsApply("finish", 80);
}

function resetRunnerDone(runner) {
  pushHistory("runner finish reset");
  runner.done = false;
  runner.finalTimeMs = null;
  runner.finalTimeText = "";
  renderRunnerControls();
  update();
  scheduleObsApply("finish", 80);
}

function resetAllFinishes() {
  if (!state.runners.some((runner) => runner.done || runner.finalTimeText)) return;
  pushHistory("reset all finishes");
  for (const runner of state.runners) {
    runner.done = false;
    runner.finalTimeMs = null;
    runner.finalTimeText = "";
  }
  renderRunnerControls();
  update();
  scheduleObsApply("finish", 80);
}

function formatRunnerFinalTime(runner) {
  if (runner.finalTimeText) return runner.finalTimeText;
  if (runner.finalTimeMs !== null && runner.finalTimeMs !== undefined) return formatTimerDisplay(runner.finalTimeMs);
  return "";
}

function getRunnerPronouns(runner) {
  const primary = runner.pronounPrimary;
  const secondary = runner.pronounSecondary;
  const custom = runner.pronounCustom;

  if (primary === "custom" || secondary === "custom") {
    return custom ? custom.trim() : "";
  }

  const presetMap = {
    he: "Him",
    she: "Her",
    they: "Them"
  };

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  if (primary && !secondary) {
    return `${capitalize(primary)}/${presetMap[primary.toLowerCase()] || ""}`;
  }
  if (secondary && !primary) {
    return `${capitalize(secondary)}/${presetMap[secondary.toLowerCase()] || ""}`;
  }
  if (primary && secondary) {
    return `${capitalize(primary)}/${capitalize(secondary)}`;
  }
  return "";
}

function hasRealRunnerFinalTime(runner) {
  return Boolean(runner.done || runner.finalTimeText || runner.finalTimeMs !== null && runner.finalTimeMs !== undefined);
}

function isFinishedTimePreviewMode() {
  return selection.activePanel === "finishedTime";
}

function displayRunnerFinalTime(runner, allowExample = false) {
  const real = formatRunnerFinalTime(runner);
  if (real) return real;
  if (hasRealRunnerFinalTime(runner)) return "";
  if (!allowExample || !isFinishedTimePreviewMode()) return "";
  return exampleFinishedTime(runner.slot);
}

function exampleFinishedTime(slot) {
  const baseMs = 12 * 60 * 1000 + 34 * 1000 + 560;
  const offsetMs = (Math.max(1, Number(slot) || 1) - 1) * 47 * 1000;
  return formatTimerDisplay(baseMs + offsetMs);
}

function readImageFile(file, onLoad) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => onLoad(String(reader.result));
  reader.readAsDataURL(file);
}

async function connectObs() {
  try {
    const host = els.obsHost.value.trim() || "localhost";
    const port = Number(els.obsPort.value) || 4455;
    obsBridge.sceneName = els.obsSceneName.value.trim() || "ORM__Default";
    setObsUiBusy(true);
    logObs(`Connecting to OBS on ${host}:${port}...`);
    obsBridge.client = new ObsWebSocketClient();
    obsBridge.client.onClose = (event) => {
      obsBridge.connected = false;
      setObsConnected(false);
      if (obsBridge.connecting) return;
      const details = event?.code ? ` Code ${event.code}${event.reason ? `: ${event.reason}` : ""}.` : "";
      logObs(`OBS connection closed.${details}`);
    };
    obsBridge.connecting = true;
    const version = await obsBridge.client.connect({ host, port, password: els.obsPassword.value, onAttempt: logObs });
    obsBridge.connected = true;
    obsBridge.connecting = false;
    setObsConnected(true);
    logObs(`Connected to OBS ${version.obsStudioVersion} / websocket ${version.obsWebSocketVersion}.`);
  } catch (error) {
    obsBridge.connected = false;
    obsBridge.connecting = false;
    setObsConnected(false);
    logObs(`Connect failed: ${error.message}`);
  } finally {
    setObsUiBusy(false);
  }
}

async function createOrRepairObsScene() {
  if (!requireObs()) return;

  return runExclusiveObsOperation(async () => {
    try {
      window.clearTimeout(obsBridge.applyTimer);
      obsBridge.pendingApply = false;
      setObsUiBusy(true);
      setObsLogBusy(true);
      obsBridge.sceneName = els.obsSceneName.value.trim() || "ORM__Default";
      logObs(`Setting up scene... creating or repairing ${obsBridge.sceneName}.`);
      await ensureScene(obsBridge.sceneName);
      logObs("Setting up scene... cleaning old managed sources.");
      await cleanupManagedInputs({ keepScene: true });
      obsBridge.itemIds.clear();
      obsBridge.lastRects.clear();
      obsBridge.lastVisibility.clear();
      obsBridge.lastFinishVisibility.clear();
      obsBridge.lastSceneItemEnabled.clear();

      logObs("Setting up scene... creating browser sources.");
      await createBrowserInput("Background", obsBridge.sceneName, htmlDataUrl(buildBackgroundHtml()), STAGE.width, STAGE.height, true);
      const titleSize = titleBarSourceSize();
      await createBrowserInput("TitleBar", obsBridge.sceneName, htmlDataUrl(buildTitleBarHtml()), titleSize.width, titleSize.height, state.layout.elements.titleBar);
      const timerBorderSize = timerBorderSourceSize();
      await createBrowserInput("TimerBorder", obsBridge.sceneName, htmlDataUrl(buildTimerBorderHtml()), timerBorderSize.width, timerBorderSize.height, state.layout.timerBorder.enabled);
      const timerTextSize = timerTextSourceSize();
      await createBrowserInput("TimerText", obsBridge.sceneName, htmlDataUrl(buildTimerTextHtml()), timerTextSize.width, timerTextSize.height, state.layout.elements.builtInTimer);
      try {
        const commSize = commentatorsSourceSize();
        await createBrowserInput("Commentators", obsBridge.sceneName, htmlDataUrl(buildCommentatorsHtml()), commSize.width, commSize.height, state.layout.commentators.enabled);
      } catch (error) {
        logObs(`Commentators source skipped: ${error.message}`);
      }
      try {
        await createBrowserInput("FinishedScreen", obsBridge.sceneName, htmlDataUrl(buildFinishedScreenHtml()), STAGE.width, STAGE.height, uiState.finishedScreenVisible);
      } catch (error) {
        logObs(`Finished screen source skipped: ${error.message}`);
      }
      for (const layer of state.layout.mediaLayers) {
        for (const instance of mediaLayerObsInstances(layer)) {
          try {
            const size = mediaInstanceSourceSize(instance.rect);
            await createBrowserInput(instance.partName, obsBridge.sceneName, htmlDataUrl(buildMediaLayerHtml(layer)), size.width, size.height, layer.visible !== false);
          } catch (error) {
            logObs(`Media layer ${layer.name || layer.id} #${instance.index} skipped: ${error.message}`);
          }
        }
      }

      const rectBySlot = getCurrentRectBySlot();
      for (const runner of state.runners) {
        await createRunnerObsInputs(runner, rectBySlot.get(runner.slot));
      }

      logObs("Setting up scene... applying layout.");
      obsBridge.opacitySupported = await ensureOpacityFilters();
      await enforceSceneLayerOrder();
      await obsCall("SetCurrentProgramScene", { sceneName: obsBridge.sceneName });
      await applyLayoutToObs();
      logObs("Managed OBS scene is ready.");
    } catch (error) {
      logObs(`Create / repair failed: ${error.message}`);
    } finally {
      setObsLogBusy(false);
      setObsUiBusy(false);
    }
  });
}

async function applyLayoutToObs(options = {}) {
  if (!requireObs()) return;

  return runExclusiveObsOperation(async () => {
    try {
      if (!options.scheduled) setObsUiBusy(true);
      await refreshSceneItemCache();
      const refreshInputs = options.refreshInputs ?? !options.scheduled;
      const animate = (options.forceAnimate || shouldAnimateObsLayout(options.reason)) && obsBridge.animateLayout;
      const rectBySlot = getCurrentRectBySlot();
      if (refreshInputs) {
        await updateInputsForReason(options.reason, rectBySlot);
      }

    await ensureManagedGlobalSources();
    await setSceneItemTransform("Background", {
      positionX: 0,
      positionY: 0,
      boundsWidth: STAGE.width,
      boundsHeight: STAGE.height
    });
    await setSceneItemEnabled("TitleBar", state.layout.elements.titleBar);
    await setSceneItemTransform("TitleBar", absoluteRect(state.layout.raceInfo.rect));
    await setSceneItemEnabled("TimerBorder", state.layout.timerBorder.enabled && state.layout.elements.timerBorder);
    await setSceneItemTransform("TimerBorder", absoluteRect(state.layout.timerBorder));
    await setSceneItemEnabled("TimerText", state.layout.elements.builtInTimer);
    await setSceneItemTransform("TimerText", timerTextTransformRect());
    try {
      await setSceneItemEnabled("Commentators", state.layout.commentators.enabled);
      await setSceneItemTransform("Commentators", absoluteRect(state.layout.commentators.rect));
    } catch (error) {
      logObs(`Commentators layer skipped: ${error.message}`);
    }
    // The Finished Screen overlay is non-critical: never let a problem with it
    // (e.g. missing from an older scene) abort the core layout, which would
    // leave every runner/title/timer item stuck at the default top-left.
    try {
      await setSceneItemTransform("FinishedScreen", {
        positionX: 0,
        positionY: 0,
        boundsWidth: STAGE.width,
        boundsHeight: STAGE.height
      });
      await setSceneItemEnabled("FinishedScreen", uiState.finishedScreenVisible);
    } catch (error) {
      logObs(`Finished screen layer skipped: ${error.message}`);
    }
    await ensureManagedMediaSources();
    for (const layer of state.layout.mediaLayers) {
      const instances = mediaLayerObsInstances(layer);
      for (const instance of instances) {
        try {
          await setSceneItemEnabled(instance.partName, layer.visible !== false);
          await setSceneItemTransform(instance.partName, absoluteRect(instance.rect));
        } catch (error) {
          logObs(`Media layer ${layer.name || layer.id} #${instance.index} skipped: ${error.message}`);
        }
      }
      // Hide any leftover instances from a previously larger runner count.
      for (let i = instances.length; i < mediaLayerMaxInstances(layer); i += 1) {
        try {
          await setSceneItemEnabled(mediaInstancePartName(layer, i), false);
        } catch {
          // Instance was never created; nothing to disable.
        }
      }
    }
    await ensureManagedRunnerSources();
    await ensureRunnerItemIds();
    await enforceSceneLayerOrder();

    if (animate) {
      await animateRunnerLayout(rectBySlot, { refreshVisibleNameSources: refreshInputs && runnerNameSourceSizeReason(options.reason) });
    } else {
      await applyRunnerLayoutImmediate(rectBySlot, { refreshVisibleNameSources: refreshInputs && runnerNameSourceSizeReason(options.reason) });
    }

    await syncAllFinishTimeVisibilities(rectBySlot, obsBridge.animateLayout && ["active-runners", "active", "runner-add", "runner-remove", "finish", "finishGeometry", "geometry", "spotlight", "done"].includes(options.reason));

    logObs(options.scheduled ? `Live OBS update: ${options.reason || "change"}.` : "Applied current layout to OBS.");
  } catch (error) {
    logObs(`Apply layout failed: ${error.message}`);
  } finally {
    if (!options.scheduled) setObsUiBusy(false);
  }
  });
}

async function updateInputsForReason(reason = "", rectBySlot = getCurrentRectBySlot()) {
  const manual = !reason || ["manual-layout", "project-load", "undo", "redo", "pending"].includes(reason);
  if (manual || ["background"].includes(reason)) {
    await setInputUrl("Background", htmlDataUrl(buildBackgroundHtml()));
  }
  if (manual || ["raceInfo", "border", "border-image"].includes(reason)) {
    await updateTitleBarInput();
  }
  if (manual || ["border", "border-image", "timerBorder", "timerText", "geometry"].includes(reason)) {
    await updateTimerBorderInput();
  }
  if (manual || ["timerText", "timerBorder", "geometry", "border", "border-image"].includes(reason)) {
    await updateTimerTextInput();
  }
  if (manual || ["finishedScreen", "finish", "done", "active", "active-runners", "runner-add", "runner-remove"].includes(reason)) {
    await setInputUrl("FinishedScreen", htmlDataUrl(buildFinishedScreenHtml()));
  }
  if (manual || ["commentators", "border", "border-image"].includes(reason)) {
    await updateCommentatorsInput();
  }
  if (manual || ["media"].includes(reason)) {
    for (const layer of state.layout.mediaLayers) {
      await updateMediaLayerInput(layer);
    }
  }

  for (const runner of state.runners) {
    if (manual || ["source", "feedMode", "vdo-clean", "feedWidth", "feedHeight"].includes(reason)) {
      await updateRunnerFeedInput(runner);
    } else if (["border", "border-image", "feed-border-visible"].includes(reason)) {
      await updateRunnerFeedClipCss(runner);
    }
    if (manual || ["border", "border-image"].includes(reason)) {
      const borderUrl = withRunnerStyle(runner, () => htmlDataUrl(buildBorderHtml()));
      await setInputUrl(runnerPart(runner.slot, "Border"), borderUrl);
    }
    if (manual || ["name", "nameplate", "nameplate-image", "pronounsText"].includes(reason) || runnerNameSourceSizeReason(reason)) {
      await updateRunnerNameInput(runner, rectBySlot.get(runner.slot));
    }
    if (manual || ["finish", "finishGeometry", "geometry", "spotlight"].includes(reason)) {
      await updateRunnerFinishInput(runner, rectBySlot.get(runner.slot));
    }
    if (manual || reason === "audio") {
      await updateRunnerAudio(runner);
    }
  }
}

function finishAnimStyleName() {
  return state.layout.finishAnimationStyle || "scaleFade";
}

// Whether the given finish-animation style relies on the opacity filter.
function finishAnimStyleUsesFade(styleName = finishAnimStyleName()) {
  return ["moveFade", "scaleFade", "fade", "pop", "settle", "slideSide", "drop", "glow"].includes(styleName);
}

// Compute the transform + opacity for a finish-time source at a given raw
// progress (0..1). `show` reverses the timeline for exits. Returns a rect
// (scaled from centre) plus a 0..1 opacity. All styles are expressed here so
// the OBS animation stays in lock-step with the preview CSS in styles.css.
function getFinishAnimFrame(targetRect, progress, show, styleName = finishAnimStyleName()) {
  const hasFade = obsBridge.opacitySupported;
  const p = clamp01(show ? progress : 1 - progress);
  const ease = easeOutCubic(p);
  const targetX = targetRect.positionX ?? targetRect.x ?? 0;
  const targetY = targetRect.positionY ?? targetRect.y ?? 0;
  const targetW = targetRect.boundsWidth ?? targetRect.width ?? 0;
  const targetH = targetRect.boundsHeight ?? targetRect.height ?? 0;

  let dx = 0;
  let dy = 0;
  let scale = 1;
  let opacity = 1;

  switch (styleName) {
    case "fade":
      opacity = p;
      break;
    case "move":
      dy = (1 - ease) * 24;
      break;
    case "moveFade":
      dy = (1 - ease) * 24;
      opacity = p;
      break;
    case "pop": {
      const back = easeOutBack(p);
      scale = 0.6 + 0.4 * back;
      opacity = Math.min(1, p * 1.6);
      break;
    }
    case "settle": {
      const back = easeOutBack(p);
      dy = 28 * (1 - back);
      opacity = Math.min(1, p * 1.5);
      break;
    }
    case "slideSide": {
      dx = (1 - ease) * 72;
      opacity = p;
      break;
    }
    case "drop": {
      const back = easeOutBack(p);
      dy = -32 * (1 - back);
      opacity = Math.min(1, p * 1.5);
      break;
    }
    case "glow": {
      const pulse = Math.sin(p * Math.PI);
      scale = lerp(0.92, 1, ease) + 0.05 * pulse;
      opacity = p;
      break;
    }
    case "scaleFade":
    default:
      scale = lerp(0.7, 1, ease);
      opacity = p;
      break;
  }

  if (!hasFade) opacity = 1;

  const width = targetW * scale;
  const height = targetH * scale;
  const rect = { ...targetRect };
  rect.positionX = targetX + dx - (width - targetW) / 2;
  rect.x = rect.positionX;
  rect.positionY = targetY + dy - (height - targetH) / 2;
  rect.y = rect.positionY;
  rect.boundsWidth = width;
  rect.width = width;
  rect.boundsHeight = height;
  rect.height = height;
  return { rect, opacity: clamp01(opacity) };
}

async function animateFinishTimeLayout(finishPlans, rectBySlot) {
  const duration = Math.max(80, state.layout.finishAnimationMs || 360);
  const frameMs = Math.max(16, Math.round(1000 / Math.max(15, state.layout.finishAnimationFps || 60)));
  const frames = Math.max(2, Math.ceil(duration / frameMs));
  const styleName = finishAnimStyleName();
  const usesFade = obsBridge.opacitySupported && finishAnimStyleUsesFade(styleName);

  for (const plan of finishPlans) {
    const inputName = runnerPart(plan.runner.slot, "Finish");
    if (plan.willBeVisible) {
      const cachedId = getCachedSceneItemId(`${MANAGED_PREFIX}${inputName}`);
      if (!cachedId) continue;

      const targetRect = absoluteRect(viewportRect(rectBySlot.get(plan.runner.slot), finishGeometry(plan.runner, rectBySlot.get(plan.runner.slot))));
      const frame0 = getFinishAnimFrame(targetRect, 0, true, styleName);
      await setSceneItemTransform(inputName, frame0.rect);
      if (usesFade) {
        await obsCall("SetSourceFilterSettings", {
          sourceName: `${MANAGED_PREFIX}${inputName}`,
          filterName: `${MANAGED_PREFIX}Opacity`,
          filterSettings: { opacity: frame0.opacity },
          overlay: true
        });
      }
      await setSceneItemEnabled(inputName, true);
    }
  }

  for (let frame = 1; frame <= frames; frame += 1) {
    const progress = frame / frames;
    const requests = [];

    for (const plan of finishPlans) {
      const inputName = runnerPart(plan.runner.slot, "Finish");
      const cachedId = getCachedSceneItemId(`${MANAGED_PREFIX}${inputName}`);
      if (!cachedId) continue;

      const targetRect = absoluteRect(viewportRect(rectBySlot.get(plan.runner.slot), finishGeometry(plan.runner, rectBySlot.get(plan.runner.slot))));
      const f = getFinishAnimFrame(targetRect, progress, plan.willBeVisible, styleName);

      requests.push({
        requestType: "SetSceneItemTransform",
        requestData: {
          sceneName: obsBridge.sceneName,
          sceneItemId: cachedId,
          sceneItemTransform: buildSceneItemTransform(f.rect)
        }
      });

      if (usesFade) {
        requests.push({
          requestType: "SetSourceFilterSettings",
          requestData: {
            sourceName: `${MANAGED_PREFIX}${inputName}`,
            filterName: `${MANAGED_PREFIX}Opacity`,
            filterSettings: { opacity: f.opacity },
            overlay: true
          }
        });
      }
    }

    if (requests.length > 0) await obsBatch(requests);
    await delay(frameMs);
  }

  for (const plan of finishPlans) {
    const inputName = runnerPart(plan.runner.slot, "Finish");
    if (!plan.willBeVisible) {
      await setSceneItemEnabled(inputName, false);
    }
    obsBridge.lastFinishVisibility.set(plan.runner.slot, plan.willBeVisible);
  }
}

async function syncAllFinishTimeVisibilities(rectBySlot, animate = false) {
  if (!obsBridge.lastFinishVisibility) {
    obsBridge.lastFinishVisibility = new Map();
  }

  const finishPlans = [];
  for (const runner of state.runners) {
    const wasVisible = obsBridge.lastFinishVisibility.get(runner.slot) ?? false;
    const willBeVisible = rectBySlot.has(runner.slot) && runner.done && state.layout.elements.finishedTime && !uiState.finishedScreenVisible;
    if (wasVisible !== willBeVisible) {
      finishPlans.push({
        runner,
        wasVisible,
        willBeVisible
      });
    }
  }

  if (animate && finishPlans.length > 0) {
    await animateFinishTimeLayout(finishPlans, rectBySlot);
  } else {
    for (const runner of state.runners) {
      const inputName = runnerPart(runner.slot, "Finish");
      const visible = rectBySlot.has(runner.slot) && runner.done && state.layout.elements.finishedTime && !uiState.finishedScreenVisible;
      await setSceneItemEnabled(inputName, visible);
      if (visible) {
        const targetRect = absoluteRect(viewportRect(rectBySlot.get(runner.slot), finishGeometry(runner, rectBySlot.get(runner.slot))));
        await setSceneItemTransform(inputName, targetRect);
        if (obsBridge.opacitySupported) {
          await obsCall("SetSourceFilterSettings", {
            sourceName: `${MANAGED_PREFIX}${inputName}`,
            filterName: `${MANAGED_PREFIX}Opacity`,
            filterSettings: { opacity: 1 },
            overlay: true
          });
        }
      }
      obsBridge.lastFinishVisibility.set(runner.slot, visible);
    }
  }
}

async function applyRunnerLayoutImmediate(rectBySlot, options = {}) {
  for (const runner of state.runners) {
    const rect = rectBySlot.get(runner.slot) ?? hiddenRect();
    const visible = rectBySlot.has(runner.slot);
    if (!visible && isSpotlightHiddenActiveRunner(runner)) {
      const parked = offscreenRect();
      await setRunnerSpotlightHidden(runner.slot);
      await setRunnerTransforms(runner, parked, obsBridge.opacitySupported ? 0 : null);
      rememberObsRunnerState(runner.slot, parked, false);
      continue;
    }
    await setRunnerVisible(runner.slot, visible);
    if (visible && options.refreshVisibleNameSources) {
      await updateRunnerNameInput(runner, rect);
    }
    await setRunnerTransforms(runner, rect, 1);
    rememberObsRunnerState(runner.slot, rect, visible);
  }
}

async function animateRunnerLayout(rectBySlot, options = {}) {
  const duration = Math.max(80, state.layout.animationMs);
  const frameMs = Math.max(16, Math.round(1000 / Math.max(15, state.layout.animationFps)));
  const frames = Math.max(2, Math.ceil(duration / frameMs));
  const style = animationStyleConfig();
  const plans = state.runners.map((runner) => {
    const wasVisible = obsBridge.lastVisibility.get(runner.slot) ?? false;
    const from = obsBridge.lastRects.get(runner.slot) ?? hiddenRect();
    const to = rectBySlot.get(runner.slot) ?? hiddenRect();
    return {
      runner,
      wasVisible,
      willBeVisible: rectBySlot.has(runner.slot),
      from,
      to
    };
  });

  for (const plan of plans) {
    if (!plan.willBeVisible && isSpotlightHiddenActiveRunner(plan.runner)) {
      const parked = offscreenRect();
      await setRunnerSpotlightHidden(plan.runner.slot);
      await setRunnerTransforms(plan.runner, parked, obsBridge.opacitySupported ? 0 : null);
      rememberObsRunnerState(plan.runner.slot, parked, false);
      plan.skipAnimation = true;
      continue;
    }
    if (plan.wasVisible || plan.willBeVisible) {
      await setRunnerVisible(plan.runner.slot, true);
      if (plan.willBeVisible && options.refreshVisibleNameSources) {
        await updateRunnerNameInput(plan.runner, plan.to);
      }
      if (!plan.wasVisible && plan.willBeVisible) {
        await setRunnerTransforms(plan.runner, plan.from, style.usesFade ? 0 : 1);
      }
    }
  }

  for (let frame = 1; frame <= frames; frame += 1) {
    const t = easeOutCubic(frame / frames);
    const requests = [];
    for (const plan of plans) {
      if (plan.skipAnimation || (!plan.wasVisible && !plan.willBeVisible)) continue;
      const rect = animationFrameRect(plan.from, plan.to, t, plan, style);
      const opacity = animationFrameOpacity(t, plan, style);
      requests.push(...runnerTransformRequests(plan.runner, rect, opacity));
    }
    if (requests.length > 0) await obsBatch(requests);
    if (frame < frames) await delay(frameMs);
  }

  for (const plan of plans) {
    if (plan.skipAnimation) continue;
    if (!plan.willBeVisible) {
      await setRunnerVisible(plan.runner.slot, false);
    }
    rememberObsRunnerState(plan.runner.slot, plan.to, plan.willBeVisible);
  }
}

async function setRunnerTransforms(runner, rect, opacity = null) {
  await obsBatch(runnerTransformRequests(runner, rect, opacity));
}

function runnerTransformRequests(runner, rect, opacity = null) {
  const requests = [
    sceneItemTransformRequest(runnerPart(runner.slot, "Border"), rect),
    sceneItemTransformRequest(runnerPart(runner.slot, "Feed"), viewportRect(rect, gameFeedViewportGeometry()), cropPixels(runner.crop)),
    sceneItemTransformRequest(runnerPart(runner.slot, "Name"), viewportRect(rect, nameTransformGeometry())),
    sceneItemTransformRequest(runnerPart(runner.slot, "Finish"), viewportRect(rect, finishGeometry(runner, rect)))
  ];

  if (opacity !== null && obsBridge.opacitySupported) {
    for (const part of RUNNER_PARTS) {
      requests.push(sourceOpacityRequest(runnerPart(runner.slot, part), opacity));
    }
  }

  return requests;
}

function sceneItemTransformRequest(partName, rect, crop = null, options = {}) {
  return {
    requestType: "SetSceneItemTransform",
    requestData: {
      sceneName: obsBridge.sceneName,
      sceneItemId: getCachedSceneItemId(`${MANAGED_PREFIX}${partName}`),
      sceneItemTransform: buildSceneItemTransform(rect, crop, options)
    }
  };
}

function sourceOpacityRequest(partName, opacity) {
  return {
    requestType: "SetSourceFilterSettings",
    requestData: {
      sourceName: `${MANAGED_PREFIX}${partName}`,
      filterName: `${MANAGED_PREFIX}Opacity`,
      filterSettings: { opacity: clamp01(opacity) },
      overlay: true
    }
  };
}

function animationStyleConfig() {
  const style = state.layout.animationStyle;
  const hasFade = obsBridge.opacitySupported && ["moveFade", "scaleFade", "fade", "pop", "spotlightPulse"].includes(style);
  return {
    usesMovement: style !== "fade" || !hasFade,
    usesScale: ["scaleFade", "pop", "spotlightPulse"].includes(style),
    usesFade: hasFade,
    fadesMoving: style === "moveFade",
    settle: style === "settle",
    pop: style === "pop",
    pulse: style === "spotlightPulse"
  };
}

function animationFrameRect(from, to, t, plan, style) {
  if (!style.usesMovement) {
    return t >= 1 && plan.willBeVisible ? to : from;
  }

  if (!style.usesScale) {
    const progress = style.settle ? easeOutBack(t) : t;
    return lerpRect(from, to, progress);
  }

  if (!plan.wasVisible && plan.willBeVisible) {
    const scale = style.pop ? Math.min(1.08, easeOutBack(t)) : Math.max(0.12, t);
    return scaleRectFromCenter(to, scale);
  }

  if (plan.wasVisible && !plan.willBeVisible) {
    return scaleRectFromCenter(from, Math.max(0.12, 1 - t));
  }

  const moved = lerpRect(from, to, t);
  const pulse = style.pulse ? 1 + 0.06 * Math.sin(t * Math.PI) : 1 - 0.08 * Math.sin(t * Math.PI);
  return scaleRectFromCenter(moved, pulse);
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function animationFrameOpacity(t, plan, style) {
  if (!style.usesFade) return 1;
  if (!plan.wasVisible && plan.willBeVisible) return t;
  if (plan.wasVisible && !plan.willBeVisible) return 1 - t;
  if (style.fadesMoving) return 1 - 0.28 * Math.sin(t * Math.PI);
  return 1;
}

function scaleRectFromCenter(rect, scale) {
  const width = rect.width * scale;
  const height = rect.height * scale;
  return {
    x: rect.x + (rect.width - width) / 2,
    y: rect.y + (rect.height - height) / 2,
    width,
    height
  };
}

function scheduleObsApply(reason, delay = 180) {
  if (!obsBridge.autoApply || !obsBridge.connected) return;

  window.clearTimeout(obsBridge.applyTimer);
  obsBridge.applyTimer = window.setTimeout(() => {
    void runScheduledObsApply(reason);
  }, delay);
}

async function runScheduledObsApply(reason) {
  if (!obsBridge.autoApply || !obsBridge.connected) return;

  if (obsBridge.applying) {
    obsBridge.pendingApply = true;
    return;
  }

  obsBridge.applying = true;
  try {
    await applyLayoutToObs({ scheduled: true, reason, refreshInputs: shouldRefreshObsInputs(reason) });
  } finally {
    obsBridge.applying = false;
    if (obsBridge.pendingApply) {
      obsBridge.pendingApply = false;
      scheduleObsApply("pending", 60);
    }
  }
}

function shouldRefreshObsInputs(reason) {
  return [
    "source",
    "feedMode",
    "name",
    "vdo-clean",
    "border",
    "timerText",
    "timerBorder",
    "geometry",
    "finish",
    "finishGeometry",
    "audio",
    "background",
    "media",
    "raceInfo",
    "border-image",
    "feedWidth",
    "feedHeight",
    "nameplate",
    "nameplate-image",
    "pronounsText",
    "active-runners",
    "active",
    "runner-add",
    "runner-remove",
    "aspectPreset",
    "timerHeight",
    "titleHeight",
    "marginLeft",
    "marginRight",
    "gap",
    "spotlight",
    "spotlight-nameplates",
    "feed-visible",
    "feed-border-visible",
    "name-visible",
    "drag-end",
    "project-load",
    "undo",
    "redo"
  ].includes(reason);
}

function shouldAnimateObsLayout(reason) {
  return [
    "active-runners",
    "active",
    "runner-add",
    "runner-remove",
    "runner-order",
    "aspectPreset",
    "timerHeight",
    "titleHeight",
    "marginLeft",
    "marginRight",
    "gap",
    "spotlight",
    "drag-end"
  ].includes(reason);
}

function runnerNameSourceSizeReason(reason) {
  return [
    "active-runners",
    "active",
    "runner-add",
    "runner-remove",
    "runner-order",
    "aspectPreset",
    "timerHeight",
    "titleHeight",
    "marginLeft",
    "marginRight",
    "gap",
    "spotlight",
    "spotlight-nameplates",
    "geometry",
    "drag-end"
  ].includes(reason);
}

function rememberObsRunnerState(slot, rect, visible) {
  obsBridge.lastRects.set(slot, { ...rect });
  obsBridge.lastVisibility.set(slot, visible);
}

function lerpRect(from, to, t) {
  return {
    x: lerp(from.x, to.x, t),
    y: lerp(from.y, to.y, t),
    width: lerp(from.width, to.width, t),
    height: lerp(from.height, to.height, t)
  };
}

function lerp(from, to, t) {
  return from + (to - from) * t;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function runExclusiveObsOperation(operation) {
  if (obsBridge.operationDepth > 0) return operation();
  const run = obsBridge.operationQueue.catch(() => {}).then(async () => {
    obsBridge.operationDepth += 1;
    try {
      return await operation();
    } finally {
      obsBridge.operationDepth -= 1;
    }
  });
  obsBridge.operationQueue = run.catch(() => {});
  return run;
}

async function cleanupObsScene() {
  if (!requireObs()) return;

  return runExclusiveObsOperation(async () => {
    try {
      window.clearTimeout(obsBridge.applyTimer);
      obsBridge.pendingApply = false;
      setObsUiBusy(true);
      logObs("Cleaning up managed ORM__ sources...");
      await cleanupManagedInputs({ keepScene: true });
      obsBridge.itemIds.clear();
      obsBridge.lastRects.clear();
      obsBridge.lastVisibility.clear();
      obsBridge.lastFinishVisibility.clear();
      obsBridge.lastSceneItemEnabled.clear();
      obsBridge.opacitySupported = false;
      logObs("Cleanup complete. Managed scene was left in place.");
    } catch (error) {
      logObs(`Cleanup failed: ${error.message}`);
    } finally {
      setObsUiBusy(false);
    }
  });
}

function setInputValue(root, field, value) {
  const inputs = root.querySelectorAll(`[data-field='${field}']`);
  for (const input of inputs) {
    if (input.type === "checkbox") {
      input.checked = Boolean(value);
    } else if (input.tagName === "SELECT" || input.tagName === "TEXTAREA" || input.type === "text" || input.type === "color") {
      input.value = String(value ?? "");
    } else {
      syncRangeInput(input, value);
    }
  }
}

function syncCropOutputs(root, runner) {
  for (const key of ["left", "top", "right", "bottom"]) {
    for (const input of root.querySelectorAll(`[data-field='crop${capitalize(key)}']`)) {
      input.value = formatCropValue(runner.crop[key]);
    }
  }
}

function syncFeedStatus(root, runner) {
  const status = root.querySelector("[data-role='feedStatus']");
  if (!status) return;

  if (runner.feedMode && runner.feedMode !== "live") {
    status.textContent = feedModeLabel(runner.feedMode);
    status.classList.remove("url");
    return;
  }

  if (isUrl(runner.source)) {
    status.textContent = isVdoNinjaUrl(runner.source) ? "VDO.Ninja browser source" : "Browser source URL";
    status.classList.add("url");
  } else {
    status.textContent = "Generated test pattern";
    status.classList.remove("url");
  }
}

function clampCrop(crop, changedKey) {
  const horizontal = crop.left + crop.right;
  const vertical = crop.top + crop.bottom;

  if (horizontal > 78 && (changedKey === "left" || changedKey === "right")) {
    crop[changedKey] -= horizontal - 78;
  }

  if (vertical > 78 && (changedKey === "top" || changedKey === "bottom")) {
    crop[changedKey] -= vertical - 78;
  }
}

function formatCropValue(value) {
  return Number(value).toFixed(1).replace(/\.0$/, "");
}

function capitalize(value) {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

function update() {
  const activeRunners = getActiveRunners().sort((a, b) => a.placement - b.placement);
  const rectBySlot = getCurrentRectBySlot();
  const previewRectBySlot = getPreviewRectBySlot(rectBySlot);

  document.body.classList.toggle("control-mode", state.layout.viewMode === "control");
  document.body.classList.toggle("edit-mode", state.layout.viewMode !== "control");
  document.body.classList.toggle("layers-locked", Boolean(state.layout.layerLock));
  els.stage.style.setProperty("--timer-height", state.layout.timerHeight);
  const hasBg = Boolean(state.layout.backgroundImage);
  els.stage.classList.toggle("custom-background", hasBg);
  els.stage.style.backgroundImage = hasBg ? `url("${state.layout.backgroundImage}")` : "";
  if (hasBg) {
    const loop = textureLoop(state.layout.backgroundScrollX, state.layout.backgroundScrollY, STAGE.width, STAGE.height, state.layout.backgroundScale);
    if (loop) {
      els.stage.style.setProperty("--orm-bg-scroll-x", `${loop.dx}px`);
      els.stage.style.setProperty("--orm-bg-scroll-y", `${loop.dy}px`);
      els.stage.style.setProperty("--orm-bg-duration", `${loop.duration}s`);
      els.stage.style.setProperty("--orm-bg-scale", `${state.layout.backgroundScale}%`);
    } else {
      els.stage.style.setProperty("--orm-bg-scroll-x", "0px");
      els.stage.style.setProperty("--orm-bg-scroll-y", "0px");
      els.stage.style.setProperty("--orm-bg-duration", "0s");
      els.stage.style.setProperty("--orm-bg-scale", `${state.layout.backgroundScale}%`);
    }
  } else {
    els.stage.style.removeProperty("--orm-bg-scroll-x");
    els.stage.style.removeProperty("--orm-bg-scroll-y");
    els.stage.style.removeProperty("--orm-bg-duration");
    els.stage.style.removeProperty("--orm-bg-scale");
  }
  els.activeCount.textContent = `${activeRunners.length} active`;
  els.layoutSummary.textContent = `${STAGE.width}x${STAGE.height} canvas, ${state.layout.aspectPreset} game frames`;
  syncGeometryControls();
  applyTitleBarPreviewGeometry();
  applyCommentatorsPreviewGeometry();
  applyTimerBorderPreviewGeometry();
  applyTimerTextPreviewGeometry();
  renderMediaLayers();
  applySceneLayerZIndexes();
  renderControlMode();
  renderFinishedScreen();
  renderSceneTree();
  highlightSelectedElement(selection.elementId);

  for (const runner of state.runners) {
    const rect = previewRectBySlot.get(runner.slot) ?? hiddenRect();
    withRunnerStyle(runner, () => applyPanelGeometry(runner, rect, previewRectBySlot.has(runner.slot)));
  }

  schedulePreviewRefresh(previewRectBySlot);
  schedulePreviewRefresh(previewRectBySlot, state.layout.animationMs + 80);
  startPreviewLiveRefresh(previewRectBySlot, state.layout.animationMs + 120);
}

function renderMediaLayers() {
  if (!els.mediaLayer) return;
  const seen = new Set();
  for (const layer of state.layout.mediaLayers) {
    const rects = mediaLayerNormRects(layer);
    rects.forEach((rect, index) => {
      const key = `${layer.id}#${index}`;
      seen.add(key);
      const primary = index === 0;
      let node = els.mediaLayer.querySelector(`[data-media-key='${key}']`);
      if (!node) {
        node = document.createElement("div");
        node.className = primary ? "media-preview drag-target" : "media-preview media-clone";
        node.dataset.mediaKey = key;
        node.dataset.mediaId = layer.id;
        node.dataset.mediaInstance = String(index);
        if (primary) {
          node.dataset.dragTarget = "media";
          node.appendChild(createResizeHandle("media"));
        }
        els.mediaLayer.appendChild(node);
      }
      node.classList.toggle("hidden-element", layer.visible === false);
      node.style.transitionDuration = `${state.layout.animationMs}ms`;
      applyNormalizedStyle(node, rect);

      if (node.dataset.src !== layer.dataUrl || node.dataset.type !== layer.type) {
        const media = document.createElement(layer.type === "video" ? "video" : "img");
        media.src = layer.dataUrl;
        media.alt = layer.name || "Media layer";
        if (layer.type === "video") {
          media.autoplay = true;
          media.loop = true;
          media.muted = true;
          media.playsInline = true;
        }
        const handle = primary ? (node.querySelector(".resize-handle") || createResizeHandle("media")) : null;
        node.replaceChildren(...(handle ? [media, handle] : [media]));
        node.dataset.src = layer.dataUrl;
        node.dataset.type = layer.type;
      }
    });
  }
  for (const node of [...els.mediaLayer.querySelectorAll("[data-media-key]")]) {
    if (!seen.has(node.dataset.mediaKey)) node.remove();
  }
}

function createResizeHandle(kind) {
  const handle = document.createElement("span");
  handle.className = "resize-handle";
  handle.dataset.resizeHandle = kind;
  handle.setAttribute("aria-hidden", "true");
  return handle;
}

function applySceneLayerZIndexes() {
  const order = normalizedLayerOrder();
  const zFor = (id) => Math.max(1, order.indexOf(id) + 1) * 10;
  if (els.mediaLayer) els.mediaLayer.style.zIndex = "auto";
  const map = {
    title: els.titleBarPreview,
    timerText: els.timerTextPreview,
    timerFrame: els.timerBorder,
    commentators: els.commentatorsPreview,
    runners: els.runnerLayer,
    finished: els.finishedScreenLayer
  };
  for (const [id, element] of Object.entries(map)) {
    if (element) element.style.zIndex = zFor(id);
  }
  for (const layer of state.layout.mediaLayers) {
    const z = zFor(mediaNodeId(layer.id));
    for (const node of els.mediaLayer?.querySelectorAll(`[data-media-id='${layer.id}']`) || []) {
      node.style.zIndex = z;
    }
  }
}

function applyTimerBorderPreviewGeometry() {
  const visible = state.layout.timerBorder.enabled && state.layout.elements.timerBorder;
  const stageScale = els.stage.clientWidth / STAGE.width;
  const timerRect = absoluteRect(state.layout.timerBorder);
  els.timerBorder.className = `timer-border drag-target ${state.layout.borderPreset}${visible ? "" : " hidden"}`;
  els.timerBorder.style.cssText = [
    `transition-duration:${state.layout.animationMs}ms`,
    "background:transparent;border:none;box-shadow:none;padding:0;overflow:visible;",
    `border-radius:${frameRadius("timer") * stageScale}px`
  ].join(";");
  applyNormalizedStyle(els.timerBorder, state.layout.timerBorder);
}

function applyTitleBarPreviewGeometry() {
  const config = state.layout.raceInfo;
  const visible = Boolean(state.layout.elements.titleBar);
  const stageScale = els.stage.clientWidth / STAGE.width;
  const sourceWidth = Math.max(1, STAGE.width * config.rect.width);
  const sourceHeight = Math.max(1, STAGE.height * config.rect.height);
  els.titleBarPreview.classList.toggle("hidden-element", !visible);

  const shadowValue = config.shadowEnabled
    ? `${Number(config.shadowX) * stageScale}px ${Number(config.shadowY) * stageScale}px ${Number(config.shadowBlur) * stageScale}px ${config.shadowColor}`
    : "none";
  const strokeCss = config.strokeEnabled && Number(config.strokeWidth) > 0
    ? `-webkit-text-stroke:${Number(config.strokeWidth) * stageScale}px ${config.strokeColor};paint-order:stroke fill;`
    : "";

  els.titleBarPreview.style.cssText = [
    `transition-duration:${state.layout.animationMs}ms`,
    `font-family:${cssFontStack(config.fontFamily)}`,
    `color:${config.textColor}`,
    `font-size:${Math.max(8, Number(config.fontSize) || 34) * stageScale}px`,
    `text-shadow:${shadowValue}`,
    strokeCss,
    raceInfoPlateFrameCss(config, sourceWidth, sourceHeight, stageScale)
  ].join(";");
  els.titleBarPreview.querySelector(".title-main").textContent = config.title;
  const subtitle = els.titleBarPreview.querySelector(".title-sub");
  subtitle.textContent = config.subtitle;
  subtitle.style.color = hexToRgba(config.textColor, 0.68);
  applyNormalizedStyle(els.titleBarPreview, config.rect);
  if (!visible) els.titleBarPreview.style.display = "none";
}

function applyCommentatorsPreviewGeometry() {
  if (!els.commentatorsPreview) return;
  const config = state.layout.commentators;
  const visible = Boolean(config.enabled);
  const stageScale = els.stage.clientWidth / STAGE.width;
  const sourceWidth = Math.max(1, STAGE.width * config.rect.width);
  const sourceHeight = Math.max(1, STAGE.height * config.rect.height);
  els.commentatorsPreview.classList.toggle("hidden-element", !visible);
  els.commentatorsPreview.style.display = visible ? "" : "none";

  els.commentatorsPreview.style.cssText = [
    `position:absolute`,
    `z-index:5`,
    `overflow:visible`,
    `transition-duration:${state.layout.animationMs}ms`,
    `font-family:${cssFontStack(config.fontFamily)}`,
    `color:${config.textColor}`,
    commentatorsPlateCss(config, sourceWidth, sourceHeight, stageScale)
  ].join(";");
  applyNormalizedStyle(els.commentatorsPreview, config.rect);
  if (!visible) els.commentatorsPreview.style.display = "none";

  let content = els.commentatorsPreview.querySelector(".commentators-content");
  if (!content) {
    content = document.createElement("div");
    content.className = "commentators-content";
    els.commentatorsPreview.prepend(content);
  }
  const fontSize = Math.max(8, Number(config.fontSize) || 34) * stageScale;
  const textEffects = commentatorsTextEffectCss(config).replace(/(-?\d+(?:\.\d+)?)px/g, (m, n) => `${Number(n) * stageScale}px`);
  const label = String(config.label || "").trim();
  const names = getCommentatorNames(config);
  const labelHtml = label ? `<span class="c-label" style="font-size:${fontSize * 0.5}px;${textEffects}">${escapeHtml(label)}</span>` : "";
  const namesHtml = names.map((name) => `<strong class="c-name" style="font-size:${fontSize}px;${textEffects}">${escapeHtml(name)}</strong>`)
    .join(`<i class="c-sep" style="font-size:${fontSize * 0.7}px;${textEffects}">&bull;</i>`);
  content.style.transform = `translate(${(Number(config.textX) || 0) * stageScale}px, ${(Number(config.textY) || 0) * stageScale}px)`;
  content.style.gap = `${Math.round(fontSize * 0.12)}px`;
  content.innerHTML = `${labelHtml}<div class="c-names" style="gap:0 ${fontSize * 0.4}px;">${namesHtml}</div>`;
}

function bindCommentatorsControls() {
  const changed = () => { update(); scheduleObsApply("commentators", 120); };
  const bindText = (el, key) => el && el.addEventListener("input", (event) => { pushHistory("commentators"); state.layout.commentators[key] = event.target.value; changed(); });
  const bindNum = (el, key) => el && el.addEventListener("input", (event) => { pushHistory("commentators"); state.layout.commentators[key] = Number(event.target.value); changed(); });
  const bindChk = (el, key) => el && el.addEventListener("change", (event) => { pushHistory("commentators"); state.layout.commentators[key] = event.target.checked; changed(); });
  const bindSelect = (el, key) => el && el.addEventListener("change", (event) => { pushHistory("commentators"); state.layout.commentators[key] = event.target.value; changed(); });
  const bindRange = (el, key, out, suffix) => el && el.addEventListener("input", (event) => { state.layout.commentators[key] = Number(event.target.value); if (out) out.textContent = `${event.target.value}${suffix}`; changed(); });

  bindChk(els.commEnabled, "enabled");
  bindText(els.commLabel, "label");
  if (els.commNames) els.commNames.addEventListener("input", (event) => { pushHistory("commentators"); state.layout.commentators.names = event.target.value.split(/\r?\n/); changed(); });
  bindText(els.commFont, "fontFamily");
  bindNum(els.commFontSize, "fontSize");
  bindText(els.commColor, "textColor");
  bindNum(els.commTextX, "textX");
  bindNum(els.commTextY, "textY");
  bindChk(els.commStrokeEnabled, "strokeEnabled");
  bindText(els.commStrokeColor, "strokeColor");
  bindNum(els.commStrokeWidth, "strokeWidth");
  bindChk(els.commShadowEnabled, "shadowEnabled");
  bindText(els.commShadowColor, "shadowColor");
  bindNum(els.commShadowBlur, "shadowBlur");
  bindNum(els.commShadowX, "shadowX");
  bindNum(els.commShadowY, "shadowY");
  bindChk(els.commShowBox, "showBox");
  bindText(els.commBgColor, "plateBackgroundColor");
  bindRange(els.commBgOpacity, "plateBackgroundOpacity", els.commBgOpacityValue, " %");
  bindText(els.commGradFrom, "plateGradientFrom");
  bindText(els.commGradTo, "plateGradientTo");
  bindNum(els.commPadding, "platePaddingX");

  // Plate mode + fill mode drive which sub-sections are visible.
  if (els.commPlateMode) els.commPlateMode.addEventListener("change", (event) => { pushHistory("commentators"); state.layout.commentators.plateMode = event.target.value; syncCommPlateSections(); changed(); });
  if (els.commFillMode) els.commFillMode.addEventListener("change", (event) => { pushHistory("commentators"); state.layout.commentators.plateFillMode = event.target.value; syncCommPlateSections(); changed(); });
  if (els.commGradAnimate) els.commGradAnimate.addEventListener("change", (event) => { pushHistory("commentators"); state.layout.commentators.plateAnimateGradientAngle = event.target.checked; syncCommPlateSections(); changed(); });

  // Gradient angle: slider + number stay in sync.
  const setGradAngle = (v) => {
    state.layout.commentators.plateGradientAngle = Number(v);
    if (els.commGradAngle) els.commGradAngle.value = v;
    if (els.commGradAngleSlider) els.commGradAngleSlider.value = v;
    changed();
  };
  if (els.commGradAngle) els.commGradAngle.addEventListener("input", (event) => { pushHistory("commentators"); setGradAngle(event.target.value); });
  if (els.commGradAngleSlider) els.commGradAngleSlider.addEventListener("input", (event) => { pushHistory("commentators"); setGradAngle(event.target.value); });
  bindRange(els.commGradSpeed, "plateGradientAngleSpeed", els.commGradSpeedValue, " deg/s");

  // Texture controls.
  bindRange(els.commTextureScale, "plateTextureScale", els.commTextureScaleValue, "%");
  bindRange(els.commTextureX, "plateTextureX", null, "");
  bindRange(els.commTextureY, "plateTextureY", null, "");
  bindRange(els.commTextureScrollX, "plateTextureScrollX", els.commTextureScrollXValue, " px/s");
  bindRange(els.commTextureScrollY, "plateTextureScrollY", els.commTextureScrollYValue, " px/s");

  // Image uploads.
  if (els.commPlateImage) els.commPlateImage.addEventListener("change", (event) => {
    readImageFile(event.target.files?.[0], (dataUrl) => { pushHistory("commentators"); state.layout.commentators.plateImage = dataUrl; changed(); });
  });
  if (els.commClearPlateImage) els.commClearPlateImage.addEventListener("click", () => { pushHistory("commentators"); state.layout.commentators.plateImage = ""; if (els.commPlateImage) els.commPlateImage.value = ""; changed(); });
  if (els.commTextureImage) els.commTextureImage.addEventListener("change", (event) => {
    readImageFile(event.target.files?.[0], (dataUrl) => { pushHistory("commentators"); state.layout.commentators.plateTextureImage = dataUrl; changed(); });
  });
  if (els.commClearTexture) els.commClearTexture.addEventListener("click", () => { pushHistory("commentators"); state.layout.commentators.plateTextureImage = ""; if (els.commTextureImage) els.commTextureImage.value = ""; changed(); });

  if (els.commFontBrowser) els.commFontBrowser.addEventListener("change", (event) => {
    if (!event.target.value) return;
    pushHistory("commentators");
    state.layout.commentators.fontFamily = event.target.value;
    if (els.commFont) els.commFont.value = event.target.value;
    changed();
  });
  if (els.commBrowseFonts) els.commBrowseFonts.addEventListener("click", browseInstalledFonts);
}

function syncCommentatorsControls() {
  const c = state.layout.commentators;
  const setVal = (el, v) => { if (el) el.value = v; };
  const setChk = (el, v) => { if (el) el.checked = Boolean(v); };
  const setOut = (el, v) => { if (el) el.textContent = v; };
  setChk(els.commEnabled, c.enabled);
  setVal(els.commLabel, c.label);
  setVal(els.commNames, Array.isArray(c.names) ? c.names.join("\n") : String(c.names || ""));
  setVal(els.commFont, c.fontFamily);
  setVal(els.commFontSize, c.fontSize);
  setVal(els.commColor, c.textColor);
  setVal(els.commTextX, c.textX);
  setVal(els.commTextY, c.textY);
  setChk(els.commStrokeEnabled, c.strokeEnabled);
  setVal(els.commStrokeColor, c.strokeColor);
  setVal(els.commStrokeWidth, c.strokeWidth);
  setChk(els.commShadowEnabled, c.shadowEnabled);
  setVal(els.commShadowColor, c.shadowColor);
  setVal(els.commShadowBlur, c.shadowBlur);
  setVal(els.commShadowX, c.shadowX);
  setVal(els.commShadowY, c.shadowY);
  setChk(els.commShowBox, c.showBox);
  setVal(els.commPlateMode, c.plateMode);
  setVal(els.commFillMode, c.plateFillMode);
  setVal(els.commBgColor, c.plateBackgroundColor);
  setVal(els.commBgOpacity, c.plateBackgroundOpacity);
  setOut(els.commBgOpacityValue, `${c.plateBackgroundOpacity} %`);
  setVal(els.commGradFrom, c.plateGradientFrom);
  setVal(els.commGradTo, c.plateGradientTo);
  setVal(els.commGradAngle, c.plateGradientAngle);
  setVal(els.commGradAngleSlider, c.plateGradientAngle);
  setChk(els.commGradAnimate, c.plateAnimateGradientAngle);
  setVal(els.commGradSpeed, c.plateGradientAngleSpeed);
  setOut(els.commGradSpeedValue, `${c.plateGradientAngleSpeed} deg/s`);
  setVal(els.commTextureScale, c.plateTextureScale);
  setOut(els.commTextureScaleValue, `${c.plateTextureScale}%`);
  setVal(els.commTextureX, c.plateTextureX);
  setVal(els.commTextureY, c.plateTextureY);
  setVal(els.commTextureScrollX, c.plateTextureScrollX);
  setOut(els.commTextureScrollXValue, `${c.plateTextureScrollX} px/s`);
  setVal(els.commTextureScrollY, c.plateTextureScrollY);
  setOut(els.commTextureScrollYValue, `${c.plateTextureScrollY} px/s`);
  if (els.commPlateImage && !c.plateImage) els.commPlateImage.value = "";
  if (els.commTextureImage && !c.plateTextureImage) els.commTextureImage.value = "";
  setVal(els.commPadding, c.platePaddingX);
  syncCommPlateSections();
}

function syncCommPlateSections() {
  const c = state.layout.commentators;
  for (const section of document.querySelectorAll("[data-comm-plate-section]")) {
    section.hidden = section.dataset.commPlateSection !== c.plateMode;
  }
  for (const section of document.querySelectorAll("[data-comm-plate-fill-section]")) {
    section.hidden = section.dataset.commPlateFillSection !== c.plateFillMode;
  }
  if (els.commGradSpeedRow) {
    els.commGradSpeedRow.hidden = !(c.plateFillMode === "gradient" && c.plateAnimateGradientAngle);
  }
}

function applyTimerTextPreviewGeometry() {
  const config = state.layout.timerText;
  const visible = state.layout.elements.builtInTimer;
  const sourceSize = timerTextSourceSize();
  const stageScale = els.stage.clientWidth / STAGE.width;
  const fontSize = timerEffectiveFontSize(config, sourceSize) * stageScale;
  const timerRect = absoluteRect(state.layout.timerBorder);
  
  els.timerTextPreview.classList.toggle("hidden", !visible);
  els.timerTextPreview.textContent = formatTimerDisplay(currentTimerElapsedMs());

  const strokeCss = config.strokeEnabled && Number(config.strokeWidth) > 0
    ? `-webkit-text-stroke:${Number(config.strokeWidth) * stageScale}px ${config.strokeColor};paint-order:stroke fill;`
    : "";

  const drawPlateInTextPreview = config.showBox;
  els.timerTextPreview.style.cssText = [
    `font-family:${cssFontStack(config.fontFamily)}`,
    `font-size:${fontSize}px`,
    `color:${timerTextColor()}`,
    `text-shadow:${timerTextShadowValue(config, stageScale)}`,
    strokeCss,
    drawPlateInTextPreview ? timerPlateFrameCss(config, timerRect.width, timerRect.height, stageScale) : "background:transparent;border:none;box-shadow:none;padding:0;overflow:visible;"
  ].join(";");

  applyNormalizedStyle(els.timerTextPreview, state.layout.timerBorder);
  els.timerTextPreview.style.overflow = drawPlateInTextPreview ? "hidden" : "visible";
}

function applyNormalizedStyle(element, rect) {
  element.style.left = `${rect.x * 100}%`;
  element.style.top = `${rect.y * 100}%`;
  element.style.width = `${rect.width * 100}%`;
  element.style.height = `${rect.height * 100}%`;
}

function syncGeometryControls() {
  const values = [
    [els.feedX, state.layout.panelGeometry.feed.x],
    [els.feedY, state.layout.panelGeometry.feed.y],
    [els.feedW, state.layout.panelGeometry.feed.width],
    [els.feedH, state.layout.panelGeometry.feed.height],
    [els.nameX, state.layout.panelGeometry.name.x],
    [els.nameY, state.layout.panelGeometry.name.y],
    [els.nameW, state.layout.panelGeometry.name.width],
    [els.nameH, state.layout.panelGeometry.name.height],
    [els.finishX, state.layout.panelGeometry.finish.x],
    [els.finishY, state.layout.panelGeometry.finish.y],
    [els.finishW, state.layout.panelGeometry.finish.width],
    [els.finishH, state.layout.panelGeometry.finish.height],
    [els.titleX, state.layout.raceInfo.rect.x],
    [els.titleY, state.layout.raceInfo.rect.y],
    [els.titleW, state.layout.raceInfo.rect.width],
    [els.titleH, state.layout.raceInfo.rect.height],
    [els.timerX, state.layout.timerBorder.x],
    [els.timerY, state.layout.timerBorder.y],
    [els.timerW, state.layout.timerBorder.width],
    [els.timerH, state.layout.timerBorder.height]
  ];

  for (const [input, value] of values) {
    if (document.activeElement !== input) input.value = round(value);
  }
  if (els.timerBorderEnabled) els.timerBorderEnabled.checked = state.layout.timerBorder.enabled && state.layout.elements.timerBorder;
  if (els.feedVisible) els.feedVisible.checked = state.layout.elements.feed;
  if (els.feedBorderVisible) els.feedBorderVisible.checked = state.layout.elements.feedBorder;
  if (els.nameVisible) els.nameVisible.checked = state.layout.elements.name;
  if (els.finishedTimeVisible) els.finishedTimeVisible.checked = state.layout.elements.finishedTime;
  if (els.titleBarVisible) els.titleBarVisible.checked = state.layout.elements.titleBar;
  if (els.raceInfoEnabled) els.raceInfoEnabled.checked = state.layout.elements.titleBar;
  els.layerLockEnabled.checked = state.layout.layerLock;
  els.snapEnabled.checked = state.layout.snapEnabled;
}

function getCurrentRectBySlot() {
  const activeRunners = getActiveRunners().sort((a, b) => a.placement - b.placement);
  const rects = state.layout.spotlight.enabled
    ? generateSpotlightLayout(activeRunners, state.layout)
    : generateLayout(activeRunners.length, state.layout);
  const rectBySlot = new Map();
  activeRunners.forEach((runner, index) => {
    if (rects[index]) rectBySlot.set(runner.slot, rects[index]);
  });
  return rectBySlot;
}

function getPreviewRectBySlot(rectBySlot) {
  const preview = new Map(rectBySlot);
  const slot = Number(state.layout.setupPreviewSlot);
  if (slot > 0 && !preview.has(slot)) {
    const activeCount = getActiveRunners().length;
    const rects = generateLayout(Math.max(1, activeCount + 1), state.layout);
    preview.set(slot, rects[rects.length - 1] ?? generateLayout(1, state.layout)[0]);
  }
  return preview;
}

function getActiveRunners() {
  return state.runners.filter((runner) => runner.active);
}

function aspectValue(preset) {
  if (preset === "16:9") return 16 / 9;
  return 4 / 3;
}

function rowPattern(count) {
  const patterns = {
    1: [1],
    2: [2],
    3: [2, 1],
    4: [2, 2],
    5: [3, 2],
    6: [3, 3],
    7: [4, 3],
    8: [4, 4],
    9: [3, 3, 3],
    10: [4, 3, 3],
    11: [4, 4, 3],
    12: [4, 4, 4],
    13: [5, 4, 4],
    14: [5, 5, 4],
    15: [5, 5, 5],
    16: [4, 4, 4, 4],
    17: [5, 4, 4, 4],
    18: [5, 5, 4, 4],
    19: [5, 5, 5, 4],
    20: [5, 5, 5, 5]
  };
  return patterns[count] ?? patterns[20];
}

// The usable area for runner panels, inset by the four independent margins.
// The top margin (formerly the reserved title area) always applies, whether or
// not the title bar is enabled.
function layoutAvailableArea(layout) {
  const left = Number(layout.marginLeft) || 0;
  const right = Number(layout.marginRight) || 0;
  const top = Number(layout.titleHeight) || 0;
  const bottom = Number(layout.timerHeight) || 0;
  return {
    x: left,
    y: top,
    width: STAGE.width - left - right,
    height: STAGE.height - top - bottom
  };
}

function generateLayout(count, layout) {
  if (count <= 0) return [];

  const rows = rowPattern(count);
  const aspect = aspectValue(layout.aspectPreset);
  const available = layoutAvailableArea(layout);
  const maxCols = Math.max(...rows);
  const rowCount = rows.length;

  const widthBoundPanelW = (available.width - layout.gap * (maxCols - 1)) / maxCols;
  const heightBoundPanelH = (available.height - layout.gap * (rowCount - 1)) / rowCount;
  const panelW = Math.min(widthBoundPanelW, heightBoundPanelH * aspect);
  const panelH = panelW / aspect;
  const totalH = panelH * rowCount + layout.gap * (rowCount - 1);
  const startY = available.y + (available.height - totalH) / 2;

  const rects = [];
  rows.forEach((cols, row) => {
    const rowW = panelW * cols + layout.gap * (cols - 1);
    const startX = available.x + (available.width - rowW) / 2;
    for (let col = 0; col < cols; col += 1) {
      rects.push({
        x: round(startX + col * (panelW + layout.gap)),
        y: round(startY + row * (panelH + layout.gap)),
        width: round(panelW),
        height: round(panelH)
      });
    }
  });

  return rects.slice(0, count);
}

function generateSpotlightLayout(activeRunners, layout) {
  const requested = parseSlotList(layout.spotlight.slots);
  const spotlight = activeRunners.filter((runner) => requested.has(runner.slot));
  const mainRunners = spotlight.length > 0 ? spotlight : activeRunners.slice(0, 1);
  const others = activeRunners.filter((runner) => !mainRunners.includes(runner));
  const rectsBySlot = new Map();
  const showOthers = Boolean(layout.spotlight.showOthers);
  const side = layout.spotlight.side;
  const spotlightGap = Number(layout.spotlight.gap) || layout.gap;
  const available = layoutAvailableArea(layout);
  const otherBand = showOthers && others.length > 0
    ? Math.max(0.08, Math.min(0.45, Number(layout.spotlight.otherScale) / 100))
    : 0;
  const mainArea = { ...available };
  const otherArea = { ...available };

  if (otherBand > 0 && side === "right") {
    otherArea.x = available.x + available.width * (1 - otherBand) + spotlightGap;
    otherArea.width = available.width * otherBand - spotlightGap;
    mainArea.width = available.width * (1 - otherBand) - spotlightGap;
  } else if (otherBand > 0 && side === "left") {
    otherArea.width = available.width * otherBand - spotlightGap;
    mainArea.x = available.x + available.width * otherBand + spotlightGap;
    mainArea.width = available.width * (1 - otherBand) - spotlightGap;
  } else if (otherBand > 0) {
    otherArea.y = available.y + available.height * (1 - otherBand) + spotlightGap;
    otherArea.height = available.height * otherBand - spotlightGap;
    mainArea.height = available.height * (1 - otherBand) - spotlightGap;
  }

  const mainScale = Math.max(0.55, Math.min(0.92, Number(layout.spotlight.mainScale) / 100 || 0.78));
  const scaledMainArea = scaleAreaFromCenter(mainArea, mainScale);

  fitLayoutIntoArea(mainRunners.length, layout, scaledMainArea).forEach((rect, index) => {
    rectsBySlot.set(mainRunners[index].slot, rect);
  });
  if (showOthers) {
    fitStackLayoutIntoArea(others.length, layout, otherArea, layout.spotlight.stackOrder).forEach((rect, index) => {
      rectsBySlot.set(others[index].slot, rect);
    });
  }

  return activeRunners.map((runner) => rectsBySlot.get(runner.slot));
}

function scaleAreaFromCenter(area, scale) {
  const width = area.width * scale;
  const height = area.height * scale;
  return {
    x: area.x + (area.width - width) / 2,
    y: area.y + (area.height - height) / 2,
    width,
    height
  };
}

function fitStackLayoutIntoArea(count, layout, area, stackOrder) {
  if (count <= 0) return [];
  const rows = stackOrder === "vertical"
    ? Array.from({ length: count }, () => 1)
    : [count];
  return fitRowsIntoArea(rows, layout, area).slice(0, count);
}

function fitLayoutIntoArea(count, layout, area) {
  if (count <= 0) return [];
  const rows = rowPattern(count);
  return fitRowsIntoArea(rows, layout, area).slice(0, count);
}

function fitRowsIntoArea(rows, layout, area) {
  const aspect = aspectValue(layout.aspectPreset);
  const maxCols = Math.max(...rows);
  const rowCount = rows.length;
  const widthBoundPanelW = (area.width - layout.gap * (maxCols - 1)) / maxCols;
  const heightBoundPanelH = (area.height - layout.gap * (rowCount - 1)) / rowCount;
  const panelW = Math.min(widthBoundPanelW, heightBoundPanelH * aspect);
  const panelH = panelW / aspect;
  const totalH = panelH * rowCount + layout.gap * (rowCount - 1);
  const startY = area.y + (area.height - totalH) / 2;
  const rects = [];
  rows.forEach((cols, row) => {
    const rowW = panelW * cols + layout.gap * (cols - 1);
    const startX = area.x + (area.width - rowW) / 2;
    for (let col = 0; col < cols; col += 1) {
      rects.push({
        x: round(startX + col * (panelW + layout.gap)),
        y: round(startY + row * (panelH + layout.gap)),
        width: round(panelW),
        height: round(panelH)
      });
    }
  });
  return rects;
}

function parseSlotList(value) {
  return new Set(String(value)
    .split(/[,\s]+/)
    .map((part) => Number(part))
    .filter((slot) => Number.isInteger(slot) && slot >= 1 && slot <= MAX_RUNNERS));
}

function spotlightMainSlotSet() {
  if (!state.layout.spotlight.enabled) return new Set();
  const activeRunners = getActiveRunners().sort((a, b) => a.placement - b.placement);
  const requested = parseSlotList(state.layout.spotlight.slots);
  const spotlight = activeRunners.filter((runner) => requested.has(runner.slot));
  const mainRunners = spotlight.length > 0 ? spotlight : activeRunners.slice(0, 1);
  return new Set(mainRunners.map((runner) => runner.slot));
}

function isSmallSpotlightSlot(slot) {
  if (!state.layout.spotlight.enabled || !state.layout.spotlight.showOthers) return false;
  const runner = state.runners.find((candidate) => candidate.slot === slot);
  if (!runner?.active) return false;
  return !spotlightMainSlotSet().has(slot);
}

function shouldHideNameplateForSlot(slot) {
  return Boolean(state.layout.spotlight.disableSmallNameplates && isSmallSpotlightSlot(slot));
}

function hiddenRect() {
  return {
    x: STAGE.width / 2 - 10,
    y: STAGE.height / 2 - 10,
    width: 20,
    height: 20
  };
}

function offscreenRect() {
  return {
    x: -10000,
    y: -10000,
    width: 20,
    height: 20
  };
}

function applyPanelGeometry(runner, rect, visible = runner.active) {
  const panel = els.runnerLayer.querySelector(`[data-slot='${runner.slot}']`);
  const viewport = panel.querySelector(".game-viewport");
  const feed = panel.querySelector(".feed-art");
  const nameplate = panel.querySelector(".runner-nameplate");
  const finish = panel.querySelector(".runner-finished-time");

  panel.className = `runner-panel ${state.layout.borderPreset}`;
  panel.classList.toggle("hidden", !visible);
  panel.classList.toggle("setup-preview", visible && !runner.active);
  panel.classList.toggle("runner-done", Boolean(runner.done));
  panel.style.transitionDuration = `${state.layout.animationMs}ms`;
  panel.style.setProperty("--finish-anim-dur", `${state.layout.finishAnimationMs || 360}ms`);
  panel.style.left = `${(rect.x / STAGE.width) * 100}%`;
  panel.style.top = `${(rect.y / STAGE.height) * 100}%`;
  panel.style.width = `${(rect.width / STAGE.width) * 100}%`;
  panel.style.height = `${(rect.height / STAGE.height) * 100}%`;

  const feedGeometry = gameFeedViewportGeometry();
  applyNormalizedStyle(viewport, feedGeometry);
  const stageScale = els.stage.clientWidth / STAGE.width;
  const borderEnabled = state.layout.elements.feedBorder;
  const panelScaleX = rect.width / Math.max(1, Number(state.layout.feedWidth) || 1);
  const panelScaleY = rect.height / Math.max(1, Number(state.layout.feedHeight) || 1);
  const shellRadius = borderEnabled ? scaledFrameRadius("feed", panelScaleX * stageScale, panelScaleY * stageScale) : 0;
  const feedRadius = borderEnabled ? scaledFrameRadius("feed", panelScaleX * stageScale, panelScaleY * stageScale, true) : 0;
  viewport.style.borderRadius = `${feedRadius}px`;
  viewport.style.clipPath = feedRadius > 0 ? `inset(0 round ${feedRadius}px)` : "none";

  const shell = panel.querySelector(".runner-shell");
  shell.style.borderRadius = shellRadius > 0 ? `${shellRadius}px` : "";
  applyNormalizedStyle(nameplate, nameTransformGeometry());
  applyNormalizedStyle(finish, finishGeometry(runner, rect));
  viewport.classList.toggle("hidden-element", !state.layout.elements.feed);
  panel.querySelector(".runner-shell").classList.toggle("hide-border", !state.layout.elements.feedBorder);
  nameplate.classList.toggle("hidden-element", !state.layout.elements.name || shouldHideNameplateForSlot(runner.slot));
  const finishStyle = state.layout.finishAnimationStyle || "scaleFade";
  finish.className = `runner-finished-time drag-target ${finishStyle}`;
  const finishVisible = state.layout.elements.finishedTime && Boolean(displayRunnerFinalTime(runner, true)) && !uiState.finishedScreenVisible;
  finish.classList.toggle("show-finish", finishVisible);
  applyCrop(feed, runner.crop);
  feed.dataset.source = runner.source;
  applyFeedPreview(feed, runner);
  applyFinishedTimePreview(finish, runner, rect);
}

function finishGeometry(runner = null, panelRect = null) {
  const finish = state.layout.panelGeometry.finish;
  const autoSize = finishAutoNormalizedSize(runner, panelRect);
  if (!state.layout.finishedTime.lockToNameplate) {
    const rect = { ...finish, width: autoSize.width, height: autoSize.height };
    normalizeGeometryRect(rect);
    return rect;
  }

  const name = state.layout.panelGeometry.name;
  const baseName = DEFAULT_PANEL_GEOMETRY.name;
  const rect = {
    x: finish.x + (name.x - baseName.x),
    y: finish.y + (name.y - baseName.y),
    width: autoSize.width,
    height: autoSize.height
  };
  normalizeFinishInsideNameplate(rect);
  return rect;
}

function storedFinishGeometry(effectiveRect) {
  if (!state.layout.finishedTime.lockToNameplate) return effectiveRect;

  const name = state.layout.panelGeometry.name;
  const baseName = DEFAULT_PANEL_GEOMETRY.name;
  const rect = {
    x: effectiveRect.x - (name.x - baseName.x),
    y: effectiveRect.y - (name.y - baseName.y),
    width: effectiveRect.width,
    height: effectiveRect.height
  };
  normalizeGeometryRect(rect);
  return rect;
}

function finishAutoNormalizedSize(runner, panelRect) {
  if (!runner || !panelRect) {
    return {
      width: state.layout.panelGeometry.finish.width,
      height: state.layout.panelGeometry.finish.height
    };
  }

  const size = measureFinishedTimeSourceSize(runner);
  const maxWidth = state.layout.finishedTime.lockToNameplate ? state.layout.panelGeometry.name.width : 1;
  const maxHeight = state.layout.finishedTime.lockToNameplate ? state.layout.panelGeometry.name.height : 1;
  return {
    width: clampNumber(size.width / Math.max(1, panelRect.width), 0.01, maxWidth, state.layout.panelGeometry.finish.width),
    height: clampNumber(size.height / Math.max(1, panelRect.height), 0.01, maxHeight, state.layout.panelGeometry.finish.height)
  };
}

function normalizeFinishInsideNameplate(rect) {
  const name = state.layout.panelGeometry.name;
  rect.width = Math.max(0.01, Math.min(name.width, Number(rect.width)));
  rect.height = Math.max(0.01, Math.min(name.height, Number(rect.height)));
  rect.x = Math.max(name.x, Math.min(name.x + name.width - rect.width, Number(rect.x)));
  rect.y = Math.max(name.y, Math.min(name.y + name.height - rect.height, Number(rect.y)));
}

function applyFeedPreview(feed, runner) {
  if (runner.feedMode && runner.feedMode !== "live") {
    feed.querySelector("iframe")?.remove();
    feed.querySelector(".feed-preview-blocked")?.remove();
    feed.classList.remove("url-preview", "blocked-preview");
    feed.classList.add("replacement-preview");
    feed.dataset.replacement = runner.feedMode;
    feed.innerHTML = `<div class="replacement-card"><strong>${escapeHtml(feedModeLabel(runner.feedMode))}</strong><span>${escapeHtml(runner.name)}</span></div>`;
    return;
  }
  feed.classList.remove("replacement-preview");
  feed.removeAttribute("data-replacement");
  feed.querySelector(".replacement-card")?.remove();
  const url = isUrl(runner.source) ? buildFeedUrl(runner) : "";
  let iframe = feed.querySelector("iframe");
  let blocked = feed.querySelector(".feed-preview-blocked");
  const canInlinePreview = url && isInlinePreviewUrl(url);
  feed.classList.toggle("url-preview", Boolean(canInlinePreview));
  feed.classList.toggle("blocked-preview", Boolean(url && !canInlinePreview));
  if (!url) {
    iframe?.remove();
    blocked?.remove();
    return;
  }

  if (!canInlinePreview) {
    iframe?.remove();
    if (!blocked) {
      blocked = document.createElement("div");
      blocked.className = "feed-preview-blocked";
      feed.appendChild(blocked);
    }
    blocked.innerHTML = `<strong>Preview blocked</strong><span>This site refuses browser embedding. OBS will still use the feed URL.</span>`;
    return;
  }

  blocked?.remove();
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.setAttribute("title", `Runner ${runner.slot} feed preview`);
    iframe.setAttribute("allow", "autoplay; fullscreen; microphone; camera");
    iframe.setAttribute("referrerpolicy", "no-referrer");
    feed.appendChild(iframe);
  }
  syncFeedPreviewIframeSize(feed, iframe);
  if (iframe.src !== url) iframe.src = url;
}

function isInlinePreviewUrl(value) {
  if (!isUrl(value)) return false;
  return isVdoNinjaUrl(value);
}

function syncFeedPreviewIframeSize(feed, iframe) {
  const width = Math.max(1, Number(state.layout.feedWidth) || 1920);
  const height = Math.max(1, Number(state.layout.feedHeight) || 1080);
  const scaleX = feed.clientWidth / width;
  const scaleY = feed.clientHeight / height;
  iframe.style.width = `${width}px`;
  iframe.style.height = `${height}px`;
  iframe.style.transform = `scale(${scaleX}, ${scaleY})`;
}

function schedulePreviewRefresh(rectBySlot = getCurrentRectBySlot(), delay = 0) {
  const rectSnapshot = new Map(rectBySlot);
  if (delay > 0) {
    window.clearTimeout(previewRefreshTimer);
    previewRefreshTimer = window.setTimeout(() => schedulePreviewRefresh(rectSnapshot), delay);
    return;
  }

  window.cancelAnimationFrame(previewRefreshFrame);
  previewRefreshFrame = window.requestAnimationFrame(() => {
    syncStageSize();
    window.requestAnimationFrame(() => refreshMeasuredPreviews(rectSnapshot));
  });
}

function refreshMeasuredPreviews(rectBySlot) {
  syncDynamicPreviewStyles();
  applyBorderPreview(els.timerBorder, "timer");
  applyBorderPreview(els.titleBarPreview, "title");
  if (els.commentatorsPreview && state.layout.commentators.enabled) applyBorderPreview(els.commentatorsPreview, "commentators");

  for (const runner of state.runners) {
    const panel = els.runnerLayer.querySelector(`[data-slot='${runner.slot}']`);
    if (!panel) continue;
    const rect = rectBySlot.get(runner.slot) ?? hiddenRect();
    withRunnerStyle(runner, () => {
      applyBorderPreview(panel.querySelector(".runner-shell"), "feed");
      applyNameplatePreview(panel.querySelector(".runner-nameplate"), runner, rect);
      applyFinishedTimePreview(panel.querySelector(".runner-finished-time"), runner, rect);
    });
  }
}

function syncDynamicPreviewStyles() {
  let style = document.getElementById("dynamicPreviewStyles");
  if (!style) {
    style = document.createElement("style");
    style.id = "dynamicPreviewStyles";
    document.head.appendChild(style);
  }
  style.textContent = [
    borderAnimationCss(getBorderStyle("feed"), state.layout.feedWidth, state.layout.feedHeight),
    borderAnimationCss(getBorderStyle("timer"), timerBorderSourceSize().width, timerBorderSourceSize().height),
    borderAnimationCss(getBorderStyle("title"), STAGE.width * state.layout.raceInfo.rect.width, STAGE.height * state.layout.raceInfo.rect.height),
    borderAnimationCss(getBorderStyle("commentators"), commentatorsSourceSize().width, commentatorsSourceSize().height),
    nameplateAnimationCss(state.layout.commentators, commentatorsSourceSize().width, commentatorsSourceSize().height, "ormCommentatorsTexture"),
    nameplateAnimationCss(state.layout.raceInfo, STAGE.width * state.layout.raceInfo.rect.width, STAGE.height * state.layout.raceInfo.rect.height, "ormRaceInfoTexture"),
    nameplateAnimationCss(state.layout.timerText, timerTextSourceSize().width, timerTextSourceSize().height, "ormTimerTexture")
  ].join("\n");
}

function startPreviewLiveRefresh(rectBySlot, duration) {
  previewLiveRefreshUntil = performance.now() + Math.max(0, duration);
  const rectSnapshot = new Map(rectBySlot);
  window.cancelAnimationFrame(previewLiveRefreshFrame);

  const tick = () => {
    refreshMeasuredPreviews(rectSnapshot);
    if (performance.now() < previewLiveRefreshUntil) {
      previewLiveRefreshFrame = window.requestAnimationFrame(tick);
    }
  };

  previewLiveRefreshFrame = window.requestAnimationFrame(tick);
}

function applyBorderPreview(element, targetOrTimer) {
  let preview = element.querySelector(".border-preview-frame");
  if (!preview) {
    preview = document.createElement("div");
    preview.className = "border-preview-frame";
    preview.setAttribute("aria-hidden", "true");
    element.prepend(preview);
  }

  const target = typeof targetOrTimer === "string" ? targetOrTimer : targetOrTimer ? "timer" : "feed";
  const sourceSize = target === "timer"
    ? timerBorderSourceSize()
    : target === "title"
      ? titleBarSourceSize()
      : target === "commentators"
        ? commentatorsSourceSize()
        : { width: state.layout.feedWidth, height: state.layout.feedHeight };
  const previewWidth = Math.max(1, element.clientWidth);
  const previewHeight = Math.max(1, element.clientHeight);
  const basePreviewStyle = `width:${sourceSize.width}px;height:${sourceSize.height}px;transform:scale(${previewWidth / sourceSize.width}, ${previewHeight / sourceSize.height});`;

  const image = getBorderImage(target);
  if (image) {
    preview.style.cssText = `${basePreviewStyle}position:absolute;left:0;top:0;background-color:transparent;background-image:url("${escapeCssString(image)}");background-size:100% 100%;background-repeat:no-repeat;`;
  } else {
    preview.style.cssText = `${basePreviewStyle}${borderFrameCss(target === "timer", getBorderStyle(target), sourceSize.width, sourceSize.height)}`;
  }
}

function applyNameplatePreview(nameplate, runner, rect) {
  let frame = nameplate.querySelector(".nameplate-preview-frame");
  if (!frame) {
    frame = document.createElement("div");
    frame.className = "nameplate-preview-frame";
    frame.setAttribute("aria-hidden", "true");
    nameplate.prepend(frame);
  }

  const config = state.layout.nameplate;
  const sourceSize = nameSourceSize(rect);
  const previewWidth = Math.max(1, nameplate.clientWidth);
  const previewHeight = Math.max(1, nameplate.clientHeight);
  const plateImage = config.showBox && config.plateMode === "image" && config.plateImage
    ? `<img class="plate-art" src="${escapeAttribute(config.plateImage)}" alt="">`
    : "";
  // While the pronoun text element is selected, show pronouns in the preview even
  // if they're disabled or unset (using an example) so they can be positioned.
  const editingPronouns = selection.elementId === "pronounsText";
  const pronounsText = getRunnerPronouns(runner);
  const pronounsDisplay = pronounsText || (editingPronouns ? EXAMPLE_PRONOUNS : "");
  const showPronouns = pronounsDisplay && (state.layout.pronounsText.enabled || editingPronouns);
  const pronounsContentMarkup = showPronouns
    ? `<div class="pronouns-content" title="Drag the pronouns to move them inside the nameplate"><strong class="pronouns-text-drag" data-drag-target="pronounsText">${escapeHtml(pronounsDisplay)}</strong></div>`
    : "";
  // Runner icon: shown when the runner has one, or (preview only) as a
  // placeholder while "Runner Icons" is selected so its position can be set.
  const editingIcon = selection.elementId === "runnerIcon";
  const iconVisible = state.layout.elements.runnerIcon !== false;
  let iconSrc = "";
  if (runner.icon && iconVisible) iconSrc = runner.icon;
  else if (editingIcon) iconSrc = runner.icon || DEFAULT_RUNNER_ICON_PLACEHOLDER; // position even when hidden/empty
  const iconRect = state.layout.runnerIcon?.rect || DEFAULT_RUNNER_ICON_RECT;
  // z-index keeps the icon above the name text/SVG so it always wins the click
  // (otherwise the drag falls through to the nameplate).
  const iconMarkup = iconSrc
    ? `<img class="runner-icon-drag${editingIcon ? " scene-selected" : ""}" data-drag-target="runnerIcon" src="${escapeAttribute(iconSrc)}" alt="" style="position:absolute;left:${iconRect.x * 100}%;top:${iconRect.y * 100}%;width:${iconRect.width * 100}%;height:${iconRect.height * 100}%;object-fit:contain;z-index:5;pointer-events:auto;">`
    : "";
  const nameContentMarkup = state.layout.elements.nameText === false
    ? ""
    : `<div class="name-content" title="Drag the text to move it inside the nameplate"><strong class="name-text-drag" data-drag-target="nameText">${escapeHtml(runner.name)}</strong></div>`;
  const markup = `${plateImage}${nameTextSvgMarkup(runner, sourceSize)}${pronounsTextSvgMarkup(runner, sourceSize, { forceShow: editingPronouns, placeholder: EXAMPLE_PRONOUNS })}${nameContentMarkup}${pronounsContentMarkup}${iconMarkup}`;
  const markupChanged = frame.dataset.markup !== markup;
  if (markupChanged) {
    frame.dataset.markup = markup;
    frame.innerHTML = markup;
  }

  const scaleX = previewWidth / sourceSize.width;
  const scaleY = previewHeight / sourceSize.height;
  const styleString = `${sourceSize.width}|${sourceSize.height}|${scaleX}|${scaleY}|${runner.name}|${pronounsText}|${JSON.stringify(config)}|${JSON.stringify(state.layout.pronounsText)}`;
  // Re-apply child styling whenever the markup is rebuilt too: replacing innerHTML
  // recreates the draggable overlay <strong>, which must be re-hidden or its
  // visible text stacks on top of the SVG as a duplicate at the default size.
  if (markupChanged || frame.dataset.styleString !== styleString) {
    frame.dataset.styleString = styleString;
    frame.style.cssText = `${nameplateFrameCss(config, sourceSize.width, sourceSize.height)}font-family:${cssFontStack(config.fontFamily)};color:${config.textColor};text-rendering:geometricPrecision;-webkit-font-smoothing:antialiased;font-stretch:normal;letter-spacing:0;transform:scale(${scaleX}, ${scaleY});`;

    const content = frame.querySelector(".name-content");
    if (content) content.style.cssText = nameplateContentCss(config, sourceSize);
    const strong = frame.querySelector(".name-text-drag");
    const fontLimit = nameTextIsUnframed() ? `${config.fontSize}px` : `${sourceSize.height * NAME_FONT_HEIGHT_RATIO}px`;
    if (strong) strong.style.cssText = `${nameplateStrongCss(config, fontLimit)}color:transparent;text-shadow:none;-webkit-text-stroke:0 transparent;`;

    const pronounsContent = frame.querySelector(".pronouns-content");
    if (pronounsContent) pronounsContent.style.cssText = pronounsplateContentCss(state.layout.pronounsText, sourceSize);
    const pronounsStrong = frame.querySelector(".pronouns-text-drag");
    const pronounsFontLimit = nameTextIsUnframed() ? `${state.layout.pronounsText.fontSize}px` : `${sourceSize.height * NAME_FONT_HEIGHT_RATIO}px`;
    if (pronounsStrong) pronounsStrong.style.cssText = `${pronounsplateStrongCss(state.layout.pronounsText, pronounsFontLimit)}color:transparent;text-shadow:none;-webkit-text-stroke:0 transparent;`;
  }
}

function applyFinishedTimePreview(element, runner, rect) {
  const frame = element.querySelector(".finish-preview-frame");
  if (!frame) return;
  const text = displayRunnerFinalTime(runner, true);
  const sourceSize = finishSourceSize(runner, rect);
  const previewWidth = Math.max(1, element.clientWidth);
  const previewHeight = Math.max(1, element.clientHeight);
  const markup = finishTextSvgMarkup(runner, sourceSize, text);
  if (frame.dataset.markup !== markup) {
    frame.dataset.markup = markup;
    frame.innerHTML = markup;
  }

  const scaleX = previewWidth / sourceSize.width;
  const scaleY = previewHeight / sourceSize.height;
  const styleString = `${sourceSize.width}|${sourceSize.height}|${scaleX}|${scaleY}|${state.layout.finishedTime.fontFamily}`;
  if (frame.dataset.styleString !== styleString) {
    frame.dataset.styleString = styleString;
    frame.style.cssText = `position:absolute;left:0;top:0;width:${sourceSize.width}px;height:${sourceSize.height}px;display:block;overflow:hidden;box-sizing:border-box;transform-origin:0 0;transform:scale(${scaleX}, ${scaleY});font-family:${cssFontStack(state.layout.finishedTime.fontFamily)};`;
  }
}

function applyCrop(feed, crop) {
  const visibleW = Math.max(8, 100 - crop.left - crop.right);
  const visibleH = Math.max(8, 100 - crop.top - crop.bottom);
  const width = 10000 / visibleW;
  const height = 10000 / visibleH;

  feed.style.left = `${-(crop.left / visibleW) * 100}%`;
  feed.style.top = `${-(crop.top / visibleH) * 100}%`;
  feed.style.width = `${width}%`;
  feed.style.height = `${height}%`;
}

function buildObsPayload(rectBySlot) {
  return {
    scene: obsBridge.sceneName,
    canvas: STAGE,
    layout: {
      aspectPreset: state.layout.aspectPreset,
      timerHeight: state.layout.timerHeight,
      titleHeight: state.layout.titleHeight,
      marginLeft: state.layout.marginLeft,
      marginRight: state.layout.marginRight,
      gap: state.layout.gap,
      animationMs: state.layout.animationMs,
      animationFps: state.layout.animationFps,
      animationStyle: state.layout.animationStyle,
      feedWidth: state.layout.feedWidth,
      feedHeight: state.layout.feedHeight,
      panelGeometry: structuredClone(state.layout.panelGeometry),
      timerBorder: { ...state.layout.timerBorder }
    },
    theme: {
      borderPreset: state.layout.borderPreset,
      borderStyles: structuredClone(state.layout.borderStyles),
      hasCustomBorderImage: {
        feed: Boolean(state.layout.borderImages.feed),
        timer: Boolean(state.layout.borderImages.timer),
        title: Boolean(state.layout.borderImages.title)
      },
      hasBackgroundImage: Boolean(state.layout.backgroundImage),
      nameplate: structuredClone(state.layout.nameplate)
    },
    timerBorder: {
      source: `${MANAGED_PREFIX}TimerBorder`,
      visible: state.layout.timerBorder.enabled,
      transform: absoluteRect(state.layout.timerBorder)
    },
    commands: state.runners.map((runner) => {
      const rect = rectBySlot.get(runner.slot);
      return {
        panel: `Runner ${String(runner.slot).padStart(2, "0")} Panel`,
        visible: runner.active,
        source: runner.source,
        feed: {
          type: isUrl(runner.source) ? "browser_url" : "test_pattern",
          url: buildFeedUrl(runner),
          width: state.layout.feedWidth,
          height: state.layout.feedHeight
        },
        name: runner.name,
        placement: runner.placement,
        cropPercent: { ...runner.crop },
        transform: rect
          ? {
              positionX: rect.x,
              positionY: rect.y,
              boundsWidth: rect.width,
              boundsHeight: rect.height
            }
          : null
      };
    })
  };
}

function requireObs() {
  if (obsBridge.connected && obsBridge.client) return true;
  logObs("Connect to OBS first.");
  return false;
}

function setObsConnected(connected) {
  els.connectionState.textContent = connected ? "Connected" : "Disconnected";
  els.obsStatus.textContent = connected ? `OBS bridge: ${obsBridge.sceneName}` : "OBS bridge: preview mode";
  els.obsStatus.classList.toggle("connected", connected);
}

function setObsUiBusy(busy) {
  for (const button of [els.connectObs, els.createObsScene, els.applyObsLayout, els.cleanupObsScene]) {
    button.disabled = busy;
  }
}

function setObsLogBusy(busy) {
  els.obsLog.classList.toggle("busy", busy);
  els.obsLog.setAttribute("aria-busy", busy ? "true" : "false");
}

function logObs(message) {
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  els.obsLog.textContent = `[${time}] ${message}`;
}

function buildConnectionAttempts(host, port) {
  const hosts = [host];
  if (host.toLowerCase() === "localhost") hosts.push("127.0.0.1");
  if (host === "127.0.0.1") hosts.push("localhost");

  const uniqueHosts = [...new Set(hosts)];
  const attempts = [];

  for (const candidateHost of uniqueHosts) {
    const url = `ws://${candidateHost}:${port}`;
    attempts.push({ url, protocol: "", label: url });
    attempts.push({ url, protocol: "obswebsocket.json", label: `${url} using obswebsocket.json` });
  }

  return attempts;
}

async function obsCall(requestType, requestData = {}) {
  return obsBridge.client.call(requestType, requestData);
}

async function obsBatch(requests) {
  if (requests.length === 0) return {};
  return obsBridge.client.batch(requests);
}

async function ensureScene(sceneName) {
  try {
    await obsCall("CreateScene", { sceneName });
    logObs(`Created scene ${sceneName}.`);
  } catch (error) {
    if (!/already exists|ResourceAlreadyExists|exists/i.test(error.message)) throw error;
    logObs(`Using existing scene ${sceneName}.`);
  }
}

async function cleanupManagedInputs() {
  const names = await discoverManagedInputNames();
  const nameSet = new Set(names);
  try {
    const response = await obsCall("GetSceneItemList", { sceneName: obsBridge.sceneName });
    const disableRequests = (response.sceneItems || [])
      .filter((item) => nameSet.has(item.sourceName))
      .map((item) => ({
        requestType: "SetSceneItemEnabled",
        requestData: {
          sceneName: obsBridge.sceneName,
          sceneItemId: item.sceneItemId,
          sceneItemEnabled: false
        }
      }));
    if (disableRequests.length > 0) {
      await obsBatch(disableRequests);
      await delay(350);
    }
  } catch (error) {
    logObs(`Could not pre-disable managed scene items: ${error.message}`);
  }

  for (const inputName of names) {
    try {
      await obsCall("RemoveInput", { inputName });
      await delay(35);
    } catch (error) {
      if (!/not found|ResourceNotFound|does not exist/i.test(error.message)) {
        logObs(`Could not remove ${inputName}: ${error.message}`);
      }
    }
  }
  if (names.length > 0) await delay(250);
}

async function discoverManagedInputNames() {
  try {
    const response = await obsCall("GetInputList");
    const discovered = response.inputs
      .map((input) => input.inputName)
      .filter((name) => name.startsWith(MANAGED_PREFIX));
    return [...new Set([...managedInputNames(), ...discovered])];
  } catch {
    return managedInputNames();
  }
}

function managedInputNames() {
  const names = GLOBAL_PARTS.map((part) => `${MANAGED_PREFIX}${part}`);
  for (const layer of state.layout.mediaLayers) {
    // Include every possible instance name so shared-parent copies are cleaned
    // up even when the active-runner count changed since they were created.
    for (let i = 0; i < mediaLayerMaxInstances(layer); i += 1) {
      names.push(`${MANAGED_PREFIX}${mediaInstancePartName(layer, i)}`);
    }
  }
  for (const runner of state.runners) {
    for (const part of RUNNER_PARTS) {
      names.push(runnerPart(runner.slot, part));
    }
  }
  return names;
}

async function createRunnerObsInputs(runner, rect = null) {
  const built = withRunnerStyle(runner, () => ({
    nameSize: nameSourceSize(rect),
    nameUrl: htmlDataUrl(buildNameHtml(runner, rect)),
    borderUrl: htmlDataUrl(buildBorderHtml()),
    finishSize: finishSourceSize(runner, rect),
    finishUrl: htmlDataUrl(buildFinishHtml(runner))
  }));
  await createBrowserInput(runnerPart(runner.slot, "Feed"), obsBridge.sceneName, buildFeedUrl(runner), state.layout.feedWidth, state.layout.feedHeight, runner.active, { rerouteAudio: true });
  await createBrowserInput(runnerPart(runner.slot, "Border"), obsBridge.sceneName, built.borderUrl, state.layout.feedWidth, state.layout.feedHeight, runner.active);
  await createBrowserInput(runnerPart(runner.slot, "Name"), obsBridge.sceneName, built.nameUrl, built.nameSize.width, built.nameSize.height, runner.active);
  await createBrowserInput(runnerPart(runner.slot, "Finish"), obsBridge.sceneName, built.finishUrl, built.finishSize.width, built.finishSize.height, runner.active && runner.done);
  await updateRunnerAudio(runner);
}

async function createBrowserInput(partName, sceneName, url, width, height, enabled, options = {}) {
  const inputName = `${MANAGED_PREFIX}${partName}`;
  
  let css = "html, body { background: rgba(0, 0, 0, 0) !important; overflow: hidden; }";
  if (partName.includes("Feed")) {
    css = runnerFeedBrowserCss();
  }

  let sceneItemId;
  try {
    const response = await obsCall("CreateInput", {
      sceneName,
      inputName,
      inputKind: "browser_source",
      inputSettings: {
        url,
        width,
        height,
        css,
        reroute_audio: Boolean(options.rerouteAudio),
        shutdown: false,
        restart_when_active: false
      },
      sceneItemEnabled: enabled
    });
    sceneItemId = response.sceneItemId;
  } catch (error) {
    if (/already exists|ResourceAlreadyExists/i.test(error.message)) {
      // Input exists globally, add it to the scene
      const response = await obsCall("CreateSceneItem", {
        sceneName,
        sourceName: inputName,
        sceneItemEnabled: enabled
      });
      sceneItemId = response.sceneItemId;
      
      // Update settings of the existing source
      await obsCall("SetInputSettings", {
        inputName,
        inputSettings: { url, width, height, css },
        overlay: true
      });
    } else {
      throw error;
    }
  }

  if (sceneItemId !== undefined) {
    obsBridge.itemIds.set(inputName, sceneItemId);
  }
  obsBridge.lastSceneItemEnabled.set(inputName, Boolean(enabled));
  return inputName;
}

async function ensureOpacityFilters() {
  let allSupported = true;

  for (const runner of state.runners) {
    if (!runner.active) continue; // Only check/create for active runners to prevent non-existent sources from failing the check!
    for (const part of RUNNER_PARTS) {
      const sourceName = `${MANAGED_PREFIX}${runnerPart(runner.slot, part)}`;
      const created = await ensureOpacityFilter(sourceName);
      allSupported = allSupported && created;
    }
  }

  if (!allSupported) {
    logObs("Opacity filters were not available for active sources. Fade presets will fall back to movement/scale.");
  }

  return allSupported;
}

async function ensureOpacityFilter(sourceName) {
  const filterName = `${MANAGED_PREFIX}Opacity`;
  for (const filterKind of ["color_filter_v2", "color_filter"]) {
    try {
      await obsCall("CreateSourceFilter", {
        sourceName,
        filterName,
        filterKind,
        filterSettings: { opacity: 1 }
      });
      return true;
    } catch (error) {
      if (/already exists|ResourceAlreadyExists|exists/i.test(error.message)) {
        await setSourceOpacity(sourceName, 1);
        return true;
      }
      if (!/kind|filter|not found|invalid/i.test(error.message)) break;
    }
  }

  return false;
}

async function setSourceOpacity(sourceName, opacity) {
  try {
    await obsCall("SetSourceFilterSettings", {
      sourceName,
      filterName: `${MANAGED_PREFIX}Opacity`,
      filterSettings: { opacity: clamp01(opacity) },
      overlay: true
    });
  } catch {
    // Opacity filters are optional; movement animation still works without them.
  }
}

async function updateRunnerInputs(runner, rect = null) {
  await updateRunnerFeedInput(runner);
  await setInputUrl(runnerPart(runner.slot, "Border"), withRunnerStyle(runner, () => htmlDataUrl(buildBorderHtml())));
  await updateRunnerNameInput(runner, rect);
  await updateRunnerFinishInput(runner, rect);
  await updateRunnerAudio(runner);
}

async function updateRunnerFeedInput(runner) {
  await setBrowserInputSettings(runnerPart(runner.slot, "Feed"), {
    url: buildFeedUrl(runner),
    width: state.layout.feedWidth,
    height: state.layout.feedHeight,
    css: runnerFeedBrowserCss(),
    reroute_audio: true
  });
}

async function updateRunnerFeedClipCss(runner) {
  await setBrowserInputSettings(runnerPart(runner.slot, "Feed"), {
    css: runnerFeedBrowserCss()
  });
}

function runnerFeedBrowserCss() {
  const feedRadius = runnerFeedClipRadius();
  return `html, body { background: rgba(0, 0, 0, 0) !important; overflow: hidden !important; border-radius: ${feedRadius}px !important; clip-path: inset(0 round ${feedRadius}px) !important; background-clip: padding-box !important; transform: translate3d(0, 0, 0) !important; position: absolute !important; inset: 0 !important; width: 100% !important; height: 100% !important; }`;
}

function runnerFeedClipRadius() {
  return state.layout.elements.feedBorder ? innerFrameRadius("feed") : 0;
}

async function updateRunnerNameInput(runner, rect = null) {
  const built = withRunnerStyle(runner, () => ({
    size: nameSourceSize(rect),
    url: htmlDataUrl(buildNameHtml(runner, rect))
  }));
  await setBrowserInputSettings(runnerPart(runner.slot, "Name"), {
    url: built.url,
    width: built.size.width,
    height: built.size.height
  });
}

async function updateRunnerFinishInput(runner, rect = null) {
  const built = withRunnerStyle(runner, () => ({
    size: finishSourceSize(runner, rect),
    url: htmlDataUrl(buildFinishHtml(runner))
  }));
  await setBrowserInputSettings(runnerPart(runner.slot, "Finish"), {
    url: built.url,
    width: built.size.width,
    height: built.size.height
  });
}

async function setBrowserInputSettings(partName, settings) {
  const inputName = `${MANAGED_PREFIX}${partName}`;
  try {
    await obsCall("SetInputSettings", {
      inputName,
      inputSettings: settings,
      overlay: true
    });
  } catch (error) {
    if (!/not found|ResourceNotFound|does not exist/i.test(error.message)) throw error;
  }
}

async function updateRunnerAudio(runner) {
  const inputName = `${MANAGED_PREFIX}${runnerPart(runner.slot, "Feed")}`;
  try {
    await obsCall("SetInputMute", {
      inputName,
      inputMuted: Boolean(runner.audioMuted)
    });
  } catch (error) {
    if (!/not found|ResourceNotFound|does not exist/i.test(error.message)) {
      logObs(`Could not set audio mute for runner ${runner.slot}: ${error.message}`);
    }
  }

  try {
    await obsCall("SetInputVolume", {
      inputName,
      inputVolumeMul: clampNumber(runner.audioVolume, 0, 200, 100) / 100
    });
  } catch (error) {
    if (!/not found|ResourceNotFound|does not exist/i.test(error.message)) {
      logObs(`Could not set audio volume for runner ${runner.slot}: ${error.message}`);
    }
  }
}

async function setInputUrl(partName, url) {
  const inputName = `${MANAGED_PREFIX}${partName}`;
  try {
    await obsCall("SetInputSettings", {
      inputName,
      inputSettings: { url },
      overlay: true
    });
  } catch (error) {
    if (!/not found|ResourceNotFound|does not exist/i.test(error.message)) throw error;
  }
}

async function setRunnerVisible(slot, visible) {
  await setSceneItemEnabled(runnerPart(slot, "Feed"), visible && state.layout.elements.feed);
  await setSceneItemEnabled(runnerPart(slot, "Border"), visible && state.layout.elements.feedBorder);
  await setSceneItemEnabled(runnerPart(slot, "Name"), visible && state.layout.elements.name && !shouldHideNameplateForSlot(slot));
}

function isSpotlightHiddenActiveRunner(runner) {
  return Boolean(runner?.active && state.layout.spotlight.enabled && !state.layout.spotlight.showOthers);
}

async function setRunnerSpotlightHidden(slot) {
  await setSceneItemEnabled(runnerPart(slot, "Feed"), state.layout.elements.feed);
  await setSceneItemEnabled(runnerPart(slot, "Border"), false);
  await setSceneItemEnabled(runnerPart(slot, "Name"), false);
  await setSceneItemEnabled(runnerPart(slot, "Finish"), false);
}

async function ensureRunnerItemIds() {
  for (const part of GLOBAL_PARTS) {
    try {
      await getSceneItemId(`${MANAGED_PREFIX}${part}`);
    } catch (e) {
      logObs(`Failed to get ID for global part ${part}: ${e.message}`);
    }
  }
  for (const runner of state.runners) {
    for (const part of RUNNER_PARTS) {
      try {
        await getSceneItemId(`${MANAGED_PREFIX}${runnerPart(runner.slot, part)}`);
      } catch (e) {
        logObs(`Failed to get ID for runner ${runner.slot} part ${part}: ${e.message}`);
      }
    }
  }
}

async function ensureManagedGlobalSources() {
  const timerTextSize = timerTextSourceSize();
  const titleSize = titleBarSourceSize();
  const globals = [
    ["Background", htmlDataUrl(buildBackgroundHtml()), STAGE.width, STAGE.height, true],
    ["TitleBar", htmlDataUrl(buildTitleBarHtml()), titleSize.width, titleSize.height, state.layout.elements.titleBar],
    ["TimerBorder", htmlDataUrl(buildTimerBorderHtml()), timerBorderSourceSize().width, timerBorderSourceSize().height, state.layout.timerBorder.enabled && state.layout.elements.timerBorder],
    ["TimerText", htmlDataUrl(buildTimerTextHtml()), timerTextSize.width, timerTextSize.height, state.layout.elements.builtInTimer],
    ["Commentators", htmlDataUrl(buildCommentatorsHtml()), commentatorsSourceSize().width, commentatorsSourceSize().height, state.layout.commentators.enabled],
    ["FinishedScreen", htmlDataUrl(buildFinishedScreenHtml()), STAGE.width, STAGE.height, uiState.finishedScreenVisible]
  ];

  for (const [part, url, width, height, enabled] of globals) {
    const inputName = `${MANAGED_PREFIX}${part}`;
    try {
      await getSceneItemId(inputName);
    } catch {
      try {
        await createBrowserInput(part, obsBridge.sceneName, url, width, height, enabled);
      } catch (error) {
        // Don't let one problematic global source abort the whole layout apply.
        logObs(`Could not create ${part}: ${error.message}`);
      }
    }
  }
}

async function updateTimerTextInput() {
  const size = timerTextSourceSize();
  await setBrowserInputSettings("TimerText", {
    url: htmlDataUrl(buildTimerTextHtml()),
    width: size.width,
    height: size.height
  });
}

async function updateTimerBorderInput() {
  const size = timerBorderSourceSize();
  await setBrowserInputSettings("TimerBorder", {
    url: htmlDataUrl(buildTimerBorderHtml()),
    width: size.width,
    height: size.height
  });
}

async function updateTitleBarInput() {
  const size = titleBarSourceSize();
  await setBrowserInputSettings("TitleBar", {
    url: htmlDataUrl(buildTitleBarHtml()),
    width: size.width,
    height: size.height
  });
}

async function updateCommentatorsInput() {
  const size = commentatorsSourceSize();
  await setBrowserInputSettings("Commentators", {
    url: htmlDataUrl(buildCommentatorsHtml()),
    width: size.width,
    height: size.height
  });
}

// Browser-source pixel resolution for a media instance, derived from its
// *effective* (post-nesting) rect so nested media still render crisply.
function mediaInstanceSourceSize(rect) {
  return {
    width: Math.max(1, Math.round(STAGE.width * (Number(rect?.width) || 0.1))),
    height: Math.max(1, Math.round(STAGE.height * (Number(rect?.height) || 0.1)))
  };
}

// Legacy single-rect size helper (used as a fallback before instances resolve).
function mediaLayerSourceSize(layer) {
  return mediaInstanceSourceSize(mediaLayerNormRects(layer)[0] || layer.rect);
}

// Upper bound on OBS instances a layer can spawn (one per runner for shared
// parents, otherwise one). Used to clean up leftovers when the count shrinks.
function mediaLayerMaxInstances(layer) {
  return isSharedMediaParent(layer.parentId) ? Math.max(1, state.runners.length) : 1;
}

async function updateMediaLayerInput(layer) {
  const instances = mediaLayerObsInstances(layer);
  const url = htmlDataUrl(buildMediaLayerHtml(layer));
  for (const instance of instances) {
    const size = mediaInstanceSourceSize(instance.rect);
    try {
      await setBrowserInputSettings(instance.partName, { url, width: size.width, height: size.height });
    } catch (error) {
      logObs(`Media ${layer.name || layer.id} #${instance.index} refresh skipped: ${error.message}`);
    }
  }
}

async function ensureManagedMediaSources() {
  for (const layer of state.layout.mediaLayers) {
    for (const instance of mediaLayerObsInstances(layer)) {
      const inputName = `${MANAGED_PREFIX}${instance.partName}`;
      try {
        await getSceneItemId(inputName);
      } catch {
        const size = mediaInstanceSourceSize(instance.rect);
        await createBrowserInput(instance.partName, obsBridge.sceneName, htmlDataUrl(buildMediaLayerHtml(layer)), size.width, size.height, layer.visible !== false);
      }
    }
  }
}

async function ensureManagedRunnerSources() {
  let createdAny = false;
  for (const runner of state.runners) {
    const rectBySlot = getCurrentRectBySlot();
    for (const part of RUNNER_PARTS) {
      const inputName = `${MANAGED_PREFIX}${runnerPart(runner.slot, part)}`;
      try {
        await getSceneItemId(inputName);
      } catch {
        if (part === "Feed") {
          await createBrowserInput(runnerPart(runner.slot, "Feed"), obsBridge.sceneName, buildFeedUrl(runner), state.layout.feedWidth, state.layout.feedHeight, runner.active, { rerouteAudio: true });
        } else if (part === "Border") {
          await createBrowserInput(runnerPart(runner.slot, "Border"), obsBridge.sceneName, htmlDataUrl(buildBorderHtml()), state.layout.feedWidth, state.layout.feedHeight, runner.active);
        } else if (part === "Name") {
          const nameSize = nameSourceSize(rectBySlot.get(runner.slot));
          await createBrowserInput(runnerPart(runner.slot, "Name"), obsBridge.sceneName, htmlDataUrl(buildNameHtml(runner, rectBySlot.get(runner.slot))), nameSize.width, nameSize.height, runner.active);
        } else {
          const finishSize = finishSourceSize(runner, rectBySlot.get(runner.slot));
          await createBrowserInput(runnerPart(runner.slot, "Finish"), obsBridge.sceneName, htmlDataUrl(buildFinishHtml(runner)), finishSize.width, finishSize.height, runner.active && runner.done);
        }
        createdAny = true;
      }
    }
  }

  if (createdAny || obsBridge.opacitySupported === undefined || !obsBridge.opacitySupported) {
    obsBridge.opacitySupported = await ensureOpacityFilters();
  }
}

async function setSceneItemEnabled(partName, enabled) {
  const inputName = `${MANAGED_PREFIX}${partName}`;
  const normalized = Boolean(enabled);
  if (obsBridge.lastSceneItemEnabled.get(inputName) === normalized) return;
  const sceneItemId = await getSceneItemId(inputName);
  if (!obsBridge.lastSceneItemEnabled.has(inputName)) {
    try {
      const response = await obsCall("GetSceneItemEnabled", {
        sceneName: obsBridge.sceneName,
        sceneItemId
      });
      const current = Boolean(response.sceneItemEnabled);
      obsBridge.lastSceneItemEnabled.set(inputName, current);
      if (current === normalized) return;
    } catch {
      // Older websocket builds may not expose this request; fall back to setting it.
    }
  }
  await obsCall("SetSceneItemEnabled", {
    sceneName: obsBridge.sceneName,
    sceneItemId,
    sceneItemEnabled: normalized
  });
  obsBridge.lastSceneItemEnabled.set(inputName, normalized);
}

async function enforceSceneLayerOrder() {
  const requests = [];
  let index = 0;

  const pushLayer = (partName) => {
    const inputName = `${MANAGED_PREFIX}${partName}`;
    // Only order items that actually exist in the scene. Sending a
    // SetSceneItemIndex with an unknown (null) id can reject the whole batch,
    // which previously aborted create/repair before the layout was applied and
    // left every item stuck at the default top-left position.
    if (!obsBridge.itemIds.has(inputName)) return;
    requests.push({
      requestType: "SetSceneItemIndex",
      requestData: {
        sceneName: obsBridge.sceneName,
        sceneItemId: obsBridge.itemIds.get(inputName),
        sceneItemIndex: index
      }
    });
    index += 1;
  };

  for (const id of normalizedLayerOrder()) {
    if (id === "background") pushLayer("Background");
    else if (id === "title") pushLayer("TitleBar");
    else if (id === "timerText") pushLayer("TimerText");
    else if (id === "timerFrame") pushLayer("TimerBorder");
    else if (id === "commentators") pushLayer("Commentators");
    else if (id === "finished") pushLayer("FinishedScreen");
    else if (id === "runners") {
      for (const runner of state.runners) {
        // Keep each runner's visible chrome above the live feed. This matters most
        // with high-radius generated borders, where the feed can otherwise cover
        // the rounded border stroke in OBS even though the preview clip looks OK.
        for (const part of ["Feed", "Border", "Name", "Finish"]) {
          pushLayer(runnerPart(runner.slot, part));
        }
      }
    } else if (id.startsWith("media:")) {
      const layer = getMediaLayer(id.slice("media:".length));
      if (layer) {
        for (const instance of mediaLayerObsInstances(layer)) pushLayer(instance.partName);
      }
    }
  }

  await obsBatch(requests);
}

// Direct show/hide/replay of the Finished Screen browser source in OBS,
// independent of the debounced full-layout apply so the entrance animation
// fires immediately when the operator toggles the view.
async function syncFinishedScreenObs({ replay = false, refresh = false } = {}) {
  if (!obsBridge.connected || !obsBridge.client) return;
  try {
    await ensureManagedGlobalSources();
    await refreshSceneItemCache();
    const source = `${MANAGED_PREFIX}FinishedScreen`;
    const show = uiState.finishedScreenVisible;
    const wasEnabled = obsBridge.lastSceneItemEnabled.get(source) ?? false;

    if (show) {
      // Reloading the browser source URL replays the CSS entrance animation and
      // refreshes the standings. A unique nonce guarantees the URL changes so
      // OBS actually reloads the page (it caches identical URLs otherwise).
      if (replay || refresh || !wasEnabled) {
        await setInputUrl("FinishedScreen", htmlDataUrl(buildFinishedScreenHtml(Date.now())));
      }
      await setSceneItemTransform("FinishedScreen", {
        positionX: 0,
        positionY: 0,
        boundsWidth: STAGE.width,
        boundsHeight: STAGE.height
      });
      await enforceSceneLayerOrder();
      await ensureOpacityFilter(source);
      await setSourceOpacity(source, 1);
      await setSceneItemEnabled("FinishedScreen", true);
    } else if (wasEnabled) {
      await fadeOutFinishedScreenObs();
    } else {
      await setSceneItemEnabled("FinishedScreen", false);
    }

    // Reflect finish-time suppression on the main scene: fades finish times out
    // while the screen is up, and back in when it is dismissed.
    await syncAllFinishTimeVisibilities(getCurrentRectBySlot(), true);
    logObs(show ? "Finished screen shown in OBS." : "Finished screen hidden in OBS.");
  } catch (error) {
    logObs(`Finished screen update failed: ${error.message}`);
  }
}

// Fade the Finished Screen browser source out via its opacity filter, then
// disable it. Falls back to an instant hide if opacity filters are unavailable.
async function fadeOutFinishedScreenObs() {
  const source = `${MANAGED_PREFIX}FinishedScreen`;
  const supported = await ensureOpacityFilter(source);
  if (!supported) {
    await setSceneItemEnabled("FinishedScreen", false);
    return;
  }
  const frames = 12;
  const frameMs = Math.max(16, Math.round(260 / frames));
  for (let i = 1; i <= frames; i += 1) {
    await setSourceOpacity(source, 1 - i / frames);
    await delay(frameMs);
  }
  await setSceneItemEnabled("FinishedScreen", false);
  await setSourceOpacity(source, 1);
}

function sceneItemIndexRequest(partName, sceneItemIndex) {
  return {
    requestType: "SetSceneItemIndex",
    requestData: {
      sceneName: obsBridge.sceneName,
      sceneItemId: getCachedSceneItemId(`${MANAGED_PREFIX}${partName}`),
      sceneItemIndex
    }
  };
}

async function setSceneItemTransform(partName, rect, crop = null, options = {}) {
  const sceneItemId = await getSceneItemId(`${MANAGED_PREFIX}${partName}`);
  await obsCall("SetSceneItemTransform", {
    sceneName: obsBridge.sceneName,
    sceneItemId,
    sceneItemTransform: buildSceneItemTransform(rect, crop, options)
  });
}

async function refreshSceneItemCache() {
  if (!requireObs()) return;
  try {
    const response = await obsCall("GetSceneItemList", { sceneName: obsBridge.sceneName });
    obsBridge.itemIds.clear();
    if (response && response.sceneItems) {
      for (const item of response.sceneItems) {
        obsBridge.itemIds.set(item.sourceName, item.sceneItemId);
      }
    }
  } catch (error) {
    logObs(`Failed to refresh scene item cache: ${error.message}`);
  }
}

async function getSceneItemId(inputName) {
  if (obsBridge.itemIds.has(inputName)) return obsBridge.itemIds.get(inputName);

  const response = await obsCall("GetSceneItemId", {
    sceneName: obsBridge.sceneName,
    sourceName: inputName
  });
  obsBridge.itemIds.set(inputName, response.sceneItemId);
  return response.sceneItemId;
}

function getCachedSceneItemId(inputName) {
  if (!obsBridge.itemIds.has(inputName)) {
    logObs(`Warning: Scene item ID for ${inputName} is not cached.`);
    return null;
  }
  return obsBridge.itemIds.get(inputName);
}

function buildSceneItemTransform(rect, crop = null, options = {}) {
  const sceneItemTransform = {
    positionX: round(rect.positionX ?? rect.x),
    positionY: round(rect.positionY ?? rect.y),
    boundsType: options.boundsType || "OBS_BOUNDS_STRETCH",
    boundsWidth: round(rect.boundsWidth ?? rect.width),
    boundsHeight: round(rect.boundsHeight ?? rect.height),
    alignment: 5
  };

  if (crop) {
    sceneItemTransform.cropLeft = crop.left;
    sceneItemTransform.cropTop = crop.top;
    sceneItemTransform.cropRight = crop.right;
    sceneItemTransform.cropBottom = crop.bottom;
  }

  return sceneItemTransform;
}

function runnerPart(slot, part) {
  return `Runner${String(slot).padStart(2, "0")}__${part}`;
}

function viewportRect(rect, viewport) {
  return {
    x: rect.x + rect.width * viewport.x,
    y: rect.y + rect.height * viewport.y,
    width: rect.width * viewport.width,
    height: rect.height * viewport.height
  };
}

function insetRect(rect, insetX, insetY = insetX) {
  const safeInsetX = Math.max(0, Number(insetX) || 0);
  const safeInsetY = Math.max(0, Number(insetY) || 0);
  const maxInsetX = Math.max(0, Number(rect.width) || 0) / 2;
  const maxInsetY = Math.max(0, Number(rect.height) || 0) / 2;
  const x = Math.min(safeInsetX, maxInsetX);
  const y = Math.min(safeInsetY, maxInsetY);

  return {
    x: rect.x + x,
    y: rect.y + y,
    width: Math.max(0, rect.width - x * 2),
    height: Math.max(0, rect.height - y * 2)
  };
}

function frameBorderWidth(target) {
  const style = getBorderStyle(target);
  return Math.max(0, Number(style.lineWidth) || 0);
}

function frameRadius(target) {
  const style = getBorderStyle(target);
  return Math.max(0, Number(style.radius) || 0);
}

function innerFrameRadius(target) {
  return Math.max(0, frameRadius(target) - frameBorderWidth(target));
}

function gameFeedViewportGeometry() {
  const base = state.layout.panelGeometry.feed;
  if (!state.layout.elements.feedBorder) return base;

  const insetX = frameBorderWidth("feed") / Math.max(1, Number(state.layout.feedWidth) || 1);
  const insetY = frameBorderWidth("feed") / Math.max(1, Number(state.layout.feedHeight) || 1);
  return insetRect(base, insetX, insetY);
}

function scaledFrameRadius(target, scaleX = 1, scaleY = scaleX, inner = false) {
  const radius = inner ? innerFrameRadius(target) : frameRadius(target);
  return Math.max(0, radius * Math.min(Math.abs(scaleX) || 1, Math.abs(scaleY) || Math.abs(scaleX) || 1));
}

function cropPixels(crop) {
  return {
    left: Math.round(state.layout.feedWidth * crop.left / 100),
    top: Math.round(state.layout.feedHeight * crop.top / 100),
    right: Math.round(state.layout.feedWidth * crop.right / 100),
    bottom: Math.round(state.layout.feedHeight * crop.bottom / 100)
  };
}

function absoluteRect(rect) {
  return {
    x: STAGE.width * rect.x,
    y: STAGE.height * rect.y,
    width: STAGE.width * rect.width,
    height: STAGE.height * rect.height
  };
}

function fullStageRect() {
  return { x: 0, y: 0, width: STAGE.width, height: STAGE.height };
}

function fullPanelGeometry() {
  return { x: 0, y: 0, width: 1, height: 1 };
}

function timerTextIsUnframed() {
  return !state.layout.timerBorder.enabled || !state.layout.elements.timerBorder;
}

function timerTextTransformRect() {
  return timerTextIsUnframed() ? fullStageRect() : absoluteRect(state.layout.timerBorder);
}

function timerTextAnchor(size) {
  if (!timerTextIsUnframed()) {
    return { x: size.width / 2, y: size.height / 2 };
  }

  return {
    x: STAGE.width * (state.layout.timerBorder.x + state.layout.timerBorder.width / 2),
    y: STAGE.height * (state.layout.timerBorder.y + state.layout.timerBorder.height / 2)
  };
}

function nameTextIsUnframed() {
  return !state.layout.nameplate.showBox && !state.layout.nameplate.showBorder;
}

function nameTransformGeometry() {
  return nameTextIsUnframed() ? fullPanelGeometry() : state.layout.panelGeometry.name;
}

function nameTextAnchor(sourceSize) {
  const config = state.layout.nameplate;
  const padding = Math.max(0, Number(config.platePaddingX) || 0);
  if (!nameTextIsUnframed()) {
    return {
      x: padding + (Number(config.textX) || 0),
      y: sourceSize.height / 2 + (Number(config.textY) || 0)
    };
  }

  const name = state.layout.panelGeometry.name;
  return {
    x: name.x * sourceSize.width + padding + (Number(config.textX) || 0),
    y: (name.y + name.height / 2) * sourceSize.height + (Number(config.textY) || 0)
  };
}

function nameSourceSize(rect) {
  const sourceRect = rect ? viewportRect(rect, nameTransformGeometry()) : null;
  return {
    width: Math.max(96, Math.round(sourceRect?.width ?? 960)),
    height: Math.max(24, Math.round(sourceRect?.height ?? 120))
  };
}

function finishSourceSize(runner = null, rect = null) {
  if (runner) return measureFinishedTimeSourceSize(runner);
  const sourceRect = rect ? viewportRect(rect, finishGeometry(runner, rect)) : null;
  return {
    width: Math.max(24, Math.round(sourceRect?.width ?? 160)),
    height: Math.max(18, Math.round(sourceRect?.height ?? 54))
  };
}

function measureFinishedTimeSourceSize(runner) {
  const config = state.layout.finishedTime;
  const text = displayRunnerFinalTime(runner, true) || "00:00:00";
  const fontSize = Math.max(1, Number(config.fontSize) || DEFAULT_FINISHED_TIME.fontSize);
  const pad = textEffectPadding(config, 0);
  const canvas = measureFinishedTimeSourceSize.canvas ?? document.createElement("canvas");
  measureFinishedTimeSourceSize.canvas = canvas;
  const context = canvas.getContext("2d");
  context.font = `900 ${fontSize}px ${cssFontStack(config.fontFamily)}`;
  const metrics = context.measureText(text);
  const width = Math.ceil(metrics.width + pad * 2);
  const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.82;
  const descent = metrics.actualBoundingBoxDescent || fontSize * 0.22;
  const height = Math.ceil(ascent + descent + pad * 2);
  return {
    width: Math.max(24, width),
    height: Math.max(18, height)
  };
}

function timerTextSourceSize() {
  const rect = timerTextTransformRect();
  return {
    width: Math.max(96, Math.round(rect.width)),
    height: Math.max(24, Math.round(rect.height))
  };
}

function timerBorderSourceSize() {
  const rect = absoluteRect(state.layout.timerBorder);
  return {
    width: Math.max(1, Math.round(rect.width)),
    height: Math.max(1, Math.round(rect.height))
  };
}

function titleBarSourceSize() {
  const rect = absoluteRect(state.layout.raceInfo.rect);
  return {
    width: Math.max(1, Math.round(rect.width)),
    height: Math.max(1, Math.round(rect.height))
  };
}

function buildBackgroundHtml() {
  const layout = state.layout;
  if (layout.backgroundImage) {
    const loop = textureLoop(layout.backgroundScrollX, layout.backgroundScrollY, STAGE.width, STAGE.height, layout.backgroundScale);
    const animation = loop
      ? `animation:ormBackgroundScroll ${loop.duration}s linear infinite;`
      : "";
    const scrollVars = loop
      ? `--orm-bg-scroll-x:${loop.dx}px;--orm-bg-scroll-y:${loop.dy}px;`
      : "";

    return `<!doctype html><html><body><div class="bg"></div></body><style>${baseHtmlCss()} @keyframes ormBackgroundScroll{from{background-position:0px 0px;}to{background-position:var(--orm-bg-scroll-x) var(--orm-bg-scroll-y);}} .bg{width:100vw;height:100vh;background-image:url("${escapeCssString(layout.backgroundImage)}");background-repeat:repeat;background-size:${layout.backgroundScale}% auto;background-position:0px 0px;${scrollVars}${animation}}</style></html>`;
  }

  return `<!doctype html><html><body><div class="bg"></div></body><style>${baseHtmlCss()} .bg{width:100vw;height:100vh;background:linear-gradient(135deg,rgba(45,198,163,.25),transparent 38%),linear-gradient(315deg,rgba(240,184,74,.2),transparent 38%),#11161a;}</style></html>`;
}

function buildMediaLayerHtml(layer) {
  const tag = layer.type === "video"
    ? `<video src="${escapeAttribute(layer.dataUrl)}" autoplay loop muted playsinline></video>`
    : `<img src="${escapeAttribute(layer.dataUrl)}" alt="">`;
  return `<!doctype html><html><body>${tag}</body><style>${baseHtmlCss()} body{display:grid;place-items:center;background:transparent;}img,video{display:block;width:100vw;height:100vh;object-fit:fill;background:transparent;}</style></html>`;
}

function buildTitleBarHtml() {
  const config = state.layout.raceInfo;
  const size = titleBarSourceSize();
  const titleBorder = titleBorderHtmlCss(size.width, size.height);
  const shadowCss = config.shadowEnabled
    ? `text-shadow:${Number(config.shadowX)}px ${Number(config.shadowY)}px ${Number(config.shadowBlur)}px ${config.shadowColor};`
    : "text-shadow:none;";
  const strokeCss = config.strokeEnabled && Number(config.strokeWidth) > 0
    ? `-webkit-text-stroke:${Number(config.strokeWidth)}px ${config.strokeColor};paint-order:stroke fill;`
    : "";
  const textEffects = `${shadowCss}${strokeCss}`;

  const frameClip = `border-radius:${frameRadius("title")}px;overflow:hidden;`;
  const plateStyle = `position:absolute;inset:0;${raceInfoPlateFrameCss(config, size.width, size.height, 1.0)}`;

  return `<!doctype html><html><body><div class="title-container"><div class="title-plate-bg" style="${plateStyle}"></div><div class="title"><strong>${escapeHtml(config.title)}</strong><span>${escapeHtml(config.subtitle)}</span><div class="title-border" aria-hidden="true"></div></div></div></body><style>${baseHtmlCss()} ${nameplateAnimationCss(config, size.width, size.height, "ormRaceInfoTexture")}${borderAnimationCss(getBorderStyle("title"), size.width, size.height)}body{font-family:${cssFontStack(config.fontFamily)};}.title-container{position:absolute;inset:0;${frameClip}}.title{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;overflow:hidden;text-align:center;white-space:pre-wrap;color:${config.textColor};}.title-border{${titleBorder}}strong,span{position:relative;z-index:1;white-space:pre-wrap;${textEffects}}strong{font-size:${Math.max(8, Number(config.fontSize) || 34)}px;font-weight:900;line-height:1.2;}span{font-size:${Math.max(8, Number(config.fontSize) || 34) * 0.58}px;font-weight:800;line-height:1.2;color:${hexToRgba(config.textColor, 0.68)};}</style></html>`;
}

function titleBorderHtmlCss(width, height) {
  const image = getBorderImage("title");
  const base = "position:absolute;inset:0;z-index:2;pointer-events:none;";
  if (image) {
    return `${base}background-color:transparent;background-image:url("${escapeCssString(image)}");background-size:100% 100%;background-repeat:no-repeat;`;
  }
  return `${base}${borderFrameCss(false, getBorderStyle("title"), width, height)}`;
}

function raceInfoPlateFrameCss(config, sourceWidth = 960, sourceHeight = 120, scale = 1.0) {
  const padding = Math.max(0, Number(config.platePaddingX) || 0) * scale;
  const radius = frameRadius("title") * scale;

  return `display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:0 ${padding}px;overflow:hidden;text-align:center;white-space:pre-wrap;${plateBackgroundFrameCss(config, sourceWidth, sourceHeight, "ormRaceInfoTexture")}border:none;border-radius:${radius}px;box-sizing:border-box;background-clip:padding-box;`;
}

function timerPlateFrameCss(config, sourceWidth = 320, sourceHeight = 80, scale = 1.0) {
  const padding = Math.max(0, Number(config.platePaddingX) || 0) * scale;
  const radius = frameRadius("timer") * scale;

  return `display:flex;align-items:center;justify-content:center;padding:0 ${padding}px;overflow:hidden;white-space:nowrap;${plateBackgroundFrameCss(config, sourceWidth, sourceHeight, "ormTimerTexture")}border:none;border-radius:${radius}px;box-sizing:border-box;background-clip:padding-box;width:100%;height:100%;`;
}

function plateBackgroundFrameCss(config, sourceWidth, sourceHeight, textureAnimationName) {
  if (!config.showBox) return "background:transparent;";

  if (config.plateMode === "image" && config.plateImage) {
    return `background-color:transparent;background-image:url("${escapeCssString(config.plateImage)}");background-size:100% 100%;background-repeat:no-repeat;background-position:center;`;
  }

  if (config.plateMode !== "image") {
    return nameplateBackgroundCss(config, sourceWidth, sourceHeight, textureAnimationName);
  }

  return "background:transparent;";
}

// ---------------------------------------------------------------------------
// Commentators (movable global plate with commentator names)
// ---------------------------------------------------------------------------

function commentatorsSourceSize() {
  const rect = absoluteRect(state.layout.commentators.rect);
  return {
    width: Math.max(1, Math.round(rect.width)),
    height: Math.max(1, Math.round(rect.height))
  };
}

function getCommentatorNames(config = state.layout.commentators) {
  const raw = Array.isArray(config.names) ? config.names : String(config.names || "").split(/\r?\n/);
  return raw.map((name) => String(name).trim()).filter(Boolean);
}

// Plate CSS shared by the OBS browser source (scale = 1, px source size) and the
// in-app preview (scale = stage scale). Reuses the nameplate fill helper so the
// same fill/gradient options apply.
function commentatorsPlateCss(config, sourceWidth, sourceHeight, scale = 1) {
  const padding = Math.max(0, Number(config.platePaddingX) || 0) * scale;
  // Corner radius comes from the shared border target (like the title/timer plates).
  const radius = frameRadius("commentators") * scale;
  const fill = !config.showBox
    ? "background:transparent;"
    : (config.plateMode === "image" && config.plateImage
      ? `background-color:transparent;background-image:url("${escapeCssString(config.plateImage)}");background-size:100% 100%;background-repeat:no-repeat;background-position:center;`
      : nameplateBackgroundCss(config, sourceWidth, sourceHeight, "ormCommentatorsTexture"));
  return `display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${Math.round(3 * scale)}px;padding:0 ${padding}px;overflow:hidden;text-align:center;${fill}border:none;border-radius:${radius}px;box-sizing:border-box;background-clip:padding-box;`;
}

function commentatorsBorderHtmlCss(width, height) {
  const image = getBorderImage("commentators");
  const base = "position:absolute;inset:0;z-index:2;pointer-events:none;";
  if (image) {
    return `${base}background-color:transparent;background-image:url("${escapeCssString(image)}");background-size:100% 100%;background-repeat:no-repeat;`;
  }
  return `${base}${borderFrameCss(false, getBorderStyle("commentators"), width, height)}`;
}

function commentatorsTextEffectCss(config) {
  const shadow = config.shadowEnabled
    ? `text-shadow:${Number(config.shadowX) || 0}px ${Number(config.shadowY) || 0}px ${Math.max(0, Number(config.shadowBlur) || 0)}px ${config.shadowColor};`
    : "text-shadow:none;";
  const stroke = config.strokeEnabled && Number(config.strokeWidth) > 0
    ? `-webkit-text-stroke:${Number(config.strokeWidth)}px ${config.strokeColor};paint-order:stroke fill;`
    : "";
  return `${shadow}${stroke}`;
}

function buildCommentatorsHtml() {
  const config = state.layout.commentators;
  const size = commentatorsSourceSize();
  const names = getCommentatorNames(config);
  const label = String(config.label || "").trim();
  const fontSize = Math.max(8, Number(config.fontSize) || 34);
  const textEffects = commentatorsTextEffectCss(config);
  const plateCss = commentatorsPlateCss(config, size.width, size.height, 1);
  const labelHtml = label ? `<span class="c-label">${escapeHtml(label)}</span>` : "";
  const namesHtml = names.length
    ? names.map((name) => `<strong class="c-name">${escapeHtml(name)}</strong>`).join(`<i class="c-sep">&bull;</i>`)
    : "";
  const tx = Number(config.textX) || 0;
  const ty = Number(config.textY) || 0;

  const borderCss = commentatorsBorderHtmlCss(size.width, size.height);

  return `<!doctype html><html><body><div class="c-plate" style="position:absolute;inset:0;${plateCss}">`
    + `<div class="c-content" style="transform:translate(${tx}px, ${ty}px);">${labelHtml}<div class="c-names">${namesHtml}</div></div>`
    + `<div class="c-border" style="${borderCss}"></div></div></body>`
    + `<style>${baseHtmlCss()} ${nameplateAnimationCss(config, size.width, size.height, "ormCommentatorsTexture")}${borderAnimationCss(getBorderStyle("commentators"), size.width, size.height)}`
    + `body{font-family:${cssFontStack(config.fontFamily)};color:${config.textColor};}`
    + `.c-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${Math.round(fontSize * 0.12)}px;}`
    + `.c-names{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0 ${Math.round(fontSize * 0.4)}px;}`
    + `.c-name{font-size:${fontSize}px;font-weight:900;line-height:1.15;${textEffects}}`
    + `.c-sep{font-style:normal;font-size:${Math.round(fontSize * 0.7)}px;opacity:0.5;${textEffects}}`
    + `.c-label{font-size:${Math.round(fontSize * 0.5)}px;font-weight:800;letter-spacing:2px;text-transform:uppercase;opacity:0.72;${textEffects}}`
    + `</style></html>`;
}

function buildFeedUrl(runner) {
  if (runner.feedMode && runner.feedMode !== "live") {
    return htmlDataUrl(buildReplacementFeedHtml(runner));
  }
  if (isUrl(runner.source)) {
    return runner.source.trim();
  }

  return htmlDataUrl(buildFeedHtml(runner));
}

function buildReplacementFeedHtml(runner) {
  const mode = runner.feedMode || "live";
  const labels = {
    brb: ["BRB", `${runner.name} will be right back`],
    tech: ["Technical Difficulty", `${runner.name}'s feed is being checked`],
    black: ["", ""],
    standby: ["Standby", `${runner.name} is not live yet`]
  };
  const [title, subtitle] = labels[mode] || labels.standby;
  const background = mode === "black"
    ? "#000"
    : "radial-gradient(circle at 28% 24%,rgba(45,198,163,.28),transparent 34%),radial-gradient(circle at 76% 74%,rgba(240,184,74,.22),transparent 38%),#101417";
  return `<!doctype html><html><body><main><strong>${escapeHtml(title)}</strong><span>${escapeHtml(subtitle)}</span></main></body><style>${baseHtmlCss()} body{background:${background};font-family:Segoe UI,Arial,sans-serif;}main{position:absolute;inset:0;display:grid;place-content:center;gap:14px;text-align:center;color:#eef2f4;}strong{font-size:clamp(42px,8vw,112px);font-weight:950;line-height:1;}span{font-size:clamp(20px,3vw,42px);font-weight:800;color:rgba(238,242,244,.68);}</style></html>`;
}

function feedModeLabel(mode) {
  return {
    live: "Live feed",
    brb: "BRB card",
    tech: "Tech difficulty",
    black: "Black screen",
    standby: "Standby card"
  }[mode] || "Live feed";
}

function isUrl(value) {
  return /^https?:\/\//i.test(String(value).trim());
}

function isVdoNinjaUrl(value) {
  try {
    const url = new URL(String(value).trim());
    return /(^|\.)vdo\.ninja$/i.test(url.hostname) || /(^|\.)obs\.ninja$/i.test(url.hostname);
  } catch {
    return false;
  }
}

function normalizeVdoNinjaUrl(value) {
  const trimmed = String(value).trim();
  if (!trimmed) return "https://vdo.ninja/?view=runner";

  const url = new URL(isUrl(trimmed) ? trimmed : `https://vdo.ninja/?view=${encodeURIComponent(trimmed)}`);
  if (!isVdoNinjaUrl(url.toString())) return trimmed;

  const defaults = {
    cleanoutput: "",
    transparent: "",
    bitrate: "6000",
    stereo: "",
    autostart: ""
  };

  for (const [key, valueToSet] of Object.entries(defaults)) {
    if (!url.searchParams.has(key)) url.searchParams.set(key, valueToSet);
  }

  return url.toString().replaceAll("=&", "&").replace(/=$/, "");
}

function buildFeedHtml(runner) {
  const hue = (runner.slot * 72) % 360;
  return `<!doctype html><html><body><main></main></body><style>${baseHtmlCss()} body{background:#151a1e;} main{width:100vw;height:100vh;background:linear-gradient(135deg,hsl(${hue} 55% 42% / .42),transparent 58%),linear-gradient(315deg,hsl(${(hue + 145) % 360} 45% 35% / .32),transparent 62%),#293137;} main::after{content:"";position:absolute;inset:9%;border:2px solid rgba(255,255,255,.10);}</style></html>`;
}

function getEditingBorderStyle() {
  const runner = editingUniqueRunner();
  if (runner && state.layout.borderTarget === "feed" && runner.style.borderStyle) return runner.style.borderStyle;
  return getBorderStyle(state.layout.borderTarget);
}

function getEditingBorderImage() {
  const runner = editingUniqueRunner();
  if (runner && state.layout.borderTarget === "feed") return runner.style.borderImage || "";
  return getBorderImage(state.layout.borderTarget);
}

function getBorderStyle(target) {
  const key = borderTargetKey(target);
  state.layout.borderStyles[key] ??= structuredClone(BORDER_PRESETS.graphite);
  return state.layout.borderStyles[key];
}

function getBorderImage(target) {
  const key = borderTargetKey(target);
  return state.layout.borderImages?.[key] || "";
}

function setEditingBorderImage(value) {
  const runner = editingUniqueRunner();
  if (runner && state.layout.borderTarget === "feed") {
    runner.style.borderImage = value;
    return;
  }
  const key = borderTargetKey(state.layout.borderTarget);
  state.layout.borderImages ??= { feed: "", timer: "", title: "", commentators: "" };
  state.layout.borderImages[key] = value;
}

function borderTargetKey(target) {
  return ["timer", "title", "commentators"].includes(target) ? target : "feed";
}

function buildBorderHtml() {
  const image = getBorderImage("feed");
  if (image) {
    return `<!doctype html><html><body><img src="${escapeAttribute(image)}" alt=""></body><style>${baseHtmlCss()} img{width:100vw;height:100vh;object-fit:fill;display:block;}</style></html>`;
  }

  return buildGeneratedBorderHtml(false, getBorderStyle("feed"));
}

function buildTimerBorderHtml() {
  return buildTimerFrameHtml();
}

function buildTimerFrameHtml() {
  const style = getBorderStyle("timer");
  const image = getBorderImage("timer");
  const size = timerBorderSourceSize();
  const borderHtml = image
    ? `<img class="timer-frame-border" src="${escapeAttribute(image)}" alt="">`
    : `<div class="timer-frame-border" aria-hidden="true"></div>`;
  const borderCss = image
    ? `.timer-frame-border{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block;z-index:2;pointer-events:none;}`
    : `.timer-frame-border{${borderFrameCss(true, style, size.width, size.height)}z-index:2;pointer-events:none;}`;
  const animationCss = image ? "" : borderAnimationCss(style, size.width, size.height);

  return `<!doctype html><html><body><div class="timer-frame">${borderHtml}</div></body><style>${baseHtmlCss()} ${animationCss}.timer-frame{position:absolute;inset:0;overflow:visible;border-radius:${frameRadius("timer")}px;}${borderCss}</style></html>`;
}

function buildTimerTextHtml() {
  const config = state.layout.timerText;
  const size = timerTextSourceSize();
  const start = config.state === "running" ? Number(config.startedAt || Date.now()) : 0;
  const elapsed = currentTimerElapsedMs();
  const fontSize = timerEffectiveFontSize(config, size);
  const anchor = timerTextAnchor(size);
  const svg = svgTextMarkup({
    id: "timerText",
    text: formatTimerDisplay(elapsed),
    width: size.width,
    height: size.height,
    fontFamily: config.fontFamily,
    fontSize,
    fill: timerTextColor(),
    config,
    align: "center",
    x: anchor.x,
    y: anchor.y
  });

  const drawPlateInTextSource = config.showBox;
  const plateRect = timerTextIsUnframed()
    ? absoluteRect(state.layout.timerBorder)
    : { x: 0, y: 0, width: size.width, height: size.height };
  const plateHtml = drawPlateInTextSource ? `<div class="timer-plate" aria-hidden="true"></div>${svg}` : svg;
  const plateCss = drawPlateInTextSource ? `.timer-plate{position:absolute;left:${round(plateRect.x)}px;top:${round(plateRect.y)}px;width:${round(plateRect.width)}px;height:${round(plateRect.height)}px;${timerPlateFrameCss(config, plateRect.width, plateRect.height, 1.0)}}` : "";
  const animCss = drawPlateInTextSource ? nameplateAnimationCss(config, plateRect.width, plateRect.height, "ormTimerTexture") : "";

  return `<!doctype html><html><body>${plateHtml}<script>const state=${JSON.stringify(config.state)};const startedAt=${start};const format=${JSON.stringify(config.format)};let elapsed=${elapsed};function fmt(ms){const totalSeconds=Math.floor(ms/1000);const hours=Math.floor(totalSeconds/3600);const totalMinutes=Math.floor(totalSeconds/60);const minutes=Math.floor((totalSeconds%3600)/60);const seconds=totalSeconds%60;if(format==="mmss")return String(totalMinutes).padStart(2,"0")+":"+String(seconds).padStart(2,"0");if(format==="mmssms")return String(totalMinutes).padStart(2,"0")+":"+String(seconds).padStart(2,"0")+"."+String(Math.floor(ms%1000)).padStart(3,"0");return [hours,minutes,seconds].map(v=>String(v).padStart(2,"0")).join(":");}function tick(){if(state==="running") elapsed=Math.max(0,Date.now()-startedAt);document.getElementById("timerText").textContent=fmt(elapsed);}tick();if(state==="running") setInterval(tick,format==="mmssms"?33:200);</script></body><style>${baseHtmlCss()} ${animCss} body{position:relative;width:100vw;height:100vh;margin:0;overflow:hidden;background:transparent;} .svg-text{position:absolute;left:0;top:0;z-index:3;} ${plateCss}</style></html>`;
}

function timerEffectiveFontSize(config, size) {
  return Math.max(1, Number(config.fontSize) || DEFAULT_TIMER_TEXT.fontSize);
}

function buildGeneratedBorderHtml(isTimer, style) {
  const sourceWidth = isTimer ? STAGE.width : state.layout.feedWidth;
  const sourceHeight = isTimer ? STAGE.height : state.layout.feedHeight;
  const animationCss = borderAnimationCss(style, sourceWidth, sourceHeight);
  return `<!doctype html><html><body><div class="frame"></div></body><style>${baseHtmlCss()} ${animationCss}.frame{${borderFrameCss(isTimer, style, sourceWidth, sourceHeight)}}</style></html>`;
}

function borderFrameCss(isTimer, style = getBorderStyle(isTimer ? "timer" : "feed"), sourceWidth = isTimer ? STAGE.width : state.layout.feedWidth, sourceHeight = isTimer ? STAGE.height : state.layout.feedHeight) {
  const lineWidth = Math.max(0, Number(style.lineWidth));
  const glowSize = isTimer ? 26 : 42;
  const innerGlowSize = isTimer ? 18 : 28;
  const insetWidth = isTimer ? 2 : 3;
  const glow = hexToRgba(style.glowColor, isTimer ? 0.48 : 0.38);
  const innerGlow = hexToRgba(style.glowColor, isTimer ? 0.34 : 0.28);
  const angle = style.mode === "gradient" ? "var(--orm-gradient-angle)" : `${style.gradientAngle}deg`;
  const animation = style.mode === "gradient" && style.animateGradientAngle && Number(style.gradientAngleSpeed) !== 0
    ? `animation:${gradientAnimationName(style)} ${gradientAnimationDuration(style)}s linear infinite;`
    : "";
  const borderPaint = style.mode === "gradient"
    ? `--orm-gradient-angle-start:${style.gradientAngle}deg;--orm-gradient-angle:${style.gradientAngle}deg;border:${lineWidth}px solid transparent;background:linear-gradient(${angle}, ${style.gradientFrom}, ${style.gradientTo}) border-box;-webkit-mask:linear-gradient(#000 0 0) padding-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;${animation}will-change:--orm-gradient-angle;`
    : style.mode === "texture" && style.textureImage
      ? `border:${lineWidth}px solid transparent;background-image:url("${escapeCssString(style.textureImage)}");background-size:${style.textureScale}% ${style.textureScale}%;background-position:${style.textureX}% ${style.textureY}%;background-repeat:repeat;-webkit-mask:linear-gradient(#000 0 0) padding-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;${textureScrollAnimationCss(style.textureScrollX, style.textureScrollY, "ormBorderTexture", sourceWidth, sourceHeight, style.textureScale)}`
    : `border:${lineWidth}px solid ${style.lineColor};`;
  const background = style.mode === "gradient" || style.mode === "texture" ? "" : "background:transparent;";
  return `position:absolute;inset:0;${borderPaint}box-shadow:inset 0 0 0 ${insetWidth}px rgba(255,255,255,.16),inset 0 0 ${innerGlowSize}px ${innerGlow},0 0 ${glowSize}px ${glow};border-radius:${style.radius}px;${background}box-sizing:border-box;`;
}

function borderAnimationCss(style, sourceWidth = state.layout.feedWidth, sourceHeight = state.layout.feedHeight) {
  let css = "";
  if (style.mode === "gradient" && style.animateGradientAngle && Number(style.gradientAngleSpeed) !== 0) {
    const startAngle = Number(style.gradientAngle) || 0;
    const positive = Number(style.gradientAngleSpeed) >= 0;
    const fromAngle = startAngle;
    const toAngle = positive ? startAngle + 360 : startAngle - 360;
    css += `@property --orm-gradient-angle{syntax:"<angle>";inherits:false;initial-value:${fromAngle}deg;}@keyframes ormGradientAnglePositive{from{--orm-gradient-angle:${fromAngle}deg;}to{--orm-gradient-angle:${startAngle + 360}deg;}}@keyframes ormGradientAngleNegative{from{--orm-gradient-angle:${fromAngle}deg;}to{--orm-gradient-angle:${startAngle - 360}deg;}}`;
  }
  if (style.mode === "texture" && style.textureImage && (Number(style.textureScrollX) !== 0 || Number(style.textureScrollY) !== 0)) {
    css += textureScrollKeyframesCss(style.textureScrollX, style.textureScrollY, "ormBorderTexture", sourceWidth, sourceHeight, style.textureScale, style.textureX, style.textureY);
  }
  return css;
}

function textureScrollAnimationCss(scrollX, scrollY, name, sourceWidth, sourceHeight, textureScale) {
  const loop = textureLoop(scrollX, scrollY, sourceWidth, sourceHeight, textureScale);
  if (!loop) return "";
  return `animation:${name} ${loop.duration}s linear infinite;`;
}

function textureScrollKeyframesCss(scrollX, scrollY, name, sourceWidth, sourceHeight, textureScale, baseX = 50, baseY = 50) {
  const loop = textureLoop(scrollX, scrollY, sourceWidth, sourceHeight, textureScale);
  if (!loop) return "";
  return `@keyframes ${name}{from{background-position:${baseX}% ${baseY}%;}to{background-position:calc(${baseX}% + ${loop.dx}px) calc(${baseY}% + ${loop.dy}px);}}`;
}

function textureLoop(scrollX, scrollY, sourceWidth, sourceHeight, textureScale) {
  const sx = Number(scrollX) || 0;
  const sy = Number(scrollY) || 0;
  if (sx === 0 && sy === 0) return null;

  const tileW = Math.max(1, Number(sourceWidth || STAGE.width) * Math.max(1, Number(textureScale) || 100) / 100);
  const tileH = Math.max(1, Number(sourceHeight || STAGE.height) * Math.max(1, Number(textureScale) || 100) / 100);
  const ax = Math.abs(sx);
  const ay = Math.abs(sy);
  let nx = ax > 0 ? 1 : 0;
  let ny = ay > 0 ? 1 : 0;
  let duration = ax > 0 ? tileW / ax : tileH / ay;

  if (ax > 0 && ay > 0) {
    let best = { nx: 1, ny: 1, duration: (tileW / ax + tileH / ay) / 2, error: Number.POSITIVE_INFINITY };
    for (let xMultiple = 1; xMultiple <= 24; xMultiple += 1) {
      const xDuration = xMultiple * tileW / ax;
      for (let yMultiple = 1; yMultiple <= 24; yMultiple += 1) {
        const yDuration = yMultiple * tileH / ay;
        const error = Math.abs(xDuration - yDuration);
        if (error < best.error) {
          best = { nx: xMultiple, ny: yMultiple, duration: (xDuration + yDuration) / 2, error };
        }
      }
    }
    nx = best.nx;
    ny = best.ny;
    duration = best.duration;
  }

  duration = clampNumber(duration, 0.25, 86400, 4);
  return {
    dx: sx === 0 ? 0 : Math.sign(sx) * nx * tileW,
    dy: sy === 0 ? 0 : Math.sign(sy) * ny * tileH,
    duration: round(duration)
  };
}

function gradientAnimationName(style) {
  return Number(style.gradientAngleSpeed) >= 0 ? "ormGradientAnglePositive" : "ormGradientAngleNegative";
}

function gradientAnimationDuration(style) {
  const speed = Math.abs(Number(style.gradientAngleSpeed));
  return round(360 / speed);
}

function buildNameHtml(runner, rect = null) {
  return withRunnerStyle(runner, () => {
    const config = state.layout.nameplate;
    const sourceSize = nameSourceSize(rect);
    const plateImage = config.showBox && config.plateMode === "image" && config.plateImage;
    const plateImageMarkup = plateImage ? `<img class="plate-art" src="${escapeAttribute(config.plateImage)}" alt="">` : "";
    const textSvg = nameTextSvgMarkup(runner, sourceSize);
    const pronounsSvg = pronounsTextSvgMarkup(runner, sourceSize);
    const iconRect = state.layout.runnerIcon?.rect || DEFAULT_RUNNER_ICON_RECT;
    const iconMarkup = runner.icon && state.layout.elements.runnerIcon !== false
      ? `<img class="runner-icon" src="${escapeAttribute(runner.icon)}" style="left:${iconRect.x * 100}%;top:${iconRect.y * 100}%;width:${iconRect.width * 100}%;height:${iconRect.height * 100}%;">`
      : "";
    return `<!doctype html><html><body><div class="bar">${plateImageMarkup}${textSvg}${pronounsSvg}${iconMarkup}</div></body><style>${baseHtmlCss()} ${nameplateAnimationCss(config, sourceSize.width, sourceSize.height)}body{font-family:${cssFontStack(config.fontFamily)};color:${config.textColor};text-rendering:geometricPrecision;-webkit-font-smoothing:antialiased;font-stretch:normal;letter-spacing:0;}.bar{${nameplateFrameCss(config, "100%", "100%", sourceSize.width, sourceSize.height)}}.plate-art{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block;z-index:0;pointer-events:none;}.svg-text{position:absolute;inset:0;z-index:1;display:block;pointer-events:none;}.runner-icon{position:absolute;object-fit:contain;display:block;z-index:2;pointer-events:none;}</style></html>`;
  });
}

function nameTextSvgMarkup(runner, sourceSize) {
  if (state.layout.elements.nameText === false) return "";
  const config = state.layout.nameplate;
  const fontSize = nameTextIsUnframed()
    ? Math.max(1, Number(config.fontSize) || state.layout.nameplate.fontSize)
    : Math.min(Number(config.fontSize), sourceSize.height * NAME_FONT_HEIGHT_RATIO);
  const anchor = nameTextAnchor(sourceSize);
  return svgTextMarkup({
    text: runner.name,
    width: sourceSize.width,
    height: sourceSize.height,
    fontFamily: config.fontFamily,
    fontSize,
    fill: config.textColor,
    config,
    align: "left",
    x: anchor.x,
    y: anchor.y,
    textClass: "name-visual-text",
    filterKey: `name-${runner.slot}`
  });
}

const EXAMPLE_PRONOUNS = "they/them";

function pronounsTextSvgMarkup(runner, sourceSize, options = {}) {
  const config = state.layout.pronounsText;
  if (!config) return "";
  // In the preview, when the pronoun text element is being edited, force it to
  // show even if pronouns are disabled or empty (with a placeholder) so it can
  // be positioned easily. OBS output never passes forceShow, so it's unaffected.
  const forceShow = Boolean(options.forceShow);
  if (!config.enabled && !forceShow) return "";

  const text = getRunnerPronouns(runner) || (forceShow ? (options.placeholder || EXAMPLE_PRONOUNS) : "");
  if (!text) return "";

  const fontSize = nameTextIsUnframed()
    ? Math.max(1, Number(config.fontSize) || 28)
    : Math.min(Number(config.fontSize), sourceSize.height * NAME_FONT_HEIGHT_RATIO);
  const anchor = pronounsTextAnchor(sourceSize);

  return svgTextMarkup({
    text,
    width: sourceSize.width,
    height: sourceSize.height,
    fontFamily: config.fontFamily,
    fontSize,
    fill: config.textColor,
    config,
    align: "right",
    x: anchor.x,
    y: anchor.y,
    textClass: "pronouns-visual-text",
    filterKey: `pronouns-${runner.slot}`
  });
}

function pronounsTextAnchor(sourceSize) {
  const config = state.layout.pronounsText;
  const padding = Math.max(0, Number(state.layout.nameplate.platePaddingX) || 0);
  if (!nameTextIsUnframed()) {
    return {
      x: sourceSize.width - padding + (Number(config.textX) || 0),
      y: sourceSize.height / 2 + (Number(config.textY) || 0)
    };
  }

  const name = state.layout.panelGeometry.name;
  return {
    x: (name.x + name.width) * sourceSize.width - padding + (Number(config.textX) || 0),
    y: (name.y + name.height / 2) * sourceSize.height + (Number(config.textY) || 0)
  };
}

function buildFinishHtml(runner) {
  const text = formatRunnerFinalTime(runner);
  const size = finishSourceSize(runner, getCurrentRectBySlot().get(runner.slot));
  const svg = finishTextSvgMarkup(runner, size, text);
  return `<!doctype html><html><body>${svg}</body><style>${baseHtmlCss()} body{display:block;}</style></html>`;
}

// ---------------------------------------------------------------------------
// Finished Screen (results leaderboard)
// The same markup drives the in-app preview overlay and the managed OBS browser
// source, so the animated leaderboard looks identical in both. It is authored
// on a fixed 1920x1080 canvas; the preview simply scales that canvas down.
// ---------------------------------------------------------------------------

function runnerFinishMs(runner) {
  if (runner.finalTimeMs !== null && runner.finalTimeMs !== undefined && runner.finalTimeMs !== "") {
    const numeric = Number(runner.finalTimeMs);
    if (Number.isFinite(numeric)) return numeric;
  }
  const text = String(runner.finalTimeText || "").trim();
  const match = /^(?:(\d+):)?(\d{1,2}):(\d{2})(?:[.,](\d{1,3}))?$/.exec(text);
  if (!match) return null;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  const millis = Number((match[4] || "0").padEnd(3, "0"));
  return ((hours * 60 + minutes) * 60 + seconds) * 1000 + millis;
}

// Parse a clock string (H:MM:SS(.mmm) or M:SS(.mmm)) to milliseconds, or null.
function parseClockToMs(text) {
  const match = /^(?:(\d+):)?(\d{1,2}):(\d{2})(?:[.,](\d{1,3}))?$/.exec(String(text || "").trim());
  if (!match) return null;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  const millis = Number((match[4] || "0").padEnd(3, "0"));
  return ((hours * 60 + minutes) * 60 + seconds) * 1000 + millis;
}

// Signed delta vs PB, formatted like "-1:23" (ahead) / "+0:12" (behind).
function formatPbDelta(deltaMs) {
  const sign = deltaMs < 0 ? "-" : "+";
  const total = Math.abs(Math.round(deltaMs));
  const hours = Math.floor(total / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return hours > 0 ? `${sign}${hours}:${pad(minutes)}:${pad(seconds)}` : `${sign}${minutes}:${pad(seconds)}`;
}

// Unsigned clock magnitude, e.g. "1:23" or "1:02:03".
function formatClockMagnitude(ms) {
  const total = Math.abs(Math.round(ms));
  const hours = Math.floor(total / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

// Whether a runner's PB delta should be shown in the finished screen, per config.
function shouldShowPbDelta(cfg, deltaMs) {
  if (!cfg.pbShowDelta || deltaMs === null) return false;
  if (cfg.pbShowMode !== "threshold") return true;
  const threshold = Math.max(0, Number(cfg.pbThresholdSec) || 0) * 1000;
  return Math.abs(deltaMs) >= threshold;
}

// Ordered standings: finishers ranked by fastest time, then active runners
// without a time as DNF.
function finishedScreenStandings() {
  const participants = state.runners.filter((runner) => runner.active || hasRealRunnerFinalTime(runner));
  const finishers = [];
  const dnf = [];
  for (const runner of participants) {
    const timeText = formatRunnerFinalTime(runner);
    if (hasRealRunnerFinalTime(runner) && timeText) {
      const ms = runnerFinishMs(runner);
      finishers.push({ runner, ms: ms === null ? Number.MAX_SAFE_INTEGER : ms, time: timeText });
    } else {
      dnf.push({ runner });
    }
  }
  finishers.sort((a, b) => (a.ms - b.ms) || (a.runner.slot - b.runner.slot));
  const rows = finishers.map((entry, index) => ({
    place: index + 1,
    name: entry.runner.name,
    time: entry.time,
    dnf: false,
    ms: entry.ms === Number.MAX_SAFE_INTEGER ? null : entry.ms,
    runner: entry.runner
  }));
  for (const entry of dnf) {
    rows.push({ place: null, name: entry.runner.name, time: "DNF", dnf: true, ms: null, runner: entry.runner });
  }
  return rows;
}

// Build inline text-effect CSS (color + drop shadow + stroke) from a config
// block, matching how the rest of the tool renders text.
function fsTextEffectCss({ color, strokeEnabled, strokeColor, strokeWidth, shadowEnabled, shadowColor, shadowBlur, shadowX, shadowY }) {
  const parts = [];
  if (color) parts.push(`color:${color};`);
  parts.push(shadowEnabled
    ? `text-shadow:${Number(shadowX) || 0}px ${Number(shadowY) || 0}px ${Math.max(0, Number(shadowBlur) || 0)}px ${shadowColor};`
    : "text-shadow:none;");
  if (strokeEnabled && Number(strokeWidth) > 0) {
    parts.push(`-webkit-text-stroke:${Number(strokeWidth)}px ${strokeColor};paint-order:stroke fill;`);
  }
  return parts.join("");
}

function formatGapMs(ms) {
  const total = Math.max(0, Math.round(ms));
  const hours = Math.floor(total / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return hours > 0 ? `+${hours}:${pad(minutes)}:${pad(seconds)}` : `+${minutes}:${pad(seconds)}`;
}

// CSS for a full-canvas layer replicating the managed Theme background, so the
// "Show only background" mode looks identical to the OBS Background source. A
// solid black underlay guarantees the live scene is fully hidden.
function finishedScreenBackgroundLayerCss() {
  const layout = state.layout;
  if (layout.backgroundImage) {
    const loop = textureLoop(layout.backgroundScrollX, layout.backgroundScrollY, STAGE.width, STAGE.height, layout.backgroundScale);
    const animation = loop ? `animation:ormBackgroundScroll ${loop.duration}s linear infinite;` : "";
    const scrollVars = loop ? `--orm-bg-scroll-x:${loop.dx}px;--orm-bg-scroll-y:${loop.dy}px;` : "";
    return {
      keyframes: `@keyframes ormBackgroundScroll{from{background-position:0px 0px;}to{background-position:var(--orm-bg-scroll-x) var(--orm-bg-scroll-y);}}`,
      css: `.ofs-bg{position:absolute;inset:0;background-color:#000;background-image:url("${escapeCssString(layout.backgroundImage)}");background-repeat:repeat;background-size:${layout.backgroundScale}% auto;background-position:0px 0px;${scrollVars}${animation}}`
    };
  }
  return {
    keyframes: "",
    css: `.ofs-bg{position:absolute;inset:0;background:linear-gradient(135deg,rgba(45,198,163,.25),transparent 38%),linear-gradient(315deg,rgba(240,184,74,.2),transparent 38%),#11161a;}`
  };
}

function finishedScreenMarkup() {
  const cfg = { ...DEFAULT_FINISHED_SCREEN, ...(state.layout.finishedScreen || {}) };
  const rows = finishedScreenStandings();
  const count = Math.max(rows.length, 1);
  const accent = cfg.accentColor || DEFAULT_FINISHED_SCREEN.accentColor;
  const backdropColor = cfg.backdropColor || DEFAULT_FINISHED_SCREEN.backdropColor;
  const headingFontStack = cssFontStack(cfg.headingFontFamily);
  const runnerFontStack = cssFontStack(cfg.runnerFontFamily);
  const dim = clamp01(Number(cfg.backdropOpacity) / 100);
  const speed = Math.max(120, Number(cfg.rowSpeedMs) || DEFAULT_FINISHED_SCREEN.rowSpeedMs);
  const stagger = Math.max(0, Number(cfg.rowStaggerMs) || 0);
  const showIcons = cfg.showIcons === true;
  const topIcons = [cfg.topIcon1, cfg.topIcon2, cfg.topIcon3];
  const showGaps = cfg.showGaps === true;
  const showUnderline = cfg.showUnderline !== false;
  const showOnlyBackground = cfg.showOnlyBackground === true;
  const bgLayer = showOnlyBackground ? finishedScreenBackgroundLayerCss() : null;
  const showRunnerIcons = cfg.showRunnerIcons === true;
  const iconAfterName = cfg.runnerIconPlacement === "after";
  const bobEnabled = cfg.bobEnabled === true;
  const bobAmp = Math.max(0, Math.min(40, Number(cfg.bobAmplitude) || 0));
  const bobDur = Math.max(0.4, Number(cfg.bobSpeed) || DEFAULT_FINISHED_SCREEN.bobSpeed);
  const bobS = Math.max(0, Math.min(100, Number(cfg.bobSmoothness) ?? 100)) / 100;
  const bobTiming = `cubic-bezier(${(0.42 * bobS).toFixed(3)},0,${(1 - 0.42 * bobS).toFixed(3)},1)`;
  const bobStagger = cfg.bobStagger !== false;
  const pbFontStack = cssFontStack(cfg.pbFontFamily || DEFAULT_FINISHED_SCREEN.pbFontFamily);
  const pbEffect = fsTextEffectCss({ color: cfg.pbColor, strokeEnabled: cfg.pbStrokeEnabled, strokeColor: cfg.pbStrokeColor, strokeWidth: cfg.pbStrokeWidth, shadowEnabled: cfg.pbShadowEnabled, shadowColor: cfg.pbShadowColor, shadowBlur: cfg.pbShadowBlur, shadowX: cfg.pbShadowX, shadowY: cfg.pbShadowY });

  const gap = 16;
  const areaHeight = 720;
  const maxRowHeight = 96;
  let rowHeight = Math.floor((areaHeight - gap * (count - 1)) / count);
  rowHeight = Math.max(46, Math.min(maxRowHeight, rowHeight));
  const rowScale = rowHeight / maxRowHeight;
  const runnerBase = Math.max(10, Number(cfg.runnerFontSize) || DEFAULT_FINISHED_SCREEN.runnerFontSize);
  const nameFont = Math.max(12, Math.round(runnerBase * rowScale));
  const timeFont = Math.max(12, Math.round(runnerBase * 1.05 * rowScale));
  const gapFont = Math.max(10, Math.round(runnerBase * 0.5 * rowScale));
  const pbFont = Math.max(10, Math.round((Number(cfg.pbFontSize) || DEFAULT_FINISHED_SCREEN.pbFontSize) * rowScale));
  const pbColWidth = Math.round(pbFont * 8.5); // fixed reserve so the time never shifts
  const placeFont = Math.max(12, Math.round(runnerBase * 0.85 * rowScale));
  const badgeSize = Math.round(rowHeight * 0.78);
  const headingFont = Math.max(12, Number(cfg.headingFontSize) || DEFAULT_FINISHED_SCREEN.headingFontSize);

  const nameEffect = fsTextEffectCss({ color: cfg.runnerColor, strokeEnabled: cfg.runnerStrokeEnabled, strokeColor: cfg.runnerStrokeColor, strokeWidth: cfg.runnerStrokeWidth, shadowEnabled: cfg.runnerShadowEnabled, shadowColor: cfg.runnerShadowColor, shadowBlur: cfg.runnerShadowBlur, shadowX: cfg.runnerShadowX, shadowY: cfg.runnerShadowY });
  const timeEffect = fsTextEffectCss({ color: accent, strokeEnabled: cfg.runnerStrokeEnabled, strokeColor: cfg.runnerStrokeColor, strokeWidth: cfg.runnerStrokeWidth, shadowEnabled: cfg.runnerShadowEnabled, shadowColor: cfg.runnerShadowColor, shadowBlur: cfg.runnerShadowBlur, shadowX: cfg.runnerShadowX, shadowY: cfg.runnerShadowY });
  const headingEffect = fsTextEffectCss({ color: cfg.headingColor, strokeEnabled: cfg.headingStrokeEnabled, strokeColor: cfg.headingStrokeColor, strokeWidth: cfg.headingStrokeWidth, shadowEnabled: cfg.headingShadowEnabled, shadowColor: cfg.headingShadowColor, shadowBlur: cfg.headingShadowBlur, shadowX: cfg.headingShadowX, shadowY: cfg.headingShadowY });

  const firstFinisher = rows.find((row) => !row.dnf);
  const leaderMs = firstFinisher && Number.isFinite(firstFinisher.ms) ? firstFinisher.ms : null;

  const rowsHtml = rows.map((row, index) => {
    const isFirst = row.place === 1;
    const icon = showIcons && !row.dnf && row.place <= 3 ? topIcons[row.place - 1] : "";
    const badgeClass = row.dnf
      ? "ofs-badge-dnf"
      : (icon ? "ofs-badge-icon" : (row.place <= 3 ? `ofs-badge-${row.place}` : ""));
    const badgeInner = row.dnf
      ? "&mdash;"
      : (icon ? `<img class="ofs-badge-img" src="${escapeAttribute(icon)}" alt="">` : escapeHtml(String(row.place)));
    const delay = Math.round(index * stagger);
    let gapHtml = "";
    if (showGaps) {
      const gapText = (!row.dnf && !isFirst && Number.isFinite(row.ms) && Number.isFinite(leaderMs))
        ? formatGapMs(row.ms - leaderMs)
        : "";
      gapHtml = `<div class="ofs-gap">${escapeHtml(gapText)}</div>`;
    }

    const runnerIcon = showRunnerIcons && row.runner?.icon
      ? `<img class="ofs-runner-icon" src="${escapeAttribute(row.runner.icon)}" alt="">`
      : "";
    // Keep the icon hugging the name: for "after" it sits right after the name
    // text, for "before" it leads the name — not floated to the far edge.
    const nameHtml = `<div class="ofs-name">${escapeHtml(row.name || "")}</div>`;
    const nameSection = `<div class="ofs-nameblock">${runnerIcon && !iconAfterName ? runnerIcon : ""}${nameHtml}${runnerIcon && iconAfterName ? runnerIcon : ""}</div>`;

    // When PB comparison is enabled, every row reserves a fixed-width PB column
    // on the right so the time column stays put whether or not a given runner has
    // a delta to show. It sits inside .ofs-rowinner, so it bobs with the plate.
    let pbHtml = "";
    if (cfg.pbShowDelta) {
      let pbText = "";
      if (!row.dnf && Number.isFinite(row.ms) && row.runner) {
        const pbMs = parseClockToMs(row.runner.pb);
        if (pbMs !== null) {
          const deltaMs = row.ms - pbMs;
          if (shouldShowPbDelta(cfg, deltaMs)) {
            const magnitude = formatClockMagnitude(deltaMs);
            const template = deltaMs < 0
              ? (cfg.pbNewText ?? DEFAULT_FINISHED_SCREEN.pbNewText)
              : (cfg.pbDeltaText ?? DEFAULT_FINISHED_SCREEN.pbDeltaText);
            pbText = String(template).replace(/\{delta\}/g, magnitude);
          }
        }
      }
      pbHtml = `<div class="ofs-pb">${escapeHtml(pbText)}</div>`;
    }

    const bobStyle = bobEnabled && bobStagger ? ` style="animation-delay:${(-(index * 0.35)).toFixed(2)}s;"` : "";
    // Outer element runs the entrance stagger; the inner element is the visible
    // plate and runs the bob, so the whole plate (background included) bobs.
    return `<div class="ofs-row${row.dnf ? " ofs-dnf" : ""}${isFirst ? " ofs-first" : ""}" style="height:${rowHeight}px;animation-delay:${delay}ms;">`
      + `<div class="ofs-rowinner"${bobStyle}>`
      + `<div class="ofs-badge ${badgeClass}">${badgeInner}</div>`
      + nameSection
      + `<div class="ofs-time">${escapeHtml(row.time || "")}</div>`
      + gapHtml
      + pbHtml
      + `</div>`
      + `</div>`;
  }).join("");
  const emptyHtml = rows.length ? "" : `<div class="ofs-empty">Awaiting finishers…</div>`;

  const underlineCss = showUnderline
    ? `.ofs-heading::after{content:"";position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:230px;height:5px;border-radius:3px;background:linear-gradient(90deg, rgba(0,0,0,0), ${accent}, rgba(0,0,0,0));}`
    : "";

  const style = `
${bgLayer ? bgLayer.keyframes : ""}
.ofs-root{position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden;font-family:${runnerFontStack};}
${bgLayer ? bgLayer.css : ""}
.ofs-backdrop{position:absolute;inset:0;background:radial-gradient(130% 100% at 50% 24%, rgba(0,0,0,0) 0%, rgba(0,0,0,${(dim * 0.28).toFixed(3)}) 100%), ${hexToRgba(backdropColor, dim)};}
.ofs-panel{position:absolute;left:50%;top:92px;transform:translateX(-50%);width:1180px;}
.ofs-heading{font-family:${headingFontStack};font-size:${headingFont}px;font-weight:900;letter-spacing:6px;text-align:center;text-transform:uppercase;margin:0 0 44px;padding-bottom:18px;position:relative;opacity:0;animation:ofsHeadIn ${speed}ms cubic-bezier(0.22,1,0.36,1) both;${headingEffect}}
${underlineCss}
.ofs-rows{display:flex;flex-direction:column;gap:${gap}px;}
.ofs-row{position:relative;height:${rowHeight}px;opacity:0;animation:ofsRowIn ${speed}ms cubic-bezier(0.34,1.4,0.5,1) both;}
.ofs-rowinner{height:100%;display:flex;align-items:center;gap:26px;padding:0 30px;border-radius:14px;background:linear-gradient(90deg, ${hexToRgba(accent, 0.16)} 0%, rgba(255,255,255,0.05) 8%, rgba(255,255,255,0.05) 100%);border:1px solid rgba(255,255,255,0.10);box-shadow:0 8px 22px rgba(0,0,0,0.38);box-sizing:border-box;${bobEnabled ? `animation:ofsBob ${bobDur}s ${bobTiming} infinite;` : ""}}
.ofs-nameblock{flex:1 1 auto;display:flex;align-items:center;gap:16px;min-width:0;}
.ofs-runner-icon{flex:0 0 auto;height:${badgeSize}px;width:${badgeSize}px;object-fit:contain;display:block;}
.ofs-pb{flex:0 0 auto;width:${pbColWidth}px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:right;font-family:${pbFontStack};font-size:${pbFont}px;font-weight:800;font-variant-numeric:tabular-nums;${pbEffect}}
.ofs-badge{flex:0 0 auto;width:${badgeSize}px;height:${badgeSize}px;display:flex;align-items:center;justify-content:center;border-radius:12px;font-size:${placeFont}px;font-weight:900;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);overflow:hidden;}
.ofs-badge-icon{background:transparent;border:1px solid rgba(255,255,255,0.18);padding:0;}
.ofs-badge-img{width:100%;height:100%;object-fit:contain;display:block;}
.ofs-badge-1{background:linear-gradient(145deg,#f7d774,#e0a52e);color:#3a2a00;border:1px solid rgba(255,255,255,0.55);box-shadow:0 0 18px ${hexToRgba(accent, 0.6)};}
.ofs-badge-2{background:linear-gradient(145deg,#eef1f6,#a9b4c2);color:#26303a;border:1px solid rgba(255,255,255,0.55);}
.ofs-badge-3{background:linear-gradient(145deg,#e6a76b,#b06f37);color:#2e1600;border:1px solid rgba(255,255,255,0.45);}
.ofs-badge-dnf{color:rgba(255,255,255,0.5);}
.ofs-name{flex:0 1 auto;font-size:${nameFont}px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;${nameEffect}}
.ofs-time{flex:0 0 auto;font-size:${timeFont}px;font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:1px;${timeEffect}}
.ofs-gap{flex:0 0 auto;min-width:120px;text-align:right;font-size:${gapFont}px;font-weight:700;font-variant-numeric:tabular-nums;color:${hexToRgba(accent, 0.7)};}
.ofs-first .ofs-rowinner{background:linear-gradient(90deg, ${hexToRgba(accent, 0.42)} 0%, ${hexToRgba(accent, 0.16)} 58%, ${hexToRgba(accent, 0.07)} 100%);border:2px solid ${hexToRgba(accent, 0.85)};animation:${bobEnabled ? `ofsBob ${bobDur}s ${bobTiming} infinite, ` : ""}ofsFirstGlow 2.6s ease-in-out infinite;}
.ofs-first .ofs-name{font-size:${Math.round(nameFont * 1.1)}px;font-weight:800;}
.ofs-first .ofs-time{font-size:${Math.round(timeFont * 1.1)}px;}
.ofs-dnf{filter:saturate(0.6);}
.ofs-dnf .ofs-name{opacity:0.6;}
.ofs-dnf .ofs-time{opacity:0.55;letter-spacing:2px;}
.ofs-empty{text-align:center;font-size:34px;font-weight:700;color:#ffffff;opacity:0.7;padding:60px 0;}
@keyframes ofsRowIn{from{opacity:0;transform:translateY(46px) scale(0.96);}to{opacity:1;transform:translateY(0) scale(1);}}
@keyframes ofsHeadIn{from{opacity:0;transform:translateY(-26px);}to{opacity:1;transform:translateY(0);}}
@keyframes ofsBob{0%,100%{transform:translateY(${(-bobAmp).toFixed(1)}px);}50%{transform:translateY(${bobAmp.toFixed(1)}px);}}
@keyframes ofsFirstGlow{0%,100%{box-shadow:0 10px 34px ${hexToRgba(accent, 0.3)}, inset 0 0 24px ${hexToRgba(accent, 0.1)};}50%{box-shadow:0 12px 46px ${hexToRgba(accent, 0.55)}, inset 0 0 34px ${hexToRgba(accent, 0.18)};}}
`;

  return `<style>${style}</style><div class="ofs-root">${bgLayer ? `<div class="ofs-bg"></div>` : ""}<div class="ofs-backdrop"></div><div class="ofs-panel"><div class="ofs-heading">${escapeHtml(cfg.heading || DEFAULT_FINISHED_SCREEN.heading)}</div><div class="ofs-rows">${rowsHtml}${emptyHtml}</div></div></div>`;
}

// `nonce` makes the generated data URL unique so OBS reloads the browser source
// (replaying the CSS entrance animation) even when the standings are unchanged.
function buildFinishedScreenHtml(nonce = "") {
  const nonceMeta = nonce ? `<meta name="orm-nonce" content="${escapeAttribute(String(nonce))}">` : "";
  return `<!doctype html><html><head><meta charset="utf-8">${nonceMeta}<style>${baseHtmlCss()} body{display:block;background:rgba(0,0,0,0);}</style></head><body>${finishedScreenMarkup()}</body></html>`;
}

function finishTextSvgMarkup(runner, size, text = formatRunnerFinalTime(runner)) {
  const config = state.layout.finishedTime;
  const pad = textEffectPadding(config, 0);
  const fontSize = Math.max(1, Number(config.fontSize) || DEFAULT_FINISHED_TIME.fontSize);
  const align = config.align || "right";
  const x = align === "left" ? pad : align === "center" ? size.width / 2 : size.width - pad;
  return svgTextMarkup({
    text,
    width: size.width,
    height: size.height,
    fontFamily: config.fontFamily,
    fontSize,
    fill: config.color,
    config,
    align,
    x,
    y: size.height / 2,
    textClass: "finish-visual-text",
    filterKey: `finish-${runner.slot}`
  });
}

function svgTextMarkup({ id = "", text, width, height, fontFamily, fontSize, fill, config, align = "left", x, y, textClass = "", filterKey = "" }) {
  const strokeWidth = config.strokeEnabled ? Math.max(0, Number(config.strokeWidth) || 0) : 0;
  const strokeAttrs = strokeWidth > 0
    ? `stroke="${escapeAttribute(config.strokeColor)}" stroke-width="${strokeWidth}" paint-order="stroke fill" stroke-linejoin="round" stroke-linecap="round"`
    : `stroke="none" stroke-width="0"`;
  const filterId = `shadow-${filterKey ? safeSvgId(filterKey) : Math.random().toString(36).slice(2)}`;
  const filterAttr = config.shadowEnabled ? ` filter="url(#${filterId})"` : "";
  const filter = config.shadowEnabled
    ? `<defs><filter id="${filterId}" x="-50%" y="-80%" width="200%" height="260%"><feDropShadow dx="${Number(config.shadowX) || 0}" dy="${Number(config.shadowY) || 0}" stdDeviation="${Math.max(0, Number(config.shadowBlur) || 0) / 2}" flood-color="${escapeAttribute(config.shadowColor)}" flood-opacity="1"/></filter></defs>`
    : "";
  const anchor = align === "center" ? "middle" : align === "right" ? "end" : "start";
  const idAttr = id ? ` id="${escapeAttribute(id)}"` : "";
  const classAttr = textClass ? ` class="${escapeAttribute(textClass)}"` : "";
  return `<svg class="svg-text" xmlns="http://www.w3.org/2000/svg" width="${Math.max(1, Math.round(width))}" height="${Math.max(1, Math.round(height))}" viewBox="0 0 ${Math.max(1, Math.round(width))} ${Math.max(1, Math.round(height))}" preserveAspectRatio="none">${filter}<text${idAttr}${classAttr} x="${round(x)}" y="${round(y)}" dominant-baseline="central" text-anchor="${anchor}" font-family="${escapeAttribute(svgFontFamily(fontFamily))}" font-size="${round(fontSize)}" font-weight="900" fill="${escapeAttribute(fill)}" ${strokeAttrs}${filterAttr}>${escapeHtml(text)}</text></svg>`;
}

function svgFontFamily(value) {
  return `${String(value || "Segoe UI").split(",")[0].replaceAll("\"", "").replaceAll("'", "").trim() || "Segoe UI"}, Arial, sans-serif`;
}

function safeSvgId(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "-");
}

function nameplateFrameCss(config, width = "100%", height = "100%", sourceWidth = typeof width === "number" ? width : 960, sourceHeight = typeof height === "number" ? height : 120) {
  const background = nameplateBackgroundCss(config, sourceWidth, sourceHeight);
  const borderWidth = Math.max(0, Number(config.plateBorderWidth) || 0);
  const borderColor = hexToRgba(config.plateBorderColor, Number(config.plateBorderOpacity) / 100);
  const border = config.showBorder ? `${borderWidth}px solid ${borderColor}` : `${borderWidth}px solid transparent`;
  const generatedPlate = config.plateMode !== "image";
  const plateBackground = generatedPlate && config.showBox ? background : "transparent";
  const plateBorder = generatedPlate ? border : `${borderWidth}px solid transparent`;

  const radius = Math.max(0, Number(config.plateRadius) || 0);

  return `position:absolute;left:0;top:0;width:${typeof width === "number" ? `${width}px` : width};height:${typeof height === "number" ? `${height}px` : height};display:flex;align-items:center;justify-content:space-between;gap:2%;padding:0 ${Math.max(0, Number(config.platePaddingX) || 0)}px;${plateBackground}border:${plateBorder};border-radius:${radius}px;overflow:hidden;box-sizing:border-box;transform-origin:0 0;background-clip:padding-box;`;
}

function nameplateBackgroundCss(config, sourceWidth = 960, sourceHeight = 120, textureAnimationName = "ormNameplateTexture") {
  const alpha = Number(config.plateBackgroundOpacity) / 100;
  if (config.plateFillMode === "gradient") {
    const angle = config.plateAnimateGradientAngle ? "var(--orm-gradient-angle)" : `${config.plateGradientAngle}deg`;
    const animation = config.plateAnimateGradientAngle && Number(config.plateGradientAngleSpeed) !== 0
      ? `animation:${gradientAnimationName({ gradientAngleSpeed: config.plateGradientAngleSpeed })} ${gradientAnimationDuration({ gradientAngleSpeed: config.plateGradientAngleSpeed })}s linear infinite;`
      : "";
    return `--orm-gradient-angle-start:${config.plateGradientAngle}deg;--orm-gradient-angle:${config.plateGradientAngle}deg;background:linear-gradient(${angle}, ${hexToRgba(config.plateGradientFrom, alpha)}, ${hexToRgba(config.plateGradientTo, alpha)});${animation}`;
  }
  if (config.plateFillMode === "texture" && config.plateTextureImage) {
    return `background-color:${hexToRgba(config.plateBackgroundColor, alpha)};background-image:url("${escapeCssString(config.plateTextureImage)}");background-size:${config.plateTextureScale}% ${config.plateTextureScale}%;background-position:${config.plateTextureX}% ${config.plateTextureY}%;background-repeat:repeat;${textureScrollAnimationCss(config.plateTextureScrollX, config.plateTextureScrollY, textureAnimationName, sourceWidth, sourceHeight, config.plateTextureScale)}`;
  }
  return `background:${hexToRgba(config.plateBackgroundColor, alpha)};`;
}

function nameplateAnimationCss(config, sourceWidth = 960, sourceHeight = 120, textureAnimationName = "ormNameplateTexture") {
  const needsGradient = config.plateFillMode === "gradient" && config.plateAnimateGradientAngle && Number(config.plateGradientAngleSpeed) !== 0;
  const needsTexture = config.plateFillMode === "texture" && config.plateTextureImage && (Number(config.plateTextureScrollX) !== 0 || Number(config.plateTextureScrollY) !== 0);
  let css = "";
  if (needsGradient) css += borderAnimationCss({ mode: "gradient", animateGradientAngle: true, gradientAngleSpeed: config.plateGradientAngleSpeed, gradientAngle: config.plateGradientAngle });
  if (needsTexture) css += textureScrollKeyframesCss(config.plateTextureScrollX, config.plateTextureScrollY, textureAnimationName, sourceWidth, sourceHeight, config.plateTextureScale, config.plateTextureX, config.plateTextureY);
  return css;
}

function nameplateContentCss(config, sourceSize = null) {
  if (sourceSize && nameTextIsUnframed()) {
    const name = state.layout.panelGeometry.name;
    const padding = Math.max(0, Number(config.platePaddingX) || 0);
    const left = name.x * sourceSize.width + padding;
    const top = (name.y + name.height / 2) * sourceSize.height;
    return `position:absolute;left:${round(left)}px;top:${round(top)}px;z-index:1;display:inline-flex;align-items:center;gap:14px;width:max-content;max-width:none;min-width:max-content;overflow:visible;transform:translate(${Number(config.textX) || 0}px, calc(-50% + ${Number(config.textY) || 0}px));`;
  }
  return `position:relative;z-index:1;display:inline-flex;align-items:center;gap:14px;width:max-content;max-width:none;min-width:max-content;overflow:visible;transform:translate(${Number(config.textX) || 0}px, ${Number(config.textY) || 0}px);`;
}

function nameplateStrongCss(config, heightLimit = `${NAME_FONT_HEIGHT_RATIO * 100}vh`) {
  const shadow = nameTextShadowCss(config);
  const pad = textEffectPadding(config);
  return `display:block;flex:0 0 auto;min-width:max-content;max-width:none;padding:${pad}px;margin:-${pad}px;font-size:min(${config.fontSize}px,${heightLimit});font-weight:800;line-height:1;white-space:nowrap;overflow:visible;text-overflow:clip;color:${config.textColor};${shadow}`;
}

function pronounsplateContentCss(config, sourceSize = null) {
  const padding = Math.max(0, Number(state.layout.nameplate.platePaddingX) || 0);
  if (sourceSize && nameTextIsUnframed()) {
    const name = state.layout.panelGeometry.name;
    const right = (1 - (name.x + name.width)) * sourceSize.width + padding;
    const top = (name.y + name.height / 2) * sourceSize.height;
    return `position:absolute;right:${round(right)}px;top:${round(top)}px;z-index:2;display:inline-flex;align-items:center;width:max-content;max-width:none;min-width:max-content;overflow:visible;transform:translate(${Number(config.textX) || 0}px, calc(-50% + ${Number(config.textY) || 0}px));`;
  }
  return `position:absolute;right:${padding}px;top:50%;z-index:2;display:inline-flex;align-items:center;width:max-content;max-width:none;min-width:max-content;overflow:visible;transform:translate(${Number(config.textX) || 0}px, calc(-50% + ${Number(config.textY) || 0}px));`;
}

function pronounsplateStrongCss(config, heightLimit = `${NAME_FONT_HEIGHT_RATIO * 100}vh`) {
  const pad = textEffectPadding(config);
  return `display:block;flex:0 0 auto;min-width:max-content;max-width:none;padding:${pad}px;margin:-${pad}px;font-size:min(${config.fontSize}px,${heightLimit});font-weight:800;line-height:1;white-space:nowrap;overflow:visible;text-overflow:clip;`;
}

function nameplateFinishCss(config, heightLimit = `${NAME_FONT_HEIGHT_RATIO * 100}vh`) {
  const shadow = nameTextShadowCss(config);
  return `flex:0 0 auto;font-style:normal;font-size:min(${Math.round(config.fontSize * 0.72)}px,${heightLimit});font-weight:900;line-height:1;white-space:nowrap;color:${config.badgeColor};${shadow}`;
}

function nameTextShadowCss(config) {
  const shadows = [];
  if (config.shadowEnabled) {
    shadows.push(`${config.shadowX}px ${config.shadowY}px ${config.shadowBlur}px ${config.shadowColor}`);
  }

  const shadow = shadows.length > 0 ? `text-shadow:${shadows.join(",")};` : "text-shadow:none;";
  return `${shadow}${nativeTextStrokeCss(config)}`;
}

function finishTextCss(config, heightLimit = "72vh") {
  return `display:block;max-width:100%;overflow:visible;text-overflow:clip;white-space:nowrap;font-size:min(${config.fontSize}px,${heightLimit});font-weight:900;line-height:1;color:${config.color};${textEffectCss(config)}`;
}

function textEffectCss(config) {
  const value = textEffectShadowValue(config);
  const shadow = value === "none" ? "text-shadow:none;" : `text-shadow:${value};`;
  return `${shadow}${nativeTextStrokeCss(config)}`;
}

function textEffectShadowValue(config) {
  const shadows = [];
  if (config.shadowEnabled) {
    shadows.push(`${config.shadowX}px ${config.shadowY}px ${config.shadowBlur}px ${config.shadowColor}`);
  }
  return shadows.length > 0 ? shadows.join(",") : "none";
}

function textEffectPadding(config, minimum = 4) {
  const stroke = config.strokeEnabled ? Math.ceil((Number(config.strokeWidth) || 0) / 2) + 2 : 0;
  const shadow = config.shadowEnabled
    ? Math.abs(Number(config.shadowX) || 0) + Math.abs(Number(config.shadowY) || 0) + Number(config.shadowBlur || 0) + 2
    : 0;
  return Math.ceil(Math.max(stroke, shadow, minimum));
}

function finishJustify(align) {
  if (align === "left") return "start";
  if (align === "center") return "center";
  return "end";
}

async function browseInstalledFonts() {
  for (const button of [els.browseFonts, els.timerBrowseFonts, els.finishBrowseFonts, els.raceInfoBrowseFonts, els.browsePronounsFonts, els.finishedScreenHeadingBrowseFonts, els.finishedScreenRunnerBrowseFonts, els.commBrowseFonts]) if (button) button.disabled = true;
  setFontStatus("Looking for installed fonts...");
  try {
    if ("queryLocalFonts" in window) {
      const localFonts = await window.queryLocalFonts();
      const fonts = uniqueSorted(localFonts.map((font) => font.family).filter(Boolean));
      if (fonts.length > 0) {
        populateFontChoices(fonts, `${fonts.length} installed fonts loaded.`);
        return;
      }
    }

    const detected = detectAvailableFonts(COMMON_FONT_FACES);
    const reason = window.isSecureContext
      ? "Local font access is unavailable in this browser"
      : "Full font browsing needs Chrome or Edge from localhost";
    populateFontChoices(detected, `${reason}. Showing ${detected.length} detected common fonts.`);
  } catch (error) {
    const detected = detectAvailableFonts(COMMON_FONT_FACES);
    populateFontChoices(detected, `Font permission was not granted. Showing ${detected.length} detected common fonts.`);
  } finally {
    for (const button of [els.browseFonts, els.timerBrowseFonts, els.finishBrowseFonts, els.raceInfoBrowseFonts, els.browsePronounsFonts, els.finishedScreenHeadingBrowseFonts, els.finishedScreenRunnerBrowseFonts, els.commBrowseFonts]) if (button) button.disabled = false;
  }
}

function populateFontChoices(fonts, status = "") {
  const names = uniqueSorted(fonts.length > 0 ? fonts : COMMON_FONT_FACES);
  els.nameFontChoices.replaceChildren(...names.map((font) => {
    const option = document.createElement("option");
    option.value = font;
    return option;
  }));
  els.timerFontChoices.replaceChildren(...names.map((font) => {
    const option = document.createElement("option");
    option.value = font;
    return option;
  }));
  els.raceInfoFontChoices.replaceChildren(...names.map((font) => {
    const option = document.createElement("option");
    option.value = font;
    return option;
  }));
  els.finishFontChoices.replaceChildren(...names.map((font) => {
    const option = document.createElement("option");
    option.value = font;
    return option;
  }));
  els.pronounsFontChoices.replaceChildren(...names.map((font) => {
    const option = document.createElement("option");
    option.value = font;
    return option;
  }));
  if (els.finishedScreenFontChoices) els.finishedScreenFontChoices.replaceChildren(...names.map((font) => {
    const option = document.createElement("option");
    option.value = font;
    return option;
  }));
  if (els.commFontChoices) els.commFontChoices.replaceChildren(...names.map((font) => {
    const option = document.createElement("option");
    option.value = font;
    return option;
  }));
  els.nameFontBrowser.replaceChildren(
    selectOption("", "Choose a font..."),
    ...names.map((font) => selectOption(font, font))
  );
  els.timerFontBrowser.replaceChildren(
    selectOption("", "Choose a font..."),
    ...names.map((font) => selectOption(font, font))
  );
  els.raceInfoFontBrowser.replaceChildren(
    selectOption("", "Choose a font..."),
    ...names.map((font) => selectOption(font, font))
  );
  els.finishFontBrowser.replaceChildren(
    selectOption("", "Choose a font..."),
    ...names.map((font) => selectOption(font, font))
  );
  els.pronounsFontBrowser.replaceChildren(
    selectOption("", "Choose a font..."),
    ...names.map((font) => selectOption(font, font))
  );
  if (els.finishedScreenHeadingFontBrowser) els.finishedScreenHeadingFontBrowser.replaceChildren(
    selectOption("", "Choose a font..."),
    ...names.map((font) => selectOption(font, font))
  );
  if (els.finishedScreenRunnerFontBrowser) els.finishedScreenRunnerFontBrowser.replaceChildren(
    selectOption("", "Choose a font..."),
    ...names.map((font) => selectOption(font, font))
  );
  if (els.commFontBrowser) els.commFontBrowser.replaceChildren(
    selectOption("", "Choose a font..."),
    ...names.map((font) => selectOption(font, font))
  );
  els.nameFontBrowser.value = names.includes(state.layout.nameplate.fontFamily) ? state.layout.nameplate.fontFamily : "";
  els.timerFontBrowser.value = names.includes(state.layout.timerText.fontFamily) ? state.layout.timerText.fontFamily : "";
  els.raceInfoFontBrowser.value = names.includes(state.layout.raceInfo.fontFamily) ? state.layout.raceInfo.fontFamily : "";
  els.finishFontBrowser.value = names.includes(state.layout.finishedTime.fontFamily) ? state.layout.finishedTime.fontFamily : "";
  els.pronounsFontBrowser.value = names.includes(state.layout.pronounsText.fontFamily) ? state.layout.pronounsText.fontFamily : "";
  const fsCfg = { ...DEFAULT_FINISHED_SCREEN, ...(state.layout.finishedScreen || {}) };
  if (els.finishedScreenHeadingFontBrowser) els.finishedScreenHeadingFontBrowser.value = names.includes(fsCfg.headingFontFamily) ? fsCfg.headingFontFamily : "";
  if (els.finishedScreenRunnerFontBrowser) els.finishedScreenRunnerFontBrowser.value = names.includes(fsCfg.runnerFontFamily) ? fsCfg.runnerFontFamily : "";
  if (els.commFontBrowser) els.commFontBrowser.value = names.includes(state.layout.commentators.fontFamily) ? state.layout.commentators.fontFamily : "";
  if (status) setFontStatus(status);
}

function selectOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function setFontStatus(message) {
  els.fontStatus.textContent = message;
  els.timerFontStatus.textContent = message;
  if (els.pronounsFontStatus) els.pronounsFontStatus.textContent = message;
}

function detectAvailableFonts(fonts) {
  return fonts.filter(isFontProbablyAvailable);
}

function isFontProbablyAvailable(font) {
  const text = "mmmmmmmmmmlliWW@@";
  const size = "72px";
  const canvas = isFontProbablyAvailable.canvas ?? document.createElement("canvas");
  isFontProbablyAvailable.canvas = canvas;
  const context = canvas.getContext("2d");
  const baselines = ["monospace", "serif", "sans-serif"].map((fallback) => {
    context.font = `${size} ${fallback}`;
    return context.measureText(text).width;
  });

  return ["monospace", "serif", "sans-serif"].some((fallback, index) => {
    context.font = `${size} "${font}", ${fallback}`;
    return Math.abs(context.measureText(text).width - baselines[index]) > 0.1;
  });
}

function uniqueSorted(values) {
  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
}

function cssFontStack(value) {
  const face = String(value || "Segoe UI")
    .split(",")[0]
    .replaceAll("\"", "")
    .replaceAll("'", "")
    .trim() || "Segoe UI";
  return `"${escapeCssString(face)}", Arial, sans-serif`;
}

function hexToRgba(value, alpha = 1) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(value).trim());
  if (!match) return `rgba(255,255,255,${alpha})`;
  return `rgba(${parseInt(match[1], 16)},${parseInt(match[2], 16)},${parseInt(match[3], 16)},${Math.max(0, Math.min(1, Number(alpha)))})`;
}

function htmlDataUrl(html) {
  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

function baseHtmlCss() {
  return "html,body{margin:0;width:100%;height:100%;overflow:hidden;background:rgba(0,0,0,0)!important;box-sizing:border-box;}*{box-sizing:border-box;}";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function escapeCssValue(value) {
  return String(value).replace(/[<>{};]/g, "");
}

function escapeCssString(value) {
  return String(value).replace(/[\\"]/g, "\\$&").replace(/[\n\r\f]/g, " ");
}

class ObsWebSocketClient {
  constructor() {
    this.socket = null;
    this.pending = new Map();
    this.pendingBatches = new Map();
    this.onClose = null;
  }

  async connect({ host, port, password, onAttempt }) {
    const attempts = buildConnectionAttempts(host, port);
    let lastError = null;

    for (const attempt of attempts) {
      try {
        onAttempt?.(`Trying ${attempt.label}...`);
        return await this.connectOnce({ ...attempt, password });
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError ?? new Error("Could not connect to OBS");
  }

  async connectOnce({ url, protocol, password }) {
    this.socket = protocol ? new WebSocket(url, protocol) : new WebSocket(url);
    this.socket.addEventListener("message", (event) => this.handleMessage(event));
    this.socket.addEventListener("close", (event) => {
      for (const pending of this.pending.values()) pending.reject(new Error("OBS websocket closed"));
      this.pending.clear();
      for (const pending of this.pendingBatches.values()) pending.reject(new Error("OBS websocket closed"));
      this.pendingBatches.clear();
      this.onClose?.(event);
    });

    const hello = await new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error("Timed out waiting for OBS hello")), 5000);
      const onMessage = function onMessage(event) {
        const message = JSON.parse(event.data);
        if (message.op !== 0) return;
        window.clearTimeout(timeout);
        this.socket.removeEventListener("message", onMessage);
        this.socket.removeEventListener("close", onClose);
        resolve(message.d);
      }.bind(this);
      const onClose = (event) => {
        window.clearTimeout(timeout);
        this.socket.removeEventListener("message", onMessage);
        reject(new Error(`OBS closed before hello. Code ${event.code}${event.reason ? `: ${event.reason}` : ""}`));
      };
      this.socket.addEventListener("message", onMessage);
      this.socket.addEventListener("close", onClose, { once: true });
      this.socket.addEventListener("error", () => reject(new Error("Could not open websocket")), { once: true });
    });

    const identify = { rpcVersion: hello.rpcVersion ?? 1, eventSubscriptions: 0 };
    if (hello.authentication) {
      identify.authentication = await createObsAuthentication(password, hello.authentication.salt, hello.authentication.challenge);
    }

    this.socket.send(JSON.stringify({ op: 1, d: identify }));

    await new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error("Timed out waiting for OBS identify response")), 5000);
      const onMessage = function onMessage(event) {
        const message = JSON.parse(event.data);
        if (message.op !== 2) return;
        window.clearTimeout(timeout);
        this.socket.removeEventListener("message", onMessage);
        this.socket.removeEventListener("close", onClose);
        resolve();
      }.bind(this);
      const onClose = (event) => {
        window.clearTimeout(timeout);
        this.socket.removeEventListener("message", onMessage);
        reject(new Error(`OBS closed during authentication. Code ${event.code}${event.reason ? `: ${event.reason}` : ""}`));
      };
      this.socket.addEventListener("message", onMessage);
      this.socket.addEventListener("close", onClose, { once: true });
    });

    return hello;
  }

  call(requestType, requestData = {}) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error("OBS websocket is not connected"));
    }

    const requestId = crypto.randomUUID();
    const payload = {
      op: 6,
      d: { requestType, requestId, requestData }
    };

    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        this.pending.delete(requestId);
        reject(new Error(`${requestType} timed out`));
      }, 8000);

      this.pending.set(requestId, { resolve, reject, timeout });
      this.socket.send(JSON.stringify(payload));
    });
  }

  batch(requests) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error("OBS websocket is not connected"));
    }

    const requestId = crypto.randomUUID();
    const payload = {
      op: 8,
      d: {
        requestId,
        haltOnFailure: false,
        executionType: 0,
        requests
      }
    };

    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        this.pendingBatches.delete(requestId);
        reject(new Error("OBS request batch timed out"));
      }, 8000);

      this.pendingBatches.set(requestId, { resolve, reject, timeout });
      this.socket.send(JSON.stringify(payload));
    });
  }

  handleMessage(event) {
    const message = JSON.parse(event.data);
    if (message.op === 9) {
      this.handleBatchResponse(message);
      return;
    }

    if (message.op !== 7) return;

    const { requestId, requestType, requestStatus, responseData } = message.d;
    const pending = this.pending.get(requestId);
    if (!pending) return;

    window.clearTimeout(pending.timeout);
    this.pending.delete(requestId);

    if (requestStatus.result) {
      pending.resolve(responseData ?? {});
    } else {
      pending.reject(new Error(`${requestType}: ${requestStatus.comment || requestStatus.code}`));
    }
  }

  handleBatchResponse(message) {
    const { requestId, results } = message.d;
    const pending = this.pendingBatches.get(requestId);
    if (!pending) return;

    window.clearTimeout(pending.timeout);
    this.pendingBatches.delete(requestId);
    pending.resolve(results ?? []);
  }
}

async function createObsAuthentication(password, salt, challenge) {
  if (!crypto.subtle) {
    throw new Error("This browser does not expose Web Crypto. Use Chrome/Edge over file:// or localhost.");
  }

  const secret = await sha256Base64(`${password}${salt}`);
  return sha256Base64(`${secret}${challenge}`);
}

async function sha256Base64(value) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(hash));
  return btoa(String.fromCharCode(...bytes));
}

async function saveProject() {
  const contents = JSON.stringify(serializeProject(), null, 2);
  const suggestedName = "obs-race-manager-project.json";

  if ("showSaveFilePicker" in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [
          {
            description: "OBS Race Manager Project",
            accept: { "application/json": [".json"] }
          }
        ]
      });
      const writable = await handle.createWritable();
      await writable.write(contents);
      await writable.close();
      logObs(`Saved project as ${handle.name}.`);
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
      logObs(`Native save failed: ${error.message}. Falling back to download.`);
    }
  }

  const fallbackName = (window.prompt("Save project as", suggestedName) || suggestedName).trim() || suggestedName;
  const blob = new Blob([contents], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fallbackName.endsWith(".json") ? fallbackName : `${fallbackName}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function serializeProject() {
  return {
    app: "OBS Race Manager",
    version: 1,
    obs: {
      sceneName: els.obsSceneName.value.trim() || obsBridge.sceneName
    },
    state: {
      layout: structuredClone(state.layout),
      runners: structuredClone(state.runners)
    }
  };
}

function loadProjectFromFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const project = JSON.parse(String(reader.result));
      loadProject(project);
      logObs(`Loaded project ${file.name}.`);
    } catch (error) {
      logObs(`Load failed: ${error.message}`);
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsText(file);
}

function loadProject(project) {
  if (!project?.state?.layout || !Array.isArray(project.state.runners)) {
    throw new Error("This is not an OBS Race Manager project file.");
  }

  pushHistory("load project");
  state.layout = normalizeLoadedLayout(project.state.layout);
  state.runners = normalizeLoadedRunners(project.state.runners);

  if (project.obs?.sceneName) {
    obsBridge.sceneName = String(project.obs.sceneName);
    els.obsSceneName.value = obsBridge.sceneName;
  }

  syncGlobalControlsFromState();
  renderRunnerControls();
  renderStagePanels();
  update();
  scheduleObsApply("project-load", 120);
}

function normalizeLoadedLayout(layout) {
  const legacyBorderStyle = {
    ...BORDER_PRESETS.graphite,
    ...state.layout.borderStyle,
    ...layout.borderStyle
  };
  const next = {
    ...state.layout,
    ...layout,
    elements: {
      ...DEFAULT_ELEMENTS,
      ...state.layout.elements,
      ...layout.elements
    },
    spotlight: {
      ...state.layout.spotlight,
      ...layout.spotlight
    },
    timerText: {
      ...DEFAULT_TIMER_TEXT,
      ...state.layout.timerText,
      ...layout.timerText
    },
    finishedTime: {
      ...DEFAULT_FINISHED_TIME,
      ...state.layout.finishedTime,
      ...layout.finishedTime
    },
    finishedScreen: {
      ...DEFAULT_FINISHED_SCREEN,
      ...state.layout.finishedScreen,
      ...layout.finishedScreen
    },
    commentators: {
      ...structuredClone(DEFAULT_COMMENTATORS),
      ...state.layout.commentators,
      ...layout.commentators,
      rect: {
        ...DEFAULT_COMMENTATORS.rect,
        ...state.layout.commentators?.rect,
        ...layout.commentators?.rect
      },
      names: Array.isArray(layout.commentators?.names)
        ? layout.commentators.names
        : (layout.commentators?.names !== undefined ? layout.commentators.names : structuredClone(DEFAULT_COMMENTATORS.names))
    },
    raceInfo: {
      ...state.layout.raceInfo,
      ...layout.raceInfo,
      rect: {
        ...state.layout.raceInfo.rect,
        ...layout.raceInfo?.rect
      }
    },
    nameplate: {
      ...state.layout.nameplate,
      ...layout.nameplate
    },
    pronounsText: {
      ...DEFAULT_PRONOUNS_TEXT,
      ...state.layout.pronounsText,
      ...layout.pronounsText
    },
    borderStyles: {
      feed: {
        ...legacyBorderStyle,
        ...state.layout.borderStyles?.feed,
        ...layout.borderStyles?.feed
      },
      timer: {
        ...legacyBorderStyle,
        ...state.layout.borderStyles?.timer,
        ...layout.borderStyles?.timer
      },
      title: {
        ...legacyBorderStyle,
        ...state.layout.borderStyles?.title,
        ...layout.borderStyles?.title
      },
      commentators: {
        ...legacyBorderStyle,
        ...state.layout.borderStyles?.commentators,
        ...layout.borderStyles?.commentators
      }
    },
    borderImages: {
      feed: layout.borderImages?.feed ?? layout.borderImage ?? state.layout.borderImages?.feed ?? "",
      timer: layout.borderImages?.timer ?? layout.borderImage ?? state.layout.borderImages?.timer ?? "",
      title: layout.borderImages?.title ?? state.layout.borderImages?.title ?? "",
      commentators: layout.borderImages?.commentators ?? state.layout.borderImages?.commentators ?? ""
    },
    panelGeometry: {
      feed: { ...DEFAULT_PANEL_GEOMETRY.feed, ...layout.panelGeometry?.feed },
      name: { ...DEFAULT_PANEL_GEOMETRY.name, ...layout.panelGeometry?.name },
      finish: { ...DEFAULT_PANEL_GEOMETRY.finish, ...layout.panelGeometry?.finish }
    },
    timerBorder: {
      ...DEFAULT_TIMER_BORDER,
      ...layout.timerBorder
    }
  };

  normalizeGeometryRect(next.panelGeometry.feed);
  normalizeGeometryRect(next.panelGeometry.name);
  normalizeGeometryRect(next.panelGeometry.finish);
  normalizeGeometryRect(next.timerBorder);
  normalizeGeometryRect(next.raceInfo.rect);
  normalizeNameplateStyle(next.nameplate);
  normalizeRaceInfo(next.raceInfo);
  normalizeTimerText(next.timerText);
  normalizeFinishedTime(next.finishedTime);
  normalizeSpotlight(next.spotlight);
  normalizeBorderStyle(next.borderStyles.feed);
  normalizeBorderStyle(next.borderStyles.timer);
  normalizeBorderStyle(next.borderStyles.title);
  normalizeBorderStyle(next.borderStyles.commentators);
  next.borderTarget = ["feed", "timer", "title", "commentators"].includes(next.borderTarget) ? next.borderTarget : "feed";
  next.borderModeSource = ["generated", "image", "template"].includes(next.borderModeSource) ? next.borderModeSource : "generated";
  next.borderStyle = structuredClone(next.borderStyles.feed);
  next.borderImage = next.borderImages.feed;
  next.setupPreviewSlot = clampNumber(next.setupPreviewSlot, 0, MAX_RUNNERS, 0);
  next.viewMode = next.viewMode === "control" ? "control" : "edit";
  next.layerLock = Boolean(next.layerLock);
  next.snapEnabled = next.snapEnabled !== false;
  next.timerBorder.enabled = Boolean(next.timerBorder.enabled);
  next.elements.timerBorder = Boolean(next.elements.timerBorder);
  next.elements.feed = Boolean(next.elements.feed);
  next.elements.feedBorder = Boolean(next.elements.feedBorder);
  next.elements.name = Boolean(next.elements.name);
  next.elements.nameText = next.elements.nameText !== false;
  next.elements.runnerIcon = next.elements.runnerIcon !== false;
  next.elements.titleBar = Boolean(next.elements.titleBar);
  next.elements.builtInTimer = Boolean(next.elements.builtInTimer);
  next.elements.finishedTime = Boolean(next.elements.finishedTime);
  next.lockedElements = Array.isArray(next.lockedElements) ? next.lockedElements.filter((x) => typeof x === "string") : [];
  next.sceneView = next.sceneView !== false;
  next.mediaLayers = Array.isArray(next.mediaLayers) ? next.mediaLayers.map(normalizeMediaLayer).filter(Boolean) : [];
  next.layerOrder = Array.isArray(next.layerOrder) ? next.layerOrder.filter((id) => typeof id === "string") : [...BASE_LAYER_ORDER];
  next.runnerIcon = {
    rect: {
      x: Number(next.runnerIcon?.rect?.x ?? DEFAULT_RUNNER_ICON_RECT.x),
      y: Number(next.runnerIcon?.rect?.y ?? DEFAULT_RUNNER_ICON_RECT.y),
      width: Number(next.runnerIcon?.rect?.width ?? DEFAULT_RUNNER_ICON_RECT.width),
      height: Number(next.runnerIcon?.rect?.height ?? DEFAULT_RUNNER_ICON_RECT.height)
    }
  };
  normalizeGeometryRect(next.runnerIcon.rect);
  next.layerOrder = migrateTitleAboveCommentators(next.layerOrder);
  if (isLegacyDefaultPronounsText(next.pronounsText)) {
    next.pronounsText = {
      ...DEFAULT_PRONOUNS_TEXT,
      enabled: next.pronounsText.enabled,
      textX: next.pronounsText.textX,
      textY: next.pronounsText.textY
    };
  }
  normalizedLayerOrderFor(next);
  return next;
}

// One-time migration: projects created before Title was reordered above
// Commentators still list the globals in the old default sequence. If that
// untouched sequence is detected, move Title just above Commentators (i.e. after
// it in z-order). Once migrated, the sequence no longer matches, so a user's own
// ordering is never overridden.
function migrateTitleAboveCommentators(order) {
  const globals = ["runners", "title", "timerText", "timerFrame", "commentators"];
  const sub = order.filter((id) => globals.includes(id));
  const legacySequence = ["runners", "title", "timerText", "timerFrame", "commentators"];
  if (JSON.stringify(sub) !== JSON.stringify(legacySequence)) return order;
  const without = order.filter((id) => id !== "title");
  const at = without.indexOf("commentators");
  without.splice(at + 1, 0, "title");
  return without;
}

function isLegacyDefaultPronounsText(cfg) {
  return Boolean(cfg)
    && cfg.fontFamily === LEGACY_PRONOUNS_TEXT_SIGNATURE.fontFamily
    && cfg.textColor === LEGACY_PRONOUNS_TEXT_SIGNATURE.textColor
    && cfg.strokeColor === LEGACY_PRONOUNS_TEXT_SIGNATURE.strokeColor
    && cfg.shadowColor === LEGACY_PRONOUNS_TEXT_SIGNATURE.shadowColor;
}

function normalizeMediaLayer(layer) {
  if (!layer || typeof layer.dataUrl !== "string" || !layer.dataUrl.startsWith("data:")) return null;
  const next = {
    id: String(layer.id || `media${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`).replace(/[^a-zA-Z0-9_-]/g, ""),
    name: String(layer.name || "Media layer"),
    type: layer.type === "video" || String(layer.mimeType || "").startsWith("video/") ? "video" : "image",
    mimeType: String(layer.mimeType || ""),
    dataUrl: layer.dataUrl,
    aspectRatio: normalizeNumber(layer.aspectRatio, 0.01, 100, 16 / 9),
    visible: layer.visible !== false,
    parentId: normalizeMediaParentId(layer.parentId),
    rect: {
      x: Number(layer.rect?.x ?? 0.25),
      y: Number(layer.rect?.y ?? 0.22),
      width: Number(layer.rect?.width ?? 0.5),
      height: Number(layer.rect?.height ?? 0.5)
    }
  };
  normalizeGeometryRect(next.rect);
  return next;
}

function normalizedLayerOrderFor(layout) {
  const mediaIds = Array.isArray(layout.mediaLayers) ? layout.mediaLayers.map((layer) => mediaNodeId(layer.id)) : [];
  const allowed = new Set([...BASE_LAYER_ORDER, ...mediaIds]);
  const order = Array.isArray(layout.layerOrder) ? layout.layerOrder.filter((id) => allowed.has(id)) : [];
  const next = [];
  for (const id of order) {
    if (!next.includes(id)) next.push(id);
  }
  for (const id of BASE_LAYER_ORDER) {
    if (!next.includes(id)) next.push(id);
  }
  let insertAt = next.includes("finished") ? next.indexOf("finished") : next.length;
  for (const id of mediaIds) {
    if (!next.includes(id)) {
      next.splice(insertAt, 0, id);
      insertAt += 1;
    }
  }
  layout.layerOrder = next;
  return next;
}

function normalizeSpotlight(config) {
  config.enabled = Boolean(config.enabled);
  config.slots = String(config.slots || "");
  config.showOthers = Boolean(config.showOthers);
  config.disableSmallNameplates = Boolean(config.disableSmallNameplates);
  config.side = ["right", "left", "bottom"].includes(config.side) ? config.side : "bottom";
  config.stackOrder = ["horizontal", "vertical"].includes(config.stackOrder) ? config.stackOrder : "horizontal";
  config.mainScale = normalizeNumber(config.mainScale, 55, 92, 78);
  config.otherScale = normalizeNumber(config.otherScale, 8, 40, 22);
  config.gap = normalizeNumber(config.gap, 0, 64, 20);
}

function normalizeRaceInfo(config) {
  config.title = String(config.title || "Race Title");
  config.subtitle = String(config.subtitle || "");
  config.fontFamily = String(config.fontFamily || "Segoe UI");
  config.fontSize = normalizeNumber(config.fontSize, 1, 1000, 34);
  config.textColor = normalizeHexColor(config.textColor, "#ffffff");
  config.plateImage = String(config.plateImage || "");
  config.plateBackgroundColor = normalizeHexColor(config.plateBackgroundColor || config.backgroundColor, "#10161a");
  config.plateBackgroundOpacity = normalizeNumber(config.plateBackgroundOpacity, 0, 100, 84);
  config.plateBorderColor = normalizeHexColor(config.plateBorderColor, "#ffffff");
  config.plateBorderOpacity = normalizeNumber(config.plateBorderOpacity, 0, 100, 14);
  config.plateBorderWidth = normalizeNumber(config.plateBorderWidth, 0, 20, 1);
  config.plateRadius = normalizeNumber(config.plateRadius, 0, 60, 8);
  config.platePaddingX = normalizeNumber(config.platePaddingX, 0, 160, 18);
  config.plateFillMode = ["solid", "gradient", "texture"].includes(config.plateFillMode) ? config.plateFillMode : "solid";
  config.plateGradientFrom = normalizeHexColor(config.plateGradientFrom, config.plateBackgroundColor);
  config.plateGradientTo = normalizeHexColor(config.plateGradientTo, "#26343b");
  config.plateGradientAngle = normalizeNumber(config.plateGradientAngle, 0, 360, 135);
  config.plateAnimateGradientAngle = Boolean(config.plateAnimateGradientAngle);
  config.plateGradientAngleSpeed = normalizeNumber(config.plateGradientAngleSpeed, -360, 360, 45);
  config.plateTextureImage = String(config.plateTextureImage || "");
  config.plateTextureScale = normalizeNumber(config.plateTextureScale, 25, 400, 100);
  config.plateTextureX = normalizeNumber(config.plateTextureX, 0, 100, 50);
  config.plateTextureY = normalizeNumber(config.plateTextureY, 0, 100, 50);
  config.plateTextureScrollX = normalizeNumber(config.plateTextureScrollX, -200, 200, 0);
  config.plateTextureScrollY = normalizeNumber(config.plateTextureScrollY, -200, 200, 0);
  config.plateMode = ["generated", "image"].includes(config.plateMode) ? config.plateMode : "generated";
  config.showBox = config.showBox !== false;
  config.showBorder = config.showBorder !== false;
}

function normalizeLoadedRunners(runners) {
  const bySlot = new Map(runners.map((runner, index) => [Number(runner.slot ?? index + 1), runner]));
  return Array.from({ length: MAX_RUNNERS }, (_, index) => {
    const slot = index + 1;
    const runner = bySlot.get(slot) ?? {};
    return {
      slot,
      active: Boolean(runner.active ?? slot <= 2),
      name: String(runner.name ?? `Runner ${slot}`),
      source: String(runner.source ?? "") === `runner_${slot}_feed` ? "" : String(runner.source ?? ""),
      feedMode: ["live", "brb", "tech", "black", "standby"].includes(runner.feedMode) ? runner.feedMode : "live",
      placement: Number(runner.placement ?? slot),
      done: Boolean(runner.done),
      finalTimeMs: runner.finalTimeMs === null || runner.finalTimeMs === undefined ? null : Number(runner.finalTimeMs),
      finalTimeText: String(runner.finalTimeText || ""),
      audioMuted: Boolean(runner.audioMuted),
      audioVolume: clampNumber(runner.audioVolume, 0, 200, 100),
      collapsed: Boolean(runner.collapsed),
      pronounPrimary: String(runner.pronounPrimary || ""),
      pronounSecondary: String(runner.pronounSecondary || ""),
      pronounCustom: String(runner.pronounCustom || ""),
      icon: typeof runner.icon === "string" && runner.icon.startsWith("data:") ? runner.icon : "",
      pb: String(runner.pb || ""),
      unique: Boolean(runner.unique),
      style: runner.unique
        ? {
          nameplate: { ...structuredClone(state.layout.nameplate), ...(runner.style?.nameplate || {}) },
          finishedTime: { ...structuredClone(state.layout.finishedTime), ...(runner.style?.finishedTime || {}) },
          borderStyle: runner.style?.borderStyle ? structuredClone(runner.style.borderStyle) : structuredClone(getBorderStyle("feed")),
          borderImage: runner.style?.borderImage ?? ""
        }
        : (runner.style || null),
      crop: {
        left: Number(runner.crop?.left ?? 0),
        top: Number(runner.crop?.top ?? 0),
        right: Number(runner.crop?.right ?? 0),
        bottom: Number(runner.crop?.bottom ?? 0)
      }
    };
  });
}

function normalizeTimerText(config) {
  config.fontFamily = String(config.fontFamily || DEFAULT_TIMER_TEXT.fontFamily);
  config.fontSize = normalizeNumber(config.fontSize, 1, 1000, DEFAULT_TIMER_TEXT.fontSize);
  config.format = ["hhmmss", "mmss", "mmssms"].includes(config.format) ? config.format : DEFAULT_TIMER_TEXT.format;
  config.idleColor = normalizeHexColor(config.idleColor, DEFAULT_TIMER_TEXT.idleColor);
  config.stoppedColor = normalizeHexColor(config.stoppedColor, DEFAULT_TIMER_TEXT.stoppedColor);
  config.runningColor = normalizeHexColor(config.runningColor, DEFAULT_TIMER_TEXT.runningColor);
  config.strokeEnabled = Boolean(config.strokeEnabled);
  config.strokeColor = normalizeHexColor(config.strokeColor, DEFAULT_TIMER_TEXT.strokeColor);
  config.strokeWidth = normalizeNumber(config.strokeWidth, 0, 10, DEFAULT_TIMER_TEXT.strokeWidth);
  config.shadowEnabled = Boolean(config.shadowEnabled);
  config.shadowColor = normalizeHexColor(config.shadowColor, DEFAULT_TIMER_TEXT.shadowColor);
  config.shadowBlur = normalizeNumber(config.shadowBlur, 0, 30, DEFAULT_TIMER_TEXT.shadowBlur);
  config.shadowX = normalizeNumber(config.shadowX, -20, 20, DEFAULT_TIMER_TEXT.shadowX);
  config.shadowY = normalizeNumber(config.shadowY, -20, 20, DEFAULT_TIMER_TEXT.shadowY);
  config.state = ["idle", "stopped", "running"].includes(config.state) ? config.state : "idle";
  config.elapsedMs = normalizeNumber(config.elapsedMs, 0, Number.MAX_SAFE_INTEGER, 0);
  config.startedAt = normalizeNumber(config.startedAt, 0, Number.MAX_SAFE_INTEGER, 0);
  
  // Timer Plate normalization
  config.plateImage = String(config.plateImage || "");
  config.plateBackgroundColor = normalizeHexColor(config.plateBackgroundColor, "#10161a");
  config.plateBackgroundOpacity = normalizeNumber(config.plateBackgroundOpacity, 0, 100, 84);
  config.plateRadius = normalizeNumber(config.plateRadius, 0, 60, 8);
  config.platePaddingX = normalizeNumber(config.platePaddingX, 0, 160, 18);
  config.plateFillMode = ["solid", "gradient", "texture"].includes(config.plateFillMode) ? config.plateFillMode : "solid";
  config.plateGradientFrom = normalizeHexColor(config.plateGradientFrom, config.plateBackgroundColor);
  config.plateGradientTo = normalizeHexColor(config.plateGradientTo, "#26343b");
  config.plateGradientAngle = normalizeNumber(config.plateGradientAngle, 0, 360, 135);
  config.plateAnimateGradientAngle = Boolean(config.plateAnimateGradientAngle);
  config.plateGradientAngleSpeed = normalizeNumber(config.plateGradientAngleSpeed, -360, 360, 45);
  config.plateTextureImage = String(config.plateTextureImage || "");
  config.plateTextureScale = normalizeNumber(config.plateTextureScale, 25, 400, 100);
  config.plateTextureX = normalizeNumber(config.plateTextureX, 0, 100, 50);
  config.plateTextureY = normalizeNumber(config.plateTextureY, 0, 100, 50);
  config.plateTextureScrollX = normalizeNumber(config.plateTextureScrollX, -200, 200, 0);
  config.plateTextureScrollY = normalizeNumber(config.plateTextureScrollY, -200, 200, 0);
  config.plateMode = ["generated", "image"].includes(config.plateMode) ? config.plateMode : "generated";
  config.showBox = Boolean(config.showBox);
}

function normalizeFinishedTime(config) {
  config.fontFamily = String(config.fontFamily || DEFAULT_FINISHED_TIME.fontFamily);
  config.fontSize = normalizeNumber(config.fontSize, 1, 1000, DEFAULT_FINISHED_TIME.fontSize);
  config.color = normalizeHexColor(config.color, DEFAULT_FINISHED_TIME.color);
  config.align = ["left", "center", "right"].includes(config.align) ? config.align : DEFAULT_FINISHED_TIME.align;
  config.lockToNameplate = Boolean(config.lockToNameplate);
  config.strokeEnabled = Boolean(config.strokeEnabled);
  config.strokeColor = normalizeHexColor(config.strokeColor, DEFAULT_FINISHED_TIME.strokeColor);
  config.strokeWidth = normalizeNumber(config.strokeWidth, 0, 10, DEFAULT_FINISHED_TIME.strokeWidth);
  config.shadowEnabled = Boolean(config.shadowEnabled);
  config.shadowColor = normalizeHexColor(config.shadowColor, DEFAULT_FINISHED_TIME.shadowColor);
  config.shadowBlur = normalizeNumber(config.shadowBlur, 0, 30, DEFAULT_FINISHED_TIME.shadowBlur);
  config.shadowX = normalizeNumber(config.shadowX, -20, 20, DEFAULT_FINISHED_TIME.shadowX);
  config.shadowY = normalizeNumber(config.shadowY, -20, 20, DEFAULT_FINISHED_TIME.shadowY);
}

function normalizeNameplateStyle(config) {
  config.fontFamily = String(config.fontFamily || "Segoe UI");
  config.fontSize = normalizeNumber(config.fontSize, 1, 1000, state.layout.nameplate.fontSize);
  config.textColor = normalizeHexColor(config.textColor, state.layout.nameplate.textColor);
  config.plateImage = String(config.plateImage || "");
  config.plateBackgroundColor = normalizeHexColor(config.plateBackgroundColor, state.layout.nameplate.plateBackgroundColor);
  config.plateBackgroundOpacity = normalizeNumber(config.plateBackgroundOpacity, 0, 100, state.layout.nameplate.plateBackgroundOpacity);
  config.plateBorderColor = normalizeHexColor(config.plateBorderColor, state.layout.nameplate.plateBorderColor);
  config.plateBorderOpacity = normalizeNumber(config.plateBorderOpacity, 0, 100, state.layout.nameplate.plateBorderOpacity);
  config.plateBorderWidth = normalizeNumber(config.plateBorderWidth, 0, 20, state.layout.nameplate.plateBorderWidth);
  config.plateRadius = normalizeNumber(config.plateRadius, 0, 80, state.layout.nameplate.plateRadius);
  config.platePaddingX = normalizeNumber(config.platePaddingX, 0, 160, state.layout.nameplate.platePaddingX);
  config.badgeColor = normalizeHexColor(config.badgeColor, state.layout.nameplate.badgeColor);
  config.plateFillMode = ["solid", "gradient", "texture"].includes(config.plateFillMode) ? config.plateFillMode : "solid";
  config.plateGradientFrom = normalizeHexColor(config.plateGradientFrom, state.layout.nameplate.plateGradientFrom);
  config.plateGradientTo = normalizeHexColor(config.plateGradientTo, state.layout.nameplate.plateGradientTo);
  config.plateGradientAngle = normalizeNumber(config.plateGradientAngle, 0, 360, state.layout.nameplate.plateGradientAngle);
  config.plateAnimateGradientAngle = Boolean(config.plateAnimateGradientAngle);
  config.plateGradientAngleSpeed = normalizeNumber(config.plateGradientAngleSpeed, -360, 360, state.layout.nameplate.plateGradientAngleSpeed);
  config.plateTextureImage = String(config.plateTextureImage || "");
  config.plateTextureScale = normalizeNumber(config.plateTextureScale, 25, 400, state.layout.nameplate.plateTextureScale);
  config.plateTextureX = normalizeNumber(config.plateTextureX, 0, 100, state.layout.nameplate.plateTextureX);
  config.plateTextureY = normalizeNumber(config.plateTextureY, 0, 100, state.layout.nameplate.plateTextureY);
  config.plateTextureScrollX = normalizeNumber(config.plateTextureScrollX, -200, 200, state.layout.nameplate.plateTextureScrollX);
  config.plateTextureScrollY = normalizeNumber(config.plateTextureScrollY, -200, 200, state.layout.nameplate.plateTextureScrollY);
  config.textX = normalizeNumber(config.textX, -500, 500, state.layout.nameplate.textX);
  config.textY = normalizeNumber(config.textY, -200, 200, state.layout.nameplate.textY);
  config.plateMode = config.plateMode === "image" ? "image" : "generated";
  config.showBox = Boolean(config.showBox);
  config.showBorder = Boolean(config.showBorder);
  config.showPlacement = Boolean(config.showPlacement);
  config.strokeEnabled = Boolean(config.strokeEnabled);
  config.strokeColor = normalizeHexColor(config.strokeColor, state.layout.nameplate.strokeColor);
  config.strokeWidth = normalizeNumber(config.strokeWidth, 0, 8, state.layout.nameplate.strokeWidth);
  config.shadowEnabled = Boolean(config.shadowEnabled);
  config.shadowColor = normalizeHexColor(config.shadowColor, state.layout.nameplate.shadowColor);
  config.shadowBlur = normalizeNumber(config.shadowBlur, 0, 30, state.layout.nameplate.shadowBlur);
  config.shadowX = normalizeNumber(config.shadowX, -20, 20, state.layout.nameplate.shadowX);
  config.shadowY = normalizeNumber(config.shadowY, -20, 20, state.layout.nameplate.shadowY);
}

function normalizeBorderStyle(style) {
  style.mode = ["solid", "gradient", "texture"].includes(style.mode) ? style.mode : "solid";
  style.lineColor = normalizeHexColor(style.lineColor, BORDER_PRESETS.graphite.lineColor);
  style.glowColor = normalizeHexColor(style.glowColor, BORDER_PRESETS.graphite.glowColor);
  style.gradientFrom = normalizeHexColor(style.gradientFrom ?? style.highlightFrom, BORDER_PRESETS.graphite.gradientFrom);
  style.gradientTo = normalizeHexColor(style.gradientTo ?? style.highlightTo, BORDER_PRESETS.graphite.gradientTo);
  style.lineWidth = normalizeNumber(style.lineWidth, 0, 40, BORDER_PRESETS.graphite.lineWidth);
  style.radius = normalizeNumber(style.radius, 0, 60, BORDER_PRESETS.graphite.radius);
  style.gradientAngle = normalizeNumber(style.gradientAngle, 0, 360, BORDER_PRESETS.graphite.gradientAngle);
  style.animateGradientAngle = Boolean(style.animateGradientAngle);
  style.gradientAngleSpeed = normalizeNumber(style.gradientAngleSpeed, -360, 360, BORDER_PRESETS.graphite.gradientAngleSpeed);
  style.textureImage = String(style.textureImage || "");
  style.textureScale = normalizeNumber(style.textureScale, 25, 400, BORDER_PRESETS.graphite.textureScale);
  style.textureX = normalizeNumber(style.textureX, 0, 100, BORDER_PRESETS.graphite.textureX);
  style.textureY = normalizeNumber(style.textureY, 0, 100, BORDER_PRESETS.graphite.textureY);
  style.textureScrollX = normalizeNumber(style.textureScrollX, -200, 200, BORDER_PRESETS.graphite.textureScrollX);
  style.textureScrollY = normalizeNumber(style.textureScrollY, -200, 200, BORDER_PRESETS.graphite.textureScrollY);
}

function normalizeHexColor(value, fallback) {
  return /^#[a-f\d]{6}$/i.test(String(value)) ? String(value) : fallback;
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function normalizeNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return number;
}

function syncGlobalControlsFromState() {
  els.aspectPreset.value = state.layout.aspectPreset;
  syncRangeInput(els.timerHeight, state.layout.timerHeight);
  els.timerHeightValue.textContent = `${state.layout.timerHeight} px`;
  syncRangeInput(els.titleHeight, state.layout.titleHeight);
  els.titleHeightValue.textContent = `${state.layout.titleHeight} px`;
  syncRangeInput(els.marginLeft, state.layout.marginLeft);
  els.marginLeftValue.textContent = `${state.layout.marginLeft} px`;
  syncRangeInput(els.marginRight, state.layout.marginRight);
  els.marginRightValue.textContent = `${state.layout.marginRight} px`;
  syncRangeInput(els.gapSize, state.layout.gap);
  els.gapValue.textContent = `${state.layout.gap} px`;
  syncRangeInput(els.animationMs, state.layout.animationMs);
  els.animationValue.textContent = `${state.layout.animationMs} ms`;
  syncRangeInput(els.animationFps, state.layout.animationFps);
  els.animationFpsValue.textContent = `${state.layout.animationFps} fps`;
  els.animationStyle.value = state.layout.animationStyle;
  syncRangeInput(els.finishAnimationMs, state.layout.finishAnimationMs);
  els.finishAnimationValue.textContent = `${state.layout.finishAnimationMs} ms`;
  syncRangeInput(els.finishAnimationFps, state.layout.finishAnimationFps);
  els.finishAnimationFpsValue.textContent = `${state.layout.finishAnimationFps} fps`;
  els.finishAnimationStyle.value = state.layout.finishAnimationStyle;
  syncFinishedScreenControls();
  syncCommentatorsControls();
  els.animateObsLayout.checked = obsBridge.animateLayout;
  els.layerLockEnabled.checked = state.layout.layerLock;
  els.snapEnabled.checked = state.layout.snapEnabled;
  els.viewEditMode.classList.toggle("active", state.layout.viewMode !== "control");
  els.viewControlMode.classList.toggle("active", state.layout.viewMode === "control");
  els.feedWidth.value = state.layout.feedWidth;
  els.feedHeight.value = state.layout.feedHeight;
  els.builtInTimerEnabled.checked = state.layout.elements.builtInTimer;
  syncTimerTextControlsFromState();
  els.spotlightEnabled.checked = state.layout.spotlight.enabled;
  els.spotlightSlots.value = state.layout.spotlight.slots;
  els.spotlightShowOthers.checked = state.layout.spotlight.showOthers;
  els.spotlightDisableSmallNameplates.checked = state.layout.spotlight.disableSmallNameplates;
  els.spotlightSide.value = state.layout.spotlight.side;
  els.spotlightStackOrder.value = state.layout.spotlight.stackOrder;
  syncRangeInput(els.spotlightMainScale, state.layout.spotlight.mainScale);
  els.spotlightMainScaleValue.textContent = `${state.layout.spotlight.mainScale}%`;
  syncRangeInput(els.spotlightOtherScale, state.layout.spotlight.otherScale);
  els.spotlightOtherScaleValue.textContent = `${state.layout.spotlight.otherScale}%`;
  syncRangeInput(els.spotlightGap, state.layout.spotlight.gap);
  els.spotlightGapValue.textContent = `${state.layout.spotlight.gap} px`;
  if (els.titleBarVisible) els.titleBarVisible.checked = state.layout.elements.titleBar;
  els.raceInfoEnabled.checked = state.layout.elements.titleBar;
  els.raceTitle.value = state.layout.raceInfo.title;
  els.raceSubtitle.value = state.layout.raceInfo.subtitle;
  els.raceInfoFont.value = state.layout.raceInfo.fontFamily;
  els.raceInfoFontBrowser.value = Array.from(els.raceInfoFontBrowser.options).some((option) => option.value === state.layout.raceInfo.fontFamily)
    ? state.layout.raceInfo.fontFamily
    : "";
  els.raceInfoFontSize.value = state.layout.raceInfo.fontSize;
  els.raceInfoTextColor.value = state.layout.raceInfo.textColor;
  els.raceInfoStrokeEnabled.checked = state.layout.raceInfo.strokeEnabled;
  els.raceInfoStrokeColor.value = state.layout.raceInfo.strokeColor;
  els.raceInfoStrokeWidth.value = state.layout.raceInfo.strokeWidth;
  els.raceInfoShadowEnabled.checked = state.layout.raceInfo.shadowEnabled;
  els.raceInfoShadowColor.value = state.layout.raceInfo.shadowColor;
  els.raceInfoShadowBlur.value = state.layout.raceInfo.shadowBlur;
  els.raceInfoShadowX.value = state.layout.raceInfo.shadowX;
  els.raceInfoShadowY.value = state.layout.raceInfo.shadowY;
  const hasBg = Boolean(state.layout.backgroundImage);
  els.clearBackgroundImage.disabled = !hasBg;
  syncRangeInput(els.backgroundScale, state.layout.backgroundScale);
  els.backgroundScaleValue.textContent = `${state.layout.backgroundScale}%`;
  syncRangeInput(els.backgroundScrollX, state.layout.backgroundScrollX);
  els.backgroundScrollXValue.textContent = `${state.layout.backgroundScrollX} px/s`;
  syncRangeInput(els.backgroundScrollY, state.layout.backgroundScrollY);
  els.backgroundScrollYValue.textContent = `${state.layout.backgroundScrollY} px/s`;
  els.backgroundScale.disabled = !hasBg;
  els.backgroundScrollX.disabled = !hasBg;
  els.backgroundScrollY.disabled = !hasBg;
  document.getElementById("themeBackgroundControls").classList.toggle("disabled-control", !hasBg);

  syncRaceInfoControlsFromState();
  populateSetupPreviewSlotOptions();
  if (state.layout.timerText.state === "running") startTimerPreviewTicker();
  else stopTimerPreviewTicker();
  syncNameplateControlsFromState();
  syncPronounsTextControlsFromState();
  syncFinishedTimeControlsFromState();
  syncBorderStyleControlsFromState();
  syncGeometryControls();
}

function syncBorderStyleControlsFromState() {
  const style = getEditingBorderStyle();
  els.borderTarget.value = state.layout.borderTarget;
  els.borderSourceMode.value = state.layout.borderModeSource;
  els.borderMode.value = style.mode;
  els.borderLineColor.value = style.lineColor;
  els.borderGlowColor.value = style.glowColor;
  els.borderGradientFrom.value = style.gradientFrom;
  els.borderGradientTo.value = style.gradientTo;
  els.borderGradientAngle.value = style.gradientAngle;
  syncRangeInput(els.borderGradientAngleSlider, style.gradientAngle);
  els.borderAnimateGradientAngle.checked = Boolean(style.animateGradientAngle);
  syncRangeInput(els.borderGradientAngleSpeed, style.gradientAngleSpeed);
  els.borderGradientAngleSpeedValue.textContent = `${style.gradientAngleSpeed} deg/s`;
  els.borderLineWidth.value = style.lineWidth;
  els.borderRadius.value = style.radius;
  syncRangeInput(els.borderTextureScale, style.textureScale);
  els.borderTextureScaleValue.textContent = `${style.textureScale}%`;
  syncRangeInput(els.borderTextureX, style.textureX);
  syncRangeInput(els.borderTextureY, style.textureY);
  syncRangeInput(els.borderTextureScrollX, style.textureScrollX);
  els.borderTextureScrollXValue.textContent = `${style.textureScrollX} px/s`;
  syncRangeInput(els.borderTextureScrollY, style.textureScrollY);
  els.borderTextureScrollYValue.textContent = `${style.textureScrollY} px/s`;
  syncBorderSourceSections();
  syncBorderModeSections();
  syncBorderSwatches();
}

function syncBorderSourceSections() {
  for (const section of document.querySelectorAll("[data-border-source-section]")) {
    section.hidden = section.dataset.borderSourceSection !== state.layout.borderModeSource;
  }
  els.createBorderDetails.open = state.layout.borderModeSource === "generated";
}

function syncBorderModeSections() {
  const style = getEditingBorderStyle();
  for (const section of document.querySelectorAll("[data-border-section]")) {
    const type = section.dataset.borderSection;
    section.hidden = type !== "shared" && type !== style.mode;
  }
  els.borderGradientSpeedRow.hidden = !(style.mode === "gradient" && style.animateGradientAngle);
}

function syncBorderSwatches() {
  for (const swatch of document.querySelectorAll(".swatch")) {
    swatch.classList.toggle("active", swatch.dataset.border === state.layout.borderPreset && !getEditingBorderImage());
  }
}

function syncRaceInfoControlsFromState() {
  const config = state.layout.raceInfo;
  els.raceInfoPlateMode.value = config.plateMode;
  els.clearRaceInfoPlateImage.disabled = !config.plateImage;
  els.raceInfoShowBox.checked = config.showBox;
  els.raceInfoPlateFillMode.value = config.plateFillMode;
  els.raceInfoPlateBackgroundColor.value = config.plateBackgroundColor;
  els.raceInfoPlateGradientFrom.value = config.plateGradientFrom;
  els.raceInfoPlateGradientTo.value = config.plateGradientTo;
  els.raceInfoPlateGradientAngle.value = config.plateGradientAngle;
  syncRangeInput(els.raceInfoPlateGradientAngleSlider, config.plateGradientAngle);
  els.raceInfoPlateAnimateGradientAngle.checked = Boolean(config.plateAnimateGradientAngle);
  syncRangeInput(els.raceInfoPlateGradientAngleSpeed, config.plateGradientAngleSpeed);
  els.raceInfoPlateGradientAngleSpeedValue.textContent = `${config.plateGradientAngleSpeed} deg/s`;
  els.clearRaceInfoPlateTextureImage.disabled = !config.plateTextureImage;
  syncRangeInput(els.raceInfoPlateTextureScale, config.plateTextureScale);
  els.raceInfoPlateTextureScaleValue.textContent = `${config.plateTextureScale}%`;
  syncRangeInput(els.raceInfoPlateTextureX, config.plateTextureX);
  syncRangeInput(els.raceInfoPlateTextureY, config.plateTextureY);
  syncRangeInput(els.raceInfoPlateTextureScrollX, config.plateTextureScrollX);
  els.raceInfoPlateTextureScrollXValue.textContent = `${config.plateTextureScrollX} px/s`;
  syncRangeInput(els.raceInfoPlateTextureScrollY, config.plateTextureScrollY);
  els.raceInfoPlateTextureScrollYValue.textContent = `${config.plateTextureScrollY} px/s`;
  els.raceInfoPlateBackgroundOpacity.value = config.plateBackgroundOpacity;
  if (els.raceInfoPlateRadius) els.raceInfoPlateRadius.value = frameRadius("title");
  els.raceInfoPlatePaddingX.value = config.platePaddingX;
  syncRaceInfoModeSections();
  syncRaceInfoFillSections();
}

function syncRaceInfoModeSections() {
  for (const section of document.querySelectorAll("[data-race-info-section]")) {
    section.hidden = section.dataset.raceInfoSection !== state.layout.raceInfo.plateMode;
  }
}

function syncRaceInfoFillSections() {
  for (const section of document.querySelectorAll("[data-race-info-fill-section]")) {
    section.hidden = section.dataset.raceInfoFillSection !== state.layout.raceInfo.plateFillMode;
  }
  els.raceInfoPlateGradientSpeedRow.hidden = !(state.layout.raceInfo.plateFillMode === "gradient" && state.layout.raceInfo.plateAnimateGradientAngle);
}

function syncTimerTextControlsFromState() {
  const config = state.layout.timerText;
  els.timerFormat.value = config.format;
  els.timerFont.value = config.fontFamily;
  els.timerFontBrowser.value = Array.from(els.timerFontBrowser.options).some((option) => option.value === config.fontFamily)
    ? config.fontFamily
    : "";
  els.timerFontSize.value = config.fontSize;
  els.timerFontSizeValue.textContent = `${config.fontSize} px`;
  els.timerIdleColor.value = config.idleColor;
  els.timerStoppedColor.value = config.stoppedColor;
  els.timerRunningColor.value = config.runningColor;
  els.timerStrokeEnabled.checked = config.strokeEnabled;
  els.timerStrokeColor.value = config.strokeColor;
  els.timerStrokeWidth.value = config.strokeWidth;
  els.timerShadowEnabled.checked = config.shadowEnabled;
  els.timerShadowColor.value = config.shadowColor;
  els.timerShadowBlur.value = config.shadowBlur;
  els.timerShadowX.value = config.shadowX;
  els.timerShadowY.value = config.shadowY;

  // Timer Plate
  els.timerPlateMode.value = config.plateMode;
  els.clearTimerPlateImage.disabled = !config.plateImage;
  els.timerShowBox.checked = config.showBox;
  els.timerPlateFillMode.value = config.plateFillMode;
  els.timerPlateBackgroundColor.value = config.plateBackgroundColor;
  els.timerPlateGradientFrom.value = config.plateGradientFrom;
  els.timerPlateGradientTo.value = config.plateGradientTo;
  els.timerPlateGradientAngle.value = config.plateGradientAngle;
  syncRangeInput(els.timerPlateGradientAngleSlider, config.plateGradientAngle);
  els.timerPlateAnimateGradientAngle.checked = Boolean(config.plateAnimateGradientAngle);
  syncRangeInput(els.timerPlateGradientAngleSpeed, config.plateGradientAngleSpeed);
  els.timerPlateGradientAngleSpeedValue.textContent = `${config.plateGradientAngleSpeed} deg/s`;
  els.clearTimerPlateTextureImage.disabled = !config.plateTextureImage;
  syncRangeInput(els.timerPlateTextureScale, config.plateTextureScale);
  els.timerPlateTextureScaleValue.textContent = `${config.plateTextureScale}%`;
  syncRangeInput(els.timerPlateTextureX, config.plateTextureX);
  syncRangeInput(els.timerPlateTextureY, config.plateTextureY);
  syncRangeInput(els.timerPlateTextureScrollX, config.plateTextureScrollX);
  els.timerPlateTextureScrollXValue.textContent = `${config.plateTextureScrollX} px/s`;
  syncRangeInput(els.timerPlateTextureScrollY, config.plateTextureScrollY);
  els.timerPlateTextureScrollYValue.textContent = `${config.plateTextureScrollY} px/s`;
  els.timerPlateBackgroundOpacity.value = config.plateBackgroundOpacity;
  if (els.timerPlateRadius) els.timerPlateRadius.value = frameRadius("timer");
  els.timerPlatePaddingX.value = config.platePaddingX;

  syncTimerPlateModeSections();
  syncTimerPlateFillSections();
}

function syncTimerPlateModeSections() {
  for (const section of document.querySelectorAll("[data-timer-plate-section]")) {
    section.hidden = section.dataset.timerPlateSection !== state.layout.timerText.plateMode;
  }
}

function syncTimerPlateFillSections() {
  for (const section of document.querySelectorAll("[data-timer-plate-fill-section]")) {
    section.hidden = section.dataset.timerPlateFillSection !== state.layout.timerText.plateFillMode;
  }
  els.timerPlateGradientSpeedRow.hidden = !(state.layout.timerText.plateFillMode === "gradient" && state.layout.timerText.plateAnimateGradientAngle);
}

function syncNameplateControlsFromState() {
  const config = activeNameplate();
  els.nameFont.value = config.fontFamily;
  els.nameFontBrowser.value = Array.from(els.nameFontBrowser.options).some((option) => option.value === config.fontFamily)
    ? config.fontFamily
    : "";
  els.nameFontSize.value = config.fontSize;
  els.nameFontSizeValue.textContent = `${config.fontSize} px`;
  els.nameTextColor.value = config.textColor;
  els.nameTextX.value = config.textX;
  els.nameTextY.value = config.textY;
  els.nameplateMode.value = config.plateMode;
  els.clearNameplateImage.disabled = !config.plateImage;
  els.nameShowBox.checked = config.showBox;
  els.nameShowBorder.checked = config.showBorder;
  els.namePlateFillMode.value = config.plateFillMode;
  els.namePlateBackgroundColor.value = config.plateBackgroundColor;
  els.namePlateGradientFrom.value = config.plateGradientFrom;
  els.namePlateGradientTo.value = config.plateGradientTo;
  els.namePlateGradientAngle.value = config.plateGradientAngle;
  syncRangeInput(els.namePlateGradientAngleSlider, config.plateGradientAngle);
  els.namePlateAnimateGradientAngle.checked = config.plateAnimateGradientAngle;
  syncRangeInput(els.namePlateGradientAngleSpeed, config.plateGradientAngleSpeed);
  els.namePlateGradientAngleSpeedValue.textContent = `${config.plateGradientAngleSpeed} deg/s`;
  els.clearNamePlateTextureImage.disabled = !config.plateTextureImage;
  syncRangeInput(els.namePlateTextureScale, config.plateTextureScale);
  els.namePlateTextureScaleValue.textContent = `${config.plateTextureScale}%`;
  syncRangeInput(els.namePlateTextureX, config.plateTextureX);
  syncRangeInput(els.namePlateTextureY, config.plateTextureY);
  syncRangeInput(els.namePlateTextureScrollX, config.plateTextureScrollX);
  els.namePlateTextureScrollXValue.textContent = `${config.plateTextureScrollX} px/s`;
  syncRangeInput(els.namePlateTextureScrollY, config.plateTextureScrollY);
  els.namePlateTextureScrollYValue.textContent = `${config.plateTextureScrollY} px/s`;
  els.namePlateBackgroundOpacity.value = config.plateBackgroundOpacity;
  els.namePlateBorderColor.value = config.plateBorderColor;
  els.namePlateBorderOpacity.value = config.plateBorderOpacity;
  els.namePlateBorderWidth.value = config.plateBorderWidth;
  els.namePlateRadius.value = config.plateRadius;
  els.namePlatePaddingX.value = config.platePaddingX;
  els.nameStrokeEnabled.checked = config.strokeEnabled;
  els.nameStrokeColor.value = config.strokeColor;
  els.nameStrokeWidth.value = config.strokeWidth;
  els.nameShadowEnabled.checked = config.shadowEnabled;
  els.nameShadowColor.value = config.shadowColor;
  els.nameShadowBlur.value = config.shadowBlur;
  els.nameShadowX.value = config.shadowX;
  els.nameShadowY.value = config.shadowY;
  syncNameplateModeSections();
  syncNameplateFillSections();
}

function syncNameplateModeSections() {
  const config = activeNameplate();
  for (const section of document.querySelectorAll("[data-nameplate-section]")) {
    section.hidden = section.dataset.nameplateSection !== config.plateMode;
  }
}

function syncNameplateFillSections() {
  const config = activeNameplate();
  for (const section of document.querySelectorAll("[data-nameplate-fill-section]")) {
    section.hidden = section.dataset.nameplateFillSection !== config.plateFillMode;
  }
  els.namePlateGradientSpeedRow.hidden = !(config.plateFillMode === "gradient" && config.plateAnimateGradientAngle);
}

function syncPronounsTextControlsFromState() {
  const config = state.layout.pronounsText;
  if (!config) return;
  els.pronounsEnabled.checked = config.enabled;
  els.pronounsFont.value = config.fontFamily;
  els.pronounsFontBrowser.value = Array.from(els.pronounsFontBrowser.options).some((option) => option.value === config.fontFamily)
    ? config.fontFamily
    : "";
  els.pronounsFontSize.value = config.fontSize;
  els.pronounsFontSizeValue.textContent = `${config.fontSize} px`;
  els.pronounsTextColor.value = config.textColor;
  els.pronounsTextX.value = config.textX;
  els.pronounsTextY.value = config.textY;
  els.pronounsStrokeEnabled.checked = config.strokeEnabled;
  els.pronounsStrokeColor.value = config.strokeColor;
  els.pronounsStrokeWidth.value = config.strokeWidth;
  els.pronounsShadowEnabled.checked = config.shadowEnabled;
  els.pronounsShadowColor.value = config.shadowColor;
  els.pronounsShadowBlur.value = config.shadowBlur;
  els.pronounsShadowX.value = config.shadowX;
  els.pronounsShadowY.value = config.shadowY;
}

function syncFinishedTimeControlsFromState() {
  const config = activeFinishedTime();
  els.finishLockToNameplate.checked = config.lockToNameplate;
  els.finishFont.value = config.fontFamily;
  els.finishFontBrowser.value = Array.from(els.finishFontBrowser.options).some((option) => option.value === config.fontFamily)
    ? config.fontFamily
    : "";
  els.finishFontSize.value = config.fontSize;
  els.finishFontSizeValue.textContent = `${config.fontSize} px`;
  els.finishColor.value = config.color;
  els.finishAlign.value = config.align;
  els.finishStrokeEnabled.checked = config.strokeEnabled;
  els.finishStrokeColor.value = config.strokeColor;
  els.finishStrokeWidth.value = config.strokeWidth;
  els.finishShadowEnabled.checked = config.shadowEnabled;
  els.finishShadowColor.value = config.shadowColor;
  els.finishShadowBlur.value = config.shadowBlur;
  els.finishShadowX.value = config.shadowX;
  els.finishShadowY.value = config.shadowY;
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value)));
}

function makeOutputsEditable() {
  document.body.addEventListener("click", (event) => {
    const output = event.target.closest("output");
    if (!output || output.querySelector("input")) return;

    const label = output.closest("label");
    if (!label) return;
    const range = label.querySelector("input[type='range']");
    if (!range) return;

    // Prevent default label click behavior which targets range input
    event.preventDefault();

    const originalText = output.textContent;
    const numMatch = originalText.match(/-?[\d.]+/);
    if (!numMatch) return;
    const originalVal = Number(numMatch[0]);
    const suffix = originalText.substring(originalText.indexOf(numMatch[0]) + numMatch[0].length);

    const input = document.createElement("input");
    input.type = "number";
    input.className = "output-edit-input";
    input.value = originalVal;
    input.step = range.step !== "" ? range.step : 1;

    // Stop propagation of events so clicking the input doesn't trigger the label focus
    input.addEventListener("click", (e) => e.stopPropagation());
    input.addEventListener("pointerdown", (e) => e.stopPropagation());
    input.addEventListener("mousedown", (e) => e.stopPropagation());

    output.textContent = "";
    output.appendChild(input);
    input.focus();
    input.select();

    let committed = false;

    function commit() {
      if (committed) return;
      committed = true;

      let newVal = Number(input.value);
      if (isNaN(newVal) || input.value === "") newVal = originalVal;

      // Keep original min/max bounds
      const originalMax = range.max;
      const originalMin = range.min;

      // Temporarily expand bounds so the range input doesn't clamp the value when dispatched
      if (range.max !== "" && newVal > Number(range.max)) {
        range.max = newVal;
      }
      if (range.min !== "" && newVal < Number(range.min)) {
        range.min = newVal;
      }

      // Record history
      beginContinuousHistory(range.id || "value-edit");

      // Set value and trigger range input's handlers
      range.value = newVal;
      range.dispatchEvent(new Event("input", { bubbles: true }));
      range.dispatchEvent(new Event("change", { bubbles: true }));

      // Restore original range bounds
      range.max = originalMax;
      range.min = originalMin;

      // Restore display
      output.textContent = `${newVal}${suffix}`;
      cleanup();
    }

    function cancel() {
      if (committed) return;
      committed = true;
      output.textContent = originalText;
      cleanup();
    }

    function cleanup() {
      input.removeEventListener("blur", commit);
      input.removeEventListener("keydown", handleKey);
    }

    function handleKey(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        commit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancel();
      }
    }

    input.addEventListener("blur", commit);
    input.addEventListener("keydown", handleKey);
  });
}

function syncRangeInput(element, value) {
  if (!element) return;
  const val = Number(value);
  if (!isNaN(val)) {
    element.value = val;
  }
}
