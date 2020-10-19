module.exports = {
    name: 'chart',
    description: 'testing chart.js',
    execute(message, args, master, stats_list, tracker){
    var gbp_data = master[message.author.id].historical_gbp.day
    var labels = []
    for(var i = gbp_data.length; i > 0; i--){
        labels.push(i - 1)
    }
    Chart(gbp_data, labels, message)
    }
}

async function Chart(gbp_data, labels, message){
    const ImageDataURI = require('image-data-uri');
    const Discord = require('discord.js')
    const chart = require('chart.js')
    const {CanvasRenderService} = require('chartjs-node-canvas');

    const width = 400;
    const height = 400;

    const chartCallback = (ChartJS) => {

        // Global config example: https://www.chartjs.org/docs/latest/configuration/
         ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
        // Global plugin example: https://www.chartjs.org/docs/latest/developers/plugins.html
         ChartJS.plugins.register({
            // plugin implementation
        });
        // New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
        ChartJS.controllers.MyType = ChartJS.DatasetController.extend({
            // chart implementation
        });
    };

    const canvas = new CanvasRenderService(width, height, chartCallback);

    //console.log(gbp_data)
    //console.log(labels)
    const configuration = {
        type: 'line',
        data: {
            labels: labels,//[0,1,2,3,4],
            datasets: [{
            label: 'GBP',
            data: gbp_data,//[1,2,3,4,5],
            backgroundColor: '#22aa99'
            }/*, {
            label: 'Traffic tickets',
            data: [0, 2],
            backgroundColor: '#994499'
            }*/]
        },
        options: {
            responsive: false,
            legend: {
            position: 'right'
            },
            scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
            }
        }
    };
     const dataUrl = await canvas.renderToDataURL(configuration).then(dataUrl => ImageDataURI.outputFile(dataUrl, 'chart.png').then(() => 
        {
            var image = new Discord.Attachment('chart.png');
            message.channel.send(image)
        }))
}