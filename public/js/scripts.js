// Scripts UOC
jQuery(document).ready(function ($) {

    function calculoWidth() {
        $('.js-width').each(function () {
            var width = $(this).width();
            $(this).find(".js-width-final").width(width)
        });
    }
    
    function removeSticky(){
        if ($(window).width() < 768) {
            $(".js-removeSticky").removeClass("sticky");
        }
    }
    
    //collapse
    function collapse(){

        $('.js-collapseClick').on('click', function () {

            if ($(this).closest('.js-collapse').hasClass('js-sub')){

                if ($(this).closest('.js-collapse').siblings().hasClass('show')) {
                    $(this).closest('.js-collapse').siblings().removeClass('show');
                    $(this).attr('aria-expanded', 'false');


                } else {
                    $('.js-sub .js-collapseClick').attr('aria-expanded', 'false');
                    $('.js-sub').siblings().removeClass('show');
                    $(this).closest('.js-sub').siblings().addClass('show');
                    $(this).attr('aria-expanded', 'true');
                }


            }else{

                if ($(this).closest('.js-collapse').siblings().hasClass('show')) {
                    $(this).closest('.js-collapse').siblings().removeClass('show');
                    $(this).attr('aria-expanded', 'false');


                } else {
                    $(this).closest('.js-collapse-group').find('.js-collapseClick').attr('aria-expanded', 'false');
                    $(this).closest('.js-collapse-group').find('.js-collapse').siblings().removeClass('show');
                    $(this).closest('.js-collapse').siblings().addClass('show');
                    $(this).attr('aria-expanded', 'true');
                }
            }

           
            
            
        });
      

    }

    if($('.js-collapseAll').length > 0) {
        $('.js-collapseAll').on('click', function(e) {
            e.preventDefault();
            // console.log($(this).parent().find('a').html())
            $(this).parent().siblings().find('a').attr('aria-expanded', 'false');

            if($(this).siblings().hasClass('show')) {
                $(this).parent().siblings().children().removeClass('show');
                $(this).parent().siblings().children().find('input').prop("checked", false);
            }


        })
    }


    if($('.tag-list').length > 0) {
        $('.tag-list').on('click', 'li', function() {
            $(this).toggleClass('active');
        })
    }

    if($('.tag-icons').length > 0) {
        $('.tag-icons').on('click', 'li', function() {
            $(this).toggleClass('select-icon');
        })
    }

    calculoWidth();
    removeSticky();
    collapse();
    
    $(window).on('resize', function () {
        calculoWidth();
        removeSticky();
        collapse();
    });

    //Smooth anchor click scroll
    $('.hero-section__scroll a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top
            }, 1000);
        
    });
    

    $('.filters-main__box').on('click', '.tab', function() {
        var $this = $(this).closest('.filters-main__box');
        if(!$this.hasClass('box-green-selected')) {
            $this.addClass('box-green-selected');
            $this.siblings().removeClass('box-green-selected');
            $('.filters-main__content').removeClass('hidde-content');
        } else {
            $this.removeClass('box-green-selected');
            $this.siblings().removeClass('box-green-selected');
            $('.filters-main__content').addClass('hidde-content');
        }
    });

    if($('.sticky-sidebar').length > 0) {

        if($(window).width() > 992) {
            var sticky = new Sticky('.toStick');
        }
    }
    //     setTimeout(function() {
    //         $('a[href=' + '"' + window.location.hash + '"' + ']').click();
    //         console.log($('a[href=' + '"' + window.location.hash + '"' + ']'))
    //     }, 1000);

    if($('.list-vist').length > 0) {
        $('.js-List a').on('click', function(e) {
            e.preventDefault();
            $('.js-Column').removeClass('active');
            $('.js-List').addClass('active');
            $('.js-changeVist').find('.row:first-child .col-xs-12').removeClass('col-md-4');
            $('.js-changeVist').addClass('change-to-list');
        })

        $('.js-Column a').on('click', function(e) {
            e.preventDefault();
            $('.js-Column').addClass('active');
            $('.js-List').removeClass('active');
            $('.js-changeVist').find('.row:first-child .col-xs-12').addClass('col-md-4');
            $('.js-changeVist').removeClass('change-to-list');
        })
    }

    // $(".js-deleteFilters").on('click', function() {

    //     $('.collapse-filter').find('input').prop('checked', false)
    // });

    $('.js-displayMobile').on('click', function () {
        $('.collapse').toggleClass('show');
        $('.general-filter').toggleClass('show');
        $(this).parent().parent().toggleClass('show-p') 
    });

    var url = document.location.toString();
    if (url.match('#')) {
        $('.ficha-detail a[href="#' + url.split('#')[1] + '"]').addClass('is-active');
        $('.ficha-detail a[href="#' + url.split('#')[1] + '"]').parent().siblings().children().removeClass('is-active');

        $('#' + url.split('#')[1]).addClass('is-active');
        $('#' + url.split('#')[1]).siblings().removeClass('is-active');
    } 

    // Change hash for page-reload
    $('.nav-tabs a').on('shown.bs.tab', function (e) {
        window.location.hash = e.target.hash;
    })

    if($('.filters-mobile').length > 0) {
        $('.filters-mobile').on('click', function(e) {
            e.preventDefault();
            console.log($(this).parent().parent().find('input'))
            $(this).parent().parent().parent().find('input').prop("checked", false);
        })
    }
});
