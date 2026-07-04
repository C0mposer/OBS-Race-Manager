const STAGE = { width: 1920, height: 1080 };
const MANAGED_PREFIX = "ORM__";
const MAX_RUNNERS = 12;
const RUNNER_PARTS = ["Feed", "Border", "Name"];
const GLOBAL_PARTS = ["Background", "TimerBorder", "TimerText"];
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
  feed: { x: 0.042, y: 0.054, width: 0.916, height: 0.726 },
  name: { x: 0.042, y: 0.81, width: 0.916, height: 0.14 }
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
  timerBorder: true,
  builtInTimer: false
};
const DEFAULT_TIMER_TEXT = {
  fontFamily: "Segoe UI",
  fontSize: 54,
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
  startedAt: 0
};
const BORDER_PRESETS = {
  graphite: {
    mode: "solid",
    lineColor: "#566570",
    glowColor: "#566570",
    lineWidth: 14,
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
    textureY: 50
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
    textureY: 50
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
    textureY: 50
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
    textureY: 50
  }
};

const state = {
  layout: {
    aspectPreset: "4:3",
    timerHeight: 130,
    margin: 36,
    gap: 20,
    animationMs: 360,
    animationFps: 60,
    animationStyle: "moveFade",
    feedWidth: 1920,
    feedHeight: 1080,
    elements: { ...DEFAULT_ELEMENTS },
    setupPreviewSlot: 0,
    spotlight: {
      enabled: false,
      slots: "",
      showOthers: true,
      side: "bottom",
      stackOrder: "horizontal",
      mainScale: 78,
      otherScale: 22,
      gap: 20
    },
    timerText: { ...DEFAULT_TIMER_TEXT },
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
    borderPreset: "graphite",
    borderTarget: "feed",
    borderModeSource: "generated",
    borderStyles: {
      feed: structuredClone(BORDER_PRESETS.graphite),
      timer: structuredClone(BORDER_PRESETS.graphite)
    },
    borderImages: {
      feed: "",
      timer: ""
    },
    borderStyle: structuredClone(BORDER_PRESETS.graphite),
    borderImage: "",
    backgroundImage: ""
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
  kind: ""
};
const obsBridge = {
  client: null,
  connected: false,
  connecting: false,
  sceneName: "ORM__RaceMaster",
  itemIds: new Map(),
  autoApply: true,
  animateLayout: true,
  applyTimer: 0,
  applying: false,
  pendingApply: false,
  opacitySupported: false,
  lastRects: new Map(),
  lastVisibility: new Map()
};
let previewRefreshFrame = 0;
let previewRefreshTimer = 0;
let previewLiveRefreshFrame = 0;
let previewLiveRefreshUntil = 0;
let timerPreviewInterval = 0;

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  renderRunnerControls();
  renderStagePanels();
  bindGlobalControls();
  syncGlobalControlsFromState();
  bindStageSizing();
  update();
});

