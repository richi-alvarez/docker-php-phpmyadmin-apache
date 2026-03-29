!function(e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document)
            throw new Error("jQuery requires a window with a document");
        return t(e)
    }
    : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
    "use strict";
    var c = []
      , n = e.document
      , i = Object.getPrototypeOf
      , a = c.slice
      , r = c.concat
      , s = c.push
      , l = c.indexOf
      , o = {}
      , h = o.toString
      , v = o.hasOwnProperty
      , u = v.toString
      , d = u.call(Object)
      , m = {}
      , f = function(e) {
        return "function" == typeof e && "number" != typeof e.nodeType
    }
      , p = function(e) {
        return null != e && e === e.window
    }
      , z = {
        type: !0,
        src: !0,
        noModule: !0
    };
    function g(e, t, c) {
        var i, a = (t = t || n).createElement("script");
        if (a.text = e,
        c)
            for (i in z)
                c[i] && (a[i] = c[i]);
        t.head.appendChild(a).parentNode.removeChild(a)
    }
    function M(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? o[h.call(e)] || "object" : typeof e
    }
    var C = function(e, t) {
        return new C.fn.init(e,t)
    }
      , y = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    function H(e) {
        var t = !!e && "length"in e && e.length
          , c = M(e);
        return !f(e) && !p(e) && ("array" === c || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
    }
    C.fn = C.prototype = {
        jquery: "3.3.1",
        constructor: C,
        length: 0,
        toArray: function() {
            return a.call(this)
        },
        get: function(e) {
            return null == e ? a.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function(e) {
            var t = C.merge(this.constructor(), e);
            return t.prevObject = this,
            t
        },
        each: function(e) {
            return C.each(this, e)
        },
        map: function(e) {
            return this.pushStack(C.map(this, function(t, c) {
                return e.call(t, c, t)
            }))
        },
        slice: function() {
            return this.pushStack(a.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length
              , c = +e + (e < 0 ? t : 0);
            return this.pushStack(c >= 0 && c < t ? [this[c]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: s,
        sort: c.sort,
        splice: c.splice
    },
    C.extend = C.fn.extend = function() {
        var e, t, c, n, i, a, r = arguments[0] || {}, s = 1, l = arguments.length, o = !1;
        for ("boolean" == typeof r && (o = r,
        r = arguments[s] || {},
        s++),
        "object" == typeof r || f(r) || (r = {}),
        s === l && (r = this,
        s--); s < l; s++)
            if (null != (e = arguments[s]))
                for (t in e)
                    c = r[t],
                    r !== (n = e[t]) && (o && n && (C.isPlainObject(n) || (i = Array.isArray(n))) ? (i ? (i = !1,
                    a = c && Array.isArray(c) ? c : []) : a = c && C.isPlainObject(c) ? c : {},
                    r[t] = C.extend(o, a, n)) : void 0 !== n && (r[t] = n));
        return r
    }
    ,
    C.extend({
        expando: "jQuery" + ("3.3.1" + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isPlainObject: function(e) {
            var t, c;
            return !(!e || "[object Object]" !== h.call(e) || (t = i(e)) && ("function" != typeof (c = v.call(t, "constructor") && t.constructor) || u.call(c) !== d))
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        },
        globalEval: function(e) {
            g(e)
        },
        each: function(e, t) {
            var c, n = 0;
            if (H(e))
                for (c = e.length; n < c && !1 !== t.call(e[n], n, e[n]); n++)
                    ;
            else
                for (n in e)
                    if (!1 === t.call(e[n], n, e[n]))
                        break;
            return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(y, "")
        },
        makeArray: function(e, t) {
            var c = t || [];
            return null != e && (H(Object(e)) ? C.merge(c, "string" == typeof e ? [e] : e) : s.call(c, e)),
            c
        },
        inArray: function(e, t, c) {
            return null == t ? -1 : l.call(t, e, c)
        },
        merge: function(e, t) {
            for (var c = +t.length, n = 0, i = e.length; n < c; n++)
                e[i++] = t[n];
            return e.length = i,
            e
        },
        grep: function(e, t, c) {
            for (var n = [], i = 0, a = e.length, r = !c; i < a; i++)
                !t(e[i], i) !== r && n.push(e[i]);
            return n
        },
        map: function(e, t, c) {
            var n, i, a = 0, s = [];
            if (H(e))
                for (n = e.length; a < n; a++)
                    null != (i = t(e[a], a, c)) && s.push(i);
            else
                for (a in e)
                    null != (i = t(e[a], a, c)) && s.push(i);
            return r.apply([], s)
        },
        guid: 1,
        support: m
    }),
    "function" == typeof Symbol && (C.fn[Symbol.iterator] = c[Symbol.iterator]),
    C.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
        o["[object " + t + "]"] = t.toLowerCase()
    });
    var b = function(e) {
        var t, c, n, i, a, r, s, l, o, h, v, u, d, m, f, p, z, g, M, C = "sizzle" + 1 * new Date, y = e.document, H = 0, b = 0, V = re(), L = re(), x = re(), w = function(e, t) {
            return e === t && (v = !0),
            0
        }, k = {}.hasOwnProperty, $ = [], _ = $.pop, E = $.push, S = $.push, A = $.slice, T = function(e, t) {
            for (var c = 0, n = e.length; c < n; c++)
                if (e[c] === t)
                    return c;
            return -1
        }, D = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", P = "[\\x20\\t\\r\\n\\f]", N = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+", j = "\\[" + P + "*(" + N + ")(?:" + P + "*([*^$|!~]?=)" + P + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + N + "))|)" + P + "*\\]", O = ":(" + N + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + j + ")*)|.*)\\)|)", I = new RegExp(P + "+","g"), q = new RegExp("^" + P + "+|((?:^|[^\\\\])(?:\\\\.)*)" + P + "+$","g"), R = new RegExp("^" + P + "*," + P + "*"), F = new RegExp("^" + P + "*([>+~]|" + P + ")" + P + "*"), B = new RegExp("=" + P + "*([^\\]'\"]*?)" + P + "*\\]","g"), U = new RegExp(O), W = new RegExp("^" + N + "$"), X = {
            ID: new RegExp("^#(" + N + ")"),
            CLASS: new RegExp("^\\.(" + N + ")"),
            TAG: new RegExp("^(" + N + "|[*])"),
            ATTR: new RegExp("^" + j),
            PSEUDO: new RegExp("^" + O),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + P + "*(even|odd|(([+-]|)(\\d*)n|)" + P + "*(?:([+-]|)" + P + "*(\\d+)|))" + P + "*\\)|)","i"),
            bool: new RegExp("^(?:" + D + ")$","i"),
            needsContext: new RegExp("^" + P + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + P + "*((?:-\\d)?\\d*)" + P + "*\\)|)(?=[^-]|$)","i")
        }, K = /^(?:input|select|textarea|button)$/i, Y = /^h\d$/i, G = /^[^{]+\{\s*\[native \w/, Q = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, Z = /[+~]/, J = new RegExp("\\\\([\\da-f]{1,6}" + P + "?|(" + P + ")|.)","ig"), ee = function(e, t, c) {
            var n = "0x" + t - 65536;
            return n != n || c ? t : n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320)
        }, te = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, ce = function(e, t) {
            return t ? "\0" === e ? "�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
        }, ne = function() {
            u()
        }, ie = ge(function(e) {
            return !0 === e.disabled && ("form"in e || "label"in e)
        }, {
            dir: "parentNode",
            next: "legend"
        });
        try {
            S.apply($ = A.call(y.childNodes), y.childNodes),
            $[y.childNodes.length].nodeType
        } catch (e) {
            S = {
                apply: $.length ? function(e, t) {
                    E.apply(e, A.call(t))
                }
                : function(e, t) {
                    for (var c = e.length, n = 0; e[c++] = t[n++]; )
                        ;
                    e.length = c - 1
                }
            }
        }
        function ae(e, t, n, i) {
            var a, s, o, h, v, m, z, g = t && t.ownerDocument, H = t ? t.nodeType : 9;
            if (n = n || [],
            "string" != typeof e || !e || 1 !== H && 9 !== H && 11 !== H)
                return n;
            if (!i && ((t ? t.ownerDocument || t : y) !== d && u(t),
            t = t || d,
            f)) {
                if (11 !== H && (v = Q.exec(e)))
                    if (a = v[1]) {
                        if (9 === H) {
                            if (!(o = t.getElementById(a)))
                                return n;
                            if (o.id === a)
                                return n.push(o),
                                n
                        } else if (g && (o = g.getElementById(a)) && M(t, o) && o.id === a)
                            return n.push(o),
                            n
                    } else {
                        if (v[2])
                            return S.apply(n, t.getElementsByTagName(e)),
                            n;
                        if ((a = v[3]) && c.getElementsByClassName && t.getElementsByClassName)
                            return S.apply(n, t.getElementsByClassName(a)),
                            n
                    }
                if (c.qsa && !x[e + " "] && (!p || !p.test(e))) {
                    if (1 !== H)
                        g = t,
                        z = e;
                    else if ("object" !== t.nodeName.toLowerCase()) {
                        for ((h = t.getAttribute("id")) ? h = h.replace(te, ce) : t.setAttribute("id", h = C),
                        s = (m = r(e)).length; s--; )
                            m[s] = "#" + h + " " + ze(m[s]);
                        z = m.join(","),
                        g = Z.test(e) && fe(t.parentNode) || t
                    }
                    if (z)
                        try {
                            return S.apply(n, g.querySelectorAll(z)),
                            n
                        } catch (e) {} finally {
                            h === C && t.removeAttribute("id")
                        }
                }
            }
            return l(e.replace(q, "$1"), t, n, i)
        }
        function re() {
            var e = [];
            return function t(c, i) {
                return e.push(c + " ") > n.cacheLength && delete t[e.shift()],
                t[c + " "] = i
            }
        }
        function se(e) {
            return e[C] = !0,
            e
        }
        function le(e) {
            var t = d.createElement("fieldset");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t),
                t = null
            }
        }
        function oe(e, t) {
            for (var c = e.split("|"), i = c.length; i--; )
                n.attrHandle[c[i]] = t
        }
        function he(e, t) {
            var c = t && e
              , n = c && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (n)
                return n;
            if (c)
                for (; c = c.nextSibling; )
                    if (c === t)
                        return -1;
            return e ? 1 : -1
        }
        function ve(e) {
            return function(t) {
                return "input" === t.nodeName.toLowerCase() && t.type === e
            }
        }
        function ue(e) {
            return function(t) {
                var c = t.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && t.type === e
            }
        }
        function de(e) {
            return function(t) {
                return "form"in t ? t.parentNode && !1 === t.disabled ? "label"in t ? "label"in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && ie(t) === e : t.disabled === e : "label"in t && t.disabled === e
            }
        }
        function me(e) {
            return se(function(t) {
                return t = +t,
                se(function(c, n) {
                    for (var i, a = e([], c.length, t), r = a.length; r--; )
                        c[i = a[r]] && (c[i] = !(n[i] = c[i]))
                })
            })
        }
        function fe(e) {
            return e && void 0 !== e.getElementsByTagName && e
        }
        for (t in c = ae.support = {},
        a = ae.isXML = function(e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return !!t && "HTML" !== t.nodeName
        }
        ,
        u = ae.setDocument = function(e) {
            var t, i, r = e ? e.ownerDocument || e : y;
            return r !== d && 9 === r.nodeType && r.documentElement ? (m = (d = r).documentElement,
            f = !a(d),
            y !== d && (i = d.defaultView) && i.top !== i && (i.addEventListener ? i.addEventListener("unload", ne, !1) : i.attachEvent && i.attachEvent("onunload", ne)),
            c.attributes = le(function(e) {
                return e.className = "i",
                !e.getAttribute("className")
            }),
            c.getElementsByTagName = le(function(e) {
                return e.appendChild(d.createComment("")),
                !e.getElementsByTagName("*").length
            }),
            c.getElementsByClassName = G.test(d.getElementsByClassName),
            c.getById = le(function(e) {
                return m.appendChild(e).id = C,
                !d.getElementsByName || !d.getElementsByName(C).length
            }),
            c.getById ? (n.filter.ID = function(e) {
                var t = e.replace(J, ee);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }
            ,
            n.find.ID = function(e, t) {
                if (void 0 !== t.getElementById && f) {
                    var c = t.getElementById(e);
                    return c ? [c] : []
                }
            }
            ) : (n.filter.ID = function(e) {
                var t = e.replace(J, ee);
                return function(e) {
                    var c = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                    return c && c.value === t
                }
            }
            ,
            n.find.ID = function(e, t) {
                if (void 0 !== t.getElementById && f) {
                    var c, n, i, a = t.getElementById(e);
                    if (a) {
                        if ((c = a.getAttributeNode("id")) && c.value === e)
                            return [a];
                        for (i = t.getElementsByName(e),
                        n = 0; a = i[n++]; )
                            if ((c = a.getAttributeNode("id")) && c.value === e)
                                return [a]
                    }
                    return []
                }
            }
            ),
            n.find.TAG = c.getElementsByTagName ? function(e, t) {
                return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : c.qsa ? t.querySelectorAll(e) : void 0
            }
            : function(e, t) {
                var c, n = [], i = 0, a = t.getElementsByTagName(e);
                if ("*" === e) {
                    for (; c = a[i++]; )
                        1 === c.nodeType && n.push(c);
                    return n
                }
                return a
            }
            ,
            n.find.CLASS = c.getElementsByClassName && function(e, t) {
                if (void 0 !== t.getElementsByClassName && f)
                    return t.getElementsByClassName(e)
            }
            ,
            z = [],
            p = [],
            (c.qsa = G.test(d.querySelectorAll)) && (le(function(e) {
                m.appendChild(e).innerHTML = "<a id='" + C + "'></a><select id='" + C + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                e.querySelectorAll("[msallowcapture^='']").length && p.push("[*^$]=" + P + "*(?:''|\"\")"),
                e.querySelectorAll("[selected]").length || p.push("\\[" + P + "*(?:value|" + D + ")"),
                e.querySelectorAll("[id~=" + C + "-]").length || p.push("~="),
                e.querySelectorAll(":checked").length || p.push(":checked"),
                e.querySelectorAll("a#" + C + "+*").length || p.push(".#.+[+~]")
            }),
            le(function(e) {
                e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var t = d.createElement("input");
                t.setAttribute("type", "hidden"),
                e.appendChild(t).setAttribute("name", "D"),
                e.querySelectorAll("[name=d]").length && p.push("name" + P + "*[*^$|!~]?="),
                2 !== e.querySelectorAll(":enabled").length && p.push(":enabled", ":disabled"),
                m.appendChild(e).disabled = !0,
                2 !== e.querySelectorAll(":disabled").length && p.push(":enabled", ":disabled"),
                e.querySelectorAll("*,:x"),
                p.push(",.*:")
            })),
            (c.matchesSelector = G.test(g = m.matches || m.webkitMatchesSelector || m.mozMatchesSelector || m.oMatchesSelector || m.msMatchesSelector)) && le(function(e) {
                c.disconnectedMatch = g.call(e, "*"),
                g.call(e, "[s!='']:x"),
                z.push("!=", O)
            }),
            p = p.length && new RegExp(p.join("|")),
            z = z.length && new RegExp(z.join("|")),
            t = G.test(m.compareDocumentPosition),
            M = t || G.test(m.contains) ? function(e, t) {
                var c = 9 === e.nodeType ? e.documentElement : e
                  , n = t && t.parentNode;
                return e === n || !(!n || 1 !== n.nodeType || !(c.contains ? c.contains(n) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(n)))
            }
            : function(e, t) {
                if (t)
                    for (; t = t.parentNode; )
                        if (t === e)
                            return !0;
                return !1
            }
            ,
            w = t ? function(e, t) {
                if (e === t)
                    return v = !0,
                    0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !c.sortDetached && t.compareDocumentPosition(e) === n ? e === d || e.ownerDocument === y && M(y, e) ? -1 : t === d || t.ownerDocument === y && M(y, t) ? 1 : h ? T(h, e) - T(h, t) : 0 : 4 & n ? -1 : 1)
            }
            : function(e, t) {
                if (e === t)
                    return v = !0,
                    0;
                var c, n = 0, i = e.parentNode, a = t.parentNode, r = [e], s = [t];
                if (!i || !a)
                    return e === d ? -1 : t === d ? 1 : i ? -1 : a ? 1 : h ? T(h, e) - T(h, t) : 0;
                if (i === a)
                    return he(e, t);
                for (c = e; c = c.parentNode; )
                    r.unshift(c);
                for (c = t; c = c.parentNode; )
                    s.unshift(c);
                for (; r[n] === s[n]; )
                    n++;
                return n ? he(r[n], s[n]) : r[n] === y ? -1 : s[n] === y ? 1 : 0
            }
            ,
            d) : d
        }
        ,
        ae.matches = function(e, t) {
            return ae(e, null, null, t)
        }
        ,
        ae.matchesSelector = function(e, t) {
            if ((e.ownerDocument || e) !== d && u(e),
            t = t.replace(B, "='$1']"),
            c.matchesSelector && f && !x[t + " "] && (!z || !z.test(t)) && (!p || !p.test(t)))
                try {
                    var n = g.call(e, t);
                    if (n || c.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                        return n
                } catch (e) {}
            return ae(t, d, null, [e]).length > 0
        }
        ,
        ae.contains = function(e, t) {
            return (e.ownerDocument || e) !== d && u(e),
            M(e, t)
        }
        ,
        ae.attr = function(e, t) {
            (e.ownerDocument || e) !== d && u(e);
            var i = n.attrHandle[t.toLowerCase()]
              , a = i && k.call(n.attrHandle, t.toLowerCase()) ? i(e, t, !f) : void 0;
            return void 0 !== a ? a : c.attributes || !f ? e.getAttribute(t) : (a = e.getAttributeNode(t)) && a.specified ? a.value : null
        }
        ,
        ae.escape = function(e) {
            return (e + "").replace(te, ce)
        }
        ,
        ae.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }
        ,
        ae.uniqueSort = function(e) {
            var t, n = [], i = 0, a = 0;
            if (v = !c.detectDuplicates,
            h = !c.sortStable && e.slice(0),
            e.sort(w),
            v) {
                for (; t = e[a++]; )
                    t === e[a] && (i = n.push(a));
                for (; i--; )
                    e.splice(n[i], 1)
            }
            return h = null,
            e
        }
        ,
        i = ae.getText = function(e) {
            var t, c = "", n = 0, a = e.nodeType;
            if (a) {
                if (1 === a || 9 === a || 11 === a) {
                    if ("string" == typeof e.textContent)
                        return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling)
                        c += i(e)
                } else if (3 === a || 4 === a)
                    return e.nodeValue
            } else
                for (; t = e[n++]; )
                    c += i(t);
            return c
        }
        ,
        (n = ae.selectors = {
            cacheLength: 50,
            createPseudo: se,
            match: X,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(J, ee),
                    e[3] = (e[3] || e[4] || e[5] || "").replace(J, ee),
                    "~=" === e[2] && (e[3] = " " + e[3] + " "),
                    e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(),
                    "nth" === e[1].slice(0, 3) ? (e[3] || ae.error(e[0]),
                    e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                    e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && ae.error(e[0]),
                    e
                },
                PSEUDO: function(e) {
                    var t, c = !e[6] && e[2];
                    return X.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : c && U.test(c) && (t = r(c, !0)) && (t = c.indexOf(")", c.length - t) - c.length) && (e[0] = e[0].slice(0, t),
                    e[2] = c.slice(0, t)),
                    e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(J, ee).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    }
                    : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = V[e + " "];
                    return t || (t = new RegExp("(^|" + P + ")" + e + "(" + P + "|$)")) && V(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(e, t, c) {
                    return function(n) {
                        var i = ae.attr(n, e);
                        return null == i ? "!=" === t : !t || (i += "",
                        "=" === t ? i === c : "!=" === t ? i !== c : "^=" === t ? c && 0 === i.indexOf(c) : "*=" === t ? c && i.indexOf(c) > -1 : "$=" === t ? c && i.slice(-c.length) === c : "~=" === t ? (" " + i.replace(I, " ") + " ").indexOf(c) > -1 : "|=" === t && (i === c || i.slice(0, c.length + 1) === c + "-"))
                    }
                },
                CHILD: function(e, t, c, n, i) {
                    var a = "nth" !== e.slice(0, 3)
                      , r = "last" !== e.slice(-4)
                      , s = "of-type" === t;
                    return 1 === n && 0 === i ? function(e) {
                        return !!e.parentNode
                    }
                    : function(t, c, l) {
                        var o, h, v, u, d, m, f = a !== r ? "nextSibling" : "previousSibling", p = t.parentNode, z = s && t.nodeName.toLowerCase(), g = !l && !s, M = !1;
                        if (p) {
                            if (a) {
                                for (; f; ) {
                                    for (u = t; u = u[f]; )
                                        if (s ? u.nodeName.toLowerCase() === z : 1 === u.nodeType)
                                            return !1;
                                    m = f = "only" === e && !m && "nextSibling"
                                }
                                return !0
                            }
                            if (m = [r ? p.firstChild : p.lastChild],
                            r && g) {
                                for (M = (d = (o = (h = (v = (u = p)[C] || (u[C] = {}))[u.uniqueID] || (v[u.uniqueID] = {}))[e] || [])[0] === H && o[1]) && o[2],
                                u = d && p.childNodes[d]; u = ++d && u && u[f] || (M = d = 0) || m.pop(); )
                                    if (1 === u.nodeType && ++M && u === t) {
                                        h[e] = [H, d, M];
                                        break
                                    }
                            } else if (g && (M = d = (o = (h = (v = (u = t)[C] || (u[C] = {}))[u.uniqueID] || (v[u.uniqueID] = {}))[e] || [])[0] === H && o[1]),
                            !1 === M)
                                for (; (u = ++d && u && u[f] || (M = d = 0) || m.pop()) && ((s ? u.nodeName.toLowerCase() !== z : 1 !== u.nodeType) || !++M || (g && ((h = (v = u[C] || (u[C] = {}))[u.uniqueID] || (v[u.uniqueID] = {}))[e] = [H, M]),
                                u !== t)); )
                                    ;
                            return (M -= i) === n || M % n == 0 && M / n >= 0
                        }
                    }
                },
                PSEUDO: function(e, t) {
                    var c, i = n.pseudos[e] || n.setFilters[e.toLowerCase()] || ae.error("unsupported pseudo: " + e);
                    return i[C] ? i(t) : i.length > 1 ? (c = [e, e, "", t],
                    n.setFilters.hasOwnProperty(e.toLowerCase()) ? se(function(e, c) {
                        for (var n, a = i(e, t), r = a.length; r--; )
                            e[n = T(e, a[r])] = !(c[n] = a[r])
                    }) : function(e) {
                        return i(e, 0, c)
                    }
                    ) : i
                }
            },
            pseudos: {
                not: se(function(e) {
                    var t = []
                      , c = []
                      , n = s(e.replace(q, "$1"));
                    return n[C] ? se(function(e, t, c, i) {
                        for (var a, r = n(e, null, i, []), s = e.length; s--; )
                            (a = r[s]) && (e[s] = !(t[s] = a))
                    }) : function(e, i, a) {
                        return t[0] = e,
                        n(t, null, a, c),
                        t[0] = null,
                        !c.pop()
                    }
                }),
                has: se(function(e) {
                    return function(t) {
                        return ae(e, t).length > 0
                    }
                }),
                contains: se(function(e) {
                    return e = e.replace(J, ee),
                    function(t) {
                        return (t.textContent || t.innerText || i(t)).indexOf(e) > -1
                    }
                }),
                lang: se(function(e) {
                    return W.test(e || "") || ae.error("unsupported lang: " + e),
                    e = e.replace(J, ee).toLowerCase(),
                    function(t) {
                        var c;
                        do {
                            if (c = f ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang"))
                                return (c = c.toLowerCase()) === e || 0 === c.indexOf(e + "-")
                        } while ((t = t.parentNode) && 1 === t.nodeType);
                        return !1
                    }
                }),
                target: function(t) {
                    var c = e.location && e.location.hash;
                    return c && c.slice(1) === t.id
                },
                root: function(e) {
                    return e === m
                },
                focus: function(e) {
                    return e === d.activeElement && (!d.hasFocus || d.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: de(!1),
                disabled: de(!0),
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex,
                    !0 === e.selected
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(e) {
                    return !n.pseudos.empty(e)
                },
                header: function(e) {
                    return Y.test(e.nodeName)
                },
                input: function(e) {
                    return K.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: me(function() {
                    return [0]
                }),
                last: me(function(e, t) {
                    return [t - 1]
                }),
                eq: me(function(e, t, c) {
                    return [c < 0 ? c + t : c]
                }),
                even: me(function(e, t) {
                    for (var c = 0; c < t; c += 2)
                        e.push(c);
                    return e
                }),
                odd: me(function(e, t) {
                    for (var c = 1; c < t; c += 2)
                        e.push(c);
                    return e
                }),
                lt: me(function(e, t, c) {
                    for (var n = c < 0 ? c + t : c; --n >= 0; )
                        e.push(n);
                    return e
                }),
                gt: me(function(e, t, c) {
                    for (var n = c < 0 ? c + t : c; ++n < t; )
                        e.push(n);
                    return e
                })
            }
        }).pseudos.nth = n.pseudos.eq,
        {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            n.pseudos[t] = ve(t);
        for (t in {
            submit: !0,
            reset: !0
        })
            n.pseudos[t] = ue(t);
        function pe() {}
        function ze(e) {
            for (var t = 0, c = e.length, n = ""; t < c; t++)
                n += e[t].value;
            return n
        }
        function ge(e, t, c) {
            var n = t.dir
              , i = t.next
              , a = i || n
              , r = c && "parentNode" === a
              , s = b++;
            return t.first ? function(t, c, i) {
                for (; t = t[n]; )
                    if (1 === t.nodeType || r)
                        return e(t, c, i);
                return !1
            }
            : function(t, c, l) {
                var o, h, v, u = [H, s];
                if (l) {
                    for (; t = t[n]; )
                        if ((1 === t.nodeType || r) && e(t, c, l))
                            return !0
                } else
                    for (; t = t[n]; )
                        if (1 === t.nodeType || r)
                            if (h = (v = t[C] || (t[C] = {}))[t.uniqueID] || (v[t.uniqueID] = {}),
                            i && i === t.nodeName.toLowerCase())
                                t = t[n] || t;
                            else {
                                if ((o = h[a]) && o[0] === H && o[1] === s)
                                    return u[2] = o[2];
                                if (h[a] = u,
                                u[2] = e(t, c, l))
                                    return !0
                            }
                return !1
            }
        }
        function Me(e) {
            return e.length > 1 ? function(t, c, n) {
                for (var i = e.length; i--; )
                    if (!e[i](t, c, n))
                        return !1;
                return !0
            }
            : e[0]
        }
        function Ce(e, t, c, n, i) {
            for (var a, r = [], s = 0, l = e.length, o = null != t; s < l; s++)
                (a = e[s]) && (c && !c(a, n, i) || (r.push(a),
                o && t.push(s)));
            return r
        }
        function ye(e, t, c, n, i, a) {
            return n && !n[C] && (n = ye(n)),
            i && !i[C] && (i = ye(i, a)),
            se(function(a, r, s, l) {
                var o, h, v, u = [], d = [], m = r.length, f = a || function(e, t, c) {
                    for (var n = 0, i = t.length; n < i; n++)
                        ae(e, t[n], c);
                    return c
                }(t || "*", s.nodeType ? [s] : s, []), p = !e || !a && t ? f : Ce(f, u, e, s, l), z = c ? i || (a ? e : m || n) ? [] : r : p;
                if (c && c(p, z, s, l),
                n)
                    for (o = Ce(z, d),
                    n(o, [], s, l),
                    h = o.length; h--; )
                        (v = o[h]) && (z[d[h]] = !(p[d[h]] = v));
                if (a) {
                    if (i || e) {
                        if (i) {
                            for (o = [],
                            h = z.length; h--; )
                                (v = z[h]) && o.push(p[h] = v);
                            i(null, z = [], o, l)
                        }
                        for (h = z.length; h--; )
                            (v = z[h]) && (o = i ? T(a, v) : u[h]) > -1 && (a[o] = !(r[o] = v))
                    }
                } else
                    z = Ce(z === r ? z.splice(m, z.length) : z),
                    i ? i(null, r, z, l) : S.apply(r, z)
            })
        }
        function He(e) {
            for (var t, c, i, a = e.length, r = n.relative[e[0].type], s = r || n.relative[" "], l = r ? 1 : 0, h = ge(function(e) {
                return e === t
            }, s, !0), v = ge(function(e) {
                return T(t, e) > -1
            }, s, !0), u = [function(e, c, n) {
                var i = !r && (n || c !== o) || ((t = c).nodeType ? h(e, c, n) : v(e, c, n));
                return t = null,
                i
            }
            ]; l < a; l++)
                if (c = n.relative[e[l].type])
                    u = [ge(Me(u), c)];
                else {
                    if ((c = n.filter[e[l].type].apply(null, e[l].matches))[C]) {
                        for (i = ++l; i < a && !n.relative[e[i].type]; i++)
                            ;
                        return ye(l > 1 && Me(u), l > 1 && ze(e.slice(0, l - 1).concat({
                            value: " " === e[l - 2].type ? "*" : ""
                        })).replace(q, "$1"), c, l < i && He(e.slice(l, i)), i < a && He(e = e.slice(i)), i < a && ze(e))
                    }
                    u.push(c)
                }
            return Me(u)
        }
        function be(e, t) {
            var c = t.length > 0
              , i = e.length > 0
              , a = function(a, r, s, l, h) {
                var v, m, p, z = 0, g = "0", M = a && [], C = [], y = o, b = a || i && n.find.TAG("*", h), V = H += null == y ? 1 : Math.random() || .1, L = b.length;
                for (h && (o = r === d || r || h); g !== L && null != (v = b[g]); g++) {
                    if (i && v) {
                        for (m = 0,
                        r || v.ownerDocument === d || (u(v),
                        s = !f); p = e[m++]; )
                            if (p(v, r || d, s)) {
                                l.push(v);
                                break
                            }
                        h && (H = V)
                    }
                    c && ((v = !p && v) && z--,
                    a && M.push(v))
                }
                if (z += g,
                c && g !== z) {
                    for (m = 0; p = t[m++]; )
                        p(M, C, r, s);
                    if (a) {
                        if (z > 0)
                            for (; g--; )
                                M[g] || C[g] || (C[g] = _.call(l));
                        C = Ce(C)
                    }
                    S.apply(l, C),
                    h && !a && C.length > 0 && z + t.length > 1 && ae.uniqueSort(l)
                }
                return h && (H = V,
                o = y),
                M
            };
            return c ? se(a) : a
        }
        return pe.prototype = n.filters = n.pseudos,
        n.setFilters = new pe,
        r = ae.tokenize = function(e, t) {
            var c, i, a, r, s, l, o, h = L[e + " "];
            if (h)
                return t ? 0 : h.slice(0);
            for (s = e,
            l = [],
            o = n.preFilter; s; ) {
                for (r in c && !(i = R.exec(s)) || (i && (s = s.slice(i[0].length) || s),
                l.push(a = [])),
                c = !1,
                (i = F.exec(s)) && (c = i.shift(),
                a.push({
                    value: c,
                    type: i[0].replace(q, " ")
                }),
                s = s.slice(c.length)),
                n.filter)
                    !(i = X[r].exec(s)) || o[r] && !(i = o[r](i)) || (c = i.shift(),
                    a.push({
                        value: c,
                        type: r,
                        matches: i
                    }),
                    s = s.slice(c.length));
                if (!c)
                    break
            }
            return t ? s.length : s ? ae.error(e) : L(e, l).slice(0)
        }
        ,
        s = ae.compile = function(e, t) {
            var c, n = [], i = [], a = x[e + " "];
            if (!a) {
                for (t || (t = r(e)),
                c = t.length; c--; )
                    (a = He(t[c]))[C] ? n.push(a) : i.push(a);
                (a = x(e, be(i, n))).selector = e
            }
            return a
        }
        ,
        l = ae.select = function(e, t, c, i) {
            var a, l, o, h, v, u = "function" == typeof e && e, d = !i && r(e = u.selector || e);
            if (c = c || [],
            1 === d.length) {
                if ((l = d[0] = d[0].slice(0)).length > 2 && "ID" === (o = l[0]).type && 9 === t.nodeType && f && n.relative[l[1].type]) {
                    if (!(t = (n.find.ID(o.matches[0].replace(J, ee), t) || [])[0]))
                        return c;
                    u && (t = t.parentNode),
                    e = e.slice(l.shift().value.length)
                }
                for (a = X.needsContext.test(e) ? 0 : l.length; a-- && (o = l[a],
                !n.relative[h = o.type]); )
                    if ((v = n.find[h]) && (i = v(o.matches[0].replace(J, ee), Z.test(l[0].type) && fe(t.parentNode) || t))) {
                        if (l.splice(a, 1),
                        !(e = i.length && ze(l)))
                            return S.apply(c, i),
                            c;
                        break
                    }
            }
            return (u || s(e, d))(i, t, !f, c, !t || Z.test(e) && fe(t.parentNode) || t),
            c
        }
        ,
        c.sortStable = C.split("").sort(w).join("") === C,
        c.detectDuplicates = !!v,
        u(),
        c.sortDetached = le(function(e) {
            return 1 & e.compareDocumentPosition(d.createElement("fieldset"))
        }),
        le(function(e) {
            return e.innerHTML = "<a href='#'></a>",
            "#" === e.firstChild.getAttribute("href")
        }) || oe("type|href|height|width", function(e, t, c) {
            if (!c)
                return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }),
        c.attributes && le(function(e) {
            return e.innerHTML = "<input/>",
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
        }) || oe("value", function(e, t, c) {
            if (!c && "input" === e.nodeName.toLowerCase())
                return e.defaultValue
        }),
        le(function(e) {
            return null == e.getAttribute("disabled")
        }) || oe(D, function(e, t, c) {
            var n;
            if (!c)
                return !0 === e[t] ? t.toLowerCase() : (n = e.getAttributeNode(t)) && n.specified ? n.value : null
        }),
        ae
    }(e);
    C.find = b,
    C.expr = b.selectors,
    C.expr[":"] = C.expr.pseudos,
    C.uniqueSort = C.unique = b.uniqueSort,
    C.text = b.getText,
    C.isXMLDoc = b.isXML,
    C.contains = b.contains,
    C.escapeSelector = b.escape;
    var V = function(e, t, c) {
        for (var n = [], i = void 0 !== c; (e = e[t]) && 9 !== e.nodeType; )
            if (1 === e.nodeType) {
                if (i && C(e).is(c))
                    break;
                n.push(e)
            }
        return n
    }
      , L = function(e, t) {
        for (var c = []; e; e = e.nextSibling)
            1 === e.nodeType && e !== t && c.push(e);
        return c
    }
      , x = C.expr.match.needsContext;
    function w(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }
    var k = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    function $(e, t, c) {
        return f(t) ? C.grep(e, function(e, n) {
            return !!t.call(e, n, e) !== c
        }) : t.nodeType ? C.grep(e, function(e) {
            return e === t !== c
        }) : "string" != typeof t ? C.grep(e, function(e) {
            return l.call(t, e) > -1 !== c
        }) : C.filter(t, e, c)
    }
    C.filter = function(e, t, c) {
        var n = t[0];
        return c && (e = ":not(" + e + ")"),
        1 === t.length && 1 === n.nodeType ? C.find.matchesSelector(n, e) ? [n] : [] : C.find.matches(e, C.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }
    ,
    C.fn.extend({
        find: function(e) {
            var t, c, n = this.length, i = this;
            if ("string" != typeof e)
                return this.pushStack(C(e).filter(function() {
                    for (t = 0; t < n; t++)
                        if (C.contains(i[t], this))
                            return !0
                }));
            for (c = this.pushStack([]),
            t = 0; t < n; t++)
                C.find(e, i[t], c);
            return n > 1 ? C.uniqueSort(c) : c
        },
        filter: function(e) {
            return this.pushStack($(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack($(this, e || [], !0))
        },
        is: function(e) {
            return !!$(this, "string" == typeof e && x.test(e) ? C(e) : e || [], !1).length
        }
    });
    var _, E = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (C.fn.init = function(e, t, c) {
        var i, a;
        if (!e)
            return this;
        if (c = c || _,
        "string" == typeof e) {
            if (!(i = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : E.exec(e)) || !i[1] && t)
                return !t || t.jquery ? (t || c).find(e) : this.constructor(t).find(e);
            if (i[1]) {
                if (t = t instanceof C ? t[0] : t,
                C.merge(this, C.parseHTML(i[1], t && t.nodeType ? t.ownerDocument || t : n, !0)),
                k.test(i[1]) && C.isPlainObject(t))
                    for (i in t)
                        f(this[i]) ? this[i](t[i]) : this.attr(i, t[i]);
                return this
            }
            return (a = n.getElementById(i[2])) && (this[0] = a,
            this.length = 1),
            this
        }
        return e.nodeType ? (this[0] = e,
        this.length = 1,
        this) : f(e) ? void 0 !== c.ready ? c.ready(e) : e(C) : C.makeArray(e, this)
    }
    ).prototype = C.fn,
    _ = C(n);
    var S = /^(?:parents|prev(?:Until|All))/
      , A = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    function T(e, t) {
        for (; (e = e[t]) && 1 !== e.nodeType; )
            ;
        return e
    }
    C.fn.extend({
        has: function(e) {
            var t = C(e, this)
              , c = t.length;
            return this.filter(function() {
                for (var e = 0; e < c; e++)
                    if (C.contains(this, t[e]))
                        return !0
            })
        },
        closest: function(e, t) {
            var c, n = 0, i = this.length, a = [], r = "string" != typeof e && C(e);
            if (!x.test(e))
                for (; n < i; n++)
                    for (c = this[n]; c && c !== t; c = c.parentNode)
                        if (c.nodeType < 11 && (r ? r.index(c) > -1 : 1 === c.nodeType && C.find.matchesSelector(c, e))) {
                            a.push(c);
                            break
                        }
            return this.pushStack(a.length > 1 ? C.uniqueSort(a) : a)
        },
        index: function(e) {
            return e ? "string" == typeof e ? l.call(C(e), this[0]) : l.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(C.uniqueSort(C.merge(this.get(), C(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }),
    C.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return V(e, "parentNode")
        },
        parentsUntil: function(e, t, c) {
            return V(e, "parentNode", c)
        },
        next: function(e) {
            return T(e, "nextSibling")
        },
        prev: function(e) {
            return T(e, "previousSibling")
        },
        nextAll: function(e) {
            return V(e, "nextSibling")
        },
        prevAll: function(e) {
            return V(e, "previousSibling")
        },
        nextUntil: function(e, t, c) {
            return V(e, "nextSibling", c)
        },
        prevUntil: function(e, t, c) {
            return V(e, "previousSibling", c)
        },
        siblings: function(e) {
            return L((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return L(e.firstChild)
        },
        contents: function(e) {
            return w(e, "iframe") ? e.contentDocument : (w(e, "template") && (e = e.content || e),
            C.merge([], e.childNodes))
        }
    }, function(e, t) {
        C.fn[e] = function(c, n) {
            var i = C.map(this, t, c);
            return "Until" !== e.slice(-5) && (n = c),
            n && "string" == typeof n && (i = C.filter(n, i)),
            this.length > 1 && (A[e] || C.uniqueSort(i),
            S.test(e) && i.reverse()),
            this.pushStack(i)
        }
    });
    var D = /[^\x20\t\r\n\f]+/g;
    function P(e) {
        return e
    }
    function N(e) {
        throw e
    }
    function j(e, t, c, n) {
        var i;
        try {
            e && f(i = e.promise) ? i.call(e).done(t).fail(c) : e && f(i = e.then) ? i.call(e, t, c) : t.apply(void 0, [e].slice(n))
        } catch (e) {
            c.apply(void 0, [e])
        }
    }
    C.Callbacks = function(e) {
        e = "string" == typeof e ? function(e) {
            var t = {};
            return C.each(e.match(D) || [], function(e, c) {
                t[c] = !0
            }),
            t
        }(e) : C.extend({}, e);
        var t, c, n, i, a = [], r = [], s = -1, l = function() {
            for (i = i || e.once,
            n = t = !0; r.length; s = -1)
                for (c = r.shift(); ++s < a.length; )
                    !1 === a[s].apply(c[0], c[1]) && e.stopOnFalse && (s = a.length,
                    c = !1);
            e.memory || (c = !1),
            t = !1,
            i && (a = c ? [] : "")
        }, o = {
            add: function() {
                return a && (c && !t && (s = a.length - 1,
                r.push(c)),
                function t(c) {
                    C.each(c, function(c, n) {
                        f(n) ? e.unique && o.has(n) || a.push(n) : n && n.length && "string" !== M(n) && t(n)
                    })
                }(arguments),
                c && !t && l()),
                this
            },
            remove: function() {
                return C.each(arguments, function(e, t) {
                    for (var c; (c = C.inArray(t, a, c)) > -1; )
                        a.splice(c, 1),
                        c <= s && s--
                }),
                this
            },
            has: function(e) {
                return e ? C.inArray(e, a) > -1 : a.length > 0
            },
            empty: function() {
                return a && (a = []),
                this
            },
            disable: function() {
                return i = r = [],
                a = c = "",
                this
            },
            disabled: function() {
                return !a
            },
            lock: function() {
                return i = r = [],
                c || t || (a = c = ""),
                this
            },
            locked: function() {
                return !!i
            },
            fireWith: function(e, c) {
                return i || (c = [e, (c = c || []).slice ? c.slice() : c],
                r.push(c),
                t || l()),
                this
            },
            fire: function() {
                return o.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!n
            }
        };
        return o
    }
    ,
    C.extend({
        Deferred: function(t) {
            var c = [["notify", "progress", C.Callbacks("memory"), C.Callbacks("memory"), 2], ["resolve", "done", C.Callbacks("once memory"), C.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", C.Callbacks("once memory"), C.Callbacks("once memory"), 1, "rejected"]]
              , n = "pending"
              , i = {
                state: function() {
                    return n
                },
                always: function() {
                    return a.done(arguments).fail(arguments),
                    this
                },
                catch: function(e) {
                    return i.then(null, e)
                },
                pipe: function() {
                    var e = arguments;
                    return C.Deferred(function(t) {
                        C.each(c, function(c, n) {
                            var i = f(e[n[4]]) && e[n[4]];
                            a[n[1]](function() {
                                var e = i && i.apply(this, arguments);
                                e && f(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[n[0] + "With"](this, i ? [e] : arguments)
                            })
                        }),
                        e = null
                    }).promise()
                },
                then: function(t, n, i) {
                    var a = 0;
                    function r(t, c, n, i) {
                        return function() {
                            var s = this
                              , l = arguments
                              , o = function() {
                                var e, o;
                                if (!(t < a)) {
                                    if ((e = n.apply(s, l)) === c.promise())
                                        throw new TypeError("Thenable self-resolution");
                                    o = e && ("object" == typeof e || "function" == typeof e) && e.then,
                                    f(o) ? i ? o.call(e, r(a, c, P, i), r(a, c, N, i)) : (a++,
                                    o.call(e, r(a, c, P, i), r(a, c, N, i), r(a, c, P, c.notifyWith))) : (n !== P && (s = void 0,
                                    l = [e]),
                                    (i || c.resolveWith)(s, l))
                                }
                            }
                              , h = i ? o : function() {
                                try {
                                    o()
                                } catch (e) {
                                    C.Deferred.exceptionHook && C.Deferred.exceptionHook(e, h.stackTrace),
                                    t + 1 >= a && (n !== N && (s = void 0,
                                    l = [e]),
                                    c.rejectWith(s, l))
                                }
                            }
                            ;
                            t ? h() : (C.Deferred.getStackHook && (h.stackTrace = C.Deferred.getStackHook()),
                            e.setTimeout(h))
                        }
                    }
                    return C.Deferred(function(e) {
                        c[0][3].add(r(0, e, f(i) ? i : P, e.notifyWith)),
                        c[1][3].add(r(0, e, f(t) ? t : P)),
                        c[2][3].add(r(0, e, f(n) ? n : N))
                    }).promise()
                },
                promise: function(e) {
                    return null != e ? C.extend(e, i) : i
                }
            }
              , a = {};
            return C.each(c, function(e, t) {
                var r = t[2]
                  , s = t[5];
                i[t[1]] = r.add,
                s && r.add(function() {
                    n = s
                }, c[3 - e][2].disable, c[3 - e][3].disable, c[0][2].lock, c[0][3].lock),
                r.add(t[3].fire),
                a[t[0]] = function() {
                    return a[t[0] + "With"](this === a ? void 0 : this, arguments),
                    this
                }
                ,
                a[t[0] + "With"] = r.fireWith
            }),
            i.promise(a),
            t && t.call(a, a),
            a
        },
        when: function(e) {
            var t = arguments.length
              , c = t
              , n = Array(c)
              , i = a.call(arguments)
              , r = C.Deferred()
              , s = function(e) {
                return function(c) {
                    n[e] = this,
                    i[e] = arguments.length > 1 ? a.call(arguments) : c,
                    --t || r.resolveWith(n, i)
                }
            };
            if (t <= 1 && (j(e, r.done(s(c)).resolve, r.reject, !t),
            "pending" === r.state() || f(i[c] && i[c].then)))
                return r.then();
            for (; c--; )
                j(i[c], s(c), r.reject);
            return r.promise()
        }
    });
    var O = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    C.Deferred.exceptionHook = function(t, c) {
        e.console && e.console.warn && t && O.test(t.name) && e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, c)
    }
    ,
    C.readyException = function(t) {
        e.setTimeout(function() {
            throw t
        })
    }
    ;
    var I = C.Deferred();
    function q() {
        n.removeEventListener("DOMContentLoaded", q),
        e.removeEventListener("load", q),
        C.ready()
    }
    C.fn.ready = function(e) {
        return I.then(e).catch(function(e) {
            C.readyException(e)
        }),
        this
    }
    ,
    C.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(e) {
            (!0 === e ? --C.readyWait : C.isReady) || (C.isReady = !0,
            !0 !== e && --C.readyWait > 0 || I.resolveWith(n, [C]))
        }
    }),
    C.ready.then = I.then,
    "complete" === n.readyState || "loading" !== n.readyState && !n.documentElement.doScroll ? e.setTimeout(C.ready) : (n.addEventListener("DOMContentLoaded", q),
    e.addEventListener("load", q));
    var R = function(e, t, c, n, i, a, r) {
        var s = 0
          , l = e.length
          , o = null == c;
        if ("object" === M(c))
            for (s in i = !0,
            c)
                R(e, t, s, c[s], !0, a, r);
        else if (void 0 !== n && (i = !0,
        f(n) || (r = !0),
        o && (r ? (t.call(e, n),
        t = null) : (o = t,
        t = function(e, t, c) {
            return o.call(C(e), c)
        }
        )),
        t))
            for (; s < l; s++)
                t(e[s], c, r ? n : n.call(e[s], s, t(e[s], c)));
        return i ? e : o ? t.call(e) : l ? t(e[0], c) : a
    }
      , F = /^-ms-/
      , B = /-([a-z])/g;
    function U(e, t) {
        return t.toUpperCase()
    }
    function W(e) {
        return e.replace(F, "ms-").replace(B, U)
    }
    var X = function(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    };
    function K() {
        this.expando = C.expando + K.uid++
    }
    K.uid = 1,
    K.prototype = {
        cache: function(e) {
            var t = e[this.expando];
            return t || (t = {},
            X(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))),
            t
        },
        set: function(e, t, c) {
            var n, i = this.cache(e);
            if ("string" == typeof t)
                i[W(t)] = c;
            else
                for (n in t)
                    i[W(n)] = t[n];
            return i
        },
        get: function(e, t) {
            return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][W(t)]
        },
        access: function(e, t, c) {
            return void 0 === t || t && "string" == typeof t && void 0 === c ? this.get(e, t) : (this.set(e, t, c),
            void 0 !== c ? c : t)
        },
        remove: function(e, t) {
            var c, n = e[this.expando];
            if (void 0 !== n) {
                if (void 0 !== t) {
                    c = (t = Array.isArray(t) ? t.map(W) : (t = W(t))in n ? [t] : t.match(D) || []).length;
                    for (; c--; )
                        delete n[t[c]]
                }
                (void 0 === t || C.isEmptyObject(n)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
            }
        },
        hasData: function(e) {
            var t = e[this.expando];
            return void 0 !== t && !C.isEmptyObject(t)
        }
    };
    var Y = new K
      , G = new K
      , Q = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , Z = /[A-Z]/g;
    function J(e, t, c) {
        var n;
        if (void 0 === c && 1 === e.nodeType)
            if (n = "data-" + t.replace(Z, "-$&").toLowerCase(),
            "string" == typeof (c = e.getAttribute(n))) {
                try {
                    c = function(e) {
                        return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : Q.test(e) ? JSON.parse(e) : e)
                    }(c)
                } catch (e) {}
                G.set(e, t, c)
            } else
                c = void 0;
        return c
    }
    C.extend({
        hasData: function(e) {
            return G.hasData(e) || Y.hasData(e)
        },
        data: function(e, t, c) {
            return G.access(e, t, c)
        },
        removeData: function(e, t) {
            G.remove(e, t)
        },
        _data: function(e, t, c) {
            return Y.access(e, t, c)
        },
        _removeData: function(e, t) {
            Y.remove(e, t)
        }
    }),
    C.fn.extend({
        data: function(e, t) {
            var c, n, i, a = this[0], r = a && a.attributes;
            if (void 0 === e) {
                if (this.length && (i = G.get(a),
                1 === a.nodeType && !Y.get(a, "hasDataAttrs"))) {
                    for (c = r.length; c--; )
                        r[c] && 0 === (n = r[c].name).indexOf("data-") && (n = W(n.slice(5)),
                        J(a, n, i[n]));
                    Y.set(a, "hasDataAttrs", !0)
                }
                return i
            }
            return "object" == typeof e ? this.each(function() {
                G.set(this, e)
            }) : R(this, function(t) {
                var c;
                if (a && void 0 === t) {
                    if (void 0 !== (c = G.get(a, e)))
                        return c;
                    if (void 0 !== (c = J(a, e)))
                        return c
                } else
                    this.each(function() {
                        G.set(this, e, t)
                    })
            }, null, t, arguments.length > 1, null, !0)
        },
        removeData: function(e) {
            return this.each(function() {
                G.remove(this, e)
            })
        }
    }),
    C.extend({
        queue: function(e, t, c) {
            var n;
            if (e)
                return t = (t || "fx") + "queue",
                n = Y.get(e, t),
                c && (!n || Array.isArray(c) ? n = Y.access(e, t, C.makeArray(c)) : n.push(c)),
                n || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var c = C.queue(e, t)
              , n = c.length
              , i = c.shift()
              , a = C._queueHooks(e, t);
            "inprogress" === i && (i = c.shift(),
            n--),
            i && ("fx" === t && c.unshift("inprogress"),
            delete a.stop,
            i.call(e, function() {
                C.dequeue(e, t)
            }, a)),
            !n && a && a.empty.fire()
        },
        _queueHooks: function(e, t) {
            var c = t + "queueHooks";
            return Y.get(e, c) || Y.access(e, c, {
                empty: C.Callbacks("once memory").add(function() {
                    Y.remove(e, [t + "queue", c])
                })
            })
        }
    }),
    C.fn.extend({
        queue: function(e, t) {
            var c = 2;
            return "string" != typeof e && (t = e,
            e = "fx",
            c--),
            arguments.length < c ? C.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                var c = C.queue(this, e, t);
                C._queueHooks(this, e),
                "fx" === e && "inprogress" !== c[0] && C.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                C.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var c, n = 1, i = C.Deferred(), a = this, r = this.length, s = function() {
                --n || i.resolveWith(a, [a])
            };
            for ("string" != typeof e && (t = e,
            e = void 0),
            e = e || "fx"; r--; )
                (c = Y.get(a[r], e + "queueHooks")) && c.empty && (n++,
                c.empty.add(s));
            return s(),
            i.promise(t)
        }
    });
    var ee = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , te = new RegExp("^(?:([+-])=|)(" + ee + ")([a-z%]*)$","i")
      , ce = ["Top", "Right", "Bottom", "Left"]
      , ne = function(e, t) {
        return "none" === (e = t || e).style.display || "" === e.style.display && C.contains(e.ownerDocument, e) && "none" === C.css(e, "display")
    }
      , ie = function(e, t, c, n) {
        var i, a, r = {};
        for (a in t)
            r[a] = e.style[a],
            e.style[a] = t[a];
        for (a in i = c.apply(e, n || []),
        t)
            e.style[a] = r[a];
        return i
    };
    function ae(e, t, c, n) {
        var i, a, r = 20, s = n ? function() {
            return n.cur()
        }
        : function() {
            return C.css(e, t, "")
        }
        , l = s(), o = c && c[3] || (C.cssNumber[t] ? "" : "px"), h = (C.cssNumber[t] || "px" !== o && +l) && te.exec(C.css(e, t));
        if (h && h[3] !== o) {
            for (l /= 2,
            o = o || h[3],
            h = +l || 1; r--; )
                C.style(e, t, h + o),
                (1 - a) * (1 - (a = s() / l || .5)) <= 0 && (r = 0),
                h /= a;
            h *= 2,
            C.style(e, t, h + o),
            c = c || []
        }
        return c && (h = +h || +l || 0,
        i = c[1] ? h + (c[1] + 1) * c[2] : +c[2],
        n && (n.unit = o,
        n.start = h,
        n.end = i)),
        i
    }
    var re = {};
    function se(e) {
        var t, c = e.ownerDocument, n = e.nodeName, i = re[n];
        return i || (t = c.body.appendChild(c.createElement(n)),
        i = C.css(t, "display"),
        t.parentNode.removeChild(t),
        "none" === i && (i = "block"),
        re[n] = i,
        i)
    }
    function le(e, t) {
        for (var c, n, i = [], a = 0, r = e.length; a < r; a++)
            (n = e[a]).style && (c = n.style.display,
            t ? ("none" === c && (i[a] = Y.get(n, "display") || null,
            i[a] || (n.style.display = "")),
            "" === n.style.display && ne(n) && (i[a] = se(n))) : "none" !== c && (i[a] = "none",
            Y.set(n, "display", c)));
        for (a = 0; a < r; a++)
            null != i[a] && (e[a].style.display = i[a]);
        return e
    }
    C.fn.extend({
        show: function() {
            return le(this, !0)
        },
        hide: function() {
            return le(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                ne(this) ? C(this).show() : C(this).hide()
            })
        }
    });
    var oe = /^(?:checkbox|radio)$/i
      , he = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i
      , ve = /^$|^module$|\/(?:java|ecma)script/i
      , ue = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    };
    function de(e, t) {
        var c;
        return c = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [],
        void 0 === t || t && w(e, t) ? C.merge([e], c) : c
    }
    function me(e, t) {
        for (var c = 0, n = e.length; c < n; c++)
            Y.set(e[c], "globalEval", !t || Y.get(t[c], "globalEval"))
    }
    ue.optgroup = ue.option,
    ue.tbody = ue.tfoot = ue.colgroup = ue.caption = ue.thead,
    ue.th = ue.td;
    var fe = /<|&#?\w+;/;
    function pe(e, t, c, n, i) {
        for (var a, r, s, l, o, h, v = t.createDocumentFragment(), u = [], d = 0, m = e.length; d < m; d++)
            if ((a = e[d]) || 0 === a)
                if ("object" === M(a))
                    C.merge(u, a.nodeType ? [a] : a);
                else if (fe.test(a)) {
                    for (r = r || v.appendChild(t.createElement("div")),
                    s = (he.exec(a) || ["", ""])[1].toLowerCase(),
                    l = ue[s] || ue._default,
                    r.innerHTML = l[1] + C.htmlPrefilter(a) + l[2],
                    h = l[0]; h--; )
                        r = r.lastChild;
                    C.merge(u, r.childNodes),
                    (r = v.firstChild).textContent = ""
                } else
                    u.push(t.createTextNode(a));
        for (v.textContent = "",
        d = 0; a = u[d++]; )
            if (n && C.inArray(a, n) > -1)
                i && i.push(a);
            else if (o = C.contains(a.ownerDocument, a),
            r = de(v.appendChild(a), "script"),
            o && me(r),
            c)
                for (h = 0; a = r[h++]; )
                    ve.test(a.type || "") && c.push(a);
        return v
    }
    !function() {
        var e = n.createDocumentFragment().appendChild(n.createElement("div"))
          , t = n.createElement("input");
        t.setAttribute("type", "radio"),
        t.setAttribute("checked", "checked"),
        t.setAttribute("name", "t"),
        e.appendChild(t),
        m.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked,
        e.innerHTML = "<textarea>x</textarea>",
        m.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue
    }();
    var ze = n.documentElement
      , ge = /^key/
      , Me = /^(?:mouse|pointer|contextmenu|drag|drop)|click/
      , Ce = /^([^.]*)(?:\.(.+)|)/;
    function ye() {
        return !0
    }
    function He() {
        return !1
    }
    function be() {
        try {
            return n.activeElement
        } catch (e) {}
    }
    function Ve(e, t, c, n, i, a) {
        var r, s;
        if ("object" == typeof t) {
            for (s in "string" != typeof c && (n = n || c,
            c = void 0),
            t)
                Ve(e, s, c, n, t[s], a);
            return e
        }
        if (null == n && null == i ? (i = c,
        n = c = void 0) : null == i && ("string" == typeof c ? (i = n,
        n = void 0) : (i = n,
        n = c,
        c = void 0)),
        !1 === i)
            i = He;
        else if (!i)
            return e;
        return 1 === a && (r = i,
        (i = function(e) {
            return C().off(e),
            r.apply(this, arguments)
        }
        ).guid = r.guid || (r.guid = C.guid++)),
        e.each(function() {
            C.event.add(this, t, i, n, c)
        })
    }
    C.event = {
        global: {},
        add: function(e, t, c, n, i) {
            var a, r, s, l, o, h, v, u, d, m, f, p = Y.get(e);
            if (p)
                for (c.handler && (c = (a = c).handler,
                i = a.selector),
                i && C.find.matchesSelector(ze, i),
                c.guid || (c.guid = C.guid++),
                (l = p.events) || (l = p.events = {}),
                (r = p.handle) || (r = p.handle = function(t) {
                    return void 0 !== C && C.event.triggered !== t.type ? C.event.dispatch.apply(e, arguments) : void 0
                }
                ),
                o = (t = (t || "").match(D) || [""]).length; o--; )
                    d = f = (s = Ce.exec(t[o]) || [])[1],
                    m = (s[2] || "").split(".").sort(),
                    d && (v = C.event.special[d] || {},
                    d = (i ? v.delegateType : v.bindType) || d,
                    v = C.event.special[d] || {},
                    h = C.extend({
                        type: d,
                        origType: f,
                        data: n,
                        handler: c,
                        guid: c.guid,
                        selector: i,
                        needsContext: i && C.expr.match.needsContext.test(i),
                        namespace: m.join(".")
                    }, a),
                    (u = l[d]) || ((u = l[d] = []).delegateCount = 0,
                    v.setup && !1 !== v.setup.call(e, n, m, r) || e.addEventListener && e.addEventListener(d, r)),
                    v.add && (v.add.call(e, h),
                    h.handler.guid || (h.handler.guid = c.guid)),
                    i ? u.splice(u.delegateCount++, 0, h) : u.push(h),
                    C.event.global[d] = !0)
        },
        remove: function(e, t, c, n, i) {
            var a, r, s, l, o, h, v, u, d, m, f, p = Y.hasData(e) && Y.get(e);
            if (p && (l = p.events)) {
                for (o = (t = (t || "").match(D) || [""]).length; o--; )
                    if (d = f = (s = Ce.exec(t[o]) || [])[1],
                    m = (s[2] || "").split(".").sort(),
                    d) {
                        for (v = C.event.special[d] || {},
                        u = l[d = (n ? v.delegateType : v.bindType) || d] || [],
                        s = s[2] && new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        r = a = u.length; a--; )
                            h = u[a],
                            !i && f !== h.origType || c && c.guid !== h.guid || s && !s.test(h.namespace) || n && n !== h.selector && ("**" !== n || !h.selector) || (u.splice(a, 1),
                            h.selector && u.delegateCount--,
                            v.remove && v.remove.call(e, h));
                        r && !u.length && (v.teardown && !1 !== v.teardown.call(e, m, p.handle) || C.removeEvent(e, d, p.handle),
                        delete l[d])
                    } else
                        for (d in l)
                            C.event.remove(e, d + t[o], c, n, !0);
                C.isEmptyObject(l) && Y.remove(e, "handle events")
            }
        },
        dispatch: function(e) {
            var t, c, n, i, a, r, s = C.event.fix(e), l = new Array(arguments.length), o = (Y.get(this, "events") || {})[s.type] || [], h = C.event.special[s.type] || {};
            for (l[0] = s,
            t = 1; t < arguments.length; t++)
                l[t] = arguments[t];
            if (s.delegateTarget = this,
            !h.preDispatch || !1 !== h.preDispatch.call(this, s)) {
                for (r = C.event.handlers.call(this, s, o),
                t = 0; (i = r[t++]) && !s.isPropagationStopped(); )
                    for (s.currentTarget = i.elem,
                    c = 0; (a = i.handlers[c++]) && !s.isImmediatePropagationStopped(); )
                        s.rnamespace && !s.rnamespace.test(a.namespace) || (s.handleObj = a,
                        s.data = a.data,
                        void 0 !== (n = ((C.event.special[a.origType] || {}).handle || a.handler).apply(i.elem, l)) && !1 === (s.result = n) && (s.preventDefault(),
                        s.stopPropagation()));
                return h.postDispatch && h.postDispatch.call(this, s),
                s.result
            }
        },
        handlers: function(e, t) {
            var c, n, i, a, r, s = [], l = t.delegateCount, o = e.target;
            if (l && o.nodeType && !("click" === e.type && e.button >= 1))
                for (; o !== this; o = o.parentNode || this)
                    if (1 === o.nodeType && ("click" !== e.type || !0 !== o.disabled)) {
                        for (a = [],
                        r = {},
                        c = 0; c < l; c++)
                            void 0 === r[i = (n = t[c]).selector + " "] && (r[i] = n.needsContext ? C(i, this).index(o) > -1 : C.find(i, this, null, [o]).length),
                            r[i] && a.push(n);
                        a.length && s.push({
                            elem: o,
                            handlers: a
                        })
                    }
            return o = this,
            l < t.length && s.push({
                elem: o,
                handlers: t.slice(l)
            }),
            s
        },
        addProp: function(e, t) {
            Object.defineProperty(C.Event.prototype, e, {
                enumerable: !0,
                configurable: !0,
                get: f(t) ? function() {
                    if (this.originalEvent)
                        return t(this.originalEvent)
                }
                : function() {
                    if (this.originalEvent)
                        return this.originalEvent[e]
                }
                ,
                set: function(t) {
                    Object.defineProperty(this, e, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: t
                    })
                }
            })
        },
        fix: function(e) {
            return e[C.expando] ? e : new C.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== be() && this.focus)
                        return this.focus(),
                        !1
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === be() && this.blur)
                        return this.blur(),
                        !1
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    if ("checkbox" === this.type && this.click && w(this, "input"))
                        return this.click(),
                        !1
                },
                _default: function(e) {
                    return w(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    },
    C.removeEvent = function(e, t, c) {
        e.removeEventListener && e.removeEventListener(t, c)
    }
    ,
    C.Event = function(e, t) {
        if (!(this instanceof C.Event))
            return new C.Event(e,t);
        e && e.type ? (this.originalEvent = e,
        this.type = e.type,
        this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? ye : He,
        this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target,
        this.currentTarget = e.currentTarget,
        this.relatedTarget = e.relatedTarget) : this.type = e,
        t && C.extend(this, t),
        this.timeStamp = e && e.timeStamp || Date.now(),
        this[C.expando] = !0
    }
    ,
    C.Event.prototype = {
        constructor: C.Event,
        isDefaultPrevented: He,
        isPropagationStopped: He,
        isImmediatePropagationStopped: He,
        isSimulated: !1,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = ye,
            e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = ye,
            e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = ye,
            e && !this.isSimulated && e.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    C.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function(e) {
            var t = e.button;
            return null == e.which && ge.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && Me.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
        }
    }, C.event.addProp),
    C.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        C.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var c, n = e.relatedTarget, i = e.handleObj;
                return n && (n === this || C.contains(this, n)) || (e.type = i.origType,
                c = i.handler.apply(this, arguments),
                e.type = t),
                c
            }
        }
    }),
    C.fn.extend({
        on: function(e, t, c, n) {
            return Ve(this, e, t, c, n)
        },
        one: function(e, t, c, n) {
            return Ve(this, e, t, c, n, 1)
        },
        off: function(e, t, c) {
            var n, i;
            if (e && e.preventDefault && e.handleObj)
                return n = e.handleObj,
                C(e.delegateTarget).off(n.namespace ? n.origType + "." + n.namespace : n.origType, n.selector, n.handler),
                this;
            if ("object" == typeof e) {
                for (i in e)
                    this.off(i, t, e[i]);
                return this
            }
            return !1 !== t && "function" != typeof t || (c = t,
            t = void 0),
            !1 === c && (c = He),
            this.each(function() {
                C.event.remove(this, e, c, t)
            })
        }
    });
    var Le = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi
      , xe = /<script|<style|<link/i
      , we = /checked\s*(?:[^=]|=\s*.checked.)/i
      , ke = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    function $e(e, t) {
        return w(e, "table") && w(11 !== t.nodeType ? t : t.firstChild, "tr") && C(e).children("tbody")[0] || e
    }
    function _e(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
        e
    }
    function Ee(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"),
        e
    }
    function Se(e, t) {
        var c, n, i, a, r, s, l, o;
        if (1 === t.nodeType) {
            if (Y.hasData(e) && (a = Y.access(e),
            r = Y.set(t, a),
            o = a.events))
                for (i in delete r.handle,
                r.events = {},
                o)
                    for (c = 0,
                    n = o[i].length; c < n; c++)
                        C.event.add(t, i, o[i][c]);
            G.hasData(e) && (s = G.access(e),
            l = C.extend({}, s),
            G.set(t, l))
        }
    }
    function Ae(e, t) {
        var c = t.nodeName.toLowerCase();
        "input" === c && oe.test(e.type) ? t.checked = e.checked : "input" !== c && "textarea" !== c || (t.defaultValue = e.defaultValue)
    }
    function Te(e, t, c, n) {
        t = r.apply([], t);
        var i, a, s, l, o, h, v = 0, u = e.length, d = u - 1, p = t[0], z = f(p);
        if (z || u > 1 && "string" == typeof p && !m.checkClone && we.test(p))
            return e.each(function(i) {
                var a = e.eq(i);
                z && (t[0] = p.call(this, i, a.html())),
                Te(a, t, c, n)
            });
        if (u && (a = (i = pe(t, e[0].ownerDocument, !1, e, n)).firstChild,
        1 === i.childNodes.length && (i = a),
        a || n)) {
            for (l = (s = C.map(de(i, "script"), _e)).length; v < u; v++)
                o = i,
                v !== d && (o = C.clone(o, !0, !0),
                l && C.merge(s, de(o, "script"))),
                c.call(e[v], o, v);
            if (l)
                for (h = s[s.length - 1].ownerDocument,
                C.map(s, Ee),
                v = 0; v < l; v++)
                    o = s[v],
                    ve.test(o.type || "") && !Y.access(o, "globalEval") && C.contains(h, o) && (o.src && "module" !== (o.type || "").toLowerCase() ? C._evalUrl && C._evalUrl(o.src) : g(o.textContent.replace(ke, ""), h, o))
        }
        return e
    }
    function De(e, t, c) {
        for (var n, i = t ? C.filter(t, e) : e, a = 0; null != (n = i[a]); a++)
            c || 1 !== n.nodeType || C.cleanData(de(n)),
            n.parentNode && (c && C.contains(n.ownerDocument, n) && me(de(n, "script")),
            n.parentNode.removeChild(n));
        return e
    }
    C.extend({
        htmlPrefilter: function(e) {
            return e.replace(Le, "<$1></$2>")
        },
        clone: function(e, t, c) {
            var n, i, a, r, s = e.cloneNode(!0), l = C.contains(e.ownerDocument, e);
            if (!(m.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || C.isXMLDoc(e)))
                for (r = de(s),
                n = 0,
                i = (a = de(e)).length; n < i; n++)
                    Ae(a[n], r[n]);
            if (t)
                if (c)
                    for (a = a || de(e),
                    r = r || de(s),
                    n = 0,
                    i = a.length; n < i; n++)
                        Se(a[n], r[n]);
                else
                    Se(e, s);
            return (r = de(s, "script")).length > 0 && me(r, !l && de(e, "script")),
            s
        },
        cleanData: function(e) {
            for (var t, c, n, i = C.event.special, a = 0; void 0 !== (c = e[a]); a++)
                if (X(c)) {
                    if (t = c[Y.expando]) {
                        if (t.events)
                            for (n in t.events)
                                i[n] ? C.event.remove(c, n) : C.removeEvent(c, n, t.handle);
                        c[Y.expando] = void 0
                    }
                    c[G.expando] && (c[G.expando] = void 0)
                }
        }
    }),
    C.fn.extend({
        detach: function(e) {
            return De(this, e, !0)
        },
        remove: function(e) {
            return De(this, e)
        },
        text: function(e) {
            return R(this, function(e) {
                return void 0 === e ? C.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return Te(this, arguments, function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || $e(this, e).appendChild(e)
            })
        },
        prepend: function() {
            return Te(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = $e(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return Te(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return Te(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++)
                1 === e.nodeType && (C.cleanData(de(e, !1)),
                e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null != e && e,
            t = null == t ? e : t,
            this.map(function() {
                return C.clone(this, e, t)
            })
        },
        html: function(e) {
            return R(this, function(e) {
                var t = this[0] || {}
                  , c = 0
                  , n = this.length;
                if (void 0 === e && 1 === t.nodeType)
                    return t.innerHTML;
                if ("string" == typeof e && !xe.test(e) && !ue[(he.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = C.htmlPrefilter(e);
                    try {
                        for (; c < n; c++)
                            1 === (t = this[c] || {}).nodeType && (C.cleanData(de(t, !1)),
                            t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var e = [];
            return Te(this, arguments, function(t) {
                var c = this.parentNode;
                C.inArray(this, e) < 0 && (C.cleanData(de(this)),
                c && c.replaceChild(t, this))
            }, e)
        }
    }),
    C.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        C.fn[e] = function(e) {
            for (var c, n = [], i = C(e), a = i.length - 1, r = 0; r <= a; r++)
                c = r === a ? this : this.clone(!0),
                C(i[r])[t](c),
                s.apply(n, c.get());
            return this.pushStack(n)
        }
    });
    var Pe = new RegExp("^(" + ee + ")(?!px)[a-z%]+$","i")
      , Ne = function(t) {
        var c = t.ownerDocument.defaultView;
        return c && c.opener || (c = e),
        c.getComputedStyle(t)
    }
      , je = new RegExp(ce.join("|"),"i");
    function Oe(e, t, c) {
        var n, i, a, r, s = e.style;
        return (c = c || Ne(e)) && ("" !== (r = c.getPropertyValue(t) || c[t]) || C.contains(e.ownerDocument, e) || (r = C.style(e, t)),
        !m.pixelBoxStyles() && Pe.test(r) && je.test(t) && (n = s.width,
        i = s.minWidth,
        a = s.maxWidth,
        s.minWidth = s.maxWidth = s.width = r,
        r = c.width,
        s.width = n,
        s.minWidth = i,
        s.maxWidth = a)),
        void 0 !== r ? r + "" : r
    }
    function Ie(e, t) {
        return {
            get: function() {
                if (!e())
                    return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }
    !function() {
        function t() {
            if (h) {
                o.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",
                h.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",
                ze.appendChild(o).appendChild(h);
                var t = e.getComputedStyle(h);
                i = "1%" !== t.top,
                l = 12 === c(t.marginLeft),
                h.style.right = "60%",
                s = 36 === c(t.right),
                a = 36 === c(t.width),
                h.style.position = "absolute",
                r = 36 === h.offsetWidth || "absolute",
                ze.removeChild(o),
                h = null
            }
        }
        function c(e) {
            return Math.round(parseFloat(e))
        }
        var i, a, r, s, l, o = n.createElement("div"), h = n.createElement("div");
        h.style && (h.style.backgroundClip = "content-box",
        h.cloneNode(!0).style.backgroundClip = "",
        m.clearCloneStyle = "content-box" === h.style.backgroundClip,
        C.extend(m, {
            boxSizingReliable: function() {
                return t(),
                a
            },
            pixelBoxStyles: function() {
                return t(),
                s
            },
            pixelPosition: function() {
                return t(),
                i
            },
            reliableMarginLeft: function() {
                return t(),
                l
            },
            scrollboxSize: function() {
                return t(),
                r
            }
        }))
    }();
    var qe = /^(none|table(?!-c[ea]).+)/
      , Re = /^--/
      , Fe = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , Be = {
        letterSpacing: "0",
        fontWeight: "400"
    }
      , Ue = ["Webkit", "Moz", "ms"]
      , We = n.createElement("div").style;
    function Xe(e) {
        var t = C.cssProps[e];
        return t || (t = C.cssProps[e] = function(e) {
            if (e in We)
                return e;
            for (var t = e[0].toUpperCase() + e.slice(1), c = Ue.length; c--; )
                if ((e = Ue[c] + t)in We)
                    return e
        }(e) || e),
        t
    }
    function Ke(e, t, c) {
        var n = te.exec(t);
        return n ? Math.max(0, n[2] - (c || 0)) + (n[3] || "px") : t
    }
    function Ye(e, t, c, n, i, a) {
        var r = "width" === t ? 1 : 0
          , s = 0
          , l = 0;
        if (c === (n ? "border" : "content"))
            return 0;
        for (; r < 4; r += 2)
            "margin" === c && (l += C.css(e, c + ce[r], !0, i)),
            n ? ("content" === c && (l -= C.css(e, "padding" + ce[r], !0, i)),
            "margin" !== c && (l -= C.css(e, "border" + ce[r] + "Width", !0, i))) : (l += C.css(e, "padding" + ce[r], !0, i),
            "padding" !== c ? l += C.css(e, "border" + ce[r] + "Width", !0, i) : s += C.css(e, "border" + ce[r] + "Width", !0, i));
        return !n && a >= 0 && (l += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - a - l - s - .5))),
        l
    }
    function Ge(e, t, c) {
        var n = Ne(e)
          , i = Oe(e, t, n)
          , a = "border-box" === C.css(e, "boxSizing", !1, n)
          , r = a;
        if (Pe.test(i)) {
            if (!c)
                return i;
            i = "auto"
        }
        return r = r && (m.boxSizingReliable() || i === e.style[t]),
        ("auto" === i || !parseFloat(i) && "inline" === C.css(e, "display", !1, n)) && (i = e["offset" + t[0].toUpperCase() + t.slice(1)],
        r = !0),
        (i = parseFloat(i) || 0) + Ye(e, t, c || (a ? "border" : "content"), r, n, i) + "px"
    }
    function Qe(e, t, c, n, i) {
        return new Qe.prototype.init(e,t,c,n,i)
    }
    C.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var c = Oe(e, "opacity");
                        return "" === c ? "1" : c
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function(e, t, c, n) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, a, r, s = W(t), l = Re.test(t), o = e.style;
                if (l || (t = Xe(s)),
                r = C.cssHooks[t] || C.cssHooks[s],
                void 0 === c)
                    return r && "get"in r && void 0 !== (i = r.get(e, !1, n)) ? i : o[t];
                "string" == (a = typeof c) && (i = te.exec(c)) && i[1] && (c = ae(e, t, i),
                a = "number"),
                null != c && c == c && ("number" === a && (c += i && i[3] || (C.cssNumber[s] ? "" : "px")),
                m.clearCloneStyle || "" !== c || 0 !== t.indexOf("background") || (o[t] = "inherit"),
                r && "set"in r && void 0 === (c = r.set(e, c, n)) || (l ? o.setProperty(t, c) : o[t] = c))
            }
        },
        css: function(e, t, c, n) {
            var i, a, r, s = W(t);
            return Re.test(t) || (t = Xe(s)),
            (r = C.cssHooks[t] || C.cssHooks[s]) && "get"in r && (i = r.get(e, !0, c)),
            void 0 === i && (i = Oe(e, t, n)),
            "normal" === i && t in Be && (i = Be[t]),
            "" === c || c ? (a = parseFloat(i),
            !0 === c || isFinite(a) ? a || 0 : i) : i
        }
    }),
    C.each(["height", "width"], function(e, t) {
        C.cssHooks[t] = {
            get: function(e, c, n) {
                if (c)
                    return !qe.test(C.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? Ge(e, t, n) : ie(e, Fe, function() {
                        return Ge(e, t, n)
                    })
            },
            set: function(e, c, n) {
                var i, a = Ne(e), r = "border-box" === C.css(e, "boxSizing", !1, a), s = n && Ye(e, t, n, r, a);
                return r && m.scrollboxSize() === a.position && (s -= Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(a[t]) - Ye(e, t, "border", !1, a) - .5)),
                s && (i = te.exec(c)) && "px" !== (i[3] || "px") && (e.style[t] = c,
                c = C.css(e, t)),
                Ke(0, c, s)
            }
        }
    }),
    C.cssHooks.marginLeft = Ie(m.reliableMarginLeft, function(e, t) {
        if (t)
            return (parseFloat(Oe(e, "marginLeft")) || e.getBoundingClientRect().left - ie(e, {
                marginLeft: 0
            }, function() {
                return e.getBoundingClientRect().left
            })) + "px"
    }),
    C.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        C.cssHooks[e + t] = {
            expand: function(c) {
                for (var n = 0, i = {}, a = "string" == typeof c ? c.split(" ") : [c]; n < 4; n++)
                    i[e + ce[n] + t] = a[n] || a[n - 2] || a[0];
                return i
            }
        },
        "margin" !== e && (C.cssHooks[e + t].set = Ke)
    }),
    C.fn.extend({
        css: function(e, t) {
            return R(this, function(e, t, c) {
                var n, i, a = {}, r = 0;
                if (Array.isArray(t)) {
                    for (n = Ne(e),
                    i = t.length; r < i; r++)
                        a[t[r]] = C.css(e, t[r], !1, n);
                    return a
                }
                return void 0 !== c ? C.style(e, t, c) : C.css(e, t)
            }, e, t, arguments.length > 1)
        }
    }),
    C.Tween = Qe,
    Qe.prototype = {
        constructor: Qe,
        init: function(e, t, c, n, i, a) {
            this.elem = e,
            this.prop = c,
            this.easing = i || C.easing._default,
            this.options = t,
            this.start = this.now = this.cur(),
            this.end = n,
            this.unit = a || (C.cssNumber[c] ? "" : "px")
        },
        cur: function() {
            var e = Qe.propHooks[this.prop];
            return e && e.get ? e.get(this) : Qe.propHooks._default.get(this)
        },
        run: function(e) {
            var t, c = Qe.propHooks[this.prop];
            return this.options.duration ? this.pos = t = C.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
            this.now = (this.end - this.start) * t + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            c && c.set ? c.set(this) : Qe.propHooks._default.set(this),
            this
        }
    },
    Qe.prototype.init.prototype = Qe.prototype,
    Qe.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = C.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function(e) {
                C.fx.step[e.prop] ? C.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[C.cssProps[e.prop]] && !C.cssHooks[e.prop] ? e.elem[e.prop] = e.now : C.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    },
    Qe.propHooks.scrollTop = Qe.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    },
    C.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    },
    C.fx = Qe.prototype.init,
    C.fx.step = {};
    var Ze, Je, et = /^(?:toggle|show|hide)$/, tt = /queueHooks$/;
    function ct() {
        Je && (!1 === n.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(ct) : e.setTimeout(ct, C.fx.interval),
        C.fx.tick())
    }
    function nt() {
        return e.setTimeout(function() {
            Ze = void 0
        }),
        Ze = Date.now()
    }
    function it(e, t) {
        var c, n = 0, i = {
            height: e
        };
        for (t = t ? 1 : 0; n < 4; n += 2 - t)
            i["margin" + (c = ce[n])] = i["padding" + c] = e;
        return t && (i.opacity = i.width = e),
        i
    }
    function at(e, t, c) {
        for (var n, i = (rt.tweeners[t] || []).concat(rt.tweeners["*"]), a = 0, r = i.length; a < r; a++)
            if (n = i[a].call(c, t, e))
                return n
    }
    function rt(e, t, c) {
        var n, i, a = 0, r = rt.prefilters.length, s = C.Deferred().always(function() {
            delete l.elem
        }), l = function() {
            if (i)
                return !1;
            for (var t = Ze || nt(), c = Math.max(0, o.startTime + o.duration - t), n = 1 - (c / o.duration || 0), a = 0, r = o.tweens.length; a < r; a++)
                o.tweens[a].run(n);
            return s.notifyWith(e, [o, n, c]),
            n < 1 && r ? c : (r || s.notifyWith(e, [o, 1, 0]),
            s.resolveWith(e, [o]),
            !1)
        }, o = s.promise({
            elem: e,
            props: C.extend({}, t),
            opts: C.extend(!0, {
                specialEasing: {},
                easing: C.easing._default
            }, c),
            originalProperties: t,
            originalOptions: c,
            startTime: Ze || nt(),
            duration: c.duration,
            tweens: [],
            createTween: function(t, c) {
                var n = C.Tween(e, o.opts, t, c, o.opts.specialEasing[t] || o.opts.easing);
                return o.tweens.push(n),
                n
            },
            stop: function(t) {
                var c = 0
                  , n = t ? o.tweens.length : 0;
                if (i)
                    return this;
                for (i = !0; c < n; c++)
                    o.tweens[c].run(1);
                return t ? (s.notifyWith(e, [o, 1, 0]),
                s.resolveWith(e, [o, t])) : s.rejectWith(e, [o, t]),
                this
            }
        }), h = o.props;
        for (function(e, t) {
            var c, n, i, a, r;
            for (c in e)
                if (i = t[n = W(c)],
                a = e[c],
                Array.isArray(a) && (i = a[1],
                a = e[c] = a[0]),
                c !== n && (e[n] = a,
                delete e[c]),
                (r = C.cssHooks[n]) && "expand"in r)
                    for (c in a = r.expand(a),
                    delete e[n],
                    a)
                        c in e || (e[c] = a[c],
                        t[c] = i);
                else
                    t[n] = i
        }(h, o.opts.specialEasing); a < r; a++)
            if (n = rt.prefilters[a].call(o, e, h, o.opts))
                return f(n.stop) && (C._queueHooks(o.elem, o.opts.queue).stop = n.stop.bind(n)),
                n;
        return C.map(h, at, o),
        f(o.opts.start) && o.opts.start.call(e, o),
        o.progress(o.opts.progress).done(o.opts.done, o.opts.complete).fail(o.opts.fail).always(o.opts.always),
        C.fx.timer(C.extend(l, {
            elem: e,
            anim: o,
            queue: o.opts.queue
        })),
        o
    }
    C.Animation = C.extend(rt, {
        tweeners: {
            "*": [function(e, t) {
                var c = this.createTween(e, t);
                return ae(c.elem, e, te.exec(t), c),
                c
            }
            ]
        },
        tweener: function(e, t) {
            f(e) ? (t = e,
            e = ["*"]) : e = e.match(D);
            for (var c, n = 0, i = e.length; n < i; n++)
                c = e[n],
                rt.tweeners[c] = rt.tweeners[c] || [],
                rt.tweeners[c].unshift(t)
        },
        prefilters: [function(e, t, c) {
            var n, i, a, r, s, l, o, h, v = "width"in t || "height"in t, u = this, d = {}, m = e.style, f = e.nodeType && ne(e), p = Y.get(e, "fxshow");
            for (n in c.queue || (null == (r = C._queueHooks(e, "fx")).unqueued && (r.unqueued = 0,
            s = r.empty.fire,
            r.empty.fire = function() {
                r.unqueued || s()
            }
            ),
            r.unqueued++,
            u.always(function() {
                u.always(function() {
                    r.unqueued--,
                    C.queue(e, "fx").length || r.empty.fire()
                })
            })),
            t)
                if (i = t[n],
                et.test(i)) {
                    if (delete t[n],
                    a = a || "toggle" === i,
                    i === (f ? "hide" : "show")) {
                        if ("show" !== i || !p || void 0 === p[n])
                            continue;
                        f = !0
                    }
                    d[n] = p && p[n] || C.style(e, n)
                }
            if ((l = !C.isEmptyObject(t)) || !C.isEmptyObject(d))
                for (n in v && 1 === e.nodeType && (c.overflow = [m.overflow, m.overflowX, m.overflowY],
                null == (o = p && p.display) && (o = Y.get(e, "display")),
                "none" === (h = C.css(e, "display")) && (o ? h = o : (le([e], !0),
                o = e.style.display || o,
                h = C.css(e, "display"),
                le([e]))),
                ("inline" === h || "inline-block" === h && null != o) && "none" === C.css(e, "float") && (l || (u.done(function() {
                    m.display = o
                }),
                null == o && (h = m.display,
                o = "none" === h ? "" : h)),
                m.display = "inline-block")),
                c.overflow && (m.overflow = "hidden",
                u.always(function() {
                    m.overflow = c.overflow[0],
                    m.overflowX = c.overflow[1],
                    m.overflowY = c.overflow[2]
                })),
                l = !1,
                d)
                    l || (p ? "hidden"in p && (f = p.hidden) : p = Y.access(e, "fxshow", {
                        display: o
                    }),
                    a && (p.hidden = !f),
                    f && le([e], !0),
                    u.done(function() {
                        for (n in f || le([e]),
                        Y.remove(e, "fxshow"),
                        d)
                            C.style(e, n, d[n])
                    })),
                    l = at(f ? p[n] : 0, n, u),
                    n in p || (p[n] = l.start,
                    f && (l.end = l.start,
                    l.start = 0))
        }
        ],
        prefilter: function(e, t) {
            t ? rt.prefilters.unshift(e) : rt.prefilters.push(e)
        }
    }),
    C.speed = function(e, t, c) {
        var n = e && "object" == typeof e ? C.extend({}, e) : {
            complete: c || !c && t || f(e) && e,
            duration: e,
            easing: c && t || t && !f(t) && t
        };
        return C.fx.off ? n.duration = 0 : "number" != typeof n.duration && (n.duration in C.fx.speeds ? n.duration = C.fx.speeds[n.duration] : n.duration = C.fx.speeds._default),
        null != n.queue && !0 !== n.queue || (n.queue = "fx"),
        n.old = n.complete,
        n.complete = function() {
            f(n.old) && n.old.call(this),
            n.queue && C.dequeue(this, n.queue)
        }
        ,
        n
    }
    ,
    C.fn.extend({
        fadeTo: function(e, t, c, n) {
            return this.filter(ne).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, c, n)
        },
        animate: function(e, t, c, n) {
            var i = C.isEmptyObject(e)
              , a = C.speed(t, c, n)
              , r = function() {
                var t = rt(this, C.extend({}, e), a);
                (i || Y.get(this, "finish")) && t.stop(!0)
            };
            return r.finish = r,
            i || !1 === a.queue ? this.each(r) : this.queue(a.queue, r)
        },
        stop: function(e, t, c) {
            var n = function(e) {
                var t = e.stop;
                delete e.stop,
                t(c)
            };
            return "string" != typeof e && (c = t,
            t = e,
            e = void 0),
            t && !1 !== e && this.queue(e || "fx", []),
            this.each(function() {
                var t = !0
                  , i = null != e && e + "queueHooks"
                  , a = C.timers
                  , r = Y.get(this);
                if (i)
                    r[i] && r[i].stop && n(r[i]);
                else
                    for (i in r)
                        r[i] && r[i].stop && tt.test(i) && n(r[i]);
                for (i = a.length; i--; )
                    a[i].elem !== this || null != e && a[i].queue !== e || (a[i].anim.stop(c),
                    t = !1,
                    a.splice(i, 1));
                !t && c || C.dequeue(this, e)
            })
        },
        finish: function(e) {
            return !1 !== e && (e = e || "fx"),
            this.each(function() {
                var t, c = Y.get(this), n = c[e + "queue"], i = c[e + "queueHooks"], a = C.timers, r = n ? n.length : 0;
                for (c.finish = !0,
                C.queue(this, e, []),
                i && i.stop && i.stop.call(this, !0),
                t = a.length; t--; )
                    a[t].elem === this && a[t].queue === e && (a[t].anim.stop(!0),
                    a.splice(t, 1));
                for (t = 0; t < r; t++)
                    n[t] && n[t].finish && n[t].finish.call(this);
                delete c.finish
            })
        }
    }),
    C.each(["toggle", "show", "hide"], function(e, t) {
        var c = C.fn[t];
        C.fn[t] = function(e, n, i) {
            return null == e || "boolean" == typeof e ? c.apply(this, arguments) : this.animate(it(t, !0), e, n, i)
        }
    }),
    C.each({
        slideDown: it("show"),
        slideUp: it("hide"),
        slideToggle: it("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        C.fn[e] = function(e, c, n) {
            return this.animate(t, e, c, n)
        }
    }),
    C.timers = [],
    C.fx.tick = function() {
        var e, t = 0, c = C.timers;
        for (Ze = Date.now(); t < c.length; t++)
            (e = c[t])() || c[t] !== e || c.splice(t--, 1);
        c.length || C.fx.stop(),
        Ze = void 0
    }
    ,
    C.fx.timer = function(e) {
        C.timers.push(e),
        C.fx.start()
    }
    ,
    C.fx.interval = 13,
    C.fx.start = function() {
        Je || (Je = !0,
        ct())
    }
    ,
    C.fx.stop = function() {
        Je = null
    }
    ,
    C.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    C.fn.delay = function(t, c) {
        return t = C.fx && C.fx.speeds[t] || t,
        c = c || "fx",
        this.queue(c, function(c, n) {
            var i = e.setTimeout(c, t);
            n.stop = function() {
                e.clearTimeout(i)
            }
        })
    }
    ,
    function() {
        var e = n.createElement("input")
          , t = n.createElement("select").appendChild(n.createElement("option"));
        e.type = "checkbox",
        m.checkOn = "" !== e.value,
        m.optSelected = t.selected,
        (e = n.createElement("input")).value = "t",
        e.type = "radio",
        m.radioValue = "t" === e.value
    }();
    var st, lt = C.expr.attrHandle;
    C.fn.extend({
        attr: function(e, t) {
            return R(this, C.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                C.removeAttr(this, e)
            })
        }
    }),
    C.extend({
        attr: function(e, t, c) {
            var n, i, a = e.nodeType;
            if (3 !== a && 8 !== a && 2 !== a)
                return void 0 === e.getAttribute ? C.prop(e, t, c) : (1 === a && C.isXMLDoc(e) || (i = C.attrHooks[t.toLowerCase()] || (C.expr.match.bool.test(t) ? st : void 0)),
                void 0 !== c ? null === c ? void C.removeAttr(e, t) : i && "set"in i && void 0 !== (n = i.set(e, c, t)) ? n : (e.setAttribute(t, c + ""),
                c) : i && "get"in i && null !== (n = i.get(e, t)) ? n : null == (n = C.find.attr(e, t)) ? void 0 : n)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!m.radioValue && "radio" === t && w(e, "input")) {
                        var c = e.value;
                        return e.setAttribute("type", t),
                        c && (e.value = c),
                        t
                    }
                }
            }
        },
        removeAttr: function(e, t) {
            var c, n = 0, i = t && t.match(D);
            if (i && 1 === e.nodeType)
                for (; c = i[n++]; )
                    e.removeAttribute(c)
        }
    }),
    st = {
        set: function(e, t, c) {
            return !1 === t ? C.removeAttr(e, c) : e.setAttribute(c, c),
            c
        }
    },
    C.each(C.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var c = lt[t] || C.find.attr;
        lt[t] = function(e, t, n) {
            var i, a, r = t.toLowerCase();
            return n || (a = lt[r],
            lt[r] = i,
            i = null != c(e, t, n) ? r : null,
            lt[r] = a),
            i
        }
    });
    var ot = /^(?:input|select|textarea|button)$/i
      , ht = /^(?:a|area)$/i;
    function vt(e) {
        return (e.match(D) || []).join(" ")
    }
    function ut(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }
    function dt(e) {
        return Array.isArray(e) ? e : "string" == typeof e && e.match(D) || []
    }
    C.fn.extend({
        prop: function(e, t) {
            return R(this, C.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[C.propFix[e] || e]
            })
        }
    }),
    C.extend({
        prop: function(e, t, c) {
            var n, i, a = e.nodeType;
            if (3 !== a && 8 !== a && 2 !== a)
                return 1 === a && C.isXMLDoc(e) || (t = C.propFix[t] || t,
                i = C.propHooks[t]),
                void 0 !== c ? i && "set"in i && void 0 !== (n = i.set(e, c, t)) ? n : e[t] = c : i && "get"in i && null !== (n = i.get(e, t)) ? n : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = C.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : ot.test(e.nodeName) || ht.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            for: "htmlFor",
            class: "className"
        }
    }),
    m.optSelected || (C.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex,
            null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex,
            t.parentNode && t.parentNode.selectedIndex)
        }
    }),
    C.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        C.propFix[this.toLowerCase()] = this
    }),
    C.fn.extend({
        addClass: function(e) {
            var t, c, n, i, a, r, s, l = 0;
            if (f(e))
                return this.each(function(t) {
                    C(this).addClass(e.call(this, t, ut(this)))
                });
            if ((t = dt(e)).length)
                for (; c = this[l++]; )
                    if (i = ut(c),
                    n = 1 === c.nodeType && " " + vt(i) + " ") {
                        for (r = 0; a = t[r++]; )
                            n.indexOf(" " + a + " ") < 0 && (n += a + " ");
                        i !== (s = vt(n)) && c.setAttribute("class", s)
                    }
            return this
        },
        removeClass: function(e) {
            var t, c, n, i, a, r, s, l = 0;
            if (f(e))
                return this.each(function(t) {
                    C(this).removeClass(e.call(this, t, ut(this)))
                });
            if (!arguments.length)
                return this.attr("class", "");
            if ((t = dt(e)).length)
                for (; c = this[l++]; )
                    if (i = ut(c),
                    n = 1 === c.nodeType && " " + vt(i) + " ") {
                        for (r = 0; a = t[r++]; )
                            for (; n.indexOf(" " + a + " ") > -1; )
                                n = n.replace(" " + a + " ", " ");
                        i !== (s = vt(n)) && c.setAttribute("class", s)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var c = typeof e
              , n = "string" === c || Array.isArray(e);
            return "boolean" == typeof t && n ? t ? this.addClass(e) : this.removeClass(e) : f(e) ? this.each(function(c) {
                C(this).toggleClass(e.call(this, c, ut(this), t), t)
            }) : this.each(function() {
                var t, i, a, r;
                if (n)
                    for (i = 0,
                    a = C(this),
                    r = dt(e); t = r[i++]; )
                        a.hasClass(t) ? a.removeClass(t) : a.addClass(t);
                else
                    void 0 !== e && "boolean" !== c || ((t = ut(this)) && Y.set(this, "__className__", t),
                    this.setAttribute && this.setAttribute("class", t || !1 === e ? "" : Y.get(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            var t, c, n = 0;
            for (t = " " + e + " "; c = this[n++]; )
                if (1 === c.nodeType && (" " + vt(ut(c)) + " ").indexOf(t) > -1)
                    return !0;
            return !1
        }
    });
    var mt = /\r/g;
    C.fn.extend({
        val: function(e) {
            var t, c, n, i = this[0];
            return arguments.length ? (n = f(e),
            this.each(function(c) {
                var i;
                1 === this.nodeType && (null == (i = n ? e.call(this, c, C(this).val()) : e) ? i = "" : "number" == typeof i ? i += "" : Array.isArray(i) && (i = C.map(i, function(e) {
                    return null == e ? "" : e + ""
                })),
                (t = C.valHooks[this.type] || C.valHooks[this.nodeName.toLowerCase()]) && "set"in t && void 0 !== t.set(this, i, "value") || (this.value = i))
            })) : i ? (t = C.valHooks[i.type] || C.valHooks[i.nodeName.toLowerCase()]) && "get"in t && void 0 !== (c = t.get(i, "value")) ? c : "string" == typeof (c = i.value) ? c.replace(mt, "") : null == c ? "" : c : void 0
        }
    }),
    C.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = C.find.attr(e, "value");
                    return null != t ? t : vt(C.text(e))
                }
            },
            select: {
                get: function(e) {
                    var t, c, n, i = e.options, a = e.selectedIndex, r = "select-one" === e.type, s = r ? null : [], l = r ? a + 1 : i.length;
                    for (n = a < 0 ? l : r ? a : 0; n < l; n++)
                        if (((c = i[n]).selected || n === a) && !c.disabled && (!c.parentNode.disabled || !w(c.parentNode, "optgroup"))) {
                            if (t = C(c).val(),
                            r)
                                return t;
                            s.push(t)
                        }
                    return s
                },
                set: function(e, t) {
                    for (var c, n, i = e.options, a = C.makeArray(t), r = i.length; r--; )
                        ((n = i[r]).selected = C.inArray(C.valHooks.option.get(n), a) > -1) && (c = !0);
                    return c || (e.selectedIndex = -1),
                    a
                }
            }
        }
    }),
    C.each(["radio", "checkbox"], function() {
        C.valHooks[this] = {
            set: function(e, t) {
                if (Array.isArray(t))
                    return e.checked = C.inArray(C(e).val(), t) > -1
            }
        },
        m.checkOn || (C.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        }
        )
    }),
    m.focusin = "onfocusin"in e;
    var ft = /^(?:focusinfocus|focusoutblur)$/
      , pt = function(e) {
        e.stopPropagation()
    };
    C.extend(C.event, {
        trigger: function(t, c, i, a) {
            var r, s, l, o, h, u, d, m, z = [i || n], g = v.call(t, "type") ? t.type : t, M = v.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = m = l = i = i || n,
            3 !== i.nodeType && 8 !== i.nodeType && !ft.test(g + C.event.triggered) && (g.indexOf(".") > -1 && (g = (M = g.split(".")).shift(),
            M.sort()),
            h = g.indexOf(":") < 0 && "on" + g,
            (t = t[C.expando] ? t : new C.Event(g,"object" == typeof t && t)).isTrigger = a ? 2 : 3,
            t.namespace = M.join("."),
            t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + M.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            t.result = void 0,
            t.target || (t.target = i),
            c = null == c ? [t] : C.makeArray(c, [t]),
            d = C.event.special[g] || {},
            a || !d.trigger || !1 !== d.trigger.apply(i, c))) {
                if (!a && !d.noBubble && !p(i)) {
                    for (o = d.delegateType || g,
                    ft.test(o + g) || (s = s.parentNode); s; s = s.parentNode)
                        z.push(s),
                        l = s;
                    l === (i.ownerDocument || n) && z.push(l.defaultView || l.parentWindow || e)
                }
                for (r = 0; (s = z[r++]) && !t.isPropagationStopped(); )
                    m = s,
                    t.type = r > 1 ? o : d.bindType || g,
                    (u = (Y.get(s, "events") || {})[t.type] && Y.get(s, "handle")) && u.apply(s, c),
                    (u = h && s[h]) && u.apply && X(s) && (t.result = u.apply(s, c),
                    !1 === t.result && t.preventDefault());
                return t.type = g,
                a || t.isDefaultPrevented() || d._default && !1 !== d._default.apply(z.pop(), c) || !X(i) || h && f(i[g]) && !p(i) && ((l = i[h]) && (i[h] = null),
                C.event.triggered = g,
                t.isPropagationStopped() && m.addEventListener(g, pt),
                i[g](),
                t.isPropagationStopped() && m.removeEventListener(g, pt),
                C.event.triggered = void 0,
                l && (i[h] = l)),
                t.result
            }
        },
        simulate: function(e, t, c) {
            var n = C.extend(new C.Event, c, {
                type: e,
                isSimulated: !0
            });
            C.event.trigger(n, null, t)
        }
    }),
    C.fn.extend({
        trigger: function(e, t) {
            return this.each(function() {
                C.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var c = this[0];
            if (c)
                return C.event.trigger(e, t, c, !0)
        }
    }),
    m.focusin || C.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var c = function(e) {
            C.event.simulate(t, e.target, C.event.fix(e))
        };
        C.event.special[t] = {
            setup: function() {
                var n = this.ownerDocument || this
                  , i = Y.access(n, t);
                i || n.addEventListener(e, c, !0),
                Y.access(n, t, (i || 0) + 1)
            },
            teardown: function() {
                var n = this.ownerDocument || this
                  , i = Y.access(n, t) - 1;
                i ? Y.access(n, t, i) : (n.removeEventListener(e, c, !0),
                Y.remove(n, t))
            }
        }
    });
    var zt = e.location
      , gt = Date.now()
      , Mt = /\?/;
    C.parseXML = function(t) {
        var c;
        if (!t || "string" != typeof t)
            return null;
        try {
            c = (new e.DOMParser).parseFromString(t, "text/xml")
        } catch (e) {
            c = void 0
        }
        return c && !c.getElementsByTagName("parsererror").length || C.error("Invalid XML: " + t),
        c
    }
    ;
    var Ct = /\[\]$/
      , yt = /\r?\n/g
      , Ht = /^(?:submit|button|image|reset|file)$/i
      , bt = /^(?:input|select|textarea|keygen)/i;
    function Vt(e, t, c, n) {
        var i;
        if (Array.isArray(t))
            C.each(t, function(t, i) {
                c || Ct.test(e) ? n(e, i) : Vt(e + "[" + ("object" == typeof i && null != i ? t : "") + "]", i, c, n)
            });
        else if (c || "object" !== M(t))
            n(e, t);
        else
            for (i in t)
                Vt(e + "[" + i + "]", t[i], c, n)
    }
    C.param = function(e, t) {
        var c, n = [], i = function(e, t) {
            var c = f(t) ? t() : t;
            n[n.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == c ? "" : c)
        };
        if (Array.isArray(e) || e.jquery && !C.isPlainObject(e))
            C.each(e, function() {
                i(this.name, this.value)
            });
        else
            for (c in e)
                Vt(c, e[c], t, i);
        return n.join("&")
    }
    ,
    C.fn.extend({
        serialize: function() {
            return C.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = C.prop(this, "elements");
                return e ? C.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !C(this).is(":disabled") && bt.test(this.nodeName) && !Ht.test(e) && (this.checked || !oe.test(e))
            }).map(function(e, t) {
                var c = C(this).val();
                return null == c ? null : Array.isArray(c) ? C.map(c, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(yt, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: c.replace(yt, "\r\n")
                }
            }).get()
        }
    });
    var Lt = /%20/g
      , xt = /#.*$/
      , wt = /([?&])_=[^&]*/
      , kt = /^(.*?):[ \t]*([^\r\n]*)$/gm
      , $t = /^(?:GET|HEAD)$/
      , _t = /^\/\//
      , Et = {}
      , St = {}
      , At = "*/".concat("*")
      , Tt = n.createElement("a");
    function Dt(e) {
        return function(t, c) {
            "string" != typeof t && (c = t,
            t = "*");
            var n, i = 0, a = t.toLowerCase().match(D) || [];
            if (f(c))
                for (; n = a[i++]; )
                    "+" === n[0] ? (n = n.slice(1) || "*",
                    (e[n] = e[n] || []).unshift(c)) : (e[n] = e[n] || []).push(c)
        }
    }
    function Pt(e, t, c, n) {
        var i = {}
          , a = e === St;
        function r(s) {
            var l;
            return i[s] = !0,
            C.each(e[s] || [], function(e, s) {
                var o = s(t, c, n);
                return "string" != typeof o || a || i[o] ? a ? !(l = o) : void 0 : (t.dataTypes.unshift(o),
                r(o),
                !1)
            }),
            l
        }
        return r(t.dataTypes[0]) || !i["*"] && r("*")
    }
    function Nt(e, t) {
        var c, n, i = C.ajaxSettings.flatOptions || {};
        for (c in t)
            void 0 !== t[c] && ((i[c] ? e : n || (n = {}))[c] = t[c]);
        return n && C.extend(!0, e, n),
        e
    }
    Tt.href = zt.href,
    C.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: zt.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(zt.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": At,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": C.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? Nt(Nt(e, C.ajaxSettings), t) : Nt(C.ajaxSettings, e)
        },
        ajaxPrefilter: Dt(Et),
        ajaxTransport: Dt(St),
        ajax: function(t, c) {
            "object" == typeof t && (c = t,
            t = void 0),
            c = c || {};
            var i, a, r, s, l, o, h, v, u, d, m = C.ajaxSetup({}, c), f = m.context || m, p = m.context && (f.nodeType || f.jquery) ? C(f) : C.event, z = C.Deferred(), g = C.Callbacks("once memory"), M = m.statusCode || {}, y = {}, H = {}, b = "canceled", V = {
                readyState: 0,
                getResponseHeader: function(e) {
                    var t;
                    if (h) {
                        if (!s)
                            for (s = {}; t = kt.exec(r); )
                                s[t[1].toLowerCase()] = t[2];
                        t = s[e.toLowerCase()]
                    }
                    return null == t ? null : t
                },
                getAllResponseHeaders: function() {
                    return h ? r : null
                },
                setRequestHeader: function(e, t) {
                    return null == h && (e = H[e.toLowerCase()] = H[e.toLowerCase()] || e,
                    y[e] = t),
                    this
                },
                overrideMimeType: function(e) {
                    return null == h && (m.mimeType = e),
                    this
                },
                statusCode: function(e) {
                    var t;
                    if (e)
                        if (h)
                            V.always(e[V.status]);
                        else
                            for (t in e)
                                M[t] = [M[t], e[t]];
                    return this
                },
                abort: function(e) {
                    var t = e || b;
                    return i && i.abort(t),
                    L(0, t),
                    this
                }
            };
            if (z.promise(V),
            m.url = ((t || m.url || zt.href) + "").replace(_t, zt.protocol + "//"),
            m.type = c.method || c.type || m.method || m.type,
            m.dataTypes = (m.dataType || "*").toLowerCase().match(D) || [""],
            null == m.crossDomain) {
                o = n.createElement("a");
                try {
                    o.href = m.url,
                    o.href = o.href,
                    m.crossDomain = Tt.protocol + "//" + Tt.host != o.protocol + "//" + o.host
                } catch (e) {
                    m.crossDomain = !0
                }
            }
            if (m.data && m.processData && "string" != typeof m.data && (m.data = C.param(m.data, m.traditional)),
            Pt(Et, m, c, V),
            h)
                return V;
            for (u in (v = C.event && m.global) && 0 == C.active++ && C.event.trigger("ajaxStart"),
            m.type = m.type.toUpperCase(),
            m.hasContent = !$t.test(m.type),
            a = m.url.replace(xt, ""),
            m.hasContent ? m.data && m.processData && 0 === (m.contentType || "").indexOf("application/x-www-form-urlencoded") && (m.data = m.data.replace(Lt, "+")) : (d = m.url.slice(a.length),
            m.data && (m.processData || "string" == typeof m.data) && (a += (Mt.test(a) ? "&" : "?") + m.data,
            delete m.data),
            !1 === m.cache && (a = a.replace(wt, "$1"),
            d = (Mt.test(a) ? "&" : "?") + "_=" + gt++ + d),
            m.url = a + d),
            m.ifModified && (C.lastModified[a] && V.setRequestHeader("If-Modified-Since", C.lastModified[a]),
            C.etag[a] && V.setRequestHeader("If-None-Match", C.etag[a])),
            (m.data && m.hasContent && !1 !== m.contentType || c.contentType) && V.setRequestHeader("Content-Type", m.contentType),
            V.setRequestHeader("Accept", m.dataTypes[0] && m.accepts[m.dataTypes[0]] ? m.accepts[m.dataTypes[0]] + ("*" !== m.dataTypes[0] ? ", " + At + "; q=0.01" : "") : m.accepts["*"]),
            m.headers)
                V.setRequestHeader(u, m.headers[u]);
            if (m.beforeSend && (!1 === m.beforeSend.call(f, V, m) || h))
                return V.abort();
            if (b = "abort",
            g.add(m.complete),
            V.done(m.success),
            V.fail(m.error),
            i = Pt(St, m, c, V)) {
                if (V.readyState = 1,
                v && p.trigger("ajaxSend", [V, m]),
                h)
                    return V;
                m.async && m.timeout > 0 && (l = e.setTimeout(function() {
                    V.abort("timeout")
                }, m.timeout));
                try {
                    h = !1,
                    i.send(y, L)
                } catch (e) {
                    if (h)
                        throw e;
                    L(-1, e)
                }
            } else
                L(-1, "No Transport");
            function L(t, c, n, s) {
                var o, u, d, y, H, b = c;
                h || (h = !0,
                l && e.clearTimeout(l),
                i = void 0,
                r = s || "",
                V.readyState = t > 0 ? 4 : 0,
                o = t >= 200 && t < 300 || 304 === t,
                n && (y = function(e, t, c) {
                    for (var n, i, a, r, s = e.contents, l = e.dataTypes; "*" === l[0]; )
                        l.shift(),
                        void 0 === n && (n = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (n)
                        for (i in s)
                            if (s[i] && s[i].test(n)) {
                                l.unshift(i);
                                break
                            }
                    if (l[0]in c)
                        a = l[0];
                    else {
                        for (i in c) {
                            if (!l[0] || e.converters[i + " " + l[0]]) {
                                a = i;
                                break
                            }
                            r || (r = i)
                        }
                        a = a || r
                    }
                    if (a)
                        return a !== l[0] && l.unshift(a),
                        c[a]
                }(m, V, n)),
                y = function(e, t, c, n) {
                    var i, a, r, s, l, o = {}, h = e.dataTypes.slice();
                    if (h[1])
                        for (r in e.converters)
                            o[r.toLowerCase()] = e.converters[r];
                    for (a = h.shift(); a; )
                        if (e.responseFields[a] && (c[e.responseFields[a]] = t),
                        !l && n && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                        l = a,
                        a = h.shift())
                            if ("*" === a)
                                a = l;
                            else if ("*" !== l && l !== a) {
                                if (!(r = o[l + " " + a] || o["* " + a]))
                                    for (i in o)
                                        if ((s = i.split(" "))[1] === a && (r = o[l + " " + s[0]] || o["* " + s[0]])) {
                                            !0 === r ? r = o[i] : !0 !== o[i] && (a = s[0],
                                            h.unshift(s[1]));
                                            break
                                        }
                                if (!0 !== r)
                                    if (r && e.throws)
                                        t = r(t);
                                    else
                                        try {
                                            t = r(t)
                                        } catch (e) {
                                            return {
                                                state: "parsererror",
                                                error: r ? e : "No conversion from " + l + " to " + a
                                            }
                                        }
                            }
                    return {
                        state: "success",
                        data: t
                    }
                }(m, y, V, o),
                o ? (m.ifModified && ((H = V.getResponseHeader("Last-Modified")) && (C.lastModified[a] = H),
                (H = V.getResponseHeader("etag")) && (C.etag[a] = H)),
                204 === t || "HEAD" === m.type ? b = "nocontent" : 304 === t ? b = "notmodified" : (b = y.state,
                u = y.data,
                o = !(d = y.error))) : (d = b,
                !t && b || (b = "error",
                t < 0 && (t = 0))),
                V.status = t,
                V.statusText = (c || b) + "",
                o ? z.resolveWith(f, [u, b, V]) : z.rejectWith(f, [V, b, d]),
                V.statusCode(M),
                M = void 0,
                v && p.trigger(o ? "ajaxSuccess" : "ajaxError", [V, m, o ? u : d]),
                g.fireWith(f, [V, b]),
                v && (p.trigger("ajaxComplete", [V, m]),
                --C.active || C.event.trigger("ajaxStop")))
            }
            return V
        },
        getJSON: function(e, t, c) {
            return C.get(e, t, c, "json")
        },
        getScript: function(e, t) {
            return C.get(e, void 0, t, "script")
        }
    }),
    C.each(["get", "post"], function(e, t) {
        C[t] = function(e, c, n, i) {
            return f(c) && (i = i || n,
            n = c,
            c = void 0),
            C.ajax(C.extend({
                url: e,
                type: t,
                dataType: i,
                data: c,
                success: n
            }, C.isPlainObject(e) && e))
        }
    }),
    C._evalUrl = function(e) {
        return C.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            throws: !0
        })
    }
    ,
    C.fn.extend({
        wrapAll: function(e) {
            var t;
            return this[0] && (f(e) && (e = e.call(this[0])),
            t = C(e, this[0].ownerDocument).eq(0).clone(!0),
            this[0].parentNode && t.insertBefore(this[0]),
            t.map(function() {
                for (var e = this; e.firstElementChild; )
                    e = e.firstElementChild;
                return e
            }).append(this)),
            this
        },
        wrapInner: function(e) {
            return f(e) ? this.each(function(t) {
                C(this).wrapInner(e.call(this, t))
            }) : this.each(function() {
                var t = C(this)
                  , c = t.contents();
                c.length ? c.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = f(e);
            return this.each(function(c) {
                C(this).wrapAll(t ? e.call(this, c) : e)
            })
        },
        unwrap: function(e) {
            return this.parent(e).not("body").each(function() {
                C(this).replaceWith(this.childNodes)
            }),
            this
        }
    }),
    C.expr.pseudos.hidden = function(e) {
        return !C.expr.pseudos.visible(e)
    }
    ,
    C.expr.pseudos.visible = function(e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }
    ,
    C.ajaxSettings.xhr = function() {
        try {
            return new e.XMLHttpRequest
        } catch (e) {}
    }
    ;
    var jt = {
        0: 200,
        1223: 204
    }
      , Ot = C.ajaxSettings.xhr();
    m.cors = !!Ot && "withCredentials"in Ot,
    m.ajax = Ot = !!Ot,
    C.ajaxTransport(function(t) {
        var c, n;
        if (m.cors || Ot && !t.crossDomain)
            return {
                send: function(i, a) {
                    var r, s = t.xhr();
                    if (s.open(t.type, t.url, t.async, t.username, t.password),
                    t.xhrFields)
                        for (r in t.xhrFields)
                            s[r] = t.xhrFields[r];
                    for (r in t.mimeType && s.overrideMimeType && s.overrideMimeType(t.mimeType),
                    t.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest"),
                    i)
                        s.setRequestHeader(r, i[r]);
                    c = function(e) {
                        return function() {
                            c && (c = n = s.onload = s.onerror = s.onabort = s.ontimeout = s.onreadystatechange = null,
                            "abort" === e ? s.abort() : "error" === e ? "number" != typeof s.status ? a(0, "error") : a(s.status, s.statusText) : a(jt[s.status] || s.status, s.statusText, "text" !== (s.responseType || "text") || "string" != typeof s.responseText ? {
                                binary: s.response
                            } : {
                                text: s.responseText
                            }, s.getAllResponseHeaders()))
                        }
                    }
                    ,
                    s.onload = c(),
                    n = s.onerror = s.ontimeout = c("error"),
                    void 0 !== s.onabort ? s.onabort = n : s.onreadystatechange = function() {
                        4 === s.readyState && e.setTimeout(function() {
                            c && n()
                        })
                    }
                    ,
                    c = c("abort");
                    try {
                        s.send(t.hasContent && t.data || null)
                    } catch (e) {
                        if (c)
                            throw e
                    }
                },
                abort: function() {
                    c && c()
                }
            }
    }),
    C.ajaxPrefilter(function(e) {
        e.crossDomain && (e.contents.script = !1)
    }),
    C.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return C.globalEval(e),
                e
            }
        }
    }),
    C.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1),
        e.crossDomain && (e.type = "GET")
    }),
    C.ajaxTransport("script", function(e) {
        var t, c;
        if (e.crossDomain)
            return {
                send: function(i, a) {
                    t = C("<script>").prop({
                        charset: e.scriptCharset,
                        src: e.url
                    }).on("load error", c = function(e) {
                        t.remove(),
                        c = null,
                        e && a("error" === e.type ? 404 : 200, e.type)
                    }
                    ),
                    n.head.appendChild(t[0])
                },
                abort: function() {
                    c && c()
                }
            }
    });
    var It = []
      , qt = /(=)\?(?=&|$)|\?\?/;
    C.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = It.pop() || C.expando + "_" + gt++;
            return this[e] = !0,
            e
        }
    }),
    C.ajaxPrefilter("json jsonp", function(t, c, n) {
        var i, a, r, s = !1 !== t.jsonp && (qt.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && qt.test(t.data) && "data");
        if (s || "jsonp" === t.dataTypes[0])
            return i = t.jsonpCallback = f(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback,
            s ? t[s] = t[s].replace(qt, "$1" + i) : !1 !== t.jsonp && (t.url += (Mt.test(t.url) ? "&" : "?") + t.jsonp + "=" + i),
            t.converters["script json"] = function() {
                return r || C.error(i + " was not called"),
                r[0]
            }
            ,
            t.dataTypes[0] = "json",
            a = e[i],
            e[i] = function() {
                r = arguments
            }
            ,
            n.always(function() {
                void 0 === a ? C(e).removeProp(i) : e[i] = a,
                t[i] && (t.jsonpCallback = c.jsonpCallback,
                It.push(i)),
                r && f(a) && a(r[0]),
                r = a = void 0
            }),
            "script"
    }),
    m.createHTMLDocument = function() {
        var e = n.implementation.createHTMLDocument("").body;
        return e.innerHTML = "<form></form><form></form>",
        2 === e.childNodes.length
    }(),
    C.parseHTML = function(e, t, c) {
        return "string" != typeof e ? [] : ("boolean" == typeof t && (c = t,
        t = !1),
        t || (m.createHTMLDocument ? ((i = (t = n.implementation.createHTMLDocument("")).createElement("base")).href = n.location.href,
        t.head.appendChild(i)) : t = n),
        r = !c && [],
        (a = k.exec(e)) ? [t.createElement(a[1])] : (a = pe([e], t, r),
        r && r.length && C(r).remove(),
        C.merge([], a.childNodes)));
        var i, a, r
    }
    ,
    C.fn.load = function(e, t, c) {
        var n, i, a, r = this, s = e.indexOf(" ");
        return s > -1 && (n = vt(e.slice(s)),
        e = e.slice(0, s)),
        f(t) ? (c = t,
        t = void 0) : t && "object" == typeof t && (i = "POST"),
        r.length > 0 && C.ajax({
            url: e,
            type: i || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            a = arguments,
            r.html(n ? C("<div>").append(C.parseHTML(e)).find(n) : e)
        }).always(c && function(e, t) {
            r.each(function() {
                c.apply(this, a || [e.responseText, t, e])
            })
        }
        ),
        this
    }
    ,
    C.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        C.fn[t] = function(e) {
            return this.on(t, e)
        }
    }),
    C.expr.pseudos.animated = function(e) {
        return C.grep(C.timers, function(t) {
            return e === t.elem
        }).length
    }
    ,
    C.offset = {
        setOffset: function(e, t, c) {
            var n, i, a, r, s, l, o = C.css(e, "position"), h = C(e), v = {};
            "static" === o && (e.style.position = "relative"),
            s = h.offset(),
            a = C.css(e, "top"),
            l = C.css(e, "left"),
            ("absolute" === o || "fixed" === o) && (a + l).indexOf("auto") > -1 ? (r = (n = h.position()).top,
            i = n.left) : (r = parseFloat(a) || 0,
            i = parseFloat(l) || 0),
            f(t) && (t = t.call(e, c, C.extend({}, s))),
            null != t.top && (v.top = t.top - s.top + r),
            null != t.left && (v.left = t.left - s.left + i),
            "using"in t ? t.using.call(e, v) : h.css(v)
        }
    },
    C.fn.extend({
        offset: function(e) {
            if (arguments.length)
                return void 0 === e ? this : this.each(function(t) {
                    C.offset.setOffset(this, e, t)
                });
            var t, c, n = this[0];
            return n ? n.getClientRects().length ? (t = n.getBoundingClientRect(),
            c = n.ownerDocument.defaultView,
            {
                top: t.top + c.pageYOffset,
                left: t.left + c.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, c, n = this[0], i = {
                    top: 0,
                    left: 0
                };
                if ("fixed" === C.css(n, "position"))
                    t = n.getBoundingClientRect();
                else {
                    for (t = this.offset(),
                    c = n.ownerDocument,
                    e = n.offsetParent || c.documentElement; e && (e === c.body || e === c.documentElement) && "static" === C.css(e, "position"); )
                        e = e.parentNode;
                    e && e !== n && 1 === e.nodeType && ((i = C(e).offset()).top += C.css(e, "borderTopWidth", !0),
                    i.left += C.css(e, "borderLeftWidth", !0))
                }
                return {
                    top: t.top - i.top - C.css(n, "marginTop", !0),
                    left: t.left - i.left - C.css(n, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent; e && "static" === C.css(e, "position"); )
                    e = e.offsetParent;
                return e || ze
            })
        }
    }),
    C.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, t) {
        var c = "pageYOffset" === t;
        C.fn[e] = function(n) {
            return R(this, function(e, n, i) {
                var a;
                if (p(e) ? a = e : 9 === e.nodeType && (a = e.defaultView),
                void 0 === i)
                    return a ? a[t] : e[n];
                a ? a.scrollTo(c ? a.pageXOffset : i, c ? i : a.pageYOffset) : e[n] = i
            }, e, n, arguments.length)
        }
    }),
    C.each(["top", "left"], function(e, t) {
        C.cssHooks[t] = Ie(m.pixelPosition, function(e, c) {
            if (c)
                return c = Oe(e, t),
                Pe.test(c) ? C(e).position()[t] + "px" : c
        })
    }),
    C.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        C.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(c, n) {
            C.fn[n] = function(i, a) {
                var r = arguments.length && (c || "boolean" != typeof i)
                  , s = c || (!0 === i || !0 === a ? "margin" : "border");
                return R(this, function(t, c, i) {
                    var a;
                    return p(t) ? 0 === n.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (a = t.documentElement,
                    Math.max(t.body["scroll" + e], a["scroll" + e], t.body["offset" + e], a["offset" + e], a["client" + e])) : void 0 === i ? C.css(t, c, s) : C.style(t, c, i, s)
                }, t, r ? i : void 0, r)
            }
        })
    }),
    C.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, t) {
        C.fn[t] = function(e, c) {
            return arguments.length > 0 ? this.on(t, null, e, c) : this.trigger(t)
        }
    }),
    C.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }),
    C.fn.extend({
        bind: function(e, t, c) {
            return this.on(e, null, t, c)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, c, n) {
            return this.on(t, e, c, n)
        },
        undelegate: function(e, t, c) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", c)
        }
    }),
    C.proxy = function(e, t) {
        var c, n, i;
        if ("string" == typeof t && (c = e[t],
        t = e,
        e = c),
        f(e))
            return n = a.call(arguments, 2),
            (i = function() {
                return e.apply(t || this, n.concat(a.call(arguments)))
            }
            ).guid = e.guid = e.guid || C.guid++,
            i
    }
    ,
    C.holdReady = function(e) {
        e ? C.readyWait++ : C.ready(!0)
    }
    ,
    C.isArray = Array.isArray,
    C.parseJSON = JSON.parse,
    C.nodeName = w,
    C.isFunction = f,
    C.isWindow = p,
    C.camelCase = W,
    C.type = M,
    C.now = Date.now,
    C.isNumeric = function(e) {
        var t = C.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
    }
    ,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return C
    });
    var Rt = e.jQuery
      , Ft = e.$;
    return C.noConflict = function(t) {
        return e.$ === C && (e.$ = Ft),
        t && e.jQuery === C && (e.jQuery = Rt),
        C
    }
    ,
    t || (e.jQuery = e.$ = C),
    C
});
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e
}
: function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
}
  , windowIsDefined = "object" === ("undefined" == typeof window ? "undefined" : _typeof(window));
