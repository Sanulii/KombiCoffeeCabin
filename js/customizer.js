/* ============================================================
   DRINK CUSTOMIZER — Kombi Coffee Cabin
   Plain JavaScript, no libraries. Prices in LKR.
   ============================================================ */
(function () {
  "use strict";

  var root = document.getElementById("brew-customizer");
  if (!root) return;

  /* ---------- MENU DATA (edit prices/names freely) ---------- */
  var DRINKS = {
    latte:        { name: "Cabin Latte",     price: 1200, desc: "espresso + lots of steamed milk" },
    cappuccino:   { name: "Cappuccino",      price: 1150, desc: "espresso + milk + thick foam" },
    cortado:      { name: "Kombi Cortado",   price: 1100, desc: "double shot, steamed milk, no foam games" },
    mocha:        { name: "Road Trip Mocha", price: 1100, desc: "dark chocolate + espresso" },
    coldbrew:     { name: "Sam's Cold Brew", price: 1100, desc: "steeped 18 hours, over ice" },
    hotchocolate: { name: "Kids Cocoa",      price: 540,  desc: "steamed milk + cocoa" },
    espresso:     { name: "Espresso",        price: 800,  desc: "short, strong, no milk" }
  };
  var SIZES = {
    s: { name: "Small",  add: 0   },
    m: { name: "Medium", add: 150 },
    l: { name: "Large",  add: 300 }
  };
  var MILKS = {
    whole:  { name: "Whole milk",  add: 0,   color: "#f3e6cf" },
    oat:    { name: "Oat milk",    add: 150, color: "#ecdcb9" },
    almond: { name: "Almond milk", add: 150, color: "#f0e2c8" },
    skim:   { name: "Soy milk",   add: 0,   color: "#f8efdf" }
  };
  var ADDONS = {
    cream:     { name: "Whipped cream",   price: 200 },
    choc:      { name: "Chocolate sauce", price: 180 },
    caramel:   { name: "Caramel drizzle", price: 180 },
    sprinkles: { name: "Sprinkles",       price: 120 },
    mallows:   { name: "Marshmallows",    price: 150 },
    cinnamon:  { name: "Cinnamon dust",   price: 100 },
    shot:      { name: "Extra shot",      price: 250 }
  };

  var state = { drink: "latte", size: "m", milk: "whole", addons: {} };

  function $(id) { return document.getElementById(id); }
  function money(n) { return "LKR " + n.toLocaleString("en-LK"); }

  var cup = $("bcCup"), fill = $("bcFill"), drips = $("bcDrips"),
      cream = $("bcCream"), chocSvg = $("bcChoc"), caramelSvg = $("bcCaramel"),
      field = $("bcField"), steam = $("bcSteam");

  /* ---------- CONTROL PILLS ---------- */
  function buildPills(containerId, data, onPick, activeKey) {
    var box = $(containerId);
    box.innerHTML = "";
    Object.keys(data).forEach(function (key) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "bc-pill" + (key === activeKey ? " bc-active" : "");
      var label = data[key].name;
      var p = data[key].price != null ? data[key].price : data[key].add;
      if (p > 0) label += ' <span class="bc-price">+' + money(p) + "</span>";
      b.innerHTML = label;
      b.dataset.key = key;
      b.addEventListener("click", function () { onPick(key); });
      box.appendChild(b);
    });
  }
  function refreshActive(containerId, activeKeys) {
    Array.prototype.forEach.call($(containerId).children, function (b) {
      b.classList.toggle("bc-active", activeKeys.indexOf(b.dataset.key) !== -1);
    });
  }

  buildPills("bcDrinks", DRINKS, function (k) { state.drink = k; render(); }, state.drink);
  buildPills("bcSizes", SIZES, function (k) { state.size = k; render(); }, state.size);
  buildPills("bcMilks", MILKS, function (k) { state.milk = k; render(); }, state.milk);
  buildPills("bcAddons", ADDONS, function (k) {
    if (state.addons[k]) delete state.addons[k]; else state.addons[k] = true;
    render();
  }, null);

  /* ---------- SPRINKLES / MARSHMALLOWS / DUST ---------- */
  var SPRINKLE_COLORS = ["#e5526d", "#f2b33d", "#5da8e0", "#7bc96f", "#b07be0", "#ff8c5a"];
  function buildField() {
    field.innerHTML = "";
    var i;
    if (state.addons.sprinkles) {
      for (i = 0; i < 16; i++) {
        var s = document.createElement("div");
        s.className = "bc-sprinkle";
        s.style.left = (6 + Math.random() * 108) + "px";
        s.style.top = (4 + Math.random() * 56) + "px";
        s.style.background = SPRINKLE_COLORS[i % SPRINKLE_COLORS.length];
        s.style.transform = "rotate(" + Math.round(Math.random() * 180) + "deg)";
        field.appendChild(s);
      }
    }
    if (state.addons.mallows) {
      [[14, 34], [52, 18], [88, 38], [36, 48], [76, 8]].forEach(function (pos, n) {
        var m = document.createElement("div");
        m.className = "bc-mallow";
        m.style.left = pos[0] + "px";
        m.style.top = pos[1] + "px";
        m.style.transform = "rotate(" + ((n * 37) % 40 - 20) + "deg)";
        field.appendChild(m);
      });
    }
    if (state.addons.cinnamon) {
      for (i = 0; i < 22; i++) {
        var d = document.createElement("div");
        d.className = "bc-dust";
        d.style.left = (Math.random() * 118) + "px";
        d.style.top = (Math.random() * 60) + "px";
        d.style.opacity = (0.4 + Math.random() * 0.5).toFixed(2);
        field.appendChild(d);
      }
    }
  }

  /* ---------- LIQUID LAYERS ---------- */
  function blend(hexA, hexB, ratioB) {
    ratioB = ratioB == null ? 0.5 : ratioB;
    function p(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
    var a = p(hexA), b = p(hexB);
    var c = a.map(function (v, i) { return Math.round(v * (1 - ratioB) + b[i] * ratioB); });
    return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
  }

  function drinkLayers() {
    var espresso = state.addons.shot ? "#241105" : "#33200f";
    var milk = MILKS[state.milk].color;
    var foam = "#fbf3e2";
    var chocMix = "#4a2a14";
    switch (state.drink) {
      case "espresso":
        return [{ h: 55, c: espresso }, { h: 8, c: "#c98f4e" }];
      case "cappuccino":
        return [{ h: 34, c: espresso }, { h: 33, c: blend(espresso, milk) }, { h: 30, c: foam }];
      case "cortado":
        return [{ h: 40, c: espresso }, { h: 45, c: blend(espresso, milk, 0.55) }];
      case "mocha":
        return [{ h: 22, c: "#2c1507" }, { h: 40, c: chocMix }, { h: 24, c: blend(chocMix, milk) }, { h: 10, c: foam }];
      case "coldbrew":
        return [{ h: 70, c: "#2a1a0c" }, { h: 18, c: blend("#2a1a0c", milk, 0.3) }];
      case "hotchocolate":
        return [{ h: 78, c: "#5a3115" }, { h: 12, c: "#7a4a24" }];
      default:
        return [{ h: 30, c: espresso }, { h: 45, c: blend(espresso, milk, 0.35) }, { h: 12, c: foam }];
    }
  }

  function renderLayers() {
    fill.innerHTML = "";
    var bottom = 0;
    drinkLayers().forEach(function (l) {
      var div = document.createElement("div");
      div.className = "bc-layer";
      div.style.bottom = bottom + "%";
      div.style.height = l.h + "%";
      div.style.background = l.c;
      fill.appendChild(div);
      bottom += l.h;
    });
  }

  /* ---------- SAUCE DRIPS DOWN THE CUP ---------- */
  function renderDrips() {
    drips.innerHTML = "";
    var defs = [];
    if (state.addons.choc)    defs.push({ color: "#3a1f0e", xs: [12, 52, 118, 150] });
    if (state.addons.caramel) defs.push({ color: "#d1913c", xs: [30, 82, 136] });
    defs.forEach(function (d) {
      d.xs.forEach(function (x, i) {
        var el = document.createElement("div");
        el.className = "bc-drip";
        el.style.left = x + "px";
        el.style.background = d.color;
        el.style.height = (26 + ((i * 31) % 42)) + "px";
        drips.appendChild(el);
      });
    });
  }

  /* ---------- RENDER ---------- */
  function render() {
    cup.className = "bc-cup bc-size-" + state.size;
    renderLayers();
    renderDrips();

    var hasCream = !!state.addons.cream;
    var isCold = state.drink === "coldbrew";
    cream.classList.toggle("bc-hidden", !hasCream);
    steam.style.display = (hasCream || isCold) ? "none" : "";

    chocSvg.classList.toggle("bc-hidden", !state.addons.choc);
    caramelSvg.classList.toggle("bc-hidden", !state.addons.caramel);
    chocSvg.classList.toggle("bc-onfoam", !hasCream);
    caramelSvg.classList.toggle("bc-onfoam", !hasCream);

    field.classList.toggle("bc-onfoam", !hasCream);
    buildField();

    refreshActive("bcDrinks", [state.drink]);
    refreshActive("bcSizes", [state.size]);
    refreshActive("bcMilks", [state.milk]);
    refreshActive("bcAddons", Object.keys(state.addons));

    $("bcCupName").textContent = SIZES[state.size].name + " " + DRINKS[state.drink].name;
    var bits = [MILKS[state.milk].name];
    Object.keys(state.addons).forEach(function (k) { bits.push(ADDONS[k].name.toLowerCase()); });
    $("bcCupDesc").textContent = state.drink === "espresso" ? "no milk — bold and short" : bits.join(" · ");

    var lines = [], total = 0;
    total += DRINKS[state.drink].price;
    lines.push({ t: DRINKS[state.drink].name, p: DRINKS[state.drink].price });
    if (SIZES[state.size].add > 0) {
      total += SIZES[state.size].add;
      lines.push({ t: SIZES[state.size].name + " size", p: SIZES[state.size].add });
    }
    if (state.drink !== "espresso" && MILKS[state.milk].add > 0) {
      total += MILKS[state.milk].add;
      lines.push({ t: MILKS[state.milk].name, p: MILKS[state.milk].add });
    }
    Object.keys(state.addons).forEach(function (k) {
      total += ADDONS[k].price;
      lines.push({ t: ADDONS[k].name, p: ADDONS[k].price, dim: true });
    });

    var html = "";
    lines.forEach(function (l) {
      html += '<div class="bc-line-item' + (l.dim ? " bc-dim" : "") + '"><span>' + l.t + "</span><span>" + money(l.p) + "</span></div>";
    });
    $("bcLines").innerHTML = html;
    $("bcTotal").textContent = money(total);
  }

  $("bcAddBtn").addEventListener("click", function () {
    var toast = $("bcToast");
    toast.style.opacity = "1";
    setTimeout(function () { toast.style.opacity = "0"; }, 1800);
  });

  render();
})();

