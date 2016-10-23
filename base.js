let changingField = null;
let oldVal = null;

$(function() {
    initTabs();
    initTables();
    initKeys();
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
        if (data['error']) {
            alert(data['message']);
        } else {
            let $sidenav = $('.sidenav');
            for (let i = 0; i < data.length; i++) {
                $sidenav.append('<div class="sidenav-item">' + data[i] + '</div>');
            }
            $('.sidenav-item').on('click', function() {
                $('.sidenav-item').removeClass('active');
                let $this = $(this);
                $this.addClass('active');
                fetchTable($this.text());
            });
        }
    }, 'json');
}

function fetchTable(name) {
    $.post('table.php', { 'name': name }, function(data) {
        if (data['error']) {
            alert(data['message']);
        } else {
            let $table = $('.table');
            $table.empty();
            let tr = '<tr>';
            for (let key in data[0]) {
                tr += '<th>' + key + '</th>';
            }
            tr += '</tr>';
            $table.append(tr);
            for (let i = 0; i < data.length; i++) {
                tr = '<tr>';
                for (let key in data[i]) {
                    tr += '<td>' + data[i][key] + '</td>';
                }
                tr += '</tr>';
                $table.append(tr);
            }
            $('.table td').on('dblclick', function() {
                let $this = $(this);
                if (!changingField) {
                    let text = $this.text();
                    $this.empty();
                    $this.append('<input type="text" value="' + text + '">');
                    $this.find('> input').focus().select();
                    changingField = $this;
                    oldVal = text;
                }
            });
        }
    }, 'json');
}

function initKeys() {
    $(document).keydown(function(e) {
        if (changingField) {
            if (e.which == 13) { //enter
                let table = $('.sidenav-item.active').text();
                let id = changingField.parent().find('> td:first').text();
                let idColumn = $('.table > tr:first > th:first').text();
                let index =  changingField.index();
                let column = $('.table > tr:first > th').eq(index).text();
                let newVal = changingField.find('> input').val();
                $.post('update.php', { 'table': table, 'id': id, 'id-column': idColumn, 
                    'column': column, 'new': newVal }, function(data) {
                        if (data['error']) {
                            alert(data['message']);
                            cancelEditing();
                        } else {
                            changingField = null;
                            oldVal = null;
                            fetchTable(table);
                    }
                }, 'json');
            }
            if (e.which == 27) { //esc
                cancelEditing();
            }
        } 
    });
}

function cancelEditing() {
    changingField.empty();
    changingField.text(oldVal);
    changingField = null;
    oldVal = null;
}