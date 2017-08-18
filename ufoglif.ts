namespace UFOGlyf {
    export class SVGUtil {
        static Run(orig: SVGPathElement, options: SVGOptions) {

            var distancePerPoint: number = 1;
            var drawFPS: number = 60 * options.speed;
            var timer: number;
            var length: number = 0;
            var pathLength = orig.getTotalLength();

            timer = setInterval(function () {
                length += distancePerPoint;
                orig.style.strokeDasharray = [length, pathLength].join(' ');
                if (length >= pathLength) {
                    length = 0;
                    if (!options.loopAnimation) { clearInterval(timer); }
                }
            }
                , 1000 / drawFPS);
        }

    }
    export class Convert {
        static BuildSVG(glyph: glyph, options: SVGOptions): string {
            var svg: string = "";

            var path: string = "";
            var points: string = "";
            var polygon: string = "";
            var MaxP: point = {
                _x: 0,
                _y: 0
            };

            var MinP: point =
                {
                    _x: 0,
                    _y: 0
                };

            var outline = glyph.outline;

            if (outline != null && outline.contour != null) {

                if (outline.contour.length == null) {
                    //Single Contour is available.
                    outline.contour = [(outline.contour as any) as contour];
                }

                for (var index in outline.contour) {
                    var contour = outline.contour[index];
                    path = path + Convert.ToContourPath(contour);
                }

                if (options.showPoints) {
                    for (var index in outline.contour) {
                        var contour = outline.contour[index];
                        points = points + Convert.ListContourPoints(contour);
                    }
                }

                if (options.showPolygon) {
                    for (var index in outline.contour) {
                        var contour = outline.contour[index];
                        polygon = polygon + Convert.PolygonContourPoints(contour);
                    }
                }

                MaxP = Convert.MaxPoint(outline);
                MinP = Convert.MinPoint(outline);
            }


            var w_max: number = Math.ceil(MaxP._x / 100.0) * 100;
            var h_max: number = Math.ceil(MaxP._y / 100.0) * 100;

            var w_min: number = Math.floor(MinP._x / 100.0) * 100;
            var h_min: number = Math.floor(MinP._y / 100.0) * 100;

            var w: number = w_max - w_min;
            var h: number = h_max - h_min;


            var vx1: number = w_min;
            var vy1: number = Math.min(h_min, -1 * h_max);

            var vx2: number = w;
            var vy2: number = h;

            var adv_w: string = (glyph.advance != null && glyph.advance._width != null) ? glyph.advance._width.toString() : "";
            var hex: string = (glyph.unicode != null && glyph.unicode._hex != null) ? glyph.unicode._hex : "";


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

            return svg
        }

        static ToContourPath(contour: contour): string {
            var path: string = "";
            var lastCurve: string = "";
            var prev: point = null;
            var List: point[] = [];
            var Groups: contour[] = [];
            for (var index in contour.point) {

                var point_: point = contour.point[index];
                if (point_._type == null || point_._type == "") {
                    //Part of Last Curve
                }
                else {
                    if (prev == null) {
                        //Nothing to do
                    }
                    else {
                        //New Curve started Hence add the current list of points to Group
                        //Clear the List

                        var C: contour =
                            {
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
                var C: contour =
                    {
                        point: List
                    };

                Groups.push(C);
                //
                var C2: contour = Groups[0];
                var C3: contour = { point: [C2.point[0]] };
                Groups.push(C3);
            }
            path = Convert.ProcessGroups(Groups);
            return path;
        }

        static ProcessGroups(Groups: contour[]): string {
            var s: string = "";
            var first: boolean = true;
            var QCurve: boolean = false;

            if (Groups.length > 0 && Groups[0].point.length > 0) {
                if (typeof Groups[0].point[0] == "string") {
                    //TODO:???
                    return "";
                }
            }

            for (var index in Groups) {
                var C: contour = Groups[index];
                if (C.point.length == 0) {
                    continue;
                }
                var groupType: string = C.point[0]._type;
                var smooth: string = C.point[0]._smooth;
                var P0: point = C.point[0];

                if (first) {

                    var temp: string = "M_x _y \r\n";

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
                        var temp: string = "L_x _y \r\n";
                        temp = temp.replace(new RegExp("_x", 'g'), P0._x.toString())
                            .replace(new RegExp("_y", 'g'), P0._y.toString());
                        s = s + temp;
                    }
                    if (groupType == "qcurve" || groupType == "curve") {
                        if (QCurve) {
                            var temp: string = "_x _y \r\n";
                            temp = temp.replace(new RegExp("_x", 'g'), P0._x.toString())
                                .replace(new RegExp("_y", 'g'), P0._y.toString());
                            s = s + temp;
                            QCurve = false;
                        }
                        else {
                            var temp: string = "T_x _y \r\n";
                            temp = temp.replace(new RegExp("_x", 'g'), P0._x.toString())
                                .replace(new RegExp("_y", 'g'), P0._y.toString());
                            s = s + temp;
                        }
                    }
                    continue;
                }

                var cnt: number = 0;
                var Prev: point = null;
                if (C.point.length >= 2) {
                    for (var index in C.point) {
                        var P: point = C.point[index];
                        var Mid: point = null;
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
                                    var temp: string = "_x _y \r\n";
                                    temp = temp.replace(new RegExp("_x", 'g'), P._x.toString())
                                        .replace(new RegExp("_y", 'g'), P._y.toString());
                                    s = s + temp;
                                    QCurve = false;
                                }
                                else {
                                    var temp: string = "T_x _y \r\n";
                                    temp = temp.replace(new RegExp("_x", 'g'), P._x.toString())
                                        .replace(new RegExp("_y", 'g'), P._y.toString());
                                    s = s + temp;
                                }
                            }
                            else if (groupType == "line") {
                                var temp: string = "L_x _y \r\n";
                                temp = temp.replace(new RegExp("_x", 'g'), P._x.toString())
                                    .replace(new RegExp("_y", 'g'), P._y.toString());
                                s = s + temp;
                            }
                            else if (groupType == "qcurve" || groupType == "curve") {
                                if (QCurve) {
                                    var temp: string = "_x _y \r\n";
                                    temp = temp.replace(new RegExp("_x", 'g'), P._x.toString())
                                        .replace(new RegExp("_y", 'g'), P._y.toString());
                                    s = s + temp;
                                    QCurve = false;
                                }
                                else {
                                    var temp: string = "T_x _y \r\n";
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
                            var temp: string = "Q_x _y ";
                            temp = temp.replace(new RegExp("_x", 'g'), P._x.toString())
                                .replace(new RegExp("_y", 'g'), P._y.toString());
                            s = s + temp;
                            QCurve = true;
                        }
                        else if (cnt == 2) {
                            var temp: string = "_x _y \r\n";
                            temp = temp.replace(new RegExp("_x", 'g'), Mid._x.toString())
                                .replace(new RegExp("_y", 'g'), Mid._y.toString());
                            s = s + temp;
                            QCurve = false;
                        }
                        else {
                            if (QCurve) {
                                var temp: string = "_x _y \r\n";
                                temp = temp.replace(new RegExp("_x", 'g'), Mid._x.toString())
                                    .replace(new RegExp("_y", 'g'), Mid._y.toString());
                                s = s + temp;
                                QCurve = false;
                            }
                            else {
                                var temp: string = "T_x _y \r\n";
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
        }

        static PolygonContourPoints(contour: contour): string {

            if (contour == null && contour.point == null) {
                return "";
            }
            if (contour.point[0] == null) {
                //TODO...
                return "";
            }



            var s: string = "";
            for (var index in contour.point) {
                var point_: point = contour.point[index];
                var temp: string = "_x,_y ";
                temp = temp
                    .replace(new RegExp("_x", 'g'), point_._x.toString())
                    .replace(new RegExp("_y", 'g'), point_._y.toString());
                s = s + temp;
            }
            {
                var point_: point = contour.point[0];
                var temp: string = "_x,_y ";
                temp = temp
                    .replace(new RegExp("_x", 'g'), point_._x.toString())
                    .replace(new RegExp("_y", 'g'), point_._y.toString());
                s = s + temp;
            }

            var temp = '<polyline points="_points" class="ploygon"  />';
            s = temp
                .replace(new RegExp("_points", 'g'), s)
            s = s + "\r\n";
            return s;
        }

        static ListContourPoints(contour: contour): string {

            if (contour == null && contour.point == null) {
                return "";
            }

            if (contour.point[0] == null) {
                //TODO...
                return "";
            }


            var s: string = "";
            var first: boolean = true;
            for (var index in contour.point) {
                var point_: point = contour.point[index];
                var temp: string = '<circle cx="_cx" cy="_cy" r="5"  type="_type" _class />';
                temp = temp.replace(new RegExp("_cx", 'g'), point_._x.toString())
                    .replace(new RegExp("_cy", 'g'), point_._y.toString())
                    .replace(new RegExp("_type", 'g'), point_._type == null ? "" : point_._type)
                    .replace(new RegExp("_class", 'g'), first ? 'class="first"' : "")

                s = s + temp;
                s = s + "\r\n";
                if (first) {
                    first = false;
                }
            }
            s = '<g class="circle">' + s + "</g>";
            return s;
        }

        static MaxPoint(outline: outline): point {
            var M: point =
                {
                    _x: 0,
                    _y: 0
                };

            if (outline.contour != null) {
                for (var index in outline.contour) {

                    var C: contour = outline.contour[index];
                    var P: point = Convert.MaxCountourPoint(C);

                    if (P._x > M._x) {
                        M._x = P._x;
                    }

                    if (P._y > M._y) {
                        M._y = P._y;
                    }
                }
            }
            return M;
        }

        static MinPoint(outline: outline): point {
            var M: point =
                {
                    _x: 0,
                    _y: 0
                };

            if (outline.contour != null) {
                for (var index in outline.contour) {

                    var C: contour = outline.contour[index];
                    var P: point = Convert.MinCountourPoint(C);
                    if (P._x < M._x) {
                        M._x = P._x;
                    }

                    if (P._y < M._y) {
                        M._y = P._y;
                    }
                }
            }
            return M;
        }

        static MaxCountourPoint(contour: contour): point {
            var M: point =
                {
                    _x: 0,
                    _y: 0
                };

            if (contour.point[0] == null) {
                //TODO...
                return M;
            }
            for (var index in contour.point) {
                var P: point = contour.point[index];

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
        }


        static MinCountourPoint(contour: contour): point {
            var M: point =
                {
                    _x: 0,
                    _y: 0
                };

            if (contour.point[0] == null) {
                //TODO...
                return M;
            }

            for (var index in contour.point) {
                var P: point = contour.point[index];

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
        }
    }


    export class Worker {

        goHandler: elementEventListener;
        randomHandler: elementEventListener;
        randomList: string[];

        constructor(config: AppConfig) {

            this.init(config);
        }

        private init(config: AppConfig) {
            this.randomList = [];

            if (config != null) {
                this.loadSamples(config.samples);
            }

            this.random();
            this.go(null);

            this.registerEvents();
        }

        private random() {
            var n = Util.random(this.randomList.length);
            Util.setValue("txtInput", this.randomList[n]);
        }


        private loadSamples(samples: string[]): void {
            if (samples == null) {
                return;
            }

            for (var index in samples) {
                if (samples[index] == null || samples[index].length == 0) {
                    continue;
                }
                this.randomList.push(samples[index]);
            }
        }

        private dispose() {
            this.deRegisterEvents();
            this.randomList = null;
        }

        private go(e: any) {
            var input: string = Util.getValue("txtInput");
            var showPoints: boolean = Util.isChecked("chkShowPoints");
            var showPolygon: boolean = Util.isChecked("chkShowPolygon");
            var loopAnimation: boolean = Util.isChecked("chkLoop");
            var speed: number = parseInt(Util.selectedValue("drpSpeed"));

            var root: root = new X2JS().xml_str2json(input) as root;
            var glyph: glyph = root.glyph;
            var options: SVGOptions = { showPoints: showPoints, showPolygon: showPolygon, loopAnimation: loopAnimation, speed: speed };

            var html = Convert.BuildSVG(glyph, options);
            var table = document.getElementById("table");
            if (table == null) { return; }
            table.innerHTML = "";
            table.innerHTML = html;
            SVGUtil.Run(table.querySelector("path") as SVGPathElement, options);
        }

        private registerEvents() {
            var that = this;
            this.goHandler = function (e) { that.go(e); };
            this.randomHandler = function (e) { that.random(); };

            Util.registerClick("btnGo", that.goHandler);
            Util.registerClick("btnRandom", this.randomHandler);

            var that = this;
            Util.registerEvent(window, "unload", function (e) { that.dispose });
        }

        private deRegisterEvents() {
            Util.deRegisterClick("btnGo", this.goHandler);
            Util.deRegisterClick("btnRandom", this.randomHandler);
        }
    }
}
var _samples: string[] =
    [
        '<?xml version="1.0" encoding="UTF-8"?><glyph name="A" format="1"><advance width="777"/><unicode hex="0041"/><outline><contour><point x="753" y="0" type="line"/><point x="644" y="0" type="line"/><point x="564" y="198" type="line"/><point x="202" y="198" type="line"/><point x="121" y="0" type="line"/><point x="15" y="0" type="line"/><point x="326" y="739" type="line"/><point x="438" y="739" type="line"/></contour><contour><point x="521" y="285" type="line"/><point x="380" y="626" type="line"/><point x="242" y="285" type="line"/></contour></outline></glyph>',
        '<?xml version="1.0" encoding="UTF-8"?><glyph name="U0C1D" format="1"><advance width="1260"/><unicode hex="0C1D"/><outline><contour><point x="431" y="251" type="qcurve" smooth="yes"/><point x="431" y="292"/><point x="401" y="362"/><point x="351" y="413"/><point x="286" y="442"/><point x="249" y="442" type="qcurve" smooth="yes"/><point x="214" y="442"/><point x="148" y="413"/><point x="99" y="362"/><point x="69" y="292"/><point x="69" y="251" type="qcurve" smooth="yes"/><point x="69" y="211"/><point x="100" y="144"/><point x="150" y="96"/><point x="215" y="71"/><point x="249" y="71" type="qcurve" smooth="yes"/><point x="284" y="71"/><point x="349" y="96"/><point x="400" y="144"/><point x="431" y="211"/></contour><contour><point x="156" y="486" type="qcurve"/><point x="132" y="498"/><point x="98" y="547"/><point x="95" y="588" type="qcurve"/><point x="150" y="588" type="line"/><point x="150" y="567"/><point x="164" y="544"/><point x="186" y="533"/><point x="207" y="528"/><point x="222" y="529" type="qcurve" smooth="yes"/><point x="236" y="531"/><point x="255" y="537"/><point x="278" y="548"/><point x="299" y="564"/><point x="310" y="571" type="qcurve" smooth="yes"/><point x="514" y="747" type="line"/><point x="514" y="676" type="line"/><point x="315" y="508"/><point x="304" y="502" type="qcurve"/><point x="341" y="490"/><point x="409" y="445"/><point x="463" y="380"/><point x="496" y="298"/><point x="496" y="251" type="qcurve" smooth="yes"/><point x="496" y="235"/><point x="490" y="188"/><point x="479" y="158" type="qcurve"/><point x="487" y="136"/><point x="515" y="104"/><point x="551" y="81"/><point x="594" y="71"/><point x="616" y="71" type="qcurve" smooth="yes"/><point x="651" y="71"/><point x="700" y="104"/><point x="735" y="157"/><point x="752" y="224"/><point x="752" y="259" type="qcurve" smooth="yes"/><point x="752" y="296"/><point x="729" y="364"/><point x="688" y="417"/><point x="632" y="449"/><point x="597" y="449" type="qcurve"/><point x="619" y="509" type="line"/><point x="665" y="509"/><point x="739" y="467"/><point x="793" y="397"/><point x="822" y="307"/><point x="822" y="259" type="qcurve" smooth="yes"/><point x="822" y="228"/><point x="812" y="181"/><point x="797" y="145" type="qcurve"/><point x="836" y="110"/><point x="882" y="80"/><point x="929" y="71"/><point x="954" y="71" type="qcurve" smooth="yes"/><point x="987" y="71"/><point x="1039" y="104"/><point x="1074" y="158"/><point x="1094" y="225"/><point x="1094" y="259" type="qcurve" smooth="yes"/><point x="1094" y="294"/><point x="1073" y="362"/><point x="1034" y="416"/><point x="979" y="449"/><point x="944" y="449" type="qcurve"/><point x="982" y="511" type="line"/><point x="1026" y="511"/><point x="1093" y="465"/><point x="1138" y="391"/><point x="1162" y="302"/><point x="1162" y="259" type="qcurve" smooth="yes"/><point x="1162" y="210"/><point x="1133" y="116"/><point x="1078" y="44"/><point x="1000" y="0"/><point x="954" y="0" type="qcurve" smooth="yes"/><point x="902" y="-3"/><point x="807" y="42"/><point x="768" y="92" type="qcurve"/><point x="739" y="49"/><point x="662" y="0"/><point x="616" y="0" type="qcurve" smooth="yes"/><point x="592" y="0"/><point x="543" y="14"/><point x="499" y="40"/><point x="463" y="77"/><point x="451" y="102" type="qcurve"/><point x="432" y="77"/><point x="386" y="40"/><point x="335" y="14"/><point x="279" y="0"/><point x="249" y="0" type="qcurve" smooth="yes"/><point x="201" y="0"/><point x="112" y="36"/><point x="42" y="102"/><point x="0" y="195"/><point x="0" y="251" type="qcurve" smooth="yes"/><point x="0" y="293"/><point x="23" y="366"/><point x="64" y="426"/><point x="121" y="472"/></contour><contour><point x="784" y="58" type="line"/><point x="811" y="-75" type="line"/><point x="811" y="-131" type="line"/><point x="727" y="-131" type="line"/><point x="727" y="-75" type="line"/><point x="754" y="57" type="line"/></contour></outline></glyph>',
        '<?xml version="1.0" encoding="UTF-8"?><glyph name="asterisk" format="1"><advance width="647"/><unicode hex="002A"/><outline><contour><point x="542" y="500" type="line"/><point x="373" y="521" type="line"/><point x="476" y="384" type="line"/><point x="402" y="343" type="line"/><point x="337" y="494" type="line"/><point x="271" y="343" type="line"/><point x="197" y="384" type="line"/><point x="300" y="521" type="line"/><point x="131" y="500" type="line"/><point x="131" y="584" type="line"/><point x="300" y="562" type="line"/><point x="197" y="699" type="line"/><point x="271" y="739" type="line"/><point x="337" y="590" type="line"/><point x="402" y="739" type="line"/><point x="476" y="699" type="line"/><point x="373" y="562" type="line"/><point x="542" y="584" type="line"/></contour></outline></glyph>'
    ];
var appConfig: AppConfig = { samples: _samples };
new UFOGlyf.Worker(appConfig);