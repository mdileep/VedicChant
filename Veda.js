/*
Author: Dileep Miriyala
Vedic Chanting generation tool
Author : m.dileep@gmail.com
Version: 0.5 Beta
Last updated on : 29-Mar-2017 11:13:00EST
*/
var Veda;
(function (Veda) {
    var Chanting;
    (function (Chanting) {
        var PatternUtil = (function () {
            function PatternUtil() {
            }
            PatternUtil.From = function (words, from, n) {
                return PatternUtil.Between(words, from, from - Math.abs(n));
            };
            PatternUtil.Between = function (words, from, to) {
                var sb = "";
                var N = words.length;
                if (from < to) {
                    //Froward Loop
                    for (var i = from; i <= to; i++) {
                        if (i - 1 >= N) {
                            continue;
                        }
                        sb = sb + PatternUtil.Get(words, i - 1) + PatternUtil.Space;
                    }
                }
                else {
                    //Reverse Loop
                    for (var i = from; i >= to; i--) {
                        if (i - 1 >= N) {
                            continue;
                        }
                        sb = sb + PatternUtil.Get(words, i - 1) + PatternUtil.Space;
                    }
                }
                return sb;
            };
            PatternUtil.Get = function (words, I) {
                if (I < 0) {
                    return "";
                }
                if (I < words.length) {
                    return words[I];
                }
                return "";
            };
            PatternUtil.Space = " ";
            PatternUtil.Seperator = " ~ ";
            PatternUtil.NewLine = "\n";
            return PatternUtil;
        }());
        Chanting.PatternUtil = PatternUtil;
        var Jata = (function () {
            function Jata() {
                this.Identifier = "Jata";
                this.Name = "jaṭā జట";
                this.MinLength = 2;
            }
            Jata.prototype.GetStream = function (words) {
                var sb = "";
                var N = words.length;
                if (N < this.MinLength) {
                    return "";
                }
                for (var I = 0; I <= N - 1; I++) {
                    //I+1 I+2  I+2 I+1  I+1 I+2  : One Index
                    sb = sb + (PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Space +
                        PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Space +
                        PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Seperator);
                    sb = sb + (PatternUtil.NewLine);
                }
                return sb;
            };
            return Jata;
        }());
        Chanting.Jata = Jata;
        var Mala = (function () {
            function Mala() {
                this.Identifier = "Mala";
                this.Name = "mālā మాల";
                this.MinLength = 2;
            }
            Mala.prototype.GetStream = function (words) {
                var sb = "";
                var N = words.length;
                if (N < this.MinLength) {
                    return "";
                }
                for (var I = 0; I <= N - 1; I++) {
                    //I+1 I+2 / I+2 I+1 / I+1 I+2  : One Index
                    sb = sb + (PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Space +
                        PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Space +
                        PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Seperator);
                    sb = sb + (PatternUtil.NewLine);
                }
                return sb;
            };
            return Mala;
        }());
        Chanting.Mala = Mala;
        var Sikha = (function () {
            function Sikha() {
                this.Identifier = "Sikha";
                this.Name = "śikhā శిఖ";
                this.MinLength = 3;
            }
            Sikha.prototype.GetStream = function (words) {
                var sb = "";
                var N = words.length;
                if (N < this.MinLength) {
                    return "";
                }
                for (var I = 0; I <= N - 1; I++) {
                    //I+1 I+2 / I+2 I+1 / I+1 I+2 I+3  : One Index
                    sb = sb + (PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Seperator +
                        PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Seperator +
                        PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2) + PatternUtil.Seperator);
                    sb = sb + (PatternUtil.NewLine);
                }
                return sb;
            };
            return Sikha;
        }());
        Chanting.Sikha = Sikha;
        var Rekha = (function () {
            function Rekha() {
                this.Identifier = "Rekha";
                this.Name = "rekhā రేఖ";
                this.MinLength = 4;
            }
            Rekha.prototype.GetStream = function (words) {
                var sb = "";
                var N = words.length;
                if (N < this.MinLength) {
                    return "";
                }
                for (var I = 1; I <= N; I++) {
                    //I...I+I / I+I...I / I I+1  : One Index
                    sb = sb + (PatternUtil.Between(words, I, I + I) + PatternUtil.Seperator +
                        PatternUtil.Between(words, I + I, I) + PatternUtil.Seperator +
                        PatternUtil.Get(words, I - 1) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Seperator);
                    sb = sb + (PatternUtil.NewLine);
                }
                return sb;
            };
            return Rekha;
        }());
        Chanting.Rekha = Rekha;
        var Dhvaja = (function () {
            function Dhvaja() {
                this.Identifier = "Dhvaja";
                this.Name = "dhvaja ధ్వజ";
                this.MinLength = 4;
            }
            Dhvaja.prototype.GetStream = function (words) {
                var sb = "";
                var N = words.length;
                if (N < this.MinLength) {
                    return "";
                }
                for (var I = 1; I <= N; I++) {
                    //I I+1 / N-I-1 N-I : One Index
                    sb = sb + (PatternUtil.Get(words, I - 1) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Seperator +
                        PatternUtil.Get(words, N - I - 1) + PatternUtil.Space + PatternUtil.Get(words, N - I) + PatternUtil.Seperator);
                    sb = sb + (PatternUtil.NewLine);
                }
                return sb;
            };
            return Dhvaja;
        }());
        Chanting.Dhvaja = Dhvaja;
        var Dhanda = (function () {
            function Dhanda() {
                this.Identifier = "Dhanda";
                this.Name = "daṇḍa దండ";
                this.MinLength = 4;
            }
            Dhanda.prototype.GetStream = function (words) {
                var sb = "";
                var N = words.length;
                if (N < this.MinLength) {
                    return "";
                }
                for (var I = 1; I <= N; I++) {
                    //I+1 I+2 / I+2 I+1 / I+1 I+2 / I+2 I+3 /  I+3 I+2 I+1 / I+1 I+2 / I+2 I+3 / I+3 I+4 / I+4 I+3 I+2 I+1 / I+1 I+2 : One Index
                    sb = sb + (PatternUtil.Get(words, I + 1 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Seperator +
                        PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 1 - 1) + PatternUtil.Seperator +
                        PatternUtil.Get(words, I + 1 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Seperator +
                        PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 3 - 1) + PatternUtil.Seperator +
                        PatternUtil.Get(words, I + 3 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 1 - 1) + PatternUtil.Seperator +
                        PatternUtil.Get(words, I + 1 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Seperator +
                        PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 3 - 1) + PatternUtil.Seperator +
                        PatternUtil.Get(words, I + 3 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 4 - 1) + PatternUtil.Seperator +
                        PatternUtil.Get(words, I + 4 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 3 - 1) + PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 1 - 1) + PatternUtil.Seperator +
                        PatternUtil.Get(words, I + 1 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Seperator);
                    sb = sb + (PatternUtil.NewLine);
                }
                return sb;
            };
            return Dhanda;
        }());
        Chanting.Dhanda = Dhanda;
        var Ratha = (function () {
            function Ratha() {
                this.Identifier = "Ratha";
                this.Name = "ratha రధ";
                this.MinLength = 5;
            }
            Ratha.prototype.GetStream = function (words) {
                var sb = "";
                var N = words.length;
                if (N < this.MinLength) {
                    return "";
                }
                for (var I = 1; I <= N; I++) {
                    //I I+1 / I+4 I+5 / I+1 ...1 / I+5...(-I items ) : One Index
                    //FOR J 1...I
                    //  J J+1 / J+4 J+5 : One Index
                    //LOOP
                    sb = sb + (PatternUtil.Get(words, I - 1) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Seperator +
                        PatternUtil.Get(words, I + 3) + PatternUtil.Space + PatternUtil.Get(words, I + 4) + PatternUtil.Seperator +
                        PatternUtil.Between(words, I + 1, 1) + PatternUtil.Seperator +
                        PatternUtil.From(words, I + 5, -1 * I) + PatternUtil.Seperator);
                    for (var J = 0; J < I; J++) {
                        sb = sb + (PatternUtil.Get(words, J) + PatternUtil.Space + PatternUtil.Get(words, J + 1) + PatternUtil.Seperator +
                            PatternUtil.Get(words, J + 4) + PatternUtil.Space + PatternUtil.Get(words, J + 5) + PatternUtil.Seperator);
                    }
                    sb = sb + (PatternUtil.NewLine);
                }
                return sb;
            };
            return Ratha;
        }());
        Chanting.Ratha = Ratha;
        var Ghana = (function () {
            function Ghana() {
                this.Identifier = "Ghana";
                this.Name = "ghana ఘణ";
                this.MinLength = 3;
            }
            Ghana.prototype.GetStream = function (words) {
                var sb = "";
                var N = words.length;
                if (N < this.MinLength) {
                    return "";
                }
                for (var I = 1; I <= N; I++) {
                    //I+1 I+2 I+2 I+1 I+1 I+2 I+3 I+3 I+2 I+1 I+1 I+2 I+3 : One Index
                    sb = sb + (PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2) + PatternUtil.Space + PatternUtil.Get(words, I + 2) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2) + PatternUtil.Seperator);
                    sb = sb + (PatternUtil.NewLine);
                }
                return sb;
            };
            return Ghana;
        }());
        Chanting.Ghana = Ghana;
        var Worker = (function () {
            function Worker() {
                this.registerEvents();
                this.list = [new Jata(), new Mala(), new Sikha(), new Rekha(), new Dhvaja(), new Dhanda(), new Ratha(), new Ghana()];
                this.randomList = ["శ్రీ హేవళంబి నామ నూతన సంవత్సర శుభ అభినందనం", "ī̱śā vā̱sya̍m i̱daṁ sarva̱ṃ yat kiñca jaga̍tyā̱ṃ jaga̍t", "ईशा वास्यं इदं सर्वं यत्किंच जगत्यां जगत्", "ఈశా వశ్యం ఇదం సర్వం  యత్ జగత్యం జగత్"];
                var that = this;
                Util.registerEvent(window, "unload", function (e) { that.dispose; });
                this.random(null);
                this.go(null);
            }
            Worker.prototype.dispose = function () {
                this.deRegisterEvents();
                this.list = null;
                this.randomList = null;
            };
            Worker.prototype.deRegisterEvents = function () {
                Util.deRegisterClick("btnGo", this.goHandler);
                Util.deRegisterClick("btnRandom", this.randomHandler);
            };
            Worker.prototype.registerEvents = function () {
                var that = this;
                this.goHandler = function (e) { that.go(e); };
                this.randomHandler = function (e) { that.random(e); };
                Util.registerClick("btnGo", that.goHandler);
                Util.registerClick("btnRandom", this.randomHandler);
            };
            Worker.prototype.random = function (e) {
                var n = Math.floor(Math.random() * this.randomList.length);
                Util.setValue("txtInput", this.randomList[n]);
            };
            Worker.prototype.go = function (e) {
                var input = Util.getValue("txtInput");
                var patterns = this.getPatterns(input);
                var html = Util.template("<ol class='ol'><%for(var index in this) {%><li> <h2><% this[index].name %></h2> <p><% this[index].stream_html %></p> </li> <% } %></ol>", patterns);
                var table = document.getElementById("table");
                if (table == null) {
                    return;
                }
                table.innerHTML = "";
                table.innerHTML = html;
            };
            Worker.prototype.getPatterns = function (input) {
                var words = input.split(' ');
                var sb = [];
                for (var index in this.list) {
                    var pattern = this.list[index];
                    var stream = pattern.GetStream(words);
                    sb[index] = {
                        identifier: pattern.Identifier,
                        name: pattern.Name,
                        stream: stream,
                        stream_html: stream.replace(/[\r\t\n]/g, '<br/><br/>')
                    };
                }
                return sb;
            };
            return Worker;
        }());
        Chanting.Worker = Worker;
    })(Chanting = Veda.Chanting || (Veda.Chanting = {}));
})(Veda || (Veda = {}));
new Veda.Chanting.Worker();
//# sourceMappingURL=Veda.js.map