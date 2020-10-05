module.exports = {
    name: 'chart',
    description: 'testing chart.js',
    execute(message){
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
var gbp_data = [250, 260, 270, 0, 10, 30, 200, 300]
var labels = []
var counter = 0
for(var i in gbp_data){
    labels.push(counter)
    counter++
}
(async (gbp_data, labels) => {
    const ImageDataURI = require('image-data-uri');
    const Discord = require('discord.js')
    const configuration = {
        type: 'line',
        data: {
            labels: [0,1,2,3,4],
            datasets: [{
            label: 'GBP',
            data: [1,2,3,4,5],
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
})();
    }
}