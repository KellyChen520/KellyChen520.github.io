$(document).ready(function () {
    load();
});

function load() {
    $("#product_cnt").focus();

    $("#input_id").click(function () {
        $("#add").empty();
        var cnt = $("#product_cnt").val();

        if (cnt > 0) {
            create_control(cnt);
        }
    });
}

function create_control(cnt) {
    var tbl = "";
    var i = 0;
    for (i = 1; i <= cnt; i++) {
        index = '商品代碼' + i + ' : ';
        p_id = 'product_id' + i;
        tbl += "<span>" + index + "</span>" + "<input type='text' id=" + p_id + "><br />"
    }
    tbl += "<button id='search_id' class='bt bt1'>搜尋</button>"
    $("#add").append(tbl);

    document.getElementById('search_id').onclick = function findProduct() {
        var count = document.getElementById('product_cnt').value
        var product = [];
        for (var i = 1; i <= count; i++) {
            item_id = 'product_id' + i;
            var tmp = document.getElementById(item_id).value
            product.push(tmp);
        }
        // var result_id = document.getElementById('result_id')
        // alert(product);

        function makeplot() {
            Plotly.d3.csv(
                "https://raw.githubusercontent.com/KellyChen520/programming-project/master/data_sorted.csv",
                function (data) {
                    processData(data);
                });
        };

        function processData(allRows) {
            console.log(allRows);
            count = parseInt(count);
            var combined = new Array(count + 1);
            for (var i = 0; i < count + 1; i++) {
                combined[i] = new Array(allRows.length).fill(0);
            }
            // console.log(combined)
            for (var i = 0; i < allRows.length; i++) {
                row = allRows[i];
                for (var j = 0; j < count + 1; j++) {
                    if (j == 0) {
                        combined[j][i] = row['HDATE'];
                    } else {
                        // alert(product[j - 1]);
                        combined[j][i] = row[product[j - 1]];
                    }
                }
            }

            makePlotly(combined);
        }

        function makePlotly(combined) {
            // var plotDiv = document.getElementById("plot");
            var all_data = [];
            for (var i = 1; i <= count; i++) {
                var temp = {
                    x: combined[0],
                    y: combined[i],
                    name: product[i - 1]
                };
                all_data.push(temp);
            }
            // alert(all_data);
            Plotly.newPlot('myDiv', all_data, {
                title: "Trend of " + product
            });
        };
        makeplot();
    }
}