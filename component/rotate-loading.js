
// TODO add -webkit-transform;


$(function () {
    var 


    var circular = $('.outer').eq(0);
    var circular2 = $('.outer.another');
    var loader = $('.inner');

    var circularOneStart = 0;
    var circularOneDest = -360;

    var circularOneOpacStart = 0;
    var circularOneOpacEnd = 0.2;

    var circularOneScale = 4;
    var circularOneScaleEnd = 1;

    var rotateOne = function () {

        circular.velocity({
            opacity: [circularOneOpacEnd, circularOneOpacStart],
            scale: [circularOneScaleEnd, circularOneScale],
            rotateZ: [circularOneDest, circularOneStart]
        }, {
            duration: 2500,
            easing: 'ease',
            // delay: 100,
            complete: function (elements) {

                var tmp = circularOneDest;
                circularOneDest = circularOneStart;
                circularOneStart = tmp;

                tmp = circularOneScale;
                circularOneScale = circularOneScaleEnd;
                circularOneScaleEnd = tmp;

                tmp = circularOneOpacEnd;
                circularOneOpacEnd = circularOneOpacStart;
                circularOneOpacStart = tmp;

                rotateOne();
            }
        });
    };
    rotateOne();


    var c2Opac = 0, c2OpacEnd = 0.1;
    var c2Scale = 4, c2ScaleEnd = 1;
    // var c2Rotate = 0, c2RotateMid = 90, c2RotateEnd = -360;

    var c2Rotate1 = [90, 0];
    var c2Rotate2 = [-360, 90];
    var c2Rotate = c2Rotate1;

    var rotateAnother = function () {

        circular2.velocity({
            opacity: [c2OpacEnd, c2Opac],
            scale: [c2ScaleEnd, c2Scale],
            // rotateZ: [c2RotateMid, c2Rotate]
            rotateZ: c2Rotate
        }, {
            duration: 2500,
            easing: 'ease',
            // delay: 100,
            complete: function (elements) {
                var tmp = c2Opac;
                c2Opac = c2OpacEnd;
                c2OpacEnd = tmp;

                tmp = c2Scale;
                c2Scale = c2ScaleEnd;
                c2ScaleEnd = tmp;

                c2Rotate = c2Rotate[0] === 90 ? c2Rotate2 : c2Rotate1;

                rotateAnother();
            }
        });
    };



    setTimeout(rotateAnother, 1000);


    var innerOpac = 0, innerOpacEnd = 0.5;

    var rotateInner = function () {

        loader.velocity({
            opacity: [innerOpacEnd, innerOpac],
            rotateZ: "+=75" 
        }, {
            duration: 300,
            delay: 200,
            easing: 'ease',
            complete: function (elements) {
                var tmp = innerOpac;
                innerOpac = innerOpacEnd;
                innerOpacEnd = tmp;

                rotateInner();
            }
        });
    };

    rotateInner();
});
