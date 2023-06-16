/**

 Copyright 2023 Harshad Joshi and Bufferstack.IO Analytics Technology LLP, Pune

 Licensed under the GNU General Public License, Version 3.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 https://www.gnu.org/licenses/gpl-3.0.html

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 **/

/** 

 Changelog for SPCNode (Statistical Process Control Node)

 Version 2.0 (June 16, 2023)

 Added
- Introduced a new configurable "Timer" setting that allows users to set the duration (in seconds) before the node goes into an "out of control" state. This functionality is implemented through a timer that starts when an out of control state is detected and stops when the control state is regained. 
- Added error handling to ensure that the payload is a number and provide appropriate feedback if not.

 Improved
- Enhanced the status message to indicate the time that the process has been out of control, based on the new "Timer" setting.

 Version 1.0 (Initial Release)

 Added
- SPCNode for statistical process control in industrial automation processes. 
- Performs a moving range SPC calculation on a stream of individual values.
- Outputs average, upper control limit (UCL), lower control limit (LCL), and a flag indicating if the current value is out of control.


**/

module.exports = function(RED) {
    function SPCNode(config) {
        RED.nodes.createNode(this, config);
        
        var node = this;
        var mR = [];  // Array to hold moving range values
        var samples = [];  // Array to hold input samples
        var sampleCount = 0; // Count of samples
        var limitMultiplier = config.limitMultiplier || 2.66; // Control limit multiplier
        var timer = (config.timer || 60) * 1000; // Timer in milliseconds

        node.on('input', function(msg) {
            try {
                var value = parseFloat(msg.payload);  // Input value
                if (isNaN(value)) {
                    throw new Error('Invalid payload: expected a number');
                }
                samples.push(value);  // Add value to samples array
                
                if(sampleCount > 0) {
                    mR.push(Math.abs(value - samples[sampleCount - 1])); // calculate moving range
                }

                // Calculate average and control limits after 5 samples
                if(sampleCount >= 4) {
                    var avg = samples.reduce((a, b) => a + b, 0) / samples.length;  // Average
                    var mRAvg = mR.reduce((a, b) => a + b, 0) / mR.length; // Moving Range Average
                    var ucl = avg + limitMultiplier * mRAvg;  // Upper Control Limit
                    var lcl = avg - limitMultiplier * mRAvg;  // Lower Control Limit
                    
                    var outOfControl = value > ucl || value < lcl;

                    msg.payload = {
                        value: value,
                        avg: avg,
                        ucl: ucl,
                        lcl: lcl,
                        outOfControl: outOfControl
                    };
                    
                    if (outOfControl) {
                        if (node.tout) clearTimeout(node.tout); // Clear existing timer if any
                        node.tout = setTimeout(function() {
                            node.status({fill:"red",shape:"ring",text:"Potential problem found Out of control for " + (timer / 1000) + " seconds."});
                        }, timer); // Set timer
                    } else {
                        if (node.tout) clearTimeout(node.tout); // Clear timer if outOfControl is false
                        node.status({fill:"green",shape:"dot",text:"In control."});
                    }
                } 

                sampleCount++;
                node.send(msg);
            } catch (err) {
                node.error(err.message);
                node.status({fill:"red",shape:"ring",text: "Error: " + err.message});
            }
        });
        
        this.on('close', function() { 
            if (node.tout) clearTimeout(node.tout); // Clear timer when node is closed
        });
    }
    RED.nodes.registerType("spc", SPCNode);
}

