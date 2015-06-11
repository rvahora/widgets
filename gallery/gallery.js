/*jslint browser: true*/
/*jshint camelcase: false*/
/*jscs:disable requireCamelCaseOrUpperCaseIdentifiers*/
/*globals define*/

define([
  'jquery',
  'slick'
], function ($) {
    'use strict';

    var imgsPerPage = 10,
        categoriesPerPage = 4,
        timeOutId,
        isTablet = false,
        portrait = false;

    function launchFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    function cancelFullscreen() {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    function getCategoriesOnPage(items, page, reverseLogic) {
        var pageStart = (page - 1) * categoriesPerPage,
            pageEnd = (categoriesPerPage * page) - 1;

        return items.filter(function (index) {
            return reverseLogic ? index < pageStart || index > pageEnd : index >= pageStart && index <= pageEnd;
        });
    }

    function getItemsOnPage(items, page, reverseLogic) {
        var pageStart = (page - 1) * imgsPerPage,
            pageEnd = (imgsPerPage * page) - 1;

        return items.filter(function (index) {
            return reverseLogic ? index < pageStart || index > pageEnd : index >= pageStart && index <= pageEnd;
        });
    }

    /*
     * Display the first gallery
     */
    function _initFirstGallery(gl) {
        gl.find('.category-list li:first').click();
    }

    /*
     *  Initialize all the gallery for the categories
     */
    function _initGallerySlick(widget, defaults) {
        var _options = {},
        _imageOptions = {
            infinite: defaults.infinite || widget.data('infinite'),
            centerMode: defaults.centerMode || widget.data('centermode'),
            autoplay: defaults.autoplay || widget.data('autoplay'),
            autoplaySpeed: defaults.autoplaySpeed || widget.data('autoplayspeed'),
            slidesToShow: defaults.slidesToShow || widget.data('slidestoshow'),
            slidesToScroll: defaults.slidesToScroll || widget.data('slidestoscroll'),
            cssEase: defaults.cssEase || widget.data('cssease'),
            prevArrow: '<div class="slick-prev show-for-medium-up"><i class="icon-chevron-left"></i></div>',
            nextArrow: '<div class="slick-next show-for-medium-up"><i class="icon-chevron-right"></i></div>',
            responsive: [
                {
                    breakpoint: 320,
                    settings: {
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1
                    }
                },
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: 1
                    }
                },
            ]
        },
        _videoOptions = {
            centerMode: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            cssEase: defaults.cssEase || widget.data('cssease'),
        },
        elem = $('.active-gallery')[0];

        /*
         *  Initialize slick
         */
        widget.find('.gallery-wrapper').each(function () {
            if ($(this).data('type') === 'video') {
                _options = _videoOptions;
            } else {
                _options = _imageOptions;
            }

            $(this).slick(_options);
            _options = {};

            if ($(this).data('type') !== 'video') {
                $(this).append('</div><div class="slick-fullscreen show-for-medium-up"><i class="icon-maximize"></i></div>');
            } else {
                $(this).find('.slick-prev').hide();
                $(this).find('.slick-next').hide();
                $(this).find('.slick-track').addClass('remove-top-margin');
            }

            $(this).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                var currSlide = $(slick.$slides[currentSlide]),
                    nextSlide = $(slick.$slides[nextSlide]),
                    srcData = currSlide.find('embed').attr('src');

                currSlide.removeClass('slick-center-active');
                nextSlide.addClass('slick-center-active');
                currSlide.find('embed').attr('src', '');
                currSlide.find('embed').attr('src', srcData);
            });

            $(this).find('.slick-fullscreen').on('click', function () {
                widget.find('.active-gallery').toggleClass('fullscreen');
                $(this).find('i').toggleClass('icon-minimize');
                $(this).find('i').toggleClass('icon-maximize');

                if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                    cancelFullscreen();
                } else {
                    launchFullscreen($('.active-gallery')[0]);
                }
            });
            widget.find('.gallery-loader').hide();
        });
    }

    function initWidgetOptions(gl) {
        var glImages = gl.find('.active-gallery-images'),
            catList = gl.find('.category-list'),
            numItems = glImages.find('[data-source]').length,
            numCategories = catList.find('[data-target]').length;

        glImages.find('.image-list-page').text('1 OF ' + Math.ceil(numItems / imgsPerPage));
        gl.find('.category-list-page').text('1 OF ' + Math.ceil(numCategories / categoriesPerPage));
    }

    $.fn.gallery = function (options) {
        var widget = $(this),
            gl = widget.find('.gl'),
            glDropDown = widget.find('.gallery-dropdown'),
            gallery,
            galleryType,
            lastImage;

        if (options === undefined) {
            options = {};
        }

        /**
        * Show a particular page of gallery items
        *
        * @param  {int} page The page number of gallery items to show
        */
        function showPage(page) {
            var glImages = gl.find('.active-gallery-images'),
                pageText = glImages.find('.image-list-page').text().split(' '),
                lastPage = parseInt(pageText[pageText.length - 1], imgsPerPage),
                items = glImages.find('[data-source]'),
                shownItems = getItemsOnPage(items, page),
                hiddenItems = getItemsOnPage(items, page, true),
                numItemsToFade = hiddenItems.length;

            if (page === 1) {
                glImages.find('.image-list-navigation.previous').addClass('disabled');
            } else {
                glImages.find('.image-list-navigation.previous').removeClass('disabled');
            }

            if (page === lastPage) {
                glImages.find('.image-list-navigation.next').addClass('disabled');
            } else {
                glImages.find('.image-list-navigation.next').removeClass('disabled');
            }

            hiddenItems.fadeOut(function () {
                if (--numItemsToFade > 0) {
                    // only proceed if this is the last item to fade out
                    return;
                }

                pageText[0] = page;
                glImages.find('.image-list-page').text(pageText.join(' '));
                shownItems.fadeIn();
            });
        }

        /**
        * Show a particular page of gallery items
        *
        * @param  {int} page The page number of gallery items to show
        */
        function showCategories(page) {
            var catList = gl.find('.category-list'),
                pageText = catList.find('.category-list-page').text().split(' '),
                lastPage = parseInt(pageText[pageText.length - 1], categoriesPerPage),
                items = catList.find('[data-target]'),
                shownItems = getCategoriesOnPage(items, page),
                hiddenItems = getCategoriesOnPage(items, page, true),
                numItemsToFade = hiddenItems.length;

            if (page === 1) {
                catList.find('.category-list-navigation.previous').addClass('disabled');
            } else {
                catList.find('.category-list-navigation.previous').removeClass('disabled');
            }

            if (page === lastPage) {
                catList.find('.category-list-navigation.next').addClass('disabled');
            } else {
                catList.find('.category-list-navigation.next').removeClass('disabled');
            }

            hiddenItems.fadeOut(function () {
                if (--numItemsToFade > 0) {
                    // only proceed if this is the last item to fade out
                    return;
                }

                pageText[0] = page;
                catList.find('.category-list-page').text(pageText.join(' '));
                shownItems.fadeIn();
            });
        }

        /*
         *  Page navigation for the gallery items
         */
        gl.on('click', '.image-list-navigation:not(.disabled)', function (e) {
            e.preventDefault();

            var btn = $(this),
                glImages = gl.find('.active-gallery-images'),
                pageText = btn.siblings('.image-list-page').text(),
                currPage = parseInt(pageText.split(' ')[0], imgsPerPage),
                nextPage = btn.hasClass('next') ? ++currPage : --currPage,
                items = glImages.find('[data-source]'),
                shownItems = getItemsOnPage(items, nextPage);

            showPage(nextPage);
        });

        gl.on('click', '.image-list-navigation.disabled', function (e) {
            e.preventDefault();
        });

        /*
         *  Page navigation for the gallery items
         */
        gl.on('click', '.category-list-navigation:not(.disabled)', function (e) {
            e.preventDefault();

            var btn = $(this),
                glImages = gl.find('.category-list'),
                pageText = btn.siblings('.category-list-page').text(),
                currPage = parseInt(pageText.split(' ')[0], categoriesPerPage),
                nextPage = btn.hasClass('next') ? ++currPage : --currPage,
                items = glImages.find('[data-target]'),
                shownItems = getCategoriesOnPage(items, nextPage);

            showCategories(nextPage);
        });

        gl.on('click', '.category-list-navigation.disabled', function (e) {
            e.preventDefault();
        });

        /*
         * Getting Thumbnails for the video
         */

        gl.find('.gallery-image-list .gl-img').each(function () {
            var img = $(this).find('img'),
                vdoId = $(this).data('source'),
                thumb,
                str;

            if (vdoId !== '') {
                if (parseInt(vdoId) > 0) {
                    $.getJSON('http://www.vimeo.com/api/v2/video/' + $(this).data('source') + '.json?callback=?', {format: 'json'}, function (data) {
                        img.attr('src', data[0].thumbnail_medium);
                    });
                } else {
                    str = vdoId.split('=');
                    thumb = 'http://img.youtube.com/vi/' + str[str.length - 1] + '/0.jpg';
                    img.attr('src', thumb);
                }
            }
        });

        /*
         *  adding the thumbnails to the category list
         */
        gl.find('.category-list li').each( function () {
            gallery = $(this).data('target');
            galleryType = $(this).data('type');

            gl.find('.gallery-image-list').each(function () {
                if ($(this).data('gallery-images') === gallery) {
                    lastImage = $(this).find('img').last().attr('src');
                }
            });

            $(this).find('img').attr('src' , lastImage);
        });

        /*
         *  adding the thumbnails to the category list for the mobile
         */
        glDropDown.find('.category-list li').each( function () {
            gallery = $(this).data('target');

            widget.find('.gallery-image-list').each(function () {
                if ($(this).data('gallery-images') === gallery) {
                    $(this).find('img').each( function () {
                        lastImage = $(this).attr('src');
                    });
                }
            });

            $(this).find('img').attr('src' , lastImage);
        });

        glDropDown.find('.gl-dropdown-btn').on('click', function () {
            glDropDown.find('.category-list').toggle();
            $(this).addClass('gl-dropdown-btn-clicked');
        });

        function resetVideos() {
            //  resetting all video iframe src
            widget.find('.gl-img iframe').each( function () {
                var src = $(this).attr('src');

                $(this).attr('src', '');
                $(this).attr('src', src);
            });
        }

        /*
         * Load Category Gallery
         */

        function loadGallery(currentGallery) {
            gallery = $(currentGallery).data('target');
            $(currentGallery).addClass('active').siblings().removeClass('active');

            widget.find('.gallery-wrapper').each(function () {
                if ($(this).data('gallery') === gallery) {
                    $(this).addClass('active-gallery');
                } else {
                    $(this).removeClass('active-gallery');
                    $(this).hide();
                }
            });

            widget.find('.active-gallery').fadeIn();

            widget.find('.active-gallery .gl-img').each( function () {
                $(this).on('click' , function () {
                    $(this).addClass('slick-center').siblings().removeClass('slick-center');
                    $('.active-gallery').slick('slickGoTo', parseInt($(this).data('slick-index')));
                });
            });

            widget.find('.gallery-image-list').each(function () {
                if ($(this).data('gallery-images') === gallery) {
                    $(this).fadeIn().siblings().hide();
                    $(this).addClass('active-gallery-images');
                } else {
                    $(this).removeClass('active-gallery-images');
                }
            });

            gl.find('.active-gallery-images .gl-img').each( function () {
                $(this).on('click' , function () {
                    $('.active-gallery').slick('slickGoTo', parseInt($(this).index()));
                });
            });

            widget.find('.active-gallery-images .gl-img:first').click();
            widget.find('.gallery-loader').hide();
        }

        /*
         *  category list onclick event
         */
        widget.find('.gl .category-list li').on('click', function () {
            //  resetting all video iframe src
            resetVideos();

            widget.find('.gallery-loader').show();
            widget.find('.activeg-allery').fadeOut();
            loadGallery(this);
            initWidgetOptions(gl);
            showPage(1);
        });

        widget.find('.gallery-dropdown .category-list li').on('click', function () {
            //  resetting all video iframe src
            resetVideos();

            widget.find('.gallery-loader').show();
            widget.find('.activeg-allery').fadeOut();
            glDropDown.find('.gl-dropdown-btn').html($(this).html());
            glDropDown.find('.category-list').hide();
            loadGallery(this);

            if ($(this).data('type') === 'video') {
                widget.find('.gl .image-sidebar').removeClass('show-for-medium-up');
            } else {
                widget.find('.gl .image-sidebar').addClass('show-for-medium-up');
            }

            $(this).removeClass('active');
            glDropDown.find('.gl-dropdown-btn').removeClass('gl-dropdown-btn-clicked');
        });

        /*
         *  Initializing the first slick
         */

        $(document).ready( function () {
            function doneResizing(isTab, port) {
                if (isTab) {
                    if (port) {
                        imgsPerPage = 6;
                    } else {
                        imgsPerPage = 8;
                    }
                } else {
                    imgsPerPage = 10;
                }

                gl.find('.category-list li.active').click();
            }

            $( window ).resize(function () {
                clearTimeout(timeOutId);

                if ($( window ).width() >= 768 && $( window ).width() <= 1024) {
                    isTablet = true;

                    if (window.innerHeight > window.innerWidth) {
                        //console.log('Portrait');
                        portrait = true;
                    } else {
                        //console.log('Landscape');
                        portrait = false;
                    }
                    timeOutId = setTimeout(doneResizing(isTablet, portrait), 500);
                } else {
                    isTablet = false;
                }
            });
            $( window ).resize();
        });

        _initGallerySlick(widget , options);
        _initFirstGallery(glDropDown);
        _initFirstGallery(gl);
        initWidgetOptions(gl);
        showPage(1);
        showCategories(1);
    };
});