!function(e) {
    if ("function" == typeof define && define.amd)
        define(["jquery"], e);
    else if ("object" === ("undefined" == typeof module ? "undefined" : _typeof(module)) && module.exports) {
        var t;
        try {
            t = require("jquery")
        } catch (e) {
            t = null
        }
        module.exports = e(t)
    } else
        window && (window.Slider = e(window.jQuery))
}(function(e) {
    var t, c = "slider", n = "bootstrapSlider";
    return windowIsDefined && !window.console && (window.console = {}),
    windowIsDefined && !window.console.log && (window.console.log = function() {}
    ),
    windowIsDefined && !window.console.warn && (window.console.warn = function() {}
    ),
    function(e) {
        function t() {}
        var c = Array.prototype.slice;
        !function(e) {
            function n(t) {
                t.prototype.option || (t.prototype.option = function(t) {
                    e.isPlainObject(t) && (this.options = e.extend(!0, this.options, t))
                }
                )
            }
            function i(t, n) {
                e.fn[t] = function(i) {
                    if ("string" == typeof i) {
                        for (var r = c.call(arguments, 1), s = 0, l = this.length; l > s; s++) {
                            var o = this[s]
                              , h = e.data(o, t);
                            if (h)
                                if (e.isFunction(h[i]) && "_" !== i.charAt(0)) {
                                    var v = h[i].apply(h, r);
                                    if (void 0 !== v && v !== h)
                                        return v
                                } else
                                    a("no such method '" + i + "' for " + t + " instance");
                            else
                                a("cannot call methods on " + t + " prior to initialization; attempted to call '" + i + "'")
                        }
                        return this
                    }
                    var u = this.map(function() {
                        var c = e.data(this, t);
                        return c ? (c.option(i),
                        c._init()) : (c = new n(this,i),
                        e.data(this, t, c)),
                        e(this)
                    });
                    return !u || u.length > 1 ? u : u[0]
                }
            }
            if (e) {
                var a = "undefined" == typeof console ? t : function(e) {
                    console.error(e)
                }
                ;
                e.bridget = function(e, t) {
                    n(t),
                    i(e, t)
                }
                ,
                e.bridget
            }
        }(e)
    }(e),
    function(e) {
        function i(t, c) {
            function n(e, t) {
                var c = "data-slider-" + t.replace(/_/g, "-")
                  , n = e.getAttribute(c);
                try {
                    return JSON.parse(n)
                } catch (e) {
                    return n
                }
            }
            this._state = {
                value: null,
                enabled: null,
                offset: null,
                size: null,
                percentage: null,
                inDrag: !1,
                over: !1
            },
            this.ticksCallbackMap = {},
            this.handleCallbackMap = {},
            "string" == typeof t ? this.element = document.querySelector(t) : t instanceof HTMLElement && (this.element = t),
            c = c || {};
            for (var i = Object.keys(this.defaultOptions), a = c.hasOwnProperty("min"), r = c.hasOwnProperty("max"), l = 0; l < i.length; l++) {
                var o = i[l]
                  , h = c[o];
                h = null !== (h = void 0 !== h ? h : n(this.element, o)) ? h : this.defaultOptions[o],
                this.options || (this.options = {}),
                this.options[o] = h
            }
            if ("auto" === this.options.rtl) {
                var v = window.getComputedStyle(this.element);
                this.options.rtl = null != v ? "rtl" === v.direction : "rtl" === this.element.style.direction
            }
            "vertical" !== this.options.orientation || "top" !== this.options.tooltip_position && "bottom" !== this.options.tooltip_position ? "horizontal" !== this.options.orientation || "left" !== this.options.tooltip_position && "right" !== this.options.tooltip_position || (this.options.tooltip_position = "top") : this.options.rtl ? this.options.tooltip_position = "left" : this.options.tooltip_position = "right";
            var u, d, m, f, p, z = this.element.style.width, g = !1, M = this.element.parentNode;
            if (this.sliderElem)
                g = !0;
            else {
                this.sliderElem = document.createElement("div"),
                this.sliderElem.className = "slider";
                var C = document.createElement("div");
                C.className = "slider-track",
                (d = document.createElement("div")).className = "slider-track-low",
                (u = document.createElement("div")).className = "slider-selection",
                (m = document.createElement("div")).className = "slider-track-high",
                (f = document.createElement("div")).className = "slider-handle min-slider-handle",
                f.setAttribute("role", "slider"),
                f.setAttribute("aria-valuemin", this.options.min),
                f.setAttribute("aria-valuemax", this.options.max),
                (p = document.createElement("div")).className = "slider-handle max-slider-handle",
                p.setAttribute("role", "slider"),
                p.setAttribute("aria-valuemin", this.options.min),
                p.setAttribute("aria-valuemax", this.options.max),
                C.appendChild(d),
                C.appendChild(u),
                C.appendChild(m),
                this.rangeHighlightElements = [];
                var y = this.options.rangeHighlights;
                if (Array.isArray(y) && y.length > 0)
                    for (var H = 0; H < y.length; H++) {
                        var b = document.createElement("div")
                          , V = y[H].class || "";
                        b.className = "slider-rangeHighlight slider-selection " + V,
                        this.rangeHighlightElements.push(b),
                        C.appendChild(b)
                    }
                var L = Array.isArray(this.options.labelledby);
                if (L && this.options.labelledby[0] && f.setAttribute("aria-labelledby", this.options.labelledby[0]),
                L && this.options.labelledby[1] && p.setAttribute("aria-labelledby", this.options.labelledby[1]),
                !L && this.options.labelledby && (f.setAttribute("aria-labelledby", this.options.labelledby),
                p.setAttribute("aria-labelledby", this.options.labelledby)),
                this.ticks = [],
                Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
                    for (this.ticksContainer = document.createElement("div"),
                    this.ticksContainer.className = "slider-tick-container",
                    l = 0; l < this.options.ticks.length; l++) {
                        var x = document.createElement("div");
                        if (x.className = "slider-tick",
                        this.options.ticks_tooltip) {
                            var w = this._addTickListener()
                              , k = w.addMouseEnter(this, x, l)
                              , $ = w.addMouseLeave(this, x);
                            this.ticksCallbackMap[l] = {
                                mouseEnter: k,
                                mouseLeave: $
                            }
                        }
                        this.ticks.push(x),
                        this.ticksContainer.appendChild(x)
                    }
                    u.className += " tick-slider-selection"
                }
                if (this.tickLabels = [],
                Array.isArray(this.options.ticks_labels) && this.options.ticks_labels.length > 0)
                    for (this.tickLabelContainer = document.createElement("div"),
                    this.tickLabelContainer.className = "slider-tick-label-container",
                    l = 0; l < this.options.ticks_labels.length; l++) {
                        var _ = document.createElement("div")
                          , E = 0 === this.options.ticks_positions.length
                          , S = this.options.reversed && E ? this.options.ticks_labels.length - (l + 1) : l;
                        _.className = "slider-tick-label",
                        _.innerHTML = this.options.ticks_labels[S],
                        this.tickLabels.push(_),
                        this.tickLabelContainer.appendChild(_)
                    }
                var A = function(e) {
                    var t = document.createElement("div");
                    t.className = "tooltip-arrow";
                    var c = document.createElement("div");
                    c.className = "tooltip-inner",
                    e.appendChild(t),
                    e.appendChild(c)
                }
                  , T = document.createElement("div");
                T.className = "tooltip tooltip-main",
                T.setAttribute("role", "presentation"),
                A(T);
                var D = document.createElement("div");
                D.className = "tooltip tooltip-min",
                D.setAttribute("role", "presentation"),
                A(D);
                var P = document.createElement("div");
                P.className = "tooltip tooltip-max",
                P.setAttribute("role", "presentation"),
                A(P),
                this.sliderElem.appendChild(C),
                this.sliderElem.appendChild(T),
                this.sliderElem.appendChild(D),
                this.sliderElem.appendChild(P),
                this.tickLabelContainer && this.sliderElem.appendChild(this.tickLabelContainer),
                this.ticksContainer && this.sliderElem.appendChild(this.ticksContainer),
                this.sliderElem.appendChild(f),
                this.sliderElem.appendChild(p),
                M.insertBefore(this.sliderElem, this.element),
                this.element.style.display = "none"
            }
            if (e && (this.$element = e(this.element),
            this.$sliderElem = e(this.sliderElem)),
            this.eventToCallbackMap = {},
            this.sliderElem.id = this.options.id,
            this.touchCapable = "ontouchstart"in window || window.DocumentTouch && document instanceof window.DocumentTouch,
            this.touchX = 0,
            this.touchY = 0,
            this.tooltip = this.sliderElem.querySelector(".tooltip-main"),
            this.tooltipInner = this.tooltip.querySelector(".tooltip-inner"),
            this.tooltip_min = this.sliderElem.querySelector(".tooltip-min"),
            this.tooltipInner_min = this.tooltip_min.querySelector(".tooltip-inner"),
            this.tooltip_max = this.sliderElem.querySelector(".tooltip-max"),
            this.tooltipInner_max = this.tooltip_max.querySelector(".tooltip-inner"),
            s[this.options.scale] && (this.options.scale = s[this.options.scale]),
            !0 === g && (this._removeClass(this.sliderElem, "slider-horizontal"),
            this._removeClass(this.sliderElem, "slider-vertical"),
            this._removeClass(this.sliderElem, "slider-rtl"),
            this._removeClass(this.tooltip, "hide"),
            this._removeClass(this.tooltip_min, "hide"),
            this._removeClass(this.tooltip_max, "hide"),
            ["left", "right", "top", "width", "height"].forEach(function(e) {
                this._removeProperty(this.trackLow, e),
                this._removeProperty(this.trackSelection, e),
                this._removeProperty(this.trackHigh, e)
            }, this),
            [this.handle1, this.handle2].forEach(function(e) {
                this._removeProperty(e, "left"),
                this._removeProperty(e, "right"),
                this._removeProperty(e, "top")
            }, this),
            [this.tooltip, this.tooltip_min, this.tooltip_max].forEach(function(e) {
                this._removeProperty(e, "left"),
                this._removeProperty(e, "right"),
                this._removeProperty(e, "top"),
                this._removeClass(e, "right"),
                this._removeClass(e, "left"),
                this._removeClass(e, "top")
            }, this)),
            "vertical" === this.options.orientation ? (this._addClass(this.sliderElem, "slider-vertical"),
            this.stylePos = "top",
            this.mousePos = "pageY",
            this.sizePos = "offsetHeight") : (this._addClass(this.sliderElem, "slider-horizontal"),
            this.sliderElem.style.width = z,
            this.options.orientation = "horizontal",
            this.options.rtl ? this.stylePos = "right" : this.stylePos = "left",
            this.mousePos = "clientX",
            this.sizePos = "offsetWidth"),
            this.options.rtl && this._addClass(this.sliderElem, "slider-rtl"),
            this._setTooltipPosition(),
            Array.isArray(this.options.ticks) && this.options.ticks.length > 0 && (r || (this.options.max = Math.max.apply(Math, this.options.ticks)),
            a || (this.options.min = Math.min.apply(Math, this.options.ticks))),
            Array.isArray(this.options.value) ? (this.options.range = !0,
            this._state.value = this.options.value) : this.options.range ? this._state.value = [this.options.value, this.options.max] : this._state.value = this.options.value,
            this.trackLow = d || this.trackLow,
            this.trackSelection = u || this.trackSelection,
            this.trackHigh = m || this.trackHigh,
            "none" === this.options.selection ? (this._addClass(this.trackLow, "hide"),
            this._addClass(this.trackSelection, "hide"),
            this._addClass(this.trackHigh, "hide")) : ("after" === this.options.selection || "before" === this.options.selection) && (this._removeClass(this.trackLow, "hide"),
            this._removeClass(this.trackSelection, "hide"),
            this._removeClass(this.trackHigh, "hide")),
            this.handle1 = f || this.handle1,
            this.handle2 = p || this.handle2,
            !0 === g)
                for (this._removeClass(this.handle1, "round triangle"),
                this._removeClass(this.handle2, "round triangle hide"),
                l = 0; l < this.ticks.length; l++)
                    this._removeClass(this.ticks[l], "round triangle hide");
            if (-1 !== ["round", "triangle", "custom"].indexOf(this.options.handle))
                for (this._addClass(this.handle1, this.options.handle),
                this._addClass(this.handle2, this.options.handle),
                l = 0; l < this.ticks.length; l++)
                    this._addClass(this.ticks[l], this.options.handle);
            if (this._state.offset = this._offset(this.sliderElem),
            this._state.size = this.sliderElem[this.sizePos],
            this.setValue(this._state.value),
            this.handle1Keydown = this._keydown.bind(this, 0),
            this.handle1.addEventListener("keydown", this.handle1Keydown, !1),
            this.handle2Keydown = this._keydown.bind(this, 1),
            this.handle2.addEventListener("keydown", this.handle2Keydown, !1),
            this.mousedown = this._mousedown.bind(this),
            this.touchstart = this._touchstart.bind(this),
            this.touchmove = this._touchmove.bind(this),
            this.touchCapable) {
                var N = !1;
                try {
                    var j = Object.defineProperty({}, "passive", {
                        get: function() {
                            N = !0
                        }
                    });
                    window.addEventListener("test", null, j)
                } catch (e) {}
                var O = !!N && {
                    passive: !0
                };
                this.sliderElem.addEventListener("touchstart", this.touchstart, O),
                this.sliderElem.addEventListener("touchmove", this.touchmove, O)
            }
            if (this.sliderElem.addEventListener("mousedown", this.mousedown, !1),
            this.resize = this._resize.bind(this),
            window.addEventListener("resize", this.resize, !1),
            "hide" === this.options.tooltip)
                this._addClass(this.tooltip, "hide"),
                this._addClass(this.tooltip_min, "hide"),
                this._addClass(this.tooltip_max, "hide");
            else if ("always" === this.options.tooltip)
                this._showTooltip(),
                this._alwaysShowTooltip = !0;
            else {
                if (this.showTooltip = this._showTooltip.bind(this),
                this.hideTooltip = this._hideTooltip.bind(this),
                this.options.ticks_tooltip) {
                    var I = this._addTickListener()
                      , q = I.addMouseEnter(this, this.handle1)
                      , R = I.addMouseLeave(this, this.handle1);
                    this.handleCallbackMap.handle1 = {
                        mouseEnter: q,
                        mouseLeave: R
                    },
                    q = I.addMouseEnter(this, this.handle2),
                    R = I.addMouseLeave(this, this.handle2),
                    this.handleCallbackMap.handle2 = {
                        mouseEnter: q,
                        mouseLeave: R
                    }
                } else
                    this.sliderElem.addEventListener("mouseenter", this.showTooltip, !1),
                    this.sliderElem.addEventListener("mouseleave", this.hideTooltip, !1);
                this.handle1.addEventListener("focus", this.showTooltip, !1),
                this.handle1.addEventListener("blur", this.hideTooltip, !1),
                this.handle2.addEventListener("focus", this.showTooltip, !1),
                this.handle2.addEventListener("blur", this.hideTooltip, !1)
            }
            this.options.enabled ? this.enable() : this.disable()
        }
        var a = void 0
          , r = function(e) {
            return "Invalid input value '" + e + "' passed in"
        }
          , s = {
            linear: {
                toValue: function(e) {
                    var t = e / 100 * (this.options.max - this.options.min)
                      , c = !0;
                    if (this.options.ticks_positions.length > 0) {
                        for (var n, i, a, r = 0, s = 1; s < this.options.ticks_positions.length; s++)
                            if (e <= this.options.ticks_positions[s]) {
                                n = this.options.ticks[s - 1],
                                a = this.options.ticks_positions[s - 1],
                                i = this.options.ticks[s],
                                r = this.options.ticks_positions[s];
                                break
                            }
                        t = n + (e - a) / (r - a) * (i - n),
                        c = !1
                    }
                    var l = (c ? this.options.min : 0) + Math.round(t / this.options.step) * this.options.step;
                    return l < this.options.min ? this.options.min : l > this.options.max ? this.options.max : l
                },
                toPercentage: function(e) {
                    if (this.options.max === this.options.min)
                        return 0;
                    if (this.options.ticks_positions.length > 0) {
                        for (var t, c, n, i = 0, a = 0; a < this.options.ticks.length; a++)
                            if (e <= this.options.ticks[a]) {
                                t = a > 0 ? this.options.ticks[a - 1] : 0,
                                n = a > 0 ? this.options.ticks_positions[a - 1] : 0,
                                c = this.options.ticks[a],
                                i = this.options.ticks_positions[a];
                                break
                            }
                        if (a > 0)
                            return n + (e - t) / (c - t) * (i - n)
                    }
                    return 100 * (e - this.options.min) / (this.options.max - this.options.min)
                }
            },
            logarithmic: {
                toValue: function(e) {
                    var t = 1 - this.options.min
                      , c = Math.log(this.options.min + t)
                      , n = Math.log(this.options.max + t)
                      , i = Math.exp(c + (n - c) * e / 100) - t;
                    return Math.round(i) === n ? n : (i = this.options.min + Math.round((i - this.options.min) / this.options.step) * this.options.step) < this.options.min ? this.options.min : i > this.options.max ? this.options.max : i
                },
                toPercentage: function(e) {
                    if (this.options.max === this.options.min)
                        return 0;
                    var t = 1 - this.options.min
                      , c = Math.log(this.options.max + t)
                      , n = Math.log(this.options.min + t);
                    return 100 * (Math.log(e + t) - n) / (c - n)
                }
            }
        };
        (t = function(e, t) {
            return i.call(this, e, t),
            this
        }
        ).prototype = {
            _init: function() {},
            constructor: t,
            defaultOptions: {
                id: "",
                min: 0,
                max: 10,
                step: 1,
                precision: 0,
                orientation: "horizontal",
                value: 5,
                range: !1,
                selection: "before",
                tooltip: "show",
                tooltip_split: !1,
                handle: "round",
                reversed: !1,
                rtl: "auto",
                enabled: !0,
                formatter: function(e) {
                    return Array.isArray(e) ? e[0] + " : " + e[1] : e
                },
                natural_arrow_keys: !1,
                ticks: [],
                ticks_positions: [],
                ticks_labels: [],
                ticks_snap_bounds: 0,
                ticks_tooltip: !1,
                scale: "linear",
                focus: !1,
                tooltip_position: null,
                labelledby: null,
                rangeHighlights: []
            },
            getElement: function() {
                return this.sliderElem
            },
            getValue: function() {
                return this.options.range ? this._state.value : this._state.value[0]
            },
            setValue: function(e, t, c) {
                e || (e = 0);
                var n = this.getValue();
                this._state.value = this._validateInputValue(e);
                var i = this._applyPrecision.bind(this);
                this.options.range ? (this._state.value[0] = i(this._state.value[0]),
                this._state.value[1] = i(this._state.value[1]),
                this._state.value[0] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[0])),
                this._state.value[1] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[1]))) : (this._state.value = i(this._state.value),
                this._state.value = [Math.max(this.options.min, Math.min(this.options.max, this._state.value))],
                this._addClass(this.handle2, "hide"),
                "after" === this.options.selection ? this._state.value[1] = this.options.max : this._state.value[1] = this.options.min),
                this.options.max > this.options.min ? this._state.percentage = [this._toPercentage(this._state.value[0]), this._toPercentage(this._state.value[1]), 100 * this.options.step / (this.options.max - this.options.min)] : this._state.percentage = [0, 0, 100],
                this._layout();
                var a = this.options.range ? this._state.value : this._state.value[0];
                this._setDataVal(a),
                !0 === t && this._trigger("slide", a);
                return (Array.isArray(a) ? n[0] !== a[0] || n[1] !== a[1] : n !== a) && !0 === c && this._trigger("change", {
                    oldValue: n,
                    newValue: a
                }),
                this
            },
            destroy: function() {
                this._removeSliderEventHandlers(),
                this.sliderElem.parentNode.removeChild(this.sliderElem),
                this.element.style.display = "",
                this._cleanUpEventCallbacksMap(),
                this.element.removeAttribute("data"),
                e && (this._unbindJQueryEventHandlers(),
                a === c && this.$element.removeData(a),
                this.$element.removeData(n))
            },
            disable: function() {
                return this._state.enabled = !1,
                this.handle1.removeAttribute("tabindex"),
                this.handle2.removeAttribute("tabindex"),
                this._addClass(this.sliderElem, "slider-disabled"),
                this._trigger("slideDisabled"),
                this
            },
            enable: function() {
                return this._state.enabled = !0,
                this.handle1.setAttribute("tabindex", 0),
                this.handle2.setAttribute("tabindex", 0),
                this._removeClass(this.sliderElem, "slider-disabled"),
                this._trigger("slideEnabled"),
                this
            },
            toggle: function() {
                return this._state.enabled ? this.disable() : this.enable(),
                this
            },
            isEnabled: function() {
                return this._state.enabled
            },
            on: function(e, t) {
                return this._bindNonQueryEventHandler(e, t),
                this
            },
            off: function(t, c) {
                e ? (this.$element.off(t, c),
                this.$sliderElem.off(t, c)) : this._unbindNonQueryEventHandler(t, c)
            },
            getAttribute: function(e) {
                return e ? this.options[e] : this.options
            },
            setAttribute: function(e, t) {
                return this.options[e] = t,
                this
            },
            refresh: function() {
                return this._removeSliderEventHandlers(),
                i.call(this, this.element, this.options),
                e && (a === c ? (e.data(this.element, c, this),
                e.data(this.element, n, this)) : e.data(this.element, n, this)),
                this
            },
            relayout: function() {
                return this._resize(),
                this
            },
            _removeSliderEventHandlers: function() {
                if (this.handle1.removeEventListener("keydown", this.handle1Keydown, !1),
                this.handle2.removeEventListener("keydown", this.handle2Keydown, !1),
                this.options.ticks_tooltip) {
                    for (var e = this.ticksContainer.getElementsByClassName("slider-tick"), t = 0; t < e.length; t++)
                        e[t].removeEventListener("mouseenter", this.ticksCallbackMap[t].mouseEnter, !1),
                        e[t].removeEventListener("mouseleave", this.ticksCallbackMap[t].mouseLeave, !1);
                    this.handleCallbackMap.handle1 && this.handleCallbackMap.handle2 && (this.handle1.removeEventListener("mouseenter", this.handleCallbackMap.handle1.mouseEnter, !1),
                    this.handle2.removeEventListener("mouseenter", this.handleCallbackMap.handle2.mouseEnter, !1),
                    this.handle1.removeEventListener("mouseleave", this.handleCallbackMap.handle1.mouseLeave, !1),
                    this.handle2.removeEventListener("mouseleave", this.handleCallbackMap.handle2.mouseLeave, !1))
                }
                this.handleCallbackMap = null,
                this.ticksCallbackMap = null,
                this.showTooltip && (this.handle1.removeEventListener("focus", this.showTooltip, !1),
                this.handle2.removeEventListener("focus", this.showTooltip, !1)),
                this.hideTooltip && (this.handle1.removeEventListener("blur", this.hideTooltip, !1),
                this.handle2.removeEventListener("blur", this.hideTooltip, !1)),
                this.showTooltip && this.sliderElem.removeEventListener("mouseenter", this.showTooltip, !1),
                this.hideTooltip && this.sliderElem.removeEventListener("mouseleave", this.hideTooltip, !1),
                this.sliderElem.removeEventListener("touchstart", this.touchstart, !1),
                this.sliderElem.removeEventListener("touchmove", this.touchmove, !1),
                this.sliderElem.removeEventListener("mousedown", this.mousedown, !1),
                window.removeEventListener("resize", this.resize, !1)
            },
            _bindNonQueryEventHandler: function(e, t) {
                void 0 === this.eventToCallbackMap[e] && (this.eventToCallbackMap[e] = []),
                this.eventToCallbackMap[e].push(t)
            },
            _unbindNonQueryEventHandler: function(e, t) {
                var c = this.eventToCallbackMap[e];
                if (void 0 !== c)
                    for (var n = 0; n < c.length; n++)
                        if (c[n] === t) {
                            c.splice(n, 1);
                            break
                        }
            },
            _cleanUpEventCallbacksMap: function() {
                for (var e = Object.keys(this.eventToCallbackMap), t = 0; t < e.length; t++) {
                    var c = e[t];
                    delete this.eventToCallbackMap[c]
                }
            },
            _showTooltip: function() {
                !1 === this.options.tooltip_split ? (this._addClass(this.tooltip, "in"),
                this.tooltip_min.style.display = "none",
                this.tooltip_max.style.display = "none") : (this._addClass(this.tooltip_min, "in"),
                this._addClass(this.tooltip_max, "in"),
                this.tooltip.style.display = "none"),
                this._state.over = !0
            },
            _hideTooltip: function() {
                !1 === this._state.inDrag && !0 !== this._alwaysShowTooltip && (this._removeClass(this.tooltip, "in"),
                this._removeClass(this.tooltip_min, "in"),
                this._removeClass(this.tooltip_max, "in")),
                this._state.over = !1
            },
            _setToolTipOnMouseOver: function(e) {
                function t(e, t) {
                    return t ? [100 - e.percentage[0], c.options.range ? 100 - e.percentage[1] : e.percentage[1]] : [e.percentage[0], e.percentage[1]]
                }
                var c = this
                  , n = this.options.formatter(e ? e.value[0] : this._state.value[0])
                  , i = t(e || this._state, this.options.reversed);
                this._setText(this.tooltipInner, n),
                this.tooltip.style[this.stylePos] = i[0] + "%"
            },
            _copyState: function() {
                return {
                    value: [this._state.value[0], this._state.value[1]],
                    enabled: this._state.enabled,
                    offset: this._state.offset,
                    size: this._state.size,
                    percentage: [this._state.percentage[0], this._state.percentage[1], this._state.percentage[2]],
                    inDrag: this._state.inDrag,
                    over: this._state.over,
                    dragged: this._state.dragged,
                    keyCtrl: this._state.keyCtrl
                }
            },
            _addTickListener: function() {
                return {
                    addMouseEnter: function(e, t, c) {
                        var n = function() {
                            var n = e._copyState()
                              , i = t === e.handle1 ? n.value[0] : n.value[1]
                              , a = void 0;
                            void 0 !== c ? (i = e.options.ticks[c],
                            a = e.options.ticks_positions.length > 0 && e.options.ticks_positions[c] || e._toPercentage(e.options.ticks[c])) : a = e._toPercentage(i),
                            n.value[0] = i,
                            n.percentage[0] = a,
                            e._setToolTipOnMouseOver(n),
                            e._showTooltip()
                        };
                        return t.addEventListener("mouseenter", n, !1),
                        n
                    },
                    addMouseLeave: function(e, t) {
                        var c = function() {
                            e._hideTooltip()
                        };
                        return t.addEventListener("mouseleave", c, !1),
                        c
                    }
                }
            },
            _layout: function() {
                var e, t, c;
                if (e = this.options.reversed ? [100 - this._state.percentage[0], this.options.range ? 100 - this._state.percentage[1] : this._state.percentage[1]] : [this._state.percentage[0], this._state.percentage[1]],
                this.handle1.style[this.stylePos] = e[0] + "%",
                this.handle1.setAttribute("aria-valuenow", this._state.value[0]),
                t = this.options.formatter(this._state.value[0]),
                isNaN(t) ? this.handle1.setAttribute("aria-valuetext", t) : this.handle1.removeAttribute("aria-valuetext"),
                this.handle2.style[this.stylePos] = e[1] + "%",
                this.handle2.setAttribute("aria-valuenow", this._state.value[1]),
                t = this.options.formatter(this._state.value[1]),
                isNaN(t) ? this.handle2.setAttribute("aria-valuetext", t) : this.handle2.removeAttribute("aria-valuetext"),
                this.rangeHighlightElements.length > 0 && Array.isArray(this.options.rangeHighlights) && this.options.rangeHighlights.length > 0)
                    for (var n = 0; n < this.options.rangeHighlights.length; n++) {
                        var i = this._toPercentage(this.options.rangeHighlights[n].start)
                          , a = this._toPercentage(this.options.rangeHighlights[n].end);
                        if (this.options.reversed) {
                            var r = 100 - a;
                            a = 100 - i,
                            i = r
                        }
                        var s = this._createHighlightRange(i, a);
                        s ? "vertical" === this.options.orientation ? (this.rangeHighlightElements[n].style.top = s.start + "%",
                        this.rangeHighlightElements[n].style.height = s.size + "%") : (this.options.rtl ? this.rangeHighlightElements[n].style.right = s.start + "%" : this.rangeHighlightElements[n].style.left = s.start + "%",
                        this.rangeHighlightElements[n].style.width = s.size + "%") : this.rangeHighlightElements[n].style.display = "none"
                    }
                if (Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
                    var l, o = "vertical" === this.options.orientation ? "height" : "width";
                    l = "vertical" === this.options.orientation ? "marginTop" : this.options.rtl ? "marginRight" : "marginLeft";
                    var h = this._state.size / (this.options.ticks.length - 1);
                    if (this.tickLabelContainer) {
                        var v = 0;
                        if (0 === this.options.ticks_positions.length)
                            "vertical" !== this.options.orientation && (this.tickLabelContainer.style[l] = -h / 2 + "px"),
                            v = this.tickLabelContainer.offsetHeight;
                        else
                            for (u = 0; u < this.tickLabelContainer.childNodes.length; u++)
                                this.tickLabelContainer.childNodes[u].offsetHeight > v && (v = this.tickLabelContainer.childNodes[u].offsetHeight);
                        "horizontal" === this.options.orientation && (this.sliderElem.style.marginBottom = v + "px")
                    }
                    for (var u = 0; u < this.options.ticks.length; u++) {
                        var d = this.options.ticks_positions[u] || this._toPercentage(this.options.ticks[u]);
                        this.options.reversed && (d = 100 - d),
                        this.ticks[u].style[this.stylePos] = d + "%",
                        this._removeClass(this.ticks[u], "in-selection"),
                        this.options.range ? d >= e[0] && d <= e[1] && this._addClass(this.ticks[u], "in-selection") : "after" === this.options.selection && d >= e[0] ? this._addClass(this.ticks[u], "in-selection") : "before" === this.options.selection && d <= e[0] && this._addClass(this.ticks[u], "in-selection"),
                        this.tickLabels[u] && (this.tickLabels[u].style[o] = h + "px",
                        "vertical" !== this.options.orientation && void 0 !== this.options.ticks_positions[u] ? (this.tickLabels[u].style.position = "absolute",
                        this.tickLabels[u].style[this.stylePos] = d + "%",
                        this.tickLabels[u].style[l] = -h / 2 + "px") : "vertical" === this.options.orientation && (this.options.rtl ? this.tickLabels[u].style.marginRight = this.sliderElem.offsetWidth + "px" : this.tickLabels[u].style.marginLeft = this.sliderElem.offsetWidth + "px",
                        this.tickLabelContainer.style[l] = this.sliderElem.offsetWidth / 2 * -1 + "px"),
                        this._removeClass(this.tickLabels[u], "label-in-selection label-is-selection"),
                        this.options.range ? d >= e[0] && d <= e[1] && (this._addClass(this.tickLabels[u], "label-in-selection"),
                        (d === e[0] || e[1]) && this._addClass(this.tickLabels[u], "label-is-selection")) : ("after" === this.options.selection && d >= e[0] ? this._addClass(this.tickLabels[u], "label-in-selection") : "before" === this.options.selection && d <= e[0] && this._addClass(this.tickLabels[u], "label-in-selection"),
                        d === e[0] && this._addClass(this.tickLabels[u], "label-is-selection")))
                    }
                }
                if (this.options.range) {
                    c = this.options.formatter(this._state.value),
                    this._setText(this.tooltipInner, c),
                    this.tooltip.style[this.stylePos] = (e[1] + e[0]) / 2 + "%";
                    var m = this.options.formatter(this._state.value[0]);
                    this._setText(this.tooltipInner_min, m);
                    var f = this.options.formatter(this._state.value[1]);
                    this._setText(this.tooltipInner_max, f),
                    this.tooltip_min.style[this.stylePos] = e[0] + "%",
                    this.tooltip_max.style[this.stylePos] = e[1] + "%"
                } else
                    c = this.options.formatter(this._state.value[0]),
                    this._setText(this.tooltipInner, c),
                    this.tooltip.style[this.stylePos] = e[0] + "%";
                if ("vertical" === this.options.orientation)
                    this.trackLow.style.top = "0",
                    this.trackLow.style.height = Math.min(e[0], e[1]) + "%",
                    this.trackSelection.style.top = Math.min(e[0], e[1]) + "%",
                    this.trackSelection.style.height = Math.abs(e[0] - e[1]) + "%",
                    this.trackHigh.style.bottom = "0",
                    this.trackHigh.style.height = 100 - Math.min(e[0], e[1]) - Math.abs(e[0] - e[1]) + "%";
                else {
                    "right" === this.stylePos ? this.trackLow.style.right = "0" : this.trackLow.style.left = "0",
                    this.trackLow.style.width = Math.min(e[0], e[1]) + "%",
                    "right" === this.stylePos ? this.trackSelection.style.right = Math.min(e[0], e[1]) + "%" : this.trackSelection.style.left = Math.min(e[0], e[1]) + "%",
                    this.trackSelection.style.width = Math.abs(e[0] - e[1]) + "%",
                    "right" === this.stylePos ? this.trackHigh.style.left = "0" : this.trackHigh.style.right = "0",
                    this.trackHigh.style.width = 100 - Math.min(e[0], e[1]) - Math.abs(e[0] - e[1]) + "%";
                    var p = this.tooltip_min.getBoundingClientRect()
                      , z = this.tooltip_max.getBoundingClientRect();
                    "bottom" === this.options.tooltip_position ? p.right > z.left ? (this._removeClass(this.tooltip_max, "bottom"),
                    this._addClass(this.tooltip_max, "top"),
                    this.tooltip_max.style.top = "",
                    this.tooltip_max.style.bottom = "22px") : (this._removeClass(this.tooltip_max, "top"),
                    this._addClass(this.tooltip_max, "bottom"),
                    this.tooltip_max.style.top = this.tooltip_min.style.top,
                    this.tooltip_max.style.bottom = "") : p.right > z.left ? (this._removeClass(this.tooltip_max, "top"),
                    this._addClass(this.tooltip_max, "bottom"),
                    this.tooltip_max.style.top = "18px") : (this._removeClass(this.tooltip_max, "bottom"),
                    this._addClass(this.tooltip_max, "top"),
                    this.tooltip_max.style.top = this.tooltip_min.style.top)
                }
            },
            _createHighlightRange: function(e, t) {
                return this._isHighlightRange(e, t) ? e > t ? {
                    start: t,
                    size: e - t
                } : {
                    start: e,
                    size: t - e
                } : null
            },
            _isHighlightRange: function(e, t) {
                return e >= 0 && 100 >= e && t >= 0 && 100 >= t
            },
            _resize: function(e) {
                this._state.offset = this._offset(this.sliderElem),
                this._state.size = this.sliderElem[this.sizePos],
                this._layout()
            },
            _removeProperty: function(e, t) {
                e.style.removeProperty ? e.style.removeProperty(t) : e.style.removeAttribute(t)
            },
            _mousedown: function(e) {
                if (!this._state.enabled)
                    return !1;
                e.preventDefault && e.preventDefault(),
                this._state.offset = this._offset(this.sliderElem),
                this._state.size = this.sliderElem[this.sizePos];
                var t = this._getPercentage(e);
                if (this.options.range) {
                    var c = Math.abs(this._state.percentage[0] - t)
                      , n = Math.abs(this._state.percentage[1] - t);
                    this._state.dragged = n > c ? 0 : 1,
                    this._adjustPercentageForRangeSliders(t)
                } else
                    this._state.dragged = 0;
                this._state.percentage[this._state.dragged] = t,
                this.touchCapable && (document.removeEventListener("touchmove", this.mousemove, !1),
                document.removeEventListener("touchend", this.mouseup, !1)),
                this.mousemove && document.removeEventListener("mousemove", this.mousemove, !1),
                this.mouseup && document.removeEventListener("mouseup", this.mouseup, !1),
                this.mousemove = this._mousemove.bind(this),
                this.mouseup = this._mouseup.bind(this),
                this.touchCapable && (document.addEventListener("touchmove", this.mousemove, !1),
                document.addEventListener("touchend", this.mouseup, !1)),
                document.addEventListener("mousemove", this.mousemove, !1),
                document.addEventListener("mouseup", this.mouseup, !1),
                this._state.inDrag = !0;
                var i = this._calculateValue();
                return this._trigger("slideStart", i),
                this.setValue(i, !1, !0),
                e.returnValue = !1,
                this.options.focus && this._triggerFocusOnHandle(this._state.dragged),
                !0
            },
            _touchstart: function(e) {
                if (void 0 !== e.changedTouches) {
                    var t = e.changedTouches[0];
                    this.touchX = t.pageX,
                    this.touchY = t.pageY
                } else
                    this._mousedown(e)
            },
            _triggerFocusOnHandle: function(e) {
                0 === e && this.handle1.focus(),
                1 === e && this.handle2.focus()
            },
            _keydown: function(e, t) {
                if (!this._state.enabled)
                    return !1;
                var c;
                switch (t.keyCode) {
                case 37:
                case 40:
                    c = -1;
                    break;
                case 39:
                case 38:
                    c = 1
                }
                if (c) {
                    if (this.options.natural_arrow_keys) {
                        var n = "vertical" === this.options.orientation && !this.options.reversed
                          , i = "horizontal" === this.options.orientation && this.options.reversed;
                        (n || i) && (c = -c)
                    }
                    var a = this._state.value[e] + c * this.options.step
                      , r = this._toPercentage(a);
                    if (this._state.keyCtrl = e,
                    this.options.range) {
                        this._adjustPercentageForRangeSliders(r);
                        var s = this._state.keyCtrl ? this._state.value[0] : a
                          , l = this._state.keyCtrl ? a : this._state.value[1];
                        a = [Math.max(this.options.min, Math.min(this.options.max, s)), Math.max(this.options.min, Math.min(this.options.max, l))]
                    } else
                        a = Math.max(this.options.min, Math.min(this.options.max, a));
                    return this._trigger("slideStart", a),
                    this.setValue(a, !0, !0),
                    this._trigger("slideStop", a),
                    this._pauseEvent(t),
                    delete this._state.keyCtrl,
                    !1
                }
            },
            _pauseEvent: function(e) {
                e.stopPropagation && e.stopPropagation(),
                e.preventDefault && e.preventDefault(),
                e.cancelBubble = !0,
                e.returnValue = !1
            },
            _mousemove: function(e) {
                if (!this._state.enabled)
                    return !1;
                var t = this._getPercentage(e);
                this._adjustPercentageForRangeSliders(t),
                this._state.percentage[this._state.dragged] = t;
                var c = this._calculateValue(!0);
                return this.setValue(c, !0, !0),
                !1
            },
            _touchmove: function(e) {
                if (void 0 !== e.changedTouches) {
                    var t = e.changedTouches[0]
                      , c = t.pageX - this.touchX
                      , n = t.pageY - this.touchY;
                    this._state.inDrag || ("vertical" === this.options.orientation && 5 >= c && c >= -5 && (n >= 15 || -15 >= n) ? this._mousedown(e) : 5 >= n && n >= -5 && (c >= 15 || -15 >= c) && this._mousedown(e))
                }
            },
            _adjustPercentageForRangeSliders: function(e) {
                if (this.options.range) {
                    var t = this._getNumDigitsAfterDecimalPlace(e);
                    t = t ? t - 1 : 0;
                    var c = this._applyToFixedAndParseFloat(e, t);
                    0 === this._state.dragged && this._applyToFixedAndParseFloat(this._state.percentage[1], t) < c ? (this._state.percentage[0] = this._state.percentage[1],
                    this._state.dragged = 1) : 1 === this._state.dragged && this._applyToFixedAndParseFloat(this._state.percentage[0], t) > c ? (this._state.percentage[1] = this._state.percentage[0],
                    this._state.dragged = 0) : 0 === this._state.keyCtrl && this._toPercentage(this._state.value[1]) < e ? (this._state.percentage[0] = this._state.percentage[1],
                    this._state.keyCtrl = 1,
                    this.handle2.focus()) : 1 === this._state.keyCtrl && this._toPercentage(this._state.value[0]) > e && (this._state.percentage[1] = this._state.percentage[0],
                    this._state.keyCtrl = 0,
                    this.handle1.focus())
                }
            },
            _mouseup: function(e) {
                if (!this._state.enabled)
                    return !1;
                var t = this._getPercentage(e);
                this._adjustPercentageForRangeSliders(t),
                this._state.percentage[this._state.dragged] = t,
                this.touchCapable && (document.removeEventListener("touchmove", this.mousemove, !1),
                document.removeEventListener("touchend", this.mouseup, !1)),
                document.removeEventListener("mousemove", this.mousemove, !1),
                document.removeEventListener("mouseup", this.mouseup, !1),
                this._state.inDrag = !1,
                !1 === this._state.over && this._hideTooltip();
                var c = this._calculateValue(!0);
                return this._layout(),
                this._setDataVal(c),
                this._trigger("slideStop", c),
                this._state.dragged = null,
                !1
            },
            _calculateValue: function(e) {
                var t;
                return this.options.range ? (t = [this.options.min, this.options.max],
                0 !== this._state.percentage[0] && (t[0] = this._toValue(this._state.percentage[0]),
                t[0] = this._applyPrecision(t[0])),
                100 !== this._state.percentage[1] && (t[1] = this._toValue(this._state.percentage[1]),
                t[1] = this._applyPrecision(t[1])),
                e && (t[0] = this._snapToClosestTick(t[0]),
                t[1] = this._snapToClosestTick(t[1]))) : (t = this._toValue(this._state.percentage[0]),
                t = this._applyPrecision(t),
                e && (t = this._snapToClosestTick(t))),
                t
            },
            _snapToClosestTick: function(e) {
                for (var t = [e, 1 / 0], c = 0; c < this.options.ticks.length; c++) {
                    var n = Math.abs(this.options.ticks[c] - e);
                    n <= t[1] && (t = [this.options.ticks[c], n])
                }
                return t[1] <= this.options.ticks_snap_bounds ? t[0] : e
            },
            _applyPrecision: function(e) {
                var t = this.options.precision || this._getNumDigitsAfterDecimalPlace(this.options.step);
                return this._applyToFixedAndParseFloat(e, t)
            },
            _getNumDigitsAfterDecimalPlace: function(e) {
                var t = ("" + e).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
                return t ? Math.max(0, (t[1] ? t[1].length : 0) - (t[2] ? +t[2] : 0)) : 0
            },
            _applyToFixedAndParseFloat: function(e, t) {
                var c = e.toFixed(t);
                return parseFloat(c)
            },
            _getPercentage: function(e) {
                !this.touchCapable || "touchstart" !== e.type && "touchmove" !== e.type || (e = e.touches[0]);
                var t = e[this.mousePos] - this._state.offset[this.stylePos];
                "right" === this.stylePos && (t = -t);
                var c = t / this._state.size * 100;
                return c = Math.round(c / this._state.percentage[2]) * this._state.percentage[2],
                this.options.reversed && (c = 100 - c),
                Math.max(0, Math.min(100, c))
            },
            _validateInputValue: function(e) {
                if (isNaN(+e)) {
                    if (Array.isArray(e))
                        return this._validateArray(e),
                        e;
                    throw new Error(r(e))
                }
                return +e
            },
            _validateArray: function(e) {
                for (var t = 0; t < e.length; t++) {
                    var c = e[t];
                    if ("number" != typeof c)
                        throw new Error(r(c))
                }
            },
            _setDataVal: function(e) {
                this.element.setAttribute("data-value", e),
                this.element.setAttribute("value", e),
                this.element.value = e
            },
            _trigger: function(t, c) {
                c = c || 0 === c ? c : void 0;
                var n = this.eventToCallbackMap[t];
                if (n && n.length)
                    for (var i = 0; i < n.length; i++) {
                        (0,
                        n[i])(c)
                    }
                e && this._triggerJQueryEvent(t, c)
            },
            _triggerJQueryEvent: function(e, t) {
                var c = {
                    type: e,
                    value: t
                };
                this.$element.trigger(c),
                this.$sliderElem.trigger(c)
            },
            _unbindJQueryEventHandlers: function() {
                this.$element.off(),
                this.$sliderElem.off()
            },
            _setText: function(e, t) {
                void 0 !== e.textContent ? e.textContent = t : void 0 !== e.innerText && (e.innerText = t)
            },
            _removeClass: function(e, t) {
                for (var c = t.split(" "), n = e.className, i = 0; i < c.length; i++) {
                    var a = c[i]
                      , r = new RegExp("(?:\\s|^)" + a + "(?:\\s|$)");
                    n = n.replace(r, " ")
                }
                e.className = n.trim()
            },
            _addClass: function(e, t) {
                for (var c = t.split(" "), n = e.className, i = 0; i < c.length; i++) {
                    var a = c[i];
                    new RegExp("(?:\\s|^)" + a + "(?:\\s|$)").test(n) || (n += " " + a)
                }
                e.className = n.trim()
            },
            _offsetLeft: function(e) {
                return e.getBoundingClientRect().left
            },
            _offsetRight: function(e) {
                return e.getBoundingClientRect().right
            },
            _offsetTop: function(e) {
                for (var t = e.offsetTop; (e = e.offsetParent) && !isNaN(e.offsetTop); )
                    t += e.offsetTop,
                    "BODY" !== e.tagName && (t -= e.scrollTop);
                return t
            },
            _offset: function(e) {
                return {
                    left: this._offsetLeft(e),
                    right: this._offsetRight(e),
                    top: this._offsetTop(e)
                }
            },
            _css: function(t, c, n) {
                if (e)
                    e.style(t, c, n);
                else {
                    var i = c.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(e, t) {
                        return t.toUpperCase()
                    });
                    t.style[i] = n
                }
            },
            _toValue: function(e) {
                return this.options.scale.toValue.apply(this, [e])
            },
            _toPercentage: function(e) {
                return this.options.scale.toPercentage.apply(this, [e])
            },
            _setTooltipPosition: function() {
                var e = [this.tooltip, this.tooltip_min, this.tooltip_max];
                if ("vertical" === this.options.orientation) {
                    var t, c = "left" === (t = this.options.tooltip_position ? this.options.tooltip_position : this.options.rtl ? "left" : "right") ? "right" : "left";
                    e.forEach(function(e) {
                        this._addClass(e, t),
                        e.style[c] = "100%"
                    }
                    .bind(this))
                } else
                    "bottom" === this.options.tooltip_position ? e.forEach(function(e) {
                        this._addClass(e, "bottom"),
                        e.style.top = "22px"
                    }
                    .bind(this)) : e.forEach(function(e) {
                        this._addClass(e, "top"),
                        e.style.top = -this.tooltip.outerHeight - 14 + "px"
                    }
                    .bind(this))
            }
        },
        e && e.fn && (e.fn.slider ? (windowIsDefined && window.console.warn("bootstrap-slider.js - WARNING: $.fn.slider namespace is already bound. Use the $.fn.bootstrapSlider namespace instead."),
        a = n) : (e.bridget(c, t),
        a = c),
        e.bridget(n, t),
        e(function() {
            e("input[data-provide=slider]")[a]()
        }))
    }(e),
    t
}),
function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.Cleave = t() : e.Cleave = t()
}(this, function() {
    return function(e) {
        function t(n) {
            if (c[n])
                return c[n].exports;
            var i = c[n] = {
                exports: {},
                id: n,
                loaded: !1
            };
            return e[n].call(i.exports, i, i.exports, t),
            i.loaded = !0,
            i.exports
        }
        var c = {};
        return t.m = e,
        t.c = c,
        t.p = "",
        t(0)
    }([function(e, t, c) {
        (function(t) {
            "use strict";
            var n = function(e, t) {
                var c = this;
                if (c.element = "string" == typeof e ? document.querySelector(e) : void 0 !== e.length && e.length > 0 ? e[0] : e,
                !c.element)
                    throw new Error("[cleave.js] Please check the element");
                t.initValue = c.element.value,
                c.properties = n.DefaultProperties.assign({}, t),
                c.init()
            };
            n.prototype = {
                init: function() {
                    var e = this
                      , t = e.properties;
                    return t.numeral || t.phone || t.creditCard || t.date || 0 !== t.blocksLength || t.prefix ? (t.maxLength = n.Util.getMaxLength(t.blocks),
                    e.isAndroid = n.Util.isAndroid(),
                    e.lastInputValue = "",
                    e.onChangeListener = e.onChange.bind(e),
                    e.onKeyDownListener = e.onKeyDown.bind(e),
                    e.onCutListener = e.onCut.bind(e),
                    e.onCopyListener = e.onCopy.bind(e),
                    e.element.addEventListener("input", e.onChangeListener),
                    e.element.addEventListener("keydown", e.onKeyDownListener),
                    e.element.addEventListener("cut", e.onCutListener),
                    e.element.addEventListener("copy", e.onCopyListener),
                    e.initPhoneFormatter(),
                    e.initDateFormatter(),
                    e.initNumeralFormatter(),
                    void ((t.initValue || t.prefix && !t.noImmediatePrefix) && e.onInput(t.initValue))) : void e.onInput(t.initValue)
                },
                initNumeralFormatter: function() {
                    var e = this.properties;
                    e.numeral && (e.numeralFormatter = new n.NumeralFormatter(e.numeralDecimalMark,e.numeralIntegerScale,e.numeralDecimalScale,e.numeralThousandsGroupStyle,e.numeralPositiveOnly,e.stripLeadingZeroes,e.delimiter))
                },
                initDateFormatter: function() {
                    var e = this.properties;
                    e.date && (e.dateFormatter = new n.DateFormatter(e.datePattern),
                    e.blocks = e.dateFormatter.getBlocks(),
                    e.blocksLength = e.blocks.length,
                    e.maxLength = n.Util.getMaxLength(e.blocks))
                },
                initPhoneFormatter: function() {
                    var e = this.properties;
                    if (e.phone)
                        try {
                            e.phoneFormatter = new n.PhoneFormatter(new e.root.Cleave.AsYouTypeFormatter(e.phoneRegionCode),e.delimiter)
                        } catch (e) {
                            throw new Error("[cleave.js] Please include phone-type-formatter.{country}.js lib")
                        }
                },
                onKeyDown: function(e) {
                    var t = this
                      , c = t.properties
                      , i = e.which || e.keyCode
                      , a = n.Util
                      , r = t.element.value;
                    return a.isAndroidBackspaceKeydown(t.lastInputValue, r) && (i = 8),
                    t.lastInputValue = r,
                    8 === i && a.isDelimiter(r.slice(-c.delimiterLength), c.delimiter, c.delimiters) ? void (c.backspace = !0) : void (c.backspace = !1)
                },
                onChange: function() {
                    this.onInput(this.element.value)
                },
                onCut: function(e) {
                    this.copyClipboardData(e),
                    this.onInput("")
                },
                onCopy: function(e) {
                    this.copyClipboardData(e)
                },
                copyClipboardData: function(e) {
                    var t, c = this.properties, i = n.Util, a = this.element.value;
                    t = c.copyDelimiter ? a : i.stripDelimiters(a, c.delimiter, c.delimiters);
                    try {
                        e.clipboardData ? e.clipboardData.setData("Text", t) : window.clipboardData.setData("Text", t),
                        e.preventDefault()
                    } catch (e) {}
                },
                onInput: function(e) {
                    var t = this
                      , c = t.properties
                      , i = n.Util;
                    return c.numeral || !c.backspace || i.isDelimiter(e.slice(-c.delimiterLength), c.delimiter, c.delimiters) || (e = i.headStr(e, e.length - c.delimiterLength)),
                    c.phone ? (!c.prefix || c.noImmediatePrefix && !e.length ? c.result = c.phoneFormatter.format(e) : c.result = c.prefix + c.phoneFormatter.format(e).slice(c.prefix.length),
                    void t.updateValueState()) : c.numeral ? (!c.prefix || c.noImmediatePrefix && !e.length ? c.result = c.numeralFormatter.format(e) : c.result = c.prefix + c.numeralFormatter.format(e),
                    void t.updateValueState()) : (c.date && (e = c.dateFormatter.getValidatedDate(e)),
                    e = i.stripDelimiters(e, c.delimiter, c.delimiters),
                    e = i.getPrefixStrippedValue(e, c.prefix, c.prefixLength),
                    e = c.numericOnly ? i.strip(e, /[^\d]/g) : e,
                    e = c.uppercase ? e.toUpperCase() : e,
                    e = c.lowercase ? e.toLowerCase() : e,
                    !c.prefix || c.noImmediatePrefix && !e.length || (e = c.prefix + e,
                    0 !== c.blocksLength) ? (c.creditCard && t.updateCreditCardPropsByValue(e),
                    e = i.headStr(e, c.maxLength),
                    c.result = i.getFormattedValue(e, c.blocks, c.blocksLength, c.delimiter, c.delimiters, c.delimiterLazyShow),
                    void t.updateValueState()) : (c.result = e,
                    void t.updateValueState()))
                },
                updateCreditCardPropsByValue: function(e) {
                    var t, c = this.properties, i = n.Util;
                    i.headStr(c.result, 4) !== i.headStr(e, 4) && (t = n.CreditCardDetector.getInfo(e, c.creditCardStrictMode),
                    c.blocks = t.blocks,
                    c.blocksLength = c.blocks.length,
                    c.maxLength = i.getMaxLength(c.blocks),
                    c.creditCardType !== t.type && (c.creditCardType = t.type,
                    c.onCreditCardTypeChanged.call(this, c.creditCardType)))
                },
                setCurrentSelection: function(e, t) {
                    var c = this.element;
                    if (t.length !== e && c === document.activeElement)
                        if (c.createTextRange) {
                            var n = c.createTextRange();
                            n.move("character", e),
                            n.select()
                        } else
                            c.setSelectionRange(e, e)
                },
                updateValueState: function() {
                    var e = this;
                    if (e.element) {
                        var t = e.element.selectionEnd
                          , c = e.element.value;
                        if (e.isAndroid)
                            return void window.setTimeout(function() {
                                e.element.value = e.properties.result,
                                e.setCurrentSelection(t, c)
                            }, 1);
                        e.element.value = e.properties.result,
                        e.setCurrentSelection(t, c)
                    }
                },
                setPhoneRegionCode: function(e) {
                    var t = this;
                    t.properties.phoneRegionCode = e,
                    t.initPhoneFormatter(),
                    t.onChange()
                },
                setRawValue: function(e) {
                    var t = this
                      , c = t.properties;
                    e = null != e ? e.toString() : "",
                    c.numeral && (e = e.replace(".", c.numeralDecimalMark)),
                    c.backspace = !1,
                    t.element.value = e,
                    t.onInput(e)
                },
                getRawValue: function() {
                    var e = this.properties
                      , t = n.Util
                      , c = this.element.value;
                    return e.rawValueTrimPrefix && (c = t.getPrefixStrippedValue(c, e.prefix, e.prefixLength)),
                    e.numeral ? e.numeralFormatter.getRawValue(c) : t.stripDelimiters(c, e.delimiter, e.delimiters)
                },
                getISOFormatDate: function() {
                    var e = this.properties;
                    return e.date ? e.dateFormatter.getISOFormatDate() : ""
                },
                getFormattedValue: function() {
                    return this.element.value
                },
                destroy: function() {
                    var e = this;
                    e.element.removeEventListener("input", e.onChangeListener),
                    e.element.removeEventListener("keydown", e.onKeyDownListener),
                    e.element.removeEventListener("cut", e.onCutListener),
                    e.element.removeEventListener("copy", e.onCopyListener)
                },
                toString: function() {
                    return "[Cleave Object]"
                }
            },
            n.NumeralFormatter = c(1),
            n.DateFormatter = c(2),
            n.PhoneFormatter = c(3),
            n.CreditCardDetector = c(4),
            n.Util = c(5),
            n.DefaultProperties = c(6),
            ("object" == typeof t && t ? t : window).Cleave = n,
            e.exports = n
        }
        ).call(t, function() {
            return this
        }())
    }
    , function(e, t) {
        "use strict";
        var c = function(e, t, n, i, a, r, s) {
            var l = this;
            l.numeralDecimalMark = e || ".",
            l.numeralIntegerScale = t > 0 ? t : 0,
            l.numeralDecimalScale = n >= 0 ? n : 2,
            l.numeralThousandsGroupStyle = i || c.groupStyle.thousand,
            l.numeralPositiveOnly = !!a,
            l.stripLeadingZeroes = !1 !== r,
            l.delimiter = s || "" === s ? s : ",",
            l.delimiterRE = s ? new RegExp("\\" + s,"g") : ""
        };
        c.groupStyle = {
            thousand: "thousand",
            lakh: "lakh",
            wan: "wan",
            none: "none"
        },
        c.prototype = {
            getRawValue: function(e) {
                return e.replace(this.delimiterRE, "").replace(this.numeralDecimalMark, ".")
            },
            format: function(e) {
                var t, n, i = this, a = "";
                switch (e = e.replace(/[A-Za-z]/g, "").replace(i.numeralDecimalMark, "M").replace(/[^\dM-]/g, "").replace(/^\-/, "N").replace(/\-/g, "").replace("N", i.numeralPositiveOnly ? "" : "-").replace("M", i.numeralDecimalMark),
                i.stripLeadingZeroes && (e = e.replace(/^(-)?0+(?=\d)/, "$1")),
                n = e,
                e.indexOf(i.numeralDecimalMark) >= 0 && (n = (t = e.split(i.numeralDecimalMark))[0],
                a = i.numeralDecimalMark + t[1].slice(0, i.numeralDecimalScale)),
                i.numeralIntegerScale > 0 && (n = n.slice(0, i.numeralIntegerScale + ("-" === e.slice(0, 1) ? 1 : 0))),
                i.numeralThousandsGroupStyle) {
                case c.groupStyle.lakh:
                    n = n.replace(/(\d)(?=(\d\d)+\d$)/g, "$1" + i.delimiter);
                    break;
                case c.groupStyle.wan:
                    n = n.replace(/(\d)(?=(\d{4})+$)/g, "$1" + i.delimiter);
                    break;
                case c.groupStyle.thousand:
                    n = n.replace(/(\d)(?=(\d{3})+$)/g, "$1" + i.delimiter)
                }
                return n.toString() + (i.numeralDecimalScale > 0 ? a.toString() : "")
            }
        },
        e.exports = c
    }
    , function(e, t) {
        "use strict";
        var c = function(e) {
            var t = this;
            t.date = [],
            t.blocks = [],
            t.datePattern = e,
            t.initBlocks()
        };
        c.prototype = {
            initBlocks: function() {
                var e = this;
                e.datePattern.forEach(function(t) {
                    "Y" === t ? e.blocks.push(4) : e.blocks.push(2)
                })
            },
            getISOFormatDate: function() {
                var e = this
                  , t = e.date;
                return t[2] ? t[2] + "-" + e.addLeadingZero(t[1]) + "-" + e.addLeadingZero(t[0]) : ""
            },
            getBlocks: function() {
                return this.blocks
            },
            getValidatedDate: function(e) {
                var t = this
                  , c = "";
                return e = e.replace(/[^\d]/g, ""),
                t.blocks.forEach(function(n, i) {
                    if (e.length > 0) {
                        var a = e.slice(0, n)
                          , r = a.slice(0, 1)
                          , s = e.slice(n);
                        switch (t.datePattern[i]) {
                        case "d":
                            "00" === a ? a = "01" : parseInt(r, 10) > 3 ? a = "0" + r : parseInt(a, 10) > 31 && (a = "31");
                            break;
                        case "m":
                            "00" === a ? a = "01" : parseInt(r, 10) > 1 ? a = "0" + r : parseInt(a, 10) > 12 && (a = "12")
                        }
                        c += a,
                        e = s
                    }
                }),
                this.getFixedDateString(c)
            },
            getFixedDateString: function(e) {
                var t, c, n, i = this, a = i.datePattern, r = [], s = 0, l = 0, o = 0, h = 0, v = 0, u = 0;
                return 4 === e.length && "y" !== a[0].toLowerCase() && "y" !== a[1].toLowerCase() && (v = 2 - (h = "d" === a[0] ? 0 : 2),
                t = parseInt(e.slice(h, h + 2), 10),
                c = parseInt(e.slice(v, v + 2), 10),
                r = this.getFixedDate(t, c, 0)),
                8 === e.length && (a.forEach(function(e, t) {
                    switch (e) {
                    case "d":
                        s = t;
                        break;
                    case "m":
                        l = t;
                        break;
                    default:
                        o = t
                    }
                }),
                u = 2 * o,
                h = s <= o ? 2 * s : 2 * s + 2,
                v = l <= o ? 2 * l : 2 * l + 2,
                t = parseInt(e.slice(h, h + 2), 10),
                c = parseInt(e.slice(v, v + 2), 10),
                n = parseInt(e.slice(u, u + 4), 10),
                r = this.getFixedDate(t, c, n)),
                i.date = r,
                0 === r.length ? e : a.reduce(function(e, t) {
                    switch (t) {
                    case "d":
                        return e + i.addLeadingZero(r[0]);
                    case "m":
                        return e + i.addLeadingZero(r[1]);
                    default:
                        return e + "" + (r[2] || "")
                    }
                }, "")
            },
            getFixedDate: function(e, t, c) {
                return e = Math.min(e, 31),
                t = Math.min(t, 12),
                c = parseInt(c || 0, 10),
                (t < 7 && t % 2 == 0 || t > 8 && t % 2 == 1) && (e = Math.min(e, 2 === t ? this.isLeapYear(c) ? 29 : 28 : 30)),
                [e, t, c]
            },
            isLeapYear: function(e) {
                return e % 4 == 0 && e % 100 != 0 || e % 400 == 0
            },
            addLeadingZero: function(e) {
                return (e < 10 ? "0" : "") + e
            }
        },
        e.exports = c
    }
    , function(e, t) {
        "use strict";
        var c = function(e, t) {
            var c = this;
            c.delimiter = t || "" === t ? t : " ",
            c.delimiterRE = t ? new RegExp("\\" + t,"g") : "",
            c.formatter = e
        };
        c.prototype = {
            setFormatter: function(e) {
                this.formatter = e
            },
            format: function(e) {
                var t = this;
                t.formatter.clear();
                for (var c, n = "", i = !1, a = 0, r = (e = (e = e.replace(/[^\d+]/g, "")).replace(t.delimiterRE, "")).length; a < r; a++)
                    c = t.formatter.inputDigit(e.charAt(a)),
                    /[\s()-]/g.test(c) ? (n = c,
                    i = !0) : i || (n = c);
                return (n = n.replace(/[()]/g, "")).replace(/[\s-]/g, t.delimiter)
            }
        },
        e.exports = c
    }
    , function(e, t) {
        "use strict";
        var c = {
            blocks: {
                uatp: [4, 5, 6],
                amex: [4, 6, 5],
                diners: [4, 6, 4],
                discover: [4, 4, 4, 4],
                mastercard: [4, 4, 4, 4],
                dankort: [4, 4, 4, 4],
                instapayment: [4, 4, 4, 4],
                jcb: [4, 4, 4, 4],
                maestro: [4, 4, 4, 4],
                visa: [4, 4, 4, 4],
                mir: [4, 4, 4, 4],
                general: [4, 4, 4, 4],
                unionPay: [4, 4, 4, 4],
                generalStrict: [4, 4, 4, 7]
            },
            re: {
                uatp: /^(?!1800)1\d{0,14}/,
                amex: /^3[47]\d{0,13}/,
                discover: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
                diners: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
                mastercard: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
                dankort: /^(5019|4175|4571)\d{0,12}/,
                instapayment: /^63[7-9]\d{0,13}/,
                jcb: /^(?:2131|1800|35\d{0,2})\d{0,12}/,
                maestro: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
                mir: /^220[0-4]\d{0,12}/,
                visa: /^4\d{0,15}/,
                unionPay: /^62\d{0,14}/
            },
            getInfo: function(e, t) {
                var n = c.blocks
                  , i = c.re;
                for (var a in t = !!t,
                i)
                    if (i[a].test(e)) {
                        return {
                            type: a,
                            blocks: "discover" !== a && "maestro" !== a && "visa" !== a && "mir" !== a && "unionPay" !== a || !t ? n[a] : n.generalStrict
                        }
                    }
                return {
                    type: "unknown",
                    blocks: t ? n.generalStrict : n.general
                }
            }
        };
        e.exports = c
    }
    , function(e, t) {
        "use strict";
        var c = {
            noop: function() {},
            strip: function(e, t) {
                return e.replace(t, "")
            },
            isDelimiter: function(e, t, c) {
                return 0 === c.length ? e === t : c.some(function(t) {
                    if (e === t)
                        return !0
                })
            },
            getDelimiterREByDelimiter: function(e) {
                return new RegExp(e.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"),"g")
            },
            stripDelimiters: function(e, t, c) {
                var n = this;
                if (0 === c.length) {
                    var i = t ? n.getDelimiterREByDelimiter(t) : "";
                    return e.replace(i, "")
                }
                return c.forEach(function(t) {
                    e = e.replace(n.getDelimiterREByDelimiter(t), "")
                }),
                e
            },
            headStr: function(e, t) {
                return e.slice(0, t)
            },
            getMaxLength: function(e) {
                return e.reduce(function(e, t) {
                    return e + t
                }, 0)
            },
            getPrefixStrippedValue: function(e, t, c) {
                if (e.slice(0, c) !== t) {
                    var n = this.getFirstDiffIndex(t, e.slice(0, c));
                    e = t + e.slice(n, n + 1) + e.slice(c + 1)
                }
                return e.slice(c)
            },
            getFirstDiffIndex: function(e, t) {
                for (var c = 0; e.charAt(c) === t.charAt(c); )
                    if ("" === e.charAt(c++))
                        return -1;
                return c
            },
            getFormattedValue: function(e, t, c, n, i, a) {
                var r, s = "", l = i.length > 0;
                return 0 === c ? e : (t.forEach(function(t, o) {
                    if (e.length > 0) {
                        var h = e.slice(0, t)
                          , v = e.slice(t);
                        r = l ? i[a ? o - 1 : o] || r : n,
                        a ? (o > 0 && (s += r),
                        s += h) : (s += h,
                        h.length === t && o < c - 1 && (s += r)),
                        e = v
                    }
                }),
                s)
            },
            isAndroid: function() {
                return navigator && /android/i.test(navigator.userAgent)
            },
            isAndroidBackspaceKeydown: function(e, t) {
                return !!(this.isAndroid() && e && t) && t === e.slice(0, -1)
            }
        };
        e.exports = c
    }
    , function(e, t) {
        (function(t) {
            "use strict";
            var c = {
                assign: function(e, c) {
                    return c = c || {},
                    (e = e || {}).creditCard = !!c.creditCard,
                    e.creditCardStrictMode = !!c.creditCardStrictMode,
                    e.creditCardType = "",
                    e.onCreditCardTypeChanged = c.onCreditCardTypeChanged || function() {}
                    ,
                    e.phone = !!c.phone,
                    e.phoneRegionCode = c.phoneRegionCode || "AU",
                    e.phoneFormatter = {},
                    e.date = !!c.date,
                    e.datePattern = c.datePattern || ["d", "m", "Y"],
                    e.dateFormatter = {},
                    e.numeral = !!c.numeral,
                    e.numeralIntegerScale = c.numeralIntegerScale > 0 ? c.numeralIntegerScale : 0,
                    e.numeralDecimalScale = c.numeralDecimalScale >= 0 ? c.numeralDecimalScale : 2,
                    e.numeralDecimalMark = c.numeralDecimalMark || ".",
                    e.numeralThousandsGroupStyle = c.numeralThousandsGroupStyle || "thousand",
                    e.numeralPositiveOnly = !!c.numeralPositiveOnly,
                    e.stripLeadingZeroes = !1 !== c.stripLeadingZeroes,
                    e.numericOnly = e.creditCard || e.date || !!c.numericOnly,
                    e.uppercase = !!c.uppercase,
                    e.lowercase = !!c.lowercase,
                    e.prefix = e.creditCard || e.date ? "" : c.prefix || "",
                    e.noImmediatePrefix = !!c.noImmediatePrefix,
                    e.prefixLength = e.prefix.length,
                    e.rawValueTrimPrefix = !!c.rawValueTrimPrefix,
                    e.copyDelimiter = !!c.copyDelimiter,
                    e.initValue = void 0 !== c.initValue && null !== c.initValue ? c.initValue.toString() : "",
                    e.delimiter = c.delimiter || "" === c.delimiter ? c.delimiter : c.date ? "/" : c.numeral ? "," : (c.phone,
                    " "),
                    e.delimiterLength = e.delimiter.length,
                    e.delimiterLazyShow = !!c.delimiterLazyShow,
                    e.delimiters = c.delimiters || [],
                    e.blocks = c.blocks || [],
                    e.blocksLength = e.blocks.length,
                    e.root = "object" == typeof t && t ? t : window,
                    e.maxLength = 0,
                    e.backspace = !1,
                    e.result = "",
                    e
                }
            };
            e.exports = c
        }
        ).call(t, function() {
            return this
        }())
    }
    ])
}),
function() {
    "use strict";
    var e = {};
    try {
        "undefined" != typeof window && (e = window)
    } catch (e) {}
    var t = (e.navigator || {}).userAgent
      , c = void 0 === t ? "" : t
      , n = e
      , i = (~c.indexOf("MSIE") || c.indexOf("Trident/"),
    "___FONT_AWESOME___")
      , a = function() {
        try {
            return !0
        } catch (e) {
            return !1
        }
    }()
      , r = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      , s = r.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    ["xs", "sm", "lg", "fw", "ul", "li", "border", "pull-left", "pull-right", "spin", "pulse", "rotate-90", "rotate-180", "rotate-270", "flip-horizontal", "flip-vertical", "stack", "stack-1x", "stack-2x", "inverse", "layers", "layers-text", "layers-counter"].concat(r.map(function(e) {
        return e + "x"
    })).concat(s.map(function(e) {
        return "w-" + e
    }));
    var l = n || {};
    l[i] || (l[i] = {}),
    l[i].styles || (l[i].styles = {}),
    l[i].hooks || (l[i].hooks = {}),
    l[i].shims || (l[i].shims = []);
    var o = l[i]
      , h = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var c = arguments[t];
            for (var n in c)
                Object.prototype.hasOwnProperty.call(c, n) && (e[n] = c[n])
        }
        return e
    }
      , v = {};
    !function(e) {
        try {
            !function e(t, c) {
                var n = Object.keys(c).reduce(function(e, t) {
                    var n = c[t];
                    return n.icon ? e[n.iconName] = n.icon : e[t] = n,
                    e
                }, {});
                "function" == typeof o.hooks.addPack ? o.hooks.addPack(t, n) : o.styles[t] = h({}, o.styles[t] || {}, n),
                "fas" === t && e("fa", c)
            }("fab", v)
        } catch (e) {
            if (!a)
                throw e
        }
    }(function() {
        !function e(t, c) {
            var n = Object.keys(c).reduce(function(e, t) {
                var n = c[t];
                return n.icon ? e[n.iconName] = n.icon : e[t] = n,
                e
            }, {});
            "function" == typeof o.hooks.addPack ? o.hooks.addPack(t, n) : o.styles[t] = h({}, o.styles[t] || {}, n),
            "fas" === t && e("fa", c)
        }("fab", v)
    })
}(),
function() {
    "use strict";
    var e = {};
    try {
        "undefined" != typeof window && (e = window)
    } catch (e) {}
    var t = (e.navigator || {}).userAgent
      , c = void 0 === t ? "" : t
      , n = e
      , i = (~c.indexOf("MSIE") || c.indexOf("Trident/"),
    "___FONT_AWESOME___")
      , a = function() {
        try {
            return !0
        } catch (e) {
            return !1
        }
    }()
      , r = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      , s = r.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    ["xs", "sm", "lg", "fw", "ul", "li", "border", "pull-left", "pull-right", "spin", "pulse", "rotate-90", "rotate-180", "rotate-270", "flip-horizontal", "flip-vertical", "stack", "stack-1x", "stack-2x", "inverse", "layers", "layers-text", "layers-counter"].concat(r.map(function(e) {
        return e + "x"
    })).concat(s.map(function(e) {
        return "w-" + e
    }));
    var l = n || {};
    l[i] || (l[i] = {}),
    l[i].styles || (l[i].styles = {}),
    l[i].hooks || (l[i].hooks = {}),
    l[i].shims || (l[i].shims = []);
    var o = l[i]
      , h = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var c = arguments[t];
            for (var n in c)
                Object.prototype.hasOwnProperty.call(c, n) && (e[n] = c[n])
        }
        return e
    }
      , v = {};
    !function(e) {
        try {
            !function e(t, c) {
                var n = Object.keys(c).reduce(function(e, t) {
                    var n = c[t];
                    return n.icon ? e[n.iconName] = n.icon : e[t] = n,
                    e
                }, {});
                "function" == typeof o.hooks.addPack ? o.hooks.addPack(t, n) : o.styles[t] = h({}, o.styles[t] || {}, n),
                "fas" === t && e("fa", c)
            }("far", v)
        } catch (e) {
            if (!a)
                throw e
        }
    }(function() {
        !function e(t, c) {
            var n = Object.keys(c).reduce(function(e, t) {
                var n = c[t];
                return n.icon ? e[n.iconName] = n.icon : e[t] = n,
                e
            }, {});
            "function" == typeof o.hooks.addPack ? o.hooks.addPack(t, n) : o.styles[t] = h({}, o.styles[t] || {}, n),
            "fas" === t && e("fa", c)
        }("far", v)
    })
}(),
function() {
    "use strict";
    var e = {};
    try {
        "undefined" != typeof window && (e = window)
    } catch (e) {}
    var t = (e.navigator || {}).userAgent
      , c = void 0 === t ? "" : t
      , n = e
      , i = (~c.indexOf("MSIE") || c.indexOf("Trident/"),
    "___FONT_AWESOME___")
      , a = function() {
        try {
            return !0
        } catch (e) {
            return !1
        }
    }()
      , r = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      , s = r.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    ["xs", "sm", "lg", "fw", "ul", "li", "border", "pull-left", "pull-right", "spin", "pulse", "rotate-90", "rotate-180", "rotate-270", "flip-horizontal", "flip-vertical", "stack", "stack-1x", "stack-2x", "inverse", "layers", "layers-text", "layers-counter"].concat(r.map(function(e) {
        return e + "x"
    })).concat(s.map(function(e) {
        return "w-" + e
    }));
    var l = n || {};
    l[i] || (l[i] = {}),
    l[i].styles || (l[i].styles = {}),
    l[i].hooks || (l[i].hooks = {}),
    l[i].shims || (l[i].shims = []);
    var o = l[i]
      , h = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var c = arguments[t];
            for (var n in c)
                Object.prototype.hasOwnProperty.call(c, n) && (e[n] = c[n])
        }
        return e
    }
      , v = {};
    !function(e) {
        try {
            !function e(t, c) {
                var n = Object.keys(c).reduce(function(e, t) {
                    var n = c[t];
                    return n.icon ? e[n.iconName] = n.icon : e[t] = n,
                    e
                }, {});
                "function" == typeof o.hooks.addPack ? o.hooks.addPack(t, n) : o.styles[t] = h({}, o.styles[t] || {}, n),
                "fas" === t && e("fa", c)
            }("fas", v)
        } catch (e) {
            if (!a)
                throw e
        }
    }(function() {
        !function e(t, c) {
            var n = Object.keys(c).reduce(function(e, t) {
                var n = c[t];
                return n.icon ? e[n.iconName] = n.icon : e[t] = n,
                e
            }, {});
            "function" == typeof o.hooks.addPack ? o.hooks.addPack(t, n) : o.styles[t] = h({}, o.styles[t] || {}, n),
            "fas" === t && e("fa", c)
        }("fas", v)
    })
}(),
function() {
    "use strict";
    var e = function() {}
      , t = {}
      , c = {}
      , n = null
      , i = {
        mark: e,
        measure: e
    };
    try {
        "undefined" != typeof window && (t = window),
        "undefined" != typeof document && (c = document),
        "undefined" != typeof MutationObserver && (n = MutationObserver),
        "undefined" != typeof performance && (i = performance)
    } catch (e) {}
    var a = (t.navigator || {}).userAgent
      , r = void 0 === a ? "" : a
      , s = t
      , l = c
      , o = n
      , h = i
      , v = !!s.document
      , u = !!l.documentElement && !!l.head && "function" == typeof l.addEventListener && "function" == typeof l.createElement
      , d = ~r.indexOf("MSIE") || ~r.indexOf("Trident/")
      , m = "___FONT_AWESOME___"
      , f = 16
      , p = "svg-inline--fa"
      , z = "data-fa-i2svg"
      , g = "data-fa-pseudo-element"
      , M = "fontawesome-i2svg"
      , C = function() {
        try {
            return !0
        } catch (e) {
            return !1
        }
    }()
      , y = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      , H = y.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
      , b = ["class", "data-prefix", "data-icon", "data-fa-transform", "data-fa-mask"]
      , V = ["xs", "sm", "lg", "fw", "ul", "li", "border", "pull-left", "pull-right", "spin", "pulse", "rotate-90", "rotate-180", "rotate-270", "flip-horizontal", "flip-vertical", "stack", "stack-1x", "stack-2x", "inverse", "layers", "layers-text", "layers-counter"].concat(y.map(function(e) {
        return e + "x"
    })).concat(H.map(function(e) {
        return "w-" + e
    }))
      , L = function(e, t) {
        if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function")
    }
      , x = function() {
        function e(e, t) {
            for (var c = 0; c < t.length; c++) {
                var n = t[c];
                n.enumerable = n.enumerable || !1,
                n.configurable = !0,
                "value"in n && (n.writable = !0),
                Object.defineProperty(e, n.key, n)
            }
        }
        return function(t, c, n) {
            return c && e(t.prototype, c),
            n && e(t, n),
            t
        }
    }()
      , w = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var c = arguments[t];
            for (var n in c)
                Object.prototype.hasOwnProperty.call(c, n) && (e[n] = c[n])
        }
        return e
    }
      , k = function(e) {
        if (Array.isArray(e)) {
            for (var t = 0, c = Array(e.length); t < e.length; t++)
                c[t] = e[t];
            return c
        }
        return Array.from(e)
    }
      , $ = s.FontAwesomeConfig || {}
      , _ = Object.keys($)
      , E = w({
        familyPrefix: "fa",
        replacementClass: p,
        autoReplaceSvg: !0,
        autoAddCss: !0,
        autoA11y: !0,
        searchPseudoElements: !1,
        observeMutations: !0,
        keepOriginalSource: !0,
        measurePerformance: !1,
        showMissingIcons: !0
    }, $);
    E.autoReplaceSvg || (E.observeMutations = !1);
    var S = w({}, E);
    function A(e) {
        var t = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).asNewDefault
          , c = void 0 !== t && t
          , n = Object.keys(S)
          , i = c ? function(e) {
            return ~n.indexOf(e) && !~_.indexOf(e)
        }
        : function(e) {
            return ~n.indexOf(e)
        }
        ;
        Object.keys(e).forEach(function(t) {
            i(t) && (S[t] = e[t])
        })
    }
    s.FontAwesomeConfig = S;
    var T = s || {};
    T[m] || (T[m] = {}),
    T[m].styles || (T[m].styles = {}),
    T[m].hooks || (T[m].hooks = {}),
    T[m].shims || (T[m].shims = []);
    var D = T[m]
      , P = []
      , N = !1;
    u && ((N = (l.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(l.readyState)) || l.addEventListener("DOMContentLoaded", function e() {
        l.removeEventListener("DOMContentLoaded", e),
        N = 1,
        P.map(function(e) {
            return e()
        })
    }));
    var j = f
      , O = {
        size: 16,
        x: 0,
        y: 0,
        rotate: 0,
        flipX: !1,
        flipY: !1
    };
    function I(e) {
        if (e && u) {
            var t = l.createElement("style");
            t.setAttribute("type", "text/css"),
            t.innerHTML = e;
            for (var c = l.head.childNodes, n = null, i = c.length - 1; i > -1; i--) {
                var a = c[i]
                  , r = (a.tagName || "").toUpperCase();
                ["STYLE", "LINK"].indexOf(r) > -1 && (n = a)
            }
            return l.head.insertBefore(t, n),
            e
        }
    }
    var q = 0;
    function R() {
        return ++q
    }
    function F(e) {
        for (var t = [], c = (e || []).length >>> 0; c--; )
            t[c] = e[c];
        return t
    }
    function B(e) {
        return e.classList ? F(e.classList) : (e.getAttribute("class") || "").split(" ").filter(function(e) {
            return e
        })
    }
    function U(e) {
        return ("" + e).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }
    function W(e) {
        return Object.keys(e || {}).reduce(function(t, c) {
            return t + (c + ": ") + e[c] + ";"
        }, "")
    }
    function X(e) {
        return e.size !== O.size || e.x !== O.x || e.y !== O.y || e.rotate !== O.rotate || e.flipX || e.flipY
    }
    function K(e) {
        var t = e.transform
          , c = e.containerWidth
          , n = e.iconWidth;
        return {
            outer: {
                transform: "translate(" + c / 2 + " 256)"
            },
            inner: {
                transform: "translate(" + 32 * t.x + ", " + 32 * t.y + ")  scale(" + t.size / 16 * (t.flipX ? -1 : 1) + ", " + t.size / 16 * (t.flipY ? -1 : 1) + ")  rotate(" + t.rotate + " 0 0)"
            },
            path: {
                transform: "translate(" + n / 2 * -1 + " -256)"
            }
        }
    }
    var Y = {
        x: 0,
        y: 0,
        width: "100%",
        height: "100%"
    }
      , G = function(e) {
        var t = e.children
          , c = e.attributes
          , n = e.main
          , i = e.mask
          , a = e.transform
          , r = n.width
          , s = n.icon
          , l = i.width
          , o = i.icon
          , h = K({
            transform: a,
            containerWidth: l,
            iconWidth: r
        })
          , v = {
            tag: "rect",
            attributes: w({}, Y, {
                fill: "white"
            })
        }
          , u = {
            tag: "g",
            attributes: w({}, h.inner),
            children: [{
                tag: "path",
                attributes: w({}, s.attributes, h.path, {
                    fill: "black"
                })
            }]
        }
          , d = {
            tag: "g",
            attributes: w({}, h.outer),
            children: [u]
        }
          , m = "mask-" + R()
          , f = "clip-" + R()
          , p = {
            tag: "defs",
            children: [{
                tag: "clipPath",
                attributes: {
                    id: f
                },
                children: [o]
            }, {
                tag: "mask",
                attributes: w({}, Y, {
                    id: m,
                    maskUnits: "userSpaceOnUse",
                    maskContentUnits: "userSpaceOnUse"
                }),
                children: [v, d]
            }]
        };
        return t.push(p, {
            tag: "rect",
            attributes: w({
                fill: "currentColor",
                "clip-path": "url(#" + f + ")",
                mask: "url(#" + m + ")"
            }, Y)
        }),
        {
            children: t,
            attributes: c
        }
    }
      , Q = function(e) {
        var t = e.children
          , c = e.attributes
          , n = e.main
          , i = e.transform
          , a = W(e.styles);
        if (a.length > 0 && (c.style = a),
        X(i)) {
            var r = K({
                transform: i,
                containerWidth: n.width,
                iconWidth: n.width
            });
            t.push({
                tag: "g",
                attributes: w({}, r.outer),
                children: [{
                    tag: "g",
                    attributes: w({}, r.inner),
                    children: [{
                        tag: n.icon.tag,
                        children: n.icon.children,
                        attributes: w({}, n.icon.attributes, r.path)
                    }]
                }]
            })
        } else
            t.push(n.icon);
        return {
            children: t,
            attributes: c
        }
    }
      , Z = function(e) {
        var t = e.children
          , c = e.main
          , n = e.mask
          , i = e.attributes
          , a = e.styles
          , r = e.transform;
        if (X(r) && c.found && !n.found) {
            var s = c.width / c.height / 2;
            i.style = W(w({}, a, {
                "transform-origin": s + r.x / 16 + "em " + (.5 + r.y / 16) + "em"
            }))
        }
        return [{
            tag: "svg",
            attributes: i,
            children: t
        }]
    }
      , J = function(e) {
        var t = e.prefix
          , c = e.iconName
          , n = e.children
          , i = e.attributes
          , a = e.symbol
          , r = !0 === a ? t + "-" + S.familyPrefix + "-" + c : a;
        return [{
            tag: "svg",
            attributes: {
                style: "display: none;"
            },
            children: [{
                tag: "symbol",
                attributes: w({}, i, {
                    id: r
                }),
                children: n
            }]
        }]
    };
    function ee(e) {
        var t = e.icons
          , c = t.main
          , n = t.mask
          , i = e.prefix
          , a = e.iconName
          , r = e.transform
          , s = e.symbol
          , l = e.title
          , o = e.extra
          , h = e.watchable
          , v = void 0 !== h && h
          , u = n.found ? n : c
          , d = u.width
          , m = u.height
          , f = "fa-w-" + Math.ceil(d / m * 16)
          , p = [S.replacementClass, a ? S.familyPrefix + "-" + a : "", f].concat(o.classes).join(" ")
          , g = {
            children: [],
            attributes: w({}, o.attributes, {
                "data-prefix": i,
                "data-icon": a,
                class: p,
                role: "img",
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 " + d + " " + m
            })
        };
        v && (g.attributes[z] = ""),
        l && g.children.push({
            tag: "title",
            attributes: {
                id: g.attributes["aria-labelledby"] || "title-" + R()
            },
            children: [l]
        });
        var M = w({}, g, {
            prefix: i,
            iconName: a,
            main: c,
            mask: n,
            transform: r,
            symbol: s,
            styles: o.styles
        })
          , C = n.found && c.found ? G(M) : Q(M)
          , y = C.children
          , H = C.attributes;
        return M.children = y,
        M.attributes = H,
        s ? J(M) : Z(M)
    }
    function te(e) {
        var t = e.content
          , c = e.width
          , n = e.height
          , i = e.transform
          , a = e.title
          , r = e.extra
          , s = e.watchable
          , l = void 0 !== s && s
          , o = w({}, r.attributes, a ? {
            title: a
        } : {}, {
            class: r.classes.join(" ")
        });
        l && (o[z] = "");
        var h, v, u, m, p, g, M, C, y, H = w({}, r.styles);
        X(i) && (H.transform = (v = (h = {
            transform: i,
            startCentered: !0,
            width: c,
            height: n
        }).transform,
        m = void 0 === (u = h.width) ? f : u,
        g = void 0 === (p = h.height) ? f : p,
        y = "",
        y += (C = void 0 !== (M = h.startCentered) && M) && d ? "translate(" + (v.x / j - m / 2) + "em, " + (v.y / j - g / 2) + "em) " : C ? "translate(calc(-50% + " + v.x / j + "em), calc(-50% + " + v.y / j + "em)) " : "translate(" + v.x / j + "em, " + v.y / j + "em) ",
        y += "scale(" + v.size / j * (v.flipX ? -1 : 1) + ", " + v.size / j * (v.flipY ? -1 : 1) + ") ",
        y += "rotate(" + v.rotate + "deg) "),
        H["-webkit-transform"] = H.transform);
        var b = W(H);
        b.length > 0 && (o.style = b);
        var V = [];
        return V.push({
            tag: "span",
            attributes: o,
            children: [t]
        }),
        a && V.push({
            tag: "span",
            attributes: {
                class: "sr-only"
            },
            children: [a]
        }),
        V
    }
    var ce = function() {}
      , ne = S.measurePerformance && h && h.mark && h.measure ? h : {
        mark: ce,
        measure: ce
    }
      , ie = 'FA "5.0.6"'
      , ae = function(e) {
        ne.mark(ie + " " + e + " ends"),
        ne.measure(ie + " " + e, ie + " " + e + " begins", ie + " " + e + " ends")
    }
      , re = {
        begin: function(e) {
            return ne.mark(ie + " " + e + " begins"),
            function() {
                return ae(e)
            }
        },
        end: ae
    }
      , se = function(e, t, c, n) {
        var i, a, r, s, l, o = Object.keys(e), h = o.length, v = void 0 !== n ? (s = t,
        l = n,
        function(e, t, c, n) {
            return s.call(l, e, t, c, n)
        }
        ) : t;
        for (void 0 === c ? (i = 1,
        r = e[o[0]]) : (i = 0,
        r = c); i < h; i++)
            r = v(r, e[a = o[i]], a, e);
        return r
    }
      , le = D.styles
      , oe = D.shims
      , he = {}
      , ve = {}
      , ue = {}
      , de = function() {
        var e = function(e) {
            return se(le, function(t, c, n) {
                return t[n] = se(c, e, {}),
                t
            }, {})
        };
        he = e(function(e, t, c) {
            return e[t[3]] = c,
            e
        }),
        ve = e(function(e, t, c) {
            var n = t[2];
            return e[c] = c,
            n.forEach(function(t) {
                e[t] = c
            }),
            e
        });
        var t = "far"in le;
        ue = se(oe, function(e, c) {
            var n = c[0]
              , i = c[1]
              , a = c[2];
            return "far" !== i || t || (i = "fas"),
            e[n] = {
                prefix: i,
                iconName: a
            },
            e
        }, {})
    };
    de();
    var me = D.styles
      , fe = function() {
        return {
            prefix: null,
            iconName: null,
            rest: []
        }
    };
    function pe(e) {
        return e.reduce(function(e, t) {
            var c = function(e, t) {
                var c, n = t.split("-"), i = n[0], a = n.slice(1).join("-");
                return i !== e || "" === a || (c = a,
                ~V.indexOf(c)) ? null : a
            }(S.familyPrefix, t);
            if (me[t])
                e.prefix = t;
            else if (c) {
                var n = "fa" === e.prefix ? ue[c] || {
                    prefix: null,
                    iconName: null
                } : {};
                e.iconName = n.iconName || c,
                e.prefix = n.prefix || e.prefix
            } else
                t !== S.replacementClass && 0 !== t.indexOf("fa-w-") && e.rest.push(t);
            return e
        }, fe())
    }
    function ze(e, t, c) {
        if (e && e[t] && e[t][c])
            return {
                prefix: t,
                iconName: c,
                icon: e[t][c]
            }
    }
    function ge(e) {
        var t, c = e.tag, n = e.attributes, i = void 0 === n ? {} : n, a = e.children, r = void 0 === a ? [] : a;
        return "string" == typeof e ? U(e) : "<" + c + " " + (t = i,
        Object.keys(t || {}).reduce(function(e, c) {
            return e + (c + '="') + U(t[c]) + '" '
        }, "").trim()) + ">" + r.map(ge).join("") + "</" + c + ">"
    }
    var Me = function() {};
    function Ce(e) {
        return "string" == typeof (e.getAttribute ? e.getAttribute(z) : null)
    }
    var ye = {
        replace: function(e) {
            var t = e[0]
              , c = e[1].map(function(e) {
                return ge(e)
            }).join("\n");
            if (t.parentNode && t.outerHTML)
                t.outerHTML = c + (S.keepOriginalSource && "svg" !== t.tagName.toLowerCase() ? "\x3c!-- " + t.outerHTML + " --\x3e" : "");
            else if (t.parentNode) {
                var n = document.createElement("span");
                t.parentNode.replaceChild(n, t),
                n.outerHTML = c
            }
        },
        nest: function(e) {
            var t = e[0]
              , c = e[1];
            if (~B(t).indexOf(S.replacementClass))
                return ye.replace(e);
            var n = new RegExp(S.familyPrefix + "-.*");
            delete c[0].attributes.style;
            var i = c[0].attributes.class.split(" ").reduce(function(e, t) {
                return t === S.replacementClass || t.match(n) ? e.toSvg.push(t) : e.toNode.push(t),
                e
            }, {
                toNode: [],
                toSvg: []
            });
            c[0].attributes.class = i.toSvg.join(" ");
            var a = c.map(function(e) {
                return ge(e)
            }).join("\n");
            t.setAttribute("class", i.toNode.join(" ")),
            t.setAttribute(z, ""),
            t.innerHTML = a
        }
    };
    function He(e, t) {
        var c = "function" == typeof t ? t : Me;
        0 === e.length ? c() : (s.requestAnimationFrame || function(e) {
            return e()
        }
        )(function() {
            var t = !0 === S.autoReplaceSvg ? ye.replace : ye[S.autoReplaceSvg] || ye.replace
              , n = re.begin("mutate");
            e.map(t),
            n(),
            c()
        })
    }
    var be = !1
      , Ve = function(e) {
        var t = e.getAttribute("style")
          , c = [];
        return t && (c = t.split(";").reduce(function(e, t) {
            var c = t.split(":")
              , n = c[0]
              , i = c.slice(1);
            return n && i.length > 0 && (e[n] = i.join(":").trim()),
            e
        }, {})),
        c
    }
      , Le = function(e) {
        var t, c, n, i, a = e.getAttribute("data-prefix"), r = e.getAttribute("data-icon"), s = void 0 !== e.innerText ? e.innerText.trim() : "", l = pe(B(e));
        return a && r && (l.prefix = a,
        l.iconName = r),
        l.prefix && s.length > 1 ? l.iconName = (n = l.prefix,
        i = e.innerText,
        ve[n][i]) : l.prefix && 1 === s.length && (l.iconName = (t = l.prefix,
        c = function(e) {
            for (var t = "", c = 0; c < e.length; c++)
                t += ("000" + e.charCodeAt(c).toString(16)).slice(-4);
            return t
        }(e.innerText),
        he[t][c])),
        l
    }
      , xe = function(e) {
        var t = {
            size: 16,
            x: 0,
            y: 0,
            flipX: !1,
            flipY: !1,
            rotate: 0
        };
        return e ? e.toLowerCase().split(" ").reduce(function(e, t) {
            var c = t.toLowerCase().split("-")
              , n = c[0]
              , i = c.slice(1).join("-");
            if (n && "h" === i)
                return e.flipX = !0,
                e;
            if (n && "v" === i)
                return e.flipY = !0,
                e;
            if (i = parseFloat(i),
            isNaN(i))
                return e;
            switch (n) {
            case "grow":
                e.size = e.size + i;
                break;
            case "shrink":
                e.size = e.size - i;
                break;
            case "left":
                e.x = e.x - i;
                break;
            case "right":
                e.x = e.x + i;
                break;
            case "up":
                e.y = e.y - i;
                break;
            case "down":
                e.y = e.y + i;
                break;
            case "rotate":
                e.rotate = e.rotate + i
            }
            return e
        }, t) : t
    }
      , we = function(e) {
        return xe(e.getAttribute("data-fa-transform"))
    }
      , ke = function(e) {
        var t = e.getAttribute("data-fa-symbol");
        return null !== t && ("" === t || t)
    }
      , $e = function(e) {
        var t = F(e.attributes).reduce(function(e, t) {
            return "class" !== e.name && "style" !== e.name && (e[t.name] = t.value),
            e
        }, {})
          , c = e.getAttribute("title");
        return S.autoA11y && (c ? t["aria-labelledby"] = S.replacementClass + "-title-" + R() : t["aria-hidden"] = "true"),
        t
    }
      , _e = function(e) {
        var t = e.getAttribute("data-fa-mask");
        return t ? pe(t.split(" ").map(function(e) {
            return e.trim()
        })) : fe()
    };
    function Ee(e) {
        this.name = "MissingIcon",
        this.message = e || "Icon unavailable",
        this.stack = (new Error).stack
    }
    Ee.prototype = Object.create(Error.prototype),
    Ee.prototype.constructor = Ee;
    var Se = {
        fill: "currentColor"
    }
      , Ae = {
        attributeType: "XML",
        repeatCount: "indefinite",
        dur: "2s"
    }
      , Te = {
        tag: "path",
        attributes: w({}, Se, {
            d: "M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"
        })
    }
      , De = w({}, Ae, {
        attributeName: "opacity"
    })
      , Pe = {
        tag: "g",
        children: [Te, {
            tag: "circle",
            attributes: w({}, Se, {
                cx: "256",
                cy: "364",
                r: "28"
            }),
            children: [{
                tag: "animate",
                attributes: w({}, Ae, {
                    attributeName: "r",
                    values: "28;14;28;28;14;28;"
                })
            }, {
                tag: "animate",
                attributes: w({}, De, {
                    values: "1;0;1;1;0;1;"
                })
            }]
        }, {
            tag: "path",
            attributes: w({}, Se, {
                opacity: "1",
                d: "M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"
            }),
            children: [{
                tag: "animate",
                attributes: w({}, De, {
                    values: "1;0;0;0;0;1;"
                })
            }]
        }, {
            tag: "path",
            attributes: w({}, Se, {
                opacity: "0",
                d: "M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"
            }),
            children: [{
                tag: "animate",
                attributes: w({}, De, {
                    values: "0;0;1;1;0;0;"
                })
            }]
        }]
    }
      , Ne = D.styles
      , je = "fa-layers-text"
      , Oe = /Font Awesome 5 (Solid|Regular|Light|Brands)/
      , Ie = {
        Solid: "fas",
        Regular: "far",
        Light: "fal",
        Brands: "fab"
    };
    function qe(e, t) {
        var c = {
            found: !1,
            width: 512,
            height: 512,
            icon: Pe
        };
        if (e && t && Ne[t] && Ne[t][e]) {
            var n = Ne[t][e];
            c = {
                found: !0,
                width: n[0],
                height: n[1],
                icon: {
                    tag: "path",
                    attributes: {
                        fill: "currentColor",
                        d: n.slice(4)[0]
                    }
                }
            }
        } else if (e && t && !S.showMissingIcons)
            throw new Ee("Icon is missing for prefix " + t + " with icon name " + e);
        return c
    }
    function Re(e) {
        var t, c, n, i, a, r, s, l, o, h, v, u, m, f, p, z, g, M, C, y = (n = (c = Le(t = e)).iconName,
        i = c.prefix,
        a = c.rest,
        r = Ve(t),
        s = we(t),
        l = ke(t),
        o = $e(t),
        h = _e(t),
        {
            iconName: n,
            title: t.getAttribute("title"),
            prefix: i,
            transform: s,
            symbol: l,
            mask: h,
            extra: {
                classes: a,
                styles: r,
                attributes: o
            }
        });
        return ~y.extra.classes.indexOf(je) ? function(e, t) {
            var c = t.title
              , n = t.transform
              , i = t.extra
              , a = null
              , r = null;
            if (d) {
                var s = parseInt(getComputedStyle(e).fontSize, 10)
                  , l = e.getBoundingClientRect();
                a = l.width / s,
                r = l.height / s
            }
            return S.autoA11y && !c && (i.attributes["aria-hidden"] = "true"),
            [e, te({
                content: e.innerHTML,
                width: a,
                height: r,
                transform: n,
                title: c,
                extra: i,
                watchable: !0
            })]
        }(e, y) : (v = e,
        m = (u = y).iconName,
        f = u.title,
        p = u.prefix,
        z = u.transform,
        g = u.symbol,
        M = u.mask,
        C = u.extra,
        [v, ee({
            icons: {
                main: qe(m, p),
                mask: qe(M.iconName, M.prefix)
            },
            prefix: p,
            iconName: m,
            transform: z,
            symbol: g,
            mask: M,
            title: f,
            extra: C,
            watchable: !0
        })])
    }
    function Fe(e) {
        "function" == typeof e.remove ? e.remove() : e && e.parentNode && e.parentNode.removeChild(e)
    }
    function Be(e) {
        if (u) {
            var t = re.begin("searchPseudoElements");
            be = !0,
            F(e.querySelectorAll("*")).forEach(function(e) {
                [":before", ":after"].forEach(function(t) {
                    var c = s.getComputedStyle(e, t)
                      , n = c.getPropertyValue("font-family").match(Oe)
                      , i = F(e.children).filter(function(e) {
                        return e.getAttribute(g) === t
                    })[0];
                    if (i && (i.nextSibling && i.nextSibling.textContent.indexOf(g) > -1 && Fe(i.nextSibling),
                    Fe(i),
                    i = null),
                    n && !i) {
                        var a = c.getPropertyValue("content")
                          , r = l.createElement("i");
                        r.setAttribute("class", "" + Ie[n[1]]),
                        r.setAttribute(g, t),
                        r.innerText = 3 === a.length ? a.substr(1, 1) : a,
                        ":before" === t ? e.insertBefore(r, e.firstChild) : e.appendChild(r)
                    }
                })
            }),
            be = !1,
            t()
        }
    }
    function Ue(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
        if (u) {
            var c = l.documentElement.classList
              , n = function(e) {
                return c.add(M + "-" + e)
            }
              , i = function(e) {
                return c.remove(M + "-" + e)
            }
              , a = Object.keys(Ne)
              , r = ["." + je + ":not([" + z + "])"].concat(a.map(function(e) {
                return "." + e + ":not([" + z + "])"
            })).join(", ");
            if (0 !== r.length) {
                var s = F(e.querySelectorAll(r));
                if (s.length > 0) {
                    n("pending"),
                    i("complete");
                    var o = re.begin("onTree")
                      , h = s.reduce(function(e, t) {
                        try {
                            var c = Re(t);
                            c && e.push(c)
                        } catch (e) {
                            C || e instanceof Ee && console.error(e)
                        }
                        return e
                    }, []);
                    o(),
                    He(h, function() {
                        n("active"),
                        n("complete"),
                        i("pending"),
                        "function" == typeof t && t()
                    })
                }
            }
        }
    }
    function We(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null
          , c = Re(e);
        c && He([c], t)
    }
    var Xe = function() {
        var e = p
          , t = S.familyPrefix
          , c = S.replacementClass
          , n = "svg:not(:root).svg-inline--fa{overflow:visible}.svg-inline--fa{display:inline-block;font-size:inherit;height:1em;overflow:visible;vertical-align:-.125em}.svg-inline--fa.fa-lg{vertical-align:-.225em}.svg-inline--fa.fa-w-1{width:.0625em}.svg-inline--fa.fa-w-2{width:.125em}.svg-inline--fa.fa-w-3{width:.1875em}.svg-inline--fa.fa-w-4{width:.25em}.svg-inline--fa.fa-w-5{width:.3125em}.svg-inline--fa.fa-w-6{width:.375em}.svg-inline--fa.fa-w-7{width:.4375em}.svg-inline--fa.fa-w-8{width:.5em}.svg-inline--fa.fa-w-9{width:.5625em}.svg-inline--fa.fa-w-10{width:.625em}.svg-inline--fa.fa-w-11{width:.6875em}.svg-inline--fa.fa-w-12{width:.75em}.svg-inline--fa.fa-w-13{width:.8125em}.svg-inline--fa.fa-w-14{width:.875em}.svg-inline--fa.fa-w-15{width:.9375em}.svg-inline--fa.fa-w-16{width:1em}.svg-inline--fa.fa-w-17{width:1.0625em}.svg-inline--fa.fa-w-18{width:1.125em}.svg-inline--fa.fa-w-19{width:1.1875em}.svg-inline--fa.fa-w-20{width:1.25em}.svg-inline--fa.fa-pull-left{margin-right:.3em;width:auto}.svg-inline--fa.fa-pull-right{margin-left:.3em;width:auto}.svg-inline--fa.fa-border{height:1.5em}.svg-inline--fa.fa-li{width:2em}.svg-inline--fa.fa-fw{width:1.25em}.fa-layers svg.svg-inline--fa{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0}.fa-layers{display:inline-block;height:1em;position:relative;text-align:center;vertical-align:-.125em;width:1em}.fa-layers svg.svg-inline--fa{-webkit-transform-origin:center center;transform-origin:center center}.fa-layers-counter,.fa-layers-text{display:inline-block;position:absolute;text-align:center}.fa-layers-text{left:50%;top:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);-webkit-transform-origin:center center;transform-origin:center center}.fa-layers-counter{background-color:#ff253a;border-radius:1em;color:#fff;height:1.5em;line-height:1;max-width:5em;min-width:1.5em;overflow:hidden;padding:.25em;right:0;text-overflow:ellipsis;top:0;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:top right;transform-origin:top right}.fa-layers-bottom-right{bottom:0;right:0;top:auto;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:bottom right;transform-origin:bottom right}.fa-layers-bottom-left{bottom:0;left:0;right:auto;top:auto;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:bottom left;transform-origin:bottom left}.fa-layers-top-right{right:0;top:0;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:top right;transform-origin:top right}.fa-layers-top-left{left:0;right:auto;top:0;-webkit-transform:scale(.25);transform:scale(.25);-webkit-transform-origin:top left;transform-origin:top left}.fa-lg{font-size:1.33333em;line-height:.75em;vertical-align:-.0667em}.fa-xs{font-size:.75em}.fa-sm{font-size:.875em}.fa-1x{font-size:1em}.fa-2x{font-size:2em}.fa-3x{font-size:3em}.fa-4x{font-size:4em}.fa-5x{font-size:5em}.fa-6x{font-size:6em}.fa-7x{font-size:7em}.fa-8x{font-size:8em}.fa-9x{font-size:9em}.fa-10x{font-size:10em}.fa-fw{text-align:center;width:1.25em}.fa-ul{list-style-type:none;margin-left:2.5em;padding-left:0}.fa-ul>li{position:relative}.fa-li{left:-2em;position:absolute;text-align:center;width:2em;line-height:inherit}.fa-border{border:solid .08em #eee;border-radius:.1em;padding:.2em .25em .15em}.fa-pull-left{float:left}.fa-pull-right{float:right}.fa.fa-pull-left,.fab.fa-pull-left,.fal.fa-pull-left,.far.fa-pull-left,.fas.fa-pull-left{margin-right:.3em}.fa.fa-pull-right,.fab.fa-pull-right,.fal.fa-pull-right,.far.fa-pull-right,.fas.fa-pull-right{margin-left:.3em}.fa-spin{-webkit-animation:fa-spin 2s infinite linear;animation:fa-spin 2s infinite linear}.fa-pulse{-webkit-animation:fa-spin 1s infinite steps(8);animation:fa-spin 1s infinite steps(8)}@-webkit-keyframes fa-spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes fa-spin{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.fa-rotate-90{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.fa-rotate-180{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.fa-rotate-270{-webkit-transform:rotate(270deg);transform:rotate(270deg)}.fa-flip-horizontal{-webkit-transform:scale(-1,1);transform:scale(-1,1)}.fa-flip-vertical{-webkit-transform:scale(1,-1);transform:scale(1,-1)}.fa-flip-horizontal.fa-flip-vertical{-webkit-transform:scale(-1,-1);transform:scale(-1,-1)}:root .fa-flip-horizontal,:root .fa-flip-vertical,:root .fa-rotate-180,:root .fa-rotate-270,:root .fa-rotate-90{-webkit-filter:none;filter:none}.fa-stack{display:inline-block;height:2em;position:relative;width:2em}.fa-stack-1x,.fa-stack-2x{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0}.svg-inline--fa.fa-stack-1x{height:1em;width:1em}.svg-inline--fa.fa-stack-2x{height:2em;width:2em}.fa-inverse{color:#fff}.sr-only{border:0;clip:rect(0,0,0,0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}.sr-only-focusable:active,.sr-only-focusable:focus{clip:auto;height:auto;margin:0;overflow:visible;position:static;width:auto}";
        if ("fa" !== t || c !== e) {
            var i = new RegExp("\\.fa\\-","g")
              , a = new RegExp("\\." + e,"g");
            n = n.replace(i, "." + t + "-").replace(a, "." + c)
        }
        return n
    };
    function Ke(e) {
        return {
            found: !0,
            width: e[0],
            height: e[1],
            icon: {
                tag: "path",
                attributes: {
                    fill: "currentColor",
                    d: e.slice(4)[0]
                }
            }
        }
    }
    var Ye = !1;
    function Ge() {
        S.autoAddCss && (Ye || I(Xe()),
        Ye = !0)
    }
    function Qe(e, t) {
        return Object.defineProperty(e, "abstract", {
            get: t
        }),
        Object.defineProperty(e, "html", {
            get: function() {
                return e.abstract.map(function(e) {
                    return ge(e)
                })
            }
        }),
        Object.defineProperty(e, "node", {
            get: function() {
                if (u) {
                    var t = l.createElement("div");
                    return t.innerHTML = e.html,
                    t.children
                }
            }
        }),
        e
    }
    function Ze(e) {
        var t = e.prefix
          , c = void 0 === t ? "fa" : t
          , n = e.iconName;
        if (n)
            return ze(et.definitions, c, n) || ze(D.styles, c, n)
    }
    var Je, et = new (function() {
        function e() {
            L(this, e),
            this.definitions = {}
        }
        return x(e, [{
            key: "add",
            value: function() {
                for (var e = this, t = arguments.length, c = Array(t), n = 0; n < t; n++)
                    c[n] = arguments[n];
                var i = c.reduce(this._pullDefinitions, {});
                Object.keys(i).forEach(function(t) {
                    e.definitions[t] = w({}, e.definitions[t] || {}, i[t]),
                    function e(t, c) {
                        var n = Object.keys(c).reduce(function(e, t) {
                            var n = c[t];
                            return n.icon ? e[n.iconName] = n.icon : e[t] = n,
                            e
                        }, {});
                        "function" == typeof D.hooks.addPack ? D.hooks.addPack(t, n) : D.styles[t] = w({}, D.styles[t] || {}, n),
                        "fas" === t && e("fa", c)
                    }(t, i[t])
                })
            }
        }, {
            key: "reset",
            value: function() {
                this.definitions = {}
            }
        }, {
            key: "_pullDefinitions",
            value: function(e, t) {
                var c = t.prefix && t.iconName && t.icon ? {
                    0: t
                } : t;
                return Object.keys(c).map(function(t) {
                    var n = c[t]
                      , i = n.prefix
                      , a = n.iconName
                      , r = n.icon;
                    e[i] || (e[i] = {}),
                    e[i][a] = r
                }),
                e
            }
        }]),
        e
    }()), tt = (Je = function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
          , c = t.transform
          , n = void 0 === c ? O : c
          , i = t.symbol
          , a = void 0 !== i && i
          , r = t.mask
          , s = void 0 === r ? null : r
          , l = t.title
          , o = void 0 === l ? null : l
          , h = t.classes
          , v = void 0 === h ? [] : h
          , u = t.attributes
          , d = void 0 === u ? {} : u
          , m = t.styles
          , f = void 0 === m ? {} : m;
        if (e) {
            var p = e.prefix
              , z = e.iconName
              , g = e.icon;
            return Qe(w({
                type: "icon"
            }, e), function() {
                return Ge(),
                S.autoA11y && (o ? d["aria-labelledby"] = S.replacementClass + "-title-" + R() : d["aria-hidden"] = "true"),
                ee({
                    icons: {
                        main: Ke(g),
                        mask: s ? Ke(s.icon) : {
                            found: !1,
                            width: null,
                            height: null,
                            icon: {}
                        }
                    },
                    prefix: p,
                    iconName: z,
                    transform: w({}, O, n),
                    symbol: a,
                    title: o,
                    extra: {
                        attributes: d,
                        styles: f,
                        classes: v
                    }
                })
            })
        }
    }
    ,
    function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
          , c = (e || {}).icon ? e : Ze(e || {})
          , n = t.mask;
        return n && (n = (n || {}).icon ? n : Ze(n || {})),
        Je(c, w({}, t, {
            mask: n
        }))
    }
    ), ct = {
        noAuto: function() {
            A({
                autoReplaceSvg: !1,
                observeMutations: !1
            })
        },
        dom: {
            i2svg: function() {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                if (u) {
                    Ge();
                    var t = e.node
                      , c = void 0 === t ? l : t
                      , n = e.callback
                      , i = void 0 === n ? function() {}
                    : n;
                    S.searchPseudoElements && Be(c),
                    Ue(c, i)
                }
            },
            css: Xe,
            insertCss: function() {
                I(Xe())
            }
        },
        library: et,
        parse: {
            transform: function(e) {
                return xe(e)
            }
        },
        findIconDefinition: Ze,
        icon: tt,
        text: function(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
              , c = t.transform
              , n = void 0 === c ? O : c
              , i = t.title
              , a = void 0 === i ? null : i
              , r = t.classes
              , s = void 0 === r ? [] : r
              , l = t.attributes
              , o = void 0 === l ? {} : l
              , h = t.styles
              , v = void 0 === h ? {} : h;
            return Qe({
                type: "text",
                content: e
            }, function() {
                return Ge(),
                te({
                    content: e,
                    transform: w({}, O, n),
                    title: a,
                    extra: {
                        attributes: o,
                        styles: v,
                        classes: [S.familyPrefix + "-layers-text"].concat(k(s))
                    }
                })
            })
        },
        layer: function(e) {
            return Qe({
                type: "layer"
            }, function() {
                Ge();
                var t = [];
                return e(function(e) {
                    t = Array.isArray(e) ? e.map(function(e) {
                        t = t.concat(e.abstract)
                    }) : t.concat(e.abstract)
                }),
                [{
                    tag: "span",
                    attributes: {
                        class: S.familyPrefix + "-layers"
                    },
                    children: t
                }]
            })
        }
    }, nt = function() {
        u && S.autoReplaceSvg && ct.dom.i2svg({
            node: l
        })
    };
    Object.defineProperty(ct, "config", {
        get: function() {
            return S
        },
        set: function(e) {
            A(e)
        }
    }),
    function(e) {
        try {
            !function() {
                v && (s.FontAwesome || (s.FontAwesome = ct),
                e = function() {
                    Object.keys(D.styles).length > 0 && nt(),
                    S.observeMutations && "function" == typeof MutationObserver && function(e) {
                        if (o) {
                            var t = e.treeCallback
                              , c = e.nodeCallback
                              , n = e.pseudoElementsCallback
                              , i = new o(function(e) {
                                be || F(e).forEach(function(e) {
                                    if ("childList" === e.type && e.addedNodes.length > 0 && !Ce(e.addedNodes[0]) && (S.searchPseudoElements && n(e.target),
                                    t(e.target)),
                                    "attributes" === e.type && e.target.parentNode && S.searchPseudoElements && n(e.target.parentNode),
                                    "attributes" === e.type && Ce(e.target) && ~b.indexOf(e.attributeName))
                                        if ("class" === e.attributeName) {
                                            var i = pe(B(e.target))
                                              , a = i.prefix
                                              , r = i.iconName;
                                            a && e.target.setAttribute("data-prefix", a),
                                            r && e.target.setAttribute("data-icon", r)
                                        } else
                                            c(e.target)
                                })
                            }
                            );
                            u && i.observe(l.getElementsByTagName("body")[0], {
                                childList: !0,
                                attributes: !0,
                                characterData: !0,
                                subtree: !0
                            })
                        }
                    }({
                        treeCallback: Ue,
                        nodeCallback: We,
                        pseudoElementsCallback: Be
                    })
                }
                ,
                u && (N ? setTimeout(e, 0) : P.push(e))),
                D.hooks = w({}, D.hooks, {
                    addPack: function(e, t) {
                        D.styles[e] = w({}, D.styles[e] || {}, t),
                        de(),
                        nt()
                    },
                    addShims: function(e) {
                        var t;
                        (t = D.shims).push.apply(t, k(e)),
                        de(),
                        nt()
                    }
                });
                var e
            }()
        } catch (e) {
            if (!C)
                throw e
        }
    }(function() {
        v && (s.FontAwesome || (s.FontAwesome = ct),
        e = function() {
            Object.keys(D.styles).length > 0 && nt(),
            S.observeMutations && "function" == typeof MutationObserver && function(e) {
                if (o) {
                    var t = e.treeCallback
                      , c = e.nodeCallback
                      , n = e.pseudoElementsCallback
                      , i = new o(function(e) {
                        be || F(e).forEach(function(e) {
                            if ("childList" === e.type && e.addedNodes.length > 0 && !Ce(e.addedNodes[0]) && (S.searchPseudoElements && n(e.target),
                            t(e.target)),
                            "attributes" === e.type && e.target.parentNode && S.searchPseudoElements && n(e.target.parentNode),
                            "attributes" === e.type && Ce(e.target) && ~b.indexOf(e.attributeName))
                                if ("class" === e.attributeName) {
                                    var i = pe(B(e.target))
                                      , a = i.prefix
                                      , r = i.iconName;
                                    a && e.target.setAttribute("data-prefix", a),
                                    r && e.target.setAttribute("data-icon", r)
                                } else
                                    c(e.target)
                        })
                    }
                    );
                    u && i.observe(l.getElementsByTagName("body")[0], {
                        childList: !0,
                        attributes: !0,
                        characterData: !0,
                        subtree: !0
                    })
                }
            }({
                treeCallback: Ue,
                nodeCallback: We,
                pseudoElementsCallback: Be
            })
        }
        ,
        u && (N ? setTimeout(e, 0) : P.push(e))),
        D.hooks = w({}, D.hooks, {
            addPack: function(e, t) {
                D.styles[e] = w({}, D.styles[e] || {}, t),
                de(),
                nt()
            },
            addShims: function(e) {
                var t;
                (t = D.shims).push.apply(t, k(e)),
                de(),
                nt()
            }
        });
        var e
    })
}(),
function(e) {
    e.fn.ellipsis = function(t) {
        return t = e.extend({
            row: 1,
            onlyFullWords: !1,
            char: "...",
            callback: function() {},
            position: "tail"
        }, t),
        this.each(function() {
            var c = e(this)
              , n = c.text()
              , i = n
              , a = i.length
              , r = c.height();
            c.text("a");
            var s = parseFloat(c.css("lineHeight"), 10)
              , l = c.height()
              , o = (s > l ? s - l : 0) * (t.row - 1) + l * t.row;
            if (r <= o)
                return c.text(n),
                void t.callback.call(this);
            var h = 1
              , v = 0
              , u = n.length;
            if ("tail" === t.position) {
                for (; h < u; )
                    v = Math.ceil((h + u) / 2),
                    c.text(n.slice(0, v) + t.char),
                    c.height() <= o ? h = v : u = v - 1;
                n = n.slice(0, h),
                t.onlyFullWords && (n = n.replace(/[\u00AD\w\uac00-\ud7af]+$/, "")),
                n += t.char
            } else if ("middle" === t.position) {
                for (var d = 0; h < u; )
                    v = Math.ceil((h + u) / 2),
                    d = Math.max(a - v, 0),
                    c.text(i.slice(0, Math.floor((a - d) / 2)) + t.char + i.slice(Math.floor((a + d) / 2), a)),
                    c.height() <= o ? h = v : u = v - 1;
                d = Math.max(a - h, 0);
                var m = i.slice(0, Math.floor((a - d) / 2))
                  , f = i.slice(Math.floor((a + d) / 2), a);
                t.onlyFullWords && (m = m.replace(/[\u00AD\w\uac00-\ud7af]+$/, "")),
                n = m + t.char + f
            }
            c.text(n),
            t.callback.call(this)
        }),
        this
    }
}(jQuery),
function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : e(window.jQuery)
}(function(e) {
    e.fn.numeric = function(t, c) {
        "boolean" == typeof t && (t = {
            decimal: t,
            negative: !0,
            decimalPlaces: -1
        }),
        void 0 === (t = t || {}).negative && (t.negative = !0);
        var n = !1 === t.decimal ? "" : t.decimal || "."
          , i = !0 === t.negative
          , a = void 0 === t.decimalPlaces ? -1 : t.decimalPlaces;
        return c = "function" == typeof c ? c : function() {}
        ,
        this.data("numeric.decimal", n).data("numeric.negative", i).data("numeric.callback", c).data("numeric.decimalPlaces", a).keypress(e.fn.numeric.keypress).keyup(e.fn.numeric.keyup).blur(e.fn.numeric.blur)
    }
    ,
    e.fn.numeric.keypress = function(t) {
        var c = e.data(this, "numeric.decimal")
          , n = e.data(this, "numeric.negative")
          , i = e.data(this, "numeric.decimalPlaces")
          , a = t.charCode ? t.charCode : t.keyCode ? t.keyCode : 0;
        if (13 == a && "input" == this.nodeName.toLowerCase())
            return !0;
        if (13 == a)
            return !1;
        var r = !1;
        if (t.ctrlKey && 97 == a || t.ctrlKey && 65 == a)
            return !0;
        if (t.ctrlKey && 120 == a || t.ctrlKey && 88 == a)
            return !0;
        if (t.ctrlKey && 99 == a || t.ctrlKey && 67 == a)
            return !0;
        if (t.ctrlKey && 122 == a || t.ctrlKey && 90 == a)
            return !0;
        if (t.ctrlKey && 118 == a || t.ctrlKey && 86 == a || t.shiftKey && 45 == a)
            return !0;
        if (a < 48 || a > 57) {
            var s = e(this).val();
            if (0 !== e.inArray("-", s.split("")) && n && 45 == a && (0 === s.length || 0 === parseInt(e.fn.getSelectionStart(this), 10)))
                return !0;
            c && a == c.charCodeAt(0) && -1 != e.inArray(c, s.split("")) && (r = !1),
            8 != a && 9 != a && 13 != a && 35 != a && 36 != a && 37 != a && 39 != a && 46 != a ? r = !1 : void 0 !== t.charCode && (t.keyCode == t.which && 0 !== t.which ? (r = !0,
            46 == t.which && (r = !1)) : 0 !== t.keyCode && 0 === t.charCode && 0 === t.which && (r = !0)),
            c && a == c.charCodeAt(0) && (r = -1 == e.inArray(c, s.split("")))
        } else if (r = !0,
        c && i > 0) {
            var l = e.inArray(c, e(this).val().split(""));
            l >= 0 && e(this).val().length > l + i && (r = !1)
        }
        return r
    }
    ,
    e.fn.numeric.keyup = function(t) {
        var c = e(this).val();
        if (c && c.length > 0) {
            var n = e.fn.getSelectionStart(this)
              , i = e.fn.getSelectionEnd(this)
              , a = e.data(this, "numeric.decimal")
              , r = e.data(this, "numeric.negative")
              , s = e.data(this, "numeric.decimalPlaces");
            if ("" !== a && null !== a)
                0 === (m = e.inArray(a, c.split(""))) && (this.value = "0" + c,
                n++,
                i++),
                1 == m && "-" == c.charAt(0) && (this.value = "-0" + c.substring(1),
                n++,
                i++),
                c = this.value;
            for (var l = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "-", a], o = c.length, h = o - 1; h >= 0; h--) {
                var v = c.charAt(h);
                0 !== h && "-" == v ? c = c.substring(0, h) + c.substring(h + 1) : 0 !== h || r || "-" != v || (c = c.substring(1));
                for (var u = !1, d = 0; d < l.length; d++)
                    if (v == l[d]) {
                        u = !0;
                        break
                    }
                u && " " != v || (c = c.substring(0, h) + c.substring(h + 1))
            }
            var m, f = e.inArray(a, c.split(""));
            if (f > 0)
                for (var p = o - 1; p > f; p--) {
                    c.charAt(p) == a && (c = c.substring(0, p) + c.substring(p + 1))
                }
            if (a && s > 0)
                (m = e.inArray(a, c.split(""))) >= 0 && (c = c.substring(0, m + s + 1),
                i = Math.min(c.length, i));
            this.value = c,
            e.fn.setSelection(this, [n, i])
        }
    }
    ,
    e.fn.numeric.blur = function() {
        var t = e.data(this, "numeric.decimal")
          , c = e.data(this, "numeric.callback")
          , n = e.data(this, "numeric.negative")
          , i = this.value;
        "" !== i && (new RegExp("^" + (n ? "-?" : "") + "\\d+$|^" + (n ? "-?" : "") + "\\d*" + t + "\\d+$").exec(i) || c.apply(this))
    }
    ,
    e.fn.removeNumeric = function() {
        return this.data("numeric.decimal", null).data("numeric.negative", null).data("numeric.callback", null).data("numeric.decimalPlaces", null).unbind("keypress", e.fn.numeric.keypress).unbind("keyup", e.fn.numeric.keyup).unbind("blur", e.fn.numeric.blur)
    }
    ,
    e.fn.getSelectionStart = function(e) {
        if ("number" !== e.type) {
            if (e.createTextRange && document.selection) {
                var t = document.selection.createRange().duplicate();
                return t.moveEnd("character", e.value.length),
                "" == t.text ? e.value.length : Math.max(0, e.value.lastIndexOf(t.text))
            }
            try {
                return e.selectionStart
            } catch (e) {
                return 0
            }
        }
    }
    ,
    e.fn.getSelectionEnd = function(e) {
        if ("number" !== e.type) {
            if (e.createTextRange && document.selection) {
                var t = document.selection.createRange().duplicate();
                return t.moveStart("character", -e.value.length),
                t.text.length
            }
            return e.selectionEnd
        }
    }
    ,
    e.fn.setSelection = function(e, t) {
        if ("number" == typeof t && (t = [t, t]),
        t && t.constructor == Array && 2 == t.length)
            if ("number" === e.type)
                e.focus();
            else if (e.createTextRange) {
                var c = e.createTextRange();
                c.collapse(!0),
                c.moveStart("character", t[0]),
                c.moveEnd("character", t[1] - t[0]),
                c.select()
            } else {
                e.focus();
                try {
                    e.setSelectionRange && e.setSelectionRange(t[0], t[1])
                } catch (e) {}
            }
    }
}),
function() {
    var e, t, c, n, i, a, r, s, l, o, h, v, u, d, m, f, p, z, g, M, C, y, H, b, V = [].slice, L = [].indexOf || function(e) {
        for (var t = 0, c = this.length; c > t; t++)
            if (t in this && this[t] === e)
                return t;
        return -1
    }
    ;
    (e = window.jQuery || window.Zepto || window.$).payment = {},
    e.payment.fn = {},
    e.fn.payment = function() {
        var t, c;
        return c = arguments[0],
        t = 2 <= arguments.length ? V.call(arguments, 1) : [],
        e.payment.fn[c].apply(this, t)
    }
    ,
    i = /(\d{1,4})/g,
    e.payment.cards = n = [{
        type: "maestro",
        patterns: [5018, 502, 503, 506, 56, 58, 639, 6220, 67],
        format: i,
        length: [12, 13, 14, 15, 16, 17, 18, 19],
        cvcLength: [3],
        luhn: !0
    }, {
        type: "forbrugsforeningen",
        patterns: [600],
        format: i,
        length: [16],
        cvcLength: [3],
        luhn: !0
    }, {
        type: "dankort",
        patterns: [5019],
        format: i,
        length: [16],
        cvcLength: [3],
        luhn: !0
    }, {
        type: "visa",
        patterns: [4],
        format: i,
        length: [13, 16],
        cvcLength: [3],
        luhn: !0
    }, {
        type: "mastercard",
        patterns: [51, 52, 53, 54, 55, 22, 23, 24, 25, 26, 27],
        format: i,
        length: [16],
        cvcLength: [3],
        luhn: !0
    }, {
        type: "amex",
        patterns: [34, 37],
        format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
        length: [15],
        cvcLength: [3, 4],
        luhn: !0
    }, {
        type: "dinersclub",
        patterns: [30, 36, 38, 39],
        format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
        length: [14],
        cvcLength: [3],
        luhn: !0
    }, {
        type: "discover",
        patterns: [60, 64, 65, 622],
        format: i,
        length: [16],
        cvcLength: [3],
        luhn: !0
    }, {
        type: "unionpay",
        patterns: [62, 88],
        format: i,
        length: [16, 17, 18, 19],
        cvcLength: [3],
        luhn: !1
    }, {
        type: "jcb",
        patterns: [35],
        format: i,
        length: [16],
        cvcLength: [3],
        luhn: !0
    }],
    t = function(e) {
        var t, c, i, a, r, s, l;
        for (e = (e + "").replace(/\D/g, ""),
        i = 0,
        r = n.length; r > i; i++)
            for (a = 0,
            s = (l = (t = n[i]).patterns).length; s > a; a++)
                if (c = l[a] + "",
                e.substr(0, c.length) === c)
                    return t
    }
    ,
    c = function(e) {
        var t, c, i;
        for (c = 0,
        i = n.length; i > c; c++)
            if ((t = n[c]).type === e)
                return t
    }
    ,
    u = function(e) {
        var t, c, n, i, a, r;
        for (n = !0,
        i = 0,
        a = 0,
        r = (c = (e + "").split("").reverse()).length; r > a; a++)
            t = c[a],
            t = parseInt(t, 10),
            (n = !n) && (t *= 2),
            t > 9 && (t -= 9),
            i += t;
        return i % 10 == 0
    }
    ,
    v = function(e) {
        var t;
        return null != e.prop("selectionStart") && e.prop("selectionStart") !== e.prop("selectionEnd") || !(null == ("undefined" != typeof document && null !== document && null != (t = document.selection) ? t.createRange : void 0) || !document.selection.createRange().text)
    }
    ,
    H = function(e, t) {
        var c, n, i, a, r;
        try {
            n = t.prop("selectionStart")
        } catch (e) {
            e,
            n = null
        }
        return a = t.val(),
        t.val(e),
        null !== n && t.is(":focus") ? (n === a.length && (n = e.length),
        a !== e && (r = a.slice(n - 1, +n + 1 || 9e9),
        c = e.slice(n - 1, +n + 1 || 9e9),
        i = e[n],
        /\d/.test(i) && r === i + " " && c === " " + i && (n += 1)),
        t.prop("selectionStart", n),
        t.prop("selectionEnd", n)) : void 0
    }
    ,
    z = function(e) {
        var t, c, n, i, a, r;
        for (null == e && (e = ""),
        "０１２３４５６７８９",
        "0123456789",
        i = "",
        a = 0,
        r = (t = e.split("")).length; r > a; a++)
            c = t[a],
            (n = "０１２３４５６７８９".indexOf(c)) > -1 && (c = "0123456789"[n]),
            i += c;
        return i
    }
    ,
    p = function(t) {
        var c;
        return c = e(t.currentTarget),
        setTimeout(function() {
            var e;
            return e = c.val(),
            e = (e = z(e)).replace(/\D/g, ""),
            H(e, c)
        })
    }
    ,
    m = function(t) {
        var c;
        return c = e(t.currentTarget),
        setTimeout(function() {
            var t;
            return t = c.val(),
            t = z(t),
            t = e.payment.formatCardNumber(t),
            H(t, c)
        })
    }
    ,
    s = function(c) {
        var n, i, a, r, s, l, o;
        return a = String.fromCharCode(c.which),
        !/^\d+$/.test(a) || (n = e(c.currentTarget),
        o = n.val(),
        i = t(o + a),
        r = (o.replace(/\D/g, "") + a).length,
        l = 16,
        i && (l = i.length[i.length.length - 1]),
        r >= l || null != n.prop("selectionStart") && n.prop("selectionStart") !== o.length) ? void 0 : (s = i && "amex" === i.type ? /^(\d{4}|\d{4}\s\d{6})$/ : /(?:^|\s)(\d{4})$/).test(o) ? (c.preventDefault(),
        setTimeout(function() {
            return n.val(o + " " + a)
        })) : s.test(o + a) ? (c.preventDefault(),
        setTimeout(function() {
            return n.val(o + a + " ")
        })) : void 0
    }
    ,
    a = function(t) {
        var c, n;
        return c = e(t.currentTarget),
        n = c.val(),
        8 !== t.which || null != c.prop("selectionStart") && c.prop("selectionStart") !== n.length ? void 0 : /\d\s$/.test(n) ? (t.preventDefault(),
        setTimeout(function() {
            return c.val(n.replace(/\d\s$/, ""))
        })) : /\s\d?$/.test(n) ? (t.preventDefault(),
        setTimeout(function() {
            return c.val(n.replace(/\d$/, ""))
        })) : void 0
    }
    ,
    f = function(t) {
        var c;
        return c = e(t.currentTarget),
        setTimeout(function() {
            var t;
            return t = c.val(),
            t = z(t),
            t = e.payment.formatExpiry(t),
            H(t, c)
        })
    }
    ,
    l = function(t) {
        var c, n, i;
        return n = String.fromCharCode(t.which),
        /^\d+$/.test(n) ? (c = e(t.currentTarget),
        i = c.val() + n,
        /^\d$/.test(i) && "0" !== i && "1" !== i ? (t.preventDefault(),
        setTimeout(function() {
            return c.val("0" + i + " / ")
        })) : /^\d\d$/.test(i) ? (t.preventDefault(),
        setTimeout(function() {
            var e, t;
            return e = parseInt(i[0], 10),
            (t = parseInt(i[1], 10)) > 2 && 0 !== e ? c.val("0" + e + " / " + t) : c.val(i + " / ")
        })) : void 0) : void 0
    }
    ,
    o = function(t) {
        var c, n, i;
        return n = String.fromCharCode(t.which),
        /^\d+$/.test(n) ? (i = (c = e(t.currentTarget)).val(),
        /^\d\d$/.test(i) ? c.val(i + " / ") : void 0) : void 0
    }
    ,
    h = function(t) {
        var c, n, i;
        return "/" === (i = String.fromCharCode(t.which)) || " " === i ? (n = (c = e(t.currentTarget)).val(),
        /^\d$/.test(n) && "0" !== n ? c.val("0" + n + " / ") : void 0) : void 0
    }
    ,
    r = function(t) {
        var c, n;
        return c = e(t.currentTarget),
        n = c.val(),
        8 !== t.which || null != c.prop("selectionStart") && c.prop("selectionStart") !== n.length ? void 0 : /\d\s\/\s$/.test(n) ? (t.preventDefault(),
        setTimeout(function() {
            return c.val(n.replace(/\d\s\/\s$/, ""))
        })) : void 0
    }
    ,
    d = function(t) {
        var c;
        return c = e(t.currentTarget),
        setTimeout(function() {
            var e;
            return e = c.val(),
            e = (e = z(e)).replace(/\D/g, "").slice(0, 4),
            H(e, c)
        })
    }
    ,
    y = function(e) {
        var t;
        return !(!e.metaKey && !e.ctrlKey) || 32 !== e.which && (0 === e.which || (e.which < 33 || (t = String.fromCharCode(e.which),
        !!/[\d\s]/.test(t))))
    }
    ,
    M = function(c) {
        var n, i, a, r;
        return n = e(c.currentTarget),
        a = String.fromCharCode(c.which),
        /^\d+$/.test(a) && !v(n) ? (r = (n.val() + a).replace(/\D/g, ""),
        (i = t(r)) ? r.length <= i.length[i.length.length - 1] : r.length <= 16) : void 0
    }
    ,
    C = function(t) {
        var c, n;
        return c = e(t.currentTarget),
        n = String.fromCharCode(t.which),
        /^\d+$/.test(n) && !v(c) ? !((c.val() + n).replace(/\D/g, "").length > 6) && void 0 : void 0
    }
    ,
    g = function(t) {
        var c, n;
        return c = e(t.currentTarget),
        n = String.fromCharCode(t.which),
        /^\d+$/.test(n) && !v(c) ? (c.val() + n).length <= 4 : void 0
    }
    ,
    b = function(t) {
        var c, i, a, r, s;
        return s = (c = e(t.currentTarget)).val(),
        r = e.payment.cardType(s) || "unknown",
        c.hasClass(r) ? void 0 : (i = function() {
            var e, t, c;
            for (c = [],
            e = 0,
            t = n.length; t > e; e++)
                a = n[e],
                c.push(a.type);
            return c
        }(),
        c.removeClass("unknown"),
        c.removeClass(i.join(" ")),
        c.addClass(r),
        c.toggleClass("identified", "unknown" !== r),
        c.trigger("payment.cardType", r))
    }
    ,
    e.payment.fn.formatCardCVC = function() {
        return this.on("keypress", y),
        this.on("keypress", g),
        this.on("paste", d),
        this.on("change", d),
        this.on("input", d),
        this
    }
    ,
    e.payment.fn.formatCardExpiry = function() {
        return this.on("keypress", y),
        this.on("keypress", C),
        this.on("keypress", l),
        this.on("keypress", h),
        this.on("keypress", o),
        this.on("keydown", r),
        this.on("change", f),
        this.on("input", f),
        this
    }
    ,
    e.payment.fn.formatCardNumber = function() {
        return this.on("keypress", y),
        this.on("keypress", M),
        this.on("keypress", s),
        this.on("keydown", a),
        this.on("keyup", b),
        this.on("paste", m),
        this.on("change", m),
        this.on("input", m),
        this.on("input", b),
        this
    }
    ,
    e.payment.fn.restrictNumeric = function() {
        return this.on("keypress", y),
        this.on("paste", p),
        this.on("change", p),
        this.on("input", p),
        this
    }
    ,
    e.payment.fn.cardExpiryVal = function() {
        return e.payment.cardExpiryVal(e(this).val())
    }
    ,
    e.payment.cardExpiryVal = function(e) {
        var t, c, n;
        return t = (n = e.split(/[\s\/]+/, 2))[0],
        2 === (null != (c = n[1]) ? c.length : void 0) && /^\d+$/.test(c) && (c = (new Date).getFullYear().toString().slice(0, 2) + c),
        {
            month: t = parseInt(t, 10),
            year: c = parseInt(c, 10)
        }
    }
    ,
    e.payment.validateCardNumber = function(e) {
        var c, n;
        return e = (e + "").replace(/\s+|-/g, ""),
        !!/^\d+$/.test(e) && (!!(c = t(e)) && (n = e.length,
        L.call(c.length, n) >= 0 && (!1 === c.luhn || u(e))))
    }
    ,
    e.payment.validateCardExpiry = function(t, c) {
        var n, i, a;
        return "object" == typeof t && "month"in t && (t = (a = t).month,
        c = a.year),
        !(!t || !c) && (t = e.trim(t),
        c = e.trim(c),
        !!(/^\d+$/.test(t) && /^\d+$/.test(c) && t >= 1 && 12 >= t) && (2 === c.length && (c = 70 > c ? "20" + c : "19" + c),
        4 === c.length && (i = new Date(c,t),
        n = new Date,
        i.setMonth(i.getMonth() - 1),
        i.setMonth(i.getMonth() + 1, 1),
        i > n)))
    }
    ,
    e.payment.validateCardCVC = function(t, n) {
        var i, a;
        return t = e.trim(t),
        !!/^\d+$/.test(t) && (null != (i = c(n)) ? (a = t.length,
        L.call(i.cvcLength, a) >= 0) : t.length >= 3 && t.length <= 4)
    }
    ,
    e.payment.cardType = function(e) {
        var c;
        return e && (null != (c = t(e)) ? c.type : void 0) || null
    }
    ,
    e.payment.formatCardNumber = function(c) {
        var n, i, a, r;
        return c = c.replace(/\D/g, ""),
        (n = t(c)) ? (a = n.length[n.length.length - 1],
        c = c.slice(0, a),
        n.format.global ? null != (r = c.match(n.format)) ? r.join(" ") : void 0 : null != (i = n.format.exec(c)) ? (i.shift(),
        (i = e.grep(i, function(e) {
            return e
        })).join(" ")) : void 0) : c
    }
    ,
    e.payment.formatExpiry = function(e) {
        var t, c, n, i;
        return (c = e.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/)) ? (t = c[1] || "",
        n = c[2] || "",
        (i = c[3] || "").length > 0 ? n = " / " : " /" === n ? (t = t.substring(0, 1),
        n = "") : 2 === t.length || n.length > 0 ? n = " / " : 1 === t.length && "0" !== t && "1" !== t && (t = "0" + t,
        n = " / "),
        t + n + i) : ""
    }
}
.call(this),
function() {
    var e = [].indexOf || function(e) {
        for (var t = 0, c = this.length; t < c; t++)
            if (t in this && this[t] === e)
                return t;
        return -1
    }
    ;
    !function(e, t) {
        "undefined" != typeof module && null !== module ? module.exports = t() : "function" == typeof define && "object" == typeof define.amd ? define("payform", t) : this.payform = t()
    }(0, function() {
        var t, c, n, i, a, r, s, l, o, h, v, u, d, m, f, p, z, g, M, C, y, H, b;
        return c = function(e) {
            var t, c, n;
            return null != e.selectionStart ? e.selectionStart : null != document.selection ? (e.focus(),
            t = document.selection.createRange(),
            c = (n = e.createTextRange()).duplicate(),
            n.moveToBookmark(t.getBookmark()),
            c.setEndPoint("EndToStart", n),
            c.text.length) : void 0
        }
        ,
        t = function(e) {
            return function(t) {
                return null == t && (t = window.event),
                t.target = t.target || t.srcElement,
                t.which = t.which || t.keyCode,
                null == t.preventDefault && (t.preventDefault = function() {
                    return this.returnValue = !1
                }
                ),
                e(t)
            }
        }
        ,
        n = function(e, c, n) {
            return n = t(n),
            null != e.addEventListener ? e.addEventListener(c, n, !1) : e.attachEvent("on" + c, n)
        }
        ,
        (f = {}).cards = [{
            type: "visaelectron",
            pattern: /^4(026|17500|405|508|844|91[37])/,
            format: r = /(\d{1,4})/g,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "maestro",
            pattern: /^(5(018|0[23]|[68])|6(39|7))/,
            format: r,
            length: [12, 13, 14, 15, 16, 17, 18, 19],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "forbrugsforeningen",
            pattern: /^600/,
            format: r,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "dankort",
            pattern: /^5019/,
            format: r,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "visa",
            pattern: /^4/,
            format: r,
            length: [13, 16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "mastercard",
            pattern: /^(5[1-5]|2[2-7])/,
            format: r,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "amex",
            pattern: /^3[47]/,
            format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
            length: [15],
            cvcLength: [3, 4],
            luhn: !0
        }, {
            type: "dinersclub",
            pattern: /^3[0689]/,
            format: /(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,2})?/,
            length: [14],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "discover",
            pattern: /^6([045]|22)/,
            format: r,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }, {
            type: "unionpay",
            pattern: /^(62|88)/,
            format: r,
            length: [16, 17, 18, 19],
            cvcLength: [3],
            luhn: !1
        }, {
            type: "jcb",
            pattern: /^35/,
            format: r,
            length: [16],
            cvcLength: [3],
            luhn: !0
        }],
        i = function(e) {
            var t, c, n, i;
            for (e = (e + "").replace(/\D/g, ""),
            c = 0,
            n = (i = f.cards).length; c < n; c++)
                if ((t = i[c]).pattern.test(e))
                    return t
        }
        ,
        a = function(e) {
            var t, c, n, i;
            for (c = 0,
            n = (i = f.cards).length; c < n; c++)
                if ((t = i[c]).type === e)
                    return t
        }
        ,
        m = function(e) {
            var t, c, n, i, a, r;
            for (a = !0,
            r = 0,
            n = 0,
            i = (c = (e + "").split("").reverse()).length; n < i; n++)
                t = c[n],
                t = parseInt(t, 10),
                (a = !a) && (t *= 2),
                t > 9 && (t -= 9),
                r += t;
            return r % 10 == 0
        }
        ,
        d = function(e) {
            var t;
            return !(null == ("undefined" != typeof document && null !== document && null != (t = document.selection) ? t.createRange : void 0) || !document.selection.createRange().text) || null != e.selectionStart && e.selectionStart !== e.selectionEnd
        }
        ,
        M = function(e) {
            var t, c, n, i, a, r;
            for (null == e && (e = ""),
            "０１２３４５６７８９",
            "0123456789",
            r = "",
            n = 0,
            a = (c = e.split("")).length; n < a; n++)
                t = c[n],
                (i = "０１２３４５６７８９".indexOf(t)) > -1 && (t = "0123456789"[i]),
                r += t;
            return r
        }
        ,
        z = function(e) {
            var t;
            if (t = c(e.target),
            e.target.value = f.formatCardNumber(e.target.value),
            null != t && "change" !== e.type)
                return e.target.setSelectionRange(t, t)
        }
        ,
        h = function(e) {
            var t, n, a, r, s, l, o;
            if (a = String.fromCharCode(e.which),
            /^\d+$/.test(a) && (o = e.target.value,
            t = i(o + a),
            r = (o.replace(/\D/g, "") + a).length,
            l = 16,
            t && (l = t.length[t.length.length - 1]),
            !(r >= l || (n = c(e.target)) && n !== o.length)))
                return (s = t && "amex" === t.type ? /^(\d{4}|\d{4}\s\d{6})$/ : /(?:^|\s)(\d{4})$/).test(o) ? (e.preventDefault(),
                setTimeout(function() {
                    return e.target.value = o + " " + a
                })) : s.test(o + a) ? (e.preventDefault(),
                setTimeout(function() {
                    return e.target.value = o + a + " "
                })) : void 0
        }
        ,
        s = function(e) {
            var t, n;
            if (n = e.target.value,
            8 === e.which && (!(t = c(e.target)) || t === n.length))
                return /\d\s$/.test(n) ? (e.preventDefault(),
                setTimeout(function() {
                    return e.target.value = n.replace(/\d\s$/, "")
                })) : /\s\d?$/.test(n) ? (e.preventDefault(),
                setTimeout(function() {
                    return e.target.value = n.replace(/\d$/, "")
                })) : void 0
        }
        ,
        g = function(e) {
            var t;
            if (t = c(e.target),
            e.target.value = f.formatCardExpiry(e.target.value),
            null != t && "change" !== e.type)
                return e.target.setSelectionRange(t, t)
        }
        ,
        o = function(e) {
            var t, c;
            if (t = String.fromCharCode(e.which),
            /^\d+$/.test(t))
                return c = e.target.value + t,
                /^\d$/.test(c) && "0" !== c && "1" !== c ? (e.preventDefault(),
                setTimeout(function() {
                    return e.target.value = "0" + c + " / "
                })) : /^\d\d$/.test(c) ? (e.preventDefault(),
                setTimeout(function() {
                    return e.target.value = c + " / "
                })) : void 0
        }
        ,
        v = function(e) {
            var t, c;
            if (t = String.fromCharCode(e.which),
            /^\d+$/.test(t))
                return c = e.target.value,
                /^\d\d$/.test(c) ? e.target.value = c + " / " : void 0
        }
        ,
        u = function(e) {
            var t, c;
            if ("/" === (c = String.fromCharCode(e.which)) || " " === c)
                return t = e.target.value,
                /^\d$/.test(t) && "0" !== t ? e.target.value = "0" + t + " / " : void 0
        }
        ,
        l = function(e) {
            var t, n;
            if (n = e.target.value,
            8 === e.which && (!(t = c(e.target)) || t === n.length))
                return /\d\s\/\s$/.test(n) ? (e.preventDefault(),
                setTimeout(function() {
                    return e.target.value = n.replace(/\d\s\/\s$/, "")
                })) : void 0
        }
        ,
        p = function(e) {
            var t;
            if (t = c(e.target),
            e.target.value = M(e.target.value).replace(/\D/g, "").slice(0, 4),
            null != t && "change" !== e.type)
                return e.target.setSelectionRange(t, t)
        }
        ,
        b = function(e) {
            var t;
            if (!(e.metaKey || e.ctrlKey || 0 === e.which || e.which < 33))
                return t = String.fromCharCode(e.which),
                /^\d+$/.test(t) ? void 0 : e.preventDefault()
        }
        ,
        y = function(e) {
            var t, c, n;
            if (c = String.fromCharCode(e.which),
            /^\d+$/.test(c) && !d(e.target))
                return n = (e.target.value + c).replace(/\D/g, ""),
                (t = i(n)) && n.length > t.length[t.length.length - 1] ? e.preventDefault() : n.length > 16 ? e.preventDefault() : void 0
        }
        ,
        H = function(e) {
            var t;
            if (t = String.fromCharCode(e.which),
            /^\d+$/.test(t) && !d(e.target))
                return (e.target.value + t).replace(/\D/g, "").length > 6 ? e.preventDefault() : void 0
        }
        ,
        C = function(e) {
            var t;
            if (t = String.fromCharCode(e.which),
            /^\d+$/.test(t) && !d(e.target))
                return (e.target.value + t).length > 4 ? e.preventDefault() : void 0
        }
        ,
        f.cvcInput = function(e) {
            return n(e, "keypress", b),
            n(e, "keypress", C),
            n(e, "paste", p),
            n(e, "change", p),
            n(e, "input", p)
        }
        ,
        f.expiryInput = function(e) {
            return n(e, "keypress", b),
            n(e, "keypress", H),
            n(e, "keypress", o),
            n(e, "keypress", u),
            n(e, "keypress", v),
            n(e, "keydown", l),
            n(e, "change", g),
            n(e, "input", g)
        }
        ,
        f.cardNumberInput = function(e) {
            return n(e, "keypress", b),
            n(e, "keypress", y),
            n(e, "keypress", h),
            n(e, "keydown", s),
            n(e, "paste", z),
            n(e, "change", z),
            n(e, "input", z)
        }
        ,
        f.numericInput = function(e) {
            return n(e, "keypress", b),
            n(e, "paste", b),
            n(e, "change", b),
            n(e, "input", b)
        }
        ,
        f.parseCardExpiry = function(e) {
            var t, c, n;
            return t = (c = (e = e.replace(/\s/g, "")).split("/", 2))[0],
            2 === (null != (n = c[1]) ? n.length : void 0) && /^\d+$/.test(n) && (n = (new Date).getFullYear().toString().slice(0, 2) + n),
            {
                month: t = parseInt(t, 10),
                year: n = parseInt(n, 10)
            }
        }
        ,
        f.validateCardNumber = function(t) {
            var c, n;
            return t = (t + "").replace(/\s+|-/g, ""),
            !!/^\d+$/.test(t) && (!!(c = i(t)) && (n = t.length,
            e.call(c.length, n) >= 0 && (!1 === c.luhn || m(t))))
        }
        ,
        f.validateCardExpiry = function(e, t) {
            var c, n, i;
            return "object" == typeof e && "month"in e && (e = (i = e).month,
            t = i.year),
            !(!e || !t) && (e = String(e).trim(),
            t = String(t).trim(),
            !!/^\d+$/.test(e) && (!!/^\d+$/.test(t) && (1 <= e && e <= 12 && (2 === t.length && (t = t < 70 ? "20" + t : "19" + t),
            4 === t.length && (n = new Date(t,e),
            c = new Date,
            n.setMonth(n.getMonth() - 1),
            n.setMonth(n.getMonth() + 1, 1),
            n > c)))))
        }
        ,
        f.validateCardCVC = function(t, c) {
            var n, i;
            return t = String(t).trim(),
            !!/^\d+$/.test(t) && (null != (n = a(c)) ? (i = t.length,
            e.call(n.cvcLength, i) >= 0) : t.length >= 3 && t.length <= 4)
        }
        ,
        f.parseCardType = function(e) {
            var t;
            return e && (null != (t = i(e)) ? t.type : void 0) || null
        }
        ,
        f.formatCardNumber = function(e) {
            var t, c, n, a;
            return e = (e = M(e)).replace(/\D/g, ""),
            (t = i(e)) ? (a = t.length[t.length.length - 1],
            e = e.slice(0, a),
            t.format.global ? null != (n = e.match(t.format)) ? n.join(" ") : void 0 : null != (c = t.format.exec(e)) ? (c.shift(),
            (c = c.filter(Boolean)).join(" ")) : void 0) : e
        }
        ,
        f.formatCardExpiry = function(e) {
            var t, c, n, i;
            return (c = (e = M(e)).match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/)) ? (t = c[1] || "",
            n = c[2] || "",
            (i = c[3] || "").length > 0 ? n = " / " : " /" === n ? (t = t.substring(0, 1),
            n = "") : 2 === t.length || n.length > 0 ? n = " / " : 1 === t.length && "0" !== t && "1" !== t && (t = "0" + t,
            n = " / "),
            t + n + i) : ""
        }
        ,
        f
    })
}
.call(this),
function(e, t) {
    "use strict";
    var c = function(e, t) {
        var c = new Image
          , n = e.src || e;
        "data:" !== n.substring(0, 5) && (c.crossOrigin = "Anonymous"),
        c.onload = function() {
            var e = function(e, t) {
                var c = document.createElement("canvas");
                return c.setAttribute("width", e),
                c.setAttribute("height", t),
                c.getContext("2d")
            }(c.width, c.height);
            e.drawImage(c, 0, 0);
            var n = e.getImageData(0, 0, c.width, c.height);
            t && t(n.data)
        }
        ,
        c.src = n
    }
      , n = function(e) {
        return ["rgb(", e, ")"].join("")
    }
      , i = function(e) {
        var t = [];
        for (var c in e)
            t.push(r(c, e[c]));
        return t.sort(function(e, t) {
            return t.count - e.count
        }),
        t
    }
      , a = function(e, t) {
        if (e.length > t)
            return e.slice(0, t);
        for (var c = e.length - 1; t - 1 > c; c++)
            e.push(r("0,0,0", 0));
        return e
    }
      , r = function(e, t) {
        return {
            name: n(e),
            count: t
        }
    }
      , s = {
        colors: function(e, t) {
            var r = (t = t || {}).exclude || []
              , s = t.paletteSize || 10;
            c(e, function(e) {
                for (var c = {}, l = "", o = [], h = 0; h < e.length; h += 4)
                    o[0] = e[h],
                    o[1] = e[h + 1],
                    o[2] = e[h + 2],
                    l = o.join(","),
                    -1 === o.indexOf(void 0) && 0 !== e[h + 3] && -1 === r.indexOf(n(l)) && (c[l] = l in c ? c[l] + 1 : 1);
                if (t.success) {
                    var v = a(i(c), s + 1);
                    t.success({
                        dominant: v[0].name,
                        secondary: v[1].name,
                        palette: v.map(function(e) {
                            return e.name
                        }).slice(1)
                    })
                }
            })
        }
    };
    e.RGBaster = e.RGBaster || s
}(window),
function(e, t, c, n, i) {
    e = e[i] = e[i] || {
        q: [],
        onReady: function(t) {
            e.q.push(t)
        }
    },
    (i = t.createElement(c)).async = 1,
    i.src = n,
    (n = t.getElementsByTagName(c)[0]).parentNode.insertBefore(i, n)
}(window, document, "script", "https://www.datadoghq-browser-agent.com/datadog-rum.js", "DD_RUM"),
function() {
    var e, t = "EpaycoCheckout.require".split("."), c = t[t.length - 1], n = this;
    for (e = 0; e < t.length - 1; e++)
        n = n[t[e]] = n[t[e]] || {};
    void 0 === n[c] && (n[c] = function() {
        var e = {}
          , t = {}
          , c = function(e, t) {
            for (var c, n, i = [], a = 0, r = (c = /^\.\.?(\/|$)/.test(t) ? [e, t].join("/").split("/") : t.split("/")).length; a < r; a++)
                ".." == (n = c[a]) ? i.pop() : "." != n && "" != n && i.push(n);
            return i.join("/")
        }
          , n = function(i) {
            return function(i, a) {
                var r, s, l = c(a, i), o = c(l, "./index");
                if (r = t[l] || t[o])
                    return r;
                if (s = e[l] || e[l = o])
                    return r = {
                        id: l,
                        exports: {}
                    },
                    t[l] = r.exports,
                    s(r.exports, function(e) {
                        return n(e)
                    }, r),
                    t[l] = r.exports;
                throw "module " + i + " not found"
            }(i, "")
        };
        return n.define = function(t) {
            for (var c in t)
                e[c] = t[c]
        }
        ,
        n.modules = e,
        n.cache = t,
        n
    }
    .call())
}(),
EpaycoCheckout.require.define({
    "loader/lib/dom": function(e, t, c) {
        (function() {
            c.exports = {
                addClass: function(e, t) {
                    return e.className += " " + t
                },
                removeClass: function(e, t) {
                    return e.className = e.className.replace(/#{name}/g, "")
                },
                removeNode: function(e) {
                    var t;
                    return null != (t = e.parentNode) ? t.removeChild(e) : void 0
                },
                addEventListener: function(e, t, c) {
                    return null != e.addEventListener ? e.addEventListener(t, c) : null != e.attachEvent ? e.attachEvent("on" + t, c) : "load" === t ? c() : void 0
                },
                $: function(e, t) {
                    var c = t || !1
                      , n = document.querySelectorAll(e);
                    return c ? n : n[0]
                }
            }
        }
        ).call(this)
    }
}),
EpaycoCheckout.require.define({
    "loader/lib/gtm": function(e, t, c) {
        (function() {
            c.exports = {
                event: ({event: e, ecommerce: t, eventCategory: c, eventAction: n, eventLabel: i, eventValue: a, pageName: r})=>{
                    let s = {
                        event: e,
                        ecommerce: t,
                        eventCategory: c,
                        eventAction: n,
                        eventLabel: i,
                        eventValue: a,
                        pageName: r
                    };
                    const l = e=>(Object.keys(e).forEach(t=>{
                        e[t] && "object" == typeof e[t] ? l(e[t]) : void 0 === e[t] && delete e[t]
                    }
                    ),
                    e);
                    s = l(s),
                    console.log(s),
                    dataLayer.push(l(s))
                }
            }
        }
        ).call(this)
    }
}),
EpaycoCheckout.require.define({
    "loader/lib/validators": function(e, t, c) {
        (function() {
            c.exports = {
                iterator: function(e) {
                    var t = [];
                    for (var c in e)
                        if (e.hasOwnProperty(c))
                            try {
                                var n = "remember" == c || "terms" == c || "privacy" == c ? $(e[c]).is(":checked") : $(e[c]).val();
                                if(c=="expiry"){
                                    var tt = n.split("/");
                                    if(tt[1].length < 3){
                                        tt[1] = "20"+tt[1]
                                    }
                                    n=tt[0]+"/"+tt[1]
                                }
                                t.push({
                                    type: c,
                                    value: n,
                                    isValid: this[c](n)
                                })
                            } catch (e) {
                                console.log(c),
                                console.log(e)
                            }
                    return t
                },
                isEmpty: function(e) {
                    return null != e && e.length > 1
                },
                letterCount: function(e) {
                    var t = e.match(/([A-Za-z0-9])\1*/g) || []
                      , c = {}
                      , n = !0;
                    for (var i in t.map(function(e) {
                        return c[e.charAt(0)] = e.length
                    }),
                    c) {
                        if (c.hasOwnProperty(i))
                            c[i] > 4 && (n = !1)
                    }
                    return n
                },
                name: function(e) {
                    const t = e.trim()
                      , c = /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/
                      , n = t.split(" ").slice(0, -1).join(" ")
                      , i = t.split(" ").slice(-1).join(" ");
                    return "" != e && /^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/.test(e) && c.test(n) && c.test(i)
                },
                card: function(e) {
                    var c = $("#the-card-number2-element").val().replace(" ", "");
                    var t = !1;
                    if(this.validateNumber(c)){
                        return true;
                    }
                    return false;
                },
                validateNumber : function (e) {
                    var card_type, length_valid, luhn_valid;
                    if (typeof e === "string") {
                        e = e.replace(/[ -]/g, "");
                    } else if (typeof e === "number") {
                        e = e.toString();
                    } else {
                        e = "";
                    }
                    card_type = this.get_card_type(e);
                    luhn_valid = false;
                    length_valid = false;
                    if (card_type != null) {
                        luhn_valid = this.is_valid_luhn(e);
                        length_valid = this.is_valid_length(e, card_type);
                        return luhn_valid && length_valid;
                    }
                },
                get_card_type : function (number) {
                var accepted_cards,
                card_types;

                card_types = [
                    {
                        name: "amex",
                        pattern: /^3[47]/,
                        valid_length: [15],
                    },
                    {
                        name: "diners_club_carte_blanche",
                        pattern: /^30[0-5]/,
                        valid_length: [14],
                    },
                    {
                        name: "diners_club_international",
                        pattern: /^36/,
                        valid_length: [14],
                    },
                    {
                        name: "laser",
                        pattern: /^(6304|670[69]|6771)/,
                        valid_length: [16, 17, 18, 19],
                    },
                    {
                        name: "visa_electron",
                        pattern: /^(4026|417500|4508|4844|491(3|7))/,
                        valid_length: [16],
                    },
                    {
                        name: "visa",
                        pattern: /^4/,
                        valid_length: [16],
                    },
                    {
                        name: "mastercard",
                        pattern: /^5[1-5]/,
                        valid_length: [16],
                    },
                    {
                        name: "maestro",
                        pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
                        valid_length: [12, 13, 14, 15, 16, 17, 18, 19],
                    },
                ];
                    accepted_cards = [
                        "visa",
                        "mastercard",
                        "maestro",
                        "visa_electron",
                        "amex",
                        "diners_club_carte_blanche",
                        "diners_club_international",
                    ];
                    var card, card_type, i, len, ref;
                    ref = (function () {
                        var j, len, ref, results;
                        results = [];
                        for (j = 0, len = card_types.length; j < len; j++) {
                            card = card_types[j];
                            if ((ref = card.name)) {
                                results.push(card);
                            }
                        }
                        return results;
                    })();
            
                    for (i = 0, len = ref.length; i < len; i++) {
                        card_type = ref[i];
                        if (number.match(card_type.pattern)) {
                            return card_type;
                        }
                    }
                    return null;
                },
                is_valid_luhn : function (number) {
                    var digit, i, len, n, ref, sum;
                    sum = 0;
                    ref = number.split("").reverse();
                    for (n = i = 0, len = ref.length; i < len; n = ++i) {
                        digit = ref[n];
                        digit = +digit;
                        if (n % 2) {
                            digit *= 2;
                            if (digit < 10) {
                                sum += digit;
                            } else {
                                sum += digit - 9;
                            }
                        } else {
                            sum += digit;
                        }
                    }
                    return sum % 10 === 0;
                },
                indexOf :
                [].indexOf ||
                function (item) {
                    for (var i = 0, l = this.length; i < l; i++) {
                        if (i in this && this[i] === item) return i;
                    }
                    return -1;
                },
                is_valid_length : function (number, card_type) {
                    if(number.length >= card_type.valid_length[0]){
                        return true;
                    }
                    return false;
                },
                valid_franchise: function(e) {
                    return !0
                },
                expiry: function(e) {
                    var t = e.split("/");
                    return payform.validateCardExpiry(t[0], t[1])
                },
                cvc: function(e) {
                    return payform.validateCardCVC(e)
                },
                remember: function(e) {
                    return !0
                },
                type: function(e) {
                    return this.isEmpty(e)
                },
                dues: function(e) {
                    return "" != e || ($("select[name=dues-tdc]").addClass("error-input"),
                    !1)
                },
                number: function(e) {
                    return this.isEmpty(e) && this.letterCount(e)
                },
                terms: function(e) {
                    return e
                },
                privacy: function(e) {
                    return e
                }
            }
        }
        ).call(this)
    }
}),
EpaycoCheckout.require.define({
    "loader/lib/util": function(e, t, c) {
        (function() {
            function e(e, t, c) {
                c ? (e.addClass("scaleF"),
                t.addClass("entrab").show(),
                setTimeout(function() {
                    e.removeClass("scaleF").hide(),
                    t.removeClass("entrab")
                }, 550)) : (e.addClass("scaleF-r").show(),
                t.addClass("entrab-r"),
                setTimeout(function() {
                    e.removeClass("scaleF-r"),
                    t.removeClass("entrab-r").hide()
                }, 550))
            }
            var t, n = !1, error = undefined,
            result = undefined,
            base_url = "https://eks-subscription-api-lumen-service.epayco.io/";
            t = EpaycoCheckout.require("loader/lib/validators"),
            c.exports = {
                getUrl: function() {
                    return window.location.origin
                },
                getParameterUrl: function(e, t) {
                    var c = location.search.slice(1)
                      , n = {};
                    return c.replace(/([^=]*)=([^&]*)&*/g, function(e, t, c) {
                        n[t] = c
                    }),
                    n
                },
                pushParameterUrl: function(e) {
                    var t, c, n = [];
                    for (t in e)
                        e.hasOwnProperty(t) && (c = e[t],
                        n.push(t + "=" + c));
                    location.search = n.join("&")
                },
                validation: function(e, c=!0) {
                    var n = $(".main-steps.active")
                      , i = e || n.data("group")
                      , a = $(".step-" + i)
                      , r = {};
                    switch (i) {
                    case "tdc":
                        r = {
                            name: a.find("input[name=name]"),
                            card: a.find("input[name=card-number2]"),
                            cvc: a.find("input[name=cvc]"),
                            expiry: a.find("input[name=expiry]"),
                            valid_franchise: a.find("input[name=valid_franchise]"),
                            dues: a.find("select[name=dues-tdc]"),
                            remember: a.find("input[name=remember]")
                        };
                        break;
                    case "tdc-info":
                        r = {
                            type: a.find("select[name=type]"),
                            number: a.find("input[name=number]"),
                            telephone: a.find("input[name=telephone]"),
                            country: a.find("select[name=country]"),
                            city: a.find("input[name=city]"),
                            address: a.find("input[name=address]"),
                            terms: a.find("input[name=terms]"),
                            privacy: a.find("input[name=privacy]")
                        };
                    }
                    var s = !0
                      , l = t.iterator(r);
                    if (null != l.find(e=>"number" == e.type)) {
                        l.find(e=>"number" == e.type).isValid = validateTypeDoc(l)
                    }
                     for(var o in l){
                            if (!l[o].isValid){
                                s = !1;
                            }
                     }
                    return {
                        status: s,
                        data: l
                    }
                },
                createGuid: function () {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }
                    return (
                        s4() +
                        s4() +
                        "-" +
                        s4() +
                        "-" +
                        s4() +
                        "-" +
                        s4() +
                        "-" +
                        s4() +
                        s4() +
                        s4()
                    );
                },
                encryptE: function(value, userKey) {
                    var key = CryptoJS.enc.Hex.parse(userKey),
                        iv = CryptoJS.enc.Hex.parse(userKey),
                        text = CryptoJS.AES.encrypt(value, key, {
                            iv: iv,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7,
                        });
                    return text.ciphertext.toString(CryptoJS.enc.Base64);
                },
                encrypt: function(text, secret) {
                    if (text && secret !== "undefined") {
                        try {
                            var string = CryptoJS.AES.encrypt(
                                CryptoJS.enc.Utf8.parse(text),
                                secret
                            ).toString();
                            return string.toString();
                        } catch (error) {
                            var string = CryptoJS.AES.encrypt(
                                CryptoJS.enc.Utf8.parse(text),
                                CryptoJS.enc.Utf8.parse(secret).toString()
                            );
                            return string.toString();
                        }
                    } else {
                        console.log("hay algunos valores invalidos");
                        return;
                    }
                },
                createCreditCard: function(payment, key) {
                    var encryptData = []; 
                    for (var i = 0; i < payment.data.length; i++) {
                        //
                        if(payment.data[i].type == "name"){
                            encryptData.push({
                                type: "name",
                                value: util.encrypt(payment.data[i].value, key),
                            });
                        }

                        if(payment.data[i].type == "email"){
                            encryptData.push({
                                type: "email",
                                value: util.encrypt(payment.data[i].value, key),
                            });
                        }
                        
                        if(payment.data[i].type == "card"){
                            let value_ = payment.data[i].value.replace(/ /g, "")
                            encryptData.push({
                                type: "number",
                                value: util.encrypt(value_, key),
                            });
                        }

                        if(payment.data[i].type == "cvc"){
                            encryptData.push({
                                type: "cvc",
                                value: util.encrypt(payment.data[i].value, key),
                            });
                        }

                        if(payment.data[i].type == "expiry"){
                            encryptData.push({
                                type: "date_exp",
                                value: util.encrypt(payment.data[i].value, key),
                            });
                        }

                    }
                    var publicKey = {
                        type: "publicKey",
                        value:$("#p_c").text(),
                    };
                    var session = {
                        type: "session",
                        value: localStorage.getItem("keyUserIndex"),
                    };
                    encryptData.push(publicKey);
                    encryptData.push(session);
                    return encryptData;
                }, 
                createTokenize: function(json,callback){
                    $.ajax({
                        type: "POST",
                        url: base_url + 'token/tokenize',
                        crossDomain: true,
                        dataType: "json",
                        data:{values:json}
                    })
                        .done(function (done) {
                            if ((done.data.status = "created")) {
                                callback(done.data.token, null);
                            } else {
                                callback(null, done.data);
                            }
                        })
                        .fail(function (error) {
                            callback(null, error);
                        });
                }, 
                createTokenEncrypt : function(id, payment, callback){
                    var key;
                    $.ajax({
                        type: "POST",
                        url: base_url + "token/encrypt",
                        crossDomain: true,
                        dataType: "json",
                        data: {
                            public_key: $("#p_c").text(),
                            session: id,
                        },
                    })
                    .done(function (token) {
                        key = token.data.token;
                        var json = JSON.stringify(util.createCreditCard(payment,key));
                        setTimeout(() => {
                        util.createTokenize(json,callback)
                        }, 1000);
                    })
                    .fail(function (error) {
                        callback(null, error);
                    });
                },
                validFranchise: function(e, t, c) {
                    $.post("/fanch", [{
                        name: "type",
                        value: e
                    }, {
                        name: "franch",
                        value: t
                    }, $("input[name=_id]")[0]], function(e) {
                        c(e)
                    })
                },
                screenErrors: function(e) {
                    const card_number_ = document.getElementById('the-card-number2-element');
                    for (var t in e){
                        if(!e[1].isValid){
                            card_number_.className ="card-number2 error-input";
                        }else{
                            card_number_.className ="card-number2";
                        }
                        e.hasOwnProperty(t) && 0 == e[t].isValid && ("cash" == e[t].type ? $(".money-icons").addClass("error-input-ico") : $("[name=" + e[t].type + "]").addClass("error-input"))
                    }

                },
                cleanErrors: function(e) {
                    for (var t in e)
                        e.hasOwnProperty(t) && $("[name=" + e[t].type + "]").removeClass("error-input")
                }
            }
        }
        ).call(this)
    }
});

