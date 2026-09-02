/* =========================================================================
   pano-sign.js — the FINALIZED Sunset panorama, exactly as it appears on the
   yard sign / rulebook. Wraps the hand-traced window.SKETCH_PANO (from
   sketch-pano.js, a 1:1 trace of the candidate's sketch in uploads/dsfa.pdf)
   with the approved "short-pier" render recipe + Sunset piece coloring.

   This is the ONE source of truth for the panorama on the website. The old
   procedural skyline in district-art.js is NOT the identity art — do not use
   it for the panorama.

   Requires: window.SKETCH_PANO (load sketch-pano.js first).

   API:
     PanoSign.viewBox            -> "255.5 0 1543.7 166"  (the cropped frame)
     PanoSign.inner({seal})      -> SVG inner markup string (paths/groups)
     PanoSign.css                -> <style> text: .pano piece colors+lineweights
     PanoSign.render(svgEl,opts) -> sets viewBox + innerHTML on an <svg class="pano">
   ========================================================================= */
(function () {
  function build(opts) {
    opts = opts || {};
    var withSeal = opts.seal !== false;
    var P = window.SKETCH_PANO;
    if (!P) { console.error('pano-sign.js: window.SKETCH_PANO missing — load sketch-pano.js first'); return { viewBox: '0 0 1880 166', inner: '' }; }

    var pg = (P.present.match(/<path data-piece="pier_ground"[^>]*\/>/) || [''])[0];
    var SHORE = 717.2;
    var pgWater = '<path data-piece="pier_deck_water" d="M' + SHORE + ' 95.9L350.9 95.9"/>';
    var pgLand  = '<path data-piece="pier_ground" d="M1812 95.9L' + SHORE + ' 95.9"/>';
    var INNER = P.present.replace(pg, '') + P.history + pgWater + pgLand;

    function toPoly(d) {
      var segs = d.split('M').filter(Boolean), pts = [];
      segs.forEach(function (s, i) { var lr = s.split('L'); if (i === 0) pts.push(lr[0].trim()); pts.push(lr[1].trim()); });
      return 'M' + pts[0] + 'L' + pts.slice(1).join('L') + 'Z';
    }
    function trimLeft(d, minX) {
      var toks = d.split(/(?=[ML])/), pts = [];
      toks.forEach(function (t) { var n = t.slice(1).trim().split(/\s+/).map(Number); if (n.length >= 2 && n[0] >= minX) pts.push(n); });
      if (!pts.length) return d;
      var o = 'M' + pts[0][0] + ' ' + pts[0][1];
      for (var i = 1; i < pts.length; i++) o += 'L' + pts[i][0] + ' ' + pts[i][1];
      return o;
    }

    // close the three building outlines into clean silhouettes
    ['100_block', '200_block', '300_block'].forEach(function (nm) {
      var pc = P.pieces.find(function (p) { return p.name === nm; });
      if (pc) INNER = INNER.replace(new RegExp('(data-piece="' + nm + '" d=")[^"]*"'), '$1' + toPoly(pc.d) + '"');
    });
    // nudge the buildings + Red Car left
    ['100_block', '200_block', '300_block'].forEach(function (nm) {
      INNER = INNER.replace('data-piece="' + nm + '"', 'data-piece="' + nm + '" transform="translate(-40 0)"');
    });
    INNER = INNER.replace('data-piece="redcar"', 'data-piece="redcar" transform="translate(-45 0)"');
    // center + slightly enlarge the lifeguard tower over the pier
    INNER = INNER.replace('<path data-piece="lifeguard_tower"', '<path data-piece="lifeguard_tower" transform="matrix(1.075 0 0 1.075 98.889 -7.1925)"');

    // pedestrian on Main Street, riderless bike on the promenade
    INNER +=
      '<g data-piece="pedestrian" transform="matrix(0.8 0 0 0.8 310.4 19.18)">'
      + '<circle cx="1762" cy="73.5" r="2.1"/>'
      + '<path d="M1760 76.6 C1759 77 1759.2 79 1759.2 80.5 L1759.5 87 L1759.2 95.9 L1761.2 95.9 L1762 90 L1762.8 95.9 L1764.8 95.9 L1764.5 87 L1764.8 80.5 C1764.8 79 1765 77 1764 76.6 Q1762 75.6 1760 76.6 Z"/>'
      + '</g>'
      + '<g data-piece="cyclist" transform="matrix(0.58 0 0 0.58 1301.3 40.278)">'
      + '<circle cx="757" cy="89.9" r="6"/>'
      + '<circle cx="777" cy="89.9" r="6"/>'
      + '<path d="M757 89.9 L766 89.9 M772 79.5 L777 89.9 M766 89.9 L772 79.5 M772 79.5 L770.5 76.4 M765.5 76.4 L770.5 76.4"/>'
      + '</g>';

    if (withSeal) {
      INNER +=
        '<g data-piece="seal" transform="translate(543 106) scale(0.029)"><path d="M790 485 C700 472 458 468 178 477 C88 480 28 490 16 500 C9 505 9 515 20 519 C90 526 322 524 562 516 C682 512 742 505 790 491 C795 489 795 487 790 485 Z" style="fill:var(--m-red);stroke:none"/><g transform="translate(58 14)"><path d="M517.0 0.0L536.0 1.0L549.0 4.0L566.0 11.0L579.0 20.0L592.0 24.0L622.0 24.0L634.0 27.0L644.0 35.0L649.0 45.0L650.0 59.0L647.0 70.0L640.0 86.0L631.0 99.0L614.0 115.0L594.0 126.0L586.0 128.0L582.0 132.0L582.0 145.0L589.0 173.0L596.0 213.0L597.0 263.0L592.0 294.0L583.0 322.0L572.0 346.0L561.0 362.0L560.0 367.0L575.0 395.0L596.0 418.0L608.0 427.0L629.0 438.0L659.0 447.0L667.0 453.0L669.0 463.0L667.0 469.0L662.0 474.0L656.0 476.0L591.0 476.0L571.0 474.0L550.0 469.0L564.0 481.0L567.0 487.0L566.0 496.0L560.0 503.0L555.0 505.0L488.0 505.0L465.0 501.0L445.0 493.0L428.0 482.0L420.0 473.0L418.0 473.0L418.0 471.0L407.0 459.0L391.0 461.0L152.0 461.0L152.0 463.0L187.0 497.0L188.0 510.0L183.0 517.0L178.0 519.0L142.0 519.0L101.0 512.0L72.0 502.0L48.0 490.0L28.0 477.0L13.0 464.0L4.0 450.0L0.0 436.0L0.0 417.0L2.0 409.0L12.0 391.0L68.0 339.0L111.0 309.0L147.0 291.0L182.0 280.0L184.0 278.0L210.0 272.0L283.0 260.0L303.0 254.0L329.0 242.0L352.0 226.0L373.0 205.0L390.0 180.0L400.0 159.0L403.0 147.0L407.0 140.0L438.0 54.0L448.0 37.0L463.0 21.0L476.0 12.0L495.0 4.0L508.0 1.0L517.0 1.0Z" style="fill:var(--cream);stroke:none"/><path fill-rule="evenodd" d="M517.0 0.0L536.0 1.0L549.0 4.0L566.0 11.0L579.0 20.0L592.0 24.0L622.0 24.0L634.0 27.0L644.0 35.0L649.0 45.0L650.0 59.0L647.0 70.0L640.0 86.0L631.0 99.0L614.0 115.0L594.0 126.0L586.0 128.0L582.0 132.0L582.0 145.0L589.0 173.0L596.0 213.0L597.0 263.0L592.0 294.0L583.0 322.0L572.0 346.0L561.0 362.0L560.0 367.0L575.0 395.0L596.0 418.0L608.0 427.0L629.0 438.0L659.0 447.0L667.0 453.0L669.0 463.0L667.0 469.0L662.0 474.0L656.0 476.0L591.0 476.0L571.0 474.0L550.0 469.0L564.0 481.0L567.0 487.0L566.0 496.0L560.0 503.0L555.0 505.0L488.0 505.0L465.0 501.0L445.0 493.0L428.0 482.0L420.0 473.0L418.0 473.0L418.0 471.0L407.0 459.0L391.0 461.0L152.0 461.0L152.0 463.0L187.0 497.0L188.0 510.0L183.0 517.0L178.0 519.0L142.0 519.0L101.0 512.0L72.0 502.0L48.0 490.0L28.0 477.0L13.0 464.0L4.0 450.0L0.0 436.0L0.0 417.0L2.0 409.0L12.0 391.0L68.0 339.0L111.0 309.0L147.0 291.0L182.0 280.0L184.0 278.0L210.0 272.0L283.0 260.0L303.0 254.0L329.0 242.0L352.0 226.0L373.0 205.0L390.0 180.0L400.0 159.0L403.0 147.0L407.0 140.0L438.0 54.0L448.0 37.0L463.0 21.0L476.0 12.0L495.0 4.0L508.0 1.0L517.0 1.0ZM518.0 29.0L502.0 32.0L489.0 38.0L470.0 56.0L462.0 72.0L460.0 81.0L456.0 88.0L421.0 183.0L401.0 216.0L397.0 219.0L393.0 226.0L367.0 251.0L338.0 270.0L305.0 284.0L285.0 289.0L207.0 302.0L167.0 314.0L144.0 324.0L117.0 339.0L109.0 346.0L98.0 352.0L33.0 411.0L29.0 419.0L29.0 434.0L33.0 443.0L43.0 452.0L60.0 463.0L83.0 474.0L130.0 486.0L134.0 485.0L109.0 461.0L109.0 459.0L104.0 456.0L102.0 452.0L102.0 441.0L110.0 433.0L381.0 432.0L372.0 424.0L354.0 415.0L350.0 410.0L350.0 396.0L358.0 389.0L371.0 390.0L373.0 393.0L381.0 396.0L401.0 410.0L424.0 433.0L437.0 451.0L454.0 465.0L480.0 475.0L517.0 476.0L517.0 474.0L500.0 457.0L493.0 446.0L478.0 429.0L460.0 391.0L451.0 365.0L451.0 354.0L453.0 350.0L460.0 345.0L470.0 345.0L474.0 347.0L479.0 354.0L489.0 386.0L494.0 393.0L508.0 380.0L510.0 380.0L516.0 372.0L518.0 372.0L518.0 370.0L532.0 355.0L545.0 335.0L556.0 312.0L562.0 294.0L567.0 271.0L569.0 251.0L566.0 207.0L553.0 146.0L554.0 125.0L561.0 112.0L567.0 106.0L595.0 93.0L610.0 79.0L617.0 68.0L621.0 56.0L620.0 53.0L584.0 52.0L569.0 47.0L545.0 33.0L528.0 29.0L519.0 29.0ZM533.0 54.0L543.0 54.0L547.0 56.0L552.0 64.0L552.0 72.0L547.0 80.0L543.0 82.0L530.0 81.0L524.0 74.0L523.0 66.0L525.0 60.0L529.0 56.0L533.0 55.0ZM540.0 390.0L521.0 409.0L509.0 417.0L509.0 419.0L513.0 420.0L524.0 428.0L547.0 438.0L567.0 443.0L585.0 445.0L558.0 419.0L540.0 391.0Z" style="fill:var(--m-people);stroke:none"/></g></g>';
    }

    // SHORT PIER: drop the 3 seaward bays, remove the Scintillator, trim the ocean overhang
    INNER = INNER.replace('M54.8 95.9L54.8 142.4M104.2 95.9L104.2 141.5M153.5 95.9L153.5 141.5M202.9 95.9L202.9 139.0M252.2 95.9L252.2 141.2M301.5 95.9L301.5 137.2', '');
    INNER = INNER.replace('M104.2 95.9L54.8 111.9M104.2 111.9L54.8 95.9M153.5 95.9L104.2 111.9M153.5 111.9L104.2 95.9M252.2 95.9L202.9 111.9M252.2 111.9L202.9 95.9M350.9 95.9L301.5 111.9M350.9 111.9L301.5 95.9', '');
    INNER = INNER.replace(/<g class="hist-piece" data-egg="scint"[\s\S]*?<\/g>/, '');
    var oc = P.pieces.find(function (p) { return p.name === 'ocean'; });
    if (oc) INNER = INNER.replace(/(data-piece="ocean" d=")[^"]*"/, '$1' + trimLeft(oc.d, 240) + '"');

    // z-order: ocean & beach in front of pier posts; deck, ground, seal on top
    var oe = (INNER.match(/<path data-piece="ocean"[^>]*\/>/) || [''])[0];
    var be = (INNER.match(/<path data-piece="beach"[^>]*\/>/) || [''])[0];
    if (oe && be) INNER = INNER.replace(oe, '').replace(be, '') + oe + be;
    var de = (INNER.match(/<path data-piece="pier_deck_water"[^>]*\/>/) || [''])[0];
    if (de) INNER = INNER.replace(de, '') + de;
    var ge = (INNER.match(/<path data-piece="pier_ground"[^>]*\/>/) || [''])[0];
    if (ge) INNER = INNER.replace(ge, '') + ge;
    // seal group has a NESTED <g>, so match through its final </g></g> (not the first one)
    var se = (INNER.match(/<g data-piece="seal"[\s\S]*?<\/g><\/g>/) || [''])[0];
    if (se) INNER = INNER.replace(se, '') + se;

    INNER += '<g data-piece="bldg_detail" transform="translate(-40 0)"><path d="M827.1 54 L892.3 54 M827.1 54 L827.1 66 M892.3 54 L892.3 66 M827.1 66 L892.3 66 M828.1 95.9 L828.1 69 L836.1 69 L836.1 95.9 M839.1 90.5 L839.1 69 L891.3 69 L891.3 90.5 M839.1 90.5 L891.3 90.5 M838.1 33.8 L843.1 33.8 L843.1 45.8 L838.1 45.8 Z M857.2 33.8 L862.2 33.8 L862.2 45.8 L857.2 45.8 Z M876.3 33.8 L881.3 33.8 L881.3 45.8 L876.3 45.8 Z M945 95.9 L945 70 L953 70 L953 95.9 M903.3 91.7 L903.3 70 L942 70 L942 91.7 L903.3 91.7 M922.7 91.7 L922.7 70 M903.3 91.7 L942 91.7 M914.7 48.3 L919.7 48.3 L919.7 56.6 L914.7 56.6 Z M936.6 48.3 L941.6 48.3 L941.6 56.6 L936.6 56.6 Z M966 60 L1025 60 M964 66 L1027 66 M964 66 L966 60 M1027 66 L1025 60 M1018 95.9 L1018 69 L1026 69 L1026 95.9 M965 91.1 L965 69 L1015 69 L1015 91.1 M965 91.1 L1015 91.1 M974.7 38 L979.7 38 L979.7 47.1 L974.7 47.1 Z M993 38 L998 38 L998 47.1 L993 47.1 Z M1011.3 38 L1016.3 38 L1016.3 47.1 L1011.3 47.1 Z M1056.9 95.9 L1056.9 70 L1064.9 70 L1064.9 95.9 M1038 92.1 L1038 70 L1053.9 70 L1053.9 92.1 L1038 92.1 M1067.9 92.1 L1067.9 70 L1083.7 70 L1083.7 92.1 L1067.9 92.1 M1038 92.1 L1053.9 92.1 M1067.9 92.1 L1083.7 92.1"/><path d="M1142.3 95.9 L1142.3 68 L1150.3 68 L1150.3 95.9 M1153.3 90.5 L1153.3 68 L1191.6 68 L1191.6 90.5 L1153.3 90.5 M1172.4 90.5 L1172.4 68 M1153.3 90.5 L1191.6 90.5 M1202.6 54 L1267.9 54 M1202.6 54 L1202.6 66 M1267.9 54 L1267.9 66 M1202.6 66 L1267.9 66 M1258.9 95.9 L1258.9 69 L1266.9 69 L1266.9 95.9 M1203.6 91.7 L1203.6 69 L1255.9 69 L1255.9 91.7 M1203.6 91.7 L1255.9 91.7 M1218.4 36 L1223.4 36 L1223.4 50 L1218.4 50 Z M1247.1 36 L1252.1 36 L1252.1 50 L1247.1 50 Z M1316.5 95.9 L1316.5 69 L1324.5 69 L1324.5 95.9 M1278.9 91.1 L1278.9 69 L1313.5 69 L1313.5 91.1 L1278.9 91.1 M1296.2 91.1 L1296.2 69 M1278.9 91.1 L1313.5 91.1 M1337.5 61 L1398.8 61 M1335.5 67 L1400.8 67 M1335.5 67 L1337.5 61 M1400.8 67 L1398.8 61 M1364.2 95.9 L1364.2 70 L1372.2 70 L1372.2 95.9 M1336.5 92.1 L1336.5 70 L1361.2 70 L1361.2 92.1 M1375.2 92.1 L1375.2 70 L1399.8 70 L1399.8 92.1 M1336.5 92.1 L1361.2 92.1 M1375.2 92.1 L1399.8 92.1 M1351.3 42.9 L1356.3 42.9 L1356.3 53.4 L1351.3 53.4 Z M1380 42.9 L1385 42.9 L1385 53.4 L1380 53.4 Z"/><path d="M1480.2 53 L1552.5 53 M1480.2 53 L1480.2 65 M1552.5 53 L1552.5 65 M1480.2 65 L1552.5 65 M1481.2 95.9 L1481.2 68 L1489.2 68 L1489.2 95.9 M1492.2 90.5 L1492.2 68 L1551.5 68 L1551.5 90.5 M1492.2 90.5 L1551.5 90.5 M1492.4 32.8 L1497.4 32.8 L1497.4 44 L1492.4 44 Z M1513.9 32.8 L1518.9 32.8 L1518.9 44 L1513.9 44 Z M1535.3 32.8 L1540.3 32.8 L1540.3 44 L1535.3 44 Z M1604.6 95.9 L1604.6 70 L1612.6 70 L1612.6 95.9 M1563.5 91.7 L1563.5 70 L1601.6 70 L1601.6 91.7 L1563.5 91.7 M1582.6 91.7 L1582.6 70 M1563.5 91.7 L1601.6 91.7 M1574.8 52.7 L1579.8 52.7 L1579.8 59.4 L1574.8 59.4 Z M1596.3 52.7 L1601.3 52.7 L1601.3 59.4 L1596.3 59.4 Z M1625.6 61 L1672.6 61 M1623.6 67 L1674.6 67 M1623.6 67 L1625.6 61 M1674.6 67 L1672.6 61 M1665.6 95.9 L1665.6 70 L1673.6 70 L1673.6 95.9 M1624.6 91.1 L1624.6 70 L1662.6 70 L1662.6 91.1 M1624.6 91.1 L1662.6 91.1 M1632.3 40.5 L1637.3 40.5 L1637.3 48.9 L1632.3 48.9 Z M1646.6 40.5 L1651.6 40.5 L1651.6 48.9 L1646.6 48.9 Z M1660.9 40.5 L1665.9 40.5 L1665.9 48.9 L1660.9 48.9 Z M1708.2 95.9 L1708.2 70 L1716.2 70 L1716.2 95.9 M1685.6 92.1 L1685.6 70 L1705.2 70 L1705.2 92.1 L1685.6 92.1 M1719.2 92.1 L1719.2 70 L1738.7 70 L1738.7 92.1 L1719.2 92.1 M1685.6 92.1 L1705.2 92.1 M1719.2 92.1 L1738.7 92.1 M1697.9 55.3 L1702.9 55.3 L1702.9 61.4 L1697.9 61.4 Z M1721.4 55.3 L1726.4 55.3 L1726.4 61.4 L1721.4 61.4 Z"/></g>';

    // ---- Vary the upper-floor windows building-by-building (were all identical squares) ----
    (function () {
      function f(n) { return Math.round(n * 100) / 100; }
      // style assigned per window x-origin so each building reads differently
      var styleByX = {
        '838.1': 'arch', '857.2': 'arch', '876.3': 'arch',          // 100-A round-arched
        '914.7': 'mullion', '936.6': 'mullion',                     // 100-B center mullion
        '974.7': 'cross', '993': 'cross', '1011.3': 'cross',        // 100-C four-pane
        '1218.4': 'transom', '1247.1': 'transom',                   // 200-D transom bar
        '1351.3': 'arch', '1380': 'arch',                           // 200-E round-arched
        '1492.4': 'hung', '1513.9': 'hung', '1535.3': 'hung',       // 300-F double-hung
        '1574.8': 'mullion', '1596.3': 'mullion',                   // 300-G center mullion
        '1632.3': 'cross', '1646.6': 'cross', '1660.9': 'cross',    // 300-H four-pane
        '1697.9': 'transom', '1721.4': 'transom'                    // 300-I transom bar
      };
      function win(st, x, y, w, h) {
        var r = w / 2, cx = x + w / 2;
        var rect = 'M' + f(x) + ' ' + f(y) + ' L' + f(x + w) + ' ' + f(y) + ' L' + f(x + w) + ' ' + f(y + h) + ' L' + f(x) + ' ' + f(y + h) + ' Z';
        // interior mullion/transom/cross lines removed per review — variety now reads only from the window OUTLINE (arched vs square)
        if (st === 'arch') return 'M' + f(x) + ' ' + f(y + h) + ' L' + f(x) + ' ' + f(y + r) + ' A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(x + w) + ' ' + f(y + r) + ' L' + f(x + w) + ' ' + f(y + h) + ' Z';
        return rect;
      }
      INNER = INNER.replace(/M([\d.]+) ([\d.]+) L([\d.]+) \2 L\3 ([\d.]+) L\1 \4 Z/g, function (m, x1, y1, x2, y2) {
        var st = styleByX[x1]; if (!st) return m;
        return win(st, +x1, +y1, +x2 - +x1, +y2 - +y1);
      });
    })();

    // pier railings drawn to the MOST BACKGROUND so the tower (and deck) overlap the vertical baluster lines
    INNER = '<path data-piece="pier_rail" d="M509.5 89 L717.2 89 M509.5 92.5 L717.2 92.5 M509.5 95.9 L509.5 89 M525.5 95.9 L525.5 89 M541.5 95.9 L541.5 89 M557.4 95.9 L557.4 89 M573.4 95.9 L573.4 89 M589.4 95.9 L589.4 89 M605.4 95.9 L605.4 89 M621.3 95.9 L621.3 89 M637.3 95.9 L637.3 89 M653.3 95.9 L653.3 89 M669.3 95.9 L669.3 89 M685.2 95.9 L685.2 89 M701.2 95.9 L701.2 89 M717.2 95.9 L717.2 89"/>' + INNER;
    // Acorn street lantern, drawn as engraved line-art (built from structure, not pixel-matched):
    // pointed finial · bell/acorn glass (wide domed shoulder near top, tapering to a narrow neck)
    // · dark fitter cup · tapered post with a collar knuckle.
    var lamp = function(x){
      var r=function(n){return Math.round(n*10)/10;};
      var post='M'+x+' 78 L'+x+' 89';
      // dark fitter cup: concave arc sides tangent to the vertical post
      var cap='M'+r(x-0.7)+' 76.4 L'+r(x+0.7)+' 76.4'
        +' C'+r(x+0.62)+' 77.05 '+r(x+0.22)+' 77.35 '+r(x+0.22)+' 78'
        +' L'+r(x-0.22)+' 78'
        +' C'+r(x-0.22)+' 77.35 '+r(x-0.62)+' 77.05 '+r(x-0.7)+' 76.4 Z';
      // frosted glass: peaked apex, broad shoulders, tapering to a narrow neck
      var globe='M'+r(x-0.42)+' 76.4 C'+r(x-0.98)+' 75.95 '+r(x-1.74)+' 74.75 '+r(x-1.95)+' 73.4'
        +' C'+r(x-1.98)+' 72.8 '+r(x-0.6)+' 72.05 '+x+' 71.85'
        +' C'+r(x+0.6)+' 72.05 '+r(x+1.98)+' 72.8 '+r(x+1.95)+' 73.4'
        +' C'+r(x+1.74)+' 74.75 '+r(x+0.98)+' 75.95 '+r(x+0.42)+' 76.4 Z';
      return '<g data-piece="pier_lamp"><path class="lpost" d="'+post+'"/><path class="lcap" d="'+cap+'"/><path class="lglobe" d="'+globe+'"/></g>';
    };
    INNER = lamp(557.4)+lamp(605.4)+lamp(653.3)+lamp(701.2) + INNER;
    INNER = '<path data-piece="pier_rail" d="M350.9 89 L488.7 89 M350.9 92.5 L488.7 92.5 M350.9 95.9 L350.9 89 M368.1 95.9 L368.1 89 M385.3 95.9 L385.3 89 M402.6 95.9 L402.6 89 M419.8 95.9 L419.8 89 M437 95.9 L437 89 M454.3 95.9 L454.3 89 M471.5 95.9 L471.5 89 M488.7 95.9 L488.7 89"/>' + INNER;
    INNER = lamp(385.3)+lamp(454.3) + INNER;

    // ---- Main Street ficus trees: O'Malley's-style street trees in front of the storefronts ----
    (function () {
      function f(n) { return Math.round(n * 100) / 100; }
      function ribbon(p0, c, p1, wA, wB) {
        var K = 10, L = [], R = [];
        for (var i = 0; i <= K; i++) {
          var t = i / K, mt = 1 - t;
          var x = mt * mt * p0[0] + 2 * mt * t * c[0] + t * t * p1[0];
          var y = mt * mt * p0[1] + 2 * mt * t * c[1] + t * t * p1[1];
          var dx = 2 * mt * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]);
          var dy = 2 * mt * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1]);
          var ln = Math.hypot(dx, dy) || 1; dx /= ln; dy /= ln;
          var w = wA + (wB - wA) * t;
          L.push([x - dy * w, y + dx * w]); R.push([x + dy * w, y - dx * w]);
        }
        var d = 'M' + f(L[0][0]) + ' ' + f(L[0][1]);
        for (var i = 1; i <= K; i++) d += ' L' + f(L[i][0]) + ' ' + f(L[i][1]);
        for (var i = K; i >= 0; i--) d += ' L' + f(R[i][0]) + ' ' + f(R[i][1]);
        return d + ' Z';
      }
      function ficus(v) {
        var cx = 50, ribs = [];
        function branch(x, y, ang, len, depth, wA) {
          var x2 = x + Math.sin(ang) * len, y2 = y - Math.cos(ang) * len;
          var mx = x + Math.sin(ang) * len * 0.5 + Math.sin(ang) * 1.2, my = y - Math.cos(ang) * len * 0.5;
          var wB = wA * 0.66;
          ribs.push(ribbon([x, y], [mx, my], [x2, y2], wA, wB));
          if (depth > 0) { var s = 16 * Math.PI / 180; branch(x2, y2, ang - s, len * 0.72, depth - 1, wB); branch(x2, y2, ang + s, len * 0.72, depth - 1, wB); }
        }
        v.limbs.forEach(function (a) { branch(cx, v.forkY, a * Math.PI / 180, v.len, 1, v.w); });
        var branches = ribs.join(' ');
        var cyc = v.apex + v.ry, ctrl = [];
        for (var i = 0; i < v.lobes; i++) {
          var a = -Math.PI / 2 + i / v.lobes * 2 * Math.PI;
          var r = 1 + 0.12 * Math.sin(i * 1.9 + (v.seed || 0));
          ctrl.push([cx + Math.cos(a) * v.rx * r, cyc + Math.sin(a) * v.ry * r]);
        }
        var canopy = '';
        for (var i = 0; i < v.lobes; i++) {
          var c2 = ctrl[(i + 1) % v.lobes], c3 = ctrl[(i + 2) % v.lobes];
          var m0 = [(ctrl[i][0] + c2[0]) / 2, (ctrl[i][1] + c2[1]) / 2];
          var m1 = [(c2[0] + c3[0]) / 2, (c2[1] + c3[1]) / 2];
          if (i === 0) canopy = 'M' + f(m0[0]) + ' ' + f(m0[1]);
          canopy += ' Q' + f(c2[0]) + ' ' + f(c2[1]) + ' ' + f(m1[0]) + ' ' + f(m1[1]);
        }
        canopy += ' Z';
        var bw = v.baseW, fw = v.forkW, fy = v.forkY, mid = (96 + fy) / 2;
        var trunk = 'M' + f(cx - bw) + ' 96 Q' + f(cx - bw * 0.9) + ' ' + f(mid) + ' ' + f(cx - fw) + ' ' + f(fy)
          + ' L' + f(cx + fw) + ' ' + f(fy) + ' Q' + f(cx + bw * 0.9) + ' ' + f(mid) + ' ' + f(cx + bw) + ' 96 Z';
        return '<path data-piece="tree_canopy" d="' + canopy + '"/>'
          + '<path data-piece="tree_trunk" style="fill:var(--m-wood);stroke:none" d="' + trunk + '"/>'
          + '<path data-piece="tree_branch" style="fill:var(--m-wood);stroke:none" d="' + branches + '"/>';
      }
      var VARIANTS = {
        A: { lobes: 13, rx: 27, ry: 24, apex: 16, forkY: 70, limbs: [-32, -11, 11, 32], len: 17, w: 1.45, baseW: 1.9, forkW: 1.4, seed: 0 },
        B: { lobes: 12, rx: 22, ry: 28, apex: 12, forkY: 64, limbs: [-24, -8, 8, 24], len: 18, w: 1.4, baseW: 1.8, forkW: 1.3, seed: 1.3 },
        C: { lobes: 15, rx: 31, ry: 19, apex: 22, forkY: 73, limbs: [-38, -13, 13, 38], len: 16, w: 1.5, baseW: 2.0, forkW: 1.45, seed: 2.1 }
      };
      var cache = {};
      function tree(nm) { return cache[nm] || (cache[nm] = ficus(VARIANTS[nm])); }
      // Two ficus per block, scattered within each block's perimeter (canopy
      // half-width ~48*scale). Explicit so the hero, share card and yard sign all
      // render the SAME placement. [groundX, scale, variant]. Blocks (groundline
      // x): 100=822-1090, 200=1136-1406, 300=1475-1745.
      var placed = [
        [858, 1.132, 'B'],      // 100 block — nudged left
        [963, 1.189, 'A'],      // 100 block — nudged left
        [1300, 1.02, 'A'],      // 200 block — enlarged, nudged left
        [1203.17, 1.26, 'C'],   // 200 block — enlarged
        [1532, 1.16, 'C'],      // 300 block — enlarged, centered on leftmost shop
        [1685, 1.065, 'B']      // 300 block — nudged right, then slightly back left
      ];
      placed.forEach(function (t) {
        var gx = t[0], s = t[1];
        INNER += '<g data-piece="tree" transform="translate(' + f(gx - 50 * s) + ' ' + f(95.9 - 96 * s) + ') scale(' + s + ')">' + tree(t[2]) + '</g>';
      });
    })();

    // FOREGROUND the street groundline: re-extract pier_ground and append it last
    // so it overlaps every other line (trunks, rails, building bases sit behind it).
    var gf = (INNER.match(/<path data-piece="pier_ground"[^>]*\/>/) || [''])[0];
    if (gf) INNER = INNER.replace(gf, '') + gf;

    return { viewBox: '255.5 0 1543.7 166', inner: INNER };
  }

  // (pier_ground foregrounding handled inside build, just before return)

  var CSS =
    '.pano path{fill:none;stroke:var(--m-line);stroke-linejoin:round;stroke-linecap:round;stroke-width:1.4;}'
    + '.pano circle{fill:none;stroke:var(--m-people);stroke-width:0.8;}'
    + '.pano [data-piece="pier_ground"]{stroke:var(--m-ground);stroke-width:3.8;}'
    + '.pano [data-piece="pier_deck_water"]{stroke:var(--m-wood);stroke-width:3.8;}'
    + '.pano [data-piece="piers"]{stroke:var(--m-wood);stroke-width:1.7;}'
    + '.pano [data-piece="pier_rail"]{stroke:var(--m-wood);stroke-width:1.1;}'
    + '.pano [data-piece="pier_bracing"]{stroke:var(--m-wood);stroke-width:0.95;}'
    + '.pano [data-piece="ocean"]{stroke:var(--m-water);stroke-width:3.2;}'
    + '.pano [data-piece="beach"]{stroke:var(--m-beach);stroke-width:3.2;}'
    + '.pano [data-piece$="_block"]{fill:none;stroke:var(--m-line);stroke-width:2.7;}'
    + '.pano [data-piece="lifeguard_tower"]{stroke:var(--m-tower);stroke-width:2.2;}'
    + '.pano .hist-piece path{stroke:var(--m-ghost);stroke-width:0.8;}'
    + '.pano [data-piece="redcar"] path{stroke:var(--m-red);stroke-width:1.3;}'
    + '.pano [data-piece="redcar"] circle{stroke:var(--m-red);stroke-width:1.3;fill:none;}'
    + '.pano [data-piece="cyclist"],.pano [data-piece="cyclist"] path{stroke:var(--m-people);stroke-width:0.8;fill:none;}'
    + '.pano [data-piece="pedestrian"],.pano [data-piece="pedestrian"] path,.pano [data-piece="pedestrian"] circle{fill:var(--m-people);stroke:none;}'
    + '.pano [data-piece="cyclist"],.pano [data-piece="cyclist"] path{stroke-width:1.1;}'
    + '.pano [data-piece="cyclist"] circle{stroke:var(--m-people);}'
    + '.pano [data-piece="bldg_detail"] path{fill:none;stroke:var(--m-line);stroke-width:1.2;}'
    + '.pano [data-piece="pier_lamp"] .lpost{stroke:var(--m-pole,#2e3b34);stroke-width:1.0;}'
    + '.pano [data-piece="pier_lamp"] .lcollar{stroke:var(--m-pole,#2e3b34);stroke-width:1.2;}'
    + '.pano [data-piece="pier_lamp"] .lcap{fill:var(--m-pole,#2e3b34);stroke:none;}'
    + '.pano [data-piece="pier_lamp"] .lglobe{fill:var(--m-globe,#d3dee7);stroke:var(--m-pole,#2e3b34);stroke-width:0.6;}'
    + '.pano [data-piece="pier_lamp"] .lfacet{stroke:var(--m-pole,#2e3b34);stroke-width:0.4;fill:none;opacity:0.4;}'
    + '.pano [data-piece="tree_canopy"]{stroke:var(--m-tree,#6f8a5c);stroke-width:1.3;}'
    + '.pano [data-piece="tree_trunk"]{stroke:var(--m-wood);stroke-width:1.6;}'
    + '.pano [data-piece="tree_branch"]{stroke:var(--m-wood);stroke-width:1.4;}'
    + '.pano [data-piece="seal"]{stroke:none;}'
    + '.pano .fl{display:none;}';

  window.PanoSign = {
    get viewBox() { return '255.5 0 1543.7 166'; },
    css: CSS,
    inner: function (opts) { return build(opts).inner; },
    build: build,
    render: function (svgEl, opts) {
      if (!svgEl) return;
      var b = build(opts);
      svgEl.setAttribute('viewBox', b.viewBox);
      svgEl.classList.add('pano');
      svgEl.innerHTML = b.inner;
      return b;
    }
  };
})();
