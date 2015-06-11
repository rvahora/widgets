/*jslint browser: true*/
/*globals define*/

define([
  'jquery'
], function ($) {
    'use strict';

    function initAccordion(accordion, speed) {
        // hide all tabs but the first
        accordion.find('li:not(:first) .content').hide();

        // initialize accordion change
        accordion.on('click', 'a.title', function (e) {
            var title = $(this), // clicked title
            content = title.next(); // content that will be toggled

            e.preventDefault(); // keep has out of the url
            $(this).toggleClass('active');

            // if clicked panel is visible, hide it
            if (content.is(':visible')) {
                content.slideUp(speed);

            // if clicked panel is not visible, hide the current panel and show this one
            } else {
                accordion.find('.content:visible').slideUp(speed);
                content.slideDown(speed);
            }
        });
    }

    $.fn.accordion = function () {
        $(this).each(function () {
            var elem = $(this),
            speed = elem.data('speed');

            initAccordion(elem, speed);
        });
    };
});