var dom, util, gtm, bodyEl;
dom = EpaycoCheckout.require("loader/lib/dom"),
util = EpaycoCheckout.require("loader/lib/util"),
gtm = EpaycoCheckout.require("loader/lib/gtm"),
bodyEl = document.body;
let isValid = !0;
function goBack(e, t) {
    util.back(e, t)
}
DD_RUM.onReady(function() {
    DD_RUM.init({
        applicationId: "",
        clientToken: "",
        site: "datadoghq.com",
        service: "movil-checkout",
        version: "2.3.2",
        env: "production",
        sampleRate: 100,
        trackInteractions: !0
    })
});
$(document).ready(function() {
    if ($(".step-davipuntos").hasClass("active")) {
        $("#submit-button-davimixed").show(),
        $(".brand-footer").hide(),
        $(".step-methods").hide(),
        $(".email-container h3").hide(),
        $(".container-acvive-email").css("display", "flex");
        const e = util.getParameterUrl().email;
        if ($(".container-acvive-email").find(".email").text(e),
        $("#amountSlider").val()) {
            const e = JSON.parse($("#data-context").text());
            $("#sliderRange").slider(),
            void 0 !== e.isClientMixed.client.points && "0" !== e.isClientMixed.client.points || ($("#sliderRange").slider("destroy"),
            $(".davipuntos-container").css({
                display: "none"
            }))
        }
        $(".back-button").on("click", function() {
            const e = util.getParameterUrl().transaction
              , t = `${location.origin}${location.pathname}?transaction=${e}`;
            window.location = t
        })
    }
    DD_RUM.onReady(function() {
        DD_RUM.addRumGlobalContext("checkout", {
            type: "mobile",
            transactionId: util.getParameterUrl().transaction,
            lang: util.getParameterUrl().lang,
            commerce: {}
        })
    }),
    idleTimeout()
});


