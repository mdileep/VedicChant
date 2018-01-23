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

namespace Veda {
    export class jODiMcu {
        public static Vowels: string[] = [
            "అ", "ఆ",
            "ఇ", "ఈ",
            "ఉ", "ఊ",
            "ఎ", "ఏ", "ఐ",
            "ఒ", "ఓ", "ఔ",
            "ఋ", "ౠ",
            "అం", "అః"];
        public static Consonants: string[] = [
            "క", "ఖ", "గ", "ఘ", "ఙ",
            "చ", "ఛ", "జ", "ఝ", "ఞ",
            "ట", "ఠ", "డ", "ఢ", "ణ",
            "త", "థ", "ద", "ధ", "న",
            "ప", "ఫ", "బ", "భ", "మ",
            "య", "ర", "ల", "వ",
            "శ", "ష", "స",
            "హ", "ళ", "ఱ",
            "క్ష"];

        public static OnDragOver(ev: Event) {
            ev.preventDefault();
        }

        public static OnDrag(ev: DragEvent) {
            var elem = ev.target as HTMLElement;
            ev.dataTransfer.setData("text", elem.id);
        }

        public static OnDrop(ev: DragEvent): boolean {
            ev.preventDefault();
            //
            var id = ev.dataTransfer.getData("text");
            var src = document.getElementById(id);
            var srcText = src.innerHTML;
            //
            var targetElem = ev.target as HTMLElement;
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
            var canTrash = jODiMcu.IsPuzzleCell(src.parentNode as HTMLElement);
            var canDelete = true;
            if (canTrash && canDelete) {
                targetElem.innerHTML = srcText;
                src.parentNode.removeChild(src);
                return true;
            }
            return false;
        }

        public static IsPuzzleBlock(elem: HTMLElement): boolean {
            return (elem.tagName.toLowerCase() == "span");
        }

        public static IsPuzzleCell(elem: HTMLElement): boolean {
            return (elem.tagName.toLowerCase() == "td" && elem.getAttribute("pc") == "1");
        }

        public static OnShowInfo(elem: HTMLElement) {
            var isPuzzleBlock = jODiMcu.IsPuzzleBlock(elem);
            if (!isPuzzleBlock) {
                return;
            }
            var select = document.getElementById("Info");
            select.innerHTML = elem.innerHTML;
        }

        public static DraggableElementSet(id: string, arr: string[]) {
            var src = document.getElementById(id);
            for (var alpha in arr) {
                var elem: HTMLElement = jODiMcu.DraggableElement(id + "_" + arr[alpha], arr[alpha]);
                src.appendChild(elem);
            }
        }

        //Revisit All Events: Instead String, Provide Reference.
        public static DraggableElement(id: string, text: string): HTMLElement {
            var elem: HTMLElement = document.createElement("span");
            elem.setAttribute("draggable", "true");
            elem.setAttribute("ondragstart", "Veda.jODiMcu.OnDrag(event)");
            elem.setAttribute("onclick", "Veda.jODiMcu.OnShowInfo(this)");
            elem.setAttribute("append", "1");
            elem.setAttribute("id", id);
            elem.innerHTML = text;
            return elem;
        }

        public static DragContainer(id: string) {
            var elem = document.getElementById(id);
            elem.setAttribute("ondrop", "Veda.jODiMcu.OnDrop(event)");
            elem.setAttribute("ondragover", "Veda.jODiMcu.OnDragOver(event)");
        }

        public static DrawPuzzle(size: number) {
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
        }

        public static Init() {
            jODiMcu.DragContainer("Src");
            jODiMcu.DragContainer("Puzzle");
            jODiMcu.DragContainer("Bag");
            jODiMcu.DraggableElementSet("Vowels", jODiMcu.Vowels);
            jODiMcu.DraggableElementSet("Consonants", jODiMcu.Consonants);
            jODiMcu.DrawPuzzle(5);
        }

        static PuzzleId: string = "Puzzle";
    }
}


new Veda.jODiMcu.Init();