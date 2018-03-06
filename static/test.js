initiateChart = function () {
    var ctx = document.getElementById('theChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'horizontalBar',

    // The data for our dataset

        data: {
            labels: ["Users online at Twidder", "Messages sent to you", "Messages you have sent"],
            datasets: [
                {
                label: "Your statistics!",
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(235, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                data: [0, 0, 0],
            }]
        },

    // Configuration options go here
        options: {
            animations : true,
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: 20
                    }
                }]
            }
        }
    });


    setInterval(function() {
            var charUpdateSend = new Object();
            charUpdateSend.id = "chartUpdate";
            charUpdateSend.token = localStorage.getItem("token");
            connection.send(JSON.stringify(charUpdateSend));
        }, 300);
};

updateChart = function (online, recieved, sent) {
    chart.data.datasets[0].data[0] = online;
    chart.data.datasets[0].data[1] = recieved;
    chart.data.datasets[0].data[2] = sent;
    chart.update();
};

// -----------------------------

var ctx2 = document.getElementById('theChartTwo').getContext('2d');
    chart2 = new Chart(ctx2, {
        type: 'bar',

        data: {
            labels: ["... recieved", "... sent"],
            datasets: [{
                label: "Messages",
                data: [0, 0],
                backgroundColor: ['rgba(51,204,51,0.8)', 'rgba(204,153,0,0.8)']
            }]
        },
        options: {
            animations : true,
            title: {
                display: true,
                text: "Number of messages that you have..."
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: 0,
                        stepSize: 5
                    }
                }]
            }
        }
    });