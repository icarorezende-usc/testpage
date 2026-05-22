// 2026-05-22T14:53:11.510Z
(function () {

    /**
     * @param cookieConsent - CookieConsent / Cookiebot object
     * @param node - The node to check
     * @returns - A boolean value of whether or not the node is a Cookiebot node
     */
    function isCookiebotNode(cookieConsent, node) {
        var hasMatch = false;
        if (node.hasAttribute('src')) { // exempt tags from the Cookiebot service
            var url = node.getAttribute('src').toLowerCase();
            if ((url.indexOf(cookieConsent.host) === 0) || (url.indexOf(cookieConsent.CDN) === 0)) {
                hasMatch = true;
            }
        }
        return hasMatch;
    }

    /**
     * @param url - The unresolved URL
     * @returns - A resolved URL
     */
    var resolveURL = function (url) {
        if (url !== '') {
            var a = document.createElementOrig('a');
            a.href = url;
            return a.cloneNode(false).href;
        }
        else {
            return url;
        }
    };

    /**
     * @param s - The string that the hash should be based on
     * @returns - the hashed string
     */
    var hashCode = function (s) {
        if (typeof s === 'undefined') {
            return '';
        }
        var ss = s.replace(/\r\n|\n|\r|\t|\s/g, ''); // remove line breaks, tabs and spaces
        var h = 0;
        var l = ss.length;
        var i = 0;
        if (l > 0) {
            while (i < l) {
                h = (h << 5) - h + ss.charCodeAt(i++) | 0;
            }
        }
        return h;
    };

    /**
     * @param param - The parameter value to search for
     * @returns - The parameter value
     */
    var getDomainSearchParam = function (param) {
        var search = window.location.search;
        return typeof search === 'string' ? new URLSearchParams(search).get(param) : null;
    };

    /**
     * @param url - The URL containing the wanted hostname
     * @returns - The hostname
     */
    var getHostnameFromURL = function (url) {
        try {
            var a = document.createElementOrig('a');
            a.href = url;
            return a.cloneNode(false).hostname;
        }
        catch (e) {
            return '';
        }
    };

    /**
     * @param PromiseConstructor - The promise constructor
     * @returns - A promise
     */
    var resolvedPromise = function (PromiseConstructor) {
        return new PromiseConstructor(function (resolve, _) {
            resolve();
        });
    };
    /**
     * @param PromiseConstructor - The promise contructor
     * @param timeoutMs - A timeout defined in miliseconds
     * @returns - A promise which will resolve after a defined amount of miliseconds
     */
    var createTimeoutPromise = function (PromiseConstructor, timeoutMs) {
        return new PromiseConstructor(function (resolve) {
            setTimeout(resolve, timeoutMs);
        });
    };

    /**
     * @param str - String to encode
     * @returns - An encoded string
     */
    /**
     * @param value - The string to be truncated
     * @param length - The length of the string after truncation
     * @returns - A truncated string if it exceeds the length, or the string itself
     */
    var getTruncatedString = function (value, length) {
        if (value.length > length) {
            return value.substring(0, length - 3) + '...';
        }
        else {
            return value;
        }
    };

    var CATEGORY_PREFERENCES = 'preferences';
    var CATEGORY_STATISTICS = 'statistics';
    var CATEGORY_MARKETING = 'marketing';
    /**
     * @param catNumberArray - Array of numbers to be mapped to categories
     * @returns - A string representing cookie categories
     */
    function cookieCategoriesFromNumberArray(catNumberArray) {
        var categoryString = '';
        for (var i = 0; i < catNumberArray.length; i++) {
            if (categoryString !== '') {
                categoryString += ',';
            }
            switch (Number(catNumberArray[i])) {
                case 2:
                    categoryString += CATEGORY_PREFERENCES;
                    break;
                case 3:
                    categoryString += CATEGORY_STATISTICS;
                    break;
                case 4:
                    if ((categoryString === '') || (categoryString.indexOf(CATEGORY_MARKETING) === -1)) {
                        categoryString += CATEGORY_MARKETING;
                    }
                    break;
            }
        }
        if ((categoryString !== '') && (categoryString.slice(-1) === ',')) {
            categoryString = categoryString.substring(0, categoryString.length - 1);
        }
        return categoryString;
    }

    var CATEGORY_ID_PREFERENCES = 2;
    var CATEGORY_ID_STATISTICS = 3;
    var CATEGORY_ID_MARKETING = 4;
    /**
     * @param categoryStrings - Array of category strings to be mapped to ID's
     * @returns - An array of category ID's
     */
    function cookiesNumberCategoriesFromStringArray(categoryStrings) {
        var categoryNumberArray = [];
        for (var i = 0; i < categoryStrings.length; i++) {
            var categoryString = categoryStrings[i];
            switch (categoryString) {
                case CATEGORY_PREFERENCES:
                    categoryNumberArray.push(CATEGORY_ID_PREFERENCES);
                    break;
                case CATEGORY_STATISTICS:
                    categoryNumberArray.push(CATEGORY_ID_STATISTICS);
                    break;
                case CATEGORY_MARKETING:
                    categoryNumberArray.push(CATEGORY_ID_MARKETING);
                    break;
            }
        }
        return categoryNumberArray;
    }

    var hasFramework = function (cookieConsent) {
        return cookieConsent.hasFramework && !cookieConsent.frameworkBlocked && (cookieConsent.framework.toLowerCase() === 'tcfv2.3');
    };

    /**
     * @param cookieConsent - CookieConsent / Cookiebot object
     */
    var loadInlineConfiguration = function (cookieConsent) {
        var _a, _b, _c;
        try {
            var d = document.getElementById('CookiebotConfiguration');
            if (d && (d.tagName.toLowerCase() === 'script') && (d.type && d.type.toLowerCase() === 'application/json')) {
                cookieConsent.inlineConfiguration = JSON.parse(d.innerHTML);
                var hasEnabledFramework = hasFramework(cookieConsent);
                // check validity of Frameworks configuration
                if ((_a = cookieConsent.inlineConfiguration) === null || _a === void 0 ? void 0 : _a.Frameworks) {
                    if (!hasEnabledFramework ||
                        (typeof cookieConsent.inlineConfiguration.Frameworks === 'undefined') ||
                        (typeof cookieConsent.inlineConfiguration.Frameworks.IABTCF2 === 'undefined')) {
                        cookieConsent.inlineConfiguration.Frameworks = undefined;
                    }
                }
                // check validity of TagConfiguration configuration
                if ((_b = cookieConsent.inlineConfiguration) === null || _b === void 0 ? void 0 : _b.TagConfiguration) {
                    if (typeof cookieConsent.inlineConfiguration.TagConfiguration !== 'object' ||
                        cookieConsent.inlineConfiguration.TagConfiguration.length === 0) {
                        cookieConsent.inlineConfiguration.TagConfiguration = undefined;
                    }
                }
                // check validity of Widget configuration
                if ((_c = cookieConsent.inlineConfiguration) === null || _c === void 0 ? void 0 : _c.WidgetConfiguration) {
                    if (typeof cookieConsent.inlineConfiguration.WidgetConfiguration !== 'object' ||
                        // @ts-ignore - TODO: Remove ts-ignore once we have a proper way of mocking the global CookieConsent object
                        cookieConsent.inlineConfiguration.WidgetConfiguration.length === 0) {
                        cookieConsent.inlineConfiguration.WidgetConfiguration = undefined;
                    }
                }
            }
        }
        catch (e) {
            cookieConsent.inlineConfiguration = null;
            console.log("Error in Cookiebot inline configuration section within tag Id 'CookiebotConfiguration'.");
        }
    };

    // Helpers for propagating a customer-supplied CSP nonce to every <script>/<style> element Cookiebot creates at runtime.
    // Per CSP Level 3, a nonce-source carries a base64-value:
    //   base64-value = 1*( ALPHA / DIGIT / "+" / "/" / "-" / "_" ) *2( "=" )
    // Anything outside that grammar (whitespace, quotes, angle brackets, etc.)
    // is rejected — we treat it as if no nonce was supplied rather than
    // propagating untrusted input into the DOM.
    var NONCE_PATTERN = /^[A-Za-z0-9+/_-]+={0,2}$/;
    var sanitizeNonce = function (nonce) {
        if (!nonce)
            return '';
        if (NONCE_PATTERN.test(nonce))
            return nonce;
        console.warn("Cookiebot: nonce value '%s' is not a valid CSP nonce and will be ignored.", nonce);
        return '';
    };
    /**
     * Applies a CSP nonce to a newly created <script> or <style> element so it
     * survives strict nonce-only Content Security Policy. Sets both the IDL
     * `.nonce` property (what modern browsers read for CSP validation;
     * `getAttribute('nonce')` is blanked post-parse) and the `nonce` attribute
     * (for legacy paths and parser-inserted elements).
     *
     * No-op when `nonce` is empty/undefined, so customers without a strict CSP
     * see no observable change.
     */
    var applyNonce = function (element, nonce) {
        if (!nonce)
            return;
        element.nonce = nonce;
        element.setAttribute('nonce', nonce);
    };

    // Adopt or inject a stylesheet at runtime, CSP-safe when supported.
    function supportsConstructedStylesheets(document) {
        return typeof CSSStyleSheet !== 'undefined' &&
            typeof CSSStyleSheet.prototype.replaceSync === 'function' &&
            'adoptedStyleSheets' in document;
    }
    function adoptOrInjectStylesheet(document, css, fallbackId, nonce) {
        if (supportsConstructedStylesheets(document)) {
            var sheet = new CSSStyleSheet();
            sheet.replaceSync(css);
            var doc = document;
            doc.adoptedStyleSheets = doc.adoptedStyleSheets.concat(sheet);
            return;
        }
        var head = document.head || document.getElementsByTagName('head')[0];
        var styleElement = document.createElement('style');
        applyNonce(styleElement, nonce);
        styleElement.setAttribute('type', 'text/css');
        styleElement.id = fallbackId;
        styleElement.appendChild(document.createTextNode(css));
        head.appendChild(styleElement);
    }

    // Runtime-adopted CSS rules required outside the per-tenant banner stylesheet.
    var HIDDEN_IFRAME_CLASS = 'CybotCookiebotHiddenIframe';
    var OFFSCREEN_IFRAME_CLASS = 'CybotCookiebotOffscreenIframe';
    var DATA_DISPLAY_NONE = 'data-cybot-cookiebot-blocked';
    var RUNTIME_STYLESHEET_ID = 'CybotCookiebotRuntimeStyles';
    var RUNTIME_CSS = "\n[".concat(DATA_DISPLAY_NONE, "=\"true\"],\n.").concat(HIDDEN_IFRAME_CLASS, " {\n  display: none !important;\n}\n.").concat(OFFSCREEN_IFRAME_CLASS, " {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  top: -9999px;\n}\n");
    function applyRuntimeStylesheet(document, nonce) {
        adoptOrInjectStylesheet(document, RUNTIME_CSS, RUNTIME_STYLESHEET_ID, nonce);
    }

    function uspapi(command, version, callback) {
        var APIVersion = 1; // Current U.S. Privacy spec version
        var uspData = null;
        var isSuccess = true;
        var uspApplies = true;
        if (window.CookieConsent &&
            (window.CookieConsent.userCountry !== '') &&
            (window.CookieConsent.regulationRegions.ccpa.indexOf(window.CookieConsent.userCountry.toLowerCase()) === -1)) {
            uspApplies = false;
        }
        if (version === APIVersion) {
            if (command === 'getUSPData') { // Generate consent string as defined in https://iabtechlab.com/wp-content/uploads/2019/11/U.S.-Privacy-String-v1.0-IAB-Tech-Lab.pdf
                if (uspApplies) {
                    var uspString = APIVersion.toString(); // Specification version
                    uspString += 'Y'; // Explicit Notice/Opportunity to Opt Out
                    if (window.CookieConsent && window.CookieConsent.hasResponse) {
                        if (window.CookieConsent.consent.marketing) {
                            uspString += 'N'; // "The user has made a choice to opt out of sale." -> No
                        }
                        else {
                            uspString += 'Y'; // "The user has made a choice to opt out of sale." -> Yes
                        }
                    }
                    else {
                        if (window.CookieConsent && !window.CookieConsent.hasResponse && !navigator.globalPrivacyControl) {
                            uspString += 'N'; // User has not yet submitted consent - default to opt-in
                        }
                        else {
                            uspString += 'Y'; // Has user opted-out of the sale of his or personal information, or default opt-out for GPC signal
                        }
                    }
                    uspString += 'Y'; // Publisher is a signatory to the IAB Limited Service Provider Agreement (LSPA)
                    uspData = {
                        version: APIVersion,
                        uspString: uspString
                    };
                }
                else {
                    uspData = {
                        version: APIVersion,
                        uspString: APIVersion.toString() + '---' // signals that CCPA does not apply to the end user
                    };
                }
            }
            else {
                isSuccess = false;
            }
        }
        else {
            isSuccess = false;
        }
        if (callback) {
            callback(uspData, isSuccess);
        }
    }
    function addUspapiLocatorFrame() {
        if (!window.frames.__uspapiLocator) {
            if (document.body) {
                applyRuntimeStylesheet(document, window.CookieConsent && window.CookieConsent.nonce);
                var iframe = document.createElement('iframe');
                iframe.classList.add(HIDDEN_IFRAME_CLASS);
                iframe.name = '__uspapiLocator';
                iframe.tabIndex = -1;
                iframe.setAttribute('role', 'presentation'); // hide iframe from screen readers
                iframe.setAttribute('aria-hidden', 'true'); // hide iframe from screen readers
                iframe.setAttribute('title', 'Blank'); // enable passing of accessablility test
                document.body.appendChild(iframe);
            }
            else {
                // Wait for the body tag to exist
                setTimeout(window.addUspapiLocatorFrame, 5);
            }
        }
    }
    function handleUspapiMessage(event) {
        var data = event && event.data && event.data.__uspapiCall;
        if (data) {
            if (typeof window.__uspapi === 'function') {
                window.__uspapi(data.command, data.version, function (returnValue, success) {
                    var eventSource = event.source;
                    eventSource === null || eventSource === void 0 ? void 0 : eventSource.postMessage({
                        __uspapiReturn: {
                            returnValue: returnValue,
                            success: success,
                            callId: data.callId
                        }
                    }, '*');
                });
            }
        }
    }

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /* eslint-disable */
    /* Amazon Consent Handler Library */
    var acsLib = {
        amznConsent: function () {
            // @ts-expect-error
            var t = function (t) {
                return !(!t || !/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(t)) &&
                    // @ts-expect-error
                    t.split('.').every(function (t) {
                        var e = parseInt(t, 10);
                        return e >= 0 && e <= 255;
                    });
            }, 
            // @ts-expect-error
            e = function (t) { return !isNaN(Date.parse(t)); }, o = {
                COOKIE_NAME: 'amzn_consent',
                COOKIE_TTL_MS: 24192e5,
                COOKIE_PATH: '/',
                COOKIE_SAME_SITE: 'Strict',
                CONSENT_CHANGE_EVENT: 'amznConsentChange',
                CONSENT_STATUS: { GRANTED: 'GRANTED', DENIED: 'DENIED' },
                DEFAULT_VERSION: '1',
                DEFAULT_CONSENT: {
                    geo: { ipAddress: '', countryCode: '' },
                    amazonConsentFormat: { amznAdStorage: 'DENIED', amznUserData: 'DENIED' },
                    gpp: '',
                    tcf: '',
                    timestamp: '',
                    version: '1',
                },
                COUNTRY_CODE_LENGTH: 2,
            };
            var n = /** @class */ (function () {
                function n() {
                    // @ts-expect-error
                    this.defaultVersion = o.DEFAULT_VERSION;
                }
                // @ts-expect-error
                n.prototype.getConsentData = function (t) {
                    var e, o;
                    try {
                        if ('string' == typeof t)
                            e = JSON.parse(t);
                        else {
                            if ('object' != typeof t || null === t)
                                throw new Error('Input must be either a JSON string or an object');
                            e = t;
                        }
                        return (o = this.isValidFormattedOutput(e) ? e : this.formatOutput(e)), this.validateFormattedOutput(o), o;
                    }
                    catch (t) {
                        // @ts-expect-error
                        return console.error('Error in getConsentData:', t.message), null;
                    }
                };
                // @ts-expect-error
                n.prototype.validateInput = function (o) {
                    var _a;
                    var n = o;
                    if (void 0 !== o.version && ('number' != typeof n.version || 1 !== o.version))
                        throw new Error('Invalid version. Must be 1 if provided');
                    if (void 0 !== o.ipAddress && ('string' != typeof n.ipAddress || !t(o.ipAddress)))
                        throw new Error('Invalid IP address');
                    if (void 0 !== o.countryCode && ('string' != typeof n.countryCode || 2 !== ((_a = o.countryCode) === null || _a === void 0 ? void 0 : _a.length)))
                        throw new Error('Invalid country code. Must be a 2-letter code');
                    if (void 0 !== o.enableAdStorage && 'boolean' != typeof n.enableAdStorage)
                        throw new Error('enableAdStorage must be a boolean');
                    if (void 0 !== o.enableUserData && 'boolean' != typeof n.enableUserData)
                        throw new Error('enableUserData must be a boolean');
                    if (void 0 !== o.gpp && 'string' != typeof n.gpp)
                        throw new Error('gpp must be a string');
                    if (void 0 !== o.tcf && 'string' != typeof n.tcf)
                        throw new Error('tcf must be a string');
                    if (o.timestamp && !e(o.timestamp))
                        throw new Error('Invalid timestamp');
                };
                // @ts-expect-error
                n.prototype.formatOutput = function (t) {
                    return (this.validateInput(t),
                        {
                            geo: { ipAddress: t.ipAddress, countryCode: t.countryCode },
                            amazonConsentFormat: {
                                amznAdStorage: t.enableAdStorage ? o.CONSENT_STATUS.GRANTED : o.CONSENT_STATUS.DENIED,
                                amznUserData: t.enableUserData ? o.CONSENT_STATUS.GRANTED : o.CONSENT_STATUS.DENIED,
                            },
                            gpp: t.gpp,
                            tcf: t.tcf,
                            timestamp: t.timestamp || new Date().toISOString(),
                            // @ts-expect-error
                            version: t.version ? t.version.toString() : this.defaultVersion,
                        });
                };
                // @ts-expect-error
                n.prototype.isValidFormattedOutput = function (t) {
                    return ('object' == typeof t &&
                        null !== t &&
                        'geo' in t &&
                        'amazonConsentFormat' in t &&
                        'gpp' in t &&
                        'tcf' in t &&
                        'timestamp' in t &&
                        'version' in t);
                };
                // @ts-expect-error
                n.prototype.validateFormattedOutput = function (n) {
                    var _a, _b, _c, _d, _e;
                    var r = n;
                    if (!n.geo && !n.amazonConsentFormat)
                        throw new Error('Either geo or amazonConsentFormat must be provided');
                    if (void 0 !== ((_a = n.geo) === null || _a === void 0 ? void 0 : _a.ipAddress) && !t((_b = n.geo) === null || _b === void 0 ? void 0 : _b.ipAddress))
                        throw new Error('Invalid IP address in formatted output');
                    if (((_c = n.geo) === null || _c === void 0 ? void 0 : _c.countryCode) && n.geo.countryCode.length !== o.COUNTRY_CODE_LENGTH)
                        throw new Error('Invalid country code in formatted output');
                    if (((_d = n.amazonConsentFormat) === null || _d === void 0 ? void 0 : _d.amznAdStorage) &&
                        ![o.CONSENT_STATUS.GRANTED, o.CONSENT_STATUS.DENIED].includes(n.amazonConsentFormat.amznAdStorage))
                        throw new Error('Invalid amznAdStorage value in formatted output');
                    if (((_e = n.amazonConsentFormat) === null || _e === void 0 ? void 0 : _e.amznUserData) &&
                        ![o.CONSENT_STATUS.GRANTED, o.CONSENT_STATUS.DENIED].includes(n.amazonConsentFormat.amznUserData))
                        throw new Error('Invalid amznUserData value in formatted output');
                    if (void 0 !== n.gpp && 'string' != typeof r.gpp)
                        throw new Error('Invalid gpp in formatted output');
                    if (void 0 !== n.tcf && 'string' != typeof r.tcf)
                        throw new Error('Invalid tcf in formatted output');
                    if (!e(n.timestamp))
                        throw new Error('Invalid timestamp in formatted output');
                    if (n.version !== o.DEFAULT_VERSION)
                        throw new Error('Invalid version in formatted output');
                };
                return n;
            }());
            var r = /** @class */ (function () {
                function r() {
                    // @ts-expect-error
                    (this.cookieName = o.COOKIE_NAME),
                        // @ts-expect-error
                        (this.cookieTtl = o.COOKIE_TTL_MS),
                        // @ts-expect-error
                        (this.COOKIE_CHANGE_EVENT = 'amznConsentChange'),
                        // @ts-expect-error
                        (this.defaultConsent = __assign({}, o.DEFAULT_CONSENT));
                }
                // @ts-expect-error
                r.prototype.dispatchCookieChange = function (t) {
                    var e = new CustomEvent(o.CONSENT_CHANGE_EVENT, { detail: { consent: t } });
                    window.dispatchEvent(e);
                };
                // @ts-expect-error
                r.prototype.setConsentCookie = function (t) {
                    var e = JSON.stringify(t), n = new Date();
                    // @ts-expect-error
                    n.setTime(n.getTime() + this.cookieTtl),
                        // @ts-expect-error
                        (document.cookie = "".concat(this.cookieName, "=").concat(encodeURIComponent(e), "; expires=").concat(n.toUTCString(), "; path=").concat(o.COOKIE_PATH, "; SameSite=").concat(o.COOKIE_SAME_SITE, "; Secure")),
                        this.dispatchCookieChange(t);
                };
                // @ts-expect-error
                r.prototype.isValidConsentCookie = function (t) {
                    return t && 'object' == typeof t && 'amazonConsentFormat' in t && 'version' in t && 'timestamp' in t;
                };
                r.prototype.getConsentCookie = function () {
                    var _this = this;
                    // @ts-expect-error
                    var t = document.cookie.split('; ').find(function (t) { return t.startsWith("".concat(_this.cookieName, "=")); });
                    if (!t)
                        return null;
                    try {
                        var e_1 = decodeURIComponent(t.split('=')[1]), o_1 = JSON.parse(e_1);
                        return this.isValidConsentCookie(o_1) ? o_1 : null;
                    }
                    catch (t) {
                        return console.error('Error parsing consent cookie:', t), null;
                    }
                };
                r.prototype.setDefaultConsent = function () {
                    // @ts-expect-error
                    this.setConsentCookie(this.defaultConsent);
                };
                r.prototype.clearConsentCookie = function () {
                    // @ts-expect-error
                    (document.cookie = "".concat(this.cookieName, "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;")),
                        this.dispatchCookieChange(null);
                };
                return r;
            }());
            var a = /** @class */ (function () {
                function a() {
                    // @ts-expect-error
                    this.data = {};
                }
                // @ts-expect-error
                a.prototype.setIpAddress = function (e) {
                    if ('string' != typeof e)
                        throw new TypeError('IP address must be a string');
                    if (!t(e))
                        throw new Error('Invalid IP address');
                    // @ts-expect-error
                    return (this.data.ipAddress = e), this;
                };
                // @ts-expect-error
                a.prototype.setCountryCode = function (t) {
                    if ('string' != typeof t || 2 !== t.length)
                        throw new TypeError('Country code must be a 2-letter string');
                    // @ts-expect-error
                    return (this.data.countryCode = t), this;
                };
                // @ts-expect-error
                a.prototype.setEnableAdStorage = function (t) {
                    if ('boolean' != typeof t)
                        throw new TypeError('enableAdStorage must be a boolean');
                    // @ts-expect-error
                    return (this.data.enableAdStorage = t), this;
                };
                // @ts-expect-error
                a.prototype.setEnableUserData = function (t) {
                    if ('boolean' != typeof t)
                        throw new TypeError('enableUserData must be a boolean');
                    // @ts-expect-error
                    return (this.data.enableUserData = t), this;
                };
                // @ts-expect-error
                a.prototype.setGpp = function (t) {
                    if ('string' != typeof t)
                        throw new TypeError('GPP must be a string');
                    // @ts-expect-error
                    return (this.data.gpp = t), this;
                };
                // @ts-expect-error
                a.prototype.setTcf = function (t) {
                    if ('string' != typeof t)
                        throw new TypeError('TCF must be a string');
                    // @ts-expect-error
                    return (this.data.tcf = t), this;
                };
                // @ts-expect-error
                a.prototype.setVersion = function (t) {
                    if ('number' != typeof t || 1 !== t)
                        throw new TypeError('Version must be the number 1');
                    // @ts-expect-error
                    return (this.data.version = t), this;
                };
                // @ts-expect-error
                a.prototype.setTimestamp = function (t) {
                    if ('string' != typeof t || isNaN(Date.parse(t)))
                        throw new TypeError('Timestamp must be a valid date string');
                    // @ts-expect-error
                    return (this.data.timestamp = t), this;
                };
                a.prototype.build = function () {
                    var t = new n(), e = new r(), 
                    // @ts-expect-error
                    o = t.getConsentData(this.data);
                    return o && e.setConsentCookie(o), o;
                };
                return a;
            }());
            typeof window < 'u' &&
                (function () {
                    var t = new n(), e = new r();
                    e.getConsentCookie() || e.setDefaultConsent(),
                        // @ts-expect-error
                        (window.amznConsent = function () {
                            var o = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                o[_i] = arguments[_i];
                            }
                            if (0 === o.length)
                                return new a();
                            try {
                                var n_1 = t.getConsentData(o[0]);
                                return n_1 && e.setConsentCookie(n_1), n_1;
                            }
                            catch (t) {
                                // @ts-expect-error
                                return console.error('Error in amznConsent:', t.message), null;
                            }
                        });
                })();
        },
    };

    function setAcs() {
        try {
            acsLib.amznConsent();
        }
        catch (e) {
            console.warn('Cookiebot: Initialization of amznConsent failed');
        }
    }
    function applyAcs(cookieConsent) {
        try {
            window
                // @ts-expect-error setting flags on the amznConsent object
                .amznConsent()
                .setCountryCode(cookieConsent.userCountry)
                .setEnableAdStorage(cookieConsent.consent.marketing)
                .setEnableUserData(cookieConsent.consent.marketing)
                .build();
        }
        catch (e) {
            console.warn('Cookiebot: Submitting amznConsent failed');
        }
    }

    /**
     * @param node - node to be hashed
     */
    function tagString(node) {
        // Computes the string representation of an `HTMLElement`internally used by tagHash
        if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.CDATA_SECTION_NODE) {
            return (node.nodeValue && node.nodeValue.trim()) || '';
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            var attrs = [];
            for (var i = node.attributes.length; i--;) {
                var attr = node.attributes[i];
                if (attr.name !== 'style') {
                    attrs.push(attr.name + '=' + attr.value);
                }
            }
            attrs.sort();
            var children = [];
            for (var j = 0, len = node.childNodes.length; j < len; j++) {
                var childNode = node.childNodes[j];
                var string = tagString(childNode);
                if (string !== '') {
                    children.push(string);
                }
            }
            return node.tagName + ';' + attrs.join(';') + (children.length ? '[' + children.join('|') + ']' : '');
        }
        return '';
    }
    /**
     * @param el - element to be hashed
     */
    function tagHash(el) {
        var str = tagString(el);
        var hash1 = 5381;
        var hash2 = 52711;
        var k = str.length;
        while (k--) {
            var char = str.charCodeAt(k);
            hash1 = (hash1 * 33) ^ char;
            hash2 = (hash2 * 33) ^ char;
        }
        var hash = (hash1 >>> 0) * 4096 + (hash2 >>> 0);
        return hash.toString();
    }

    function isNodeIgnoredFromInlineConfig(cookieConsent, node) {
        var tagConfiguration = cookieConsent.inlineConfiguration && cookieConsent.inlineConfiguration.TagConfiguration;
        var isIgnored = false;
        if (node.id && tagConfiguration && tagConfiguration.length > 0) {
            for (var i = 0; i < tagConfiguration.length; i++) {
                var tag = tagConfiguration[i];
                if ((tag.id === node.id) && tag.ignore) {
                    isIgnored = true;
                    break;
                }
            }
        }
        return isIgnored;
    }

    /**
     * @param window - Global window object
     * @param document - Global document element
     * @param cookieConsent - CookieConsent / Cookiebot object
     */
    function initMutationObserver(window, document, cookieConsent) {
        var originalWrite = document.write.bind(document);
        // overwrite document.write, as content in scripts will be output async in mutationobserver
        var writeOverride = function () {
            var _a, _b;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // skip the write if the parent script is marked to ignore dynamically inserted children
            if (((_b = (_a = document.currentScript) === null || _a === void 0 ? void 0 : _a.dataset) === null || _b === void 0 ? void 0 : _b.cbIgnoreDynamicChildren) === 'true') {
                return originalWrite.apply(void 0, args);
            }
            if (!args[0]) {
                return;
            }
            var node = args[0];
            var lastChild;
            if (document.body) {
                document.body.insertAdjacentHTML('beforeend', node);
                lastChild = document.body.lastChild;
            }
            else {
                document.head.insertAdjacentHTML('beforeend', node);
                lastChild = document.head.lastChild;
            }
            // if document.write inserts script tag, mark it as processed and process it, as scripts are not loaded or executed when inserted with insertAdjacentHTML
            if (lastChild &&
                lastChild.tagName &&
                (lastChild.tagName === 'SCRIPT') &&
                (typeof lastChild.cookieScriptProcessed === 'undefined') &&
                (typeof lastChild.CB_isClone === 'undefined') &&
                (typeof lastChild.consentProcessed === 'undefined') &&
                (typeof lastChild.cookiesProcessed === 'undefined')) {
                lastChild.consentProcessed = '1';
                cookieConsent.RunScriptTags([lastChild]); // call to execute script
            }
        };
        document.write = writeOverride;
        // override eventlisteners
        cookieConsent.overrideEventListeners();
        // Test browser capabilities
        var isMutationBrowser = true;
        if ((typeof MutationObserver !== 'function') && (typeof MutationObserver !== 'object')) { // 'function' on Windows, 'object' on Mac
            isMutationBrowser = false;
        }
        if (isMutationBrowser) {
            // test if browser is IE or EdgeHTML (vs EdgeChromium), as these are not able to handle mutation of script tags with a src-attribute -> fallback to other method
            if (navigator.userAgent.match(/IEMobile|Trident|Edge/i)) {
                isMutationBrowser = false;
            }
        }
        // Angular postpone initialization of app
        if (document && document.documentElement) {
            if (document.documentElement.hasAttribute('ng-app')) {
                cookieConsent.mutationAppName = document.documentElement.getAttribute('ng-app');
                document.documentElement.removeAttribute('ng-app');
            }
            if (document.documentElement.attributes) {
                for (var j = 0; j < document.documentElement.attributes.length; j++) {
                    var attrName = document.documentElement.attributes[j].name;
                    var attrValue = '';
                    if (document.documentElement.attributes[j].value) {
                        attrValue = document.documentElement.attributes[j].value;
                    }
                    cookieConsent.mutationFallbackDocAttributes.push({ name: attrName, value: attrValue });
                }
            }
        }
        if (isMutationBrowser) {
            cookieConsent.mutationObserver = new MutationObserver(cookieConsent.mutationHandler);
            cookieConsent.mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
            // only download configuration file from CDN when needed, right now only needed with auto-block
            cookieConsent.downloadConfiguration();
        }
        else {
            // use less efficient fallback method for old browsers
            if (!window.cookieconsentscriptfallbackpreloaded) {
                window.cookieconsentscriptfallbackpreloaded = true; // prevent performing twice, when script tag is inserted on second run
                cookieConsent.downloadConfiguration();
            }
        }
    }
    /**
     * @param window - Global window object
     * @param cookieConsent - CookieConsent / Cookiebot object
     */
    function stopMutationObserver(window, cookieConsent) {
        if (cookieConsent.mutationObserver != null) {
            window.CookieConsent.processPostPonedMutations();
            window.CookieConsent.dequeueNonAsyncScripts(cookieConsent.nonAsyncMutations);
            cookieConsent.mutationObserver.disconnect();
            cookieConsent.mutationObserver = null;
        }
    }
    /**
     * @param window - Global window object
     * @param document - Global document element
     * @param mutationsList - List of mutation elements
     */
    function mutationHandler(window, document, mutationsList) {
        if (window.CookieConsent) {
            var doPostPoneMutation = true; // postpone mutations during the initial load of configuration.js
            if (window.CookieConsent.configuration.loaded) {
                doPostPoneMutation = false;
                window.CookieConsent.processPostPonedMutations();
            }
            for (var j = 0; j < mutationsList.length; j++) {
                var mutationRecord = mutationsList[j];
                if (mutationRecord.type === 'childList') { // added elements
                    for (var i = 0; i < mutationRecord.addedNodes.length; i++) {
                        var node = mutationRecord.addedNodes[i];
                        var isNodeIgnored = isNodeIgnoredFromInlineConfig(window.CookieConsent, node);
                        // exempt tags that are already marked up for cookie consent
                        if (node.nodeType === 1 &&
                            !node.hasAttribute('data-cookieconsent') &&
                            (typeof node.CB_isClone === 'undefined') &&
                            (typeof node.isCookiebotDynamicTag === 'undefined') &&
                            !isNodeIgnored) {
                            // Check that Cookiebot tag is the first on page (without attribute data-cookieconsent) when using auto-blocker
                            if ((window.CookieConsent.mutationHandlerFirstScript == null) && (node.tagName === 'SCRIPT')) {
                                window.CookieConsent.mutationHandlerFirstScript = node;
                                var scripts = document.getElementsByTagName('script');
                                for (var k = 0; k < scripts.length; k++) {
                                    var currentScript = scripts[k];
                                    if (!currentScript.hasAttribute('data-cookieconsent')) {
                                        if (!window.CookieConsent.isCookiebotNode(currentScript)) {
                                            console.warn('WARNING: The Cookiebot script tag must be the first to load for auto-blocking to work.', currentScript);
                                        }
                                        break;
                                    }
                                }
                            }
                            node.cookiebotTagHash = window.CookieConsent.tagHash(node);
                            if (doPostPoneMutation || (node.tagName === 'SCRIPT')) { // all script tags must be postponed to execute in the correct order
                                window.CookieConsent.postponeMutation(node);
                            }
                            else {
                                window.CookieConsent.processMutation(node, false);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * @param window - Global window object
     * @param cookieConsent - CookieConsent / Cookiebot object
     * @param tagContainer - List of scripts to be run
     */
    function runScriptTags(window, cookieConsent, tagContainer) {
        if (tagContainer.length > 0) {
            var currentTag = tagContainer.shift();
            currentTag.cookiesProcessed = undefined; // reset status to allow change of consent without page refresh
            var tagConsentLevels = [];
            if (currentTag.hasAttribute('data-cookieconsent')) {
                // @ts-ignore
                tagConsentLevels = currentTag.getAttribute('data-cookieconsent').toLowerCase().split(',');
            }
            var canExecute = true;
            for (var j = 0; j < tagConsentLevels.length; j++) {
                var consentReq = tagConsentLevels[j].replace(/^\s*/, '').replace(/\s*$/, '');
                if ((consentReq === 'preferences') && (!window.CookieConsent.consent.preferences)) {
                    canExecute = false;
                }
                if ((consentReq === 'statistics') && (!window.CookieConsent.consent.statistics)) {
                    canExecute = false;
                }
                if ((consentReq === 'marketing') && (!window.CookieConsent.consent.marketing)) {
                    canExecute = false;
                }
            }
            if (canExecute) {
                var tagParent = currentTag.parentNode;
                var nextElement = currentTag.nextElementSibling;
                var tagClone = cookieConsent.cloneScriptTag(currentTag);
                var hasSrc = false;
                if (tagClone.hasAttribute('src')) {
                    hasSrc = true;
                }
                var fireTagOnLoad = (hasSrc && (!tagClone.hasAttribute('nomodule'))); // fallback nomodule tags don't fire onload
                if (tagClone.hasAttribute('async')) { // remove async on async run tags to make Chrome happy
                    tagClone.removeAttribute('async');
                }
                if (typeof currentTag.origScriptType !== 'undefined') { // restore e.g. "module" type
                    tagClone.type = currentTag.origScriptType;
                }
                if (fireTagOnLoad) {
                    tagClone.onload = function () {
                        window.CookieConsent.RunScriptTags(tagContainer);
                    };
                    tagClone.onerror = function () {
                        window.CookieConsent.RunScriptTags(tagContainer);
                    };
                }
                cookieConsent.cloneEventListeners(currentTag, tagClone);
                if (tagParent != null) {
                    tagParent.removeChild(currentTag);
                    tagParent.insertBefore(tagClone, nextElement || null); // insertBefore will insert currentTag at end if nextElement is null
                }
                if (!fireTagOnLoad) {
                    cookieConsent.RunScriptTags(tagContainer);
                }
            }
            else {
                cookieConsent.RunScriptTags(tagContainer);
            }
        }
    }

    /**
     * @param document - Global document element
     * @param currentTag - Script tag to be cloned
     */
    function cloneScriptTag(document, currentTag) {
        // create new element to force Firefox to execute the script - use internal, unmodified copy of createElement, "createElementOrig"
        var tagClone = document.createElementOrig('script');
        for (var k = 0; k < currentTag.attributes.length; k++) { // clone attributes in new element
            tagClone.setAttribute(currentTag.attributes[k].name, currentTag.attributes[k].value);
        }
        if (currentTag.hasAttribute('nomodule')) { // attribute "nomodule' is not copied out in above loop
            tagClone.setAttribute('nomodule', '');
        }
        if (typeof currentTag.text !== 'undefined') {
            tagClone.text = currentTag.text; // all browser innerHTML
        }
        tagClone.setAttribute('type', 'text/javascript');
        return tagClone;
    }

    /**
     * @param cookieConsent - CookieConsent / Cookiebot object
     */
    function overrideEventListeners(cookieConsent) {
        cookieConsent.mutateEventListeners = true;
        if (typeof EventTarget !== 'undefined') { // Not supported in IE11
            if (typeof EventTarget.prototype.addEventListenerBase === 'undefined') {
                EventTarget.prototype.addEventListenerBase = EventTarget.prototype.addEventListener;
                EventTarget.prototype.addEventListener = function (type, callback, options) {
                    if (cookieConsent.mutateEventListeners && !cookieConsent.isInternalEventListener(type, this, callback)) { // don't register own events on script tags
                        if (type === 'DOMContentLoaded' || type === 'load' || type === 'onload' || type === 'readystatechange') { // postpone onload events
                            cookieConsent.mutationOnloadEventListeners.push({ target: this, type: type, listener: callback, options: options });
                        }
                        else {
                            cookieConsent.mutationEventListeners.push({ target: this, type: type, listener: callback, options: options });
                            this.addEventListenerBase(type, callback, options);
                        }
                    }
                    else {
                        this.addEventListenerBase(type, callback, options);
                    }
                };
            }
        }
    }

    /**
     * @param window - Global window object
     * @param cookieConsent - CookieConsent / Cookiebot object
     */
    function stopOverrideEventListeners(window, cookieConsent) {
        if (cookieConsent.mutateEventListeners) {
            setTimeout(function () {
                cookieConsent.mutateEventListeners = false;
                cookieConsent.applyOverrideEventListeners();
                if (cookieConsent.mutationAppName !== '' && window.angular && window.angular.bootstrap) {
                    window.angular.bootstrap(document.documentElement, [cookieConsent.mutationAppName]);
                }
            }, 1);
        }
    }

    /**
     * @param cookieConsent - CookieConsent / Cookiebot object
     */
    function processPostPonedMutations(cookieConsent) {
        if (cookieConsent.postPonedMutations.length > 0) {
            for (var j = 0; j < cookieConsent.postPonedMutations.length; j++) {
                var postPonedNode = cookieConsent.postPonedMutations[j];
                cookieConsent.processMutation(postPonedNode, true);
            }
            cookieConsent.postPonedMutations = []; // empty array
        }
    }

    /**
     * @param cookieConsent - CookieConsent / Cookiebot object
     * @param mutationNodes - The nodes to be dequeued
     */
    function dequeueNonAsyncScripts(cookieConsent, mutationNodes) {
        if (mutationNodes.length > 0) {
            var node = mutationNodes.shift(); // take first node in array
            if (((node === null || node === void 0 ? void 0 : node.tagName) === 'SCRIPT') && (typeof node.cookieScriptProcessed === 'undefined')) {
                node.cookieScriptProcessed = 1;
                cookieConsent.startJQueryHold();
                var tagURL = '';
                var tagCategories = '';
                var hasSrc = false;
                if (node.hasAttribute('src')) {
                    tagURL = node.getAttribute('src') || '';
                    hasSrc = true;
                }
                if (typeof node.origOuterHTML !== 'undefined') {
                    tagCategories = cookieConsent.getTagCookieCategories(node.origOuterHTML, tagURL, node, true);
                }
                // temp fix for jquery
                if (hasSrc && (tagCategories !== '') && (tagURL.toLocaleLowerCase().indexOf('jquery') >= 0)) {
                    tagCategories = '';
                }
                if (tagCategories !== '') {
                    node.type = 'text/plain';
                    node.setAttribute('data-cookieconsent', tagCategories);
                    cookieConsent.dequeueNonAsyncScripts(mutationNodes);
                }
                else {
                    if (node.type === 'text/plain') {
                        // re-activate node that does not set cookies - must be done with a clone to force Firefox to execute the script
                        var tagParent = node.parentNode;
                        var tagClone = cookieConsent.cloneScriptTag(node);
                        cookieConsent.cloneEventListeners(node, tagClone);
                        tagClone.consentProcessed = '1';
                        tagClone.CB_isClone = 1;
                        // fallback nomodule tags don't fire onload
                        var fireTagOnLoad = (hasSrc &&
                            !tagClone.hasAttribute('data-cookieconsent') &&
                            !tagClone.hasAttribute('nomodule'));
                        if (fireTagOnLoad) {
                            tagClone.onload = function () {
                                cookieConsent.dequeueNonAsyncScripts(mutationNodes);
                            };
                            tagClone.onerror = function () {
                                cookieConsent.dequeueNonAsyncScripts(mutationNodes);
                            };
                        }
                        tagClone.origOuterHTML = node.origOuterHTML;
                        if (typeof node.origScriptType !== 'undefined') {
                            tagClone.type = node.origScriptType;
                        }
                        try { // don't halt execution on error
                            if (tagParent != null) {
                                tagParent.insertBefore(tagClone, node);
                                tagParent.removeChild(node);
                            }
                        }
                        catch (e) { }
                        if (!fireTagOnLoad) {
                            cookieConsent.dequeueNonAsyncScripts(mutationNodes);
                        }
                    }
                    else {
                        cookieConsent.dequeueNonAsyncScripts(mutationNodes);
                    }
                }
            }
            else {
                cookieConsent.dequeueNonAsyncScripts(mutationNodes);
            }
        }
        else {
            // finish of
            if (cookieConsent.deferMutations.length > 0) {
                cookieConsent.dequeueNonAsyncScripts(cookieConsent.deferMutations);
            }
            else {
                cookieConsent.runScripts();
                setTimeout(function () {
                    cookieConsent.stopOverrideEventListeners();
                    cookieConsent.endJQueryHold();
                }, 1000);
            }
        }
    }

    /**
     * @param cookieConsent - CookieConsent / Cookiebot object
     * @param node - element to process
     * @param isPostPoned - boolean to determine whether or not the element was postponed
     */
    function processMutation(cookieConsent, node, isPostPoned) {
        var canProcess = true;
        if (!isPostPoned && cookieConsent.isCookiebotNode(node)) {
            canProcess = false;
        }
        // make sure that nodes are not re-processed when inserted to the DOM via placeholders
        if (node.consentProcessed && node.consentProcessed === '1') {
            canProcess = false;
        }
        else {
            node.consentProcessed = '1';
        }
        if (canProcess) {
            var tagCategories = '';
            var tagURL = '';
            var hasSrc = false;
            if (node.tagName === 'SCRIPT') {
                var scriptNode = node; // define new variable for TypeScript purposes
                if (scriptNode.hasAttribute('src')) {
                    tagURL = scriptNode.getAttribute('src');
                    hasSrc = true;
                }
                if (isPostPoned) {
                    if (typeof scriptNode.origOuterHTML !== 'undefined') {
                        tagCategories = cookieConsent.getTagCookieCategories(scriptNode.origOuterHTML, tagURL, node, true);
                    }
                }
                else {
                    tagCategories = cookieConsent.getTagCookieCategories(scriptNode.outerHTML, tagURL, node, true);
                    if (scriptNode.type != null && typeof scriptNode.type !== 'undefined' && scriptNode.type !== '' && scriptNode.type !== 'text/plain') {
                        scriptNode.origScriptType = scriptNode.type;
                    }
                }
                // temp fix for jquery
                if (hasSrc && (tagCategories !== '') && (tagURL.toLocaleLowerCase().indexOf('jquery') >= 0)) {
                    tagCategories = '';
                }
                if (tagCategories !== '') {
                    scriptNode.type = 'text/plain';
                    scriptNode.setAttribute('data-cookieconsent', tagCategories);
                }
                else {
                    if (isPostPoned && scriptNode.type === 'text/plain') {
                        // re-activate node that does not set cookies - must be done with a clone to force Firefox to execute the script
                        var tagParent = scriptNode.parentNode;
                        var tagClone = cookieConsent.cloneScriptTag(scriptNode);
                        cookieConsent.cloneEventListeners(node, tagClone);
                        tagClone.consentProcessed = '1';
                        tagClone.CB_isClone = 1;
                        if (isPostPoned) {
                            tagClone.origOuterHTML = scriptNode.origOuterHTML;
                            if (typeof scriptNode.origScriptType !== 'undefined') {
                                tagClone.type = scriptNode.origScriptType;
                            }
                        }
                        if (tagParent != null) {
                            tagParent.insertBefore(tagClone, node);
                            tagParent.removeChild(node);
                        }
                    }
                }
            }
            else if ((node.tagName === 'IFRAME') ||
                (node.tagName === 'IMG') ||
                (node.tagName === 'EMBED') ||
                (node.tagName === 'VIDEO') ||
                (node.tagName === 'AUDIO') ||
                (node.tagName === 'PICTURE') ||
                (node.tagName === 'SOURCE')) {
                if (!isPostPoned) {
                    if (node.hasAttribute('src') && !cookieConsent.isCookiebotNode(node) && !node.hasAttribute('data-lazy-type')) {
                        node.origOuterHTML = node.outerHTML;
                        var nodeSrc = node.getAttribute('src');
                        // Ignore frames without a url source -- Ex: GTM Preview
                        if (node.tagName === 'IFRAME' && nodeSrc !== 'about:blank' && nodeSrc !== '') {
                            node.setAttribute('data-cookieblock-src', nodeSrc);
                            node.removeAttribute('src');
                        }
                    }
                }
                if ((node.tagName === 'IMG') && (node.hasAttribute('data-image_src'))) { // force lazy loading image, e.g. on https://www.miralix.dk/
                    node.setAttribute('src', node.getAttribute('data-image_src'));
                }
                if (node.hasAttribute('data-cookieblock-src') && !node.hasAttribute('src') && !node.hasAttribute('data-lazy-type') && !node.hasAttribute('data-image_src')) {
                    tagURL = node.getAttribute('data-cookieblock-src');
                    tagCategories = cookieConsent.getTagCookieCategories(node.origOuterHTML, tagURL, node, true);
                    if (tagCategories !== '') {
                        node.setAttribute('data-cookieconsent', tagCategories);
                        // insert clone to prevent src from loading in Firefox
                        var clone = node.cloneNode(true);
                        cookieConsent.cloneEventListeners(node, clone);
                        clone.cookiebotTagHash = node.cookiebotTagHash;
                        clone.CB_isClone = 1;
                        clone.consentProcessed = '1';
                        var cloneParentNode = node.parentNode;
                        cloneParentNode.insertBefore(clone, node);
                        cloneParentNode.removeChild(node);
                        node = null;
                    }
                    else {
                        // re-activate node that does not set cookies
                        if (node.hasAttribute('data-cookieblock-src')) {
                            node.setAttribute('src', node.getAttribute('data-cookieblock-src'));
                            node.removeAttribute('data-cookieblock-src');
                        }
                        node.consentProcessed = '1';
                        if (node.tagName === 'SOURCE') { // Chrome needs re-insertion of source tag clone to activate source
                            var cloneToActive = node.cloneNode(true);
                            cookieConsent.cloneEventListeners(node, cloneToActive);
                            cloneToActive.cookiebotTagHash = node.cookiebotTagHash;
                            cloneToActive.CB_isClone = 1;
                            cloneToActive.consentProcessed = '1';
                            var cloneParentNodeToActivate = node.parentNode;
                            cloneParentNodeToActivate.removeChild(node);
                            cloneParentNodeToActivate.appendChild(cloneToActive); // use appendChild instead of insertBefore for re-insertion to work in Firefox
                            node = null;
                        }
                    }
                }
            }
        }
    }

    /**
     * @param window - Global window object
     * @param cookieConsent - CookieConsent / Cookiebot object
     * @param nodeElement - node to postpone
     */
    function postponeMutation(window, cookieConsent, nodeElement) {
        if (nodeElement && !cookieConsent.isCookiebotNode(nodeElement)) {
            var scriptNode_1 = nodeElement;
            // disable rocket loader script blocking
            if ((nodeElement.tagName === 'SCRIPT') && typeof scriptNode_1.type !== 'undefined' && scriptNode_1.type !== 'text/javascript' && scriptNode_1.type.indexOf('-text/javascript') > -1) {
                scriptNode_1.type = 'text/javascript';
            }
            if ( // exclude other types as e.g. "application/ld+json"
            (scriptNode_1.tagName === 'SCRIPT') &&
                ((scriptNode_1.type == null) ||
                    (typeof scriptNode_1.type === 'undefined') ||
                    (scriptNode_1.type === '') ||
                    (scriptNode_1.type === 'text/javascript') ||
                    (scriptNode_1.type === 'application/javascript') ||
                    (scriptNode_1.type === 'module') ||
                    (scriptNode_1.type === 'text/plain'))) {
                cookieConsent.startJQueryHold();
                scriptNode_1.origOuterHTML = scriptNode_1.outerHTML;
                if (scriptNode_1.type != null && typeof scriptNode_1.type !== 'undefined' && scriptNode_1.type !== '' && scriptNode_1.type !== 'text/plain') {
                    scriptNode_1.origScriptType = scriptNode_1.type;
                }
                scriptNode_1.type = 'text/plain';
                // prevent scripts from being executed in Firefox
                var beforeScriptExecuteListener_1 = function (event) {
                    if (scriptNode_1.getAttribute('type') === 'text/plain') {
                        event.preventDefault();
                    }
                    scriptNode_1.removeEventListener('beforescriptexecute', beforeScriptExecuteListener_1);
                };
                scriptNode_1.addEventListener('beforescriptexecute', beforeScriptExecuteListener_1);
                if (cookieConsent.hasResponse && scriptNode_1.hasAttribute('src') && !scriptNode_1.hasAttribute('nomodule')) {
                    cookieConsent.preloadMutationScript(scriptNode_1.src);
                }
                if (scriptNode_1.hasAttribute('defer')) {
                    if (scriptNode_1.hasAttribute('async')) { // async conflicts with defer - defer wins
                        scriptNode_1.removeAttribute('async');
                    }
                    cookieConsent.deferMutations.push(scriptNode_1);
                }
                else {
                    cookieConsent.nonAsyncMutations.push(scriptNode_1);
                }
            }
            else if ((nodeElement.tagName === 'IFRAME') ||
                (nodeElement.tagName === 'IMG') ||
                (nodeElement.tagName === 'EMBED') ||
                (nodeElement.tagName === 'VIDEO') ||
                (nodeElement.tagName === 'AUDIO') ||
                (nodeElement.tagName === 'PICTURE') ||
                (nodeElement.tagName === 'SOURCE')) {
                var node = nodeElement;
                if (!((node.tagName === 'IMG') && node.hasAttribute('src') && (cookieConsent.getHostnameFromURL(node.src) === window.location.hostname))) { // don't block first party images
                    if (node.hasAttribute('src') && !node.hasAttribute('data-lazy-type') && !node.hasAttribute('data-image_src') && !cookieConsent.isCookiebotNode(node)) {
                        node.origOuterHTML = node.outerHTML;
                        node.setAttribute('data-cookieblock-src', node.getAttribute('src'));
                        node.removeAttribute('src');
                        // insert clone to prevent src from loading
                        var clone = node.cloneNode(true);
                        cookieConsent.cloneEventListeners(node, clone);
                        clone.cookiebotTagHash = node.cookiebotTagHash;
                        clone.CB_isClone = 1;
                        var cloneParentNode = node.parentNode;
                        cloneParentNode.insertBefore(clone, node);
                        cloneParentNode.removeChild(node);
                        node = null;
                        cookieConsent.postPonedMutations.push(clone);
                    }
                    if ((node != null) && (node.tagName === 'IMG') && (node.hasAttribute('data-image_src'))) { // force lazy loading image, e.g. on https://www.miralix.dk/
                        node.setAttribute('src', node.getAttribute('data-image_src'));
                    }
                }
            }
        }
    }

    /**
     * @param window - Global window object
     * @param cookieConsent - CookieConsent / Cookiebot object
     * @param outerhtml - outerHTML of the element
     * @param tagURL - element src
     * @param node - element to check
     * @param matchCommon - option to also check commonTrackers
     */
    function getTagCookieCategories(window, cookieConsent, outerhtml, tagURL, node, matchCommon) {
        var categories = '';
        for (var j = 0; j < cookieConsent.configuration.tags.length; j++) {
            var currentTag = cookieConsent.configuration.tags[j];
            // test on URL src
            if ((tagURL !== '') && (currentTag.url) && (currentTag.url !== '')) {
                if (currentTag.url.toLowerCase() === tagURL.toLowerCase()) {
                    categories = cookieConsent.cookieCategoriesFromNumberArray(currentTag.cat);
                    break;
                }
            }
            // test on resolved URL src
            if ((tagURL !== '') && (currentTag.resolvedUrl) && (currentTag.resolvedUrl !== '')) {
                if (currentTag.resolvedUrl.toLowerCase() === cookieConsent.resolveURL(tagURL).toLowerCase()) {
                    categories = cookieConsent.cookieCategoriesFromNumberArray(currentTag.cat);
                    break;
                }
            }
            // test on tag ID
            if (node.hasAttribute('id') && (currentTag.tagID) && (currentTag.tagID !== '')) {
                var tagID = node.getAttribute('id').toLowerCase();
                if (currentTag.tagID.toLowerCase() === tagID) {
                    categories = cookieConsent.cookieCategoriesFromNumberArray(currentTag.cat);
                    break;
                }
            }
            // test on tag hash
            if (currentTag.tagHash && (currentTag.tagHash !== '') && node && node.cookiebotTagHash && (node.cookiebotTagHash !== '')) {
                if (currentTag.tagHash === node.cookiebotTagHash) {
                    categories = cookieConsent.cookieCategoriesFromNumberArray(currentTag.cat);
                    break;
                }
            }
            // test on tag innerHTML hash
            if ((currentTag.innerHash) && (currentTag.innerHash !== '') && node && node.innerHTML && (node.innerHTML !== '')) {
                var tagHashInner = cookieConsent.hashCode(node.innerHTML).toString();
                if ((currentTag.innerHash === tagHashInner) && (tagHashInner !== '0')) {
                    categories = cookieConsent.cookieCategoriesFromNumberArray(currentTag.cat);
                    break;
                }
            }
            // test on tag outerHTML hash
            if ((currentTag.outerHash) && (currentTag.outerHash !== '') && (typeof outerhtml !== 'undefined') && (outerhtml !== 'undefined')) {
                var tagHashOuter = cookieConsent.hashCode(outerhtml).toString();
                if ((currentTag.outerHash === tagHashOuter) && (tagHashOuter !== '0')) {
                    categories = cookieConsent.cookieCategoriesFromNumberArray(currentTag.cat);
                    break;
                }
            }
            // test on domain name
            if ( // Exempt image tags from this domain-inheritance check as it will block images on CDN if cookie-setting scripts are served from same CDN
            (tagURL !== '') &&
                (currentTag.resolvedUrl) &&
                (currentTag.resolvedUrl !== '') &&
                (cookieConsent.configuration.trackingDomains.length > 0) &&
                (node.tagName !== 'IMG') &&
                (node.tagName !== 'PICTURE')) {
                var tagDomain = cookieConsent.getHostnameFromURL(tagURL);
                if ((tagDomain !== '') && (tagDomain !== window.location.hostname)) {
                    for (var k = 0; k < cookieConsent.configuration.trackingDomains.length; k++) {
                        var currentRecord = cookieConsent.configuration.trackingDomains[k];
                        if (tagDomain === currentRecord.d) {
                            categories = cookieConsent.cookieCategoriesFromNumberArray(currentRecord.c);
                            break;
                        }
                    }
                }
            }
        }
        // Fallback if site has not yet completed scan - test on default domains
        if (cookieConsent.configuration.tags.length === 0) { // scan not completed
            if (matchCommon && (tagURL !== '') && (categories === '')) {
                // isolate domain name from tagURL
                var tagdomain = tagURL.toLowerCase();
                var isAboluteURL = true;
                if ((tagdomain.indexOf('https://') === 0) && (tagdomain.length > 8)) {
                    tagdomain = tagdomain.substr(8);
                }
                else if ((tagdomain.indexOf('http://') === 0) && (tagdomain.length > 7)) {
                    tagdomain = tagdomain.substr(7);
                }
                else if ((tagdomain.indexOf('//') === 0) && (tagdomain.length > 2)) {
                    tagdomain = tagdomain.substr(2);
                }
                else {
                    isAboluteURL = false;
                }
                if (isAboluteURL) {
                    if (tagdomain.indexOf(':') > 0) {
                        tagdomain = tagdomain.substr(0, tagdomain.indexOf(':'));
                    }
                    if (tagdomain.indexOf('/') > 0) {
                        tagdomain = tagdomain.substr(0, tagdomain.indexOf('/'));
                    }
                    if (tagdomain.length > 3) {
                        for (var i = 0; i < cookieConsent.commonTrackers.domains.length; i++) {
                            var testDomain = cookieConsent.commonTrackers.domains[i];
                            if (tagdomain.indexOf(testDomain.d) >= 0) {
                                categories = cookieConsent.cookieCategoriesFromNumberArray(testDomain.c);
                                break;
                            }
                        }
                    }
                }
            }
        }
        return categories;
    }

    function getTwiplaMaxPrivacyScript(twiplaId, nonce) {
        var script = document.createElement('script');
        applyNonce(script, nonce);
        script.id = 'cookiebot-visitor-analytics-snippet';
        script.innerHTML = "(function(v,i,s,a,t){v[t]=v[t]||function(){(v[t].v=v[t].v||[]).push(arguments)};if(!v._visaSettings){v._visaSettings={}}v._visaSettings[a]={v:'1.0',s:a,a:'1',t:t,f:true};var b=i.getElementsByTagName('body')[0];var p=i.createElement('script');p.defer=1;p.async=1;p.src=s+'?s='+a;p.id='cookiebot-visitor-analytics';b.appendChild(p)})(window,document,'//privacy-analytics-proxy.cookiebot.com/analytics/main.js','" + twiplaId + "','va')";
        return script;
    }
    function getTwiplaTrackingScript(twiplaId, nonce) {
        var script = document.createElement('script');
        applyNonce(script, nonce);
        script.id = 'cookiebot-visitor-analytics-snippet';
        script.innerHTML = "(function(v,i,s,a,t){v[t]=v[t]||function(){(v[t].v=v[t].v||[]).push(arguments)};if(!v._visaSettings){v._visaSettings={}}v._visaSettings[a]={v:'1.0',s:a,a:'1',t:t};var b=i.getElementsByTagName('body')[0];var p=i.createElement('script');p.defer=1;p.async=1;p.src=s+'?s='+a;p.id='cookiebot-visitor-analytics';b.appendChild(p)})(window,document,'//app-worker.visitor-analytics.io/main.js','" + twiplaId + "','va')";
        return script;
    }
    var injectTwipla = function (cookieConsent) {
        if (cookieConsent.twipla && typeof cookieConsent.twipla.domains === 'object') {
            var sanitizeDomain_1 = function (domain) {
                domain = domain.trim().toLowerCase().split('/')[0];
                return domain;
            };
            // Loop through domains and find the matching ID (if any)
            var matchingDomain = Object.keys(cookieConsent.twipla.domains).find(function (domain) {
                return sanitizeDomain_1(domain) === sanitizeDomain_1(window.location.hostname);
            });
            if (matchingDomain) {
                cookieConsent.computedConfiguration.isTwiplaDomain = true;
                var script = null;
                var scriptToLoad = void 0;
                if (cookieConsent.consent.statistics) {
                    script = getTwiplaTrackingScript(cookieConsent.twipla.domains[matchingDomain], cookieConsent.nonce);
                    scriptToLoad = 'tracking';
                }
                else {
                    script = getTwiplaMaxPrivacyScript(cookieConsent.twipla.domains[matchingDomain], cookieConsent.nonce);
                    scriptToLoad = 'maxPrivacy';
                }
                if (cookieConsent.twipla.currentScript !== scriptToLoad) {
                    cookieConsent.twipla.currentScript = scriptToLoad;
                    var twiplaSnippetScript = document.getElementById('cookiebot-visitor-analytics-snippet');
                    var twiplaScript = document.getElementById('cookiebot-visitor-analytics');
                    twiplaSnippetScript && twiplaSnippetScript.remove();
                    twiplaScript && twiplaScript.remove();
                    document.body.appendChild(script);
                }
            }
        }
    };

    var fetchJsonData = function (url, onSuccess, onError) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && (this.status >= 200 && this.status <= 299)) {
                // success but no content
                if (this.status === 204) {
                    onSuccess({});
                    return;
                }
                try {
                    var json = JSON.parse(this.responseText);
                    onSuccess(json);
                }
                catch (e) {
                    onError && onError({
                        status: this.status,
                        message: 'JSON.parse error: ' + e.message
                    });
                }
            }
            else if (this.readyState === 4) { // fail
                onError && onError({
                    status: this.status,
                    message: this.responseText
                });
            }
        };
        xmlhttp.onerror = function () {
            onError && onError({
                status: -1,
                message: 'onerror'
            });
        };
        xmlhttp.open('GET', url, true);
        xmlhttp.send();
    };
    var loadSettings = function (cookieConsent) {
        var url = cookieConsent.CDN + '/consentconfig/' + cookieConsent.serial.toLowerCase() + '/settings.json';
        function fetchSettingsCallback(data) {
            if (data) {
                if (data.widget) {
                    cookieConsent.widget = cookieConsent.widget || {};
                    cookieConsent.widget.configuration = data.widget;
                }
                if (data.twipla && !cookieConsent.isSpider()) {
                    cookieConsent.twipla = data.twipla;
                    injectTwipla(cookieConsent);
                }
            }
            cookieConsent.settingsLoaded = true;
        }
        // todo - ts-ignore to be removed in future TypeScript cleanup task (EUD-5213)
        // @ts-ignore: Unreachable code error
        cookieConsent.fetchJsonData(url, fetchSettingsCallback, fetchSettingsCallback);
    };

    /**
     * @returns - TCF Consent String (IABConsentString)
     */
    function getTcfConsentString() {
        return localStorage.getItem('cookiebotTcfConsentString') || '';
    }
    /**
     * @returns - GACM Consent String
     */
    function getGacmConsentString() {
        return localStorage.getItem('cookiebotGacmConsentString') || '';
    }

    /**
     * @this {Promise}
     */
    function finallyConstructor(callback) {
      var constructor = this.constructor;
      return this.then(
        function(value) {
          // @ts-ignore
          return constructor.resolve(callback()).then(function() {
            return value;
          });
        },
        function(reason) {
          // @ts-ignore
          return constructor.resolve(callback()).then(function() {
            // @ts-ignore
            return constructor.reject(reason);
          });
        }
      );
    }

    function allSettled(arr) {
      var P = this;
      return new P(function(resolve, reject) {
        if (!(arr && typeof arr.length !== 'undefined')) {
          return reject(
            new TypeError(
              typeof arr +
                ' ' +
                arr +
                ' is not iterable(cannot read property Symbol(Symbol.iterator))'
            )
          );
        }
        var args = Array.prototype.slice.call(arr);
        if (args.length === 0) return resolve([]);
        var remaining = args.length;

        function res(i, val) {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(
                val,
                function(val) {
                  res(i, val);
                },
                function(e) {
                  args[i] = { status: 'rejected', reason: e };
                  if (--remaining === 0) {
                    resolve(args);
                  }
                }
              );
              return;
            }
          }
          args[i] = { status: 'fulfilled', value: val };
          if (--remaining === 0) {
            resolve(args);
          }
        }

        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    }

    // Store setTimeout reference so promise-polyfill will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var setTimeoutFunc = setTimeout;

    function isArray(x) {
      return Boolean(x && typeof x.length !== 'undefined');
    }

    function noop() {}

    // Polyfill for Function.prototype.bind
    function bind(fn, thisArg) {
      return function() {
        fn.apply(thisArg, arguments);
      };
    }

    /**
     * @constructor
     * @param {Function} fn
     */
    function Promise$2(fn) {
      if (!(this instanceof Promise$2))
        throw new TypeError('Promises must be constructed via new');
      if (typeof fn !== 'function') throw new TypeError('not a function');
      /** @type {!number} */
      this._state = 0;
      /** @type {!boolean} */
      this._handled = false;
      /** @type {Promise|undefined} */
      this._value = undefined;
      /** @type {!Array<!Function>} */
      this._deferreds = [];

      doResolve(fn, this);
    }

    function handle(self, deferred) {
      while (self._state === 3) {
        self = self._value;
      }
      if (self._state === 0) {
        self._deferreds.push(deferred);
        return;
      }
      self._handled = true;
      Promise$2._immediateFn(function() {
        var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
          (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
          return;
        }
        var ret;
        try {
          ret = cb(self._value);
        } catch (e) {
          reject(deferred.promise, e);
          return;
        }
        resolve(deferred.promise, ret);
      });
    }

    function resolve(self, newValue) {
      try {
        // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === self)
          throw new TypeError('A promise cannot be resolved with itself.');
        if (
          newValue &&
          (typeof newValue === 'object' || typeof newValue === 'function')
        ) {
          var then = newValue.then;
          if (newValue instanceof Promise$2) {
            self._state = 3;
            self._value = newValue;
            finale(self);
            return;
          } else if (typeof then === 'function') {
            doResolve(bind(then, newValue), self);
            return;
          }
        }
        self._state = 1;
        self._value = newValue;
        finale(self);
      } catch (e) {
        reject(self, e);
      }
    }

    function reject(self, newValue) {
      self._state = 2;
      self._value = newValue;
      finale(self);
    }

    function finale(self) {
      if (self._state === 2 && self._deferreds.length === 0) {
        Promise$2._immediateFn(function() {
          if (!self._handled) {
            Promise$2._unhandledRejectionFn(self._value);
          }
        });
      }

      for (var i = 0, len = self._deferreds.length; i < len; i++) {
        handle(self, self._deferreds[i]);
      }
      self._deferreds = null;
    }

    /**
     * @constructor
     */
    function Handler(onFulfilled, onRejected, promise) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.promise = promise;
    }

    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */
    function doResolve(fn, self) {
      var done = false;
      try {
        fn(
          function(value) {
            if (done) return;
            done = true;
            resolve(self, value);
          },
          function(reason) {
            if (done) return;
            done = true;
            reject(self, reason);
          }
        );
      } catch (ex) {
        if (done) return;
        done = true;
        reject(self, ex);
      }
    }

    Promise$2.prototype['catch'] = function(onRejected) {
      return this.then(null, onRejected);
    };

    Promise$2.prototype.then = function(onFulfilled, onRejected) {
      // @ts-ignore
      var prom = new this.constructor(noop);

      handle(this, new Handler(onFulfilled, onRejected, prom));
      return prom;
    };

    Promise$2.prototype['finally'] = finallyConstructor;

    Promise$2.all = function(arr) {
      return new Promise$2(function(resolve, reject) {
        if (!isArray(arr)) {
          return reject(new TypeError('Promise.all accepts an array'));
        }

        var args = Array.prototype.slice.call(arr);
        if (args.length === 0) return resolve([]);
        var remaining = args.length;

        function res(i, val) {
          try {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
              var then = val.then;
              if (typeof then === 'function') {
                then.call(
                  val,
                  function(val) {
                    res(i, val);
                  },
                  reject
                );
                return;
              }
            }
            args[i] = val;
            if (--remaining === 0) {
              resolve(args);
            }
          } catch (ex) {
            reject(ex);
          }
        }

        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };

    Promise$2.allSettled = allSettled;

    Promise$2.resolve = function(value) {
      if (value && typeof value === 'object' && value.constructor === Promise$2) {
        return value;
      }

      return new Promise$2(function(resolve) {
        resolve(value);
      });
    };

    Promise$2.reject = function(value) {
      return new Promise$2(function(resolve, reject) {
        reject(value);
      });
    };

    Promise$2.race = function(arr) {
      return new Promise$2(function(resolve, reject) {
        if (!isArray(arr)) {
          return reject(new TypeError('Promise.race accepts an array'));
        }

        for (var i = 0, len = arr.length; i < len; i++) {
          Promise$2.resolve(arr[i]).then(resolve, reject);
        }
      });
    };

    // Use polyfill for setImmediate for performance gains
    Promise$2._immediateFn =
      // @ts-ignore
      (typeof setImmediate === 'function' &&
        function(fn) {
          // @ts-ignore
          setImmediate(fn);
        }) ||
      function(fn) {
        setTimeoutFunc(fn, 0);
      };

    Promise$2._unhandledRejectionFn = function _unhandledRejectionFn(err) {
      if (typeof console !== 'undefined' && console) {
        console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
      }
    };

    var createBannerQueryParameters = function (cookieConsent, ucScriptElement) {
        return {
            serial: cookieConsent.getURLParam('cbid') || ucScriptElement.getAttribute('data-cbid') || undefined,
            mode: cookieConsent.getURLParam('mode') || ucScriptElement.getAttribute('data-mode') || undefined,
            culture: cookieConsent.getURLParam('culture') || ucScriptElement.getAttribute('data-culture') || undefined,
            type: cookieConsent.getURLParam('type') || ucScriptElement.getAttribute('data-type') || undefined,
            level: cookieConsent.getURLParam('level') || ucScriptElement.getAttribute('data-level') || undefined,
            domainPath: cookieConsent.getURLParam('path') || ucScriptElement.getAttribute('data-path') || undefined,
            userCountry: getDomainSearchParam('uc_cmp_country') || cookieConsent.getURLParam('user_country') || ucScriptElement.getAttribute('data-user-country') || undefined
        };
    };
    var createBanner = function (cookieConsent, isRenewal) {
        var ucScriptElement = document.getElementById(cookieConsent.scriptId) || cookieConsent.scriptElement;
        if (!ucScriptElement) {
            console.warn("Error: Can't read data values from the cookie script tag - make sure to set script attribute ID.");
            return resolvedPromise(cookieConsent.Promise);
        }
        var parameters = createBannerQueryParameters(cookieConsent, ucScriptElement);
        if (!parameters.serial) {
            console.warn("Error: Cookie script tag attribute 'data-cbid' is missing.");
            return resolvedPromise(cookieConsent.Promise);
        }
        if (!cookieConsent.isGUID(parameters.serial)) {
            console.warn('Error: Cookie script tag ID %s is not a valid key.', parameters.serial);
            return resolvedPromise(cookieConsent.Promise);
        }
        var serial = parameters.serial;
        var mode = parameters.mode;
        var culture = parameters.culture;
        var type = parameters.type;
        var level = parameters.level;
        var domainPath = parameters.domainPath;
        var userCountry = parameters.userCountry;
        cookieConsent.serial = serial;
        if (!cookieConsent.cookieEnabled) {
            cookieConsent.consented = false;
            cookieConsent.declined = true;
            cookieConsent.hasResponse = true;
            cookieConsent.consent.preferences = false;
            cookieConsent.consent.statistics = false;
            cookieConsent.consent.marketing = false;
            cookieConsent.consentID = '-3'; // cookies is not enabled on client
            cookieConsent.consent.stamp = '-3';
            return resolvedPromise(cookieConsent.Promise);
        }
        var querystrings = [
            'renew=' + (isRenewal ? 'true' : 'false'),
            'referer=' + encodeURIComponent(window.location.hostname),
            'dnt=' + (cookieConsent.doNotTrack ? 'true' : 'false'),
            // Consumer will call init, so the outputted Javascript should not
            'init=false'
        ];
        // only include on renewal to avoid reload of banner on each page request when site is using explicit consent
        isRenewal && querystrings.push('nocache=' + new Date().getTime());
        mode && querystrings.push('mode=' + mode);
        culture && querystrings.push('culture=' + culture);
        type && querystrings.push('type=' + type);
        level && querystrings.push('level=' + level);
        domainPath && querystrings.push('path=' + encodeURIComponent(domainPath));
        userCountry && querystrings.push('usercountry=' + userCountry);
        cookieConsent.framework && querystrings.push('framework=' + cookieConsent.framework);
        cookieConsent.geoRegions.length > 0 && querystrings.push('georegions=' + encodeURIComponent(JSON.stringify(cookieConsent.geoRegions)));
        cookieConsent.isbulkrenewal && querystrings.push('bulkrenew=1');
        // one time signal
        cookieConsent.isbulkrenewal = false;
        return new cookieConsent.Promise(function (resolve) {
            cookieConsent.getScript(cookieConsent.host + serial + '/cc.js?' + querystrings.join('&'), true, resolve);
        });
    };

    var createWidgetIconUrl = function (cdnHost) {
        return cdnHost + 'Scripts/widgetIcon.min.js';
    };

    /**
     * @param cookieConsent - CookieConsent / Cookiebot object
     */
    function loadInlineTagConfiguration(cookieConsent) {
        var tagConfiguration = cookieConsent.inlineConfiguration && cookieConsent.inlineConfiguration.TagConfiguration;
        if (tagConfiguration && tagConfiguration.length > 0) {
            for (var i = 0; i < tagConfiguration.length; i++) {
                var tag = tagConfiguration[i];
                if (tag.id) {
                    // remove potential duplicate from configuration.js
                    for (var j = 0; j < cookieConsent.configuration.tags.length; j++) {
                        var currentTag = cookieConsent.configuration.tags[j];
                        if (tag.id === currentTag.tagID) {
                            cookieConsent.configuration.tags.splice(j, 1);
                        }
                    }
                    var categoryNumberArray = cookiesNumberCategoriesFromStringArray(tag.categories || []);
                    // register new tag
                    cookieConsent.configuration.tags.push({
                        id: 0,
                        tagID: tag.id,
                        cat: categoryNumberArray,
                        innerHash: '',
                        outerHash: '',
                        resolvedUrl: '',
                        tagHash: '',
                        type: '',
                        url: ''
                    });
                }
            }
        }
    }

    /**
     * @param cookieObject - The cookie object to be turned into an array
     * @returns - A list of strings matching the original CookieConsent.cookieList
     */
    function getCookieListFromObject(cookieObject) {
        return [cookieObject.CookieName, '', '', '', '', cookieObject.CookieStorageType.toString(), cookieObject.CookieNameRegex || ''];
    }
    /**
     * @param cookieConsent - CookieConsent / Cookiebot object
     * @param shouldFetchCookies - Boolean to determine whether to fetch the list of cookies in the banner
     */
    function onSuccess(cookieConsent, shouldFetchCookies) {
        var logConsentJsonUrl = cookieConsent.host + cookieConsent.serial + '/' + cookieConsent.domain + '/cookies.json';
        if (shouldFetchCookies) {
            // @ts-ignore
            fetchJsonData(logConsentJsonUrl, function (data) {
                var advertisingCookiesList = data.AdvertisingCookies.map(function (cookie) { return getCookieListFromObject(cookie); });
                var preferenceCookiesList = data.PreferenceCookies.map(function (cookie) { return getCookieListFromObject(cookie); });
                var statisticsCookiesList = data.StatisticCookies.map(function (cookie) { return getCookieListFromObject(cookie); });
                var unclassifiedCookiesList = data.UnclassifiedCookies.map(function (cookie) { return getCookieListFromObject(cookie); });
                cookieConsent.cookieList = __assign(__assign({}, cookieConsent.cookieList), { cookieTableAdvertising: advertisingCookiesList, cookieTablePreference: preferenceCookiesList, cookieTableStatistics: statisticsCookiesList, cookieTableUnclassified: unclassifiedCookiesList });
                cookieConsent.init();
                cookieConsent.resetCookies();
            });
        }
        else {
            cookieConsent.init();
            cookieConsent.resetCookies();
        }
        injectTwipla(cookieConsent);
    }
    /**
     * @param cookieConsent - CookieConsent / Cookiebot object
     * @param consentURL - Consent URL to fetch
     * @param asyncLoad - Boolean to determine whether getScript should set the consentURL as async
     * @param shouldFetchCookies - Boolean to determine whether to fetch the list of cookies in the banner
     */
    function logConsent(cookieConsent, consentURL, asyncLoad, shouldFetchCookies) {
        var truncatedLogConsentUrl = getTruncatedString(consentURL, 4096);
        window.CookieConsent.getScript(truncatedLogConsentUrl, asyncLoad, function () {
            onSuccess(cookieConsent, shouldFetchCookies);
        });
    }

    // Use native promise when available otherwise use the ponyfill
    var Promise$1 = (typeof window.Promise !== "undefined" && window.Promise.toString().indexOf("[native code]") !== -1) ? window.Promise : Promise$2;

    var latestTcData = null;

    /** CB Consent Service CMP Source ID - Required by Microsoft Clarity Consent API v2 to identify the CMP provider */
    var MS_CLARITY_CMP_SOURCE_ID = 152;

    //Always refer to the Cookiebot-object as "CookieConsent" internally in this code if not available as "this" due to async context,
    //as the ID "CookieConsent" will work no matter which context the code is in and which ID the customer is applying to the Cookiebot script tag
    if (typeof (window.CookieControl) === 'undefined') {
        window.CookieControl = {};
    }
    window.CookieControl.Cookie = function (n) {
        this.Promise = Promise$1;
        this.name = n;
        this.consented = false;
        this.declined = false;
        this.changed = false;
        this.hasResponse = false;
        this.consentID = "0";
        this.consent = { stamp: '0', necessary: true, preferences: false, statistics: false, marketing: false, method: null };
        this.isOutsideEU = false; //deprecated,
        //use isOutOfRegion instead of isOutsideEU to determine if user is within a geo-target-region or regulations.gdprApplies to determine if GDPR applies to the user's location
        this.isOutOfRegion = false;
        this.host = "https://consent.cookiebot.com/";
        this.domain = "";
        this.currentPath = "/";
        this.doNotTrack = false;
        this.consentLevel = 'strict';
        this.isRenewal = false;
        this.forceShow = false;
        this.dialog = null;
        this.responseMode = "";
        this.serial = "";
        this.scriptId = "Cookiebot";
        this.scriptElement = null;
        this.whitelist = [];
        this.cookieList = { cookieTablePreference: [], cookieTableStatistics: [], cookieTableAdvertising: [], cookieTableUnclassified: [] };
        this.pathlist = [];
        this.userIsInPath = true;
        this.cookieEnabled = true;
        this.versionChecked = false;
        this.versionRequested = false;
        this.version = 1;
        this.latestVersion = 1;
        this.isNewVersion = false;
        this.CDN = null;
        this.source = "";
        this.retryCounter = 0;
        this.frameRetryCounter = 0;
        this.bulkConsentFrameRetryCounter = 0;
        this.setOnloadFrameRetryCounter = 0;
        this.optOutLifetime = 12; //months, 0=session
        this.consentModeDisabled = false;
        this.msConsentModeDisabled = false;
        this.msClarityConsentModeEnabled = true;
        this.amznConsentSignalEnabled = false;
        this.advertiserConsentModeEnabled = true;
        this.consentModeDataRedaction = "dynamic";
        this.consentLifetime = null; //months
        this.framework = "";
        this.hasFramework = false;
        this.frameworkBlocked = false;
        this.frameworkLoaded = false;
        this.iframeReady = false;
        this.iframe = null;
        this.bulkconsent = null;
        this.bulkresetdomains = [];
        this.bulkconsentsubmitted = false;
        this.isbulkrenewal = false;
        this.handleCcpaOptinInFrontend = false;
        this.wipe = { preferences: true, statistics: true, marketing: true };
        this.consentUTC = null;
        this.IABConsentString = "";
        this.GACMConsentString = ""; //Google TCF 2 Additional Consent Mode (GACM) - https://support.google.com/admanager/answer/9681920
        this.dataLayerName = (function () {
            function isContainer(name) {
                return !!window.google_tag_manager[name].dataLayer;
            }

            var containerName = window.google_tag_manager
                ? Object.keys(window.google_tag_manager).filter(isContainer)[0]
                : null; // GTM unavailable

            return containerName
                ? window.google_tag_manager[containerName].dataLayer.name
                : "dataLayer"; // GTM data-layer is unavailable (or maybe loaded after Cookiebot)
        })();
        this.loaded = false;
        this.autoblock = false;
        this.mutationObserver = null;
        this.mutationCounter = 0;
        this.mutationFallback = false;
        this.mutationFallbackDocAttributes = [];
        this.mutationHandlerFallbackCharsetLoaded = false;
        this.mutationAppName = "";
        this.mutationEventListeners = [];
        this.mutationOnloadEventListeners = [];
        this.mutateEventListeners = false;
        this.mutationHandlerFirstScript = null;
        this.postPonedMutations = [];
        this.nonAsyncMutations = [];
        this.deferMutations = [];
        this.geoRegions = [];
        this.userCountry = "";
        this.userCulture = "";
        this.userCultureOverride = null;
        this.windowOnloadTriggered = false;
        this.botDetectionDisabled = false;
        this.regulations = {
            gdprApplies: true,
            ccpaApplies: true,
            lgpdApplies: true
        };
        this.regulationRegions = {
            gdpr: [ //EU member states +  EFTA States Liechtenstein, Norway and Iceland
                "at", "be", "bg", "cy", "cz", "de", "dk",
                "es", "ee", "fi", "fr", "gb", "gr", "hr",
                "hu", "ie", "it", "lt", "lu", "lv", "mt",
                "nl", "pl", "pt", "ro", "sk", "si", "se",
                "li", "no", "is"
            ],
            ccpa: ["us-06"], //US State of California
            lgpd: ["br"] //Brazil
        };
        //get top 50 from DB:
        //select top(50) CookieProviderDomain, MAX(CookieCategory) as cat, COUNT(*) as antal from Cookies where CookieIsThirdParty=1 and CookieCategory>1
        //and CookieProviderDomain<>'cookiebot.com' and CookieCrawlDate>DATEADD(m,-1,GETUTCDATE()) group by CookieProviderDomain order by antal desc
        this.commonTrackers = {
            domains: [
                { d: "google-analytics.com", c: [3] },
                { d: "youtube.com", c: [4] },
                { d: "youtube-nocookie.com", c: [4] },
                { d: "googleadservices.com", c: [4] },
                { d: "googlesyndication.com", c: [4] },
                { d: "doubleclick.net", c: [4] },
                { d: "facebook.*", c: [4] },
                { d: "linkedin.com", c: [4] },
                { d: "twitter.com", c: [4] },
                { d: "addthis.com", c: [4] },
                { d: "bing.com", c: [4] },
                { d: "sharethis.com", c: [4] },
                { d: "yahoo.com", c: [4] },
                { d: "addtoany.com", c: [4] },
                { d: "dailymotion.com", c: [4] },
                { d: "amazon-adsystem.com", c: [4] },
                { d: "snap.licdn.com", c: [4] }
            ]
        };
        this.configuration = { loaded: false, loadRetry: 0, tags: [], trackingDomains: [] };
        this.inlineConfiguration = null;
        this.widget = null;
        this.twipla = null;
        this.settingsLoaded = false;
        this.bulkConsentEnabled = true;
        this.computedConfiguration = {
            blockingmode: 'manual',
            useBunny: false,
            msConsentModeEnabled: true,
            msClarityConsentModeEnabled: true,
            amznConsentSignalEnabled: false,
            framework: null,
            widgetEnabled: null,
            isTwiplaDomain: false
        };

        var assumedCookiebotScript = document.currentScript;

        /**
         * Object.assign() ponyfill for IE11
         * @see <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign>
         */
        this.$assign = typeof Object.assign == "function" ? Object.assign : function assign(target, varArgs) {
            if (target == null) {
                throw new TypeError("Cannot convert undefined or null to object");
            }
            var to = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];
                if (nextSource != null) {
                    for (var nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        };

        this.init = function () {
            var that = this;
            //check if persistant cookies are enabled on users browser - navigator.cookieEnabled NOT reliable, ie. on Internet Explorer

            if ("cookie" in document) {
                var testcookie = this.getCookie(this.name);

                if (!testcookie) {
                    var secureAttribute = window.location.protocol === "https:" ? ";secure" : "";
                    document.cookie = this.name + "=-3;expires=Thu, 01 Jan 2060 00:00:00 GMT" + secureAttribute;

                    this.cookieEnabled = (document.cookie.indexOf.call(document.cookie, this.name) > -1);
                    if (this.cookieEnabled) {
                        //remove temp test-cookie
                        document.cookie = this.name + "=-3;expires=Thu, 01 Jan 1970 00:00:00 GMT" + secureAttribute;
                    }
                }
            }
            else {
                this.cookieEnabled = false;
            }

            if (!this.cookieEnabled) {
                this.isOutsideEU = false;
                this.isOutOfRegion = false;
                this.hasResponse = true;
                this.declined = true;
                this.consented = false;
                this.consent.preferences = false;
                this.consent.statistics = false;
                this.consent.marketing = false;
                this.consentID = "-3"; //cookies is not enabled on client
                this.consent.stamp = "-3";
                this.consent.method = null;
            }

            //copy original createElement function before it is overridden by other plugins, e.g. Divi in WordPress
            if (typeof document.createElementOrig === "undefined") {
                document.createElementOrig = document.createElement;
            }

            //mark dynamically created elements so that they are not processed by MutationObserver, e.g. tags created from Google Tag Manager (GTM)
            document.createElement = function(newElement) {
                return function() {
                    var element = newElement.apply(this, arguments);
                    element.isCookiebotDynamicTag = 1;
                    return element;
                };
            }(document.createElement);

            window.addEventListener("load", that.signalWindowLoad, false);

            function logMissingUcReference() {
                var supportUrl = "https://www.cookiebot.com/en/help/";
                console.warn("Cookiebot: Cookiebot was unable to reference the uc.js script, which should be declared with an ID attribute set to 'Cookiebot'. For more information about Cookiebot setup, see %s", supportUrl);
            }

            function isCookiebotScript(script) {
                return script &&
                    script.hasAttribute("src") &&
                    (script.hasAttribute("data-cbid") || (script.getAttribute("src").toLowerCase().indexOf("cbid=") > 0)) &&
                    (script.getAttribute("src").toLowerCase().indexOf("/uc.js") > 0);
            }

            var d = null;

            if (isCookiebotScript(assumedCookiebotScript)) {
                d = assumedCookiebotScript;

                if (d.hasAttribute("id")) {
                    this.scriptId = d.getAttribute('id');
                } else {
                    d.id = this.scriptId;
                }
            } else {
                d = document.getElementById(this.scriptId) || document.getElementById("CookieConsent");

                if (d) {
                    this.scriptId = d.getAttribute('id'); // "Cookiebot" || "CookieConsent"
                } else {
                    // If Cookiebot script is not found by either ID, search tags for a src with a combination of "cbid" + "/uc.js"
                    var tagsAll = document.getElementsByTagName("script");
                    for (var i = 0; i < tagsAll.length; i++) {
                        var currentTag = tagsAll[i];
                        if (isCookiebotScript(currentTag)) {
                            d = currentTag;

                            // get custom ID or set Cookiebot ID
                            if (d.hasAttribute("id")) {
                                this.scriptId = d.getAttribute('id');
                            } else {
                                d.id = this.scriptId;
                            }

                            break;
                        }
                    }
                }
            }

            if (!d) {
                logMissingUcReference(); // Cookiebot script not found
            } else if (d && d.hasAttribute("src")) {
                this.source = d.getAttribute("src");
            }

            // Returns a list of available language-cultures for the browser/user
            // Example return-value: ["en-US", "en", "da"]
            function getUserCultures() {
                // evergreen browsers: (Chrome, Firefox, Safari, Edge)

                if (navigator.languages && navigator.languages.length) {
                    return navigator.languages;
                }

                // IE 11:
                return [navigator.language];
            }

            this.userCulture = getUserCultures()[0];

            if (d) {
                this.scriptElement = d;
                this.host = d.getAttribute("data-host") || ("https://" + d.src.match(/:\/\/(.[^/]+)/)[1] + "/");

                function hostHasSuffix(host, suffix) {
                    var fromIndex = host.length - suffix.length;
                    return host.indexOf(suffix, fromIndex) !== -1;
                }

                if (hostHasSuffix(this.host, "cookiebot.eu/") || (hostHasSuffix(this.host, "eu.cookiebot.dev/"))) {
                    this.CDN = "https://dev-consentcdn-cookiebot-eu.cookiebot.dev";
                    this.computedConfiguration.useBunny = true;
                } else {
                    this.CDN = "https://dev-consentcdn-cookiebot-com.cookiebot.dev";
                }

                this.nonce = sanitizeNonce(d.nonce);

                var e = d.getAttribute('data-cbid');
                var ex = this.getURLParam("cbid");
                if (ex) {
                    e = ex;
                }
                if (e) {
                    if (this.isGUID(e)) {
                        this.serial = e;
                    }
                }

                var p = d.getAttribute('data-path');
                if (p) {
                    var customdatapathlist = p.replace(/ /g, '');
                    this.pathlist = customdatapathlist.split(',');
                }

                var p2 = d.getAttribute('data-blockingmode');
                if (p2) {
                    if (p2.toLowerCase() === "auto") {
                        this.autoblock = true;
                        this.computedConfiguration.blockingmode = "auto";
                    }
                }

                var pol = d.getAttribute('data-optoutlifetime');
                if (pol) {
                    if (pol === "0") {
                        this.optOutLifetime = "0";
                    }
                }

                var pw1 = d.getAttribute('data-wipe-preferences');
                if (pw1) {
                    if (pw1.toLowerCase() === "0") {
                        this.wipe.preferences = false;
                    }
                }

                var pw2 = d.getAttribute('data-wipe-statistics');
                if (pw2) {
                    if (pw2.toLowerCase() === "0") {
                        this.wipe.statistics = false;
                    }
                }

                var pw3 = d.getAttribute('data-wipe-marketing');
                if (pw3) {
                    if (pw3.toLowerCase() === "0") {
                        this.wipe.marketing = false;
                    }
                }

                var pf = d.getAttribute('data-framework');
                if (pf) {
                    this.framework = pf;
                }

                var pg = d.getAttribute('data-georegions');
                if (pg) {
                    this.registerGeoRegions(pg);
                }

                var uc = d.getAttribute('data-user-country');
                if (uc) {
                    this.userCountry = uc;
                }

                var pc = d.getAttribute('data-culture');
                if (pc) {
                    this.userCulture = pc;
                    this.userCultureOverride = pc;
                }

                var we = d.getAttribute('data-widget-enabled');
                if (we) {
                    if (we === "true" || we === "false") {
                        this.widget = this.widget || {};
                        this.widget.enabledOverride = we === "true";
                    } else {
                        this.logWidgetAttributeWarning('data-widget-enabled', we);
                    }
                }

                var cm = d.getAttribute('data-consentmode');
                if (cm && cm.toLowerCase() === 'disabled') {
                    this.consentModeDisabled = true;
                    this.advertiserConsentModeEnabled = false;
                }

                var attributeMsConsentMode = d.getAttribute('data-ms-consent-mode');
                if (attributeMsConsentMode && attributeMsConsentMode.toLowerCase() === 'disabled') {
                    this.msConsentModeDisabled = true;
                    this.computedConfiguration.msConsentModeEnabled = false;
                }

                var attributeMsClarityConsentMode = d.getAttribute('data-ms-clarity-consent-mode');
                if (attributeMsClarityConsentMode && attributeMsClarityConsentMode.toLowerCase() === 'disabled') {
                    this.msClarityConsentModeEnabled = false;
                    this.computedConfiguration.msClarityConsentModeEnabled = false;
                }

                var attributeAmznConsentSignal = d.getAttribute('data-amazon-consent-signal');
                if (attributeAmznConsentSignal && attributeAmznConsentSignal.toLowerCase() === 'enabled') {
                    this.amznConsentSignalEnabled = true;
                    this.computedConfiguration.amznConsentSignalEnabled = true;
                }

                var attributeAdvertiserConsent = d.getAttribute('data-advertiser-consent-mode');
                if (attributeAdvertiserConsent && attributeAdvertiserConsent.toLowerCase() === 'disabled') {
                    this.advertiserConsentModeEnabled = false;
                }

                var bce = d.getAttribute('data-bulkconsentmode');
                if (bce && bce.toLowerCase() === 'disabled') {
                    this.bulkConsentEnabled = false;
                }

                var attributeImplementation = d.getAttribute('data-implementation');
                if (attributeImplementation) {
                    this.computedConfiguration.implementation = attributeImplementation;
                }

                var cmdr = this.getURLParam("consentmode-dataredaction") || d.getAttribute('data-consentmode-dataredaction');
                if (cmdr) {
                    if (cmdr === 'true' || cmdr === 'false' || cmdr === 'dynamic') {
                        this.consentModeDataRedaction = cmdr;
                    } else {
                        console.warn(
                            "Cookiebot: Cookiebot script attribute 'data-consentmode-dataredaction' with value '%s' is invalid. Supported values are 'true', 'false' or 'dynamic'",
                            cmdr
                        );
                    }
                }

                this.dataLayerName = d.getAttribute('data-layer-name') || this.dataLayerName;
            }

            var px = this.getURLParam("path");
            if (px) {
                var custompathlist = px.replace(/ /g, '');
                this.pathlist = custompathlist.split(',');
            }

            var px2 = this.getURLParam("blockingmode");
            if (px2) {
                if (px2.toLowerCase() === "auto") {
                    this.autoblock = true;
                    this.computedConfiguration.blockingmode = "auto";
                }
            }

            var polx = this.getURLParam('optoutlifetime');
            if (polx) {
                if (polx === "0") {
                    this.optOutLifetime = "0";
                }
            }

            var pwx1 = this.getURLParam('wipe_preferences');
            if (pwx1) {
                if (pwx1.toLowerCase() === "0") {
                    this.wipe.preferences = false;
                }
            }

            var pwx2 = this.getURLParam('wipe_statistics');
            if (pwx2) {
                if (pwx2.toLowerCase() === "0") {
                    this.wipe.statistics = false;
                }
            }

            var pwx3 = this.getURLParam('wipe_marketing');
            if (pwx3) {
                if (pwx3.toLowerCase() === "0") {
                    this.wipe.marketing = false;
                }
            }

            var pfx = this.getURLParam('framework');
            if (pfx) {
                this.framework = pfx;
            }

            var pfy = this.getURLParam('georegions');
            if (pfy) {
                this.registerGeoRegions(pfy);
            }

            var pfz = getDomainSearchParam('uc_cmp_country') || this.getURLParam('user_country');
            if (pfz) {
                this.userCountry = pfz;
            }

            var puc = this.getURLParam('culture');
            if (puc) {
                this.userCulture = puc;
                this.userCultureOverride = puc;
            }

            var pcm = this.getURLParam('consentmode');
            if (pcm && pcm.toLowerCase() === 'disabled') {
                this.consentModeDisabled = true;
                this.advertiserConsentModeEnabled = false;
            }

            var paramMsConsentMode = this.getURLParam('msConsentMode');
            if (paramMsConsentMode && paramMsConsentMode === 'disabled') {
                this.msConsentModeDisabled = true;
                this.computedConfiguration.msConsentModeEnabled = false;
            }

            var paramMsClarityConsentMode = this.getURLParam('msClarityConsentMode');
            if (paramMsClarityConsentMode && paramMsClarityConsentMode === 'disabled') {
                this.msClarityConsentModeEnabled = false;
                this.computedConfiguration.msClarityConsentModeEnabled = false;
            }

            var paramAmznConsentSignal = this.getURLParam('amazonConsentSignal');
            if (paramAmznConsentSignal && paramAmznConsentSignal === 'enabled') {
                this.amznConsentSignalEnabled = true;
                this.computedConfiguration.amznConsentSignalEnabled = true;
            }

            var paramAdvertiserConsentMode = this.getURLParam('advertiserConsentMode');
            if (paramAdvertiserConsentMode && paramAdvertiserConsentMode.toLowerCase() === 'disabled') {
                this.advertiserConsentModeEnabled = false;
            }

            var paramImplementation = this.getURLParam('implementation');
            if (paramImplementation) {
                this.computedConfiguration.implementation = paramImplementation;
            }

            //init Cookiebot object
            window["Cookiebot"] = this;

            this.domain = window.location.hostname.toLowerCase();
            if (this.domain.indexOf("www.") === 0) {
                this.domain = this.domain.substring(4);
            }

            // Check Domain Params -- Used by Google Bots to show the banner to detect CWVs
            var gDisableBotDetection = this.getDomainUrlParam('g_disable_bot_detection');
            if (gDisableBotDetection && gDisableBotDetection === "1") {
                this.botDetectionDisabled = true;
            }


            // Force TCF v2.3 for all TCF customers
            var lowercaseFramework = this.framework.toLowerCase();
            if (lowercaseFramework === "iab" || lowercaseFramework === "iab1" || lowercaseFramework === "iabv2" || lowercaseFramework === "tcfv2.2" || lowercaseFramework === "tcfv2.3") {
              this.hasFramework = true;
              this.framework = "TCFv2.3";
              this.amznConsentSignalEnabled = false;
              this.computedConfiguration.framework = 'TCF';
              this.computedConfiguration.amznConsentSignalEnabled = false;
            }

            if (this.frameworkBlocked) {
                this.hasFramework = false;
                this.framework = "";
                this.computedConfiguration.framework = null;
            }

            loadInlineConfiguration(this);

            if (this.framework === "TCFv2.3") {
                window.propagateIABStub();
            }

            if (!this.consentModeDisabled) {
                this.pushGoogleConsent('set', 'developer_id.dMWZhNz', true);
            }

            if (hasFramework(this)) {
                window.__tcfapi('addEventListener', 2, (tcData, success) => {
                    if (success) {
                        latestTcData = tcData;
                    }
                });
            }

            if (this.amznConsentSignalEnabled) {
                setAcs();
            }

            //remove any empty entries from pathlist, since split on an empty string will return 1 empty item in array
            var temppathlist = [];
            for (var j = 0; j < this.pathlist.length; j++) {
                var currentpath = this.pathlist[j];
                if (currentpath !== "") {
                    if (currentpath.indexOf("/") !== 0) {
                        currentpath = "/" + currentpath;
                    }

                    temppathlist.push(decodeURIComponent(currentpath));
                }
            }
            this.pathlist = temppathlist;

            if (this.pathlist.length > 0) {
                this.userIsInPath = false;
                var userCurrentPath = window.location.pathname;
                if (userCurrentPath !== "/") {
                    for (var k = 0; k < this.pathlist.length; k++) {
                        if (userCurrentPath.toLowerCase().indexOf(this.pathlist[k].toLowerCase()) === 0) {
                            this.currentPath = this.pathlist[k];
                            this.userIsInPath = true;
                            break;
                        }
                    }
                }
                if (!this.userIsInPath) {
                    //do nothing but simulate a full consent if a path is defined but user is not currently on a url within a path
                    this.consented = true;
                    this.declined = false;
                    this.hasResponse = true;
                    this.consent.preferences = true;
                    this.consent.statistics = true;
                    this.consent.marketing = true;
                    this.consent.method = 'implied';
                    this.consentLevel = 'implied';
                }
            }

            if (this.userIsInPath) {
                var c = this.getCookie(this.name);

                //check if cookie already exists
                if (c) {
                    if (c === "-2") {  //second load after first show of dialog = implied consent has been given
                        this.declined = false;
                        this.consented = false;
                        this.hasResponse = false;
                        this.consent.preferences = false;
                        this.consent.statistics = false;
                        this.consent.marketing = false;
                        this.consent.method = 'implied';
                        this.consentLevel = 'implied';
                    }
                    else {
                        if (c === "0") {  //declined - deprecated
                            this.declined = true;
                            this.consent.preferences = false;
                            this.consent.statistics = false;
                            this.consent.marketing = false;
                            this.consent.method = 'implied';
                            this.responseMode = "leveloptin";
                        }
                        else {
                            this.hasResponse = true;
                            this.declined = false;
                            this.consented = true;
                            this.consent.preferences = true;
                            this.consent.statistics = true;
                            this.consent.marketing = true;
                            this.consent.method = this.consent.method || 'implied';
                            if (c === "-1") { //then the user is out of region
                                this.isOutsideEU = true;
                                this.isOutOfRegion = true;
                                this.version = this.latestVersion;
                                this.iframeReady = true;
                                this.consentUTC = new Date();
                                this.updateRegulations();
                            }
                        }
                        this.hasResponse = true;

                        if ((c !== "-1") && (!this.iframeReady)) {
                            //load bulk consent state in iframe to check whether reset of current consent is needed
                            if (this.bulkConsentEnabled) {
                                this.iframeReady = false;
                                this.loadCDNiFrame();
                            }
                            else {
                                this.iframeReady = true;
                            }
                        }
                    }

                    if ((c.indexOf("{") === 0) && (c.indexOf("}") > 0)) {
                        var consentJSON = c.replace(/%2c/g, ',').replace(/'/g, '"').replace(/([{\[,])\s*([a-zA-Z0-9_]+?):/g, '$1"$2":'); //convert to JSON
                        var consentObject = JSON.parse(consentJSON);
                        this.consentID = consentObject.stamp;
                        this.consent.stamp = consentObject.stamp;
                        this.consent.preferences = consentObject.preferences;
                        this.consent.statistics = consentObject.statistics;
                        this.consent.marketing = consentObject.marketing;
                        this.consent.method = consentObject.method || this.consent.method || 'implied';
                        this.isOutsideEU = this.consent.stamp === "-1";
                        this.isOutOfRegion = this.consent.stamp === "-1";

                        if ((!this.consent.preferences) && (!this.consent.statistics) && (!this.consent.marketing)) {
                            this.declined = true;
                            this.consented = false;
                            this.responseMode = "leveloptin";
                        }

                        if (typeof (consentObject.utc) !== "undefined") {
                            this.consentUTC = new Date(consentObject.utc);
                        }

                        // This code is needed until all IABv1 consents have expired
                        if (typeof (consentObject.iab) !== "undefined") {
                            this.IABConsentString = consentObject.iab;

                            // Force consent renewal if existing consent is based on version 1 of IAB framework and version 2 is active
                            if (hasFramework(this)) {
                                this.IABConsentString = "";
                                this.deleteConsentCookie();
                            }
                        }

                        if (hasFramework(this)) {
                            this.IABConsentString = getTcfConsentString() || consentObject.iab2 || '';
                        }

                        this.GACMConsentString = getGacmConsentString() || consentObject.gacm || '';

                        if (typeof (consentObject.region) !== "undefined") {
                            // Don't update if userCountry has been overridden.
                            if (this.userCountry === "") {
                                this.userCountry = consentObject.region;
                            }
                            this.updateRegulations();
                        }

                        if (typeof (consentObject.ver) !== "undefined") {//default to "1" for "old" consents
                            this.version = consentObject.ver;
                        }

                        this.responseMode = "leveloptin";
                    }
                    else {
                        this.consentID = c;
                        this.consent.stamp = c;
                    }

                    if (!this.changed) {
                        this.triggerGTMEvents();
                    }

                    if (this.amznConsentSignalEnabled) {
                        applyAcs(this);
                    }

                    this.signalMsConsentAPI(this.consent.marketing);
                    this.signalMsClarityConsentAPI(this.consent.marketing, this.consent.statistics);

                    this.signalGoogleConsentAPI(
                        this.consentModeDisabled,
                        this.consentModeDataRedaction,
                        this.consent.preferences,
                        this.consent.statistics,
                        this.consent.marketing
                    );
                }
                else { //no consent exists
                    if (this.isSpider()) {
                        this.setOutOfRegion();
                        return;
                    }
                    else {
                        if (this.bulkConsentEnabled) {
                            this.loadCDNiFrame();
                            if (!this.bulkconsentsubmitted) {
                                this.checkForBulkConsent();
                            }
                        }
                        else {
                            this.iframeReady = true;
                        }

                    }
                }

                //auto-blocker
                //only activate auto-blocker if the user has not submitted full consent to all categories
                if (
                    this.autoblock &&
                    !(this.consent.preferences && this.consent.statistics && this.consent.marketing)
                ) {
                    var hasTopLocation = false;
                    try { //may throw security exception if top not accessable
                        if (top && top.location) {
                            hasTopLocation = true;
                        }
                    } catch (event) { }

                    if (hasTopLocation && top.location.pathname.indexOf("wp-admin") >= 0) { //Disable autoblock in WP admin
                        this.autoblock = false;
                        this.computedConfiguration.blockingmode = "manual";
                    }
                    else {
                        //remove wildcards from commonTrackers
                        for (var l = 0; l < this.commonTrackers.domains.length; l++) {
                            var testDomain = this.commonTrackers.domains[l];
                            if (testDomain.d.substr(testDomain.d.length - 1, 1) === "*") {
                                testDomain.d = testDomain.d.substr(0, testDomain.d.length - 1);
                            }
                        }

                        //start the DOM mutation observer
                        this.initMutationObserver();
                    }
                }
            }


            this.initConsent();
        };

        this.initConsent = function () {
            var that = this;

            if (!this.settingsLoaded) {
                loadSettings(this);
            }

            //wait for bulk consent check to load
            var iframePromise = new Promise$1(function (resolve) {
                // Promise will be completed on timeout because the timeout sets iframeReady
                function checkIFrame() {
                    if (that.iframeReady) {
                        resolve();
                        return;
                    }
                    setTimeout(checkIFrame, 50);
                }

                checkIFrame();
            });

            var tcfPromise = new Promise$1(function (resolve) {
                if (!hasFramework(that) || that.frameworkLoaded)
                {
                    resolve();
                    return;
                }

                var consentUrl = that.host + "Framework/IAB/consent-sdk-2.3.js";

                that.getScript(consentUrl, false, function () {
                    window.CookieConsentIABCMP.initFramework();
                    that.frameworkLoaded = true;
                    resolve();
                });
            });

            // This needs to be called before createBannerPromise
            this.setDNTState();

            this.setHeaderStyles();

            // Load banner if no consent has been given yet
            var bannerPromise = this.consented || this.declined ? resolvedPromise : createBanner(that, false);

            Promise$1.all([
                // Wait for up to 2000 ms for bulk consent iframe to load
                Promise$1.race([iframePromise, createTimeoutPromise(that.Promise, 2000)])
                    .then(function(){
                        that.iframeReady = true;
                    }),
                // Wait for up to 2000 ms for TCF SDK file to load
                Promise$1.race([tcfPromise, createTimeoutPromise(that.Promise, 2000)]),
                // Load banner if consent is needed
                bannerPromise
            ])
                .then(function () {
                    if (that.consented || that.declined) {
                        that.signalConsentReady();
                        that.setOnload();
                        return resolvedPromise;
                    }

                    //register event handler to submit implied consent on click on an element
                    document.addEventListener("click", that.submitImpliedConsent, true);

                    window.CookieConsentDialog && window.CookieConsentDialog.init();
                    that.changed = true;

                    if (!document.body) { //then the page has not finished loading
                        window.addEventListener("load", that.cbonloadevent, false);
                    }
                    else {
                        that.cbonloadevent();
                    }

                    return resolvedPromise;
                });
        };

        this.signalWindowLoad = function () {
            window.CookieConsent.windowOnloadTriggered = true;
            window.removeEventListener("load", window.CookieConsent.signalWindowLoad);
            window.CookieConsent.stopMutationObserver();
        };

        this.registerGeoRegions = function (geodata) {
            if (this.geoRegions && (this.geoRegions.length === 0)) { //only register regions if they have not already been defined
                if (geodata && geodata.length > 0) {
                    var JSONversion = "{\"configs\": [" + geodata.replace(/ /g, '').replace(/'/g, '"') + "]}";
                    try { //geodata may be corrupt by input from tag attribute or URL
                        var jsonArray = JSON.parse(JSONversion);
                        if (jsonArray.configs) {
                            for (var i = 0; i < jsonArray.configs.length; i++) {
                                if (jsonArray.configs[i].region && jsonArray.configs[i].cbid) {
                                    this.geoRegions.push({ r: jsonArray.configs[i].region, i: jsonArray.configs[i].cbid });
                                }
                            }
                        }
                    }
                    catch (e) { console.warn("ERROR IN GEOREGIONS ATTRIBUTE VALUE - NOT A VALID JSON ARRAY: " + geodata); }
                }
            }
        };

        var IMPLIED_TRIGGER_PATTERN = /(\s+|^)cookieconsent-implied-trigger(\s+|$)/i;

        function isImpliedConsentTrigger(target) {
            return target && target.nodeType === 1 && ((target.tagName === "A" || target.tagName === "BUTTON") || IMPLIED_TRIGGER_PATTERN.test(target.className));
        }

        var COMMAND_LINK_PATTERN = /javascript:.*\b(CookieConsent|Cookiebot)\b/;

        function isCommandLink(target) {
            return target.tagName === "A" && COMMAND_LINK_PATTERN.test(target.href);
        }

        function isStorageSupported() {
            try {
                var key = "cookiebottest";
                localStorage.setItem(key, key);
                localStorage.removeItem(key);
                return true;
            } catch (ignore) {
                return false; // Storage not supported - IE. Safari when cookies are disabled in the security settings
            }
        }

        this.submitImpliedConsent = function (event) {
            if (
                (typeof window.CookieConsent === 'object') &&
                !window.CookieConsent.hasResponse &&
                (typeof window.CookieConsentDialog === 'object') &&
                (window.CookieConsentDialog.consentLevel === 'implied') &&
                !window.CookieConsent.mutationFallback
            ) {
                var target = event.target;

                while (target) {
                    if (isImpliedConsentTrigger(target)) {
                        break;
                    } else {
                        target = target.parentNode;
                    }
                }

                if (!target) {
                    return; // the event target does not trigger implied consent
                }

                var parent = target;

                while (parent) {
                    if ((parent["id"]) && (parent["id"] === window.CookieConsentDialog.DOMid || parent["id"] === 'CybotCookiebotDialogWrapper')) {
                        return; // target is a child of the consent banner: does not trigger implied consent
                    }
                    parent = parent.parentNode;
                }

                if (isCommandLink(target)) {
                    return; // target is a Cookiebot command-link: does not trigger implied consent
                }

                if (window.CookieConsent.responseMode === 'optout' && navigator.globalPrivacyControl === true) {
                    window.CookieConsent.submitCustomConsent(false, false, false, true);
                    window.CookieConsent.hide();
                    window.CookieConsentDialog.createAndShowGpcToast();
                } else {
                    window.CookieConsent.submitConsent(true, window.location.href, false);
                }

                // Remove this handler, so as not to trigger it again - implicit consent happens only once:
                document.removeEventListener("click", window.CookieConsent.submitImpliedConsent, true);

                if ((typeof window.performance === "object") && (typeof window.performance.getEntriesByType === "function")) {
                    this.performanceEntriesCounter = window.performance.getEntriesByType("resource").length;
                }

                setTimeout(function () {
                    window.CookieConsent.processLinkClick(event.target);
                }, 1000);

                if (event.bubbles) {
                    event.stopPropagation();
                }

                event.preventDefault();
            }
        };

        this.cbonloadevent = function () {
            if (typeof (window.CookieConsent) === 'object') {
                window.CookieConsent.loaded = true;
            }

            setTimeout(function () {

                if (typeof (window.CookieConsent) === 'object') {
                    window.CookieConsent.applyDisplay();
                }

                //update statuslabel if user is on page with injected cookie declaration
                if ((typeof (window.CookieDeclaration) !== 'undefined') && (typeof (window.CookieDeclaration.SetUserStatusLabel) === "function")) {
                    window.CookieDeclaration.SetUserStatusLabel();
                }

                if (typeof (window.CookieConsentDialog) === 'object') {
                    window.CookieConsentDialog.pageHasLoaded = true; //signal onload to the dialog scroll monitor
                }
            }, 1000); //wait 1s - because the browser may trigger a scroll if the user refreshes the browser from the middle of a page and then the browser scrolls to same position
        };

        this.processLinkClickCounter = 0;
        this.performanceEntriesCounter = 0;

        this.processLinkClick = function (waittarg) {

            this.processLinkClickCounter += 1;
            var currentPerformanceEntriesCount = 0;

            if ((typeof window.performance === "object") && (typeof window.performance.getEntriesByType === "function")) {
                currentPerformanceEntriesCount = window.performance.getEntriesByType("resource").length;
            }
            else {
                this.performanceEntriesCounter = 0;
            }

            if ((this.performanceEntriesCounter !== currentPerformanceEntriesCount) && (this.processLinkClickCounter < 6)) {
                this.performanceEntriesCounter = currentPerformanceEntriesCount;
                setTimeout(function () {
                    window.CookieConsent.processLinkClick(waittarg);
                }, 1000);
            }
            else {
                this.processLinkClickCounter = 0;
                this.performanceEntriesCounter = 0;

                var evt = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                waittarg.dispatchEvent(evt);
            }
        };

        this.loadCDNiFrame = function () { //used to store bulkconsent
            var that = this;
            if (!document.body) { //wait for body to load
                setTimeout(function () {
                    window.CookieConsent.loadCDNiFrame();
                }, 100);
            }
            else {
                if (!this.iframe) {
                    applyRuntimeStylesheet(document, this.nonce);
                    this.iframe = document.createElementOrig("iframe");
                    this.iframe.classList.add(OFFSCREEN_IFRAME_CLASS);
                    this.iframe.tabIndex = -1;
                    this.iframe.setAttribute("role", "presentation"); //hide iframe from screen readers
                    this.iframe.setAttribute("aria-hidden", "true"); //hide iframe from screen readers
                    this.iframe.setAttribute("title", "Blank"); //enable passing of accessablility test
                    document.body.appendChild(this.iframe);

                    this.iframe.addEventListener("load", function () {
                        that.readBulkConsent();
                    }, false);
                    window.addEventListener("message", function (event) {
                        //This is simple validation check to make snyk alert disappear
                        // as it does not recognize more comprehensive check
                        // such as one below on line 1200
                        // TODO: remove once snyk is phased out
                        if(event.origin === '') {
                            return
                        }

                        if(!event.origin.startsWith("https")) {
                            console.warn('Ignoring Unsecure message event origin:', event.origin);
                            return;
                        }

                        that.handleBulkConsentIframeMessage(event);
                    }, false);
                }

                if (this.iframe && !this.iframeReady) {
                    // Prod
                    this.iframe.src = this.CDN + "/sdk/bc-v4.min.html";
                    // Test & Dev
                    //this.iframe.src = this.CDN + "/CDN/sdk/bc-v4.html";
                }
                else {
                    this.iframeReady = true;
                }
            }
        };

        this.readBulkConsent = function () {
            if (window.CookieConsent && window.CookieConsent.iframe != null && (typeof window.CookieConsent.iframe.contentWindow !== 'undefined')) {
                var postObj = {
                    action: "get",
                    serial: this.serial.toLowerCase()
                };

                try {
                    // Triggers handleBulkConsentIframeMessage below
                    window.CookieConsent.iframe.contentWindow.postMessage(postObj, this.CDN);
                } catch (e) {
                    window.CookieConsent.iframeReady = true;
                }
            } else {
                window.CookieConsent.iframeReady = true;
            }
        };

        this.handleBulkConsentIframeMessage = function (event) {
            if (!event || !event.origin || !event.data || event.origin !== this.CDN) {
                return;
            }

            try { //to prevent errors triggered by unauthorized calls from third party scripts
                var bulkConsentData = event.data;

                if (typeof bulkConsentData === "string") {
                    if (bulkConsentData === "bcEmpty") {
                        this.bulkresetdomains = [];
                        window.CookieConsent.iframeReady = true;
                        return;
                    }

                    bulkConsentData = JSON.parse(bulkConsentData);
                }

                // For backwards compatibility
                if (bulkConsentData.value) {
                    bulkConsentData = bulkConsentData.value;
                }

                this.bulkresetdomains = bulkConsentData.resetdomains;

                if (bulkConsentData.bulkconsent) {
                    this.bulkconsent = bulkConsentData.bulkconsent;

                    // Check if bulk consent has expired - force new consent if so
                    if (bulkConsentData.bulkconsent.utc) {
                        var expireMonths = bulkConsentData.bulkconsent.expireMonths;

                        if (expireMonths === undefined) {
                            // expireMonths should always be "something", so default to 12 months if consentLifeTime hasn't been set.
                            expireMonths = isNaN(this.consentLifetime) ? 12 : this.consentLifetime;
                        }

                        // It's local storage. Check if it should be expired.
                        if (expireMonths !== 0) {
                            var expireDate = new window.CookieControl.DateTime(bulkConsentData.bulkconsent.utc).addMonths(expireMonths);

                            if (expireDate < new Date()) {
                                this.removeBulkReset();
                                this.deleteConsentCookie();
                                this.init();
                                return;
                            }
                        }
                    }
                } else {
                    this.bulkresetdomains = [];
                }
            } catch (e) {
                // Ignored
            }

            window.CookieConsent.iframeReady = true;
        };

        this.checkForBulkConsent = function () {
            //wait for bulk reset domains to load
            var that = this;
            if (!this.iframeReady && this.bulkConsentFrameRetryCounter < 40) {
                this.bulkConsentFrameRetryCounter++;
                setTimeout(function() {
                    that.checkForBulkConsent();
                }, 50); //wait for bulk consent check to load
                return;
            } else {
                this.iframeReady = true;
                this.bulkConsentFrameRetryCounter = 0;
            }

            //Check if existing bulk consent must renew
            if ((this.bulkresetdomains.length > 0) && (!this.changed)) {
                var domainmustrenew = false;
                var currentHost = window.location.hostname.toLowerCase();
                var althost = currentHost;
                if (currentHost.indexOf("www.") === 0) {
                    althost = althost.substring(4);
                }
                else {
                    althost = "www." + althost;
                }
                for (var j = 0; j < this.bulkresetdomains.length; j++) {
                    if ((currentHost === this.bulkresetdomains[j]) || (althost === this.bulkresetdomains[j])) {
                        domainmustrenew = true;
                        break;
                    }
                }
                if (domainmustrenew && this.iframe) {

                    this.isbulkrenewal = true;
                    if (this.bulkconsent != null) {
                        //Bulk consent needs "preferences" consent on either the bulk or current site, skip if neither has it.
                        if (!this.bulkconsent.preferences && !this.consent.preferences) {
                            this.removeCurrentDomainBulkReset();
                            return;
                        }

                        this.consent.preferences = false;
                        this.consent.statistics = false;
                        this.consent.marketing = false;

                        if (this.bulkconsent.iab2 && hasFramework(this)) {
                            this.IABConsentString = this.bulkconsent.iab2;
                        }
                        if (this.bulkconsent.gacm) {
                            this.GACMConsentString = this.bulkconsent.gacm;
                        }
                        this.bulkconsentsubmitted = true;
                        this.submitCustomConsent(this.bulkconsent.preferences, this.bulkconsent.statistics, this.bulkconsent.marketing);
                        return;
                    }
                    else {
                        this.deleteConsentCookie();
                        this.removeCurrentDomainBulkReset();
                        this.init();
                        return;
                    }
                }
            }
        };

        this.deleteConsentCookie = function () {
            document.cookie = this.name + "=;Path=/;expires=Thu, 01-Jan-1970 00:00:01 GMT";
            this.consent.preferences = false;
            this.consent.statistics = false;
            this.consent.marketing = false;
            this.consent.method = null;
            this.hasResponse = false;
            this.consented = false;
            this.declined = false;
        };

        this.resetBulkDomains = function (newDomains, updateStorage) {
            if (this.iframe && (newDomains.length > 0)) {
                for (var i = 0; i < newDomains.length; i++) {
                    var domainExists = false;
                    for (var j = 0; j < this.bulkresetdomains.length; j++) {
                        if (newDomains[i] === this.bulkresetdomains[j]) {
                            domainExists = true;
                            break;
                        }
                    }
                    if (!domainExists) {
                        this.bulkresetdomains.push(newDomains[i]);
                    }
                }

                //filter out current domain and alias
                var currentHost = window.location.hostname.toLowerCase();
                var altHost = currentHost;
                if (currentHost.indexOf("www.") === 0) {
                    altHost = altHost.substring(4);
                }
                else {
                    altHost = "www." + altHost;
                }
                this.bulkresetdomains = this.bulkresetdomains.filter(function (item) {
                    return item !== currentHost && item !== altHost;
                });

                //save them to localstorage
                if (updateStorage && window.CookieConsent && window.CookieConsent.iframe != null && window.CookieConsent.iframe.contentWindow) {
                    this.updateBulkStorage();
                }
            }
        };

        this.removeBulkReset = function () {
            this.bulkresetdomains = [];
            this.bulkconsent = null;
            if (this.iframe && this.iframe.contentWindow) {
                var postObj = {
                    action: "remove",
                    value: "",
                    serial: this.serial.toLowerCase()
                };
                this.iframe.contentWindow.postMessage(postObj, this.CDN);
            }
        };

        this.removeCurrentDomainBulkReset = function () {
            this.isbulkrenewal = false;
            var currentHost = window.location.hostname.toLowerCase();
            var althost = currentHost;
            if (currentHost.indexOf("www.") === 0) {
                althost = althost.substring(4);
            }
            else {
                althost = "www." + althost;
            }

            //update localstorage list - remove current domain
            if (this.bulkresetdomains.length > 0) {
                this.bulkresetdomains = this.bulkresetdomains.filter(function (item) {
                    return ((item !== currentHost) && (item !== althost))
                });
            }

            //update domain list in local storage
            this.updateBulkStorage();
        };

        this.registerBulkConsent = function (expireMonths) {
            // Cross-domain consent sharing in localStorage requires "preferences" category consent, but if bulk consent already exists we propagate consent changes.
            if (!this.consent.preferences && this.bulkconsent == null) {
                return;
            }

            this.consentLifetime = isNaN(expireMonths) ? this.consentLifetime || 12 : expireMonths;

            var ticketid = this.consentID;
            var ticketutc = this.consentUTC;
            if (ticketutc == null) {
                ticketutc = new Date();
            }
            if ((this.bulkconsent != null) && (this.changed)) { //don't change bulk ticket and bulk consent date if set on earlier visit
                if (typeof this.bulkconsent.ticket !== 'undefined') {
                    ticketid = this.bulkconsent.ticket;
                }
                if (typeof this.bulkconsent.utc !== 'undefined') {
                    ticketutc = new Date(this.bulkconsent.utc);
                }
            }
            this.bulkconsent = {
                ticket: ticketid,
                utc: ticketutc.getTime(),
                expireMonths: this.consentLifetime,
                preferences: this.consent.preferences,
                statistics: this.consent.statistics,
                marketing: this.consent.marketing
            };
            if (hasFramework(this) && this.frameworkLoaded) {

                this.bulkconsent.iab2 = this.IABConsentString;
                this.bulkconsent.gacm = this.GACMConsentString;
            }
            this.updateBulkStorage();
        };

        this.updateBulkStorage = function () {
            if (this.iframe) {
                try {
                    var postObj = {
                        action: "set",
                        value: {
                            resetdomains: this.bulkresetdomains,
                            bulkconsent: this.bulkconsent,
                            expireMonths: isNaN(this.bulkconsent.expireMonths) ? 12 : this.bulkconsent.expireMonths,
                            serial: this.serial.toLowerCase()
                        },
                        serial: this.serial.toLowerCase()
                    };
                    this.iframe.contentWindow.postMessage(postObj, this.CDN);
                } catch (e) {
                    // Ignore
                }
            }
        };

        this.signalConsentFramework = function () {
            if (this.hasFramework && !this.frameworkLoaded) {
                setTimeout(function () {
                    window.CookieConsent.signalConsentFramework();
                }, 50);
            }
        };

        this.cloneScriptTag = function(currentTag) {
            return cloneScriptTag(document, currentTag)
        };

        this.runScripts = function () {
            var that = this;
            var tagContainer = [];
            var deferTagContainer = [];

            var tagsAll = document.getElementsByTagName("script");
            for (var i = 0; i < tagsAll.length; i++) {
                var currentTag = tagsAll[i];
                if (
                    currentTag.hasAttribute("data-cookieconsent") &&
                    currentTag.hasAttribute("type") &&
                    (currentTag.getAttribute("type").toLowerCase() === "text/plain") &&
                    (currentTag.getAttribute("data-cookieconsent").toLowerCase() !== "ignore") &&
                    (typeof currentTag.cookiesProcessed === 'undefined')
                ) {
                    if (currentTag.hasAttribute("defer")) {
                        currentTag.removeAttribute("defer");
                        deferTagContainer.push(currentTag);
                    }
                    else {
                        tagContainer.push(currentTag);
                    }
                    //Prevent duplicate processing of any script tag,
                    //e.g. when using GTM in combination with auto-blocker where first level script tags are loaded from GTM before MutationObserver is launched.
                    currentTag.cookiesProcessed = 1;
                }
            }

            //load defer script tags last
            for (var j = 0; j < deferTagContainer.length; j++) {
                tagContainer.push(deferTagContainer[j]);
            }

            that.RunScriptTags(tagContainer);

            that.RunSrcTags("iframe");
            that.RunSrcTags("img");
            that.RunSrcTags("embed");
            that.RunSrcTags("video");
            that.RunSrcTags("audio");
            that.RunSrcTags("picture");
            that.RunSrcTags("source");

            if (typeof window.CB_OnTagsExecuted_Processed === 'undefined') { //only run once
                window.CB_OnTagsExecuted_Processed = 1;
                var event;
                if (window.CookieConsent.ontagsexecuted) {
                    window.CookieConsent.ontagsexecuted();
                }
                if (typeof window.CookiebotCallback_OnTagsExecuted === "function") {
                    window.CookiebotCallback_OnTagsExecuted();
                }
                else if (typeof window.CookieConsentCallback_OnTagsExecuted === "function") {
                    window.CookieConsentCallback_OnTagsExecuted();
                }

                event = document.createEvent('Event');
                event.initEvent('CookiebotOnTagsExecuted', true, true);
                window.dispatchEvent(event);

                event = document.createEvent('Event');
                event.initEvent('CookieConsentOnTagsExecuted', true, true);
                window.dispatchEvent(event);
            }
        };

        this.RunScriptTags = function (tagContainer) {
            runScriptTags(window, this, tagContainer);
        };

        this.RunSrcTags = function (tagName) {
            var elementsAll = document.getElementsByTagName(tagName);
            var elementContainer = [];

            for (var i = 0; i < elementsAll.length; i++) {
                var currentElement = elementsAll[i];
                if (
                    currentElement.hasAttribute("data-cookieconsent") &&
                    (currentElement.hasAttribute("data-src") || currentElement.hasAttribute("data-cookieblock-src")) &&
                    (currentElement.getAttribute("data-cookieconsent").toLowerCase() !== "ignore")
                ) {
                    elementContainer.push(currentElement);
                }
            }
            for (var j = 0; j < elementContainer.length; j++) {
                var currentElementContainer = elementContainer[j];
                var tagConsentLevels = currentElementContainer.getAttribute("data-cookieconsent").toLowerCase().split(",");
                var canExecute = true;
                for (var k = 0; k < tagConsentLevels.length; k++) {
                    var consentReq = tagConsentLevels[k].replace(/^\s*/, "").replace(/\s*$/, "");

                    if (consentReq === "preferences") {
                        this.addClass(currentElementContainer, "cookieconsent-optin-preferences");
                        if (!window.CookieConsent.consent.preferences) {
                            canExecute = false;
                        }
                    }

                    if (consentReq === "statistics") {
                        this.addClass(currentElementContainer, "cookieconsent-optin-statistics");
                        if (!window.CookieConsent.consent.statistics) {
                            canExecute = false;
                        }
                    }

                    if (consentReq === "marketing") {
                        this.addClass(currentElementContainer, "cookieconsent-optin-marketing");
                        if (!window.CookieConsent.consent.marketing) {
                            canExecute = false;
                        }
                    }
                }
                if (canExecute) {
                    if (currentElementContainer.hasAttribute("data-cookieblock-src")) {
                        currentElementContainer.src = currentElementContainer.getAttribute("data-cookieblock-src");
                        currentElementContainer.removeAttribute("data-cookieblock-src");
                    }
                    else if (currentElementContainer.hasAttribute("data-src")) {
                        currentElementContainer.src = currentElementContainer.getAttribute("data-src");
                        currentElementContainer.removeAttribute("data-src");
                    }
                    this.displayElement(currentElementContainer);
                }
                else {
                    this.hideElement(currentElementContainer);
                }
            }
        };

        this.applyDisplay = function () {
            //auto-apply classes to iframes
            var iframesAll = document.getElementsByTagName("iframe");
            for (var i = 0; i < iframesAll.length; i++) {
                var currentIframe = iframesAll[i];
                if (
                    currentIframe.hasAttribute("data-cookieconsent") &&
                    (currentIframe.hasAttribute("data-src") || currentIframe.hasAttribute("data-cookieblock-src"))
                ) {
                    var requiredCategories = currentIframe.getAttribute("data-cookieconsent").replace('/ /g', '').toLowerCase().split(',');
                    for (var j = 0; j < requiredCategories.length; j++) {
                        if (requiredCategories[j] === "preferences") {
                            this.addClass(currentIframe, "cookieconsent-optin-preferences");
                        }
                        if (requiredCategories[j] === "statistics") {
                            this.addClass(currentIframe, "cookieconsent-optin-statistics");
                        }
                        if (requiredCategories[j] === "marketing") {
                            this.addClass(currentIframe, "cookieconsent-optin-marketing");
                        }

                    }
                }
            }

            var consetElementsClassesArray = [
                ".cookieconsent-optout-preferences",
                ".cookieconsent-optout-statistics",
                ".cookieconsent-optout-marketing",
                ".cookieconsent-optin-preferences",
                ".cookieconsent-optin-statistics",
                ".cookieconsent-optin-marketing",
                ".cookieconsent-optin",
                ".cookieconsent-optout"
            ];
            var consentElementsClasses = consetElementsClassesArray.join(',');
            var consentElements = document.querySelectorAll(consentElementsClasses);

            for (var k = 0; k < consentElements.length; k++) {

                var showElement = true;

                if (
                    (this.hasClass(consentElements[k], "cookieconsent-optin") && !window.CookieConsent.consented) ||
                    (this.hasClass(consentElements[k], "cookieconsent-optin-preferences") && !window.CookieConsent.consent.preferences) ||
                    (this.hasClass(consentElements[k], "cookieconsent-optin-statistics") && !window.CookieConsent.consent.statistics) ||
                    (this.hasClass(consentElements[k], "cookieconsent-optin-marketing") && !window.CookieConsent.consent.marketing) ||
                    (this.hasClass(consentElements[k], "cookieconsent-optout") && window.CookieConsent.consented) ||
                    (this.hasClass(consentElements[k], "cookieconsent-optout-preferences") && window.CookieConsent.consent.preferences) ||
                    (this.hasClass(consentElements[k], "cookieconsent-optout-statistics") && window.CookieConsent.consent.statistics) ||
                    (this.hasClass(consentElements[k], "cookieconsent-optout-marketing") && window.CookieConsent.consent.marketing)
                ) {
                    showElement = false;
                }

                if (
                    (this.hasClass(consentElements[k], "cookieconsent-optout-preferences") && !window.CookieConsent.consent.preferences) ||
                    (this.hasClass(consentElements[k], "cookieconsent-optout-statistics") && !window.CookieConsent.consent.statistics) ||
                    (this.hasClass(consentElements[k], "cookieconsent-optout-marketing") && !window.CookieConsent.consent.marketing)
                ) {
                    showElement = true;
                }

                if (showElement) {
                    this.displayElement(consentElements[k]);
                }
                else {
                    this.hideElement(consentElements[k]);
                }
            }
        };

        this.hideElement = function (HTMLElement) {
            if ((HTMLElement.tagName === "SOURCE") && (HTMLElement.parentNode)) {
                HTMLElement = HTMLElement.parentNode;
            }
            applyRuntimeStylesheet(document, this.nonce);
            HTMLElement.setAttribute(DATA_DISPLAY_NONE, "true");
        };

        this.displayElement = function (HTMLElement) {
            if ((HTMLElement.tagName === "SOURCE") && (HTMLElement.parentNode)) {
                HTMLElement = HTMLElement.parentNode;

                if (HTMLElement.tagName === "AUDIO") {
                    HTMLElement.load(); //reload the audio element when unblocking a source child element
                }
            }
            if (HTMLElement.hasAttribute && HTMLElement.hasAttribute(DATA_DISPLAY_NONE)) {
                HTMLElement.removeAttribute(DATA_DISPLAY_NONE);
            }
        };

        this.registerDisplayState = function () {
            // Deprecated: the DATA_DISPLAY_NONE hide/show approach restores the element's
            // CSS-defined display naturally when the attribute is removed, so no
            // pre-measurement is required. Kept for backwards-compatible call sites.
        };

        this.hasClass = function (HTMLElement, cls) {
            return (HTMLElement.className && HTMLElement.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)')));
        };

        this.addClass = function (HTMLElement, cls) {
            if (!this.hasClass(HTMLElement, cls)) {
                HTMLElement.className += " " + cls;
            }
        };

        this.removeClass = function (HTMLElement, cls) {
            if (this.hasClass(HTMLElement, cls)) {
                HTMLElement.className = HTMLElement.className.replace(cls, "");
            }
        };

        this.setOnload = function () {
            //load version state from CDN
            var that = this;
            if (!this.isOutOfRegion) {
                setTimeout(function () {
                    if (!that.versionRequested) {
                        that.versionRequested = true;
                        if (!that.versionChecked) {
                            that.getScript(that.CDN + "/consentconfig/" + that.serial + "/state.js", true, function () {
                                that.versionChecked = true;
                            });
                        }
                    }
                }, 1);
            }
            else {
                this.versionRequested = true;
                this.versionChecked = true;
            }

            //wait for bulk reset domains to load
            if (!this.iframeReady && this.setOnloadFrameRetryCounter < 40) {
                this.setOnloadFrameRetryCounter++;
                setTimeout(function() {
                    that.setOnload();
                }, 50); //wait for bulk consent check to load
                return;
            } else {
                this.iframeReady = true;
                this.setOnloadFrameRetryCounter = 0;
            }

            if (!this.bulkconsentsubmitted) {
                this.checkForBulkConsent();
            }

            if (!this.mutationFallback) { //triggerOnloadEvents will be called directly when finished processing mutation fallback
                if (!document.body) {
                    window.addEventListener("load", that.triggerOnloadEvents.bind(that), false);
                }
                else {
                    if ((typeof document.readyState) === "string") {
                        if (document.readyState === 'complete') {
                            setTimeout(function () {
                                that.triggerOnloadEvents();
                            }, 1); //wait for CookieConsent to construct using setTimeout
                        }
                        else {
                            setTimeout(function () {
                                that.setOnload();
                            }, 100); //wait for all elements to load
                            return;
                        }
                    }
                    else { //readyState not supported by visitors browser
                        setTimeout(function () {
                            that.triggerOnloadEvents();
                        }, 500); //wait for CookieConsent to construct using setTimeout
                    }
                }
            }

            this.initWidget();
        };

        this.triggerOnloadEvents = function () {
            //check if global consent version has loaded
            if ((!this.versionChecked) && (this.retryCounter < 10)) {
                this.retryCounter += 1;
                setTimeout(function () {
                    window.CookieConsent.triggerOnloadEvents();
                }, 100); //wait for consent version check to load
            }
            else {
                this.retryCounter = 0;
                this.loaded = true;

                //check if new consent must be collected
                if (this.version < this.latestVersion) {
                    this.isNewVersion = true;
                    this.consent.preferences = false;
                    this.consent.statistics = false;
                    this.consent.marketing = false;
                    this.consent.method = null;
                    this.hasResponse = false;
                    this.consented = false;
                    this.declined = false;
                    this.changed = true;

                    if ((typeof (window.CookieDeclaration) !== 'undefined') && (typeof (window.CookieDeclaration.SetUserStatusLabel) === "function")) {
                        window.CookieDeclaration.SetUserStatusLabel();
                    }

                    window.CookieConsent.applyDisplay();

                    this.show(false, true);
                    return;
                }

                window.CookieConsent.applyDisplay();

                //update statuslabel if user is on page with injected cookie declaration
                if ((typeof (window.CookieDeclaration) !== 'undefined') && (typeof (window.CookieDeclaration.SetUserStatusLabel) === "function")) {
                    window.CookieDeclaration.SetUserStatusLabel();
                }

                var event;

                if (window.CookieConsent.onload) {
                    window.CookieConsent.onload();
                }

                if (typeof window.CookiebotCallback_OnLoad === "function") {
                    window.CookiebotCallback_OnLoad();
                }
                else if (typeof window.CookieConsentCallback_OnLoad === "function") {
                    window.CookieConsentCallback_OnLoad();
                }

                event = document.createEvent('Event');
                event.initEvent('CookiebotOnLoad', true, true);
                window.dispatchEvent(event);

                event = document.createEvent('Event');
                event.initEvent('CookieConsentOnLoad', true, true);
                window.dispatchEvent(event);

                if (this.changed) { //only fire these events when cookie consent is new/changed, as they otherwise will fire automatically in GTM
                    this.triggerGTMEvents();
                }

                //trigger accept/decline events on load
                if (window.CookieConsent.consented) {
                    if (window.CookieConsent.onaccept) {
                        window.CookieConsent.onaccept();
                    }
                    if (typeof window.CookiebotCallback_OnAccept === "function") {
                        window.CookiebotCallback_OnAccept();
                    }
                    else if (typeof window.CookieConsentCallback_OnAccept === "function") {
                        window.CookieConsentCallback_OnAccept();
                    }

                    event = document.createEvent('Event');
                    event.initEvent('CookiebotOnAccept', true, true);
                    window.dispatchEvent(event);

                    event = document.createEvent('Event');
                    event.initEvent('CookieConsentOnAccept', true, true);
                    window.dispatchEvent(event);

                    window.CookieConsent.runScripts();
                }
                else {
                    if (window.CookieConsent.ondecline) {
                        window.CookieConsent.ondecline();
                    }
                    if (typeof window.CookiebotCallback_OnDecline === "function") {
                        window.CookiebotCallback_OnDecline();
                    }
                    else if (typeof window.CookieConsentCallback_OnDecline === "function") {
                        window.CookieConsentCallback_OnDecline();
                    }

                    event = document.createEvent('Event');
                    event.initEvent('CookiebotOnDecline', true, true);
                    window.dispatchEvent(event);

                    event = document.createEvent('Event');
                    event.initEvent('CookieConsentOnDecline', true, true);
                    window.dispatchEvent(event);
                }

                window.CookieConsent.signalConsentFramework();

                //remove current domain name from bulk reset list if no consent exists for the domain
                if (this.iframe && (!(this.consented || this.declined))) {
                    var currentHost = window.location.hostname.toLowerCase();
                    var althost = currentHost;
                    if (currentHost.indexOf("www.") === 0) {
                        althost = althost.substring(4);
                    }
                    else {
                        althost = "www." + althost;
                    }

                    this.bulkresetdomains = this.bulkresetdomains.filter(function (item) {
                        return ((item !== currentHost) && (item !== althost))
                    });

                    this.updateBulkStorage();
                }
            }
        };

        this.getGTMDataLayer = function () {
            if (window[this.dataLayerName] == null) {
                window[this.dataLayerName] = []; // create default GTM data-layer stub
            }

            if (Array.isArray(window[this.dataLayerName])) {
                return window[this.dataLayerName];
            }

            return []; // mock data-layer: GTM data-layer is unavailable
        };

        this.getMsDataLayer = function() {
          window.uetq = window.uetq || [];
          return window.uetq;
        };

        this.triggerGTMEvents = function () {
            if (this.consent.preferences) {
                this.getGTMDataLayer().push({ 'event': 'cookie_consent_preferences' });
            }
            if (this.consent.statistics) {
                this.getGTMDataLayer().push({ 'event': 'cookie_consent_statistics' });
            }
            if (this.consent.marketing) {
                this.getGTMDataLayer().push({ 'event': 'cookie_consent_marketing' });
            }
        };

        this.signalMsConsentAPI = function(consentMarketing) {
            if (!this.msConsentModeDisabled) {
                this.getMsDataLayer().push('consent', 'update', {
                    'ad_storage': (consentMarketing ? 'granted' : 'denied')
                });
            }
        };

        this.signalMsClarityConsentAPI = function(consentMarketing, consentStatistics) {
            if (this.msClarityConsentModeEnabled && window.clarity) {
                window.clarity('consentv2', {
                    'source': MS_CLARITY_CMP_SOURCE_ID,
                    'ad_Storage': (consentMarketing ? 'granted' : 'denied'),
                    'analytics_Storage': (consentStatistics ? 'granted' : 'denied')
                });
            }
        };

        this.signalGoogleConsentAPI = function (googleConsentModeDisabled, dataRedactionMode, consentPreferences, consentStatistics, consentMarketing) {
            if (!googleConsentModeDisabled) {
                this.pushGoogleConsent('consent', 'update', {
                    'ad_storage': (consentMarketing ? 'granted' : 'denied'),
                    'ad_user_data': (consentMarketing ? 'granted' : 'denied'),
                    'ad_personalization': (consentMarketing ? 'granted' : 'denied'),
                    'analytics_storage': (consentStatistics ? 'granted' : 'denied'),
                    'functionality_storage': (consentPreferences ? 'granted' : 'denied'),
                    'personalization_storage': (consentPreferences ? 'granted' : 'denied'),
                    'security_storage': 'granted'
                });

                if (dataRedactionMode === 'dynamic') { // ads_data_redaction is handled by the GTM template when using true / false
                    this.pushGoogleConsent('set', 'ads_data_redaction', !consentMarketing);
                }

                //used with GTM Consent Mode feature 'Additional Consent' to fire tags in GTM that do not support GTM built-in consent. Must be called after pushGoogleConsent.
                this.getGTMDataLayer().push({ 'event': 'cookie_consent_update' });
            }
        };

        this.pushGoogleConsent = function gtag() {
            this.getGTMDataLayer().push(arguments);
        };

        this.show = function (isRenewal, shouldResetCookies) {
            if (!isRenewal) {
                this.forceShow = true;
            }

            if (this.cookieEnabled) {
                this.hasResponse = false;
                this.process(isRenewal, shouldResetCookies);
            } else if (isRenewal) {
                alert('Please enable cookies in your browser to proceed.');
            }
        };

        this.hide = function () {
            if (typeof (window.CookieConsentDialog) === 'object') {
                window.CookieConsentDialog.hide(true);
            }
        };

        this.renew = function () {
            this.isRenewal = true;
            this.show(true);

            setTimeout(function () { //show details pane if inline optin
                if (typeof (window.CookieConsentDialog) === 'object') {
                    if (window.CookieConsentDialog.responseMode === "inlineoptin") {
                        window.CookieConsentDialog.toggleDetails();
                    }
                }
            }, 300);
        };

        this.getURLParam = function (paramName) {
            var d = document.getElementById(this.scriptId) || this.scriptElement;
            var urlParam = "";

            if (d) {
                paramName = (new RegExp('[?&]' + encodeURIComponent(paramName) + '=([^&#]*)')).exec(d.src);
                if (paramName) {
                    urlParam = decodeURIComponent(paramName[1].replace(/\+/g, " "));
                }
            }

            return urlParam;
        };

        this.getDomainUrlParam = function (paramName) {
            var url = window.location.href;
            paramName = paramName.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + paramName + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);

            if (!results) {
                return null;
            }

            if (!results[2]) {
                return '';
            }

            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        };

        /**
         * @deprecated Use {@link createBannerPromise} directly instead. Exists only keep the Cookiebot API consistent
         */
        this.process = function (isRenewal, shouldResetCookies) {
            createBanner(this, isRenewal)
                .then(function(){
                    if (shouldResetCookies && window.CookieConsentDialog) {
                       window.CookieConsent.resetCookies();
                    }

                    window.CookieConsentDialog && window.CookieConsentDialog.init();
                    window.CookieConsent.changed = true;
                });
        };

        this.getCookie = function (name) {
            var consentCookieValue = "";
            var documentCookies = document.cookie;
            var cookie = undefined; //default value is requried to be "undefined" for cookiebotstaticbase check

            var i, x, y, l = documentCookies.split(";");
            for (i = 0; i < l.length; i++) {
                x = l[i].substr(0, l[i].indexOf("="));
                y = l[i].substr(l[i].indexOf("=") + 1);
                x = x.replace(/^\s+|\s+$/g, ""); //trim whitespace
                if (x === name) {

                    //Fallback workaround for IE bug not comliant with RFC 6265, reading consentcookie from both
                    //root domain cookie and subdomain on subdomains, if cookie for root is set first: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8183708/.
                    if ((name === this.name) && ((documentCookies.split(name).length - 1) > 1))
                    {
                        if ((y.length > consentCookieValue.length) || (y === "0")) //use longest string (consent given) or opt-out
                        {
                            consentCookieValue = y;
                        }
                    }
                    else {
                        cookie = unescape(y);
                    }
                }
            }

            if (consentCookieValue !== "") {
                cookie = unescape(consentCookieValue);
            }

            return cookie;
        };

        this.setCookie = function (value, expiredate, path, domain, secure) {
            var isSecure = (window.location.protocol === "https:");
            if (secure) { //override default
                isSecure = secure;
            }
            var cookieDef = this.name + "=" + value +
                ((expiredate) ? ";expires=" + expiredate.toGMTString() : "") +
                ((path) ? ";path=" + path : "") +
                ((domain) ? ";domain=" + domain : "") +
                ((isSecure) ? ";secure" : "");
            document.cookie = cookieDef;
        };

        this.removeCookies = function () {
            var cookies = document.cookie.split(";");
            var path = window.location.pathname.split('/');
            var hostname = window.location.hostname;
            var isWwwDomain = hostname.substring(0, 3) === "www";

            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var nameEndPos = cookie.indexOf("=");
                var name = nameEndPos > -1 ? cookie.substr(0, nameEndPos) : cookie;
                name = name.replace(/^\s*/, "").replace(/\s*$/, ""); //trim whitespaces

                var isWhiteListed = false;
                for (var j = 0; j < this.whitelist.length; j++) {
                    if (this.whitelist[j] === name) {
                        isWhiteListed = true;
                        break;
                    }
                }

                if ((!isWhiteListed) && (name !== this.name)) {
                    var pathString = ";path=";
                    var expireString = "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    var domainString = ";domain=";
                    document.cookie = name + expireString;
                    for (var k = 0; k < path.length; k++) {
                        pathString += ((pathString.substr(-1) !== '/') ? '/' : '') + path[k];
                        document.cookie = name + expireString + pathString;
                        document.cookie = name + expireString + pathString + domainString + escape(hostname);
                        document.cookie = name + expireString + pathString + domainString + "." + escape(hostname);
                        document.cookie = name + expireString + pathString + domainString + escape(this.getRootDomain(hostname));
                        document.cookie = name + expireString + pathString + domainString + "." + escape(this.getRootDomain(hostname));

                        if (isWwwDomain) {
                            document.cookie = name + expireString + pathString + domainString + escape(hostname.substring(3));
                        }
                    }
                }

                if(!isStorageSupported()) {
                    return; //bail when localStorage is not supported
                }

                localStorage.clear();
                sessionStorage.clear();
            }
        };

        this.getRootDomain = function (domain) {
            var rootDomain = domain;
            if (domain.length > 0) {
                var sections = rootDomain.split('.');
                if (rootDomain.length > 1) {
                    rootDomain = sections.slice(-2).join('.');
                }
            }
            return rootDomain;
        };

        //delete first party cookies that has not been consented
        this.resetCookies = function () {
            var self = this;

            var resetForCookieTable = function (cookieTable) {
                cookieTable.forEach(function (cookie) {
                    var cookieName = cookie[0];
                    var cookieStorageType = cookie[5];
                    var cookieNameRegEx = cookie[6];

                    switch (cookieStorageType) {
                        case "1":
                            //http cookie
                            self.removeCookieHTTP(cookieName, cookieNameRegEx);
                            break;
                        case "2":
                            //localstorage item
                            self.removeCookieLocalStorage(cookieName, cookieNameRegEx);
                            break;
                    }
                });
            };

            var cookieIndex = this.dialog || this.cookieList;

            if (cookieIndex != null) {
                if ((!this.consent.preferences) && (this.wipe.preferences)) {
                    resetForCookieTable(cookieIndex.cookieTablePreference);
                }

                if ((!this.consent.statistics) && (this.wipe.statistics)) {
                    resetForCookieTable(cookieIndex.cookieTableStatistics);
                }

                if ((!this.consent.marketing) && (this.wipe.marketing)) {
                    resetForCookieTable(cookieIndex.cookieTableAdvertising);
                }

                resetForCookieTable(cookieIndex.cookieTableUnclassified);
            }
        };

        this.removeCookieHTTP = function (cookiename, cookieregex) {
            var cookies = document.cookie.split(";");
            var path = window.location.pathname.split('/');
            var hostname = window.location.hostname;
            var isWwwDomain = hostname.substring(0, 3) === "www";

            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var nameEndPos = cookie.indexOf("=");
                var name = nameEndPos > -1 ? cookie.substr(0, nameEndPos) : cookie;
                name = name.replace(/^\s*/, "").replace(/\s*$/, ""); //trim whitespaces

                var isNameMatch = false;
                if (cookieregex === "") {
                    if (name === cookiename) {
                        isNameMatch = true;
                    }
                }
                else {
                    isNameMatch = name.match(cookieregex);
                }

                if ((isNameMatch) && (name !== this.name)) {
                    var pathString = ";path=";
                    var expireString = "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    var domainString = ";domain=";
                    document.cookie = name + expireString;
                    for (var j = 0; j < path.length; j++) {
                        pathString += ((pathString.substr(-1) !== '/') ? '/' : '') + path[j];
                        document.cookie = name + expireString + pathString;
                        document.cookie = name + expireString + pathString + domainString + escape(hostname);
                        document.cookie = name + expireString + pathString + domainString + "." + escape(hostname);
                        document.cookie = name + expireString + pathString + domainString + escape(this.getRootDomain(hostname));
                        document.cookie = name + expireString + pathString + domainString + "." + escape(this.getRootDomain(hostname));

                        if (isWwwDomain) {
                            document.cookie = name + expireString + pathString + domainString + escape(hostname.substring(3));
                        }
                    }
                }
            }
        };

        this.removeCookieLocalStorage = function (cookiename, cookieregex) {
            if (!isStorageSupported()) {
                return; //bail when localStorage is not supported
            }

            var keys = Object.keys(localStorage);
            for (var i = 0; i < keys.length; i++) {
                var name = keys[i];

                var isNameMatch = false;
                if (cookieregex === "") {
                    if (name === cookiename) {
                        isNameMatch = true;
                    }
                }
                else {
                    isNameMatch = name.match(cookieregex);
                }

                if (isNameMatch) {
                    localStorage.removeItem(name);
                    if (typeof (sessionStorage) !== 'undefined') {
                        sessionStorage.removeItem(name);
                    }
                }
            }
        };

        this.withdraw = function () {
            this.consented = false;
            this.declined = false;
            this.hasResponse = false;
            this.consent.preferences = false;
            this.consent.statistics = false;
            this.consent.marketing = false;
            this.consent.method = 'explicit';

            this.changed = true;

            //update statuslabel if user is on page with injected cookie declaration
            if ((typeof (window.CookieDeclaration) !== 'undefined') && (typeof (window.CookieDeclaration.SetUserStatusLabel) === "function")) {
                window.CookieDeclaration.SetUserStatusLabel();
            }

            window.CookieConsent.ondecline();
            if (typeof window.CookiebotCallback_OnDecline === 'function') {
                window.CookiebotCallback_OnDecline();
            }
            else if (typeof window.CookieConsentCallback_OnDecline === 'function') {
                window.CookieConsentCallback_OnDecline();
            }

            window.CookieConsent.applyDisplay();

            var pathUrlString = "";
            if (this.pathlist.length > 0) {
                pathUrlString = "&path=" + encodeURIComponent(this.pathlist.join(","));
            }

            var userCountryParameter = window.CookieConsent.userCountry ? "&usercountry=" + window.CookieConsent.userCountry : "";

            var hasCookieData = (this.dialog != null);

            //Get consentstring from IAB framework and save with logconsent
            if (hasFramework(this) && this.frameworkLoaded) {
                if (typeof window.CookieConsentIABCMP === 'object') {
                    window.CookieConsentIABCMP.withdrawConsent();
                }

                if (latestTcData) {
                    if (latestTcData.tcString) {
                        window.CookieConsent.IABConsentString = latestTcData.tcString;
                    }
                    else {
                        window.CookieConsent.IABConsentString = "";
                    }
                    if ((typeof window.CookieConsentIABCMP === 'object') && window.CookieConsentIABCMP.encodeGACMString && latestTcData.addtlConsent) {
                        window.CookieConsent.GACMConsentString = window.CookieConsentIABCMP.encodeGACMString(latestTcData.addtlConsent);
                    }
                    else {
                        window.CookieConsent.GACMConsentString = "";
                    }
                }

                pathUrlString += "&iab2=" + window.CookieConsent.IABConsentString + "&gacm=" + window.CookieConsent.GACMConsentString;

                var logConsentUrl = window.CookieConsent.host + "logconsent.ashx?action=decline&nocache=" + new Date().getTime() +
                    "&cbid=" + window.CookieConsent.serial + pathUrlString +
                    "&lifetime=" + window.CookieConsent.optOutLifetime +
                    "&cbt=" + window.CookieConsent.responseMode +
                    "&hasdata=" + hasCookieData +
                    "&method=strict" +
                    userCountryParameter +
                    "&referer=" + encodeURIComponent(window.location.protocol + "//" + window.location.hostname) +
                    "&rc=false";

                    logConsent(window.CookieConsent, logConsentUrl, false, !hasCookieData);
            }
            else {
                var logConsentUrl = this.host + "logconsent.ashx?action=decline&nocache=" + new Date().getTime() +
                    "&cbid=" + window.CookieConsent.serial + pathUrlString +
                    "&lifetime=" + window.CookieConsent.optOutLifetime +
                    "&cbt=" + window.CookieConsent.responseMode +
                    "&hasdata=" + hasCookieData +
                    "&method=strict" +
                    userCountryParameter +
                    "&referer=" + encodeURIComponent(window.location.protocol + "//" + window.location.hostname) +
                    "&rc=false";

                    logConsent(window.CookieConsent, logConsentUrl, false, !hasCookieData);
            }
        };

        this.setOutOfRegion = function (countryCode, consentVersion) { //used for first-time registration of out-of-region consent
            this.isOutsideEU = true;
            this.isOutOfRegion = true;
            this.hasResponse = true;
            this.declined = false;
            this.consented = true;
            this.consent.preferences = true;
            this.consent.statistics = true;
            this.consent.marketing = true;
            this.consent.method = 'implied';

            var countryFragment = "";
            if (countryCode) {
                this.userCountry = countryCode;
                countryFragment = "%2Cregion:%27" + countryCode + "%27";
            }

            this.changed = true;

            this.version = this.latestVersion;

            if (consentVersion) {
                this.version = this.latestVersion = consentVersion;
            }

            this.updateRegulations();

            this.consent.stamp = "-1"; //no consent id available as consent is not logged. "-1" signals out-of-region consent cookie

            var expireMonths = 1;
            var expirationDate = new window.CookieControl.DateTime().addMonths(expireMonths);

            if (hasFramework(this)) {
                if (!this.frameworkLoaded) {
                    setTimeout(function () {
                        window.CookieConsent.setOutOfRegion(countryCode);
                    }, 50);
                    return;
                }
                else {
                    window.CookieConsentIABCMP.updateConsentFullOptIn();
                    //Get consentstring from IAB framework and save in out-of-region cookie value
                    if (latestTcData) {
                        if (latestTcData.tcString) {
                            window.CookieConsent.IABConsentString = latestTcData.tcString;
                        }
                        else {
                            window.CookieConsent.IABConsentString = "";
                        }
                        var IABconsentFragment = "%2Ciab2:%27" + window.CookieConsent.IABConsentString + "%27";
                        if ((typeof window.CookieConsentIABCMP === 'object') && window.CookieConsentIABCMP.encodeGACMString && latestTcData.addtlConsent) {
                            window.CookieConsent.GACMConsentString = window.CookieConsentIABCMP.encodeGACMString(latestTcData.addtlConsent);
                            IABconsentFragment += "%2Cgacm:%27" + window.CookieConsent.GACMConsentString + "%27";
                        }
                        else {
                            window.CookieConsent.GACMConsentString = "";
                        }
                    }

                    window.CookieConsent.setCookie(
                        "{stamp:%27" + window.CookieConsent.consent.stamp +
                        "%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cmethod:%27implied%27%2Cver:" + window.CookieConsent.version +
                        "%2Cutc:" + new Date().getTime() + IABconsentFragment + countryFragment + "}", expirationDate, "/"
                    );
                }
            }
            else {
                this.setCookie(
                    "{stamp:%27" + this.consent.stamp +
                    "%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:true%2Cmethod:%27implied%27%2Cver:" + this.version +
                    "%2Cutc:" + new Date().getTime() + countryFragment + "}", expirationDate, "/"
                );
            }

            this.setHeaderStyles();

            if (this.amznConsentSignalEnabled) {
                applyAcs(this);
            }

            this.signalMsConsentAPI(this.consent.marketing);
            this.signalMsClarityConsentAPI(this.consent.marketing, this.consent.statistics);

            this.signalGoogleConsentAPI(
                this.consentModeDisabled,
                this.consentModeDataRedaction,
                this.consent.preferences,
                this.consent.statistics,
                this.consent.marketing
            );

            this.setOnload();
        };

        this.isSpider = function () {
            if (this.botDetectionDisabled) {
                return false;
            }

            return /adidxbotc|Applebot\/|archive.org_bot|asterias\/|Baiduspider\/|bingbot\/|BingPreview\/|DuckDuckBot\/|FAST-WebCrawler\/|Feedspot|Feedspotbot\/|Google Page Speed Insights|Google PP|Google Search Console|Google Web Preview|Googlebot\/|Googlebot-Image\/|Googlebot-Mobile\/|Googlebot-News|Googlebot-Video\/|Google-InspectionTool\/|Google-SearchByImage|Google-Structured-Data-Testing-Tool|Chrome-Lighthouse|heritrix\/|iaskspider\/|Mediapartners-Google|Storebot-Google\/|msnbot\/|msnbot-media\/|msnbot-NewsBlogs\/|msnbot-UDiscovery\/|PTST\/|SEMrushBot|special_archiver\/|Siteimprove|Y!J-ASR\/|Y!J-BRI\/|Y!J-BRJ\/YATS|Y!J-BRO\/YFSJ|Y!J-BRW\/|Y!J-BSC\/|Yahoo! Site Explorer Feed Validator|Yahoo! Slurp|YahooCacheSystem|Yahoo-MMCrawler\/|YahooSeeker\/|aabot\/|compatible; aa\/|PetalBot\/|Prerender\/|webvitals.dev/.test(navigator.userAgent);
        };

        this.getScript = function (url, async, callback) {
            var h = document.getElementsByTagName('script')[0];
            var s = document.createElementOrig('script');
            s.type = 'text/javascript';
            s.charset = 'UTF-8';
            applyNonce(s, this.nonce);
            var doAsyncLoad = true;
            if ((typeof (async) !== 'undefined') && (!async)) {
                doAsyncLoad = false;
            }

            if (doAsyncLoad) {
                s.async = "async";
            }
            s.src = url;
            s.onload = s.onreadystatechange = function (_, isAbort) {
                if (isAbort || !s.readyState || /loaded|complete/.test(s.readyState)) {
                    s.onload = s.onreadystatechange = null;
                    if (!isAbort) {
                        if (callback) {
                            callback();
                        }
                    }
                }
            };
            s.onerror = function () {
                if (callback) {
                    try {
                        callback();
                    } catch (e) { }
                }
            };
            if (h && h.parentNode) {
                h.parentNode.insertBefore(s, h);
            }
            else {
                document.head.appendChild(s);
            }
        };

        this.fetchJsonData = fetchJsonData;

        this.loadIframe = function (iframeID, iframeSrc) {
            var customFrame = document.getElementById(iframeID);
            if (customFrame) {
                customFrame.src = iframeSrc;
            }
        };

        this.setDNTState = function () {
            if (
                (navigator.doNotTrack === "yes") ||
                (navigator.msDoNotTrack === "1") ||
                (navigator.doNotTrack === "1") ||
                (this.cookieEnabled === false) ||
                (navigator.cookieEnabled === false)
            ) {
                this.doNotTrack = true;
            }
            else {
                this.doNotTrack = false;
            }
        };

        this.setHeaderStyles = function () {
            var styleObjectID = 'CookieConsentStateDisplayStyles';

            //delete style object if it has been set earlier
            var styleObject = document.getElementById(styleObjectID);
            if (styleObject) {
                styleObject.parentNode.removeChild(styleObject);
            }

            //apply styles before loading
            var head = document.head;
            if (head) {
                var s = document.createElement('style');
                applyNonce(s, this.nonce);
                s.setAttribute('type', 'text/css');
                s.id = styleObjectID;
                var newstylesheet = "";

                if (this.consented) {
                    var optins = [];
                    var optouts = [];
                    optins.push(".cookieconsent-optin");
                    if (this.consent.preferences) {
                        optins.push(".cookieconsent-optin-preferences");
                        optouts.push(".cookieconsent-optout-preferences");
                    }
                    else {
                        optouts.push(".cookieconsent-optin-preferences");
                        optins.push(".cookieconsent-optout-preferences");
                    }
                    if (this.consent.statistics) {
                        optins.push(".cookieconsent-optin-statistics");
                        optouts.push(".cookieconsent-optout-statistics");
                    }
                    else {
                        optouts.push(".cookieconsent-optin-statistics");
                        optins.push(".cookieconsent-optout-statistics");
                    }
                    if (this.consent.marketing) {
                        optins.push(".cookieconsent-optin-marketing");
                        optouts.push(".cookieconsent-optout-marketing");
                    }
                    else {
                        optouts.push(".cookieconsent-optin-marketing");
                        optins.push(".cookieconsent-optout-marketing");
                    }
                    optouts.push(".cookieconsent-optout");
                    newstylesheet = optins.join() + "{display:block;display:initial;}" + optouts.join() + "{display:none;}";
                }
                else {
                    newstylesheet = ".cookieconsent-optin-preferences,.cookieconsent-optin-statistics,.cookieconsent-optin-marketing,.cookieconsent-optin";
                    newstylesheet += "{display:none;}";

                    newstylesheet += ".cookieconsent-optout-preferences,.cookieconsent-optout-statistics,.cookieconsent-optout-marketing,.cookieconsent-optout";
                    newstylesheet += "{display:block;display:initial;}";
                }
                if (s.styleSheet) {
                    s.styleSheet.cssText = newstylesheet;
                } else {
                    s.appendChild(document.createTextNode(newstylesheet));
                }
                head.appendChild(s);
            }
        };

        this.submitConsent = function (isImpliedConsent, consentURL, loadAsync) {
            if (typeof (window.CookieConsentDialog) === 'object') {
                this.changed = true;
                window.CookieConsentDialog.submitConsent(isImpliedConsent, consentURL, loadAsync);
            }
        };

        this.submitCustomConsent = function (optinPreferences, optinStatistics, optinMarketing, isImpliedConsent) {
            if (this.hasFramework && !this.frameworkLoaded && (!this.frameworkBlocked)) {
                setTimeout(function () {
                    window.CookieConsent.submitCustomConsent(optinPreferences, optinStatistics, optinMarketing);
                }, 5);
                return;
            }

            var finalConsentURL = window.location.protocol + "//" + window.location.hostname;
            var responseMode = window.CookieConsent.responseMode;
            var logConsentMethod = isImpliedConsent ? 'implied' : 'strict';

            this.consented = true;
            this.declined = false;
            this.hasResponse = true;

            this.consent.preferences = false;
            this.consent.statistics = false;
            this.consent.marketing = false;
            this.consent.method = isImpliedConsent ? 'implied' : 'explicit';

            if (optinPreferences) {
                this.consent.preferences = true;
            }
            if (optinStatistics) {
                this.consent.statistics = true;
            }
            if (optinMarketing) {
                this.consent.marketing = true;
            }
            if (!this.dialog || this.dialog.template !== "custom") {
                responseMode = "none";
            }
            //update statuslabel if user is on page with injected cookie declaration
            if (typeof (window. CookieDeclaration) !== 'undefined') {
                if (typeof (window.CookieDeclaration.SetUserStatusLabel) === 'function') {
                    window.CookieDeclaration.SetUserStatusLabel();
                }
            }

            var dnt = "false";
            if (this.doNotTrack) {
                dnt = "true";
            }

            var asyncload = true;

            //log consent
            var pathUrlString = "";
            if (this.pathlist.length > 0) {
                pathUrlString = "&path=" + encodeURIComponent(this.pathlist.join(","));
            }

            var bulkTicket = "";
            var hasCookieData = (this.dialog != null);

            var userCountryParameter = window.CookieConsent.userCountry ? "&usercountry=" + window.CookieConsent.userCountry : "";

            if (hasFramework(this) && this.frameworkLoaded) {
                //Get consentstring from IAB framework and save with logconsent
                if (latestTcData) {
                    if (latestTcData.tcString) {
                        window.CookieConsent.IABConsentString = latestTcData.tcString;
                    }
                    else {
                        window.CookieConsent.IABConsentString = "";
                    }
                    if ((typeof window.CookieConsentIABCMP === 'object') && window.CookieConsentIABCMP.encodeGACMString && latestTcData.addtlConsent) {
                        window.CookieConsent.GACMConsentString = window.CookieConsentIABCMP.encodeGACMString(latestTcData.addtlConsent);
                    }
                    else {
                        window.CookieConsent.GACMConsentString = "";
                    }
                }

                pathUrlString += "&iab2=" + window.CookieConsent.IABConsentString + "&gacm=" + window.CookieConsent.GACMConsentString;

                var logConsentUrl = window.CookieConsent.host + "logconsent.ashx?action=accept&nocache=" + new Date().getTime() +
                    "&dnt=" + dnt +
                    "&clp=" + window.CookieConsent.consent.preferences +
                    "&cls=" + window.CookieConsent.consent.statistics +
                    "&clm=" + window.CookieConsent.consent.marketing +
                    "&cbid=" + window.CookieConsent.serial + pathUrlString +
                    "&cbt=" + responseMode +
                    "&ticket=" + bulkTicket +
                    "&bulk=" + this.isbulkrenewal +
                    "&hasdata=" + hasCookieData +
                    "&method=" + logConsentMethod +
                    userCountryParameter +
                    "&referer=" + encodeURIComponent(finalConsentURL) +
                    "&rc=false";

                    logConsent(window.CookieConsent, logConsentUrl, asyncload, !hasCookieData);
                    
            }
            else {
                var logConsentUrl = this.host + "logconsent.ashx?action=accept&nocache=" + new Date().getTime() +
                    "&dnt=" + dnt +
                    "&clp=" + this.consent.preferences +
                    "&cls=" + this.consent.statistics +
                    "&clm=" + this.consent.marketing +
                    "&cbid=" + this.serial + pathUrlString +
                    "&cbt=" + responseMode +
                    "&ticket=" + bulkTicket +
                    "&bulk=" + this.isbulkrenewal +
                    "&hasdata=" + hasCookieData +
                    "&method=" + logConsentMethod +
                    userCountryParameter +
                    "&referer=" + encodeURIComponent(finalConsentURL) +
                    "&rc=false";

                    logConsent(window.CookieConsent, logConsentUrl, asyncload, !hasCookieData);
            }

            if (typeof (window.CookieConsentDialog) === 'object' && typeof (window.CookieConsentDialog.releaseBannerFocus) === 'function') {
                window.CookieConsentDialog.releaseBannerFocus();
            }
        };

        this.isGUID = function (objGuid) {
            var guidSyntax = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/;
            if ((objGuid.length > 0) && (guidSyntax.test(objGuid))) {
                return true;
            }
            else {
                return false;
            }
        };

        this.hashCode = hashCode;

        this.tagHash = tagHash;

        this.initMutationObserver = function () {
            initMutationObserver(window, document, this);
        };

        this.overrideEventListeners = function () {
            overrideEventListeners(this);
        };

        this.isInternalEventListener = function (type, node, callback) {
            var that = this;
            var result = false;

            if (
                ((type === "beforescriptexecute") && (typeof node.origOuterHTML !== "undefined")) || //don't register own events on script tags
                (node === this.iframe) ||
                (
                    (callback === that.cbonloadevent) ||
                    (callback === that.triggerOnloadEvents) ||
                    (callback === that.handleMessage) ||
                    (callback === that.readBulkConsent) ||
                    (callback === that.submitImpliedConsent) ||
                    (callback === that.signalWindowLoad)
                ) ||
                (typeof node.CB_isClone !== "undefined" && ((type === "load") || (type === "error")))
            ) {
                result = true;
            }

            return result;
        };

        this.stopOverrideEventListeners = function () {
            stopOverrideEventListeners(window, this);
        };

        this.OverrideEventListenersOnloadFired = [];
        this.OverrideEventListenersOnloadToFire = [];

        this.applyOverrideEventListeners = function () {
            for (var i = 0; i < this.mutationOnloadEventListeners.length; i++) {
                try {
                    var eventElement = this.mutationOnloadEventListeners[i];
                    if (eventElement.target && eventElement.target != null && typeof eventElement.target !== "undefined") {
                        eventElement.target.addEventListenerBase(eventElement.type, eventElement.listener, eventElement.options);

                         //fire event manually if onload has already been fired on page
                        if (window.CookieConsent.windowOnloadTriggered && ((eventElement.target === window) || (eventElement.target === document))) {
                            var targetID = eventElement.target.toString() + eventElement.type.toString();
                            if (window.CookieConsent.OverrideEventListenersOnloadFired.indexOf(targetID) < 0) { //otherwise it has already been fired, e.g. window-load
                                window.CookieConsent.OverrideEventListenersOnloadFired.push(targetID);
                                window.CookieConsent.OverrideEventListenersOnloadToFire.push({ target: eventElement.target, type: eventElement.type });
                            }
                        }
                        else if ((eventElement.target !== window) && (eventElement.target !== document)) {
                            try {
                                var evt = document.createEvent('Event');
                                evt.initEvent(eventElement.type, true, true);
                                eventElement.target.dispatchEvent(evt);
                            } catch (e) { }
                        }
                    }
                } catch (e) { }
            }

            for (var j = 0; j < window.CookieConsent.OverrideEventListenersOnloadToFire.length; j++) {
                try {
                    var overrideEvt = document.createEvent('Event');
                    overrideEvt.initEvent(window.CookieConsent.OverrideEventListenersOnloadToFire[j].type, true, true);
                    window.CookieConsent.OverrideEventListenersOnloadToFire[j].target.dispatchEvent(overrideEvt);
                } catch (e) { }
            }

            //strange behavior: body.onload only fires if window.onload is not defined.
            //If window.onload is also defined, body.onload will be a duplicate, overriding any specific body.onload-handler
            if (
                window.CookieConsent.windowOnloadTriggered &&
                (typeof window.onload === "function") &&
                (document.body.getAttribute("onload") == null || document.body.onload !== window.onload)
            ) {
                window.onload();
            }

            this.mutationOnloadEventListeners = [];
        };

        this.cloneEventListeners = function (node, clone) {
            for (var j = 0; j < this.mutationEventListeners.length; j++) {
                if (this.mutationEventListeners[j].target === node) {
                    clone.addEventListenerBase(this.mutationEventListeners[j].type, this.mutationEventListeners[j].listener, this.mutationEventListeners[j].options);
                }
            }
        };

        this.downloadConfiguration = function () {
            //download configuration for current domain/path
            var CDNPathFragment = this.currentPath;
            if (CDNPathFragment.length > 0) {
                if (CDNPathFragment.indexOf("/") !== 0) {
                    CDNPathFragment = "/" + CDNPathFragment;
                }
                if (CDNPathFragment.lastIndexOf("/") !== (CDNPathFragment.length - 1)) {
                    CDNPathFragment = CDNPathFragment + "/";
                }
            }
            else {
                CDNPathFragment = "/";
            }

            var ASCIIOnlyDomain = this.domain;
            if (ASCIIOnlyDomain.indexOf("xn--") !== 0) { //check whether the browser returns an IDN domain name, e.g. Chrome but not Edge
                var regex = /[^\u0020-\u007E]/gi;
                ASCIIOnlyDomain = this.domain.replace(regex, '-');
            }
            //Example: For the domain name "ungepåsporet.nu" Chrome will return "xn--ungepsporet-18a.nu" from window.location.hostname (stored in this.domain),
            //while Edge will return "ungepåsporet.nu" - The CDN does not support non-ascii characters,
            //therefor two versions of the domain name are available in the CDN: "xn--ungepsporet-18a.nu" (Chrome) and "ungep-sporet.nu" (Edge).

            //URL must match path generated from cookiescanner
            var configurationURL = this.CDN + "/consentconfig/" + this.serial.toLowerCase() + "/" + ASCIIOnlyDomain + CDNPathFragment + "configuration.js";

            //clear current configuration
            this.configuration.tags = [];

            //load configuration from CDN
            this.getScript(configurationURL, false, function () {
                // combine configuration tags with tag categories
                loadInlineTagConfiguration(window.CookieConsent);
                
                window.CookieConsent.configuration.loaded = true;

                //compile tracking domains list
                if (window.CookieConsent.configuration.trackingDomains.length === 0) {
                    for (var j = 0; j < window.CookieConsent.configuration.tags.length; j++) {
                        var currentTag = window.CookieConsent.configuration.tags[j];
                        if ((currentTag.resolvedUrl) && (currentTag.resolvedUrl !== "")) {
                            var currentDomain = window.CookieConsent.getHostnameFromURL(currentTag.resolvedUrl);
                            if ((currentDomain !== "") && (currentDomain !== window.location.hostname)) {
                                window.CookieConsent.configuration.trackingDomains.push({ d: currentDomain, c: currentTag.cat });
                            }
                        }
                    }
                }
            });
        };

        this.initWidget = function () {
            var that = this;
            var widgetEnabledOverride = this.widget ? this.widget.enabledOverride : null;
            var widgetEnabledInlineOverride = this.inlineConfiguration && this.inlineConfiguration.WidgetConfiguration ? this.inlineConfiguration.WidgetConfiguration.enabled : null;
            var hasWidgetEnabledOverride = widgetEnabledInlineOverride != null || widgetEnabledOverride != null;

            if (
                this.isOutOfRegion ||
                !this.hasResponse ||
                !this.cookieEnabled ||
                (hasWidgetEnabledOverride && (widgetEnabledInlineOverride === false || widgetEnabledOverride === false))
            ) {
                this.computedConfiguration.widgetEnabled = false;
                return;
            }

            function initWidgetInternal() {
                var widgetConfig = that.widget.configuration;
                var enabled = widgetConfig && (hasWidgetEnabledOverride || widgetConfig.enabled); //if override is set, bypass 'enabled' from config

                that.computedConfiguration.widgetEnabled = enabled;

                if (enabled && !that.widget.loaded) {
                    window.CookieConsent.getScript(createWidgetIconUrl(that.host), true, function() {
                        that.widget.loaded = true;
                    });
                }
            }

            this.widget = this.widget || {};

            // if settings are not loaded (ex. slow network), wait for them to load before initializing the widget
            var that = this;
            function waitForSettings() {
                if (that.settingsLoaded) {
                    if (that.widget.configuration) {
                        initWidgetInternal();
                    }

                    return;
                } else {
                    setTimeout(waitForSettings, 1000);
                }
            }

            waitForSettings();
        };

        this.logWidgetAttributeWarning = function(attribute, value) {
            var supportUrl = "https://support.cookiebot.com/hc/en-us/articles/4406571299346";
            console.warn("Cookiebot: Cookiebot script attribute '%s' with value  '%s' is invalid. For more information about valid options see %s", attribute, value, supportUrl);
        };

        this.mutationHandler = function (mutationsList, mutationObserver) {
            mutationHandler(window, document, mutationsList);
        };

        this.preloadMutationScript = function (src) {
            var preloadLink = document.createElementOrig("link");
            preloadLink.href = src;
            preloadLink.rel = "preload";
            preloadLink.as = "script";
            preloadLink.CB_isClone = 1;
            document.head.appendChild(preloadLink);
        };

        this.processMutation = function (node, isPostPoned) {
            processMutation(this, node, isPostPoned);
        };

        this.isCookiebotNode = function (node) {
            return isCookiebotNode(this, node);
        };

        this.isCookiebotCoreNode = function (node) {
            return (this.isCookiebotNode(node) && (node.src.indexOf("/uc.js") > -1));
        };

        this.postponeMutation = function (node) {
            postponeMutation(window, this, node);
        };

        this.processPostPonedMutations = function () {
            processPostPonedMutations(this);
        };

        this.dequeueNonAsyncScripts = function (mutationNodes) {
            dequeueNonAsyncScripts(this, mutationNodes);
        };

        this.getTagCookieCategories = function (outerhtml, tagURL, node, matchCommon) {
            return getTagCookieCategories(window, this, outerhtml, tagURL, node, matchCommon);
        };

        this.cookieCategoriesFromNumberArray = cookieCategoriesFromNumberArray;

        //stop mutationoberserver if active to not apply data-cookieconsent-attribute to dynamically loaded tags from tags that have already been marked
        this.stopMutationObserver = function () {
            stopMutationObserver(window, this);
        };

        //Fallback-methods for automatic cokoie-blocking on old browsers
        this.mutationHandlerFallback = function (charset) {
            console.warn('Older browsers support is deprecated. Consider upgrading your browser');
        };

        this.mutationHandlerFallbackInit = function (content) {
            console.warn('Older browsers support is deprecated. Consider upgrading your browser');
        };

        this.fallbackScriptNodes = [];
        this.fallbackDeferNodes = [];

        this.startJQueryHold = function () {
            if ((typeof window.jQuery !== 'undefined') && (typeof window["CB_jQueryHoldReadyStarted"] === 'undefined') && (typeof window.jQuery.holdReady !== "undefined")) {
                window["CB_jQueryHoldReadyStarted"] = 1;

                //if holdReady function is overridden by other tag, e.g. http://infobip-integration.sysb.ee/wp-content/themes/infobip/static/dist/bundle.js?ver=1.01
                window.CookieConsent.holdReadyClone = jQuery.holdReady;
                window.CookieConsent.holdReadyClone(true);
            }
        };

        this.endJQueryHold = function () {
            if (
                (typeof window.jQuery !== 'undefined') &&
                (typeof window["CB_jQueryHoldReadyStarted"] !== 'undefined') &&
                (typeof window.CookieConsent.holdReadyClone !== "undefined")
            ) {
                window.CookieConsent.holdReadyClone(false);
            }
        };

        this.loadFallbackScriptNodes = function (mutationNodes) {
            console.warn('Older browsers support is deprecated. Consider upgrading your browser');
        };

        this.mutationHandlerFallbackMarkupTag = function (doc, nodeType) {
            console.warn('Older browsers support is deprecated. Consider upgrading your browser');
        };

        this.resolveURL = resolveURL;

        this.getHostnameFromURL = getHostnameFromURL;

        this.updateRegulations = function () {
            var gdprAppliesOverride = this.inlineConfiguration && this.inlineConfiguration.Frameworks && this.inlineConfiguration.Frameworks.IABTCF2 && this.inlineConfiguration.Frameworks.IABTCF2.GdprApplies;

            if (this.userCountry !== '') {
                var lowercaseCountry = this.userCountry.toLowerCase();

                //GDPR - can be overwritten on TCF banners by inlineConfiguration
                this.regulations.gdprApplies = (this.framework === "TCFv2.3" && gdprAppliesOverride != undefined) ? gdprAppliesOverride === true : this.regulationRegions.gdpr.indexOf(lowercaseCountry) >= 0;

                //CCPA
                this.regulations.ccpaApplies = this.regulationRegions.ccpa.indexOf(lowercaseCountry) >= 0;

                //LGPD
                this.regulations.lgpdApplies = this.regulationRegions.lgpd.indexOf(lowercaseCountry) >= 0;
            }
            else { //user is out of region - we don't store the country of such user in the consent cookie
                this.regulations.gdprApplies = false;
                this.regulations.ccpaApplies = false;
                this.regulations.lgpdApplies = false;
            }

            if (hasFramework(this) && this.frameworkLoaded) {
                if ((typeof window.CookieConsentIABCMP === 'object') && (window.CookieConsentIABCMP.updateFramework)) {
                    if (window.CookieConsentIABCMP.gdprApplies !== this.regulations.gdprApplies) {
                        window.CookieConsentIABCMP.updateFramework(); //update for gdprApplies
                    }
                }
            }
        };

        this.signalConsentReady = function () {
            setTimeout(function () { //setTimeout necessary to allow CookieConsent object to construct first
                var event = document.createEvent('Event');
                event.initEvent('CookiebotOnConsentReady', true, true);
                window.dispatchEvent(event);

                event = document.createEvent('Event');
                event.initEvent('CookieConsentOnConsentReady', true, true);
                window.dispatchEvent(event);
            }, 1);
        };

        this.init();
    };

    window.CookieControl.Cookie.prototype.onload = function () {
    };

    window.CookieControl.Cookie.prototype.ondecline = function () {
    };

    window.CookieControl.Cookie.prototype.onaccept = function () {
    };

    window.CookieControl.DateTime = function (initdate) {
        this.Date = new Date();

        if (initdate) {
            this.Date = new Date(initdate);
        }

        this.isLeapYear = function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
        };

        this.getDaysInMonth = function (year, month) {
            return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        };

        this.addMonths = function (monthcount) {
            var n = this.Date.getDate();
            this.Date.setDate(1);
            this.Date.setMonth(this.Date.getMonth() + monthcount);
            this.Date.setDate(Math.min(n, this.getDaysInMonth(this.Date.getFullYear(), this.Date.getMonth())));
            return this.Date;
        };
    };

    //Support of IAB CCPA consent framework ("U.S. Privacy API" - "USP API"), https://www.iab.com/guidelines/ccpa-framework/ + https://iabtechlab.com/standards/ccpa/
    /* USP API start */
    window.__uspapi = uspapi;

    //Create ancestor frame "__uspapiLocator" so that __uspapi can be called from iframes by ad tech vendors
    window.addUspapiLocatorFrame = addUspapiLocatorFrame;

    window.addUspapiLocatorFrame();

    //Register postMessage handler for iframe calls to __uspapi
    window.__handleUspapiMessage = handleUspapiMessage;

    window.addEventListener('message', window.__handleUspapiMessage, false);
    /* USP API end */

    /* IAB TCF2 STUB BEGIN */
    window.propagateIABStub = function () {
        // based on the reference stub provided by IAB here: https://github.com/InteractiveAdvertisingBureau/iabtcf-es/blob/master/modules/stub/src/stub.js

        function postMessageEventHandler(event) {
            var msgIsString = typeof event.data === "string";
            var json = {};

            try {
                /**
                 * Try to parse the data from the event.  This is important
                 * to have in a try/catch because often messages may come
                 * through that are not JSON
                 */
                if (msgIsString) {
                    json = JSON.parse(event.data);
                } else {
                    json = event.data;
                }
            } catch (ignore) { }

            var payload = json && json.__tcfapiCall;

            if (payload) {
                window.__tcfapi(
                    payload.command,
                    payload.version,
                    function (retValue, success) {
                        var returnMsg = {
                            __tcfapiReturn: {
                                returnValue: retValue,
                                success: success,
                                callId: payload.callId,
                            },
                        };

                        if (msgIsString) {
                            returnMsg = JSON.stringify(returnMsg);
                        }

                        if (event && event.source && event.source.postMessage) {
                            event.source.postMessage(returnMsg, "*");
                        }
                    },
                    payload.parameter
                );
            }
        }

        var TCF_LOCATOR_NAME = "__tcfapiLocator";
        var queue = [];
        var win = window;
        var cmpFrame;

        function addFrame() {
            var doc = win.document;
            var otherCMP = !!win.frames[TCF_LOCATOR_NAME];

            if (!otherCMP) {
                if (doc.body) {
                    applyRuntimeStylesheet(doc, win.CookieConsent && win.CookieConsent.nonce);
                    var iframe = doc.createElement("iframe");
                    iframe.classList.add(HIDDEN_IFRAME_CLASS);
                    iframe.name = TCF_LOCATOR_NAME;
                    doc.body.appendChild(iframe);
                } else {
                    setTimeout(addFrame, 5);
                }
            }

            return !otherCMP;
        }

        function tcfAPIHandler() {
            var args = [];

            for (var i = 0; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            var gdprApplies;
            if (!args.length) {
                /**
                 * shortcut to get the queue when the full CMP
                 * implementation loads; it can call tcfapiHandler()
                 * with no arguments to get the queued arguments
                 */
                return queue;
            } else if (args[0] === "setGdprApplies") {
                /**
                 * shortcut to set gdprApplies if the publisher
                 * knows that they apply GDPR rules to all
                 * traffic (see the section on "What does the
                 * gdprApplies value mean" for more
                 */
                if (
                    args.length > 3 &&
                    parseInt(args[1], 10) === 2 &&
                    typeof args[3] === "boolean"
                ) {
                    gdprApplies = args[3];

                    if (typeof args[2] === "function") {
                        args[2]("set", true);
                    }
                }
            } else if (args[0] === "ping") {
                /**
                 * Only supported method; give PingReturn
                 * object as response
                 */
                var retr = {
                    gdprApplies: gdprApplies,
                    cmpLoaded: false,
                    cmpStatus: "stub"
                };

                if (typeof args[2] === "function") {
                    args[2](retr);
                }
            } else {
                /**
                 * some other method, just queue it for the
                 * full CMP implementation to deal with
                 */
                queue.push(args);
            }
        }
        /**
         * Iterate up to the top window checking for an already-created
         * "__tcfapilLocator" frame on every level. If one exists already then we are
         * not the master CMP and will not queue commands.
         */

        while (win) {
            try {
                if (win.frames[TCF_LOCATOR_NAME]) {
                    cmpFrame = win;
                    break;
                }
            } catch (ignore) { }

            // if we're at the top and no cmpFrame
            if (win === window.top) {
                break;
            }

            // Move up
            win = win.parent;
        }

        if (!cmpFrame) {
            // we have recur'd up the windows and have found no __tcfapiLocator frame
            addFrame();
            win.__tcfapi = tcfAPIHandler;
            win.addEventListener("message", postMessageEventHandler, false);
        }
    };

    /* IAB TCF2 STUB END */

    //Create the CookieConsent object
    //avoid to create object multiple times if customer has included the Cookiebot tag multiple times, ie. directly in code + in Google Tag Manager
    if (typeof window.CookieConsent !== "object" || (window.CookieConsent && window.CookieConsent.nodeType)) { // if not defined OR targets html element with "CookieConsent" ID
        window.CookieConsent = new window.CookieControl.Cookie('CookieConsent');
        if ((window.CookieConsent.scriptId !== 'CookieConsent') && (window.CookieConsent.scriptId !== 'Cookiebot')) {
            window[window.CookieConsent.scriptId] = window.CookieConsent;
        }
    }
    else {
        console.warn("WARNING: Cookiebot script is included twice - please remove one instance to avoid unexpected results.");
    }

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWMuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsaXRpZXMvaXNDb29raWVib3ROb2RlL2luZGV4LnRzIiwiLi4vc3JjL3V0aWxpdGllcy9yZXNvbHZlVVJML2luZGV4LnRzIiwiLi4vc3JjL3V0aWxpdGllcy9oYXNoQ29kZS9pbmRleC50cyIsIi4uL3NyYy91dGlsaXRpZXMvZ2V0RG9tYWluU2VhcmNoUGFyYW0vaW5kZXgudHMiLCIuLi9zcmMvdXRpbGl0aWVzL2dldEhvc3RuYW1lRnJvbVVSTC9pbmRleC50cyIsIi4uL3NyYy91dGlsaXRpZXMvcHJvbWlzZXMvaW5kZXgudHMiLCIuLi9zcmMvdXRpbGl0aWVzL3N0cmluZ3MvaW5kZXgudHMiLCIuLi9zcmMvY29uc2VudHMvY29uc2VudC50cyIsIi4uL3NyYy91dGlsaXRpZXMvY29va2llTnVtYmVyQ2F0ZWdvcmllc0Zyb21TdHJpbmdBcnJheS9pbmRleC50cyIsIi4uL3NyYy9jb25zZW50cy90Y2YvaGFzRnJhbWV3b3JrLnRzIiwiLi4vc3JjL3V0aWxpdGllcy9sb2FkSW5saW5lQ29uZmlndXJhdGlvbi9pbmRleC50cyIsIi4uL3NyYy91dGlsaXRpZXMvbm9uY2UvaW5kZXgudHMiLCIuLi9zcmMvYmFubmVyL2Fkb3B0U3R5bGVzaGVldC50cyIsIi4uL3NyYy9iYW5uZXIvcnVudGltZVN0eWxlcy50cyIsIi4uL3NyYy91c3BhcGkvaW5kZXgudHMiLCIuLi9ub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwiLi4vc3JjL2Fjcy9hbXpuLWNvbnNlbnQudHMiLCIuLi9zcmMvYWNzL2Fjcy50cyIsIi4uL3NyYy9hdXRvYmxvY2tlci90YWdIYXNoLnRzIiwiLi4vc3JjL2F1dG9ibG9ja2VyL2lzTm9kZUlnbm9yZWRGcm9tSW5saW5lQ29uZmlnLnRzIiwiLi4vc3JjL2F1dG9ibG9ja2VyL211dGF0aW9uT2JzZXJ2ZXIudHMiLCIuLi9zcmMvYXV0b2Jsb2NrZXIvcnVuU2NyaXB0VGFncy50cyIsIi4uL3NyYy9hdXRvYmxvY2tlci9jbG9uZVNjcmlwdFRhZy50cyIsIi4uL3NyYy9hdXRvYmxvY2tlci9vdmVycmlkZUV2ZW50TGlzdGVuZXJzLnRzIiwiLi4vc3JjL2F1dG9ibG9ja2VyL3N0b3BPdmVycmlkZUV2ZW50TGlzdGVuZXJzLnRzIiwiLi4vc3JjL2F1dG9ibG9ja2VyL3Byb2Nlc3NQb3N0UG9uZWRNdXRhdGlvbnMudHMiLCIuLi9zcmMvYXV0b2Jsb2NrZXIvZGVxdWV1ZU5vbkFzeW5jU2NyaXB0cy50cyIsIi4uL3NyYy9hdXRvYmxvY2tlci9wcm9jZXNzTXV0YXRpb24udHMiLCIuLi9zcmMvYXV0b2Jsb2NrZXIvcG9zdHBvbmVNdXRhdGlvbi50cyIsIi4uL3NyYy9hdXRvYmxvY2tlci9nZXRUYWdDb29raWVDYXRlZ29yaWVzLnRzIiwiLi4vc3JjL3R3aXBsYS90d2lwbGEudHMiLCIuLi9zcmMvcmVxdWVzdHMvaW5kZXgudHMiLCIuLi9zcmMvY29uc2VudHMvdGNmL2NvbnNlbnRTdHJpbmcudHMiLCIuLi9ub2RlX21vZHVsZXMvcHJvbWlzZS1wb2x5ZmlsbC9zcmMvZmluYWxseS5qcyIsIi4uL25vZGVfbW9kdWxlcy9wcm9taXNlLXBvbHlmaWxsL3NyYy9hbGxTZXR0bGVkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3Byb21pc2UtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwiLi4vc3JjL2Jhbm5lci9sb2FkZXIudHMiLCIuLi9zcmMvd2lkZ2V0L3Jlc291cmNlcy50cyIsIi4uL3NyYy9jb25zZW50cy9sb2FkSW5saW5lVGFnQ29uZmlndXJhdGlvbi50cyIsIi4uL3NyYy9jb25zZW50cy9sb2dDb25zZW50LnRzIiwiLi4vc3JjL3VjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDb29raWVDb25zZW50IH0gZnJvbSAnQC90eXBlcy9jb25zZW50JztcblxuLyoqXG4gKiBAcGFyYW0gY29va2llQ29uc2VudCAtIENvb2tpZUNvbnNlbnQgLyBDb29raWVib3Qgb2JqZWN0XG4gKiBAcGFyYW0gbm9kZSAtIFRoZSBub2RlIHRvIGNoZWNrXG4gKiBAcmV0dXJucyAtIEEgYm9vbGVhbiB2YWx1ZSBvZiB3aGV0aGVyIG9yIG5vdCB0aGUgbm9kZSBpcyBhIENvb2tpZWJvdCBub2RlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Nvb2tpZWJvdE5vZGUoY29va2llQ29uc2VudDogSUNvb2tpZUNvbnNlbnQsIG5vZGU6IEhUTUxFbGVtZW50IHwgSFRNTFNjcmlwdEVsZW1lbnQpOiBib29sZWFuIHtcbiAgbGV0IGhhc01hdGNoID0gZmFsc2U7XG4gIGlmIChub2RlLmhhc0F0dHJpYnV0ZSgnc3JjJykpIHsgLy8gZXhlbXB0IHRhZ3MgZnJvbSB0aGUgQ29va2llYm90IHNlcnZpY2VcbiAgICBjb25zdCB1cmwgPSAobm9kZS5nZXRBdHRyaWJ1dGUoJ3NyYycpIGFzIHN0cmluZykudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoKHVybC5pbmRleE9mKGNvb2tpZUNvbnNlbnQuaG9zdCkgPT09IDApIHx8ICh1cmwuaW5kZXhPZihjb29raWVDb25zZW50LkNETikgPT09IDApKSB7XG4gICAgICBoYXNNYXRjaCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGhhc01hdGNoO1xufVxuIiwiLyoqXG4gKiBAcGFyYW0gdXJsIC0gVGhlIHVucmVzb2x2ZWQgVVJMXG4gKiBAcmV0dXJucyAtIEEgcmVzb2x2ZWQgVVJMXG4gKi9cbmV4cG9ydCBjb25zdCByZXNvbHZlVVJMID0gZnVuY3Rpb24odXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAodXJsICE9PSAnJykge1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50T3JpZygnYScpO1xuICAgIGEuaHJlZiA9IHVybDtcbiAgICByZXR1cm4gKGEuY2xvbmVOb2RlKGZhbHNlKSBhcyBIVE1MQW5jaG9yRWxlbWVudCkuaHJlZjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG59O1xuIiwiLyoqXG4gKiBAcGFyYW0gcyAtIFRoZSBzdHJpbmcgdGhhdCB0aGUgaGFzaCBzaG91bGQgYmUgYmFzZWQgb25cbiAqIEByZXR1cm5zIC0gdGhlIGhhc2hlZCBzdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IGhhc2hDb2RlID0gZnVuY3Rpb24oczogc3RyaW5nIHwgdW5kZWZpbmVkKTogbnVtYmVyIHwgc3RyaW5nIHtcbiAgaWYgKHR5cGVvZiBzID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiAnJztcbiAgfVxuICBjb25zdCBzcyA9IHMucmVwbGFjZSgvXFxyXFxufFxcbnxcXHJ8XFx0fFxccy9nLCAnJyk7IC8vIHJlbW92ZSBsaW5lIGJyZWFrcywgdGFicyBhbmQgc3BhY2VzXG4gIGxldCBoID0gMDtcbiAgY29uc3QgbCA9IHNzLmxlbmd0aDtcbiAgbGV0IGkgPSAwO1xuXG4gIGlmIChsID4gMCkge1xuICAgIHdoaWxlIChpIDwgbCkge1xuICAgICAgaCA9IChoIDw8IDUpIC0gaCArIHNzLmNoYXJDb2RlQXQoaSsrKSB8IDA7XG4gICAgfVxuICB9XG4gIHJldHVybiBoO1xufTtcbiIsIi8qKlxuICogQHBhcmFtIHBhcmFtIC0gVGhlIHBhcmFtZXRlciB2YWx1ZSB0byBzZWFyY2ggZm9yXG4gKiBAcmV0dXJucyAtIFRoZSBwYXJhbWV0ZXIgdmFsdWVcbiAqL1xuZXhwb3J0IGNvbnN0IGdldERvbWFpblNlYXJjaFBhcmFtID0gZnVuY3Rpb24gKHBhcmFtOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3Qgc2VhcmNoID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcblxuICByZXR1cm4gdHlwZW9mIHNlYXJjaCA9PT0gJ3N0cmluZycgPyBuZXcgVVJMU2VhcmNoUGFyYW1zKHNlYXJjaCkuZ2V0KHBhcmFtKSA6IG51bGw7XG59O1xuIiwiLyoqXG4gKiBAcGFyYW0gdXJsIC0gVGhlIFVSTCBjb250YWluaW5nIHRoZSB3YW50ZWQgaG9zdG5hbWVcbiAqIEByZXR1cm5zIC0gVGhlIGhvc3RuYW1lXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRIb3N0bmFtZUZyb21VUkwgPSBmdW5jdGlvbih1cmw6IHN0cmluZyB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gIHRyeSB7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnRPcmlnKCdhJyk7XG4gICAgKGEgYXMgSFRNTEFuY2hvckVsZW1lbnQpLmhyZWYgPSB1cmw7XG4gICAgcmV0dXJuIChhLmNsb25lTm9kZShmYWxzZSkgYXMgSFRNTEFuY2hvckVsZW1lbnQpLmhvc3RuYW1lO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuIiwiLyoqXG4gKiBAcGFyYW0gUHJvbWlzZUNvbnN0cnVjdG9yIC0gVGhlIHByb21pc2UgY29uc3RydWN0b3JcbiAqIEByZXR1cm5zIC0gQSBwcm9taXNlXG4gKi9cbmV4cG9ydCBjb25zdCByZXNvbHZlZFByb21pc2UgPSAoUHJvbWlzZUNvbnN0cnVjdG9yOiBQcm9taXNlQ29uc3RydWN0b3IpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlQ29uc3RydWN0b3IoKHJlc29sdmUsIF8pID0+IHtcbiAgICByZXNvbHZlKCk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gUHJvbWlzZUNvbnN0cnVjdG9yIC0gVGhlIHByb21pc2UgY29udHJ1Y3RvclxuICogQHBhcmFtIHRpbWVvdXRNcyAtIEEgdGltZW91dCBkZWZpbmVkIGluIG1pbGlzZWNvbmRzXG4gKiBAcmV0dXJucyAtIEEgcHJvbWlzZSB3aGljaCB3aWxsIHJlc29sdmUgYWZ0ZXIgYSBkZWZpbmVkIGFtb3VudCBvZiBtaWxpc2Vjb25kc1xuICovXG5leHBvcnQgY29uc3QgY3JlYXRlVGltZW91dFByb21pc2UgPSBmdW5jdGlvbiAoUHJvbWlzZUNvbnN0cnVjdG9yOiBQcm9taXNlQ29uc3RydWN0b3IsIHRpbWVvdXRNczogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZUNvbnN0cnVjdG9yKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgc2V0VGltZW91dChyZXNvbHZlLCB0aW1lb3V0TXMpO1xuICB9KTtcbn07XG4iLCIvKipcbiAqIEBwYXJhbSBzdHIgLSBTdHJpbmcgdG8gZW5jb2RlXG4gKiBAcmV0dXJucyAtIEFuIGVuY29kZWQgc3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBodG1sRW5jb2RlID0gZnVuY3Rpb24gKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIFN0cmluZyhzdHIpLnJlcGxhY2UoL1teXFx3LiBdL2dpLCBmdW5jdGlvbiAoYyA6IHN0cmluZykge1xuICAgIHJldHVybiAnJiMnICsgYy5jaGFyQ29kZUF0KDApICsgJzsnO1xuICB9KTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHZhbHVlIC0gVmFsdWUgdG8gY2hlY2sgYWdhaW5zdFxuICogQHJldHVybnMgLSBXaGV0aGVyIG9yIG5vdCB0aGUgdmFsdWUgaXMgYSBudW1iZXJcbiAqL1xuZXhwb3J0IGNvbnN0IGlzSW50ID0gZnVuY3Rpb24gKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuICFpc05hTih2YWx1ZSkgJiYgKHBhcnNlSW50KHZhbHVlKSA9PT0gdmFsdWUpICYmICFpc05hTihwYXJzZUludCh2YWx1ZSwgMTApKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHZhbHVlIC0gVGhlIHN0cmluZyB0byBiZSB0cnVuY2F0ZWRcbiAqIEBwYXJhbSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBzdHJpbmcgYWZ0ZXIgdHJ1bmNhdGlvblxuICogQHJldHVybnMgLSBBIHRydW5jYXRlZCBzdHJpbmcgaWYgaXQgZXhjZWVkcyB0aGUgbGVuZ3RoLCBvciB0aGUgc3RyaW5nIGl0c2VsZlxuICovXG5leHBvcnQgY29uc3QgZ2V0VHJ1bmNhdGVkU3RyaW5nID0gZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcsIGxlbmd0aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgaWYgKHZhbHVlLmxlbmd0aCA+IGxlbmd0aCkge1xuICAgIHJldHVybiB2YWx1ZS5zdWJzdHJpbmcoMCwgbGVuZ3RoIC0gMykgKyAnLi4uJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn07XG4iLCJleHBvcnQgY29uc3QgQ0FURUdPUllfTkVDRVNTQVJZID0gJ25lY2Vzc2FyeSc7XG5cbmV4cG9ydCBjb25zdCBDQVRFR09SWV9QUkVGRVJFTkNFUyA9ICdwcmVmZXJlbmNlcyc7XG5cbmV4cG9ydCBjb25zdCBDQVRFR09SWV9TVEFUSVNUSUNTID0gJ3N0YXRpc3RpY3MnO1xuXG5leHBvcnQgY29uc3QgQ0FURUdPUllfTUFSS0VUSU5HID0gJ21hcmtldGluZyc7XG5cbmV4cG9ydCB0eXBlIENvbnNlbnRDYXRlZ29yeSA9ICduZWNlc3NhcnknIHwgJ3ByZWZlcmVuY2VzJyB8ICdzdGF0aXN0aWNzJyB8ICdtYXJrZXRpbmcnO1xuXG4vKipcbiAqIEBwYXJhbSBjYXROdW1iZXJBcnJheSAtIEFycmF5IG9mIG51bWJlcnMgdG8gYmUgbWFwcGVkIHRvIGNhdGVnb3JpZXNcbiAqIEByZXR1cm5zIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIGNvb2tpZSBjYXRlZ29yaWVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb29raWVDYXRlZ29yaWVzRnJvbU51bWJlckFycmF5IChjYXROdW1iZXJBcnJheTogbnVtYmVyW10pOiBzdHJpbmcgeyAvLyBUT0RPIC0gQWRkIGJldHRlciBuYW1pbmcgZm9yIHRoaXMgZnVuY3Rpb25cbiAgbGV0IGNhdGVnb3J5U3RyaW5nID0gJyc7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYXROdW1iZXJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChjYXRlZ29yeVN0cmluZyAhPT0gJycpIHtcbiAgICAgIGNhdGVnb3J5U3RyaW5nICs9ICcsJztcbiAgICB9XG5cbiAgICBzd2l0Y2ggKE51bWJlcihjYXROdW1iZXJBcnJheVtpXSkpIHtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgY2F0ZWdvcnlTdHJpbmcgKz0gQ0FURUdPUllfUFJFRkVSRU5DRVM7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBjYXRlZ29yeVN0cmluZyArPSBDQVRFR09SWV9TVEFUSVNUSUNTO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgaWYgKChjYXRlZ29yeVN0cmluZyA9PT0gJycpIHx8IChjYXRlZ29yeVN0cmluZy5pbmRleE9mKENBVEVHT1JZX01BUktFVElORykgPT09IC0xKSkge1xuICAgICAgICAgIGNhdGVnb3J5U3RyaW5nICs9IENBVEVHT1JZX01BUktFVElORztcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNTogLy8gdW5jbGFzc2lmaWVkIC0+IGRvbid0IGRvIGFueXRoaW5nIGFzIGl0IG1pZ2h0IGJyZWFrIHNpdGVcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoKGNhdGVnb3J5U3RyaW5nICE9PSAnJykgJiYgKGNhdGVnb3J5U3RyaW5nLnNsaWNlKC0xKSA9PT0gJywnKSkge1xuICAgIGNhdGVnb3J5U3RyaW5nID0gY2F0ZWdvcnlTdHJpbmcuc3Vic3RyaW5nKDAsIGNhdGVnb3J5U3RyaW5nLmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIGNhdGVnb3J5U3RyaW5nO1xufVxuIiwiaW1wb3J0IHsgQ0FURUdPUllfTUFSS0VUSU5HLCBDQVRFR09SWV9QUkVGRVJFTkNFUywgQ0FURUdPUllfU1RBVElTVElDUyB9IGZyb20gJ0AvY29uc2VudHMvY29uc2VudCc7XG5cbmV4cG9ydCBjb25zdCBDQVRFR09SWV9JRF9QUkVGRVJFTkNFUyA9IDI7XG5cbmV4cG9ydCBjb25zdCBDQVRFR09SWV9JRF9TVEFUSVNUSUNTID0gMztcblxuZXhwb3J0IGNvbnN0IENBVEVHT1JZX0lEX01BUktFVElORyA9IDQ7XG5cbi8qKlxuICogQHBhcmFtIGNhdGVnb3J5U3RyaW5ncyAtIEFycmF5IG9mIGNhdGVnb3J5IHN0cmluZ3MgdG8gYmUgbWFwcGVkIHRvIElEJ3NcbiAqIEByZXR1cm5zIC0gQW4gYXJyYXkgb2YgY2F0ZWdvcnkgSUQnc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29va2llc051bWJlckNhdGVnb3JpZXNGcm9tU3RyaW5nQXJyYXkgKGNhdGVnb3J5U3RyaW5nczogc3RyaW5nW10pOiBudW1iZXJbXSB7XG4gIGNvbnN0IGNhdGVnb3J5TnVtYmVyQXJyYXkgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGNhdGVnb3J5U3RyaW5ncy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNhdGVnb3J5U3RyaW5nID0gY2F0ZWdvcnlTdHJpbmdzW2ldO1xuXG4gICAgc3dpdGNoIChjYXRlZ29yeVN0cmluZykge1xuICAgICAgY2FzZSBDQVRFR09SWV9QUkVGRVJFTkNFUzpcbiAgICAgICAgY2F0ZWdvcnlOdW1iZXJBcnJheS5wdXNoKENBVEVHT1JZX0lEX1BSRUZFUkVOQ0VTKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENBVEVHT1JZX1NUQVRJU1RJQ1M6XG4gICAgICAgIGNhdGVnb3J5TnVtYmVyQXJyYXkucHVzaChDQVRFR09SWV9JRF9TVEFUSVNUSUNTKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENBVEVHT1JZX01BUktFVElORzpcbiAgICAgICAgY2F0ZWdvcnlOdW1iZXJBcnJheS5wdXNoKENBVEVHT1JZX0lEX01BUktFVElORyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNhdGVnb3J5TnVtYmVyQXJyYXk7XG59XG4iLCJpbXBvcnQgeyBJQ29va2llQ29uc2VudCB9IGZyb20gJ0AvdHlwZXMvY29uc2VudCc7XG5cbmV4cG9ydCBjb25zdCBoYXNGcmFtZXdvcmsgPSBmdW5jdGlvbiAoY29va2llQ29uc2VudDogSUNvb2tpZUNvbnNlbnQpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNvb2tpZUNvbnNlbnQuaGFzRnJhbWV3b3JrICYmICFjb29raWVDb25zZW50LmZyYW1ld29ya0Jsb2NrZWQgJiYgKGNvb2tpZUNvbnNlbnQuZnJhbWV3b3JrLnRvTG93ZXJDYXNlKCkgPT09ICd0Y2Z2Mi4zJyk7XG59O1xuIiwiaW1wb3J0IHsgSUNvb2tpZUNvbnNlbnQgfSBmcm9tICdAL3R5cGVzL2NvbnNlbnQnO1xuaW1wb3J0IHsgaGFzRnJhbWV3b3JrIH0gZnJvbSAnQC9jb25zZW50cy90Y2YvaGFzRnJhbWV3b3JrJztcblxuLyoqXG4gKiBAcGFyYW0gY29va2llQ29uc2VudCAtIENvb2tpZUNvbnNlbnQgLyBDb29raWVib3Qgb2JqZWN0XG4gKi9cbmV4cG9ydCBjb25zdCBsb2FkSW5saW5lQ29uZmlndXJhdGlvbiA9IGZ1bmN0aW9uKGNvb2tpZUNvbnNlbnQ6IElDb29raWVDb25zZW50KTogdm9pZCB7XG4gIHRyeSB7XG4gICAgY29uc3QgZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdDb29raWVib3RDb25maWd1cmF0aW9uJykgYXMgSFRNTFNjcmlwdEVsZW1lbnQ7XG4gICAgaWYgKGQgJiYgKGQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2NyaXB0JykgJiYgKGQudHlwZSAmJiBkLnR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ2FwcGxpY2F0aW9uL2pzb24nKSkge1xuICAgICAgY29va2llQ29uc2VudC5pbmxpbmVDb25maWd1cmF0aW9uID0gSlNPTi5wYXJzZShkLmlubmVySFRNTCk7XG4gICAgICBjb25zdCBoYXNFbmFibGVkRnJhbWV3b3JrID0gaGFzRnJhbWV3b3JrKGNvb2tpZUNvbnNlbnQpO1xuXG4gICAgICAvLyBjaGVjayB2YWxpZGl0eSBvZiBGcmFtZXdvcmtzIGNvbmZpZ3VyYXRpb25cbiAgICAgIGlmIChjb29raWVDb25zZW50LmlubGluZUNvbmZpZ3VyYXRpb24/LkZyYW1ld29ya3MpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICFoYXNFbmFibGVkRnJhbWV3b3JrIHx8XG4gICAgICAgICAgICAgICAgICAodHlwZW9mIGNvb2tpZUNvbnNlbnQuaW5saW5lQ29uZmlndXJhdGlvbi5GcmFtZXdvcmtzID09PSAndW5kZWZpbmVkJykgfHxcbiAgICAgICAgICAgICAgICAgICh0eXBlb2YgY29va2llQ29uc2VudC5pbmxpbmVDb25maWd1cmF0aW9uLkZyYW1ld29ya3MuSUFCVENGMiA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICkge1xuICAgICAgICAgIGNvb2tpZUNvbnNlbnQuaW5saW5lQ29uZmlndXJhdGlvbi5GcmFtZXdvcmtzID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGNoZWNrIHZhbGlkaXR5IG9mIFRhZ0NvbmZpZ3VyYXRpb24gY29uZmlndXJhdGlvblxuICAgICAgaWYgKGNvb2tpZUNvbnNlbnQuaW5saW5lQ29uZmlndXJhdGlvbj8uVGFnQ29uZmlndXJhdGlvbikge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdHlwZW9mIGNvb2tpZUNvbnNlbnQuaW5saW5lQ29uZmlndXJhdGlvbi5UYWdDb25maWd1cmF0aW9uICE9PSAnb2JqZWN0JyB8fFxuICAgICAgICAgICAgY29va2llQ29uc2VudC5pbmxpbmVDb25maWd1cmF0aW9uLlRhZ0NvbmZpZ3VyYXRpb24ubGVuZ3RoID09PSAwXG4gICAgICAgICkge1xuICAgICAgICAgIGNvb2tpZUNvbnNlbnQuaW5saW5lQ29uZmlndXJhdGlvbi5UYWdDb25maWd1cmF0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGNoZWNrIHZhbGlkaXR5IG9mIFdpZGdldCBjb25maWd1cmF0aW9uXG4gICAgICBpZiAoY29va2llQ29uc2VudC5pbmxpbmVDb25maWd1cmF0aW9uPy5XaWRnZXRDb25maWd1cmF0aW9uKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICB0eXBlb2YgY29va2llQ29uc2VudC5pbmxpbmVDb25maWd1cmF0aW9uLldpZGdldENvbmZpZ3VyYXRpb24gIT09ICdvYmplY3QnIHx8XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZSAtIFRPRE86IFJlbW92ZSB0cy1pZ25vcmUgb25jZSB3ZSBoYXZlIGEgcHJvcGVyIHdheSBvZiBtb2NraW5nIHRoZSBnbG9iYWwgQ29va2llQ29uc2VudCBvYmplY3RcbiAgICAgICAgICBjb29raWVDb25zZW50LmlubGluZUNvbmZpZ3VyYXRpb24uV2lkZ2V0Q29uZmlndXJhdGlvbi5sZW5ndGggPT09IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgY29va2llQ29uc2VudC5pbmxpbmVDb25maWd1cmF0aW9uLldpZGdldENvbmZpZ3VyYXRpb24gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb29raWVDb25zZW50LmlubGluZUNvbmZpZ3VyYXRpb24gPSBudWxsO1xuICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gQ29va2llYm90IGlubGluZSBjb25maWd1cmF0aW9uIHNlY3Rpb24gd2l0aGluIHRhZyBJZCAnQ29va2llYm90Q29uZmlndXJhdGlvbicuXCIpO1xuICB9XG59O1xuIiwiLy8gSGVscGVycyBmb3IgcHJvcGFnYXRpbmcgYSBjdXN0b21lci1zdXBwbGllZCBDU1Agbm9uY2UgdG8gZXZlcnkgPHNjcmlwdD4vPHN0eWxlPiBlbGVtZW50IENvb2tpZWJvdCBjcmVhdGVzIGF0IHJ1bnRpbWUuXG5cbi8vIFBlciBDU1AgTGV2ZWwgMywgYSBub25jZS1zb3VyY2UgY2FycmllcyBhIGJhc2U2NC12YWx1ZTpcbi8vICAgYmFzZTY0LXZhbHVlID0gMSooIEFMUEhBIC8gRElHSVQgLyBcIitcIiAvIFwiL1wiIC8gXCItXCIgLyBcIl9cIiApICoyKCBcIj1cIiApXG4vLyBBbnl0aGluZyBvdXRzaWRlIHRoYXQgZ3JhbW1hciAod2hpdGVzcGFjZSwgcXVvdGVzLCBhbmdsZSBicmFja2V0cywgZXRjLilcbi8vIGlzIHJlamVjdGVkIOKAlCB3ZSB0cmVhdCBpdCBhcyBpZiBubyBub25jZSB3YXMgc3VwcGxpZWQgcmF0aGVyIHRoYW5cbi8vIHByb3BhZ2F0aW5nIHVudHJ1c3RlZCBpbnB1dCBpbnRvIHRoZSBET00uXG5jb25zdCBOT05DRV9QQVRURVJOID0gL15bQS1aYS16MC05Ky9fLV0rPXswLDJ9JC87XG5cbmV4cG9ydCBjb25zdCBzYW5pdGl6ZU5vbmNlID0gZnVuY3Rpb24gKG5vbmNlOiBzdHJpbmcgfCB1bmRlZmluZWQgfCBudWxsKTogc3RyaW5nIHtcbiAgaWYgKCFub25jZSkgcmV0dXJuICcnO1xuICBpZiAoTk9OQ0VfUEFUVEVSTi50ZXN0KG5vbmNlKSkgcmV0dXJuIG5vbmNlO1xuICBjb25zb2xlLndhcm4oXCJDb29raWVib3Q6IG5vbmNlIHZhbHVlICclcycgaXMgbm90IGEgdmFsaWQgQ1NQIG5vbmNlIGFuZCB3aWxsIGJlIGlnbm9yZWQuXCIsIG5vbmNlKTtcbiAgcmV0dXJuICcnO1xufTtcblxuLyoqXG4gKiBSZXNvbHZlcyB0aGUgY3VzdG9tZXItc3VwcGxpZWQgQ1NQIG5vbmNlIGJ5IHJlYWRpbmcgdGhlIGAubm9uY2VgIElETFxuICogcHJvcGVydHkgb2YgdGhlIENvb2tpZWJvdCBzY3JpcHQgZWxlbWVudC4gVGhlIElETCBwcm9wZXJ0eSByZXR1cm5zIHRoZVxuICogYWN0dWFsIG5vbmNlIHZhbHVlIGV2ZW4gYWZ0ZXIgdGhlIGJyb3dzZXIgYXBwbGllcyBub25jZS1oaWRpbmcgKHdoaWNoXG4gKiBibGFua3MgYGdldEF0dHJpYnV0ZSgnbm9uY2UnKWAgdG8gcHJldmVudCBDU1MgZXhmaWx0cmF0aW9uIGF0dGFja3MpLlxuICogVGhlIHZhbHVlIGlzIHNhbml0aXplZCDigJQgYW55dGhpbmcgb3V0c2lkZSB0aGUgQ1NQIGJhc2U2NC12YWx1ZSBncmFtbWFyXG4gKiBpcyBkcm9wcGVkIHNvIHVudHJ1c3RlZCBpbnB1dCBuZXZlciByZWFjaGVzIHRoZSBET00uXG4gKi9cbmV4cG9ydCBjb25zdCByZWFkTm9uY2UgPSBmdW5jdGlvbiAoXG4gIHNjcmlwdEVsOiBIVE1MU2NyaXB0RWxlbWVudCB8IG51bGxcbik6IHN0cmluZyB7XG4gIHJldHVybiBzYW5pdGl6ZU5vbmNlKHNjcmlwdEVsPy5ub25jZSk7XG59O1xuXG4vKipcbiAqIEFwcGxpZXMgYSBDU1Agbm9uY2UgdG8gYSBuZXdseSBjcmVhdGVkIDxzY3JpcHQ+IG9yIDxzdHlsZT4gZWxlbWVudCBzbyBpdFxuICogc3Vydml2ZXMgc3RyaWN0IG5vbmNlLW9ubHkgQ29udGVudCBTZWN1cml0eSBQb2xpY3kuIFNldHMgYm90aCB0aGUgSURMXG4gKiBgLm5vbmNlYCBwcm9wZXJ0eSAod2hhdCBtb2Rlcm4gYnJvd3NlcnMgcmVhZCBmb3IgQ1NQIHZhbGlkYXRpb247XG4gKiBgZ2V0QXR0cmlidXRlKCdub25jZScpYCBpcyBibGFua2VkIHBvc3QtcGFyc2UpIGFuZCB0aGUgYG5vbmNlYCBhdHRyaWJ1dGVcbiAqIChmb3IgbGVnYWN5IHBhdGhzIGFuZCBwYXJzZXItaW5zZXJ0ZWQgZWxlbWVudHMpLlxuICpcbiAqIE5vLW9wIHdoZW4gYG5vbmNlYCBpcyBlbXB0eS91bmRlZmluZWQsIHNvIGN1c3RvbWVycyB3aXRob3V0IGEgc3RyaWN0IENTUFxuICogc2VlIG5vIG9ic2VydmFibGUgY2hhbmdlLlxuICovXG5leHBvcnQgY29uc3QgYXBwbHlOb25jZSA9IGZ1bmN0aW9uIChcbiAgZWxlbWVudDogSFRNTFNjcmlwdEVsZW1lbnQgfCBIVE1MU3R5bGVFbGVtZW50LFxuICBub25jZTogc3RyaW5nIHwgdW5kZWZpbmVkXG4pOiB2b2lkIHtcbiAgaWYgKCFub25jZSkgcmV0dXJuO1xuICAoZWxlbWVudCBhcyBIVE1MU2NyaXB0RWxlbWVudCAmIHsgbm9uY2U/OiBzdHJpbmcgfSkubm9uY2UgPSBub25jZTtcbiAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25vbmNlJywgbm9uY2UpO1xufTtcbiIsIi8vIEFkb3B0IG9yIGluamVjdCBhIHN0eWxlc2hlZXQgYXQgcnVudGltZSwgQ1NQLXNhZmUgd2hlbiBzdXBwb3J0ZWQuXG4vLyBTZXBhcmF0ZWQgZnJvbSBzdHlsZXMudHMgc28gY2FsbGVycyAoZS5nLiB1Yy5qcywgcnVudGltZVN0eWxlcy50cykgY2FuXG4vLyBpbXBvcnQgdGhlIGhlbHBlciB3aXRob3V0IHRyYW5zaXRpdmVseSBwdWxsaW5nIGluICouY3NzIG1vZHVsZSBpbXBvcnRzXG4vLyDigJQgdWMuanMncyBSb2xsdXAgYnVuZGxlIGhhcyBubyBwb3N0Y3NzIHBsdWdpbi5cblxuaW1wb3J0IHsgYXBwbHlOb25jZSB9IGZyb20gJ0AvdXRpbGl0aWVzJztcblxuZnVuY3Rpb24gc3VwcG9ydHNDb25zdHJ1Y3RlZFN0eWxlc2hlZXRzIChkb2N1bWVudDogRG9jdW1lbnQpOiBib29sZWFuIHtcbiAgcmV0dXJuIHR5cGVvZiBDU1NTdHlsZVNoZWV0ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHR5cGVvZiAoQ1NTU3R5bGVTaGVldC5wcm90b3R5cGUgYXMgeyByZXBsYWNlU3luYz86IHVua25vd24gfSkucmVwbGFjZVN5bmMgPT09ICdmdW5jdGlvbicgJiZcbiAgICAnYWRvcHRlZFN0eWxlU2hlZXRzJyBpbiBkb2N1bWVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkb3B0T3JJbmplY3RTdHlsZXNoZWV0IChkb2N1bWVudDogRG9jdW1lbnQsIGNzczogc3RyaW5nLCBmYWxsYmFja0lkOiBzdHJpbmcsIG5vbmNlPzogc3RyaW5nKTogdm9pZCB7XG4gIGlmIChzdXBwb3J0c0NvbnN0cnVjdGVkU3R5bGVzaGVldHMoZG9jdW1lbnQpKSB7XG4gICAgY29uc3Qgc2hlZXQgPSBuZXcgQ1NTU3R5bGVTaGVldCgpO1xuICAgIChzaGVldCBhcyBDU1NTdHlsZVNoZWV0ICYgeyByZXBsYWNlU3luYyhjc3M6IHN0cmluZyk6IHZvaWQgfSkucmVwbGFjZVN5bmMoY3NzKTtcbiAgICBjb25zdCBkb2MgPSBkb2N1bWVudCBhcyBEb2N1bWVudCAmIHsgYWRvcHRlZFN0eWxlU2hlZXRzOiBDU1NTdHlsZVNoZWV0W10gfTtcbiAgICBkb2MuYWRvcHRlZFN0eWxlU2hlZXRzID0gZG9jLmFkb3B0ZWRTdHlsZVNoZWV0cy5jb25jYXQoc2hlZXQpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIGNvbnN0IHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIGFwcGx5Tm9uY2Uoc3R5bGVFbGVtZW50LCBub25jZSk7XG4gIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgc3R5bGVFbGVtZW50LmlkID0gZmFsbGJhY2tJZDtcbiAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG59XG4iLCIvLyBSdW50aW1lLWFkb3B0ZWQgQ1NTIHJ1bGVzIHJlcXVpcmVkIG91dHNpZGUgdGhlIHBlci10ZW5hbnQgYmFubmVyIHN0eWxlc2hlZXQuXG4vLyBBcHBsaWVkIHZpYSBjb25zdHJ1Y3RlZCBzdHlsZXNoZWV0cyB3aGVuIHN1cHBvcnRlZCAoQ1NQLXNhZmUsIG5vIDxzdHlsZT4gZWxlbWVudFxuLy8gYW5kIG5vIGlubGluZS1zdHlsZSBtdXRhdGlvbiksIHdpdGggYSA8c3R5bGU+LWVsZW1lbnQgZmFsbGJhY2suXG5cbmltcG9ydCB7IGFkb3B0T3JJbmplY3RTdHlsZXNoZWV0IH0gZnJvbSAnLi9hZG9wdFN0eWxlc2hlZXQnO1xuXG5leHBvcnQgY29uc3QgSElEREVOX0lGUkFNRV9DTEFTUyA9ICdDeWJvdENvb2tpZWJvdEhpZGRlbklmcmFtZSc7XG5leHBvcnQgY29uc3QgT0ZGU0NSRUVOX0lGUkFNRV9DTEFTUyA9ICdDeWJvdENvb2tpZWJvdE9mZnNjcmVlbklmcmFtZSc7XG5leHBvcnQgY29uc3QgREFUQV9ESVNQTEFZX05PTkUgPSAnZGF0YS1jeWJvdC1jb29raWVib3QtYmxvY2tlZCc7XG5leHBvcnQgY29uc3QgUlVOVElNRV9TVFlMRVNIRUVUX0lEID0gJ0N5Ym90Q29va2llYm90UnVudGltZVN0eWxlcyc7XG5cbmNvbnN0IFJVTlRJTUVfQ1NTID0gYFxuWyR7REFUQV9ESVNQTEFZX05PTkV9PVwidHJ1ZVwiXSxcbi4ke0hJRERFTl9JRlJBTUVfQ0xBU1N9IHtcbiAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xufVxuLiR7T0ZGU0NSRUVOX0lGUkFNRV9DTEFTU30ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiAxcHg7XG4gIGhlaWdodDogMXB4O1xuICB0b3A6IC05OTk5cHg7XG59XG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlSdW50aW1lU3R5bGVzaGVldCAoZG9jdW1lbnQ6IERvY3VtZW50LCBub25jZT86IHN0cmluZyk6IHZvaWQge1xuICBhZG9wdE9ySW5qZWN0U3R5bGVzaGVldChkb2N1bWVudCwgUlVOVElNRV9DU1MsIFJVTlRJTUVfU1RZTEVTSEVFVF9JRCwgbm9uY2UpO1xufVxuIiwiaW1wb3J0IHsgSElEREVOX0lGUkFNRV9DTEFTUywgYXBwbHlSdW50aW1lU3R5bGVzaGVldCB9IGZyb20gJ0AvYmFubmVyL3J1bnRpbWVTdHlsZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIHVzcERhdGEge1xuICB2ZXJzaW9uOiBudW1iZXIsXG4gIHVzcFN0cmluZzogc3RyaW5nXG59XG5cbmNvbnN0IHVzYXBpQ29tbWFuZHMgPSB7XG4gIGdldFVTUERhdGE6ICdnZXRVU1BEYXRhJ1xufSBhcyBjb25zdDtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzcGFwaShjb21tYW5kOiBrZXlvZiB0eXBlb2YgdXNhcGlDb21tYW5kcywgdmVyc2lvbjogbnVtYmVyLCBjYWxsYmFjazogKHVzcERhdGE6IHVzcERhdGEgfCBudWxsLCBpc1N1Y2Nlc3M/OiBib29sZWFuKSA9PiB2b2lkKSB7XG4gIGNvbnN0IEFQSVZlcnNpb24gPSAxOyAvLyBDdXJyZW50IFUuUy4gUHJpdmFjeSBzcGVjIHZlcnNpb25cbiAgbGV0IHVzcERhdGEgPSBudWxsO1xuICBsZXQgaXNTdWNjZXNzID0gdHJ1ZTtcbiAgbGV0IHVzcEFwcGxpZXMgPSB0cnVlO1xuXG4gIGlmIChcbiAgICB3aW5kb3cuQ29va2llQ29uc2VudCAmJlxuICAgICh3aW5kb3cuQ29va2llQ29uc2VudC51c2VyQ291bnRyeSAhPT0gJycpICYmXG4gICAgKHdpbmRvdy5Db29raWVDb25zZW50LnJlZ3VsYXRpb25SZWdpb25zLmNjcGEuaW5kZXhPZih3aW5kb3cuQ29va2llQ29uc2VudC51c2VyQ291bnRyeS50b0xvd2VyQ2FzZSgpKSA9PT0gLTEpXG4gICkge1xuICAgIHVzcEFwcGxpZXMgPSBmYWxzZTtcbiAgfVxuXG4gIGlmICh2ZXJzaW9uID09PSBBUElWZXJzaW9uKSB7XG4gICAgaWYgKGNvbW1hbmQgPT09ICdnZXRVU1BEYXRhJykgeyAvLyBHZW5lcmF0ZSBjb25zZW50IHN0cmluZyBhcyBkZWZpbmVkIGluIGh0dHBzOi8vaWFidGVjaGxhYi5jb20vd3AtY29udGVudC91cGxvYWRzLzIwMTkvMTEvVS5TLi1Qcml2YWN5LVN0cmluZy12MS4wLUlBQi1UZWNoLUxhYi5wZGZcbiAgICAgIGlmICh1c3BBcHBsaWVzKSB7XG4gICAgICAgIGxldCB1c3BTdHJpbmcgPSBBUElWZXJzaW9uLnRvU3RyaW5nKCk7IC8vIFNwZWNpZmljYXRpb24gdmVyc2lvblxuICAgICAgICB1c3BTdHJpbmcgKz0gJ1knOyAvLyBFeHBsaWNpdCBOb3RpY2UvT3Bwb3J0dW5pdHkgdG8gT3B0IE91dFxuICAgICAgICBpZiAod2luZG93LkNvb2tpZUNvbnNlbnQgJiYgd2luZG93LkNvb2tpZUNvbnNlbnQuaGFzUmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAod2luZG93LkNvb2tpZUNvbnNlbnQuY29uc2VudC5tYXJrZXRpbmcpIHtcbiAgICAgICAgICAgIHVzcFN0cmluZyArPSAnTic7IC8vIFwiVGhlIHVzZXIgaGFzIG1hZGUgYSBjaG9pY2UgdG8gb3B0IG91dCBvZiBzYWxlLlwiIC0+IE5vXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVzcFN0cmluZyArPSAnWSc7IC8vIFwiVGhlIHVzZXIgaGFzIG1hZGUgYSBjaG9pY2UgdG8gb3B0IG91dCBvZiBzYWxlLlwiIC0+IFllc1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAod2luZG93LkNvb2tpZUNvbnNlbnQgJiYgIXdpbmRvdy5Db29raWVDb25zZW50Lmhhc1Jlc3BvbnNlICYmICFuYXZpZ2F0b3IuZ2xvYmFsUHJpdmFjeUNvbnRyb2wpIHtcbiAgICAgICAgICAgIHVzcFN0cmluZyArPSAnTic7IC8vIFVzZXIgaGFzIG5vdCB5ZXQgc3VibWl0dGVkIGNvbnNlbnQgLSBkZWZhdWx0IHRvIG9wdC1pblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB1c3BTdHJpbmcgKz0gJ1knOyAvLyBIYXMgdXNlciBvcHRlZC1vdXQgb2YgdGhlIHNhbGUgb2YgaGlzIG9yIHBlcnNvbmFsIGluZm9ybWF0aW9uLCBvciBkZWZhdWx0IG9wdC1vdXQgZm9yIEdQQyBzaWduYWxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdXNwU3RyaW5nICs9ICdZJzsgLy8gUHVibGlzaGVyIGlzIGEgc2lnbmF0b3J5IHRvIHRoZSBJQUIgTGltaXRlZCBTZXJ2aWNlIFByb3ZpZGVyIEFncmVlbWVudCAoTFNQQSlcblxuICAgICAgICB1c3BEYXRhID0ge1xuICAgICAgICAgIHZlcnNpb246IEFQSVZlcnNpb24sXG4gICAgICAgICAgdXNwU3RyaW5nXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1c3BEYXRhID0ge1xuICAgICAgICAgIHZlcnNpb246IEFQSVZlcnNpb24sXG4gICAgICAgICAgdXNwU3RyaW5nOiBBUElWZXJzaW9uLnRvU3RyaW5nKCkgKyAnLS0tJyAvLyBzaWduYWxzIHRoYXQgQ0NQQSBkb2VzIG5vdCBhcHBseSB0byB0aGUgZW5kIHVzZXJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXNTdWNjZXNzID0gZmFsc2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlzU3VjY2VzcyA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sodXNwRGF0YSwgaXNTdWNjZXNzKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkVXNwYXBpTG9jYXRvckZyYW1lKCkge1xuICBpZiAoIXdpbmRvdy5mcmFtZXMuX191c3BhcGlMb2NhdG9yKSB7XG4gICAgaWYgKGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIGFwcGx5UnVudGltZVN0eWxlc2hlZXQoZG9jdW1lbnQsIHdpbmRvdy5Db29raWVDb25zZW50ICYmIHdpbmRvdy5Db29raWVDb25zZW50Lm5vbmNlKTtcbiAgICAgIGNvbnN0IGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpO1xuXG4gICAgICBpZnJhbWUuY2xhc3NMaXN0LmFkZChISURERU5fSUZSQU1FX0NMQVNTKTtcbiAgICAgIGlmcmFtZS5uYW1lID0gJ19fdXNwYXBpTG9jYXRvcic7XG4gICAgICBpZnJhbWUudGFiSW5kZXggPSAtMTtcbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJlc2VudGF0aW9uJyk7IC8vIGhpZGUgaWZyYW1lIGZyb20gc2NyZWVuIHJlYWRlcnNcbiAgICAgIGlmcmFtZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTsgLy8gaGlkZSBpZnJhbWUgZnJvbSBzY3JlZW4gcmVhZGVyc1xuICAgICAgaWZyYW1lLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAnQmxhbmsnKTsgLy8gZW5hYmxlIHBhc3Npbmcgb2YgYWNjZXNzYWJsaWxpdHkgdGVzdFxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBXYWl0IGZvciB0aGUgYm9keSB0YWcgdG8gZXhpc3RcbiAgICAgIHNldFRpbWVvdXQod2luZG93LmFkZFVzcGFwaUxvY2F0b3JGcmFtZSwgNSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVVc3BhcGlNZXNzYWdlIChldmVudDogTWVzc2FnZUV2ZW50KSB7XG4gIGNvbnN0IGRhdGEgPSBldmVudCAmJiBldmVudC5kYXRhICYmIGV2ZW50LmRhdGEuX191c3BhcGlDYWxsO1xuICBpZiAoZGF0YSkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93Ll9fdXNwYXBpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB3aW5kb3cuX191c3BhcGkoXG4gICAgICAgIGRhdGEuY29tbWFuZCxcbiAgICAgICAgZGF0YS52ZXJzaW9uLFxuICAgICAgICBmdW5jdGlvbiAocmV0dXJuVmFsdWU6IHVzcERhdGEgfCBudWxsLCBzdWNjZXNzOiBib29sZWFuKSB7XG4gICAgICAgICAgY29uc3QgZXZlbnRTb3VyY2UgPSBldmVudC5zb3VyY2UgYXMgV2luZG93O1xuICAgICAgICAgIGV2ZW50U291cmNlPy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICBfX3VzcGFwaVJldHVybjoge1xuICAgICAgICAgICAgICByZXR1cm5WYWx1ZSxcbiAgICAgICAgICAgICAgc3VjY2VzcyxcbiAgICAgICAgICAgICAgY2FsbElkOiBkYXRhLmNhbGxJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sICcqJyk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iLCIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZXN0KHMsIGUpIHtcclxuICAgIHZhciB0ID0ge307XHJcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcclxuICAgICAgICB0W3BdID0gc1twXTtcclxuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcclxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgICAgIH1cclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19jcmVhdGVCaW5kaW5nID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcclxuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XHJcbiAgICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkSW4oc3RhdGUsIHJlY2VpdmVyKSB7XHJcbiAgICBpZiAocmVjZWl2ZXIgPT09IG51bGwgfHwgKHR5cGVvZiByZWNlaXZlciAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcmVjZWl2ZXIgIT09IFwiZnVuY3Rpb25cIikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgdXNlICdpbicgb3BlcmF0b3Igb24gbm9uLW9iamVjdFwiKTtcclxuICAgIHJldHVybiB0eXBlb2Ygc3RhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHJlY2VpdmVyID09PSBzdGF0ZSA6IHN0YXRlLmhhcyhyZWNlaXZlcik7XHJcbn1cclxuIiwiLyogZXNsaW50LWRpc2FibGUgKi9cbi8qIEFtYXpvbiBDb25zZW50IEhhbmRsZXIgTGlicmFyeSAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAgIGFtem5Db25zZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICBjb25zdCB0ID0gKHQpID0+XG4gICAgICAgICAgISghdCB8fCAhL14oKDI1WzAtNV18KDJbMC00XXwxXFxkfFsxLTldfClcXGQpXFwuP1xcYil7NH0kLy50ZXN0KHQpKSAmJlxuICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICB0LnNwbGl0KCcuJykuZXZlcnkoKHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGUgPSBwYXJzZUludCh0LCAxMCk7XG4gICAgICAgICAgICByZXR1cm4gZSA+PSAwICYmIGUgPD0gMjU1O1xuICAgICAgICAgIH0pLFxuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgIGUgPSAodCkgPT4gIWlzTmFOKERhdGUucGFyc2UodCkpLFxuICAgICAgICBvID0ge1xuICAgICAgICAgIENPT0tJRV9OQU1FOiAnYW16bl9jb25zZW50JyxcbiAgICAgICAgICBDT09LSUVfVFRMX01TOiAyNDE5MmU1LFxuICAgICAgICAgIENPT0tJRV9QQVRIOiAnLycsXG4gICAgICAgICAgQ09PS0lFX1NBTUVfU0lURTogJ1N0cmljdCcsXG4gICAgICAgICAgQ09OU0VOVF9DSEFOR0VfRVZFTlQ6ICdhbXpuQ29uc2VudENoYW5nZScsXG4gICAgICAgICAgQ09OU0VOVF9TVEFUVVM6IHsgR1JBTlRFRDogJ0dSQU5URUQnLCBERU5JRUQ6ICdERU5JRUQnIH0sXG4gICAgICAgICAgREVGQVVMVF9WRVJTSU9OOiAnMScsXG4gICAgICAgICAgREVGQVVMVF9DT05TRU5UOiB7XG4gICAgICAgICAgICBnZW86IHsgaXBBZGRyZXNzOiAnJywgY291bnRyeUNvZGU6ICcnIH0sXG4gICAgICAgICAgICBhbWF6b25Db25zZW50Rm9ybWF0OiB7IGFtem5BZFN0b3JhZ2U6ICdERU5JRUQnLCBhbXpuVXNlckRhdGE6ICdERU5JRUQnIH0sXG4gICAgICAgICAgICBncHA6ICcnLFxuICAgICAgICAgICAgdGNmOiAnJyxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogJycsXG4gICAgICAgICAgICB2ZXJzaW9uOiAnMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBDT1VOVFJZX0NPREVfTEVOR1RIOiAyLFxuICAgICAgICB9O1xuICAgICAgY2xhc3MgbiB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICB0aGlzLmRlZmF1bHRWZXJzaW9uID0gby5ERUZBVUxUX1ZFUlNJT047XG4gICAgICAgIH1cbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICBnZXRDb25zZW50RGF0YSh0KSB7XG4gICAgICAgICAgbGV0IGUsIG87XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICgnc3RyaW5nJyA9PSB0eXBlb2YgdCkgZSA9IEpTT04ucGFyc2UodCk7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKCdvYmplY3QnICE9IHR5cGVvZiB0IHx8IG51bGwgPT09IHQpIHRocm93IG5ldyBFcnJvcignSW5wdXQgbXVzdCBiZSBlaXRoZXIgYSBKU09OIHN0cmluZyBvciBhbiBvYmplY3QnKTtcbiAgICAgICAgICAgICAgZSA9IHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKG8gPSB0aGlzLmlzVmFsaWRGb3JtYXR0ZWRPdXRwdXQoZSkgPyBlIDogdGhpcy5mb3JtYXRPdXRwdXQoZSkpLCB0aGlzLnZhbGlkYXRlRm9ybWF0dGVkT3V0cHV0KG8pLCBvO1xuICAgICAgICAgIH0gY2F0Y2ggKHQpIHtcbiAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKCdFcnJvciBpbiBnZXRDb25zZW50RGF0YTonLCB0Lm1lc3NhZ2UpLCBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgIHZhbGlkYXRlSW5wdXQobykge1xuICAgICAgICAgIGNvbnN0IG4gPSBvO1xuICAgICAgICAgIGlmICh2b2lkIDAgIT09IG8udmVyc2lvbiAmJiAoJ251bWJlcicgIT0gdHlwZW9mIG4udmVyc2lvbiB8fCAxICE9PSBvLnZlcnNpb24pKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHZlcnNpb24uIE11c3QgYmUgMSBpZiBwcm92aWRlZCcpO1xuICAgICAgICAgIGlmICh2b2lkIDAgIT09IG8uaXBBZGRyZXNzICYmICgnc3RyaW5nJyAhPSB0eXBlb2Ygbi5pcEFkZHJlc3MgfHwgIXQoby5pcEFkZHJlc3MpKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBJUCBhZGRyZXNzJyk7XG4gICAgICAgICAgaWYgKHZvaWQgMCAhPT0gby5jb3VudHJ5Q29kZSAmJiAoJ3N0cmluZycgIT0gdHlwZW9mIG4uY291bnRyeUNvZGUgfHwgMiAhPT0gby5jb3VudHJ5Q29kZT8ubGVuZ3RoKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb3VudHJ5IGNvZGUuIE11c3QgYmUgYSAyLWxldHRlciBjb2RlJyk7XG4gICAgICAgICAgaWYgKHZvaWQgMCAhPT0gby5lbmFibGVBZFN0b3JhZ2UgJiYgJ2Jvb2xlYW4nICE9IHR5cGVvZiBuLmVuYWJsZUFkU3RvcmFnZSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZW5hYmxlQWRTdG9yYWdlIG11c3QgYmUgYSBib29sZWFuJyk7XG4gICAgICAgICAgaWYgKHZvaWQgMCAhPT0gby5lbmFibGVVc2VyRGF0YSAmJiAnYm9vbGVhbicgIT0gdHlwZW9mIG4uZW5hYmxlVXNlckRhdGEpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2VuYWJsZVVzZXJEYXRhIG11c3QgYmUgYSBib29sZWFuJyk7XG4gICAgICAgICAgaWYgKHZvaWQgMCAhPT0gby5ncHAgJiYgJ3N0cmluZycgIT0gdHlwZW9mIG4uZ3BwKSB0aHJvdyBuZXcgRXJyb3IoJ2dwcCBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gICAgICAgICAgaWYgKHZvaWQgMCAhPT0gby50Y2YgJiYgJ3N0cmluZycgIT0gdHlwZW9mIG4udGNmKSB0aHJvdyBuZXcgRXJyb3IoJ3RjZiBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gICAgICAgICAgaWYgKG8udGltZXN0YW1wICYmICFlKG8udGltZXN0YW1wKSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRpbWVzdGFtcCcpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgZm9ybWF0T3V0cHV0KHQpIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUlucHV0KHQpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBnZW86IHsgaXBBZGRyZXNzOiB0LmlwQWRkcmVzcywgY291bnRyeUNvZGU6IHQuY291bnRyeUNvZGUgfSxcbiAgICAgICAgICAgICAgYW1hem9uQ29uc2VudEZvcm1hdDoge1xuICAgICAgICAgICAgICAgIGFtem5BZFN0b3JhZ2U6IHQuZW5hYmxlQWRTdG9yYWdlID8gby5DT05TRU5UX1NUQVRVUy5HUkFOVEVEIDogby5DT05TRU5UX1NUQVRVUy5ERU5JRUQsXG4gICAgICAgICAgICAgICAgYW16blVzZXJEYXRhOiB0LmVuYWJsZVVzZXJEYXRhID8gby5DT05TRU5UX1NUQVRVUy5HUkFOVEVEIDogby5DT05TRU5UX1NUQVRVUy5ERU5JRUQsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGdwcDogdC5ncHAsXG4gICAgICAgICAgICAgIHRjZjogdC50Y2YsXG4gICAgICAgICAgICAgIHRpbWVzdGFtcDogdC50aW1lc3RhbXAgfHwgbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgICAgICAgIHZlcnNpb246IHQudmVyc2lvbiA/IHQudmVyc2lvbi50b1N0cmluZygpIDogdGhpcy5kZWZhdWx0VmVyc2lvbixcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgaXNWYWxpZEZvcm1hdHRlZE91dHB1dCh0KSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICdvYmplY3QnID09IHR5cGVvZiB0ICYmXG4gICAgICAgICAgICBudWxsICE9PSB0ICYmXG4gICAgICAgICAgICAnZ2VvJyBpbiB0ICYmXG4gICAgICAgICAgICAnYW1hem9uQ29uc2VudEZvcm1hdCcgaW4gdCAmJlxuICAgICAgICAgICAgJ2dwcCcgaW4gdCAmJlxuICAgICAgICAgICAgJ3RjZicgaW4gdCAmJlxuICAgICAgICAgICAgJ3RpbWVzdGFtcCcgaW4gdCAmJlxuICAgICAgICAgICAgJ3ZlcnNpb24nIGluIHRcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgdmFsaWRhdGVGb3JtYXR0ZWRPdXRwdXQobikge1xuICAgICAgICAgIGNvbnN0IHIgPSBuO1xuICAgICAgICAgIGlmICghbi5nZW8gJiYgIW4uYW1hem9uQ29uc2VudEZvcm1hdCkgdGhyb3cgbmV3IEVycm9yKCdFaXRoZXIgZ2VvIG9yIGFtYXpvbkNvbnNlbnRGb3JtYXQgbXVzdCBiZSBwcm92aWRlZCcpO1xuICAgICAgICAgIGlmICh2b2lkIDAgIT09IG4uZ2VvPy5pcEFkZHJlc3MgJiYgIXQobi5nZW8/LmlwQWRkcmVzcykpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgSVAgYWRkcmVzcyBpbiBmb3JtYXR0ZWQgb3V0cHV0Jyk7XG4gICAgICAgICAgaWYgKG4uZ2VvPy5jb3VudHJ5Q29kZSAmJiBuLmdlby5jb3VudHJ5Q29kZS5sZW5ndGggIT09IG8uQ09VTlRSWV9DT0RFX0xFTkdUSClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb3VudHJ5IGNvZGUgaW4gZm9ybWF0dGVkIG91dHB1dCcpO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIG4uYW1hem9uQ29uc2VudEZvcm1hdD8uYW16bkFkU3RvcmFnZSAmJlxuICAgICAgICAgICAgIVtvLkNPTlNFTlRfU1RBVFVTLkdSQU5URUQsIG8uQ09OU0VOVF9TVEFUVVMuREVOSUVEXS5pbmNsdWRlcyhuLmFtYXpvbkNvbnNlbnRGb3JtYXQuYW16bkFkU3RvcmFnZSlcbiAgICAgICAgICApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYW16bkFkU3RvcmFnZSB2YWx1ZSBpbiBmb3JtYXR0ZWQgb3V0cHV0Jyk7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgbi5hbWF6b25Db25zZW50Rm9ybWF0Py5hbXpuVXNlckRhdGEgJiZcbiAgICAgICAgICAgICFbby5DT05TRU5UX1NUQVRVUy5HUkFOVEVELCBvLkNPTlNFTlRfU1RBVFVTLkRFTklFRF0uaW5jbHVkZXMobi5hbWF6b25Db25zZW50Rm9ybWF0LmFtem5Vc2VyRGF0YSlcbiAgICAgICAgICApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYW16blVzZXJEYXRhIHZhbHVlIGluIGZvcm1hdHRlZCBvdXRwdXQnKTtcbiAgICAgICAgICBpZiAodm9pZCAwICE9PSBuLmdwcCAmJiAnc3RyaW5nJyAhPSB0eXBlb2Ygci5ncHApIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBncHAgaW4gZm9ybWF0dGVkIG91dHB1dCcpO1xuICAgICAgICAgIGlmICh2b2lkIDAgIT09IG4udGNmICYmICdzdHJpbmcnICE9IHR5cGVvZiByLnRjZikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRjZiBpbiBmb3JtYXR0ZWQgb3V0cHV0Jyk7XG4gICAgICAgICAgaWYgKCFlKG4udGltZXN0YW1wKSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRpbWVzdGFtcCBpbiBmb3JtYXR0ZWQgb3V0cHV0Jyk7XG4gICAgICAgICAgaWYgKG4udmVyc2lvbiAhPT0gby5ERUZBVUxUX1ZFUlNJT04pIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB2ZXJzaW9uIGluIGZvcm1hdHRlZCBvdXRwdXQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY2xhc3MgciB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICAodGhpcy5jb29raWVOYW1lID0gby5DT09LSUVfTkFNRSksXG4gICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgICAgICAodGhpcy5jb29raWVUdGwgPSBvLkNPT0tJRV9UVExfTVMpLFxuICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICAgICAgKHRoaXMuQ09PS0lFX0NIQU5HRV9FVkVOVCA9ICdhbXpuQ29uc2VudENoYW5nZScpLFxuICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICAgICAgKHRoaXMuZGVmYXVsdENvbnNlbnQgPSB7IC4uLm8uREVGQVVMVF9DT05TRU5UIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgZGlzcGF0Y2hDb29raWVDaGFuZ2UodCkge1xuICAgICAgICAgIGNvbnN0IGUgPSBuZXcgQ3VzdG9tRXZlbnQoby5DT05TRU5UX0NIQU5HRV9FVkVOVCwgeyBkZXRhaWw6IHsgY29uc2VudDogdCB9IH0pO1xuICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgc2V0Q29uc2VudENvb2tpZSh0KSB7XG4gICAgICAgICAgY29uc3QgZSA9IEpTT04uc3RyaW5naWZ5KHQpLFxuICAgICAgICAgICAgbiA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICAgIG4uc2V0VGltZShuLmdldFRpbWUoKSArIHRoaXMuY29va2llVHRsKSxcbiAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICAgIChkb2N1bWVudC5jb29raWUgPSBgJHt0aGlzLmNvb2tpZU5hbWV9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KGUpfTsgZXhwaXJlcz0ke24udG9VVENTdHJpbmcoKX07IHBhdGg9JHtvLkNPT0tJRV9QQVRIfTsgU2FtZVNpdGU9JHtvLkNPT0tJRV9TQU1FX1NJVEV9OyBTZWN1cmVgKSxcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hDb29raWVDaGFuZ2UodCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICBpc1ZhbGlkQ29uc2VudENvb2tpZSh0KSB7XG4gICAgICAgICAgcmV0dXJuIHQgJiYgJ29iamVjdCcgPT0gdHlwZW9mIHQgJiYgJ2FtYXpvbkNvbnNlbnRGb3JtYXQnIGluIHQgJiYgJ3ZlcnNpb24nIGluIHQgJiYgJ3RpbWVzdGFtcCcgaW4gdDtcbiAgICAgICAgfVxuICAgICAgICBnZXRDb25zZW50Q29va2llKCkge1xuICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICBjb25zdCB0ID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpLmZpbmQoKHQpID0+IHQuc3RhcnRzV2l0aChgJHt0aGlzLmNvb2tpZU5hbWV9PWApKTtcbiAgICAgICAgICBpZiAoIXQpIHJldHVybiBudWxsO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBlID0gZGVjb2RlVVJJQ29tcG9uZW50KHQuc3BsaXQoJz0nKVsxXSksXG4gICAgICAgICAgICAgIG8gPSBKU09OLnBhcnNlKGUpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZENvbnNlbnRDb29raWUobykgPyBvIDogbnVsbDtcbiAgICAgICAgICB9IGNhdGNoICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcignRXJyb3IgcGFyc2luZyBjb25zZW50IGNvb2tpZTonLCB0KSwgbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2V0RGVmYXVsdENvbnNlbnQoKSB7XG4gICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICAgIHRoaXMuc2V0Q29uc2VudENvb2tpZSh0aGlzLmRlZmF1bHRDb25zZW50KTtcbiAgICAgICAgfVxuICAgICAgICBjbGVhckNvbnNlbnRDb29raWUoKSB7XG4gICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICAgIChkb2N1bWVudC5jb29raWUgPSBgJHt0aGlzLmNvb2tpZU5hbWV9PTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIFVUQzsgcGF0aD0vO2ApLFxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaENvb2tpZUNoYW5nZShudWxsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY2xhc3MgYSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICB0aGlzLmRhdGEgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgIHNldElwQWRkcmVzcyhlKSB7XG4gICAgICAgICAgaWYgKCdzdHJpbmcnICE9IHR5cGVvZiBlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJUCBhZGRyZXNzIG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgICAgICAgICBpZiAoIXQoZSkpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBJUCBhZGRyZXNzJyk7XG4gICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICAgIHJldHVybiAodGhpcy5kYXRhLmlwQWRkcmVzcyA9IGUpLCB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgc2V0Q291bnRyeUNvZGUodCkge1xuICAgICAgICAgIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdCB8fCAyICE9PSB0Lmxlbmd0aCkgdGhyb3cgbmV3IFR5cGVFcnJvcignQ291bnRyeSBjb2RlIG11c3QgYmUgYSAyLWxldHRlciBzdHJpbmcnKTtcbiAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgICAgcmV0dXJuICh0aGlzLmRhdGEuY291bnRyeUNvZGUgPSB0KSwgdGhpcztcbiAgICAgICAgfVxuICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgIHNldEVuYWJsZUFkU3RvcmFnZSh0KSB7XG4gICAgICAgICAgaWYgKCdib29sZWFuJyAhPSB0eXBlb2YgdCkgdGhyb3cgbmV3IFR5cGVFcnJvcignZW5hYmxlQWRTdG9yYWdlIG11c3QgYmUgYSBib29sZWFuJyk7XG4gICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICAgIHJldHVybiAodGhpcy5kYXRhLmVuYWJsZUFkU3RvcmFnZSA9IHQpLCB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgc2V0RW5hYmxlVXNlckRhdGEodCkge1xuICAgICAgICAgIGlmICgnYm9vbGVhbicgIT0gdHlwZW9mIHQpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuYWJsZVVzZXJEYXRhIG11c3QgYmUgYSBib29sZWFuJyk7XG4gICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICAgIHJldHVybiAodGhpcy5kYXRhLmVuYWJsZVVzZXJEYXRhID0gdCksIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICBzZXRHcHAodCkge1xuICAgICAgICAgIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdCkgdGhyb3cgbmV3IFR5cGVFcnJvcignR1BQIG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgICAgcmV0dXJuICh0aGlzLmRhdGEuZ3BwID0gdCksIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICBzZXRUY2YodCkge1xuICAgICAgICAgIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdCkgdGhyb3cgbmV3IFR5cGVFcnJvcignVENGIG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgICAgICAgcmV0dXJuICh0aGlzLmRhdGEudGNmID0gdCksIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICBzZXRWZXJzaW9uKHQpIHtcbiAgICAgICAgICBpZiAoJ251bWJlcicgIT0gdHlwZW9mIHQgfHwgMSAhPT0gdCkgdGhyb3cgbmV3IFR5cGVFcnJvcignVmVyc2lvbiBtdXN0IGJlIHRoZSBudW1iZXIgMScpO1xuICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICByZXR1cm4gKHRoaXMuZGF0YS52ZXJzaW9uID0gdCksIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICBzZXRUaW1lc3RhbXAodCkge1xuICAgICAgICAgIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdCB8fCBpc05hTihEYXRlLnBhcnNlKHQpKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVGltZXN0YW1wIG11c3QgYmUgYSB2YWxpZCBkYXRlIHN0cmluZycpO1xuICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICByZXR1cm4gKHRoaXMuZGF0YS50aW1lc3RhbXAgPSB0KSwgdGhpcztcbiAgICAgICAgfVxuICAgICAgICBidWlsZCgpIHtcbiAgICAgICAgICBjb25zdCB0ID0gbmV3IG4oKSxcbiAgICAgICAgICAgIGUgPSBuZXcgcigpLFxuICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICAgICAgbyA9IHQuZ2V0Q29uc2VudERhdGEodGhpcy5kYXRhKTtcbiAgICAgICAgICByZXR1cm4gbyAmJiBlLnNldENvbnNlbnRDb29raWUobyksIG87XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHR5cGVvZiB3aW5kb3cgPCAndScgJiZcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zdCB0ID0gbmV3IG4oKSxcbiAgICAgICAgICAgIGUgPSBuZXcgcigpO1xuICAgICAgICAgIGUuZ2V0Q29uc2VudENvb2tpZSgpIHx8IGUuc2V0RGVmYXVsdENvbnNlbnQoKSxcbiAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICAgICh3aW5kb3cuYW16bkNvbnNlbnQgPSBmdW5jdGlvbiAoLi4ubykge1xuICAgICAgICAgICAgICBpZiAoMCA9PT0gby5sZW5ndGgpIHJldHVybiBuZXcgYSgpO1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG4gPSB0LmdldENvbnNlbnREYXRhKG9bMF0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBuICYmIGUuc2V0Q29uc2VudENvb2tpZShuKSwgbjtcbiAgICAgICAgICAgICAgfSBjYXRjaCAodCkge1xuICAgICAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcignRXJyb3IgaW4gYW16bkNvbnNlbnQ6JywgdC5tZXNzYWdlKSwgbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pKCk7XG4gICAgfSxcbiAgfTtcbiAgIiwiaW1wb3J0IHsgSUNvb2tpZUNvbnNlbnQgfSBmcm9tICdAL3R5cGVzL2NvbnNlbnQnO1xuaW1wb3J0IGFjc0xpYiBmcm9tICcuL2Ftem4tY29uc2VudCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRBY3MoKTogdm9pZCB7XG4gIHRyeSB7XG4gICAgYWNzTGliLmFtem5Db25zZW50KCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLndhcm4oJ0Nvb2tpZWJvdDogSW5pdGlhbGl6YXRpb24gb2YgYW16bkNvbnNlbnQgZmFpbGVkJyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5QWNzKGNvb2tpZUNvbnNlbnQ6IElDb29raWVDb25zZW50KTogdm9pZCB7XG4gIHRyeSB7XG4gICAgd2luZG93XG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIHNldHRpbmcgZmxhZ3Mgb24gdGhlIGFtem5Db25zZW50IG9iamVjdFxuICAgICAgLmFtem5Db25zZW50KClcbiAgICAgIC5zZXRDb3VudHJ5Q29kZShjb29raWVDb25zZW50LnVzZXJDb3VudHJ5KVxuICAgICAgLnNldEVuYWJsZUFkU3RvcmFnZShjb29raWVDb25zZW50LmNvbnNlbnQubWFya2V0aW5nKVxuICAgICAgLnNldEVuYWJsZVVzZXJEYXRhKGNvb2tpZUNvbnNlbnQuY29uc2VudC5tYXJrZXRpbmcpXG4gICAgICAuYnVpbGQoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUud2FybignQ29va2llYm90OiBTdWJtaXR0aW5nIGFtem5Db25zZW50IGZhaWxlZCcpO1xuICB9XG59XG4iLCIvKipcbiAqIEBwYXJhbSBub2RlIC0gbm9kZSB0byBiZSBoYXNoZWRcbiAqL1xuZnVuY3Rpb24gdGFnU3RyaW5nIChub2RlOiBIVE1MRWxlbWVudCk6IHN0cmluZyB7XG4gIC8vIENvbXB1dGVzIHRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYW4gYEhUTUxFbGVtZW50YGludGVybmFsbHkgdXNlZCBieSB0YWdIYXNoXG4gIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSB8fCBub2RlLm5vZGVUeXBlID09PSBOb2RlLkNEQVRBX1NFQ1RJT05fTk9ERSkge1xuICAgIHJldHVybiAobm9kZS5ub2RlVmFsdWUgJiYgbm9kZS5ub2RlVmFsdWUudHJpbSgpKSB8fCAnJztcbiAgfVxuXG4gIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgIGNvbnN0IGF0dHJzID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gbm9kZS5hdHRyaWJ1dGVzLmxlbmd0aDsgaS0tOykge1xuICAgICAgY29uc3QgYXR0ciA9IG5vZGUuYXR0cmlidXRlc1tpXTtcbiAgICAgIGlmIChhdHRyLm5hbWUgIT09ICdzdHlsZScpIHtcbiAgICAgICAgYXR0cnMucHVzaChhdHRyLm5hbWUgKyAnPScgKyBhdHRyLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhdHRycy5zb3J0KCk7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXTtcblxuICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5vZGUuY2hpbGROb2Rlc1tqXSBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGNvbnN0IHN0cmluZyA9IHRhZ1N0cmluZyhjaGlsZE5vZGUpO1xuICAgICAgaWYgKHN0cmluZyAhPT0gJycpIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaChzdHJpbmcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2RlLnRhZ05hbWUgKyAnOycgKyBhdHRycy5qb2luKCc7JykgKyAoY2hpbGRyZW4ubGVuZ3RoID8gJ1snICsgY2hpbGRyZW4uam9pbignfCcpICsgJ10nIDogJycpO1xuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBAcGFyYW0gZWwgLSBlbGVtZW50IHRvIGJlIGhhc2hlZFxuICovXG5leHBvcnQgZnVuY3Rpb24gdGFnSGFzaCAoZWw6IEhUTUxFbGVtZW50KTogc3RyaW5nIHtcbiAgY29uc3Qgc3RyID0gdGFnU3RyaW5nKGVsKTtcbiAgbGV0IGhhc2gxID0gNTM4MTtcbiAgbGV0IGhhc2gyID0gNTI3MTE7XG4gIGxldCBrID0gc3RyLmxlbmd0aDtcblxuICB3aGlsZSAoay0tKSB7XG4gICAgY29uc3QgY2hhciA9IHN0ci5jaGFyQ29kZUF0KGspO1xuICAgIGhhc2gxID0gKGhhc2gxICogMzMpIF4gY2hhcjtcbiAgICBoYXNoMiA9IChoYXNoMiAqIDMzKSBeIGNoYXI7XG4gIH1cblxuICBjb25zdCBoYXNoID0gKGhhc2gxID4+PiAwKSAqIDQwOTYgKyAoaGFzaDIgPj4+IDApO1xuICByZXR1cm4gaGFzaC50b1N0cmluZygpO1xufVxuIiwiaW1wb3J0IHsgSUNvb2tpZUNvbnNlbnQgfSBmcm9tICdAL3R5cGVzL2NvbnNlbnQnO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNOb2RlSWdub3JlZEZyb21JbmxpbmVDb25maWcgKGNvb2tpZUNvbnNlbnQ6IElDb29raWVDb25zZW50LCBub2RlOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICBjb25zdCB0YWdDb25maWd1cmF0aW9uID0gY29va2llQ29uc2VudC5pbmxpbmVDb25maWd1cmF0aW9uICYmIGNvb2tpZUNvbnNlbnQuaW5saW5lQ29uZmlndXJhdGlvbi5UYWdDb25maWd1cmF0aW9uO1xuICBsZXQgaXNJZ25vcmVkID0gZmFsc2U7XG5cbiAgaWYgKG5vZGUuaWQgJiYgdGFnQ29uZmlndXJhdGlvbiAmJiB0YWdDb25maWd1cmF0aW9uLmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhZ0NvbmZpZ3VyYXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHRhZyA9IHRhZ0NvbmZpZ3VyYXRpb25baV07XG4gICAgICBpZiAoKHRhZy5pZCA9PT0gbm9kZS5pZCkgJiYgdGFnLmlnbm9yZSkge1xuICAgICAgICBpc0lnbm9yZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gaXNJZ25vcmVkO1xufVxuIiwiaW1wb3J0IHsgSUNvb2tpZUNvbnNlbnQgfSBmcm9tICdAL3R5cGVzL2NvbnNlbnQnO1xuaW1wb3J0IHsgaXNOb2RlSWdub3JlZEZyb21JbmxpbmVDb25maWcgfSBmcm9tICdAL2F1dG9ibG9ja2VyL2lzTm9kZUlnbm9yZWRGcm9tSW5saW5lQ29uZmlnJztcblxuLyoqXG4gKiBAcGFyYW0gd2luZG93IC0gR2xvYmFsIHdpbmRvdyBvYmplY3RcbiAqIEBwYXJhbSBkb2N1bWVudCAtIEdsb2JhbCBkb2N1bWVudCBlbGVtZW50XG4gKiBAcGFyYW0gY29va2llQ29uc2VudCAtIENvb2tpZUNvbnNlbnQgLyBDb29raWVib3Qgb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbml0TXV0YXRpb25PYnNlcnZlcih3aW5kb3c6IFdpbmRvdywgZG9jdW1lbnQ6IERvY3VtZW50LCBjb29raWVDb25zZW50OiBJQ29va2llQ29uc2VudCk6IHZvaWQge1xuICBjb25zdCBvcmlnaW5hbFdyaXRlID0gZG9jdW1lbnQud3JpdGUuYmluZChkb2N1bWVudCk7XG5cbiAgLy8gb3ZlcndyaXRlIGRvY3VtZW50LndyaXRlLCBhcyBjb250ZW50IGluIHNjcmlwdHMgd2lsbCBiZSBvdXRwdXQgYXN5bmMgaW4gbXV0YXRpb25vYnNlcnZlclxuICBjb25zdCB3cml0ZU92ZXJyaWRlID0gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgLy8gc2tpcCB0aGUgd3JpdGUgaWYgdGhlIHBhcmVudCBzY3JpcHQgaXMgbWFya2VkIHRvIGlnbm9yZSBkeW5hbWljYWxseSBpbnNlcnRlZCBjaGlsZHJlblxuICAgIGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0Py5kYXRhc2V0Py5jYklnbm9yZUR5bmFtaWNDaGlsZHJlbiA9PT0gJ3RydWUnKSB7XG4gICAgICByZXR1cm4gb3JpZ2luYWxXcml0ZSguLi5hcmdzKTtcbiAgICB9XG5cbiAgICBpZiAoIWFyZ3NbMF0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBub2RlID0gYXJnc1swXTtcbiAgICBsZXQgbGFzdENoaWxkO1xuXG4gICAgaWYgKGRvY3VtZW50LmJvZHkpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBub2RlKTtcbiAgICAgIGxhc3RDaGlsZCA9IGRvY3VtZW50LmJvZHkubGFzdENoaWxkIGFzIEhUTUxTY3JpcHRFbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5oZWFkLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgbm9kZSk7XG4gICAgICBsYXN0Q2hpbGQgPSBkb2N1bWVudC5oZWFkLmxhc3RDaGlsZCBhcyBIVE1MU2NyaXB0RWxlbWVudDtcbiAgICB9XG5cbiAgICAvLyBpZiBkb2N1bWVudC53cml0ZSBpbnNlcnRzIHNjcmlwdCB0YWcsIG1hcmsgaXQgYXMgcHJvY2Vzc2VkIGFuZCBwcm9jZXNzIGl0LCBhcyBzY3JpcHRzIGFyZSBub3QgbG9hZGVkIG9yIGV4ZWN1dGVkIHdoZW4gaW5zZXJ0ZWQgd2l0aCBpbnNlcnRBZGphY2VudEhUTUxcbiAgICBpZiAoXG4gICAgICBsYXN0Q2hpbGQgJiZcbiAgICAgIGxhc3RDaGlsZC50YWdOYW1lICYmXG4gICAgICAobGFzdENoaWxkLnRhZ05hbWUgPT09ICdTQ1JJUFQnKSAmJlxuICAgICAgKHR5cGVvZiBsYXN0Q2hpbGQuY29va2llU2NyaXB0UHJvY2Vzc2VkID09PSAndW5kZWZpbmVkJykgJiZcbiAgICAgICh0eXBlb2YgbGFzdENoaWxkLkNCX2lzQ2xvbmUgPT09ICd1bmRlZmluZWQnKSAmJlxuICAgICAgKHR5cGVvZiBsYXN0Q2hpbGQuY29uc2VudFByb2Nlc3NlZCA9PT0gJ3VuZGVmaW5lZCcpICYmXG4gICAgICAodHlwZW9mIGxhc3RDaGlsZC5jb29raWVzUHJvY2Vzc2VkID09PSAndW5kZWZpbmVkJylcbiAgICApIHtcbiAgICAgIGxhc3RDaGlsZC5jb25zZW50UHJvY2Vzc2VkID0gJzEnO1xuICAgICAgY29va2llQ29uc2VudC5SdW5TY3JpcHRUYWdzKFtsYXN0Q2hpbGRdKTsgLy8gY2FsbCB0byBleGVjdXRlIHNjcmlwdFxuICAgIH1cbiAgfTtcblxuICBkb2N1bWVudC53cml0ZSA9IHdyaXRlT3ZlcnJpZGU7XG5cbiAgLy8gb3ZlcnJpZGUgZXZlbnRsaXN0ZW5lcnNcbiAgY29va2llQ29uc2VudC5vdmVycmlkZUV2ZW50TGlzdGVuZXJzKCk7XG5cbiAgLy8gVGVzdCBicm93c2VyIGNhcGFiaWxpdGllc1xuICBsZXQgaXNNdXRhdGlvbkJyb3dzZXIgPSB0cnVlO1xuICBpZiAoKHR5cGVvZiBNdXRhdGlvbk9ic2VydmVyICE9PSAnZnVuY3Rpb24nKSAmJiAodHlwZW9mIE11dGF0aW9uT2JzZXJ2ZXIgIT09ICdvYmplY3QnKSkgeyAvLyAnZnVuY3Rpb24nIG9uIFdpbmRvd3MsICdvYmplY3QnIG9uIE1hY1xuICAgIGlzTXV0YXRpb25Ccm93c2VyID0gZmFsc2U7XG4gIH1cblxuICBpZiAoaXNNdXRhdGlvbkJyb3dzZXIpIHtcbiAgICAvLyB0ZXN0IGlmIGJyb3dzZXIgaXMgSUUgb3IgRWRnZUhUTUwgKHZzIEVkZ2VDaHJvbWl1bSksIGFzIHRoZXNlIGFyZSBub3QgYWJsZSB0byBoYW5kbGUgbXV0YXRpb24gb2Ygc2NyaXB0IHRhZ3Mgd2l0aCBhIHNyYy1hdHRyaWJ1dGUgLT4gZmFsbGJhY2sgdG8gb3RoZXIgbWV0aG9kXG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0lFTW9iaWxlfFRyaWRlbnR8RWRnZS9pKSkge1xuICAgICAgaXNNdXRhdGlvbkJyb3dzZXIgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBBbmd1bGFyIHBvc3Rwb25lIGluaXRpYWxpemF0aW9uIG9mIGFwcFxuICBpZiAoZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XG4gICAgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5oYXNBdHRyaWJ1dGUoJ25nLWFwcCcpKSB7XG4gICAgICBjb29raWVDb25zZW50Lm11dGF0aW9uQXBwTmFtZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25nLWFwcCcpO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnbmctYXBwJyk7XG4gICAgfVxuXG4gICAgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hdHRyaWJ1dGVzKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hdHRyaWJ1dGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IGF0dHJOYW1lID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmF0dHJpYnV0ZXNbal0ubmFtZTtcbiAgICAgICAgbGV0IGF0dHJWYWx1ZSA9ICcnO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmF0dHJpYnV0ZXNbal0udmFsdWUpIHtcbiAgICAgICAgICBhdHRyVmFsdWUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXR0cmlidXRlc1tqXS52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb29raWVDb25zZW50Lm11dGF0aW9uRmFsbGJhY2tEb2NBdHRyaWJ1dGVzLnB1c2goeyBuYW1lOiBhdHRyTmFtZSwgdmFsdWU6IGF0dHJWYWx1ZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoaXNNdXRhdGlvbkJyb3dzZXIpIHtcbiAgICBjb29raWVDb25zZW50Lm11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjb29raWVDb25zZW50Lm11dGF0aW9uSGFuZGxlcik7XG4gICAgY29va2llQ29uc2VudC5tdXRhdGlvbk9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcbiAgICAvLyBvbmx5IGRvd25sb2FkIGNvbmZpZ3VyYXRpb24gZmlsZSBmcm9tIENETiB3aGVuIG5lZWRlZCwgcmlnaHQgbm93IG9ubHkgbmVlZGVkIHdpdGggYXV0by1ibG9ja1xuICAgIGNvb2tpZUNvbnNlbnQuZG93bmxvYWRDb25maWd1cmF0aW9uKCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gdXNlIGxlc3MgZWZmaWNpZW50IGZhbGxiYWNrIG1ldGhvZCBmb3Igb2xkIGJyb3dzZXJzXG4gICAgaWYgKCF3aW5kb3cuY29va2llY29uc2VudHNjcmlwdGZhbGxiYWNrcHJlbG9hZGVkKSB7XG4gICAgICB3aW5kb3cuY29va2llY29uc2VudHNjcmlwdGZhbGxiYWNrcHJlbG9hZGVkID0gdHJ1ZTsgLy8gcHJldmVudCBwZXJmb3JtaW5nIHR3aWNlLCB3aGVuIHNjcmlwdCB0YWcgaXMgaW5zZXJ0ZWQgb24gc2Vjb25kIHJ1blxuXG4gICAgICBjb29raWVDb25zZW50LmRvd25sb2FkQ29uZmlndXJhdGlvbigpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB3aW5kb3cgLSBHbG9iYWwgd2luZG93IG9iamVjdFxuICogQHBhcmFtIGNvb2tpZUNvbnNlbnQgLSBDb29raWVDb25zZW50IC8gQ29va2llYm90IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RvcE11dGF0aW9uT2JzZXJ2ZXIod2luZG93OiBXaW5kb3csIGNvb2tpZUNvbnNlbnQ6IElDb29raWVDb25zZW50KTogdm9pZCB7XG4gIGlmIChjb29raWVDb25zZW50Lm11dGF0aW9uT2JzZXJ2ZXIgIT0gbnVsbCkge1xuICAgIHdpbmRvdy5Db29raWVDb25zZW50LnByb2Nlc3NQb3N0UG9uZWRNdXRhdGlvbnMoKTtcbiAgICB3aW5kb3cuQ29va2llQ29uc2VudC5kZXF1ZXVlTm9uQXN5bmNTY3JpcHRzKGNvb2tpZUNvbnNlbnQubm9uQXN5bmNNdXRhdGlvbnMpO1xuXG4gICAgY29va2llQ29uc2VudC5tdXRhdGlvbk9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICBjb29raWVDb25zZW50Lm11dGF0aW9uT2JzZXJ2ZXIgPSBudWxsO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHdpbmRvdyAtIEdsb2JhbCB3aW5kb3cgb2JqZWN0XG4gKiBAcGFyYW0gZG9jdW1lbnQgLSBHbG9iYWwgZG9jdW1lbnQgZWxlbWVudFxuICogQHBhcmFtIG11dGF0aW9uc0xpc3QgLSBMaXN0IG9mIG11dGF0aW9uIGVsZW1lbnRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtdXRhdGlvbkhhbmRsZXIod2luZG93OiBXaW5kb3csIGRvY3VtZW50OiBEb2N1bWVudCwgbXV0YXRpb25zTGlzdDogTXV0YXRpb25SZWNvcmRbXSk6IHZvaWQge1xuICBpZiAod2luZG93LkNvb2tpZUNvbnNlbnQpIHtcbiAgICBsZXQgZG9Qb3N0UG9uZU11dGF0aW9uID0gdHJ1ZTsgLy8gcG9zdHBvbmUgbXV0YXRpb25zIGR1cmluZyB0aGUgaW5pdGlhbCBsb2FkIG9mIGNvbmZpZ3VyYXRpb24uanNcblxuICAgIGlmICh3aW5kb3cuQ29va2llQ29uc2VudC5jb25maWd1cmF0aW9uLmxvYWRlZCkge1xuICAgICAgZG9Qb3N0UG9uZU11dGF0aW9uID0gZmFsc2U7XG4gICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5wcm9jZXNzUG9zdFBvbmVkTXV0YXRpb25zKCk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBtdXRhdGlvbnNMaXN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCBtdXRhdGlvblJlY29yZCA9IG11dGF0aW9uc0xpc3Rbal07XG4gICAgICBpZiAobXV0YXRpb25SZWNvcmQudHlwZSA9PT0gJ2NoaWxkTGlzdCcpIHsgLy8gYWRkZWQgZWxlbWVudHNcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtdXRhdGlvblJlY29yZC5hZGRlZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3Qgbm9kZSA9IG11dGF0aW9uUmVjb3JkLmFkZGVkTm9kZXNbaV0gYXMgSFRNTEVsZW1lbnQgfCBIVE1MU2NyaXB0RWxlbWVudDtcblxuICAgICAgICAgIGNvbnN0IGlzTm9kZUlnbm9yZWQgPSBpc05vZGVJZ25vcmVkRnJvbUlubGluZUNvbmZpZyh3aW5kb3cuQ29va2llQ29uc2VudCwgbm9kZSk7XG5cbiAgICAgICAgICAvLyBleGVtcHQgdGFncyB0aGF0IGFyZSBhbHJlYWR5IG1hcmtlZCB1cCBmb3IgY29va2llIGNvbnNlbnRcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBub2RlLm5vZGVUeXBlID09PSAxICYmXG4gICAgICAgICAgICAhbm9kZS5oYXNBdHRyaWJ1dGUoJ2RhdGEtY29va2llY29uc2VudCcpICYmXG4gICAgICAgICAgICAodHlwZW9mIG5vZGUuQ0JfaXNDbG9uZSA9PT0gJ3VuZGVmaW5lZCcpICYmXG4gICAgICAgICAgICAodHlwZW9mIG5vZGUuaXNDb29raWVib3REeW5hbWljVGFnID09PSAndW5kZWZpbmVkJykgJiZcbiAgICAgICAgICAgICFpc05vZGVJZ25vcmVkXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBDaGVjayB0aGF0IENvb2tpZWJvdCB0YWcgaXMgdGhlIGZpcnN0IG9uIHBhZ2UgKHdpdGhvdXQgYXR0cmlidXRlIGRhdGEtY29va2llY29uc2VudCkgd2hlbiB1c2luZyBhdXRvLWJsb2NrZXJcbiAgICAgICAgICAgIGlmICgod2luZG93LkNvb2tpZUNvbnNlbnQubXV0YXRpb25IYW5kbGVyRmlyc3RTY3JpcHQgPT0gbnVsbCkgJiYgKG5vZGUudGFnTmFtZSA9PT0gJ1NDUklQVCcpKSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50Lm11dGF0aW9uSGFuZGxlckZpcnN0U2NyaXB0ID0gbm9kZSBhcyBIVE1MU2NyaXB0RWxlbWVudDtcbiAgICAgICAgICAgICAgY29uc3Qgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKTtcbiAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBzY3JpcHRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNjcmlwdCA9IHNjcmlwdHNba107XG4gICAgICAgICAgICAgICAgaWYgKCFjdXJyZW50U2NyaXB0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1jb29raWVjb25zZW50JykpIHtcbiAgICAgICAgICAgICAgICAgIGlmICghd2luZG93LkNvb2tpZUNvbnNlbnQuaXNDb29raWVib3ROb2RlKGN1cnJlbnRTY3JpcHQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignV0FSTklORzogVGhlIENvb2tpZWJvdCBzY3JpcHQgdGFnIG11c3QgYmUgdGhlIGZpcnN0IHRvIGxvYWQgZm9yIGF1dG8tYmxvY2tpbmcgdG8gd29yay4nLCBjdXJyZW50U2NyaXB0KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBub2RlLmNvb2tpZWJvdFRhZ0hhc2ggPSB3aW5kb3cuQ29va2llQ29uc2VudC50YWdIYXNoKG5vZGUpO1xuXG4gICAgICAgICAgICBpZiAoZG9Qb3N0UG9uZU11dGF0aW9uIHx8IChub2RlLnRhZ05hbWUgPT09ICdTQ1JJUFQnKSkgeyAvLyBhbGwgc2NyaXB0IHRhZ3MgbXVzdCBiZSBwb3N0cG9uZWQgdG8gZXhlY3V0ZSBpbiB0aGUgY29ycmVjdCBvcmRlclxuICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5wb3N0cG9uZU11dGF0aW9uKG5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQucHJvY2Vzc011dGF0aW9uKG5vZGUsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IElDb29raWVDb25zZW50IH0gZnJvbSAnQC90eXBlcy9jb25zZW50JztcblxuLyoqXG4gKiBAcGFyYW0gd2luZG93IC0gR2xvYmFsIHdpbmRvdyBvYmplY3RcbiAqIEBwYXJhbSBjb29raWVDb25zZW50IC0gQ29va2llQ29uc2VudCAvIENvb2tpZWJvdCBvYmplY3RcbiAqIEBwYXJhbSB0YWdDb250YWluZXIgLSBMaXN0IG9mIHNjcmlwdHMgdG8gYmUgcnVuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBydW5TY3JpcHRUYWdzICh3aW5kb3c6IFdpbmRvdywgY29va2llQ29uc2VudDogSUNvb2tpZUNvbnNlbnQsIHRhZ0NvbnRhaW5lcjogSFRNTFNjcmlwdEVsZW1lbnRbXSk6IHZvaWQge1xuICBpZiAodGFnQ29udGFpbmVyLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBjdXJyZW50VGFnID0gdGFnQ29udGFpbmVyLnNoaWZ0KCkgYXMgSFRNTFNjcmlwdEVsZW1lbnQ7XG4gICAgY3VycmVudFRhZy5jb29raWVzUHJvY2Vzc2VkID0gdW5kZWZpbmVkOyAvLyByZXNldCBzdGF0dXMgdG8gYWxsb3cgY2hhbmdlIG9mIGNvbnNlbnQgd2l0aG91dCBwYWdlIHJlZnJlc2hcbiAgICBsZXQgdGFnQ29uc2VudExldmVscyA9IFtdIGFzIHN0cmluZ1tdO1xuXG4gICAgaWYgKGN1cnJlbnRUYWcuaGFzQXR0cmlidXRlKCdkYXRhLWNvb2tpZWNvbnNlbnQnKSkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGFnQ29uc2VudExldmVscyA9IGN1cnJlbnRUYWcuZ2V0QXR0cmlidXRlKCdkYXRhLWNvb2tpZWNvbnNlbnQnKS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcsJyk7XG4gICAgfVxuXG4gICAgbGV0IGNhbkV4ZWN1dGUgPSB0cnVlO1xuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCB0YWdDb25zZW50TGV2ZWxzLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCBjb25zZW50UmVxID0gdGFnQ29uc2VudExldmVsc1tqXS5yZXBsYWNlKC9eXFxzKi8sICcnKS5yZXBsYWNlKC9cXHMqJC8sICcnKTtcbiAgICAgIGlmICgoY29uc2VudFJlcSA9PT0gJ3ByZWZlcmVuY2VzJykgJiYgKCF3aW5kb3cuQ29va2llQ29uc2VudC5jb25zZW50LnByZWZlcmVuY2VzKSkge1xuICAgICAgICBjYW5FeGVjdXRlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoKGNvbnNlbnRSZXEgPT09ICdzdGF0aXN0aWNzJykgJiYgKCF3aW5kb3cuQ29va2llQ29uc2VudC5jb25zZW50LnN0YXRpc3RpY3MpKSB7XG4gICAgICAgIGNhbkV4ZWN1dGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICgoY29uc2VudFJlcSA9PT0gJ21hcmtldGluZycpICYmICghd2luZG93LkNvb2tpZUNvbnNlbnQuY29uc2VudC5tYXJrZXRpbmcpKSB7XG4gICAgICAgIGNhbkV4ZWN1dGUgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2FuRXhlY3V0ZSkge1xuICAgICAgY29uc3QgdGFnUGFyZW50ID0gY3VycmVudFRhZy5wYXJlbnROb2RlO1xuICAgICAgY29uc3QgbmV4dEVsZW1lbnQgPSBjdXJyZW50VGFnLm5leHRFbGVtZW50U2libGluZztcbiAgICAgIGNvbnN0IHRhZ0Nsb25lID0gY29va2llQ29uc2VudC5jbG9uZVNjcmlwdFRhZyhjdXJyZW50VGFnKTtcbiAgICAgIGxldCBoYXNTcmMgPSBmYWxzZTtcblxuICAgICAgaWYgKHRhZ0Nsb25lLmhhc0F0dHJpYnV0ZSgnc3JjJykpIHtcbiAgICAgICAgaGFzU3JjID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlyZVRhZ09uTG9hZCA9IChoYXNTcmMgJiYgKCF0YWdDbG9uZS5oYXNBdHRyaWJ1dGUoJ25vbW9kdWxlJykpKTsgLy8gZmFsbGJhY2sgbm9tb2R1bGUgdGFncyBkb24ndCBmaXJlIG9ubG9hZFxuXG4gICAgICBpZiAodGFnQ2xvbmUuaGFzQXR0cmlidXRlKCdhc3luYycpKSB7IC8vIHJlbW92ZSBhc3luYyBvbiBhc3luYyBydW4gdGFncyB0byBtYWtlIENocm9tZSBoYXBweVxuICAgICAgICB0YWdDbG9uZS5yZW1vdmVBdHRyaWJ1dGUoJ2FzeW5jJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgY3VycmVudFRhZy5vcmlnU2NyaXB0VHlwZSAhPT0gJ3VuZGVmaW5lZCcpIHsgLy8gcmVzdG9yZSBlLmcuIFwibW9kdWxlXCIgdHlwZVxuICAgICAgICB0YWdDbG9uZS50eXBlID0gY3VycmVudFRhZy5vcmlnU2NyaXB0VHlwZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpcmVUYWdPbkxvYWQpIHtcbiAgICAgICAgdGFnQ2xvbmUub25sb2FkID0gZnVuY3Rpb24gKCkgeyAvLyBsb2FkIG5leHQgc2NyaXB0IGluIHF1ZXVlIHdoZW4gdGhpcyBvbmUgaGFzIGxvYWRlZFxuICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LlJ1blNjcmlwdFRhZ3ModGFnQ29udGFpbmVyKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGFnQ2xvbmUub25lcnJvciA9IGZ1bmN0aW9uICgpIHsgLy8gY29udGludWUgdG8gbmV4dCBzY3JpcHQgaWYgdGhpcyBvbmUgZmFpbHMsIGUuZy4gaWYgaXQgZG9lbid0IGV4aXN0XG4gICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuUnVuU2NyaXB0VGFncyh0YWdDb250YWluZXIpO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBjb29raWVDb25zZW50LmNsb25lRXZlbnRMaXN0ZW5lcnMoY3VycmVudFRhZywgdGFnQ2xvbmUpO1xuXG4gICAgICBpZiAodGFnUGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgdGFnUGFyZW50LnJlbW92ZUNoaWxkKGN1cnJlbnRUYWcpO1xuICAgICAgICB0YWdQYXJlbnQuaW5zZXJ0QmVmb3JlKHRhZ0Nsb25lLCBuZXh0RWxlbWVudCB8fCBudWxsKTsgLy8gaW5zZXJ0QmVmb3JlIHdpbGwgaW5zZXJ0IGN1cnJlbnRUYWcgYXQgZW5kIGlmIG5leHRFbGVtZW50IGlzIG51bGxcbiAgICAgIH1cblxuICAgICAgaWYgKCFmaXJlVGFnT25Mb2FkKSB7XG4gICAgICAgIGNvb2tpZUNvbnNlbnQuUnVuU2NyaXB0VGFncyh0YWdDb250YWluZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb29raWVDb25zZW50LlJ1blNjcmlwdFRhZ3ModGFnQ29udGFpbmVyKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qKlxuICogQHBhcmFtIGRvY3VtZW50IC0gR2xvYmFsIGRvY3VtZW50IGVsZW1lbnRcbiAqIEBwYXJhbSBjdXJyZW50VGFnIC0gU2NyaXB0IHRhZyB0byBiZSBjbG9uZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsb25lU2NyaXB0VGFnKGRvY3VtZW50OiBEb2N1bWVudCwgY3VycmVudFRhZzogSFRNTFNjcmlwdEVsZW1lbnQpOiBIVE1MU2NyaXB0RWxlbWVudCB7XG4gIC8vIGNyZWF0ZSBuZXcgZWxlbWVudCB0byBmb3JjZSBGaXJlZm94IHRvIGV4ZWN1dGUgdGhlIHNjcmlwdCAtIHVzZSBpbnRlcm5hbCwgdW5tb2RpZmllZCBjb3B5IG9mIGNyZWF0ZUVsZW1lbnQsIFwiY3JlYXRlRWxlbWVudE9yaWdcIlxuICBjb25zdCB0YWdDbG9uZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnRPcmlnKCdzY3JpcHQnKTtcblxuICBmb3IgKGxldCBrID0gMDsgayA8IGN1cnJlbnRUYWcuYXR0cmlidXRlcy5sZW5ndGg7IGsrKykgeyAvLyBjbG9uZSBhdHRyaWJ1dGVzIGluIG5ldyBlbGVtZW50XG4gICAgdGFnQ2xvbmUuc2V0QXR0cmlidXRlKGN1cnJlbnRUYWcuYXR0cmlidXRlc1trXS5uYW1lLCBjdXJyZW50VGFnLmF0dHJpYnV0ZXNba10udmFsdWUpO1xuICB9XG5cbiAgaWYgKGN1cnJlbnRUYWcuaGFzQXR0cmlidXRlKCdub21vZHVsZScpKSB7IC8vIGF0dHJpYnV0ZSBcIm5vbW9kdWxlJyBpcyBub3QgY29waWVkIG91dCBpbiBhYm92ZSBsb29wXG4gICAgdGFnQ2xvbmUuc2V0QXR0cmlidXRlKCdub21vZHVsZScsICcnKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgY3VycmVudFRhZy50ZXh0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHRhZ0Nsb25lLnRleHQgPSBjdXJyZW50VGFnLnRleHQ7IC8vIGFsbCBicm93c2VyIGlubmVySFRNTFxuICB9XG4gIHRhZ0Nsb25lLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2phdmFzY3JpcHQnKTtcblxuICByZXR1cm4gdGFnQ2xvbmU7XG59XG4iLCJpbXBvcnQgeyBJQ29va2llQ29uc2VudCB9IGZyb20gJ0AvdHlwZXMvY29uc2VudCc7XG5cbi8qKlxuICogQHBhcmFtIGNvb2tpZUNvbnNlbnQgLSBDb29raWVDb25zZW50IC8gQ29va2llYm90IG9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gb3ZlcnJpZGVFdmVudExpc3RlbmVycyhjb29raWVDb25zZW50OiBJQ29va2llQ29uc2VudCk6IHZvaWQge1xuICBjb29raWVDb25zZW50Lm11dGF0ZUV2ZW50TGlzdGVuZXJzID0gdHJ1ZTtcbiAgaWYgKHR5cGVvZiBFdmVudFRhcmdldCAhPT0gJ3VuZGVmaW5lZCcpIHsgLy8gTm90IHN1cHBvcnRlZCBpbiBJRTExXG4gICAgaWYgKHR5cGVvZiBFdmVudFRhcmdldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lckJhc2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBFdmVudFRhcmdldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lckJhc2UgPSBFdmVudFRhcmdldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcblxuICAgICAgRXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAodHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKGNvb2tpZUNvbnNlbnQubXV0YXRlRXZlbnRMaXN0ZW5lcnMgJiYgIWNvb2tpZUNvbnNlbnQuaXNJbnRlcm5hbEV2ZW50TGlzdGVuZXIodHlwZSwgdGhpcywgY2FsbGJhY2spKSB7IC8vIGRvbid0IHJlZ2lzdGVyIG93biBldmVudHMgb24gc2NyaXB0IHRhZ3NcbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ0RPTUNvbnRlbnRMb2FkZWQnIHx8IHR5cGUgPT09ICdsb2FkJyB8fCB0eXBlID09PSAnb25sb2FkJyB8fCB0eXBlID09PSAncmVhZHlzdGF0ZWNoYW5nZScpIHsgLy8gcG9zdHBvbmUgb25sb2FkIGV2ZW50c1xuICAgICAgICAgICAgY29va2llQ29uc2VudC5tdXRhdGlvbk9ubG9hZEV2ZW50TGlzdGVuZXJzLnB1c2goeyB0YXJnZXQ6IHRoaXMsIHR5cGUsIGxpc3RlbmVyOiBjYWxsYmFjaywgb3B0aW9ucyB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29va2llQ29uc2VudC5tdXRhdGlvbkV2ZW50TGlzdGVuZXJzLnB1c2goeyB0YXJnZXQ6IHRoaXMsIHR5cGUsIGxpc3RlbmVyOiBjYWxsYmFjaywgb3B0aW9ucyB9KTtcbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lckJhc2UodHlwZSwgY2FsbGJhY2ssIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJCYXNlKHR5cGUsIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IElDb29raWVDb25zZW50IH0gZnJvbSAnQC90eXBlcy9jb25zZW50JztcblxuLyoqXG4gKiBAcGFyYW0gd2luZG93IC0gR2xvYmFsIHdpbmRvdyBvYmplY3RcbiAqIEBwYXJhbSBjb29raWVDb25zZW50IC0gQ29va2llQ29uc2VudCAvIENvb2tpZWJvdCBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0b3BPdmVycmlkZUV2ZW50TGlzdGVuZXJzKHdpbmRvdzogV2luZG93LCBjb29raWVDb25zZW50OiBJQ29va2llQ29uc2VudCk6IHZvaWQge1xuICBpZiAoY29va2llQ29uc2VudC5tdXRhdGVFdmVudExpc3RlbmVycykge1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyAvLyBjYWxsIGFzeW5jIHRvIGZpbmlzaCBwcm9jZXNzaW5nIG90aGVyIHNjcmlwdHMgZmlyc3RcbiAgICAgIGNvb2tpZUNvbnNlbnQubXV0YXRlRXZlbnRMaXN0ZW5lcnMgPSBmYWxzZTtcbiAgICAgIGNvb2tpZUNvbnNlbnQuYXBwbHlPdmVycmlkZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICBpZiAoY29va2llQ29uc2VudC5tdXRhdGlvbkFwcE5hbWUgIT09ICcnICYmIHdpbmRvdy5hbmd1bGFyICYmIHdpbmRvdy5hbmd1bGFyLmJvb3RzdHJhcCkge1xuICAgICAgICB3aW5kb3cuYW5ndWxhci5ib290c3RyYXAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBbY29va2llQ29uc2VudC5tdXRhdGlvbkFwcE5hbWVdKTtcbiAgICAgIH1cbiAgICB9LCAxKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSUNvb2tpZUNvbnNlbnQgfSBmcm9tICdAL3R5cGVzL2NvbnNlbnQnO1xuXG4vKipcbiAqIEBwYXJhbSBjb29raWVDb25zZW50IC0gQ29va2llQ29uc2VudCAvIENvb2tpZWJvdCBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NQb3N0UG9uZWRNdXRhdGlvbnMoY29va2llQ29uc2VudDogSUNvb2tpZUNvbnNlbnQpOiB2b2lkIHtcbiAgaWYgKGNvb2tpZUNvbnNlbnQucG9zdFBvbmVkTXV0YXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvb2tpZUNvbnNlbnQucG9zdFBvbmVkTXV0YXRpb25zLmxlbmd0aDsgaisrKSB7XG4gICAgICBjb25zdCBwb3N0UG9uZWROb2RlID0gY29va2llQ29uc2VudC5wb3N0UG9uZWRNdXRhdGlvbnNbal07XG4gICAgICBjb29raWVDb25zZW50LnByb2Nlc3NNdXRhdGlvbihwb3N0UG9uZWROb2RlLCB0cnVlKTtcbiAgICB9XG4gICAgY29va2llQ29uc2VudC5wb3N0UG9uZWRNdXRhdGlvbnMgPSBbXTsgLy8gZW1wdHkgYXJyYXlcbiAgfVxufVxuIiwiaW1wb3J0IHsgSUNvb2tpZUNvbnNlbnQgfSBmcm9tICdAL3R5cGVzL2NvbnNlbnQnO1xuXG4vKipcbiAqIEBwYXJhbSBjb29raWVDb25zZW50IC0gQ29va2llQ29uc2VudCAvIENvb2tpZWJvdCBvYmplY3RcbiAqIEBwYXJhbSBtdXRhdGlvbk5vZGVzIC0gVGhlIG5vZGVzIHRvIGJlIGRlcXVldWVkXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZXF1ZXVlTm9uQXN5bmNTY3JpcHRzKGNvb2tpZUNvbnNlbnQ6IElDb29raWVDb25zZW50LCBtdXRhdGlvbk5vZGVzOiBIVE1MU2NyaXB0RWxlbWVudFtdKTogdm9pZCB7XG4gIGlmIChtdXRhdGlvbk5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBub2RlID0gbXV0YXRpb25Ob2Rlcy5zaGlmdCgpOyAvLyB0YWtlIGZpcnN0IG5vZGUgaW4gYXJyYXlcbiAgICBpZiAoKG5vZGU/LnRhZ05hbWUgPT09ICdTQ1JJUFQnKSAmJiAodHlwZW9mIG5vZGUuY29va2llU2NyaXB0UHJvY2Vzc2VkID09PSAndW5kZWZpbmVkJykpIHtcbiAgICAgIG5vZGUuY29va2llU2NyaXB0UHJvY2Vzc2VkID0gMTtcbiAgICAgIGNvb2tpZUNvbnNlbnQuc3RhcnRKUXVlcnlIb2xkKCk7XG4gICAgICBsZXQgdGFnVVJMID0gJyc7XG4gICAgICBsZXQgdGFnQ2F0ZWdvcmllcyA9ICcnO1xuICAgICAgbGV0IGhhc1NyYyA9IGZhbHNlO1xuXG4gICAgICBpZiAobm9kZS5oYXNBdHRyaWJ1dGUoJ3NyYycpKSB7XG4gICAgICAgIHRhZ1VSTCA9IG5vZGUuZ2V0QXR0cmlidXRlKCdzcmMnKSB8fCAnJztcbiAgICAgICAgaGFzU3JjID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBub2RlLm9yaWdPdXRlckhUTUwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRhZ0NhdGVnb3JpZXMgPSBjb29raWVDb25zZW50LmdldFRhZ0Nvb2tpZUNhdGVnb3JpZXMobm9kZS5vcmlnT3V0ZXJIVE1MLCB0YWdVUkwsIG5vZGUsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICAvLyB0ZW1wIGZpeCBmb3IganF1ZXJ5XG4gICAgICBpZiAoaGFzU3JjICYmICh0YWdDYXRlZ29yaWVzICE9PSAnJykgJiYgKHRhZ1VSTC50b0xvY2FsZUxvd2VyQ2FzZSgpLmluZGV4T2YoJ2pxdWVyeScpID49IDApKSB7XG4gICAgICAgIHRhZ0NhdGVnb3JpZXMgPSAnJztcbiAgICAgIH1cblxuICAgICAgaWYgKHRhZ0NhdGVnb3JpZXMgIT09ICcnKSB7XG4gICAgICAgIG5vZGUudHlwZSA9ICd0ZXh0L3BsYWluJztcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY29va2llY29uc2VudCcsIHRhZ0NhdGVnb3JpZXMpO1xuXG4gICAgICAgIGNvb2tpZUNvbnNlbnQuZGVxdWV1ZU5vbkFzeW5jU2NyaXB0cyhtdXRhdGlvbk5vZGVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICd0ZXh0L3BsYWluJykge1xuICAgICAgICAgIC8vIHJlLWFjdGl2YXRlIG5vZGUgdGhhdCBkb2VzIG5vdCBzZXQgY29va2llcyAtIG11c3QgYmUgZG9uZSB3aXRoIGEgY2xvbmUgdG8gZm9yY2UgRmlyZWZveCB0byBleGVjdXRlIHRoZSBzY3JpcHRcbiAgICAgICAgICBjb25zdCB0YWdQYXJlbnQgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgY29uc3QgdGFnQ2xvbmUgPSBjb29raWVDb25zZW50LmNsb25lU2NyaXB0VGFnKG5vZGUpO1xuICAgICAgICAgIGNvb2tpZUNvbnNlbnQuY2xvbmVFdmVudExpc3RlbmVycyhub2RlLCB0YWdDbG9uZSk7XG4gICAgICAgICAgdGFnQ2xvbmUuY29uc2VudFByb2Nlc3NlZCA9ICcxJztcbiAgICAgICAgICB0YWdDbG9uZS5DQl9pc0Nsb25lID0gMTtcblxuICAgICAgICAgIC8vIGZhbGxiYWNrIG5vbW9kdWxlIHRhZ3MgZG9uJ3QgZmlyZSBvbmxvYWRcbiAgICAgICAgICBjb25zdCBmaXJlVGFnT25Mb2FkID0gKFxuICAgICAgICAgICAgaGFzU3JjICYmXG4gICAgICAgICAgICAhdGFnQ2xvbmUuaGFzQXR0cmlidXRlKCdkYXRhLWNvb2tpZWNvbnNlbnQnKSAmJlxuICAgICAgICAgICAgIXRhZ0Nsb25lLmhhc0F0dHJpYnV0ZSgnbm9tb2R1bGUnKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAoZmlyZVRhZ09uTG9hZCkge1xuICAgICAgICAgICAgdGFnQ2xvbmUub25sb2FkID0gZnVuY3Rpb24gKCkgeyAvLyBsb2FkIG5leHQgc2NyaXB0IGluIHF1ZXVlIHdoZW4gdGhpcyBvbmUgaGFzIGxvYWRlZFxuICAgICAgICAgICAgICBjb29raWVDb25zZW50LmRlcXVldWVOb25Bc3luY1NjcmlwdHMobXV0YXRpb25Ob2Rlcyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGFnQ2xvbmUub25lcnJvciA9IGZ1bmN0aW9uICgpIHsgLy8gY29udGludWUgdG8gbmV4dCBzY3JpcHQgaWYgdGhpcyBvbmUgZmFpbHMsIGUuZy4gaWYgaXQgZG9lc24ndCBleGlzdFxuICAgICAgICAgICAgICBjb29raWVDb25zZW50LmRlcXVldWVOb25Bc3luY1NjcmlwdHMobXV0YXRpb25Ob2Rlcyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRhZ0Nsb25lLm9yaWdPdXRlckhUTUwgPSBub2RlLm9yaWdPdXRlckhUTUw7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIG5vZGUub3JpZ1NjcmlwdFR5cGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0YWdDbG9uZS50eXBlID0gbm9kZS5vcmlnU2NyaXB0VHlwZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0cnkgeyAvLyBkb24ndCBoYWx0IGV4ZWN1dGlvbiBvbiBlcnJvclxuICAgICAgICAgICAgaWYgKHRhZ1BhcmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHRhZ1BhcmVudC5pbnNlcnRCZWZvcmUodGFnQ2xvbmUsIG5vZGUpO1xuICAgICAgICAgICAgICB0YWdQYXJlbnQucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZSkgeyB9XG5cbiAgICAgICAgICBpZiAoIWZpcmVUYWdPbkxvYWQpIHtcbiAgICAgICAgICAgIGNvb2tpZUNvbnNlbnQuZGVxdWV1ZU5vbkFzeW5jU2NyaXB0cyhtdXRhdGlvbk5vZGVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29va2llQ29uc2VudC5kZXF1ZXVlTm9uQXN5bmNTY3JpcHRzKG11dGF0aW9uTm9kZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvb2tpZUNvbnNlbnQuZGVxdWV1ZU5vbkFzeW5jU2NyaXB0cyhtdXRhdGlvbk5vZGVzKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gZmluaXNoIG9mXG4gICAgaWYgKGNvb2tpZUNvbnNlbnQuZGVmZXJNdXRhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgY29va2llQ29uc2VudC5kZXF1ZXVlTm9uQXN5bmNTY3JpcHRzKGNvb2tpZUNvbnNlbnQuZGVmZXJNdXRhdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb29raWVDb25zZW50LnJ1blNjcmlwdHMoKTtcblxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvb2tpZUNvbnNlbnQuc3RvcE92ZXJyaWRlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgY29va2llQ29uc2VudC5lbmRKUXVlcnlIb2xkKCk7XG4gICAgICB9LCAxMDAwKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IElDb29raWVDb25zZW50IH0gZnJvbSAnQC90eXBlcy9jb25zZW50JztcblxuLyoqXG4gKiBAcGFyYW0gY29va2llQ29uc2VudCAtIENvb2tpZUNvbnNlbnQgLyBDb29raWVib3Qgb2JqZWN0XG4gKiBAcGFyYW0gbm9kZSAtIGVsZW1lbnQgdG8gcHJvY2Vzc1xuICogQHBhcmFtIGlzUG9zdFBvbmVkIC0gYm9vbGVhbiB0byBkZXRlcm1pbmUgd2hldGhlciBvciBub3QgdGhlIGVsZW1lbnQgd2FzIHBvc3Rwb25lZFxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc011dGF0aW9uKGNvb2tpZUNvbnNlbnQ6IElDb29raWVDb25zZW50LCBub2RlOiBIVE1MRWxlbWVudCB8IEhUTUxTY3JpcHRFbGVtZW50LCBpc1Bvc3RQb25lZDogQm9vbGVhbik6IHZvaWQge1xuICBsZXQgY2FuUHJvY2VzcyA9IHRydWU7XG4gIGlmICghaXNQb3N0UG9uZWQgJiYgY29va2llQ29uc2VudC5pc0Nvb2tpZWJvdE5vZGUobm9kZSkpIHtcbiAgICBjYW5Qcm9jZXNzID0gZmFsc2U7XG4gIH1cblxuICAvLyBtYWtlIHN1cmUgdGhhdCBub2RlcyBhcmUgbm90IHJlLXByb2Nlc3NlZCB3aGVuIGluc2VydGVkIHRvIHRoZSBET00gdmlhIHBsYWNlaG9sZGVyc1xuICBpZiAobm9kZS5jb25zZW50UHJvY2Vzc2VkICYmIG5vZGUuY29uc2VudFByb2Nlc3NlZCA9PT0gJzEnKSB7XG4gICAgY2FuUHJvY2VzcyA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIG5vZGUuY29uc2VudFByb2Nlc3NlZCA9ICcxJztcbiAgfVxuXG4gIGlmIChjYW5Qcm9jZXNzKSB7XG4gICAgbGV0IHRhZ0NhdGVnb3JpZXMgPSAnJztcbiAgICBsZXQgdGFnVVJMID0gJyc7XG4gICAgbGV0IGhhc1NyYyA9IGZhbHNlO1xuXG4gICAgaWYgKG5vZGUudGFnTmFtZSA9PT0gJ1NDUklQVCcpIHtcbiAgICAgIGNvbnN0IHNjcmlwdE5vZGUgPSBub2RlIGFzIEhUTUxTY3JpcHRFbGVtZW50OyAvLyBkZWZpbmUgbmV3IHZhcmlhYmxlIGZvciBUeXBlU2NyaXB0IHB1cnBvc2VzXG5cbiAgICAgIGlmIChzY3JpcHROb2RlLmhhc0F0dHJpYnV0ZSgnc3JjJykpIHtcbiAgICAgICAgdGFnVVJMID0gKHNjcmlwdE5vZGUuZ2V0QXR0cmlidXRlKCdzcmMnKSBhcyBzdHJpbmcpO1xuICAgICAgICBoYXNTcmMgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNQb3N0UG9uZWQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzY3JpcHROb2RlLm9yaWdPdXRlckhUTUwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgdGFnQ2F0ZWdvcmllcyA9IGNvb2tpZUNvbnNlbnQuZ2V0VGFnQ29va2llQ2F0ZWdvcmllcyhzY3JpcHROb2RlLm9yaWdPdXRlckhUTUwsIHRhZ1VSTCwgbm9kZSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhZ0NhdGVnb3JpZXMgPSBjb29raWVDb25zZW50LmdldFRhZ0Nvb2tpZUNhdGVnb3JpZXMoc2NyaXB0Tm9kZS5vdXRlckhUTUwsIHRhZ1VSTCwgbm9kZSwgdHJ1ZSk7XG4gICAgICAgIGlmIChzY3JpcHROb2RlLnR5cGUgIT0gbnVsbCAmJiB0eXBlb2Ygc2NyaXB0Tm9kZS50eXBlICE9PSAndW5kZWZpbmVkJyAmJiBzY3JpcHROb2RlLnR5cGUgIT09ICcnICYmIHNjcmlwdE5vZGUudHlwZSAhPT0gJ3RleHQvcGxhaW4nKSB7XG4gICAgICAgICAgc2NyaXB0Tm9kZS5vcmlnU2NyaXB0VHlwZSA9IHNjcmlwdE5vZGUudHlwZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyB0ZW1wIGZpeCBmb3IganF1ZXJ5XG4gICAgICBpZiAoaGFzU3JjICYmICh0YWdDYXRlZ29yaWVzICE9PSAnJykgJiYgKHRhZ1VSTC50b0xvY2FsZUxvd2VyQ2FzZSgpLmluZGV4T2YoJ2pxdWVyeScpID49IDApKSB7XG4gICAgICAgIHRhZ0NhdGVnb3JpZXMgPSAnJztcbiAgICAgIH1cblxuICAgICAgaWYgKHRhZ0NhdGVnb3JpZXMgIT09ICcnKSB7XG4gICAgICAgIHNjcmlwdE5vZGUudHlwZSA9ICd0ZXh0L3BsYWluJztcbiAgICAgICAgc2NyaXB0Tm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY29va2llY29uc2VudCcsIHRhZ0NhdGVnb3JpZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGlzUG9zdFBvbmVkICYmIHNjcmlwdE5vZGUudHlwZSA9PT0gJ3RleHQvcGxhaW4nKSB7XG4gICAgICAgICAgLy8gcmUtYWN0aXZhdGUgbm9kZSB0aGF0IGRvZXMgbm90IHNldCBjb29raWVzIC0gbXVzdCBiZSBkb25lIHdpdGggYSBjbG9uZSB0byBmb3JjZSBGaXJlZm94IHRvIGV4ZWN1dGUgdGhlIHNjcmlwdFxuICAgICAgICAgIGNvbnN0IHRhZ1BhcmVudCA9IHNjcmlwdE5vZGUucGFyZW50Tm9kZTtcbiAgICAgICAgICBjb25zdCB0YWdDbG9uZSA9IGNvb2tpZUNvbnNlbnQuY2xvbmVTY3JpcHRUYWcoc2NyaXB0Tm9kZSk7XG4gICAgICAgICAgY29va2llQ29uc2VudC5jbG9uZUV2ZW50TGlzdGVuZXJzKG5vZGUsIHRhZ0Nsb25lKTtcbiAgICAgICAgICB0YWdDbG9uZS5jb25zZW50UHJvY2Vzc2VkID0gJzEnO1xuICAgICAgICAgIHRhZ0Nsb25lLkNCX2lzQ2xvbmUgPSAxO1xuICAgICAgICAgIGlmIChpc1Bvc3RQb25lZCkge1xuICAgICAgICAgICAgdGFnQ2xvbmUub3JpZ091dGVySFRNTCA9IHNjcmlwdE5vZGUub3JpZ091dGVySFRNTDtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2NyaXB0Tm9kZS5vcmlnU2NyaXB0VHlwZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgdGFnQ2xvbmUudHlwZSA9IHNjcmlwdE5vZGUub3JpZ1NjcmlwdFR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHRhZ1BhcmVudCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0YWdQYXJlbnQuaW5zZXJ0QmVmb3JlKHRhZ0Nsb25lLCBub2RlKTtcbiAgICAgICAgICAgIHRhZ1BhcmVudC5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgKG5vZGUudGFnTmFtZSA9PT0gJ0lGUkFNRScpIHx8XG4gICAgICAobm9kZS50YWdOYW1lID09PSAnSU1HJykgfHxcbiAgICAgIChub2RlLnRhZ05hbWUgPT09ICdFTUJFRCcpIHx8XG4gICAgICAobm9kZS50YWdOYW1lID09PSAnVklERU8nKSB8fFxuICAgICAgKG5vZGUudGFnTmFtZSA9PT0gJ0FVRElPJykgfHxcbiAgICAgIChub2RlLnRhZ05hbWUgPT09ICdQSUNUVVJFJykgfHxcbiAgICAgIChub2RlLnRhZ05hbWUgPT09ICdTT1VSQ0UnKVxuICAgICkge1xuICAgICAgaWYgKCFpc1Bvc3RQb25lZCkge1xuICAgICAgICBpZiAobm9kZS5oYXNBdHRyaWJ1dGUoJ3NyYycpICYmICFjb29raWVDb25zZW50LmlzQ29va2llYm90Tm9kZShub2RlKSAmJiAhbm9kZS5oYXNBdHRyaWJ1dGUoJ2RhdGEtbGF6eS10eXBlJykpIHtcbiAgICAgICAgICBub2RlLm9yaWdPdXRlckhUTUwgPSBub2RlLm91dGVySFRNTDtcbiAgICAgICAgICBjb25zdCBub2RlU3JjID0gKG5vZGUuZ2V0QXR0cmlidXRlKCdzcmMnKSBhcyBzdHJpbmcpO1xuICAgICAgICAgIC8vIElnbm9yZSBmcmFtZXMgd2l0aG91dCBhIHVybCBzb3VyY2UgLS0gRXg6IEdUTSBQcmV2aWV3XG4gICAgICAgICAgaWYgKG5vZGUudGFnTmFtZSA9PT0gJ0lGUkFNRScgJiYgbm9kZVNyYyAhPT0gJ2Fib3V0OmJsYW5rJyAmJiBub2RlU3JjICE9PSAnJykge1xuICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY29va2llYmxvY2stc3JjJywgbm9kZVNyYyk7XG4gICAgICAgICAgICBub2RlLnJlbW92ZUF0dHJpYnV0ZSgnc3JjJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICgobm9kZS50YWdOYW1lID09PSAnSU1HJykgJiYgKG5vZGUuaGFzQXR0cmlidXRlKCdkYXRhLWltYWdlX3NyYycpKSkgeyAvLyBmb3JjZSBsYXp5IGxvYWRpbmcgaW1hZ2UsIGUuZy4gb24gaHR0cHM6Ly93d3cubWlyYWxpeC5kay9cbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIChub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1pbWFnZV9zcmMnKSBhcyBzdHJpbmcpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGUuaGFzQXR0cmlidXRlKCdkYXRhLWNvb2tpZWJsb2NrLXNyYycpICYmICFub2RlLmhhc0F0dHJpYnV0ZSgnc3JjJykgJiYgIW5vZGUuaGFzQXR0cmlidXRlKCdkYXRhLWxhenktdHlwZScpICYmICFub2RlLmhhc0F0dHJpYnV0ZSgnZGF0YS1pbWFnZV9zcmMnKSkge1xuICAgICAgICB0YWdVUkwgPSBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1jb29raWVibG9jay1zcmMnKSBhcyBzdHJpbmc7XG5cbiAgICAgICAgdGFnQ2F0ZWdvcmllcyA9IGNvb2tpZUNvbnNlbnQuZ2V0VGFnQ29va2llQ2F0ZWdvcmllcyhub2RlLm9yaWdPdXRlckhUTUwsIHRhZ1VSTCwgbm9kZSwgdHJ1ZSk7XG5cbiAgICAgICAgaWYgKHRhZ0NhdGVnb3JpZXMgIT09ICcnKSB7XG4gICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY29va2llY29uc2VudCcsIHRhZ0NhdGVnb3JpZXMpO1xuXG4gICAgICAgICAgLy8gaW5zZXJ0IGNsb25lIHRvIHByZXZlbnQgc3JjIGZyb20gbG9hZGluZyBpbiBGaXJlZm94XG4gICAgICAgICAgY29uc3QgY2xvbmUgPSBub2RlLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICBjb29raWVDb25zZW50LmNsb25lRXZlbnRMaXN0ZW5lcnMobm9kZSwgY2xvbmUpO1xuICAgICAgICAgIGNsb25lLmNvb2tpZWJvdFRhZ0hhc2ggPSBub2RlLmNvb2tpZWJvdFRhZ0hhc2g7XG4gICAgICAgICAgY2xvbmUuQ0JfaXNDbG9uZSA9IDE7XG4gICAgICAgICAgY2xvbmUuY29uc2VudFByb2Nlc3NlZCA9ICcxJztcbiAgICAgICAgICBjb25zdCBjbG9uZVBhcmVudE5vZGUgPSBub2RlLnBhcmVudE5vZGUgYXMgUGFyZW50Tm9kZTtcbiAgICAgICAgICBjbG9uZVBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNsb25lLCBub2RlKTtcbiAgICAgICAgICBjbG9uZVBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgICAgKG5vZGUgYXMgSFRNTEVsZW1lbnQgfCBudWxsKSA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gcmUtYWN0aXZhdGUgbm9kZSB0aGF0IGRvZXMgbm90IHNldCBjb29raWVzXG4gICAgICAgICAgaWYgKG5vZGUuaGFzQXR0cmlidXRlKCdkYXRhLWNvb2tpZWJsb2NrLXNyYycpKSB7XG4gICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZSgnc3JjJywgKG5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLWNvb2tpZWJsb2NrLXNyYycpIGFzIHN0cmluZykpO1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtY29va2llYmxvY2stc3JjJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5vZGUuY29uc2VudFByb2Nlc3NlZCA9ICcxJztcblxuICAgICAgICAgIGlmIChub2RlLnRhZ05hbWUgPT09ICdTT1VSQ0UnKSB7IC8vIENocm9tZSBuZWVkcyByZS1pbnNlcnRpb24gb2Ygc291cmNlIHRhZyBjbG9uZSB0byBhY3RpdmF0ZSBzb3VyY2VcbiAgICAgICAgICAgIGNvbnN0IGNsb25lVG9BY3RpdmUgPSBub2RlLmNsb25lTm9kZSh0cnVlKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICAgIGNvb2tpZUNvbnNlbnQuY2xvbmVFdmVudExpc3RlbmVycyhub2RlLCBjbG9uZVRvQWN0aXZlKTtcbiAgICAgICAgICAgIGNsb25lVG9BY3RpdmUuY29va2llYm90VGFnSGFzaCA9IG5vZGUuY29va2llYm90VGFnSGFzaDtcbiAgICAgICAgICAgIGNsb25lVG9BY3RpdmUuQ0JfaXNDbG9uZSA9IDE7XG4gICAgICAgICAgICBjbG9uZVRvQWN0aXZlLmNvbnNlbnRQcm9jZXNzZWQgPSAnMSc7XG4gICAgICAgICAgICBjb25zdCBjbG9uZVBhcmVudE5vZGVUb0FjdGl2YXRlID0gbm9kZS5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgY2xvbmVQYXJlbnROb2RlVG9BY3RpdmF0ZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgICAgIGNsb25lUGFyZW50Tm9kZVRvQWN0aXZhdGUuYXBwZW5kQ2hpbGQoY2xvbmVUb0FjdGl2ZSk7IC8vIHVzZSBhcHBlbmRDaGlsZCBpbnN0ZWFkIG9mIGluc2VydEJlZm9yZSBmb3IgcmUtaW5zZXJ0aW9uIHRvIHdvcmsgaW4gRmlyZWZveFxuICAgICAgICAgICAgKG5vZGUgYXMgSFRNTEVsZW1lbnQgfCBudWxsKSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBJQ29va2llQ29uc2VudCB9IGZyb20gJ0AvdHlwZXMvY29uc2VudCc7XG5cbi8qKlxuICogQHBhcmFtIHdpbmRvdyAtIEdsb2JhbCB3aW5kb3cgb2JqZWN0XG4gKiBAcGFyYW0gY29va2llQ29uc2VudCAtIENvb2tpZUNvbnNlbnQgLyBDb29raWVib3Qgb2JqZWN0XG4gKiBAcGFyYW0gbm9kZUVsZW1lbnQgLSBub2RlIHRvIHBvc3Rwb25lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwb3N0cG9uZU11dGF0aW9uKHdpbmRvdzogV2luZG93LCBjb29raWVDb25zZW50OiBJQ29va2llQ29uc2VudCwgbm9kZUVsZW1lbnQ6IEhUTUxTY3JpcHRFbGVtZW50IHwgSFRNTEVsZW1lbnQgfCBudWxsKTogdm9pZCB7XG4gIGlmIChub2RlRWxlbWVudCAmJiAhY29va2llQ29uc2VudC5pc0Nvb2tpZWJvdE5vZGUobm9kZUVsZW1lbnQpKSB7XG4gICAgY29uc3Qgc2NyaXB0Tm9kZSA9IG5vZGVFbGVtZW50IGFzIEhUTUxTY3JpcHRFbGVtZW50O1xuXG4gICAgLy8gZGlzYWJsZSByb2NrZXQgbG9hZGVyIHNjcmlwdCBibG9ja2luZ1xuICAgIGlmICgobm9kZUVsZW1lbnQudGFnTmFtZSA9PT0gJ1NDUklQVCcpICYmIHR5cGVvZiBzY3JpcHROb2RlLnR5cGUgIT09ICd1bmRlZmluZWQnICYmIHNjcmlwdE5vZGUudHlwZSAhPT0gJ3RleHQvamF2YXNjcmlwdCcgJiYgc2NyaXB0Tm9kZS50eXBlLmluZGV4T2YoJy10ZXh0L2phdmFzY3JpcHQnKSA+IC0xKSB7XG4gICAgICBzY3JpcHROb2RlLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICB9XG5cbiAgICBpZiAoIC8vIGV4Y2x1ZGUgb3RoZXIgdHlwZXMgYXMgZS5nLiBcImFwcGxpY2F0aW9uL2xkK2pzb25cIlxuICAgICAgKHNjcmlwdE5vZGUudGFnTmFtZSA9PT0gJ1NDUklQVCcpICYmXG4gICAgICAoXG4gICAgICAgIChzY3JpcHROb2RlLnR5cGUgPT0gbnVsbCkgfHxcbiAgICAgICAgKHR5cGVvZiBzY3JpcHROb2RlLnR5cGUgPT09ICd1bmRlZmluZWQnKSB8fFxuICAgICAgICAoc2NyaXB0Tm9kZS50eXBlID09PSAnJykgfHxcbiAgICAgICAgKHNjcmlwdE5vZGUudHlwZSA9PT0gJ3RleHQvamF2YXNjcmlwdCcpIHx8XG4gICAgICAgIChzY3JpcHROb2RlLnR5cGUgPT09ICdhcHBsaWNhdGlvbi9qYXZhc2NyaXB0JykgfHxcbiAgICAgICAgKHNjcmlwdE5vZGUudHlwZSA9PT0gJ21vZHVsZScpIHx8XG4gICAgICAgIChzY3JpcHROb2RlLnR5cGUgPT09ICd0ZXh0L3BsYWluJylcbiAgICAgIClcbiAgICApIHtcbiAgICAgIGNvb2tpZUNvbnNlbnQuc3RhcnRKUXVlcnlIb2xkKCk7XG5cbiAgICAgIHNjcmlwdE5vZGUub3JpZ091dGVySFRNTCA9IHNjcmlwdE5vZGUub3V0ZXJIVE1MO1xuICAgICAgaWYgKHNjcmlwdE5vZGUudHlwZSAhPSBudWxsICYmIHR5cGVvZiBzY3JpcHROb2RlLnR5cGUgIT09ICd1bmRlZmluZWQnICYmIHNjcmlwdE5vZGUudHlwZSAhPT0gJycgJiYgc2NyaXB0Tm9kZS50eXBlICE9PSAndGV4dC9wbGFpbicpIHtcbiAgICAgICAgc2NyaXB0Tm9kZS5vcmlnU2NyaXB0VHlwZSA9IHNjcmlwdE5vZGUudHlwZTtcbiAgICAgIH1cbiAgICAgIHNjcmlwdE5vZGUudHlwZSA9ICd0ZXh0L3BsYWluJztcblxuICAgICAgLy8gcHJldmVudCBzY3JpcHRzIGZyb20gYmVpbmcgZXhlY3V0ZWQgaW4gRmlyZWZveFxuICAgICAgY29uc3QgYmVmb3JlU2NyaXB0RXhlY3V0ZUxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAoc2NyaXB0Tm9kZS5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gJ3RleHQvcGxhaW4nKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBzY3JpcHROb2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JlZm9yZXNjcmlwdGV4ZWN1dGUnLCBiZWZvcmVTY3JpcHRFeGVjdXRlTGlzdGVuZXIpO1xuICAgICAgfTtcbiAgICAgIHNjcmlwdE5vZGUuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3Jlc2NyaXB0ZXhlY3V0ZScsIGJlZm9yZVNjcmlwdEV4ZWN1dGVMaXN0ZW5lcik7XG5cbiAgICAgIGlmIChjb29raWVDb25zZW50Lmhhc1Jlc3BvbnNlICYmIHNjcmlwdE5vZGUuaGFzQXR0cmlidXRlKCdzcmMnKSAmJiAhc2NyaXB0Tm9kZS5oYXNBdHRyaWJ1dGUoJ25vbW9kdWxlJykpIHtcbiAgICAgICAgY29va2llQ29uc2VudC5wcmVsb2FkTXV0YXRpb25TY3JpcHQoc2NyaXB0Tm9kZS5zcmMpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2NyaXB0Tm9kZS5oYXNBdHRyaWJ1dGUoJ2RlZmVyJykpIHtcbiAgICAgICAgaWYgKHNjcmlwdE5vZGUuaGFzQXR0cmlidXRlKCdhc3luYycpKSB7IC8vIGFzeW5jIGNvbmZsaWN0cyB3aXRoIGRlZmVyIC0gZGVmZXIgd2luc1xuICAgICAgICAgIHNjcmlwdE5vZGUucmVtb3ZlQXR0cmlidXRlKCdhc3luYycpO1xuICAgICAgICB9XG4gICAgICAgIGNvb2tpZUNvbnNlbnQuZGVmZXJNdXRhdGlvbnMucHVzaChzY3JpcHROb2RlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvb2tpZUNvbnNlbnQubm9uQXN5bmNNdXRhdGlvbnMucHVzaChzY3JpcHROb2RlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgKG5vZGVFbGVtZW50LnRhZ05hbWUgPT09ICdJRlJBTUUnKSB8fFxuICAgICAgKG5vZGVFbGVtZW50LnRhZ05hbWUgPT09ICdJTUcnKSB8fFxuICAgICAgKG5vZGVFbGVtZW50LnRhZ05hbWUgPT09ICdFTUJFRCcpIHx8XG4gICAgICAobm9kZUVsZW1lbnQudGFnTmFtZSA9PT0gJ1ZJREVPJykgfHxcbiAgICAgIChub2RlRWxlbWVudC50YWdOYW1lID09PSAnQVVESU8nKSB8fFxuICAgICAgKG5vZGVFbGVtZW50LnRhZ05hbWUgPT09ICdQSUNUVVJFJykgfHxcbiAgICAgIChub2RlRWxlbWVudC50YWdOYW1lID09PSAnU09VUkNFJylcbiAgICApIHtcbiAgICAgIGxldCBub2RlID0gbm9kZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBpZiAoISgobm9kZS50YWdOYW1lID09PSAnSU1HJykgJiYgbm9kZS5oYXNBdHRyaWJ1dGUoJ3NyYycpICYmIChjb29raWVDb25zZW50LmdldEhvc3RuYW1lRnJvbVVSTChub2RlLnNyYykgPT09IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSkpKSB7IC8vIGRvbid0IGJsb2NrIGZpcnN0IHBhcnR5IGltYWdlc1xuICAgICAgICBpZiAobm9kZS5oYXNBdHRyaWJ1dGUoJ3NyYycpICYmICFub2RlLmhhc0F0dHJpYnV0ZSgnZGF0YS1sYXp5LXR5cGUnKSAmJiAhbm9kZS5oYXNBdHRyaWJ1dGUoJ2RhdGEtaW1hZ2Vfc3JjJykgJiYgIWNvb2tpZUNvbnNlbnQuaXNDb29raWVib3ROb2RlKG5vZGUpKSB7XG4gICAgICAgICAgbm9kZS5vcmlnT3V0ZXJIVE1MID0gbm9kZS5vdXRlckhUTUw7XG4gICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtY29va2llYmxvY2stc3JjJywgbm9kZS5nZXRBdHRyaWJ1dGUoJ3NyYycpIGFzIHN0cmluZyk7XG4gICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ3NyYycpO1xuXG4gICAgICAgICAgLy8gaW5zZXJ0IGNsb25lIHRvIHByZXZlbnQgc3JjIGZyb20gbG9hZGluZ1xuICAgICAgICAgIGNvbnN0IGNsb25lID0gbm9kZS5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgICAgY29va2llQ29uc2VudC5jbG9uZUV2ZW50TGlzdGVuZXJzKG5vZGUsIGNsb25lKTtcbiAgICAgICAgICBjbG9uZS5jb29raWVib3RUYWdIYXNoID0gbm9kZS5jb29raWVib3RUYWdIYXNoO1xuICAgICAgICAgIGNsb25lLkNCX2lzQ2xvbmUgPSAxO1xuICAgICAgICAgIGNvbnN0IGNsb25lUGFyZW50Tm9kZSA9IG5vZGUucGFyZW50Tm9kZSBhcyBQYXJlbnROb2RlO1xuICAgICAgICAgIGNsb25lUGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY2xvbmUsIG5vZGUpO1xuICAgICAgICAgIGNsb25lUGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICAgICAgICAobm9kZSBhcyBIVE1MRWxlbWVudCB8IG51bGwpID0gbnVsbDtcblxuICAgICAgICAgIGNvb2tpZUNvbnNlbnQucG9zdFBvbmVkTXV0YXRpb25zLnB1c2goY2xvbmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChub2RlICE9IG51bGwpICYmIChub2RlLnRhZ05hbWUgPT09ICdJTUcnKSAmJiAobm9kZS5oYXNBdHRyaWJ1dGUoJ2RhdGEtaW1hZ2Vfc3JjJykpKSB7IC8vIGZvcmNlIGxhenkgbG9hZGluZyBpbWFnZSwgZS5nLiBvbiBodHRwczovL3d3dy5taXJhbGl4LmRrL1xuICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKCdzcmMnLCBub2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1pbWFnZV9zcmMnKSBhcyBzdHJpbmcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBJQ29va2llQ29uc2VudCB9IGZyb20gJ0AvdHlwZXMvY29uc2VudCc7XG5cbi8qKlxuICogQHBhcmFtIHdpbmRvdyAtIEdsb2JhbCB3aW5kb3cgb2JqZWN0XG4gKiBAcGFyYW0gY29va2llQ29uc2VudCAtIENvb2tpZUNvbnNlbnQgLyBDb29raWVib3Qgb2JqZWN0XG4gKiBAcGFyYW0gb3V0ZXJodG1sIC0gb3V0ZXJIVE1MIG9mIHRoZSBlbGVtZW50XG4gKiBAcGFyYW0gdGFnVVJMIC0gZWxlbWVudCBzcmNcbiAqIEBwYXJhbSBub2RlIC0gZWxlbWVudCB0byBjaGVja1xuICogQHBhcmFtIG1hdGNoQ29tbW9uIC0gb3B0aW9uIHRvIGFsc28gY2hlY2sgY29tbW9uVHJhY2tlcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRhZ0Nvb2tpZUNhdGVnb3JpZXMod2luZG93OiBXaW5kb3csIGNvb2tpZUNvbnNlbnQ6IElDb29raWVDb25zZW50LCBvdXRlcmh0bWw6IHN0cmluZyB8IHVuZGVmaW5lZCwgdGFnVVJMOiBzdHJpbmcsIG5vZGU6IEhUTUxFbGVtZW50LCBtYXRjaENvbW1vbjogYm9vbGVhbik6IHN0cmluZyB7XG4gIGxldCBjYXRlZ29yaWVzID0gJyc7XG5cbiAgZm9yIChsZXQgaiA9IDA7IGogPCBjb29raWVDb25zZW50LmNvbmZpZ3VyYXRpb24udGFncy5sZW5ndGg7IGorKykge1xuICAgIGNvbnN0IGN1cnJlbnRUYWcgPSBjb29raWVDb25zZW50LmNvbmZpZ3VyYXRpb24udGFnc1tqXTtcblxuICAgIC8vIHRlc3Qgb24gVVJMIHNyY1xuICAgIGlmICgodGFnVVJMICE9PSAnJykgJiYgKGN1cnJlbnRUYWcudXJsKSAmJiAoY3VycmVudFRhZy51cmwgIT09ICcnKSkge1xuICAgICAgaWYgKGN1cnJlbnRUYWcudXJsLnRvTG93ZXJDYXNlKCkgPT09IHRhZ1VSTC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIGNhdGVnb3JpZXMgPSBjb29raWVDb25zZW50LmNvb2tpZUNhdGVnb3JpZXNGcm9tTnVtYmVyQXJyYXkoY3VycmVudFRhZy5jYXQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0ZXN0IG9uIHJlc29sdmVkIFVSTCBzcmNcbiAgICBpZiAoKHRhZ1VSTCAhPT0gJycpICYmIChjdXJyZW50VGFnLnJlc29sdmVkVXJsKSAmJiAoY3VycmVudFRhZy5yZXNvbHZlZFVybCAhPT0gJycpKSB7XG4gICAgICBpZiAoY3VycmVudFRhZy5yZXNvbHZlZFVybC50b0xvd2VyQ2FzZSgpID09PSBjb29raWVDb25zZW50LnJlc29sdmVVUkwodGFnVVJMKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgIGNhdGVnb3JpZXMgPSBjb29raWVDb25zZW50LmNvb2tpZUNhdGVnb3JpZXNGcm9tTnVtYmVyQXJyYXkoY3VycmVudFRhZy5jYXQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0ZXN0IG9uIHRhZyBJRFxuICAgIGlmIChub2RlLmhhc0F0dHJpYnV0ZSgnaWQnKSAmJiAoY3VycmVudFRhZy50YWdJRCkgJiYgKGN1cnJlbnRUYWcudGFnSUQgIT09ICcnKSkge1xuICAgICAgY29uc3QgdGFnSUQgPSAobm9kZS5nZXRBdHRyaWJ1dGUoJ2lkJykgYXMgc3RyaW5nKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKGN1cnJlbnRUYWcudGFnSUQudG9Mb3dlckNhc2UoKSA9PT0gdGFnSUQpIHtcbiAgICAgICAgY2F0ZWdvcmllcyA9IGNvb2tpZUNvbnNlbnQuY29va2llQ2F0ZWdvcmllc0Zyb21OdW1iZXJBcnJheShjdXJyZW50VGFnLmNhdCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHRlc3Qgb24gdGFnIGhhc2hcbiAgICBpZiAoY3VycmVudFRhZy50YWdIYXNoICYmIChjdXJyZW50VGFnLnRhZ0hhc2ggIT09ICcnKSAmJiBub2RlICYmIG5vZGUuY29va2llYm90VGFnSGFzaCAmJiAobm9kZS5jb29raWVib3RUYWdIYXNoICE9PSAnJykpIHtcbiAgICAgIGlmIChjdXJyZW50VGFnLnRhZ0hhc2ggPT09IG5vZGUuY29va2llYm90VGFnSGFzaCkge1xuICAgICAgICBjYXRlZ29yaWVzID0gY29va2llQ29uc2VudC5jb29raWVDYXRlZ29yaWVzRnJvbU51bWJlckFycmF5KGN1cnJlbnRUYWcuY2F0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdGVzdCBvbiB0YWcgaW5uZXJIVE1MIGhhc2hcbiAgICBpZiAoKGN1cnJlbnRUYWcuaW5uZXJIYXNoKSAmJiAoY3VycmVudFRhZy5pbm5lckhhc2ggIT09ICcnKSAmJiBub2RlICYmIG5vZGUuaW5uZXJIVE1MICYmIChub2RlLmlubmVySFRNTCAhPT0gJycpKSB7XG4gICAgICBjb25zdCB0YWdIYXNoSW5uZXIgPSBjb29raWVDb25zZW50Lmhhc2hDb2RlKG5vZGUuaW5uZXJIVE1MKS50b1N0cmluZygpO1xuICAgICAgaWYgKChjdXJyZW50VGFnLmlubmVySGFzaCA9PT0gdGFnSGFzaElubmVyKSAmJiAodGFnSGFzaElubmVyICE9PSAnMCcpKSB7XG4gICAgICAgIGNhdGVnb3JpZXMgPSBjb29raWVDb25zZW50LmNvb2tpZUNhdGVnb3JpZXNGcm9tTnVtYmVyQXJyYXkoY3VycmVudFRhZy5jYXQpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB0ZXN0IG9uIHRhZyBvdXRlckhUTUwgaGFzaFxuICAgIGlmICgoY3VycmVudFRhZy5vdXRlckhhc2gpICYmIChjdXJyZW50VGFnLm91dGVySGFzaCAhPT0gJycpICYmICh0eXBlb2Ygb3V0ZXJodG1sICE9PSAndW5kZWZpbmVkJykgJiYgKG91dGVyaHRtbCAhPT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICBjb25zdCB0YWdIYXNoT3V0ZXIgPSBjb29raWVDb25zZW50Lmhhc2hDb2RlKG91dGVyaHRtbCkudG9TdHJpbmcoKTtcbiAgICAgIGlmICgoY3VycmVudFRhZy5vdXRlckhhc2ggPT09IHRhZ0hhc2hPdXRlcikgJiYgKHRhZ0hhc2hPdXRlciAhPT0gJzAnKSkge1xuICAgICAgICBjYXRlZ29yaWVzID0gY29va2llQ29uc2VudC5jb29raWVDYXRlZ29yaWVzRnJvbU51bWJlckFycmF5KGN1cnJlbnRUYWcuY2F0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gdGVzdCBvbiBkb21haW4gbmFtZVxuICAgIGlmICggLy8gRXhlbXB0IGltYWdlIHRhZ3MgZnJvbSB0aGlzIGRvbWFpbi1pbmhlcml0YW5jZSBjaGVjayBhcyBpdCB3aWxsIGJsb2NrIGltYWdlcyBvbiBDRE4gaWYgY29va2llLXNldHRpbmcgc2NyaXB0cyBhcmUgc2VydmVkIGZyb20gc2FtZSBDRE5cbiAgICAgICh0YWdVUkwgIT09ICcnKSAmJlxuICAgICAgKGN1cnJlbnRUYWcucmVzb2x2ZWRVcmwpICYmXG4gICAgICAoY3VycmVudFRhZy5yZXNvbHZlZFVybCAhPT0gJycpICYmXG4gICAgICAoY29va2llQ29uc2VudC5jb25maWd1cmF0aW9uLnRyYWNraW5nRG9tYWlucy5sZW5ndGggPiAwKSAmJlxuICAgICAgKG5vZGUudGFnTmFtZSAhPT0gJ0lNRycpICYmXG4gICAgICAobm9kZS50YWdOYW1lICE9PSAnUElDVFVSRScpXG4gICAgKSB7XG4gICAgICBjb25zdCB0YWdEb21haW4gPSBjb29raWVDb25zZW50LmdldEhvc3RuYW1lRnJvbVVSTCh0YWdVUkwpO1xuICAgICAgaWYgKCh0YWdEb21haW4gIT09ICcnKSAmJiAodGFnRG9tYWluICE9PSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpKSB7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgY29va2llQ29uc2VudC5jb25maWd1cmF0aW9uLnRyYWNraW5nRG9tYWlucy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRSZWNvcmQgPSBjb29raWVDb25zZW50LmNvbmZpZ3VyYXRpb24udHJhY2tpbmdEb21haW5zW2tdO1xuICAgICAgICAgIGlmICh0YWdEb21haW4gPT09IGN1cnJlbnRSZWNvcmQuZCkge1xuICAgICAgICAgICAgY2F0ZWdvcmllcyA9IGNvb2tpZUNvbnNlbnQuY29va2llQ2F0ZWdvcmllc0Zyb21OdW1iZXJBcnJheShjdXJyZW50UmVjb3JkLmMpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gRmFsbGJhY2sgaWYgc2l0ZSBoYXMgbm90IHlldCBjb21wbGV0ZWQgc2NhbiAtIHRlc3Qgb24gZGVmYXVsdCBkb21haW5zXG4gIGlmIChjb29raWVDb25zZW50LmNvbmZpZ3VyYXRpb24udGFncy5sZW5ndGggPT09IDApIHsgLy8gc2NhbiBub3QgY29tcGxldGVkXG4gICAgaWYgKG1hdGNoQ29tbW9uICYmICh0YWdVUkwgIT09ICcnKSAmJiAoY2F0ZWdvcmllcyA9PT0gJycpKSB7XG4gICAgICAvLyBpc29sYXRlIGRvbWFpbiBuYW1lIGZyb20gdGFnVVJMXG4gICAgICBsZXQgdGFnZG9tYWluID0gdGFnVVJMLnRvTG93ZXJDYXNlKCk7XG4gICAgICBsZXQgaXNBYm9sdXRlVVJMID0gdHJ1ZTtcblxuICAgICAgaWYgKCh0YWdkb21haW4uaW5kZXhPZignaHR0cHM6Ly8nKSA9PT0gMCkgJiYgKHRhZ2RvbWFpbi5sZW5ndGggPiA4KSkge1xuICAgICAgICB0YWdkb21haW4gPSB0YWdkb21haW4uc3Vic3RyKDgpO1xuICAgICAgfSBlbHNlIGlmICgodGFnZG9tYWluLmluZGV4T2YoJ2h0dHA6Ly8nKSA9PT0gMCkgJiYgKHRhZ2RvbWFpbi5sZW5ndGggPiA3KSkge1xuICAgICAgICB0YWdkb21haW4gPSB0YWdkb21haW4uc3Vic3RyKDcpO1xuICAgICAgfSBlbHNlIGlmICgodGFnZG9tYWluLmluZGV4T2YoJy8vJykgPT09IDApICYmICh0YWdkb21haW4ubGVuZ3RoID4gMikpIHtcbiAgICAgICAgdGFnZG9tYWluID0gdGFnZG9tYWluLnN1YnN0cigyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlzQWJvbHV0ZVVSTCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNBYm9sdXRlVVJMKSB7XG4gICAgICAgIGlmICh0YWdkb21haW4uaW5kZXhPZignOicpID4gMCkge1xuICAgICAgICAgIHRhZ2RvbWFpbiA9IHRhZ2RvbWFpbi5zdWJzdHIoMCwgdGFnZG9tYWluLmluZGV4T2YoJzonKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhZ2RvbWFpbi5pbmRleE9mKCcvJykgPiAwKSB7XG4gICAgICAgICAgdGFnZG9tYWluID0gdGFnZG9tYWluLnN1YnN0cigwLCB0YWdkb21haW4uaW5kZXhPZignLycpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YWdkb21haW4ubGVuZ3RoID4gMykge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29va2llQ29uc2VudC5jb21tb25UcmFja2Vycy5kb21haW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXN0RG9tYWluID0gY29va2llQ29uc2VudC5jb21tb25UcmFja2Vycy5kb21haW5zW2ldO1xuICAgICAgICAgICAgaWYgKHRhZ2RvbWFpbi5pbmRleE9mKHRlc3REb21haW4uZCkgPj0gMCkge1xuICAgICAgICAgICAgICBjYXRlZ29yaWVzID0gY29va2llQ29uc2VudC5jb29raWVDYXRlZ29yaWVzRnJvbU51bWJlckFycmF5KHRlc3REb21haW4uYyk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjYXRlZ29yaWVzO1xufVxuIiwiaW1wb3J0IHsgSUNvb2tpZUNvbnNlbnQgfSBmcm9tICdAL3R5cGVzL2NvbnNlbnQnO1xuaW1wb3J0IHsgYXBwbHlOb25jZSB9IGZyb20gJ0AvdXRpbGl0aWVzJztcblxuZnVuY3Rpb24gZ2V0VHdpcGxhTWF4UHJpdmFjeVNjcmlwdCh0d2lwbGFJZDogc3RyaW5nLCBub25jZTogc3RyaW5nIHwgdW5kZWZpbmVkKSB7XG4gIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICBhcHBseU5vbmNlKHNjcmlwdCwgbm9uY2UpO1xuICBzY3JpcHQuaWQgPSAnY29va2llYm90LXZpc2l0b3ItYW5hbHl0aWNzLXNuaXBwZXQnO1xuICBzY3JpcHQuaW5uZXJIVE1MID0gXCIoZnVuY3Rpb24odixpLHMsYSx0KXt2W3RdPXZbdF18fGZ1bmN0aW9uKCl7KHZbdF0udj12W3RdLnZ8fFtdKS5wdXNoKGFyZ3VtZW50cyl9O2lmKCF2Ll92aXNhU2V0dGluZ3Mpe3YuX3Zpc2FTZXR0aW5ncz17fX12Ll92aXNhU2V0dGluZ3NbYV09e3Y6JzEuMCcsczphLGE6JzEnLHQ6dCxmOnRydWV9O3ZhciBiPWkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTt2YXIgcD1pLmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO3AuZGVmZXI9MTtwLmFzeW5jPTE7cC5zcmM9cysnP3M9JythO3AuaWQ9J2Nvb2tpZWJvdC12aXNpdG9yLWFuYWx5dGljcyc7Yi5hcHBlbmRDaGlsZChwKX0pKHdpbmRvdyxkb2N1bWVudCwnLy9wcml2YWN5LWFuYWx5dGljcy1wcm94eS5jb29raWVib3QuY29tL2FuYWx5dGljcy9tYWluLmpzJywnXCIgKyB0d2lwbGFJZCArIFwiJywndmEnKVwiO1xuXG4gIHJldHVybiBzY3JpcHQ7XG59XG5cbmZ1bmN0aW9uIGdldFR3aXBsYVRyYWNraW5nU2NyaXB0KHR3aXBsYUlkOiBzdHJpbmcsIG5vbmNlOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gIGFwcGx5Tm9uY2Uoc2NyaXB0LCBub25jZSk7XG4gIHNjcmlwdC5pZCA9ICdjb29raWVib3QtdmlzaXRvci1hbmFseXRpY3Mtc25pcHBldCc7XG4gIHNjcmlwdC5pbm5lckhUTUwgPSBcIihmdW5jdGlvbih2LGkscyxhLHQpe3ZbdF09dlt0XXx8ZnVuY3Rpb24oKXsodlt0XS52PXZbdF0udnx8W10pLnB1c2goYXJndW1lbnRzKX07aWYoIXYuX3Zpc2FTZXR0aW5ncyl7di5fdmlzYVNldHRpbmdzPXt9fXYuX3Zpc2FTZXR0aW5nc1thXT17djonMS4wJyxzOmEsYTonMScsdDp0fTt2YXIgYj1pLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF07dmFyIHA9aS5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtwLmRlZmVyPTE7cC5hc3luYz0xO3Auc3JjPXMrJz9zPScrYTtwLmlkPSdjb29raWVib3QtdmlzaXRvci1hbmFseXRpY3MnO2IuYXBwZW5kQ2hpbGQocCl9KSh3aW5kb3csZG9jdW1lbnQsJy8vYXBwLXdvcmtlci52aXNpdG9yLWFuYWx5dGljcy5pby9tYWluLmpzJywnXCIgKyB0d2lwbGFJZCArIFwiJywndmEnKVwiO1xuXG4gIHJldHVybiBzY3JpcHQ7XG59XG5cbmV4cG9ydCBjb25zdCBpbmplY3RUd2lwbGEgPSBmdW5jdGlvbihjb29raWVDb25zZW50OiBJQ29va2llQ29uc2VudCk6IHZvaWQge1xuICBpZiAoY29va2llQ29uc2VudC50d2lwbGEgJiYgdHlwZW9mIGNvb2tpZUNvbnNlbnQudHdpcGxhLmRvbWFpbnMgPT09ICdvYmplY3QnKSB7XG4gICAgY29uc3Qgc2FuaXRpemVEb21haW4gPSAoZG9tYWluOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICAgICAgZG9tYWluID0gZG9tYWluLnRyaW0oKS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcvJylbMF07XG4gICAgICByZXR1cm4gZG9tYWluO1xuICAgIH07XG5cbiAgICAvLyBMb29wIHRocm91Z2ggZG9tYWlucyBhbmQgZmluZCB0aGUgbWF0Y2hpbmcgSUQgKGlmIGFueSlcbiAgICBjb25zdCBtYXRjaGluZ0RvbWFpbiA9IE9iamVjdC5rZXlzKGNvb2tpZUNvbnNlbnQudHdpcGxhLmRvbWFpbnMpLmZpbmQoZG9tYWluID0+XG4gICAgICBzYW5pdGl6ZURvbWFpbihkb21haW4pID09PSBzYW5pdGl6ZURvbWFpbih3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpKTtcblxuICAgIGlmIChtYXRjaGluZ0RvbWFpbikge1xuICAgICAgY29va2llQ29uc2VudC5jb21wdXRlZENvbmZpZ3VyYXRpb24uaXNUd2lwbGFEb21haW4gPSB0cnVlO1xuICAgICAgbGV0IHNjcmlwdCA9IG51bGw7XG4gICAgICBsZXQgc2NyaXB0VG9Mb2FkOiAndHJhY2tpbmcnIHwgJ21heFByaXZhY3knO1xuXG4gICAgICBpZiAoY29va2llQ29uc2VudC5jb25zZW50LnN0YXRpc3RpY3MpIHtcbiAgICAgICAgc2NyaXB0ID0gZ2V0VHdpcGxhVHJhY2tpbmdTY3JpcHQoY29va2llQ29uc2VudC50d2lwbGEuZG9tYWluc1ttYXRjaGluZ0RvbWFpbl0sIGNvb2tpZUNvbnNlbnQubm9uY2UpO1xuICAgICAgICBzY3JpcHRUb0xvYWQgPSAndHJhY2tpbmcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NyaXB0ID0gZ2V0VHdpcGxhTWF4UHJpdmFjeVNjcmlwdChjb29raWVDb25zZW50LnR3aXBsYS5kb21haW5zW21hdGNoaW5nRG9tYWluXSwgY29va2llQ29uc2VudC5ub25jZSk7XG4gICAgICAgIHNjcmlwdFRvTG9hZCA9ICdtYXhQcml2YWN5JztcbiAgICAgIH1cblxuICAgICAgaWYgKGNvb2tpZUNvbnNlbnQudHdpcGxhLmN1cnJlbnRTY3JpcHQgIT09IHNjcmlwdFRvTG9hZCkge1xuICAgICAgICBjb29raWVDb25zZW50LnR3aXBsYS5jdXJyZW50U2NyaXB0ID0gc2NyaXB0VG9Mb2FkO1xuICAgICAgICBjb25zdCB0d2lwbGFTbmlwcGV0U2NyaXB0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nvb2tpZWJvdC12aXNpdG9yLWFuYWx5dGljcy1zbmlwcGV0Jyk7XG4gICAgICAgIGNvbnN0IHR3aXBsYVNjcmlwdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb29raWVib3QtdmlzaXRvci1hbmFseXRpY3MnKTtcblxuICAgICAgICB0d2lwbGFTbmlwcGV0U2NyaXB0ICYmIHR3aXBsYVNuaXBwZXRTY3JpcHQucmVtb3ZlKCk7XG4gICAgICAgIHR3aXBsYVNjcmlwdCAmJiB0d2lwbGFTY3JpcHQucmVtb3ZlKCk7XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IElDb29raWVDb25zZW50LCBJVHdpcGxhU2V0dGluZ3MgfSBmcm9tICdAL3R5cGVzL2NvbnNlbnQnO1xuaW1wb3J0IHsgSVdpZGdldENvbmZpZ3VyYXRpb24gfSBmcm9tICdAL3dpZGdldC9zZXR0aW5ncyc7XG5pbXBvcnQgeyBpbmplY3RUd2lwbGEgfSBmcm9tICdAL3R3aXBsYS90d2lwbGEnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElFcnJvclJlc3BvbnNlXG57XG4gICAgc3RhdHVzOiBudW1iZXIsXG4gICAgbWVzc2FnZTogc3RyaW5nXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVNldHRpbmdzUmVzcG9uc2Uge1xuICB3aWRnZXQ6IElXaWRnZXRDb25maWd1cmF0aW9uLFxuICB0d2lwbGE/OiBJVHdpcGxhU2V0dGluZ3Ncbn1cblxuZXhwb3J0IGNvbnN0IGZldGNoSnNvbkRhdGEgPSBmdW5jdGlvbjxUPiAodXJsIDogc3RyaW5nLCBvblN1Y2Nlc3MgOiAoKHJlc3BvbnNlIDogVCB8IHt9KSA9PiB2b2lkKSwgb25FcnJvcj86IChlcnJvcjogSUVycm9yUmVzcG9uc2UpID0+IHZvaWQpIDogdm9pZCB7XG4gIGNvbnN0IHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICh0aGlzIDogWE1MSHR0cFJlcXVlc3QpIHtcbiAgICBpZiAodGhpcy5yZWFkeVN0YXRlID09PSA0ICYmICh0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPD0gMjk5KSkge1xuICAgICAgLy8gc3VjY2VzcyBidXQgbm8gY29udGVudFxuICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyMDQpIHtcbiAgICAgICAgb25TdWNjZXNzKHt9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBqc29uID0gSlNPTi5wYXJzZSh0aGlzLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIG9uU3VjY2Vzcyhqc29uKTtcbiAgICAgIH0gY2F0Y2ggKGUgOiBhbnkpIHtcbiAgICAgICAgb25FcnJvciAmJiBvbkVycm9yKHtcbiAgICAgICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgICAgIG1lc3NhZ2U6ICdKU09OLnBhcnNlIGVycm9yOiAnICsgZS5tZXNzYWdlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5yZWFkeVN0YXRlID09PSA0KSB7IC8vIGZhaWxcbiAgICAgIG9uRXJyb3IgJiYgb25FcnJvcih7XG4gICAgICAgIHN0YXR1czogdGhpcy5zdGF0dXMsXG4gICAgICAgIG1lc3NhZ2U6IHRoaXMucmVzcG9uc2VUZXh0XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgeG1saHR0cC5vbmVycm9yID0gZnVuY3Rpb24gKCkgeyAvLyBlcnJvciBvbiBuZXR3b3JrIGxldmVsXG4gICAgb25FcnJvciAmJiBvbkVycm9yKHtcbiAgICAgIHN0YXR1czogLTEsXG4gICAgICBtZXNzYWdlOiAnb25lcnJvcidcbiAgICB9KTtcbiAgfTtcblxuICB4bWxodHRwLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gIHhtbGh0dHAuc2VuZCgpO1xufTtcblxuZXhwb3J0IGNvbnN0IGxvYWRTZXR0aW5ncyA9IGZ1bmN0aW9uKGNvb2tpZUNvbnNlbnQ6IElDb29raWVDb25zZW50KTogdm9pZCB7XG4gIGNvbnN0IHVybCA9IGNvb2tpZUNvbnNlbnQuQ0ROICsgJy9jb25zZW50Y29uZmlnLycgKyBjb29raWVDb25zZW50LnNlcmlhbC50b0xvd2VyQ2FzZSgpICsgJy9zZXR0aW5ncy5qc29uJztcblxuICBmdW5jdGlvbiBmZXRjaFNldHRpbmdzQ2FsbGJhY2soZGF0YTogSVNldHRpbmdzUmVzcG9uc2UpIHtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgaWYgKGRhdGEud2lkZ2V0KSB7XG4gICAgICAgIGNvb2tpZUNvbnNlbnQud2lkZ2V0ID0gY29va2llQ29uc2VudC53aWRnZXQgfHwge307XG4gICAgICAgIGNvb2tpZUNvbnNlbnQud2lkZ2V0LmNvbmZpZ3VyYXRpb24gPSBkYXRhLndpZGdldDtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEudHdpcGxhICYmICFjb29raWVDb25zZW50LmlzU3BpZGVyKCkpIHtcbiAgICAgICAgY29va2llQ29uc2VudC50d2lwbGEgPSBkYXRhLnR3aXBsYTtcbiAgICAgICAgaW5qZWN0VHdpcGxhKGNvb2tpZUNvbnNlbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvb2tpZUNvbnNlbnQuc2V0dGluZ3NMb2FkZWQgPSB0cnVlO1xuICB9XG5cbiAgLy8gdG9kbyAtIHRzLWlnbm9yZSB0byBiZSByZW1vdmVkIGluIGZ1dHVyZSBUeXBlU2NyaXB0IGNsZWFudXAgdGFzayAoRVVELTUyMTMpXG4gIC8vIEB0cy1pZ25vcmU6IFVucmVhY2hhYmxlIGNvZGUgZXJyb3JcbiAgY29va2llQ29uc2VudC5mZXRjaEpzb25EYXRhKHVybCwgZmV0Y2hTZXR0aW5nc0NhbGxiYWNrLCBmZXRjaFNldHRpbmdzQ2FsbGJhY2spO1xufTtcbiIsIi8qKlxuICogQHJldHVybnMgLSBUQ0YgQ29uc2VudCBTdHJpbmcgKElBQkNvbnNlbnRTdHJpbmcpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUY2ZDb25zZW50U3RyaW5nKCkge1xuICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Nvb2tpZWJvdFRjZkNvbnNlbnRTdHJpbmcnKSB8fCAnJztcbn1cblxuLyoqXG4gKiBAcmV0dXJucyAtIEdBQ00gQ29uc2VudCBTdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEdhY21Db25zZW50U3RyaW5nKCkge1xuICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Nvb2tpZWJvdEdhY21Db25zZW50U3RyaW5nJykgfHwgJyc7XG59XG4iLCIvKipcbiAqIEB0aGlzIHtQcm9taXNlfVxuICovXG5mdW5jdGlvbiBmaW5hbGx5Q29uc3RydWN0b3IoY2FsbGJhY2spIHtcbiAgdmFyIGNvbnN0cnVjdG9yID0gdGhpcy5jb25zdHJ1Y3RvcjtcbiAgcmV0dXJuIHRoaXMudGhlbihcbiAgICBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlc29sdmUoY2FsbGJhY2soKSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIGNvbnN0cnVjdG9yLnJlamVjdChyZWFzb24pO1xuICAgICAgfSk7XG4gICAgfVxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmaW5hbGx5Q29uc3RydWN0b3I7XG4iLCJmdW5jdGlvbiBhbGxTZXR0bGVkKGFycikge1xuICB2YXIgUCA9IHRoaXM7XG4gIHJldHVybiBuZXcgUChmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAoIShhcnIgJiYgdHlwZW9mIGFyci5sZW5ndGggIT09ICd1bmRlZmluZWQnKSkge1xuICAgICAgcmV0dXJuIHJlamVjdChcbiAgICAgICAgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICB0eXBlb2YgYXJyICtcbiAgICAgICAgICAgICcgJyArXG4gICAgICAgICAgICBhcnIgK1xuICAgICAgICAgICAgJyBpcyBub3QgaXRlcmFibGUoY2Fubm90IHJlYWQgcHJvcGVydHkgU3ltYm9sKFN5bWJvbC5pdGVyYXRvcikpJ1xuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycik7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgdmFyIHJlbWFpbmluZyA9IGFyZ3MubGVuZ3RoO1xuXG4gICAgZnVuY3Rpb24gcmVzKGksIHZhbCkge1xuICAgICAgaWYgKHZhbCAmJiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgdmFyIHRoZW4gPSB2YWwudGhlbjtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhlbi5jYWxsKFxuICAgICAgICAgICAgdmFsLFxuICAgICAgICAgICAgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgIHJlcyhpLCB2YWwpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgYXJnc1tpXSA9IHsgc3RhdHVzOiAncmVqZWN0ZWQnLCByZWFzb246IGUgfTtcbiAgICAgICAgICAgICAgaWYgKC0tcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShhcmdzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBhcmdzW2ldID0geyBzdGF0dXM6ICdmdWxmaWxsZWQnLCB2YWx1ZTogdmFsIH07XG4gICAgICBpZiAoLS1yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgcmVzb2x2ZShhcmdzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlcyhpLCBhcmdzW2ldKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBhbGxTZXR0bGVkO1xuIiwiaW1wb3J0IHByb21pc2VGaW5hbGx5IGZyb20gJy4vZmluYWxseSc7XG5pbXBvcnQgYWxsU2V0dGxlZCBmcm9tICcuL2FsbFNldHRsZWQnO1xuXG4vLyBTdG9yZSBzZXRUaW1lb3V0IHJlZmVyZW5jZSBzbyBwcm9taXNlLXBvbHlmaWxsIHdpbGwgYmUgdW5hZmZlY3RlZCBieVxuLy8gb3RoZXIgY29kZSBtb2RpZnlpbmcgc2V0VGltZW91dCAobGlrZSBzaW5vbi51c2VGYWtlVGltZXJzKCkpXG52YXIgc2V0VGltZW91dEZ1bmMgPSBzZXRUaW1lb3V0O1xuXG5mdW5jdGlvbiBpc0FycmF5KHgpIHtcbiAgcmV0dXJuIEJvb2xlYW4oeCAmJiB0eXBlb2YgeC5sZW5ndGggIT09ICd1bmRlZmluZWQnKTtcbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbi8vIFBvbHlmaWxsIGZvciBGdW5jdGlvbi5wcm90b3R5cGUuYmluZFxuZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgZm4uYXBwbHkodGhpc0FyZywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKi9cbmZ1bmN0aW9uIFByb21pc2UoZm4pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFByb21pc2UpKVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2VzIG11c3QgYmUgY29uc3RydWN0ZWQgdmlhIG5ldycpO1xuICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBmdW5jdGlvbicpO1xuICAvKiogQHR5cGUgeyFudW1iZXJ9ICovXG4gIHRoaXMuX3N0YXRlID0gMDtcbiAgLyoqIEB0eXBlIHshYm9vbGVhbn0gKi9cbiAgdGhpcy5faGFuZGxlZCA9IGZhbHNlO1xuICAvKiogQHR5cGUge1Byb21pc2V8dW5kZWZpbmVkfSAqL1xuICB0aGlzLl92YWx1ZSA9IHVuZGVmaW5lZDtcbiAgLyoqIEB0eXBlIHshQXJyYXk8IUZ1bmN0aW9uPn0gKi9cbiAgdGhpcy5fZGVmZXJyZWRzID0gW107XG5cbiAgZG9SZXNvbHZlKGZuLCB0aGlzKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlKHNlbGYsIGRlZmVycmVkKSB7XG4gIHdoaWxlIChzZWxmLl9zdGF0ZSA9PT0gMykge1xuICAgIHNlbGYgPSBzZWxmLl92YWx1ZTtcbiAgfVxuICBpZiAoc2VsZi5fc3RhdGUgPT09IDApIHtcbiAgICBzZWxmLl9kZWZlcnJlZHMucHVzaChkZWZlcnJlZCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNlbGYuX2hhbmRsZWQgPSB0cnVlO1xuICBQcm9taXNlLl9pbW1lZGlhdGVGbihmdW5jdGlvbigpIHtcbiAgICB2YXIgY2IgPSBzZWxmLl9zdGF0ZSA9PT0gMSA/IGRlZmVycmVkLm9uRnVsZmlsbGVkIDogZGVmZXJyZWQub25SZWplY3RlZDtcbiAgICBpZiAoY2IgPT09IG51bGwpIHtcbiAgICAgIChzZWxmLl9zdGF0ZSA9PT0gMSA/IHJlc29sdmUgOiByZWplY3QpKGRlZmVycmVkLnByb21pc2UsIHNlbGYuX3ZhbHVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHJldDtcbiAgICB0cnkge1xuICAgICAgcmV0ID0gY2Ioc2VsZi5fdmFsdWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlamVjdChkZWZlcnJlZC5wcm9taXNlLCBlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCByZXQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZShzZWxmLCBuZXdWYWx1ZSkge1xuICB0cnkge1xuICAgIC8vIFByb21pc2UgUmVzb2x1dGlvbiBQcm9jZWR1cmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9taXNlcy1hcGx1cy9wcm9taXNlcy1zcGVjI3RoZS1wcm9taXNlLXJlc29sdXRpb24tcHJvY2VkdXJlXG4gICAgaWYgKG5ld1ZhbHVlID09PSBzZWxmKVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQSBwcm9taXNlIGNhbm5vdCBiZSByZXNvbHZlZCB3aXRoIGl0c2VsZi4nKTtcbiAgICBpZiAoXG4gICAgICBuZXdWYWx1ZSAmJlxuICAgICAgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG5ld1ZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICkge1xuICAgICAgdmFyIHRoZW4gPSBuZXdWYWx1ZS50aGVuO1xuICAgICAgaWYgKG5ld1ZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICBzZWxmLl9zdGF0ZSA9IDM7XG4gICAgICAgIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIGZpbmFsZShzZWxmKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBkb1Jlc29sdmUoYmluZCh0aGVuLCBuZXdWYWx1ZSksIHNlbGYpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHNlbGYuX3N0YXRlID0gMTtcbiAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGZpbmFsZShzZWxmKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJlamVjdChzZWxmLCBlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWplY3Qoc2VsZiwgbmV3VmFsdWUpIHtcbiAgc2VsZi5fc3RhdGUgPSAyO1xuICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICBmaW5hbGUoc2VsZik7XG59XG5cbmZ1bmN0aW9uIGZpbmFsZShzZWxmKSB7XG4gIGlmIChzZWxmLl9zdGF0ZSA9PT0gMiAmJiBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoID09PSAwKSB7XG4gICAgUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXNlbGYuX2hhbmRsZWQpIHtcbiAgICAgICAgUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4oc2VsZi5fdmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNlbGYuX2RlZmVycmVkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGhhbmRsZShzZWxmLCBzZWxmLl9kZWZlcnJlZHNbaV0pO1xuICB9XG4gIHNlbGYuX2RlZmVycmVkcyA9IG51bGw7XG59XG5cbi8qKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb21pc2UpIHtcbiAgdGhpcy5vbkZ1bGZpbGxlZCA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogbnVsbDtcbiAgdGhpcy5vblJlamVjdGVkID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT09ICdmdW5jdGlvbicgPyBvblJlamVjdGVkIDogbnVsbDtcbiAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbn1cblxuLyoqXG4gKiBUYWtlIGEgcG90ZW50aWFsbHkgbWlzYmVoYXZpbmcgcmVzb2x2ZXIgZnVuY3Rpb24gYW5kIG1ha2Ugc3VyZVxuICogb25GdWxmaWxsZWQgYW5kIG9uUmVqZWN0ZWQgYXJlIG9ubHkgY2FsbGVkIG9uY2UuXG4gKlxuICogTWFrZXMgbm8gZ3VhcmFudGVlcyBhYm91dCBhc3luY2hyb255LlxuICovXG5mdW5jdGlvbiBkb1Jlc29sdmUoZm4sIHNlbGYpIHtcbiAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICBmbihcbiAgICAgIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICByZXNvbHZlKHNlbGYsIHZhbHVlKTtcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIHJlamVjdChzZWxmLCByZWFzb24pO1xuICAgICAgfVxuICAgICk7XG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICBkb25lID0gdHJ1ZTtcbiAgICByZWplY3Qoc2VsZiwgZXgpO1xuICB9XG59XG5cblByb21pc2UucHJvdG90eXBlWydjYXRjaCddID0gZnVuY3Rpb24ob25SZWplY3RlZCkge1xuICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0ZWQpO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gIC8vIEB0cy1pZ25vcmVcbiAgdmFyIHByb20gPSBuZXcgdGhpcy5jb25zdHJ1Y3Rvcihub29wKTtcblxuICBoYW5kbGUodGhpcywgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb20pKTtcbiAgcmV0dXJuIHByb207XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZVsnZmluYWxseSddID0gcHJvbWlzZUZpbmFsbHk7XG5cblByb21pc2UuYWxsID0gZnVuY3Rpb24oYXJyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAoIWlzQXJyYXkoYXJyKSkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgVHlwZUVycm9yKCdQcm9taXNlLmFsbCBhY2NlcHRzIGFuIGFycmF5JykpO1xuICAgIH1cblxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICB2YXIgcmVtYWluaW5nID0gYXJncy5sZW5ndGg7XG5cbiAgICBmdW5jdGlvbiByZXMoaSwgdmFsKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAodmFsICYmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHZhciB0aGVuID0gdmFsLnRoZW47XG4gICAgICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGVuLmNhbGwoXG4gICAgICAgICAgICAgIHZhbCxcbiAgICAgICAgICAgICAgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgcmVzKGksIHZhbCk7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXJnc1tpXSA9IHZhbDtcbiAgICAgICAgaWYgKC0tcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICAgcmVzb2x2ZShhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlcyhpLCBhcmdzW2ldKTtcbiAgICB9XG4gIH0pO1xufTtcblxuUHJvbWlzZS5hbGxTZXR0bGVkID0gYWxsU2V0dGxlZDtcblxuUHJvbWlzZS5yZXNvbHZlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuY29uc3RydWN0b3IgPT09IFByb21pc2UpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgIHJlc29sdmUodmFsdWUpO1xuICB9KTtcbn07XG5cblByb21pc2UucmVqZWN0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlamVjdCh2YWx1ZSk7XG4gIH0pO1xufTtcblxuUHJvbWlzZS5yYWNlID0gZnVuY3Rpb24oYXJyKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICBpZiAoIWlzQXJyYXkoYXJyKSkge1xuICAgICAgcmV0dXJuIHJlamVjdChuZXcgVHlwZUVycm9yKCdQcm9taXNlLnJhY2UgYWNjZXB0cyBhbiBhcnJheScpKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoYXJyW2ldKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgfVxuICB9KTtcbn07XG5cbi8vIFVzZSBwb2x5ZmlsbCBmb3Igc2V0SW1tZWRpYXRlIGZvciBwZXJmb3JtYW5jZSBnYWluc1xuUHJvbWlzZS5faW1tZWRpYXRlRm4gPVxuICAvLyBAdHMtaWdub3JlXG4gICh0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nICYmXG4gICAgZnVuY3Rpb24oZm4pIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHNldEltbWVkaWF0ZShmbik7XG4gICAgfSkgfHxcbiAgZnVuY3Rpb24oZm4pIHtcbiAgICBzZXRUaW1lb3V0RnVuYyhmbiwgMCk7XG4gIH07XG5cblByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuID0gZnVuY3Rpb24gX3VuaGFuZGxlZFJlamVjdGlvbkZuKGVycikge1xuICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUpIHtcbiAgICBjb25zb2xlLndhcm4oJ1Bvc3NpYmxlIFVuaGFuZGxlZCBQcm9taXNlIFJlamVjdGlvbjonLCBlcnIpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvbWlzZTtcbiIsImltcG9ydCB7IElDb29raWVDb25zZW50LCBJQ29va2llQ29uc2VudFNjcmlwdCB9IGZyb20gJ0AvdHlwZXMvY29uc2VudCc7XG5pbXBvcnQgeyByZXNvbHZlZFByb21pc2UsIGdldERvbWFpblNlYXJjaFBhcmFtIH0gZnJvbSAnQC91dGlsaXRpZXMnO1xuXG5pbnRlcmZhY2UgSUJhbm5lclF1ZXJ5UGFyYW1ldGVycyB7XG4gICAgc2VyaWFsIDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIG1vZGU6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBjdWx0dXJlIDogc3RyaW5nIHwgdW5kZWZpbmVkLFxuICAgIHR5cGUgOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gICAgbGV2ZWwgOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gICAgZG9tYWluUGF0aCA6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICB1c2VyQ291bnRyeSA6IHN0cmluZyB8IHVuZGVmaW5lZFxufVxuXG5jb25zdCBjcmVhdGVCYW5uZXJRdWVyeVBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoY29va2llQ29uc2VudCA6IElDb29raWVDb25zZW50LCB1Y1NjcmlwdEVsZW1lbnQgOiBJQ29va2llQ29uc2VudFNjcmlwdCkgOiBJQmFubmVyUXVlcnlQYXJhbWV0ZXJzIHtcbiAgcmV0dXJuIHtcbiAgICBzZXJpYWw6IGNvb2tpZUNvbnNlbnQuZ2V0VVJMUGFyYW0oJ2NiaWQnKSB8fCB1Y1NjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWNiaWQnKSB8fCB1bmRlZmluZWQsXG4gICAgbW9kZTogY29va2llQ29uc2VudC5nZXRVUkxQYXJhbSgnbW9kZScpIHx8IHVjU2NyaXB0RWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kZScpIHx8IHVuZGVmaW5lZCxcbiAgICBjdWx0dXJlOiBjb29raWVDb25zZW50LmdldFVSTFBhcmFtKCdjdWx0dXJlJykgfHwgdWNTY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1jdWx0dXJlJykgfHwgdW5kZWZpbmVkLFxuICAgIHR5cGU6IGNvb2tpZUNvbnNlbnQuZ2V0VVJMUGFyYW0oJ3R5cGUnKSB8fCB1Y1NjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKSB8fCB1bmRlZmluZWQsXG4gICAgbGV2ZWw6IGNvb2tpZUNvbnNlbnQuZ2V0VVJMUGFyYW0oJ2xldmVsJykgfHwgdWNTY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1sZXZlbCcpIHx8IHVuZGVmaW5lZCxcbiAgICBkb21haW5QYXRoOiBjb29raWVDb25zZW50LmdldFVSTFBhcmFtKCdwYXRoJykgfHwgdWNTY3JpcHRFbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJykgfHwgdW5kZWZpbmVkLFxuICAgIHVzZXJDb3VudHJ5OiBnZXREb21haW5TZWFyY2hQYXJhbSgndWNfY21wX2NvdW50cnknKSB8fCBjb29raWVDb25zZW50LmdldFVSTFBhcmFtKCd1c2VyX2NvdW50cnknKSB8fCB1Y1NjcmlwdEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXVzZXItY291bnRyeScpIHx8IHVuZGVmaW5lZFxuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZUJhbm5lciA9IGZ1bmN0aW9uIChjb29raWVDb25zZW50IDogSUNvb2tpZUNvbnNlbnQsIGlzUmVuZXdhbCA6IGJvb2xlYW4pIDogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHVjU2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvb2tpZUNvbnNlbnQuc2NyaXB0SWQpIGFzIElDb29raWVDb25zZW50U2NyaXB0IHx8IGNvb2tpZUNvbnNlbnQuc2NyaXB0RWxlbWVudDtcblxuICBpZiAoIXVjU2NyaXB0RWxlbWVudCkge1xuICAgIGNvbnNvbGUud2FybihcIkVycm9yOiBDYW4ndCByZWFkIGRhdGEgdmFsdWVzIGZyb20gdGhlIGNvb2tpZSBzY3JpcHQgdGFnIC0gbWFrZSBzdXJlIHRvIHNldCBzY3JpcHQgYXR0cmlidXRlIElELlwiKTtcbiAgICByZXR1cm4gcmVzb2x2ZWRQcm9taXNlKGNvb2tpZUNvbnNlbnQuUHJvbWlzZSk7XG4gIH1cblxuICBjb25zdCBwYXJhbWV0ZXJzID0gY3JlYXRlQmFubmVyUXVlcnlQYXJhbWV0ZXJzKGNvb2tpZUNvbnNlbnQsIHVjU2NyaXB0RWxlbWVudCk7XG5cbiAgaWYgKCFwYXJhbWV0ZXJzLnNlcmlhbCkge1xuICAgIGNvbnNvbGUud2FybihcIkVycm9yOiBDb29raWUgc2NyaXB0IHRhZyBhdHRyaWJ1dGUgJ2RhdGEtY2JpZCcgaXMgbWlzc2luZy5cIik7XG4gICAgcmV0dXJuIHJlc29sdmVkUHJvbWlzZShjb29raWVDb25zZW50LlByb21pc2UpO1xuICB9XG5cbiAgaWYgKCFjb29raWVDb25zZW50LmlzR1VJRChwYXJhbWV0ZXJzLnNlcmlhbCkpIHtcbiAgICBjb25zb2xlLndhcm4oJ0Vycm9yOiBDb29raWUgc2NyaXB0IHRhZyBJRCAlcyBpcyBub3QgYSB2YWxpZCBrZXkuJywgcGFyYW1ldGVycy5zZXJpYWwpO1xuICAgIHJldHVybiByZXNvbHZlZFByb21pc2UoY29va2llQ29uc2VudC5Qcm9taXNlKTtcbiAgfVxuXG4gIGNvbnN0IHNlcmlhbCA9IHBhcmFtZXRlcnMuc2VyaWFsO1xuICBjb25zdCBtb2RlID0gcGFyYW1ldGVycy5tb2RlO1xuICBjb25zdCBjdWx0dXJlID0gcGFyYW1ldGVycy5jdWx0dXJlO1xuICBjb25zdCB0eXBlID0gcGFyYW1ldGVycy50eXBlO1xuICBjb25zdCBsZXZlbCA9IHBhcmFtZXRlcnMubGV2ZWw7XG4gIGNvbnN0IGRvbWFpblBhdGggPSBwYXJhbWV0ZXJzLmRvbWFpblBhdGg7XG4gIGNvbnN0IHVzZXJDb3VudHJ5ID0gcGFyYW1ldGVycy51c2VyQ291bnRyeTtcblxuICBjb29raWVDb25zZW50LnNlcmlhbCA9IHNlcmlhbDtcblxuICBpZiAoIWNvb2tpZUNvbnNlbnQuY29va2llRW5hYmxlZCkge1xuICAgIGNvb2tpZUNvbnNlbnQuY29uc2VudGVkID0gZmFsc2U7XG4gICAgY29va2llQ29uc2VudC5kZWNsaW5lZCA9IHRydWU7XG4gICAgY29va2llQ29uc2VudC5oYXNSZXNwb25zZSA9IHRydWU7XG4gICAgY29va2llQ29uc2VudC5jb25zZW50LnByZWZlcmVuY2VzID0gZmFsc2U7XG4gICAgY29va2llQ29uc2VudC5jb25zZW50LnN0YXRpc3RpY3MgPSBmYWxzZTtcbiAgICBjb29raWVDb25zZW50LmNvbnNlbnQubWFya2V0aW5nID0gZmFsc2U7XG4gICAgY29va2llQ29uc2VudC5jb25zZW50SUQgPSAnLTMnOyAvLyBjb29raWVzIGlzIG5vdCBlbmFibGVkIG9uIGNsaWVudFxuICAgIGNvb2tpZUNvbnNlbnQuY29uc2VudC5zdGFtcCA9ICctMyc7XG4gICAgcmV0dXJuIHJlc29sdmVkUHJvbWlzZShjb29raWVDb25zZW50LlByb21pc2UpO1xuICB9XG5cbiAgY29uc3QgcXVlcnlzdHJpbmdzID0gW1xuICAgICdyZW5ldz0nICsgKGlzUmVuZXdhbCA/ICd0cnVlJyA6ICdmYWxzZScpLFxuICAgICdyZWZlcmVyPScgKyBlbmNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKSxcbiAgICAnZG50PScgKyAoY29va2llQ29uc2VudC5kb05vdFRyYWNrID8gJ3RydWUnIDogJ2ZhbHNlJyksXG4gICAgLy8gQ29uc3VtZXIgd2lsbCBjYWxsIGluaXQsIHNvIHRoZSBvdXRwdXR0ZWQgSmF2YXNjcmlwdCBzaG91bGQgbm90XG4gICAgJ2luaXQ9ZmFsc2UnXG4gIF07XG5cbiAgLy8gb25seSBpbmNsdWRlIG9uIHJlbmV3YWwgdG8gYXZvaWQgcmVsb2FkIG9mIGJhbm5lciBvbiBlYWNoIHBhZ2UgcmVxdWVzdCB3aGVuIHNpdGUgaXMgdXNpbmcgZXhwbGljaXQgY29uc2VudFxuICBpc1JlbmV3YWwgJiYgcXVlcnlzdHJpbmdzLnB1c2goJ25vY2FjaGU9JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgbW9kZSAmJiBxdWVyeXN0cmluZ3MucHVzaCgnbW9kZT0nICsgbW9kZSk7XG4gIGN1bHR1cmUgJiYgcXVlcnlzdHJpbmdzLnB1c2goJ2N1bHR1cmU9JyArIGN1bHR1cmUpO1xuICB0eXBlICYmIHF1ZXJ5c3RyaW5ncy5wdXNoKCd0eXBlPScgKyB0eXBlKTtcbiAgbGV2ZWwgJiYgcXVlcnlzdHJpbmdzLnB1c2goJ2xldmVsPScgKyBsZXZlbCk7XG4gIGRvbWFpblBhdGggJiYgcXVlcnlzdHJpbmdzLnB1c2goJ3BhdGg9JyArIGVuY29kZVVSSUNvbXBvbmVudChkb21haW5QYXRoKSk7XG4gIHVzZXJDb3VudHJ5ICYmIHF1ZXJ5c3RyaW5ncy5wdXNoKCd1c2VyY291bnRyeT0nICsgdXNlckNvdW50cnkpO1xuXG4gIGNvb2tpZUNvbnNlbnQuZnJhbWV3b3JrICYmIHF1ZXJ5c3RyaW5ncy5wdXNoKCdmcmFtZXdvcms9JyArIGNvb2tpZUNvbnNlbnQuZnJhbWV3b3JrKTtcbiAgY29va2llQ29uc2VudC5nZW9SZWdpb25zLmxlbmd0aCA+IDAgJiYgcXVlcnlzdHJpbmdzLnB1c2goJ2dlb3JlZ2lvbnM9JyArIGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjb29raWVDb25zZW50Lmdlb1JlZ2lvbnMpKSk7XG4gIGNvb2tpZUNvbnNlbnQuaXNidWxrcmVuZXdhbCAmJiBxdWVyeXN0cmluZ3MucHVzaCgnYnVsa3JlbmV3PTEnKTtcbiAgLy8gb25lIHRpbWUgc2lnbmFsXG4gIGNvb2tpZUNvbnNlbnQuaXNidWxrcmVuZXdhbCA9IGZhbHNlO1xuXG4gIHJldHVybiBuZXcgY29va2llQ29uc2VudC5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgY29va2llQ29uc2VudC5nZXRTY3JpcHQoY29va2llQ29uc2VudC5ob3N0ICsgc2VyaWFsICsgJy9jYy5qcz8nICsgcXVlcnlzdHJpbmdzLmpvaW4oJyYnKSwgdHJ1ZSwgcmVzb2x2ZSk7XG4gIH0pO1xufTtcbiIsImV4cG9ydCBjb25zdCBjcmVhdGVXaWRnZXRJY29uVXJsID0gZnVuY3Rpb24gKGNkbkhvc3QgOiBzdHJpbmcpIDogc3RyaW5nIHtcbiAgcmV0dXJuIGNkbkhvc3QgKyAnU2NyaXB0cy93aWRnZXRJY29uLm1pbi5qcyc7XG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlV2lkZ2V0VXJsID0gZnVuY3Rpb24gKGNkbkhvc3QgOiBzdHJpbmcpIDogc3RyaW5nIHtcbiAgcmV0dXJuIGNkbkhvc3QgKyAnU2NyaXB0cy93aWRnZXQubWluLmpzJztcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVXaWRnZXRDb250ZW50VXJsID0gZnVuY3Rpb24gKGNkbkhvc3QgOiBzdHJpbmcsIGRvbWFpbkdyb3VwU2VyaWFsIDogc3RyaW5nLCBsYW5ndWFnZSA6IHN0cmluZykgOiBzdHJpbmcge1xuICByZXR1cm4gY2RuSG9zdCArICcvd2lkZ2V0Y29udGVudC8nICsgZG9tYWluR3JvdXBTZXJpYWwudG9Mb3dlckNhc2UoKSArICcvd2lkZ2V0Y29udGVudF8nICsgbGFuZ3VhZ2UgKyAnLmpzb24nO1xufTtcbiIsImltcG9ydCB7IElDb29raWVDb25zZW50IH0gZnJvbSAnQC90eXBlcy9jb25zZW50JztcbmltcG9ydCB7IGNvb2tpZXNOdW1iZXJDYXRlZ29yaWVzRnJvbVN0cmluZ0FycmF5IH0gZnJvbSAnQC91dGlsaXRpZXMnO1xuXG4vKipcbiAqIEBwYXJhbSBjb29raWVDb25zZW50IC0gQ29va2llQ29uc2VudCAvIENvb2tpZWJvdCBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWRJbmxpbmVUYWdDb25maWd1cmF0aW9uIChjb29raWVDb25zZW50OiBJQ29va2llQ29uc2VudCk6IHZvaWQge1xuICBjb25zdCB0YWdDb25maWd1cmF0aW9uID0gY29va2llQ29uc2VudC5pbmxpbmVDb25maWd1cmF0aW9uICYmIGNvb2tpZUNvbnNlbnQuaW5saW5lQ29uZmlndXJhdGlvbi5UYWdDb25maWd1cmF0aW9uO1xuXG4gIGlmICh0YWdDb25maWd1cmF0aW9uICYmIHRhZ0NvbmZpZ3VyYXRpb24ubGVuZ3RoID4gMCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFnQ29uZmlndXJhdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgdGFnID0gdGFnQ29uZmlndXJhdGlvbltpXTtcbiAgICAgIGlmICh0YWcuaWQpIHtcbiAgICAgICAgLy8gcmVtb3ZlIHBvdGVudGlhbCBkdXBsaWNhdGUgZnJvbSBjb25maWd1cmF0aW9uLmpzXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29va2llQ29uc2VudC5jb25maWd1cmF0aW9uLnRhZ3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBjb25zdCBjdXJyZW50VGFnID0gY29va2llQ29uc2VudC5jb25maWd1cmF0aW9uLnRhZ3Nbal07XG5cbiAgICAgICAgICBpZiAodGFnLmlkID09PSBjdXJyZW50VGFnLnRhZ0lEKSB7XG4gICAgICAgICAgICBjb29raWVDb25zZW50LmNvbmZpZ3VyYXRpb24udGFncy5zcGxpY2UoaiwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2F0ZWdvcnlOdW1iZXJBcnJheSA9IGNvb2tpZXNOdW1iZXJDYXRlZ29yaWVzRnJvbVN0cmluZ0FycmF5KHRhZy5jYXRlZ29yaWVzIHx8IFtdKTtcblxuICAgICAgICAvLyByZWdpc3RlciBuZXcgdGFnXG4gICAgICAgIGNvb2tpZUNvbnNlbnQuY29uZmlndXJhdGlvbi50YWdzLnB1c2goe1xuICAgICAgICAgIGlkOiAwLFxuICAgICAgICAgIHRhZ0lEOiB0YWcuaWQsXG4gICAgICAgICAgY2F0OiBjYXRlZ29yeU51bWJlckFycmF5LFxuICAgICAgICAgIGlubmVySGFzaDogJycsXG4gICAgICAgICAgb3V0ZXJIYXNoOiAnJyxcbiAgICAgICAgICByZXNvbHZlZFVybDogJycsXG4gICAgICAgICAgdGFnSGFzaDogJycsXG4gICAgICAgICAgdHlwZTogJycsXG4gICAgICAgICAgdXJsOiAnJ1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IGZldGNoSnNvbkRhdGEgfSBmcm9tICdAL3JlcXVlc3RzJztcbmltcG9ydCB7IElDb29raWVDb25zZW50IH0gZnJvbSAnQC90eXBlcy9jb25zZW50JztcbmltcG9ydCB7IGdldFRydW5jYXRlZFN0cmluZyB9IGZyb20gJ0AvdXRpbGl0aWVzJztcbmltcG9ydCB7IGluamVjdFR3aXBsYSB9IGZyb20gJ0AvdHdpcGxhL3R3aXBsYSc7XG5cbmludGVyZmFjZSBJTG9nQ29uc2VudENvb2tpZSB7XG4gIENvb2tpZU5hbWU6IHN0cmluZyxcbiAgQ29va2llU3RvcmFnZVR5cGU6IG51bWJlcixcbiAgQ29va2llTmFtZVJlZ2V4Pzogc3RyaW5nXG59XG5cbmludGVyZmFjZSBJTG9nQ29uc2VudENvb2tpZUxpc3Qge1xuICBBZHZlcnRpc2luZ0Nvb2tpZXM6IElMb2dDb25zZW50Q29va2llW10sXG4gIFByZWZlcmVuY2VDb29raWVzOiBJTG9nQ29uc2VudENvb2tpZVtdXG4gIFN0YXRpc3RpY0Nvb2tpZXM6IElMb2dDb25zZW50Q29va2llW11cbiAgVW5jbGFzc2lmaWVkQ29va2llczogSUxvZ0NvbnNlbnRDb29raWVbXVxufVxuXG4vKipcbiAqIEBwYXJhbSBjb29raWVPYmplY3QgLSBUaGUgY29va2llIG9iamVjdCB0byBiZSB0dXJuZWQgaW50byBhbiBhcnJheVxuICogQHJldHVybnMgLSBBIGxpc3Qgb2Ygc3RyaW5ncyBtYXRjaGluZyB0aGUgb3JpZ2luYWwgQ29va2llQ29uc2VudC5jb29raWVMaXN0XG4gKi9cbmZ1bmN0aW9uIGdldENvb2tpZUxpc3RGcm9tT2JqZWN0IChjb29raWVPYmplY3Q6IElMb2dDb25zZW50Q29va2llKTogc3RyaW5nW10ge1xuICByZXR1cm4gW2Nvb2tpZU9iamVjdC5Db29raWVOYW1lLCAnJywgJycsICcnLCAnJywgY29va2llT2JqZWN0LkNvb2tpZVN0b3JhZ2VUeXBlLnRvU3RyaW5nKCksIGNvb2tpZU9iamVjdC5Db29raWVOYW1lUmVnZXggfHwgJyddO1xufVxuXG4vKipcbiAqIEBwYXJhbSBjb29raWVDb25zZW50IC0gQ29va2llQ29uc2VudCAvIENvb2tpZWJvdCBvYmplY3RcbiAqIEBwYXJhbSBzaG91bGRGZXRjaENvb2tpZXMgLSBCb29sZWFuIHRvIGRldGVybWluZSB3aGV0aGVyIHRvIGZldGNoIHRoZSBsaXN0IG9mIGNvb2tpZXMgaW4gdGhlIGJhbm5lclxuICovXG5mdW5jdGlvbiBvblN1Y2Nlc3MgKGNvb2tpZUNvbnNlbnQ6IElDb29raWVDb25zZW50LCBzaG91bGRGZXRjaENvb2tpZXM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgY29uc3QgbG9nQ29uc2VudEpzb25VcmwgPSBjb29raWVDb25zZW50Lmhvc3QgKyBjb29raWVDb25zZW50LnNlcmlhbCArICcvJyArIGNvb2tpZUNvbnNlbnQuZG9tYWluICsgJy9jb29raWVzLmpzb24nO1xuXG4gIGlmIChzaG91bGRGZXRjaENvb2tpZXMpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgZmV0Y2hKc29uRGF0YShsb2dDb25zZW50SnNvblVybCwgZnVuY3Rpb24oZGF0YTogSUxvZ0NvbnNlbnRDb29raWVMaXN0KSB7XG4gICAgICBjb25zdCBhZHZlcnRpc2luZ0Nvb2tpZXNMaXN0ID0gZGF0YS5BZHZlcnRpc2luZ0Nvb2tpZXMubWFwKChjb29raWU6IElMb2dDb25zZW50Q29va2llKSA9PiBnZXRDb29raWVMaXN0RnJvbU9iamVjdChjb29raWUpKTtcbiAgICAgIGNvbnN0IHByZWZlcmVuY2VDb29raWVzTGlzdCA9IGRhdGEuUHJlZmVyZW5jZUNvb2tpZXMubWFwKChjb29raWU6IElMb2dDb25zZW50Q29va2llKSA9PiBnZXRDb29raWVMaXN0RnJvbU9iamVjdChjb29raWUpKTtcbiAgICAgIGNvbnN0IHN0YXRpc3RpY3NDb29raWVzTGlzdCA9IGRhdGEuU3RhdGlzdGljQ29va2llcy5tYXAoKGNvb2tpZTogSUxvZ0NvbnNlbnRDb29raWUpID0+IGdldENvb2tpZUxpc3RGcm9tT2JqZWN0KGNvb2tpZSkpO1xuICAgICAgY29uc3QgdW5jbGFzc2lmaWVkQ29va2llc0xpc3QgPSBkYXRhLlVuY2xhc3NpZmllZENvb2tpZXMubWFwKChjb29raWU6IElMb2dDb25zZW50Q29va2llKSA9PiBnZXRDb29raWVMaXN0RnJvbU9iamVjdChjb29raWUpKTtcblxuICAgICAgY29va2llQ29uc2VudC5jb29raWVMaXN0ID0ge1xuICAgICAgICAuLi5jb29raWVDb25zZW50LmNvb2tpZUxpc3QsXG4gICAgICAgIGNvb2tpZVRhYmxlQWR2ZXJ0aXNpbmc6IGFkdmVydGlzaW5nQ29va2llc0xpc3QsXG4gICAgICAgIGNvb2tpZVRhYmxlUHJlZmVyZW5jZTogcHJlZmVyZW5jZUNvb2tpZXNMaXN0LFxuICAgICAgICBjb29raWVUYWJsZVN0YXRpc3RpY3M6IHN0YXRpc3RpY3NDb29raWVzTGlzdCxcbiAgICAgICAgY29va2llVGFibGVVbmNsYXNzaWZpZWQ6IHVuY2xhc3NpZmllZENvb2tpZXNMaXN0XG4gICAgICB9O1xuXG4gICAgICBjb29raWVDb25zZW50LmluaXQoKTtcbiAgICAgIGNvb2tpZUNvbnNlbnQucmVzZXRDb29raWVzKCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29va2llQ29uc2VudC5pbml0KCk7XG4gICAgY29va2llQ29uc2VudC5yZXNldENvb2tpZXMoKTtcbiAgfVxuXG4gIGluamVjdFR3aXBsYShjb29raWVDb25zZW50KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gY29va2llQ29uc2VudCAtIENvb2tpZUNvbnNlbnQgLyBDb29raWVib3Qgb2JqZWN0XG4gKiBAcGFyYW0gY29uc2VudFVSTCAtIENvbnNlbnQgVVJMIHRvIGZldGNoXG4gKiBAcGFyYW0gYXN5bmNMb2FkIC0gQm9vbGVhbiB0byBkZXRlcm1pbmUgd2hldGhlciBnZXRTY3JpcHQgc2hvdWxkIHNldCB0aGUgY29uc2VudFVSTCBhcyBhc3luY1xuICogQHBhcmFtIHNob3VsZEZldGNoQ29va2llcyAtIEJvb2xlYW4gdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdG8gZmV0Y2ggdGhlIGxpc3Qgb2YgY29va2llcyBpbiB0aGUgYmFubmVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2dDb25zZW50IChjb29raWVDb25zZW50OiBJQ29va2llQ29uc2VudCwgY29uc2VudFVSTDogc3RyaW5nLCBhc3luY0xvYWQ6IGJvb2xlYW4sIHNob3VsZEZldGNoQ29va2llczogYm9vbGVhbik6IHZvaWQge1xuICBjb25zdCB0cnVuY2F0ZWRMb2dDb25zZW50VXJsID0gZ2V0VHJ1bmNhdGVkU3RyaW5nKGNvbnNlbnRVUkwsIDQwOTYpO1xuXG4gIHdpbmRvdy5Db29raWVDb25zZW50LmdldFNjcmlwdCh0cnVuY2F0ZWRMb2dDb25zZW50VXJsLCBhc3luY0xvYWQsIGZ1bmN0aW9uKCkge1xuICAgIG9uU3VjY2Vzcyhjb29raWVDb25zZW50LCBzaG91bGRGZXRjaENvb2tpZXMpO1xuICB9KTtcbn1cbiIsImltcG9ydCB7IERBVEFfRElTUExBWV9OT05FLCBISURERU5fSUZSQU1FX0NMQVNTLCBPRkZTQ1JFRU5fSUZSQU1FX0NMQVNTLCBhcHBseVJ1bnRpbWVTdHlsZXNoZWV0IH0gZnJvbSAnQC9iYW5uZXIvcnVudGltZVN0eWxlcyc7XG5pbXBvcnQgeyBhZGRVc3BhcGlMb2NhdG9yRnJhbWUsIGhhbmRsZVVzcGFwaU1lc3NhZ2UsIHVzcGFwaSB9IGZyb20gJy4vdXNwYXBpJztcbmltcG9ydCB7IGFwcGx5QWNzLCBzZXRBY3MgfSBmcm9tICcuL2Fjcy9hY3MnO1xuaW1wb3J0IHsgYXBwbHlOb25jZSwgY3JlYXRlVGltZW91dFByb21pc2UsIGdldERvbWFpblNlYXJjaFBhcmFtLCBsb2FkSW5saW5lQ29uZmlndXJhdGlvbiwgcmVzb2x2ZWRQcm9taXNlLCBzYW5pdGl6ZU5vbmNlIH0gZnJvbSAnQC91dGlsaXRpZXMnO1xuaW1wb3J0IHtcbiAgICBjbG9uZVNjcmlwdFRhZyxcbiAgICBkZXF1ZXVlTm9uQXN5bmNTY3JpcHRzLFxuICAgIGdldFRhZ0Nvb2tpZUNhdGVnb3JpZXMsXG4gICAgaW5pdE11dGF0aW9uT2JzZXJ2ZXIsXG4gICAgbXV0YXRpb25IYW5kbGVyLFxuICAgIG92ZXJyaWRlRXZlbnRMaXN0ZW5lcnMsXG4gICAgcG9zdHBvbmVNdXRhdGlvbixcbiAgICBwcm9jZXNzTXV0YXRpb24sXG4gICAgcHJvY2Vzc1Bvc3RQb25lZE11dGF0aW9ucyxcbiAgICBydW5TY3JpcHRUYWdzLFxuICAgIHN0b3BNdXRhdGlvbk9ic2VydmVyLFxuICAgIHN0b3BPdmVycmlkZUV2ZW50TGlzdGVuZXJzLFxuICAgIHRhZ0hhc2hcbn0gZnJvbSAnQC9hdXRvYmxvY2tlcic7XG5pbXBvcnQgeyBmZXRjaEpzb25EYXRhLCBsb2FkU2V0dGluZ3MgfSBmcm9tICdAL3JlcXVlc3RzJztcbmltcG9ydCB7IGdldEdhY21Db25zZW50U3RyaW5nLCBnZXRUY2ZDb25zZW50U3RyaW5nIH0gZnJvbSAnLi9jb25zZW50cy90Y2YvY29uc2VudFN0cmluZyc7XG5pbXBvcnQgeyBnZXRIb3N0bmFtZUZyb21VUkwsIGdldFRydW5jYXRlZFN0cmluZywgaGFzaENvZGUsIGlzQ29va2llYm90Tm9kZSwgcmVzb2x2ZVVSTCB9IGZyb20gJy4vdXRpbGl0aWVzJztcblxuaW1wb3J0IFByb21pc2VQb255ZmlsbCBmcm9tICdwcm9taXNlLXBvbHlmaWxsJztcbmltcG9ydCB7IGNvb2tpZUNhdGVnb3JpZXNGcm9tTnVtYmVyQXJyYXkgfSBmcm9tICdAL2NvbnNlbnRzL2NvbnNlbnQnO1xuaW1wb3J0IHsgY3JlYXRlQmFubmVyIH0gZnJvbSAnQC9iYW5uZXIvbG9hZGVyJztcbmltcG9ydCB7IGNyZWF0ZVdpZGdldEljb25VcmwgfSBmcm9tICdAL3dpZGdldC9yZXNvdXJjZXMnO1xuaW1wb3J0IHsgaGFzRnJhbWV3b3JrIH0gZnJvbSAnQC9jb25zZW50cy90Y2YvaGFzRnJhbWV3b3JrJztcbmltcG9ydCB7IGxvYWRJbmxpbmVUYWdDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9jb25zZW50cy9sb2FkSW5saW5lVGFnQ29uZmlndXJhdGlvbic7XG5pbXBvcnQgeyBsb2dDb25zZW50IH0gZnJvbSAnQC9jb25zZW50cy9sb2dDb25zZW50JztcblxuLy8gVXNlIG5hdGl2ZSBwcm9taXNlIHdoZW4gYXZhaWxhYmxlIG90aGVyd2lzZSB1c2UgdGhlIHBvbnlmaWxsXG52YXIgUHJvbWlzZSA9ICh0eXBlb2Ygd2luZG93LlByb21pc2UgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LlByb21pc2UudG9TdHJpbmcoKS5pbmRleE9mKFwiW25hdGl2ZSBjb2RlXVwiKSAhPT0gLTEpID8gd2luZG93LlByb21pc2UgOiBQcm9taXNlUG9ueWZpbGw7XG5cbnZhciBsYXRlc3RUY0RhdGEgPSBudWxsO1xuXG4vKiogQ0IgQ29uc2VudCBTZXJ2aWNlIENNUCBTb3VyY2UgSUQgLSBSZXF1aXJlZCBieSBNaWNyb3NvZnQgQ2xhcml0eSBDb25zZW50IEFQSSB2MiB0byBpZGVudGlmeSB0aGUgQ01QIHByb3ZpZGVyICovXG52YXIgTVNfQ0xBUklUWV9DTVBfU09VUkNFX0lEID0gMTUyO1xuXG4vL0Fsd2F5cyByZWZlciB0byB0aGUgQ29va2llYm90LW9iamVjdCBhcyBcIkNvb2tpZUNvbnNlbnRcIiBpbnRlcm5hbGx5IGluIHRoaXMgY29kZSBpZiBub3QgYXZhaWxhYmxlIGFzIFwidGhpc1wiIGR1ZSB0byBhc3luYyBjb250ZXh0LFxuLy9hcyB0aGUgSUQgXCJDb29raWVDb25zZW50XCIgd2lsbCB3b3JrIG5vIG1hdHRlciB3aGljaCBjb250ZXh0IHRoZSBjb2RlIGlzIGluIGFuZCB3aGljaCBJRCB0aGUgY3VzdG9tZXIgaXMgYXBwbHlpbmcgdG8gdGhlIENvb2tpZWJvdCBzY3JpcHQgdGFnXG5pZiAodHlwZW9mICh3aW5kb3cuQ29va2llQ29udHJvbCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgd2luZG93LkNvb2tpZUNvbnRyb2wgPSB7fTtcbn1cbndpbmRvdy5Db29raWVDb250cm9sLkNvb2tpZSA9IGZ1bmN0aW9uIChuKSB7XG4gICAgdGhpcy5Qcm9taXNlID0gUHJvbWlzZTtcbiAgICB0aGlzLm5hbWUgPSBuO1xuICAgIHRoaXMuY29uc2VudGVkID0gZmFsc2U7XG4gICAgdGhpcy5kZWNsaW5lZCA9IGZhbHNlO1xuICAgIHRoaXMuY2hhbmdlZCA9IGZhbHNlO1xuICAgIHRoaXMuaGFzUmVzcG9uc2UgPSBmYWxzZTtcbiAgICB0aGlzLmNvbnNlbnRJRCA9IFwiMFwiO1xuICAgIHRoaXMuY29uc2VudCA9IHsgc3RhbXA6ICcwJywgbmVjZXNzYXJ5OiB0cnVlLCBwcmVmZXJlbmNlczogZmFsc2UsIHN0YXRpc3RpY3M6IGZhbHNlLCBtYXJrZXRpbmc6IGZhbHNlLCBtZXRob2Q6IG51bGwgfTtcbiAgICB0aGlzLmlzT3V0c2lkZUVVID0gZmFsc2U7IC8vZGVwcmVjYXRlZCxcbiAgICAvL3VzZSBpc091dE9mUmVnaW9uIGluc3RlYWQgb2YgaXNPdXRzaWRlRVUgdG8gZGV0ZXJtaW5lIGlmIHVzZXIgaXMgd2l0aGluIGEgZ2VvLXRhcmdldC1yZWdpb24gb3IgcmVndWxhdGlvbnMuZ2RwckFwcGxpZXMgdG8gZGV0ZXJtaW5lIGlmIEdEUFIgYXBwbGllcyB0byB0aGUgdXNlcidzIGxvY2F0aW9uXG4gICAgdGhpcy5pc091dE9mUmVnaW9uID0gZmFsc2U7XG4gICAgdGhpcy5ob3N0ID0gXCJodHRwczovL2NvbnNlbnQuY29va2llYm90LmNvbS9cIjtcbiAgICB0aGlzLmRvbWFpbiA9IFwiXCI7XG4gICAgdGhpcy5jdXJyZW50UGF0aCA9IFwiL1wiO1xuICAgIHRoaXMuZG9Ob3RUcmFjayA9IGZhbHNlO1xuICAgIHRoaXMuY29uc2VudExldmVsID0gJ3N0cmljdCc7XG4gICAgdGhpcy5pc1JlbmV3YWwgPSBmYWxzZTtcbiAgICB0aGlzLmZvcmNlU2hvdyA9IGZhbHNlO1xuICAgIHRoaXMuZGlhbG9nID0gbnVsbDtcbiAgICB0aGlzLnJlc3BvbnNlTW9kZSA9IFwiXCI7XG4gICAgdGhpcy5zZXJpYWwgPSBcIlwiO1xuICAgIHRoaXMuc2NyaXB0SWQgPSBcIkNvb2tpZWJvdFwiO1xuICAgIHRoaXMuc2NyaXB0RWxlbWVudCA9IG51bGw7XG4gICAgdGhpcy53aGl0ZWxpc3QgPSBbXTtcbiAgICB0aGlzLmNvb2tpZUxpc3QgPSB7IGNvb2tpZVRhYmxlUHJlZmVyZW5jZTogW10sIGNvb2tpZVRhYmxlU3RhdGlzdGljczogW10sIGNvb2tpZVRhYmxlQWR2ZXJ0aXNpbmc6IFtdLCBjb29raWVUYWJsZVVuY2xhc3NpZmllZDogW10gfTtcbiAgICB0aGlzLnBhdGhsaXN0ID0gW107XG4gICAgdGhpcy51c2VySXNJblBhdGggPSB0cnVlO1xuICAgIHRoaXMuY29va2llRW5hYmxlZCA9IHRydWU7XG4gICAgdGhpcy52ZXJzaW9uQ2hlY2tlZCA9IGZhbHNlO1xuICAgIHRoaXMudmVyc2lvblJlcXVlc3RlZCA9IGZhbHNlO1xuICAgIHRoaXMudmVyc2lvbiA9IDE7XG4gICAgdGhpcy5sYXRlc3RWZXJzaW9uID0gMTtcbiAgICB0aGlzLmlzTmV3VmVyc2lvbiA9IGZhbHNlO1xuICAgIHRoaXMuQ0ROID0gbnVsbDtcbiAgICB0aGlzLnNvdXJjZSA9IFwiXCI7XG4gICAgdGhpcy5yZXRyeUNvdW50ZXIgPSAwO1xuICAgIHRoaXMuZnJhbWVSZXRyeUNvdW50ZXIgPSAwO1xuICAgIHRoaXMuYnVsa0NvbnNlbnRGcmFtZVJldHJ5Q291bnRlciA9IDA7XG4gICAgdGhpcy5zZXRPbmxvYWRGcmFtZVJldHJ5Q291bnRlciA9IDA7XG4gICAgdGhpcy5vcHRPdXRMaWZldGltZSA9IDEyOyAvL21vbnRocywgMD1zZXNzaW9uXG4gICAgdGhpcy5jb25zZW50TW9kZURpc2FibGVkID0gZmFsc2U7XG4gICAgdGhpcy5tc0NvbnNlbnRNb2RlRGlzYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLm1zQ2xhcml0eUNvbnNlbnRNb2RlRW5hYmxlZCA9IHRydWU7XG4gICAgdGhpcy5hbXpuQ29uc2VudFNpZ25hbEVuYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmFkdmVydGlzZXJDb25zZW50TW9kZUVuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuY29uc2VudE1vZGVEYXRhUmVkYWN0aW9uID0gXCJkeW5hbWljXCI7XG4gICAgdGhpcy5jb25zZW50TGlmZXRpbWUgPSBudWxsOyAvL21vbnRoc1xuICAgIHRoaXMuZnJhbWV3b3JrID0gXCJcIjtcbiAgICB0aGlzLmhhc0ZyYW1ld29yayA9IGZhbHNlO1xuICAgIHRoaXMuZnJhbWV3b3JrQmxvY2tlZCA9IGZhbHNlO1xuICAgIHRoaXMuZnJhbWV3b3JrTG9hZGVkID0gZmFsc2U7XG4gICAgdGhpcy5pZnJhbWVSZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMuaWZyYW1lID0gbnVsbDtcbiAgICB0aGlzLmJ1bGtjb25zZW50ID0gbnVsbDtcbiAgICB0aGlzLmJ1bGtyZXNldGRvbWFpbnMgPSBbXTtcbiAgICB0aGlzLmJ1bGtjb25zZW50c3VibWl0dGVkID0gZmFsc2U7XG4gICAgdGhpcy5pc2J1bGtyZW5ld2FsID0gZmFsc2U7XG4gICAgdGhpcy5oYW5kbGVDY3BhT3B0aW5JbkZyb250ZW5kID0gZmFsc2U7XG4gICAgdGhpcy53aXBlID0geyBwcmVmZXJlbmNlczogdHJ1ZSwgc3RhdGlzdGljczogdHJ1ZSwgbWFya2V0aW5nOiB0cnVlIH07XG4gICAgdGhpcy5jb25zZW50VVRDID0gbnVsbDtcbiAgICB0aGlzLklBQkNvbnNlbnRTdHJpbmcgPSBcIlwiO1xuICAgIHRoaXMuR0FDTUNvbnNlbnRTdHJpbmcgPSBcIlwiOyAvL0dvb2dsZSBUQ0YgMiBBZGRpdGlvbmFsIENvbnNlbnQgTW9kZSAoR0FDTSkgLSBodHRwczovL3N1cHBvcnQuZ29vZ2xlLmNvbS9hZG1hbmFnZXIvYW5zd2VyLzk2ODE5MjBcbiAgICB0aGlzLmRhdGFMYXllck5hbWUgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBpc0NvbnRhaW5lcihuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gISF3aW5kb3cuZ29vZ2xlX3RhZ19tYW5hZ2VyW25hbWVdLmRhdGFMYXllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjb250YWluZXJOYW1lID0gd2luZG93Lmdvb2dsZV90YWdfbWFuYWdlclxuICAgICAgICAgICAgPyBPYmplY3Qua2V5cyh3aW5kb3cuZ29vZ2xlX3RhZ19tYW5hZ2VyKS5maWx0ZXIoaXNDb250YWluZXIpWzBdXG4gICAgICAgICAgICA6IG51bGw7IC8vIEdUTSB1bmF2YWlsYWJsZVxuXG4gICAgICAgIHJldHVybiBjb250YWluZXJOYW1lXG4gICAgICAgICAgICA/IHdpbmRvdy5nb29nbGVfdGFnX21hbmFnZXJbY29udGFpbmVyTmFtZV0uZGF0YUxheWVyLm5hbWVcbiAgICAgICAgICAgIDogXCJkYXRhTGF5ZXJcIjsgLy8gR1RNIGRhdGEtbGF5ZXIgaXMgdW5hdmFpbGFibGUgKG9yIG1heWJlIGxvYWRlZCBhZnRlciBDb29raWVib3QpXG4gICAgfSkoKTtcbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuYXV0b2Jsb2NrID0gZmFsc2U7XG4gICAgdGhpcy5tdXRhdGlvbk9ic2VydmVyID0gbnVsbDtcbiAgICB0aGlzLm11dGF0aW9uQ291bnRlciA9IDA7XG4gICAgdGhpcy5tdXRhdGlvbkZhbGxiYWNrID0gZmFsc2U7XG4gICAgdGhpcy5tdXRhdGlvbkZhbGxiYWNrRG9jQXR0cmlidXRlcyA9IFtdO1xuICAgIHRoaXMubXV0YXRpb25IYW5kbGVyRmFsbGJhY2tDaGFyc2V0TG9hZGVkID0gZmFsc2U7XG4gICAgdGhpcy5tdXRhdGlvbkFwcE5hbWUgPSBcIlwiO1xuICAgIHRoaXMubXV0YXRpb25FdmVudExpc3RlbmVycyA9IFtdO1xuICAgIHRoaXMubXV0YXRpb25PbmxvYWRFdmVudExpc3RlbmVycyA9IFtdO1xuICAgIHRoaXMubXV0YXRlRXZlbnRMaXN0ZW5lcnMgPSBmYWxzZTtcbiAgICB0aGlzLm11dGF0aW9uSGFuZGxlckZpcnN0U2NyaXB0ID0gbnVsbDtcbiAgICB0aGlzLnBvc3RQb25lZE11dGF0aW9ucyA9IFtdO1xuICAgIHRoaXMubm9uQXN5bmNNdXRhdGlvbnMgPSBbXTtcbiAgICB0aGlzLmRlZmVyTXV0YXRpb25zID0gW107XG4gICAgdGhpcy5nZW9SZWdpb25zID0gW107XG4gICAgdGhpcy51c2VyQ291bnRyeSA9IFwiXCI7XG4gICAgdGhpcy51c2VyQ3VsdHVyZSA9IFwiXCI7XG4gICAgdGhpcy51c2VyQ3VsdHVyZU92ZXJyaWRlID0gbnVsbDtcbiAgICB0aGlzLndpbmRvd09ubG9hZFRyaWdnZXJlZCA9IGZhbHNlO1xuICAgIHRoaXMuYm90RGV0ZWN0aW9uRGlzYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLnJlZ3VsYXRpb25zID0ge1xuICAgICAgICBnZHByQXBwbGllczogdHJ1ZSxcbiAgICAgICAgY2NwYUFwcGxpZXM6IHRydWUsXG4gICAgICAgIGxncGRBcHBsaWVzOiB0cnVlXG4gICAgfTtcbiAgICB0aGlzLnJlZ3VsYXRpb25SZWdpb25zID0ge1xuICAgICAgICBnZHByOiBbIC8vRVUgbWVtYmVyIHN0YXRlcyArICBFRlRBIFN0YXRlcyBMaWVjaHRlbnN0ZWluLCBOb3J3YXkgYW5kIEljZWxhbmRcbiAgICAgICAgICAgIFwiYXRcIiwgXCJiZVwiLCBcImJnXCIsIFwiY3lcIiwgXCJjelwiLCBcImRlXCIsIFwiZGtcIixcbiAgICAgICAgICAgIFwiZXNcIiwgXCJlZVwiLCBcImZpXCIsIFwiZnJcIiwgXCJnYlwiLCBcImdyXCIsIFwiaHJcIixcbiAgICAgICAgICAgIFwiaHVcIiwgXCJpZVwiLCBcIml0XCIsIFwibHRcIiwgXCJsdVwiLCBcImx2XCIsIFwibXRcIixcbiAgICAgICAgICAgIFwibmxcIiwgXCJwbFwiLCBcInB0XCIsIFwicm9cIiwgXCJza1wiLCBcInNpXCIsIFwic2VcIixcbiAgICAgICAgICAgIFwibGlcIiwgXCJub1wiLCBcImlzXCJcbiAgICAgICAgXSxcbiAgICAgICAgY2NwYTogW1widXMtMDZcIl0sIC8vVVMgU3RhdGUgb2YgQ2FsaWZvcm5pYVxuICAgICAgICBsZ3BkOiBbXCJiclwiXSAvL0JyYXppbFxuICAgIH1cbiAgICAvL2dldCB0b3AgNTAgZnJvbSBEQjpcbiAgICAvL3NlbGVjdCB0b3AoNTApIENvb2tpZVByb3ZpZGVyRG9tYWluLCBNQVgoQ29va2llQ2F0ZWdvcnkpIGFzIGNhdCwgQ09VTlQoKikgYXMgYW50YWwgZnJvbSBDb29raWVzIHdoZXJlIENvb2tpZUlzVGhpcmRQYXJ0eT0xIGFuZCBDb29raWVDYXRlZ29yeT4xXG4gICAgLy9hbmQgQ29va2llUHJvdmlkZXJEb21haW48Pidjb29raWVib3QuY29tJyBhbmQgQ29va2llQ3Jhd2xEYXRlPkRBVEVBREQobSwtMSxHRVRVVENEQVRFKCkpIGdyb3VwIGJ5IENvb2tpZVByb3ZpZGVyRG9tYWluIG9yZGVyIGJ5IGFudGFsIGRlc2NcbiAgICB0aGlzLmNvbW1vblRyYWNrZXJzID0ge1xuICAgICAgICBkb21haW5zOiBbXG4gICAgICAgICAgICB7IGQ6IFwiZ29vZ2xlLWFuYWx5dGljcy5jb21cIiwgYzogWzNdIH0sXG4gICAgICAgICAgICB7IGQ6IFwieW91dHViZS5jb21cIiwgYzogWzRdIH0sXG4gICAgICAgICAgICB7IGQ6IFwieW91dHViZS1ub2Nvb2tpZS5jb21cIiwgYzogWzRdIH0sXG4gICAgICAgICAgICB7IGQ6IFwiZ29vZ2xlYWRzZXJ2aWNlcy5jb21cIiwgYzogWzRdIH0sXG4gICAgICAgICAgICB7IGQ6IFwiZ29vZ2xlc3luZGljYXRpb24uY29tXCIsIGM6IFs0XSB9LFxuICAgICAgICAgICAgeyBkOiBcImRvdWJsZWNsaWNrLm5ldFwiLCBjOiBbNF0gfSxcbiAgICAgICAgICAgIHsgZDogXCJmYWNlYm9vay4qXCIsIGM6IFs0XSB9LFxuICAgICAgICAgICAgeyBkOiBcImxpbmtlZGluLmNvbVwiLCBjOiBbNF0gfSxcbiAgICAgICAgICAgIHsgZDogXCJ0d2l0dGVyLmNvbVwiLCBjOiBbNF0gfSxcbiAgICAgICAgICAgIHsgZDogXCJhZGR0aGlzLmNvbVwiLCBjOiBbNF0gfSxcbiAgICAgICAgICAgIHsgZDogXCJiaW5nLmNvbVwiLCBjOiBbNF0gfSxcbiAgICAgICAgICAgIHsgZDogXCJzaGFyZXRoaXMuY29tXCIsIGM6IFs0XSB9LFxuICAgICAgICAgICAgeyBkOiBcInlhaG9vLmNvbVwiLCBjOiBbNF0gfSxcbiAgICAgICAgICAgIHsgZDogXCJhZGR0b2FueS5jb21cIiwgYzogWzRdIH0sXG4gICAgICAgICAgICB7IGQ6IFwiZGFpbHltb3Rpb24uY29tXCIsIGM6IFs0XSB9LFxuICAgICAgICAgICAgeyBkOiBcImFtYXpvbi1hZHN5c3RlbS5jb21cIiwgYzogWzRdIH0sXG4gICAgICAgICAgICB7IGQ6IFwic25hcC5saWNkbi5jb21cIiwgYzogWzRdIH1cbiAgICAgICAgXVxuICAgIH07XG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0geyBsb2FkZWQ6IGZhbHNlLCBsb2FkUmV0cnk6IDAsIHRhZ3M6IFtdLCB0cmFja2luZ0RvbWFpbnM6IFtdIH07XG4gICAgdGhpcy5pbmxpbmVDb25maWd1cmF0aW9uID0gbnVsbDtcbiAgICB0aGlzLndpZGdldCA9IG51bGw7XG4gICAgdGhpcy50d2lwbGEgPSBudWxsO1xuICAgIHRoaXMuc2V0dGluZ3NMb2FkZWQgPSBmYWxzZTtcbiAgICB0aGlzLmJ1bGtDb25zZW50RW5hYmxlZCA9IHRydWU7XG4gICAgdGhpcy5jb21wdXRlZENvbmZpZ3VyYXRpb24gPSB7XG4gICAgICAgIGJsb2NraW5nbW9kZTogJ21hbnVhbCcsXG4gICAgICAgIHVzZUJ1bm55OiBmYWxzZSxcbiAgICAgICAgbXNDb25zZW50TW9kZUVuYWJsZWQ6IHRydWUsXG4gICAgICAgIG1zQ2xhcml0eUNvbnNlbnRNb2RlRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYW16bkNvbnNlbnRTaWduYWxFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgZnJhbWV3b3JrOiBudWxsLFxuICAgICAgICB3aWRnZXRFbmFibGVkOiBudWxsLFxuICAgICAgICBpc1R3aXBsYURvbWFpbjogZmFsc2VcbiAgICB9O1xuXG4gICAgdmFyIGFzc3VtZWRDb29raWVib3RTY3JpcHQgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0O1xuXG4gICAgLyoqXG4gICAgICogT2JqZWN0LmFzc2lnbigpIHBvbnlmaWxsIGZvciBJRTExXG4gICAgICogQHNlZSA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnbj5cbiAgICAgKi9cbiAgICB0aGlzLiRhc3NpZ24gPSB0eXBlb2YgT2JqZWN0LmFzc2lnbiA9PSBcImZ1bmN0aW9uXCIgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgdmFyQXJncykge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgaWYgKHRhcmdldCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0XCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgICBmb3IgKHZhciBpbmRleCA9IDE7IGluZGV4IDwgYXJndW1lbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKG5leHRTb3VyY2UgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIG5leHRLZXkgaW4gbmV4dFNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG5leHRTb3VyY2UsIG5leHRLZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAvL2NoZWNrIGlmIHBlcnNpc3RhbnQgY29va2llcyBhcmUgZW5hYmxlZCBvbiB1c2VycyBicm93c2VyIC0gbmF2aWdhdG9yLmNvb2tpZUVuYWJsZWQgTk9UIHJlbGlhYmxlLCBpZS4gb24gSW50ZXJuZXQgRXhwbG9yZXJcblxuICAgICAgICBpZiAoXCJjb29raWVcIiBpbiBkb2N1bWVudCkge1xuICAgICAgICAgICAgdmFyIHRlc3Rjb29raWUgPSB0aGlzLmdldENvb2tpZSh0aGlzLm5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoIXRlc3Rjb29raWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VjdXJlQXR0cmlidXRlID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sID09PSBcImh0dHBzOlwiID8gXCI7c2VjdXJlXCIgOiBcIlwiO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IHRoaXMubmFtZSArIFwiPS0zO2V4cGlyZXM9VGh1LCAwMSBKYW4gMjA2MCAwMDowMDowMCBHTVRcIiArIHNlY3VyZUF0dHJpYnV0ZTtcblxuICAgICAgICAgICAgICAgIHRoaXMuY29va2llRW5hYmxlZCA9IChkb2N1bWVudC5jb29raWUuaW5kZXhPZi5jYWxsKGRvY3VtZW50LmNvb2tpZSwgdGhpcy5uYW1lKSA+IC0xKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb29raWVFbmFibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vcmVtb3ZlIHRlbXAgdGVzdC1jb29raWVcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gdGhpcy5uYW1lICsgXCI9LTM7ZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIEdNVFwiICsgc2VjdXJlQXR0cmlidXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29va2llRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmNvb2tpZUVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaXNPdXRzaWRlRVUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaXNPdXRPZlJlZ2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5oYXNSZXNwb25zZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmRlY2xpbmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuY29uc2VudGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNvbnNlbnQucHJlZmVyZW5jZXMgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY29uc2VudC5zdGF0aXN0aWNzID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNvbnNlbnQubWFya2V0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNvbnNlbnRJRCA9IFwiLTNcIjsgLy9jb29raWVzIGlzIG5vdCBlbmFibGVkIG9uIGNsaWVudFxuICAgICAgICAgICAgdGhpcy5jb25zZW50LnN0YW1wID0gXCItM1wiO1xuICAgICAgICAgICAgdGhpcy5jb25zZW50Lm1ldGhvZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvL2NvcHkgb3JpZ2luYWwgY3JlYXRlRWxlbWVudCBmdW5jdGlvbiBiZWZvcmUgaXQgaXMgb3ZlcnJpZGRlbiBieSBvdGhlciBwbHVnaW5zLCBlLmcuIERpdmkgaW4gV29yZFByZXNzXG4gICAgICAgIGlmICh0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudE9yaWcgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnRPcmlnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vbWFyayBkeW5hbWljYWxseSBjcmVhdGVkIGVsZW1lbnRzIHNvIHRoYXQgdGhleSBhcmUgbm90IHByb2Nlc3NlZCBieSBNdXRhdGlvbk9ic2VydmVyLCBlLmcuIHRhZ3MgY3JlYXRlZCBmcm9tIEdvb2dsZSBUYWcgTWFuYWdlciAoR1RNKVxuICAgICAgICBkb2N1bWVudC5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24obmV3RWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gbmV3RWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuaXNDb29raWVib3REeW5hbWljVGFnID0gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0oZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIHRoYXQuc2lnbmFsV2luZG93TG9hZCwgZmFsc2UpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ01pc3NpbmdVY1JlZmVyZW5jZSgpIHtcbiAgICAgICAgICAgIHZhciBzdXBwb3J0VXJsID0gXCJodHRwczovL3d3dy5jb29raWVib3QuY29tL2VuL2hlbHAvXCI7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJDb29raWVib3Q6IENvb2tpZWJvdCB3YXMgdW5hYmxlIHRvIHJlZmVyZW5jZSB0aGUgdWMuanMgc2NyaXB0LCB3aGljaCBzaG91bGQgYmUgZGVjbGFyZWQgd2l0aCBhbiBJRCBhdHRyaWJ1dGUgc2V0IHRvICdDb29raWVib3QnLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBDb29raWVib3Qgc2V0dXAsIHNlZSAlc1wiLCBzdXBwb3J0VXJsKVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNDb29raWVib3RTY3JpcHQoc2NyaXB0KSB7XG4gICAgICAgICAgICByZXR1cm4gc2NyaXB0ICYmXG4gICAgICAgICAgICAgICAgc2NyaXB0Lmhhc0F0dHJpYnV0ZShcInNyY1wiKSAmJlxuICAgICAgICAgICAgICAgIChzY3JpcHQuaGFzQXR0cmlidXRlKFwiZGF0YS1jYmlkXCIpIHx8IChzY3JpcHQuZ2V0QXR0cmlidXRlKFwic3JjXCIpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcImNiaWQ9XCIpID4gMCkpICYmXG4gICAgICAgICAgICAgICAgKHNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJzcmNcIikudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiL3VjLmpzXCIpID4gMCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZCA9IG51bGw7XG5cbiAgICAgICAgaWYgKGlzQ29va2llYm90U2NyaXB0KGFzc3VtZWRDb29raWVib3RTY3JpcHQpKSB7XG4gICAgICAgICAgICBkID0gYXNzdW1lZENvb2tpZWJvdFNjcmlwdDtcblxuICAgICAgICAgICAgaWYgKGQuaGFzQXR0cmlidXRlKFwiaWRcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcmlwdElkID0gZC5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGQuaWQgPSB0aGlzLnNjcmlwdElkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuc2NyaXB0SWQpIHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiQ29va2llQ29uc2VudFwiKTtcblxuICAgICAgICAgICAgaWYgKGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNjcmlwdElkID0gZC5nZXRBdHRyaWJ1dGUoJ2lkJyk7IC8vIFwiQ29va2llYm90XCIgfHwgXCJDb29raWVDb25zZW50XCJcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgQ29va2llYm90IHNjcmlwdCBpcyBub3QgZm91bmQgYnkgZWl0aGVyIElELCBzZWFyY2ggdGFncyBmb3IgYSBzcmMgd2l0aCBhIGNvbWJpbmF0aW9uIG9mIFwiY2JpZFwiICsgXCIvdWMuanNcIlxuICAgICAgICAgICAgICAgIHZhciB0YWdzQWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWdzQWxsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VGFnID0gdGFnc0FsbFtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQ29va2llYm90U2NyaXB0KGN1cnJlbnRUYWcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkID0gY3VycmVudFRhZztcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IGN1c3RvbSBJRCBvciBzZXQgQ29va2llYm90IElEXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZC5oYXNBdHRyaWJ1dGUoXCJpZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2NyaXB0SWQgPSBkLmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5pZCA9IHRoaXMuc2NyaXB0SWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkKSB7XG4gICAgICAgICAgICBsb2dNaXNzaW5nVWNSZWZlcmVuY2UoKTsgLy8gQ29va2llYm90IHNjcmlwdCBub3QgZm91bmRcbiAgICAgICAgfSBlbHNlIGlmIChkICYmIGQuaGFzQXR0cmlidXRlKFwic3JjXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IGQuZ2V0QXR0cmlidXRlKFwic3JjXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJucyBhIGxpc3Qgb2YgYXZhaWxhYmxlIGxhbmd1YWdlLWN1bHR1cmVzIGZvciB0aGUgYnJvd3Nlci91c2VyXG4gICAgICAgIC8vIEV4YW1wbGUgcmV0dXJuLXZhbHVlOiBbXCJlbi1VU1wiLCBcImVuXCIsIFwiZGFcIl1cbiAgICAgICAgZnVuY3Rpb24gZ2V0VXNlckN1bHR1cmVzKCkge1xuICAgICAgICAgICAgLy8gZXZlcmdyZWVuIGJyb3dzZXJzOiAoQ2hyb21lLCBGaXJlZm94LCBTYWZhcmksIEVkZ2UpXG5cbiAgICAgICAgICAgIGlmIChuYXZpZ2F0b3IubGFuZ3VhZ2VzICYmIG5hdmlnYXRvci5sYW5ndWFnZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5hdmlnYXRvci5sYW5ndWFnZXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElFIDExOlxuICAgICAgICAgICAgcmV0dXJuIFtuYXZpZ2F0b3IubGFuZ3VhZ2VdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51c2VyQ3VsdHVyZSA9IGdldFVzZXJDdWx0dXJlcygpWzBdO1xuXG4gICAgICAgIGlmIChkKSB7XG4gICAgICAgICAgICB0aGlzLnNjcmlwdEVsZW1lbnQgPSBkO1xuICAgICAgICAgICAgdGhpcy5ob3N0ID0gXCJodHRwczovL1wiICsgZC5zcmMubWF0Y2goLzpcXC9cXC8oLlteL10rKS8pWzFdICsgXCIvXCI7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGhvc3RIYXNTdWZmaXgoaG9zdCwgc3VmZml4KSB7XG4gICAgICAgICAgICAgICAgdmFyIGZyb21JbmRleCA9IGhvc3QubGVuZ3RoIC0gc3VmZml4Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICByZXR1cm4gaG9zdC5pbmRleE9mKHN1ZmZpeCwgZnJvbUluZGV4KSAhPT0gLTE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChob3N0SGFzU3VmZml4KHRoaXMuaG9zdCwgXCJjb29raWVib3QuZXUvXCIpIHx8IChwcm9jZXNzLmVudi5FTlZJUk9OTUVOVCA9PT0gJ2RldicgJiYgaG9zdEhhc1N1ZmZpeCh0aGlzLmhvc3QsIFwiZXUuY29va2llYm90LmRldi9cIikpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5DRE4gPSBwcm9jZXNzLmVudi5DRE5fRVU7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlZENvbmZpZ3VyYXRpb24udXNlQnVubnkgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkNETiA9IHByb2Nlc3MuZW52LkNETl9DT007XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubm9uY2UgPSBzYW5pdGl6ZU5vbmNlKGQubm9uY2UpO1xuXG4gICAgICAgICAgICB2YXIgZSA9IGQuZ2V0QXR0cmlidXRlKCdkYXRhLWNiaWQnKTtcbiAgICAgICAgICAgIHZhciBleCA9IHRoaXMuZ2V0VVJMUGFyYW0oXCJjYmlkXCIpO1xuICAgICAgICAgICAgaWYgKGV4KSB7XG4gICAgICAgICAgICAgICAgZSA9IGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0dVSUQoZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXJpYWwgPSBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHAgPSBkLmdldEF0dHJpYnV0ZSgnZGF0YS1wYXRoJyk7XG4gICAgICAgICAgICBpZiAocCkge1xuICAgICAgICAgICAgICAgIHZhciBjdXN0b21kYXRhcGF0aGxpc3QgPSBwLnJlcGxhY2UoLyAvZywgJycpO1xuICAgICAgICAgICAgICAgIHRoaXMucGF0aGxpc3QgPSBjdXN0b21kYXRhcGF0aGxpc3Quc3BsaXQoJywnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHAyID0gZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtYmxvY2tpbmdtb2RlJyk7XG4gICAgICAgICAgICBpZiAocDIpIHtcbiAgICAgICAgICAgICAgICBpZiAocDIudG9Mb3dlckNhc2UoKSA9PT0gXCJhdXRvXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdXRvYmxvY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXB1dGVkQ29uZmlndXJhdGlvbi5ibG9ja2luZ21vZGUgPSBcImF1dG9cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwb2wgPSBkLmdldEF0dHJpYnV0ZSgnZGF0YS1vcHRvdXRsaWZldGltZScpO1xuICAgICAgICAgICAgaWYgKHBvbCkge1xuICAgICAgICAgICAgICAgIGlmIChwb2wgPT09IFwiMFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0T3V0TGlmZXRpbWUgPSBcIjBcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwdzEgPSBkLmdldEF0dHJpYnV0ZSgnZGF0YS13aXBlLXByZWZlcmVuY2VzJyk7XG4gICAgICAgICAgICBpZiAocHcxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHB3MS50b0xvd2VyQ2FzZSgpID09PSBcIjBcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndpcGUucHJlZmVyZW5jZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwdzIgPSBkLmdldEF0dHJpYnV0ZSgnZGF0YS13aXBlLXN0YXRpc3RpY3MnKTtcbiAgICAgICAgICAgIGlmIChwdzIpIHtcbiAgICAgICAgICAgICAgICBpZiAocHcyLnRvTG93ZXJDYXNlKCkgPT09IFwiMFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lwZS5zdGF0aXN0aWNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcHczID0gZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtd2lwZS1tYXJrZXRpbmcnKTtcbiAgICAgICAgICAgIGlmIChwdzMpIHtcbiAgICAgICAgICAgICAgICBpZiAocHczLnRvTG93ZXJDYXNlKCkgPT09IFwiMFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lwZS5tYXJrZXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwZiA9IGQuZ2V0QXR0cmlidXRlKCdkYXRhLWZyYW1ld29yaycpO1xuICAgICAgICAgICAgaWYgKHBmKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mcmFtZXdvcmsgPSBwZjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBnID0gZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZ2VvcmVnaW9ucycpO1xuICAgICAgICAgICAgaWYgKHBnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3Rlckdlb1JlZ2lvbnMocGcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdWMgPSBkLmdldEF0dHJpYnV0ZSgnZGF0YS11c2VyLWNvdW50cnknKTtcbiAgICAgICAgICAgIGlmICh1Yykge1xuICAgICAgICAgICAgICAgIHRoaXMudXNlckNvdW50cnkgPSB1YztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBjID0gZC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY3VsdHVyZScpO1xuICAgICAgICAgICAgaWYgKHBjKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VyQ3VsdHVyZSA9IHBjO1xuICAgICAgICAgICAgICAgIHRoaXMudXNlckN1bHR1cmVPdmVycmlkZSA9IHBjO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgd2UgPSBkLmdldEF0dHJpYnV0ZSgnZGF0YS13aWRnZXQtZW5hYmxlZCcpO1xuICAgICAgICAgICAgaWYgKHdlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdlID09PSBcInRydWVcIiB8fCB3ZSA9PT0gXCJmYWxzZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lkZ2V0ID0gdGhpcy53aWRnZXQgfHwge307XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2lkZ2V0LmVuYWJsZWRPdmVycmlkZSA9IHdlID09PSBcInRydWVcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvZ1dpZGdldEF0dHJpYnV0ZVdhcm5pbmcoJ2RhdGEtd2lkZ2V0LWVuYWJsZWQnLCB3ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY20gPSBkLmdldEF0dHJpYnV0ZSgnZGF0YS1jb25zZW50bW9kZScpO1xuICAgICAgICAgICAgaWYgKGNtICYmIGNtLnRvTG93ZXJDYXNlKCkgPT09ICdkaXNhYmxlZCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnRNb2RlRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuYWR2ZXJ0aXNlckNvbnNlbnRNb2RlRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlTXNDb25zZW50TW9kZSA9IGQuZ2V0QXR0cmlidXRlKCdkYXRhLW1zLWNvbnNlbnQtbW9kZScpO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZU1zQ29uc2VudE1vZGUgJiYgYXR0cmlidXRlTXNDb25zZW50TW9kZS50b0xvd2VyQ2FzZSgpID09PSAnZGlzYWJsZWQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tc0NvbnNlbnRNb2RlRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZWRDb25maWd1cmF0aW9uLm1zQ29uc2VudE1vZGVFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVNc0NsYXJpdHlDb25zZW50TW9kZSA9IGQuZ2V0QXR0cmlidXRlKCdkYXRhLW1zLWNsYXJpdHktY29uc2VudC1tb2RlJyk7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlTXNDbGFyaXR5Q29uc2VudE1vZGUgJiYgYXR0cmlidXRlTXNDbGFyaXR5Q29uc2VudE1vZGUudG9Mb3dlckNhc2UoKSA9PT0gJ2Rpc2FibGVkJykge1xuICAgICAgICAgICAgICAgIHRoaXMubXNDbGFyaXR5Q29uc2VudE1vZGVFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlZENvbmZpZ3VyYXRpb24ubXNDbGFyaXR5Q29uc2VudE1vZGVFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVBbXpuQ29uc2VudFNpZ25hbCA9IGQuZ2V0QXR0cmlidXRlKCdkYXRhLWFtYXpvbi1jb25zZW50LXNpZ25hbCcpO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZUFtem5Db25zZW50U2lnbmFsICYmIGF0dHJpYnV0ZUFtem5Db25zZW50U2lnbmFsLnRvTG93ZXJDYXNlKCkgPT09ICdlbmFibGVkJykge1xuICAgICAgICAgICAgICAgIHRoaXMuYW16bkNvbnNlbnRTaWduYWxFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXB1dGVkQ29uZmlndXJhdGlvbi5hbXpuQ29uc2VudFNpZ25hbEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlQWR2ZXJ0aXNlckNvbnNlbnQgPSBkLmdldEF0dHJpYnV0ZSgnZGF0YS1hZHZlcnRpc2VyLWNvbnNlbnQtbW9kZScpO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZUFkdmVydGlzZXJDb25zZW50ICYmIGF0dHJpYnV0ZUFkdmVydGlzZXJDb25zZW50LnRvTG93ZXJDYXNlKCkgPT09ICdkaXNhYmxlZCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkdmVydGlzZXJDb25zZW50TW9kZUVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGJjZSA9IGQuZ2V0QXR0cmlidXRlKCdkYXRhLWJ1bGtjb25zZW50bW9kZScpO1xuICAgICAgICAgICAgaWYgKGJjZSAmJiBiY2UudG9Mb3dlckNhc2UoKSA9PT0gJ2Rpc2FibGVkJykge1xuICAgICAgICAgICAgICAgIHRoaXMuYnVsa0NvbnNlbnRFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVJbXBsZW1lbnRhdGlvbiA9IGQuZ2V0QXR0cmlidXRlKCdkYXRhLWltcGxlbWVudGF0aW9uJyk7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlSW1wbGVtZW50YXRpb24pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXB1dGVkQ29uZmlndXJhdGlvbi5pbXBsZW1lbnRhdGlvbiA9IGF0dHJpYnV0ZUltcGxlbWVudGF0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY21kciA9IHRoaXMuZ2V0VVJMUGFyYW0oXCJjb25zZW50bW9kZS1kYXRhcmVkYWN0aW9uXCIpIHx8IGQuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbnNlbnRtb2RlLWRhdGFyZWRhY3Rpb24nKTtcbiAgICAgICAgICAgIGlmIChjbWRyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNtZHIgPT09ICd0cnVlJyB8fCBjbWRyID09PSAnZmFsc2UnIHx8IGNtZHIgPT09ICdkeW5hbWljJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnRNb2RlRGF0YVJlZGFjdGlvbiA9IGNtZHI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb29raWVib3Q6IENvb2tpZWJvdCBzY3JpcHQgYXR0cmlidXRlICdkYXRhLWNvbnNlbnRtb2RlLWRhdGFyZWRhY3Rpb24nIHdpdGggdmFsdWUgJyVzJyBpcyBpbnZhbGlkLiBTdXBwb3J0ZWQgdmFsdWVzIGFyZSAndHJ1ZScsICdmYWxzZScgb3IgJ2R5bmFtaWMnXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWRyXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmRhdGFMYXllck5hbWUgPSBkLmdldEF0dHJpYnV0ZSgnZGF0YS1sYXllci1uYW1lJykgfHwgdGhpcy5kYXRhTGF5ZXJOYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHB4ID0gdGhpcy5nZXRVUkxQYXJhbShcInBhdGhcIik7XG4gICAgICAgIGlmIChweCkge1xuICAgICAgICAgICAgdmFyIGN1c3RvbXBhdGhsaXN0ID0gcHgucmVwbGFjZSgvIC9nLCAnJyk7XG4gICAgICAgICAgICB0aGlzLnBhdGhsaXN0ID0gY3VzdG9tcGF0aGxpc3Quc3BsaXQoJywnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBweDIgPSB0aGlzLmdldFVSTFBhcmFtKFwiYmxvY2tpbmdtb2RlXCIpO1xuICAgICAgICBpZiAocHgyKSB7XG4gICAgICAgICAgICBpZiAocHgyLnRvTG93ZXJDYXNlKCkgPT09IFwiYXV0b1wiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdXRvYmxvY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZWRDb25maWd1cmF0aW9uLmJsb2NraW5nbW9kZSA9IFwiYXV0b1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBvbHggPSB0aGlzLmdldFVSTFBhcmFtKCdvcHRvdXRsaWZldGltZScpO1xuICAgICAgICBpZiAocG9seCkge1xuICAgICAgICAgICAgaWYgKHBvbHggPT09IFwiMFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRPdXRMaWZldGltZSA9IFwiMFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHB3eDEgPSB0aGlzLmdldFVSTFBhcmFtKCd3aXBlX3ByZWZlcmVuY2VzJyk7XG4gICAgICAgIGlmIChwd3gxKSB7XG4gICAgICAgICAgICBpZiAocHd4MS50b0xvd2VyQ2FzZSgpID09PSBcIjBcIikge1xuICAgICAgICAgICAgICAgIHRoaXMud2lwZS5wcmVmZXJlbmNlcyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHB3eDIgPSB0aGlzLmdldFVSTFBhcmFtKCd3aXBlX3N0YXRpc3RpY3MnKTtcbiAgICAgICAgaWYgKHB3eDIpIHtcbiAgICAgICAgICAgIGlmIChwd3gyLnRvTG93ZXJDYXNlKCkgPT09IFwiMFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53aXBlLnN0YXRpc3RpY3MgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwd3gzID0gdGhpcy5nZXRVUkxQYXJhbSgnd2lwZV9tYXJrZXRpbmcnKTtcbiAgICAgICAgaWYgKHB3eDMpIHtcbiAgICAgICAgICAgIGlmIChwd3gzLnRvTG93ZXJDYXNlKCkgPT09IFwiMFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53aXBlLm1hcmtldGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBmeCA9IHRoaXMuZ2V0VVJMUGFyYW0oJ2ZyYW1ld29yaycpO1xuICAgICAgICBpZiAocGZ4KSB7XG4gICAgICAgICAgICB0aGlzLmZyYW1ld29yayA9IHBmeDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwZnkgPSB0aGlzLmdldFVSTFBhcmFtKCdnZW9yZWdpb25zJyk7XG4gICAgICAgIGlmIChwZnkpIHtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJHZW9SZWdpb25zKHBmeSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcGZ6ID0gZ2V0RG9tYWluU2VhcmNoUGFyYW0oJ3VjX2NtcF9jb3VudHJ5JykgfHwgdGhpcy5nZXRVUkxQYXJhbSgndXNlcl9jb3VudHJ5Jyk7XG4gICAgICAgIGlmIChwZnopIHtcbiAgICAgICAgICAgIHRoaXMudXNlckNvdW50cnkgPSBwZno7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcHVjID0gdGhpcy5nZXRVUkxQYXJhbSgnY3VsdHVyZScpO1xuICAgICAgICBpZiAocHVjKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXJDdWx0dXJlID0gcHVjO1xuICAgICAgICAgICAgdGhpcy51c2VyQ3VsdHVyZU92ZXJyaWRlID0gcHVjO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBjbSA9IHRoaXMuZ2V0VVJMUGFyYW0oJ2NvbnNlbnRtb2RlJyk7XG4gICAgICAgIGlmIChwY20gJiYgcGNtLnRvTG93ZXJDYXNlKCkgPT09ICdkaXNhYmxlZCcpIHtcbiAgICAgICAgICAgIHRoaXMuY29uc2VudE1vZGVEaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmFkdmVydGlzZXJDb25zZW50TW9kZUVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwYXJhbU1zQ29uc2VudE1vZGUgPSB0aGlzLmdldFVSTFBhcmFtKCdtc0NvbnNlbnRNb2RlJyk7XG4gICAgICAgIGlmIChwYXJhbU1zQ29uc2VudE1vZGUgJiYgcGFyYW1Nc0NvbnNlbnRNb2RlID09PSAnZGlzYWJsZWQnKSB7XG4gICAgICAgICAgICB0aGlzLm1zQ29uc2VudE1vZGVEaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmNvbXB1dGVkQ29uZmlndXJhdGlvbi5tc0NvbnNlbnRNb2RlRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBhcmFtTXNDbGFyaXR5Q29uc2VudE1vZGUgPSB0aGlzLmdldFVSTFBhcmFtKCdtc0NsYXJpdHlDb25zZW50TW9kZScpO1xuICAgICAgICBpZiAocGFyYW1Nc0NsYXJpdHlDb25zZW50TW9kZSAmJiBwYXJhbU1zQ2xhcml0eUNvbnNlbnRNb2RlID09PSAnZGlzYWJsZWQnKSB7XG4gICAgICAgICAgICB0aGlzLm1zQ2xhcml0eUNvbnNlbnRNb2RlRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5jb21wdXRlZENvbmZpZ3VyYXRpb24ubXNDbGFyaXR5Q29uc2VudE1vZGVFbmFibGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcGFyYW1BbXpuQ29uc2VudFNpZ25hbCA9IHRoaXMuZ2V0VVJMUGFyYW0oJ2FtYXpvbkNvbnNlbnRTaWduYWwnKTtcbiAgICAgICAgaWYgKHBhcmFtQW16bkNvbnNlbnRTaWduYWwgJiYgcGFyYW1BbXpuQ29uc2VudFNpZ25hbCA9PT0gJ2VuYWJsZWQnKSB7XG4gICAgICAgICAgICB0aGlzLmFtem5Db25zZW50U2lnbmFsRW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmNvbXB1dGVkQ29uZmlndXJhdGlvbi5hbXpuQ29uc2VudFNpZ25hbEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBhcmFtQWR2ZXJ0aXNlckNvbnNlbnRNb2RlID0gdGhpcy5nZXRVUkxQYXJhbSgnYWR2ZXJ0aXNlckNvbnNlbnRNb2RlJyk7XG4gICAgICAgIGlmIChwYXJhbUFkdmVydGlzZXJDb25zZW50TW9kZSAmJiBwYXJhbUFkdmVydGlzZXJDb25zZW50TW9kZS50b0xvd2VyQ2FzZSgpID09PSAnZGlzYWJsZWQnKSB7XG4gICAgICAgICAgICB0aGlzLmFkdmVydGlzZXJDb25zZW50TW9kZUVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwYXJhbUltcGxlbWVudGF0aW9uID0gdGhpcy5nZXRVUkxQYXJhbSgnaW1wbGVtZW50YXRpb24nKTtcbiAgICAgICAgaWYgKHBhcmFtSW1wbGVtZW50YXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuY29tcHV0ZWRDb25maWd1cmF0aW9uLmltcGxlbWVudGF0aW9uID0gcGFyYW1JbXBsZW1lbnRhdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaW5pdCBDb29raWVib3Qgb2JqZWN0XG4gICAgICAgIHdpbmRvd1tcIkNvb2tpZWJvdFwiXSA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5kb21haW4gPSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKHRoaXMuZG9tYWluLmluZGV4T2YoXCJ3d3cuXCIpID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmRvbWFpbiA9IHRoaXMuZG9tYWluLnN1YnN0cmluZyg0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIERvbWFpbiBQYXJhbXMgLS0gVXNlZCBieSBHb29nbGUgQm90cyB0byBzaG93IHRoZSBiYW5uZXIgdG8gZGV0ZWN0IENXVnNcbiAgICAgICAgdmFyIGdEaXNhYmxlQm90RGV0ZWN0aW9uID0gdGhpcy5nZXREb21haW5VcmxQYXJhbSgnZ19kaXNhYmxlX2JvdF9kZXRlY3Rpb24nKTtcbiAgICAgICAgaWYgKGdEaXNhYmxlQm90RGV0ZWN0aW9uICYmIGdEaXNhYmxlQm90RGV0ZWN0aW9uID09PSBcIjFcIikge1xuICAgICAgICAgICAgdGhpcy5ib3REZXRlY3Rpb25EaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIEZvcmNlIFRDRiB2Mi4zIGZvciBhbGwgVENGIGN1c3RvbWVyc1xuICAgICAgICB2YXIgbG93ZXJjYXNlRnJhbWV3b3JrID0gdGhpcy5mcmFtZXdvcmsudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKGxvd2VyY2FzZUZyYW1ld29yayA9PT0gXCJpYWJcIiB8fCBsb3dlcmNhc2VGcmFtZXdvcmsgPT09IFwiaWFiMVwiIHx8IGxvd2VyY2FzZUZyYW1ld29yayA9PT0gXCJpYWJ2MlwiIHx8IGxvd2VyY2FzZUZyYW1ld29yayA9PT0gXCJ0Y2Z2Mi4yXCIgfHwgbG93ZXJjYXNlRnJhbWV3b3JrID09PSBcInRjZnYyLjNcIikge1xuICAgICAgICAgIHRoaXMuaGFzRnJhbWV3b3JrID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmZyYW1ld29yayA9IFwiVENGdjIuM1wiO1xuICAgICAgICAgIHRoaXMuYW16bkNvbnNlbnRTaWduYWxFbmFibGVkID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5jb21wdXRlZENvbmZpZ3VyYXRpb24uZnJhbWV3b3JrID0gJ1RDRic7XG4gICAgICAgICAgdGhpcy5jb21wdXRlZENvbmZpZ3VyYXRpb24uYW16bkNvbnNlbnRTaWduYWxFbmFibGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5mcmFtZXdvcmtCbG9ja2VkKSB7XG4gICAgICAgICAgICB0aGlzLmhhc0ZyYW1ld29yayA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5mcmFtZXdvcmsgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy5jb21wdXRlZENvbmZpZ3VyYXRpb24uZnJhbWV3b3JrID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWRJbmxpbmVDb25maWd1cmF0aW9uKHRoaXMpO1xuXG4gICAgICAgIGlmICh0aGlzLmZyYW1ld29yayA9PT0gXCJUQ0Z2Mi4zXCIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5wcm9wYWdhdGVJQUJTdHViKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuY29uc2VudE1vZGVEaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5wdXNoR29vZ2xlQ29uc2VudCgnc2V0JywgJ2RldmVsb3Blcl9pZC5kTVdaaE56JywgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzRnJhbWV3b3JrKHRoaXMpKSB7XG4gICAgICAgICAgICB3aW5kb3cuX190Y2ZhcGkoJ2FkZEV2ZW50TGlzdGVuZXInLCAyLCAodGNEYXRhLCBzdWNjZXNzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgbGF0ZXN0VGNEYXRhID0gdGNEYXRhO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYW16bkNvbnNlbnRTaWduYWxFbmFibGVkKSB7XG4gICAgICAgICAgICBzZXRBY3MoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vcmVtb3ZlIGFueSBlbXB0eSBlbnRyaWVzIGZyb20gcGF0aGxpc3QsIHNpbmNlIHNwbGl0IG9uIGFuIGVtcHR5IHN0cmluZyB3aWxsIHJldHVybiAxIGVtcHR5IGl0ZW0gaW4gYXJyYXlcbiAgICAgICAgdmFyIHRlbXBwYXRobGlzdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMucGF0aGxpc3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50cGF0aCA9IHRoaXMucGF0aGxpc3Rbal07XG4gICAgICAgICAgICBpZiAoY3VycmVudHBhdGggIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudHBhdGguaW5kZXhPZihcIi9cIikgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudHBhdGggPSBcIi9cIiArIGN1cnJlbnRwYXRoO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRlbXBwYXRobGlzdC5wdXNoKGRlY29kZVVSSUNvbXBvbmVudChjdXJyZW50cGF0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucGF0aGxpc3QgPSB0ZW1wcGF0aGxpc3Q7XG5cbiAgICAgICAgaWYgKHRoaXMucGF0aGxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy51c2VySXNJblBhdGggPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciB1c2VyQ3VycmVudFBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgICAgICAgICBpZiAodXNlckN1cnJlbnRQYXRoICE9PSBcIi9cIikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5wYXRobGlzdC5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodXNlckN1cnJlbnRQYXRoLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnBhdGhsaXN0W2tdLnRvTG93ZXJDYXNlKCkpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gdGhpcy5wYXRobGlzdFtrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXNlcklzSW5QYXRoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLnVzZXJJc0luUGF0aCkge1xuICAgICAgICAgICAgICAgIC8vZG8gbm90aGluZyBidXQgc2ltdWxhdGUgYSBmdWxsIGNvbnNlbnQgaWYgYSBwYXRoIGlzIGRlZmluZWQgYnV0IHVzZXIgaXMgbm90IGN1cnJlbnRseSBvbiBhIHVybCB3aXRoaW4gYSBwYXRoXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zZW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjbGluZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc1Jlc3BvbnNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnQucHJlZmVyZW5jZXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5zdGF0aXN0aWNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnQubWFya2V0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnQubWV0aG9kID0gJ2ltcGxpZWQnO1xuICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudExldmVsID0gJ2ltcGxpZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudXNlcklzSW5QYXRoKSB7XG4gICAgICAgICAgICB2YXIgYyA9IHRoaXMuZ2V0Q29va2llKHRoaXMubmFtZSk7XG5cbiAgICAgICAgICAgIC8vY2hlY2sgaWYgY29va2llIGFscmVhZHkgZXhpc3RzXG4gICAgICAgICAgICBpZiAoYykge1xuICAgICAgICAgICAgICAgIGlmIChjID09PSBcIi0yXCIpIHsgIC8vc2Vjb25kIGxvYWQgYWZ0ZXIgZmlyc3Qgc2hvdyBvZiBkaWFsb2cgPSBpbXBsaWVkIGNvbnNlbnQgaGFzIGJlZW4gZ2l2ZW5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWNsaW5lZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1Jlc3BvbnNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5wcmVmZXJlbmNlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnQuc3RhdGlzdGljcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnQubWFya2V0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5tZXRob2QgPSAnaW1wbGllZCc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudExldmVsID0gJ2ltcGxpZWQnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGMgPT09IFwiMFwiKSB7ICAvL2RlY2xpbmVkIC0gZGVwcmVjYXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWNsaW5lZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnQucHJlZmVyZW5jZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5zdGF0aXN0aWNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnQubWFya2V0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnQubWV0aG9kID0gJ2ltcGxpZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNwb25zZU1vZGUgPSBcImxldmVsb3B0aW5cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzUmVzcG9uc2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWNsaW5lZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25zZW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25zZW50LnByZWZlcmVuY2VzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5zdGF0aXN0aWNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5tYXJrZXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25zZW50Lm1ldGhvZCA9IHRoaXMuY29uc2VudC5tZXRob2QgfHwgJ2ltcGxpZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGMgPT09IFwiLTFcIikgeyAvL3RoZW4gdGhlIHVzZXIgaXMgb3V0IG9mIHJlZ2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNPdXRzaWRlRVUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaXNPdXRPZlJlZ2lvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJzaW9uID0gdGhpcy5sYXRlc3RWZXJzaW9uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWZyYW1lUmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudFVUQyA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVSZWd1bGF0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzUmVzcG9uc2UgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICgoYyAhPT0gXCItMVwiKSAmJiAoIXRoaXMuaWZyYW1lUmVhZHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2xvYWQgYnVsayBjb25zZW50IHN0YXRlIGluIGlmcmFtZSB0byBjaGVjayB3aGV0aGVyIHJlc2V0IG9mIGN1cnJlbnQgY29uc2VudCBpcyBuZWVkZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1bGtDb25zZW50RW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWZyYW1lUmVhZHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRDRE5pRnJhbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWZyYW1lUmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKChjLmluZGV4T2YoXCJ7XCIpID09PSAwKSAmJiAoYy5pbmRleE9mKFwifVwiKSA+IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb25zZW50SlNPTiA9IGMucmVwbGFjZSgvJTJjL2csICcsJykucmVwbGFjZSgvJy9nLCAnXCInKS5yZXBsYWNlKC8oW3tcXFssXSlcXHMqKFthLXpBLVowLTlfXSs/KTovZywgJyQxXCIkMlwiOicpOyAvL2NvbnZlcnQgdG8gSlNPTlxuICAgICAgICAgICAgICAgICAgICB2YXIgY29uc2VudE9iamVjdCA9IEpTT04ucGFyc2UoY29uc2VudEpTT04pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnRJRCA9IGNvbnNlbnRPYmplY3Quc3RhbXA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5zdGFtcCA9IGNvbnNlbnRPYmplY3Quc3RhbXA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5wcmVmZXJlbmNlcyA9IGNvbnNlbnRPYmplY3QucHJlZmVyZW5jZXM7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5zdGF0aXN0aWNzID0gY29uc2VudE9iamVjdC5zdGF0aXN0aWNzO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnQubWFya2V0aW5nID0gY29uc2VudE9iamVjdC5tYXJrZXRpbmc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5tZXRob2QgPSBjb25zZW50T2JqZWN0Lm1ldGhvZCB8fCB0aGlzLmNvbnNlbnQubWV0aG9kIHx8ICdpbXBsaWVkJztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc091dHNpZGVFVSA9IHRoaXMuY29uc2VudC5zdGFtcCA9PT0gXCItMVwiO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzT3V0T2ZSZWdpb24gPSB0aGlzLmNvbnNlbnQuc3RhbXAgPT09IFwiLTFcIjtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoKCF0aGlzLmNvbnNlbnQucHJlZmVyZW5jZXMpICYmICghdGhpcy5jb25zZW50LnN0YXRpc3RpY3MpICYmICghdGhpcy5jb25zZW50Lm1hcmtldGluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVjbGluZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25zZW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzcG9uc2VNb2RlID0gXCJsZXZlbG9wdGluXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChjb25zZW50T2JqZWN0LnV0YykgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudFVUQyA9IG5ldyBEYXRlKGNvbnNlbnRPYmplY3QudXRjKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIFRoaXMgY29kZSBpcyBuZWVkZWQgdW50aWwgYWxsIElBQnYxIGNvbnNlbnRzIGhhdmUgZXhwaXJlZFxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIChjb25zZW50T2JqZWN0LmlhYikgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSUFCQ29uc2VudFN0cmluZyA9IGNvbnNlbnRPYmplY3QuaWFiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGb3JjZSBjb25zZW50IHJlbmV3YWwgaWYgZXhpc3RpbmcgY29uc2VudCBpcyBiYXNlZCBvbiB2ZXJzaW9uIDEgb2YgSUFCIGZyYW1ld29yayBhbmQgdmVyc2lvbiAyIGlzIGFjdGl2ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc0ZyYW1ld29yayh0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuSUFCQ29uc2VudFN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVDb25zZW50Q29va2llKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzRnJhbWV3b3JrKHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLklBQkNvbnNlbnRTdHJpbmcgPSBnZXRUY2ZDb25zZW50U3RyaW5nKCkgfHwgY29uc2VudE9iamVjdC5pYWIyIHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5HQUNNQ29uc2VudFN0cmluZyA9IGdldEdhY21Db25zZW50U3RyaW5nKCkgfHwgY29uc2VudE9iamVjdC5nYWNtIHx8ICcnO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKGNvbnNlbnRPYmplY3QucmVnaW9uKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3QgdXBkYXRlIGlmIHVzZXJDb3VudHJ5IGhhcyBiZWVuIG92ZXJyaWRkZW4uXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy51c2VyQ291bnRyeSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXNlckNvdW50cnkgPSBjb25zZW50T2JqZWN0LnJlZ2lvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUmVndWxhdGlvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKGNvbnNlbnRPYmplY3QudmVyKSAhPT0gXCJ1bmRlZmluZWRcIikgey8vZGVmYXVsdCB0byBcIjFcIiBmb3IgXCJvbGRcIiBjb25zZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJzaW9uID0gY29uc2VudE9iamVjdC52ZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc3BvbnNlTW9kZSA9IFwibGV2ZWxvcHRpblwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25zZW50SUQgPSBjO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnQuc3RhbXAgPSBjO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckdUTUV2ZW50cygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFtem5Db25zZW50U2lnbmFsRW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICBhcHBseUFjcyh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNpZ25hbE1zQ29uc2VudEFQSSh0aGlzLmNvbnNlbnQubWFya2V0aW5nKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNpZ25hbE1zQ2xhcml0eUNvbnNlbnRBUEkodGhpcy5jb25zZW50Lm1hcmtldGluZywgdGhpcy5jb25zZW50LnN0YXRpc3RpY3MpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zaWduYWxHb29nbGVDb25zZW50QVBJKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnRNb2RlRGlzYWJsZWQsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudE1vZGVEYXRhUmVkYWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnQucHJlZmVyZW5jZXMsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5zdGF0aXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnQubWFya2V0aW5nXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgeyAvL25vIGNvbnNlbnQgZXhpc3RzXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTcGlkZXIoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldE91dE9mUmVnaW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1bGtDb25zZW50RW5hYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkQ0ROaUZyYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYnVsa2NvbnNlbnRzdWJtaXR0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRm9yQnVsa0NvbnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaWZyYW1lUmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vYXV0by1ibG9ja2VyXG4gICAgICAgICAgICAvL29ubHkgYWN0aXZhdGUgYXV0by1ibG9ja2VyIGlmIHRoZSB1c2VyIGhhcyBub3Qgc3VibWl0dGVkIGZ1bGwgY29uc2VudCB0byBhbGwgY2F0ZWdvcmllc1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMuYXV0b2Jsb2NrICYmXG4gICAgICAgICAgICAgICAgISh0aGlzLmNvbnNlbnQucHJlZmVyZW5jZXMgJiYgdGhpcy5jb25zZW50LnN0YXRpc3RpY3MgJiYgdGhpcy5jb25zZW50Lm1hcmtldGluZylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHZhciBoYXNUb3BMb2NhdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRyeSB7IC8vbWF5IHRocm93IHNlY3VyaXR5IGV4Y2VwdGlvbiBpZiB0b3Agbm90IGFjY2Vzc2FibGVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvcCAmJiB0b3AubG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc1RvcExvY2F0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV2ZW50KSB7IH1cblxuICAgICAgICAgICAgICAgIGlmIChoYXNUb3BMb2NhdGlvbiAmJiB0b3AubG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZihcIndwLWFkbWluXCIpID49IDApIHsgLy9EaXNhYmxlIGF1dG9ibG9jayBpbiBXUCBhZG1pblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF1dG9ibG9jayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXB1dGVkQ29uZmlndXJhdGlvbi5ibG9ja2luZ21vZGUgPSBcIm1hbnVhbFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9yZW1vdmUgd2lsZGNhcmRzIGZyb20gY29tbW9uVHJhY2tlcnNcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbCA9IDA7IGwgPCB0aGlzLmNvbW1vblRyYWNrZXJzLmRvbWFpbnMubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0RG9tYWluID0gdGhpcy5jb21tb25UcmFja2Vycy5kb21haW5zW2xdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3REb21haW4uZC5zdWJzdHIodGVzdERvbWFpbi5kLmxlbmd0aCAtIDEsIDEpID09PSBcIipcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlc3REb21haW4uZCA9IHRlc3REb21haW4uZC5zdWJzdHIoMCwgdGVzdERvbWFpbi5kLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL3N0YXJ0IHRoZSBET00gbXV0YXRpb24gb2JzZXJ2ZXJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0TXV0YXRpb25PYnNlcnZlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgdGhpcy5pbml0Q29uc2VudCgpO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdENvbnNlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICBpZiAoIXRoaXMuc2V0dGluZ3NMb2FkZWQpIHtcbiAgICAgICAgICAgIGxvYWRTZXR0aW5ncyh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vd2FpdCBmb3IgYnVsayBjb25zZW50IGNoZWNrIHRvIGxvYWRcbiAgICAgICAgdmFyIGlmcmFtZVByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgLy8gUHJvbWlzZSB3aWxsIGJlIGNvbXBsZXRlZCBvbiB0aW1lb3V0IGJlY2F1c2UgdGhlIHRpbWVvdXQgc2V0cyBpZnJhbWVSZWFkeVxuICAgICAgICAgICAgZnVuY3Rpb24gY2hlY2tJRnJhbWUoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoYXQuaWZyYW1lUmVhZHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoY2hlY2tJRnJhbWUsIDUwKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2hlY2tJRnJhbWUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIHRjZlByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgaWYgKCFoYXNGcmFtZXdvcmsodGhhdCkgfHwgdGhhdC5mcmFtZXdvcmtMb2FkZWQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNvbnNlbnRVcmwgPSB0aGF0Lmhvc3QgKyBcIkZyYW1ld29yay9JQUIvY29uc2VudC1zZGstMi4zLmpzXCI7XG5cbiAgICAgICAgICAgIHRoYXQuZ2V0U2NyaXB0KGNvbnNlbnRVcmwsIGZhbHNlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnRJQUJDTVAuaW5pdEZyYW1ld29yaygpO1xuICAgICAgICAgICAgICAgIHRoYXQuZnJhbWV3b3JrTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVGhpcyBuZWVkcyB0byBiZSBjYWxsZWQgYmVmb3JlIGNyZWF0ZUJhbm5lclByb21pc2VcbiAgICAgICAgdGhpcy5zZXRETlRTdGF0ZSgpO1xuXG4gICAgICAgIHRoaXMuc2V0SGVhZGVyU3R5bGVzKCk7XG5cbiAgICAgICAgLy8gTG9hZCBiYW5uZXIgaWYgbm8gY29uc2VudCBoYXMgYmVlbiBnaXZlbiB5ZXRcbiAgICAgICAgdmFyIGJhbm5lclByb21pc2UgPSB0aGlzLmNvbnNlbnRlZCB8fCB0aGlzLmRlY2xpbmVkID8gcmVzb2x2ZWRQcm9taXNlIDogY3JlYXRlQmFubmVyKHRoYXQsIGZhbHNlKTtcblxuICAgICAgICBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAvLyBXYWl0IGZvciB1cCB0byAyMDAwIG1zIGZvciBidWxrIGNvbnNlbnQgaWZyYW1lIHRvIGxvYWRcbiAgICAgICAgICAgIFByb21pc2UucmFjZShbaWZyYW1lUHJvbWlzZSwgY3JlYXRlVGltZW91dFByb21pc2UodGhhdC5Qcm9taXNlLCAyMDAwKV0pXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5pZnJhbWVSZWFkeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAvLyBXYWl0IGZvciB1cCB0byAyMDAwIG1zIGZvciBUQ0YgU0RLIGZpbGUgdG8gbG9hZFxuICAgICAgICAgICAgUHJvbWlzZS5yYWNlKFt0Y2ZQcm9taXNlLCBjcmVhdGVUaW1lb3V0UHJvbWlzZSh0aGF0LlByb21pc2UsIDIwMDApXSksXG4gICAgICAgICAgICAvLyBMb2FkIGJhbm5lciBpZiBjb25zZW50IGlzIG5lZWRlZFxuICAgICAgICAgICAgYmFubmVyUHJvbWlzZVxuICAgICAgICBdKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGF0LmNvbnNlbnRlZCB8fCB0aGF0LmRlY2xpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2lnbmFsQ29uc2VudFJlYWR5KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuc2V0T25sb2FkKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlZFByb21pc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9yZWdpc3RlciBldmVudCBoYW5kbGVyIHRvIHN1Ym1pdCBpbXBsaWVkIGNvbnNlbnQgb24gY2xpY2sgb24gYW4gZWxlbWVudFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGF0LnN1Ym1pdEltcGxpZWRDb25zZW50LCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50RGlhbG9nICYmIHdpbmRvdy5Db29raWVDb25zZW50RGlhbG9nLmluaXQoKTtcbiAgICAgICAgICAgICAgICB0aGF0LmNoYW5nZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5KSB7IC8vdGhlbiB0aGUgcGFnZSBoYXMgbm90IGZpbmlzaGVkIGxvYWRpbmdcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIHRoYXQuY2JvbmxvYWRldmVudCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5jYm9ubG9hZGV2ZW50KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVkUHJvbWlzZTtcbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5zaWduYWxXaW5kb3dMb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC53aW5kb3dPbmxvYWRUcmlnZ2VyZWQgPSB0cnVlO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgd2luZG93LkNvb2tpZUNvbnNlbnQuc2lnbmFsV2luZG93TG9hZCk7XG4gICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LnN0b3BNdXRhdGlvbk9ic2VydmVyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWdpc3Rlckdlb1JlZ2lvbnMgPSBmdW5jdGlvbiAoZ2VvZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5nZW9SZWdpb25zICYmICh0aGlzLmdlb1JlZ2lvbnMubGVuZ3RoID09PSAwKSkgeyAvL29ubHkgcmVnaXN0ZXIgcmVnaW9ucyBpZiB0aGV5IGhhdmUgbm90IGFscmVhZHkgYmVlbiBkZWZpbmVkXG4gICAgICAgICAgICBpZiAoZ2VvZGF0YSAmJiBnZW9kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgSlNPTnZlcnNpb24gPSBcIntcXFwiY29uZmlnc1xcXCI6IFtcIiArIGdlb2RhdGEucmVwbGFjZSgvIC9nLCAnJykucmVwbGFjZSgvJy9nLCAnXCInKSArIFwiXX1cIjtcbiAgICAgICAgICAgICAgICB0cnkgeyAvL2dlb2RhdGEgbWF5IGJlIGNvcnJ1cHQgYnkgaW5wdXQgZnJvbSB0YWcgYXR0cmlidXRlIG9yIFVSTFxuICAgICAgICAgICAgICAgICAgICB2YXIganNvbkFycmF5ID0gSlNPTi5wYXJzZShKU09OdmVyc2lvbik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqc29uQXJyYXkuY29uZmlncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBqc29uQXJyYXkuY29uZmlncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqc29uQXJyYXkuY29uZmlnc1tpXS5yZWdpb24gJiYganNvbkFycmF5LmNvbmZpZ3NbaV0uY2JpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdlb1JlZ2lvbnMucHVzaCh7IHI6IGpzb25BcnJheS5jb25maWdzW2ldLnJlZ2lvbiwgaToganNvbkFycmF5LmNvbmZpZ3NbaV0uY2JpZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKFwiRVJST1IgSU4gR0VPUkVHSU9OUyBBVFRSSUJVVEUgVkFMVUUgLSBOT1QgQSBWQUxJRCBKU09OIEFSUkFZOiBcIiArIGdlb2RhdGEpIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBJTVBMSUVEX1RSSUdHRVJfUEFUVEVSTiA9IC8oXFxzK3xeKWNvb2tpZWNvbnNlbnQtaW1wbGllZC10cmlnZ2VyKFxccyt8JCkvaTtcblxuICAgIGZ1bmN0aW9uIGlzSW1wbGllZENvbnNlbnRUcmlnZ2VyKHRhcmdldCkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0ICYmIHRhcmdldC5ub2RlVHlwZSA9PT0gMSAmJiAoKHRhcmdldC50YWdOYW1lID09PSBcIkFcIiB8fCB0YXJnZXQudGFnTmFtZSA9PT0gXCJCVVRUT05cIikgfHwgSU1QTElFRF9UUklHR0VSX1BBVFRFUk4udGVzdCh0YXJnZXQuY2xhc3NOYW1lKSk7XG4gICAgfVxuXG4gICAgdmFyIENPTU1BTkRfTElOS19QQVRURVJOID0gL2phdmFzY3JpcHQ6LipcXGIoQ29va2llQ29uc2VudHxDb29raWVib3QpXFxiLztcblxuICAgIGZ1bmN0aW9uIGlzQ29tbWFuZExpbmsodGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiB0YXJnZXQudGFnTmFtZSA9PT0gXCJBXCIgJiYgQ09NTUFORF9MSU5LX1BBVFRFUk4udGVzdCh0YXJnZXQuaHJlZik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNTdG9yYWdlU3VwcG9ydGVkKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIGtleSA9IFwiY29va2llYm90dGVzdFwiXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIGtleSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBTdG9yYWdlIG5vdCBzdXBwb3J0ZWQgLSBJRS4gU2FmYXJpIHdoZW4gY29va2llcyBhcmUgZGlzYWJsZWQgaW4gdGhlIHNlY3VyaXR5IHNldHRpbmdzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnN1Ym1pdEltcGxpZWRDb25zZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICh0eXBlb2Ygd2luZG93LkNvb2tpZUNvbnNlbnQgPT09ICdvYmplY3QnKSAmJlxuICAgICAgICAgICAgIXdpbmRvdy5Db29raWVDb25zZW50Lmhhc1Jlc3BvbnNlICYmXG4gICAgICAgICAgICAodHlwZW9mIHdpbmRvdy5Db29raWVDb25zZW50RGlhbG9nID09PSAnb2JqZWN0JykgJiZcbiAgICAgICAgICAgICh3aW5kb3cuQ29va2llQ29uc2VudERpYWxvZy5jb25zZW50TGV2ZWwgPT09ICdpbXBsaWVkJykgJiZcbiAgICAgICAgICAgICF3aW5kb3cuQ29va2llQ29uc2VudC5tdXRhdGlvbkZhbGxiYWNrXG4gICAgICAgICkge1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcblxuICAgICAgICAgICAgd2hpbGUgKHRhcmdldCkge1xuICAgICAgICAgICAgICAgIGlmIChpc0ltcGxpZWRDb25zZW50VHJpZ2dlcih0YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47IC8vIHRoZSBldmVudCB0YXJnZXQgZG9lcyBub3QgdHJpZ2dlciBpbXBsaWVkIGNvbnNlbnRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBhcmVudCA9IHRhcmdldDtcblxuICAgICAgICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICAgICAgICAgIGlmICgocGFyZW50W1wiaWRcIl0pICYmIChwYXJlbnRbXCJpZFwiXSA9PT0gd2luZG93LkNvb2tpZUNvbnNlbnREaWFsb2cuRE9NaWQgfHwgcGFyZW50W1wiaWRcIl0gPT09ICdDeWJvdENvb2tpZWJvdERpYWxvZ1dyYXBwZXInKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47IC8vIHRhcmdldCBpcyBhIGNoaWxkIG9mIHRoZSBjb25zZW50IGJhbm5lcjogZG9lcyBub3QgdHJpZ2dlciBpbXBsaWVkIGNvbnNlbnRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc0NvbW1hbmRMaW5rKHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47IC8vIHRhcmdldCBpcyBhIENvb2tpZWJvdCBjb21tYW5kLWxpbms6IGRvZXMgbm90IHRyaWdnZXIgaW1wbGllZCBjb25zZW50XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh3aW5kb3cuQ29va2llQ29uc2VudC5yZXNwb25zZU1vZGUgPT09ICdvcHRvdXQnICYmIG5hdmlnYXRvci5nbG9iYWxQcml2YWN5Q29udHJvbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LnN1Ym1pdEN1c3RvbUNvbnNlbnQoZmFsc2UsIGZhbHNlLCBmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50RGlhbG9nLmNyZWF0ZUFuZFNob3dHcGNUb2FzdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5zdWJtaXRDb25zZW50KHRydWUsIHdpbmRvdy5sb2NhdGlvbi5ocmVmLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGlzIGhhbmRsZXIsIHNvIGFzIG5vdCB0byB0cmlnZ2VyIGl0IGFnYWluIC0gaW1wbGljaXQgY29uc2VudCBoYXBwZW5zIG9ubHkgb25jZTpcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB3aW5kb3cuQ29va2llQ29uc2VudC5zdWJtaXRJbXBsaWVkQ29uc2VudCwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmICgodHlwZW9mIHdpbmRvdy5wZXJmb3JtYW5jZSA9PT0gXCJvYmplY3RcIikgJiYgKHR5cGVvZiB3aW5kb3cucGVyZm9ybWFuY2UuZ2V0RW50cmllc0J5VHlwZSA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucGVyZm9ybWFuY2VFbnRyaWVzQ291bnRlciA9IHdpbmRvdy5wZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlUeXBlKFwicmVzb3VyY2VcIikubGVuZ3RoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5wcm9jZXNzTGlua0NsaWNrKGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcblxuICAgICAgICAgICAgaWYgKGV2ZW50LmJ1YmJsZXMpIHtcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY2JvbmxvYWRldmVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LkNvb2tpZUNvbnNlbnQpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mICh3aW5kb3cuQ29va2llQ29uc2VudCkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuYXBwbHlEaXNwbGF5KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vdXBkYXRlIHN0YXR1c2xhYmVsIGlmIHVzZXIgaXMgb24gcGFnZSB3aXRoIGluamVjdGVkIGNvb2tpZSBkZWNsYXJhdGlvblxuICAgICAgICAgICAgaWYgKCh0eXBlb2YgKHdpbmRvdy5Db29raWVEZWNsYXJhdGlvbikgIT09ICd1bmRlZmluZWQnKSAmJiAodHlwZW9mICh3aW5kb3cuQ29va2llRGVjbGFyYXRpb24uU2V0VXNlclN0YXR1c0xhYmVsKSA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVEZWNsYXJhdGlvbi5TZXRVc2VyU3RhdHVzTGFiZWwoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LkNvb2tpZUNvbnNlbnREaWFsb2cpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50RGlhbG9nLnBhZ2VIYXNMb2FkZWQgPSB0cnVlOyAvL3NpZ25hbCBvbmxvYWQgdG8gdGhlIGRpYWxvZyBzY3JvbGwgbW9uaXRvclxuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMDAwKTsgLy93YWl0IDFzIC0gYmVjYXVzZSB0aGUgYnJvd3NlciBtYXkgdHJpZ2dlciBhIHNjcm9sbCBpZiB0aGUgdXNlciByZWZyZXNoZXMgdGhlIGJyb3dzZXIgZnJvbSB0aGUgbWlkZGxlIG9mIGEgcGFnZSBhbmQgdGhlbiB0aGUgYnJvd3NlciBzY3JvbGxzIHRvIHNhbWUgcG9zaXRpb25cbiAgICB9O1xuXG4gICAgdGhpcy5wcm9jZXNzTGlua0NsaWNrQ291bnRlciA9IDA7XG4gICAgdGhpcy5wZXJmb3JtYW5jZUVudHJpZXNDb3VudGVyID0gMDtcblxuICAgIHRoaXMucHJvY2Vzc0xpbmtDbGljayA9IGZ1bmN0aW9uICh3YWl0dGFyZykge1xuXG4gICAgICAgIHRoaXMucHJvY2Vzc0xpbmtDbGlja0NvdW50ZXIgKz0gMTtcbiAgICAgICAgdmFyIGN1cnJlbnRQZXJmb3JtYW5jZUVudHJpZXNDb3VudCA9IDA7XG5cbiAgICAgICAgaWYgKCh0eXBlb2Ygd2luZG93LnBlcmZvcm1hbmNlID09PSBcIm9iamVjdFwiKSAmJiAodHlwZW9mIHdpbmRvdy5wZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlUeXBlID09PSBcImZ1bmN0aW9uXCIpKSB7XG4gICAgICAgICAgICBjdXJyZW50UGVyZm9ybWFuY2VFbnRyaWVzQ291bnQgPSB3aW5kb3cucGVyZm9ybWFuY2UuZ2V0RW50cmllc0J5VHlwZShcInJlc291cmNlXCIpLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGVyZm9ybWFuY2VFbnRyaWVzQ291bnRlciA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKHRoaXMucGVyZm9ybWFuY2VFbnRyaWVzQ291bnRlciAhPT0gY3VycmVudFBlcmZvcm1hbmNlRW50cmllc0NvdW50KSAmJiAodGhpcy5wcm9jZXNzTGlua0NsaWNrQ291bnRlciA8IDYpKSB7XG4gICAgICAgICAgICB0aGlzLnBlcmZvcm1hbmNlRW50cmllc0NvdW50ZXIgPSBjdXJyZW50UGVyZm9ybWFuY2VFbnRyaWVzQ291bnQ7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5wcm9jZXNzTGlua0NsaWNrKHdhaXR0YXJnKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlua0NsaWNrQ291bnRlciA9IDA7XG4gICAgICAgICAgICB0aGlzLnBlcmZvcm1hbmNlRW50cmllc0NvdW50ZXIgPSAwO1xuXG4gICAgICAgICAgICB2YXIgZXZ0ID0gbmV3IE1vdXNlRXZlbnQoJ2NsaWNrJywge1xuICAgICAgICAgICAgICAgICd2aWV3Jzogd2luZG93LFxuICAgICAgICAgICAgICAgICdidWJibGVzJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAnY2FuY2VsYWJsZSc6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgd2FpdHRhcmcuZGlzcGF0Y2hFdmVudChldnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5sb2FkQ0ROaUZyYW1lID0gZnVuY3Rpb24gKCkgeyAvL3VzZWQgdG8gc3RvcmUgYnVsa2NvbnNlbnRcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkpIHsgLy93YWl0IGZvciBib2R5IHRvIGxvYWRcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LmxvYWRDRE5pRnJhbWUoKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaWZyYW1lKSB7XG4gICAgICAgICAgICAgICAgYXBwbHlSdW50aW1lU3R5bGVzaGVldChkb2N1bWVudCwgdGhpcy5ub25jZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5pZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50T3JpZyhcImlmcmFtZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmlmcmFtZS5jbGFzc0xpc3QuYWRkKE9GRlNDUkVFTl9JRlJBTUVfQ0xBU1MpO1xuICAgICAgICAgICAgICAgIHRoaXMuaWZyYW1lLnRhYkluZGV4ID0gLTE7XG4gICAgICAgICAgICAgICAgdGhpcy5pZnJhbWUuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInByZXNlbnRhdGlvblwiKTsgLy9oaWRlIGlmcmFtZSBmcm9tIHNjcmVlbiByZWFkZXJzXG4gICAgICAgICAgICAgICAgdGhpcy5pZnJhbWUuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpOyAvL2hpZGUgaWZyYW1lIGZyb20gc2NyZWVuIHJlYWRlcnNcbiAgICAgICAgICAgICAgICB0aGlzLmlmcmFtZS5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBcIkJsYW5rXCIpOyAvL2VuYWJsZSBwYXNzaW5nIG9mIGFjY2Vzc2FibGlsaXR5IHRlc3RcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuaWZyYW1lKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuaWZyYW1lLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5yZWFkQnVsa0NvbnNlbnQoKTtcbiAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAvL1RoaXMgaXMgc2ltcGxlIHZhbGlkYXRpb24gY2hlY2sgdG8gbWFrZSBzbnlrIGFsZXJ0IGRpc2FwcGVhclxuICAgICAgICAgICAgICAgICAgICAvLyBhcyBpdCBkb2VzIG5vdCByZWNvZ25pemUgbW9yZSBjb21wcmVoZW5zaXZlIGNoZWNrXG4gICAgICAgICAgICAgICAgICAgIC8vIHN1Y2ggYXMgb25lIGJlbG93IG9uIGxpbmUgMTIwMFxuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiByZW1vdmUgb25jZSBzbnlrIGlzIHBoYXNlZCBvdXRcbiAgICAgICAgICAgICAgICAgICAgaWYoZXZlbnQub3JpZ2luID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZighZXZlbnQub3JpZ2luLnN0YXJ0c1dpdGgoXCJodHRwc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdJZ25vcmluZyBVbnNlY3VyZSBtZXNzYWdlIGV2ZW50IG9yaWdpbjonLCBldmVudC5vcmlnaW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhhdC5oYW5kbGVCdWxrQ29uc2VudElmcmFtZU1lc3NhZ2UoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaWZyYW1lICYmICF0aGlzLmlmcmFtZVJlYWR5KSB7XG4gICAgICAgICAgICAgICAgLy8gUHJvZFxuICAgICAgICAgICAgICAgIHRoaXMuaWZyYW1lLnNyYyA9IHRoaXMuQ0ROICsgXCIvc2RrL2JjLXY0Lm1pbi5odG1sXCI7XG4gICAgICAgICAgICAgICAgLy8gVGVzdCAmIERldlxuICAgICAgICAgICAgICAgIC8vdGhpcy5pZnJhbWUuc3JjID0gdGhpcy5DRE4gKyBcIi9DRE4vc2RrL2JjLXY0Lmh0bWxcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaWZyYW1lUmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5yZWFkQnVsa0NvbnNlbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuQ29va2llQ29uc2VudCAmJiB3aW5kb3cuQ29va2llQ29uc2VudC5pZnJhbWUgIT0gbnVsbCAmJiAodHlwZW9mIHdpbmRvdy5Db29raWVDb25zZW50LmlmcmFtZS5jb250ZW50V2luZG93ICE9PSAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgICAgIHZhciBwb3N0T2JqID0ge1xuICAgICAgICAgICAgICAgIGFjdGlvbjogXCJnZXRcIixcbiAgICAgICAgICAgICAgICBzZXJpYWw6IHRoaXMuc2VyaWFsLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlcnMgaGFuZGxlQnVsa0NvbnNlbnRJZnJhbWVNZXNzYWdlIGJlbG93XG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuaWZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UocG9zdE9iaiwgdGhpcy5DRE4pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LmlmcmFtZVJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LmlmcmFtZVJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlQnVsa0NvbnNlbnRJZnJhbWVNZXNzYWdlID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmICghZXZlbnQgfHwgIWV2ZW50Lm9yaWdpbiB8fCAhZXZlbnQuZGF0YSB8fCBldmVudC5vcmlnaW4gIT09IHRoaXMuQ0ROKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cnkgeyAvL3RvIHByZXZlbnQgZXJyb3JzIHRyaWdnZXJlZCBieSB1bmF1dGhvcml6ZWQgY2FsbHMgZnJvbSB0aGlyZCBwYXJ0eSBzY3JpcHRzXG4gICAgICAgICAgICB2YXIgYnVsa0NvbnNlbnREYXRhID0gZXZlbnQuZGF0YTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBidWxrQ29uc2VudERhdGEgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYnVsa0NvbnNlbnREYXRhID09PSBcImJjRW1wdHlcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ1bGtyZXNldGRvbWFpbnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuaWZyYW1lUmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYnVsa0NvbnNlbnREYXRhID0gSlNPTi5wYXJzZShidWxrQ29uc2VudERhdGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgIGlmIChidWxrQ29uc2VudERhdGEudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBidWxrQ29uc2VudERhdGEgPSBidWxrQ29uc2VudERhdGEudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYnVsa3Jlc2V0ZG9tYWlucyA9IGJ1bGtDb25zZW50RGF0YS5yZXNldGRvbWFpbnM7XG5cbiAgICAgICAgICAgIGlmIChidWxrQ29uc2VudERhdGEuYnVsa2NvbnNlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1bGtjb25zZW50ID0gYnVsa0NvbnNlbnREYXRhLmJ1bGtjb25zZW50O1xuXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgYnVsayBjb25zZW50IGhhcyBleHBpcmVkIC0gZm9yY2UgbmV3IGNvbnNlbnQgaWYgc29cbiAgICAgICAgICAgICAgICBpZiAoYnVsa0NvbnNlbnREYXRhLmJ1bGtjb25zZW50LnV0Yykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXhwaXJlTW9udGhzID0gYnVsa0NvbnNlbnREYXRhLmJ1bGtjb25zZW50LmV4cGlyZU1vbnRocztcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZXhwaXJlTW9udGhzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGV4cGlyZU1vbnRocyBzaG91bGQgYWx3YXlzIGJlIFwic29tZXRoaW5nXCIsIHNvIGRlZmF1bHQgdG8gMTIgbW9udGhzIGlmIGNvbnNlbnRMaWZlVGltZSBoYXNuJ3QgYmVlbiBzZXQuXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBpcmVNb250aHMgPSBpc05hTih0aGlzLmNvbnNlbnRMaWZldGltZSkgPyAxMiA6IHRoaXMuY29uc2VudExpZmV0aW1lO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSXQncyBsb2NhbCBzdG9yYWdlLiBDaGVjayBpZiBpdCBzaG91bGQgYmUgZXhwaXJlZC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4cGlyZU1vbnRocyAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4cGlyZURhdGUgPSBuZXcgd2luZG93LkNvb2tpZUNvbnRyb2wuRGF0ZVRpbWUoYnVsa0NvbnNlbnREYXRhLmJ1bGtjb25zZW50LnV0YykuYWRkTW9udGhzKGV4cGlyZU1vbnRocyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleHBpcmVEYXRlIDwgbmV3IERhdGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQnVsa1Jlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVDb25zZW50Q29va2llKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1bGtyZXNldGRvbWFpbnMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gSWdub3JlZFxuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuaWZyYW1lUmVhZHkgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuY2hlY2tGb3JCdWxrQ29uc2VudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy93YWl0IGZvciBidWxrIHJlc2V0IGRvbWFpbnMgdG8gbG9hZFxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5pZnJhbWVSZWFkeSAmJiB0aGlzLmJ1bGtDb25zZW50RnJhbWVSZXRyeUNvdW50ZXIgPCA0MCkge1xuICAgICAgICAgICAgdGhpcy5idWxrQ29uc2VudEZyYW1lUmV0cnlDb3VudGVyKys7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoYXQuY2hlY2tGb3JCdWxrQ29uc2VudCgpO1xuICAgICAgICAgICAgfSwgNTApOyAvL3dhaXQgZm9yIGJ1bGsgY29uc2VudCBjaGVjayB0byBsb2FkXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlmcmFtZVJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYnVsa0NvbnNlbnRGcmFtZVJldHJ5Q291bnRlciA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICAvL0NoZWNrIGlmIGV4aXN0aW5nIGJ1bGsgY29uc2VudCBtdXN0IHJlbmV3XG4gICAgICAgIGlmICgodGhpcy5idWxrcmVzZXRkb21haW5zLmxlbmd0aCA+IDApICYmICghdGhpcy5jaGFuZ2VkKSkge1xuICAgICAgICAgICAgdmFyIGRvbWFpbm11c3RyZW5ldyA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRIb3N0ID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB2YXIgYWx0aG9zdCA9IGN1cnJlbnRIb3N0O1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRIb3N0LmluZGV4T2YoXCJ3d3cuXCIpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYWx0aG9zdCA9IGFsdGhvc3Quc3Vic3RyaW5nKDQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYWx0aG9zdCA9IFwid3d3LlwiICsgYWx0aG9zdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5idWxrcmVzZXRkb21haW5zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKChjdXJyZW50SG9zdCA9PT0gdGhpcy5idWxrcmVzZXRkb21haW5zW2pdKSB8fCAoYWx0aG9zdCA9PT0gdGhpcy5idWxrcmVzZXRkb21haW5zW2pdKSkge1xuICAgICAgICAgICAgICAgICAgICBkb21haW5tdXN0cmVuZXcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZG9tYWlubXVzdHJlbmV3ICYmIHRoaXMuaWZyYW1lKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmlzYnVsa3JlbmV3YWwgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1bGtjb25zZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9CdWxrIGNvbnNlbnQgbmVlZHMgXCJwcmVmZXJlbmNlc1wiIGNvbnNlbnQgb24gZWl0aGVyIHRoZSBidWxrIG9yIGN1cnJlbnQgc2l0ZSwgc2tpcCBpZiBuZWl0aGVyIGhhcyBpdC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmJ1bGtjb25zZW50LnByZWZlcmVuY2VzICYmICF0aGlzLmNvbnNlbnQucHJlZmVyZW5jZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ3VycmVudERvbWFpbkJ1bGtSZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25zZW50LnByZWZlcmVuY2VzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5zdGF0aXN0aWNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5tYXJrZXRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5idWxrY29uc2VudC5pYWIyICYmIGhhc0ZyYW1ld29yayh0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5JQUJDb25zZW50U3RyaW5nID0gdGhpcy5idWxrY29uc2VudC5pYWIyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmJ1bGtjb25zZW50LmdhY20pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuR0FDTUNvbnNlbnRTdHJpbmcgPSB0aGlzLmJ1bGtjb25zZW50LmdhY207XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWxrY29uc2VudHN1Ym1pdHRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VibWl0Q3VzdG9tQ29uc2VudCh0aGlzLmJ1bGtjb25zZW50LnByZWZlcmVuY2VzLCB0aGlzLmJ1bGtjb25zZW50LnN0YXRpc3RpY3MsIHRoaXMuYnVsa2NvbnNlbnQubWFya2V0aW5nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWxldGVDb25zZW50Q29va2llKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ3VycmVudERvbWFpbkJ1bGtSZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZGVsZXRlQ29uc2VudENvb2tpZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gdGhpcy5uYW1lICsgXCI9O1BhdGg9LztleHBpcmVzPVRodSwgMDEtSmFuLTE5NzAgMDA6MDA6MDEgR01UXCI7XG4gICAgICAgIHRoaXMuY29uc2VudC5wcmVmZXJlbmNlcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNvbnNlbnQuc3RhdGlzdGljcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNvbnNlbnQubWFya2V0aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29uc2VudC5tZXRob2QgPSBudWxsO1xuICAgICAgICB0aGlzLmhhc1Jlc3BvbnNlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29uc2VudGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGVjbGluZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLnJlc2V0QnVsa0RvbWFpbnMgPSBmdW5jdGlvbiAobmV3RG9tYWlucywgdXBkYXRlU3RvcmFnZSkge1xuICAgICAgICBpZiAodGhpcy5pZnJhbWUgJiYgKG5ld0RvbWFpbnMubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3RG9tYWlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBkb21haW5FeGlzdHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuYnVsa3Jlc2V0ZG9tYWlucy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3RG9tYWluc1tpXSA9PT0gdGhpcy5idWxrcmVzZXRkb21haW5zW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb21haW5FeGlzdHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFkb21haW5FeGlzdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWxrcmVzZXRkb21haW5zLnB1c2gobmV3RG9tYWluc1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2ZpbHRlciBvdXQgY3VycmVudCBkb21haW4gYW5kIGFsaWFzXG4gICAgICAgICAgICB2YXIgY3VycmVudEhvc3QgPSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHZhciBhbHRIb3N0ID0gY3VycmVudEhvc3Q7XG4gICAgICAgICAgICBpZiAoY3VycmVudEhvc3QuaW5kZXhPZihcInd3dy5cIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICBhbHRIb3N0ID0gYWx0SG9zdC5zdWJzdHJpbmcoNCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBhbHRIb3N0ID0gXCJ3d3cuXCIgKyBhbHRIb3N0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5idWxrcmVzZXRkb21haW5zID0gdGhpcy5idWxrcmVzZXRkb21haW5zLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtICE9PSBjdXJyZW50SG9zdCAmJiBpdGVtICE9PSBhbHRIb3N0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vc2F2ZSB0aGVtIHRvIGxvY2Fsc3RvcmFnZVxuICAgICAgICAgICAgaWYgKHVwZGF0ZVN0b3JhZ2UgJiYgd2luZG93LkNvb2tpZUNvbnNlbnQgJiYgd2luZG93LkNvb2tpZUNvbnNlbnQuaWZyYW1lICE9IG51bGwgJiYgd2luZG93LkNvb2tpZUNvbnNlbnQuaWZyYW1lLmNvbnRlbnRXaW5kb3cpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1bGtTdG9yYWdlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnJlbW92ZUJ1bGtSZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5idWxrcmVzZXRkb21haW5zID0gW107XG4gICAgICAgIHRoaXMuYnVsa2NvbnNlbnQgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5pZnJhbWUgJiYgdGhpcy5pZnJhbWUuY29udGVudFdpbmRvdykge1xuICAgICAgICAgICAgdmFyIHBvc3RPYmogPSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiBcInJlbW92ZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBcIlwiLFxuICAgICAgICAgICAgICAgIHNlcmlhbDogdGhpcy5zZXJpYWwudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UocG9zdE9iaiwgdGhpcy5DRE4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5yZW1vdmVDdXJyZW50RG9tYWluQnVsa1Jlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmlzYnVsa3JlbmV3YWwgPSBmYWxzZTtcbiAgICAgICAgdmFyIGN1cnJlbnRIb3N0ID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHZhciBhbHRob3N0ID0gY3VycmVudEhvc3Q7XG4gICAgICAgIGlmIChjdXJyZW50SG9zdC5pbmRleE9mKFwid3d3LlwiKSA9PT0gMCkge1xuICAgICAgICAgICAgYWx0aG9zdCA9IGFsdGhvc3Quc3Vic3RyaW5nKDQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYWx0aG9zdCA9IFwid3d3LlwiICsgYWx0aG9zdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vdXBkYXRlIGxvY2Fsc3RvcmFnZSBsaXN0IC0gcmVtb3ZlIGN1cnJlbnQgZG9tYWluXG4gICAgICAgIGlmICh0aGlzLmJ1bGtyZXNldGRvbWFpbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5idWxrcmVzZXRkb21haW5zID0gdGhpcy5idWxrcmVzZXRkb21haW5zLmZpbHRlcihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoKGl0ZW0gIT09IGN1cnJlbnRIb3N0KSAmJiAoaXRlbSAhPT0gYWx0aG9zdCkpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vdXBkYXRlIGRvbWFpbiBsaXN0IGluIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgdGhpcy51cGRhdGVCdWxrU3RvcmFnZSgpO1xuICAgIH1cblxuICAgIHRoaXMucmVnaXN0ZXJCdWxrQ29uc2VudCA9IGZ1bmN0aW9uIChleHBpcmVNb250aHMpIHtcbiAgICAgICAgLy8gQ3Jvc3MtZG9tYWluIGNvbnNlbnQgc2hhcmluZyBpbiBsb2NhbFN0b3JhZ2UgcmVxdWlyZXMgXCJwcmVmZXJlbmNlc1wiIGNhdGVnb3J5IGNvbnNlbnQsIGJ1dCBpZiBidWxrIGNvbnNlbnQgYWxyZWFkeSBleGlzdHMgd2UgcHJvcGFnYXRlIGNvbnNlbnQgY2hhbmdlcy5cbiAgICAgICAgaWYgKCF0aGlzLmNvbnNlbnQucHJlZmVyZW5jZXMgJiYgdGhpcy5idWxrY29uc2VudCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnNlbnRMaWZldGltZSA9IGlzTmFOKGV4cGlyZU1vbnRocykgPyB0aGlzLmNvbnNlbnRMaWZldGltZSB8fCAxMiA6IGV4cGlyZU1vbnRocztcblxuICAgICAgICB2YXIgdGlja2V0aWQgPSB0aGlzLmNvbnNlbnRJRDtcbiAgICAgICAgdmFyIHRpY2tldHV0YyA9IHRoaXMuY29uc2VudFVUQztcbiAgICAgICAgaWYgKHRpY2tldHV0YyA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aWNrZXR1dGMgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgodGhpcy5idWxrY29uc2VudCAhPSBudWxsKSAmJiAodGhpcy5jaGFuZ2VkKSkgeyAvL2Rvbid0IGNoYW5nZSBidWxrIHRpY2tldCBhbmQgYnVsayBjb25zZW50IGRhdGUgaWYgc2V0IG9uIGVhcmxpZXIgdmlzaXRcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5idWxrY29uc2VudC50aWNrZXQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdGlja2V0aWQgPSB0aGlzLmJ1bGtjb25zZW50LnRpY2tldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5idWxrY29uc2VudC51dGMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdGlja2V0dXRjID0gbmV3IERhdGUodGhpcy5idWxrY29uc2VudC51dGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnVsa2NvbnNlbnQgPSB7XG4gICAgICAgICAgICB0aWNrZXQ6IHRpY2tldGlkLFxuICAgICAgICAgICAgdXRjOiB0aWNrZXR1dGMuZ2V0VGltZSgpLFxuICAgICAgICAgICAgZXhwaXJlTW9udGhzOiB0aGlzLmNvbnNlbnRMaWZldGltZSxcbiAgICAgICAgICAgIHByZWZlcmVuY2VzOiB0aGlzLmNvbnNlbnQucHJlZmVyZW5jZXMsXG4gICAgICAgICAgICBzdGF0aXN0aWNzOiB0aGlzLmNvbnNlbnQuc3RhdGlzdGljcyxcbiAgICAgICAgICAgIG1hcmtldGluZzogdGhpcy5jb25zZW50Lm1hcmtldGluZ1xuICAgICAgICB9O1xuICAgICAgICBpZiAoaGFzRnJhbWV3b3JrKHRoaXMpICYmIHRoaXMuZnJhbWV3b3JrTG9hZGVkKSB7XG5cbiAgICAgICAgICAgIHRoaXMuYnVsa2NvbnNlbnQuaWFiMiA9IHRoaXMuSUFCQ29uc2VudFN0cmluZztcbiAgICAgICAgICAgIHRoaXMuYnVsa2NvbnNlbnQuZ2FjbSA9IHRoaXMuR0FDTUNvbnNlbnRTdHJpbmc7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVCdWxrU3RvcmFnZSgpO1xuICAgIH1cblxuICAgIHRoaXMudXBkYXRlQnVsa1N0b3JhZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlmcmFtZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgcG9zdE9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBcInNldFwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzZXRkb21haW5zOiB0aGlzLmJ1bGtyZXNldGRvbWFpbnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBidWxrY29uc2VudDogdGhpcy5idWxrY29uc2VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGlyZU1vbnRoczogaXNOYU4odGhpcy5idWxrY29uc2VudC5leHBpcmVNb250aHMpID8gMTIgOiB0aGlzLmJ1bGtjb25zZW50LmV4cGlyZU1vbnRocyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcmlhbDogdGhpcy5zZXJpYWwudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzZXJpYWw6IHRoaXMuc2VyaWFsLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMuaWZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UocG9zdE9iaiwgdGhpcy5DRE4pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIElnbm9yZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zaWduYWxDb25zZW50RnJhbWV3b3JrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5oYXNGcmFtZXdvcmsgJiYgIXRoaXMuZnJhbWV3b3JrTG9hZGVkKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5zaWduYWxDb25zZW50RnJhbWV3b3JrKCk7XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNsb25lU2NyaXB0VGFnID0gZnVuY3Rpb24oY3VycmVudFRhZykge1xuICAgICAgICByZXR1cm4gY2xvbmVTY3JpcHRUYWcoZG9jdW1lbnQsIGN1cnJlbnRUYWcpXG4gICAgfVxuXG4gICAgdGhpcy5ydW5TY3JpcHRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHZhciB0YWdDb250YWluZXIgPSBbXTtcbiAgICAgICAgdmFyIGRlZmVyVGFnQ29udGFpbmVyID0gW107XG5cbiAgICAgICAgdmFyIHRhZ3NBbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWdzQWxsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudFRhZyA9IHRhZ3NBbGxbaV07XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgY3VycmVudFRhZy5oYXNBdHRyaWJ1dGUoXCJkYXRhLWNvb2tpZWNvbnNlbnRcIikgJiZcbiAgICAgICAgICAgICAgICBjdXJyZW50VGFnLmhhc0F0dHJpYnV0ZShcInR5cGVcIikgJiZcbiAgICAgICAgICAgICAgICAoY3VycmVudFRhZy5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpLnRvTG93ZXJDYXNlKCkgPT09IFwidGV4dC9wbGFpblwiKSAmJlxuICAgICAgICAgICAgICAgIChjdXJyZW50VGFnLmdldEF0dHJpYnV0ZShcImRhdGEtY29va2llY29uc2VudFwiKS50b0xvd2VyQ2FzZSgpICE9PSBcImlnbm9yZVwiKSAmJlxuICAgICAgICAgICAgICAgICh0eXBlb2YgY3VycmVudFRhZy5jb29raWVzUHJvY2Vzc2VkID09PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VGFnLmhhc0F0dHJpYnV0ZShcImRlZmVyXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUYWcucmVtb3ZlQXR0cmlidXRlKFwiZGVmZXJcIik7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVyVGFnQ29udGFpbmVyLnB1c2goY3VycmVudFRhZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0YWdDb250YWluZXIucHVzaChjdXJyZW50VGFnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9QcmV2ZW50IGR1cGxpY2F0ZSBwcm9jZXNzaW5nIG9mIGFueSBzY3JpcHQgdGFnLFxuICAgICAgICAgICAgICAgIC8vZS5nLiB3aGVuIHVzaW5nIEdUTSBpbiBjb21iaW5hdGlvbiB3aXRoIGF1dG8tYmxvY2tlciB3aGVyZSBmaXJzdCBsZXZlbCBzY3JpcHQgdGFncyBhcmUgbG9hZGVkIGZyb20gR1RNIGJlZm9yZSBNdXRhdGlvbk9ic2VydmVyIGlzIGxhdW5jaGVkLlxuICAgICAgICAgICAgICAgIGN1cnJlbnRUYWcuY29va2llc1Byb2Nlc3NlZCA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL2xvYWQgZGVmZXIgc2NyaXB0IHRhZ3MgbGFzdFxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRlZmVyVGFnQ29udGFpbmVyLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB0YWdDb250YWluZXIucHVzaChkZWZlclRhZ0NvbnRhaW5lcltqXSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGF0LlJ1blNjcmlwdFRhZ3ModGFnQ29udGFpbmVyKTtcblxuICAgICAgICB0aGF0LlJ1blNyY1RhZ3MoXCJpZnJhbWVcIik7XG4gICAgICAgIHRoYXQuUnVuU3JjVGFncyhcImltZ1wiKTtcbiAgICAgICAgdGhhdC5SdW5TcmNUYWdzKFwiZW1iZWRcIik7XG4gICAgICAgIHRoYXQuUnVuU3JjVGFncyhcInZpZGVvXCIpO1xuICAgICAgICB0aGF0LlJ1blNyY1RhZ3MoXCJhdWRpb1wiKTtcbiAgICAgICAgdGhhdC5SdW5TcmNUYWdzKFwicGljdHVyZVwiKTtcbiAgICAgICAgdGhhdC5SdW5TcmNUYWdzKFwic291cmNlXCIpO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93LkNCX09uVGFnc0V4ZWN1dGVkX1Byb2Nlc3NlZCA9PT0gJ3VuZGVmaW5lZCcpIHsgLy9vbmx5IHJ1biBvbmNlXG4gICAgICAgICAgICB3aW5kb3cuQ0JfT25UYWdzRXhlY3V0ZWRfUHJvY2Vzc2VkID0gMTtcbiAgICAgICAgICAgIHZhciBldmVudDtcbiAgICAgICAgICAgIGlmICh3aW5kb3cuQ29va2llQ29uc2VudC5vbnRhZ3NleGVjdXRlZCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50Lm9udGFnc2V4ZWN1dGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5Db29raWVib3RDYWxsYmFja19PblRhZ3NFeGVjdXRlZCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZWJvdENhbGxiYWNrX09uVGFnc0V4ZWN1dGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2Ygd2luZG93LkNvb2tpZUNvbnNlbnRDYWxsYmFja19PblRhZ3NFeGVjdXRlZCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnRDYWxsYmFja19PblRhZ3NFeGVjdXRlZCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgZXZlbnQuaW5pdEV2ZW50KCdDb29raWVib3RPblRhZ3NFeGVjdXRlZCcsIHRydWUsIHRydWUpO1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG4gICAgICAgICAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgZXZlbnQuaW5pdEV2ZW50KCdDb29raWVDb25zZW50T25UYWdzRXhlY3V0ZWQnLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuUnVuU2NyaXB0VGFncyA9IGZ1bmN0aW9uICh0YWdDb250YWluZXIpIHtcbiAgICAgICAgcnVuU2NyaXB0VGFncyh3aW5kb3csIHRoaXMsIHRhZ0NvbnRhaW5lcik7XG4gICAgfVxuXG4gICAgdGhpcy5SdW5TcmNUYWdzID0gZnVuY3Rpb24gKHRhZ05hbWUpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzQWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnTmFtZSk7XG4gICAgICAgIHZhciBlbGVtZW50Q29udGFpbmVyID0gW107XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzQWxsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudEVsZW1lbnQgPSBlbGVtZW50c0FsbFtpXTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBjdXJyZW50RWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJkYXRhLWNvb2tpZWNvbnNlbnRcIikgJiZcbiAgICAgICAgICAgICAgICAoY3VycmVudEVsZW1lbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1zcmNcIikgfHwgY3VycmVudEVsZW1lbnQuaGFzQXR0cmlidXRlKFwiZGF0YS1jb29raWVibG9jay1zcmNcIikpICYmXG4gICAgICAgICAgICAgICAgKGN1cnJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtY29va2llY29uc2VudFwiKS50b0xvd2VyQ2FzZSgpICE9PSBcImlnbm9yZVwiKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudENvbnRhaW5lci5wdXNoKGN1cnJlbnRFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGVsZW1lbnRDb250YWluZXIubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50RWxlbWVudENvbnRhaW5lciA9IGVsZW1lbnRDb250YWluZXJbal07XG4gICAgICAgICAgICB2YXIgdGFnQ29uc2VudExldmVscyA9IGN1cnJlbnRFbGVtZW50Q29udGFpbmVyLmdldEF0dHJpYnV0ZShcImRhdGEtY29va2llY29uc2VudFwiKS50b0xvd2VyQ2FzZSgpLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgIHZhciBjYW5FeGVjdXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGFnQ29uc2VudExldmVscy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb25zZW50UmVxID0gdGFnQ29uc2VudExldmVsc1trXS5yZXBsYWNlKC9eXFxzKi8sIFwiXCIpLnJlcGxhY2UoL1xccyokLywgXCJcIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoY29uc2VudFJlcSA9PT0gXCJwcmVmZXJlbmNlc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2xhc3MoY3VycmVudEVsZW1lbnRDb250YWluZXIsIFwiY29va2llY29uc2VudC1vcHRpbi1wcmVmZXJlbmNlc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF3aW5kb3cuQ29va2llQ29uc2VudC5jb25zZW50LnByZWZlcmVuY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY29uc2VudFJlcSA9PT0gXCJzdGF0aXN0aWNzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRDbGFzcyhjdXJyZW50RWxlbWVudENvbnRhaW5lciwgXCJjb29raWVjb25zZW50LW9wdGluLXN0YXRpc3RpY3NcIik7XG4gICAgICAgICAgICAgICAgICAgIGlmICghd2luZG93LkNvb2tpZUNvbnNlbnQuY29uc2VudC5zdGF0aXN0aWNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoY29uc2VudFJlcSA9PT0gXCJtYXJrZXRpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZENsYXNzKGN1cnJlbnRFbGVtZW50Q29udGFpbmVyLCBcImNvb2tpZWNvbnNlbnQtb3B0aW4tbWFya2V0aW5nXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXdpbmRvdy5Db29raWVDb25zZW50LmNvbnNlbnQubWFya2V0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5FeGVjdXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FuRXhlY3V0ZSkge1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50RWxlbWVudENvbnRhaW5lci5oYXNBdHRyaWJ1dGUoXCJkYXRhLWNvb2tpZWJsb2NrLXNyY1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RWxlbWVudENvbnRhaW5lci5zcmMgPSBjdXJyZW50RWxlbWVudENvbnRhaW5lci5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvb2tpZWJsb2NrLXNyY1wiKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEVsZW1lbnRDb250YWluZXIucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS1jb29raWVibG9jay1zcmNcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGN1cnJlbnRFbGVtZW50Q29udGFpbmVyLmhhc0F0dHJpYnV0ZShcImRhdGEtc3JjXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50Q29udGFpbmVyLnNyYyA9IGN1cnJlbnRFbGVtZW50Q29udGFpbmVyLmdldEF0dHJpYnV0ZShcImRhdGEtc3JjXCIpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RWxlbWVudENvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLXNyY1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5RWxlbWVudChjdXJyZW50RWxlbWVudENvbnRhaW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVFbGVtZW50KGN1cnJlbnRFbGVtZW50Q29udGFpbmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXBwbHlEaXNwbGF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvL2F1dG8tYXBwbHkgY2xhc3NlcyB0byBpZnJhbWVzXG4gICAgICAgIHZhciBpZnJhbWVzQWxsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpZnJhbWVcIik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaWZyYW1lc0FsbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRJZnJhbWUgPSBpZnJhbWVzQWxsW2ldO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGN1cnJlbnRJZnJhbWUuaGFzQXR0cmlidXRlKFwiZGF0YS1jb29raWVjb25zZW50XCIpICYmXG4gICAgICAgICAgICAgICAgKGN1cnJlbnRJZnJhbWUuaGFzQXR0cmlidXRlKFwiZGF0YS1zcmNcIikgfHwgY3VycmVudElmcmFtZS5oYXNBdHRyaWJ1dGUoXCJkYXRhLWNvb2tpZWJsb2NrLXNyY1wiKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHZhciByZXF1aXJlZENhdGVnb3JpZXMgPSBjdXJyZW50SWZyYW1lLmdldEF0dHJpYnV0ZShcImRhdGEtY29va2llY29uc2VudFwiKS5yZXBsYWNlKCcvIC9nJywgJycpLnRvTG93ZXJDYXNlKCkuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJlcXVpcmVkQ2F0ZWdvcmllcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWlyZWRDYXRlZ29yaWVzW2pdID09PSBcInByZWZlcmVuY2VzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2xhc3MoY3VycmVudElmcmFtZSwgXCJjb29raWVjb25zZW50LW9wdGluLXByZWZlcmVuY2VzXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXF1aXJlZENhdGVnb3JpZXNbal0gPT09IFwic3RhdGlzdGljc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZENsYXNzKGN1cnJlbnRJZnJhbWUsIFwiY29va2llY29uc2VudC1vcHRpbi1zdGF0aXN0aWNzXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXF1aXJlZENhdGVnb3JpZXNbal0gPT09IFwibWFya2V0aW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2xhc3MoY3VycmVudElmcmFtZSwgXCJjb29raWVjb25zZW50LW9wdGluLW1hcmtldGluZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNvbnNldEVsZW1lbnRzQ2xhc3Nlc0FycmF5ID0gW1xuICAgICAgICAgICAgXCIuY29va2llY29uc2VudC1vcHRvdXQtcHJlZmVyZW5jZXNcIixcbiAgICAgICAgICAgIFwiLmNvb2tpZWNvbnNlbnQtb3B0b3V0LXN0YXRpc3RpY3NcIixcbiAgICAgICAgICAgIFwiLmNvb2tpZWNvbnNlbnQtb3B0b3V0LW1hcmtldGluZ1wiLFxuICAgICAgICAgICAgXCIuY29va2llY29uc2VudC1vcHRpbi1wcmVmZXJlbmNlc1wiLFxuICAgICAgICAgICAgXCIuY29va2llY29uc2VudC1vcHRpbi1zdGF0aXN0aWNzXCIsXG4gICAgICAgICAgICBcIi5jb29raWVjb25zZW50LW9wdGluLW1hcmtldGluZ1wiLFxuICAgICAgICAgICAgXCIuY29va2llY29uc2VudC1vcHRpblwiLFxuICAgICAgICAgICAgXCIuY29va2llY29uc2VudC1vcHRvdXRcIlxuICAgICAgICBdO1xuICAgICAgICB2YXIgY29uc2VudEVsZW1lbnRzQ2xhc3NlcyA9IGNvbnNldEVsZW1lbnRzQ2xhc3Nlc0FycmF5LmpvaW4oJywnKTtcbiAgICAgICAgdmFyIGNvbnNlbnRFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoY29uc2VudEVsZW1lbnRzQ2xhc3Nlcyk7XG5cbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBjb25zZW50RWxlbWVudHMubGVuZ3RoOyBrKyspIHtcblxuICAgICAgICAgICAgdmFyIHNob3dFbGVtZW50ID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICh0aGlzLmhhc0NsYXNzKGNvbnNlbnRFbGVtZW50c1trXSwgXCJjb29raWVjb25zZW50LW9wdGluXCIpICYmICF3aW5kb3cuQ29va2llQ29uc2VudC5jb25zZW50ZWQpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMuaGFzQ2xhc3MoY29uc2VudEVsZW1lbnRzW2tdLCBcImNvb2tpZWNvbnNlbnQtb3B0aW4tcHJlZmVyZW5jZXNcIikgJiYgIXdpbmRvdy5Db29raWVDb25zZW50LmNvbnNlbnQucHJlZmVyZW5jZXMpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMuaGFzQ2xhc3MoY29uc2VudEVsZW1lbnRzW2tdLCBcImNvb2tpZWNvbnNlbnQtb3B0aW4tc3RhdGlzdGljc1wiKSAmJiAhd2luZG93LkNvb2tpZUNvbnNlbnQuY29uc2VudC5zdGF0aXN0aWNzKSB8fFxuICAgICAgICAgICAgICAgICh0aGlzLmhhc0NsYXNzKGNvbnNlbnRFbGVtZW50c1trXSwgXCJjb29raWVjb25zZW50LW9wdGluLW1hcmtldGluZ1wiKSAmJiAhd2luZG93LkNvb2tpZUNvbnNlbnQuY29uc2VudC5tYXJrZXRpbmcpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMuaGFzQ2xhc3MoY29uc2VudEVsZW1lbnRzW2tdLCBcImNvb2tpZWNvbnNlbnQtb3B0b3V0XCIpICYmIHdpbmRvdy5Db29raWVDb25zZW50LmNvbnNlbnRlZCkgfHxcbiAgICAgICAgICAgICAgICAodGhpcy5oYXNDbGFzcyhjb25zZW50RWxlbWVudHNba10sIFwiY29va2llY29uc2VudC1vcHRvdXQtcHJlZmVyZW5jZXNcIikgJiYgd2luZG93LkNvb2tpZUNvbnNlbnQuY29uc2VudC5wcmVmZXJlbmNlcykgfHxcbiAgICAgICAgICAgICAgICAodGhpcy5oYXNDbGFzcyhjb25zZW50RWxlbWVudHNba10sIFwiY29va2llY29uc2VudC1vcHRvdXQtc3RhdGlzdGljc1wiKSAmJiB3aW5kb3cuQ29va2llQ29uc2VudC5jb25zZW50LnN0YXRpc3RpY3MpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMuaGFzQ2xhc3MoY29uc2VudEVsZW1lbnRzW2tdLCBcImNvb2tpZWNvbnNlbnQtb3B0b3V0LW1hcmtldGluZ1wiKSAmJiB3aW5kb3cuQ29va2llQ29uc2VudC5jb25zZW50Lm1hcmtldGluZylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHNob3dFbGVtZW50ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAodGhpcy5oYXNDbGFzcyhjb25zZW50RWxlbWVudHNba10sIFwiY29va2llY29uc2VudC1vcHRvdXQtcHJlZmVyZW5jZXNcIikgJiYgIXdpbmRvdy5Db29raWVDb25zZW50LmNvbnNlbnQucHJlZmVyZW5jZXMpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMuaGFzQ2xhc3MoY29uc2VudEVsZW1lbnRzW2tdLCBcImNvb2tpZWNvbnNlbnQtb3B0b3V0LXN0YXRpc3RpY3NcIikgJiYgIXdpbmRvdy5Db29raWVDb25zZW50LmNvbnNlbnQuc3RhdGlzdGljcykgfHxcbiAgICAgICAgICAgICAgICAodGhpcy5oYXNDbGFzcyhjb25zZW50RWxlbWVudHNba10sIFwiY29va2llY29uc2VudC1vcHRvdXQtbWFya2V0aW5nXCIpICYmICF3aW5kb3cuQ29va2llQ29uc2VudC5jb25zZW50Lm1hcmtldGluZylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHNob3dFbGVtZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNob3dFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5RWxlbWVudChjb25zZW50RWxlbWVudHNba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlRWxlbWVudChjb25zZW50RWxlbWVudHNba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5oaWRlRWxlbWVudCA9IGZ1bmN0aW9uIChIVE1MRWxlbWVudCkge1xuICAgICAgICBpZiAoKEhUTUxFbGVtZW50LnRhZ05hbWUgPT09IFwiU09VUkNFXCIpICYmIChIVE1MRWxlbWVudC5wYXJlbnROb2RlKSkge1xuICAgICAgICAgICAgSFRNTEVsZW1lbnQgPSBIVE1MRWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICAgIGFwcGx5UnVudGltZVN0eWxlc2hlZXQoZG9jdW1lbnQsIHRoaXMubm9uY2UpO1xuICAgICAgICBIVE1MRWxlbWVudC5zZXRBdHRyaWJ1dGUoREFUQV9ESVNQTEFZX05PTkUsIFwidHJ1ZVwiKTtcbiAgICB9XG5cbiAgICB0aGlzLmRpc3BsYXlFbGVtZW50ID0gZnVuY3Rpb24gKEhUTUxFbGVtZW50KSB7XG4gICAgICAgIGlmICgoSFRNTEVsZW1lbnQudGFnTmFtZSA9PT0gXCJTT1VSQ0VcIikgJiYgKEhUTUxFbGVtZW50LnBhcmVudE5vZGUpKSB7XG4gICAgICAgICAgICBIVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50LnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgIGlmIChIVE1MRWxlbWVudC50YWdOYW1lID09PSBcIkFVRElPXCIpIHtcbiAgICAgICAgICAgICAgICBIVE1MRWxlbWVudC5sb2FkKCk7IC8vcmVsb2FkIHRoZSBhdWRpbyBlbGVtZW50IHdoZW4gdW5ibG9ja2luZyBhIHNvdXJjZSBjaGlsZCBlbGVtZW50XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEhUTUxFbGVtZW50Lmhhc0F0dHJpYnV0ZSAmJiBIVE1MRWxlbWVudC5oYXNBdHRyaWJ1dGUoREFUQV9ESVNQTEFZX05PTkUpKSB7XG4gICAgICAgICAgICBIVE1MRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoREFUQV9ESVNQTEFZX05PTkUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5yZWdpc3RlckRpc3BsYXlTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gRGVwcmVjYXRlZDogdGhlIERBVEFfRElTUExBWV9OT05FIGhpZGUvc2hvdyBhcHByb2FjaCByZXN0b3JlcyB0aGUgZWxlbWVudCdzXG4gICAgICAgIC8vIENTUy1kZWZpbmVkIGRpc3BsYXkgbmF0dXJhbGx5IHdoZW4gdGhlIGF0dHJpYnV0ZSBpcyByZW1vdmVkLCBzbyBub1xuICAgICAgICAvLyBwcmUtbWVhc3VyZW1lbnQgaXMgcmVxdWlyZWQuIEtlcHQgZm9yIGJhY2t3YXJkcy1jb21wYXRpYmxlIGNhbGwgc2l0ZXMuXG4gICAgfVxuXG4gICAgdGhpcy5oYXNDbGFzcyA9IGZ1bmN0aW9uIChIVE1MRWxlbWVudCwgY2xzKSB7XG4gICAgICAgIHJldHVybiAoSFRNTEVsZW1lbnQuY2xhc3NOYW1lICYmIEhUTUxFbGVtZW50LmNsYXNzTmFtZS5tYXRjaChuZXcgUmVnRXhwKCcoXFxcXHN8XiknICsgY2xzICsgJyhcXFxcc3wkKScpKSk7XG4gICAgfVxuXG4gICAgdGhpcy5hZGRDbGFzcyA9IGZ1bmN0aW9uIChIVE1MRWxlbWVudCwgY2xzKSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNDbGFzcyhIVE1MRWxlbWVudCwgY2xzKSkge1xuICAgICAgICAgICAgSFRNTEVsZW1lbnQuY2xhc3NOYW1lICs9IFwiIFwiICsgY2xzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIChIVE1MRWxlbWVudCwgY2xzKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0NsYXNzKEhUTUxFbGVtZW50LCBjbHMpKSB7XG4gICAgICAgICAgICBIVE1MRWxlbWVudC5jbGFzc05hbWUgPSBIVE1MRWxlbWVudC5jbGFzc05hbWUucmVwbGFjZShjbHMsIFwiXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXRPbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vbG9hZCB2ZXJzaW9uIHN0YXRlIGZyb20gQ0ROXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLmlzT3V0T2ZSZWdpb24pIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhhdC52ZXJzaW9uUmVxdWVzdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQudmVyc2lvblJlcXVlc3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhhdC52ZXJzaW9uQ2hlY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5nZXRTY3JpcHQodGhhdC5DRE4gKyBcIi9jb25zZW50Y29uZmlnL1wiICsgdGhhdC5zZXJpYWwgKyBcIi9zdGF0ZS5qc1wiLCB0cnVlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC52ZXJzaW9uQ2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy52ZXJzaW9uUmVxdWVzdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMudmVyc2lvbkNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy93YWl0IGZvciBidWxrIHJlc2V0IGRvbWFpbnMgdG8gbG9hZFxuICAgICAgICBpZiAoIXRoaXMuaWZyYW1lUmVhZHkgJiYgdGhpcy5zZXRPbmxvYWRGcmFtZVJldHJ5Q291bnRlciA8IDQwKSB7XG4gICAgICAgICAgICB0aGlzLnNldE9ubG9hZEZyYW1lUmV0cnlDb3VudGVyKys7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoYXQuc2V0T25sb2FkKCk7XG4gICAgICAgICAgICB9LCA1MCk7IC8vd2FpdCBmb3IgYnVsayBjb25zZW50IGNoZWNrIHRvIGxvYWRcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lUmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zZXRPbmxvYWRGcmFtZVJldHJ5Q291bnRlciA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuYnVsa2NvbnNlbnRzdWJtaXR0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JCdWxrQ29uc2VudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLm11dGF0aW9uRmFsbGJhY2spIHsgLy90cmlnZ2VyT25sb2FkRXZlbnRzIHdpbGwgYmUgY2FsbGVkIGRpcmVjdGx5IHdoZW4gZmluaXNoZWQgcHJvY2Vzc2luZyBtdXRhdGlvbiBmYWxsYmFja1xuICAgICAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5KSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIHRoYXQudHJpZ2dlck9ubG9hZEV2ZW50cy5iaW5kKHRoYXQpLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoKHR5cGVvZiBkb2N1bWVudC5yZWFkeVN0YXRlKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC50cmlnZ2VyT25sb2FkRXZlbnRzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxKTsgLy93YWl0IGZvciBDb29raWVDb25zZW50IHRvIGNvbnN0cnVjdCB1c2luZyBzZXRUaW1lb3V0XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnNldE9ubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwKTsgLy93YWl0IGZvciBhbGwgZWxlbWVudHMgdG8gbG9hZFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgeyAvL3JlYWR5U3RhdGUgbm90IHN1cHBvcnRlZCBieSB2aXNpdG9ycyBicm93c2VyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC50cmlnZ2VyT25sb2FkRXZlbnRzKCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7IC8vd2FpdCBmb3IgQ29va2llQ29uc2VudCB0byBjb25zdHJ1Y3QgdXNpbmcgc2V0VGltZW91dFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5pdFdpZGdldCgpO1xuICAgIH1cblxuICAgIHRoaXMudHJpZ2dlck9ubG9hZEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy9jaGVjayBpZiBnbG9iYWwgY29uc2VudCB2ZXJzaW9uIGhhcyBsb2FkZWRcbiAgICAgICAgaWYgKCghdGhpcy52ZXJzaW9uQ2hlY2tlZCkgJiYgKHRoaXMucmV0cnlDb3VudGVyIDwgMTApKSB7XG4gICAgICAgICAgICB0aGlzLnJldHJ5Q291bnRlciArPSAxO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQudHJpZ2dlck9ubG9hZEV2ZW50cygpO1xuICAgICAgICAgICAgfSwgMTAwKTsgLy93YWl0IGZvciBjb25zZW50IHZlcnNpb24gY2hlY2sgdG8gbG9hZFxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXRyeUNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAvL2NoZWNrIGlmIG5ldyBjb25zZW50IG11c3QgYmUgY29sbGVjdGVkXG4gICAgICAgICAgICBpZiAodGhpcy52ZXJzaW9uIDwgdGhpcy5sYXRlc3RWZXJzaW9uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc05ld1ZlcnNpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5wcmVmZXJlbmNlcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5zdGF0aXN0aWNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25zZW50Lm1hcmtldGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuY29uc2VudC5tZXRob2QgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzUmVzcG9uc2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNlbnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjbGluZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKCh0eXBlb2YgKHdpbmRvdy5Db29raWVEZWNsYXJhdGlvbikgIT09ICd1bmRlZmluZWQnKSAmJiAodHlwZW9mICh3aW5kb3cuQ29va2llRGVjbGFyYXRpb24uU2V0VXNlclN0YXR1c0xhYmVsKSA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llRGVjbGFyYXRpb24uU2V0VXNlclN0YXR1c0xhYmVsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuYXBwbHlEaXNwbGF5KCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNob3coZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuYXBwbHlEaXNwbGF5KCk7XG5cbiAgICAgICAgICAgIC8vdXBkYXRlIHN0YXR1c2xhYmVsIGlmIHVzZXIgaXMgb24gcGFnZSB3aXRoIGluamVjdGVkIGNvb2tpZSBkZWNsYXJhdGlvblxuICAgICAgICAgICAgaWYgKCh0eXBlb2YgKHdpbmRvdy5Db29raWVEZWNsYXJhdGlvbikgIT09ICd1bmRlZmluZWQnKSAmJiAodHlwZW9mICh3aW5kb3cuQ29va2llRGVjbGFyYXRpb24uU2V0VXNlclN0YXR1c0xhYmVsKSA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVEZWNsYXJhdGlvbi5TZXRVc2VyU3RhdHVzTGFiZWwoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGV2ZW50O1xuXG4gICAgICAgICAgICBpZiAod2luZG93LkNvb2tpZUNvbnNlbnQub25sb2FkKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQub25sb2FkKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93LkNvb2tpZWJvdENhbGxiYWNrX09uTG9hZCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZWJvdENhbGxiYWNrX09uTG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHdpbmRvdy5Db29raWVDb25zZW50Q2FsbGJhY2tfT25Mb2FkID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudENhbGxiYWNrX09uTG9hZCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xuICAgICAgICAgICAgZXZlbnQuaW5pdEV2ZW50KCdDb29raWVib3RPbkxvYWQnLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuICAgICAgICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgIGV2ZW50LmluaXRFdmVudCgnQ29va2llQ29uc2VudE9uTG9hZCcsIHRydWUsIHRydWUpO1xuICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5jaGFuZ2VkKSB7IC8vb25seSBmaXJlIHRoZXNlIGV2ZW50cyB3aGVuIGNvb2tpZSBjb25zZW50IGlzIG5ldy9jaGFuZ2VkLCBhcyB0aGV5IG90aGVyd2lzZSB3aWxsIGZpcmUgYXV0b21hdGljYWxseSBpbiBHVE1cbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJHVE1FdmVudHMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy90cmlnZ2VyIGFjY2VwdC9kZWNsaW5lIGV2ZW50cyBvbiBsb2FkXG4gICAgICAgICAgICBpZiAod2luZG93LkNvb2tpZUNvbnNlbnQuY29uc2VudGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5Db29raWVDb25zZW50Lm9uYWNjZXB0KSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50Lm9uYWNjZXB0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93LkNvb2tpZWJvdENhbGxiYWNrX09uQWNjZXB0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZWJvdENhbGxiYWNrX09uQWNjZXB0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cuQ29va2llQ29uc2VudENhbGxiYWNrX09uQWNjZXB0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnRDYWxsYmFja19PbkFjY2VwdCgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgICAgICAgICAgZXZlbnQuaW5pdEV2ZW50KCdDb29raWVib3RPbkFjY2VwdCcsIHRydWUsIHRydWUpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuICAgICAgICAgICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgICAgICAgICAgZXZlbnQuaW5pdEV2ZW50KCdDb29raWVDb25zZW50T25BY2NlcHQnLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XG5cbiAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5ydW5TY3JpcHRzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LkNvb2tpZUNvbnNlbnQub25kZWNsaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50Lm9uZGVjbGluZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5Db29raWVib3RDYWxsYmFja19PbkRlY2xpbmUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llYm90Q2FsbGJhY2tfT25EZWNsaW5lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cuQ29va2llQ29uc2VudENhbGxiYWNrX09uRGVjbGluZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50Q2FsbGJhY2tfT25EZWNsaW5lKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICBldmVudC5pbml0RXZlbnQoJ0Nvb2tpZWJvdE9uRGVjbGluZScsIHRydWUsIHRydWUpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuICAgICAgICAgICAgICAgIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgICAgICAgICAgZXZlbnQuaW5pdEV2ZW50KCdDb29raWVDb25zZW50T25EZWNsaW5lJywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5zaWduYWxDb25zZW50RnJhbWV3b3JrKCk7XG5cbiAgICAgICAgICAgIC8vcmVtb3ZlIGN1cnJlbnQgZG9tYWluIG5hbWUgZnJvbSBidWxrIHJlc2V0IGxpc3QgaWYgbm8gY29uc2VudCBleGlzdHMgZm9yIHRoZSBkb21haW5cbiAgICAgICAgICAgIGlmICh0aGlzLmlmcmFtZSAmJiAoISh0aGlzLmNvbnNlbnRlZCB8fCB0aGlzLmRlY2xpbmVkKSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudEhvc3QgPSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB2YXIgYWx0aG9zdCA9IGN1cnJlbnRIb3N0O1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50SG9zdC5pbmRleE9mKFwid3d3LlwiKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBhbHRob3N0ID0gYWx0aG9zdC5zdWJzdHJpbmcoNCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbHRob3N0ID0gXCJ3d3cuXCIgKyBhbHRob3N0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuYnVsa3Jlc2V0ZG9tYWlucyA9IHRoaXMuYnVsa3Jlc2V0ZG9tYWlucy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgoaXRlbSAhPT0gY3VycmVudEhvc3QpICYmIChpdGVtICE9PSBhbHRob3N0KSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQnVsa1N0b3JhZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmdldEdUTURhdGFMYXllciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHdpbmRvd1t0aGlzLmRhdGFMYXllck5hbWVdID09IG51bGwpIHtcbiAgICAgICAgICAgIHdpbmRvd1t0aGlzLmRhdGFMYXllck5hbWVdID0gW107IC8vIGNyZWF0ZSBkZWZhdWx0IEdUTSBkYXRhLWxheWVyIHN0dWJcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHdpbmRvd1t0aGlzLmRhdGFMYXllck5hbWVdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvd1t0aGlzLmRhdGFMYXllck5hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtdOyAvLyBtb2NrIGRhdGEtbGF5ZXI6IEdUTSBkYXRhLWxheWVyIGlzIHVuYXZhaWxhYmxlXG4gICAgfTtcblxuICAgIHRoaXMuZ2V0TXNEYXRhTGF5ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHdpbmRvdy51ZXRxID0gd2luZG93LnVldHEgfHwgW107XG4gICAgICByZXR1cm4gd2luZG93LnVldHE7XG4gICAgfVxuXG4gICAgdGhpcy50cmlnZ2VyR1RNRXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5jb25zZW50LnByZWZlcmVuY2VzKSB7XG4gICAgICAgICAgICB0aGlzLmdldEdUTURhdGFMYXllcigpLnB1c2goeyAnZXZlbnQnOiAnY29va2llX2NvbnNlbnRfcHJlZmVyZW5jZXMnIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvbnNlbnQuc3RhdGlzdGljcykge1xuICAgICAgICAgICAgdGhpcy5nZXRHVE1EYXRhTGF5ZXIoKS5wdXNoKHsgJ2V2ZW50JzogJ2Nvb2tpZV9jb25zZW50X3N0YXRpc3RpY3MnIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvbnNlbnQubWFya2V0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLmdldEdUTURhdGFMYXllcigpLnB1c2goeyAnZXZlbnQnOiAnY29va2llX2NvbnNlbnRfbWFya2V0aW5nJyB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2lnbmFsTXNDb25zZW50QVBJID0gZnVuY3Rpb24oY29uc2VudE1hcmtldGluZykge1xuICAgICAgICBpZiAoIXRoaXMubXNDb25zZW50TW9kZURpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmdldE1zRGF0YUxheWVyKCkucHVzaCgnY29uc2VudCcsICd1cGRhdGUnLCB7XG4gICAgICAgICAgICAgICAgJ2FkX3N0b3JhZ2UnOiAoY29uc2VudE1hcmtldGluZyA/ICdncmFudGVkJyA6ICdkZW5pZWQnKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNpZ25hbE1zQ2xhcml0eUNvbnNlbnRBUEkgPSBmdW5jdGlvbihjb25zZW50TWFya2V0aW5nLCBjb25zZW50U3RhdGlzdGljcykge1xuICAgICAgICBpZiAodGhpcy5tc0NsYXJpdHlDb25zZW50TW9kZUVuYWJsZWQgJiYgd2luZG93LmNsYXJpdHkpIHtcbiAgICAgICAgICAgIHdpbmRvdy5jbGFyaXR5KCdjb25zZW50djInLCB7XG4gICAgICAgICAgICAgICAgJ3NvdXJjZSc6IE1TX0NMQVJJVFlfQ01QX1NPVVJDRV9JRCxcbiAgICAgICAgICAgICAgICAnYWRfU3RvcmFnZSc6IChjb25zZW50TWFya2V0aW5nID8gJ2dyYW50ZWQnIDogJ2RlbmllZCcpLFxuICAgICAgICAgICAgICAgICdhbmFseXRpY3NfU3RvcmFnZSc6IChjb25zZW50U3RhdGlzdGljcyA/ICdncmFudGVkJyA6ICdkZW5pZWQnKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNpZ25hbEdvb2dsZUNvbnNlbnRBUEkgPSBmdW5jdGlvbiAoZ29vZ2xlQ29uc2VudE1vZGVEaXNhYmxlZCwgZGF0YVJlZGFjdGlvbk1vZGUsIGNvbnNlbnRQcmVmZXJlbmNlcywgY29uc2VudFN0YXRpc3RpY3MsIGNvbnNlbnRNYXJrZXRpbmcpIHtcbiAgICAgICAgaWYgKCFnb29nbGVDb25zZW50TW9kZURpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnB1c2hHb29nbGVDb25zZW50KCdjb25zZW50JywgJ3VwZGF0ZScsIHtcbiAgICAgICAgICAgICAgICAnYWRfc3RvcmFnZSc6IChjb25zZW50TWFya2V0aW5nID8gJ2dyYW50ZWQnIDogJ2RlbmllZCcpLFxuICAgICAgICAgICAgICAgICdhZF91c2VyX2RhdGEnOiAoY29uc2VudE1hcmtldGluZyA/ICdncmFudGVkJyA6ICdkZW5pZWQnKSxcbiAgICAgICAgICAgICAgICAnYWRfcGVyc29uYWxpemF0aW9uJzogKGNvbnNlbnRNYXJrZXRpbmcgPyAnZ3JhbnRlZCcgOiAnZGVuaWVkJyksXG4gICAgICAgICAgICAgICAgJ2FuYWx5dGljc19zdG9yYWdlJzogKGNvbnNlbnRTdGF0aXN0aWNzID8gJ2dyYW50ZWQnIDogJ2RlbmllZCcpLFxuICAgICAgICAgICAgICAgICdmdW5jdGlvbmFsaXR5X3N0b3JhZ2UnOiAoY29uc2VudFByZWZlcmVuY2VzID8gJ2dyYW50ZWQnIDogJ2RlbmllZCcpLFxuICAgICAgICAgICAgICAgICdwZXJzb25hbGl6YXRpb25fc3RvcmFnZSc6IChjb25zZW50UHJlZmVyZW5jZXMgPyAnZ3JhbnRlZCcgOiAnZGVuaWVkJyksXG4gICAgICAgICAgICAgICAgJ3NlY3VyaXR5X3N0b3JhZ2UnOiAnZ3JhbnRlZCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoZGF0YVJlZGFjdGlvbk1vZGUgPT09ICdkeW5hbWljJykgeyAvLyBhZHNfZGF0YV9yZWRhY3Rpb24gaXMgaGFuZGxlZCBieSB0aGUgR1RNIHRlbXBsYXRlIHdoZW4gdXNpbmcgdHJ1ZSAvIGZhbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5wdXNoR29vZ2xlQ29uc2VudCgnc2V0JywgJ2Fkc19kYXRhX3JlZGFjdGlvbicsICFjb25zZW50TWFya2V0aW5nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy91c2VkIHdpdGggR1RNIENvbnNlbnQgTW9kZSBmZWF0dXJlICdBZGRpdGlvbmFsIENvbnNlbnQnIHRvIGZpcmUgdGFncyBpbiBHVE0gdGhhdCBkbyBub3Qgc3VwcG9ydCBHVE0gYnVpbHQtaW4gY29uc2VudC4gTXVzdCBiZSBjYWxsZWQgYWZ0ZXIgcHVzaEdvb2dsZUNvbnNlbnQuXG4gICAgICAgICAgICB0aGlzLmdldEdUTURhdGFMYXllcigpLnB1c2goeyAnZXZlbnQnOiAnY29va2llX2NvbnNlbnRfdXBkYXRlJyB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucHVzaEdvb2dsZUNvbnNlbnQgPSBmdW5jdGlvbiBndGFnKCkge1xuICAgICAgICB0aGlzLmdldEdUTURhdGFMYXllcigpLnB1c2goYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgdGhpcy5zaG93ID0gZnVuY3Rpb24gKGlzUmVuZXdhbCwgc2hvdWxkUmVzZXRDb29raWVzKSB7XG4gICAgICAgIGlmICghaXNSZW5ld2FsKSB7XG4gICAgICAgICAgICB0aGlzLmZvcmNlU2hvdyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb29raWVFbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmhhc1Jlc3BvbnNlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3MoaXNSZW5ld2FsLCBzaG91bGRSZXNldENvb2tpZXMpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzUmVuZXdhbCkge1xuICAgICAgICAgICAgYWxlcnQoJ1BsZWFzZSBlbmFibGUgY29va2llcyBpbiB5b3VyIGJyb3dzZXIgdG8gcHJvY2VlZC4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LkNvb2tpZUNvbnNlbnREaWFsb2cpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnREaWFsb2cuaGlkZSh0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucmVuZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaXNSZW5ld2FsID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zaG93KHRydWUpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyAvL3Nob3cgZGV0YWlscyBwYW5lIGlmIGlubGluZSBvcHRpblxuICAgICAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LkNvb2tpZUNvbnNlbnREaWFsb2cpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuQ29va2llQ29uc2VudERpYWxvZy5yZXNwb25zZU1vZGUgPT09IFwiaW5saW5lb3B0aW5cIikge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudERpYWxvZy50b2dnbGVEZXRhaWxzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCAzMDApO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0VVJMUGFyYW0gPSBmdW5jdGlvbiAocGFyYW1OYW1lKSB7XG4gICAgICAgIHZhciBkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5zY3JpcHRJZCkgfHwgdGhpcy5zY3JpcHRFbGVtZW50O1xuICAgICAgICB2YXIgdXJsUGFyYW0gPSBcIlwiO1xuXG4gICAgICAgIGlmIChkKSB7XG4gICAgICAgICAgICBwYXJhbU5hbWUgPSAobmV3IFJlZ0V4cCgnWz8mXScgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1OYW1lKSArICc9KFteJiNdKiknKSkuZXhlYyhkLnNyYyk7XG4gICAgICAgICAgICBpZiAocGFyYW1OYW1lKSB7XG4gICAgICAgICAgICAgICAgdXJsUGFyYW0gPSBkZWNvZGVVUklDb21wb25lbnQocGFyYW1OYW1lWzFdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHVybFBhcmFtO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0RG9tYWluVXJsUGFyYW0gPSBmdW5jdGlvbiAocGFyYW1OYW1lKSB7XG4gICAgICAgIHZhciB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgcGFyYW1OYW1lID0gcGFyYW1OYW1lLnJlcGxhY2UoL1tcXFtcXF1dL2csICdcXFxcJCYnKTtcbiAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnWz8mXScgKyBwYXJhbU5hbWUgKyAnKD0oW14mI10qKXwmfCN8JCknKSwgcmVzdWx0cyA9IHJlZ2V4LmV4ZWModXJsKTtcblxuICAgICAgICBpZiAoIXJlc3VsdHMpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyZXN1bHRzWzJdKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJlc3VsdHNbMl0ucmVwbGFjZSgvXFwrL2csICcgJykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBkZXByZWNhdGVkIFVzZSB7QGxpbmsgY3JlYXRlQmFubmVyUHJvbWlzZX0gZGlyZWN0bHkgaW5zdGVhZC4gRXhpc3RzIG9ubHkga2VlcCB0aGUgQ29va2llYm90IEFQSSBjb25zaXN0ZW50XG4gICAgICovXG4gICAgdGhpcy5wcm9jZXNzID0gZnVuY3Rpb24gKGlzUmVuZXdhbCwgc2hvdWxkUmVzZXRDb29raWVzKSB7XG4gICAgICAgIGNyZWF0ZUJhbm5lcih0aGlzLCBpc1JlbmV3YWwpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmIChzaG91bGRSZXNldENvb2tpZXMgJiYgd2luZG93LkNvb2tpZUNvbnNlbnREaWFsb2cpIHtcbiAgICAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5yZXNldENvb2tpZXMoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudERpYWxvZyAmJiB3aW5kb3cuQ29va2llQ29uc2VudERpYWxvZy5pbml0KCk7XG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuY2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmdldENvb2tpZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHZhciBjb25zZW50Q29va2llVmFsdWUgPSBcIlwiO1xuICAgICAgICB2YXIgZG9jdW1lbnRDb29raWVzID0gZG9jdW1lbnQuY29va2llO1xuICAgICAgICB2YXIgY29va2llID0gdW5kZWZpbmVkOyAvL2RlZmF1bHQgdmFsdWUgaXMgcmVxdXJpZWQgdG8gYmUgXCJ1bmRlZmluZWRcIiBmb3IgY29va2llYm90c3RhdGljYmFzZSBjaGVja1xuXG4gICAgICAgIHZhciBpLCB4LCB5LCBsID0gZG9jdW1lbnRDb29raWVzLnNwbGl0KFwiO1wiKTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHggPSBsW2ldLnN1YnN0cigwLCBsW2ldLmluZGV4T2YoXCI9XCIpKTtcbiAgICAgICAgICAgIHkgPSBsW2ldLnN1YnN0cihsW2ldLmluZGV4T2YoXCI9XCIpICsgMSk7XG4gICAgICAgICAgICB4ID0geC5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCBcIlwiKTsgLy90cmltIHdoaXRlc3BhY2VcbiAgICAgICAgICAgIGlmICh4ID09PSBuYW1lKSB7XG5cbiAgICAgICAgICAgICAgICAvL0ZhbGxiYWNrIHdvcmthcm91bmQgZm9yIElFIGJ1ZyBub3QgY29tbGlhbnQgd2l0aCBSRkMgNjI2NSwgcmVhZGluZyBjb25zZW50Y29va2llIGZyb20gYm90aFxuICAgICAgICAgICAgICAgIC8vcm9vdCBkb21haW4gY29va2llIGFuZCBzdWJkb21haW4gb24gc3ViZG9tYWlucywgaWYgY29va2llIGZvciByb290IGlzIHNldCBmaXJzdDogaHR0cHM6Ly9kZXZlbG9wZXIubWljcm9zb2Z0LmNvbS9lbi11cy9taWNyb3NvZnQtZWRnZS9wbGF0Zm9ybS9pc3N1ZXMvODE4MzcwOC8uXG4gICAgICAgICAgICAgICAgaWYgKChuYW1lID09PSB0aGlzLm5hbWUpICYmICgoZG9jdW1lbnRDb29raWVzLnNwbGl0KG5hbWUpLmxlbmd0aCAtIDEpID4gMSkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKHkubGVuZ3RoID4gY29uc2VudENvb2tpZVZhbHVlLmxlbmd0aCkgfHwgKHkgPT09IFwiMFwiKSkgLy91c2UgbG9uZ2VzdCBzdHJpbmcgKGNvbnNlbnQgZ2l2ZW4pIG9yIG9wdC1vdXRcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc2VudENvb2tpZVZhbHVlID0geTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29va2llID0gdW5lc2NhcGUoeSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnNlbnRDb29raWVWYWx1ZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgY29va2llID0gdW5lc2NhcGUoY29uc2VudENvb2tpZVZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb29raWU7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRDb29raWUgPSBmdW5jdGlvbiAodmFsdWUsIGV4cGlyZWRhdGUsIHBhdGgsIGRvbWFpbiwgc2VjdXJlKSB7XG4gICAgICAgIHZhciBpc1NlY3VyZSA9ICh3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT09IFwiaHR0cHM6XCIpO1xuICAgICAgICBpZiAoc2VjdXJlKSB7IC8vb3ZlcnJpZGUgZGVmYXVsdFxuICAgICAgICAgICAgaXNTZWN1cmUgPSBzZWN1cmU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvb2tpZURlZiA9IHRoaXMubmFtZSArIFwiPVwiICsgdmFsdWUgK1xuICAgICAgICAgICAgKChleHBpcmVkYXRlKSA/IFwiO2V4cGlyZXM9XCIgKyBleHBpcmVkYXRlLnRvR01UU3RyaW5nKCkgOiBcIlwiKSArXG4gICAgICAgICAgICAoKHBhdGgpID8gXCI7cGF0aD1cIiArIHBhdGggOiBcIlwiKSArXG4gICAgICAgICAgICAoKGRvbWFpbikgPyBcIjtkb21haW49XCIgKyBkb21haW4gOiBcIlwiKSArXG4gICAgICAgICAgICAoKGlzU2VjdXJlKSA/IFwiO3NlY3VyZVwiIDogXCJcIik7XG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZURlZjtcbiAgICB9XG5cbiAgICB0aGlzLnJlbW92ZUNvb2tpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llLnNwbGl0KFwiO1wiKTtcbiAgICAgICAgdmFyIHBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3BsaXQoJy8nKTtcbiAgICAgICAgdmFyIGhvc3RuYW1lID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lO1xuICAgICAgICB2YXIgaXNXd3dEb21haW4gPSBob3N0bmFtZS5zdWJzdHJpbmcoMCwgMykgPT09IFwid3d3XCI7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb29raWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29va2llID0gY29va2llc1tpXTtcbiAgICAgICAgICAgIHZhciBuYW1lRW5kUG9zID0gY29va2llLmluZGV4T2YoXCI9XCIpO1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBuYW1lRW5kUG9zID4gLTEgPyBjb29raWUuc3Vic3RyKDAsIG5hbWVFbmRQb3MpIDogY29va2llO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvXlxccyovLCBcIlwiKS5yZXBsYWNlKC9cXHMqJC8sIFwiXCIpOyAvL3RyaW0gd2hpdGVzcGFjZXNcblxuICAgICAgICAgICAgdmFyIGlzV2hpdGVMaXN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy53aGl0ZWxpc3QubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy53aGl0ZWxpc3Rbal0gPT09IG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNXaGl0ZUxpc3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCghaXNXaGl0ZUxpc3RlZCkgJiYgKG5hbWUgIT09IHRoaXMubmFtZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGF0aFN0cmluZyA9IFwiO3BhdGg9XCI7XG4gICAgICAgICAgICAgICAgdmFyIGV4cGlyZVN0cmluZyA9IFwiPTtleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDAgR01UXCI7XG4gICAgICAgICAgICAgICAgdmFyIGRvbWFpblN0cmluZyA9IFwiO2RvbWFpbj1cIjtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgZXhwaXJlU3RyaW5nO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgcGF0aC5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBwYXRoU3RyaW5nICs9ICgocGF0aFN0cmluZy5zdWJzdHIoLTEpICE9PSAnLycpID8gJy8nIDogJycpICsgcGF0aFtrXTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIGV4cGlyZVN0cmluZyArIHBhdGhTdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBleHBpcmVTdHJpbmcgKyBwYXRoU3RyaW5nICsgZG9tYWluU3RyaW5nICsgZXNjYXBlKGhvc3RuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIGV4cGlyZVN0cmluZyArIHBhdGhTdHJpbmcgKyBkb21haW5TdHJpbmcgKyBcIi5cIiArIGVzY2FwZShob3N0bmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBleHBpcmVTdHJpbmcgKyBwYXRoU3RyaW5nICsgZG9tYWluU3RyaW5nICsgZXNjYXBlKHRoaXMuZ2V0Um9vdERvbWFpbihob3N0bmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgZXhwaXJlU3RyaW5nICsgcGF0aFN0cmluZyArIGRvbWFpblN0cmluZyArIFwiLlwiICsgZXNjYXBlKHRoaXMuZ2V0Um9vdERvbWFpbihob3N0bmFtZSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1d3d0RvbWFpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIGV4cGlyZVN0cmluZyArIHBhdGhTdHJpbmcgKyBkb21haW5TdHJpbmcgKyBlc2NhcGUoaG9zdG5hbWUuc3Vic3RyaW5nKDMpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIWlzU3RvcmFnZVN1cHBvcnRlZCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuOyAvL2JhaWwgd2hlbiBsb2NhbFN0b3JhZ2UgaXMgbm90IHN1cHBvcnRlZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UuY2xlYXIoKTtcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmdldFJvb3REb21haW4gPSBmdW5jdGlvbiAoZG9tYWluKSB7XG4gICAgICAgIHZhciByb290RG9tYWluID0gZG9tYWluO1xuICAgICAgICBpZiAoZG9tYWluLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBzZWN0aW9ucyA9IHJvb3REb21haW4uc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGlmIChyb290RG9tYWluLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICByb290RG9tYWluID0gc2VjdGlvbnMuc2xpY2UoLTIpLmpvaW4oJy4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcm9vdERvbWFpbjtcbiAgICB9XG5cbiAgICAvL2RlbGV0ZSBmaXJzdCBwYXJ0eSBjb29raWVzIHRoYXQgaGFzIG5vdCBiZWVuIGNvbnNlbnRlZFxuICAgIHRoaXMucmVzZXRDb29raWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHJlc2V0Rm9yQ29va2llVGFibGUgPSBmdW5jdGlvbiAoY29va2llVGFibGUpIHtcbiAgICAgICAgICAgIGNvb2tpZVRhYmxlLmZvckVhY2goZnVuY3Rpb24gKGNvb2tpZSkge1xuICAgICAgICAgICAgICAgIHZhciBjb29raWVOYW1lID0gY29va2llWzBdO1xuICAgICAgICAgICAgICAgIHZhciBjb29raWVTdG9yYWdlVHlwZSA9IGNvb2tpZVs1XTtcbiAgICAgICAgICAgICAgICB2YXIgY29va2llTmFtZVJlZ0V4ID0gY29va2llWzZdO1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjb29raWVTdG9yYWdlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiMVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgLy9odHRwIGNvb2tpZVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW1vdmVDb29raWVIVFRQKGNvb2tpZU5hbWUsIGNvb2tpZU5hbWVSZWdFeCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIjJcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbG9jYWxzdG9yYWdlIGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmVtb3ZlQ29va2llTG9jYWxTdG9yYWdlKGNvb2tpZU5hbWUsIGNvb2tpZU5hbWVSZWdFeCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgY29va2llSW5kZXggPSB0aGlzLmRpYWxvZyB8fCB0aGlzLmNvb2tpZUxpc3Q7XG5cbiAgICAgICAgaWYgKGNvb2tpZUluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGlmICgoIXRoaXMuY29uc2VudC5wcmVmZXJlbmNlcykgJiYgKHRoaXMud2lwZS5wcmVmZXJlbmNlcykpIHtcbiAgICAgICAgICAgICAgICByZXNldEZvckNvb2tpZVRhYmxlKGNvb2tpZUluZGV4LmNvb2tpZVRhYmxlUHJlZmVyZW5jZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgoIXRoaXMuY29uc2VudC5zdGF0aXN0aWNzKSAmJiAodGhpcy53aXBlLnN0YXRpc3RpY3MpKSB7XG4gICAgICAgICAgICAgICAgcmVzZXRGb3JDb29raWVUYWJsZShjb29raWVJbmRleC5jb29raWVUYWJsZVN0YXRpc3RpY3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoKCF0aGlzLmNvbnNlbnQubWFya2V0aW5nKSAmJiAodGhpcy53aXBlLm1hcmtldGluZykpIHtcbiAgICAgICAgICAgICAgICByZXNldEZvckNvb2tpZVRhYmxlKGNvb2tpZUluZGV4LmNvb2tpZVRhYmxlQWR2ZXJ0aXNpbmcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXNldEZvckNvb2tpZVRhYmxlKGNvb2tpZUluZGV4LmNvb2tpZVRhYmxlVW5jbGFzc2lmaWVkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucmVtb3ZlQ29va2llSFRUUCA9IGZ1bmN0aW9uIChjb29raWVuYW1lLCBjb29raWVyZWdleCkge1xuICAgICAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdChcIjtcIik7XG4gICAgICAgIHZhciBwYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJyk7XG4gICAgICAgIHZhciBob3N0bmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZTtcbiAgICAgICAgdmFyIGlzV3d3RG9tYWluID0gaG9zdG5hbWUuc3Vic3RyaW5nKDAsIDMpID09PSBcInd3d1wiO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNvb2tpZSA9IGNvb2tpZXNbaV07XG4gICAgICAgICAgICB2YXIgbmFtZUVuZFBvcyA9IGNvb2tpZS5pbmRleE9mKFwiPVwiKTtcbiAgICAgICAgICAgIHZhciBuYW1lID0gbmFtZUVuZFBvcyA+IC0xID8gY29va2llLnN1YnN0cigwLCBuYW1lRW5kUG9zKSA6IGNvb2tpZTtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoL15cXHMqLywgXCJcIikucmVwbGFjZSgvXFxzKiQvLCBcIlwiKTsgLy90cmltIHdoaXRlc3BhY2VzXG5cbiAgICAgICAgICAgIHZhciBpc05hbWVNYXRjaCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGNvb2tpZXJlZ2V4ID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IGNvb2tpZW5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNOYW1lTWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlzTmFtZU1hdGNoID0gbmFtZS5tYXRjaChjb29raWVyZWdleClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKChpc05hbWVNYXRjaCkgJiYgKG5hbWUgIT09IHRoaXMubmFtZSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGF0aFN0cmluZyA9IFwiO3BhdGg9XCI7XG4gICAgICAgICAgICAgICAgdmFyIGV4cGlyZVN0cmluZyA9IFwiPTtleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDAgR01UXCI7XG4gICAgICAgICAgICAgICAgdmFyIGRvbWFpblN0cmluZyA9IFwiO2RvbWFpbj1cIjtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgZXhwaXJlU3RyaW5nO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGF0aC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBwYXRoU3RyaW5nICs9ICgocGF0aFN0cmluZy5zdWJzdHIoLTEpICE9PSAnLycpID8gJy8nIDogJycpICsgcGF0aFtqXTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIGV4cGlyZVN0cmluZyArIHBhdGhTdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBleHBpcmVTdHJpbmcgKyBwYXRoU3RyaW5nICsgZG9tYWluU3RyaW5nICsgZXNjYXBlKGhvc3RuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIGV4cGlyZVN0cmluZyArIHBhdGhTdHJpbmcgKyBkb21haW5TdHJpbmcgKyBcIi5cIiArIGVzY2FwZShob3N0bmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBleHBpcmVTdHJpbmcgKyBwYXRoU3RyaW5nICsgZG9tYWluU3RyaW5nICsgZXNjYXBlKHRoaXMuZ2V0Um9vdERvbWFpbihob3N0bmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgZXhwaXJlU3RyaW5nICsgcGF0aFN0cmluZyArIGRvbWFpblN0cmluZyArIFwiLlwiICsgZXNjYXBlKHRoaXMuZ2V0Um9vdERvbWFpbihob3N0bmFtZSkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1d3d0RvbWFpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIGV4cGlyZVN0cmluZyArIHBhdGhTdHJpbmcgKyBkb21haW5TdHJpbmcgKyBlc2NhcGUoaG9zdG5hbWUuc3Vic3RyaW5nKDMpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucmVtb3ZlQ29va2llTG9jYWxTdG9yYWdlID0gZnVuY3Rpb24gKGNvb2tpZW5hbWUsIGNvb2tpZXJlZ2V4KSB7XG4gICAgICAgIGlmICghaXNTdG9yYWdlU3VwcG9ydGVkKCkpIHtcbiAgICAgICAgICAgIHJldHVybjsgLy9iYWlsIHdoZW4gbG9jYWxTdG9yYWdlIGlzIG5vdCBzdXBwb3J0ZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMobG9jYWxTdG9yYWdlKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IGtleXNbaV07XG5cbiAgICAgICAgICAgIHZhciBpc05hbWVNYXRjaCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGNvb2tpZXJlZ2V4ID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IGNvb2tpZW5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNOYW1lTWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlzTmFtZU1hdGNoID0gbmFtZS5tYXRjaChjb29raWVyZWdleCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc05hbWVNYXRjaCkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKG5hbWUpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHNlc3Npb25TdG9yYWdlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLndpdGhkcmF3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmNvbnNlbnRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRlY2xpbmVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaGFzUmVzcG9uc2UgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb25zZW50LnByZWZlcmVuY2VzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29uc2VudC5zdGF0aXN0aWNzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29uc2VudC5tYXJrZXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb25zZW50Lm1ldGhvZCA9ICdleHBsaWNpdCc7XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VkID0gdHJ1ZTtcblxuICAgICAgICAvL3VwZGF0ZSBzdGF0dXNsYWJlbCBpZiB1c2VyIGlzIG9uIHBhZ2Ugd2l0aCBpbmplY3RlZCBjb29raWUgZGVjbGFyYXRpb25cbiAgICAgICAgaWYgKCh0eXBlb2YgKHdpbmRvdy5Db29raWVEZWNsYXJhdGlvbikgIT09ICd1bmRlZmluZWQnKSAmJiAodHlwZW9mICh3aW5kb3cuQ29va2llRGVjbGFyYXRpb24uU2V0VXNlclN0YXR1c0xhYmVsKSA9PT0gXCJmdW5jdGlvblwiKSkge1xuICAgICAgICAgICAgd2luZG93LkNvb2tpZURlY2xhcmF0aW9uLlNldFVzZXJTdGF0dXNMYWJlbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQub25kZWNsaW5lKCk7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93LkNvb2tpZWJvdENhbGxiYWNrX09uRGVjbGluZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgd2luZG93LkNvb2tpZWJvdENhbGxiYWNrX09uRGVjbGluZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB3aW5kb3cuQ29va2llQ29uc2VudENhbGxiYWNrX09uRGVjbGluZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnRDYWxsYmFja19PbkRlY2xpbmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LmFwcGx5RGlzcGxheSgpO1xuXG4gICAgICAgIHZhciBwYXRoVXJsU3RyaW5nID0gXCJcIjtcbiAgICAgICAgaWYgKHRoaXMucGF0aGxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcGF0aFVybFN0cmluZyA9IFwiJnBhdGg9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5wYXRobGlzdC5qb2luKFwiLFwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdXNlckNvdW50cnlQYXJhbWV0ZXIgPSB3aW5kb3cuQ29va2llQ29uc2VudC51c2VyQ291bnRyeSA/IFwiJnVzZXJjb3VudHJ5PVwiICsgd2luZG93LkNvb2tpZUNvbnNlbnQudXNlckNvdW50cnkgOiBcIlwiO1xuXG4gICAgICAgIHZhciBoYXNDb29raWVEYXRhID0gKHRoaXMuZGlhbG9nICE9IG51bGwpO1xuXG4gICAgICAgIC8vR2V0IGNvbnNlbnRzdHJpbmcgZnJvbSBJQUIgZnJhbWV3b3JrIGFuZCBzYXZlIHdpdGggbG9nY29uc2VudFxuICAgICAgICBpZiAoaGFzRnJhbWV3b3JrKHRoaXMpICYmIHRoaXMuZnJhbWV3b3JrTG9hZGVkKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdy5Db29raWVDb25zZW50SUFCQ01QID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50SUFCQ01QLndpdGhkcmF3Q29uc2VudCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobGF0ZXN0VGNEYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhdGVzdFRjRGF0YS50Y1N0cmluZykge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5JQUJDb25zZW50U3RyaW5nID0gbGF0ZXN0VGNEYXRhLnRjU3RyaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuSUFCQ29uc2VudFN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgodHlwZW9mIHdpbmRvdy5Db29raWVDb25zZW50SUFCQ01QID09PSAnb2JqZWN0JykgJiYgd2luZG93LkNvb2tpZUNvbnNlbnRJQUJDTVAuZW5jb2RlR0FDTVN0cmluZyAmJiBsYXRlc3RUY0RhdGEuYWRkdGxDb25zZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LkdBQ01Db25zZW50U3RyaW5nID0gd2luZG93LkNvb2tpZUNvbnNlbnRJQUJDTVAuZW5jb2RlR0FDTVN0cmluZyhsYXRlc3RUY0RhdGEuYWRkdGxDb25zZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LkdBQ01Db25zZW50U3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhdGhVcmxTdHJpbmcgKz0gXCImaWFiMj1cIiArIHdpbmRvdy5Db29raWVDb25zZW50LklBQkNvbnNlbnRTdHJpbmcgKyBcIiZnYWNtPVwiICsgd2luZG93LkNvb2tpZUNvbnNlbnQuR0FDTUNvbnNlbnRTdHJpbmc7XG5cbiAgICAgICAgICAgIHZhciBsb2dDb25zZW50VXJsID0gd2luZG93LkNvb2tpZUNvbnNlbnQuaG9zdCArIFwibG9nY29uc2VudC5hc2h4P2FjdGlvbj1kZWNsaW5lJm5vY2FjaGU9XCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSArXG4gICAgICAgICAgICAgICAgXCImY2JpZD1cIiArIHdpbmRvdy5Db29raWVDb25zZW50LnNlcmlhbCArIHBhdGhVcmxTdHJpbmcgK1xuICAgICAgICAgICAgICAgIFwiJmxpZmV0aW1lPVwiICsgd2luZG93LkNvb2tpZUNvbnNlbnQub3B0T3V0TGlmZXRpbWUgK1xuICAgICAgICAgICAgICAgIFwiJmNidD1cIiArIHdpbmRvdy5Db29raWVDb25zZW50LnJlc3BvbnNlTW9kZSArXG4gICAgICAgICAgICAgICAgXCImaGFzZGF0YT1cIiArIGhhc0Nvb2tpZURhdGEgK1xuICAgICAgICAgICAgICAgIFwiJm1ldGhvZD1zdHJpY3RcIiArXG4gICAgICAgICAgICAgICAgdXNlckNvdW50cnlQYXJhbWV0ZXIgK1xuICAgICAgICAgICAgICAgIFwiJnJlZmVyZXI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKSArXG4gICAgICAgICAgICAgICAgXCImcmM9ZmFsc2VcIjtcblxuICAgICAgICAgICAgICAgIGxvZ0NvbnNlbnQod2luZG93LkNvb2tpZUNvbnNlbnQsIGxvZ0NvbnNlbnRVcmwsIGZhbHNlLCAhaGFzQ29va2llRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgbG9nQ29uc2VudFVybCA9IHRoaXMuaG9zdCArIFwibG9nY29uc2VudC5hc2h4P2FjdGlvbj1kZWNsaW5lJm5vY2FjaGU9XCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSArXG4gICAgICAgICAgICAgICAgXCImY2JpZD1cIiArIHdpbmRvdy5Db29raWVDb25zZW50LnNlcmlhbCArIHBhdGhVcmxTdHJpbmcgK1xuICAgICAgICAgICAgICAgIFwiJmxpZmV0aW1lPVwiICsgd2luZG93LkNvb2tpZUNvbnNlbnQub3B0T3V0TGlmZXRpbWUgK1xuICAgICAgICAgICAgICAgIFwiJmNidD1cIiArIHdpbmRvdy5Db29raWVDb25zZW50LnJlc3BvbnNlTW9kZSArXG4gICAgICAgICAgICAgICAgXCImaGFzZGF0YT1cIiArIGhhc0Nvb2tpZURhdGEgK1xuICAgICAgICAgICAgICAgIFwiJm1ldGhvZD1zdHJpY3RcIiArXG4gICAgICAgICAgICAgICAgdXNlckNvdW50cnlQYXJhbWV0ZXIgK1xuICAgICAgICAgICAgICAgIFwiJnJlZmVyZXI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKSArXG4gICAgICAgICAgICAgICAgXCImcmM9ZmFsc2VcIjtcblxuICAgICAgICAgICAgICAgIGxvZ0NvbnNlbnQod2luZG93LkNvb2tpZUNvbnNlbnQsIGxvZ0NvbnNlbnRVcmwsIGZhbHNlLCAhaGFzQ29va2llRGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldE91dE9mUmVnaW9uID0gZnVuY3Rpb24gKGNvdW50cnlDb2RlLCBjb25zZW50VmVyc2lvbikgeyAvL3VzZWQgZm9yIGZpcnN0LXRpbWUgcmVnaXN0cmF0aW9uIG9mIG91dC1vZi1yZWdpb24gY29uc2VudFxuICAgICAgICB0aGlzLmlzT3V0c2lkZUVVID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pc091dE9mUmVnaW9uID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oYXNSZXNwb25zZSA9IHRydWU7XG4gICAgICAgIHRoaXMuZGVjbGluZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb25zZW50ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmNvbnNlbnQucHJlZmVyZW5jZXMgPSB0cnVlO1xuICAgICAgICB0aGlzLmNvbnNlbnQuc3RhdGlzdGljcyA9IHRydWU7XG4gICAgICAgIHRoaXMuY29uc2VudC5tYXJrZXRpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmNvbnNlbnQubWV0aG9kID0gJ2ltcGxpZWQnO1xuXG4gICAgICAgIHZhciBjb3VudHJ5RnJhZ21lbnQgPSBcIlwiO1xuICAgICAgICBpZiAoY291bnRyeUNvZGUpIHtcbiAgICAgICAgICAgIHRoaXMudXNlckNvdW50cnkgPSBjb3VudHJ5Q29kZTtcbiAgICAgICAgICAgIGNvdW50cnlGcmFnbWVudCA9IFwiJTJDcmVnaW9uOiUyN1wiICsgY291bnRyeUNvZGUgKyBcIiUyN1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaGFuZ2VkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnZlcnNpb24gPSB0aGlzLmxhdGVzdFZlcnNpb247XG5cbiAgICAgICAgaWYgKGNvbnNlbnRWZXJzaW9uKSB7XG4gICAgICAgICAgICB0aGlzLnZlcnNpb24gPSB0aGlzLmxhdGVzdFZlcnNpb24gPSBjb25zZW50VmVyc2lvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlUmVndWxhdGlvbnMoKTtcblxuICAgICAgICB0aGlzLmNvbnNlbnQuc3RhbXAgPSBcIi0xXCI7IC8vbm8gY29uc2VudCBpZCBhdmFpbGFibGUgYXMgY29uc2VudCBpcyBub3QgbG9nZ2VkLiBcIi0xXCIgc2lnbmFscyBvdXQtb2YtcmVnaW9uIGNvbnNlbnQgY29va2llXG5cbiAgICAgICAgdmFyIGV4cGlyZU1vbnRocyA9IDE7XG4gICAgICAgIHZhciBleHBpcmF0aW9uRGF0ZSA9IG5ldyB3aW5kb3cuQ29va2llQ29udHJvbC5EYXRlVGltZSgpLmFkZE1vbnRocyhleHBpcmVNb250aHMpO1xuXG4gICAgICAgIGlmIChoYXNGcmFtZXdvcmsodGhpcykpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5mcmFtZXdvcmtMb2FkZWQpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuc2V0T3V0T2ZSZWdpb24oY291bnRyeUNvZGUpO1xuICAgICAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudElBQkNNUC51cGRhdGVDb25zZW50RnVsbE9wdEluKCk7XG4gICAgICAgICAgICAgICAgLy9HZXQgY29uc2VudHN0cmluZyBmcm9tIElBQiBmcmFtZXdvcmsgYW5kIHNhdmUgaW4gb3V0LW9mLXJlZ2lvbiBjb29raWUgdmFsdWVcbiAgICAgICAgICAgICAgICBpZiAobGF0ZXN0VGNEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXRlc3RUY0RhdGEudGNTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LklBQkNvbnNlbnRTdHJpbmcgPSBsYXRlc3RUY0RhdGEudGNTdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5JQUJDb25zZW50U3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgSUFCY29uc2VudEZyYWdtZW50ID0gXCIlMkNpYWIyOiUyN1wiICsgd2luZG93LkNvb2tpZUNvbnNlbnQuSUFCQ29uc2VudFN0cmluZyArIFwiJTI3XCI7XG4gICAgICAgICAgICAgICAgICAgIGlmICgodHlwZW9mIHdpbmRvdy5Db29raWVDb25zZW50SUFCQ01QID09PSAnb2JqZWN0JykgJiYgd2luZG93LkNvb2tpZUNvbnNlbnRJQUJDTVAuZW5jb2RlR0FDTVN0cmluZyAmJiBsYXRlc3RUY0RhdGEuYWRkdGxDb25zZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5HQUNNQ29uc2VudFN0cmluZyA9IHdpbmRvdy5Db29raWVDb25zZW50SUFCQ01QLmVuY29kZUdBQ01TdHJpbmcobGF0ZXN0VGNEYXRhLmFkZHRsQ29uc2VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBJQUJjb25zZW50RnJhZ21lbnQgKz0gXCIlMkNnYWNtOiUyN1wiICsgd2luZG93LkNvb2tpZUNvbnNlbnQuR0FDTUNvbnNlbnRTdHJpbmcgKyBcIiUyN1wiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuR0FDTUNvbnNlbnRTdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuc2V0Q29va2llKFxuICAgICAgICAgICAgICAgICAgICBcIntzdGFtcDolMjdcIiArIHdpbmRvdy5Db29raWVDb25zZW50LmNvbnNlbnQuc3RhbXAgK1xuICAgICAgICAgICAgICAgICAgICBcIiUyNyUyQ25lY2Vzc2FyeTp0cnVlJTJDcHJlZmVyZW5jZXM6dHJ1ZSUyQ3N0YXRpc3RpY3M6dHJ1ZSUyQ21hcmtldGluZzp0cnVlJTJDbWV0aG9kOiUyN2ltcGxpZWQlMjclMkN2ZXI6XCIgKyB3aW5kb3cuQ29va2llQ29uc2VudC52ZXJzaW9uICtcbiAgICAgICAgICAgICAgICAgICAgXCIlMkN1dGM6XCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIElBQmNvbnNlbnRGcmFnbWVudCArIGNvdW50cnlGcmFnbWVudCArIFwifVwiLCBleHBpcmF0aW9uRGF0ZSwgXCIvXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXRDb29raWUoXG4gICAgICAgICAgICAgICAgXCJ7c3RhbXA6JTI3XCIgKyB0aGlzLmNvbnNlbnQuc3RhbXAgK1xuICAgICAgICAgICAgICAgIFwiJTI3JTJDbmVjZXNzYXJ5OnRydWUlMkNwcmVmZXJlbmNlczp0cnVlJTJDc3RhdGlzdGljczp0cnVlJTJDbWFya2V0aW5nOnRydWUlMkNtZXRob2Q6JTI3aW1wbGllZCUyNyUyQ3ZlcjpcIiArIHRoaXMudmVyc2lvbiArXG4gICAgICAgICAgICAgICAgXCIlMkN1dGM6XCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIGNvdW50cnlGcmFnbWVudCArIFwifVwiLCBleHBpcmF0aW9uRGF0ZSwgXCIvXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldEhlYWRlclN0eWxlcygpO1xuXG4gICAgICAgIGlmICh0aGlzLmFtem5Db25zZW50U2lnbmFsRW5hYmxlZCkge1xuICAgICAgICAgICAgYXBwbHlBY3ModGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNpZ25hbE1zQ29uc2VudEFQSSh0aGlzLmNvbnNlbnQubWFya2V0aW5nKTtcbiAgICAgICAgdGhpcy5zaWduYWxNc0NsYXJpdHlDb25zZW50QVBJKHRoaXMuY29uc2VudC5tYXJrZXRpbmcsIHRoaXMuY29uc2VudC5zdGF0aXN0aWNzKTtcblxuICAgICAgICB0aGlzLnNpZ25hbEdvb2dsZUNvbnNlbnRBUEkoXG4gICAgICAgICAgICB0aGlzLmNvbnNlbnRNb2RlRGlzYWJsZWQsXG4gICAgICAgICAgICB0aGlzLmNvbnNlbnRNb2RlRGF0YVJlZGFjdGlvbixcbiAgICAgICAgICAgIHRoaXMuY29uc2VudC5wcmVmZXJlbmNlcyxcbiAgICAgICAgICAgIHRoaXMuY29uc2VudC5zdGF0aXN0aWNzLFxuICAgICAgICAgICAgdGhpcy5jb25zZW50Lm1hcmtldGluZ1xuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuc2V0T25sb2FkKCk7XG4gICAgfVxuXG4gICAgdGhpcy5pc1NwaWRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuYm90RGV0ZWN0aW9uRGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAvYWRpZHhib3RjfEFwcGxlYm90XFwvfGFyY2hpdmUub3JnX2JvdHxhc3Rlcmlhc1xcL3xCYWlkdXNwaWRlclxcL3xiaW5nYm90XFwvfEJpbmdQcmV2aWV3XFwvfER1Y2tEdWNrQm90XFwvfEZBU1QtV2ViQ3Jhd2xlclxcL3xGZWVkc3BvdHxGZWVkc3BvdGJvdFxcL3xHb29nbGUgUGFnZSBTcGVlZCBJbnNpZ2h0c3xHb29nbGUgUFB8R29vZ2xlIFNlYXJjaCBDb25zb2xlfEdvb2dsZSBXZWIgUHJldmlld3xHb29nbGVib3RcXC98R29vZ2xlYm90LUltYWdlXFwvfEdvb2dsZWJvdC1Nb2JpbGVcXC98R29vZ2xlYm90LU5ld3N8R29vZ2xlYm90LVZpZGVvXFwvfEdvb2dsZS1JbnNwZWN0aW9uVG9vbFxcL3xHb29nbGUtU2VhcmNoQnlJbWFnZXxHb29nbGUtU3RydWN0dXJlZC1EYXRhLVRlc3RpbmctVG9vbHxDaHJvbWUtTGlnaHRob3VzZXxoZXJpdHJpeFxcL3xpYXNrc3BpZGVyXFwvfE1lZGlhcGFydG5lcnMtR29vZ2xlfFN0b3JlYm90LUdvb2dsZVxcL3xtc25ib3RcXC98bXNuYm90LW1lZGlhXFwvfG1zbmJvdC1OZXdzQmxvZ3NcXC98bXNuYm90LVVEaXNjb3ZlcnlcXC98UFRTVFxcL3xTRU1ydXNoQm90fHNwZWNpYWxfYXJjaGl2ZXJcXC98U2l0ZWltcHJvdmV8WSFKLUFTUlxcL3xZIUotQlJJXFwvfFkhSi1CUkpcXC9ZQVRTfFkhSi1CUk9cXC9ZRlNKfFkhSi1CUldcXC98WSFKLUJTQ1xcL3xZYWhvbyEgU2l0ZSBFeHBsb3JlciBGZWVkIFZhbGlkYXRvcnxZYWhvbyEgU2x1cnB8WWFob29DYWNoZVN5c3RlbXxZYWhvby1NTUNyYXdsZXJcXC98WWFob29TZWVrZXJcXC98YWFib3RcXC98Y29tcGF0aWJsZTsgYWFcXC98UGV0YWxCb3RcXC98UHJlcmVuZGVyXFwvfHdlYnZpdGFscy5kZXYvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgfVxuXG4gICAgdGhpcy5nZXRTY3JpcHQgPSBmdW5jdGlvbiAodXJsLCBhc3luYywgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gICAgICAgIHZhciBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE9yaWcoJ3NjcmlwdCcpO1xuICAgICAgICBzLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgICAgcy5jaGFyc2V0ID0gJ1VURi04JztcbiAgICAgICAgYXBwbHlOb25jZShzLCB0aGlzLm5vbmNlKTtcbiAgICAgICAgdmFyIGRvQXN5bmNMb2FkID0gdHJ1ZTtcbiAgICAgICAgaWYgKCh0eXBlb2YgKGFzeW5jKSAhPT0gJ3VuZGVmaW5lZCcpICYmICghYXN5bmMpKSB7XG4gICAgICAgICAgICBkb0FzeW5jTG9hZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRvQXN5bmNMb2FkKSB7XG4gICAgICAgICAgICBzLmFzeW5jID0gXCJhc3luY1wiO1xuICAgICAgICB9XG4gICAgICAgIHMuc3JjID0gdXJsO1xuICAgICAgICBzLm9ubG9hZCA9IHMub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKF8sIGlzQWJvcnQpIHtcbiAgICAgICAgICAgIGlmIChpc0Fib3J0IHx8ICFzLnJlYWR5U3RhdGUgfHwgL2xvYWRlZHxjb21wbGV0ZS8udGVzdChzLnJlYWR5U3RhdGUpKSB7XG4gICAgICAgICAgICAgICAgcy5vbmxvYWQgPSBzLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0Fib3J0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcy5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGggJiYgaC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBoLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHMsIGgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZmV0Y2hKc29uRGF0YSA9IGZldGNoSnNvbkRhdGE7XG5cbiAgICB0aGlzLmxvYWRJZnJhbWUgPSBmdW5jdGlvbiAoaWZyYW1lSUQsIGlmcmFtZVNyYykge1xuICAgICAgICB2YXIgY3VzdG9tRnJhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZnJhbWVJRCk7XG4gICAgICAgIGlmIChjdXN0b21GcmFtZSkge1xuICAgICAgICAgICAgY3VzdG9tRnJhbWUuc3JjID0gaWZyYW1lU3JjO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXRETlRTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgKG5hdmlnYXRvci5kb05vdFRyYWNrID09PSBcInllc1wiKSB8fFxuICAgICAgICAgICAgKG5hdmlnYXRvci5tc0RvTm90VHJhY2sgPT09IFwiMVwiKSB8fFxuICAgICAgICAgICAgKG5hdmlnYXRvci5kb05vdFRyYWNrID09PSBcIjFcIikgfHxcbiAgICAgICAgICAgICh0aGlzLmNvb2tpZUVuYWJsZWQgPT09IGZhbHNlKSB8fFxuICAgICAgICAgICAgKG5hdmlnYXRvci5jb29raWVFbmFibGVkID09PSBmYWxzZSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmRvTm90VHJhY2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kb05vdFRyYWNrID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldEhlYWRlclN0eWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN0eWxlT2JqZWN0SUQgPSAnQ29va2llQ29uc2VudFN0YXRlRGlzcGxheVN0eWxlcyc7XG5cbiAgICAgICAgLy9kZWxldGUgc3R5bGUgb2JqZWN0IGlmIGl0IGhhcyBiZWVuIHNldCBlYXJsaWVyXG4gICAgICAgIHZhciBzdHlsZU9iamVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0eWxlT2JqZWN0SUQpO1xuICAgICAgICBpZiAoc3R5bGVPYmplY3QpIHtcbiAgICAgICAgICAgIHN0eWxlT2JqZWN0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVPYmplY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9hcHBseSBzdHlsZXMgYmVmb3JlIGxvYWRpbmdcbiAgICAgICAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkO1xuICAgICAgICBpZiAoaGVhZCkge1xuICAgICAgICAgICAgdmFyIHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgICAgICAgYXBwbHlOb25jZShzLCB0aGlzLm5vbmNlKTtcbiAgICAgICAgICAgIHMuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQvY3NzJyk7XG4gICAgICAgICAgICBzLmlkID0gc3R5bGVPYmplY3RJRDtcbiAgICAgICAgICAgIHZhciBuZXdzdHlsZXNoZWV0ID0gXCJcIjtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY29uc2VudGVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9wdGlucyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBvcHRvdXRzID0gW107XG4gICAgICAgICAgICAgICAgb3B0aW5zLnB1c2goXCIuY29va2llY29uc2VudC1vcHRpblwiKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zZW50LnByZWZlcmVuY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlucy5wdXNoKFwiLmNvb2tpZWNvbnNlbnQtb3B0aW4tcHJlZmVyZW5jZXNcIik7XG4gICAgICAgICAgICAgICAgICAgIG9wdG91dHMucHVzaChcIi5jb29raWVjb25zZW50LW9wdG91dC1wcmVmZXJlbmNlc1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdG91dHMucHVzaChcIi5jb29raWVjb25zZW50LW9wdGluLXByZWZlcmVuY2VzXCIpO1xuICAgICAgICAgICAgICAgICAgICBvcHRpbnMucHVzaChcIi5jb29raWVjb25zZW50LW9wdG91dC1wcmVmZXJlbmNlc1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29uc2VudC5zdGF0aXN0aWNzKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlucy5wdXNoKFwiLmNvb2tpZWNvbnNlbnQtb3B0aW4tc3RhdGlzdGljc1wiKTtcbiAgICAgICAgICAgICAgICAgICAgb3B0b3V0cy5wdXNoKFwiLmNvb2tpZWNvbnNlbnQtb3B0b3V0LXN0YXRpc3RpY3NcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvcHRvdXRzLnB1c2goXCIuY29va2llY29uc2VudC1vcHRpbi1zdGF0aXN0aWNzXCIpO1xuICAgICAgICAgICAgICAgICAgICBvcHRpbnMucHVzaChcIi5jb29raWVjb25zZW50LW9wdG91dC1zdGF0aXN0aWNzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25zZW50Lm1hcmtldGluZykge1xuICAgICAgICAgICAgICAgICAgICBvcHRpbnMucHVzaChcIi5jb29raWVjb25zZW50LW9wdGluLW1hcmtldGluZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgb3B0b3V0cy5wdXNoKFwiLmNvb2tpZWNvbnNlbnQtb3B0b3V0LW1hcmtldGluZ1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdG91dHMucHVzaChcIi5jb29raWVjb25zZW50LW9wdGluLW1hcmtldGluZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW5zLnB1c2goXCIuY29va2llY29uc2VudC1vcHRvdXQtbWFya2V0aW5nXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvcHRvdXRzLnB1c2goXCIuY29va2llY29uc2VudC1vcHRvdXRcIik7XG4gICAgICAgICAgICAgICAgbmV3c3R5bGVzaGVldCA9IG9wdGlucy5qb2luKCkgKyBcIntkaXNwbGF5OmJsb2NrO2Rpc3BsYXk6aW5pdGlhbDt9XCIgKyBvcHRvdXRzLmpvaW4oKSArIFwie2Rpc3BsYXk6bm9uZTt9XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdzdHlsZXNoZWV0ID0gXCIuY29va2llY29uc2VudC1vcHRpbi1wcmVmZXJlbmNlcywuY29va2llY29uc2VudC1vcHRpbi1zdGF0aXN0aWNzLC5jb29raWVjb25zZW50LW9wdGluLW1hcmtldGluZywuY29va2llY29uc2VudC1vcHRpblwiO1xuICAgICAgICAgICAgICAgIG5ld3N0eWxlc2hlZXQgKz0gXCJ7ZGlzcGxheTpub25lO31cIjtcblxuICAgICAgICAgICAgICAgIG5ld3N0eWxlc2hlZXQgKz0gXCIuY29va2llY29uc2VudC1vcHRvdXQtcHJlZmVyZW5jZXMsLmNvb2tpZWNvbnNlbnQtb3B0b3V0LXN0YXRpc3RpY3MsLmNvb2tpZWNvbnNlbnQtb3B0b3V0LW1hcmtldGluZywuY29va2llY29uc2VudC1vcHRvdXRcIjtcbiAgICAgICAgICAgICAgICBuZXdzdHlsZXNoZWV0ICs9IFwie2Rpc3BsYXk6YmxvY2s7ZGlzcGxheTppbml0aWFsO31cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzLnN0eWxlU2hlZXQpIHtcbiAgICAgICAgICAgICAgICBzLnN0eWxlU2hlZXQuY3NzVGV4dCA9IG5ld3N0eWxlc2hlZXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmV3c3R5bGVzaGVldCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaGVhZC5hcHBlbmRDaGlsZChzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3VibWl0Q29uc2VudCA9IGZ1bmN0aW9uIChpc0ltcGxpZWRDb25zZW50LCBjb25zZW50VVJMLCBsb2FkQXN5bmMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAod2luZG93LkNvb2tpZUNvbnNlbnREaWFsb2cpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50RGlhbG9nLnN1Ym1pdENvbnNlbnQoaXNJbXBsaWVkQ29uc2VudCwgY29uc2VudFVSTCwgbG9hZEFzeW5jKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc3VibWl0Q3VzdG9tQ29uc2VudCA9IGZ1bmN0aW9uIChvcHRpblByZWZlcmVuY2VzLCBvcHRpblN0YXRpc3RpY3MsIG9wdGluTWFya2V0aW5nLCBpc0ltcGxpZWRDb25zZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0ZyYW1ld29yayAmJiAhdGhpcy5mcmFtZXdvcmtMb2FkZWQgJiYgKCF0aGlzLmZyYW1ld29ya0Jsb2NrZWQpKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5zdWJtaXRDdXN0b21Db25zZW50KG9wdGluUHJlZmVyZW5jZXMsIG9wdGluU3RhdGlzdGljcywgb3B0aW5NYXJrZXRpbmcpO1xuICAgICAgICAgICAgfSwgNSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmluYWxDb25zZW50VVJMID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lO1xuICAgICAgICB2YXIgcmVzcG9uc2VNb2RlID0gd2luZG93LkNvb2tpZUNvbnNlbnQucmVzcG9uc2VNb2RlO1xuICAgICAgICB2YXIgbG9nQ29uc2VudE1ldGhvZCA9IGlzSW1wbGllZENvbnNlbnQgPyAnaW1wbGllZCcgOiAnc3RyaWN0JztcblxuICAgICAgICB0aGlzLmNvbnNlbnRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZGVjbGluZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5oYXNSZXNwb25zZSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5jb25zZW50LnByZWZlcmVuY2VzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29uc2VudC5zdGF0aXN0aWNzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29uc2VudC5tYXJrZXRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb25zZW50Lm1ldGhvZCA9IGlzSW1wbGllZENvbnNlbnQgPyAnaW1wbGllZCcgOiAnZXhwbGljaXQnO1xuXG4gICAgICAgIGlmIChvcHRpblByZWZlcmVuY2VzKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnNlbnQucHJlZmVyZW5jZXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpblN0YXRpc3RpY3MpIHtcbiAgICAgICAgICAgIHRoaXMuY29uc2VudC5zdGF0aXN0aWNzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW5NYXJrZXRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuY29uc2VudC5tYXJrZXRpbmcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5kaWFsb2cgfHwgdGhpcy5kaWFsb2cudGVtcGxhdGUgIT09IFwiY3VzdG9tXCIpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlTW9kZSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgICAgIC8vdXBkYXRlIHN0YXR1c2xhYmVsIGlmIHVzZXIgaXMgb24gcGFnZSB3aXRoIGluamVjdGVkIGNvb2tpZSBkZWNsYXJhdGlvblxuICAgICAgICBpZiAodHlwZW9mICh3aW5kb3cuIENvb2tpZURlY2xhcmF0aW9uKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5Db29raWVEZWNsYXJhdGlvbi5TZXRVc2VyU3RhdHVzTGFiZWwpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZURlY2xhcmF0aW9uLlNldFVzZXJTdGF0dXNMYWJlbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRudCA9IFwiZmFsc2VcIjtcbiAgICAgICAgaWYgKHRoaXMuZG9Ob3RUcmFjaykge1xuICAgICAgICAgICAgZG50ID0gXCJ0cnVlXCI7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYXN5bmNsb2FkID0gdHJ1ZTtcblxuICAgICAgICAvL2xvZyBjb25zZW50XG4gICAgICAgIHZhciBwYXRoVXJsU3RyaW5nID0gXCJcIjtcbiAgICAgICAgaWYgKHRoaXMucGF0aGxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcGF0aFVybFN0cmluZyA9IFwiJnBhdGg9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5wYXRobGlzdC5qb2luKFwiLFwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYnVsa1RpY2tldCA9IFwiXCI7XG4gICAgICAgIHZhciBoYXNDb29raWVEYXRhID0gKHRoaXMuZGlhbG9nICE9IG51bGwpO1xuXG4gICAgICAgIHZhciB1c2VyQ291bnRyeVBhcmFtZXRlciA9IHdpbmRvdy5Db29raWVDb25zZW50LnVzZXJDb3VudHJ5ID8gXCImdXNlcmNvdW50cnk9XCIgKyB3aW5kb3cuQ29va2llQ29uc2VudC51c2VyQ291bnRyeSA6IFwiXCI7XG5cbiAgICAgICAgaWYgKGhhc0ZyYW1ld29yayh0aGlzKSAmJiB0aGlzLmZyYW1ld29ya0xvYWRlZCkge1xuICAgICAgICAgICAgLy9HZXQgY29uc2VudHN0cmluZyBmcm9tIElBQiBmcmFtZXdvcmsgYW5kIHNhdmUgd2l0aCBsb2djb25zZW50XG4gICAgICAgICAgICBpZiAobGF0ZXN0VGNEYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhdGVzdFRjRGF0YS50Y1N0cmluZykge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5JQUJDb25zZW50U3RyaW5nID0gbGF0ZXN0VGNEYXRhLnRjU3RyaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuSUFCQ29uc2VudFN0cmluZyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgodHlwZW9mIHdpbmRvdy5Db29raWVDb25zZW50SUFCQ01QID09PSAnb2JqZWN0JykgJiYgd2luZG93LkNvb2tpZUNvbnNlbnRJQUJDTVAuZW5jb2RlR0FDTVN0cmluZyAmJiBsYXRlc3RUY0RhdGEuYWRkdGxDb25zZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LkdBQ01Db25zZW50U3RyaW5nID0gd2luZG93LkNvb2tpZUNvbnNlbnRJQUJDTVAuZW5jb2RlR0FDTVN0cmluZyhsYXRlc3RUY0RhdGEuYWRkdGxDb25zZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LkdBQ01Db25zZW50U3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhdGhVcmxTdHJpbmcgKz0gXCImaWFiMj1cIiArIHdpbmRvdy5Db29raWVDb25zZW50LklBQkNvbnNlbnRTdHJpbmcgKyBcIiZnYWNtPVwiICsgd2luZG93LkNvb2tpZUNvbnNlbnQuR0FDTUNvbnNlbnRTdHJpbmc7XG5cbiAgICAgICAgICAgIHZhciBsb2dDb25zZW50VXJsID0gd2luZG93LkNvb2tpZUNvbnNlbnQuaG9zdCArIFwibG9nY29uc2VudC5hc2h4P2FjdGlvbj1hY2NlcHQmbm9jYWNoZT1cIiArIG5ldyBEYXRlKCkuZ2V0VGltZSgpICtcbiAgICAgICAgICAgICAgICBcIiZkbnQ9XCIgKyBkbnQgK1xuICAgICAgICAgICAgICAgIFwiJmNscD1cIiArIHdpbmRvdy5Db29raWVDb25zZW50LmNvbnNlbnQucHJlZmVyZW5jZXMgK1xuICAgICAgICAgICAgICAgIFwiJmNscz1cIiArIHdpbmRvdy5Db29raWVDb25zZW50LmNvbnNlbnQuc3RhdGlzdGljcyArXG4gICAgICAgICAgICAgICAgXCImY2xtPVwiICsgd2luZG93LkNvb2tpZUNvbnNlbnQuY29uc2VudC5tYXJrZXRpbmcgK1xuICAgICAgICAgICAgICAgIFwiJmNiaWQ9XCIgKyB3aW5kb3cuQ29va2llQ29uc2VudC5zZXJpYWwgKyBwYXRoVXJsU3RyaW5nICtcbiAgICAgICAgICAgICAgICBcIiZjYnQ9XCIgKyByZXNwb25zZU1vZGUgK1xuICAgICAgICAgICAgICAgIFwiJnRpY2tldD1cIiArIGJ1bGtUaWNrZXQgK1xuICAgICAgICAgICAgICAgIFwiJmJ1bGs9XCIgKyB0aGlzLmlzYnVsa3JlbmV3YWwgK1xuICAgICAgICAgICAgICAgIFwiJmhhc2RhdGE9XCIgKyBoYXNDb29raWVEYXRhICtcbiAgICAgICAgICAgICAgICBcIiZtZXRob2Q9XCIgKyBsb2dDb25zZW50TWV0aG9kICtcbiAgICAgICAgICAgICAgICB1c2VyQ291bnRyeVBhcmFtZXRlciArXG4gICAgICAgICAgICAgICAgXCImcmVmZXJlcj1cIiArIGVuY29kZVVSSUNvbXBvbmVudChmaW5hbENvbnNlbnRVUkwpICtcbiAgICAgICAgICAgICAgICBcIiZyYz1mYWxzZVwiO1xuXG4gICAgICAgICAgICAgICAgbG9nQ29uc2VudCh3aW5kb3cuQ29va2llQ29uc2VudCwgbG9nQ29uc2VudFVybCwgYXN5bmNsb2FkLCAhaGFzQ29va2llRGF0YSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgbG9nQ29uc2VudFVybCA9IHRoaXMuaG9zdCArIFwibG9nY29uc2VudC5hc2h4P2FjdGlvbj1hY2NlcHQmbm9jYWNoZT1cIiArIG5ldyBEYXRlKCkuZ2V0VGltZSgpICtcbiAgICAgICAgICAgICAgICBcIiZkbnQ9XCIgKyBkbnQgK1xuICAgICAgICAgICAgICAgIFwiJmNscD1cIiArIHRoaXMuY29uc2VudC5wcmVmZXJlbmNlcyArXG4gICAgICAgICAgICAgICAgXCImY2xzPVwiICsgdGhpcy5jb25zZW50LnN0YXRpc3RpY3MgK1xuICAgICAgICAgICAgICAgIFwiJmNsbT1cIiArIHRoaXMuY29uc2VudC5tYXJrZXRpbmcgK1xuICAgICAgICAgICAgICAgIFwiJmNiaWQ9XCIgKyB0aGlzLnNlcmlhbCArIHBhdGhVcmxTdHJpbmcgK1xuICAgICAgICAgICAgICAgIFwiJmNidD1cIiArIHJlc3BvbnNlTW9kZSArXG4gICAgICAgICAgICAgICAgXCImdGlja2V0PVwiICsgYnVsa1RpY2tldCArXG4gICAgICAgICAgICAgICAgXCImYnVsaz1cIiArIHRoaXMuaXNidWxrcmVuZXdhbCArXG4gICAgICAgICAgICAgICAgXCImaGFzZGF0YT1cIiArIGhhc0Nvb2tpZURhdGEgK1xuICAgICAgICAgICAgICAgIFwiJm1ldGhvZD1cIiArIGxvZ0NvbnNlbnRNZXRob2QgK1xuICAgICAgICAgICAgICAgIHVzZXJDb3VudHJ5UGFyYW1ldGVyICtcbiAgICAgICAgICAgICAgICBcIiZyZWZlcmVyPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGZpbmFsQ29uc2VudFVSTCkgK1xuICAgICAgICAgICAgICAgIFwiJnJjPWZhbHNlXCI7XG5cbiAgICAgICAgICAgICAgICBsb2dDb25zZW50KHdpbmRvdy5Db29raWVDb25zZW50LCBsb2dDb25zZW50VXJsLCBhc3luY2xvYWQsICFoYXNDb29raWVEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgKHdpbmRvdy5Db29raWVDb25zZW50RGlhbG9nKSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mICh3aW5kb3cuQ29va2llQ29uc2VudERpYWxvZy5yZWxlYXNlQmFubmVyRm9jdXMpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudERpYWxvZy5yZWxlYXNlQmFubmVyRm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaXNHVUlEID0gZnVuY3Rpb24gKG9iakd1aWQpIHtcbiAgICAgICAgdmFyIGd1aWRTeW50YXggPSAvXihcXHspezAsMX1bMC05YS1mQS1GXXs4fVxcLVswLTlhLWZBLUZdezR9XFwtWzAtOWEtZkEtRl17NH1cXC1bMC05YS1mQS1GXXs0fVxcLVswLTlhLWZBLUZdezEyfShcXH0pezAsMX0kL1xuICAgICAgICBpZiAoKG9iakd1aWQubGVuZ3RoID4gMCkgJiYgKGd1aWRTeW50YXgudGVzdChvYmpHdWlkKSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5oYXNoQ29kZSA9IGhhc2hDb2RlO1xuXG4gICAgdGhpcy50YWdIYXNoID0gdGFnSGFzaDtcblxuICAgIHRoaXMuaW5pdE11dGF0aW9uT2JzZXJ2ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGluaXRNdXRhdGlvbk9ic2VydmVyKHdpbmRvdywgZG9jdW1lbnQsIHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMub3ZlcnJpZGVFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgb3ZlcnJpZGVFdmVudExpc3RlbmVycyh0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLmlzSW50ZXJuYWxFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKHR5cGUsIG5vZGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICgodHlwZSA9PT0gXCJiZWZvcmVzY3JpcHRleGVjdXRlXCIpICYmICh0eXBlb2Ygbm9kZS5vcmlnT3V0ZXJIVE1MICE9PSBcInVuZGVmaW5lZFwiKSkgfHwgLy9kb24ndCByZWdpc3RlciBvd24gZXZlbnRzIG9uIHNjcmlwdCB0YWdzXG4gICAgICAgICAgICAobm9kZSA9PT0gdGhpcy5pZnJhbWUpIHx8XG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgKGNhbGxiYWNrID09PSB0aGF0LmNib25sb2FkZXZlbnQpIHx8XG4gICAgICAgICAgICAgICAgKGNhbGxiYWNrID09PSB0aGF0LnRyaWdnZXJPbmxvYWRFdmVudHMpIHx8XG4gICAgICAgICAgICAgICAgKGNhbGxiYWNrID09PSB0aGF0LmhhbmRsZU1lc3NhZ2UpIHx8XG4gICAgICAgICAgICAgICAgKGNhbGxiYWNrID09PSB0aGF0LnJlYWRCdWxrQ29uc2VudCkgfHxcbiAgICAgICAgICAgICAgICAoY2FsbGJhY2sgPT09IHRoYXQuc3VibWl0SW1wbGllZENvbnNlbnQpIHx8XG4gICAgICAgICAgICAgICAgKGNhbGxiYWNrID09PSB0aGF0LnNpZ25hbFdpbmRvd0xvYWQpXG4gICAgICAgICAgICApIHx8XG4gICAgICAgICAgICAodHlwZW9mIG5vZGUuQ0JfaXNDbG9uZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiAoKHR5cGUgPT09IFwibG9hZFwiKSB8fCAodHlwZSA9PT0gXCJlcnJvclwiKSkpXG4gICAgICAgICkge1xuICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgdGhpcy5zdG9wT3ZlcnJpZGVFdmVudExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3RvcE92ZXJyaWRlRXZlbnRMaXN0ZW5lcnMod2luZG93LCB0aGlzKTtcbiAgICB9XG5cbiAgICB0aGlzLk92ZXJyaWRlRXZlbnRMaXN0ZW5lcnNPbmxvYWRGaXJlZCA9IFtdO1xuICAgIHRoaXMuT3ZlcnJpZGVFdmVudExpc3RlbmVyc09ubG9hZFRvRmlyZSA9IFtdO1xuXG4gICAgdGhpcy5hcHBseU92ZXJyaWRlRXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tdXRhdGlvbk9ubG9hZEV2ZW50TGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciBldmVudEVsZW1lbnQgPSB0aGlzLm11dGF0aW9uT25sb2FkRXZlbnRMaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50RWxlbWVudC50YXJnZXQgJiYgZXZlbnRFbGVtZW50LnRhcmdldCAhPSBudWxsICYmIHR5cGVvZiBldmVudEVsZW1lbnQudGFyZ2V0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50RWxlbWVudC50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lckJhc2UoZXZlbnRFbGVtZW50LnR5cGUsIGV2ZW50RWxlbWVudC5saXN0ZW5lciwgZXZlbnRFbGVtZW50Lm9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAvL2ZpcmUgZXZlbnQgbWFudWFsbHkgaWYgb25sb2FkIGhhcyBhbHJlYWR5IGJlZW4gZmlyZWQgb24gcGFnZVxuICAgICAgICAgICAgICAgICAgICBpZiAod2luZG93LkNvb2tpZUNvbnNlbnQud2luZG93T25sb2FkVHJpZ2dlcmVkICYmICgoZXZlbnRFbGVtZW50LnRhcmdldCA9PT0gd2luZG93KSB8fCAoZXZlbnRFbGVtZW50LnRhcmdldCA9PT0gZG9jdW1lbnQpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldElEID0gZXZlbnRFbGVtZW50LnRhcmdldC50b1N0cmluZygpICsgZXZlbnRFbGVtZW50LnR5cGUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh3aW5kb3cuQ29va2llQ29uc2VudC5PdmVycmlkZUV2ZW50TGlzdGVuZXJzT25sb2FkRmlyZWQuaW5kZXhPZih0YXJnZXRJRCkgPCAwKSB7IC8vb3RoZXJ3aXNlIGl0IGhhcyBhbHJlYWR5IGJlZW4gZmlyZWQsIGUuZy4gd2luZG93LWxvYWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuQ29va2llQ29uc2VudC5PdmVycmlkZUV2ZW50TGlzdGVuZXJzT25sb2FkRmlyZWQucHVzaCh0YXJnZXRJRCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuT3ZlcnJpZGVFdmVudExpc3RlbmVyc09ubG9hZFRvRmlyZS5wdXNoKHsgdGFyZ2V0OiBldmVudEVsZW1lbnQudGFyZ2V0LCB0eXBlOiBldmVudEVsZW1lbnQudHlwZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICgoZXZlbnRFbGVtZW50LnRhcmdldCAhPT0gd2luZG93KSAmJiAoZXZlbnRFbGVtZW50LnRhcmdldCAhPT0gZG9jdW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldnQuaW5pdEV2ZW50KGV2ZW50RWxlbWVudC50eXBlLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudEVsZW1lbnQudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZXZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkgeyB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHdpbmRvdy5Db29raWVDb25zZW50Lk92ZXJyaWRlRXZlbnRMaXN0ZW5lcnNPbmxvYWRUb0ZpcmUubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIG92ZXJyaWRlRXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgICAgICAgICAgb3ZlcnJpZGVFdnQuaW5pdEV2ZW50KHdpbmRvdy5Db29raWVDb25zZW50Lk92ZXJyaWRlRXZlbnRMaXN0ZW5lcnNPbmxvYWRUb0ZpcmVbal0udHlwZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuT3ZlcnJpZGVFdmVudExpc3RlbmVyc09ubG9hZFRvRmlyZVtqXS50YXJnZXQuZGlzcGF0Y2hFdmVudChvdmVycmlkZUV2dCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vc3RyYW5nZSBiZWhhdmlvcjogYm9keS5vbmxvYWQgb25seSBmaXJlcyBpZiB3aW5kb3cub25sb2FkIGlzIG5vdCBkZWZpbmVkLlxuICAgICAgICAvL0lmIHdpbmRvdy5vbmxvYWQgaXMgYWxzbyBkZWZpbmVkLCBib2R5Lm9ubG9hZCB3aWxsIGJlIGEgZHVwbGljYXRlLCBvdmVycmlkaW5nIGFueSBzcGVjaWZpYyBib2R5Lm9ubG9hZC1oYW5kbGVyXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LndpbmRvd09ubG9hZFRyaWdnZXJlZCAmJlxuICAgICAgICAgICAgKHR5cGVvZiB3aW5kb3cub25sb2FkID09PSBcImZ1bmN0aW9uXCIpICYmXG4gICAgICAgICAgICAoZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoXCJvbmxvYWRcIikgPT0gbnVsbCB8fCBkb2N1bWVudC5ib2R5Lm9ubG9hZCAhPT0gd2luZG93Lm9ubG9hZClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB3aW5kb3cub25sb2FkKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm11dGF0aW9uT25sb2FkRXZlbnRMaXN0ZW5lcnMgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb25lRXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAobm9kZSwgY2xvbmUpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLm11dGF0aW9uRXZlbnRMaXN0ZW5lcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm11dGF0aW9uRXZlbnRMaXN0ZW5lcnNbal0udGFyZ2V0ID09PSBub2RlKSB7XG4gICAgICAgICAgICAgICAgY2xvbmUuYWRkRXZlbnRMaXN0ZW5lckJhc2UodGhpcy5tdXRhdGlvbkV2ZW50TGlzdGVuZXJzW2pdLnR5cGUsIHRoaXMubXV0YXRpb25FdmVudExpc3RlbmVyc1tqXS5saXN0ZW5lciwgdGhpcy5tdXRhdGlvbkV2ZW50TGlzdGVuZXJzW2pdLm9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kb3dubG9hZENvbmZpZ3VyYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vZG93bmxvYWQgY29uZmlndXJhdGlvbiBmb3IgY3VycmVudCBkb21haW4vcGF0aFxuICAgICAgICB2YXIgQ0ROUGF0aEZyYWdtZW50ID0gdGhpcy5jdXJyZW50UGF0aDtcbiAgICAgICAgaWYgKENETlBhdGhGcmFnbWVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoQ0ROUGF0aEZyYWdtZW50LmluZGV4T2YoXCIvXCIpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgQ0ROUGF0aEZyYWdtZW50ID0gXCIvXCIgKyBDRE5QYXRoRnJhZ21lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoQ0ROUGF0aEZyYWdtZW50Lmxhc3RJbmRleE9mKFwiL1wiKSAhPT0gKENETlBhdGhGcmFnbWVudC5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgIENETlBhdGhGcmFnbWVudCA9IENETlBhdGhGcmFnbWVudCArIFwiL1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgQ0ROUGF0aEZyYWdtZW50ID0gXCIvXCI7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgQVNDSUlPbmx5RG9tYWluID0gdGhpcy5kb21haW47XG4gICAgICAgIGlmIChBU0NJSU9ubHlEb21haW4uaW5kZXhPZihcInhuLS1cIikgIT09IDApIHsgLy9jaGVjayB3aGV0aGVyIHRoZSBicm93c2VyIHJldHVybnMgYW4gSUROIGRvbWFpbiBuYW1lLCBlLmcuIENocm9tZSBidXQgbm90IEVkZ2VcbiAgICAgICAgICAgIHZhciByZWdleCA9IC9bXlxcdTAwMjAtXFx1MDA3RV0vZ2k7XG4gICAgICAgICAgICBBU0NJSU9ubHlEb21haW4gPSB0aGlzLmRvbWFpbi5yZXBsYWNlKHJlZ2V4LCAnLScpXG4gICAgICAgIH1cbiAgICAgICAgLy9FeGFtcGxlOiBGb3IgdGhlIGRvbWFpbiBuYW1lIFwidW5nZXDDpXNwb3JldC5udVwiIENocm9tZSB3aWxsIHJldHVybiBcInhuLS11bmdlcHNwb3JldC0xOGEubnVcIiBmcm9tIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSAoc3RvcmVkIGluIHRoaXMuZG9tYWluKSxcbiAgICAgICAgLy93aGlsZSBFZGdlIHdpbGwgcmV0dXJuIFwidW5nZXDDpXNwb3JldC5udVwiIC0gVGhlIENETiBkb2VzIG5vdCBzdXBwb3J0IG5vbi1hc2NpaSBjaGFyYWN0ZXJzLFxuICAgICAgICAvL3RoZXJlZm9yIHR3byB2ZXJzaW9ucyBvZiB0aGUgZG9tYWluIG5hbWUgYXJlIGF2YWlsYWJsZSBpbiB0aGUgQ0ROOiBcInhuLS11bmdlcHNwb3JldC0xOGEubnVcIiAoQ2hyb21lKSBhbmQgXCJ1bmdlcC1zcG9yZXQubnVcIiAoRWRnZSkuXG5cbiAgICAgICAgLy9VUkwgbXVzdCBtYXRjaCBwYXRoIGdlbmVyYXRlZCBmcm9tIGNvb2tpZXNjYW5uZXJcbiAgICAgICAgdmFyIGNvbmZpZ3VyYXRpb25VUkwgPSB0aGlzLkNETiArIFwiL2NvbnNlbnRjb25maWcvXCIgKyB0aGlzLnNlcmlhbC50b0xvd2VyQ2FzZSgpICsgXCIvXCIgKyBBU0NJSU9ubHlEb21haW4gKyBDRE5QYXRoRnJhZ21lbnQgKyBcImNvbmZpZ3VyYXRpb24uanNcIjtcblxuICAgICAgICAvL2NsZWFyIGN1cnJlbnQgY29uZmlndXJhdGlvblxuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb24udGFncyA9IFtdO1xuXG4gICAgICAgIC8vbG9hZCBjb25maWd1cmF0aW9uIGZyb20gQ0ROXG4gICAgICAgIHRoaXMuZ2V0U2NyaXB0KGNvbmZpZ3VyYXRpb25VUkwsIGZhbHNlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBjb21iaW5lIGNvbmZpZ3VyYXRpb24gdGFncyB3aXRoIHRhZyBjYXRlZ29yaWVzXG4gICAgICAgICAgICBsb2FkSW5saW5lVGFnQ29uZmlndXJhdGlvbih3aW5kb3cuQ29va2llQ29uc2VudCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LmNvbmZpZ3VyYXRpb24ubG9hZGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy9jb21waWxlIHRyYWNraW5nIGRvbWFpbnMgbGlzdFxuICAgICAgICAgICAgaWYgKHdpbmRvdy5Db29raWVDb25zZW50LmNvbmZpZ3VyYXRpb24udHJhY2tpbmdEb21haW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgd2luZG93LkNvb2tpZUNvbnNlbnQuY29uZmlndXJhdGlvbi50YWdzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VGFnID0gd2luZG93LkNvb2tpZUNvbnNlbnQuY29uZmlndXJhdGlvbi50YWdzW2pdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKGN1cnJlbnRUYWcucmVzb2x2ZWRVcmwpICYmIChjdXJyZW50VGFnLnJlc29sdmVkVXJsICE9PSBcIlwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnREb21haW4gPSB3aW5kb3cuQ29va2llQ29uc2VudC5nZXRIb3N0bmFtZUZyb21VUkwoY3VycmVudFRhZy5yZXNvbHZlZFVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGN1cnJlbnREb21haW4gIT09IFwiXCIpICYmIChjdXJyZW50RG9tYWluICE9PSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuY29uZmlndXJhdGlvbi50cmFja2luZ0RvbWFpbnMucHVzaCh7IGQ6IGN1cnJlbnREb21haW4sIGM6IGN1cnJlbnRUYWcuY2F0IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmluaXRXaWRnZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdmFyIHdpZGdldEVuYWJsZWRPdmVycmlkZSA9IHRoaXMud2lkZ2V0ID8gdGhpcy53aWRnZXQuZW5hYmxlZE92ZXJyaWRlIDogbnVsbDtcbiAgICAgICAgdmFyIHdpZGdldEVuYWJsZWRJbmxpbmVPdmVycmlkZSA9IHRoaXMuaW5saW5lQ29uZmlndXJhdGlvbiAmJiB0aGlzLmlubGluZUNvbmZpZ3VyYXRpb24uV2lkZ2V0Q29uZmlndXJhdGlvbiA/IHRoaXMuaW5saW5lQ29uZmlndXJhdGlvbi5XaWRnZXRDb25maWd1cmF0aW9uLmVuYWJsZWQgOiBudWxsXG4gICAgICAgIHZhciBoYXNXaWRnZXRFbmFibGVkT3ZlcnJpZGUgPSB3aWRnZXRFbmFibGVkSW5saW5lT3ZlcnJpZGUgIT0gbnVsbCB8fCB3aWRnZXRFbmFibGVkT3ZlcnJpZGUgIT0gbnVsbDtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmlzT3V0T2ZSZWdpb24gfHxcbiAgICAgICAgICAgICF0aGlzLmhhc1Jlc3BvbnNlIHx8XG4gICAgICAgICAgICAhdGhpcy5jb29raWVFbmFibGVkIHx8XG4gICAgICAgICAgICAoaGFzV2lkZ2V0RW5hYmxlZE92ZXJyaWRlICYmICh3aWRnZXRFbmFibGVkSW5saW5lT3ZlcnJpZGUgPT09IGZhbHNlIHx8IHdpZGdldEVuYWJsZWRPdmVycmlkZSA9PT0gZmFsc2UpKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuY29tcHV0ZWRDb25maWd1cmF0aW9uLndpZGdldEVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGluaXRXaWRnZXRJbnRlcm5hbCgpIHtcbiAgICAgICAgICAgIHZhciB3aWRnZXRDb25maWcgPSB0aGF0LndpZGdldC5jb25maWd1cmF0aW9uO1xuICAgICAgICAgICAgdmFyIGVuYWJsZWQgPSB3aWRnZXRDb25maWcgJiYgKGhhc1dpZGdldEVuYWJsZWRPdmVycmlkZSB8fCB3aWRnZXRDb25maWcuZW5hYmxlZCk7IC8vaWYgb3ZlcnJpZGUgaXMgc2V0LCBieXBhc3MgJ2VuYWJsZWQnIGZyb20gY29uZmlnXG5cbiAgICAgICAgICAgIHRoYXQuY29tcHV0ZWRDb25maWd1cmF0aW9uLndpZGdldEVuYWJsZWQgPSBlbmFibGVkO1xuXG4gICAgICAgICAgICBpZiAoZW5hYmxlZCAmJiAhdGhhdC53aWRnZXQubG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuZ2V0U2NyaXB0KGNyZWF0ZVdpZGdldEljb25VcmwodGhhdC5ob3N0KSwgdHJ1ZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQud2lkZ2V0LmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLndpZGdldCA9IHRoaXMud2lkZ2V0IHx8IHt9O1xuXG4gICAgICAgIC8vIGlmIHNldHRpbmdzIGFyZSBub3QgbG9hZGVkIChleC4gc2xvdyBuZXR3b3JrKSwgd2FpdCBmb3IgdGhlbSB0byBsb2FkIGJlZm9yZSBpbml0aWFsaXppbmcgdGhlIHdpZGdldFxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIGZ1bmN0aW9uIHdhaXRGb3JTZXR0aW5ncygpIHtcbiAgICAgICAgICAgIGlmICh0aGF0LnNldHRpbmdzTG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoYXQud2lkZ2V0LmNvbmZpZ3VyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaW5pdFdpZGdldEludGVybmFsKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHdhaXRGb3JTZXR0aW5ncywgMTAwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB3YWl0Rm9yU2V0dGluZ3MoKTtcbiAgICB9XG5cbiAgICB0aGlzLmxvZ1dpZGdldEF0dHJpYnV0ZVdhcm5pbmcgPSBmdW5jdGlvbihhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gICAgICAgIHZhciBzdXBwb3J0VXJsID0gXCJodHRwczovL3N1cHBvcnQuY29va2llYm90LmNvbS9oYy9lbi11cy9hcnRpY2xlcy80NDA2NTcxMjk5MzQ2XCI7XG4gICAgICAgIGNvbnNvbGUud2FybihcIkNvb2tpZWJvdDogQ29va2llYm90IHNjcmlwdCBhdHRyaWJ1dGUgJyVzJyB3aXRoIHZhbHVlICAnJXMnIGlzIGludmFsaWQuIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IHZhbGlkIG9wdGlvbnMgc2VlICVzXCIsIGF0dHJpYnV0ZSwgdmFsdWUsIHN1cHBvcnRVcmwpO1xuICAgIH1cblxuICAgIHRoaXMubXV0YXRpb25IYW5kbGVyID0gZnVuY3Rpb24gKG11dGF0aW9uc0xpc3QsIG11dGF0aW9uT2JzZXJ2ZXIpIHtcbiAgICAgICAgbXV0YXRpb25IYW5kbGVyKHdpbmRvdywgZG9jdW1lbnQsIG11dGF0aW9uc0xpc3QpO1xuICAgIH1cblxuICAgIHRoaXMucHJlbG9hZE11dGF0aW9uU2NyaXB0ID0gZnVuY3Rpb24gKHNyYykge1xuICAgICAgICB2YXIgcHJlbG9hZExpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50T3JpZyhcImxpbmtcIik7XG4gICAgICAgIHByZWxvYWRMaW5rLmhyZWYgPSBzcmM7XG4gICAgICAgIHByZWxvYWRMaW5rLnJlbCA9IFwicHJlbG9hZFwiO1xuICAgICAgICBwcmVsb2FkTGluay5hcyA9IFwic2NyaXB0XCI7XG4gICAgICAgIHByZWxvYWRMaW5rLkNCX2lzQ2xvbmUgPSAxO1xuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHByZWxvYWRMaW5rKTtcbiAgICB9XG5cbiAgICB0aGlzLnByb2Nlc3NNdXRhdGlvbiA9IGZ1bmN0aW9uIChub2RlLCBpc1Bvc3RQb25lZCkge1xuICAgICAgICBwcm9jZXNzTXV0YXRpb24odGhpcywgbm9kZSwgaXNQb3N0UG9uZWQpO1xuICAgIH1cblxuICAgIHRoaXMuaXNDb29raWVib3ROb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIGlzQ29va2llYm90Tm9kZSh0aGlzLCBub2RlKTtcbiAgICB9XG5cbiAgICB0aGlzLmlzQ29va2llYm90Q29yZU5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICByZXR1cm4gKHRoaXMuaXNDb29raWVib3ROb2RlKG5vZGUpICYmIChub2RlLnNyYy5pbmRleE9mKFwiL3VjLmpzXCIpID4gLTEpKTtcbiAgICB9XG5cbiAgICB0aGlzLnBvc3Rwb25lTXV0YXRpb24gPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBwb3N0cG9uZU11dGF0aW9uKHdpbmRvdywgdGhpcywgbm9kZSk7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9jZXNzUG9zdFBvbmVkTXV0YXRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBwcm9jZXNzUG9zdFBvbmVkTXV0YXRpb25zKHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuZGVxdWV1ZU5vbkFzeW5jU2NyaXB0cyA9IGZ1bmN0aW9uIChtdXRhdGlvbk5vZGVzKSB7XG4gICAgICAgIGRlcXVldWVOb25Bc3luY1NjcmlwdHModGhpcywgbXV0YXRpb25Ob2Rlcyk7XG4gICAgfVxuXG4gICAgdGhpcy5nZXRUYWdDb29raWVDYXRlZ29yaWVzID0gZnVuY3Rpb24gKG91dGVyaHRtbCwgdGFnVVJMLCBub2RlLCBtYXRjaENvbW1vbikge1xuICAgICAgICByZXR1cm4gZ2V0VGFnQ29va2llQ2F0ZWdvcmllcyh3aW5kb3csIHRoaXMsIG91dGVyaHRtbCwgdGFnVVJMLCBub2RlLCBtYXRjaENvbW1vbik7XG4gICAgfVxuXG4gICAgdGhpcy5jb29raWVDYXRlZ29yaWVzRnJvbU51bWJlckFycmF5ID0gY29va2llQ2F0ZWdvcmllc0Zyb21OdW1iZXJBcnJheTtcblxuICAgIC8vc3RvcCBtdXRhdGlvbm9iZXJzZXJ2ZXIgaWYgYWN0aXZlIHRvIG5vdCBhcHBseSBkYXRhLWNvb2tpZWNvbnNlbnQtYXR0cmlidXRlIHRvIGR5bmFtaWNhbGx5IGxvYWRlZCB0YWdzIGZyb20gdGFncyB0aGF0IGhhdmUgYWxyZWFkeSBiZWVuIG1hcmtlZFxuICAgIHRoaXMuc3RvcE11dGF0aW9uT2JzZXJ2ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHN0b3BNdXRhdGlvbk9ic2VydmVyKHdpbmRvdywgdGhpcyk7XG4gICAgfVxuXG4gICAgLy9GYWxsYmFjay1tZXRob2RzIGZvciBhdXRvbWF0aWMgY29rb2llLWJsb2NraW5nIG9uIG9sZCBicm93c2Vyc1xuICAgIHRoaXMubXV0YXRpb25IYW5kbGVyRmFsbGJhY2sgPSBmdW5jdGlvbiAoY2hhcnNldCkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ09sZGVyIGJyb3dzZXJzIHN1cHBvcnQgaXMgZGVwcmVjYXRlZC4gQ29uc2lkZXIgdXBncmFkaW5nIHlvdXIgYnJvd3NlcicpO1xuICAgIH1cblxuICAgIHRoaXMubXV0YXRpb25IYW5kbGVyRmFsbGJhY2tJbml0ID0gZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdPbGRlciBicm93c2VycyBzdXBwb3J0IGlzIGRlcHJlY2F0ZWQuIENvbnNpZGVyIHVwZ3JhZGluZyB5b3VyIGJyb3dzZXInKTtcbiAgICB9XG5cbiAgICB0aGlzLmZhbGxiYWNrU2NyaXB0Tm9kZXMgPSBbXTtcbiAgICB0aGlzLmZhbGxiYWNrRGVmZXJOb2RlcyA9IFtdO1xuXG4gICAgdGhpcy5zdGFydEpRdWVyeUhvbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgodHlwZW9mIHdpbmRvdy5qUXVlcnkgIT09ICd1bmRlZmluZWQnKSAmJiAodHlwZW9mIHdpbmRvd1tcIkNCX2pRdWVyeUhvbGRSZWFkeVN0YXJ0ZWRcIl0gPT09ICd1bmRlZmluZWQnKSAmJiAodHlwZW9mIHdpbmRvdy5qUXVlcnkuaG9sZFJlYWR5ICE9PSBcInVuZGVmaW5lZFwiKSkge1xuICAgICAgICAgICAgd2luZG93W1wiQ0JfalF1ZXJ5SG9sZFJlYWR5U3RhcnRlZFwiXSA9IDE7XG5cbiAgICAgICAgICAgIC8vaWYgaG9sZFJlYWR5IGZ1bmN0aW9uIGlzIG92ZXJyaWRkZW4gYnkgb3RoZXIgdGFnLCBlLmcuIGh0dHA6Ly9pbmZvYmlwLWludGVncmF0aW9uLnN5c2IuZWUvd3AtY29udGVudC90aGVtZXMvaW5mb2JpcC9zdGF0aWMvZGlzdC9idW5kbGUuanM/dmVyPTEuMDFcbiAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LmhvbGRSZWFkeUNsb25lID0galF1ZXJ5LmhvbGRSZWFkeTtcbiAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50LmhvbGRSZWFkeUNsb25lKHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5lbmRKUXVlcnlIb2xkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAodHlwZW9mIHdpbmRvdy5qUXVlcnkgIT09ICd1bmRlZmluZWQnKSAmJlxuICAgICAgICAgICAgKHR5cGVvZiB3aW5kb3dbXCJDQl9qUXVlcnlIb2xkUmVhZHlTdGFydGVkXCJdICE9PSAndW5kZWZpbmVkJykgJiZcbiAgICAgICAgICAgICh0eXBlb2Ygd2luZG93LkNvb2tpZUNvbnNlbnQuaG9sZFJlYWR5Q2xvbmUgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICkge1xuICAgICAgICAgICAgd2luZG93LkNvb2tpZUNvbnNlbnQuaG9sZFJlYWR5Q2xvbmUoZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5sb2FkRmFsbGJhY2tTY3JpcHROb2RlcyA9IGZ1bmN0aW9uIChtdXRhdGlvbk5vZGVzKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignT2xkZXIgYnJvd3NlcnMgc3VwcG9ydCBpcyBkZXByZWNhdGVkLiBDb25zaWRlciB1cGdyYWRpbmcgeW91ciBicm93c2VyJyk7XG4gICAgfVxuXG4gICAgdGhpcy5tdXRhdGlvbkhhbmRsZXJGYWxsYmFja01hcmt1cFRhZyA9IGZ1bmN0aW9uIChkb2MsIG5vZGVUeXBlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignT2xkZXIgYnJvd3NlcnMgc3VwcG9ydCBpcyBkZXByZWNhdGVkLiBDb25zaWRlciB1cGdyYWRpbmcgeW91ciBicm93c2VyJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXNvbHZlVVJMID0gcmVzb2x2ZVVSTDtcblxuICAgIHRoaXMuZ2V0SG9zdG5hbWVGcm9tVVJMID0gZ2V0SG9zdG5hbWVGcm9tVVJMO1xuXG4gICAgdGhpcy51cGRhdGVSZWd1bGF0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGdkcHJBcHBsaWVzT3ZlcnJpZGUgPSB0aGlzLmlubGluZUNvbmZpZ3VyYXRpb24gJiYgdGhpcy5pbmxpbmVDb25maWd1cmF0aW9uLkZyYW1ld29ya3MgJiYgdGhpcy5pbmxpbmVDb25maWd1cmF0aW9uLkZyYW1ld29ya3MuSUFCVENGMiAmJiB0aGlzLmlubGluZUNvbmZpZ3VyYXRpb24uRnJhbWV3b3Jrcy5JQUJUQ0YyLkdkcHJBcHBsaWVzO1xuXG4gICAgICAgIGlmICh0aGlzLnVzZXJDb3VudHJ5ICE9PSAnJykge1xuICAgICAgICAgICAgdmFyIGxvd2VyY2FzZUNvdW50cnkgPSB0aGlzLnVzZXJDb3VudHJ5LnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIC8vR0RQUiAtIGNhbiBiZSBvdmVyd3JpdHRlbiBvbiBUQ0YgYmFubmVycyBieSBpbmxpbmVDb25maWd1cmF0aW9uXG4gICAgICAgICAgICB0aGlzLnJlZ3VsYXRpb25zLmdkcHJBcHBsaWVzID0gKHRoaXMuZnJhbWV3b3JrID09PSBcIlRDRnYyLjNcIiAmJiBnZHByQXBwbGllc092ZXJyaWRlICE9IHVuZGVmaW5lZCkgPyBnZHByQXBwbGllc092ZXJyaWRlID09PSB0cnVlIDogdGhpcy5yZWd1bGF0aW9uUmVnaW9ucy5nZHByLmluZGV4T2YobG93ZXJjYXNlQ291bnRyeSkgPj0gMDtcblxuICAgICAgICAgICAgLy9DQ1BBXG4gICAgICAgICAgICB0aGlzLnJlZ3VsYXRpb25zLmNjcGFBcHBsaWVzID0gdGhpcy5yZWd1bGF0aW9uUmVnaW9ucy5jY3BhLmluZGV4T2YobG93ZXJjYXNlQ291bnRyeSkgPj0gMDtcblxuICAgICAgICAgICAgLy9MR1BEXG4gICAgICAgICAgICB0aGlzLnJlZ3VsYXRpb25zLmxncGRBcHBsaWVzID0gdGhpcy5yZWd1bGF0aW9uUmVnaW9ucy5sZ3BkLmluZGV4T2YobG93ZXJjYXNlQ291bnRyeSkgPj0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgLy91c2VyIGlzIG91dCBvZiByZWdpb24gLSB3ZSBkb24ndCBzdG9yZSB0aGUgY291bnRyeSBvZiBzdWNoIHVzZXIgaW4gdGhlIGNvbnNlbnQgY29va2llXG4gICAgICAgICAgICB0aGlzLnJlZ3VsYXRpb25zLmdkcHJBcHBsaWVzID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnJlZ3VsYXRpb25zLmNjcGFBcHBsaWVzID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnJlZ3VsYXRpb25zLmxncGRBcHBsaWVzID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzRnJhbWV3b3JrKHRoaXMpICYmIHRoaXMuZnJhbWV3b3JrTG9hZGVkKSB7XG4gICAgICAgICAgICBpZiAoKHR5cGVvZiB3aW5kb3cuQ29va2llQ29uc2VudElBQkNNUCA9PT0gJ29iamVjdCcpICYmICh3aW5kb3cuQ29va2llQ29uc2VudElBQkNNUC51cGRhdGVGcmFtZXdvcmspKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5Db29raWVDb25zZW50SUFCQ01QLmdkcHJBcHBsaWVzICE9PSB0aGlzLnJlZ3VsYXRpb25zLmdkcHJBcHBsaWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5Db29raWVDb25zZW50SUFCQ01QLnVwZGF0ZUZyYW1ld29yaygpOyAvL3VwZGF0ZSBmb3IgZ2RwckFwcGxpZXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNpZ25hbENvbnNlbnRSZWFkeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IC8vc2V0VGltZW91dCBuZWNlc3NhcnkgdG8gYWxsb3cgQ29va2llQ29uc2VudCBvYmplY3QgdG8gY29uc3RydWN0IGZpcnN0XG4gICAgICAgICAgICB2YXIgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgIGV2ZW50LmluaXRFdmVudCgnQ29va2llYm90T25Db25zZW50UmVhZHknLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblxuICAgICAgICAgICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgICAgICAgIGV2ZW50LmluaXRFdmVudCgnQ29va2llQ29uc2VudE9uQ29uc2VudFJlYWR5JywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIH0sIDEpO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdCgpO1xufVxuXG53aW5kb3cuQ29va2llQ29udHJvbC5Db29raWUucHJvdG90eXBlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbn1cblxud2luZG93LkNvb2tpZUNvbnRyb2wuQ29va2llLnByb3RvdHlwZS5vbmRlY2xpbmUgPSBmdW5jdGlvbiAoKSB7XG59XG5cbndpbmRvdy5Db29raWVDb250cm9sLkNvb2tpZS5wcm90b3R5cGUub25hY2NlcHQgPSBmdW5jdGlvbiAoKSB7XG59XG5cbndpbmRvdy5Db29raWVDb250cm9sLkRhdGVUaW1lID0gZnVuY3Rpb24gKGluaXRkYXRlKSB7XG4gICAgdGhpcy5EYXRlID0gbmV3IERhdGUoKTtcblxuICAgIGlmIChpbml0ZGF0ZSkge1xuICAgICAgICB0aGlzLkRhdGUgPSBuZXcgRGF0ZShpbml0ZGF0ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5pc0xlYXBZZWFyID0gZnVuY3Rpb24gKHllYXIpIHtcbiAgICAgICAgcmV0dXJuICgoKHllYXIgJSA0ID09PSAwKSAmJiAoeWVhciAlIDEwMCAhPT0gMCkpIHx8ICh5ZWFyICUgNDAwID09PSAwKSk7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0RGF5c0luTW9udGggPSBmdW5jdGlvbiAoeWVhciwgbW9udGgpIHtcbiAgICAgICAgcmV0dXJuIFszMSwgKHRoaXMuaXNMZWFwWWVhcih5ZWFyKSA/IDI5IDogMjgpLCAzMSwgMzAsIDMxLCAzMCwgMzEsIDMxLCAzMCwgMzEsIDMwLCAzMV1bbW9udGhdO1xuICAgIH07XG5cbiAgICB0aGlzLmFkZE1vbnRocyA9IGZ1bmN0aW9uIChtb250aGNvdW50KSB7XG4gICAgICAgIHZhciBuID0gdGhpcy5EYXRlLmdldERhdGUoKTtcbiAgICAgICAgdGhpcy5EYXRlLnNldERhdGUoMSk7XG4gICAgICAgIHRoaXMuRGF0ZS5zZXRNb250aCh0aGlzLkRhdGUuZ2V0TW9udGgoKSArIG1vbnRoY291bnQpO1xuICAgICAgICB0aGlzLkRhdGUuc2V0RGF0ZShNYXRoLm1pbihuLCB0aGlzLmdldERheXNJbk1vbnRoKHRoaXMuRGF0ZS5nZXRGdWxsWWVhcigpLCB0aGlzLkRhdGUuZ2V0TW9udGgoKSkpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuRGF0ZTtcbiAgICB9O1xufVxuXG4vL1N1cHBvcnQgb2YgSUFCIENDUEEgY29uc2VudCBmcmFtZXdvcmsgKFwiVS5TLiBQcml2YWN5IEFQSVwiIC0gXCJVU1AgQVBJXCIpLCBodHRwczovL3d3dy5pYWIuY29tL2d1aWRlbGluZXMvY2NwYS1mcmFtZXdvcmsvICsgaHR0cHM6Ly9pYWJ0ZWNobGFiLmNvbS9zdGFuZGFyZHMvY2NwYS9cbi8qIFVTUCBBUEkgc3RhcnQgKi9cbndpbmRvdy5fX3VzcGFwaSA9IHVzcGFwaTtcblxuLy9DcmVhdGUgYW5jZXN0b3IgZnJhbWUgXCJfX3VzcGFwaUxvY2F0b3JcIiBzbyB0aGF0IF9fdXNwYXBpIGNhbiBiZSBjYWxsZWQgZnJvbSBpZnJhbWVzIGJ5IGFkIHRlY2ggdmVuZG9yc1xud2luZG93LmFkZFVzcGFwaUxvY2F0b3JGcmFtZSA9IGFkZFVzcGFwaUxvY2F0b3JGcmFtZTtcblxud2luZG93LmFkZFVzcGFwaUxvY2F0b3JGcmFtZSgpO1xuXG4vL1JlZ2lzdGVyIHBvc3RNZXNzYWdlIGhhbmRsZXIgZm9yIGlmcmFtZSBjYWxscyB0byBfX3VzcGFwaVxud2luZG93Ll9faGFuZGxlVXNwYXBpTWVzc2FnZSA9IGhhbmRsZVVzcGFwaU1lc3NhZ2U7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgd2luZG93Ll9faGFuZGxlVXNwYXBpTWVzc2FnZSwgZmFsc2UpO1xuLyogVVNQIEFQSSBlbmQgKi9cblxuLyogSUFCIFRDRjIgU1RVQiBCRUdJTiAqL1xud2luZG93LnByb3BhZ2F0ZUlBQlN0dWIgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gYmFzZWQgb24gdGhlIHJlZmVyZW5jZSBzdHViIHByb3ZpZGVkIGJ5IElBQiBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vSW50ZXJhY3RpdmVBZHZlcnRpc2luZ0J1cmVhdS9pYWJ0Y2YtZXMvYmxvYi9tYXN0ZXIvbW9kdWxlcy9zdHViL3NyYy9zdHViLmpzXG5cbiAgICBmdW5jdGlvbiBwb3N0TWVzc2FnZUV2ZW50SGFuZGxlcihldmVudCkge1xuICAgICAgICB2YXIgbXNnSXNTdHJpbmcgPSB0eXBlb2YgZXZlbnQuZGF0YSA9PT0gXCJzdHJpbmdcIjtcbiAgICAgICAgdmFyIGpzb24gPSB7fTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUcnkgdG8gcGFyc2UgdGhlIGRhdGEgZnJvbSB0aGUgZXZlbnQuICBUaGlzIGlzIGltcG9ydGFudFxuICAgICAgICAgICAgICogdG8gaGF2ZSBpbiBhIHRyeS9jYXRjaCBiZWNhdXNlIG9mdGVuIG1lc3NhZ2VzIG1heSBjb21lXG4gICAgICAgICAgICAgKiB0aHJvdWdoIHRoYXQgYXJlIG5vdCBKU09OXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmIChtc2dJc1N0cmluZykge1xuICAgICAgICAgICAgICAgIGpzb24gPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBqc29uID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7IH1cblxuICAgICAgICB2YXIgcGF5bG9hZCA9IGpzb24gJiYganNvbi5fX3RjZmFwaUNhbGw7XG5cbiAgICAgICAgaWYgKHBheWxvYWQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5fX3RjZmFwaShcbiAgICAgICAgICAgICAgICBwYXlsb2FkLmNvbW1hbmQsXG4gICAgICAgICAgICAgICAgcGF5bG9hZC52ZXJzaW9uLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXRWYWx1ZSwgc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmV0dXJuTXNnID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgX190Y2ZhcGlSZXR1cm46IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZTogcmV0VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2Vzczogc3VjY2VzcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsSWQ6IHBheWxvYWQuY2FsbElkLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobXNnSXNTdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybk1zZyA9IEpTT04uc3RyaW5naWZ5KHJldHVybk1zZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQuc291cmNlICYmIGV2ZW50LnNvdXJjZS5wb3N0TWVzc2FnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuc291cmNlLnBvc3RNZXNzYWdlKHJldHVybk1zZywgXCIqXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYXlsb2FkLnBhcmFtZXRlclxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBUQ0ZfTE9DQVRPUl9OQU1FID0gXCJfX3RjZmFwaUxvY2F0b3JcIjtcbiAgICB2YXIgcXVldWUgPSBbXTtcbiAgICB2YXIgd2luID0gd2luZG93O1xuICAgIHZhciBjbXBGcmFtZTtcblxuICAgIGZ1bmN0aW9uIGFkZEZyYW1lKCkge1xuICAgICAgICB2YXIgZG9jID0gd2luLmRvY3VtZW50O1xuICAgICAgICB2YXIgb3RoZXJDTVAgPSAhIXdpbi5mcmFtZXNbVENGX0xPQ0FUT1JfTkFNRV07XG5cbiAgICAgICAgaWYgKCFvdGhlckNNUCkge1xuICAgICAgICAgICAgaWYgKGRvYy5ib2R5KSB7XG4gICAgICAgICAgICAgICAgYXBwbHlSdW50aW1lU3R5bGVzaGVldChkb2MsIHdpbi5Db29raWVDb25zZW50ICYmIHdpbi5Db29raWVDb25zZW50Lm5vbmNlKTtcbiAgICAgICAgICAgICAgICB2YXIgaWZyYW1lID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIik7XG4gICAgICAgICAgICAgICAgaWZyYW1lLmNsYXNzTGlzdC5hZGQoSElEREVOX0lGUkFNRV9DTEFTUyk7XG4gICAgICAgICAgICAgICAgaWZyYW1lLm5hbWUgPSBUQ0ZfTE9DQVRPUl9OQU1FO1xuICAgICAgICAgICAgICAgIGRvYy5ib2R5LmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoYWRkRnJhbWUsIDUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICFvdGhlckNNUDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0Y2ZBUElIYW5kbGVyKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBnZHByQXBwbGllcztcbiAgICAgICAgaWYgKCFhcmdzLmxlbmd0aCkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBzaG9ydGN1dCB0byBnZXQgdGhlIHF1ZXVlIHdoZW4gdGhlIGZ1bGwgQ01QXG4gICAgICAgICAgICAgKiBpbXBsZW1lbnRhdGlvbiBsb2FkczsgaXQgY2FuIGNhbGwgdGNmYXBpSGFuZGxlcigpXG4gICAgICAgICAgICAgKiB3aXRoIG5vIGFyZ3VtZW50cyB0byBnZXQgdGhlIHF1ZXVlZCBhcmd1bWVudHNcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXVlO1xuICAgICAgICB9IGVsc2UgaWYgKGFyZ3NbMF0gPT09IFwic2V0R2RwckFwcGxpZXNcIikge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBzaG9ydGN1dCB0byBzZXQgZ2RwckFwcGxpZXMgaWYgdGhlIHB1Ymxpc2hlclxuICAgICAgICAgICAgICoga25vd3MgdGhhdCB0aGV5IGFwcGx5IEdEUFIgcnVsZXMgdG8gYWxsXG4gICAgICAgICAgICAgKiB0cmFmZmljIChzZWUgdGhlIHNlY3Rpb24gb24gXCJXaGF0IGRvZXMgdGhlXG4gICAgICAgICAgICAgKiBnZHByQXBwbGllcyB2YWx1ZSBtZWFuXCIgZm9yIG1vcmVcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGFyZ3MubGVuZ3RoID4gMyAmJlxuICAgICAgICAgICAgICAgIHBhcnNlSW50KGFyZ3NbMV0sIDEwKSA9PT0gMiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBhcmdzWzNdID09PSBcImJvb2xlYW5cIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZ2RwckFwcGxpZXMgPSBhcmdzWzNdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmdzWzJdID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1syXShcInNldFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYXJnc1swXSA9PT0gXCJwaW5nXCIpIHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogT25seSBzdXBwb3J0ZWQgbWV0aG9kOyBnaXZlIFBpbmdSZXR1cm5cbiAgICAgICAgICAgICAqIG9iamVjdCBhcyByZXNwb25zZVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICB2YXIgcmV0ciA9IHtcbiAgICAgICAgICAgICAgICBnZHByQXBwbGllczogZ2RwckFwcGxpZXMsXG4gICAgICAgICAgICAgICAgY21wTG9hZGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBjbXBTdGF0dXM6IFwic3R1YlwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3NbMl0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGFyZ3NbMl0ocmV0cik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIHNvbWUgb3RoZXIgbWV0aG9kLCBqdXN0IHF1ZXVlIGl0IGZvciB0aGVcbiAgICAgICAgICAgICAqIGZ1bGwgQ01QIGltcGxlbWVudGF0aW9uIHRvIGRlYWwgd2l0aFxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGUgdXAgdG8gdGhlIHRvcCB3aW5kb3cgY2hlY2tpbmcgZm9yIGFuIGFscmVhZHktY3JlYXRlZFxuICAgICAqIFwiX190Y2ZhcGlsTG9jYXRvclwiIGZyYW1lIG9uIGV2ZXJ5IGxldmVsLiBJZiBvbmUgZXhpc3RzIGFscmVhZHkgdGhlbiB3ZSBhcmVcbiAgICAgKiBub3QgdGhlIG1hc3RlciBDTVAgYW5kIHdpbGwgbm90IHF1ZXVlIGNvbW1hbmRzLlxuICAgICAqL1xuXG4gICAgd2hpbGUgKHdpbikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHdpbi5mcmFtZXNbVENGX0xPQ0FUT1JfTkFNRV0pIHtcbiAgICAgICAgICAgICAgICBjbXBGcmFtZSA9IHdpbjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7IH1cblxuICAgICAgICAvLyBpZiB3ZSdyZSBhdCB0aGUgdG9wIGFuZCBubyBjbXBGcmFtZVxuICAgICAgICBpZiAod2luID09PSB3aW5kb3cudG9wKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1vdmUgdXBcbiAgICAgICAgd2luID0gd2luLnBhcmVudDtcbiAgICB9XG5cbiAgICBpZiAoIWNtcEZyYW1lKSB7XG4gICAgICAgIC8vIHdlIGhhdmUgcmVjdXInZCB1cCB0aGUgd2luZG93cyBhbmQgaGF2ZSBmb3VuZCBubyBfX3RjZmFwaUxvY2F0b3IgZnJhbWVcbiAgICAgICAgYWRkRnJhbWUoKTtcbiAgICAgICAgd2luLl9fdGNmYXBpID0gdGNmQVBJSGFuZGxlcjtcbiAgICAgICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIHBvc3RNZXNzYWdlRXZlbnRIYW5kbGVyLCBmYWxzZSk7XG4gICAgfVxufVxuXG4vKiBJQUIgVENGMiBTVFVCIEVORCAqL1xuXG4vL0NyZWF0ZSB0aGUgQ29va2llQ29uc2VudCBvYmplY3Rcbi8vYXZvaWQgdG8gY3JlYXRlIG9iamVjdCBtdWx0aXBsZSB0aW1lcyBpZiBjdXN0b21lciBoYXMgaW5jbHVkZWQgdGhlIENvb2tpZWJvdCB0YWcgbXVsdGlwbGUgdGltZXMsIGllLiBkaXJlY3RseSBpbiBjb2RlICsgaW4gR29vZ2xlIFRhZyBNYW5hZ2VyXG5pZiAodHlwZW9mIHdpbmRvdy5Db29raWVDb25zZW50ICE9PSBcIm9iamVjdFwiIHx8ICh3aW5kb3cuQ29va2llQ29uc2VudCAmJiB3aW5kb3cuQ29va2llQ29uc2VudC5ub2RlVHlwZSkpIHsgLy8gaWYgbm90IGRlZmluZWQgT1IgdGFyZ2V0cyBodG1sIGVsZW1lbnQgd2l0aCBcIkNvb2tpZUNvbnNlbnRcIiBJRFxuICAgIHdpbmRvdy5Db29raWVDb25zZW50ID0gbmV3IHdpbmRvdy5Db29raWVDb250cm9sLkNvb2tpZSgnQ29va2llQ29uc2VudCcpO1xuICAgIGlmICgod2luZG93LkNvb2tpZUNvbnNlbnQuc2NyaXB0SWQgIT09ICdDb29raWVDb25zZW50JykgJiYgKHdpbmRvdy5Db29raWVDb25zZW50LnNjcmlwdElkICE9PSAnQ29va2llYm90JykpIHtcbiAgICAgICAgd2luZG93W3dpbmRvdy5Db29raWVDb25zZW50LnNjcmlwdElkXSA9IHdpbmRvdy5Db29raWVDb25zZW50O1xuICAgIH1cbn1cbmVsc2Uge1xuICAgIGNvbnNvbGUud2FybihcIldBUk5JTkc6IENvb2tpZWJvdCBzY3JpcHQgaXMgaW5jbHVkZWQgdHdpY2UgLSBwbGVhc2UgcmVtb3ZlIG9uZSBpbnN0YW5jZSB0byBhdm9pZCB1bmV4cGVjdGVkIHJlc3VsdHMuXCIpO1xufVxuIl0sIm5hbWVzIjpbIlByb21pc2UiLCJwcm9taXNlRmluYWxseSIsIlByb21pc2VQb255ZmlsbCJdLCJtYXBwaW5ncyI6Ijs7O0lBRUE7Ozs7SUFJRztJQUNhLFNBQUEsZUFBZSxDQUFDLGFBQTZCLEVBQUUsSUFBcUMsRUFBQTtRQUNsRyxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzVCLElBQU0sR0FBRyxHQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDL0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDckYsUUFBUSxHQUFHLElBQUksQ0FBQztJQUNqQixTQUFBO0lBQ0YsS0FBQTtJQUVELElBQUEsT0FBTyxRQUFRLENBQUM7SUFDbEI7O0lDakJBOzs7SUFHRztJQUNJLElBQU0sVUFBVSxHQUFHLFVBQVMsR0FBVyxFQUFBO1FBQzVDLElBQUksR0FBRyxLQUFLLEVBQUUsRUFBRTtZQUNkLElBQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQyxRQUFBLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1lBQ2IsT0FBUSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBdUIsQ0FBQyxJQUFJLENBQUM7SUFDdkQsS0FBQTtJQUFNLFNBQUE7SUFDTCxRQUFBLE9BQU8sR0FBRyxDQUFDO0lBQ1osS0FBQTtJQUNILENBQUM7O0lDWkQ7OztJQUdHO0lBQ0ksSUFBTSxRQUFRLEdBQUcsVUFBUyxDQUFxQixFQUFBO0lBQ3BELElBQUEsSUFBSSxPQUFPLENBQUMsS0FBSyxXQUFXLEVBQUU7SUFDNUIsUUFBQSxPQUFPLEVBQUUsQ0FBQztJQUNYLEtBQUE7SUFDRCxJQUFBLElBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsSUFBQSxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVWLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUNaLFlBQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzQyxTQUFBO0lBQ0YsS0FBQTtJQUNELElBQUEsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDOztJQ25CRDs7O0lBR0c7SUFDSSxJQUFNLG9CQUFvQixHQUFHLFVBQVUsS0FBYSxFQUFBO0lBQ3pELElBQUEsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFFdEMsT0FBTyxPQUFPLE1BQU0sS0FBSyxRQUFRLEdBQUcsSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztJQUNwRixDQUFDOztJQ1JEOzs7SUFHRztJQUNJLElBQU0sa0JBQWtCLEdBQUcsVUFBUyxHQUF1QixFQUFBO1FBQ2hFLElBQUk7WUFDRixJQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekMsUUFBQSxDQUF1QixDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7WUFDcEMsT0FBUSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBdUIsQ0FBQyxRQUFRLENBQUM7SUFDM0QsS0FBQTtJQUFDLElBQUEsT0FBTyxDQUFDLEVBQUU7SUFDVixRQUFBLE9BQU8sRUFBRSxDQUFDO0lBQ1gsS0FBQTtJQUNILENBQUM7O0lDWkQ7OztJQUdHO0lBQ0ksSUFBTSxlQUFlLEdBQUcsVUFBQyxrQkFBc0MsRUFBQTtJQUNwRSxJQUFBLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxVQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUE7SUFDdkMsUUFBQSxPQUFPLEVBQUUsQ0FBQztJQUNaLEtBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0lBRUY7Ozs7SUFJRztJQUNJLElBQU0sb0JBQW9CLEdBQUcsVUFBVSxrQkFBc0MsRUFBRSxTQUFpQixFQUFBO0lBQ3JHLElBQUEsT0FBTyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsT0FBTyxFQUFBO0lBQzdDLFFBQUEsVUFBVSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNqQyxLQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7O0lDbkJEOzs7SUFHRztJQWVIOzs7O0lBSUc7SUFDSSxJQUFNLGtCQUFrQixHQUFHLFVBQVUsS0FBYSxFQUFFLE1BQWMsRUFBQTtJQUN2RSxJQUFBLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUU7SUFDekIsUUFBQSxPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDL0MsS0FBQTtJQUFNLFNBQUE7SUFDTCxRQUFBLE9BQU8sS0FBSyxDQUFDO0lBQ2QsS0FBQTtJQUNILENBQUM7O0lDM0JNLElBQU0sb0JBQW9CLEdBQUcsYUFBYSxDQUFDO0lBRTNDLElBQU0sbUJBQW1CLEdBQUcsWUFBWSxDQUFDO0lBRXpDLElBQU0sa0JBQWtCLEdBQUcsV0FBVyxDQUFDO0lBSTlDOzs7SUFHRztJQUNHLFNBQVUsK0JBQStCLENBQUUsY0FBd0IsRUFBQTtRQUN2RSxJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFFeEIsSUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM5QyxJQUFJLGNBQWMsS0FBSyxFQUFFLEVBQUU7Z0JBQ3pCLGNBQWMsSUFBSSxHQUFHLENBQUM7SUFDdkIsU0FBQTtJQUVELFFBQUEsUUFBUSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9CLFlBQUEsS0FBSyxDQUFDO29CQUNKLGNBQWMsSUFBSSxvQkFBb0IsQ0FBQztvQkFDdkMsTUFBTTtJQUNSLFlBQUEsS0FBSyxDQUFDO29CQUNKLGNBQWMsSUFBSSxtQkFBbUIsQ0FBQztvQkFDdEMsTUFBTTtJQUNSLFlBQUEsS0FBSyxDQUFDO0lBQ0osZ0JBQUEsSUFBSSxDQUFDLGNBQWMsS0FBSyxFQUFFLE1BQU0sY0FBYyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ2xGLGNBQWMsSUFBSSxrQkFBa0IsQ0FBQztJQUN0QyxpQkFBQTtvQkFDRCxNQUFNO0lBS1QsU0FBQTtJQUNGLEtBQUE7SUFFRCxJQUFBLElBQUksQ0FBQyxjQUFjLEtBQUssRUFBRSxNQUFNLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTtJQUNqRSxRQUFBLGNBQWMsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLEtBQUE7SUFFRCxJQUFBLE9BQU8sY0FBYyxDQUFDO0lBQ3hCOztJQzVDTyxJQUFNLHVCQUF1QixHQUFHLENBQUMsQ0FBQztJQUVsQyxJQUFNLHNCQUFzQixHQUFHLENBQUMsQ0FBQztJQUVqQyxJQUFNLHFCQUFxQixHQUFHLENBQUMsQ0FBQztJQUV2Qzs7O0lBR0c7SUFDRyxTQUFVLHNDQUFzQyxDQUFFLGVBQXlCLEVBQUE7UUFDL0UsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7SUFFL0IsSUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMvQyxRQUFBLElBQU0sY0FBYyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUxQyxRQUFBLFFBQVEsY0FBYztJQUNwQixZQUFBLEtBQUssb0JBQW9CO0lBQ3ZCLGdCQUFBLG1CQUFtQixDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO29CQUNsRCxNQUFNO0lBQ1IsWUFBQSxLQUFLLG1CQUFtQjtJQUN0QixnQkFBQSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztvQkFDakQsTUFBTTtJQUNSLFlBQUEsS0FBSyxrQkFBa0I7SUFDckIsZ0JBQUEsbUJBQW1CLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7b0JBQ2hELE1BQU07SUFHVCxTQUFBO0lBQ0YsS0FBQTtJQUVELElBQUEsT0FBTyxtQkFBbUIsQ0FBQztJQUM3Qjs7SUNoQ08sSUFBTSxZQUFZLEdBQUcsVUFBVSxhQUE2QixFQUFBO0lBQ2pFLElBQUEsT0FBTyxhQUFhLENBQUMsWUFBWSxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixLQUFLLGFBQWEsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUM7SUFDaEksQ0FBQzs7SUNERDs7SUFFRztJQUNJLElBQU0sdUJBQXVCLEdBQUcsVUFBUyxhQUE2QixFQUFBOztRQUMzRSxJQUFJO1lBQ0YsSUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBc0IsQ0FBQztZQUNqRixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxrQkFBa0IsQ0FBQyxFQUFFO2dCQUMxRyxhQUFhLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDNUQsWUFBQSxJQUFNLG1CQUFtQixHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQzs7SUFHeEQsWUFBQSxJQUFJLE1BQUEsYUFBYSxDQUFDLG1CQUFtQixNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFFLFVBQVUsRUFBRTtJQUNqRCxnQkFBQSxJQUNFLENBQUMsbUJBQW1CO3lCQUNYLE9BQU8sYUFBYSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsS0FBSyxXQUFXLENBQUM7eUJBQ3BFLE9BQU8sYUFBYSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxPQUFPLEtBQUssV0FBVyxDQUFDLEVBQ3JGO0lBQ0Esb0JBQUEsYUFBYSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDMUQsaUJBQUE7SUFDRixhQUFBOztJQUdELFlBQUEsSUFBSSxNQUFBLGFBQWEsQ0FBQyxtQkFBbUIsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxnQkFBZ0IsRUFBRTtJQUN2RCxnQkFBQSxJQUNFLE9BQU8sYUFBYSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixLQUFLLFFBQVE7d0JBQ3BFLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUNqRTtJQUNBLG9CQUFBLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUM7SUFDaEUsaUJBQUE7SUFDRixhQUFBOztJQUdELFlBQUEsSUFBSSxNQUFBLGFBQWEsQ0FBQyxtQkFBbUIsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxtQkFBbUIsRUFBRTtJQUMxRCxnQkFBQSxJQUNFLE9BQU8sYUFBYSxDQUFDLG1CQUFtQixDQUFDLG1CQUFtQixLQUFLLFFBQVE7O3dCQUV6RSxhQUFhLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLENBQUMsTUFBTSxLQUFLLENBQUMsRUFDbEU7SUFDQSxvQkFBQSxhQUFhLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLEdBQUcsU0FBUyxDQUFDO0lBQ25FLGlCQUFBO0lBQ0YsYUFBQTtJQUNGLFNBQUE7SUFDRixLQUFBO0lBQUMsSUFBQSxPQUFPLENBQUMsRUFBRTtJQUNWLFFBQUEsYUFBYSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztJQUN6QyxRQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMseUZBQXlGLENBQUMsQ0FBQztJQUN4RyxLQUFBO0lBQ0gsQ0FBQzs7SUNqREQ7SUFFQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsSUFBTSxhQUFhLEdBQUcsMEJBQTBCLENBQUM7SUFFMUMsSUFBTSxhQUFhLEdBQUcsVUFBVSxLQUFnQyxFQUFBO0lBQ3JFLElBQUEsSUFBSSxDQUFDLEtBQUs7SUFBRSxRQUFBLE9BQU8sRUFBRSxDQUFDO0lBQ3RCLElBQUEsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUFFLFFBQUEsT0FBTyxLQUFLLENBQUM7SUFDNUMsSUFBQSxPQUFPLENBQUMsSUFBSSxDQUFDLDJFQUEyRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pHLElBQUEsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDLENBQUM7SUFnQkY7Ozs7Ozs7OztJQVNHO0lBQ0ksSUFBTSxVQUFVLEdBQUcsVUFDeEIsT0FBNkMsRUFDN0MsS0FBeUIsRUFBQTtJQUV6QixJQUFBLElBQUksQ0FBQyxLQUFLO1lBQUUsT0FBTztJQUNsQixJQUFBLE9BQWtELENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNsRSxJQUFBLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7O0lDL0NEO0lBT0EsU0FBUyw4QkFBOEIsQ0FBRSxRQUFrQixFQUFBO1FBQ3pELE9BQU8sT0FBTyxhQUFhLEtBQUssV0FBVztJQUN6QyxRQUFBLE9BQVEsYUFBYSxDQUFDLFNBQXVDLENBQUMsV0FBVyxLQUFLLFVBQVU7WUFDeEYsb0JBQW9CLElBQUksUUFBUSxDQUFDO0lBQ3JDLENBQUM7SUFFSyxTQUFVLHVCQUF1QixDQUFFLFFBQWtCLEVBQUUsR0FBVyxFQUFFLFVBQWtCLEVBQUUsS0FBYyxFQUFBO0lBQzFHLElBQUEsSUFBSSw4QkFBOEIsQ0FBQyxRQUFRLENBQUMsRUFBRTtJQUM1QyxRQUFBLElBQU0sS0FBSyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7SUFDakMsUUFBQSxLQUE0RCxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvRSxJQUFNLEdBQUcsR0FBRyxRQUE4RCxDQUFDO1lBQzNFLEdBQUcsQ0FBQyxrQkFBa0IsR0FBRyxHQUFHLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlELE9BQU87SUFDUixLQUFBO0lBRUQsSUFBQSxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RSxJQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JELElBQUEsVUFBVSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoQyxJQUFBLFlBQVksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlDLElBQUEsWUFBWSxDQUFDLEVBQUUsR0FBRyxVQUFVLENBQUM7UUFDN0IsWUFBWSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDdkQsSUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2pDOztJQzdCQTtJQU1PLElBQU0sbUJBQW1CLEdBQUcsNEJBQTRCLENBQUM7SUFDekQsSUFBTSxzQkFBc0IsR0FBRywrQkFBK0IsQ0FBQztJQUMvRCxJQUFNLGlCQUFpQixHQUFHLDhCQUE4QixDQUFDO0lBQ3pELElBQU0scUJBQXFCLEdBQUcsNkJBQTZCLENBQUM7SUFFbkUsSUFBTSxXQUFXLEdBQUcsS0FDakIsQ0FBQSxNQUFBLENBQUEsaUJBQWlCLDJCQUNqQixtQkFBbUIsRUFBQSx1Q0FBQSxDQUFBLENBQUEsTUFBQSxDQUduQixzQkFBc0IsRUFBQSxnRkFBQSxDQU14QixDQUFDO0lBRWMsU0FBQSxzQkFBc0IsQ0FBRSxRQUFrQixFQUFFLEtBQWMsRUFBQTtRQUN4RSx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9FOzthQ2ZnQixNQUFNLENBQUMsT0FBbUMsRUFBRSxPQUFlLEVBQUUsUUFBZ0UsRUFBQTtJQUMzSSxJQUFBLElBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNyQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztRQUV0QixJQUNFLE1BQU0sQ0FBQyxhQUFhO0lBQ3BCLFNBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEtBQUssRUFBRSxDQUFDO2FBQ3hDLE1BQU0sQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQzVHO1lBQ0EsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUNwQixLQUFBO1FBRUQsSUFBSSxPQUFPLEtBQUssVUFBVSxFQUFFO0lBQzFCLFFBQUEsSUFBSSxPQUFPLEtBQUssWUFBWSxFQUFFO0lBQzVCLFlBQUEsSUFBSSxVQUFVLEVBQUU7b0JBQ2QsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3RDLGdCQUFBLFNBQVMsSUFBSSxHQUFHLENBQUM7b0JBQ2pCLElBQUksTUFBTSxDQUFDLGFBQWEsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRTtJQUM1RCxvQkFBQSxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtJQUMxQyx3QkFBQSxTQUFTLElBQUksR0FBRyxDQUFDO0lBQ2xCLHFCQUFBO0lBQU0seUJBQUE7SUFDTCx3QkFBQSxTQUFTLElBQUksR0FBRyxDQUFDO0lBQ2xCLHFCQUFBO0lBQ0YsaUJBQUE7SUFBTSxxQkFBQTtJQUNMLG9CQUFBLElBQUksTUFBTSxDQUFDLGFBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixFQUFFO0lBQ2hHLHdCQUFBLFNBQVMsSUFBSSxHQUFHLENBQUM7SUFDbEIscUJBQUE7SUFBTSx5QkFBQTtJQUNMLHdCQUFBLFNBQVMsSUFBSSxHQUFHLENBQUM7SUFDbEIscUJBQUE7SUFDRixpQkFBQTtJQUNELGdCQUFBLFNBQVMsSUFBSSxHQUFHLENBQUM7SUFFakIsZ0JBQUEsT0FBTyxHQUFHO0lBQ1Isb0JBQUEsT0FBTyxFQUFFLFVBQVU7SUFDbkIsb0JBQUEsU0FBUyxFQUFBLFNBQUE7cUJBQ1YsQ0FBQztJQUNILGFBQUE7SUFBTSxpQkFBQTtJQUNMLGdCQUFBLE9BQU8sR0FBRztJQUNSLG9CQUFBLE9BQU8sRUFBRSxVQUFVO3dCQUNuQixTQUFTLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxHQUFHLEtBQUs7cUJBQ3pDLENBQUM7SUFDSCxhQUFBO0lBQ0YsU0FBQTtJQUFNLGFBQUE7Z0JBQ0wsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUNuQixTQUFBO0lBQ0YsS0FBQTtJQUFNLFNBQUE7WUFDTCxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ25CLEtBQUE7SUFFRCxJQUFBLElBQUksUUFBUSxFQUFFO0lBQ1osUUFBQSxRQUFRLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzlCLEtBQUE7SUFDSCxDQUFDO2FBRWUscUJBQXFCLEdBQUE7SUFDbkMsSUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUU7WUFDbEMsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO0lBQ2pCLFlBQUEsc0JBQXNCLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxhQUFhLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDckYsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUVoRCxZQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDMUMsWUFBQSxNQUFNLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO0lBQ2hDLFlBQUEsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDckIsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBQzVDLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0QyxZQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLFNBQUE7SUFBTSxhQUFBOztJQUVMLFlBQUEsVUFBVSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3QyxTQUFBO0lBQ0YsS0FBQTtJQUNILENBQUM7SUFFSyxTQUFVLG1CQUFtQixDQUFFLEtBQW1CLEVBQUE7SUFDdEQsSUFBQSxJQUFNLElBQUksR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztJQUM1RCxJQUFBLElBQUksSUFBSSxFQUFFO0lBQ1IsUUFBQSxJQUFJLE9BQU8sTUFBTSxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7SUFDekMsWUFBQSxNQUFNLENBQUMsUUFBUSxDQUNiLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLE9BQU8sRUFDWixVQUFVLFdBQTJCLEVBQUUsT0FBZ0IsRUFBQTtJQUNyRCxnQkFBQSxJQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBZ0IsQ0FBQztJQUMzQyxnQkFBQSxXQUFXLGFBQVgsV0FBVyxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFYLFdBQVcsQ0FBRSxXQUFXLENBQUM7SUFDdkIsb0JBQUEsY0FBYyxFQUFFO0lBQ2Qsd0JBQUEsV0FBVyxFQUFBLFdBQUE7SUFDWCx3QkFBQSxPQUFPLEVBQUEsT0FBQTs0QkFDUCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07SUFDcEIscUJBQUE7cUJBQ0YsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNWLGFBQUMsQ0FDRixDQUFDO0lBQ0gsU0FBQTtJQUNGLEtBQUE7SUFDSDs7SUMzR0E7SUFDQTtBQUNBO0lBQ0E7SUFDQTtBQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtBQWlCQTtJQUNPLElBQUksUUFBUSxHQUFHLFdBQVc7SUFDakMsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxTQUFTLFFBQVEsQ0FBQyxDQUFDLEVBQUU7SUFDckQsUUFBUSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUM3RCxZQUFZLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0IsWUFBWSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RixTQUFTO0lBQ1QsUUFBUSxPQUFPLENBQUMsQ0FBQztJQUNqQixNQUFLO0lBQ0wsSUFBSSxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNDOztJQ3hDQTtJQUNBO0FBQ0EsaUJBQWU7SUFDWCxJQUFBLFdBQVcsRUFBRSxZQUFBOztZQUdYLElBQU0sQ0FBQyxHQUFHLFVBQUMsQ0FBQyxFQUFBO0lBQ1IsWUFBQSxPQUFBLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O29CQUUvRCxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLENBQUMsRUFBQTt3QkFDbkIsSUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMxQixvQkFBQSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQztJQUM1QixpQkFBQyxDQUFDLENBQUE7YUFBQTs7SUFFSixRQUFBLENBQUMsR0FBRyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBQSxFQUNoQyxDQUFDLEdBQUc7SUFDRixZQUFBLFdBQVcsRUFBRSxjQUFjO0lBQzNCLFlBQUEsYUFBYSxFQUFFLE9BQU87SUFDdEIsWUFBQSxXQUFXLEVBQUUsR0FBRztJQUNoQixZQUFBLGdCQUFnQixFQUFFLFFBQVE7SUFDMUIsWUFBQSxvQkFBb0IsRUFBRSxtQkFBbUI7Z0JBQ3pDLGNBQWMsRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtJQUN4RCxZQUFBLGVBQWUsRUFBRSxHQUFHO0lBQ3BCLFlBQUEsZUFBZSxFQUFFO29CQUNmLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRTtvQkFDdkMsbUJBQW1CLEVBQUUsRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUU7SUFDeEUsZ0JBQUEsR0FBRyxFQUFFLEVBQUU7SUFDUCxnQkFBQSxHQUFHLEVBQUUsRUFBRTtJQUNQLGdCQUFBLFNBQVMsRUFBRSxFQUFFO0lBQ2IsZ0JBQUEsT0FBTyxFQUFFLEdBQUc7SUFDYixhQUFBO0lBQ0QsWUFBQSxtQkFBbUIsRUFBRSxDQUFDO2FBQ3ZCLENBQUM7SUFDSixRQUFBLElBQUEsQ0FBQSxrQkFBQSxZQUFBO0lBQ0UsWUFBQSxTQUFBLENBQUEsR0FBQTs7SUFFRSxnQkFBQSxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUM7aUJBQ3pDOztnQkFFRCxDQUFjLENBQUEsU0FBQSxDQUFBLGNBQUEsR0FBZCxVQUFlLENBQUMsRUFBQTtvQkFDZCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ1QsSUFBSTt3QkFDRixJQUFJLFFBQVEsSUFBSSxPQUFPLENBQUM7SUFBRSx3QkFBQSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2Qyx5QkFBQTtJQUNILHdCQUFBLElBQUksUUFBUSxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDO0lBQUUsNEJBQUEsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDOzRCQUMzRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1AscUJBQUE7SUFDRCxvQkFBQSxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVHLGlCQUFBO0lBQUMsZ0JBQUEsT0FBTyxDQUFDLEVBQUU7O0lBRVYsb0JBQUEsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUM7SUFDbkUsaUJBQUE7aUJBQ0YsQ0FBQTs7Z0JBRUQsQ0FBYSxDQUFBLFNBQUEsQ0FBQSxhQUFBLEdBQWIsVUFBYyxDQUFDLEVBQUE7O29CQUNiLElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDWixJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLEtBQUssUUFBUSxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUMzRSxvQkFBQSxNQUFNLElBQUksS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7b0JBQzVELElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMvRSxvQkFBQSxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7b0JBQ3hDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLENBQUMsV0FBVyxJQUFJLENBQUMsTUFBSyxDQUFBLEVBQUEsR0FBQSxDQUFDLENBQUMsV0FBVyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFFLE1BQU0sQ0FBQSxDQUFDO0lBQy9GLG9CQUFBLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztJQUNuRSxnQkFBQSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLElBQUksU0FBUyxJQUFJLE9BQU8sQ0FBQyxDQUFDLGVBQWU7SUFDdkUsb0JBQUEsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0lBQ3ZELGdCQUFBLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLGNBQWMsSUFBSSxTQUFTLElBQUksT0FBTyxDQUFDLENBQUMsY0FBYztJQUNyRSxvQkFBQSxNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7SUFDdEQsZ0JBQUEsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHO0lBQUUsb0JBQUEsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzFGLGdCQUFBLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxRQUFRLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRztJQUFFLG9CQUFBLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztvQkFDMUYsSUFBSSxDQUFDLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFBRSxvQkFBQSxNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7aUJBQzFFLENBQUE7O2dCQUVELENBQVksQ0FBQSxTQUFBLENBQUEsWUFBQSxHQUFaLFVBQWEsQ0FBQyxFQUFBO0lBQ1osZ0JBQUEsUUFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUNyQixvQkFBQTtJQUNFLHdCQUFBLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFO0lBQzNELHdCQUFBLG1CQUFtQixFQUFFO0lBQ25CLDRCQUFBLGFBQWEsRUFBRSxDQUFDLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTTtJQUNyRiw0QkFBQSxZQUFZLEVBQUUsQ0FBQyxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU07SUFDcEYseUJBQUE7NEJBQ0QsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHOzRCQUNWLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRzs0QkFDVixTQUFTLEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTs7SUFFbEQsd0JBQUEsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsY0FBYztJQUNoRSxxQkFBQSxFQUNEO2lCQUNILENBQUE7O2dCQUVELENBQXNCLENBQUEsU0FBQSxDQUFBLHNCQUFBLEdBQXRCLFVBQXVCLENBQUMsRUFBQTtJQUN0QixnQkFBQSxRQUNFLFFBQVEsSUFBSSxPQUFPLENBQUM7SUFDcEIsb0JBQUEsSUFBSSxLQUFLLENBQUM7SUFDVixvQkFBQSxLQUFLLElBQUksQ0FBQztJQUNWLG9CQUFBLHFCQUFxQixJQUFJLENBQUM7SUFDMUIsb0JBQUEsS0FBSyxJQUFJLENBQUM7SUFDVixvQkFBQSxLQUFLLElBQUksQ0FBQztJQUNWLG9CQUFBLFdBQVcsSUFBSSxDQUFDO3dCQUNoQixTQUFTLElBQUksQ0FBQyxFQUNkO2lCQUNILENBQUE7O2dCQUVELENBQXVCLENBQUEsU0FBQSxDQUFBLHVCQUFBLEdBQXZCLFVBQXdCLENBQUMsRUFBQTs7b0JBQ3ZCLElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDWixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7SUFBRSxvQkFBQSxNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7b0JBQzVHLElBQUksS0FBSyxDQUFDLE1BQUssQ0FBQSxFQUFBLEdBQUEsQ0FBQyxDQUFDLEdBQUcsMENBQUUsU0FBUyxDQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQSxFQUFBLEdBQUEsQ0FBQyxDQUFDLEdBQUcsTUFBQSxJQUFBLElBQUEsRUFBQSxLQUFBLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLEVBQUEsQ0FBRSxTQUFTLENBQUM7SUFDckQsb0JBQUEsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0lBQzVELGdCQUFBLElBQUksQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFDLENBQUMsR0FBRyxNQUFBLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFFLFdBQVcsS0FBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLG1CQUFtQjtJQUMxRSxvQkFBQSxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7SUFDOUQsZ0JBQUEsSUFDRSxDQUFBLENBQUEsRUFBQSxHQUFBLENBQUMsQ0FBQyxtQkFBbUIsMENBQUUsYUFBYTt3QkFDcEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUM7SUFFbEcsb0JBQUEsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO0lBQ3JFLGdCQUFBLElBQ0UsQ0FBQSxDQUFBLEVBQUEsR0FBQSxDQUFDLENBQUMsbUJBQW1CLDBDQUFFLFlBQVk7d0JBQ25DLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDO0lBRWpHLG9CQUFBLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQztJQUNwRSxnQkFBQSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksUUFBUSxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUc7SUFBRSxvQkFBQSxNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7SUFDckcsZ0JBQUEsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHO0lBQUUsb0JBQUEsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQ3JHLGdCQUFBLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUFFLG9CQUFBLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztJQUM5RSxnQkFBQSxJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDLGVBQWU7SUFBRSxvQkFBQSxNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7aUJBQzdGLENBQUE7Z0JBQ0gsT0FBQyxDQUFBLENBQUE7SUFBRCxTQUFDLEVBQUEsQ0FBQSxDQUFBO0lBQ0QsUUFBQSxJQUFBLENBQUEsa0JBQUEsWUFBQTtJQUNFLFlBQUEsU0FBQSxDQUFBLEdBQUE7O0lBRUUsZ0JBQUEsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxXQUFXOztJQUU5QixxQkFBQyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxhQUFhOztJQUVqQyxxQkFBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsbUJBQW1COzt5QkFFOUMsSUFBSSxDQUFDLGNBQWMsR0FBQSxRQUFBLENBQUEsRUFBQSxFQUFRLENBQUMsQ0FBQyxlQUFlLENBQUUsQ0FBQyxDQUFDO2lCQUNwRDs7Z0JBRUQsQ0FBb0IsQ0FBQSxTQUFBLENBQUEsb0JBQUEsR0FBcEIsVUFBcUIsQ0FBQyxFQUFBO0lBQ3BCLGdCQUFBLElBQU0sQ0FBQyxHQUFHLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDOUUsZ0JBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDekIsQ0FBQTs7Z0JBRUQsQ0FBZ0IsQ0FBQSxTQUFBLENBQUEsZ0JBQUEsR0FBaEIsVUFBaUIsQ0FBQyxFQUFBO0lBQ2hCLGdCQUFBLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQ3pCLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDOztvQkFFakIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzs7eUJBRXBDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsRUFBQSxDQUFBLE1BQUEsQ0FBRyxJQUFJLENBQUMsVUFBVSxFQUFBLEdBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBSSxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsRUFBYSxZQUFBLENBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFBLFNBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBVSxDQUFDLENBQUMsV0FBVyxFQUFBLGFBQUEsQ0FBQSxDQUFBLE1BQUEsQ0FBYyxDQUFDLENBQUMsZ0JBQWdCLEVBQUEsVUFBQSxDQUFVO0lBQzNKLG9CQUFBLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDaEMsQ0FBQTs7Z0JBRUQsQ0FBb0IsQ0FBQSxTQUFBLENBQUEsb0JBQUEsR0FBcEIsVUFBcUIsQ0FBQyxFQUFBO0lBQ3BCLGdCQUFBLE9BQU8sQ0FBQyxJQUFJLFFBQVEsSUFBSSxPQUFPLENBQUMsSUFBSSxxQkFBcUIsSUFBSSxDQUFDLElBQUksU0FBUyxJQUFJLENBQUMsSUFBSSxXQUFXLElBQUksQ0FBQyxDQUFDO2lCQUN0RyxDQUFBO0lBQ0QsWUFBQSxDQUFBLENBQUEsU0FBQSxDQUFBLGdCQUFnQixHQUFoQixZQUFBO29CQUFBLElBV0MsS0FBQSxHQUFBLElBQUEsQ0FBQTs7SUFUQyxnQkFBQSxJQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUssRUFBQSxPQUFBLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRyxDQUFBLE1BQUEsQ0FBQSxLQUFJLENBQUMsVUFBVSxFQUFHLEdBQUEsQ0FBQSxDQUFDLENBQW5DLEVBQW1DLENBQUMsQ0FBQztJQUN2RixnQkFBQSxJQUFJLENBQUMsQ0FBQztJQUFFLG9CQUFBLE9BQU8sSUFBSSxDQUFDO29CQUNwQixJQUFJO3dCQUNGLElBQU0sR0FBQyxHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDM0MsR0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBQyxDQUFDLENBQUM7SUFDcEIsb0JBQUEsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBQyxDQUFDLEdBQUcsR0FBQyxHQUFHLElBQUksQ0FBQztJQUNoRCxpQkFBQTtJQUFDLGdCQUFBLE9BQU8sQ0FBQyxFQUFFO3dCQUNWLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUM7SUFDaEUsaUJBQUE7aUJBQ0YsQ0FBQTtJQUNELFlBQUEsQ0FBQSxDQUFBLFNBQUEsQ0FBQSxpQkFBaUIsR0FBakIsWUFBQTs7SUFFRSxnQkFBQSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2lCQUM1QyxDQUFBO0lBQ0QsWUFBQSxDQUFBLENBQUEsU0FBQSxDQUFBLGtCQUFrQixHQUFsQixZQUFBOztvQkFFRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsVUFBRyxJQUFJLENBQUMsVUFBVSxFQUFBLG1EQUFBLENBQW1EO0lBQ3RGLG9CQUFBLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDbkMsQ0FBQTtnQkFDSCxPQUFDLENBQUEsQ0FBQTtJQUFELFNBQUMsRUFBQSxDQUFBLENBQUE7SUFDRCxRQUFBLElBQUEsQ0FBQSxrQkFBQSxZQUFBO0lBQ0UsWUFBQSxTQUFBLENBQUEsR0FBQTs7SUFFRSxnQkFBQSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztpQkFDaEI7O2dCQUVELENBQVksQ0FBQSxTQUFBLENBQUEsWUFBQSxHQUFaLFVBQWEsQ0FBQyxFQUFBO29CQUNaLElBQUksUUFBUSxJQUFJLE9BQU8sQ0FBQztJQUFFLG9CQUFBLE1BQU0sSUFBSSxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUM3RSxnQkFBQSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUFFLG9CQUFBLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7b0JBRWpELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lCQUN4QyxDQUFBOztnQkFFRCxDQUFjLENBQUEsU0FBQSxDQUFBLGNBQUEsR0FBZCxVQUFlLENBQUMsRUFBQTtvQkFDZCxJQUFJLFFBQVEsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU07SUFBRSxvQkFBQSxNQUFNLElBQUksU0FBUyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7O29CQUUxRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDMUMsQ0FBQTs7Z0JBRUQsQ0FBa0IsQ0FBQSxTQUFBLENBQUEsa0JBQUEsR0FBbEIsVUFBbUIsQ0FBQyxFQUFBO29CQUNsQixJQUFJLFNBQVMsSUFBSSxPQUFPLENBQUM7SUFBRSxvQkFBQSxNQUFNLElBQUksU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7O29CQUVwRixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDOUMsQ0FBQTs7Z0JBRUQsQ0FBaUIsQ0FBQSxTQUFBLENBQUEsaUJBQUEsR0FBakIsVUFBa0IsQ0FBQyxFQUFBO29CQUNqQixJQUFJLFNBQVMsSUFBSSxPQUFPLENBQUM7SUFBRSxvQkFBQSxNQUFNLElBQUksU0FBUyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7O29CQUVuRixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDN0MsQ0FBQTs7Z0JBRUQsQ0FBTSxDQUFBLFNBQUEsQ0FBQSxNQUFBLEdBQU4sVUFBTyxDQUFDLEVBQUE7b0JBQ04sSUFBSSxRQUFRLElBQUksT0FBTyxDQUFDO0lBQUUsb0JBQUEsTUFBTSxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztvQkFFdEUsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7aUJBQ2xDLENBQUE7O2dCQUVELENBQU0sQ0FBQSxTQUFBLENBQUEsTUFBQSxHQUFOLFVBQU8sQ0FBQyxFQUFBO29CQUNOLElBQUksUUFBUSxJQUFJLE9BQU8sQ0FBQztJQUFFLG9CQUFBLE1BQU0sSUFBSSxTQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7b0JBRXRFLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lCQUNsQyxDQUFBOztnQkFFRCxDQUFVLENBQUEsU0FBQSxDQUFBLFVBQUEsR0FBVixVQUFXLENBQUMsRUFBQTtJQUNWLGdCQUFBLElBQUksUUFBUSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQUUsb0JBQUEsTUFBTSxJQUFJLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDOztvQkFFekYsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7aUJBQ3RDLENBQUE7O2dCQUVELENBQVksQ0FBQSxTQUFBLENBQUEsWUFBQSxHQUFaLFVBQWEsQ0FBQyxFQUFBO0lBQ1osZ0JBQUEsSUFBSSxRQUFRLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFBRSxvQkFBQSxNQUFNLElBQUksU0FBUyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7O29CQUUvRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDeEMsQ0FBQTtJQUNELFlBQUEsQ0FBQSxDQUFBLFNBQUEsQ0FBQSxLQUFLLEdBQUwsWUFBQTtvQkFDRSxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUNmLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRTs7b0JBRVgsQ0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUN0QyxDQUFBO2dCQUNILE9BQUMsQ0FBQSxDQUFBO0lBQUQsU0FBQyxFQUFBLENBQUEsQ0FBQTtZQUNELE9BQU8sTUFBTSxHQUFHLEdBQUc7Z0JBQ2pCLENBQUMsWUFBQTtvQkFDQyxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUNmLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2QsZ0JBQUEsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDLGlCQUFpQixFQUFFOzt5QkFFMUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxZQUFBOzRCQUFVLElBQUksQ0FBQSxHQUFBLEVBQUEsQ0FBQTtpQ0FBSixJQUFJLEVBQUEsR0FBQSxDQUFBLEVBQUosRUFBSSxHQUFBLFNBQUEsQ0FBQSxNQUFBLEVBQUosRUFBSSxFQUFBLEVBQUE7Z0NBQUosQ0FBSSxDQUFBLEVBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTs7SUFDbEMsd0JBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU07Z0NBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDOzRCQUNuQyxJQUFJO2dDQUNGLElBQU0sR0FBQyxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ2pDLE9BQU8sR0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFDLENBQUMsRUFBRSxHQUFDLENBQUM7SUFDdEMseUJBQUE7SUFBQyx3QkFBQSxPQUFPLENBQUMsRUFBRTs7SUFFViw0QkFBQSxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQztJQUNoRSx5QkFBQTtJQUNILHFCQUFDLENBQUMsQ0FBQztpQkFDTixHQUFHLENBQUM7U0FDUjtLQUNGOzthQzlQYSxNQUFNLEdBQUE7UUFDcEIsSUFBSTtZQUNGLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN0QixLQUFBO0lBQUMsSUFBQSxPQUFPLENBQUMsRUFBRTtJQUNWLFFBQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO0lBQ2pFLEtBQUE7SUFDSCxDQUFDO0lBRUssU0FBVSxRQUFRLENBQUMsYUFBNkIsRUFBQTtRQUNwRCxJQUFJO1lBQ0YsTUFBTTs7SUFFSCxhQUFBLFdBQVcsRUFBRTtJQUNiLGFBQUEsY0FBYyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7SUFDekMsYUFBQSxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztJQUNuRCxhQUFBLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0lBQ2xELGFBQUEsS0FBSyxFQUFFLENBQUM7SUFDWixLQUFBO0lBQUMsSUFBQSxPQUFPLENBQUMsRUFBRTtJQUNWLFFBQUEsT0FBTyxDQUFDLElBQUksQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO0lBQzFELEtBQUE7SUFDSDs7SUN2QkE7O0lBRUc7SUFDSCxTQUFTLFNBQVMsQ0FBRSxJQUFpQixFQUFBOztJQUVuQyxJQUFBLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLGtCQUFrQixFQUFFO0lBQ2pGLFFBQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7SUFDeEQsS0FBQTtJQUVELElBQUEsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdkMsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBRWpCLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUc7Z0JBQ3pDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsWUFBQSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO0lBQ3pCLGdCQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFDLGFBQUE7SUFDRixTQUFBO1lBRUQsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2IsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBRXBCLFFBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzFELElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFnQixDQUFDO0lBQ3BELFlBQUEsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLE1BQU0sS0FBSyxFQUFFLEVBQUU7SUFDakIsZ0JBQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QixhQUFBO0lBQ0YsU0FBQTtJQUVELFFBQUEsT0FBTyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZHLEtBQUE7SUFDRCxJQUFBLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVEOztJQUVHO0lBQ0csU0FBVSxPQUFPLENBQUUsRUFBZSxFQUFBO0lBQ3RDLElBQUEsSUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDbEIsSUFBQSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBRW5CLE9BQU8sQ0FBQyxFQUFFLEVBQUU7WUFDVixJQUFNLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CLEtBQUssR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDO1lBQzVCLEtBQUssR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDO0lBQzdCLEtBQUE7SUFFRCxJQUFBLElBQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2xELElBQUEsT0FBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekI7O0lDbERnQixTQUFBLDZCQUE2QixDQUFFLGFBQTZCLEVBQUUsSUFBaUIsRUFBQTtRQUM3RixJQUFNLGdCQUFnQixHQUFHLGFBQWEsQ0FBQyxtQkFBbUIsSUFBSSxhQUFhLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUM7UUFDakgsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBRXRCLElBQUksSUFBSSxDQUFDLEVBQUUsSUFBSSxnQkFBZ0IsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQzlELFFBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNoRCxZQUFBLElBQU0sR0FBRyxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLFlBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsTUFBTSxFQUFFO29CQUN0QyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUNqQixNQUFNO0lBQ1AsYUFBQTtJQUNGLFNBQUE7SUFDRixLQUFBO0lBRUQsSUFBQSxPQUFPLFNBQVMsQ0FBQztJQUNuQjs7SUNkQTs7OztJQUlHO2FBQ2Esb0JBQW9CLENBQUMsTUFBYyxFQUFFLFFBQWtCLEVBQUUsYUFBNkIsRUFBQTtRQUNwRyxJQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7SUFHcEQsSUFBQSxJQUFNLGFBQWEsR0FBRyxZQUFBOztZQUFVLElBQWMsSUFBQSxHQUFBLEVBQUEsQ0FBQTtpQkFBZCxJQUFjLEVBQUEsR0FBQSxDQUFBLEVBQWQsRUFBYyxHQUFBLFNBQUEsQ0FBQSxNQUFBLEVBQWQsRUFBYyxFQUFBLEVBQUE7Z0JBQWQsSUFBYyxDQUFBLEVBQUEsQ0FBQSxHQUFBLFNBQUEsQ0FBQSxFQUFBLENBQUEsQ0FBQTs7O0lBRTVDLFFBQUEsSUFBSSxDQUFBLENBQUEsRUFBQSxHQUFBLENBQUEsRUFBQSxHQUFBLFFBQVEsQ0FBQyxhQUFhLE1BQUUsSUFBQSxJQUFBLEVBQUEsS0FBQSxLQUFBLENBQUEsR0FBQSxLQUFBLENBQUEsR0FBQSxFQUFBLENBQUEsT0FBTyxNQUFFLElBQUEsSUFBQSxFQUFBLEtBQUEsS0FBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLEdBQUEsRUFBQSxDQUFBLHVCQUF1QixNQUFLLE1BQU0sRUFBRTtnQkFDdkUsT0FBTyxhQUFhLENBQUksS0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFBLElBQUksQ0FBRSxDQUFBO0lBQy9CLFNBQUE7SUFFRCxRQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ1osT0FBTztJQUNSLFNBQUE7SUFFRCxRQUFBLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyQixRQUFBLElBQUksU0FBUyxDQUFDO1lBRWQsSUFBSSxRQUFRLENBQUMsSUFBSSxFQUFFO2dCQUNqQixRQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwRCxZQUFBLFNBQVMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQThCLENBQUM7SUFDMUQsU0FBQTtJQUFNLGFBQUE7Z0JBQ0wsUUFBUSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEQsWUFBQSxTQUFTLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUE4QixDQUFDO0lBQzFELFNBQUE7O0lBR0QsUUFBQSxJQUNFLFNBQVM7SUFDVCxZQUFBLFNBQVMsQ0FBQyxPQUFPO0lBQ2pCLGFBQUMsU0FBUyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUM7SUFDaEMsYUFBQyxPQUFPLFNBQVMsQ0FBQyxxQkFBcUIsS0FBSyxXQUFXLENBQUM7SUFDeEQsYUFBQyxPQUFPLFNBQVMsQ0FBQyxVQUFVLEtBQUssV0FBVyxDQUFDO0lBQzdDLGFBQUMsT0FBTyxTQUFTLENBQUMsZ0JBQWdCLEtBQUssV0FBVyxDQUFDO0lBQ25ELGFBQUMsT0FBTyxTQUFTLENBQUMsZ0JBQWdCLEtBQUssV0FBVyxDQUFDLEVBQ25EO0lBQ0EsWUFBQSxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO2dCQUNqQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUMxQyxTQUFBO0lBQ0gsS0FBQyxDQUFDO0lBRUYsSUFBQSxRQUFRLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQzs7UUFHL0IsYUFBYSxDQUFDLHNCQUFzQixFQUFFLENBQUM7O1FBR3ZDLElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQzdCLElBQUEsSUFBSSxDQUFDLE9BQU8sZ0JBQWdCLEtBQUssVUFBVSxNQUFNLE9BQU8sZ0JBQWdCLEtBQUssUUFBUSxDQUFDLEVBQUU7WUFDdEYsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0lBQzNCLEtBQUE7SUFFRCxJQUFBLElBQUksaUJBQWlCLEVBQUU7O1lBRXJCLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsRUFBRTtnQkFDdkQsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0lBQzNCLFNBQUE7SUFDRixLQUFBOztJQUdELElBQUEsSUFBSSxRQUFRLElBQUksUUFBUSxDQUFDLGVBQWUsRUFBRTtZQUN4QyxJQUFJLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNuRCxhQUFhLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hGLFlBQUEsUUFBUSxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEQsU0FBQTtJQUVELFFBQUEsSUFBSSxRQUFRLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRTtJQUN2QyxZQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDbkUsZ0JBQUEsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUM3RCxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7b0JBQ25CLElBQUksUUFBUSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFO3dCQUNoRCxTQUFTLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQzFELGlCQUFBO0lBQ0QsZ0JBQUEsYUFBYSxDQUFDLDZCQUE2QixDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDeEYsYUFBQTtJQUNGLFNBQUE7SUFDRixLQUFBO0lBRUQsSUFBQSxJQUFJLGlCQUFpQixFQUFFO1lBQ3JCLGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUNyRixRQUFBLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7O1lBRXJHLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQ3ZDLEtBQUE7SUFBTSxTQUFBOztJQUVMLFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQ0FBb0MsRUFBRTtJQUNoRCxZQUFBLE1BQU0sQ0FBQyxvQ0FBb0MsR0FBRyxJQUFJLENBQUM7Z0JBRW5ELGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQ3ZDLFNBQUE7SUFDRixLQUFBO0lBQ0gsQ0FBQztJQUVEOzs7SUFHRztJQUNhLFNBQUEsb0JBQW9CLENBQUMsTUFBYyxFQUFFLGFBQTZCLEVBQUE7SUFDaEYsSUFBQSxJQUFJLGFBQWEsQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLEVBQUU7SUFDMUMsUUFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFDakQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUU3RSxRQUFBLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUM1QyxRQUFBLGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7SUFDdkMsS0FBQTtJQUNILENBQUM7SUFFRDs7OztJQUlHO2FBQ2EsZUFBZSxDQUFDLE1BQWMsRUFBRSxRQUFrQixFQUFFLGFBQStCLEVBQUE7UUFDakcsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFFO0lBQ3hCLFFBQUEsSUFBSSxrQkFBa0IsR0FBRyxJQUFJLENBQUM7SUFFOUIsUUFBQSxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtnQkFDN0Msa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0lBQzNCLFlBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0lBQ2xELFNBQUE7SUFFRCxRQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzdDLFlBQUEsSUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLFlBQUEsSUFBSSxjQUFjLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtJQUN2QyxnQkFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ3pELElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFvQyxDQUFDO3dCQUU3RSxJQUFNLGFBQWEsR0FBRyw2QkFBNkIsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDOztJQUdoRixvQkFBQSxJQUNFLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQztJQUNuQix3QkFBQSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUM7SUFDeEMseUJBQUMsT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLFdBQVcsQ0FBQztJQUN4Qyx5QkFBQyxPQUFPLElBQUksQ0FBQyxxQkFBcUIsS0FBSyxXQUFXLENBQUM7SUFDbkQsd0JBQUEsQ0FBQyxhQUFhLEVBQ2Q7O0lBRUEsd0JBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsMEJBQTBCLElBQUksSUFBSSxNQUFNLElBQUksQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLEVBQUU7SUFDNUYsNEJBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsR0FBRyxJQUF5QixDQUFDO2dDQUM1RSxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEQsNEJBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDdkMsZ0NBQUEsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLGdDQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLEVBQUU7d0NBQ3JELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsRUFBRTtJQUN4RCx3Q0FBQSxPQUFPLENBQUMsSUFBSSxDQUFDLHdGQUF3RixFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3ZILHFDQUFBO3dDQUNELE1BQU07SUFDUCxpQ0FBQTtJQUNGLDZCQUFBO0lBQ0YseUJBQUE7NEJBRUQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUUzRCxJQUFJLGtCQUFrQixLQUFLLElBQUksQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLEVBQUU7SUFDckQsNEJBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3Qyx5QkFBQTtJQUFNLDZCQUFBO2dDQUNMLE1BQU0sQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuRCx5QkFBQTtJQUNGLHFCQUFBO0lBQ0YsaUJBQUE7SUFDRixhQUFBO0lBQ0YsU0FBQTtJQUNGLEtBQUE7SUFDSDs7SUN6S0E7Ozs7SUFJRzthQUNhLGFBQWEsQ0FBRSxNQUFjLEVBQUUsYUFBNkIsRUFBRSxZQUFpQyxFQUFBO0lBQzdHLElBQUEsSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUMzQixRQUFBLElBQU0sVUFBVSxHQUFHLFlBQVksQ0FBQyxLQUFLLEVBQXVCLENBQUM7SUFDN0QsUUFBQSxVQUFVLENBQUMsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDO1lBQ3hDLElBQUksZ0JBQWdCLEdBQUcsRUFBYyxDQUFDO0lBRXRDLFFBQUEsSUFBSSxVQUFVLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLEVBQUU7O0lBRWpELFlBQUEsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzRixTQUFBO1lBRUQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBRXRCLFFBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDaEQsSUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9FLFlBQUEsSUFBSSxDQUFDLFVBQVUsS0FBSyxhQUFhLE1BQU0sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRTtvQkFDakYsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUNwQixhQUFBO0lBQ0QsWUFBQSxJQUFJLENBQUMsVUFBVSxLQUFLLFlBQVksTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUMvRSxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLGFBQUE7SUFDRCxZQUFBLElBQUksQ0FBQyxVQUFVLEtBQUssV0FBVyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7b0JBQzdFLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDcEIsYUFBQTtJQUNGLFNBQUE7SUFFRCxRQUFBLElBQUksVUFBVSxFQUFFO0lBQ2QsWUFBQSxJQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDO0lBQ3hDLFlBQUEsSUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDO2dCQUNsRCxJQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUMxRCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFFbkIsWUFBQSxJQUFJLFFBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ2hDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDZixhQUFBO0lBRUQsWUFBQSxJQUFNLGFBQWEsSUFBSSxNQUFNLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFdkUsSUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ2xDLGdCQUFBLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkMsYUFBQTtnQkFFRCxJQUFJLE9BQU8sVUFBVSxDQUFDLGNBQWMsS0FBSyxXQUFXLEVBQUU7SUFDcEQsZ0JBQUEsUUFBUSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDO0lBQzNDLGFBQUE7SUFFRCxZQUFBLElBQUksYUFBYSxFQUFFO29CQUNqQixRQUFRLENBQUMsTUFBTSxHQUFHLFlBQUE7SUFDaEIsb0JBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbkQsaUJBQUMsQ0FBQztvQkFDRixRQUFRLENBQUMsT0FBTyxHQUFHLFlBQUE7SUFDakIsb0JBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbkQsaUJBQUMsQ0FBQztJQUNILGFBQUE7SUFFRCxZQUFBLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRXhELElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtJQUNyQixnQkFBQSxTQUFTLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNsQyxTQUFTLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxXQUFXLElBQUksSUFBSSxDQUFDLENBQUM7SUFDdkQsYUFBQTtnQkFFRCxJQUFJLENBQUMsYUFBYSxFQUFFO0lBQ2xCLGdCQUFBLGFBQWEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDM0MsYUFBQTtJQUNGLFNBQUE7SUFBTSxhQUFBO0lBQ0wsWUFBQSxhQUFhLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzNDLFNBQUE7SUFDRixLQUFBO0lBQ0g7O0lDNUVBOzs7SUFHRztJQUNhLFNBQUEsY0FBYyxDQUFDLFFBQWtCLEVBQUUsVUFBNkIsRUFBQTs7UUFFOUUsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRXRELElBQUEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JELFFBQVEsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0RixLQUFBO1FBRUQsSUFBSSxVQUFVLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFO0lBQ3ZDLFFBQUEsUUFBUSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdkMsS0FBQTtJQUVELElBQUEsSUFBSSxPQUFPLFVBQVUsQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQzFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztJQUNqQyxLQUFBO0lBQ0QsSUFBQSxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBRWpELElBQUEsT0FBTyxRQUFRLENBQUM7SUFDbEI7O0lDcEJBOztJQUVHO0lBQ0csU0FBVSxzQkFBc0IsQ0FBQyxhQUE2QixFQUFBO0lBQ2xFLElBQUEsYUFBYSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztJQUMxQyxJQUFBLElBQUksT0FBTyxXQUFXLEtBQUssV0FBVyxFQUFFO1lBQ3RDLElBQUksT0FBTyxXQUFXLENBQUMsU0FBUyxDQUFDLG9CQUFvQixLQUFLLFdBQVcsRUFBRTtnQkFDckUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDO2dCQUVwRixXQUFXLENBQUMsU0FBUyxDQUFDLGdCQUFnQixHQUFHLFVBQVUsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUE7SUFDeEUsZ0JBQUEsSUFBSSxhQUFhLENBQUMsb0JBQW9CLElBQUksQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsRUFBRTtJQUN0RyxvQkFBQSxJQUFJLElBQUksS0FBSyxrQkFBa0IsSUFBSSxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxLQUFLLGtCQUFrQixFQUFFOzRCQUN0RyxhQUFhLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUEsSUFBQSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFBLE9BQUEsRUFBRSxDQUFDLENBQUM7SUFDdEcscUJBQUE7SUFBTSx5QkFBQTs0QkFDTCxhQUFhLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUEsSUFBQSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFBLE9BQUEsRUFBRSxDQUFDLENBQUM7NEJBQy9GLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BELHFCQUFBO0lBQ0YsaUJBQUE7SUFBTSxxQkFBQTt3QkFDTCxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNwRCxpQkFBQTtJQUNILGFBQUMsQ0FBQztJQUNILFNBQUE7SUFDRixLQUFBO0lBQ0g7O0lDdkJBOzs7SUFHRztJQUNhLFNBQUEsMEJBQTBCLENBQUMsTUFBYyxFQUFFLGFBQTZCLEVBQUE7UUFDdEYsSUFBSSxhQUFhLENBQUMsb0JBQW9CLEVBQUU7SUFDdEMsUUFBQSxVQUFVLENBQUMsWUFBQTtJQUNULFlBQUEsYUFBYSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztnQkFDM0MsYUFBYSxDQUFDLDJCQUEyQixFQUFFLENBQUM7SUFDNUMsWUFBQSxJQUFJLGFBQWEsQ0FBQyxlQUFlLEtBQUssRUFBRSxJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7SUFDdEYsZ0JBQUEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ3JGLGFBQUE7YUFDRixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ1AsS0FBQTtJQUNIOztJQ2RBOztJQUVHO0lBQ0csU0FBVSx5QkFBeUIsQ0FBQyxhQUE2QixFQUFBO0lBQ3JFLElBQUEsSUFBSSxhQUFhLENBQUMsa0JBQWtCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUMvQyxRQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNoRSxJQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUQsWUFBQSxhQUFhLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwRCxTQUFBO0lBQ0QsUUFBQSxhQUFhLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDO0lBQ3ZDLEtBQUE7SUFDSDs7SUNYQTs7O0lBR0c7SUFDYSxTQUFBLHNCQUFzQixDQUFDLGFBQTZCLEVBQUUsYUFBa0MsRUFBQTtJQUN0RyxJQUFBLElBQUksYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDNUIsSUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ25DLElBQUksQ0FBQyxDQUFBLElBQUksS0FBQSxJQUFBLElBQUosSUFBSSxLQUFKLEtBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxHQUFBLElBQUksQ0FBRSxPQUFPLE1BQUssUUFBUSxNQUFNLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixLQUFLLFdBQVcsQ0FBQyxFQUFFO0lBQ3ZGLFlBQUEsSUFBSSxDQUFDLHFCQUFxQixHQUFHLENBQUMsQ0FBQztnQkFDL0IsYUFBYSxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUNoQyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBQ2hCLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBRW5CLFlBQUEsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUM1QixNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3hDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDZixhQUFBO0lBRUQsWUFBQSxJQUFJLE9BQU8sSUFBSSxDQUFDLGFBQWEsS0FBSyxXQUFXLEVBQUU7SUFDN0MsZ0JBQUEsYUFBYSxHQUFHLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUYsYUFBQTs7Z0JBR0QsSUFBSSxNQUFNLEtBQUssYUFBYSxLQUFLLEVBQUUsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtvQkFDM0YsYUFBYSxHQUFHLEVBQUUsQ0FBQztJQUNwQixhQUFBO2dCQUVELElBQUksYUFBYSxLQUFLLEVBQUUsRUFBRTtJQUN4QixnQkFBQSxJQUFJLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQztJQUN6QixnQkFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLG9CQUFvQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBRXZELGdCQUFBLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNyRCxhQUFBO0lBQU0saUJBQUE7SUFDTCxnQkFBQSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUFFOztJQUU5QixvQkFBQSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO3dCQUNsQyxJQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BELG9CQUFBLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbEQsb0JBQUEsUUFBUSxDQUFDLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztJQUNoQyxvQkFBQSxRQUFRLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQzs7d0JBR3hCLElBQU0sYUFBYSxJQUNqQixNQUFNO0lBQ04sd0JBQUEsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDO0lBQzVDLHdCQUFBLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FDbkMsQ0FBQztJQUVGLG9CQUFBLElBQUksYUFBYSxFQUFFOzRCQUNqQixRQUFRLENBQUMsTUFBTSxHQUFHLFlBQUE7SUFDaEIsNEJBQUEsYUFBYSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3RELHlCQUFDLENBQUM7NEJBQ0YsUUFBUSxDQUFDLE9BQU8sR0FBRyxZQUFBO0lBQ2pCLDRCQUFBLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUN0RCx5QkFBQyxDQUFDO0lBQ0gscUJBQUE7SUFFRCxvQkFBQSxRQUFRLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7SUFFNUMsb0JBQUEsSUFBSSxPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssV0FBVyxFQUFFO0lBQzlDLHdCQUFBLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUNyQyxxQkFBQTtJQUVELG9CQUFBLElBQUk7NEJBQ0YsSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO0lBQ3JCLDRCQUFBLFNBQVMsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLDRCQUFBLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IseUJBQUE7SUFDRixxQkFBQTt3QkFBQyxPQUFPLENBQUMsRUFBRSxHQUFHO3dCQUVmLElBQUksQ0FBQyxhQUFhLEVBQUU7SUFDbEIsd0JBQUEsYUFBYSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3JELHFCQUFBO0lBQ0YsaUJBQUE7SUFBTSxxQkFBQTtJQUNMLG9CQUFBLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNyRCxpQkFBQTtJQUNGLGFBQUE7SUFDRixTQUFBO0lBQU0sYUFBQTtJQUNMLFlBQUEsYUFBYSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3JELFNBQUE7SUFDRixLQUFBO0lBQU0sU0FBQTs7SUFFTCxRQUFBLElBQUksYUFBYSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQzNDLFlBQUEsYUFBYSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNwRSxTQUFBO0lBQU0sYUFBQTtnQkFDTCxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFM0IsWUFBQSxVQUFVLENBQUMsWUFBQTtvQkFDVCxhQUFhLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztvQkFDM0MsYUFBYSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUMvQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ1YsU0FBQTtJQUNGLEtBQUE7SUFDSDs7SUM5RkE7Ozs7SUFJRzthQUNhLGVBQWUsQ0FBQyxhQUE2QixFQUFFLElBQXFDLEVBQUUsV0FBb0IsRUFBQTtRQUN4SCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFdBQVcsSUFBSSxhQUFhLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3ZELFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDcEIsS0FBQTs7UUFHRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssR0FBRyxFQUFFO1lBQzFELFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDcEIsS0FBQTtJQUFNLFNBQUE7SUFDTCxRQUFBLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUM7SUFDN0IsS0FBQTtJQUVELElBQUEsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7WUFDdkIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztJQUVuQixRQUFBLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUU7SUFDN0IsWUFBQSxJQUFNLFVBQVUsR0FBRyxJQUF5QixDQUFDO0lBRTdDLFlBQUEsSUFBSSxVQUFVLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQ2xDLGdCQUFBLE1BQU0sR0FBSSxVQUFVLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBWSxDQUFDO29CQUNwRCxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ2YsYUFBQTtJQUVELFlBQUEsSUFBSSxXQUFXLEVBQUU7SUFDZixnQkFBQSxJQUFJLE9BQU8sVUFBVSxDQUFDLGFBQWEsS0FBSyxXQUFXLEVBQUU7SUFDbkQsb0JBQUEsYUFBYSxHQUFHLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEcsaUJBQUE7SUFDRixhQUFBO0lBQU0saUJBQUE7SUFDTCxnQkFBQSxhQUFhLEdBQUcsYUFBYSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDL0YsSUFBSSxVQUFVLENBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxPQUFPLFVBQVUsQ0FBQyxJQUFJLEtBQUssV0FBVyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssRUFBRSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUFFO0lBQ25JLG9CQUFBLFVBQVUsQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztJQUM3QyxpQkFBQTtJQUNGLGFBQUE7O2dCQUdELElBQUksTUFBTSxLQUFLLGFBQWEsS0FBSyxFQUFFLENBQUMsS0FBSyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7b0JBQzNGLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDcEIsYUFBQTtnQkFFRCxJQUFJLGFBQWEsS0FBSyxFQUFFLEVBQUU7SUFDeEIsZ0JBQUEsVUFBVSxDQUFDLElBQUksR0FBRyxZQUFZLENBQUM7SUFDL0IsZ0JBQUEsVUFBVSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM5RCxhQUFBO0lBQU0saUJBQUE7SUFDTCxnQkFBQSxJQUFJLFdBQVcsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLFlBQVksRUFBRTs7SUFFbkQsb0JBQUEsSUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQzt3QkFDeEMsSUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxRCxvQkFBQSxhQUFhLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xELG9CQUFBLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUM7SUFDaEMsb0JBQUEsUUFBUSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDeEIsb0JBQUEsSUFBSSxXQUFXLEVBQUU7SUFDZix3QkFBQSxRQUFRLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7SUFDbEQsd0JBQUEsSUFBSSxPQUFPLFVBQVUsQ0FBQyxjQUFjLEtBQUssV0FBVyxFQUFFO0lBQ3BELDRCQUFBLFFBQVEsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLGNBQWMsQ0FBQztJQUMzQyx5QkFBQTtJQUNGLHFCQUFBO3dCQUVELElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtJQUNyQix3QkFBQSxTQUFTLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2Qyx3QkFBQSxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLHFCQUFBO0lBQ0YsaUJBQUE7SUFDRixhQUFBO0lBQ0YsU0FBQTtJQUFNLGFBQUEsSUFDTCxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssUUFBUTtJQUMxQixhQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDO0lBQ3hCLGFBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxPQUFPLENBQUM7SUFDMUIsYUFBQyxJQUFJLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQztJQUMxQixhQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssT0FBTyxDQUFDO0lBQzFCLGFBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUM7SUFDNUIsYUFBQyxJQUFJLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxFQUMzQjtnQkFDQSxJQUFJLENBQUMsV0FBVyxFQUFFO29CQUNoQixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO0lBQzVHLG9CQUFBLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzt3QkFDcEMsSUFBTSxPQUFPLEdBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQVksQ0FBQzs7SUFFckQsb0JBQUEsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssYUFBYSxJQUFJLE9BQU8sS0FBSyxFQUFFLEVBQUU7SUFDNUUsd0JBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRCx3QkFBQSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLHFCQUFBO0lBQ0YsaUJBQUE7SUFDRixhQUFBO0lBRUQsWUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUU7SUFDckUsZ0JBQUEsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBWSxDQUFDLENBQUM7SUFDM0UsYUFBQTtJQUVELFlBQUEsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO0lBQzFKLGdCQUFBLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLHNCQUFzQixDQUFXLENBQUM7SUFFN0QsZ0JBQUEsYUFBYSxHQUFHLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBRTdGLElBQUksYUFBYSxLQUFLLEVBQUUsRUFBRTtJQUN4QixvQkFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLG9CQUFvQixFQUFFLGFBQWEsQ0FBQyxDQUFDOzt3QkFHdkQsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQWdCLENBQUM7SUFDbEQsb0JBQUEsYUFBYSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMvQyxvQkFBQSxLQUFLLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0lBQy9DLG9CQUFBLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLG9CQUFBLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxHQUFHLENBQUM7SUFDN0Isb0JBQUEsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFVBQXdCLENBQUM7SUFDdEQsb0JBQUEsZUFBZSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDMUMsb0JBQUEsZUFBZSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDakMsSUFBMkIsR0FBRyxJQUFJLENBQUM7SUFDckMsaUJBQUE7SUFBTSxxQkFBQTs7SUFFTCxvQkFBQSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsc0JBQXNCLENBQUMsRUFBRTtJQUM3Qyx3QkFBQSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRyxJQUFJLENBQUMsWUFBWSxDQUFDLHNCQUFzQixDQUFZLENBQUMsQ0FBQztJQUNoRix3QkFBQSxJQUFJLENBQUMsZUFBZSxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDOUMscUJBQUE7SUFDRCxvQkFBQSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO0lBRTVCLG9CQUFBLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUU7NEJBQzdCLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFnQixDQUFDO0lBQzFELHdCQUFBLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDdkQsd0JBQUEsYUFBYSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUN2RCx3QkFBQSxhQUFhLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztJQUM3Qix3QkFBQSxhQUFhLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO0lBQ3JDLHdCQUFBLElBQU0seUJBQXlCLEdBQUcsSUFBSSxDQUFDLFVBQXlCLENBQUM7SUFDakUsd0JBQUEseUJBQXlCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVDLHdCQUFBLHlCQUF5QixDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQzs0QkFDcEQsSUFBMkIsR0FBRyxJQUFJLENBQUM7SUFDckMscUJBQUE7SUFDRixpQkFBQTtJQUNGLGFBQUE7SUFDRixTQUFBO0lBQ0YsS0FBQTtJQUNIOztJQ3pJQTs7OztJQUlHO2FBQ2EsZ0JBQWdCLENBQUMsTUFBYyxFQUFFLGFBQTZCLEVBQUUsV0FBbUQsRUFBQTtRQUNqSSxJQUFJLFdBQVcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDOUQsSUFBTSxZQUFVLEdBQUcsV0FBZ0MsQ0FBQzs7SUFHcEQsUUFBQSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sS0FBSyxRQUFRLEtBQUssT0FBTyxZQUFVLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxZQUFVLENBQUMsSUFBSSxLQUFLLGlCQUFpQixJQUFJLFlBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7SUFDN0ssWUFBQSxZQUFVLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO0lBQ3JDLFNBQUE7SUFFRCxRQUFBO0lBQ0UsUUFBQSxDQUFDLFlBQVUsQ0FBQyxPQUFPLEtBQUssUUFBUTtJQUNoQyxhQUNFLENBQUMsWUFBVSxDQUFDLElBQUksSUFBSSxJQUFJO0lBQ3hCLGlCQUFDLE9BQU8sWUFBVSxDQUFDLElBQUksS0FBSyxXQUFXLENBQUM7SUFDeEMsaUJBQUMsWUFBVSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUM7SUFDeEIsaUJBQUMsWUFBVSxDQUFDLElBQUksS0FBSyxpQkFBaUIsQ0FBQztJQUN2QyxpQkFBQyxZQUFVLENBQUMsSUFBSSxLQUFLLHdCQUF3QixDQUFDO0lBQzlDLGlCQUFDLFlBQVUsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDO0lBQzlCLGlCQUFDLFlBQVUsQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLENBQ25DLEVBQ0Q7Z0JBQ0EsYUFBYSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBRWhDLFlBQUEsWUFBVSxDQUFDLGFBQWEsR0FBRyxZQUFVLENBQUMsU0FBUyxDQUFDO2dCQUNoRCxJQUFJLFlBQVUsQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLE9BQU8sWUFBVSxDQUFDLElBQUksS0FBSyxXQUFXLElBQUksWUFBVSxDQUFDLElBQUksS0FBSyxFQUFFLElBQUksWUFBVSxDQUFDLElBQUksS0FBSyxZQUFZLEVBQUU7SUFDbkksZ0JBQUEsWUFBVSxDQUFDLGNBQWMsR0FBRyxZQUFVLENBQUMsSUFBSSxDQUFDO0lBQzdDLGFBQUE7SUFDRCxZQUFBLFlBQVUsQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDOztnQkFHL0IsSUFBTSw2QkFBMkIsR0FBRyxVQUFVLEtBQVksRUFBQTtvQkFDeEQsSUFBSSxZQUFVLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFlBQVksRUFBRTt3QkFDcEQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3hCLGlCQUFBO0lBQ0QsZ0JBQUEsWUFBVSxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixFQUFFLDZCQUEyQixDQUFDLENBQUM7SUFDckYsYUFBQyxDQUFDO0lBQ0YsWUFBQSxZQUFVLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLEVBQUUsNkJBQTJCLENBQUMsQ0FBQztJQUVoRixZQUFBLElBQUksYUFBYSxDQUFDLFdBQVcsSUFBSSxZQUFVLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBVSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRTtJQUN2RyxnQkFBQSxhQUFhLENBQUMscUJBQXFCLENBQUMsWUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JELGFBQUE7SUFFRCxZQUFBLElBQUksWUFBVSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRTtvQkFDcEMsSUFBSSxZQUFVLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ3BDLG9CQUFBLFlBQVUsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckMsaUJBQUE7SUFDRCxnQkFBQSxhQUFhLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFVLENBQUMsQ0FBQztJQUMvQyxhQUFBO0lBQU0saUJBQUE7SUFDTCxnQkFBQSxhQUFhLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFlBQVUsQ0FBQyxDQUFDO0lBQ2xELGFBQUE7SUFDRixTQUFBO0lBQU0sYUFBQSxJQUNMLENBQUMsV0FBVyxDQUFDLE9BQU8sS0FBSyxRQUFRO0lBQ2pDLGFBQUMsV0FBVyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUM7SUFDL0IsYUFBQyxXQUFXLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQztJQUNqQyxhQUFDLFdBQVcsQ0FBQyxPQUFPLEtBQUssT0FBTyxDQUFDO0lBQ2pDLGFBQUMsV0FBVyxDQUFDLE9BQU8sS0FBSyxPQUFPLENBQUM7SUFDakMsYUFBQyxXQUFXLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQztJQUNuQyxhQUFDLFdBQVcsQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLEVBQ2xDO2dCQUNBLElBQUksSUFBSSxHQUFHLFdBQTBCLENBQUM7SUFDdEMsWUFBQSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO0lBQ3hJLGdCQUFBLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDcEosb0JBQUEsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3BDLG9CQUFBLElBQUksQ0FBQyxZQUFZLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQVcsQ0FBQyxDQUFDO0lBQzlFLG9CQUFBLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7O3dCQUc1QixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBZ0IsQ0FBQztJQUNsRCxvQkFBQSxhQUFhLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9DLG9CQUFBLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7SUFDL0Msb0JBQUEsS0FBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDckIsb0JBQUEsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLFVBQXdCLENBQUM7SUFDdEQsb0JBQUEsZUFBZSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDMUMsb0JBQUEsZUFBZSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDakMsSUFBMkIsR0FBRyxJQUFJLENBQUM7SUFFcEMsb0JBQUEsYUFBYSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QyxpQkFBQTtvQkFFRCxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksTUFBTSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFO0lBQ3ZGLG9CQUFBLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQVcsQ0FBQyxDQUFDO0lBQ3pFLGlCQUFBO0lBQ0YsYUFBQTtJQUNGLFNBQUE7SUFDRixLQUFBO0lBQ0g7O0lDMUZBOzs7Ozs7O0lBT0c7SUFDYSxTQUFBLHNCQUFzQixDQUFDLE1BQWMsRUFBRSxhQUE2QixFQUFFLFNBQTZCLEVBQUUsTUFBYyxFQUFFLElBQWlCLEVBQUUsV0FBb0IsRUFBQTtRQUMxSyxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFFcEIsSUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2hFLElBQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUd2RCxRQUFBLElBQUksQ0FBQyxNQUFNLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxVQUFVLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFO2dCQUNsRSxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFO29CQUN6RCxVQUFVLEdBQUcsYUFBYSxDQUFDLCtCQUErQixDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDM0UsTUFBTTtJQUNQLGFBQUE7SUFDRixTQUFBOztJQUdELFFBQUEsSUFBSSxDQUFDLE1BQU0sS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLFVBQVUsQ0FBQyxXQUFXLEtBQUssRUFBRSxDQUFDLEVBQUU7SUFDbEYsWUFBQSxJQUFJLFVBQVUsQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLEtBQUssYUFBYSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtvQkFDM0YsVUFBVSxHQUFHLGFBQWEsQ0FBQywrQkFBK0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzNFLE1BQU07SUFDUCxhQUFBO0lBQ0YsU0FBQTs7WUFHRCxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLFVBQVUsQ0FBQyxLQUFLLEtBQUssRUFBRSxDQUFDLEVBQUU7Z0JBQzlFLElBQU0sS0FBSyxHQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ2hFLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxLQUFLLEVBQUU7b0JBQzVDLFVBQVUsR0FBRyxhQUFhLENBQUMsK0JBQStCLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUMzRSxNQUFNO0lBQ1AsYUFBQTtJQUNGLFNBQUE7O1lBR0QsSUFBSSxVQUFVLENBQUMsT0FBTyxLQUFLLFVBQVUsQ0FBQyxPQUFPLEtBQUssRUFBRSxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLENBQUMsZ0JBQWdCLEtBQUssRUFBRSxDQUFDLEVBQUU7SUFDeEgsWUFBQSxJQUFJLFVBQVUsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLGdCQUFnQixFQUFFO29CQUNoRCxVQUFVLEdBQUcsYUFBYSxDQUFDLCtCQUErQixDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDM0UsTUFBTTtJQUNQLGFBQUE7SUFDRixTQUFBOztZQUdELElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxNQUFNLFVBQVUsQ0FBQyxTQUFTLEtBQUssRUFBRSxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxDQUFDLFNBQVMsS0FBSyxFQUFFLENBQUMsRUFBRTtJQUNoSCxZQUFBLElBQU0sWUFBWSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3ZFLFlBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEtBQUssWUFBWSxNQUFNLFlBQVksS0FBSyxHQUFHLENBQUMsRUFBRTtvQkFDckUsVUFBVSxHQUFHLGFBQWEsQ0FBQywrQkFBK0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzNFLE1BQU07SUFDUCxhQUFBO0lBQ0YsU0FBQTs7WUFHRCxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsTUFBTSxVQUFVLENBQUMsU0FBUyxLQUFLLEVBQUUsQ0FBQyxLQUFLLE9BQU8sU0FBUyxLQUFLLFdBQVcsQ0FBQyxLQUFLLFNBQVMsS0FBSyxXQUFXLENBQUMsRUFBRTtnQkFDaEksSUFBTSxZQUFZLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNsRSxZQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxLQUFLLFlBQVksTUFBTSxZQUFZLEtBQUssR0FBRyxDQUFDLEVBQUU7b0JBQ3JFLFVBQVUsR0FBRyxhQUFhLENBQUMsK0JBQStCLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUMzRSxNQUFNO0lBQ1AsYUFBQTtJQUNGLFNBQUE7O0lBR0QsUUFBQTtZQUNFLENBQUMsTUFBTSxLQUFLLEVBQUU7aUJBQ2IsVUFBVSxDQUFDLFdBQVcsQ0FBQztJQUN4QixhQUFDLFVBQVUsQ0FBQyxXQUFXLEtBQUssRUFBRSxDQUFDO2lCQUM5QixhQUFhLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3hELGFBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUM7SUFDeEIsYUFBQyxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxFQUM1QjtnQkFDQSxJQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0QsWUFBQSxJQUFJLENBQUMsU0FBUyxLQUFLLEVBQUUsTUFBTSxTQUFTLEtBQUssTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtJQUNsRSxnQkFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUMzRSxJQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRSxvQkFBQSxJQUFJLFNBQVMsS0FBSyxhQUFhLENBQUMsQ0FBQyxFQUFFOzRCQUNqQyxVQUFVLEdBQUcsYUFBYSxDQUFDLCtCQUErQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDNUUsTUFBTTtJQUNQLHFCQUFBO0lBQ0YsaUJBQUE7SUFDRixhQUFBO0lBQ0YsU0FBQTtJQUNGLEtBQUE7O1FBR0QsSUFBSSxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0lBQ2pELFFBQUEsSUFBSSxXQUFXLEtBQUssTUFBTSxLQUFLLEVBQUUsQ0FBQyxLQUFLLFVBQVUsS0FBSyxFQUFFLENBQUMsRUFBRTs7SUFFekQsWUFBQSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ3JDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQztJQUV4QixZQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ25FLGdCQUFBLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLGFBQUE7SUFBTSxpQkFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRTtJQUN6RSxnQkFBQSxTQUFTLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxhQUFBO0lBQU0saUJBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUU7SUFDcEUsZ0JBQUEsU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakMsYUFBQTtJQUFNLGlCQUFBO29CQUNMLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDdEIsYUFBQTtJQUVELFlBQUEsSUFBSSxZQUFZLEVBQUU7b0JBQ2hCLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDOUIsb0JBQUEsU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN6RCxpQkFBQTtvQkFDRCxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQzlCLG9CQUFBLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDekQsaUJBQUE7SUFFRCxnQkFBQSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQ3hCLG9CQUFBLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQ3BFLElBQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMzRCxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQ0FDeEMsVUFBVSxHQUFHLGFBQWEsQ0FBQywrQkFBK0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0NBQ3pFLE1BQU07SUFDUCx5QkFBQTtJQUNGLHFCQUFBO0lBQ0YsaUJBQUE7SUFDRixhQUFBO0lBQ0YsU0FBQTtJQUNGLEtBQUE7SUFFRCxJQUFBLE9BQU8sVUFBVSxDQUFDO0lBQ3BCOztJQzdIQSxTQUFTLHlCQUF5QixDQUFDLFFBQWdCLEVBQUUsS0FBeUIsRUFBQTtRQUM1RSxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELElBQUEsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMxQixJQUFBLE1BQU0sQ0FBQyxFQUFFLEdBQUcscUNBQXFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLFNBQVMsR0FBRywyWkFBMlosR0FBRyxRQUFRLEdBQUcsU0FBUyxDQUFDO0lBRXRjLElBQUEsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELFNBQVMsdUJBQXVCLENBQUMsUUFBZ0IsRUFBRSxLQUF5QixFQUFBO1FBQzFFLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEQsSUFBQSxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFCLElBQUEsTUFBTSxDQUFDLEVBQUUsR0FBRyxxQ0FBcUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsU0FBUyxHQUFHLG9ZQUFvWSxHQUFHLFFBQVEsR0FBRyxTQUFTLENBQUM7SUFFL2EsSUFBQSxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU0sSUFBTSxZQUFZLEdBQUcsVUFBUyxhQUE2QixFQUFBO0lBQ2hFLElBQUEsSUFBSSxhQUFhLENBQUMsTUFBTSxJQUFJLE9BQU8sYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQzVFLElBQU0sZ0JBQWMsR0FBRyxVQUFDLE1BQWMsRUFBQTtJQUNwQyxZQUFBLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25ELFlBQUEsT0FBTyxNQUFNLENBQUM7SUFDaEIsU0FBQyxDQUFDOztJQUdGLFFBQUEsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU0sRUFBQTtJQUMxRSxZQUFBLE9BQUEsZ0JBQWMsQ0FBQyxNQUFNLENBQUMsS0FBSyxnQkFBYyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7SUFBbkUsU0FBbUUsQ0FBQyxDQUFDO0lBRXZFLFFBQUEsSUFBSSxjQUFjLEVBQUU7SUFDbEIsWUFBQSxhQUFhLENBQUMscUJBQXFCLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztnQkFDMUQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNsQixJQUFJLFlBQVksU0FBMkIsQ0FBQztJQUU1QyxZQUFBLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7SUFDcEMsZ0JBQUEsTUFBTSxHQUFHLHVCQUF1QixDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDcEcsWUFBWSxHQUFHLFVBQVUsQ0FBQztJQUMzQixhQUFBO0lBQU0saUJBQUE7SUFDTCxnQkFBQSxNQUFNLEdBQUcseUJBQXlCLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN0RyxZQUFZLEdBQUcsWUFBWSxDQUFDO0lBQzdCLGFBQUE7SUFFRCxZQUFBLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEtBQUssWUFBWSxFQUFFO0lBQ3ZELGdCQUFBLGFBQWEsQ0FBQyxNQUFNLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQztvQkFDbEQsSUFBTSxtQkFBbUIsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7b0JBQzNGLElBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUU1RSxnQkFBQSxtQkFBbUIsSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNwRCxnQkFBQSxZQUFZLElBQUksWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRXRDLGdCQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLGFBQUE7SUFDRixTQUFBO0lBQ0YsS0FBQTtJQUNILENBQUM7O0lDMUNNLElBQU0sYUFBYSxHQUFHLFVBQWEsR0FBWSxFQUFFLFNBQXlDLEVBQUUsT0FBeUMsRUFBQTtJQUMxSSxJQUFBLElBQU0sT0FBTyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFFckMsT0FBTyxDQUFDLGtCQUFrQixHQUFHLFlBQUE7SUFDM0IsUUFBQSxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLEVBQUU7O0lBRXZFLFlBQUEsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtvQkFDdkIsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNkLE9BQU87SUFDUixhQUFBO2dCQUVELElBQUk7b0JBQ0YsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQzNDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQixhQUFBO0lBQUMsWUFBQSxPQUFPLENBQU8sRUFBRTtvQkFDaEIsT0FBTyxJQUFJLE9BQU8sQ0FBQzt3QkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO0lBQ25CLG9CQUFBLE9BQU8sRUFBRSxvQkFBb0IsR0FBRyxDQUFDLENBQUMsT0FBTztJQUMxQyxpQkFBQSxDQUFDLENBQUM7SUFDSixhQUFBO0lBQ0YsU0FBQTtJQUFNLGFBQUEsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLENBQUMsRUFBRTtnQkFDaEMsT0FBTyxJQUFJLE9BQU8sQ0FBQztvQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO29CQUNuQixPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVk7SUFDM0IsYUFBQSxDQUFDLENBQUM7SUFDSixTQUFBO0lBQ0gsS0FBQyxDQUFDO1FBRUYsT0FBTyxDQUFDLE9BQU8sR0FBRyxZQUFBO1lBQ2hCLE9BQU8sSUFBSSxPQUFPLENBQUM7Z0JBQ2pCLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDVixZQUFBLE9BQU8sRUFBRSxTQUFTO0lBQ25CLFNBQUEsQ0FBQyxDQUFDO0lBQ0wsS0FBQyxDQUFDO1FBRUYsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqQixDQUFDLENBQUM7SUFFSyxJQUFNLFlBQVksR0FBRyxVQUFTLGFBQTZCLEVBQUE7SUFDaEUsSUFBQSxJQUFNLEdBQUcsR0FBRyxhQUFhLENBQUMsR0FBRyxHQUFHLGlCQUFpQixHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEdBQUcsZ0JBQWdCLENBQUM7UUFFMUcsU0FBUyxxQkFBcUIsQ0FBQyxJQUF1QixFQUFBO0lBQ3BELFFBQUEsSUFBSSxJQUFJLEVBQUU7Z0JBQ1IsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNmLGFBQWEsQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7b0JBQ2xELGFBQWEsQ0FBQyxNQUFNLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDbEQsYUFBQTtnQkFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEVBQUU7SUFDNUMsZ0JBQUEsYUFBYSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO29CQUNuQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDN0IsYUFBQTtJQUNGLFNBQUE7SUFFRCxRQUFBLGFBQWEsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1NBQ3JDOzs7UUFJRCxhQUFhLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxxQkFBcUIsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7O0lDNUVEOztJQUVHO2FBQ2EsbUJBQW1CLEdBQUE7UUFDakMsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7SUFFRzthQUNhLG9CQUFvQixHQUFBO1FBQ2xDLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNsRTs7SUNaQTtJQUNBO0lBQ0E7SUFDQSxTQUFTLGtCQUFrQixDQUFDLFFBQVEsRUFBRTtJQUN0QyxFQUFFLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDckMsRUFBRSxPQUFPLElBQUksQ0FBQyxJQUFJO0lBQ2xCLElBQUksU0FBUyxLQUFLLEVBQUU7SUFDcEI7SUFDQSxNQUFNLE9BQU8sV0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXO0lBQzdELFFBQVEsT0FBTyxLQUFLLENBQUM7SUFDckIsT0FBTyxDQUFDLENBQUM7SUFDVCxLQUFLO0lBQ0wsSUFBSSxTQUFTLE1BQU0sRUFBRTtJQUNyQjtJQUNBLE1BQU0sT0FBTyxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVc7SUFDN0Q7SUFDQSxRQUFRLE9BQU8sV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQyxPQUFPLENBQUMsQ0FBQztJQUNULEtBQUs7SUFDTCxHQUFHLENBQUM7SUFDSjs7SUNwQkEsU0FBUyxVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ3pCLEVBQUUsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ2YsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLFNBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRTtJQUN6QyxJQUFJLElBQUksRUFBRSxHQUFHLElBQUksT0FBTyxHQUFHLENBQUMsTUFBTSxLQUFLLFdBQVcsQ0FBQyxFQUFFO0lBQ3JELE1BQU0sT0FBTyxNQUFNO0lBQ25CLFFBQVEsSUFBSSxTQUFTO0lBQ3JCLFVBQVUsT0FBTyxHQUFHO0lBQ3BCLFlBQVksR0FBRztJQUNmLFlBQVksR0FBRztJQUNmLFlBQVksZ0VBQWdFO0lBQzVFLFNBQVM7SUFDVCxPQUFPLENBQUM7SUFDUixLQUFLO0lBQ0wsSUFBSSxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0MsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLE9BQU8sT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLElBQUksSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNoQztJQUNBLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRTtJQUN6QixNQUFNLElBQUksR0FBRyxLQUFLLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxPQUFPLEdBQUcsS0FBSyxVQUFVLENBQUMsRUFBRTtJQUN6RSxRQUFRLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDNUIsUUFBUSxJQUFJLE9BQU8sSUFBSSxLQUFLLFVBQVUsRUFBRTtJQUN4QyxVQUFVLElBQUksQ0FBQyxJQUFJO0lBQ25CLFlBQVksR0FBRztJQUNmLFlBQVksU0FBUyxHQUFHLEVBQUU7SUFDMUIsY0FBYyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLGFBQWE7SUFDYixZQUFZLFNBQVMsQ0FBQyxFQUFFO0lBQ3hCLGNBQWMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDMUQsY0FBYyxJQUFJLEVBQUUsU0FBUyxLQUFLLENBQUMsRUFBRTtJQUNyQyxnQkFBZ0IsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLGVBQWU7SUFDZixhQUFhO0lBQ2IsV0FBVyxDQUFDO0lBQ1osVUFBVSxPQUFPO0lBQ2pCLFNBQVM7SUFDVCxPQUFPO0lBQ1AsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNwRCxNQUFNLElBQUksRUFBRSxTQUFTLEtBQUssQ0FBQyxFQUFFO0lBQzdCLFFBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLE9BQU87SUFDUCxLQUFLO0FBQ0w7SUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0QixLQUFLO0lBQ0wsR0FBRyxDQUFDLENBQUM7SUFDTDs7SUMzQ0E7SUFDQTtJQUNBLElBQUksY0FBYyxHQUFHLFVBQVUsQ0FBQztBQUNoQztJQUNBLFNBQVMsT0FBTyxDQUFDLENBQUMsRUFBRTtJQUNwQixFQUFFLE9BQU8sT0FBTyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssV0FBVyxDQUFDLENBQUM7SUFDdkQsQ0FBQztBQUNEO0lBQ0EsU0FBUyxJQUFJLEdBQUcsRUFBRTtBQUNsQjtJQUNBO0lBQ0EsU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtJQUMzQixFQUFFLE9BQU8sV0FBVztJQUNwQixJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2pDLEdBQUcsQ0FBQztJQUNKLENBQUM7QUFDRDtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsU0FBU0EsU0FBTyxDQUFDLEVBQUUsRUFBRTtJQUNyQixFQUFFLElBQUksRUFBRSxJQUFJLFlBQVlBLFNBQU8sQ0FBQztJQUNoQyxJQUFJLE1BQU0sSUFBSSxTQUFTLENBQUMsc0NBQXNDLENBQUMsQ0FBQztJQUNoRSxFQUFFLElBQUksT0FBTyxFQUFFLEtBQUssVUFBVSxFQUFFLE1BQU0sSUFBSSxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN0RTtJQUNBLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDbEI7SUFDQSxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQ3hCO0lBQ0EsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztJQUMxQjtJQUNBLEVBQUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDdkI7SUFDQSxFQUFFLFNBQVMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQztBQUNEO0lBQ0EsU0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtJQUNoQyxFQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7SUFDNUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixHQUFHO0lBQ0gsRUFBRSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0lBQ3pCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsSUFBSSxPQUFPO0lBQ1gsR0FBRztJQUNILEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDdkIsRUFBRUEsU0FBTyxDQUFDLFlBQVksQ0FBQyxXQUFXO0lBQ2xDLElBQUksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsUUFBUSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO0lBQzVFLElBQUksSUFBSSxFQUFFLEtBQUssSUFBSSxFQUFFO0lBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxPQUFPLEdBQUcsTUFBTSxFQUFFLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVFLE1BQU0sT0FBTztJQUNiLEtBQUs7SUFDTCxJQUFJLElBQUksR0FBRyxDQUFDO0lBQ1osSUFBSSxJQUFJO0lBQ1IsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7SUFDaEIsTUFBTSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsQyxNQUFNLE9BQU87SUFDYixLQUFLO0lBQ0wsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNuQyxHQUFHLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDRDtJQUNBLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7SUFDakMsRUFBRSxJQUFJO0lBQ047SUFDQSxJQUFJLElBQUksUUFBUSxLQUFLLElBQUk7SUFDekIsTUFBTSxNQUFNLElBQUksU0FBUyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7SUFDdkUsSUFBSTtJQUNKLE1BQU0sUUFBUTtJQUNkLE9BQU8sT0FBTyxRQUFRLEtBQUssUUFBUSxJQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsQ0FBQztJQUN0RSxNQUFNO0lBQ04sTUFBTSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQy9CLE1BQU0sSUFBSSxRQUFRLFlBQVlBLFNBQU8sRUFBRTtJQUN2QyxRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7SUFDL0IsUUFBUSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckIsUUFBUSxPQUFPO0lBQ2YsT0FBTyxNQUFNLElBQUksT0FBTyxJQUFJLEtBQUssVUFBVSxFQUFFO0lBQzdDLFFBQVEsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUMsUUFBUSxPQUFPO0lBQ2YsT0FBTztJQUNQLEtBQUs7SUFDTCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7SUFDM0IsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ2QsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLEdBQUc7SUFDSCxDQUFDO0FBQ0Q7SUFDQSxTQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0lBQ2hDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDbEIsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztJQUN6QixFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNmLENBQUM7QUFDRDtJQUNBLFNBQVMsTUFBTSxDQUFDLElBQUksRUFBRTtJQUN0QixFQUFFLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0lBQ3pELElBQUlBLFNBQU8sQ0FBQyxZQUFZLENBQUMsV0FBVztJQUNwQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO0lBQzFCLFFBQVFBLFNBQU8sQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkQsT0FBTztJQUNQLEtBQUssQ0FBQyxDQUFDO0lBQ1AsR0FBRztBQUNIO0lBQ0EsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUM5RCxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLEdBQUc7SUFDSCxFQUFFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7QUFDRDtJQUNBO0lBQ0E7SUFDQTtJQUNBLFNBQVMsT0FBTyxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFO0lBQ25ELEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLFdBQVcsS0FBSyxVQUFVLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQztJQUM1RSxFQUFFLElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxVQUFVLEtBQUssVUFBVSxHQUFHLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDekUsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0FBQ0Q7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxTQUFTLFNBQVMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFO0lBQzdCLEVBQUUsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ25CLEVBQUUsSUFBSTtJQUNOLElBQUksRUFBRTtJQUNOLE1BQU0sU0FBUyxLQUFLLEVBQUU7SUFDdEIsUUFBUSxJQUFJLElBQUksRUFBRSxPQUFPO0lBQ3pCLFFBQVEsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNwQixRQUFRLE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0IsT0FBTztJQUNQLE1BQU0sU0FBUyxNQUFNLEVBQUU7SUFDdkIsUUFBUSxJQUFJLElBQUksRUFBRSxPQUFPO0lBQ3pCLFFBQVEsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNwQixRQUFRLE1BQU0sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDN0IsT0FBTztJQUNQLEtBQUssQ0FBQztJQUNOLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRTtJQUNmLElBQUksSUFBSSxJQUFJLEVBQUUsT0FBTztJQUNyQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7SUFDaEIsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3JCLEdBQUc7SUFDSCxDQUFDO0FBQ0Q7QUFDQUEsYUFBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxTQUFTLFVBQVUsRUFBRTtJQUNsRCxFQUFFLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDckMsQ0FBQyxDQUFDO0FBQ0Y7QUFDQUEsYUFBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxXQUFXLEVBQUUsVUFBVSxFQUFFO0lBQzNEO0lBQ0EsRUFBRSxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEM7SUFDQSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxPQUFPLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzNELEVBQUUsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDLENBQUM7QUFDRjtBQUNBQSxhQUFPLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHQyxrQkFBYyxDQUFDO0FBQzlDO0FBQ0FELGFBQU8sQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUU7SUFDNUIsRUFBRSxPQUFPLElBQUlBLFNBQU8sQ0FBQyxTQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUU7SUFDL0MsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ3ZCLE1BQU0sT0FBTyxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDO0lBQ25FLEtBQUs7QUFDTDtJQUNBLElBQUksSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9DLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxPQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM5QyxJQUFJLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDaEM7SUFDQSxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUU7SUFDekIsTUFBTSxJQUFJO0lBQ1YsUUFBUSxJQUFJLEdBQUcsS0FBSyxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksT0FBTyxHQUFHLEtBQUssVUFBVSxDQUFDLEVBQUU7SUFDM0UsVUFBVSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQzlCLFVBQVUsSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVLEVBQUU7SUFDMUMsWUFBWSxJQUFJLENBQUMsSUFBSTtJQUNyQixjQUFjLEdBQUc7SUFDakIsY0FBYyxTQUFTLEdBQUcsRUFBRTtJQUM1QixnQkFBZ0IsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUM1QixlQUFlO0lBQ2YsY0FBYyxNQUFNO0lBQ3BCLGFBQWEsQ0FBQztJQUNkLFlBQVksT0FBTztJQUNuQixXQUFXO0lBQ1gsU0FBUztJQUNULFFBQVEsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN0QixRQUFRLElBQUksRUFBRSxTQUFTLEtBQUssQ0FBQyxFQUFFO0lBQy9CLFVBQVUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hCLFNBQVM7SUFDVCxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUU7SUFDbkIsUUFBUSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbkIsT0FBTztJQUNQLEtBQUs7QUFDTDtJQUNBLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDMUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLEtBQUs7SUFDTCxHQUFHLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztBQUNGO0FBQ0FBLGFBQU8sQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0FBQ2hDO0FBQ0FBLGFBQU8sQ0FBQyxPQUFPLEdBQUcsU0FBUyxLQUFLLEVBQUU7SUFDbEMsRUFBRSxJQUFJLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBS0EsU0FBTyxFQUFFO0lBQzNFLElBQUksT0FBTyxLQUFLLENBQUM7SUFDakIsR0FBRztBQUNIO0lBQ0EsRUFBRSxPQUFPLElBQUlBLFNBQU8sQ0FBQyxTQUFTLE9BQU8sRUFBRTtJQUN2QyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQixHQUFHLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztBQUNGO0FBQ0FBLGFBQU8sQ0FBQyxNQUFNLEdBQUcsU0FBUyxLQUFLLEVBQUU7SUFDakMsRUFBRSxPQUFPLElBQUlBLFNBQU8sQ0FBQyxTQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUU7SUFDL0MsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEIsR0FBRyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7QUFDRjtBQUNBQSxhQUFPLENBQUMsSUFBSSxHQUFHLFNBQVMsR0FBRyxFQUFFO0lBQzdCLEVBQUUsT0FBTyxJQUFJQSxTQUFPLENBQUMsU0FBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO0lBQy9DLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUN2QixNQUFNLE9BQU8sTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLCtCQUErQixDQUFDLENBQUMsQ0FBQztJQUNwRSxLQUFLO0FBQ0w7SUFDQSxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDcEQsTUFBTUEsU0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3BELEtBQUs7SUFDTCxHQUFHLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztBQUNGO0lBQ0E7QUFDQUEsYUFBTyxDQUFDLFlBQVk7SUFDcEI7SUFDQSxFQUFFLENBQUMsT0FBTyxZQUFZLEtBQUssVUFBVTtJQUNyQyxJQUFJLFNBQVMsRUFBRSxFQUFFO0lBQ2pCO0lBQ0EsTUFBTSxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdkIsS0FBSztJQUNMLEVBQUUsU0FBUyxFQUFFLEVBQUU7SUFDZixJQUFJLGNBQWMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUIsR0FBRyxDQUFDO0FBQ0o7QUFDQUEsYUFBTyxDQUFDLHFCQUFxQixHQUFHLFNBQVMscUJBQXFCLENBQUMsR0FBRyxFQUFFO0lBQ3BFLEVBQUUsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLElBQUksT0FBTyxFQUFFO0lBQ2pELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMvRCxHQUFHO0lBQ0gsQ0FBQzs7SUMvT0QsSUFBTSwyQkFBMkIsR0FBRyxVQUFVLGFBQThCLEVBQUUsZUFBc0MsRUFBQTtRQUNsSCxPQUFPO0lBQ0wsUUFBQSxNQUFNLEVBQUUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxlQUFlLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFNBQVM7SUFDbkcsUUFBQSxJQUFJLEVBQUUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxlQUFlLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFNBQVM7SUFDakcsUUFBQSxPQUFPLEVBQUUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxlQUFlLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQyxJQUFJLFNBQVM7SUFDMUcsUUFBQSxJQUFJLEVBQUUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxlQUFlLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFNBQVM7SUFDakcsUUFBQSxLQUFLLEVBQUUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxlQUFlLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLFNBQVM7SUFDcEcsUUFBQSxVQUFVLEVBQUUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxlQUFlLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLFNBQVM7WUFDdkcsV0FBVyxFQUFFLG9CQUFvQixDQUFDLGdCQUFnQixDQUFDLElBQUksYUFBYSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxlQUFlLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLElBQUksU0FBUztTQUNuSyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBRUssSUFBTSxZQUFZLEdBQUcsVUFBVSxhQUE4QixFQUFFLFNBQW1CLEVBQUE7SUFDdkYsSUFBQSxJQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQXlCLElBQUksYUFBYSxDQUFDLGFBQWEsQ0FBQztRQUUvSCxJQUFJLENBQUMsZUFBZSxFQUFFO0lBQ3BCLFFBQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxrR0FBa0csQ0FBQyxDQUFDO0lBQ2pILFFBQUEsT0FBTyxlQUFlLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLEtBQUE7UUFFRCxJQUFNLFVBQVUsR0FBRywyQkFBMkIsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFFL0UsSUFBQSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtJQUN0QixRQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsNERBQTRELENBQUMsQ0FBQztJQUMzRSxRQUFBLE9BQU8sZUFBZSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQyxLQUFBO1FBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzVDLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0RBQW9ELEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RGLFFBQUEsT0FBTyxlQUFlLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLEtBQUE7SUFFRCxJQUFBLElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDakMsSUFBQSxJQUFNLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO0lBQzdCLElBQUEsSUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQztJQUNuQyxJQUFBLElBQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7SUFDN0IsSUFBQSxJQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO0lBQy9CLElBQUEsSUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQztJQUN6QyxJQUFBLElBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUM7SUFFM0MsSUFBQSxhQUFhLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUU5QixJQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFO0lBQ2hDLFFBQUEsYUFBYSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDaEMsUUFBQSxhQUFhLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUM5QixRQUFBLGFBQWEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ2pDLFFBQUEsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzFDLFFBQUEsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQ3pDLFFBQUEsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3hDLFFBQUEsYUFBYSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDL0IsUUFBQSxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDbkMsUUFBQSxPQUFPLGVBQWUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDL0MsS0FBQTtJQUVELElBQUEsSUFBTSxZQUFZLEdBQUc7WUFDbkIsUUFBUSxJQUFJLFNBQVMsR0FBRyxNQUFNLEdBQUcsT0FBTyxDQUFDO1lBQ3pDLFVBQVUsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUN6RCxRQUFBLE1BQU0sSUFBSSxhQUFhLENBQUMsVUFBVSxHQUFHLE1BQU0sR0FBRyxPQUFPLENBQUM7O1lBRXRELFlBQVk7U0FDYixDQUFDOztJQUdGLElBQUEsU0FBUyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNsRSxJQUFJLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDMUMsT0FBTyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELElBQUksSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQztRQUMxQyxLQUFLLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDN0MsSUFBQSxVQUFVLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMxRSxXQUFXLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsV0FBVyxDQUFDLENBQUM7SUFFL0QsSUFBQSxhQUFhLENBQUMsU0FBUyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyRixhQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZJLGFBQWEsQ0FBQyxhQUFhLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzs7SUFFaEUsSUFBQSxhQUFhLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztJQUVwQyxJQUFBLE9BQU8sSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFBO1lBQ2hELGFBQWEsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxNQUFNLEdBQUcsU0FBUyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNHLEtBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7SUM3Rk0sSUFBTSxtQkFBbUIsR0FBRyxVQUFVLE9BQWdCLEVBQUE7UUFDM0QsT0FBTyxPQUFPLEdBQUcsMkJBQTJCLENBQUM7SUFDL0MsQ0FBQzs7SUNDRDs7SUFFRztJQUNHLFNBQVUsMEJBQTBCLENBQUUsYUFBNkIsRUFBQTtRQUN2RSxJQUFNLGdCQUFnQixHQUFHLGFBQWEsQ0FBQyxtQkFBbUIsSUFBSSxhQUFhLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUM7SUFFakgsSUFBQSxJQUFJLGdCQUFnQixJQUFJLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7SUFDbkQsUUFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ2hELFlBQUEsSUFBTSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLElBQUksR0FBRyxDQUFDLEVBQUUsRUFBRTs7SUFFVixnQkFBQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUNoRSxJQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV2RCxvQkFBQSxJQUFJLEdBQUcsQ0FBQyxFQUFFLEtBQUssVUFBVSxDQUFDLEtBQUssRUFBRTs0QkFDL0IsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMvQyxxQkFBQTtJQUNGLGlCQUFBO29CQUVELElBQU0sbUJBQW1CLEdBQUcsc0NBQXNDLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQzs7SUFHekYsZ0JBQUEsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3BDLG9CQUFBLEVBQUUsRUFBRSxDQUFDO3dCQUNMLEtBQUssRUFBRSxHQUFHLENBQUMsRUFBRTtJQUNiLG9CQUFBLEdBQUcsRUFBRSxtQkFBbUI7SUFDeEIsb0JBQUEsU0FBUyxFQUFFLEVBQUU7SUFDYixvQkFBQSxTQUFTLEVBQUUsRUFBRTtJQUNiLG9CQUFBLFdBQVcsRUFBRSxFQUFFO0lBQ2Ysb0JBQUEsT0FBTyxFQUFFLEVBQUU7SUFDWCxvQkFBQSxJQUFJLEVBQUUsRUFBRTtJQUNSLG9CQUFBLEdBQUcsRUFBRSxFQUFFO0lBQ1IsaUJBQUEsQ0FBQyxDQUFDO0lBQ0osYUFBQTtJQUNGLFNBQUE7SUFDRixLQUFBO0lBQ0g7O0lDckJBOzs7SUFHRztJQUNILFNBQVMsdUJBQXVCLENBQUUsWUFBK0IsRUFBQTtRQUMvRCxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsWUFBWSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxFQUFFLFlBQVksQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDLENBQUM7SUFDbEksQ0FBQztJQUVEOzs7SUFHRztJQUNILFNBQVMsU0FBUyxDQUFFLGFBQTZCLEVBQUUsa0JBQTJCLEVBQUE7SUFDNUUsSUFBQSxJQUFNLGlCQUFpQixHQUFHLGFBQWEsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsYUFBYSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUM7SUFFbkgsSUFBQSxJQUFJLGtCQUFrQixFQUFFOztJQUV0QixRQUFBLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxVQUFTLElBQTJCLEVBQUE7SUFDbkUsWUFBQSxJQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUF5QixFQUFLLEVBQUEsT0FBQSx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBL0IsRUFBK0IsQ0FBQyxDQUFDO0lBQzNILFlBQUEsSUFBTSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFVBQUMsTUFBeUIsRUFBSyxFQUFBLE9BQUEsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQS9CLEVBQStCLENBQUMsQ0FBQztJQUN6SCxZQUFBLElBQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQXlCLEVBQUssRUFBQSxPQUFBLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxDQUEvQixFQUErQixDQUFDLENBQUM7SUFDeEgsWUFBQSxJQUFNLHVCQUF1QixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUF5QixFQUFLLEVBQUEsT0FBQSx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBL0IsRUFBK0IsQ0FBQyxDQUFDO2dCQUU3SCxhQUFhLENBQUMsVUFBVSxHQUNuQixRQUFBLENBQUEsUUFBQSxDQUFBLEVBQUEsRUFBQSxhQUFhLENBQUMsVUFBVSxDQUFBLEVBQUEsRUFDM0Isc0JBQXNCLEVBQUUsc0JBQXNCLEVBQzlDLHFCQUFxQixFQUFFLHFCQUFxQixFQUM1QyxxQkFBcUIsRUFBRSxxQkFBcUIsRUFDNUMsdUJBQXVCLEVBQUUsdUJBQXVCLEVBQUEsQ0FDakQsQ0FBQztnQkFFRixhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ3JCLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMvQixTQUFDLENBQUMsQ0FBQztJQUNKLEtBQUE7SUFBTSxTQUFBO1lBQ0wsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JCLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUM5QixLQUFBO1FBRUQsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7Ozs7SUFLRztJQUNHLFNBQVUsVUFBVSxDQUFFLGFBQTZCLEVBQUUsVUFBa0IsRUFBRSxTQUFrQixFQUFFLGtCQUEyQixFQUFBO1FBQzVILElBQU0sc0JBQXNCLEdBQUcsa0JBQWtCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXBFLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLHNCQUFzQixFQUFFLFNBQVMsRUFBRSxZQUFBO0lBQ2hFLFFBQUEsU0FBUyxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQy9DLEtBQUMsQ0FBQyxDQUFDO0lBQ0w7O0lDekNBO0lBQ0EsSUFBSUEsU0FBTyxHQUFHLENBQUMsT0FBTyxNQUFNLENBQUMsT0FBTyxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxHQUFHRSxTQUFlLENBQUM7QUFDdEo7SUFDQSxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7QUFDeEI7SUFDQTtJQUNBLElBQUksd0JBQXdCLEdBQUcsR0FBRyxDQUFDO0FBQ25DO0lBQ0E7SUFDQTtJQUNBLElBQUksUUFBUSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssV0FBVyxFQUFFO0lBQ25ELElBQUksTUFBTSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUNELE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxFQUFFO0lBQzNDLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBR0YsU0FBTyxDQUFDO0lBQzNCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDbEIsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQzFCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDekIsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUM3QixJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0lBQ3pCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDMUgsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUM3QjtJQUNBLElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDL0IsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLGdDQUFnQyxDQUFDO0lBQ2pELElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDckIsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztJQUMzQixJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQzVCLElBQUksSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7SUFDakMsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQzNCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDdkIsSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUMzQixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUM7SUFDaEMsSUFBSSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztJQUM5QixJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLHFCQUFxQixFQUFFLEVBQUUsRUFBRSxxQkFBcUIsRUFBRSxFQUFFLEVBQUUsc0JBQXNCLEVBQUUsRUFBRSxFQUFFLHVCQUF1QixFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3hJLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDdkIsSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztJQUM3QixJQUFJLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0lBQzlCLElBQUksSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7SUFDaEMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0lBQ2xDLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDckIsSUFBSSxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztJQUMzQixJQUFJLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQzlCLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDcEIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNyQixJQUFJLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLElBQUksSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztJQUMvQixJQUFJLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxDQUFDLENBQUM7SUFDMUMsSUFBSSxJQUFJLENBQUMsMEJBQTBCLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLElBQUksSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFDN0IsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO0lBQ3JDLElBQUksSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztJQUN2QyxJQUFJLElBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUM7SUFDNUMsSUFBSSxJQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFDO0lBQzFDLElBQUksSUFBSSxDQUFDLDRCQUE0QixHQUFHLElBQUksQ0FBQztJQUM3QyxJQUFJLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxTQUFTLENBQUM7SUFDOUMsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztJQUNoQyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLElBQUksSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDOUIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0lBQ2xDLElBQUksSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDakMsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUM3QixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDNUIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQy9CLElBQUksSUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQztJQUN0QyxJQUFJLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0lBQy9CLElBQUksSUFBSSxDQUFDLHlCQUF5QixHQUFHLEtBQUssQ0FBQztJQUMzQyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ3pFLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDM0IsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQy9CLElBQUksSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUNoQyxJQUFJLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxZQUFZO0lBQ3RDLFFBQVEsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFO0lBQ25DLFlBQVksT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUMvRCxTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0I7SUFDckQsY0FBYyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0UsY0FBYyxJQUFJLENBQUM7QUFDbkI7SUFDQSxRQUFRLE9BQU8sYUFBYTtJQUM1QixjQUFjLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSTtJQUNyRSxjQUFjLFdBQVcsQ0FBQztJQUMxQixLQUFLLEdBQUcsQ0FBQztJQUNULElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDeEIsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7SUFDakMsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQztJQUM3QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7SUFDbEMsSUFBSSxJQUFJLENBQUMsNkJBQTZCLEdBQUcsRUFBRSxDQUFDO0lBQzVDLElBQUksSUFBSSxDQUFDLG9DQUFvQyxHQUFHLEtBQUssQ0FBQztJQUN0RCxJQUFJLElBQUksQ0FBQyxlQUFlLEdBQUcsRUFBRSxDQUFDO0lBQzlCLElBQUksSUFBSSxDQUFDLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztJQUNyQyxJQUFJLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxFQUFFLENBQUM7SUFDM0MsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO0lBQ3RDLElBQUksSUFBSSxDQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQztJQUMzQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUM7SUFDakMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0lBQ2hDLElBQUksSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFDN0IsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUN6QixJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQzFCLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7SUFDMUIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0lBQ3BDLElBQUksSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztJQUN2QyxJQUFJLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7SUFDdEMsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHO0lBQ3ZCLFFBQVEsV0FBVyxFQUFFLElBQUk7SUFDekIsUUFBUSxXQUFXLEVBQUUsSUFBSTtJQUN6QixRQUFRLFdBQVcsRUFBRSxJQUFJO0lBQ3pCLEtBQUssQ0FBQztJQUNOLElBQUksSUFBSSxDQUFDLGlCQUFpQixHQUFHO0lBQzdCLFFBQVEsSUFBSSxFQUFFO0lBQ2QsWUFBWSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO0lBQ3BELFlBQVksSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSTtJQUNwRCxZQUFZLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUk7SUFDcEQsWUFBWSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO0lBQ3BELFlBQVksSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJO0lBQzVCLFNBQVM7SUFDVCxRQUFRLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUN2QixRQUFRLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQztJQUNwQixNQUFLO0lBQ0w7SUFDQTtJQUNBO0lBQ0EsSUFBSSxJQUFJLENBQUMsY0FBYyxHQUFHO0lBQzFCLFFBQVEsT0FBTyxFQUFFO0lBQ2pCLFlBQVksRUFBRSxDQUFDLEVBQUUsc0JBQXNCLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDakQsWUFBWSxFQUFFLENBQUMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDeEMsWUFBWSxFQUFFLENBQUMsRUFBRSxzQkFBc0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNqRCxZQUFZLEVBQUUsQ0FBQyxFQUFFLHNCQUFzQixFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ2pELFlBQVksRUFBRSxDQUFDLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDbEQsWUFBWSxFQUFFLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUM1QyxZQUFZLEVBQUUsQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUN2QyxZQUFZLEVBQUUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUN6QyxZQUFZLEVBQUUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUN4QyxZQUFZLEVBQUUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUN4QyxZQUFZLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNyQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLGVBQWUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUMxQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUN0QyxZQUFZLEVBQUUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUN6QyxZQUFZLEVBQUUsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQzVDLFlBQVksRUFBRSxDQUFDLEVBQUUscUJBQXFCLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDaEQsWUFBWSxFQUFFLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUMzQyxTQUFTO0lBQ1QsS0FBSyxDQUFDO0lBQ04sSUFBSSxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsZUFBZSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQ3hGLElBQUksSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztJQUNwQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDdkIsSUFBSSxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztJQUNoQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7SUFDbkMsSUFBSSxJQUFJLENBQUMscUJBQXFCLEdBQUc7SUFDakMsUUFBUSxZQUFZLEVBQUUsUUFBUTtJQUM5QixRQUFRLFFBQVEsRUFBRSxLQUFLO0lBQ3ZCLFFBQVEsb0JBQW9CLEVBQUUsSUFBSTtJQUNsQyxRQUFRLDJCQUEyQixFQUFFLElBQUk7SUFDekMsUUFBUSx3QkFBd0IsRUFBRSxLQUFLO0lBQ3ZDLFFBQVEsU0FBUyxFQUFFLElBQUk7SUFDdkIsUUFBUSxhQUFhLEVBQUUsSUFBSTtJQUMzQixRQUFRLGNBQWMsRUFBRSxLQUFLO0lBQzdCLEtBQUssQ0FBQztBQUNOO0lBQ0EsSUFBSSxJQUFJLHNCQUFzQixHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7QUFDeEQ7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLE1BQU0sQ0FBQyxNQUFNLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsU0FBUyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRTtJQUV6RyxRQUFRLElBQUksTUFBTSxJQUFJLElBQUksRUFBRTtJQUM1QixZQUFZLE1BQU0sSUFBSSxTQUFTLENBQUMsNENBQTRDLENBQUMsQ0FBQztJQUM5RSxTQUFTO0lBQ1QsUUFBUSxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsUUFBUSxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxLQUFLLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtJQUMvRCxZQUFZLElBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QyxZQUFZLElBQUksVUFBVSxJQUFJLElBQUksRUFBRTtJQUNwQyxnQkFBZ0IsS0FBSyxJQUFJLE9BQU8sSUFBSSxVQUFVLEVBQUU7SUFDaEQsb0JBQW9CLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsRUFBRTtJQUNuRix3QkFBd0IsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxRCxxQkFBcUI7SUFDckIsaUJBQWlCO0lBQ2pCLGFBQWE7SUFDYixTQUFTO0lBQ1QsUUFBUSxPQUFPLEVBQUUsQ0FBQztJQUNsQixNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWTtJQUM1QixRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztJQUN4QjtBQUNBO0lBQ0EsUUFBUSxJQUFJLFFBQVEsSUFBSSxRQUFRLEVBQUU7SUFDbEMsWUFBWSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2RDtJQUNBLFlBQVksSUFBSSxDQUFDLFVBQVUsRUFBRTtJQUM3QixnQkFBZ0IsSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssUUFBUSxHQUFHLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDN0YsZ0JBQWdCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRywyQ0FBMkMsR0FBRyxlQUFlLENBQUM7QUFDNUc7SUFDQSxnQkFBZ0IsSUFBSSxDQUFDLGFBQWEsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0lBQ3hDO0lBQ0Esb0JBQW9CLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRywyQ0FBMkMsR0FBRyxlQUFlLENBQUM7SUFDaEgsaUJBQWlCO0lBQ2pCLGFBQWE7SUFDYixTQUFTO0lBQ1QsYUFBYTtJQUNiLFlBQVksSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDdkMsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtJQUNqQyxZQUFZLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQ3JDLFlBQVksSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDdkMsWUFBWSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUNwQyxZQUFZLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ2pDLFlBQVksSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDbkMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDN0MsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDNUMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0MsWUFBWSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUNsQyxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUN0QyxZQUFZLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUN2QyxTQUFTO0FBQ1Q7SUFDQTtJQUNBLFFBQVEsSUFBSSxPQUFPLFFBQVEsQ0FBQyxpQkFBaUIsS0FBSyxXQUFXLEVBQUU7SUFDL0QsWUFBWSxRQUFRLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztJQUNoRSxTQUFTO0FBQ1Q7SUFDQTtJQUNBLFFBQVEsUUFBUSxDQUFDLGFBQWEsR0FBRyxTQUFTLFVBQVUsRUFBRTtJQUN0RCxZQUFZLE9BQU8sV0FBVztJQUM5QixnQkFBZ0IsSUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEUsZ0JBQWdCLE9BQU8sQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLENBQUM7SUFDbEQsZ0JBQWdCLE9BQU8sT0FBTyxDQUFDO0lBQy9CLGFBQWEsQ0FBQztJQUNkLFNBQVMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbEM7SUFDQSxRQUFRLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3RFO0lBQ0EsUUFBUSxTQUFTLHFCQUFxQixHQUFHO0lBQ3pDLFlBQVksSUFBSSxVQUFVLEdBQUcsb0NBQW9DLENBQUM7SUFDbEUsWUFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLHFMQUFxTCxFQUFFLFVBQVUsRUFBQztJQUMzTixTQUFTO0FBQ1Q7SUFDQSxRQUFRLFNBQVMsaUJBQWlCLENBQUMsTUFBTSxFQUFFO0lBQzNDLFlBQVksT0FBTyxNQUFNO0lBQ3pCLGdCQUFnQixNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQztJQUMxQyxpQkFBaUIsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNySCxpQkFBaUIsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDakYsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDckI7SUFDQSxRQUFRLElBQUksaUJBQWlCLENBQUMsc0JBQXNCLENBQUMsRUFBRTtJQUN2RCxZQUFZLENBQUMsR0FBRyxzQkFBc0IsQ0FBQztBQUN2QztJQUNBLFlBQVksSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ3RDLGdCQUFnQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckQsYUFBYSxNQUFNO0lBQ25CLGdCQUFnQixDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDckMsYUFBYTtJQUNiLFNBQVMsTUFBTTtJQUNmLFlBQVksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDbkc7SUFDQSxZQUFZLElBQUksQ0FBQyxFQUFFO0lBQ25CLGdCQUFnQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckQsYUFBYSxNQUFNO0lBQ25CO0lBQ0EsZ0JBQWdCLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RSxnQkFBZ0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDekQsb0JBQW9CLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRCxvQkFBb0IsSUFBSSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsRUFBRTtJQUN2RCx3QkFBd0IsQ0FBQyxHQUFHLFVBQVUsQ0FBQztBQUN2QztJQUNBO0lBQ0Esd0JBQXdCLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUNsRCw0QkFBNEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pFLHlCQUF5QixNQUFNO0lBQy9CLDRCQUE0QixDQUFDLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDakQseUJBQXlCO0FBQ3pCO0lBQ0Esd0JBQXdCLE1BQU07SUFDOUIscUJBQXFCO0lBQ3JCLGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLENBQUMsQ0FBQyxFQUFFO0lBQ2hCLFlBQVkscUJBQXFCLEVBQUUsQ0FBQztJQUNwQyxTQUFTLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUMvQyxZQUFZLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRCxTQUFTO0FBQ1Q7SUFDQTtJQUNBO0lBQ0EsUUFBUSxTQUFTLGVBQWUsR0FBRztJQUNuQztBQUNBO0lBQ0EsWUFBWSxJQUFJLFNBQVMsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7SUFDbkUsZ0JBQWdCLE9BQU8sU0FBUyxDQUFDLFNBQVMsQ0FBQztJQUMzQyxhQUFhO0FBQ2I7SUFDQTtJQUNBLFlBQVksT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4QyxTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQ7SUFDQSxRQUFRLElBQUksQ0FBQyxFQUFFO0lBQ2YsWUFBWSxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztJQUNuQyxZQUFZLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUMzRTtJQUNBLFlBQVksU0FBUyxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtJQUNqRCxnQkFBZ0IsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQzVELGdCQUFnQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzlELGFBQWE7QUFDYjtJQUNBLFlBQVksSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsS0FBMEMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxFQUFFO0lBQ25KLGdCQUFnQixJQUFJLENBQUMsR0FBRyxHQUFHLG1EQUFrQixDQUFDO0lBQzlDLGdCQUFnQixJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUMzRCxhQUFhLE1BQU07SUFDbkIsZ0JBQWdCLElBQUksQ0FBQyxHQUFHLEdBQUcsb0RBQW1CLENBQUM7SUFDL0MsYUFBYTtBQUNiO0lBQ0EsWUFBWSxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEQ7SUFDQSxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDaEQsWUFBWSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlDLFlBQVksSUFBSSxFQUFFLEVBQUU7SUFDcEIsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDdkIsYUFBYTtJQUNiLFlBQVksSUFBSSxDQUFDLEVBQUU7SUFDbkIsZ0JBQWdCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNwQyxvQkFBb0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDcEMsaUJBQWlCO0lBQ2pCLGFBQWE7QUFDYjtJQUNBLFlBQVksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNoRCxZQUFZLElBQUksQ0FBQyxFQUFFO0lBQ25CLGdCQUFnQixJQUFJLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzdELGdCQUFnQixJQUFJLENBQUMsUUFBUSxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5RCxhQUFhO0FBQ2I7SUFDQSxZQUFZLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUN6RCxZQUFZLElBQUksRUFBRSxFQUFFO0lBQ3BCLGdCQUFnQixJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNLEVBQUU7SUFDakQsb0JBQW9CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzFDLG9CQUFvQixJQUFJLENBQUMscUJBQXFCLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztJQUNyRSxpQkFBaUI7SUFDakIsYUFBYTtBQUNiO0lBQ0EsWUFBWSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDNUQsWUFBWSxJQUFJLEdBQUcsRUFBRTtJQUNyQixnQkFBZ0IsSUFBSSxHQUFHLEtBQUssR0FBRyxFQUFFO0lBQ2pDLG9CQUFvQixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztJQUM5QyxpQkFBaUI7SUFDakIsYUFBYTtBQUNiO0lBQ0EsWUFBWSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDOUQsWUFBWSxJQUFJLEdBQUcsRUFBRTtJQUNyQixnQkFBZ0IsSUFBSSxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssR0FBRyxFQUFFO0lBQy9DLG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDbEQsaUJBQWlCO0lBQ2pCLGFBQWE7QUFDYjtJQUNBLFlBQVksSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzdELFlBQVksSUFBSSxHQUFHLEVBQUU7SUFDckIsZ0JBQWdCLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLEdBQUcsRUFBRTtJQUMvQyxvQkFBb0IsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQ2pELGlCQUFpQjtJQUNqQixhQUFhO0FBQ2I7SUFDQSxZQUFZLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUM1RCxZQUFZLElBQUksR0FBRyxFQUFFO0lBQ3JCLGdCQUFnQixJQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxHQUFHLEVBQUU7SUFDL0Msb0JBQW9CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUNoRCxpQkFBaUI7SUFDakIsYUFBYTtBQUNiO0lBQ0EsWUFBWSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDdEQsWUFBWSxJQUFJLEVBQUUsRUFBRTtJQUNwQixnQkFBZ0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDcEMsYUFBYTtBQUNiO0lBQ0EsWUFBWSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDdkQsWUFBWSxJQUFJLEVBQUUsRUFBRTtJQUNwQixnQkFBZ0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLGFBQWE7QUFDYjtJQUNBLFlBQVksSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3pELFlBQVksSUFBSSxFQUFFLEVBQUU7SUFDcEIsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQ3RDLGFBQWE7QUFDYjtJQUNBLFlBQVksSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNwRCxZQUFZLElBQUksRUFBRSxFQUFFO0lBQ3BCLGdCQUFnQixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUN0QyxnQkFBZ0IsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztJQUM5QyxhQUFhO0FBQ2I7SUFDQSxZQUFZLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUMzRCxZQUFZLElBQUksRUFBRSxFQUFFO0lBQ3BCLGdCQUFnQixJQUFJLEVBQUUsS0FBSyxNQUFNLElBQUksRUFBRSxLQUFLLE9BQU8sRUFBRTtJQUNyRCxvQkFBb0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUNwRCxvQkFBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEdBQUcsRUFBRSxLQUFLLE1BQU0sQ0FBQztJQUNoRSxpQkFBaUIsTUFBTTtJQUN2QixvQkFBb0IsSUFBSSxDQUFDLHlCQUF5QixDQUFDLHFCQUFxQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzlFLGlCQUFpQjtJQUNqQixhQUFhO0FBQ2I7SUFDQSxZQUFZLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUN4RCxZQUFZLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsS0FBSyxVQUFVLEVBQUU7SUFDdkQsZ0JBQWdCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7SUFDaEQsZ0JBQWdCLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxLQUFLLENBQUM7SUFDMUQsYUFBYTtBQUNiO0lBQ0EsWUFBWSxJQUFJLHNCQUFzQixHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUNoRixZQUFZLElBQUksc0JBQXNCLElBQUksc0JBQXNCLENBQUMsV0FBVyxFQUFFLEtBQUssVUFBVSxFQUFFO0lBQy9GLGdCQUFnQixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO0lBQ2xELGdCQUFnQixJQUFJLENBQUMscUJBQXFCLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO0lBQ3hFLGFBQWE7QUFDYjtJQUNBLFlBQVksSUFBSSw2QkFBNkIsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDL0YsWUFBWSxJQUFJLDZCQUE2QixJQUFJLDZCQUE2QixDQUFDLFdBQVcsRUFBRSxLQUFLLFVBQVUsRUFBRTtJQUM3RyxnQkFBZ0IsSUFBSSxDQUFDLDJCQUEyQixHQUFHLEtBQUssQ0FBQztJQUN6RCxnQkFBZ0IsSUFBSSxDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixHQUFHLEtBQUssQ0FBQztJQUMvRSxhQUFhO0FBQ2I7SUFDQSxZQUFZLElBQUksMEJBQTBCLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQzFGLFlBQVksSUFBSSwwQkFBMEIsSUFBSSwwQkFBMEIsQ0FBQyxXQUFXLEVBQUUsS0FBSyxTQUFTLEVBQUU7SUFDdEcsZ0JBQWdCLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUM7SUFDckQsZ0JBQWdCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUM7SUFDM0UsYUFBYTtBQUNiO0lBQ0EsWUFBWSxJQUFJLDBCQUEwQixHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUM1RixZQUFZLElBQUksMEJBQTBCLElBQUksMEJBQTBCLENBQUMsV0FBVyxFQUFFLEtBQUssVUFBVSxFQUFFO0lBQ3ZHLGdCQUFnQixJQUFJLENBQUMsNEJBQTRCLEdBQUcsS0FBSyxDQUFDO0lBQzFELGFBQWE7QUFDYjtJQUNBLFlBQVksSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzdELFlBQVksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLFVBQVUsRUFBRTtJQUN6RCxnQkFBZ0IsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztJQUNoRCxhQUFhO0FBQ2I7SUFDQSxZQUFZLElBQUksdUJBQXVCLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ2hGLFlBQVksSUFBSSx1QkFBdUIsRUFBRTtJQUN6QyxnQkFBZ0IsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGNBQWMsR0FBRyx1QkFBdUIsQ0FBQztJQUNwRixhQUFhO0FBQ2I7SUFDQSxZQUFZLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDekgsWUFBWSxJQUFJLElBQUksRUFBRTtJQUN0QixnQkFBZ0IsSUFBSSxJQUFJLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxPQUFPLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtJQUMvRSxvQkFBb0IsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQztJQUN6RCxpQkFBaUIsTUFBTTtJQUN2QixvQkFBb0IsT0FBTyxDQUFDLElBQUk7SUFDaEMsd0JBQXdCLHNKQUFzSjtJQUM5Syx3QkFBd0IsSUFBSTtJQUM1QixxQkFBcUIsQ0FBQztJQUN0QixpQkFBaUI7SUFDakIsYUFBYTtBQUNiO0lBQ0EsWUFBWSxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQ3pGLFNBQVM7QUFDVDtJQUNBLFFBQVEsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMxQyxRQUFRLElBQUksRUFBRSxFQUFFO0lBQ2hCLFlBQVksSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEQsWUFBWSxJQUFJLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEQsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ25ELFFBQVEsSUFBSSxHQUFHLEVBQUU7SUFDakIsWUFBWSxJQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNLEVBQUU7SUFDOUMsZ0JBQWdCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3RDLGdCQUFnQixJQUFJLENBQUMscUJBQXFCLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztJQUNqRSxhQUFhO0lBQ2IsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDdEQsUUFBUSxJQUFJLElBQUksRUFBRTtJQUNsQixZQUFZLElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRTtJQUM5QixnQkFBZ0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7SUFDMUMsYUFBYTtJQUNiLFNBQVM7QUFDVDtJQUNBLFFBQVEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3hELFFBQVEsSUFBSSxJQUFJLEVBQUU7SUFDbEIsWUFBWSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxHQUFHLEVBQUU7SUFDNUMsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUM5QyxhQUFhO0lBQ2IsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDdkQsUUFBUSxJQUFJLElBQUksRUFBRTtJQUNsQixZQUFZLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLEdBQUcsRUFBRTtJQUM1QyxnQkFBZ0IsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQzdDLGFBQWE7SUFDYixTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN0RCxRQUFRLElBQUksSUFBSSxFQUFFO0lBQ2xCLFlBQVksSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssR0FBRyxFQUFFO0lBQzVDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDNUMsYUFBYTtJQUNiLFNBQVM7QUFDVDtJQUNBLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNoRCxRQUFRLElBQUksR0FBRyxFQUFFO0lBQ2pCLFlBQVksSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7SUFDakMsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2pELFFBQVEsSUFBSSxHQUFHLEVBQUU7SUFDakIsWUFBWSxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekMsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDN0YsUUFBUSxJQUFJLEdBQUcsRUFBRTtJQUNqQixZQUFZLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO0lBQ25DLFNBQVM7QUFDVDtJQUNBLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QyxRQUFRLElBQUksR0FBRyxFQUFFO0lBQ2pCLFlBQVksSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7SUFDbkMsWUFBWSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsR0FBRyxDQUFDO0lBQzNDLFNBQVM7QUFDVDtJQUNBLFFBQVEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNsRCxRQUFRLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxVQUFVLEVBQUU7SUFDckQsWUFBWSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0lBQzVDLFlBQVksSUFBSSxDQUFDLDRCQUE0QixHQUFHLEtBQUssQ0FBQztJQUN0RCxTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUNuRSxRQUFRLElBQUksa0JBQWtCLElBQUksa0JBQWtCLEtBQUssVUFBVSxFQUFFO0lBQ3JFLFlBQVksSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztJQUM5QyxZQUFZLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7SUFDcEUsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLHlCQUF5QixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUNqRixRQUFRLElBQUkseUJBQXlCLElBQUkseUJBQXlCLEtBQUssVUFBVSxFQUFFO0lBQ25GLFlBQVksSUFBSSxDQUFDLDJCQUEyQixHQUFHLEtBQUssQ0FBQztJQUNyRCxZQUFZLElBQUksQ0FBQyxxQkFBcUIsQ0FBQywyQkFBMkIsR0FBRyxLQUFLLENBQUM7SUFDM0UsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLHNCQUFzQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUM3RSxRQUFRLElBQUksc0JBQXNCLElBQUksc0JBQXNCLEtBQUssU0FBUyxFQUFFO0lBQzVFLFlBQVksSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQztJQUNqRCxZQUFZLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUM7SUFDdkUsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLDBCQUEwQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUNuRixRQUFRLElBQUksMEJBQTBCLElBQUksMEJBQTBCLENBQUMsV0FBVyxFQUFFLEtBQUssVUFBVSxFQUFFO0lBQ25HLFlBQVksSUFBSSxDQUFDLDRCQUE0QixHQUFHLEtBQUssQ0FBQztJQUN0RCxTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3JFLFFBQVEsSUFBSSxtQkFBbUIsRUFBRTtJQUNqQyxZQUFZLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxjQUFjLEdBQUcsbUJBQW1CLENBQUM7SUFDNUUsU0FBUztBQUNUO0lBQ0E7SUFDQSxRQUFRLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDbkM7SUFDQSxRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDN0QsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUMvQyxZQUFZLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkQsU0FBUztBQUNUO0lBQ0E7SUFDQSxRQUFRLElBQUksb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDckYsUUFBUSxJQUFJLG9CQUFvQixJQUFJLG9CQUFvQixLQUFLLEdBQUcsRUFBRTtJQUNsRSxZQUFZLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7SUFDN0MsU0FBUztBQUNUO0FBQ0E7SUFDQTtJQUNBLFFBQVEsSUFBSSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzlELFFBQVEsSUFBSSxrQkFBa0IsS0FBSyxLQUFLLElBQUksa0JBQWtCLEtBQUssTUFBTSxJQUFJLGtCQUFrQixLQUFLLE9BQU8sSUFBSSxrQkFBa0IsS0FBSyxTQUFTLElBQUksa0JBQWtCLEtBQUssU0FBUyxFQUFFO0lBQ3JMLFVBQVUsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDbkMsVUFBVSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUNyQyxVQUFVLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUM7SUFDaEQsVUFBVSxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUN2RCxVQUFVLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsR0FBRyxLQUFLLENBQUM7SUFDdEUsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtJQUNuQyxZQUFZLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQ3RDLFlBQVksSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDaEMsWUFBWSxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUN4RCxTQUFTO0FBQ1Q7SUFDQSxRQUFRLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RDO0lBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFO0lBQzFDLFlBQVksTUFBTSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDdEMsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFO0lBQ3ZDLFlBQVksSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxzQkFBc0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4RSxTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ2hDLFlBQVksTUFBTSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxLQUFLO0lBQ3hFLGdCQUFnQixJQUFJLE9BQU8sRUFBRTtJQUM3QixvQkFBb0IsWUFBWSxHQUFHLE1BQU0sQ0FBQztJQUMxQyxpQkFBaUI7SUFDakIsYUFBYSxDQUFDLENBQUM7SUFDZixTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLHdCQUF3QixFQUFFO0lBQzNDLFlBQVksTUFBTSxFQUFFLENBQUM7SUFDckIsU0FBUztBQUNUO0lBQ0E7SUFDQSxRQUFRLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUM5QixRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN2RCxZQUFZLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsWUFBWSxJQUFJLFdBQVcsS0FBSyxFQUFFLEVBQUU7SUFDcEMsZ0JBQWdCLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7SUFDcEQsb0JBQW9CLFdBQVcsR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDO0lBQ3BELGlCQUFpQjtBQUNqQjtJQUNBLGdCQUFnQixZQUFZLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDbkUsYUFBYTtJQUNiLFNBQVM7SUFDVCxRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO0FBQ3JDO0lBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUN0QyxZQUFZLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQ3RDLFlBQVksSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7SUFDM0QsWUFBWSxJQUFJLGVBQWUsS0FBSyxHQUFHLEVBQUU7SUFDekMsZ0JBQWdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMvRCxvQkFBb0IsSUFBSSxlQUFlLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUU7SUFDckcsd0JBQXdCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1RCx3QkFBd0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDakQsd0JBQXdCLE1BQU07SUFDOUIscUJBQXFCO0lBQ3JCLGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtJQUNwQztJQUNBLGdCQUFnQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUN0QyxnQkFBZ0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDdEMsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ3hDLGdCQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDaEQsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUMvQyxnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzlDLGdCQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7SUFDaEQsZ0JBQWdCLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO0lBQzlDLGFBQWE7SUFDYixTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtJQUMvQixZQUFZLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlDO0lBQ0E7SUFDQSxZQUFZLElBQUksQ0FBQyxFQUFFO0lBQ25CLGdCQUFnQixJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDaEMsb0JBQW9CLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQzFDLG9CQUFvQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQyxvQkFBb0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDN0Msb0JBQW9CLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUNyRCxvQkFBb0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQ3BELG9CQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDbkQsb0JBQW9CLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztJQUNwRCxvQkFBb0IsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7SUFDbEQsaUJBQWlCO0lBQ2pCLHFCQUFxQjtJQUNyQixvQkFBb0IsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFO0lBQ25DLHdCQUF3QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUM3Qyx3QkFBd0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQ3pELHdCQUF3QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDeEQsd0JBQXdCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUN2RCx3QkFBd0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0lBQ3hELHdCQUF3QixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztJQUN6RCxxQkFBcUI7SUFDckIseUJBQXlCO0lBQ3pCLHdCQUF3QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUNoRCx3QkFBd0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDOUMsd0JBQXdCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzlDLHdCQUF3QixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDeEQsd0JBQXdCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUN2RCx3QkFBd0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3RELHdCQUF3QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUM7SUFDL0Usd0JBQXdCLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtJQUN4Qyw0QkFBNEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDcEQsNEJBQTRCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0lBQ3RELDRCQUE0QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDOUQsNEJBQTRCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ3BELDRCQUE0QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7SUFDekQsNEJBQTRCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQ3JELHlCQUF5QjtJQUN6QixxQkFBcUI7SUFDckIsb0JBQW9CLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQzVDO0lBQ0Esb0JBQW9CLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0lBQzdEO0lBQ0Esd0JBQXdCLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO0lBQ3JELDRCQUE0QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUNyRCw0QkFBNEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ2pELHlCQUF5QjtJQUN6Qiw2QkFBNkI7SUFDN0IsNEJBQTRCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ3BELHlCQUF5QjtJQUN6QixxQkFBcUI7SUFDckIsaUJBQWlCO0FBQ2pCO0lBQ0EsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ3BFLG9CQUFvQixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNwSSxvQkFBb0IsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNoRSxvQkFBb0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQ3pELG9CQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQzdELG9CQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDO0lBQ3pFLG9CQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDO0lBQ3ZFLG9CQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDO0lBQ3JFLG9CQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQztJQUNuRyxvQkFBb0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUM7SUFDbkUsb0JBQW9CLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDO0FBQ3JFO0lBQ0Esb0JBQW9CLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7SUFDaEgsd0JBQXdCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQzdDLHdCQUF3QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMvQyx3QkFBd0IsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7SUFDekQscUJBQXFCO0FBQ3JCO0lBQ0Esb0JBQW9CLElBQUksUUFBUSxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssV0FBVyxFQUFFO0lBQ3BFLHdCQUF3QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0RSxxQkFBcUI7QUFDckI7SUFDQTtJQUNBLG9CQUFvQixJQUFJLFFBQVEsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFdBQVcsRUFBRTtJQUNwRSx3QkFBd0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUM7QUFDbEU7SUFDQTtJQUNBLHdCQUF3QixJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUNoRCw0QkFBNEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztJQUN2RCw0QkFBNEIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDdkQseUJBQXlCO0lBQ3pCLHFCQUFxQjtBQUNyQjtJQUNBLG9CQUFvQixJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUM1Qyx3QkFBd0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLG1CQUFtQixFQUFFLElBQUksYUFBYSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7SUFDbEcscUJBQXFCO0FBQ3JCO0lBQ0Esb0JBQW9CLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxvQkFBb0IsRUFBRSxJQUFJLGFBQWEsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ2hHO0lBQ0Esb0JBQW9CLElBQUksUUFBUSxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssV0FBVyxFQUFFO0lBQ3ZFO0lBQ0Esd0JBQXdCLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxFQUFFLEVBQUU7SUFDckQsNEJBQTRCLElBQUksQ0FBQyxXQUFXLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQztJQUNwRSx5QkFBeUI7SUFDekIsd0JBQXdCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQ2pELHFCQUFxQjtBQUNyQjtJQUNBLG9CQUFvQixJQUFJLFFBQVEsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFdBQVcsRUFBRTtJQUNwRSx3QkFBd0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDO0lBQ3pELHFCQUFxQjtBQUNyQjtJQUNBLG9CQUFvQixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztJQUNyRCxpQkFBaUI7SUFDakIscUJBQXFCO0lBQ3JCLG9CQUFvQixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUN2QyxvQkFBb0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLGlCQUFpQjtBQUNqQjtJQUNBLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtJQUNuQyxvQkFBb0IsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDNUMsaUJBQWlCO0FBQ2pCO0lBQ0EsZ0JBQWdCLElBQUksSUFBSSxDQUFDLHdCQUF3QixFQUFFO0lBQ25ELG9CQUFvQixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsaUJBQWlCO0FBQ2pCO0lBQ0EsZ0JBQWdCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hFLGdCQUFnQixJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoRztJQUNBLGdCQUFnQixJQUFJLENBQUMsc0JBQXNCO0lBQzNDLG9CQUFvQixJQUFJLENBQUMsbUJBQW1CO0lBQzVDLG9CQUFvQixJQUFJLENBQUMsd0JBQXdCO0lBQ2pELG9CQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVc7SUFDNUMsb0JBQW9CLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVTtJQUMzQyxvQkFBb0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTO0lBQzFDLGlCQUFpQixDQUFDO0lBQ2xCLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFO0lBQ3JDLG9CQUFvQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDMUMsb0JBQW9CLE9BQU87SUFDM0IsaUJBQWlCO0lBQ2pCLHFCQUFxQjtJQUNyQixvQkFBb0IsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7SUFDakQsd0JBQXdCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM3Qyx3QkFBd0IsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtJQUN4RCw0QkFBNEIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDdkQseUJBQXlCO0lBQ3pCLHFCQUFxQjtJQUNyQix5QkFBeUI7SUFDekIsd0JBQXdCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ2hELHFCQUFxQjtBQUNyQjtJQUNBLGlCQUFpQjtJQUNqQixhQUFhO0FBQ2I7SUFDQTtJQUNBO0lBQ0EsWUFBWTtJQUNaLGdCQUFnQixJQUFJLENBQUMsU0FBUztJQUM5QixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztJQUNoRyxjQUFjO0lBQ2QsZ0JBQWdCLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztJQUMzQyxnQkFBZ0IsSUFBSTtJQUNwQixvQkFBb0IsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRTtJQUM3Qyx3QkFBd0IsY0FBYyxHQUFHLElBQUksQ0FBQztJQUM5QyxxQkFBcUI7SUFDckIsaUJBQWlCLENBQUMsT0FBTyxLQUFLLEVBQUUsR0FBRztBQUNuQztJQUNBLGdCQUFnQixJQUFJLGNBQWMsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ3RGLG9CQUFvQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMzQyxvQkFBb0IsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFlBQVksR0FBRyxRQUFRLENBQUM7SUFDdkUsaUJBQWlCO0lBQ2pCLHFCQUFxQjtJQUNyQjtJQUNBLG9CQUFvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ2pGLHdCQUF3QixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RSx3QkFBd0IsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO0lBQ3JGLDRCQUE0QixVQUFVLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUM7SUFDMUYseUJBQXlCO0lBQ3pCLHFCQUFxQjtBQUNyQjtJQUNBO0lBQ0Esb0JBQW9CLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQ2hELGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsU0FBUztBQUNUO0FBQ0E7SUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUMzQixNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsWUFBWTtJQUNuQyxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUN4QjtJQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7SUFDbEMsWUFBWSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsU0FBUztBQUNUO0lBQ0E7SUFDQSxRQUFRLElBQUksYUFBYSxHQUFHLElBQUlBLFNBQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRTtJQUMzRDtJQUNBLFlBQVksU0FBUyxXQUFXLEdBQUc7SUFDbkMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtJQUN0QyxvQkFBb0IsT0FBTyxFQUFFLENBQUM7SUFDOUIsb0JBQW9CLE9BQU87SUFDM0IsaUJBQWlCO0lBQ2pCLGdCQUFnQixVQUFVLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzVDLGFBQWE7QUFDYjtJQUNBLFlBQVksV0FBVyxFQUFFLENBQUM7SUFDMUIsU0FBUyxDQUFDLENBQUM7QUFDWDtJQUNBLFFBQVEsSUFBSSxVQUFVLEdBQUcsSUFBSUEsU0FBTyxDQUFDLFVBQVUsT0FBTyxFQUFFO0lBQ3hELFlBQVksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZTtJQUMzRCxZQUFZO0lBQ1osZ0JBQWdCLE9BQU8sRUFBRSxDQUFDO0lBQzFCLGdCQUFnQixPQUFPO0lBQ3ZCLGFBQWE7QUFDYjtJQUNBLFlBQVksSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxrQ0FBa0MsQ0FBQztBQUM1RTtJQUNBLFlBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLFlBQVk7SUFDMUQsZ0JBQWdCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUMzRCxnQkFBZ0IsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7SUFDNUMsZ0JBQWdCLE9BQU8sRUFBRSxDQUFDO0lBQzFCLGFBQWEsQ0FBQyxDQUFDO0lBQ2YsU0FBUyxDQUFDLENBQUM7QUFDWDtJQUNBO0lBQ0EsUUFBUSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDM0I7SUFDQSxRQUFRLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUMvQjtJQUNBO0lBQ0EsUUFBUSxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsZUFBZSxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDMUc7SUFDQSxRQUFRQSxTQUFPLENBQUMsR0FBRyxDQUFDO0lBQ3BCO0lBQ0EsWUFBWUEsU0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsRUFBRSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbkYsaUJBQWlCLElBQUksQ0FBQyxVQUFVO0lBQ2hDLG9CQUFvQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUM1QyxpQkFBaUIsQ0FBQztJQUNsQjtJQUNBLFlBQVlBLFNBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2hGO0lBQ0EsWUFBWSxhQUFhO0lBQ3pCLFNBQVMsQ0FBQztJQUNWLGFBQWEsSUFBSSxDQUFDLFlBQVk7SUFDOUIsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0lBQ3JELG9CQUFvQixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM5QyxvQkFBb0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JDLG9CQUFvQixPQUFPLGVBQWUsQ0FBQztJQUMzQyxpQkFBaUI7QUFDakI7SUFDQTtJQUNBLGdCQUFnQixRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwRjtJQUNBLGdCQUFnQixNQUFNLENBQUMsbUJBQW1CLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hGLGdCQUFnQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQztJQUNBLGdCQUFnQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtJQUNwQyxvQkFBb0IsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9FLGlCQUFpQjtJQUNqQixxQkFBcUI7SUFDckIsb0JBQW9CLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN6QyxpQkFBaUI7QUFDakI7SUFDQSxnQkFBZ0IsT0FBTyxlQUFlLENBQUM7SUFDdkMsYUFBYSxFQUFDO0lBQ2QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsWUFBWTtJQUN4QyxRQUFRLE1BQU0sQ0FBQyxhQUFhLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO0lBQzFELFFBQVEsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDbEYsUUFBUSxNQUFNLENBQUMsYUFBYSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDcEQsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxPQUFPLEVBQUU7SUFDakQsUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEVBQUU7SUFDL0QsWUFBWSxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUMvQyxnQkFBZ0IsSUFBSSxXQUFXLEdBQUcsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDMUcsZ0JBQWdCLElBQUk7SUFDcEIsb0JBQW9CLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDNUQsb0JBQW9CLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRTtJQUMzQyx3QkFBd0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzNFLDRCQUE0QixJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO0lBQzFGLGdDQUFnQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZILDZCQUE2QjtJQUM3Qix5QkFBeUI7SUFDekIscUJBQXFCO0lBQ3JCLGlCQUFpQjtJQUNqQixnQkFBZ0IsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLGdFQUFnRSxHQUFHLE9BQU8sRUFBQyxFQUFFO0lBQ3RILGFBQWE7SUFDYixTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLHVCQUF1QixHQUFHLDhDQUE4QyxDQUFDO0FBQ2pGO0lBQ0EsSUFBSSxTQUFTLHVCQUF1QixDQUFDLE1BQU0sRUFBRTtJQUM3QyxRQUFRLE9BQU8sTUFBTSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sS0FBSyxRQUFRLEtBQUssdUJBQXVCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzlKLEtBQUs7QUFDTDtJQUNBLElBQUksSUFBSSxvQkFBb0IsR0FBRyw0Q0FBNEMsQ0FBQztBQUM1RTtJQUNBLElBQUksU0FBUyxhQUFhLENBQUMsTUFBTSxFQUFFO0lBQ25DLFFBQVEsT0FBTyxNQUFNLENBQUMsT0FBTyxLQUFLLEdBQUcsSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hGLEtBQUs7QUFDTDtJQUNBLElBQUksU0FBUyxrQkFBa0IsR0FBRztJQUNsQyxRQUFRLElBQUk7SUFDWixZQUFZLElBQUksR0FBRyxHQUFHLGdCQUFlO0lBQ3JDLFlBQVksWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0MsWUFBWSxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLFlBQVksT0FBTyxJQUFJLENBQUM7SUFDeEIsU0FBUyxDQUFDLE9BQU8sTUFBTSxFQUFFO0lBQ3pCLFlBQVksT0FBTyxLQUFLLENBQUM7SUFDekIsU0FBUztJQUNULEtBQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLG9CQUFvQixHQUFHLFVBQVUsS0FBSyxFQUFFO0lBQ2pELFFBQVE7SUFDUixZQUFZLENBQUMsT0FBTyxNQUFNLENBQUMsYUFBYSxLQUFLLFFBQVE7SUFDckQsWUFBWSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVztJQUM3QyxhQUFhLE9BQU8sTUFBTSxDQUFDLG1CQUFtQixLQUFLLFFBQVEsQ0FBQztJQUM1RCxhQUFhLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDO0lBQ25FLFlBQVksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLGdCQUFnQjtJQUNsRCxVQUFVO0lBQ1YsWUFBWSxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3RDO0lBQ0EsWUFBWSxPQUFPLE1BQU0sRUFBRTtJQUMzQixnQkFBZ0IsSUFBSSx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsRUFBRTtJQUNyRCxvQkFBb0IsTUFBTTtJQUMxQixpQkFBaUIsTUFBTTtJQUN2QixvQkFBb0IsTUFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDL0MsaUJBQWlCO0lBQ2pCLGFBQWE7QUFDYjtJQUNBLFlBQVksSUFBSSxDQUFDLE1BQU0sRUFBRTtJQUN6QixnQkFBZ0IsT0FBTztJQUN2QixhQUFhO0FBQ2I7SUFDQSxZQUFZLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNoQztJQUNBLFlBQVksT0FBTyxNQUFNLEVBQUU7SUFDM0IsZ0JBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLDZCQUE2QixDQUFDLEVBQUU7SUFDN0ksb0JBQW9CLE9BQU87SUFDM0IsaUJBQWlCO0lBQ2pCLGdCQUFnQixNQUFNLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUMzQyxhQUFhO0FBQ2I7SUFDQSxZQUFZLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQyxFQUFFO0lBQ3ZDLGdCQUFnQixPQUFPO0lBQ3ZCLGFBQWE7QUFDYjtJQUNBLFlBQVksSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksS0FBSyxRQUFRLElBQUksU0FBUyxDQUFDLG9CQUFvQixLQUFLLElBQUksRUFBRTtJQUMzRyxnQkFBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwRixnQkFBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM1QyxnQkFBZ0IsTUFBTSxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDbkUsYUFBYSxNQUFNO0lBQ25CLGdCQUFnQixNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEYsYUFBYTtBQUNiO0lBQ0E7SUFDQSxZQUFZLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuRztJQUNBLFlBQVksSUFBSSxDQUFDLE9BQU8sTUFBTSxDQUFDLFdBQVcsS0FBSyxRQUFRLE1BQU0sT0FBTyxNQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixLQUFLLFVBQVUsQ0FBQyxFQUFFO0lBQ3pILGdCQUFnQixJQUFJLENBQUMseUJBQXlCLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDeEcsYUFBYTtBQUNiO0lBQ0EsWUFBWSxVQUFVLENBQUMsWUFBWTtJQUNuQyxnQkFBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JCO0lBQ0EsWUFBWSxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7SUFDL0IsZ0JBQWdCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN4QyxhQUFhO0FBQ2I7SUFDQSxZQUFZLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNuQyxTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsYUFBYSxHQUFHLFlBQVk7SUFDckMsUUFBUSxJQUFJLFFBQVEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLFFBQVEsRUFBRTtJQUN4RCxZQUFZLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUMvQyxTQUFTO0FBQ1Q7SUFDQSxRQUFRLFVBQVUsQ0FBQyxZQUFZO0FBQy9CO0lBQ0EsWUFBWSxJQUFJLFFBQVEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLFFBQVEsRUFBRTtJQUM1RCxnQkFBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNwRCxhQUFhO0FBQ2I7SUFDQTtJQUNBLFlBQVksSUFBSSxDQUFDLFFBQVEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssV0FBVyxNQUFNLFFBQVEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixDQUFDLEtBQUssVUFBVSxDQUFDLEVBQUU7SUFDOUksZ0JBQWdCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzlELGFBQWE7QUFDYjtJQUNBLFlBQVksSUFBSSxRQUFRLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLFFBQVEsRUFBRTtJQUNsRSxnQkFBZ0IsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDaEUsYUFBYTtJQUNiLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqQixLQUFLLENBQUM7QUFDTjtJQUNBLElBQUksSUFBSSxDQUFDLHVCQUF1QixHQUFHLENBQUMsQ0FBQztJQUNyQyxJQUFJLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxDQUFDLENBQUM7QUFDdkM7SUFDQSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLFFBQVEsRUFBRTtBQUNoRDtJQUNBLFFBQVEsSUFBSSxDQUFDLHVCQUF1QixJQUFJLENBQUMsQ0FBQztJQUMxQyxRQUFRLElBQUksOEJBQThCLEdBQUcsQ0FBQyxDQUFDO0FBQy9DO0lBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxNQUFNLENBQUMsV0FBVyxLQUFLLFFBQVEsTUFBTSxPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEtBQUssVUFBVSxDQUFDLEVBQUU7SUFDckgsWUFBWSw4QkFBOEIsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUNwRyxTQUFTO0lBQ1QsYUFBYTtJQUNiLFlBQVksSUFBSSxDQUFDLHlCQUF5QixHQUFHLENBQUMsQ0FBQztJQUMvQyxTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLEtBQUssOEJBQThCLE1BQU0sSUFBSSxDQUFDLHVCQUF1QixHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ3ZILFlBQVksSUFBSSxDQUFDLHlCQUF5QixHQUFHLDhCQUE4QixDQUFDO0lBQzVFLFlBQVksVUFBVSxDQUFDLFlBQVk7SUFDbkMsZ0JBQWdCLE1BQU0sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3JCLFNBQVM7SUFDVCxhQUFhO0lBQ2IsWUFBWSxJQUFJLENBQUMsdUJBQXVCLEdBQUcsQ0FBQyxDQUFDO0lBQzdDLFlBQVksSUFBSSxDQUFDLHlCQUF5QixHQUFHLENBQUMsQ0FBQztBQUMvQztJQUNBLFlBQVksSUFBSSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO0lBQzlDLGdCQUFnQixNQUFNLEVBQUUsTUFBTTtJQUM5QixnQkFBZ0IsU0FBUyxFQUFFLElBQUk7SUFDL0IsZ0JBQWdCLFlBQVksRUFBRSxJQUFJO0lBQ2xDLGFBQWEsQ0FBQyxDQUFDO0lBQ2YsWUFBWSxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hDLFNBQVM7SUFDVCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWTtJQUNyQyxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztJQUN4QixRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO0lBQzVCLFlBQVksVUFBVSxDQUFDLFlBQVk7SUFDbkMsZ0JBQWdCLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDckQsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLFNBQVM7SUFDVCxhQUFhO0lBQ2IsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtJQUM5QixnQkFBZ0Isc0JBQXNCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3RCxnQkFBZ0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkUsZ0JBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ2xFLGdCQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMxQyxnQkFBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ2pFLGdCQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEUsZ0JBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxnQkFBZ0IsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZEO0lBQ0EsZ0JBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFlBQVk7SUFDakUsb0JBQW9CLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUMzQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMxQixnQkFBZ0IsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFVLEtBQUssRUFBRTtJQUNwRTtJQUNBO0lBQ0E7SUFDQTtJQUNBLG9CQUFvQixHQUFHLEtBQUssQ0FBQyxNQUFNLEtBQUssRUFBRSxFQUFFO0lBQzVDLHdCQUF3QixNQUFNO0lBQzlCLHFCQUFxQjtBQUNyQjtJQUNBLG9CQUFvQixHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7SUFDMUQsd0JBQXdCLE9BQU8sQ0FBQyxJQUFJLENBQUMseUNBQXlDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlGLHdCQUF3QixPQUFPO0lBQy9CLHFCQUFxQjtBQUNyQjtJQUNBLG9CQUFvQixJQUFJLENBQUMsOEJBQThCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0QsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDMUIsYUFBYTtBQUNiO0lBQ0EsWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO0lBQ2xEO0lBQ0EsZ0JBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcscUJBQXFCLENBQUM7SUFDbkU7SUFDQTtJQUNBLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ3hDLGFBQWE7SUFDYixTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLFlBQVk7SUFDdkMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxhQUFhLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLElBQUksSUFBSSxLQUFLLE9BQU8sTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsYUFBYSxLQUFLLFdBQVcsQ0FBQyxFQUFFO0lBQy9JLFlBQVksSUFBSSxPQUFPLEdBQUc7SUFDMUIsZ0JBQWdCLE1BQU0sRUFBRSxLQUFLO0lBQzdCLGdCQUFnQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7SUFDakQsYUFBYSxDQUFDO0FBQ2Q7SUFDQSxZQUFZLElBQUk7SUFDaEI7SUFDQSxnQkFBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pGLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTtJQUN4QixnQkFBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ3hELGFBQWE7SUFDYixTQUFTLE1BQU07SUFDZixZQUFZLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUNwRCxTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsOEJBQThCLEdBQUcsVUFBVSxLQUFLLEVBQUU7SUFDM0QsUUFBUSxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxFQUFFO0lBQ2pGLFlBQVksT0FBTztJQUNuQixTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUk7SUFDWixZQUFZLElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDN0M7SUFDQSxZQUFZLElBQUksT0FBTyxlQUFlLEtBQUssUUFBUSxFQUFFO0lBQ3JELGdCQUFnQixJQUFJLGVBQWUsS0FBSyxTQUFTLEVBQUU7SUFDbkQsb0JBQW9CLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7SUFDL0Msb0JBQW9CLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUM1RCxvQkFBb0IsT0FBTztJQUMzQixpQkFBaUI7QUFDakI7SUFDQSxnQkFBZ0IsZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDOUQsYUFBYTtBQUNiO0lBQ0E7SUFDQSxZQUFZLElBQUksZUFBZSxDQUFDLEtBQUssRUFBRTtJQUN2QyxnQkFBZ0IsZUFBZSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUM7SUFDeEQsYUFBYTtBQUNiO0lBQ0EsWUFBWSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZUFBZSxDQUFDLFlBQVksQ0FBQztBQUNqRTtJQUNBLFlBQVksSUFBSSxlQUFlLENBQUMsV0FBVyxFQUFFO0lBQzdDLGdCQUFnQixJQUFJLENBQUMsV0FBVyxHQUFHLGVBQWUsQ0FBQyxXQUFXLENBQUM7QUFDL0Q7SUFDQTtJQUNBLGdCQUFnQixJQUFJLGVBQWUsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFO0lBQ3JELG9CQUFvQixJQUFJLFlBQVksR0FBRyxlQUFlLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQztBQUNoRjtJQUNBLG9CQUFvQixJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7SUFDcEQ7SUFDQSx3QkFBd0IsWUFBWSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7SUFDL0YscUJBQXFCO0FBQ3JCO0lBQ0E7SUFDQSxvQkFBb0IsSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFO0lBQzVDLHdCQUF3QixJQUFJLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BJO0lBQ0Esd0JBQXdCLElBQUksVUFBVSxHQUFHLElBQUksSUFBSSxFQUFFLEVBQUU7SUFDckQsNEJBQTRCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUNuRCw0QkFBNEIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDdkQsNEJBQTRCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4Qyw0QkFBNEIsT0FBTztJQUNuQyx5QkFBeUI7SUFDekIscUJBQXFCO0lBQ3JCLGlCQUFpQjtJQUNqQixhQUFhLE1BQU07SUFDbkIsZ0JBQWdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7SUFDM0MsYUFBYTtJQUNiLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtJQUNwQjtJQUNBLFNBQVM7QUFDVDtJQUNBLFFBQVEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ2hELE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLG1CQUFtQixHQUFHLFlBQVk7SUFDM0M7SUFDQSxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztJQUN4QixRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxFQUFFLEVBQUU7SUFDekUsWUFBWSxJQUFJLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztJQUNoRCxZQUFZLFVBQVUsQ0FBQyxXQUFXO0lBQ2xDLGdCQUFnQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUMzQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbkIsWUFBWSxPQUFPO0lBQ25CLFNBQVMsTUFBTTtJQUNmLFlBQVksSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDcEMsWUFBWSxJQUFJLENBQUMsNEJBQTRCLEdBQUcsQ0FBQyxDQUFDO0lBQ2xELFNBQVM7QUFDVDtJQUNBO0lBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7SUFDbkUsWUFBWSxJQUFJLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDeEMsWUFBWSxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyRSxZQUFZLElBQUksT0FBTyxHQUFHLFdBQVcsQ0FBQztJQUN0QyxZQUFZLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7SUFDbkQsZ0JBQWdCLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQy9DLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsZ0JBQWdCLE9BQU8sR0FBRyxNQUFNLEdBQUcsT0FBTyxDQUFDO0lBQzNDLGFBQWE7SUFDYixZQUFZLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ25FLGdCQUFnQixJQUFJLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxPQUFPLEtBQUssSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDMUcsb0JBQW9CLGVBQWUsR0FBRyxJQUFJLENBQUM7SUFDM0Msb0JBQW9CLE1BQU07SUFDMUIsaUJBQWlCO0lBQ2pCLGFBQWE7SUFDYixZQUFZLElBQUksZUFBZSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDaEQ7SUFDQSxnQkFBZ0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDMUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLEVBQUU7SUFDOUM7SUFDQSxvQkFBb0IsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7SUFDcEYsd0JBQXdCLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO0lBQzVELHdCQUF3QixPQUFPO0lBQy9CLHFCQUFxQjtBQUNyQjtJQUNBLG9CQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDckQsb0JBQW9CLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUNwRCxvQkFBb0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ25EO0lBQ0Esb0JBQW9CLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ3JFLHdCQUF3QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFDdEUscUJBQXFCO0lBQ3JCLG9CQUFvQixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFO0lBQy9DLHdCQUF3QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFDdkUscUJBQXFCO0lBQ3JCLG9CQUFvQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0lBQ3JELG9CQUFvQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwSSxvQkFBb0IsT0FBTztJQUMzQixpQkFBaUI7SUFDakIscUJBQXFCO0lBQ3JCLG9CQUFvQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUMvQyxvQkFBb0IsSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUM7SUFDeEQsb0JBQW9CLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQyxvQkFBb0IsT0FBTztJQUMzQixpQkFBaUI7SUFDakIsYUFBYTtJQUNiLFNBQVM7SUFDVCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxZQUFZO0lBQzNDLFFBQVEsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLGdEQUFnRCxDQUFDO0lBQ3ZGLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQ3pDLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQ3hDLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3ZDLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ25DLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDakMsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztJQUMvQixRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQzlCLE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsVUFBVSxFQUFFLGFBQWEsRUFBRTtJQUNqRSxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ3BELFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDeEQsZ0JBQWdCLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztJQUN6QyxnQkFBZ0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDdkUsb0JBQW9CLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNwRSx3QkFBd0IsWUFBWSxHQUFHLElBQUksQ0FBQztJQUM1Qyx3QkFBd0IsTUFBTTtJQUM5QixxQkFBcUI7SUFDckIsaUJBQWlCO0lBQ2pCLGdCQUFnQixJQUFJLENBQUMsWUFBWSxFQUFFO0lBQ25DLG9CQUFvQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlELGlCQUFpQjtJQUNqQixhQUFhO0FBQ2I7SUFDQTtJQUNBLFlBQVksSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckUsWUFBWSxJQUFJLE9BQU8sR0FBRyxXQUFXLENBQUM7SUFDdEMsWUFBWSxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQ25ELGdCQUFnQixPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxhQUFhO0lBQ2IsaUJBQWlCO0lBQ2pCLGdCQUFnQixPQUFPLEdBQUcsTUFBTSxHQUFHLE9BQU8sQ0FBQztJQUMzQyxhQUFhO0lBQ2IsWUFBWSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksRUFBRTtJQUNqRixnQkFBZ0IsT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksS0FBSyxPQUFPLENBQUM7SUFDaEUsYUFBYSxDQUFDLENBQUM7QUFDZjtJQUNBO0lBQ0EsWUFBWSxJQUFJLGFBQWEsSUFBSSxNQUFNLENBQUMsYUFBYSxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUU7SUFDM0ksZ0JBQWdCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQ3pDLGFBQWE7SUFDYixTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLFlBQVk7SUFDdkMsUUFBUSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQ25DLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDaEMsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUU7SUFDdEQsWUFBWSxJQUFJLE9BQU8sR0FBRztJQUMxQixnQkFBZ0IsTUFBTSxFQUFFLFFBQVE7SUFDaEMsZ0JBQWdCLEtBQUssRUFBRSxFQUFFO0lBQ3pCLGdCQUFnQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7SUFDakQsYUFBYSxDQUFDO0lBQ2QsWUFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyRSxTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsNEJBQTRCLEdBQUcsWUFBWTtJQUNwRCxRQUFRLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO0lBQ25DLFFBQVEsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDakUsUUFBUSxJQUFJLE9BQU8sR0FBRyxXQUFXLENBQUM7SUFDbEMsUUFBUSxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQy9DLFlBQVksT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0MsU0FBUztJQUNULGFBQWE7SUFDYixZQUFZLE9BQU8sR0FBRyxNQUFNLEdBQUcsT0FBTyxDQUFDO0lBQ3ZDLFNBQVM7QUFDVDtJQUNBO0lBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQzlDLFlBQVksSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUU7SUFDakYsZ0JBQWdCLFFBQVEsQ0FBQyxJQUFJLEtBQUssV0FBVyxNQUFNLElBQUksS0FBSyxPQUFPLENBQUMsQ0FBQztJQUNyRSxhQUFhLENBQUMsQ0FBQztJQUNmLFNBQVM7QUFDVDtJQUNBO0lBQ0EsUUFBUSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUNqQyxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxVQUFVLFlBQVksRUFBRTtJQUN2RDtJQUNBLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFO0lBQ25FLFlBQVksT0FBTztJQUNuQixTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxlQUFlLElBQUksRUFBRSxHQUFHLFlBQVksQ0FBQztBQUMvRjtJQUNBLFFBQVEsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN0QyxRQUFRLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDeEMsUUFBUSxJQUFJLFNBQVMsSUFBSSxJQUFJLEVBQUU7SUFDL0IsWUFBWSxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUNuQyxTQUFTO0lBQ1QsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQzFELFlBQVksSUFBSSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLFdBQVcsRUFBRTtJQUNoRSxnQkFBZ0IsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0lBQ25ELGFBQWE7SUFDYixZQUFZLElBQUksT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsS0FBSyxXQUFXLEVBQUU7SUFDN0QsZ0JBQWdCLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNELGFBQWE7SUFDYixTQUFTO0lBQ1QsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHO0lBQzNCLFlBQVksTUFBTSxFQUFFLFFBQVE7SUFDNUIsWUFBWSxHQUFHLEVBQUUsU0FBUyxDQUFDLE9BQU8sRUFBRTtJQUNwQyxZQUFZLFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZTtJQUM5QyxZQUFZLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVc7SUFDakQsWUFBWSxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVO0lBQy9DLFlBQVksU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUztJQUM3QyxTQUFTLENBQUM7SUFDVixRQUFRLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDeEQ7SUFDQSxZQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUMxRCxZQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUMzRCxTQUFTO0lBQ1QsUUFBUSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUNqQyxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxZQUFZO0lBQ3pDLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0lBQ3pCLFlBQVksSUFBSTtJQUNoQixnQkFBZ0IsSUFBSSxPQUFPLEdBQUc7SUFDOUIsb0JBQW9CLE1BQU0sRUFBRSxLQUFLO0lBQ2pDLG9CQUFvQixLQUFLLEVBQUU7SUFDM0Isd0JBQXdCLFlBQVksRUFBRSxJQUFJLENBQUMsZ0JBQWdCO0lBQzNELHdCQUF3QixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7SUFDckQsd0JBQXdCLFlBQVksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZO0lBQy9HLHdCQUF3QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7SUFDekQscUJBQXFCO0lBQ3JCLG9CQUFvQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUU7SUFDckQsaUJBQWlCLENBQUM7SUFDbEIsZ0JBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pFLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRTtJQUN4QjtJQUNBLGFBQWE7SUFDYixTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsWUFBWTtJQUM5QyxRQUFRLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7SUFDeEQsWUFBWSxVQUFVLENBQUMsWUFBWTtJQUNuQyxnQkFBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQzlELGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNuQixTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsVUFBVSxFQUFFO0lBQy9DLFFBQVEsT0FBTyxjQUFjLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQztJQUNuRCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsWUFBWTtJQUNsQyxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztJQUN4QixRQUFRLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUM5QixRQUFRLElBQUksaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQ25DO0lBQ0EsUUFBUSxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUQsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNqRCxZQUFZLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4QyxZQUFZO0lBQ1osZ0JBQWdCLFVBQVUsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUM7SUFDN0QsZ0JBQWdCLFVBQVUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO0lBQy9DLGlCQUFpQixVQUFVLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLFlBQVksQ0FBQztJQUNoRixpQkFBaUIsVUFBVSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLFFBQVEsQ0FBQztJQUMxRixpQkFBaUIsT0FBTyxVQUFVLENBQUMsZ0JBQWdCLEtBQUssV0FBVyxDQUFDO0lBQ3BFLGNBQWM7SUFDZCxnQkFBZ0IsSUFBSSxVQUFVLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0lBQ3RELG9CQUFvQixVQUFVLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hELG9CQUFvQixpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdkQsaUJBQWlCO0lBQ2pCLHFCQUFxQjtJQUNyQixvQkFBb0IsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRCxpQkFBaUI7SUFDakI7SUFDQTtJQUNBLGdCQUFnQixVQUFVLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0lBQ2hELGFBQWE7SUFDYixTQUFTO0FBQ1Q7SUFDQTtJQUNBLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMzRCxZQUFZLFlBQVksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRCxTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDekM7SUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEMsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsUUFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLFFBQVEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNuQyxRQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbEM7SUFDQSxRQUFRLElBQUksT0FBTyxNQUFNLENBQUMsMkJBQTJCLEtBQUssV0FBVyxFQUFFO0lBQ3ZFLFlBQVksTUFBTSxDQUFDLDJCQUEyQixHQUFHLENBQUMsQ0FBQztJQUNuRCxZQUFZLElBQUksS0FBSyxDQUFDO0lBQ3RCLFlBQVksSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRTtJQUNyRCxnQkFBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN0RCxhQUFhO0lBQ2IsWUFBWSxJQUFJLE9BQU8sTUFBTSxDQUFDLGdDQUFnQyxLQUFLLFVBQVUsRUFBRTtJQUMvRSxnQkFBZ0IsTUFBTSxDQUFDLGdDQUFnQyxFQUFFLENBQUM7SUFDMUQsYUFBYTtJQUNiLGlCQUFpQixJQUFJLE9BQU8sTUFBTSxDQUFDLG9DQUFvQyxLQUFLLFVBQVUsRUFBRTtJQUN4RixnQkFBZ0IsTUFBTSxDQUFDLG9DQUFvQyxFQUFFLENBQUM7SUFDOUQsYUFBYTtBQUNiO0lBQ0EsWUFBWSxLQUFLLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsRCxZQUFZLEtBQUssQ0FBQyxTQUFTLENBQUMseUJBQXlCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25FLFlBQVksTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QztJQUNBLFlBQVksS0FBSyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEQsWUFBWSxLQUFLLENBQUMsU0FBUyxDQUFDLDZCQUE2QixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2RSxZQUFZLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsU0FBUztJQUNULE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLFlBQVksRUFBRTtJQUNqRCxRQUFRLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2xELE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLE9BQU8sRUFBRTtJQUN6QyxRQUFRLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqRSxRQUFRLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBRWxDO0lBQ0EsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNyRCxZQUFZLElBQUksY0FBYyxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRCxZQUFZO0lBQ1osZ0JBQWdCLGNBQWMsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUM7SUFDakUsaUJBQWlCLGNBQWMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksY0FBYyxDQUFDLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ2hILGlCQUFpQixjQUFjLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssUUFBUSxDQUFDO0lBQzlGLGNBQWM7SUFDZCxnQkFBZ0IsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3RELGFBQWE7SUFDYixTQUFTO0lBQ1QsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzFELFlBQVksSUFBSSx1QkFBdUIsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RCxZQUFZLElBQUksZ0JBQWdCLEdBQUcsdUJBQXVCLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZILFlBQVksSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ2xDLFlBQVksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUM5RCxnQkFBZ0IsSUFBSSxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzdGO0lBQ0EsZ0JBQWdCLElBQUksVUFBVSxLQUFLLGFBQWEsRUFBRTtJQUNsRCxvQkFBb0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRSxpQ0FBaUMsQ0FBQyxDQUFDO0lBQzlGLG9CQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFO0lBQ25FLHdCQUF3QixVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQzNDLHFCQUFxQjtJQUNyQixpQkFBaUI7QUFDakI7SUFDQSxnQkFBZ0IsSUFBSSxVQUFVLEtBQUssWUFBWSxFQUFFO0lBQ2pELG9CQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLHVCQUF1QixFQUFFLGdDQUFnQyxDQUFDLENBQUM7SUFDN0Ysb0JBQW9CLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7SUFDbEUsd0JBQXdCLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDM0MscUJBQXFCO0lBQ3JCLGlCQUFpQjtBQUNqQjtJQUNBLGdCQUFnQixJQUFJLFVBQVUsS0FBSyxXQUFXLEVBQUU7SUFDaEQsb0JBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQXVCLEVBQUUsK0JBQStCLENBQUMsQ0FBQztJQUM1RixvQkFBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtJQUNqRSx3QkFBd0IsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUMzQyxxQkFBcUI7SUFDckIsaUJBQWlCO0lBQ2pCLGFBQWE7SUFDYixZQUFZLElBQUksVUFBVSxFQUFFO0lBQzVCLGdCQUFnQixJQUFJLHVCQUF1QixDQUFDLFlBQVksQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFO0lBQ2xGLG9CQUFvQix1QkFBdUIsQ0FBQyxHQUFHLEdBQUcsdUJBQXVCLENBQUMsWUFBWSxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDL0csb0JBQW9CLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3BGLGlCQUFpQjtJQUNqQixxQkFBcUIsSUFBSSx1QkFBdUIsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQUU7SUFDM0Usb0JBQW9CLHVCQUF1QixDQUFDLEdBQUcsR0FBRyx1QkFBdUIsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbkcsb0JBQW9CLHVCQUF1QixDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4RSxpQkFBaUI7SUFDakIsZ0JBQWdCLElBQUksQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUM3RCxhQUFhO0lBQ2IsaUJBQWlCO0lBQ2pCLGdCQUFnQixJQUFJLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDMUQsYUFBYTtJQUNiLFNBQVM7SUFDVCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWTtJQUNwQztJQUNBLFFBQVEsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pFLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDcEQsWUFBWSxJQUFJLGFBQWEsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUMsWUFBWTtJQUNaLGdCQUFnQixhQUFhLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDO0lBQ2hFLGlCQUFpQixhQUFhLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxZQUFZLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUM5RyxjQUFjO0lBQ2QsZ0JBQWdCLElBQUksa0JBQWtCLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZJLGdCQUFnQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3BFLG9CQUFvQixJQUFJLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxLQUFLLGFBQWEsRUFBRTtJQUNqRSx3QkFBd0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsaUNBQWlDLENBQUMsQ0FBQztJQUN4RixxQkFBcUI7SUFDckIsb0JBQW9CLElBQUksa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxFQUFFO0lBQ2hFLHdCQUF3QixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ3ZGLHFCQUFxQjtJQUNyQixvQkFBb0IsSUFBSSxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFXLEVBQUU7SUFDL0Qsd0JBQXdCLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLCtCQUErQixDQUFDLENBQUM7SUFDdEYscUJBQXFCO0FBQ3JCO0lBQ0EsaUJBQWlCO0lBQ2pCLGFBQWE7SUFDYixTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksMEJBQTBCLEdBQUc7SUFDekMsWUFBWSxtQ0FBbUM7SUFDL0MsWUFBWSxrQ0FBa0M7SUFDOUMsWUFBWSxpQ0FBaUM7SUFDN0MsWUFBWSxrQ0FBa0M7SUFDOUMsWUFBWSxpQ0FBaUM7SUFDN0MsWUFBWSxnQ0FBZ0M7SUFDNUMsWUFBWSxzQkFBc0I7SUFDbEMsWUFBWSx1QkFBdUI7SUFDbkMsU0FBUyxDQUFDO0lBQ1YsUUFBUSxJQUFJLHNCQUFzQixHQUFHLDBCQUEwQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxRSxRQUFRLElBQUksZUFBZSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ2hGO0lBQ0EsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6RDtJQUNBLFlBQVksSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ25DO0lBQ0EsWUFBWTtJQUNaLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLHFCQUFxQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVM7SUFDNUcsaUJBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLGlDQUFpQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7SUFDbkksaUJBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLGdDQUFnQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7SUFDakksaUJBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLCtCQUErQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7SUFDL0gsaUJBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLHNCQUFzQixDQUFDLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDN0csaUJBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLGtDQUFrQyxDQUFDLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO0lBQ25JLGlCQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxpQ0FBaUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUNqSSxpQkFBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsZ0NBQWdDLENBQUMsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7SUFDL0gsY0FBYztJQUNkLGdCQUFnQixXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQ3BDLGFBQWE7QUFDYjtJQUNBLFlBQVk7SUFDWixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxrQ0FBa0MsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVztJQUNuSSxpQkFBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsaUNBQWlDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUNsSSxpQkFBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsZ0NBQWdDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztJQUNoSSxjQUFjO0lBQ2QsZ0JBQWdCLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDbkMsYUFBYTtBQUNiO0lBQ0EsWUFBWSxJQUFJLFdBQVcsRUFBRTtJQUM3QixnQkFBZ0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN4RCxhQUFhO0lBQ2IsaUJBQWlCO0lBQ2pCLGdCQUFnQixJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JELGFBQWE7SUFDYixTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsV0FBVyxFQUFFO0lBQzlDLFFBQVEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEtBQUssUUFBUSxNQUFNLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBRTtJQUM1RSxZQUFZLFdBQVcsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDO0lBQ2pELFNBQVM7SUFDVCxRQUFRLHNCQUFzQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckQsUUFBUSxXQUFXLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzVELE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLFdBQVcsRUFBRTtJQUNqRCxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxLQUFLLFFBQVEsTUFBTSxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQUU7SUFDNUUsWUFBWSxXQUFXLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQztBQUNqRDtJQUNBLFlBQVksSUFBSSxXQUFXLENBQUMsT0FBTyxLQUFLLE9BQU8sRUFBRTtJQUNqRCxnQkFBZ0IsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25DLGFBQWE7SUFDYixTQUFTO0lBQ1QsUUFBUSxJQUFJLFdBQVcsQ0FBQyxZQUFZLElBQUksV0FBVyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO0lBQ3JGLFlBQVksV0FBVyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzNELFNBQVM7SUFDVCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxZQUFZO0lBQzVDO0lBQ0E7SUFDQTtJQUNBLE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDaEQsUUFBUSxRQUFRLFdBQVcsQ0FBQyxTQUFTLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxFQUFFO0lBQy9HLE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDaEQsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLEVBQUU7SUFDOUMsWUFBWSxXQUFXLENBQUMsU0FBUyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDL0MsU0FBUztJQUNULE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDbkQsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxFQUFFO0lBQzdDLFlBQVksV0FBVyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDM0UsU0FBUztJQUNULE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZO0lBQ2pDO0lBQ0EsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7SUFDeEIsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtJQUNqQyxZQUFZLFVBQVUsQ0FBQyxZQUFZO0lBQ25DLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO0lBQzVDLG9CQUFvQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0lBQ2pELG9CQUFvQixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtJQUM5Qyx3QkFBd0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxFQUFFLElBQUksRUFBRSxZQUFZO0lBQ25ILDRCQUE0QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztJQUN2RCx5QkFBeUIsQ0FBQyxDQUFDO0lBQzNCLHFCQUFxQjtJQUNyQixpQkFBaUI7SUFDakIsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLFNBQVM7SUFDVCxhQUFhO0lBQ2IsWUFBWSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0lBQ3pDLFlBQVksSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFDdkMsU0FBUztBQUNUO0lBQ0E7SUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQywwQkFBMEIsR0FBRyxFQUFFLEVBQUU7SUFDdkUsWUFBWSxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztJQUM5QyxZQUFZLFVBQVUsQ0FBQyxXQUFXO0lBQ2xDLGdCQUFnQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDakMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ25CLFlBQVksT0FBTztJQUNuQixTQUFTLE1BQU07SUFDZixZQUFZLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ3BDLFlBQVksSUFBSSxDQUFDLDBCQUEwQixHQUFHLENBQUMsQ0FBQztJQUNoRCxTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7SUFDeEMsWUFBWSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUN2QyxTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7SUFDcEMsWUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRTtJQUNoQyxnQkFBZ0IsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVGLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLFFBQVEsQ0FBQyxVQUFVLE1BQU0sUUFBUSxFQUFFO0lBQy9ELG9CQUFvQixJQUFJLFFBQVEsQ0FBQyxVQUFVLEtBQUssVUFBVSxFQUFFO0lBQzVELHdCQUF3QixVQUFVLENBQUMsWUFBWTtJQUMvQyw0QkFBNEIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDdkQseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDOUIscUJBQXFCO0lBQ3JCLHlCQUF5QjtJQUN6Qix3QkFBd0IsVUFBVSxDQUFDLFlBQVk7SUFDL0MsNEJBQTRCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUM3Qyx5QkFBeUIsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNoQyx3QkFBd0IsT0FBTztJQUMvQixxQkFBcUI7SUFDckIsaUJBQWlCO0lBQ2pCLHFCQUFxQjtJQUNyQixvQkFBb0IsVUFBVSxDQUFDLFlBQVk7SUFDM0Msd0JBQXdCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQ25ELHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDMUIsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsWUFBWTtJQUMzQztJQUNBLFFBQVEsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsTUFBTSxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFO0lBQ2hFLFlBQVksSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUM7SUFDbkMsWUFBWSxVQUFVLENBQUMsWUFBWTtJQUNuQyxnQkFBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQzNELGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNwQixTQUFTO0lBQ1QsYUFBYTtJQUNiLFlBQVksSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7SUFDbEMsWUFBWSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUMvQjtJQUNBO0lBQ0EsWUFBWSxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRTtJQUNuRCxnQkFBZ0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDekMsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUNqRCxnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQ2hELGdCQUFnQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDL0MsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUMzQyxnQkFBZ0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDekMsZ0JBQWdCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3ZDLGdCQUFnQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztJQUN0QyxnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEM7SUFDQSxnQkFBZ0IsSUFBSSxDQUFDLFFBQVEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssV0FBVyxNQUFNLFFBQVEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixDQUFDLEtBQUssVUFBVSxDQUFDLEVBQUU7SUFDbEosb0JBQW9CLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQ2xFLGlCQUFpQjtBQUNqQjtJQUNBLGdCQUFnQixNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ3BEO0lBQ0EsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLGdCQUFnQixPQUFPO0lBQ3ZCLGFBQWE7QUFDYjtJQUNBLFlBQVksTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNoRDtJQUNBO0lBQ0EsWUFBWSxJQUFJLENBQUMsUUFBUSxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxXQUFXLE1BQU0sUUFBUSxNQUFNLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsS0FBSyxVQUFVLENBQUMsRUFBRTtJQUM5SSxnQkFBZ0IsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDOUQsYUFBYTtBQUNiO0lBQ0EsWUFBWSxJQUFJLEtBQUssQ0FBQztBQUN0QjtJQUNBLFlBQVksSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtJQUM3QyxnQkFBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM5QyxhQUFhO0FBQ2I7SUFDQSxZQUFZLElBQUksT0FBTyxNQUFNLENBQUMsd0JBQXdCLEtBQUssVUFBVSxFQUFFO0lBQ3ZFLGdCQUFnQixNQUFNLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztJQUNsRCxhQUFhO0lBQ2IsaUJBQWlCLElBQUksT0FBTyxNQUFNLENBQUMsNEJBQTRCLEtBQUssVUFBVSxFQUFFO0lBQ2hGLGdCQUFnQixNQUFNLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztJQUN0RCxhQUFhO0FBQ2I7SUFDQSxZQUFZLEtBQUssR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELFlBQVksS0FBSyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0QsWUFBWSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDO0lBQ0EsWUFBWSxLQUFLLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsRCxZQUFZLEtBQUssQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9ELFlBQVksTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QztJQUNBLFlBQVksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0lBQzlCLGdCQUFnQixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUN4QyxhQUFhO0FBQ2I7SUFDQTtJQUNBLFlBQVksSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRTtJQUNoRCxnQkFBZ0IsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTtJQUNuRCxvQkFBb0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNwRCxpQkFBaUI7SUFDakIsZ0JBQWdCLElBQUksT0FBTyxNQUFNLENBQUMsMEJBQTBCLEtBQUssVUFBVSxFQUFFO0lBQzdFLG9CQUFvQixNQUFNLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztJQUN4RCxpQkFBaUI7SUFDakIscUJBQXFCLElBQUksT0FBTyxNQUFNLENBQUMsOEJBQThCLEtBQUssVUFBVSxFQUFFO0lBQ3RGLG9CQUFvQixNQUFNLENBQUMsOEJBQThCLEVBQUUsQ0FBQztJQUM1RCxpQkFBaUI7QUFDakI7SUFDQSxnQkFBZ0IsS0FBSyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEQsZ0JBQWdCLEtBQUssQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2pFLGdCQUFnQixNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDO0lBQ0EsZ0JBQWdCLEtBQUssR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RELGdCQUFnQixLQUFLLENBQUMsU0FBUyxDQUFDLHVCQUF1QixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyRSxnQkFBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QztJQUNBLGdCQUFnQixNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ2xELGFBQWE7SUFDYixpQkFBaUI7SUFDakIsZ0JBQWdCLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUU7SUFDcEQsb0JBQW9CLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckQsaUJBQWlCO0lBQ2pCLGdCQUFnQixJQUFJLE9BQU8sTUFBTSxDQUFDLDJCQUEyQixLQUFLLFVBQVUsRUFBRTtJQUM5RSxvQkFBb0IsTUFBTSxDQUFDLDJCQUEyQixFQUFFLENBQUM7SUFDekQsaUJBQWlCO0lBQ2pCLHFCQUFxQixJQUFJLE9BQU8sTUFBTSxDQUFDLCtCQUErQixLQUFLLFVBQVUsRUFBRTtJQUN2RixvQkFBb0IsTUFBTSxDQUFDLCtCQUErQixFQUFFLENBQUM7SUFDN0QsaUJBQWlCO0FBQ2pCO0lBQ0EsZ0JBQWdCLEtBQUssR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RELGdCQUFnQixLQUFLLENBQUMsU0FBUyxDQUFDLG9CQUFvQixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsRSxnQkFBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1QztJQUNBLGdCQUFnQixLQUFLLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0RCxnQkFBZ0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEUsZ0JBQWdCLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUMsYUFBYTtBQUNiO0lBQ0EsWUFBWSxNQUFNLENBQUMsYUFBYSxDQUFDLHNCQUFzQixFQUFFLENBQUM7QUFDMUQ7SUFDQTtJQUNBLFlBQVksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtJQUNyRSxnQkFBZ0IsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDekUsZ0JBQWdCLElBQUksT0FBTyxHQUFHLFdBQVcsQ0FBQztJQUMxQyxnQkFBZ0IsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUN2RCxvQkFBb0IsT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkQsaUJBQWlCO0lBQ2pCLHFCQUFxQjtJQUNyQixvQkFBb0IsT0FBTyxHQUFHLE1BQU0sR0FBRyxPQUFPLENBQUM7SUFDL0MsaUJBQWlCO0FBQ2pCO0lBQ0EsZ0JBQWdCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFO0lBQ3JGLG9CQUFvQixRQUFRLENBQUMsSUFBSSxLQUFLLFdBQVcsTUFBTSxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUM7SUFDekUsaUJBQWlCLENBQUMsQ0FBQztBQUNuQjtJQUNBLGdCQUFnQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUN6QyxhQUFhO0lBQ2IsU0FBUztJQUNULEtBQUssQ0FBQztBQUNOO0lBQ0EsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLFlBQVk7SUFDdkMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxFQUFFO0lBQ2hELFlBQVksTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDNUMsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFO0lBQ3ZELFlBQVksT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzlDLFNBQVM7QUFDVDtJQUNBLFFBQVEsT0FBTyxFQUFFLENBQUM7SUFDbEIsS0FBSyxDQUFDO0FBQ047SUFDQSxJQUFJLElBQUksQ0FBQyxjQUFjLEdBQUcsV0FBVztJQUNyQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7SUFDdEMsTUFBTSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDekIsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsWUFBWTtJQUN4QyxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUU7SUFDdEMsWUFBWSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLENBQUMsQ0FBQztJQUNuRixTQUFTO0lBQ1QsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO0lBQ3JDLFlBQVksSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxDQUFDLENBQUM7SUFDbEYsU0FBUztJQUNULFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtJQUNwQyxZQUFZLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDO0lBQ2pGLFNBQVM7SUFDVCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLGdCQUFnQixFQUFFO0lBQ3pELFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtJQUN6QyxZQUFZLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRTtJQUM1RCxnQkFBZ0IsWUFBWSxHQUFHLGdCQUFnQixHQUFHLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDdkUsYUFBYSxDQUFDLENBQUM7SUFDZixTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMseUJBQXlCLEdBQUcsU0FBUyxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRTtJQUNuRixRQUFRLElBQUksSUFBSSxDQUFDLDJCQUEyQixJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7SUFDaEUsWUFBWSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtJQUN4QyxnQkFBZ0IsUUFBUSxFQUFFLHdCQUF3QjtJQUNsRCxnQkFBZ0IsWUFBWSxHQUFHLGdCQUFnQixHQUFHLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDdkUsZ0JBQWdCLG1CQUFtQixHQUFHLGlCQUFpQixHQUFHLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDL0UsYUFBYSxDQUFDLENBQUM7SUFDZixTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsVUFBVSx5QkFBeUIsRUFBRSxpQkFBaUIsRUFBRSxrQkFBa0IsRUFBRSxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBRTtJQUNuSixRQUFRLElBQUksQ0FBQyx5QkFBeUIsRUFBRTtJQUN4QyxZQUFZLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFO0lBQ3hELGdCQUFnQixZQUFZLEdBQUcsZ0JBQWdCLEdBQUcsU0FBUyxHQUFHLFFBQVEsQ0FBQztJQUN2RSxnQkFBZ0IsY0FBYyxHQUFHLGdCQUFnQixHQUFHLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDekUsZ0JBQWdCLG9CQUFvQixHQUFHLGdCQUFnQixHQUFHLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDL0UsZ0JBQWdCLG1CQUFtQixHQUFHLGlCQUFpQixHQUFHLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDL0UsZ0JBQWdCLHVCQUF1QixHQUFHLGtCQUFrQixHQUFHLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDcEYsZ0JBQWdCLHlCQUF5QixHQUFHLGtCQUFrQixHQUFHLFNBQVMsR0FBRyxRQUFRLENBQUM7SUFDdEYsZ0JBQWdCLGtCQUFrQixFQUFFLFNBQVM7SUFDN0MsYUFBYSxDQUFDLENBQUM7QUFDZjtJQUNBLFlBQVksSUFBSSxpQkFBaUIsS0FBSyxTQUFTLEVBQUU7SUFDakQsZ0JBQWdCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3ZGLGFBQWE7QUFDYjtJQUNBO0lBQ0EsWUFBWSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLENBQUMsQ0FBQztJQUM5RSxTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxJQUFJLEdBQUc7SUFDN0MsUUFBUSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQy9DLEtBQUssQ0FBQztBQUNOO0lBQ0EsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsU0FBUyxFQUFFLGtCQUFrQixFQUFFO0lBQ3pELFFBQVEsSUFBSSxDQUFDLFNBQVMsRUFBRTtJQUN4QixZQUFZLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ2xDLFNBQVM7QUFDVDtJQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0lBQ2hDLFlBQVksSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDckMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3hELFNBQVMsTUFBTSxJQUFJLFNBQVMsRUFBRTtJQUM5QixZQUFZLEtBQUssQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO0lBQ3ZFLFNBQVM7SUFDVCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsWUFBWTtJQUM1QixRQUFRLElBQUksUUFBUSxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxRQUFRLEVBQUU7SUFDOUQsWUFBWSxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xELFNBQVM7SUFDVCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsWUFBWTtJQUM3QixRQUFRLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzlCLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QjtJQUNBLFFBQVEsVUFBVSxDQUFDLFlBQVk7SUFDL0IsWUFBWSxJQUFJLFFBQVEsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssUUFBUSxFQUFFO0lBQ2xFLGdCQUFnQixJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEtBQUssYUFBYSxFQUFFO0lBQy9FLG9CQUFvQixNQUFNLENBQUMsbUJBQW1CLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDL0QsaUJBQWlCO0lBQ2pCLGFBQWE7SUFDYixTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDaEIsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsU0FBUyxFQUFFO0lBQzVDLFFBQVEsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM3RSxRQUFRLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUMxQjtJQUNBLFFBQVEsSUFBSSxDQUFDLEVBQUU7SUFDZixZQUFZLFNBQVMsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxXQUFXLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZHLFlBQVksSUFBSSxTQUFTLEVBQUU7SUFDM0IsZ0JBQWdCLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLGFBQWE7SUFDYixTQUFTO0FBQ1Q7SUFDQSxRQUFRLE9BQU8sUUFBUSxDQUFDO0lBQ3hCLE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLGlCQUFpQixHQUFHLFVBQVUsU0FBUyxFQUFFO0lBQ2xELFFBQVEsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDdkMsUUFBUSxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekQsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsU0FBUyxHQUFHLG1CQUFtQixDQUFDLEVBQUUsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEc7SUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLEVBQUU7SUFDdEIsWUFBWSxPQUFPLElBQUksQ0FBQztJQUN4QixTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7SUFDekIsWUFBWSxPQUFPLEVBQUUsQ0FBQztJQUN0QixTQUFTO0FBQ1Q7SUFDQSxRQUFRLE9BQU8sa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNsRSxNQUFLO0FBQ0w7SUFDQTtJQUNBO0lBQ0E7SUFDQSxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxTQUFTLEVBQUUsa0JBQWtCLEVBQUU7SUFDNUQsUUFBUSxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQztJQUNyQyxhQUFhLElBQUksQ0FBQyxVQUFVO0lBQzVCLGdCQUFnQixJQUFJLGtCQUFrQixJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRTtJQUN0RSxtQkFBbUIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN2RCxpQkFBaUI7QUFDakI7SUFDQSxnQkFBZ0IsTUFBTSxDQUFDLG1CQUFtQixJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoRixnQkFBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3BELGFBQWEsQ0FBQyxDQUFDO0lBQ2YsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsSUFBSSxFQUFFO0lBQ3JDLFFBQVEsSUFBSSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7SUFDcEMsUUFBUSxJQUFJLGVBQWUsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQzlDLFFBQVEsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQy9CO0lBQ0EsUUFBUSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BELFFBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ3ZDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNsRCxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbkQsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDNUMsWUFBWSxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFDNUI7SUFDQTtJQUNBO0lBQ0EsZ0JBQWdCLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUYsZ0JBQWdCO0lBQ2hCLG9CQUFvQixJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQztJQUM3RSxvQkFBb0I7SUFDcEIsd0JBQXdCLGtCQUFrQixHQUFHLENBQUMsQ0FBQztJQUMvQyxxQkFBcUI7SUFDckIsaUJBQWlCO0lBQ2pCLHFCQUFxQjtJQUNyQixvQkFBb0IsTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QyxpQkFBaUI7SUFDakIsYUFBYTtJQUNiLFNBQVM7QUFDVDtJQUNBLFFBQVEsSUFBSSxrQkFBa0IsS0FBSyxFQUFFLEVBQUU7SUFDdkMsWUFBWSxNQUFNLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDbEQsU0FBUztBQUNUO0lBQ0EsUUFBUSxPQUFPLE1BQU0sQ0FBQztJQUN0QixNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO0lBQ3hFLFFBQVEsSUFBSSxRQUFRLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUM7SUFDL0QsUUFBUSxJQUFJLE1BQU0sRUFBRTtJQUNwQixZQUFZLFFBQVEsR0FBRyxNQUFNLENBQUM7SUFDOUIsU0FBUztJQUNULFFBQVEsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSztJQUMvQyxhQUFhLENBQUMsVUFBVSxJQUFJLFdBQVcsR0FBRyxVQUFVLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3hFLGFBQWEsQ0FBQyxJQUFJLElBQUksUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7SUFDM0MsYUFBYSxDQUFDLE1BQU0sSUFBSSxVQUFVLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNqRCxhQUFhLENBQUMsUUFBUSxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMxQyxRQUFRLFFBQVEsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0lBQ3BDLE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZO0lBQ3JDLFFBQVEsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakQsUUFBUSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkQsUUFBUSxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUNoRCxRQUFRLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQztBQUM3RDtJQUNBLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDakQsWUFBWSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEMsWUFBWSxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pELFlBQVksSUFBSSxJQUFJLEdBQUcsVUFBVSxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUMvRSxZQUFZLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2hFO0lBQ0EsWUFBWSxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDdEMsWUFBWSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDNUQsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDaEQsb0JBQW9CLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDekMsb0JBQW9CLE1BQU07SUFDMUIsaUJBQWlCO0lBQ2pCLGFBQWE7QUFDYjtJQUNBLFlBQVksSUFBSSxDQUFDLENBQUMsYUFBYSxNQUFNLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDMUQsZ0JBQWdCLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQztJQUMxQyxnQkFBZ0IsSUFBSSxZQUFZLEdBQUcseUNBQXlDLENBQUM7SUFDN0UsZ0JBQWdCLElBQUksWUFBWSxHQUFHLFVBQVUsQ0FBQztJQUM5QyxnQkFBZ0IsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsWUFBWSxDQUFDO0lBQ3RELGdCQUFnQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN0RCxvQkFBb0IsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLG9CQUFvQixRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxZQUFZLEdBQUcsVUFBVSxDQUFDO0lBQ3ZFLG9CQUFvQixRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxZQUFZLEdBQUcsVUFBVSxHQUFHLFlBQVksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekcsb0JBQW9CLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLFlBQVksR0FBRyxVQUFVLEdBQUcsWUFBWSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDL0csb0JBQW9CLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLFlBQVksR0FBRyxVQUFVLEdBQUcsWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDN0gsb0JBQW9CLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLFlBQVksR0FBRyxVQUFVLEdBQUcsWUFBWSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ25JO0lBQ0Esb0JBQW9CLElBQUksV0FBVyxFQUFFO0lBQ3JDLHdCQUF3QixRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxZQUFZLEdBQUcsVUFBVSxHQUFHLFlBQVksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFILHFCQUFxQjtJQUNyQixpQkFBaUI7SUFDakIsYUFBYTtBQUNiO0lBQ0EsWUFBWSxHQUFHLENBQUMsa0JBQWtCLEVBQUUsRUFBRTtJQUN0QyxnQkFBZ0IsT0FBTztJQUN2QixhQUFhO0FBQ2I7SUFDQSxZQUFZLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqQyxZQUFZLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNuQyxTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsTUFBTSxFQUFFO0lBQzNDLFFBQVEsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDO0lBQ2hDLFFBQVEsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUMvQixZQUFZLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakQsWUFBWSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQ3ZDLGdCQUFnQixVQUFVLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxRCxhQUFhO0lBQ2IsU0FBUztJQUNULFFBQVEsT0FBTyxVQUFVLENBQUM7SUFDMUIsTUFBSztBQUNMO0lBQ0E7SUFDQSxJQUFJLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWTtJQUNwQyxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUN4QjtJQUNBLFFBQVEsSUFBSSxtQkFBbUIsR0FBRyxVQUFVLFdBQVcsRUFBRTtJQUN6RCxZQUFZLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxNQUFNLEVBQUU7SUFDbEQsZ0JBQWdCLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQyxnQkFBZ0IsSUFBSSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEQsZ0JBQWdCLElBQUksZUFBZSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRDtJQUNBLGdCQUFnQixRQUFRLGlCQUFpQjtJQUN6QyxvQkFBb0IsS0FBSyxHQUFHO0lBQzVCO0lBQ0Esd0JBQXdCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDM0Usd0JBQXdCLE1BQU07SUFDOUIsb0JBQW9CLEtBQUssR0FBRztJQUM1QjtJQUNBLHdCQUF3QixJQUFJLENBQUMsd0JBQXdCLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ25GLHdCQUF3QixNQUFNO0lBQzlCLGlCQUFpQjtJQUNqQixhQUFhLENBQUMsQ0FBQztJQUNmLFNBQVMsQ0FBQztBQUNWO0lBQ0EsUUFBUSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDekQ7SUFDQSxRQUFRLElBQUksV0FBVyxJQUFJLElBQUksRUFBRTtJQUNqQyxZQUFZLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7SUFDeEUsZ0JBQWdCLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3ZFLGFBQWE7QUFDYjtJQUNBLFlBQVksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtJQUN0RSxnQkFBZ0IsbUJBQW1CLENBQUMsV0FBVyxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDdkUsYUFBYTtBQUNiO0lBQ0EsWUFBWSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0lBQ3BFLGdCQUFnQixtQkFBbUIsQ0FBQyxXQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUN4RSxhQUFhO0FBQ2I7SUFDQSxZQUFZLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3JFLFNBQVM7SUFDVCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLFVBQVUsRUFBRSxXQUFXLEVBQUU7SUFDL0QsUUFBUSxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqRCxRQUFRLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2RCxRQUFRLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ2hELFFBQVEsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDO0FBQzdEO0lBQ0EsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNqRCxZQUFZLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwQyxZQUFZLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakQsWUFBWSxJQUFJLElBQUksR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQy9FLFlBQVksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDaEU7SUFDQSxZQUFZLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztJQUNwQyxZQUFZLElBQUksV0FBVyxLQUFLLEVBQUUsRUFBRTtJQUNwQyxnQkFBZ0IsSUFBSSxJQUFJLEtBQUssVUFBVSxFQUFFO0lBQ3pDLG9CQUFvQixXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ3ZDLGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsaUJBQWlCO0lBQ2pCLGdCQUFnQixXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUM7SUFDckQsYUFBYTtBQUNiO0lBQ0EsWUFBWSxJQUFJLENBQUMsV0FBVyxNQUFNLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDdkQsZ0JBQWdCLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQztJQUMxQyxnQkFBZ0IsSUFBSSxZQUFZLEdBQUcseUNBQXlDLENBQUM7SUFDN0UsZ0JBQWdCLElBQUksWUFBWSxHQUFHLFVBQVUsQ0FBQztJQUM5QyxnQkFBZ0IsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsWUFBWSxDQUFDO0lBQ3RELGdCQUFnQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN0RCxvQkFBb0IsVUFBVSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLEdBQUcsR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLG9CQUFvQixRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxZQUFZLEdBQUcsVUFBVSxDQUFDO0lBQ3ZFLG9CQUFvQixRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxZQUFZLEdBQUcsVUFBVSxHQUFHLFlBQVksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekcsb0JBQW9CLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLFlBQVksR0FBRyxVQUFVLEdBQUcsWUFBWSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDL0csb0JBQW9CLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLFlBQVksR0FBRyxVQUFVLEdBQUcsWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDN0gsb0JBQW9CLFFBQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLFlBQVksR0FBRyxVQUFVLEdBQUcsWUFBWSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQ25JO0lBQ0Esb0JBQW9CLElBQUksV0FBVyxFQUFFO0lBQ3JDLHdCQUF3QixRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxZQUFZLEdBQUcsVUFBVSxHQUFHLFlBQVksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFILHFCQUFxQjtJQUNyQixpQkFBaUI7SUFDakIsYUFBYTtJQUNiLFNBQVM7SUFDVCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxVQUFVLFVBQVUsRUFBRSxXQUFXLEVBQUU7SUFDdkUsUUFBUSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsRUFBRTtJQUNuQyxZQUFZLE9BQU87SUFDbkIsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzdDLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDOUMsWUFBWSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0I7SUFDQSxZQUFZLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQztJQUNwQyxZQUFZLElBQUksV0FBVyxLQUFLLEVBQUUsRUFBRTtJQUNwQyxnQkFBZ0IsSUFBSSxJQUFJLEtBQUssVUFBVSxFQUFFO0lBQ3pDLG9CQUFvQixXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ3ZDLGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsaUJBQWlCO0lBQ2pCLGdCQUFnQixXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0RCxhQUFhO0FBQ2I7SUFDQSxZQUFZLElBQUksV0FBVyxFQUFFO0lBQzdCLGdCQUFnQixZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDLGdCQUFnQixJQUFJLFFBQVEsY0FBYyxDQUFDLEtBQUssV0FBVyxFQUFFO0lBQzdELG9CQUFvQixjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BELGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsU0FBUztJQUNULE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZO0lBQ2hDLFFBQVEsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDL0IsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztJQUM5QixRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQ2pDLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQ3pDLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQ3hDLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3ZDLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO0FBQ3pDO0lBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUM1QjtJQUNBO0lBQ0EsUUFBUSxJQUFJLENBQUMsUUFBUSxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxXQUFXLE1BQU0sUUFBUSxNQUFNLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsS0FBSyxVQUFVLENBQUMsRUFBRTtJQUMxSSxZQUFZLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzFELFNBQVM7QUFDVDtJQUNBLFFBQVEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN6QyxRQUFRLElBQUksT0FBTyxNQUFNLENBQUMsMkJBQTJCLEtBQUssVUFBVSxFQUFFO0lBQ3RFLFlBQVksTUFBTSxDQUFDLDJCQUEyQixFQUFFLENBQUM7SUFDakQsU0FBUztJQUNULGFBQWEsSUFBSSxPQUFPLE1BQU0sQ0FBQywrQkFBK0IsS0FBSyxVQUFVLEVBQUU7SUFDL0UsWUFBWSxNQUFNLENBQUMsK0JBQStCLEVBQUUsQ0FBQztJQUNyRCxTQUFTO0FBQ1Q7SUFDQSxRQUFRLE1BQU0sQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDNUM7SUFDQSxRQUFRLElBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQztJQUMvQixRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQ3RDLFlBQVksYUFBYSxHQUFHLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ25GLFNBQVM7QUFDVDtJQUNBLFFBQVEsSUFBSSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsR0FBRyxlQUFlLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQzlIO0lBQ0EsUUFBUSxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDO0FBQ2xEO0lBQ0E7SUFDQSxRQUFRLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7SUFDeEQsWUFBWSxJQUFJLE9BQU8sTUFBTSxDQUFDLG1CQUFtQixLQUFLLFFBQVEsRUFBRTtJQUNoRSxnQkFBZ0IsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzdELGFBQWE7QUFDYjtJQUNBLFlBQVksSUFBSSxZQUFZLEVBQUU7SUFDOUIsZ0JBQWdCLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRTtJQUMzQyxvQkFBb0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQ2xGLGlCQUFpQjtJQUNqQixxQkFBcUI7SUFDckIsb0JBQW9CLE1BQU0sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQy9ELGlCQUFpQjtJQUNqQixnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sTUFBTSxDQUFDLG1CQUFtQixLQUFLLFFBQVEsS0FBSyxNQUFNLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRTtJQUNsSixvQkFBb0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BJLGlCQUFpQjtJQUNqQixxQkFBcUI7SUFDckIsb0JBQW9CLE1BQU0sQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0lBQ2hFLGlCQUFpQjtJQUNqQixhQUFhO0FBQ2I7SUFDQSxZQUFZLGFBQWEsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUNsSTtJQUNBLFlBQVksSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcseUNBQXlDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUU7SUFDNUgsZ0JBQWdCLFFBQVEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxhQUFhO0lBQ3RFLGdCQUFnQixZQUFZLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxjQUFjO0lBQ2xFLGdCQUFnQixPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZO0lBQzNELGdCQUFnQixXQUFXLEdBQUcsYUFBYTtJQUMzQyxnQkFBZ0IsZ0JBQWdCO0lBQ2hDLGdCQUFnQixvQkFBb0I7SUFDcEMsZ0JBQWdCLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7SUFDNUcsZ0JBQWdCLFdBQVcsQ0FBQztBQUM1QjtJQUNBLGdCQUFnQixVQUFVLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdkYsU0FBUztJQUNULGFBQWE7SUFDYixZQUFZLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcseUNBQXlDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUU7SUFDNUcsZ0JBQWdCLFFBQVEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxhQUFhO0lBQ3RFLGdCQUFnQixZQUFZLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxjQUFjO0lBQ2xFLGdCQUFnQixPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZO0lBQzNELGdCQUFnQixXQUFXLEdBQUcsYUFBYTtJQUMzQyxnQkFBZ0IsZ0JBQWdCO0lBQ2hDLGdCQUFnQixvQkFBb0I7SUFDcEMsZ0JBQWdCLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7SUFDNUcsZ0JBQWdCLFdBQVcsQ0FBQztBQUM1QjtJQUNBLGdCQUFnQixVQUFVLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDdkYsU0FBUztJQUNULE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLFdBQVcsRUFBRSxjQUFjLEVBQUU7SUFDakUsUUFBUSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUNoQyxRQUFRLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0lBQ2xDLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDaEMsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztJQUM5QixRQUFRLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzlCLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQ3hDLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3ZDLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3RDLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3hDO0lBQ0EsUUFBUSxJQUFJLGVBQWUsR0FBRyxFQUFFLENBQUM7SUFDakMsUUFBUSxJQUFJLFdBQVcsRUFBRTtJQUN6QixZQUFZLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQzNDLFlBQVksZUFBZSxHQUFHLGVBQWUsR0FBRyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQ3BFLFNBQVM7QUFDVDtJQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDNUI7SUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztBQUMxQztJQUNBLFFBQVEsSUFBSSxjQUFjLEVBQUU7SUFDNUIsWUFBWSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsY0FBYyxDQUFDO0lBQy9ELFNBQVM7QUFDVDtJQUNBLFFBQVEsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDakM7SUFDQSxRQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQztJQUNBLFFBQVEsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLFFBQVEsSUFBSSxjQUFjLEdBQUcsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN6RjtJQUNBLFFBQVEsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDaEMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtJQUN2QyxnQkFBZ0IsVUFBVSxDQUFDLFlBQVk7SUFDdkMsb0JBQW9CLE1BQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JFLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZCLGdCQUFnQixPQUFPO0lBQ3ZCLGFBQWE7SUFDYixpQkFBaUI7SUFDakIsZ0JBQWdCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ3BFO0lBQ0EsZ0JBQWdCLElBQUksWUFBWSxFQUFFO0lBQ2xDLG9CQUFvQixJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUU7SUFDL0Msd0JBQXdCLE1BQU0sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQztJQUN0RixxQkFBcUI7SUFDckIseUJBQXlCO0lBQ3pCLHdCQUF3QixNQUFNLENBQUMsYUFBYSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztJQUNuRSxxQkFBcUI7SUFDckIsb0JBQW9CLElBQUksa0JBQWtCLEdBQUcsYUFBYSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0lBQzNHLG9CQUFvQixJQUFJLENBQUMsT0FBTyxNQUFNLENBQUMsbUJBQW1CLEtBQUssUUFBUSxLQUFLLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsSUFBSSxZQUFZLENBQUMsWUFBWSxFQUFFO0lBQ3RKLHdCQUF3QixNQUFNLENBQUMsYUFBYSxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDeEksd0JBQXdCLGtCQUFrQixJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztJQUM3RyxxQkFBcUI7SUFDckIseUJBQXlCO0lBQ3pCLHdCQUF3QixNQUFNLENBQUMsYUFBYSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztJQUNwRSxxQkFBcUI7SUFDckIsaUJBQWlCO0FBQ2pCO0lBQ0EsZ0JBQWdCLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBUztJQUM5QyxvQkFBb0IsWUFBWSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUs7SUFDckUsb0JBQW9CLDBHQUEwRyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTztJQUM3SixvQkFBb0IsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsa0JBQWtCLEdBQUcsZUFBZSxHQUFHLEdBQUcsRUFBRSxjQUFjLEVBQUUsR0FBRztJQUN0SCxpQkFBaUIsQ0FBQztJQUNsQixhQUFhO0lBQ2IsU0FBUztJQUNULGFBQWE7SUFDYixZQUFZLElBQUksQ0FBQyxTQUFTO0lBQzFCLGdCQUFnQixZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLO0lBQ2pELGdCQUFnQiwwR0FBMEcsR0FBRyxJQUFJLENBQUMsT0FBTztJQUN6SSxnQkFBZ0IsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsZUFBZSxHQUFHLEdBQUcsRUFBRSxjQUFjLEVBQUUsR0FBRztJQUM3RixhQUFhLENBQUM7SUFDZCxTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUMvQjtJQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsd0JBQXdCLEVBQUU7SUFDM0MsWUFBWSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN4RCxRQUFRLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hGO0lBQ0EsUUFBUSxJQUFJLENBQUMsc0JBQXNCO0lBQ25DLFlBQVksSUFBSSxDQUFDLG1CQUFtQjtJQUNwQyxZQUFZLElBQUksQ0FBQyx3QkFBd0I7SUFDekMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVc7SUFDcEMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVU7SUFDbkMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVM7SUFDbEMsU0FBUyxDQUFDO0FBQ1Y7SUFDQSxRQUFRLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN6QixNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWTtJQUNoQyxRQUFRLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO0lBQ3ZDLFlBQVksT0FBTyxLQUFLLENBQUM7SUFDekIsU0FBUztBQUNUO0lBQ0EsUUFBUSxPQUFPLG95QkFBb3lCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5MEIsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7SUFDckQsUUFBUSxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0QsUUFBUSxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckQsUUFBUSxDQUFDLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO0lBQ25DLFFBQVEsQ0FBQyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDNUIsUUFBUSxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQyxRQUFRLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQztJQUMvQixRQUFRLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxLQUFLLFdBQVcsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQzFELFlBQVksV0FBVyxHQUFHLEtBQUssQ0FBQztJQUNoQyxTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksV0FBVyxFQUFFO0lBQ3pCLFlBQVksQ0FBQyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7SUFDOUIsU0FBUztJQUNULFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDcEIsUUFBUSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLENBQUMsRUFBRSxPQUFPLEVBQUU7SUFDaEUsWUFBWSxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRTtJQUNsRixnQkFBZ0IsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0lBQ3ZELGdCQUFnQixJQUFJLENBQUMsT0FBTyxFQUFFO0lBQzlCLG9CQUFvQixJQUFJLFFBQVEsRUFBRTtJQUNsQyx3QkFBd0IsUUFBUSxFQUFFLENBQUM7SUFDbkMscUJBQXFCO0lBQ3JCLGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsU0FBUyxDQUFDO0lBQ1YsUUFBUSxDQUFDLENBQUMsT0FBTyxHQUFHLFlBQVk7SUFDaEMsWUFBWSxJQUFJLFFBQVEsRUFBRTtJQUMxQixnQkFBZ0IsSUFBSTtJQUNwQixvQkFBb0IsUUFBUSxFQUFFLENBQUM7SUFDL0IsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRztJQUMvQixhQUFhO0lBQ2IsU0FBUyxDQUFDO0lBQ1YsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFO0lBQy9CLFlBQVksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzVDLFNBQVM7SUFDVCxhQUFhO0lBQ2IsWUFBWSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QyxTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztBQUN2QztJQUNBLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLFFBQVEsRUFBRSxTQUFTLEVBQUU7SUFDckQsUUFBUSxJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVELFFBQVEsSUFBSSxXQUFXLEVBQUU7SUFDekIsWUFBWSxXQUFXLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQztJQUN4QyxTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLFlBQVk7SUFDbkMsUUFBUTtJQUNSLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBVSxLQUFLLEtBQUs7SUFDM0MsYUFBYSxTQUFTLENBQUMsWUFBWSxLQUFLLEdBQUcsQ0FBQztJQUM1QyxhQUFhLFNBQVMsQ0FBQyxVQUFVLEtBQUssR0FBRyxDQUFDO0lBQzFDLGFBQWEsSUFBSSxDQUFDLGFBQWEsS0FBSyxLQUFLLENBQUM7SUFDMUMsYUFBYSxTQUFTLENBQUMsYUFBYSxLQUFLLEtBQUssQ0FBQztJQUMvQyxVQUFVO0lBQ1YsWUFBWSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUNuQyxTQUFTO0lBQ1QsYUFBYTtJQUNiLFlBQVksSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDcEMsU0FBUztJQUNULE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLGVBQWUsR0FBRyxZQUFZO0lBQ3ZDLFFBQVEsSUFBSSxhQUFhLEdBQUcsaUNBQWlDLENBQUM7QUFDOUQ7SUFDQTtJQUNBLFFBQVEsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNqRSxRQUFRLElBQUksV0FBVyxFQUFFO0lBQ3pCLFlBQVksV0FBVyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDNUQsU0FBUztBQUNUO0lBQ0E7SUFDQSxRQUFRLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7SUFDakMsUUFBUSxJQUFJLElBQUksRUFBRTtJQUNsQixZQUFZLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEQsWUFBWSxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQy9DLFlBQVksQ0FBQyxDQUFDLEVBQUUsR0FBRyxhQUFhLENBQUM7SUFDakMsWUFBWSxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFDbkM7SUFDQSxZQUFZLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtJQUNoQyxnQkFBZ0IsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hDLGdCQUFnQixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDakMsZ0JBQWdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUNwRCxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRTtJQUM5QyxvQkFBb0IsTUFBTSxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0lBQ3BFLG9CQUFvQixPQUFPLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7SUFDdEUsaUJBQWlCO0lBQ2pCLHFCQUFxQjtJQUNyQixvQkFBb0IsT0FBTyxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0lBQ3JFLG9CQUFvQixNQUFNLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7SUFDckUsaUJBQWlCO0lBQ2pCLGdCQUFnQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO0lBQzdDLG9CQUFvQixNQUFNLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7SUFDbkUsb0JBQW9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNyRSxpQkFBaUI7SUFDakIscUJBQXFCO0lBQ3JCLG9CQUFvQixPQUFPLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7SUFDcEUsb0JBQW9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNwRSxpQkFBaUI7SUFDakIsZ0JBQWdCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7SUFDNUMsb0JBQW9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUNsRSxvQkFBb0IsT0FBTyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQ3BFLGlCQUFpQjtJQUNqQixxQkFBcUI7SUFDckIsb0JBQW9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUNuRSxvQkFBb0IsTUFBTSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQ25FLGlCQUFpQjtJQUNqQixnQkFBZ0IsT0FBTyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3RELGdCQUFnQixhQUFhLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLGtDQUFrQyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQztJQUN4SCxhQUFhO0lBQ2IsaUJBQWlCO0lBQ2pCLGdCQUFnQixhQUFhLEdBQUcsc0hBQXNILENBQUM7SUFDdkosZ0JBQWdCLGFBQWEsSUFBSSxpQkFBaUIsQ0FBQztBQUNuRDtJQUNBLGdCQUFnQixhQUFhLElBQUksMEhBQTBILENBQUM7SUFDNUosZ0JBQWdCLGFBQWEsSUFBSSxrQ0FBa0MsQ0FBQztJQUNwRSxhQUFhO0lBQ2IsWUFBWSxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUU7SUFDOUIsZ0JBQWdCLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQztJQUNyRCxhQUFhLE1BQU07SUFDbkIsZ0JBQWdCLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLGFBQWE7SUFDYixZQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsU0FBUztJQUNULE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUU7SUFDNUUsUUFBUSxJQUFJLFFBQVEsTUFBTSxDQUFDLG1CQUFtQixDQUFDLEtBQUssUUFBUSxFQUFFO0lBQzlELFlBQVksSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDaEMsWUFBWSxNQUFNLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM5RixTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsVUFBVSxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFO0lBQzlHLFFBQVEsSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO0lBQ3BGLFlBQVksVUFBVSxDQUFDLFlBQVk7SUFDbkMsZ0JBQWdCLE1BQU0sQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQzVHLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsQixZQUFZLE9BQU87SUFDbkIsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLGVBQWUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7SUFDekYsUUFBUSxJQUFJLFlBQVksR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQztJQUM3RCxRQUFRLElBQUksZ0JBQWdCLEdBQUcsZ0JBQWdCLEdBQUcsU0FBUyxHQUFHLFFBQVEsQ0FBQztBQUN2RTtJQUNBLFFBQVEsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDOUIsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztJQUM5QixRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ2hDO0lBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDekMsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDeEMsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDdkMsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDO0FBQ3hFO0lBQ0EsUUFBUSxJQUFJLGdCQUFnQixFQUFFO0lBQzlCLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQzVDLFNBQVM7SUFDVCxRQUFRLElBQUksZUFBZSxFQUFFO0lBQzdCLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQzNDLFNBQVM7SUFDVCxRQUFRLElBQUksY0FBYyxFQUFFO0lBQzVCLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzFDLFNBQVM7SUFDVCxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtJQUMvRCxZQUFZLFlBQVksR0FBRyxNQUFNLENBQUM7SUFDbEMsU0FBUztJQUNUO0lBQ0EsUUFBUSxJQUFJLFFBQVEsTUFBTSxFQUFFLGlCQUFpQixDQUFDLEtBQUssV0FBVyxFQUFFO0lBQ2hFLFlBQVksSUFBSSxRQUFRLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLFVBQVUsRUFBRTtJQUNyRixnQkFBZ0IsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDOUQsYUFBYTtJQUNiLFNBQVM7QUFDVDtJQUNBLFFBQVEsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDO0lBQzFCLFFBQVEsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0lBQzdCLFlBQVksR0FBRyxHQUFHLE1BQU0sQ0FBQztJQUN6QixTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUM3QjtJQUNBO0lBQ0EsUUFBUSxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDL0IsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtJQUN0QyxZQUFZLGFBQWEsR0FBRyxRQUFRLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNuRixTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUM1QixRQUFRLElBQUksYUFBYSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUM7QUFDbEQ7SUFDQSxRQUFRLElBQUksb0JBQW9CLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsZUFBZSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUM5SDtJQUNBLFFBQVEsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtJQUN4RDtJQUNBLFlBQVksSUFBSSxZQUFZLEVBQUU7SUFDOUIsZ0JBQWdCLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRTtJQUMzQyxvQkFBb0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDO0lBQ2xGLGlCQUFpQjtJQUNqQixxQkFBcUI7SUFDckIsb0JBQW9CLE1BQU0sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQy9ELGlCQUFpQjtJQUNqQixnQkFBZ0IsSUFBSSxDQUFDLE9BQU8sTUFBTSxDQUFDLG1CQUFtQixLQUFLLFFBQVEsS0FBSyxNQUFNLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRTtJQUNsSixvQkFBb0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3BJLGlCQUFpQjtJQUNqQixxQkFBcUI7SUFDckIsb0JBQW9CLE1BQU0sQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0lBQ2hFLGlCQUFpQjtJQUNqQixhQUFhO0FBQ2I7SUFDQSxZQUFZLGFBQWEsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQztBQUNsSTtJQUNBLFlBQVksSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsd0NBQXdDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUU7SUFDM0gsZ0JBQWdCLE9BQU8sR0FBRyxHQUFHO0lBQzdCLGdCQUFnQixPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVztJQUNsRSxnQkFBZ0IsT0FBTyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQVU7SUFDakUsZ0JBQWdCLE9BQU8sR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTO0lBQ2hFLGdCQUFnQixRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsYUFBYTtJQUN0RSxnQkFBZ0IsT0FBTyxHQUFHLFlBQVk7SUFDdEMsZ0JBQWdCLFVBQVUsR0FBRyxVQUFVO0lBQ3ZDLGdCQUFnQixRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWE7SUFDN0MsZ0JBQWdCLFdBQVcsR0FBRyxhQUFhO0lBQzNDLGdCQUFnQixVQUFVLEdBQUcsZ0JBQWdCO0lBQzdDLGdCQUFnQixvQkFBb0I7SUFDcEMsZ0JBQWdCLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxlQUFlLENBQUM7SUFDakUsZ0JBQWdCLFdBQVcsQ0FBQztBQUM1QjtJQUNBLGdCQUFnQixVQUFVLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDM0Y7SUFDQSxTQUFTO0lBQ1QsYUFBYTtJQUNiLFlBQVksSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyx3Q0FBd0MsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRTtJQUMzRyxnQkFBZ0IsT0FBTyxHQUFHLEdBQUc7SUFDN0IsZ0JBQWdCLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVc7SUFDbEQsZ0JBQWdCLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVU7SUFDakQsZ0JBQWdCLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVM7SUFDaEQsZ0JBQWdCLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLGFBQWE7SUFDdEQsZ0JBQWdCLE9BQU8sR0FBRyxZQUFZO0lBQ3RDLGdCQUFnQixVQUFVLEdBQUcsVUFBVTtJQUN2QyxnQkFBZ0IsUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhO0lBQzdDLGdCQUFnQixXQUFXLEdBQUcsYUFBYTtJQUMzQyxnQkFBZ0IsVUFBVSxHQUFHLGdCQUFnQjtJQUM3QyxnQkFBZ0Isb0JBQW9CO0lBQ3BDLGdCQUFnQixXQUFXLEdBQUcsa0JBQWtCLENBQUMsZUFBZSxDQUFDO0lBQ2pFLGdCQUFnQixXQUFXLENBQUM7QUFDNUI7SUFDQSxnQkFBZ0IsVUFBVSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzNGLFNBQVM7QUFDVDtJQUNBLFFBQVEsSUFBSSxRQUFRLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLFFBQVEsSUFBSSxRQUFRLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLFVBQVUsRUFBRTtJQUN2SSxZQUFZLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzVELFNBQVM7SUFDVCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxPQUFPLEVBQUU7SUFDckMsUUFBUSxJQUFJLFVBQVUsR0FBRyxzR0FBcUc7SUFDOUgsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLE1BQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFO0lBQ2hFLFlBQVksT0FBTyxJQUFJLENBQUM7SUFDeEIsU0FBUztJQUNULGFBQWE7SUFDYixZQUFZLE9BQU8sS0FBSyxDQUFDO0lBQ3pCLFNBQVM7SUFDVCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0FBQzdCO0lBQ0EsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUMzQjtJQUNBLElBQUksSUFBSSxDQUFDLG9CQUFvQixHQUFHLFlBQVk7SUFDNUMsUUFBUSxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3JELE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLHNCQUFzQixHQUFHLFlBQVk7SUFDOUMsUUFBUSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxVQUFVLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO0lBQ25FLFFBQVEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLFFBQVEsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQzNCO0lBQ0EsUUFBUTtJQUNSLFlBQVksQ0FBQyxDQUFDLElBQUksS0FBSyxxQkFBcUIsTUFBTSxPQUFPLElBQUksQ0FBQyxhQUFhLEtBQUssV0FBVyxDQUFDO0lBQzVGLGFBQWEsSUFBSSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDbEM7SUFDQSxnQkFBZ0IsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLGFBQWE7SUFDaEQsaUJBQWlCLFFBQVEsS0FBSyxJQUFJLENBQUMsbUJBQW1CLENBQUM7SUFDdkQsaUJBQWlCLFFBQVEsS0FBSyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQ2pELGlCQUFpQixRQUFRLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUNuRCxpQkFBaUIsUUFBUSxLQUFLLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztJQUN4RCxpQkFBaUIsUUFBUSxLQUFLLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztJQUNwRCxhQUFhO0lBQ2IsYUFBYSxPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssV0FBVyxLQUFLLENBQUMsSUFBSSxLQUFLLE1BQU0sTUFBTSxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNqRyxVQUFVO0lBQ1YsWUFBWSxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQzFCLFNBQVM7QUFDVDtJQUNBLFFBQVEsT0FBTyxNQUFNLENBQUM7SUFDdEIsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsMEJBQTBCLEdBQUcsWUFBWTtJQUNsRCxRQUFRLDBCQUEwQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxpQ0FBaUMsR0FBRyxFQUFFLENBQUM7SUFDaEQsSUFBSSxJQUFJLENBQUMsa0NBQWtDLEdBQUcsRUFBRSxDQUFDO0FBQ2pEO0lBQ0EsSUFBSSxJQUFJLENBQUMsMkJBQTJCLEdBQUcsWUFBWTtJQUNuRCxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsNEJBQTRCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzNFLFlBQVksSUFBSTtJQUNoQixnQkFBZ0IsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLGdCQUFnQixJQUFJLFlBQVksQ0FBQyxNQUFNLElBQUksWUFBWSxDQUFDLE1BQU0sSUFBSSxJQUFJLElBQUksT0FBTyxZQUFZLENBQUMsTUFBTSxLQUFLLFdBQVcsRUFBRTtJQUN0SCxvQkFBb0IsWUFBWSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdIO0lBQ0E7SUFDQSxvQkFBb0IsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLHFCQUFxQixLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sS0FBSyxNQUFNLE1BQU0sWUFBWSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQyxFQUFFO0lBQ2hKLHdCQUF3QixJQUFJLFFBQVEsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDckcsd0JBQXdCLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxpQ0FBaUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQzFHLDRCQUE0QixNQUFNLENBQUMsYUFBYSxDQUFDLGlDQUFpQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsRyw0QkFBNEIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxrQ0FBa0MsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDbkoseUJBQXlCO0lBQ3pCLHFCQUFxQjtJQUNyQix5QkFBeUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEtBQUssTUFBTSxNQUFNLFlBQVksQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDLEVBQUU7SUFDckcsd0JBQXdCLElBQUk7SUFDNUIsNEJBQTRCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEUsNEJBQTRCLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDekUsNEJBQTRCLFlBQVksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25FLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUc7SUFDdkMscUJBQXFCO0lBQ3JCLGlCQUFpQjtJQUNqQixhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRztJQUMzQixTQUFTO0FBQ1Q7SUFDQSxRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLGtDQUFrQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNqRyxZQUFZLElBQUk7SUFDaEIsZ0JBQWdCLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEUsZ0JBQWdCLFdBQVcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25ILGdCQUFnQixNQUFNLENBQUMsYUFBYSxDQUFDLGtDQUFrQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0csYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUc7SUFDM0IsU0FBUztBQUNUO0lBQ0E7SUFDQTtJQUNBLFFBQVE7SUFDUixZQUFZLE1BQU0sQ0FBQyxhQUFhLENBQUMscUJBQXFCO0lBQ3RELGFBQWEsT0FBTyxNQUFNLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQztJQUNqRCxhQUFhLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ3BHLFVBQVU7SUFDVixZQUFZLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM1QixTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxFQUFFLENBQUM7SUFDL0MsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEdBQUcsVUFBVSxJQUFJLEVBQUUsS0FBSyxFQUFFO0lBQ3RELFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDckUsWUFBWSxJQUFJLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO0lBQ2hFLGdCQUFnQixLQUFLLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqSyxhQUFhO0lBQ2IsU0FBUztJQUNULE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLHFCQUFxQixHQUFHLFlBQVk7SUFDN0M7SUFDQSxRQUFRLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDL0MsUUFBUSxJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQ3hDLFlBQVksSUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUNwRCxnQkFBZ0IsZUFBZSxHQUFHLEdBQUcsR0FBRyxlQUFlLENBQUM7SUFDeEQsYUFBYTtJQUNiLFlBQVksSUFBSSxlQUFlLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUU7SUFDbkYsZ0JBQWdCLGVBQWUsR0FBRyxlQUFlLEdBQUcsR0FBRyxDQUFDO0lBQ3hELGFBQWE7SUFDYixTQUFTO0lBQ1QsYUFBYTtJQUNiLFlBQVksZUFBZSxHQUFHLEdBQUcsQ0FBQztJQUNsQyxTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDMUMsUUFBUSxJQUFJLGVBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQ25ELFlBQVksSUFBSSxLQUFLLEdBQUcsb0JBQW9CLENBQUM7SUFDN0MsWUFBWSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBQztJQUM3RCxTQUFTO0lBQ1Q7SUFDQTtJQUNBO0FBQ0E7SUFDQTtJQUNBLFFBQVEsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxHQUFHLGVBQWUsR0FBRyxlQUFlLEdBQUcsa0JBQWtCLENBQUM7QUFDdko7SUFDQTtJQUNBLFFBQVEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3JDO0lBQ0E7SUFDQSxRQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLFlBQVk7SUFDNUQ7SUFDQSxZQUFZLDBCQUEwQixDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM3RDtJQUNBLFlBQVksTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUM3RDtJQUNBO0lBQ0EsWUFBWSxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0lBQ2pGLGdCQUFnQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUN6RixvQkFBb0IsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLG9CQUFvQixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsTUFBTSxVQUFVLENBQUMsV0FBVyxLQUFLLEVBQUUsQ0FBQyxFQUFFO0lBQ3JGLHdCQUF3QixJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1Ryx3QkFBd0IsSUFBSSxDQUFDLGFBQWEsS0FBSyxFQUFFLE1BQU0sYUFBYSxLQUFLLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7SUFDcEcsNEJBQTRCLE1BQU0sQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM3SCx5QkFBeUI7SUFDekIscUJBQXFCO0lBQ3JCLGlCQUFpQjtJQUNqQixhQUFhO0lBQ2IsU0FBUyxDQUFDLENBQUM7SUFDWCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsWUFBWTtJQUNsQyxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztJQUN4QixRQUFRLElBQUkscUJBQXFCLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7SUFDckYsUUFBUSxJQUFJLDJCQUEyQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLG1CQUFtQixDQUFDLE9BQU8sR0FBRyxLQUFJO0lBQ2hMLFFBQVEsSUFBSSx3QkFBd0IsR0FBRywyQkFBMkIsSUFBSSxJQUFJLElBQUkscUJBQXFCLElBQUksSUFBSSxDQUFDO0FBQzVHO0lBQ0EsUUFBUTtJQUNSLFlBQVksSUFBSSxDQUFDLGFBQWE7SUFDOUIsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXO0lBQzdCLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYTtJQUMvQixhQUFhLHdCQUF3QixLQUFLLDJCQUEyQixLQUFLLEtBQUssSUFBSSxxQkFBcUIsS0FBSyxLQUFLLENBQUMsQ0FBQztJQUNwSCxVQUFVO0lBQ1YsWUFBWSxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztJQUM3RCxZQUFZLE9BQU87SUFDbkIsU0FBUztBQUNUO0lBQ0EsUUFBUSxTQUFTLGtCQUFrQixHQUFHO0lBQ3RDLFlBQVksSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7SUFDekQsWUFBWSxJQUFJLE9BQU8sR0FBRyxZQUFZLEtBQUssd0JBQXdCLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdGO0lBQ0EsWUFBWSxJQUFJLENBQUMscUJBQXFCLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQztBQUMvRDtJQUNBLFlBQVksSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtJQUNoRCxnQkFBZ0IsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXO0lBQ2hHLG9CQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDOUMsaUJBQWlCLENBQUMsQ0FBQztJQUNuQixhQUFhO0lBQ2IsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ3hDO0lBQ0E7SUFDQSxRQUFRLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztJQUN4QixRQUFRLFNBQVMsZUFBZSxHQUFHO0lBQ25DLFlBQVksSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0lBQ3JDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO0lBQy9DLG9CQUFvQixrQkFBa0IsRUFBRSxDQUFDO0lBQ3pDLGlCQUFpQjtBQUNqQjtJQUNBLGdCQUFnQixPQUFPO0lBQ3ZCLGFBQWEsTUFBTTtJQUNuQixnQkFBZ0IsVUFBVSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsRCxhQUFhO0lBQ2IsU0FBUztBQUNUO0lBQ0EsUUFBUSxlQUFlLEVBQUUsQ0FBQztJQUMxQixNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxTQUFTLFNBQVMsRUFBRSxLQUFLLEVBQUU7SUFDaEUsUUFBUSxJQUFJLFVBQVUsR0FBRywrREFBK0QsQ0FBQztJQUN6RixRQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMseUhBQXlILEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM5SyxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxlQUFlLEdBQUcsVUFBVSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUU7SUFDdEUsUUFBUSxlQUFlLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN6RCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxVQUFVLEdBQUcsRUFBRTtJQUNoRCxRQUFRLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3RCxRQUFRLFdBQVcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQy9CLFFBQVEsV0FBVyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUM7SUFDcEMsUUFBUSxXQUFXLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQztJQUNsQyxRQUFRLFdBQVcsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ25DLFFBQVEsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0MsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLFVBQVUsSUFBSSxFQUFFLFdBQVcsRUFBRTtJQUN4RCxRQUFRLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ2pELE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLGVBQWUsR0FBRyxVQUFVLElBQUksRUFBRTtJQUMzQyxRQUFRLE9BQU8sZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzQyxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxVQUFVLElBQUksRUFBRTtJQUMvQyxRQUFRLFFBQVEsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ2pGLE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsSUFBSSxFQUFFO0lBQzVDLFFBQVEsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM3QyxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxZQUFZO0lBQ2pELFFBQVEseUJBQXlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsVUFBVSxhQUFhLEVBQUU7SUFDM0QsUUFBUSxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDcEQsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsVUFBVSxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7SUFDbEYsUUFBUSxPQUFPLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDMUYsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsK0JBQStCLEdBQUcsK0JBQStCLENBQUM7QUFDM0U7SUFDQTtJQUNBLElBQUksSUFBSSxDQUFDLG9CQUFvQixHQUFHLFlBQVk7SUFDNUMsUUFBUSxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0MsTUFBSztBQUNMO0lBQ0E7SUFDQSxJQUFJLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxVQUFVLE9BQU8sRUFBRTtJQUN0RCxRQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUVBQXVFLENBQUMsQ0FBQztJQUM5RixNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQywyQkFBMkIsR0FBRyxVQUFVLE9BQU8sRUFBRTtJQUMxRCxRQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUVBQXVFLENBQUMsQ0FBQztJQUM5RixNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7SUFDbEMsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFDO0FBQ2pDO0lBQ0EsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLFlBQVk7SUFDdkMsUUFBUSxJQUFJLENBQUMsT0FBTyxNQUFNLENBQUMsTUFBTSxLQUFLLFdBQVcsTUFBTSxPQUFPLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLFdBQVcsQ0FBQyxLQUFLLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEtBQUssV0FBVyxDQUFDLEVBQUU7SUFDeEssWUFBWSxNQUFNLENBQUMsMkJBQTJCLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEQ7SUFDQTtJQUNBLFlBQVksTUFBTSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuRSxZQUFZLE1BQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RELFNBQVM7SUFDVCxNQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWTtJQUNyQyxRQUFRO0lBQ1IsWUFBWSxDQUFDLE9BQU8sTUFBTSxDQUFDLE1BQU0sS0FBSyxXQUFXO0lBQ2pELGFBQWEsT0FBTyxNQUFNLENBQUMsMkJBQTJCLENBQUMsS0FBSyxXQUFXLENBQUM7SUFDeEUsYUFBYSxPQUFPLE1BQU0sQ0FBQyxhQUFhLENBQUMsY0FBYyxLQUFLLFdBQVcsQ0FBQztJQUN4RSxVQUFVO0lBQ1YsWUFBWSxNQUFNLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2RCxTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsdUJBQXVCLEdBQUcsVUFBVSxhQUFhLEVBQUU7SUFDNUQsUUFBUSxPQUFPLENBQUMsSUFBSSxDQUFDLHVFQUF1RSxDQUFDLENBQUM7SUFDOUYsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsZ0NBQWdDLEdBQUcsVUFBVSxHQUFHLEVBQUUsUUFBUSxFQUFFO0lBQ3JFLFFBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDO0lBQzlGLE1BQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDakM7SUFDQSxJQUFJLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztBQUNqRDtJQUNBLElBQUksSUFBSSxDQUFDLGlCQUFpQixHQUFHLFlBQVk7SUFDekMsUUFBUSxJQUFJLG1CQUFtQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUM1TTtJQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLEVBQUUsRUFBRTtJQUNyQyxZQUFZLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNsRTtJQUNBO0lBQ0EsWUFBWSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLG1CQUFtQixJQUFJLFNBQVMsSUFBSSxtQkFBbUIsS0FBSyxJQUFJLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMU07SUFDQTtJQUNBLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEc7SUFDQTtJQUNBLFlBQVksSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEcsU0FBUztJQUNULGFBQWE7SUFDYixZQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUNqRCxZQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUNqRCxZQUFZLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUNqRCxTQUFTO0FBQ1Q7SUFDQSxRQUFRLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7SUFDeEQsWUFBWSxJQUFJLENBQUMsT0FBTyxNQUFNLENBQUMsbUJBQW1CLEtBQUssUUFBUSxNQUFNLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsRUFBRTtJQUNsSCxnQkFBZ0IsSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFO0lBQzdGLG9CQUFvQixNQUFNLENBQUMsbUJBQW1CLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDakUsaUJBQWlCO0lBQ2pCLGFBQWE7SUFDYixTQUFTO0lBQ1QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEdBQUcsWUFBWTtJQUMxQyxRQUFRLFVBQVUsQ0FBQyxZQUFZO0lBQy9CLFlBQVksSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN0RCxZQUFZLEtBQUssQ0FBQyxTQUFTLENBQUMseUJBQXlCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25FLFlBQVksTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QztJQUNBLFlBQVksS0FBSyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEQsWUFBWSxLQUFLLENBQUMsU0FBUyxDQUFDLDZCQUE2QixFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2RSxZQUFZLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2QsTUFBSztBQUNMO0lBQ0EsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsRUFBQztBQUNEO0lBQ0EsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxZQUFZO0lBQzNELEVBQUM7QUFDRDtJQUNBLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsWUFBWTtJQUM5RCxFQUFDO0FBQ0Q7SUFDQSxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFlBQVk7SUFDN0QsRUFBQztBQUNEO0lBQ0EsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEdBQUcsVUFBVSxRQUFRLEVBQUU7SUFDcEQsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFDM0I7SUFDQSxJQUFJLElBQUksUUFBUSxFQUFFO0lBQ2xCLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN2QyxLQUFLO0FBQ0w7SUFDQSxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxJQUFJLEVBQUU7SUFDdEMsUUFBUSxRQUFRLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxNQUFNLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUU7SUFDaEYsS0FBSyxDQUFDO0FBQ047SUFDQSxJQUFJLElBQUksQ0FBQyxjQUFjLEdBQUcsVUFBVSxJQUFJLEVBQUUsS0FBSyxFQUFFO0lBQ2pELFFBQVEsT0FBTyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEcsS0FBSyxDQUFDO0FBQ047SUFDQSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxVQUFVLEVBQUU7SUFDM0MsUUFBUSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3BDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0IsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLFVBQVUsQ0FBQyxDQUFDO0lBQzlELFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0csUUFBUSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDekIsS0FBSyxDQUFDO0lBQ04sRUFBQztBQUNEO0lBQ0E7SUFDQTtJQUNBLE1BQU0sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ3pCO0lBQ0E7SUFDQSxNQUFNLENBQUMscUJBQXFCLEdBQUcscUJBQXFCLENBQUM7QUFDckQ7SUFDQSxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUMvQjtJQUNBO0lBQ0EsTUFBTSxDQUFDLHFCQUFxQixHQUFHLG1CQUFtQixDQUFDO0FBQ25EO0lBQ0EsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEU7QUFDQTtJQUNBO0lBQ0EsTUFBTSxDQUFDLGdCQUFnQixHQUFHLFlBQVk7SUFDdEM7QUFDQTtJQUNBLElBQUksU0FBUyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUU7SUFDNUMsUUFBUSxJQUFJLFdBQVcsR0FBRyxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDO0lBQ3pELFFBQVEsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3RCO0lBQ0EsUUFBUSxJQUFJO0lBQ1o7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFlBQVksSUFBSSxXQUFXLEVBQUU7SUFDN0IsZ0JBQWdCLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QyxhQUFhLE1BQU07SUFDbkIsZ0JBQWdCLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO0lBQ2xDLGFBQWE7SUFDYixTQUFTLENBQUMsT0FBTyxNQUFNLEVBQUUsR0FBRztBQUM1QjtJQUNBLFFBQVEsSUFBSSxPQUFPLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDaEQ7SUFDQSxRQUFRLElBQUksT0FBTyxFQUFFO0lBQ3JCLFlBQVksTUFBTSxDQUFDLFFBQVE7SUFDM0IsZ0JBQWdCLE9BQU8sQ0FBQyxPQUFPO0lBQy9CLGdCQUFnQixPQUFPLENBQUMsT0FBTztJQUMvQixnQkFBZ0IsVUFBVSxRQUFRLEVBQUUsT0FBTyxFQUFFO0lBQzdDLG9CQUFvQixJQUFJLFNBQVMsR0FBRztJQUNwQyx3QkFBd0IsY0FBYyxFQUFFO0lBQ3hDLDRCQUE0QixXQUFXLEVBQUUsUUFBUTtJQUNqRCw0QkFBNEIsT0FBTyxFQUFFLE9BQU87SUFDNUMsNEJBQTRCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtJQUNsRCx5QkFBeUI7SUFDekIscUJBQXFCLENBQUM7QUFDdEI7SUFDQSxvQkFBb0IsSUFBSSxXQUFXLEVBQUU7SUFDckMsd0JBQXdCLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzlELHFCQUFxQjtBQUNyQjtJQUNBLG9CQUFvQixJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFO0lBQzNFLHdCQUF3QixLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDakUscUJBQXFCO0lBQ3JCLGlCQUFpQjtJQUNqQixnQkFBZ0IsT0FBTyxDQUFDLFNBQVM7SUFDakMsYUFBYSxDQUFDO0lBQ2QsU0FBUztJQUNULEtBQUs7QUFDTDtJQUNBLElBQUksSUFBSSxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQztJQUM3QyxJQUFJLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNuQixJQUFJLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQztJQUNyQixJQUFJLElBQUksUUFBUSxDQUFDO0FBQ2pCO0lBQ0EsSUFBSSxTQUFTLFFBQVEsR0FBRztJQUN4QixRQUFRLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7SUFDL0IsUUFBUSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3REO0lBQ0EsUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFO0lBQ3ZCLFlBQVksSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFO0lBQzFCLGdCQUFnQixzQkFBc0IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLGFBQWEsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFGLGdCQUFnQixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pELGdCQUFnQixNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzFELGdCQUFnQixNQUFNLENBQUMsSUFBSSxHQUFHLGdCQUFnQixDQUFDO0lBQy9DLGdCQUFnQixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxhQUFhLE1BQU07SUFDbkIsZ0JBQWdCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDeEMsYUFBYTtJQUNiLFNBQVM7QUFDVDtJQUNBLFFBQVEsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUN6QixLQUFLO0FBQ0w7SUFDQSxJQUFJLFNBQVMsYUFBYSxHQUFHO0lBQzdCLFFBQVEsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3RCO0lBQ0EsUUFBUSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNuRCxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEMsU0FBUztBQUNUO0lBQ0EsUUFBUSxJQUFJLFdBQVcsQ0FBQztJQUN4QixRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0lBQzFCO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxZQUFZLE9BQU8sS0FBSyxDQUFDO0lBQ3pCLFNBQVMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxnQkFBZ0IsRUFBRTtJQUNqRDtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQSxZQUFZO0lBQ1osZ0JBQWdCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQztJQUMvQixnQkFBZ0IsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQzNDLGdCQUFnQixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTO0lBQzVDLGNBQWM7SUFDZCxnQkFBZ0IsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QztJQUNBLGdCQUFnQixJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVUsRUFBRTtJQUNuRCxvQkFBb0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6QyxpQkFBaUI7SUFDakIsYUFBYTtJQUNiLFNBQVMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLEVBQUU7SUFDdkM7SUFDQTtJQUNBO0lBQ0E7SUFDQSxZQUFZLElBQUksSUFBSSxHQUFHO0lBQ3ZCLGdCQUFnQixXQUFXLEVBQUUsV0FBVztJQUN4QyxnQkFBZ0IsU0FBUyxFQUFFLEtBQUs7SUFDaEMsZ0JBQWdCLFNBQVMsRUFBRSxNQUFNO0lBQ2pDLGFBQWEsQ0FBQztBQUNkO0lBQ0EsWUFBWSxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVUsRUFBRTtJQUMvQyxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLGFBQWE7SUFDYixTQUFTLE1BQU07SUFDZjtJQUNBO0lBQ0E7SUFDQTtJQUNBLFlBQVksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixTQUFTO0lBQ1QsS0FBSztJQUNMO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7QUFDQTtJQUNBLElBQUksT0FBTyxHQUFHLEVBQUU7SUFDaEIsUUFBUSxJQUFJO0lBQ1osWUFBWSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtJQUM5QyxnQkFBZ0IsUUFBUSxHQUFHLEdBQUcsQ0FBQztJQUMvQixnQkFBZ0IsTUFBTTtJQUN0QixhQUFhO0lBQ2IsU0FBUyxDQUFDLE9BQU8sTUFBTSxFQUFFLEdBQUc7QUFDNUI7SUFDQTtJQUNBLFFBQVEsSUFBSSxHQUFHLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRTtJQUNoQyxZQUFZLE1BQU07SUFDbEIsU0FBUztBQUNUO0lBQ0E7SUFDQSxRQUFRLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3pCLEtBQUs7QUFDTDtJQUNBLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtJQUNuQjtJQUNBLFFBQVEsUUFBUSxFQUFFLENBQUM7SUFDbkIsUUFBUSxHQUFHLENBQUMsUUFBUSxHQUFHLGFBQWEsQ0FBQztJQUNyQyxRQUFRLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEUsS0FBSztJQUNMLEVBQUM7QUFDRDtJQUNBO0FBQ0E7SUFDQTtJQUNBO0lBQ0EsSUFBSSxPQUFPLE1BQU0sQ0FBQyxhQUFhLEtBQUssUUFBUSxLQUFLLE1BQU0sQ0FBQyxhQUFhLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRTtJQUN6RyxJQUFJLE1BQU0sQ0FBQyxhQUFhLEdBQUcsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM1RSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsS0FBSyxlQUFlLE1BQU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEtBQUssV0FBVyxDQUFDLEVBQUU7SUFDaEgsUUFBUSxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDO0lBQ3JFLEtBQUs7SUFDTCxDQUFDO0lBQ0QsS0FBSztJQUNMLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyx1R0FBdUcsQ0FBQyxDQUFDO0lBQzFIOzs7Ozs7In0=
