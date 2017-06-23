/*
Author: Dileep Miriyala
L-systems String Generation
Author : m.dileep@gmail.com
Version: 0.1 Beta
Last updated on : 22-Jun-2017 11:30:00EST
*/
var LSystems;
(function (LSystems) {
    var Rule = (function () {
        function Rule(match, replace) {
            this.Match = "";
            this.Replace = "";
            this.Match = match;
            this.Replace = replace;
        }
        Rule.prototype.ToString = function () {
            return this.Match + Rule.Symbol + this.Replace;
        };
        Rule.GetRule = function (str) {
            if (str.indexOf(Rule.Symbol) < 0) {
                return null;
            }
            var array = str.split(Rule.Symbol);
            var rule = new Rule(array[0].trim(), array[1].trim());
            return rule;
        };
        Rule.Symbol = "=";
        return Rule;
    }());
    LSystems.Rule = Rule;
    var LSystemsUtil = (function () {
        function LSystemsUtil() {
        }
        LSystemsUtil.Apply = function (c, rules) {
            var retVal = "";
            var matched = false;
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                if (c == rule.Match) {
                    retVal = rule.Replace;
                    matched = true;
                }
            }
            if (!matched) {
                return c;
            }
            return retVal;
        };
        LSystemsUtil.Process = function (str, rules) {
            var retVal = "";
            for (var i = 0; i < str.length; i++) {
                retVal += LSystemsUtil.Apply(str[i], rules);
            }
            return retVal;
        };
        LSystemsUtil.Generate = function (axiom, rules, max) {
            var retVals = [];
            var current = axiom;
            retVals.push(current);
            for (var i = 0; i < max; i++) {
                current = LSystemsUtil.Process(current, rules);
                retVals.push(current);
            }
            return retVals;
        };
        return LSystemsUtil;
    }());
    LSystems.LSystemsUtil = LSystemsUtil;
    var Worker = (function () {
        function Worker(config) {
            debugger;
            this.init(config);
        }
        Worker.prototype.init = function (config) {
            this.list = [];
            if (config != null) {
                this.load(config);
            }
            this.go(null);
            this.registerEvents();
        };
        Worker.prototype.load = function (config) {
            Util.setValue("txtMax", config.max.toString());
            Util.setValue("txtAxiom", config.axiom);
            this.loadRules(config.rules);
        };
        Worker.prototype.loadRules = function (rules) {
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
        };
        Worker.prototype.dispose = function () {
            this.deRegisterEvents();
            this.list = null;
        };
        Worker.prototype.deRegisterEvents = function () {
            Util.deRegisterClick("btnGo", this.goHandler);
            Util.deRegisterClick("btnAdd", this.addHandler);
            Util.deRegisterClick("btnRemove", this.removeHandler);
        };
        Worker.prototype.registerEvents = function () {
            var that = this;
            this.goHandler = function (e) { that.go(e); };
            Util.registerClick("btnGo", that.goHandler);
            Util.registerClick("btnAdd", that.addHandler);
            Util.registerClick("btnRemove", that.removeHandler);
            var that = this;
            Util.registerEvent(window, "unload", function (e) { that.dispose; });
        };
        Worker.prototype.addHandler = function (e) {
            debugger;
            var rows = document.getElementById("rules").getElementsByTagName("tr").length;
            var html = Util.template('<tr> <td style="width:64px;"> Rule #<b><% this.id %></b> :</td><td><input type="text" name="txtRule<% this.id %>" id="txtRule<% this.id %>" value="" /> </td></tr>', { id: rows + 1 });
            Util.insertAdjacentHTML("rules", html);
        };
        Worker.prototype.removeHandler = function (e) {
            debugger;
            var rules = document.getElementById("rules");
            var rows = document.getElementById("rules").getElementsByTagName("tr").length;
            if (rows <= 2) {
                return;
            }
            var lastRow = rules.lastChild;
            rules.removeChild(lastRow);
        };
        Worker.prototype.go = function (e) {
            var axiom = Util.getValue("txtAxiom");
            var _max = Util.getValue("txtMax");
            var max = parseInt(_max) == NaN ? 4 : parseInt(_max);
            var rules = this.getRules();
            var vals = LSystemsUtil.Generate(axiom, rules, max);
            var html = Util.template("<ol class='old'><%for(var index in this) {%> <li>  <p> <% this[index] %> </p> </li> <% } %></ol>", vals);
            var table = document.getElementById("table");
            if (table == null) {
                return;
            }
            table.innerHTML = "";
            table.innerHTML = html;
        };
        Worker.prototype.getRules = function () {
            var rules = [];
            var rows = document.getElementById("rules").getElementsByTagName("tr").length;
            for (var i = 1; i <= rows + 1; i++) {
                var val = Util.getValue("txtRule" + i);
                if (val != null && val.length > 0) {
                    var rule = Rule.GetRule(val);
                    rules.push(rule);
                }
            }
            return rules;
        };
        return Worker;
    }());
    LSystems.Worker = Worker;
})(LSystems || (LSystems = {}));
var _rules = [
    new LSystems.Rule("I", "IU"),
    new LSystems.Rule("U", "U")
];
var config = { axiom: "I", rules: _rules, max: 4 };
new LSystems.Worker(config);
//# sourceMappingURL=LSystems.js.map