var data = {"temp":[], "hr":[], "time": []};
var source = null;
var sel_var = "null";


function connect(){
    if(source != null) source.close();
    source = new EventSource('http://192.168.4.1/events');
    source.addEventListener('open', function(e) {
        console.log("Connected to ESP32");
    }, false);

    source.addEventListener('connection', function(e) {
        console.log("Received init message");
    }, false);

    source.addEventListener('error', function(e) {
        if (e.target.readyState != EventSource.OPEN) {
            console.log("Events Disconnected");
        }
    }, false);

    source.addEventListener('status', function(e) {
        console.log(e.data);
        getData(e.data);
        if(sel_var !== "null") update_graph();
    }, false);
}

connect();

var $loading = $('#spinner-div').hide();
$(document).ajaxStart(function() {
    $loading.show();

}).ajaxStop(function() {
    $loading.hide();
});

window.onresize = update_graph;

function getData(response) {
    if(response == null || response === ""){
        console.log("JSON was undefined");
        return;
    }
    let json = JSON.parse(response);
    $("#hr").html(json["hr"]+"%");
    $("#temp").html(json["temp"]+"°C");
    data["hr"].push(json["hr"]);
    data["temp"].push(json["temp"]);
    data["time"].push(json["time"]/1000.0);
}

$("#inputGroupSelect02").change(function() {
    sel_var = $(this).val();
    if(sel_var !== "null") update_graph();
});

$("#graph-nav").click(function() {
    $("#graph-container").removeClass("d-none");
    $("#data-container").addClass("d-none");
    $("#home-nav").removeClass("active");
    $("#graph-nav").addClass("active");
    update_graph();
});

$("#home-nav").click(function() {
    $("#graph-container").addClass("d-none");
    $("#data-container").removeClass("d-none");
    $("#home-nav").addClass("active");
    $("#graph-nav").removeClass("active");
});

function update_graph(){
    let trace1 = {
        x : data["time"],
        y : data[sel_var],
        mode: 'lines+markers',
    };
    trace1 = [trace1];
    Plotly.newPlot('main', trace1);
}

