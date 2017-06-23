/*
Author: Dileep Miriyala
L-systems String Generation
Author : m.dileep@gmail.com
Version: 0.1 Beta
Last updated on : 22-Jun-2017 11:30:00EST
*/

declare type Config = {
    rules: LSystems.iRule[];
    axiom: string;
    max: number;
}

namespace LSystems {


    export interface iRule {
        Match: string;
        Replace: string;
        ToString(): string;

    }

    export class Rule implements iRule {
        constructor(match: string, replace: string) {
            this.Match = match;
            this.Replace = replace;
        }
        public Match: string = "";
        public Replace: string = "";
        public static Symbol: string = "=";


        public ToString(): string {
            return this.Match + Rule.Symbol + this.Replace;
        }

        public static GetRule(str: string): iRule {

            if (str.indexOf(Rule.Symbol) < 0) {
                return null;
            }

            var array = str.split(Rule.Symbol);

            var rule: iRule = new Rule(array[0].trim(), array[1].trim());

            return rule;
        }
    }

    export class LSystemsUtil {

        private static Apply(c: string, rules: iRule[]): string {

            var retVal: string = "";
            var matched = false;
            for (var i: number = 0; i < rules.length; i++) {
                var rule: iRule = rules[i];
                if (c == rule.Match) {
                    retVal = rule.Replace;
                    matched = true;
                }
            }
            if (!matched)
            {
                return c;
            }
            return retVal;
        }

        private static Process(str: string, rules: iRule[]): string {

            var retVal: string = "";

            for (var i: number = 0; i < str.length; i++) {
                retVal += LSystemsUtil.Apply(str[i], rules);
            }

            return retVal;
        }


        public static Generate(axiom: string, rules: iRule[], max: number): string[] {

            var retVals: string[] = [];
            var current: string = axiom;
            retVals.push(current);
            for (var i: number = 0; i < max; i++) {
                current = LSystemsUtil.Process(current, rules)
                retVals.push(current);
            }

            return retVals;
        }
    }

    export class Worker {

        list: iRule[];
        goHandler: elementEventListener;


        constructor(config: Config) {
            debugger;
            this.init(config);
        }

        private init(config: Config) {
            this.list = [];
            if (config != null) {

                this.load(config);

            }
            this.go(null);
            this.registerEvents();
        }

        private load(config: Config) {
            Util.setValue("txtMax", config.max.toString());
            Util.setValue("txtAxiom", config.axiom);
            this.loadRules(config.rules);


        }

        private loadRules(rules: iRule[]): void {
            if (rules == null) {
                return;
            }

            for (var index in rules) {

                if (rules[index] == null || rules[index].Match.length == 0) {
                    continue;
                }

                this.list.push(rules[index]);
            }

            if (rules.length == 0) {
                return;
            }

            var html = Util.template('<%for(var i=1; i<=this.length;i++) {%> <tr> <td style="width:64px;"> Rule #<b><% i %></b> :</td><td><input type="text" name="txtRule<% i %>" id="txtRule<% i %>" value="" /> </td></tr> <% } %>', rules);
            Util.insertAdjacentHTML("rules", html);

            for (var i = 1; i <= rules.length; i++) {
                Util.setValue("txtRule" + i, config.rules[i - 1].ToString());
            }
        }

        private dispose() {
            this.deRegisterEvents();
            this.list = null;

        }

        private deRegisterEvents() {
            Util.deRegisterClick("btnGo", this.goHandler);
            Util.deRegisterClick("btnAdd", this.addHandler);
            Util.deRegisterClick("btnRemove", this.removeHandler);
        }

        private registerEvents() {
            var that = this;
            this.goHandler = function (e) { that.go(e); };

            Util.registerClick("btnGo", that.goHandler);
            Util.registerClick("btnAdd", that.addHandler);
            Util.registerClick("btnRemove", that.removeHandler);
            var that = this;
            Util.registerEvent(window, "unload", function (e) { that.dispose });
        }

        private addHandler(e: any) {
            debugger;
            var rows = document.getElementById("rules").getElementsByTagName("tr").length;
            var html = Util.template('<tr> <td style="width:64px;"> Rule #<b><% this.id %></b> :</td><td><input type="text" name="txtRule<% this.id %>" id="txtRule<% this.id %>" value="" /> </td></tr>', { id: rows + 1 });
            Util.insertAdjacentHTML("rules", html);

        }

        private removeHandler(e: any) {
            debugger;
            var rules = document.getElementById("rules");
            var rows = rules.getElementsByTagName("tr").length;
            if (rows <= 2) {
                return;
            }
            var lastRow = rules.lastChild;
            rules.removeChild(lastRow);
        }

        private go(e: any) {

            var axiom: string = Util.getValue("txtAxiom");
            var _max: string = Util.getValue("txtMax");
            var max: number = parseInt(_max) == NaN ? 4 : parseInt(_max);

            var rules: iRule[] = this.getRules();

            var vals = LSystemsUtil.Generate(axiom, rules, max);

            var html = Util.template("<ol class='old'><%for(var index in this) {%> <li>  <p> <% this[index] %> </p> </li> <% } %></ol>", vals);

            var table = document.getElementById("table");
            if (table == null) { return; }
            table.innerHTML = "";
            table.innerHTML = html;
        }

        private getRules(): iRule[] {

            var rules: iRule[] = [];

            var rows = document.getElementById("rules").getElementsByTagName("tr").length;

            for (var i = 1; i <= rows + 1; i++) {
                var val: string = Util.getValue("txtRule" + i);

                if (val != null && val.length > 0) {
                    var rule: iRule = Rule.GetRule(val);
                    rules.push(rule);
                }

            }

            return rules;
        }
    }
}

var _rules: LSystems.Rule[] =
    [
        new LSystems.Rule("I", "IU"),
        new LSystems.Rule("U", "U")
    ];
var config: Config = { axiom: "I", rules: _rules, max: 4 };

new LSystems.Worker(config);