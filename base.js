$(function() {
    initTabs();
    initTables();
});

function initTabs() {
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

function initTables() {
    $.post('init.php', function(data) {
        $sidenav = $('.sidenav');
        for (i = 0; i < data.length; i++) {
            $sidenav.append('<div class="sidenav-item">' + data[i] + '</div>');
        }
        $('.sidenav-item').on('click', function() {
        $('.sidenav-item').removeClass('active');
        $this = $(this);
        $this.addClass('active');
        fetchTable($this.text());
    });
    }, 'json');
}

function fetchTable(name) {
    $.post('table.php', { 'name': name }, function(data) {
        $table = $('.table');
        $table.empty();
        for (i = 0; i < data.length; i++) {
            $table.append('<tr>');
            for (let key in data[i]) {
                $table.append('<td>' + data[i][key] + '</td>');
            }
            $table.append('</tr>');
        }
    }, 'json');
}