$(".set-lang").on("click", function(e) {
    const es = document.getElementById('data_lang_es');
    const en = document.getElementById('data_lang_en');
    const name_es = document.getElementById('label_name_es');
    const label_card_es = document.getElementById('label_card_es');
    const label_expiry_es = document.getElementById('label_expiry_es');
    const continue_tdc = document.getElementById('continue-tdc');
    if($(e.currentTarget).data("lang") == "es"){
        es.hidden = true;
        en.className = " set-lang pointer l-en";
        name_es.innerHTML = "Nombre";
        label_card_es.innerHTML = "Tarjeta";
        label_expiry_es.innerHTML = "Vence";
        continue_tdc.innerHTML = "Pagar";
    }else{
        en.hidden = true;
        es.className = " set-lang pointer l-es";
        name_es.innerHTML = "Name";
        label_card_es.innerHTML = "Card";
        label_expiry_es.innerHTML = "Expiry";
        continue_tdc.innerHTML = "Pay";
    }
}),


$("#continue-tdc").on("click", function(e) {
    e.preventDefault();
    var t = util.validation(void 0, isValid);
    if (util.cleanErrors(t.data),
    t.status) {
        
        t.data.push({
            isValid : true,
            type : "email",
            value :  document.getElementById('email-container').children[0].innerHTML
        });
        var loading_home = document.getElementById("loading_home");
        loading_home.style.display = "block";
        var c = $("#the-card-number2-element").val().replace(" ", "");
        var sessionId;
        if (localStorage.getItem("keyUserIndex") == undefined || localStorage.getItem("keyUserIndex") == null){
            sessionId = localStorage.setItem(
                "keyUserIndex",
                util.createGuid()
            );
        }
        sessionId = localStorage.getItem("keyUserIndex") ?? util.createGuid();
        var contador = 0;
        contador++;
        var form = document.getElementById('form-action');
        var hiddenInput = document.createElement('input');
        const $checkout_form = $( '#form-action' );
        util.createTokenEncrypt(
            sessionId,
            t,
            function (result, error) {
                if (result) {
                    $checkout_form.find('input[name=card-number2]').remove();
                    $checkout_form.find('input[name=expiry]').remove();
                    $checkout_form.find('input[name=cvc]').remove();
                    hiddenInput.setAttribute('type', 'hidden');
                    hiddenInput.setAttribute('name', 'epaycoToken');
                    hiddenInput.setAttribute('value', result);
                    form.appendChild(hiddenInput);
                    form.submit();
                } else {
                    loading_home.style.display='none';
                    if(error.responseJSON != undefined){
                        if(!error.responseJSON.status){
                            alert(error.responseJSON.data.description)
                        }else{
                            console.error(error)
                        }
                    }else{    
                        alert("No pudimos procesar la transacción, por favor contacte con soporte.")
                    }         
                }
            }
        );
        
        
    } else
        util.screenErrors(t.data)
}),


