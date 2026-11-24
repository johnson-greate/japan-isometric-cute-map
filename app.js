(function () {
  'use strict';

  const GEO = window.JAPAN_GEO;
  const PREFECTURES = window.PREFECTURES;
  const REGIONS = window.JP_REGIONS;

  const PREF_MAP = new Map(PREFECTURES.map(p => [p.code, p]));
  const MAX_POP = Math.max(...PREFECTURES.map(p => p.population));
  const MAX_GDP = Math.max(...PREFECTURES.map(p => p.gdp));

  // 由北至南（螢幕 Y 由小到大）自動計算 3D 畫家演算法繪製順序，確保立體柱狀無遮擋瑕疵
  const DEPTH_ORDER = Object.keys(GEO.prefectures).sort((a, b) => {
    const fa = GEO.prefectures[a];
    const fb = GEO.prefectures[b];
    if (fa.isInset !== fb.isInset) return fa.isInset ? -1 : 1;
    return fa.centroid[1] - fb.centroid[1];
  });

  // 高密度都會圈（關東／關西／瀨戶內）於 1x 總覽時改採海上快捷導引標籤＋實體圖釘，放大後自動顯示全部 47 標籤
  const COMPACT_IN_OVERVIEW = new Set([
    'JP-11', 'JP-13', 'JP-14', 'JP-19', 'JP-25', 'JP-26', 'JP-27', 'JP-29', 'JP-37', 'JP-41'
  ]);

  // 微調各都道府縣標籤位置，與縣廳圖釘自然錯開
  const LABEL_OFFSETS = {
    'JP-01': [14, 14],    // 北海道
    'JP-02': [-16, -6],   // 青森
    'JP-03': [12, 8],     // 岩手
    'JP-04': [12, 12],    // 宮城
    'JP-05': [-14, 6],    // 秋田
    'JP-06': [-14, 10],   // 山形
    'JP-07': [10, 12],    // 福島
    'JP-08': [18, 6],     // 茨城
    'JP-09': [4, -6],     // 栃木
    'JP-10': [-16, -6],   // 群馬
    'JP-12': [22, 12],    // 千葉
    'JP-15': [-12, -8],   // 新潟
    'JP-16': [4, -10],    // 富山
    'JP-17': [-22, -6],   // 石川
    'JP-18': [-14, -6],   // 福井
    'JP-20': [-4, 10],    // 長野
    'JP-21': [-4, -4],    // 岐阜
    'JP-22': [12, 16],    // 靜岡
    'JP-23': [6, 16],     // 愛知
    'JP-24': [12, 14],    // 三重
    'JP-28': [-8, -10],   // 兵庫
    'JP-30': [6, 16],     // 和歌山
    'JP-31': [4, -12],    // 鳥取
    'JP-32': [-14, -10],  // 島根
    'JP-33': [4, 10],     // 岡山
    'JP-34': [-8, 12],    // 廣島
    'JP-35': [-14, 10],   // 山口
    'JP-36': [14, 12],    // 德島
    'JP-38': [-12, 12],   // 愛媛
    'JP-39': [0, 16],     // 高知
    'JP-40': [-4, -12],   // 福岡
    'JP-42': [-22, 6],    // 長崎
    'JP-43': [-14, 10],   // 熊本
    'JP-44': [14, 8],     // 大分
    'JP-45': [14, 12],    // 宮崎
    'JP-46': [0, 16],     // 鹿兒島
    'JP-47': [-26, 20]    // 沖繩
  };

  const state = {
    mode: 'diorama',       // 'diorama' | 'population' | 'gdp'
    regionFilter: 'all',
    selectedId: 'JP-13',   // 預設選中東京都
    hoveredId: null,
    showPins: true,
    showLabels: true,
    showFossa: false,
    showBelt: false,
    showDecor: true,
    zoom: 1,
    panX: 0,
    panY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragMoved: false,
    dirSort: 'gdp',
    dirQuery: '',
    quizActive: false,
    quizType: 'mixed',     // 'mixed' | 'capital' | 'region' | 'locate'
    quizQuestions: [],
    quizIndex: 0,
    quizScore: 0,
    quizStreak: 0,
    quizAnswered: false
  };

  const mapScene = document.getElementById('mapScene');
  const layerOceanDecor = document.getElementById('layerOceanDecor');
  const layerOkinawaFrame = document.getElementById('layerOkinawaFrame');
  const layerBaseShadow = document.getElementById('layerBaseShadow');
  const layerMapBody = document.getElementById('layerMapBody');
  const layerElevated = document.getElementById('layerElevated');
  const layerLandmarks = document.getElementById('layerLandmarks');
  const layerLabels = document.getElementById('layerLabels');
  const layerPins = document.getElementById('layerPins');
  const layerCallouts = document.getElementById('layerCallouts');
  const layerBelt = document.getElementById('layerBelt');
  const layerFossa = document.getElementById('layerFossa');
  const layerCompass = document.getElementById('layerCompass');

  const mapViewport = document.getElementById('mapViewport');
  const tooltipEl = document.getElementById('mapTooltip');
  const detailCardEl = document.getElementById('detailCard');
  const regionListEl = document.getElementById('regionList');
  const regionSummaryEl = document.getElementById('regionSummary');
  const regionCountBadge = document.getElementById('regionCountBadge');
  const legendCard = document.getElementById('legendCard');
  const legendTitle = document.getElementById('legendTitle');
  const legendBar = document.getElementById('legendBar');
  const legendTicks = document.getElementById('legendTicks');
  const legendNote = document.getElementById('legendNote');

  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const directoryDrawer = document.getElementById('directoryDrawer');
  const dirSearch = document.getElementById('dirSearch');
  const dirList = document.getElementById('dirList');

  const quizHud = document.getElementById('quizHud');
  const quizProgress = document.getElementById('quizProgress');
  const quizScoreEl = document.getElementById('quizScore');
  const quizStreakEl = document.getElementById('quizStreak');
  const quizBody = document.getElementById('quizBody');

  const SVG_NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs = {}, parent = null) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) {
      node.setAttribute(k, v);
    }
    if (parent) parent.appendChild(node);
    return node;
  }

  // ================= 色彩運算 =================
  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16)
    ];
  }

  function rgbToHex(r, g, b) {
    const c = n => Math.max(0, Math.min(255, Math.round(n)));
    return '#' + [c(r), c(g), c(b)].map(n => n.toString(16).padStart(2, '0')).join('');
  }

  function lerpColor(hexA, hexB, t) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    return rgbToHex(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
  }

  function shadeHex(hex, factor) {
    const [r, g, b] = hexToRgb(hex);
    if (factor < 1) {
      return rgbToHex(
        r * factor + 28 * (1 - factor),
        g * factor + 16 * (1 - factor),
        b * factor + 12 * (1 - factor)
      );
    }
    const lift = factor - 1;
    return rgbToHex(r + (255 - r) * lift, g + (255 - g) * lift, b + (255 - b) * lift);
  }

  function sampleRamp(stops, t) {
    const clamped = Math.max(0, Math.min(1, t));
    const scaled = clamped * (stops.length - 1);
    const idx = Math.min(stops.length - 2, Math.floor(scaled));
    return lerpColor(stops[idx], stops[idx + 1], scaled - idx);
  }

  const POP_RAMP = ['#FFF5E2', '#FFDCC0', '#FFB5AC', '#FF83A0', '#E14776'];
  const GDP_RAMP = ['#F2FBE8', '#D3F2C4', '#FFE794', '#FFBC54', '#E8731E'];

  function getPrefColor(pref) {
    if (state.mode === 'population') {
      return sampleRamp(POP_RAMP, Math.pow(pref.population / MAX_POP, 0.48));
    }
    if (state.mode === 'gdp') {
      return sampleRamp(GDP_RAMP, Math.pow(pref.gdp / MAX_GDP, 0.42));
    }
    return pref.color;
  }

  function getPrefHeight(pref) {
    if (state.mode === 'population') {
      return Math.round(9 + Math.pow(pref.population / MAX_POP, 0.52) * 68);
    }
    if (state.mode === 'gdp') {
      return Math.round(9 + Math.pow(pref.gdp / MAX_GDP, 0.44) * 74);
    }
    return 15;
  }

  function isDimmed(code) {
    if (state.regionFilter === 'all') return false;
    const p = PREF_MAP.get(code);
    return p && p.region !== state.regionFilter;
  }

  // ================= 2.5D 立體積木幾何繪製 =================
  function ringsToPath(polys, yOffset = 0) {
    let d = '';
    for (const rings of polys) {
      for (const ring of rings) {
        if (!ring.length) continue;
        d += `M${ring[0][0]},${(ring[0][1] + yOffset).toFixed(1)}`;
        for (let i = 1; i < ring.length; i++) {
          d += `L${ring[i][0]},${(ring[i][1] + yOffset).toFixed(1)}`;
        }
        d += 'Z';
      }
    }
    return d;
  }

  function appendExtrusionWalls(parent, polys, height, baseColor, yShift = 0) {
    const topY = -height + yShift;
    const botY = yShift;
    const quads = [];

    for (const rings of polys) {
      const outer = rings[0];
      for (let i = 0; i < outer.length - 1; i++) {
        const a = outer[i];
        const b = outer[i + 1];
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const len = Math.hypot(dx, dy);
        if (len < 0.25) continue;

        const nx = dy / len;
        const shadeFactor = 0.80 - nx * 0.11;
        const fill = shadeHex(baseColor, shadeFactor);

        quads.push({
          sortY: Math.max(a[1], b[1]),
          fill,
          d: `M${a[0]},${(a[1] + topY).toFixed(1)}L${b[0]},${(b[1] + topY).toFixed(1)}L${b[0]},${(b[1] + botY).toFixed(1)}L${a[0]},${(a[1] + botY).toFixed(1)}Z`
        });
      }
    }

    quads.sort((q1, q2) => q1.sortY - q2.sortY);

    const baseFill = shadeHex(baseColor, 0.74);
    el('path', {
      d: ringsToPath(polys, botY),
      fill: baseFill,
      stroke: baseFill,
      'stroke-width': '1.2',
      'stroke-linejoin': 'round'
    }, parent);

    for (const q of quads) {
      el('path', {
        d: q.d,
        fill: q.fill,
        stroke: q.fill,
        'stroke-width': '0.7',
        'stroke-linejoin': 'round'
      }, parent);
    }

    el('path', {
      d: ringsToPath(polys, botY),
      fill: 'none',
      stroke: '#6B5548',
      'stroke-width': '1.1',
      'stroke-opacity': '0.42',
      'stroke-linejoin': 'round'
    }, parent);
  }

  // 繪製沖繩諸島可愛等軸測木框底板
  function renderOkinawaFrame() {
    layerOkinawaFrame.innerHTML = '';
    const b = GEO.okinawaBox;
    // 立體木框厚度
    el('rect', {
      x: b.x, y: b.y + 6, width: b.w, height: b.h, rx: '20',
      fill: '#D5BFA6', stroke: '#5E4A40', 'stroke-width': '2.2'
    }, layerOkinawaFrame);
    // 奶油框面
    el('rect', {
      x: b.x, y: b.y, width: b.w, height: b.h, rx: '20',
      fill: '#FFFBF4', stroke: '#5E4A40', 'stroke-width': '2.2'
    }, layerOkinawaFrame);
    // 珊瑚海藍窗格
    el('rect', {
      x: b.x + 8, y: b.y + 8, width: b.w - 16, height: b.h - 32, rx: '13',
      fill: '#CEF0FF', stroke: '#93D3F0', 'stroke-width': '1.5'
    }, layerOkinawaFrame);

    // 框內細波紋
    el('path', {
      d: `M ${b.x + 24} ${b.y + 38} q 6 -4 12 0 t 12 0`,
      fill: 'none', stroke: '#FFFFFF', 'stroke-width': '2', 'stroke-linecap': 'round', opacity: '0.75'
    }, layerOkinawaFrame);
    el('path', {
      d: `M ${b.x + 128} ${b.y + 92} q 6 -4 12 0 t 12 0`,
      fill: 'none', stroke: '#FFFFFF', 'stroke-width': '2', 'stroke-linecap': 'round', opacity: '0.75'
    }, layerOkinawaFrame);

    const lbl = el('text', {
      x: b.x + b.w / 2,
      y: b.y + b.h - 8,
      'text-anchor': 'middle',
      'font-size': '11.5',
      'font-weight': '800',
      fill: '#5E4A40'
    }, layerOkinawaFrame);
    lbl.textContent = '🌺 沖繩縣（琉球諸島插圖）';

    // 可愛虛線指向西南方向，表示沖繩實際位於九州更西南方
    el('path', {
      d: `M ${b.x + 18} ${b.y + b.h + 4} Q ${b.x - 16} ${b.y + b.h + 48} ${b.x - 10} ${b.y + b.h + 100}`,
      fill: 'none', stroke: '#8BBBD4', 'stroke-width': '2', 'stroke-dasharray': '5 5', opacity: '0.75'
    }, layerOkinawaFrame);
  }

  function renderBaseShadow() {
    layerBaseShadow.innerHTML = '';
    const g = el('g', { filter: 'url(#islandShadow)', opacity: '0.62' }, layerBaseShadow);
    for (const code of DEPTH_ORDER) {
      const feat = GEO.prefectures[code];
      if (!feat || feat.isInset) continue;
      el('path', { d: ringsToPath(feat.polys, 6), fill: '#75B8D6' }, g);
    }
  }

  function renderMapBody() {
    layerMapBody.innerHTML = '';

    if (state.mode === 'diorama') {
      const wallLayer = el('g', { class: 'diorama-walls' }, layerMapBody);
      for (const code of DEPTH_ORDER) {
        const pref = PREF_MAP.get(code);
        const feat = GEO.prefectures[code];
        if (!pref || !feat) continue;
        const dimmed = isDimmed(code);
        const wg = el('g', { opacity: dimmed ? '0.26' : '1' }, wallLayer);
        appendExtrusionWalls(wg, feat.polys, getPrefHeight(pref), getPrefColor(pref), 0);
      }

      const topLayer = el('g', { class: 'diorama-tops' }, layerMapBody);
      for (const code of DEPTH_ORDER) {
        const pref = PREF_MAP.get(code);
        const feat = GEO.prefectures[code];
        if (!pref || !feat) continue;
        const h = getPrefHeight(pref);
        const fill = getPrefColor(pref);
        const dimmed = isDimmed(code);

        const g = el('g', {
          class: `province-group${dimmed ? ' dimmed' : ''}`,
          'data-code': code
        }, topLayer);

        el('path', {
          class: 'province-top',
          d: ringsToPath(feat.polys, -h),
          fill,
          stroke: '#6E5649',
          'stroke-width': '1.45',
          'stroke-linejoin': 'round'
        }, g);

        el('path', {
          d: ringsToPath(feat.polys, -h + 0.7),
          fill: 'none',
          stroke: '#FFFFFF',
          'stroke-width': '1',
          'stroke-opacity': '0.42',
          'stroke-linejoin': 'round',
          'pointer-events': 'none'
        }, g);

        bindPrefEvents(g, pref);
      }
    } else {
      // 人口 3D / GDP 3D 高度柱狀模式
      for (const code of DEPTH_ORDER) {
        const pref = PREF_MAP.get(code);
        const feat = GEO.prefectures[code];
        if (!pref || !feat) continue;
        const h = getPrefHeight(pref);
        const fill = getPrefColor(pref);
        const dimmed = isDimmed(code);

        const g = el('g', {
          class: `province-group${dimmed ? ' dimmed' : ''}`,
          'data-code': code
        }, layerMapBody);

        appendExtrusionWalls(g, feat.polys, h, fill, 0);

        el('path', {
          class: 'province-top',
          d: ringsToPath(feat.polys, -h),
          fill,
          stroke: '#5E4A40',
          'stroke-width': '1.4',
          'stroke-linejoin': 'round'
        }, g);

        el('path', {
          d: ringsToPath(feat.polys, -h + 0.7),
          fill: 'none',
          stroke: '#FFFFFF',
          'stroke-width': '1',
          'stroke-opacity': '0.45',
          'stroke-linejoin': 'round',
          'pointer-events': 'none'
        }, g);

        bindPrefEvents(g, pref);
      }
    }
  }

  function renderElevated() {
    layerElevated.innerHTML = '';
    const items = [];
    if (state.selectedId) items.push({ code: state.selectedId, isSelected: true });
    if (state.hoveredId && state.hoveredId !== state.selectedId) {
      items.push({ code: state.hoveredId, isSelected: false });
    }

    for (const item of items) {
      const pref = PREF_MAP.get(item.code);
      const feat = GEO.prefectures[item.code];
      if (!pref || !feat) continue;

      const h = getPrefHeight(pref);
      const lift = item.isSelected ? 11 : 7;
      const fill = shadeHex(getPrefColor(pref), item.isSelected ? 1.12 : 1.08);

      const g = el('g', {
        class: 'elevated-piece',
        filter: 'url(#elevatedShadow)',
        'pointer-events': 'none'
      }, layerElevated);

      appendExtrusionWalls(g, feat.polys, h, fill, -lift);

      el('path', {
        d: ringsToPath(feat.polys, -h - lift),
        fill,
        stroke: item.isSelected ? '#FF5E57' : '#5E4A40',
        'stroke-width': item.isSelected ? '2.6' : '2.0',
        'stroke-linejoin': 'round'
      }, g);

      el('path', {
        d: ringsToPath(feat.polys, -h - lift + 0.9),
        fill: 'none',
        stroke: '#FFFFFF',
        'stroke-width': '1.6',
        'stroke-opacity': '0.72',
        'stroke-linejoin': 'round'
      }, g);
    }
  }

  // ================= 47 個縣廳所在地可愛立體圖釘 =================
  function renderPins() {
    layerPins.innerHTML = '';
    if (!state.showPins) return;

    const DENSE_CODES = new Set(['JP-11', 'JP-13', 'JP-14', 'JP-25', 'JP-26', 'JP-27', 'JP-29', 'JP-37', 'JP-41']);

    for (const code of DEPTH_ORDER) {
      const pref = PREF_MAP.get(code);
      const feat = GEO.prefectures[code];
      if (!pref || !feat) continue;

      const region = REGIONS[pref.region];
      const h = getPrefHeight(pref);
      const isSelected = state.selectedId === code;
      const isHovered = state.hoveredId === code;
      const lift = isSelected ? 11 : (isHovered ? 7 : 0);
      const px = feat.pin[0];
      const py = feat.pin[1] - h - lift;
      const dimmed = isDimmed(code);
      const scale = isSelected ? 1.12 : (DENSE_CODES.has(code) ? 0.74 : 0.86);

      const g = el('g', {
        class: `pin-group${isSelected ? ' active' : ''}${dimmed ? ' dimmed' : ''}`,
        transform: `translate(${px.toFixed(1)}, ${py.toFixed(1)})`,
        'data-code': code
      }, layerPins);

      if (isSelected) {
        const ring = el('ellipse', {
          cx: '0', cy: '0', rx: '11', ry: '6.5',
          fill: 'none', stroke: '#FF5E57', 'stroke-width': '2.2', opacity: '0.88'
        }, g);
        el('animate', { attributeName: 'rx', values: '6;15;6', dur: '1.8s', repeatCount: 'indefinite' }, ring);
        el('animate', { attributeName: 'ry', values: '3.5;9;3.5', dur: '1.8s', repeatCount: 'indefinite' }, ring);
        el('animate', { attributeName: 'opacity', values: '0.9;0.15;0.9', dur: '1.8s', repeatCount: 'indefinite' }, ring);
      }

      el('ellipse', {
        cx: '1.4', cy: '0.8',
        rx: (4.4 * scale).toFixed(1), ry: (2.4 * scale).toFixed(1),
        fill: '#4F3D34', opacity: '0.28'
      }, g);

      const inner = el('g', { class: 'pin-inner', transform: `scale(${scale})` }, g);

      el('path', {
        d: 'M 0 0 L -1.1 -9.5 L 1.1 -9.5 Z',
        fill: '#D8E3EA', stroke: '#5E4A40', 'stroke-width': '1.1', 'stroke-linejoin': 'round'
      }, inner);

      el('ellipse', {
        cx: '0', cy: '-9.8', rx: '5.2', ry: '2.4',
        fill: shadeHex(region.pinColor, 0.78), stroke: '#5E4A40', 'stroke-width': '1.25'
      }, inner);

      el('circle', {
        cx: '0', cy: '-14.8', r: '6.3',
        fill: region.pinColor, stroke: '#5E4A40', 'stroke-width': '1.55'
      }, inner);

      el('circle', { cx: '0', cy: '-14.8', r: '5.5', fill: 'url(#pinGloss)', 'pointer-events': 'none' }, inner);

      el('ellipse', {
        cx: '-2.1', cy: '-17.0', rx: '2.0', ry: '1.2',
        transform: 'rotate(-28 -2.1 -17.0)', fill: '#FFFFFF', opacity: '0.92', 'pointer-events': 'none'
      }, inner);

      el('circle', { cx: '0', cy: '-9', r: '10', fill: 'transparent' }, g);

      bindPrefEvents(g, pref, true);
    }
  }

  // ================= 都道府縣名稱可愛標籤 =================
  function renderLabels() {
    layerLabels.innerHTML = '';
    const hideForQuiz = state.quizActive && (state.quizType === 'locate' || state.quizType === 'mixed');
    if (!state.showLabels || hideForQuiz) return;

    const showAllCompact = state.zoom >= 1.32;

    for (const code of DEPTH_ORDER) {
      const pref = PREF_MAP.get(code);
      const feat = GEO.prefectures[code];
      if (!pref || !feat) continue;

      const isSelected = state.selectedId === code;
      const isHovered = state.hoveredId === code;

      // 在 1x 總覽下，高密度核心都府縣交由海上快捷標籤呈現，避免疊字；放大或選中時即時顯示！
      if (!showAllCompact && COMPACT_IN_OVERVIEW.has(code) && !isSelected && !isHovered) {
        continue;
      }

      const h = getPrefHeight(pref);
      const lift = isSelected ? 11 : (isHovered ? 7 : 0);
      const [ox, oy] = LABEL_OFFSETS[code] || [0, 12];
      let lx = feat.centroid[0] + ox;
      let ly = feat.centroid[1] + oy - h - lift;

      if (state.showPins) {
        const pinX = feat.pin[0];
        const pinY = feat.pin[1] - h - lift - 10;
        if (Math.abs(lx - pinX) < 18 && Math.abs(ly - pinY) < 15) {
          ly = feat.pin[1] - h - lift + 12;
        }
      }

      const dimmed = isDimmed(code);
      const g = el('g', {
        class: `label-pill-group${dimmed ? ' dimmed' : ''}`,
        transform: `translate(${lx.toFixed(1)}, ${ly.toFixed(1)})`
      }, layerLabels);

      const labelText = pref.shortName;
      const pillW = Math.max(30, labelText.length * 9.5 + 10);

      el('rect', {
        x: (-pillW / 2).toFixed(1), y: '-8.5',
        width: pillW.toFixed(1), height: '16', rx: '8',
        fill: isSelected ? '#FFF0B3' : 'rgba(255, 252, 245, 0.90)',
        stroke: isSelected ? '#FF5E57' : '#7D6557',
        'stroke-width': isSelected ? '1.8' : '1.15'
      }, g);

      const txt = el('text', {
        x: '0', y: '3.0',
        'text-anchor': 'middle', 'font-size': '9.2', 'font-weight': '800',
        fill: '#4F3D34', 'font-family': 'var(--font-cute)'
      }, g);
      txt.textContent = labelText;
    }
  }

  // ================= 高密度都會區海上快捷點擊導引卡 =================
  function renderCallouts() {
    layerCallouts.innerHTML = '';
    const hideName = state.quizActive && state.quizType === 'locate';

    const items = [
      { code: 'JP-11', badgeX: 836, badgeY: 506, side: 'right' }, // 埼玉
      { code: 'JP-13', badgeX: 822, badgeY: 540, side: 'right' }, // 東京
      { code: 'JP-14', badgeX: 794, badgeY: 576, side: 'right' }, // 神奈川
      { code: 'JP-26', badgeX: 486, badgeY: 430, side: 'top'   }, // 京都
      { code: 'JP-25', badgeX: 546, badgeY: 454, side: 'top'   }, // 滋賀
      { code: 'JP-27', badgeX: 608, badgeY: 642, side: 'bottom'}, // 大阪
      { code: 'JP-29', badgeX: 650, badgeY: 612, side: 'bottom'}, // 奈良
      { code: 'JP-37', badgeX: 468, badgeY: 654, side: 'bottom'}  // 香川
    ];

    for (const item of items) {
      const pref = PREF_MAP.get(item.code);
      const feat = GEO.prefectures[item.code];
      if (!pref || !feat) continue;

      const h = getPrefHeight(pref);
      const isSelected = state.selectedId === item.code;
      const lift = isSelected ? 11 : 0;
      const tx = feat.pin[0];
      const ty = feat.pin[1] - h - lift;
      const region = REGIONS[pref.region];
      const dimmed = isDimmed(item.code);

      const g = el('g', {
        class: `callout-badge${dimmed ? ' dimmed' : ''}`,
        'data-code': item.code
      }, layerCallouts);

      const label = hideName ? `📌 ${pref.code}` : `${pref.shortName} · ${pref.capital.replace('市', '').replace('新宿區（東京都廳）', '新宿')}`;
      const bw = Math.max(66, label.length * 8.4 + 22);
      const bx = item.badgeX - bw / 2;
      const by = item.badgeY - 11;

      const anchorX = item.side === 'right' ? bx : item.badgeX;
      const anchorY = item.side === 'top' ? by + 22 : (item.side === 'bottom' ? by : item.badgeY);

      el('path', {
        d: `M ${tx.toFixed(1)} ${ty.toFixed(1)} Q ${((tx + anchorX) / 2).toFixed(1)} ${((ty + anchorY) / 2 - 4).toFixed(1)} ${anchorX.toFixed(1)} ${anchorY.toFixed(1)}`,
        fill: 'none',
        stroke: isSelected ? '#FF5E57' : '#6E5649',
        'stroke-width': isSelected ? '2' : '1.3',
        'stroke-dasharray': '3.5 3',
        opacity: '0.76'
      }, g);

      el('rect', {
        x: bx.toFixed(1), y: (by + 2).toFixed(1), width: bw.toFixed(1), height: '22', rx: '11',
        fill: '#CBB6A0', opacity: '0.6'
      }, g);

      el('rect', {
        x: bx.toFixed(1), y: by.toFixed(1), width: bw.toFixed(1), height: '22', rx: '11',
        fill: isSelected ? '#FFE9A3' : '#FFFBF4',
        stroke: isSelected ? '#FF5E57' : '#5E4A40',
        'stroke-width': isSelected ? '2.2' : '1.6'
      }, g);

      el('circle', {
        cx: (bx + 11).toFixed(1), cy: (by + 11).toFixed(1), r: '4',
        fill: region.pinColor, stroke: '#5E4A40', 'stroke-width': '1.2'
      }, g);

      const txt = el('text', {
        x: (bx + 19).toFixed(1), y: (by + 14.5).toFixed(1),
        'font-size': '10', 'font-weight': '800', fill: '#4F3D34',
        'font-family': 'var(--font-cute)'
      }, g);
      txt.textContent = label;

      bindPrefEvents(g, pref, true);
    }
  }

  // ================= 兩大日本地理經典主題疊加層 =================
  function renderFossaLine() {
    layerFossa.innerHTML = '';
    layerFossa.classList.toggle('hidden', !state.showFossa);
    if (!state.showFossa) return;

    const pts = GEO.fossaLine;
    const yOff = state.mode === 'diorama' ? -18 : -40;
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${(p[1] + yOff).toFixed(1)}`).join('');

    el('path', { d, fill: 'none', stroke: '#FFFFFF', 'stroke-width': '7', 'stroke-linecap': 'round', opacity: '0.85' }, layerFossa);
    el('path', { d, fill: 'none', stroke: '#E63946', 'stroke-width': '3.2', 'stroke-dasharray': '8 5', 'stroke-linecap': 'round' }, layerFossa);

    const start = pts[0];
    const end = pts[pts.length - 1];
    for (const [p, name, dy] of [[start, '糸魚川 (新潟)', -12], [end, '靜岡 (駿河灣)', 16]]) {
      el('circle', { cx: p[0], cy: p[1] + yOff, r: '5.5', fill: '#FF5C5C', stroke: '#FFFBF4', 'stroke-width': '2.2' }, layerFossa);
      const t = el('text', { x: p[0], y: p[1] + yOff + dy, 'text-anchor': 'middle', 'font-size': '10', 'font-weight': '900', fill: '#B4232C', stroke: '#FFFBF4', 'stroke-width': '3', 'paint-order': 'stroke' }, layerFossa);
      t.textContent = name;
    }

    // 註解小卡置於北側海面不擋陸地
    const card = el('g', { transform: `translate(${start[0] - 25}, ${start[1] + yOff - 52})` }, layerFossa);
    el('rect', { x: '-104', y: '-22', width: '208', height: '42', rx: '14', fill: 'rgba(255,250,242,0.96)', stroke: '#E63946', 'stroke-width': '2' }, card);
    const l1 = el('text', { x: '0', y: '-5', 'text-anchor': 'middle', 'font-size': '10.8', 'font-weight': '900', fill: '#B4232C' }, card);
    l1.textContent = '🌋 糸魚川—靜岡構造線（大地溝帶西緣）';
    const l2 = el('text', { x: '0', y: '11', 'text-anchor': 'middle', 'font-size': '9.4', 'font-weight': '700', fill: '#5E4A40' }, card);
    l2.textContent = '東日本 (50Hz) ↔ 西日本 (60Hz) 地質文化分界';
  }

  function renderPacificBelt() {
    layerBelt.innerHTML = '';
    layerBelt.classList.toggle('hidden', !state.showBelt);
    if (!state.showBelt) return;

    const pts = GEO.pacificBelt;
    const yOff = state.mode === 'diorama' ? -18 : -46;
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${(p[1] + yOff).toFixed(1)}`).join('');

    el('path', { d, fill: 'none', stroke: '#FFD166', 'stroke-width': '11', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: '0.42' }, layerBelt);
    el('path', { d, fill: 'none', stroke: '#0D9488', 'stroke-width': '3.2', 'stroke-dasharray': '7 5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, layerBelt);

    for (const p of pts) {
      el('circle', { cx: p[0], cy: p[1] + yOff, r: '4', fill: '#14B8A6', stroke: '#FFFBF4', 'stroke-width': '1.8' }, layerBelt);
    }

    const card = el('g', { transform: `translate(725, 696)` }, layerBelt);
    el('rect', { x: '-114', y: '-22', width: '228', height: '42', rx: '14', fill: 'rgba(244,255,252,0.96)', stroke: '#0D9488', 'stroke-width': '2' }, card);
    const l1 = el('text', { x: '0', y: '-5', 'text-anchor': 'middle', 'font-size': '10.8', 'font-weight': '900', fill: '#0F766E' }, card);
    l1.textContent = '🚅 太平洋工業帶（東海道—山陽大動脈）';
    const l2 = el('text', { x: '0', y: '11', 'text-anchor': 'middle', 'font-size': '9.4', 'font-weight': '700', fill: '#5E4A40' }, card);
    l2.textContent = '東京→名古屋→大阪→廣島→福岡 · 聚集逾七成經濟產值';
  }

  // ================= 可愛日本海洋、櫻雲、帆船、富士山與指南針 =================
  function renderOceanDecor() {
    layerOceanDecor.innerHTML = '';

    // 柔和海域地理名稱標示（大一地理重點海域！）
    const seas = [
      { x: 545, y: 315, text: '日 本 海', size: 15, rot: -16 },
      { x: 840, y: 650, text: '太 平 洋', size: 15, rot: -14 },
      { x: 965, y: 392, text: '津輕海峽', size: 10, rot: 0 }
    ];
    for (const s of seas) {
      const t = el('text', {
        x: s.x, y: s.y,
        transform: `rotate(${s.rot} ${s.x} ${s.y})`,
        'text-anchor': 'middle', 'font-size': s.size, 'font-weight': '800',
        fill: '#5CA3C7', opacity: '0.52', 'letter-spacing': '0.18em'
      }, layerOceanDecor);
      t.textContent = s.text;
    }

    if (!state.showDecor) return;

    const waves = [
      [485, 250], [620, 225], [270, 420], [925, 455],
      [885, 590], [690, 690], [340, 675], [1005, 320]
    ];
    for (const [wx, wy] of waves) {
      el('path', {
        d: `M ${wx} ${wy} q 8 -5 16 0 t 16 0 t 16 0`,
        fill: 'none', stroke: '#FFFFFF', 'stroke-width': '2.3', 'stroke-linecap': 'round', opacity: '0.65'
      }, layerOceanDecor);
    }

    // 可愛日式小渡輪／帆船
    const boats = [
      { x: 590, y: 375, color: '#FF9EAA' },
      { x: 762, y: 648, color: '#FFD166' }
    ];
    for (const b of boats) {
      const bg = el('g', { class: 'boat-bob', transform: `translate(${b.x}, ${b.y})` }, layerOceanDecor);
      el('ellipse', { cx: '0', cy: '8', rx: '14', ry: '4', fill: '#88CFEA', opacity: '0.55' }, bg);
      el('path', { d: 'M -12 3 Q 0 11 12 3 L 9 -1 L -9 -1 Z', fill: '#FFF5E1', stroke: '#5E4A40', 'stroke-width': '1.6', 'stroke-linejoin': 'round' }, bg);
      el('line', { x1: '0', y1: '-1', x2: '0', y2: '-17', stroke: '#5E4A40', 'stroke-width': '1.6' }, bg);
      el('path', { d: 'M 1 -16 L 12 -5 L 1 -5 Z', fill: b.color, stroke: '#5E4A40', 'stroke-width': '1.4', 'stroke-linejoin': 'round' }, bg);
    }

    // 漂浮白雲與淡淡櫻花瓣
    const clouds = [
      { x: 520, y: 185, s: 0.9, cls: 'cloud-float-1' },
      { x: 995, y: 195, s: 0.85, cls: 'cloud-float-2' },
      { x: 265, y: 465, s: 0.78, cls: 'cloud-float-2' },
      { x: 925, y: 685, s: 0.82, cls: 'cloud-float-1' }
    ];
    for (const c of clouds) {
      const wrap = el('g', { transform: `translate(${c.x}, ${c.y}) scale(${c.s})` }, layerOceanDecor);
      const inner = el('g', { class: c.cls }, wrap);
      el('path', {
        d: 'M -28 8 C -36 8 -40 -2 -32 -7 C -30 -18 -14 -22 -5 -14 C 2 -24 22 -22 26 -9 C 37 -8 40 8 28 8 Z',
        fill: '#FFFFFF', stroke: '#A4D8F0', 'stroke-width': '2', opacity: '0.92'
      }, inner);
    }
  }

  function renderLandmarks() {
    layerLandmarks.innerHTML = '';
    if (!state.showDecor || state.mode !== 'diorama') return;

    // 精緻可愛手繪富士山（精準坐落山梨與靜岡交界！）
    const [fx, fy] = GEO.fuji;
    const fujiDim = isDimmed('JP-22') && isDimmed('JP-19');
    const fg = el('g', {
      transform: `translate(${fx.toFixed(1)}, ${(fy - 16).toFixed(1)})`,
      opacity: fujiDim ? '0.2' : '0.98',
      'pointer-events': 'none'
    }, layerLandmarks);
    el('path', { d: 'M -15 4 Q -6 -4 -3 -15 L 3 -15 Q 6 -4 15 4 Z', fill: '#6FAFE8', stroke: '#5E4A40', 'stroke-width': '1.6', 'stroke-linejoin': 'round' }, fg);
    el('path', { d: 'M -6.5 -6 Q -4.2 -10 -3 -15 L 3 -15 Q 4.2 -10 6.5 -6 Q 3 -3 0 -6.5 Q -3 -3 -6.5 -6 Z', fill: '#FFFFFF', stroke: '#5E4A40', 'stroke-width': '1.1', 'stroke-linejoin': 'round' }, fg);

    const spots = [
      { code: 'JP-01', dx: 42, dy: -8, icon: '⛄', size: 20 },   // 北海道雪人
      { code: 'JP-01', dx: -26, dy: -22, icon: '🐻', size: 17 }, // 北海道小熊
      { code: 'JP-02', dx: 12, dy: -16, icon: '🍎', size: 16 },  // 青森蘋果
      { code: 'JP-29', dx: 8, dy: 4, icon: '🦌', size: 16 },     // 奈良小鹿
      { code: 'JP-34', dx: -16, dy: -8, icon: '⛩️', size: 16 },  // 廣島嚴島鳥居
      { code: 'JP-44', dx: 12, dy: -8, icon: '♨️', size: 16 },   // 大分別府溫泉
      { code: 'JP-47', dx: -28, dy: -4, icon: '🌺', size: 17 }   // 沖繩扶桑花
    ];
    for (const s of spots) {
      const feat = GEO.prefectures[s.code];
      if (!feat) continue;
      const t = el('text', {
        x: (feat.centroid[0] + s.dx).toFixed(1),
        y: (feat.centroid[1] + s.dy - 17).toFixed(1),
        'font-size': s.size, 'text-anchor': 'middle', 'pointer-events': 'none',
        opacity: isDimmed(s.code) ? '0.2' : '0.92'
      }, layerLandmarks);
      t.textContent = s.icon;
    }
  }

  function renderCompass() {
    layerCompass.innerHTML = '';
    const g = el('g', { transform: `translate(458, 222) rotate(${GEO.isoAngleDeg})` }, layerCompass);
    el('circle', { cx: '0', cy: '0', r: '23', fill: 'rgba(255,251,244,0.92)', stroke: '#5E4A40', 'stroke-width': '2' }, g);
    el('circle', { cx: '0', cy: '0', r: '18', fill: 'none', stroke: '#DFCBB6', 'stroke-width': '1.2', 'stroke-dasharray': '2.5 2.5' }, g);
    el('path', { d: 'M 0 -15 L 4.8 0 L 0 -3 L -4.8 0 Z', fill: '#FF6B6B', stroke: '#5E4A40', 'stroke-width': '1.2', 'stroke-linejoin': 'round' }, g);
    el('path', { d: 'M 0 15 L 4.8 0 L 0 3 L -4.8 0 Z', fill: '#6CC4F7', stroke: '#5E4A40', 'stroke-width': '1.2', 'stroke-linejoin': 'round' }, g);
    el('circle', { cx: '0', cy: '0', r: '2.4', fill: '#FFFBF4', stroke: '#5E4A40', 'stroke-width': '1.2' }, g);
    const nt = el('text', { x: '0', y: '-27', 'text-anchor': 'middle', 'font-size': '10.5', 'font-weight': '900', fill: '#5E4A40' }, g);
    nt.textContent = '北 N';
  }

  // ================= 互動與詳情卡 =================
  function bindPrefEvents(node, pref, isPin = false) {
    node.addEventListener('mouseenter', (e) => {
      if (state.isDragging) return;
      state.hoveredId = pref.code;
      renderElevated();
      renderPins();
      renderLabels();
      showTooltip(e, pref);
    });

    node.addEventListener('mousemove', (e) => {
      if (state.isDragging) { hideTooltip(); return; }
      moveTooltip(e);
    });

    node.addEventListener('mouseleave', () => {
      state.hoveredId = null;
      renderElevated();
      renderPins();
      renderLabels();
      hideTooltip();
    });

    node.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.dragMoved) return;

      if (state.quizActive && !state.quizAnswered) {
        const q = state.quizQuestions[state.quizIndex];
        if (q && q.kind === 'locate') {
          handleLocateQuizClick(pref);
          return;
        }
      }
      selectPref(pref.code, isPin);
    });
  }

  function showTooltip(e, pref) {
    if (state.quizActive) {
      const q = state.quizQuestions[state.quizIndex];
      if (q && q.kind === 'locate' && !state.quizAnswered) {
        tooltipEl.innerHTML = `<div class="tt-name">📍 點擊選擇這裡！</div>`;
        tooltipEl.classList.remove('hidden');
        moveTooltip(e);
        return;
      }
    }

    const region = REGIONS[pref.region];
    tooltipEl.innerHTML = `
      <div class="tt-head">
        <span class="tt-name">${pref.icon} ${pref.fullName}</span>
        <span class="tt-abbr">${pref.oldProvince.split('・')[0]}</span>
      </div>
      <div class="tt-row">📍 縣廳：<strong>${pref.capital}</strong>（${region.short}）</div>
      <div class="tt-row">👥 人口：<strong>${pref.population.toLocaleString()} 萬人</strong>（第${pref.popRank}）</div>
      <div class="tt-row">💴 GDP：<strong>${pref.gdpTrillion} 兆日圓</strong>（第${pref.gdpRank}）</div>
    `;
    tooltipEl.classList.remove('hidden');
    moveTooltip(e);
  }

  function moveTooltip(e) {
    const pad = 16;
    const rect = tooltipEl.getBoundingClientRect();
    let x = e.clientX + pad;
    let y = e.clientY + pad;
    if (x + rect.width > window.innerWidth - 12) x = e.clientX - rect.width - pad;
    if (y + rect.height > window.innerHeight - 12) y = e.clientY - rect.height - pad;
    tooltipEl.style.left = `${x}px`;
    tooltipEl.style.top = `${y}px`;
  }

  function hideTooltip() {
    tooltipEl.classList.add('hidden');
  }

  function selectPref(code, animatePin = true) {
    state.selectedId = code;
    renderElevated();
    renderPins();
    renderLabels();
    renderCallouts();
    renderDetailCard(code);
    renderDirectoryList();

    if (animatePin) {
      const pinNode = layerPins.querySelector(`.pin-group[data-code="${code}"]`);
      if (pinNode) {
        pinNode.classList.remove('just-clicked');
        void pinNode.offsetWidth;
        pinNode.classList.add('just-clicked');
      }
    }
  }

  function renderDetailCard(code) {
    const pref = PREF_MAP.get(code);
    if (!pref) return;
    const region = REGIONS[pref.region];
    const popPct = Math.max(4, Math.round((pref.population / MAX_POP) * 100));
    const gdpPct = Math.max(4, Math.round((pref.gdp / MAX_GDP) * 100));

    detailCardEl.innerHTML = `
      <div class="detail-hero" style="background: linear-gradient(135deg, ${pref.color}66, #FFFBF4 78%);">
        <div class="hero-badges">
          <span class="region-tag" style="background:${region.badgeBg}; color:${region.badgeText};">
            ${region.emoji} ${region.name}
          </span>
          <span class="type-tag">${pref.type} · ${pref.code}</span>
        </div>
        <div class="hero-main">
          <div class="hero-name-block">
            <h2>${pref.icon} ${pref.fullName}</h2>
            <div class="hero-name-sub">日文讀音：${pref.kana}</div>
          </div>
          <div class="abbr-stamp" title="簡稱與舊令制國名">
            <span class="abbr-stamp-label">舊國 / 簡稱</span>
            <span class="abbr-stamp-val">${pref.oldProvince.split('・')[0]}</span>
          </div>
        </div>
      </div>

      <div class="detail-body">
        <div class="capital-banner">
          <div class="capital-left">
            <div class="capital-pin-dot" style="background:${region.badgeBg};">📌</div>
            <div>
              <div class="capital-role">${pref.type}廳所在地</div>
              <div class="capital-name">${pref.capital}</div>
            </div>
          </div>
          <span class="capital-coords">${pref.coordsText}</span>
        </div>

        ${pref.capitalDiffers ? `<div class="diff-tip">💡 大一必考重點：${pref.fullName}的行政中心名稱與${pref.type}名不同！（18個異名縣廳之一）</div>` : ''}

        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-head">
              <span>👥 官方人口</span>
              <span class="rank-pill">第 ${pref.popRank} 名</span>
            </div>
            <div class="metric-val">${pref.population.toLocaleString()} 萬</div>
            <div class="metric-sub">總務省人口推計</div>
            <div class="metric-bar-bg">
              <div class="metric-bar-fill pop-fill" style="width:${popPct}%"></div>
            </div>
          </div>

          <div class="metric-box">
            <div class="metric-head">
              <span>💴 官方 GDP</span>
              <span class="rank-pill">第 ${pref.gdpRank} 名</span>
            </div>
            <div class="metric-val">${pref.gdpTrillion} 兆円</div>
            <div class="metric-sub">人均約 ${pref.gdpPerCapita} 萬円</div>
            <div class="metric-bar-bg">
              <div class="metric-bar-fill gdp-fill" style="width:${gdpPct}%"></div>
            </div>
          </div>
        </div>

        <div class="abbr-origin-box">
          <strong>🏮 舊令制國（${pref.oldProvince}）與名源：</strong>${pref.nameOrigin}
        </div>

        <div class="geo-note-box">
          <div class="note-row"><strong>⛰️ 氣候與地形：</strong>${pref.terrain}</div>
          <div class="note-row"><strong>📖 大一地理重點：</strong>${pref.geoNote}</div>
        </div>

        <div class="detail-footer">
          <button class="nav-mini-btn" id="btnPrevPref">⬅️ 上一區</button>
          <button class="nav-mini-btn" id="btnRandPref">🎲 隨機</button>
          <button class="nav-mini-btn" id="btnNextPref">下一區 ➡️</button>
        </div>
      </div>
    `;

    document.getElementById('btnPrevPref').addEventListener('click', () => stepPref(-1));
    document.getElementById('btnNextPref').addEventListener('click', () => stepPref(1));
    document.getElementById('btnRandPref').addEventListener('click', pickRandomPref);
  }

  function stepPref(delta) {
    const idx = PREFECTURES.findIndex(p => p.code === state.selectedId);
    const nextIdx = (idx + delta + PREFECTURES.length) % PREFECTURES.length;
    selectPref(PREFECTURES[nextIdx].code, true);
  }

  function pickRandomPref() {
    const pool = PREFECTURES.filter(p => p.code !== state.selectedId);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    selectPref(pick.code, true);
  }

  // ================= 左側八大地方篩選與動態圖例 =================
  function renderRegionFilter() {
    regionListEl.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = `region-pill all-pill${state.regionFilter === 'all' ? ' active' : ''}`;
    allBtn.innerHTML = `<span>🇯🇵 全部 47 都道府縣</span>`;
    allBtn.addEventListener('click', () => setRegionFilter('all'));
    regionListEl.appendChild(allBtn);

    for (const reg of Object.values(REGIONS)) {
      const btn = document.createElement('button');
      btn.className = `region-pill${state.regionFilter === reg.id ? ' active' : ''}`;
      btn.innerHTML = `<span class="dot" style="background:${reg.pinColor}"></span><span>${reg.short}</span>`;
      btn.addEventListener('click', () => setRegionFilter(reg.id));
      regionListEl.appendChild(btn);
    }

    if (state.regionFilter === 'all') {
      regionCountBadge.textContent = '47區';
      regionSummaryEl.classList.add('hidden');
    } else {
      const reg = REGIONS[state.regionFilter];
      const members = PREFECTURES.filter(p => p.region === state.regionFilter);
      const sumPop = members.reduce((s, p) => s + p.population, 0);
      const sumGdp = members.reduce((s, p) => s + p.gdp, 0);
      regionCountBadge.textContent = `${members.length}區`;
      regionSummaryEl.innerHTML = `
        <div><strong>${reg.emoji} ${reg.name}</strong>（共 ${members.length} 區）</div>
        <div style="margin-top:3px;">${reg.desc}</div>
        <div style="margin-top:4px;">👥 區域總人口：<strong>${Math.round(sumPop).toLocaleString()} 萬人</strong></div>
        <div>💴 區域總GDP：<strong>${(sumGdp / 10000).toFixed(1)} 兆日圓</strong></div>
      `;
      regionSummaryEl.classList.remove('hidden');
    }
  }

  function setRegionFilter(regionId) {
    state.regionFilter = regionId;
    renderRegionFilter();
    renderAllMapLayers();
  }

  function updateLegend() {
    if (state.mode === 'diorama') {
      legendCard.classList.add('hidden');
      return;
    }
    legendCard.classList.remove('hidden');
    if (state.mode === 'population') {
      legendTitle.textContent = '👥 官方人口 3D 高度圖例';
      legendBar.style.background = `linear-gradient(90deg, ${POP_RAMP.join(', ')})`;
      legendTicks.innerHTML = '<span>53萬 (鳥取)</span><span>500萬</span><span>1,418萬 (東京)</span>';
      legendNote.textContent = '積木越高代表人口越密集！一眼看懂「東京一極集中」與太平洋沿岸三大都市圈。';
    } else {
      legendTitle.textContent = '💴 官方 GDP 3D 高度圖例';
      legendBar.style.background = `linear-gradient(90deg, ${GDP_RAMP.join(', ')})`;
      legendTicks.innerHTML = '<span>1.9兆 (鳥取)</span><span>40兆</span><span>120.2兆 (東京)</span>';
      legendNote.textContent = '東京都獨佔全日本約兩成GDP，與大阪、愛知、神奈川共築太平洋經濟走廊！';
    }
  }

  // ================= 平移縮放（自動居中於左右面板安全區） =================
  function getDefaultView() {
    const w = window.innerWidth;
    if (w >= 1180) return { zoom: 0.78, panX: -52, panY: 16 };
    if (w >= 900) return { zoom: 0.72, panX: -56, panY: 14 };
    return { zoom: 0.90, panX: 0, panY: -50 };
  }

  function applyTransform() {
    const cx = 600, cy = 410;
    const tx = cx + state.panX - cx * state.zoom;
    const ty = cy + state.panY - cy * state.zoom;
    mapScene.setAttribute('transform', `translate(${tx.toFixed(1)}, ${ty.toFixed(1)}) scale(${state.zoom.toFixed(3)})`);
  }

  function zoomBy(factor) {
    const prevCompact = state.zoom >= 1.32;
    state.zoom = Math.max(0.62, Math.min(3.8, state.zoom * factor));
    applyTransform();
    if ((state.zoom >= 1.32) !== prevCompact) {
      renderLabels();
    }
  }

  function resetView() {
    const def = getDefaultView();
    state.zoom = def.zoom;
    state.panX = def.panX;
    state.panY = def.panY;
    applyTransform();
    renderLabels();
  }

  function focusPrefOnMap(code) {
    const feat = GEO.prefectures[code];
    if (!feat) return;
    const def = getDefaultView();
    const targetZoom = COMPACT_IN_OVERVIEW.has(code) ? 2.0 : 1.4;
    state.zoom = targetZoom;
    state.panX = (600 - feat.centroid[0]) * targetZoom + def.panX * 0.65;
    state.panY = (410 - feat.centroid[1]) * targetZoom;
    applyTransform();
    renderLabels();
  }

  function initPanZoom() {
    mapViewport.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      state.isDragging = true;
      state.dragMoved = false;
      state.dragStartX = e.clientX - state.panX;
      state.dragStartY = e.clientY - state.panY;
      mapViewport.classList.add('dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!state.isDragging) return;
      const nx = e.clientX - state.dragStartX;
      const ny = e.clientY - state.dragStartY;
      if (Math.hypot(nx - state.panX, ny - state.panY) > 4) state.dragMoved = true;
      state.panX = Math.max(-650, Math.min(650, nx));
      state.panY = Math.max(-480, Math.min(480, ny));
      applyTransform();
    });

    window.addEventListener('mouseup', () => {
      state.isDragging = false;
      mapViewport.classList.remove('dragging');
      setTimeout(() => { state.dragMoved = false; }, 30);
    });

    mapViewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? 1.12 : 0.89);
    }, { passive: false });

    document.getElementById('btnZoomIn').addEventListener('click', () => zoomBy(1.25));
    document.getElementById('btnZoomOut').addEventListener('click', () => zoomBy(0.8));
    document.getElementById('btnZoomReset').addEventListener('click', resetView);
    document.getElementById('btnRandom').addEventListener('click', pickRandomPref);
  }

  // ================= 47都道府縣速查抽屜 =================
  function openDirectory() {
    drawerBackdrop.classList.remove('hidden');
    directoryDrawer.classList.remove('hidden');
    renderDirectoryList();
    setTimeout(() => dirSearch.focus(), 60);
  }

  function closeDirectory() {
    drawerBackdrop.classList.add('hidden');
    directoryDrawer.classList.add('hidden');
  }

  function renderDirectoryList() {
    const q = state.dirQuery.trim().toLowerCase();
    let list = [...PREFECTURES];
    if (q) {
      list = list.filter(p =>
        p.fullName.toLowerCase().includes(q) ||
        p.shortName.toLowerCase().includes(q) ||
        p.kana.includes(q) ||
        p.capital.toLowerCase().includes(q) ||
        p.oldProvince.toLowerCase().includes(q) ||
        REGIONS[p.region].name.includes(q)
      );
    }

    if (state.dirSort === 'gdp') list.sort((a, b) => b.gdp - a.gdp);
    else if (state.dirSort === 'population') list.sort((a, b) => b.population - a.population);
    else list.sort((a, b) => a.code.localeCompare(b.code));

    dirList.innerHTML = '';
    if (!list.length) {
      dirList.innerHTML = `<div style="text-align:center;padding:30px;color:#7B6559;font-weight:700;">找不到符合「${q}」的都道府縣 🧭</div>`;
      return;
    }

    list.forEach((pref, idx) => {
      const reg = REGIONS[pref.region];
      const rankNum = state.dirSort === 'gdp' ? pref.gdpRank : (state.dirSort === 'population' ? pref.popRank : idx + 1);
      const item = document.createElement('div');
      item.className = `dir-item${state.selectedId === pref.code ? ' active' : ''}`;
      item.innerHTML = `
        <div class="dir-left">
          <div class="dir-rank">${rankNum}</div>
          <div class="dir-name-wrap">
            <div class="dir-name">
              <span>${pref.icon} ${pref.fullName}</span>
              <span class="dir-abbr-chip">${pref.oldProvince.split('・')[0]}</span>
            </div>
            <div class="dir-meta">📍 ${pref.capital} · ${reg.short}</div>
          </div>
        </div>
        <div class="dir-right">
          <div class="dir-gdp">${pref.gdpTrillion} 兆円</div>
          <div class="dir-pop">${pref.population.toLocaleString()} 萬人</div>
        </div>
      `;
      item.addEventListener('click', () => {
        selectPref(pref.code, true);
        focusPrefOnMap(pref.code);
        closeDirectory();
      });
      dirList.appendChild(item);
    });
  }

  // ================= 大一日本地理隨堂小測驗 =================
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startQuiz(type = state.quizType) {
    state.quizActive = true;
    state.quizType = type;
    state.quizIndex = 0;
    state.quizScore = 0;
    state.quizStreak = 0;
    state.quizAnswered = false;

    if (state.regionFilter !== 'all') {
      state.regionFilter = 'all';
      renderRegionFilter();
    }

    const diffPool = shuffle(PREFECTURES.filter(p => p.capitalDiffers));
    const allPool = shuffle(PREFECTURES);
    const kinds = ['capital', 'region', 'locate'];

    state.quizQuestions = Array.from({ length: 10 }, (_, idx) => {
      const kind = type === 'mixed' ? kinds[idx % kinds.length] : type;
      const pref = kind === 'capital' ? diffPool[idx % diffPool.length] : allPool[idx];
      return buildQuizQuestion(pref, kind);
    });

    quizHud.classList.remove('hidden');
    document.querySelectorAll('#quizModeTabs .qtab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.qtype === type);
    });

    renderAllMapLayers();
    renderCurrentQuizQuestion();
  }

  function buildQuizQuestion(pref, kind) {
    if (kind === 'capital') {
      const distractors = shuffle(PREFECTURES.filter(p => p.code !== pref.code && p.capitalDiffers)).slice(0, 3);
      return {
        kind: 'capital',
        pref,
        prompt: `【異名縣廳挑戰】「${pref.fullName}」的${pref.type}廳所在地是哪一座城市？`,
        correct: pref.capital,
        options: shuffle([pref.capital, ...distractors.map(d => d.capital)]),
        explain: `${pref.fullName}的行政中心是「${pref.capital}」（舊國：${pref.oldProvince}），位於${REGIONS[pref.region].name}。`
      };
    }
    if (kind === 'region') {
      const allRegs = Object.values(REGIONS);
      const correctReg = REGIONS[pref.region].name;
      const distRegs = shuffle(allRegs.filter(r => r.id !== pref.region)).slice(0, 3).map(r => r.name);
      return {
        kind: 'region',
        pref,
        prompt: `「${pref.fullName}（縣廳：${pref.capital}）」屬於日本八大地方中的哪一區？`,
        correct: correctReg,
        options: shuffle([correctReg, ...distRegs]),
        explain: `${pref.fullName}隸屬於${correctReg}；${pref.terrain}。`
      };
    }
    return {
      kind: 'locate',
      pref,
      prompt: `請直接在立體地圖上點擊找出：「${pref.fullName}」（中心：${pref.capital}，舊國：${pref.oldProvince}）！`,
      correct: pref.code,
      explain: `${pref.fullName}位於${REGIONS[pref.region].name}，官方人口 ${pref.population} 萬人、GDP ${pref.gdpTrillion} 兆日圓。`
    };
  }

  function renderCurrentQuizQuestion() {
    quizScoreEl.textContent = `得分：${state.quizScore}`;
    quizStreakEl.textContent = `🔥 ${state.quizStreak}連擊`;

    if (state.quizIndex >= state.quizQuestions.length) {
      renderQuizSummary();
      return;
    }

    const q = state.quizQuestions[state.quizIndex];
    quizProgress.textContent = `第 ${state.quizIndex + 1} / ${state.quizQuestions.length} 題`;
    state.quizAnswered = false;

    if (q.kind === 'locate') {
      quizBody.innerHTML = `
        <div class="quiz-question">${q.prompt}</div>
        <div class="quiz-locate-hint">👆 請直接點擊下方立體地圖上的都道府縣或圖釘！（沖繩在左上插圖框內喔）</div>
        <div id="quizFeedbackSlot"></div>
      `;
    } else {
      selectPref(q.pref.code, true);
      quizBody.innerHTML = `
        <div class="quiz-question">${q.prompt}</div>
        <div class="quiz-options">
          ${q.options.map(opt => `<button class="quiz-opt-btn" data-opt="${opt}">${opt}</button>`).join('')}
        </div>
        <div id="quizFeedbackSlot"></div>
      `;
      quizBody.querySelectorAll('.quiz-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => handleChoiceQuizAnswer(btn, q));
      });
    }
  }

  function handleChoiceQuizAnswer(clickedBtn, q) {
    if (state.quizAnswered) return;
    state.quizAnswered = true;
    const isOk = clickedBtn.dataset.opt === q.correct;
    quizBody.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.opt === q.correct) btn.classList.add('correct');
      else if (btn === clickedBtn && !isOk) btn.classList.add('wrong');
    });
    finishQuizStep(isOk, q.explain);
  }

  function handleLocateQuizClick(clickedPref) {
    const q = state.quizQuestions[state.quizIndex];
    state.quizAnswered = true;
    const isOk = clickedPref.code === q.pref.code;
    selectPref(q.pref.code, true);
    const msg = isOk
      ? `🎉 完美命中 ${q.pref.fullName}！${q.explain}`
      : `😅 你點到的是「${clickedPref.fullName}」，正確位置已亮起：${q.explain}`;
    finishQuizStep(isOk, msg);
  }

  function finishQuizStep(isOk, explainText) {
    if (isOk) { state.quizScore += 10; state.quizStreak += 1; }
    else { state.quizStreak = 0; }
    quizScoreEl.textContent = `得分：${state.quizScore}`;
    quizStreakEl.textContent = `🔥 ${state.quizStreak}連擊`;

    const slot = document.getElementById('quizFeedbackSlot');
    const isLast = state.quizIndex === state.quizQuestions.length - 1;
    slot.innerHTML = `
      <div class="quiz-feedback ${isOk ? 'ok' : 'bad'}">
        <span>${isOk ? '✅ 答對了！' : '💡 記憶提示：'}${explainText}</span>
        <button class="quiz-next-btn" id="btnQuizNext">${isLast ? '查看成績 🏆' : '下一題 ➡️'}</button>
      </div>
    `;
    document.getElementById('btnQuizNext').addEventListener('click', () => {
      state.quizIndex += 1;
      renderCurrentQuizQuestion();
    });
  }

  function renderQuizSummary() {
    const score = state.quizScore;
    let rank = '🎒 日本列島探險萌新';
    if (score >= 90) rank = '🌟 伊能忠敬轉世・日本地理大師！';
    else if (score >= 70) rank = '🎓 大一日本地理學霸！';
    else if (score >= 50) rank = '🚅 新幹線縱貫達人！';

    quizProgress.textContent = '測驗完成！';
    quizBody.innerHTML = `
      <div class="quiz-question" style="text-align:center;">
        <div style="font-size:28px;margin-bottom:4px;">🏆 ${score} / 100 分</div>
        <div style="font-size:15px;color:#B44D18;">${rank}</div>
      </div>
      <div style="display:flex;gap:8px;justify-content:center;">
        <button class="quiz-next-btn" id="btnQuizAgain">🔄 再挑戰一次</button>
        <button class="nav-mini-btn" style="flex:0 1 auto;padding:6px 14px;" id="btnQuizDone">返回探索地圖</button>
      </div>
    `;
    document.getElementById('btnQuizAgain').addEventListener('click', () => startQuiz(state.quizType));
    document.getElementById('btnQuizDone').addEventListener('click', closeQuiz);
  }

  function closeQuiz() {
    state.quizActive = false;
    quizHud.classList.add('hidden');
    renderAllMapLayers();
  }

  // ================= 統一重繪與啟動 =================
  function renderAllMapLayers() {
    renderOceanDecor();
    renderOkinawaFrame();
    renderMapBody();
    renderElevated();
    renderLandmarks();
    renderLabels();
    renderPins();
    renderCallouts();
    renderPacificBelt();
    renderFossaLine();
    updateLegend();
  }

  function initUIEvents() {
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.mode = btn.dataset.mode;
        renderAllMapLayers();
      });
    });

    document.getElementById('togglePins').addEventListener('change', e => {
      state.showPins = e.target.checked;
      renderPins();
    });
    document.getElementById('toggleLabels').addEventListener('change', e => {
      state.showLabels = e.target.checked;
      renderLabels();
    });
    document.getElementById('toggleFossa').addEventListener('change', e => {
      state.showFossa = e.target.checked;
      renderFossaLine();
    });
    document.getElementById('toggleBelt').addEventListener('change', e => {
      state.showBelt = e.target.checked;
      renderPacificBelt();
    });
    document.getElementById('toggleDecor').addEventListener('change', e => {
      state.showDecor = e.target.checked;
      renderOceanDecor();
      renderLandmarks();
    });

    document.getElementById('btnDirectory').addEventListener('click', openDirectory);
    document.getElementById('btnCloseDrawer').addEventListener('click', closeDirectory);
    drawerBackdrop.addEventListener('click', closeDirectory);

    dirSearch.addEventListener('input', e => {
      state.dirQuery = e.target.value;
      renderDirectoryList();
    });

    document.querySelectorAll('.sort-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sort-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.dirSort = btn.dataset.sort;
        renderDirectoryList();
      });
    });

    document.getElementById('btnQuiz').addEventListener('click', () => {
      if (state.quizActive) closeQuiz();
      else startQuiz(state.quizType);
    });
    document.getElementById('btnCloseQuiz').addEventListener('click', closeQuiz);
    document.querySelectorAll('#quizModeTabs .qtab').forEach(btn => {
      btn.addEventListener('click', () => startQuiz(btn.dataset.qtype));
    });

    window.addEventListener('keydown', (e) => {
      if (document.activeElement === dirSearch) return;
      if (e.key === 'Escape') {
        closeDirectory();
        if (state.quizActive) closeQuiz();
      } else if (e.key === 'ArrowRight' && !state.quizActive) {
        stepPref(1);
      } else if (e.key === 'ArrowLeft' && !state.quizActive) {
        stepPref(-1);
      }
    });
  }

  function boot() {
    const params = new URLSearchParams(window.location.search);
    const m = params.get('mode');
    if (m === 'gdp' || m === 'population' || m === 'diorama') {
      state.mode = m;
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
    }
    if (params.get('fossa') === '1') {
      state.showFossa = true;
      document.getElementById('toggleFossa').checked = true;
    }
    if (params.get('belt') === '1') {
      state.showBelt = true;
      document.getElementById('toggleBelt').checked = true;
    }
    if (params.get('pref') && PREF_MAP.has(params.get('pref'))) {
      state.selectedId = params.get('pref');
    }

    renderBaseShadow();
    renderCompass();
    renderRegionFilter();
    renderAllMapLayers();
    renderDetailCard(state.selectedId);
    resetView();
    initPanZoom();
    initUIEvents();
  }

  boot();
})();