function createDefaultRunners() {
  return Array.from({ length: MAX_RUNNERS }, (_, index) => {
    const slot = index + 1;
    const runner = createRunner(slot, `Runner ${slot}`, `runner_${slot}_feed`, slot <= 2, zeroCrop());
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
    placement: slot,
    done: false,
    finalTimeMs: null,
    crop,
    collapsed: false
  };
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
  const shadows = [];
  if (config.strokeEnabled && Number(config.strokeWidth) > 0) {
    const width = Math.min(10, Math.max(1, Math.round(Number(config.strokeWidth))));
    for (let radius = 1; radius <= width; radius += 1) {
      const offset = radius * scale;
      shadows.push(`${offset}px 0 0 ${config.strokeColor}`);
      shadows.push(`${-offset}px 0 0 ${config.strokeColor}`);
      shadows.push(`0 ${offset}px 0 ${config.strokeColor}`);
      shadows.push(`0 ${-offset}px 0 ${config.strokeColor}`);
      shadows.push(`${offset}px ${offset}px 0 ${config.strokeColor}`);
      shadows.push(`${-offset}px ${offset}px 0 ${config.strokeColor}`);
      shadows.push(`${offset}px ${-offset}px 0 ${config.strokeColor}`);
      shadows.push(`${-offset}px ${-offset}px 0 ${config.strokeColor}`);
    }
  }
  if (config.shadowEnabled) {
    shadows.push(`${Number(config.shadowX) * scale}px ${Number(config.shadowY) * scale}px ${Number(config.shadowBlur) * scale}px ${config.shadowColor}`);
  }
  return shadows.length > 0 ? `text-shadow:${shadows.join(",")};` : "text-shadow:none;";
}

function bindElements() {
  els.runnerControls = document.getElementById("runnerControls");
  els.runnerLayer = document.getElementById("runnerLayer");
  els.stage = document.getElementById("stage");
  els.stageWrap = document.querySelector(".stage-wrap");
  els.timerBorder = document.getElementById("timerBorder");
  els.timerTextPreview = document.getElementById("timerTextPreview");
  els.activeCount = document.getElementById("activeCount");
  els.layoutSummary = document.getElementById("layoutSummary");
  els.aspectPreset = document.getElementById("aspectPreset");
  els.timerHeight = document.getElementById("timerHeight");
  els.marginSize = document.getElementById("marginSize");
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
  els.setupPreviewSlot = document.getElementById("setupPreviewSlot");
  els.spotlightEnabled = document.getElementById("spotlightEnabled");
  els.spotlightSlots = document.getElementById("spotlightSlots");
  els.spotlightShowOthers = document.getElementById("spotlightShowOthers");
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
  els.timerHeightValue = document.getElementById("timerHeightValue");
  els.marginValue = document.getElementById("marginValue");
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
  els.timerBorderEnabled = document.getElementById("timerBorderEnabled");
  els.feedVisible = document.getElementById("feedVisible");
  els.feedBorderVisible = document.getElementById("feedBorderVisible");
  els.nameVisible = document.getElementById("nameVisible");
  els.timerX = document.getElementById("timerX");
  els.timerY = document.getElementById("timerY");
  els.timerW = document.getElementById("timerW");
  els.timerH = document.getElementById("timerH");
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
  els.backgroundImage = document.getElementById("backgroundImage");
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
}

function bindGlobalControls() {
  els.undoAction.addEventListener("click", undo);
  els.redoAction.addEventListener("click", redo);
  els.saveProject.addEventListener("click", saveProject);
  els.loadProject.addEventListener("change", loadProjectFromFile);
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
  els.timerFontSize.addEventListener("change", endContinuousHistory);
  for (const [input, key] of [
    [els.timerIdleColor, "idleColor"],
    [els.timerStoppedColor, "stoppedColor"],
    [els.timerRunningColor, "runningColor"]
  ]) {
    input.addEventListener("change", () => {
      pushHistory(`timer-${key}`);
      state.layout.timerText[key] = input.value;
      update();
      scheduleObsApply("timerText", 120);
    });
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
    input.addEventListener("change", () => {
      pushHistory(`timer-${key}`);
      state.layout.timerText[key] = input.value;
      update();
      scheduleObsApply("timerText", 120);
    });
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
    [els.marginSize, "margin", els.marginValue, " px"],
    [els.gapSize, "gap", els.gapValue, " px"],
    [els.animationMs, "animationMs", els.animationValue, " ms"],
    [els.animationFps, "animationFps", els.animationFpsValue, " fps"]
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
      update();
      scheduleObsApply("background", 250);
    });
  });

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

  els.timerBorderEnabled.addEventListener("change", (event) => {
    pushHistory("timer border enabled");
    state.layout.timerBorder.enabled = event.target.checked;
    state.layout.elements.timerBorder = event.target.checked;
    update();
    scheduleObsApply("timerBorder", 120);
  });

  for (const [input, key, reason] of [
    [els.feedVisible, "feed", "feed-visible"],
    [els.feedBorderVisible, "feedBorder", "feed-border-visible"],
    [els.nameVisible, "name", "name-visible"]
  ]) {
    input.addEventListener("change", () => {
      pushHistory(reason);
      state.layout.elements[key] = input.checked;
      update();
      scheduleObsApply(reason, 120);
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
    [els.nameStrokeWidth, "strokeWidth", null, ""],
    [els.nameShadowBlur, "shadowBlur", null, ""],
    [els.nameShadowX, "shadowX", null, ""],
    [els.nameShadowY, "shadowY", null, ""]
  ];

  els.nameFont.addEventListener("change", (event) => {
    pushHistory("name font");
    state.layout.nameplate.fontFamily = event.target.value;
    update();
    scheduleObsApply("nameplate", 120);
  });
  els.nameFont.addEventListener("input", (event) => {
    state.layout.nameplate.fontFamily = event.target.value;
    update();
    scheduleObsApply("nameplate", 240);
  });
  els.nameFontBrowser.addEventListener("change", (event) => {
    if (!event.target.value) return;
    pushHistory("name font");
    state.layout.nameplate.fontFamily = event.target.value;
    syncNameplateControlsFromState();
    update();
    scheduleObsApply("nameplate", 120);
  });
  els.browseFonts.addEventListener("click", browseInstalledFonts);

  els.nameplateMode.addEventListener("change", (event) => {
    pushHistory("nameplate mode");
    state.layout.nameplate.plateMode = event.target.value;
    syncNameplateModeSections();
    update();
    scheduleObsApply("nameplate", 120);
  });

  els.nameplateImage.addEventListener("change", (event) => {
    readImageFile(event.target.files?.[0], (dataUrl) => {
      pushHistory("nameplate image");
      state.layout.nameplate.plateImage = dataUrl;
      state.layout.nameplate.plateMode = "image";
      syncNameplateControlsFromState();
      update();
      scheduleObsApply("nameplate-image", 250);
    });
    event.target.value = "";
  });

  els.clearNameplateImage.addEventListener("click", () => {
    if (!state.layout.nameplate.plateImage) return;
    pushHistory("clear nameplate image");
    state.layout.nameplate.plateImage = "";
    syncNameplateControlsFromState();
    update();
    scheduleObsApply("nameplate-image", 120);
  });

  for (const [input, key, output, suffix] of numberBindings) {
    input.addEventListener("focus", () => beginContinuousHistory(`nameplate-${key}`));
    input.addEventListener("change", endContinuousHistory);
    input.addEventListener("input", () => {
      state.layout.nameplate[key] = Number(input.value);
      if (output) output.textContent = `${state.layout.nameplate[key]}${suffix}`;
      update();
      scheduleObsApply("nameplate", 160);
    });
  }

  for (const [input, key] of [
    [els.nameTextColor, "textColor"],
    [els.namePlateBackgroundColor, "plateBackgroundColor"],
    [els.namePlateBorderColor, "plateBorderColor"],
    [els.nameStrokeColor, "strokeColor"],
    [els.nameShadowColor, "shadowColor"]
  ]) {
    input.addEventListener("change", () => {
      pushHistory(`nameplate-${key}`);
      state.layout.nameplate[key] = input.value;
      update();
      scheduleObsApply("nameplate", 120);
    });
  }

  for (const [input, key] of [
    [els.nameShowBox, "showBox"],
    [els.nameShowBorder, "showBorder"],
    [els.nameStrokeEnabled, "strokeEnabled"],
    [els.nameShadowEnabled, "shadowEnabled"]
  ]) {
    input.addEventListener("change", () => {
      pushHistory(`nameplate-${key}`);
      state.layout.nameplate[key] = input.checked;
      update();
      scheduleObsApply("nameplate", 120);
    });
  }
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
    [els.borderTextureY, "textureY"]
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
    input.addEventListener("change", () => {
      pushHistory(`border-${key}`);
      getEditingBorderStyle()[key] = input.value;
      state.layout.borderPreset = "custom";
      setEditingBorderImage("");
      state.layout.borderModeSource = "generated";
      syncBorderStyleControlsFromState();
      update();
      scheduleObsApply("border", 120);
    });
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
    const handle = event.target.closest("[data-resize-handle]");
    const target = handle
      ? handle.closest("[data-drag-target]")
      : event.target.closest("[data-drag-target]");
    if (!target) return;

    const kind = handle?.dataset.resizeHandle || target.dataset.dragTarget;
    setSelectedDragTarget(kind);
    const textDrag = kind === "nameText";
    const rect = textDrag ? getNameTextDragRect() : getDragRect(kind);
    const container = getDragContainer(kind, target);
    const sourceSize = textDrag ? getNameTextDragSourceSize(target) : null;

    drag = {
      kind,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      container,
      sourceSize,
      original: { ...rect },
      current: { ...rect },
      mode: textDrag ? "moveText" : handle ? "resize" : "move"
    };
    beginContinuousHistory(`${drag.mode}-${kind}`);

    target.setPointerCapture(event.pointerId);
    target.classList.add("dragging");
    event.preventDefault();
  });

  els.stage.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;

    if (drag.kind === "nameText") {
      const scaleX = drag.sourceSize.width / Math.max(1, drag.container.width);
      const scaleY = drag.sourceSize.height / Math.max(1, drag.container.height);
      drag.current = {
        textX: clampNumber(drag.original.textX + (event.clientX - drag.startX) * scaleX, -500, 500, drag.original.textX),
        textY: clampNumber(drag.original.textY + (event.clientY - drag.startY) * scaleY, -200, 200, drag.original.textY)
      };
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
    normalizeGeometryRect(drag.current);
    paintDragPreview(drag.kind, drag.current);
  });

  els.stage.addEventListener("pointerup", endPreviewDrag);
  els.stage.addEventListener("pointercancel", endPreviewDrag);
  els.stage.addEventListener("dblclick", (event) => {
    const target = event.target.closest("[data-drag-target='nameText']");
    if (!target) return;
    const slot = Number(target.closest(".runner-panel")?.dataset.slot);
    if (!slot) return;
    focusRunnerName(slot);
    event.preventDefault();
  });

  function endPreviewDrag(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const target = els.stage.querySelector(".dragging");
    target?.classList.remove("dragging");
    if (drag.kind === "nameText") {
      state.layout.nameplate.textX = round(drag.current.textX);
      state.layout.nameplate.textY = round(drag.current.textY);
      syncNameplateControlsFromState();
    } else {
      Object.assign(getDragRect(drag.kind), drag.current);
    }
    drag = null;
    endContinuousHistory();
    update();
    scheduleObsApply("drag-end", 0);
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

function getDragContainer(kind, target) {
  if (kind === "timer") return els.stage.getBoundingClientRect();
  if (kind === "nameText") return target.closest(".runner-nameplate").getBoundingClientRect();
  return target.closest(".runner-panel").getBoundingClientRect();
}

function getNameTextDragRect() {
  return {
    textX: Number(state.layout.nameplate.textX) || 0,
    textY: Number(state.layout.nameplate.textY) || 0
  };
}

function getNameTextDragSourceSize(target) {
  const panel = target.closest(".runner-panel");
  const slot = Number(panel?.dataset.slot);
  return nameSourceSize(getCurrentRectBySlot().get(slot));
}

function getDragRect(kind) {
  if (kind === "feed") return state.layout.panelGeometry.feed;
  if (kind === "name") return state.layout.panelGeometry.name;
  return state.layout.timerBorder;
}

function setSelectedDragTarget(kind) {
  selection.kind = kind;
  for (const element of els.stage.querySelectorAll("[data-drag-target]")) {
    element.classList.toggle("selected", element.dataset.dragTarget === kind);
  }
}

function normalizeGeometryRect(rect) {
  rect.width = Math.max(0.02, Math.min(1, Number(rect.width)));
  rect.height = Math.max(0.02, Math.min(1, Number(rect.height)));
  rect.x = Math.max(0, Math.min(1 - rect.width, Number(rect.x)));
  rect.y = Math.max(0, Math.min(1 - rect.height, Number(rect.y)));
}

function paintDragPreview(kind, rect) {
  if (kind === "nameText") {
    for (const content of els.runnerLayer.querySelectorAll(".name-content")) {
      content.style.transform = `translate(${round(rect.textX)}px, ${round(rect.textY)}px)`;
    }
    if (document.activeElement !== els.nameTextX) els.nameTextX.value = round(rect.textX);
    if (document.activeElement !== els.nameTextY) els.nameTextY.value = round(rect.textY);
    return;
  }

  if (kind === "timer") {
    applyNormalizedStyle(els.timerBorder, rect);
    return;
  }

  const selector = kind === "feed" ? ".game-viewport" : ".runner-nameplate";
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

function setActiveSettingsPanel(target) {
  for (const button of els.settingsTabs.querySelectorAll("[data-settings-target]")) {
    button.classList.toggle("active", button.dataset.settingsTarget === target);
  }

  for (const panel of document.querySelectorAll("[data-settings-panel]")) {
    const active = panel.dataset.settingsPanel === target;
    panel.classList.toggle("active", active);
    panel.open = active;
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
    setInputValue(node, "cropLeft", runner.crop.left);
    setInputValue(node, "cropTop", runner.crop.top);
    setInputValue(node, "cropRight", runner.crop.right);
    setInputValue(node, "cropBottom", runner.crop.bottom);
    syncCropOutputs(node, runner);
    syncFeedStatus(node, runner);
    syncRunnerFinishButtons(node, runner);

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
  if (doneButton) doneButton.textContent = runner.done ? `Done: ${formatTimerDisplay(runner.finalTimeMs ?? 0)}` : "Done";
  if (resetButton) resetButton.hidden = !runner.done;
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
      </div>
    `;
    els.runnerLayer.appendChild(panel);
  }
}

function handleRunnerInput(event, runner, node) {
  const field = event.target.dataset.field;
  if (!field) return;

  if (field === "active") {
    pushHistory("runner active");
    runner.active = event.target.checked;
  } else if (field === "name" || field === "source") {
    beginContinuousHistory(`runner-${runner.slot}-${field}`);
    runner[field] = event.target.value;
    syncFeedStatus(node, runner);
  } else if (field.startsWith("crop")) {
    beginContinuousHistory(`runner-${runner.slot}-${field}`);
    const cropKey = field.replace("crop", "").toLowerCase();
    runner.crop[cropKey] = Math.max(0, Number(event.target.value) || 0);
    clampCrop(runner.crop, cropKey);
    syncCropOutputs(node, runner);
  }

  update();
  scheduleObsApply(field, field.startsWith("crop") ? 80 : 250);
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
  }
}

function markRunnerDone(runner) {
  pushHistory("runner done");
  runner.done = true;
  runner.finalTimeMs = currentTimerElapsedMs();
  renderRunnerControls();
  update();
  scheduleObsApply("nameplate", 120);
}

function resetRunnerDone(runner) {
  pushHistory("runner finish reset");
  runner.done = false;
  runner.finalTimeMs = null;
  renderRunnerControls();
  update();
  scheduleObsApply("nameplate", 120);
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
    obsBridge.sceneName = els.obsSceneName.value.trim() || "ORM__RaceMaster";
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

  try {
    setObsUiBusy(true);
    obsBridge.sceneName = els.obsSceneName.value.trim() || "ORM__RaceMaster";
    logObs(`Creating or repairing ${obsBridge.sceneName}...`);
    await ensureScene(obsBridge.sceneName);
    await cleanupManagedInputs({ keepScene: true });
    obsBridge.itemIds.clear();
    obsBridge.lastRects.clear();
    obsBridge.lastVisibility.clear();

    await createBrowserInput("Background", obsBridge.sceneName, htmlDataUrl(buildBackgroundHtml()), STAGE.width, STAGE.height, true);
    await createBrowserInput("TimerBorder", obsBridge.sceneName, htmlDataUrl(buildTimerBorderHtml()), STAGE.width, STAGE.height, state.layout.timerBorder.enabled);
    const timerTextSize = timerTextSourceSize();
    await createBrowserInput("TimerText", obsBridge.sceneName, htmlDataUrl(buildTimerTextHtml()), timerTextSize.width, timerTextSize.height, state.layout.elements.builtInTimer);

    const rectBySlot = getCurrentRectBySlot();
    for (const runner of state.runners) {
      await createRunnerObsInputs(runner, rectBySlot.get(runner.slot));
    }

    obsBridge.opacitySupported = await ensureOpacityFilters();
    await enforceSceneLayerOrder();
    await obsCall("SetCurrentProgramScene", { sceneName: obsBridge.sceneName });
    await applyLayoutToObs();
    logObs("Managed OBS scene is ready.");
  } catch (error) {
    logObs(`Create / repair failed: ${error.message}`);
  } finally {
    setObsUiBusy(false);
  }
}

async function applyLayoutToObs(options = {}) {
  if (!requireObs()) return;

  try {
    if (!options.scheduled) setObsUiBusy(true);
    const refreshInputs = options.refreshInputs ?? !options.scheduled;
    const animate = (options.forceAnimate || shouldAnimateObsLayout(options.reason)) && obsBridge.animateLayout;
    const rectBySlot = getCurrentRectBySlot();
    if (refreshInputs) {
      await setInputUrl("Background", htmlDataUrl(buildBackgroundHtml()));
      await setInputUrl("TimerBorder", htmlDataUrl(buildTimerBorderHtml()));
      await updateTimerTextInput();
    }

    await ensureManagedGlobalSources();
    await setSceneItemTransform("Background", {
      positionX: 0,
      positionY: 0,
      boundsWidth: STAGE.width,
      boundsHeight: STAGE.height
    });
    await setSceneItemEnabled("TimerBorder", state.layout.timerBorder.enabled && state.layout.elements.timerBorder);
    await setSceneItemTransform("TimerBorder", absoluteRect(state.layout.timerBorder));
    await setSceneItemEnabled("TimerText", state.layout.elements.builtInTimer);
    await setSceneItemTransform("TimerText", absoluteRect(state.layout.timerBorder), null, { boundsType: "OBS_BOUNDS_SCALE_INNER" });
    await ensureManagedRunnerSources();
    await ensureRunnerItemIds();
    await enforceSceneLayerOrder();

    for (const runner of state.runners) {
      if (refreshInputs) await updateRunnerInputs(runner, rectBySlot.get(runner.slot));
    }

    if (animate) {
      await animateRunnerLayout(rectBySlot);
    } else {
      await applyRunnerLayoutImmediate(rectBySlot);
    }

    logObs(options.scheduled ? `Live OBS update: ${options.reason || "change"}.` : "Applied current layout to OBS.");
  } catch (error) {
    logObs(`Apply layout failed: ${error.message}`);
  } finally {
    if (!options.scheduled) setObsUiBusy(false);
  }
}

async function applyRunnerLayoutImmediate(rectBySlot) {
  for (const runner of state.runners) {
    const rect = rectBySlot.get(runner.slot) ?? hiddenRect();
    await setRunnerVisible(runner.slot, runner.active);
    await setRunnerTransforms(runner, rect, 1);
    rememberObsRunnerState(runner.slot, rect, runner.active);
  }
}

async function animateRunnerLayout(rectBySlot) {
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
      willBeVisible: runner.active,
      from,
      to
    };
  });

  for (const plan of plans) {
    if (plan.wasVisible || plan.willBeVisible) {
      await setRunnerVisible(plan.runner.slot, true);
      if (!plan.wasVisible && plan.willBeVisible) {
        await setRunnerTransforms(plan.runner, plan.from, style.usesFade ? 0 : 1);
      }
    }
  }

  for (let frame = 1; frame <= frames; frame += 1) {
    const t = easeOutCubic(frame / frames);
    const requests = [];
    for (const plan of plans) {
      if (!plan.wasVisible && !plan.willBeVisible) continue;
      const rect = animationFrameRect(plan.from, plan.to, t, plan, style);
      const opacity = animationFrameOpacity(t, plan, style);
      requests.push(...runnerTransformRequests(plan.runner, rect, opacity));
    }
    if (requests.length > 0) await obsBatch(requests);
    if (frame < frames) await delay(frameMs);
  }

  for (const plan of plans) {
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
    sceneItemTransformRequest(runnerPart(runner.slot, "Feed"), viewportRect(rect, state.layout.panelGeometry.feed), cropPixels(runner.crop)),
    sceneItemTransformRequest(runnerPart(runner.slot, "Name"), viewportRect(rect, state.layout.panelGeometry.name))
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
  const hasFade = obsBridge.opacitySupported && (style === "moveFade" || style === "scaleFade" || style === "fade");
  return {
    usesMovement: style !== "fade" || !hasFade,
    usesScale: style === "scaleFade",
    usesFade: hasFade,
    fadesMoving: style === "moveFade"
  };
}

function animationFrameRect(from, to, t, plan, style) {
  if (!style.usesMovement) {
    return t >= 1 && plan.willBeVisible ? to : from;
  }

  if (!style.usesScale) {
    return lerpRect(from, to, t);
  }

  if (!plan.wasVisible && plan.willBeVisible) {
    return scaleRectFromCenter(to, Math.max(0.12, t));
  }

  if (plan.wasVisible && !plan.willBeVisible) {
    return scaleRectFromCenter(from, Math.max(0.12, 1 - t));
  }

  const moved = lerpRect(from, to, t);
  return scaleRectFromCenter(moved, 1 - 0.08 * Math.sin(t * Math.PI));
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
    "name",
    "vdo-clean",
    "border",
    "timerText",
    "timerBorder",
    "geometry",
    "background",
    "border-image",
    "feedWidth",
    "feedHeight",
    "nameplate",
    "active-runners",
    "active",
    "runner-add",
    "runner-remove",
    "aspectPreset",
    "timerHeight",
    "margin",
    "gap",
    "spotlight",
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
    "margin",
    "gap",
    "spotlight",
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

async function cleanupObsScene() {
  if (!requireObs()) return;

  try {
    setObsUiBusy(true);
    logObs("Cleaning up managed ORM__ sources...");
    await cleanupManagedInputs({ keepScene: true });
    obsBridge.itemIds.clear();
    obsBridge.lastRects.clear();
    obsBridge.lastVisibility.clear();
    obsBridge.opacitySupported = false;
    logObs("Cleanup complete. Managed scene was left in place.");
  } catch (error) {
    logObs(`Cleanup failed: ${error.message}`);
  } finally {
    setObsUiBusy(false);
  }
}

function setInputValue(root, field, value) {
  const inputs = root.querySelectorAll(`[data-field='${field}']`);
  for (const input of inputs) {
    if (input.type === "checkbox") input.checked = Boolean(value);
    else input.value = value;
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

  els.stage.style.setProperty("--timer-height", state.layout.timerHeight);
  els.stage.classList.toggle("custom-background", Boolean(state.layout.backgroundImage));
  els.stage.style.backgroundImage = state.layout.backgroundImage ? `url("${state.layout.backgroundImage}")` : "";
  els.activeCount.textContent = `${activeRunners.length} active`;
  els.layoutSummary.textContent = `${STAGE.width}x${STAGE.height} canvas, ${state.layout.aspectPreset} game frames`;
  syncGeometryControls();
  applyTimerBorderPreviewGeometry();
  applyTimerTextPreviewGeometry();

  for (const runner of state.runners) {
    const rect = previewRectBySlot.get(runner.slot) ?? hiddenRect();
    applyPanelGeometry(runner, rect, previewRectBySlot.has(runner.slot));
  }

  schedulePreviewRefresh(previewRectBySlot);
  schedulePreviewRefresh(previewRectBySlot, state.layout.animationMs + 80);
  startPreviewLiveRefresh(previewRectBySlot, state.layout.animationMs + 120);
}

function applyTimerBorderPreviewGeometry() {
  const visible = state.layout.timerBorder.enabled && state.layout.elements.timerBorder;
  els.timerBorder.className = `timer-border drag-target ${state.layout.borderPreset}${visible ? "" : " hidden"}`;
  els.timerBorder.style.transitionDuration = `${state.layout.animationMs}ms`;
  applyNormalizedStyle(els.timerBorder, state.layout.timerBorder);
}

function applyTimerTextPreviewGeometry() {
  const visible = state.layout.elements.builtInTimer;
  const sourceSize = timerTextSourceSize();
  const stageScale = els.stage.clientWidth / STAGE.width;
  const fontSize = Math.min(Number(state.layout.timerText.fontSize), sourceSize.height * 0.76) * stageScale;
  els.timerTextPreview.classList.toggle("hidden", !visible);
  els.timerTextPreview.textContent = formatTimerDisplay(currentTimerElapsedMs());
  els.timerTextPreview.style.fontFamily = cssFontStack(state.layout.timerText.fontFamily);
  els.timerTextPreview.style.fontSize = `${fontSize}px`;
  els.timerTextPreview.style.color = timerTextColor();
  els.timerTextPreview.style.textShadow = timerTextShadowCss(state.layout.timerText, stageScale);
  applyNormalizedStyle(els.timerTextPreview, state.layout.timerBorder);
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
    [els.timerX, state.layout.timerBorder.x],
    [els.timerY, state.layout.timerBorder.y],
    [els.timerW, state.layout.timerBorder.width],
    [els.timerH, state.layout.timerBorder.height]
  ];

  for (const [input, value] of values) {
    if (document.activeElement !== input) input.value = round(value);
  }
  els.timerBorderEnabled.checked = state.layout.timerBorder.enabled && state.layout.elements.timerBorder;
  els.feedVisible.checked = state.layout.elements.feed;
  els.feedBorderVisible.checked = state.layout.elements.feedBorder;
  els.nameVisible.checked = state.layout.elements.name;
}

function getCurrentRectBySlot() {
  const activeRunners = getActiveRunners().sort((a, b) => a.placement - b.placement);
  const rects = state.layout.spotlight.enabled
    ? generateSpotlightLayout(activeRunners, state.layout)
    : generateLayout(activeRunners.length, state.layout);
  const rectBySlot = new Map();
  activeRunners.forEach((runner, index) => {
    rectBySlot.set(runner.slot, rects[index]);
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
    12: [4, 4, 4]
  };
  return patterns[count] ?? patterns[12];
}

function generateLayout(count, layout) {
  if (count <= 0) return [];

  const rows = rowPattern(count);
  const aspect = aspectValue(layout.aspectPreset);
  const available = {
    x: layout.margin,
    y: layout.margin,
    width: STAGE.width - layout.margin * 2,
    height: STAGE.height - layout.timerHeight - layout.margin * 2
  };
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
  const available = {
    x: layout.margin,
    y: layout.margin,
    width: STAGE.width - layout.margin * 2,
    height: STAGE.height - layout.timerHeight - layout.margin * 2
  };
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

  return activeRunners.map((runner) => rectsBySlot.get(runner.slot) ?? hiddenRect());
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

function hiddenRect() {
  return {
    x: STAGE.width / 2 - 10,
    y: STAGE.height / 2 - 10,
    width: 20,
    height: 20
  };
}

function applyPanelGeometry(runner, rect, visible = runner.active) {
  const panel = els.runnerLayer.querySelector(`[data-slot='${runner.slot}']`);
  const viewport = panel.querySelector(".game-viewport");
  const feed = panel.querySelector(".feed-art");
  const nameplate = panel.querySelector(".runner-nameplate");

  panel.className = `runner-panel ${state.layout.borderPreset}`;
  panel.classList.toggle("hidden", !visible);
  panel.classList.toggle("setup-preview", visible && !runner.active);
  panel.classList.toggle("runner-done", Boolean(runner.done));
  panel.style.transitionDuration = `${state.layout.animationMs}ms`;
  panel.style.left = `${(rect.x / STAGE.width) * 100}%`;
  panel.style.top = `${(rect.y / STAGE.height) * 100}%`;
  panel.style.width = `${(rect.width / STAGE.width) * 100}%`;
  panel.style.height = `${(rect.height / STAGE.height) * 100}%`;

  applyNormalizedStyle(viewport, state.layout.panelGeometry.feed);
  applyNormalizedStyle(nameplate, state.layout.panelGeometry.name);
  viewport.classList.toggle("hidden-element", !state.layout.elements.feed);
  panel.querySelector(".runner-shell").classList.toggle("hide-border", !state.layout.elements.feedBorder);
  nameplate.classList.toggle("hidden-element", !state.layout.elements.name);
  applyCrop(feed, runner.crop);
  feed.dataset.source = runner.source;
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
  applyBorderPreview(els.timerBorder, true);

  for (const runner of state.runners) {
    const panel = els.runnerLayer.querySelector(`[data-slot='${runner.slot}']`);
    if (!panel) continue;
    const rect = rectBySlot.get(runner.slot) ?? hiddenRect();
    applyBorderPreview(panel.querySelector(".runner-shell"), false);
    applyNameplatePreview(panel.querySelector(".runner-nameplate"), runner, rect);
  }
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

function applyBorderPreview(element, isTimer) {
  let preview = element.querySelector(".border-preview-frame");
  if (!preview) {
    preview = document.createElement("div");
    preview.className = "border-preview-frame";
    preview.setAttribute("aria-hidden", "true");
    element.prepend(preview);
  }

  const sourceSize = isTimer
    ? { width: STAGE.width, height: STAGE.height }
    : { width: state.layout.feedWidth, height: state.layout.feedHeight };
  const previewWidth = Math.max(1, element.clientWidth);
  const previewHeight = Math.max(1, element.clientHeight);
  const basePreviewStyle = `width:${sourceSize.width}px;height:${sourceSize.height}px;transform:scale(${previewWidth / sourceSize.width}, ${previewHeight / sourceSize.height});`;

  const target = isTimer ? "timer" : "feed";
  const image = getBorderImage(target);
  if (image) {
    preview.style.cssText = `${basePreviewStyle}position:absolute;left:0;top:0;background-color:transparent;background-image:url("${image}");background-size:100% 100%;background-repeat:no-repeat;`;
  } else {
    preview.style.cssText = `${basePreviewStyle}${borderFrameCss(isTimer, getBorderStyle(target))}`;
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
  const finish = runner.done ? `<em>${escapeHtml(formatTimerDisplay(runner.finalTimeMs ?? 0))}</em>` : "";
  const sourceSize = nameSourceSize(rect);
  const previewWidth = Math.max(1, nameplate.clientWidth);
  const previewHeight = Math.max(1, nameplate.clientHeight);
  const plateImage = config.showBox && config.plateMode === "image" && config.plateImage
    ? `<img class="plate-art" src="${escapeAttribute(config.plateImage)}" alt="">`
    : "";
  const markup = `${plateImage}<div class="name-content" title="Drag the text to move it inside the nameplate"><strong class="name-text-drag" data-drag-target="nameText">${escapeHtml(runner.name)}</strong>${finish}</div>`;
  if (frame.dataset.markup !== markup) {
    frame.dataset.markup = markup;
    frame.innerHTML = markup;
  }

  frame.style.cssText = `${nameplateFrameCss(config, sourceSize.width, sourceSize.height)}font-family:${cssFontStack(config.fontFamily)};color:${config.textColor};text-rendering:geometricPrecision;-webkit-font-smoothing:antialiased;font-stretch:normal;letter-spacing:0;transform:scale(${previewWidth / sourceSize.width}, ${previewHeight / sourceSize.height});`;
  const content = frame.querySelector(".name-content");
  if (content) content.style.cssText = nameplateContentCss(config);
  const strong = frame.querySelector("strong");
  if (strong) strong.style.cssText = nameplateStrongCss(config, `${sourceSize.height * NAME_FONT_HEIGHT_RATIO}px`);
  const finishElement = frame.querySelector("em");
  if (finishElement) finishElement.style.cssText = nameplateFinishCss(config, `${sourceSize.height * NAME_FONT_HEIGHT_RATIO}px`);
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
      margin: state.layout.margin,
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
        timer: Boolean(state.layout.borderImages.timer)
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
  for (const inputName of names) {
    try {
      await obsCall("RemoveInput", { inputName });
    } catch (error) {
      if (!/not found|ResourceNotFound|does not exist/i.test(error.message)) {
        logObs(`Could not remove ${inputName}: ${error.message}`);
      }
    }
  }
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
  for (const runner of state.runners) {
    for (const part of RUNNER_PARTS) {
      names.push(runnerPart(runner.slot, part));
    }
  }
  return names;
}

async function createRunnerObsInputs(runner, rect = null) {
  const nameSize = nameSourceSize(rect);
  await createBrowserInput(runnerPart(runner.slot, "Feed"), obsBridge.sceneName, buildFeedUrl(runner), state.layout.feedWidth, state.layout.feedHeight, runner.active);
  await createBrowserInput(runnerPart(runner.slot, "Border"), obsBridge.sceneName, htmlDataUrl(buildBorderHtml()), state.layout.feedWidth, state.layout.feedHeight, runner.active);
  await createBrowserInput(runnerPart(runner.slot, "Name"), obsBridge.sceneName, htmlDataUrl(buildNameHtml(runner)), nameSize.width, nameSize.height, runner.active);
}

async function createBrowserInput(partName, sceneName, url, width, height, enabled) {
  const inputName = `${MANAGED_PREFIX}${partName}`;
  const response = await obsCall("CreateInput", {
    sceneName,
    inputName,
    inputKind: "browser_source",
    inputSettings: {
      url,
      width,
      height,
      css: "html, body { background: rgba(0, 0, 0, 0) !important; overflow: hidden; }",
      reroute_audio: false,
      shutdown: false,
      restart_when_active: false
    },
    sceneItemEnabled: enabled
  });

  if (response?.sceneItemId !== undefined) {
    obsBridge.itemIds.set(inputName, response.sceneItemId);
  }
  return inputName;
}

async function ensureOpacityFilters() {
  let allSupported = true;

  for (const runner of state.runners) {
    for (const part of RUNNER_PARTS) {
      const sourceName = `${MANAGED_PREFIX}${runnerPart(runner.slot, part)}`;
      const created = await ensureOpacityFilter(sourceName);
      allSupported = allSupported && created;
    }
  }

  if (!allSupported) {
    logObs("Opacity filters were not available for every source. Fade presets will fall back to movement/scale.");
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
  const nameSize = nameSourceSize(rect);
  await setBrowserInputSettings(runnerPart(runner.slot, "Feed"), {
    url: buildFeedUrl(runner),
    width: state.layout.feedWidth,
    height: state.layout.feedHeight
  });
  await setInputUrl(runnerPart(runner.slot, "Border"), htmlDataUrl(buildBorderHtml()));
  await setBrowserInputSettings(runnerPart(runner.slot, "Name"), {
    url: htmlDataUrl(buildNameHtml(runner)),
    width: nameSize.width,
    height: nameSize.height
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
  await setSceneItemEnabled(runnerPart(slot, "Name"), visible && state.layout.elements.name);
}

async function ensureRunnerItemIds() {
  for (const part of GLOBAL_PARTS) {
    await getSceneItemId(`${MANAGED_PREFIX}${part}`);
  }
  for (const runner of state.runners) {
    for (const part of RUNNER_PARTS) {
      await getSceneItemId(`${MANAGED_PREFIX}${runnerPart(runner.slot, part)}`);
    }
  }
}

async function ensureManagedGlobalSources() {
  const timerTextSize = timerTextSourceSize();
  const globals = [
    ["Background", htmlDataUrl(buildBackgroundHtml()), STAGE.width, STAGE.height, true],
    ["TimerBorder", htmlDataUrl(buildTimerBorderHtml()), STAGE.width, STAGE.height, state.layout.timerBorder.enabled && state.layout.elements.timerBorder],
    ["TimerText", htmlDataUrl(buildTimerTextHtml()), timerTextSize.width, timerTextSize.height, state.layout.elements.builtInTimer]
  ];

  for (const [part, url, width, height, enabled] of globals) {
    const inputName = `${MANAGED_PREFIX}${part}`;
    try {
      await getSceneItemId(inputName);
    } catch {
      await createBrowserInput(part, obsBridge.sceneName, url, width, height, enabled);
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
          await createBrowserInput(runnerPart(runner.slot, "Feed"), obsBridge.sceneName, buildFeedUrl(runner), state.layout.feedWidth, state.layout.feedHeight, runner.active);
        } else if (part === "Border") {
          await createBrowserInput(runnerPart(runner.slot, "Border"), obsBridge.sceneName, htmlDataUrl(buildBorderHtml()), state.layout.feedWidth, state.layout.feedHeight, runner.active);
        } else {
          const nameSize = nameSourceSize(rectBySlot.get(runner.slot));
          await createBrowserInput(runnerPart(runner.slot, "Name"), obsBridge.sceneName, htmlDataUrl(buildNameHtml(runner)), nameSize.width, nameSize.height, runner.active);
        }
        createdAny = true;
      }
    }
  }

  if (createdAny) {
    obsBridge.opacitySupported = await ensureOpacityFilters();
  }
}

async function setSceneItemEnabled(partName, enabled) {
  const sceneItemId = await getSceneItemId(`${MANAGED_PREFIX}${partName}`);
  await obsCall("SetSceneItemEnabled", {
    sceneName: obsBridge.sceneName,
    sceneItemId,
    sceneItemEnabled: enabled
  });
}

async function enforceSceneLayerOrder() {
  const requests = [];
  let index = 0;

  requests.push(sceneItemIndexRequest("Background", index));
  index += 1;

  for (const runner of state.runners) {
    for (const part of RUNNER_PARTS) {
      requests.push(sceneItemIndexRequest(runnerPart(runner.slot, part), index));
      index += 1;
    }
  }

  requests.push(sceneItemIndexRequest("TimerBorder", index));
  index += 1;
  requests.push(sceneItemIndexRequest("TimerText", index));

  await obsBatch(requests);
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
    throw new Error(`Scene item ID for ${inputName} is not cached. Run Create / Repair first.`);
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

function nameSourceSize(rect) {
  const sourceRect = rect ? viewportRect(rect, state.layout.panelGeometry.name) : null;
  return {
    width: Math.max(96, Math.round(sourceRect?.width ?? 960)),
    height: Math.max(24, Math.round(sourceRect?.height ?? 120))
  };
}

function timerTextSourceSize() {
  const rect = absoluteRect(state.layout.timerBorder);
  return {
    width: Math.max(96, Math.round(rect.width)),
    height: Math.max(24, Math.round(rect.height))
  };
}

function buildBackgroundHtml() {
  if (state.layout.backgroundImage) {
    return `<!doctype html><html><body><img src="${escapeAttribute(state.layout.backgroundImage)}" alt="" class="bg"></body><style>${baseHtmlCss()} .bg{width:100vw;height:100vh;object-fit:cover;display:block;}</style></html>`;
  }

  return `<!doctype html><html><body><div class="bg"></div></body><style>${baseHtmlCss()} .bg{width:100vw;height:100vh;background:linear-gradient(135deg,rgba(45,198,163,.25),transparent 38%),linear-gradient(315deg,rgba(240,184,74,.2),transparent 38%),#11161a;}</style></html>`;
}

function buildFeedUrl(runner) {
  if (isUrl(runner.source)) {
    return runner.source.trim();
  }

  return htmlDataUrl(buildFeedHtml(runner));
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
  return getBorderStyle(state.layout.borderTarget);
}

function getBorderStyle(target) {
  const key = target === "timer" ? "timer" : "feed";
  state.layout.borderStyles[key] ??= structuredClone(BORDER_PRESETS.graphite);
  return state.layout.borderStyles[key];
}

function getBorderImage(target) {
  const key = target === "timer" ? "timer" : "feed";
  return state.layout.borderImages?.[key] || "";
}

function setEditingBorderImage(value) {
  const key = state.layout.borderTarget === "timer" ? "timer" : "feed";
  state.layout.borderImages ??= { feed: "", timer: "" };
  state.layout.borderImages[key] = value;
}

function buildBorderHtml() {
  const image = getBorderImage("feed");
  if (image) {
    return `<!doctype html><html><body><img src="${escapeAttribute(image)}" alt=""></body><style>${baseHtmlCss()} img{width:100vw;height:100vh;object-fit:fill;display:block;}</style></html>`;
  }

  return buildGeneratedBorderHtml(false, getBorderStyle("feed"));
}

function buildTimerBorderHtml() {
  const image = getBorderImage("timer");
  if (image) {
    return `<!doctype html><html><body><img src="${escapeAttribute(image)}" alt=""></body><style>${baseHtmlCss()} img{width:100vw;height:100vh;object-fit:fill;display:block;}</style></html>`;
  }

  return buildGeneratedBorderHtml(true, getBorderStyle("timer"));
}

function buildTimerTextHtml() {
  const config = state.layout.timerText;
  const size = timerTextSourceSize();
  const start = config.state === "running" ? Number(config.startedAt || Date.now()) : 0;
  const elapsed = currentTimerElapsedMs();
  const fontSize = Math.min(Number(config.fontSize), size.height * 0.76);
  return `<!doctype html><html><body><div id="timer">${formatTimerDisplay(elapsed)}</div><script>const state=${JSON.stringify(config.state)};const startedAt=${start};const format=${JSON.stringify(config.format)};let elapsed=${elapsed};function fmt(ms){const totalSeconds=Math.floor(ms/1000);const hours=Math.floor(totalSeconds/3600);const totalMinutes=Math.floor(totalSeconds/60);const minutes=Math.floor((totalSeconds%3600)/60);const seconds=totalSeconds%60;if(format==="mmss")return String(totalMinutes).padStart(2,"0")+":"+String(seconds).padStart(2,"0");if(format==="mmssms")return String(totalMinutes).padStart(2,"0")+":"+String(seconds).padStart(2,"0")+"."+String(Math.floor(ms%1000)).padStart(3,"0");return [hours,minutes,seconds].map(v=>String(v).padStart(2,"0")).join(":");}function tick(){if(state==="running") elapsed=Math.max(0,Date.now()-startedAt);document.getElementById("timer").textContent=fmt(elapsed);}tick();if(state==="running") setInterval(tick,format==="mmssms"?33:200);</script></body><style>${baseHtmlCss()} body{display:grid;place-items:center;font-family:${cssFontStack(config.fontFamily)};}#timer{max-width:100vw;max-height:100vh;overflow:hidden;white-space:nowrap;text-overflow:clip;font-size:${fontSize}px;line-height:1;font-weight:900;color:${timerTextColor()};${timerTextShadowCss(config)}}</style></html>`;
}

function buildGeneratedBorderHtml(isTimer, style) {
  const animationCss = borderAnimationCss(style);
  return `<!doctype html><html><body><div class="frame"></div></body><style>${baseHtmlCss()} ${animationCss}.frame{${borderFrameCss(isTimer, style)}}</style></html>`;
}

function borderFrameCss(isTimer, style = getBorderStyle(isTimer ? "timer" : "feed")) {
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
    ? `--orm-gradient-angle-start:${style.gradientAngle}deg;--orm-gradient-angle:${style.gradientAngle}deg;border:${lineWidth}px solid transparent;background:linear-gradient(${angle}, ${style.gradientFrom}, ${style.gradientTo}) border-box;-webkit-mask:linear-gradient(#000 0 0) padding-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;${animation}`
    : style.mode === "texture" && style.textureImage
      ? `border:${lineWidth}px solid transparent;background-image:url("${escapeCssString(style.textureImage)}");background-size:${style.textureScale}% ${style.textureScale}%;background-position:${style.textureX}% ${style.textureY}%;background-repeat:repeat;-webkit-mask:linear-gradient(#000 0 0) padding-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;`
    : `border:${lineWidth}px solid ${style.lineColor};`;
  const background = style.mode === "gradient" || style.mode === "texture" ? "" : "background:transparent;";
  return `position:absolute;inset:0;${borderPaint}box-shadow:inset 0 0 0 ${insetWidth}px rgba(255,255,255,.16),inset 0 0 ${innerGlowSize}px ${innerGlow},0 0 ${glowSize}px ${glow};border-radius:${style.radius}px;${background}box-sizing:border-box;`;
}

function borderAnimationCss(style) {
  if (style.mode !== "gradient" || !style.animateGradientAngle || Number(style.gradientAngleSpeed) === 0) return "";
  return `@property --orm-gradient-angle{syntax:"<angle>";inherits:false;initial-value:${style.gradientAngle}deg;}@keyframes ormGradientAnglePositive{to{--orm-gradient-angle:calc(var(--orm-gradient-angle-start) + 360deg);}}@keyframes ormGradientAngleNegative{to{--orm-gradient-angle:calc(var(--orm-gradient-angle-start) - 360deg);}}`;
}

function gradientAnimationName(style) {
  return Number(style.gradientAngleSpeed) >= 0 ? "ormGradientAnglePositive" : "ormGradientAngleNegative";
}

function gradientAnimationDuration(style) {
  const speed = Math.abs(Number(style.gradientAngleSpeed));
  return round(360 / speed);
}

function buildNameHtml(runner) {
  const config = state.layout.nameplate;
  const finish = runner.done ? `<em>${escapeHtml(formatTimerDisplay(runner.finalTimeMs ?? 0))}</em>` : "";
  const plateImage = config.showBox && config.plateMode === "image" && config.plateImage;
  const plateImageMarkup = plateImage ? `<img class="plate-art" src="${escapeAttribute(config.plateImage)}" alt="">` : "";
  return `<!doctype html><html><body><div class="bar">${plateImageMarkup}<div class="name-content"><strong>${escapeHtml(runner.name)}</strong>${finish}</div></div></body><style>${baseHtmlCss()} body{font-family:${cssFontStack(config.fontFamily)};color:${config.textColor};text-rendering:geometricPrecision;-webkit-font-smoothing:antialiased;font-stretch:normal;letter-spacing:0;}.bar{${nameplateFrameCss(config)}}.plate-art{position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block;z-index:0;pointer-events:none;}.name-content{${nameplateContentCss(config)}}strong{${nameplateStrongCss(config)}}em{${nameplateFinishCss(config)}}</style></html>`;
}

function nameplateFrameCss(config, width = "100%", height = "100%") {
  const background = config.showBox
    ? hexToRgba(config.plateBackgroundColor, Number(config.plateBackgroundOpacity) / 100)
    : "transparent";
  const borderWidth = Math.max(0, Number(config.plateBorderWidth) || 0);
  const borderColor = hexToRgba(config.plateBorderColor, Number(config.plateBorderOpacity) / 100);
  const border = config.showBorder ? `${borderWidth}px solid ${borderColor}` : `${borderWidth}px solid transparent`;
  const generatedPlate = config.plateMode !== "image";
  const plateBackground = generatedPlate ? background : "transparent";
  const plateBorder = generatedPlate ? border : `${borderWidth}px solid transparent`;
  return `position:absolute;left:0;top:0;width:${typeof width === "number" ? `${width}px` : width};height:${typeof height === "number" ? `${height}px` : height};display:flex;align-items:center;justify-content:space-between;gap:2%;padding:0 ${Math.max(0, Number(config.platePaddingX) || 0)}px;background:${plateBackground};border:${plateBorder};border-radius:${Math.max(0, Number(config.plateRadius) || 0)}px;overflow:hidden;box-sizing:border-box;transform-origin:0 0;`;
}

function nameplateContentCss(config) {
  return `position:relative;z-index:1;display:inline-flex;align-items:center;gap:14px;max-width:100%;min-width:0;transform:translate(${Number(config.textX) || 0}px, ${Number(config.textY) || 0}px);`;
}

function nameplateStrongCss(config, heightLimit = `${NAME_FONT_HEIGHT_RATIO * 100}vh`) {
  const shadow = nameTextShadowCss(config);
  return `display:block;min-width:0;max-width:100%;font-size:min(${config.fontSize}px,${heightLimit});font-weight:800;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${config.textColor};${shadow}`;
}

function nameplateFinishCss(config, heightLimit = `${NAME_FONT_HEIGHT_RATIO * 100}vh`) {
  const shadow = nameTextShadowCss(config);
  return `flex:0 0 auto;font-style:normal;font-size:min(${Math.round(config.fontSize * 0.72)}px,${heightLimit});font-weight:900;line-height:1;white-space:nowrap;color:${config.badgeColor};${shadow}`;
}

function nameTextShadowCss(config) {
  const shadows = [];
  if (config.strokeEnabled && Number(config.strokeWidth) > 0) {
    const width = Math.min(8, Math.max(1, Math.round(Number(config.strokeWidth))));
    for (let radius = 1; radius <= width; radius += 1) {
      shadows.push(`${radius}px 0 0 ${config.strokeColor}`);
      shadows.push(`${-radius}px 0 0 ${config.strokeColor}`);
      shadows.push(`0 ${radius}px 0 ${config.strokeColor}`);
      shadows.push(`0 ${-radius}px 0 ${config.strokeColor}`);
      shadows.push(`${radius}px ${radius}px 0 ${config.strokeColor}`);
      shadows.push(`${-radius}px ${radius}px 0 ${config.strokeColor}`);
      shadows.push(`${radius}px ${-radius}px 0 ${config.strokeColor}`);
      shadows.push(`${-radius}px ${-radius}px 0 ${config.strokeColor}`);
    }
  }

  if (config.shadowEnabled) {
    shadows.push(`${config.shadowX}px ${config.shadowY}px ${config.shadowBlur}px ${config.shadowColor}`);
  }

  return shadows.length > 0 ? `text-shadow:${shadows.join(",")};` : "text-shadow:none;";
}

async function browseInstalledFonts() {
  els.browseFonts.disabled = true;
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
    els.browseFonts.disabled = false;
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
  els.nameFontBrowser.replaceChildren(
    selectOption("", "Choose a font..."),
    ...names.map((font) => selectOption(font, font))
  );
  els.timerFontBrowser.replaceChildren(
    selectOption("", "Choose a font..."),
    ...names.map((font) => selectOption(font, font))
  );
  els.nameFontBrowser.value = names.includes(state.layout.nameplate.fontFamily) ? state.layout.nameplate.fontFamily : "";
  els.timerFontBrowser.value = names.includes(state.layout.timerText.fontFamily) ? state.layout.timerText.fontFamily : "";
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

function saveProject() {
  const blob = new Blob([JSON.stringify(serializeProject(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "obs-race-manager-project.json";
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
    nameplate: {
      ...state.layout.nameplate,
      ...layout.nameplate
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
      }
    },
    borderImages: {
      feed: layout.borderImages?.feed ?? layout.borderImage ?? state.layout.borderImages?.feed ?? "",
      timer: layout.borderImages?.timer ?? layout.borderImage ?? state.layout.borderImages?.timer ?? ""
    },
    panelGeometry: {
      feed: { ...DEFAULT_PANEL_GEOMETRY.feed, ...layout.panelGeometry?.feed },
      name: { ...DEFAULT_PANEL_GEOMETRY.name, ...layout.panelGeometry?.name }
    },
    timerBorder: {
      ...DEFAULT_TIMER_BORDER,
      ...layout.timerBorder
    }
  };

  normalizeGeometryRect(next.panelGeometry.feed);
  normalizeGeometryRect(next.panelGeometry.name);
  normalizeGeometryRect(next.timerBorder);
  normalizeNameplateStyle(next.nameplate);
  normalizeTimerText(next.timerText);
  normalizeSpotlight(next.spotlight);
  normalizeBorderStyle(next.borderStyles.feed);
  normalizeBorderStyle(next.borderStyles.timer);
  next.borderTarget = next.borderTarget === "timer" ? "timer" : "feed";
  next.borderModeSource = ["generated", "image", "template"].includes(next.borderModeSource) ? next.borderModeSource : "generated";
  next.borderStyle = structuredClone(next.borderStyles.feed);
  next.borderImage = next.borderImages.feed;
  next.setupPreviewSlot = clampNumber(next.setupPreviewSlot, 0, MAX_RUNNERS, 0);
  next.timerBorder.enabled = Boolean(next.timerBorder.enabled);
  next.elements.timerBorder = Boolean(next.elements.timerBorder);
  next.elements.feed = Boolean(next.elements.feed);
  next.elements.feedBorder = Boolean(next.elements.feedBorder);
  next.elements.name = Boolean(next.elements.name);
  next.elements.builtInTimer = Boolean(next.elements.builtInTimer);
  return next;
}

function normalizeSpotlight(config) {
  config.enabled = Boolean(config.enabled);
  config.slots = String(config.slots || "");
  config.showOthers = Boolean(config.showOthers);
  config.side = ["right", "left", "bottom"].includes(config.side) ? config.side : "bottom";
  config.stackOrder = ["horizontal", "vertical"].includes(config.stackOrder) ? config.stackOrder : "horizontal";
  config.mainScale = clampNumber(config.mainScale, 55, 92, 78);
  config.otherScale = clampNumber(config.otherScale, 8, 40, 22);
  config.gap = clampNumber(config.gap, 0, 64, 20);
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
      source: String(runner.source ?? `runner_${slot}_feed`),
      placement: Number(runner.placement ?? slot),
      done: Boolean(runner.done),
      finalTimeMs: runner.finalTimeMs === null || runner.finalTimeMs === undefined ? null : Number(runner.finalTimeMs),
      collapsed: Boolean(runner.collapsed),
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
  config.fontSize = clampNumber(config.fontSize, 16, 120, DEFAULT_TIMER_TEXT.fontSize);
  config.format = ["hhmmss", "mmss", "mmssms"].includes(config.format) ? config.format : DEFAULT_TIMER_TEXT.format;
  config.idleColor = normalizeHexColor(config.idleColor, DEFAULT_TIMER_TEXT.idleColor);
  config.stoppedColor = normalizeHexColor(config.stoppedColor, DEFAULT_TIMER_TEXT.stoppedColor);
  config.runningColor = normalizeHexColor(config.runningColor, DEFAULT_TIMER_TEXT.runningColor);
  config.strokeEnabled = Boolean(config.strokeEnabled);
  config.strokeColor = normalizeHexColor(config.strokeColor, DEFAULT_TIMER_TEXT.strokeColor);
  config.strokeWidth = clampNumber(config.strokeWidth, 0, 10, DEFAULT_TIMER_TEXT.strokeWidth);
  config.shadowEnabled = Boolean(config.shadowEnabled);
  config.shadowColor = normalizeHexColor(config.shadowColor, DEFAULT_TIMER_TEXT.shadowColor);
  config.shadowBlur = clampNumber(config.shadowBlur, 0, 30, DEFAULT_TIMER_TEXT.shadowBlur);
  config.shadowX = clampNumber(config.shadowX, -20, 20, DEFAULT_TIMER_TEXT.shadowX);
  config.shadowY = clampNumber(config.shadowY, -20, 20, DEFAULT_TIMER_TEXT.shadowY);
  config.state = ["idle", "stopped", "running"].includes(config.state) ? config.state : "idle";
  config.elapsedMs = clampNumber(config.elapsedMs, 0, Number.MAX_SAFE_INTEGER, 0);
  config.startedAt = clampNumber(config.startedAt, 0, Number.MAX_SAFE_INTEGER, 0);
}

function normalizeNameplateStyle(config) {
  config.fontFamily = String(config.fontFamily || "Segoe UI");
  config.fontSize = clampNumber(config.fontSize, 12, 120, state.layout.nameplate.fontSize);
  config.textColor = normalizeHexColor(config.textColor, state.layout.nameplate.textColor);
  config.plateImage = String(config.plateImage || "");
  config.plateBackgroundColor = normalizeHexColor(config.plateBackgroundColor, state.layout.nameplate.plateBackgroundColor);
  config.plateBackgroundOpacity = clampNumber(config.plateBackgroundOpacity, 0, 100, state.layout.nameplate.plateBackgroundOpacity);
  config.plateBorderColor = normalizeHexColor(config.plateBorderColor, state.layout.nameplate.plateBorderColor);
  config.plateBorderOpacity = clampNumber(config.plateBorderOpacity, 0, 100, state.layout.nameplate.plateBorderOpacity);
  config.plateBorderWidth = clampNumber(config.plateBorderWidth, 0, 20, state.layout.nameplate.plateBorderWidth);
  config.plateRadius = clampNumber(config.plateRadius, 0, 80, state.layout.nameplate.plateRadius);
  config.platePaddingX = clampNumber(config.platePaddingX, 0, 160, state.layout.nameplate.platePaddingX);
  config.badgeColor = normalizeHexColor(config.badgeColor, state.layout.nameplate.badgeColor);
  config.textX = clampNumber(config.textX, -500, 500, state.layout.nameplate.textX);
  config.textY = clampNumber(config.textY, -200, 200, state.layout.nameplate.textY);
  config.plateMode = config.plateMode === "image" ? "image" : "generated";
  config.showBox = Boolean(config.showBox);
  config.showBorder = Boolean(config.showBorder);
  config.showPlacement = Boolean(config.showPlacement);
  config.strokeEnabled = Boolean(config.strokeEnabled);
  config.strokeColor = normalizeHexColor(config.strokeColor, state.layout.nameplate.strokeColor);
  config.strokeWidth = clampNumber(config.strokeWidth, 0, 8, state.layout.nameplate.strokeWidth);
  config.shadowEnabled = Boolean(config.shadowEnabled);
  config.shadowColor = normalizeHexColor(config.shadowColor, state.layout.nameplate.shadowColor);
  config.shadowBlur = clampNumber(config.shadowBlur, 0, 30, state.layout.nameplate.shadowBlur);
  config.shadowX = clampNumber(config.shadowX, -20, 20, state.layout.nameplate.shadowX);
  config.shadowY = clampNumber(config.shadowY, -20, 20, state.layout.nameplate.shadowY);
}

function normalizeBorderStyle(style) {
  style.mode = ["solid", "gradient", "texture"].includes(style.mode) ? style.mode : "solid";
  style.lineColor = normalizeHexColor(style.lineColor, BORDER_PRESETS.graphite.lineColor);
  style.glowColor = normalizeHexColor(style.glowColor, BORDER_PRESETS.graphite.glowColor);
  style.gradientFrom = normalizeHexColor(style.gradientFrom ?? style.highlightFrom, BORDER_PRESETS.graphite.gradientFrom);
  style.gradientTo = normalizeHexColor(style.gradientTo ?? style.highlightTo, BORDER_PRESETS.graphite.gradientTo);
  style.lineWidth = clampNumber(style.lineWidth, 0, 40, BORDER_PRESETS.graphite.lineWidth);
  style.radius = clampNumber(style.radius, 0, 60, BORDER_PRESETS.graphite.radius);
  style.gradientAngle = clampNumber(style.gradientAngle, 0, 360, BORDER_PRESETS.graphite.gradientAngle);
  style.animateGradientAngle = Boolean(style.animateGradientAngle);
  style.gradientAngleSpeed = clampNumber(style.gradientAngleSpeed, -360, 360, BORDER_PRESETS.graphite.gradientAngleSpeed);
  style.textureImage = String(style.textureImage || "");
  style.textureScale = clampNumber(style.textureScale, 25, 400, BORDER_PRESETS.graphite.textureScale);
  style.textureX = clampNumber(style.textureX, 0, 100, BORDER_PRESETS.graphite.textureX);
  style.textureY = clampNumber(style.textureY, 0, 100, BORDER_PRESETS.graphite.textureY);
}

function normalizeHexColor(value, fallback) {
  return /^#[a-f\d]{6}$/i.test(String(value)) ? String(value) : fallback;
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function syncGlobalControlsFromState() {
  els.aspectPreset.value = state.layout.aspectPreset;
  els.timerHeight.value = state.layout.timerHeight;
  els.timerHeightValue.textContent = `${state.layout.timerHeight} px`;
  els.marginSize.value = state.layout.margin;
  els.marginValue.textContent = `${state.layout.margin} px`;
  els.gapSize.value = state.layout.gap;
  els.gapValue.textContent = `${state.layout.gap} px`;
  els.animationMs.value = state.layout.animationMs;
  els.animationValue.textContent = `${state.layout.animationMs} ms`;
  els.animationFps.value = state.layout.animationFps;
  els.animationFpsValue.textContent = `${state.layout.animationFps} fps`;
  els.animationStyle.value = state.layout.animationStyle;
  els.animateObsLayout.checked = obsBridge.animateLayout;
  els.feedWidth.value = state.layout.feedWidth;
  els.feedHeight.value = state.layout.feedHeight;
  els.builtInTimerEnabled.checked = state.layout.elements.builtInTimer;
  els.timerFormat.value = state.layout.timerText.format;
  els.timerFont.value = state.layout.timerText.fontFamily;
  els.timerFontBrowser.value = Array.from(els.timerFontBrowser.options).some((option) => option.value === state.layout.timerText.fontFamily)
    ? state.layout.timerText.fontFamily
    : "";
  els.timerFontSize.value = state.layout.timerText.fontSize;
  els.timerFontSizeValue.textContent = `${state.layout.timerText.fontSize} px`;
  els.timerIdleColor.value = state.layout.timerText.idleColor;
  els.timerStoppedColor.value = state.layout.timerText.stoppedColor;
  els.timerRunningColor.value = state.layout.timerText.runningColor;
  els.timerStrokeEnabled.checked = state.layout.timerText.strokeEnabled;
  els.timerStrokeColor.value = state.layout.timerText.strokeColor;
  els.timerStrokeWidth.value = state.layout.timerText.strokeWidth;
  els.timerShadowEnabled.checked = state.layout.timerText.shadowEnabled;
  els.timerShadowColor.value = state.layout.timerText.shadowColor;
  els.timerShadowBlur.value = state.layout.timerText.shadowBlur;
  els.timerShadowX.value = state.layout.timerText.shadowX;
  els.timerShadowY.value = state.layout.timerText.shadowY;
  els.spotlightEnabled.checked = state.layout.spotlight.enabled;
  els.spotlightSlots.value = state.layout.spotlight.slots;
  els.spotlightShowOthers.checked = state.layout.spotlight.showOthers;
  els.spotlightSide.value = state.layout.spotlight.side;
  els.spotlightStackOrder.value = state.layout.spotlight.stackOrder;
  els.spotlightMainScale.value = state.layout.spotlight.mainScale;
  els.spotlightMainScaleValue.textContent = `${state.layout.spotlight.mainScale}%`;
  els.spotlightOtherScale.value = state.layout.spotlight.otherScale;
  els.spotlightOtherScaleValue.textContent = `${state.layout.spotlight.otherScale}%`;
  els.spotlightGap.value = state.layout.spotlight.gap;
  els.spotlightGapValue.textContent = `${state.layout.spotlight.gap} px`;
  populateSetupPreviewSlotOptions();
  if (state.layout.timerText.state === "running") startTimerPreviewTicker();
  else stopTimerPreviewTicker();
  syncNameplateControlsFromState();
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
  els.borderGradientAngleSlider.value = style.gradientAngle;
  els.borderAnimateGradientAngle.checked = Boolean(style.animateGradientAngle);
  els.borderGradientAngleSpeed.value = style.gradientAngleSpeed;
  els.borderGradientAngleSpeedValue.textContent = `${style.gradientAngleSpeed} deg/s`;
  els.borderLineWidth.value = style.lineWidth;
  els.borderRadius.value = style.radius;
  els.borderTextureScale.value = style.textureScale;
  els.borderTextureScaleValue.textContent = `${style.textureScale}%`;
  els.borderTextureX.value = style.textureX;
  els.borderTextureY.value = style.textureY;
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
    swatch.classList.toggle("active", swatch.dataset.border === state.layout.borderPreset && !getBorderImage(state.layout.borderTarget));
  }
}

function syncNameplateControlsFromState() {
  const config = state.layout.nameplate;
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
  els.namePlateBackgroundColor.value = config.plateBackgroundColor;
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
}

function syncNameplateModeSections() {
  for (const section of document.querySelectorAll("[data-nameplate-section]")) {
    section.hidden = section.dataset.nameplateSection !== state.layout.nameplate.plateMode;
  }
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value)));
}
