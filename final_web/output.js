$(document).ready(function () {
    load();
});

function load() {
    summary_table();
}

function summary_table(){
    $.ajax({
        type: "GET",
        url: "sum summary.csv",
        dataType: "text",
        success: function(data) {process_data(data);}
    });
}

function process_data(data){
    var allRows = data.split(/\r?\n|\r/);
    var table = '<table>';
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
      if (singleRow === 0) {
        table += '<thead>';
        table += '<tr>';
      } else {
        table += '<tr>';
      }
      var rowCells = allRows[singleRow].split(',');
      for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
        if (singleRow === 0) {
          table += '<th>';
          table += rowCells[rowCell];
          table += '</th>';
        } else {
          table += '<td>';
          table += rowCells[rowCell];
          table += '</td>';
        }
      }
      if (singleRow === 0) {
        table += '</tr>';
        table += '</thead>';
        table += '<tbody>';
      } else {
        table += '</tr>';
      }
    } 
    table += '</tbody>';
    table += '</table>';
    $("#summary").append(table);



    create_choice();
}

function create_choice() {
    Plotly.d3.csv(
        "https://raw.githubusercontent.com/KellyChen520/programming-project/master/sum%20prediction%20top%2010%20(5).csv",
        function (data) {
            var all_name = [];
            var ask_name = "<p>請選擇欲預覽的商品貨號：</p>   <select name='brand' id='n' class='sel'>";
            var d = 0
            while (data[d]['name'].length != 0) {
                row = data[d];
                all_name.push(row['name']);
                ask_name += "<option value=" + all_name[d] + ">" + all_name[d] + "</option>";
                d = d + 1;
            }

            ask_name += "</select> <button id='input_name' type='button' class='bt bt1'>搜尋</button>";
            // alert(ask_name);
            $("#ask").append(ask_name);
            document.getElementById('input_name').onclick = function finditem(){
                var choosen_name = $('#n').val();
                var name_pre = []
                var pre_cnt = 0
                for (var i = 0; i < data.length; i++) {
                    row = data[i];
                    if (row[choosen_name] != ''){
                        name_pre.push(row[choosen_name]);
                        pre_cnt = pre_cnt + 1;
                    }else {
                        break;
                    }
                    //alert(row[choosen_name]);
                }
                name_pic(choosen_name, name_pre, pre_cnt);
            }
        });
}

function name_pic(choosen_name, name_pre, pre_cnt){
    Plotly.d3.csv("https://raw.githubusercontent.com/KellyChen520/programming-project/master/data.csv",
    function (allRows) {
        var original = new Array(2);
        for (var i = 0; i < 2; i++) {
            original[i] = new Array(allRows.length).fill(0);
        }
        var predict = new Array(2);
        for (var i = 0; i < 2; i++) {
            predict[i] = new Array(pre_cnt).fill(0);
        }
        
        // j = 0 -> date, j = 1 -> original or predict
        var start = allRows.length - pre_cnt;
        //alert(start);
        for (var i = 0; i < allRows.length; i++) {
            row = allRows[i];
            for (var j = 0; j < 2; j++) {
                if (j == 0) {
                    original[j][i] = row['date'];
                } else {
                    original[j][i] = row[choosen_name];
                }
            }
        }
        for (var i = 0; i < pre_cnt; i++) {
            row = allRows[i + start];
            for (var j = 0; j < 2; j++) {
                if (j == 0) {
                    predict[j][i] = row['date'];
                } else {
                    predict[j][i] = name_pre[i];
                }
            }
        }
        
        makePlotly(original, predict, choosen_name);
    });

}

function makePlotly(original, predict, choosen_name) {
    var trace1 = {
        x: original[0],
        y: original[1],
        name: "original",
        mode: 'lines'
    }

    var trace2 = {
        x: predict[0],
        y: predict[1],
        name: "forcasting",
        mode: 'lines'
    }
    
    var all_data = [trace1, trace2];
    Plotly.newPlot('myDiv', all_data, {
        title: "Sales of " + choosen_name,
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
}


////////////////////////////////////////////////////////////////////
