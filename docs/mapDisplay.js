$('#map >').click(function (event, data) {
    console.log(event.target.id);
    window.location.href = 'info/index.html?state=' + event.target.id;
})


function fade(element) {
    //console.log(element);
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
        /*element.style.position = 'absolute';
        element.style.top = '150px';
        element.style.left = '150px';*/
    }, 10);
}

var children = document.getElementById('map').children;
for (var i = 0; i < children.length; i++) {
    fadeInMap(i);
}
async function fadeInMap(i) {
    setTimeout(function () {
        fade(children[i]);
    }, 15 * i) // change the number x * i to make faster/slower
}




















// $(document).ready(function () {
//     $('#map').usmap({
//         stateStyles: {
//             fill: '#31C48D',
//             stroke: '#ffffff',
//             'stroke-width': 2,
//             'stroke-linejoin': 'round',
//         },
//         stateHoverStyles: {
//             fill: '#279d71',
//             stateHoverAnimation: 300, //time in ms
//         },
//         stateSpecificStyles: {
//             // we could potentially preselect the location they are in, then use this paremeter to style it.
//         },
//         showLabels: false // Turn this on for the labels of small states like rhode island or something
//     });
//     $('#map').on('usmapclick', function (event, data) {
//         console.log(data.name);
//         window.location.href = 'info/index.html?state=' + data.name;
//         // DATA.NAME returns two letter state code
//     });
// });