var UFOGlyf;
(function (UFOGlyf) {
    var SVGUtil = (function () {
        function SVGUtil() {
        }
        SVGUtil.Run = function (orig) {
            var distancePerPoint = 2;
            var drawFPS = 60 * 4;
            var timer;
            var length = 0;
            var pathLength = orig.getTotalLength();
            var repeat = true;
            timer = setInterval(function () {
                length += distancePerPoint;
                orig.style.strokeDasharray = [length, pathLength].join(' ');
                if (length >= pathLength) {
                    length = 0;
                    if (!repeat) {
                        clearInterval(timer);
                    }
                }
            }, 1000 / drawFPS);
        };
        return SVGUtil;
    }());
    UFOGlyf.SVGUtil = SVGUtil;
    var Convert = (function () {
        function Convert() {
        }
        Convert.BuildSVG = function (glyph) {
            var svg = "";
            var path = "";
            var points = "";
            var polygon = "";
            var MaxP = {
                _x: 0,
                _y: 0
            };
            var MinP = {
                _x: 0,
                _y: 0
            };
            var outline = glyph.outline;
            if (outline != null && outline.contour != null) {
                if (outline.contour.length == null) {
                    //Single Contour is available.
                    outline.contour = [outline.contour];
                }
                for (var index in outline.contour) {
                    var contour = outline.contour[index];
                    path = path + Convert.ToContourPath(contour);
                }
                for (var index in outline.contour) {
                    var contour = outline.contour[index];
                    points = points + Convert.ListContourPoints(contour);
                }
                for (var index in outline.contour) {
                    var contour = outline.contour[index];
                    polygon = polygon + Convert.PolygonContourPoints(contour);
                }
                MaxP = Convert.MaxPoint(outline);
                MinP = Convert.MinPoint(outline);
            }
            var w_max = Math.ceil(MaxP._x / 100.0) * 100;
            var h_max = Math.ceil(MaxP._y / 100.0) * 100;
            var w_min = Math.floor(MinP._x / 100.0) * 100;
            var h_min = Math.floor(MinP._y / 100.0) * 100;
            var w = w_max - w_min;
            var h = h_max - h_min;
            var vx1 = w_min;
            var vy1 = Math.min(h_min, -1 * h_max);
            var vx2 = w;
            var vy2 = h;
            var adv_w = (glyph.advance != null && glyph.advance._width != null) ? glyph.advance._width.toString() : "";
            var hex = (glyph.unicode != null && glyph.unicode._hex != null) ? glyph.unicode._hex : "";
            svg = '<svg class="svg" width = "_w" height= "_h"  viewBox= "vx1 vy1 vx2 vy2" version = "1.0" xmlns= "http://www.w3.org/2000/svg"><!--<glyph name="_gn" unicode = "_unicode" horiz-adv-x="_adv_w" />--> <g class="group" transform="scale(1,-1)"> <path class="path" d = "_path"  /> _points _polygon </g> </svg>';
            svg = svg
                .replace(new RegExp("_points", 'g'), points)
                .replace(new RegExp("_polygon", 'g'), polygon)
                .replace(new RegExp("_path", 'g'), path)
                .replace(new RegExp("_adv_w", 'g'), adv_w)
                .replace(new RegExp("_unicode", 'g'), hex)
                .replace(new RegExp("_w", 'g'), w.toString())
                .replace(new RegExp("_h", 'g'), h.toString())
                .replace(new RegExp("vx1", 'g'), vx1.toString())
                .replace(new RegExp("vx2", 'g'), vx2.toString())
                .replace(new RegExp("vy1", 'g'), vy1.toString())
                .replace(new RegExp("vy2", 'g'), vy2.toString());
            return svg;
        };
        Convert.ToContourPath = function (contour) {
            var path = "";
            var lastCurve = "";
            var prev = null;
            var List = [];
            var Groups = [];
            for (var index in contour.point) {
                var point_ = contour.point[index];
                if (point_._type == null || point_._type == "") {
                }
                else {
                    if (prev == null) {
                    }
                    else {
                        //New Curve started Hence add the current list of points to Group
                        //Clear the List
                        var C = {
                            point: []
                        };
                        C.point = List;
                        Groups.push(C);
                        List = [];
                    }
                    //Start a new Group
                    lastCurve = point_._type;
                }
                //Add this point to current group
                List.push(point_);
                prev =
                    {
                        _x: point_._x,
                        _y: point_._y
                    };
            }
            {
                //Process Pending List
                var C = {
                    point: List
                };
                Groups.push(C);
                //
                var C2 = Groups[0];
                var C3 = { point: [C2.point[0]] };
                Groups.push(C3);
            }
            path = Convert.ProcessGroups(Groups);
            return path;
        };
        Convert.ProcessGroups = function (Groups) {
            var s = "";
            var first = true;
            var QCurve = false;
            for (var index in Groups) {
                var C = Groups[index];
                if (C.point.length == 0) {
                    continue;
                }
                var groupType = C.point[0]._type;
                var smooth = C.point[0]._smooth;
                var P0 = C.point[0];
                if (first) {
                    var temp = "M_x _y \r\n";
                    temp = temp.replace(new RegExp("_x", 'g'), P0._x.toString())
                        .replace(new RegExp("_y", 'g'), P0._y.toString());
                    s = temp;
                    if (C.point.length == 1) {
                        first = false;
                        continue;
                    }
                }
                if (C.point.length == 1) {
                    if (groupType == "line") {
                        var temp = "L_x _y \r\n";
                        temp = temp.replace(new RegExp("_x", 'g'), P0._x.toString())
                            .replace(new RegExp("_y", 'g'), P0._y.toString());
                        s = s + temp;
                    }
                    if (groupType == "qcurve" || groupType == "curve") {
                        if (QCurve) {
                            var temp = "_x _y \r\n";
                            temp = temp.replace(new RegExp("_x", 'g'), P0._x.toString())
                                .replace(new RegExp("_y", 'g'), P0._y.toString());
                            s = s + temp;
                            QCurve = false;
                        }
                        else {
                            var temp = "T_x _y \r\n";
                            temp = temp.replace(new RegExp("_x", 'g'), P0._x.toString())
                                .replace(new RegExp("_y", 'g'), P0._y.toString());
                            s = s + temp;
                        }
                    }
                    continue;
                }
                var cnt = 0;
                var Prev = null;
                if (C.point.length >= 2) {
                    for (var index in C.point) {
                        var P = C.point[index];
                        var Mid = null;
                        if (Prev != null) {
                            Mid =
                                {
                                    _x: (parseFloat(Prev._x.toString()) + parseFloat(P._x.toString())) / 2,
                                    _y: (parseFloat(Prev._y.toString()) + parseFloat(P._y.toString())) / 2
                                };
                        }
                        if (first && cnt == 0) {
                            Prev = P;
                            cnt++;
                            first = false;
                            continue;
                        }
                        if (!first && cnt == 0) {
                            if (smooth == "yes") {
                                if (QCurve) {
                                    var temp = "_x _y \r\n";
                                    temp = temp.replace(new RegExp("_x", 'g'), P._x.toString())
                                        .replace(new RegExp("_y", 'g'), P._y.toString());
                                    s = s + temp;
                                    QCurve = false;
                                }
                                else {
                                    var temp = "T_x _y \r\n";
                                    temp = temp.replace(new RegExp("_x", 'g'), P._x.toString())
                                        .replace(new RegExp("_y", 'g'), P._y.toString());
                                    s = s + temp;
                                }
                            }
                            else if (groupType == "line") {
                                var temp = "L_x _y \r\n";
                                temp = temp.replace(new RegExp("_x", 'g'), P._x.toString())
                                    .replace(new RegExp("_y", 'g'), P._y.toString());
                                s = s + temp;
                            }
                            else if (groupType == "qcurve" || groupType == "curve") {
                                if (QCurve) {
                                    var temp = "_x _y \r\n";
                                    temp = temp.replace(new RegExp("_x", 'g'), P._x.toString())
                                        .replace(new RegExp("_y", 'g'), P._y.toString());
                                    s = s + temp;
                                    QCurve = false;
                                }
                                else {
                                    var temp = "T_x _y \r\n";
                                    temp = temp.replace(new RegExp("_x", 'g'), P._x.toString())
                                        .replace(new RegExp("_y", 'g'), P._y.toString());
                                    s = s + temp;
                                }
                            }
                            Prev = P;
                            cnt++;
                            continue;
                        }
                        if (cnt == 1) {
                            var temp = "Q_x _y ";
                            temp = temp.replace(new RegExp("_x", 'g'), P._x.toString())
                                .replace(new RegExp("_y", 'g'), P._y.toString());
                            s = s + temp;
                            QCurve = true;
                        }
                        else if (cnt == 2) {
                            var temp = "_x _y \r\n";
                            temp = temp.replace(new RegExp("_x", 'g'), Mid._x.toString())
                                .replace(new RegExp("_y", 'g'), Mid._y.toString());
                            s = s + temp;
                            QCurve = false;
                        }
                        else {
                            if (QCurve) {
                                var temp = "_x _y \r\n";
                                temp = temp.replace(new RegExp("_x", 'g'), Mid._x.toString())
                                    .replace(new RegExp("_y", 'g'), Mid._y.toString());
                                s = s + temp;
                                QCurve = false;
                            }
                            else {
                                var temp = "T_x _y \r\n";
                                temp = temp.replace(new RegExp("_x", 'g'), Mid._x.toString())
                                    .replace(new RegExp("_y", 'g'), Mid._y.toString());
                                s = s + temp;
                            }
                        }
                        cnt++;
                        Prev = P;
                    }
                }
            }
            s = s + "Z";
            return s;
        };
        Convert.PolygonContourPoints = function (contour) {
            var s = "";
            for (var index in contour.point) {
                var point_ = contour.point[index];
                var temp = "_x,_y ";
                temp = temp
                    .replace(new RegExp("_x", 'g'), point_._x.toString())
                    .replace(new RegExp("_y", 'g'), point_._y.toString());
                s = s + temp;
            }
            {
                var point_ = contour.point[0];
                var temp = "_x,_y ";
                temp = temp
                    .replace(new RegExp("_x", 'g'), point_._x.toString())
                    .replace(new RegExp("_y", 'g'), point_._y.toString());
                s = s + temp;
            }
            var temp = '<polyline points="_points" class="ploygon"  />';
            s = temp
                .replace(new RegExp("_points", 'g'), s);
            s = s + "\r\n";
            return s;
        };
        Convert.ListContourPoints = function (contour) {
            var s = "";
            var first = true;
            for (var index in contour.point) {
                var point_ = contour.point[index];
                var temp = '<circle cx="_cx" cy="_cy" r="5"  type="_type" />';
                temp = temp.replace(new RegExp("_cx", 'g'), point_._x.toString())
                    .replace(new RegExp("_cy", 'g'), point_._y.toString())
                    .replace(new RegExp("_type", 'g'), point_._type == null ? "" : point_._type)
                    .replace(new RegExp("_class", 'g'), first ? " first" : "");
                s = s + temp;
                s = s + "\r\n";
                if (first) {
                    first = false;
                }
            }
            s = '<g class="circle">' + s + "</g>";
            return s;
        };
        Convert.MaxPoint = function (outline) {
            var M = {
                _x: 0,
                _y: 0
            };
            if (outline.contour != null) {
                for (var index in outline.contour) {
                    var C = outline.contour[index];
                    var P = Convert.MaxCountourPoint(C);
                    if (P._x > M._x) {
                        M._x = P._x;
                    }
                    if (P._y > M._y) {
                        M._y = P._y;
                    }
                }
            }
            return M;
        };
        Convert.MinPoint = function (outline) {
            var M = {
                _x: 0,
                _y: 0
            };
            if (outline.contour != null) {
                for (var index in outline.contour) {
                    var C = outline.contour[index];
                    var P = Convert.MinCountourPoint(C);
                    if (P._x < M._x) {
                        M._x = P._x;
                    }
                    if (P._y < M._y) {
                        M._y = P._y;
                    }
                }
            }
            return M;
        };
        Convert.MaxCountourPoint = function (contour) {
            var M = {
                _x: 0,
                _y: 0
            };
            for (var index in contour.point) {
                var P = contour.point[index];
                P._x = parseFloat(P._x.toString());
                P._y = parseFloat(P._y.toString());
                if (P._x > M._x) {
                    M._x = P._x;
                }
                if (P._y > M._y) {
                    M._y = P._y;
                }
            }
            return M;
        };
        Convert.MinCountourPoint = function (contour) {
            var M = {
                _x: 0,
                _y: 0
            };
            for (var index in contour.point) {
                var P = contour.point[index];
                P._x = parseFloat(P._x.toString());
                P._y = parseFloat(P._y.toString());
                if (P._x < M._x) {
                    M._x = P._x;
                }
                if (P._y < M._y) {
                    M._y = P._y;
                }
            }
            return M;
        };
        return Convert;
    }());
    UFOGlyf.Convert = Convert;
    var Worker = (function () {
        function Worker(config) {
            this.init(config);
        }
        Worker.prototype.init = function (config) {
            this.randomList = [];
            if (config != null) {
                this.loadSamples(config.samples);
            }
            this.random();
            this.go(null);
            this.registerEvents();
        };
        Worker.prototype.random = function () {
            var n = Util.random(this.randomList.length);
            Util.setValue("txtInput", this.randomList[n]);
        };
        Worker.prototype.loadSamples = function (samples) {
            if (samples == null) {
                return;
            }
            for (var index in samples) {
                if (samples[index] == null || samples[index].length == 0) {
                    continue;
                }
                this.randomList.push(samples[index]);
            }
        };
        Worker.prototype.dispose = function () {
            this.deRegisterEvents();
            this.randomList = null;
        };
        Worker.prototype.go = function (e) {
            var input = Util.getValue("txtInput");
            var root = new X2JS().xml_str2json(input);
            var glyph = root.glyph;
            var html = Convert.BuildSVG(glyph);
            var table = document.getElementById("table");
            if (table == null) {
                return;
            }
            table.innerHTML = "";
            table.innerHTML = html;
            SVGUtil.Run(table.querySelector("path"));
        };
        Worker.prototype.registerEvents = function () {
            var that = this;
            this.goHandler = function (e) { that.go(e); };
            this.randomHandler = function (e) { that.random(); };
            Util.registerClick("btnGo", that.goHandler);
            Util.registerClick("btnRandom", this.randomHandler);
            var that = this;
            Util.registerEvent(window, "unload", function (e) { that.dispose; });
        };
        Worker.prototype.deRegisterEvents = function () {
            Util.deRegisterClick("btnGo", this.goHandler);
            Util.deRegisterClick("btnRandom", this.randomHandler);
        };
        return Worker;
    }());
    UFOGlyf.Worker = Worker;
})(UFOGlyf || (UFOGlyf = {}));
var _samples = [
    '<?xml version="1.0" encoding="UTF-8"?><glyph name="A" format="1"><advance width="777"/><unicode hex="0041"/><outline><contour><point x="753" y="0" type="line"/><point x="644" y="0" type="line"/><point x="564" y="198" type="line"/><point x="202" y="198" type="line"/><point x="121" y="0" type="line"/><point x="15" y="0" type="line"/><point x="326" y="739" type="line"/><point x="438" y="739" type="line"/></contour><contour><point x="521" y="285" type="line"/><point x="380" y="626" type="line"/><point x="242" y="285" type="line"/></contour></outline></glyph>',
    '<?xml version="1.0" encoding="UTF-8"?><glyph name="U0C1D" format="1"><advance width="1260"/><unicode hex="0C1D"/><outline><contour><point x="431" y="251" type="qcurve" smooth="yes"/><point x="431" y="292"/><point x="401" y="362"/><point x="351" y="413"/><point x="286" y="442"/><point x="249" y="442" type="qcurve" smooth="yes"/><point x="214" y="442"/><point x="148" y="413"/><point x="99" y="362"/><point x="69" y="292"/><point x="69" y="251" type="qcurve" smooth="yes"/><point x="69" y="211"/><point x="100" y="144"/><point x="150" y="96"/><point x="215" y="71"/><point x="249" y="71" type="qcurve" smooth="yes"/><point x="284" y="71"/><point x="349" y="96"/><point x="400" y="144"/><point x="431" y="211"/></contour><contour><point x="156" y="486" type="qcurve"/><point x="132" y="498"/><point x="98" y="547"/><point x="95" y="588" type="qcurve"/><point x="150" y="588" type="line"/><point x="150" y="567"/><point x="164" y="544"/><point x="186" y="533"/><point x="207" y="528"/><point x="222" y="529" type="qcurve" smooth="yes"/><point x="236" y="531"/><point x="255" y="537"/><point x="278" y="548"/><point x="299" y="564"/><point x="310" y="571" type="qcurve" smooth="yes"/><point x="514" y="747" type="line"/><point x="514" y="676" type="line"/><point x="315" y="508"/><point x="304" y="502" type="qcurve"/><point x="341" y="490"/><point x="409" y="445"/><point x="463" y="380"/><point x="496" y="298"/><point x="496" y="251" type="qcurve" smooth="yes"/><point x="496" y="235"/><point x="490" y="188"/><point x="479" y="158" type="qcurve"/><point x="487" y="136"/><point x="515" y="104"/><point x="551" y="81"/><point x="594" y="71"/><point x="616" y="71" type="qcurve" smooth="yes"/><point x="651" y="71"/><point x="700" y="104"/><point x="735" y="157"/><point x="752" y="224"/><point x="752" y="259" type="qcurve" smooth="yes"/><point x="752" y="296"/><point x="729" y="364"/><point x="688" y="417"/><point x="632" y="449"/><point x="597" y="449" type="qcurve"/><point x="619" y="509" type="line"/><point x="665" y="509"/><point x="739" y="467"/><point x="793" y="397"/><point x="822" y="307"/><point x="822" y="259" type="qcurve" smooth="yes"/><point x="822" y="228"/><point x="812" y="181"/><point x="797" y="145" type="qcurve"/><point x="836" y="110"/><point x="882" y="80"/><point x="929" y="71"/><point x="954" y="71" type="qcurve" smooth="yes"/><point x="987" y="71"/><point x="1039" y="104"/><point x="1074" y="158"/><point x="1094" y="225"/><point x="1094" y="259" type="qcurve" smooth="yes"/><point x="1094" y="294"/><point x="1073" y="362"/><point x="1034" y="416"/><point x="979" y="449"/><point x="944" y="449" type="qcurve"/><point x="982" y="511" type="line"/><point x="1026" y="511"/><point x="1093" y="465"/><point x="1138" y="391"/><point x="1162" y="302"/><point x="1162" y="259" type="qcurve" smooth="yes"/><point x="1162" y="210"/><point x="1133" y="116"/><point x="1078" y="44"/><point x="1000" y="0"/><point x="954" y="0" type="qcurve" smooth="yes"/><point x="902" y="-3"/><point x="807" y="42"/><point x="768" y="92" type="qcurve"/><point x="739" y="49"/><point x="662" y="0"/><point x="616" y="0" type="qcurve" smooth="yes"/><point x="592" y="0"/><point x="543" y="14"/><point x="499" y="40"/><point x="463" y="77"/><point x="451" y="102" type="qcurve"/><point x="432" y="77"/><point x="386" y="40"/><point x="335" y="14"/><point x="279" y="0"/><point x="249" y="0" type="qcurve" smooth="yes"/><point x="201" y="0"/><point x="112" y="36"/><point x="42" y="102"/><point x="0" y="195"/><point x="0" y="251" type="qcurve" smooth="yes"/><point x="0" y="293"/><point x="23" y="366"/><point x="64" y="426"/><point x="121" y="472"/></contour><contour><point x="784" y="58" type="line"/><point x="811" y="-75" type="line"/><point x="811" y="-131" type="line"/><point x="727" y="-131" type="line"/><point x="727" y="-75" type="line"/><point x="754" y="57" type="line"/></contour></outline></glyph>',
    '<?xml version="1.0" encoding="UTF-8"?><glyph name="asterisk" format="1"><advance width="647"/><unicode hex="002A"/><outline><contour><point x="542" y="500" type="line"/><point x="373" y="521" type="line"/><point x="476" y="384" type="line"/><point x="402" y="343" type="line"/><point x="337" y="494" type="line"/><point x="271" y="343" type="line"/><point x="197" y="384" type="line"/><point x="300" y="521" type="line"/><point x="131" y="500" type="line"/><point x="131" y="584" type="line"/><point x="300" y="562" type="line"/><point x="197" y="699" type="line"/><point x="271" y="739" type="line"/><point x="337" y="590" type="line"/><point x="402" y="739" type="line"/><point x="476" y="699" type="line"/><point x="373" y="562" type="line"/><point x="542" y="584" type="line"/></contour></outline></glyph>'
];
var appConfig = { samples: _samples };
new UFOGlyf.Worker(appConfig);
