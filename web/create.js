$(document).ready(function () {
    load();
});

function load() {

    $("#input_id").click(function () {
        $("#add").empty();
        $("#ask").empty();
        $("#myDiv").empty();
        $("#myTable").empty();
        var form = document.getElementById("form_name");
        for (var i = 0; i < 2; i++) {
            if (form.classify[i].checked) {
                var c = form.classify[i].value;
                // alert(c);
            }
        }

        create_choices(c);
    });
}

function create_choices(c) {
    if (c == "one") {
        var ask_cnt = "<span>欲顯示趨勢圖的商品個數 : </span><input type='text' id='product_cnt'><span> </span> <button id='input_cnt' type='button' class='bt bt1'>輸入</button>";
        $("#ask").append(ask_cnt);

        var input1 = document.getElementById("product_cnt");
        input1.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("input_cnt").click();
            }
        });

        document.getElementById('input_cnt').onclick = function findProduct() {
            $("#add").empty();
            var cnt = document.getElementById('product_cnt').value;
            // alert(cnt);
            create_control(cnt);
        }
    } else {
        function get_brand() {
            Plotly.d3.csv(
                "https://raw.githubusercontent.com/KellyChen520/programming-project/master/SKU2BRAND%20ver5.csv",
                function (data) {
                    // console.log(data);
                    var all_brand = [];
                    var ask_brand = "<p>請選擇品牌 (商品編號頭兩碼)：</p>   <select name='brand' id='b' class='sel'>";
                    var d = 0
                    while (data[d]['NotRepeat'].length != 0) {
                        row = data[d];
                        all_brand.push(row['NotRepeat']);
                        ask_brand += "<option value=" + all_brand[d] + ">" + all_brand[d] + "</option>";
                        d = d + 1;
                    }

                    ask_brand += "</select> <button id='input_brand' type='button' class='bt bt1'>搜尋</button>";
                    // alert(ask_brand);
                    $("#ask").append(ask_brand);
                    document.getElementById('input_brand').onclick = function findBrand() {
                        $("#myTable").empty();
                        var choosen_brand = $('#b').val();
                        // alert(choosen_brand);
                        var brand_item = [];
                        // alert(data.length)
                        for (var i = 0; i < data.length; i++) {
                            row = data[i];
                            if (row['Brand'] == choosen_brand) {
                                brand_item.push(row['SKU']);
                            } 
                        }
                        //  alert(brand_item);
                        var brand_cnt = brand_item.length;
                        // alert(brand_cnt);
                        brand_list(brand_item, brand_cnt, choosen_brand);
                    }
                });
        };
        get_brand();

    }
}

function brand_list(brand_item, brand_cnt, choosen_brand) {
    Plotly.d3.csv(
        "https://raw.githubusercontent.com/KellyChen520/programming-project/master/sort_by_sum%20(1027).csv",
        function (allRows) {
            var combined = new Array(brand_cnt + 2);
            for (var i = 0; i < brand_cnt + 2; i++) {
                combined[i] = new Array(allRows.length).fill(0);
            }
            // console.log(combined)
            // alert(choosen_brand)
            for (var i = 0; i < allRows.length; i++) {
                row = allRows[i];
                for (var j = 0; j < brand_cnt + 1; j++) {
                    if (j == 0) {
                        combined[j][i] = row['HDATE'];
                    } else {
                        // alert(product[j - 1]);
                        combined[j][i] = row[brand_item[j - 1]];
                    }
                }
            }
            var brand_name = "brand " + choosen_brand;

            Plotly.d3.csv(
                "https://raw.githubusercontent.com/KellyChen520/programming-project/master/brand_total_sales%20ver5.csv",
                function (eachBrand) {
                    for (var i = 0; i < eachBrand.length; i++) {
                        row = eachBrand[i];
                        combined[brand_cnt + 1][i] = row[choosen_brand];

                    }
                    makePlotly(combined, brand_cnt + 1, brand_item, brand_name);
                })


        });
    // makePlotly(combined);
    // alert(combined);
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
                "https://raw.githubusercontent.com/KellyChen520/programming-project/master/sort_by_sum%20(1027).csv",
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
            makePlotly(combined, count, product, pro_name);
        }
        makeplot();
    }
}

function makePlotly(combined, count, product, pro_name) {
    // var plotDiv = document.getElementById("plot");
    // alert(count)
    var all_data = [];
    for (var i = 1; i <= count; i++) {
        if (i != count) {
            var temp = {
                x: combined[0],
                y: combined[i],
                name: product[i - 1]
            };
        } else {
            if (pro_name.indexOf('brand') == -1) {
                var temp = {
                    x: combined[0],
                    y: combined[i],
                    name: product[i - 1]
                };
            } else {
                var temp = {
                    x: combined[0],
                    y: combined[i],
                    name: pro_name
                };
            }
        }

        all_data.push(temp);
    }
    // console.log(all_data);
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

    create_table(combined, count, product, pro_name);
};

function create_table(combined, count, product, pro_name) {
    var t = "";
    t = "<table>" + "<tr>" + "<th> 商品代碼 </th>";
    for (var i = 0; i < combined[0].length; i++) {
        t += "<th>" + combined[0][i] + "</th>"
    }
    t += "<th> Total Sales </th>"
    t += "</tr>";

    for (var i = 0; i < count; i++) {
        var total = 0;
        if (i != count - 1) {
            t += "<tr>" + "<td>" + product[i] + "</td>";
            for (var j = 0; j < combined[0].length; j++) {
                if (Number.isNaN(parseInt(combined[i + 1][j])) == false) {
                    // console.log(parseInt(combined[i + 1][j]))
                    t += "<td>" + combined[i + 1][j] + "</td>";
                    total += parseInt(combined[i + 1][j]);
                } else {
                    t += "<td> </td>";
                }
            }
        } else {
            if (pro_name.indexOf('brand') == -1) {
                t += "<tr>" + "<td>" + product[i] + "</td>";
            } else {
                t += "<tr>" + "<td>" + pro_name + "</td>";
            }
            for (var j = 0; j < combined[0].length; j++) {
                // console.log(combined[i + 1][j]);
                if (Number.isNaN(parseInt(combined[i + 1][j])) == false) {
                    // console.log(parseInt(combined[i + 1][j]))
                    t += "<td>" + combined[i + 1][j] + "</td>";
                    total += parseInt(combined[i + 1][j]);
                } else {
                    t += "<td> </td>";
                }
            }
        }

        t += "<td>" + total + "</td>";
        t += "</tr>";
    }
    t += "</table>";
    s = "<p class='table_title'>商品每月銷售量與銷售總量</p>"
    $("#myTable").append(s);
    $("#myTable").append(t);
};
