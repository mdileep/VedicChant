/*
Author: Dileep Miriyala
Vedic Chanting generation tool
Author : m.dileep@gmail.com
Version: 0.5 Beta
Last updated on : 29-Mar-2017 11:13:00EST
*/
namespace Veda.Chanting {
    interface iPattern {
        Name: string;
        Identifier: string;
        MinLength: Number;
        GetStream(words: string[]): string;
    }
    export class PatternUtil {
        public static Missing: string = "_";
        public static Space: string = " ";
        public static Seperator: string = " ~ ";
        public static NewLine: string = "\n";

        public static From(words: string[], from: number, n: number): string {
            return PatternUtil.Between(words, from, from - Math.abs(n));
        }

        public static Between(words: string[], from: number, to: number): string {
            var sb: string = "";
            var N: number = words.length;
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
        }

        public static Get(words: string[], I: number): string {
            if (I < 0) {
                return PatternUtil.Missing;
            }
            if (I < words.length) {
                return words[I];
            }
            return PatternUtil.Missing;
        }

        public static Filter(words: string[]): string[] {
            var _words: string[] = [];
            for (var index in words) {
                if (words[index].trim() == "") {
                    continue;
                }
                _words.push(words[index]);
            }
            return _words;
        }

    }
    export class Jata implements iPattern {
        public Identifier: string = "Jata";
        public Name: string = "jaṭā జట";
        public MinLength: Number = 2;
        public GetStream(_words: string[]): string {
            var words: string[] = PatternUtil.Filter(_words);
            var sb: string = "";
            var N: number = words.length;
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
        }
    }
    export class Mala implements iPattern {
        public Identifier: string = "Mala";
        public Name: string = "mālā మాల";
        public MinLength: Number = 2;
        public GetStream(_words: string[]): string {
            var words: string[] = PatternUtil.Filter(_words);
            var sb: string = "";
            var N: number = words.length;
            if (N < this.MinLength) {
                return "";
            }
            for (var I = 0; I <= N - 1; I++) {
                //I+1 I+2 / I+2 I+1 / I+1 I+2  : One Index
                sb = sb + (PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Seperator +
                    PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Seperator +
                    PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Seperator);
                sb = sb + (PatternUtil.NewLine);
            }
            return sb;
        }
    }
    export class Sikha implements iPattern {
        public Identifier: string = "Sikha";
        public Name: string = "śikhā శిఖ";
        public MinLength: Number = 3;
        public GetStream(_words: string[]): string {
            var words: string[] = PatternUtil.Filter(_words);
            var sb: string = "";
            var N: number = words.length;
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
        }
    }
    export class Rekha implements iPattern {
        public Identifier: string = "Rekha";
        public Name: string = "rekhā రేఖ";
        public MinLength: Number = 4;
        public GetStream(_words: string[]): string {
            var words: string[] = PatternUtil.Filter(_words);
            var sb: string = "";
            var N: number = words.length;
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
        }
    }
    export class Dhvaja implements iPattern {
        public Identifier: string = "Dhvaja";
        public Name: string = "dhvaja ధ్వజ";
        public MinLength: Number = 4;
        public GetStream(_words: string[]): string {
            var words: string[] = PatternUtil.Filter(_words);
            var sb: string = "";
            var N: number = words.length;
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
        }
    }
    export class Dhanda implements iPattern {
        public Identifier: string = "Dhanda";
        public Name: string = "daṇḍa దండ";
        public MinLength: Number = 4;
        public GetStream(_words: string[]): string {
            var words: string[] = PatternUtil.Filter(_words);
            var sb: string = "";
            var N: number = words.length;
            if (N < this.MinLength) {
                return "";
            }
           	for (var I = 0; I <= N - 1; I++) {
                //I+1 I+2 / I+2 I+1 / I+1 I+2 / I+2 I+3 /  I+3 I+2 I+1 / I+1 I+2 / I+2 I+3 / I+3 I+4 / I+4 I+3 I+2 I+1 / I+1 I+2 : One Index
                sb = sb + (
                    PatternUtil.Get(words, I + 1 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Seperator +
                    PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 1 - 1) + PatternUtil.Seperator +
                    PatternUtil.Get(words, I + 1 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Seperator +
                    PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 3 - 1) + PatternUtil.Seperator +
                    PatternUtil.Get(words, I + 3 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 1 - 1) + PatternUtil.Seperator +
                    PatternUtil.Get(words, I + 1 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Seperator +
                    PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 3 - 1) + PatternUtil.Seperator +
                    PatternUtil.Get(words, I + 3 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 4 - 1) + PatternUtil.Seperator +
                    PatternUtil.Get(words, I + 4 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 3 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 1 - 1) + PatternUtil.Seperator +
                    PatternUtil.Get(words, I + 1 - 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2 - 1) + PatternUtil.Seperator);
                sb = sb + (PatternUtil.NewLine);
            }
            return sb;
        }
    }
    export class Ratha implements iPattern {
        public Identifier: string = "Ratha";
        public Name: string = "ratha రధ";
        public MinLength: Number = 5;
        public GetStream(_words: string[]): string {
            var words: string[] = PatternUtil.Filter(_words);
            var sb: string = "";
            var N: number = words.length;
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
        }
    }
    export class Ghana implements iPattern {
        public Identifier: string = "Ghana";
        public Name: string = "ghana ఘణ";
        public MinLength: Number = 3;
        public GetStream(_words: string[]): string {
            var words: string[] = PatternUtil.Filter(_words);
            var sb: string = "";
            var N: number = words.length;
            if (N < this.MinLength) {
                return "";
            }
            for (var I = 0; I <= N - 1; I++) {
                //I+1 I+2 I+2 I+1 I+1 I+2 I+3 I+3 I+2 I+1 I+1 I+2 I+3 : One Index
                sb = sb + (PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2) + PatternUtil.Space + PatternUtil.Get(words, I + 2) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I) + PatternUtil.Space + PatternUtil.Get(words, I + 1) + PatternUtil.Space + PatternUtil.Get(words, I + 2) + PatternUtil.Seperator);
                sb = sb + (PatternUtil.NewLine);
            }
            return sb;
        }
    }

    export class Worker {
        numbers: string = "1 2 3 4 5 6 7 8 9";

        constructor(config: VedaConfig) {
            debugger;
            this.init(config);
        }

        private init(config: VedaConfig) {

            this.list = [new Jata(), new Mala(), new Sikha(), new Rekha(), new Dhvaja(), new Dhanda(), new Ratha(), new Ghana()];
            this.randomList = [];
            this.randomList.push(this.numbers);

            if (config != null) {
                this.loadSamples(config.samples);
            }

            this.random(0);// Don't show "1 2.." on Load
            this.go(null);

            this.registerEvents();
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

        randomList: string[];
        list: iPattern[];
        goHandler: elementEventListener;
        randomHandler: elementEventListener;

        private dispose() {
            this.deRegisterEvents();
            this.list = null;
            this.randomList = null;
        }

        private deRegisterEvents() {
            Util.deRegisterClick("btnGo", this.goHandler);
            Util.deRegisterClick("btnRandom", this.randomHandler);
        }

        private registerEvents() {
            var that = this;
            this.goHandler = function (e) { that.go(e); };
            this.randomHandler = function (e) { that.random(-1); };
            Util.registerClick("btnGo", that.goHandler);
            Util.registerClick("btnRandom", this.randomHandler);

            var that = this;
            Util.registerEvent(window, "unload", function (e) { that.dispose });
        }

        private random(ignore: number) {

            if (this.randomList.length == 1) {
                Util.setValue("txtInput", this.randomList[0]);
                return;
            }

            var n = ignore;
            while (n == ignore) {
                n = Util.random(this.randomList.length);
            }
            Util.setValue("txtInput", this.randomList[n]);
        }

        private go(e: any) {
            var input: string = Util.getValue("txtInput");
            var patterns: string = this.getPatterns(input);
            var html = Util.template("<ol class='ol'><%for(var index in this) {%><li> <h2><% this[index].name %></h2> <p><% this[index].stream_html %></p> </li> <% } %></ol>", patterns);

            var table = document.getElementById("table");
            if (table == null) { return; }
            table.innerHTML = "";
            table.innerHTML = html;
        }

        private getPatterns(input: string): any {
            var words: string[] = PatternUtil.Filter(input.split(' '));
            var sb: any[] = [];
            for (var index in this.list) {
                var pattern: iPattern = this.list[index];
                var stream: string = pattern.GetStream(words);
                sb[index] = {
                    identifier: pattern.Identifier,
                    name: pattern.Name,
                    stream: stream,
                    stream_html: stream.replace(/[\r\t\n]/g, '<br/><br/>')
                };
            }
            return sb;
        }
    }
}

var _samples: string[] =
    [
        "శ్రీ రామ రామ రామేతి రమే రామే మనోరమే సహస్ర నామ తత్ తుల్యం రామ నామ వరాననే",
        "శ్రీ హేవళంబి నామ నూతన సంవత్సర శుభ అభినందనం",
        "ī̱śā vā̱sya̍m i̱daṁ sarva̱ṃ yat kiñca jaga̍tyā̱ṃ jaga̍t",
        "ईशा वास्यं इदं सर्वं यत्किंच जगत्यां जगत्",
        "ఈశా వశ్యం ఇదం సర్వం  యత్ జగత్యం జగత్",
        "ఏతా అసతన్ సుకృతస్య లోకే త విష్ణో పాహి పాహి యజ్ఞం పాహి యజ్ఞపతిం పాహి మాం యజ్ఞనిజం",
        "ētā asatan skṛtasya lōkē ta viṣṇō pāhi pāhi yajñaṁ pāhi yajñapatiṁ pāhi māṁ yajñanijaṁ"
    ];
var config: VedaConfig = { samples: _samples };

new Veda.Chanting.Worker(config);