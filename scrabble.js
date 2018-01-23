//---------------------------------------------------------------------------------------------
// <copyright file="scrabble.ts" company="Chandam-ఛందం">
//    Copyright © 2018 'jODiMcu-జోడించు' : http://vedicchant.apphb.com
//    Original Author : Dileep Miriyala (m.dileep@gmail.com)
//    Last Updated    : 22-Feb-2018 19:19EST
//    Revisions:
//       Version    | Author                   | Email                     | Remarks
//       1.0        | Dileep Miriyala          | m.dileep@gmail.com        | Initial Commit
//       _._        | <TODO>                   |   <TODO>                  | <TODO>
// </copyright>
//---------------------------------------------------------------------------------------------
var Veda;
(function (Veda) {
    var jODiMcu = (function () {
        function jODiMcu() {
        }
        jODiMcu.OnDragOver = function (ev) {
            ev.preventDefault();
        };
        jODiMcu.OnDrag = function (ev) {
            var elem = ev.target;
            ev.dataTransfer.setData("text", elem.id);
        };
        jODiMcu.OnDrop = function (ev) {
            ev.preventDefault();
            //
            var id = ev.dataTransfer.getData("text");
            var src = document.getElementById(id);
            var srcText = src.innerHTML;
            //
            var targetElem = ev.target;
            //
            var isPuzzleCell = jODiMcu.IsPuzzleCell(targetElem);
            if (isPuzzleCell) {
                var elem = jODiMcu.DraggableElement(jODiMcu.PuzzleId + "_" + srcText, srcText);
                targetElem.appendChild(elem);
                return true;
            }
            //
            var isPuzzleBlock = jODiMcu.IsPuzzleBlock(targetElem);
            var canAppend = targetElem.getAttribute("append") == "1";
            if (isPuzzleBlock && canAppend) {
                targetElem.innerHTML += srcText;
                return true;
            }
            //
            var canTrash = jODiMcu.IsPuzzleCell(src.parentNode);
            var canDelete = true;
            if (canTrash && canDelete) {
                targetElem.innerHTML = srcText;
                src.parentNode.removeChild(src);
                return true;
            }
            return false;
        };
        jODiMcu.IsPuzzleBlock = function (elem) {
            return (elem.tagName.toLowerCase() == "span");
        };
        jODiMcu.IsPuzzleCell = function (elem) {
            return (elem.tagName.toLowerCase() == "td" && elem.getAttribute("pc") == "1");
        };
        jODiMcu.OnShowInfo = function (elem) {
            var isPuzzleBlock = jODiMcu.IsPuzzleBlock(elem);
            if (!isPuzzleBlock) {
                return;
            }
            var select = document.getElementById("Info");
            select.innerHTML = elem.innerHTML;
        };
        jODiMcu.DraggableElementSet = function (id, arr) {
            var src = document.getElementById(id);
            for (var alpha in arr) {
                var elem = jODiMcu.DraggableElement(id + "_" + arr[alpha], arr[alpha]);
                src.appendChild(elem);
            }
        };
        //Revisit All Events: Instead String, Provide Reference.
        jODiMcu.DraggableElement = function (id, text) {
            var elem = document.createElement("span");
            elem.setAttribute("draggable", "true");
            elem.setAttribute("ondragstart", "Veda.jODiMcu.OnDrag(event)");
            elem.setAttribute("onclick", "Veda.jODiMcu.OnShowInfo(this)");
            elem.setAttribute("append", "1");
            elem.setAttribute("id", id);
            elem.innerHTML = text;
            return elem;
        };
        jODiMcu.DragContainer = function (id) {
            var elem = document.getElementById(id);
            elem.setAttribute("ondrop", "Veda.jODiMcu.OnDrop(event)");
            elem.setAttribute("ondragover", "Veda.jODiMcu.OnDragOver(event)");
        };
        jODiMcu.DrawPuzzle = function (size) {
            var table = document.createElement("table");
            table.id = jODiMcu.PuzzleId + "Tab";
            for (var i = 0; i < size; i++) {
                var tr = document.createElement("tr");
                tr.id = "Row_" + (i + 1);
                for (var j = 0; j < size; j++) {
                    var td = document.createElement("td");
                    td.id = "Cell_" + (i + 1) + "_" + (j + 1);
                    td.setAttribute("pc", "1");
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            var Puzzle = document.getElementById(jODiMcu.PuzzleId);
            Puzzle.appendChild(table);
        };
        jODiMcu.Init = function () {
            jODiMcu.DragContainer("Src");
            jODiMcu.DragContainer("Puzzle");
            jODiMcu.DragContainer("Bag");
            jODiMcu.DraggableElementSet("Vowels", jODiMcu.Vowels);
            jODiMcu.DraggableElementSet("Consonants", jODiMcu.Consonants);
            jODiMcu.DrawPuzzle(5);
        };
        jODiMcu.Vowels = [
            "అ", "ఆ",
            "ఇ", "ఈ",
            "ఉ", "ఊ",
            "ఎ", "ఏ", "ఐ",
            "ఒ", "ఓ", "ఔ",
            "ఋ", "ౠ",
            "అం", "అః"];
        jODiMcu.Consonants = [
            "క", "ఖ", "గ", "ఘ", "ఙ",
            "చ", "ఛ", "జ", "ఝ", "ఞ",
            "ట", "ఠ", "డ", "ఢ", "ణ",
            "త", "థ", "ద", "ధ", "న",
            "ప", "ఫ", "బ", "భ", "మ",
            "య", "ర", "ల", "వ",
            "శ", "ష", "స",
            "హ", "ళ", "ఱ",
            "క్ష"];
        jODiMcu.PuzzleId = "Puzzle";
        return jODiMcu;
    }());
    Veda.jODiMcu = jODiMcu;
})(Veda || (Veda = {}));
new Veda.jODiMcu.Init();
