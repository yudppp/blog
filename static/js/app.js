var ctx = $("#canvas").get(0).getContext("2d");
var data = [
    {
        value: 52,
        color:"#f1e05a",
        highlight: "#fcea60",
        label: "JavaScript"
    },
    {
        value: 24,
        color: "#375eab",
        highlight: "#3a6ab0",
        label: "Golang"
    },
    {
        value: 26,
        color: "#555555",
        highlight: "#5a5a5a",
        label: "others"
    }
]

var chart = new Chart(ctx).Doughnut(data,{});
