$(document).ready(function () {
    load();
});

function load() {
    $("#product_cnt").focus();

    var input1 = document.getElementById("product_cnt");
    input1.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("input_id").click();
        }
    });

    $("#input_id").click(function () {
        $("#add").empty();
        $("#myTable").empty();
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

    var input2 = document.getElementById('product_id' + cnt);
    input2.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("search_id").click();
            $("#myTable").empty();
        }
    });

    $("#search_id").click(function () {
        $("#myTable").empty();
    });

    document.getElementById('search_id').onclick = function findProduct() {
        var count = document.getElementById('product_cnt').value;
        var product = [];
        var pro_name = "";
        for (var i = 1; i <= count; i++) {
            item_id = 'product_id' + i;
            var tmp = document.getElementById(item_id).value;
            product.push(tmp);
            if (i == 1) {
                pro_name += tmp;
            } else {
                pro_name += ", " + tmp;
            }
        }
        // var result_id = document.getElementById('result_id')
        // alert(product);

        function makeplot() {
            Plotly.d3.csv(
                "https://raw.githubusercontent.com/KellyChen520/programming-project/master/sortedmerged_data.csv",
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
                title: "Monthly Sales of " + pro_name,
                xaxis: {
                    title: {
                        text: 'Month'
                    }
                },
                yaxis: {
                    title: {
                        text: 'Quantity'
                    }
                }
            });

            create_table(combined);
        };
        makeplot();

        function create_table(combined) {
            var t = "";
            t = "<table>" + "<tr>" + "<th> 商品代碼 </th>";
            for (var i = 0; i < combined[0].length; i++) {
                t += "<th>" + combined[0][i] + "</th>"
            }
            t += "<th> Total Sales </th>"
            t += "</tr>";

            for (var i = 0; i < count; i++) {
                var total = 0;
                t += "<tr>" + "<td>" + product[i] + "</td>";
                for (var j = 0; j < combined[0].length; j++) {
                    t += "<td>" + combined[i + 1][j] + "</td>";
                    total += parseInt(combined[i + 1][j]);
                }
                t += "<td>" + total + "</td>";
                t += "</tr>";
            }
            t += "</table>";
            s = "<p class='table_title'>商品每月銷售量與銷售總量</p>"
            $("#myTable").append(s);
            $("#myTable").append(t);
        }
    }
}
