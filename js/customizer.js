/* ============================================================
   DRINK CUSTOMIZER — Kombi Coffee Cabin
   Step-by-step builder with a live side-view cup. Plain JS. Prices in LKR.
   Edit the MENU DATA block to change names, prices and rules.
   ============================================================ */
(function () {
  "use strict";

  var root = document.getElementById("brew-customizer");
  if (!root) return;

  /* ---------- MENU DATA (placeholder prices: change freely) ---------- */
  // sw = colour swatch, icon = emoji/text. add = extra price in LKR.
  var ALL_MILKS = ["none", "whole", "oat", "almond", "soy"];
  var BASES = [
    { id: "espresso", name: "Espresso",    add: 700, icon: "☕", color: "#2b170a", temps: ["hot", "iced", "blended"], shots: 1, strength: 1, milks: ALL_MILKS },
    { id: "coldbrew", name: "Cold Brew",   add: 900, icon: "🧊", color: "#2a1a0c", temps: ["iced"],                   strength: 1, milks: ALL_MILKS },
    { id: "drip",     name: "Drip Coffee", add: 600, icon: "💧", color: "#4a2c14", temps: ["hot", "iced"],            strength: 1, milks: ALL_MILKS },
    { id: "tea",      name: "Tea",         add: 500, icon: "🍃", color: "#b0651f", temps: ["hot", "iced"],            strength: 1, milks: ["none", "whole", "oat"] },
    { id: "matcha",   name: "Matcha",      add: 950, icon: "🍵", color: "#86a843", temps: ["hot", "iced", "blended"], strength: 1, milks: ALL_MILKS },
    { id: "choc",     name: "Chocolate",   add: 800, icon: "🍫", color: "#4a2a14", temps: ["hot", "iced", "blended"],               milks: ALL_MILKS }
  ];
  var SIZES = [
    { id: "s", name: "Small",  sub: "8 oz",  add: 0,   icon: "S", sc: 0.84 },
    { id: "m", name: "Medium", sub: "12 oz", add: 150, icon: "M", sc: 0.92 },
    { id: "l", name: "Large",  sub: "16 oz", add: 300, icon: "L", sc: 1 }
  ];
  var TEMPS = [
    { id: "hot",     name: "Hot",     add: 0,   icon: "🔥" },
    { id: "iced",    name: "Iced",    add: 0,   icon: "🧊" },
    { id: "blended", name: "Blended", add: 150, icon: "🌀" }
  ];
  var SHOTS = [
    { id: "single", name: "Single", add: 0,   icon: "1" },
    { id: "double", name: "Double", add: 200, icon: "2" },
    { id: "decaf",  name: "Decaf",  add: 0,   icon: "🌙" }
  ];
  var STRENGTH = [
    { id: "light",  name: "Light",  add: 0, icon: "◔" },
    { id: "medium", name: "Medium", add: 0, icon: "◑" },
    { id: "strong", name: "Strong", add: 0, icon: "●" }
  ];
  var SWEET = [
    { id: "none",    name: "None",    add: 0, icon: "○" },
    { id: "low",     name: "Low",     add: 0, icon: "◔" },
    { id: "regular", name: "Regular", add: 0, icon: "◑" },
    { id: "extra",   name: "Extra",   add: 0, icon: "●" }
  ];
  var SWEETENERS = [
    { id: "white",  name: "White sugar",    add: 0,  sw: "#ffffff" },
    { id: "brown",  name: "Brown sugar",    add: 0,  sw: "#b07a45" },
    { id: "honey",  name: "Honey",          add: 50, sw: "#e0a02c" },
    { id: "kithul", name: "Kithul treacle", add: 80, sw: "#5b3216" },
    { id: "free",   name: "Sugar-free",     add: 0,  sw: "#9fd0ad" }
  ];
  var SYRUPS = [
    { id: "none",     name: "No syrup", add: 0,   icon: "🚫" },
    { id: "vanilla",  name: "Vanilla",  add: 100, sw: "#f0dca0" },
    { id: "caramel",  name: "Caramel",  add: 100, sw: "#c9842f" },
    { id: "hazelnut", name: "Hazelnut", add: 100, sw: "#9a6a3c" },
    { id: "coconut",  name: "Coconut",  add: 100, sw: "#efe6d6" }
  ];
  var MILKS = [
    { id: "none",   name: "No milk",    add: 0,   icon: "🚫" },
    { id: "whole",  name: "Dairy",      add: 0,   sw: "#f3e6cf" },
    { id: "oat",    name: "Oat",        add: 150, sw: "#ecdcb9" },
    { id: "almond", name: "Almond",     add: 150, sw: "#e8d4b0" },
    { id: "soy",    name: "Soy",        add: 100, sw: "#f8efdf" }
  ];
  var MILKAMT = [
    { id: "light",   name: "Light",   add: 0,  icon: "▂" },
    { id: "regular", name: "Regular", add: 0,  icon: "▄" },
    { id: "extra",   name: "Extra",   add: 80, icon: "▆" }
  ];
  var FOAM = [
    { id: "none",  name: "No foam",    add: 0, icon: "🚫" },
    { id: "light", name: "Light foam", add: 0, icon: "☁️" },
    { id: "extra", name: "Extra foam", add: 0, icon: "🍦" }
  ];
  var ICE = [
    { id: "none",    name: "No ice",      add: 0, icon: "🚫" },
    { id: "less",    name: "Less ice",    add: 0, icon: "🧊" },
    { id: "regular", name: "Regular ice", add: 0, icon: "🧊🧊" },
    { id: "extra",   name: "Extra ice",   add: 0, icon: "🧊🧊🧊" }
  ];
  var TOPPINGS = [
    { id: "cream",    name: "Whipped cream",   add: 200, icon: "🍦" },
    { id: "choc",     name: "Chocolate drizzle", add: 150, sw: "#3a1f0e" },
    { id: "cinnamon", name: "Cinnamon",        add: 80,  sw: "#a0522d" },
    { id: "cocoa",    name: "Cocoa dust",      add: 80,  sw: "#5b3a1e" },
    { id: "biscuit",  name: "Crushed biscuit", add: 120, sw: "#c99a5b" }
  ];
  var SERVE = [
    { id: "dine", name: "Dine-in",  add: 0, icon: "🍽️" },
    { id: "take", name: "Takeaway", add: 0, icon: "🥡" }
  ];

  var STEPS = [
    { n: "Base",         h: "What are we brewing?" },
    { n: "Size and temp", h: "Size and temperature" },
    { n: "Taste",        h: "Dial in the flavour" },
    { n: "Milk and finish", h: "Milk and finish" },
    { n: "Toppings",     h: "Top it off and make it yours" },
    { n: "Review",       h: "Check your cup" }
  ];

  /* ---------- STATE + RULES ---------- */
  function freshState() {
    return { base: "espresso", size: "m", temp: "hot", shots: "single", strength: "medium",
             sweetness: "regular", sweetener: "white", syrup: "none",
             milk: "whole", milkAmt: "regular", foam: "regular", ice: "regular",
             toppings: {}, serve: "dine", name: "", notes: "" };
  }
  // 'foam' default needs a valid id:
  var state = freshState(); state.foam = "light";
  var step = 0;

  function find(a, id) { for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return a[0]; }
  function base() { return find(BASES, state.base); }
  function $(id) { return document.getElementById(id); }
  function money(n) { return "LKR " + n.toLocaleString("en-LK"); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // Compatibility rules: keep choices valid whenever something changes
  function fix() {
    var b = base();
    if (b.temps.indexOf(state.temp) < 0) state.temp = b.temps[0];
    if (b.milks.indexOf(state.milk) < 0) state.milk = "none";
  }

  // Option groups: step index, rules for visibility (vis) and disabled options (dis)
  var G = [
    { k: "base",      s: 0, t: "Pick your base", o: BASES },
    { k: "size",      s: 1, t: "Size", o: SIZES },
    { k: "temp",      s: 1, t: "Temperature", o: TEMPS, dis: function (o) { return base().temps.indexOf(o.id) < 0; } },
    { k: "shots",     s: 1, t: "Espresso shots", o: SHOTS, vis: function () { return !!base().shots; } },
    { k: "strength",  s: 2, t: "Strength", o: STRENGTH, vis: function () { return !!base().strength; } },
    { k: "sweetness", s: 2, t: "Sweetness", o: SWEET },
    { k: "sweetener", s: 2, t: "Sweetener", o: SWEETENERS, vis: function () { return state.sweetness !== "none"; } },
    { k: "syrup",     s: 2, t: "Flavour syrup", o: SYRUPS },
    { k: "milk",      s: 3, t: "Milk", o: MILKS, dis: function (o) { return base().milks.indexOf(o.id) < 0; } },
    { k: "milkAmt",   s: 3, t: "Milk amount", o: MILKAMT, vis: function () { return state.milk !== "none"; } },
    { k: "foam",      s: 3, t: "Foam", o: FOAM, vis: function () { return state.temp === "hot" && state.milk !== "none"; } },
    { k: "ice",       s: 3, t: "Ice level", o: ICE, vis: function () { return state.temp === "iced"; } },
    { k: "toppings",  s: 4, t: "Toppings (pick any)", o: TOPPINGS, multi: 1 },
    { k: "serve",     s: 4, t: "Dine-in or takeaway", o: SERVE }
  ];

  /* ---------- BUILD UI ---------- */
  var stepsEl = $("bcSteps"), panelsEl = $("bcPanels"), P = [], S = [];

  STEPS.forEach(function (st, i) {
    var li = document.createElement("li");
    li.innerHTML = '<button type="button"><b>' + (i + 1) + "</b><span>" + st.n + "</span></button>";
    li.firstChild.addEventListener("click", function () { go(i); });
    stepsEl.appendChild(li); S.push(li);

    var p = document.createElement("div");
    p.className = "bc-panel";
    p.innerHTML = '<div class="bc-kicker">Step ' + (i + 1) + " of " + STEPS.length + '</div><h3 class="bc-title">' + st.h + "</h3>";
    panelsEl.appendChild(p); P.push(p);
  });

  G.forEach(function (g) {
    var d = document.createElement("div");
    d.className = "bc-group";
    d.innerHTML = "<h4>" + g.t + '</h4><div class="bc-opts"></div>';
    g.el = d; g.btns = [];
    g.o.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "bc-opt";
      b.innerHTML = (o.sw ? '<i class="bc-sw" style="background:' + o.sw + '"></i>' : '<span class="bc-ico">' + o.icon + "</span>") +
        "<span>" + o.name + "</span>" +
        (o.sub ? '<span class="bc-p">' + o.sub + "</span>" : "") +
        (o.add ? '<span class="bc-p">+' + money(o.add) + "</span>" : "");
      b.addEventListener("click", function () {
        if (g.multi) { if (state[g.k][o.id]) delete state[g.k][o.id]; else state[g.k][o.id] = true; }
        else state[g.k] = o.id;
        render();
      });
      d.lastChild.appendChild(b);
      g.btns.push({ b: b, o: o });
    });
    P[g.s].appendChild(d);
  });

  // name + notes (step 5)
  var mine = document.createElement("div");
  mine.className = "bc-group";
  mine.innerHTML = '<h4>Make it yours</h4>' +
    '<label class="bc-lbl">Name on the cup<input class="bc-in" id="bcName" maxlength="12" placeholder="e.g. Sam" autocomplete="off"></label>' +
    '<label class="bc-lbl">Special instructions<textarea class="bc-in" id="bcNotes" rows="3" maxlength="160" placeholder="Anything else we should know?"></textarea></label>';
  P[4].appendChild(mine);
  $("bcName").addEventListener("input", function (e) { state.name = e.target.value.trim(); render(); });
  $("bcNotes").addEventListener("input", function (e) { state.notes = e.target.value.trim(); summary(); });

  // review (step 6)
  var rev = document.createElement("div");
  rev.className = "bc-summary";
  rev.innerHTML = '<div id="bcLines"></div><div class="bc-total"><span>Total</span><span id="bcTotal2">LKR 0</span></div>' +
    '<button class="btn btn-solid bc-add-btn" id="bcAddBtn" type="button">Add to Order</button>' +
    '<div class="bc-toast" id="bcToast">Added to your order ☕</div>' +
    '<button class="bc-reset" id="bcReset" type="button">Start a new cup</button>';
  P[5].appendChild(rev);

  $("bcBack").addEventListener("click", function () { go(step - 1); });
  $("bcNext").addEventListener("click", function () { go(step + 1); });
  $("bcAddBtn").addEventListener("click", function () {
    var c = calc();
    var order = { drink: $("bcCupName").textContent, total: c.total, choices: JSON.parse(JSON.stringify(state)), lines: c.lines };
    // Hook for your cart: document.addEventListener("kombi:add-to-order", function (e) { ... e.detail ... })
    document.dispatchEvent(new CustomEvent("kombi:add-to-order", { detail: order }));
    var t = $("bcToast"); t.style.opacity = "1";
    setTimeout(function () { t.style.opacity = "0"; }, 1800);
  });
  $("bcReset").addEventListener("click", function () {
    state = freshState(); state.foam = "light";
    $("bcName").value = ""; $("bcNotes").value = "";
    go(0);
  });

  function go(i) {
    step = Math.max(0, Math.min(STEPS.length - 1, i));
    render();
    var top = root.querySelector(".bc-steps").getBoundingClientRect().top;
    if (top < 0) window.scrollBy({ top: top - 130, behavior: "smooth" });
  }

  /* ---------- PRICE + SUMMARY ---------- */
  function calc() {
    var b = base(), L = [], t = 0;
    function add(l, v, p) { L.push({ l: l, v: v, p: p || 0 }); t += p || 0; }
    add("Base", b.name, b.add);
    var sz = find(SIZES, state.size); add("Size", sz.name + " (" + sz.sub + ")", sz.add);
    var tp = find(TEMPS, state.temp); add("Temperature", tp.name, tp.add);
    if (b.shots) { var sh = find(SHOTS, state.shots); add("Shots", sh.name, sh.add); }
    if (b.strength) add("Strength", find(STRENGTH, state.strength).name, 0);
    add("Sweetness", find(SWEET, state.sweetness).name, 0);
    if (state.sweetness !== "none") { var sn = find(SWEETENERS, state.sweetener); add("Sweetener", sn.name, sn.add); }
    if (state.syrup !== "none") { var sy = find(SYRUPS, state.syrup); add("Syrup", sy.name, sy.add); }
    if (state.milk !== "none") {
      var m = find(MILKS, state.milk), ma = find(MILKAMT, state.milkAmt);
      add("Milk", m.name + ", " + ma.name.toLowerCase(), m.add + ma.add);
      if (state.temp === "hot") add("Foam", find(FOAM, state.foam).name, 0);
    }
    if (state.temp === "iced") add("Ice", find(ICE, state.ice).name, 0);
    TOPPINGS.forEach(function (o) { if (state.toppings[o.id]) add("Topping", o.name, o.add); });
    add("Serving", find(SERVE, state.serve).name, 0);
    if (state.name) add("Cup name", state.name, 0);
    if (state.notes) add("Notes", state.notes, 0);
    return { lines: L, total: t };
  }

  function summary() {
    var c = calc(), h = "";
    c.lines.forEach(function (l) {
      h += '<div class="bc-line"><span><em>' + l.l + "</em>" + esc(l.v) + "</span><span>" + (l.p ? money(l.p) : "–") + "</span></div>";
    });
    $("bcLines").innerHTML = h;
    $("bcTotal").textContent = $("bcTotal2").textContent = money(c.total);
  }

  /* ---------- LIVE CUP (SVG, side view) ---------- */
  var SH = {
    mug:   { d: "M80 120H220V250Q220 306 150 306Q80 306 80 250Z", top: 120, bot: 306, shine: "M95 140V262" },
    glass: { d: "M82 70H218L202 300Q200 312 188 312H112Q100 312 98 300Z", top: 70, bot: 312, shine: "M100 92L108 288" }
  };
  var HANDLE = '<path class="bc-hd" d="M220 150H246Q276 150 276 192Q276 234 244 234H218"/><path class="bc-hd2" d="M220 150H246Q276 150 276 192Q276 234 244 234H218"/>';
  var STEAM = '<path class="bc-st" d="M120 108q-12 -14 0 -28t0 -26"/><path class="bc-st" d="M150 104q-12 -14 0 -28t0 -26"/><path class="bc-st" d="M180 108q-12 -14 0 -28t0 -26"/>';
  var CREAM = '<ellipse cy="-4" rx="62" ry="14" fill="#fdf6ea"/><ellipse cy="-18" rx="46" ry="12" fill="#fffaf1"/><ellipse cy="-30" rx="32" ry="10" fill="#fdf6ea"/><ellipse cy="-41" rx="18" ry="8" fill="#fffaf1"/><path d="M0 -62q10 8 6 18q-8 4 -14 -2q-2 -10 8 -16z" fill="#fffdf8"/>';
  var ICEP = [[112, .08, -12], [150, .04, 8], [186, .1, -6], [128, .36, 14], [170, .32, -16], [108, .6, 6], [190, .56, 12], [148, .6, -8]];
  var DOTS = [[-48, 1], [-38, .2], [-30, .8], [-22, .1], [-14, .9], [-6, .3], [2, .7], [10, .05], [18, .85], [26, .25], [34, .75], [42, .15], [50, .6], [-42, .6], [30, .45], [-8, .55]];
  var BISC = [[-38, .5, 20], [-22, .1, -30], [-6, .8, 40], [10, .2, -10], [24, .7, 25], [38, .3, -35], [0, .45, 5]];

  $("bcSvg").innerHTML =
    '<defs><clipPath id="bcClip"><path id="bcClipPath"/></clipPath></defs>' +
    '<g id="bcScale"><ellipse id="bcPlate" class="bc-plate" cx="160" rx="116" ry="12"/>' +
    '<g id="bcSteam"></g><g id="bcHandle"></g><path id="bcBody" class="bc-glass"/><g id="bcStraw"></g>' +
    '<g id="bcLiquid" clip-path="url(#bcClip)"></g><path id="bcShine" class="bc-shine"/><path id="bcOutline" class="bc-outline"/>' +
    '<g id="bcLabel"></g><g id="bcTop"></g></g>';

  function mix(a, b, r) {
    function p(h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); }
    var x = p(a), y = p(b);
    return "#" + x.map(function (v, i) { return ("0" + Math.round(v + (y[i] - v) * r).toString(16)).slice(-2); }).join("");
  }

  function draw() {
    var b = base(), hot = state.temp === "hot", bl = state.temp === "blended", Sh = hot ? SH.mug : SH.glass;
    ["bcClipPath", "bcBody", "bcOutline"].forEach(function (id) { $(id).setAttribute("d", Sh.d); });
    $("bcShine").setAttribute("d", Sh.shine);
    $("bcPlate").setAttribute("cy", Sh.bot + 8);
    $("bcScale").style.transform = "scale(" + find(SIZES, state.size).sc + ")";
    $("bcHandle").innerHTML = hot ? HANDLE : "";
    $("bcStraw").innerHTML = hot ? "" : '<line class="bc-straw" x1="180" y1="22" x2="148" y2="' + (Sh.bot - 16) + '"/>';
    $("bcSteam").innerHTML = hot && !state.toppings.cream ? STEAM : "";

    var H = Sh.bot - Sh.top, liqTop = Sh.bot - H * (hot ? 0.84 : 0.9), LH = Sh.bot - liqTop;

    // colours
    var col = b.color;
    if (b.strength) {
      if (state.strength === "light") col = mix(col, "#e8d2ac", 0.4);
      if (state.strength === "strong") col = mix(col, "#000000", 0.22);
    }
    if (b.shots && state.shots === "double") col = mix(col, "#000000", 0.1);
    var milkOn = state.milk !== "none", mc = milkOn ? find(MILKS, state.milk).sw : null;
    var mf = { light: 0.18, regular: 0.32, extra: 0.46 }[state.milkAmt];
    var syr = find(SYRUPS, state.syrup), syrF = state.syrup !== "none" ? 0.08 : 0;

    // layers, bottom to top
    var layers = [];
    if (syrF) layers.push({ f: syrF, c: syr.sw });
    if (bl) {
      var mixc = milkOn ? mix(col, mc, 0.35 + mf) : col;
      layers.push({ f: 1 - syrF, c: mix(mixc, "#fff4e0", 0.25) });
    } else {
      var foamF = milkOn && hot ? { none: 0, light: 0.07, extra: 0.16 }[state.foam] : 0;
      var crema = !milkOn && hot && state.base === "espresso" ? 0.05 : 0;
      var mF = milkOn ? mf : 0;
      layers.push({ f: 1 - syrF - mF - foamF - crema, c: col });
      if (milkOn) layers.push({ f: mF, c: hot ? mix(col, mc, 0.7) : mc });
      if (foamF) layers.push({ f: foamF, c: "#fbf3e2" });
      if (crema) layers.push({ f: crema, c: "#c98f4e" });
    }
    var out = "", y = Sh.bot;
    layers.forEach(function (l) {
      var h = l.f * LH; y -= h;
      out += '<rect x="50" y="' + y.toFixed(1) + '" width="220" height="' + (h + 0.6).toFixed(1) + '" fill="' + l.c + '"/>';
    });

    // ice
    if (state.temp === "iced") {
      var n = { none: 0, less: 3, regular: 5, extra: 8 }[state.ice];
      for (var i = 0; i < n; i++) {
        var p = ICEP[i], cx = p[0], cy = liqTop + p[1] * LH + 17;
        out += '<rect class="bc-ice" x="' + (cx - 17) + '" y="' + (cy - 17) + '" width="34" height="34" rx="8" transform="rotate(' + p[2] + " " + cx + " " + cy + ')"/>';
      }
    }

    // syrup + chocolate drips down the inside of the cup
    function drips(xs, c) {
      xs.forEach(function (x, i) { out += '<rect x="' + x + '" y="' + (Sh.top - 2) + '" width="7" height="' + (30 + ((i * 23) % 34)) + '" rx="3.5" fill="' + c + '" opacity=".92"/>'; });
    }
    if (state.syrup !== "none") drips([94, 128, 172, 204], syr.sw);
    if (state.toppings.choc) drips([110, 150, 190], "#3a1f0e");
    $("bcLiquid").innerHTML = out;

    // toppings on the surface
    var T = state.toppings, cr = !!T.cream, tp = "";
    var k = cr ? 0.65 : 1, y0 = cr ? -44 : -3, sp = cr ? 8 : 5;
    if (cr) tp += CREAM;
    if (T.choc) tp += '<g transform="translate(0,' + (cr ? -22 : -3) + ')"><path class="bc-dz" stroke="#3a1f0e" d="M-54 0q13 -10 27 0t27 0t27 0t27 0"/><path class="bc-dz" stroke="#4a2812" d="M-44 10q11 -8 22 0t22 0t22 0t22 0"/></g>';
    function dots(c) { DOTS.forEach(function (d) { tp += '<circle cx="' + (d[0] * k).toFixed(1) + '" cy="' + (y0 + d[1] * sp).toFixed(1) + '" r="2.3" fill="' + c + '"/>'; }); }
    if (T.cinnamon) dots("#a0522d");
    if (T.cocoa) dots("#5b3a1e");
    if (T.biscuit) BISC.forEach(function (q) { var bx = q[0] * k, by = y0 + q[1] * sp - 3; tp += '<rect x="' + bx.toFixed(1) + '" y="' + by.toFixed(1) + '" width="11" height="7" rx="2" fill="#c99a5b" stroke="#a87b3f" stroke-width="1" transform="rotate(' + q[2] + " " + bx.toFixed(1) + " " + by.toFixed(1) + ')"/>'; });
    $("bcTop").innerHTML = '<g transform="translate(150,' + liqTop.toFixed(1) + ')">' + tp + "</g>";

    // name tag on the cup
    $("bcLabel").innerHTML = state.name
      ? '<rect class="bc-tag" x="100" y="' + (Sh.bot - 72) + '" width="100" height="28" rx="14"/><text class="bc-tt" x="150" y="' + (Sh.bot - 53) + '" text-anchor="middle">' + esc(state.name) + "</text>"
      : "";

    // title + chips
    var sz = find(SIZES, state.size), tn = find(TEMPS, state.temp);
    $("bcCupName").textContent = sz.name + " " + (hot ? "" : tn.name + " ") + b.name;
    var chips = [];
    if (b.shots) chips.push(find(SHOTS, state.shots).name + " shot");
    if (b.strength) chips.push(find(STRENGTH, state.strength).name.toLowerCase() + " strength");
    chips.push(state.sweetness === "none" ? "unsweetened" : find(SWEET, state.sweetness).name.toLowerCase() + " " + find(SWEETENERS, state.sweetener).name.toLowerCase());
    if (state.syrup !== "none") chips.push(syr.name.toLowerCase());
    if (milkOn) chips.push(find(MILKS, state.milk).name.toLowerCase() + " milk");
    if (state.temp === "iced") chips.push(find(ICE, state.ice).name.toLowerCase());
    TOPPINGS.forEach(function (o) { if (T[o.id]) chips.push(o.name.toLowerCase()); });
    $("bcChips").innerHTML = chips.map(function (c) { return "<span>" + c + "</span>"; }).join("");
  }

  /* ---------- RENDER ---------- */
  function render() {
    fix();
    var b = base();
    G.forEach(function (g) {
      g.el.hidden = g.vis ? !g.vis() : false;
      g.btns.forEach(function (x) {
        var on = g.multi ? !!state[g.k][x.o.id] : state[g.k] === x.o.id;
        var off = g.dis ? g.dis(x.o) : false;
        x.b.setAttribute("aria-pressed", on);
        x.b.disabled = off;
        x.b.title = off ? "Not available with " + b.name.toLowerCase() : "";
      });
    });
    P.forEach(function (p, i) { p.classList.toggle("bc-on", i === step); });
    S.forEach(function (li, i) {
      li.classList.toggle("bc-now", i === step);
      li.classList.toggle("bc-done", i < step);
      li.firstChild.setAttribute("aria-current", i === step ? "step" : "false");
    });
    $("bcBack").disabled = step === 0;
    $("bcNext").hidden = step === STEPS.length - 1;
    $("bcNext").textContent = step === STEPS.length - 2 ? "Review" : "Next";
    draw();
    summary();
  }

  render();
})();