$("#expiry-input").length && new Cleave("#expiry-input", {
    date: true,
    datePattern: ["m", "Y"]  // Cambiado "y" a "Y" para el año completo
});

var descriptionText = $(".description-cont p");
function whichTransitionEvent() {
    var e, t = document.createElement("fakeelement"), c = {
        transition: "transitionend",
        OTransition: "oTransitionEnd",
        MozTransition: "transitionend",
        WebkitTransition: "webkitTransitionEnd"
    };
    for (e in c)
        if (void 0 !== t.style[e])
            return c[e]
}
function whitchAnimation() {
    var e, t = document.createElement("otherFakeElement"), c = {
        WebkitAnimation: "webkitAnimationEnd",
        OAnimation: "oAnimationEnd",
        msAnimation: "MSAnimationEnd",
        animation: "animationend"
    };
    for (e in c)
        if (void 0 !== t.style[e])
            return c[e]
}
descriptionText.text().length > 60 && descriptionText.text(descriptionText.text().substring(0, 63) + "..."),
$(".language-switch a").on("click", function() {
    $(this).toggleClass("dn")
});
var nameAnimation = whitchAnimation()
  , transitionEvent = whichTransitionEvent();
$("#cancel-t").on("click", function() {
    $(".cancelT-modal").removeClass("dn"),
    setTimeout(function() {
        $(".cancelT-modal").addClass("op")
    }, 10),
    $(".cancelT-modal").on(transitionEvent, function() {
        $(".cancelT-modal").find(".ventana").removeClass("dn").addClass("subeModal"),
        $(".cancelT-modal ").off(transitionEvent)
    }),
    $(".cancelT-modal ").find(".ventana").on(nameAnimation, function() {
        $(this).removeClass("subeModal").off(nameAnimation)
    }),
    $(".cancelT-modal").find(".ventana").on(nameAnimation, function() {
        $(this).removeClass("subeModal").off(nameAnimation)
    })
}),
$("#cancel-d").on("click", function() {
    $(".cancelT-modal").removeClass("dn"),
    setTimeout(function() {
        $(".cancelT-modal").addClass("op")
    }, 10),
    $(".cancelT-modal").on(transitionEvent, function() {
        $(".cancelT-modal").find(".ventana").removeClass("dn").addClass("subeModal"),
        $(".cancelT-modal ").off(transitionEvent)
    }),
    $(".cancelT-modal ").find(".ventana").on(nameAnimation, function() {
        $(this).removeClass("subeModal").off(nameAnimation)
    }),
    $(".cancelT-modal").find(".ventana").on(nameAnimation, function() {
        $(this).removeClass("subeModal").off(nameAnimation)
    })
}),
$("#regresa-t").on("click", function() {
    $(".cancelT-modal ").find(".ventana").addClass("bajaModal").on(nameAnimation, function() {
        $(".cancelT-modal ").removeClass("op"),
        $(this).removeClass("bajaModal").addClass("dn").off(nameAnimation)
    }),
    $(".cancelT-modal ").on(transitionEvent, function() {
        $(".cancelT-modal ").addClass("dn").off(transitionEvent)
    })
}),
$("#cancel-transaction").on("click", function() {
    window.location = urlRedirect;
})

