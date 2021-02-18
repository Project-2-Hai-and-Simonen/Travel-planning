
window.addEventListener('load', async (event) => {
  const forcastData = (await window.axios.get(`${window.location.pathname}/7days`)).data.temps7Days;

  const ctx = document.getElementById("tempChart").getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: forcastData.days,
      datasets: [{ 
          data: forcastData.tempsDay,
          label: "Day",
          borderColor: "#3e95cd",
          backgroundColor: "#7bb6dd",
          fill: false,
        },
        { 
          data: forcastData.tempsNight,
          label: "Night",
          borderColor: "#3cba9f",
          backgroundColor: "#71d1bd",
          fill: false,
        },
      ]
    },
    options: {
      responsive: true,
      legend: {
          position: 'left',
          labels: {
              fontColor: "white",
              boxWidth: 20,
              padding: 20
          }
      }
  }
  });
  
  // generating the elements for week-list

  const ul = document.getElementById("week-list");
  forcastData.days_letters.forEach((day, index) => {
    // index = Number(index);
    let status = (index === 0) ? "active" : "";
    const div = document.createElement('div');
    div.innerHTML = `
    <li class="${status}">
      <img class="day-icon" src="${forcastData.icons[index]}" alt="${forcastData.weathers[index]}">
      <span class="day-name">${day}</span>
      <span class="day-temp">${Math.round(forcastData.tempsNight[index])}°C</span>
    </li>
    `;
    ul.appendChild(div.children[0]);
  });
});







// var canvas = document.getElementById("canvas");

// // Apply multiply blend when drawing datasets
// var multiply = {
//   beforeDatasetsDraw: function(chart, options, el) {
//     chart.ctx.globalCompositeOperation = 'multiply';
//   },
//   afterDatasetsDraw: function(chart, options) {
//     chart.ctx.globalCompositeOperation = 'source-over';
//   },
// };

// // Gradient color - this week
// var gradientThisWeek = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
// gradientThisWeek.addColorStop(0, '#5555FF');
// gradientThisWeek.addColorStop(1, '#9787FF');

// // Gradient color - previous week
// var gradientPrevWeek = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
// gradientPrevWeek.addColorStop(0, '#FF55B8');
// gradientPrevWeek.addColorStop(1, '#FF8787');

// var config = {
//     type: 'line',
//     data: {
//         labels: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN", "MON"],
//         datasets: [
//           {
//               label: 'Temperature',
//               data: [18, 26, 14, 22, 12, 20, 12, 18, 10],
//               fill: false,
//               borderColor: 'rgba(255, 255, 255, 0.2)',
//               borderWidth: 2,
//               pointBackgroundColor: 'transparent',
//               pointBorderColor: '#FFFFFF',
//               pointBorderWidth: 3,
//               pointHoverBorderColor: 'rgba(255, 255, 255, 0.2)',
//               pointHoverBorderWidth: 10,
//               lineTension: 0,
//           }
//         ]
//     },
//     options: {
//     	responsive: false,
//       elements: { 
//         point: {
//           radius: 6,
//           hitRadius: 6, 
//           hoverRadius: 6 
//         } 
//       },
//       legend: {
//         display: false,
//       },
//       tooltips: {
//       	backgroundColor: 'transparent',
//         displayColors: false,
//         bodyFontSize: 14,
//         callbacks: {
//           label: function(tooltipItems, data) { 
//             return tooltipItems.yLabel + '°C';
//           }
//         }
//       },
//       scales: {
//         xAxes: [{
//           display: false,
//         }],
//         yAxes: [{
//           display: false,
//           ticks: {
//             beginAtZero: true,
//           },
//         }]
//       }
//     },
//     plugins: [multiply],
// };

// window.chart = new Chart(canvas, config);