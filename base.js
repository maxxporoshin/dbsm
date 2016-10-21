$(function() {
    initTabs();
});

function initTabs() {
    $('')
    $('.tab-tables').on('click', function() {
        $('.tab').removeClass('active');
        $(this).addClass('active');
        $('.content').hide();
        $('.content-tables').show();
    });

    $('.tab-queries').on('click', function() {
        $('.tab').removeClass('active');
        $(this).addClass('active');
        $('.content').hide();
        $('.content-queries').show();
    });

    $('.tab-triggers').on('click', function() {
        $('.tab').removeClass('active');
        $(this).addClass('active');
        $('.content').hide();
        $('.content-triggers').show();
    });
}