$("#close-invoice").on("click", ()=> {
    window.top.location.replace("https://epayco.co/")
});

function removeDisabledTdc() {
    $("input[name=number]").removeAttr("disabled"),
    $("select[name=type]").removeAttr("disabled"),
    $("input[name=name]").removeAttr("disabled"),
    $("input[name=card]").removeAttr("disabled"),
    $("input[name=expiry]").removeAttr("disabled"),
    $("input[name=cvc]").removeAttr("disabled"),
    $("select[name=dues-tdc]").removeAttr("disabled"),
    $("input[name=remember]").removeAttr("disabled")
}
$("#back-sp").on("click", function() {
    $("#mdl-confirm-sp").find(".ventana").addClass("bajaModal").on(nameAnimation, function() {
        $("#mdl-confirm-sp").removeClass("op"),
        $(this).removeClass("bajaModal").addClass("dn").off(nameAnimation)
    }),
    $("#mdl-confirm-sp").on(transitionEvent, function() {
        $("#mdl-confirm-sp").addClass("dn").off(transitionEvent)
    }),
    goBack()
}),
$("#btn-close-mdl").on("click", function() {
    window.top.location.replace("https://epayco.co/")
}),
$(".close-modal-tdc-message").on("click", function() {
    $(this).hasClass("change-payment-method") && removeDisabledTdc(),
    $(".modal-message-tdc ").find(".ventana").addClass("bajaModal").on(nameAnimation, function() {
        $(".modal-message-tdc ").removeClass("op"),
        $(this).removeClass("bajaModal").addClass("dn").off(nameAnimation)
    }),
    $(".modal-message-tdc ").on(transitionEvent, function() {
        $(".modal-message-tdc ").addClass("dn").off(transitionEvent)
    })
}),
$(document).ready(function() {
    var e = function() {
        var e, t = document.createElement("fakeelement"), c = {
            transition: "transitionend",
            OTransition: "oTransitionEnd",
            MozTransition: "transitionend",
            WebkitTransition: "webkitTransitionEnd"
        };
        for (e in c)
            if (void 0 !== t.style[e])
                return c[e]
    }();
    $(".loading-home").addClass("opn").on(e, function() {
        $(".loading-home").addClass("dn").removeClass("opn").off(e)
    })
});
    const mdlInactivityTime = document.getElementById('mdlInactivityTime')
    const mdlTimeExpired = document.getElementById('mdlTimeExpired')
