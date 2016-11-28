let changingField = null;
let oldVal = null;

$(function() {
    initTabs();
    initTables();
    initKeys();
    initQueries();
    initTriggers();
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
            }).first().click();
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
                tr += '<td><button class="delete">-</button></td>';
                tr += '</tr>';
                $table.append(tr);
            }
            tr = '<tr>';
            for (let key in data[0]) {
                tr += '<td class="changing"><input type="text"></td>';
            }
            tr += '<td><button class="insert">+</button></td>';
            $table.append(tr);
            $('.table td').on('dblclick', function() {
                let $this = $(this);
                if (!changingField) {
                    if ((!$this.is('.table > tr > td:first-child') || $('.sidenav-item.active').text() == 'Z_CUSTOMERTOUR') 
                        && (!$this.is('.table tr > td:last-child')) && (!$this.is('.table > tr:last-child td'))) {
                        let text = $this.text();
                        $this.empty();
                        $this.append('<input type="text" value="' + text + '">');
                        $this.find('> input').focus().select();
                        changingField = $this;
                        oldVal = text;
                        $this.addClass('changing');
                    }
                }
            });
            $('.table .insert').on('click', function() {
                let table = $('.sidenav-item.active').text();
                let data = {};
                $('.table > tr:last > td.changing').each(function(index) {
                    data[$('.table > tr:first > th').eq(index).text()] = $(this).find('input').val();
                });
                $.post('insert.php', { 'data': data, 'table': table }, function(data) {
                        if (data['error']) {
                            alert(data['message']);
                        } else {
                            fetchTable(table);
                            if (table == 'N_VISIT') {
                                if (data != 1 && data != 2 && data != '') {
                                    alert(data);
                                }
                            }
                        }
                }, 'json');
            });
            $('.table .delete').on('click', function() {
                if (confirm('Are you sure that you want to delete this row?')) {
                    let id = $(this).parent().parent().find('> td:first').text();
                    let idColumn = $('.table > tr:first > th:first').text();
                    let table = $('.sidenav-item.active').text();
                    $.post('delete.php', { 'id': id, 'table': table, 'id-column': idColumn }, function(response) {
                        if (response['error']) {
                            alert(response['message']);
                        } else {
                            fetchTable(table);
                        }
                    }, 'json');
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
                            if (table == 'N_VISIT') {
                                if (data != 1 && data != 2 && data != '') {
                                    alert(data);
                                }
                            }
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
    changingField.removeClass('changing');
    changingField = null;
    oldVal = null;
}

function initQueries() {
    $('.q1').val('select * from patient where ID in (select distinct patient_id from visit where visit.VISIT_DATE=str_to_date(?,' + "'" + 'dd-mm-yyyy' + "'" + '))');
    $('.q2').val('select * from n_patient where ID not in (select distinct patient_id from n_visit where doctor_id is not null)');
    $('.q3').val('select EXTRACT(month from visit_date) as month, sum(price) as sum ' + 
            'from visit where EXTRACT(year from visit_date) = ? ' + 
              'group by EXTRACT(month from visit_date)' + 
              ' ORDER BY MONTH');
    $('.execute').on('click', function() {
        $('.result').empty();
        $('.error').empty();
        let queryName = $(this).parent().find('h4').text();
        let query = $(this).parent().find('textarea').val();
        if ($(this).hasClass('e1')) {
            query = 'select * from n_patient where ID in (select distinct patient_id from n_visit ' 
                +'where n_visit.VISIT_DATE=to_date(' + "'" + $('.qq1').val() + "'" + ', ' + "'" + 'dd-mm-yyyy' + "'" + '))';
        }
        if ($(this).hasClass('e3')) {
            query = 'select EXTRACT(month from visit_date) as month, sum(price) as sum '+ 
            'from n_visit where EXTRACT(year from visit_date) = ' + $('.qq3').val() + ' ' + 
              'group by EXTRACT(month from visit_date) '+ 
              ' ORDER BY MONTH';
        }
        $.post('query.php', { 'query': query }, function(data){
            if (data['error']) {
                $('.error').append('<h3>' + queryName + ' Error</h3>').append(data['message']);
            } else {
                let $result = $('.result');
                $result.empty();
                $result.append('<h3>' + queryName + ' Result</h3>');
                if (data != 2) {
                    let tr = '<tr>';
                    for (let key in data[0]) {
                        tr += '<th>' + key + '</th>';
                    }
                    tr += '</tr>';
                    $result.append(tr);
                    for (let i = 0; i < data.length; i++) {
                        tr = '<tr>';
                        for (let key in data[i]) {
                            tr += '<td>' + data[i][key] + '</td>';
                        }
                        tr += '</tr>';
                        $result.append(tr);
                    }
                }
            }
        }, 'json');
    });
}

function initTriggers() {
    fetchTriggers();
}

function fetchTriggers() {
    $.post('triggers.php', function(data){
        if (data['error']) {
            alert(data['message']);
        } else {
            let $triggers = $('.triggers');
            $triggers.empty();
            let tr = '<tr>';
            for (let key in data[0]) {
                tr += '<th>' + key + '</th>';
            }
            tr += '</tr>';
            $triggers.append(tr);
            for (let i = 0; i < data.length; i++) {
                tr = '<tr>';
                for (let key in data[i]) {
                    tr += '<td>' + data[i][key] + '</td>';
                }
                let buttonText = data[i]['STATUS'] == 'ENABLED' ? 'Turn Off' : 'Turn On';
                tr += '<td><button class="turn">' + buttonText + '</button></td>';
                tr += '<td><button class="view-body">View Body</button></td>';
                tr += '</tr>';
                $triggers.append(tr);
            }
        }
        $('.turn').on('click', function() {
            let trigger = $(this).parent().parent().find('td').first().text();
            let needTo = $(this).parent().parent().find('td').eq(2).text() == 'ENABLED' ? 'DISABLE' : 'ENABLE';
            $.post('trigger_on_off.php', { 'need-to': needTo, 'trigger': trigger }, function(data) {
                if (data['error']) {
                    alert(data['message']);
                } else {
                    fetchTriggers();
                }
            }, 'json');
        });
        $('.view-body').on('click', function() {
            let trigger = $(this).parent().parent().find('td').first().text();
            $.post('trigger_body.php', { 'trigger': trigger }, function(data) {
                if (data['error']) {
                    alert(data['message']);
                } else {
                    $triggerBody = $('.trigger-body');
                    $triggerBody.empty();
                    $triggerBody.append('<h3>' + trigger + ' BODY</h3>');
                    $triggerBody.append(data[0]['TRIGGER_BODY'].replace(/\n/g, '<br>'));
                }
            }, 'json');
        });
    }, 'json');
}