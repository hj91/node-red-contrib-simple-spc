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



module.exports = function(RED) {
    function SPCNode(config) {
        RED.nodes.createNode(this, config);
        
        var node = this;
        var mR = [];  // Array to hold moving range values
        var samples = [];  // Array to hold input samples
        var sampleCount = 0; // Count of samples
        var limitMultiplier = config.limitMultiplier || 2.66; // Control limit multiplier

        node.on('input', function(msg) {
            var value = parseFloat(msg.payload);  // Input value
            samples.push(value);  // Add value to samples array
            
            if(sampleCount > 0) {
                mR.push(Math.abs(value - samples[sampleCount - 1])); // calculate moving range
            }

            // Calculate average and control limits after 5 samples
            if(sampleCount > 4) {
                var avg = samples.reduce((a, b) => a + b, 0) / samples.length;  // Average
                var mRAvg = mR.reduce((a, b) => a + b, 0) / mR.length; // Moving Range Average
                var ucl = avg + limitMultiplier * mRAvg;  // Upper Control Limit
                var lcl = avg - limitMultiplier * mRAvg;  // Lower Control Limit
                
                msg.payload = {
                    value: value,
                    avg: avg,
                    ucl: ucl,
                    lcl: lcl,
                    outOfControl: value > ucl || value < lcl
                };
            } 

            sampleCount++;
            node.send(msg);
        });
    }
    RED.nodes.registerType("spc",SPCNode);
}

