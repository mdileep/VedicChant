/*
Author: Dileep Miriyala
Generic Javascript Utilities
Author : m.dileep@gmail.com
Version: 1.0
Last updated on : 29-Mar-2017 11:50:00EST
*/
Util = function () { }
Util.registerClick = function (id, elementEventListener) {
    Util.registerEvent(document.getElementById(id), 'click', elementEventListener);
}

Util.deRegisterClick = function (id, elementEventListener) {
    Util.deRegisterEvent(document.getElementById(id), 'click', elementEventListener);
}

Util.registerEvent = function (E, eventName, elementEventListener) {
    if (E == null) {
        return;
    }
    if (E.addEventListener != null) {
        E.addEventListener(eventName, elementEventListener, false);
    }
    else if (E.attachEvent != null) {
        E.attachEvent('on' + eventName, elementEventListener);
    }
    else {
        E['on' + eventName] = elementEventListener;
    }
}

Util.deRegisterEvent = function (E, eventName, elementEventListener) {
    if (E == null) {
        return;
    }
    if (E.removeEventListener != null) {
        E.removeEventListener(eventName, elementEventListener, false);
    }
    else if (E.detachEvent != null) {
        E.detachEvent('on' + eventName, elementEventListener);
    }
    else {
        E['on' + eventName] = elementEventListener;
    }
}
Util.makeHidden = function (Id) {
    var Elem = window.document.getElementById(Id);
    if (Elem == null) {
        return;
    }
    Elem.style.visibility = 'hidden';

}
Util.makeVisible = function (Id) {
    var Elem = window.document.getElementById(Id);
    if (Elem == null) {
        return;
    }
    Elem.style.visibility = 'visible';

}


Util.makeDisabled = function (Id) {
    var Elem = window.document.getElementById(Id);
    if (Elem == null) {
        return;
    }
    Elem.setAttribute('disabled', 'disabled');
}
Util.makeEnabled = function (Id) {
    var Elem = window.document.getElementById(Id);
    if (Elem == null) {
        return;
    }
    Elem.removeAttribute('disabled');
}
Util.getValue = function (Id) {
    if (document.getElementById(Id) == null) {
        return '';
    }
    return document.getElementById(Id).value.toString();
}
Util.ajax = function (endPoint, callBack, errorCallback, actionCallback, httpMethod, post, contentType) {

    if (actionCallback != null) {
        actionCallback(true);
    }

    var requestTimeout, xhr;
    try {
        xhr = new XMLHttpRequest();
    } catch (e) {

        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            alert(e.message);
            return null;
        }
    }
    requestTimeout = setTimeout(function () {

        xhr.abort();

        errorCallback("ABORT", "XHR Timeout", xhr);

        if (actionCallback != null) {
            actionCallback(false);
        }

    }, 6000 * 10);

    xhr.onreadystatechange = function () {

        if (xhr.readyState != 4) return;

        clearTimeout(requestTimeout);

        if (xhr.status != 200) {
            errorCallback(xhr.status, xhr.responseText, xhr);
        }
        else {
            callBack(xhr.responseText, xhr);
        }

        if (actionCallback != null) {
            actionCallback(false);
        }
    }
    xhr.open(httpMethod == null ? "GET" : httpMethod.toUpperCase(), endPoint, true);

    if (httpMethod != null && httpMethod.toUpperCase() == "POST") {
        xhr.setRequestHeader('Content-type', contentType != null ? contentType : 'application/x-www-form-urlencoded');
        xhr.send(post);
        return;
    }

    xhr.send();
}

Util.createEndPoint = function (url, params) {

    url = url + Util.postQuery(params, true);
    url = url.substring(0, url.length - 1);
    return url;
}

Util.postQuery = function (params, isGet) {
    var temp = "";
    var cnt = 0;
    for (var key in params) {

        if (!params.hasOwnProperty(key)) {

            continue;
        }

        if (cnt == 0 && isGet) {
            temp = temp + "?";
        }

        temp = temp + key + "=" + params[key] + "&";
        cnt++;
    }

    return temp;
}

Util.selectedValue = function (id) {
    var E = window.document.getElementById(id);
    if (E.selectedIndex == -1) {
        return null;
    }
    var v = E.options[E.selectedIndex].value;
    return v;
}

Util.isChecked = function (Id) {
    if (document.getElementById(Id) == null) {
        return false;
    }
    return document.getElementById(Id).checked;
}

Util.setValue = function (Id, D) {
    if (document.getElementById(Id) == null) {
        return;
    }
    document.getElementById(Id).value = D;
}

Util.template = function (html, options) {
    //Refer: http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line
    var re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0, match;
    var add = function (line, js) {
        js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}