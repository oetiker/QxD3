/**
 * This is the main application class of the d3 demo
 *
 */
qx.Class.define("qxd3.demo.Application",
{
    extend : qx.application.Standalone,

    /*
    *****************************************************************************
       MEMBERS
    *****************************************************************************
    */
    members :
    {
        /**
         * This method contains the initial application code and gets called
         * during startup of the application
         *
         * @lint ignoreDeprecated(alert)
         */
        main : function()
        {
            this.base(arguments);
            if (qx.core.Environment.get("qx.debug"))
            {
                qx.log.appender.Native;
                qx.log.appender.Console;
            }
            var d3Obj = this.makeGearDemo();
            var win = new qx.ui.window.Window('D3 Gear Demo').set(
            {
                width : 300,
                height : 300
            });
            win.setLayout(new qx.ui.layout.Grow());
            win.addListener('appear', function() {
                win.center()
            });
            win.add(d3Obj);
            win.open();
        },
        makeGearDemo : function()
        {
            var d3Obj = new qxd3.Svg();
            var svgRoot = d3Obj.getD3SvgNode();
            var d3 = d3Obj.getD3();
            d3Obj.addCssRule('path',
                {
                    fillRule : 'evenodd',
                    stroke : '#333',
                    strokeWidth : '1px'
                }
            );
            d3Obj.addCssRule(".sun path", {
                    fill : '#6baed6'
                }
            );
            d3Obj.addCssRule(".planet path", {
                    fill : '#9ecae1'
                }
            );
            d3Obj.addCssRule(".annulus path", {
                    fill : '#c6dbef'
                }
            );
            var width = 500, height = 500, radius = 80, x = Math.sin(2 * Math.PI / 3), y = Math.cos(2 * Math.PI / 3);
            var offset = 0, speed = 4, start = Date.now();
            var svg = svgRoot.attr("viewBox", "0 0 " + width + " " + height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(.55)").append("g");
            var frame = svg.append("g").datum( {
                radius : Infinity
            });
            frame.append("g").attr("class", "annulus").datum(
            {
                teeth : 80,
                radius : -radius * 5,
                annulus : true
            }).append("path").attr("d", gear);
            frame.append("g").attr("class", "sun").datum(
            {
                teeth : 16,
                radius : radius
            }).append("path").attr("d", gear);
            frame.append("g").attr("class", "planet").attr("transform", "translate(0,-" + radius * 3 + ")").datum(
            {
                teeth : 32,
                radius : -radius * 2
            }).append("path").attr("d", gear);
            frame.append("g").attr("class", "planet").attr("transform", "translate(" + -radius * 3 * x + "," + -radius * 3 * y + ")").datum(
            {
                teeth : 32,
                radius : -radius * 2
            }).append("path").attr("d", gear);
            frame.append("g").attr("class", "planet").attr("transform", "translate(" + radius * 3 * x + "," + -radius * 3 * y + ")").datum(
            {
                teeth : 32,
                radius : -radius * 2
            }).append("path").attr("d", gear);
            function gear(d)
            {
                var n = d.teeth, r2 = Math.abs(d.radius), r0 = r2 - 8, r1 = r2 + 8, r3 = d.annulus ? (r3 = r0, r0 = r1, r1 = r3, r2 + 20) : 20, da = Math.PI / n, a0 = -Math.PI / 2 + (d.annulus ? Math.PI / n : 0), i = -1, path = ["M", r0 * Math.cos(a0), ",", r0 * Math.sin(a0)];
                while (++i < n)path.push("A", r0, ",", r0, " 0 0,1 ", r0 * Math.cos(a0 += da), ",", r0 * Math.sin(a0), "L", r2 * Math.cos(a0), ",", r2 * Math.sin(a0), "L", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0), "A", r1, ",", r1, " 0 0,1 ", r1 * Math.cos(a0 += da / 3), ",", r1 * Math.sin(a0), "L", r2 * Math.cos(a0 += da / 3), ",", r2 * Math.sin(a0), "L", r0 * Math.cos(a0), ",", r0 * Math.sin(a0));

                path.push("M0,", -r3, "A", r3, ",", r3, " 0 0,0 0,", r3, "A", r3, ",", r3, " 0 0,0 0,", -r3, "Z");
                return path.join("");
            }
            d3.timer(function()
            {
                var angle = (Date.now() - start) * speed, transform = function(d) {
                    return "rotate(" + angle / d.radius + ")";
                };
                frame.selectAll("path").attr("transform", transform);
                frame.attr("transform", transform); /* frame of reference */
            });
            return d3Obj;
        }

    }
});