const INACTIVITY_TIME = 6e4
  , TIMER_EXTEND_SESSION = 45;
  var form = document.getElementById('form-action');
let interval, counter = TIMER_EXTEND_SESSION, urlRedirect = form.action+"&canceled=1";
const idleTimeout = ()=>{
    let e;
    function t() {
        clearTimeout(e),
        e = setTimeout(inactivityTime, INACTIVITY_TIME)
        clearInterval(interval)
        counter = TIMER_EXTEND_SESSION
        mdlInactivityTime.style.display='none';
    }
    null == $("#trx-finish-status").val() && (window.onload = t,
    window.onmousemove = t,
    window.onmousedown = t,
    window.ontouchstart = t,
    window.onclick = t,
    window.onkeypress = t,
    window.addEventListener("scroll", t, !0))
}
  , inactivityTime = ()=>{
      mdlInactivityTime.style.display='flex',
    $("#counterInactivity").text(counter),
    showMdl("mdlInactivityTime"),
    interval = setInterval(counterInactivityTime, 1e3)
}
;
function counterInactivityTime() {
    0 === counter && (resetInterval(),
    closeTimeExpired()),
    counter--,
    $("#counterInactivity").text(counter)
}
function resetInterval() {
    clearInterval(interval),
    hideMdl("mdlInactivityTime"),
    showMdl("mdlTimeExpired"),
    counter = TIMER_EXTEND_SESSION,
    $("#counterInactivity").text(counter)
}
const extendSession = ()=>{
    hideMdl("mdlInactivityTime"),
    clearInterval(interval),
    counter = TIMER_EXTEND_SESSION,
    $("#counterInactivity").text(counter)
}
  , closeTimeExpired = ()=>{
    let e = [];
}
  , showMdl = e=>{
    let t = [`#${e}`, `#${e}Body`];
    addRemoveClass(t, "dn", !1),
    addRemoveClass(t, "op")
}
  , hideMdl = e=>{
    let t = [`#${e}`, `#${e}Body`];
    addRemoveClass(t, "op", !1),
    addRemoveClass(t, "dn")
}
  , addRemoveClass = (e,t,c=!0)=>{
    c ? e.forEach(e=>{
        $(e).addClass(t)
    }
    ) : e.forEach(e=>{
        $(e).removeClass(t)
    }
    )
}
;
$("#btnMdlTimeExpired").click(()=>{
    window.location = urlRedirect;
});