"use strict";

function MyDataTable(data) {
    var page = 1;
    var pageSize = 5;

    var dt = this;

    this.init = function () {

        var dge = function (el) {
            return document.getElementById(el);
        };

        var buff = '<table>' +
            '<tr class="orderBy">' +
            '<th' + (dt.sortBy === 'id' ? ' class="current d' + dt.sortDir + '"' : '') + '>id</th>' +
            '<th' + (dt.sortBy === 'title' ? ' class="current d' + dt.sortDir + '"' : '') + '>title</th>' +
            '<th' + (dt.sortBy === 'amount' ? ' class="current d' + dt.sortDir + '"' : '') + '>amount</th>' +
            '<th' + (dt.sortBy === 'cost' ? ' class="current d' + dt.sortDir + '"' : '') + '>cost</th>' +
            '</tr>';

        buff += '<tr style="display: none" id="newRow">' +
            '<td><input type="text" id="new_id"></td>' +
            '<td><input type="text" id="new_title"></td>' +
            '<td><input type="text" id="new_amount"></td>' +
            '<td><input type="text" id="new_cost"></td>' +
            '<td><button id="addRecord">Добавить</button>' +
            '</tr>';

        // Посчитать сумму:
        var sum = 0;
        for (var i = 0; i < data.length; i++) {
            sum += data[i].amount * data[i].cost;
        }

        // Вывести текущую страницу результатов:
        var from = (page - 1) * pageSize;
        var to = from + pageSize;
        if (to > data.length) {
            to = data.length;
        }

        for (i = from; i < to; i++) {
            buff += '<tr>' +
                '<td>' + data[i].id + '</td>' +
                '<td>' + data[i].title + '</td>' +
                '<td>' + data[i].amount + '</td>' +
                '<td>' + data[i].cost + '</td>' +
                '</tr>';
        }
        buff += '</table>';
        buff += '<div>Итоговая сумма: ' + sum + '</div>';

        // Пагинация
        buff += '<div>Страница: ';
        for (i = 0; i < data.length / pageSize; i++) {
            buff += '<button class="setPage' + (i + 1 === page ? ' currentPage' : '') + '">' + (i + 1) + '</button> ';
        }
        buff += '</div>';

        // Выгрузить:
        buff += '<button id="add">Добавить</button> ';
        buff += '<button id="export">Выгрузить</button>';

        dge('container').innerHTML = buff;

        dge('add').onclick = function () {
            dge('newRow').style.display = 'table-row';
        };

        dge('export').onclick = function () {
            dge('modalText').innerHTML = JSON.stringify(data);
            dge('myModal').style.display = 'block';
        };

        dge('addRecord').onclick = function () {
            var newObject = {
                id: dge('new_id').value,
                title: dge('new_title').value,
                amount: dge('new_amount').value,
                cost: dge('new_cost').value
            };
            data.unshift(newObject);
            page = 1;
            dt.init();
        };

        // Сортировка:
        var sortLink = document.querySelectorAll('.orderBy th');
        for (i = 0; i < sortLink.length; i++) {
            sortLink[i].addEventListener('click', function (event) {
                var sortBy = event.target.innerHTML;
                dt.sortDir = 1 - dt.sortDir;

                if (dt.sortBy === sortBy) {
                } else {
                    dt.sortDir = 1;
                }
                dt.sortBy = sortBy;

                if (sortBy === 'title') {
                    data.sort(function (a, b) {
                        return a[sortBy] > b[sortBy];
                    });
                } else {
                    data.sort(function (a, b) {
                        return a[sortBy] - b[sortBy];
                    });
                }

                if (!dt.sortDir) {
                    data.reverse();
                }
                page = 1;
                dt.init();
            });
        }

        var pagerLink = document.querySelectorAll('.setPage');
        for (i = 0; i < pagerLink.length; i++) {
            pagerLink[i].addEventListener('click', function (event) {
                page = Number(event.target.innerHTML);
                dt.init();
            });
        }

    };
    this.init();
}
