/*jslint browser: true*/
/*globals define*/

define([
  'jquery',
  'moment-timezone'
], function ($, moment) {
    'use strict';

    var _timestamp,
        _timezone,
        _format,
        _separator,
        _showseconds,
        _hourzero,
        _greetnoon,
        _greetevening,
		_greetMorningMsg,
		_greetAfternoonMsg,
		_greetEveningMsg,
        _mmnt;

    /**
     * Initialize cached elements used throughout the script
    */
    function initCachedElements(clockTmpl) {
        _timestamp      = Number(clockTmpl.data('timestamp'))    || '1171502725';
        _timezone       = clockTmpl.data('timezone')             || 'America/New_York';
        _format         = clockTmpl.data('format')               || 'short';
        _separator      = clockTmpl.data('separator')            || ':';
        _showseconds    = clockTmpl.data('showseconds')          || true;
        _hourzero       = clockTmpl.data('hourzero')             || true;
        _greetnoon      = clockTmpl.data('noon')                 || false;
        _greetevening   = clockTmpl.data('evening')              || false;
        _greetMorningMsg  = clockTmpl.data('morning-greeting')     || 'GOOD MORNING IT IS ';
        _greetAfternoonMsg = clockTmpl.data('afternoon-greeting')  || 'GOOD AFTERNOON IT IS ';
        _greetEveningMsg   = clockTmpl.data('evening-greeting')    || 'GOOD EVENING IT IS ';
    }

    function _getClock() {
        var _clockString = '',
            _seconds = (_showseconds) ? _separator + 'ss' : '',
            _hours = (_hourzero) ? 'hh' : 'h',
            _date = new Date();

        _mmnt = _timezone ? moment.tz(_date, _timezone) : moment(_date);

        switch (_format) {
            case 'long':
                _clockString = _mmnt.format('ddd, DD MMM YYYY h' + _separator + 'mm' + _separator + 'ss');
                break;
            case 12:
                _clockString = _mmnt.format(_hours + _separator + 'mm' + _seconds + ' a');
                break;
            case 'short':
                _clockString = _mmnt.format(_hours + _separator + 'mm' + ' a');
                break;
            default:
                _clockString = _mmnt.format('HH' + _separator + 'mm' + _seconds);
        }

        return getGreetingTime(_mmnt) + ' ' + _clockString;
    }

    function getGreetingTime(m) {
        var g = null; //return g

        if (!m || !m.isValid()) { return; } //if we can't find a valid or filled moment, we return.
        var splitAfternoon = _greetnoon,
            splitEvening = _greetevening,
            currentHour = parseFloat(m.format('HH'));

        if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
            g = _greetAfternoonMsg;
        } else if (currentHour >= splitEvening) {
            g = _greetEveningMsg;
        } else {
            g = _greetMorningMsg;
        }

        return g;
    }

    function startTime(elem) {
        elem.empty().text(_getClock());
        setTimeout(function () {
            startTime(elem);
        }, 500);
    }

    function initClock(_clock) {
        var elem = _clock.find('span');
        startTime(elem);
    }

    $.fn.clock = function () {
        var _clock = $(this);
        initCachedElements(_clock);
        initClock(_clock);
    };
});
